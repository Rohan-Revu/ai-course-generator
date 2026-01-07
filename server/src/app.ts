import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import progressRoutes from "./routes/progressRoutes";
import testRoutes from "./routes/testRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/test", testRoutes);

app.get("/", (_req, res) => res.send({ ok: true, message: "API running" }));

export default app;
