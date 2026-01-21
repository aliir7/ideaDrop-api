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
      res.status(401);
      throw new Error("Not authorized, No token");
    }

    // get token from header
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Find User and check for authorization
    const user = await User.findById(payload.userId).select("_id name email");

    // check user existing
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
