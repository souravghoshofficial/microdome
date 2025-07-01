import { Router } from "express";

import {
  createCourse,
  getAllCourses,
  addSection,
  addLecture,
  addLectureToASection,
  addNewCourse,
  getFullCourse,
  getCourseDetails,
  getEnrolledCourses,
  getAllSections
} from "../controllers/course.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import { isEnrolledInCourse } from "../middlewares/isAuthorized.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create-course")
  .post(upload.fields([{ name: "courseImage", maxCount: 1 }]), createCourse);

router.route("/get-all-courses").get(getAllCourses);

router.route("/add-section").post(upload.fields([{ name: "noteURL", maxCount: 1 }]),addSection);

router.route("/add-lecture").post(upload.fields([{ name: "noteURL", maxCount: 1 }]),addLecture);

router.route("/update-section").post(addLectureToASection);

router.route("/add-new-course").post(addNewCourse);

router.route("/get-full-course/:id").get(verifyJWT,isEnrolledInCourse,getFullCourse);

router.route("/get-course-details").post(getCourseDetails);

router.route("/get-enrolled-courses").post(getEnrolledCourses);

router.route("/get-all-sections/:id").get(getAllSections);

export default router;
