import { Router } from "express";

import { 
    addCourse,
    getAllCourses,
    addSection,
    addLecture,
    addLectureToASection,
    addNewCourse,
    getFullCourse
} from "../controllers/course.controller.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";
import { isEnrolledInCourse } from "../middlewares/isauthenticated.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/add-course").post(authorizeRoles("admin"),addCourse);

router.route("/get-all-courses").get(authorizeRoles("admin"),getAllCourses);

router.route("/add-section").post(authorizeRoles("admin"),addSection);

router.route("/add-lecture").post(authorizeRoles("admin"),addLecture);

router.route("/update-section").post(authorizeRoles("admin"),addLectureToASection);

router.route("/add-new-course").post(authorizeRoles("admin"),addNewCourse);

router.route("/get-full-course/:id").get(verifyJWT,isEnrolledInCourse,authorizeRoles("user","admin"),getFullCourse);


export default router;