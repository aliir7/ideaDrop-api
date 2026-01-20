import express from "express";
import Idea from "../models/Idea.js";
const router = express.Router();

// @route        GET api/ideas
// @description  Get all ideas
// @access       Public
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 });

    if (!isNaN(limit)) {
      query.limit(limit);
    }

    const ideas = await query.exec();
    res.json({ message: "data successfully fetched", data: ideas });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route        POST api/ideas
// @description  Create new idea
// @access       Public
router.post("/", (req, res) => {
  res.status(201).json({ message: "idea successfully added", data: req.body });
});

export default router;
