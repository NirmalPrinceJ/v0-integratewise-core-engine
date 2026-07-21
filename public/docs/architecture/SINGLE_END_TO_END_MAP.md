# Single End-to-End Map of the IntegrateWise System

> Synthesized from the canonical repo docs (`CANON`, `CANONICAL_STATE`, `SERVICE_INVENTORY`, `canonical-architecture`, `ecosystem-thesis`, `contract-discovery`, `TOOL_CONNECTION_FLOW`, `ARCHITECTURE_DIAGRAMS`, `GTM_MOTION`, `AI_INTEGRATION`, `DEPLOYMENT_SETUP`, `FOLDER_MONITOR_SETUP`, `PIPELINE_SERVICE_AUDIT`, `README`). Where sources disagree, the conflict is flagged rather than smoothed over — see **§14**.

---

## 0. Thesis & doctrine

**Product:** IW Continuity Bridge — an organizational continuity ecosystem that preserves identity, context, memory, governance, and execution across all consumers (humans, AI, apps, tools) through one stable continuity contract.

**Doctrine:** _Truth you own. AI you rent. Approval in between._

- Canonical truth belongs to the ecosystem (the Spine).
- AI is a replaceable reasoning layer.
- Governance sits between reasoning and execution.

**Naming rule (DECISION 23):** it is a _Continuity Bridge_ — explicitly **not** an OS, **not** a platform, **not** a tool. "Knowledge workspace" is an allowed descriptor, not the name.

---

## 1. Architecture law (the 4 layers)

```
Consumers  ↔  Continuity Bridge  ↔  Continuity Kernel  ↔  Provider Fabric
```

- **Consumers** — humans, AI agents, apps, tools. Thin surfaces.
- **Continuity Bridge** — the public interface / the moat: identity, authentication, discovery, projection, capability routing, governance entry, event routing.
- **Continuity Kernel** — the internal truth substrate: Adaptive Spine, Memory, Knowledge, Context, Capability Engine, Governance, Workflow, Continuity Engine.
- **Provider Fabric** — replaceable external execution: SaaS providers, databases, APIs, queues, agents, runtimes. Not part of the public contract.

> Consumers never import internal service topology. They see only Identity, Discovery, Projections, Capabilities, and Events.

---

## 2. The LOOP (how any action flows)

```
Observe → Understand → Propose → Govern → Execute → Writeback → Evidence Return → Remember → Organize → Learn
```

Every consumer interaction resolves through five public concepts:

1. **Identity** — who are you?
2. **Discovery** — what exists / what can I do?
3. **Projections** — persona-specific views (Desk, Entity360, Executive, Twin, etc.)
4. **Capabilities** — named business actions (Analyze Account, Draft Email, …)
5. **Events** — Signal, Proposal, Approval, Outcome, Stream.

---

## 3. Service inventory — 26 product services

All services run on every deployment and serve **all tenants**. Customer-Zero is a _tenant class_, not a separate service.

### Tier 0 — Ingress & routing

| Service             | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| **gateway**         | Single entry point; JWT validation; tenant routing                  |
| **webhook-ingress** | Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub, …) |

> **Ingress clarification (owner):** **AI connectors are the _primary_ ingress class — specifically the AI assistants themselves: Claude, ChatGPT, Perplexity, and similar.** They connect _to_ IntegrateWise over **MCP** (`mcp.integratewise.ai`; the inbound direction in §19.4) and are the lead front-door clients — the primary way people and context reach the Spine. Traditional SaaS/webhook connectors (Salesforce, Slack, Stripe, GitHub, …) feed the _same_ normalization pipeline but are the **secondary/complementary** feed. The ingress layer is designed **AI-assistant-first**.

> ⚠️ **Two different "AI" things — don't conflate:** the _ingress connectors_ are AI **assistant clients** (Claude, ChatGPT, Perplexity) talking _to_ us via MCP; the internal LLM **API providers** (OpenAI / Anthropic / Google / OpenRouter) that power the Twin's reasoning are _model providers_, not ingress connectors. Reflect the ordering in §20.1 (make AI assistants the lead ecosystem category, ahead of SaaS) and in the connector/registry taxonomy (§13). This also raises the stakes on the §15 **MCP-JWT P0**: if AI assistants are the primary front door, that door must be locked first.

