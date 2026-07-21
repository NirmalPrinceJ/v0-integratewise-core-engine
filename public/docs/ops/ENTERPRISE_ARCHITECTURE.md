# IntegrateWise Enterprise Architecture

## The Business Operating System Map

> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md)  
> _This document is downstream of the canonical architecture. Refer to the canonical source for current truth._

**Version:** 1.0.0  
**Date:** 2026-07-06  
**Status:** FINAL — The unified map that explains how every specification fits together as one business operating system.  
**Authority:** Nirmal Prince J (Founder/CEO) + Engineering Team

---

## What This Document Is

This is the **Enterprise Architecture** — one level above the Platform Architecture. Where the Platform Architecture explains how each system works, this document explains **why each system exists and how they fit together as a single business operating system**.

If you are a new engineer joining IntegrateWise, read this first. If you are a founder explaining the company to an investor, hand them this document. If you are a customer-success lead wondering why a feature works the way it does, the answer is in here.

**This document is the map. The 35 architecture documents are the territory.**

---

## Part I: The Integrated Vision

### The Three Breakthroughs

#### 1. Human Workbench Is Primary

> _"Stop Being Human APIs"_ — January 2025 insight

The workbench is not a feature. It is THE product. The AI Twin has its own home (separate, not interrupting). The Continuity Engine owns memory (invisible backbone). Humans do work in the workbench; AI assists without interrupting.

#### 2. Platform Activation Through Frozen Contracts

Eight frozen contracts make IntegrateWise replaceable:

1. PlatformRequest/Response (envelopes)
2. Capability (atomic work unit)
3. Entity (what Capability operates on)
4. Memory (knowledge with boundaries)
5. Proposal/Approval (decision lifecycle)
6. Projection (how Capability renders per lens)
7. ToolAction (execution primitive)
8. ProviderAction (external integration primitive)

`@integratewise/sdk` makes any frontend functional: a Vite app, a Next.js app, a Replit prototype, an Electron desktop app, a mobile React Native app. Same spine, same capabilities, same governance.

#### 3. The Synthesis: Adaptive Platform

When you combine both:

- **Recovery:** Workbench is human-centric, eight lenses (Sales, CS, Finance, Ops, HR, Exec, Personal, Developer)
- **Activation:** Those eight lenses become Projections via `iw.workbench.lens()`
- **Result:** Any frontend using `@integratewise/sdk` becomes an IntegrateWise workbench

### The One-Liner

> **One JWT. One SSE connection. One Bridge. The Bridge connects to everything else.**

The IntegrateWise Continuity Bridge is a multi-tenant continuity ecosystem that preserves identity, context, memory, governance, and execution across all consumers (humans, AI assistants, apps, tools) through one stable continuity contract. Consumers never hold provider credentials, never import internal topology, and never bypass the governance gate.

**Doctrine:** _Truth you own. AI you rent. Approval in between._

### The Real Product

Not: "Multi-Model AI Orchestration"  
Not: "Capability Engine"  
Not: "Adaptive Spine"

**Yes:** "Nothing is lost in context."

When Sarah (Sales) works in the web app, then switches to mobile, then hands off to Marcus (CS):

- Marcus sees everything Sarah saw
- Marcus sees what the Twin observed
- Marcus knows Sarah's proposals are waiting
- Marcus can pick up exactly where Sarah left off
- No context switching cost. No information re-entering. No missed details.

**That's the product. That's what people buy. That's what makes the moat.**

---

## Part II: The 9-Layer Enterprise Architecture

The Enterprise Architecture is organized into **nine execution layers**. Each layer serves the layer above it and consumes the layer below it. No layer skips. No layer is optional.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — BUSINESS                                         │
│  Mission, Vision, Doctrine, Product Strategy, Ontology    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 — EXPERIENCE                                       │
│  Workspace OS, Projections, UI Components, Design System    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3 — INTELLIGENCE                                     │
│  Continuity, Twin, AI, Memory, Signals, Knowledge, Search   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4 — EXECUTION                                        │
│  Capability Fabric, Workflow, Governance, Integrations,     │
│  Marketplace, Plugin Runtime                                  │
├─────────────────────────────────────────────────────────────┤
│  LAYER 5 — DATA                                             │
│  Pipeline, Operational Spine, Ontology, Timeline, Evidence  │
├─────────────────────────────────────────────────────────────┤
│  LAYER 6 — PLATFORM                                         │
│  Identity, Billing, Deployment, Security, Observability,    │
│  SDKs, APIs, Testing, Lifecycle                               │
├─────────────────────────────────────────────────────────────┤
│  LAYER 7 — INFRASTRUCTURE                                   │
│  Cloudflare Workers, Durable Objects, D1, KV, R2, Queues,   │
│  AI Gateway, Vectorize, AI Search, Pages, WAF              │
├─────────────────────────────────────────────────────────────┤
│  LAYER 8 — OPERATIONS                                       │
│  CI/CD, IaC, Monitoring, Security, Compliance, SLO,         │
│  Capacity, Incident Response, Backup, DR                     │
├─────────────────────────────────────────────────────────────┤
│  LAYER 9 — EVOLUTION                                        │
│  Testing, Lifecycle Management, Versioning, Controlled         │
│  Evolution — the "how we change" layer                      │
└─────────────────────────────────────────────────────────────┘
```

**Cross-Cutting Concerns:** Security, Observability, Reliability, Compliance — they run through every layer.

---

### LAYER 1 — BUSINESS

_The "why" layer. Why does IntegrateWise exist? What does it believe?_

#### 1.1 Mission

IntegrateWise is **The Operational Continuity Platform** — the infrastructure layer that preserves context, memory, and governance across every tool, every person, and every AI.

#### 1.2 Vision

> **Nothing important is forgotten.**

When a team uses IntegrateWise, context flows continuously. Decisions are preserved. Institutional knowledge compounds. AI assistants know what the team knows. No one starts from zero.

#### 1.3 Doctrine

| Doctrine                                             | Meaning                                                                                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Truth you own. AI you rent. Approval in between.** | The Spine is the organization's truth. AI proposes. Humans approve. No AI executes without consent.                                          |
| **Continuity over asking.**                          | The system never re-asks for context already established. If it's on screen, in the Spine, or inferred from conversation, the Twin knows it. |
| **One Spine. Many Projections.**                     | All UI surfaces are views of the same Spine. No duplication. No drift.                                                                       |
| **Never reason at intake.**                          | Data enters raw. Reasoning happens once, in the normalizer, not at every ingestion point.                                                    |
| **No execution without approval.**                   | Every action is governance-gated. Every approval is audit-logged.                                                                            |
| **Tenant isolation is absolute.**                    | Every query includes `WHERE tenant_id = ?`. Cross-tenant access is a security violation.                                                     |

#### 1.4 Product Strategy

**Category:** The Operational Continuity Platform  
**Product:** IW Continuity Bridge  
**Promise:** Nothing important is forgotten  
**Action:** One click to total continuity / The last auth for endless continuity  
**Proof:** One workbench. Full continuity. Zero context loss.  
**Philosophy:** Human workbench. Assistive AI. Governed context.

**Competitive Frame:** high structure × high intelligence × human-first workbench.  
_"They connect apps; we connect context."_

**Anti-Positioning:**

- Not "AI-powered platform" (AI is infrastructure, not the product)
- Not "no-code automation" (humans do work, AI assists)
- Not "replace your tools" (we connect them, not replace them)
- Not "chat with your data" (the workbench is primary, chat is secondary)

#### 1.5 Business Ontology

IntegrateWise's business ontology is the bridge between how a company describes itself and how the system represents that company. It is the **lingua franca** between business intent and system execution.

```
Business Ontology
├── Entity Taxonomy (what exists in the business)
│   ├── Core Entities: Account, Contact, Opportunity, Deal, Ticket, Activity, Task, Event, Note, Meeting, Communication, Document, Goal, Workflow, Signal, Decision, Approval, Execution, Outcome, Organization, Team, Resource
│   ├── Industry-Specific: Patient (Healthcare), SKU (Retail), Claim (Insurance), Project (ProServ), Candidate (HR), Incident (Engineering)
│   └── Custom Entities: tenant-defined via schema AI
├── Relationship Taxonomy (how entities connect)
│   ├── person ← works-for → account
│   ├── person ← owns → opportunity
│   ├── account ← has → tickets
│   ├── opportunity ← drives → forecast
│   └── (500+ relationship types indexed)
├── Activity Taxonomy (what happens to entities)
│   ├── Create, Update, Delete, Merge, Convert, Stage Change, Field Change, Relationship Change
│   └── Each activity → Spine audit log + signal generation
├── Signal Taxonomy (what the system notices)
│   ├── Risk: churn risk, renewal risk, flight risk, compliance risk, deadline risk
│   ├── Opportunity: expansion, upsell, cross-sell, partnership, efficiency gain
│   ├── Trend: velocity change, sentiment shift, engagement pattern, health trajectory
│   └── Metric: threshold breach, anomaly, forecast deviation, coverage gap
└── Decision Taxonomy (what decisions humans make)
    ├── Approve / Reject / Modify / Defer / Escalate
    └── Each decision → governance audit log + memory compound
```

#### 1.6 The Persona Matrix (12 × 11)

The persona matrix is the **schema shaper**. It determines what entities a tenant sees, what KPIs they track, what connectors they need, and how their Twin greets them.

```
Departments (12) × Industries (11) = 132 schema variants

Departments (T0 — Core, T1 — Extended, T2 — Specialized):
├── T0: Sales, Marketing, RevOps, Customer Success, Engineering, Finance
├── T1: Support, Product, HR, Legal, Service Operations
└── T2: Supply Chain

Industries (11):
├── Technology / SaaS
├── Healthcare / Life Sciences
├── Financial Services / Insurance
├── Manufacturing / Industrial
├── Retail / Commerce
├── Professional Services
├── Media / Entertainment
├── Education
├── Real Estate / Construction
├── Government / Public Sector
└── Energy / Utilities

