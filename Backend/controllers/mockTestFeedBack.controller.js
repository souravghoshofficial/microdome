import { MockTestFeedBack } from "../models/mockTestFeedBack.model.js";
import mongoose from "mongoose";
import { MockTest } from "../models/mockTest.model.js";

export const submitFeedBack = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const { rating, review } = req.body;

    // Validate mockTestId
    if (!mockTestId) {
      return res.status(400).json({
        success: false,
        message: "Mock Test Id is required."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mock Test Id."
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5."
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user."
      });
    }

    // Check if mock test exists
    const mockTest = await MockTest.findById(mockTestId);

    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock Test not found."
      });
    }

    // Check if feedback already exists
    const existingFeedBack = await MockTestFeedBack.findOne({
      userId: user._id,
      mockTestId
    });

    let feedback;

    if (existingFeedBack) {
      // Update existing feedback
      existingFeedBack.rating = rating;
      existingFeedBack.review = review || existingFeedBack.review;

      feedback = await existingFeedBack.save();

      return res.status(200).json({
        success: true,
        message: "Feedback updated successfully.",
        data: feedback
      });
    }

    // Create new feedback
    feedback = await MockTestFeedBack.create({
      userId: user._id,
      mockTestId,
      rating,
      review
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback
    });

  } catch (error) {
    console.error("Submit Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};