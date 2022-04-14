import Controller from "./database/controllerSUS.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const clinicSchema = Joi.object({});

class SessionController extends Controller {
  constructor() {
    super("Session");
  }

  async Create(request) {
    const { date, clinicId } = request.body;

    const session = {
      date: new Date(date),
      clinic: {
        // Assiciate session with the Clinc
        connect: { id: clinicId },
      },
    };
    const create = await super.Create(session);
    return create;
  }

  async FindByDate(request) {
    const date = request.body.date;
    const search = await super.FindByDate(date);
    return search;
  }
}

export default SessionController;