Per-Persona Configuration:
├── Entity Vocabulary (what a "deal" means in Sales vs. Engineering)
├── KPI Set (what metrics matter for this department × industry)
├── Connector Set (which tools this persona typically connects)
├── Greeting Line (how the Twin greets this persona)
├── Governance Posture (default sync modes, approval thresholds)
├── North Star Metric (the single most important metric for this persona)
└── Twin Grammar (communication style, evidence style, action style)
```

**Example — Maya (Sales × SaaS):**

- Entity vocabulary: Leads, Contacts, Accounts, Opportunities, Deals, Activities, Forecasts
- KPIs: Pipeline coverage, Win rate, Average deal size, Sales cycle length, Quota attainment
- Connectors: Salesforce, HubSpot, Slack, Gmail, Calendar, LinkedIn Sales Navigator
- Greeting: "Your pipeline is $1.2M. Three deals need attention."
- Twin grammar: "Terse. Action-oriented. Inline next step. No preamble."

**Example — Sana (CS × Healthcare):**

- Entity vocabulary: Accounts, Contacts, Health Scores, Tickets, Renewals, BAAs, Compliance Flags
- KPIs: Health score, Renewal rate, Time-to-resolution, NPS, BAA completion rate
- Connectors: Salesforce, Zendesk, Gainsight, Notion, Slack, CertifyMD
- Greeting: "Mercy Health BAA is at stage 4 for 18 days. Two renewals this week."
- Twin grammar: "Case-law-style. Cited evidence. One decision. High caution near PHI."

#### 1.7 Document References (Layer 1)

| Document                              | What It Covers                        | Why It Matters                                     |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| `INTEGRATED_VISION.md`                | Recovery + Activation synthesis       | The founding thesis: "Nothing is lost in context." |
| `CANON.md`                            | Canonical document index              | The map to all other documents.                    |
| `PLATFORM_ACTIVATION_FRAMEWORK.md`    | How the platform activates per tenant | Onboarding → Spine hydration → first value.        |
| `docs/CANON.md`                       | Locked decisions (DECISION 18-27)     | The constitutional law of the platform.            |
| `packages/config/persona-matrix.json` | 132-variant persona matrix            | Determines every tenant's experience.              |
| `ONBOARDING_API_CONTRACT.md`          | 7-step onboarding API                 | The front door to the platform.                    |

---

### LAYER 2 — EXPERIENCE

_The "what users see" layer. The Workspace OS, projections, and design system._

#### 2.1 The Workspace OS

The Workspace OS is the **single full UI** that users interact with. It is not multiple apps. It is one UI with multiple lenses (projections).

```
Workspace OS
├── User Workbench (L1 — primary work surface)
│   ├── Domain Workbenches (Sales, CS, Finance, Ops, HR, Exec, Personal, Developer)
│   ├── Entity 360 Views (single view of any entity across all systems)
│   ├── Activity Timelines (what happened to this entity)
│   ├── KPI Dashboards (metrics that matter for this persona)
│   └── Inline Actions (capability chips on every entity card)
├── Twin Workbench (L3 — AI reasoning interface)
│   ├── Chat Interface (conversational AI)
│   ├── Proposal Review (approve/reject/modify)
│   ├── Evidence Ribbons (source citations for every claim)
│   └── Confidence Scores (transparent AI uncertainty)
├── Collaboration Overlay (L2 — ambient intelligence)
│   ├── Signals Panel (risks, opportunities, anomalies)
│   ├── Insights Panel (pattern syntheses)
│   ├── Think Traces (hypothesis candidates)
│   └── Context Assembly (assembled entity view)
├── My Desk (L4 — governance & approval)
│   ├── Pending Proposals (0.70–0.85 confidence)
│   ├── Approval History (what you approved/rejected)
│   ├── Governance Queue (what needs your attention)
│   └── Audit Trail (what happened, when, by whom)
└── Memory & Knowledge (separate navigation surface)
    ├── Intake (raw observations)
    ├── Triage (classification & scoring)
    ├── Evolution (pattern detection)
    ├── Promotion Queue (human-approved patterns)
    ├── Organizational Memory (approved facts)
    └── Knowledge Base (documents, playbooks, SOPs)
```

#### 2.2 The Projection Engine

Every frontend in the IntegrateWise ecosystem receives exactly **three things**:

1. **Projection Manifest** — What can this frontend do? (navigation, widgets, commands, capabilities)
2. **Gateway SDK** — How does it talk to the backend? (type-safe API client)
3. **Design System** — How does it look? (typography, spacing, colors, components, interactions)

```
Frontend → POST /api/v1/projection → Projection Engine → Gateway

Projection Engine:
├── FacadeRegistry (routes to correct facade per projection_type)
├── WorkspaceFacade (composes: health, tasks, signals, activity, search)
├── MobileFacade (smaller payload, pre-computed, action-oriented)
├── ExecutiveFacade (metrics-first, no operational details)
├── DeveloperFacade (MCP registry, webhook config, schema docs, raw API)
└── AssistantFacade (memory-first, full LOOP integration, capability descriptions)
```

**Key Invariant:** Frontends are stateless renderers. They receive a projection DTO and render it. Zero business logic in the frontend. If business logic varies by UI, that's a bug in the Capability contract, not a feature.

#### 2.3 The Three Pillars (Frontend Pattern)

| Pillar                  | File                         | Purpose                   | Lines |
| ----------------------- | ---------------------------- | ------------------------- | ----- |
| **Projection Manifest** | `lib/projection-manifest.ts` | What can I do?            | 435   |
| **Gateway SDK**         | `lib/gateway-sdk.ts`         | How do I talk to backend? | 266   |
| **Design System**       | `lib/design-system.ts`       | How do I look?            | 375   |

**Example:** Adding a new product (e.g., TAM Analysis) takes one day:

1. Add Projection Manifest → defines navigation, widgets, commands, capabilities
2. Build UI components using Design System → consistent look and feel
3. Wire to Gateway SDK → type-safe backend calls
4. Deploy → same infrastructure, same patterns

#### 2.4 L1-L4 Layer Model

```
L1 — Projection / Read Layer (Workbench)
├── Primary operational interface
├── Entity cards, lists, timelines, KPIs
├── Inline actions = Capability Fabric invocations
└── NOT OODA. Just data + actions.

L2 — Intelligence Overlay (Cognitive)
├── Observe + Orient (no LLM required, cached)
├── Signals (anomalies, risks, missing-activity)
├── Insights (synthesized observations)
├── Think traces (hypothesis candidates)
├── Context (assembled entity view)
└── Evidence ribbons (source citations)

L3 — Operation / Execution Layer (Twin)
├── Full OODA loop
├── Activation gate: memory_records.total ≥ 3, promoted ≥ 1, no violations
├── Context assembly: aiSearch + conversationalSearch + mcpSearch + spineRead
├── LLM inference via gatewayChat
├── Propose with confidence + evidence + alternatives
└── Human approves before execution

L4 — Full Continuity / Autonomous Participation
├── Memory management
├── Knowledge curation
├── Governance oversight
├── Audit trail
└── The Twin as operational participant, not product
```

#### 2.5 Document References (Layer 2)

| Document                        | What It Covers                 | Why It Matters                                                                                        |
| ------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `THREE_PILLARS_ARCHITECTURE.md` | Frontend consolidation pattern | Every frontend gets exactly three things.                                                             |
| `PROJECTION_OS_ARCHITECTURE.md` | Projection Engine design       | How capabilities compose into user-facing projections.                                                |
| `CANONICAL_ARCHITECTURE.md`     | How thesis maps to code        | PlatformRequest → Capability → Entity → Memory → Proposal → Projection → ToolAction → ProviderAction. |
| `FEATURE_MAP.md`                | Feature inventory              | What exists, what's planned, what's retired.                                                          |
| `REPOSITION_MAP.md`             | UI repositioning guide         | How components map to the new layer model.                                                            |

---

### LAYER 3 — INTELLIGENCE

_The "how the system thinks" layer. The Continuity Engine, Twin, AI, Memory, Signals, and Knowledge._

#### 3.1 The Continuity Engine

The Continuity Engine is the **memory consolidation and lifecycle substrate**. It guarantees that every agent turn starts with more context than the last.

```
Memory Lifecycle (7 stages):
Intake → Classification → Validation → Promotion → Memory Store → Continuity Graph → Memory Decay

Per-Memory Triage:
├── Confidence ≥ 0.85 → Auto-promote to Active Memory
├── Confidence 0.70–0.85 → Staging (human review in Promotion Queue)
└── Confidence < 0.70 → Discard

Active Memory Decay:
├── If not reinforced, decays after ~30 days of no access
├── Reinforcement resets the clock
├── Archived memory is still searchable but not proactively surfaced
```

#### 3.2 The Twin (L3 OODA Loop)

The Twin is a **persistent per-user AI reasoning engine** (Durable Object). It is not a chatbot. It is an operational participant that observes, reasons, proposes, and learns.

```
OODA Loop Per Twin Session:

Observe  — read from Spine, signals, memory, conversation history
    ↓
Orient   — assemble context (Entity360 + memory + knowledge + tools)
    ↓
Decide   — generate proposal with confidence score
    ↓
Act      — engine proposes. Human decides.

Activation Gate (before any reasoning):
├── memory_records.total < 3 → BLOCK, render hydration message
├── memory_records.promoted < 1 → BLOCK, render staging state
├── unresolved governance violations → BLOCK, render audit summary
└── else → PROCEED to context assembly

