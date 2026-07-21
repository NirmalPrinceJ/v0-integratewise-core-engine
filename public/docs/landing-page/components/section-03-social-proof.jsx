// Section 03 — Social Proof: Customer logos

const SocialProof = () => {
  return (
    <section
      style={{
        padding: "48px 0 56px",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        background: "var(--paper-0)",
      }}
    >
      <div className="wrap">
        <div
          className="mono reveal"
          style={{
            fontSize: 10,
            color: "var(--ink-4)",
            letterSpacing: "0.18em",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          TRUSTED BY INNOVATIVE TEAMS
        </div>
        <div className="social-strip reveal reveal-delay-1">
          <LogoSvg label="GrowthX" />
          <LogoSvg label="Rocketlane" />
          <LogoSvg label="Razorpay" />
          <LogoSvg label="Chargebee" />
          <LogoSvg label="RedBus" />
          <LogoSvg label="Postman" />
          <LogoSvg label="Zeta" />
          <LogoSvg label="Whatfix" />
        </div>
      </div>
    </section>
  );
};

/** Placeholder logo word-mark */
const LogoSvg = ({ label }) => (
  <span
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      fontWeight: 500,
      color: "var(--ink-3)",
      letterSpacing: "-0.01em",
      opacity: 0.6,
    }}
  >
    {label}
  </span>
);

window.SocialProof = SocialProof;
