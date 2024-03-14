import express from "express";
import {
  registerUser,
  authenticateUser,
  getAllUsers,
} from "../Controllers/userController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authenticateUser);
router.get("/", verifyToken, getAllUsers);

export default router;
