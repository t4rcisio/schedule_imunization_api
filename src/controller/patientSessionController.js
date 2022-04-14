import Controller from "./database/controllerSUS.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const clinicSchema = Joi.object({});

class PatientSessionController extends Controller {
  constructor() {
    super("Patient_session");
  }

  async Create(request) {
    const { sessionId, patientId } = request.body;

    const session = {
      Session: {
        // Assiciate session with the Clinc
        connect: { id: sessionId },
      },
      Patient: {
        // Assiciate session with the Clinc
        connect: { id: patientId },
      },
    };

    const newSession = await super.Create(session);

    return newSession;
  }

  async PatientSessions(request){
      
  }


}

export default PatientSessionController;
