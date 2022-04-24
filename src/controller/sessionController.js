import Controller from "./database/controller.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import PatientSessionController from "./patientSessionController.js";

dotenv.config();

const clinicSchema = Joi.object({});

const patientSessionDB = new PatientSessionController();

class SessionController extends Controller {
  constructor() {
    super("Session");
  }

  // Change state of patient attendance, Schedule to Done
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

    const updateSession = await patientSessionDB.Update(params);

    if (updateSession.error)
      return response.send({
        error: true,
        message: "Unable to update session",
      });

    response.send({ ...updateSession.data });
  }
}

export default SessionController;
