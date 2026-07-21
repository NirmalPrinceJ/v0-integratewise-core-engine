# IntegrateWise Continuity Bridge — Canonical Architecture Specification v1.0.1-FINAL

**Status:** LOCKED — Integration Manager service removed; adapter pattern folded into `act` + `connector` services. Native builds and deployments are faster without an extra abstraction layer.  
**Date:** 2026-07-02  
**Version:** 1.0.1-FINAL  
**Supersedes:** v1.0.0-FINAL where it conflicts. All §14 conflicts remain locked.

---

## The Revision

The Integration Manager is **not a separate service**. It is a **pattern** implemented within the services that actually touch external providers. The 7× agnostic moat is achieved through adapter modules, not a separate orchestrator.

**Why:** Native builds and deployments work much faster. Adding an extra service hop (act → Integration Manager → provider) adds latency, increases blast radius, and complicates deployment. The adapter pattern inside `act` achieves the same swappability with zero extra infrastructure.

---

## 1. The Doctrine (Unchanged)

> **Context you own. AI you rent. Approval in between.**

The IntegrateWise Continuity Bridge is an OODA Engine for Business Continuity. It preserves organizational context, memory, governance, and execution across all tools, humans, and AI agents through one stable continuity contract.

**Product Name:** IW Continuity Bridge  
**Category:** The Operational Continuity Platform  
**Core Promise:** One JWT. One SSE connection. One Bridge. The Bridge connects to everything else.

---

## 2. The OODA Engine (Unchanged)

Every entity, tool, user, and AI agent operates on the same four-phase decision cycle:

```
OBSERVE ──► ORIENT ──► DECIDE ──► ACT ──► (memory compounds) ──► OBSERVE...
```

| Phase       | What                                                                 | Services                                                                                                      | Speed                               |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Observe** | Ingest signals from webhooks, sync polls, user actions, file changes | `webhook-ingress`, `connector-sync`, `folder-watcher`, `mcp-connector` (inbound)                              | ms (event) to min (poll)            |
| **Orient**  | Assemble Entity360 + Memory + Knowledge into context                 | `normalizer` (8-stage), `intelligence` (Context Assembly), `knowledge` (RAG), `continuity` (memory retrieval) | <2s normalizer p99, <10ms cache hit |
| **Decide**  | Twin reasons, proposes action, governance scores confidence          | `twin-orchestrator` (OODA engine), `govern` (confidence gate), `think` (LLM orchestration)                    | 1-2s simple, 5-10s complex          |
| **Act**     | Execute approved action, writeback to Spine, update memory           | `act` (execution + provider adapters), `workflow` (durable orchestration), `hermes` (message queue)           | 500ms-2s (external API)             |

---

## 3. The Four Layers (Conceptual Law — Unchanged)

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

## 4. The Two Planes (North / South — Revised)

```
Consumers → [API Gateway] → Spine (context) → [Act + Connector Services] → Provider Tools
             (North / Ingress)                        (South / Egress)
```

| Plane     | Direction            | Role                                                                                                                                                      | Physical Service                                                                                            |
| --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **North** | Consumers → Platform | AuthN/Z, tenant routing, rate-limit, capability routing, Discovery, inbound MCP                                                                           | `gateway` (single Worker)                                                                                   |
| **South** | Platform → Providers | **Adapter modules inside `act` and `connector` services** — Nango OAuth, MCP outbound, Native REST, credential fetch from Secrets/KV, Entity360 injection | `act` (execution + outbound adapters), `connector` (OAuth callbacks), `connector-sync` (sync orchestration) |

**Rule:** Neither plane talks to the other except through the Spine. The Gateway and the `act` + `connector` services are the only two doors — one in, one out.

**The Integration Manager is NOT a separate service.** It is the adapter pattern implemented inside `act` (for outbound execution) and `connector`/`connector-sync` (for inbound sync and OAuth). This is faster, simpler, and achieves the same swappability.

---

## 5. The Adapter Pattern (Replaces Integration Manager)

The 7× agnostic moat is achieved through **adapter modules** inside the services that need them, not a separate orchestration service.

