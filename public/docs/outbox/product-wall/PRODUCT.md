# PRODUCT

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Product identity, target grammar, boundaries
Canonical Owner: Product
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/architecture/PRODUCT_ARCHITECTURE.md, docs/architecture/WORKBENCH_DOCTRINE.md, docs/platform-specs/\_MASTER_INDEX.md, Option B evidence
Supersedes: none
Superseded By: none

---

## 1. WHAT INTEGRATEWISE IS

IntegrateWise is operational continuity infrastructure with governed intelligence.

It preserves unified operational context across fragmented systems, normalizes that context into canonical form, and allows intelligence and action to be proposed, governed, executed, and remembered.

Product name in current canon: IW Continuity Bridge
Category: The Operational Continuity Platform

Jurisdiction: human operational context
Audience: tenants, operators, internal system actors
Experience surface: L1 Workbench

---

## 2. PLATFORM AND PRODUCT DISTINCTION

```text
PLATFORM = capability
PRODUCT  = L1 experience
```

PLATFORM delivers capability:

- ingest, normalize, synthesize, canonicalize, remember, understand, propose, govern, execute, continue

PRODUCT delivers human experience:

- context lens, entity collection, entity 360, activity, intelligence, action, governance when required, execution state, continuity

They share data and behavior. They are not the same surface and must not be documented interchangeably.

---

## 3. PRODUCT TARGET ARCHITECTURE

### 3.1 Surface Target: L1 Workbench

The human product is L1.

Current repositories and documentation contain multiple app directories and multiple workbench narratives. Those are implementation evidence and historical choice, not target product architecture.

Target product boundary:

- one L1 Workbench surface
- one tenant context at a time
- one entity collection/entity 360/activity/intelligence/action/execution/continuity grammar
- Twin buttons (OODA): Store in Spine, Ask Your Twin, Assign Your Twin, Approve Twin's Action

Twin is a silent partner inside L1, not a separate chat surface.

### 3.2 What L1 is not

L1 is not:

- a separate Department Workbench product per department
- a separate Twin Workbench product
- a separate Governance Workbench product
- L2/L3 as separate user-visible layers
- CRM merely because Lead entities exist
- Backend itself exposed as product surface
- Service runtime exposed as product surface

Department knowledge is a Context Lens unless repository evidence separately authorizes a product boundary.

### 3.3 Product grammar

```text
CONTEXT LENS
→ ENTITY COLLECTION
→ ENTITY 360
→ ACTIVITY
→ CONTEXTUAL INTELLIGENCE
→ ACTION
→ GOVERNANCE WHEN REQUIRED
→ EXECUTION STATE
→ CONTINUITY
```

This grammar applies to all roles and contexts. Same entity, different lens = different operational emphasis.

---

## 4. ENTITY AND KNOWLEDGE BOUNDARIES

Domain knowledge such as Account Success, Revenue Operations, Sales Operations, Finance, Marketing, HR/People, Product and Engineering, Business Operations, IT Administration, Services, and Procurement are Context Lenses.

They are not separate products unless a separately authorized boundary is established.

---

## 5. FRONTEND APP REALITY

Current repository contains:

- apps/web
- apps/workspace
- apps/desktop
- apps/mobile
- apps/docs

Canonical target is `apps/web`.

If another app directory currently hosts the strongest corpus, that is an implementation-state observation, not a target boundary.

Classification table:

| App            | Lifecycle                | Deployment Status | Product Role                                | Canonical Target | Notes                                                                                    |
| -------------- | ------------------------ | ----------------- | ------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| apps/web       | TARGET                   | UNKNOWN           | canonical L1 product application            | YES              | Must be evaluated against Next.js/Vercel entanglement and Vite target                    |
| apps/workspace | CURRENT/CURRENT_EVIDENCE | UNKNOWN           | integrated runnable product corpus evidence | IF holds corpus  | Separate evaluation required; preserve evidence, do not declare canonical until verified |
| apps/desktop   | HISTORICAL/UNKNOWN       | UNKNOWN           | Electron wrapper                            | NO               | Wraps web app; does not establish product boundary                                       |
| apps/mobile    | HISTORICAL               | placeholder       | placeholder                                 | NO               |                                                                                          |
| apps/docs      | UNKNOWN                  | UNKNOWN           | docs-only app                               | UNKNOWN          |                                                                                          |

Do not document department surfaces as separate product architectures.

---

## 6. RELEVANT DOCUMENT CLASSIFICATION

- `docs/architecture/PRODUCT_ARCHITECTURE.md` — primary product front door
- `docs/architecture/WORKBENCH_DOCTRINE.md` — L1 projection grammar
- `docs/architecture/WORKBENCH_DOCTRINE.md` must be read alongside this document and reconciled to eliminate separate Human/Twin/Governance/Knowledge/Domain Workbenches as product boundaries.
