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
      response.send({ error: true, message: "Unable to connet server" });
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
    const { auth_session } = request.cookies;
    const token = jsonwebtoken.decode(auth_session);
    const { id } = request.params;
    const tokenId = token.id;

    if (!(id === tokenId))
      response.send({ error: true, message: "unauthorized" });

    // If all ok, continue to aply changes
    const { name, cpf, birthday } = request.body;
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

    response.send({ ...update });
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
      response.send({ error: true, message: "unauthorized" });

    const params = {
      where: {
        id,
      },
    };

    const deletion = await super.Delete(params);

    response.send({ ...deletion });
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
      birthday,
    };

    // Generate hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    response.send({ token });
  }

  async PatientSessions(request, response) {
    const { id } = Decode(request.headers);
    if (!id)
      return response.send({ error: "Failed to read token" }).status(403);

    const data = {
      where: {
        id,
      },
      include: {
        session: true,
      },
    };
    const patientSession = await super.GetOne(data);
    
    session




    return response.send({ ...search.data });
  }

  async SessionInclude(request, session, response) {
    //
    // The system was projected allow two patients per session
    //
    if (session.count >= 2)
      return response.send({ message: "This session is full" });

    // Now, generate association params to add user on session
    const sessionId = session.id;
    const { patientId } = request.body;
    const params = {
      data: {
        Session: {
          connect: { id: sessionId },
        },
        Patient: {
          connect: { id: patientId },
        },
      },
    };

    // Create a new patientSession
    const userSession = await patientSessionDB.Create(params);
    if (userSession.error)
      return response.send({ error: "Unable to server connect" });

    // Update session
    session.counter = session.counter + 1;
    session.save();

    response.send({ ...userSession.data });
  }

  async SessionCreate(request, response) {
    const { date, clinicId } = request.body;
    //
    // The system was projected to allow twenty attendaces per day
    //
    const sysdate = new Date(); // Get today date time
    const today = sysdate.toLocaleDateString(); // get just date

    // Atendance time
    const begin = new Date(today + " " + process.argv.START);
    const end = new Date(today + " " + process.argv.END);

    // date time received
    date = new Date(date);
    // Check limits
    if (!(date >= begin && date <= end))
      response.send({ error: "date out of attendances limits" });

    // Generate creation params
    const params = {
      data: {
        date,
        clinic: {
          connect: { id: clinicId },
        },
      },
    };

    const session = await sessionDB.Create(params);
    if (session.error)
      return response.send({ error: "Unable to server connect" });

    return await this.SessionInclude(request, session.data, response);
  }

  async SessionNew(request, response) {
    //
    // First, check if already exist a session with same date
    //
    const { date } = request.body;
    // Convert string to date
    date = new Date(date);
    const params = {
      where: {
        date,
      },
    };
    const sessionData = await sessionDB.GetOne(params);
    if (sessionData.error)
      response.send({ error: true, message: "Unable to connet server" });
    if (sessionData.data)
      // Just create a new patientSession
      return await this.SessionInclude(request, sessionData.data, response);

    if (!sessionData.data)
      // Create a new Session, then call SessionInclude function
      return await this.SessionCreate(request, response);
  }

  async SessionDelete(request, response) {
    const { auth_session } = request.cookies;
    const token = jsonwebtoken.decode(auth_session);
    const { id } = request.params;
    const tokenId = token.id;

    if (!(id === tokenId))
      response.send({ error: true, message: "unauthorized" });

    const patientParams = {
      where: {
        id,
      },
    };

    const patientSession = await patientSessionDB.Delete(patientParams);

    if (patientSession.error)
      response.send({ error: true, message: "Unable to connet server" });

    const { sessionId } = patientSession.data;

    const sessionParams = {
      where: {
        id: sessionId,
      },
    };

    const session = await sessionDB.GetOne(sessionParams);
    if (session.error)
      response.send({ error: true, message: "Unable to connet server" });

    session.data.count = session.data.count - 1;
    session.data.save();

    response.send({ ...patientSession.data });
  }
}

export default PatientControl;
