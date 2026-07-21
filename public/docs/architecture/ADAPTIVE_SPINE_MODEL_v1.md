# Adaptive Spine — Canonical Model v1.0 (FROZEN)

**Status:** FROZEN — 2026-07-17
**Model version:** `spine-model/1.3.1`
**Scope:** the canonical operational database of the IntegrateWise platform (Phase 6).

This document freezes the Adaptive Spine's entity model, relationships, identity
scheme, lifecycle, versioning, timeline, provenance, and projection metadata.
Every MCP (Provider, Integration, Task, Workspace, Knowledge, Governance,
Intelligence) targets these contracts. Nothing below changes without a model
version bump (§7) and an entry in the timeline of this document (§12).

Contract-layer field names are `camelCase`; the storage layer (D1) uses
`snake_case`. The conversion is mechanical and total — no field exists in one
layer without a counterpart in the other.

---

## 1. Entity model

The Spine has two tiers. **Platform entities** describe the machinery: who is
connected to what, through which adapter, moving which shapes. **Operational
entities** are tenant business data and what the platform has learned about it.

| Domain        | Tier        | ID prefix | Owner service              | Status                             |
| ------------- | ----------- | --------- | -------------------------- | ---------------------------------- |
| Tenant        | platform    | `ten`     | Spine Service              | model frozen, impl pending         |
| Workspace     | platform    | `wsp`     | Spine Service              | model frozen, impl pending         |
| User          | platform    | `usr`     | Spine Service              | model frozen, impl pending         |
| Provider      | platform    | `prv`     | Provider Management MCP    | model frozen, impl pending         |
| Application   | platform    | `app`     | Provider Management MCP    | model frozen, impl pending         |
| Connection    | platform    | `con`     | Provider Management MCP    | landed (`packages/spine-entities`) |
| Connector     | platform    | `cnr`     | Integration Management MCP | landed                             |
| Capability    | platform    | `cap`     | MCP Pool                   | landed                             |
| SyncJob       | platform    | `syn`     | Integration Management MCP | landed                             |
| Webhook       | platform    | `wbk`     | Integration Management MCP | landed                             |
| Schema        | platform    | `sch`     | Integration Management MCP | landed                             |
| Environment   | platform    | `env`     | Deployment MCP             | model frozen, impl pending         |
| Release       | platform    | `rel`     | Deployment MCP             | model frozen, impl pending         |
| Deployment    | platform    | `dep`     | Deployment MCP             | model frozen, impl pending         |
| Entity        | operational | `ent`     | Entity Service             | model frozen, impl pending         |
| TimelineEvent | operational | `evt`     | Timeline Service           | landed                             |
| Memory        | operational | `mem`     | Memory Service             | model frozen, impl pending         |
| Knowledge     | operational | `knw`     | Knowledge Service          | model frozen, impl pending         |
| Policy        | operational | `pol`     | Governance MCP             | model frozen, impl pending         |
| Approval      | operational | `apr`     | Governance MCP             | model frozen, impl pending         |
| Audit         | operational | `aud`     | Governance MCP             | model frozen, impl pending         |
| Signal        | operational | `sig`     | Intelligence MCP           | model frozen, impl pending         |
| Intelligence  | operational | `int`     | Intelligence MCP           | model frozen, impl pending         |

`Entity` is the canonical business object (account, contact, deal, ticket,
project, invoice, vendor, …). Its `entityType` vocabulary is the existing
canonical set in `packages/types` (`schema.ts` DOMAIN_SPINE_CONFIG +
CROSS_DOMAIN_ENTITY_TYPES) — this document does not fork that vocabulary.

The deployment domains make shipping the platform part of the platform.
An **Environment** is a promotion stage (development → integration → qa →
staging → production); a **Release** is a versioned, promotable unit; a
**Deployment** is one execution of a release into an environment
(`environment`, `service`, `version`, `gitCommit`, `buildNumber`,
`rollbackVersion`, `health`, `metrics`, `artifacts`). Two scoping rules are
part of the freeze: deployment-domain records belong to the
**platform-operator tenant** (the envelope's tenant invariant holds — there is
no tenant-less record), and **secret material is never a spine record** —
`secrets.*` capabilities operate against the Cloudflare secret store while the
spine records only rotation and validation events on the timeline.