| Service            | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| **tenants**        | Multi-tenant context resolution, tenant CRUD, SSO, plan limits |
| **connector-sync** | Orchestrates connector sync (fetch → Normalizer → Triage)      |
| **normalizer**     | Transforms connector payloads → Spine schema (NA0–NA5)         |

### Tier 2 — Projection & rendering

| Service               | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| **pipeline**          | Only writer to the Spine; product/eng domain renderer     |
| **twin-orchestrator** | Persistent per-user AI reasoning engine (Twin)            |
| **l2**                | Department × industry overlay projections                 |
| **intelligence**      | Analytics & insights renderer + signal generation         |
| **knowledge**         | Knowledge base, docs, semantic search                     |
| **govern**            | Governance rules engine (approval gates, HITL thresholds) |
| **store**             | Persistence for projections (accounts, deals, tasks)      |
| **act**               | Action execution / write-back to providers                |

### Tier 3 — Capability runtime & orchestration

| Service              | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| **hermes**           | Message queue + execution engine (Durable Object)        |
| **triage**           | Confidence routing + active-memory decay (inside hermes) |
| **workflow**         | Durable orchestration (pause, retry, saga)               |
| **iw-agent-runtime** | MCP-compliant AI agent execution (gpt-5-mini default)    |
| **mcp-connector**    | MCP bridge: external agents → scoped Spine/Memory access |

### Tier 4 — Supporting

| Service            | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| **agent-registry** | Catalog of available agents/integrations                     |
| **billing**        | Usage tracking + plan enforcement                            |
| **admin**          | Platform admin (tenant mgmt, overrides)                      |
| **loader**         | Cold-start pre-loader; Nango webhook handler                 |
| **folder-watcher** | Durable Object filesystem watcher                            |
| **continuity**     | Memory consolidation + decay (the continuity substrate)      |
| **telemetry**      | Traces, metrics, observability                               |
| **think**          | LLM reasoning orchestration (separate from iw-agent-runtime) |
| **connector**      | OAuth callback handler (Nango)                               |

All 26 are wired into the gateway as service bindings.

---

## 4. End-to-end: connecting the first tool (Nango → Spine → Twin → Approval)

1. **Frontend** — user clicks "Connect Salesforce" → `POST /api/v1/connector/nango/session` (with `x-tenant-id`).
2. **connector** — creates a Nango session token (`connectionId = tenant_id`, one connection per tenant+tool).
3. **Nango** — opens Connect UI; user authorizes; Nango captures access/refresh tokens.
4. **loader** — receives `auth.created` webhook → verifies signature → writes D1 status (`tenant_spine_config.connected_connectors`, `connectors` row) → triggers immediate "creamy" (full) sync (no 6h cron wait).
5. **connector-sync** — resolves Nango token, calls the provider adapter, returns raw records.
6. **normalizer** — 8-stage NA0–NA5 pipeline: schema detect → canonical transform (traits) → SSOT bind (stable UUID) → lineage → relation bind → Spine publish (enqueue to `PIPELINE_QUEUE`).
7. **pipeline** — the only Spine writer: `INSERT`s entities + relationships to D1, writes audit log.
8. **intelligence / twin-orchestrator** — Twin reads Spine (`WHERE tenant_id = ?`), reasons with gpt-5-mini, emits a proposal to `action_proposals`.
9. **My Desk (frontend)** — owner reviews; governance gate applies; approved actions route to **act** → provider; every decision logged.

---

## 5. Onboarding & schema hydration (first auth)

- Identity provider (Google / GitHub / email) is the trust root.
- A schema-generation AI (gpt-5-mini) hydrates the tenant on first auth: entity types, relationships, RBAC roles (owner/tam/account_success), billing tier.
- Tenant init: D1 partition, `tenant_spine_config` row, RBAC rows, billing record, memory tables.
- Target: signup → workspace < 5 min; first tool connected < 10 min; normalizer p99 < 2s.

---

## 6. AI / Twin / reasoning layer

