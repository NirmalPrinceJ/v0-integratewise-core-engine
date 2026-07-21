# §5 — Continuity Layer & Governance (The Moat)

**Status:** DRAFT — Stage 1/2 Deep-Dive for v2.0 Canonical Architecture  
**Domain Owner:** Continuity & Governance Architecture Team  
**Scope:** Adaptive Spine, Connectors, Loader, Synchronization, Normalizer, Schema Provider, Workspace, Memory, Knowledge, Governance Rules, Approval Gates, HITL Orchestrator, 0.70/0.85 Confidence Law, Audit, Compliance  
**Layer Position:** Layer 4 (Continuity) + Layer 5 (Governance) in the 6-layer stack  
**Adjacent Layers:** Capability (Layer 3, north-bound) → Continuity (Layer 4) → Governance (Layer 5) → Provider Fabric (Layer 6, south-bound)  
**OODA Span:** Observe + Orient phases run across Capability and Continuity. Decide + Act phases are gated by Governance.  
**Twin Posture:** AMBIENT — the Twin is not a separate entity; it is a reasoning quality that permeates Context Assembly, Memory, and Knowledge.

---

## 5.1 Domain Overview

The Continuity Layer is the **moat** of the IntegrateWise Continuity Bridge. It is the only place where context is written, compounded, and governed. No consumer, agent, or provider touches the Spine directly. Every inbound signal flows through the Normalizer. Every outbound action is gated by Governance. Every memory decays on a schedule. Every audit log is immutable.

**The 6-Layer Architecture Context:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Layer 1 — Identity          │  Who. JWT, tenant_id, RBAC, SSO.              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 2 — Ingress           │  How. Gateway, webhooks, MCP inbound, SSE.    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 3 — Capability        │  What. Named actions, tools, projections.     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 4 — CONTINUITY  ◄─────┤  Context. Spine, Memory, Knowledge, Workspace.│
│  (THIS DOMAIN)               │  The moat. Nothing passes without leaving a   │
│                              │  trace in the Spine, the Memory Store, or the │
│                              │  Audit Log.                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 5 — GOVERNANCE  ◄─────┤  Approval. Confidence gates, HITL, rules.     │
│  (THIS DOMAIN)               │  The airlock. Every action ≥0.70 is scored.   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 6 — Provider Fabric   │  Execution. Adapters, Nango, MCP outbound.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OODA Across Layers:**

```
      Layer 3 (Capability)          Layer 4 (Continuity)          Layer 5 (Governance)
      ┌───────────────┐            ┌───────────────┐            ┌───────────────┐
      │   OBSERVE     │───────────►│   ORIENT      │───────────►│    DECIDE     │
      │  (ingress,    │  raw sig   │  (normalize,  │  entity360 │  (twin reason,│
      │   webhooks)   │            │   resolve,    │            │   confidence) │
      └───────────────┘            │   enrich)     │            └───────┬───────┘
                                     └───────────────┘                    │
                                                                          ▼
                                                               ┌───────────────┐
                                                               │     ACT       │
                                                               │  (governed    │
                                                               │   execution)  │
                                                               └───────────────┘
```

---

## 5.2 Adaptive Spine

The Adaptive Spine is the **single source of context**. It is a directed property graph stored in D1, accessed only through the `pipeline` service (the sole writer), and read by `intelligence`, `knowledge`, `continuity`, `govern`, and `twin-orchestrator`.

### 5.2.1 Spine Schema (D1)

```typescript
// packages/spine-schema/src/schema/spine.ts

export const entities = sqliteTable("entities", {
  id: text("id").primaryKey(), // SSOC UUID (v4, stable)
  tenantId: text("tenant_id").notNull(),
  entityType: text("entity_type").notNull(), // 'account', 'contact', 'deal', 'task', ...
  sourceId: text("source_id").notNull(), // Provider-native ID
  sourceProvider: text("source_provider").notNull(), // 'salesforce', 'hubspot', 'slack'
  canonicalName: text("canonical_name"),
  traits: text("traits", { mode: "json" }), // Normalizer-detected traits
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

### 5.2.2 SSOC (Stable Source-Object Correlation)

Every entity in the Spine carries a **stable UUID** (SSOC) that survives provider swaps. When Salesforce is swapped for HubSpot, the SSOC remains. The `sourceId` and `sourceProvider` columns change; `id` does not.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Salesforce ID  │────►│   SSOC UUID     │◄────│   HubSpot ID    │
│  0015g00000Lx   │     │  (stable)       │     │  987654321      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                       │
        └─────── same entity ────┴──────── same entity ──┘
```

### 5.2.3 Spine Access Rules

| Operation  | Allowed Service                                                                         | Queue / Binding  | Constraint                             |
| ---------- | --------------------------------------------------------------------------------------- | ---------------- | -------------------------------------- |
| **WRITE**  | `pipeline` only                                                                         | `PIPELINE_QUEUE` | Must carry `tenant_id` from JWT        |
| **READ**   | `intelligence`, `knowledge`, `continuity`, `govern`, `twin-orchestrator`, `l2`, `store` | Service bindings | `WHERE tenant_id = ?` enforced         |
| **AUDIT**  | All services                                                                            | Direct D1 write  | `spine_audit_log` append-only          |
| **DELETE** | `pipeline` only (soft delete)                                                           | `PIPELINE_QUEUE` | Sets `archivedAt`, never `DELETE FROM` |

**Invariant:** `pipeline` is the only writer. If any other service attempts `INSERT` or `UPDATE` on `entities` or `relationships`, the `db-gate` adapter rejects it.

---

## 5.3 Connectors, Loader & Synchronization

This subdomain handles **all inbound data**. No provider writes directly to the Spine. Every inbound signal — webhook, sync poll, file drop, MCP tool result — flows through the Connector → Loader → Sync → Normalizer → Pipeline → Spine chain.

