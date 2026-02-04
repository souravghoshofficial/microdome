import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { MockTestBundle } from "../models/mockTestBundle.model.js";
import { MockTest } from "../models/mockTest.model.js";
import mongoose from "mongoose";


export const createMockTestBundle = async (req, res) => {
  try {
    const { title, description, actualPrice, discountedPrice } = req.body;

    if (!title || !description || actualPrice == null || discountedPrice == null) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and prices are required"
      });
    }

    if (Number(discountedPrice) > Number(actualPrice)) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than actual price"
      });
    }

    if (!req.files?.thumbnailImage?.[0]?.path) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required"
      });
    }

    const thumbnailUpload = await uploadOnCloudinary(
      req.files.thumbnailImage[0].path
    );

    if (!thumbnailUpload?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Thumbnail upload failed"
      });
    }

    const mockTestBundle = await MockTestBundle.create({
      title,
      description,
      actualPrice,
      discountedPrice,
      thumbnail: thumbnailUpload.secure_url
      // mockTestIds intentionally omitted
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


export const getMockTestBundles = async (req, res) => {
  try {
    const mockTestBundles = await MockTestBundle.find().populate('mockTestIds');

    return res.status(200).json({
      success: true,
      data: mockTestBundles
    });
  } catch (error) {
    console.error("Get Mock Test Bundles Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


export const updateMockTestBundleDetails = async (req, res) => {
  try {
    const { bundleId } = req.params;
    const { title, description, actualPrice, discountedPrice } = req.body;

    /* 1. Validate bundleId */
    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId"
      });
    }

    /* 2. Find bundle */
    const bundle = await MockTestBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Mock Test Bundle not found"
      });
    }

    /* 3. Basic validation */
    if (!title || !description || actualPrice == null || discountedPrice == null) {
      return res.status(400).json({
        success: false,
        message: "Title, description and prices are required"
      });
    }

    if (Number(discountedPrice) > Number(actualPrice)) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than actual price"
      });
    }

    /* 4. Handle optional thumbnail update */
    if (req.files?.thumbnailImage?.[0]?.path) {
      // Upload new thumbnail first
      const thumbnailUpload = await uploadOnCloudinary(
        req.files.thumbnailImage[0].path
      );

      if (!thumbnailUpload?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed"
        });
      }

      // Try deleting old thumbnail (NON-BLOCKING)
      if (bundle.thumbnail) {
        try {
          await deleteFromCloudinary(bundle.thumbnail);
        } catch (error) {
          console.error("Error deleting old thumbnail:", error);
          // Do NOT break execution
        }
      }

      // Update with new thumbnail
      bundle.thumbnail = thumbnailUpload.secure_url;
    }

    /* 5. Update other fields */
    bundle.title = title;
    bundle.description = description;
    bundle.actualPrice = actualPrice;
    bundle.discountedPrice = discountedPrice;

    await bundle.save();

    return res.status(200).json({
      success: true,
      message: "Mock Test Bundle updated successfully",
      data: bundle
    });

  } catch (error) {
    console.error("Update Mock Test Bundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



export const updateMockTestBundleStatus = async (req, res) => {
  try {
    const { bundleId } = req.params;
    const { isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId"
      });
    }

    // Validate payload
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean"
      });
    }

    const bundle = await MockTestBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Mock test bundle not found"
      });
    }

    // Update status
    bundle.isActive = isActive;
    await bundle.save();

    return res.status(200).json({
      success: true,
      message: `Bundle ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        _id: bundle._id,
        isActive: bundle.isActive
      }
    });
  } catch (error) {
    console.error("Update Bundle Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getMockTestBundleById = async (req, res) => {
  const { bundleId } = req.params;

  const bundle = await MockTestBundle.findById(bundleId)
    .populate({
      path: "mockTestIds",
      select: "title totalMarks durationMinutes accessType createdAt"
    });

  if (!bundle) {
    throw new ApiError(404, "Mock test bundle not found");
  }

  res.status(200).json({
    success: true,
    data: bundle
  });
};


export const addMockTestsToBundle = async (req, res) => {
  try {
    const { bundleId } = req.params;
    const { mockTestIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({ message: "Invalid bundleId" });
    }

    if (!Array.isArray(mockTestIds) || mockTestIds.length === 0) {
      return res.status(400).json({
        message: "mockTestIds must be a non-empty array"
      });
    }

    const bundle = await MockTestBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({ message: "Mock test bundle not found" });
    }

    // Filter valid ObjectIds only
    const validMockTestIds = mockTestIds.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validMockTestIds.length === 0) {
      return res.status(400).json({
        message: "No valid mockTestIds provided"
      });
    }

    // $addToSet prevents duplicates automatically
    await MockTestBundle.findByIdAndUpdate(
      bundleId,
      {
        $addToSet: {
          mockTestIds: { $each: validMockTestIds }
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Mock tests added to bundle successfully"
    });

  } catch (error) {
    console.error("Add MockTests To Bundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const removeMockTestFromBundle = async (req, res) => {
  try {
    const { bundleId, mockTestId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(bundleId) ||
      !mongoose.Types.ObjectId.isValid(mockTestId)
    ) {
      return res.status(400).json({
        message: "Invalid bundleId or mockTestId"
      });
    }

    const bundle = await MockTestBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        message: "Mock test bundle not found"
      });
    }

    await MockTestBundle.findByIdAndUpdate(
      bundleId,
      {
        $pull: { mockTestIds: mockTestId }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Mock test removed from bundle successfully"
    });

  } catch (error) {
    console.error("Remove MockTest From Bundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
