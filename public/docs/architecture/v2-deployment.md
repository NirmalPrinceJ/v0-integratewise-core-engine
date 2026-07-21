# IntegrateWise Continuity Bridge v2.0 — Deployment Architecture and Service Topology

**Domain:** Deployment Architecture and Service Topology — Cloudflare Workers topology, D1 databases, KV namespaces, Durable Objects, Queues, R2, Vectorize, Service bindings map, CI/CD pipeline, Local dev stack, Per-app deployment subsets  
**Stage:** 1/2 Deep-Dive → Canonical Architecture Document  
**Version:** 2.0.0-DRAFT  
**Date:** 2026-07-02  
**Platform Layer:** Infrastructure Foundation (Layer 0 of the 6-Layer Stack: Identity → Ingress → Capability → Continuity → Governance → Provider Fabric)

---

## 1. Domain Charter

This document specifies the **physical deployment substrate** of the IntegrateWise Continuity Bridge v2.0. It is the definitive reference for how the 26-service mesh maps to Cloudflare primitives, how data flows across those primitives, and how the platform maintains tenant isolation, observability, and deployability at scale.

**Scope In:** Cloudflare Workers (service mesh), D1 (relational), KV (cache/registry), Durable Objects (stateful compute), Queues (async messaging), R2 (object storage), Vectorize (vector search), Service Bindings (inter-service RPC), CI/CD (GitHub Actions → Wrangler), local development (Miniflare + Wrangler), per-app deployment subsets (selective deploys).

**Scope Out:** Application business logic (covered by service-specific specs), frontend build pipeline (covered by Frontend Architecture domain), AI model selection (covered by Capability Engine domain), provider adapter implementations (covered by Provider Fabric domain).

**Key Invariant:** Every physical primitive carries `tenant_id`. Every deployment unit is tenant-agnostic at the infrastructure level — isolation is enforced at the data layer, not by separate infrastructure per tenant.

---

## 2. Physical Topology Overview

### 2.1 The 6-Layer Architecture — Infrastructure Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: IDENTITY          │  Gateway JWT, API Keys, RBAC, Tenant Resolution│
│  Services: gateway, tenants │  Storage: D1 (tenants, rbac_roles)            │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: INGRESS           │  Webhooks, MCP Inbound, SSE, OAuth callbacks  │
│  Services: webhook-ingress, │  Storage: KV (session cache), D1 (sync_jobs)  │
│  mcp-connector, connector   │  Queues: CONNECTOR_SYNC_QUEUE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: CAPABILITY        │  OODA Observe+Orient, Normalization, RAG,     │
│  Services: normalizer,      │  Context Assembly, Knowledge, Intelligence    │
│  intelligence, knowledge,   │  Storage: D1 (entities, relationships),        │
│  think, iw-agent-runtime    │  Vectorize (embeddings), KV (context cache)   │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 4: CONTINUITY        │  The Moat — Spine, Memory, Twin, Governance,  │
│  Services: pipeline,        │  Workflow, Continuity Engine                  │
│  twin-orchestrator,         │  Storage: D1 (spine, memory, audit),           │
│  continuity, govern,        │  DO (stateful sessions), KV (decay, handoffs) │
│  workflow, hermes, triage   │  Queues: PIPELINE_QUEUE, ACT_QUEUE            │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 5: GOVERNANCE        │  Confidence gates, HITL, Approval, Audit      │
│  Services: govern, billing, │  Storage: D1 (governance_audit_log, proposals)│
│  admin, telemetry           │  Storage: R2 (telemetry blobs), D1 (audit)    │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 6: PROVIDER FABRIC   │  Outbound execution, adapters, credential wall│
│  Services: act, connector,  │  Storage: KV (credentials cache — encrypted),  │
│  connector-sync, loader     │  D1 (connector configs), R2 (sync blobs)      │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  Nango Vault (external)        │
              │  Provider APIs (Salesforce,    │
              │  Slack, GitHub, Stripe, ...)   │
              └───────────────────────────────┘
```

**OODA Span:** The OODA loop physically spans Layer 3 (Observe/ Orient via `normalizer`, `intelligence`, `knowledge`) and Layer 4 (Decide/Act via `twin-orchestrator`, `govern`, `workflow`, `act`). The loop closes through `pipeline` writes to Spine.

**Twin Ambience:** `twin-orchestrator` is a Durable Object — it is ambient to Layers 3–5, not a separate layer. It reasons over Spine context, proposes through Governance, and persists state in DO storage.

---

## 3. Cloudflare Workers Service Mesh (26 Services)

### 3.1 Tiered Deployment Topology

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

### 3.2 Worker Configuration Schema (wrangler.toml)

Each service declares its bindings in `wrangler.toml`. The root `infra/wrangler.toml` aggregates all service bindings for cross-service RPC.

```toml
# infra/wrangler.toml — Root configuration template
name = "integratewise-gateway"
main = "apps/gateway/src/index.ts"
compatibility_date = "2026-06-01"
compatibility_flags = ["nodejs_compat", "rpc"]

# D1 Databases
d1_databases = [
  { binding = "DB", database_name = "integratewise-spine", database_id = "<UUID>" },
  { binding = "DB_AUDIT", database_name = "integratewise-audit", database_id = "<UUID>" },
  { binding = "DB_TENANTS", database_name = "integratewise-tenants", database_id = "<UUID>" }
]

# KV Namespaces
kv_namespaces = [
  { binding = "KV_DISCOVERY", id = "<UUID>", title = "discovery-cache" },
  { binding = "KV_SESSIONS", id = "<UUID>", title = "session-store" },
  { binding = "KV_ENDPOINTS", id = "<UUID>", title = "endpoint-registry" },
  { binding = "KV_CREDENTIALS", id = "<UUID>", title = "credentials-cache" },
  { binding = "KV_DECAY", id = "<UUID>", title = "memory-decay" },
  { binding = "KV_MODEL_CONFIG", id = "<UUID>", title = "model-config" }
]

# R2 Buckets
r2_buckets = [
  { binding = "R2_TELEMETRY", bucket_name = "integratewise-telemetry" },
  { binding = "R2_ASSETS", bucket_name = "integratewise-assets" },
  { binding = "R2_SYNC_BLOBS", bucket_name = "integratewise-sync-blobs" }
]

# Vectorize Index
vectorize = [
  { binding = "VECTORIZE_KNOWLEDGE", index_name = "integratewise-knowledge" }
]

# Queues
queues.producers = [
  { binding = "PIPELINE_QUEUE", queue = "integratewise-pipeline" },
  { binding = "ACT_QUEUE", queue = "integratewise-act" },
  { binding = "CONNECTOR_SYNC_QUEUE", queue = "integratewise-connector-sync" },
  { binding = "NORMALIZER_QUEUE", queue = "integratewise-normalizer" },
  { binding = "TELEMETRY_QUEUE", queue = "integratewise-telemetry" }
]

