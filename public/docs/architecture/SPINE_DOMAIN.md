# Spine Domain — Platform-Level Three-Layer Model

> **Status:** Canonical architecture doctrine (supersedes previous SPINE_DOMAIN.md for scope)  
> **Date:** July 6, 2026  
> **Authority:** Nirmal (Founder)  
> **Companion docs:** `SPINE_INTELLIGENCE_AGENT.md` (generation pipeline), `SPINE_MODEL.md` (physical storage), `PROJECTION_MODEL.md` (read views)  
> **Platform specs:** 35-document hierarchy (Notion Document Hub) — 02 Operational Spine, 21 Business Ontology, 12 Entity Framework  
> **Supersedes:** CRM-centric schema generation, domain-only models. When this doc contradicts a domain-specific approach, this doc wins.

---

## 0. The One-Line Truth

```text
The Spine is the platform-level domain. Every business domain (Account Success, Sales, Finance, HR, Engineering) is a projection of the same Spine.
The agent builds the platform graph first. Domain artifacts are emissions from the platform graph, not separate schemas.
```

---

## 1. The Platform-Level Entity Model

The platform defines **16 root concepts** (Business Ontology, Doc 21) + **7 operational primitives** (Operational Spine, Doc 02). Every concrete entity in every business domain inherits from one of these roots.

### 1.1 The 16 Root Concepts (Business Ontology)

| Root Concept   | Prefix  | What it is                          | Concrete types that inherit                                                       |
| -------------- | ------- | ----------------------------------- | --------------------------------------------------------------------------------- |
| `Organization` | `org_`  | Legal entity owning the tenant      | Tenant, Company, Division                                                         |
| `Workspace`    | `wsp_`  | Bounded context inside Organization | Department, Team Workspace, Project Space                                         |
| `Person`       | `usr_`  | First-class human                   | User, Contact, Lead, Stakeholder, Employee, CSM, AE                               |
| `Team`         | `team_` | Durable grouping of Persons         | Sales Team, CS Team, Engineering Squad                                            |
| `Process`      | `proc_` | Repeatable set of capabilities      | Sales Motion, Renewal Cycle, Incident Response, Onboarding Flow                   |
| `Project`      | `prj_`  | Temporary initiative with timeline  | Sprint, Campaign, Launch, Migration, Implementation                               |
| `Objective`    | `obj_`  | Measurable goal                     | KPI, OKR, North Star Metric, Strategic Objective                                  |
| `Outcome`      | `out_`  | Evidence-verified result            | Closed Deal, Resolved Ticket, Published Article, Deployed Release, Renewal        |
| `Asset`        | `ast_`  | Durable resource                    | Document, Code Repository, Design File, Data Source, Contract, Subscription       |
| `Knowledge`    | `knw_`  | Curated institutional memory        | Playbook, Runbook, SOP, Template, Approved Pattern, Business Context              |
| `Decision`     | `dec_`  | Governance-approved choice          | Approval, Rejection, Override, Prioritization Choice, Governance Token            |
| `Policy`       | `pol_`  | Declarative rule                    | Confidence Policy, Data Scoping Policy, Approval Policy, Retention Policy         |
| `Capability`   | `cap_`  | Declarable action on the fabric     | Draft Outreach, Sync Connector, Generate Report, Send Notification                |
| `Signal`       | `sig_`  | Derived delta with score            | Health Alert, Risk Trigger, Anomaly Detection, Usage Spike                        |
| `Memory`       | `mem_`  | Captured observation with lifecycle | Twin Memory, Intake, Triage, Evolution, Queue, Approved Memory, Knowledge Article |
| `Conversation` | `conv_` | Twin ↔ User dialog                  | Chat Session, Brainstorming Session, QBR Meeting                                  |

### 1.2 The 7 Operational Primitives (Operational Spine)

These are the runtime entities that make the Spine operational. They exist in every tenant, regardless of business domain.

| Primitive       | Prefix | What it is                                       | Source                 |
| --------------- | ------ | ------------------------------------------------ | ---------------------- |
| `Tenant`        | `tnt_` | The top-level isolation boundary                 | Operational Spine (02) |
| `Entity` (base) | `ent_` | Base type for all concrete entities              | Operational Spine (02) |
| `Relationship`  | `rel_` | Directed, typed edge between entities            | Operational Spine (02) |
| `Timeline`      | `tl_`  | Event-sourced append-only history                | Operational Spine (02) |
| `Activity`      | `act_` | Unit of work within a Timeline                   | Operational Spine (02) |
| `Evidence`      | `evd_` | Citation for any claim                           | Operational Spine (02) |
| `Provenance`    | —      | Metadata on every row (actor, source, timestamp) | Operational Spine (02) |

