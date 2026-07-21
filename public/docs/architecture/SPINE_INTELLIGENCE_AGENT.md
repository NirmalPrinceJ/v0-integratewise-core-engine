# Spine Intelligence Agent — Specification

> **Status:** Canonical architecture specification  
> **Date:** July 6, 2026  
> **Authority:** Nirmal (Founder)  
> **Companion docs:** `SPINE_DOMAIN.md` (three-layer model), `SPINE_MODEL.md` (physical storage), `PROJECTION_MODEL.md` (read views)  
> **Purpose:** Defines the pipeline that turns domain inputs into a self-describing Spine Domain, emitting all downstream artifacts.

---

## 0. The One-Line Truth

```text
The Spine Intelligence Agent never generates SQL first.
It builds an internal graph. Everything derives from the graph.
```

---

## 1. The Pipeline (High Level)

```text
Repository
Documentation
Connector Metadata
Database Schema
OpenAPI Specs
TypeScript Types
Existing Spine
Business Definitions
        │
        ▼
┌─────────────────────┐
│ Schema Extraction   │  Parse all inputs. Extract entities, fields, types.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Ontology Generation │  Build the internal graph: nodes (entities, memories) + edges (relationships).
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Relationship        │  Discover implicit connections. Infer cardinality, directionality,
│ Discovery           │  dependency chains, and signal propagation paths.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Entity Normalization│  Collapse synonyms. Resolve aliases. Enforce canonical types.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Memory Classification│  Separate immutable truth (Spine) from derived opinion (Memory).
│                      │  Tag each attribute with its layer: canonical, dynamic, projection-only.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Capability Detection │  Identify what the domain can do. Map capabilities to projections.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Projection Generation│  Build team-specific views. No duplication. Only declaration.
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Code Generation     │  Emit SQL, JSON, TypeScript, and documentation from the graph.
└─────────────────────┘
```

---

## 2. Inputs (What the Agent Consumes)

The agent accepts any combination of these inputs. The more inputs, the richer the graph.

| Input                  | Format                               | What it provides                                              | Example                                                               |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `repository`           | Git repo, code files                 | Existing data models, TypeScript types, API handlers          | `packages/types/src/schema.ts`                                        |
| `documentation`        | Markdown, PDF, Confluence            | Business definitions, process descriptions, domain language   | Account Success PDF                                                   |
| `connector_metadata`   | Nango connector manifest, API schema | External system entity types, field mappings, sync rules      | Salesforce connector spec                                             |
| `database_schema`      | SQL DDL, D1 schema, ER diagram       | Existing tables, columns, indexes, constraints                | `033_spine_accounts_intelligence.sql`                                 |
| `openapi_specs`        | OpenAPI 3.0 JSON/YAML                | API contract definitions, endpoints, request/response schemas | `/api/v1/accounts` spec                                               |
| `typescript_types`     | `.ts` files, interfaces, enums       | Type-level entity definitions, runtime validation schemas     | `zod` schemas, `interface` defs                                       |
| `existing_spine`       | JSON/YAML, SQL                       | Current canonical entities, aliases, domain configs           | `DOMAIN_SPINE_CONFIG`                                                 |
| `business_definitions` | Natural language, structured docs    | Domain vocabulary, business rules, entity relationships       | "An Account has many Contacts. A Contact works for one Organization." |

---

## 3. Stage 1 — Schema Extraction

### 3.1 Purpose

Parse all inputs into a normalized intermediate representation. Do not judge yet. Extract everything.

### 3.2 Output: `ExtractedSchema`

```json
{
  "sources": [
    {
      "source_id": "src_001",
      "type": "database_schema",
      "file": "033_spine_accounts_intelligence.sql",
      "confidence": 1.0
    }
  ],
  "entities": [
    {
      "entity_id": "ext_001",
      "source_ids": ["src_001"],
      "name": "spine_accounts",
      "kind": "table",
      "attributes": [
        { "name": "id", "type": "uuid", "nullable": false, "is_primary": true },
        { "name": "tenant_id", "type": "uuid", "nullable": false },
        {
          "name": "data",
          "type": "jsonb",
          "nullable": false,
          "comment": "JSONB blob containing name, industry, region, tier, arr_usd..."
        }
      ],
      "extracted_from": "033_spine_accounts_intelligence.sql"
    }
  ],
  "relationships": [
    {
      "relationship_id": "rel_001",
      "source_ids": ["src_001"],
      "from_entity": "spine_accounts",
      "to_entity": "spine_people",
      "type": "implicit",
      "evidence": "both have tenant_id and scope->account_id"
    }
  ]
}
```

