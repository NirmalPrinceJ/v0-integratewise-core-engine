# IntegrateWise — Unified Platform Architecture Suite (00–34)

> **Version:** 1.0 — Architecture Freeze  
> **Companion to:** IntegrateWise — Marketplace Onboarding & Persona Architecture (m054+)  
> **Status:** Complete for architecture; ready for implementation hand-off

---

## Unifying Doctrines (held constant across every doc)

1. **Distribution is ingress** — every AI assistant marketplace is a tenant-acquisition channel.
2. **Truth you own** — the Spine is canonical; AI tools are projections.
3. **AI you rent** — the LLM provider is plumbable via Cloudflare AI Gateway; no vendor lock.
4. **Approval in between** — every write that crosses a system boundary passes through the Governance Engine.
5. **One capability, every surface** — the same `cap_id` resolves identically in Workbench, Twin, Chat, CLI, Slack, Mobile.
6. **Continuity over asking** — the Spine is the source of context; the Twin never re-asks.
7. **Persona barrier** — `tenant_spine_config.industry × department` defines the visible universe; users cannot pivot roles by widening scope.
8. **Hard gates are non-negotiable** — Soft-sync defaulting, 5-minute first-data-load, Promotion-Queue human approval.

---

## Canonical ID Prefixes (used in every section below)

| Prefix  | Domain                                  |
| ------- | --------------------------------------- |
| `tnt_`  | Tenant                                  |
| `wsp_`  | Workspace                               |
| `usr_`  | User                                    |
| `ent_`  | Entity (any domain object)              |
| `rel_`  | Relationship                            |
| `tl_`   | Timeline entry                          |
| `act_`  | Activity                                |
| `evd_`  | Evidence                                |
| `sig_`  | Signal                                  |
| `cap_`  | Capability                              |
| `mem_`  | Memory                                  |
| `knw_`  | Knowledge                               |
| `tw_`   | Twin                                    |
| `prj_`  | Projection                              |
| `evt_`  | Bus event                               |
| `wf_`   | Workflow                                |
| `gov_`  | Governance token                        |
| `obs_`  | Observability record                    |
| `mkt_`  | Marketplace listing                     |
| `conn_` | Connector                               |
| `mod_`  | Model                                   |
| `ag_`   | Agent                                   |
| `plg_`  | Plugin                                  |
| `org_`  | Organization                            |
| `team_` | Team                                    |
| `inv_`  | Invitation                              |
| `sub_`  | Subscription / Billing                  |
| `bill_` | Invoice / charge                        |
| `idx_`  | Search index                            |
| `pipe_` | Pipeline                                |
| `qry_`  | Search/Cache query                      |
| `tok_`  | Identity token (scoped lifecycle token) |

---

## Documentation Hierarchy (00–34)

```
00 Vision & Doctrine
01 Platform Architecture
02 Operational Spine ⭐
03 Workspace Runtime
04 Projection Engine
05 Capability Fabric
06 Twin Runtime
07 Memory System
08 Connector Framework
09 Governance Engine
10 Signal Engine
11 Workflow Engine
12 Entity Framework
13 Marketplace
14 Security
15 Deployment
16 Observability
17 SDKs
18 UI/Design System
19 API Contracts
20 Operations Runbooks
21 Business Ontology ⭐ (foundational)
22 AI Model Runtime
23 Agent Runtime
24 Integration Manager
25 Continuity Engine
26 Search Engine
27 Data Pipeline
28 Identity Platform
29 Billing Platform
30 Operational Metrics
31 Evolution Strategy
32 Plugin Runtime
33 Testing Architecture
34 System Lifecycle
```

---

# PART I: CORE PLATFORM (00–20)

---

## 00 — Vision & Doctrine

### 0.1 Mission

IntegrateWise is the persona-shaped operating system that sits between third-party AI assistants (ChatGPT, Claude, Perplexity, future agents) and the human systems of record (CRM, ERP, ITSM, support, finance). It converts distribution traffic into tenant truth, then operates a Twin on that truth.

### 0.2 Doctrines

- Distribution is ingress.
- Truth you own.
- AI you rent.
- Approval in between.
- One capability, every surface.
- Continuity over asking.
- Persona barrier.
- Hard gates are non-negotiable.

### 0.3 Non-goals

- Replacing systems of record.
- Becoming a data lake.
- Hosting a general-purpose LLM.
- Operating without a human-in-the-loop for high-governance writes.

### 0.4 Audience map

| Reader             | Required docs                                                   |
| ------------------ | --------------------------------------------------------------- |
| New engineer       | 02 Spine, 03 Workspace, 06 Twin, 08 Connector, 19 API Contracts |
| Persona / product  | 00 Doctrine, 04 Projection, 05 Capability, 13 Marketplace       |
| Operator           | 14 Security, 15 Deployment, 16 Observability, 20 Runbooks       |
| External developer | 17 SDKs, 18 Design System, 13 Marketplace                       |
| Executive          | 00 Vision, 02 Spine (data-shape), 13 Marketplace (revenue)      |

---

## 01 — Platform Architecture

### 1.1 Reference layers

```
┌────────────────────────────────────────────────────────────────────┐
│  Distribution surfaces: ChatGPT · Claude · Perplexity · Web · Slack │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  Gateway   (Cloudflare Worker)   RS256 JWT · rate limit · routing   │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  Operational Spine (D1 + DO SQL)   canonical entities + timeline    │
└────────────────────────────────────────────────────────────────────┘
                ↓                       ↑              ↑
┌──────────────────────┐  ┌───────────────────────┐  ┌──────────────┐
│ Projection Engine    │  │ Twin Runtime          │  │ Workflows    │
│ (Workbench, Persona, │  │ (OODA, Memory,        │  │ (triggers,   │
│  Workspace surfaces) │  │  Persona Grammar)     │  │  retries)    │
└──────────────────────┘  └───────────────────────┘  └──────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  Capability Fabric (registry + SDK)  sync_mode = soft|real|propose  │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  Connectors (Nango · MCP · Native · AI Provider)  outbound writes   │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  Systems of Record (Salesforce, HubSpot, Jira, NetSuite, ...)      │
└────────────────────────────────────────────────────────────────────┘
```

### 1.2 Subsystem responsibility matrix

| Subsystem           | Defined in | Runtime contract template applied |
| ------------------- | ---------- | --------------------------------- |
| Operational Spine   | 02         | ✔                                 |
| Workspace Runtime   | 03         | ✔                                 |
| Projection Engine   | 04         | ✔                                 |
| Capability Fabric   | 05         | ✔                                 |
| Twin Runtime        | 06         | ✔                                 |
| Memory System       | 07         | ✔                                 |
| Connector Framework | 08         | ✔                                 |
| Governance Engine   | 09         | ✔                                 |
| Signal Engine       | 10         | ✔                                 |
| Workflow Engine     | 11         | ✔                                 |
| Entity Framework    | 12         | ✔                                 |
| Marketplace         | 13         | ✔                                 |
| Security            | 14         | ✔                                 |
| Deployment          | 15         | ✔                                 |
| Observability       | 16         | ✔                                 |
| SDKs                | 17         | delivery surfaces                 |
| UI/Design System    | 18         | delivery surfaces                 |
| API Contracts       | 19         | delivery surfaces                 |
| Runbooks            | 20         | delivery surfaces                 |

### 1.3 Runtime-contract template (used identically in 02–13)

Each subsystem spec contains these fields, in this order:

1. Responsibilities — what this subsystem owns.
2. Inputs — events, APIs, scheduled inputs.
3. Outputs — events, APIs, persisted rows.
4. Events produced — names emitted onto the Event Bus.
5. Events consumed — names subscribed-to from the Event Bus.
6. APIs — Gateway routes / worker RPCs that touch this subsystem.
7. State transitions — the lifecycle state machine.
8. Failure handling — retries, fallbacks, dead-letter.
9. Extension points — how external code injects behavior.

---

## 02 — Operational Spine ⭐ (canonical, highest priority)

### 2.1 Responsibilities

- Own the canonical entity graph.
- Own the canonical timeline (event-sourced append-only).
- Own entity versioning and provenance.
- Mint canonical IDs (ent\_… prefix).
- Resolve merge / conflict between Connector Deltas and proposed writes.
- Enforce soft-delete vs hard-delete semantics.
- Serve temporal queries ("as-of" reads).

### 2.2 Canonical entity graph

```
Tenant (tnt_)
 ├── Workspace (wsp_)
 │     ├── User (usr_)
 │     ├── Persona (derived from tenant_spine_config)
 │     └── Module bindings
 ├── Entity (ent_)              ── typed by Entity Framework (12)
 │     ├── Attribute (typed)
 │     ├── Reference (typed)
 │     └── Lifecycle (draft|active|archived|deleted)
 ├── Relationship (rel_)        ── directed, typed, attributed
 ├── Timeline (tl_)             ── event-sourced
 │     └── Activity (act_)
 ├── Evidence (evd_)            ── citations for any claim
 ├── Signal (sig_)              ── derived from delta diffs (10)
 ├── Capability (cap_)          ── declared actions (05)
 └── Memory (mem_) ── three-axis:
       ├── Spine-truth     (L1)
       ├── Twin-meaning    (L7 of pipeline → see 07)
       └── Knowledge-doc   (SOPs, runbooks)
```

### 2.3 Canonical IDs

- Type-prefixed nanoid (collision-resistant, URL-safe).
- Tenants carry `tnt_id`; workspaces scoped under tenant with `wsp_id`.
- Cross-tenant references are forbidden except via `rel_external` and an explicit Marketplace grant (see 13).
- Every ID has a 32-byte SHA-256 content-hash sidecar so duplicates can be detected without a lookup.

### 2.4 Entity lifecycle

```
draft ──▶ active ──▶ archived ──▶ (soft-deleted)
  ▲          │            │
  │          ▼            ▼
  └────── proposed ◀── restore
              │
              ▼
          hard-deleted  (judicial only; tenant_id + actor + signed reason required)
```

- **Soft delete:** `lifecycle.status = "deleted"`, retained 90 days, hidden from projections.
- **Hard delete:** requires Governance Token (09) with `gov.posture=judicial` and an immutable audit record (16).

### 2.5 Timeline model

- Append-only timeline table keyed by `tl_id`.
- Every state change creates one Timeline entry; the row in the entity table is a projection of the latest Timeline entry.
- Form: `{ tl_id, tnt_id, ent_id, kind, payload, actor, occurred_at, source_connector, evidence_refs[] }`.

### 2.6 Relationship graph

- Directed, typed, attributed edges in relationship (`rel_`).
- Allowed types: `belongs_to`, `depends_on`, `references`, `derived_from`, `supersedes`, `contested_by`.
- Graph traversal API: `POST /spine/graph/traverse { from, edge[], to?, depth, as_of? }` returns a DAG slice as-of `as_of`.

### 2.7 Event model (Spine-internal)

