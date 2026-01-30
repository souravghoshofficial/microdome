import { Router } from "express"
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";
import { createMockTest,createMockTestSection,createMockTestQuestion} from "../controllers/mockTest.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/").post(authorizedRoles("admin","instructor"), createMockTest)

router.route("/:mockTestId/sections").post(authorizedRoles("admin","instructor"),createMockTestSection)

router.route("/:mockTestId/:mockTestSectionId/questions").post(authorizedRoles("admin","instructor"),upload.fields([{ name: "questionImage", maxCount: 1 }]), createMockTestQuestion)


export default router;