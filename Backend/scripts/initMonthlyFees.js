import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { MonthlyFee } from "../models/monthlyFee.model.js";

dotenv.config();

/* ================= DB CONNECT ================= */

await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "microdome",
});
console.log("MongoDB connected");

/* ================= HELPERS ================= */

const MONTH_KEYS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_KEY = MONTH_KEYS[new Date().getMonth()];

/* ================= MAIN SCRIPT ================= */

const initMonthlyFeeSheets = async () => {
  try {
    console.log("Starting monthly fee initialization...");

    // 1. Only ACTIVE LIVE courses
    const liveCourses = await Course.find({
       mode: "live",
       isArchived: false,
    }).select("_id courseTitle");

    console.log(`Found ${liveCourses.length} active live courses`);

    for (const course of liveCourses) {
      console.log(`\nProcessing course: ${course.courseTitle}`);

      // 2. Active enrollments
      const enrollments = await CourseEnrollment.find({
        courseId: course._id,
      }).select("userId");

      console.log(`  Enrollments found: ${enrollments.length}`);

      for (const enrollment of enrollments) {
        // 3. Skip if already exists
        const exists = await MonthlyFee.findOne({
          userId: enrollment.userId,
          courseId: course._id,
          year: CURRENT_YEAR,
        });

        if (exists) {
          console.log(`  ⏭️  Exists for user ${enrollment.userId}`);
          continue;
        }

        // 4. Create fresh yearly sheet starting THIS MONTH
        await MonthlyFee.create({
          userId: enrollment.userId,
          courseId: course._id,
          year: CURRENT_YEAR,
          startedFromMonth: CURRENT_MONTH_KEY,
        });

        console.log(
          `  ✅ Created sheet for user ${enrollment.userId} (from ${CURRENT_MONTH_KEY})`,
        );
      }
    }

    console.log("\n🎉 Monthly fee initialization completed");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

/* ================= RUN ================= */

initMonthlyFeeSheets();