**Coding agents are deployment clients, never deployment systems.** Claude
Code, Codex, Gemini CLI, Cursor, and any future agent deploy by invoking
`deployments.*` capabilities (`deployment.create({service, environment,
version})`) and consuming the result; the Deployment MCP owns build, gates,
migrations, provider adapters, health verification, spine recording, and
timeline emission. Direct provider deploys from an agent (`wrangler deploy`,
dashboard pushes, per-service CI auto-deploys) are out-of-band and retired
once the Deployment MCP is live. The rule is enforced by credential
placement, not convention: production provider credentials are held by the
Deployment MCP alone — agents never carry them. Adding a deployment target
(Kubernetes, AWS, on-prem) adds an adapter inside the Deployment MCP;
no client changes.

`Signal` and `Intelligence` are distinct and both canonical. A **Signal** is a
detected condition on an entity (renewal*risk, sla_breach, deal_stalled —
the existing `signalTypes` vocabulary in `spine-schema.ts`): high-volume,
short-lived, always tied to a subject entity. **Intelligence** is a derived
artifact (prediction, recommendation, score, forecast) computed \_from* signals,
timeline, and memory: lower-volume, longer-lived, versioned.

### 1.1 Common record envelope

Every Spine record, regardless of domain, carries this envelope. Domain fields
extend it; nothing replaces it.

```ts
interface SpineRecord {
  id: string; // §3 — prefixed ULID, immutable
  tenantId: string; // §2 — isolation wall; only Tenant itself omits this
  workspaceId?: string; // present when the record is workspace-scoped
  status: string; // §4 — value from the domain's state machine
  version: number; // §5 — record version, optimistic concurrency
  schemaVersion: string; // §5 — contract version of the domain, semver
  dataClass: "public" | "internal" | "confidential" | "pii"; // §8
  provenance: Provenance; // §7 — mandatory on every write
  createdAt: string; // ISO-8601 UTC
  updatedAt: string; // ISO-8601 UTC
  archivedAt?: string; // set if and only if status is archival/terminal
  metadata: Record<string, unknown>; // free-form, never load-bearing
}
```

Domain-specific fields already landed in `packages/spine-entities` are part of
the freeze: Connection (`authorizationRef`, `status`, `health`), Connector
(`capabilities`, `config`, `supportedEntities`), SyncJob (`mode`, `cursor`,
`errors`, `metrics`), Webhook (statistics), Schema (field mappings), Capability
(governance policies), TimelineEvent (§6 envelope).

---

## 2. Relationships

Ownership is a tree; everything else is a reference edge.

```text
Tenant
 ├── Workspace ──── User (membership, role-scoped)
 ├── Connection ──→ Application ──→ Provider   (authorizationRef binds them)
 │     └── Connector                  (executes over one Connection)
 │           ├── SyncJob              (execution records)
 │           ├── Webhook              (event subscriptions)
 │           └── Schema               (discovered + mapped shapes)
 ├── Capability ──→ Connector/MCP     (registry entry → implementation)
 ├── Entity ──→ sourceRefs            (produced by SyncJobs via Schema mappings)
 │     ├── TimelineEvent (subject)
 │     ├── Signal (subject entity)
 │     ├── Memory (entityRefs)
 │     ├── Knowledge (entityRefs)
 │     └── Intelligence (entityRefs)
 ├── Policy ── Approval ── Audit      (governance chain)
 └── Environment ── Release ── Deployment   (platform-operator tenant only)
```

Rules — all mandatory:

1. **References are by ID only.** No record embeds another record. Consumers
   resolve edges through the owning service.
2. **`tenantId` is a hard wall.** A record may never reference a record in
   another tenant. Enforced at the Spine Service boundary, not left to callers.
