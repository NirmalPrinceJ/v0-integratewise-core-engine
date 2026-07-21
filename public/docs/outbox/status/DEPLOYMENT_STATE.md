# DEPLOYMENT STATE

Status: CURRENT
Scope: Observed deployed Cloudflare infrastructure and runtime readiness evidence
Canonical Owner: Platform
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/operations/CF_WIRE_STATUS.md, docs/operations/ENDPOINT_MAP.md, docs/operations/DEPLOYMENT_RUNBOOK.md, docs/internal/runbooks/deployment-and-rollback.md, docs/archive/DEPLOYMENT_ANALYSIS_FULL.md, docs/archive/DEPLOYMENT_CLOUDFLARE.md, docs/archive/DEPLOYMENT_FIX.md, docs/archive/DEPLOYMENT_READY.md, docs/archive/DEPLOYMENT_STATUS.md, docs/archive/DEPLOYMENT_SUMMARY.md, docs/archive/VERCEL_DEPLOYMENT_STATUS.md, Option B divergence audit, wrangler manifests
Supersedes: none
Superseded By: none

Disclaimer: This document records observed deployment evidence and repository manifests only. Deployment success does not prove end-to-end operation. Do not classify as production ready without verification.

---

## 1. WHAT THIS DOCUMENT RECORDS

- current repository service reality
- target runtime topology
- current Cloudflare deployment evidence
- deployment summary claims and qualifying evidence
- classified Worker inventory

Full Worker inventory must be combined with:

- Cloudflare runtime review
- traffic/binding review
- trigger review

---

## 2. CURRENT REPOSITORY DEPLOYABLE RUNTIME IDENTITIES

From wrangler manifests across services/ and packages/:

| Worker Name / Route    | Service                                   | Route                             | Observations                            |
| ---------------------- | ----------------------------------------- | --------------------------------- | --------------------------------------- |
| gateway                | services/gateway                          | gateway.dev.integratewise.ai      | production route documented             |
| pipeline               | services/pipeline                         | pipeline.dev.integratewise.ai     | production route documented             |
| intelligence           | services/intelligence                     | intelligence.dev.integratewise.ai | production route documented             |
| twin-orchestrator      | services/twin-orchestrator                | twin.dev.integratewise.ai         | cron trigger + custom domain documented |
| mcp-connector          | services/mcp-connector                    | mcp.integratewise.ai              | MCP route documented                    |
| hub-controller-api     | packages/api                              | no explicit custom domain         | deployable package worker               |
| iw-mcp-tool-connector  | packages/integratewise-mcp-tool-connector | no explicit custom domain         | deployable package worker               |
| integratewise-webhooks | packages/webhooks                         | webhook route in manifest         | package worker                          |

Many additional service manifests deploy without documented routes and are presumed to be accessible via internal service bindings from gateway or adjacent Workers.

---

## 3. OBSERVED DEPLOYMENT EVIDENCE

Documented deployment events:

- Option B Wave 0 worker decoupling documented as cherry-pickable LOW risk
- MCP OAuth 2.0 Worker reportedly deployed based on `docs/archive/DEPLOYMENT_ANALYSIS_FULL.md` and docs.internal/MCP_SETUP_COMPLETE.md
- Twin agent runtime reportedly deployed
- Wave 0 log documents operation day evidence as ca. July 2026 landing sheet claims

Verified deployment evidence from manifest:

- Worker names with wrangler.toml present: 30
- Production custom domain route or documented route: gateway, pipeline, intelligence, iw-agent-runtime, mcp-connector, twin-orchestrator
- Durable Objects: iw-agent-runtime (TWIN_AGENT, TENANT_BRAIN); folder-watcher DO
- Queues: connector-sync, pipeline, webhook-ingress
- Service bindings documented: continuity, webhook-ingress, agent-registry, iw-agent-runtime, gateway, connector
- Secret store references: SUPABASE_URL in act, gove, tenants, billing, store; DATABASE_URL in admin; Secrets in mcp-connector and webhooks

These are runtime evidence of deployment configuration, not proof of active operational traffic.

---

## 4. DEPLOYED RUNTIME CLASSIFICATION

