import { config } from "dotenv";
config();
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});
// Verify the connection configuration
transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((error) => {
    console.error("Error setting up email transporter:", error);
  });

export async function sendVerificationEmail({ to, subject, html, text }) {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    };
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", details.messageId);
    return details;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}