### 1.3 Domain-Specific Inheritance (Entity Framework)

Concrete business types inherit from root concepts:

```text
Entity (base: id, version, lifecycle, provenance)
├── AggregateEntity (typed by purpose)
│     ├── CRMAccount     → inherits from Asset + Organization
│     ├── CRMLead        → inherits from Person + Outcome
│     ├── CRMOpportunity → inherits from Process + Outcome
│     ├── Ticket         → inherits from Process + Outcome
│     ├── Invoice        → inherits from Asset + Outcome
│     ├── Contract       → inherits from Asset + Decision
│     ├── Subscription   → inherits from Asset + Process
│     ├── Product        → inherits from Asset + Knowledge
│     ├── Deployment     → inherits from Asset + Project
│     ├── Integration    → inherits from Capability + Process
│     ├── Environment    → inherits from Asset + Workspace
│     ├── Meeting        → inherits from Conversation + Process
│     ├── Task           → inherits from Process + Outcome
│     ├── Initiative     → inherits from Project + Objective
│     ├── SuccessPlan    → inherits from Project + Knowledge
│     └── ... (domain-extensible)
└── ReferenceEntity
      ├── User           → inherits from Person
      ├── Product        → inherits from Asset + Knowledge
      └── ...
```

---

## 2. The Three-Layer Model (Platform-Level)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROJECTIONS (Domain Views)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Account  │  │ Sales    │  │ Eng.     │  │ Finance  │  │ HR       │     │
│  │ Success  │  │          │  │          │  │          │  │          │     │
│  │          │  │ Pipeline │  │ Sprint   │  │ Revenue  │  │ Onboard  │     │
│  │ Health   │  │ Deals    │  │ Tasks    │  │ Forecast │  │ Reviews  │     │
│  │ Renewal  │  │ Forecast │  │ Blockers │  │ Budget   │  │ Teams    │     │
│  │ QBR      │  │ Meetings │  │ PRs      │  │ Invoices │  │ Org      │     │
│  │ Tasks    │  │ Contacts │  │ Standups │  │ Metrics  │  │ Payroll  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                              No duplicated tables                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                        DYNAMIC MEMORY (AI-Created)                         │
│  L1 Twin Memory  L2 Intake  L3 Triage  L4 Evolution  L5 Queue               │
│  L6 Approval  L7 Org Memory  L8 Knowledge  Health  Risk  Sentiment        │
│  Signals  Usage  Architecture  Tech Debt  Business Context  Engagement    │
│  Stakeholder Intel  Recommendations  Insights  Evidence  Timeline  Forecast│
│  These evolve continuously. They are derived from the Spine + external      │
│  signals. They are not source of truth. They are opinion.                │
├─────────────────────────────────────────────────────────────────────────────┤
│                      CANONICAL SPINE (Immutable Business Truth)            │
│  Organization  Person  Team  Process  Project  Objective  Outcome  Asset   │
│  Knowledge  Decision  Policy  Capability  Signal  Memory  Conversation   │
│  Tenant  Workspace  Entity  Relationship  Timeline  Activity  Evidence     │
│  These rarely change structurally. They are the business truth.              │
│  Every domain reads from the same Spine. The Projection Engine assembles     │
│  domain-specific views.                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Layer 1 — Canonical Spine (Platform-Level)

### 3.1 What belongs here

Only entities that represent **real-world things** the platform operates on. These are the 16 root concepts + 7 operational primitives. Every concrete business type (CRMAccount, Ticket, Contract, etc.) inherits from one of these roots.

### 3.2 Platform-level Spine rules

1. **One canonical record per real-world thing.** A Salesforce Contact + a HubSpot Contact + a Jira Reporter = one `Person`.
2. **Root concepts are universal.** `Person` in Account Success is the same `Person` in Sales and HR.
3. **Domain types inherit from roots.** `CRMAccount` inherits from `Asset` + `Organization`. `Ticket` inherits from `Process` + `Outcome`.
4. **Spine relationships are typed edges.** Not JSONB blobs. `Person` → `belongs_to` → `Team`. `Team` → `part_of` → `Organization`. `Process` → `uses` → `Capability` → `produces` → `Outcome`.
5. **Spine entities are versioned.** Append-only. Every change is a new Timeline entry.
6. **Spine entities are tenant-scoped.** Every table has `tenant_id`. Cross-tenant queries are impossible.
7. **Spine writes are deterministic.** The Pipeline (`services/pipeline`) is the sole writer. No AI writes directly to the Spine.
8. **Provenance is required.** Every row carries `provenance[]`: at least one of `{ actor, source_connector, evidence_ref, derived_signal }`.

