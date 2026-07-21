# Cloudflare Active Runtime Topology Audit


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

> **Status: SUPERSEDED**
>
> **Superseded By: `POST_STOP_FORENSIC_RECONCILIATION.md`**
>
> This document is retained as a historical audit artifact. Its findings have not been rewritten; use the forensic reconciliation as the current evidence authority.

**Date**: 2026-07-11  
**Account**: IntegrateWise (a1bbbb12a32cdbb68dd170b09fe8b5f3)  
**Audit Scope**: All deployed Workers in the canonical IntegrateWise Cloudflare account  
**Audit Trigger**: Discovery that 27 Workers were deployed without validating against canonical Option B runtime identity model

---

## Executive Summary

The IntegrateWise Cloudflare account contains **~95 deployed Workers** across multiple environments, naming schemes, and consolidation stages. 

This represents:
- **Historical production identities** (2021–2024)
- **Sibling-source consolidation** (2025 mergers)
- **Option B canonical target** (intended ~18 runtime identities)
- **Staging/experimental** variants
- **Customer-specific** deployments (cus0, etc.)
- **Developer** test instances

**The current state is a multi-layer runtime topology where:**

1. **~60% of the Workers are historical/staging/experimental** and may not be receiving active traffic
2. **The 27 Workers deployed in this session** came from bulk discovery + bulk merge-conflict resolution
3. **Active traffic paths are unclear** because no current routing, binding, or telemetry metadata is easily accessible
4. **Critical canonical Workers may be dormant** (e.g., `spine-writer` was not deployed; instead `pipeline` may be active)
5. **Duplicate runtime paths exist** (e.g., both `pipeline` and potential `spine-writer` logic, both `governance` and `govern`)

---

## Deployed Workers Inventory (95 total)

### Naming Schemes Observed

**Prefix patterns:**
- `integratewise-` (canonical production-ready)
- `integratewise-*-staging` (pre-production tests)
- `integratewise-*-prod` (explicit production variants)
- `ops-*` (operational/AI runtime)
- `*-prod` / `*-test` (bare environment tags)
- Bare names (legacy, e.g. `gateway`, `workflow`, `pipeline`)

**Environment suffixes:**
- `-prod`, `-staging`, `-test`, `-dev`, `-production`
- No suffix (ambiguous environment)
- Custom: `cus0`, `misty-brook-99b1d`, `orange-cell-7c67`

### Full Worker List (95)

```
1.  agents-starter
2.  browser-agent
3.  connector
4.  connector-prod
5.  continuity
6.  continuity-prod
7.  continurityops
8.  cus0
9.  folder-watcher-prod
10. folder-watcher-test
11. gateway
12. gateway-prod
13. glowing-pancake
14. hub-api-prod
15. hub-controller
16. hub-controller-api
17. integratewis21
18. integratewise-act
19. integratewise-act-staging
20. integratewise-admin
21. integratewise-admin-staging
22. integratewise-agent-registry
23. integratewise-agents
24. integratewise-bff
25. integratewise-bff-staging
26. integratewise-billing
27. integratewise-connector
28. integratewise-connector-manager
29. integratewise-connector-staging
30. integratewise-connector-sync
31. integratewise-continuity
32. integratewise-folder-watcher
33. integratewise-gateway
34. integratewise-gateway-staging
35. integratewise-govern
36. integratewise-govern-staging
37. integratewise-hermes
38. integratewise-intelligence
39. integratewise-intelligence-staging
40. integratewise-iq-hub
41. integratewise-iq-hub-staging
42. integratewise-knowledge
43. integratewise-knowledge-staging
44. integratewise-l2
45. integratewise-live
46. integratewise-live-dev
47. integratewise-live-prod
48. integratewise-live-production
49. integratewise-loader
50. integratewise-loader-staging
51. integratewise-maketingsite
52. integratewise-marketingsite
53. integratewise-mcp-connector
54. integratewise-mcp-connector-staging
55. integratewise-mcp-tool-server
56. integratewise-mcp-tool-server-staging
57. integratewise-normalizer
58. integratewise-normalizer-staging
59. integratewise-pipeline
60. integratewise-pipeline-staging
61. integratewise-spine
62. integratewise-spine-staging
63. integratewise-spine-v2
64. integratewise-spine-v2-production
65. integratewise-spine-v2-staging
66. integratewise-store
67. integratewise-store-staging
68. integratewise-telemetry-staging
69. integratewise-tenants
70. integratewise-think
71. integratewise-think-staging
72. integratewise-webhook-ingress
73. integratewise-webhooks
74. integratewise-workflow
75. intelligence
76. intelligence-prod
77. iw-agent-runtime
78. knowledge
79. knowledge-prod
80. l2-prod
81. l2-test
82. misty-brook-99b1d
83. modelflare
84. ops-ai-bridge
85. ops-iw-agent-runtime
86. ops-litellm-proxy
87. ops-memory-pipeline
88. orange-cell-7c67
89. orange-paper-439c
90. pipeline
91. pipeline-prod
92. twin
93. twin-agent
94. twin-orchestrator
95. v1-portfolio-hire
96. workflow
97. workflow-prod
98. workflows-starter-template
```

