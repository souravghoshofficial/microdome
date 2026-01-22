import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your generated app password
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your One-Time Password is: ${otp}. It is valid for 5 minutes.`,
    });
    console.log("OTP email sent to", to);
  } catch (error) {
    console.error("Error sending otp email:", error);
  }
};

const sendCourseConfirmationEmail = async ({
  to,
  studentName,
  courseTitle,
  accessLink,
  whatsappLink,
}) => {
  const subject = `✅ Course Enrollment Confirmed: ${courseTitle}`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #2e6c80;">Hi ${studentName},</h2>
    <p>Thank you for your payment! Your enrollment for the course <strong>${courseTitle}</strong> is now confirmed. 🎉</p>
    
    <h3>📚 Course Details:</h3>
    <ul>
      <li><strong>Course:</strong> ${courseTitle}</li>
    </ul>

    <p>
      <a href="${accessLink}" target="_blank" 
         style="display: inline-block; padding: 12px 20px; margin-top: 10px; background-color: #2e6c80; color: white; text-decoration: none; border-radius: 5px;">
         🚀 View Course
      </a>
    </p>

    <h3>💬 Join Our Community:</h3>
    <p>We have a dedicated WhatsApp group for this course. Join using the link below:</p>
    <p>
      <a href="${whatsappLink}" target="_blank"
         style="display: inline-block; padding: 12px 20px; margin-top: 10px; background-color: #25D366; color: white; text-decoration: none; border-radius: 5px;">
         📲 Join WhatsApp Group
      </a>
    </p>

    <p>We’re excited to have you on board. If you have any questions, feel free to reach out to us.</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 microdomeclasses2@gmail.com</p>

    <hr/>
    <small>This is an automated message. If you did not make this purchase, please contact us immediately.</small>
  </div>
`;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Course confirmation email sent to", to);
  } catch (error) {
    console.error("Error sending course confirmation email:", error);
  }
};

const sendAccessRevokedEmail = async ({ to, studentName, courseTitle }) => {
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
    📧 microdomeclasses2@gmail.com</p>

    <hr/>
    <small>This is an automated message. Please do not reply directly to this email.</small>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Access revoked email sent to", to);
  } catch (error) {
    console.error("Error sending access revoked email:", error);
  }
};

const sendAccessGrantedEmail = async ({
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
    📧 microdomeclasses2@gmail.com</p>

    <hr/>
    <small>This is an automated message. Please do not reply directly to this email.</small>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Access granted email sent to", to);
  } catch (error) {
    console.error("Error sending access granted email:", error);
  }
};

const sendQuizConfirmationEmail = async ({
  to,
  studentName,
  quizLink,
}) => {
  const subject = `📝 Mock Test Series `;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #2e6c80;">Hi ${studentName},</h2>
    <p>You have successfully enrolled for the Mock Test Series. 🎉</p>


    <p>
      <a href="${quizLink}" target="_blank" 
         style="display: inline-block; padding: 12px 20px; margin-top: 10px; background-color: #2e6c80; color: white; text-decoration: none; border-radius: 5px;">
         🚀 Start Test
      </a>
    </p>

    <p>Make sure to attempt the test before the deadline. Good luck! 🍀</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 microdomeclasses2@gmail.com</p>

    <hr/>
    <small>This is an automated message. If you did not enroll in this test, please contact us immediately.</small>
  </div>
`;

  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Mock test confirmation email sent to", to);
  } catch (error) {
    console.error("Error sending mock test confirmation email:", error);
  }
};

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
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


export {
  sendOtpEmail,
  sendCourseConfirmationEmail,
  sendAccessRevokedEmail,
  sendAccessGrantedEmail,
  sendQuizConfirmationEmail,
  sendMessage
};
