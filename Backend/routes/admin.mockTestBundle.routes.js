import { Router } from "express";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createMockTestBundle, getMockTestBundles, updateMockTestBundleDetails, updateMockTestBundleStatus, addMockTestsToBundle, removeMockTestFromBundle, getMockTestBundleById } from "../controllers/admin.mockTestBundle.controller.js";

const router = Router()

// Admin Only Routes
router.route("/").post(authorizedRoles("admin"), upload.fields([{ name: "thumbnailImage", maxCount: 1 }]), createMockTestBundle);
router.route("/").get(authorizedRoles("admin"), getMockTestBundles);

router.route("/:bundleId").get(authorizedRoles("admin"), getMockTestBundleById);
router.route("/:bundleId").patch(authorizedRoles("admin"), upload.fields([{ name: "thumbnailImage", maxCount: 1 }]), updateMockTestBundleDetails);

router.patch("/:bundleId/status", authorizedRoles("admin"), updateMockTestBundleStatus);

router.patch("/:bundleId/mock-tests", authorizedRoles("admin"), addMockTestsToBundle);
router.delete("/:bundleId/mock-tests/:mockTestId", authorizedRoles("admin"), removeMockTestFromBundle);



export default router;