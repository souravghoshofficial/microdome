import { Router } from "express";
import { getMockTests,getMockTestInstructions } from "../controllers/user.mockTest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { checkMockTestEnrollment } from "../middlewares/checkMocktestEnrollment.middleware.js";
const router = Router();

router.route("/").get(getMockTests);
router.route("/:mockTestId").get(verifyJWT,checkMockTestEnrollment,getMockTestInstructions);
router.route("/:mockTestId/start").post(verifyJWT,checkMockTestEnrollment,startMockTestAttempt);
router.route("/attempt/:attemptId").post(verifyJWT,checkMockTestEnrollment,startMockTestAttempt);
router.patch(
  "/attempt/:attemptId/heartbeat",
  verifyJWT,
  updateActiveTime
);

export default router;