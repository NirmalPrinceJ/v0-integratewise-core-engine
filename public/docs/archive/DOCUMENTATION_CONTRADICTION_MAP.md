> **Tier C — Historical.** This document is a point-in-time snapshot. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

# DOCUMENTATION CONTRADICTION MAP

Status: CURRENT
Scope: Integratewise-live repository contradictions between documented claims, Tier A canon, repository manifests, and Option B evidence
Canonical Owner: Hermes / Documentation reconciliation
Last Verified: 2026-07-11
Evidence Basis: docs/ + root markdown inventory, wrangler manifests, Option B branch divergence audit, docs/CANON.md, docs/FINAL_E2E_SYSTEM.md
Supersedes: none
Superseded By: canonical docs reconciliation set in later phases

This file records contradictions only. It does not prescribe order. Do not treat any “warning” as a recommendation to delete docs. When contradictions are related to code/docs divergence, prefer preserving documents as evidence and routing actual mutation to remediation branches.

---

## 1. HOW TO READ THIS MAP

Each entry records a contradiction domain, the docs/claims involved, the repository/branch evidence, and the classification. Where multiple docs state conflicting truths, they are preserved but flagged. The goal is not to destroy history — the goal is to stop contradictions from being presented as coherent canonical truth.

---

## 2. README RUPTURE

### 2.1 Unresolved merge conflict markers

- Document: `README.md`
- Contradiction: Contains `<<<<<<< HEAD ... ======= ... >>>>>>> origin/claude/projection-facade-layer-o3yg9o` conflict markers. The file therefore simultaneously presents two different architectural narratives: a legacy Supabase/Dual-write memory model and an alternate projection-facade narrative.
- Retired-tech claim: HEAD side still references `VITE_SUPABASE_URL`, Fortress DB, and direct database paths.
- Canon retaliation: `docs/CANON.md` and Tier A docs state Cloudflare-only product plane, no Supabase, DECISION 22.
- Evidence: `README.md` line 11 to line 118 contains unresolved conflict markers.
- Classification: CONTRADICTORY / STALE

### 2.2 Supabase in README vs Cloudflare-only doctrine

- Retired-tech claim: README declares “Fortress DB (Supabase SSOT)” and direct writes prohibited only by convention.
- Canon retaliation: `docs/CANON.md`, Tier A canon, current `AGENTS.md` state no Supabase in the product plane.
- Classification: CONTRADICTORY / HIGH

### 2.3 Service directory dropdown mismatch

- Document: `README.md`
- Claim set A: services under `services/gateway`, `services/pipeline`, `services/connector`, `services/intelligence`, etc. plus historical `service` docs.
- Claim set B: `apps/web`, `apps/desktop`, `apps/mobile`, and some nonexistent `services/projection-engine`, `services/capability-resolver`, `services/projection-registry`.
- Runtime evidence: `services/projection-engine`, `services/capability-resolver`, `services/projection-registry` are not present as directories in current branch.
- Classification: CONTRADICTORY / PARTIAL

---

## 3. DOCUMENTED SERVICE TOPOLOGY VS WORKER INVENTORY

### 3.1 26-service canonical mesh vs repository reality

- Document: `docs/FINAL_E2E_SYSTEM.md` §6
- Document: `docs/CANONICAL_STATE.md` claims stable launch state
- Claim: 26 services wired into Gateway as Cloudflare service bindings.
- Evidence: Wrangler inventory shows service folders and `wrangler.toml` files for many services, some named inconsistently with claimed canon:
  - Still present as runtime identities: `gateway`, `pipeline`, `connector`, `loader`, `normalizer`, `intelligence`, `think`, `act`, `govern`, `signals`, `l2`, `twin-orchestrator`, `iw-agent-runtime`, `mcp-connector`, `webhook-ingress`, `folder-watcher`, `knowledge`, `continuity`, `workflow`, `tenants`, `admin`, `billing`, `store`, `telemetry`, `hermes`
  - Missing/unclear runtime identity vs target: `spine-writer`, `schema-synthesis`, `governance`, `huggingface-inference`
