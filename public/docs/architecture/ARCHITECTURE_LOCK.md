# IntegrateWise — Architecture Lock v1.0

**Status**: FROZEN
**Date**: July 17, 2026
**Source**: Code excavation of `integratewise-live` codebase

---

# I. PLATFORM CANON

## The 12 Kernel Terms

| Term           | Definition                                                                                                     | Owner        |
| -------------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| **WORK**       | A human or machine is moving an objective through state                                                        | Spine        |
| **CONTEXT**    | The minimum relevant connected state required to understand current work                                       | Continuity   |
| **SPINE**      | The canonical connected model of operational work state                                                        | Spine        |
| **CONTINUITY** | The preservation and bounded transfer of relevant context across time, systems, humans, and agents             | Bridge       |
| **WORKBENCH**  | The role-specific projection of work and context presented to a human                                          | Product      |
| **TWIN**       | The non-authoritative cognitive participant that consumes grounded context                                     | Intelligence |
| **CAPABILITY** | A registered operation that may read, derive, or change work state                                             | MCP Pool     |
| **GOVERNANCE** | The authority that determines whether a capability or proposed consequence is permitted                        | Governance   |
| **HERMES**     | The execution coordinator for authorized capability invocations                                                | Execution    |
| **SYNC**       | The reconciliation of resulting state across connected systems                                                 | Sync         |
| **BRIDGE**     | The governed exchange boundary through which an authorized consumer receives or contributes bounded continuity | Bridge       |
| **OUTCOME**    | The observed result of work or execution that may become new canonical state                                   | Spine        |

## The OODA Grammar

| OODA        | Action                    | Meaning             |
| ----------- | ------------------------- | ------------------- |
| **Observe** | **Store in Spine**        | Capture truth       |
| **Orient**  | **Ask Your Twin**         | Understand the work |
| **Decide**  | **Assign Your Twin**      | Delegate intent     |
| **Act**     | **Approve Twin's Action** | Authorize execution |

## The Frozen Laws

1. **Twin Law**: Twin is a capability of the Workbench, not a panel.
2. **Context Law**: The human never explains already-known work context to AI.
3. **Memory Law**: Spine owns truth. Memory informs truth. Memory is not truth.
4. **Authority Law**: Confidence increases trust. Confidence never grants authority.
5. **Silence Law**: Twin prefers silence over low-value commentary.
6. **Capability Law**: Workbench projects tool capabilities, doesn't duplicate tools.
7. **Bridge Law**: One platform. One boundary. Different projections.
8. **Product–Platform Law**: Broad underneath. Narrow at the surface.

## The Runtime Sequence (Frozen)

```
Configuration
    ↓
Integration
    ↓
Pipeline
    ↓
Adaptive Spine
    ↓
Workbench Composition
    ↓
Continuity Bridge
    ↓
User Workbench
    ↓
Twin
    ↓
Capability
    ↓
Governance
    ↓
Hermes
    ↓
Sync
    ↓
Promotion
```

---

# II. PLATFORM ARCHITECTURE

## The Four Planes

```
┌─────────────────────────────────────────────┐
│  EXPERIENCE PLANE                           │
│  User Workbench · Twin · Admin · Mobile     │
├─────────────────────────────────────────────┤
│  INTELLIGENCE PLANE                         │
│  Hermes · Knowledge · Memory · Signals      │
├─────────────────────────────────────────────┤
│  EXECUTION PLANE                            │
│  Gateway · MCP Pool · Provider MCP          │
│  Integration MCP · Task MCP                 │
├─────────────────────────────────────────────┤
│  FOUNDATION PLANE                           │
│  Adaptive Spine · Identity · Security       │
│  Storage · Timeline · Provenance            │
└─────────────────────────────────────────────┘
```

## The Gateway (Entry Point)

**Service**: `services/gateway/` (46 files)
**Domain**: `gateway.dev.integratewise.ai`
**D1**: `integratewise-spine-cache`

### Env Bindings (Frozen)

