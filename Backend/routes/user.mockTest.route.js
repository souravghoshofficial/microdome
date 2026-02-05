import { Router } from "express";
import { getMockTests } from "../controllers/user.mockTest.controller.js";


const router = Router();

router.route("/").get(getMockTests);

export default router;