import { Router } from "express";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createMockTestBundle } from "../controllers/mockTestBundle.controller.js";
const router=Router()

router.route("/").post(authorizedRoles("admin","instructor"),upload.fields([{ name: "thumbnailImage", maxCount: 1 }]),createMockTestBundle);

export default router;