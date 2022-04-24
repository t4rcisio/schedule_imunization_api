import Router from "express";
import ClinicController from "../controller/clinicController.js";
import { ClinicRules, ClinicValidation } from "../utils/clinicValidator.js";

const route = Router();
const clientController = new ClinicController();

route.post(
  "/new",
  ClinicRules("new"),
  ClinicValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/edit",
  ClinicRules("edit"),
  ClinicValidation,
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete",
  ClinicRules("delete"),
  ClinicValidation,
  clientController.Delete.bind(clientController)
);

// Get all clinics -> To generete select options on forms
route.get("/all", clientController.GetMany.bind(clientController));

export default route;
