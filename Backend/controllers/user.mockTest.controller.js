import mongoose from "mongoose";
import { MockTest } from "../models/mockTest.model.js";

export const getMockTests = async (req, res) => {
  try {
    const mockTests = await MockTest.find({
      accessType: "FREE",
      status: "PUBLISHED"
    })

    return res.status(200).json({
      success: true,
      message: "Free & published mock tests retrieved successfully",
      data: mockTests
    });
  } catch (error) {
    console.error("Get MockTests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getMockTestInstructions = async (req, res) => {
  try {
    const { mockTestId } = req.params;

    // Validate ID presence
    if (!mockTestId) {
      return res.status(400).json({
        success: false,
        message: "Mock Test ID is required.",
      });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mock Test ID format.",
      });
    }

    // Fetch mock test (only instructions field if needed)
    const mockTest = await MockTest.findById(mockTestId)
      .select("instructions title durationMinutes totalMarks mockTestType") // adjust fields as needed
      .lean();

    // Check if mock test exists
    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock Test not found.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Mock Test instructions fetched successfully.",
      data: mockTest,
    });

  } catch (error) {
    console.error("Error fetching mock test instructions:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};