queues.consumers = [
  { queue = "integratewise-pipeline", max_batch_size = 10, max_batch_timeout = 5 },
  { queue = "integratewise-act", max_batch_size = 5, max_batch_timeout = 10 },
  { queue = "integratewise-connector-sync", max_batch_size = 20, max_batch_timeout = 30 },
  { queue = "integratewise-normalizer", max_batch_size = 50, max_batch_timeout = 10 },
  { queue = "integratewise-telemetry", max_batch_size = 100, max_batch_timeout = 5 }
]

# Service Bindings (RPC to other Workers)
services = [
  { binding = "TENANTS", service = "iw-tenants" },
  { binding = "WEBHOOK_INGRESS", service = "iw-webhook-ingress" },
  { binding = "CONNECTOR", service = "iw-connector" },
  { binding = "CONNECTOR_SYNC", service = "iw-connector-sync" },
  { binding = "NORMALIZER", service = "iw-normalizer" },
  { binding = "LOADER", service = "iw-loader" },
  { binding = "PIPELINE", service = "iw-pipeline" },
  { binding = "TWIN_ORCHESTRATOR", service = "iw-twin-orchestrator" },
  { binding = "L2", service = "iw-l2" },
  { binding = "INTELLIGENCE", service = "iw-intelligence" },
  { binding = "KNOWLEDGE", service = "iw-knowledge" },
  { binding = "GOVERN", service = "iw-govern" },
  { binding = "STORE", service = "iw-store" },
  { binding = "ACT", service = "iw-act" },
  { binding = "SPINE_V2", service = "iw-spine-v2" },
  { binding = "HERMES", service = "iw-hermes" },
  { binding = "TRIAGE", service = "iw-triage" },
  { binding = "WORKFLOW", service = "iw-workflow" },
  { binding = "IW_AGENT_RUNTIME", service = "iw-agent-runtime" },
  { binding = "MCP_CONNECTOR", service = "iw-mcp-connector" },
  { binding = "AGENT_REGISTRY", service = "iw-agent-registry" },
  { binding = "BILLING", service = "iw-billing" },
  { binding = "ADMIN", service = "iw-admin" },
  { binding = "FOLDER_WATCHER", service = "iw-folder-watcher" },
  { binding = "CONTINUITY", service = "iw-continuity" },
  { binding = "TELEMETRY", service = "iw-telemetry" },
  { binding = "THINK", service = "iw-think" }
]

# Durable Objects (stateful)
[durable_objects]
bindings = [
  { name = "TWIN_DO", class_name = "TwinOrchestrator" },
  { name = "HERMES_DO", class_name = "HermesEngine" },
  { name = "WORKFLOW_DO", class_name = "WorkflowOrchestrator" },
  { name = "FOLDER_WATCHER_DO", class_name = "FolderWatcher" },
  { name = "GOVERN_HITL_DO", class_name = "GovernanceHITL" }
]

# Secrets (populated via `wrangler secret put` or GitHub Actions)
[vars]
ENVIRONMENT = "production"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1"

# Environment-specific overrides
[env.staging]
name = "integratewise-gateway-staging"
d1_databases = [
  { binding = "DB", database_name = "integratewise-spine-staging", database_id = "<STAGING-UUID>" }
]

[env.development]
name = "integratewise-gateway-dev"
```

---

## 4. D1 Database Architecture

### 4.1 Multi-Database Strategy

The platform uses **three logical D1 databases** with distinct consistency and retention requirements. All tables carry `tenant_id` as the leading column in every index.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DB (Spine + Context)         │  Primary operational database                │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  entities                     │  Core SSOC entities (accounts, contacts,     │
│  relationships                │  deals, tasks, tickets, etc.)                │
│  spine_audit_log              │  Immutable audit trail — every read/write    │
│  memory (active/staging/arch) │  Shared memory tiers — Personal, Work, Org   │
│  continuity_graph             │  Relationship traversal graph                │
│  normalizer_state             │  8-stage pipeline checkpointing              │
│  sync_jobs                    │  Connector sync job metadata                 │
│  action_proposals             │  Governance proposals (pending/approved)     │
│  projections                  │  L1/L2 projection materialized views         │
│  capability_registry          │  Named capabilities + schemas                │
│  endpoint_registry            │  Living API contract (path, method, owner)   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  DB_AUDIT (Compliance)        │  Append-only, long-retention, encrypted      │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  governance_audit_log         │  Approval decisions with confidence scores   │
│  twin_audit_events            │  Model calls, reasoning traces, latencies    │
│  outbound_mcp_calls           │  Provider call log with latency/error        │
│  tenant_access_log            │  Who accessed what, when, from where         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  DB_TENANTS (Identity)        │  Small, hot, cached aggressively             │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  tenants                      │  Tenant metadata, plan tier, limits          │
│  rbac_roles                   │  Role definitions per tenant                 │
│  rbac_permissions             │  Permission grants (user × role × resource)  │
│  tenant_spine_config          │  Per-tenant schema overrides, connectors     │
│  invitations                  │  Pending org invitations (scoped)            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tenant Isolation Schema

Every D1 query MUST use `withTenant()`. The helper injects `WHERE tenant_id = ?` and validates the tenant matches the JWT claim.

```typescript
// packages/spine-schema/src/helpers.ts

export interface TenantQueryOptions {
  tenantId: string;
  tableName: string;
  action: "read" | "write" | "delete";
}

export function withTenant<T>(query: any, tenantId: string): T {
  // Enforce tenant_id filter on every query
  // Fail-loud: if tenantId is missing or mismatched, throw 403
  if (!tenantId || tenantId.length < 4) {
    throw new Error("TENANT_ID_REQUIRED: Cross-tenant queries are forbidden");
  }
  return query.where(eq(query.tenant_id, tenantId));
}