| Category     | Binding          | Type        |
| ------------ | ---------------- | ----------- |
| **Database** | DB               | D1Database  |
| **KV**       | RATE_LIMITS      | KVNamespace |
| **KV**       | SESSIONS         | KVNamespace |
| **KV**       | CONNECTOR_STATUS | KVNamespace |
| **KV**       | SIGNAL_CACHE     | KVNamespace |
| **KV**       | METRICS          | KVNamespace |
| **KV**       | OAUTH_STATE_KV   | KVNamespace |
| **R2**       | FILES            | R2Bucket    |
| **Services** | CONNECTOR        | Fetcher     |
| **Services** | CONNECTOR_SYNC   | Fetcher     |
| **Services** | PIPELINE         | Fetcher     |
| **Services** | INTELLIGENCE     | Fetcher     |
| **Services** | KNOWLEDGE        | Fetcher     |
| **Services** | BFF              | Fetcher     |
| **Services** | L2               | Fetcher     |
| **Services** | AGENT_RUNTIME    | Fetcher     |
| **Services** | ADMIN            | Fetcher     |
| **Services** | BILLING          | Fetcher     |
| **Services** | TENANTS          | Fetcher     |
| **Services** | WEBHOOK_INGRESS  | Fetcher     |
| **Services** | HUB_CONTROLLER   | Fetcher     |

### Gateway Route Table (Frozen)

| Route                         | Target               | Purpose               |
| ----------------------------- | -------------------- | --------------------- |
| `/api/v1/auth`                | INTERNAL_AUTH        | Authentication        |
| `/api/v1/projections`         | INTERNAL_PROJECTIONS | Projection Engine     |
| `/api/v1/billing`             | INTERNAL_BILLING     | Billing               |
| `/api/v1/tenants`             | INTERNAL_TENANTS     | Tenant management     |
| `/api/v1/support`             | INTERNAL_SUPPORT     | Support               |
| `/api/v1/analytics`           | BFF                  | Analytics             |
| `/api/v1/agents`              | INTELLIGENCE         | Agent management      |
| `/api/v1/continuity-bridge`   | CONNECTOR            | Continuity Bridge     |
| `/api/v1/connectors`          | CONNECTOR            | Connector management  |
| `/api/v1/pipeline`            | PIPELINE             | Data pipeline         |
| `/api/v1/intelligence`        | INTELLIGENCE         | Intelligence layer    |
| `/api/v1/cognitive/spine`     | PIPELINE             | Spine operations      |
| `/api/v1/cognitive/entity360` | PIPELINE             | Entity 360            |
| `/api/v1/cognitive/memories`  | KNOWLEDGE            | Memory operations     |
| `/api/v1/cognitive/signals`   | INTELLIGENCE         | Signal processing     |
| `/api/v1/cognitive/think`     | INTELLIGENCE         | Think/Twin            |
| `/api/v1/cognitive/act`       | INTELLIGENCE         | Act execution         |
| `/api/v1/cognitive/govern`    | INTELLIGENCE         | Governance            |
| `/api/v1/cognitive/twin`      | AGENT_RUNTIME        | Twin runtime          |
| `/api/v1/knowledge`           | KNOWLEDGE            | Knowledge management  |
| `/api/v1/workspace`           | BFF                  | Workspace operations  |
| `/api/v1/l2`                  | L2                   | L2 cognitive overlay  |
| `/admin`                      | INTERNAL_ADMIN       | Admin operations      |
| `/oauth`                      | INTERNAL_AUTH        | OAuth flows           |
| `/ws`, `/sse`, `/stream`      | BFF                  | Real-time connections |

---

# III. CAPABILITY FABRIC

## MCP Pool

**Service**: `services/mcp-pool/` (14 files)
**Capabilities**: 55 registered
**Pattern**: Registry → Resolver → Health → Routing → Versioning

### Registered MCPs

| MCP                    | Capabilities                                             | Status   |
| ---------------------- | -------------------------------------------------------- | -------- |
| Provider Management    | 15 (`provider.*`, `apps.*`, `connections.*`, `oauth.*`)  | ✅ Built |
| Integration Management | 28 (`connectors.*`, `sync.*`, `webhooks.*`, `schemas.*`) | ✅ Built |
| Task Management        | 12 (`tasks.*`)                                           | ✅ Built |

### Capability API

