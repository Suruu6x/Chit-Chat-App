import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChatController,
  addToGroupController,
  createGroupChatController,
  fetchChatsController,
  removeFromGroupController,
  renameGroupController,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChatController);
router.route("/").get(protect, fetchChatsController);
router.route("/group").post(protect, createGroupChatController);
router.route("/rename").put(protect, renameGroupController);
router.route("/groupadd").put(protect, addToGroupController);
router.route("/groupremove").put(protect, removeFromGroupController);

export default router;
