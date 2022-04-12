import Route from "express";
import ClinicController from "../controller/clinicController.js";
import { ClinicRules, ClinicValidation } from "../utils/auth.js";

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
route.get("/find/:name", clientController.Seach.bind(clientController));
route.get("/get/:id", clientController.GetOne.bind(clientController));
route.get("/all", clientController.GetAll.bind(clientController));

export default route;
