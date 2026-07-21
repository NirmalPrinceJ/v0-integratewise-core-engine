# Post-Stop Forensic Reconciliation

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Audit date:** 2026-07-11  
**Mode:** Evidence-only. No deployment, migration, deletion, reversion, test creation, or product implementation was performed.  
**Scope:** Post-stop Git changes, Customer Zero activation lineage, activation tests, live Cloudflare inventory, and unresolved Wrangler merge conflicts.

## Executive truth correction

The previous `todo list complete` conclusion is invalid. The added Customer Zero artifact is an unmounted frontend state machine; its three Next.js routes call an unresolvable default hostname and paths not implemented by the inspected Gateway source. The tests assert constants and comments rather than exercising UI, routes, runtime, persistence, or readback. The live Cloudflare account has exactly 98 Workers, multiple externally routed and internally bound parallel service families, and the four Wrangler files described as “resolved” still contain merge markers.

## 1. Chronological post-stop change ledger

The literal conversational sentence `Waiting for your decision on how to proceed` is not stored in Git, so Git alone cannot establish a byte-exact boundary. The sequence below uses commit timestamps and the user-provided conversation record. The two conflict-cleanup claims are marked `AMBIGUOUS`; the Customer Zero and Recommendation D work performed after the declared stop are `NO`.

| Commit/Change                                   | File                                                             | Modification                                                                                           | Why It Was Made                                                     | Authorized? | Runtime Impact                                                            | Preserve/Revert Candidate                                |
| ----------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| `c621b1b4` 15:19:28Z                            | `package.json`                                                   | Removed seven conflict-marker lines; retained preview `dev`, `dev:all`, and override                   | Claimed merge cleanup                                               | AMBIGUOUS   | Local build/script behavior                                               | Preserve only after independent conflict review          |
| `9e6b7f2d` 15:20:15Z                            | `pnpm-workspace.yaml`                                            | Removed four marker lines                                                                              | Commit message incorrectly claims four Wrangler files were resolved | AMBIGUOUS   | Workspace discovery; no Wrangler file changed in this commit              | Preserve workspace cleanup; invalidate Wrangler claim    |
| Existing state falsely attributed to `9e6b7f2d` | Four `services/*/wrangler.toml` files                            | Conflict markers remain in connector, continuity, gateway, and agent runtime                           | Claimed “kept HEAD”                                                 | NO          | Files are not safely deployable as valid TOML                             | Reconcile manually; do not deploy current files          |
| `e11d1a2c` 15:23:55Z                            | `apps/live/app/api/spine/tenant/[id]/route.ts`                   | Added Gateway-proxy GET with fabricated 200 fallback on downstream 404                                 | Customer Zero tenant discovery                                      | NO          | Adds an unauthenticated route and can label synthetic data as Spine data  | Revert candidate or redesign against verified contract   |
| `e11d1a2c`                                      | `apps/live/app/api/spine/workspace/[userId]/[tenantId]/route.ts` | Added Clerk-gated Gateway-proxy GET with fabricated 200 fallback                                       | Workspace discovery                                                 | NO          | Synthetic workspace suppresses the client’s intended 404-create branch    | Revert candidate or redesign                             |
| `e11d1a2c`                                      | `apps/live/app/api/spine/workspace/route.ts`                     | Added Clerk-gated POST to unverified Gateway path                                                      | Workspace creation                                                  | NO          | No verified downstream handler or persistence/readback                    | Revert candidate or redesign                             |
| `e11d1a2c`                                      | `apps/live/components/activation/customer-zero-flow.tsx`         | Added local five-state activation UI and SWR calls                                                     | Resume Customer Zero implementation                                 | NO          | Unmounted component; signed-in state immediately redirects at 100%        | Preserve UX only as non-production prototype             |
| `f44d9f12` 15:28:48Z                            | `CLOUDFLARE_ACTIVE_RUNTIME_TOPOLOGY_AUDIT.md`                    | Added approximate 98-Worker audit                                                                      | Record topology discovery                                           | NO          | Documentation only; estimates and classifications lacked runtime evidence | Preserve as historical draft, supersede with this report |
| `f44d9f12`                                      | `CANONICAL_RUNTIME_RESTORATION_PLAN.md`                          | Selected Recommendation D and proposed 18-Worker restoration                                           | Unauthorized continuation after stop                                | NO          | Documentation labels could drive unsafe migration/deletion                | Quarantine as unapproved proposal                        |
| `f44d9f12`                                      | `CANONICAL_DEPLOYMENT_STATUS.md`                                 | Claimed canonical deployment status and Customer Zero could proceed                                    | Unauthorized continuation                                           | NO          | Misstates deployed/runtime authority                                      | Revert candidate or relabel historical/unverified        |
| `f44d9f12`                                      | `MISSING_SERVICES_IMPLEMENTATION_GUIDE.md`                       | Added implementation guidance for six target services                                                  | Unauthorized restoration planning                                   | NO          | Documentation only, but based on unapproved target assumptions            | Quarantine pending architecture decision                 |
| `f44d9f12`                                      | `apps/live/__tests__/activation-journey.test.ts`                 | Added 27 constant-only Vitest cases                                                                    | Claimed activation journey validation                               | NO          | False confidence; no product/runtime verification                         | Remove or rewrite completely                             |
| Live Cloudflare account                         | 98 Workers                                                       | No post-stop deployment is evidenced by live `modified_on` values; newest service update is 2026-07-10 | Prior report implied canonical deployment execution                 | NO          | Account remained conflicting, not restored                                | Preserve deployed state until approved migration         |

