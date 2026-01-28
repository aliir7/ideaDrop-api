import { jwtVerify } from "jose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { JWT_SECRET } from "../lib/utils/constants.js";

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    // check header in every request for authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({ message: "Not authorized, No token provided" });
    }

    // get token from header
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Find User and check for authorization
    const user = await User.findById(payload.userId).select("_id name email");

    // check user existing
    if (!user) {
      return res.status(401).json({ message: "User not found or deactivated" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message); // لاگ دقیق‌تر

    // تشخیص خطاهای خاص JWT (مثل انقضا)
    if (err.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
