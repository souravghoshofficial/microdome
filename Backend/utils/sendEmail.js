import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your generated app password
  }
});

const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Microdome Classes" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      text: `Your One-Time Password is: ${otp}. It is valid for 5 minutes.`
    });
    console.log('OTP email sent to', to);
  } catch (error) {
    console.error('Error sending otp email:', error);
  }
};


const sendCourseConfirmationEmail = async ({ to, studentName, courseTitle, accessLink }) => {
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

    <p>We’re excited to have you on board. If you have any questions, feel free to reach out to us.</p>

    <p>Best regards,<br/>
    Microdome Classes Team<br/>
    📧 microdomeclasses@gmail.com</p>

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


export {sendOtpEmail , sendCourseConfirmationEmail}