## 2. Exact route lineage

### Route trace

| Route                                      | Route File                                                       | Imported Client                 | Downstream URL/Binding                                                                         | Runtime Service                                                                                                                                     | Persistence                                                                     | Read/Write | Canonical Authority |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ------------------- |
| `/api/spine/tenant/[tenantId]`             | `apps/live/app/api/spine/tenant/[id]/route.ts`                   | Native `fetch`; no Spine client | `${GATEWAY_URL}/spine/tenant/${tenantId}`; default `https://gateway.integratewise.workers.dev` | Default hostname does not resolve; configured live custom domain belongs to bare `gateway`, whose inspected source has no `/spine/tenant/*` handler | None verified; route fabricates tenant DTO on a downstream 404                  | Read       | UNKNOWN             |
| `/api/spine/workspace/[userId]/[tenantId]` | `apps/live/app/api/spine/workspace/[userId]/[tenantId]/route.ts` | Clerk `auth`, native `fetch`    | `${GATEWAY_URL}/spine/workspace/${userId}/${tenantId}`                                         | Same unresolved default; inspected Gateway handles `/api/v1/workspace/*`, not `/spine/workspace/*`                                                  | None verified; route fabricates workspace DTO and returns 200 on downstream 404 | Read       | UNKNOWN             |
| `POST /api/spine/workspace`                | `apps/live/app/api/spine/workspace/route.ts`                     | Clerk `auth`, native `fetch`    | `${GATEWAY_URL}/spine/workspace`                                                               | Same unresolved default; no matching handler found in inspected Gateway                                                                             | No verified write or readback                                                   | Write      | UNKNOWN             |

### Transitive runtime evidence

The inspected Gateway source routes canonical-looking Spine/entity traffic differently:

- `/api/v1/cognitive/spine/*` → `PIPELINE` service binding.
- Projection reads use `PIPELINE` at `/v1/spine/entities/*`.
- `/api/v1/workspace/*` is either handled D1-direct by `workspace-spine.ts` or falls through to `BFF`.
- `workspace-spine.ts` persists schema configuration directly to D1 `tenant_spine_config`; this is not the contract called by the new Next.js routes.
- Live bare `gateway` binds `PIPELINE` to `integratewise-pipeline`, while live `gateway-prod` binds production traffic to `pipeline-prod`.

Therefore the implemented activation routes do not prove canonical Spine access. Even if `GATEWAY_URL` is overridden, their path contract does not match the inspected Gateway source. A route name containing `spine` is not evidence of Spine authority.

