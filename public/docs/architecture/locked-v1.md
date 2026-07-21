# IntegrateWise Continuity Bridge

## Canonical Architecture Specification v1.0.0-FINAL

**Status:** LOCKED — all conflicts resolved, all P0 blockers defined with closure criteria  
**Date:** 2026-07-02  
**Version:** 1.0.0-FINAL  
**Supersedes:** All prior documents, decisions, diagrams, and conflicting specifications where they conflict with this version.

---

## 1. The Doctrine

> **Context you own. AI you rent. Approval in between.**

The IntegrateWise Continuity Bridge is an OODA Engine for Business Continuity. It preserves organizational context, memory, governance, and execution across all tools, humans, and AI agents through one stable continuity contract.

**Product Name:** IW Continuity Bridge  
**Category:** The Operational Continuity Platform  
**Anti-categories:** Not an OS, not a tool, not a platform-first product. "Knowledge workspace" is a descriptor, not the name.

### 1.1 The Core Promise

> **One JWT. One SSE connection. One Bridge. The Bridge connects to everything else.**

A consumer (human, AI assistant, app, tool) needs exactly one credential to reach Salesforce, GitHub, Slack, Notion, AWS, and twenty other tools. The Bridge holds all provider credentials. The consumer holds none. The consumer never imports internal topology, never bypasses the governance gate, and never writes to a provider without approval.

### 1.2 The Tagline Hierarchy

| Level      | Line                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Category   | The Operational Continuity Platform                                  |
| Product    | IW Continuity Bridge                                                 |
| Promise    | Nothing important is forgotten                                       |
| Action     | The last auth for endless continuity / One click to total continuity |
| Proof      | One workbench. Full continuity. Zero context loss.                   |
| Philosophy | Human workbench. Assistive AI. Governed context.                     |

---

## 2. The OODA Engine (The Universal Loop)

Every entity, tool, user, and AI agent in the system operates on the same four-phase decision cycle. This is the core mental model of the platform.

```
┌─────────────────────────────────────────────────────────────────┐
│  OODA — Observe, Orient, Decide, Act                            │
│                                                                 │
│  OBSERVE ──► Read signals from tools, users, webhooks, files  │
│  ORIENT  ──► Assemble Entity360 + Memory + Knowledge            │
│  DECIDE  ──► Propose action, score confidence, govern            │
│  ACT     ──► Execute approved action, writeback, compound       │
│                                                                 │
│  └──────► Each cycle makes the next faster (compounding) ────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Observe

Ingest raw signals from the perimeter: webhooks from Salesforce, Slack messages, file changes from the folder watcher, user clicks in the workbench, AI assistant queries via MCP.

- **Services:** `webhook-ingress`, `connector-sync`, `folder-watcher`, `mcp-connector` (inbound)
- **Output:** Raw payload → `PIPELINE_QUEUE` → `normalizer`
- **Speed:** Milliseconds (event-driven) to minutes (scheduled polling)

### 2.2 Orient

Transform raw signals into unified context. The 8-stage normalizer (NA0–NA5) runs inside a single pipeline stage. Entity360 assembles data from all connected tools into one canonical view. Memory retrieval surfaces relevant historical context from active, staging, and archived tiers.

- **Services:** `normalizer`, `intelligence` (Context Assembly), `knowledge` (RAG), `continuity` (memory retrieval)
- **Data:** `spine_entities` (D1), `entity:{id}:360` (KV cache), Vectorize (semantic embeddings)
- **Speed:** < 2s for normalizer p99, < 10ms for Entity360 cache hit

### 2.3 Decide

The Twin (per-user AI reasoning engine) evaluates context and proposes an action. The governance gate scores confidence. The decision is immutable and auditable.

| Confidence  | Action           | Destination                        | Human Touch                |
| ----------- | ---------------- | ---------------------------------- | -------------------------- |
| ≥ 0.85      | Auto-approve     | `ACT_QUEUE`                        | None                       |
| 0.70 – 0.85 | Queue for review | My Desk                            | Approve / Modify / Dismiss |
| < 0.70      | Discard          | `spine_audit_log` (discard reason) | None                       |

- **Services:** `twin-orchestrator` (OODA engine), `govern` (confidence gate), `think` (LLM reasoning orchestration)
- **Model:** Default `gpt-5-mini` via OpenRouter (aggregator). Swappable to Claude, Grok, Gemini, Ollama by config change.
- **Speed:** 1–2s for simple proposals, 5–10s for complex analysis

### 2.4 Act

Execute approved actions through the Integration Router (South Plane). Write outcomes back to the Spine. Update memory so the next OODA cycle starts with more context than the last.

- **Services:** `act` (execution), `workflow` (durable orchestration), `hermes` (message queue)
- **Output:** External API call (Salesforce, Slack, etc.) + Spine writeback + memory promotion
- **Speed:** 500ms–2s depending on external API latency

---

## 3. The Four Layers (Conceptual Law)

These layers describe trust boundaries, not deployment units. The physical implementation is the 0–16 stack in §8.

```
Consumers  ↔  Continuity Bridge  ↔  Continuity Kernel  ↔  Provider Fabric
```

| Layer                 | What It Is                                                                                                                             | What Consumers See                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Consumers**         | Humans, AI assistants (ChatGPT, Claude, Perplexity, Cursor), apps, tools                                                               | One MCP connection, one JWT, one web workbench, or one SDK call |
| **Continuity Bridge** | The public interface and moat: identity, auth, discovery, projections, capabilities, governance entry, events                          | Identity, Discovery, Projections, Capabilities, Events          |
| **Continuity Kernel** | The internal context substrate: Adaptive Spine, Memory, Knowledge, Context, Capability Engine, Governance, Workflow, Continuity Engine | Nothing. Consumers never import internal topology.              |
| **Provider Fabric**   | Replaceable external execution: SaaS providers, databases, APIs, queues, agents, runtimes                                              | Nothing. Entirely behind the Kernel.                            |

**Invariant:** Consumers never import internal service topology. They see only Identity, Discovery, Projections, Capabilities, and Events.

---

## 4. The Two Planes (North / South)

```
Consumers → [API Gateway] → Spine (context) → [Integration Router] → Provider tools
             (North / Ingress)                (South / Egress)
