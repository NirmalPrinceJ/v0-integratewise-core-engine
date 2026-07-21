# IntegrateWise Continuity Bridge — One Full Prompt to Replit

> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md)  
> _This document is downstream of the canonical architecture. Refer to the canonical source for current truth._

> **Handoff package.** This is the single source of truth. Everything built must be traceable to a section here. If a decision conflicts with this doc, this doc wins.

---

## 1. The One-Liner (What We Are Building)

**The OODA Engine for Business Continuity.**

A multi-tenant continuity bridge that preserves organizational context, memory, governance, and execution across all tools, humans, and AI agents — through one stable continuity contract. Consumers (humans, ChatGPT, Claude, Cursor) connect once. The Bridge connects to everything else.

**Doctrine:** _Truth you own. AI you rent. Approval in between._

**Core Loop (OODA):** Every tool, every user, every AI agent runs the same four-phase decision cycle:

1. **Observe** — Read from the Spine (unified context)
2. **Orient** — Assemble Entity360 + Memory + Knowledge
3. **Decide** — Propose action, score confidence, govern
4. **Act** — Execute approved action, writeback to Spine, compound memory

**The product is not a platform.** It is a **Continuity Bridge**. The category is **The Operational Continuity Platform**.

---

## 2. What Exists (The Live Repo)

You are continuing from the `integratewise-live/` codebase. It contains:

- **19 of 26 services** as Cloudflare Workers (with `wrangler.toml`)
- **Vite + React frontend** (`apps/web`) with shadcn/ui
- **MCP connector** (`services/mcp-connector/`) with test endpoint
- **Massive connector catalog** (`packages/connectors/` — 50+ providers)
- **Normalizer** (`services/normalizer/`) with NA0-NA5 pipeline skeleton
- **Governance** (`services/govern/`) with confidence gate
- **Think** (`services/think/`) — cognitive brain engine
- **Supabase deeply entangled** as current relational store
- **Marketing page bloat** (50+ pages in frontend that belong on Webflow)

**You do NOT start from zero.** You complete, cleanup, and deploy what exists.

---

## 3. The Cleanup (Do This First)

Run these commands immediately. Do not build new features until this is done.

```bash
# 1. Delete marketing page bloat (moves to Webflow, not in app)
rm -rf apps/web/src/components/landing/
rm -rf apps/web/src/components/landing/v2/
rm -rf apps/web/src/components/landing/v3/
rm -rf apps/web/src/components/marketing-site/
rm -rf apps/web/src/components/site/
rm -rf apps/web/src/components/marketing/
rm -rf apps/web/src/components/landing/ui/

# 2. Delete migration artifacts
rm -rf apps/web/src/shims/
rm -rf apps/web/test-results/
rm -f apps/web/SHIM_MODULES_CREATED.md

# 3. Delete legacy Node.js servers (Worker is canonical)
rm -rf services/knowledge/server/

# 4. Delete empty/minimal packages
rm -rf packages/hub/
rm -rf packages/website/

# 5. Delete old architecture docs (superseded by this prompt)
rm -f ARCHITECTURE_OVERVIEW.md ARCHITECTURE_OVERVIEW_CORRECTED.md \
  BUSINESS_OPS_SCHEMA_PLAN.md CONNECTOR_CS_SUPPORT_REPORT.md \
  CONNECTOR_IMPLEMENTATION_REPORT.md IMPLEMENTATION_SUMMARY.md \
  REPOSITORY_MAP.md REPOSITORY_TREE.txt CLAUDE.md AGENTS.md \
  WORK_COMPLETE_SUMMARY.md bitbucket-pipelines.yml \
  bitbucket-pipelines-production.yml

# 6. Delete Clerk traces (auth migration incomplete)
rm -f sql-migrations/flow-a/029_clerk_auth_schema.sql

# 7. Remove .env from git (SECURITY P0)
git rm --cached .env 2>/dev/null || true
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore

# 8. Remove build artifacts from git
find . -name "tsconfig.tsbuildinfo" -exec git rm --cached {} \;
echo "*.tsbuildinfo" >> .gitignore

# 9. Consolidate duplicate packages
# packages/tenancy/ → merge into services/tenants/ or packages/types/
# packages/webhooks/ → merge into services/webhook-ingress/
# packages/connector-contracts/ + packages/connector-utils/ → merge into packages/connectors/
# packages/db/ (supabase.ts) → migrate to packages/lib/db-gate.ts, then delete

# 10. Commit
git add -A
git commit -m "chore: canonical cleanup — delete marketing bloat, migration artifacts, Clerk traces, .env, build artifacts. Consolidate duplicate packages."
```