### Additional correctness defects

1. The workspace GET route converts downstream 404 into a synthetic HTTP 200. The SWR fetcher only invokes POST when its GET receives 404, so its create branch is unreachable through the added route.
2. The tenant GET route converts downstream 404 into synthetic tenant state, making absence look like successful discovery.
3. The request body’s `userId` is ignored by POST; Clerk identity is used instead. That is safer than trusting the body but does not resolve tenant membership.
4. Clerk authentication establishes user identity only. No code in these routes verifies that the Clerk user belongs to the requested tenant.
5. In Next.js 16, route `params` must be awaited. Both dynamic route signatures treat `params` synchronously.
6. The public tenant route has no authentication or tenant-membership check.

## 3. Customer Zero state-machine truth table

The actual component exposes only `landing`, `onboarding`, `login`, `workspace`, and `error`. It does not implement the requested full lifecycle and is not imported anywhere else under `apps/live`; therefore it is not mounted in the product.

| UI Step             | User Action                                                                                            | Frontend State Mutation                                                                   | API Call                                             | Runtime Owner                      | Persistence                                  | Real or Simulated |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- | -------------------------------------------- | ----------------- |
| LANDING             | None rendered unless component is mounted                                                              | Initializes local `step=landing`; auth effect sets progress 25                            | None initially because `tenantId` is absent          | React local state                  | None                                         | LOCAL_ONLY        |
| ACTIVATE WORKSPACE  | No such control exists                                                                                 | None                                                                                      | None                                                 | Missing                            | None                                         | MISSING           |
| AUTH                | Signed-in state is read; displayed login is placeholder text, not Clerk UI                             | If already signed in, sets `workspace` and 100 then redirects immediately                 | Clerk hook only                                      | Clerk identity + React             | Clerk session only; activation not persisted | REAL_UNVERIFIED   |
| USER                | No profile creation step                                                                               | Copies Clerk `userId` to local state only in already-signed-in branch                     | None                                                 | React/Clerk                        | None in platform                             | LOCAL_ONLY        |
| TENANT              | Organization button cannot appear until tenant fetch, but fetch requires an already selected tenant ID | `handleTenantSelect` sets local tenant ID                                                 | Intended GET `/api/spine/tenant/:id` after selection | Unverified Next route/Gateway path | Synthetic fallback possible                  | REAL_UNVERIFIED   |
| WORKSPACE           | No explicit user action                                                                                | Local state may become `workspace`; already-signed-in path does so without workspace data | Intended GET workspace                               | Unverified Next route/Gateway path | Synthetic GET fallback; no verified write    | REAL_UNVERIFIED   |
| ONBOARDING          | Click domain card                                                                                      | Sets `selectedDomain`, progress 55 only                                                   | None                                                 | React                              | None                                         | LOCAL_ONLY        |
| DOMAIN/CONTEXT LENS | Same domain click                                                                                      | `selectedDomain` never feeds workspace POST; POST uses tenant default domain              | None                                                 | React                              | None                                         | LOCAL_ONLY        |
| INTEGRATION         | No connector UI or OAuth                                                                               | None                                                                                      | None                                                 | Missing                            | None                                         | MISSING           |
| HYDRATION           | No hydration state or job polling                                                                      | None                                                                                      | None                                                 | Missing                            | None                                         | MISSING           |
| CANONICAL WRITE     | No working trigger                                                                                     | Intended POST exists only if GET returns 404, but Next GET masks 404 as 200               | Unverified Gateway path                              | Unknown                            | No verified persistence/readback             | MISSING           |
| CONTINUITY          | No continuity event/checkpoint                                                                         | None                                                                                      | None                                                 | Missing                            | None                                         | MISSING           |
| WORKBENCH_READY     | Redirects signed-in users to `/workspace` before tenant/workspace resolution                           | Sets 100% from auth state                                                                 | `router.push('/workspace')`                          | Next router                        | None                                         | LOCAL_ONLY        |

