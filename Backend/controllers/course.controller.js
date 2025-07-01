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
  try {
    const { title, videoURL, noteURL, noteTitle, sectionId } = req.body;
  
    if(!sectionId){
      throw new ApiError(400, "sectionId is required");
    }
    
    const section = await Section.findById(sectionId);
  
    if(!section){
      throw new ApiError(400, "section not found");
    }
  
    if (!videoURL && !title) {
      throw new ApiError(400, "video title and video url is required");
    }
  
    const noteURLlocalPath = req.files?.noteURL[0]?.path;
    
      if (!noteURLlocalPath) {
        throw new ApiError(400, "Note is missing");
      }
    
      const uploadedNoteURL = await uploadOnCloudinary(noteURLlocalPath);
    
      if (!uploadedNoteURL?.url) {
        throw new ApiError(400, "Error while uploading the note");
      }
    
      const lecture = await Lecture.create({
        title,
        videoURL,
        noteTitle,
        noteURL: uploadedNoteURL.url
      })
  
      if(!lecture){
        throw new ApiError(400,"Error while creating lecture");
      }
  
      section.lectures.push(lecture._id);

      section.save();

      res.status(201).json({
        message: "Lecture added successfully"
      })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong"
    })
  }


};

const addSection = async (req, res) => {
  try {
    const { sectionTitle, lectureTitle,videoURL,noteTitle,noteURL,courseId } = req.body;
    
    if(!(sectionTitle && lectureTitle && videoURL && courseId)){
      res.status(400).json({
        message: "All of these fields are required"
      });
    }
    const course = await Course.findById(courseId);
  
    if(!course){
      throw new ApiError(400,"Error while creating section");
    }
    const noteURLlocalPath = req.files?.noteURL[0]?.path;
  
    if (!noteURLlocalPath) {
      throw new ApiError(400, "Note is missing");
    }
  
    const uploadedNoteURL = await uploadOnCloudinary(noteURLlocalPath);
  
    if (!uploadedNoteURL?.url) {
      throw new ApiError(400, "Error while uploading the note");
    }
  
    const lecture = await Lecture.create({
      title: lectureTitle,
      videoURL,
      noteTitle,
      noteURL: uploadedNoteURL.url
    })
  
    if(!lecture){
      throw new ApiError(400,"Error while creating lecture");
    }
  
    const section = await Section.create({
      title: sectionTitle,
      lectures: [lecture._id]
    });
  
     if(!section){
      throw new ApiError(400,"Error while creating section");
    }
    course.sections.push(section._id);
  
    course.save();
  
    res.status(200).json({
      message: "section created successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong"
    })
  }
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

const getAllSections = async (req,res) => {
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
    const sections=course.sections;
    return res.status(200).json({ success: true, sections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }

}

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
  getAllSections
};