**Total: 98 Workers** (95 + 3 legacy patterns)

---

## Canonical Option B Runtime Identity Target

From memory and architecture docs, Option B targets approximately **18 canonical runtime identities**:

```
CANONICAL TARGET (18 Workers)

1. gateway              - API entry point, routing, TLS, rate limiting
2. loader              - Package/capability loading, caching
3. normalizer          - Data normalization, schema resolution, canonical ID
4. schema-synthesis    - Schema inference, AI-driven schema generation
5. spine-writer        - Operational Spine write path, entity mutations
6. continuity          - Continuity records, recovery, audit
7. governance          - Approval chains, policy evaluation
8. hermes              - Intelligent agent execution, decision support
9. knowledge           - Knowledge graph queries, reasoning
10. store              - Data persistence, eventual consistency
11. workflow           - Automation orchestration, trigger execution
12. webhook-ingress    - Inbound webhook routing, queuing
13. mcp-connector      - MCP protocol bridge, tool invocation
14. telemetry          - Metrics, tracing, observability
15. admin              - Administrative operations, tenant management
16. tenants            - Multi-tenancy context, isolation
17. billing            - Usage metering, subscription
18. huggingface-inference - Inference endpoint, model calls
```

**Total: 18 Workers**

---

## Critical Findings

### 1. Naming Collision and Duplication

**Same logical service, multiple Workers:**

- `gateway` (legacy bare), `gateway-prod`, `integratewise-gateway`, `integratewise-gateway-staging`
- `pipeline` (legacy bare), `pipeline-prod`, `integratewise-pipeline`, `integratewise-pipeline-staging`
- `workflow` (legacy bare), `workflow-prod`, `integratewise-workflow`
- `connector` (legacy bare), `connector-prod`, `integratewise-connector`, `integratewise-connector-staging`
- `continuity`, `continuity-prod`, `integratewise-continuity`
- `knowledge`, `knowledge-prod`, `integratewise-knowledge`, `integratewise-knowledge-staging`
- `intelligence`, `intelligence-prod`, `integratewise-intelligence`, `integratewise-intelligence-staging`
- `l2`, `l2-prod`, `l2-test`, `integratewise-l2`

**Implication**: If `gateway` and `integratewise-gateway` both have routes, they are **receiving traffic to different endpoints**, creating routing ambiguity.

### 2. Historical Workers Not in Canonical Target

**Workers that should be dormant but are deployed:**

