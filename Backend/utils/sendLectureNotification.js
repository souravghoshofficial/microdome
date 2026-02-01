import { Resend } from "resend";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);



const lectureEmailTemplate = ({
  studentName,
  courseTitle,
  lectureTitle,
  courseId
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Lecture Added</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px;">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <tr>
              <td style="background:#2563eb; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">
                  📚 New Lecture Added
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px; font-family:Arial, sans-serif; color:#333;">
                <p style="font-size:15px;">
                  Hi <strong>${studentName || "there"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6;">
                  A new lecture titled
                  <strong>"${lectureTitle}"</strong> has just been added to your
                  course:
                </p>

                <p style="font-size:16px; font-weight:bold; margin:16px 0;">
                  ${courseTitle}
                </p>

                <p style="font-size:14px; color:#555;">
                  Log in to your dashboard to watch the lecture and continue your
                  learning.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin:28px 0;">
                  <a
                    href="https://microdomeclasses.in/my-courses/${courseId}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:12px 24px;
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      font-weight:bold;
                      border-radius:6px;
                      font-size:14px;
                    "
                  >
                    ▶ View Course
                  </a>
                </div>

                <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

                <p style="font-size:13px; color:#777;">
                  Happy learning,<br />
                  <strong>Team Microdome</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background:#f9fafb; padding:14px; text-align:center; font-size:12px; color:#999;"
              >
                © ${new Date().getFullYear()} Microdome Classes
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;



export const notifyStudentsNewLecture = async ({
  courseId,
  lectureTitle
}) => {
  // 1. Get course
  const course = await Course.findById(courseId).lean();
  if (!course) return;

  // 2. Get active enrollments
  const enrollments = await CourseEnrollment.find({
    courseId,
    isActive: true
  }).populate("userId", "email name");

  if (!enrollments.length) return;

  // 3. Prepare batch (Resend supports batch send)
  const emails = enrollments
    .filter(e => e.userId?.email)
    .map(e => ({
      from: `Microdome Classes <${process.env.EMAIL_FROM}>`,
      to: [e.userId.email],
      subject: `New lecture added: ${lectureTitle}`,
      html: lectureEmailTemplate({
        studentName: e.userId.name,
        courseTitle: course.courseTitle,
        lectureTitle,
        courseId: course._id
      })
    }));

  // 4. Batch send (MAX 100 per batch – Resend limit)
  const BATCH_SIZE = 50;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const chunk = emails.slice(i, i + BATCH_SIZE);

    // DO NOT await inside map / loop heavy logic
    await resend.batch.send(chunk);
  }
};