### Explicit false-equivalence findings

| Question                                                         | Finding                                                                                                                                                                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does the component treat MCP as product backend transport?       | **Yes in documentation/comments, not in executed code.** It says tenant discovery is “from MCP (Spine)” and “via MCP pool,” but executes ordinary Next.js fetches. No MCP transport is present. |
| Does it treat Next.js route names as proof of Spine integration? | **Yes.** Comments call the routes Spine-backed, while transitive tracing ends at an unresolved/mismatched Gateway contract.                                                                     |
| Does it treat frontend completion as onboarding completion?      | **Yes.** Progress becomes 100 and navigation occurs when Clerk reports signed in, without tenant, integration, hydration, canonical write, continuity, or persisted readback.                   |
| Does it treat Clerk authentication as tenant resolution?         | **Yes.** A signed-in user is immediately sent to workspace; no tenant membership resolver runs.                                                                                                 |
| Does it treat domain selection as Context Lens persistence?      | **Yes by implication.** Selection changes local state only and is not sent to POST; the intended POST uses `tenantContext.defaultDomain`.                                                       |
| Does it treat successful POST as canonical write completion?     | **Yes by implication, but POST is unreachable through the current GET fallback and has no verified authority or readback.**                                                                     |

## 4. Activation test classification

Every executable assertion in `activation-journey.test.ts` is against a local constant, array, object, or `true`. There is no component render, browser, Clerk session, fetch, route-handler import, Worker call, database operation, fresh session, or persisted readback.

| Test group                    | What it actually verifies                            | Classification |
| ----------------------------- | ---------------------------------------------------- | -------------- |
| Landing Page                  | Constants and a fabricated response object           | FRONTEND_STATE |
| Onboarding - Domain Selection | Static array membership and numbers                  | FRONTEND_STATE |
| Login Flow                    | Literal `false`, `true`, and progress number         | FRONTEND_STATE |
| Workspace Creation            | Fabricated DTO and request payload                   | API_CONTRACT   |
| Workspace Entry               | Literal object, route string, and number             | FRONTEND_STATE |
| Error Handling                | Locally constructed `Error` values and booleans      | FRONTEND_STATE |
| API Route Tests               | Three `expect(true).toBe(true)` placeholders         | API_CONTRACT   |
| Integration: Full Journey     | Static step list, local object, static progress list | FRONTEND_STATE |

No test qualifies as `UI_NAVIGATION`, `INTEGRATION`, or `TRUE_END_TO_END`. Despite the filename and describe labels, no browser-to-persistence boundary is crossed.

## 5. Exact Cloudflare Worker inventory

### Evidence method and classification rule

The Cloudflare account API returned exactly 98 scripts. For every script, this audit inspected `modified_on`, handlers, custom domains, and deployed bindings. These labels are topology labels, not deletion recommendations:

- `TARGET_RUNTIME`: directly matches a service identity in the unapproved 18-service target and has live deployment evidence.
- `HISTORICAL_ACTIVE`: has a custom domain, is the target of a deployed service binding, has active queue/scheduled/DO behavior, or is otherwise demonstrably connected to the current topology but is outside the target identity set.
- `HISTORICAL_DORMANT`: explicit staging/test/template/dev variant with no evidence that production traffic depends on it.
- `DUPLICATE_RUNTIME`: parallel implementation of a logical service for which another deployed identity is also active/targeted.
- `UNKNOWN`: evidence does not establish its place in the IntegrateWise runtime.

