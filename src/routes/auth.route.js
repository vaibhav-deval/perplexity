import { Router } from "express";
import { register,verifyEmail } from "../controllers/auth.controller.js";
import { validateUserRegistration } from "../validators/userValidators.js";

const authRouter = Router();


 authRouter.post("/register", validateUserRegistration,  register);
 authRouter.get("/verify-email", verifyEmail);


export default authRouter;
