import Router from "express";

import nurse from "./nurseRoute.js";

const router = Router();

router.use("/nurse", nurse);

export default router;