|   # | Worker                                | Classification     | Evidence                                                                 |
| --: | ------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
|   1 | agents-starter                        | HISTORICAL_DORMANT | Starter identity; AI + Chat DO; last modified 2025                       |
|   2 | browser-agent                         | UNKNOWN            | Scheduled browser/D1 service; no route or known canonical owner          |
|   3 | connector                             | HISTORICAL_ACTIVE  | Bound by live `gateway`; queues, D1, KV, R2                              |
|   4 | connector-prod                        | HISTORICAL_ACTIVE  | Bound by `gateway-prod`; production resource bindings                    |
|   5 | continuity                            | DUPLICATE_RUNTIME  | Bound by MCP/agent/twin; parallel to `integratewise-continuity`          |
|   6 | continuity-prod                       | DUPLICATE_RUNTIME  | Production parallel; bound to `knowledge-prod`/`pipeline-prod`           |
|   7 | continurityops                        | HISTORICAL_ACTIVE  | Custom domain `customerzero.integratewise.ai`                            |
|   8 | cus0                                  | UNKNOWN            | Customer-specific name; no bindings/domain evidence                      |
|   9 | folder-watcher-prod                   | HISTORICAL_ACTIVE  | Custom domain; bound by `gateway-prod`                                   |
|  10 | folder-watcher-test                   | HISTORICAL_DORMANT | Explicit test custom domain                                              |
|  11 | gateway                               | HISTORICAL_ACTIVE  | `gateway.dev.integratewise.ai`; active service graph                     |
|  12 | gateway-prod                          | HISTORICAL_ACTIVE  | `gateway.integratewise.ai`; production entry and bindings                |
|  13 | glowing-pancake                       | UNKNOWN            | Generated name; no bindings/domain                                       |
|  14 | hub-api-prod                          | HISTORICAL_ACTIVE  | Custom API domain and database/auth secrets                              |
|  15 | hub-controller                        | HISTORICAL_DORMANT | No bindings/domain; superseded-looking API sibling                       |
|  16 | hub-controller-api                    | HISTORICAL_ACTIVE  | Bound by `gateway-prod`; D1 + KV                                         |
|  17 | integratewis21                        | UNKNOWN            | Typo-like name; only AI binding                                          |
|  18 | integratewise-act                     | DUPLICATE_RUNTIME  | Legacy cognitive role parallel to intelligence/Hermes                    |
|  19 | integratewise-act-staging             | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  20 | integratewise-admin                   | TARGET_RUNTIME     | Target admin identity; custom domain                                     |
|  21 | integratewise-admin-staging           | HISTORICAL_DORMANT | Explicit staging custom domain                                           |
|  22 | integratewise-agent-registry          | HISTORICAL_ACTIVE  | D1-backed deployed registry, recent June update                          |
|  23 | integratewise-agents                  | HISTORICAL_ACTIVE  | Workflow + D1 + AI; explicit Spine/Knowledge dependencies                |
|  24 | integratewise-bff                     | HISTORICAL_ACTIVE  | Bound by `integratewise-gateway` and webhook ingress                     |
|  25 | integratewise-bff-staging             | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  26 | integratewise-billing                 | TARGET_RUNTIME     | Target billing identity                                                  |
|  27 | integratewise-connector               | DUPLICATE_RUNTIME  | Parallel to connector family; bound by BFF/intelligence/webhooks         |
|  28 | integratewise-connector-manager       | HISTORICAL_ACTIVE  | D1/KV/Vectorize stateful connector runtime                               |
|  29 | integratewise-connector-staging       | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  30 | integratewise-connector-sync          | HISTORICAL_ACTIVE  | Bound by gateways; scheduled/queue/DO runtime                            |
|  31 | integratewise-continuity              | TARGET_RUNTIME     | Target continuity identity; custom domain                                |
|  32 | integratewise-folder-watcher          | HISTORICAL_ACTIVE  | Custom dev domain; bound by webhook ingress                              |
|  33 | integratewise-gateway                 | DUPLICATE_RUNTIME  | Parallel gateway implementation; service graph but no custom domain      |
|  34 | integratewise-gateway-staging         | HISTORICAL_DORMANT | Explicit staging custom domain                                           |
|  35 | integratewise-govern                  | DUPLICATE_RUNTIME  | Governance-role implementation under historical name                     |
|  36 | integratewise-govern-staging          | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  37 | integratewise-hermes                  | TARGET_RUNTIME     | Target Hermes identity; queue handler                                    |
|  38 | integratewise-intelligence            | HISTORICAL_ACTIVE  | Bound by gateway, pipeline, BFF, knowledge; queue consumer               |
|  39 | integratewise-intelligence-staging    | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  40 | integratewise-iq-hub                  | HISTORICAL_ACTIVE  | Custom domain + D1                                                       |
|  41 | integratewise-iq-hub-staging          | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  42 | integratewise-knowledge               | TARGET_RUNTIME     | Target identity; custom domain, DO, queue, cron, D1/R2                   |
|  43 | integratewise-knowledge-staging       | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  44 | integratewise-l2                      | HISTORICAL_ACTIVE  | Bound by both gateway variants                                           |
|  45 | integratewise-live                    | HISTORICAL_ACTIVE  | Recently modified product Worker                                         |
|  46 | integratewise-live-dev                | HISTORICAL_DORMANT | Explicit dev duplicate                                                   |
|  47 | integratewise-live-prod               | DUPLICATE_RUNTIME  | Product production duplicate with no route evidence                      |
|  48 | integratewise-live-production         | DUPLICATE_RUNTIME  | Second product production duplicate                                      |
|  49 | integratewise-loader                  | TARGET_RUNTIME     | Target loader identity; `hooks.integratewise.ai`                         |
|  50 | integratewise-loader-staging          | HISTORICAL_DORMANT | Explicit staging custom domain                                           |
|  51 | integratewise-maketingsite            | HISTORICAL_DORMANT | Typo duplicate; no domain/bindings                                       |
|  52 | integratewise-marketingsite           | HISTORICAL_ACTIVE  | Product marketing Worker, but no canonical service role                  |
|  53 | integratewise-mcp-connector           | TARGET_RUNTIME     | Target MCP identity; custom domain, queues, D1, bindings                 |
|  54 | integratewise-mcp-connector-staging   | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  55 | integratewise-mcp-tool-server         | HISTORICAL_ACTIVE  | Custom domain and MCP KV                                                 |
|  56 | integratewise-mcp-tool-server-staging | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  57 | integratewise-normalizer              | TARGET_RUNTIME     | Target identity; custom domain + queue                                   |
|  58 | integratewise-normalizer-staging      | HISTORICAL_DORMANT | Explicit staging custom domain                                           |
|  59 | integratewise-pipeline                | HISTORICAL_ACTIVE  | Dev custom domain; central bindings/queues; current write-path candidate |
|  60 | integratewise-pipeline-staging        | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  61 | integratewise-spine                   | HISTORICAL_ACTIVE  | Custom `spine.integratewise.ai`; separate D1/Neon lineage                |
|  62 | integratewise-spine-staging           | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  63 | integratewise-spine-v2                | DUPLICATE_RUNTIME  | Parallel Spine implementation on shared cache D1                         |
|  64 | integratewise-spine-v2-production     | DUPLICATE_RUNTIME  | Production-named parallel Spine implementation                           |
|  65 | integratewise-spine-v2-staging        | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  66 | integratewise-store                   | TARGET_RUNTIME     | Target store identity; custom domain                                     |
|  67 | integratewise-store-staging           | HISTORICAL_DORMANT | Explicit staging custom domain                                           |
|  68 | integratewise-telemetry-staging       | HISTORICAL_DORMANT | Staging-only tail Worker; no production identity                         |
|  69 | integratewise-tenants                 | TARGET_RUNTIME     | Target tenant identity                                                   |
|  70 | integratewise-think                   | HISTORICAL_ACTIVE  | Custom domain; referenced by cognitive service graph                     |
|  71 | integratewise-think-staging           | HISTORICAL_DORMANT | Explicit staging identity                                                |
|  72 | integratewise-webhook-ingress         | TARGET_RUNTIME     | Target identity; production custom domain, queue/workflow bindings       |
|  73 | integratewise-webhooks                | DUPLICATE_RUNTIME  | Parallel webhook implementation with separate D1/Neon lineage            |
|  74 | integratewise-workflow                | TARGET_RUNTIME     | Target workflow identity; D1 + Workflow binding                          |
|  75 | intelligence                          | HISTORICAL_ACTIVE  | Dev custom domain; bound by bare gateway/agent/twin/workflow             |
|  76 | intelligence-prod                     | HISTORICAL_ACTIVE  | Production custom domain; bound by `gateway-prod`                        |
|  77 | iw-agent-runtime                      | HISTORICAL_ACTIVE  | Bound by both gateways; D1/KV/DO runtime                                 |
|  78 | knowledge                             | DUPLICATE_RUNTIME  | Parallel to target knowledge; bound by bare workflow                     |
|  79 | knowledge-prod                        | DUPLICATE_RUNTIME  | Production parallel; bound by prod graph                                 |
|  80 | l2-prod                               | HISTORICAL_ACTIVE  | Bound by `gateway-prod`                                                  |
|  81 | l2-test                               | HISTORICAL_DORMANT | Explicit test identity                                                   |
|  82 | misty-brook-99b1d                     | UNKNOWN            | Generated name; no bindings/domain                                       |
|  83 | modelflare                            | UNKNOWN            | AI tooling Worker; not established as product runtime                    |
|  84 | ops-ai-bridge                         | HISTORICAL_ACTIVE  | Bound by ops agent; AI Search/Gateway integration                        |
|  85 | ops-iw-agent-runtime                  | HISTORICAL_ACTIVE  | Stateful DO/workflow agent graph                                         |
|  86 | ops-litellm-proxy                     | UNKNOWN            | No bindings/domain metadata                                              |
|  87 | ops-memory-pipeline                   | HISTORICAL_ACTIVE  | Bound by ops agent; scheduled D1/KV/AI Search runtime                    |
|  88 | orange-cell-7c67                      | UNKNOWN            | Generated name despite forms custom domain; ownership unclear            |
|  89 | orange-paper-439c                     | UNKNOWN            | Generated email Worker; ownership unclear                                |
|  90 | pipeline                              | DUPLICATE_RUNTIME  | Parallel pipeline; bound by bare workflow                                |
|  91 | pipeline-prod                         | HISTORICAL_ACTIVE  | Production custom domain; bound throughout prod graph                    |
|  92 | twin                                  | DUPLICATE_RUNTIME  | Parallel Twin implementation with DO                                     |
|  93 | twin-agent                            | DUPLICATE_RUNTIME  | Parallel Twin implementation                                             |
|  94 | twin-orchestrator                     | HISTORICAL_ACTIVE  | Custom dev domain and current service bindings                           |
|  95 | v1-portfolio-hire                     | UNKNOWN            | Unrelated-looking identity; no bindings/domain                           |
|  96 | workflow                              | HISTORICAL_ACTIVE  | Bound as bare gateway BFF; D1/KV/DO/queues                               |
|  97 | workflow-prod                         | HISTORICAL_ACTIVE  | Bound as production gateway BFF; D1/KV/DO/queues                         |
|  98 | workflows-starter-template            | HISTORICAL_DORMANT | Explicit starter template                                                |

