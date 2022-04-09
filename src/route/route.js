import Router from "express";

import nurse from "./nurse_user.js";

const router = Router();

router.use("/nurse", nurse);

export default router;
