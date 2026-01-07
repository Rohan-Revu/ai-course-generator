import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
import Course from "../models/Course";

const ENABLE_BOUNDS_CHECK = true;

export const toggleLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rawModuleNumber = req.body?.moduleNumber;
    const rawLessonIndex = req.body?.lessonIndex;

    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (rawModuleNumber === undefined || rawLessonIndex === undefined) {
      return res
        .status(400)
        .json({ message: "moduleNumber and lessonIndex are required in body" });
    }

    const moduleNumber = Number(rawModuleNumber);
    const lessonIndex = Number(rawLessonIndex);

    if (!Number.isFinite(moduleNumber) || !Number.isFinite(lessonIndex)) {
      return res
        .status(400)
        .json({ message: "moduleNumber and lessonIndex must be numbers" });
    }

    const course = await Course.findOne({ _id: id, user: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (ENABLE_BOUNDS_CHECK) {
      const module = course.modules.find(
        (m: { moduleNumber: number }) => m.moduleNumber === moduleNumber
      );
      if (!module) {
        return res.status(400).json({ message: "moduleNumber out of range" });
      }
      if (
        !Array.isArray(module.lessons) ||
        lessonIndex < 0 ||
        lessonIndex >= module.lessons.length
      ) {
        return res
          .status(400)
          .json({ message: "lessonIndex out of range for this module" });
      }
    }

    if (!Array.isArray(course.completedLessons)) {
      course.completedLessons = [];
    }

    const existsIndex = course.completedLessons.findIndex(
      (c: any) =>
        c.moduleNumber === moduleNumber && c.lessonIndex === lessonIndex
    );

    if (existsIndex >= 0) {
      course.completedLessons.splice(existsIndex, 1);
    } else {
      course.completedLessons.push({ moduleNumber, lessonIndex });
    }

    let totalLessons = 0;
    course.modules.forEach((m: { lessons: string | any[] }) => {
      if (Array.isArray(m.lessons)) totalLessons += m.lessons.length;
    });

    const completedCount = Array.isArray(course.completedLessons)
      ? course.completedLessons.length
      : 0;
    const percent =
      totalLessons === 0
        ? 0
        : Math.round((completedCount / totalLessons) * 100);
    course.completedPercent = percent;

    await course.save();

    return res.json({
      completedPercent: course.completedPercent,
      completedLessons: course.completedLessons,
    });
  } catch (err: any) {
    console.error("Toggle lesson error:", err?.message ?? err);
    return res
      .status(500)
      .json({ message: err?.message ?? "Failed to update progress" });
  }
};