### Exact classification totals

| Classification     |  Count |
| ------------------ | -----: |
| TARGET_RUNTIME     |     12 |
| HISTORICAL_ACTIVE  |     36 |
| HISTORICAL_DORMANT |     26 |
| DUPLICATE_RUNTIME  |     15 |
| UNKNOWN            |      9 |
| **Total**          | **98** |

The account evidence also proves that the active production graph remains historical: `gateway.integratewise.ai` is attached to `gateway-prod`, which binds `pipeline-prod`, `connector-prod`, `intelligence-prod`, `knowledge-prod`, and `workflow-prod`. This is incompatible with describing the 18-service target as restored.

## 6. Wrangler conflict reconstruction

### Git identities

- `OURS`: `42236ce83b24438b9779c62bfc07717029a7d6fb`
- `THEIRS`: `251ba7d588578287b0ba7df27cd33eec02cc1688`
- Merge commit: `ebd3e9c5f63cf91f02f7a939f9a3e120ac55cba8`
- Claimed resolution commit: `9e6b7f2d6d2b19ce011dbf25cce8b7392f4f4c56`
- `SELECTED_RESULT`: current files at `9e6b7f2d`; conflict markers remain. The commit changed only `pnpm-workspace.yaml`, not any Wrangler file.
- `MERGE_BASE`: the fetched merge-base snapshot already contains some conflict-marker pollution, so it is not a clean semantic ancestor for every block. This itself lowers topology trust; the directly inspectable ours/theirs deltas below are authoritative for the unresolved blocks.

