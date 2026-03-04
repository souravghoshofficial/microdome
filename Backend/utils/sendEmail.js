import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your generated app password
  },
});

export const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject: "Your OTP Code",
      text: `Your One-Time Password is: ${otp}. It is valid for 5 minutes.`,
    });
    console.log("OTP email sent to", to);
  } catch (error) {
    console.error("Error sending otp email:", error);
  }
};

export const sendCourseConfirmationEmail = async ({
  to,
  studentName,
  courseTitle,
  accessLink,
  whatsappLink,
}) => {
  const subject = `🎉 Course Enrolled Successfully: ${courseTitle}`;

  const html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Course Enrollment Confirmed</title>
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

                <p style="font-size:16px; margin:0 0 16px;">
                  🎉 <strong>Enrollment Confirmed!</strong>
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                  Thank you for your payment. You are now successfully enrolled in:
                </p>

                <!-- Course Title -->
                <p style="font-size:18px; font-weight:600; margin:0 0 24px;">
                  ${courseTitle}
                </p>

                <p style="font-size:14px; color:#4b5563; margin:0 0 28px;">
                  You can now access all course lectures and resources from your dashboard.
                </p>

                <!-- View Course CTA -->
                <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:18px;">
                  <tr>
                    <td align="center">
                      <a
                        href="${accessLink}"
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

                <!-- WhatsApp Section -->
                <p style="font-size:15px; margin:20px 0 8px;">
                  💬 <strong>Join Course Community</strong>
                </p>

                <p style="font-size:14px; color:#4b5563; margin:0 0 16px;">
                  Join the dedicated WhatsApp group for updates, discussions, and support.
                </p>

                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a
                        href="${whatsappLink}"
                        target="_blank"
                        style="
                          background:#25D366;
                          color:#ffffff;
                          text-decoration:none;
                          padding:12px 26px;
                          font-size:14px;
                          font-weight:600;
                          border-radius:8px;
                          display:inline-block;
                        "
                      >
                        📲 Join WhatsApp Group
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:13px; color:#6b7280; margin-top:32px;">
                  Best regards,<br />
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
                © ${new Date().getFullYear()} Microdome Classes<br/>
                This is an automated message. If you did not make this purchase, please contact us.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject,
      html,
    });

    console.log("Course confirmation email sent to", to);
  } catch (error) {
    console.error("Error sending course confirmation email:", error);
  }
};

export const sendAccessRevokedEmail = async ({
  to,
  studentName,
  courseTitle,
}) => {
  const subject = `⚠️ Access Revoked: ${courseTitle}`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #d9534f;">Hi ${studentName},</h2>
    <p>
      We regret to inform you that your access to the course 
      <strong>${courseTitle}</strong> has been <span style="color: #d9534f;">revoked</span> by the admin.
    </p>

    <p>If you believe this is a mistake or you have any concerns, please contact our support team immediately.</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 team@microdomeclasses.in</p>

    <hr/>
    <small>This is an automated message. Please do not reply directly to this email.</small>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject,
      html,
    });

    console.log("Access revoked email sent to", to);
  } catch (error) {
    console.error("Error sending access revoked email:", error);
  }
};

export const sendAccessGrantedEmail = async ({
  to,
  studentName,
  courseTitle,
  accessLink,
}) => {
  const subject = `🎉 Access Granted: ${courseTitle}`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #28a745;">Hi ${studentName},</h2>
    <p>
      Great news! Your access to the course <strong>${courseTitle}</strong> has been 
      <span style="color: #28a745;">granted</span> by the admin. 🚀
    </p>

    <p>You can start learning right away using the link below:</p>

    <p>
      <a href="${accessLink}" target="_blank" 
         style="display: inline-block; padding: 12px 20px; margin-top: 10px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
         📚 Go to Course
      </a>
    </p>

    <p>We’re excited to see your progress. If you have any questions, feel free to reach out to us anytime.</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 team@microdomeclasses.in</p>

    <hr/>
    <small>This is an automated message. Please do not reply directly to this email.</small>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject,
      html,
    });

    console.log("Access granted email sent to", to);
  } catch (error) {
    console.error("Error sending access granted email:", error);
  }
};

export const sendQuizConfirmationEmail = async ({
  to,
  studentName,
  quizLink,
}) => {
  const subject = `📝 Quiz Series Enrollment Confirmed!`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #2e6c80;">Hi ${studentName},</h2>
    <p>You have successfully enrolled in our <strong>Quiz Series</strong>. 🎉</p>

    <p>Get ready to test your knowledge and boost your preparation!</p>

    <p>
      <a href="${quizLink}" target="_blank" 
         style="display: inline-block; padding: 12px 20px; margin-top: 10px; background-color: #2e6c80; color: white; text-decoration: none; border-radius: 5px;">
         🚀 Start Quiz
      </a>
    </p>

    <p>Please make sure to complete the quiz before the deadline.</p>

    <p>We wish you all the best! 🍀</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 team@microdomeclasses.in</p>

    <hr/>
    <small>This is an automated message. If you did not enroll in this quiz, please contact us immediately.</small>
  </div>
`;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject,
      html,
    });

    console.log("Quiz series confirmation email sent to", to);
  } catch (error) {
    console.error("Error sending quiz series confirmation email:", error);
  }
};

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "no-reply@microdomeclasses.in",
    to: process.env.EMAIL_USER,
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <h3>Message From User:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

export const sendMockTestConfirmationEmail = async ({
  to,
  mockTestBundleTitle,
  bundleId,
  name,
}) => {
  try {
    const dashboardLink = `${process.env.FRONTEND_URL}/my-bundles/${bundleId}`;

    const mailOptions = {
      from: `"Microdome Classes" <no-reply@microdomeclasses.in>`,
      to,
      subject: `🎉 Mock Test Series Enrolled Successfully - ${mockTestBundleTitle}`,
      html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Enrollment Successful</title>
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
              border:2px solid #2563eb;
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
                  Hi <strong>${name || "Student"}</strong>,
                </p>

                <p style="font-size:16px; margin:0 0 16px;">
                  🎉 <strong>Congratulations!</strong>
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                  You have successfully enrolled in the following test series:
                </p>

                <!-- Bundle Name -->
                <p style="font-size:18px; font-weight:600; margin:0 0 24px;">
                  ${mockTestBundleTitle}
                </p>

                <p style="font-size:14px; color:#4b5563; margin:0 0 28px;">
                  You can now start practicing mock tests and track your performance
                  directly from your dashboard.
                </p>

                <!-- CTA -->
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a
                        href="${dashboardLink}"
                        target="_blank"
                        style="
                          background:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          padding:12px 26px;
                          font-size:14px;
                          font-weight:600;
                          border-radius:8px;
                          display:inline-block;
                        "
                      >
                        ▶ Go to My Test Series
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:13px; color:#6b7280; margin-top:32px;">
                  Best wishes,<br />
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
                © ${new Date().getFullYear()} Microdome Classes<br/>
                This is an automated email. Please do not reply.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Mock test confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending mock test confirmation email:", error.message);
  }
};
