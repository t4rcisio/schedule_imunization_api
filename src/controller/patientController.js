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
}

export default PatientControl;