### 5.3.1 Connector Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INBOUND DATA PATH (North-to-Spine)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Provider Webhooks          │   Sync Polls         │   File Drops         │
│   ├─ Salesforce              │   ├─ 15-min cron     │   ├─ Folder Watcher  │
│   ├─ HubSpot                 │   ├─ Nango sync      │   ├─ Bulk CSV upload │
│   ├─ Stripe                  │   ├─ MCP tool result │   └─ API bulk import │
│   └─ Slack                   │   └─ Custom adapter  │                      │
│          │                   │         │            │         │            │
│          ▼                   │         ▼            │         ▼            │
│   ┌─────────────┐            │   ┌─────────────┐    │   ┌─────────────┐    │
│   │ webhook-    │            │   │ connector-  │    │   │  folder-    │    │
│   │ ingress     │            │   │ sync        │    │   │  watcher    │    │
│   │ (Worker)    │            │   │ (Worker)    │    │   │  (DO)       │    │
│   └──────┬──────┘            │   └──────┬──────┘    │   └──────┬──────┘    │
│          │                   │          │            │          │           │
│          └───────────────────┴──────────┴────────────┴──────────┘           │
│                                    │                                       │
│                                    ▼                                       │
│                            ┌─────────────┐                                 │
│                            │   LOADER    │                                 │
│                            │  (Worker)   │                                 │
│                            │             │                                 │
│                            │ • Nango auth│                                 │
│                            │   webhook   │                                 │
│                            │   handler   │                                 │
│                            │ • Signature │                                 │
│                            │   verify    │                                 │
│                            │ • Creamy    │                                 │
│                            │   trigger   │                                 │
│                            └──────┬──────┘                                 │
│                                   │                                        │
│                                   ▼                                        │
│                         CONNECTOR_SYNC_QUEUE                               │
│                                   │                                        │
│                                   ▼                                        │
│                            ┌─────────────┐                                 │
│                            │  connector  │                                 │
│                            │  -sync      │                                 │
│                            │  (Worker)   │                                 │
│                            │             │                                 │
│                            │ • Adapter   │                                 │
│                            │   selection │                                 │
│                            │ • Credential│                                 │
│                            │   fetch     │                                 │
│                            │ • Raw fetch │                                 │
│                            └──────┬──────┘                                 │
│                                   │                                        │
│                                   ▼                                        │
│                         NORMALIZER_QUEUE                                   │
│                                   │                                        │
│                                   ▼                                        │
│                            ┌─────────────┐                                 │
│                            │  normalizer │                                 │
│                            │  (Worker)   │                                 │
│                            └──────┬──────┘                                 │
│                                   │                                        │
│                                   ▼                                        │
│                         PIPELINE_QUEUE                                     │
│                                   │                                        │
│                                   ▼                                        │
│                            ┌─────────────┐                                 │
│                            │   pipeline  │                                 │
│                            │ (Sole Writer│                                 │
│                            │  to Spine)  │                                 │
│                            └──────┬──────┘                                 │
│                                   │                                        │
│                                   ▼                                        │
│                            ┌─────────────┐                                 │
│                            │   SPINE     │                                 │
│                            │  (D1)       │                                 │
│                            └─────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3.2 Connector Sync Service

```typescript
// services/connector-sync/src/sync.ts

export interface SyncJob {
  id: string;
  tenantId: string;
  connectorId: string; // 'salesforce', 'hubspot', 'slack', ...
  provider: string;
  syncType: "full" | "incremental" | "webhook" | "creamy";
  since: Date; // Last successful sync timestamp
  triggeredBy: "cron" | "webhook" | "manual" | "loader";
  status: "queued" | "running" | "completed" | "failed" | "dlq";
  recordsFetched: number;
  recordsNormalized: number;
  recordsRejected: number;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface SyncAdapter {
  // Fetches raw records from the provider
  fetch(credentials: Credentials, config: ConnectorConfig, since: Date): Promise<RawRecord[]>;

  // Returns the provider's native schema for a resource
  getSchema(resource: string): Promise<ProviderSchema>;

  // Validates that the connector config is healthy
  healthCheck(credentials: Credentials): Promise<HealthStatus>;
}

export async function runSync(job: SyncJob): Promise<SyncResult> {
  // 1. Tenant isolation: verify connector belongs to tenant
  const config = await getConnectorConfig(job.connectorId, job.tenantId);
  if (!config || config.tenantId !== job.tenantId) {
    throw new SyncError("CROSS_TENANT_CONNECTOR", 403);
  }

  // 2. Credential wall: fetch from Nango vault or CF Secrets
  const credentials = await getCredentials(config.provider, job.tenantId);

  // 3. Select sync adapter (swappable — see Adapter Pattern)
  const adapter = selectSyncAdapter(config.provider);

  // 4. Fetch raw records
  const rawRecords = await adapter.fetch(credentials, config, job.since);

  // 5. Rate-limit safety valve
  if (rawRecords.length > MAX_SYNC_BATCH_SIZE) {
    // Chunk and enqueue continuation jobs
    const chunks = chunk(rawRecords, MAX_SYNC_BATCH_SIZE);
    for (const chunk of chunks.slice(1)) {
      await enqueueToConnectorSyncQueue({
        ...job,
        id: generateJobId(),
        continuation: true,
        records: chunk,
      });
    }
  }

  // 6. Enqueue to Normalizer (never direct Pipeline write)
  await enqueueToNormalizerQueue({
    tenantId: job.tenantId,
    provider: config.provider,
    connectorId: job.connectorId,
    records: rawRecords,
    syncJobId: job.id,
    timestamp: Date.now(),
  });

  return { recordsFetched: rawRecords.length, status: "normalized" };
}
```

### 5.3.3 The Loader (Cold-Start & Webhook Trigger)

The `loader` service is the **on-ramp** for new tenants and real-time events.

```typescript
// services/loader/src/index.ts

export interface LoaderEvent {
  type: "auth.created" | "auth.updated" | "webhook.received" | "nango.sync";
  tenantId: string;
  provider: string;
  payload: unknown;
  signature?: string; // Nango webhook signature
  idempotencyKey: string; // Prevent duplicate processing
}

export async function handleLoaderEvent(event: LoaderEvent): Promise<void> {
  // 1. Verify webhook signature (P0 security)
  if (event.signature && !verifyNangoSignature(event.payload, event.signature)) {
    await auditLog({
      tenantId: event.tenantId,
      action: "webhook_rejected",
      via: "loader",
      reason: "bad_signature",
    });
    throw new LoaderError("INVALID_SIGNATURE", 401);
  }

  // 2. Deduplicate via idempotency key
  const seen = await kv.get(`idempotency:${event.idempotencyKey}`);
  if (seen) return;
  await kv.put(`idempotency:${event.idempotencyKey}`, "1", { expirationTtl: 86400 });

  // 3. For auth.created — trigger "creamy" (full) sync immediately
  if (event.type === "auth.created") {
    await updateTenantConnectorStatus(event.tenantId, event.provider, "connected");
    await enqueueToConnectorSyncQueue({
      tenantId: event.tenantId,
      connectorId: event.provider,
      provider: event.provider,
      syncType: "creamy",
      triggeredBy: "loader",
      since: new Date(0), // Full historical sync
    });
    return;
  }

  // 4. For webhook.received — trigger incremental sync
  if (event.type === "webhook.received") {
    await enqueueToConnectorSyncQueue({
      tenantId: event.tenantId,
      connectorId: event.provider,
      provider: event.provider,
      syncType: "incremental",
      triggeredBy: "webhook",
      since: await getLastSyncTime(event.tenantId, event.provider),
    });
    return;
  }
}
```

