import Router from "express";
import PatientControl from "../controller/patientController.js";
import { PatientRules, PatientValidation } from "../utils/patientValidator.js";

const route = Router();
const clientController = new PatientControl();

route.post(
  "/new",
  PatientRules("new"),
  PatientValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/edit",
  PatientRules("edit"),
  PatientValidation,
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete",
  PatientRules("delete"),
  PatientValidation,
  clientController.Delete.bind(clientController)
);
route.post(
  "/login",
  PatientRules("login"),
  PatientValidation,
  clientController.Login.bind(clientController)
);

route.get(
  "/scheduled",
  clientController.PatientSessions.bind(clientController)
);

export default route;
