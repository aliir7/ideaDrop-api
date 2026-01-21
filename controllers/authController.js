import User from "../models/User.js";
import { generateToken } from "../lib/utils/generateToken.js";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../lib/utils/constants.js";
// create new user
export const registerUser = async (req, res, next) => {
  try {
    // get data
    const { name, email, password } = req.body || {};

    // validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("all inputs are required");
    }

    //check for user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("user already exist");
    }

    // create user in db
    const user = await User.create({ name, email, password });

    // Create tokens
    const payload = { userId: user._id.toString() };
    const accessToken = generateToken(payload, "2m");
    const refreshToken = generateToken(payload, "30d");

    // Set refresh token in HTTP-Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 60 * 60 * 24 * 1000, //30days
    });

    res.status(201).json({
      message: "user created successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// login user with email and password
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }
    // Find user
    const user = await User.findOne({ email });

    // check if user not existing
    if (!user) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    // Create tokens
    const payload = { userId: user._id.toString() };
    const accessToken = generateToken(payload, "2m");
    const refreshToken = generateToken(payload, "30d");

    // Set refresh token in HTTP-Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 60 * 60 * 24 * 1000, //30days
    });

    res.status(201).json({
      message: "user logged in successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Logout user and clear refresh token
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// generate new access token from refresh token
export const refreshAccessToken = async (req, res, next) => {
  try {
    // get refresh token from request
    const token = req.cookies?.refreshToken;

    // check refresh token
    if (!token) {
      res.status(401);
      throw new Error("No refresh token");
    }

    // get payload from token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // find user by payload (userId)
    const user = await User.findById(payload.userId);

    // check user existing
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // generate new access token
    const newAccessToken = await generateToken({ userId: user._id.toString() });
    res.status(201).json({
      newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
