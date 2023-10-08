import asyncHandler from "express-async-handler";
import userModel from "../Models/userModel.js";
import { generateToken } from "../config/generateToken.js";

// Register controller
export const registerController = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    //Validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }

    // Checking user
    const existingUser = await userModel.findOne({ email });
    //If user already Exists
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, Please login",
      });
    }

    //Create a new user
    const user = await userModel.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // password: user.password,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while creating user",
      error,
    });
  }
});

// Login controller
export const loginController = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to login user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Login",
      error,
    });
  }
});

//All Users
// /api/user?search=suraj
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });
  res.send(users);
});