Context Assembly Pipeline (parallel):
├── aiSearch: semantic knowledge retrieval
├── conversationalSearch: past chat sessions
├── mcpSearch: connector-spine resources
├── spineRead: D1 entity reads (engineering-specific partitioning if needed)
├── Durable Object SQLite: last 10 warm turns
├── Learned Profile: daily-reflected communication style
└── System Prompt Construction → LLM inference → Propose
```

**Per-Persona Twin Grammar:**

| Persona            | aiSearch Sources                           | Conversational History           | MCP Search                                   | Engineering Intent? | DO Warm | Learned Profile                                             |
| ------------------ | ------------------------------------------ | -------------------------------- | -------------------------------------------- | ------------------- | ------- | ----------------------------------------------------------- |
| Maya (Sales)       | CRM field schema, deal-stage playbooks     | Last 14d chat sessions           | SFDC, HubSpot, Slack, Gmail, Calendar        | No                  | Last 10 | "Terse. Action-oriented. Inline next step."                 |
| Sana (CS/Health)   | BAA playbooks, healthcare compliance notes | Last 21d chat + customer threads | Gainsight, Zendesk, Notion, Slack, CertifyMD | No                  | Last 10 | "Case-law-style. Cited evidence. High caution near PHI."    |
| Tomás (Eng/Mfg)    | Incident-pattern notes, post-mortems       | Last 14d chats + Slack on-call   | Jira, PagerDuty, GitHub, Datadog             | **Yes**             | Last 10 | "Tactical. Time-stamped. Action + rollback + verification." |
| Nadia (HR/ProServ) | Flight-risk playbooks, comp edge patterns  | Last 30d (governance-scoped)     | Workday, Lattice, survey vendor              | No                  | Last 10 | "High-censorship. Compact. 0.94+ confidence only."          |

**Same Twin engine, persona-shaped hydration, persona-shaped grammar, persona-shaped governance.**

#### 3.3 Memory & Knowledge (L4)

```
Three-Axis Separation:
├── SPINE = What IS (truth) — Accounts, contacts, deals, tickets, events
├── MEMORY = What it MEANS — "Silent champion + open P1 = renewal risk"
└── KNOWLEDGE = What we KNOW — Playbooks, runbooks, SOPs, templates

8-Layer Memory Pipeline:
L1 Twin Memory (cognitive working memory — chat threads, sessions, reasoning chains)
  ↓
L2 Memory Intake (incoming observations — Slack, meetings, email, docs, chat, voice)
  ↓
L3 Triage Bot (classify, dedupe, score: memory|noise|policy|fact|decision|relationship)
  ↓
L4 Memory Evolution (Observation → Pattern → Insight → Playbook → Institutional Knowledge)
  ↓
L5 Promotion Queue (candidate + confidence + evidence)
  ↓
L6 Human Approval (Truth you own. AI you rent. Approval in between.)
  ↓
L7 Organizational Memory (approved facts, decisions, playbooks, policies, relationships, outcomes)
  ↓
L8 Knowledge (documents, runbooks, research, templates, SOPs)
```

**The Promotion Queue is "the single most important screen in IntegrateWise."** It is where AI learns, human approves, organization remembers. Per-persona queue: Maya sees sales pattern candidates, Sana sees compliance pattern candidates, Nadia sees flight-risk pattern candidates.

#### 3.4 Signals & Intelligence

```
Signal Types:
├── Risk: churn risk, renewal risk, flight risk, compliance risk, deadline risk
├── Opportunity: expansion, upsell, cross-sell, partnership, efficiency gain
├── Trend: velocity change, sentiment shift, engagement pattern, health trajectory
└── Metric: threshold breach, anomaly, forecast deviation, coverage gap

Signal Generation:
├── Connector-sync delta detection
├── Spine change detection (entity mutations trigger signal scan)
├── Intelligence service periodic scans
├── Twin reasoning trace extraction
└── User action pattern recognition

Signal Routing:
├── High confidence (≥ 0.85) → Auto-surface in L2 overlay + notify
├── Medium confidence (0.70–0.85) → Queue in My Desk for review
└── Low confidence (< 0.70) → Discard (still logged)
```

#### 3.5 AI Runtime

```
Model Provider (The "AI You Rent"):
├── Default: gpt-5-mini via OpenRouter (aggregator)
├── Swappable: OpenAI, Anthropic, Google, Grok — config change, not migration
├── Binding: Consumers call capabilities, never model names
├── Per-tenant/per-capability model selection: cheap for triage, strong for high-stakes proposals
└── Resolution: DECISION 30 (Grok) superseded. Default = gpt-5-mini. Grok available as config option.

Agent Services:
├── twin-orchestrator: Persistent per-user Twin (Durable Object)
├── iw-agent-runtime: MCP-compliant AI agent execution
├── think: LLM reasoning orchestration (SDK abstraction layer)
├── mcp-connector: Inbound MCP bridge — external agents → scoped Spine/Memory access
└── agent-registry: Catalog of available agents / integrations

Agent Tools (Capabilities):
├── analyze_metric, get_metric_data, get_recommendations
├── generate_forecast, compare_metrics, create_action_plan
└── get_department_health

A2A (Agent-to-Agent):
├── Status: Month-6 roadmap
├── Today: agents coordinate through shared Spine context via Twin
├── The Spine is the shared blackboard. No peer-to-peer calls.
└── Every agent reads/writes the same Spine, gated by tenant_id and JWT scope.
```

#### 3.6 Document References (Layer 3)

| Document                              | What It Covers                   | Why It Matters                                         |
| ------------------------------------- | -------------------------------- | ------------------------------------------------------ |
| `OODA-ARCHITECTURE.md`                | OODA loop operational rhythm     | Agents handle uncertainty. Pipelines handle certainty. |
| `CONTINUITY_BRIDGE_COMPLETE.md`       | Memory consolidation + lifecycle | The substrate that makes continuity possible.          |
| `MCP_ADK_SPINE_CACHE_ARCHITECTURE.md` | MCP, ADK, Spine, Cache design    | How external AI assistants connect to the Spine.       |
| `CORE_ENGINE_EXCAVATION.md`           | Core engine architecture         | The reasoning engine beneath the Twin.                 |
| `AGENTS.md`                           | Agent architecture (v3.8.0)      | Locked decisions 18–27. The constitutional law.        |
| `AI_AGENT_PROVIDER_ARCHITECTURE.md`   | AI/Agent provider abstraction    | Swappable AI providers without code changes.           |
| `docs/AI_INTEGRATION.md`              | AI integration patterns          | How AI services integrate into the platform.           |

---

### LAYER 4 — EXECUTION

_The "how work gets done" layer. Capabilities, Workflow, Governance, Integrations, Marketplace, and Plugin Runtime._

#### 4.1 The Capability Fabric

A Capability is a **named business action** with a strict contract:

```
Capability Contract:
├── name: "mark_lead_active" | "view_contact" | "update_field" | "log_activity" | "draft_outreach" | ...
├── input_schema: JSON Schema defining required/optional inputs
├── output_schema: JSON Schema defining expected outputs
├── required_spine_scopes: which Spine entities this capability needs access to
├── allowed_sync_modes: [soft, real, propose] — default per tenant
├── default_confidence_threshold: 0.70 | 0.85 | 0.94
├── default_governance_posture: auto | surface | gate
├── evidence_chain_template: how to cite sources for this capability's execution
└── audit_log_entry_shape: what gets logged when this capability executes
```

**Capability Invocation Surfaces:**

- Workbench (L1) — entity card buttons, list row actions
- Entity Twin Panel — Accept & act chip → capability invocation
- Twin chat (L3) — message.actions → capability invocation
- CLI (L4) — `iw capability <name> --context <entity>`
- Slack/Teams (Layer 8) — shortcut button → capability invocation
- Mobile (L1) — touch-target capability button

**One capability, every surface.**

#### 4.2 Three Sync Modes

| Mode                                              | Behaviour                                                                                                                                                                      | Default For                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **Soft sync** (write staging)                     | User acts → Spine written atomically → Connector Hub enqueues downstream → background worker reconciles. User sees result in seconds. Tool sees change when its adapter ticks. | Healthcare compliance, finance audit-trail, HR people records                           |
| **Real sync** (write-through)                     | User acts → Spine written AND source tool called via connector adapter → both succeed → commit logged. Failure triggers rollback + audit.                                      | Daily-use mutations (Sales activities, support tickets, message sends)                  |
| **Propose → Approve → Execute** (Twin governance) | Twin proposes → user approves → governance token minted → Spine AND source tool written in same transaction → audit-trail logged.                                              | High-stakes mutations (mark at-risk, change ownership, fire rollback, change comp band) |

**Per-Persona Sync Defaults:**

| Persona         | Soft                    | Real                        | Propose                                |
| --------------- | ----------------------- | --------------------------- | -------------------------------------- |
| Sales           | SFDC writes             | Activity logs               | "mark at-risk", "remove from forecast" |
| CS (Healthcare) | HIPAA-adjacent entities | Routine CS updates          | "mark renewal risk"                    |
| HR              | Comp band updates       | Skip-level calendar updates | Any "mark flight risk"                 |
| Eng             | Sprint status writes    | Incident acknowledgment     | Rollbacks, post-window deploys         |

#### 4.3 The Workflow Engine

```
Workflow Engine (Durable Orchestration):
├── Receives approved proposals from GOVERN
├── Resolves execution target (Slack, HubSpot, Gmail, etc.)
├── Prepares handoff (canonical JSON contract)
├── Stages in execution queue
├── Tracks execution state
├── Handles retries, idempotency, saga compensation
├── Receives execution feedback (via signals)
└── Emits events for observers
```

#### 4.4 Governance & Approval Gate

```
Governance Triage (Execution Gate):
├── Confidence ≥ 0.85 → Auto-approve → ACT_QUEUE → audit logged
├── Confidence 0.70–0.85 → Queue in My Desk → human review → audit logged
└── Confidence < 0.70 → Discard → audit logged

Even Customer-Zero cannot bypass hard approval-expiry gates.
Customer-Zero posture: Hermes native auto-execute (internal operations only).
External tenant posture: Async Handoff contract only (/api/v1/handoff/outcome, validated x-approval-token).
```

**Irreducible Human Agency:**

| Confidence | Posture                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| ≥ 0.85     | Auto-approve (low-risk) or surface with one-click approve (medium-risk) |
| 0.70–0.85  | Surface on My Desk — human reviews                                      |
| < 0.70     | Discarded                                                               |

The Twin is a reasoning layer that **proposes**. The human is the **decider**. Approval is mid-process, before execution. Tokens are mint-bound to tenant + action + scope + confidence + sync mode. Audit-trail is mandatory.

#### 4.5 Integration Architecture

```
Two-Plane Model:

Consumers → [API Gateway] → Spine (context) → [Integration Router] → Provider tools
             (North / Ingress)                (South / Egress)

North Plane (Ingress):
├── Gateway: Single entry point. JWT validation. Tenant routing. Rate-limiting. Capability routing.
├── Inbound MCP Pool: AI assistants (ChatGPT, Claude, Perplexity, Cursor) connect TO us.
└── Webhook Ingress: Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub...)

