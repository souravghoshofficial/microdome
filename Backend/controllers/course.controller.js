import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { notifyStudentsNewLecture } from "../utils/sendLectureNotification.js";

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
    courseDescription,
    whatsappLink,
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
      courseDescription &&
      whatsappLink
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const courseImageLocalPath = req.files?.courseImage[0]?.path;

  if (!courseImageLocalPath) {
    throw new ApiError(400, "Course Image is missing");
  }

  const uploadedcourseImage = await uploadOnCloudinary(courseImageLocalPath);

  if (!uploadedcourseImage?.secure_url) {
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
      courseImage: uploadedcourseImage.secure_url,
      linkAddress,
      courseTitle,
      courseDescription,
      whatsappLink,
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
  const courses = await Course.find({}).select("-sections -__v").sort({_id: -1});

  res.status(200).json({
    message: "All courses fetched successfully",
    courses,
  });
};

const addLecture = async (req, res) => {
  try {
    const { title, videoURL, noteTitle, sectionId } = req.body;

    if (!sectionId) {
      throw new ApiError(400, "sectionId is required");
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    if (!title || !videoURL) {
      throw new ApiError(400, "Both lecture title and video URL are required");
    }

    let uploadedNoteURL = null;
    const noteURLlocalPath = req.files?.noteURL?.[0]?.path;

    if (noteURLlocalPath) {
      uploadedNoteURL = await uploadOnCloudinary(noteURLlocalPath);
      if (!uploadedNoteURL?.secure_url) {
        throw new ApiError(400, "Error while uploading the note");
      }
    }

    const lecture = await Lecture.create({
      title,
      videoURL,
      noteTitle: noteTitle || "",
      noteURL: uploadedNoteURL?.secure_url || "",
    });

    if (!lecture) {
      throw new ApiError(500, "Error while creating lecture");
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { lectures: lecture._id } },
      { new: true }
    );

    // Notify enrolled students about the new lecture
    await notifyStudentsNewLecture({
       courseId: section.courseId,
       lectureTitle: lecture.title
    });

    res.status(201).json({
      message: "Lecture added successfully",
      lecture,
      section: updatedSection,
    });
  } catch (error) {
    console.error("Error in addLecture:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const addSection = async (req, res) => {
  try {
    const { sectionTitle, lectureTitle, videoURL, noteTitle, courseId } =
      req.body;

    if (!(sectionTitle && lectureTitle && videoURL && courseId)) {
      return res.status(400).json({
        message:
          "sectionTitle, lectureTitle, videoURL, and courseId are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(400, "Course not found while creating section");
    }

    // Optional note upload
    const noteURLlocalPath = req.files?.noteURL?.[0]?.path || null;

    let uploadedNoteURL = null;
    if (noteURLlocalPath) {
      uploadedNoteURL = await uploadOnCloudinary(noteURLlocalPath);
    }

    const lecture = await Lecture.create({
      title: lectureTitle,
      videoURL,
      noteTitle: noteTitle || "",
      noteURL: uploadedNoteURL?.secure_url || "",
    });

    if (!lecture) {
      throw new ApiError(400, "Error while creating lecture");
    }

    const section = await Section.create({
      courseId: course._id,
      title: sectionTitle,
      lectures: [lecture._id],
    });

    if (!section) {
      throw new ApiError(400, "Error while creating section");
    }

    course.sections.push(section._id);
    await course.save();

    res.status(200).json({
      message: "Section created successfully",
      section,
      lecture,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const courseDetails = await Course.findOne({ _id: id });

    if (!courseDetails) {
      throw new ApiError(404, "Course does not exist!");
    }

    res.status(200).json({ course: courseDetails });
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
  const courses = await Course.find({ _id: { $in: courseIds } }).select(
    "_id courseTitle"
  );
  res.json({ courses });
};

const getAllSections = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
      })
      .lean();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const sections = course.sections;
    return res.status(200).json({ success: true, sections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
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
  getEnrolledCourses,
  getAllSections,
};
