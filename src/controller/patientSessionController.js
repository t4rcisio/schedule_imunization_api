import Controller from "./database/controller.js";
import Joi from "joi";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const clinicSchema = Joi.object({});

class PatientSessionController extends Controller {
  constructor() {
    super("Patient_session");
  }

  


}

export default PatientSessionController;