### 5.1 Outbound Adapter Modules (Inside `act` Service)

```
services/act/
├── src/
│   ├── index.ts                 # Entry point — handles ACT_QUEUE
│   ├── execute.ts               # Main execution logic
│   ├── adapters/                # Outbound provider adapters
│   │   ├── nango.ts             # Nango OAuth adapter (Salesforce, HubSpot, etc.)
│   │   ├── mcp-outbound.ts      # MCP outbound adapter (calls provider MCP servers)
│   │   ├── native.ts            # Native REST adapter (direct HTTP calls)
│   │   ├── credentials.ts       # Credential wall — fetches from CF Secrets/KV
│   │   └── context-inject.ts    # Entity360 injection before outbound call
│   └── types.ts
├── wrangler.toml
└── package.json
```

**Execution flow inside `act`:**

```typescript
// services/act/src/execute.ts

export async function executeCapability(
  capability: string, // e.g., "salesforce.opportunity.update"
  tenantId: string,
  payload: any
): Promise<ExecutionResult> {
  // 1. Resolve provider from capability path
  const [provider, resource, operation] = capability.split(".");

  // 2. Fetch tenant credentials (credential wall)
  const credentials = await getCredentials(provider, tenantId);
  //    → reads from Cloudflare Secrets or KV, never hardcoded

  // 3. Fetch Entity360 context for injection
  const context = await getEntity360(tenantId, payload.entity_id);

  // 4. Select adapter based on provider config
  const adapter = selectAdapter(provider, credentials);
  //    → Nango adapter for OAuth-mature providers
  //    → MCP adapter for AI-native providers
  //    → Native adapter for direct REST

  // 5. Inject context and execute
  const enrichedPayload = injectContext(payload, context);
  const result = await adapter.execute(resource, operation, enrichedPayload, credentials);

  // 6. Writeback to Spine (through Pipeline, not direct D1 write)
  await enqueueToPipelineQueue({
    type: "execution_result",
    tenantId,
    capability,
    result,
    timestamp: Date.now(),
  });

  return result;
}

// Adapter selection — no separate Integration Manager service
function selectAdapter(provider: string, credentials: Credentials): Adapter {
  if (credentials.type === "nango") return new NangoAdapter();
  if (credentials.type === "mcp") return new MCPOutboundAdapter();
  if (credentials.type === "native") return new NativeAdapter();
  throw new Error(`Unknown adapter type: ${credentials.type}`);
}
```

**Why this is better than a separate Integration Manager:**

- **Zero extra hop:** `act` → adapter → provider. No `act` → Integration Manager → adapter → provider.
- **Faster deploy:** `act` deploys as one Worker. No coordinating deploys between `act` and Integration Manager.
- **Smaller blast radius:** If Salesforce adapter breaks, only `act` service is affected. Not a shared Integration Manager that takes down all outbound calls.
- **Same swappability:** Adapter interface is the contract. Swap Nango for direct OAuth by changing the adapter implementation. No external orchestrator needed.

### 5.2 Inbound Adapter Modules (Inside `connector` + `connector-sync`)

```
services/connector/
├── src/
│   ├── index.ts                 # OAuth callback handler
│   ├── nango.ts                 # Nango session creation
│   └── adapters/                # Provider-specific auth handling
│       ├── salesforce.ts
│       ├── hubspot.ts
│       └── slack.ts

services/connector-sync/
├── src/
│   ├── index.ts                 # Sync orchestration
│   ├── sync.ts                  # Main sync loop
│   └── adapters/                # Provider-specific sync logic
│       ├── salesforce-sync.ts
│       ├── hubspot-sync.ts
│       └── slack-sync.ts
```

**Sync flow inside `connector-sync`:**