**Queues involved:**

| Queue                  | Producer                          | Consumer         | Message Type           | Delivery                   |
| ---------------------- | --------------------------------- | ---------------- | ---------------------- | -------------------------- |
| `CONNECTOR_SYNC_QUEUE` | `loader`, cron trigger, manual UI | `connector-sync` | `SyncJob`              | At-least-once              |
| `NORMALIZER_QUEUE`     | `connector-sync`                  | `normalizer`     | `NormalizationBatch`   | At-least-once              |
| `PIPELINE_QUEUE`       | `normalizer`                      | `pipeline`       | `CanonicalEntityBatch` | Exactly-once (idempotency) |

---

## 5.4 Normalizer (8-Stage Pipeline)

The Normalizer transforms **raw provider records** into **canonical Spine entities**. It is the only path from inbound data to the Spine. Every record that enters the Spine has been through all 8 stages.

### 5.4.1 Normalizer Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NORMALIZER PIPELINE (NA0–NA7)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Raw Record ──► Stage 0 ──► Stage 1 ──► Stage 2 ──► Stage 3 ──► Stage 4    │
│                 (NA0)       (NA1)       (NA2)       (NA3)       (NA4)      │
│                 Parse       Trait       Resolve     Resolve     Link        │
│                             Detect      Type        Entity      Relations   │
│                                                                             │
│  Stage 4 ──► Stage 5 ──► Stage 6 ──► Stage 7 ──► PIPELINE_QUEUE             │
│  (NA4)       (NA5)       (NA6)       (NA7)                                 │
│  Enrich      Validate    Emit        DLQ / Retry                            │
│  & Map       Canonical   Canonical                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Stage   | Name           | Function                                                         | Failure Behavior                                  |
| ------- | -------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| **NA0** | Parse          | JSON/CSV/XML → structured object                                 | DLQ + audit log                                   |
| **NA1** | Trait Detect   | Identify entity type from field heuristics                       | Retry ×3 → DLQ                                    |
| **NA2** | Resolve Type   | Map to canonical entity type from Schema Provider                | Retry ×3 → DLQ                                    |
| **NA3** | Resolve Entity | SSOC lookup or mint new stable UUID                              | Retry ×3 → DLQ                                    |
| **NA4** | Link Relations | Traverse foreign keys, infer relationships                       | Log low-confidence, continue                      |
| **NA5** | Enrich & Map   | Apply tenant-specific field mappings, enrich from Knowledge      | Continue (enrichment is optional)                 |
| **NA6** | Validate       | Schema validation against Schema Provider contract               | Reject + audit log (do NOT DLQ schema violations) |
| **NA7** | Emit Canonical | Serialize to `CanonicalEntityBatch`, enqueue to `PIPELINE_QUEUE` | Retry ×5 → DLQ (critical path)                    |

### 5.4.2 Normalizer Interfaces

```typescript
// services/normalizer/src/types.ts

export interface NormalizationBatch {
  id: string;
  tenantId: string;
  provider: string;
  connectorId: string;
  syncJobId: string;
  records: RawRecord[];
  receivedAt: number;
}

export interface CanonicalEntity {
  ssocId: string; // Stable UUID
  tenantId: string;
  entityType: string;
  sourceId: string;
  sourceProvider: string;
  canonicalPayload: Record<string, unknown>;
  traits: Trait[];
  relations: CanonicalRelation[];
  confidence: number; // Overall confidence 0.0–1.0
  provenance: ProvenanceChain;
}

export interface CanonicalRelation {
  targetSsocId: string;
  relationType: string;
  confidence: number;
  provenance: "inferred" | "declared" | "synced";
}

export interface ProvenanceChain {
  syncJobId: string;
  normalizerBatchId: string;
  stages: { stage: string; timestamp: number; status: "ok" | "warn" | "fail" }[];
}

export interface NormalizerState {
  tenantId: string;
  lastProcessedAt: number;
  stageLatencies: Record<string, number>; // p99 per stage
  dlqCount: number;
  backpressure: boolean; // If true, pause ingress
}
```

### 5.4.3 DLQ & Retry Policy

```typescript
// services/normalizer/src/dlq.ts

export const NORMALIZER_RETRY_POLICY: RetryPolicy = {
  maxRetries: 5,
  backoff: "exponential", // 1s, 2s, 4s, 8s, 16s
  maxDelayMs: 30000,
  retryableErrors: ["NETWORK_TIMEOUT", "RATE_LIMITED", "SCHEMA_PROVIDER_UNAVAILABLE"],
  nonRetryableErrors: [
    "SCHEMA_VIOLATION", // Bad data → reject, don't retry
    "CROSS_TENANT_RECORD", // Security violation → reject + alert
    "INVALID_TRAIT", // Data quality issue → reject
  ],
};

export async function handleDLQ(batch: NormalizationBatch, error: NormalizerError): Promise<void> {
  // 1. Write to R2 cold storage for compliance
  await r2.put(`dlq/${batch.tenantId}/${batch.id}.json`, JSON.stringify({ batch, error }));

  // 2. Audit log
  await auditLog({
    tenantId: batch.tenantId,
    action: "normalizer_dlq",
    via: "normalizer",
    payloadHash: hash(batch),
    errorCode: error.code,
  });

  // 3. If cross-tenant, alert security
  if (error.code === "CROSS_TENANT_RECORD") {
    await alertSecurity({
      tenantId: batch.tenantId,
      severity: "critical",
      message: "Cross-tenant data detected in normalizer",
    });
  }
}
```

**Performance SLO:** Normalizer p99 latency < 2s per batch of ≤100 records.

---

## 5.5 Schema Provider

The Schema Provider is a **contractual layer** between the proprietary IntegrateWise mechanism and the tenant-owned context. It defines what entities exist, what fields they carry, and how they map to provider schemas — without exposing the mechanism itself.

