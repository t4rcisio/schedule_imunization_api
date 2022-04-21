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
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete/:id",
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
  "/sessions/scheduled",
  clientController.PatientSessions.bind(clientController)
);

route.post("/sessions/new", clientController.SessionNew.bind(clientController));

route.delete(
  "/sessions/delete/:id",
  clientController.SessionDelete.bind(clientController)
);

export default route;
