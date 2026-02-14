import { Router } from "express";
import { getMockTestBundles, getMockTestBundleById } from "../controllers/user.mockTestBundle.controller.js";

const router = Router();

router.route("/").get(getMockTestBundles);
router.route("/:bundleId").get(getMockTestBundleById);
export default router;