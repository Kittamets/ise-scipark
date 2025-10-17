import express from "express";
import { register, login, logout, sendVerifyOTP, verifyEmail} from "../controllers/authController.js";

import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp", userAuth, sendVerifyOTP);
router.post("/verify-account", userAuth, verifyEmail);

export default router;