```ts
pool.register(manifest, targetBinding);
pool.resolve({ capability, version });
pool.invoke({ capability, version, args, context });
pool.health();
pool.capabilities();
```

## Provider Management MCP

**Service**: `services/provider-management-mcp/` (15 files)
**Capabilities**: 15

| Domain          | Capabilities                                       |
| --------------- | -------------------------------------------------- |
| `provider.*`    | list, health                                       |
| `apps.*`        | list, get, create                                  |
| `connections.*` | list, get, connect, delete, status, invoke, health |
| `oauth.*`       | start, callback, status                            |

## Integration Management MCP

**Service**: `services/integration-management-mcp/` (10 files)
**Capabilities**: 28

| Domain         | Capabilities                                                             |
| -------------- | ------------------------------------------------------------------------ |
| `connectors.*` | install, configure, enable, disable, remove, get, list, providers, stats |
| `sync.*`       | start, complete, cancel, retry, list, latest, stats                      |
| `webhooks.*`   | register, pause, resume, remove, list, findByEvent, stats                |
| `schemas.*`    | register, normalize, list, latest, entityTypes, diff                     |

## Task Management MCP

**Service**: `services/task-management/` (11 files)
**Capabilities**: 12

| Domain    | Capabilities                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `tasks.*` | create, get, list, update, delete, pause, resume, runNow, history, getDue, markCompleted, markFailed |

---

# IV. ADAPTIVE SPINE

## Canonical Entities

| Entity            | Source                                      | Status   |
| ----------------- | ------------------------------------------- | -------- |
| **Connection**    | `packages/spine-entities/src/connection.ts` | ✅ Built |
| **Connector**     | `packages/spine-entities/src/connector.ts`  | ✅ Built |
| **SyncJob**       | `packages/spine-entities/src/sync-job.ts`   | ✅ Built |
| **Webhook**       | `packages/spine-entities/src/webhook.ts`    | ✅ Built |
| **Schema**        | `packages/spine-entities/src/schema.ts`     | ✅ Built |
| **Capability**    | `packages/spine-entities/src/capability.ts` | ✅ Built |
| **TimelineEvent** | `packages/spine-entities/src/timeline.ts`   | ✅ Built |

### Entity Contract (Frozen)

Every entity owns:

| Property          | Meaning                                           |
| ----------------- | ------------------------------------------------- |
| **identity**      | Canonical entity reference (id, provider, tenant) |
| **fields**        | Structured attributes                             |
| **relationships** | Connected entities                                |
| **timeline**      | Temporal history (TimelineEvent)                  |
| **provenance**    | Source and lineage                                |
| **permissions**   | Access governance                                 |
| **capabilities**  | Available operations                              |

## Spine Service

**Service**: `services/spine/` (scaffolded)
**Store**: `EntityStore<T>` — generic CRUD with in-memory Map
**Routes**: REST API for all 7 entity types

| Route                  | Method   | Entity        |
| ---------------------- | -------- | ------------- |
| `/api/v1/connections`  | GET/POST | Connection    |
| `/api/v1/connectors`   | GET/POST | Connector     |
| `/api/v1/sync-jobs`    | GET/POST | SyncJob       |
| `/api/v1/webhooks`     | GET/POST | Webhook       |
| `/api/v1/schemas`      | GET/POST | Schema        |
| `/api/v1/capabilities` | GET/POST | Capability    |
| `/api/v1/timeline`     | GET/POST | TimelineEvent |
| `/api/v1/stats`        | GET      | Entity counts |

---

# V. PRODUCT SURFACES

## The Workbench

> **The User Workbench is the role-specific projection of work and context presented to a human.**

The Workbench is **one surface**. No L1/L2/L4/L7 layers in the UI.

### Sidebar = Capability Navigation

