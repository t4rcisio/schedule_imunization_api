import Route from "express";
import ClinicController from "../controller/clinicController.js";

const route = Route();
const clientController = new ClinicController();

route.post("/new", clientController.Create.bind(clientController));
route.post("/edit", clientController.Update.bind(clientController));
route.delete("/delete", clientController.Delete.bind(clientController));
route.get("/get", clientController.GetOne.bind(clientController));

export default route;
