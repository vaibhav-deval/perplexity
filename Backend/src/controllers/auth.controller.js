import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendVerificationEmail } from "../services/mail.service.js";
/**
 * Register a new user
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username: String, email: String, password: String }
 * @returns { message: String, success: Boolean, user: Object }
 */
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

/**
 * Get current user
 * @route GET /api/auth/get-me
 * @desc Get current logged in user
 * @access Private
 * @returns { message: String, success: Boolean, user: Object }
 */
export async function getMe(req, res) {
  const userId = req.user.id;
  const user = await userModel
    .findById(userId)
    .select("-password -__v -createdAt -updatedAt");
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "user not found",
    });
  }
  res.json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * Login a user
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body { email: String, password: String }\
 * @returns { message: String, success: Boolean, token: String }
 */
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "user not found",
    });
  }
  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "email not verified",
    });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "invalid password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  res.cookie("token", token);
  res.json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 * @query { token: String }
 * @returns { message: String, success: Boolean }
 */
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
