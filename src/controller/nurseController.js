import bcrypt from "bcryptjs";
import Controller from "./database/controller.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import patientSessionController from "./patientSessionController.js";
import sessionController from "./sessionController.js";
import Decode from "../utils/tokenDecode.js";

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
    if (create.error || !create.data)
      return response.send({
        error: false,
        message: "An error occurred while saving user",
      });

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
      response.send({ error: true, message: "Can't locate user" });
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
      cpf,
    };

    // -> Generate a hash
    const token = jsonwebtoken.sign(client, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "8h",
    });

    return response.send({ token });
  }

  async Update(request, response) {
    //
    // For security reasons, this changes be apply on id inside token
    // this way, i garant that user has permission to make changes.
    // auth.js middleware already checked signature of token, now, just decode hash
    //
    const { id } = Decode(request.headers);

    if (!id) response.send({ error: true, message: "Failed to read token" });

    const params = {
      where: {
        id,
      },
    };

    // -> Find user bay id url parameter
    const user = await super.GetOne(params);
    if (user.error || !user.data)
      response.send({ error: true, message: "Unable to find user" });

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash)
      return response.send({ error: true, message: "Incorrect password" });

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

    console.log({ update });

    response.send({ ...update.data });
  }

  async Delete(request, response) {
    //
    // For security reasons, this changes be apply on id inside token
    // this way, i garant that user has permission to make changes.
    // auth.js middleware already checked signature of token, now, just decode hash
    //
    const { id } = Decode(request.headers);

    if (!id) response.send({ error: true, message: "Failed to read token" });

    const params = {
      where: {
        id,
      },
    };

    // -> Find user bay id url parameter
    const user = await super.GetOne(params);
    if (user.error || !user.data)
      response.send({ error: true, message: "Unable to find user" });

    // -> Before aplly updates, analyze body password
    const { password } = request.body;
    const passHash = user.data.password;

    // -> Verify recived password
    const hash = bcrypt.compareSync(password, passHash);
    if (!hash)
      return response.send({ error: true, message: "Incorrect password" });

    const deleteParams = {
      where: {
        id,
      },
    };
    const deleting = await super.Delete(deleteParams);

    if (deleting.error)
      response.send({
        error: true,
        message: "An error occurred while deleting",
      });

    response.send({ ...deleting.data });
  }
}

export default UserController;
