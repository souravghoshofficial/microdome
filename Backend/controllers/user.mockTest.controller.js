import mongoose from "mongoose";
import { MockTest } from "../models/mockTest.model.js";
import { MockTestResult } from "../models/mockTestResult.model.js";

export const getFreeMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find({
      accessType: "FREE",
      status: "PUBLISHED",
    });

    // not logged in → return plain
    if (!req.user) {
      return res.status(200).json({ success: true, message: "Tests retrieved successfully", data: tests });
    }

    // logged in → attach attempt state
    const userId = req.user._id;

    const ids = tests.map(t => t._id);

    const results = await MockTestResult.aggregate([
      { $match: { userId, mockTestId: { $in: ids } } },
      { $group: { _id: "$mockTestId", attemptsUsed: { $sum: 1 } } }
    ]);

    const map = new Map();
    results.forEach(r => map.set(r._id.toString(), r.attemptsUsed));

    const enriched = tests.map(t => {
      const attemptsUsed = map.get(t._id.toString()) || 0;
      const attempted = attemptsUsed > 0;
      const reattempt = attemptsUsed < t.allowedAttempts;

      return {
        ...t.toObject(),
        attempted,
        reattempt,
        attemptsUsed
      };
    });

    return res.json({ data: enriched });

  } catch (e) {
    res.status(500).json({ message: "Failed to load tests" });
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