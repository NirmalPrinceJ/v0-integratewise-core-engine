# Canonical Spine — Converged Architecture

**Status:** ACTIVE — Adaptation model implemented
**Date:** July 20, 2026
**Supersedes:** Previous fragmented Spine implementations

---

## The Governing Principle

The Spine adapts by **configuration and interpretation**, not by changing its foundational concepts.

- **Stable:** ontology, entity envelope, relationship model, event model, canonical IDs.
- **Adaptive:** entity definitions, connector mappings, governance policies, memory strategies, projections, AI context, and workbench views.

This separation allows tenants in different industries and with different operational needs to share the same canonical model while experiencing a system that behaves as though it were tailored specifically to their organization.

---

## Architecture

```
                Universal Ontology
                       │
             (never changes)
                       │
        ┌──────────────┴──────────────┐
        │                             │
 Adaptive Definitions          Governance Rules
        │                             │
        └──────────────┬──────────────┘
                       │
               Canonical Spine
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      Memory      Projections     AI/Twins
```

### Layer 1: Universal Ontology (Stable)

The 16 root concepts + 7 operational primitives never change:

- Organization, Person, Team, Process, Project, Objective, Outcome, Asset, Knowledge, Decision, Policy, Capability, Signal, Memory, Conversation
- Tenant, Entity, Relationship, Timeline, Activity, Evidence, Provenance

### Layer 2: Adaptive Definitions

What changes per tenant:

- **Entity definitions:** What fields an Organization has for SaaS vs Healthcare
- **Relationship patterns:** What graph edges are valid
- **Connector mappings:** How Salesforce Account → Organization, HubSpot Company → Organization
- **Memory categories:** Which memory types are relevant
- **Governance rules:** Strict audit for healthcare, light touch for SaaS

### Layer 3: Canonical Spine (Storage)

The persisted graph:

- `spine_entities` — append-only versioned entities
- `spine_relationships` — typed edge graph
- `spine_timeline` — immutable audit trail
- `spine_entity_resolution` — external ID → canonical ID mapping

### Layer 4: Consumption Layers

- **Memory** — derives from Spine, opinion not truth
- **Projections** — role-specific views assembled at query time
- **AI/Twins** — different context bundles from the same Spine

---

## The 16 Root Concepts

Every business entity in IntegrateWise maps to one of these canonical types:

| Root Concept   | Prefix  | What it is                          |
| -------------- | ------- | ----------------------------------- |
| `Organization` | `org_`  | Legal entity owning the tenant      |
| `Workspace`    | `wsp_`  | Bounded context inside Organization |
| `Person`       | `usr_`  | First-class human                   |
| `Team`         | `team_` | Durable grouping of Persons         |
| `Process`      | `proc_` | Repeatable set of capabilities      |
| `Project`      | `prj_`  | Temporary initiative with timeline  |
| `Objective`    | `obj_`  | Measurable goal                     |
| `Outcome`      | `out_`  | Evidence-verified result            |
| `Asset`        | `ast_`  | Durable resource                    |
| `Knowledge`    | `knw_`  | Curated institutional memory        |
| `Decision`     | `dec_`  | Governance-approved choice          |
| `Policy`       | `pol_`  | Declarative rule                    |
| `Capability`   | `cap_`  | Declarable action on the fabric     |
| `Signal`       | `sig_`  | Derived delta with score            |
| `Memory`       | `mem_`  | Captured observation with lifecycle |
| `Conversation` | `conv_` | Twin ↔ User dialog                  |

---

## The Adaptation Model

### Identity-Driven Adaptation

The adaptive resolver (`services/gateway/src/spine-schema.ts`) evaluates:

- Tenant
- Department
- Role
- Industry
- Business Model
- Enabled Capabilities
- Connected Systems
- Policies

Two tenants in the same department but different industries get different operational profiles.

### Entity Definition Adaptation

Same ontology concept, different operational definitions:

**SaaS Organization:**

- ARR, MRR, Renewal Date, Health Score, Usage, Segment, Tier

**Healthcare Organization:**

- Type, Department, Budget, Program, Compliance Status, Accreditation, Patient Capacity

**Manufacturing Organization:**

- Factory, Supplier Tier, Quality Rating, Production Capacity, Certifications

### Relationship Adaptation

The typed edge graph adapts per domain:

| Domain           | Relationship Example           |
| ---------------- | ------------------------------ |
| Customer Success | Organization owns Success Plan |
| Engineering      | Organization owns Repository   |
| Healthcare       | Patient treated_by Provider    |
| Finance          | Account belongs_to Portfolio   |

### Connector Adaptation

Connectors determine what evidence exists. Pipeline normalizes to ontology:

| Connector  | Source Concept | Canonical Concept |
| ---------- | -------------- | ----------------- |
| Salesforce | Account        | Organization      |
| HubSpot    | Company        | Organization      |
| Dynamics   | Customer       | Organization      |

