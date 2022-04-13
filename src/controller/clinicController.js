import Controller from "./database/controllerSUS.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const clinicSchema = Joi.object({});

class ClinicController extends Controller {
  constructor() {
    super("Clinic");
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
    // -> Verify refCode in body recived
    const clinic = await super.GetByRef(request);
    if (clinic.error) return response.send("<h3>Unable connct to server</h3>");
    if (clinic.data) return response.send("<h3>This clinic already exist</h3>");

    const create = await super.Create(request);

    return response.send({ error: create.error, ...create.data });
  }

  async Update(request, response) {
    const { id } = request.params;

    const clinic = await super.GetOne(request);
    if (clinic.error) response.send("<h3>Unable connct to server</h3>");
    if (!clinic.data) response.send("<h3>This clinic doesn't exist</h3>");

    const { auth_session } = request.cookies;
    if (!this.VerifyToken(auth_session))
      response.send("Error to validate token");

    const { rule } = jsonwebtoken.decode(auth_session);
    if (!(rule === "ADM")) response.send("<h1>Permission Denied</h1>");

    const update = await super.Update(request);

    response.send({ error: update.error, ...update.data });
  }

  async Update(request, response) {
    const clinic = await super.GetOne(request);
    if (clinic.error) response.send("<h3>Unable connct to server</h3>");
    if (!clinic.data) response.send("<h3>This clinic doesn't exist</h3>");

    const { auth_session } = request.cookies;
    if (!this.VerifyToken(auth_session))
      response.send("Error to validate token");

    const { rule } = jsonwebtoken.decode(auth_session);
    if (!(rule === "ADM")) response.send("<h1>Permission Denied</h1>");

    const update = await super.Delete(request);

    response.send({ error: update.error, ...update.data });
  }

  async Search(request, response) {
    const search = await super.Search(request);

    return response.send({ error: search.error, ...search.data });
  }

  async CreateSession(request, response){
    
  }
}

export default ClinicController;
