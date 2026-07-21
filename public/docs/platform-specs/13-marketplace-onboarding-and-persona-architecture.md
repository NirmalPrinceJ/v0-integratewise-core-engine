# IntegrateWise — Marketplace Onboarding & Persona Architecture (Final Spec)

## The Threshold Question First

Does ChatGPT pass the user's role, department, or industry when they install an IntegrateWise app from its marketplace?

**No. Marketplace OAuth passes identity only, never business context.**

What `ChatGPT's` app-install OAuth (and Claude's connector OAuth, and Perplexity's app OAuth) actually return to IntegrateWise:

| OAuth claim                        | Source                                                                         | What we get                           | What it does                                           |
| ---------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| `email`                            | User's ChatGPT account                                                         | ✅ Yes                                | Anchor for tenant user record                          |
| `name`                             | User's ChatGPT account                                                         | ✅ Yes                                | Display label                                          |
| `sub` (assistant-internal user-id) | ChatGPT's app framework                                                        | ✅ Yes                                | Stable user-id across re-installs                      |
| `picture`                          | ChatGPT profile                                                                | ✅ Yes                                | Avatar                                                 |
| Tenant-domain claim (org claim)    | Sometimes — only if user is on ChatGPT Enterprise with org directories enabled | ⚠️ Maybe                              | Most marketplace installs do not pass this             |
| Business role (Sales/CS/RevOps…)   | —                                                                              | ❌ No                                 | ChatGPT has no concept of business role                |
| Department                         | —                                                                              | ❌ No                                 | ChatGPT does not know org structure                    |
| Industry                           | —                                                                              | ❌ No                                 | Not in any OAuth scope ChatGPT provides                |
| Company name / size                | —                                                                              | ❌ No                                 | Not in any OAuth scope                                 |
| Tools the user wants to connect    | —                                                                              | ❌ No (user selects after onboarding) | Connector auth is a separate OAuth round-trip per tool |

ChatGPT — and every other marketplace in the model — is an **AI assistant**, not an **identity provider**. It authenticates _who you are on that assistant_. It does not authenticate _who you are at your company_.

This means the marketplace entry path cannot resolve Spine Context, cannot hydrate RBAC, cannot hydrate `tenant_spine_config`, and cannot derive the persona-shaped workbench without an **onboarding phase**. The onboarding is not optional. It is the architectural bridge between OAuth and Spine.

---

## The Onboarding Phase — The Bridge Between Marketplace OAuth and Inline Capability

The onboarding phase has three sequential duties, each with a hard architectural contract:

### Duty 1 — Capture persona context the marketplace cannot provide

The onboarding interstitial must capture, in this exact order:

