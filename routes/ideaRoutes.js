import express from "express";
import {
  createIdea,
  getIdea,
  getIdeas,
  updateIdea,
} from "../controllers/ideaController.js";

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
// @access       Public
router.post("/", createIdea);

// @route        PUT api/ideas
// @description  Update idea
// @access       Public
router.put("/:id", updateIdea);

export default router;
