export default function HowItWorks() {
  return (
    <section
      style={{
        padding: "100px 20px",
        background: "linear-gradient(to bottom, #fafbff, #f4f5fa)",
      }}
    >
      <h2
        className="fw-bold text-center"
        style={{ fontSize: "3rem", marginBottom: "10px" }}
      >
        How It Works
      </h2>

      <p className="text-muted text-center mb-5" style={{ fontSize: "1.2rem" }}>
        Three simple steps to your personalized learning journey
      </p>

      <div className="container">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div
              className="p-4 shadow-sm rounded-4 bg-white position-relative"
              style={{ borderLeft: "4px solid #A75EEC" }}
            >
              <div
                className="position-absolute rounded-circle"
                style={{
                  top: "-15px",
                  left: "-15px",
                  background: "#A75EEC",
                  color: "white",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "600",
                }}
              >
                1
              </div>

              <h4 className="fw-bold mt-4">Describe Your Topic</h4>
              <p className="text-muted">
                Tell us what you want to learn. From coding to cooking, any
                subject.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 shadow-sm rounded-4 bg-white position-relative"
              style={{ borderLeft: "4px solid #A75EEC" }}
            >
              <div
                className="position-absolute rounded-circle"
                style={{
                  top: "-15px",
                  left: "-15px",
                  background: "#A75EEC",
                  color: "white",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "600",
                }}
              >
                2
              </div>

              <h4 className="fw-bold mt-4">AI Creates Curriculum</h4>
              <p className="text-muted">
                Our AI analyzes your needs and generates a complete course
                structure in seconds.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 shadow-sm rounded-4 bg-white position-relative"
              style={{ borderLeft: "4px solid #A75EEC" }}
            >
              <div
                className="position-absolute rounded-circle"
                style={{
                  top: "-15px",
                  left: "-15px",
                  background: "#A75EEC",
                  color: "white",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "600",
                }}
              >
                3
              </div>

              <h4 className="fw-bold mt-4">Start Learning</h4>
              <p className="text-muted">
                Access your personalized course instantly. Learn at your pace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