| Event                  | Producer     | Notes                       |
| ---------------------- | ------------ | --------------------------- |
| EntityCreated          | 02           | new ent\_                   |
| EntityUpdated          | 02           | attribute mutation          |
| EntityMerged           | 02           | conflict resolution applied |
| EntityArchived         | 02           | lifecycle change            |
| RelationshipAsserted   | 02           | new rel\_                   |
| RelationshipRetracted  | 02           | withdrawn edge              |
| TimelineAppended       | 02           | always emitted, fan-out     |
| ProvenanceRecorded     | 02           | evidence link added         |
| SpineSnapshotRequested | 20 / runbook | scheduled export            |
| VersionPinned          | 02           | explicit as-of point        |

### 2.8 Versioning

- Each Entity row carries `version` (monotonic per entity).
- Every mutation increments version; never decrements.
- Temporal query `?as_of=ISO8601` reads Timeline to reconstruct.
- Schema migrations bump `tenant_spine_config.schema_version` (aligned to m054+).

### 2.9 Provenance

- Every Entity / Relationship row carries `provenance[]`: at least one of `{ actor, source_connector, evidence_ref, derived_signal }`.
- `derived_signal` requires the originating `sig_id` to be reproducible.
- Provenance is required for any field flagged `pinned` in the Entity Framework (12).

### 2.10 Merge / conflict rules

| Source                           | Authoritative for       | Loses to                           |
| -------------------------------- | ----------------------- | ---------------------------------- |
| Connector Delta (≤ 30s old)      | field-level truth       | local edit during soft-sync window |
| Local edit (pending soft-sync)   | during soft-sync window | Connector Delta after window       |
| Twin proposal (pending approval) | never (read-only)       | always                             |
| Hard governance action           | always                  | all                                |

**Rule of thumb:** most-recent timestamp wins, except (a) pinned fields never auto-update, (b) governance-required fields always block, (c) explicitly merged events track both sides.

### 2.11 Soft vs hard deletion

- Soft delete is the default; surfaces omit the row.
- Hard delete requires `gov.judicial` token (09) and is recorded in `audit_log` (16) forever.
- Cross-tenant hard delete is impossible.

### 2.12 Temporal queries

```
GET /spine/entities/ent_abc123            # latest
GET /spine/entities/ent_abc123?as_of=2025-03-01T00:00:00Z
GET /spine/relationships?from=ent_a&to=ent_b&as_of=…
```

- All temporal reads go through `spineRead` MCP tool; no Workbench code may bypass it.

### 2.13 Storage (D1 + Durable Objects)

- **Hot metadata:** D1 (`spine.entities`, `spine.relationships`, `spine.timeline`, `spine.provenance`).
- **Per-tenant Durable Object:** `SpineDO{tnt_id}` for transactional consistency of a tenant's write stream.
- **Cold snapshots:** R2 (`/snapshots/{tnt_id}/{date}.parquet`).

### 2.14 APIs

| Method | Path                     | Purpose                          |
| ------ | ------------------------ | -------------------------------- |
| POST   | /spine/entities          | create entity                    |
| PATCH  | /spine/entities/{ent_id} | mutate (issues TimelineAppended) |
| GET    | /spine/entities/{ent_id} | read (with ?as_of)               |
| POST   | /spine/relationships     | assert                           |
| GET    | /spine/graph/traverse    | DAG slice                        |
| GET    | /spine/timeline          | paginate timeline                |
| POST   | /spine/restore/{ent_id}  | from soft-delete                 |

### 2.15 Failure handling

- D1 retry: exponential, 5 attempts, ≤ 30s.
- DO retry: 3 attempts; on exhaustion → deferred_queue (Cloudflare Queue) with `evt_id`.
- Temporal read with missing Timeline entries: surface "incomplete provenance" banner instead of silent fallback.

### 2.16 Extension points

- Custom entity types (12) registered at `tenant_spine_config.enabled_entities[]`.
- Custom provenance reporters (e.g., SHA-pinning artifacts).
- Custom merge strategies via plugin interface `SPINE_MERGE_PLUGIN(name)`.

---

## 03 — Workspace Runtime

### 3.1 Responsibilities

- Define the Workspace unit (Personal / Work / Business).
- Hold per-workspace context, projections, module set, layout, and persistence.
- Handle workspace switching without losing Twin continuity (Continuity Bridge).

### 3.2 Workspace definition

```yaml
workspace_id: wsp_abc
tenant_id:   tnt_xyz
type:        personal | work | business
persona:     { department: CTX_SALES, industry: saas_tech, sub_role: AE }
modules:     [leads, accounts, deals, signals]
layout:      ref→ prj_layout_01
created_at, updated_at, archived_at
```

### 3.3 Lifecycle

```
init ──▶ bootstrapping ──▶ active ──▶ suspended ──▶ archived
                                └──▶ migrated (tenant merge)
```

### 3.4 Inputs

- Onboarding completion event (per existing spec).
- Manual add/remove of modules and layouts.
- Administrator actions.

### 3.5 Outputs

- Workbench projection mount points.
- Persona-side module compatibility matrix.
- Continuity Bridge context bundle (delivered to Twin on switch).

### 3.6 Events

- **Produced:** WorkspaceCreated, WorkspaceSwitched, WorkspaceModuleAdded, WorkspaceModuleRemoved, WorkspaceArchived, WorkspaceMigrated.
- **Consumed:** `onboarding_complete=true`, TenantMerged, UserRoleChanged.

### 3.7 APIs

`POST /workspaces`, `GET /workspaces/{wsp_id}`, `POST /workspaces/{wsp_id}/switch`, `POST /workspaces/{wsp_id}/modules/{module_id}`, `DELETE /workspaces/{wsp_id}/modules/{module_id}`.

### 3.8 State transitions

Switching is a `WorkspaceSwitched` event and updates `user.last_workspace_id`; the Twin suspends but does not lose memory.

### 3.9 Failure handling

- Module load failure → fallback to "minimal" module set (always-on: leads, signals, evidence).
- Migration failure → block switch, surface diff in Workbench.

### 3.10 Extension points

- Custom modules (see 12).
- Custom layouts persisted via 18 (Design Tokens) but routed through Projection Engine (04).

---

## 04 — Projection Engine

### 4.1 Responsibilities

- Project the Spine into Workbench, Persona, Workspace, and React components.
- Own cursor strategy, pagination, widget layouts, and per-persona defaults.

### 4.2 Pipeline

```
Spine (02) ──▶ Projection Engine ──▶ Persona (06) ──▶ Workspace (03) ──▶ React Components (18)
```

### 4.3 Inputs

- Spine reads (with as_of).
- Persona fits from `tenant_spine_config`.
- Workspace layout ref.
- User viewport, locale, density.

### 4.4 Outputs

- Render-tree JSON (workbench), iframe-bundle (webview), push payload (mobile/Slack).

### 4.5 Events

- **Produced:** ProjectionBuilt, ProjectionStale, ProjectionInvalidated.
- **Consumed:** every evt\_… from Spine (02), PersonaChanged, WorkspaceSwitched.

### 4.6 APIs

`POST /project/build`, `GET /project/{prj_id}?as_of=…`, `POST /project/{prj_id}/invalidate`.

### 4.7 State transitions

`pending → building → fresh → stale → invalid → fresh`.

### 4.8 Failure handling

- Incomplete Spine data → render safe-empty with explicit chip ("Evidence partial").
- Persona mismatch → render lockout (Persona Barrier).

### 4.9 Extension points

- Custom widget renderer (Widget SDK — listed under 17).
- Custom projection transforms `PROJECTION_TRANSFORM(name)`.

---

## 05 — Capability Fabric

### 5.1 Responsibilities

- Host the capability registry (`cap_id`).
- Resolve invocation surfaces uniformly.
- Bind sync mode (soft | real | propose) and rollback strategy.
- Mint governance tokens when required.

### 5.2 Capability definition

```yaml
id: cap_draft_outreach # canonical
name: Draft Outreach
description: Free-text. Includes the persona-fit profile.
version: 1.4.2
inputs:
  to_lead_id: { type: ent_id, required: true, scope: leads }
  template_id: { type: ent_id, required: false }
  personalization: { type: string, required: false, max: 4000 }
outputs:
  draft_id: { type: ent_id, scope: messages }
  confidence: { type: number, range: [0, 1] }
requiredScopes: [leads:read, messaging:write]
confidenceThreshold: 0.7
defaultSyncMode: soft
governancePolicy: propose
auditSchema: { actor, lead_id, delta_text_hash, proposal_only }
rollbackStrategy: delete_draft
surfaceCompatibility:
  workbench: true
  twin: true
  chat: true
  cli: true
  slack: true
  mobile: true
```

### 5.3 Lifecycle

```
declared ──▶ registered ──▶ versioned ──▶ deprecated ──▶ removed
                              │
                              └──▶ revoked (security incident)
```

### 5.4 Inputs

- Capability SDK / manifest submission.
- Admin overrider via governance_posture.

### 5.5 Outputs

- A capability invocation record `cap_invocation` and the corresponding `gov_token` when applicable.

### 5.6 Events

- **Produced:** CapabilityRegistered, CapabilityDeprecated, CapabilityInvoked, CapabilityCompleted, CapabilityFailed, CapabilityRolledBack.
- **Consumed:** PersonaChanged, ConnectorHealthyChanged, WorkspaceSwitched, TwinProposing.

### 5.7 APIs

`POST /capabilities`, `POST /capabilities/{cap_id}/invoke`, `GET /capabilities/{cap_id}/invocations`.

### 5.8 State transitions (per invocation)

`requested → validated → authorized → executing → succeeded | failed | rolled_back`.

### 5.9 Failure handling

- Auth failure → reject before Connector call.
- Connector call failure → invoke rollbackStrategy; emit CapabilityFailed.
- Replay protection via idempotency key in the capability invocation row.

### 5.10 Extension points

- Vendors may register new capabilities via Marketplace (13).
- Conflicting capability ids rejected by prefix rule.

---

## 06 — Twin Runtime

### 6.1 Responsibilities

- Drive the OODA loop for the user-facing Twin.
- Compose context, prompt, persona grammar, evidence, tool calls, capability selections.
- Calibrate confidence and produce proposals.

### 6.2 Flow

```
User input / screen-state
   ↓
Context Builder        (Continuity Bridge, persona, screen)
   ↓
Memory Retrieval       (07; references L1–L7)
   ↓
Evidence Ranking       (02; evd_ refs sorted by recency + relevance)
   ↓
Prompt Builder         (Persona Grammar)
   ↓
LLM call               (Cloudflare AI Gateway, plumbed provider)
   ↓
Tool selection         (resolve capability or read-only spineRead)
   ↓
Confidence calibration (cap.confidenceThreshold)
   ↓
Proposal generation    (cap.governancePolicy == propose)
   ↓
Twin response          (Message Object: blocks, evidence, snapshots, actions)
```

### 6.3 Persona Grammar

- Maya (Sales) — terse, action-oriented.
- Sana (CS) — cautious, evidence-heavy.
- Tomás (Engineering) — diagnostic.
- (Others inherited; persona grammar ref: `twin_greeting_id` and `persona_grammar_ref` in `tenant_spine_config`.)

### 6.4 Activation gate (safety invariant)

