import Router from "express";
import SessionController from "../controller/sessionController.js";
import { SessionRules, SessionValidation } from "../utils/sessionValidator.js";

const route = Router();
const clientController = new SessionController();

export default route;

route.post(
  "/patient/confirm",
  clientController.ChangState.bind(clientController)
);

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