### 3.3 Canonical Spine Schema pattern

```sql
-- spine_persons (example; all Spine tables follow this pattern)
CREATE TABLE IF NOT EXISTS spine_persons (
    id              TEXT PRIMARY KEY,           -- UUID assigned by pipeline
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,              -- stable identity; survives merges
    version         INTEGER NOT NULL DEFAULT 1,  -- append-only versioning

    -- Immutable business truth (typed columns, no JSONB)
    name            TEXT NOT NULL,
    email           TEXT,
    role            TEXT,
    department      TEXT,
    seniority       TEXT,
    is_primary_contact INTEGER DEFAULT 0,

    -- System
    provenance      JSON NOT NULL DEFAULT '{}', -- { source, record_id, actor }
    created_at      INTEGER,                    -- Unix timestamp
    updated_at      INTEGER                     -- Unix timestamp
);
CREATE INDEX IF NOT EXISTS idx_spine_persons_tenant_canonical
    ON spine_persons(tenant_id, canonical_id);
CREATE INDEX IF NOT EXISTS idx_spine_persons_tenant_version
    ON spine_persons(tenant_id, canonical_id, version);
```

### 3.4 The typed edge graph (spine_relationships)

```sql
CREATE TABLE IF NOT EXISTS spine_relationships (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    from_canonical_id   TEXT NOT NULL,
    from_type       TEXT NOT NULL,
    relation_type   TEXT NOT NULL,          -- 'owns', 'belongs_to', 'depends_on', 'references', 'derived_from', 'supersedes', 'contested_by', 'uses', 'produces', 'has_state', 'part_of', 'measured_by', 'governs', 'constrained_by', 'informs', 'reinforces', 'generates', 'promotes_to'
    to_canonical_id     TEXT NOT NULL,
    to_type         TEXT NOT NULL,
    metadata        JSON NOT NULL DEFAULT '{}', -- { weight, confidence, start_date, end_date }
    valid_from      INTEGER,
    valid_until     INTEGER,                -- NULL = current
    created_at      INTEGER
);
CREATE INDEX IF NOT EXISTS idx_spine_rel_from
    ON spine_relationships(tenant_id, from_type, from_canonical_id)
    WHERE valid_until IS NULL;
CREATE INDEX IF NOT EXISTS idx_spine_rel_to
    ON spine_relationships(tenant_id, to_type, to_canonical_id)
    WHERE valid_until IS NULL;
CREATE INDEX IF NOT EXISTS idx_spine_rel_type
    ON spine_relationships(tenant_id, relation_type)
    WHERE valid_until IS NULL;
```

---

## 4. Layer 2 — Dynamic Memory (Platform-Level)

### 4.1 The 8-layer memory pipeline (Memory System, Doc 07)

| Layer | Memory Type              | What it is                                                    | TTL        | Source                  |
| ----- | ------------------------ | ------------------------------------------------------------- | ---------- | ----------------------- |
| L1    | `twin_memory`            | Conversational working memory                                 | Session    | Twin Runtime            |
| L2    | `memory_intake`          | Raw observations, immutable                                   | 24h        | Twin, Connector, Manual |
| L3    | `memory_triage`          | Classification (fact/decision/observation/relationship/noise) | 7d         | Triage Bot              |
| L4    | `memory_evolution`       | Pattern detection, cluster, dedupe                            | 14d        | Evolution Engine        |
| L5    | `memory_promotion_queue` | Staging surface for human approval                            | 30d        | Promotion Queue         |
| L6    | `memory_approval`        | Governance-approved or rejected memory                        | Persistent | Human Approval          |
| L7    | `memory_organizational`  | Durable, indexed, queryable                                   | Persistent | L6 promotion            |
| L8    | `memory_knowledge`       | SOPs, playbooks, runbooks                                     | Persistent | L7 + human authored     |

### 4.2 Domain-specific memory types (derived from platform signals)

