import express from "express";
import { generateCourseWithGemini } from "../utils/geminiCourseGenerator";
const router = express.Router();

router.post("/gemini", async (req, res) => {
  try {
    const { topic, level, durationWeeks, goal } = req.body;
    if (!topic || !level)
      return res.status(400).json({ message: "topic and level required" });
    const parsed = await generateCourseWithGemini({
      topic,
      level,
      durationWeeks: Number(durationWeeks) || 4,
      goal,
    });
    return res.json({ ok: true, parsed });
  } catch (err: any) {
    console.error("Gemini test error:", err?.message || err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