- Existing `evaluateActivation` from original spec preserved.
- Additional checks: minimum memory depth (L7 has at least one approved item), governance posture set, Continuity Bridge non-empty.

### 6.5 Inputs

- User chat / surface action.
- Screen-state projection (04).
- Continuity Bridge context.

### 6.6 Outputs

- Message Object per existing spec.
- Capability invocations (05).
- Memory intakes (07 → L1).

### 6.7 Events

- **Produced:** TwinResponded, TwinProposing, TwinContextBuilt, TwinMemoryIntake.
- **Consumed:** every Projection/Stale from 04, every Memory Approve/Reject from 07, every Governance Decision from 09.

### 6.8 APIs

`POST /twin/chat`, `POST /twin/propose`, `GET /twin/messages/{msg_id}`.

### 6.9 State transitions (per turn)

`received → building → proposing | executing → responded → archived`.

### 6.10 Failure handling

- LLM timeout → degrade to "Last Good Answer" projection; mark `TwinResponded(stale=true)`.
- Persona Grammar missing → fallback to neutral; warn.
- Memory retrieval empty → operation continues with explicit "no prior context" chip.

### 6.11 Extension points

- Custom persona grammar via `twin.grammar` package.
- Custom tool resolvers.

---

## 07 — Memory System

### 7.1 Responsibilities

- Own the 8-layer memory pipeline (already defined in original spec).
- Bind the three-axis separation: Spine (truth), Memory (meaning), Knowledge (docs).
- Operate the Promotion Queue as the human-in-the-loop gate.

### 7.2 The eight layers

```
L1 Twin Memory        — conversational working memory (ephemeral, ≤10 turns)
L2 Memory Intake      — raw observations, immutable for 24h
L3 Triage Bot         — classification (fact | decision | observation | relationship | noise)
L4 Memory Evolution   — pattern detection (cluster, dedupe, propose promotion)
L5 Promotion Queue    — staging surface (single most important screen)
L6 Human Approval     — gating event (MemoryApproved | MemoryRejected)
L7 Organizational Memory — durable, indexed, queryable
L8 Knowledge          — SOPs, playbooks, runbooks (curated from L7 + human authored)
```

### 7.3 Inputs

- TwinMemoryIntake events (from 06).
- Manual memory creation (Admin).
- Knowledge imports (Markdown, Docs).

### 7.4 Outputs

- Promotion Queue items.
- L7 search hits (`mem.search(…")`).
- Knowledge article refs.

### 7.5 Events

- **Produced:** MemoryTriaged, MemoryPromoted, MemoryApproved, MemoryRejected, MemoryDeprecated, KnowledgeArticlePublished.
- **Consumed:** TwinMemoryIntake, EntityUpdated (to evolve), AdminMemoryEdited.

### 7.6 APIs

`POST /memory/intake`, `GET /memory/promotion-queue`, `POST /memory/{mem_id}/approve`, `POST /memory/{mem_id}/reject`, `GET /memory/search`.

### 7.7 State transitions

`intake → triaged → cluster → queued_for_promotion → approved | rejected → deprecated`.

### 7.8 Failure handling

- Triage bot mis-classifies → user may re-tag (human-in-the-loop).
- Stuck queue → admin SLA alert (16).

### 7.9 Extension points

- Custom Triage Bot rules.
- Custom Evolution patterns.

---

## 08 — Connector Framework

### 8.1 Responsibilities

- Own connector lifecycle (declared → registered → healthy → degraded → retired).
- Manage authentication, refresh, sync policy, retry, conflict, health.

### 8.2 Lifecycle

```
declared ──▶ sandboxed ──▶ certified ──▶ active ──▶ degraded ──▶ retired
                                  │           │            │
                                  ▼           ▼            ▼
                              revoked     recovering    archived
```

### 8.3 Adapter interface (canonical contract)

```typescript
interface ConnectorAdapter {
  id: string; // e.g., "salesforce"
  version: string;
  scopes: string[];

  // discovery
  capabilities(): CapabilityDescriptor[];

  // lifecycle
  install(ctx): Promise<void>;
  uninstall(ctx): Promise<void>;
  refresh(ctx): Promise<Refreshed>;
  health(): Promise<HealthSnapshot>;

  // data plane
  pull(since): AsyncIterable<ConnectorDelta>;
  push(intent): Promise<PushResult>;
  revert(intent, reason): Promise<void>;

  // error model
  classify(err): ErrorClass; // transient | permission | schema | rate | fatal
}
```

### 8.4 Authentication lifecycle

- OAuth via Nango.
- Tokens stored vault-side (14).
- Refresh on `expires_in * 0.75` margin.
- Per-tenant secret rotation cadence.

### 8.5 Sync policies

- Soft sync (default for sensitive industries), Real sync (default for high-volume mutations), Propose→Approve (default for high-risk actions).
- Conflict resolution deferred to Spine (02) by emitting a Connector Delta.

### 8.6 Retry policy

- **Transient:** 5 attempts, exponential with jitter.
- **Permission:** 0 retry, surface via Workbench banner requiring admin action.
- **Schema:** 0 retry, dataclass outlier → admin queue.
- **Rate:** token-bucket per vendor (Cloudflare Queue throttle).
- **Fatal:** connector retired and HealthChanged emitted.

### 8.7 Health monitoring

`HealthSnapshot { status: healthy | degraded | down, latency_ms, error_rate, last_sync_at, breaker_state }`.

### 8.8 Inputs

- Vendor API events (webhooks), Connector Deltas.
- Admin actions (install/uninstall/revoke).

### 8.9 Outputs

- Connector Deltas → Spine (02).
- ConnectorHealthyChanged events → Workflows, Signals.

### 8.10 Events

- **Produced:** ConnectorInstalled, ConnectorSynced, ConnectorHealthyChanged, ConnectorDeltaReceived, ConnectorRefreshed, ConnectorRetired.
- **Consumed:** UserRoleChanged, WorkspaceArchived, TenantMerged.

### 8.11 APIs

`POST /connectors`, `DELETE /connectors/{conn_id}`, `POST /connectors/{conn_id}/sync`, `GET /connectors/{conn_id}/health`.

### 8.12 State transitions

Per state machine in 8.2, with breaker transitions on health.

### 8.13 Failure handling

- Consecutive failures > N → degraded then down, emit ConnectorHealthyChanged.
- Backoff + dead-letter queue (Cloudflare Queue).

### 8.14 Extension points

- New connectors authored against SDK (17).
- Custom retry policy per vendor.

---

## 09 — Governance Engine

### 9.1 Responsibilities

- Issue governance tokens (`gov_…`) before any high-risk write.
- Enforce approval chains and confidence thresholds.
- Drive multi-level approvals and delegations.
- Operate emergency overrides.

### 9.2 Approval chain

- Confidence ≥ 0.85 → auto-approve (subject to posture).
- 0.70 ≤ Confidence < 0.85 → single approver.
- Confidence < 0.70 → multi-level approver chain.
- `governancePolicy = judicial` → N-of-M approvers; cannot be auto-approved.

### 9.3 Token minting

```yaml
gov_token:
  id: gov_abc
  capability_id: cap_update_field
  ent_id: ent_lead_123
  delta: { … }
  posture: propose | judicial | auto
  approver_chain: [usr_mgr, usr_director]
  expires_at: ISO8601
  audit_ref: obs_audit_…
```

### 9.4 Policy engine

- Policies declared in `tenant_spine_config.governance_posture` (per existing spec).
- Policies can be capability-scoped, entity-typed, or field-pinned.

### 9.5 Emergency overrides

- Break-glass token requires MFA + auto-creates AuditEvent flagged `severity=emergency` (16).

### 9.6 Inputs

- CapabilityInvoked with governancePolicy != null.
- Admin overrides.

### 9.7 Outputs

- `gov_token` issued, then CapabilityAuthorized event.

### 9.8 Events

- **Produced:** GovernanceRequested, GovernanceApproved, GovernanceRejected, GovernanceTokenMinted, GovernanceOverrode.
- **Consumed:** CapabilityInvoked, AdminOverrideRequested.

### 9.9 APIs

`POST /governance/request`, `POST /governance/{gov_id}/approve`, `POST /governance/{gov_id}/reject`.

### 9.10 State transitions

`requested → pending_approval → approved | rejected | overrode | expired`.

### 9.11 Failure handling

- Approver unavailable → fallback to next in chain + SLA breach (16).
- Expired token → re-request.

### 9.12 Extension points

- Custom policies via `POLICY_PACK(name)`.
- Delegated approvers.

---

## 10 — Signal Engine

### 10.1 Responsibilities

- Detect deltas, classify them, score them, surface them as Signals, derive Insights, and feed Proposals into Twin.

### 10.2 Pipeline

```
Connector Delta ──▶ Detection Rule ──▶ Aggregation ──▶ Scoring ──▶ Priority ──▶ Signal ──▶ Insight ──▶ Proposal
```

### 10.3 Signal definition

```yaml
sig_id: sig_abc
kind: risk | opportunity | anomaly | trend | slip
subject: ent_lead_123
score: 0..1
priority: p0 | p1 | p2 | p3
detected_at: ISO8601
ttl: duration
provenance: […]
```

### 10.4 Detection Rule (DSL)

```yaml
rule:
  id: sig_rule_renewal_risk_30d
  trigger: ConnectorDelta(conn=salesforce, object=opportunity, field=close_date)
  condition: close_date - today <= 30d AND stage_change_count >= 2
  aggregate: over(7d) by ent_account_id
  score: 0.8
  priority: p1
  downstream: [signal, insight, proposal_cap_mark_renewal_risk]
```

### 10.5 Inputs

- ConnectorDeltaReceived (08).
- Memory evolution events (07) for cross-source patterns.

### 10.6 Outputs

- SignalCreated, InsightDerived, ProposalGenerated.

### 10.7 Events

- **Produced:** SignalCreated, SignalScored, InsightDerived, ProposalGenerated, SignalExpired.
- **Consumed:** ConnectorDeltaReceived, MemoryPromoted.

### 10.8 APIs

`POST /signals/rules`, `GET /signals?priority=…`, `POST /signals/{sig_id}/accept`, `POST /signals/{sig_id}/dismiss`.

### 10.9 State transitions

`detected → scored → surfaced → accepted | dismissed | expired`.

### 10.10 Failure handling

- Rule evaluation failure → dead-letter queue.
- Signal TTL elapsed → emit SignalExpired.

### 10.11 Extension points

- New detection rules via Marketplace (13) or admin SDK.

---

## 11 — Workflow Engine

### 11.1 Responsibilities

- Run deterministic, retryable, schedulable automations triggered by Events.
- Compose capabilities (05) with approvals (09) and human tasks.

### 11.2 Anatomy

```yaml
workflow:
  id: wf_renewal_save_play
  trigger: SignalCreated(kind=risk, score>=0.7)
  steps:
    - call: cap_mark_renewal_risk
      with: { lead_id: trigger.subject }
      on_error: notify_owner
    - human_task: review_renewal_plan
      assignee: owner
    - call: cap_schedule_call
      with: { lead_id: trigger.subject, when: +2d }
  retries:
    cap_mark_renewal_risk: 3 backoff=exp
  schedule: none
```