```
┌────────────────────────────────────────────────────────────┐
│ Header                                                     │
├──────────────┬─────────────────────────────────────────────┤
│ Left Sidebar │                                             │
│              │          Active Workspace                   │
│              │                                             │
│ ── Operational ──                                          │
│ Home         │                                             │
│ Accounts     │                                             │
│ Contacts     │                                             │
│ Meetings     │                                             │
│ Tasks        │                                             │
│ Calendar     │                                             │
│ Docs         │                                             │
│ Knowledge    │                                             │
│ Analytics    │                                             │
│              │                                             │
│ ── Platform ──                                             │
│ Continuity   │                                             │
│ Governance   │                                             │
│ Integrations │  (Integration Manager)                     │
│ Configuration│  (Configuration Manager)                    │
│ Activation   │  (Activation Hub)                           │
│ Network Graphs│ (Spine relationship graph)                │
│ Settings     │                                             │
│              │                                             │
│ Twin: NOT a sidebar item. It surfaces contextually,      │
│       invoked by "Ask your Twin" / "Assign your Twin".    │
│              │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

> **Platform section = the platform control surfaces.** Each is a real module
> wired to the platform, not an architectural layer and not the Twin.
>
> - **Integrations** → Integration Manager (connectors, sync, webhooks, schemas)
> - **Configuration** → Configuration Manager (tenant schema, depth matrix, policies)
> - **Activation** → Activation Hub (onboarding completion, intelligence activation)
> - **Network Graphs** → Spine entity relationship graph
> - **Governance** → Approvals, audit, policy gates
> - **Continuity** → Memory, context
>
> **Twin is silent by default.** It is NOT a permanent sidebar destination, panel, or layer.
> It observes the pipeline continuously and surfaces only when there is material value
> or when the user explicitly engages via the Four Buttons.

### The User Never Sees Layers

| ❌ Never in UI      | ✅ Always in UI   |
| ------------------- | ----------------- |
| "Open L2"           | "Open Twin"       |
| "Switch to L4"      | "Open Continuity" |
| "Go to L7"          | "Open Governance" |
| "Layer 1 Workbench" | "Open Home"       |

### Internal Architecture (invisible to user)

```
Workbench (UI)
    ↓
Continuity (L4 — memory, context)
Governance (L7 — approvals, policies)
Twin (L2 — cognitive overlay)
Spine (SSOT)
Gateway (routing)
MCP (capabilities)
```

### External Architecture (what user sees)

```
Workbench
```

### Role Projection (sidebar per role)

**Customer Success:**

```
── Operational ──
Home, Accounts, Contacts, Meetings, Tasks, Calendar, Risks, Renewals, Analytics
── Platform ──
Continuity, Governance, Integrations, Configuration, Activation, Network Graphs, Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Technology:**

```
── Operational ──
Home, Repositories, Services, Deployments, Incidents, Knowledge, Analytics
── Platform ──
Continuity, Governance, Integrations, Configuration, Activation, Network Graphs, Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Founder:**

```
── Operational ──
All operational modules (union of all roles)
── Platform ──
Continuity, Governance, Integrations, Configuration, Activation, Network Graphs, Settings
(Twin is silent — surfaces contextually, not a nav item)
```

### Documentation Convention

| Context              | Reference                                                                   |
| -------------------- | --------------------------------------------------------------------------- |
| **Product docs**     | Workbench, Operational Modules, Platform Capabilities, Twin, Adaptive Spine |
| **Engineering docs** | L1 (Workbench), L2 (Cognitive), L4 (Memory), L7 (Governance)                |
| **User-facing**      | Never mention L1–L7                                                         |

### Domain Structure (from IW-CUS-ZERO)

```typescript
type DomainId =
  | "integratewise-apac" // Founder / Customer Zero
  | "personal" // Personal workspace
  | "account-success" // Customer Success
  | "revops" // Revenue Operations
  | "salesops"; // Sales Operations
