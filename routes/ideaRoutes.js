import express from "express";
const router = express.Router();

// @route        GET api/ideas
// @description  Get all ideas
// @access       Public
router.get("/", (req, res) => {
  const ideas = [{ id: 1, title: "idea 1", description: "this is idea 1" }];

  console.log(req);
  res.json(ideas);
});

// @route        POST api/ideas
// @description  Create new idea
// @access       Public
router.post("/", (req, res) => {
  res.status(201).json({ message: "idea successfully added", data: req.body });
});

export default router;
