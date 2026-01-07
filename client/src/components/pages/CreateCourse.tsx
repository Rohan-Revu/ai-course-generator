import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/media";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner"
  );
  const [durationDays, setDurationDays] = useState<number>(14);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    (f: File | null) => {
      setFile(f);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (!f) return setImagePreview(null);
      setImagePreview(URL.createObjectURL(f));
    },
    [imagePreview]
  );

  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;
    const form = new FormData();
    form.append("image", file);

    const res = await api.post("/uploads", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic) return setError("Please enter a topic");

    try {
      setLoading(true);
      setError("");

      let imageUrl = "";
      if (file) {
        const uploaded = await uploadImage();
        imageUrl = uploaded || "";
      }

      await api.post("/courses", {
        topic,
        description,
        level,
        durationDays,
        imageUrl,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  const previewSrc = imagePreview || resolveImageUrl(undefined);
  const [createHover, setCreateHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to top, #ffffff, #f3e8ff)",
        padding: 20,
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="bg-white shadow-lg rounded-4 p-4 p-md-5"
        style={{ width: "100%", maxWidth: 580, border: "1px solid #e9d5ff" }}
      >
        <h2 className="fw-bold text-center mb-2">Create a New Course</h2>
        <p className="text-center text-muted mb-4">
          Describe the course and upload an image to show on the dashboard card.
        </p>

        {error && <p className="text-danger text-center small mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="form-control"
            placeholder="Topic (e.g. React Basics - be specific)"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Description (optional)"
            rows={3}
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="form-select"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div>
            <label className="form-label">Duration (days)</label>
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="form-control"
            />
          </div>

          <div>
            <label className="form-label">Course image (optional)</label>

            <div className="d-flex justify-content-start align-items-center gap-4">
              <div
                className="d-flex justify-content-center align-items-center border rounded"
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: "#f8f9fa",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Course thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }}
                  />
                ) : (
                  <div
                    className="text-muted d-flex justify-content-center align-items-center"
                    style={{
                      fontSize: "3rem",
                      width: "100%",
                      height: "100%",
                      zIndex: 0,
                    }}
                  >
                    +
                  </div>
                )}
              </div>
              {imagePreview ? (
                <small className="form-text text-muted">
                  Image selected. Click the box to change it.
                </small>
              ) : (
                <small className="form-text text-muted">
                  Click the box to select a file.
                </small>
              )}
            </div>
          </div>

          <div className="d-grid gap-4">
            <button
              className="btn btn-primary btn-lg"
              style={{
                borderColor: "#b57bf0ff",
                color: createHover ? "white" : "#b57bf0ff",
                backgroundColor: createHover ? "#b57bf0ff" : "transparent",
              }}
              onMouseEnter={() => setCreateHover(false)}
              onMouseLeave={() => setCreateHover(true)}
              type="submit"
              disabled={loading}
            >
              {loading ? "Generating course..." : "Generate Course"}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{
                borderColor: "gray",

                backgroundColor: cancelHover ? "gray" : "transparent",
                color: cancelHover ? "white" : "gray",
              }}
              onMouseEnter={() => setCancelHover(true)}
              onMouseLeave={() => setCancelHover(false)}
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
