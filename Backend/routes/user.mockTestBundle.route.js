import { Router } from "express";
import { getMockTestBundles } from "../controllers/user.mockTestBundle.controller.js";

const router = Router();

router.route("/").get(getMockTestBundles);

export default router;