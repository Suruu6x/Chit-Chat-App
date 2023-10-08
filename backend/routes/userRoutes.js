import express from "express";
import {
  allUsers,
  loginController,
  registerController,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerController).get(protect, allUsers);

router.post("/login", loginController);

// router.route('/').get(allUsers)

export default router;
