import mongoose from "mongoose";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";

export const checkMockTestEnrollment = async (req, res, next) => {
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