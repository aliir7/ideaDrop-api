import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/authController.js";
const router = express.Router();

// @route        POST api/auth/register
// @description  Create New User
// @access       Public
router.post("/register", registerUser);

// @route        POST api/auth/login
// @description  Authenticate User
// @access       Public
router.post("/login", loginUser);

// @route        POST api/auth/logout
// @description  Logout user and clear refresh token
// @access       Private
router.post("/logout", logoutUser);

// @route        POST api/auth/refresh
// @description  Generate new access token from refresh token
// @access       Public (Needs valid refresh token in cookie)
router.post("/refresh", refreshAccessToken);

export default router;