---

## 4. The Architecture (4 Layers, 26 Services)

### 4.1 Conceptual Layers (Trust Boundaries)

```
Consumers  ↔  Continuity Bridge  ↔  Continuity Kernel  ↔  Provider Fabric
```

| Layer                 | What It Is                                                                                       | What Consumers See                                     |
| --------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| **Consumers**         | Humans, AI assistants (ChatGPT, Claude, Cursor), apps, tools                                     | One MCP connection, one JWT, one web workbench         |
| **Continuity Bridge** | Public interface: identity, auth, discovery, projections, capabilities, governance entry, events | Identity, Discovery, Projections, Capabilities, Events |
| **Continuity Kernel** | Internal context substrate: Spine, Memory, Knowledge, Context, Governance, Workflow              | Nothing. Consumers never import internal topology.     |
| **Provider Fabric**   | Replaceable external execution: SaaS, databases, APIs, queues, agents                            | Nothing. Entirely behind the Kernel.                   |

### 4.2 The 26 Services (Physical Topology)

All 26 are Cloudflare Workers with `wrangler.toml`. All wired into `gateway` as service bindings.

#### Tier 0 — Ingress & Routing

| Service           | Worker Name             | Purpose                                                          | Binding Name      |
| ----------------- | ----------------------- | ---------------------------------------------------------------- | ----------------- |
| `gateway`         | `integratewise-gateway` | Single entry; JWT validation; tenant routing; rate-limit         | N/A (entry)       |
| `webhook-ingress` | `iw-webhook-ingress`    | Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub) | `WEBHOOK_INGRESS` |

#### Tier 1 — Tenant & Sync

| Service          | Worker Name         | Purpose                                 | Binding Name     |
| ---------------- | ------------------- | --------------------------------------- | ---------------- |
| `tenants`        | `iw-tenants`        | Multi-tenant context, RBAC, plan limits | `TENANTS`        |
| `connector-sync` | `iw-connector-sync` | Orchestrates connector sync             | `CONNECTOR_SYNC` |
| `normalizer`     | `iw-normalizer`     | 8-stage NA0–NA5 pipeline                | `NORMALIZER`     |

#### Tier 2 — Projection & Rendering

| Service             | Worker Name            | Purpose                                    | Binding Name        |
| ------------------- | ---------------------- | ------------------------------------------ | ------------------- |
| `pipeline`          | `iw-pipeline`          | **ONLY writer to the Spine**               | `PIPELINE`          |
| `twin-orchestrator` | `iw-twin-orchestrator` | **OODA Engine** — persistent per-user DO   | `TWIN_ORCHESTRATOR` |
| `l2`                | `iw-l2`                | Department × industry overlay projections  | `L2`                |
| `intelligence`      | `iw-intelligence`      | Analytics, insights, signal generation     | `INTELLIGENCE`      |
| `knowledge`         | `iw-knowledge`         | Knowledge base, docs, semantic search      | `KNOWLEDGE`         |
| `govern`            | `iw-govern`            | Governance rules engine, approval gates    | `GOVERN`            |
| `store`             | `iw-store`             | Persistence for projections                | `STORE`             |
| `act`               | `iw-act`               | Action execution / write-back to providers | `ACT`               |

#### Tier 3 — Capability Runtime & Orchestration