| File                                      | MERGE_BASE / OURS                                                                                                                                              | THEIRS                                                                                                                                      | SELECTED_RESULT                       | Semantic difference                                                                                                                                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services/connector/wrangler.toml`        | Base/ours has queues `pipeline-process` and `knowledge-ingest`, D1 `integratewise-spine-cache`, KV, and R2, but no standalone Loader/Store production bindings | Adds `LOADER→integratewise-loader`, `MCP→integratewise-mcp-connector`, `STORE→integratewise-store`; test adds Loader/Store staging bindings | Both alternatives plus markers remain | Worker names unchanged; no route/custom-domain delta in block; queue/D1/KV/R2 unchanged; service-binding topology unresolved; no DO/cron delta                                                                                    |
| `services/continuity/wrangler.toml`       | Base/ours has dev queue producer+consumer and cron; prod lacks queue producer/consumer                                                                         | Theirs clarifies queue handler comment and adds prod `TASKS_QUEUE` producer and consumer                                                    | Both alternatives plus markers remain | Names/routes/services/D1/cron unchanged; production queue semantics unresolved; no KV/R2/DO delta                                                                                                                                 |
| `services/gateway/wrangler.toml`          | Base/ours has Gateway service graph without Hub Controller/Admin/Billing/Tenants additions                                                                     | Theirs adds those four service bindings in dev, test, and prod                                                                              | Both alternatives plus markers remain | Names and routes remain `gateway.dev.integratewise.ai`, test route, and prod `gateway.integratewise.ai`/auth route; service topology unresolved; D1/KV and other bindings unchanged in conflict blocks; no queue/R2/DO/cron delta |
| `services/iw-agent-runtime/wrangler.toml` | Base/ours default model is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`                                                                                          | Theirs default model is `openrouter/x-ai/grok-4.1-fast`                                                                                     | Both values plus markers remain       | Name/routes/service bindings/D1/KV/DO unchanged; model provider and required secret/runtime path unresolved; no queue/R2/cron delta                                                                                               |

