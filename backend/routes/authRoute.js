import express from 'express';
import { login, logout, signup, refreshToken, getProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/AuthMiddleWare.js';

const router = express.Router();

// User signup
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

// Refresh access token
router.post("/refresh-token", refreshToken);

// Proile
router.get("/profile", protectRoute, getProfile);

export default router;