### 11.3 Inputs

- Any Event Bus event by name.
- Cron schedules.

### 11.4 Outputs

- Step records and final outcome event WorkflowCompleted | WorkflowFailed.

### 11.5 Events

- **Produced:** WorkflowStarted, WorkflowStepCompleted, WorkflowHumanTaskCreated, WorkflowCompleted, WorkflowFailed, WorkflowRetried.
- **Consumed:** all event bus events (filtered by trigger).

### 11.6 APIs

`POST /workflows`, `POST /workflows/{wf_id}/run`, `GET /workflows/runs/{run_id}`.

### 11.7 State transitions

`scheduled → running → waiting_human → running → completed | failed`.

### 11.8 Failure handling

- Per-step retries, exponential, max configurable.
- After max retries → WorkflowFailed + admin notification.

### 11.9 Extension points

- New step types (including external HTTP), marketplace-distributed templates.

---

## 12 — Entity Framework

### 12.1 Responsibilities

- Define the canonical entity types permitted per tenant (`enabled_entities`).
- Provide inheritance, dynamic fields, industry extensions, validation.

### 12.2 Inheritance

```
Entity (base: id, version, lifecycle, provenance)
 ├── AggregateEntity (typed by purpose)
 │     ├── CRMAccount     (inherits references[] → contacts)
 │     ├── CRMLead
 │     ├── CRMOpportunity
 │     ├── Ticket
 │     ├── Invoice
 │     └── …
 └── ReferenceEntity
       ├── User
       ├── Product
       └── …
```

### 12.3 Dynamic fields

- Schema-additive. Each tenant may add fields via `tenant_spine_config.field_extensions[]`.
- Fields typed `string | number | date | ref | enum | json`.

### 12.4 Industry extensions

- Declared in the 12×11 matrix; example for Healthcare: `phi_flag`, `consent_ref`, `hipaa_scope`.

### 12.5 Validation

- Type-level validators per field.
- Cross-entity validators (e.g., `opportunity.amount > 0 AND opportunity.stage != closed`).
- Validator plugins `VALIDATOR(name)`.

### 12.6 References and graph traversal

- Reference integrity checked via Spine (02).

### 12.7 Events

- **Produced:** EntityTypeRegistered, EntityExtensionAdded.
- **Consumed:** OnboardingComplete to seed enabled entities.

### 12.8 APIs

`POST /entity-types`, `POST /entity-types/{type}/fields`, `POST /entities/validate`.

### 12.9 Failure handling

- Validation failure blocks write; suggests fix in the error message.
- Extension conflicts surface as admin warnings.

---

## 13 — Marketplace

### 13.1 Responsibilities

- Listings for Connectors, Capabilities, Workflows, Design Packs, Persona Kits.
- Installation, upgrade, uninstall, reinstallation, tenant migration.

### 13.2 Listing model

```yaml
mkt_listing:
  id: mkt_listing_…
  vendor: org_…
  kind: connector | capability | workflow | design_pack | persona_kit
  version: semver
  visibility: public | tenant_only | beta
  permissions: [scopes…]
  pricing: free | trial | metered | seat
  trial_days: 14
  artifacts: [signed bundle URLs]
  audits: last_review_at, reviewer
```

### 13.3 Installation lifecycle

```
discover ──▶ trial ──▶ purchase ──▶ installed ──▶ upgraded ──▶ (uninstalled | reinstalled)
                                │         │           │
                                ▼         ▼           ▼
                            refunded   downgraded   archived
```

### 13.4 Tenant migration

- Migrating a listing installation is a re-bind; IDs preserved via `installation_id`.
- Revoked listing → all hanging tenants receive `ListingRevoked` event.

### 13.5 Permissions / Billing / Trial / Uninstall / Reinstall

- Permissions enforced by Governance (09) on first invocation.
- Billing via Stripe (CF Worker integration); usage events emitted for metered SKUs.
- Trial marks tenant with `trial=true`; expiry triggers downgrade flow.
- Uninstall revokes tokens, archives projection cache, retains audit (16).
- Reinstall uses `installation_id` to keep Connector credentials rotation-safe.

### 13.6 Events

- **Produced:** ListingInstalled, ListingUpgraded, ListingTrialStarted, ListingUninstalled, ListingRevoked, ListingBilled.
- **Consumed:** CapabilityRegistered, WorkflowRegistered.

### 13.7 APIs

`POST /marketplace/listings`, `POST /marketplace/install`, `POST /marketplace/{mkt_id}/uninstall`, `POST /marketplace/{mkt_id}/upgrade`.

### 13.8 Failure handling

- Install auth failure → reject + admin notification.
- Uninstall mid-call → mark pending then finalize.

### 13.9 Extension points

- Vendors onboard through SDK (17), validated by automated review and manual sign-off.

---

## 14 — Security Architecture

### 14.1 Responsibilities

- Zero Trust model at the Gateway and Worker level.
- Tenant isolation, secrets, keys, encryption, RBAC inheritance, ABAC, sessions.

### 14.2 Tenets

- Every request is authenticated.
- Every request is authorized for the specific tenant + workspace + entity.
- Secrets never leave the Vault.
- Encryption at rest (D1+R2) and in transit (HTTPS).

### 14.3 Tenant isolation

- **Logical:** row-level multi-tenancy via `tnt_id` predicate in every query.
- **Physical:** per-tenant D1 partition (`tnt_id` sharding key) + per-tenant DO.
- **Network:** egress to connectors only via Nango + allowlist.

### 14.4 Secret management

- Cloudflare Secrets + KMS-backed envelope.
- Key rotation cadence: 90 days for connector tokens; 30 days for signing keys.

### 14.5 RBAC inheritance

- Roles (`rbac_roles`) inherit capabilities and permissions.
- `rbac_users.scope` is the persona barrier.

### 14.6 ABAC layer

- Attribute-based decisions supplement RBAC: time-of-day, region, device posture, signal severity.

### 14.7 Session management

- Short-lived signed JWTs (≤ 30 min), refresh-token chain bound to device fingerprint.
- Re-auth required on tenant switch.

### 14.8 Events

- SecurityAlert, SecretRotated, KeyRotated, SessionAnomalous.

### 14.9 APIs

`GET /security/policies`, `POST /security/secrets/{name}/rotate`, `POST /security/sessions/{sid}/revoke`.

### 14.10 Failure handling

- Repeated anomalies → account lock + alert (16).

### 14.11 Extension points

- ABAC pluggable via `POLICY_PACK(name)`.

---

## 15 — Deployment Architecture

### 15.1 Cloudflare-native topology

```
Cloudflare
   │
   ▼
Gateway (Worker)              ── auth, routing, rate limit
   │
   ▼
Workers (stateless compute)   ── Twin, Memory, Signals, Workflows, Marketplace
   │
   ▼
Queues                       ── retries, dead-letter
   │
   ▼
D1 + DO                      ── Spine, RBAC, projections
   │
   ▼
KV                           ── capability registry, persona greetings cache
   │
   ▼
R2                           ── snapshots, audit archive, listing bundles
   │
   ▼
Durable Objects              ── per-tenant SpineDO, TwinAgent DO, TenantBrainDO
   │
   ▼
External Connectors          ── via Nango + MCP
```

### 15.2 Environments

| Env     | Purpose                           |
| ------- | --------------------------------- |
| dev     | personal compute                  |
| staging | synthetic tenant population       |
| prod    | multi-region (CF smart placement) |

### 15.3 Release strategy

- Dark-launch via feature flag (FeatureFlag per tenant).
- Progressive rollout 1% → 10% → 50% → 100%.
- Rollback via flag flip.

### 15.4 Migration strategy

- Versioned migrations, reversible, dry-run in staging.
- Schema migration bumps `tenant_spine_config.schema_version` (m054+).

### 15.5 Failure handling

- Worker crash → DO alarm catches; CF retry + Queue.

### 15.6 Extension points

- Region pinning per tenant.

---

## 16 — Observability

### 16.1 Responsibilities

- Traces, logs, metrics, audits, healthchecks, service map.

### 16.2 Trace model

- OpenTelemetry-compatible spans, exported via Cloudflare Logpush → Honeycomb/Datadog.

### 16.3 Logs

- Structured JSON, `tnt_id` always present, retain 90 days hot, 1 year cold.

### 16.4 Metrics

- Latency p50/p95/p99 per Gateway route.
- Error rate per capability, per connector.
- Cost per LLM call, per Twin turn.

### 16.5 Audit

- `obs_audit`: append-only, signed, retained 7 years (regulatory baseline).
- Audit events emitted by Governance (09), Memory Human Approval (06/07), Judicial actions, Security (14).

### 16.6 Healthchecks

- `/healthz` Worker + DO probes.

### 16.7 Service map

- Generated from traces; exported as graph.

### 16.8 Events

- **Emitted:** AuditAppended, AlertRaised, HealthCheckFailed.

### 16.9 APIs

`/obs/audit`, `/obs/metrics`, `/obs/traces`, `/obs/health`, `/obs/alerts`.

### 16.10 Failure handling

- Alert SLA: P0 ≤ 5 min notify, P1 ≤ 30 min, P2 ≤ 4 h.

### 16.11 Extension points

- Webhook exporters.

---

## 17 — SDKs

### 17.1 Server SDK (`@integratewise/server`)

- Capability registration, connector adapters, policy packs, projection transforms.

### 17.2 Capability SDK contributor guide

- Author `cap_*.yaml` per 05.
- Validation rules + code-signing step.

### 17.3 Connector SDK (`@integratewise/connector-sdk`)

- Implements `ConnectorAdapter` (08.3).
- Provides test harness: `connector test --mock-vendor=mux`.

### 17.4 Worker SDK (`@integratewise/worker`)

- Helpers for Spine, Twin, Workflows, Signals.

### 17.5 Client SDKs

- `@integratewise/react`, `@integratewise/swift`, `@integratewise/kotlin`.

### 17.6 CLI (`@integratewise/cli`)

- `iw onboard`, `iw capability register`, `iw connector test`, `iw marketplace publish`.

### 17.7 Versioning

- All SDKs follow semver; breaking changes shipped with MAJOR + migration guide.

---

## 18 — UI / Design System

### 18.1 Design token spec

- Color, type, spacing, motion, density, dark/light.
- Tokens published as CSS vars and JSON; versions align with Design Pack releases.

### 18.2 Components

- Button, Card, Table, Timeline, Activity Feed, Evidence Ribbon, Promotion Queue, Workspace Switcher, Command Palette, Notification Center.

### 18.3 Theme & density

- Per-tenant theme tokens; high-density worksurfaces opt-in.

### 18.4 Extension SDK

- Custom tokens registered through `theme.json` (validated via CLI).

---

## 19 — API Contracts

### 19.1 Versioning

- URI version (`/v1/…`, migrating to `/v2025-09/…` for explicit dates).
- Deprecation policy: 6 months notice, sun-set banner, parallel-run.

### 19.2 Error model

