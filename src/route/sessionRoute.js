import Route from "express";
import ClinicController from "../controller/clinicController.js";
import { SessionRules, SessionValidation } from "../utils/sessionValidator.js";

const route = Route();
const clientController = new ClinicController();

route.post(
  "/new",
  SessionRules,
  SessionValidation,
  clientController.Create.bind(clientController)
);
route.post(
  "/edit/:id",
  SessionRules,
  SessionValidation,
  clientController.Update.bind(clientController)
);
route.delete(
  "/delete/:id",
  SessionRules,
  SessionValidation,
  clientController.Delete.bind(clientController)
);
route.get("/search", clientController.Search.bind(clientController));
route.get("/get/:id", clientController.GetOne.bind(clientController));
route.get("/all", clientController.GetAll.bind(clientController));

export default route;

/*
model Session {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  createdAt       DateTime          @default(now())
  date            DateTime
  clinic          Clinic            @relation(fields: [clinicId], references: [id])
  clinicId        String            @db.ObjectId
  Patiete_session Patient_session[]
}

*/
