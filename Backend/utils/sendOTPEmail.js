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
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP Code',
      text: `Your One-Time Password is: ${otp}. It is valid for 5 minutes.`
    });
    console.log('OTP email sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export {sendOtpEmail}