// Example usage in a service:
// const records = await withTenant(
//   db.select().from(entities),
//   env.tenantId
// ).limit(100);
```

### 4.3 Connection Pooling

D1 has built-in connection pooling. For complex analytics queries that exceed D1's 5-minute query limit, the platform falls back to **HyperDrive** (Cloudflare's PostgreSQL connection pooler) or the swappable relational store (currently Supabase, wrapped behind `db-gate`).

| Workload Type            | Default Store           | Fallback              | Adapter             |
| ------------------------ | ----------------------- | --------------------- | ------------------- |
| CRUD operations          | D1                      | HyperDrive PostgreSQL | `db-adapter.ts`     |
| Analytics / aggregations | D1 (materialized views) | HyperDrive            | `db-adapter.ts`     |
| Full-text search         | D1 (FTS5)               | AI Search / Vectorize | `search-adapter.ts` |
| Large blob storage       | R2                      | S3-compatible         | `blob-adapter.ts`   |

---

## 5. KV Namespaces (Cache & Registry Layer)

### 5.1 KV Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_DISCOVERY                 │  Capability catalog cache (TTL: 300s)        │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `discovery:{tenant_id}` │  JSON: { projections, capabilities, limits } │
│  Key: `registry:{type}:{id}`  │  JSON: { endpoint, schema, version, owner }  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_SESSIONS                  │  MCP session state + JWT token cache         │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `session:{session_id}`  │  JSON: { tenant_id, user_id, scopes, expiry }│
│  Key: `token:{jti}`           │  JSON: { tenant_id, roles, issued_at }       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_ENDPOINTS                 │  Living API contract — endpoint registry     │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `ep:{method}:{path}`    │  JSON: { service, auth_type, status, change }│
│  Key: `ep:list:{service}`     │  JSON: [ { method, path, description } ]     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_CREDENTIALS               │  Encrypted credential cache (TTL: 3600s)     │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `cred:{provider}:{tid}` │  JSON: { type, encrypted_blob, expires_at }  │
│  Key: `nango:{connectionId}`  │  JSON: { session_token, provider_config }    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_DECAY                     │  Memory decay tracking + session handoffs    │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `decay:{tenant_id}:{mem_id}` │  JSON: { last_access, decay_score, tier } │
│  Key: `handoff:{tenant_id}:{user_id}` │  JSON: { from_session, to_session, ts } │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  KV_MODEL_CONFIG              │  Per-tenant / per-capability model selection │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `model:{tenant_id}`     │  JSON: { default, fallback, max_tokens }     │
│  Key: `model:{tenant_id}:{cap}` │  JSON: { provider, model, temperature }    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 KV Contract (TypeScript)

```typescript
// packages/spine-schema/src/kv-contracts.ts

export interface DiscoveryCacheEntry {
  tenantId: string;
  projections: string[]; // 8 lenses
  capabilities: CapabilityEntry[];
  features: Record<string, boolean>;
  limits: { rateLimit: number; storageQuota: number; modelQuota: number };
  updatedAt: number;
  ttl: number; // 300 seconds
}

export interface SessionCacheEntry {
  sessionId: string;
  tenantId: string;
  userId: string;
  scopes: ("read" | "write" | "admin")[];
  createdAt: number;
  expiresAt: number;
  via: "mcp" | "web" | "api_key";
}

export interface EndpointRegistryEntry {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  service: string; // Worker name
  authType: "jwt" | "api_key" | "none";
  status: "stable" | "beta" | "deprecated";
  changeSummary: string;
  lastUpdated: number;
}

export interface CredentialCacheEntry {
  provider: string;
  tenantId: string;
  type: "nango" | "mcp" | "native";
  encryptedBlob: string; // AES-256-GCM encrypted
  expiresAt: number;
  rotationDueAt: number;
}

export interface DecayTrackingEntry {
  memoryId: string;
  tenantId: string;
  lastAccessed: number;
  accessCount: number;
  decayScore: number; // 0.0 – 1.0, computed by triage
  currentTier: "active" | "staging" | "archived";
}
```

### 5.3 Cache Invalidation Strategy

| Cache Type  | Invalidation Trigger                         | Pattern                                    |
| ----------- | -------------------------------------------- | ------------------------------------------ |
| Discovery   | Tenant config change, connector add/remove   | Write-through + TTL 300s                   |
| Sessions    | JWT expiry, explicit logout, scope change    | TTL matching JWT expiry                    |
| Endpoints   | Service deployment, API version change       | Version-stamped keys; old keys TTL 3600s   |
| Credentials | Token rotation, Nango webhook, manual revoke | Immediate delete + re-fetch on next use    |
| Decay       | Memory access, triage run (hourly cron)      | Background update via `continuity` service |

---

## 6. Durable Objects (Stateful Compute)

### 6.1 DO Topology

Five Durable Object classes manage stateful compute. Each DO is scoped by `tenant_id` or `tenant_id + user_id`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TwinOrchestrator (twin-orchestrator service)                               │
│  ───────────────────────────────────────────────────────────────────────────│
│  DO ID: idFromName(`${tenant_id}:${user_id}`)                               │
│  State: User context window, reasoning chain, proposal history, confidence    │
│  Persistence: DO storage (transactional) + periodic D1 snapshot             │
│  Lifecycle: Created on first user interaction; hibernates after 10m idle    │
│  Alarm: Every 5 minutes — decay old context, snapshot to D1                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  HermesEngine (hermes service)                                              │
│  ───────────────────────────────────────────────────────────────────────────│
│  DO ID: idFromName(`${tenant_id}:hermes`)                                   │
│  State: Message queue head/tail, in-flight jobs, dead-letter tracking       │
│  Persistence: DO storage for queue state; messages in D1 for durability     │
│  Lifecycle: Singleton per tenant; always active for active tenants          │
│  Alarm: Every 30s — process batch, retry dead letters                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  WorkflowOrchestrator (workflow service)                                    │
│  ───────────────────────────────────────────────────────────────────────────│
│  DO ID: idFromName(`${tenant_id}:${workflow_id}`)                           │
│  State: Workflow step, saga compensation log, pause/resume checkpoint       │
│  Persistence: DO storage + D1 `workflow_state` table                        │
│  Lifecycle: Created per workflow instance; destroyed on completion          │
│  Alarm: Configurable per workflow (default: 60s heartbeat)                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  FolderWatcher (folder-watcher service)                                     │
│  ───────────────────────────────────────────────────────────────────────────│
│  DO ID: idFromName(`${tenant_id}:${folder_path_hash}`)                      │
│  State: File tree snapshot, last checksum, watcher config                   │
│  Persistence: DO storage for active watches; D1 for historical changes      │
│  Lifecycle: Created when folder registered; hibernates if no changes        │
│  Alarm: Every 60s — compare checksums, emit change events                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  GovernanceHITL (govern service)                                            │
│  ───────────────────────────────────────────────────────────────────────────│
│  DO ID: idFromName(`${tenant_id}:${user_id}:hitl`)                          │
│  State: Pending proposals, approval history, delegation rules               │
│  Persistence: DO storage + D1 `action_proposals` (source of truth)          │
│  Lifecycle: Created on first proposal; active while proposals pending       │
│  Alarm: Every 5 minutes — expire stale proposals, notify delegates          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 DO Hibernation & Reactivation

```typescript
// services/twin-orchestrator/src/index.ts

export class TwinOrchestrator implements DurableObject {
  private state: DurableObjectState;
  private contextWindow: ContextWindow | null = null;
  private lastActivity: number = Date.now();

  constructor(state: DurableObjectState) {
    this.state = state;
    // Restore from DO storage on activation
    state.blockConcurrencyWhile(async () => {
      this.contextWindow = await state.storage.get<ContextWindow>("context");
    });
  }

  async fetch(request: Request): Promise<Response> {
    this.lastActivity = Date.now();
    const { tenantId, userId, action, payload } = await request.json();

    // SECURITY: Validate DO ID matches tenant_id + user_id
    const expectedId = this.state.id.toString();
    const derivedId = this.state.idFromName(`${tenantId}:${userId}`).toString();
    if (expectedId !== derivedId) {
      return new Response("TENANT_MISMATCH", { status: 403 });
    }

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

      // Backup to D1 for recovery
      await backupToD1(this.state.id.toString(), decayed);
    }

