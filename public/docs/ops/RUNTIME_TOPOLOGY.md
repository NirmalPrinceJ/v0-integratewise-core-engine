# RUNTIME TOPOLOGY

Status: CURRENT
Scope: Current and target runtime identities, app/package service boundaries, cloudflare worker boundaries
Canonical Owner: Platform
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/FINAL_E2E_SYSTEM.md, docs/platform-specs/15-deployment-architecture.md, docs/operations/ENDPOINT_MAP.md, Option B branch divergence audit, wrangler manifests across services/ and packages/
Supersedes: none
Superseded By: none

---

## 1. RUNTIME TOPOLOGY REALISM

```text
SERVICE FOLDER
≠
CANONICAL SERVICE
≠
DEPLOYED WORKER
≠
ACTIVE RUNTIME
```

Documentation must never conflate these four concepts.

- Service folder: repository artifact indicating intended implementation boundary
- Canonical service: approved target runtime identity
- Deployed Worker: manifest identity with deployed Cloudflare evidence
- Active runtime: manifest, routing, binding, triggers, observability, and runtime traffic evidence combined

Presence in the repository is evidence only. Deployment, routing, binding, and traffic evidence are required before CURRENT classification.

---

## 2. CURRENT REPOSITORY RUNTIME IDENTITIES

From wrangler manifests in current branch, runtime identities observed:

| Folder                                    | Worker Name                   | Has Route                         | Has Service Bindings | Has Durable Objects | Queues | Has Secrets | Observed Retired-Tech Secrets |
| ----------------------------------------- | ----------------------------- | --------------------------------- | -------------------- | ------------------- | ------ | ----------- | ----------------------------- |
| services/act                              | integratewise-act             | no                                | no                   | no                  | no     | yes         | SUPABASE_URL                  |
| services/admin                            | integratewise-admin           | no                                | no                   | no                  | no     | yes         | DATABASE_URL                  |
| services/agent-registry                   | integratewise-agent-registry  | no                                | no                   | no                  | no     | no          | no                            |
| services/billing                          | integratewise-billing         | no                                | no                   | no                  | no     | yes         | SUPABASE_URL                  |
| services/connector                        | connector                     | ves                               | yes                  | no                  | yes    | no          | no                            |
| services/connector-sync                   | integratewise-connector-sync  | no                                | yes                  | no                  | yes    | no          | no                            |
| services/continuity                       | continuity                    | no                                | yes                  | no                  | no     | no          | no                            |
| services/folder-watcher                   | integratewise-folder-watcher  | no                                | no                   | yes                 | no     | no          | no                            |
| services/gateway                          | gateway                       | gateway.dev.integratewise.ai      | yes                  | no                  | no     | no          | no                            |
| services/govern                           | integratewise-govern          | no                                | no                   | no                  | no     | yes         | SUPABASE_URL                  |
| services/hermes                           | integratewise-hermes          | no                                | no                   | no                  | no     | no          | no                            |
| services/intelligence                     | intelligence                  | intelligence.dev.integratewise.ai | yes                  | no                  | no     | no          | no                            |
| services/iw-agent-runtime                 | iw-agent-runtime              | no                                | yes                  | yes                 | no     | no          | no                            |
| services/knowledge                        | knowledge                     | no                                | no                   | no                  | no     | no          | no                            |
| services/l2                               | l2                            | no                                | no                   | no                  | no     | no          | no                            |
| services/loader                           | integratewise-loader          | no                                | no                   | no                  | no     | no          | no                            |
| services/mcp-connector                    | integratewise-mcp-connector   | mcp.integratewise.ai              | yes                  | no                  | no     | yes         | no                            |
| services/normalizer                       | integratewise-normalizer      | no                                | no                   | no                  | no     | no          | no                            |
| services/pipeline                         | integratewise-pipeline        | pipeline.dev.integratewise.ai     | no                   | no                  | no     | no          | no                            |
| services/signals                          | integratewise-signals         | no                                | no                   | no                  | no     | no          | no                            |
| services/store                            | integratewise-store           | no                                | no                   | no                  | no     | yes         | SUPABASE_URL                  |
| services/telemetry                        | integratewise-telemetry       | no                                | no                   | no                  | no     | no          | no                            |
| services/tenants                          | integratewise-tenants         | no                                | no                   | no                  | no     | yes         | SUPABASE_URL                  |
| services/think                            | integratewise-think           | no                                | no                   | no                  | no     | no          | no                            |
| services/twin-orchestrator                | twin-orchestrator             | twin.dev.integratewise.ai         | no                   | no                  | no     | no          | no                            |
| services/webhook-ingress                  | integratewise-webhook-ingress | no                                | yes                  | no                  | no     | no          | no                            |
| services/workflow                         | workflow                      | no                                | no                   | no                  | no     | no          | no                            |
| packages/api                              | hub-controller-api            | no                                | no                   | no                  | no     | no          | no                            |
| packages/integratewise-mcp-tool-connector | integratewise-mcp-connector   | no                                | no                   | no                  | no     | yes         | no                            |
| packages/webhooks                         | integratewise-webhooks        | no                                | no                   | no                  | no     | no          | no                            |