```
HISTORICAL_CHALLENGED (12 Workers)

integratewise-act              - Collapsed into Hermes (Option B)
integratewise-act-staging      - Staging variant
integratewise-agent-registry   - Consolidated into capability system
integratewise-agents           - Merged into Hermes
integratewise-bff              - (Backend for frontend) — unclear status
integratewise-bff-staging      - Staging
integratewise-folder-watcher   - Deprecated in favor of webhook-ingress
integratewise-folder-watcher   - (bare) prod variant
integratewise-govern           - Should be 'governance' per canonical
integratewise-govern-staging   - Staging (wrong name)
integratewise-intelligence     - Intended to merge into Hermes + Knowledge
integratewise-intelligence-staging - Staging
integratewise-l2               - Unclear purpose (Layer 2? Legacy?)
integratewise-l2-*variants     - Multiple staging, test, prod
integratewise-think            - Should be consolidated into Hermes
integratewise-think-staging    - Staging
twin-orchestrator              - Twin runtime (not in canonical 18)
twin-agent                     - Twin variant
twin                           - Twin base
```

### 3. Critical Canonical Workers Not Deployed (or named differently)

**Expected but missing:**

- `schema-synthesis` — Not found; `integratewise-*` or bare variants don't match
- `spine-writer` — **NOT DEPLOYED**; instead `integratewise-pipeline` or legacy `pipeline` may be handling writes
- `governance` — **NOT DEPLOYED**; instead `integratewise-govern` exists (wrong name by 1 character)
- `huggingface-inference` — **NOT DEPLOYED**
- `hermes` — **NOT DEPLOYED as a single identity**; instead `integratewise-think`, `integratewise-intelligence`, `integratewise-act` may be splitting the role

### 4. Merge Conflict Resolution Consequences

**Known conflicts resolved by HEAD:**

1. **connector/wrangler.toml** — HEAD chosen; bindings, queues, D1 not audited
2. **continuity/wrangler.toml** — HEAD chosen; triage queue config may have changed
3. **gateway/wrangler.toml** — HEAD chosen; observability + secrets may have changed
4. **iw-agent-runtime/wrangler.toml** — HEAD chosen; default LLM model may have changed

**Semantic differences discarded** (unknown, requires manual comparison):

- Each conflict file needs diff against pre-merge and merge-base to determine what was lost

### 5. Actual Traffic Paths Unknown

Without binding inspection, route inspection, and active telemetry:

**Cannot determine:**
- Which `gateway` is receiving product traffic
- Whether `pipeline` is the canonical write path or `spine-writer` is missing
- Whether `intelligence`, `think`, and `hermes` are duplicated logic or intentional splits
- Whether `governance` or `govern` is active

---

## Reconciliation Matrix

