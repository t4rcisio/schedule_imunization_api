import Controller from "./controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
class PatientControl extends Controller {
  constructor() {
    super("Patient_user");
  }

  async Create(request, response) {
    // Prisma does't support @unique parameter on Mongodb yet,
    // so, I have to do it manually
    const user = await super.Unic_cpf(request);
    if (user) return response.send("CPF is already in use");

    // convert date string to Date iso format
    request.body.birthday = new Date(request.body.birthday);

    return await super.Create(request, response);
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
  }
}

export default PatientControl;
