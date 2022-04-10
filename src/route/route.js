import Router from "express";
import { route } from "express/lib/application";

import nurse from "./nurseRoute.js";
import patient from "./patientRoute.js";

const router = Router();

router.use("/nurse", nurse);
route.use("/patient", patient);

export default router;
