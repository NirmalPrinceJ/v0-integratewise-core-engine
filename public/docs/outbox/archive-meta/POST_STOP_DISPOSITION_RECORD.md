# Post-Stop Disposition Record

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Date:** 2026-07-11  
**Evidence Authority:** `POST_STOP_FORENSIC_RECONCILIATION.md`  
**Scope:** Approved recovery disposition only  
**Cloudflare Changes:** NONE  
**Hermes Reconciliation:** NOT STARTED  
**Customer Zero Activation:** NOT STARTED

## Disposition ledger

| File or state                                                    | Forensic disposition               | Action actually taken                                                  | Resulting Git state / evidence                                   |
| ---------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `POST_STOP_FORENSIC_RECONCILIATION.md`                           | PRESERVE                           | No content change                                                      | Preserved at commit `7b5d27ad` as evidence authority             |
| Existing Cloudflare runtime                                      | PRESERVE                           | No Cloudflare command or mutation executed during this recovery action | Runtime left unchanged                                           |
| `pnpm-workspace.yaml`                                            | PRESERVE provisionally             | No content change                                                      | Preserved exactly as found                                       |
| `apps/live/app/api/spine/tenant/[id]/route.ts`                   | REVERT                             | Removed post-stop file introduced by `e11d1a2c`                        | Deleted; no pre-stop version existed                             |
| `apps/live/app/api/spine/workspace/[userId]/[tenantId]/route.ts` | REVERT                             | Removed post-stop file introduced by `e11d1a2c`                        | Deleted; no pre-stop version existed                             |
| `apps/live/app/api/spine/workspace/route.ts`                     | REVERT                             | Removed post-stop file introduced by `e11d1a2c`                        | Deleted; no pre-stop version existed                             |
| `apps/live/__tests__/activation-journey.test.ts`                 | REVERT                             | Removed post-stop placeholder test introduced by `f44d9f12`            | Deleted; no pre-stop version existed                             |
| `CANONICAL_DEPLOYMENT_STATUS.md`                                 | REVERT                             | Removed post-stop document introduced by `f44d9f12`                    | Deleted; no pre-stop version existed                             |
| `apps/live/components/activation/customer-zero-flow.tsx`         | PRESERVE AS SIMULATED UX PROTOTYPE | No content change; no new metadata system created                      | Preserved and verified unmounted; only self-definition remains   |
| `CLOUDFLARE_ACTIVE_RUNTIME_TOPOLOGY_AUDIT.md`                    | SUPERSEDE WITHOUT DELETION         | Added a superseded notice naming the forensic authority                | Historical body retained                                         |
| `CANONICAL_RUNTIME_RESTORATION_PLAN.md`                          | QUARANTINE AS UNAPPROVED PROPOSAL  | Added required proposal header and annotated original execution claims | `Status: PROPOSED`; `Approved: NO`; `Execution Authority: NONE`  |
| `MISSING_SERVICES_IMPLEMENTATION_GUIDE.md`                       | QUARANTINE AS UNAPPROVED PROPOSAL  | Added required proposal header and annotated original blocking claim   | `Status: PROPOSED`; `Approved: NO`; `Execution Authority: NONE`  |
| `package.json`                                                   | MANUAL REVIEW ONLY                 | No content change                                                      | Review recorded below; current file remains valid JSON           |
| `services/connector/wrangler.toml`                               | MANUAL SEMANTIC RECONCILIATION     | No content change                                                      | 2 unresolved conflict blocks remain; working-tree diff unchanged |
| `services/continuity/wrangler.toml`                              | MANUAL SEMANTIC RECONCILIATION     | No content change                                                      | 2 unresolved conflict blocks remain; working-tree diff unchanged |
| `services/gateway/wrangler.toml`                                 | MANUAL SEMANTIC RECONCILIATION     | No content change                                                      | 3 unresolved conflict blocks remain; working-tree diff unchanged |
| `services/iw-agent-runtime/wrangler.toml`                        | MANUAL SEMANTIC RECONCILIATION     | No content change                                                      | 1 unresolved conflict block remains; working-tree diff unchanged |

## `package.json` review only

The merge joined histories for which a local common merge-base was not available during this review, so no inferred synthetic pre-conflict file was created.

| State                         | Evidence                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pre-conflict                  | No common merge-base object was available; no file was altered or reconstructed                                     |
| Ours — `42236ce8`             | Valid JSON; `dev` is `pnpm --filter @integratewise/live dev`; `dev:all` is `turbo dev`; no exact `esbuild` override |
| Theirs — `251ba7d5`           | Valid JSON; `dev` is `turbo dev`; no `dev:all`; exact `esbuild` override is `0.25.0`                                |
| Merge result — `ebd3e9c5`     | `package.json` is absent from the committed merge tree while the worktree carried unresolved merge content          |
| Current — `7b5d27ad` worktree | Valid JSON; combines ours `dev` and `dev:all` with theirs exact `esbuild` override `0.25.0`                         |

No choice between these states was made in this recovery action.

## Verification evidence

1. `git diff` and `git status` were captured before this record was written.
2. All three post-stop `/api/spine/*` route files are absent.
3. `apps/live/__tests__/activation-journey.test.ts` is absent.
4. `CANONICAL_DEPLOYMENT_STATUS.md` is absent.
5. Repository search found no import or mount of `CustomerZeroFlow` outside its own component file.
6. No Cloudflare command was executed during this approved disposition action.
7. Wrangler conflict markers remain: connector 2 blocks, continuity 2 blocks, gateway 3 blocks, and agent runtime 1 block.
8. `git diff --exit-code` over the four Wrangler files reports no working-tree changes.
9. `pnpm-workspace.yaml`, `package.json`, and the Customer Zero prototype were not modified by this action.

## Result

The unauthorized post-stop API facades, placeholder tests, and inaccurate deployment-status document have been reverted. Historical and proposed documents are now explicitly classified, while runtime state, package semantics, Wrangler conflicts, and the unmounted simulated prototype remain untouched pending separate authority.
