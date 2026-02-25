import { Router } from "express";
import { getMockTests,getMockTestInstructions } from "../controllers/user.mockTest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { checkMockTestEnrollment, checkAttemptOwnership } from "../middlewares/mockTest.middleware.js";
import { startMockTestAttempt, getMockTestAttemptSession, getAttemptStats, markVisited, saveAnswer, submitMockTest } from "../controllers/user.mockTestAttempt.controller.js";

const router = Router();

router.route("/").get(getMockTests);
router.route("/:mockTestId").get(verifyJWT, checkMockTestEnrollment, getMockTestInstructions);
router.route("/:mockTestId/start").post(verifyJWT, checkMockTestEnrollment, startMockTestAttempt);
router.route("/attempt/:attemptId").get(verifyJWT, checkAttemptOwnership, getMockTestAttemptSession);
router.route("/attempt/:attemptId/stats").get(verifyJWT, checkAttemptOwnership, getAttemptStats);
router.route("/attempt/:attemptId/question/:questionId/visit").put(verifyJWT, checkAttemptOwnership, markVisited);
router.route("/attempt/:attemptId/question/:questionId/answer").put(verifyJWT, checkAttemptOwnership, saveAnswer);
router.route("/attempt/:attemptId/submit").post(verifyJWT, checkAttemptOwnership, submitMockTest)
export default router;