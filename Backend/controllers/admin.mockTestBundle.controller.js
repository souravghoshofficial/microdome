import mongoose from "mongoose";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { MockTestBundle } from "../models/mockTestBundle.model.js";
import { MockTest } from "../models/mockTest.model.js";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";
import { MockTestAttempt } from "../models/mockTestAttempt.model.js";
import { MockTestAnswer } from "../models/mockTestAnswers.model.js";
import { MockTestResult } from "../models/mockTestResult.model.js";
import ExcelJS from "exceljs";
import { User } from "../models/user.model.js"

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
      select: "title status totalMarks durationMinutes accessType createdAt"
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
        message: "mockTestIds must be a non-empty array",
      });
    }

    const bundle = await MockTestBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({ message: "Mock test bundle not found" });
    }

    const validMockTestIds = mockTestIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validMockTestIds.length === 0) {
      return res.status(400).json({
        message: "No valid mockTestIds provided",
      });
    }

    // 1️⃣ Add mock tests to bundle (no duplicates)
    await MockTestBundle.findByIdAndUpdate(
      bundleId,
      {
        $addToSet: {
          mockTestIds: { $each: validMockTestIds },
        },
      },
      { new: true }
    );

    // 2️⃣ Update MockTests with bundleId
    await MockTest.updateMany(
      { _id: { $in: validMockTestIds } },
      { $set: { bundleId } }
    );

    return res.status(200).json({
      success: true,
      message: "Mock tests added to bundle and updated successfully",
    });
  } catch (error) {
    console.error("Add MockTests To Bundle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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

    // Remove from bundle
    await MockTestBundle.findByIdAndUpdate(bundleId, {
      $pull: { mockTestIds: mockTestId }
    });

    // Remove bundleId ONLY if it matches
    await MockTest.updateOne(
      { _id: mockTestId, bundleId },
      { $set: { bundleId: null } }
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



export const getAllBundlesWithEnrollmentCount = async (req, res) => {
  try {
    /* ===============================
       AGGREGATE ENROLLMENT COUNTS
    =============================== */
    const counts = await MockTestBundleEnrollment.aggregate([
      {
        $group: {
          _id: "$bundleId",
          enrolledCount: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map();
    counts.forEach((c) =>
      countMap.set(c._id.toString(), c.enrolledCount)
    );

    /* ===============================
       FETCH ALL BUNDLES
    =============================== */
    const bundles = await MockTestBundle.find({})
      .select("title description isActive thumbnail")
      .sort({ createdAt: -1 })
      .lean();

    /* ===============================
       MERGE COUNTS
    =============================== */
    const data = bundles.map((b) => ({
      bundleId: b._id,
      title: b.title,
      description: b.description,
      thumbnail: b.thumbnail,
      isActive: b.isActive,
      enrolledCount: countMap.get(b._id.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      bundles: data,
      totalBundles: data.length,
    });
  } catch (error) {
    console.error("getAllBundlesWithEnrollmentCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load bundle stats",
    });
  }
};


export const getBundleStudents = async (req, res) => {
  try {
    const { bundleId } = req.params;

    /* ===============================
       VALIDATE
    =============================== */
    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId",
      });
    }

    /* ===============================
       FETCH BUNDLE META
    =============================== */
    const bundle = await MockTestBundle.findById(bundleId)
      .select("title")
      .lean();

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Bundle not found",
      });
    }

    /* ===============================
       FETCH ENROLLED STUDENTS
    =============================== */
    const enrollments = await MockTestBundleEnrollment.find({
      bundleId,
    })
      .populate({
        path: "userId",
        select:
          "name email mobileNumber profileImage instituteName presentCourseOfStudy",
      })
      .sort({ createdAt: -1 })
      .lean();

    /* ===============================
       SHAPE RESPONSE
    =============================== */
    const students = enrollments.map((e) => ({
      userId: e.userId?._id || null,
      name: e.userId?.name || "",
      email: e.userId?.email || "",
      mobileNumber: e.userId?.mobileNumber || "",
      profileImage: e.userId?.profileImage || null,
      instituteName: e.userId?.instituteName || "",
      presentCourseOfStudy: e.userId?.presentCourseOfStudy || "",
      enrolledAt: e.createdAt,
    }));

    /* ===============================
       RESPONSE
    =============================== */
    return res.status(200).json({
      success: true,
      bundle: {
        _id: bundleId,
        title: bundle.title,
      },
      students,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error("getBundleStudents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load bundle students",
    });
  }
};


export const deleteEnrollmentsAndResults = async (req, res) => {
  const { bundleId } = req.params;

  // 1️⃣ Validate bundleId presence
  if (!bundleId) {
    return res.status(400).json({
      success: false,
      message: "Bundle ID is required",
    });
  }

  // 2️⃣ Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(bundleId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Bundle ID format",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3️⃣ Find all attempts related to this bundle
    const attempts = await MockTestAttempt.find({ bundleId }).session(session);

    const attemptIds = attempts.map((attempt) => attempt._id);

    // 4️⃣ Delete Answers (based on attemptIds)
    if (attemptIds.length > 0) {
      await MockTestAnswer.deleteMany({
        attemptId: { $in: attemptIds },
      }).session(session);
    }

    // 5️⃣ Delete Results
    await MockTestResult.deleteMany({ bundleId }).session(session);

    // 6️⃣ Delete Attempts
    await MockTestAttempt.deleteMany({ bundleId }).session(session);

    // 7️⃣ Delete Enrollments
    await MockTestBundleEnrollment.deleteMany({ bundleId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "All enrollments, attempts, answers and results deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Delete Bundle Related Data Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting bundle data",
      error: error.message,
    });
  }
};



export const exportBundleStudentsExcel = async (req, res) => {
  try {
    const { bundleId } = req.params;

    /* ===============================
       VALIDATE
    =============================== */
    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bundleId",
      });
    }

    /* ===============================
       BUNDLE META
    =============================== */
    const bundle = await MockTestBundle.findById(bundleId)
      .select("title")
      .lean();

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Bundle not found",
      });
    }

    /* ===============================
       ENROLLMENTS + USER
    =============================== */
    const enrollments = await MockTestBundleEnrollment.find({ bundleId })
      .populate({
        path: "userId",
        select:
          "name email mobileNumber profileImage instituteName presentCourseOfStudy",
      })
      .sort({ createdAt: -1 })
      .lean();

    const students = enrollments.map((e) => ({
      name: e.userId?.name || "",
      email: e.userId?.email || "",
      mobileNumber: e.userId?.mobileNumber || "",
      instituteName: e.userId?.instituteName || "",
      presentCourseOfStudy: e.userId?.presentCourseOfStudy || "",
      enrolledAt: e.createdAt,
    }));

    /* ===============================
       CREATE EXCEL
    =============================== */
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Bundle Students");

    /* ===== META BLOCK ===== */
    sheet.addRow(["Bundle Title", bundle.title]);
    sheet.addRow([
      "Exported At",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ]);
    sheet.addRow([]);

    /* ===== HEADER ===== */
    const header = sheet.addRow([
      "Name",
      "Email",
      "Mobile Number",
      "Institute Name",
      "Present Course",
      "Enrolled At (IST)",
    ]);
    header.font = { bold: true };

    /* ===== DATA ===== */
    students.forEach((s) => {
      sheet.addRow([
        s.name,
        s.email,
        s.mobileNumber,
        s.instituteName,
        s.presentCourseOfStudy,
        s.enrolledAt
          ? new Date(s.enrolledAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : "",
      ]);
    });

    /* ===== WIDTH ===== */
    sheet.columns = [
      { width: 25 },
      { width: 30 },
      { width: 25 },
      { width: 20 },
      { width: 22 },
    ];

    /* ===============================
       SEND FILE
    =============================== */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${bundle.title.replace(/\s+/g, "_")}_students.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("exportBundleStudentsExcel error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export students",
    });
  }
};