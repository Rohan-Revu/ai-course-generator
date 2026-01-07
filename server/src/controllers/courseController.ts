import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
import Course from "../models/Course";
import axios from "axios";
import { generateCourseWithGemini } from "../utils/geminiCourseGenerator";

function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  try {
    const anyErr = err as any;
    if (anyErr?.message && typeof anyErr.message === "string")
      return anyErr.message;
    return String(anyErr);
  } catch {
    return "Unknown error";
  }
}

type CourseLevel = "beginner" | "intermediate" | "advanced";
const localGenerateModules = (
  topic: string,
  level: CourseLevel,
  modulesCount = 6
) => {
  const modules: any[] = [];
  for (let i = 1; i <= modulesCount; i++) {
    modules.push({
      moduleNumber: i,
      title: `${topic} — Module ${i}`,
      description: `Overview and learning targets for module ${i}`,
      lessons: [
        { title: `Lesson 1: Core concept ${i}`, content: "" },
        { title: `Lesson 2: Hands-on practice ${i}`, content: "" },
        { title: `Lesson 3: Mini project ${i}`, content: "" },
      ],
      quizQuestions: [],
    });
  }
  return modules;
};

async function searchYoutubeVideo(topic: string) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const q = encodeURIComponent(`${topic} tutorial`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${key}`;
    const res = await axios.get(url);
    const items = res.data?.items;
    if (items && items.length) return items[0].id.videoId;
    return null;
  } catch (err) {
    console.error("YouTube search error:", getErrorMessage(err));
    return null;
  }
}

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { topic, description, level, durationDays, goal, imageUrl } =
      req.body;

    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!topic || !level || !durationDays) {
      return res
        .status(400)
        .json({ message: "topic, level and durationDays are required" });
    }

    const days = Number(durationDays) || 7;
    let generated: any;

    try {
      generated = await generateCourseWithGemini({
        topic,
        level,
        durationWeeks: Math.ceil(days / 7),
        goal,
      });

      if (!generated || !Array.isArray(generated.modules)) {
        throw new Error("Gemini returned invalid structure");
      }
    } catch (err) {
      console.warn(
        "Gemini failed, falling back to local generator:",
        getErrorMessage(err)
      );
      const modules = localGenerateModules(topic, level as CourseLevel, 6);
      generated = {
        title: `${topic} – ${
          level.charAt(0).toUpperCase() + level.slice(1)
        } Course`,
        topic,
        level,
        durationWeeks: Math.ceil(days / 7),
        goal: goal || "",
        modules,
      };
    }

    const moduleCount = Array.isArray(generated.modules)
      ? generated.modules.length
      : 0;
    if (moduleCount === 0) {
      return res.status(500).json({ message: "Generator returned no modules" });
    }
    const base = Math.floor(days / moduleCount) || 1;
    const remainder = days - base * moduleCount;

    const normalizeLesson = (lessonItem: any, li: number) => {
      if (
        lessonItem &&
        typeof lessonItem === "object" &&
        !Array.isArray(lessonItem)
      ) {
        const title =
          typeof lessonItem.title === "string"
            ? lessonItem.title
            : typeof lessonItem.name === "string"
            ? lessonItem.name
            : `Lesson ${li + 1}`;
        const content =
          typeof lessonItem.content === "string"
            ? lessonItem.content
            : typeof lessonItem.body === "string"
            ? lessonItem.body
            : "";
        const durationMinutes =
          typeof lessonItem.durationMinutes === "number"
            ? lessonItem.durationMinutes
            : typeof lessonItem.duration === "number"
            ? lessonItem.duration
            : undefined;
        const resources = Array.isArray(lessonItem.resources)
          ? lessonItem.resources.map((r: any) => String(r))
          : [];
        const out: any = { title, content };
        if (durationMinutes) out.durationMinutes = durationMinutes;
        if (resources.length) out.resources = resources;
        return out;
      }

      if (typeof lessonItem === "string") {
        const trimmed = lessonItem.trim();
        if (trimmed === "[object Object]") {
          return { title: `Lesson ${li + 1}`, content: "" };
        }
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            return normalizeLesson(parsed, li);
          } catch {}
        }
        return { title: trimmed, content: "" };
      }

      return { title: `Lesson ${li + 1}`, content: "" };
    };

    const modulesWithTime = generated.modules.map((m: any, idx: number) => {
      const extra = idx < remainder ? 1 : 0;
      const rawLessons = Array.isArray(m.lessons) ? m.lessons : [];
      const lessons = rawLessons.map((lessonItem: any, li: number) => {
        const norm = normalizeLesson(lessonItem, li);
        return JSON.parse(JSON.stringify(norm));
      });
      const quizQuestions = Array.isArray(m.quizQuestions)
        ? m.quizQuestions.map((q: any) => String(q))
        : [];
      return {
        moduleNumber:
          typeof m.moduleNumber === "number" ? m.moduleNumber : idx + 1,
        title: m.title ?? `Module ${idx + 1}`,
        description: m.description ?? "",
        lessons,
        timeDays: base + extra,
        quizQuestions,
      };
    });

    for (let mi = 0; mi < modulesWithTime.length; mi++) {
      const mod = modulesWithTime[mi];
      if (!Array.isArray(mod.lessons)) {
        return res
          .status(400)
          .json({ message: `Module ${mi} lessons must be an array` });
      }
      for (let li = 0; li < mod.lessons.length; li++) {
        const L = mod.lessons[li];
        if (typeof L !== "object" || Array.isArray(L) || L === null) {
          return res.status(400).json({
            message: `Module ${mi} lesson ${li} is not an object`,
          });
        }
        if (typeof L.title !== "string" || L.title.trim() === "") {
          return res.status(400).json({
            message: `Module ${mi} lesson ${li} must have a title`,
          });
        }
      }
    }

    const youtubeVideoId = await searchYoutubeVideo(topic);

    const coursePayload = {
      user: req.user._id,
      title: generated.title,
      topic: generated.topic,
      description: description || "",
      level: generated.level,
      durationDays: days,
      goal: generated.goal,
      imageUrl: imageUrl || "",
      completedPercent: 0,
      completedLessons: [],
      modules: modulesWithTime,
      youtubeVideoId,
    };

    const safePayload = JSON.parse(JSON.stringify(coursePayload));
    const course = await Course.create(safePayload);

    return res.status(201).json(course);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Create course error:", message);
    return res.status(500).json({ message });
  }
};
export const getMyCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    const courses = await Course.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(courses);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Get courses error:", message);
    return res.status(500).json({ message });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    const course = await Course.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.json(course);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Get course error:", message);
    return res.status(500).json({ message });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (String(course.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await course.deleteOne();
    return res.json({ message: "Course deleted successfully" });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Delete course error:", message);
    return res.status(500).json({ message });
  }
};