| Service            | Worker Name        | Purpose                                    | Binding Name       |
| ------------------ | ------------------ | ------------------------------------------ | ------------------ |
| `hermes`           | `iw-hermes`        | Message queue + execution engine (DO)      | `HERMES`           |
| `triage`           | `iw-triage`        | Confidence routing + active-memory decay   | `TRIAGE`           |
| `workflow`         | `iw-workflow`      | Durable orchestration (pause, retry, saga) | `WORKFLOW`         |
| `iw-agent-runtime` | `iw-agent-runtime` | MCP-compliant AI agent execution           | `IW_AGENT_RUNTIME` |
| `mcp-connector`    | `iw-mcp-connector` | MCP bridge: external agents → scoped Spine | `MCP_CONNECTOR`    |

#### Tier 4 — Supporting

| Service          | Worker Name         | Purpose                                      | Binding Name     |
| ---------------- | ------------------- | -------------------------------------------- | ---------------- |
| `agent-registry` | `iw-agent-registry` | Catalog of available agents                  | `AGENT_REGISTRY` |
| `billing`        | `iw-billing`        | Usage tracking + plan enforcement            | `BILLING`        |
| `admin`          | `iw-admin`          | Platform admin, tenant mgmt                  | `ADMIN`          |
| `loader`         | `iw-loader`         | Cold-start pre-loader, Nango webhook handler | `LOADER`         |
| `folder-watcher` | `iw-folder-watcher` | DO filesystem watcher                        | `FOLDER_WATCHER` |
| `continuity`     | `iw-continuity`     | Memory consolidation + decay                 | `CONTINUITY`     |
| `telemetry`      | `iw-telemetry`      | Traces, metrics, observability               | `TELEMETRY`      |
| `think`          | `iw-think`          | LLM reasoning orchestration                  | `THINK`          |
| `connector`      | `iw-connector`      | OAuth callback handler (Nango)               | `CONNECTOR`      |
| `spine-v2`       | `iw-spine-v2`       | Spine normalization & graph                  | `SPINE_V2`       |

### 4.3 The 17-Layer Physical Stack (0–16)

| #   | Layer                       | Services                                                           | Storage                                                 |
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
| 16  | **Endpoint Registry**       | `gateway` (serves), `intelligence` (updates)                       | KV + D1 `endpoint_registry`                             |

**Cross-cutting:** Security (WAF, TLS, CF Secrets, Zero Trust), Observability, Reliability (idempotency, retries, DLQ, backpressure), Compliance (audit & lineage, retention, encryption, tenant isolation).

---

## 5. The OODA Engine (Core Mental Model)

Every tool, every user, every AI agent runs this loop:

```
OBSERVE ──► ORIENT ──► DECIDE ──► ACT ──► (memory compounds) ──► OBSERVE...
```

### Phase 1: OBSERVE

- **What:** Ingest signals from webhooks, sync polls, user actions, file changes
- **Who:** `webhook-ingress`, `connector-sync`, `folder-watcher`
- **Output:** Raw payload → `PIPELINE_QUEUE`

### Phase 2: ORIENT

- **What:** Assemble Entity360 + Memory + Knowledge into context
- **Who:** `normalizer` (NA0–NA5), `intelligence` (Context Assembly), `knowledge` (RAG)
- **Output:** Normalized entity + enriched context

### Phase 3: DECIDE

- **What:** Twin reasons, proposes action, governance scores confidence
- **Who:** `twin-orchestrator` (OODA engine), `govern` (confidence gate)
- **Rules:**
  - ≥ 0.85 → Auto-approve → `ACT_QUEUE`
  - 0.70 – 0.85 → My Desk review → human approves/rejects
  - < 0.70 → Discard → `spine_audit_log` (discard reason)

### Phase 4: ACT

- **What:** Execute approved action, writeback to Spine, update memory
- **Who:** `act` (execution), `integration-router` (provider adapter), `continuity` (memory promotion)
- **Output:** Outcome written to Spine → compounding memory for next loop

**The Twin runs this loop continuously (hourly cron) for every user.** The workbench runs it on every interaction. Every connected tool runs it on every event. The difference is speed: tool = milliseconds, Twin = minutes, user = seconds.

---

## 6. The Two Planes (North / South)

```
Consumers → [Gateway] → Spine → [Integration Router] → Provider Tools
             (North)                   (South)
```