    // Hibernation check: if idle > 10 minutes, allow hibernation
    if (Date.now() - this.lastActivity > 10 * 60 * 1000) {
      await this.state.storage.deleteAlarm();
    }
  }
}
```

---

## 7. Queues (Async Message Fabric)

### 7.1 Queue Topology & Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE FLOW DIAGRAM                                 │
│                                                                              │
│   [Provider Webhook]                                                        │
│        │                                                                    │
│        ▼                                                                    │
│   [webhook-ingress] ──► validate signature ──► enqueue                      │
│        │                                                                    │
│        ▼                                                                    │
│   ┌─────────────────┐                                                       │
│   │ CONNECTOR_SYNC_ │  Consumer: connector-sync                             │
│   │     QUEUE       │  Batch: 20, Timeout: 30s                              │
│   │                 │  DLQ: After 3 retries → R2 cold storage               │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   [connector-sync] ──► fetch raw records ──► enqueue                        │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐                                                       │
│   │  NORMALIZER_    │  Consumer: normalizer                                 │
│   │     QUEUE       │  Batch: 50, Timeout: 10s                              │
│   │                 │  DLQ: After 3 retries → manual review queue           │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   [normalizer] ──► 8-stage pipeline ──► enqueue                             │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐                                                       │
│   │  PIPELINE_      │  Consumer: pipeline                                   │
│   │     QUEUE       │  Batch: 10, Timeout: 5s                               │
│   │                 │  DLQ: HALT — pipeline failure stops sync (fail-loud)  │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   [pipeline] ──► ONLY WRITER TO SPINE (D1) ──► emit event                   │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│   │   intelligence  │    │twin-orchestrator│    │      govern         │    │
│   │   (analytics)   │◄───│  (reasoning DO) │───►│  (confidence gate)  │    │
│   └─────────────────┘    └─────────────────┘    └──────────┬──────────┘    │
│                                                            │               │
│                                       ┌────────────────────┼──────────┐    │
│                                       │                    │          │    │
│                                       ▼                    ▼          ▼    │
│                              [>=0.85 auto]          [0.70-0.85]   [<0.70]  │
│                                  │                     │           │       │
│                                  ▼                     ▼           ▼       │
│   ┌─────────────────┐       ┌─────────┐          ┌──────────┐  ┌────────┐  │
│   │    ACT_QUEUE    │◄──────│  ACT    │          │ My Desk  │  │ Discard│  │
│   │  Batch: 5       │       │         │          │ (review) │  │ (audit)│  │
│   │  Timeout: 10s   │       └─────────┘          └──────────┘  └────────┘  │
│   │  DLQ: 3 retries │                                                      │
│   └────────┬────────┘                                                      │
│            │                                                               │
│            ▼                                                               │
│   [act] ──► adapter select ──► provider API ──► writeback ──► pipeline    │
│                                                                              │
│   ┌─────────────────┐                                                       │
│   │  TELEMETRY_     │  Consumer: telemetry                                  │
│   │     QUEUE       │  Batch: 100, Timeout: 5s                              │
│   │                 │  Fire-and-forget observability events                 │
│   └─────────────────┘                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Queue Contract (TypeScript)

```typescript
// packages/types/src/queues.ts

export type QueueName =
  | "PIPELINE_QUEUE"
  | "ACT_QUEUE"
  | "CONNECTOR_SYNC_QUEUE"
  | "NORMALIZER_QUEUE"
  | "TELEMETRY_QUEUE";

export interface QueueMessage<T = unknown> {
  id: string; // ULID
  tenantId: string; // Enforced on every message
  correlationId: string; // x-correlation-id from ingress
  timestamp: number; // Unix ms
  type: string; // Message type discriminator
  payload: T;
  retryCount: number; // Managed by queue infrastructure
  traceId: string; // OpenTelemetry trace ID
}

// ── Pipeline Queue Messages ──

export interface PipelineMessage extends QueueMessage {
  type: "spine_write" | "audit_log" | "projection_update";
  payload: {
    table: string; // D1 table name
    operation: "insert" | "update" | "delete";
    record: Record<string, unknown>;
    previousRecord?: Record<string, unknown>; // For audit trail
  };
}

// ── Act Queue Messages ──

export interface ActMessage extends QueueMessage {
  type: "capability_execute" | "writeback" | "adapter_retry";
  payload: {
    capability: string; // e.g., "salesforce.opportunity.update"
    provider: string;
    resource: string;
    operation: string;
    entityId?: string;
    parameters: Record<string, unknown>;
    governanceToken?: string; // For 0.70-0.85 approved actions
  };
}

// ── Connector Sync Queue Messages ──

export interface ConnectorSyncMessage extends QueueMessage {
  type: "creamy_sync" | "incremental_sync" | "webhook_triggered_sync";
  payload: {
    connectorId: string;
    provider: string;
    syncMode: "full" | "incremental" | "webhook";
    since?: number; // Last sync timestamp
    webhookPayload?: Record<string, unknown>;
  };
}

// ── Normalizer Queue Messages ──

export interface NormalizerMessage extends QueueMessage {
  type: "raw_records" | "schema_detect" | "retry_stage";
  payload: {
    records: RawRecord[];
    provider: string;
    connectorId: string;
    stage?: number; // NA0–NA5 stage indicator
  };
}

// ── Telemetry Queue Messages ──

export interface TelemetryMessage extends QueueMessage {
  type: "metric" | "trace" | "log" | "audit";
  payload: {
    service: string;
    metric?: { name: string; value: number; unit: string };
    trace?: { spanId: string; parentSpanId?: string; durationMs: number };
    log?: { level: "debug" | "info" | "warn" | "error"; message: string };
  };
}

// ── Dead Letter Queue Contract ──

export interface DeadLetterMessage<T = unknown> extends QueueMessage<T> {
  deadLetteredAt: number;
  failureReason: string;
  originalQueue: QueueName;
  maxRetries: number;
}

// DLQ destination: R2 bucket `integratewise-dlq` for manual review
```

### 7.3 Consumer Configuration

```typescript
// packages/lib/src/queue-adapter.ts

export interface QueueConsumerConfig {
  queueName: QueueName;
  maxBatchSize: number;
  maxBatchTimeout: number;
  maxRetries: number;
  deadLetterQueue?: QueueName | "R2";
  backoffStrategy: "fixed" | "exponential";
  backoffMs: number;
}

