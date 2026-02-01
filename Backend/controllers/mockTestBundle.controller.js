import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { MockTestBundle } from "../models/mockTestBundle.model.js";
import { MockTest } from "../models/mockTest.model.js";


export const createMockTestBundle = async (req, res) => {
  try {
    const { title, description, price, mockTestIds } = req.body;

    // basic validation
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // thumbnail validation
    if (!req.files?.thumbnailImage[0]?.path) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required"
      });
    }

    // upload thumbnail to cloudinary
    const thumbnailUpload = await uploadOnCloudinary(req.files?.thumbnailImage[0]?.path);

    if (!thumbnailUpload?.url) {
      return res.status(500).json({
        success: false,
        message: "Thumbnail upload failed"
      });
    }

    // parse mockTestIds if coming as string
    const parsedMockTestIds =
      typeof mockTestIds === "string"
        ? JSON.parse(mockTestIds)
        : mockTestIds;

    // validate mockTestIds existence
    const existingMockTests = await MockTest.find({
      _id: { $in: parsedMockTestIds }
    });

    if (existingMockTests.length !== parsedMockTestIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more Mock Tests are invalid"
      });
    }

    // create bundle
    const mockTestBundle = await MockTestBundle.create({
      title,
      description,
      price,
      thumbnail: thumbnailUpload.url,
      mockTestIds: parsedMockTestIds
    });

    return res.status(201).json({
      success: true,
      message: "Mock Test Bundle created successfully",
      data: mockTestBundle
    });

  } catch (error) {
    console.error("Create Mock Test Bundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};