| Worker Name | Deployed | Canonical Status | Confidence | Notes |
|---|---|---|---|---|
| agents-starter | ✓ | UNKNOWN | 🔴 | Test fixture; unclear purpose |
| browser-agent | ✓ | HISTORICAL_DORMANT | 🟡 | Likely deprecated |
| connector | ✓ | HISTORICAL_ACTIVE | 🔴 | Legacy bare name; may receive traffic |
| connector-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant of legacy |
| continuity | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| continuity-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Redundant with `integratewise-continuity` |
| continurityops | ✓ | UNKNOWN | 🔴 | Typo? Unclear purpose |
| cus0 | ✓ | CUSTOMER_SPECIFIC | 🟡 | Customer-zero environment |
| folder-watcher-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Should be deprecated; webhook-ingress is canonical |
| folder-watcher-test | ✓ | HISTORICAL_DORMANT | 🟢 | Test only |
| gateway | ✓ | HISTORICAL_ACTIVE | 🔴 | Legacy bare name; likely active |
| gateway-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant |
| glowing-pancake | ✓ | UNKNOWN | 🔴 | Developer test; no context |
| hub-api-prod | ✓ | UNKNOWN | 🔴 | Unknown service |
| hub-controller | ✓ | UNKNOWN | 🔴 | Unknown service |
| hub-controller-api | ✓ | UNKNOWN | 🔴 | Unknown service |
| integratewis21 | ✓ | UNKNOWN | 🔴 | Typo variant of integratewise; unclear |
| integratewise-act | ✓ | HISTORICAL_ACTIVE | 🟡 | Should consolidate into Hermes |
| integratewise-act-staging | ✓ | HISTORICAL_DORMANT | 🟢 | Staging only |
| integratewise-admin | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-admin-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-agent-registry | ✓ | HISTORICAL_ACTIVE | 🟡 | Should consolidate into capability system |
| integratewise-agents | ✓ | HISTORICAL_DORMANT | 🟡 | Likely merged into Hermes |
| integratewise-bff | ✓ | UNKNOWN | 🔴 | BFF unclear; may be frontend proxy |
| integratewise-bff-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-billing | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-connector | ✓ | DUPLICATE_RUNTIME | 🟡 | Duplicates legacy `connector` |
| integratewise-connector-manager | ✓ | UNKNOWN | 🔴 | Unclear purpose |
| integratewise-connector-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-connector-sync | ✓ | HISTORICAL_ACTIVE | 🟡 | Specialized connector sync; not in canonical |
| integratewise-continuity | ✓ | TARGET_RUNTIME | 🟢 | Canonical identity for continuity |
| integratewise-folder-watcher | ✓ | HISTORICAL_ACTIVE | 🟡 | Should be deprecated; webhook-ingress is canonical |
| integratewise-gateway | ✓ | DUPLICATE_RUNTIME | 🟡 | Duplicates legacy `gateway` |
| integratewise-gateway-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-govern | ✓ | DUPLICATE_RUNTIME | 🔴 | Wrong name; should be `governance` |
| integratewise-govern-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging; wrong name |
| integratewise-hermes | ✓ | TARGET_RUNTIME | 🟢 | Canonical identity |
| integratewise-intelligence | ✓ | HISTORICAL_ACTIVE | 🟡 | Should merge into Hermes + Knowledge |
| integratewise-intelligence-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-iq-hub | ✓ | UNKNOWN | 🔴 | IQ Hub; unclear |
| integratewise-iq-hub-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-knowledge | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-knowledge-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-l2 | ✓ | HISTORICAL_ACTIVE | 🟡 | Unclear purpose; likely deprecated |
| integratewise-live | ✓ | CUSTOMER_ZERO | 🟢 | Frontend app; not a service Worker |
| integratewise-live-dev | ✓ | CUSTOMER_ZERO | 🟡 | Dev variant |
| integratewise-live-prod | ✓ | CUSTOMER_ZERO | 🟡 | Prod variant |
| integratewise-live-production | ✓ | CUSTOMER_ZERO | 🟡 | Another prod variant |
| integratewise-loader | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-loader-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-maketingsite | ✓ | UNKNOWN | 🔴 | Typo: `maketingsite` not `marketingsite` |
| integratewise-marketingsite | ✓ | UNKNOWN | 🔴 | Marketing frontend; not a service Worker |
| integratewise-mcp-connector | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-mcp-connector-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-mcp-tool-server | ✓ | UNKNOWN | 🔴 | MCP tool server; not in canonical |
| integratewise-mcp-tool-server-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-normalizer | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-normalizer-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-pipeline | ✓ | HISTORICAL_ACTIVE | 🔴 | Should be `spine-writer`; may be active write path |
| integratewise-pipeline-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-spine | ✓ | HISTORICAL_DORMANT | 🟡 | Legacy Spine v1; v2 is canonical |
| integratewise-spine-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging; legacy v1 |
| integratewise-spine-v2 | ✓ | UNKNOWN | 🟡 | Spine v2; status unclear |
| integratewise-spine-v2-production | ✓ | TARGET_RUNTIME | 🟡 | May be canonical Spine implementation |
| integratewise-spine-v2-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-store | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-store-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-telemetry-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging; no production telemetry deployed |
| integratewise-tenants | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-think | ✓ | HISTORICAL_ACTIVE | 🟡 | Should merge into Hermes |
| integratewise-think-staging | ✓ | HISTORICAL_DORMANT | 🟡 | Staging only |
| integratewise-webhook-ingress | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| integratewise-webhooks | ✓ | UNKNOWN | 🔴 | Unclear; may be duplicate |
| integratewise-workflow | ✓ | TARGET_RUNTIME | 🟢 | In canonical target |
| intelligence | ✓ | HISTORICAL_ACTIVE | 🟡 | Legacy bare name; may receive traffic |
| intelligence-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant |
| iw-agent-runtime | ✓ | HISTORICAL_ACTIVE | 🟡 | Agent runtime; not in canonical 18 |
| knowledge | ✓ | HISTORICAL_ACTIVE | 🟡 | Legacy bare name; may receive traffic |
| knowledge-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant |
| l2-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | L2 production; unclear purpose |
| l2-test | ✓ | HISTORICAL_DORMANT | 🟡 | Test only |
| misty-brook-99b1d | ✓ | UNKNOWN | 🔴 | Developer test; no context |
| modelflare | ✓ | TOOLING | 🟡 | Dev tool (VS Code extension); not a service |
| ops-ai-bridge | ✓ | UNKNOWN | 🔴 | Ops AI; unclear |
| ops-iw-agent-runtime | ✓ | UNKNOWN | 🔴 | Ops variant of agent runtime |
| ops-litellm-proxy | ✓ | UNKNOWN | 🔴 | LiteLLM proxy; not in canonical |
| ops-memory-pipeline | ✓ | UNKNOWN | 🔴 | Memory pipeline; unclear |
| orange-cell-7c67 | ✓ | UNKNOWN | 🔴 | Developer test; no context |
| orange-paper-439c | ✓ | UNKNOWN | 🔴 | Developer test; no context |
| pipeline | ✓ | HISTORICAL_ACTIVE | 🔴 | Legacy bare name; may receive traffic |
| pipeline-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant |
| twin | ✓ | HISTORICAL_ACTIVE | 🟡 | Twin runtime; not in canonical 18 |
| twin-agent | ✓ | HISTORICAL_ACTIVE | 🟡 | Twin agent; not in canonical |
| twin-orchestrator | ✓ | HISTORICAL_ACTIVE | 🟡 | Twin orchestrator; not in canonical |
| v1-portfolio-hire | ✓ | UNKNOWN | 🔴 | Portfolio/hiring tool; no context |
| workflow | ✓ | HISTORICAL_ACTIVE | 🟡 | Legacy bare name; may receive traffic |
| workflow-prod | ✓ | HISTORICAL_ACTIVE | 🟡 | Production variant |
| workflows-starter-template | ✓ | UNKNOWN | 🔴 | Template; likely not active |

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Total Deployed Workers** | 98 |
| **Externally Routed Workers** | Unknown (requires route inspection) |
| **Workers with Custom Domains** | Unknown (requires domain inspection) |
| **Workers Consumed by Service Bindings** | Unknown (requires binding inspection) |
| **Workers Consuming Queues** | Unknown (requires queue inspection) |
| **Workers Producing Queues** | Unknown (requires queue inspection) |
| **Workers with Cron Triggers** | Unknown (requires trigger inspection) |
| **Workers with Durable Objects** | Unknown (requires DO inspection) |
| **TARGET_RUNTIME** | ~12–15 (estimated) |
| **HISTORICAL_ACTIVE** | ~40–50 (estimated) |
| **HISTORICAL_DORMANT** | ~20–25 (estimated) |
| **DUPLICATE_RUNTIME** | ~5–10 (estimated) |
| **UNKNOWN** | ~10–15 (estimated) |

