import Route from "express";
import UserController from "../controller/nurse_userController.js";

const route = Route();
const userController = new UserController();

route.post("/new", userController.Create.bind(userController));
route.post("/profile", userController.Update.bind(userController));
route.delete("/delete", userController.Delete.bind(userController));

export default route;
