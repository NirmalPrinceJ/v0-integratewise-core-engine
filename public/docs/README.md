# IntegrateWise Documentation

Status: CURRENT
Scope: Documentation index and canonical document set
Canonical Owner: Hermes / Documentation reconciliation
Last Verified: 2026-07-11
Evidence Basis: repository file inventory, Tier A canon, docs/CANON.md, Option B branch evidence
Supersedes: none
Superseded By: none

This file is the documentation entry point. Read this before trusting any other document.

---

## 1. HOW TO USE THESE DOCUMENTS

Every document belongs to one tier:

| Tier               | Meaning                              | Rule                                         |
| ------------------ | ------------------------------------ | -------------------------------------------- |
| **A — Canon**      | Authoritative architecture set       | Code points here; when conflicts, canon wins |
| **B — Derived**    | Specs, marketing, design, ops guides | Must reference Canon; align when touched     |
| **C — Historical** | Dated snapshots of a past era        | Archive with banner; never trust as current  |

When any document contradicts the canon below, **the canon wins**.

---

## 2. CANONICAL DOCUMENT SET

These documents are the authoritative source for IntegrateWise architecture, product, and platform truth.

| Document                                             | Subject                              | Tier | Status               | Canonical Owner  |
| ---------------------------------------------------- | ------------------------------------ | ---- | -------------------- | ---------------- |
| `docs/architecture/PRODUCT_ARCHITECTURE.md`          | Product front door                   | A    | CURRENT              | Product          |
| `docs/architecture/WORKBENCH_DOCTRINE.md`            | Workbench doctrine                   | A    | CURRENT              | Product          |
| `docs/architecture/PROJECTION_MODEL.md`              | Projection model                     | A    | CURRENT              | Platform         |
| `docs/architecture/SPINE_MODEL.md`                   | Spine data model                     | A    | CURRENT              | SPINE            |
| `docs/architecture/ONBOARDING_FLOW.md`               | Onboarding flow                      | A    | CURRENT              | Product          |
| `docs/architecture/USER_SYSTEM_JOURNEY_BLUEPRINT.md` | Layers and stages                    | A    | HISTORICAL (lineage) | Platform         |
| `docs/architecture/END_TO_END_ARCHITECTURE.md`       | End-to-end systems view              | A    | MIGRATING            | Platform/Product |
| `AGENTS.md`                                          | Agent protocol, decisions, bindings  | A    | CURRENT              | Nirmal + Hermes  |
| `docs/CANON.md`                                      | Canon doc map and tiers              | A    | CURRENT              | Tier A canon     |
| `docs/CANONICAL_STATE.md`                            | Canonical launch state               | A    | CURRENT              | Tier A canon     |
| `docs/FINAL_E2E_SYSTEM.md`                           | Master end-to-end system contract    | A    | CURRENT              | Tier A canon     |
| `docs/FEATURE_MAP.md`                                | Feature mapping                      | A    | CURRENT              | Tier A canon     |
| `docs/migrations/DE_SUPABASE_MIGRATION.md`           | De-Supabase migration tracker        | A    | CURRENT              | Platform         |
| `docs/operations/CF_WIRE_STATUS.md`                  | Live Cloudflare wiring               | A    | CURRENT              | Platform         |
| `docs/product/FUNDRAISE.md`                          | Fundraise strategy and scenarios     | A    | CURRENT              | Product          |
| `docs/product/TECHNICAL_COFOUNDER.md`                | Technical co-founder role and equity | A    | CURRENT              | Product          |

### Canonical Topology and State Documents

| Document                 | Subject                                    | Tier | Status  | Canonical Owner |
| ------------------------ | ------------------------------------------ | ---- | ------- | --------------- |
| `RUNTIME-TOPOLOGY.md`    | Runtime identities                         | A    | CURRENT | Platform        |
| `DEPLOYMENT-STATE.md`    | Deployed Cloudflare infrastructure         | A    | CURRENT | Platform        |
| `SPINE.md`               | Canonical truth and write authority        | A    | CURRENT | SPINE           |
| `CONTINUITY.md`          | Platform capability and L1 expression      | A    | CURRENT | Platform        |
| `HERMES.md`              | Cognitive orchestration runtime            | A    | CURRENT | Hermes          |
| `GOVERNANCE.md`          | Policy, HITL, semantic stages              | A    | CURRENT | Governance      |
| `CAPABILITY-FABRIC.md`   | Capability discovery, selection, execution | A    | CURRENT | Platform        |
| `INTEGRATION-MANAGER.md` | Connection and hydration lifecycle         | A    | CURRENT | Platform        |
| `MCP.md`                 | MCP protocol role                          | A    | CURRENT | Platform        |
| `CUSTOMER-ZERO.md`       | First real tenant activation               | A    | CURRENT | Platform        |
| `MIGRATION-STATE.md`     | Option B and product reconciliation state  | A    | CURRENT | Platform        |
| `READINESS.md`           | Evidence-based operational readiness       | A    | CURRENT | Platform        |
| `PRODUCT.md`             | What IntegrateWise is                      | A    | CURRENT | Product         |
| `PLATFORM.md`            | Platform capability model                  | A    | CURRENT | Platform        |
| `ARCHITECTURE.md`        | System composition and architectural laws  | A    | CURRENT | Platform        |
| `L1-WORKBENCH.md`        | Human product grammar                      | A    | CURRENT | Product         |

