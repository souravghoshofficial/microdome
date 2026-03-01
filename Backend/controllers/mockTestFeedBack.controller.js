import { MockTestFeedBack } from "../models/mockTestFeedBack.model.js";
import mongoose from "mongoose";


export const submitFeedBack = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mock Test Id",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be 1–5",
      });
    }

    const feedback = await MockTestFeedBack.findOneAndUpdate(
      { userId, mockTestId },
      {
        rating,
        review,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: "Feedback submitted",
      data: feedback,
    });
  } catch (e) {
    console.error("submitFeedBack", e);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const markFeedbackPrompted = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({ success: false });
    }

    await MockTestFeedBack.updateOne(
      { userId, mockTestId },
      {
        $setOnInsert: {
          userId,
          mockTestId,
          promptedAt: new Date(),
          rating: null,
        },
      },
      { upsert: true }
    );

    return res.json({ success: true });
  } catch (e) {
    console.error("markFeedbackPrompted", e);
    res.status(500).json({ success: false });
  }
};


export const checkFeedbackPrompt = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockTestId",
      });
    }

    const existing = await MockTestFeedBack.findOne({
      userId,
      mockTestId,
    })

    return res.status(200).json({
      success: true,
      showFeedback: !existing
    });
  } catch (error) {
    console.error("checkFeedbackPrompt error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check feedback status",
    });
  }
};