The Spine never stores Salesforce concepts. It stores ontology concepts.

### Memory Adaptation

Memory categories adapt per domain:

| Domain  | Memory Categories                                    |
| ------- | ---------------------------------------------------- |
| Sales   | Deal Memory, Meeting Memory, Conversation Memory     |
| Support | Incident Memory, Knowledge Memory, Resolution Memory |
| Finance | Approval Memory, Policy Memory, Audit Memory         |

### Governance Adaptation

Same ontology, different governance:

**Healthcare:**

- Signal → Approval Required → Evidence Required → Audit Trail

**Startup SaaS:**

- Signal → Auto Execute

### Projection Adaptation

One entity, multiple projections:

**Founder sees:** Revenue, Growth, Risk, Strategy
**CS sees:** Health, Renewal, Adoption
**Support sees:** Tickets, SLA, Escalations
**Finance sees:** Invoices, ARR, Collections

### AI Adaptation

AI does not mutate the Spine. The Spine provides different context bundles:

**Founder Twin:** Executive Signals, KPIs, Strategic Risks
**CS Twin:** Renewals, Usage, Playbooks, Accounts
**Engineering Twin:** Repositories, Incidents, Deployments

---

## Write Path

```
Connector / Webhook / MCP / API / Manual
        ↓
Pipeline (sole writer)
        ↓
Adaptive Resolver
        ↓
Entity Type Mapping
        ↓
Canonical Entity Creation
        ↓
spine_entities (append-only)
        ↓
spine_timeline (audit trail)
        ↓
Memory (derives from Spine)
```

## Read Path

```
User / Twin / API
        ↓
Projection Engine
        ↓
Resolve Tenant Operational Profile
        ↓
Query Canonical Spine
        ↓
Role-Specific View
        ↓
TypedProjectionResult
```

---

## Key Design Decisions

### 1. Hybrid Storage Model

Canonical metadata (typed, queryable): `canonical_id`, `entity_type`, `tenant_id`, `version`, `status`

Core fields (typed): `name`, `domain`, `industry`, `role`, `department`

Business payload (JSON): provider-specific attributes

This avoids migration sprawl while keeping the ontology stable.

### 2. Append-Only Versioning

Every mutation creates a new version. Old version invalidated via `valid_until`. Enables audit, time-travel, rollback, AI reasoning over history.

### 3. Typed Edge Graph

Relationships are first-class: typed edges with temporal validity, metadata, and confidence.

### 4. Operational Definitions

Stored in `spine_operational_definitions`. Adapts fields, relationships, connector mappings, governance rules, memory categories, and projection fields per industry/department.

### 5. Tenant Profiles

`spine_tenant_profiles` stores the resolved operational profile for each tenant. Drives all downstream consumption.

---

## Implementation Status

| Component                | Status      | Location                                                      |
| ------------------------ | ----------- | ------------------------------------------------------------- |
| Universal Ontology       | ✅ Stable   | 16 root concepts + 7 primitives                               |
| Adaptive Resolver        | ✅ Complete | `services/gateway/src/spine-schema.ts`                        |
| Operational Definitions  | ✅ Complete | `services/pipeline/src/canonical/operational-definitions.ts`  |
| Entity Type Mapping      | ✅ Complete | `services/pipeline/src/canonical/entity-type-map.ts`          |
| Canonical Spine Writer   | ✅ Complete | `services/pipeline/src/canonical/canonical-writer.ts`         |
| Adaptive Bridge          | ✅ Complete | `services/gateway/src/canonical-spine-bridge.ts`              |
| SQL Schema (core)        | ✅ Complete | `sql-migrations/080_canonical_spine_entities.sql`             |
| SQL Schema (operational) | ✅ Complete | `sql-migrations/081_operational_definitions.sql`              |
| D1 Database              | ⏳ Pending  | Create via `wrangler d1 create integratewise-canonical-spine` |
| Pipeline Integration     | ✅ Complete | `services/pipeline/src/index.ts`                              |
| Projection Engine        | ⏳ Pending  | Assemble role-specific views                                  |
| Memory → Spine Reads     | ⏳ Pending  | Memory should consume Spine                                   |

---

## Next Steps

1. **Create D1 database**: `wrangler d1 create integratewise-canonical-spine`
2. **Run migrations**: Apply `080` and `081` SQL files
3. **Update wrangler.toml**: Add actual D1 database IDs
4. **Deploy pipeline**: `wrangler deploy` in `services/pipeline/`
5. **Implement projection engine**: Assemble role-specific views from canonical Spine + operational definitions
6. **Wire memory to Spine reads**: Memory consumes Spine, doesn't replace it
7. **Seed operational definitions**: Populate `spine_operational_definitions` with industry/department variants
