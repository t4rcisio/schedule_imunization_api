import Router from "express";

import nurse from "./nurseRoute.js";
import patient from "./patientRoute.js";

const router = Router();

router.use("/nurse", nurse);
router.use("/patient", patient);

export default router;