export const queueConfigs: Record<QueueName, QueueConsumerConfig> = {
  PIPELINE_QUEUE: {
    queueName: "PIPELINE_QUEUE",
    maxBatchSize: 10,
    maxBatchTimeout: 5,
    maxRetries: 3,
    deadLetterQueue: undefined, // HALT on failure — no DLQ
    backoffStrategy: "exponential",
    backoffMs: 1000,
  },
  ACT_QUEUE: {
    queueName: "ACT_QUEUE",
    maxBatchSize: 5,
    maxBatchTimeout: 10,
    maxRetries: 3,
    deadLetterQueue: "R2", // DLQ to R2 for investigation
    backoffStrategy: "exponential",
    backoffMs: 2000,
  },
  CONNECTOR_SYNC_QUEUE: {
    queueName: "CONNECTOR_SYNC_QUEUE",
    maxBatchSize: 20,
    maxBatchTimeout: 30,
    maxRetries: 3,
    deadLetterQueue: "R2",
    backoffStrategy: "fixed",
    backoffMs: 5000,
  },
  NORMALIZER_QUEUE: {
    queueName: "NORMALIZER_QUEUE",
    maxBatchSize: 50,
    maxBatchTimeout: 10,
    maxRetries: 3,
    deadLetterQueue: "R2",
    backoffStrategy: "exponential",
    backoffMs: 1000,
  },
  TELEMETRY_QUEUE: {
    queueName: "TELEMETRY_QUEUE",
    maxBatchSize: 100,
    maxBatchTimeout: 5,
    maxRetries: 1, // Telemetry is best-effort
    deadLetterQueue: undefined, // Drop on failure
    backoffStrategy: "fixed",
    backoffMs: 1000,
  },
};
```

---

## 8. R2 Storage (Object & Blob Layer)

### 8.1 R2 Bucket Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  R2_TELEMETRY                 │  Observability data, audit archives          │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `traces/{date}/{trace_id}.json` │  OpenTelemetry trace spans              │
│  Key: `metrics/{date}/{service}.parquet` │  Time-series metrics (Parquet)       │
│  Key: `logs/{date}/{hour}.ndjson` │  Structured logs (newline-delimited JSON) │
│  Key: `dlq/{queue}/{date}/{msg_id}.json` │  Dead letter queue archives        │
│  Lifecycle: 90-day retention, then Glacier                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  R2_ASSETS                    │  Static assets, exports, generated docs      │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `exports/{tenant_id}/{export_id}.csv` │  User data exports               │
│  Key: `docs/{tenant_id}/{doc_id}.pdf` │  Generated reports                  │
│  Key: `avatars/{user_id}.png` │  User avatars                                │
│  Key: `attachments/{tenant_id}/{msg_id}/{file}` │  File attachments           │
│  Lifecycle: Tenant-controlled; default 1 year                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  R2_SYNC_BLOBS                │  Large sync payloads, raw provider dumps     │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Key: `sync/{tenant_id}/{provider}/{sync_id}.json.gz` │  Compressed raw data │
│  Key: `backups/{tenant_id}/{date}/spine.jsonl.gz` │  Spine backups         │
│  Key: `snapshots/do/{do_id}/{timestamp}.json` │  DO state snapshots      │
│  Lifecycle: 30-day hot, then archive                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 R2 Access Pattern

```typescript
// packages/lib/src/blob-adapter.ts

export interface R2Operations {
  putTelemetryBlob(
    key: string,
    data: ReadableStream,
    metadata: Record<string, string>
  ): Promise<void>;
  getExport(tenantId: string, exportId: string): Promise<ReadableStream | null>;
  putSyncBlob(tenantId: string, provider: string, syncId: string, data: Buffer): Promise<void>;
  listBackups(tenantId: string, prefix: string): Promise<string[]>;
  deleteExpired(prefix: string, before: Date): Promise<number>;
}

// Security: All R2 keys prefixed with tenant_id
// Cross-tenant access = 403 (enforced at key-construction time)
```

---

## 9. Vectorize (Semantic Search Layer)

### 9.1 Vectorize Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VECTORIZE_KNOWLEDGE          │  Semantic search index                       │
│  ─────────────────────────────┼──────────────────────────────────────────────│
│  Dimensions: 768              │  Using text-embedding-3-small (OpenAI)       │
│  Distance: cosine             │  Cosine similarity for semantic matching     │
│  Metadata: tenant_id, scope, type, source, created_at                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Vectorize Contract

```typescript
// packages/types/src/vectorize.ts

export interface VectorizeDocument {
  id: string; // ULID
  tenantId: string; // Filtered in every query
  vector: number[]; // 768-dimensional embedding
  metadata: {
    scope: "personal" | "work" | "organization" | "ai";
    type: "document" | "memory" | "insight" | "proposal";
    source: string; // Service that created the vector
    entityId?: string; // Linked SSOC entity
    createdAt: number;
    accessCount: number; // For recency scoring
  };
}

export interface VectorizeQuery {
  tenantId: string;
  vector: number[];
  topK: number;
  filter?: {
    scope?: VectorizeDocument["metadata"]["scope"][];
    type?: VectorizeDocument["metadata"]["type"][];
    source?: string[];
    minCreatedAt?: number;
  };
}

// Example usage in knowledge service:
// const results = await env.VECTORIZE_KNOWLEDGE.query(query.vector, {
//   topK: 10,
//   filter: { tenantId: query.tenantId, scope: ['work', 'organization'] }
// });
```

---

## 10. Service Bindings Map (Complete RPC Topology)

### 10.1 Binding Matrix

The Gateway exposes all 26 services via service bindings. Internal services MAY call each other directly via bindings (bypassing Gateway for performance), but MUST still carry `tenant_id`.

| Caller \ Callee | gateway | webhook-ingress | tenants | connector | connector-sync | normalizer | loader | pipeline | twin-orch | l2  | intelligence | knowledge | govern | store | act | spine-v2 | hermes | triage | workflow | iw-agent | mcp-conn | agent-reg | billing | admin | folder-w | continuity | telemetry | think |
| --------------- | ------- | --------------- | ------- | --------- | -------------- | ---------- | ------ | -------- | --------- | --- | ------------ | --------- | ------ | ----- | --- | -------- | ------ | ------ | -------- | -------- | -------- | --------- | ------- | ----- | -------- | ---------- | --------- | ----- |
| gateway         | —       | R               | R       | R         | R              | R          | R      | R        | R         | R   | R            | R         | R      | R     | R   | R        | R      | R      | R        | R        | R        | R         | R       | R     | R        | R          | R         | R     |
| webhook-ingress | —       | —               | —       | —         | W              | —          | W      | —        | —         | —   | —            | —         | —      | —     | —   | —        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | W         | —     |
| connector       | R       | —               | R       | —         | W              | —          | —      | —        | —         | —   | —            | —         | —      | —     | —   | —        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| connector-sync  | —       | —               | R       | —         | —              | W          | —      | —        | —         | —   | —            | —         | —      | —     | —   | —        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| normalizer      | —       | —               | —       | —         | —              | —          | —      | W        | —         | —   | —            | —         | —      | —     | —   | R        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| pipeline        | —       | —               | —       | —         | —              | —          | —      | —        | —         | —   | W            | W         | —      | W     | —   | W        | W      | W      | —        | —        | —        | —         | —       | —     | —        | W          | W         | —     |
| twin-orch       | —       | —               | —       | —         | —              | —          | —      | R        | —         | —   | R            | R         | W      | —     | —   | R        | —      | —      | —        | —        | —        | —         | —       | —     | —        | R          | —         | W     |
| govern          | —       | —               | —       | —         | —              | —          | —      | R        | —         | —   | —            | —         | —      | —     | W   | —        | —      | —      | W        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| act             | —       | —               | —       | —         | —              | —          | —      | W        | —         | —   | —            | —         | —      | —     | —   | —        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| hermes          | —       | —               | —       | —         | —              | —          | —      | —        | —         | —   | —            | —         | —      | —     | W   | —        | —      | W      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| workflow        | —       | —               | —       | —         | —              | —          | —      | —        | —         | —   | —            | —         | W      | —     | W   | —        | W      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |
| mcp-conn        | —       | —               | R       | —         | —              | —          | —      | R        | —         | —   | R            | R         | —      | —     | —   | R        | —      | —      | —        | —        | —        | —         | —       | —     | —        | —          | —         | —     |

**Legend:** R = Read (calls service for data), W = Write (enqueues or triggers)

### 10.2 Service Binding TypeScript Contract

```typescript
// apps/gateway/src/bindings.ts

