import React, { type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

type Course = {
  _id: string;
  title: string;
};

export default function ManageCourses(): JSX.Element {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!user) return;
    fetchCourses();
  }, [user, fetchCourses]);

  const handleDelete = async (id: string, title?: string) => {
    const ok = window.confirm(`Delete course "${title ?? ""}"?`);
    if (!ok) return;

    try {
      setDeleting(id);
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to top, #ffffff, #f3e8ff)",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Manage Courses</h2>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-4">
            <p>You don't have any courses yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-course")}
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="list-group">
            {courses.map((c) => (
              <div
                key={c._id}
                className="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm"
                style={{ borderRadius: 8 }}
              >
                <p className="mb-0 fw-normal" style={{ margin: 0 }}>
                  {c.title}
                </p>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(c._id, c.title)}
                  disabled={deleting === c._id}
                  type="button"
                >
                  {deleting === c._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