South Plane (Egress):
├── Integration Router: The ONLY service that touches external APIs.
├── Outbound MCP Pool: We connect TO provider MCP servers (Salesforce MCP, Slack MCP, GitHub MCP...)
├── Nango Adapters: OAuth-mature SaaS (Salesforce, HubSpot, Stripe)
├── Native Adapters: Direct REST for legacy / custom APIs
└── Entity360 Context Injection: Spine context injected before every outbound call

Rule: Neither plane talks to the other except through the Spine.
```

#### 4.6 Marketplace & Plugin Runtime

```
Marketplace:
├── Connector Listings: Pre-built integrations per persona
├── Plugin Listings: Custom capabilities uploaded by tenants or partners
├── Capability Registry: All capabilities discoverable via GET /api/v1/discovery
└── Template Library: Pre-built workflow templates per industry × department

Plugin Runtime:
├── Sandboxed execution environment
├── Capability contract validation
├── Schema validation (input/output)
├── Governance gate enforcement
└── Audit logging for all plugin executions
```

#### 4.7 Cross-Tool Field Composition (Canonical Example: Website Manager)

The Website Manager is **the canonical demonstration of cross-tool field fusion** inside one workbench surface. One persona (Lila / Marketing × Retail). One workbench surface. **Five tools' canonical state fused**, governed by the same Twin, capable of one-click inline actions.

| Surface Tile     | Composed From                                      |
| ---------------- | -------------------------------------------------- |
| Total Pages      | Sanity / Contentful + WordPress schema             |
| Monthly Visitors | Cloudflare Analytics + Plausible                   |
| SEO Health       | Ahrefs / Semrush + Search Console                  |
| Uptime           | StatusCake + Cloudflare health checks              |
| Traffic Chart    | GA4 + Plausible + UTM tools                        |
| Core Web Vitals  | PageSpeed + Search Console                         |
| Top Pages        | Sanity CMS + GA4                                   |
| Recent Edits     | Sanity + Ghost + Webflow                           |
| Posts List       | Notion drafts + Sanity published + Ghost scheduled |
| Asset Library    | ImageKit / DAM / Cloudinary                        |
| Campaigns        | Marketo / HubSpot + GA4 + Plausible                |

**The `schedule_blog_post` Capability — Composed Invocation:**

1. Read inputs across Notion, ImageKit, Buffer, HubSpot, Plausible
2. Brand compliance check — Twin compares draft to brand voice playbook
3. Brand gate failure? → Twin flags diff. User approves or bypasses.
4. Gather all writes into one orchestration plan
5. Approve once — single token mint
6. Atomic commit across all systems — single transaction, single audit entry
7. Capability complete — user sees in workbench view, all systems updated, audit logged

**Capabilities compose across tools. Workbench is capable. Persona-aware. Governed.**

#### 4.8 Document References (Layer 4)

| Document                         | What It Covers                  | Why It Matters                                            |
| -------------------------------- | ------------------------------- | --------------------------------------------------------- |
| `CAPABILITY_RESOLVER_PATTERN.md` | Capability resolution pattern   | How capabilities are discovered, validated, and executed. |
| `ONE_CONNECTOR_ARCHITECTURE.md`  | One Single Connector design     | The central nervous system of the platform.               |
| `AUTH_CONNECTOR_INTEGRATION.md`  | Auth ↔ Connector integration    | Identity → Approval → Connection → Full Access.           |
| `PLATFORM_DELIVERY.md`           | Platform delivery framework     | How capabilities are packaged and delivered.              |
| `FINAL_E2E_SYSTEM.md`            | End-to-end system specification | The complete physical topology (§1–27).                   |
| `WIRING_ROADMAP.md`              | Service wiring roadmap          | How the 26 services connect to each other.                |

---

### LAYER 5 — DATA

_The "what the system knows" layer. The Pipeline, Operational Spine, Ontology, Timeline, Evidence, and Audit._

#### 5.1 The Data Pipeline (8-Stage Normalizer)

```
Data Ingestion Pipeline:

Loader (S1) — Universal Intake Membrane
├── Receives webhooks from HubSpot, Salesforce, Slack, etc.
├── Enqueues raw events WITHOUT transformation
├── Tracks provenance (source system, timestamp, version)
└── Routes to normalizer queue
Key Invariant: Never reasons. Just intake + provenance.

Connector + Connector-Sync (S2)
├── OAuth/API auth to external systems
├── Webhook receiver for push-based integrations
├── Scheduled polling for pull-based integrations
├── Rate limiting + retry logic
└── Enqueues raw events to Normalizer

Normalizer (S3) — 8-Stage LLM-in-the-Loop Cognitive Pipeline
├── NA0 Intake: Deserialize raw event
├── NA1 Classification: Identify entity type (Contact, Account, Opportunity...)
├── NA2 Entity Resolution: LLM stage — match to canonical ID
├── NA3 Field Mapping: LLM stage — map tool fields to canonical schema
├── NA4 Validation: Check schema compliance
├── NA5 Enrichment: LLM stage — detect missing fields, suggest defaults
├── NA6 Deduplication: Check if entity already exists
└── NA7 Emission: Output as MCP tool call (not JSON)
Cost Model: LLM inference paid ONCE per entity, not per tool instance.

Pipeline (S4) — Entity Resolution + Spine Writes
├── Consumes normalized MCP calls
├── Resolves entity to canonical ID (creates new if needed)
├── Writes to D1 domain partitions (person_data, account_data, etc.)
├── Builds relationship graph
├── Triggers signal analysis
└── Enqueues to Continuity for memory consolidation
Key Invariant: All Spine writes proxied through Pipeline. Downstream workers cannot write directly.
```

#### 5.2 The Operational Spine (Adaptive Spine)

```
Spine Architecture:

Three-Spine Lifecycle:
├── Human Spine (L1 — Ground Truth): Goals, Outcomes, Decisions, Approvals
├── AI Spine (L3 — Intelligence Layer): Reasoning traces, Proposals, Signals, Confidence scores
└── Collaboration Spine (L2 — Joint Decision): Approvals, Feedback, Compound outcomes

Unified Lifecycle (all three):
INTAKE → PROMOTION → MEMORY → DECAY → CONTINUITY

Canonical Entity Types (18 core):
PERSON, ACCOUNT, OPPORTUNITY, TICKET, ACTIVITY, MESSAGE, DOCUMENT,
GOAL, WORKFLOW, SIGNAL, DECISION, APPROVAL, EXECUTION, OUTCOME,
ORGANIZATION, TEAM, RESOURCE, CUSTOM

Canonical Traits (18 core attributes):
external_id, name, email, phone, status, owner_id, created_at, updated_at,
source_system, confidence, tags, custom_fields, relationships, signals

Domain Partitions (12 logical domains):
CUSTOMER_SUCCESS: person, account, ticket, health_score
SALES: opportunity, activity, deal_stage, forecast
MARKETING: campaign, contact, engagement, lead_score
REVOPS: forecast, quota, territory, pipeline
FINANCE: invoice, expense, budget, forecast
[8+ more]

Relationship Graph:
├── person ← works-for → account
├── person ← owns → opportunity
├── account ← has → tickets
├── opportunity ← drives → forecast
└── (500+ relationship types indexed)
```

#### 5.3 Timeline & Evidence

```
Timeline:
├── Every entity has a timeline of all activities, mutations, and signals
├── Timeline is assembled on read from Spine (no materialized table)
├── Expensive reads are cached in KV (5-minute TTL)
└── Timeline powers the "what happened to this entity" view

Evidence:
├── Every claim has a `via` citation: "via Salesforce", "via Zendesk", "via Memory 3 weeks ago"
├── Evidence ribbons are rendered on every Twin response
├── Evidence is stored in the audit log with full request/response hash
└── Evidence is the difference between opinion and fact
```

#### 5.4 Audit & Observability

```
Audit Tables (Immutable, Fail-Loud):
├── audit_logs: Generic events (write failure → halt operation)
├── governance_audit_log: Approval decisions (write failure → halt operation)
├── spine_audit_log: Entity changes, MCP access, reads, writes (write failure → halt sync)
├── twin_audit_events: Reasoning trace, model calls, confidence scores (write failure → halt proposal)
└── outbound_mcp_calls: Provider calls, latency, errors (write failure → circuit break)

Rule: Audit write failure stops the sync. No silent drops.
```

#### 5.5 Document References (Layer 5)

| Document                                    | What It Covers                 | Why It Matters                                 |
| ------------------------------------------- | ------------------------------ | ---------------------------------------------- |
| `SPINE_CONNECTION_POOL_ARCHITECTURE.md`     | Spine connection pool design   | How the Spine handles concurrent access.       |
| `UNIVERSAL_CONNECTION_POOL_ARCHITECTURE.md` | Universal connection pool      | Connection management across all services.     |
| `MCP_ADK_SPINE_CACHE_ARCHITECTURE.md`       | MCP, ADK, Spine, Cache         | The four pillars of the data layer.            |
| `CANONICAL_STATE.md`                        | Canonical state implementation | How the Spine maintains canonical truth.       |
| `BACKEND_CONSOLIDATION_v1.0.md`             | Backend consolidation          | How the 28 workers consolidate into the Spine. |

---

### LAYER 6 — PLATFORM

_The "how the system runs" layer. Identity, Billing, Deployment, Security, Observability, SDKs, APIs, Testing, and Lifecycle._

#### 6.1 Identity & Access

```
Auth Model (Locked by DECISION 22):
├── API Keys (external consumers) + JWT (internal service bindings)
├── Same code path for both
├── Clerk / Stack Auth REMOVED — Descope is the canonical authorization authority (inbound identity + outbound connection authorization); Nango retained as dormant compatibility for providers Descope outbound does not support
├── JWT issued by Gateway, bound to tenant_id
├── x-tenant-id extracted from JWT claim ONLY (never from client payload, URL parameter, or header injection)
└── Service bindings carry tenant_id implicitly

RBAC:
├── Role-based access control per tenant + domain
├── Roles: owner, tam, account_success, admin, editor, viewer
├── Capabilities scoped to role
└── Row-level security (RLS) enforced at D1 layer