### 3.3 Rules

- Preserve provenance. Every extracted entity and relationship carries a `source_id`.
- Do not normalize yet. Extract raw tables as they are. Extract `data JSONB` fields as pseudo-attributes with comments.
- Extract implicit relationships from foreign keys, `scope` JSONB references, shared `tenant_id`, and naming conventions.
- Extract entities from TypeScript types, OpenAPI schemas, and natural language as first-class citizens, not as tables.

---

## 4. Stage 2 — Ontology Generation

### 4.1 Purpose

Transform the extracted schema into a **domain ontology** — a graph of what the domain is actually about, independent of physical representation.

### 4.2 Output: `DomainOntology`

```json
{
  "domain": "account_success",
  "version": "1.0.0",
  "nodes": [
    {
      "node_id": "node_account",
      "canonical_name": "Account",
      "aliases": ["spine_accounts", "Company", "Customer", "HubSpot Company", "Salesforce Account"],
      "layer": "canonical_spine",
      "attributes": [
        { "name": "name", "type": "text", "required": true, "source": "extracted" },
        { "name": "industry", "type": "text", "required": false, "source": "extracted" },
        { "name": "region", "type": "text", "required": false, "source": "extracted" },
        { "name": "tier", "type": "text", "required": false, "source": "inferred" },
        { "name": "arr_usd", "type": "decimal", "required": false, "source": "extracted" }
      ],
      "provenance": ["ext_001", "ext_042"]
    },
    {
      "node_id": "node_health",
      "canonical_name": "Health",
      "aliases": ["health_score", "account_health"],
      "layer": "dynamic_memory",
      "attributes": [
        { "name": "score", "type": "decimal", "required": true, "source": "inferred" },
        { "name": "score_label", "type": "text", "required": false, "source": "inferred" },
        { "name": "reasoning", "type": "text", "required": false, "source": "inferred" },
        { "name": "confidence", "type": "decimal", "required": true, "source": "inferred" }
      ],
      "provenance": ["ext_087"]
    }
  ],
  "edges": [
    {
      "edge_id": "edge_001",
      "from": "node_account",
      "relation_type": "has_state",
      "to": "node_health",
      "cardinality": "1:N",
      "directionality": "directed",
      "temporal": true,
      "evidence": "health is computed per account over time"
    },
    {
      "edge_id": "edge_002",
      "from": "node_account",
      "relation_type": "owns",
      "to": "node_contract",
      "cardinality": "1:N",
      "directionality": "directed",
      "temporal": false,
      "evidence": "business rule: an account has one or more contracts"
    }
  ]
}
```

### 4.3 Rules

- **Nodes are canonical entities or memory types.** No tables. No JSONB blobs. Real concepts.
- **Edges are typed and have metadata.** Every edge has cardinality, directionality, temporality, and evidence.
- **Aliases are first-class.** The ontology captures every name this concept has ever been called. This is how entity resolution works.
- **Layer assignment is explicit.** Every node is tagged `canonical_spine`, `dynamic_memory`, or `projection`. No ambiguity.
- **Attributes carry source.** Every attribute knows whether it was extracted from code, inferred from documentation, or derived from business rules.

---

## 5. Stage 3 — Relationship Discovery

### 5.1 Purpose

Find relationships that were not explicitly stated in any input. Infer connections from naming, co-occurrence, business logic, and graph topology.

### 5.2 Discovery methods

| Method               | What it does                          | Example                                                       |
| -------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `naming_inference`   | Similar names suggest relationships   | `account_id` in `scope` → `Account`                           |
| `co_occurrence`      | Entities that appear together in docs | "Account health" → Account → Health                           |
| `business_logic`     | Domain rules imply connections        | "A renewal is a subscription event" → Contract → Subscription |
| `graph_traversal`    | Transitive closure over known edges   | Account → Contract → Subscription → Capability → Integration  |
| `signal_propagation` | How signals flow across the domain    | Usage → Health → Risk → Playbook                              |

### 5.3 Output: `EnrichedOntology`

Same shape as `DomainOntology`, but with additional edges, edge weights, and confidence scores. Every discovered edge has a `discovery_method` and `confidence` (0.0–1.0).

---

## 6. Stage 4 — Entity Normalization

### 6.1 Purpose

Collapse aliases. Resolve conflicts. Enforce the canonical type system.

### 6.2 Normalization rules