**North Plane (Ingress):** `gateway` + `mcp-connector` (inbound MCP). All consumers enter here. JWT validation. Tenant routing. Discovery. Rate-limit.

**South Plane (Egress):** `act` + Integration Router. Only service that touches external APIs. Adapter selection: Nango (OAuth-mature), MCP (AI-native), Native (direct REST). Entity360 context injected on outbound.

**Rule:** Neither plane talks to the other except **through the Spine**.

---

## 7. MCP Pool (Bidirectional, First-Class)

### 7.1 Inbound MCP Pool (North Plane)

**Endpoint:** `mcp.integratewise.ai/v1/mcp` (SSE/stdio)
**Role:** AI assistants (ChatGPT, Claude, Cursor, Perplexity) connect **to us** to read scoped Spine/Memory.
**Primary ingress:** This is the **primary** front door. Traditional SaaS webhooks are secondary.

**Server implementation:**

```typescript
// services/mcp-connector/src/index.ts (inbound MCP server)

import { Hono } from "hono";
import { verifyGatewayJWT } from "./auth";

const app = new Hono();

// SSE endpoint for MCP transport
app.post("/sessions", async (c) => {
  const jwt = await verifyGatewayJWT(c.req.header("Authorization"));
  const tenantId = jwt.tenant_id; // FROM JWT CLAIM, never client payload
  const scope = await getMCPToolCatalog(tenantId); // from Discovery
  return c.json({ sessionId, tools: scope, readOnly: true });
});

app.post("/invoke", async (c) => {
  const { sessionId, tool, params } = await c.req.json();
  const sessionTenant = await resolveTenantFromSession(sessionId); // KV lookup
  const jwtTenant = c.get("jwt").tenant_id;

  // P0: Cross-tenant session reuse = 403 (fail-loud, not 404)
  if (jwtTenant !== sessionTenant) {
    return c.json({ error: "Cross-tenant access denied" }, 403);
  }

  // Read-only default. Write requires governance approval.
  const result = await executeCapability(tenantId, tool, params);
  await auditLog({ via: "mcp", tenantId, tool, outcome: result });
  return c.json(result);
});

// P0: Every endpoint requires Bearer JWT
// P0: x-tenant-id extracted from JWT, never from client payload
// P0: Tool catalog filtered by Discovery (tenant sees only their capabilities)
// P0: Every invocation logged to spine_audit_log
```

**Consumer Config (the ONLY MCP entry users need):**

```json
{
  "mcpServers": {
    "integratewise": {
      "type": "sse",
      "url": "https://mcp.integratewise.ai/v1/mcp",
      "headers": {
        "Authorization": "Bearer ${input:integratewise_jwt}"
      },
      "description": "IntegrateWise Continuity Bridge — OODA Engine for Business Continuity"
    }
  },
  "inputs": [
    {
      "id": "integratewise_jwt",
      "type": "promptString",
      "description": "IntegrateWise Gateway JWT — from Settings → API Keys",
      "password": true
    }
  ]
}
```

**Key rule:** One entry. Not 21. Not 5. One. The Bridge routes to 20+ providers internally.

### 7.2 Outbound MCP Pool (South Plane)

Inside Integration Router. We connect **to provider MCP servers** (Salesforce MCP, Slack MCP, GitHub MCP). Entity360 context injected before outbound call.

---

## 8. Frontend: One Full UI (Not Marketing Pages)

### 8.1 Tech Stack

- **Vite** (not Next.js, not Replit)
- **React 18** + **TypeScript**
- **shadcn/ui** (installed, used in `components/ui/`)
- **Tailwind CSS**
- **Deploy target:** Cloudflare Pages (`wrangler.toml` in `apps/web/`)
- **API client:** `@integratewise/sdk` (packages/sdk/) — capability-first, NEVER direct Supabase calls

### 8.2 What to Build (8 Lenses, Not 12)

The workbench has **8 projections** (lenses). Not 12 departments. The 12 department directories in `components/domains/` map to these 8:

| Canonical Lens   | Maps From (existing dirs)                       | Workbench Route           |
| ---------------- | ----------------------------------------------- | ------------------------- |
| **Sales**        | `domains/sales/`, `domains/salesops/`           | `/workbench/sales`        |
| **CS**           | `domains/account-success/`                      | `/workbench/cs`           |
| **Finance**      | `domains/finance/`                              | `/workbench/finance`      |
| **Executive**    | `domains/revops/`, `domains/bizops/`            | `/workbench/executive`    |
| **Architecture** | `domains/product-engineering/`                  | `/workbench/architecture` |
| **Operations**   | `domains/business-ops/`, `domains/procurement/` | `/workbench/operations`   |
| **Personal**     | `domains/personal/`                             | `/workbench/personal`     |
| **Developer**    | `domains/it-admin/`                             | `/workbench/developer`    |

**Delete or merge:** `marketing/`, `student-teacher/`, `service/` (map to CS or Operations).

### 8.3 Core Components to Build/Wire

| Component        | Purpose                                              | Data Source                                        |
| ---------------- | ---------------------------------------------------- | -------------------------------------------------- |
| `Entity360`      | Complete view of any entity (account, deal, contact) | Gateway SDK → `spine.entity.get`                   |
| `TwinRail`       | Inline proposal panel (right side)                   | Gateway SDK → `twin.propose`                       |
| `ProposalCard`   | Approve/Modify/Dismiss                               | Gateway SDK → `governance.decide`                  |
| `SignalFeed`     | Real-time notifications                              | WebSocket or polling → `signal.list`               |
| `MyDesk`         | Approval queue (0.70–0.85 proposals)                 | Gateway SDK → `proposal.list` + `proposal.approve` |
| `CommandPalette` | Quick actions, search                                | Gateway SDK → `discovery` + `capability.invoke`    |
| `DomainSidebar`  | Role-based navigation                                | Gateway SDK → `discovery.projections`              |

### 8.4 Hooks to Implement

```typescript
// hooks/useDiscovery.ts
// Called once on app load. Cached 5 minutes.
// Returns: identity, tenant, workspace, projections, capabilities, features, limits
export function useDiscovery() { ... }

// hooks/useEntity360.ts
// Fetches complete entity view across all connected tools
export function useEntity360(entityId: string) { ... }

// hooks/useTwinProposal.ts
// Submits to Twin, receives proposal with confidence
export function useTwinProposal(context: any) { ... }

// hooks/useCapability.ts
// Generic capability invoker (NEVER direct Supabase)
export function useCapability(capability: string, params: any) { ... }
```

---

## 9. The Swappable Layers (7× Agnostic Moat)

Every infrastructure layer is swappable. The Integration Manager owns the adapter selection.

| Dimension            | Default                       | Swappable To                         | Adapter File                     |
| -------------------- | ----------------------------- | ------------------------------------ | -------------------------------- |
| **Frontend**         | Vite + React (Pages)          | Next.js, Electron, React Native, iOS | `packages/lib/ui-adapter.ts`     |
| **Auth**             | Gateway JWT + API Keys        | Clerk, Stack, Descope, Auth0         | `packages/lib/auth-adapter.ts`   |
| **Relational Store** | Supabase PostgreSQL (current) | Neon, RDS, PlanetScale, HyperDrive   | `packages/lib/db-gate.ts`        |
| **Cache**            | Cloudflare KV                 | Redis, Upstash, DynamoDB             | `packages/lib/cache-adapter.ts`  |
| **Queue**            | Cloudflare Queues             | SQS, RabbitMQ, Kafka                 | `packages/lib/queue-adapter.ts`  |
| **AI / Model**       | OpenRouter (gpt-5-mini)       | Claude, Grok, Gemini, Ollama         | `packages/lib/openrouter.ts`     |
| **Deployment**       | Cloudflare Workers            | Vercel, Lambda, Fly.io, K8s          | `packages/lib/deploy-adapter.ts` |

**Current state:** `packages/lib/` already has `db-gate.ts`, `openrouter.ts`, `cache.ts`. Build the adapter interfaces to formalize swappability.

