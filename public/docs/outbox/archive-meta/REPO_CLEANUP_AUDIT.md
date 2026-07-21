# IntegrateWise Repo Cleanup Audit

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

> Generated: 2026-06-30 | Auditor: Claude (Cowork)
> Architecture baseline: v3.8.0, DECISIONS 22–27

---

## Summary

| Category                             | Count                          | Severity |
| ------------------------------------ | ------------------------------ | -------- |
| Root markdown clutter                | 59 orphan `.md` files          | Medium   |
| Supabase remnants in source          | 316 files (`.ts`/`.tsx`/`.js`) | High     |
| Legacy pre-consolidation services    | 6 workers                      | Medium   |
| Dead/mystery root dirs               | 5 dirs                         | High     |
| `apps/web` framework mismatch        | Next.js ≠ CLAUDE.md says Vite  | High     |
| `apps/web.old` (stale backup)        | 24 MB                          | Medium   |
| Editor/AI tool caches in repo        | ~65 MB                         | Low      |
| `packages/supabase` (entire package) | Should not exist               | High     |
| `packages/db/src/supabase.ts`        | Legacy DB client               | High     |
| `packages/lib/src/neon.ts`           | Legacy Neon/DB client          | High     |
| Dist folders committed to git        | 12 packages                    | Low–Med  |
| Neon/legacy DB references in source  | ~10 files                      | High     |
| `supabase/` dir at repo root         | Full Supabase config           | High     |
| `migrations/supabase-export/`        | Should be archived             | Medium   |
| `twilight-limit-8567/` mystery dir   | CF template, not IW code       | High     |

---

## 1. Root-Level Markdown Clutter (59 files)

**The problem:** 59 `.md` files live at repo root. Most are AI-generated session artifacts, delivery summaries, phase completion notes, and architecture drafts that have since been superseded or committed to `docs/`.