1. **Use Case** — Personal / Work / Business. This decides the workspace model (single-user vs. tenant).
2. **Industry** — one of 11 (SaaS/Tech, Professional Services, Healthcare, Education, Manufacturing, Automotive, Retail/Commerce, Financial Services, Logistics, Media, Public Sector) + Other with freeform. This decides the **base resource layer** of the Spine (entity vocabulary, compliance flags, vertical connectors).
3. **Department** — one of 12 (Sales, Marketing, RevOps, Customer Success, Support, Engineering, Product, Finance, Legal, HR, Supply Chain, Service Operations). This decides the **functional trait** layer (KPI set, connector suggestions, dashboard module set, Twin greeting lineage).
4. **Sub-role** — department-scoped (e.g. Sales→AE/SDR/Manager; CS→CSM/CS-Lead/VP; HR→HRBP/HR-Ops/CHRO; Eng→IC/Manager/Director/VP). This decides the **default Twin greeting** template, the **default capability set** on the workbench, and the **default governance posture** (what auto-executes vs. what surfaces).
5. **Company-size tier** — 1–10, 11–50, 51–200, 201–500, 501–1k, 1k–5k, 5k+. This decides connector quotas, default sync cadence (5-min free vs. 15-min enterprise), and Twin proposal volume cap.
6. **Connectors** — minimum the Continuity Bridge (logged-in user as identity source), then up to 5 storage connectors (Google Drive, OneDrive, Notion, Confluence, Slack History), MCP servers (the user's existing MCPs), AI providers (Claude/GPT/Gemini routing prefix), and Native Connectors (CRM, support, etc.) **None of which the marketplace OAuth can pre-resolve.**

### Duty 2 — Hydrate RBAC

Spine Context cannot exist without a `role` on the user record. The single artifact the onboarding commits is:

```
rbac_users:        { user_id, tenant_id, role_id, level, scope }
rbac_roles:        { role_id, tenant_id, name, capabilities[], inherits[] }
rbac_permissions:  { perm_id, name, scope, gate_posture }
```

The first user (always the installer) gets `role = owner` by default. The role determines **which capabilities the Twin can invoke without escalating** — and the Twin only sees the persona's capability set, never another department's. The Maya persona (Sales/AE) cannot onboard an HRBP capability. The Nadia persona (HR/HRBP) cannot onboard a Rollback Engineering capability. **RBAC scoping is the persona barrier.**

### Duty 3 — Hydrate the tenant schema (`tenant_spine_config`)

The 12 × 11 matrix is encoded into a single row:

```
tenant_spine_config:
  tenant_id         UUID  PK
  industry          TEXT  -- 11 valid values + Other
  department        TEXT  -- 12 valid values
  sub_role          TEXT  -- persona-derived
  user_type         TEXT  -- personal | business | executive
  company_size      TEXT  -- 1-10..5k+
  enabled_entities  TEXT[] -- derived from industry × department
  north_star_metric TEXT  -- derived from department
  schema_version    TEXT
  governance_posture JSONB -- default sync modes, default confidence thresholds, default capability gates per persona
  twin_greeting_id  TEXT  -- which GREETING_LINES entry to fire on first surface
```

This row is the **single artifact that makes the rest of the platform persona-shaped**. Commit it once during onboarding. Every projection, every Twin greeting, every capability surfacing, every morning brief reads from this row.

### Where the onboarding runs (UX location)

Per the doctrine ("Distribution is ingress"): the onboarding interstitial **runs inside the marketplace trial**, not after the user bounces to a separate web app. Two viable implementations:

- **(A) MCP tool-based onboarding** — `iw.onboard` tool with structured input schema (input rendered by ChatGPT), simple/cross-assistant but constrained by ChatGPT's form affordances.
- **(B) Webview interstitial** — short redirect to `app.integratewise.ai/onboard?jwt=…`, full 4-step wizard reused from the web app, post-completion the webview posts back and the Marketplace MCP reconnects with `onboarding_complete=true`.

Recommended: **Option B** — reusable, full UI depth, single component (`apps/web/src/components/activation/onboarding/`), no ChatGPT-form dependency.

### The connector onboarding exception

OAuth against an external tool (Salesforce, HubSpot, Slack, Zendesk) **cannot run inside ChatGPT** because that requires a SaaS-provider consent screen, not an AI-assistant one. The onboarding step that says "Connect your world" runs the **Descope outbound connection authorization** (canonical authorization authority where supported; Nango retained as dormant compatibility for providers Descope outbound does not yet support), which redirects out of the marketplace (specifically by OAuth design) to Salesforce/HubSpot/Slack's own consent pages. This is per-tool, per-tenant, with `connectionId = tenant_id` for isolation.

The five-minute gating holds: OAuth (5s) → Onboarding interstitial (60s) → First connector Nango OAuth (45s) → Creamy layer pull + Pipeline 8 stages + Spine writes (60s under p99 2-second normalizer) → Dashboard renders. **Under 5 minutes from "Add IntegrateWise" to first data on the workbench.**

---

## Point 1 — Initial Onboarding (4–7 Step, Persona-Shaped)

### What the code defines

`onboarding-flow.tsx` canonically implements a 4-step wizard:

1. **Workspace Type** — Personal / Work / Business
2. **Profile** — Industry (11 options) + Department (12 grouped) + Company Size
3. **Goals** — Primary goal (organize / insights / context / team / automate / docs) + Workspace Name
4. **Connect** — 5 connector groups (Continuity Bridge required; Nango OAuth; MCP; AI Providers; API/Custom)

### What the v2 doctrine specifies (S1–S9 phases behind the wizard)

| Phase                           | System event                                        | Persona artifact                                 |
| ------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| S1 — Identity                   | Gateway RS256 JWT issued                            | User record + tenant_id                          |
| S1 — Org Discovery              | Use Case + Industry + Department → canonical domain | `tenant_spine_config` row                        |
| S1 — Reality Connections        | Nango OAuth + MCP + API tagged Flow A/B/C           | Connector records with sync-mode defaults        |
| S2–S5 — Spine Hydration         | Creamy layer (60s) → 8-stage Pipeline → D1 Spine    | Persona-shape workbench (not empty)              |
| S7 — Memory Activation          | Continuity pipeline begins                          | Conversation/Org/Personal memory live            |
| Gateway — Projection Generation | Spine Context → nav, modules, entity views, metrics | L1 Workbench renders                             |
| S8 — Governance Activation      | HARD GATE live                                      | AI may think/propose, never act without approval |
| S9 — Continuity Activation      | Context shared across every AI, tool, session       | Twin greets first                                |

### What the target 7-step shape refines to

The spine-architecture-departments doc specifies the _target_ 7-step flow (backend already accepts all 7 fields even if UI is shorter today):

```
Step 0  Usage Type      personal/work/business       → workspace model
Step 1  Industry        11 options + Other           → progressive hydration starts
Step 2  Department/Role 12 grouped + sub-role        → layer department entities + metrics
Step 3  Company Size    1-5k+ tiers                  → tier + connector suggestions
Step 4  Tools/Connectors 5 connector groups          → depth_matrix_snapshot, creamy if OAuth done
Step 5  Desired Outcome primary goal selector        → first AI insights personalisation
Step 6  Workspace Name  freeform label               → tenant_spine_config final write
```

### Why this matters for marketplace

Marketplace OAuth cannot pre-seed any of Steps 0–6 except user identity. **Onboarding must run inline in the marketplace trial**, between the OAuth callback and the first data load. **Skipping onboarding = empty, undifferentiated workbench = churn inside the 5-minute window.**

---

## Point 2 — 12 Departments × 11 Industries × Careful Workbench Consolidation

### The matrix

**12 Departments (functional trait layer):**

```
1.  Sales              → CTX_SALES      Pipeline, deals, accounts, contacts, stakeholders, activity log
2.  Marketing          → CTX_MARKETING  Content, campaigns, channels, audiences, attribution, assets
3.  RevOps             → CTX_BIZOPS     Cross-team reconciliation, forecast, quota, coverage, process
4.  Customer Success   → CTX_CS         Health, renewal, expansion, adoption, NPS, QBR
5.  Support            → CTX_SUPPORT    Tickets, SLAs, escalations, deflection, agent load
6.  Engineering        → CTX_TECH       Incidents, deploys, sprints, PRs, on-call, post-mortem
7.  Product            → CTX_PM         Roadmap, features, adoption, A/B, feedback
8.  Finance            → CTX_FINANCE    Invoices, recurring rev, comp, budget, audit, tax
9.  Legal              → CTX_LEGAL      Contracts, NDAs, compliance, disputes, IP
10. HR                 → CTX_HR         Hiring, comp, flight risk, engagement, performance
11. Supply Chain       → CTX_SUPPLY_CHAIN Inventory, logistics, vendors, lead time, ETA
12. Service Operations → CTX_SERVICE_OPS Field service, dispatch, uptime, technicians
```

**11 Industries (base resource layer):**

```
1.  SaaS / Technology        arr, mrr, churn_rate, nrr, ltv, cac
2.  Professional Services    billable_hours, utilization, client_engagement, partner_track
3.  Healthcare              contracts, hipaa_status, baa, procurement_stage, ehr_id
4.  Education                enrollment, semester, graduation_rate, cohort, course_id
5.  Manufacturing            production_line, down_minutes, machine_data, factory_sla
6.  Automotive               vin, recall, service_history, dealer_id
7.  Retail / Commerce        sku, order, fulfillment, return_rate, channel_perf
8.  Financial Services       kyc, regulatory_breach_window, audit_trail, position_id, pii_grade
9.  Logistics                shipment, route, carrier, eta, exception_code
10. Media                    content_id, view, watch_time, audience_segment, ad_pacing
11. Public Sector            case_id, clearance_level, constituent, jurisdiction
```

### The derivation principle

```
Spine Schema = f(Industry, Department)

Industry   = base resource type (entity vocabulary, compliance, vertical connectors)
Department = functional trait     (KPI set, department connectors, module set, Twin greeting)
```

So a Sales record in Healthcare ≠ a Sales record in SaaS:

- SaaS Sales: deal with `arr, mrr, churn_risk, technical_blocker`
- Healthcare Sales: contract with `contract_value, procurement_stage, hipaa_status, baa_id`

Same `deal` entity type, different canonical fields, different compliance posture, different connector set.

### Careful consolidation of workbenches (the design doctrine)

The workbench _component_ is one set of React components (L1 surface, Entity card, KPI tile, Twin panel, Capability chip). The workbench _data projection_ is persona-shaped. **One codebase, six T0 personas, twelve departments, eleven industries, 132 schema variants derived at runtime — not 132 code paths.**

Consolidation rules:

1. **T0 departments get full Spine schema coverage**: Sales, Marketing, RevOps, CS, Engineering, Finance. These are the marketplace listing doors. ~85% of install volume in year one.
2. **T1 departments get functional coverage**: Support, Product, HR, Legal, Service Operations.
3. **T2 departments get lighter coverage**: Supply Chain. Ship in months 12–18 once T0/T1 prove the architecture.
4. **All 12 × 11 share the same Spine, the same Pipeline, the same Twin engine, the same Memory pipeline, the same Governance gate.** Persona-specific workbench surfaces are projections off the same entity graph.

### Where the matrix lives in code

```
apps/web/src/config/domains/domain-types.ts:
  - 12 domain projections (sales, marketing, customer-success, etc.)
  - Each has its own sidebar nav, dashboards, views
  - Each has a spineProjection (which entities to surface)
  - Each has suggestedConnectors (per industry)
  - Each has KPIs (department-specific)
  - Each has a Twin greeting lineage
```

`tenant_spine_config` (D1, migration 054) is the per-tenant derivation result.

---

## Point 3 — Daily Motion

### What runs without the user (L0.5 — Always-On Operating Layer)

The L0.5 layer runs continuously in the background. The user does not invoke it. It produces the morning brief.

| Component                                | Cadence                        | What it produces                                                           |
| ---------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `TwinAgent` Durable Object               | Daily 05:00 cron per tenant    | Yesterday's signal review, morning brief draft, action proposals batched   |
| `TenantBrainDO`                          | Continuous                     | Pending approvals, active signals, HITL 15-min timeout, pause/resume state |
| Connector-sync (delta cron)              | 5 min free / 15 min enterprise | Delta pull of changed records from connected tools                         |
| Connector Nango webhooks                 | Real-time for SaaS support     | `auth.created` triggers creamy immediate sync                              |
| Pipeline (consolidated normalizer+spine) | Per queue message              | Records normalized + Spine written                                         |
| Memory Triage Bot                        | Continuous                     | New observations classified (fact/playbook/decision/relationship/noise)    |
| Memory Evolution                         | Hourly                         | Pattern detection on accumulated observations                              |
| Twin hydration                           | Per Twin chat open             | Cascade: screens + Spine + memory + conversation → prompt                  |
| Promotion Queue scan                     | Hourly                         | High-confidence candidates surfaced for user approval                      |

### What the user sees when they open the workbench in the morning

Twelve `GREETING_LINES` entries (one per CTX\_\*) shape the morning voice. Each greeting contains four ingredients: `overnight` (what Twin found), `critical` (one thing that can't wait), `invite` (an engagement question), `chips` (3–4 one-click actions).

**Sales (Maya, AE, SaaS):** 06:00 pipeline scout. "Coverage at 3.1× against 4× — 5 deals slipped, 3 cold >14d. CFO reply waiting on Skyline."
**Customer Success (Sana, CSM, Healthcare):** "Renewal Watchdog scanned 47 accounts. Mercy Health BAA stalled 18 days at stage 4. Lisa Wong pattern matches 3 prior cases."
**RevOps (Arjun, Lead, Financial Services):** "6 reconciliation issues pending. 4 deals slipping Q3→Q4 where Accounting has them in Q3. Forecast variance 2.3% from yesterday."
**Marketing (Lila, Content Marketer, Retail):** "Winter launch post staged in Sanity. Hero image unsigned in DAM. Last teaser pulled 1,400 organic visits — want me to compose launch from Notion draft + assets?"
**Engineering (Tomás, EM, Manufacturing):** "P1 incident on Helix — bulk export timing out 02:14 UTC, deploy correlation 0.83. Rollback candidate ready. Sprint burndown 4 days behind."
**Finance (FP&A):** "ARR rollup: $1.42M committed, 0.7% variance from yesterday. Three renewal forecast missing rev-rec mapping. NetSuite delta: 4 invoices unsettled."
**HR (Nadia, HRBP, Professional Services):** "Engagement survey declining 4 weeks in consulting practice. 11 flight-risk people I can defend with evidence — show me the defense?"
**Product (PM):** "Adoption funnel drop at step 3 (post-trial activation). 6 feature requests correlated to the drop. Beta cohort engagement +12% over cohort 1."
**Support (Manager):** "P0 queue clear. P1 backlog 12. SLA breach risk on 3 enterprise tickets. 1 deflection pattern emerging: 'export to CSV' returning empty rows."
**Legal (Counsel):** "3 NDAs awaiting counter-signature >48h. 1 contract redline mismatched vs. playbook. Compliance check: SOC2 evidence pack 12 days from due date."
**Supply Chain (Manager):** "Carrier exception rate +14% on Route-7. Lead time slipped on 2 critical SKUs. Sourcing alternative flagged for Vendor-204."
**Service Operations (Field Manager):** "4 dispatch slots unassigned in NE region. 1 SLA at risk (customer contract × technician availability). Uptime anomaly on tower 14 resolved."

### The invariant

**Every greeting is grounded in the Spine, sourced from the connector canonical state, and acted on by invocation through the Capability Fabric. None of it is fabricated. If Twin cannot defend the greeting (insufficient Spine data, no connector activity in 24h), it says so honestly.**

---

## Point 4 — L1 Layer: Proactive AI Without Re-Asking Context

### The two behaviours, split architecturally

**L1 data load — NOT OODA — mechanical pipeline behaviour.**
**L1 AI on top of data — OODA — agent behaviour.**

The L1 workbench renders the Spine projection. This is mechanical:

```
Spine D1 partition loaded
     →
${department}_${industry}_data projection
     →
DOMAIN_CONTENT_MAP[domain]
     →
Workbench entity tables, KPI tiles, cards, list views
     →
User sees Maya's Skyline deal, Sana's Mercy Health, Tomás's Helix incident — pre-filled, not empty.
```

No AI reasoning, no OODA loop, no agent. **The Pipeline handled it because its content was certain.**

The moment the user is _looking_ at an entity, AI runs OODA on the data the _user can already see_:

```
Observe   — Twin reads the entity currently displayed in L1
            + the L2 signal layer (anomalies, missing-activity, pattern matches)
            + L4 memory (approved playbooks related to this entity or persona)
Orient    — pattern matching against historical patterns for this entity type
            + comparison against the persona's industry × department behaviour norms
            + risk/expansion probability given the entity's current state
Decide    — generate a proposal with confidence score
            + select the right verb: act / surface / wait / discard
Act       — engine proposes. The user (or governance gate) decides.
```

The crucial architectural stance: **observation happens on the screen state, the Spine, the Connector Hub's last sync, and the Memory layer — never via a clarifying question to the user.** If the Twin needs to confirm a date, it reads the entity on screen. If it needs context for the deal, it reads the last assistant-cached conversation. If it needs to know the user role, it reads the JWT + `tenant_spine_config`. **Proactivity is wired, not interrogative.**

**The doctrine v2 names this: "Continuity over asking. The Twin never re-asks for context that is already on your screen, already in the Spine, already inferred from the conversation, or already established by an earlier action in the session."**

### What the user never sees

The user does not see "What would you like help with today?" — the Twin greets first. The user does not see "Which deal are you asking about?" — the Twin reasons about the deal on screen. The user does not see "Can you tell me who you are?" — the JWT, role, tenant, sub-role are all already minted. The user does not see "Connect Salesforce first" without knowing why — the Twin says "Connect Salesforce to read deal stages for 47 accounts; ten accounts in your commit block on it."

### Capability invocations visible inline

The L1 workbench is a capable surface. Buttons on entity cards are **Capability Fabric invocations**, not navigation. Every capability declares: input schema, output schema, required scopes, allowed sync modes, default confidence threshold, default governance posture, evidence-chain template.

```
Mark Lead Active       → writes to Spine, soft-sync to HubSpot/Salesforce (default)
Update Stage            → writes to Spine, soft-sync to Salesforce (default)
Log Activity            → writes to Spine, real-sync (governance allows)
View Contact            → Spine read + LinkedIn enrichment + HubSpot fetch
Call Contact            → engages dialer (Twilio/Plivo), audit logged
Draft Outreach          → Twin proposes email body, governance gate, soft-send
Draft Email Reply       → reads email thread from Gmail, drafts inline
Schedule Meeting        → writes to Spine + Google Calendar (real-sync)
Update Health Score     → writes to Spine, soft-sync if insurance/compliance
Mark Renewal Risk ↑    → gated, high governance posture for sensitive entities
Set Red-Time           → requires approval at level ≥ 0.92 confidence
Sync to SFDC (real-time) → audit logged, throughput logged
```

Each capability is a real registered action on the Capability Fabric. Each has confidence threshold and governance posture by tenant default.

---

## Point 5 — L2/L3 — Twin Interaction, Fully User-Based OODA

### L2 — Intelligence Overlay (Observe + Orient)

The L2 layer is the read-side OODA. It surfaces pre-emptive intelligence without any LLM call required. It is fast, cached, deterministic where possible.

| L2 element                                   | OODA phase | Source                                                                      |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------- |
| Signals (anomalies, risks, missing-activity) | Observe    | Connector-sync delta feeds + S6 intelligence service scans Spine            |
| Insights (synthesized observations)          | Orient     | Pattern-matching against historical data + Twin-promoted playbooks          |
| Think traces (hypothesis candidates)         | Orient     | L4 memory recall against current entity context                             |
| Context (assembled entity view)              | Orient     | S9 Continuity Bridge assembly                                               |
| Evidence ribbons                             | Orient     | Source citations: "via Salesforce", "via Zendesk", "via Memory 3 weeks ago" |

**L2 is read-heavy. No mutations. No proposals fired.** A user can promote an L2 insight to a L3 Twin proposal, which transitions the conversation into the full Decide → Act OODA loop.

### L3 — Twin Workbench (full OODA)

L3 is where the Twin reasons, proposes, and waits for human signal. The activation gate fires first:

```
evaluateActivation:
  if (memory_records.total < 3) → BLOCK, render hydration message
  if (memory_records.promoted < 1) → BLOCK, render staging state
  if (unresolved governance violations) → BLOCK, render audit summary
  else → PROCEED to context assembly
```

This is the **hands-off safety invariant**: Twin will not reason with hallucinated memory.

Passed → parallel context assembly:

```
graph LR
A[User message] --> B[Continuity retrieval]
B --> C{Activation passed?}
C -- No --> D[Hydration block]
C -- Yes --> E[aiSearch: semantic knowledge]
E --> F[conversationalSearch: past chat sessions]
F --> G[mcpSearch: connector-spine resources]
A --> H{Engineering intent?}
H -- Yes --> I[spineReadEngineering: D1 build_data partitioning]
H -- No --> J[Skip engineering read]
E --> K[DO SQLite: 10 warm turns]
F --> K
G --> K
K --> L[Learned profile: daily-reflected communication style]
L --> M[Construct system prompt]
M --> N[gatewayChat: LLM inference]
N --> O[Propose with confidence + evidence + alternatives]
```

**The activation gate, the hydration assembly, the learned profile — all of these are explicit decisions in the Twin pipeline, not defaults.** Twin speaks first only when its context is defensible.

### Per-persona Twin grammar

The hydration pipeline is identical across personas. **Inputs are persona-shaped:**

| Persona            | aiSearch sources                           | conversationalSearch scope              | mcpSearch scope                              | Engineering query?                 | DO warm turns     | Learned profile                                                                                             |
| ------------------ | ------------------------------------------ | --------------------------------------- | -------------------------------------------- | ---------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Maya (Sales/AE)    | CRM field schema, deal-stage playbooks     | Last 14d of her chat sessions           | Salesforce, HubSpot, Slack, Gmail, Calendar  | No                                 | Her last 10 turns | "Terse. Action-oriented. Inline next step. No preamble."                                                    |
| Sana (CS/Health)   | BAA playbooks, healthcare compliance notes | Last 21d of her chat + customer threads | Gainsight, Zendesk, Notion, Slack, CertifyMD | No                                 | Her last 10 turns | "Case-law-style reasoning. Cited evidence. One decision at a time. High caution near PHI."                  |
| Tomás (Eng/Mfg)    | incident-pattern notes, post-mortems       | Last 14d of his chats + Slack on-call   | Jira, PagerDuty, GitHub, Datadog             | **Yes** — spined engineering reads | His last 10 turns | "Tactical. Time-stamped. Action + rollback candidate + verification step."                                  |
| Nadia (HR/ProServ) | flight-risk playbooks, comp edge patterns  | Last 30d (governance-scoped)            | Workday, Lattice, survey vendor              | No                                 | Her last 10 turns | "High-censorship. Personal-data confidential. Never surfaces without 0.94+ confidence. One name at a time." |

**Same Twin, persona-shaped hydration, persona-shaped grammar, persona-shaped governance.** This is the consolidation.

### The irreducible human agency

Even when the Twin can defend an action with high confidence, it does not execute:

- **High confidence (≥ 0.85)** → auto-approve (governance posture: low-risk entities) or surface with one-click approve (posture: medium-risk entities)
- **Medium confidence (0.70–0.85)** → surface on My Desk, human reviews
- **Low confidence (< 0.70)** → discarded

The Twin is a reasoning layer that proposes. **The human is the decider.** Approval is mid-process, before execution; tokens are mint-bound to tenant, action, scope, confidence, sync mode. Audit-trail mandatory.

---

## Point 6 — Memory Surfaced Inside the Knowledge Layer (L4)

### The 8-layer memory pipeline

```
L1 Twin Memory (cognitive working memory)
   ↓ Chat threads, sessions, reasoning chains, conversational data
L2 Memory Intake (incoming observations)
   ↓ Slack, meetings, email, docs, chat, voice, agent outputs
L3 Triage Bot (classify, deduplicate, score)
   ↓ Is this: memory | noise | policy | fact | decision | relationship
L4 Memory Evolution (the compounding engine)
   ↓ Observation → Pattern → Insight → Playbook → Institutional Knowledge
L5 Promotion Queue (nothing enters org memory automatically)
   ↓ "Renewal Risk Pattern" | Confidence 94% | Evidence 17 accounts | Persona
L6 Human Approval (the doctrine: Truth you own. AI you rent. Approval in between.)
   ↓ Approve / Reject / Request Changes / Annotate
L7 Organizational Memory (durable, curated, governed)
   ↓ Approved facts, decisions, playbooks, policies, relationships, outcomes
L8 Knowledge (documents, runbooks, research, templates, SOPs)
```

The three-axis separation:

```
SPINE    = What IS     (truth)        Accounts, contacts, deals, tickets, events
MEMORY   = What it MEANS (meaning)    "Silent champion + open P1 = renewal risk"
KNOWLEDGE = What we know (docs)       Playbooks, runbooks, SOPs, templates
```

### What lives where in the UI

`L4` is the **Knowledge & Memory Workbench** — a separate navigation surface. From the spine-doctrine:

```
Twin (Reasoning Layer)
├── Chat
├── Conversations
├── Sessions
├── Voice
├── Working Memory
├── Agents
├── Skills
├── Workflows
├── Executions
├── Models
├── Tools
└── Logs

Continuity (Meaning Layer)            ← THIS IS WHERE MEMORY LIVES IN THE UI
├── Intake
├── Triage
├── Evolution
├── Promotion Queue      ← THE single most important surface
├── Organizational Memory
├── Knowledge            ← DOCUMENTS, PLAYBOOKS, RUNBOOKS, Sops
├── Continuity Graph
└── Metrics
```

The Knowledge Layer surfaces memory.

**L4 components:**

- **Semantic search** across org memory + promoted knowledge + documents + Twin chat sessions.
- **Categories** — Playbooks, SOWs & Contracts, Runbooks, Research, Templates. Visibility: Private / Team / Public.
- **Memory organization** — tags, categories, promoted knowledge tagged by confidence + evidence-trail.
- **Governance status** — staging → approved → published. The visual state of every memory card carries its lifecycle state.
- **Pinned items, full document excerpts, semantic search.**

The Promotion Queue **is the single most important screen in IntegrateWise**: it is where AI learns, human approves, organization remembers. It is a per-persona queue — Maya sees sales pattern candidates; Sana sees compliance pattern candidates; Nadia sees flight-risk pattern candidates.

### Persona-shaped memory surfacing

The Knowledge Layer is the same component with persona-shaped data:

- **Maya's L4**: Sales playbooks (negotiation tactics, security-questionnaire patterns, technical-blocker recovery), updated sales SOPs, links to CRM contexts.
- **Sana's L4**: CS playbooks (renewal motion, BAA patterns, QBR templates), healthcare-compliance guardrails.
- **Tomás's L4**: incident post-mortems, deploy-window playbooks, on-call rotation SOPs.
- **Nadia's L4**: flight-risk playbooks, comp-band edge cases, engagement-survey interpretation guides.

The Twin surface pulls _from_ the Knowledge Layer when constructing proposals. The Memory layer feeds the Twin. The Twin writes _into_ the Intake layer. The Promotion Queue catches what rises. The Knowledge layer stores what stays.

---

## Point 7 — Brainstorming Layer (Twin Memory, Conversational AI Chat Data)

### What it is

The Brainstorming Layer is the **Twin Memory** layer — cognitive working memory holding conversational AI chat data. It is the _raw material_ the Organizational Memory is built from.

What sits in the Brainstorming Layer per persona:

- **Maya**: ChatGPT conversations about her deals, her Airtable notes, her Slack thread participation. These are the conversational artifacts she's already producing.
- **Sana**: Her Claude conversations about customer escalations, her Notion QBR outlines, her Zendesk ticket analysis chats. Plus memo-style writing she did with Twin.
- **Lila**: Perplexity research queries about industry trends, her Notion drafts annotated through Twin, her Slack brand channel conversations.
- **Nadia**: People-confidential conversations she had with Twin or via email — _all governed_: Triage is hit first, only non-PHI pattern fragments survive, and only with approval do they shape Persona memory.

### The flow per Twin chat session

```
User message  →  Twin Reasoning (L3)  →  Response (proposal + grounded evidence)
                  │                          │
                  ▼                          ▼
           warm-turns DO SQLite       emitTriageInput(intent + message + proposed)
                  │                          │
                  ▼                          ▼
           conversation_turns table   MEMORY INTAKE QUEUE
                                         │
                                         ▼
                                    TRIAGE BOT
                                    classify: fact | decision | observation | relationship | noise
                                    score: confidence 0–1
                                    derive: persona-tag, industry-tag, evidence ribbon

                                  confidence ≥ 0.85, evidence ≥ 2 sources
                                         │
                                         ▼
                                  EVOLUTION ENGINE
                                  Observation + Evidence → Pattern candidate
                                         │
                                         ▼ (hours/days)
                                  Promotion Queue entry
                                  "Renewal Risk Pattern"
                                  Confidence 0.86
                                  Evidence: 17 accounts across 8 weeks
                                         │
                                         ▼
                                  User approves / rejects / annotates
                                         │
                                         ▼
                                  ORGANIZATIONAL MEMORY
                                  Now reusable across whole tenant
```

### Why it is essential and persona-distinct

The Brainstorming Layer is **the layer where AI's value compounds**. Without it, every Twin chat is ephemeral. With it, every chat session is an observation candidate that _may_ become a knowledge artifact that _will_ serve the whole tenant. **Without the Brainstorming Layer, IntegrateWise is a great AI assistant. With it, IntegrateWise is an AI assistant that builds the company's own institutional intelligence from its actual work.**

Persona distinction: the Triage Bot's classification logic is department-tagged. Maya's chat messages get triaged as [sales: observation|decision|fact|relationship|playbook candidate]. Sana's get [cs: observation|decision|fact|playbook candidate, healthcare: phi_flag]. Tomás's get [eng: incident|deploy-pattern|post-mortem candidate]. Nadia's get [hr: people-observation|playbook candidate, governance: scope-restricted].

Without the persona tags, the Promotion Queue would be undifferentiated. **The Brainstorming Layer is persona-aware from intake onward.**

---

## Point 8 — AI Chat: Spine-Grounded Insights and Suggestions

### The original doctrine, restored

The AI Chat was never meant to be "a chat." It was meant to be **a Spine-grounded conversational surface** where every response is:

- Sourced (every claim has a `via` citation)
- Confidenced (every recommendation shows a `confidence: 0.86` line)
- Actionable (every reply ends with a one-click capability chip)
- Proactive (Twin speaks first on entity load; doesn't wait for a question)

The L3 Twin chat component (per `twin-chat.tsx`) supports `Message` types with:

```
content      — fallback text
blocks       — callout / entity card / list / reference list / separator
evidence     — EvidenceSource[] with source + timestamp + confidence
entity       — EntitySnapshot (inline entity card on the reply)
memoryRefs   — which memory entries were used in forming this reply
memoryCommit — what was learned from this exchange
actions      — Approve | View | Link chips on the message
table        — inline structured data (headers + rows)
```

**The scaffolding is intact. The doctrine is intact. What was eroded in later builds:** the live data wiring. Mock greetings, mock evidence, mock entity snapshots. The fresh build must restore live data binding from Spine reads, Connector Hub status, Memory layer promotion state, and Connector canonical state.

### What Spine-grounded chat looks like, per persona

**Maya opens Twin chat, Skyline in panel:**

> _"Should I move Skyline to Stage 4?"_
>
> **Twin:** "I am not sure. Here is what I have.
> **CRM**: stage = Negotiation, last activity 8 days ago.
> **Slack**: VP Eng asked about SOC 2 Tuesday. No reply yet.
> **Email**: CFO replied 11:42 PM with one open question — deployment timeline.
> **Memory (my playbooks)**: You have moved 4 deals to Stage 4 in Q3. In 3/4, buyer's CFO signed off first. In the 4th, the deal slipped.
>
> **Recommended action (confidence 0.74)**:
>
> 1. Today's reply handles the CFO's deployment timeline question.
> 2. After CFO replies, move to Stage 4 with a soft SOC 2 follow-up.
>
> Chips: [Approve / Revise / Discard]"

**Sana opens Twin chat, Mercy Health in panel:**

> _"Should I escalate Mercy's BAA?"_
>
> **Twin:** "Here is what I have.
> **Compliance**: BAA stage 4 for 18 days. Counterparty counsel = Lisa Wong.
> **Memory (my playbooks)**: 3 BAA cases in 8 weeks involved Lisa Wong. Mean stall = 60 days. Pattern confidence 0.81.
> **Playbook (Lisa Wong)**: Recommend escalation to SVP Legal counsel at parent org at day 30.
>
> **Recommended action (confidence 0.86)**:
> Escalate today. Drafted email to SVP Legal at Mercy's parent. Audit-logged.
>
> Chips: [Approve / Revise / Discard]"

**Same Twin, persona-shaped hydration, identical Message block types, identical governance, identical provenance.** This is the consolidation.

### What was erased in later builds — and how to restore it

| Original vision                                             | Erosion                                                         | Restoration                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Twin greets proactively with overnight brief per department | ✅ Greeting scaffolding intact (12 entries) but content is mock | Wire live reads from Spine + Connector Hub last-sync state                |
| Every answer has sources cited                              | ✅ `EvidenceSource[]` type + render                             | Connect `evidence` to live connector fetch timestamps + journal entries   |
| Proposals embedded in chat                                  | ✅ `actions` array on messages                                  | Wire to proposal-service + Capability Fabric invocation                   |
| Entity snapshots inline                                     | ✅ `EntitySnapshot` render                                      | Connect to D1 entity reads through the canonical entity-type-to-table map |
| Memory refs visible                                         | ✅ `memoryRefs` + `memoryCommit`                                | Connect to Memory layer L7 (Organizational Memory) + Triage per-message   |
| Source-grounded "via GitHub / via Salesforce"               | ✅ panel component renders                                      | Connect to real connector sync status indicators                          |
| Confidence shown, not hidden                                | ✅ `confidence: 0.86%` rendering                                | Connect to live AI inference calibration                                  |
| One-action-at-a-time, actionable                            | ✅ recommendation + chips                                       | Connect to Capability Fabric persona-aware chips                          |
| User approves before any execution                          | ✅ Approve button → Bench                                       | Wire to L7 governance token minting + audit                               |

The architecture, components, types, and render code are all in place. The live data binding is the work — and that work is the difference between IntegrateWise as a product and IntegrateWise as a demo.

---

## Capabilities in the Workspace — Inline Actions, Sync Modes, Cross-Tool Composition

### The doctrine

The L1 workbench is not a viewer. The buttons on the workbench are **Capability Fabric invocations**, not navigation. Every action a user can take on an entity card is a registered capability with:

- Input/output schema
- Required Spine context scopes
- Allowed sync modes (soft / real / both)
- Default confidence threshold
- Default governance posture
- Evidence chain template
- Audit log entry shape

### Capability invocation surfaces

```
Workbench (L1)        — entity card buttons, list row actions
Entity Twin Panel     — Accept & act chip → capability invocation
Twin chat (L3)        — message.actions → capability invocation
CLI (L4)              — `iw capability <name> --context <entity>`
Slack/Teams (Layer 8) — shortcut button → capability invocation
Mobile (L1)           — touch-target capability button
```

**One capability, every surface.**

### Three sync modes per capability

The Integration Hub writes every mutation through one of three governance-aware paths:

| Mode                                              | Behaviour                                                                                                                                                                                                                                     | When used                                                                                                                                                                            |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Soft sync (write staging)**                     | User acts in workbench → Spine written atomically → Connector Hub enqueues downstream write → background worker reconciles against the source tool. The user sees the result inside seconds. The tool sees the change when its adapter ticks. | Default for sensitive entities (healthcare compliance, finance audit-trail entities, HR people records). Manages latency-insensitive mutability.                                     |
| **Real sync (write-through)**                     | User acts in workbench → Spine written atomically AND source tool called via `connector-{provider}` adapter → both succeed → commit logged. Failure in either triggers rollback + audit.                                                      | Default for daily-use mutations (Sales activities, support tickets, message sends). Manages user expectation of "stuff I just did is now in Salesforce / Slack / Zendesk right now." |
| **Propose → Approve → Execute (Twin governance)** | Twin proposes a high-risk mutation → user approves → governance token minted → both Spine AND source tool written in same transaction → audit-trail entry written.                                                                            | Default for high-stakes mutations (mark renewal risk, mark at-risk-leaning, change account ownership, fire rollback, change comp band).                                              |

The user's tenant IT sets the **per-capability default sync mode** during onboarding, not per-action in the moment. Persona defaults are pre-configured:

- **Sales**: real sync for activity logs, soft sync for SFDC writes, propose for "mark at risk"
- **CS (Healthcare)**: soft sync for HIPAA-adjacent entities, real sync for routine CS updates, propose for "mark renewal risk"
- **HR**: real sync for skip-level calendar updates, propose for any "mark flight risk," suggest-only for comp
- **Eng**: real sync for incident acknowledgment (on-call hates latency), propose for rollback, propose for production deploy outside window

### Cross-tool field composition — the Website Manager

The Website Manager is **the canonical demonstration of cross-tool field fusion inside the workbench**. From the screenshot-grounded doctrine:

> _"Website manager should be a point where it shows the number of user visits, the blog content, linking the content, images, and so multiple"_

This is **one workbench surface, fusing five tools' canonical state, governed by the same Twin, capable of one-click inline actions**.

| Surface tile         | Composed from                                      | What it does                                                 |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| **Total Pages**      | Sanity / Contentful + WordPress schema             | Live count                                                   |
| **Monthly Visitors** | Cloudflare Analytics + Plausible                   | Aggregate, hovered-trend visualised                          |
| **SEO Health**       | Ahrefs / Semrush + Search Console                  | Score                                                        |
| **Uptime**           | StatusCake + Cloudflare health checks              | Pass/fail banner                                             |
| **Traffic Chart**    | GA4 + Plausible + UTM tools                        | Visitors over time, total + unique                           |
| **Core Web Vitals**  | PageSpeed + Search Console                         | LCP / FID / CLS with thresholds                              |
| **Device Breakdown** | GA4 + Plausible                                    | Desktop / Mobile / Tablet %                                  |
| **Traffic Sources**  | Analytics + UTM                                    | Organic / Direct / Social / Referral / Paid                  |
| **SEO Issues**       | Search Console + Semrush crawl                     | Type, message, severity, fix-it link                         |
| **Top Pages**        | Sanity CMS + GA4                                   | Title, path, traffic, status, "Edit" chip                    |
| **Recent Edits**     | Sanity + Ghost + Webflow                           | Page, action, author, time                                   |
| **Posts list**       | Notion drafts + Sanity published + Ghost scheduled | Title, status, view count, comments, SEO score               |
| **Asset Library**    | ImageKit / DAM / Cloudinary                        | Image, video, document counts, dimensions, "Used in N pages" |
| **Campaigns**        | Marketo / HubSpot + GA4 + Plausible                | Active campaigns, attribution, conversion                    |

### The Schedule Blog Post capability — composed invocation

The capability `schedule_blog_post` declares its input as multiple systems' fields:

```
inputs:
  draft_content: <from Notion draft ID>
  canonical_image: <from ImageKit ID>
  publish_target: <to Sanity via CMS adapter>
  social_amplification: <to Buffer / native social APIs>
  email_blast: <to HubSpot / Customer.io>
  analytics_tile: <Plausible / GA4 attribution link>
  seo_check: <via Semrush cheat sheet>
```

Compose, gate, execute:

1. **Read inputs** across Notion, ImageKit, Buffer, HubSpot, Plausible.
2. **Brand compliance check** — Twin compares draft to user's brand voice playbook (Memory layer).
3. **Brand gate failure?** — Twin flags the diff. User approves modification or proceeds without (Softer mode = bypass; default = block-with-suggestion).
4. **Gather all writes** into one orchestration plan.
5. **Approve once** — single Token mint.
6. **Atomic commit across all systems** — single transaction, single audit entry.
7. **Capability complete** — user sees in their workbench view, all systems updated, audit logged.

Capabilities compose across tools. Workbench is capable. Persona-aware. Governed. **This is the action-doctrine of IntegrateWise made visible in the L1 surface.**

### Recap table — Where every capability lives

| Capability family           | Surfaces it lives on                | Sync mode by default                    | Persona        |
| --------------------------- | ----------------------------------- | --------------------------------------- | -------------- |
| `mark_lead_active`          | Sale entity card                    | Soft sync to CRM                        | Sales          |
| `view_contact`              | Contact card                        | Read; no mutation                       | All            |
| `update_field`              | Field-level edit on any entity      | Soft sync default                       | Persona-shaped |
| `log_activity`              | Activity timeline chip              | Real sync (audit expectation)           | Sales, CS, HR  |
| `draft_outreach`            | Outreach chip                       | Twin proposes; soft-send to email       | Sales, CS      |
| `schedule_call`             | Calendar chip                       | Real sync to Calendar                   | Sales, CS, HR  |
| `mark_renewal_risk`         | Renewal card chip                   | Propose-gate (≥ 0.85)                   | CS, RevOps     |
| `update_health_score`       | Health tile                         | Soft sync external CRM                  | CS             |
| `schedule_blog_post`        | Website Manager chip                | Composed capability; brand gate; atomic | Marketing      |
| `swap_image`                | Asset Library chip → page reference | Real sync to CMS + DAM                  | Marketing      |
| `mark_campaign_active`      | Campaign chip                       | Real sync UTM + CRM                     | Marketing      |
| `acknowledge_incident`      | Incident timeline chip              | Real sync (on-call latency-sensitive)   | Engineering    |
| `pre_draft_rollback`        | Incident chip                       | Propose-gate                            | Engineering    |
| `schedule_post_mortem`      | Incident chip                       | Real sync Calendar + Notion             | Engineering    |
| `mark_person_flight_risk`   | Person card chip                    | Propose-gate + governance               | HR             |
| `update_comp_band_edge`     | Person card chip                    | Propose-gate + multi-approval           | HR             |
| `schedule_skip_level`       | Person card chip                    | Real sync Calendar                      | HR             |
| `update_pipeline_coverage`  | Pipeline chip                       | Twin computes, soft-sync forecast       | RevOps         |
| `flag_reconciliation_delta` | Pipeline chip                       | Propose-gate (cross-team)               | RevOps         |
| `close_invoice`             | Invoice chip                        | Real sync NetSuite/Stripe               | Finance        |
| `sign_contract`             | Contract chip                       | Propose-gate + e-signature flow         | Legal          |
| `update_vendor_status`      | Vendor chip                         | Soft sync                               | Supply Chain   |
| `dispatch_field_service`    | Service chip                        | Real sync                               | Service Ops    |

Every capability has a persona-aware home, a default sync mode, a default confidence threshold, and a default governance posture. The Hub routes them; the Twin proposes them; the user approves them; the Audit logs them.

---

## Closing — The Integrated Schema

The marketplace user is Maya, Sana, Tomás, Nadia, Lila, or Arjun — one of six personas. They install from a marketplace listing targeting their persona. OAuth passes identity only. Onboarding captures what OAuth cannot. `tenant_spine_config` commits. D1 Spine partitions load from the connector canonical state. L1 workbench renders persona-shaped projections. L2 signals fire read-side over Spine without LLM. L3 Twin hydration assembles persona sources through the activation gate. L4 Knowledge surfaces memory from the 8-layer pipeline. The Brainstorming Layer holds the conversational working memory. The Capability Fabric executes inline actions through three sync modes, governed per tenant default.

Proactivity is wired, never interrogative.

**Truth you own. AI you rent. Approval in between. Continuity over asking.**

That is the entire marketplace onboarding × persona design, grounded in the source code, the doctrinal foundation of IntegrateWise.txt, and the structural reality that ChatGPT and Claude authenticators cannot and will not pass persona context — only an in-place onboarding phase can.

# IntegrateWise Onboarding & Persona-First Design — Final Doc

---

## 1. The Marketplace Threshold Question (Read This First)

**ChatGPT does not pass role, department, industry, or company size.** OAuth from ChatGPT/Claude/Perplexity to IntegrateWise passes only:

| Field                           | Source                      | Verdict                             |
| ------------------------------- | --------------------------- | ----------------------------------- |
| `email`                         | Assistant account           | ✅ Yes                              |
| `name`                          | Assistant profile           | ✅ Yes                              |
| `sub`                           | Assistant-internal user-id  | ✅ Yes                              |
| `picture`                       | Assistant profile           | ✅ Yes                              |
| Org/company claim               | Sometimes (Enterprise only) | ⚠️ Maybe                            |
| Business **role**               | —                           | ❌ **No**                           |
| **Department**                  | —                           | ❌ **No**                           |
| **Industry**                    | —                           | ❌ **No**                           |
| Company **size**                | —                           | ❌ **No**                           |
| Tool connections the user wants | —                           | ❌ **No (chosen AFTER onboarding)** |

ChatGPT — and Claude, and Perplexity — are AI assistants, not identity providers. They authenticate _who you are on the assistant_, not _who you are at your company_. **Therefore the onboarding phase must run inline inside the marketplace trial** — between OAuth callback and first data load — to:

1. Capture the persona context the marketplace OAuth cannot provide.
2. Hydrate RBAC (role → capabilities → governance posture).
3. Hydrate `tenant_spine_config` (industry × department → Spine schema variant).

Without this, the workbench renders **empty and undifferentiated**, which kills the 5-minute value window and the marketplace GTM motion.

---

## 2. The Onboarding Phase — Three Duties

### Duty 1: Capture Persona Context

Six fields captured in order (each one commits progressively — no big form):

| Step | Field                                                                                                                                                           | What it decides                                                                           |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 0    | Use Case — Personal / Work / Business                                                                                                                           | Workspace model (single-user vs. tenant)                                                  |
| 1    | Industry — 11 + Other                                                                                                                                           | Base resource layer: entity vocabulary, compliance flags, vertical connectors             |
| 2    | Department — 12 (Sales / Marketing / RevOps / CS / Support / Eng / Product / Finance / Legal / HR / Supply Chain / Service Ops) + sub-role                      | Functional trait: KPIs, dashboard modules, Twin greeting lineage                          |
| 3    | Sub-role — e.g., Sales→AE/SDR/Manager ; CS→CSM/Lead/VP ; HR→HRBP/HR-Ops/CHRO ; Eng→IC/Manager/Director/VP                                                       | Twin greeting template, default capability set, default governance posture                |
| 4    | Company Size — 1–10 / 11–50 / 51–200 / 201–500 / 501–1k / 1k–5k / 5k+                                                                                           | Connector quotas, sync cadence (5-min free / 15-min enterprise), Twin proposal volume cap |
| 5    | Connectors — Continuity Bridge (required) + 5 storage (Drive/OneDrive/Notion/Confluence/Slack History) + MCP servers + AI providers + Native (CRM/Support/etc.) | Per-tenant connector matrix                                                               |

### Duty 2: Hydrate RBAC

Single artifact: **role → capabilities → governance posture mapping**.

```
rbac_users       { user_id, tenant_id, role_id, level, scope }
rbac_roles       { role_id, tenant_id, name, capabilities[], inherits[] }
rbac_permissions { perm_id, name, scope, gate_posture }
```

The first user always gets `role = owner`. RBAC is the **persona barrier** — Maya (Sales/AE) cannot onboard HRBP capabilities; Nadia (HR/HRBP) cannot onboard Rollback Engineering capabilities. The Twin only sees the persona's reachable capability set.

### Duty 3: Hydrate `tenant_spine_config`

One row in D1 makes the rest of the platform persona-shaped at render time:

```
tenant_spine_config
  tenant_id          UUID PK
  industry           TEXT        -- 11 valid + Other
  department         TEXT        -- 12 valid
  sub_role           TEXT        -- persona-derived
  user_type          TEXT        -- personal|business|executive
  company_size       TEXT        -- 1-10..5k+
  enabled_entities   TEXT[]      -- derived from industry × department
  north_star_metric  TEXT        -- derived from department
  schema_version     TEXT
  governance_posture JSONB       -- default sync modes, default confidence thresholds, default capability gates
  twin_greeting_id   TEXT        -- which GREETING_LINES entry fires first
```

This row drives: L1 workbench surface, L2 Intelligence Overlay signals, L3 Twin hydration sources, L4 Knowledge category surfacing, Capability Fabric per-surface defaulting, Governance posture.

### Where the Onboarding Runs (UX)

| Option                            | UX                                                                                                                                  | Trade-off                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **(A) MCP tool-based onboarding** | `iw.onboard` tool with structured input schema → ChatGPT renders the form itself                                                    | Stays fully inside ChatGPT but constrained by ChatGPT's form schema                          |
| **(B) Webview interstitial**      | Short redirect to `app.integratewise.ai/onboard?jwt=…` → reuses the existing 4-step wizard → posts completion back → MCP reconnects | Full UI depth, reusable, single component (`apps/web/src/components/activation/onboarding/`) |

**Recommended: B.** One component, full UI depth, no ChatGPT-form dependency.

### The 5-Minute Hard Gate

OAuth (5s) → Onboarding Interstitial (60s) → First connector Nango OAuth (45s) → Creamy layer pull + Pipeline 8 stages + Spine writes (60s, p99 normalizer 2s) → Dashboard renders. **Under 5 minutes from "Add IntegrateWise" to first persona-shaped data on the workbench.**

---

## 3. Twelve Departments × Eleven Industries — The Persona Matrix

### 12 Departments (Functional Trait Layer)

| #   | Department         | CTX Enum         | Workbench essence                                                         |
| --- | ------------------ | ---------------- | ------------------------------------------------------------------------- |
| 1   | Sales              | CTX_SALES        | Pipeline, deals, accounts, contacts, stakeholders, activity log           |
| 2   | Marketing          | CTX_MARKETING    | Content, campaigns, channels, audiences, attribution, assets              |
| 3   | RevOps             | CTX_BIZOPS       | Cross-team reconciliation, forecast, quota, coverage, process bottlenecks |
| 4   | Customer Success   | CTX_CS           | Health, renewal, expansion, adoption, NPS, QBR                            |
| 5   | Support            | CTX_SUPPORT      | Tickets, SLAs, escalations, deflection, agent load                        |
| 6   | Engineering        | CTX_TECH         | Incidents, deploys, sprints, PRs, on-call, post-mortem                    |
| 7   | Product            | CTX_PM           | Roadmap, features, adoption, A/B, feedback                                |
| 8   | Finance            | CTX_FINANCE      | Invoices, recurring rev, comp, budget, audit, tax                         |
| 9   | Legal              | CTX_LEGAL        | Contracts, NDAs, compliance, disputes, IP                                 |
| 10  | HR                 | CTX_HR           | Hiring, comp, flight risk, engagement, performance                        |
| 11  | Supply Chain       | CTX_SUPPLY_CHAIN | Inventory, logistics, vendors, lead time, ETA                             |
| 12  | Service Operations | CTX_SERVICE_OPS  | Field service, dispatch, uptime, technicians                              |

### 11 Industries (Base Resource Layer)

| #   | Industry              | Industry-specific fields                                              |
| --- | --------------------- | --------------------------------------------------------------------- |
| 1   | SaaS / Technology     | `arr`, `mrr`, `churn_rate`, `nrr`, `ltv`, `cac`                       |
| 2   | Professional Services | `billable_hours`, `utilization`, `client_engagement`, `partner_track` |
| 3   | Healthcare            | `hipaa_status`, `baa_id`, `procurement_stage`, `ehr_id`               |
| 4   | Education             | `enrollment`, `graduation_rate`, `cohort`, `course_id`                |
| 5   | Manufacturing         | `production_line`, `down_minutes`, `machine_data`, `factory_sla`      |
| 6   | Automotive            | `vin`, `recall`, `service_history`, `dealer_id`                       |
| 7   | Retail / Commerce     | `sku`, `order`, `fulfillment`, `return_rate`, `channel_perf`          |
| 8   | Financial Services    | `kyc`, `regulatory_breach_window`, `audit_trail`, `pii_grade`         |
| 9   | Logistics             | `shipment`, `route`, `carrier`, `eta`, `exception_code`               |
| 10  | Media                 | `content_id`, `watch_time`, `audience_segment`, `ad_pacing`           |
| 11  | Public Sector         | `case_id`, `clearance_level`, `constituent`, `jurisdiction`           |

### The Derivation Principle

```
Spine Schema = f(Industry, Department)

Industry   = base resource layer (entity vocab, compliance, vertical connectors)
Department = functional trait      (KPI set, module set, Twin greeting lineage)
```

Sales in Healthcare ≠ Sales in SaaS:

- **SaaS Sales:** deal with `arr`, `mrr`, `churn_risk`, `technical_blocker`
- **Healthcare Sales:** contract with `contract_value`, `procurement_stage`, `hipaa_status`, `baa_id`

Same `deal` entity type. Different canonical fields, different compliance posture, different connector set.

### Careful Consolidation of Workbenches

**One component library. Persona-shaped data projection. Not 132 workbenches.**

The workbench component (L1 surface, Entity card, KPI tile, Twin panel, Capability chip) is **one set of React components**. The workbench data projection reads from `tenant_spine_config` and surfaces the persona-shaped slice. **One codebase × 6 T0 personas × 12 departments × 11 industries × 132 schema variants derived at runtime.**

- **T0 (ship first)** — Sales, Marketing, RevOps, CS, Engineering, Finance. ~85% of install volume in year one.
- **T1 (ship 6–12 months)** — Support, Product, HR, Legal, Service Ops.
- **T2 (ship 12–18 months)** — Supply Chain.

All 12 × 11 share **the same Spine**, **the same Pipeline**, **the same Twin engine**, **the same Memory pipeline**, **the same Governance gate**. Persona-specific surfaces are projections of the same entity graph.

---

## 4. Daily Motion — Persona-Aware, Always On

### L0.5 Always-On Operating Layer (runs without the user)

| Component                                  | Cadence                        | Output                                                                     |
| ------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------- |
| `TwinAgent` Durable Object                 | Daily 05:00 cron per tenant    | Yesterday's signal review, morning brief draft, action proposals batched   |
| `TenantBrainDO`                            | Continuous                     | Pending approvals, active signals, HITL 15-min timeout, pause/resume state |
| Connector-sync (delta cron)                | 5 min free / 15 min enterprise | Delta pull of changed records from connected tools                         |
| Connector Nango webhooks                   | Real-time for SaaS support     | `auth.created` triggers immediate creamy sync                              |
| Pipeline (consolidated normalizer + spine) | Per queue message              | Records normalized → Spine written                                         |
| Memory Triage Bot                          | Continuous                     | New observations classified (fact/playbook/decision/relationship/noise)    |
| Memory Evolution                           | Hourly                         | Pattern detection on accumulated observations                              |
| Twin hydration                             | Per Twin chat open             | Cascade: screens + Spine + memory + conversation → prompt                  |
| Promotion Queue scan                       | Hourly                         | High-confidence candidates surfaced for user approval                      |

### What the user sees when they open the workbench in the morning

Each persona-shaped greeting contains four parts:

- **`overnight`** — what Twin found
- **`critical`** — one thing that can't wait
- **`invite`** — an engagement question
- **`chips`** — 3–4 one-click capability actions

**Example greetings (per CTX\_\*)** — these are the canonical morning voices:

| Persona                                    | Morning Greeting (abridged)                                                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sales (Maya, AE, SaaS)                     | "Pipeline Scout ran at 6 AM. Coverage at 3.1× against 4× — 5 deals slipped, 3 going cold. CFO reply waiting on Skyline. Want me to draft the CFO reply?" |
| CS (Sana, CSM, Healthcare)                 | "Renewal Watchdog scanned 47 accounts. Mercy Health BAA stalled 18 days at stage 4. Lisa Wong pattern matches 3 prior cases."                            |
| RevOps (Arjun, Lead, Financial Services)   | "6 reconciliation issues pending. 4 deals slipping Q3→Q4 where Accounting has them in Q3. Forecast variance 2.3% from yesterday."                        |
| Marketing (Lila, Content Marketer, Retail) | "Winter launch post staged in Sanity. Hero image unsigned in DAM. Last teaser pulled 1,400 organic visits — compose launch from Notion draft?"           |
| Engineering (Tomás, EM, Manufacturing)     | "P1 incident on Helix — bulk export timing out 02:14 UTC, deploy correlation 0.83. Rollback candidate ready. Sprint burndown 4 days behind."             |
| Finance (FP&A)                             | "ARR rollup $1.42M committed, 0.7% variance. 3 renewal forecasts missing rev-rec mapping. NetSuite delta: 4 invoices unsettled."                         |
| HR (Nadia, HRBP, Professional Services)    | "Engagement declining 4 weeks in consulting practice. 11 flight-risk people I can defend with evidence — show me the defense?"                           |
| Product (PM)                               | "Adoption funnel drops at step 3 (post-trial activation). 6 feature requests correlate. Beta cohort engagement +12% over cohort 1."                      |
| Support (Manager)                          | "P0 queue clear. P1 backlog 12. SLA breach risk on 3 enterprise tickets. Deflection pattern: 'export to CSV' returning empty rows."                      |
| Legal (Counsel)                            | "3 NDAs awaiting counter-signature >48h. 1 contract redline vs. playbook. SOC2 evidence pack 12 days from due date."                                     |
| Supply Chain (Manager)                     | "Carrier exception rate +14% on Route-7. Lead time slipped on 2 critical SKUs. Sourcing alternative flagged for Vendor-204."                             |
| Service Ops (Field Manager)                | "4 dispatch slots unassigned in NE region. 1 SLA at risk. Uptime anomaly on tower 14 resolved."                                                          |

**Invariant:** Every greeting is grounded in the Spine, sourced from canonical state, and acted on through the Capability Fabric. **No fabrication.** If Twin cannot defend a greeting (insufficient Spine data, no connector activity in 24h), it says so honestly.

---

## 5. L1 Layer — Proactive AI Without Re-Asking

### Two Distinct Behaviours

| Behaviour                                                              | OODA?                                          | Why                                                                  |
| ---------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| **L1 data load — Spine → workbench**                                   | ❌ **No OODA** — mechanical pipeline certainty | Data is canonically known; the Pipeline handles it deterministically |
| **L1 AI on loaded data — observing the entity the user is looking at** | ✅ **OODA** — proactive agent                  | Decisions under uncertainty require agent reasoning                  |

### L1 Data Load Path (No OODA)

```
Spine D1 partition loaded
     →
${department}_${industry}_data projection
     →
DOMAIN_CONTENT_MAP[domain]
     →
Workbench entity tables, KPI tiles, cards, list views
     →
User sees Maya's Skyline deal, Sana's Mercy Health, Tomás's Helix incident — pre-filled, not empty.
```

### L1 AI Path (OODA on what the user is looking at)

```
Observe   — Twin reads the entity on screen
            + the L2 signal layer (anomalies, missing-activity, pattern matches)
            + L4 memory (approved playbooks related to this entity or persona)
Orient    — pattern matching against historical patterns for this entity type
            + comparison against the persona's industry × department norms
            + risk/expansion probability given the entity's current state
Decide    — generate a proposal with confidence score
            + select the right verb: act / surface / wait / discard
Act       — engine proposes. The user (or governance gate) decides.
```

### Core Doctrine: Proactivity Is Wired, Not Interrogative

**The user never sees "What would you like help with today?"** — Twin greets first.
**The user never sees "Which deal are you asking about?"** — Twin reasons about the deal on screen.
**The user never sees "Can you tell me who you are?"** — JWT, role, tenant, sub-role are all minted.
**The user never sees "Connect Salesforce first" without knowing why** — Twin explains: "Connect Salesforce to read deal stages for 47 accounts; ten accounts in your commit block on it."

**v2 Doctrine: "Continuity over asking."** The Twin never re-asks for context that is already on screen, already in the Spine, already inferred from the conversation, or already established by an earlier action in the session.

---

## 6. L2/L3 — Twin Interaction, Fully User-Based OODA

### L2 — Intelligence Overlay (Observe + Orient, no LLM required, cached)

| L2 Element                                   | OODA Phase | Source                                                                      |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------- |
| Signals (anomalies, risks, missing-activity) | Observe    | Connector-sync delta + S6 intelligence scans Spine                          |
| Insights (synthesized observations)          | Orient     | Pattern matching against historical data + Twin-promoted playbooks          |
| Think traces (hypothesis candidates)         | Orient     | L4 memory recall against current entity context                             |
| Context (assembled entity view)              | Orient     | S9 Continuity Bridge assembly                                               |
| Evidence ribbons                             | Orient     | Source citations: "via Salesforce", "via Zendesk", "via Memory 3 weeks ago" |

**L2 is read-heavy. No mutations. No proposals fired.** A user can promote an L2 insight to L3 Twin proposal — that transitions into the full Decide → Act OODA loop.

### L3 — Twin Workbench (Full OODA)

Activation gate first:

```
evaluateActivation:
  if (memory_records.total < 3)          → BLOCK, render hydration message
  if (memory_records.promoted < 1)       → BLOCK, render staging state
  if (unresolved governance violations)  → BLOCK, render audit summary
  else                                   → PROCEED to context assembly
```

Passed → parallel context assembly (identical pipeline, persona-shaped inputs):

```
graph LR
A[User message] --> B[Continuity retrieval]
B --> C{Activation passed?}
C -- No --> D[Hydration block]
C -- Yes --> E[aiSearch: semantic knowledge]
E --> F[conversationalSearch: past chat sessions]
F --> G[mcpSearch: connector-spine resources]
A --> H{Engineering intent?}
H -- Yes --> I[spineReadEngineering: D1 build_data partitioning]
H -- No --> J[Skip engineering read]
E --> K[DO SQLite: 10 warm turns]
F --> K
G --> K
K --> L[Learned profile: daily-reflected communication style]
L --> M[Construct system prompt]
M --> N[gatewayChat: LLM inference]
N --> O[Propose with confidence + evidence + alternatives]
```

### Per-Persona Twin Grammar (Same Pipeline, Persona Inputs)

| Persona            | aiSearch sources                           | conversationalSearch                    | mcpSearch                                    | Eng intent? | DO warm     | Learned Profile                                                        |
| ------------------ | ------------------------------------------ | --------------------------------------- | -------------------------------------------- | ----------- | ----------- | ---------------------------------------------------------------------- |
| Maya (Sales/AE)    | CRM field schema, deal-stage playbooks     | Last 14d of her chat sessions           | SFDC, HubSpot, Slack, Gmail, Calendar        | No          | Her last 10 | "Terse. Action-oriented. Inline next step. No preamble."               |
| Sana (CS/Health)   | BAA playbooks, healthcare compliance notes | Last 21d of her chat + customer threads | Gainsight, Zendesk, Notion, Slack, CertifyMD | No          | Her last 10 | "Case-law-style. Cited evidence. One decision. High caution near PHI." |
| Tomás (Eng/Mfg)    | incident-pattern notes, post-mortems       | Last 14d of his chats + Slack on-call   | Jira, PagerDuty, GitHub, Datadog             | **Yes**     | His last 10 | "Tactical. Time-stamped. Action + rollback + verification."            |
| Nadia (HR/ProServ) | flight-risk playbooks, comp edge patterns  | Last 30d (governance-scoped)            | Workday, Lattice, survey vendor              | No          | Her last 10 | "High-censorship. Compact. 0.94+ confidence only."                     |

**Same Twin engine, persona-shaped hydration, persona-shaped grammar, persona-shaped governance.** That is the careful consolidation.

### Irreducible Human Agency

Even at high confidence, Twin does **not** execute:

| Confidence | Posture                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| ≥ 0.85     | Auto-approve (low-risk entities) or surface with one-click approve (medium-risk) |
| 0.70–0.85  | Surface on My Desk — human reviews                                               |
| < 0.70     | Discarded                                                                        |

The Twin is a reasoning layer that **proposes**. **The human is the decider.** Approval is midprocess, before execution. Tokens mint-bound to tenant + action + scope + confidence + sync mode. Audit-trail mandatory.

---

## 7. Memory Surfaced Inside the Knowledge Layer (L4)

### 8-Layer Memory Pipeline

```
L1 Twin Memory            (cognitive working memory — chat threads, sessions, reasoning chains)
   ↓
L2 Memory Intake          (incoming observations — Slack, meetings, email, docs, chat, voice)
   ↓
L3 Triage Bot             (classify, dedupe, score: memory|noise|policy|fact|decision|relationship)
   ↓
L4 Memory Evolution       (Observation → Pattern → Insight → Playbook → Institutional Knowledge)
   ↓
L5 Promotion Queue        (candidate + confidence + evidence)
   ↓
L6 Human Approval         (Truth you own. AI you rent. Approval in between.)
   ↓
L7 Organizational Memory  (approved facts, decisions, playbooks, policies, relationships, outcomes)
   ↓
L8 Knowledge              (documents, runbooks, research, templates, SOPs)
```

### Three-Axis Separation

```
SPINE    = What IS (truth)        Accounts, contacts, deals, tickets, events
MEMORY   = What it MEANS          "Silent champion + open P1 = renewal risk"
KNOWLEDGE = What we know          Playbooks, runbooks, SOPs, templates
```

### Where Memory Lives in the UI

`L4` is the **Knowledge & Memory Workbench** — a separate navigation surface:

```
Twin (Reasoning Layer)
├── Chat
├── Conversations
├── Sessions
├── Voice
├── Working Memory
├── Agents
├── Skills
├── Workflows
├── Executions
├── Models
├── Tools
└── Logs

Continuity (Meaning Layer)             ← MEMORY LIVES HERE
├── Intake
├── Triage
├── Evolution
├── Promotion Queue      ← THE single most important surface
├── Organizational Memory
├── Knowledge            ← documents, playbooks, runbooks
├── Continuity Graph
└── Metrics
```

**The Promotion Queue is "the single most important screen in IntegrateWise"** — it is where AI learns, human approves, organization remembers. Per-persona queue: Maya sees sales pattern candidates, Sana sees compliance pattern candidates, Nadia sees flight-risk pattern candidates.

### L4 Component Functionality

- Semantic search across org memory + promoted knowledge + documents + Twin chat sessions.
- Categories — Playbooks, SOWs & Contracts, Runbooks, Research, Templates.
- Visibility — Private / Team / Public.
- Memory organization — tags, categories, prominence-tagged by confidence + evidence trail.
- Governance status — staging → approved → published. Every memory card carries its lifecycle state.
- Pinned items, full document excerpts, semantic search.

### Persona-Shaped Memory Surfacing

Same component, persona-shaped data:

| Persona      | L4 Surface Content                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Maya (Sales) | Sales playbooks (negotiation tactics, security-questionnaire patterns, technical-blocker recovery), sales SOPs, CRM links |
| Sana (CS)    | Renewal motion playbooks, BAA patterns, QBR templates, healthcare compliance guardrails                                   |
| Tomás (Eng)  | Incident post-mortems, deploy-window playbooks, on-call rotation SOPs                                                     |
| Nadia (HR)   | Flight-risk playbooks, comp-band edge cases, engagement-survey interpretation                                             |

**Twins surface ON the Knowledge Layer. Memory writes INTO the Intake layer. Promotion Queue catches what rises. Knowledge layer stores what stays.**

---

## 8. Brainstorming Layer (Twin Memory — Conversational AI Chat Data)

### What the Brainstorming Layer Is

The Brainstorming Layer is the **Twin Memory** layer — cognitive working memory holding **conversational AI chat data**. It is the _raw material_ from which Organizational Memory is built.

### What Sits Per Persona

| Persona | Brainstorming Contents                                                                                                                                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maya    | ChatGPT/Claude conversations about her deals, Airtable notes, Slack thread participation                                                                                                |
| Sana    | Claude conversations about customer escalations, Notion QBR outlines, Zendesk ticket analysis chats                                                                                     |
| Lila    | Perplexity research queries, Notion drafts annotated through Twin, Slack brand channel conversations                                                                                    |
| Nadia   | People-confidential conversations with Twin or via email — _all governed_: Triage is hit first, only non-PHI pattern fragments survive, only with approval do they shape persona memory |

### Flow Per Twin Chat Session

```
User message → Twin Reasoning (L3) → Response (proposal + grounded evidence + chips)
     │                                    │
     ▼                                    ▼
warm-turns DO SQLite                  emitTriageInput(intent + message + proposed)
(conversation_turns table)              │
     │                                  ▼
     │                            MEMORY INTAKE QUEUE
     │                                  │
     │                                  ▼
     │                            TRIAGE BOT
     │                            classify: fact | decision | observation | relationship | noise
     │                            score: confidence 0–1
     │                            derive: persona-tag, industry-tag, evidence ribbon
     │                                  │
     │                            conf ≥ 0.85, evidence ≥ 2 sources
     │                                  ▼
     │                            EVOLUTION ENGINE
     │                            Observation + Evidence → Pattern candidate
     │                                  │
     │                            (hours/days pass)
     │                                  ▼
     │                            PROMOTION QUEUE entry
     │                            "Renewal Risk Pattern" | conf 0.86 | 17 accounts
     │                                  │
     │                                  ▼
     │                            User approves / rejects / annotates
     │                                  │
     │                                  ▼
     │                            ORGANIZATIONAL MEMORY
     │                            Now reusable across whole tenant
```

### Why It Is Essential, Persona-Distinct

- **Without the Brainstorming Layer**, every Twin chat is ephemeral.
- **With it**, every chat is an observation candidate that _may_ become a knowledge artifact that _will_ serve the whole tenant.
- **Without the Brainstorming Layer**, IntegrateWise is a great AI assistant.
- **With it**, IntegrateWise is an AI assistant that **builds the company's own institutional intelligence from its actual work**.

**Persona distinction:** Triage Bot classification is department-tagged. Maya's messages → `[sales: observation|decision|fact|relationship|playbook candidate]`. Sana's → `[cs: observation|decision|fact|playbook candidate, healthcare: phi_flag]`. Tomás's → `[eng: incident|deploy-pattern|post-mortem candidate]`. Nadia's → `[hr: people-observation|playbook candidate, governance: scope-restricted]`. **Brainstorming Layer is persona-aware from intake onward.**

---

## 9. AI Chat — Spine-Grounded Insights and Suggestions (Recovering the Original Vision)

### The Original Vision, Restored

The AI Chat was never meant to be "a chat." It was meant to be a **Spine-grounded conversational surface** where every response is:

- **Sourced** — every claim has a `via` citation.
- **Confidenced** — every recommendation shows `confidence: 0.86`.
- **Actionable** — every reply ends with a one-click capability chip.
- **Proactive** — Twin speaks first on entity load; doesn't wait for a question.

### Message Type Architecture (already intact)

```
Message {
  content      — fallback text
  blocks[]     — callout | entity card | list | reference list | separator
  evidence[]   — EvidenceSource with source + timestamp + confidence
  entity       — EntitySnapshot (inline entity card on the reply)
  memoryRefs[] — which memory entries informed the reply
  memoryCommit — what was learned from this exchange
  actions[]    — Approve | View | Link chips on the message
  table        — inline structured data (headers + rows)
}
```

### Example: Spine-Grounded Twin Chat Per Persona

**Maya opens Twin chat, Skyline in panel:**

> _"Should I move Skyline to Stage 4?"_
>
> **Twin:** "I am not sure. Here is what I have.
> **CRM**: stage = Negotiation, last activity 8 days ago.
> **Slack**: VP Eng asked about SOC 2 Tuesday. No reply yet.
> **Email**: CFO replied 11:42 PM with one open question — deployment timeline.
> **Memory (my playbooks)**: You have moved 4 deals to Stage 4 in Q3. In 3/4, buyer's CFO signed off first. In the 4th, the deal slipped.
>
> **Recommended action (confidence 0.74)**:
>
> 1. Today's reply handles the CFO's deployment timeline question.
> 2. After CFO replies, move to Stage 4 with a soft SOC 2 follow-up.
>
> Chips: [Approve / Revise / Discard]"

**Sana opens Twin chat, Mercy Health in panel:**

> _"Should I escalate Mercy's BAA?"_
>
> **Twin:** "Here is what I have.
> **Compliance**: BAA stage 4 for 18 days. Counterparty counsel = Lisa Wong.
> **Memory (my playbooks)**: 3 BAA cases in 8 weeks involved Lisa Wong. Mean stall = 60 days. Pattern conf 0.81.
> **Playbook (Lisa Wong)**: Recommend escalation to SVP Legal counsel at parent org at day 30.
>
> **Recommended action (confidence 0.86)**:
> Escalate today. Drafted email to SVP Legal at Mercy's parent. Audit-logged.
>
> Chips: [Approve / Revise / Discard]"

**Same Twin engine. Persona-shaped hydration. Identical Message block types. Identical governance. Identical provenance.** That is the careful consolidation.

### What Was Eroded in Later Builds, and How to Restore It

| Original Vision                                             | Erosion                                                         | Restoration                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Twin greets proactively with overnight brief per department | ✅ Greeting scaffolding intact (12 entries) but content is mock | Wire live reads from Spine + Connector Hub last-sync state              |
| Every answer has sources cited                              | ✅ `EvidenceSource[]` type + render                             | Connect `evidence` to live connector fetch timestamps + journal entries |
| Proposals embedded in chat                                  | ✅ `actions[]` array on messages                                | Wire to `proposal-service` + Capability Fabric invocation               |
| Entity snapshots inline                                     | ✅ `EntitySnapshot` render                                      | Connect to D1 entity reads through canonical entity-type-to-table map   |
| Memory refs visible                                         | ✅ `memoryRefs` + `memoryCommit`                                | Connect to Memory layer L7 + Triage per-message                         |
| Source-grounded "via GitHub / via Salesforce"               | ✅ Panel component renders                                      | Connect to real connector sync status indicators                        |
| Confidence shown, not hidden                                | ✅ `confidence: 0.86%` rendering                                | Connect to live AI inference calibration                                |
| One-action-at-a-time, actionable                            | ✅ Recommendation + chips                                       | Connect to Capability Fabric persona-aware chips                        |
| User approves before any execution                          | ✅ Approve button → Bench                                       | Wire to L7 governance token minting + audit                             |

**The architecture, components, types, render code — all intact. The live data binding is the work.** That binding is the difference between IntegrateWise as a product and IntegrateWise as a demo.

---

## 10. Capabilities in the Workspace — Inline Actions, Sync Modes, Cross-Tool Composition

### The Doctrine

**L1 workbench is not a viewer. Buttons on the workbench are Capability Fabric invocations**, not navigation. Every action a user can take on an entity card is a registered capability with:

- Input/output schema
- Required Spine context scopes
- Allowed sync modes (soft / real / both)
- Default confidence threshold
- Default governance posture
- Evidence chain template
- Audit log entry shape

### Capability Invocation Surfaces

```
Workbench (L1)        — entity card buttons, list row actions
Entity Twin Panel     — Accept & act chip → capability invocation
Twin chat (L3)        — message.actions → capability invocation
CLI (L4)              — `iw capability <name> --context <entity>`
Slack/Teams (Layer 8) — shortcut button → capability invocation
Mobile (L1)           — touch-target capability button
```

**One capability, every surface.**

### Three Sync Modes Per Capability

| Mode                                              | Behaviour                                                                                                                                                                                                  | Default for                                                                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Soft sync (write staging)**                     | User acts in workbench → Spine written atomically → Connector Hub enqueues downstream → background worker reconciles to source tool. User sees result in seconds. Tool sees change when its adapter ticks. | Healthcare compliance entities, finance audit-trail entities, HR people records — latency-insensitive, mutability-sensitive           |
| **Real sync (write-through)**                     | User acts → Spine written atomically AND source tool called via connector adapter → both succeed → commit logged. Failure triggers rollback + audit.                                                       | Daily-use mutations (Sales activities, support tickets, message sends) where "I acted, it should be live now" is the user expectation |
| **Propose → Approve → Execute (Twin governance)** | Twin proposes → user approves → governance token minted → Spine AND source tool written in same transaction → audit-trail logged                                                                           | High-stakes mutations (mark at-risk, change ownership, fire rollback, change comp band)                                               |

**The user's IT sets the per-capability default sync mode during onboarding, not per-action in the moment.** Persona defaults pre-configured:

| Persona         | Soft                               | Real                        | Propose                                |
| --------------- | ---------------------------------- | --------------------------- | -------------------------------------- |
| Sales           | SFDC writes                        | Activity logs               | "mark at-risk", "remove from forecast" |
| CS (Healthcare) | HIPAA-adjacent entities (BAA, PHI) | Routine CS updates          | "mark renewal risk"                    |
| HR              | Comp band updates                  | Skip-level calendar updates | Any "mark flight risk"                 |
| Eng             | Sprint status writes               | Incident acknowledgment     | Rollbacks, post-window deploys         |

### Example Capabilities and Their Workbench Surfaces

| Capability                  | Surface                        | Sync Mode                         | Persona        |
| --------------------------- | ------------------------------ | --------------------------------- | -------------- |
| `mark_lead_active`          | Sale entity card               | Soft sync to CRM                  | Sales          |
| `view_contact`              | Contact card                   | Read; no mutation                 | All            |
| `update_field`              | Field-level edit on any entity | Soft sync default                 | Persona-shaped |
| `log_activity`              | Activity timeline chip         | Real sync                         | Sales, CS, HR  |
| `draft_outreach`            | Outreach chip                  | Twin proposes; soft-send to email | Sales, CS      |
| `schedule_call`             | Calendar chip                  | Real sync to Calendar             | Sales, CS, HR  |
| `mark_renewal_risk`         | Renewal card chip              | Propose-gate (≥ 0.85)             | CS, RevOps     |
| `update_health_score`       | Health tile                    | Soft sync external CRM            | CS             |
| `schedule_blog_post`        | Website Manager chip           | Composed; brand gate; atomic      | Marketing      |
| `swap_image`                | Asset Library → page ref       | Real sync to CMS + DAM            | Marketing      |
| `mark_campaign_active`      | Campaign chip                  | Real sync UTM + CRM               | Marketing      |
| `acknowledge_incident`      | Incident timeline              | Real sync (latency-sensitive)     | Eng            |
| `pre_draft_rollback`        | Incident chip                  | Propose-gate                      | Eng            |
| `schedule_post_mortem`      | Incident chip                  | Real sync Calendar + Notion       | Eng            |
| `mark_person_flight_risk`   | Person card chip               | Propose-gate + governance         | HR             |
| `update_comp_band_edge`     | Person card chip               | Propose-gate + multi-approval     | HR             |
| `schedule_skip_level`       | Person card chip               | Real sync Calendar                | HR             |
| `update_pipeline_coverage`  | Pipeline chip                  | Twin computes; soft-sync forecast | RevOps         |
| `flag_reconciliation_delta` | Pipeline chip                  | Propose-gate (cross-team)         | RevOps         |
| `close_invoice`             | Invoice chip                   | Real sync NetSuite/Stripe         | Finance        |
| `sign_contract`             | Contract chip                  | Propose-gate + e-signature        | Legal          |

### Cross-Tool Field Composition — The Website Manager (Canonical Example)

The Website Manager is **the canonical demonstration of cross-tool field fusion inside one workbench surface**. From the doctrine:

> _"Website manager should be a point where it shows the number of user visits, the blog content, linking the content, images, and so multiple."_

One Persona (Lila / Marketing × Retail / Commerce). One workbench surface. **Five tools' canonical state fused**, governed by the same Twin, capable of one-click inline actions.

| Surface Tile         | Composed From                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Total Pages**      | Sanity / Contentful + WordPress schema                                                              |
| **Monthly Visitors** | Cloudflare Analytics + Plausible                                                                    |
| **SEO Health**       | Ahrefs / Semrush + Search Console                                                                   |
| **Uptime**           | StatusCake + Cloudflare health checks                                                               |
| **Traffic Chart**    | GA4 + Plausible + UTM tools                                                                         |
| **Core Web Vitals**  | PageSpeed + Search Console (LCP/FID/CLS with thresholds)                                            |
| **Device Breakdown** | GA4 + Plausible (Desktop/Mobile/Tablet %)                                                           |
| **Traffic Sources**  | Analytics + UTM (Organic/Direct/Social/Referral/Paid)                                               |
| **SEO Issues**       | Search Console + Semrush crawl (type/message/severity/fix-it link)                                  |
| **Top Pages**        | Sanity CMS + GA4 (title, path, traffic, status, "Edit" chip)                                        |
| **Recent Edits**     | Sanity + Ghost + Webflow (page, action, author, time)                                               |
| **Posts List**       | Notion drafts + Sanity published + Ghost scheduled (title, status, view count, comments, SEO score) |
| **Asset Library**    | ImageKit / DAM / Cloudinary (image/video/document, dimensions, "Used in N pages")                   |
| **Campaigns**        | Marketo / HubSpot + GA4 + Plausible (active, attribution, conversion)                               |

### The `schedule_blog_post` Capability — Composed Invocation

Inputs pulled from multiple systems:

```
inputs:
  draft_content:        <from Notion draft ID>
  canonical_image:      <from ImageKit ID>
  publish_target:       <to Sanity via CMS adapter>
  social_amplification: <to Buffer / native social APIs>
  email_blast:          <to HubSpot / Customer.io>
  analytics_tile:       <Plausible / GA4 attribution link>
  seo_check:            <via Semrush cheat sheet>
```

Compose, gate, execute:

1. **Read inputs** across Notion, ImageKit, Buffer, HubSpot, Plausible.
2. **Brand compliance check** — Twin compares draft to user's brand voice playbook (Memory layer).
3. **Brand gate failure?** — Twin flags diff. User approves modification or proceeds without (« Softer mode » / bypass).
4. **Gather all writes** into one orchestration plan.
5. **Approve once** — single token mint.
6. **Atomic commit across all systems** — single transaction, single audit entry.
7. **Capability complete** — user sees in workbench view, all systems updated, audit logged.

**Capabilities compose across tools. Workbench is capable. Persona-aware. Governed.** That is the action-doctrine of IntegrateWise made visible in L1.

---

## Closing — The Integrated Schema

The marketplace user is Maya, Sana, Tomás, Nadia, Lila, or Arjun — one of six personas. They install from a marketplace listing targeting their persona. OAuth passes identity only. **Onboarding captures what OAuth cannot.** `tenant_spine_config` commits. D1 Spine partitions load from the connector canonical state. L1 workbench renders persona-shaped projections. L2 signals fire read-side over Spine without LLM. L3 Twin hydration assembles persona sources through the activation gate. L4 Knowledge surfaces memory from the 8-layer pipeline. The Brainstorming Layer holds conversational working memory. The Capability Fabric executes inline actions through three sync modes, governed per tenant default.

**L1 data load: not OODA. L1 AI on loaded data: OODA, proactive, no re-asking. L2: read-side Observe + Orient. L3: full OODA, user-contextual, activation-gated.**

**Truth you own. AI you rent. Approval in between. Continuity over asking.**

That is the entire marketplace onboarding × persona design, grounded in the source code, the IntegrateWise doctrinal foundation, and the **structural reality that ChatGPT and Claude authenticators cannot and will not pass persona context** — only an in-place onboarding phase can.
