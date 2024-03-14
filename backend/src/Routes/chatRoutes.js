import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  createChat,
  getAllChats,
  createGroupChat,
} from "../Controllers/chatController.js";
const router = express.Router();

router.post("/group", verifyToken, createGroupChat);
router.post("/:id", verifyToken, createChat);
router.get("/", verifyToken, getAllChats);

export default router;