- Document side claims runtime ownership that has not been verified in worker inventory; names have not been reconciled.
- Classification: CONTRADICTORY / UNKNOWN

### 3.2 Historical/cognitive runtime clusters vs Hermes

- Documents claiming runtime ownership:
  - `docs/ip/tech/TWIN_AS_COGNITIVE_ORCHESTRATOR.md`: claims Twin is canonical cognitive orchestrator.
  - `docs/ip/tech/ENTITY_360_TWIN_TRIGGER_SCORING_GUARDRAILS.md`, `LAYER_OWNERSHIP_AND_TWIN_RUNTIME.md`: assign cognitive orchestration to Twin.
  - `docs/platform-specs/06-twin-runtime.md`, `docs/platform-specs/23-agent-runtime.md`: target docs that likely attribute runtime responsibilities.
- Canon retaliation:
  - Canon/Hermes doctrine states Hermes is the cognitive orchestration runtime.
  - Hermes is authoritative for context coordination, reasoning orchestration, tool and agent selection, and proposal generation.
  - Twin is a silent partner inside L1, not a separate cognitive runtime.
- Wrangler evidence: both `twin-orchestrator` and `iw-agent-runtime` exist as deployed Worker names; `hermes` is also deployed as `integratewise-hermes`.
- Classification: CONTRADICTORY / HISTORICAL vs CURRENT

---

## 4. SPINE WRITER AUTHORITY RUPTURE

### 4.1 Sole-writer doctrine vs historical pipeline

- Document: `docs/platform-specs/02-operational-spine-canonical-highest-priority.md` declares governed Spine Writer as the sole path to canonical state.
- Document: `docs/architecture/SPINE_MODEL.md` declares canonical Spine and Adaptive Spine tables.
- Wrangler/manifest evidence: `services/pipeline` exists as a deployed Worker named `integratewise-pipeline` and AGENTS.md claims it is the Active Spine Writer.
- Canon gap: Target service `spine-writer` is not present as a service identity in the repository.
- Classification: CONTRADICTORY / UNKNOWN

### 4.2 D1 as Spine vs Spine abstraction vs Supabase claims

- Multiple docs describe Spine as D1, Fortress/Supabase, D1 cache, KV, or a conceptual abstraction:
  - `docs/FINAL_E2E_SYSTEM.md` §20.2 states D1 is operational only; Postgres/HyperDrive is SSOT.
  - `docs/FINAL_E2E_SYSTEM.md` §6.4 writes Spine as D1 operational tables.
  - `docs/architecture/SPINE_DOMAIN.md`, `docs/architecture/SPINE_MODEL.md`, `docs/architecture/SPINE_INTELLIGENCE_AGENT.md` treat D1 as canonical state.
  - `README.md` and historical docs treat Supabase as Fortress SSOT.
- Result: Spine is at once D1 operational store, Postgres SSOT, and Supabase — without a single unified authority documented.
- Classification: CONTRADICTORY / UNKNOWN

---

## 5. GOVERNANCE vs GOVERN RUNTIME

### 5.1 Semantic stage vs Worker identity

- Document target: `docs/platform-specs/09-governance-engine.md` projects governance as a platform capability.
- Runtime evidence: deployed Worker is named `integratewise-govern` with wrangler.toml still referencing Supabase URL secrets.
- Target topology expects separate runtime identity `governance`. Historical docs discuss semantic stages think → act → govern, but the current Worker name is `integratewise-govern`.
- Classification: CONTRADICTORY / MIGRATING

---

## 6. CUSTOMER ZERO ACTIVATION STATE

### 6.1 Frontend flow completion vs platform activation