---

## 3. TIER B — DERIVED

These documents are active and real, but they are **downstream of Tier A**. They may describe how and for whom, never redefine what.

| Category                 | Location                                                                                 | Must match                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| Feature specs            | `docs/platform-specs/00-vision-doctrine.md` through `34-system-lifecycle.md`             | Current Tier A canon                        |
| Public / marketing / GTM | `docs/public/**`                                                                         | `docs/architecture/PRODUCT_ARCHITECTURE.md` |
| Design specs             | `docs/public/design/**`                                                                  | `docs/architecture/PROJECTION_MODEL.md`     |
| Developer docs           | `docs/internal/operations/**`, `docs/internal/runbooks/**`, `docs/internal/playbooks/**` | `AGENTS.md`, `DEPLOYMENT-STATE.md`          |
| Product catalog          | `docs/public/product/**`                                                                 | `docs/architecture/PRODUCT_ARCHITECTURE.md` |

---

## 4. TIER C — HISTORICAL

These are dated records kept for lineage only. Describe state at time of writing; do not maintain them as current truth.

- `docs/archive/**`
- `docs/ip/**`
- `docs/internal/status/**`
- `_archive/**`
- `archive/workspace_backups/**`
- `reference/frontend-consolidated/**`
- Root architectural history files superseded by Tier A docs

If you need the current answer, go to Tier A.

---

## 5. READ THIS FIRST CHECKLIST

- [ ] Read `AGENTS.md` and obey control statements.
- [ ] Read `docs/CANON.md` and confirm current tier labels.
- [ ] Read `docs/architecture/PRODUCT_ARCHITECTURE.md` for product identity.
- [ ] Read `docs/architecture/WORKBENCH_DOCTRINE.md` for L1 doctrine.
- [ ] Read `docs/architecture/SPINE_MODEL.md` for Spine write authority.
- [ ] Read `docs/migrations/DE_SUPABASE_MIGRATION.md` for retired-tech boundary.
- [ ] Read `OPTION_B_BRANCH_DIVERGENCE_AUDIT.md` and `docs/CANONICAL_STATE.md` for runtime state claims.
- [ ] Read `DOCUMENTATION_TRUTH_CENSUS.md` and `DOCUMENTATION_CONTRADICTION_MAP.md` for known contradictions.
- [ ] Start from Tier A; treat Tier C as lineage only.

---

## 6. DOCUMENTATION RECONCILIATION PROVENANCE

This canonical set was produced by D0–D8 of the documentation truth reconciliation.

- D0: `DOCUMENTATION_TRUTH_CENSUS.md`
- D1: `DOCUMENTATION_CONTRADICTION_MAP.md`
- D2: `docs/README.md`
- D3+ : canonical docs `PRODUCT.md`, `PLATFORM.md`, `ARCHITECTURE.md`, `L1-WORKBENCH.md`, `SPINE.md`, `CONTINUITY.md`, `HERMES.md`, `GOVERNANCE.md`, `CAPABILITY-FABRIC.md`, `INTEGRATION-MANAGER.md`, `MCP.md`, `RUNTIME-TOPOLOGY.md`, `DEPLOYMENT-STATE.md`, `MIGRATION-STATE.md`, `READINESS.md`, `CUSTOMER-ZERO.md`
- D7: Root `README.md`

Repository evidence at census time: branch `option-b/wave0-gateway-decoupling`, `OPTION_B_BRANCH_DIVERGENCE_AUDIT.md` present, README conflict markers present, `docs/CANON.md` presents Tier A/B/C canon, service wrangler manifests show current runtime identities.