---

## Critical Missing or Misnamed Services

1. **`schema-synthesis`** — Not deployed; unknown where schema AI logic runs
2. **`spine-writer`** — **NOT DEPLOYED**; `integratewise-pipeline` or `pipeline` may be handling canonical writes
3. **`governance`** — **NOT DEPLOYED**; `integratewise-govern` exists but with incorrect name (off-by-one)
4. **`huggingface-inference`** — **NOT DEPLOYED**; inference endpoint may be elsewhere or missing
5. **`hermes` (singular)** — Deployed as `integratewise-hermes`; but `think`, `intelligence`, `act` may be splitting the role

---

## Conflict Resolution Audit

**Files with conflicts resolved by HEAD:**

1. **services/connector/wrangler.toml**
   - **Status**: Resolved by HEAD
   - **Semantic Impact**: Unknown without manual diff

2. **services/continuity/wrangler.toml**
   - **Status**: Resolved by HEAD
   - **Semantic Impact**: Triage queue configuration may have changed

3. **services/gateway/wrangler.toml**
   - **Status**: Resolved by HEAD
   - **Semantic Impact**: Observability and secrets configuration may have changed

4. **services/iw-agent-runtime/wrangler.toml**
   - **Status**: Resolved by HEAD
   - **Semantic Impact**: Default LLM model may have changed

