import mongoose, { Document, Schema } from "mongoose";

type Lesson = {
  title: string;
  content: string;
  durationMinutes?: number;
  resources?: string[];
};
type Module = {
  moduleNumber: number;
  title: string;
  description: string;
  timeDays: number;
  lessons: Lesson[];
  quizQuestions?: string[];
};
type CompletedLesson = {
  moduleNumber: number;
  lessonIndex: number;
};

export interface ICourse extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  topic: string;
  description?: string;
  level: string;
  durationDays: number;
  goal?: string;
  imageUrl?: string;
  completedPercent: number;
  completedLessons: CompletedLesson[];
  modules: Module[];
  youtubeVideoId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<Lesson>(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    durationMinutes: { type: Number },
    resources: [{ type: String }],
  },
  { _id: false }
);

const ModuleSchema = new Schema<Module>(
  {
    moduleNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    timeDays: { type: Number, required: true },
    lessons: { type: [LessonSchema], default: [] },
    quizQuestions: [{ type: String }],
  },
  { _id: false }
);

const CompletedLessonSchema = new Schema<CompletedLesson>(
  {
    moduleNumber: { type: Number, required: true },
    lessonIndex: { type: Number, required: true },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, default: "" },
    level: { type: String, required: true },
    durationDays: { type: Number, required: true },
    goal: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    completedPercent: { type: Number, default: 0 },
    completedLessons: { type: [CompletedLessonSchema], default: [] },
    modules: { type: [ModuleSchema], default: [] },
    youtubeVideoId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