---

## 3. TARGET RUNTIME TOPOLOGY

Canonical target topology expected:

| Target Identity       | Repository Evidence  | Status           |
| --------------------- | -------------------- | ---------------- |
| gateway               | YES                  | CURRENT/TARGET   |
| loader                | YES                  | CURRENT/TARGET   |
| normalizer            | YES                  | CURRENT          |
| spine-writer          | NO                   | TARGET/UNKNOWN   |
| schema-synthesis      | UNKNOWN              | UNKNOWN          |
| continuity            | YES                  | CURRENT          |
| governance            | NO, govern exists    | TARGET/MIGRATING |
| hermes                | YES, runtime present | CURRENT          |
| knowledge             | YES                  | CURRENT          |
| store                 | YES                  | CURRENT          |
| workflow              | YES                  | CURRENT          |
| webhook-ingress       | YES                  | CURRENT          |
| mcp-connector         | YES                  | CURRENT          |
| telemetry             | YES                  | CURRENT          |
| huggingface-inference | UNKNOWN              | TARGET/UNKNOWN   |
| admin                 | YES                  | CURRENT          |
| tenants               | YES                  | CURRENT          |
| billing               | YES                  | CURRENT          |

---

## 4. CURRENT ROUTING AND SERVICE BINDING EVIDENCE

Option B Wave 0 evidence records intended bindings:

- gateway WANTS: ADMIN, BILLING, TENANTS
- connector WANTS: LOADER, MCP, STORE

These are not yet canonical branched. Cherry-pick/approval status:

- Approved for canonical branch: NO
- Approved for worktree: evidence supported
- Applied in runtime manifests on current branch: evidence-supported divergence audit only

Current documented routing traffic evidence is UNKNOWN until Cloudflare runtime review

---

## 5. DEPLOYED VS. ACTIVE CLASSIFICATION

Classification guidance:

| Classification     | Meaning                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------- |
| TARGET_RUNTIME     | Approved target service identity not yet proven deployed from current branch manifests    |
| HISTORICAL_ACTIVE  | Existing router with retained runtime and traffic surface; no longer canonical            |
| HISTORICAL_DORMANT | Existing router with manifest but no observed/traffic evidence supporting operational use |
| DUPLICATE_RUNTIME  | Multiple runtime identities intended for same url/role                                    |
| UNKNOWN            | Insufficient evidence to classify                                                         |

A large Cloudflare account reportedly contains about 98 deployed workers. Exact runtime classification cannot be made here without runtime inventory evidence, and must be treated as UNKNOWN.

---

## 6. APPS AND PACKAGE RUNTIME BOUNDARIES

Runtime app boundaries:

| App            | Evidence                                       | Target Role              | Notes                                                          |
| -------------- | ---------------------------------------------- | ------------------------ | -------------------------------------------------------------- |
| apps/web       | Present; docs target this as Vite/React target | TARGET                   | verify host/runtime assumptions                                |
| apps/workspace | Present                                        | CURRENT/CURRENT_EVIDENCE | may hold corpus evidence; not canonical target unless verified |
| apps/desktop   | Present; wrapper                               | HISTORICAL               | desktop wrapper only                                           |
| apps/mobile    | Present; placeholder                           | HISTORICAL               | placeholder only                                               |
| apps/docs      | Present                                        | UNKNOWN                  | docs-only app mission                                          |

Package boundary documentation requires separate verification of publish boundaries, module exports, and cross-package invocation. Backup packages such as packages/config-backup-_, packages/lib-backup-_, packages/types-backup-\* must be classified strictly and not left alive as duplicate sources of truth.

---

## 7. DOCUMENTS THAT PRECEDE THIS

- docs/platform-specs/15-deployment-architecture.md
- docs/operations/CF_WIRE_STATUS.md
- docs/operations/ENDPOINT_MAP.md
- docs/internal/operations/OPERATIONAL_STATE.md
- OPTION_B_BRANCH_DIVERGENCE_AUDIT.md
- OPTION_B_WAVE0_LOG.md

When conflict arises between this document and those documents, this document is canonical.