- **Twin** = persistent per-user reasoning engine (twin-orchestrator DO), grounded in Spine, default model gpt-5-mini via OpenRouter.
- **Frontend AI** (AI_INTEGRATION): React hooks (`useWorkbenchAI`, `useAIInsights`, `useAIAgent`) + `/api/ai/*` endpoints for insights, streaming analysis, predictions, recommendations, agent chat.
- **Agent tools:** analyze_metric, get_metric_data, get_recommendations, generate_forecast, compare_metrics, create_action_plan, get_department_health.
- **MCP** is a first-class surface (`mcp.integratewise.ai`) exposing read-only scoped Spine/Memory to external agents (ChatGPT, Claude, etc.).

---

## 7. Governance & approval gate

- Twin proposes with a confidence score.
- **≥ 0.85** → auto-approve; log to `governance_audit_log`; enqueue to `ACT_QUEUE`.
- **0.70–0.85** → queued for owner review in "My Desk".
- **< 0.70** → discard.
- Even Customer-Zero cannot bypass hard approval-expiry gates.
- Two execution postures: **Customer-Zero** = Hermes native auto-execute; **external tenants** = async Handoff contract only (`/api/v1/handoff/outcome`, validated `x-approval-token`).

---

## 8. Memory lifecycle

- TriageBot extracts knowledge (hourly/daily) with confidence scores.
- Route: ≥0.85 auto-promote to active memory; 0.70–0.85 staging; <0.70 discard.
- Active memory decays if not reinforced; archives after ~30 days of no access.
- Memory scopes: **human / twin / org / audit** (per the frozen contract).

---

## 9. Multi-tenancy & isolation

- Every query must carry `WHERE tenant_id = ?`. Cross-tenant access = security violation → 403 (fail-loud, not 404).
- Nango credentials isolated per tenant (`connectionId = tenant_id`, encrypted in vault).
- Org is the intended hard isolation boundary; sharing happens _within_ an org across departments/lenses.

---

## 10. Audit & observability

Immutable audit tables: `audit_logs` (generic), `governance_audit_log` (approvals), `spine_audit_log` (entity changes), `twin_audit_events` (reasoning trace). Audit write failure stops the sync (fail-loud). telemetry service collects traces/metrics.

---

## 11. Public contract surface

- **Discovery** — `GET /api/v1/discovery` returns identity, tenant, workspace, capabilities (projections + actions), features, navigation, personalization, limits — with tier/role/device gating. Client-cached 5 min.
- **Handoff** — `/api/v1/handoff/outcome` async state machine for external execution results.
- **Connector** — `/api/v1/connector/nango/session`.
- **Gateway routing** — `/api/v1/{workspace|connector|intelligence|knowledge|cognitive|pipeline|admin|mcp}/*`.
- **SDK** — `packages/api-client` (Gateway SDK, marked complete) + `packages/sdk`.

---

## 12. Frontend surfaces

- Role-based L1 domain workbenches; "My Desk" approval interface; real-time metrics dashboard; landing page + founder dashboard.
- Projections exposed today via Discovery: workspace, customer-success, executive, twin-interface (+ L2 overlays).

---

## 13. Deployment, CI/CD & agent continuity

- **Runtime (canon):** 100% Cloudflare — D1 / KV / R2 / Vectorize / AI Search / Durable Objects / Workflows / Queues.
- **Connectors:** Descope is the canonical external authorization authority for outbound connections (Nango retained as dormant compatibility). **MCP:** `mcp.integratewise.ai` (IW-Continuity-Bridge public semantic surface; Descope MCP Adapter is the internal execution surface, commit `5c15413e`).
- **CI/CD gap:** no GitHub Actions gate today; manual `wrangler deploy` per env caused runaway version bloat (pipeline ~1.18M, workflow ~1.9M versions). Needed: unified pipeline, pre-deploy test/typecheck gate, semantic versioning, rollback.
- **Folder Monitor bridge:** macOS chokidar watcher → Cloudflare Folder Watcher DO → `spine_audit_log` + AI Search; powers the Agent Continuity Protocol (session handoffs → triage → org memory).

---

## 14. ⚠️ Source-of-truth conflicts (must resolve)

These are places where the docs actively contradict each other. Freezing anything on top of them locks in fiction.

