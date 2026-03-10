import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Resend } from "resend";
import { User } from "./models/user.model.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const freeMockTestEmailTemplate = ({ studentName, mockTestLink }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Free Mock Test Available</title>
</head>

<body style="margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:8px;">

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
font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
"
>

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
/>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:28px;color:#111827;">

<p style="font-size:15px;margin:0 0 12px;">
Hi <strong>${studentName || "Student"}</strong>,
</p>

<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
What a fantastic day for all of us! 🇮🇳 India has lifted the
<strong>T20 World Cup</strong>, and the entire nation is celebrating this
incredible achievement.
</p>

<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
To celebrate this moment, we are excited to launch a
<strong>FREE Mock Test</strong> for all students at Microdome Classes.
</p>

<ul style="font-size:14px;color:#374151;margin:0 0 24px;">
<li>✔ Assess your preparation</li>
<li>✔ Experience real exam-level questions</li>
<li>✔ Identify strengths and weak areas</li>
</ul>

<p style="font-size:14px;color:#4b5563;margin:0 0 28px;">
If you are preparing for <strong>IIT JAM, GATE, CUET-PG</strong> or other
M.Sc entrance exams, this is a great opportunity to test yourself.
</p>

<table cellpadding="0" cellspacing="0" width="100%">
<tr>
<td align="center">
<a
href="${mockTestLink}"
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
🚀 Take the Free Mock Test
</a>
</td>
</tr>
</table>

<p style="font-size:13px;color:#6b7280;margin-top:32px;">
Celebrate India’s victory with the same spirit of excellence and determination.
</p>

<p style="font-size:13px;color:#6b7280;">
Best wishes,<br/>
<strong>Team Microdome Classes</strong>
</p>

</td>
</tr>

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

/* ----------------------- EMAIL FUNCTION ----------------------- */

export const notifyUsersFreeMockTest = async ({ mockTestLink }) => {
  try {

    // Ensure DB connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected");
    }

    const users = await User.find({}, "email name").lean();

    if (!users.length) {
      console.log("No users found");
      return;
    }

    const emails = users
      .filter((user) => user.email)
      .map((user) => ({
        from: `Microdome Classes <${process.env.EMAIL_FROM}>`,
        to: [user.email],
        subject: "🇮🇳 Celebrate India's T20 Victory with a Free Mock Test!",
        html: freeMockTestEmailTemplate({
          studentName: user.name,
          mockTestLink,
        }),
      }));


    const BATCH_SIZE = 100;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {

      const batch = emails.slice(i, i + BATCH_SIZE);

      const { error } = await resend.batch.send(batch);

      if (error) {
        console.error("Batch email error:", error);
      } else {
        console.log(`Batch ${i / BATCH_SIZE + 1} sent`);
      }
    }

    console.log(`Total emails sent: ${emails.length}`);

  } catch (error) {
    console.error("Mock test email error:", error);
  }
};

/* ----------------------- RUN SCRIPT ----------------------- */

const start = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI,{
      dbName: "microdome"
    });

    console.log("MongoDB Connected");

    await notifyUsersFreeMockTest({
      mockTestLink: "https://microdomeclasses.in/mock-tests",
    });

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();