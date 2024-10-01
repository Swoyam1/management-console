import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  enableTwoFactorAuth,
  verifyTwoFactorAuth,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateUserProfile
);
router.post("/enable-2fa", authMiddleware, enableTwoFactorAuth);
router.post("/verify-2fa", authMiddleware, verifyTwoFactorAuth);

export default router;
