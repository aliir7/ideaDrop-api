import express from "express";
import {
  createIdea,
  deleteIdea,
  getIdea,
  getIdeas,
  updateIdea,
} from "../controllers/ideaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route        GET api/ideas
// @description  Get all ideas
// @access       Public
router.get("/", getIdeas);

// @route        GET api/ideas/:id
// @description  Get one idea by id
// @access       Public
router.get("/:id", getIdea);

// @route        POST api/ideas
// @description  Create new idea
// @access       Private
router.post("/", protect, createIdea);

// @route        PUT api/ideas
// @description  Update idea
// @access       Private
router.put("/:id", protect, updateIdea);

// @route        PUT api/ideas
// @description  Update idea
// @access       Private
router.delete("/:id", protect, deleteIdea);

export default router;
