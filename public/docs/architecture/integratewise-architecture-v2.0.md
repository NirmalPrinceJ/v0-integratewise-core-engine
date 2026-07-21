# IntegrateWise Continuity Bridge — Canonical Architecture Specification v2.0

> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md)  
> _This document is downstream of the canonical architecture. Refer to the canonical source for current truth._

> **Status:** LOCKED — Supersedes v1.0.1-FINAL, FINAL_E2E_SYSTEM.md, and all prior documents
> **Date:** 2026-07-03
> **Product:** One click to make tools and AI work for humans.
> **Doctrine:** Truth you own. AI you rent. Approval in between.
> **Moat:** The Continuity Layer — time-accumulated memory, entity graph, and workflow intelligence.

---

## 0. The System in One View

> **"The system connects tools with one auth, unifies data into a single source of truth, lets users work on that truth in their own workbench, and gives the AI a home where it watches, learns, reasons, proposes, and grows — every day, forever."**

### 0.1 The 6-Step Flow

The user experience is a single continuous loop. Every day the system is smarter. Every day the AI knows more. Every day the user works faster.

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ CONNECT │────▶│ HYDRATE │────▶│  WORK   │────▶│   AI    │────▶│ MEMORY  │────▶│ REPEAT  │
│  (Auth) │     │ (Data)  │     │ (Bench) │     │(Propose)│     │(Compound)│    │(Smarter)│
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
```

| Step                        | What the User Feels                         | What the System Does                                                                                                 |
| --------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **1. CONNECT**              | "One click and Salesforce is here."         | Integration Manager handles auth, adapter selection, and capability registration.                                    |
| **2. HYDRATE**              | "My data just... appeared."                 | Data flows through the Normalizer (8-stage pipeline) into the Spine. Entities resolved. SSOT built. Workbench ready. |
| **3. WORK**                 | "One workbench. All tools. One truth."      | User works on unified data — no tab switching, no context loss. 8 projections (lenses) adapt to role.                |
| **4. AI BECOMES PROACTIVE** | "The AI knew what I needed before I asked." | Twin watches the same SSOT. Proposes actions. Helps with daily tasks.                                                |
| **5. MEMORY**               | "It remembers everything."                  | Human knowledge + AI knowledge live on the Spine. Memory compounds every day.                                        |
| **6. REPEAT**               | "Every day it's smarter."                   | Triage worker runs nightly. Patterns reinforce. Decisions become permanent.                                          |

### 0.2 The 6-Layer Architecture with OODA Overlaid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — PRODUCT            │  What the user sees. The Workbench. 8 lenses.  │
│  (§1)                         │  The Twin's 5 communication channels.            │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — IDENTITY           │  Who. JWT + API Keys. RBAC. Tenant isolation.  │
│  (§2)                         │  Session management. Revocation.                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3 — INGRESS            │  How. Gateway. Rate limiting. Transport.       │
│  (§3)                         │  SSE / WebSocket / MCP / Webhooks. Discovery.    │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 4 — CAPABILITY         │  What. Capability Registry. Platform SDK.        │
│  (§4)                         │  Context Assembly (Entity360). Execution Routing. │
│                               │  ◄── OODA: OBSERVE + ORIENT (part) ───►       │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 5 — CONTINUITY         │  Context. Adaptive Spine. Memory. Knowledge.   │
│  (§5)                         │  The Moat. Pipeline is the ONLY writer.          │
│                               │  ◄── OODA: ORIENT (core) ───►                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 6 — GOVERNANCE         │  Approval. 0.70/0.85 confidence law. HITL.     │
│  (§6)                         │  Audit. Compliance.                              │
│                               │  ◄── OODA: DECIDE ───►                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 7 — PROVIDER FABRIC    │  Execution. Adapter pattern. Credential wall.  │
│  (§7)                         │  Circuit breaker. Entity360 injection. T2T.      │
│                               │  ◄── OODA: ACT ───►                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  CROSS-CUTTING: OODA RUNTIME  │  Observe → Orient → Decide → Act → Learn       │
│  (§8)                         │  Memory compounding closes the loop.              │
├─────────────────────────────────────────────────────────────────────────────┤
│  CROSS-CUTTING: ECOSYSTEM     │  Capability fabric. KSP. A2A. SDK variants.      │
│  (§9)                         │  App composition. Why it multiplies the moat.      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 0.3 The Spine — 3 Layers

The Spine is the single source of truth. It is not a database — it is a **living graph** of everything the system knows.

| Layer       | Name        | What Lives Here                             | Storage             | Access Pattern    |
| ----------- | ----------- | ------------------------------------------- | ------------------- | ----------------- |
| **Layer 1** | Simple Data | Structured fields, numbers, dates, statuses | D1 (SQLite)         | CRUD via Pipeline |
| **Layer 2** | Rich Data   | Files, images, documents, conversations     | R2 (object storage) | Blob read/write   |
| **Layer 3** | Knowledge   | Human + AI knowledge, patterns, decisions   | D1 + Vectorize + KV | Semantic search   |

The Spine is **provider-agnostic**. A Salesforce Account and a HubSpot Company both resolve to `entity_type = 'organization'` with distinct `provider_id` entries. The SSOC (Stable Single Object Canonical) UUID survives provider swaps.

### 0.4 The Moat Statement

> **The moat is the Continuity Layer.** Not the AI models (you rent those). Not the integrations (those are swappable). The moat is the time-accumulated context: the entity graph, the memory, the governance decisions, the workflow intelligence. Every day the system is smarter because memory compounds. A competitor can copy the code. They cannot copy your accumulated context.

### 0.5 Ecosystem Purpose

The Ecosystem Architecture (§9) exists because the value of the Bridge is not just what IntegrateWise builds — it is what **others build on it**. The ecosystem enables:

- **Capability Fabric:** A living registry of everything the workspace can do — connected tools, domain packs, shared features, platform primitives.
- **Knowledge Sharing Protocol (KSP):** How memory, context, and evidence move between agents, tools, and humans without leaking tenant boundaries.
- **Tool-to-Tool Communication:** Providers communicate through the Bridge, not peer-to-peer — governed, audited, and context-enriched.
- **Agent-to-Agent Communication:** Autonomous agents coordinate through the Spine as a shared blackboard, mediated by the ambient Twin layer.

---

## 1. The Product Layer (L1 — What the User Sees)

### 1.1 The One-Click Promise

> **"One click to make tools and AI work for humans."**

The product promise is deceptively simple: a user gives one authentication, and the system handles everything else. The Integration Manager (now a pattern, not a separate service — see §7) discovers the provider's capabilities, establishes the connection, manages consent, registers the provider in the Capability Fabric, and triggers a "creamy" (full historical) sync.

The user feels: _"I clicked 'Connect Salesforce' and 30 seconds later my data was here."_

The system does: OAuth handshake → credential wall storage → adapter registration → capability catalog update → discovery cache invalidation → sync job enqueue → normalizer pipeline → Spine write → workbench projection refresh.

### 1.2 The Workbench — Where Real Work Happens

The Workbench is the user's unified workspace. It is not a data viewer — it is a **working surface** where the user acts on unified data without switching contexts.

**Workbench Principles:**

- One workbench. All tools. One truth. No tab switching. No context loss.
- The workbench reads from the Spine (via `store` and `l2` service bindings)
- The workbench queries the Capability Fabric to know what actions are available
- The Twin enriches the workbench with inline insights (see §1.5)
- Every action is governed (§6) and audited (§5.10)

**Workbench Architecture:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           THE WORKBENCH                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Entity Explorer │  │  Detail Pane    │  │  Action Panel   │              │
│  │  (Spine query)   │  │  (Entity360)    │  │  (Capability    │              │
│  │                  │  │                 │  │   Fabric)       │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  TWIN ENRICHMENT (inline insights, proposals, context)     │           │
│  └─────────────────────────────────────────────────────────────┘           │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  MEMORY PANEL (what the system knows about this entity)    │           │
│  └─────────────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 The 8 Projections (Lenses)

Projections are persona-specific views into the Spine. They are **not** separate data stores — they are filtered, enriched, and formatted queries against the same underlying SSOT.

| Projection           | Audience          | Primary Entities                         | Key Capabilities                                  |
| -------------------- | ----------------- | ---------------------------------------- | ------------------------------------------------- |
| **Sales**            | AEs, SDRs         | accounts, contacts, deals, opportunities | forecast, pipeline health, next-best-action       |
| **Customer Success** | CSMs, TAMs        | accounts, health scores, tickets, NPS    | churn risk, expansion signals, playbooks          |
| **Finance**          | Finance, RevOps   | invoices, subscriptions, MRR, metrics    | billing reconciliation, revenue recognition       |
| **Executive**        | C-suite, VPs      | KPIs, trends, forecasts, alerts          | dashboards, anomaly detection, strategic insights |
| **Architecture**     | Engineers, PMs    | projects, sprints, PRs, docs             | tech debt, delivery velocity, resource allocation |
| **Operations**       | Ops, Admin        | workflows, connectors, sync status       | data quality, automation health, governance       |
| **Personal**         | Individual user   | tasks, calendar, reminders, notes        | daily briefing, task suggestions, time management |
| **Developer**        | Platform builders | API, SDK, webhooks, capabilities         | debugging, testing, extension development         |

Each projection is implemented as a **materialized view** in D1, updated by the Projection Pipeline (§13.7). The `l2` service serves projection queries from KV cache when possible, D1 when stale.

### 1.4 Essential User Work (Non-AI, Deterministic)

Not everything is AI. The Workbench supports essential, deterministic work that humans do every day:

- **Entity CRUD:** Create, read, update, archive entities in the Spine (via `store` → `pipeline`)
- **Relationship editing:** Link entities (e.g., "this contact belongs to that account")
- **Task management:** Create and manage tasks, assign owners, set due dates
- **Document attachment:** Upload files to R2, link to entities via Spine relationships
- **Projection switching:** Change lens (e.g., from Sales to CS) without losing context
- **Approval workflow:** Review and act on proposals in My Desk (§6.3)
- **Search:** Full-text search across entities, memory, and knowledge

All of these are **non-AI** paths that work even when the Twin is offline. They write to the Spine via the Pipeline. They are governed by the same rules. They are audited.

### 1.5 The Twin's 5 Communication Channels

The Twin communicates with the user through 5 distinct channels. Each channel has a purpose, a tone, and a governance boundary.

| Channel                     | Purpose                                        | Interface                       | Governance                                        |
| --------------------------- | ---------------------------------------------- | ------------------------------- | ------------------------------------------------- |
| **1. Proposals**            | "I think you should do X."                     | Approvals Workbench (My Desk)   | ≥0.85 auto-approve; 0.70–0.85 HITL; <0.70 discard |
| **2. Notifications**        | "Something happened that matters."             | Push, email, Slack              | Always allowed; no governance gate                |
| **3. Morning Briefing**     | "Here's what you need to know today."          | Daily summary (email / in-app)  | Read-only; no write side effects                  |
| **4. Workbench Enrichment** | "Here's context about what you're looking at." | Inline insights, Entity360 pane | Read-only; no governance gate                     |
| **5. Direct Messaging**     | "Let's talk."                                  | Slack / email / in-app chat     | Conversation memory; no auto-actions              |

**The Twin is AMBIENT.** It is not a separate service that users call. It is a reasoning quality that permeates Context Assembly, Memory, and Knowledge. The Twin lives in the `twin-orchestrator` Durable Object (one per `tenant_id + user_id`). It reasons over Spine context, proposes through Governance, and persists state in DO storage.

→ See §4.4 for the Twin runtime architecture.
→ See §5.6 for how the Twin reads and writes Memory.
→ See §6.3 for the HITL flow that governs Twin proposals.

### 1.6 Morning Briefing & Daily Rhythm

Every morning, the Twin generates a personalized briefing for each user. This is a **read-only, no-governance** operation.

**Briefing Content:**

- Overnight changes in the Spine (new entities, updated deals, health score changes)
- Open proposals awaiting review (in My Desk)
- Today's scheduled tasks and meetings
- Memory-reinforced suggestions ("You usually review this account on Tuesdays")
- Proactive insights ("3 accounts show churn risk this week")

**Briefing Pipeline:**

```
continuity service (cron trigger) → query active memory for user → assemble Entity360 for recent changes → think service (LLM summarization) → generate briefing → enqueue to notification queue → deliver via configured channel (email/Slack/in-app)
```

The Morning Briefing is the **daily compound moment** — the user starts their day with more context than the day before, because memory has grown overnight.

---

## 2. Identity Layer (L2 — Who Are You?)

> _"Identity gates the door. Every hop carries tenant_id."_

The Identity Layer is the first of two ingress layers. It answers the question: **Who is making this request, and what are they allowed to see?**

The Gateway is the sole entry point. No internal service accepts direct external traffic. Every request — from a human in the workbench, an AI assistant via MCP, a webhook from Salesforce, or a backend SDK call — passes through the Gateway, is authenticated, scoped to a tenant, and enriched with identity context before any internal service ever sees it.

### 2.1 Authentication (JWT + API Keys)

The Gateway accepts **exactly two** credential types. All others (Clerk, Stack Auth, Descope, Supabase Auth direct) are rejected at the edge.

| Credential Type | Header Format                      | Use Case                                          | Issuer                                   |
| --------------- | ---------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| **Gateway JWT** | `Authorization: Bearer <jwt>`      | Human users, AI assistants, frontend sessions     | `tenants` service (OAuth callback)       |
| **API Key**     | `Authorization: Bearer iwak_<key>` | Backend SDKs, automation scripts, external agents | `admin` service (provisioned per tenant) |

**Rejected patterns (403):**

- Missing `Authorization` header on protected routes
- `Basic` auth
- Provider-issued tokens (Salesforce session, GitHub token) — these belong in the Provider Fabric
- Expired JWT (returns 401 with `WWW-Authenticate: Bearer error="invalid_token"`)
- Revoked API key (checked against KV blacklist)

**JWT Specification (RS256, 2048-bit RSA):**

```typescript
export interface GatewayJwtPayload {
  jti: string; // Unique token ID — revocation tracking
  iss: "gateway"; // Issuer
  sub: string; // user UUID
  aud: string; // tenant slug or "integratewise" for platform admin
  iat: number; // Issued at
  exp: number; // Expiration (default 24h, refresh tokens 30d)
  tenant_id: string; // THE isolation boundary
  org_id: string; // Organization within tenant
  role: "owner" | "admin" | "member" | "viewer" | "api";
  scope: ("read" | "write" | "admin" | "webhook" | "mcp")[];
  sid: string; // Session ID — links to KV session store
  cid: string; // Correlation ID — propagated across all bindings
  tier: "free" | "pro" | "enterprise" | "customer_zero";
}
```

**JWT Lifecycle:**

```
User Login (OAuth2) → Identity Provider (Google/GitHub) → tenants Service (OAuth callback)
                                                                 │
                                                                 ▼
                                                        D1: users, orgs, tenants
                                                                 │
                                                                 ▼
                                                        RBAC Resolution → JWT Minting → Session Creation (KV)
                                                                 │
                                                                 ▼
                                                        JWT + Refresh Token → Client Storage
```

→ See §11.2 for JWT validation flow and security boundaries.

### 2.2 Organizations & Tenant Context

Tenant is the **hard isolation boundary**. Org is a soft partition within a tenant.

```
Tenant (tenant_id = "acme_corp")
├── Org: "Engineering" (org_id = "eng_01")
│   ├── Users: alice@acme.com (owner), bob@acme.com (member)
│   └── Resources: scoped to org
├── Org: "Sales" (org_id = "sales_01")
│   ├── Users: carol@acme.com (admin), dave@acme.com (viewer)
│   └── Resources: scoped to org
└── Platform-level: tenant owner can see all orgs

Tenant (tenant_id = "startup_xyz")
├── Org: "Default" (single-org tenant)
└── ...
```

**Tenant Resolution is Stratified — never trust client input.**

Priority (highest wins):

1. JWT claim `tenant_id` (for Bearer JWT)
2. API key lookup → D1 `api_keys` table → `tenant_id`
3. **NOTHING ELSE** — no `x-tenant-id` header, no query param, no URL path

If credential type is JWT and `aud` !== `tenant_id`, return 403. If API key tenant is suspended, return 403 with `error: "tenant_suspended"`.

After resolution, the Gateway injects `TenantContext` into the request's Cloudflare context (`request.cf.integratewise`). Every downstream service binding receives this implicitly. No header injection is allowed.

### 2.3 RBAC & Permissions

**Role Hierarchy:**

```
                    ┌─────────────┐
                    │   owner     │  ← Can do everything, including delete tenant
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │  admin  │  │  member │  │  viewer │
        │(manage  │  │(execute│  │(read    │
        │ users)  │  │ actions)│  │ only)   │
        └────┬────┘  └────┬────┘  └─────────┘
             │            │
             ▼            ▼
        ┌─────────┐  ┌─────────┐
        │ api_key │  │ webhook │
        │(scoped  │  │(inbound │
        │ access) │  │ only)   │
        └─────────┘  └─────────┘
