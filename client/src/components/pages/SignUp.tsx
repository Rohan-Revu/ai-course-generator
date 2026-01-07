import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #f3e8ff)",
        padding: "20px",
      }}
    >
      <div
        className="bg-white shadow-lg rounded-4 p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(10px)",
          border: "1px solid #e9d5ff",
        }}
      >
        <img
          src={logo}
          alt="Learnify Logo"
          className="d-block mx-auto mb-3 rounded-3"
          style={{ width: "90px" }}
        />

        <h2 className="fw-bold text-center mb-2" style={{ fontSize: "1.9rem" }}>
          Create Your Account
        </h2>

        <p className="text-center text-muted mb-4">
          Join and start building your personalized AI courses today
        </p>

        {error && <p className="text-danger text-center small mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="d-grid gap-4">
          <input
            type="text"
            className="form-control rounded-3"
            placeholder="Full Name"
            style={{
              height: "48px",
              fontSize: "1rem",
            }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            className="form-control rounded-3"
            placeholder="Email address"
            style={{
              height: "48px",
              fontSize: "1rem",
            }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Password"
            value={form.password}
            style={{
              height: "48px",
              fontSize: "1rem",
            }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-4 w-100"
            style={{
              backgroundColor: "#A75EEC",
              borderColor: "#A75EEC",
            }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-decoration-none fw-semibold"
            style={{ color: "#A75EEC" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
