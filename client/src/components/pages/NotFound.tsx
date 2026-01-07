import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{
        background:
          "linear-gradient(to bottom right, #e0c3fc 0%, #8ec5fc 100%)",
        color: "#1c1c1c",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg text-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          maxWidth: "500px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          transition: "transform 0.3s ease-in-out",
          transform: "translateY(0)",
        }}
      >
        <h1
          className="fw-bolder mb-3"
          style={{
            fontSize: "10rem",
            lineHeight: "0.8",
            color: "#6a11cb",
            textShadow: "4px 4px #2575fc40",
            letterSpacing: "5px",
          }}
        >
          404
        </h1>
        <h3 className="fw-bold mb-3 text-dark">Page Not Found</h3>

        <p className="mb-4 text-muted">
          We can't seem to find the page you're looking for. It might have been
          moved or deleted.
        </p>

        <hr className="my-4" style={{ borderColor: "#ddd" }} />

        <Link
          to="/"
          className="btn fw-semibold w-100"
          style={{
            backgroundColor: "#2575fc",
            color: "white",
            padding: "10px 30px",
            borderRadius: "50px",
            boxShadow: "0 4px 15px rgba(37, 117, 252, 0.4)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#6a11cb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2575fc")
          }
        >
          🚀 Take Me Home
        </Link>

        <p className="small mt-3 mb-0">
          If you think this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
