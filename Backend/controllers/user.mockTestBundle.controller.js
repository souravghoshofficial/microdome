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