- Documents: `docs/CANONICAL_STATE.md`, `docs/architecture/ONBOARDING_FLOW.md`, `docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md`, `quicky_start_preview_and_tests.md`
- Claims in repo: many docs use “complete”, “final”, “LOCKED”, “signed” language around Customer Zero and end-to-end system completion, but no repository README or canon doc distinguishes between UI flow simulation, real Spine hydration, or production runtime verification.
- `docs/FINAL_E2E_SYSTEM.md` claims §14 conflicts “resolved” and P0 blockers defined with closure criteria, but `docs/architecture/l1-reality-check.md` documents that Supabase entanglement, Auth thrashing, Capability-first APIs missing, and P0 cross-tenant leak are not bridged.
- Classification: CONTRADICTORY / PARTIAL to STALE

---

## 7. L1-only PRODUCT VS MULTI-WORKBENCH / L2 NAVIGATION

### 7.1 Workbench Doctrine multi-Workbench narrative

- Document: `docs/architecture/WORKBENCH_DOCTRINE.md`
- Canon retaliation: Product doctrine states L1 Workbench only; L2/L3 are panel states inside L1; Human, Twin, Governance, Knowledge, and Domain Workbenches are Context Lenses or panel states, not separate surface boundaries.
- Document declares Human Workbench, Twin Workbench, Governance Workbench, Knowledge Workbench, and Domain Workbenches as separate Workbenches.
- Classification: CONTRADICTORY / HISTORICAL vs CURRENT doctrine

### 7.2 Department surfaces as separate products

- Documents: `docs/ip/tech/ACCOUNT_SUCCESS_FLOW_TRACE.md`, `docs/internal/operations/VERIFICATION_ACCOUNT_SUCCESS_AND_BIZOPS.md`, `docs/internal/status/knowledgework_28d1.md`
- Canon retaliation: Account Success, BizOps, Finance, etc. are Context Lenses unless repository evidence demonstrates a separate product boundary. No separate product boundary is currently canonically frozen.
- Classification: CONTRADICTORY / HISTORICAL

### 7.3 L2 Twin Surface Contract vs L1 Twin Button Doctrine

- Document: `docs/ip/tech/L2_TWIN_SURFACE_CONTRACT.md`
- Canon retaliation: L1 Twin surface has only three buttons: Ask your Twin, Assign your Twin, Check with your Twin. L2 contracts must be panel states, not separate navigation surfaces.
- Classification: CONTRADICTORY / HISTORICAL

---

## 8. MCP ROLE AND AUTHORIZATION

### 8.1 MCP as primary ingress vs product data plane

- Document and chan claims: `docs/FINAL_E2E_SYSTEM.md` and only one MCP entry claim MCP is primary ingress.
- Canon retaliation: MCP is a bidirectional protocol/tool boundary. L1 product data plane is Gateway/projection architecture. MCP is not the normal product data plane.
- Document evidence: Client documentation paths under `apps/mcp-server/` not reported; downstream routing for Customer Zero activation under `iw-mcp[...]` is unverified.
- Classification: CONTRADICTORY / UNKNOWN

### 8.2 Tenant auth 403 recurrence

- Reported in session memory/evidence as `tenant: integratewise`, `client: kiro-iw` returning 403 against MCP.
- Classification: BLOCKED / UNVERIFIED unless reproduction is repeated with manifest-grounded evidence.

---

## 9. FRONTEND REALITY VS DECLARED CANON

### 9.1 apps/live vs apps/web/apps/workspace ambiguity

- `README.md` Alternate includes: `apps/web`, `apps/desktop`, `apps/mobile`; missing `apps/workspace`.
- Folder evidence: `apps/web`, `apps/workspace`, `apps/desktop`, `apps/mobile`, `apps/docs` all exist. There is no `apps/live` directory at this branch’s top-level apps listing.
- Canon retaliation: Canonical target is `apps/web`. If `apps/workspace` currently contains the strongest corpus, it must be documented explicitly, not silently assumed.
- Classification: CONTRADICTORY / UNKNOWN

### 9.2 Next.js/Vercel claims vs Cloudflare Pages stance

- `docs/architecture/l1-reality-check.md` reports Next.js 16 server components and Supabase entanglement still in codebase.
- Tier A docs/claims describe Vite + React + Cloudflare Pages.
- Classification: CONTRADICTORY / UNKNOWN

---

## 10. RETIRED-TECH ABSORBED IN CURRENT DOCUMENTS