---

## 10. Database Schema (D1 + PostgreSQL via HyperDrive)

### 10.1 D1 (Operational + Cache)

- `spine_entities` — Canonical entities (see §14 of FINAL_E2E_SYSTEM.md)
- `governance_audit_log` — Immutable approval decisions
- `memory` — Active/staging/archived tiers
- `tenant_spine_config` — Per-tenant config
- `endpoint_registry` — Living API contract
- `rbac_roles`, `rbac_permissions` — Access control

**Rule:** Every query has `WHERE tenant_id = ?`. Cross-tenant = 403 (fail-loud).

### 10.2 PostgreSQL (Relational Graph — via HyperDrive or Supabase)

- The **Spine relational graph** (complex relationships, historical analytics) runs on PostgreSQL.
- Accessed through `packages/lib/db-gate.ts` (adapter pattern).
- Current: Supabase. Future: HyperDrive, Neon, RDS.
- **Migration path:** D1 for hot paths (<10ms), PostgreSQL for analytical queries and complex joins.

---

## 11. Security Posture (P0 Blockers — Close Before Live)

| #   | Vulnerability                    | Fix                                                                               | Owner Service             |
| --- | -------------------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| 1   | **Cross-tenant data leak**       | `WHERE tenant_id = ?` on every query. 403 fail-loud.                              | ALL services              |
| 2   | **Tenant-id spoofing**           | Extract `tenant_id` from JWT claim only. Strip client-provided `x-tenant-id`.     | `gateway`                 |
| 3   | **Tenant middleware no-op**      | Enforce service bindings carry `tenant_id` implicitly.                            | `gateway`                 |
| 4   | **HITL DO global singleton**     | `idFromName(tenant_id + user_id)`, not `"global"`                                 | `govern`                  |
| 5   | **Invitation cross-tenant scan** | Add `WHERE tenant_id = ?` to invitation lookup                                    | `tenants`                 |
| 6   | **Hardcoded secrets**            | Move to Cloudflare Secrets. Rotate any leaked.                                    | `admin`                   |
| 7   | **`.env` committed**             | `git rm --cached`, add `.gitignore`, scan history                                 | `admin`                   |
| 8   | **SQL injection**                | Use Drizzle ORM or parameterized queries. No raw string concat.                   | `continuity`, `knowledge` |
| 9   | **MCP-JWT bypass**               | Require `Authorization: Bearer <jwt>` on `/tools`, `/invoke`, `/mcp`, `/sessions` | `mcp-connector`           |
| 10  | **Auth root thrashing**          | Freeze on API Keys + JWT. Remove Clerk/Stack/Descope imports.                     | `gateway`                 |

**Audit rule:** Audit write failure stops the operation. No silent drops.

---

## 12. GTM Motion (Sign Up → Live in < 5 Minutes)

### 12.1 Distribution

- **Primary:** MCP app in ChatGPT Store, Claude connectors, Perplexity apps
- **Secondary:** Web landing (Webflow, not in app) → `app.integratewise.ai`
- **Tertiary:** Direct API signup for enterprise

### 12.2 Signup Flow

1. User clicks "Add IntegrateWise" in ChatGPT
2. MCP connects to `mcp.integratewise.ai/v1/mcp`
3. User authenticates (Google/GitHub/email) → Gateway issues JWT
4. Schema AI (gpt-5-mini) hydrates tenant: entity types, relationships, RBAC
5. D1 partition created, `tenant_spine_config` row, memory tables
6. User sees Discovery response: "Connect Salesforce" (one-click Nango)
7. **Target:** signup → workspace < 5 min; first tool < 10 min; normalizer p99 < 2s

### 12.3 Customer-Zero Kill Shot

- **Two apps:** Salesforce + Slack, read-only, approval-required, 90-day retention
- **Win:** VP CS answers "what's our risk?" without opening Salesforce or Slack
- **Land-and-expand:** 3rd app = "enable" toggle, not a project

---

## 13. Build Order (What to Do in Sequence)

### Week 1: Cleanup + Foundation

