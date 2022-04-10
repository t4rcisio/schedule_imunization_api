import Route from "express";
import UserController from "../controller/nurseController.js";
import { NurseRules, NurseValidation } from "../utils/validator.js";

const route = Route();
const clientController = new UserController();

route.post(
  "/new",
  NurseRules("nurse/new"),
  NurseValidation, // Validate body before processing request
  clientController.Create.bind(clientController)
);
route.post(
  "/edit/:id",
  NurseRules("nurse/edit"),
  NurseValidation, // Validate body before processing request
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete",
  NurseRules("nurse/delete"),
  NurseValidation,
  clientController.Delete.bind(clientController)
);
route.get(
  "/login",
  NurseRules("nurse/login"),
  NurseValidation,
  clientController.GetOne.bind(clientController)
);

export default route;
