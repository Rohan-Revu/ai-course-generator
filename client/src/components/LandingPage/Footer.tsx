import { useNavigate } from "react-router-dom";
export default function Footer() {
  const navigate = useNavigate();
  return (
    <section
      className="text-center d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(180deg, #3A23D1 0%, #7C42DB 40%, #A35AE8 60%, #2A22A0 100%)",
        color: "white",
        padding: "80px 20px",
      }}
    >
      <div>
        <h1 className="fw-bold display-4">
          Ready to Transform Your <br /> Learning?
        </h1>

        <p className="mt-3 fs-5">
          Experience the future of learning — build your own AI-powered course
          in minutes. No cost, no limits.
        </p>

        <button
          className="btn btn-light px-4 py-2 mt-4 fw-semibold"
          style={{ borderRadius: "12px", fontSize: "1.1rem" }}
          onClick={() => navigate("/signup")}
        >
          Let’s Begin →
        </button>
      </div>
    </section>
  );
}