```

| Plane     | Direction            | Role                                                                                         | Physical Service                                         |
| --------- | -------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **North** | Consumers → Platform | AuthN/Z, tenant routing, rate-limit, capability routing, Discovery, inbound MCP              | `gateway` (single Worker)                                |
| **South** | Platform → Providers | Adapter routing (Nango / MCP / Native), credential wall, health, Entity360 context injection | Integration Router (inside `act` + `connector` services) |

**Rule:** Neither plane talks to the other except through the Spine. The Gateway and Integration Router are the only two doors — one in, one out.

---

## 5. MCP Pool Architecture (Bidirectional, First-Class)

MCP is a multiplexed, bidirectional, tenant-scoped pool. It is not a single connection. It is not "server/client." It is a pool.

### 5.1 Inbound MCP Pool (North Plane)

**Endpoint:** `mcp.integratewise.ai/v1/mcp` (SSE/stdio)  
**Role:** AI assistants (ChatGPT, Claude, Perplexity, Cursor) connect to us to read scoped Spine/Memory context.  
**Primary ingress:** This is the primary front door. Traditional SaaS webhooks are secondary.

**Security gates (P0 — must close before production):**

1. JWT required on `/tools`, `/invoke`, `/mcp`, `/sessions` — 403 on bypass
2. `tenant_id` extracted from JWT claim, never from client payload
3. Cross-tenant session reuse → 403 (fail-loud, not 404)
4. Read-only default. Write requires `scope: write` + governance approval.
5. Tool catalog filtered by Discovery — tenant cannot discover another tenant's tools
6. Every invocation logged to `spine_audit_log` with `via: mcp`

**Consumer config (the ONLY client-side entry):**

```json
{
  "mcpServers": {
    "integratewise": {
      "type": "sse",
      "url": "https://mcp.integratewise.ai/v1/mcp",
      "headers": { "Authorization": "Bearer ${input:integratewise_jwt}" }
    }
  }
}
```

**Key rule:** One entry. Not 21. Not 5. One.

### 5.2 Outbound MCP Pool (South Plane)

Inside the Integration Router. We connect to provider MCP servers (Salesforce MCP, Slack MCP, GitHub MCP) using MCP as the transport. Entity360 context is injected before every outbound call.

---

## 6. The 26 Services (Physical Topology)

All services run on every deployment and serve all tenants. Customer-Zero is a tenant class, not a separate service. All 26 are wired into the Gateway as Cloudflare service bindings.

### Tier 0 — Ingress & Routing

| Service           | Worker Name             | Purpose                                                          | Binding           |
| ----------------- | ----------------------- | ---------------------------------------------------------------- | ----------------- |
| `gateway`         | `integratewise-gateway` | Single entry point; JWT validation; tenant routing; rate-limit   | N/A               |
| `webhook-ingress` | `iw-webhook-ingress`    | Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub) | `WEBHOOK_INGRESS` |

### Tier 1 — Tenant & Sync

| Service          | Worker Name         | Purpose                                                                                                                     | Binding          |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `tenants`        | `iw-tenants`        | Multi-tenant context resolution, tenant CRUD, RBAC, plan limits                                                             | `TENANTS`        |
| `connector-sync` | `iw-connector-sync` | Orchestrates connector sync (fetch → Normalizer → Triage)                                                                   | `CONNECTOR_SYNC` |
| `normalizer`     | `iw-normalizer`     | 8-stage pipeline: parse → trait-detect → resolve-type → resolve-entity → link-rels → enrich-map → validate → emit-canonical | `NORMALIZER`     |
| `loader`         | `iw-loader`         | Cold-start pre-loader; Nango webhook handler; triggers immediate "creamy" sync                                              | `LOADER`         |
| `connector`      | `iw-connector`      | OAuth callback handler (Nango)                                                                                              | `CONNECTOR`      |

### Tier 2 — Projection & Rendering

| Service             | Worker Name            | Purpose                                                       | Binding             |
| ------------------- | ---------------------- | ------------------------------------------------------------- | ------------------- |
| `pipeline`          | `iw-pipeline`          | **Only writer to the Spine**; commits to D1; writes audit log | `PIPELINE`          |
| `twin-orchestrator` | `iw-twin-orchestrator` | Persistent per-user OODA engine (Durable Object)              | `TWIN_ORCHESTRATOR` |
| `l2`                | `iw-l2`                | Department × industry overlay projections                     | `L2`                |
| `intelligence`      | `iw-intelligence`      | Analytics & insights renderer; signal generation              | `INTELLIGENCE`      |
| `knowledge`         | `iw-knowledge`         | Knowledge base, docs, semantic search (RAG)                   | `KNOWLEDGE`         |
| `govern`            | `iw-govern`            | Governance rules engine; approval gates; HITL thresholds      | `GOVERN`            |
| `store`             | `iw-store`             | Persistence for projections (accounts, deals, tasks)          | `STORE`             |
| `act`               | `iw-act`               | Action execution; write-back to providers                     | `ACT`               |
| `spine-v2`          | `iw-spine-v2`          | Spine normalization & graph services                          | `SPINE_V2`          |

### Tier 3 — Capability Runtime & Orchestration

| Service            | Worker Name        | Purpose                                                       | Binding            |
| ------------------ | ------------------ | ------------------------------------------------------------- | ------------------ |
| `hermes`           | `iw-hermes`        | Message queue + execution engine (Durable Object)             | `HERMES`           |
| `triage`           | `iw-triage`        | Confidence routing + active-memory decay (runs inside Hermes) | `TRIAGE`           |
| `workflow`         | `iw-workflow`      | Durable orchestration; pause; retry; saga                     | `WORKFLOW`         |
| `iw-agent-runtime` | `iw-agent-runtime` | MCP-compliant AI agent execution                              | `IW_AGENT_RUNTIME` |
| `mcp-connector`    | `iw-mcp-connector` | MCP bridge: external agents → scoped Spine/Memory access      | `MCP_CONNECTOR`    |

### Tier 4 — Supporting

| Service          | Worker Name         | Purpose                                                        | Binding          |
| ---------------- | ------------------- | -------------------------------------------------------------- | ---------------- |
| `agent-registry` | `iw-agent-registry` | Catalog of available agents/integrations                       | `AGENT_REGISTRY` |
| `billing`        | `iw-billing`        | Usage tracking + plan enforcement                              | `BILLING`        |
| `admin`          | `iw-admin`          | Platform admin; tenant management; overrides                   | `ADMIN`          |
| `folder-watcher` | `iw-folder-watcher` | Durable Object filesystem watcher (macOS chokidar → DO)        | `FOLDER_WATCHER` |
| `continuity`     | `iw-continuity`     | Memory consolidation + decay (the continuity substrate)        | `CONTINUITY`     |
| `telemetry`      | `iw-telemetry`      | Traces, metrics, observability                                 | `TELEMETRY`      |
| `think`          | `iw-think`          | LLM reasoning orchestration (separate from `iw-agent-runtime`) | `THINK`          |

---

## 7. The 0–16 Stack (Physical Implementation Topology)

The 4-layer law is conceptual (trust boundaries). The 0–16 stack is physical (implementation). Both hold simultaneously.

| #   | Layer                       | Physical Services                                                  | Data / Storage                                          |
| --- | --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 0   | **Tenant Lifecycle**        | `tenants`, `loader`, `admin`                                       | D1 `tenants`, `tenant_spine_config`                     |
| 1   | **Customer Ecosystem**      | `connector`, `connector-sync`, `agent-registry`                    | Nango vault, `connectors` table                         |
| 2   | **Surface Layer**           | `apps/web`, `apps/mcp-server`                                      | Cloudflare Pages, R2 assets                             |
| 3   | **Gateway Layer**           | `gateway`                                                          | N/A — pure routing                                      |
| 4   | **Identity & Organization** | `tenants` (RBAC)                                                   | D1 `rbac_roles`, `rbac_permissions`                     |
| 5   | **Continuity Bridge**       | `connector-sync`, `normalizer`, `mcp-connector`, `webhook-ingress` | D1 `sync_jobs`, `normalizer_state`, KV Discovery cache  |
| 6   | **Adaptive Spine**          | `pipeline`                                                         | D1 `entities`, `relationships`, `spine_audit_log`       |
| 7   | **Context Assembly**        | `intelligence`, `knowledge`                                        | Vectorize, AI Search, KV context cache                  |
| 8   | **Shared Memory**           | `continuity`, `triage`                                             | D1 `memory` (active/staging/archived), KV decay         |
| 9   | **Capability Engine**       | `iw-agent-runtime`, `think`                                        | OpenRouter API, KV model config                         |
| 10  | **Governance Layer**        | `govern`                                                           | D1 `governance_audit_log`, `action_proposals`           |
| 11  | **Capability Runtime**      | `hermes`, `workflow`, `act`, `mcp-connector`                       | Durable Objects, Queues (`ACT_QUEUE`, `PIPELINE_QUEUE`) |
| 12  | **Projection Registry**     | `l2`, `store`                                                      | D1 `projections`, `projection_registry`                 |
| 13  | **Registry Layer**          | `agent-registry`, `intelligence`                                   | D1 `capability_registry`, `endpoint_registry`, KV cache |
| 14  | **Continuity Engine**       | `continuity`, `twin-orchestrator`                                  | D1 `continuity_graph`, KV session handoffs              |
| 15  | **Data & Infrastructure**   | `telemetry`, `folder-watcher`                                      | D1 `audit_logs`, R2 telemetry, Workers Analytics        |
| 16  | **Endpoint Registry**       | `gateway` (serves), `intelligence` (updates)                       | KV + D1 `endpoint_registry` (living API contract)       |

**Cross-cutting:** Security (WAF, DDoS, TLS, CF Secrets, Zero Trust), Observability (logs/metrics/traces/alerts/audit), Reliability (idempotency, retries, DLQ, backpressure), Compliance (audit & lineage, retention, encryption, tenant isolation).

---

## 8. The Discovery Contract (Consumer Surface)

**Endpoint:** `GET /api/v1/discovery`  
**Cache:** Client-side 5 minutes  
**Purpose:** How humans and AI agents learn "what exists / what can I do" without hardcoding topology.

**Response includes:**

- `identity` — user, tenant, org, role
- `workspace` — tenant config, connected connectors, plan limits
- `projections` — available lenses: Sales, CS, Finance, Executive, Architecture, Operations, Personal, Developer
- `capabilities` — named actions filtered by tier/role/level (e.g., `analyze_account`, `draft_email`, `get_department_health`)
- `features` — gated by plan (free/pro/enterprise)
- `navigation` — role-based menu structure
- `personalization` — user preferences, recent context
- `limits` — rate limits, storage quotas, model quotas

AI agents read the same Discovery response as humans. This is the contract that makes cross-component communication effective and drift-proof.

---

## 9. Governance & Approval Gate (The 0.70/0.85 Law)

Two triage gates run on the same confidence thresholds:

### 9.1 Governance Triage (Execution Gate)

| Confidence  | Action            | Destination            | Audit                                  |
| ----------- | ----------------- | ---------------------- | -------------------------------------- |
| ≥ 0.85      | Auto-approve      | `ACT_QUEUE`            | `governance_audit_log` (auto-approved) |
| 0.70 – 0.85 | Queued for review | My Desk (owner review) | `governance_audit_log` (pending)       |
| < 0.70      | Discard           | —                      | `governance_audit_log` (discarded)     |

Even Customer-Zero cannot bypass hard approval-expiry gates.  
**Customer-Zero posture:** Hermes native auto-execute for internal operations only.  
**External tenant posture:** Async Handoff contract only (`/api/v1/handoff/outcome`, validated `x-approval-token`).

### 9.2 Memory Triage (Knowledge Gate)

| Confidence  | Action       | Destination    | Where                                    |
| ----------- | ------------ | -------------- | ---------------------------------------- |
| ≥ 0.85      | Auto-promote | Active memory  | `continuity` (TriageBot inside `hermes`) |
| 0.70 – 0.85 | Staging      | Staging memory | `continuity`                             |
| < 0.70      | Discard      | —              | `continuity`                             |

Active memory decays if not reinforced and archives after ~30 days of no access. Triage is continuous, not one-shot.

### 9.3 Memory Scopes (FINAL — 4 Scopes)

| Scope                  | Who                  | Access                                            |
| ---------------------- | -------------------- | ------------------------------------------------- |
| `Personal` (`human`)   | Individual user      | User sees their own data                          |
| `Work` (`work`)        | Task/project context | Team sees shared task data                        |
| `Organization` (`org`) | Org-wide             | Admin manages org Spine via capabilities          |
| `AI` (`twin`)          | Twin/agent reasoning | Agent sees its own traces and compounding context |

Audit is cross-cutting Compliance, not a memory scope.

---

## 10. Memory Lifecycle (Continuity Engine)

The Continuity Engine runs 7 stages:

```
Memory Intake → Classification → Validation → Promotion → Memory Store → Continuity Graph → Memory Decay
```

- **Intake:** Raw signals from Pipeline, Act, Twin, user actions
- **Classification:** TriageBot scores confidence (0–1.0)
- **Validation:** Deduplication against SSOC (stable UUIDs); lineage verification
- **Promotion:** ≥0.85 → active; 0.70–0.85 → staging; <0.70 → discard
- **Memory Store:** Active / staging / archived tiers in D1 + KV cache
- **Continuity Graph:** Relationship traversal — who/what/when/where connected
- **Decay:** Time-decay + access-decay; archive after ~30 days; reinforcement resets clock

Every agent turn starts with more context than the last. This is compounding memory.

---

## 11. AI / Twin / Reasoning Layer

### 11.1 Model Provider (The "AI You Rent")

- **Default:** `gpt-5-mini` via **OpenRouter** (aggregator)
- **Swappable:** OpenAI, Anthropic, Google, Grok — config change, not migration
- **Binding:** Consumers call capabilities (`twin/propose`, `insights`, `predictions`), never model names
- **Per-tenant/per-capability model selection:** Cheap model for triage, strong model for high-stakes proposals, provider failover

**Resolution of DECISION 30 (Grok):** Superseded. Twin default = `gpt-5-mini` via OpenRouter. Grok available as config option only.

### 11.2 Agent Services

| Service             | Role                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `twin-orchestrator` | Persistent per-user OODA engine — reasoning engine (Durable Object) |
| `iw-agent-runtime`  | MCP-compliant AI agent execution                                    |
| `think`             | LLM reasoning orchestration (SDK abstraction layer)                 |
| `mcp-connector`     | Inbound MCP bridge — external agents → scoped Spine/Memory          |
| `agent-registry`    | Catalog of available agents / integrations                          |

### 11.3 Agent Tools (Capabilities)

- `analyze_metric`
- `get_metric_data`
- `get_recommendations`
- `generate_forecast`
- `compare_metrics`
- `create_action_plan`
- `get_department_health`

### 11.4 A2A (Agent-to-Agent)

**Status:** Month-6 roadmap. Today: agents coordinate through shared Spine context via Twin — the Spine is the shared blackboard. No peer-to-peer calls. Every agent reads/writes the same Spine, gated by `tenant_id` and JWT scope.

---

## 12. Multi-Tenancy & Isolation (Hard Rules)

1. **Every query carries `WHERE tenant_id = ?`.** Cross-tenant access = security violation → 403 (fail-loud, not 404).
2. **Nango credentials isolated per tenant:** `connectionId = tenant_id`, encrypted in vault. No shared tokens.
3. **Org is the hard isolation boundary.** Sharing happens within an org across departments/lenses.
4. **Gateway enforces `x-tenant-id` extraction from JWT.** Never from client payload, never from URL parameter, never from header injection.
5. **Service bindings carry `tenant_id` implicitly.** Every internal RPC includes the caller's tenant context.

---

## 13. Audit & Observability (Immutable, Fail-Loud)

| Table                  | What It Logs                                    | Failure Behavior               |
| ---------------------- | ----------------------------------------------- | ------------------------------ |
| `audit_logs`           | Generic events                                  | Write failure → halt operation |
| `governance_audit_log` | Approval decisions (approve/reject/discard)     | Write failure → halt operation |
| `spine_audit_log`      | Entity changes, MCP access, reads, writes       | Write failure → halt sync      |
| `twin_audit_events`    | Reasoning trace, model calls, confidence scores | Write failure → halt proposal  |
| `outbound_mcp_calls`   | Provider calls, latency, errors                 | Write failure → circuit break  |

**Rule:** Audit write failure stops the sync. No silent drops. Telemetry service (`telemetry`) collects traces/metrics from all workers.

---

## 14. Public Contract Surface (What Consumers Call)

| Endpoint                                                                                  | Purpose                          | Auth                        |
| ----------------------------------------------------------------------------------------- | -------------------------------- | --------------------------- |
| `GET /api/v1/discovery`                                                                   | Capability handshake             | Gateway JWT                 |
| `POST /api/v1/handoff/outcome`                                                            | Async external execution results | `x-approval-token`          |
| `POST /api/v1/connector/nango/session`                                                    | Initiate OAuth connection        | Gateway JWT + `x-tenant-id` |
| `GET /api/v1/{workspace,connector,intelligence,knowledge,cognitive,pipeline,admin,mcp}/*` | Tiered capability routing        | Gateway JWT                 |
| `mcp.integratewise.ai/v1/mcp`                                                             | MCP SSE transport                | Bearer JWT                  |

**SDK:** `packages/api-client` (Gateway SDK, complete) + `packages/sdk` (consumer facade).

---

## 15. Frontend Surfaces (Projection Platform)

The live repo ships one full UI — not many apps:

- **User Workbench** — role-based L1 domain workbenches (8 lenses)
- **Twin Workbench** — AI reasoning interface, proposal review
- **Collaboration Overlay** — ambient memory, governance, continuity signals
- **My Desk** — approval interface (0.70–0.85 proposals)
- **Real-time metrics dashboard**

**Projections (FINAL lens taxonomy):** Sales, CS, Finance, Executive, Architecture, Operations, Personal, Developer.

**Frontend host:** `apps/web` (Vite + React + shadcn/ui). Deployed to Cloudflare Pages. Not Next.js. Not Vercel. Not Replit. The UI is an agnostic dimension, but the template default is Vite on Cloudflare Pages.

---

## 16. Deployment Topology (100% Cloudflare)

**Runtime:** Workers (all 26 services), Durable Objects (stateful: Twin, Hermes, Workflow, Folder Watcher), D1 (relational + cache), KV (cache, registry), R2 (blobs, telemetry), Vectorize (embeddings), AI Search (semantic), Queues (`PIPELINE_QUEUE`, `ACT_QUEUE`, `CONNECTOR_SYNC_QUEUE`), Workflows (durable orchestration), Pages (frontend).

**No Supabase as the canonical relational store.** Supabase is the current adapter, wrapped behind `packages/lib/db-gate.ts`. D1 is the operational/cache layer. HyperDrive is the future path for PostgreSQL connection pooling. The relational store is swappable by design.

**CI/CD gap:** No GitHub Actions gate today. Required: unified pipeline, pre-deploy test/typecheck, semantic versioning, rollback. Target: `wrangler deploy` through a GitHub Actions gate with pnpm workspace caching.

**Folder Monitor bridge:** macOS chokidar watcher → Cloudflare Folder Watcher DO → `spine_audit_log` + AI Search. Powers the Agent Continuity Protocol (session handoffs → triage → org memory).

---

## 17. Registry Layer (§13 — The Discovery Backbone)

Everything the ecosystem can do is cataloged:

- **Connector Registry** — Nango, MCP, Native adapters
- **MCP Registry** — Inbound/outbound MCP servers, health status
- **Tool Registry** — Provider tool schemas, versions, deprecation
- **Capability Registry** — Named business actions (Analyze Account, Draft Email, …)
- **Skill Registry** — Agent skills (analyze_metric, …)
- **Agent Registry** — Available agents, runtime status
- **Provider Registry** — External providers (Salesforce, Slack, …)
- **Endpoint Registry** — Living API contract: path/method, service owner, auth type, status, surface access, change summary (cached in KV + D1)
- **Schema Registry** — Entity schemas, versions, migration history
- **Policy Registry** — Governance rules, approval thresholds, HITL policies

Discovery reads from these registries. Agents, frontends, docs, and tests all read the same Endpoint Registry to stay drift-proof.

---

## 18. Context Assembly (Intelligence Fabric — §7)

The RAG layer feeding the Twin:

1. **Entity resolution** — SSOC lookup, stable UUID binding
2. **Memory retrieval** — active memory query, recency + relevance scoring
3. **Relationship traversal** — Continuity Graph walk (entity → relation → entity)
4. **Tool retrieval** — Capability Registry lookup for available actions
5. **Capability discovery** — What can this tenant do right now?
6. **Prompt assembly** — Structured prompt with Entity360 + memory + tools
7. **Context-window optimization** — Truncation/prioritization to fit model limits
8. **Evidence retrieval** — Audit trail, lineage, confidence scoring for past decisions

---

## 19. Security Posture (P0 & P1)

### P0 — Tenant Safety (Must Close Before Production)

| #   | Vulnerability                        | Fix                                                          | Owner                     |
| --- | ------------------------------------ | ------------------------------------------------------------ | ------------------------- |
| 1   | Cross-tenant data leak               | `WHERE tenant_id = ?` on every query; 403 fail-loud          | ALL services              |
| 2   | Tenant-id spoofing                   | Extract from JWT claim only; reject client-provided          | `gateway`                 |
| 3   | Tenant middleware no-op              | Enforce service bindings carry `tenant_id` implicitly        | `gateway`                 |
| 4   | HITL DO using `idFromName("global")` | Use `idFromName(tenant_id + user_id)`                        | `govern`                  |
| 5   | Invitation cross-tenant scan         | Add `WHERE tenant_id = ?` to invitation lookup               | `tenants`                 |
| 6   | Hardcoded secrets                    | Move to Cloudflare Secrets; rotate                           | `admin`                   |
| 7   | `.env` committed                     | Remove from git; add `.gitignore`; scan history              | `admin`                   |
| 8   | SQL injection in shims               | Use Drizzle ORM parameterized queries                        | `continuity`, `knowledge` |
| 9   | MCP-JWT bypass                       | Require `Authorization: Bearer <jwt>` on all MCP endpoints   | `mcp-connector`           |
| 10  | Auth root thrashing                  | Freeze on API Keys + JWT; remove Clerk/Stack/Descope imports | `gateway`                 |

### P1 — Hardening (Post-Production)

| #   | Vulnerability                   | Fix                                              | Owner             |
| --- | ------------------------------- | ------------------------------------------------ | ----------------- |
| 1   | Billing still on Supabase       | Migrate to D1 + Workers billing                  | `billing`         |
| 2   | Gateway rate-limiter fails open | Add Cloudflare Rate Limiting; fail-closed        | `gateway`         |
| 3   | CORS reflects arbitrary origins | Whitelist `app.integratewise.ai` + Pages domains | `gateway`         |
| 4   | MCP JWT bypass                  | Close P0 #9 first                                | `mcp-connector`   |
| 5   | Unsigned-webhook auto-approve   | Verify Nango webhook signatures; reject unsigned | `loader`          |
| 6   | Webhook replay/timing leaks     | Add idempotency keys; deduplicate                | `webhook-ingress` |
| 7   | Weak password hashing           | Argon2id via Cloudflare Workers                  | `tenants`         |
| 8   | Remove `@supabase/supabase-js`  | DECISION 22 completion                           | All services      |

---

## 20. The Ownership Split (Context vs. Mechanism)

| What                                                                   | Who Owns It                                  | Access                                           |
| ---------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| **Context** — data/entities in the Spine                               | **Customer organization** (data sovereignty) | Admin views/manages org's Spine via capabilities |
| **Mechanism** — Spine schema, Schema AI, Normalizer, Continuity Engine | **IntegrateWise (proprietary IP)**           | Not shared, not exposed to tenant                |

This split is possible because consumers reach context through capabilities, never through the schema. One boundary delivers sovereignty, IP protection, and swappability simultaneously.

---

## 21. Consumer Contract Summary (The "One Connection" Rule)

What a consumer needs to connect:

1. **One JWT** — issued by the Gateway, bound to a tenant
2. **One SSE endpoint** — `mcp.integratewise.ai/v1/mcp` (for AI assistants) or `https://api.integratewise.ai` (for apps)
3. **One Discovery call** — `GET /api/v1/discovery` to learn what exists and what they can do

What they do NOT need:

- Provider credentials (Salesforce, GitHub, AWS, …) — held by the Integration Router
- Multiple MCP connections — the Bridge routes to 20+ providers internally
- Knowledge of internal topology — 26 services, D1 schema, DO IDs are all hidden
- Auth provider accounts — no Clerk, no Stack Auth, no Descope. API Keys + JWT only.

---

## 22. Resolution of All Conflicts (§14)

| Conflict                                         | v1.0 FINAL Decision                                                                                                                                                  | Status     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| §14.1 Storage/runtime (4 backends)               | **100% Cloudflare** — D1, DO, KV, R2, Vectorize, AI Search, Queues. No Supabase/Vercel/AWS/Neon as canonical. Supabase is current adapter, wrapped behind `db-gate`. | **Locked** |
| §14.2 Auth model (Clerk vs JWT)                  | **API Keys (external) + JWT (internal)**, service bindings internal, same code path. Clerk/Stack/Descope removed.                                                    | **Locked** |
| §14.3 Frontend host                              | `apps/web` (Vite + React + shadcn/ui) on Cloudflare Pages. Not Next.js. Not Replit.                                                                                  | **Locked** |
| §14.4 Product framing ("not a platform")         | DECISION 23 superseded. Product = "IW Continuity Bridge"; Category = "The Operational Continuity Platform".                                                          | **Locked** |
| §14.5 Layer model (4-layer vs 10-layer vs L0-L3) | **4-layer = conceptual law** (§3); **0-16 = physical topology** (§7); 10-layer and L0-L3 retired.                                                                    | **Locked** |
| §14.6 Capability-first APIs                      | Named endpoints: `entity/:type/:id`, `memory/query`, `twin/propose`, `signals`, `insights`, `predictions`, `handoff`, `stream` (WS), `mcp`, `health`.                | **Locked** |
| §14.7 Domains                                    | `integratewise.ai` (canonical). `integrate-voice.ai` (GTM landing) is a redirect to main.                                                                            | **Locked** |
| §14.8 Twin model provider                        | **gpt-5-mini via OpenRouter** (default). Grok available as config option. DECISION 30 superseded.                                                                    | **Locked** |
| §18.2 "Platform" branding vs DECISION 23         | Platform = category; Bridge = product name. Both coexist.                                                                                                            | **Locked** |
| §18.3 Integration Manager vs existing services   | Folded into §5 Continuity Bridge (Connector Pool + MCP Pool + Discovery Catalog + Normalization + Schema AI). Not a separate 4th service.                            | **Locked** |
| §18.4 One-auth vs per-tool Nango                 | **Both, at different layers:** "Connect Once" at surface; Nango is the Credential Wall underneath.                                                                   | **Locked** |
| §18.5 Lens naming                                | **8 lenses (FINAL):** Sales, CS, Finance, Executive, Architecture, Operations, Personal, Developer.                                                                  | **Locked** |
| §18.6 ADK vs Twin naming                         | **ADK is canonical** — lives in §11 Capability Runtime alongside Twin. No clash.                                                                                     | **Locked** |
| §20.3 "Platform" in title vs DECISION 23         | DECISION 23 retired. Title = "Platform Architecture".                                                                                                                | **Locked** |
| §20.3 Numbered (0-16) vs un-numbered (names)     | **Names for doctrine, numbers for implementation topology** — both canonical, different purposes.                                                                    | **Locked** |
| §20.3 Lens taxonomy mismatch                     | **8 lenses above** adopted.                                                                                                                                          | **Locked** |
| §20.3 Memory scopes (3 sets)                     | **FINAL 4:** Personal, Work, Organization, AI. Audit = cross-cutting Compliance.                                                                                     | **Locked** |
| §21.3 Twin reframed as Operational Participant   | Adopted: "always working, never idle, accountable like an employee."                                                                                                 | **Locked** |
| §22.4 L1-L4 definitions                          | **Pinned:** L1 = projection/read, L2 = intelligence/insight, L3 = operation/execution, L4 = full continuity/autonomous participation.                                | **Locked** |

---

## 23. GTM & Positioning

### 23.1 Category & Positioning

- **Category claim:** "The Operational Continuity Platform — the infrastructure layer that preserves context, memory, and governance across every tool, every person, and every AI."
- **Competitive frame:** high structure × high intelligence × human-first workbench. "They connect apps; we connect context."
- **Anti-positioning:** Not "AI-powered platform," not "no-code automation," not "replace your tools," not "chat with your data." Instead: human workbench + assistive AI + governed context.

### 23.2 Customer-Zero GTM (Acme Corp)

- **Two-app kill shot:** Salesforce + Slack, read-only, approval-required, 90-day retention.
- **Win condition:** One workspace auth → CS Workbench shows cross-system account context in < 60s → Twin proposes ≥1 insight/day → VP CS answers "what's our risk?" without opening Salesforce or Slack → adding a 3rd app is an "enable" toggle, not a project.
- **Distribution:** Through AI assistant marketplaces (ChatGPT GPT Store, Claude connectors, Perplexity apps) — we list as an MCP app, users discover inside the assistant they already use.
- **Do NOT build for CZ:** marketplace UI, partner portal, public connector directory, per-app OAuth flows, frontend→app direct calls.

---

## 24. Closing Checklist (Before Publish)

- [ ] Close P0 #1–10 (§19)
- [ ] Remove all `@supabase/supabase-js` imports (DECISION 22 completion)
- [ ] Remove all Clerk/Stack Auth/Descope imports (§20.2)
- [ ] Lock MCP-JWT on all inbound endpoints (`/tools`, `/invoke`, `/mcp`, `/sessions`)
- [ ] Implement `withTenant()` helper on all D1 queries (`packages/spine-schema`)
- [ ] Hard `WHERE tenant_id = ?` in every service query
- [ ] Fix HITL DO to use `idFromName(tenant_id + user_id)`
- [ ] Move all secrets to Cloudflare Secrets (no `.env` in repo)
- [ ] Verify `spine_audit_log` write failure halts sync (fail-loud)
- [ ] Confirm gpt-5-mini via OpenRouter as default Twin model
- [ ] Verify 8-lens taxonomy in Discovery response
- [ ] Confirm 4 memory scopes: Personal, Work, Organization, AI
- [ ] Test one-connection MCP config (read-only default, write via governance)
- [ ] Test outbound MCP pool with Entity360 injection
- [ ] CI/CD: GitHub Actions → typecheck → test → wrangler deploy
- [ ] Documentation: `README.md` + `ARCHITECTURE.md` + `SECURITY.md` + `API.md`
- [ ] Template repository enabled in GitHub settings

---

## 25. The One Invariant

> Identity gates the door. Discovery advertises the capabilities. Integration Manager is the only hand that touches outside tools. Spine is the only place context is written. Govern sits between reasoning and execution. Memory is scoped and compounds. Agents and tools coordinate through the Spine, never directly. Every hop carries `tenant_id`.

---

**END OF DOCUMENT**

_IntegrateWise Continuity Bridge — Canonical Architecture Specification v1.0.0-FINAL. All prior documents, diagrams, and decisions are superseded by this version where they conflict._