1. **Storage/runtime plane — three incompatible stories.**
   - _CANON (DECISION 22):_ 100% Cloudflare, no Supabase, no VPS, no Postgres.
   - _SERVICE_INVENTORY:_ 11 services still on **Supabase** (normalizer, govern, store, act, billing, admin, loader, workflow, think, connector, knowledge).
   - _DEPLOYMENT_SETUP:_ **Vercel + Cloudflare Workers + AWS backend + Neon PostgreSQL**.
   - _GTM_MOTION:_ a **"Fortress" PostgreSQL SSOT**.

   → Four different backends. De-Supabase migration is incomplete and the deploy guide describes a non-canonical stack.

2. **Auth model.** Internal: gateway-issued JWT + per-request Spine authorization. External identity + outbound connection authorization: **Descope is the canonical authority** (Clerk not used; Nango retained as dormant compatibility). Pick one identity/authz root.
3. **Frontend host.** README = **Replit** (iwa-customer-zero monorepo); canonical-architecture = `apps/web` (**Vite**); DEPLOYMENT_SETUP = **Vercel/Next.js** at `app.integratewise.ai`; AI_INTEGRATION assumes Next.js. Three+ frontends.
4. **Product framing.** DECISION 23 says "not a platform"; the Platform Activation plan reframes everything as "Platform-first" with a `Platform` layer. Reconcile the naming before freezing contracts.
5. **Layer model.** Canon = 4 layers (Bridge/Kernel/Fabric); the frozen plan = 10-layer named stack. Treat the 10-layer as an internal decomposition of the Kernel, or issue a superseding DECISION.
6. **Capability-first APIs.** Plan mandates "no endpoint unless it's a capability"; reality is conventional REST with capabilities only listed inside the Discovery response. Capability endpoints + `iw.*` SDK facade are greenfield.
7. **Domains.** `integratewise.ai` (canon) vs `integrate-voice.ai` (GTM landing). Confirm the canonical domain.

---

## 15. Security posture (open blockers)

**P0 (tenant safety — undercuts the "one backend" bet):** cross-tenant data leak (intelligence), tenant-id spoofing (unstripped `x-tenant-id`), tenant middleware no-op, HITL Durable Object using `idFromName("global")`, invitation cross-tenant scan, hardcoded RSA key / DB creds / MCP key / WebUI password, `.env` committed, SQL injection in continuity/knowledge shims.

**P1:** billing still on Supabase, gateway rate-limiter fails **open**, CORS reflects arbitrary origins, MCP JWT bypass, unsigned-webhook auto-approve, webhook replay/timing leaks, weak password hashing, remove `@supabase/supabase-js`.

---

## 16. Where this stands vs. Platform Activation

- **Exists & working:** one backend for all tenants, Twin, Govern, Continuity, Nango connector flow, Discovery contract, Gateway SDK.
- **Greenfield:** capability-first endpoints, `@integratewise/sdk` facade, frozen public contracts, Signals as a standalone replayable service (signal _paths_ already exist via queues/accelerator).
- **Gating conditions before the platform bet is safe:** close the P0 tenant-isolation set, finish DECISION 22 (de-Supabase), and pick one answer for each §14 conflict.

---

## 17. Strategy & positioning (from the 2026-07-01 strategy session)

### Category & positioning

- **Category claim:** "The Operational Continuity Platform — the infrastructure layer that preserves context, memory, and governance across every tool, every person, and every AI."
- **Competitive frame:** high structure × high intelligence × human-first workbench. "They connect apps; we connect truth." Positioned against Zapier/Make (plumbing), Workato/Tray (workflows), MuleSoft/Boomi (ESB), Glean/Dashworks (AI search), Notion/Coda (workspace), Copilot/ChatGPT (AI chat).
- **Anti-positioning:** not "AI-powered platform," not "no-code automation," not "replace your tools," not "chat with your data." Instead: human workbench + assistive AI + governed truth.

### Tagline hierarchy

| Level      | Line                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Category   | The Operational Continuity Platform                                  |
| Product    | IW Continuity Bridge                                                 |
| Promise    | Nothing important is forgotten                                       |
| Action     | The last auth for endless continuity / One click to total continuity |
| Proof      | One workbench. Full continuity. Zero context loss.                   |
| Philosophy | Human workbench. Assistive AI. Governed truth.                       |