Multi-Tenancy (Hard Rules):
├── Every query carries WHERE tenant_id = ?
├── Cross-tenant access = security violation → 403 (fail-loud, not 404)
├── Nango credentials isolated per tenant: connectionId = tenant_id, encrypted in vault
├── Org is the hard isolation boundary. Sharing happens within an org across departments/lenses.
└── Gateway enforces x-tenant-id extraction from JWT. Never from client payload.
```

#### 6.2 Billing & Usage

```
Billing Service:
├── Tracks API calls, workers invoked, storage used
├── Computes monthly usage + billing
├── Manages subscription plans (free / pro / enterprise)
├── Enforces usage limits (rate limits, storage quotas, model quotas)
└── Usage logs stored in D1 (migrated from Supabase)
```

#### 6.3 Deployment

```
Environments:
├── dev → localhost (pnpm dev)
├── test → staging.integratewise.ai (pre-production)
└── prod → app.integratewise.ai (live)

Deployment Targets (100% Cloudflare):
├── Workers: All 26 services. Auto-scales horizontally. No cold starts.
├── Durable Objects: Stateful services (Twin, Hermes, Folder Watcher)
├── D1: Relational database (SQLite, auto-replicated, sub-10ms reads)
├── KV: Cache, registry, session store
├── R2: Blobs, telemetry, assets
├── Vectorize: Vector embeddings for semantic search
├── AI Search: Semantic search index
├── Queues: PIPELINE_QUEUE, ACT_QUEUE, CONNECTOR_SYNC_QUEUE
├── Workflows: Durable orchestration
├── Pages: Frontend (Vite + React + shadcn/ui)
└── WAF: DDoS protection, rate limiting

No Supabase. No Vercel. No AWS backend. No Neon PostgreSQL. DECISION 22 is complete.
```

#### 6.4 Security

```
Security Posture (P0 — Must Close Before Production):
├── Cross-tenant data leak: WHERE tenant_id = ? on every query; 403 fail-loud
├── Tenant-id spoofing: Extract from JWT only; reject client-provided
├── Tenant middleware no-op: Enforce gateway → all services binding includes tenant_id
├── HITL Durable Object collision: Use idFromName(`${tenant_id}:${user_id}`)
├── Invitation cross-tenant scan: Add WHERE tenant_id = ? to invitation lookup
├── Hardcoded secrets: Move to Cloudflare Secrets; rotate
├── .env committed: Remove from git; add to .gitignore; scan history
├── SQL injection: Use Drizzle ORM parameterized queries
├── MCP-JWT bypass: Require Authorization: Bearer <jwt>; verify signature
└── Auth root thrashing: Freeze on API Keys + JWT; remove all other auth imports

Hardening (Post-Production):
├── Billing migration to D1 + Workers billing
├── Gateway rate-limiter fail-closed (Cloudflare Rate Limiting)
├── CORS whitelist: app.integratewise.ai + Pages domains
├── Unsigned webhook verification
├── Webhook replay protection (idempotency keys)
├── Weak password hashing → Argon2id via Cloudflare Workers
└── Remove @supabase/supabase-js imports
```

#### 6.5 Observability

```
Telemetry Service:
├── Collects performance metrics from all workers
├── Logs errors to Sentry
├── Tracks service health
├── Emits to monitoring dashboard (Grafana)
└── Cloudflare Analytics for traffic, latency, error rates

Key Metrics:
├── P95 latency per worker
├── Error rate (5xx, 4xx)
├── Database query time
├── Memory usage (continuity lifecycle)
├── Approval SLA (target: <1min human review time)
├── LLM cost per entity (normalizer)
├── Connector sync health
└── Twin session count + engagement
```

#### 6.6 SDKs & APIs

```
SDKs:
├── @integratewise/sdk: Consumer facade (browser, server, mobile)
├── packages/api-client: Gateway SDK (internal)
├── packages/mcp-types: Shared MCP schemas
└── packages/twin-types: Shared Twin/ADK types

