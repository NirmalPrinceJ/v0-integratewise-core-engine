# CONTINUITY

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Continuity capability and L1 product expression
Canonical Owner: Platform / Continuity
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/platform-specs/25-continuity-engine.md, docs/platform-specs/07-memory-system.md, docs/platform-specs/03-workspace-runtime.md, docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md, docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md, wrangler manifests, Option B divergence audit
Supersedes: none
Superseded By: none

---

## 1. WHAT CONTINUITY IS

Continuity is persistent operational context.

It is the platform capability that preserves state across time, actors, actions, and operational restarts.

---

## 2. MEMORY SCOPES

Continuity memory operates at three scopes:

- USER — per-person operational memory
- WORK — per-entity or per-process operational memory
- ORGANIZATION — tenant-wide operational memory

Continuity permits:

- workspace continuation
- entity continuation
- previous action awareness
- unresolved work awareness
- prior decision awareness
- model/context continuation

---

## 3. CONTINUITY PLATFORM CAPABILITY

Continuity is the platform behavior of:

- persisting operational state
- recovering prior context
- maintaining unresolved work visibility
- maintaining decision lineage
- supporting model/context continuation

Runtime identities that may participate in continuity include:

- services/continuity
- services/workflow
- services/knowledge
- services/hermes
- services/iw-agent-runtime
- Spine or supporting storage substrates

Each must be classified individually.

---

## 4. CONTINUITY BRIDGE

Continuity Bridge is a platform concept, not a product page or activity feed.

The platform concept is:

```text
OPERATIONAL REALITY
      ↓
CONTINUITY CAPTURE
      ↓
PERSISTED STATE
      ↓
CONTEXT RECOVERY
      ↓
NEXT OPERATOR/ACTOR CONTEXT
```

This is true regardless of whether a UI styling pattern uses the word "bridge".

---

## 5. L1 CONTINUITY PRODUCT EXPRESSION

Continuity product expression should not imply that Continuity is a page or screen.

Continuity expression in L1 may include:

- activity history
- previous action markers
- unresolved state indicators
- recent change markers
- approval history
- execution history
- continuation affordances

Each is a projection of persisted platform continuity state.

The product does not create continuity. The product reflects continuity.

---

## 6. CURRENT VERIFICATION STATE

Documentation must not treat boot-level hydration or onboarding completion as continuity continuity confirmational proof.

Current runtime evidence for continuity product optimization:

- services/continuity wrangler manifest present
- docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md present as active operational reference
- docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md present but likely frontend state trace
- Documentation style Continuity Bridge references may reflect UI naming, not platform state

Classification:

- Platform continuity lifecycle: CURRENT
- Product expression lifecycle: CURRENT
- Verified E2E continuity: UNKNOWN until tenant state hydration readback is traced
- Next required evidence: tenant onboarding flow readback, persisted recovery replay test

---

## 7. DOCUMENTS THAT PRECEDE THIS

- docs/platform-specs/25-continuity-engine.md
- docs/platform-specs/07-memory-system.md
- docs/platform-specs/03-workspace-runtime.md
- docs/archive/CONTINUITY_BRIDGE_COMPLETE.md
- docs/archive/CONTINUITY_BRIDGE_SIMPLE.md

When conflict arises between this document and those documents, this document is canonical.
