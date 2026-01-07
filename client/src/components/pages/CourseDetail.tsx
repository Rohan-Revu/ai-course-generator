import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/media";

type LessonObj = {
  title: string;
  content?: string;
  durationMinutes?: number;
  resources?: string[];
};
type Module = {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: (string | LessonObj)[];
  timeDays?: number;
  quizQuestions?: string[];
};
type Course = {
  _id: string;
  title: string;
  topic: string;
  description?: string;
  level: string;
  durationDays: number;
  modules: Module[];
  youtubeVideoId?: string;
  imageUrl?: string;
  completedPercent: number;
  completedLessons?: { moduleNumber: number; lessonIndex: number }[];
};

const CircleProgress = ({
  value,
  size = 72,
  stroke = 8,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <g transform={`translate(${size / 2},${size / 2})`}>
        <circle r={radius} fill="none" stroke="#eee" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          stroke="#A75EEC"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
        <text x="0" y="5" textAnchor="middle" fontSize={12} fill="#333">
          {`${value}%`}
        </text>
      </g>
    </svg>
  );
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModuleNumber, setSelectedModuleNumber] = useState<
    number | null
  >(null);
  const [toggling, setToggling] = useState(false);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get<Course>(`/courses/${id}`);
      setCourse(res.data);
      if (res.data.modules && res.data.modules.length > 0) {
        setSelectedModuleNumber(res.data.modules[0].moduleNumber);
      } else {
        setSelectedModuleNumber(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCourse();
  }, [id]);

  const isLessonCompleted = (moduleNumber: number, lessonIndex: number) => {
    return !!course?.completedLessons?.some(
      (c) => c.moduleNumber === moduleNumber && c.lessonIndex === lessonIndex
    );
  };

  const toggleLesson = async (moduleNumber: number, lessonIndex: number) => {
    if (!course) return;
    setToggling(true);
    try {
      const res = await api.patch(`/courses/${course._id}/lesson`, {
        moduleNumber,
        lessonIndex,
      });
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              completedPercent: res.data.completedPercent,
              completedLessons: res.data.completedLessons,
            }
          : prev
      );
    } catch (err) {
      console.error("Toggle lesson error", err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!course) return <div className="p-4">Course not found</div>;

  const selectedModule =
    course.modules.find((m) => m.moduleNumber === selectedModuleNumber) ||
    course.modules[0] ||
    null;

  const img = resolveImageUrl(course.imageUrl);

  return (
    <div className="d-flex min-vh-100" style={{ background: "#f3e8ff" }}>
      <aside
        style={{
          width: 600,
          borderRight: "1px solid #eee",
          background: "#fff",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <div className="mb-3 d-flex align-items-center">
          <button
            className="btn btn-link me-2"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>
          <h5 className="mb-0">{course.title}</h5>
        </div>

        <img
          src={img}
          alt={course.title}
          style={{
            width: "100%",
            height: 150,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        <p className="small text-muted">
          {course.topic} · {course.level} · {course.durationDays} days
        </p>

        <div className="d-flex align-items-center gap-3 mb-3">
          <CircleProgress value={course.completedPercent} />
          <div>
            <div className="small text-muted">Progress</div>
            <div className="fw-bold">{course.completedPercent}%</div>
          </div>
        </div>

        <div className="mt-3">
          <h6>Modules</h6>
          <div className="list-group">
            {course.modules.map((m) => (
              <button
                key={m.moduleNumber}
                className={`list-group-item list-group-item-action ${
                  m.moduleNumber === selectedModuleNumber ? "active" : ""
                }`}
                onClick={() => setSelectedModuleNumber(m.moduleNumber)}
                style={{ textAlign: "left" }}
                type="button"
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>Module {m.moduleNumber}</strong>
                    <div className="small text-muted">{m.title}</div>
                  </div>
                  <div className="small text-muted">{m.timeDays ?? "-"}d</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h6 className="mb-2">Course Video</h6>
          {course.youtubeVideoId ? (
            <div className="ratio ratio-16x9">
              <iframe
                title="course-video"
                src={`https://www.youtube.com/embed/${course.youtubeVideoId}`}
                allowFullScreen
              />
            </div>
          ) : (
            <p className="small text-muted">No video found for this course.</p>
          )}
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4>{selectedModule?.title ?? "Module"}</h4>
            <p className="text-muted mb-1">
              {selectedModule?.description ?? ""}
            </p>
            <small className="text-muted">
              Estimated time: {selectedModule?.timeDays ?? "-"} days
            </small>
          </div>
        </div>

        <div className="mt-3">
          <h6>Lessons</h6>
          <ul className="list-group">
            {selectedModule &&
              (selectedModule.lessons || []).map((lesson, idx) => {
                const lessonObj: LessonObj =
                  typeof lesson === "string"
                    ? { title: lesson, content: "" }
                    : lesson;
                const completed = isLessonCompleted(
                  selectedModule.moduleNumber,
                  idx
                );
                return (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-start mb-3"
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        className={
                          completed ? "text-decoration-line-through" : ""
                        }
                      >
                        <strong>{lessonObj.title}</strong>
                      </div>
                      {lessonObj.content ? (
                        <p className="mb-0 mt-2">{lessonObj.content}</p>
                      ) : (
                        <p className="mb-0 mt-2 text-muted">
                          No description available for this lesson.
                        </p>
                      )}
                    </div>

                    <div className="ms-3 d-flex flex-column align-items-center">
                      <input
                        type="checkbox"
                        style={{ width: 25, height: 25 }}
                        checked={completed}
                        disabled={toggling}
                        onChange={() =>
                          toggleLesson(selectedModule.moduleNumber, idx)
                        }
                      />
                      <small className="text-muted mt-2">
                        Lesson {idx + 1}
                      </small>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>

        {selectedModule &&
          Array.isArray(selectedModule.quizQuestions) &&
          selectedModule.quizQuestions.length > 0 && (
            <div className="mt-4">
              <h6>Quiz</h6>
              <ol>
                {selectedModule.quizQuestions.map((q, i) => (
                  <li key={i} className="mb-2">
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          )}
      </main>
    </div>
  );
};

export default CourseDetail;
