import Controller from "./controller.js";
import Joi from "joi";

const clinicSchema = Joi.object({});

class ClinicController extends Controller {
  constructor() {
    super("Clinic");
  }
}

export default ClinicController;