| Memory                    | What it is                         | TTL        | Derived from                         |
| ------------------------- | ---------------------------------- | ---------- | ------------------------------------ |
| `memory_health`           | Account/entity health score        | 7d         | Usage, support, engagement, NPS      |
| `memory_risk`             | Risk score + reasoning             | 14d        | Contract, usage, stakeholder changes |
| `memory_sentiment`        | Emotional tone                     | 7d         | Transcripts, emails, support         |
| `memory_signals`          | Detected anomalies                 | 1d         | Telemetry, webhooks, deltas          |
| `memory_usage`            | Aggregated consumption             | 30d        | Telemetry, API logs                  |
| `memory_architecture`     | Architecture posture               | 90d        | API inventory, topology              |
| `memory_technical_debt`   | Technical liabilities              | 30d        | Tickets, post-mortems                |
| `memory_business_context` | Synthesized business understanding | 30d        | Public data, earnings, news          |
| `memory_engagement`       | Relationship history               | 30d        | Meetings, emails, calls              |
| `memory_stakeholder`      | Stakeholder intelligence           | 14d        | Org chart, engagement                |
| `memory_recommendations`  | Suggested actions                  | 7d         | Health + Risk + Engagement           |
| `memory_insights`         | Generated findings                 | 7d         | Cross-signal synthesis               |
| `memory_evidence`         | Supporting data for claims         | Persistent | Links, metrics, quotes               |
| `memory_timeline`         | Projected events                   | 90d        | Contracts, renewals, initiatives     |
| `memory_forecast`         | Predicted revenue/churn            | 30d        | ML models, historical patterns       |

### 4.3 Memory rules (platform-level)

1. **Memory is opinion, not truth.** Every memory has `confidence` (0.0–1.0) and `generated_by`.
2. **Memory is ephemeral (except L6-L8).** Most memories have a TTL. Continuity Layer manages lifecycle.
3. **Memory links to the Spine.** Every memory references a `canonical_id` + `entity_type` in the Spine.
4. **Memory is graph-native.** The same `spine_relationships` pattern works for Memory edges.
5. **Memory is event-sourced.** Every memory has an `episode_id` linking to the OODA cycle.
6. **Memory is projection-friendly.** Memory is designed to be sliced by team, role, and time horizon.

---

## 5. Layer 3 — Projections (Domain-Specific Views)

### 5.1 What a projection is

A projection is a **declared view** over the Spine + Dynamic Memory. It is not a table. It is a configuration that tells the Projection Engine which entities, which memories, and which relationships to assemble for a given domain, team, role, and context.

### 5.2 The projection principle

```text
No domain has its own database. No domain has its own schema.
Every domain sees the same Spine. The Projection Engine assembles their view.
Account Success, Sales, Engineering, Finance, HR — all read from the same Spine.
```

### 5.3 Canonical projections for all business domains

| Projection        | Consumer                  | Spine roots                                                                    | Memory types                                                  | Key relationships                                  |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------- |
| `account-success` | CSM, Account Manager      | Person, Asset (Contract, Subscription), Process (Task), Conversation (Meeting) | Health, Risk, Engagement, Timeline, Insights, Recommendations | Person↔Asset, Process↔Person, Conversation↔Person  |
| `sales`           | AE, SDR, Sales Manager    | Person, Process (Opportunity), Outcome (Deal), Asset (Contract)                | Forecast, Pipeline, Engagement, Insights                      | Person↔Process, Process↔Outcome, Asset↔Outcome     |
| `engineering`     | IC, Engineering Manager   | Person, Project (Sprint), Asset (Code), Process (Task), Knowledge              | Architecture, Usage, Technical Debt, Signals                  | Person↔Project, Project↔Asset, Asset↔Process       |
| `executive`       | VP, CRO, CFO              | Organization, Asset, Process, Outcome                                          | Health, Risk, Forecast, Revenue, Business Context             | Organization↔Asset↔Process↔Outcome                 |
| `finance`         | Finance Manager, CFO      | Asset (Invoice, Contract), Outcome (Revenue), Decision, Policy                 | Forecast, Budget, Metrics, Compliance                         | Asset↔Outcome, Decision↔Policy, Asset↔Decision     |
| `hr`              | HRBP, CHRO                | Person, Team, Process (Onboarding), Knowledge (SOP), Decision                  | Engagement, Metrics, Timeline, Insights                       | Person↔Team, Team↔Process, Process↔Knowledge       |
| `support`         | Support Engineer, Manager | Person, Asset (Product, Deployment), Process (Ticket), Outcome (Resolution)    | Cases, Errors, Incidents, SLA, Usage                          | Person↔Asset, Asset↔Process, Process↔Outcome       |
| `implementation`  | Onboarding Manager        | Person, Project, Process (Task), Objective                                     | Milestones, Timeline, Signals, Business Context               | Project↔Process, Process↔Person, Project↔Objective |
| `marketing`       | Marketing Manager         | Person, Project (Campaign), Asset (Content), Outcome (Lead)                    | Engagement, Insights, Metrics, Timeline                       | Project↔Asset, Asset↔Outcome, Project↔Person       |
| `operations`      | Ops Manager               | Process, Policy, Decision, Knowledge, Outcome                                  | Metrics, Compliance, Timeline, Insights                       | Process↔Policy, Decision↔Policy, Knowledge↔Process |

