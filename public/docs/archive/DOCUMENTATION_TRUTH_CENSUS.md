# DOCUMENTATION TRUTH CENSUS


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Integratewise-live repository-wide non-archive document census
Canonical Owner: Hermes / Documentation reconciliation
Last Verified: 2026-07-11
Evidence Basis: repository file inventory, package/wrangler manifests, option-b audit, canon docs
Supersedes: none
Superseded By: DOCUMENTATION_CONTRADICTION_MAP.md

README-first enumeration; excludes `_archive/`, `_reference/`, and `archive/workspace_backups/**` from primary action counts, but includes them in total inventory for lineage.

---

## 1. COUNTS AND SUMMARY

### 1.1 Repository Inventory

| Scope | Count |
|------|-------|
| Workspace docs inventoried | 224 |
| Active docs and root top-level noticed | 157 |
| Docs in active paths (docs/, platform-specs, ip, architecture, migrations, operations, internal/) | 185 |
| Docs in root and app/package/service README paths | 39 |
| _archive active docs | 69 |
| archive/workspace_backups docs | 130 |
| Total .md files observed | 194 |
| Service and package etc. WRANGLER/package docs observed | not enumerated in markdown scanner |

### 1.2 Classification Summary

| Lifecycle | Tally | Representative documents |
|-----------|-------|--------------------------|
| CURRENT | TBD in D1/D2 | OPTION_B_BRANCH_DIVERGENCE_AUDIT.md, docs/CANON.md, docs/FEATURE_MAP.md, docs/CANONICAL_STATE.md, docs/platform-specs/_MASTER_INDEX.md |
| TARGET | TBD in D1/D2 | docs/platform-specs/**, future canonical docs/README.md, future target docs: PRODUCT.md, PLATFORM.md, ARCHITECTURE.md, SPINE.md |
| MIGRATING | TBD in D1/D2 | docs/migrations/DE_SUPABASE_MIGRATION.md, docs/platform-specs/continuity/governance/spine/pipeline targets |
| HISTORICAL | TBD in D1/D2 | docs/archive/**, docs/ip/**, docs/internal/status/** |
| PROPOSED | TBD in D1/D2 | Not stabilized yet |
| UNKNOWN | TBD in D1/D2 | Some ip docs, internal session notes, some status docs |

### 1.3 Accuracy Summary

| Accuracy | Meaning | Tally | Notes |
|-----------|---------|-------|-------|
| ACCURATE | Matches code/manifest evidence | TBD | Needs D1 verification |
| PARTIAL | Partly true, partly stale or speculative | TBD | Needs D1 verification |
| STALE | Written for superseded topology or removed tech | TBD | Needs D1 verification |
| CONTRADICTORY | Contains conflicting statements internally or vs canon | TBD | Needs D1 verification |
| UNVERIFIED | Plausible but not yet traced to evidence | TBD | Needs D1 verification |

### 1.4 Action Summary

| Action | Tally | Notes |
|--------|-------|-------|
| KEEP | TBD | Canon Tier A docs and active Tier B |
| UPDATE | TBD | Correct stale/partial docs in place |
| MERGE | TBD | Consolidate overlapping docs without destroying history |
| REPOSITION | TBD | Move retired-planning docs to archive with headers |
| ARCHIVE | TBD | Mark/Tier-C or directory move |
| SUPERSEDE | TBD | Canon doc replaces earlier doc |
| REVIEW | TBD | Insufficient evidence yet |

---

## 2. DOCUMENT TABLE

Table columns:

- row
- document path
- current subject
- lifecycle
- accuracy
- canonical owner
- action
- replacement/target
- notes

Notes:
- `_archive` and `archive/workspace_backups` rows are mostly lineage; their rows are present for audit completeness.
- `HISTORICAL` applies to documented supersession or phase-complete claims.
- `UNKNOWN` applies when evidence is absent or contradictory.

### 2.1 Root / Workspace Top-Level

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 1 | README.md | Repo overview, surfaces, architecture pointers | MIGRATING | PARTIAL | docs/architecture/PRODUCT_ARCHITECTURE.md + AGENTS.md | UPDATE | docs/README.md | Contains merge-conflict markers and stale Supabase references. |
| 2 | AGENTS.md | Codebase agent protocol, decisions, bindings | CURRENT | PARTIAL | Nirmal + Hermes | KEEP/UPDATE | Keep current; document assumes supersession where conflicts exist. | README treats architecture source as integratewise-ai-workspace. |
| 3 | OPTION_B_BRANCH_DIVERGENCE_AUDIT.md | Wave 0 gateway decoupling audit | CURRENT | ACCURATE | Hermes | KEEP | — | Evidence-only audit artifact. |
| 4 | OPTION_B_WAVE0_LOG.md | Wave 0 completion log | CURRENT | UNVERIFIED | Option B wave workstream | REVIEW | — | Header says Wave 0 completion. Must not be treated as platform activation completion. |
| 5 | ENTERPRISE_ARCHITECTURE.md | Enterprise architecture narrative | MIGRATING | STALE | Platform | REPOSITION | docs/architecture/ or archive | Likely superseded by docs/platform-specs/ and Tier A canon. |
| 6 | ARCHITECTURE.md | Architecture narrative | MIGRATING | STALE | Platform | REPOSITION | docs/PLATFORM.md or docs/ARCHITECTURE.md | Likely superseded by Tier A canon. |
| 7 | ARCHITECTURE_DIAGRAMS.md | Architecture diagrams | HISTORICAL | STALE | Platform | ARCHIVE | docs/archive/ or point to canonical diagram docs | Older diagram set, likely duplicates canonical artifacts. |
| 8 | CODEBASE_REVIEW.md | Codebase review narrative | MIGRATING | PARTIAL | Platform | UPDATE or ARCHIVE | — | If audit claims are not reproduced in current repo, mark historical. |
| 9 | MERGE_SUMMARY.md | Merge summary | HISTORICAL | PARTIAL | Platform | REPOSITION | — | Point-in-time merge record. |
| 10 | ONBOARDING_API_CONTRACT.md | Onboarding API contract | MIGRATING | PARTIAL | Product/Platform | UPDATE | — | Depends on whether contract is current or superseded. |
| 11 | API_ROUTES_CONSOLIDATION_REPORT.md | API consolidation report | MIGRATING | PARTIAL | Platform | REVIEW | — | Depends on whether routes are still valid post-Option B. |
| 12 | API_ROUTES_MAPPING.md | API routes mapping | HISTORICAL | STALE | Platform | REPOSITION | docs/internal/operations/ENDPOINT_MAP.md or archive | Likely superseded by endpoint map. |
| 13 | PIN_DISCOVERY_AND_WIRING_MAP.md | Pin discovery and wiring | MIGRATING | PARTIAL | Platform | REVIEW | — | Must not claim production readiness without verification. |
| 14 | QUICKSTART_PREVIEW_AND_TESTS.md | Quickstart and tests | HISTORICAL | STALE | Platform | REPOSITION | — | Name implies verified readiness; verify evidence. |
| 15 | REPOSITION_MAP.md | Reposition map | MIGRATING | PARTIAL | Platform | REVIEW | — | Likely superseded or merged into architecture docs. |
| 16 | REPOSITORY_ALIGNMENT.md | Repository alignment | HISTORICAL | PARTIAL | Platform | REPOSITION | — | Alignment snapshots become evidence, not truth. |
| 17 | REPO_CLEANUP_AUDIT.md | Repository cleanup audit | HISTORICAL | PARTIAL | Platform | REVIEW | — | Cleanup older than current Option B state. |
| 18 | REPO_STATE_AUDIT.md | Repository state audit | HISTORICAL | PARTIAL | Platform | REVIEW | — | Superseded by more recent audits. |
| 19 | WIRING_ROADMAP.md | Wiring roadmap | HISTORICAL | PARTIAL | Platform | REPOSITION | docs/platform-specs or archive | Keep as roadmap evidence and update if still relevant. |

### 2.2 Apps Documentation

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 20 | apps/workspace/README.md | Workspace app documents | CURRENT | UNVERIFIED | Product | REVIEW | — | Must determine if apps/workspace or apps/web hosts L1 workbench. |
| 21 | apps/workspace/PORT_REPORT.md | Port report | HISTORICAL | PARTIAL | Product | ARCHIVE | — | Port/discovery snapshot; keep as evidence. |
| 22 | apps/workspace/MIGRATION_PLAN.md | Workspace migration plan | HISTORICAL | STALE | Product | REPOSITION | — | Superseded by Option B or later plan. |

### 2.3 Packages Documentation

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 23 | packages/analytics/README.md | Analytics package | CURRENT | UNVERIFIED | Platform | REVIEW | — | Verify publication status and module purpose. |
| 24 | packages/coda-pack/README.md | Coda pack | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 25 | packages/connectors/README.md | Connectors package | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 26 | packages/db/README.md | DB helpers | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 27 | packages/hermes-spine-memory/README.md | Hermes spine memory | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 28 | packages/hermes-spine-memory/COUCHDB_SETUP.md | CouchDB setup | HISTORICAL | STALE | Platform | ARCHIVE | — | Contradicts DECISION 22 if claiming product use. |
| 29 | packages/hermes-spine-memory/TWIN_MEMORY_ROUTING.md | Twin memory routing | MIGRATING | PARTIAL | Platform | REVIEW | — | |
| 30 | packages/integration-tests/README.md | Integration tests package | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 31 | packages/knowledge-bank-ui/README.md | Knowledge bank UI | CURRENT | UNVERIFIED | Product | REVIEW | — | |
| 32 | packages/tenancy/README.md | Tenancy package | CURRENT | UNVERIFIED | Platform | REVIEW | — | |

### 2.4 docs/ Root-level Documents

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 33 | docs/FEATURE_MAP.md | Feature mapping | CURRENT | PARTIAL | Tier A canon | UPDATE | Keep as Tier A canonical index artifact | May map older layer model as current. |
| 34 | docs/CANON.md | Canon doc map and tiers | CURRENT | ACCURATE | Tier A canon | KEEP | — | Strong index; must reconcile with new canon set. |
| 35 | docs/CANONICAL_STATE.md | Canonical launch state | CURRENT | UNVERIFIED | Tier A canon | REVIEW | — |active state must be verified against runtime evidence. |
| 36 | docs/FINAL_E2E_SYSTEM.md | Master end-to-end system contract | CURRENT | PARTIAL | Tier A canon | REVIEW | — | Contradictions likely due to overlapping generations. |
| 37 | docs/OODA-ARCHITECTURE.md | OODA-based architecture | MIGRATING | CONTRADICTORY | Platform/Product | REVIEW | — | Likely conflicts with canonical Product grammar. |
| 38 | docs/AI_INTEGRATION.md | AI integration narrative | MIGRATING | PARTIAL | Product/Platform | REVIEW | — | |
| 39 | docs/CURSOR_MODELS.md | Cursor model references | PROPOSED / UNKNOWN | UNVERIFIED | Tooling | REVIEW | — | Tool-specific content; unclear if maintained. |
| 40 | docs/FOLDER_MONITOR_SETUP.md | Folder monitor setup | HISTORICAL | PARTIAL | Product | REPOSITION | docs/internal or archive | |
| 41 | docs/plan.md | Planning artifact | PROPOSED | UNVERIFIED | Product/Platform | REVIEW | — | Likely transient planning doc. |

### 2.5 docs/architecture/

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 42 | docs/architecture/PRODUCT_ARCHITECTURE.md | Product front door | CURRENT | PARTIAL | Tier A canon | UPDATE | docs/PRODUCT.md | Tier A canon; must align with L1 doctrine. |
| 43 | docs/architecture/WORKBENCH_DOCTRINE.md | Workbench doctrine | CURRENT | PARTIAL | Tier A canon | UPDATE | docs/L1-WORKBENCH.md | Tier A canon; must eliminate L2 separate navigation. |
| 44 | docs/architecture/PROJECTION_MODEL.md | Projection model | CURRENT | PARTIAL | Tier A canon | UPDATE | docs/PLATFORM.md/PROJECTION section | Projection semantics present but need plateau/state classification. |
| 45 | docs/architecture/SPINE_MODEL.md | Spine data model | CURRENT | PARTIAL | Tier A canon | UPDATE | docs/SPINE.md | Must separate canonical write authority from completed/implemented claim. |
| 46 | docs/architecture/END_TO_END_ARCHITECTURE.md | End-to-end systems view | MIGRATING | CONTRADICTORY | Platform/Product | REVIEW | — | Likely mixes L1 and L2+. |
| 47 | docs/architecture/SPINE_DOMAIN.md | Spine domain semantics | CURRENT | PARTIAL | Platform | REVIEW | — | |
| 48 | docs/architecture/SPINE_INTELLIGENCE_AGENT.md | Spine intelligence agent semantics | MIGRATING | PARTIAL | Platform | REVIEW | — | |
| 49 | docs/architecture/ONBOARDING_FLOW.md | Onboarding flow | CURRENT | PARTIAL | Product | REVIEW | — | May conflate onboarding flow with activation completion. |
| 50 | docs/architecture/USER_SYSTEM_JOURNEY_BLUEPRINT.md | Layers and stages | HISTORICAL | STALE | Platform | REPOSITION | — | Seven-layer / eight-stage model; historical lineage only. |
| 51 | docs/architecture/CURRENT_CONTEXT_FLOW.md | Current context flow | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 52 | docs/architecture/DETAILED_USER_FLOWS_AND_SYSTEM_PATHS.md | Detailed flows | CURRENT | UNVERIFIED | Product/Platform | REVIEW | — | |
| 53 | docs/architecture/FRONTEND_LAYERED_STACK.md | Frontend layer stack | MIGRATING | STALE | Product | REPOSITION | — | Separate products by layer likely invalid. |
| 54 | docs/architecture/PROJECTION_CONTEXT_REFACTOR.md | Projection refactor | PROPOSED | UNVERIFIED | Platform | REVIEW | — | Likely transient or superseded. |
| 55 | docs/architecture/SINGLE_END_TO_END_MAP.md | Single E2E map | MIGRATING | PARTIAL | Platform | REVIEW | — | Unclear if verified end-to-end. |
| 56 | docs/architecture/CONNECTOR_RUNTIME_PROOF.md | Connector runtime proof | CURRENT | PARTIAL | Platform | REVIEW | — | Clarity on runtime vs. operational verification needed. |
| 57 | docs/architecture/final-e2e-system.md | Final E2E system | MIGRATING | CONTRADICTORY | Platform | REVIEW | — | May claim operational completeness without evidence. |
| 58 | docs/architecture/integratewise-architecture-v2.0.md | Architecture v2.0 | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 59 | docs/architecture/l1-reality-check.md | L1 reality check | CURRENT | CONTRADICTORY | Product/Platform | REVIEW | — | L1 is canonical; must validate claims. |
| 60 | docs/architecture/locked-v1.md | Locked v1 docs | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 61 | docs/architecture/locked-v1.0.1.md | Locked v1.0.1 docs | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 62 | docs/architecture/one-full-prompt.md | Prompt doc | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 63 | docs/architecture/reality-audit.md | Reality audit | CURRENT | PARTIAL | Platform | REVIEW | — | May diverge from current audit conclusions. |
| 64 | docs/architecture/suite-00-34.md | Platform specs suite summary | CURRENT | PARTIAL | Platform | REVIEW | — | Must cross-check against platform spec index. |
| 65 | docs/architecture/v2-capability-layer.md | Capability layer | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 66 | docs/architecture/v2-continuity-governance.md | Continuity/governance doc | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 67 | docs/architecture/v2-data-model.md | Data model | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 68 | docs/architecture/v2-deployment.md | Deployment doc | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 69 | docs/architecture/v2-ecosystem.md | Ecosystem doc | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 70 | docs/architecture/v2-identity-ingress.md | Identity/ingress doc | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 71 | docs/architecture/v2-provider-fabric.md | Provider fabric | HISTORICAL | STALE | Platform | REPOSITION | — | |
| 72 | docs/architecture/v2-security.md | Security doc | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |

### 2.6 docs/ip/

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 73 | docs/ip/ARCHITECTURE_AND_DATA_FLOW.md | Architecture and data flow | HISTORICAL | STALE | Platform | ARCHIVE | — | Banner assumed; preserve evidence. |
| 74 | docs/ip/ARCHITECTURE_CANONICAL.md | Canonical architecture snapshot | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 75 | docs/ip/ARCHITECTURE_INDEX.md | Architecture index | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 76 | docs/ip/ARCHITECTURE_REVIEW.md | Architecture review | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 77 | docs/ip/ARCHITECTURE_UPDATE_2026-06-09.md | Architecture update snapshot | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 78 | docs/ip/ARCHITECTURE_V2.md | Architecture V2 | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 79 | docs/ip/DEEP_CODE_ANALYSIS_COMPLETE_SYSTEM_FLOW.md | Deep code analysis | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 80 | docs/ip/DOCTRINE.md | Doctrine | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 81 | docs/ip/FRONTEND_LAYER_MAP.md | Frontend layer map | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 82 | docs/ip/HERMES_CONTINUITY_CONSTITUTION.md | Hermes continuity constitution | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 83 | docs/ip/OPERATOR_LOOP_DOCTRINE.md | Operator loop doctrine | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 84 | docs/ip/OPS_ECOSYSTEM_DOCTRINE.md | Ops ecosystem doctrine | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 85 | docs/ip/PARALLEL_CONTINUITY_ORCHESTRATION.md | Parallel continuity orchestration doc | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 86 | docs/ip/PER_USER_VIEW.md | Per-user view | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 87 | docs/ip/POSITIONING_AND_PRODUCT_CONTEXT.md | Positioning and product context | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 88 | docs/ip/PRD_BACKEND_DEVELOPMENT.md | PRD backend development | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 89 | docs/ip/PRODUCT_PILLARS.md | Product pillars | HISTORICAL | PARTIAL | Product | ARCHIVE | — | |
| 90 | docs/ip/README_ARCHITECTURE_2.0.md | Architecture README | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 91 | docs/ip/SECONDARY_MAC_NODE_PLAN.md | Secondary mac/node plan | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 92 | docs/ip/SELF_DEMONSTRATION_DOCTRINE.md | Self demonstration doctrine | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 93 | docs/ip/USER_FLOW_AND_VIEWS.md | User flow and views | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |

### 2.7 docs/ip/tech/

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 94 | docs/ip/tech/ACCOUNT_SUCCESS_FLOW_TRACE.md | Account success flow trace | HISTORICAL | PARTIAL | Product | ARCHIVE | — | Department-specific flow; historical reference only. |
| 95 | docs/ip/tech/ACTION_COMPLETION_ARCHITECTURE.md | Action completion architecture | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 96 | docs/ip/tech/ARCHITECTURE_DECISIONS.md | Architecture decisions | HISTORICAL | PARTIAL | Platform | REPOSITION | ADR discipline should centralize decisions | |
| 97 | docs/ip/tech/AUTH_MIGRATION_DESIGN.md | Auth migration design | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 98 | docs/ip/tech/CANONICAL_TAXONOMY.md | Canonical taxonomy | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 99 | docs/ip/tech/CLOUDFLARE_ZERO_TRUST_TWIN_OPENWEBUI_PROVISIONING.md | OpenWebUI provisioning doc | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Contradicts Cloudflare-only Twin if still proposing OpenWebUI. |
| 100 | docs/ip/tech/CONTINUITY_BRIDGE_DEPLOYMENT_STATUS.md | Continuity bridge deployment status | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 101 | docs/ip/tech/DATA_ACCESS_PATTERNS.md | Data access patterns | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 102 | docs/ip/tech/DOCS_PUBLICATION_PIPELINE.md | Docs publication pipeline | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 103 | docs/ip/tech/ENTITY_360_TWIN_TRIGGER_SCORING_GUARDRAILS.md | Entity 360 guardrails | HISTORICAL | PARTIAL | Product/Platform | ARCHIVE | — | |
| 104 | docs/ip/tech/ENTITY_BINDING_AND_RELATIONSHIPS.md | Entity binding and relationships | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 105 | docs/ip/tech/ENTITY_DEDUP_AND_IDENTITY_RESOLUTION.md | Entity dedup and identity resolution | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 106 | docs/ip/tech/ENTITY_INVENTORY.md | Entity inventory | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 107 | docs/ip/tech/FIELD_INVENTORY_AND_HUMAN_COGNITION.md | Field inventory | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 108 | docs/ip/tech/FIREBASE_ARCHITECTURE_SPEC.md | Firebase architecture spec | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Should not coexist as current with Cloudflare-only doctrine. |
| 109 | docs/ip/tech/FLOW_C_AI_MEMORY_AND_TRIAGE.md | Flow C and triage spec | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 110 | docs/ip/tech/FLOW_TRACE_AND_BIZOPS_STEPS.md | Flow trace and BizoPS steps | HISTORICAL | PARTIAL | Product | ARCHIVE | — | |
| 111 | docs/ip/tech/INGESTION_AND_AGENT_PIPELINE.md | Ingestion and agent pipeline | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 112 | docs/ip/tech/INTEGRATEWISE_ARCHITECTURE_REAL.md | Architecture real snapshot | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 113 | docs/ip/tech/INTEGRATEWISE_CANONICAL_ARCHITECTURE.md | Canonical architecture snapshot | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 114 | docs/ip/tech/INTEGRATEWISE_PRODUCT_ARCHITECTURE.md | Product architecture snapshot | HISTORICAL | PARTIAL | Product | ARCHIVE | — | |
| 115 | docs/ip/tech/INTEGRATEWISE_SYSTEM_OVERVIEW.md | System overview | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 116 | docs/ip/tech/L2_TWIN_SURFACE_CONTRACT.md | L2 twin surface contract | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Asserts L2 separate surface; conflicts with L1-only product. |
| 117 | docs/ip/tech/LAYER_OWNERSHIP_AND_TWIN_RUNTIME.md | Layer ownership and twin runtime | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 118 | docs/ip/tech/MCP_ADK_ROUTING_SPINE_MEMORY_ARCHITECTURE.md | MCP/ADK/Spine memory architecture | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Must verify current MCP role before revisiting. |
| 119 | docs/ip/tech/MCP_OAUTH_ARCHITECTURE.md | MCP OAuth architecture | MIGRATING | PARTIAL | Platform | REVIEW | — | Keep current only if OAuth flow is current. |
| 120 | docs/ip/tech/MCP_SETUP_COMPLETE.md | MCP setup complete doc | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 121 | docs/ip/tech/POST_CLEANUP_SYSTEM_REPORT.md | Post-cleanup report | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 122 | docs/ip/tech/SCHEMA_ENHANCEMENT.md | Schema enhancement doc | MIGRATING | PARTIAL | Platform | REVIEW | — | |
| 123 | docs/ip/tech/SPINE_TO_TWIN_BOUNDARY.md | Spine-to-twin boundary | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 124 | docs/ip/tech/SYSTEM_DATA_FLOW_AND_TWIN_ACTIVATION.md | System data flow and twin activation | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 125 | docs/ip/tech/SYSTEM_FLOW_DEFINITIVE.md | Definitive system flow | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 126 | docs/ip/tech/TRIAGE_BOT_SPEC.md | Triage bot spec | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 127 | docs/ip/tech/TWIN_AS_COGNITIVE_ORCHESTRATOR.md | Twin orchestrator doc | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Hermes may be canonical cognitive runtime; doc must not claim Twin as canonical orchestrator. |
| 128 | docs/ip/tech/TWIN_BROWSER_EXECUTION.md | Twin browser execution doc | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 129 | docs/ip/tech/TWIN_VOICE_INTERFACE.md | Twin voice interface doc | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 130 | docs/ip/tech/workbench-master-plan.md | Workbench master plan | HISTORICAL | PARTIAL | Product | ARCHIVE | — | |
| 131 | docs/ip/tech/integratewise-live.code-workspace | Workspace file | UNKNOWN | UNKNOWN | Tooling | REVIEW | — | |

### 2.8 docs/platform-specs/

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 132 | docs/platform-specs/_MASTER_INDEX.md | Platform master index | CURRENT | ACCURATE | Platform | KEEP | — | Strong index of platform spec set. |
| 133 | docs/platform-specs/_core-features.md | Core features summary | CURRENT | ACCURATE | Platform | KEEP | — | Supports Tier A canon. |
| 134 | docs/platform-specs/_doctrine-and-sales-narrative.md | Doctrine and sales narrative | CURRENT | ACCURATE | Platform/Product | KEEP | — | In scope because doctrine is canonical. |
| 135 | docs/platform-specs/00-vision-doctrine.md | Vision doctrine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 136 | docs/platform-specs/01-platform-architecture.md | Platform architecture | CURRENT | ACCURATE | Platform | KEEP | — | |
| 137 | docs/platform-specs/02-operational-spine-canonical-highest-priority.md | Operational spine highest-priority doc | CURRENT | ACCURATE | Platform/SPINE | KEEP | — | |
| 138 | docs/platform-specs/03-workspace-runtime.md | Workspace runtime | CURRENT | ACCURATE | Platform | KEEP | — | |
| 139 | docs/platform-specs/04-projection-engine.md | Projection engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 140 | docs/platform-specs/05-capability-fabric.md | Capability fabric | CURRENT | ACCURATE | Platform | KEEP | — | |
| 141 | docs/platform-specs/06-twin-runtime.md | Twin runtime | CURRENT | ACCURATE | Platform | KEEP | — | |
| 142 | docs/platform-specs/07-memory-system.md | Memory system | CURRENT | ACCURATE | Platform | KEEP | — | |
| 143 | docs/platform-specs/08-connector-framework.md | Connector framework | CURRENT | ACCURATE | Platform | KEEP | — | |
| 144 | docs/platform-specs/09-governance-engine.md | Governance engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 145 | docs/platform-specs/10-signal-engine.md | Signal engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 146 | docs/platform-specs/11-workflow-engine.md | Workflow engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 147 | docs/platform-specs/12-entity-framework.md | Entity framework | CURRENT | ACCURATE | Platform | KEEP | — | |
| 148 | docs/platform-specs/13-marketplace-onboarding-and-persona-architecture.md | Marketplace and onboarding/persona doc | TARGET | ACCURATE | Platform/Product | KEEP | — | TARGET persona doc. |
| 149 | docs/platform-specs/13-marketplace.md | Marketplace doc | TARGET | ACCURATE | Platform/Product | KEEP | — | TARGET/TARGET sibling. |
| 150 | docs/platform-specs/14-security-architecture.md | Security architecture | CURRENT | ACCURATE | Platform | KEEP | — | |
| 151 | docs/platform-specs/15-deployment-architecture.md | Deployment architecture | CURRENT | ACCURATE | Platform | KEEP | — | |
| 152 | docs/platform-specs/16-observability.md | Observability | CURRENT | ACCURATE | Platform | KEEP | — | |
| 153 | docs/platform-specs/17-sdks.md | SDKs | CURRENT | ACCURATE | Platform | KEEP | — | |
| 154 | docs/platform-specs/18-ui-design-system.md | UI design system | TARGET | ACCURATE | Product | KEEP | — | |
| 155 | docs/platform-specs/19-api-contracts.md | API contracts | CURRENT | ACCURATE | Platform | KEEP | — | |
| 156 | docs/platform-specs/20-operations-runbooks.md | Operations runbooks | CURRENT | ACCURATE | Platform | KEEP | — | |
| 157 | docs/platform-specs/21-business-ontology-foundational-the-largest-remaining-gap.md | Business ontology gap doc | CURRENT/UNKNOWN | PARTIAL | Platform | REVIEW | — | Confirm whether ontology is implemented. |
| 158 | docs/platform-specs/22-ai-model-runtime.md | AI model runtime | CURRENT | ACCURATE | Platform | KEEP | — | |
| 159 | docs/platform-specs/23-agent-runtime.md | Agent runtime | CURRENT | ACCURATE | Platform | KEEP | — | |
| 160 | docs/platform-specs/24-integration-manager.md | Integration manager | CURRENT | ACCURATE | Platform | KEEP | — | |
| 161 | docs/platform-specs/25-continuity-engine.md | Continuity engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 162 | docs/platform-specs/26-search-engine.md | Search engine | CURRENT | ACCURATE | Platform | KEEP | — | |
| 163 | docs/platform-specs/27-data-pipeline.md | Data pipeline | CURRENT | ACCURATE | Platform | KEEP | — | |
| 164 | docs/platform-specs/28-identity-platform.md | Identity platform | CURRENT | ACCURATE | Platform | KEEP | — | |
| 165 | docs/platform-specs/29-billing-platform.md | Billing platform | CURRENT | ACCURATE | Platform | KEEP | — | |
| 166 | docs/platform-specs/30-operational-metrics.md | Operational metrics | CURRENT | ACCURATE | Platform | KEEP | — | |
| 167 | docs/platform-specs/31-evolution-strategy.md | Evolution strategy | CURRENT | ACCURATE | Platform | KEEP | — | |
| 168 | docs/platform-specs/32-plugin-runtime.md | Plugin runtime | CURRENT | ACCURATE | Platform | KEEP | — | |
| 169 | docs/platform-specs/33-testing-architecture.md | Testing architecture | CURRENT | ACCURATE | Platform | KEEP | — | |
| 170 | docs/platform-specs/34-system-lifecycle.md | System lifecycle | CURRENT | ACCURATE | Platform | KEEP | — | |

### 2.9 docs/products, public, migrations, operations

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 171 | docs/migrations/DE_SUPABASE_MIGRATION.md | Supabase migration tracker | CURRENT | ACCURATE | Platform | KEEP | docs/MIGRATION-STATE.md | Tier A canon migration tracker. |
| 172 | docs/operations/DEPLOYMENT_RUNBOOK.md | Deployment runbook | CURRENT | PARTIAL | Platform | REVIEW | — | Must reflect current Cloudflare-only deployment state. |
| 173 | docs/operations/TEST_STRATEGY.md | Test strategy | CURRENT | PARTIAL | Platform | REVIEW | — | |
| 174 | docs/public/README.md | Public docs README | CURRENT | PARTIAL | Product | REVIEW | — | |
| 175 | docs/public/design/* | Public design specs | TARGET | PARTIAL | Product | KEEP | — | Target product assets. |
| 176 | docs/public/gtm/* | GTM docs | TARGET | PARTIAL | Product | KEEP | — | Target product assets. |
| 177 | docs/public/product/* | Product marketing/spec docs | TARGET | PARTIAL | Product | KEEP | — | Target product assets. |
| 178 | docs/public/strategy/* | Strategy docs | TARGET | PARTIAL | Product | KEEP | — | Target product assets. |
| 179 | docs/archive/.FINAL_STATUS.md | Final status snapshot | HISTORICAL | STALE | Platform | ARCHIVE | — | Must not be treated as current status. |
| 180 | docs/archive/.THREE_PILLARS_STATUS.md | Three pillars status | HISTORICAL | STALE | Platform | ARCHIVE | — | |

### 2.10 docs/internal/

| row | Document | Subject | Lifecycle | Accuracy | Owner | Action | Target | Notes |
|-----|----------|---------|-----------|----------|-------|--------|--------|-------|
| 181 | docs/internal/MCP_SETUP_COMPLETE.md | MCP setup complete | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 182 | docs/internal/ONBOARDING_CONNECTORS_FIX_SUMMARY.md | Onboarding connectors fix | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 183 | docs/internal/operations/API_REFERENCE.md | API reference | HISTORICAL | PARTIAL | Platform | REPOSITION | — | |
| 184 | docs/internal/operations/CF_WIRE_STATUS.md | CF wire status | CURRENT | PARTIAL | Platform | REVIEW | — | Likely stale if last updated pre-Option B. |
| 185 | docs/internal/operations/CHANGE_MANIFEST_FOR_LIVE_REPO.md | Change manifest | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 186 | docs/internal/operations/CONSOLIDATION_2026-05-12.md | Consolidation summary | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 187 | docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md | Customer Zero flow test | CURRENT | PARTIAL | Platform/Product | REVIEW | — | Must not represent platform activation without evidence. |
| 188 | docs/internal/operations/DEPLOYMENT_GUIDE.md | Deployment guide | CURRENT | PARTIAL | Platform | REVIEW | — | |
| 189 | docs/internal/operations/DEVELOPER_ONBOARDING.md | Developer onboarding | CURRENT | PARTIAL | Platform | REVIEW | — | |
| 190 | docs/internal/operations/DOMAIN_CLEANUP_PLAN.md | Domain cleanup plan | HISTORICAL | STALE | Platform | ARCHIVE | — | |
| 191 | docs/internal/operations/ENDPOINT_MAP.md | Endpoint map | CURRENT | ACCURATE | Platform | KEEP | — | Active operational reference. |
| 192 | docs/internal/operations/HANDOVER_2026-05-28-FINAL.md | Handover doc | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 193 | docs/internal/operations/HANDOVER_2026-05-28.md | Handover doc | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 194 | docs/internal/operations/ONBOARDING_TO_SYNC_SPECIFICATION.md | Onboarding sync spec | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 195 | docs/internal/operations/OPERATIONAL_STATE.md | Operational state snapshot | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 196 | docs/internal/operations/PARENT_REPOSITORIES_ROLES.md | Repo roles doc | CURRENT | ACCURATE | Platform | KEEP | — | Clarifies integratewise-ai-workspace vs integratewise-live. |
| 197 | docs/internal/operations/TASK_REGISTRY.md | Task registry | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 198 | docs/internal/operations/UI_DEFECT_AND_REORG_PLAN.md | UI defect and reorg plan | HISTORICAL | PARTIAL | Product | ARCHIVE | — | |
| 199 | docs/internal/operations/VERIFICATION_ACCOUNT_SUCCESS_AND_BIZOPS.md | Verification doc | HISTORICAL | PARTIAL | Platform/Product | ARCHIVE | — | |
| 200 | docs/internal/playbooks/README.md | Playbooks README | CURRENT | ACCURATE | Platform | KEEP | — | Active operational playbook directory. |
| 201 | docs/internal/playbooks/connector-go-live.md | Connector go-live runbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 202 | docs/internal/playbooks/release-readiness.md | Release readiness playbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 203 | docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md | Tenant onboarding playbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 204 | docs/internal/promotions/ARCHITECTURE_ALIGNMENT_v1.1.md | Architecture alignment promo | HISTORICAL | STALE | Platform | ARCHIVE | — | Version snapshot; no longer canonical. |
| 205 | docs/internal/runbooks/README.md | Runbooks README | CURRENT | ACCURATE | Platform | KEEP | — | |
| 206 | docs/internal/runbooks/connector-oauth-troubleshooting.md | Connector OAuth troubleshooting | CURRENT | ACCURATE | Platform | KEEP | — | |
| 207 | docs/internal/runbooks/data-recovery.md | Data recovery runbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 208 | docs/internal/runbooks/deployment-and-rollback.md | Deployment/rollback runbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 209 | docs/internal/runbooks/incident-response.md | Incident response runbook | CURRENT | ACCURATE | Platform | KEEP | — | |
| 210 | docs/internal/runbooks/sync-failure-and-dlq-redrive.md | Sync failure/DLQ redrive | CURRENT | ACCURATE | Platform | KEEP | — | |
| 211 | docs/internal/status/ADMIN_DASHBOARD_STATUS.md | Admin status snapshot | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 212 | docs/internal/status/ADMIN_DASHBOARD_SUMMARY.md | Admin dashboard summary | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 213 | docs/internal/status/AGENT_SESSION_NOTES.md | Agent session notes | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 214 | docs/internal/status/AI_SEARCH_RAG_INTEGRATION.md | AI search/RAG integration | CURRENT | UNVERIFIED | Platform | REVIEW | — | |
| 215 | docs/internal/status/API_KEYS_STATUS.md | API keys status | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 216 | docs/internal/status/L05_OPERATING_LAYER_WIRING_PLAN.md | Operating layer wiring plan | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 217 | docs/internal/status/L05_PHASE1_DEPLOYMENT_READY.md | L05 Phase1 deployment ready | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | Naming claims readiness; preserve evidence only. |
| 218 | docs/internal/status/L05_PHASE1_DEPLOYMENT_SUMMARY.md | L05 Phase1 summary | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 219 | docs/internal/status/L05_PHASE2_COMPLETE.md | L05 Phase2 complete | HISTORICAL | CONTRADICTORY | Platform | ARCHIVE | — | |
| 220 | docs/internal/status/L05_PHASE2_DEPLOYMENT_SUMMARY.md | L05 Phase2 summary | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 221 | docs/internal/status/L05_PHASE2_QUEUE_WIRING.md | L05 Phase2 queue wiring | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 222 | docs/internal/status/L05_STATUS.md | L05 status snapshot | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 223 | docs/internal/status/LANGUAGE_CONSISTENCY_STATUS.md | Language consistency status | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |
| 224 | docs/internal/status/MCP_QUICK_START.md | MCP quick start | HISTORICAL | PARTIAL | Platform | ARCHIVE | — | |

## 3. PACKAGE AND SERVICE DOCUMENTATION CLUSTERS

| Document Cluster | Lifecycle | Notes |
|------------------|-----------|-------|
| package READMEs | CURRENT / UNKNOWN | Each package README should be reviewed for stale/current claims. |
| service wrangler.toml files | CURRENT | Worker bindings/routes are authoritative for runtime topology, not docs alone. |
| service README files | CURRENT / UNKNOWN | Few docs exist under services/*/README; expand/update as needed. |
| Packages `config-backup-*`, `lib-backup-*`, `types-backup-*` | UNKNOWN | Must be classified KEEP, MERGE, REPOSITION, or ARCHIVE. Avoid duplicate truth. |

## 4. ARCHIVE AND BACKUP CLUSTERS

| Cluster | Recommended Action |
|---------|--------------------|
| `_archive/workspace_backups/` | PRUNE or archive stripped backup copies. Do not maintain two truth sources. |
| `archive/` | Keep marked as HISTORICAL/Tier C. |
| `_archive/` | Keep marked as HISTORICAL/Tier C. |
| `reference/frontend-consolidated/` | Keep as historical consolidation evidence only. |

---

## 5. NEXT ACTIONS REQUIRED

1. Compute accurate accuracy/action tallies in D1 contradiction map.
2. Create `docs/README.md` as canonical documentation entry point.
3. Update README.md merge markers and Supabase references.
4. Reposition or archive `docs/ip/**` and Tier C histortical clusters.
5. Create canonical docs per task 19 targets.
6. Update root README last, per D7.