### 5.5.1 Schema Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCHEMA PROVIDER ARCHITECTURE                        │
│                                                                             │
│   ┌─────────────────┐                                                       │
│   │  Schema AI      │  (gpt-5-mini, tenant onboarding)                       │
│   │  (think service)│  Hydrates initial schema for new tenants              │
│   └────────┬────────┘                                                       │
│            │ generates                                                      │
│            ▼                                                                │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│   │  Base Schema    │────►│  Tenant Overlay │────►│  Provider Map   │      │
│   │  (IW canonical) │     │  (custom fields)│     │  (SF/HS/Slack)  │      │
│   └─────────────────┘     └─────────────────┘     └─────────────────┘      │
│          │                         │                       │               │
│          └─────────────┬───────────┴───────────────┬───────┘               │
│                        ▼                           ▼                       │
│               ┌─────────────────┐         ┌─────────────────┐              │
│               │  Schema Store   │         │  Schema Store   │              │
│               │  (D1)           │         │  (KV cache)     │              │
│               └─────────────────┘         └─────────────────┘              │
│                                                                             │
│   Ownership Split:                                                          │
│   • Base Schema = IntegrateWise IP (proprietary, not exposed)              │
│   • Tenant Overlay = Customer context (data sovereignty)                   │
│   • Provider Map = Adapter configuration (swappable)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5.2 Schema Interfaces

```typescript
// packages/spine-schema/src/schema/schema-provider.ts

export interface BaseSchema {
  version: string; // Semver
  entityTypes: EntityTypeDef[];
  relationTypes: RelationTypeDef[];
  validationRules: ValidationRule[];
}

export interface EntityTypeDef {
  name: string; // e.g., 'account', 'contact', 'opportunity'
  fields: FieldDef[];
  requiredTraits: string[];
  displayTemplate: string; // e.g., "{{name}} ({{industry}})"
  // IntegrateWise-owned; never exposed to tenant
}

export interface TenantOverlay {
  tenantId: string;
  customFields: CustomFieldDef[];
  fieldMappings: FieldMapping[]; // Map provider field → canonical field
  disabledEntityTypes: string[];
  // Customer-owned; data sovereignty applies
}

export interface ProviderMap {
  provider: string;
  entityMappings: Record<string, string>; // provider type → canonical type
  fieldMappings: Record<string, string>; // provider field → canonical field
  // Swappable; changes when provider changes
}

export interface SchemaProviderAPI {
  // Returns the merged schema (Base + Tenant Overlay) for a tenant
  getTenantSchema(tenantId: string): Promise<MergedSchema>;

  // Returns the provider-specific mapping for a connector
  getProviderMap(tenantId: string, provider: string): Promise<ProviderMap>;

  // Validates a canonical payload against the merged schema
  validate(tenantId: string, entityType: string, payload: unknown): Promise<ValidationResult>;

  // Called by Schema AI on tenant onboarding
  generateInitialSchema(
    tenantId: string,
    industry: string,
    connectedProviders: string[]
  ): Promise<BaseSchema>;
}
```

---

## 5.6 Workspace

The Workspace is the **tenant-scoped container** for all context. It is not a data structure per se; it is a logical boundary enforced by `tenant_id` on every query, every queue message, and every Durable Object ID.

### 5.6.1 Workspace Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WORKSPACE (Tenant-Scoped Boundary)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Workspace = Tenant = Org                                                  │
│                                                                             │
│   ┌─────────────────────────────────────────┐                               │
│   │  Tenant: acme-corp                      │                               │
│   │  ─────────────────────────────────────  │                               │
│   │  • Spine entities (WHERE tenant_id=?)   │                               │
│   │  • Memory (Personal, Work, Org, AI)     │                               │
│   │  • Knowledge (RAG corpus, tenant-scoped)│                               │
│   │  • Governance rules (tenant-specific)   │                               │
│   │  • Audit logs (tenant-scoped)           │                               │
│   │  • Connectors (per-tenant credentials)  │                               │
│   │  • Projections (8 lenses)               │                               │
│   └─────────────────────────────────────────┘                               │
│                                                                             │
│   HARD RULES:                                                               │
│   1. No cross-tenant query ever succeeds.                                   │
│   2. Every Durable Object ID includes tenant_id.                            │
│   3. Every queue message carries tenant_id in the envelope.                 │
│   4. Every JWT claim includes tenant_id.                                    │
│   5. Service bindings propagate tenant_id implicitly.                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.6.2 Workspace Initialization (First Auth Flow)

```typescript
// services/tenants/src/onboarding.ts

export async function initializeWorkspace(
  tenantId: string,
  ownerEmail: string,
  industry: string
): Promise<Workspace> {
  // 1. Create D1 partition (tenant-scoped tables are already isolated by tenant_id)
  //    No physical partition needed — logical isolation via WHERE clause.

  // 2. Generate initial schema via Schema AI
  const baseSchema = await schemaProvider.generateInitialSchema(tenantId, industry, []);

  // 3. Create RBAC roles
  await createRole(tenantId, "owner", OWNER_PERMISSIONS);
  await createRole(tenantId, "tam", TAM_PERMISSIONS);
  await createRole(tenantId, "account_success", CS_PERMISSIONS);

  // 4. Initialize memory tiers
  await continuity.initMemoryForTenant(tenantId);

  // 5. Initialize Knowledge (empty RAG corpus)
  await knowledge.initKnowledgeForTenant(tenantId);

  // 6. Set default governance rules
  await govern.setDefaultRules(tenantId);

  // 7. Audit log
  await auditLog({ tenantId, action: "workspace_initialized", actor: `user:${ownerEmail}` });

  return { tenantId, status: "active", createdAt: new Date() };
}
```

---

## 5.7 Memory (The Continuity Substrate)

Memory is **compounding context**. Every agent turn, every user action, every provider writeback enriches memory. Memory decays if not reinforced. Memory is scoped.

### 5.7.1 Memory Scopes (v2.0 FINAL)

| Scope            | Owner          | Lifetime                     | Access                           |
| ---------------- | -------------- | ---------------------------- | -------------------------------- |
| **Personal**     | Human user     | Session → Active → Archive   | User + their Twin                |
| **Work**         | Task / Project | Duration of task             | Project members + Twin           |
| **Organization** | Tenant         | Permanent (with decay)       | All org members (RBAC-gated)     |
| **AI**           | Twin / Agent   | Ephemeral → Active → Archive | Twin only (reasoning scratchpad) |

_Audit is cross-cutting Compliance, not a memory scope._

