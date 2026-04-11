import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getMe,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  validateUserRegistration,
  validateUserLogin,
} from "../validators/userValidators.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username: String, email: String, password: String }
 * @returns { message: String, success: Boolean, user: Object }
 */
authRouter.post("/register", validateUserRegistration, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body { email: String, password: String }
 * @returns { message: String, success: Boolean, token: String }
 */
authRouter.post("/login", validateUserLogin, login);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user
 * @access Private
 * @returns { message: String, success: Boolean, user: Object }
 */
authRouter.get("/get-me", authMiddleware, getMe);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 * @query { token: String }
 * @returns { message: String, success: Boolean }
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
