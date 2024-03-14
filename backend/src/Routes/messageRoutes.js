import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getAllMessages,
} from "../Controllers/messageController.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getAllMessages);

export default router;