### 5.7.2 Memory Tiers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MEMORY LIFECYCLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Intake ──► Classification ──► Validation ──► Promotion ──► Store          │
│      │            │                │              │            │             │
│      │            ▼                │              │            ▼             │
│      │    Confidence Score         │              │      ┌──────────┐        │
│      │    (0.0 – 1.0)              │              │      │  ACTIVE  │        │
│      │                             │              │      │  (D1 +   │        │
│      │            ┌────────────────┘              │      │   KV +   │        │
│      │            ▼                                │      │ Vectorize│        │
│      │    ┌───────────────┐    ≥0.85 ────────────┘      └──────────┘        │
│      └───►│   TRIAGE      │◄────────────────────────────────│               │
│           │  (triage      │                                 │ reinforcement │
│           │   service)    │                                 │ resets clock  │
│           └───────┬───────┘                                 │               │
│                   │                                         ▼               │
│         0.70–0.85 │                                ┌──────────┐             │
│                   └───────────────────────────────►│ STAGING  │             │
│                                                    │  (D1)    │             │
│         <0.70                                      └──────────┘             │
│            │                                          │ 30 days no access   │
│            ▼                                          ▼                     │
│      ┌──────────┐                            ┌──────────┐                   │
│      │  DISCARD │                            │ ARCHIVED │                   │
│      │  (R2     │                            │  (R2)    │                   │
│      │  audit)  │                            │  cold    │                   │
│      └──────────┘                            └──────────┘                   │
│                                                                             │
│   DECAY RULE:                                                               │
│   • Active memory decays after ~30 days of no access or reinforcement.     │
│   • Decay is time-based + access-based.                                     │
│   • Reinforcement (read, update, Twin reference) resets the decay clock.   │
│   • Archived memory can be reactivated by query (with latency penalty).    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.7.3 Memory Interfaces

```typescript
// packages/twin-types/src/memory.ts

export type MemoryScope = "personal" | "work" | "organization" | "ai";

export type MemoryTier = "active" | "staging" | "archived";

export interface MemoryRecord {
  id: string;
  tenantId: string;
  scope: MemoryScope;
  ownerId: string; // user_id for personal, task_id for work, etc.
  tier: MemoryTier;
  content: string; // Text content or serialized JSON
  embedding?: number[]; // Vectorize embedding for semantic retrieval
  confidence: number; // Triage-assigned confidence
  source: string; // 'sync', 'user_action', 'twin_proposal', 'act_writeback'
  ssocReferences: string[]; // SSOC IDs referenced in this memory
  accessCount: number;
  lastAccessedAt?: Date;
  createdAt: Date;
  decayAt?: Date; // When this record will auto-archive
}

export interface MemoryQuery {
  tenantId: string;
  scope?: MemoryScope;
  ownerId?: string;
  semanticQuery?: string; // Natural language query → embedding search
  ssocFilter?: string[]; // Filter to memories referencing these entities
  recencyWeight?: number; // 0.0–1.0, default 0.5
  relevanceWeight?: number; // 0.0–1.0, default 0.5
  limit: number;
}

export interface MemoryStoreAPI {
  // Store a new memory (post-triage)
  store(record: Omit<MemoryRecord, "id">): Promise<MemoryRecord>;

  // Query memories (semantic + keyword hybrid)
  query(q: MemoryQuery): Promise<MemoryRecord[]>;

  // Reinforce (reset decay clock)
  reinforce(memoryId: string): Promise<void>;

  // Decay runner (called by `continuity` service on schedule)
  runDecay(tenantId: string): Promise<{ archived: number; decayed: number }>;

  // Cross-scope promotion (e.g., personal insight → org knowledge)
  promote(
    memoryId: string,
    fromScope: MemoryScope,
    toScope: MemoryScope,
    approvedBy: string
  ): Promise<void>;
}
```

### 5.7.4 Continuity Graph

The Continuity Graph is the **relationship traversal layer** of memory. It answers: "Who/what/when/where is connected to this entity?"

```typescript
// services/continuity/src/graph.ts

export interface ContinuityGraphAPI {
  // Walk the graph from a starting entity
  traverse(
    tenantId: string,
    startSsocId: string,
    options: {
      depth: number; // Max traversal depth (default 3)
      relationTypes?: string[]; // Filter to these relation types
      minConfidence?: number; // Filter edges ≥ this confidence
      direction?: "out" | "in" | "both";
    }
  ): Promise<GraphWalkResult>;

  // Compute "Entity360" — the full context assembly for an entity
  getEntity360(tenantId: string, ssocId: string): Promise<Entity360>;
}

export interface Entity360 {
  entity: CanonicalEntity;
  directRelations: RelatedEntity[];
  indirectRelations: RelatedEntity[];
  recentMemory: MemoryRecord[];
  timeline: TimelineEvent[];
  sentiment?: number; // Computed by intelligence service
  healthScore?: number; // Computed by intelligence service
}
```

---

## 5.8 Knowledge (RAG & Semantic Search)

Knowledge is the **document and semantic retrieval layer**. It stores tenant-specific documents (SOPs, contracts, playbooks), indexes them via Vectorize, and serves them to the Twin during Context Assembly.

### 5.8.1 Knowledge Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE ARCHITECTURE (RAG)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Documents ──► Chunking ──► Embedding ──► Vectorize ──► Retrieval          │
│      │            │            │             │              │               │
│      │            │            │             │              ▼               │
│      │            │            │             │      ┌───────────────┐       │
│      │            │            │             │      │  AI Search    │       │
│      │            │            │             │      │  (semantic)   │       │
│      │            │            │             │      └───────────────┘       │
│      │            │            │             │              │               │
│      ▼            ▼            ▼             ▼              ▼               │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌───────────────┐       │
│   │  R2    │  │Chunking│  │Embedding│  │Vectorize│  │  Context     │       │
│   │(blobs) │  │(think) │  │(think) │  │(index) │  │  Assembly    │       │
│   └────────┘  └────────┘  └────────┘  └────────┘  └───────────────┘       │
│                                                                             │
│   Chunking Strategy:                                                        │
│   • Semantic chunking (sentence boundaries) for prose                       │
│   • Structural chunking (headers) for docs/SOPs                             │
│   • Sliding window with 20% overlap for code/markdown                       │
│                                                                             │
│   Embedding: gpt-5-mini via OpenRouter (default) or tenant-configured       │
│                                                                             │
│   Retrieval: Hybrid (keyword AI Search + semantic Vectorize)                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.8.2 Knowledge Interfaces

```typescript
// services/knowledge/src/types.ts

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
  metadata: {
    heading?: string;
    pageNumber?: number;
  };
}

export interface KnowledgeQuery {
  tenantId: string;
  query: string; // Natural language
  filters?: {
    source?: string[];
    createdAfter?: Date;
    createdBy?: string;
  };
  topK: number; // Number of chunks to return
  minScore?: number; // Minimum relevance score
}

export interface KnowledgeAPI {
  ingest(doc: Omit<KnowledgeDocument, "id" | "chunks">): Promise<KnowledgeDocument>;
  query(q: KnowledgeQuery): Promise<KnowledgeChunk[]>;
  reindex(tenantId: string, documentId: string): Promise<void>;
  delete(tenantId: string, documentId: string): Promise<void>;
}
```

---

## 5.9 Governance (The Airlock)

Governance is the **approval and confidence-scoring layer** that sits between reasoning (Twin) and execution (Act). It enforces the 0.70/0.85 confidence law. It runs the HITL orchestrator. It maintains the audit trail for every decision.

### 5.9.1 The 0.70 / 0.85 Confidence Law

This law governs **two triage gates** that run on the same thresholds but for different purposes.

#### Gate 1: Governance Triage (Execution Gate)

| Confidence      | Action           | Destination                | Human Touch                | Audit                                  |
| --------------- | ---------------- | -------------------------- | -------------------------- | -------------------------------------- |
| **≥ 0.85**      | Auto-approve     | `ACT_QUEUE`                | None                       | `governance_audit_log` (auto-approved) |
| **0.70 – 0.85** | Queue for review | **My Desk** (owner review) | Approve / Modify / Dismiss | `governance_audit_log` (pending)       |
| **< 0.70**      | Discard          | —                          | None                       | `governance_audit_log` (discarded)     |

#### Gate 2: Memory Triage (Knowledge Gate)

| Confidence      | Action       | Destination     | Where                              |
| --------------- | ------------ | --------------- | ---------------------------------- |
| **≥ 0.85**      | Auto-promote | Active memory   | `continuity` (D1 + KV + Vectorize) |
| **0.70 – 0.85** | Staging      | Staging memory  | `continuity` (D1 only)             |
| **< 0.70**      | Discard      | R2 cold storage | `continuity` (compliance/audit)    |

**Rule:** Even Customer-Zero cannot bypass hard approval-expiry gates. Proposals in My Desk expire after 72 hours if not reviewed.

### 5.9.2 Governance Rules Engine

```typescript
// services/govern/src/rules.ts

export interface GovernanceRule {
  id: string;
  tenantId: string;
  name: string;
  scope: "global" | "capability" | "provider" | "entity";
  target: string; // e.g., 'salesforce.opportunity.update' or 'account'
  condition: RuleCondition;
  action: "auto_approve" | "require_approval" | "block" | "escalate";
  confidenceOverride?: number; // Override the default 0.70/0.85 for this rule
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface RuleCondition {
  type: "confidence_threshold" | "field_match" | "role_based" | "time_based" | "composite";
  config: Record<string, unknown>;
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
  // Score a proposal and return the governance decision
  evaluate(proposal: ActionProposal): Promise<GovernanceDecision>;

  // Create/update/delete rules (admin only)
  setRule(rule: GovernanceRule): Promise<void>;
  deleteRule(tenantId: string, ruleId: string): Promise<void>;

  // Query pending proposals for My Desk
  getPendingProposals(tenantId: string, userId: string): Promise<ActionProposal[]>;

  // Approve/reject/dismiss a pending proposal
  resolveProposal(
    proposalId: string,
    resolution: "approve" | "reject" | "modify",
    resolverId: string,
    modifiedPayload?: unknown
  ): Promise<void>;
}
```

### 5.9.3 HITL Orchestrator (Human-in-the-Loop)

The HITL orchestrator manages the **My Desk** approval interface. It is implemented as a Durable Object per `tenant_id + user_id` — never global.

```typescript
// services/govern/src/hitl-do.ts

export class HITLOrchestrator implements DurableObject {
  private state: DurableObjectState;
  private tenantId: string;
  private userId: string;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    // CRITICAL: DO ID must be idFromName(tenant_id + user_id), NEVER "global"
    const id = state.id.toString();
    // Extract tenant_id and user_id from the ID (or from storage init)
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/proposals") {
      return this.listProposals();
    }
    if (path === "/proposals/:id/approve") {
      return this.approveProposal(url.searchParams.get("id")!);
    }
    if (path === "/proposals/:id/reject") {
      return this.rejectProposal(url.searchParams.get("id")!);
    }
    if (path === "/proposals/:id/modify") {
      return this.modifyProposal(url.searchParams.get("id")!, await request.json());
    }

    return new Response("Not Found", { status: 404 });
  }

  async queueProposal(proposal: ActionProposal): Promise<void> {
    // 1. Store in DO state
    await this.state.storage.put(`proposal:${proposal.id}`, {
      ...proposal,
      status: "pending",
      queuedAt: Date.now(),
    });

    // 2. Set alarm for expiry (72 hours)
    await this.state.storage.setAlarm(Date.now() + 72 * 60 * 60 * 1000);

    // 3. Notify user (SSE push, email, or Slack — configured per tenant)
    await notifyUser(this.tenantId, this.userId, {
      type: "proposal_queued",
      proposalId: proposal.id,
      summary: proposal.summary,
    });
  }

  async alarm(): Promise<void> {
    // Expire old proposals
    const proposals = await this.state.storage.list<ActionProposal>({ prefix: "proposal:" });
    const now = Date.now();
    for (const [key, proposal] of proposals) {
      if (proposal.status === "pending" && now - proposal.queuedAt > 72 * 60 * 60 * 1000) {
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

### 5.9.4 Governance Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE FLOW (Decide → Act)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────┐                                                         │
│   │  Twin/Agent   │                                                         │
│   │  (Reasoning)  │                                                         │
│   └───────┬───────┘                                                         │
│           │ ActionProposal                                                  │
│           ▼                                                                 │
│   ┌───────────────┐     ┌─────────────────────────────────────────────┐    │
│   │    GOVERN     │────►│  Confidence Score (0.0 – 1.0)               │    │
│   │  (govern      │     │  • Twin reasoning quality                     │    │
│   │   service)    │     │  • Historical success rate                    │    │
│   │               │     │  • Rule match severity                        │    │
│   │  Rules Engine │     │  • Data freshness                             │    │
│   │  + HITL DO    │     └─────────────────────────────────────────────┘    │
│   └───────┬───────┘                                                         │
│           │                                                                 │
│     ┌─────┼─────┐                                                           │
│     │     │     │                                                           │
│     ▼     ▼     ▼                                                           │
│  ┌────┐ ┌────┐ ┌────┐                                                       │
│  │≥0.85│ │0.70│ │<0.70│                                                      │
│  │     │ │–   │ │      │                                                      │
│  │AUTO │ │0.85│ │DIS-  │                                                      │
│  │APPROVE│ │    │ │CARD  │                                                      │
│  └──┬──┘ └──┬─┘ └────┘                                                       │
│     │       │                                                               │
│     ▼       ▼                                                               │
│  ┌──────┐ ┌──────────┐                                                      │
│  │ ACT  │ │ MY DESK  │                                                      │
│  │QUEUE │ │(HITL DO) │                                                      │
│  │      │ │          │                                                      │
│  │ act  │ │ User     │                                                      │
│  │service│ │ reviews  │                                                      │
│  └──────┘ │ Approve  │                                                      │
│           │ Modify   │                                                      │
│           │ Dismiss  │                                                      │
│           └────┬─────┘                                                      │
│                │                                                            │
│                ▼ (on approve)                                               │
│           ┌──────────┐                                                      │
│           │  ACT     │                                                      │
│           │  QUEUE   │                                                      │
│           └──────────┘                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.10 Audit & Compliance

Audit is **immutable, fail-loud, and cross-cutting**. Compliance is enforced by the audit trail, tenant isolation, and data retention policies.

### 5.10.1 Audit Tables

| Table                  | What It Logs                                       | Failure Behavior               | Retention                  |
| ---------------------- | -------------------------------------------------- | ------------------------------ | -------------------------- |
| `audit_logs`           | Generic platform events                            | Write failure → halt operation | 90 days (R2 archive after) |
| `governance_audit_log` | Approval decisions (approve/reject/discard/expire) | Write failure → halt proposal  | 7 years                    |
| `spine_audit_log`      | Entity changes, MCP access, reads, writes          | Write failure → halt sync      | 7 years                    |
| `twin_audit_events`    | Reasoning trace, model calls, confidence scores    | Write failure → halt proposal  | 90 days                    |
| `outbound_mcp_calls`   | Provider calls, latency, errors                    | Write failure → circuit break  | 90 days                    |
| `normalizer_dlq`       | Rejected records with error context                | Write failure → alert          | 7 years                    |

### 5.10.2 Audit Interface

```typescript
// packages/lib/src/audit.ts

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
  // Compliance fields
  gdprCategory?: "personal_data" | "sensitive_data" | "anonymized";
  dataSubjectId?: string; // For GDPR subject access requests
  retentionPolicy: "standard" | "extended" | "permanent";
}

