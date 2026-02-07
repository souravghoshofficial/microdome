import { MockTest } from "../models/mockTest.model.js";
import { MockTestSection } from "../models/mockTestSection.model.js";
import { MockTestQuestion } from "../models/mockTestQuestion.model.js";
import { MockTestBundle } from "../models/mockTestBundle.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createMockTest = async (req, res) => {
  try {
    const {
      title,
      mockTestType,
      description,
      durationMinutes,
      totalMarks,
      accessType,
      instructions,
      status
    } = req.body;

    // Basic validation
    if (
      !title ||
      !mockTestType ||
      !description ||
      !durationMinutes ||
      !totalMarks ||
      !accessType ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Create mock test
    const mockTest = await MockTest.create({
      title,
      mockTestType,
      description,
      durationMinutes,
      totalMarks,
      accessType,
      instructions,
      status: status || "DRAFT"
    });

    return res.status(201).json({
      success: true,
      message: "Mock test created successfully",
      data: mockTest
    });

  } catch (error) {
    console.error("Create MockTest Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const createMockTestSection = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const {
      title,
      questionType,
      totalQuestions,
      questionsToAttempt,
      sectionOrder
    } = req.body;

    // Validate mockTestId
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    // Check required fields
    if (
      !title ||
      !questionType ||
      !totalQuestions ||
      sectionOrder === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Validate questionsToAttempt
    if (questionsToAttempt !== undefined && questionsToAttempt !== null) {
      const qta = Number(questionsToAttempt);
      const tq = Number(totalQuestions);

      if (Number.isNaN(qta) || qta <= 0) {
        return res.status(400).json({
          success: false,
          message: "questionsToAttempt must be a positive number"
        });
      }

      if (qta > tq) {
        return res.status(400).json({
          success: false,
          message: "questionsToAttempt cannot be greater than totalQuestions"
        });
      }
    }

    // Check if MockTest exists
    const mockTestExists = await MockTest.findById(mockTestId);
    if (!mockTestExists) {
      return res.status(404).json({
        success: false,
        message: "MockTest not found"
      });
    }

    // Create section
    const section = await MockTestSection.create({
      mockTestId,
      title,
      questionType,
      totalQuestions: Number(totalQuestions),
      questionsToAttempt:
        questionsToAttempt !== undefined ? Number(questionsToAttempt) : null,
      sectionOrder
    });

    return res.status(201).json({
      success: true,
      message: "Mock test section created successfully",
      data: section
    });

  } catch (error) {
    console.error("Create MockTestSection Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const updateMockTestSection = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;
    const {
      title,
      questionType,
      totalQuestions,
      questionsToAttempt,
      sectionOrder
    } = req.body;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(mockTestId) ||
      !mongoose.Types.ObjectId.isValid(mockTestSectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId or mockTestSectionId"
      });
    }

    // Find section
    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Mock test section not found"
      });
    }

    // Count existing questions
    const questionCount = await MockTestQuestion.countDocuments({
      mockTestSectionId
    });

    // Prevent changing questionType if questions exist
    if (
      questionType !== undefined &&
      questionType !== section.questionType &&
      questionCount > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot change questionType after questions are added"
      });
    }

    // Prevent lowering totalQuestions below existing count
    if (
      totalQuestions !== undefined &&
      totalQuestions < questionCount
    ) {
      return res.status(400).json({
        success: false,
        message:
          `totalQuestions cannot be less than existing questions (${questionCount})`
      });
    }

    // Validate questionsToAttempt
    if (questionsToAttempt !== undefined && questionsToAttempt !== null) {
      const qta = Number(questionsToAttempt);

      const effectiveTotalQuestions =
        totalQuestions !== undefined
          ? Number(totalQuestions)
          : section.totalQuestions;

      if (Number.isNaN(qta) || qta <= 0) {
        return res.status(400).json({
          success: false,
          message: "questionsToAttempt must be a positive number"
        });
      }

      if (qta > effectiveTotalQuestions) {
        return res.status(400).json({
          success: false,
          message:
            "questionsToAttempt cannot be greater than totalQuestions"
        });
      }
    }

    /* ================= UPDATE FIELDS ================= */

    if (title !== undefined) section.title = title;
    if (questionType !== undefined) section.questionType = questionType;

    if (totalQuestions !== undefined)
      section.totalQuestions = Number(totalQuestions);

    if (questionsToAttempt !== undefined)
      section.questionsToAttempt =
        questionsToAttempt !== null ? Number(questionsToAttempt) : null;

    if (sectionOrder !== undefined)
      section.sectionOrder = Number(sectionOrder);

    await section.save();

    return res.status(200).json({
      success: true,
      message: "Mock test section updated successfully",
      data: section
    });

  } catch (error) {
    console.error("Update MockTestSection Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const deleteMockTestSection = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(mockTestId) || !mongoose.Types.ObjectId.isValid(mockTestSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId or mockTestSectionId"
      });
    }

    // Find section
    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Mock test section not found"
      });
    }

    // Block delete if questions exist
    const questionCount = await MockTestQuestion.countDocuments({
      mockTestSectionId
    });

    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete section. Delete all questions in this section first."
      });
    }

    await section.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Mock test section deleted successfully"
    });

  } catch (error) {
    console.error("Delete MockTestSection Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteAllMockTestSections = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    // Check mock test exists
    const mockTestExists = await MockTest.findById(mockTestId);
    if (!mockTestExists) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found"
      });
    }

    // Fetch all sections
    const sections = await MockTestSection.find({ mockTestId }).select("_id");

    if (sections.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No sections found to delete"
      });
    }

    const sectionIds = sections.map(s => s._id);

    // Check if any section has questions
    const questionExists = await MockTestQuestion.exists({
      mockTestSectionId: { $in: sectionIds }
    });

    if (questionExists) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete sections. One or more sections contain questions."
      });
    }

    // Delete all sections
    await MockTestSection.deleteMany({ mockTestId });

    return res.status(200).json({
      success: true,
      message: "All mock test sections deleted successfully"
    });

  } catch (error) {
    console.error("DeleteAllMockTestSections Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const createMockTestQuestion = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;

    let {
      questionType,
      questionText,
      options,
      correctAnswer,
      numericAnswer,
      tolerance,
      marks,
      negativeMarks = 0,
      questionOrder,
      answerExplanation
    } = req.body;

    // Parse JSON strings from multipart/form-data
    if (options && typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid options format"
        });
      }
    }

    if (correctAnswer && typeof correctAnswer === "string") {
      try {
        correctAnswer = JSON.parse(correctAnswer);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid correctAnswer format"
        });
      }
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(mockTestSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestSectionId"
      });
    }

    // Fetch section
    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "MockTestSection not found for this MockTest"
      });
    }

    // Required fields
    if (
      !questionType ||
      !questionText ||
      marks === undefined ||
      questionOrder === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Enforce section questionType
    if (questionType !== section.questionType) {
      return res.status(400).json({
        success: false,
        message: `Section only allows ${section.questionType} questions`
      });
    }

    // Enforce question limit
    const currentCount = await MockTestQuestion.countDocuments({
      mockTestSectionId
    });

    if (currentCount >= section.totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "Question limit reached for this section"
      });
    }

    // Prevent duplicate order
    const orderExists = await MockTestQuestion.findOne({
      mockTestSectionId,
      questionOrder
    });

    if (orderExists) {
      return res.status(409).json({
        success: false,
        message: "Question order already exists in this section"
      });
    }

    // ================= TYPE VALIDATION =================

    if (questionType === "NAT") {
      if (numericAnswer === undefined || numericAnswer === null) {
        return res.status(400).json({
          success: false,
          message: "numericAnswer is required for NAT questions"
        });
      }
    } else {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least two options are required for MCQ/MSQ"
        });
      }

      if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
        return res.status(400).json({
          success: false,
          message: "correctAnswer is required for MCQ/MSQ"
        });
      }

      // MCQ strict rule
      if (questionType === "MCQ" && correctAnswer.length !== 1) {
        return res.status(400).json({
          success: false,
          message: "MCQ must have exactly one correct answer"
        });
      }
    }

    // ================= IMAGE UPLOAD =================

    let questionImageUrl = null;
    const questionImageLocalPath = req.files?.questionImage?.[0]?.path;

    if (questionImageLocalPath) {
      const uploaded = await uploadOnCloudinary(questionImageLocalPath);
      if (!uploaded?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed"
        });
      }
      questionImageUrl = uploaded.secure_url;
    }

    // ================= CREATE =================

    const question = await MockTestQuestion.create({
      mockTestId,
      mockTestSectionId,
      questionType,
      questionText,
      questionImageUrl,
      options: questionType === "NAT" ? [] : options,
      correctAnswer: questionType === "NAT" ? [] : correctAnswer,
      numericAnswer: questionType === "NAT" ? numericAnswer : null,
      tolerance: questionType === "NAT" ? tolerance : null,
      marks,
      negativeMarks,
      questionOrder,
      answerExplanation
    });

    return res.status(201).json({
      success: true,
      message: "Mock test question created successfully",
      data: question
    });

  } catch (error) {
    console.error("Create MockTestQuestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const deleteMockTestQuestion = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId, questionId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(mockTestId) ||
      !mongoose.Types.ObjectId.isValid(mockTestSectionId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs provided"
      });
    }

    const question = await MockTestQuestion.findOne({
      _id: questionId,
      mockTestId,
      mockTestSectionId
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Mock test question not found"
      });
    }

    // Delete question image if exists
    if (question.questionImageUrl) {
      try {
        await deleteFromCloudinary(question.questionImageUrl);
      } catch (error) {
        console.error("Error deleting question image:", error);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete option images if exist
    if (question.options && question.options.length > 0) {
      for (const option of question.options) {
        if (option.imageUrl) {
          try {
            await deleteFromCloudinary(option.imageUrl);
          } catch (error) {
            console.error("Error deleting option image:", error);
            // Continue with deletion even if image deletion fails
          }
        }
      }
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Mock test question deleted successfully"
    });

  } catch (error) {
    console.error("Delete MockTestQuestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const deleteAllMockTestQuestions = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(mockTestId) ||
      !mongoose.Types.ObjectId.isValid(mockTestSectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs provided"
      });
    }

    // Verify section belongs to mock test
    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Mock test section not found"
      });
    }

    // Fetch all questions to delete their images
    const questions = await MockTestQuestion.find({
      mockTestId,
      mockTestSectionId
    });

    // Delete all images from Cloudinary
    for (const question of questions) {
      // Delete question image if exists
      if (question.questionImageUrl) {
        try {
          await deleteFromCloudinary(question.questionImageUrl);
        } catch (error) {
          console.error("Error deleting question image:", error);
          // Continue with deletion even if image deletion fails
        }
      }

      // Delete option images if exist
      if (question.options && question.options.length > 0) {
        for (const option of question.options) {
          if (option.imageUrl) {
            try {
              await deleteFromCloudinary(option.imageUrl);
            } catch (error) {
              console.error("Error deleting option image:", error);
              // Continue with deletion even if image deletion fails
            }
          }
        }
      }
    }

    // Delete all questions from database
    await MockTestQuestion.deleteMany({
      mockTestId,
      mockTestSectionId
    });

    return res.status(200).json({
      success: true,
      message: "All questions deleted successfully from this section"
    });

  } catch (error) {
    console.error("DeleteAllMockTestQuestions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateMockTestQuestion = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId, questionId } = req.params;

    let {
      questionText,
      correctAnswer,
      numericAnswer,
      tolerance,
      marks,
      negativeMarks,
      questionOrder,
      answerExplanation,
      options
    } = req.body;
    /* ================= VALIDATE IDS ================= */

    if (
      !mongoose.Types.ObjectId.isValid(mockTestId) ||
      !mongoose.Types.ObjectId.isValid(mockTestSectionId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs provided"
      });
    }

    /* ================= PARSE JSON FIELDS ================= */

    if (options && typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid options format"
        });
      }
    }

    if (correctAnswer && typeof correctAnswer === "string") {
      try { 
        correctAnswer = JSON.parse(correctAnswer);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid correctAnswer format"
        });
      }
    }

    /* ================= FETCH QUESTION ================= */

    const question = await MockTestQuestion.findOne({
      _id: questionId,
      mockTestId,
      mockTestSectionId
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Mock test question not found"
      });
    }

    /* ================= FETCH SECTION ================= */

    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Mock test section not found"
      });
    }

    /* ================= QUESTION TYPE RULES ================= */

    const questionType = question.questionType;

    if (questionType !== section.questionType) {
      return res.status(400).json({
        success: false,
        message: `Section only allows ${section.questionType} questions`
      });
    }

    if (questionType === "NAT") {
      if (options !== undefined || correctAnswer !== undefined) {
        return res.status(400).json({
          success: false,
          message: "NAT questions cannot have options or correctAnswer"
        });
      }

      if (numericAnswer === undefined && question.numericAnswer === null) {
        return res.status(400).json({
          success: false,
          message: "numericAnswer is required for NAT questions"
        });
      }
    } else {
      if (options !== undefined) {
        if (!Array.isArray(options) || options.length < 2) {
          return res.status(400).json({
            success: false,
            message: "At least two options are required"
          });
        }
      }

      if (correctAnswer !== undefined) {
        if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
          return res.status(400).json({
            success: false,
            message: "correctAnswer is required"
          });
        }

        if (questionType === "MCQ" && correctAnswer.length !== 1) {
          return res.status(400).json({
            success: false,
            message: "MCQ must have exactly one correct answer"
          });
        }
      }
    }

    /* ================= QUESTION ORDER CHECK ================= */

    if (questionOrder !== undefined && Number(questionOrder) !== question.questionOrder) {
      const orderExists = await MockTestQuestion.findOne({
        mockTestSectionId,
        questionOrder: Number(questionOrder),
        _id: { $ne: questionId } // Exclude the current question being updated
      });

      if (orderExists) {
        return res.status(409).json({
          success: false,
          message: "Question order already exists in this section"
        });
      }
    }

    /* ================= IMAGE UPDATE (SAFE REPLACE) ================= */

    const questionImageLocalPath = req.files?.questionImage?.[0]?.path;

    if (questionImageLocalPath) {
      // Upload new image first
      const uploaded = await uploadOnCloudinary(questionImageLocalPath);

      if (!uploaded?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Question image upload failed"
        });
      }

      // Delete old image (NON-BLOCKING)
      if (question.questionImageUrl) {
        try {
          await deleteFromCloudinary(question.questionImageUrl);
        } catch (error) {
          console.error("Error deleting old question image:", error);
          // Do NOT stop execution
        }
      }

      // Save new image URL
      question.questionImageUrl = uploaded.secure_url;
    }

    /* ================= UPDATE FIELDS ================= */

    if (questionText !== undefined) question.questionText = questionText;
    if (marks !== undefined) question.marks = Number(marks);
    if (negativeMarks !== undefined)
      question.negativeMarks = Number(negativeMarks);

    if (questionOrder !== undefined)
      question.questionOrder = Number(questionOrder);

    if (answerExplanation !== undefined)
      question.answerExplanation = answerExplanation;

    if (questionType === "NAT") {
      if (numericAnswer !== undefined)
        question.numericAnswer = Number(numericAnswer);

      if (tolerance !== undefined)
        question.tolerance = Number(tolerance);
    } else {
      if (options !== undefined) question.options = options;
      if (correctAnswer !== undefined)
        question.correctAnswer = correctAnswer;
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message: "Mock test question updated successfully",
      data: question
    });

  } catch (error) {
    console.error("Update MockTestQuestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getMockTests = async (req, res) => {
  try {
    const { accessType } = req.query;

    const filter = {};

    // Optional filter: FREE / PAID
    if (accessType) {
      filter.accessType = accessType;
    }

    const mockTests = await MockTest.find(filter)
  

    return res.status(200).json({
      success: true,
      message: "Mock tests fetched successfully",
      mockTests
    });
  } catch (error) {
    console.error("Get Mock Tests Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getMockTestById = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    const mockTest = await MockTest.findById(mockTestId);

    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: mockTest
    });
  } catch (error) {
    console.error("Get MockTestById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const getMockTestSections = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    // Validate mockTestId
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    // Check if mock test exists
    const mockTestExists = await MockTest.findById(mockTestId);
    if (!mockTestExists) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found"
      });
    }

    // Fetch sections (ordered)
    const sections = await MockTestSection.find({ mockTestId })
      .sort({ sectionOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Mock test sections fetched successfully",
      data: sections
    });

  } catch (error) {
    console.error("Get MockTestSections Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getMockTestSectionQuestions = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(mockTestId) ||
      !mongoose.Types.ObjectId.isValid(mockTestSectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId or mockTestSectionId"
      });
    }

    // Check section exists and belongs to mock test
    const section = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "MockTestSection not found for this MockTest"
      });
    }

    // Fetch questions (ordered)
    const questions = await MockTestQuestion.find({
      mockTestId,
      mockTestSectionId
    }).sort({ questionOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Mock test section questions fetched successfully",
      data: {
        section: {
          _id: section._id,
          title: section.title,
          questionType: section.questionType,
          totalQuestions: section.totalQuestions
        },
        questions
      }
    });

  } catch (error) {
    console.error("Get MockTestSectionQuestions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const updateMockTest = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    const {
      title,
      description,
      instructions,
      durationMinutes,
      totalMarks,
      accessType,
      status
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found"
      });
    }

    // Prevent editing mockTestType after sections exist
    const sectionCount = await MockTestSection.countDocuments({ mockTestId });

    if (sectionCount > 0 && req.body.mockTestType) {
      return res.status(400).json({
        success: false,
        message: "mockTestType cannot be changed once sections are added"
      });
    }

    /* ================= UPDATE ALLOWED FIELDS ================= */

    if (title !== undefined) mockTest.title = title;
    if (description !== undefined) mockTest.description = description;

    if (instructions !== undefined) {
    if (!Array.isArray(instructions)) {
    return res.status(400).json({
      success: false,
      message: "Instructions must be an array of strings"
    });
  }

  mockTest.instructions = instructions
    .map(i => String(i).trim())
    .filter(Boolean);
}


    if (durationMinutes !== undefined)
      mockTest.durationMinutes = Number(durationMinutes);

    if (totalMarks !== undefined)
      mockTest.totalMarks = Number(totalMarks);

    if (accessType !== undefined) mockTest.accessType = accessType;
    if (status !== undefined) mockTest.status = status;

    await mockTest.save();

    return res.status(200).json({
      success: true,
      message: "Mock test updated successfully",
      data: mockTest
    });

  } catch (error) {
    console.error("Update MockTest Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const deleteMockTest = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId"
      });
    }

    // Check mock test exists
    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found"
      });
    }

    // Block delete if sections exist
    const sectionCount = await MockTestSection.countDocuments({
      mockTestId
    });

    if (sectionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete mock test. Delete all sections first."
      });
    }

    // REMOVE MOCK TEST FROM ALL BUNDLES
    await MockTestBundle.updateMany(
      { mockTestIds: mockTestId },
      { $pull: { mockTestIds: mockTestId } }
    );

    // DELETE MOCK TEST
    await mockTest.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Mock test deleted successfully and removed from all bundles"
    });

  } catch (error) {
    console.error("Delete MockTest Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

