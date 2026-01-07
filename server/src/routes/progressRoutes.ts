import express from "express";
import { toggleLessonComplete } from "../controllers/progressController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.patch("/:id/lesson", protect, toggleLessonComplete);

export default router;
