import Route from "express";
import UserController from "../controller/nurseController.js";
import NurseValidation  from "../utils/validator.js";

const route = Route();
const clientController = new UserController();

//route.use(Validator);

route.post(
  "/new",
  NurseValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/profile",
  NurseValidation,
  clientController.Update.bind(clientController)
);
route.delete("/delete", clientController.Delete.bind(clientController));
route.get("/find", clientController.FindOnebyID.bind(clientController));

export default route;
