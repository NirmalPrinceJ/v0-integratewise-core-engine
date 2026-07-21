# CAPABILITY FABRIC

Status: CURRENT
Scope: Capability Fabric: registry, execution, governance, router, context builder, execution orchestrator, metrics, discovery UI, shell components
Canonical Owner: Platform / Capability Fabric
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/FINAL_E2E_SYSTEM.md, docs/platform-specs/05-capability-fabric.md, docs/platform-specs/11-workflow-engine.md, docs/platform-specs/19-api-contracts.md, docs/architecture/PROJECTION_MODEL.md, wrangler manifests, Option B branch evidence
Supersedes: none
Superseded By: none

---

## 1. WHAT CAPABILITY FABRIC IS

Capability Fabric is the governed execution language between intelligence and operational action.

It does:

- discover capabilities
- select capabilities by policy and context
- validate parameters
- enforce governance gates before execution
- route execution to the correct runtime implementation
- return the result as canonical evidence

It does not:

- own canonical truth
- decide outcomes alone
- bypass governance
- provide direct operational memory

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

---

## 2. COMPONENT TABLE

Each major component must be classified.
Classification is required across three independent readiness dimensions.

| Component                       | Lifecycle | Implemented | Wired   | Deployed | Verified E2E |
| ------------------------------- | --------- | ----------- | ------- | -------- | ------------ |
| Capability Registry             | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Capability Execution Engine     | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Workflow Router / Engine        | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Context Builder                 | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Execution Orchestrator          | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Metrics and Learning Structures | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Capability Discovery UI         | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |
| Capability Shell Components     | UNKNOWN   | UNKNOWN     | UNKNOWN | UNKNOWN  | UNKNOWN      |

These cells must be filled with evidence, not aspiration.

Populate via:

- `services/workflow` manifest and code review
- `docs/platform-specs/05-capability-fabric.md`
- `docs/platform-specs/11-workflow-engine.md`
- API contracts under `docs/platform-specs/19-api-contracts.md`
- package/service README evidence
- Option B and Option B Wave 0 evidence

---

## 3. READY-STATE LANGUAGE

Do not describe Capability Fabric as:

- operational end-to-end
- fully wired
- complete
- production ready
- Spine connected

merely because components exist.

Existence of code files is not deployed readiness. Presence in wrangler manifests alone is not verified E2E operation.

---

## 4. GOVERNANCE CONTRACT

Every capability execution path must include a governed boundary.

```text
Capability selection
      ↓
Policy evaluation
      ↓
Governance gate if required by policy
      ↓
Execution contract accepted
      ↓
Capability execution
      ↓
Canonical result path
```

Capability Fabric must not be documented as bypassing governance.

---

## 5. DOCUMENTS THAT PRECEDE THIS

- docs/platform-specs/05-capability-fabric.md
- docs/platform-specs/11-workflow-engine.md
- docs/platform-specs/31-evolution-strategy.md
- docs/ip/tech/CAPABILITY_RESOLVER_PATTERN.md
- docs/archive/CAPABILITY_FIRST_ARCHITECTURE.md
- docs/archive/CAPABILITY_FIRST_ROADMAP.md

When conflict arises between this document and those documents, this document is canonical.