3. **Ownership implies lifecycle coupling.** Archiving a parent archives its
   subtree (soft cascade, §4.2). References (non-ownership edges) do not
   cascade; they dangle-safe by ID and resolve to `gone` after archival.
4. **Entity relationships** (account→contacts, deal→account, …) are edges on
   the Entity record (`relationships: {type, targetId}[]`), not join tables in
   consumer services. Entity360 reads them; it never defines them.

---

## 3. Identity

**Format:** `{prefix}_{ulid}` — e.g. `con_01J2ZK7M8QW3R9T5V6X7Y8Z9AB`.
Prefixes are the table in §1. ULIDs are 26-char Crockford base32,
lexicographically sortable by creation time.

1. IDs are assigned by the owning service at creation. Never client-supplied,
   never reused, never mutated. The ID is the only canonical identity.
2. **Source identity is an alias, not an identity.** External records carry
   `sourceRefs: {sourceSystem, sourceId}[]`. The pair
   `(tenantId, entityType, sourceSystem, sourceId)` is unique and is the upsert
   key for sync ingestion: match → update canonical record + append sourceRef
   if new; no match → create. Two source systems pointing at the same
   real-world object merge into one Entity with two sourceRefs.
3. Merges preserve the older canonical ID; the newer ID is tombstoned with a
   `mergedInto` pointer and a timeline event. Splits are new creations.

---

## 4. Lifecycle

### 4.1 State machines (frozen)

```text
Application: registered → configured → active ⇄ suspended → archived
Connection: pending → authorized → active ⇄ degraded → expired | revoked
Connector:  installed → configured → enabled ⇄ disabled → archived
Capability: registered → active ⇄ deprecated → retired
SyncJob:    queued → running → succeeded | failed | cancelled     (terminal)
Webhook:    registered → active ⇄ paused → failed → archived
Schema:     discovered → mapped → approved → active → superseded
Environment: provisioned → active ⇄ frozen → destroyed
Release:    draft → candidate → released → superseded | rolled_back
Deployment: queued → building → deploying → verifying → live | failed ;
            live → superseded | rolled_back
Entity:     active ⇄ stale → archived
Signal:     detected → active ⇄ acknowledged → resolved | expired
Memory:     proposed → approved | rejected ; approved → promoted → archived
Approval:   pending → approved | rejected | expired               (terminal)
Policy:     draft → active ⇄ suspended → retired
```

- SyncJob retries are **new attempts** (attempt counter on the job), never a
  transition out of a terminal state.
- Memory governance thresholds are the existing doctrine: auto-approve ≥ 0.85,
  HITL 0.60–0.84, reject < 0.60.
- Every transition above **must** emit exactly one TimelineEvent (§6). A state
  change without an event is a contract violation.

### 4.2 Deletion doctrine

Soft delete only: terminal/archival status + `archivedAt`. Hard deletes exist
solely as **governed purge** (tenant offboarding, compliance erasure), execute
through the Governance MCP, and always leave an Audit record. No service issues
`DELETE` outside the purge path.

---

## 5. Versioning

Three planes, none optional:

| Plane    | Field                    | Semantics                                                                                      |
| -------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| Record   | `version` (int)          | +1 on every mutation; optimistic concurrency — writes carry expected version, mismatch rejects |
| Contract | `schemaVersion` (semver) | version of the domain's shape the record was written under                                     |
| Model    | `spine-model/1.0.0`      | this document; the whole vocabulary                                                            |

Evolution rules: adding optional fields or new entity domains = **minor**;
removing, renaming, or changing the semantics of a field, or changing a state
machine = **major**, requiring a migration plan and a dual-read window.
History is never rewritten: TimelineEvents and Audit records are never
migrated in place — readers interpret them by their recorded `schemaVersion`.

---

## 6. Timeline

The timeline is the append-only, immutable record of everything that happened.
It is written by services, never by clients, and never updated or deleted
(compaction, below, is the only exception).

