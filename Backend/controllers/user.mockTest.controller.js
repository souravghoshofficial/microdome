import { MockTest } from "../models/mockTest.model.js";


export const getMockTests = async (req, res) => {
  try {
    const mockTests = await MockTest.find().populate("sections");

    return res.status(200).json({
      success: true,
      message: "Mock tests retrieved successfully",
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