import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/media";

type Course = {
  _id: string;
  title: string;
  topic: string;
  description?: string;
  level: string;
  durationDays: number;
  imageUrl?: string;
  completedPercent: number;
  modules: any[];
};

const CircleProgress = ({
  value,
  size = 56,
  stroke = 6,
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
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize={12}
          fill="#333"
        >{`${value}%`}</text>
      </g>
    </svg>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutHover, setLogoutHover] = useState(false);
  const [createHover, setCreateHover] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get<Course[]>("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
  }, []);

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ background: "linear-gradient(to top, #ffffff, #f3e8ff)" }}
    >
      <header className="p-1 bg-white border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-1">Hi {user?.name}, Welcome to Learnify!</h4>
          <small>✨ AI-Powered Course Generation</small>
        </div>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate("/manage-courses")}
          >
            Manage Courses
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            style={{
              borderColor: "#b57bf0ff",
              color: createHover ? "white" : "#b57bf0ff",
              backgroundColor: createHover ? "#b57bf0ff" : "transparent",
            }}
            onMouseEnter={() => setCreateHover(true)}
            onMouseLeave={() => setCreateHover(false)}
            onClick={() => navigate("/create-course")}
          >
            + Create Course
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            style={{
              borderColor: "red",

              backgroundColor: logoutHover ? "red" : "transparent",
              color: logoutHover ? "white" : "red",
            }}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container my-4">
        <div className="row g-4">
          {loading && <p>Loading...</p>}
          {!loading && courses.length === 0 && (
            <div className="text-center text-muted mt-5">
              <h6>No courses yet</h6>
              <p>Click Create Course to add your first course.</p>
            </div>
          )}
          {courses.map((c) => {
            const img = resolveImageUrl(c.imageUrl);
            return (
              <div key={c._id} className="col-12 col-md-6 col-lg-3">
                <div
                  className="card h-100 shadow-lg"
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  onClick={() => navigate(`/course/${c._id}`)}
                >
                  <div style={{ height: 250, overflow: "hidden" }}>
                    <img
                      src={img}
                      alt={c.title}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <hr
                    style={{
                      margin: 0,
                      borderColor: "#444343ff",
                      borderWidth: "1px",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{c.title}</h5>
                    <p className="text-muted small mb-2">
                      {c.level.charAt(0).toUpperCase() + c.level.slice(1)} ·{" "}
                      {c.durationDays} days
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <small className="text-muted">
                        {c.modules.length} modules
                      </small>
                      <CircleProgress
                        value={Math.min(
                          100,
                          Math.round(c.completedPercent || 0)
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
