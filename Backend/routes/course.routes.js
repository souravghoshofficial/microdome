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
  getEnrolledCourses
} from "../controllers/course.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create-course")
  .post(upload.fields([{ name: "courseImage", maxCount: 1 }]), createCourse);

router.route("/get-all-courses").get(getAllCourses);

router.route("/add-section").post(addSection);

router.route("/add-lecture").post(addLecture);

router.route("/update-section").post(addLectureToASection);

router.route("/add-new-course").post(addNewCourse);

router.route("/get-full-course/:id").get(getFullCourse);
router.route("/get-course-details").post(getCourseDetails);

router.route("/get-enrolled-courses").post(getEnrolledCourses);

export default router;