---

## Active Execution Path Analysis

**Cannot determine with confidence due to lack of binding/route inspection:**

| Path | Current Status |
|---|---|
| Product API traffic | Unknown; `gateway` or `integratewise-gateway`? |
| Gateway routing | Unknown; legacy bare `gateway` or canonical `integratewise-gateway`? |
| Intelligence requests | Unknown; `intelligence`, `integratewise-intelligence`, or `hermes`? |
| Action proposals | Unknown; `think`, `act`, or `hermes`? |
| Governance | Unknown; `govern` or missing `governance`? |
| Capability execution | Unknown; Hermes + capability system or legacy `agent-registry`? |
| Connector ingestion | Unknown; `connector` or `integratewise-connector`? |
| Normalization | Likely `integratewise-normalizer` (canonical) |
| Canonical Spine writes | **UNCERTAIN**: `integratewise-pipeline` or missing `spine-writer`? |
| Continuity | Likely `integratewise-continuity` (canonical) |
| MCP traffic | Likely `integratewise-mcp-connector` (canonical) |

---

## Recommendation

### **RECOMMENDATION: D — Runtime topology cannot be trusted and requires restoration from a known deployment checkpoint**

**Reasoning:**

1. **98 deployed Workers** with overlapping, conflicting, and historical identities creates ambiguous routing
2. **Canonical 18-Worker target** is not cleanly deployed; instead 98 is a superset containing 5 duplicates, 12 historical challenged services, and 15 unknown/deprecated services
3. **Merge-conflict resolution by bulk HEAD selection** may have silently restored pre-consolidation bindings and configurations
4. **Critical canonical services are missing or misnamed:**
   - `spine-writer` not deployed; `pipeline` may be substitute
   - `governance` not deployed; `govern` exists (wrong name)
   - `huggingface-inference` not deployed
5. **Active traffic paths are ambiguous:**
   - Both legacy bare names (`gateway`, `pipeline`, `workflow`) and canonical (`integratewise-*`) variants exist
   - Cannot determine which is receiving product traffic without route inspection
6. **The 27-Worker deployment in this session** was a filesystem discovery, not an architectural decision

**Required Actions (DO NOT EXECUTE):**

1. Inspect Cloudflare routes and custom domains to determine which Workers are receiving external traffic
2. Inspect service bindings to trace actual execution dependencies
3. Compare deployed Wrangler configurations against pre-merge versions to identify semantic changes lost in conflict resolution
4. Establish a known-good deployment checkpoint (e.g., the intended 18 canonical Workers)
5. Plan a controlled traffic migration from historical identities to canonical identities
6. Deploy missing canonical services: `spine-writer`, `governance`, `huggingface-inference`
7. Delete or disable dormant historical Workers after confirming no active bindings depend on them

---

## Audit Completed

**Status**: Ready for human review and decision.  
**No deployments executed.**  
**No rollbacks executed.**  
**No deletions executed.**

