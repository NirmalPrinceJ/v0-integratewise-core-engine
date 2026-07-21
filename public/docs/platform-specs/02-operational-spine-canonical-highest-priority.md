# 02 — Operational Spine ⭐ (canonical, highest priority)

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 599
> **Lines:** 116 | **Chars:** 5,866
> **Status:** Raw extraction — requires review and canonicalization

02 — Operational Spine ⭐ (canonical, highest priority)
This is the source of truth for every other doc. Every entity, ID, lifecycle, and event listed here is referenced verbatim by 03–20.

2.1 Responsibilities
Own the canonical entity graph.
Own the canonical timeline (event-sourced append-only).
Own entity versioning and provenance.
Mint canonical IDs (ent*… prefix).
Resolve merge / conflict between Connector Deltas and proposed writes.
Enforce soft-delete vs. hard-delete semantics.
Serve temporal queries (“as-of” reads).
2.2 Canonical entity graph
CopyTenant (tnt*)
├── Workspace (wsp*)
│ ├── User (usr*)
│ ├── Persona (derived from tenant*spine_config)
│ └── Module bindings
├── Entity (ent*) ── typed by Entity Framework (12)
│ ├── Attribute (typed)
│ ├── Reference (typed)
│ └── Lifecycle (draft|active|archived|deleted)
├── Relationship (rel*) ── directed, typed, attributed
├── Timeline (tl*) ── event-sourced
│ └── Activity (act*)
├── Evidence (evd*) ── citations for any claim
├── Signal (sig*) ── derived from delta diffs (10)
├── Capability (cap*) ── declared actions (05)
└── Memory (mem*) ── three-axis:
├── Spine-truth (L1)
├── Twin-meaning (L7 of pipeline → see 07)
└── Knowledge-doc (SOPs, runbooks)
2.3 Canonical IDs
Type-prefixed nanoid (collision-resistant, URL-safe).
Tenants carry tnt_id; workspaces scoped under tenant with wsp_id.
Cross-tenant references forbidden except via rel_external and explicit Marketplace grant (see 13).
Every ID has a 32-byte SHA-256 content-hash sidecar so duplicates can be detected without a lookup.
2.4 Entity lifecycle states
Copydraft ──▶ active ──▶ archived ──▶ (soft-deleted)
▲ │ │
│ ▼ ▼
└────── proposed ◀── restore
│
▼
hard-deleted (judicial only; tenant_id + actor + signed reason required)
Soft delete: lifecycle.status = “deleted”, retained 90 days, hidden from projections.
Hard delete: requires Governance Token (09) with gov.posture=judicial and an immutable audit record (16).
2.5 Timeline model
Append-only timeline table keyed by tl_id.
Every state change creates one Timeline entry; the row in the entity table is a projection of the latest Timeline entry.
Form: { tl_id, tnt_id, ent_id, kind, payload, actor, occurred_at, source_connector, evidence_refs[] }.
2.6 Relationship graph
Directed, typed, attributed edges in relationship (rel*).
Allowed: belongs_to, depends_on, references, derived_from, supersedes, contested_by.
Graph traversal API: POST /spine/graph/traverse { from, edge[], to?, depth, as_of? } returns a DAG slice as-of as_of.
2.7 Event model
Spine-internal events (consumed by Projection Engine, Twin, Signals, Workflows, Governance):

Event Producer Notes
EntityCreated 02 new ent*
EntityUpdated 02 attribute mutation
EntityMerged 02 conflict resolution applied
EntityArchived 02 lifecycle change
RelationshipAsserted 02 new rel*
RelationshipRetracted 02 withdrawn edge
TimelineAppended 02 always emitted, fan-out
ProvenanceRecorded 02 evidence link added
SpineSnapshotRequested 20 / runbook scheduled export
VersionPinned 02 explicit as-of point
2.8 Versioning
Each Entity row carries version (monotonic per entity).
Every mutation increments version; never decrements.
Temporal query ?as_of=ISO8601 reads Timeline to reconstruct.
Schema migrations bump tenant_spine_config.schema_version (currently aligned to m054+).
2.9 Provenance
Every Entity/Relationship row carries provenance[]: at least one of { actor, source_connector, evidence_ref, derived_signal }.
derived_signal requires the originating sig_id to be reproducible.
Provenance is required for any field flagged pinned in the Entity Framework (12).
2.10 Merge / conflict rules (Connector Delta vs. local edit)
Source Authoritative for Loses to
Connector Delta (+ ≤ 30s old) field-level truth local edit during soft-sync window
Local edit (pending soft-sync) during soft-sync window Connector Delta after window
Twin proposal (pending approval) never (read-only) always
Hard governance action always all
Rule of thumb: most-recent timestamp wins, except (a) pinned fields never auto-update, (b) governance-required fields always block, © explicitly merged events track both sides.

2.11 Soft vs. hard deletion
Soft delete is the default; surfaces omit the row.
Hard delete requires gov.judicial token (09) and is recorded in audit_log (16) forever.
Cross-tenant hard delete is impossible.
2.12 Temporal queries
CopyGET /spine/entities/ent_abc123 # latest
GET /spine/entities/ent_abc123?as_of=2025-03-01T00:00:00Z
GET /spine/relationships?from=ent_a&to=ent_b&as_of=…
All temporal reads go through spineRead MCP tool; no Workbench code may bypass it.

2.13 Storage (D1 + Durable Objects)
Hot metadata: D1 (spine.entities, spine.relationships, spine.timeline, spine.provenance).
Per-tenant Durable Object SpineDO{tnt_id} for transactional consistency of a tenant’s write stream.
Cold snapshots: R2 (/snapshots/{tnt_id}/{date}.parquet).
2.14 APIs
Method Path Purpose
POST /spine/entities create entity
PATCH /spine/entities/{ent_id} mutate (issues TimelineAppended)
GET /spine/entities/{ent_id} read (with ?as_of)
POST /spine/relationships assert
GET /spine/graph/traverse DAG slice
GET /spine/timeline paginate timeline
POST /spine/restore/{ent_id} from soft-delete
2.15 Failure handling
D1 retry: exponential, 5 attempts, ≤ 30 s.
DO retry: 3 attempts; on exhaustion → deferred_queue (Cloudflare Queue) with evt_id.
Temporal read with missing Timeline entries: surface “incomplete provenance” banner instead of silent fallback.
2.16 Extension points
Custom entity types (12) registered at tenant_spine_config.enabled_entities[].
Custom provenance reporters (e.g., SHA-pinning artifacts).
Custom merge strategies via plugin interface SPINE_MERGE_PLUGIN(name).