export interface AuditAPI {
  // Append-only write
  log(event: Omit<AuditEvent, "id" | "timestamp">): Promise<void>;

  // Query (tenant-scoped, time-bounded)
  query(tenantId: string, since: Date, until: Date, filters?: AuditFilter): Promise<AuditEvent[]>;

  // Export for compliance (GDPR Right to Access, SOC2)
  export(tenantId: string, format: "json" | "csv"): Promise<ReadableStream>;

  // GDPR Right to Erasure (anonymize, do NOT delete — audit must remain)
  anonymize(tenantId: string, dataSubjectId: string): Promise<void>;
}

// CRITICAL: Audit write failure stops the operation
export async function auditLog(event: Omit<AuditEvent, "id" | "timestamp">): Promise<void> {
  const fullEvent: AuditEvent = {
    ...event,
    id: generateUlid(),
    timestamp: new Date(),
  };

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

### 5.10.3 Compliance Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       COMPLIANCE BOUNDARIES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  TENANT ISOLATION                                                   │   │
│   │  • Every query: WHERE tenant_id = ?                                 │   │
│   │  • Cross-tenant access: 403 (fail-loud, not 404)                   │   │
│   │  • Nango credentials: connectionId = tenant_id, encrypted vault    │   │
│   │  • Durable Objects: idFromName(tenant_id + suffix)                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  DATA RESIDENCY                                                     │   │
│   │  • Default: Cloudflare data centers (global edge)                   │   │
│   │  • Enterprise: Pin to specific jurisdictions (EU, US, AU)           │   │
│   │  • R2 buckets: Region-pinned per tenant config                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  ENCRYPTION                                                         │   │
│   │  • At-rest: D1 encrypted by Cloudflare                              │   │
│   │  • In-transit: TLS 1.3 (Cloudflare proxy)                           │   │
│   │  • Credentials: Cloudflare Secrets (never in code/env)              │   │
│   │  • PII in memory: Hashed or tokenized where possible                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  RETENTION                                                          │   │
│   │  • Active memory: 30 days (with reinforcement reset)                │   │
│   │  • Audit logs: 7 years (compliance)                                 │   │
│   │  • Spine history: Permanent (soft-delete only)                      │   │
│   │  • R2 cold storage: Configurable per tenant plan                    │   │
│   │  • GDPR erasure: Anonymize audit subjects; keep audit trail         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  ACCESS LOGGING                                                     │   │
│   │  • Every MCP invocation: logged to spine_audit_log with via:mcp     │   │
│   │  • Every governance decision: logged to governance_audit_log        │   │
│   │  • Every sync: logged with record counts, latency, errors           │   │
│   │  • Every Twin reasoning: logged with model, prompt hash, output     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.11 Security Boundaries

### 5.11.1 Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SECURITY ZONES (Continuity + Governance)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ZONE 0: UNTRUSTED                                                   │    │
│  │  • External providers (Salesforce, HubSpot, Slack)                  │    │
│  │  • AI assistants (ChatGPT, Claude) — via MCP inbound                │    │
│  │  • User browsers — via Gateway                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ZONE 1: INGRESS (Gateway, webhook-ingress, MCP inbound)            │    │
│  │  • JWT validation                                                   │    │
│  │  • tenant_id extraction from JWT claim (never from payload)         │    │
│  │  • Rate limiting                                                    │    │
│  │  • CORS whitelist                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ZONE 2: CONTINUITY KERNEL (This domain)                            │    │
│  │  • Spine (D1) — writer-guarded                                      │    │
│  │  • Memory (D1 + KV + Vectorize) — tenant-scoped                     │    │
│  │  • Knowledge (R2 + Vectorize) — tenant-scoped                       │    │
│  │  • Governance (D1 + DO) — HITL per-tenant+user                      │    │
│  │  • Audit (D1 + R2) — append-only                                    │    │
│  │                                                                     │    │
│  │  RULE: No service in Zone 2 calls Zone 0 directly.                  │    │
│  │  All outbound calls go through Zone 3 (Provider Fabric).            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ZONE 3: PROVIDER FABRIC                                            │    │
│  │  • Act service + outbound adapters (Nango, MCP, Native)             │    │
│  │  • Credential wall (Cloudflare Secrets / Nango vault)               │    │
│  │  • Circuit breakers                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ZONE 4: EXTERNAL PROVIDERS                                         │    │
│  │  • Salesforce, HubSpot, Slack, GitHub, Stripe, Notion, ...          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.11.2 P0 Security Checklist (Continuity + Governance)

| #   | Control                           | Implementation                                                              | Owner        |
| --- | --------------------------------- | --------------------------------------------------------------------------- | ------------ |
| 1   | Cross-tenant query enforcement    | `withTenant(query, tenantId)` in `packages/spine-schema`                    | ALL          |
| 2   | Spine write isolation             | `pipeline` is the only writer; `db-gate` rejects writes from other services | `pipeline`   |
| 3   | HITL DO isolation                 | `idFromName(tenant_id + user_id)` — never global                            | `govern`     |
| 4   | Memory scope enforcement          | `continuity` service validates scope on every read/write                    | `continuity` |
| 5   | Audit tamper resistance           | Append-only D1 table; no UPDATE or DELETE privileges                        | `pipeline`   |
| 6   | Normalizer cross-tenant detection | Reject + alert if `tenant_id` in record mismatches batch                    | `normalizer` |
| 7   | Knowledge tenant isolation        | Vectorize index filtered by `tenant_id` at query time                       | `knowledge`  |
| 8   | Governance rule integrity         | Rules are tenant-scoped; no global rules that affect all tenants            | `govern`     |

---

## 5.12 Integration Points with Adjacent Layers

### 5.12.1 North-Bound (Capability Layer)

| From                | To             | Interface                      | Data                                    |
| ------------------- | -------------- | ------------------------------ | --------------------------------------- |
| `twin-orchestrator` | `govern`       | Service binding `GOVERN`       | `ActionProposal`                        |
| `intelligence`      | `continuity`   | Service binding `CONTINUITY`   | `MemoryQuery` → `MemoryRecord[]`        |
| `knowledge`         | `intelligence` | Service binding `INTELLIGENCE` | `KnowledgeChunk[]` for Context Assembly |
| `l2`                | `pipeline`     | Service binding `PIPELINE`     | `ProjectionBatch` for Spine write       |
| `store`             | `pipeline`     | Service binding `PIPELINE`     | `EntityCRUD` operations                 |

### 5.12.2 South-Bound (Provider Fabric)

| From             | To           | Interface                | Data                          |
| ---------------- | ------------ | ------------------------ | ----------------------------- |
| `govern`         | `hermes`     | Queue `ACT_QUEUE`        | `ApprovedAction`              |
| `hermes`         | `act`        | Service binding `ACT`    | `ExecutionJob`                |
| `act`            | `pipeline`   | Queue `PIPELINE_QUEUE`   | `ExecutionResult` (writeback) |
| `connector-sync` | `normalizer` | Queue `NORMALIZER_QUEUE` | `RawRecord[]`                 |
| `normalizer`     | `pipeline`   | Queue `PIPELINE_QUEUE`   | `CanonicalEntity[]`           |

### 5.12.3 Cross-Cutting (All Layers)

| Service     | Integration                        | Purpose                                          |
| ----------- | ---------------------------------- | ------------------------------------------------ |
| `telemetry` | All 26 services                    | Metrics, traces, logs via Workers Analytics      |
| `billing`   | `govern`, `pipeline`, `continuity` | Usage metering for actions, storage, model calls |
| `admin`     | `govern`, `tenants`                | Override governance rules, workspace management  |

---

## 5.13 Service Topology for This Domain

The Continuity + Governance domain is implemented across **9 of the 26 services**:

| Service             | Tier   | Role in This Domain                            | Binding             |
| ------------------- | ------ | ---------------------------------------------- | ------------------- |
| `pipeline`          | Tier 2 | **Sole Spine writer**; audit log writer        | `PIPELINE`          |
| `normalizer`        | Tier 1 | 8-stage NA0–NA7 pipeline                       | `NORMALIZER`        |
| `connector-sync`    | Tier 1 | Sync orchestration; inbound adapters           | `CONNECTOR_SYNC`    |
| `loader`            | Tier 1 | Cold-start; Nango webhook handler              | `LOADER`            |
| `continuity`        | Tier 4 | Memory consolidation + decay                   | `CONTINUITY`        |
| `knowledge`         | Tier 2 | RAG, semantic search, document indexing        | `KNOWLEDGE`         |
| `govern`            | Tier 2 | Governance rules; approval gates; HITL DO      | `GOVERN`            |
| `intelligence`      | Tier 2 | Context Assembly; Entity360                    | `INTELLIGENCE`      |
| `twin-orchestrator` | Tier 2 | Persistent per-user reasoning (Durable Object) | `TWIN_ORCHESTRATOR` |

---

## 5.14 Key Invariants

1. **Pipeline is the only writer.** No service other than `pipeline` may `INSERT`, `UPDATE`, or `DELETE` from `entities` or `relationships`.
2. **Every hop carries `tenant_id`.** From Gateway → service binding → queue → D1 → Durable Object. No exception.
3. **Cross-tenant access is 403, not 404.** Fail-loud. Alert security.
4. **Audit write failure halts the operation.** No silent drops.
5. **HITL DO is per-tenant+user.** Never global. Never shared.
6. **Memory decays.** Active memory has a ~30-day half-life without reinforcement.
7. **The 0.70/0.85 law is invariant.** No tenant, not even Customer-Zero, can bypass governance thresholds.
8. **Spine history is permanent.** Soft-delete only. `archivedAt` is set; the row remains.
9. **The Twin is ambient.** It is not a service boundary; it is a reasoning quality that runs through `intelligence`, `continuity`, and `knowledge`.
10. **Ecosystem is the capability fabric.** Knowledge sharing, tool-to-tool communication, and agent communication happen through the Spine and Memory — never peer-to-peer.

---

## 5.15 Glossary

| Term                | Definition                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **Spine**           | The directed property graph of all canonical entities and relationships. The single source of context. |
| **SSOC**            | Stable Source-Object Correlation. A UUID that survives provider swaps.                                 |
| **Normalizer**      | The 8-stage pipeline that transforms raw provider records into canonical Spine entities.               |
| **Creamy Sync**     | A full historical sync triggered on first auth (as opposed to incremental).                            |
| **My Desk**         | The human approval interface for proposals in the 0.70–0.85 confidence band.                           |
| **HITL**            | Human-in-the-Loop. The orchestration of human approval within automated workflows.                     |
| **Triage**          | The confidence-scoring and routing logic for both execution and memory.                                |
| **Entity360**       | The assembled context for a single entity: its properties, relations, memory, and timeline.            |
| **OODA**            | Observe → Orient → Decide → Act. The decision cycle that runs across Capability and Continuity.        |
| **Provider Fabric** | The swappable layer of external SaaS providers, APIs, and runtimes.                                    |

---

_End of §5 — Continuity Layer & Governance. This section is a Stage 1/2 deep-dive for the IntegrateWise Continuity Bridge v2.0 Canonical Architecture. It will be merged into the final canonical document after review._
