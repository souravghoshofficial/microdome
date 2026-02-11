import { MonthlyFee } from "../models/monthlyFee.model.js";
import { Course } from "../models/course.model.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import mongoose from "mongoose";


const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
];

const getCurrentMonthKey = () =>
  MONTH_KEYS[new Date().getMonth()];

export const markMonthlyFeePaid = async (req, res) => {
  try {
    const { userId, courseId, year, month } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or courseId",
      });
    }

    if (!year || !MONTHS.includes(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year or month",
      });
    }

    let record = await MonthlyFee.findOne({ userId, courseId, year });

    // Create sheet if missing (important for existing students)
    if (!record) {
      record = await MonthlyFee.create({
        userId,
        courseId,
        year,
        startedFromMonth: month,
      });
    }

    // Mark paid
    record.months[month].paid = true;
    record.months[month].paidAt = new Date(); // UTC (Mongo standard)

    await record.save();

    return res.status(200).json({
      success: true,
      message: `Marked ${month.toUpperCase()} as PAID`,
    });
  } catch (error) {
    console.error("Mark Fee Paid Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const markMonthlyFeeUnpaid = async (req, res) => {
  try {
    const { userId, courseId, year, month } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or courseId",
      });
    }

    if (!year || !MONTHS.includes(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid year or month",
      });
    }

    const record = await MonthlyFee.findOne({ userId, courseId, year });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Monthly fee record not found",
      });
    }

    record.months[month].paid = false;
    record.months[month].paidAt = null;

    await record.save();

    return res.status(200).json({
      success: true,
      message: `Marked ${month.toUpperCase()} as UNPAID`,
    });
  } catch (error) {
    console.error("Mark Fee Unpaid Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getCourseMonthlyFeesByYear = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    if (!year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "Year is required and must be a number",
      });
    }

    const records = await MonthlyFee.find({
      courseId,
      year: Number(year),
    })
      .populate({
        path: "userId",
        select: "name email profileImage",
      })
      .populate({
        path: "courseId",
        select: "courseTitle",
      })
      .sort({createdAt: -1})
      .lean();

    return res.status(200).json({
      success: true,
      year: Number(year),
      totalStudents: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Get Course Monthly Fees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export const initMonthlyFeeForYear = async (req, res) => {
  try {
    const { courseId, year } = req.body;

    const currentYear = new Date().getFullYear();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId",
      });
    }

    if (!year || year > currentYear) {
      return res.status(400).json({
        success: false,
        message: "Invalid year selection",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      course.mode.toLowerCase() !== "live" ||
      course.isArchived === true
    ) {
      return res.status(400).json({
        success: false,
        message: "Monthly fee not applicable for this course",
      });
    }

    const enrollments = await CourseEnrollment.find({
      courseId,
      isActive: true,
    }).select("userId");

    let createdCount = 0;

    for (const enrollment of enrollments) {
      const exists = await MonthlyFee.findOne({
        userId: enrollment.userId,
        courseId,
        year,
      });

      if (!exists) {
        await MonthlyFee.create({
          userId: enrollment.userId,
          courseId,
          year,
          startedFromMonth:
            year === currentYear
              ? getCurrentMonthKey()
              : "jan",
        });

        createdCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Monthly fee sheet initialized",
      createdCount,
    });
  } catch (error) {
    console.error("Init Monthly Fee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};