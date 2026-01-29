import { MockTest } from "../models/mockTest.model.js";
import { MockTestSection } from "../models/mockTestSection.model.js";
import { MockTestQuestion } from "../models/mockTestQuestion.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import mongoose from "mongoose";

export const createMockTest = async (req, res) => {
  try {
    const {
      name,
      mockTestType,
      description,
      durationMinutes,
      totalMarks,
      accessType,
      instructions,
      status
    } = req.body;

    // 🔍 Basic validation
    if (
      !name ||
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

    // 🧠 Create mock test
    const mockTest = await MockTest.create({
      name,
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
      mockTestTitle,
      questionType,
      totalQuestions,
      mandatoryQuestions,
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
      !mockTestTitle ||
      !questionType ||
      !totalQuestions ||
      sectionOrder === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
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
      mockTestTitle,
      questionType,
      totalQuestions,
      mandatoryQuestions: mandatoryQuestions ?? null,
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


export const createMockTestQuestion = async (req, res) => {
  try {
    const { mockTestId, mockTestSectionId } = req.params;

    const {
      questionType,
      questionText,
      questionImageUrl,
      options,
      correctAnswer,
      numericAnswer,
      tolerance,
      marks,
      negativeMarks,
      questionOrder,
      answerExplanation
    } = req.body;



    // Validate section ID
    if (!mongoose.Types.ObjectId.isValid(mockTestSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestSectionId"
      });
    }

    // Check section exists & belongs to mockTest
    const sectionExists = await MockTestSection.findOne({
      _id: mockTestSectionId,
      mockTestId
    });

    if (!sectionExists) {
      return res.status(404).json({
        success: false,
        message: "MockTestSection not found for this MockTest"
      });
    }

    // Required fields
    if (!questionType || !questionText || !marks || questionOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Prevent duplicate question order in same section
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

    // Type-specific validation
    if (questionType === "NAT") {
      if (numericAnswer === null || numericAnswer === undefined) {
        return res.status(400).json({
          success: false,
          message: "numericAnswer is required for NAT questions"
        });
      }
    } else {
      if (!options || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least two options are required for MCQ/MSQ"
        });
      }

      if (!correctAnswer || correctAnswer.length === 0) {
        return res.status(400).json({
          success: false,
          message: "correctAnswer is required for MCQ/MSQ"
        });
      }
    }

      const questionImageLocalPath = req.files?.questionImage[0]?.path;
    
      const questionImage = await uploadOnCloudinary(questionImageLocalPath);


    // Create question
    const question = await MockTestQuestion.create({
      mockTestSectionId,
      questionType,
      questionText,
      questionImageUrl: questionImage?.url || null,
      options: options || [],
      correctAnswer: correctAnswer || [],
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

