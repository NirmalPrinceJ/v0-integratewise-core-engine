# PLATFORM

Status: CURRENT
Scope: Platform capability model and boundaries
Canonical Owner: Platform
Last Verified: 2026-07-11
Evidence Basis: docs/platform-specs/00-vision-doctrine.md through 34-system-lifecycle.md, docs/CANON.md, docs/platform-specs/\_MASTER_INDEX.md, docs/platform-specs/\_core-features.md, docs/platform-specs/\_doctrine-and-sales-narrative.md, Option B evidence, wrangler manifests
Supersedes: none
Superseded By: none

---

## 1. WHAT THE PLATFORM IS

The platform owns operational capability.

It turns raw operational signals into canonical operational memory, allows intelligence to reason over that memory, proposes governed actions, executes approved actions, and preserves continuity.

The platform does not dictate human UX. It provides projection surfaces.

---

## 2. PLATFORM CAPABILITY MODEL

```text
INGEST
→ NORMALIZE
→ SYNTHESIZE
→ CANONICALIZE
→ REMEMBER
→ UNDERSTAND
→ PROPOSE
→ GOVERN
→ EXECUTE
→ CONTINUE
```

Each capability may have:

- a code implementation
- a physical runtime identity or identities
- a governed write authority
- an operational boundary
- a target service boundary
- a historical service legacy

Implementation existence does not prove operation. Service folder presence does not prove deployment. Deployment does not prove end-to-end activation.

---

## 3. PLATFORM LAYERS (INTERNAL ARCHITECTURE)

The platform may retain internal architectural layers. Platform internal structure can include:

- Gateway
- Integration Manager
- Loader
- Normalizer
- Schema Synthesis
- Spine Writer
- Continuity
- Knowledge
- Hermes
- Governance
- Workflow
- Capability Fabric
- Store
- Telemetry
- Tenant context
- Identity/session integration

These layers are not product navigation layers. A user may never directly interact with them. They are governed internal semantics.

---

## 4. PACKAGES AND SERVICES AS PRIMITIVES

### 4.1 Packages

Canonical definition:

```text
Packages are independently published reusable language or consumer/runtime libraries.
```

Canon does not require one package per service.

### 4.2 Services

Canonical definition:

```text
Services are independently deployed runtime identities.
```

Service runtime boundaries follow:

- authority domains
- scaling domains
- security domains
- trigger domains
- failure domains

### 4.3 Runtime identities

The repository currently contains service folders that map to runtime identities. The presence of a folder or worker name does not prove that identity is canonical for that semantic stage.

Current repository evidence must be verified against:

- wrangler.toml manifests
- current deployments
- actual write authority traces
- product routing evidence

Retired or historical runtime identities include:

- act
- agent-registry
- connector
- folder-watcher
- govern
- intelligence
- iw-agent-runtime
- l2
- pipeline
- signals
- think
- twin-orchestrator

Each must be classified:

- CURRENT runtime
- HISTORICAL runtime
- PROPOSED collapse target
- UNKNOWN

---

## 5. CAPABILITY FABRIC

Conceptual model:

```text
INTELLIGENCE
      ↓
CAPABILITY SELECTION
      ↓
POLICY / GOVERNANCE
      ↓
EXECUTION
      ↓
RESULT
      ↓
CANONICAL CONTINUITY
```

Capability Fabric components must be classified individually:

```text
Capability Registry
Capability Execution Engine
Workflow Router
Context Builder
Execution Orchestrator
Metrics and learning structures
Capability discovery UI
Capability shell components
```

For each component record:

- Lifecycle: CURRENT | TARGET | MIGRATING | HISTORICAL | PROPOSED | UNKNOWN
- Implemented: YES | NO
- Wired: FULL | PARTIAL | UNKNOWN
- Deployed: YES | NO | DORMANT | UNKNOWN
- Verified E2E: YES | NO | UNKNOWN

Example format required per component in CAPABILITY-FABRIC.md.

---

## 6. PLATFORM DOCTRINE

1. No model owns canonical truth.
2. No agent writes to Spine directly.
3. The product asks WHAT it needs. The platform determines HOW it is produced.
4. Packages are independently published reusable language and libraries.
5. Services are independently deployed runtime identities.
6. Runtime boundaries follow authority, scaling, security, trigger, and failure domains.
7. The human product is L1.
8. AI is a silent operational partner.
9. Governance appears when policy requires it.
10. Continuity is a system behavior, not merely a page.
11. Repository presence does not prove operational readiness.
12. Deployment success does not prove end-to-end operation.
13. A route or client name does not prove canonical authority.
14. Observed fact, inference, proposal, approval, execution, and canonical result are distinct semantic states.
15. Historical implementation is evidence, not automatic architecture.

---

## 7. RETIRED-TECH BOUNDARY

The current product plane is Cloudflare-only.

Supabase, Postgres, Redis, Vercel application hosting, n8n as IW infra, OpenWebUI, CouchDB, and VPS are retired from the product plane.

Hostinger/VPS is permitted for Customer Zero only, never for product operation.

Implementation artifacts referencing retired tech must be documented as HISTORICAL unless actively targeted for migration.
