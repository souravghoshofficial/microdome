import { MockTestBundle } from "../models/mockTestBundle.model.js";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";
import { MockTestResult } from "../models/mockTestResult.model.js";

import mongoose from "mongoose";
import { MockTest } from "../models/mockTest.model.js";

export const getMockTestBundles = async (req, res) => {
  try {
    const bundles = await MockTestBundle.find({ isActive: true })
      .populate({
        path: "mockTestIds",
        match: { status: "PUBLISHED" }, 
        select: "_id"
      })
      .select("title description actualPrice discountedPrice mockTestIds thumbnail")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Mock test bundles retrieved successfully",
      data: bundles
    });
  } catch (error) {
    console.error("Get MockTestBundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getMockTestBundleById = async (req, res) => {
  const { bundleId } = req.params;

  try {
    const bundle = await MockTestBundle.findById(bundleId)
      .populate({
        path: "mockTestIds",
        match: { status: "PUBLISHED" },
        select: "_id title description durationMinutes totalMarks"
      })
      .select("title description actualPrice discountedPrice mockTestIds thumbnail")
      .lean();

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Mock test bundle not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mock test bundle retrieved successfully",
      data: bundle
    });
  } catch (error) {
    console.error("Get MockTestBundleById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getEnrolledMockTestBundles = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await MockTestBundleEnrollment
      .find({ userId })
      .populate({
        path: "bundleId",
        match: { isActive: true } // only active bundles
      });

    // Remove null bundles (in case some are inactive)
    const bundles = enrollments
      .map((enrollment) => enrollment.bundleId)
      .filter((bundle) => bundle !== null);

    return res.status(200).json({
      bundles,
      message: "Enrolled mock test bundles fetched successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled bundles",
      error: error.message
    });
  }
};


export const getEnrolledBundleDetailsByBundleId = async (req, res) => {
  try {
    const { bundleId } = req.params;
    const userId = req.user._id; // assuming auth middleware

    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId",
      });
    }

    const bundle = await MockTestBundle.findById(bundleId);

    if (!bundle || !bundle.isActive) {
      return res.status(404).json({
        success: false,
        message: "Bundle not found or inactive",
      });
    }

    /* ================= MOCK TESTS ================= */

    const mockTests = await MockTest.find({
      _id: { $in: bundle.mockTestIds },
      status: "PUBLISHED",
    }).select("-instructions");

    /* ================= USER ATTEMPTS AGG ================= */

    const attemptStats = await MockTestResult.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          mockTestId: { $in: mockTests.map((m) => m._id) },
        },
      },
      {
        $group: {
          _id: "$mockTestId",
          attemptsUsed: { $sum: 1 },
        },
      },
    ]);

    // convert to map for fast lookup
    const attemptsMap = {};
    attemptStats.forEach((a) => {
      attemptsMap[a._id.toString()] = a.attemptsUsed;
    });

    /* ================= MERGE STATE ================= */

    const mockTestsWithState = mockTests.map((test) => {
      const attemptsUsed = attemptsMap[test._id.toString()] || 0;

      const attempted = attemptsUsed > 0;
      const reattempt = attemptsUsed < test.allowedAttempts;

      return {
        ...test.toObject(),
        attempted,
        reattempt,
        attemptsUsed,
        allowedAttempts: test.allowedAttempts,
      };
    });

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      bundle: {
        _id: bundle._id,
        title: bundle.title,
        description: bundle.description,
        thumbnail: bundle.thumbnail,
      },
      mockTests: mockTestsWithState,
    });
  } catch (error) {
    console.error("Get Enrolled Bundle Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

