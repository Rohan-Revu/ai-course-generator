import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn(
    "GEMINI_API_KEY not found in environment - Gemini will fail until you provide a key."
  );
}

const client = new GoogleGenerativeAI(apiKey as string);
const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

type GeminiCourseLevel = "beginner" | "intermediate" | "advanced";
type GeminiLesson = {
  title: string;
  content: string;
  durationMinutes?: number;
  resources?: string[];
};
type GeminiModule = {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: GeminiLesson[];
  quizQuestions?: string[];
};

export type GeminiCourse = {
  title: string;
  topic: string;
  level: GeminiCourseLevel;
  durationWeeks: number;
  goal?: string;
  modules: GeminiModule[];
};

function tryParseJsonMaybe(text: string) {
  try {
    return JSON.parse(text);
  } catch (_e) {
    const firstBrace = text.indexOf("{");
    const firstBracket = text.indexOf("[");
    const startIdx =
      firstBrace >= 0 ? firstBrace : firstBracket >= 0 ? firstBracket : -1;
    if (startIdx === -1)
      throw new Error("No JSON object/array found in response text.");
    const substr = text.slice(startIdx);
    let stack: string[] = [];
    const openChar = substr[0];
    const closeChar = openChar === "{" ? "}" : "]";
    let endPos = -1;
    for (let i = 0; i < substr.length; i++) {
      const ch = substr[i];
      if (ch === openChar) stack.push(ch);
      else if (ch === closeChar) {
        stack.pop();
        if (stack.length === 0) {
          endPos = i;
          break;
        }
      }
    }
    if (endPos === -1)
      throw new Error("Couldn't find matching JSON end delimiter.");
    const candidate = substr.slice(0, endPos + 1);
    return JSON.parse(candidate);
  }
}

function extractTextFromAnyResult(result: any): string {
  try {
    if (result?.response && typeof result.response.text === "function") {
      const t = result.response.text();
      if (typeof t === "string" && t.trim()) return t;
    }
  } catch {}

  try {
    if (
      result?.output &&
      Array.isArray(result.output) &&
      result.output[0]?.content
    ) {
      const c = result.output[0].content;
      if (Array.isArray(c) && c.length > 0) {
        const first = c.find(
          (x: any) =>
            typeof x === "string" || (x?.text && typeof x.text === "string")
        );
        if (typeof first === "string") return first;
        if (first?.text) return first.text;
      } else if (typeof c === "string") {
        return c;
      }
    }
  } catch {}

  try {
    if (
      result?.candidates &&
      Array.isArray(result.candidates) &&
      result.candidates[0]?.content
    ) {
      const cand = result.candidates[0].content;
      if (typeof cand === "string") return cand;
      if (cand?.text) return String(cand.text);
    }
  } catch {}

  if (typeof result?.text === "string" && result.text.trim())
    return result.text;
  if (typeof result?.outputText === "string" && result.outputText.trim())
    return result.outputText;
  if (typeof result?.generatedText === "string" && result.generatedText.trim())
    return result.generatedText;

  try {
    const s = JSON.stringify(result);
    if (s && s.length > 2) return s;
  } catch {}

  throw new Error(
    "Unable to extract text from Gemini SDK response. Inspect raw response."
  );
}

