import Controller from "./database/controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import patientSessionController from "./patientSessionController.js";
import sessionController from "./sessionController.js";
import { cpf as cpfLib } from "cpf-cnpj-validator";
import Decode from "../utils/tokenDecode.js";

dotenv.config();
const patientSessionDB = new patientSessionController();
const sessionDB = new sessionController();
class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }

  async Create(request, response) {
    //
    // Prisma doesn't support @unique parameter on Mongodb yet,
    // so, I have to do it manually
    //
    const { cpf } = request.body;
    if (!cpfLib.isValid(cpf))
      return response.send({ error: true, message: "cpf invald format" });

    // Serach params, find by cpf on patient database
    const data = {
      where: {
        cpf,
      },
    };

    // Find it
    const user = await super.GetOne(data);
    if (user.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (user.data)
      return response.send({ error: true, message: "cpf already exist" });

    // If cpf received isn't associated any user, contiune to create a new user
    const { name, birthday } = request.body;
    const params = {
      data: { name, birthday: new Date(birthday), cpf },
    };
    const newuser = await super.Create(params);

    return this.Login(request, response);
  }

  async Update(request, response) {
    //
    // For security reasons, compare id received on parameters with id stored on token
    // this way, i garant that user has permission do to this changes.
    // auth.js middleware already checked signature of token, now, just decode hash
    //
    const { id } = Decode(request.headers);
    if (!id)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    // If all ok, continue to aply changes
    const { name, cpf, birthday } = request.body;

    if (!cpfLib.isValid(cpf))
      return response.send({ error: true, message: "cpf invald format" });

    const params = {
      where: {
        id,
      },
      data: {
        name,
        cpf,
        birthday,
      },
    };
    const update = await super.Update(params);
    if (update.error)
      return response.send({ error: true, message: "Can't apply changes" });

    return response.send({ message: "updated" });
  }

  async Delete(request, response) {
    //
    // For security reasons, compare id received on parameters with id stored on token
    // this way, i garant that user has permission do to this changes.
    // auth.js middleware already checked signature of token, now, just decode hash
    //
    const { auth_session } = request.cookies;
    const token = jsonwebtoken.decode(auth_session);
    const { id } = request.params;
    const tokenId = token.id;

    if (!(id === tokenId))
      return response.send({ error: true, message: "unauthorized" });

    const params = {
      where: {
        id,
      },
    };

    const deletion = await super.Delete(params);

    return response.send({ ...deletion });
  }

  async Login(request, response) {
    //
    // Seach user by cpf
    //
    const { cpf } = request.body;
    const data = {
      where: {
        cpf,
      },
    };
    const user = await super.GetOne(data);
    if (user.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (!user.data)
      return response.send({ error: true, message: "cpf doesn't exist" });

    // If find it, create a payload to generate the cookie token
    const { id, name, birthday } = user.data;
    const client = {
      id,
      name,
      cpf,
      birthday,
    };

    // Generate hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    return response.send({ token });
  }

  async PatientSessions(request, response) {
    const { id } = Decode(request.headers);
    if (!id)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    const data = {
      where: {
        id,
      },
      include: {
        patient_session: {
          include: {
            Session: {
              include: {
                clinic: true,
              },
            },
          },
        },
      },
    };
    const search = await super.GetOne(data);

    return response.send({ ...search.data });
  }

  async SessionInclude(request, session, response) {
    //
    // The system was projected allow two patients per session
    //
    if (session.count >= 2)
      return response.send({ error: true, message: "This session is full" });

    // Now, generate association params to add user on session
    const sessionId = session.id;
    const { id } = Decode(request.headers);
    const params = {
      data: {
        Session: {
          connect: { id: sessionId },
        },
        Patient: {
          connect: { id: id },
        },
      },
    };

    // Create a new patientSession
    const userSession = await patientSessionDB.Create(params);
    if (userSession.error)
      return response.send({
        error: true,
        message: "Unable to server connect",
      });

    // Update session

    const sessionParams = {
      where: {
        id: session.id,
      },
      data: {
        count: session.count + 1,
      },
    };

    console.log(sessionParams);
    const sessionUpdate = await sessionDB.Update(sessionParams);

    return response.send({ ...userSession.data });
  }

  async SessionCreate(request, response) {
    const { date, time, clinicId } = request.body;
    //
    // The system was projected to allow twenty attendaces per day
    //

    // Attendance time
    const begin = new Date(date + " " + process.env.START + " GMT");
    const end = new Date(date + " " + process.env.END + " GMT");

    // date time received
    const ndate = new Date(date + " " + time + " GMT");
    // Check limits
    if (!(ndate >= begin && ndate <= end))
      return response.send({
        error: "date out of attendances limits",
        begin: begin,
        end: end,
        ndate: ndate,
      });

    // Generate creation params
    const params = {
      data: {
        date: ndate,
        count: 0,
        clinic: {
          connect: { id: clinicId },
        },
      },
    };

    const session = await sessionDB.Create(params);
    if (session.error)
      return response.send({
        error: true,
        message: "Unable to server connect",
      });

    return await this.SessionInclude(request, session.data, response);
  }

  async SessionNew(request, response) {
    //
    // First, check if already exist a session with same date
    //
    const { date, time } = request.body;
    // Convert string to date
    const ndate = new Date(date + " " + time + " GMT");
    const params = {
      where: {
        date: ndate,
      },
    };
    const sessionData = await sessionDB.Find(params);
    if (sessionData.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (sessionData.data)
      // Just create a new patientSession
      return await this.SessionInclude(request, sessionData.data, response);
    else if (!sessionData.data)
      // Create a new Session, then call SessionInclude function
      return await this.SessionCreate(request, response);
  }

  async SessionDelete(request, response) {
    const { id } = request.params;
    const usrId = Decode(request.headers).id;
    if (!usrId)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    const patientParams = {
      where: {
        id,
      },
    };

    const patientSession = await patientSessionDB.Delete(patientParams);

    if (patientSession.error || !patientSession.data)
      response.send({ error: true, message: "Unable to connet server" });

    console.log({ DATA: patientSession.data });
    const { sessionId } = patientSession.data;

    const sessionParams = {
      where: {
        id: sessionId,
      },
    };

    const session = await sessionDB.GetOne(sessionParams);
    if (session.error)
      response.send({ error: true, message: "Unable to connet server" });

    const sessionUpdateParams = {
      where: {
        id: session.data.id,
      },
      data: {
        count: session.data.count - 1,
      },
    };

    const sessionUpdate = await sessionDB.Update(sessionUpdateParams);

    response.send({ ...patientSession.data });
  }
}

export default PatientControl;