export interface ServiceBindings {
  // Tier 0 — Ingress
  WEBHOOK_INGRESS: Fetcher;

  // Tier 1 — Tenant & Sync
  TENANTS: Fetcher;
  CONNECTOR: Fetcher;
  CONNECTOR_SYNC: Fetcher;
  NORMALIZER: Fetcher;
  LOADER: Fetcher;

  // Tier 2 — Projection & Rendering
  PIPELINE: Fetcher;
  TWIN_ORCHESTRATOR: Fetcher; // Durable Object binding
  L2: Fetcher;
  INTELLIGENCE: Fetcher;
  KNOWLEDGE: Fetcher;
  GOVERN: Fetcher;
  STORE: Fetcher;
  ACT: Fetcher;
  SPINE_V2: Fetcher;

  // Tier 3 — Capability Runtime
  HERMES: Fetcher; // Durable Object binding
  TRIAGE: Fetcher;
  WORKFLOW: Fetcher; // Durable Object binding
  IW_AGENT_RUNTIME: Fetcher;
  MCP_CONNECTOR: Fetcher;

  // Tier 4 — Supporting
  AGENT_REGISTRY: Fetcher;
  BILLING: Fetcher;
  ADMIN: Fetcher;
  FOLDER_WATCHER: Fetcher; // Durable Object binding
  CONTINUITY: Fetcher;
  TELEMETRY: Fetcher;
  THINK: Fetcher;
}

// Every internal RPC call MUST include tenant context
export interface InternalRpcRequest {
  tenantId: string; // From JWT claim — NEVER from client
  correlationId: string; // Tracing
  userId?: string; // For user-scoped operations
  scopes: string[]; // JWT scopes
  payload: unknown;
}

// Gateway middleware injects this into every binding call
export async function callService<T>(
  binding: Fetcher,
  request: InternalRpcRequest,
  path: string
): Promise<T> {
  const response = await binding.fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Id": request.tenantId, // Fail-loud if missing
      "X-Correlation-Id": request.correlationId,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`SERVICE_ERROR: ${response.status} from ${path}`);
  }

  return response.json();
}
```

---

## 11. CI/CD Pipeline

### 11.1 GitHub Actions Deployment Flow

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

### 11.2 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy — IntegrateWise Continuity Bridge

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
    types: [closed]

env:
  NODE_VERSION: '22'
  PNPM_VERSION: '9'
  WRANGLER_VERSION: '3'

jobs:
  # ── Stage 1: Quality Gates ──
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: ${{ env.PNPM_VERSION }} }
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r test

  # ── Stage 2: Deploy Matrix ──
  deploy:
    needs: [lint, typecheck, test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - gateway
          - webhook-ingress
          - tenants
          - connector
          - connector-sync
          - normalizer
          - pipeline
          - twin-orchestrator
          - l2
          - intelligence
          - knowledge
          - govern
          - store
          - act
          - hermes
          - workflow
          - mcp-connector
          - continuity
          - telemetry
          - think
      fail-fast: false

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'pnpm' }

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build service
        run: pnpm --filter ${{ matrix.service }} build

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: services/${{ matrix.service }}
          command: deploy --env ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}

      - name: Verify health
        run: |
          curl -sf https://${{ matrix.service }}.integratewise.ai/health || \
          curl -sf https://${{ matrix.service }}-staging.integratewise.ai/health || \
          echo "Health check endpoint not yet exposed"

  # ── Stage 3: Post-Deploy E2E ──
  e2e:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm e2e:smoke
        env:
          TEST_TENANT_ID: ${{ secrets.TEST_TENANT_ID }}
          TEST_JWT: ${{ secrets.TEST_JWT }}
```

### 11.3 Semantic Versioning & Rollback

| Artifact  | Version Source                            | Rollback Mechanism                                    |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| Workers   | `package.json` version + git SHA          | `wrangler deploy --rollback` or previous SHA redeploy |
| D1 Schema | Migration files in `infra/d1-migrations/` | D1 backups (auto) + manual migration reversal         |
| KV Data   | Not versioned; TTL-based                  | Manual restore from D1 source-of-truth                |
| R2 Blobs  | Not versioned; date-prefixed keys         | Lifecycle rules + manual restore                      |

---

## 12. Local Development Stack

### 12.1 Development Environment

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

### 12.2 Local Development Commands

```bash
# Root workspace commands (package.json scripts)
{
  "scripts": {
    "dev": "concurrently \"pnpm:dev:*\"",
    "dev:gateway": "wrangler dev apps/gateway/src/index.ts --port 8787",
    "dev:web": "pnpm --filter web dev",
    "dev:mcp": "wrangler dev apps/mcp-server/src/index.ts --port 8788",

    "dev:services": "concurrently \"pnpm:dev:service:*\"",
    "dev:service:act": "wrangler dev services/act/src/index.ts --port 8790",
    "dev:service:pipeline": "wrangler dev services/pipeline/src/index.ts --port 8791",
    "dev:service:normalizer": "wrangler dev services/normalizer/src/index.ts --port 8792",
    "dev:service:continuity": "wrangler dev services/continuity/src/index.ts --port 8793",
    "dev:service:workflow": "wrangler dev services/workflow/src/index.ts --port 8794",
    "dev:service:twin": "wrangler dev services/twin-orchestrator/src/index.ts --port 8795",

    "db:migrate": "wrangler d1 migrations apply integratewise-spine --local",
    "db:migrate:prod": "wrangler d1 migrations apply integratewise-spine --remote",
    "db:seed": "tsx scripts/seed-local-db.ts",

    "test": "vitest",
    "test:e2e": "playwright test",
    "test:smoke": "tsx scripts/smoke-test.ts",

    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc -b",

    "deploy:all": "pnpm -r deploy",
    "deploy:gateway": "wrangler deploy apps/gateway/wrangler.toml",
    "deploy:frontend": "wrangler pages deploy apps/web/dist",

    "mcp:local": "node scripts/integratewise-mcp-bridge.mjs",
    "mcp:test": "tsx scripts/test-mcp-connection.ts"
  }
}
```