1. **One canonical name per real-world concept.** `spine_accounts`, `Company`, `Customer`, `HubSpot Company`, `Salesforce Account` → `Account`.
2. **Attribute merge with provenance.** If two sources define `Account` differently, merge attributes and keep both provenance records. Flag conflicts for human review.
3. **Type coercion.** Normalize types to a canonical type system: `text`, `integer`, `decimal`, `boolean`, `date`, `datetime`, `uuid`, `json`, `enum`.
4. **Required vs. optional.** An attribute is required only if ALL sources agree it is required. Otherwise, optional.
5. **Tenant scoping.** Every entity and memory node inherits `tenant_id` as an implicit, non-optional attribute. It is never listed in the ontology but is always present in the emitted SQL.

### 6.3 Output: `NormalizedOntology`

Same shape as `DomainOntology`, but aliases are collapsed, attributes are merged, and every node has a single canonical name.

---

## 7. Stage 5 — Memory Classification

### 7.1 Purpose

For every attribute and every node, decide: **Spine or Memory?** This is the critical layer-separation gate.

### 7.2 Classification criteria

| Criterion       | Spine                                         | Memory                              |
| --------------- | --------------------------------------------- | ----------------------------------- |
| Source          | External system, manual entry, legal document | Derived, computed, AI-generated     |
| Mutability      | Changes only when the world changes           | Changes when the model changes      |
| Truth claim     | "This is what exists"                         | "This is what we believe"           |
| Versioning      | Append-only, immutable history                | Ephemeral, TTL-driven, overwritable |
| Human authority | Data entry, system sync                       | AI inference, heuristic, ML model   |
| Confidence      | 1.0 (assumed)                                 | 0.0–1.0 (explicit)                  |

### 7.3 Classification process

```text
For each node in the NormalizedOntology:
    If all attributes pass Spine criteria → tag 'canonical_spine'
    If any attribute passes Memory criteria → tag 'dynamic_memory'
    If the node is a view over other nodes → tag 'projection'
    If mixed → split the node into a Spine node (immutable attrs) + Memory node (derived attrs)
```

### 7.4 Example: splitting a mixed node

Input: `spine_platform_metrics` from old schema

