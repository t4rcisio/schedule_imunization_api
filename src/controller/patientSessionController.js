import Controller from "./database/controller.js";

class PatientSessionController extends Controller {
  constructor() {
    super("Patient_session");
  }
}

// Woks like a bridth to Patient_sessions database
// All control is inside sessionController

export default PatientSessionController;
