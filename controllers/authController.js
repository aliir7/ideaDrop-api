import User from "../models/User.js";

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
    console.log(user);
    res.status(201).json({
      message: "user created successfully",
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
