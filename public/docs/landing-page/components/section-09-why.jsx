// Section 09 — Why IntegrateWise + Data Control + Forest Footer CTA

const FEATURES = [
  {
    icon: "🌳",
    title: "Adaptive Spine",
    body: "A continuously evolving operational memory across your organization. Every action, every decision, every outcome becomes part of what your platform knows.",
  },
  {
    icon: "🔀",
    title: "Universal Capability Fabric",
    body: "Translate human intent into governed execution across any system. Say what you need done — the fabric selects, routes, and executes through the best available provider.",
  },
  {
    icon: "✨",
    title: "AI-Native",
    body: "Works where users already work — inside their AI assistants. ChatGPT, Claude, Perplexity, Hermes. No new UI to learn. No migration.",
  },
  {
    icon: "🛡️",
    title: "Enterprise Governance",
    body: "Policies, approvals, audit trails, and operational trust built in. Every action is governed. Every execution is auditable. Nothing ships without authorization.",
  },
];

const CONTROLS = [
  "Zero data training",
  "Tenant isolation",
  "Role-based access",
  "Full audit history",
];

const Why = () => {
  return (
    <section id="why" className="section" style={{ borderTop: "1px solid var(--hairline)" }}>
      <div className="wrap">
        <div className="section-index reveal">WHY INTEGRATEWISE</div>

        <div
          className="reveal reveal-delay-1"
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left: 4 feature cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "22px 20px",
                  background: "var(--paper-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 14,
                  transition: "all 0.2s var(--easing)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--forest-3)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(95,122,84,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hairline)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--forest-0)",
                    border: "1px solid var(--forest-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "var(--ink-0)",
                      letterSpacing: "-0.008em",
                    }}
                  >
                    {f.title}
                  </div>
                  <div className="small mt-8" style={{ color: "var(--ink-2)", lineHeight: 1.5 }}>
                    {f.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Data Control card */}
          <div
            style={{
              padding: "32px 28px",
              background: "linear-gradient(145deg, var(--forest-5) 0%, var(--forest-4) 100%)",
              borderRadius: 20,
              color: "var(--paper-1)",
              position: "relative",
              overflow: "hidden",
              minHeight: 320,
            }}
          >
            {/* Decorative lock/keyhole */}
            <svg
              style={{
                position: "absolute",
                right: -20,
                bottom: -20,
                opacity: 0.06,
                width: 160,
                height: 160,
              }}
              viewBox="0 0 100 100"
              fill="none"
            >
              <rect x="25" y="45" width="50" height="45" rx="6" stroke="white" strokeWidth="2" />
              <path d="M35 45V35a15 15 0 0 1 30 0v10" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="65" r="8" stroke="white" strokeWidth="2" />
              <path d="M50 65v8" stroke="white" strokeWidth="2" />
            </svg>
            {/* Decorative leaf */}
            <svg
              style={{ position: "absolute", top: 16, right: 20, opacity: 0.1 }}
              width="60"
              height="80"
              viewBox="0 0 30 40"
              fill="none"
            >
              <path
                d="M15 0C4 0 0 14 0 24s3 16 15 16c6 0 10-4 12-8"
                stroke="white"
                strokeWidth="1"
                fill="white"
                opacity="0.3"
              />
              <path d="M15 0c2 8 5 14 11 18" stroke="white" strokeWidth="0.8" fill="none" />
            </svg>

            <div
              className="row gap-10"
              style={{ alignItems: "center", position: "relative", zIndex: 1 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="12"
                  rx="2"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                />
                <path d="M8 10V6a4 4 0 0 1 8 0v4" stroke="var(--gold)" strokeWidth="1.5" />
                <path d="M12 15v3" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 18h4" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" />
                <path d="M6 20q3-2 6-1t6 1" stroke="var(--gold)" strokeWidth="0.6" opacity="0.5" />
              </svg>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>
                Your data. Your control.
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                position: "relative",
                zIndex: 1,
              }}
            >
              {CONTROLS.map((c, i) => (
                <div key={i} className="row gap-10" style={{ alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="var(--forest-1)" strokeWidth="1.2" />
                    <path
                      d="M5 8.5l2 2 4-4"
                      stroke="var(--forest-1)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    style={{ fontSize: 14, color: "var(--forest-1)", letterSpacing: "-0.005em" }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forest Footer CTA */}
      <ForestFooter />
    </section>
  );
};

const ForestFooter = () => (
  <section
    id="start"
    className="forest-bg"
    style={{
      marginTop: 80,
      padding: "clamp(100px, 14vh, 160px) 0 clamp(60px, 8vh, 100px)",
      color: "var(--paper-1)",
    }}
  >
    <div
      className="wrap"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr 1fr",
        gap: 40,
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Left */}
      <div className="reveal">
        <div
          style={{
            fontSize: "clamp(24px, 2.8vw, 36px)",
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: "-0.012em",
          }}
        >
          Your AI already knows language.
        </div>
        <div
          style={{
            fontSize: "clamp(24px, 2.8vw, 36px)",
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: "-0.012em",
            marginTop: 8,
          }}
        >
          Now let it know <span style={{ color: "var(--gold)" }}>your business.</span>
        </div>
      </div>

      {/* Center */}
      <div className="reveal reveal-delay-1" style={{ textAlign: "center" }}>
        <div className="row gap-10" style={{ alignItems: "center", justifyContent: "center" }}>
          <Logomark size={28} />
          <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: "-0.01em" }}>
            IntegrateWise
          </span>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            fontFamily: "var(--font-serif)",
            marginTop: 16,
            letterSpacing: "-0.012em",
            color: "var(--gold)",
          }}
        >
          Your Last Auth to Complete Your Ecosystem.
        </div>
        <div style={{ fontSize: 13, marginTop: 12, opacity: 0.6, letterSpacing: "0.02em" }}>
          Connect once. Work everywhere.
        </div>
      </div>

      {/* Right */}
      <div className="reveal reveal-delay-2" style={{ textAlign: "right" }}>
        <a
          className="btn btn-primary"
          href="#"
          style={{ background: "var(--forest-4)", fontSize: 15, padding: "14px 24px" }}
        >
          Start Your Free Trial
          <svg className="btn-arrow" viewBox="0 0 16 16">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
        <div
          className="row gap-8 mt-12"
          style={{ alignItems: "center", justifyContent: "flex-end", opacity: 0.5, fontSize: 12 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="0.8" />
            <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="0.8" />
          </svg>
          No credit card required
        </div>
      </div>
    </div>

    {/* Full footer below */}
    <div className="wrap" style={{ marginTop: 80, position: "relative", zIndex: 1 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <div className="row gap-10" style={{ alignItems: "center" }}>
            <Logomark size={22} />
            <span style={{ fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em" }}>
              IntegrateWise
            </span>
          </div>
          <p style={{ fontSize: 12, marginTop: 12, opacity: 0.5, maxWidth: 260, lineHeight: 1.5 }}>
            Your last auth to complete your ecosystem. Connect once. Work everywhere.
          </p>
        </div>
        {[
          {
            title: "Platform",
            items: ["Capability Fabric", "Adaptive Spine", "Workbenches", "Governance"],
          },
          { title: "Company", items: ["About", "Careers", "Customers", "Press"] },
          { title: "Resources", items: ["Documentation", "Security", "Changelog", "Status"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", opacity: 0.4 }}>
              {col.title.toUpperCase()}
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {col.items.map((i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    fontSize: 13,
                    color: "var(--paper-1)",
                    textDecoration: "none",
                    opacity: 0.7,
                  }}
                >
                  {i}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="row between mt-48"
        style={{
          alignItems: "center",
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11,
          opacity: 0.4,
        }}
      >
        <span>© 2026 IntegrateWise, Inc.</span>
        <span className="mono" style={{ letterSpacing: "0.12em" }}>
          CONNECT ONCE · WORK EVERYWHERE
        </span>
      </div>
    </div>
  </section>
);

window.Why = Why;
