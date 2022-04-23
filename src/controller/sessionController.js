import Controller from "./database/controller.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const clinicSchema = Joi.object({});

class SessionController extends Controller {
  constructor() {
    super("Session");
  }

  async ChangState(request, response) {
    const { id, status } = request.body;

    const params = {
      where: {
        id,
      },
      data: {
        status,
      },
    };

    const updateSession = await super.Update(params);

    if (updateSession.error)
      return response.send({
        error: true,
        message: "Unable to update session",
      });

    response.send({ ...updateSession.data });
  }
}

export default SessionController;
