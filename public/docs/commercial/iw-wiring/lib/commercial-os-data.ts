// Commercial OS — canonical data module
// Source of truth: repo docs/commercial/ (git) · Synced 2026-07-21
// This module is static by design: the Commercial OS page must render with zero runtime dependencies.

export const canon = {
  category: "Workspace for Human and AI Collaborative Work",
  oneLiner:
    "IntegrateWise is the workspace where humans and their Twins do the work together — one shared workbench, governed actions, and truth the organization owns.",
  plainForm: "AI that remembers what you told it, finishes what it started, and doesn't make things up.",
  stack: [
    "Workspace",
    "Shared Workbench",
    "Human + Twin Collaboration",
    "Capability Execution",
    "Organizational Continuity",
  ],
  lines: [
    { text: "Truth you own. AI you rent. Approval in between.", use: "brand doctrine" },
    { text: "My work already knows its context. AI prepared the hard parts. I decide.", use: "experience promise" },
    { text: "Every AI remembers. Only IntegrateWise remembers the truth.", use: "trust line" },
    { text: "The Twin prepares. The human approves.", use: "governance law" },
    { text: "AI never owns organizational truth. The Adaptive Spine owns truth.", use: "architecture doctrine" },
    { text: "The next piece of work starts where the last one ended.", use: "continuity promise" },
    { text: "Dashboards show work. Workbenches do work.", use: "vs. BI" },
    { text: "Copilots visit your apps. IntegrateWise is where work lives.", use: "vs. copilots" },
  ],
  pillars: [
    { name: "One Workspace", vs: "Fragmentation — “I'm the Human API”" },
    { name: "A Twin on the Bench", vs: "Amnesia — “I told it once. It forgot.”" },
    { name: "Truth You Own", vs: "Anarchy — “It did something. Nobody approved it.”" },
  ],
  enemies: ["Amnesia", "Babysitting", "Hallucination", "Human API"],
  neverSay: [
    "“Operating System” / “platform” as category (DECISION 23)",
    "“Capability Fabric” in customer-facing copy",
    "assistant / chatbot / copilot for the Twin",
    "“replace your CRM”",
    "autonomy promises (“AI that runs your business”)",
  ],
}

export const positioning =
  "For teams whose work is scattered across dozens of disconnected tools — and whose AI experiments quietly failed — IntegrateWise is the workspace for human and AI collaborative work. Every person works alongside a governed Twin on a shared workbench, over operational truth the organization owns. Unlike copilots bolted onto single apps, automation tools that move data without understanding it, or assistants that forget everything, IntegrateWise gives humans and AI one place to do the work together — with memory that persists, actions that require approval, and truth that never belongs to the AI."

export const priceBook = [
  { tier: "Starter", price: "$19", headline: "See your truth", gates: "1 workbench · 3 connectors · signals only · 4h sync" },
  { tier: "Growth", price: "$59", headline: "Work with your Twin", gates: "3 workbenches · 10 connectors · observes/prepares/suggests · 1h sync" },
  { tier: "Command", price: "$119", headline: "Govern the work", gates: "Unlimited benches · 25+ connectors · propose + governed execution + TruthLayer · 15min sync" },
  { tier: "Enterprise", price: "Custom", headline: "Continuity at scale", gates: "15-seat min · SSO/SCIM · custom policy · SLA 99.9%" },
]

export const dealMath =
  "Land 15×Growth ≈ $10.6K · Core 20×Command ≈ $28.6K · Blended ≈ $22K · Enterprise $150K+. Seat = human + Twin. Monthly +20%. ROI: H×22×C×A×N — conservative ≈14x on Command."

export const phases = [
  { phase: "P0 Prove", window: "now → Q4 2026", exit: "4 paying · activation ≥70% · 1 documented catch/account · repeatable demo→POV→close", status: "active" as const },
  { phase: "P1 Repeat", window: "Q1–Q3 2027", exit: "25 customers · S1→Won ≥20% · POV win ≥60% · 2 named case studies · AE #1 on ratios", status: "gated" as const },
  { phase: "P2 Compound", window: "Q4 2027 →", exit: "NRR ≥120% cohorts · partner-sourced ≥15% · ~$1M ARR exit · Series A metrics", status: "gated" as const },
]

