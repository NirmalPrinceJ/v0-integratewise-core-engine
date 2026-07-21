// Section 01 — Hero: split layout + braided rope circle ecosystem diagram

const Hero = () => {
  return (
    <section
      id="hero"
      className="section"
      style={{
        paddingTop: 110,
        paddingBottom: 80,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rope edge decorations */}
      <RopeEdge side="left" />
      <RopeEdge side="right" />

      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN: Text ── */}
          <div className="reveal in" style={{ paddingTop: "8vh" }}>
            <div className="badge">
              <svg className="icon" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              AI-NATIVE. OPERATIONAL. GOVERNED.
            </div>

            <h1 className="h-display mt-24" style={{ lineHeight: 0.94 }}>
              <span style={{ display: "block", color: "var(--ink-0)" }}>Your Last Auth</span>
              <span style={{ display: "block", color: "var(--forest-5)", marginTop: "0.02em" }}>
                to Complete Your Ecosystem.
              </span>
            </h1>

            <p className="lede mt-20" style={{ maxWidth: 480 }}>
              One authentication. Every capability. Everywhere you work.
            </p>
            <p className="body mt-12" style={{ maxWidth: 460, color: "var(--ink-3)" }}>
              Connect your AI, business applications, and teams into a single operational capability
              fabric. Stay in ChatGPT, Claude, or your Workbench while IntegrateWise securely
              executes across your entire ecosystem.
            </p>

            <div className="row gap-12 mt-32" style={{ alignItems: "center" }}>
              <a className="btn btn-primary" href="#start">
                Start Free
                <svg className="btn-arrow" viewBox="0 0 16 16">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a className="btn btn-ghost" href="#demo">
                <svg className="btn-arrow" viewBox="0 0 16 16">
                  <polygon points="5,3 13,8 5,13" fill="currentColor" stroke="none" />
                </svg>
                Watch Demo
              </a>
            </div>

            <div className="row gap-24 mt-32" style={{ alignItems: "center", flexWrap: "wrap" }}>
              <span className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1l2 4 4.5.5L10 8l1 4.5-4-2.5-4 2.5L4 8 .5 5.5 5 5z"
                    fill="var(--forest-3)"
                    opacity="0.5"
                  />
                </svg>
                Enterprise grade security
              </span>
              <span className="trust-badge">SOC 2</span>
              <span className="trust-badge">GDPR</span>
              <span className="trust-badge">HIPAA</span>
              <span className="trust-badge">ISO 27001</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Ecosystem Diagram ── */}
          <div className="reveal reveal-delay-1" style={{ position: "relative" }}>
            {/* AI Surfaces row (floating above) */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: -12,
                position: "relative",
                zIndex: 2,
              }}
            >
              {[
                { id: "chatgpt", bg: "#10a37f", label: "" },
                { id: "claude", bg: "#d97706", label: "" },
                { id: "perplexity", bg: "#1B045D", label: "" },
                { id: "hermes", bg: "var(--ink-0)", label: "" },
              ].map((a) => (
                <div
                  key={a.id}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: a.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--hairline)",
                    overflow: "hidden",
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  <ToolMark id={a.id} size={18} />
                </div>
              ))}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "1px dashed var(--ink-5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  letterSpacing: "0.1em",
                }}
              >
                More
              </div>
            </div>

            {/* Braided rope circle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <BraidedRopeCircle />

              {/* Text below circle */}
              <div style={{ marginTop: -28, textAlign: "center" }}>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em" }}
                >
                  UNIVERSAL CAPABILITY FABRIC
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-4)",
                    marginTop: 4,
                    letterSpacing: "0.02em",
                  }}
                >
                  Human intent → Governed execution
                </div>
              </div>
            </div>

            {/* Connected Ecosystem grid */}
            <div style={{ marginTop: 24 }}>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  color: "var(--ink-4)",
                  letterSpacing: "0.18em",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                YOUR CONNECTED ECOSYSTEM
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { id: "salesforce", label: "Salesforce" },
                  { id: "hubspot", label: "HubSpot" },
                  { id: "slack", label: "Slack" },
                  { id: "teams", label: "Teams" },
                  { id: "gmail", label: "Gmail" },
                  { id: "outlook", label: "Outlook" },
                  { id: "notion", label: "Notion" },
                  { id: "googledrive", label: "Google Drive" },
                  { id: "github", label: "GitHub" },
                  { id: "jira", label: "Jira" },
                  { id: "linear", label: "Linear" },
                  { id: "confluence", label: "Confluence" },
                  { id: "zoom", label: "Zoom" },
                  { id: "twilio", label: "Twilio" },
                  { id: "aircall", label: "Aircall" },
                ].map((app) => (
                  <div
                    key={app.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 8px",
                      background: "var(--paper-1)",
                      border: "1px solid var(--hairline)",
                      borderRadius: 8,
                      fontSize: 10,
                      color: "var(--ink-2)",
                      fontWeight: 500,
                    }}
                  >
                    <ToolMark id={app.id} size={12} />
                    {app.label}
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 8px",
                    background: "transparent",
                    border: "1px dashed var(--ink-5)",
                    borderRadius: 8,
                    fontSize: 10,
                    color: "var(--ink-3)",
                  }}
                >
                  200+ more
                </div>
              </div>
            </div>

            {/* Adaptive Spine bar */}
            <div
              style={{
                marginTop: 20,
                padding: "12px 20px",
                background: "var(--forest-0)",
                borderRadius: 10,
                textAlign: "center",
                border: "1px solid var(--forest-1)",
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--forest-4)", letterSpacing: "0.14em" }}
              >
                ADAPTIVE SPINE
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--forest-3)",
                  marginTop: 4,
                  letterSpacing: "0.04em",
                }}
              >
                Memory • Context • Intelligence • Governance • Continuity
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Braided Rope Circle ── */
const BraidedRopeCircle = () => {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 64;
  const strandWidth = 6;

  // Create braided effect with overlapping dashed arcs
  const strands = [
    { r: r + 8, offset: 0, color: "#6B8262" }, // olive outer
    { r: r + 8, offset: 14, color: "#C9BFA5" }, // beige outer
    { r: r, offset: 7, color: "#C9BFA5" }, // beige mid
    { r: r, offset: 21, color: "#6B8262" }, // olive mid
    { r: r - 8, offset: 0, color: "#6B8262" }, // olive inner
    { r: r - 8, offset: 14, color: "#C9BFA5" }, // beige inner
  ];

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Base ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D4C5A9" strokeWidth="22" opacity="0.4" />

        {/* Braid strands */}
        {strands.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={s.r}
            fill="none"
            stroke={s.color}
            strokeWidth={strandWidth}
            strokeDasharray="8 14"
            strokeDashoffset={s.offset}
            opacity="0.85"
          />
        ))}

        {/* Decorative small leaf accents on the ring */}
        <path d="M132 36q-4 6-2 12" stroke="#6B8262" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M132 36q0-4 3-6" stroke="#6B8262" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M48 144q4 6 2 12" stroke="#6B8262" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M48 144q0 4-3 6" stroke="#6B8262" strokeWidth="1" fill="none" opacity="0.4" />
      </svg>

      {/* Inner white circle with iW logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 70,
          height: 70,
          borderRadius: 999,
          background: "var(--paper-1)",
          border: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(20,20,15,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            fontWeight: 500,
            color: "var(--forest-5)",
            letterSpacing: "-0.02em",
          }}
        >
          iw
        </span>
      </div>
    </div>
  );
};

/* ── Rope Edge Decoration ── */
const RopeEdge = ({ side }) => {
  const isLeft = side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [isLeft ? "left" : "right"]: 0,
        width: 40,
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.6,
      }}
    >
      {/* Vertical rope strand */}
      <svg
        width="40"
        height="100%"
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <pattern
            id={`rope-${side}`}
            x="0"
            y="0"
            width="20"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="12" fill="#C9BFA5" opacity="0.5" />
            <rect x="10" width="10" height="12" fill="#6B8262" opacity="0.3" />
          </pattern>
        </defs>
        <path
          d={isLeft ? "M20 0 Q 8 100, 16 200 T 20 400" : "M20 0 Q 32 100, 24 200 T 20 400"}
          stroke={`url(#rope-${side})`}
          strokeWidth="6"
          fill="none"
        />
        {/* Small leaves */}
        {isLeft ? (
          <>
            <path
              d="M20 40q-8-4-12 0"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.7"
            />
            <path
              d="M16 120q-6-6-10-2"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.5"
            />
            <path
              d="M18 280q-8-2-10 4"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.4"
            />
          </>
        ) : (
          <>
            <path
              d="M20 50q8-4 12 0"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.7"
            />
            <path
              d="M24 140q6-6 10-2"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.5"
            />
            <path
              d="M22 300q8-2 10 4"
              stroke="#6B8262"
              strokeWidth="1"
              fill="var(--forest-0)"
              opacity="0.4"
            />
          </>
        )}
      </svg>
    </div>
  );
};

window.Hero = Hero;
