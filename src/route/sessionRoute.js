import Router from "express";
import SessionController from "../controller/sessionController.js";
import { SessionRules, SessionValidation } from "../utils/sessionValidator.js";

const route = Router();
const clientController = new SessionController();

route.post(
  "/patient/confirm",
  clientController.ChangState.bind(clientController)
);

route.post("/search", clientController.Search.bind(clientController));

route.post("/new", clientController.SessionNew.bind(clientController));

route.delete(
  "/delete/:id",
  clientController.SessionDelete.bind(clientController)
);

export default route;