| Worker Name       | Documented Classification            | Notes                                                                 |
| ----------------- | ------------------------------------ | --------------------------------------------------------------------- |
| gateway           | TARGET_RUNTIME                       | canonical ingress                                                     |
| pipeline          | HISTORICAL_ACTIVE/TARGET             | actively deployed; legacy writer semantics may remain                 |
| intelligence      | HISTORICAL_ACTIVE/TARGET             | active runtime; may have cognitive primitives already consolidated    |
| iw-agent-runtime  | CURRENT/TARGET                       | active Twin runtime documented                                        |
| mcp-connector     | CURRENT/TARGET                       | active MCP route documented                                           |
| twin-orchestrator | CURRENT/TARGET or HISTORICAL_DORMANT | active cron route/call surface; migrations may shift responsibilities |
| continuity        | CURRENT/TARGET                       | documented; routing evidence not explicitly surfaced here             |
| hermes            | CURRENT/TARGET                       | documented                                                            |
| knowledge         | CURRENT/TARGET                       | documented                                                            |
| workflow          | CURRENT/TARGET                       | documented                                                            |
| webhook-ingress   | CURRENT/TARGET                       | documented bindings                                                   |
| normalizer        | CURRENT/TARGET                       | documented                                                            |
| loader            | CURRENT/TARGET                       | documented                                                            |
| admin             | CURRENT/TARGET                       | documented                                                            |
| tenants           | CURRENT/TARGET                       | documented; still references SUPABASE_URL                             |
| billing           | CURRENT/TARGET                       | documented; still references SUPABASE_URL                             |
| govern            | HISTORICAL_ACTIVE/DORMANT/MIGRATING? | present; named differently than governance target                     |
| act               | HISTORICAL_ACTIVE/DORMANT/MIGRATING? | present; may be retired; retires tech secret present                  |
| think             | HISTORICAL_ACTIVE/DORMANT/MIGRATING? | present; no further runtime evidence here                             |
| signals           | UNKNOWN                              | present; no opinion yet                                               |
| l2                | UNKNOWN                              | present; no opinion yet                                               |
| store             | CURRENT/HISTORICAL_ACTIVE            | still referencing SUPABASE_URL secret                                 |
| telemetry         | CURRENT/TARGET                       | documented                                                            |
| agent-registry    | HISTORICAL_ACTIVE/DORMANT/MIGRATING? | documented with pipeline binding                                      |
| folder-watcher    | HISTORICAL_ACTIVE/DORMANT            | documented                                                            |
| connector         | CURRENT/TARGET                       | documented; option-b attempted decoupled routing                      |

This table is conservative. Do not claim any current runtime is fully verified operational without end-to-end playback or traffic evidence.

---

## 5. CLOUDFLARE ACCOUNT CLAIMS

Reports indicate roughly 98 total deployed Workers exist across the Cloudflare account. The exact classification, canonical/runtime mapping, routing, and activation state are unknown in this document. A deduction beyond repository evidence would be unsupported.

Recommended next evidence:

- current Cloudflare account worker listing
- current route/binding audit
- traffic review
- queue consumer review
- durable object active provenance

---

## 6. DEPLOYMENT STATE SUMMARY

- 27 repo-discovered workers deployed during July 2026 deployment session is a reported historical claim; evidence here documents configuration artifacts only.
- Deployment success for those Worker sources is possible and supported by manifest presence, but not proven operational end-to-end through this document alone.
- Current canonical runtime topology is MIGRATING at best.
- Customer Zero runtime verification remains closed.

Do not claim platform activation completion from deployment evidence alone.

---

## 7. DOCUMENTS THAT PRECEDE THIS

- docs/operations/CF_WIRE_STATUS.md
- docs/operations/ENDPOINT_MAP.md
- docs/operations/DEPLOYMENT_RUNBOOK.md
- docs/internal/runbooks/deployment-and-rollback.md
- docs/archive/DEPLOYMENT_ANALYSIS_FULL.md
- docs/archive/DEPLOYMENT_CLOUDFLARE.md
- docs/archive/DEPLOYMENT_FIX.md
- docs/archive/DEPLOYMENT_READY.md
- docs/archive/DEPLOYMENT_STATUS.md
- docs/archive/DEPLOYMENT_SUMMARY.md
- docs/archive/VERCEL_DEPLOYMENT_STATUS.md
- docs/internal/status/TWIN_DEPLOYMENT_STATUS.md
- docs/internal/status/TWIN_ORCHESTRATOR_DEPLOYMENT.md
- docs/internal/status/TWIN_AGENT_DEPLOYMENT_PLAN.md

When conflict arises between this document and those documents, this document is canonical.
