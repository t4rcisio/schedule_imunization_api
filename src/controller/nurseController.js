import bcrypt from "bcryptjs";
import Controller from "./database/controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import patientSessionController from "./patientSessionController.js";
import sessionController from "./sessionController.js";

import Joi from "joi";
dotenv.config();

const patientSessionDB = new patientSessionController();
const sessionDB = new sessionController();

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
    //
    // Verify if cpf has a valid format
    const { cpf } = request.body;
    if (!cpfValidator.isValid(cpf))
      return response.send({ error: "invalid cpf format" });

    // -> Prisma doesn't support @unique parameter on Mongodb yet,
    // -> so, I have to do it manually
    const params = {
      where: {
        cpf,
      },
    };
    const user = await super.GetOne(params);
    if (user.error)
      response.send({ error: true, message: "Unable to connet server" });
    if (user.data)
      return response.send({ error: true, message: "cpf already exist" });

    // Generate build params
    const { name, password } = request.body;
    const nurseParams = {
      data: {
        name,
        cpf,
        password: this.HashPassword(password),
      },
    };
    // -> Send data do crete user
    const create = await super.Create(nurseParams);

    response.send({ ...create.data });
  }

  async Login(request, response) {
    // Verify if cpf has a valid format
    const { cpf } = request.body;
    if (!cpfValidator.isValid(cpf))
      return response.send({ error: "invalid cpf format" });

    // -> Prisma doesn't support @unique parameter on Mongodb yet,
    // -> so, I have to do it manually
    const params = {
      where: {
        cpf,
      },
    };
    const user = await super.GetOne(params);
    if (user.error)
      response.send({ error: true, message: "Unable to connet server" });
    if (!user.data)
      return response.send({
        error: true,
        message: "Incorrect login or password",
      });

    // -> Verify recived password
    const { password } = request.body;
    const hashPassword = user.data.password;
    const hash = bcrypt.compareSync(password, hashPassword);
    if (!hash)
      return response.send({
        error: true,
        message: "Incorrect login or password",
      });

    // -> buid a payload
    const { id, name, permission } = user.data;
    const client = {
      id,
      name,
      permission,
    };

    // -> Generate a hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    return response.send({ token });
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

    const params = {
      where: {
        id,
      },
    };

    // -> Find user bay id url parameter
    const user = await super.GetOne(params);
    if (user.error || !user.data)
      response.send({ error: "Unable to connect server" });

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash) return response.send({ error: "Incorrect password" });

    // If all ok, next to apply update
    const { newPassword, name, cpf } = request.body;

    const updateParams = {
      where: {
        id,
      },
      data: {
        name,
        cpf,
        password: newPassword
          ? this.HashPassword(newPassword)
          : user.data.password,
      },
    };

    // Send data to update
    const update = await super.Update(updateParams);

    response.send({ ...update.data });
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

    // -> Find user bay id url parameter
    const user = await super.GetOne(params);
    if (user.error || !user.data)
      response.send({ error: "Unable to connect server" });

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash) return response.send({ error: "Incorrect password" });

    const deleteParams = {
      where: {
        id,
      },
    };
    const deleting = await super.Delete(deleteParams);

    response.send({ ...deleting.data });
  }

  async Search(request, response) {
    const { clinicId, date } = request.body;

    const params = {
      where: {
        clinicId,
        date: new Date(date + " GMT"),
      },
    };

    const sessions = await sessionDB.GetMany(params);

    if (sessions.error)
      return response.send({
        error: true,
        message: "Unable to connect server 1",
      });

    if (!Object.keys(sessions.data).length)
      return response.send({ ...sessions.data });

    const { id } = sessions.data;

    const patientParams = {
      where: {
        sessionId: id,
      },
      include: {
        Patient: true,
      },
    };

    const userSessions = await patientSessionDB.GetMany(patientParams);

    if (userSessions.error)
      return response.send({
        error: true,
        message: "Unable to connect server 2 ",
      });

    return response.send({ ...userSessions.data });
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