export const okrs = [
  {
    objective: "O1 — Make the moment real: a CSM's day is measurably lighter",
    krs: [
      "HubSpot → workbench end-to-end live for every design-partner seat",
      "8 design partners onboarded, ≥60% seat activation by day 30",
      "10+ documented catches with customer-confirmed evidence",
    ],
  },
  {
    objective: "O2 — Prove the commercial motion end-to-end",
    krs: [
      "2 design partners converted to paying",
      "S1→S3 ≥40% across ≥15 discoveries (instrumentation live)",
      "Baselines + success plans = 100% of active accounts",
    ],
  },
  {
    objective: "O3 — Build the demand engine's foundation",
    krs: [
      "12 essays shipped · newsletter ≥500 subs at ≥45% open",
      "2+ content-sourced discovery calls/week by quarter end",
      "Pre-launch site live · POV page converting ≥3%",
    ],
  },
]

export const launchChecklist = [
  { task: "GATE · 4+ paying customers, activation ≥70%", team: "Sales" },
  { task: "GATE · 2+ design partners with quotable numbered outcomes", team: "Marketing" },
  { task: "GATE · Self-serve Starter/Growth flow solid end-to-end", team: "Product" },
  { task: "GATE · Demo environment + backup film current", team: "Sales" },
  { task: "GATE · Security packet public-ready", team: "Product" },
  { task: "GATE · Website live + HubSpot marketplace listing", team: "Marketing" },
  { task: "D−7 · Manifesto published (category essay)", team: "Marketing" },
  { task: "D-day · Launch post + Day film + Product Hunt + HN", team: "Marketing" },
  { task: "D+7 · First proof piece (case study + learnings essay)", team: "Marketing" },
]

export const metrics = [
  { value: "ATA/seat/wk", label: "NORTH STAR — Approved Twin Actions. 5 = activation floor · 8 = mature" },
  { value: "≥ 70%", label: "seats activated by day 30 (≥5 actions + ≥4 workbench-first mornings/wk)" },
  { value: "≥ 20%", label: "S1→Won end-to-end · POV win ≥60% · cycle ≤90 days" },
  { value: "≥ 3x", label: "pipeline coverage vs next-quarter target" },
  { value: "92 / 120", label: "GRR ≥92% · NRR ≥120% at scale" },
  { value: "~14x", label: "conservative ROI (H=3.0 × 22 × $65 × 0.4 × N vs Command)" },
]

export const decisions = [
  { date: "2026-07-21", decision: "Category = Workspace for Human and AI Collaborative Work. Continuity survives as the moat narrative.", supersedes: "“Operational Continuity Infrastructure” (frozen 07-12)" },
  { date: "2026-07-21", decision: "Per-seat pricing $19/$59/$119; seat = human + Twin; regional lists gated.", supersedes: "Per-workspace ₹999–$1,500 grid" },
  { date: "2026-07-21", decision: "Lead motion = Enterprise CS wedge, HubSpot first, founder-led + content-fed + POV-gated.", supersedes: "Three-markets-day-one" },
  { date: "2026-07-21", decision: "Repo docs/commercial/ is canonical; all surfaces are sync-stamped mirrors.", supersedes: "—" },
]

export const surfaces = [
  { name: "Commercial OS (repo)", href: "https://github.com/NirmalPrinceJ/v0-integratewise-core-engine", note: "canonical: docs/commercial/ — 79 sections" },
  { name: "Commercial Bible (Coda)", href: "https://docs.superhuman.com/d/IntegrateWise-Commercial-Bible_dVzYuy1Bp00", note: "hub synced · 6 items queued" },
  { name: "Sales team hub", href: "https://docs.superhuman.com/d/Sales-team-hub_dBb9Kxuu5Ck", note: "enablement destination" },
  { name: "Launch checklist", href: "https://docs.superhuman.com/d/Launch-checklist_dLvrrpFHACF", note: "gate rows queued" },
  { name: "Decision log", href: "https://docs.superhuman.com/d/Decision-log_d8AC7TD-TFV", note: "4 rows queued" },
  { name: "Company Wiki", href: "https://docs.superhuman.com/d/Copy-of-Company-Wiki_dwtrtrfr9D8", note: "mission + OKRs queued" },
]

export const salesQuickRef = {
  stages: "S0 Identify (ICP≥9) → S1 Discover (pain+H/C/N) → S2 Align (Day demo) → S3 Prove (30-day POV, 3 criteria) → S4 Commit → S5 Land (≤5 days) → S6 Expand",
  discovery: "8 outputs: pain sentence · tool map · H/C/N · wound story · AI-demotion status · why-now · eval path · demo booked on-call",
  demoBeats: "1 their morning → 2 workbench three-beats → 3 evidence/provenance → 4 Ask-Assign-APPROVE (climax) → 5 the refusal + audit trail → 6 the POV ask",
  icp: "B2B SaaS · 50–1,000 emp · 5–50 CSMs · HubSpot/Salesforce + 3 more tools · ≥2 why-now signals · wants governed AI",
}
