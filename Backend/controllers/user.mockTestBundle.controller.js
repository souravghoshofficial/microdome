import { MockTestBundle } from "../models/mockTestBundle.model.js";

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