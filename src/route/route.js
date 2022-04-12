import Router from "express";

import nurse from "./nurseRoute.js";
import patient from "./patientRoute.js";
import clinic from "./clinicRoute.js";

const router = Router();

router.use("/nurse", nurse);
router.use("/patient", patient);
router.use("/clinic", clinic);

export default router;
