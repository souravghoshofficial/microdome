import { MockTestBundle } from "../models/mockTestBundle.model.js";

export const getMockTestBundles = async (req, res) => {
  try {
    const mockTestBundles = await MockTestBundle.find({
      isActive: true
    })

    return res.status(200).json({
      success: true,
      message: "Mock test bundles retrieved successfully",
      data: mockTestBundles
    });
  } catch (error) {
    console.error("Get MockTestBundle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


