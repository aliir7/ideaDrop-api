import mongoose from "mongoose";
import Idea from "../models/Idea.js";
import {
  createIdeaSchema,
  updateIdeaSchema,
} from "../validators/ideaValidator.js";

// get all ideas
export const getIdeas = async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 });

    if (!isNaN(limit)) {
      query.limit(limit);
    }

    const ideas = await query.exec();
    res.json({ message: "data successfully fetched", data: ideas });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// get one idea by id
export const getIdea = async (req, res, next) => {
  try {
    const id = await req.params.id;

    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea Not Found!");
    }
    res.json({ message: "data successfully fetched", data: idea });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// create new Idea
export const createIdea = async (req, res, next) => {
  try {
    // get data from body
    const { title, description, summary, tags } = req.body || {};
    // validation
    const data = { title, description, summary, tags };
    const validated = createIdeaSchema.safeParse(data);

    if (!validated.success) {
      const formatted = validated.error.format();
      const flatFormat = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();
      res.status(400);
      throw new Error(`error message:${flatFormat.join(",")}`);
    }

    // add new Idea to db
    const newIdea = new Idea({
      title,
      description,
      summary,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray
          ? tags
          : [],
      user: req.user.id,
    });
    const savedIdea = await newIdea.save();
    res
      .status(201)
      .json({ message: "new Idea created successfully", data: savedIdea });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// update idea
export const updateIdea = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findById(id);

    // check idea exist
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    // check user owns idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to this idea ");
    }
    const { title, description, tags, summary } = req.body || {};
    const data = { ...req.body };

    //validation
    const validated = updateIdeaSchema.safeParse(data);

    if (!validated.success) {
      const formatted = validated.error.format();
      const flatFormat = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();
      res.status(400);
      throw new Error(`error message:${flatFormat.join(",")}`);
    }

    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // updated idea
    const updatedIdea = await idea.save();
    res.status(200).json({
      message: "Idea updated successfully",
      data: updatedIdea,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// delete idea by id
export const deleteIdea = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const idea = await Idea.findById(id);

    // check idea exist
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    // check user owns idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to this idea ");
    }

    // delete idea
    await idea.deleteOne();
    res.status(200).json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
