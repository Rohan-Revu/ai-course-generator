import bgImage from "../../assets/hero-image.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.95)
          ), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "visible",
      }}
      className="d-flex flex-column justify-content-center align-items-center text-center"
    >
      <h1
        style={{
          marginTop: "-200px",
          fontSize: "7rem",
          fontWeight: "650",
          color: "#A75EEC",
        }}
      >
        Learnify
      </h1>
      <div
        className="px-4 py-2 rounded-pill shadow-sm mb-4"
        style={{
          background: "rgba(240, 230, 255, 0.8)",
          color: "#8b44ff",
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        ✨ AI-Powered Learning Platform
      </div>
      <h2
        className="fw-bold mt-3"
        style={{ fontSize: "4rem", maxWidth: "900px" }}
      >
        Create Courses With <span style={{ color: "#8b44ff" }}>AI</span>
        <br />
        Personalized for You
      </h2>
      <p
        className="text-muted mt-3"
        style={{ maxWidth: "750px", fontSize: "1.1rem" }}
      >
        Transform any topic into a comprehensive personalized learning
        experience.
        <br />
        Learning made effortless.
      </p>
      <button
        className="btn btn-lg mt-4"
        style={{
          backgroundColor: "#553DC1",
          color: "white",
          padding: "12px 30px",
          borderRadius: "12px",
        }}
        onClick={() => navigate("/signin")}
      >
        Get Started →
      </button>
      <div
        className="mt-4 text-muted small d-flex gap-5"
        style={{ fontSize: "1rem", marginTop: "400px" }}
      >
        <span>🟣 Completely Free</span>
        <span>🟣 Unlimited Courses</span>
        <span>🟣 AI Curriculum</span>
      </div>
    </div>
  );
}
