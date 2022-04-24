import Controller from "./database/controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import patientSessionController from "./patientSessionController.js";
import sessionController from "./sessionController.js";
import { cpf as cpfLib } from "cpf-cnpj-validator";
import Decode from "../utils/tokenDecode.js";

dotenv.config();

class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }

  // Create a new Patient user
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

    // Verify cpf already in use
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

    if (newuser.error || !newuser.data)
      return response.send({ error: true, message: "Unable to create user" });

    return response.send({ ...newuser.data });
  }

  // Update Patient User
  async Update(request, response) {
    //Get user id from token
    //auth.js checked signature from token received, then this step
    //just decode to get user id
    const { id } = Decode(request.headers);
    if (!id)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    // If all ok, continue to aply changes
    const { name, cpf, birthday } = request.body;

    // To check cpf
    if (!cpfLib.isValid(cpf))
      return response.send({ error: true, message: "cpf invald format" });

    // Update params
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
    //Get user id from token
    //auth.js checked signature from token received, then this step
    //just decode to get user id
    const { id } = Decode(request.headers);
    if (!id)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    const params = {
      where: {
        id,
      },
    };

    const deletion = await super.Delete(params);

    if (deletion.error || !deletion.data)
      return response.send({
        error: true,
        message: "Failed to delete Patient",
      });

    return response.send({ ...deletion.data });
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

    // Search user from cpf
    const user = await super.GetOne(data);
    if (user.error)
      return response.send({ error: true, message: "Unable to connet server" });
    if (!user.data)
      return response.send({ error: true, message: "cpf doesn't exist" });

    // Patient user doesn't require password

    // If find it, create a payload to generate the cookie token
    const { id, name, birthday, permission } = user.data;
    const client = {
      id,
      name,
      cpf,
      birthday,
      permission,
    };

    // Generate hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    return response.send({ token });
  }

  // List all patient session
  async PatientSessions(request, response) {
    const { id } = Decode(request.headers);
    if (!id)
      return response
        .send({ error: true, message: "Failed to read token" })
        .status(403);

    // This params return an list of patientSessions whit date and clinc location

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

    if (search.error)
      return response.send({ error: true, message: "Failed to load sessions" });

    return response.send({ ...search.data });
  }
}

export default PatientControl;