```typescript
// services/connector-sync/src/sync.ts

export async function runSync(connectorId: string, tenantId: string): Promise<SyncResult> {
  // 1. Fetch connector config
  const config = await getConnectorConfig(connectorId, tenantId);

  // 2. Get credentials (from Nango vault or CF Secrets)
  const credentials = await getCredentials(config.provider, tenantId);

  // 3. Select sync adapter
  const adapter = selectSyncAdapter(config.provider);
  //    → SalesforceSyncAdapter, HubSpotSyncAdapter, etc.

  // 4. Fetch raw records from provider
  const rawRecords = await adapter.fetch(credentials, config.lastSyncTime);

  // 5. Enqueue to Normalizer (not direct Pipeline write)
  await enqueueToNormalizerQueue({
    tenantId,
    provider: config.provider,
    records: rawRecords,
    timestamp: Date.now(),
  });

  return { recordsFetched: rawRecords.length };
}
```

### 5.3 The Adapter Interface (The Contract)

```typescript
// packages/connectors/src/types.ts (shared adapter contract)

export interface OutboundAdapter {
  execute(
    resource: string,
    operation: string,
    payload: any,
    credentials: Credentials
  ): Promise<ExecutionResult>;
}

export interface InboundSyncAdapter {
  fetch(credentials: Credentials, since: Date): Promise<RawRecord[]>;
}

export interface Credentials {
  type: "nango" | "mcp" | "native";
  tenantId: string;
  // Provider-specific fields
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  // Nango-specific
  connectionId?: string;
  // MCP-specific
  serverUrl?: string;
}

// Adapter registry (simple map, not a separate service)
export const outboundAdapters: Record<string, new () => OutboundAdapter> = {
  salesforce: NangoAdapter,
  hubspot: NangoAdapter,
  slack: NangoAdapter,
  github: MCPOutboundAdapter,
  linear: MCPOutboundAdapter,
  stripe: NativeAdapter,
  custom: NativeAdapter,
};

export const syncAdapters: Record<string, new () => InboundSyncAdapter> = {
  salesforce: SalesforceSyncAdapter,
  hubspot: HubSpotSyncAdapter,
  slack: SlackSyncAdapter,
  // ...
};
```

### 5.4 Swappability Without a Separate Service

The 7× agnostic moat is achieved through:

| Dimension               | Adapter Module                                        | Location                                | Swap Method                                                  |
| ----------------------- | ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| **Storage**             | `db-adapter.ts`                                       | `packages/lib/`                         | Change `db-gate.ts` to use D1, Supabase, Neon, or HyperDrive |
| **Auth**                | `auth-adapter.ts`                                     | `packages/lib/`                         | Change `auth.ts` to issue JWT, Clerk, or Stack tokens        |
| **AI Model**            | `openrouter.ts`                                       | `packages/lib/`                         | Change model config in `think` service                       |
| **Provider (Outbound)** | `NangoAdapter`, `MCPOutboundAdapter`, `NativeAdapter` | `services/act/src/adapters/`            | Change adapter registration in `outboundAdapters` map        |
| **Provider (Inbound)**  | `SalesforceSyncAdapter`, `HubSpotSyncAdapter`, etc.   | `services/connector-sync/src/adapters/` | Change adapter registration in `syncAdapters` map            |
| **Queue**               | `queue-adapter.ts`                                    | `packages/lib/`                         | Change from Cloudflare Queues to SQS or Kafka                |
| **Cache**               | `cache-adapter.ts`                                    | `packages/lib/`                         | Change from KV to Redis or Upstash                           |
| **Deployment**          | `wrangler.toml`                                       | Per service                             | Change from Workers to Lambda or Vercel                      |

**No separate Integration Manager service needed.** The adapter pattern inside the services that actually need it is faster, simpler, and more deployable.

---

## 6. The 26 Services (Physical Topology — Revised)

All services run on every deployment and serve all tenants. Customer-Zero is a tenant class, not a separate service. All 26 are wired into the Gateway as Cloudflare service bindings.

### Tier 0 — Ingress & Routing

| Service           | Worker Name             | Purpose                                                          | Binding           |
| ----------------- | ----------------------- | ---------------------------------------------------------------- | ----------------- |
| `gateway`         | `integratewise-gateway` | Single entry; JWT validation; tenant routing; rate-limit         | N/A               |
| `webhook-ingress` | `iw-webhook-ingress`    | Receives external webhooks (Salesforce, HubSpot, Stripe, GitHub) | `WEBHOOK_INGRESS` |

