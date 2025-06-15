import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = async (req, res) => {
  const {
    cardTitle,
    subTitle,
    courseTag,
    mode,
    language,
    actualPrice,
    discountedPrice,
    courseTitle,
    courseDescription
  } = req.body;
  if (
    !(
      cardTitle &&
      subTitle &&
      mode &&
      language &&
      courseTag &&
      actualPrice &&
      discountedPrice &&
      courseTitle &&
      courseDescription
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const courseImageLocalPath = req.files?.courseImage[0]?.path;

  if (!courseImageLocalPath) {
    throw new ApiError(400, "Course Image is missing");
  }

  const uploadedcourseImage = await uploadOnCloudinary(courseImageLocalPath);

  if (!uploadedcourseImage?.url) {
    throw new ApiError(400, "Error while uploading the course image");
  }

  const linkAddress = cardTitle.trim().toLowerCase().replace(/\s+/g, "-");

  try {
    const course = await Course.create({
      cardTitle,
      subTitle,
      courseTag,
      mode,
      language,
      actualPrice,
      discountedPrice,
      courseImage: uploadedcourseImage.url,
      linkAddress,
      courseTitle,
      courseDescription
    });

    res.status(200).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while creating course");
  }
};

const getAllCourses = async (req, res) => {
  const courses = await Course.find({});

  res.status(200).json({
    message: "All courses fetched successfully",
    courses,
  });
};

const addLecture = async (req, res) => {
  const { title, videoURL, noteURL, noteTitle } = req.body;

  if (!videoURL && !title) {
    throw new ApiError(400, "video title and video url is required");
  }

  const lecture = {};

  lecture.videoURL = videoURL;
  lecture.title = title;

  if (noteURL) {
    lecture.noteURL = noteURL;
  }

  if (noteTitle) {
    lecture.noteTitle = noteTitle;
  }

  const createdLecture = await Lecture.create(lecture);

  res.status(200).json({
    message: "new lecture added successfully",
    createdLecture,
  });
};

const addSection = async (req, res) => {
  const { title, lectures } = req.body;

  if (!lectures && !title) {
    throw new ApiError(400, "lectures and title are required");
  }

  const createdSection = await Section.create({
    title,
    lectures,
  });

  res.status(200).json({
    message: "section added",
    createdSection,
  });
};

const getCourseDetails = async (req, res) => {
  const { linkAddress } = req.body;

  try {
    const courseDetails = await Course.findOne({ linkAddress });

    if (!courseDetails) {
      throw new ApiError(404, "Course does not exist!");
    }

    res.status(200).json({ courseDetails });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Internal Server Error");
  }
};

const addLectureToASection = async (req, res) => {
  const { sectionId, lectureId } = req.body;

  const existedSection = await Section.findById(sectionId);

  if (!existedSection) {
    throw new ApiError(400, "section doesn't exist with this id");
  }

  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    { $push: { lectures: lectureId } },
    { new: true }
  );

  res.status(200).json({
    message: "section updated",
    updatedSection,
  });
};

const addNewCourse = async (req, res) => {
  try {
    const { name, price, sections } = req.body;

    const sectionIds = [];

    for (const sec of sections) {
      const lectureIds = [];

      for (const lec of sec.lectures) {
        const newLecture = await Lecture.create({
          title: lec.title,
          videoURL: lec.videoURL,
          noteTitle: lec.noteTitle,
          noteURL: lec.noteURL,
        });
        lectureIds.push(newLecture._id);
      }

      const newSection = await Section.create({
        title: sec.title,
        lectures: lectureIds,
      });

      sectionIds.push(newSection._id);
    }

    const newCourse = await Course.create({
      name,
      price,
      section: sectionIds,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

const getFullCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
        populate: {
          path: "lectures",
        },
      })
      .lean();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getEnrolledCourses = async (req, res) => {
  const { courseIds } = req.body;
  const courses = await Course.find({ _id: { $in: courseIds } }).select("_id courseTitle");
  res.json({ courses });
};

export {
  createCourse,
  getAllCourses,
  addSection,
  addLecture,
  addLectureToASection,
  addNewCourse,
  getFullCourse,
  getCourseDetails,
  getEnrolledCourses
};
