import express from "express";
import cors, { CorsOptions } from "cors";

import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import progressRoutes from "./routes/progressRoutes";
import testRoutes from "./routes/testRoutes";

const app = express();

/**
 *  TYPE-SAFE CORS CONFIG (NO TS ERRORS)
 */
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow Postman, server-to-server
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "https://ai-course-generator-rho.vercel.app",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/test", testRoutes);

// ---------------- HEALTH CHECK ----------------
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API running" });
});

export default app;