```json
{ "code": "IW-1234", "message": "…", "doc": "https://…", "trace_id": "…" }
```

- Codes are stable; messages may be translated.

### 19.3 Pagination

- Cursor-based by default (`?cursor=…&limit=…`).
- Page size limit max 1000.

### 19.4 Feature flags

- `X-IW-Feature-Flags` header; tenant overrides honor most-specific scope.

### 19.5 Configuration system

- Server-driven config: `tenant_spine_config` (existing) + `feature_flags` + `experiment_assignments`.

### 19.6 Testing strategy

- Contract tests against openapi spec (`@integratewise/contract-tests`).
- Synthetic tenant population tests.

---

## 20 — Operations Runbooks

### 20.1 Daily motion runbook

- Morning brief sanity, Promotion Queue SLAs, Connector healthcheck dashboard review.

### 20.2 Incident runbooks

- **P0:** Twin down → revert to "Last Good Answer" projection.
- **P0:** Connector down → triage by vendor, Nango re-auth, soft-sync queue flush.
- **P1:** Spine write failures → DO alarm, retry, manual rebuild.
- **P2:** Signal lag → check rule DSL hot-reload.

### 20.3 Compliance runbook

- Quarterly RBAC review.
- Annual encryption & key rotation.

### 20.4 DR runbook

- R2 snapshot restore flow documented in runbook channel (links 15, 16, 02).

---

# PART II: ADVANCED SUBSYSTEMS (21–34)

---

## 21 — Business Ontology ⭐ (foundational)

### 21.1 Why this is the largest gap

The original spec defined `tenant_spine_config` and the entity graph with concrete entity types but no ontological foundation. Two B2B SaaS tenants that both have a "Person" need that to be the same concept, queried the same way, governed the same way.

### 21.2 The 16 root concepts

| Concept      | Definition                                                      |
| ------------ | --------------------------------------------------------------- |
| Organization | Legal entity owning the tenant                                  |
| Workspace    | Bounded context inside Organization (inherits from 03)          |
| Person       | First-class human (User is a Person with login)                 |
| Team         | Durable grouping of Persons, with role inheritance              |
| Process      | Repeatable set of capabilities used to produce Outcomes         |
| Project      | Time-bound container of Activities                              |
| Objective    | Measurable target a Process or Project exists to advance        |
| Outcome      | Observed result, scored against an Objective                    |
| Asset        | Durable, non-ephemeral object of value (data, doc, code, model) |
| Knowledge    | Distilled truth (SOP, playbook, runbook; sits at L8 of memory)  |
| Decision     | Recorded commitment (chair-of-record artifact)                  |
| Policy       | Rule that gates Decisions and Actions                           |
| Capability   | Declared action (inherits from 05)                              |
| Signal       | Derived observation (inherits from 10)                          |
| Memory       | Narrative artifact at any of the 8 layers (inherits from 07)    |
| Conversation | Twin ↔ User dialog (inherits from 06)                           |
| Time         | Canonical timeline reference (inherits from 02 Timeline)        |

### 21.3 Inheritance tree (canonical)

```
Thing (id, version, lifecycle, provenance, evidence[])  ← base
 ├── Organization
 ├── Workspace
 ├── Agent (23)
 ├── Knowledge
 ├── Decision
 ├── Policy
 └── TimeAnchor

AgentOfActivity (Thing + who/what performed)
 ├── Person           — has Identities (28)
 └── Agent            — has Lifecycle (23)

BoundedContainer (AgentOfActivity + lifecycle scope)
 ├── Team             — composition of Persons and Agents
 ├── Workspace        — composition of Things (03)
 └── Project          — composition of Activities, has Objective

ValueCarrier (Thing + has measurable state)
 ├── Asset
 ├── Knowledge        — value = reusability
 └── Decision         — value = commitment weight

Process (BoundedContainer + repeatable, has Objective)
 ├── Process          — def + runs[]
 └── Workflow         — runnable Process (inherits from 11)

Outcome (ValueCarrier + measured against Objective)
 ├── Outcome
 └── Signal           — derived from deltas (10)

Action (Thing + executes Capability, gated by Policy)
 ├── Capability        (inherits from 05)
 └── Conversation      — composed of Message Tuples
       └── Memory     — meaning-axis (07)
```

### 21.4 Canonical IDs per root concept

| Concept      | Prefix  | Notes                                                |
| ------------ | ------- | ---------------------------------------------------- |
| Organization | `org_`  | Legal entity; one Organization ⇒ one or more Tenants |
| Workspace    | `wsp_`  | Inherits from 03                                     |
| Person       | `usr_`  | Login-bound Person                                   |
| Team         | `team_` | Inherits from Person and Agent                       |
| Process      | `proc_` | Template; resolved through Workflows                 |
| Project      | `prj_`  | Inherits from Process                                |
| Objective    | `obj_`  | Has metric_id, target, range                         |
| Outcome      | `out_`  | Measured vs obj\_                                    |
| Asset        | `ast_`  | Sub-typed by kind                                    |
| Knowledge    | `knw_`  | Inherits from L8 memory                              |
| Decision     | `dec_`  | Chair-of-record artifact                             |
| Policy       | `pol_`  | Declarative rule                                     |
| Capability   | `cap_`  | Inherits from 05                                     |
| Signal       | `sig_`  | Inherits from 10                                     |
| Memory       | `mem_`  | Inherits from 07                                     |
| Conversation | `conv_` | Inherits from 06                                     |
| Time         | `tl_`   | Inherits from 02 Timeline                            |

### 21.5 Cross-concept reference rules

- A Capability always belongs to ≥ 1 Process.
- An Objective always references ≥ 1 Process.
- An Outcome always references ≥ 1 Objective and ≥ 1 Process.
- A Decision always references ≥ 1 Outcome OR ≥ 1 Signal.
- A Policy always references ≥ 1 Capability or Entity type.
- Memory is either Spine-truth, Twin-meaning, or Knowledge (three-axis separation, 07).

### 21.6–21.14 Runtime Contract

- **Responsibilities:** Define the 16 root concepts and inheritance tree; bind every ID prefix; bind cross-concept reference rules; pin three-axis Memory rule.
- **Inputs:** OnboardingComplete (initial seeding); admin declarations of new root concepts (rare).
- **Outputs:** Inheritance-validated entity writes (every new ent\_ must inherit from ≥ 1 root concept); schema version bumps force revalidation.
- **Events Produced:** OntologyDefined, ConceptExtensionAdded, ReferenceViolationDetected.
- **Events Consumed:** EntityCreated, EntityUpdated, SchemaVersionBumped.
- **APIs:** `GET /ontology/concepts`, `GET /ontology/inheritance/{kind}`, `POST /ontology/concepts`, `POST /ontology/validate`.
- **State transitions:** Ontology itself: draft → ratified → superseded.
- **Failure handling:** Reference violation → reject write, surface explainer referencing 21.5. Ontology supersession without migration → hard block writes involving supersession path.
- **Extension points:** Vendors may add new root concepts (rare, requires Steering Committee review). New sub-types within an existing concept are normal extensions.

---

## 22 — AI Model Runtime

### 22.1 Responsibilities

Own the AI Gateway at the model-routing layer (Cloudflare AI Gateway). Model selection, routing, cost optimization, latency routing, fallback hierarchy. Prompt versioning, evaluation, safety filters, caching, streaming.

### 22.2 Pipeline

```
User Request
   ↓
Intent Detection
   ↓
Model Router
   ↓
Model Selection
   ↓
Tool Calls (via 05 Capability Fabric)
   ↓
Response Validation
   ↓
Memory Commit (via 07 Memory → L1)
```

### 22.3 Inputs

- Twin chat (06).
- Workflow steps (11) calling capability `cap_llm_x`.
- Ad-hoc admin calls from `/ai/run`.

### 22.4 Outputs

- Streamed (SSE or chunked) or buffered model output.
- Memory intake events (07 / L1).
- Cost/latency metrics (16, 30).

### 22.5 Events Produced

ModelRouted, ModelInvoked, ModelStreamingStarted, ModelCompleted, ModelFailed, ModelFallbackEngaged, PromptVersionUsed, SafetyFilterTriggered, CacheHit, CacheMiss, EvalRunCompleted.

### 22.6 Events Consumed

TwinChat, CapabilityInvoked (when capability is llm\_\*), WorkflowStepStarted.

### 22.7 APIs

`POST /ai/run`, `POST /ai/route`, `POST /ai/eval`, `GET /ai/prompts/{prompt_id}/versions`, `POST /ai/prompts/{prompt_id}/publish`.

### 22.8 State transitions

Per invocation: `received → intent → routed → invoked → streaming → validating → completed | failed | fallback | aborted`.
Prompt versions: `draft → canary → stable → deprecated → removed`.
Safety filters: `bypass → warn → block → quarantine`.

### 22.9 Failure handling

- Primary model timeout → fallback to next in hierarchy (22.10).
- Fallback exhaustion → degrade to "Last Good Answer" projection (06.10).
- Safety filter trigger: warn returns redacted content, block denies, quarantine sends to admin review.
- Eval regression detected on stable prompt version → auto-rollback to last known-good version.

### 22.10 Fallback hierarchy (default)

1. Primary (provider × model) per `tenant_spine_config.model_profile`.
2. Cheap secondary (smaller/cheaper model same vendor).
3. Cross-vendor secondary.
4. Cached prior good response (cache TTL ≤ 7 d).
5. Persona-template static fallback ("Last Good Answer").
6. Quarantine + alert.

### 22.11 Cost & latency routing

- Per-route `cost_budget_per_turn_cents` and `p95_latency_ms`.
- Router picks provider/model by `(capability_needed × cost × latency × traffic_class)`.
- Off-peak windows may choose smaller models automatically; near SLA breach escalates to premium model.

### 22.12 Prompt versioning

- Every prompt template is a `mod_prompt_{id}` with version (semver), status, owner, `evalset_ref`.
- Browse + diffing in CLI (`iw prompt diff v1.4 v1.5`).
- Canary rollout through feature flags (15.3, 19.4).

### 22.13 Evaluation

- `evalset` = golden prompts × expected behaviors (text, tool-calls, JSON schema, refusal). Runs on every prompt publish and every model swap.
- Run record: `mod_evalrun_{id}` with pass/fail per expectation; downstream alerting.

### 22.14 Safety filters

- Categories: PII exfiltration, jailbreak, toxicity, secret-leak, prompt-injection, vendor-policy-violation.
- Levels: bypass (debug only), warn, block, quarantine.
- Tenant overrides require `governancePolicy=judicial` (09).

### 22.15 Caching

- Prompt-level cache keyed by `prompt_id + version + params_hash`.
- Response cache keyed by `prompt_id + version + params_hash + tenant.tier`.
- TTL configurable; default 7 d.

### 22.16 Streaming

- Workspaces and Chat both consume via SSE; mobile via chunked JSON.
- Late chunk miss → fetch from response cache; surface degraded badge.

### 22.17 Extension points

- Custom router strategies `AI_ROUTER(name)`.
- Custom safety filters `SAFETY_FILTER(name)`.
- New model provider adapters via `@integratewise/connector-sdk`.