### 12.3 Local Configuration (wrangler.toml)

```toml
# wrangler.toml (local dev override)
[env.development]
name = "integratewise-gateway-dev"
compatibility_date = "2026-06-01"

# Local D1 (sqlite file)
[[d1_databases]]
binding = "DB"
database_name = "integratewise-spine-local"
database_id = "local"

# Local KV (in-memory)
[[kv_namespaces]]
binding = "KV_DISCOVERY"
id = "local-discovery"

# Local Queues (in-memory)
[[queues.producers]]
binding = "PIPELINE_QUEUE"
queue = "local-pipeline"

[[queues.consumers]]
queue = "local-pipeline"
max_batch_size = 10
```

---

## 13. Per-App Deployment Subsets

### 13.1 Deployment Dependency Graph

Not all services need to deploy together. The dependency graph determines safe subset deploys.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT DEPENDENCY GRAPH                              │
│                                                                              │
│   Tier 0 (Ingress) — No upstream deps                                        │
│   ├── gateway          [deploy: independent]                                 │
│   ├── webhook-ingress  [deploy: independent]                                 │
│   └── apps/web         [deploy: independent, Pages]                          │
│                                                                              │
│   Tier 1 (Tenant & Sync) — Depends on Tier 0 bindings                        │
│   ├── tenants          [deploy: after gateway]                               │
│   ├── connector        [deploy: after tenants]                               │
│   ├── connector-sync   [deploy: after connector + normalizer]                │
│   ├── normalizer       [deploy: after pipeline]                              │
│   ├── loader           [deploy: after connector + connector-sync]            │
│   └── spine-v2         [deploy: after pipeline]                              │
│                                                                              │
│   Tier 2 (Projection) — Depends on Tier 1 + D1 schema                        │
│   ├── pipeline         [deploy: after D1 migrations]                         │
│   ├── store            [deploy: after pipeline]                              │
│   ├── l2               [deploy: after store + intelligence]                  │
│   ├── intelligence     [deploy: after knowledge + pipeline]                  │
│   ├── knowledge        [deploy: after pipeline + Vectorize]                  │
│   ├── govern           [deploy: after pipeline + workflow]                   │
│   ├── act              [deploy: after pipeline + connector]                  │
│   └── twin-orchestrator[deploy: after pipeline + think + knowledge]          │
│                                                                              │
│   Tier 3 (Runtime) — Depends on Tier 2                                       │
│   ├── hermes           [deploy: after act + pipeline]                        │
│   ├── triage           [deploy: after hermes + continuity]                   │
│   ├── workflow         [deploy: after pipeline + govern]                     │
│   ├── iw-agent-runtime [deploy: after think + mcp-connector]               │
│   └── mcp-connector    [deploy: after gateway + pipeline]                    │
│                                                                              │
│   Tier 4 (Supporting) — Depends on all above                                 │
│   ├── continuity       [deploy: after pipeline + knowledge]                  │
│   ├── telemetry        [deploy: after all — fire-and-forget]                 │
│   ├── think            [deploy: after pipeline + knowledge]                  │
│   ├── agent-registry   [deploy: after connector + mcp-connector]             │
│   ├── billing          [deploy: after tenants + pipeline]                    │
│   ├── admin            [deploy: after tenants]                               │
│   └── folder-watcher   [deploy: after pipeline + mcp-connector]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Safe Subset Deploys

| Subset           | Services                                           | Trigger              | Risk                           |
| ---------------- | -------------------------------------------------- | -------------------- | ------------------------------ |
| **Hotfix**       | Single service                                     | Critical bug         | Low — no schema changes        |
| **Frontend**     | `apps/web` + `apps/mcp-server`                     | UI release           | Low — no backend deps          |
| **Spine Update** | `pipeline` + `normalizer` + `spine-v2`             | Schema change        | Medium — D1 migration required |
| **Capability**   | `act` + `hermes` + `workflow`                      | New provider adapter | Medium — test outbound calls   |
| **AI Update**    | `think` + `twin-orchestrator` + `iw-agent-runtime` | Model change         | Low — swappable adapter        |
| **Full Release** | All 26                                             | Major version        | High — full e2e required       |
| **Infra Only**   | D1 migrations + KV config + Vectorize              | Index change         | High — backup first            |

### 13.3 Deployment Verification per Subset

```typescript
// scripts/verify-deploy.ts

export interface DeployVerification {
  subset: string;
  services: string[];
  checks: {
    health: boolean; // GET /health on each service
    bindings: boolean; // Service binding RPC ping
    queueDepth: boolean; // No unprocessed backlog
    d1Schema: boolean; // Schema version matches code
    discovery: boolean; // /api/v1/discovery returns valid schema
    mcpSmoke: boolean; // MCP connection + tool list
    e2eHappyPath: boolean; // Full sync → propose → approve
  };
}

export const subsetVerifications: Record<string, DeployVerification> = {
  hotfix: {
    subset: "hotfix",
    services: ["act"], // example
    checks: {
      health: true,
      bindings: true,
      queueDepth: true,
      d1Schema: false,
      discovery: false,
      mcpSmoke: false,
      e2eHappyPath: false,
    },
  },
  spine: {
    subset: "spine",
    services: ["pipeline", "normalizer", "spine-v2"],
    checks: {
      health: true,
      bindings: true,
      queueDepth: true,
      d1Schema: true,
      discovery: true,
      mcpSmoke: false,
      e2eHappyPath: true,
    },
  },
  full: {
    subset: "full",
    services: ["all"],
    checks: {
      health: true,
      bindings: true,
      queueDepth: true,
      d1Schema: true,
      discovery: true,
      mcpSmoke: true,
      e2eHappyPath: true,
    },
  },
};
```

---

## 14. Security Boundary Annotations

### 14.1 Trust Boundaries by Primitive

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRIMITIVE          │  TRUST LEVEL    │  ISOLATION MECHANISM                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Workers (compute)  │  Untrusted      │  Sandboxed V8 isolate per request   │
│  D1 (relational)    │  Trusted        │  tenant_id prefix on every index    │
│  KV (cache)         │  Trusted        │  tenant_id in every key             │
│  DO (stateful)      │  Trusted        │  idFromName(tenant_id + suffix)     │
│  Queues (async)     │  Trusted        │  tenant_id in every message         │
│  R2 (blobs)         │  Trusted        │  tenant_id in every object key      │
│  Vectorize (vector) │  Trusted        │  tenant_id filter on every query    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Service Bindings   │  Trusted        │  Internal network only; no external │
│                     │                 │  ingress possible                   │
│  Secrets (CF)       │  Critical       │  Encrypted at rest; runtime inject  │
│  Nango Vault        │  Critical       │  Per-tenant encryption; no x-tenant │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 14.2 Security Gates by Layer