**Keep:** `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `AGENTS.md`

**Move to `docs/`:** Anything still relevant (architecture references, deployment guides)

**Delete:** All `*_COMPLETE.md`, `*_SUMMARY.md`, `PHASE_*.md`, `DELIVERY_*.md`, `DEPLOYMENT_*.md`, `MERGE_SUMMARY_*.md`, `SESSION_SUMMARY_*.md`, `VERCEL_DEPLOYMENT_STATUS.md` and similar ephemeral artifacts.

Files to delete (54 files — all except the 5 above):

```
AI_AGENT_PROVIDER_ARCHITECTURE.md  AI_HOME_SPEC.md  ARCHITECTURE.md
ARCHITECTURE_DIAGRAMS.md  ARCHITECTURE_INDEX.md  ARCHITECTURE_REFERENCE.md
ARCHITECTURE_SCORES_v1.0.md  ARCHITECTURE_VISUALIZATION_COMPLETE.md
AUTH_CONNECTOR_INTEGRATION.md  BACKEND_CONSOLIDATION_v1.0.md
CAPABILITY_RESOLVER_PATTERN.md  CLEANUP_SUMMARY.md
COMPLETE_PROVIDER_AGNOSTIC_GUIDE.md  CONTINUITY_BRIDGE_COMPLETE.md
CORE_ENGINE_EXCAVATION.md  CUSTOMER_ZERO_LAUNCH.md  DELIVERY_COMPLETE.md
DEPLOYMENT_ANALYSIS_FULL.md  DEPLOYMENT_FIX.md  DEPLOYMENT_READY.md
DEPLOYMENT_SUMMARY.md  DIAGRAM_VERIFICATION.md  ECOSYSTEM.md
ENDPOINTS_SUMMARY.md  FEATURE_BUCKET_LIST.md  FINAL_DELIVERY_SUMMARY.md
GO_LIVE_DEPLOYMENT_GUIDE.md  HANDOFF_ACCEPTANCE.md  IMPLEMENTATION_COMPLETE.md
INTEGRATED_VISION.md  INTEGRATEWISE_RECOVERY_PLAN.md  INTEGRATION_REMOVAL_PLAN.md
L1_CHAT_SHELL_IMPLEMENTATION.md  MCP_ADK_SPINE_CACHE_ARCHITECTURE.md
MERGE_SUMMARY_FROM_MAIN.md  ONE_CONNECTOR_ARCHITECTURE.md
PHASE_1_COMPLETE.md  PHASE_1_EXECUTION.md  PHASE_2A_COMPLETE.md
PLATFORM_ACTIVATION_FRAMEWORK.md  PLATFORM_ADAPTER_LAYER.md  PLATFORM_DELIVERY.md
PRODUCT_MAPPING_RECOVERY.md  PRODUCT_PHILOSOPHY.md  PROJECTION_OS_ARCHITECTURE.md
PROJECT_STATUS_AND_DEPLOYMENT.md  PROVIDER_AGNOSTIC_ARCHITECTURE.md
RECOVERY_PLAN_EXECUTIVE_SUMMARY.md  REPOSITORY_SUMMARY.md
SESSION_SUMMARY_2026_06_25_26.md  SPINE_CONNECTION_POOL_ARCHITECTURE.md
SPINE_SCHEMA_SYNTHESIS.md  SYSTEM_ARCHITECTURE.md  THREE_PILLARS_ARCHITECTURE.md
UNIVERSAL_CONNECTION_POOL_ARCHITECTURE.md  VERCEL_DEPLOYMENT_STATUS.md
```

**Also delete:** `REPOSITORY_TREE.txt` (generated artifact), `integratewise-docs.patch`, `spine-pipeline-backend.patch`

---

## 2. `apps/web` Framework Mismatch ⚠️ HIGH PRIORITY

**The problem:** CLAUDE.md declares `apps/web` as a "Vite + React 18 SPA" and references `src/AppShell.tsx`, `src/lib/auth-manager.ts`. In reality, `apps/web` is a **Next.js 16 App Router app** with `@clerk/nextjs`, `@supabase/ssr`, `@supabase/supabase-js`, and a `next.config.mjs`. Neither `src/AppShell.tsx` nor `src/lib/auth-manager.ts` exist.

**The actual Vite SPA** is `apps/web.old` — which still has `index.html`, `vite.config`, and the original Vite structure.

**Actions needed:**

- Decide which is the canonical frontend and update CLAUDE.md to match reality
- `apps/web` uses Clerk auth (not CF Gateway credential auth as documented) — reconcile
- `apps/web` uses `@supabase/ssr` and `@supabase/supabase-js` directly — violates DECISION 22
- Remove Supabase client calls from `apps/web/app/auth/callback/route.ts`, `apps/web/supabase/` dir, and ~30 other web files
- `apps/web.old` (24 MB) — archive or delete once canonical app is confirmed

---

## 3. Supabase Remnants (316 source files)

**The problem:** DECISION 22 banned Supabase from the product plane. 316 `.ts`/`.tsx`/`.js` files still import or reference it.

**Highest-priority removals:**

| File                                    | Issue                                |
| --------------------------------------- | ------------------------------------ |
| `packages/supabase/`                    | Entire package — should be deleted   |
| `packages/db/src/supabase.ts`           | Supabase DB client — replace with D1 |
| `packages/db/src/index.ts`              | Exports Supabase client              |
| `packages/rbac/src/engine.ts`           | RBAC uses Supabase                   |
| `packages/types/src/schema-accessor.ts` | Supabase schema access               |
| `packages/types/src/schema-updater.ts`  | Supabase schema writes               |
| `packages/lib/src/audit.ts`             | Audit writes to Supabase             |
| `packages/lib/src/circuit-breaker.ts`   | Circuit breaker references Supabase  |
| `packages/connector-utils/src/index.ts` | Connector utils use Supabase         |
| `apps/web/app/auth/callback/route.ts`   | Supabase auth callback               |
| `apps/web/supabase/`                    | Supabase migrations inside web app   |

**Also flag:** `migrations/supabase-export/` — keep for historical reference but add a clear README that these are retired migrations, not active schema.

---

## 4. Legacy Services (pre-consolidation workers, DECISION 16)

Per DECISION 16, these are "reference only" but are still active Workers with `wrangler.toml`:

| Service               | Files          | Status                                           |
| --------------------- | -------------- | ------------------------------------------------ |
| `services/loader`     | 33 `.ts` files | Pre-consolidation — absorbed into `pipeline`     |
| `services/normalizer` | 11 `.ts` files | Pre-consolidation — absorbed into `pipeline`     |
| `services/think`      | 22 `.ts` files | Pre-consolidation — absorbed into `intelligence` |
| `services/act`        | 2 `.ts` files  | Pre-consolidation — absorbed into `intelligence` |
| `services/govern`     | 10 `.ts` files | Pre-consolidation — absorbed into `intelligence` |
| `services/store`      | 3 `.ts` files  | Pre-consolidation — absorbed into `pipeline`     |

**Recommendation:** Move these into `infra/retirement/` or a `services/_legacy/` subdirectory to make clear they are not deployed. Remove from Cloudflare if deployed there. Do NOT delete yet — they are reference material for the consolidation migration.

**Also flag (ambiguous status):**

- `services/hermes` — not in CLAUDE.md service list; purpose unclear
- `services/huggingface-inference` — 1 file; likely an experiment
- `services/core-engine` — not in CLAUDE.md active list; 5 files
- `services/schema-ai` — not in CLAUDE.md active list; 3 files
- `services/projection-engine` — 4 files; listed in architecture but not active workers list
- `services/projection-registry` — 1 file; same
- `services/capability-resolver` — 1 file; same
- `services/agent-registry` — 1 file; same
- `services/telemetry` — 1 file; same

---

## 5. Dead / Mystery Root Directories

| Dir                    | Size                       | What it is                                                                                                                                                                                            | Action                                           |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `twilight-limit-8567/` | Large (has `node_modules`) | A **Cloudflare Workflows template demo** — not IW code at all. Has its own `package.json`, `wrangler.jsonc`, React Vite frontend. Appears to be a CF starter template that was checked in by mistake. | **Delete**                                       |
| `file-mis/`            | Tiny                       | Contains one `mockup.html`. Already in `.gitignore`.                                                                                                                                                  | **Delete**                                       |
| `vitest-stubs/`        | Tiny                       | One `cloudflare-workers.ts` stub.                                                                                                                                                                     | Move to `packages/` or `tests/` or delete        |
| `mcp/figma/`           | Small                      | Figma MCP integration — unclear if active. Not in CLAUDE.md service list.                                                                                                                             | Clarify ownership; move to `packages/` if active |
| `infra/retirement/`    | Small                      | Retirement scripts for old buckets. Keep, but ensure `.gitignore` excludes generated outputs.                                                                                                         |

---

## 6. Packages to Remove or Relocate

| Package                        | Issue                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `packages/supabase`            | Entire package exists solely for Supabase — delete after migration             |
| `packages/hermes-spine-memory` | Purpose unclear; not in CLAUDE.md; may be legacy                               |
| `packages/coda-pack`           | Coda integration — not in architecture; likely prototype                       |
| `packages/knowledge-bank-ui`   | Standalone UI component for KB — unclear if active or if it belongs in `apps/` |
| `packages/website`             | Empty (12K); marketing site is in separate `integratewise-marketing` repo      |
| `packages/lib/src/neon.ts`     | Neon (legacy Postgres) client — delete when D1 migration is complete           |

---

## 7. Editor / AI Tool Cache Directories

These are in `.gitignore` but accumulate size locally. Safe to delete from disk at any time:

| Dir                     | Size   | Notes                                  |
| ----------------------- | ------ | -------------------------------------- |
| `.opencode/`            | 57 MB  | Huge; node_modules inside              |
| `.aider.tags.cache.v4/` | 3.3 MB | Aider AI cache                         |
| `.v0-ref/`              | 3.2 MB | v0.dev reference                       |
| `.playwright-mcp/`      | 1.1 MB | Playwright MCP                         |
| `.kiro/`                | 700 KB | Kiro IDE (steering kept per gitignore) |
| `.kimi/`                | 64 KB  | Kimi AI                                |
| `.iw-memory/`           | 40 KB  | IW memory specs                        |

Run: `rm -rf .opencode .aider.tags.cache.v4 .v0-ref .playwright-mcp .kimi`
(Keep `.kiro/steering/` per `.gitignore` rule)

---

## 8. Dist Folders Committed to Git

12 packages have `dist/` directories committed to the repo. These are build artifacts and should not be in git. They bloat the repo and create confusion about source of truth.

```
packages/connectors/dist        packages/rbac/dist
packages/types/dist             packages/accelerators/dist
packages/config/dist            packages/integratewise-mcp-tool-connector/dist
packages/contracts/dist         packages/supabase/dist
packages/connector-contracts/dist  packages/hermes-spine-memory/dist
packages/lib/dist               packages/analytics/dist
```

**Action:** Add `dist/` to `.gitignore` for each package, delete committed dist folders, ensure CI builds them. (Already in root `.gitignore` as `dist/` — check if monorepo config overrides this.)

---

## 9. Neon / Legacy DB References

`packages/lib/src/neon.ts` is a Neon (Postgres) client. Referenced by:

- `packages/lib/src/circuit-breaker.ts`
- `packages/lib/src/index.ts`
- `packages/connector-utils/src/index.ts`
- `apps/web/lib/circuit-breaker.ts`
- `apps/web/lib/outbox.ts`
- `apps/web/app/api/health/route.ts`
- `apps/web/app/api/cron/integrity-check/route.ts`

All should be migrated to D1 per DECISION 22.

---

## 10. CLAUDE.md Accuracy Issues

CLAUDE.md is the agent guide, so it must reflect reality. Current gaps:

| Claim in CLAUDE.md                                 | Reality                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| `apps/web` is "Vite + React 18 SPA"                | It's Next.js 16 App Router with Clerk                             |
| `src/AppShell.tsx` key file                        | Does not exist                                                    |
| `src/lib/auth-manager.ts` key file                 | Does not exist                                                    |
| Auth is "CF Gateway credential auth, not Supabase" | `apps/web` still has `@supabase/ssr` and `@clerk/nextjs`          |
| "no bff" in active services                        | `services/l2` has a wrangler.toml and is named `integratewise-l2` |

---

## Priority Order for Cleanup

**Do immediately (no code risk):**

1. Delete `twilight-limit-8567/` (unrelated CF demo template)
2. Delete 54 root-level orphan `.md` files, `.txt`, `.patch` files
3. Delete `file-mis/`
4. Delete editor caches (`.opencode`, `.aider.tags.cache.v4`, etc.)
5. Delete `apps/web.old/` (after confirming canonical app)
6. Add `dist/` per-package `.gitignore` entries and remove committed dists

**Do with code review:** 7. Delete `packages/supabase/` entirely 8. Delete `packages/lib/src/neon.ts` and remove all callsites 9. Migrate `packages/db/src/supabase.ts` to D1 10. Remove Supabase from `apps/web` (`@supabase/ssr`, `@supabase/supabase-js`, `supabase/` dir) 11. Remove Clerk from `apps/web` if CF Gateway credential auth is the intended path 12. Move legacy services to `services/_legacy/` or `infra/retirement/`

**Do after careful audit:** 13. Clarify and either promote or delete: `services/hermes`, `services/schema-ai`, `services/core-engine`, `packages/hermes-spine-memory`, `packages/coda-pack`, `packages/knowledge-bank-ui` 14. Update CLAUDE.md to match actual `apps/web` framework and auth

---

_Total estimated size recoverable from easy deletes: ~90+ MB (editor caches + web.old + twilight node_modules)_