---

## 23 — Agent Runtime

### 23.1 Responsibilities

Own the Agent Registry, lifecycle, memory, permissions, scheduling, communication, supervision, and failure handling for automated agents beyond the Twin.

### 23.2 Agent kinds (canonical)

- **Twin** — inherits 06, persona-bound.
- **Worker Agent** — runs inside a Workflow step (11), no persona-fit, transactional.
- **Supervisor Agent** — watches Worker Agents and Twin health, can pause/restart.
- **Background Agent** — runs from a cron or Event, e.g., TwinAgent (morning brief), TenantBrainDO (approvals).
- **Community Agent** — contributed via Marketplace (13); sandboxed.

### 23.3 Inputs

Workflow step launch, cron schedule, Event Bus trigger, Manual admin launch. Continuity context (25).

### 23.4 Outputs

Capability invocations (05), Memory intakes (07), Signals (10), Workflow handoffs (11).

### 23.5 Events Produced

AgentRegistered, AgentScheduled, AgentStarted, AgentPaused, AgentResumed, AgentStopped, AgentFailed, AgentSupervisedAction, AgentCommunicationSent, AgentCommunicationReceived.

### 23.6 Events Consumed

WorkflowStarted, WorkflowStepDue, CronTick, EventBus\*, TwinRoutedRequest.

### 23.7 APIs

`POST /agents`, `POST /agents/{ag_id}/schedule`, `POST /agents/{ag_id}/pause`, `POST /agents/{ag_id}/resume`, `POST /agents/{ag_id}/invoke`, `GET /agents/{ag_id}/runs`.

### 23.8 State transitions

`declared → registered → scheduled → running → paused → resumed → stopped → failed → archived`.
Health watch: `healthy → degrading → critical → quarantined`.

### 23.9 Agent lifecycle specification

Mandatory metadata: id, kind, capabilities[], permissions[], memory_scope, owner, contacts[].
Permissions inherit from capability-level requiredScopes + agent-level overrides.
Run traces appended to Observability (16); supervision emits AgentSupervisedAction.

### 23.10 Agent registry

Persistent in D1 (`agents.agents`, `agents.runs`, `agents.permissions`).
Discoverable per workspace via Projection Engine (04).

### 23.11 Agent memory

- `memory_scope` chooses: Twin-meaning (07/L1) for ephemeral, Organizational Memory (07/L7) for durable.
- Agents may not write directly to Spine (02) — only via Capability Fabric (05).

### 23.12 Agent permissions

- Each agent declares `requiredScopes[]` evaluated through 09 Governance.
- Cross-workspace calls require `gov.cross_workspace` token.

### 23.13 Agent scheduling

- Trigger types: cron, Event Bus (filter), Time-window, Manual, Chain.
- Time windows enforced in DO durable alarms.

### 23.14 Agent communication

- Two patterns: (a) Capability invocation through 05; (b) Async envelope through Event Bus.
- All envelopes signed; recipient validates.

### 23.15 Agent supervision

- Supervisor Agent checks HealthSnapshot (08.7-style), run success rate, drift metrics.
- Allowed actions: pause, restart, route to fallback model (22), quarantine.

### 23.16 Failure handling

- **Twin:** rehydrate context from 25; do not lose conversation state.
- **Worker Agent:** idempotent retry, max N=3.
- **Community Agent:** quarantine + admin notify.
- Cross-agent failure cascade: Supervisor Agent breaks the loop.

### 23.17 Extension points

- New Agent kinds via registry; reviewed for sandbox if kind=community.
- Custom runners (e.g., remote executor) via `AGENT_RUNNER(name)`.

---

## 24 — Integration Manager

### 24.1 Why this doc exists

Connector Framework (08) describes Nango/MCP/Native/Custom API as separate concepts. The Integration Manager is the single abstraction layer that lets a Capability invocation pick the right underlying transport.

### 24.2 Pipeline

```
Capability (05)
   ↓
Integration Manager
   ↓
Nango        ── managed OAuth & vendor APIs
MCP          ── tool servers, structured contexts
Native       ── first-party adapters (Salesforce, HubSpot)
Custom API   ── raw HTTP/GraphQL/protobuf
```

### 24.3 Responsibilities

- Resolve Capability `transport_hints[]` to one of `{nango, mcp, native, custom}`.
- Mint & cache short-lived `conn_` tokens through 08 / 14.
- Aggregate Connector Deltas into a unified ConnectorDelta shape.
- Health-impose per-transport breakers.

### 24.4 Inputs

CapabilityInvoked events (05). Connector HealthyChanged (08). Admin transport overrides.

### 24.5 Outputs

Resolved writes through chosen transport. Aggregated ConnectorDelta stream into Spine (02) and Signals (10).

### 24.6 Events Produced

IntegrationResolved, IntegrationDispatched, IntegrationCompleted, IntegrationFailed, IntegrationTokenRefreshed, IntegrationBreakerOpened, IntegrationBreakerClosed.

### 24.7 Events Consumed

Every CapabilityInvoked, ConnectorHealthyChanged, MCPDiscoveryUpdated.

### 24.8 APIs

`POST /integration/resolve`, `GET /integration/{cap_id}/transports`, `POST /integration/{cap_id}/dispatch`, `GET /integration/breakers`.

### 24.9 State transitions

`idle → resolving → dispatching → succeeded | failed → cooldown → idle`.

### 24.10 Failure handling

- Transport failure → breaker open per transport; subsequent attempts use next transport.
- After N consecutive breaker opens → emit ConnectorRetired (08.10).

### 24.11 Extension points

- New transports via `INTEGRATION_TRANSPORT(name)`.
- Custom resolver strategies `INTEGRATION_RESOLVER(name)`.

---

## 25 — Continuity Engine

### 25.1 Responsibilities

Context assembly. Session continuity. Cross-device, cross-model, cross-workspace continuity. Context compaction, memory hydration, context prioritization.

### 25.2 Continuity surfaces

| Surface         | What must be continuous                               |
| --------------- | ----------------------------------------------------- |
| Session         | Current Twin conversation state (L1)                  |
| Cross-device    | Active session survives device switch                 |
| Cross-model     | Switch vendor/model mid-session without losing intent |
| Cross-workspace | Switching wsp* → wsp* keeps task context              |
| Cross-temporal  | As-of queries are intrinsic to Spine reads            |

### 25.3 Pipeline

```
Context Triggers (07 event, 06 screen state, 22 cache hit, 04 projection, 02 timeline)
   ↓
Context Assembler            (assembles ordered fragments, applies priority)
   ↓
Memory Hydrator              (pulls relevant L1+L7 hits per fragment)
   ↓
Compactor (only when budget exceeded)
   ↓
Context Pack (consumed by 06 prompt builder and 05 capability resolver)
```

### 25.4 Inputs

TwinContextBuilt triggers, WorkspaceSwitched, ModelRouted, MemoryApproved, EntityUpdated (for context-bearing entities).

### 25.5 Outputs

ContextPack attached to every TwinResponded, and to every capability invocation that requires tenant-wide awareness.

### 25.6 Events Produced

ContextAssembled, ContextCompacted, ContextHydrated, ContextPrioritized, ContinuityBridgeActivated, ContinuityBridgeDeactivated.

### 25.7 Events Consumed

WorkspaceSwitched, ModelRouted, EntityUpdated (subset bearing relevance), MemoryApproved, TwinContextBuilt.

### 25.8 APIs

`POST /continuity/assemble`, `GET /continuity/context/{session_id}`, `POST /continuity/compact`, `POST /continuity/hydrate`.

### 25.9 State transitions

`empty → assembling → hydrating → compacting? → assembled → consumed → purged`. Bridge state: `cold → warm → hot → cold`.

### 25.10 Priorities (canonical order)

1. Persona-bind (industry × department × sub-role).
2. Workspace module set.
3. Active screen state (Projection — 04).
4. Last 10 Twin turns (L1).
5. Recent Entity updates relevant to screen.
6. L7 promotion queue items pending approval.
7. Capabilities restricted by persona.

### 25.11 Compaction

- Token budget exhausted → summarize older turns via 22; never drop pinned Memory.
- Compaction log emitted as ContextCompacted with reduction_ratio.

### 25.12 Failure handling

- Memory Lookup timeout → continue with degraded pack, badge "Partial context".
- Cross-device state divergence → resolve via Spine timestamp; last write wins for non-pinned; pinned fields stay.

### 25.13 Extension points

- Custom priority rules `CONTINUITY_PRIORITY(name)`.
- Custom compacters `COMPACTOR(name)`.

---

## 26 — Search Engine

### 26.1 Pipeline

```
Search (request)
   ↓
Spine
Memory
Knowledge
Connector Search
Conversation Search
Semantic Search
Hybrid Ranking
```

### 26.2 Responsibilities

Provide Universal Search (P-1) and Command Palette (P-2). Index and search across Spine (02), Memory (07), Knowledge (07/L8), Connector indexes, Conversations (06), plus semantic vectors and lexical indexes. Compose results with hybrid ranker.

### 26.3 Inputs

User search request, contextual triggers (selected entity, screen state).

### 26.4 Outputs

Ranked result set with provenance (every item carries `provenance[]` per 02). Highlight spans.

### 26.5 Index kinds

| Index      | Source                | Type             |
| ---------- | --------------------- | ---------------- |
| idx_spine  | Spine entities        | lexical + vector |
| idx_mem_l1 | Twin conversations    | vector           |
| idx_mem_l7 | Organizational Memory | lexical + vector |
| idx_knw    | Knowledge articles    | lexical + vector |
| idx_conn   | Connector feeds       | lexical          |
| idx_conv   | Twin transcripts      | lexical + vector |

### 26.6 Events Produced

IndexBuilt, IndexIncremented, IndexInvalidated, SearchExecuted, SearchResultClicked.

### 26.7 Events Consumed

EntityUpdated, MemoryApproved, KnowledgeArticlePublished, ConnectorSynced, TwinResponded.

### 26.8 APIs

`POST /search`, `GET /search/{idx_id}/status`, `POST /search/{idx_id}/rebuild`.

### 26.9 State transitions

Per index: `cold → warming → warm → degraded → cold`. Per query: `received → planning → fused → ranked → served`.

### 26.10 Hybrid ranking

Reciprocal Rank Fusion across lexical (BM25) + vector (cosine) + recency + persona boost.
Persona boost via 06; tenant admin can override weights.

### 26.11 Failure handling

- Index unreachable → serve last good snapshot with degraded badge.
- Vector index down → fall back to lexical only.

### 26.12 Extension points

- Custom ranking models `RANKER(name)`.
- Custom indexers `INDEXER(name)`.

---

## 27 — Data Pipeline

### 27.1 Pipeline

```
Ingestion
   ↓
Normalization
   ↓
Validation
   ↓
Deduplication
   ↓
Canonical Mapping
   ↓
Enrichment
   ↓
Projection
   ↓
Storage
```

### 27.2 Responsibilities