### Customer-Zero GTM (Acme Corp)

- Two-app "kill shot": **Salesforce + Slack**, read-only, approval-required, 90-day retention.
- Win condition: one workspace auth → CS Workbench shows cross-system account context in < 60s → Twin proposes ≥1 insight/day → VP CS answers "what's our risk?" without opening Salesforce or Slack → adding a 3rd app is an "enable" toggle, not a project.
- Explicitly do **not** build for CZ: marketplace UI, partner portal, public connector directory, per-app OAuth flows, frontend→app direct calls.

### GTM channel — distribution _inside_ AI-assistant marketplaces

- **GTM runs through the AI assistants' own app marketplaces — not a marketplace we build.** IntegrateWise ships as an **MCP app / connector listed in ChatGPT (GPT/app store), Claude (connector directory), Perplexity, and similar**; users discover and add it from _inside_ the assistant they already use.
- This is the same MCP surface as the **AI-assistant-first ingress** (§3): the primary ingress channel _is_ the primary distribution channel — list once as an MCP app, and that listing is both how users find us and how their assistant reaches the Spine.
- **Motion:** be present as an MCP app in Claude/ChatGPT/Perplexity marketplaces → user connects their workspace → land-and-expand into the workbench.

---

## 18. New architecture framing from that session ("EcosystemConnection" model)

The session proposed a refined model that partly conflicts with the canonical repo docs. Recorded here so the two can be reconciled deliberately.

### The proposed model

- **One EcosystemConnection per workspace (L0):** the user connects their _workspace_ to IntegrateWise **once** (one trust boundary + policy), then _enables_ individual integrations from inside using that stored trust — rather than a separate OAuth per tool.
- **Integration Manager (L3):** a central hub = Integration Registry + Adapter Router (Nango / MCP / Native) + Health Monitor. It writes **to** Spine; everyone else reads **from** Spine.
- **Spine (SSOT):** the only write target; does entity resolution → Entity360 + timeline.
- **8 frontends (L1):** Personal, Business, CS, OS, Workspace, Ops, Docs, Chat — pure projections, zero connection logic (`spine.getEntity360(...)`, `spine.getTimeline(...)`).
- **ADK / Twin (L2):** cognition. Loop A = propose → human approve; Loop B = execution. ADK never writes to external systems directly — it proposes, human approves, Spine records, Integration Manager executes the approved writeback.

### New conflicts this introduces

1. **"Platform" branding vs DECISION 23.** The session's category claim is literally "The Operational Continuity **Platform**," while canon says "explicitly not a platform." This is the same tension as §14.4 but now baked into the _external_ brand.
2. **Third layer model (L0–L3).** Now three coexisting models: canon's 4-layer (Bridge/Kernel/Fabric), the plan's 10-layer stack, and this session's L0–L3. Pick one canonical layering.
3. **Integration Manager vs existing services.** "Integration Manager" overlaps with the already-shipped `connector`, `connector-sync`, and `agent-registry` services.
4. **One-auth EcosystemConnection vs per-tool Nango flow.** The canonical tool connection flow does a **per-tool** Nango OAuth. The session proposes **one** workspace trust boundary with per-integration _enablement_ under it.
5. **Lens naming (third variant).** Frontend lenses now named three ways.
6. **ADK / Loop A–B naming.** The session introduces "ADK" and Loop A/Loop B; canon uses `twin-orchestrator` + `govern` + the confidence-threshold gate.

---

## 19. Interaction fabric — identity → discovery → connections → agents → memory

### The single through-line

```
Identity (who) → Auth (trust) → Discovery (what can I do) → Connections (reach tools)
   → Integration Manager (route) → Spine (truth) → ADK/Twin (reason) → Govern (approve)
   → Act / tool-to-tool (execute) → Writeback → Memory (remember) → back into Spine
```

### 19.1 Identity + auth (the trust root)

- Identity provider (Google / GitHub / email) is the root of trust; the gateway issues a JWT that every downstream service validates.
- One workspace-level trust boundary (the EcosystemConnection) is intended to replace per-tool credential sprawl.

### 19.2 Discovery (the capability handshake)