```

### Domain Views (Account Success example — 17 views)

```
domains/account-success/views/
├── account-master-view.tsx
├── api-portfolio-view.tsx
├── business-context-view.tsx
├── capabilities-view.tsx
├── company-growth-view.tsx
├── engagement-log-view.tsx
├── initiatives-view.tsx
├── insights-view.tsx
├── people-team-view.tsx
├── platform-health-view.tsx
├── product-client-view.tsx
├── risk-register-view.tsx
├── stakeholder-outcomes-view.tsx
├── strategic-objectives-view.tsx
├── success-plans-view.tsx
├── task-manager-view.tsx
└── value-streams-view.tsx
```

### Workbench Components

| Component            | File                                  | Size | Purpose                             |
| -------------------- | ------------------------------------- | ---- | ----------------------------------- |
| Workspace Shell      | `workspace-shell.tsx`                 | 11KB | Top-level layout, context switching |
| L1 Module Content    | `l1-module-content.tsx`               | 57KB | Domain-specific module rendering    |
| Onboarding Flow      | `onboarding/onboarding-flow.tsx`      | 26KB | Initial setup and activation        |
| Intelligence Overlay | `intelligence-overlay.tsx`            | —    | L2 cognitive overlay                |
| Command Palette      | `command-palette.tsx`                 | —    | Quick actions                       |
| Twin UI              | `twin-ui/twin-shell.tsx`              | —    | Twin interface                      |
| Governance Workbench | `governance/governance-workbench.tsx` | 21KB | L7 governance/approval              |
| Continuity Shell     | `continuity/continuity-shell.tsx`     | —    | L4 memory hub                       |
| Integrations Hub     | `integrations-hub.tsx`                | —    | Connector management                |

### Context Types (CTXEnum)

| Context         | Role                |
| --------------- | ------------------- |
| `CTX_CS`        | Customer Success    |
| `CTX_SALES`     | Sales               |
| `CTX_SUPPORT`   | Support             |
| `CTX_PM`        | Project Management  |
| `CTX_MARKETING` | Marketing           |
| `CTX_BIZOPS`    | Business Operations |
| `CTX_TECH`      | Technology          |
| `CTX_HR`        | Human Resources     |
| `CTX_FINANCE`   | Finance             |
| `CTX_LEGAL`     | Legal               |

### L1 Module Types

```typescript
type L1Module =
  | "Home"
  | "Projects"
  | "Accounts"
  | "Contacts"
  | "Meetings"
  | "Docs"
  | "Tasks"
  | "Calendar"
  | "Notes"
  | "Knowledge Space"
  | "Team"
  | "Pipeline"
  | "Risks"
  | "Expansion"
  | "Analytics"
  | "Integrations"
  | "Ingress"
  | "Schema Registry"
  | "Governance"
  | "Continuity"
  | "Operations"
  | "Admin"
  | "AI Chat"
  | "Settings"
  | "Subscriptions"
  | "Profile";
```

### L2 Component Types

```typescript
type L2Component =
  | "SpineUI"
  | "ContextUI"
  | "KnowledgeUI"
  | "Evidence Drawer"
  | "Signals"
  | "Think"
  | "Act"
  | "HITL"
  | "Govern"
  | "Adjust";
