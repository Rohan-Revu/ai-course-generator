import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import progressRoutes from "./routes/progressRoutes";
import testRoutes from "./routes/testRoutes";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/test", testRoutes);

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API running" });
});

export default app;