### Tier 1 — Tenant & Sync

| Service          | Worker Name         | Purpose                                                                                                                     | Binding          |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `tenants`        | `iw-tenants`        | Multi-tenant context, RBAC, plan limits                                                                                     | `TENANTS`        |
| `connector`      | `iw-connector`      | OAuth callback handler; Nango session creation; **inbound adapter pattern**                                                 | `CONNECTOR`      |
| `connector-sync` | `iw-connector-sync` | Orchestrates sync; **inbound sync adapters**                                                                                | `CONNECTOR_SYNC` |
| `normalizer`     | `iw-normalizer`     | 8-stage pipeline: parse → trait-detect → resolve-type → resolve-entity → link-rels → enrich-map → validate → emit-canonical | `NORMALIZER`     |
| `loader`         | `iw-loader`         | Cold-start pre-loader; Nango webhook handler; triggers immediate "creamy" sync                                              | `LOADER`         |

### Tier 2 — Projection & Rendering

| Service             | Worker Name            | Purpose                                                                                      | Binding             |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| `pipeline`          | `iw-pipeline`          | **Only writer to the Spine**; commits to D1; writes audit log                                | `PIPELINE`          |
| `twin-orchestrator` | `iw-twin-orchestrator` | Persistent per-user OODA engine (Durable Object)                                             | `TWIN_ORCHESTRATOR` |
| `l2`                | `iw-l2`                | Department × industry overlay projections (8 lenses)                                         | `L2`                |
| `intelligence`      | `iw-intelligence`      | Analytics, insights, signal generation, Context Assembly                                     | `INTELLIGENCE`      |
| `knowledge`         | `iw-knowledge`         | Knowledge base, docs, semantic search (RAG)                                                  | `KNOWLEDGE`         |
| `govern`            | `iw-govern`            | Governance rules engine; approval gates; HITL thresholds                                     | `GOVERN`            |
| `store`             | `iw-store`             | Persistence for projections (accounts, deals, tasks)                                         | `STORE`             |
| `act`               | `iw-act`               | Action execution; **outbound adapter modules** (Nango, MCP, Native); write-back to providers | `ACT`               |
| `spine-v2`          | `iw-spine-v2`          | Spine normalization & graph services                                                         | `SPINE_V2`          |

### Tier 3 — Capability Runtime & Orchestration

| Service            | Worker Name        | Purpose                                                       | Binding            |
| ------------------ | ------------------ | ------------------------------------------------------------- | ------------------ |
| `hermes`           | `iw-hermes`        | Message queue + execution engine (Durable Object)             | `HERMES`           |
| `triage`           | `iw-triage`        | Confidence routing + active-memory decay (runs inside Hermes) | `TRIAGE`           |
| `workflow`         | `iw-workflow`      | Durable orchestration; pause; retry; saga                     | `WORKFLOW`         |
| `iw-agent-runtime` | `iw-agent-runtime` | MCP-compliant AI agent execution                              | `IW_AGENT_RUNTIME` |
| `mcp-connector`    | `iw-mcp-connector` | Inbound MCP bridge; external agents → scoped Spine/Memory     | `MCP_CONNECTOR`    |

### Tier 4 — Supporting

| Service          | Worker Name         | Purpose                                                 | Binding          |
| ---------------- | ------------------- | ------------------------------------------------------- | ---------------- |
| `agent-registry` | `iw-agent-registry` | Catalog of available agents/integrations                | `AGENT_REGISTRY` |
| `billing`        | `iw-billing`        | Usage tracking + plan enforcement                       | `BILLING`        |
| `admin`          | `iw-admin`          | Platform admin; tenant management; overrides            | `ADMIN`          |
| `folder-watcher` | `iw-folder-watcher` | Durable Object filesystem watcher (macOS chokidar → DO) | `FOLDER_WATCHER` |
| `continuity`     | `iw-continuity`     | Memory consolidation + decay (the continuity substrate) | `CONTINUITY`     |
| `telemetry`      | `iw-telemetry`      | Traces, metrics, observability                          | `TELEMETRY`      |
| `think`          | `iw-think`          | LLM reasoning orchestration (OpenRouter abstraction)    | `THINK`          |