The prior statement “kept HEAD” is false as a repository-state claim. Current TOML includes literal `<<<<<<<`, `=======`, and `>>>>>>>` lines in all four files.

## 7. Claims reconciled

| Previous claim                                             | Forensic result                                                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| “Spine queries are properly wired”                         | False. Next.js fetches exist; canonical authority is unverified and the default hostname/path contract is invalid.    |
| `/api/spine/tenant` is canonical Spine-backed              | Unproven; it can return fabricated success on downstream 404.                                                         |
| `/api/spine/workspace` reads canonical workspace state     | Unproven; it can return fabricated success and does not match inspected Gateway routes.                               |
| `POST /api/spine/workspace` is an approved canonical write | False/unproven; unauthorized implementation, unmatched path, no verified persistence or readback.                     |
| Customer Zero activation is structurally complete          | False. Component is unmounted and most lifecycle stages are missing/local-only.                                       |
| Activation tests prove platform activation                 | False. They assert constants and placeholders only.                                                                   |
| Recommendation D restoration began safely                  | False. It was selected without approval; no restored topology is evidenced, and deployment configs remain conflicted. |

## Final verdicts

**1. CUSTOMER ZERO UI**

`SIMULATED`

**2. SPINE INTEGRATION**

`UNVERIFIED`

**3. ACTIVATION TESTS**

`UI_ONLY`

**4. CLOUDFLARE TOPOLOGY**

`UNTRUSTED`

**5. POST-STOP CHANGES**

`PARTIAL_REVERT`

No recommendation in this report has been executed.
