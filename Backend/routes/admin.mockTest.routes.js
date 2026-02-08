import { Router } from "express"
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { 
    createMockTest,
    createMockTestSection,
    createMockTestQuestion, 
    getMockTests, 
    getMockTestById, 
    getMockTestSections,
    getMockTestSectionQuestions,
    updateMockTest,
    deleteMockTest,
    deleteMockTestSection,
    deleteAllMockTestSections,
    updateMockTestSection,
    deleteMockTestQuestion,
    deleteAllMockTestQuestions,
    updateMockTestQuestion,
    updateMockTestStatus
} from "../controllers/admin.mockTest.controller.js";


const router = Router()

router.route("/").post(authorizedRoles("admin","instructor"), createMockTest)
router.route("/").get(authorizedRoles("admin","instructor"), getMockTests)

router.route("/:mockTestId").get(authorizedRoles("admin","instructor"), getMockTestById)
router.route("/:mockTestId").patch(authorizedRoles("admin","instructor"), updateMockTest)
router.route("/:mockTestId").delete(authorizedRoles("admin","instructor"), deleteMockTest)
router.route("/:mockTestId/status").patch(authorizedRoles("admin","instructor"), updateMockTestStatus)

router.route("/:mockTestId/sections").post(authorizedRoles("admin","instructor"), createMockTestSection)
router.route("/:mockTestId/sections").get(authorizedRoles("admin","instructor"), getMockTestSections)

router.route("/:mockTestId/sections/:mockTestSectionId").delete(authorizedRoles("admin","instructor"), deleteMockTestSection);

router.route("/:mockTestId/sections").delete(authorizedRoles("admin","instructor"), deleteAllMockTestSections);

router.route("/:mockTestId/sections/:mockTestSectionId").patch(authorizedRoles("admin","instructor"), updateMockTestSection);

router.route("/:mockTestId/:mockTestSectionId/questions").post(authorizedRoles("admin","instructor"),upload.fields([{ name: "questionImage", maxCount: 1 }]), createMockTestQuestion)

router.route("/:mockTestId/sections/:mockTestSectionId/:questionId").delete(authorizedRoles("admin","instructor"),deleteMockTestQuestion)

router.route("/:mockTestId/:mockTestSectionId/questions").delete(authorizedRoles("admin","instructor"),deleteAllMockTestQuestions)

router.route("/:mockTestId/:mockTestSectionId/:questionId").patch(authorizedRoles("admin","instructor"),upload.fields([{ name: "questionImage", maxCount: 1 }]),updateMockTestQuestion)

router.route("/:mockTestId/:mockTestSectionId/questions").get(authorizedRoles("admin","instructor"), getMockTestSectionQuestions)



export default router;