---

## 6. Cross-Layer Rules

### 6.1 Write path

```text
Connector / Webhook / MCP / API / Manual
        ↓  (Loader → Normalizer → Entity Resolution)
Pipeline (Spine Writer)  ──writes──▶  Canonical Spine (append-only)
        ↓  (Signal loop: Think → HITL → Act → Pipeline)
Intelligence Agent  ──generates──▶  Dynamic Memory (ephemeral, opinionated)
        ↓  (read-only assembly at query time)
Projection Engine  ──assembles──▶  Projections (views, never stored)
```

### 6.2 Read path

```text
User / Twin / API
        ↓
Projection Engine  ──reads──▶  Canonical Spine (stable truth)
                      ──reads──▶  Dynamic Memory (current opinion)
                      ──reads──▶  spine_relationships (typed graph)
        ↓
Assembly  ──returns──▶  TypedProjectionResult (JSON, never SQL directly to UI)
```

### 6.3 The No-Duplication Contract

- **No domain has its own table.** If Account Success and Sales both need `Person`, they read from the same `spine_persons` table.
- **No memory is duplicated per domain.** If CSM and Sales both need `Health`, they read the same `memory_health` record.
- **No projection is materialized.** Projections are computed at query time.

---

## 7. From Domain-Specific to Platform-Level

### Old Account Success model → New platform model

| Old domain-specific          | New platform-level                                              | Mapping                                               |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| `spine_accounts`             | `spine_organizations` + `spine_assets` (Contract, Subscription) | Account = Organization + Asset                        |
| `spine_people`               | `spine_persons`                                                 | Same entity, now universal                            |
| `spine_business_context`     | `memory_business_context`                                       | Memory layer, opinion                                 |
| `spine_strategic_objectives` | `spine_objectives`                                              | Objective root concept                                |
| `spine_capabilities`         | `memory_architecture`                                           | Memory layer, assessed                                |
| `spine_api_portfolio`        | `spine_integrations` (Capability + Asset)                       | Integration inherits from Capability + Asset          |
| `spine_platform_metrics`     | `memory_usage` + `memory_signals`                               | Derived metrics, not raw facts                        |
| `spine_initiatives`          | `spine_projects`                                                | Project root concept                                  |
| `spine_technical_debt`       | `memory_technical_debt`                                         | Memory layer, opinionated                             |
| `spine_stakeholder_outcomes` | `memory_stakeholder`                                            | Memory layer, derived                                 |
| `spine_engagements`          | `memory_engagement` + `spine_conversations`                     | Conversation is real; engagement depth is derived     |
| `spine_success_plans`        | Projection + `spine_objectives` + `spine_projects`              | Plan = projection of objectives + projects + timeline |
| `spine_insights`             | `memory_insights`                                               | Memory layer, ephemeral                               |

---

## 8. Source-of-Truth Index

| Concept                      | Authoritative source                            |
| ---------------------------- | ----------------------------------------------- |
| Three-layer model (this doc) | `docs/architecture/SPINE_DOMAIN.md`             |
| 16 root concepts             | `docs/platform-specs/21-business-ontology.md`   |
| Operational Spine            | `docs/platform-specs/02-operational-spine.md`   |
| Entity Framework             | `docs/platform-specs/12-entity-framework.md`    |
| Capability Fabric            | `docs/platform-specs/05-capability-fabric.md`   |
| Memory System                | `docs/platform-specs/07-memory-system.md`       |
| Twin Runtime                 | `docs/platform-specs/06-twin-runtime.md`        |
| Connector Framework          | `docs/platform-specs/08-connector-framework.md` |
| Governance Engine            | `docs/platform-specs/09-governance-engine.md`   |
| Signal Engine                | `docs/platform-specs/10-signal-engine.md`       |
| Workflow Engine              | `docs/platform-specs/11-workflow-engine.md`     |
| Agent pipeline               | `docs/architecture/SPINE_INTELLIGENCE_AGENT.md` |
| Physical storage             | `docs/architecture/SPINE_MODEL.md`              |
| Projection engine            | `docs/architecture/PROJECTION_MODEL.md`         |
| 35-document hierarchy        | Notion Document Hub                             |

---

_The Spine is the platform. Domains are views. The graph is the product. When in doubt — halt, ask Nirmal._