```

**Permission format:** `<resource>:<action>`

Examples: `spine:read`, `spine:write`, `connector:create`, `twin:propose`, `govern:approve`, `mcp:invoke`, `webhook:receive`.

**RBAC Enforcement at Two Boundaries:**

1. **Gateway (Coarse):** Does this role have `spine:read`? Reject early — 403 before any service binding call.
2. **Service (Fine-grained):** `WHERE tenant_id = ? AND org_id = ?` on every query. Record-level ownership checks.

```typescript
export function hasPermission(role: RoleDefinition, required: Permission): boolean {
  if (role.permissions.includes(required)) return true;
  const [resource] = required.split(":");
  if (role.permissions.includes(`${resource}:*`)) return true;
  if (role.permissions.includes("*:*")) return true;
  if (role.inherits_from) return checkInherited(role.inherits_from, required);
  return false;
}
```

→ See §11.1 for the 4-Zone Trust Model and how RBAC fits into Zero-Trust.

### 2.4 Session Management

Sessions are ephemeral state stored in Cloudflare KV with TTL. They are NOT the source of truth — the JWT is. Sessions enable revocation, multi-device tracking, and security events.

```typescript
export interface SessionRecord {
  sid: string;
  tenant_id: string;
  org_id: string;
  user_id: string;
  jti: string; // links to JWT
  issued_at: number;
  expires_at: number;
  ip_hash: string; // SHA-256 of IP (privacy-preserving)
  user_agent_hash: string; // SHA-256 of UA string
  device_fingerprint: string;
  last_active_at: number;
  revoked_at: number | null;
  revoke_reason: string | null;
}
```

**KV Keys:**

- `sessions:<sid>` → SessionRecord (TTL = JWT exp)
- `sessions_by_jti:<jti>` → sid (for revocation lookup)
- `sessions_by_user:<user_id>` → JSON[sid[]] (for "log out all devices")

**Revocation flows:**

1. User "Log out" → revoke single session
2. User "Log out all devices" → revoke all sessions for user
3. Admin "Suspend user" → revoke all sessions + blacklist JWT jti
4. Security event (suspicious IP) → automatic revocation

Blacklist: KV `jwt_blacklist:<jti>` = "revoked" (TTL = remaining JWT lifetime). Gateway checks blacklist on EVERY JWT verification.

---

## 3. Ingress Layer (L2 — How Did You Arrive?)

> _"Every request passes through the Gateway. Every request is validated, rate-limited, and routed. No exceptions."_

### 3.1 Gateway — Single Entry Point

The Gateway (`integratewise-gateway`) is a single Cloudflare Worker. It is the only surface that external consumers ever touch.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GATEWAY REQUEST LIFECYCLE                                │
│                                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────┐   │
│  │  WAF    │──▶│  TLS    │──▶│  CORS   │──▶│  AuthN  │──▶│ Rate Limit  │   │
│  │ (CF)    │   │ (CF)    │   │ (GW)    │   │  (GW)   │   │   (GW)      │   │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────────┘   │
│       │            │            │            │                  │           │
│       ▼            ▼            ▼            ▼                  ▼           │
│    Blocked     Blocked      Blocked      401/403           429              │
│    (WAF)       (TLS)        (CORS)       (Auth)         (Rate limit)       │
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────────────┐   │
│  │   Tenant    │──▶│   Request   │──▶│         ROUTER                  │   │
│  │  Resolver   │   │  Validation │   │  ┌─────────┐  ┌─────────────┐  │   │
│  │             │   │  (Zod)      │   │  │ Route   │  │  Service    │  │   │
│  └─────────────┘   └─────────────┘   │  │  Match  │──│  Binding    │──┼───┼──▶
│                                      │  │         │  │    Call     │  │   │
│                                      │  └─────────┘  └─────────────┘  │   │
│                                      └─────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  AUDIT ENQUEUE (fire-and-forget via PIPELINE service binding)       │    │
│  │  → spine_audit_log entry with tenant_id, user_id, route, latency    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Invariant:** No internal service accepts direct external traffic. The Gateway is the sole north-plane entry point. Every hop carries `tenant_id`. Cross-tenant access is a 403 (fail-loud, not 404).

### 3.2 Transport Layer (HTTP / SSE / WebSocket / MCP / Webhooks)

| Transport     | Protocol           | Use Case                       | Endpoint                                         | Auth                   |
| ------------- | ------------------ | ------------------------------ | ------------------------------------------------ | ---------------------- |
| **HTTP/REST** | HTTP/1.1, HTTP/2   | Primary API for SDKs, webhooks | `api.integratewise.ai/api/v1/*`                  | JWT or API Key         |
| **SSE**       | Server-Sent Events | MCP streams, real-time signals | `mcp.integratewise.ai/v1/mcp`                    | JWT                    |
| **WebSocket** | WS over TLS        | Real-time workbench (future)   | `ws.integratewise.ai/v1/stream`                  | JWT                    |
| **MCP**       | stdio / SSE        | AI assistant integration       | `mcp.integratewise.ai/v1/mcp`                    | JWT                    |
| **Webhooks**  | HTTP POST          | Provider callbacks             | `api.integratewise.ai/api/v1/webhooks/:provider` | Signature verification |

**MCP SSE Transport:**

```typescript
export interface McpSseSession {
  session_id: string;
  tenant_id: string;
  user_id: string;
  created_at: number;
  last_event_at: number;
  event_stream: ReadableStream;
  tools_version: string; // Discovery cache version
}

export type McpSseEvent =
  | { type: "connected"; session_id: string; tenant_id: string }
  | { type: "tool_catalog"; tools: McpToolDefinition[] }
  | { type: "invocation_result"; invocation_id: string; result: unknown }
  | { type: "signal"; signal_type: string; payload: unknown }
  | { type: "error"; code: string; message: string }
  | { type: "ping" }; // keep-alive every 30s
```

**Session lifecycle:**

1. Client POST `/mcp/sessions` → Gateway validates JWT
2. Gateway creates session in KV (TTL = 1 hour)
3. Gateway returns SSE stream with initial `connected` event
4. Client POST `/mcp/tools` → Gateway assembles catalog from Discovery
5. Client POST `/mcp/invoke` → Gateway routes to MCP_CONNECTOR binding
6. Result streamed back via SSE
7. Client DELETE `/mcp/sessions/:id` or TTL expiry → cleanup

**Webhook Transport:**

Webhook ingress is a **separate Worker** (`webhook-ingress`), not the Gateway. This isolates burst traffic from API traffic and allows provider-specific signature verification.

```typescript
export interface WebhookEnvelope {
  webhook_id: string; // idempotency key
  tenant_id: string;
  provider: string;
  event_type: string;
  received_at: number;
  payload: unknown;
  signature_valid: boolean;
  raw_headers: Record<string, string>;
}
```

Webhook processing: Provider POST → verify signature → check idempotency (KV dedup) → extract tenant_id from connection mapping → normalize to WebhookEnvelope → enqueue to NORMALIZER_QUEUE → return 200.

### 3.3 Rate Limiting & Request Validation

**Rate Limit Tiers:**

| Tier          | Request/min | Burst     | Concurrent | MCP Streams | Webhooks  |
| ------------- | ----------- | --------- | ---------- | ----------- | --------- |
| free          | 60          | 10        | 5          | 1           | 10/hr     |
| pro           | 600         | 100       | 25         | 3           | 100/hr    |
| enterprise    | 6,000       | 500       | 100        | 10          | 1,000/hr  |
| customer_zero | unlimited   | unlimited | unlimited  | unlimited   | unlimited |

Rate limit is enforced at **two levels:**

1. Gateway edge — per-tenant token bucket (CF Rate Limiting API + KV)
2. Service — per-tenant queue depth (backpressure)

**Request Validation Pipeline (4 Stages):**

```
Stage 1: Structural (Zod schemas)
  ├── Content-Type header check
  ├── Body JSON parsing
  ├── Zod schema validation
  └── Reject: 400 with zodError.errors array

Stage 2: Semantic
  ├── Tenant exists and is active
  ├── User exists in tenant
  ├── Role permits this action
  └── Reject: 403 with reason code

Stage 3: Business Rules
  ├── Plan limits (e.g., max connectors)
  ├── Rate limit compliance
  └── Reject: 402 (payment required) or 429

Stage 4: Security
  ├── Input sanitization (XSS, SQLi patterns)
  ├── Max body size (1MB for API, 10MB for file upload)
  └── Reject: 413 or 400
```

**Critical Zod Rule:** `tenant_id` is NEVER in the request body. It comes from JWT/API key resolution only.

### 3.4 Discovery Subsystem

Discovery is the **capability handshake**. Every consumer — human, AI agent, SDK — calls `GET /api/v1/discovery` to learn what exists and what they can do. This is a **living contract** that changes as connectors are added, roles are modified, or plan limits are adjusted.

```typescript
export interface DiscoveryResponse {
  identity: { user_id; email; name; tenant_id; tenant_name; org_id; org_name; role; tier };
  workspace: { connected_connectors; plan_limits; features_enabled; onboarding_complete };
  projections: ProjectionInfo[]; // 8 lenses, filtered by role
  capabilities: CapabilityInfo[]; // Named capabilities, filtered by plan
  features: FeatureInfo[]; // Gated features
  navigation: NavigationNode[]; // Role-based navigation
  personalization: { recent_entities; preferred_projection; pinned_capabilities; theme };
  limits: { rate_limit; storage_used; storage_limit; api_calls };
  mcp: { endpoint; version; transport; authenticated };
  version: { api; schema; discovery_cache_version };
}
```

**Discovery Assembly Flow (inside Gateway):**

1. Check KV cache: `discovery:<tenant_id>:<role>:<version>` → Cache hit? Return (60s TTL)
2. Parallel service binding calls: TENANTS → CONNECTOR → AGENT_REGISTRY → L2 → BILLING
3. Assemble DiscoveryResponse
4. Write to KV cache (5 min TTL)
5. Return to client

### 3.5 MCP Pool Architecture (Inbound + Outbound)

The MCP Pool is split into two halves:

**Inbound MCP Pool (`mcp-connector` service):** AI assistants (Claude, ChatGPT) connect to the Bridge via MCP. They discover tools, invoke capabilities, and receive results. The Gateway handles JWT auth, session management, and SSE streaming. The `mcp-connector` service translates MCP tool calls into Capability Invocations and routes them through Hermes.

**Outbound MCP Pool (`act` service adapters):** When the Bridge needs to call an MCP-native provider (GitHub, Linear, Figma), the `mcp-outbound` adapter in the `act` service establishes an SSE connection to the provider's MCP server, invokes the tool, and normalizes the result.

→ See §7.1 for the adapter taxonomy and how MCP fits into the Provider Fabric.
→ See §4.5 for the MCP Runtime in the Capability Layer.

---

## 4. Capability Layer (L3 — What Do You Want To Do?)

> _"The Capability Layer turns intent into execution. It does not own data. It does not own memory. It owns the contract between what the user wants and what the system can do."_

The Capability Layer is the **OODA Execution Fabric**. It does not store context (that is the Continuity Layer), it does not govern (that is the Governance Layer), and it does not touch providers directly (that is the Provider Fabric via adapter modules). The Capability Layer **orchestrates** — it routes, assembles, reasons, and dispatches.

### 4.1 Capability Registry & Fabric

The Capability Registry is the **single source of truth** for every named action the platform can perform. It is a living catalog — not a static file. Capabilities are registered at deploy time, discovered at runtime, and validated on every invocation.

**Capability URI Format:**

```
capability := <namespace> "." <name>
namespace  := "platform" | "twin" | <provider> | "ecosystem"
provider   := "salesforce" | "hubspot" | "slack" | "github" | "stripe" | ...
name       := <resource> "." <action>
```

Examples:

- `salesforce.opportunity.update` — Provider capability, Act phase
- `twin.propose` — Twin reasoning capability, Decide phase
- `platform.discovery` — Platform capability, Observe phase
- `ecosystem.broadcast` — Cross-tenant knowledge sharing, Cross-phase

**Registry Schema (D1 + KV Cache):**

```typescript
export const capabilityRegistry = sqliteTable("capability_registry", {
  id: text("id").primaryKey(), // capability URI
  tenantId: text("tenant_id").notNull(),
  namespace: text("namespace").notNull(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),
  oodaPhase: text("ooda_phase", {
    enum: ["observe", "orient", "decide", "act", "cross-phase"],
  }).notNull(),
  runtime: text("runtime", { enum: ["agent", "pipeline", "workflow", "mcp", "direct"] }).notNull(),
  serviceBinding: text("service_binding").notNull(),
  handler: text("handler").notNull(),
  inputSchema: text("input_schema"), // JSON Schema URI
  outputSchema: text("output_schema"), // JSON Schema URI
  requiresApproval: integer("requires_approval", { mode: "boolean" }).default(false),
  minConfidence: real("min_confidence").default(0.7),
  autoApproveThreshold: real("auto_approve_threshold").default(0.85),
  requiredRoles: text("required_roles"), // JSON array
  requiredScopes: text("required_scopes"), // JSON array
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeprecated: integer("is_deprecated", { mode: "boolean" }).default(false),
  deprecationNote: text("deprecation_note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

**Registry Operations:**

- `register()` — called by service deploy hooks; writes to D1, invalidates KV cache
- `resolve(capabilityUri, tenantId)` — hot path; reads KV cache first, D1 fallback
- `list(filters)` — powers Discovery endpoint
- `validate(capabilityUri, tenantId, callerRole, payload)` — schema + permission validation
- `deprecate()` — marks capability as deprecated, schedules removal

**Registry Caching:**
| Tier | TTL | Source | Invalidation |
|------|-----|--------|-------------|
| KV Cache | 5 min | `agent-registry` writes to KV on registration | Service deploy, manual update |
| D1 | Persistent | Source of truth | Never directly by runtime |
| Service Binding Memo | 30 sec | Gateway memoizes binding resolution | TTL expiry |

### 4.2 Platform SDK & Contracts

The Platform SDK (`packages/sdk/`) is the **only** consumer-facing code artifact. It provides typed wrappers around every capability. Consumers import `@integratewise/sdk` — they never import internal service topology.

**Five SDK Variants** (detailed in §9.4):

| Package            | Size    | Use Case                                        |
| ------------------ | ------- | ----------------------------------------------- |
| `@iw/sdk-full`     | ~180 KB | Full workbench builders, extension developers   |
| `@iw/sdk-lite`     | ~85 KB  | Browser/Node apps, dashboards, CLI tools        |
| `@iw/sdk-content`  | ~45 KB  | Mobile apps, embeddable widgets (read-only)     |
| `@iw/sdk-minimal`  | ~12 KB  | Telemetry + events only (analytics, logging)    |
| `@iw/sdk-headless` | ~3 KB   | Server-side, edge functions, background workers |

**Capability Invocation Envelope (wire format):**

```typescript
export interface CapabilityInvocation {
  capability: string; // Capability URI
  tenantId: string; // Extracted from JWT claim — NEVER from client payload
  userId: string; // Extracted from JWT sub claim
  role: string; // From JWT rbac claim
  correlationId: string; // Distributed tracing
  scopes: string[]; // JWT scope array
  payload: unknown; // Validated against capability.inputSchema
  contextHints?: ContextHint[]; // Passed to intelligence service
  oodaPhase: OodaPhase; // Routing and telemetry
}

export interface CapabilityResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: CapabilityError;
  confidence?: number; // Populated by Decide-phase capabilities
  governance?: GovernanceState; // For capabilities requiring approval
  meta: ResponseMeta; // Telemetry
}
```

### 4.3 Context Assembly (Entity360)

Context Assembly is the **Orient phase engine**. It gathers Entity360, Memory, Knowledge, and Evidence into a structured context window for reasoning and execution. It runs in the `intelligence` service.

**Assembly Pipeline (4 Stages):**

```
INPUT: CapabilityInvocation + ContextHints
       │
       ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Stage 1    │──▶│  Stage 2    │──▶│  Stage 3    │──▶│  Stage 4    │
│  RESOLVE    │   │   FETCH     │   │  ASSEMBLE   │   │  OPTIMIZE   │
│             │   │             │   │             │   │             │
│ • Entity    │   │ • Spine     │   │ • Merge     │   │ • Truncate  │
│   resolution│   │   entities  │   │   sources   │   │   to window │
│ • SSOC bind │   │ • Memory    │   │ • Rank by   │   │ • Prioritize│
│ • Type infer│   │ • Knowledge │   │   relevance │   │ • Deduplicate│
└─────────────┘   │ • Evidence  │   │ • Inject    │   │ • Compress  │
                  └─────────────┘   │   metadata  │   └─────────────┘
                                    └─────────────┘

OUTPUT: AssembledContext (Entity360 + Memory + Knowledge + Tools)
```

**AssembledContext Output:**

```typescript
export interface AssembledContext {
  entity360: Entity360; // The entity at the center
  memory: MemoryEntry[]; // Active tier, ranked by recency + relevance
  knowledge: KnowledgeHit[]; // RAG results from Vectorize + AI Search
  tools: ToolCatalog; // Available capabilities for this tenant + role
  evidence: Evidence[]; // Audit trail, past decisions, lineage
  relationships: Relationship[]; // Connected entities within 2 hops
  prompt: StructuredPrompt; // Ready for LLM consumption
  assemblyMeta: AssemblyMeta; // Process metadata
}
```

→ See §5.7 for the Knowledge RAG pipeline.
→ See §5.6 for Memory query and retrieval.
→ See §10.2 for Memory schema definitions.

### 4.4 ADK Runtime & Twin (Ambient)

The Twin is **not a separate service that consumers call**. It is a reasoning quality that permeates the Capability Layer. The Twin lives inside the `twin-orchestrator` Durable Object — one per `tenant_id + user_id`.

**Twin Posture: AMBIENT**

- The Twin observes the Spine continuously (via DO alarm every 5 minutes)
- It proposes actions through the Governance layer (§6)
- It enriches the workbench with inline insights (§1.5)
- It generates the Morning Briefing (§1.6)
- It participates in Agent-to-Agent communication (§9.3)

**Twin Durable Object:**

```typescript
export class TwinOrchestrator implements DurableObject {
  private contextWindow: ContextWindow | null = null;
  private lastActivity: number = Date.now();

  constructor(state: DurableObjectState) {
    // Restore from DO storage on activation
    state.blockConcurrencyWhile(async () => {
      this.contextWindow = await state.storage.get<ContextWindow>("context");
    });
  }

  async fetch(request: Request): Promise<Response> {
    this.lastActivity = Date.now();
    // SECURITY: Validate DO ID matches tenant_id + user_id
    const { tenantId, userId, action, payload } = await request.json();
    const expectedId = this.state.id.toString();
    const derivedId = this.state.idFromName(`${tenantId}:${userId}`).toString();
    if (expectedId !== derivedId) return new Response("TENANT_MISMATCH", { status: 403 });

    switch (action) {
      case "reason":
        return this.handleReason(payload);
      case "propose":
        return this.handlePropose(payload);
      case "context_snapshot":
        return this.handleSnapshot();
      default:
        return new Response("UNKNOWN_ACTION", { status: 400 });
    }
  }

  async alarm(): Promise<void> {
    // Every 5 minutes: decay context, snapshot to D1
    if (this.contextWindow) {
      const decayed = await applyDecay(this.contextWindow);
      await this.state.storage.put("context", decayed);
      await backupToD1(this.state.id.toString(), decayed);
    }
    // Hibernation check: idle > 10 minutes → allow hibernation
    if (Date.now() - this.lastActivity > 10 * 60 * 1000) {
      await this.state.storage.deleteAlarm();
    }
  }
}
```

**DO ID Policy:** `idFromName(tenant_id + ":" + user_id)` — NEVER `idFromName("global")`. This is a P0 security requirement. → See §11.2 (P0-4).

→ See §8.2 for the Twin's role in the OODA loop.
→ See §5.6 for how the Twin reads and writes Memory.

### 4.5 MCP Runtime

The MCP Runtime bridges the Bridge's capability model with the Model Context Protocol (MCP). MCP is both an inbound consumer (AI assistants discover and invoke Bridge capabilities) and an outbound provider (the Bridge discovers and invokes external MCP-native tools).

**Inbound MCP:**

- `mcp-connector` service handles SSE sessions, tool catalog assembly, and invocation routing
- Tool catalog is assembled from the Capability Registry, filtered by tenant's connected providers and user's RBAC role
- Every MCP invocation is translated to a Capability Invocation and routed through Hermes
- Read-only default for MCP; write requires `scope:write` + governance

**Outbound MCP:**

- `mcp-outbound` adapter in the `act` service connects to provider MCP servers (GitHub, Linear, Figma)
- Entity360 is injected into MCP tool calls as `_iw_context` parameter
- Tool whitelist per tenant restricts which MCP tools can be called

→ See §3.2 for MCP transport specification.
→ See §7.1 for the MCP adapter in the Provider Fabric.
→ See §11.6 for MCP security boundaries (P0-9, P1-4).

### 4.6 Execution Routing

The Capability Router (Hermes Durable Object) is the central message queue + execution router. It maintains stateful routing tables, in-flight execution tracking, and backpressure management.

**Routing Flow:**

```
Gateway → CapabilityRouter (hermes DO) → RegistryCache (KV + D1)
                                              │
              ┌───────────────┼───────────────┤
              ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │  Direct  │    │  Agent   │    │ Workflow │
        │ Handler  │    │ Runtime  │    │ Engine   │
        │ (act)    │    │(iw-agent  │    │(workflow │
        │          │    │ runtime) │    │ DO)      │
        └──────────┘    └──────────┘    └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌──────────────────┐
                    │  Adapter Layer   │  ◄── Provider Fabric (Layer 6)
                    │  (act adapters)  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  PIPELINE_QUEUE  │  ──▶ Spine Writeback (Layer 4)
                    └──────────────────┘
```

**Hermes DO Route Method:**

1. RESOLVE — capability URI → runtime config (from Registry)
2. VALIDATE — schema + permissions
3. GOVERNANCE PRE-CHECK — block before expensive operations if `requiresApproval`
4. CONTEXT ASSEMBLY — for Orient+ phases, assemble Entity360 + Memory + Knowledge
5. EXECUTE — route to appropriate runtime (direct / agent / pipeline / workflow / mcp)
6. POST-EXECUTION GOVERNANCE — for Decide phase, evaluate confidence and queue if needed
7. TELEMETRY — record duration, success, OODA phase, runtime type

### 4.7 Agent vs Pipeline Boundaries

This is a **critical conceptual boundary** that determines governance, audit, and approval requirements.

| Dimension            | Pipeline                            | Agent / Agentic                       |
| -------------------- | ----------------------------------- | ------------------------------------- |
| **Reads from Spine** | Yes                                 | Yes                                   |
| **Writes to Spine**  | Yes (the ONLY writer)               | Only via Pipeline enqueue             |
| **Calls tools**      | No                                  | Yes (via act adapters)                |
| **Side effects**     | Deterministic (sync, normalization) | Non-deterministic (reasoning, LLM)    |
| **Governance**       | Rule-based (schema validation)      | Confidence-scored (0.70/0.85 law)     |
| **Approval**         | None (deterministic)                | HITL for 0.70–0.85                    |
| **Audit**            | Every step logged                   | Every proposal + execution logged     |
| **Examples**         | Normalizer, sync, projection        | Twin propose, AI enrichment, workflow |

**Gray Area: Enrichment**

- LLM reads from Spine + writes structured data to Spine (e.g., "summarize this account's last 10 emails")
- No tool calls, no side effects outside Spine
- Auto-approved (no governance gate) because output is deterministic given input
- Still logged to `spine_audit_log` with `actor_type: 'twin'` and `via: 'enrichment'`

→ See §6.5 for the full Agentic vs Prompt vs Enrichment classification.

---

## 5. Continuity Layer (L4 — What Do We Know?)

> _"The Continuity Layer is the moat of the IntegrateWise Continuity Bridge. It is the only place where context is written, compounded, and governed. No consumer, agent, or provider touches the Spine directly."_

The Continuity Layer is Layer 4 of the 6-layer architecture. It sits between the Capability Layer (north) and the Governance Layer (south). Every inbound signal flows through the Normalizer. Every outbound action is gated by Governance. Every memory decays on a schedule. Every audit log is immutable.

### 5.1 Adaptive Spine (SSOT)

The Adaptive Spine is the **single source of context**. It is a directed property graph stored in D1, accessed only through the `pipeline` service (the sole writer), and read by `intelligence`, `knowledge`, `continuity`, `govern`, and `twin-orchestrator`.

**Spine Schema (D1):**

```typescript
export const entities = sqliteTable("entities", {
  id: text("id").primaryKey(), // SSOC UUID (v4, stable)
  tenantId: text("tenant_id").notNull(),
  entityType: text("entity_type").notNull(), // 'account', 'contact', 'deal', 'task', ...
  sourceId: text("source_id").notNull(), // Provider-native ID
  sourceProvider: text("source_provider").notNull(), // 'salesforce', 'hubspot', 'slack'
  canonicalName: text("canonical_name"),
  traits: text("traits", { mode: "json" }), // Normalized key-value traits
  ssocConfidence: real("ssoc_confidence"), // 0.0–1.0
  firstSeenAt: integer("first_seen_at", { mode: "timestamp" }),
  lastModifiedAt: integer("last_modified_at", { mode: "timestamp" }),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  // Tenant isolation: every query MUST include WHERE tenant_id = ?
});

export const relationships = sqliteTable("relationships", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  sourceEntityId: text("source_entity_id")
    .notNull()
    .references(() => entities.id),
  targetEntityId: text("target_entity_id")
    .notNull()
    .references(() => entities.id),
  relationType: text("relation_type").notNull(), // 'owns', 'reports_to', 'participates_in'
  confidence: real("confidence").notNull(), // 0.0–1.0
  provenance: text("provenance"), // 'inferred', 'declared', 'synced'
  firstInferredAt: integer("first_inferred_at", { mode: "timestamp" }),
});

export const spineAuditLog = sqliteTable("spine_audit_log", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  entityId: text("entity_id"),
  action: text("action").notNull(), // 'create', 'update', 'delete', 'read', 'mcp_invoke'
  actor: text("actor").notNull(), // 'user:<id>', 'twin', 'agent:<id>', 'system'
  via: text("via"), // 'mcp', 'webhook', 'sync', 'act', 'govern'
  payloadHash: text("payload_hash"), // SHA-256 of normalized payload
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  // Index: (tenant_id, timestamp) for audit queries
});
```

**SSOC (Stable Source-Object Correlation):**

Every entity carries a **stable UUID** (SSOC) that survives provider swaps. When Salesforce is swapped for HubSpot, the SSOC remains. The `sourceId` and `sourceProvider` columns change; `id` does not.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Salesforce ID  │────▶│   SSOC UUID     │◄────│   HubSpot ID    │
│  0015g00000Lx   │     │  (stable)       │     │  987654321      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                       │
        └─────── same entity ────┴──────── same entity ──┘
```

**Spine Access Rules:**

| Operation  | Allowed Service                                                                         | Queue / Binding  | Constraint                             |
| ---------- | --------------------------------------------------------------------------------------- | ---------------- | -------------------------------------- |
| **WRITE**  | `pipeline` only                                                                         | `PIPELINE_QUEUE` | Must carry `tenant_id` from JWT        |
| **READ**   | `intelligence`, `knowledge`, `continuity`, `govern`, `twin-orchestrator`, `l2`, `store` | Service bindings | `WHERE tenant_id = ?` enforced         |
| **AUDIT**  | All services                                                                            | Direct D1 write  | `spine_audit_log` append-only          |
| **DELETE** | `pipeline` only (soft delete)                                                           | `PIPELINE_QUEUE` | Sets `archivedAt`; never `DELETE FROM` |

**Invariant:** `pipeline` is the only writer. If any other service attempts `INSERT` or `UPDATE` on `entities` or `relationships`, the `db-gate` adapter rejects it.

→ See §10.1 for full Spine schema definitions.
→ See §10.5 for the Entity Relationship Diagram.
→ See §10.6 for D1 Drizzle ORM definitions.

### 5.2 Connectors, Loader & Sync

This subdomain handles **all inbound data**. No provider writes directly to the Spine. Every inbound signal — webhook, sync poll, file drop, MCP tool result — flows through the Connector → Loader → Sync → Normalizer → Pipeline → Spine chain.

**Connector Sync Service:**

```typescript
export interface SyncJob {
  id: string;
  tenantId: string;
  connectorId: string;
  provider: string;
  syncType: "full" | "incremental" | "webhook" | "creamy";
  since: Date;
  triggeredBy: "cron" | "webhook" | "manual" | "loader";
  status: "queued" | "running" | "completed" | "failed" | "dlq";
  recordsFetched: number;
  recordsNormalized: number;
  recordsRejected: number;
}

export interface SyncAdapter {
  fetch(credentials: Credentials, config: ConnectorConfig, since: Date): Promise<RawRecord[]>;
  getSchema(resource: string): Promise<ProviderSchema>;
  healthCheck(credentials: Credentials): Promise<HealthStatus>;
}
```

**The Loader (Cold-Start & Webhook Trigger):**

The `loader` service is the **on-ramp** for new tenants and real-time events.

```typescript
export interface LoaderEvent {
  type: "auth.created" | "auth.updated" | "webhook.received" | "nango.sync";
  tenantId: string;
  provider: string;
  payload: unknown;
  signature?: string;
  idempotencyKey: string;
}
```

- On `auth.created`: trigger "creamy" (full) sync immediately
- On `webhook.received`: trigger incremental sync from last sync timestamp
- Signature verification (P0 security) — invalid signatures are rejected and logged
- Deduplication via idempotency key (KV, 24h TTL)

**Queues involved:**

| Queue                  | Producer                  | Consumer         | Message Type           | Delivery                   |
| ---------------------- | ------------------------- | ---------------- | ---------------------- | -------------------------- |
| `CONNECTOR_SYNC_QUEUE` | `loader`, cron, manual UI | `connector-sync` | `SyncJob`              | At-least-once              |
| `NORMALIZER_QUEUE`     | `connector-sync`          | `normalizer`     | `NormalizationBatch`   | At-least-once              |
| `PIPELINE_QUEUE`       | `normalizer`              | `pipeline`       | `CanonicalEntityBatch` | Exactly-once (idempotency) |

### 5.3 Normalizer (8-Stage Pipeline)

The Normalizer transforms **raw provider records** into **canonical Spine entities**. It is the only path from inbound data to the Spine. Every record that enters the Spine has been through all 8 stages.

```
Raw Record ──► Stage 0 ──► Stage 1 ──► Stage 2 ──► Stage 3 ──► Stage 4
               (NA0)       (NA1)       (NA2)       (NA3)       (NA4)
               Parse       Trait       Resolve     Resolve     Link
                           Detect      Type        Entity      Relations

Stage 4 ──► Stage 5 ──► Stage 6 ──► Stage 7 ──► PIPELINE_QUEUE
(NA4)       (NA5)       (NA6)       (NA7)
Enrich      Validate    Emit        DLQ / Retry
& Map       Canonical   Canonical
```

| Stage   | Name           | Function                                                         | Failure Behavior                              |
| ------- | -------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| **NA0** | Parse          | JSON/CSV/XML → structured object                                 | DLQ + audit log                               |
| **NA1** | Trait Detect   | Identify entity type from field heuristics                       | Retry ×3 → DLQ                                |
| **NA2** | Resolve Type   | Map to canonical entity type from Schema Provider                | Retry ×3 → DLQ                                |
| **NA3** | Resolve Entity | SSOC lookup or mint new stable UUID                              | Retry ×3 → DLQ                                |
| **NA4** | Link Relations | Traverse foreign keys, infer relationships                       | Log low-confidence, continue                  |
| **NA5** | Enrich & Map   | Apply tenant-specific field mappings, enrich from Knowledge      | Continue (enrichment optional)                |
| **NA6** | Validate       | Schema validation against Schema Provider contract               | Reject + audit (do NOT DLQ schema violations) |
| **NA7** | Emit Canonical | Serialize to `CanonicalEntityBatch`, enqueue to `PIPELINE_QUEUE` | Retry ×5 → DLQ (critical path)                |

**Performance SLO:** Normalizer p99 latency < 2s per batch of ≤100 records.

**DLQ & Retry Policy:**

- Max retries: 5
- Backoff: exponential (1s, 2s, 4s, 8s, 16s)
- Retryable errors: `NETWORK_TIMEOUT`, `RATE_LIMITED`, `SCHEMA_PROVIDER_UNAVAILABLE`
- Non-retryable errors: `SCHEMA_VIOLATION`, `CROSS_TENANT_RECORD`, `INVALID_TRAIT`
- DLQ destination: R2 cold storage (`dlq/{tenantId}/{batchId}.json`) + audit log
- Cross-tenant detection: `CROSS_TENANT_RECORD` → alert security (P0)

### 5.4 Schema Provider

The Schema Provider is a **contractual layer** between the proprietary IntegrateWise mechanism and the tenant-owned context. It defines what entities exist, what fields they carry, and how they map to provider schemas — without exposing the mechanism itself.

**Schema Architecture:**

```
┌─────────────────┐
│  Schema AI      │  (think service, tenant onboarding)
│  (think service)│  Hydrates initial schema for new tenants
└────────┬────────┘
         │ generates
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Base Schema    │────►│  Tenant Overlay │────►│  Provider Map   │
│  (IW canonical) │     │  (custom fields)│     │  (SF/HS/Slack)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                         │                       │
       └─────────────┬───────────┴───────────────┘
                     ▼                           ▼
            ┌─────────────────┐         ┌─────────────────┐
            │  Schema Store   │         │  Schema Store   │
            │  (D1)           │         │  (KV cache)     │
            └─────────────────┘         └─────────────────┘
```

**Ownership Split:**

- Base Schema = IntegrateWise IP (proprietary, not exposed)
- Tenant Overlay = Customer context (data sovereignty)
- Provider Map = Adapter configuration (swappable)

```typescript
export interface SchemaProviderAPI {
  getTenantSchema(tenantId: string): Promise<MergedSchema>; // Base + Tenant Overlay
  getProviderMap(tenantId: string, provider: string): Promise<ProviderMap>;
  validate(tenantId: string, entityType: string, payload: unknown): Promise<ValidationResult>;
  generateInitialSchema(
    tenantId: string,
    industry: string,
    connectedProviders: string[]
  ): Promise<BaseSchema>;
}
```

### 5.5 Workspace & Tenant Scope

The Workspace is the **tenant-scoped container** for all context. It is not a data structure per se; it is a logical boundary enforced by `tenant_id` on every query, every queue message, and every Durable Object ID.

**Hard Rules:**

1. No cross-tenant query ever succeeds.
2. Every Durable Object ID includes `tenant_id`.
3. Every queue message carries `tenant_id` in the envelope.
4. Every JWT claim includes `tenant_id`.
5. Service bindings propagate `tenant_id` implicitly.

**Workspace Initialization (First Auth Flow):**

1. Generate initial schema via Schema AI (think service)
2. Create RBAC roles (owner, tam, account_success, admin, member, viewer)
3. Initialize memory tiers (continuity service)
4. Initialize Knowledge (empty RAG corpus)
5. Set default governance rules
6. Audit log: `workspace_initialized`

→ See §10.3 for Tenant schema definitions.
→ See §11.1 for the 4-Zone Trust Model.

### 5.6 Memory — 4 Scopes × 3 Tiers

Memory is **compounding context**. Every agent turn, every user action, every provider writeback enriches memory. Memory decays if not reinforced. Memory is scoped.

**Memory Scopes (v2.0 FINAL):**

| Scope            | Owner          | Lifetime                     | Access                           |
| ---------------- | -------------- | ---------------------------- | -------------------------------- |
| **Personal**     | Human user     | Session → Active → Archive   | User + their Twin                |
| **Work**         | Task / Project | Duration of task             | Project members + Twin           |
| **Organization** | Tenant         | Permanent (with decay)       | All org members (RBAC-gated)     |
| **AI**           | Twin / Agent   | Ephemeral → Active → Archive | Twin only (reasoning scratchpad) |

_Audit is cross-cutting Compliance, not a memory scope._

**Memory Tiers (User's Triage Model):**

```
   Intake ──► Classification ──► Validation ──► Promotion ──► Store
      │            │                │              │            │
      │            ▼                │              │            ▼
      │    Confidence Score         │              │      ┌──────────┐
      │    (0.0 – 1.0)              │              │      │  HOT     │
      │                             │              │      │(Active)  │
      │            ┌────────────────┘              │      │ D1+KV+  │
      │            ▼                                │      │ Vectorize│
      │    ┌───────────────┐    ≥0.85 ────────────┘      └──────────┘
      └───►│   TRIAGE      │◄───────────────────────────────│
           │  (triage      │                                 │ reinforcement
           │   service)    │                                 │ resets clock
           └───────┬───────┘                                 │
                   │                                         ▼
         0.70–0.85 │                                ┌──────────┐
                   └───────────────────────────────►│ WARM     │
                                                    │(Staging) │
         <0.70                                      │  D1 only │
            │                                        └──────────┘
            ▼                                          │ 30 days no access
      ┌──────────┐                                     ▼
      │  DISCARD │                            ┌──────────┐
      │  (R2     │                            │ COLD     │
      │  audit)  │                            │(Archived)│
      └──────────┘                            │  R2      │
                                              └──────────┘
                                                   │ 90+ days with accuracy
                                                   ▼
                                            ┌──────────┐
                                            │ PERMANENT│
                                            │  D1+KV   │
                                            └──────────┘
                                                   │
                                                   ▼
                                            ┌──────────┐
                                            │ DISCARDED│
                                            │  (R2)    │
                                            └──────────┘
```

**Memory Triage Rules (User's Language):**

| Source                     | Initial Tier | Promotion Rule                                                | Final State                    |
| -------------------------- | ------------ | ------------------------------------------------------------- | ------------------------------ |
| **User-created decisions** | Hot (0.85)   | Immediate → Permanent                                         | Permanent (never discard)      |
| **AI-observed patterns**   | Hot (0.70)   | 7 repetitions → Warm; 30 → Cold; 90 with accuracy → Permanent | Permanent or Discarded         |
| **One-off events**         | Hot (0.70)   | No repetition → Decay                                         | Discarded after 7 days         |
| **External data**          | Hot          | Follow retention policy                                       | Per policy                     |
| **Triage Worker**          | Runs nightly | Evaluates all memory against rules                            | Promotes, demotes, or discards |

**Technical Implementation:** The user's "Hot/Warm/Cold/Permanent/Discard" model maps to our technical tiers as follows:

- Hot = `active` tier (D1 + KV + Vectorize)
- Warm = `staging` tier (D1 only)
- Cold = `archived` tier (D1 + R2 offload)
- Permanent = `active` tier with `valid_until = null` and `archiveThreshold = 0`
- Discard = written to R2 cold storage for compliance, then purged from D1

**Memory Interfaces:**

```typescript
export type MemoryScope = "personal" | "work" | "organization" | "ai";
export type MemoryTier = "active" | "staging" | "archived"; // Hot, Warm, Cold

export interface MemoryRecord {
  id: string;
  tenantId: string;
  scope: MemoryScope;
  ownerId: string;
  tier: MemoryTier;
  content: string;
  embedding?: number[]; // Vectorize embedding for semantic retrieval
  confidence: number; // Triage-assigned confidence
  source: string; // 'sync', 'user_action', 'twin_proposal', 'act_writeback'
  ssocReferences: string[]; // SSOC IDs referenced
  accessCount: number;
  lastAccessedAt?: Date;
  createdAt: Date;
  decayAt?: Date; // When auto-archive
}

export interface MemoryStoreAPI {
  store(record: Omit<MemoryRecord, "id">): Promise<MemoryRecord>;
  query(q: MemoryQuery): Promise<MemoryRecord[]>; // semantic + keyword hybrid
  reinforce(memoryId: string): Promise<void>; // reset decay clock
  runDecay(tenantId: string): Promise<{ archived: number; decayed: number }>;
  promote(
    memoryId: string,
    fromScope: MemoryScope,
    toScope: MemoryScope,
    approvedBy: string
  ): Promise<void>;
}
```

**Decay Rule:** `decay_score = f(time_since_access, reinforcement, confidence, scope_weight)`

- If `decay_score < 0.30` AND `last_accessed > 30 days`: → tier = 'archived', content offloaded to R2
- If reinforced: `decay_score += 0.2`, reset access clock
- Triage Worker runs nightly (cron trigger)

→ See §10.2 for Memory schema definitions.
→ See §13.8 for the Continuity Orchestrator pipeline that runs decay.

### 5.7 Knowledge (RAG Pipeline)

Knowledge is the **document and semantic retrieval layer**. It stores tenant-specific documents (SOPs, contracts, playbooks), indexes them via Vectorize, and serves them to the Twin during Context Assembly.

**Knowledge Architecture:**

```
Documents ──► Chunking ──► Embedding ──► Vectorize ──► Retrieval
   │            │            │             │              │
   │            │            │             │              ▼
   │            │            │             │      ┌───────────────┐
   │            │            │             │      │  AI Search    │
   │            │            │             │      │  (semantic)   │
   │            │            │             │      └───────────────┘
   ▼            ▼            ▼             ▼              ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌───────────────┐
│  R2    │  │Chunking│  │Embedding│  │Vectorize│  │  Context     │
│(blobs) │  │(think) │  │(think) │  │(index) │  │  Assembly    │
└────────┘  └────────┘  └────────┘  └────────┘  └───────────────┘
```

**Chunking Strategy:**

- Semantic chunking (sentence boundaries) for prose
- Structural chunking (headers) for docs/SOPs
- Sliding window with 20% overlap for code/markdown

**Embedding:** gpt-5-mini via OpenRouter (default) or tenant-configured

**Retrieval:** Hybrid (keyword AI Search + semantic Vectorize)

```typescript
export interface KnowledgeDocument {
  id: string;
  tenantId: string;
  title: string;
  source: "upload" | "sync" | "twin_generated" | "user_created";
  mimeType: string;
  r2Key: string; // Location in R2
  chunks: KnowledgeChunk[];
  metadata: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
  lastIndexedAt?: Date;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  tenantId: string;
  content: string;
  embedding?: number[];
  startIndex: number;
  endIndex: number;
  metadata: { heading?: string; pageNumber?: number };
}
```

### 5.8 Memory Triage (Hot → Warm → Cold → Permanent → Discard)

The Memory Triage is the **nightly worker** that evaluates all memory against the user's triage rules. It is implemented in the `continuity` service.

**Triage Algorithm:**

```
FOR each memory record in tenant:
  1. IF user_created_decision → tier = permanent, valid_until = null
  2. IF ai_observed_pattern:
       repetitions = count_reinforcements(memory_id)
       IF repetitions >= 7 → tier = warm
       IF repetitions >= 30 → tier = cold
       IF repetitions >= 90 AND accuracy > 0.85 → tier = permanent
  3. IF one_off_event AND last_accessed > 7_days → tier = discard
  4. IF external_data → follow retention_policy
  5. Update decay_score based on time_since_access + reinforcement
  6. IF decay_score < archive_threshold:
       tier = archived
       content offloaded to R2
       INSERT decay_log
  7. WRITE spine_audit_log (action: 'memory_triage')
```

**Triage Worker Output:**

- Promoted memories: count by scope and tier
- Archived memories: count and total content size
- Discarded memories: count (written to R2 for compliance)
- Audit trail: every triage decision logged

→ See §13.8 for the Continuity Orchestrator pipeline that runs the Triage Worker.

---

## 6. Governance Layer (L5 — Are You Allowed?)

> _"Governance is the airlock between reasoning and execution. It enforces the 0.70/0.85 confidence law. It runs the HITL orchestrator. It maintains the audit trail for every decision."_

### 6.1 Governance Rules Engine

Governance is the **approval and confidence-scoring layer** that sits between reasoning (Twin) and execution (Act). It enforces the 0.70/0.85 confidence law. It runs the HITL orchestrator. It maintains the audit trail for every decision.

```typescript
export interface GovernanceRule {
  id: string;
  tenantId: string;
  name: string;
  scope: "global" | "capability" | "provider" | "entity";
  target: string; // e.g., 'salesforce.opportunity.update' or 'account'
  condition: RuleCondition;
  action: "auto_approve" | "require_approval" | "block" | "escalate";
  confidenceOverride?: number; // Override default 0.70/0.85 for this rule
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface GovernanceDecision {
  proposalId: string;
  tenantId: string;
  userId: string;
  capability: string;
  confidence: number;
  decision: "auto_approved" | "queued" | "discarded" | "rule_blocked" | "escalated";
  ruleId?: string;
  reason: string;
  timestamp: Date;
}

export interface GovernAPI {
  evaluate(proposal: ActionProposal): Promise<GovernanceDecision>;
  setRule(rule: GovernanceRule): Promise<void>; // admin only
  deleteRule(tenantId: string, ruleId: string): Promise<void>;
  getPendingProposals(tenantId: string, userId: string): Promise<ActionProposal[]>;
  resolveProposal(
    proposalId: string,
    resolution: "approve" | "reject" | "modify",
    resolverId: string,
    modifiedPayload?: unknown
  ): Promise<void>;
}
```

### 6.2 The 0.70 / 0.85 Confidence Law

This law governs **two triage gates** that run on the same thresholds but for different purposes.

**Gate 1: Governance Triage (Execution Gate):**

| Confidence      | Action           | Destination                | Human Touch                | Audit                                  |
| --------------- | ---------------- | -------------------------- | -------------------------- | -------------------------------------- |
| **≥ 0.85**      | Auto-approve     | `ACT_QUEUE`                | None                       | `governance_audit_log` (auto-approved) |
| **0.70 – 0.85** | Queue for review | **My Desk** (owner review) | Approve / Modify / Dismiss | `governance_audit_log` (pending)       |
| **< 0.70**      | Discard          | —                          | None                       | `governance_audit_log` (discarded)     |

**Gate 2: Memory Triage (Knowledge Gate):**

| Confidence      | Action       | Destination     | Where                              |
| --------------- | ------------ | --------------- | ---------------------------------- |
| **≥ 0.85**      | Auto-promote | Active memory   | `continuity` (D1 + KV + Vectorize) |
| **0.70 – 0.85** | Staging      | Staging memory  | `continuity` (D1 only)             |
| **< 0.70**      | Discard      | R2 cold storage | `continuity` (compliance/audit)    |

**Rule:** Even Customer-Zero cannot bypass hard approval-expiry gates. Proposals in My Desk expire after 72 hours if not reviewed.

**Confidence Scoring Factors:**

- Twin reasoning quality (model evaluation)
- Historical success rate (memory lookup)
- Rule match severity (governance rules)
- Data freshness (entity `lastModifiedAt`)
- User preference alignment (personal memory)

### 6.3 HITL Orchestrator (5-Step Flow)

The HITL orchestrator manages the **My Desk** approval interface. It is implemented as a Durable Object per `tenant_id + user_id` — never global.

**HITL Flow:**

```
                    ┌─────────────┐
                    │   PENDING   │◄─────────────────┐
                    │  (0.70-0.85)│                  │
                    └──────┬──────┘                  │
                           │                        │
              ┌────────────┼────────────┐           │
              ▼            ▼            ▼           │
        ┌─────────┐  ┌─────────┐  ┌─────────┐      │
        │APPROVED │  │REJECTED │  │ EXPIRED │      │
        └────┬────┘  └─────────┘  └─────────┘      │
             │                                      │
             ▼                                      │
        ┌─────────┐                                 │
        │EXECUTED │                                 │
        └─────────┘                                 │
                                                    │
   ┌────────────────────────────────────────────────┘
   │
   │   Auto-path (≥ 0.85):
   │   PENDING ──► AUTO_APPROVED ──► EXECUTED
   │
   │   Discard path (< 0.70):
   │   PENDING ──► DISCARDED
   │
   └────────────────────────────────────────────────►
```

**HITL Durable Object:**

```typescript
export class HITLOrchestrator implements DurableObject {
  // CRITICAL: DO ID = idFromName(tenant_id + ":" + user_id), NEVER "global"

  async queueProposal(proposal: ActionProposal): Promise<void> {
    // 1. Store in DO state
    await this.state.storage.put(`proposal:${proposal.id}`, {
      ...proposal,
      status: "pending",
      queuedAt: Date.now(),
    });
    // 2. Set alarm for expiry (72 hours)
    await this.state.storage.setAlarm(Date.now() + 72 * 60 * 60 * 1000);
    // 3. Notify user (SSE push, email, or Slack)
    await notifyUser(this.tenantId, this.userId, {
      type: "proposal_queued",
      proposalId: proposal.id,
      summary: proposal.summary,
    });
  }

  async alarm(): Promise<void> {
    // Expire old proposals
    const proposals = await this.state.storage.list<ActionProposal>({ prefix: "proposal:" });
    for (const [key, proposal] of proposals) {
      if (proposal.status === "pending" && Date.now() - proposal.queuedAt > 72 * 60 * 60 * 1000) {
        proposal.status = "expired";
        await this.state.storage.put(key, proposal);
        await auditLog({
          tenantId: this.tenantId,
          action: "proposal_expired",
          proposalId: proposal.id,
          via: "govern",
        });
      }
    }
  }
}
```

**My Desk Interface:**

- List pending proposals for the current user
- Approve → enqueues to `ACT_QUEUE`
- Reject → updates proposal status, logs to `governance_audit_log`
- Modify → updates payload, re-evaluates confidence, then approves or re-queues
- Dismiss → silently discards (still logged)

→ See §10.4 for Governance schema (proposals, audit log, HITL sessions).
→ See §11.2 (P0-4) for HITL DO security requirement.

### 6.4 Audit & Compliance

Audit is **immutable, fail-loud, and cross-cutting**. Compliance is enforced by the audit trail, tenant isolation, and data retention policies.

**Audit Tables:**

| Table                  | What It Logs                                       | Failure Behavior              | Retention |
| ---------------------- | -------------------------------------------------- | ----------------------------- | --------- |
| `spine_audit_log`      | Entity changes, MCP access, reads, writes          | Write failure → halt sync     | 7 years   |
| `governance_audit_log` | Approval decisions (approve/reject/discard/expire) | Write failure → halt proposal | 7 years   |
| `twin_audit_events`    | Reasoning trace, model calls, confidence scores    | Write failure → halt proposal | 90 days   |
| `outbound_mcp_calls`   | Provider calls, latency, errors                    | Write failure → circuit break | 90 days   |
| `normalizer_dlq`       | Rejected records with error context                | Write failure → alert         | 7 years   |

**Audit Interface:**

```typescript
export interface AuditEvent {
  id: string; // ULID
  tenantId: string;
  timestamp: Date;
  action: string;
  actor: string; // 'user:<id>', 'twin', 'agent:<id>', 'system'
  resource?: string; // SSOC ID or capability name
  via: string; // 'mcp', 'webhook', 'sync', 'act', 'govern', 'normalizer'
  payloadHash?: string; // SHA-256
  metadata?: Record<string, unknown>;
  gdprCategory?: "personal_data" | "sensitive_data" | "anonymized";
  dataSubjectId?: string; // For GDPR subject access requests
  retentionPolicy: "standard" | "extended" | "permanent";
}

// CRITICAL: Audit write failure stops the operation
export async function auditLog(event: Omit<AuditEvent, "id" | "timestamp">): Promise<void> {
  const fullEvent: AuditEvent = { ...event, id: generateUlid(), timestamp: new Date() };
  try {
    await db.insert(auditLogs).values(fullEvent);
  } catch (err) {
    // FAIL-LOUD: If we cannot audit, we do not proceed
    throw new AuditError("AUDIT_WRITE_FAILURE", 500, {
      message: "Audit log write failed; operation halted for compliance",
      originalEvent: fullEvent,
    });
  }
}
```

**Compliance Boundaries:**

- **Tenant Isolation:** Every query: `WHERE tenant_id = ?`. Cross-tenant: 403 (fail-loud).
- **Data Residency:** Default = Cloudflare edge global. Enterprise = pin to jurisdiction (EU, US, AU).
- **Encryption:** At-rest (D1 encrypted by Cloudflare). In-transit (TLS 1.3). Credentials (CF Secrets).
- **Retention:** Active memory: 30 days (with reinforcement). Audit: 7 years. Spine: Permanent (soft-delete).
- **GDPR:** Article 17 (Right to Erasure) → anonymize audit subjects; keep audit trail. Article 20 (Portability) → export API.

→ See §11.4 for Compliance framework (SOC 2, GDPR, HIPAA).
→ See §11.10 for Audit model details.

### 6.5 Agentic vs Prompt Classification

This is a **critical conceptual boundary** that determines governance, audit, and security requirements.

| Dimension            | Prompt                   | Enrichment (Gray Area)           | Agentic                         |
| -------------------- | ------------------------ | -------------------------------- | ------------------------------- |
| **Reads from Spine** | Yes                      | Yes                              | Yes                             |
| **Writes to Spine**  | No                       | Yes (structured data only)       | Yes (or calls tools)            |
| **Calls tools**      | No                       | No                               | Yes                             |
| **Side effects**     | None                     | Limited (structured writeback)   | Yes (external actions)          |
| **Governance**       | None                     | None (auto-approved)             | 0.70/0.85 confidence law        |
| **Approval**         | None                     | None                             | HITL for 0.70–0.85              |
| **Audit**            | Minimal (query log)      | Full (write + actor)             | Full (proposal + execution)     |
| **Examples**         | "Summarize this account" | "Extract key phrases from notes" | "Update Salesforce opportunity" |
| **Data Access**      | L1-L2                    | L1-L3                            | L1-L4                           |

**Prompt:** Reads from Spine, no tool calls, no side effects, no governance. Example: "What's the status of Acme Corp?"

**Enrichment (Gray Area):** LLM reads + writes structured data to Spine, auto-approved. Example: "Summarize the last 10 emails and save the summary to the account's `notes` field." No external tool calls. Deterministic given input. Still logged to `spine_audit_log` with `actor_type: 'twin'`.

**Agentic:** Writes to Spine or calls tools, side effects exist, governance applies, approval may be needed. Example: "Create a new opportunity in Salesforce and notify the team in Slack." This requires governance evaluation (confidence scoring), may go to My Desk, and is fully audited.

**Why This Matters:** The classification determines whether a user's request goes through the fast path (prompt, <100ms) or the full OODA loop (agentic, 1–10s with governance). It also determines liability: agentic actions are governed; prompt responses are not.

---

## 7. Provider Fabric (L6 — Who Executes?)

> _"The Provider Fabric makes the platform provider-agnostic at the Continuity Layer. Swapping Salesforce for HubSpot, or Nango for direct OAuth, or MCP for REST, is a configuration change — never a consumer-facing change."_

The Provider Fabric is Layer 6 — the **execution boundary** between the platform's continuity kernel and the external universe of SaaS providers, APIs, databases, queues, and agent runtimes. Every byte that crosses this boundary is mediated by an adapter, governed by a credential wall, enriched by Entity360 context, and monitored by health probes and circuit breakers.

**Core invariant:** No service outside the Provider Fabric ever holds a provider credential, constructs a provider API call, or parses a provider-specific response schema. The Continuity Layer is entirely provider-agnostic.

### 7.1 Adapter Pattern (Nango / MCP / Native)

The Integration Manager is **not a separate service** in v2.0. It is a **pattern** — a set of adapter modules co-located inside the services that actually touch external providers.

**Adapter Philosophy:**

| Principle              | Implementation                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Co-location**        | Adapters live inside the service that uses them (`act`, `connector`, `connector-sync`)      |
| **Zero extra hop**     | `act` → adapter → provider. No intermediate orchestrator.                                   |
| **Interface contract** | `OutboundAdapter` and `InboundSyncAdapter` interfaces are the only contracts.               |
| **Swappability**       | Change adapter registration in a map. No consumer code changes.                             |
| **Tenant isolation**   | Every adapter instance is scoped to one tenant. No shared credential state.                 |
| **Observability**      | Every adapter call emits a `provider_call` telemetry event with latency, status, tenant_id. |

**Outbound Adapter Contract:**

```typescript
export interface OutboundAdapter {
  execute(request: OutboundExecutionRequest): Promise<OutboundExecutionResult>;
  healthCheck(credentials: Credentials): Promise<ProviderHealthStatus>;
  executeBatch?(requests: OutboundExecutionRequest[]): Promise<OutboundExecutionResult[]>;
}

export interface OutboundExecutionRequest {
  capability: string; // "salesforce.opportunity.update"
  tenantId: string; // Every call is tenant-scoped
  payload: Record<string, unknown>;
  entityContext?: Entity360Context; // Injected by Continuity Layer
  correlationId: string;
  approvalToken?: string; // For writes
  timeoutMs?: number; // Default: 30000
  idempotencyKey: string; // For safe retries
}

export interface OutboundExecutionResult {
  status: "success" | "error" | "partial";
  rawResponse: Record<string, unknown>;
  affectedEntities?: AffectedEntity[]; // For Spine writeback
  metadata: {
    provider: string;
    adapter: "nango" | "mcp" | "native";
    latencyMs: number;
    retryCount: number;
    circuitBreakerState: CircuitBreakerState;
    timestamp: number;
  };
  error?: AdapterError;
}
```

**Inbound Sync Adapter Contract:**

```typescript
export interface InboundSyncAdapter {
  fetch(request: InboundSyncRequest): Promise<InboundSyncResult>;
  handleWebhook?(request: WebhookRequest): Promise<WebhookResult>;
  getCursor?(credentials: Credentials): Promise<string | null>;
}
```

**Adapter Registry (the ONLY place provider → adapter mapping is defined):**

```typescript
// Outbound Adapter Registry
export const outboundAdapterRegistry = {
  // Nango-powered OAuth providers (mature SaaS)
  salesforce: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  hubspot: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  slack: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 15000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 20000, halfOpenMaxCalls: 2 },
  },

  // MCP-native providers (AI-first tool APIs)
  github: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 30000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },
  linear: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 20000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },
  figma: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 20000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },

  // Native REST providers (direct HTTP, no abstraction)
  stripe: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  aws: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 60000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 3 },
  },
  custom: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 30000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
};
```

Changing a provider from Nango to MCP is a **one-line change** in the registry. No consumer code changes. No workbench changes. No Twin changes.

### 7.2 Outbound Execution Flow

The `act` service is the outbound execution engine. It is a Cloudflare Worker that consumes `ACT_QUEUE`.

**Execution Flow (10 steps):**

```
ACT_QUEUE
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  iw-act  (Cloudflare Worker)                                 │
│                                                              │
│  1. DEQUEUE          → Parse message                       │
│  2. IDEMPOTENCY      → Check KV; return cached if exists     │
│  3. CREDENTIAL WALL  → getCredentials(provider, tenantId)  │
│  4. CIRCUIT BREAKER  → Check state; reject if OPEN         │
│  5. ENTITY360        → assembleEntity360(tenantId, entityId)│
│  6. ADAPTER SELECT   → selectAdapter(provider)             │
│  7. ADAPTER EXECUTE  → Call provider API                   │
│  8. TELEMETRY        → emitProviderCall()                  │
│  9. CIRCUIT UPDATE   → Record success/failure              │
│  10. SPINE WRITEBACK  → enqueueToPipelineQueue()             │
│  11. IDEMPOTENCY     → Cache result in KV (24h)             │
└─────────────────────────────────────────────────────────────┘
```

**Key Security Rules:**

- NEVER log tokens. NEVER return credentials to caller.
- Every adapter call is tenant-scoped.
- Every result writes back to Spine via Pipeline (act NEVER writes D1 directly).
- Even errors write to pipeline for audit completeness.

→ See §7.4 for the Credential Wall.
→ See §7.7 for the Circuit Breaker.
→ See §11.3 for Provider Fabric security boundaries.

### 7.3 Inbound Sync Flow

Inbound data flows from providers through adapters to the Normalizer to the Spine.

```
Provider Webhooks / Sync Polls / File Drops
       │
       ▼
┌─────────────────┐
│ webhook-ingress │  verify signature, route to tenant
└────────┬────────┘
         ▼
┌─────────────────┐
│ connector-sync  │  Sync adapter selection, credential fetch
│  (Worker)       │  Raw fetch from provider API
└────────┬────────┘
         ▼
  CONNECTOR_SYNC_QUEUE
         │
         ▼
┌─────────────────┐
│  connector-sync │  Load sync state, fetch records, persist cursor
│  (Worker)       │  Enqueue to NORMALIZER_QUEUE
└────────┬────────┘
         ▼
  NORMALIZER_QUEUE
         │
         ▼
┌─────────────────┐
│  normalizer     │  8-stage pipeline (NA0–NA5)
│  (Worker)       │  Enqueue to PIPELINE_QUEUE
└────────┬────────┘
         ▼
  PIPELINE_QUEUE
         │
         ▼
┌─────────────────┐
│  pipeline       │  ONLY writer to D1 Spine
│  (Sole Writer)  │  INSERT entities, relationships, audit log
└─────────────────┘
```

**Webhook-to-Sync Routing:** When a provider webhook arrives, it is NOT directly processed. It is routed through the same adapter pattern: verify signature → extract tenant → enqueue to connector-sync → process inline (fast). The webhook ingress Worker returns 202 immediately; processing is async.

### 7.4 Credential Wall

The Credential Wall is the **single point of secret retrieval** for the entire Provider Fabric. No adapter fetches credentials directly. No service caches credentials outside the wall. Every credential access is logged, audited, and tenant-isolated.

**Storage Hierarchy:**

```
TIER 1: Cloudflare Secrets (Encrypted at rest)
  Secret Name Pattern: PROVIDER_{PROVIDER}_{TENANT_ID}_API_KEY
  Examples: PROVIDER_SALESFORCE_T_abc123_API_KEY
  Access: Only via env.getSecret() in Workers
  Rotation: Admin CLI or Nango auto-refresh

TIER 2: Nango Vault (OAuth token storage)
  connectionId = tenant_id (by convention)
  Stores: access_token (~1h), refresh_token (long-lived, rotated by Nango), expires_at, scopes
  Access: Nango REST API with NANGO_SECRET_KEY

TIER 3: KV Cache (Performance, NOT security)
  Key: cred_cache:{provider}:{tenantId}
  TTL: 300 seconds (5 min)
  Content: Decrypted access token (ephemeral)
  WARNING: KV is NOT encrypted. Never cache refresh tokens in KV.
```

**getCredentials() Flow:**

1. Check KV cache (fast path)
2. Check credential type from connector config:
   - `nango` → call Nango API for access token
   - `native` → fetch from CF Secrets
   - `mcp` → fetch endpoint + token from Secrets
3. If token expired and refreshable: Nango auto-refresh, or native refresh_token → new access_token
4. Cache in KV (5 min TTL)
5. Audit log: every retrieval logged to `spine_audit_log` with `action: CREDENTIAL_ACCESS`

→ See §11.9 for Secret Management details.
→ See §11.3 for Cross-tenant prevention in credential access.

### 7.5 Entity360 Injection

Every outbound call carries **context** from the Continuity Layer. This is not just "pass the entity ID." It is a structured, ranked, truncated context package.

**Entity360 Assembly Pipeline (5 Steps):**

1. **Primary Entity Resolution:** Query Spine for entity by SSOC UUID
2. **Related Entities (max 5):** Query relationships table, rank by strength
3. **Timeline (last 10 events):** Query audit log, normalize to TimelineEvent[]
4. **Memory Context:** Query continuity service for { lastInteraction, sentiment, keyTopics, openTasks }
5. **Context Window Optimization:** Truncate to fit within 8KB budget per outbound call

**Entity360Context Output:**

```typescript
export interface Entity360Context {
  primaryEntity: { id: string; type: string; providerId: string; displayName: string };
  relatedEntities: RelatedEntity[]; // max 5
  timeline: TimelineEvent[]; // max 10
  memory: { lastInteraction: number; sentiment: number; keyTopics: string[]; openTasks: number };
  projectionContext?: Record<string, unknown>;
}
```

For MCP outbound adapters, Entity360 is injected into the tool call as `_iw_context` parameter.

→ See §4.3 for Context Assembly in the Capability Layer.
→ See §5.1 for the Spine that Entity360 queries.

### 7.6 Tool-to-Tool Communication Protocol

The Tool-to-Tool (T2T) protocol enables **providers to communicate with each other through the Bridge**, not peer-to-peer. When Salesforce needs to notify Slack, or GitHub needs to update Linear, the request flows through the Provider Fabric — mediated, governed, and audited.

**Why Not Peer-to-Peer?**

| Peer-to-Peer        | T2T via Bridge                                |
| ------------------- | --------------------------------------------- |
| No governance       | Governed by confidence gate                   |
| No audit trail      | Full `spine_audit_log` + `outbound_mcp_calls` |
| No context sharing  | Entity360 injected automatically              |
| Credential sprawl   | Single credential wall                        |
| No tenant isolation | `WHERE tenant_id = ?` on every hop            |

**T2T Example: Salesforce opportunity closes → Slack notification**

```
Salesforce webhook → webhook-ingress → connector-sync → normalizer → pipeline → Spine
     → twin-orchestrator (AMBIENT) detects pattern: "closed_won → notify channel"
     → Proposes: send_slack_notification (confidence: 0.92)
     → govern (≥0.85 → AUTO-APPROVE)
     → ACT_QUEUE → act → NangoAdapter (Slack) → Slack API
     → pipeline writeback → continuity memory compound
```

**T2T Message Schema:**

```typescript
export interface T2TRequest {
  sourceProvider: string;
  targetCapability: string;
  tenantId: string;
  triggerEntityId: string;
  sourceContext: Entity360Context;
  proposedPayload: Record<string, unknown>;
  reasoningTrace: string;
  approvalToken: string;
  maxChainDepth: number; // Max 3
  currentDepth: number;
}

export interface T2TResult {
  status: "success" | "error" | "rejected";
  targetResult?: OutboundExecutionResult;
  nextSteps?: T2TRequest[];
  chainDepthConsumed: number;
  auditRecord: {
    tenantId;
    sourceProvider;
    targetCapability;
    triggerEntityId;
    timestamp;
    correlationId;
  };
}
```

**T2T Governance Rules:**

1. Chain depth limit: Max 3 hops. A → B → C. No further.
2. Cycle detection: `salesforce → slack → salesforce` is blocked by T2TChainRegistry.
3. Capability whitelist: Only capabilities in `t2t_allowed_capabilities` config.
4. Approval required: Every T2T hop re-evaluates confidence. Auto-approve only if ≥0.85.
5. Audit completeness: Every hop logs to `spine_audit_log` with `via: t2t`.
6. Tenant isolation: T2T cannot cross tenant boundaries. Ever.

→ See §9.2 for Knowledge Sharing Protocol (KSP).
→ See §9.3 for Agent-to-Agent Communication (A2A).

### 7.7 Provider Health & Circuit Breaker

**Health Check Architecture:**

A cron runs every 60 seconds per active provider/tenant pair inside the `act` service:

1. Call `adapter.healthCheck(credentials)`
2. Record latency, status code, error (if any)
3. Update KV: `health:{provider}:{tenantId}`

**Health State Machine:**

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    │   ┌─────────┐      success              │
           ┌────────┼──►│  CLOSED │◄────────────────────┐     │
           │        │   └────┬────┘                     │     │
           │        │        │ failure                   │     │
           │        │        ▼                           │     │
           │        │   ┌─────────┐  failure >= threshold│     │
  recovery │        │   │  COUNT  │──────────────────────┼─────┼──►┌──────┐
  timeout  │        │   │ FAILURES│                      │     │   │ OPEN │
  elapsed  │        │   └─────────┘                      │     │   └──┬───┘
           │        │                                    │     │      │
           │        └────────────────────────────────────┘     │      │
           │                                                   │      │
           │         ┌─────────────────────────────────────────┘      │
           │         │                                                │
           │    ┌────┴────┐    halfOpenMaxCalls                      │
           └───┄│HALF_OPEN│◄─────────────────────────────────────────┘
                └────┬────┘
                     │
        ┌────────────┼────────────┐
        │ success    │    failure │
        ▼            │            ▼
    ┌───────┐        │        ┌──────┐
    │ CLOSED│        │        │ OPEN │
    └───────┘        │        └──────┘
                     │
```

**Circuit Breaker Rules:**

- `CLOSED` → healthy, traffic allowed
- `OPEN` → unhealthy, all calls rejected fast (return `CIRCUIT_OPEN` error)
- `HALF_OPEN` → probing with limited traffic
- Transitions: CLOSED → OPEN when `consecutiveFailures >= threshold`. OPEN → HALF_OPEN when `recoveryTimeoutMs` elapsed. HALF_OPEN → CLOSED when `halfOpenMaxCalls` consecutive successes. HALF_OPEN → OPEN on any failure during probe.

**KV-Backed State Storage:**

```typescript
interface CircuitBreakerStateData {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failures: number;
  lastFailureAt: number;
  lastSuccessAt: number;
  openedAt?: number;
  halfOpenCalls: number;
  halfOpenSuccesses: number;
}
```

Key: `cb:{provider}:{tenantId}` in KV. TTL: 24 hours (survives deploys).

→ See §13.1 for Ingestion Pipeline health monitoring.
→ See §11.13 for Threat Model (DoS / Abuse mitigation).

---

## 8. The OODA Runtime (Cross-Cutting)

> _"OODA runs across the Capability Layer and the Continuity Layer. The Capability Layer owns the execution fabric; the Continuity Layer owns the state substrate. The Twin is the ambient reasoning engine that bridges both."_

OODA (Observe → Orient → Decide → Act) is not a layer — it is a **cross-cutting decision cycle** that spans the entire platform. Every feature, every pipeline, every agent can be mapped to one or more OODA phases.

### 8.1 Observe → Pipelines (Ingestion, Sync, Webhooks)

**Observe-phase services** ingest signals from the external world without interpretation. They are the eyes and ears of the system.

| Service                   | Role                                                      | OODA Phase | Speed  |
| ------------------------- | --------------------------------------------------------- | ---------- | ------ |
| `webhook-ingress`         | Receives provider webhooks, verifies signatures, enqueues | Observe    | ms     |
| `connector-sync`          | Polls providers on cron, fetches raw records, enqueues    | Observe    | min–hr |
| `folder-watcher`          | Monitors filesystem changes, emits change events          | Observe    | ms     |
| `mcp-connector` (inbound) | Receives MCP tool calls from AI assistants                | Observe    | ms     |
| `platform.signals.*`      | Query capabilities for signal detection                   | Observe    | ms     |

**Observe → Orient Handoff:** Raw signals are enqueued to `NORMALIZER_QUEUE` (for structured data) or `MEMORY_INTAKE_QUEUE` (for unstructured signals). The handoff is queue-based, not synchronous, to allow backpressure and retries.

### 8.2 Orient → Agents (Context Assembly, Twin, Knowledge)

**Orient-phase services** interpret observed signals, assemble context, and prepare for decision-making. They are the brain of the system.

| Service                         | Role                                               | OODA Phase | Speed                 |
| ------------------------------- | -------------------------------------------------- | ---------- | --------------------- |
| `intelligence`                  | Context Assembly — Entity360, Memory, Knowledge    | Orient     | <2s (cache hit <10ms) |
| `knowledge`                     | RAG, semantic search, document indexing            | Orient     | <2s                   |
| `continuity`                    | Memory retrieval, SSOC resolution, graph traversal | Orient     | <10ms (D1)            |
| `normalizer`                    | 8-stage canonicalization (NA0–NA5)                 | Orient     | <2s per batch         |
| `platform.entity360.get`        | Capability: fetch full context for an entity       | Orient     | <100ms                |
| `intelligence.context.assemble` | Capability: assemble full context window           | Orient     | <2s                   |

**Orient → Decide Handoff:** Assembled context is passed to `twin-orchestrator` (for reasoning) or directly to `govern` (for pre-scored actions). The handoff is via service binding (synchronous for cache hits) or queue (asynchronous for complex reasoning).

### 8.3 Decide → Hybrid (Capability Routing + Governance)

**Decide-phase services** evaluate options, score confidence, and produce proposals. They are the judgment of the system.

| Service             | Role                                       | OODA Phase | Speed                      |
| ------------------- | ------------------------------------------ | ---------- | -------------------------- |
| `twin-orchestrator` | Persistent per-user DO — reasoning engine  | Decide     | 1–2s simple, 5–10s complex |
| `think`             | LLM orchestration — OpenRouter abstraction | Decide     | 1–5s                       |
| `govern`            | Confidence scoring, proposal evaluation    | Decide     | <100ms                     |
| `twin.propose`      | Capability: generate proposal              | Decide     | 1–5s                       |
| `twin.analyze`      | Capability: analyze entity                 | Decide     | 1–2s                       |
| `twin.predict`      | Capability: generate forecast              | Decide     | 2–5s                       |

**Decide → Act Handoff:** Proposals with confidence ≥ 0.85 go directly to `ACT_QUEUE`. Proposals with confidence 0.70–0.85 go to My Desk (HITL). Proposals with confidence < 0.70 are discarded. The handoff is via `ACT_QUEUE` (for auto-approved) or `GOVERNANCE_QUEUE` (for HITL).

### 8.4 Act → Pipelines + Agents (Execution + Writeback)

**Act-phase services** execute approved actions and write results back to the Spine. They are the hands of the system.

| Service                    | Role                                                 | OODA Phase | Speed                   |
| -------------------------- | ---------------------------------------------------- | ---------- | ----------------------- |
| `hermes`                   | Message queue + execution routing                    | Act        | <10ms routing           |
| `workflow`                 | Durable orchestration — sagas, retries, pause/resume | Act        | 500ms–2s per step       |
| `act`                      | Outbound execution + adapter modules                 | Act        | 500ms–2s (external API) |
| `iw-agent-runtime`         | MCP-compliant agent execution                        | Act        | 1–5s                    |
| `mcp-connector` (outbound) | MCP calls via act adapters                           | Act        | 1–5s                    |
| `platform.execute.*`       | Generic execution capability                         | Act        | Varies                  |

**Act → Continuity Handoff:** Execution results are enqueued to `PIPELINE_QUEUE`. The `pipeline` service writes to Spine, logs to `spine_audit_log`, and updates KV caches. This closes the OODA loop — the action is now part of the observed state for the next cycle.

### 8.5 Learn → Memory Compounding (Continuity Engine)

**Learn is the secret fifth phase of OODA.** After every action, the system learns:

1. **Result Analysis:** Was the action successful? Did it produce the expected outcome?
2. **Memory Reinforcement:** If successful, reinforce the memory that led to the decision. If failed, update the decay score.
3. **Pattern Extraction:** The Twin extracts patterns from sequences of actions and outcomes.
4. **Knowledge Update:** New documents, SOPs, or playbooks are indexed into the Knowledge corpus.
5. **Governance Feedback:** Approved proposals with positive outcomes increase confidence thresholds. Rejected proposals decrease them.

**Learn → Observe Handoff:** The learned context is now part of the Spine. The next observation cycle will see the updated entity, the reinforced memory, and the new pattern. The system is **strictly more informed** than the previous cycle.

This is why the product promise is true: **Every day the system is smarter. Every day the AI knows more. Every day the user works faster.**

### 8.6 OODA for Connected Tools

When a new tool is connected, the OODA cycle runs in fast-forward:

1. **Observe:** Connector sync pulls historical data. Webhooks start arriving. The tool's signals are now part of the observed state.
2. **Orient:** Normalizer maps tool-specific schemas to canonical types. Entity360 is assembled for the first time. The tool's data is now in the Spine.
3. **Decide:** The Twin discovers patterns in the new data. Proposals are generated. The tool's capabilities are now in the Capability Fabric.
4. **Act:** The user acts on the unified data in the workbench. The tool can now be invoked through the Bridge.
5. **Learn:** Memory compounds. The tool's behavior patterns are learned. The next cycle is faster and more accurate.

**A connected tool is not just "integrated." It is OODA-assimilated.**

---

## 9. The Ecosystem (L0)

> _"The Ecosystem is not a feature. It is the architecture of scale. When one enterprise learns, all enterprises can benefit — without sharing a single byte of proprietary data."_

The Ecosystem is the outermost layer — the **layer zero** — that enables the IntegrateWise platform to learn across tenants, share knowledge safely, and distribute intelligence. It is the foundation of Collective Intelligence (CI): what the network learns, each individual learns; what each individual learns, the network learns.

### 9.1 Connection Hub (Every Action Triggers a Learning Signal)

**Connection Hub Event Flow:**

```
User Action ──► telemetryQueue ──► Telemetry Hub (aggregate)
                    │                    │
                    │                    ▼
                    │            ┌──────────────────┐
                    │            │ 1. Aggregate       │
                    │            │    → aggregate<confidence>
                    │            │ 2. Topology Gen    │
                    │            │    → topology<cluster>
                    │            │ 3. Knowledge Sink  │
                    │            │    → knowledge<compounded>
                    │            └──────────────────┘
                    │                    │
                    │                    ▼
                    │            ┌──────────────────┐
                    │            │ Agentic Proposal   │
                    │            │ (if threshold met) │
                    │            └──────────────────┘
                    │                    │
                    ▼                    ▼
            ┌──────────────────┐  ┌──────────────────┐
            │  Signal Broadcast  │  │ Governance Gate  │
            │  (Tenant Group)    │  │ (Confidence)     │
            └──────────────────┘  └──────────────────┘
```

**Telemetry Hub Signal Processing:**

1. Every action → telemetry event with confidence score
2. Aggregation by capability, provider, entity type → patterns
3. Topology generation: map tenant behavior to clusters ("healthcare startups", "enterprise sales teams")
4. Knowledge compound: extract anonymized best practices, decision patterns
5. Knowledge sink: if aggregate confidence > 0.85, create `KnowledgeArtifact` (ecosystem-scoped, no tenant data)
6. Agentic proposal: if aggregate confidence > 0.70, propose action to relevant tenants
7. Governance gate: evaluate against tenant-specific rules; may require approval
8. Broadcast: signal is sent to tenants in the same topology cluster via SSE, Slack, or Email

**Event Topology:**

```typescript
export interface TelemetryEvent {
  tenantId: string; // Sender tenant
  userId: string; // Sender user
  actionType: string; // 'tool_execution', 'ai_interaction', 'memory_reinforcement', 'knowledge_synthesis'
  confidence: number; // 0.0–1.0
  payload: Record<string, unknown>; // Anonymized payload
  topologyCluster: string; // Cluster label
  timestamp: Date;
}

export interface TelemetryHubConfig {
  enableSignalBroadcast: boolean; // Default: true (opt-out per tenant)
  enableTopologyLearning: boolean; // Default: true (opt-out per tenant)
  enableSignalSummarization: boolean; // Default: true
  batchingIntervalMs: number; // 5000 (5s)
  signalEvaluationThreshold: number; // 0.70 (0.70–0.85 = moderate)
  signalAggregationFactor: number; // 0.85 (≥0.85 = strong)
  knowledgeAggregationThreshold: number; // 0.85
  knowledgeSinkBase: number; // 0.85
  signalRetentionPeriod: number; // 30 days
  retentionPeriod: number; // 7 days (for telemetry hub)
  policyRetention: number; // 30 days
  chainIdFormat: "guid"; // Global UUID for cross-tenant traceability
  agentic: boolean; // true: can generate proposals
  enableRouting: boolean; // true: route based on topology
}
```

### 9.2 Knowledge Sharing Protocol (KSP)

The KSP enables **safe, permissioned, ephemeral knowledge sharing** between tenants. No tenant data ever crosses boundaries. Only extracted, anonymized, confidence-scored knowledge artifacts are shared.

**KSP Flow (MCP + Bridge):**

```
Tenant A (Source) ──► KSP Compiler ──► Knowledge Artifact (Anonymized, ≥0.85)
                              │
                              │  → Bridge validation
                              │  → Gate: Consent, policy, compliance
                              ▼
                    ┌─────────────────┐
                    │  KSP (MCP)      │  Trustless discovery via MCP
                    │  - _discover    │  Tenant C → "learn from Tenant A's healthcare patterns"
                    │  - _connect     │  KSP: "here's the artifact"
                    │  - _broadcast   │  Tenant C → Twin: "apply this pattern"
                    │  - _proxy       │  Twin: confidence evaluation, act
                    └─────────────────┘
                              │
                              ▼
                    Tenant B (Consumer) ──► Twin ──► Act
```

**KSP Interface:**

```typescript
export interface KSPInterface {
  _discover(query: KSPQuery): Promise<KSPArtifact[]>; // Trustless: no credential sharing
  _connect(source: string, target: string): Promise<KSPConnection>;
  _broadcast(artifact: KSPArtifact, tenants: string[]): Promise<KSPBroadcastResult>;
  _proxy(artifact: KSPArtifact, via: string): Promise<KSPProxyResult>;
}

export interface KSPArtifact {
  id: string; // Artifact ID
  origin: string; // Source tenant (or "ecosystem" for aggregate)
  topology: string; // Cluster label
  knowledgeType: "best_practice" | "decision_pattern" | "workflow_template" | "insight";
  content: Record<string, unknown>; // Anonymized, structured
  confidence: number; // ≥0.85 for distribution
  version: string; // Semantic
  createdAt: Date;
  expiresAt: Date; // TTL for ephemeral knowledge
}
```

### 9.3 Agent-to-Agent Communication (A2A)

A2A is the **peer-to-peer messaging layer** for agents that share intent, not identity. Each agent has a unique AgentID (GUID). Communication is via JSON over HTTP/HTTPS or WebSockets, with JSON Schema validation.

**A2A Protocol (5-step flow):**

1. **Agent Declaration (A2A Step 1):** Agent A publishes its capabilities, goals, and trust to an AgentID broker.
2. **Knowledge Exchange (A2A Step 2):** Agent A initiates a KSP connection with Agent B, exchanging cryptographically secure credentials.
3. **Knowledge Flow (A2A Step 3):** Agent A sends a knowledge artifact to Agent B via KSP, which is validated and decrypted at the destination.
4. **Action Execution (A2A Step 4):** Agent B interprets the artifact, executes the proposed action, and reports the outcome to the KSP.
5. **Reward Mechanism (A2A Step 5):** Based on the outcome, the KSP updates the trust and reward levels of both agents.

**A2A Message Schema:**

```typescript
export interface A2AMessage {
  fromAgentId: string; // GUID
  toAgentId: string; // GUID (or "*" for broadcast)
  type: "intent" | "knowledge" | "action" | "reward" | "trust";
  payload: Record<string, unknown>;
  signature: string; // Cryptographic signature
  nonce: string; // Replay protection
  timestamp: Date;
  ttl: number; // TTL in seconds
}
```

**A2A Boundaries:**

- A2A NEVER crosses tenant boundaries. Agents are always scoped to a single tenant.
- A2A is only for cross-service agent communication within the same tenant (e.g., `twin-orchestrator` → `knowledge` agent → `act` agent).
- KSP (Knowledge Sharing Protocol) is the only cross-tenant communication channel. A2A is intra-tenant.

### 9.4 Platform SDK (5 Variants)

The SDK is the consumer-facing bridge. It is 5 packages, 5 sizes, 5 use cases. The SDK abstracts the entire architecture: consumers never think about OODA, pipelines, or SSOC. They think about capabilities and entities.

| Package            | Size    | Target                                          | API Coverage                                               | Key Capabilities                                                                                                             |
| ------------------ | ------- | ----------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `@iw/sdk-full`     | ~180 KB | Workbench builders, extension devs              | Full (all capabilities, admin, auth, governance, identity) | `capability.invoke()`, `entity360.get()`, `memory.store()`, `twin.interact()`, `governance.listPending()`, `iam.provision()` |
| `@iw/sdk-lite`     | ~85 KB  | Browser/Node apps, dashboards, CLI              | Standard (workbench, AI, memory, discovery, knowledge)     | `capability.invoke()`, `entity360.get()`, `memory.store()`, `knowledge.query()`, `discovery.search()`                        |
| `@iw/sdk-content`  | ~45 KB  | Mobile, embedded widgets                        | Read-only (entity, memory, discovery, knowledge)           | `entity360.get()`, `knowledge.query()`, `discovery.search()`                                                                 |
| `@iw/sdk-minimal`  | ~12 KB  | Analytics, telemetry, logging                   | Telemetry only                                             | `telemetry.emit()`, `metrics.report()`                                                                                       |
| `@iw/sdk-headless` | ~3 KB   | Server-side, edge functions, background workers | Headless (no UI, no auth flow)                             | `capability.invoke()`, `token.refresh()`                                                                                     |

**SDK Architecture:**

```typescript
interface IWSdk {
  capability: { invoke<T>(uri: string, payload?: unknown): Promise<CapabilityResponse<T>> };
  entity360: { get(tenantId: string, entityId: string): Promise<Entity360> };
  memory: {
    store(tenantId: string, record: MemoryEntry): Promise<MemoryEntry>;
    query(tenantId: string, q: MemoryQuery): Promise<MemoryEntry[]>;
  };
  twin: { interact(tenantId: string, userId: string, input: string): Promise<TwinResponse> };
  knowledge: { query(tenantId: string, query: string): Promise<KnowledgeChunk[]> };
  governance: {
    listPending(tenantId: string, userId: string): Promise<PendingAction[]>;
    resolve(tenantId: string, proposalId: string, resolution: "approve" | "reject"): Promise<void>;
  };
  discovery: { search(tenantId: string, query: string): Promise<DiscoveryResult[]> };
  telemetry: { emit(event: TelemetryEvent): Promise<void> };
  metrics: { report(metric: Metric): Promise<void> };
  iam: { getUser(tenantId: string, userId: string): Promise<PlatformUser> };
  auth: { getToken(): Promise<Token>; refreshToken(): Promise<Token> };
  platform: { getHealth(): Promise<HealthStatus> };
}
```

**SDK Authentication:** Every SDK instance carries a `tenantId` (from init) and a `token` (from auth). The token is refreshed automatically. The `tenantId` is injected into every capability invocation. This prevents the "secret auth" issue seen in v1.0.1: the token is NEVER stored as a plain string; it is managed by the SDK's internal auth manager.

**SDK Usage Example (Workbench UI):**

```typescript
import { IWSDK } from "@iw/sdk-full";

const sdk = new IWSDK({
  tenantId: "t_abc123",
  authType: "oidc",
  provider: "auth0",
  clientId: "my-app",
  redirectUri: "https://app.integratewise.com/callback",
  scopes: ["capability:read", "capability:write", "memory:personal", "twin:interact"],
});

// Connect a new provider (triggers creamy sync)
await sdk.capability.invoke("platform.connect", {
  provider: "salesforce",
  credentialType: "nango",
  scopes: ["api", "refresh_token"],
});

// Get Entity360 for an account
const entity360 = await sdk.entity360.get("t_abc123", "ssoc_001");
console.log(entity360.primaryEntity); // { id, type, displayName, traits }
console.log(entity360.relatedEntities); // 5 linked entities
console.log(entity360.memory); // { lastInteraction, sentiment, keyTopics, openTasks }

// Interact with the Twin
const twinResponse = await sdk.twin.interact(
  "t_abc123",
  "u_456",
  "What should I do about Acme Corp?"
);
console.log(twinResponse.proposal); // { capability, confidence, payload, reasoning }

// List pending proposals in My Desk
const pending = await sdk.governance.listPending("t_abc123", "u_456");
pending.forEach((p) => console.log(p.summary, p.confidence, p.estimatedImpact));
```

### 9.5 CLI & Developer Tools

The CLI (`iw-cli`) is a terminal-based developer tool for advanced users, DevOps, and platform operators. It does not replace the SDK; it complements it for admin and debugging tasks.

| CLI Command     | Purpose                                  | SDK Equivalent                                             |
| --------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `iw auth`       | Login (device code flow, OAuth 2.0)      | `sdk.auth.getToken()`                                      |
| `iw capability` | Invoke, discover, validate capabilities  | `sdk.capability.invoke()`, `sdk.capability.discover()`     |
| `iw entity`     | Entity360 lookup, relationship graph     | `sdk.entity360.get()`                                      |
| `iw memory`     | Query, store, reinforce memory           | `sdk.memory.query()`, `sdk.memory.store()`                 |
| `iw twin`       | Interact with Twin, replay reasoning     | `sdk.twin.interact()`                                      |
| `iw knowledge`  | Upload, query, index documents           | `sdk.knowledge.query()`                                    |
| `iw governance` | Manage rules, review proposals           | `sdk.governance.listPending()`, `sdk.governance.setRule()` |
| `iw sync`       | Trigger manual sync, inspect status      | `sdk.capability.invoke('platform.sync.*')`                 |
| `iw iam`        | User CRUD, RBAC, SCIM provisioning       | `sdk.iam.getUser()`, `sdk.iam.provision()`                 |
| `iw provider`   | Adapter health check, credential refresh | `sdk.capability.invoke('platform.provider.*')`             |
| `iw telemetry`  | Export audit log, export telemetry       | `sdk.telemetry.emit()`                                     |
| `iw config`     | View/edit tenant config (admin only)     | N/A (admin)                                                |

**CLI Architecture:** The CLI is a Node.js app built on `oclif`. It wraps the `@iw/sdk-headless` package. Every command authenticates via the SDK's auth manager. No credentials are stored in the CLI config.

---

## 10. Data Model & Entity Relationships

> _"The Data Model is the spine of the Adaptive Spine. It is the contract that every service, every adapter, every pipeline must honor."_

This section defines the canonical data structures, entity relationships, and database schemas that power the IntegrateWise Continuity Bridge. All definitions use Drizzle ORM with SQLite (D1) dialect. KV cache and R2 storage are used for performance and archival, but D1 is the single source of truth for all relational data.

### 10.1 Spine (Entities, Relationships, Audit)

The Spine is the **directed property graph** that stores all canonical entities, their relationships, and the audit trail. Every table is prefixed with `spine_` for clarity.

```typescript
// ============================================
// SPINE — ENTITIES
// ============================================
export const spineEntities = sqliteTable("spine_entities", {
  id: text("id").primaryKey(), // SSOC UUID (v4, stable)
  tenantId: text("tenant_id").notNull(),
  entityType: text("entity_type").notNull(), // 'account', 'contact', 'deal', 'task', 'email', 'meeting', 'note'
  sourceId: text("source_id").notNull(), // Provider-native ID
  sourceProvider: text("source_provider").notNull(), // 'salesforce', 'hubspot', 'slack', 'github', 'stripe'
  canonicalName: text("canonical_name"),
  traits: text("traits", { mode: "json" }).$defaultFn(() => "{}"), // Normalized key-value
  ssocConfidence: real("ssoc_confidence").$defaultFn(() => 1.0), // 0.0–1.0
  firstSeenAt: integer("first_seen_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastModifiedAt: integer("last_modified_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  // Indexes: (tenant_id, entity_type), (tenant_id, source_provider, source_id) UNIQUE
});

export const spineEntityTraits = sqliteTable("spine_entity_traits", {
  id: text("id").primaryKey(),
  entityId: text("entity_id")
    .notNull()
    .references(() => spineEntities.id),
  tenantId: text("tenant_id").notNull(),
  key: text("key").notNull(), // e.g., 'email', 'phone', 'status'
  value: text("value"),
  valueType: text("value_type", {
    enum: ["string", "number", "boolean", "date", "json"],
  }).notNull(),
  confidence: real("confidence").$defaultFn(() => 1.0),
  source: text("source"), // 'sync', 'user', 'twin', 'inferred'
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, entity_id, key)
});

// ============================================
// SPINE — RELATIONSHIPS
// ============================================
export const spineRelationships = sqliteTable("spine_relationships", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  sourceEntityId: text("source_entity_id")
    .notNull()
    .references(() => spineEntities.id),
  targetEntityId: text("target_entity_id")
    .notNull()
    .references(() => spineEntities.id),
  relationType: text("relation_type").notNull(), // 'owns', 'reports_to', 'participates_in', 'attended', 'sent', 'linked_to'
  confidence: real("confidence").notNull(),
  provenance: text("provenance"), // 'inferred', 'declared', 'synced', 'user_created'
  firstInferredAt: integer("first_inferred_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, source_entity_id), (tenant_id, target_entity_id)
});

// ============================================
// SPINE — AUDIT LOG
// ============================================
export const spineAuditLog = sqliteTable("spine_audit_log", {
  id: text("id").primaryKey(), // ULID
  tenantId: text("tenant_id").notNull(),
  entityId: text("entity_id"), // SSOC UUID or null for non-entity actions
  action: text("action").notNull(), // 'create', 'update', 'delete', 'read', 'mcp_invoke', 'credential_access', 'sync', 'sync_error'
  actor: text("actor").notNull(), // 'user:<id>', 'twin', 'agent:<id>', 'system', 'service:<name>'
  via: text("via"), // 'mcp', 'webhook', 'sync', 'act', 'govern', 'twin', 'normalizer', 'pipeline'
  payloadHash: text("payload_hash"), // SHA-256 of normalized payload
  metadata: text("metadata", { mode: "json" }),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  // Index: (tenant_id, timestamp), (tenant_id, entity_id, timestamp)
});
```

### 10.2 Memory Schema (4 Scopes, 3 Tiers)

```typescript
// ============================================
// MEMORY — RECORDS
// ============================================
export const memoryRecords = sqliteTable("memory_records", {
  id: text("id").primaryKey(), // ULID
  tenantId: text("tenant_id").notNull(),
  scope: text("scope", { enum: ["personal", "work", "organization", "ai"] }).notNull(),
  ownerId: text("owner_id").notNull(), // user_id for personal, task_id for work, tenant_id for org, agent_id for ai
  tier: text("tier", { enum: ["active", "staging", "archived"] }).notNull(),
  content: text("content").notNull(),
  embedding: text("embedding"), // Serialized vector (optional, also in Vectorize)
  confidence: real("confidence").notNull(), // Triage-assigned confidence
  source: text("source").notNull(), // 'sync', 'user_action', 'twin_proposal', 'act_writeback', 'twin_observation', 'external'
  ssocReferences: text("ssoc_references", { mode: "json" }).$defaultFn(() => "[]"), // Array of SSOC IDs
  accessCount: integer("access_count").$defaultFn(() => 0),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }),
  decayAt: integer("decay_at", { mode: "timestamp" }), // When auto-archive
  validUntil: integer("valid_until", { mode: "timestamp" }), // null = permanent
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, scope, owner_id, tier), (tenant_id, decay_at)
});

// ============================================
// MEMORY — DECAY LOG
// ============================================
export const memoryDecayLog = sqliteTable("memory_decay_log", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memoryRecords.id),
  fromTier: text("from_tier", { enum: ["active", "staging", "archived"] }).notNull(),
  toTier: text("to_tier", { enum: ["active", "staging", "archived", "discarded"] }).notNull(),
  decayScore: real("decay_score").notNull(),
  reason: text("reason").notNull(), // 'time_decay', 'reinforcement', 'manual_archive', 'triage_rule'
  executedAt: integer("executed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, memory_id, executed_at)
});

// ============================================
// MEMORY — REINFORCEMENT LOG
// ============================================
export const memoryReinforcementLog = sqliteTable("memory_reinforcement_log", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memoryRecords.id),
  triggeredBy: text("triggered_by").notNull(), // 'user_access', 'twin_reference', 'act_writeback', 'manual'
  oldAccessCount: integer("old_access_count").notNull(),
  newAccessCount: integer("new_access_count").notNull(),
  oldDecayAt: integer("old_decay_at", { mode: "timestamp" }),
  newDecayAt: integer("new_decay_at", { mode: "timestamp" }),
  reinforcedAt: integer("reinforced_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, memory_id, reinforced_at)
});
```

### 10.3 Tenant Schema (Workspace, Users, RBAC, Billing)

```typescript
// ============================================
// TENANT — WORKSPACE
// ============================================
export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(), // tenant_id
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan", { enum: ["free", "starter", "growth", "enterprise"] }).$defaultFn(
    () => "free"
  ),
  status: text("status", { enum: ["active", "suspended", "cancelled"] }).$defaultFn(() => "active"),
  dataResidency: text("data_residency", { enum: ["global", "eu", "us", "au"] }).$defaultFn(
    () => "global"
  ),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// TENANT — USERS
// ============================================
export const platformUsers = sqliteTable("platform_users", {
  id: text("id").primaryKey(), // user_id
  tenantId: text("tenant_id")
    .notNull()
    .references(() => workspaces.id),
  email: text("email").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: text("role", {
    enum: ["owner", "tam", "account_success", "admin", "member", "viewer"],
  }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).$defaultFn(() => true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  // Index: (tenant_id, email), (tenant_id, role)
});

// ============================================
// TENANT — RBAC
// ============================================
export const tenantRoles = sqliteTable("tenant_roles", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => workspaces.id),
  name: text("name").notNull(), // 'owner', 'admin', 'member', 'viewer'
  permissions: text("permissions", { mode: "json" }).notNull(), // JSON array of capability URIs
  isSystem: integer("is_system", { mode: "boolean" }).$defaultFn(() => false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, name)
});

export const roleAssignments = sqliteTable("role_assignments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => platformUsers.id),
  roleId: text("role_id")
    .notNull()
    .references(() => tenantRoles.id),
  assignedBy: text("assigned_by")
    .notNull()
    .references(() => platformUsers.id),
  assignedAt: integer("assigned_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, user_id), (tenant_id, role_id)
});

// ============================================
// TENANT — BILLING
// ============================================
export const billingSubscriptions = sqliteTable("billing_subscriptions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => workspaces.id),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  plan: text("plan").notNull(),
  status: text("status", {
    enum: ["active", "trialing", "past_due", "cancelled", "paused"],
  }).notNull(),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

### 10.4 Governance Schema (Proposals, Audit, HITL)

```typescript
// ============================================
// GOVERNANCE — PROPOSALS
// ============================================
export const actionProposals = sqliteTable("action_proposals", {
  id: text("id").primaryKey(), // ULID
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(), // Target user for approval
  capability: text("capability").notNull(), // Capability URI
  confidence: real("confidence").notNull(),
  status: text("status", {
    enum: ["pending", "approved", "rejected", "modified", "discarded", "expired", "auto_approved"],
  }).notNull(),
  payload: text("payload", { mode: "json" }), // Normalized payload
  summary: text("summary").notNull(), // Human-readable summary
  reasoningTrace: text("reasoning_trace"), // Twin reasoning
  estimatedImpact: text("estimated_impact", { mode: "json" }), // { revenue, timeSaved, riskScore }
  approvedBy: text("approved_by"), // user_id or null
  approvedAt: integer("approved_at", { mode: "timestamp" }),
  modifiedBy: text("modified_by"),
  modifiedAt: integer("modified_at", { mode: "timestamp" }),
  discardedAt: integer("discarded_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }), // 72h from creation
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // Index: (tenant_id, user_id, status), (tenant_id, expires_at)
});

// ============================================
// GOVERNANCE — AUDIT LOG
// ============================================
export const governanceAuditLog = sqliteTable("governance_audit_log", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  proposalId: text("proposal_id")
    .notNull()
    .references(() => actionProposals.id),
  action: text("action").notNull(), // 'auto_approved', 'queued', 'discarded', 'approved', 'rejected', 'modified', 'expired', 'rule_blocked', 'escalated'
  actor: text("actor").notNull(), // 'user:<id>', 'twin', 'system', 'rule:<id>'
  reason: text("reason").notNull(),
  metadata: text("metadata", { mode: "json" }),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  // Index: (tenant_id, proposal_id, timestamp)
});

// ============================================
// GOVERNANCE — HITL SESSIONS
// ============================================
export const hitlSessions = sqliteTable("hitl_sessions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  proposalId: text("proposal_id")
    .notNull()
    .references(() => actionProposals.id),
  status: text("status", { enum: ["open", "resolved", "expired"] }).notNull(),
  openedAt: integer("opened_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  resolution: text("resolution", { enum: ["approve", "reject", "modify", "dismiss"] }),
  // Index: (tenant_id, user_id, status), (tenant_id, opened_at)
});
```

### 10.5 Entity Relationship Diagram (ERD)

```
                    ┌─────────────────────┐
                    │     WORKSPACE       │
                    │   (tenant_id = PK)  │
                    │                     │
                    │  1:N  ──────────────┼────► PLATFORM_USERS
                    │  1:N  ──────────────┼────► TENANT_ROLES
                    │  1:N  ──────────────┼────► BILLING_SUBSCRIPTIONS
                    │  1:N  ──────────────┼────► CONNECTORS
                    │  1:N  ──────────────┼────► KNOWLEDGE_DOCUMENTS
                    │  1:1  ──────────────┼────► TELEMETRY_HUB_CONFIG
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │   PLATFORM_USERS    │
                    │  (user_id = PK)     │
                    │                     │
                    │  N:1  ──────────────┼────► TENANT_ROLES (via ROLE_ASSIGNMENTS)
                    │  1:1  ──────────────┼────► HITL_SESSIONS (active)
                    │  1:N  ──────────────┼────► ACTION_PROPOSALS (as reviewer)
                    │  1:N  ──────────────┼────► SPINE_AUDIT_LOG (as actor)
                    │  1:N  ──────────────┼────► MEMORY_RECORDS (personal scope)
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │    SPINE_ENTITIES   │
                    │   (id = SSOC = PK)  │
                    │                     │
                    │  1:N  ──────────────┼────► SPINE_ENTITY_TRAITS
                    │  1:N  ──────────────┼────► SPINE_RELATIONSHIPS (source)
                    │  1:N  ──────────────┼────► SPINE_RELATIONSHIPS (target)
                    │  1:N  ──────────────┼────► SPINE_AUDIT_LOG
                    │  1:N  ──────────────┼────► MEMORY_RECORDS (via ssocReferences)
                    │  1:N  ──────────────┼────► ACTION_PROPOSALS (affected entity)
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │ SPINE_RELATIONSHIPS │
                    │  (id = PK)          │
                    │  source_entity_id   │
                    │  target_entity_id   │
                    │  relation_type      │
                    │  confidence         │
                    │  provenance         │
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │   MEMORY_RECORDS    │
                    │   (id = PK)         │
                    │   scope             │
                    │   tier              │
                    │   confidence        │
                    │  1:N  ──────────────┼────► MEMORY_DECAY_LOG
                    │  1:N  ──────────────┼────► MEMORY_REINFORCEMENT_LOG
                    │  1:N  ──────────────┼────► SPINE_AUDIT_LOG (as resource)
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │  ACTION_PROPOSALS   │
                    │   (id = PK)         │
                    │   capability        │
                    │   confidence        │
                    │   status            │
                    │  1:N  ──────────────┼────► GOVERNANCE_AUDIT_LOG
                    │  1:1  ──────────────┼────► HITL_SESSIONS
                    └─────────────────────┘
                              │
                              │ 1:N
                              ▼
                    ┌─────────────────────┐
                    │ GOVERNANCE_AUDIT_LOG│
                    │   (id = PK)         │
                    │   action            │
                    │   actor               │
                    │   reason            │
                    │   timestamp         │
                    └─────────────────────┘
```

**ERD Constraints (CRITICAL):**

1. All tables have `tenant_id` as first column in every composite index.
2. `spine_entities.id` is a UUIDv4 (SSOC) — never provider-native ID.
3. `spine_relationships` has bidirectional integrity: deleting a source entity must cascade delete relationships.
4. `action_proposals` has `expiresAt` — auto-expiry after 72 hours (enforced by HITL DO alarm).
5. `memory_records` has `decayAt` — used by nightly Triage Worker for tier promotion.
6. `spine_audit_log` is append-only — never UPDATE, never DELETE. No cascade delete from any table to audit log.

### 10.6 Drizzle ORM Definitions (Full Snippet)

```typescript
// ============================================
// SHARED SCHEMA COMPOSITION
// ============================================
export const id = text("id").primaryKey(); // UUIDv4 for entities, ULID for events
export const tenantId = text("tenant_id").notNull(); // Every table, every query
export const timestamp = (name: string) =>
  integer(name, { mode: "timestamp" }).$defaultFn(() => new Date());
export const createdAt = timestamp("created_at");
export const updatedAt = timestamp("updated_at");

// ============================================
// CAPABILITY REGISTRY (§4.1)
// ============================================
export const capabilityRegistry = sqliteTable("capability_registry", {
  id: text("id").primaryKey(), // "salesforce.opportunity.update"
  tenantId,
  namespace: text("namespace").notNull(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),
  oodaPhase: text("ooda_phase", {
    enum: ["observe", "orient", "decide", "act", "cross-phase"],
  }).notNull(),
  runtime: text("runtime", { enum: ["agent", "pipeline", "workflow", "mcp", "direct"] }).notNull(),
  serviceBinding: text("service_binding").notNull(),
  handler: text("handler").notNull(),
  inputSchema: text("input_schema"),
  outputSchema: text("output_schema"),
  requiresApproval: integer("requires_approval", { mode: "boolean" }).default(false),
  minConfidence: real("min_confidence").default(0.7),
  autoApproveThreshold: real("auto_approve_threshold").default(0.85),
  requiredRoles: text("required_roles"),
  requiredScopes: text("required_scopes"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeprecated: integer("is_deprecated", { mode: "boolean" }).default(false),
  deprecationNote: text("deprecation_note"),
  createdAt,
  updatedAt,
});

// ============================================
// KNOWLEDGE (§5.7)
// ============================================
export const knowledgeDocuments = sqliteTable("knowledge_documents", {
  id: text("id").primaryKey(),
  tenantId,
  title: text("title").notNull(),
  source: text("source", { enum: ["upload", "sync", "twin_generated", "user_created"] }).notNull(),
  mimeType: text("mime_type").notNull(),
  r2Key: text("r2_key").notNull(),
  chunks: text("chunks", { mode: "json" }).$defaultFn(() => "[]"),
  metadata: text("metadata", { mode: "json" }).$defaultFn(() => "{}"),
  createdBy: text("created_by").notNull(),
  createdAt,
  updatedAt,
});

export const knowledgeChunks = sqliteTable("knowledge_chunks", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => knowledgeDocuments.id),
  tenantId,
  content: text("content").notNull(),
  embedding: text("embedding"),
  startIndex: integer("start_index").notNull(),
  endIndex: integer("end_index").notNull(),
  metadata: text("metadata", { mode: "json" }).$defaultFn(() => "{}"),
  createdAt,
});

// ============================================
// CONNECTORS (§7.1)
// ============================================
export const connectors = sqliteTable("connectors", {
  id: text("id").primaryKey(),
  tenantId,
  provider: text("provider").notNull(),
  name: text("name").notNull(),
  credentialType: text("credential_type", { enum: ["nango", "native", "mcp"] }).notNull(),
  status: text("status", { enum: ["connected", "disconnected", "error", "syncing"] }).notNull(),
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  nextSyncAt: integer("next_sync_at", { mode: "timestamp" }),
  syncError: text("sync_error"),
  createdAt,
  updatedAt,
});

export const connectorMappings = sqliteTable("connector_mappings", {
  id: text("id").primaryKey(),
  tenantId,
  connectorId: text("connector_id")
    .notNull()
    .references(() => connectors.id),
  resource: text("resource").notNull(),
  providerSchema: text("provider_schema", { mode: "json" }).notNull(),
  canonicalType: text("canonical_type").notNull(),
  mappingRules: text("mapping_rules", { mode: "json" }).notNull(),
  createdAt,
  updatedAt,
});

// ============================================
// SCHEMA PROVIDER (§5.4)
// ============================================
export const schemaDefinitions = sqliteTable("schema_definitions", {
  id: text("id").primaryKey(),
  tenantId,
  entityType: text("entity_type").notNull(),
  version: text("version").notNull().default("1.0.0"),
  baseSchema: text("base_schema", { mode: "json" }).notNull(), // IntegrateWise IP
  tenantOverlay: text("tenant_overlay", { mode: "json" }).$defaultFn(() => "{}"), // Customer context
  providerMap: text("provider_map", { mode: "json" }).$defaultFn(() => "{}"), // Adapter config
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt,
  updatedAt,
});

// ============================================
// TELEMETRY & METRICS
// ============================================
export const telemetryEvents = sqliteTable("telemetry_events", {
  id: text("id").primaryKey(),
  tenantId,
  userId: text("user_id"),
  sessionId: text("session_id"),
  eventType: text("event_type").notNull(),
  eventData: text("event_data", { mode: "json" }).$defaultFn(() => "{}"),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const platformMetrics = sqliteTable("platform_metrics", {
  id: text("id").primaryKey(),
  tenantId,
  metricName: text("metric_name").notNull(),
  value: real("value").notNull(),
  labels: text("labels", { mode: "json" }).$defaultFn(() => "{}"),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

---

## 11. Security Model & Zero-Trust Architecture

> _"Security is not a layer. It is a property. Every line of code, every API call, every Durable Object activation must be tenant-isolated, credential-safe, and auditable."_

The security model is a **defense-in-depth, zero-trust, tenant-isolated** system. Every service, every Durable Object, every adapter, every queue message must satisfy the security invariants. Failures are **fail-loud** — never fail-silent.

### 11.1 4-Zone Trust Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC ZONE                                    │
│  Ingress (Cloudflare + WAF) → SDK → OAuth 2.0 / OIDC / Device Code Flow   │
│  No credentials, no provider secrets, no tenant data                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ (WAF validated, JWT issued)
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONSUMER ZONE                                  │
│  Workbench → SDK → Gateway → API-1 (JWT + RBAC + Rate Limit)               │
│  Tenant-scoped capabilities, read-only by default, write requires scope       │
│  Validation: JWT signature, tenant_id match, role match, scope match         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ (Service Binding, no JWT re-validation)
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE ZONE                                   │
│  Capability Layer → Continuity Layer → Governance Layer → Provider Fabric    │
│  Service bindings: no credentials shared, no Durable Objects reused         │
│  Internal headers: `x-tenant-id`, `x-correlation-id`, `x-caller-service`     │
│  Access: D1 (read-only except pipeline), KV (read-only except pipeline)   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ (Credential Wall)
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PROVIDER ZONE                                  │
│  Nango / MCP / Native adapters → External APIs                              │
│  All credentials stored in Cloudflare Secrets or Nango Vault                │
│  NEVER logged. NEVER returned. Accessed via Credential Wall.                │
│  Every call: Tenant ID, Correlation ID, Entity360 Context, Audit Log        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Core Security Principles (P0)

| ID       | Principle                      | Implementation                                                                                                                     | Failure Behavior                                                     |
| -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **P0-1** | **Zero-Trust Everywhere**      | Every request is authenticated, authorized, and audited. No internal exceptions.                                                   | Unauthorized: 403. Invalid JWT: 401. Missing scope: 403.             |
| **P0-2** | **Tenant Isolation by Design** | `WHERE tenant_id = ?` on every query. Durable Object IDs include `tenant_id`. Every queue message carries `tenant_id`.             | Cross-tenant query: 403 + alert. Shared DO: crash.                   |
| **P0-3** | **Credential Separation**      | `pipeline` is the only writer to D1. Adapters NEVER access credentials directly. Secrets are in Cloudflare Secrets or Nango Vault. | Credential leak: immediate rotation. Invalid credential access: 403. |
| **P0-4** | **Durable Object Security**    | `DO ID = idFromName(tenant_id + ":" + user_id)`. NEVER `idFromName("global")`. NEVER share DOs.                                    | Shared DO: crash. Missing tenant prefix: 403.                        |
| **P0-5** | **Fail-Loud**                  | All cross-tenant detection, credential leakage, and misconfigurations trigger immediate errors + audit.                            | No fail-silent. Every P0 failure is logged + alerted.                |
| **P0-6** | **Idempotency by Design**      | Every write operation carries an idempotency key. Replay of the same key returns the same result.                                  | Duplicate execution: 409 + cached result.                            |
| **P0-7** | **Least Privilege**            | Every service, every adapter, every Durable Object has the minimum permissions needed.                                             | Over-permission: detected by security review, blocked.               |
| **P0-8** | **Encryption by Default**      | At-rest: D1 encrypted by Cloudflare. In-transit: TLS 1.3. Credentials: Cloudflare Secrets.                                         | Unencrypted transit: rejected. Unencrypted at-rest: flagged.         |
| **P0-9** | **MCP Security**               | MCP sessions: TLS 1.3 + OAuth 2.0. Outbound MCP: `_iw_context` injection. Read-only default.                                       | Unauthorized MCP: 403. Write without scope: 403.                     |

### 11.3 Provider Fabric Security (P1)

| ID       | Principle                   | Implementation                                                                     | Failure Behavior                                       |
| -------- | --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **P1-1** | **Credential Wall**         | `getCredentials()` is the ONLY function that fetches secrets. NEVER direct access. | Direct credential access: rejected + audit.            |
| **P1-2** | **Credential Rotation**     | Nango auto-refresh. Native: admin CLI or cron. Max age: 90 days.                   | Expired credential: rejected. Stale credential: alert. |
| **P1-3** | **Cross-Tenant Prevention** | Credential lookup is scoped to `tenant_id`. No provider-level shared credentials.  | Cross-tenant credential: 403 + alert.                  |
| **P1-4** | **Audit Provider Calls**    | Every provider call logs to `outbound_mcp_calls` + `spine_audit_log`.              | Missing audit: operation halted.                       |
| **P1-5** | **Provider Call Policy**    | Scope-based: `read-only` (default), `write-with-governance`, `full-access`.        | Scope violation: 403.                                  |
| **P1-6** | **Credential Refresh**      | Native: 60 min. MCP: 5 min. Nango: handled by Nango.                               | Stale token: rejected. Refresh failure: alert.         |
| **P1-7** | **Backup & Recovery**       | All secrets: encrypted, backed up to offsite.                                      | Loss: recovery from backup.                            |
| **P1-8** | **Credential Monitoring**   | Anomaly detection: unusual call volume, unexpected IPs.                            | Anomaly: alert + circuit breaker.                      |
| **P1-9** | **MCP Security Boundaries** | TLS 1.3, OAuth 2.0, `_iw_context` injection, read-only default, scope-based write. | Violation: 403.                                        |

### 11.4 Compliance Framework (SOC 2, GDPR, HIPAA)

| Standard          | Controls                                                                      | Implementation                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **SOC 2 Type II** | Access controls, encryption, monitoring, incident response, change management | RBAC, D1 encryption, audit logs, alerting, CI/CD pipeline with approval gates                                                          |
| **GDPR**          | Data subject rights, lawful basis, minimization, breach notification          | Right to Erasure (anonymize audit subjects), Right to Access (export API), Right to Portability (export JSON), 72h breach notification |
| **HIPAA**         | PHI access, audit, encryption, business associate agreements                  | HIPAA-eligible on enterprise plan, BAA with Cloudflare, PHI in encrypted fields, audit trail for 7 years                               |
| **CCPA**          | Right to know, delete, opt-out                                                | Data inventory, deletion API, opt-out for telemetry sharing                                                                            |

**Data Residency:**

- Free/Starter: Global Cloudflare edge
- Growth: EU or US region selectable
- Enterprise: Custom region + jurisdiction pinning + data processing agreement

**Data Retention:**
| Data Type | Active | Archive | Retention |
|-----------|--------|---------|-----------|
| Memory (active) | D1 + KV | R2 | 30 days (with reinforcement) |
| Memory (permanent) | D1 + KV | — | Permanent (until workspace deletion) |
| Audit log | D1 | R2 | 7 years |
| Telemetry | KV | R2 | 7 days |
| Provider call log | D1 | R2 | 90 days |
| Normalizer DLQ | R2 | — | 7 years |
| Governance proposals | D1 | R2 | 7 years |

### 11.5 Threat Model (Key Threats & Mitigations)

| Threat                       | Vector                                               | Impact        | Mitigation                                                                                         |
| ---------------------------- | ---------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **Cross-Tenant Data Access** | Bug in query logic, missing `WHERE tenant_id`        | CRITICAL (P0) | Strict query builder, DO ID prefix, service binding propagation, automated tests, fail-loud        |
| **Credential Leakage**       | Log exposure, adapter misconfig, memory dump         | CRITICAL (P0) | Cloudflare Secrets, no credential in logs, Credential Wall, Nango Vault, rotation                  |
| **DoS / Abuse**              | Rate limit bypass, credential stuffing, webhook spam | HIGH (P1)     | WAF, API-1 rate limits, queue backpressure, circuit breaker, KV-based DDoS protection              |
| **LLM Injection**            | Malicious prompt via MCP or workbench                | HIGH (P1)     | Input validation, output sanitization, structured prompts, capability scoping, no raw SQL from LLM |
| **Data Poisoning**           | Malformed provider data corrupts Spine               | HIGH (P1)     | Schema validation, Normalizer NA6 stage, 8-stage pipeline, reject non-conforming data              |
| **Supply Chain Attack**      | Malicious adapter, compromised dependency            | HIGH (P1)     | Lockfile review, SCA, dependency pinning, container signing, reproducible builds                   |
| **Insider Threat**           | Admin override, credential abuse                     | MEDIUM (P2)   | Audit logs, approval gates, principle of least privilege, admin activity monitoring                |
| **Provider Compromise**      | Provider breach, API key leak                        | MEDIUM (P2)   | Credential rotation, least-privilege scopes, anomaly detection, incident response plan             |
| **Replay Attack**            | Reuse of old request payload                         | MEDIUM (P2)   | Idempotency keys, JWT exp, nonce, timestamp validation                                             |
| **Ecosystem Breach**         | Cross-tenant knowledge sharing leak                  | MEDIUM (P2)   | Anonymization, confidence threshold ≥0.85, KSP consent, policy compliance                          |
| **DDoS on Workers**          | Burst traffic overwhelms Workers                     | MEDIUM (P2)   | KV-based rate limiting, queue backpressure, auto-scaling, WAF                                      |

### 11.6 Authentication & Authorization

**OAuth 2.0 / OIDC Flow:**

```
User ──► Workbench ──► Auth0 / Cognito / Keycloak ──► JWT Token
                               │
                               │  id_token (JWT) + access_token (opaque)
                               │
                               ▼
                         ┌─────────────────┐
                         │  JWT Claims     │
                         │  sub: user_id   │
                         │  tenant_id: t_  │
                         │  rbac: role     │
                         │  scope: array   │
                         │  exp: 3600s     │
                         └─────────────────┘
                               │
                               ▼
                         Gateway (API-1)
                         - Validate signature
                         - Extract tenant_id
                         - Verify role + scope
                         - Inject x-tenant-id header
```

**Device Code Flow (CLI):**

1. `iw auth` → SDK requests device code from Auth0
2. User opens browser, authenticates
3. CLI polls for token
4. Token received, stored in keychain (never plain file)

**RBAC Roles:**

| Role                | Read | Write | Admin | Governance | Twin | AI  |
| ------------------- | ---- | ----- | ----- | ---------- | ---- | --- |
| **owner**           | All  | All   | All   | All        | All  | All |
| **tam**             | All  | All   | No    | All        | All  | All |
| **account_success** | All  | All   | No    | No         | All  | All |
| **admin**           | All  | All   | All   | All        | All  | All |
| **member**          | Own  | Own   | No    | No         | Own  | Own |
| **viewer**          | Read | No    | No    | No         | No   | No  |

### 11.7 Audit & Compliance Logging

All audit logs are **immutable, append-only, fail-loud**. See §6.4 for the `AuditEvent` interface and `auditLog()` function.

**Audit Log Retention:**

- D1: 90 days (hot queries)
- R2: 7 years (cold storage, compliance)
- KV: NOT used for audit (ephemeral, not persistent)

**Audit Log Access:**

- Read: `govern` service, `iam` service (admin), `audit` CLI command
- Export: API endpoint `/v1/audit/export` (JSON, CSV, Parquet)
- Deletion: NEVER. GDPR anonymization: update `dataSubjectId` to `anonymized` hash, keep audit trail.

### 11.8 Secret Management

| Tier                 | Storage            | Access                    | Rotation           | Backup       |
| -------------------- | ------------------ | ------------------------- | ------------------ | ------------ |
| **OAuth tokens**     | Nango Vault        | `act` via Credential Wall | Nango auto-refresh | Nango backup |
| **API keys**         | Cloudflare Secrets | `act` via Credential Wall | Admin CLI, 90 days | CF backup    |
| **JWT signing keys** | Cloudflare Secrets | `gateway`                 | Admin CLI, 90 days | CF backup    |
| **DB credentials**   | Cloudflare Secrets | `pipeline`                | Admin CLI, 90 days | CF backup    |
| **Encryption keys**  | Cloudflare Secrets | `pipeline`                | Admin CLI, 1 year  | CF backup    |
| **MCP tokens**       | Cloudflare Secrets | `act` via Credential Wall | Admin CLI, 90 days | CF backup    |

**Secret Rotation Process:**

1. Generate new secret
2. Update Cloudflare Secrets
3. Deploy with new secret reference
4. Grace period: 24h (both old and new valid)
5. Invalidate old secret
6. Audit log: `secret_rotated`

### 11.9 Data Residency & Encryption

**Encryption:**

- At-rest: D1 encrypted by Cloudflare (AES-256). R2 encrypted by Cloudflare (AES-256).
- In-transit: TLS 1.3 (minimum).
- In-memory: Cloudflare Workers memory is ephemeral, no persistent encryption needed.
- Credentials: Cloudflare Secrets (AES-256).

**Data Residency:**
| Plan | Default | Configurable | Jurisdiction |
|------|---------|-------------|-------------|
| Free | Global | No | — |
| Starter | Global | No | — |
| Growth | Global | Yes (EU, US) | GDPR, CCPA |
| Enterprise | Custom | Yes (EU, US, AU, JP) | Custom DPA |

### 11.10 Security Decision Log (v1.0.1 → v2.0)

| Decision                         | Version | Rationale                                   | Impact                              |
| -------------------------------- | ------- | ------------------------------------------- | ----------------------------------- |
| **Adapter inside act/connector** | v1.0.1  | Zero extra hop, no centralized orchestrator | Simpler, faster, more secure        |
| **JWT + API Keys only**          | v1.0.1  | No custom auth, standard OAuth 2.0          | Simpler, interoperable, auditable   |
| **Pipeline sole writer**         | v1.0.1  | Single point of truth, no contention        | Simpler, no data races, clear audit |
| **0.70/0.85 confidence**         | v1.0.1  | Balanced automation with human oversight    | Industry standard, clear governance |
| **4 memory scopes**              | v1.0.1  | Personal, Work, Organization, AI            | Clear boundaries, RBAC-gated        |
| **8 lens taxonomy**              | v1.0.1  | Comprehensive coverage, user-friendly       | Better UX, no user confusion        |
| **Tenant-scoped DOs**            | v1.0.1  | No shared DOs, no cross-tenant leakage      | P0 security requirement             |
| **Credential Wall**              | v1.0.1  | Single point of secret retrieval            | No credential sprawl, full audit    |
| **Nango + MCP + Native**         | v1.0.1  | Three adapter types, no lock-in             | Swappable, no code changes          |
| **5 SDK variants**               | v1.0.1  | Right-sized for every use case              | Better DX, no bundle bloat          |
| **HITL expiry (72h)**            | v1.0.1  | Prevents stale proposals                    | Better UX, cleaner governance       |
| **KSP anonymization**            | v1.0.1  | No tenant data crosses boundaries           | Privacy, compliance, trust          |
| **MCP read-only default**        | v1.0.1  | Write requires explicit scope               | Security, no accidental writes      |
| **Entity360 injection**          | v1.0.1  | Context-rich provider calls                 | Better UX, no manual context        |
| **Fail-loud**                    | v1.0.1  | Never fail-silent                           | Security, compliance, trust         |

---

## 12. Deployment Architecture

This section defines the physical substrate of the IntegrateWise Continuity Bridge v2.0. It is the canonical reference for how the 26-service mesh maps to Cloudflare primitives, how data flows across those primitives, and how the platform maintains tenant isolation, observability, and deployability at scale.

Every physical primitive carries `tenant_id`. Every deployment unit is tenant-agnostic at the infrastructure level — isolation is enforced at the data layer, not by separate infrastructure per tenant.

### 12.1 Service Topology

All 26 services deploy as Cloudflare Workers. All serve all tenants. Customer-Zero is a tenant class, not a separate deployment.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              TIER 0 — INGRESS                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐   │
│  │   gateway       │    │ webhook-ingress │    │  (Pages) apps/web       │   │
│  │   integratewise-│    │   iw-webhook-   │    │  (Pages) apps/mcp-server│   │
│  │   gateway       │    │   ingress       │    │                         │   │
│  │   [Worker]      │    │   [Worker]      │    │  [Cloudflare Pages]     │   │
│  └────────┬────────┘    └────────┬────────┘    └─────────────────────────┘   │
│           │                      │                                            │
│           ▼                      ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                     SERVICE BINDINGS (RPC)                              │  │
│  │  gateway ──► {TENANTS, WEBHOOK_INGRESS, NORMALIZER, PIPELINE, ACT, ...} │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│                              TIER 1 — TENANT & SYNC                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   tenants   │  │  connector  │  │connector-sync│  │      normalizer     │  │
│  │  iw-tenants │  │ iw-connector│  │iw-connector- │  │    iw-normalizer    │  │
│  │  [Worker]   │  │  [Worker]   │  │   sync      │  │     [Worker]        │  │
│  └─────────────┘  └─────────────┘  │   [Worker]   │  └─────────────────────┘  │
│  ┌─────────────┐                   └─────────────┘  ┌─────────────────────┐  │
│  │    loader   │                                    │     spine-v2        │  │
│  │  iw-loader  │                                    │     iw-spine-v2     │  │
│  │  [Worker]   │                                    │     [Worker]        │  │
│  └─────────────┘                                    └─────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│                           TIER 2 — PROJECTION & RENDERING                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   pipeline  │  │twin-orchestr│  │     l2      │  │    intelligence     │  │
│  │ iw-pipeline │  │   ator      │  │    iw-l2    │  │   iw-intelligence   │  │
│  │ [Worker]    │  │ [Durable    │  │  [Worker]   │  │    [Worker]         │  │
│  │             │  │  Object]    │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  knowledge  │  │   govern    │  │    store    │  │        act          │  │
│  │ iw-knowledge│  │  iw-govern  │  │   iw-store  │  │      iw-act         │  │
│  │  [Worker]   │  │  [Worker]   │  │  [Worker]   │  │     [Worker]        │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│                        TIER 3 — CAPABILITY RUNTIME                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   hermes    │  │   triage    │  │   workflow  │  │   iw-agent-runtime  │  │
│  │  iw-hermes  │  │  iw-triage  │  │ iw-workflow │  │  iw-agent-runtime   │  │
│  │ [Durable    │  │ [Worker —   │  │ [Durable    │  │     [Worker]        │  │
│  │  Object]    │  │  in Hermes] │  │  Object]    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                      mcp-connector (inbound MCP)                        │  │
│  │                      iw-mcp-connector [Worker]                          │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│                            TIER 4 — SUPPORTING                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │agent-registry│  │   billing   │  │    admin    │  │folder-watcher│       │  │
│  │iw-agent-reg │  │ iw-billing  │  │  iw-admin   │  │ iw-folder-   │       │  │
│  │  [Worker]   │  │  [Worker]   │  │  [Worker]   │  │  watcher     │       │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │ [Durable     │       │  │
│  ┌─────────────┐  ┌─────────────┐                   │   Object]    │       │  │
│  │  continuity │  │  telemetry  │                   └─────────────┘       │  │
│  │iw-continuity│  │ iw-telemetry│  ┌─────────────┐                        │  │
│  │  [Worker]   │  │  [Worker]   │  │    think    │                        │  │
│  └─────────────┘  └─────────────┘  │   iw-think  │                        │  │
│                                     │   [Worker]  │                        │  │
│                                     └─────────────┘                        │  │
└──────────────────────────────────────────────────────────────────────────────┘
```

The OODA loop physically spans Tier 2 (Observe + Orient via `normalizer`, `intelligence`, `knowledge`) and Tier 3 (Decide + Act via `twin-orchestrator`, `govern`, `workflow`, `act`). The loop closes through `pipeline` writes to Spine.

`spine-v2` is the normalization and graph service that supports the Adaptive Spine. `store` materializes projections (accounts, deals, tasks) for fast reads. `l2` renders the 8-lens projection overlays (department × industry).

### 12.2 Cloudflare Primitives

The platform maps its 26 services to eight Cloudflare primitives. Each primitive is tenant-scoped at the data layer, never at the infrastructure layer.

| Primitive           | Services Using                                                                                    | Tenant Isolation                                  | Purpose                   |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------- |
| **Workers**         | All 26 services                                                                                   | Stateless by design; `tenant_id` in every request | Compute mesh              |
| **D1**              | `pipeline`, `intelligence`, `continuity`, `govern`, `tenants`, `knowledge`, `normalizer`, `store` | `WHERE tenant_id = ?` on every query              | Relational context        |
| **Durable Objects** | `twin-orchestrator`, `hermes`, `workflow`, `folder-watcher`, `govern` (HITL)                      | `idFromName(tenant_id + suffix)`                  | Stateful compute          |
| **KV**              | `gateway`, `connector`, `continuity`, `act`, `intelligence`                                       | `tenant_id` in every key                          | Cache & registry          |
| **R2**              | `telemetry`, `knowledge`, `act` (exports), `normalizer` (DLQ)                                     | `tenant_id` in every object key                   | Blob & archive storage    |
| **Queues**          | `webhook-ingress`, `connector-sync`, `normalizer`, `pipeline`, `act`, `telemetry`                 | `tenant_id` in every message envelope             | Async messaging           |
| **Vectorize**       | `knowledge`, `continuity`, `intelligence`                                                         | `tenant_id` filter on every query                 | Semantic search           |
| **AI Search**       | `knowledge`, `intelligence`                                                                       | `tenant_id` in metadata filter                    | Hybrid keyword + semantic |

**Key Invariant:** No shared Durable Objects. No cross-tenant KV keys. No unqualified D1 queries. No queue messages without `tenant_id` in the envelope. Fail-loud on every violation.

### 12.3 Service Bindings Map

The Gateway exposes all 26 services via service bindings. Internal services MAY call each other directly via bindings (bypassing Gateway for performance), but MUST still carry `tenant_id`.

The full 26×26 matrix is maintained in `apps/gateway/src/bindings.ts`. Below are the **key bindings** that define the architecture's data flow:

| Caller              | Callee           | Binding          | Purpose                           |
| ------------------- | ---------------- | ---------------- | --------------------------------- |
| `gateway`           | `tenants`        | `TENANTS`        | JWT resolution, RBAC, plan limits |
| `gateway`           | `normalizer`     | `NORMALIZER`     | Inbound data normalization        |
| `gateway`           | `pipeline`       | `PIPELINE`       | Spine write (via queue)           |
| `webhook-ingress`   | `connector-sync` | `CONNECTOR_SYNC` | Webhook → sync job                |
| `connector-sync`    | `normalizer`     | `NORMALIZER`     | Raw records → canonical           |
| `normalizer`        | `pipeline`       | `PIPELINE`       | Canonical entities → Spine        |
| `pipeline`          | `intelligence`   | `INTELLIGENCE`   | Analytics, context assembly       |
| `pipeline`          | `knowledge`      | `KNOWLEDGE`      | RAG indexing, semantic search     |
| `pipeline`          | `continuity`     | `CONTINUITY`     | Memory consolidation, decay       |
| `twin-orchestrator` | `govern`         | `GOVERN`         | Confidence scoring, HITL          |
| `twin-orchestrator` | `intelligence`   | `INTELLIGENCE`   | Context assembly                  |
| `twin-orchestrator` | `knowledge`      | `KNOWLEDGE`      | RAG retrieval                     |
| `twin-orchestrator` | `think`          | `THINK`          | LLM reasoning                     |
| `govern`            | `act`            | `ACT`            | Approved actions → execution      |
| `govern`            | `workflow`       | `WORKFLOW`       | Durable orchestration             |
| `act`               | `pipeline`       | `PIPELINE`       | Execution writeback               |
| `hermes`            | `act`            | `ACT`            | Message queue → execution         |
| `hermes`            | `triage`         | `TRIAGE`         | Confidence routing, decay         |
| `workflow`          | `act`            | `ACT`            | Workflow step execution           |
| `workflow`          | `hermes`         | `HERMES`         | Message routing                   |
| `mcp-connector`     | `pipeline`       | `PIPELINE`       | MCP tool results → Spine          |
| `mcp-connector`     | `intelligence`   | `INTELLIGENCE`   | MCP context assembly              |
| `mcp-connector`     | `knowledge`      | `KNOWLEDGE`      | MCP RAG retrieval                 |
| `loader`            | `connector-sync` | `CONNECTOR_SYNC` | Cold-start, webhook trigger       |
| `continuity`        | `knowledge`      | `KNOWLEDGE`      | Knowledge base indexing           |
| `continuity`        | `telemetry`      | `TELEMETRY`      | Observability events              |

### 12.4 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CI/CD PIPELINE                                       │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Push to   │───►│   Lint &    │───►│   TypeCheck │───►│    Test     │   │
│  │   main/     │    │   Format    │    │   (tsc)     │    │   (vitest)  │   │
│  │   feature/* │    │   (eslint)  │    │             │    │             │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘   │
│                                                                   │          │
│                                                                   ▼          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  DEPLOY MATRIX (parallel, per service)                                  │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │ gateway │  │webhook- │  │ tenants │  │ connector│  │  ...    │      │  │
│  │  │         │  │ ingress │  │         │  │  sync   │  │         │      │  │
│  │  │wrangler │  │wrangler │  │wrangler │  │wrangler │  │wrangler │      │  │
│  │  │ deploy  │  │ deploy  │  │ deploy  │  │ deploy  │  │ deploy  │      │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │  │
│  │                                                                         │  │
│  │  Rollback: If any deploy fails, auto-rollback to previous version       │  │
│  │  Canary: 10% traffic → 50% → 100% over 15 minutes (gateway only)        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                   │          │
│                                                                   ▼          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  POST-DEPLOY VERIFICATION                                               │  │
│  │  • Health check: GET /health on every service                           │  │
│  │  • Discovery contract test: Verify /api/v1/discovery schema             │  │
│  │  • MCP smoke test: Connect, list tools, invoke ping                     │  │
│  │  • E2E: Connect Salesforce → sync → propose → approve (Customer-Zero)   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

The GitHub Actions workflow has three stages:

1. **Quality Gates:** `lint` (eslint), `typecheck` (tsc), `test` (vitest). All three run in parallel on every PR and push.
2. **Deploy Matrix:** One job per service, running `wrangler deploy` with the environment inferred from branch (`main` → production, else staging). `fail-fast: false` ensures one failed deploy does not cancel the others. Gateway deploys include a 15-minute canary (10% → 50% → 100%).
3. **Post-Deploy E2E:** A smoke test suite connects to a test tenant, runs a full sync → propose → approve happy path, and verifies discovery contract and MCP connectivity.

**Rollback:** Workers roll back via `wrangler deploy --rollback` or by redeploying the previous git SHA. D1 schema rollbacks use automated D1 backups plus manual migration reversal. KV and R2 are not versioned; they rely on TTL and lifecycle rules.

### 12.5 Local Development Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LOCAL DEV STACK                                      │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   pnpm      │    │  Wrangler   │    │  Miniflare  │    │  Local D1   │   │
│  │  workspace  │◄──►│   CLI       │◄──►│  (local     │◄──►│  (sqlite)   │   │
│  │             │    │  (dev)      │    │  Workers)   │    │             │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│         │                                                                  │
│         ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │  LOCAL SERVICES (all 26 stubs)                                         ││
│  │  $ pnpm dev  → starts Wrangler dev server for each service             ││
│  │  $ pnpm dev:gateway  → gateway only                                    ││
│  │  $ pnpm dev:all  → parallel dev (requires 16GB+ RAM)                   ││
│  └────────────────────────────────────────────────────────────────────────┘│
│         │                                                                  │
│         ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │  LOCAL MCP BRIDGE                                                      ││
│  │  scripts/integratewise-mcp-bridge.mjs                                  ││
│  │  stdio → SSE bridge for local Cursor/Claude testing                    ││
│  └────────────────────────────────────────────────────────────────────────┘│
│         │                                                                  │
│         ▼                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │  MOCK PROVIDERS                                                        ││
│  │  • Nango dev mode (localhost:3009)                                     ││
│  │  • Local Salesforce mock (msw handlers)                                ││
│  │  • Local Stripe webhook simulator                                      ││
│  └────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

The local stack uses a pnpm monorepo with Wrangler CLI for local Workers simulation. Each service gets its own port (`gateway` on 8787, `mcp-server` on 8788, `act` on 8790, etc.). D1 runs as a local SQLite file. KV and Queues run in-memory. The MCP bridge (`scripts/integratewise-mcp-bridge.mjs`) converts stdio to SSE so local AI assistants (Cursor, Claude Desktop) can test against the local stack without cloud deployment.

Key commands:

- `pnpm dev` — starts all services in parallel
- `pnpm dev:gateway` — gateway only, for frontend-only work
- `pnpm db:migrate` — applies D1 migrations locally
- `pnpm mcp:local` — starts the stdio→SSE bridge
- `pnpm test:e2e` — Playwright end-to-end against local stack

### 12.6 Per-App Deployment Subsets

Not all 26 services deploy together. The dependency graph and blast radius determine safe subsets.

| Subset         | Services                                           | Trigger              | Risk                           | Schema Change? |
| -------------- | -------------------------------------------------- | -------------------- | ------------------------------ | -------------- |
| **Hotfix**     | Single service                                     | Critical bug         | Low — no schema changes        | No             |
| **Frontend**   | `apps/web` + `apps/mcp-server`                     | UI release           | Low — no backend deps          | No             |
| **Spine**      | `pipeline` + `normalizer` + `spine-v2`             | Schema change        | Medium — D1 migration required | Yes            |
| **Capability** | `act` + `hermes` + `workflow`                      | New provider adapter | Medium — test outbound calls   | No             |
| **AI**         | `think` + `twin-orchestrator` + `iw-agent-runtime` | Model change         | Low — swappable adapter        | No             |
| **Full**       | All 26                                             | Major version        | High — full e2e required       | Maybe          |
| **Infra**      | D1 migrations + KV config + Vectorize              | Index change         | High — backup first            | Yes            |

**Verification per subset:**

- `hotfix`: health check + binding RPC ping + queue depth check
- `spine`: health + bindings + queue depth + D1 schema version + discovery contract + e2e happy path
- `full`: all checks + MCP smoke test + full Customer-Zero e2e

### 12.7 The 7 Missing Services (Stub Specs)

These seven services are listed in the 26-service topology but have minimal v2.0 specifications. They are reserved for future expansion and are currently implemented as thin stubs with health endpoints and service bindings.

| Service             | Tier   | Type               | Current Stub                                                                | Future Role                                                                                 |
| ------------------- | ------ | ------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `twin-orchestrator` | Tier 2 | Durable Object     | DO class with `reason` + `propose` actions; snapshots to D1 every 5 minutes | Persistent per-user OODA engine; multi-step reasoning chains; proactive proposal generation |
| `hermes`            | Tier 3 | Durable Object     | Message queue head/tail; 30s alarm batch processing                         | Full message broker with dead-letter handling, retry policies, and priority routing         |
| `triage`            | Tier 3 | Worker (in Hermes) | Confidence scoring stub; routes to Active/Staging/Discard                   | Memory triage automation; decay scheduling; reinforcement tracking                          |
| `iw-agent-runtime`  | Tier 3 | Worker             | MCP-compliant agent execution stub; health endpoint                         | Full agent runtime with tool use, multi-turn reasoning, and sandboxed execution             |
| `agent-registry`    | Tier 4 | Worker             | Catalog of agent names and capabilities; no runtime                         | Dynamic agent discovery, A2A protocol registry, agent capability negotiation                |
| `folder-watcher`    | Tier 4 | Durable Object     | File tree snapshot + checksum; 60s alarm                                    | Real-time filesystem sync; macOS chokidar → DO event stream; bulk import trigger            |
| `telemetry`         | Tier 4 | Worker             | Fire-and-forget queue consumer; writes to R2                                | Full observability: metrics, traces, logs, alerting, dashboards                             |

Each stub exposes `GET /health`, participates in service bindings, and queues messages with `tenant_id`. They are safe to deploy as no-ops and will be fleshed out in subsequent releases without breaking the topology.

---

## 13. Continuity Pipelines & Workers

The Continuity Layer is not a single service. It is a **system of pipelines** — eight asynchronous workers that move data from raw provider signals to canonical Spine entities, from transient memory to compounding knowledge, from reasoning proposals to governed actions. Each pipeline has a personality, a trigger, a stage sequence, and a defined output.

These workers run continuously. They do not sleep. They are the heartbeat of the platform.

### What Workers Do Every Day

**Morning Pre-Load (06:00 UTC):** `connector-sync` wakes up for every tenant with a daily sync schedule. It checks Nango for tokens that need refresh, queues creamy sync jobs for stale connectors, and warms the KV discovery cache so that when users open their dashboards, the data is already there. `continuity` runs the decay evaluator, checking which memories have crossed the 30-day threshold and should be demoted from Active to Staging.

**During Work (Real-Time):** `webhook-ingress` catches provider webhooks in milliseconds. `loader` verifies signatures and triggers incremental syncs. `normalizer` parses, detects traits, resolves entities, and enqueues canonical batches. `pipeline` writes to Spine — the only writer — and emits events that `intelligence` and `knowledge` consume for context assembly and RAG indexing. `twin-orchestrator` (the DO) reasons over Spine changes, proposes actions, and sends them to `govern` for confidence scoring.

**Evening Consolidation (18:00 UTC):** `continuity` compiles the day's memory into the Knowledge corpus. `knowledge` re-indexes documents and embeddings. `triage` reviews the day's staging memories and promotes high-confidence ones to Active. `govern` expires proposals in My Desk that have sat for 72 hours without review.

**Nightly Triage (02:00 UTC):** `telemetry` processes the day's observability blobs. `hermes` retries dead-letter messages. `folder-watcher` checksums watched folders and emits change events. `twin-orchestrator` snapshots all active DO states to D1 for disaster recovery.

---

### 13.1 Ingestion Pipeline

**What it does:** Catches everything from the outside world — webhooks, sync polls, file drops, MCP tool results — and turns it into a verified, deduplicated, tenant-scoped event.

**Trigger:** Provider webhook, cron sync schedule, manual sync button, Nango OAuth callback, MCP tool invocation, file system change.

**Stages:**

1. **Receive:** `webhook-ingress` accepts HTTP POST, validates signature, extracts provider ID.
2. **Deduplicate:** `loader` checks KV idempotency key; rejects duplicates.
3. **Classify:** `loader` classifies event type (`auth.created`, `webhook.received`, `nango.sync`).
4. **Route:** Enqueues to `CONNECTOR_SYNC_QUEUE` with `tenant_id`, `provider`, `syncType`, `since`.

**Output:** `SyncJob` messages on `CONNECTOR_SYNC_QUEUE`.

```
[Provider Webhook] ──► [webhook-ingress] ──► validate signature ──► [loader]
                                                                    │
                                                                    ▼
                                                            [deduplicate]
                                                                    │
                                                                    ▼
                                                            [classify event]
                                                                    │
                                                                    ▼
                                                    [CONNECTOR_SYNC_QUEUE]
```

### 13.2 Normalization Pipeline

**What it does:** Transforms raw provider records into canonical Spine entities. This is the only path from inbound data to the Spine. Every record that enters the Spine has been through all 8 stages.

**Trigger:** `NORMALIZER_QUEUE` consumer batch (max 50, timeout 10s).

**Stages:**

1. **NA0 — Parse:** JSON/CSV/XML → structured object.
2. **NA1 — Trait Detect:** Identify entity type from field heuristics.
3. **NA2 — Resolve Type:** Map to canonical entity type from Schema Provider.
4. **NA3 — Resolve Entity:** SSOC lookup or mint new stable UUID.
5. **NA4 — Link Relations:** Traverse foreign keys, infer relationships.
6. **NA5 — Enrich & Map:** Apply tenant-specific field mappings, enrich from Knowledge.
7. **NA6 — Validate:** Schema validation against Schema Provider contract.
8. **NA7 — Emit Canonical:** Serialize to `CanonicalEntityBatch`, enqueue to `PIPELINE_QUEUE`.

**Output:** `CanonicalEntityBatch` messages on `PIPELINE_QUEUE`.

```
[Raw Record] ──► NA0 ──► NA1 ──► NA2 ──► NA3 ──► NA4 ──► NA5 ──► NA6 ──► NA7
                 Parse   Trait   Resolve Resolve  Link   Enrich  Validate Emit
                         Detect  Type    Entity   Rels   & Map   Canonical
                                                                     │
                                                                     ▼
                                                          [PIPELINE_QUEUE]
```

### 13.3 Resolution Pipeline

**What it does:** Resolves conflicts between provider records and existing Spine entities. When Salesforce says a contact's email is `alice@acme.com` and HubSpot says `alice.smith@acme.com`, the Resolution Pipeline decides which one wins — or creates a merge proposal.

**Trigger:** `pipeline` detects a conflicting `sourceId` or `canonicalName` during write.

**Stages:**

1. **Detect:** `pipeline` flags a conflict in the `spine_audit_log`.
2. **Fetch:** `intelligence` queries both provider records and the existing SSOC entity.
3. **Score:** `intelligence` computes a confidence score for each source based on freshness, provider authority, and historical accuracy.
4. **Decide:** If confidence delta ≥ 0.20, auto-resolve to the higher-confidence source. If delta < 0.20, create a `merge_proposal` for HITL review.
5. **Write:** `pipeline` applies the resolution (or queues the proposal).

**Output:** Resolved entity update or `merge_proposal` in `action_proposals` table.

```
[Pipeline Conflict] ──► [intelligence] ──► fetch both sources ──► score confidence
                                                                  │
                                                                  ▼
                                                           [decide winner]
                                                                  │
                                                    ┌─────────────┼─────────────┐
                                                    │             │             │
                                                    ▼             ▼             ▼
                                              [auto-resolve]  [merge_proposal]  [tie]
                                                    │             │             │
                                                    ▼             ▼             ▼
                                              [pipeline write] [HITL review] [discard]
```

### 13.4 Timeline Pipeline

**What it does:** Builds the immutable timeline of every entity — when it was first seen, when it changed, who changed it, what the provider said, what the Twin proposed. This is the audit trail that powers Entity360.

**Trigger:** Every `pipeline` write to `entities` or `relationships`.

**Stages:**

1. **Capture:** `pipeline` writes the `spine_audit_log` entry with `previousRecord` and `record`.
2. **Enrich:** `intelligence` adds sentiment, health score, and relationship deltas.
3. **Index:** `knowledge` indexes significant timeline events (merges, status changes, governance decisions) into Vectorize for semantic retrieval.
4. **Emit:** `continuity` emits a `timeline_event` to the `TELEMETRY_QUEUE` for observability.

**Output:** `spine_audit_log` rows, Vectorize timeline index, telemetry events.

```
[Pipeline Write] ──► [spine_audit_log] ──► [intelligence enrich]
                                                    │
                                                    ▼
                                           [knowledge index]
                                                    │
                                                    ▼
                                           [continuity emit]
                                                    │
                                                    ▼
                                           [TELEMETRY_QUEUE]
```

### 13.5 Knowledge Pipeline

**What it does:** Transforms documents, SOPs, playbooks, andTwin-generated insights into searchable, semantic knowledge. This is the RAG layer that feeds Context Assembly.

**Trigger:** Document upload, sync-generated document, Twin insight with `twin_generated` source, nightly cron re-index.

**Stages:**

1. **Ingest:** Document stored in R2 (`R2_ASSETS`).
2. **Chunk:** `think` service applies semantic chunking (sentence boundaries for prose, header boundaries for SOPs, sliding window for code/markdown).
3. **Embed:** `think` generates 768-dimensional embeddings via OpenRouter (`gpt-5-mini` default).
4. **Index:** `knowledge` writes vectors to `VECTORIZE_KNOWLEDGE` with `tenant_id`, `scope`, `type`, `source` metadata.
5. **Retrieve:** During Context Assembly, `intelligence` queries Vectorize with hybrid keyword + semantic search.

**Output:** Vectorize index entries, R2 blob references, retrievable `KnowledgeChunk` arrays.

```
[Document Upload] ──► [R2_ASSETS] ──► [think chunk]
                                            │
                                            ▼
                                     [think embed]
                                            │
                                            ▼
                                     [VECTORIZE_KNOWLEDGE]
                                            │
                                            ▼
                                     [intelligence retrieve]
```

### 13.6 R2 Triage Pipeline

**What it does:** Manages the lifecycle of large objects in R2 — sync blobs, telemetry archives, DLQ dumps, and generated exports. It enforces retention policies, compresses cold data, and deletes expired objects.

**Trigger:** Nightly cron (02:00 UTC), or quota threshold breach.

**Stages:**

1. **Scan:** `folder-watcher` (or `continuity`) lists R2 prefixes by tenant and date.
2. **Classify:** Objects are classified by retention policy (`standard` 90 days, `extended` 1 year, `permanent` 7 years).
3. **Compress:** Objects older than 30 days are gzip-compressed in-place.
4. **Archive:** Objects past retention are moved to cold storage or deleted (with audit log).
5. **Report:** `telemetry` emits a `storage_audit` event with bytes reclaimed per tenant.

**Output:** Compressed R2 objects, deletion audit logs, storage quota reports.

```
[Nightly Cron] ──► [R2 scan] ──► [classify retention] ──► [compress old]
                                                              │
                                                              ▼
                                                       [archive / delete]
                                                              │
                                                              ▼
                                                       [TELEMETRY_QUEUE]
```

### 13.7 Projection Pipeline

**What it does:** Materializes the 8-lens projections (accounts, contacts, deals, tasks, tickets, content, knowledge, events) from Spine entities into fast-read views in `store` and `l2`. This is what the Workbench and MCP tool catalog surface to users.

**Trigger:** `pipeline` write to `entities` or `relationships`, or manual refresh.

**Stages:**

1. **Detect:** `pipeline` emits a `projection_update` event after Spine write.
2. **Map:** `l2` maps the canonical entity to the tenant's 8-lens projection schema (department × industry overlay).
3. **Render:** `store` materializes the projection view (e.g., "Accounts with Open Deals > $10k").
4. **Cache:** `store` writes the projection to KV with a 300-second TTL.
5. **Invalidate:** On next entity change, `pipeline` emits a cache invalidation.

**Output:** Materialized projection views in `store`, cached in KV, served via Discovery API.

```
[Pipeline Write] ──► [projection_update event] ──► [l2 map]
                                                         │
                                                         ▼
                                                  [store render]
                                                         │
                                                         ▼
                                                  [KV cache]
                                                         │
                                                         ▼
                                                  [Discovery API]
```

### 13.8 Continuity Orchestrator Pipeline

**What it does:** The master pipeline that coordinates memory decay, cross-scope promotion, nightly consolidation, and disaster recovery snapshots. It is the janitor, the librarian, and the backup operator of the platform.

**Trigger:** Cron schedule (hourly for decay, nightly for consolidation, weekly for snapshots).

**Stages:**

1. **Decay:** `continuity` scans Active memory for records with no access or reinforcement in 30 days. Demotes to Staging. Staging records with no access in 90 days are Archived to R2.
2. **Promote:** `triage` scans Staging memories with recent reinforcement or high query frequency. Promotes to Active with a new confidence score.
3. **Consolidate:** `continuity` merges duplicate memories, compiles personal insights into Organization knowledge (with governance approval if cross-scope), and updates the Continuity Graph.
4. **Snapshot:** `continuity` triggers D1 backup to R2 and DO state snapshots for all active tenants.

**Output:** Tier-migrated memory records, consolidated knowledge documents, R2 backups, DO snapshots.

```
[Hourly Cron] ──► [decay scan] ──► [demote to staging]
                                        │
                                        ▼
                                 [triage promote]
                                        │
                                        ▼
                                 [nightly consolidate]
                                        │
                                        ▼
                                 [weekly snapshot]
                                        │
                                        ▼
                                 [R2_BACKUP] + [DO_SNAPSHOT]
```

---

## 14. The One Invariant

The following invariant is the single immutable law of the IntegrateWise Continuity Bridge v2.0. It has been updated from v1.0.1 §12 to reflect the product layer, the Twin's ambient nature, and the ecosystem architecture.

> Identity gates the door. Discovery advertises the capabilities. The `act` and `connector` services are the only hands that touch outside tools (through their adapter modules). Spine is the only place context is written. Govern sits between reasoning and execution. Memory is scoped and compounds. Agents and tools coordinate through the Spine, never directly. Every hop carries `tenant_id`. The Twin is ambient, not separate. The ecosystem is a capability fabric. The moat is continuity.

This invariant is not aspirational. It is enforced by code:

- `pipeline` is the only service with `INSERT`/`UPDATE` privileges on `entities` and `relationships` (`db-gate` rejects all others).
- `act` and `connector` are the only services that hold provider credentials (`Credential Wall`).
- `govern` is the only service that can transition an `ActionProposal` to `approved`.
- Every service binding, queue message, D1 query, KV key, R2 object key, and DO ID includes `tenant_id`.
- No adapter module is bypassed. No direct provider calls from `intelligence`, `knowledge`, or `twin-orchestrator`.
- No peer-to-peer agent communication. All agent coordination routes through the Spine.
- The Twin is not a service you call. It is a reasoning quality that runs through `intelligence`, `continuity`, and `knowledge`.

Break this invariant and you break the architecture.

---

## 15. Glossary

| Term                    | Definition                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Adaptive Spine**      | The directed property graph of all canonical entities and relationships. The single source of context. Written only by `pipeline`.                                            |
| **ADK**                 | Agent Development Kit — the framework for building and deploying AI agents that connect to the IntegrateWise ecosystem via MCP.                                               |
| **A2A**                 | Agent-to-Agent — the protocol by which agents discover and communicate with each other through the Spine, never directly.                                                     |
| **Capability**          | A named, discoverable action that the platform can perform (e.g., `salesforce.opportunity.update`). Defined in the Capability Registry, gated by Governance.                  |
| **Capability Fabric**   | The ecosystem of tools, agents, and services that expose capabilities through a unified Discovery and Spine interface.                                                        |
| **Connector**           | The service that handles inbound provider connections — OAuth callbacks, webhook verification, and adapter selection.                                                         |
| **Context Assembly**    | The process of building Entity360 by combining Spine entities, Memory, Knowledge, and real-time provider state into a single context window.                                  |
| **Continuity Bridge**   | The public interface layer of the platform — identity, auth, discovery, projections, capabilities, governance entry, and events.                                              |
| **Continuity Engine**   | The internal substrate that preserves, compounds, and governs organizational context across time, tools, and agents.                                                          |
| **Credential Wall**     | The security boundary where per-tenant provider credentials are fetched from Cloudflare Secrets or Nango Vault and never exposed to services or logs.                         |
| **Discovery**           | The API endpoint (`/api/v1/discovery`) that advertises all capabilities, projections, and endpoints available to a tenant, filtered by RBAC.                                  |
| **Durable Object (DO)** | Cloudflare's stateful compute primitive with transactional storage and alarms. Used for `twin-orchestrator`, `hermes`, `workflow`, `folder-watcher`, and HITL.                |
| **Entity360**           | The assembled context for a single entity: its properties, relations, memory, timeline, sentiment, and health score.                                                          |
| **Entity Graph**        | The directed property graph of `entities` and `relationships` in the Adaptive Spine.                                                                                          |
| **Governance**          | The approval and confidence-scoring layer between reasoning and execution. Enforces the 0.70/0.85 law.                                                                        |
| **HITL**                | Human-in-the-Loop — the orchestration of human approval within automated workflows, implemented as a Durable Object per `tenant_id + user_id`.                                |
| **Integration Manager** | _Removed in v1.0.1._ The adapter pattern now lives inside `act` and `connector` services. Not a separate service.                                                             |
| **KSP**                 | Knowledge Sharing Protocol — the anonymized, cross-tenant mechanism for sharing capability patterns without exposing tenant data.                                             |
| **Lens**                | One of the 8 projection categories (Accounts, Contacts, Deals, Tasks, Tickets, Content, Knowledge, Events) that the Workbench surfaces to users.                              |
| **MCP**                 | Model Context Protocol — the standard by which AI assistants connect to the IntegrateWise platform (inbound) and by which the platform connects to provider tools (outbound). |
| **Memory**              | Compounding context scoped to Personal, Work, Organization, or AI tiers. Decays without reinforcement.                                                                        |
| **Memory Triage**       | The confidence-scoring and routing logic that promotes, stages, or discards memories based on the 0.70/0.85 thresholds.                                                       |
| **Moat**                | The competitive advantage derived from continuity — the compounding context that makes switching to another platform costly because the context would be lost.                |
| **Normalizer**          | The 8-stage pipeline (NA0–NA7) that transforms raw provider records into canonical Spine entities.                                                                            |
| **OODA**                | Observe → Orient → Decide → Act. The four-phase decision cycle that runs across the Capability, Continuity, and Governance layers.                                            |
| **Overlay**             | A tenant-specific or department-specific customization of the base schema, projection rendering, or governance rules without modifying the core platform.                     |
| **Pipeline**            | The asynchronous worker that is the **sole writer** to the Adaptive Spine. Enforces `tenant_id` on every write.                                                               |
| **Projection**          | A materialized view of Spine entities optimized for a specific lens or use case (e.g., "Open Deals by Stage").                                                                |
| **Provider Fabric**     | The swappable layer of external SaaS providers, APIs, and runtimes — accessed only through adapter modules inside `act` and `connector`.                                      |
| **RBAC**                | Role-Based Access Control — tenant-scoped roles (owner, tam, account_success) with permission grants on resources.                                                            |
| **Resolution**          | The process of resolving conflicting provider records into a single canonical entity or a merge proposal.                                                                     |
| **Service Binding**     | Cloudflare Workers RPC mechanism — one Worker calls another directly over the internal network, carrying `tenant_id` implicitly.                                              |
| **Spine**               | Short for Adaptive Spine. The single source of truth for entity context.                                                                                                      |
| **SSOC**                | Stable Source-Object Correlation — a stable UUID assigned to every entity that survives provider swaps.                                                                       |
| **Twin**                | The ambient AI reasoning engine that permeates Context Assembly, Memory, and Knowledge. Not a separate service; implemented as a Durable Object.                              |
| **Triage**              | The service that applies confidence scoring to both execution proposals (Governance Triage) and memory records (Memory Triage).                                               |
| **Workbench**           | The unified web interface (Next.js) where users interact with projections, capabilities, My Desk, and the Agent Registry.                                                     |
| **Workflow**            | The durable orchestration service (Durable Object) that manages long-running, multi-step processes with pause, resume, retry, and saga compensation.                          |

---

## 16. Changelog

| Version    | Date       | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Status      |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| **v2.0.0** | 2026-07-03 | Complete rewrite. Unified product narrative with technical architecture. Added 6-layer architecture (Identity → Ingress → Capability → Continuity → Governance → Provider Fabric). Added OODA runtime. Added product layer (Workbench, Workbench Agent, Agent Registry, Ecosystem). Added ecosystem architecture (KSP, A2A). Added memory triage and decay pipelines. Added 8 continuity pipelines with worker narratives. Added deployment architecture with Cloudflare primitives, service topology, CI/CD, local dev stack, and per-app deployment subsets. Added security decision log documenting all v1.0.1 → v2.0 transitions. Added UI specification (Workbench, My Desk, Discovery, Capability Catalog). Added 30-term glossary. Supersedes v1.0.1-FINAL. | **CURRENT** |
| **v1.0.1** | 2026-07-02 | Removed Integration Manager as separate service. Adapter pattern folded into `act` and `connector` services. No extra hop, no extra service. Locked.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Superseded  |
| **v1.0.0** | 2026-07-02 | Initial locked architecture. 26 services, 4 conceptual layers, MCP pools (inbound + outbound), 0.70/0.85 governance law, Credential Wall, 8-lens taxonomy, 5 SDK variants.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Superseded  |

---

**END OF DOCUMENT**

_IntegrateWise Continuity Bridge — Canonical Architecture Specification v2.0.0. The One Invariant is law. The adapter pattern is the Integration Manager. The Twin is ambient. The moat is continuity._