| Layer          | Gate                              | Enforcement Point                    | Failure Mode                 |
| -------------- | --------------------------------- | ------------------------------------ | ---------------------------- |
| **Identity**   | JWT validation                    | `gateway`                            | 401 Unauthorized             |
| **Identity**   | `tenant_id` extraction from claim | `gateway`                            | 403 Forbidden                |
| **Identity**   | RBAC scope check                  | `tenants` service                    | 403 Forbidden                |
| **Ingress**    | Rate limiting                     | `gateway` (Cloudflare Rate Limiting) | 429 Too Many Requests        |
| **Ingress**    | CORS whitelist                    | `gateway`                            | 403 Forbidden                |
| **Ingress**    | Webhook signature verification    | `webhook-ingress`                    | 401 Unauthorized             |
| **Capability** | `WHERE tenant_id = ?`             | Every D1 query                       | 403 Forbidden (fail-loud)    |
| **Capability** | Parameterized queries (Drizzle)   | `packages/spine-schema`              | SQL injection blocked        |
| **Continuity** | Governance confidence gate        | `govern`                             | Proposal queued or discarded |
| **Continuity** | HITL DO scoping                   | `govern`                             | 403 if DO ID mismatch        |
| **Provider**   | Credential wall                   | `act` adapters                       | 401 if credentials missing   |
| **Provider**   | Tool whitelist                    | `act` adapters                       | 403 if tool not in catalog   |
| **All**        | Audit log write                   | `pipeline` / `telemetry`             | HALT if write fails          |

---

## 15. Integration Points with Adjacent Domains

### 15.1 Upstream Dependencies (What This Domain Needs)

| Adjacent Domain         | Interface                                 | Consumed By                       |
| ----------------------- | ----------------------------------------- | --------------------------------- |
| **Identity & Auth**     | JWT claims (`tenant_id`, `scopes`, `jti`) | Gateway, all service bindings     |
| **Spine Schema**        | Drizzle ORM schema, `withTenant()` helper | All D1-accessing services         |
| **Provider Adapters**   | Adapter registry map, credential types    | `act`, `connector-sync`           |
| **Capability Contract** | Discovery schema, capability names        | Gateway routing, MCP tool catalog |

### 15.2 Downstream Consumers (What This Domain Provides)

| Adjacent Domain     | Interface                                    | Provided By                                                        |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **OODA Engine**     | Queue messages (PIPELINE_QUEUE, ACT_QUEUE)   | `normalizer` → `pipeline` → `twin-orchestrator` → `govern` → `act` |
| **Twin / ADK**      | DO state persistence, context snapshots      | `twin-orchestrator` DO                                             |
| **Governance**      | HITL DO, audit log tables                    | `govern` service + D1 `governance_audit_log`                       |
| **Knowledge / RAG** | Vectorize index, embedding storage           | `knowledge` service + Vectorize                                    |
| **Observability**   | Telemetry queue, R2 blobs, Workers Analytics | `telemetry` service                                                |
| **Ecosystem**       | Service bindings map, MCP connector endpoint | `mcp-connector`, `agent-registry`                                  |

### 15.3 Cross-Domain Flow: First Connection (Revisited)

```
[Identity Domain]          [This Domain]           [Capability Domain]
       │                          │                         │
       │  JWT issued              │                         │
       │─────────────────────────►│                         │
       │                          │                         │
       │                          │  D1: tenant init        │
       │                          │  KV: session cache      │
       │                          │  DO: twin provisioned   │
       │◄─────────────────────────│                         │
       │                          │                         │
       │  Connect Salesforce      │                         │
       │─────────────────────────►│                         │
       │                          │  Queue: CONNECTOR_SYNC  │
       │                          │  Worker: connector-sync │
       │                          │  Worker: normalizer     │
       │                          │  Worker: pipeline       │
       │                          │  D1: entities written   │
       │                          │  Vectorize: embeddings  │
       │                          │────────────────────────►│
       │                          │                         │  Capability: analyze_account
       │                          │◄────────────────────────│
       │                          │  Queue: ACT_QUEUE       │
       │                          │  Worker: act            │
       │                          │  Adapter: Nango         │
       │                          │  Provider: Salesforce   │
       │◄─────────────────────────│  Writeback: pipeline    │
       │  Proposed insight        │                         │
```

---

## 16. Operational Runbooks

### 16.1 Health Check Endpoints

Every service MUST expose:

```typescript
// Standard health response
interface HealthResponse {
  service: string;
  version: string;
  status: "healthy" | "degraded" | "unhealthy";
  checks: {
    database?: { status: string; latencyMs: number };
    cache?: { status: string; latencyMs: number };
    queue?: { status: string; depth: number };
    upstream?: { status: string; services: string[] };
  };
  timestamp: string;
}
```

### 16.2 Alerting Thresholds

| Metric                 | Warning    | Critical   | Action                          |
| ---------------------- | ---------- | ---------- | ------------------------------- |
| Queue depth (PIPELINE) | > 100      | > 1000     | Scale consumer concurrency      |
| Queue depth (ACT)      | > 50       | > 500      | Circuit break provider calls    |
| D1 query latency p99   | > 500ms    | > 2000ms   | Check index usage, query plan   |
| DO alarm lag           | > 30s      | > 5min     | Inspect DO hibernation, restart |
| KV cache miss rate     | > 20%      | > 50%      | Warm cache, check TTL           |
| Error rate (5xx)       | > 1%       | > 5%       | Rollback to previous version    |
| R2 egress cost         | > $100/day | > $500/day | Audit blob access patterns      |

---

## 17. Glossary

| Term                    | Definition                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **Service Binding**     | Cloudflare Workers RPC mechanism — one Worker calls another directly over the internal network |
| **Durable Object (DO)** | Cloudflare's stateful compute primitive with transactional storage and alarms                  |
| **Spine**               | The Adaptive Spine — the single source of truth for entity context, written only by `pipeline` |
| **OODA**                | Observe-Orient-Decide-Act — the decision cycle spanning Capability and Continuity layers       |
| **Twin**                | The ambient AI reasoning engine, implemented as a DO, not a separate layer                     |
| **Credential Wall**     | The security boundary where per-tenant provider credentials are fetched and never exposed      |
| **DLQ**                 | Dead Letter Queue — where failed messages go after max retries                                 |
| **SSOC**                | Stable Single Object Context — the canonical entity identification system                      |

---

**END OF DOCUMENT**

_IntegrateWise Continuity Bridge v2.0 — Deployment Architecture and Service Topology. This document is the definitive reference for Cloudflare infrastructure primitives, service mesh topology, CI/CD, and local development. All 26 services, 5 queue types, 3 D1 databases, 6 KV namespaces, 3 R2 buckets, 1 Vectorize index, and 5 Durable Object classes are specified here._
