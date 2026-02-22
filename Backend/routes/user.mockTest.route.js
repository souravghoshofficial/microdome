import { Router } from "express";
import { getMockTests,getMockTestInstructions } from "../controllers/user.mockTest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { checkMockTestEnrollment, checkAttemptOwnership } from "../middlewares/mockTest.middleware.js";
import { startMockTestAttempt, getMockTestAttemptSession } from "../controllers/user.mockTestAttempt.controller.js";
const router = Router();

router.route("/").get(getMockTests);
router.route("/:mockTestId").get(verifyJWT, checkMockTestEnrollment, getMockTestInstructions);
router.route("/:mockTestId/start").post(verifyJWT, checkMockTestEnrollment, startMockTestAttempt);
router.route("/attempt/:attemptId").get(verifyJWT, checkAttemptOwnership, getMockTestAttemptSession);


export default router;