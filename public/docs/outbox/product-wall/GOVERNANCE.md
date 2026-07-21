# GOVERNANCE

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Governance policy, HITL, semantic stages, runtime identity classification
Canonical Owner: Governance
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/platform-specs/09-governance-engine.md, docs/architecture/WORKBENCH_DOCTRINE.md, docs/platform-specs/10-signal-engine.md, wrangler manifests, Option B branch evidence
Supersedes: none
Superseded By: none

---

## 1. WHAT GOVERNANCE IS

Governance owns policy and approval semantics.

It is the operational control plane that decides whether inferred state, proposed actions, or execution candidates may advance.

Governance is not a chat window. Governance is not modal UI for its own sake. Governance appears when policy requires it.

```text
UNDERSTAND
→ PROPOSE
→ GOVERN WHEN REQUIRED
→ EXECUTE
→ CONTINUE
```

This is the canonical product-level loop.

Historical architectural expression:

```text
THINK
→ ACT
→ GOVERN
→ REPEAT
```

This historical model may represent semantic stages rather than independent runtime services.

```text
SEMANTIC STAGE
≠
RUNTIME SERVICE IDENTITY
```

---

## 2. CURRENT RUNTIME EVIDENCE

Current wrangler manifests show:

- services/govern/wrangler.toml name = integratewise-govern

Target runtime identity is `governance`.

Document current runtime ownership separately from target ownership. Do not declare the migration complete unless Git and runtime evidence prove it.

---

## 3. GOVERNANCE OWNERSHIP

Governance must not be documented as a domain user experience unless covered by the CUSTOMER_ZERO and product verification path.

Governance is:

- approval gating
- request/response policy
- evidence retention
- confidence threshold
- escalation rules
- audit
- HITL behavior

Product expression of governance must be emitted through L1 Workbench grammar:

- contextual intelligence surface
- action governance gate
- execution state update

Governance is not:

- backend chat
- backend report panel
- standalone admin product unless explicitly frozen

---

## 4. HITL CLASSIFICATION

Human-in-the-loop is governance behavior.

Operators may act as reviewers, approvers, escallators, or exception handlers.

Human involvement does not make a feature a separate product boundary.

Human involvement does not bypass canonical write authority.

---

## 5. DOCUMENTS THAT PRECEDE THIS

- docs/platform-specs/09-governance-engine.md
- docs/architecture/WORKBENCH_DOCTRINE.md
- docs/platform-specs/10-signal-engine.md
- docs/archive/GOVERNANCE_AND_CONTINUITY.md
- docs/ip/tech/MCP_ADK_ROUTING_SPINE_MEMORY_ARCHITECTURE.md

When conflict arises between this document and those documents, this document is canonical.
