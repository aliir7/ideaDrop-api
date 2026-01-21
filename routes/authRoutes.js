import express from "express";
import {
  loginUser,
  logoutUser,
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

export default router;
