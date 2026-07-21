// Section 05 — Human Intent → Execution (card layout)

const INTENTS = [
  { label: "Call Sarah", icon: "📞", action: "Best available calling provider" },
  { label: "Email the customer", icon: "✉️", action: "Gmail, Outlook, or CRM Email" },
  { label: "Create a task", icon: "✅", action: "Jira, GitHub, Linear, or Notion" },
  { label: "Find the roadmap", icon: "🔍", action: "Notion, Confluence, Google Docs" },
  { label: "Schedule follow-up", icon: "📅", action: "Google Calendar or Outlook" },
  { label: "Approve renewal", icon: "🛡️", action: "CRM + Governance workflow" },
];

const IntentExecution = () => {
  return (
    <section
      id="intent"
      className="section"
      style={{
        background: "var(--paper-0)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div className="wrap">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <div
            className="section-index reveal"
            style={{ justifyContent: "center", display: "inline-flex" }}
          >
            HUMAN INTENT → EXECUTION
          </div>
          <h2 className="h-1 reveal reveal-delay-1 mt-12">
            You think in work.
            <br />
            We handle the rest.
          </h2>
        </div>

        {/* 6 Cards */}
        <div
          className="reveal reveal-delay-2"
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {INTENTS.map((item, i) => (
            <div key={i} className="intent-card">
              <div className="row gap-10" style={{ alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--ink-0)",
                    letterSpacing: "-0.008em",
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.4, flex: 1 }}>
                {item.action}
              </div>
              <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <span className="btn-exe">EXECUTED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div
          className="reveal mt-32"
          style={{
            maxWidth: 620,
            margin: "32px auto 0",
            textAlign: "center",
            fontSize: 14,
            color: "var(--ink-3)",
            lineHeight: 1.5,
          }}
        >
          IntegrateWise securely resolves the intent, selects the right provider, executes the
          action, and maintains operational continuity.
        </div>
      </div>
    </section>
  );
};

window.IntentExecution = IntentExecution;
