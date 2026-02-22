import mongoose from "mongoose";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";
import { MockTest } from "../models/mockTest.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";


export const checkMockTestBundleEnrollment = async (req, res, next) => {
  try {
    const user = req.user;
    const { bundleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId"
      });
    }

    const enrollment = await MockTestBundleEnrollment.findOne({
      bundleId,
      userId: user._id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this bundle"
      });
    }

    next();

  } catch (error) {
    console.error("Check MockTest Enrollment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const checkMockTestEnrollment = async (req, res, next) => {
  try {
    const { mockTestId } = req.params;

    // Validate mockTestId presence
    if (!mockTestId) {
      return res.status(400).json({
        success: false,
        message: "Mock Test ID is required.",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mock Test ID.",
      });
    }

    // Validate authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Fetch mock test
    const mockTest = await MockTest.findById(mockTestId).lean();

    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock Test not found.",
      });
    }

    // If FREE test → allow access
    if (mockTest.accessType === "FREE") {
      return next();   // ✅ FIXED (return added)
    }

    // If PAID but no bundleId linked
    if (!mockTest.bundleId) {
      return res.status(400).json({
        success: false,
        message: "Mock Test bundle configuration error.",
      });
    }

    // Check enrollment
    const enrollment = await MockTestBundleEnrollment.findOne({
      bundleId: mockTest.bundleId,
      userId: req.user._id,
    }).lean();

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this mock test.",
      });
    }

    // All good
    return next();

  } catch (error) {
    console.error("Enrollment check error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const checkAttemptOwnership = async (req,res,next)=>{
  const { attemptId } = req.params;
  const attempt = await MockTestAttempt.findById(attemptId);

  if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message:"Forbidden" });
  }

  req.attempt = attempt;
  next();
};