---

## 7. The 0–16 Stack (Physical Implementation — Revised)

The 4-layer law is conceptual (trust boundaries). The 0–16 stack is physical (implementation). Both hold simultaneously.

| #   | Layer                       | Physical Services                                                  | Data / Storage                                                                        |
| --- | --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 0   | **Tenant Lifecycle**        | `tenants`, `loader`, `admin`                                       | D1 `tenants`, `tenant_spine_config`                                                   |
| 1   | **Customer Ecosystem**      | `connector`, `connector-sync`, `agent-registry`                    | Nango vault, `connectors` table, **inbound adapter modules**                          |
| 2   | **Surface Layer**           | `apps/web`, `apps/mcp-server`                                      | Cloudflare Pages, R2 assets                                                           |
| 3   | **Gateway Layer**           | `gateway`                                                          | N/A — pure routing                                                                    |
| 4   | **Identity & Organization** | `tenants` (RBAC)                                                   | D1 `rbac_roles`, `rbac_permissions`                                                   |
| 5   | **Continuity Bridge**       | `connector-sync`, `normalizer`, `mcp-connector`, `webhook-ingress` | D1 `sync_jobs`, `normalizer_state`, KV Discovery cache                                |
| 6   | **Adaptive Spine**          | `pipeline`                                                         | D1 `entities`, `relationships`, `spine_audit_log`                                     |
| 7   | **Context Assembly**        | `intelligence`, `knowledge`                                        | Vectorize, AI Search, KV context cache                                                |
| 8   | **Shared Memory**           | `continuity`, `triage`                                             | D1 `memory` (active/staging/archived), KV decay                                       |
| 9   | **Capability Engine**       | `iw-agent-runtime`, `think`                                        | OpenRouter API, KV model config                                                       |
| 10  | **Governance Layer**        | `govern`                                                           | D1 `governance_audit_log`, `action_proposals`                                         |
| 11  | **Capability Runtime**      | `hermes`, `workflow`, `act`, `mcp-connector`                       | Durable Objects, Queues (`ACT_QUEUE`, `PIPELINE_QUEUE`), **outbound adapter modules** |
| 12  | **Projection Registry**     | `l2`, `store`                                                      | D1 `projections`, `projection_registry`                                               |
| 13  | **Registry Layer**          | `agent-registry`, `intelligence`                                   | D1 `capability_registry`, `endpoint_registry`, KV cache                               |
| 14  | **Continuity Engine**       | `continuity`, `twin-orchestrator`                                  | D1 `continuity_graph`, KV session handoffs                                            |
| 15  | **Data & Infrastructure**   | `telemetry`, `folder-watcher`                                      | D1 `audit_logs`, R2 telemetry, Workers Analytics                                      |
| 16  | **Endpoint Registry**       | `gateway` (serves), `intelligence` (updates)                       | KV + D1 `endpoint_registry` (living API contract)                                     |

**Cross-cutting:** Security (WAF, DDoS, TLS, CF Secrets, Zero Trust), Observability, Reliability (idempotency, retries, DLQ, backpressure), Compliance (audit & lineage, retention, encryption, tenant isolation).

---

## 8. MCP Pool Architecture (Unchanged)

### 8.1 Inbound MCP Pool (North Plane)

**Endpoint:** `mcp.integratewise.ai/v1/mcp` (SSE/stdio)  
**Role:** AI assistants (ChatGPT, Claude, Perplexity, Cursor) connect to us to read scoped Spine/Memory context.  
**Primary ingress:** This is the primary front door. Traditional SaaS webhooks are secondary.

**Security gates (P0):**

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

### 8.2 Outbound MCP Pool (South Plane — Inside `act` Service)

Inside `act` service, not a separate Integration Manager. The `act` service's `MCPOutboundAdapter` module connects to provider MCP servers (Salesforce MCP, Slack MCP, GitHub MCP) using MCP as the transport.

