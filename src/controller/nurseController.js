import bcrypt from "bcryptjs";
import Controller from "./controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { cpf } from "cpf-cnpj-validator";
import Joi from "joi";
dotenv.config();

class UserController extends Controller {
  constructor() {
    super("Nurse_user");
  }

  HashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async Create(request, response) {
    // Prisma does't support @unique parameter on Mongodb yet,
    // so, I have to do it manually

    if (cpf.isValid(request.body.cpf)) return response.send("invalid cpf");
    const user = await super.Unic_cpf(request);
    if (user) return response.send("CPF is already in use");

    // Transform password in a hash
    request.body.password = this.HashPassword(request.body.password);
    return await super.Create(request, response);
  }

  async Login(request, response) {
    const user = await super.Login(request);

    if (user.error)
      return response.json({ error: "Unable to connect data server" });
    if (!user.data)
      return response.send({ error: "Incorrect login or password" });

    const { password } = request.body;
    const hashPassword = user.data.password;
    const hash = bcrypt.compareSync(password, hashPassword);

    if (!hash) return response.send({ error: "Incorrect login or password" });

    const { id, name } = user.data;
    const client = {
      id,
      name,
    };

    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    response.cookie("token", token, {
      maxAge: 60 * 60 * 8,
      httpOnly: true,
      secure: true,
      path: "/",
    });
    console.log(response.cookie);
    return response.send(token);
  }

  async Update(request, response) {}
}

export default UserController;

/*
model Nurse_user {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
  cpf       String   @unique
  password  String

}
*/