The following technologies are claimed as current or canonical by documents that were not tagged historical:

- Supabase / Postgres as canonical SSOT in multiple architecture and README docs
- Redis/caching semantics in older docs
- Vercel hosting for canonical product in platform spec style narratives
- OpenWebUI provisioning docs
- CouchDB setup docs under packages
- Application-layer Durable Object global IDs
- MCP-server app directory not present

Classification: STALE / CONTRADICTORY

---

## 11. READINESS LANGUAGE VIOLATIONS

The repository contains many documents using operational-readiness language despite indefinite gaps:

- `docs/FINAL_E2E_SYSTEM.md` declares “LOCKED — all conflicts resolved” while `docs/architecture/l1-reality-check.md` flags 10 blockers, with P0 #1 cross-tenant leak present.
- `docs/CANONICAL_STATE.md`, `docs/archive/FINAL_DELIVERY_SUMMARY.md`, `docs/archive/DEPLOYMENT_READY.md`, `docs/archive/IMPLEMENTATION_COMPLETE.md`, `docs/archive/PHASE_*_COMPLETE.md`, `docs/internal/status/L05_PHASE1_DEPLOYMENT_READY.md`, etc. use “complete”, “ready”, “signed”, “delivered” semantics.
- Canons: No deployment success proves end-to-end operation. No route proves Spine authority.
- Classification: CONTRADICTORY against readiness maturity

---

## 12. CONTRADICTION SUMMARY

| Identifier | Domain | Contradiction | Lifecycle/State |
|------------|--------|---------------|-----------------|
| C-01 | README | Unresolved merge markers; Supabase + projection-facade alternative | CONTRADICTORY |
| C-02 | README | Service listing includes non-existent directories | CONTRADICTORY |
| C-03 | Runtime topology | Declared 26-service mesh vs observed + unverified runtime identities | UNKNOWN/CONTRADICTORY |
| C-04 | Cognitive runtime | Twin/official docs claim cognitive orchestration vs Hermes doctrine | CONTRADICTORY |
| C-05 | Spine authority | Declared sole Spine writer vs pipeline vs no `spine-writer` service identity | UNKNOWN/CONTRADICTORY |
| C-06 | Spine storage | D1 vs Postgres vs Supabase all claimed as canonical | CONTRADICTORY |
| C-07 | Governance runtime | `integratewise-govern` Worker vs target `governance` identity | MIGRATING/CONTRADICTORY |
| C-08 | Customer Zero | Frontend/test flow declared complete vs platform activation unresolved | CONTRADICTORY |
| C-09 | Product navigation | Multi-Workbench/L2/L3 doctrine vs L1-only product target | CONTRADICTORY |
| C-10 | Department surfaces | Separate department products/surfaces vs Context Lens doctrine | CONTRADICTORY |
| C-11 | L1 Twin surface | Separate L2 Twin Surface Contract vs L1 panel-state rule | CONTRADICTORY |
| C-12 | MCP protocol role | MCP as primary L1 data plane vs protocol/boundary doctrine | CONTRADICTORY/UNKNOWN |
| C-13 | Frontend app routing | `apps/web` canon target vs `apps/workspace` likely strong corpus | UNKNOWN |
| C-14 | Frontend host | Next.js/Vercel evidenced vs Cloudflare Pages/L1 target | CONTRADICTORY |
| C-15 | Retired tech | OpenWebUI, CouchDB, Supabase, Vercel canonical claims in active docs | STALE/CONTRADICTORY |
| C-16 | Readiness language | “Complete”, “LOCKED”, “final” claims vs structural gaps in audit docs | CONTRADICTORY |

---

## 13. REQUIRED D1 OUTPUTS

1. Confirm each contradiction with primary file reads.
2. Reorder contradictions by production risk, not by document order.
3. Identify documents that should become Tier C Historical due to retired-tech content.
4. Map required evidence for each unknown: Cloudflare Worker runtime truth, MCP route authority trace, Spine write authority trace, Customer Zero activation path trace.
