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

  <body style="margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:8px;">

          <!-- Main Card -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width:600px;
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
              border:2px solid #3eb5a2;
              box-shadow:0 6px 16px rgba(0,0,0,0.08);
              font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            "
          >

            <!-- Header -->
            <tr>
              <td align="center" style="padding:20px;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background:#1c1c1c;
                    border-radius:12px;
                    border:1px solid #ffffff;
                    padding:14px 20px;
                    width:100%;
                  "
                >
                  <tr>
                    <td align="center">
                      <img
                        src="https://res.cloudinary.com/dpsmiqy61/image/upload/v1770138895/mylogo_l8q7ql.png"
                        alt="Microdome Classes"
                        height="48"
                        style="display:block; margin:0 auto;"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body --> 
            <tr>
              <td style="padding:28px; color:#111827;">
                <p style="font-size:15px; margin:0 0 12px;">
                  Hi <strong>${studentName || "Student"}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                  A new lecture titled
                  <strong>"${lectureTitle}"</strong> has just been added to your course:
                </p>

                <p style="font-size:17px; font-weight:600; margin:0 0 20px;">
                  ${courseTitle}      
                </p>

                <p style="font-size:14px; color:#4b5563; margin:0 0 28px;">
                  Log in to your dashboard to watch the lecture and continue your learning.
                </p>

                <!-- CTA -->
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a
                        href="https://microdomeclasses.in/my-courses/${courseId}"
                        target="_blank"
                        style="
                          background:#3eb5a2;
                          color:#ffffff;
                          text-decoration:none;
                          padding:12px 26px;
                          font-size:14px;
                          font-weight:600;
                          border-radius:8px;
                          display:inline-block;
                        "
                      >
                        ▶ View Course
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:13px; color:#6b7280; margin-top:32px;">
                  Happy learning,<br />
                  <strong>Microdome Classes</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background:#f9fafb;
                  padding:14px;
                  font-size:12px;
                  color:#9ca3af;
                "
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

  // 4. Send emails in batch 
  const { data } = await resend.batch.send(emails);
  console.log("Lecture notification emails sent: ", data);
};