- Immediately after auth, the client calls `GET /api/v1/discovery`, which returns identity, tenant, projections, capabilities, features, limits. Cached client-side 5 min.

### 19.3 Connections (reaching external tools)

- **EcosystemConnection (L0)** = the one trust boundary; **Integration Manager (L3)** = registry + adapter router + health monitor.
- Three adapter types: Nango, MCP, Native.
- Integration Manager is the **only** thing that touches external APIs; it writes _to_ Spine.

### 19.4 MCP — two directions

- **Inbound — external agents read us.** `mcp-connector` at `mcp.integratewise.ai` exposes **read-only, scoped** Spine/Memory to outside AIs.
- **Outbound — we call tools.** Integration Manager's MCP adapter connects to provider MCP servers. Outbound MCP calls are enriched with Spine Entity360 context.

### 19.5 ADK / Twin + agent memory

- **ADK/Twin (L2)** is the cognition layer: it reads Entity360 + timeline, reasons, and proposes. Memory is scoped (human / twin / org / audit) and decays/promotes.

### 19.6 Tool-to-tool calls (Loop B)

- **Loop B: Tool → Truth**, system-governed. A tool/agent action executes, Spine validates, and the outcome is written back. No direct app-to-app calls.

### 19.7 Agent-to-agent (A2A) communication

- **A2A is mediated, not peer-to-peer.** GTM_MOTION states agents coordinate by reading/writing shared Spine context. Spine is the blackboard.

---

## 20. Platform Architecture v1.0 (FINAL / LOCKED) — the master diagram

### 20.1 The 0–16 stack (physical topology)

**0 Tenant Lifecycle** · **1 Customer Ecosystem** · **2 Surface Layer** · **3 Gateway Layer** · **4 Identity & Organization** · **5 Continuity Bridge** · **6 Adaptive Spine** · **7 Context Assembly** · **8 Shared Memory** · **9 Capability Engine** · **10 Governance Layer** · **11 Capability Runtime** · **12 Projection Registry** · **13 Registry Layer** · **14 Continuity Engine** · **15 Data & Infrastructure** · **16 Endpoint Registry**.

### 20.2 Conflicts this LOCKED diagram resolves

| Open conflict             | v1.0 FINAL decision                                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §14.1 Storage/runtime     | **100% Cloudflare** — D1, Durable Objects, KV, R2, Vectorize, AI Search, Queues.                                                                                                                           |
| §14.2 Auth model          | Internal: **API Keys (external) + JWT (internal)**. External identity + outbound connection authorization: **Descope is the canonical authority** (Clerk is out; Nango retained as dormant compatibility). |
| §18.3 Integration Manager | Folded into **§5 Continuity Bridge**. Not a separate 4th service.                                                                                                                                          |
| §18.4 One-auth vs Nango   | **Both:** "Connect Once" at the surface; **Descope is the canonical outbound authorization authority** behind it (Nango retained as dormant compatibility).                                                |
| §18.6 ADK vs Twin naming  | **ADK is now canonical** — it lives in §11 Capability Runtime.                                                                                                                                             |

### 20.3 Conflicts it does NOT resolve (or newly sharpens)

1. **"Platform" is now the chosen word — head-on with DECISION 23.**
2. **Fourth layer model.** Canon 4-layer, plan 10-layer, session L0–L3, and now this 0–16 stack.
3. **Fourth lens taxonomy.**
4. **Memory-scope naming drift.**

---

## 21. Frozen Architecture MindMap (v1 → v2) — the "names, not numbers" view

### 21.1 The four frozen pillars

- **Continuity Bridge at the door** — "One Connection → Entire Business → Continuity".
- **A projection platform, not one app** — 8 lenses of the same Spine.
- **Capability at the center** — capability-driven, NOT entity-driven.
- **Platform is 7x agnostic** — Runtime, Provider, Tool, Model, Deployment, UI, Protocol.

### 21.2 Conflicts / decisions this raises

1. **Numbered (0–16) vs un-numbered ("use names").**
2. **8-lens taxonomy — a 5th variant.**
3. **Memory scopes still unsettled.**
4. **"Platform" is now unanimous.** DECISION 23 is formally overridden.
