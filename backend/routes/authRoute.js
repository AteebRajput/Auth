import express from "express";
// import { loginController, signupController, logoutController } from "../controllers/authController";
import {
  loginController,
  signupController,
  logoutController,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup", signupController);

router.post("/verify-email", verifyEmail);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);


export default router;