Run the pipeline for every Connector Delta (08), Memory intake (07), and Knowledge import (07/L8). Idempotency keyed on `(source, source_record_id, observed_at, hash)`. Strict stage ordering; failure of one stage quarantines the artifact (DLQ).

### 27.3 Inputs

ConnectorDeltaReceived, MemoryIntake, KnowledgeImportRequested, admin batch uploads.

### 27.4 Outputs

Canonical Spine updates (02) + Signal side-effects (10) + Memory write-backs (07).

### 27.5 Events Produced

PipelineStarted, PipelineStageCompleted, PipelineStageFailed, PipelineCompleted, PipelineDuplicateDetected, PipelineEnrichmentApplied, PipelineAborted.

### 27.6 Events Consumed

ConnectorDeltaReceived, MemoryIntake, KnowledgeImportRequested, EntityTypeRegistered.

### 27.7 APIs

`POST /pipeline/run`, `GET /pipeline/runs/{pipe_id}`, `POST /pipeline/dlq/{item_id}/replay`.

### 27.8 Stage definitions

- **Ingestion:** parse vendor payload; schema check.
- **Normalization:** apply `tenant_spine_config.field_extensions`, normalize dates/currency.
- **Validation:** cross-field, cross-entity (12).
- **Deduplication:** hash + semhash; resolve via Spine `?as_of`.
- **Canonical Mapping:** map to `ent_` via 12 inheritance.
- **Enrichment:** Signals (10) may attach; capability `cap_enrich_x` may run pre-storage.
- **Projection:** build per-persona projection shape (04).
- **Storage:** write to Spine (02); archive snapshot to R2.

### 27.9 State transitions

`received → ingested → normalized → validated → deduped → mapped → enriched → projected → stored`.
Failure path: `… → DLQ`. Replay path: `DLQ → received`.

### 27.10 Failure handling

Stage failure → stop, retry policy per stage (configurable), finally DLQ. DLQ item presents replay UI in Workbench under Pipeline Admin.

### 27.11 Extension points

- Custom pipeline steps via `PIPELINE_STEP(name)`.
- Custom canonical mappers `MAPPER(name)`.

---

## 28 — Identity Platform

### 28.1 Responsibilities

Identity, Organizations, Invitations, Teams, SCIM, SAML, Enterprise SSO, MFA, Service Accounts, API Keys.

### 28.2 Identity layers

- **Person Identity:** email/password, OAuth, SAML, magic-link.
- **Organization Identity:** SCIM-issued users, federated mapping.
- **Service Identity:** Service Accounts (`svc_`), API Keys (`key_`), scoped to workspaces and capabilities.

### 28.3 Inputs

Marketplace OAuth (per existing spec). Admin invites, SCIM provisioning, SAML IdP assertions.

### 28.4 Outputs

`usr_`, `org_`, `team_`, `inv_`, `key_` records. Session JWTs bound to device fingerprint (14). Audit events for every identity operation.

### 28.5 Events Produced

IdentityCreated, IdentityUpdated, InvitationSent, InvitationAccepted, InvitationExpired, TeamCreated, TeamMemberAdded, TeamMemberRemoved, SCIMProvisioned, SCIMDeprovisioned, ServiceAccountCreated, APIKeyIssued, APIKeyRevoked, MFAChallengeIssued, MFAVerified, MFAFailed.

### 28.6 Events Consumed

MarketplaceInstalled (per existing spec), WorkspaceSwitched, SecurityAlert.

### 28.7 APIs

`POST /identity/invitations`, `POST /identity/invitations/{inv_id}/accept`, `POST /identity/scim/sync`, `POST /identity/saml/acs`, `POST /identity/mfa/challenge`, `POST /identity/mfa/verify`, `POST /identity/service-accounts`, `POST /identity/api-keys`.

### 28.8 State transitions

- User: `pending → active → suspended → deleted`.
- Invitation: `sent → accepted | expired | revoked`.
- Service Account: `active → rotating → retired`.
- API Key: `active → rotated → revoked`.

### 28.9 RBAC + ABAC cross-reference

- RBAC tables (per existing spec) bind `usr_ → role → cap`.
- ABAC layer (14.6) reads identity attributes: is_service, mfa_verified_within, device_posture, geo_region.

### 28.10 SCIM

- Endpoint: `/scim/v2/{org_}`.
- Mappings: SCIM user ↔ `usr_`; SCIM group ↔ `team_`.
- Provisioning direction configurable: pull (SCIM → platform) or push (platform → SCIM).

### 28.11 SAML / Enterprise SSO

- ACS endpoint: `/identity/saml/acs`.
- Standard attributes mapped: email, name, department, employee_id.
- JIT (Just-In-Time) provisioning gated by `governancePosture.sso_provision`.

### 28.12 MFA

- TOTP, WebAuthn, push (via mobile app).
- Risk-based re-challenge for high-governance capabilities.

### 28.13 Service Accounts

- Bound to a Team (not an individual) for audit clarity.
- API Keys scoped to `cap_ids[]` and `wsp_ids[]`.

### 28.14 Failure handling

- SCIM conflict → preserve newer-side, raise admin alert.
- SAML assertion replay → reject + alert.
- MFA failure > N → soft lock + admin notify.

### 28.15 Extension points

- New identity provider via `IDENTITY_PROVIDER(name)`.
- Custom ABAC rules via `POLICY_PACK(name)` (14).

---

## 29 — Billing Platform

### 29.1 Responsibilities

Plans, Seats, Usage, Credits, Trials, Metering, Invoices, Limits, Quotas.

### 29.2 Plan model

```yaml
sub_plan:
  id: sub_plan_…
  code: free | starter | growth | enterprise
  prices: [{ currency, amount, interval: monthly|annual }]
  seats: included
  usage_credits: included # optional
  overage_policy: [block | bill | throttle]
  features: [cap_id, signal_priority, marketplace_discount]
```

### 29.3 Inputs

WorkspaceCreated, UserAdded (seat consumption), CapabilityInvoked (metered), SignalCreated (signal metering), API call (`/ai/run` LLM tokens).

### 29.4 Outputs

`sub_` records, `bill_` invoices, Stripe receipts (13.5). Enforcement events (LimitExceeded, QuotaWarning).

### 29.5 Events Produced

PlanAssigned, SeatConsumed, SeatReleased, UsageMetered, CreditConsumed, CreditGranted, TrialStarted, TrialConverted, TrialExpired, InvoiceIssued, InvoicePaid, InvoiceFailed, LimitExceeded, QuotaWarning.

### 29.6 Events Consumed

WorkspaceCreated, UserAdded, UserRemoved, CapabilityInvoked, SignalCreated, ModelInvoked, ListingInstalled.

### 29.7 APIs

`POST /billing/plans`, `POST /billing/subscriptions`, `POST /billing/usage/record`, `GET /billing/invoices`, `POST /billing/credits/grant`.

### 29.8 State transitions

Subscription: `trialing → active → past_due → canceled → reactivated`.

### 29.9 Metering

Metered units: seat, llm_token, signal_score, cap_invocation, connector_sync_call, r2_storage_gb.
Hourly aggregation → monthly close.

### 29.10 Limits & Quotas

Per-tenant caps; per-workspace caps; per-user caps.
`overage_policy`: block (deny), bill (Stripe metered SKU), throttle (rotate to cheaper path).
Surfaced via 30 Operational Metrics dashboards.

### 29.11 Credits

Trial and grant credits stored in `sub_credits`, consumed FIFO, tracked in audit log.

### 29.12 Invoices

Monthly per workspace; line items mirror UsageMetered events.
Reconciliation against Stripe via daily job.

### 29.13 Failure handling

Payment failure → soft-cap features; admin notified.
Metering lag → rechecks current usage every 6 h.

### 29.14 Extension points

New SKUs via Marketplace (13). Custom overage policy via `BILLING_POLICY(name)`.

---

## 30 — Operational Metrics

### 30.1 Responsibilities

Define, compute, and surface the canonical operational metrics. Make every metric queryable per tenant, per workspace, per persona, per agent.

### 30.2 Canonical metrics

| Metric                     | Definition                                                           |
| -------------------------- | -------------------------------------------------------------------- |
| Workspace Activation Rate  | % of tenants with at least one wsp\_ transitioned past bootstrapping |
| Time to First Value (TTFV) | Wall clock from OAuth complete → first non-empty projection render   |
| Connector Adoption         | Average number of active conn* per wsp* by industry × department     |
| Capability Usage           | Daily invocations per cap_id, bucketed by persona                    |
| Twin Acceptance Rate       | % of Twin proposals accepted vs surfaced                             |
| Memory Promotion Rate      | L5 → L6 promotions per 24h per tenant                                |
| Signal Precision           | Accepted signals / surfaced signals, rolling 7 d                     |
| Approval Latency           | GovernanceRequested → GovernanceApproved p50/p95                     |

### 30.3 Inputs

All event bus events (filtered / aggregated). Tenant onboarding completion events (existing spec).

### 30.4 Outputs

Time-series metrics in a TSDB. Aggregate reports rolled up nightly.

### 30.5 Events Produced

OperationalMetricComputed, OperationalMetricAnomalyDetected.

### 30.6 Events Consumed

All events (filtered by metric rule).

### 30.7 APIs

`GET /ops/metrics/{metric_id}`, `POST /ops/metrics/{metric_id}/compute`, `GET /ops/dashboards/{tenant_id}`.

### 30.8 State transitions

`preregistered → live → deprecated`. Anomaly state: `nominal → warning → critical`.

### 30.9 Anomaly detection

Per-metric threshold low/high plus weekly ML-driven adjustment; admins can pin.

### 30.10 Failure handling

Compute lag beyond SLO → MetricStale event + dashboard badge.
Anomaly spam-protection: min interval 15 minutes between alerts per metric per tenant.

### 30.11 Extension points

- Custom metrics `OP_METRIC(name)`.
- Custom anomaly rules `OP_ANOMALY(name)`.

---

## 31 — Evolution Strategy

### 31.1 Responsibilities

Define safe evolution of Schema, Capability, Connector, Persona, API, Memory, and Migration strategy.

### 31.2 Evolution areas

| Area       | Reference              | Strategy                                                        |
| ---------- | ---------------------- | --------------------------------------------------------------- |
| Schema     | 12 + 02                | Additive-first; bump schema_version; reversible                 |
| Capability | 05                     | New cap_id per major change; deprecate old by status            |
| Connector  | 08                     | Version bump; certified path; admin opt-in for breaking changes |
| Persona    | (existing spec, 12×11) | New sub-role or industry requires Steering Committee            |
| API        | 19                     | URI versioning; 6-mo deprecation; parallel-run                  |
| Memory     | 07                     | Versioning of pipeline layer logic; data is append-only         |
| Migration  | 15.4 + 21              | Reversible; dry-run; bump schema_version                        |

### 31.3 Inputs

Schema change PRs, Capability change PRs, authored Connector changes. Admin-initiated migrations.

### 31.4 Outputs

Rollout plan + flag flips (15.3). Migration artifact (id, scope, dry-run result, reversal procedure).

### 31.5 Events Produced

