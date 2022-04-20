import Route from "express";
import ClinicController from "../controller/clinicController.js";
import { ClinicRules, ClinicValidation } from "../utils/clinicValidator.js";

const route = Route();
const clientController = new ClinicController();

route.post(
  "/new",
  ClinicRules("new"),
  ClinicValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/edit/:id",
  ClinicRules("edit"),
  ClinicValidation,
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete/:id",
  ClinicRules("delete"),
  ClinicValidation,
  clientController.Delete.bind(clientController)
);

route.get("/all", clientController.GetMany.bind(clientController));

export default route;
