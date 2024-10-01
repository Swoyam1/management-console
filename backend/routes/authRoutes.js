import express from "express";
import { register, login } from "../controllers/authController.js";
import { googleAuth } from "../controllers/oauthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth); // Start Google authentication
// router.get("/google/callback", googleCallback); // Handle Google callback

export default router;
