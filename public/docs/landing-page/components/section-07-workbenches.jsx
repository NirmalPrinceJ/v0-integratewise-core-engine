// Section 07 — Built for Every Workbench

const ROLES = [
  { icon: "🚀", label: "Founder" },
  { icon: "💼", label: "Sales" },
  { icon: "📈", label: "Marketing" },
  { icon: "🤝", label: "Account Success" },
  { icon: "💬", label: "Customer Success" },
  { icon: "📋", label: "Product" },
  { icon: "⚙️", label: "Engineering" },
  { icon: "🔧", label: "Operations" },
  { icon: "🎧", label: "Support" },
  { icon: "💰", label: "Finance" },
  { icon: "👤", label: "HR" },
  { icon: "🛡️", label: "Governance" },
];

const Workbenches = () => {
  return (
    <section id="workbenches" className="section">
      <div className="wrap">
        <div style={{ maxWidth: 780, textAlign: "center", margin: "0 auto" }}>
          <div
            className="section-index reveal"
            style={{ justifyContent: "center", display: "inline-flex" }}
          >
            BUILT FOR EVERY WORKBENCH.
          </div>
          <h2 className="h-1 reveal reveal-delay-1 mt-12">
            One platform.
            <br />
            Twelve operational workbenches.
          </h2>
        </div>

        <div
          className="reveal reveal-delay-2"
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {ROLES.map((role, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "24px 16px",
                background: "var(--paper-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 14,
                transition: "all 0.2s var(--easing)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--forest-3)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(95,122,84,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--hairline)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="wb-icon">{role.icon}</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-0)",
                  letterSpacing: "-0.005em",
                }}
              >
                {role.label}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-32 row" style={{ justifyContent: "center" }}>
          <a className="btn btn-outline" href="#">
            Explore All Workbenches
            <svg className="btn-arrow" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

window.Workbenches = Workbenches;
