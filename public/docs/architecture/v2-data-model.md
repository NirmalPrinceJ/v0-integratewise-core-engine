# Data Model and Entity Relationships — IntegrateWise Continuity Bridge v2.0

**Domain:** Data Model, Entity Relationships, Spine Schema, Memory Schema, Tenant Schema, Governance Schema, D1 Table Definitions  
**Version:** 2.0.0  
**Date:** 2026-07-02  
**Status:** STAGE 1/2 DEEP-DIVE — Feeds Canonical Architecture Document  
**Platform Layer:** Continuity Kernel (Layers 4–6)  
**Data Plane:** D1 (Cloudflare) primary relational store; KV (cache/session); Vectorize (embeddings); R2 (cold audit)  
**Authoring Principle:** Pipeline is the only writer. Every query carries `WHERE tenant_id = ?`. Audit write failure halts the operation.

---

## Table of Contents

1. [Overview & Design Philosophy](#1-overview--design-philosophy)
2. [Spine Schema — The Adaptive Spine](#2-spine-schema--the-adaptive-spine)
3. [Memory Schema — Active / Staging / Archived](#3-memory-schema--active--staging--archived)
4. [Tenant Schema — Multi-Tenancy & RBAC](#4-tenant-schema--multi-tenancy--rbac)
5. [Governance Schema — Audit, Proposals, Confidence Gates](#5-governance-schema--audit-proposals-confidence-gates)
6. [Entity Relationship Diagram](#6-entity-relationship-diagram)
7. [D1 Table Definitions (Drizzle ORM)](#7-d1-table-definitions-drizzle-orm)
8. [TypeScript Interfaces & Contracts](#8-typescript-interfaces--contracts)
9. [Flow Descriptions — Services, Queues, Boundaries](#9-flow-descriptions--services-queues-boundaries)
10. [Security Boundary Annotations](#10-security-boundary-annotations)
11. [Integration Points with Adjacent Layers](#11-integration-points-with-adjacent-layers)
12. [Appendix: SSOC Resolution & Lineage](#12-appendix-ssoc-resolution--lineage)

---

## 1. Overview & Design Philosophy

The Data Model of the IntegrateWise Continuity Bridge is not a passive storage layer. It is the **living substrate** of organizational context — the Continuity Kernel that preserves identity, memory, governance, and execution state across all tools, humans, and AI agents. The model is organized into four primary schemas, each with a distinct trust boundary, lifecycle, and access pattern.

### The Four Schemas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTINUITY KERNEL — DATA PLANE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   SPINE     │  │   MEMORY    │  │   TENANT    │  │     GOVERNANCE      │  │
│  │  (Layer 6)  │  │  (Layer 8)  │  │  (Layer 0)  │  │    (Layer 10)       │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────────────┤  │
│  │ entities    │  │ active      │  │ tenants     │  │ action_proposals    │  │
│  │ relationships│ │ staging     │  │ rbac_roles  │  │ governance_audit_log│  │
│  │ spine_audit │  │ archived    │  │ users       │  │ approval_tokens     │  │
│  │ entity_types│  │ decay_log   │  │ connectors  │  │ policy_registry     │  │
│  │ ssoc_index  │  │ memory_graph│  │ plans       │  │ hitl_sessions       │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         ▲                ▲               ▲                  ▲               │
│         └────────────────┴───────────────┴──────────────────┘               │
│                         SINGLE PIPELINE WRITER                              │
│              (pipeline service — only service with D1 INSERT/UPDATE)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Invariants

| #   | Invariant                                     | Enforcement                                                                                                                                         |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Pipeline is the only writer**               | All INSERT/UPDATE/DELETE to Spine tables route through `iw-pipeline` service binding. Read replicas may be served by `store`, `l2`, `intelligence`. |
| 2   | **Every query carries `WHERE tenant_id = ?`** | Drizzle ORM `withTenant()` helper injects tenant filter on every query. Cross-tenant = 403 fail-loud.                                               |
| 3   | **Audit write failure halts operation**       | If `spine_audit_log` or `governance_audit_log` write fails, the triggering operation is rolled back. No silent drops.                               |
| 4   | **SSOC is the identity anchor**               | Every entity resolves to a Stable Single Object Canonical UUID. Provider-native IDs are foreign keys, not primary keys.                             |
| 5   | **Memory is scoped and tiered**               | Four scopes (Personal, Work, Organization, AI) × three tiers (active, staging, archived) × decay rules.                                             |
| 6   | **Governance is schema-native**               | Approval states, confidence scores, and HITL sessions are first-class columns — not application-layer concerns.                                     |

---

## 2. Spine Schema — The Adaptive Spine

The Spine is the canonical context graph. It is not an event log — it is a **living graph of entities, relationships, and their evolution over time**. Every signal from every provider, every action taken by every agent, and every governance decision writes back to the Spine.

### 2.1 Spine Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         ADAPTIVE SPINE (Layer 6)                            │
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │  ENTITY     │◄────┤ RELATIONSHIP│────►│   ENTITY    │                  │
│   │   TABLE     │     │   TABLE     │     │   TABLE     │                  │
│   │             │     │             │     │             │                  │
│   │ entity_id   │     │ rel_id      │     │ entity_id   │                  │
│   │ ssoc_uuid   │◄────┤ source_id   │     │ ssoc_uuid   │                  │
│   │ tenant_id   │     │ target_id   │────►│ tenant_id   │                  │
│   │ entity_type │     │ rel_type    │     │ entity_type │                  │
│   │ provider_id │     │ confidence  │     │ provider_id │                  │
│   │ traits (JSON)│    │ metadata    │     │ traits (JSON)│                  │
│   │ version     │     │ version     │     │ version     │                  │
│   │ lineage_id  │     │ lineage_id  │     │ lineage_id  │                  │
│   └─────────────┘     └─────────────┘     └─────────────┘                  │
│          ▲                   ▲                   ▲                          │
│          └───────────────────┴───────────────────┘                          │
│                        CONTINUITY GRAPH                                     │
│          (traversed by intelligence, twin, continuity services)             │
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │ ENTITY_TYPE │     │  SSOC_INDEX │     │SPINE_AUDIT  │                  │
│   │   TABLE     │     │   TABLE     │     │    LOG      │                  │
│   │             │     │             │     │             │                  │
│   │ type_id     │     │ ssoc_uuid   │     │ audit_id    │                  │
│   │ tenant_id   │     │ tenant_id   │     │ tenant_id   │                  │
│   │ schema_def  │     │ provider_ids│     │ entity_id   │                  │
│   │ lenses      │     │ (JSON map)  │     │ action_type │                  │
│   │ trait_rules │     │ canonical   │     │ actor       │                  │
│   │             │     │ entity_id   │     │ timestamp   │                  │
│   └─────────────┘     └─────────────┘     │ payload_hash│                  │
│                                           └─────────────┘                  │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Entity Table — The Canonical Object Store

The `entities` table stores every canonical object in the system. It is **not** provider-specific — a Salesforce Account and a HubSpot Company both resolve to `entity_type = 'organization'` with distinct `provider_id` entries. The SSOC UUID is the cross-provider identity anchor.

| Column             | Type                  | Constraints                                     | Description                                                                                        |
| ------------------ | --------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `entity_id`        | `TEXT`                | PRIMARY KEY                                     | CUID2 — internal row identifier                                                                    |
| `ssoc_uuid`        | `TEXT`                | NOT NULL, UNIQUE per tenant                     | Stable Single Object Canonical UUID — survives provider swaps                                      |
| `tenant_id`        | `TEXT`                | NOT NULL, FK → tenants                          | Hard isolation boundary                                                                            |
| `entity_type`      | `TEXT`                | NOT NULL, FK → entity_types                     | Canonical type: `organization`, `contact`, `deal`, `task`, `document`, `event`, `metric`, `intent` |
| `provider`         | `TEXT`                | NOT NULL                                        | Source provider: `salesforce`, `hubspot`, `slack`, `stripe`, `linear`, `manual`                    |
| `provider_id`      | `TEXT`                | NOT NULL, composite unique with provider+tenant | Native ID in provider system                                                                       |
| `display_name`     | `TEXT`                |                                                 | Human-readable label                                                                               |
| `traits`           | `TEXT` (JSON)         | NOT NULL                                        | Normalized key-value traits — see §2.5                                                             |
| `raw_payload`      | `TEXT` (JSON)         |                                                 | Original provider payload (for lineage/debug)                                                      |
| `confidence_score` | `REAL`                | DEFAULT 1.0                                     | TriageBot confidence at time of creation                                                           |
| `version`          | `INTEGER`             | DEFAULT 1                                       | Optimistic locking / MVCC                                                                          |
| `lineage_id`       | `TEXT`                | FK → lineage_records                            | Provenance — which sync/normalizer run created this                                                |
| `created_at`       | `INTEGER` (timestamp) |                                                 | Unix ms                                                                                            |
| `updated_at`       | `INTEGER` (timestamp) |                                                 | Unix ms                                                                                            |
| `archived_at`      | `INTEGER` (timestamp) | NULLABLE                                        | Soft delete / archive                                                                              |

**Composite Indexes:**

- `idx_entities_tenant_type` → `(tenant_id, entity_type)` — projection queries
- `idx_entities_ssoc` → `(tenant_id, ssoc_uuid)` — cross-provider resolution
- `idx_entities_provider` → `(tenant_id, provider, provider_id)` — writeback lookups
- `idx_entities_confidence` → `(tenant_id, confidence_score)` — triage filtering
- `idx_entities_lineage` → `(tenant_id, lineage_id)` — audit/replay

### 2.3 Relationship Table — The Continuity Graph

The `relationships` table is the graph edge store. It enables the Continuity Graph traversal that powers Entity360, Twin reasoning, and Context Assembly.

| Column        | Type          | Constraints                       | Description                                                                                                      |
| ------------- | ------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `rel_id`      | `TEXT`        | PRIMARY KEY                       | CUID2                                                                                                            |
| `tenant_id`   | `TEXT`        | NOT NULL                          | Hard isolation                                                                                                   |
| `source_id`   | `TEXT`        | NOT NULL, FK → entities.ssoc_uuid | Graph edge origin                                                                                                |
| `target_id`   | `TEXT`        | NOT NULL, FK → entities.ssoc_uuid | Graph edge destination                                                                                           |
| `rel_type`    | `TEXT`        | NOT NULL                          | `belongs_to`, `manages`, `participated_in`, `authored`, `referenced_by`, `depends_on`, `triggered`, `blocked_by` |
| `direction`   | `TEXT`        | DEFAULT 'directed'                | `directed`, `bidirectional`                                                                                      |
| `confidence`  | `REAL`        | DEFAULT 1.0                       | Relationship certainty (0.0–1.0)                                                                                 |
| `metadata`    | `TEXT` (JSON) |                                   | Edge properties: `strength`, `recency`, `source_context`                                                         |
| `valid_from`  | `INTEGER`     |                                   | Temporal validity start                                                                                          |
| `valid_until` | `INTEGER`     | NULLABLE                          | Temporal validity end (NULL = permanent)                                                                         |
| `version`     | `INTEGER`     | DEFAULT 1                         | MVCC                                                                                                             |
| `lineage_id`  | `TEXT`        | FK → lineage_records              | Provenance                                                                                                       |
| `created_at`  | `INTEGER`     |                                   | Unix ms                                                                                                          |

**Composite Indexes:**

- `idx_rels_tenant_source` → `(tenant_id, source_id, rel_type)` — outbound traversal
- `idx_rels_tenant_target` → `(tenant_id, target_id, rel_type)` — inbound traversal
- `idx_rels_confidence` → `(tenant_id, confidence)` — weak link pruning
- `idx_rels_temporal` → `(tenant_id, valid_from, valid_until)` — time-travel queries

### 2.4 Entity Type Registry

The `entity_types` table defines the canonical type system. Types are tenant-extensible — each tenant may define custom types, but the platform provides a core taxonomy.

**Core Type Taxonomy (Platform-Provided):**

| Type           | Description          | Default Traits                                      | Typical Providers                |
| -------------- | -------------------- | --------------------------------------------------- | -------------------------------- |
| `organization` | Company/Account      | name, domain, industry, size, revenue, health_score | Salesforce, HubSpot, Stripe      |
| `contact`      | Person               | email, phone, title, department, timezone           | Salesforce, HubSpot, Slack       |
| `deal`         | Opportunity/Pipeline | amount, stage, probability, close_date, arr         | Salesforce, HubSpot, Stripe      |
| `task`         | Action item          | title, status, due_date, priority, assignee         | Salesforce, Linear, Asana        |
| `document`     | File/Content         | title, mime_type, url, extracted_text               | Notion, Google Drive, Confluence |
| `event`        | Calendar/Log         | start_time, end_time, attendees, outcome            | Google Calendar, Salesforce      |
| `metric`       | KPI/Measurement      | value, unit, period, target, trend                  | Stripe, Mixpanel, Custom         |
| `intent`       | User/AI Intent       | action, target_entity, urgency, context             | Twin, MCP, Manual                |
| `workspace`    | Tenant sub-space     | name, lens, department, settings                    | Platform                         |
| `capability`   | Named action         | name, input_schema, output_schema, tier             | Platform                         |

### 2.5 Traits Schema — Normalized Entity Payload

Traits are the **canonical data layer** — provider-specific schemas are normalized into a common key-value structure. This is what makes the Spine provider-agnostic.

```typescript
// Core trait structure (stored as JSON in entities.traits)
interface EntityTraits {
  // Identity
  name: string;
  description?: string;
  slug?: string;

  // Classification
  labels?: string[];
  tags?: string[];
  category?: string;

  // State
  status: "active" | "inactive" | "archived" | "pending" | "blocked";
  stage?: string; // pipeline stage, maturity, etc.
  priority?: "low" | "medium" | "high" | "critical";

  // Quantitative
  value?: number;
  currency?: string;
  count?: number;
  percentage?: number;

  // Temporal
  created_at: number; // unix ms
  updated_at: number;
  due_date?: number;
  expires_at?: number;

  // Relationships (denormalized for fast lookup)
  owner_id?: string; // SSOC of owner contact
  parent_id?: string; // SSOC of parent entity
  related_ids?: string[]; // SSOCs of related entities

  // Provider-specific (namespaced)
  _salesforce?: Record<string, unknown>;
  _hubspot?: Record<string, unknown>;
  _stripe?: Record<string, unknown>;
  _slack?: Record<string, unknown>;

  // Computed (by Intelligence / Twin)
  _computed?: {
    health_score?: number;
    churn_risk?: number;
    engagement_score?: number;
    last_activity_at?: number;
    next_best_action?: string;
  };
}
```

### 2.6 SSOC Index — Cross-Provider Identity Resolution

The `ssoc_index` table maps provider-native IDs to canonical SSOC UUIDs. This is the resolution layer that makes provider swaps transparent.

| Column                  | Type            | Description                                                              |
| ----------------------- | --------------- | ------------------------------------------------------------------------ |
| `ssoc_uuid`             | `TEXT` PK       | The canonical UUID                                                       |
| `tenant_id`             | `TEXT` NOT NULL | Isolation                                                                |
| `canonical_type`        | `TEXT`          | Resolved entity type                                                     |
| `provider_map`          | `TEXT` (JSON)   | `{ "salesforce": "001ABC...", "hubspot": "12345", "stripe": "cus_xyz" }` |
| `merge_history`         | `TEXT` (JSON)   | Array of merge events: `{from_ssoc, to_ssoc, reason, timestamp}`         |
| `resolution_confidence` | `REAL`          | How certain the resolution is (0.0–1.0)                                  |
| `created_at`            | `INTEGER`       |                                                                          |
| `updated_at`            | `INTEGER`       |                                                                          |

**Resolution Flow:**

```
Normalizer (NA2-SSOC Stage)
    │
    ▼
┌─────────────────┐
│ 1. Extract IDs  │  ← provider_id from raw record
│ 2. Hash lookup  │  → SELECT ssoc_uuid FROM ssoc_index
│    WHERE provider_map->>'salesforce' = '001ABC...'
│ 3. If found:    │  → bind to existing SSOC
│ 4. If not:      │  → generate new SSOC, INSERT to ssoc_index
│ 5. If fuzzy:    │  → enqueue to TriageBot (confidence 0.70-0.85)
└─────────────────┘
    │
    ▼
Pipeline INSERT entities (with ssoc_uuid bound)
```

### 2.7 Spine Audit Log — Immutable History

The `spine_audit_log` is **append-only, tenant-scoped, and operation-halting**. If a write to this table fails, the triggering operation must not complete.

| Column             | Type          | Constraints   | Description                                                                                  |
| ------------------ | ------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `audit_id`         | `TEXT`        | PRIMARY KEY   | CUID2                                                                                        |
| `tenant_id`        | `TEXT`        | NOT NULL      |                                                                                              |
| `entity_id`        | `TEXT`        | FK → entities | May be NULL for schema-level events                                                          |
| `action_type`      | `TEXT`        | NOT NULL      | `create`, `update`, `delete`, `merge`, `read`, `mcp_access`, `sync_inbound`, `sync_outbound` |
| `actor_type`       | `TEXT`        | NOT NULL      | `user`, `agent`, `twin`, `system`, `webhook`, `mcp`                                          |
| `actor_id`         | `TEXT`        | NOT NULL      | User ID, Agent ID, or `system`                                                               |
| `payload_hash`     | `TEXT`        | NOT NULL      | SHA-256 of the action payload (for integrity)                                                |
| `previous_state`   | `TEXT` (JSON) |               | Full previous entity state (for rollback)                                                    |
| `new_state`        | `TEXT` (JSON) |               | Full new entity state                                                                        |
| `confidence_score` | `REAL`        |               | If AI-generated                                                                              |
| `via`              | `TEXT`        |               | `mcp`, `webhook`, `api`, `sync`, `twin`, `governance`                                        |
| `correlation_id`   | `TEXT`        | NOT NULL      | x-correlation-id for distributed tracing                                                     |
| `timestamp`        | `INTEGER`     | NOT NULL      | Unix ms (nanosecond precision if available)                                                  |

**Security Rule:** Read operations on Spine entities via MCP or API are ALSO logged (action_type = `read`). This creates a complete access trail.

---

## 3. Memory Schema — Active / Staging / Archived

Memory is not a cache. It is the **compounding context layer** that ensures every agent turn starts with more context than the last. Memory follows a strict lifecycle: intake → classification → validation → promotion → storage → decay.

### 3.1 Memory Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SHARED MEMORY (Layer 8)                              │
│                                                                              │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│   │     ACTIVE      │    │    STAGING      │    │   ARCHIVED      │         │
│   │    (Hot)        │    │   (Warm)        │    │    (Cold)       │         │
│   ├─────────────────┤    ├─────────────────┤    ├─────────────────┤         │
│   │ D1 + KV cache   │    │ D1 only         │    │ D1 + R2 offload │         │
│   │ <10ms read      │    │ <100ms read     │    │ <2s read (rare) │         │
│   │ 30-day TTL      │    │ 7-day review    │    │ Permanent       │         │
│   │ Auto-decay      │    │ Manual promote  │    │ Compliance      │         │
│   │ Reinforceable   │    │ Or auto-archive │    │ Retention       │         │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│          ▲                      ▲                      ▲                    │
│          └──────────────────────┴──────────────────────┘                    │
│                        MEMORY TRIAGE (0.70/0.85)                             │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │                     MEMORY INTAKE PIPELINE                       │       │
│   │  Pipeline ──► Continuity Service ──► TriageBot ──► Tiered Store  │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │                      MEMORY SCOPES                               │       │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐     │       │
│   │  │ Personal │  │   Work   │  │ Organization │  │    AI    │     │       │
│   │  │ (human)  │  │(task/proj)│  │  (org-wide)  │  │(twin/audit)│    │       │
│   │  └──────────┘  └──────────┘  └──────────────┘  └──────────┘     │       │
│   └─────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Memory Table — Unified Tiered Store

All memory lives in a single `memory` table with a `tier` column. This enables atomic tier transitions and unified querying.

| Column                | Type      | Constraints             | Description                                                                           |
| --------------------- | --------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `memory_id`           | `TEXT`    | PRIMARY KEY             | CUID2                                                                                 |
| `tenant_id`           | `TEXT`    | NOT NULL                |                                                                                       |
| `scope`               | `TEXT`    | NOT NULL                | `personal`, `work`, `organization`, `ai`                                              |
| `tier`                | `TEXT`    | NOT NULL                | `active`, `staging`, `archived`                                                       |
| `entity_id`           | `TEXT`    | FK → entities.ssoc_uuid | Optional — linked entity                                                              |
| `memory_type`         | `TEXT`    | NOT NULL                | `fact`, `observation`, `decision`, `preference`, `pattern`, `conversation`, `insight` |
| `content`             | `TEXT`    | NOT NULL                | Human-readable memory content                                                         |
| `content_vector`      | `BLOB`    |                         | Vectorize embedding (for semantic retrieval)                                          |
| `confidence`          | `REAL`    | NOT NULL                | TriageBot score at intake                                                             |
| `source`              | `TEXT`    | NOT NULL                | `twin`, `user`, `sync`, `mcp`, `governance`, `intelligence`                           |
| `source_ref`          | `TEXT`    |                         | Correlation ID or audit log reference                                                 |
| `actor_id`            | `TEXT`    |                         | Who created this memory                                                               |
| `access_count`        | `INTEGER` | DEFAULT 0               | How many times retrieved                                                              |
| `last_accessed_at`    | `INTEGER` |                         | Unix ms — drives decay calculation                                                    |
| `decay_score`         | `REAL`    | DEFAULT 1.0             | Current relevance (0.0–1.0), updated by decay job                                     |
| `reinforcement_count` | `INTEGER` | DEFAULT 0               | Times confirmed/reinforced                                                            |
| `valid_from`          | `INTEGER` |                         | When memory becomes valid                                                             |
| `valid_until`         | `INTEGER` | NULLABLE                | When memory expires (NULL = never)                                                    |
| `created_at`          | `INTEGER` | NOT NULL                |                                                                                       |
| `updated_at`          | `INTEGER` | NOT NULL                |                                                                                       |
| `archived_at`         | `INTEGER` | NULLABLE                | Set on tier → archived transition                                                     |

**Composite Indexes:**

- `idx_memory_tenant_scope_tier` → `(tenant_id, scope, tier, memory_type)` — primary retrieval
- `idx_memory_entity` → `(tenant_id, entity_id, tier)` — Entity360 memory pane
- `idx_memory_confidence` → `(tenant_id, confidence, tier)` — triage filtering
- `idx_memory_decay` → `(tenant_id, decay_score, last_accessed_at)` — decay job
- `idx_memory_temporal` → `(tenant_id, valid_from, valid_until)` — time-bound queries

### 3.3 Memory Triage Rules

```
┌────────────────────────────────────────────────────────────────┐
│                    MEMORY TRIAGE DECISION                       │
│                                                                 │
│   Confidence    Action              Tier       Storage         │
│   ─────────────────────────────────────────────────────────    │
│   ≥ 0.85        Auto-promote        active     D1 + KV        │
│   0.70 – 0.85   Queue for review    staging    D1 only        │
│   < 0.70        Discard             —          R2 audit       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  ACTIVE MEMORY DECAY (continuity service, cron)         │  │
│   │                                                         │  │
│   │  decay_score = f(time_since_access, reinforcement,       │  │
│   │                  confidence, scope_weight)               │  │
│   │                                                         │  │
│   │  If decay_score < 0.30 AND last_accessed > 30 days:     │  │
│   │      → tier = 'archived'                                │  │
│   │      → content_vector retained, content offloaded to R2 │  │
│   │                                                         │  │
│   │  If reinforced: decay_score += 0.2, reset access clock  │  │
│   └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 3.4 Memory Graph — Relationship-Aware Retrieval

The `memory_graph` table (sparse, computed) stores high-confidence relationship-derived memories. It is populated by the Continuity Service during graph traversal.

| Column                | Type               | Description                                                     |
| --------------------- | ------------------ | --------------------------------------------------------------- |
| `graph_id`            | `TEXT` PK          | CUID2                                                           |
| `tenant_id`           | `TEXT` NOT NULL    |                                                                 |
| `source_memory_id`    | `TEXT` FK → memory |                                                                 |
| `target_memory_id`    | `TEXT` FK → memory |                                                                 |
| `connection_type`     | `TEXT`             | `caused`, `enabled`, `contradicted`, `reinforced`, `similar_to` |
| `connection_strength` | `REAL`             | 0.0–1.0                                                         |
| `derived_at`          | `INTEGER`          | When the connection was inferred                                |

---

## 4. Tenant Schema — Multi-Tenancy & RBAC

Tenant isolation is the **primary security boundary**. Every table carries `tenant_id`. The tenant schema defines the organizational identity, membership, roles, and plan constraints.

### 4.1 Tenant Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TENANT LIFECYCLE (Layer 0)                              │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│   │   TENANTS   │◄────┤    USERS    │◄────┤  RBAC_ROLES │                   │
│   │             │     │             │     │             │                   │
│   │ tenant_id   │     │ user_id     │     │ role_id     │                   │
│   │ name        │     │ tenant_id   │     │ tenant_id   │                   │
│   │ plan_tier   │     │ email       │     │ name        │                   │
│   │ config      │     │ auth_provider│    │ permissions │                   │
│   │ spine_config│     │ profile     │     │ level       │                   │
│   │ created_at  │     │ role_id     │     │             │                   │
│   └─────────────┘     └─────────────┘     └─────────────┘                   │
│          ▲                                                          │       │
│          │                                                          │       │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐            │       │
│   │ CONNECTORS  │     │  PLANS      │     │INVITATIONS  │            │       │
│   │             │     │             │     │             │            │       │
│   │ connector_id│     │ plan_id     │     │ invite_id   │            │       │
│   │ tenant_id   │     │ name        │     │ tenant_id   │            │       │
│   │ provider    │     │ limits      │     │ email       │            │       │
│   │ credentials │     │ features    │     │ role_id     │            │       │
│   │ status      │     │ price       │     │ expires_at  │            │       │
│   │ last_sync   │     │             │     │             │            │       │
│   └─────────────┘     └─────────────┘     └─────────────┘            │       │
│                                                                      │       │
└──────────────────────────────────────────────────────────────────────┴───────┘
```

### 4.2 Tenants Table

| Column          | Type          | Constraints | Description                                              |
| --------------- | ------------- | ----------- | -------------------------------------------------------- |
| `tenant_id`     | `TEXT`        | PRIMARY KEY | CUID2 — the isolation boundary                           |
| `slug`          | `TEXT`        | UNIQUE      | URL-friendly name: `acme-corp`                           |
| `name`          | `TEXT`        | NOT NULL    | Display name                                             |
| `plan_id`       | `TEXT`        | FK → plans  | `free`, `pro`, `enterprise`, `customer_zero`             |
| `config`        | `TEXT` (JSON) |             | Tenant-specific settings: lenses, features, custom types |
| `spine_config`  | `TEXT` (JSON) |             | Entity types, trait rules, schema overrides              |
| `rbac_config`   | `TEXT` (JSON) |             | Custom roles, permission overrides                       |
| `owner_id`      | `TEXT`        | FK → users  | Organization owner                                       |
| `billing_email` | `TEXT`        |             |                                                          |
| `created_at`    | `INTEGER`     |             |                                                          |
| `updated_at`    | `INTEGER`     |             |                                                          |
| `deleted_at`    | `INTEGER`     | NULLABLE    | Soft delete                                              |

### 4.3 Users Table

| Column          | Type          | Constraints            | Description                            |
| --------------- | ------------- | ---------------------- | -------------------------------------- |
| `user_id`       | `TEXT`        | PRIMARY KEY            | CUID2                                  |
| `tenant_id`     | `TEXT`        | NOT NULL, FK → tenants | Hard isolation                         |
| `email`         | `TEXT`        | NOT NULL               |                                        |
| `auth_provider` | `TEXT`        |                        | `password`, `google`, `github`, `saml` |
| `auth_subject`  | `TEXT`        |                        | Provider-specific subject ID           |
| `profile`       | `TEXT` (JSON) |                        | name, avatar, timezone, preferences    |
| `role_id`       | `TEXT`        | FK → rbac_roles        | Primary role                           |
| `mfa_enabled`   | `INTEGER`     | DEFAULT 0              |                                        |
| `last_login_at` | `INTEGER`     |                        |                                        |
| `created_at`    | `INTEGER`     |                        |                                        |
| `updated_at`    | `INTEGER`     |                        |                                        |

**Security Rule:** `user_id` is unique per tenant. A user with the same email in two tenants has two distinct `user_id` values. Cross-tenant user linking requires explicit federation (future feature).

### 4.4 RBAC Roles Table

| Column        | Type          | Constraints            | Description                                                    |
| ------------- | ------------- | ---------------------- | -------------------------------------------------------------- |
| `role_id`     | `TEXT`        | PRIMARY KEY            | CUID2                                                          |
| `tenant_id`   | `TEXT`        | NOT NULL, FK → tenants |                                                                |
| `name`        | `TEXT`        | NOT NULL               | `owner`, `admin`, `member`, `viewer`, `tam`, `account_success` |
| `permissions` | `TEXT` (JSON) | NOT NULL               | Array of permission strings                                    |
| `level`       | `INTEGER`     | NOT NULL               | 1–4 (L1–L4 capability access)                                  |
| `is_system`   | `INTEGER`     | DEFAULT 0              | Platform-provided roles cannot be deleted                      |
| `created_at`  | `INTEGER`     |                        |                                                                |

**Default Permission Strings:**

| Permission         | Description              | Levels           |
| ------------------ | ------------------------ | ---------------- |
| `spine:read`       | Read Spine entities      | L1+              |
| `spine:write`      | Create/update entities   | L3+              |
| `spine:delete`     | Delete/archival          | L3+ (owner only) |
| `memory:read`      | Read memory              | L1+              |
| `memory:write`     | Create memory            | L2+              |
| `twin:read`        | View Twin proposals      | L1+              |
| `twin:write`       | Approve/reject proposals | L3+              |
| `governance:read`  | View audit logs          | L2+              |
| `governance:admin` | Override governance      | L4 (owner)       |
| `connector:manage` | Add/remove connectors    | L3+              |
| `billing:read`     | View billing             | L3+              |
| `billing:manage`   | Change plan              | L4 (owner)       |
| `admin:tenant`     | Full tenant admin        | L4 (owner)       |

### 4.5 Connectors Table

| Column                | Type                | Description                                                                       |
| --------------------- | ------------------- | --------------------------------------------------------------------------------- |
| `connector_id`        | `TEXT` PK           | CUID2                                                                             |
| `tenant_id`           | `TEXT` NOT NULL     |                                                                                   |
| `provider`            | `TEXT` NOT NULL     | `salesforce`, `hubspot`, `slack`, `stripe`, `linear`, `github`, `notion`, `figma` |
| `connection_type`     | `TEXT`              | `oauth`, `api_key`, `mcp`, `webhook`                                              |
| `nango_connection_id` | `TEXT`              | Reference to Nango vault (if OAuth)                                               |
| `config`              | `TEXT` (JSON)       | Provider-specific config: scopes, sync frequency, filters                         |
| `status`              | `TEXT`              | `active`, `paused`, `error`, `revoked`                                            |
| `last_sync_at`        | `INTEGER`           |                                                                                   |
| `last_sync_status`    | `TEXT`              | `success`, `partial`, `failed`                                                    |
| `sync_error_count`    | `INTEGER` DEFAULT 0 | Consecutive failures                                                              |
| `created_at`          | `INTEGER`           |                                                                                   |
| `updated_at`          | `INTEGER`           |                                                                                   |

---

## 5. Governance Schema — Audit, Proposals, Confidence Gates

Governance is not an afterthought. It is a **first-class schema concern** — every action flows through confidence-scored gates, and every decision is auditable.

### 5.1 Governance Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GOVERNANCE LAYER (Layer 10)                              │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐        │
│   │                    CONFIDENCE GATE (0.70 / 0.85)                 │        │
│   │                                                                  │        │
│   │   Twin Proposal ──► Confidence Score ──► Decision                │        │
│   │                                                                  │        │
│   │   ≥ 0.85 ──► AUTO-APPROVE ──► ACT_QUEUE ──► Execute              │        │
│   │   0.70-0.85 ──► MY DESK ──► Human Review ──► Approve/Reject      │        │
│   │   < 0.70 ──► DISCARD ──► Audit log only                          │        │
│   │                                                                  │        │
│   └─────────────────────────────────────────────────────────────────┘        │
│                              │                                               │
│                              ▼                                               │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│   │ ACTION_PROPOSALS│  │GOVERNANCE_AUDIT │  │  HITL_SESSIONS  │              │
│   │                 │  │     LOG         │  │                 │              │
│   │ proposal_id     │  │ audit_id        │  │ session_id      │              │
│   │ tenant_id       │  │ tenant_id       │  │ tenant_id       │              │
│   │ entity_id       │  │ proposal_id     │  │ user_id         │              │
│   │ proposed_action │  │ action_type     │  │ proposal_id     │              │
│   │ confidence      │  │ decision        │  │ status          │              │
│   │ status          │  │ actor           │  │ started_at      │              │
│   │ reviewer_id     │  │ reason          │  │ resolved_at     │              │
│   │ approved_at     │  │ timestamp       │  │ resolution      │              │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Action Proposals Table

| Column             | Type          | Constraints   | Description                                                                |
| ------------------ | ------------- | ------------- | -------------------------------------------------------------------------- |
| `proposal_id`      | `TEXT`        | PRIMARY KEY   | CUID2                                                                      |
| `tenant_id`        | `TEXT`        | NOT NULL      |                                                                            |
| `entity_id`        | `TEXT`        | FK → entities | Target entity (optional)                                                   |
| `proposed_by`      | `TEXT`        | NOT NULL      | `twin`, `user`, `agent`, `system`                                          |
| `actor_id`         | `TEXT`        | NOT NULL      | Specific actor identifier                                                  |
| `capability`       | `TEXT`        | NOT NULL      | e.g., `salesforce.opportunity.update`                                      |
| `payload`          | `TEXT` (JSON) | NOT NULL      | Proposed action parameters                                                 |
| `confidence_score` | `REAL`        | NOT NULL      | 0.0–1.0                                                                    |
| `status`           | `TEXT`        | NOT NULL      | `pending`, `approved`, `rejected`, `auto_approved`, `discarded`, `expired` |
| `reviewer_id`      | `TEXT`        | FK → users    | Human reviewer (NULL for auto-approved)                                    |
| `reviewed_at`      | `INTEGER`     |               | When human made decision                                                   |
| `review_reason`    | `TEXT`        |               | Human-provided rationale                                                   |
| `expires_at`       | `INTEGER`     | NOT NULL      | Auto-expiry for pending proposals (default: 7 days)                        |
| `executed_at`      | `INTEGER`     |               | When action was executed                                                   |
| `execution_result` | `TEXT` (JSON) |               | Outcome of executed action                                                 |
| `correlation_id`   | `TEXT`        | NOT NULL      |                                                                            |
| `created_at`       | `INTEGER`     | NOT NULL      |                                                                            |

**State Machine:**

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

### 5.3 Governance Audit Log

| Column                   | Type      | Constraints           | Description                                                                |
| ------------------------ | --------- | --------------------- | -------------------------------------------------------------------------- |
| `audit_id`               | `TEXT`    | PRIMARY KEY           | CUID2                                                                      |
| `tenant_id`              | `TEXT`    | NOT NULL              |                                                                            |
| `proposal_id`            | `TEXT`    | FK → action_proposals |                                                                            |
| `action_type`            | `TEXT`    | NOT NULL              | `propose`, `review`, `approve`, `reject`, `discard`, `execute`, `override` |
| `decision`               | `TEXT`    |                       | `approved`, `rejected`, `discarded`, `auto_approved`                       |
| `actor_type`             | `TEXT`    | NOT NULL              | `user`, `twin`, `system`, `governance_rule`                                |
| `actor_id`               | `TEXT`    | NOT NULL              |                                                                            |
| `reason`                 | `TEXT`    |                       | Rationale for decision                                                     |
| `confidence_at_decision` | `REAL`    |                       | Confidence score at time of decision                                       |
| `policy_id`              | `TEXT`    | FK → policy_registry  | Which governance rule applied                                              |
| `payload_hash`           | `TEXT`    | NOT NULL              | SHA-256                                                                    |
| `timestamp`              | `INTEGER` | NOT NULL              |                                                                            |

### 5.4 HITL Sessions Table

Human-in-the-Loop sessions for 0.70–0.85 confidence proposals. Each session is a Durable Object instance keyed by `tenant_id + user_id`.

| Column             | Type                         | Description                                     |
| ------------------ | ---------------------------- | ----------------------------------------------- |
| `session_id`       | `TEXT` PK                    | DO identifier                                   |
| `tenant_id`        | `TEXT` NOT NULL              |                                                 |
| `user_id`          | `TEXT` NOT NULL              | Reviewer                                        |
| `proposal_id`      | `TEXT` FK → action_proposals | Current proposal under review                   |
| `status`           | `TEXT`                       | `active`, `idle`, `closed`                      |
| `context_snapshot` | `TEXT` (JSON)                | Full Entity360 at time of proposal              |
| `started_at`       | `INTEGER`                    |                                                 |
| `resolved_at`      | `INTEGER`                    |                                                 |
| `resolution`       | `TEXT`                       | `approved`, `rejected`, `modified`, `escalated` |

**Security Rule:** HITL DO uses `idFromName(tenant_id + ":" + user_id)`, NOT `idFromName("global")`. This is a P0 security requirement.

### 5.5 Policy Registry Table

| Column        | Type                | Description                                                              |
| ------------- | ------------------- | ------------------------------------------------------------------------ |
| `policy_id`   | `TEXT` PK           | CUID2                                                                    |
| `tenant_id`   | `TEXT` NOT NULL     |                                                                          |
| `name`        | `TEXT`              | e.g., `high_value_deal_approval`                                         |
| `description` | `TEXT`              |                                                                          |
| `condition`   | `TEXT` (JSON)       | Rule expression: `{ "field": "deal.amount", "op": ">", "value": 50000 }` |
| `action`      | `TEXT`              | `require_approval`, `auto_approve`, `auto_reject`, `escalate`            |
| `priority`    | `INTEGER`           | Evaluation order (lower = first)                                         |
| `enabled`     | `INTEGER` DEFAULT 1 |                                                                          |
| `created_at`  | `INTEGER`           |                                                                          |

---

## 6. Entity Relationship Diagram

### 6.1 Complete Schema ERD (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              INTEGRATEWISE SPINE ERD v2.0                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌───────────────┐         ┌───────────────┐         ┌───────────────┐              │
│  │    TENANTS    │◄────────┤    USERS      │◄────────┤  RBAC_ROLES   │              │
│  │───────────────│         │───────────────│         │───────────────│              │
│  │ PK tenant_id  │         │ PK user_id    │         │ PK role_id    │              │
│  │    name       │         │ FK tenant_id  │         │ FK tenant_id  │              │
│  │    plan_id ───┼────┐    │    email      │         │    name       │              │
│  │    config     │    │    │    role_id ───┼────────►│    permissions│              │
│  │    owner_id ──┼────┼───►│    profile    │         │    level      │              │
│  └───────────────┘    │    └───────────────┘         └───────────────┘              │
│         ▲             │                                                              │
│         │             │    ┌───────────────┐                                         │
│         │             └───►│    PLANS      │                                         │
│         │                  │───────────────│                                         │
│         │                  │ PK plan_id    │                                         │
│         │                  │    limits     │                                         │
│         │                  │    features   │                                         │
│         │                  └───────────────┘                                         │
│         │                                                                            │
│         │         ┌───────────────┐         ┌───────────────┐                        │
│         │         │  CONNECTORS   │         │ INVITATIONS   │                        │
│         │         │───────────────│         │───────────────│                        │
│         │         │ PK connector_ │         │ PK invite_id  │                        │
│         └─────────┤ FK tenant_id  │         │ FK tenant_id  │                        │
│                   │    provider   │         │    email      │                        │
│                   │    status     │         │    role_id    │                        │
│                   └───────────────┘         └───────────────┘                        │
│                                                                                      │
│  ╔═══════════════════════════════════════════════════════════════════════════════╗   │
│  ║                              SPINE CORE                                        ║   │
│  ╠═══════════════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                                ║   │
│  ║  ┌───────────────┐         ┌───────────────┐         ┌───────────────┐        ║   │
│  ║  │  ENTITY_TYPES │◄────────┤   ENTITIES    │◄───────►│ RELATIONSHIPS │        ║   │
│  ║  │───────────────│         │───────────────│         │───────────────│        ║   │
│  ║  │ PK type_id    │         │ PK entity_id  │         │ PK rel_id     │        ║   │
│  ║  │ FK tenant_id  │         │    ssoc_uuid  │◄───────►│ FK source_id  │        ║   │
│  ║  │    schema_def │         │ FK tenant_id  │◄───────►│ FK target_id  │        ║   │
│  ║  │    lenses     │         │ FK entity_type│         │    rel_type   │        ║   │
│  ║  └───────────────┘         │    provider   │         │    confidence │        ║   │
│  ║                            │    traits     │         │    metadata   │        ║   │
│  ║                            │    version    │         └───────────────┘        ║   │
│  ║                            │    lineage_id │                                  ║   │
│  ║                            └───────┬───────┘                                  ║   │
│  ║                                    │                                          ║   │
│  ║                            ┌───────┴───────┐                                  ║   │
│  ║                            │  SSOC_INDEX   │                                  ║   │
│  ║                            │───────────────│                                  ║   │
│  ║                            │ PK ssoc_uuid  │                                  ║   │
│  ║                            │ FK tenant_id  │                                  ║   │
│  ║                            │ provider_map  │                                  ║   │
│  ║                            └───────────────┘                                  ║   │
│  ║                                                                                ║   │
│  ║  ┌───────────────┐         ┌───────────────┐                                  ║   │
│  ║  │ SPINE_AUDIT_  │◄────────┤  LINEAGE_     │                                  ║   │
│  ║  │     LOG       │         │  RECORDS      │                                  ║   │
│  ║  │───────────────│         │───────────────│                                  ║   │
│  ║  │ PK audit_id   │         │ PK lineage_id │                                  ║   │
│  ║  │ FK tenant_id  │         │ FK tenant_id  │                                  ║   │
│  ║  │ FK entity_id  │         │    sync_job   │                                  ║   │
│  ║  │    action_type│         │    stage      │                                  ║   │
│  ║  │    actor_type │         │    records    │                                  ║   │
│  ║  │    payload_hash│        │    started_at │                                  ║   │
│  ║  └───────────────┘         └───────────────┘                                  ║   │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                      │
│  ┌───────────────┐         ┌───────────────┐         ┌───────────────┐              │
│  │    MEMORY     │◄───────►│ MEMORY_GRAPH  │         │    DECAY_     │              │
│  │───────────────│         │───────────────│         │    LOG        │              │
│  │ PK memory_id  │         │ PK graph_id   │         │───────────────│              │
│  │ FK tenant_id  │         │ FK tenant_id  │         │ PK decay_id   │              │
│  │    scope      │◄───────►│ FK source_mem │         │ FK tenant_id  │              │
│  │    tier       │         │ FK target_mem │         │ FK memory_id  │              │
│  │ FK entity_id ─┼────┐    │    strength   │         │    old_tier   │              │
│  │    content    │    │    └───────────────┘         │    new_tier   │              │
│  │    confidence │    │                              │    reason     │              │
│  │    decay_score│    │                              └───────────────┘              │
│  └───────────────┘    │                                                              │
│         ▲             │                                                              │
│         └─────────────┘                                                              │
│                                                                                      │
│  ┌───────────────┐         ┌───────────────┐         ┌───────────────┐              │
│  │ACTION_PROPOSALS│◄──────┤GOVERNANCE_AUDIT│◄──────┤  HITL_SESSIONS│              │
│  │───────────────│         │───────────────│         │───────────────│              │
│  │ PK proposal_id│         │ PK audit_id   │         │ PK session_id │              │
│  │ FK tenant_id  │         │ FK tenant_id  │         │ FK tenant_id  │              │
│  │ FK entity_id ─┼────┐    │ FK proposal_id│◄────────┤ FK user_id    │              │
│  │    capability │    │    │    decision   │         │ FK proposal_id│              │
│  │    confidence │    │    │    actor      │         │    status     │              │
│  │    status     │    │    │    timestamp  │         └───────────────┘              │
│  │ FK reviewer_id┼────┼───►│    payload_hash│                                    │
│  └───────────────┘    │    └───────────────┘                                    │
│         ▲             │                                                            │
│         └─────────────┘                                                            │
│                                                                                    │
│  ┌───────────────┐                                                                │
│  │POLICY_REGISTRY│                                                                │
│  │───────────────│                                                                │
│  │ PK policy_id  │                                                                │
│  │ FK tenant_id  │                                                                │
│  │    condition  │                                                                │
│  │    action     │                                                                │
│  └───────────────┘                                                                │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Relationship Cardinality

| Relationship                                | Cardinality | Description                                        |
| ------------------------------------------- | ----------- | -------------------------------------------------- |
| `tenants` → `users`                         | 1:N         | One tenant has many users                          |
| `tenants` → `entities`                      | 1:N         | One tenant has many entities                       |
| `tenants` → `memory`                        | 1:N         | One tenant has many memory records                 |
| `entities` → `relationships` (source)       | 1:N         | One entity has many outbound relationships         |
| `entities` → `relationships` (target)       | 1:N         | One entity has many inbound relationships          |
| `entities` → `memory`                       | 1:N         | One entity has many memory entries                 |
| `entities` → `action_proposals`             | 1:N         | One entity may have many proposals                 |
| `users` → `action_proposals` (reviewer)     | 1:N         | One user may review many proposals                 |
| `action_proposals` → `governance_audit_log` | 1:N         | One proposal generates many audit entries          |
| `action_proposals` → `hitl_sessions`        | 1:1         | One proposal maps to one HITL session              |
| `ssoc_index` → `entities`                   | 1:N         | One SSOC may map to many provider records (merged) |

---

## 7. D1 Table Definitions (Drizzle ORM)

The following Drizzle ORM schema definitions are canonical. They live in `packages/spine-schema/src/schema/` and are the single source of truth for all D1 table structures.

### 7.1 Drizzle Schema — Core Tables

```typescript
// packages/spine-schema/src/schema/tenants.ts
import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const tenants = sqliteTable("tenants", {
  tenantId: text("tenant_id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  planId: text("plan_id").notNull(),
  config: text("config", { mode: "json" }).$type<Record<string, unknown>>().default({}),
  spineConfig: text("spine_config", { mode: "json" }).$type<Record<string, unknown>>().default({}),
  rbacConfig: text("rbac_config", { mode: "json" }).$type<Record<string, unknown>>().default({}),
  ownerId: text("owner_id"),
  billingEmail: text("billing_email"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
});

export const users = sqliteTable(
  "users",
  {
    userId: text("user_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    email: text("email").notNull(),
    authProvider: text("auth_provider"),
    authSubject: text("auth_subject"),
    profile: text("profile", { mode: "json" }).$type<Record<string, unknown>>().default({}),
    roleId: text("role_id"),
    mfaEnabled: integer("mfa_enabled", { mode: "boolean" }).default(false),
    lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("idx_users_tenant_email").on(table.tenantId, table.email)]
);

export const rbacRoles = sqliteTable("rbac_roles", {
  roleId: text("role_id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  name: text("name").notNull(),
  permissions: text("permissions", { mode: "json" }).$type<string[]>().notNull().default([]),
  level: integer("level").notNull(),
  isSystem: integer("is_system", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
```

### 7.2 Drizzle Schema — Spine Tables

```typescript
// packages/spine-schema/src/schema/spine.ts
import { sqliteTable, text, integer, real, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const entityTypes = sqliteTable("entity_types", {
  typeId: text("type_id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  name: text("name").notNull(),
  description: text("description"),
  schemaDef: text("schema_def", { mode: "json" }).$type<Record<string, unknown>>().default({}),
  lenses: text("lenses", { mode: "json" }).$type<string[]>().default([]),
  traitRules: text("trait_rules", { mode: "json" }).$type<Record<string, unknown>>().default({}),
  isSystem: integer("is_system", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const entities = sqliteTable(
  "entities",
  {
    entityId: text("entity_id").primaryKey(),
    ssocUuid: text("ssoc_uuid").notNull(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    entityType: text("entity_type")
      .notNull()
      .references(() => entityTypes.typeId),
    provider: text("provider").notNull(),
    providerId: text("provider_id").notNull(),
    displayName: text("display_name"),
    traits: text("traits", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    rawPayload: text("raw_payload", { mode: "json" }).$type<Record<string, unknown>>(),
    confidenceScore: real("confidence_score").notNull().default(1.0),
    version: integer("version").notNull().default(1),
    lineageId: text("lineage_id"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    uniqueIndex("idx_entities_tenant_ssoc").on(table.tenantId, table.ssocUuid),
    uniqueIndex("idx_entities_tenant_provider").on(
      table.tenantId,
      table.provider,
      table.providerId
    ),
    index("idx_entities_tenant_type").on(table.tenantId, table.entityType),
    index("idx_entities_confidence").on(table.tenantId, table.confidenceScore),
    index("idx_entities_lineage").on(table.tenantId, table.lineageId),
  ]
);

export const relationships = sqliteTable(
  "relationships",
  {
    relId: text("rel_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    sourceId: text("source_id").notNull(),
    targetId: text("target_id").notNull(),
    relType: text("rel_type").notNull(),
    direction: text("direction").notNull().default("directed"),
    confidence: real("confidence").notNull().default(1.0),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>().default({}),
    validFrom: integer("valid_from", { mode: "timestamp_ms" }),
    validUntil: integer("valid_until", { mode: "timestamp_ms" }),
    version: integer("version").notNull().default(1),
    lineageId: text("lineage_id"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_rels_source").on(table.tenantId, table.sourceId, table.relType),
    index("idx_rels_target").on(table.tenantId, table.targetId, table.relType),
    index("idx_rels_confidence").on(table.tenantId, table.confidence),
  ]
);

export const ssocIndex = sqliteTable(
  "ssoc_index",
  {
    ssocUuid: text("ssoc_uuid").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    canonicalType: text("canonical_type").notNull(),
    providerMap: text("provider_map", { mode: "json" })
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    mergeHistory: text("merge_history", { mode: "json" })
      .$type<Record<string, unknown>[]>()
      .default([]),
    resolutionConfidence: real("resolution_confidence").notNull().default(1.0),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [index("idx_ssoc_tenant").on(table.tenantId)]
);

export const spineAuditLog = sqliteTable(
  "spine_audit_log",
  {
    auditId: text("audit_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    entityId: text("entity_id"),
    actionType: text("action_type").notNull(),
    actorType: text("actor_type").notNull(),
    actorId: text("actor_id").notNull(),
    payloadHash: text("payload_hash").notNull(),
    previousState: text("previous_state", { mode: "json" }).$type<Record<string, unknown>>(),
    newState: text("new_state", { mode: "json" }).$type<Record<string, unknown>>(),
    confidenceScore: real("confidence_score"),
    via: text("via"),
    correlationId: text("correlation_id").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_audit_tenant_entity").on(table.tenantId, table.entityId),
    index("idx_audit_correlation").on(table.correlationId),
    index("idx_audit_timestamp").on(table.tenantId, table.timestamp),
  ]
);
```

### 7.3 Drizzle Schema — Memory Tables

```typescript
// packages/spine-schema/src/schema/memory.ts
import { sqliteTable, text, integer, real, index, blob } from "drizzle-orm/sqlite-core";

export const memory = sqliteTable(
  "memory",
  {
    memoryId: text("memory_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    scope: text("scope", { enum: ["personal", "work", "organization", "ai"] }).notNull(),
    tier: text("tier", { enum: ["active", "staging", "archived"] }).notNull(),
    entityId: text("entity_id"),
    memoryType: text("memory_type", {
      enum: ["fact", "observation", "decision", "preference", "pattern", "conversation", "insight"],
    }).notNull(),
    content: text("content").notNull(),
    contentVector: blob("content_vector"),
    confidence: real("confidence").notNull(),
    source: text("source").notNull(),
    sourceRef: text("source_ref"),
    actorId: text("actor_id"),
    accessCount: integer("access_count").default(0),
    lastAccessedAt: integer("last_accessed_at", { mode: "timestamp_ms" }),
    decayScore: real("decay_score").notNull().default(1.0),
    reinforcementCount: integer("reinforcement_count").default(0),
    validFrom: integer("valid_from", { mode: "timestamp_ms" }),
    validUntil: integer("valid_until", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    index("idx_memory_tenant_scope_tier").on(
      table.tenantId,
      table.scope,
      table.tier,
      table.memoryType
    ),
    index("idx_memory_entity").on(table.tenantId, table.entityId, table.tier),
    index("idx_memory_decay").on(table.tenantId, table.decayScore, table.lastAccessedAt),
  ]
);

export const memoryGraph = sqliteTable(
  "memory_graph",
  {
    graphId: text("graph_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    sourceMemoryId: text("source_memory_id").notNull(),
    targetMemoryId: text("target_memory_id").notNull(),
    connectionType: text("connection_type").notNull(),
    connectionStrength: real("connection_strength").notNull().default(0.5),
    derivedAt: integer("derived_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_memgraph_source").on(table.tenantId, table.sourceMemoryId),
    index("idx_memgraph_target").on(table.tenantId, table.targetMemoryId),
  ]
);

export const decayLog = sqliteTable("decay_log", {
  decayId: text("decay_id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  memoryId: text("memory_id").notNull(),
  oldTier: text("old_tier").notNull(),
  newTier: text("new_tier").notNull(),
  oldDecayScore: real("old_decay_score").notNull(),
  newDecayScore: real("new_decay_score").notNull(),
  reason: text("reason").notNull(),
  triggeredBy: text("triggered_by").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
```

### 7.4 Drizzle Schema — Governance Tables

```typescript
// packages/spine-schema/src/schema/governance.ts
import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

export const actionProposals = sqliteTable(
  "action_proposals",
  {
    proposalId: text("proposal_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    entityId: text("entity_id"),
    proposedBy: text("proposed_by").notNull(),
    actorId: text("actor_id").notNull(),
    capability: text("capability").notNull(),
    payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
    confidenceScore: real("confidence_score").notNull(),
    status: text("status", {
      enum: ["pending", "approved", "rejected", "auto_approved", "discarded", "expired"],
    }).notNull(),
    reviewerId: text("reviewer_id"),
    reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
    reviewReason: text("review_reason"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    executedAt: integer("executed_at", { mode: "timestamp_ms" }),
    executionResult: text("execution_result", { mode: "json" }).$type<Record<string, unknown>>(),
    correlationId: text("correlation_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_proposals_tenant_status").on(table.tenantId, table.status),
    index("idx_proposals_reviewer").on(table.tenantId, table.reviewerId, table.status),
    index("idx_proposals_confidence").on(table.tenantId, table.confidenceScore),
  ]
);

export const governanceAuditLog = sqliteTable(
  "governance_audit_log",
  {
    auditId: text("audit_id").primaryKey(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.tenantId),
    proposalId: text("proposal_id"),
    actionType: text("action_type").notNull(),
    decision: text("decision"),
    actorType: text("actor_type").notNull(),
    actorId: text("actor_id").notNull(),
    reason: text("reason"),
    confidenceAtDecision: real("confidence_at_decision"),
    policyId: text("policy_id"),
    payloadHash: text("payload_hash").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_gov_audit_proposal").on(table.proposalId),
    index("idx_gov_audit_tenant_time").on(table.tenantId, table.timestamp),
  ]
);

export const hitlSessions = sqliteTable("hitl_sessions", {
  sessionId: text("session_id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  userId: text("user_id").notNull(),
  proposalId: text("proposal_id"),
  status: text("status", { enum: ["active", "idle", "closed"] }).notNull(),
  contextSnapshot: text("context_snapshot", { mode: "json" }).$type<Record<string, unknown>>(),
  startedAt: integer("started_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
  resolution: text("resolution", { enum: ["approved", "rejected", "modified", "escalated"] }),
});

export const policyRegistry = sqliteTable("policy_registry", {
  policyId: text("policy_id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  name: text("name").notNull(),
  description: text("description"),
  condition: text("condition", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  action: text("action").notNull(),
  priority: integer("priority").notNull().default(100),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
```

### 7.5 Tenant Isolation Helper

```typescript
// packages/spine-schema/src/helpers.ts
import { eq, and } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

/**
 * Injects tenant_id filter into any Drizzle query.
 * Usage: db.select().from(entities).where(withTenant(eq(entities.entityType, 'contact'), tenantId))
 */
export function withTenant<T extends SQLiteSelectQueryBuilder>(query: T, tenantId: string): T {
  return query.where(and(query._.where, eq(query._.table.tenantId, tenantId))) as T;
}

/**
 * Strict tenant check — throws if tenant_id mismatch detected.
 */
export function enforceTenantBound<T extends { tenantId: string }>(
  record: T,
  expectedTenantId: string
): T {
  if (record.tenantId !== expectedTenantId) {
    throw new Error(`CROSS-TENANT VIOLATION: expected ${expectedTenantId}, got ${record.tenantId}`);
  }
  return record;
}
```

---

## 8. TypeScript Interfaces & Contracts

### 8.1 Core Entity Contracts

```typescript
// packages/types/src/spine-entities.ts

/**
 * Canonical entity as stored in Spine.
 * All provider records resolve to this shape.
 */
export interface SpineEntity {
  entityId: string; // CUID2
  ssocUuid: string; // Stable UUID — survives provider swaps
  tenantId: string; // Isolation boundary
  entityType: EntityType;
  provider: ProviderName;
  providerId: string; // Native ID in provider system
  displayName: string;
  traits: EntityTraits;
  rawPayload?: Record<string, unknown>;
  confidenceScore: number; // 0.0–1.0
  version: number; // Optimistic locking
  lineageId?: string; // Provenance
  createdAt: number; // Unix ms
  updatedAt: number;
  archivedAt?: number;
}

export type EntityType =
  | "organization"
  | "contact"
  | "deal"
  | "task"
  | "document"
  | "event"
  | "metric"
  | "intent"
  | "workspace"
  | "capability"
  | string; // tenant-extensible

export type ProviderName =
  | "salesforce"
  | "hubspot"
  | "slack"
  | "stripe"
  | "linear"
  | "github"
  | "notion"
  | "figma"
  | "manual"
  | string;

/**
 * Entity relationship (graph edge).
 */
export interface EntityRelationship {
  relId: string;
  tenantId: string;
  sourceId: string; // SSOC UUID
  targetId: string; // SSOC UUID
  relType: RelationType;
  direction: "directed" | "bidirectional";
  confidence: number;
  metadata?: Record<string, unknown>;
  validFrom?: number;
  validUntil?: number;
  version: number;
  lineageId?: string;
  createdAt: number;
}

export type RelationType =
  | "belongs_to"
  | "manages"
  | "participated_in"
  | "authored"
  | "referenced_by"
  | "depends_on"
  | "triggered"
  | "blocked_by"
  | "owns"
  | "influences"
  | "succeeded"
  | "preceded"
  | string; // tenant-extensible
```

### 8.2 Memory Contracts

```typescript
// packages/types/src/memory.ts

export interface MemoryRecord {
  memoryId: string;
  tenantId: string;
  scope: MemoryScope;
  tier: MemoryTier;
  entityId?: string; // Optional linked entity SSOC
  memoryType: MemoryType;
  content: string;
  contentVector?: Uint8Array; // Vectorize embedding
  confidence: number;
  source: MemorySource;
  sourceRef?: string; // Audit correlation
  actorId?: string;
  accessCount: number;
  lastAccessedAt?: number;
  decayScore: number;
  reinforcementCount: number;
  validFrom?: number;
  validUntil?: number;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
}

export type MemoryScope = "personal" | "work" | "organization" | "ai";
export type MemoryTier = "active" | "staging" | "archived";
export type MemoryType =
  | "fact"
  | "observation"
  | "decision"
  | "preference"
  | "pattern"
  | "conversation"
  | "insight";
export type MemorySource = "twin" | "user" | "sync" | "mcp" | "governance" | "intelligence";

/**
 * Memory decay calculation.
 */
export interface DecayRule {
  scope: MemoryScope;
  halfLifeDays: number; // Days until decay_score = 0.5 without access
  reinforcementBoost: number; // Decay score increase per reinforcement
  minDecayScore: number; // Floor (e.g., 0.05)
  archiveThreshold: number; // Score at which tier → archived
}

export const DEFAULT_DECAY_RULES: DecayRule[] = [
  {
    scope: "personal",
    halfLifeDays: 60,
    reinforcementBoost: 0.2,
    minDecayScore: 0.1,
    archiveThreshold: 0.3,
  },
  {
    scope: "work",
    halfLifeDays: 30,
    reinforcementBoost: 0.15,
    minDecayScore: 0.05,
    archiveThreshold: 0.2,
  },
  {
    scope: "organization",
    halfLifeDays: 90,
    reinforcementBoost: 0.1,
    minDecayScore: 0.1,
    archiveThreshold: 0.25,
  },
  {
    scope: "ai",
    halfLifeDays: 14,
    reinforcementBoost: 0.25,
    minDecayScore: 0.05,
    archiveThreshold: 0.15,
  },
];
```

### 8.3 Governance Contracts

```typescript
// packages/types/src/governance.ts

export interface ActionProposal {
  proposalId: string;
  tenantId: string;
  entityId?: string;
  proposedBy: ActorType;
  actorId: string;
  capability: string; // e.g., "salesforce.opportunity.update"
  payload: Record<string, unknown>;
  confidenceScore: number;
  status: ProposalStatus;
  reviewerId?: string;
  reviewedAt?: number;
  reviewReason?: string;
  expiresAt: number;
  executedAt?: number;
  executionResult?: Record<string, unknown>;
  correlationId: string;
  createdAt: number;
}

export type ProposalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "auto_approved"
  | "discarded"
  | "expired";

export type ActorType = "user" | "agent" | "twin" | "system" | "webhook" | "mcp";

/**
 * Governance triage result.
 */
export interface TriageResult {
  decision: "approve" | "review" | "discard";
  confidence: number;
  reason: string;
  policyId?: string;
  estimatedRisk: "low" | "medium" | "high" | "critical";
}

/**
 * HITL session state (Durable Object).
 */
export interface HITLSession {
  sessionId: string;
  tenantId: string;
  userId: string;
  proposalId?: string;
  status: "active" | "idle" | "closed";
  contextSnapshot?: Entity360;
  startedAt: number;
  resolvedAt?: number;
  resolution?: "approved" | "rejected" | "modified" | "escalated";
}

/**
 * Entity360 — the complete context view for any entity.
 * Assembled by Intelligence service from Spine + Memory + Relationships.
 */
export interface Entity360 {
  entity: SpineEntity;
  relationships: {
    inbound: EntityRelationship[];
    outbound: EntityRelationship[];
  };
  memory: {
    active: MemoryRecord[];
    staging: MemoryRecord[];
  };
  timeline: TimelineEvent[];
  insights: string[];
  healthScore?: number;
  churnRisk?: number;
}

export interface TimelineEvent {
  timestamp: number;
  type: "created" | "updated" | "synced" | "action" | "milestone" | "alert";
  description: string;
  actor: ActorType;
  actorId: string;
  correlationId: string;
}
```

### 8.4 Tenant Contracts

```typescript
// packages/types/src/tenancy.ts

export interface Tenant {
  tenantId: string;
  slug: string;
  name: string;
  planId: string;
  config: TenantConfig;
  spineConfig: SpineConfig;
  rbacConfig: RBACConfig;
  ownerId?: string;
  billingEmail?: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export interface TenantConfig {
  enabledLenses: string[];
  enabledFeatures: string[];
  customEntityTypes?: string[];
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface SpineConfig {
  defaultTraits?: Record<string, unknown>;
  traitOverrides?: Record<string, Record<string, unknown>>;
  customRelations?: string[];
}

export interface RBACConfig {
  customRoles?: Array<{
    name: string;
    permissions: string[];
    level: number;
  }>;
  permissionOverrides?: Record<string, string[]>;
}

export interface User {
  userId: string;
  tenantId: string;
  email: string;
  authProvider?: string;
  authSubject?: string;
  profile: UserProfile;
  roleId?: string;
  mfaEnabled: boolean;
  lastLoginAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  timezone?: string;
  preferences?: Record<string, unknown>;
}

export interface RBACRole {
  roleId: string;
  tenantId: string;
  name: string;
  permissions: string[];
  level: number;
  isSystem: boolean;
  createdAt: number;
}
```

---

## 9. Flow Descriptions — Services, Queues, Boundaries

### 9.1 Spine Write Flow (The One Write Path)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          SPINE WRITE FLOW — ONLY PATH                                │
│                                                                                      │
│   Provider ──► Webhook/Sync ──► Normalizer ──► PIPELINE_QUEUE ──► Pipeline ──► D1   │
│      │                             │                    │              │              │
│      │                             │                    │              ▼              │
│      │                             │                    │      ┌───────────────┐       │
│      │                             │                    │      │  Pipeline     │       │
│      │                             │                    │      │  Service      │       │
│      │                             │                    │      │               │       │
│      │                             │                    │      │ 1. Validate   │       │
│      │                             │                    │      │ 2. SSOC bind  │       │
│      │                             │                    │      │ 3. INSERT D1  │       │
│      │                             │                    │      │ 4. Audit log  │       │
│      │                             │                    │      │ 5. Enrich KV  │       │
│      │                             │                    │      └───────┬───────┘       │
│      │                             │                    │              │               │
│      │                             │                    │              ▼               │
│      │                             │                    │      ┌───────────────┐        │
│      │                             │                    │      │   D1 Spine    │        │
│      │                             │                    │      │   (entities)  │        │
│      │                             │                    │      └───────────────┘        │
│      │                             │                    │                               │
│      │                             │                    │      ┌───────────────┐        │
│      │                             │                    │      │ spine_audit_log│        │
│      │                             │                    │      │ (immutable)   │        │
│      │                             │                    │      └───────────────┘        │
│      │                             │                    │                               │
│      │                             │                    └──────► If audit fails: HALT   │
│      │                             │                                                     │
│      │                             └────────────────────────────────────────────────────►
│      │                                     No other service writes to D1 Spine          │
│      │                                                                                  │
│      └─────────────────────────────────────────────────────────────────────────────────►
│                                     Read paths: store, l2, intelligence, twin (via bindings)
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Flow Steps:**

1. **Inbound Signal** — `webhook-ingress` receives webhook or `connector-sync` polls provider.
2. **Normalizer** — 8-stage pipeline (NA0–NA5): parse → trait-detect → resolve-type → resolve-entity → link-rels → enrich-map → validate → emit-canonical.
3. **PIPELINE_QUEUE** — Cloudflare Queue carries canonical records to Pipeline.
4. **Pipeline Service** (ONLY WRITER):
   - Validates tenant scoping (`WHERE tenant_id = ?`)
   - Resolves/binds SSOC (INSERT or UPDATE `ssoc_index`)
   - INSERT/UPDATE `entities` and `relationships`
   - WRITE `spine_audit_log` (atomic with entity write)
   - WRITE `lineage_records` for provenance
   - UPDATE KV cache for hot entities
5. **If audit write fails** — entire transaction is rolled back. Operation halts. Alert emitted to `telemetry`.

### 9.2 Memory Intake & Triage Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MEMORY INTAKE & TRIAGE FLOW                             │
│                                                                              │
│   Source: Pipeline write / Twin output / User action / MCP invocation        │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────┐                                                       │
│   │  MEMORY_INTAKE  │  Queue: MEMORY_INTAKE_QUEUE                           │
│   │     QUEUE       │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────┐     ┌─────────────────┐                               │
│   │  continuity     │────►│   TriageBot     │  (runs inside Hermes DO)      │
│   │  service        │     │   (confidence   │                               │
│   │                 │     │    scoring)     │                               │
│   └─────────────────┘     └────────┬────────┘                               │
│                                    │                                         │
│                     ┌──────────────┼──────────────┐                         │
│                     ▼              ▼              ▼                         │
│              ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│              │ ≥ 0.85   │  │0.70-0.85 │  │ < 0.70   │                      │
│              │ ACTIVE   │  │ STAGING  │  │ DISCARD  │                      │
│              │  tier    │  │  tier    │  │  (R2)    │                      │
│              └────┬─────┘  └────┬─────┘  └────┬─────┘                      │
│                   │             │             │                            │
│                   ▼             ▼             ▼                            │
│              ┌────────┐   ┌────────┐   ┌────────┐                         │
│              │ D1 + KV│   │ D1 only│   │ R2 cold│                         │
│              │ <10ms  │   │ <100ms │   │ storage│                         │
│              │        │   │        │   │ (audit)│                         │
│              └────────┘   └────────┘   └────────┘                         │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  DECAY JOB (continuity service, daily cron)                     │       │
│   │                                                                 │       │
│   │  FOR each active memory WHERE last_accessed > 30 days:          │       │
│   │    decay_score *= 0.5                                           │       │
│   │    IF decay_score < archive_threshold:                          │       │
│   │      → tier = 'archived'                                        │       │
│   │      → INSERT decay_log                                         │       │
│   │      → content offloaded to R2                                  │       │
│   │                                                                 │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Governance Flow — Proposal to Execution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE FLOW — PROPOSAL TO EXECUTION                   │
│                                                                              │
│   Twin / Agent / User                                                        │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────┐                                                       │
│   │  PROPOSE action │  → INSERT action_proposals (status: pending)          │
│   │                 │  → INSERT governance_audit_log                         │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────┐                                                       │
│   │  govern service │  Evaluate confidence + policy rules                   │
│   │                 │                                                       │
│   │  IF confidence >= 0.85:                                                 │
│   │    → status = 'auto_approved'                                           │
│   │    → enqueue ACT_QUEUE                                                  │
│   │                                                                         │
│   │  ELSE IF confidence >= 0.70:                                            │
│   │    → status = 'pending'                                                 │
│   │    → CREATE HITL session (DO)                                           │
│   │    → NOTIFY user (My Desk)                                              │
│   │                                                                         │
│   │  ELSE:                                                                  │
│   │    → status = 'discarded'                                               │
│   │    → audit only                                                         │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│     ┌──────┴──────┬────────────┐                                             │
│     ▼             ▼            ▼                                             │
│  ┌──────┐   ┌──────────┐  ┌────────┐                                        │
│  │AUTO  │   │  MY DESK │  │DISCARD │                                        │
│  │EXEC  │   │  (HITL)  │  │        │                                        │
│  └──┬───┘   └────┬─────┘  └────────┘                                        │
│     │            │                                                           │
│     ▼            ▼                                                           │
│  ACT_QUEUE   User approves/rejects/modifies                                  │
│     │            │                                                           │
│     ▼            ▼                                                           │
│  ┌──────┐   ┌──────────┐                                                    │
│  │ act  │   │  UPDATE  │  action_proposals status                            │
│  │svc   │   │  INSERT  │  governance_audit_log                               │
│  └──┬───┘   └────┬─────┘                                                    │
│     │            │                                                           │
│     └────────────┘                                                           │
│            │                                                                 │
│            ▼                                                                 │
│     ┌──────────────┐                                                        │
│     │ Pipeline     │  Writeback: execution result → Spine                    │
│     │ (ONLY WRITER)│  → INSERT/UPDATE entities                                │
│     │              │  → INSERT spine_audit_log                                │
│     └──────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Security Boundary Annotations

### 10.1 Data Plane Security Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SECURITY BOUNDARIES — DATA PLANE                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 1: TENANT ISOLATION (Row-Level)                            │    │
│  │ ───────────────────────────────────────                             │    │
│  │ Every table has tenant_id. Every query has WHERE tenant_id = ?.      │    │
│  │ Drizzle helper: withTenant(query, tenantId)                         │    │
│  │ Failure mode: 403 fail-loud (never 404 — don't leak existence)       │    │
│  │ Owner: ALL services                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 2: WRITE PROTECTION (Pipeline Only)                        │    │
│  │ ───────────────────────────────────────────                         │    │
│  │ Only iw-pipeline has D1 INSERT/UPDATE/DELETE on Spine tables.        │    │
│  │ Other services read via service bindings or read replicas.           │    │
│  │ Audit: spine_audit_log records every write with actor + payload hash │    │
│  │ Failure mode: Halt operation if audit write fails                    │    │
│  │ Owner: pipeline service                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 3: GOVERNANCE GATE (Confidence Scored)                     │    │
│  │ ───────────────────────────────────────────────                     │    │
│  │ No action executes without governance scoring.                       │    │
│  │ Auto-execute only at ≥ 0.85 confidence.                              │    │
│  │ Human review at 0.70–0.85.                                           │    │
│  │ Discard below 0.70.                                                  │    │
│  │ Audit: governance_audit_log immutable.                               │    │
│  │ Owner: govern service                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 4: HITL SESSION ISOLATION (DO-Level)                       │    │
│  │ ─────────────────────────────────────────────                       │    │
│  │ HITL Durable Objects keyed by tenant_id + user_id.                   │    │
│  │ NEVER use global DO. NEVER share DO across tenants.                  │    │
│  │ Session context scoped to tenant + user only.                        │    │
│  │ Owner: govern service                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 5: MEMORY SCOPE ISOLATION                                  │    │
│  │ ────────────────────────────────────                                │    │
│  │ Personal memory: accessible only to owning user.                     │    │
│  │ Work memory: accessible to project/task members.                     │    │
│  │ Organization memory: accessible to all tenant members.               │    │
│  │ AI memory: accessible to Twin and governance audit.                  │    │
│  │ Owner: continuity service                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ BOUNDARY 6: SSOC RESOLUTION (Identity Integrity)                    │    │
│  │ ────────────────────────────────────────────────                    │    │
│  │ Provider ID → SSOC binding is immutable once established.            │    │
│  │ Merges create audit trail in ssoc_index.merge_history.               │    │
│  │ No entity exists without SSOC binding.                               │    │
│  │ Owner: normalizer (NA2 stage), pipeline                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Security Checklist for Data Model

| #   | Check                                | Enforcement                                   | Verification                        |
| --- | ------------------------------------ | --------------------------------------------- | ----------------------------------- |
| 1   | No cross-tenant queries              | `withTenant()` on every query                 | Static analysis + runtime assertion |
| 2   | No direct D1 writes outside Pipeline | Service binding permissions                   | Integration test                    |
| 3   | Audit log append-only                | No UPDATE/DELETE on audit tables              | Schema-level trigger                |
| 4   | HITL DO not global                   | `idFromName(tenantId + userId)`               | Unit test                           |
| 5   | Memory scope enforced                | Query filter by scope + user membership       | Integration test                    |
| 6   | Proposal expiry enforced             | `expires_at` checked before execution         | Unit test                           |
| 7   | Soft delete only                     | `archived_at` / `deleted_at` — no hard DELETE | Schema review                       |
| 8   | Payload hashed                       | SHA-256 on all audit entries                  | Unit test                           |
| 9   | Correlation ID present               | Required on all audit + proposal records      | Schema NOT NULL                     |
| 10  | Tenant_id in JWT, not payload        | Gateway extraction only                       | Integration test                    |

---

## 11. Integration Points with Adjacent Layers

### 11.1 North-South Integration Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 DATA MODEL — ADJACENT LAYER INTEGRATION                      │
│                                                                              │
│  NORTH (Ingress / Consumers)                                                 │
│  ───────────────────────────                                                 │
│                                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │   Gateway   │────►│  Discovery  │────►│   MCP Pool  │                   │
│  │             │     │  (Registry) │     │  (Inbound)  │                   │
│  └─────────────┘     └─────────────┘     └──────┬──────┘                   │
│        │                                        │                            │
│        │ JWT + tenant_id                        │ tool catalog filtered       │
│        │                                        │ by tenant capabilities      │
│        ▼                                        ▼                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA MODEL BOUNDARY                          │    │
│  │  Reads: entities, memory, proposals (via store, l2, intelligence)    │    │
│  │  Writes: NONE (all writes route through Pipeline)                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│        ▲                                        ▲                            │
│        │                                        │                            │
│        │ Service bindings                       │ Service bindings           │
│        │                                        │                            │
│  SOUTH (Egress / Providers)                                                  │
│  ───────────────────────────                                                 │
│                                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │   Act       │◄────│  Adapter    │◄────│   MCP Pool  │                   │
│  │  Service    │     │  Modules    │     │  (Outbound) │                   │
│  └──────┬──────┘     └─────────────┘     └─────────────┘                   │
│         │                                                                    │
│         │ Writeback ──► Pipeline ──► D1                                     │
│         │                                                                    │
│  ┌──────┴──────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │  Connector  │     │  Connector  │     │  Normalizer │                   │
│  │  (OAuth)    │     │  Sync       │     │  (8-stage)  │                   │
│  └─────────────┘     └─────────────┘     └─────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Integration Points Detail

| Adjacent Layer                | Direction  | Integration Point                                           | Data Model Interaction                                      | Contract                           |
| ----------------------------- | ---------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **Identity (Layer 1)**        | Read       | `tenants`, `users`, `rbac_roles`                            | Auth checks against RBAC; tenant resolution                 | JWT claims + service binding       |
| **Ingress (Layer 2)**         | Read       | `entities` (via `store`)                                    | MCP tool catalog assembled from entity types + capabilities | Discovery response                 |
| **Capability (Layer 3)**      | Read       | `memory`, `entities`                                        | Context assembly for Twin reasoning                         | Entity360 interface                |
| **Continuity (Layer 4)**      | Read/Write | `memory`, `memory_graph`, `decay_log`                       | Memory intake, triage, decay                                | MemoryRecord + TriageResult        |
| **Governance (Layer 5)**      | Read/Write | `action_proposals`, `governance_audit_log`, `hitl_sessions` | Proposal lifecycle, approval gates                          | ActionProposal + TriageResult      |
| **Provider Fabric (Layer 6)** | Write      | `entities` (via Pipeline writeback)                         | Execution results written to Spine                          | ExecutionResult → Pipeline enqueue |
| **Normalizer**                | Write      | `entities`, `relationships`, `ssoc_index`                   | 8-stage pipeline output → Pipeline                          | PIPELINE_QUEUE message             |
| **Telemetry**                 | Read       | `spine_audit_log`, `governance_audit_log`                   | Metrics, traces, anomaly detection                          | Audit stream                       |

### 11.3 Queue Contracts

```typescript
// PIPELINE_QUEUE message schema
interface PipelineMessage {
  type:
    | "entity_create"
    | "entity_update"
    | "entity_delete"
    | "relationship_create"
    | "execution_result";
  tenantId: string;
  correlationId: string;
  payload: {
    entity?: Partial<SpineEntity>;
    relationships?: Partial<EntityRelationship>[];
    ssocBinding?: { provider: string; providerId: string; ssocUuid: string };
    auditContext: {
      actorType: ActorType;
      actorId: string;
      via: string;
    };
  };
  timestamp: number;
}

// ACT_QUEUE message schema
interface ActMessage {
  type: "capability_execute" | "workflow_step" | "proposal_approved";
  tenantId: string;
  correlationId: string;
  proposalId?: string;
  capability: string;
  payload: Record<string, unknown>;
  entity360?: Entity360; // Injected context
  approvedBy?: string; // user_id if HITL-approved
  timestamp: number;
}

// MEMORY_INTAKE_QUEUE message schema
interface MemoryIntakeMessage {
  tenantId: string;
  correlationId: string;
  source: MemorySource;
  actorId: string;
  entityId?: string;
  content: string;
  confidence?: number; // Pre-scored (optional)
  scope: MemoryScope;
  memoryType: MemoryType;
  timestamp: number;
}
```

---

## 12. Appendix: SSOC Resolution & Lineage

### 12.1 SSOC Resolution Algorithm

```
INPUT: provider, providerId, tenantId, entityType, traits
OUTPUT: ssocUuid (existing or newly generated)

1. EXACT MATCH:
   SELECT ssoc_uuid FROM ssoc_index
   WHERE tenant_id = ?
   AND provider_map->>'provider' = 'providerId'
   → If found: RETURN ssoc_uuid

2. FUZZY MATCH (for contacts/organizations):
   SELECT ssoc_uuid, provider_map FROM ssoc_index
   WHERE tenant_id = ?
   AND canonical_type = ?
   → Score each candidate:
     - Email exact match: +1.0
     - Domain match: +0.5
     - Name similarity > 0.9: +0.7
     - Phone match: +0.8
   → If max_score > 0.85: RETURN that ssoc_uuid
   → If max_score 0.70-0.85: ENQUEUE to TriageBot
   → If max_score < 0.70: CREATE new SSOC

3. CREATE NEW:
   ssoc_uuid = generateCuid()
   INSERT ssoc_index (ssoc_uuid, tenant_id, canonical_type, provider_map)
   RETURN ssoc_uuid

4. AUDIT:
   INSERT spine_audit_log (action_type='ssoc_bind', ...)
```

### 12.2 Lineage Record Structure

```typescript
interface LineageRecord {
  lineageId: string; // CUID2
  tenantId: string;
  syncJobId?: string; // Reference to connector-sync job
  normalizerRunId?: string; // Reference to normalizer batch
  stage: string; // 'na0', 'na1', 'na2', 'na3', 'na4', 'na5', 'pipeline', 'act'
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  errorLog?: string[];
  startedAt: number;
  completedAt?: number;
  triggeredBy: string; // Actor / service / cron
}
```

### 12.3 Schema Migration Rules

1. **Additive only** in production — never rename columns, never remove columns.
2. **Soft schema** — `traits` JSON column absorbs schema evolution without migrations.
3. **Tenant-specific types** — `entity_types` table allows per-tenant extension without affecting other tenants.
4. **Migration files** live in `packages/spine-schema/migrations/` and are applied via `wrangler d1 migrations apply`.
5. **Rollback plan** — every migration has a corresponding rollback script tested in staging.

---

**END OF SPECIFICATION**

_IntegrateWise Continuity Bridge v2.0 — Data Model & Entity Relationships. This document is Stage 1/2 deep-dive output feeding the canonical architecture document. All schemas, interfaces, and flows are production-intended and must be validated against P0 security requirements before deployment._