EvolutionStarted, EvolutionFlagged, EvolutionRolledBack, EvolutionCompleted, SchemaVersionBumped, CapabilityDeprecated, ConnectorDeprecated, ApiDeprecated, MemoryLayerDeprecated.

### 31.6 Events Consumed

CapabilityRegistered, CapabilityDeprecated, ConnectorInstalled, ConnectorRetired, SchemaVersionBumped.

### 31.7 APIs

`POST /evolution/migrations`, `POST /evolution/migrations/{mig_id}/dry-run`, `POST /evolution/migrations/{mig_id}/apply`, `POST /evolution/migrations/{mig_id}/rollback`.

### 31.8 State transitions

`draft → tested → dark_launch → canary → progressive → stable → deprecated → removed`.

### 31.9 Principles

- Additive-first, never destructive by default.
- Every deprecation publishes a Sun-Set banner 6 months in advance (19.1).
- Backwards compatibility is preserved for ≥ 1 prior schema_version.

### 31.10 Failure handling

- Dark launch metric regression → automatic flag rollback.
- Migration apply failure → automated reversal; admin notified.

### 31.11 Extension points

New evolution channels via `EVOLUTION_CHANNEL(name)`.

---

## 32 — Plugin Runtime

### 32.1 Pipeline

```
Plugin
   ↓
Validation
   ↓
Sandbox
   ↓
Permissions
   ↓
Resources
   ↓
Capability Registration
   ↓
Lifecycle
```

### 32.2 Responsibilities

Host third-party Plugin bundles (WASM or JS-in-Worker) supplied through Marketplace (13). Validate, sandbox, assign permissions, allocate resources, register capabilities, manage lifecycle.

### 32.3 Plugin kinds

`connector_plugin`, `capability_plugin`, `workflow_plugin`, `persona_kit_plugin`, `design_pack_plugin`.

### 32.4 Inputs

ListingInstalled (Community Agent kind; 23.2). Admin overrides.

### 32.5 Outputs

Registered Capabilities (05), Workflows (11), Persona Kits (06).

### 32.6 Events Produced

PluginValidated, PluginSandboxed, PluginPermissionsGranted, PluginRegistered, PluginResourcesAllocated, PluginLifecycleEvent, PluginUninstalled, PluginQuarantined.

### 32.7 Events Consumed

ListingInstalled, ListingUpgradeStarted, CapabilityRegistered.

### 32.8 APIs

`POST /plugins`, `POST /plugins/{plg_id}/validate`, `POST /plugins/{plg_id}/sandbox`, `GET /plugins/{plg_id}/health`, `POST /plugins/{plg_id}/permissions`, `POST /plugins/{plg_id}/uninstall`.

### 32.9 State transitions

`uploaded → validating → validated → sandboxed → permissions_assigned → resources_allocated → installed → upgrading → deprecated → uninstalled → quarantined`.

### 32.10 Sandbox

WASM execution in Worker with capability allowlist enforced at runtime.
Resource budgets: CPU ms, memory bytes, network egress URLs (allowlist).

### 32.11 Permissions

Plugin declares `permissions[]` (capabilities + data scopes + network egress hosts).
Validation rule: declared permissions ⊨ advertised Marketplace scopes.

### 32.12 Resources

Quotas per plugin per tenant; default ceilings in 29 Billing.
Per-plugin token meter for cost attribution.

### 32.13 Lifecycle ownership

Plugin may declare its own lifecycle adapter, but bounded by Plugin Runtime contract; cannot terminate itself.

### 32.14 Failure handling

- Crashed plugin → auto-restart ≤ 3; quarantine after.
- Resource ceiling breach → throttle + admin notify.

### 32.15 Extension points

- New plugin kinds via Plugin SDK (17).
- Custom sandbox capability types `SANDBOX_CAP(name)`.

---

## 33 — Testing Architecture

### 33.1 Responsibilities

Define the multi-layer testing architecture: Unit, Integration, Connector simulation, Synthetic tenants, AI evaluation, Persona validation, End-to-end, Load, Chaos.

### 33.2 Layers

| Layer                | Scope                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| Unit                 | Pure functions, SDK contracts                                             |
| Integration          | Subsystem boundaries (02↔05, 08↔02, etc.)                                 |
| Connector simulation | Vendor mocks (per mock-vendor=mux from SDK 17.3)                          |
| Synthetic tenants    | Generated tenant population exercising the 12×11 matrix                   |
| AI evaluation        | Evalset runs on prompt versions and model swaps (22.13)                   |
| Persona validation   | Persona-fit assertions: greeting, capability defaults, governance posture |
| End-to-end           | Full flows (OAuth → Onboard → First Value → Promotion)                    |
| Load testing         | Synthetic traffic across Gateway/Spine                                    |
| Chaos testing        | Fault injection on DO, Queue, Vendor rate limit, LLM timeout              |

### 33.3 Inputs

CI event (PR, push), scheduled nightly jobs, pre-release gate.

### 33.4 Outputs

Pass/fail per layer; release gate decisions; coverage report.

### 33.5 Events Produced

TestSuiteStarted, TestSuiteCompleted, TestFailure, EvalRegressionDetected, ChaosDrillCompleted.

### 33.6 Events Consumed

CI events, schedules.

### 33.7 APIs

`POST /test/run`, `GET /test/runs/{run_id}`, `POST /test/evalset/publish`.

### 33.8 State transitions

`queued → running → passed | failed | flaky → archived`.

### 33.9 Failure handling

- Flake quarantine (re-run twice, isolate).
- Eval regression → force prompt rollback (22.9).

### 33.10 Extension points

- New test kinds via `TEST_KIND(name)`.
- Custom chaos faults via `CHAOS_FAULT(name)`.

### 33.11 Release gate (canonical)

P0 release requires all layers pass for the last 7 days.
Any regression freezes the gate until resolved or exempted by Steering Committee.

---

## 34 — System Lifecycle

### 34.1 Why this doc exists

The Lifecycle section was added because the platform needed a superseding view that spans everything — Tenants, Connectors, Workspaces, Memories, Agents, Capabilities. Each subsystem already has its own lifecycle, but a unified lifecycle is the true cross-cutting doctrine.

### 34.2 Tenant lifecycle (canonical)

```
Tenant
   ↓
Activated      — OAuth complete; identity record created
   ↓
Hydrated       — tenant_spine_config written; Spine seeded
   ↓
Operational    — first capability invocation succeeded
   ↓
Growing        — usage metrics in green band (30.3)
   ↓
Dormant        — zero activity for N days; admin notified
   ↓
Archived       — soft-archived; data retained
   ↓
Deleted        — judicial hard-delete only (02.11)
```

### 34.3–34.7 Subsystem lifecycles (cross-referenced)

- **Connector:** declared → sandboxed → certified → active → degraded → retired → archived → revoked (08.2).
- **Workspace:** init → bootstrapping → active → suspended → archived → migrated (03.3).
- **Memory:** intake → triaged → cluster → queued_for_promotion → approved | rejected → deprecated (07.7).
- **Agent:** declared → registered → scheduled → running → paused → resumed → stopped → failed → archived (23.8).
- **Capability:** declared → registered → versioned → deprecated → removed → revoked (05.3).

### 34.8 Cross-lifecycle policy

An object can only transition to a lifecycle state if its dependencies are healthy:

- A Capability cannot be registered until its required connectors are active.
- A Workspace cannot be active until its Tenant is Hydrated.
- An Agent cannot be running until its declared memories exist.
- Memory cannot be approved until L5 has human review.

### 34.9 Lifecycle event bus

Every transition emits a LifecycleEvent carrying from_state, to_state, actor, reason.
Projection Engine (04) uses these to invalidate stale caches.

### 34.10 Events Produced

LifecycleEvent, LifecycleViolationDetected (cross-lifecycle policy breaches).

### 34.11 Events Consumed

All subsystem lifecycle events.

### 34.12 APIs

`GET /lifecycle/{kind}/{id}`, `POST /lifecycle/{kind}/{id}/transition`, `GET /lifecycle/diagram`.

### 34.13 State transitions

Each suspended state has TTL: auto-resume, auto-archive, or escalate depending on kind.

### 34.14 Failure handling

- Cross-lifecycle policy breach → block transition + explainer.
- Dormant Tenant reactivation returns to Operational after warm-up projection rebuild.

### 34.15 Extension points

Custom transition rules via `LIFECYCLE_RULE(name)`.

---

# APPENDIX

## A. Cross-Spec Runtime Contracts — Consolidated

Every doc (02–34) carries the identical contract template:

1. Responsibilities
2. Inputs
3. Outputs
4. Events produced
5. Events consumed
6. APIs
7. State transitions
8. Failure handling
9. Extension points

There is now no subsystem in IntegrateWise without a runtime contract.

## B. Business Ontology Cross-References

Every doc references back to 21 Business Ontology where its primary types are defined:

| Doc                      | Primary Ontology Types                  |
| ------------------------ | --------------------------------------- |
| 22 (Models)              | Person / Agent / Decision               |
| 23 (Agents)              | Agent / Team / Conversation             |
| 24 (Integration Manager) | Capability / Asset                      |
| 25 (Continuity Engine)   | Person / Workspace / Memory             |
| 26 (Search Engine)       | Knowledge / Memory / Conversation       |
| 27 (Data Pipeline)       | Asset / Knowledge / Capability          |
| 28 (Identity Platform)   | Person / Team / Organization / Decision |
| 29 (Billing)             | Organization / Workspace / Process      |
| 30 (Operational Metrics) | Outcome / Objective                     |
| 31 (Evolution Strategy)  | Capability / Memory / Decision          |
| 32 (Plugin Runtime)      | Capability / Asset / Policy             |
| 33 (Testing)             | All root types as test surface          |
| 34 (System Lifecycle)    | All root types as governable things     |

## C. Single Canonical Cross-Spec Rule for Evolving the Platform

1. Update the Spine (02) entity or event vocabulary first.
2. Update producers (03–13, 21–34) to emit the new event name.
3. Update consumers (03–13, 21–34) to declare the new event in Events Consumed.
4. Bump `tenant_spine_config.schema_version` (m054+) and write a migration (15.4).
5. Roll out under feature flag (15.3 / 19.4).

## D. Coverage Summary

### Completed (00–34) — Architecture

✅ Doctrine, Platform, Spine, Workspace, Projection, Capability, Twin, Memory, Connectors, Governance, Signals, Workflows, Entities, Marketplace, Security, Deployment, Observability, SDKs, UI, APIs, Runbooks (Part I)
✅ NEW: Business Ontology, AI Model Runtime, Agent Runtime, Integration Manager, Continuity Engine, Search Engine, Data Pipeline, Identity Platform, Billing Platform, Operational Metrics, Evolution Strategy, Plugin Runtime, Testing Architecture, System Lifecycle (Part II)

### Remaining — Implementation & Operations

🔧 PRDs per module, Database DDL, OpenAPI specs, Infrastructure-as-Code
🔧 Security audits, Compliance evidence, SLOs/SLIs, Capacity planning
🔧 End-user docs, Administrator guides

---

_End of Unified Specification. Version 1.0 — Architecture Freeze._
