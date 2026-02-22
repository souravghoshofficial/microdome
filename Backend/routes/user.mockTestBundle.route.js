import { Router } from "express";
import { getMockTestBundles, getMockTestBundleById, getEnrolledBundleDetailsByBundleId } from "../controllers/user.mockTestBundle.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkMockTestBundleEnrollment } from "../middlewares/checkMocktestEnrollment.middleware.js";

const router = Router();

router.route("/").get(getMockTestBundles);
router.route("/:bundleId").get(getMockTestBundleById);

router.route("/my-bundles/:bundleId").get(verifyJWT, checkMockTestBundleEnrollment, getEnrolledBundleDetailsByBundleId);
export default router;