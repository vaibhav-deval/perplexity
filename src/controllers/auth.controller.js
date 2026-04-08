import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendVerificationEmail } from "../services/mail.service.js";
export async function register(req, res) {
  const { username, email, password } = req.body;
  const ifUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (ifUserAlreadyExists) {
    return res.status(400).json({
      message: "Username or email already exists",
      success: false,
      err: "Username or email already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  await sendVerificationEmail({
    to: email,
    subject: "welcome to perplexity, please verify your email",
    html: `
    <p>Hi ${username},</p>
    <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
    <p>Please verify your email address by clicking the link below.</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailToken}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,<br/>The Perplexity Team</p>
    `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
export async function verifyEmail(req, res) {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOne({ email: decoded.email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: "user not found",
    });
  }
  user.verified = true;
  await user.save();
  res.send(`
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now log in to your account.</p>
    `);
}