**Entity360 context injected before every outbound call.** Credential wall fetches per-tenant keys from Cloudflare Secrets/KV. No shared tokens across tenants.

---

## 9. Governance & Approval Gate (The 0.70/0.85 Law — Unchanged)

Two triage gates run on the same confidence thresholds:

### 9.1 Governance Triage (Execution Gate)

| Confidence  | Action           | Destination                        | Human Touch                |
| ----------- | ---------------- | ---------------------------------- | -------------------------- |
| ≥ 0.85      | Auto-approve     | `ACT_QUEUE`                        | None                       |
| 0.70 – 0.85 | Queue for review | My Desk                            | Approve / Modify / Dismiss |
| < 0.70      | Discard          | `spine_audit_log` (discard reason) | None                       |

### 9.2 Memory Triage (Knowledge Gate)

| Confidence  | Action       | Destination                         |
| ----------- | ------------ | ----------------------------------- |
| ≥ 0.85      | Auto-promote | Active memory (D1 + KV + Vectorize) |
| 0.70 – 0.85 | Staging      | Staging memory (D1 only)            |
| < 0.70      | Discard      | R2 cold storage (compliance/audit)  |

---

## 10. The Swappable Layers (7× Agnostic Moat — Revised)

The swappability is achieved through **adapter modules**, not a separate Integration Manager service.

| Dimension               | Adapter Module                                        | Location                                | Swap Method                                                             |
| ----------------------- | ----------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| **Frontend**            | UI framework                                          | `apps/web/`                             | Vite → Next.js → Electron by replacing framework                        |
| **Auth**                | `auth-adapter.ts`                                     | `packages/lib/`                         | JWT → Clerk → Stack by changing `verify()` implementation               |
| **Relational Store**    | `db-adapter.ts`                                       | `packages/lib/`                         | D1 → Supabase → Neon by changing `query()` implementation               |
| **Cache**               | `cache-adapter.ts`                                    | `packages/lib/`                         | KV → Redis → Upstash by changing `get()`/`set()` implementation         |
| **Queue**               | `queue-adapter.ts`                                    | `packages/lib/`                         | Queues → SQS → Kafka by changing `enqueue()`/`dequeue()` implementation |
| **AI / Model**          | `openrouter.ts`                                       | `packages/lib/`                         | gpt-5-mini → Claude → Grok by changing model config                     |
| **Provider (Outbound)** | `NangoAdapter`, `MCPOutboundAdapter`, `NativeAdapter` | `services/act/src/adapters/`            | Change adapter registration in `outboundAdapters` map                   |
| **Provider (Inbound)**  | `SalesforceSyncAdapter`, `HubSpotSyncAdapter`, etc.   | `services/connector-sync/src/adapters/` | Change adapter registration in `syncAdapters` map                       |
| **Deployment**          | `wrangler.toml`                                       | Per service                             | Workers → Lambda → Vercel by changing deploy target                     |

**The adapter interface is the contract.** The implementation is swappable. No separate orchestrator needed.

---

## 11. Security Posture (P0 & P1 — Unchanged)

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

## 12. The One Invariant (Unchanged)

> Identity gates the door. Discovery advertises the capabilities. The `act` and `connector` services are the only hands that touch outside tools (through their adapter modules). Spine is the only place context is written. Govern sits between reasoning and execution. Memory is scoped and compounds. Agents and tools coordinate through the Spine, never directly. Every hop carries `tenant_id`.

---

## 13. Resolution of All Conflicts (Unchanged from v1.0.0)

All §14 conflicts from v1.0.0-FINAL remain locked. The only change in v1.0.1 is the removal of the Integration Manager as a separate service and the formalization of the adapter pattern inside `act` + `connector` + `connector-sync`.

---

**END OF DOCUMENT**

_IntegrateWise Continuity Bridge — Canonical Architecture Specification v1.0.1-FINAL. The Integration Manager is not a separate service. It is the adapter pattern inside the services that actually touch providers. Native builds and deployments are faster this way._