```

### Spine Integration

The Workbench reads from Spine via:

- `useSpine()` — Spine client hook
- `useDomainTable(domain, table)` — Domain-specific data
- `useSpineProjection(context)` — Context projection
- `useSpineReadiness()` — Spine readiness status

### Backend Connection

- `api-client.ts` — Direct fetch to `/api/*`
- `workspace-api.ts` — Workspace-specific API calls
- Gateway integration via `VITE_API_BASE_URL`

---

# VI. DATA FLOW (Canonical)

## Source Documents

- `docs/architecture/source/integratewise-data-flow.md` — Canonical data flow KT
- `docs/architecture/source/code-map-appendix.md` — Code implementation map
- `docs/architecture/source/product-service-offers.md` — Productized service offers
- `docs/architecture/source/app-landing-page.md` — App landing page content

## The Canonical Runtime Chain

```
Landing → Auth → L0 Onboarding → L1 Workspace → L2 Cognitive → L3 Backend
```

## The Canonical System Loop

```
LOAD → NORMALIZE → STORE → THINK → REVIEW & APPROVE → ACT → REPEAT
```

## The Four Flows

| Flow       | Purpose                                | Writes to Spine?                         |
| ---------- | -------------------------------------- | ---------------------------------------- |
| **Flow A** | Structured ingestion (webhooks, polls) | ✅ Yes (pipeline-normalized)             |
| **Flow B** | Connector sync (8-stage pipeline)      | ✅ Yes (pipeline-normalized)             |
| **Flow C** | AI sessions / unstructured input       | ❌ No (contributes knowledge, not truth) |
| **Flow D** | Approved actions → external systems    | ✅ Yes (via Act → pipeline re-ingestion) |

## The Pipeline Stages (8-Stage)

```
1. Raw Event Ingestion
2. Canonical Field Mapping
3. Schema Normalization
4. Entity Resolution
5. Deduplication
6. Relationship Linking
7. Depth Matrix Evaluation
8. Spine Write
```

## Core Principles

1. **The Spine is the single source of truth** — all durable business value must be created through a Spine-based flow
2. **No data may bypass Layer 3** — every piece of information must pass through the controlled L3 pipeline
3. **Flow C never writes directly to the Spine** — knowledge and decision context only become truth through approved actions
4. **The workspace is not a truth layer** — L1 is dynamically generated from Spine data, not a separate SSOT
5. **No action executes without approval** — Think → Govern → HITL → Act / Adjust

## Desktop

**App**: `apps/desktop/` (Electron + electron-vite)
**Framework**: Electron wrapper
**Routes**: 0 (wraps web app)
**Backend**: Indirect (through web app)

## Mobile

**App**: `apps/mobile/` (Expo 52 + React Native 0.76)
**Framework**: expo-router
**Routes**: 4 tab routes (Dashboard, Signals, Playbook, Settings)
**Backend**: Direct fetch to `/api/v1/*`
**Status**: Scaffolded, no build output

## Local Monitor

**App**: `apps/local-monitor/` (Node.js daemon)
**Framework**: Chokidar file watcher
**Purpose**: Bridges local filesystem changes into pipeline
**Backend**: POST to `/webhooks/folder-monitor`

---

# VI. DATA SUBSTRATE

## D1 (Primary)

| Database                    | Binding      | Purpose                    |
| --------------------------- | ------------ | -------------------------- |
| `integratewise-spine-cache` | DB (gateway) | Auth, tenant, user records |

## KV (Hot Cache)

| Namespace        | Binding          | Purpose                          |
| ---------------- | ---------------- | -------------------------------- |
| Rate Limits      | RATE_LIMITS      | API rate limiting                |
| Sessions         | SESSIONS         | User sessions                    |
| Connector Status | CONNECTOR_STATUS | Connector install/runtime status |
| Signal Cache     | SIGNAL_CACHE     | Signal event cache               |
| Metrics          | METRICS          | Application metrics              |
| OAuth State      | OAUTH_STATE_KV   | OAuth flow state                 |

## R2 (Blobs)

| Bucket | Binding | Purpose                                    |
| ------ | ------- | ------------------------------------------ |
| Files  | FILES   | Files, attachments, evidence, raw payloads |

---

# VII. IDENTITY

## Authentication Stack

| Layer            | Provider                                   | Status    |
| ---------------- | ------------------------------------------ | --------- |
| **Primary**      | Descope (OIDC)                             | ✅ Active |
| **JWT**          | Descope session validation                 | ✅ Active |
| **OAuth**        | Google, GitHub, Slack, Salesforce, HubSpot | ✅ Active |
| **MCP Auth**     | Cloudflare Access                          | ✅ Active |
| **Webhook Auth** | HMAC signature verification                | ✅ Active |

---

# VIII. FOUR CONNECTION PATHS

| Path              | Purpose                                                          | Contract                        |
| ----------------- | ---------------------------------------------------------------- | ------------------------------- |
| **MCP**           | Connects tools and resource protocols                            | Tool protocol                   |
| **AI Connector**  | Connects intelligence providers and AI runtimes                  | Intelligence provider contract  |
| **API Connector** | Connects operational systems                                     | Provider integration contract   |
| **API Wrapper**   | Converts existing callable operations into governed capabilities | Capability abstraction contract |

---

# IX. VERSIONING

## Platform Version Rules

| Change                     | Version       |
| -------------------------- | ------------- |
| New kernel concept         | Major (2.0)   |
| New runtime step           | Major (2.0)   |
| New doctrine               | Minor (1.1)   |
| New capability type        | Minor (1.1)   |
| Implementation improvement | Patch (1.0.1) |
| New projection             | Patch (1.0.1) |
| New role composition       | Patch (1.0.1) |

## Current Status

**Platform Lock: DECLARED**
**Version: 1.0**
**Status: FROZEN**

---

# X. TAGLINE

> **Truth you own. AI you rent. Approval in between.**