```ts
interface TimelineEvent {
  id: string; // evt_<ulid> — recording order
  tenantId: string;
  eventType: string; // "{domain}.{action}": connection.authorized,
  // sync.completed, entity.merged, memory.promoted…
  subject: { entityType: string; entityId: string };
  occurredAt: string; // when it happened in the world
  recordedAt: string; // when the spine recorded it
  actor: Actor; // §7
  provenance: Provenance; // §7
  payload: Record<string, unknown>; // domain summary / field diff
  correlationId?: string; // groups one logical operation across services
  causationId?: string; // the event that caused this one
  schemaVersion: string;
}
```

- **Ordering:** ULID order = recording order per tenant. Consumers must not
  assume ordering across tenants or between `occurredAt` and `recordedAt`.
- **Retention:** platform-tier events are audit-grade and kept indefinitely.
  High-volume operational events may be compacted after 90 days into rollup
  events, with originals archived to object storage — never silently dropped.
- The timeline is the source for Entity360's activity layer and the Governance
  Workbench's audit view; neither maintains a parallel history.

---

## 7. Provenance

Every write — record mutation or timeline event — carries provenance. The Spine
Service rejects writes without it.

```ts
interface Actor {
  type: "user" | "agent" | "system";
  id: string; // usr_… | agent id | service name
}

interface Provenance {
  sourceSystem: string; // provider key ("hubspot", "descope") or "internal"
  sourceId?: string; // id in the source system, if externally sourced
  capabilityId?: string; // cap_… that performed the write
  syncJobId?: string; // syn_… when written by a sync run
  webhookId?: string; // wbk_… when written by an event delivery
  trustLevel: "source_of_record" | "user_asserted" | "model_inferred";
  evidenceRefs: string[]; // evidence ids supporting the write
}
```

`trustLevel` reuses the existing vocabulary (`evidence_refs.trust_level`).
Model-inferred writes (Memory, Intelligence) can never carry
`source_of_record`; sync-ingested provider data always does.

**Field-level provenance (Entity only).** Merged multi-source Entities may
additionally carry `fieldProvenance`: a per-field map of
`{sourceSystem, confidence, updatedBy, updatedAt, resolution}` recording which
source won each field and why — the contract form of the existing
`merge-fields` resolution machinery in `packages/types`. Record-level
provenance stays mandatory everywhere; field-level provenance is required
whenever an Entity has more than one sourceRef.

---

## 8. Projection metadata

The Spine is never read raw. Every consumer — MCP tool, workbench, Twin —
receives a **projection**: a named, per-domain field subset resolved against
who is asking.

1. **`dataClass`** on every record (`public | internal | confidential | pii`)
   is the redaction unit. A projection lists fields; resolution drops fields
   whose dataClass exceeds the caller's clearance.
2. **Named projections** per domain: `summary` (lists, tiles), `detail`
   (single-record views), `timeline` (activity), plus domain-specific ones.
   Projections are registered alongside the domain contract in
   `packages/spine-entities` — not defined ad hoc by consumers.
3. **Resolution inputs:** tenant spine config (allowed entity types, connected
   connectors), subscription tier, RBAC role. This is the existing
   `tenant_spine_config` doctrine — AI clients never see table shape, column
   names, or unconfigured entity types.
4. **Entity360 is a composed read-side projection** — truth, context, signals,
   memory, goals, relationships layers per `packages/types/entity360.ts` —
   assembled at read time from Entity + TimelineEvent + Memory + Knowledge +
   Intelligence. It is never stored as canonical state and is implemented only
   after the underlying entities exist.

---

## 9. Core services

| Service           | Owns                                            | Writes               |
| ----------------- | ----------------------------------------------- | -------------------- |
| Spine Service     | envelope enforcement, CRUD, projections         | all platform domains |
| Entity Service    | canonical Entity, source-identity upsert, merge | Entity               |
| Timeline Service  | append-only event log                           | TimelineEvent        |
| Memory Service    | proposal → governance → promotion               | Memory               |
| Knowledge Service | documents, graph, search                        | Knowledge            |

All five enforce: tenant wall (§2), envelope (§1.1), provenance (§7),
one-event-per-transition (§4.1), projection-only reads (§8).

### 9.1 Spine SDK