export const generateCourseWithGemini = async (params: {
  topic: string;
  level: GeminiCourseLevel;
  durationWeeks: number;
  goal?: string;
  modulesCount?: number;
}): Promise<GeminiCourse> => {
  const { topic, level, durationWeeks, goal = "", modulesCount = 6 } = params;

  const prompt = `You are an expert course designer. OUTPUT ONLY valid JSON (no explanation).

Return a single JSON object exactly matching this schema:
{
  "title": "string",
  "topic": "${topic}",
  "level": "${level}",
  "durationWeeks": ${durationWeeks},
  "goal": "${(goal || "").replace(/"/g, '\\"')}",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "string",
      "description": "string",
      "lessons": [
        { "title": "string", "content": "string (4-6 short sentences)", "durationMinutes": 10 }
      ],
      "quizQuestions": ["string"]
    }
  ]
}

REQUIREMENTS:
- Produce between 4 and 8 modules (aim for ${modulesCount}).
- Each module must have 3–6 lessons.
- **Each lesson.content must be 4–6 sentences**: short, precise, beginner-friendly, with examples when appropriate.
- Do NOT output any extra text, explanation, or markdown. Output exactly one JSON object.

Topic: "${topic}".
Level: "${level}".
DurationWeeks: ${durationWeeks}.`;

  let sdkResult: any;
  try {
    try {
      // @ts-ignore
      sdkResult = await model.generateContent(prompt);
    } catch {
      // @ts-ignore
      sdkResult = await model.generateContent({ text: prompt });
    }
  } catch (err) {
    throw new Error("Gemini call failed: " + (err as Error).message);
  }

  let text: string;
  try {
    text = extractTextFromAnyResult(sdkResult);
  } catch (err) {
    let raw = "";
    try {
      raw = JSON.stringify(sdkResult).slice(0, 2000);
    } catch {
      raw = String(sdkResult).slice(0, 2000);
    }
    throw new Error(
      "Failed to extract text from Gemini response: " +
        (err as Error).message +
        "\nRaw (truncated): " +
        raw
    );
  }

  let parsed: any;
  try {
    parsed = tryParseJsonMaybe(text);
  } catch (err) {
    const sample =
      text.length > 1000 ? text.slice(0, 1000) + " ...(truncated)..." : text;
    throw new Error(
      "Failed to parse JSON from Gemini response: " +
        (err as Error).message +
        "\nRaw text:\n" +
        sample
    );
  }

  if (!parsed || !Array.isArray(parsed.modules)) {
    throw new Error(
      "Parsed Gemini JSON does not contain 'modules' array. Raw parsed object: " +
        JSON.stringify(parsed).slice(0, 1000)
    );
  }

  const modules = parsed.modules.map((m: any, i: number) => {
    const lessonsRaw = Array.isArray(m.lessons) ? m.lessons : [];
    const lessons: GeminiLesson[] = lessonsRaw.map((l: any, li: number) => {
      if (!l) return { title: `Lesson ${li + 1}`, content: "" };
      if (typeof l === "string") return { title: l, content: "" };

      const title =
        typeof l.title === "string"
          ? l.title
          : typeof l.name === "string"
          ? l.name
          : `Lesson ${li + 1}`;
      const content =
        typeof l.content === "string"
          ? l.content
          : typeof l.body === "string"
          ? l.body
          : "";
      const durationMinutes =
        typeof l.durationMinutes === "number"
          ? l.durationMinutes
          : typeof l.duration === "number"
          ? l.duration
          : undefined;
      const resources = Array.isArray(l.resources)
        ? l.resources.map((r: any) => String(r))
        : [];
      const out: GeminiLesson = { title, content };
      if (durationMinutes) out.durationMinutes = durationMinutes;
      if (resources.length) out.resources = resources;
      return out;
    });

    const quizQuestions = Array.isArray(m.quizQuestions)
      ? m.quizQuestions.map((q: any) => String(q))
      : [];

    return {
      moduleNumber: typeof m.moduleNumber === "number" ? m.moduleNumber : i + 1,
      title: m.title ?? `Module ${i + 1}`,
      description: m.description ?? "",
      lessons,
      quizQuestions,
    } as GeminiModule;
  });

  const result: GeminiCourse = {
    title: parsed.title ?? `${topic} Course`,
    topic: parsed.topic ?? topic,
    level: parsed.level ?? level,
    durationWeeks:
      typeof parsed.durationWeeks === "number"
        ? parsed.durationWeeks
        : durationWeeks,
    goal: parsed.goal ?? goal ?? "",
    modules,
  };

  return result;
};
