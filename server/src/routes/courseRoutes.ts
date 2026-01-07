import express from "express";
import {
  createCourse,
  getMyCourses,
  getCourseById,
  deleteCourse,
} from "../controllers/courseController";
import { toggleLessonComplete } from "../controllers/progressController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createCourse);
router.get("/", protect, getMyCourses);
router.get("/:id", protect, getCourseById);
router.patch("/:id/lesson", protect, toggleLessonComplete);
router.delete("/:id", protect, deleteCourse);

export default router;
