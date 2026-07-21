// Section 02 — What IntegrateWise Does

const INTENTS = [
  { text: '"Email Sarah."' },
  { text: '"Create a GitHub issue."' },
  { text: '"Find the Q4 roadmap."' },
  { text: '"Schedule a follow-up."' },
];

const What = () => {
  return (
    <section
      id="what"
      className="section"
      style={{
        background: "var(--paper-0)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="wrap">
        <div style={{ maxWidth: 760 }}>
          <div className="section-index reveal">01 · What IntegrateWise Does</div>
          <h2 className="h-1 reveal reveal-delay-1">
            Instead of moving between dozens of applications,
            <br />
            your AI gains governed access to the capabilities you already own.
          </h2>
        </div>

        {/* Intent blocks */}
        <div
          className="reveal reveal-delay-2"
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "var(--paper-3)",
              border: "1px solid var(--hairline)",
              borderRadius: 14,
              padding: 32,
              boxShadow: "0 1px 2px rgba(20,20,15,0.03), 0 16px 40px -24px rgba(20,20,15,0.1)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-4)",
                letterSpacing: "0.14em",
                marginBottom: 20,
              }}
            >
              YOU ASK
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {INTENTS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: "var(--paper-2)",
                    borderRadius: 10,
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--forest-4)",
                      fontWeight: 500,
                      minWidth: 28,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span style={{ fontSize: 16, color: "var(--ink-0)", fontWeight: 500 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid var(--hairline)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 13,
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: "var(--forest-3)",
                }}
              />
              IntegrateWise securely resolves the intent
            </div>
          </div>

          {/* Resolution flow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              { label: "Resolves the intent", icon: "→" },
              { label: "Selects the right provider", icon: "→" },
              { label: "Executes the action", icon: "→" },
              { label: "Maintains operational continuity", icon: "∞" },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  padding: "18px 20px",
                  borderLeft: i === 3 ? "2px solid var(--forest-4)" : "2px solid var(--forest-3)",
                  borderRadius: 0,
                  background:
                    i === 3
                      ? "linear-gradient(90deg, color-mix(in oklch, var(--forest-4) 6%, transparent) 0%, transparent 100%)"
                      : "transparent",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: i === 3 ? "var(--forest-4)" : "var(--ink-3)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {step.icon} {step.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

window.What = What;
