export default function Features() {
  return (
    <section className="py-5" style={{ background: "#fafafe" }}>
      <div className="container text-center mb-5">
        <h1 className="fw-bold">
          Learn Anything,{" "}
          <span style={{ color: "#8b44ff" }}>Smarter and Faster</span>
        </h1>
        <p className="text-muted fs-5">
          Discover how AI turns your ideas into complete, personalized courses.
        </p>
      </div>

      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-robot fs-1 text-primary mb-3"></i>
              <h4 className="fw-bold mt-4">AI-Powered Content</h4>
              <p className="text-muted">
                Advanced AI creates structured, comprehensive courses on any
                topic.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-lightning-charge-fill fs-1 text-warning mb-3"></i>
              <h4 className="fw-bold mt-4">Instant Generation</h4>
              <p className="text-muted">
                Create entire courses in seconds and start learning immediately.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-person-check-fill fs-1 text-success mb-3"></i>
              <h4 className="fw-bold mt-4">Personalized Learning</h4>
              <p className="text-muted">
                AI adapts the course to your skill level and learning pace.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-clock-history fs-1 text-info mb-3"></i>
              <h4 className="fw-bold mt-4">Learn at Your Own Pace</h4>
              <p className="text-muted">
                No deadlines, no pressure—learn when it works for you.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-layers-fill fs-1 text-danger mb-3"></i>
              <h4 className="fw-bold mt-4">Versatile Subjects</h4>
              <p className="text-muted">
                AI can generate courses in any domain—from basics to advanced.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="p-4 rounded shadow-sm bg-white h-100 text-center">
              <i className="bi bi-star-fill fs-1 text-warning mb-3"></i>
              <h4 className="fw-bold mt-4">Quality Guaranteed</h4>
              <p className="text-muted">
                Every course is clean, structured, and optimized for learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
