import { Router } from "express";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createMockTestBundle,
  getMockTestBundles,
  updateMockTestBundleDetails,
  updateMockTestBundleStatus,
  addMockTestsToBundle,
  removeMockTestFromBundle,
  getMockTestBundleById,
  getAllBundlesWithEnrollmentCount,
  getBundleStudents,
  deleteEnrollmentsAndResults,
  exportBundleStudentsExcel
} from "../controllers/admin.mockTestBundle.controller.js";


const router = Router();

// Admin Only Routes
router
  .route("/")
  .post(
    authorizedRoles("admin"),
    upload.fields([{ name: "thumbnailImage", maxCount: 1 }]),
    createMockTestBundle,
  );
router.route("/").get(authorizedRoles("admin"), getMockTestBundles);

router.get(
  "/enrollments",
  authorizedRoles("admin"),
  getAllBundlesWithEnrollmentCount,
);

router.route("/:bundleId").get(authorizedRoles("admin"), getMockTestBundleById);
router
  .route("/:bundleId")
  .patch(
    authorizedRoles("admin"),
    upload.fields([{ name: "thumbnailImage", maxCount: 1 }]),
    updateMockTestBundleDetails,
  );

router.patch(
  "/:bundleId/status",
  authorizedRoles("admin"),
  updateMockTestBundleStatus,
);

router.patch(
  "/:bundleId/mock-tests",
  authorizedRoles("admin"),
  addMockTestsToBundle,
);

router.delete(
  "/:bundleId/mock-tests/:mockTestId",
  authorizedRoles("admin"),
  removeMockTestFromBundle,
);


// Route to get students enrolled in a mock test bundle
router.get(
  "/:bundleId/students",
  authorizedRoles("admin"),
  getBundleStudents,
);

// DELETE all data related to a bundle
router.delete(
  "/delete-bundle-data/:bundleId",
  authorizedRoles("admin"),
  deleteEnrollmentsAndResults
);

router.get(
  "/:bundleId/students/export",
  authorizedRoles("admin"),
  exportBundleStudentsExcel
);

export default router;
