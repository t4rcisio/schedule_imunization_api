import Router from "express";
import UserController from "../controller/nurseController.js";
import { NurseRules, NurseValidation } from "../utils/nurseValidator.js";

const route = Router();
const clientController = new UserController();

route.post(
  "/new",
  NurseRules("new"),
  NurseValidation, // Validate body before processing request
  clientController.Create.bind(clientController)
);
route.post(
  "/edit",
  NurseRules("edit"),
  NurseValidation, // Validate body before processing request
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete",
  NurseRules("delete"),
  NurseValidation,
  clientController.Delete.bind(clientController)
);
route.post(
  "/login",
  NurseRules("login"),
  NurseValidation,
  clientController.Login.bind(clientController)
);

export default route;
