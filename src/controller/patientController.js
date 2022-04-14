import Controller from "./database/controllerUser.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { response } from "express";
import patientSessionController from "./patientSessionController.js";

dotenv.config();
const session = new patientSessionController();

class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }

  ListSessions(user, response) {
    const { Patiete_session } = user;
    if (!Patiete_session) return response.send("You doesn't have any session");

    return response.send({ PatientControl });
  }

  async Create(request, response) {
    // Prisma does't support @unique parameter on Mongodb yet,
    // so, I have to do it manually
    const user = await super.GetByCPF(request);
    if (user.error) response.send("<h3>Unable connct to server</h3>");
    if (user.data) return response.send("CPF is already in use");

    // convert date string to Date iso format
    request.body.birthday = new Date(request.body.birthday);

    const newuser = await super.Create(request, response);
    return response.send({ error: newuser.error, ...newuser.data });
  }

  async Login(request, response) {
    const user = await super.GetByCPF(request);

    if (user.error) response.send("<h3>Unable connct to server</h3>");
    if (!user.data) response.send("<h2>CPF not found</h2>");

    const { id, name } = user.data;
    const client = {
      id,
      name,
    };

    // -> Generate a hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    // -> Store hash on cookie database
    response.cookie(process.env.COOKIE_KEY, token, {
      maxAge: 60 * 60 * 8,
      httpOnly: true,
      secure: true,
      path: "/",
    });

    this.ListSessions(user.data, response);
  }

  async PatientSessions(request, reponse) {
    const { id } = request.params;
    
    const data = {
      where: {
        id,
      },
      include: {
        patient_session: true,
      },
    };
    const search = await super.GetByCPF(data);

    return reponse.send(...search);
  }
}

export default PatientControl;