- `metric_name` → Spine (it's a real thing being measured)
- `current_value` → Memory (it's a measurement at a point in time)
- `health_status` → Memory (it's an interpretation)
- `business_impact_status` → Memory (it's an assessment)

Output:

- `spine_metric_definitions` (canonical_spine) — `metric_name`, `unit`, `measurement_frequency`, `data_source`
- `memory_usage` (dynamic_memory) — `current_value`, `target_value`, `health_status`, `business_impact_status`, `measured_at`

### 7.5 Output: `ClassifiedOntology`

Every node has a `layer` tag: `canonical_spine`, `dynamic_memory`, or `projection`. Every attribute has a `stability` tag: `immutable` or `ephemeral`.

---

## 8. Stage 6 — Capability Detection

### 8.1 Purpose

Identify what the domain **can do** — not just what it has. Capabilities map to projections (which team can do what) and to routes (which API endpoints expose what).

### 8.2 Capability model

```json
{
  "capability_id": "cap_view_account_health",
  "name": "View Account Health",
  "domain": "account_success",
  "requires": [
    { "node": "node_account", "layer": "canonical_spine", "access": "read" },
    { "node": "node_health", "layer": "dynamic_memory", "access": "read" }
  ],
  "produces": [{ "node": "node_health", "layer": "dynamic_memory", "action": "generate" }],
  "governance_gate": "can_view_health",
  "projections": ["projection-account-success", "projection-executive"],
  "routes": ["GET /api/v1/accounts/{id}/health"]
}
```

### 8.3 Detection rules

- **CRUD over Spine nodes = capabilities.** `create_account`, `read_account`, `update_account`, `delete_account`.
- **CRUD over Memory nodes = capabilities.** `generate_health`, `refresh_sentiment`, `archive_insight`.
- **Traversal over edges = capabilities.** `view_account_contacts`, `view_deployment_integrations`.
- **Multi-node operations = advanced capabilities.** `generate_qbr_package` (Account + Health + Engagement + Timeline + Insights).

### 8.4 Output: `CapabilityCatalog`

A catalog of all capabilities in the domain, linked to required nodes, projections, and routes.

---

## 9. Stage 7 — Projection Generation

### 9.1 Purpose

Build team-specific views from the ClassifiedOntology + CapabilityCatalog. No duplication. Only declaration.

### 9.2 Projection generation rules

1. **Start with the team.** Define the target persona: role, department, goals, decisions they make.
2. **Select nodes.** From the ClassifiedOntology, pick Spine nodes + Memory nodes relevant to that persona.
3. **Filter edges.** From the EnrichedOntology, select only edges connecting included nodes. Prune dangling edges.
4. **Define depth.** How many hops from the primary entity? `direct` (1 hop) vs. `indirect` (2 hops). For CSM: Account → Person (direct), Account → Contract → Subscription (indirect).
5. **Field policy.** For each included node, list which fields are visible, searchable, and AI-readable.
6. **Governance gates.** Map capabilities to `can_act`, `can_approve`, `can_admin`.
7. **Navigation.** Declare primary and secondary nav items based on included nodes.
8. **Entity 360.** Define the tabs and metrics for the primary entity's detail view.

### 9.3 Output: `ProjectionConfig`

One JSON file per projection. See `SPINE_DOMAIN.md` §5.4 for the format.

---

## 10. Stage 8 — Code Generation

### 10.1 Purpose

Emit all downstream artifacts from the graph. Every artifact is a deterministic function of the ClassifiedOntology + CapabilityCatalog + ProjectionConfigs.

### 10.2 Emission map

| Artifact                | Source                          | Format   | Destination                                       |
| ----------------------- | ------------------------------- | -------- | ------------------------------------------------- |
| `spine_*.sql`           | `canonical_spine` nodes         | SQL DDL  | `migrations/spine/`                               |
| `memory_*.sql`          | `dynamic_memory` nodes          | SQL DDL  | `migrations/memory/`                              |
| `routes.json`           | CapabilityCatalog               | JSON     | `services/gateway/config/routes.json`             |
| `navigation.json`       | ProjectionConfigs               | JSON     | `apps/web/config/navigation.json`                 |
| `projection-*.json`     | ProjectionConfigs               | JSON     | `domains/{domain}/projection-*.json`              |
| `rbac.json`             | CapabilityCatalog + projections | JSON     | `services/governance/config/rbac.json`            |
| `search.json`           | All nodes + field policies      | JSON     | `services/knowledge/config/search.json`           |
| `entity360.json`        | ProjectionConfigs               | JSON     | `domains/{domain}/entity360.json`                 |
| `knowledge-schema.json` | All nodes + relationships       | JSON     | `services/knowledge/config/knowledge-schema.json` |
| TypeScript types        | All nodes + attributes          | `.ts`    | `packages/types/src/generated/`                   |
| OpenAPI specs           | CapabilityCatalog + routes      | YAML     | `docs/api/openapi/`                               |
| Documentation           | Everything                      | Markdown | `docs/generated/`                                 |

### 10.3 Generation rules

1. **SQL is generated, not written.** Every `spine_*.sql` and `memory_*.sql` file is produced by the Code Generation stage from the ClassifiedOntology. No hand-written SQL for new domains.
2. **JSON is declarative.** Every JSON config file is a projection of the graph. It does not contain business logic — only declarations of what the graph provides.
3. **TypeScript is synchronized.** Types are generated from the ontology. If the ontology changes, the types are regenerated. No manual type maintenance.
4. **Documentation is live.** Every generated document carries a `generated_at` timestamp and a `source_hash` of the ontology. Stale docs are detectable.
5. **Idempotency.** Running the agent twice with the same inputs produces identical outputs. The pipeline is deterministic.

---

## 11. The Internal Graph Format

The agent uses a standard intermediate graph format for all internal representations. This format is the **source of truth** for all downstream generation.

```json
{
  "graph": {
    "version": "1.0.0",
    "domain": "account_success",
    "metadata": {
      "generated_at": "2026-07-06T00:00:00Z",
      "source_hashes": ["sha256:abc123..."],
      "agent_version": "spine-intelligence-agent@1.0.0"
    },
    "nodes": [
      {
        "id": "node_account",
        "type": "canonical_spine",
        "name": "Account",
        "aliases": ["spine_accounts", "Company", "Customer"],
        "attributes": [...],
        "provenance": [...]
      }
    ],
    "edges": [
      {
        "id": "edge_001",
        "from": "node_account",
        "relation_type": "has_state",
        "to": "node_health",
        "metadata": { "cardinality": "1:N", "temporal": true, "confidence": 0.95 }
      }
    ],
    "capabilities": [...],
    "projections": [...]
  }
}
```

---

## 12. Continuous Evolution

### 12.1 The Spine becomes self-describing

When a new domain is onboarded:

1. Feed the agent domain definitions, APIs, and documentation.
2. The agent discovers entities, relationships, capabilities, and memory models.
3. It generates the canonical Spine schema.
4. It generates projections, navigation, RBAC, routes, Entity360 definitions, search indexes, and documentation.
5. It emits a CHANGELOG of what changed from the previous run.

### 12.2 Change detection

The agent compares its output to the previous run:

- **New nodes/edges:** Added to Spine or Memory schema.
- **Removed nodes/edges:** Flagged for deprecation review. Never auto-delete.
- **Changed attributes:** Generate migration scripts. Flag for data migration.
- **New capabilities:** Generate routes and RBAC entries.
- **New projections:** Generate projection configs and UI declarations.

### 12.3 Human-in-the-loop for destructive changes

The agent is autonomous for additive changes. Destructive changes (removal, type narrowing, constraint tightening) require human approval via the HITL orchestrator.

---

## 13. Integration with Existing Platform

### 13.1 Where the agent lives

```text
services/
  spine-intelligence-agent/
    src/
      pipeline/
        stage1-extract.ts        -- Schema Extraction
        stage2-ontology.ts       -- Ontology Generation
        stage3-relationships.ts  -- Relationship Discovery
        stage4-normalize.ts      -- Entity Normalization
        stage5-classify.ts       -- Memory Classification
        stage6-capabilities.ts   -- Capability Detection
        stage7-projections.ts    -- Projection Generation
        stage8-codegen.ts        -- Code Generation
      graph/
        graph-model.ts           -- Internal graph format
        graph-store.ts           -- Durable graph storage (D1)
      inputs/
        parsers/                 -- One parser per input type
      outputs/
        emitters/                -- One emitter per artifact type
    config/
      default-rules.json         -- Classification rules, detection thresholds
      domain-templates/          -- Seed templates per domain
```

### 13.2 How it fits into the OODA loop

```text
Observe:  Ingest new inputs (repo changes, doc updates, schema drift)
Orient:   Build/refresh the graph (Stages 1–5)
Decide:   Human approves destructive changes (HITL gate)
Act:      Emit artifacts (Stage 8), deploy to D1, update configs
Learn:    Capture signal of what changed, feed into next cycle
```

### 13.3 Binding to existing services

| Existing Service        | Agent Integration                                                                 |
| ----------------------- | --------------------------------------------------------------------------------- |
| `services/pipeline`     | Agent emits `spine_*.sql` + `memory_*.sql`; Pipeline executes migrations          |
| `services/gateway`      | Agent emits `routes.json` + `rbac.json`; Gateway loads at startup                 |
| `apps/web`              | Agent emits `navigation.json` + `projection-*.json`; UI consumes at runtime       |
| `services/knowledge`    | Agent emits `search.json` + `knowledge-schema.json`; Vector search uses schema    |
| `services/intelligence` | Agent emits capability catalog; Intelligence service routes based on capabilities |
| `services/continuity`   | Agent emits memory classification rules; Continuity manages TTL lifecycle         |

---

## 14. Source-of-Truth Index

| Concept                      | Authoritative source                                          |
| ---------------------------- | ------------------------------------------------------------- |
| Three-layer model            | `docs/architecture/SPINE_DOMAIN.md`                           |
| Agent pipeline (this doc)    | `docs/architecture/SPINE_INTELLIGENCE_AGENT.md`               |
| Internal graph format        | `services/spine-intelligence-agent/src/graph/graph-model.ts`  |
| Graph store                  | `services/spine-intelligence-agent/src/graph/graph-store.ts`  |
| Pipeline stages              | `services/spine-intelligence-agent/src/pipeline/`             |
| Input parsers                | `services/spine-intelligence-agent/src/inputs/parsers/`       |
| Output emitters              | `services/spine-intelligence-agent/src/outputs/emitters/`     |
| Default classification rules | `services/spine-intelligence-agent/config/default-rules.json` |
| Domain templates             | `services/spine-intelligence-agent/config/domain-templates/`  |
| Generated artifacts          | `domains/{domain}/` + `services/*/config/` + `migrations/`    |
| Physical storage             | `docs/architecture/SPINE_MODEL.md`                            |
| Projection engine            | `docs/architecture/PROJECTION_MODEL.md`                       |
| Layer/stage doctrine         | `docs/architecture/USER_SYSTEM_JOURNEY_BLUEPRINT.md`          |
| Locked decisions             | `AGENTS.md` (DECISIONS 18–23)                                 |

---

_The Spine Intelligence Agent is not a code generator. It is a domain understanding system. SQL is the least interesting thing it produces. The graph is the product. When in doubt — halt, ask Nirmal._
