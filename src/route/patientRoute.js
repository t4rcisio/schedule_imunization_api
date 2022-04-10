import Route from "express";
import PatientControl from "../controller/patientController.js";
import { PatientRules, PatientValidation } from "../utils/patientValidator.js";

const route = Route();
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
  clientController.Create.bind(clientController)
);
route.delete(
  "/delete",
  PatientRules("delete"),
  PatientValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/login",
  PatientRules("login"),
  PatientValidation,
  clientController.Create.bind(clientController)
);

export default route;