MCPs never write to spine storage directly — all access goes through the Spine
SDK, the single typed client over the services above. Frozen surface:

```ts
spine.create(domain, record); // envelope + provenance enforced
spine.update(domain, id, patch, expectedVersion);
spine.archive(domain, id); // soft delete only (§4.2)
spine.get(domain, id, projection);
spine.search(domain, filter, projection);
spine.timeline(subject, range); // read the event log
spine.relationships(id); // resolve reference edges
spine.events.emit(event); // service-side only
```

The SDK is the conformance boundary: everything in §11 is enforced inside it,
so an MCP that only uses the SDK is conformant by construction.

---

## 10. Execution backlog

Frozen implementation sequence. Within P0, entity contracts land in the order
Connection → Connector → Capability → SyncJob → Webhook → Schema — each with
its projections and timeline events before the next begins.

| Priority | Deliverable                                  | Outcome                          |
| -------- | -------------------------------------------- | -------------------------------- |
| P0       | Freeze Adaptive Spine schema (this document) | Stable platform contracts        |
| P1       | Spine SDK (§9.1)                             | Unified read/write API           |
| P2       | Timeline Engine (§6)                         | Immutable event history          |
| P3       | Relationship Graph (§2)                      | Canonical links between entities |
| P4       | Entity360                                    | Unified operational view         |
| P5       | Projection Registry (§8)                     | Schema-driven UI                 |
| P6       | Adaptive Workbench Runtime                   | Runtime-generated workbenches    |
| P7       | Governance MCP                               | Policy and approval engine       |
| P8       | Knowledge & Memory                           | Organizational intelligence      |
| P9       | Hermes Runtime                               | Autonomous orchestration         |

Entity360 (P4) composes; it must not precede what it composes (P0–P3).
Governance (P7) consumes Spine entities; it owns no parallel state.

The Deployment platform (Deployment MCP, environment manager, Cloudflare
adapters, migration/secret managers, rollback engine, deployment workbench)
enters **after P1**: its entities are frozen here in P0, and the MCP is built
exclusively on the Spine SDK — the first MCP conformant by construction. Every
gate stage (typecheck → … → traffic shift) emits a `deployment.*` timeline
event per §6.

**Platform Foundation is complete** — and the repository is tagged
`v1-platform-foundation` — when all of the following hold:

- Gateway, Identity, OAuth, and MCP Pool are stable.
- Provider, Integration, and Task MCPs operate exclusively through the Spine SDK.
- The Adaptive Spine schema is frozen and versioned (this document).
- Every entity has a timeline and relationship graph.
- Workbenches are projections generated from Spine metadata, not hardcoded pages.
- Governance operates on canonical entities.
- Hermes plans and executes via the Capability Fabric and Spine, never
  provider-specific logic.

## 11. Conformance checklist (for every MCP)

- [ ] Reads go through named projections; no raw table access
- [ ] Writes carry the envelope, provenance, and expected `version`
- [ ] Every state transition emits exactly one TimelineEvent
- [ ] No cross-tenant references; no client-supplied IDs
- [ ] Soft delete only; purge via Governance MCP
- [ ] Contract changes follow §5 (semver + migration for majors)

## 12. Document timeline

| Date       | Change                                                                                                                               | Model version       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| 2026-07-17 | Initial freeze                                                                                                                       | `spine-model/1.0.0` |
| 2026-07-17 | Add Signal domain; Spine SDK surface (§9.1); replace build order with P0–P9 backlog + foundation-complete definition                 | `spine-model/1.1.0` |
| 2026-07-17 | Add Deployment, Environment, Release domains (platform-operator tenant scope; secrets never stored); Deployment MCP slotted after P1 | `spine-model/1.2.0` |
| 2026-07-17 | Add Application domain (Connection → Application → Provider chain); field-level provenance for multi-source Entities                 | `spine-model/1.3.0` |
| 2026-07-17 | Doctrine: coding agents are deployment clients (deployments.\* only; credentials live with the Deployment MCP)                       | `spine-model/1.3.1` |
