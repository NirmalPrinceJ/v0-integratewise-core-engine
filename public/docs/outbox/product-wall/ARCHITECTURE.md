# ARCHITECTURE

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: System composition and architectural laws
Canonical Owner: Platform
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/FINAL_E2E_SYSTEM.md, docs/platform-specs/\_MASTER_INDEX.md, docs/platform-specs/\_doctrine-and-sales-narrative.md, Option B branch evidence, wrangler manifests
Supersedes: none
Superseded By: none

---

## 1. SYSTEM COMPOSITION

IntegrateWise is composed of two legally distinct boundaries:

- PLATFORM — capability
- PRODUCT — L1 experience

These are not stylistic adjectives. They are architectural boundaries.

```text
PLATFORM INTERNAL ARCHITECTURE
≠
PRODUCT NAVIGATION ARCHITECTURE
```

The platform may retain internal layers and runtime identities. The frontend product does not expose L2-L7 as separate user layers.

```text
L1 = where the human works
```

---

## 2. ARCHITECTURAL LAWS

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

These laws are binding across documentation, platform design, and product design.

---

## 3. DOCUMENTATION LIFECYCLE LAW

Every architectural statement in documentation must distinguish between CURRENT, TARGET, MIGRATING, HISTORICAL, PROPOSED, and UNKNOWN.

These exact lifecycle labels are system-wide requirements.

Definitions:

- CURRENT = verified to exist in repository or runtime; current does not automatically mean operational
- TARGET = approved canonical architecture, may not yet be implemented or deployed
- MIGRATING = current implementation is actively moving toward the approved target
- HISTORICAL = retained for compatibility, evidence, migration, or archival reasons
- PROPOSED = discussed but not canonically frozen
- UNKNOWN = insufficient evidence to classify accurately

Usage restrictions:

- Never describe a TARGET service as CURRENT unless repository/runtime evidence proves it
- Never describe a deployed Worker as canonical merely because it exists
- Never describe a route named `/spine/*` as Spine-backed without tracing its downstream authority
- Never describe frontend flow completion as platform activation completion
- Never describe repository presence as operational readiness

---

## 4. HISTORICAL ARCHITECTURE LINEAGE

The repository previously contained multi-layer, multi-product architectural narratives. Those remain useful for lineage, but they are classified HISTORICAL unless explicitly marked otherwise.

Examples requiring historical classification:

- Seven-layer user navigation/product architecture when used to describe product boundary structure
- Multi-Workbench product doctrine when used to describe separate user-facing surfaces
- Twin Workbench / Governance Workbench / Knowledge Workbench / Domain Workbenches as product surfaces
- Supabase-driven SSOT when used as canonical product definition
- Vercel-first app hosting when used as canonical product target

Historical architecture should be marked HISTORICAL with scope notes and replacement targets rather than deleted.

---

## 5. AUTHORITY AND PROOF LAW

Documentation must distinguish declared architecture from verified architecture.

A document may declare:

- a target topology
- a desired feature
- a canonical service role

Verification requires one or more of:

- repository manifest evidence
- runtime behavior evidence
- persisted state evidence
- verified traffic evidence
- end-to-end readback evidence

Absent verification, the statement remains TARGET, PROPOSED, or UNKNOWN, never CURRENT.