- [ ] Run all cleanup commands (§3)
- [ ] Close P0 #1–10 (security)
- [ ] Wrap all Supabase queries behind `db-gate.ts`
- [ ] Delete `packages/supabase/` (after migration)
- [ ] Verify `pnpm -r build` passes
- [ ] Verify `pnpm -r typecheck` passes

### Week 2: Core Services

- [ ] Build `twin-orchestrator` DO (OODA engine)
- [ ] Build `hermes` (message queue wrapper around Queues)
- [ ] Build `triage` (confidence routing)
- [ ] Wire `twin-orchestrator` → `govern` → `act` → Spine
- [ ] Implement `useDiscovery`, `useEntity360`, `useTwinProposal` hooks

### Week 3: MCP + Frontend

- [ ] Harden MCP-JWT on all inbound endpoints
- [ ] Build `TwinRail`, `ProposalCard`, `SignalFeed` components
- [ ] Delete all marketing pages from frontend
- [ ] Consolidate 12 departments → 8 lenses
- [ ] Deploy frontend to Cloudflare Pages

### Week 4: Integration + Polish

- [ ] Build Integration Manager (adapter selection layer)
- [ ] Test end-to-end: Salesforce → Normalizer → Spine → Twin → Govern → Act → Writeback
- [ ] Performance: p99 < 2s for normalizer, < 10ms for Entity360 cache hit
- [ ] Deploy all services via `wrangler deploy`
- [ ] CI/CD: GitHub Actions → typecheck → test → deploy

---

## 14. Reference Documents (In Repo)

| Document              | Purpose                              | Location                           |
| --------------------- | ------------------------------------ | ---------------------------------- |
| `FINAL_E2E_SYSTEM.md` | Canonical architecture specification | `/docs/FINAL_E2E_SYSTEM.md`        |
| `L1_REALITY_CHECK.md` | Audit of actual codebase vs. canon   | `/docs/L1_REALITY_CHECK.md`        |
| `REALITY_AUDIT.md`    | Detailed repo structure analysis     | `/docs/REALITY_AUDIT.md`           |
| `OODA_ENGINE.md`      | OODA loop formalization              | **To be created from this prompt** |

---

## 15. The One Command to Deploy

```bash
# After cleanup and build:
pnpm -r build
pnpm deploy:gateway
pnpm deploy:mcp-server
pnpm deploy:workbench
pnpm deploy:workers  # all 26

# Verify:
curl https://mcp.integratewise.ai/v1/health
curl https://api.integratewise.ai/api/v1/discovery -H "Authorization: Bearer $JWT"
```

---

## 16. What NOT to Build

| Do NOT Build                             | Why                                             | Where It Goes Instead                                                                                                          |
| ---------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Marketing pages (landing, pricing, blog) | Bloats app, slows deploy                        | Webflow (`integratewise.ai`)                                                                                                   |
| Marketplace UI                           | We list in THEIR marketplaces (ChatGPT, Claude) | Not our app                                                                                                                    |
| Partner portal                           | Not needed for CZ                               | Future, not now                                                                                                                |
| Per-app OAuth flows                      | Nango handles this                              | `services/connector/`                                                                                                          |
| Frontend → direct DB calls               | Violates architecture                           | Always through Gateway SDK                                                                                                     |
| Clerk / Stack Auth                       | Auth root thrashing                             | Gateway JWT (internal) + Descope (canonical external identity + outbound authorization authority); Nango dormant compatibility |
| Next.js migration                        | Already on Vite                                 | Vite is canonical                                                                                                              |
| 12 department lenses                     | Canon locks 8                                   | Merge 12 → 8                                                                                                                   |

---

## 17. Closing Statement

**Build the OODA Engine.**

Observe everything. Orient into context. Decide with confidence. Act with governance. Compound memory every cycle. Deploy to Cloudflare. One MCP connection. One JWT. One Bridge.

**The last auth for endless continuity.**

---

_Version: 1.0.0-CANONICAL_  
_Date: 2026-07-02_  
_Status: LOCKED — all §14 conflicts resolved_  
_Handoff target: Replit agent for live deployment_