Public API Surface:
├── GET /api/v1/discovery: Capability handshake
├── POST /api/v1/handoff/outcome: Async external execution results
├── POST /api/v1/connector/nango/session: Initiate OAuth connection
├── GET /api/v1/{workspace,connector,intelligence,knowledge,cognitive,pipeline,admin,mcp}/*: Tiered capability routing
├── mcp.integratewise.ai/v1/mcp: MCP SSE transport
└── WebSocket /live: Real-time event stream
```

#### 6.7 Testing & Lifecycle

```
Testing Strategy:
├── Unit Tests: Each capability in isolation. Each facade method with mock capabilities.
├── Integration Tests: Facade + capabilities. Gateway endpoint. Frontend receiving projection.
├── Contract Tests: ProjectionDTO shape matches interface. Context filtering produces expected results.
├── E2E Tests: Full user journey (signup → onboarding → connect tool → view entity → Twin proposal → approve → execute)
└── Pre-deploy: pnpm preflight (install, typecheck, lint, test, build)

Lifecycle Management:
├── Semantic versioning for all capabilities
├── Capability deprecation policy (6-month notice)
├── Schema migration strategy (D1 migrations)
├── Feature flags for gradual rollout
└── Rollback capability for all deployments
```

#### 6.8 Document References (Layer 6)

| Document                           | What It Covers               | Why It Matters                               |
| ---------------------------------- | ---------------------------- | -------------------------------------------- |
| `GO_LIVE_DEPLOYMENT_GUIDE.md`      | Production deployment guide  | The checklist before going live.             |
| `DEPLOYMENT_ANALYSIS_FULL.md`      | Full deployment analysis     | Infrastructure requirements and costs.       |
| `DEPLOYMENT_FIX.md`                | Deployment fixes             | Known issues and their fixes.                |
| `DEPLOYMENT_SUMMARY.md`            | Deployment summary           | High-level deployment overview.              |
| `PROJECT_STATUS_AND_DEPLOYMENT.md` | Status + deployment tracking | Current status of all deployments.           |
| `VERCEL_DEPLOYMENT_STATUS.md`      | Vercel-specific status       | (Historical — Vercel retired by DECISION 22) |
| `REPO_CLEANUP_AUDIT.md`            | Repository cleanup audit     | What was cleaned, what remains.              |
| `REPO_STATE_AUDIT.md`              | Repository state audit       | Current state of the monorepo.               |

---

### LAYER 7 — INFRASTRUCTURE

_The "where it runs" layer. Cloudflare-native services._

#### 7.1 The 0–16 Stack (Physical Implementation)

| #   | Layer                       | Physical Services                                          | Data / Storage                                                 |
| --- | --------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| 0   | **Tenant Lifecycle**        | tenants, loader, admin                                     | D1 tenants table, tenant_spine_config                          |
| 1   | **Customer Ecosystem**      | connector, connector-sync, agent-registry                  | Nango tokens (vault), connectors table                         |
| 2   | **Surface Layer**           | apps/web (Vite), apps/mcp-server                           | Cloudflare Pages, R2 assets                                    |
| 3   | **Gateway Layer**           | gateway                                                    | N/A — pure routing                                             |
| 4   | **Identity & Organization** | tenants (SSO, RBAC)                                        | D1 rbac_roles, rbac_permissions                                |
| 5   | **Continuity Bridge**       | connector-sync, normalizer, mcp-connector, webhook-ingress | D1 sync_jobs, normalizer_state, KV Discovery cache             |
| 6   | **Adaptive Spine**          | pipeline                                                   | D1 (entities, relationships, SSOC), spine_audit_log            |
| 7   | **Context Assembly**        | intelligence, knowledge                                    | Vectorize (embeddings), AI Search (semantic), KV context cache |
| 8   | **Shared Memory**           | continuity, hermes                                         | D1 memory (active/staging/archived), KV memory decay           |
| 9   | **Capability Engine**       | iw-agent-runtime, think                                    | OpenRouter API (gpt-5-mini default), KV model config           |
| 10  | **Governance Layer**        | govern                                                     | D1 governance_audit_log, action_proposals                      |
| 11  | **Capability Runtime**      | hermes, workflow, act, mcp-connector                       | Durable Objects (stateful), Queues (ACT_QUEUE, PIPELINE_QUEUE) |
| 12  | **Projection Registry**     | l2, store                                                  | D1 projections, projection_registry                            |
| 13  | **Registry Layer**          | agent-registry, intelligence (catalog)                     | D1 capability_registry, endpoint_registry, KV registry cache   |
| 14  | **Continuity Engine**       | continuity, twin-orchestrator                              | D1 continuity_graph, KV session handoffs                       |
| 15  | **Data & Infrastructure**   | telemetry, folder-watcher                                  | D1 audit_logs, R2 (telemetry blobs), Workers Analytics         |
| 16  | **Endpoint Registry**       | gateway (serves), intelligence (updates)                   | KV + D1 endpoint_registry (living API contract)                |

#### 7.2 Service Topology (26 Workers)

```
Tier 0 — Ingress & Routing (2):
├── gateway: Single entry point; JWT validation; tenant routing; rate-limit
└── webhook-ingress: Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub...)

Tier 1 — Tenant & Sync (3):
├── tenants: Multi-tenant context resolution, tenant CRUD, SSO, plan limits
├── connector-sync: Orchestrates connector sync (fetch → Normalizer)
└── normalizer: 8-stage NA0–NA5 pipeline

Tier 2 — Projection & Rendering (8):
├── pipeline: ONLY writer to the Spine; product/eng domain renderer
├── twin-orchestrator: Persistent per-user AI reasoning engine (Durable Object)
├── l2: Department × industry overlay projections
├── intelligence: Analytics & insights renderer + signal generation
├── knowledge: Knowledge base, docs, semantic search
├── govern: Governance rules engine (approval gates, HITL thresholds)
├── store: Persistence for projections (accounts, deals, tasks)
└── act: Action execution / write-back to providers

Tier 3 — Capability Runtime & Orchestration (4):
├── hermes: Message queue + execution engine (Durable Object)
├── workflow: Durable orchestration (pause, retry, saga)
├── iw-agent-runtime: MCP-compliant AI agent execution
└── mcp-connector: MCP bridge — external agents → scoped Spine/Memory access

Tier 4 — Supporting (9):
├── agent-registry: Catalog of available agents/integrations
├── billing: Usage tracking + plan enforcement
├── admin: Platform admin (tenant mgmt, overrides)
├── loader: Cold-start pre-loader; Nango webhook handler
├── folder-watcher: Durable Object filesystem watcher
├── continuity: Memory consolidation + decay (the continuity substrate)
├── telemetry: Traces, metrics, observability
├── think: LLM reasoning orchestration
└── connector: OAuth callback handler (Nango)
```

#### 7.3 Cross-Cutting Infrastructure Concerns

```
Security: WAF, DDoS, TLS, CF Secrets, Zero Trust
Observability: Logs/metrics/traces/alerts/audit
Reliability: Idempotency, retries, DLQ, backpressure
Compliance: Audit & lineage, retention, field-level security, encryption, tenant isolation
```

#### 7.4 Document References (Layer 7)

| Document                                 | What It Covers               | Why It Matters                                             |
| ---------------------------------------- | ---------------------------- | ---------------------------------------------------------- |
| `SYSTEM_ARCHITECTURE.md`                 | System architecture (v3.8.0) | The complete 28-worker architecture (historical snapshot). |
| `ARCHITECTURE_DIAGRAMS.md`               | Architecture diagrams        | Visual diagrams of the system topology.                    |
| `ARCHITECTURE_VISUALIZATION_COMPLETE.md` | Visualization complete       | The visual architecture is locked.                         |
| `DIAGRAM_VERIFICATION.md`                | Diagram verification         | Verified diagrams against code.                            |
| `ARCHITECTURE_REFERENCE.md`              | Architecture reference       | Quick reference for all architecture decisions.            |
| `FINAL_E2E_SYSTEM.md`                    | End-to-end system (§1–27)    | The most comprehensive technical specification.            |
| `PIN_DISCOVERY_AND_WIRING_MAP.md`        | PIN discovery + wiring map   | How service bindings connect.                              |
| `REPOSITORY_ALIGNMENT.md`                | Repository alignment         | How code maps to architecture.                             |

---

### LAYER 8 — OPERATIONS

_The "how we keep it running" layer. CI/CD, monitoring, security, compliance, and incident response._

#### 8.1 CI/CD

```
CI/CD Pipeline (Target — GitHub Actions):
├── Trigger: Git push to main
├── Steps: Install → Typecheck → Lint → Test → Build → Deploy
├── Deploy: wrangler deploy for all 26 workers
├── Frontend: Cloudflare Pages auto-deploy on push
├── Rollback: Previous release tagged, can rollback in < 5 minutes
└── Semantic versioning: All releases tagged with version

Current Gap: No GitHub Actions gate today. Required: unified pipeline, pre-deploy test/typecheck, semantic versioning, rollback.
```

#### 8.2 Monitoring & Alerting

```
Observability Stack:
├── Sentry: Error tracking (all workers report errors)
├── Grafana: Metrics dashboards (P95 latency, error rates, throughput)
├── Cloudflare Analytics: Traffic, latency, error rates
├── Custom Telemetry Service: Worker-specific metrics
└── Alerting: PagerDuty integration for P0 incidents

Key SLAs:
├── Gateway P95 latency: < 100ms
├── D1 query time: < 10ms
├── Normalizer p99: < 2s
├── Approval SLA: < 1min human review time
├── Connector sync: < 60s for first sync after OAuth
└── Spine hydration: < 5min after onboarding complete
```

#### 8.3 Security Operations

```
Security Operations:
├── Vulnerability scanning: Weekly automated scans
├── Penetration testing: Quarterly external audits
├── Secret rotation: 90-day rotation for all API keys
├── Access review: Monthly access review for all admin accounts
├── Incident response: Defined runbooks for P0/P1/P2 incidents
└── Compliance: SOC 2 Type II (target Q4 2026), GDPR, HIPAA (for healthcare tenants)
```

#### 8.4 Backup & Disaster Recovery

```
Backup Strategy:
├── D1: Cloudflare-managed auto-replication (no manual backup needed)
├── R2: Versioned buckets (30-day retention)
├── KV: Snapshots before major deployments
├── Audit logs: Immutable, 7-year retention
└── Tenant data: Exportable via admin API

Disaster Recovery:
├── RPO: < 5 minutes (D1 replication lag)
├── RTO: < 15 minutes (worker redeploy + D1 failover)
├── Multi-region: Cloudflare automatically routes to nearest edge
└── Runbook: Documented DR procedures for all P0 scenarios
```

#### 8.5 Document References (Layer 8)

| Document                             | What It Covers              | Why It Matters                                      |
| ------------------------------------ | --------------------------- | --------------------------------------------------- |
| `docs/operations/`                   | Operations documentation    | Deployment, monitoring, incident response runbooks. |
| `FOLDER_MONITOR_SETUP.md`            | Folder monitor setup        | Local filesystem monitoring bridge.                 |
| `QUICKSTART_PREVIEW_AND_TESTS.md`    | Quickstart + tests          | How to get started and run tests.                   |
| `HANDOFF_ACCEPTANCE.md`              | Handoff acceptance criteria | What "done" means for each phase.                   |
| `CUSTOMER_ZERO_LAUNCH.md`            | Customer Zero launch plan   | The first real tenant's journey.                    |
| `RECOVERY_PLAN_EXECUTIVE_SUMMARY.md` | Recovery plan               | How to recover from critical failures.              |
| `INTEGRATEWISE_RECOVERY_PLAN.md`     | Full recovery plan          | Detailed recovery procedures.                       |

---

### LAYER 9 — EVOLUTION

_The "how we change" layer. Testing, lifecycle management, versioning, and controlled evolution._

#### 9.1 Testing Architecture

```
Testing Layers:
├── Unit: Individual capabilities, facades, utilities
├── Integration: Service-to-service interactions
├── Contract: API shape guarantees
├── E2E: Full user journey (signup → onboarding → connect → act → approve → execute)
├── Load: Capacity testing for peak usage
├── Chaos: Fault injection (random worker failures, latency spikes)
└── Security: Penetration testing, vulnerability scanning

Test Coverage Targets:
├── Capabilities: 100% coverage
├── Facades: 100% coverage
├── Gateway: 100% coverage
├── Data layer: 90% coverage
└── UI components: 80% coverage
```

#### 9.2 Lifecycle Management

```
Capability Lifecycle:
├── Experimental: Available to internal tenants only
├── Beta: Available to opt-in tenants
├── GA: Available to all tenants (default)
├── Deprecated: Still works, 6-month sunset notice
└── Retired: Removed from Discovery, no longer callable

Schema Lifecycle:
├── v1.0: Initial schema (locked after first tenant)
├── v1.1: Additive changes only (new fields, new entities)
├── v2.0: Breaking changes (requires migration, coordinated with all consumers)
└── Migration: Automated D1 migration scripts, tested against production clone

Feature Flags:
├── Per-tenant: Enable features for specific tenants
├── Per-role: Enable features for specific roles
├── Per-plan: Gate features by subscription tier
└── Gradual rollout: 1% → 5% → 25% → 100% of tenants
```

#### 9.3 Versioning & Controlled Evolution

```
Versioning Strategy:
├── Semantic versioning for all services (major.minor.patch)
├── API versioning: /api/v1/ → /api/v2/ (major versions only)
├── Capability versioning: capability_name@version
├── SDK versioning: @integratewise/sdk@major.minor.patch
└── Schema versioning: tenant_spine_config.schema_version

Controlled Evolution:
├── No breaking changes without 6-month notice
├── All changes tested in staging before production
├── Canary deployments for high-risk changes
├── Rollback capability for all deployments
└── Architecture Decision Records (ADRs) for all major changes
```

#### 9.4 The HOME Model (Platform Evolution)

```
HOME Lifecycle:
├── Have: Foundation (SDK, services, schema)
├── Own: User control (RBAC, workspace customization)
├── Maintain: Ongoing operations (compliance, audits, governance)
├── Learn: Feedback loops (memory, signals, patterns from OODA cycles)
└── Evolve: Adaptation (capability discovery, agent learning, preference refinement)

Each HITL cycle generates data that feeds back:
├── Observe data → Signals (anomaly patterns, priorities)
├── Orient data → Knowledge (semantic learning) + Memory (context models)
├── Decide data → Governance (approval decisions, risk calibration)
├── Act data → Execution (success rates, fallback effectiveness)
└── Learn data → Agent models (outcome-based decision refinement)

The next HITL cycle benefits from this learning. The platform adapts to the user's needs as they learn.
```

#### 9.5 Document References (Layer 9)

| Document                           | What It Covers           | Why It Matters                            |
| ---------------------------------- | ------------------------ | ----------------------------------------- |
| `PHASE_1_COMPLETE.md`              | Phase 1 completion       | What was delivered in phase 1.            |
| `PHASE_1_EXECUTION.md`             | Phase 1 execution        | How phase 1 was executed.                 |
| `PHASE_2A_COMPLETE.md`             | Phase 2A completion      | Projection Engine + Gateway SDK.          |
| `PHASE_2C_COMPLETE.md`             | Phase 2C completion      | Continuity Bridge + Memory.               |
| `PLATFORM_ACTIVATION_FRAMEWORK.md` | Platform activation      | How the platform evolves per tenant.      |
| `CLEANUP_SUMMARY.md`               | Cleanup summary          | What was cleaned up and why.              |
| `MERGE_SUMMARY_FROM_MAIN.md`       | Merge summary            | How the main branch was consolidated.     |
| `INTEGRATION_REMOVAL_PLAN.md`      | Integration removal      | What integrations were removed and why.   |
| `PRODUCT_MAPPING_RECOVERY.md`      | Product mapping recovery | How product features map to capabilities. |
| `REPOSITORY_SUMMARY.md`            | Repository summary       | High-level repository overview.           |

---

## Part III: The Golden Flow — From Login to Business Outcome

This is the complete user journey, traced through all 9 layers. Follow Maya (Sales × SaaS) from her first login to her first closed deal.

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 1: IDENTITY (Layer 1 + Layer 6)                              │
│  Maya clicks "Sign in with Google" on integratewise.ai              │
├─────────────────────────────────────────────────────────────────────┤
│  1. OAuth provider authenticates Maya                               │
│  2. Gateway issues JWT with tenant_id claim                         │
│  3. Schema-generation AI (gpt-5-mini) hydrates tenant on first auth │
│  4. Tenant init: D1 partition, tenant_spine_config, RBAC, billing  │
│  5. Onboarding wizard begins (7 steps)                              │
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 2: ONBOARDING (Layer 1 + Layer 4)                          │
│  Maya completes the 7-step onboarding wizard                        │
├─────────────────────────────────────────────────────────────────────┤
│  Step 0: Usage Type → "work"                                        │
│  Step 1: Industry → "Technology / SaaS"                             │
│  Step 2: Department → "Sales", SubRole → "Account Executive"        │
│  Step 3: Company Size → "51-200"                                    │
│  Step 4: Connectors → Salesforce, HubSpot, Slack, Gmail, Calendar   │
│  Step 5: Desired Outcome → "insights"                               │
│  Step 6: Workspace Name → "Acme Sales"                                │
│                                                                      │
│  Result: tenant_spine_config committed. Persona = Maya (Sales × SaaS)│
│  Spine projection: Sales entity vocabulary, KPIs, connectors, greeting│
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 3: CONNECTION (Layer 4 + Layer 5)                          │
│  Maya connects Salesforce                                           │
├─────────────────────────────────────────────────────────────────────┤
│  1. Frontend: POST /api/v1/connector/nango/session + x-tenant-id  │
│  2. Gateway → Connector: Creates Nango session token               │
│  3. Nango: OAuth popup → Maya authorizes Salesforce               │
│  4. Loader: Receives auth.created webhook → triggers creamy sync    │
│  5. Connector-sync: Fetches raw Salesforce records                   │
│  6. Normalizer: 8-stage pipeline → canonical entities              │
│  7. Pipeline: ONLY writer → D1 entities + relationships + audit log │
│                                                                      │
│  Target: signup → workspace < 5 min; first tool connected < 10 min   │
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 4: WORKBENCH (Layer 2)                                       │
│  Maya opens her Sales Workbench for the first time                  │
├─────────────────────────────────────────────────────────────────────┤
│  1. Frontend calls GET /api/v1/discovery                             │
│  2. Gateway returns: identity, workspace, projections, capabilities │
│  3. Projection Engine assembles WorkspaceProjection               │
│     ├── Overview: health_score, metrics, KPIs                       │
│     ├── Execution: tasks, workflows, pending_count                   │
│     ├── Intelligence: signals, insights, recommendations            │
│     ├── Collaboration: activity, recent_count                      │
│     └── Search: enabled, placeholder, suggestions                 │
│  4. Frontend renders using Design System + Projection Manifest      │
│  5. Maya sees: Pipeline, Accounts, Opportunities, Activities, Forecast│
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 5: INTELLIGENCE (Layer 3)                                    │
│  The Twin observes Maya's data and surfaces insights                 │
├─────────────────────────────────────────────────────────────────────┤
│  1. Intelligence service scans Spine for anomalies                  │
│  2. Signal detected: "Skyline Corp — deal stage Negotiation,         │
│     last activity 8 days ago, VP Eng asked about SOC 2, no reply"    │
│  3. Signal routed to L2 Cognitive Overlay (Observe + Orient)       │
│  4. Maya sees the signal in the Signals Panel without asking         │
│  5. Maya clicks the signal → Entity 360 view of Skyline Corp      │
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 6: TWIN INTERACTION (Layer 3)                              │
│  Maya opens Twin chat and asks about Skyline                        │
├─────────────────────────────────────────────────────────────────────┤
│  1. Activation gate: memory_records.total = 47 (passes)            │
│  2. Context assembly (parallel):                                     │
│     ├── aiSearch: CRM field schema, deal-stage playbooks            │
│     ├── conversationalSearch: Maya's last 14 days of chat             │
│     ├── mcpSearch: Salesforce, HubSpot, Slack, Gmail records        │
│     └── DO warm: Maya's last 10 conversation turns                  │
│  3. System prompt constructed with Maya's learned profile            │
│     "Terse. Action-oriented. Inline next step. No preamble."       │
│  4. LLM inference (gpt-5-mini via OpenRouter)                      │
│  5. Twin responds with evidence, confidence, and action chips         │
│                                                                      │
│  "Should I move Skyline to Stage 4?"                                 │
│                                                                      │
│  "I am not sure. Here is what I have.                               │
│   CRM: stage = Negotiation, last activity 8 days ago.              │
│   Slack: VP Eng asked about SOC 2 Tuesday. No reply yet.           │
│   Email: CFO replied 11:42 PM with one open question.                │
│   Memory: You moved 4 deals to Stage 4 in Q3. In 3/4, CFO signed off.│
│                                                                      │
│   Recommended action (confidence 0.74):                              │
│   1. Reply to CFO's deployment timeline question.                      │
│   2. After CFO replies, move to Stage 4 with soft SOC 2 follow-up.  │
│                                                                      │
│   Chips: [Approve / Revise / Discard]"                               │
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 7: GOVERNANCE (Layer 4)                                      │
│  Maya approves the proposal                                         │
├─────────────────────────────────────────────────────────────────────┤
│  1. Maya clicks "Approve" on the Twin's proposal chip                 │
│  2. Governance token minted: tenant + action + scope + confidence    │
│  3. Proposal queued in ACT_QUEUE                                    │
│  4. Audit logged: governance_audit_log entry created               │
│  5. Confidence = 0.74 (0.70–0.85 range) → routed to My Desk first  │
│     (Wait — in this case, Maya approved directly, so it proceeds)   │
│  6. Workflow engine receives approved proposal                      │
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 8: EXECUTION (Layer 4 + Layer 5)                             │
│  The approved action executes across systems                        │
├─────────────────────────────────────────────────────────────────────┤
│  1. Workflow engine: resolves target = Salesforce + Email            │
│  2. Act service: prepares handoff contract                           │
│  3. Integration Router: injects Entity360 context                    │
│  4. Outbound MCP Pool: calls Salesforce adapter + Gmail adapter      │
│  5. Real sync: Spine written AND Salesforce updated atomically       │
│  6. Writeback: Outcome written to Spine                             │
│  7. Memory: This interaction compounds into Organizational Memory   │
│  8. Signal: New signal generated → "Maya moved Skyline to Stage 4"   │
│  9. Audit: Complete trail logged (actor, timestamp, reasoning, outcome)│
└─────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 9: CONTINUITY (Layer 3)                                      │
│  The system learns from Maya's decision                             │
├─────────────────────────────────────────────────────────────────────┤
│  1. Twin chat session: warm-turns stored in DO SQLite                │
│  2. Memory Intake: observation queued → "Maya approved Stage 4   │
│     move for Skyline at confidence 0.74 after CFO reply"             │
│  3. Triage Bot: classifies as [sales:decision], scores confidence  │
│  4. Evolution Engine: pattern candidate → "CFO reply → Stage 4"     │
│  5. Promotion Queue: entry created, confidence 0.81, 4 accounts    │
│  6. Maya (or admin) approves pattern in Promotion Queue             │
│  7. Organizational Memory: "Pattern: CFO reply → Stage 4 move"    │
│  8. Next time Maya asks about a similar deal, Twin knows this pattern│
└─────────────────────────────────────────────────────────────────────┘
```

**Result:** Maya closed a deal faster because the system:

1. **Observed** her data without her asking
2. **Oriented** the signal into a meaningful insight
3. **Decided** to propose a specific action with evidence
4. **Acted** only after she approved
5. **Learned** from her decision to help her next time

**That is the IntegrateWise operating system.**

---

## Part IV: The Five Core Engines — How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 1: BUSINESS ONTOLOGY                                │
│  The "what the business is" engine                          │
│  ─────────────────────────────────────                      │
│  Determines: Entity types, relationships, activities,       │
│  signals, decisions, KPIs, compliance rules                  │
│  Driven by: Persona Matrix (12 × 11 = 132 variants)         │
│  Output: tenant_spine_config.schema_version                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 2: OPERATIONAL SPINE                                │
│  The "what the system knows" engine                          │
│  ─────────────────────────────────────                      │
│  Stores: Canonical entities, relationships, audit logs,       │
│  timeline, evidence, memory                                   │
│  Driven by: Pipeline (sole writer), Normalizer (8-stage)     │
│  Output: D1 entities + relationships + spine_audit_log     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 3: CAPABILITY FABRIC                                │
│  The "what the system can do" engine                        │
│  ─────────────────────────────────────                      │
│  Defines: Named capabilities with schemas, sync modes,       │
│  governance, evidence, audit templates                        │
│  Driven by: Capability Registry + Integration Router         │
│  Output: GET /api/v1/discovery response                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 4: CONTINUITY ENGINE                                │
│  The "what the system remembers" engine                     │
│  ─────────────────────────────────────                      │
│  Manages: Memory intake, triage, evolution, promotion,       │
│  decay, organizational memory, knowledge base                 │
│  Driven by: Continuity service + Hermes + Triage Bot        │
│  Output: Active memory, staging memory, archived memory      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ENGINE 5: WORKSPACE OS                                     │
│  The "what users see and do" engine                         │
│  ─────────────────────────────────────                      │
│  Renders: Projections, workbenches, Twin chat, signals,     │
│  approvals, memory, knowledge                                 │
│  Driven by: Projection Engine + Three Pillars + Design System│
│  Output: The user experience                                 │
└─────────────────────────────────────────────────────────────┘
```

**The Five Engines are not sequential. They are concurrent, interdependent, and self-reinforcing.**

- The **Business Ontology** shapes the **Spine** (what entities exist)
- The **Spine** feeds the **Capability Fabric** (what can be done with those entities)
- The **Capability Fabric** generates actions that the **Continuity Engine** remembers
- The **Continuity Engine** enriches the **Spine** with meaning (memory compounds)
- The **Workspace OS** renders all of the above into a coherent human experience

---

## Part V: The Three Foundational Assets

```
┌─────────────────────────────────────────────────────────────┐
│  TRUTH                                                        │
│  ─────────────────────────────────────                      │
│  Operational Spine (what IS)                                  │
│  Business Ontology (what EXISTS)                              │
│  Timeline (what HAPPENED)                                   │
│  Evidence (what PROVES it)                                    │
│  Audit Trail (what was DECIDED)                             │
│  The organization owns its truth. The system preserves it.  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ACTION                                                       │
│  ─────────────────────────────────────                      │
│  Capability Fabric (what CAN be done)                         │
│  Workflow Engine (how it's ORCHESTRATED)                    │
│  Governance Gate (who APPROVES it)                          │
│  Integration Router (where it GOES)                         │
│  The system proposes. The human decides. The system executes.│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  INTELLIGENCE                                                 │
│  ─────────────────────────────────────                      │
│  Continuity Engine (what the system REMEMBERS)              │
│  Twin Runtime (what the system REASONS)                   │
│  Memory & Knowledge (what the system KNOWS)                 │
│  Signals & Insights (what the system NOTICES)               │
│  AI is rented. Memory is owned. Intelligence compounds.     │
└─────────────────────────────────────────────────────────────┘
```

---

## Part VI: The Complete Document Cross-Reference

This section maps every architecture document to the layer it serves and the question it answers.

### Business Layer (Layer 1) Documents

| #   | Document                              | Question It Answers             | Key Decisions                    |
| --- | ------------------------------------- | ------------------------------- | -------------------------------- |
| 1   | `INTEGRATED_VISION.md`                | Why does IntegrateWise exist?   | "Nothing is lost in context."    |
| 2   | `CANON.md`                            | What is the canonical truth?    | Document index, locked decisions |
| 3   | `PLATFORM_ACTIVATION_FRAMEWORK.md`    | How does the platform activate? | Onboarding → hydration → value   |
| 4   | `ONBOARDING_API_CONTRACT.md`          | How do users onboard?           | 7-step wizard, persona matrix    |
| 5   | `packages/config/persona-matrix.json` | Who are the users?              | 12 × 11 = 132 persona variants   |

### Experience Layer (Layer 2) Documents

| #   | Document                        | Question It Answers              | Key Decisions                      |
| --- | ------------------------------- | -------------------------------- | ---------------------------------- |
| 6   | `THREE_PILLARS_ARCHITECTURE.md` | How do frontends work?           | Manifest + SDK + Design System     |
| 7   | `PROJECTION_OS_ARCHITECTURE.md` | How are projections built?       | FacadeRegistry, 8 lens types       |
| 8   | `CANONICAL_ARCHITECTURE.md`     | How does thesis map to code?     | Frozen contracts, capability-first |
| 9   | `FEATURE_MAP.md`                | What features exist?             | Feature inventory, roadmap         |
| 10  | `REPOSITION_MAP.md`             | How do components map to layers? | UI layer model                     |

### Intelligence Layer (Layer 3) Documents

| #   | Document                              | Question It Answers           | Key Decisions                           |
| --- | ------------------------------------- | ----------------------------- | --------------------------------------- |
| 11  | `OODA-ARCHITECTURE.md`                | How does the system think?    | OODA loop, agents vs pipelines          |
| 12  | `CONTINUITY_BRIDGE_COMPLETE.md`       | How does memory work?         | 7-stage lifecycle, continuity substrate |
| 13  | `MCP_ADK_SPINE_CACHE_ARCHITECTURE.md` | How do AI assistants connect? | MCP pools, ADK runtime, Spine cache     |
| 14  | `CORE_ENGINE_EXCAVATION.md`           | What is the core engine?      | Reasoning engine, signal generation     |
| 15  | `AGENTS.md`                           | What are the agents?          | v3.8.0, locked decisions 18–27          |
| 16  | `AI_AGENT_PROVIDER_ARCHITECTURE.md`   | How is AI swappable?          | 24 provider combinations                |
| 17  | `docs/AI_INTEGRATION.md`              | How does AI integrate?        | AI integration patterns                 |

### Execution Layer (Layer 4) Documents

| #   | Document                         | Question It Answers            | Key Decisions                    |
| --- | -------------------------------- | ------------------------------ | -------------------------------- |
| 18  | `CAPABILITY_RESOLVER_PATTERN.md` | How are capabilities resolved? | Discovery, validation, execution |
| 19  | `ONE_CONNECTOR_ARCHITECTURE.md`  | What is the central connector? | One Single Connector, Spine API  |
| 20  | `AUTH_CONNECTOR_INTEGRATION.md`  | How does auth connect?         | Identity → Approval → Connection |
| 21  | `PLATFORM_DELIVERY.md`           | How is the platform delivered? | Capability packaging, deployment |
| 22  | `FINAL_E2E_SYSTEM.md`            | How does the full system work? | 26 services, 0-16 stack, §1-27   |
| 23  | `WIRING_ROADMAP.md`              | How do services connect?       | Service binding map, wiring plan |

### Data Layer (Layer 5) Documents

| #   | Document                                    | Question It Answers               | Key Decisions                   |
| --- | ------------------------------------------- | --------------------------------- | ------------------------------- |
| 24  | `SPINE_CONNECTION_POOL_ARCHITECTURE.md`     | How does the Spine handle load?   | Connection pool, partitioning   |
| 25  | `UNIVERSAL_CONNECTION_POOL_ARCHITECTURE.md` | How do all connections work?      | Universal pool, failover        |
| 26  | `CANONICAL_STATE.md`                        | What is the canonical state?      | Implementation status vs thesis |
| 27  | `BACKEND_CONSOLIDATION_v1.0.md`             | How was the backend consolidated? | 28 workers → unified mesh       |

### Platform Layer (Layer 6) Documents

| #   | Document                           | Question It Answers            | Key Decisions          |
| --- | ---------------------------------- | ------------------------------ | ---------------------- |
| 28  | `GO_LIVE_DEPLOYMENT_GUIDE.md`      | How do we go live?             | Production checklist   |
| 29  | `DEPLOYMENT_ANALYSIS_FULL.md`      | What infrastructure is needed? | Requirements, costs    |
| 30  | `PROJECT_STATUS_AND_DEPLOYMENT.md` | What is the current status?    | Status tracking        |
| 31  | `REPO_CLEANUP_AUDIT.md`            | What was cleaned up?           | Cleanup decisions      |
| 32  | `REPO_STATE_AUDIT.md`              | What is the repo state?        | Current monorepo state |

### Infrastructure Layer (Layer 7) Documents

| #   | Document                   | Question It Answers              | Key Decisions                 |
| --- | -------------------------- | -------------------------------- | ----------------------------- |
| 33  | `SYSTEM_ARCHITECTURE.md`   | What is the system architecture? | 28 workers, 3-spine lifecycle |
| 34  | `ARCHITECTURE_DIAGRAMS.md` | What does the system look like?  | Visual diagrams               |
| 35  | `FINAL_E2E_SYSTEM.md`      | What is the complete spec?       | §1-27, most comprehensive doc |

### Operations Layer (Layer 8) Documents

| #   | Document                             | Question It Answers                 | Key Decisions       |
| --- | ------------------------------------ | ----------------------------------- | ------------------- |
| 36  | `CUSTOMER_ZERO_LAUNCH.md`            | How do we launch to first customer? | Customer Zero plan  |
| 37  | `RECOVERY_PLAN_EXECUTIVE_SUMMARY.md` | How do we recover from failures?    | Recovery procedures |
| 38  | `HANDOFF_ACCEPTANCE.md`              | What is "done"?                     | Acceptance criteria |

### Evolution Layer (Layer 9) Documents

| #   | Document                           | Question It Answers           | Key Decisions                   |
| --- | ---------------------------------- | ----------------------------- | ------------------------------- |
| 39  | `PHASE_1_COMPLETE.md`              | What was phase 1?             | Phase 1 deliverables            |
| 40  | `PHASE_2A_COMPLETE.md`             | What was phase 2A?            | Projection Engine + Gateway SDK |
| 41  | `PHASE_2C_COMPLETE.md`             | What was phase 2C?            | Continuity Bridge + Memory      |
| 42  | `PLATFORM_ACTIVATION_FRAMEWORK.md` | How does the platform evolve? | Activation per tenant           |
| 43  | `PRODUCT_MAPPING_RECOVERY.md`      | How do features map?          | Feature → capability mapping    |

---

## Closing Principles

1. **One Spine, Many Projections.** All UI surfaces are views of the same Spine. No duplication. No drift.
2. **Never Reason at Intake.** Data enters raw. Transformation paid once per entity in the Normalizer.
3. **No Execution Without Approval.** Every action is governance-gated. Every approval is audit-logged.
4. **Tenant Isolation is Absolute.** Every query includes `WHERE tenant_id = ?`. Cross-tenant access is a 403.
5. **Audit Everything.** All actions logged with actor, timestamp, reasoning, outcome. Audit failure halts the operation.
6. **Continuity Over Asking.** The Twin never re-asks for context already established.
7. **Truth You Own. AI You Rent. Approval In Between.** The organization owns its data. AI proposes. Humans decide.
8. **Context You Own. AI You Rent. Approval In Between.** The organization owns its context. AI assists. Humans approve.
9. **Human Workbench is Primary.** AI is infrastructure, not the product. The workbench is where work happens.
10. **Nothing Important Is Forgotten.** That is the product. That is the moat. That is why IntegrateWise exists.

---

## Appendix: Document Authority & Versioning

| Field           | Value                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Document**    | IntegrateWise Enterprise Architecture                                                           |
| **Version**     | 1.0.0                                                                                           |
| **Date**        | 2026-07-06                                                                                      |
| **Status**      | FINAL                                                                                           |
| **Authority**   | Nirmal Prince J (Founder/CEO) + Engineering Team                                                |
| **Scope**       | 9-layer enterprise architecture, 5 core engines, 3 foundational assets, 43 referenced documents |
| **Supersedes**  | All previous "Platform Architecture" documents (those are the territory; this is the map)       |
| **Next Review** | Quarterly or after major architectural decisions (DECISION 28+)                                 |
| **Repository**  | https://github.com/NirmalPrinceJ/integratewise-live                                             |
| **Product**     | IW Continuity Bridge                                                                            |
| **Category**    | The Operational Continuity Platform                                                             |

---

_This document is the map. The 43 architecture documents are the territory. The code is the ground truth. When they disagree, the code wins — and this document is updated._
