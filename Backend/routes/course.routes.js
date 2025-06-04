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

const router=Router();

router.route("/add-course").post(addCourse);

router.route("/get-all-courses").get(getAllCourses);

router.route("/add-section").post(addSection);

router.route("/add-lecture").post(addLecture);

router.route("/update-section").post(addLectureToASection);

router.route("/add-new-course").post(addNewCourse);

router.route("/get-full-course").get(getFullCourse);

export default router;