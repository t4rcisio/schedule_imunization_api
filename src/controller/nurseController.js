import bcrypt from "bcryptjs";
import Controller from "./database/controller.js";
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

  VerifyToken(userToken) {
    try {
      const token = jsonwebtoken.verify(
        userToken,
        process.env.SECRET_KEY_TOKEN
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async Create(request, response) {
    const userCPf = request.body.cpf;
    if (!cpf.isValid(userCPf)) return response.send("invalid cpf");

    // -> Prisma does't support @unique parameter on Mongodb yet,
    // -> so, I have to do it manually

    if (cpf.isValid(request.body.cpf)) return response.send("invalid cpf");
    const user = await super.GetByCPF(request);
    if (user.error) response.send("<h3>Unable connct to server</h3>");
    if (user.data) return response.send("CPF is already in use");

    // -> Transform password in a hash
    request.body.password = this.HashPassword(request.body.password);

    // -> Send data do crete user
    const create = await super.Create(request, response);

    response.send({ error: create.error, ...create.data });
  }

  async Login(request, response) {
    // -> Find user on db
    const user = await super.Login(request);

    if (user.error)
      return response.json({ error: "Unable to connect data server" });
    if (!user.data)
      // -> cpf does't match
      return response.send({ error: "Incorrect login or password" });

    // -> Verify recived password
    const { password } = request.body;
    const hashPassword = user.data.password;
    const hash = bcrypt.compareSync(password, hashPassword);
    if (!hash) return response.send({ error: "Incorrect login or password" });

    // -> buid a payload
    const { id, name } = user.data;
    const client = {
      id,
      name,
      rule: "ADM",
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

    response.send("logged");
  }

  async Update(request, response) {
    // -> Find user bay id url parameter
    const user = await super.GetOne(request);
    if (user.error || !user.data) response.send("<h1>user not found 1</h1>");

    // -> Verify token authenticity
    const { auth_session } = request.cookies;
    if (!this.VerifyToken(auth_session))
      response.send("Error to validate token");

    // -> Decode payload
    const payload = jsonwebtoken.decode(auth_session);

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash) return response.send({ error: "Incorrect password" });

    // Send data to update
    const update = await super.Update(request, response);

    response.send({ success: update.error, ...update.data });
  }

  async Delete(request, response) {
    // -> Find user bay id url parameter
    const user = await super.GetOne(request);
    if (user.error || !user.data) response.send("<h1>user not found 1</h1>");

    // -> Verify token authenticity
    const { auth_session } = request.cookies;
    if (!this.VerifyToken(auth_session))
      response.send("Error to validate token");

    // -> Decode payload
    const payload = jsonwebtoken.decode(auth_session);

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash) return response.send({ error: "Incorrect password" });

    // Senda data to delete
    const update = await super.Delete(request, response);

    response.send({ success: update.error, ...update.data });
  }
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
