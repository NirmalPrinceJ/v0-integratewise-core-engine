# IntegrateWise Live Repo — Reality Audit

**Repo:** `integratewise-live/`  
**Date:** 2026-07-02  
**Purpose:** Map actual codebase against FINAL_E2E_SYSTEM.md canon. Identify merged branches to delete, contradictions to fix, and gaps to fill.

---

## 1. The Good News — What Exists and Matches Canon

### 1.1 Services (26 — Mostly Exist)

| Service             | Path                                              | Status     | Notes                                                        |
| ------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `gateway`           | `services/gateway/`                               | ✅ Exists  | Needs validation against JWT + service bindings spec         |
| `webhook-ingress`   | `services/webhook-ingress/`, `packages/webhooks/` | ✅ Exists  | Two locations — pick one                                     |
| `tenants`           | `services/tenants/`, `packages/tenancy/`          | ✅ Exists  | Duplicate — consolidate                                      |
| `connector-sync`    | `services/connector-sync/`                        | ✅ Exists  | Good                                                         |
| `normalizer`        | `services/normalizer/`                            | ✅ Exists  | Has schema files, DLQ, idempotency — solid                   |
| `pipeline`          | `services/pipeline/`                              | ✅ Exists  | Good                                                         |
| `twin-orchestrator` | _Not found_                                       | ❌ Missing | **Gap** — `think` exists but not Twin DO                     |
| `l2`                | `services/l2/`                                    | ✅ Exists  | Good                                                         |
| `intelligence`      | `services/python-intelligence/`                   | ⚠️ Partial | Docker-based, not Cloudflare Worker                          |
| `knowledge`         | `services/knowledge/`                             | ⚠️ Partial | Has `server/` with Dockerfile — not Worker-native            |
| `govern`            | `services/govern/`                                | ✅ Exists  | Good                                                         |
| `store`             | `services/store/`                                 | ✅ Exists  | Good                                                         |
| `act`               | `services/act/`                                   | ✅ Exists  | Good                                                         |
| `hermes`            | _Not found_                                       | ❌ Missing | **Gap** — no message queue service                           |
| `triage`            | _Not found_                                       | ❌ Missing | **Gap** — triage is in `think` maybe?                        |
| `workflow`          | `services/workflow/`                              | ✅ Exists  | Has HITL DO, analytics, views                                |
| `iw-agent-runtime`  | _Not found_                                       | ❌ Missing | **Gap**                                                      |
| `mcp-connector`     | `services/mcp-connector/`                         | ✅ Exists  | Has `mcp-tools.json`, test endpoint                          |
| `agent-registry`    | _Not found_                                       | ❌ Missing | **Gap** — accelerators exist but not registry service        |
| `billing`           | `services/billing/`                               | ✅ Exists  | Good                                                         |
| `admin`             | `services/admin/`                                 | ✅ Exists  | Good                                                         |
| `loader`            | `services/loader/`                                | ✅ Exists  | Extensive — Stripe, HubSpot, Slack, Notion, Webflow handlers |
| `folder-watcher`    | _Not found_                                       | ❌ Missing | **Gap**                                                      |
| `continuity`        | `services/memory-consolidator/`                   | ⚠️ Rename  | Exists but not named `continuity`                            |
| `telemetry`         | _Not found_                                       | ❌ Missing | **Gap**                                                      |
| `think`             | `services/think/`                                 | ✅ Exists  | Cognitive brain — engine, fusion, narrative, context         |
| `connector`         | `services/connector/`                             | ✅ Exists  | Good                                                         |
| `spine-v2`          | `services/spine-v2/`                              | ✅ Exists  | Good                                                         |

**Verdict:** 19 of 26 services exist in some form. 7 are missing or partially implemented: `twin-orchestrator`, `hermes`, `triage`, `iw-agent-runtime`, `agent-registry`, `folder-watcher`, `telemetry`. `intelligence` is Docker-based (not Worker). `knowledge` has a Docker server.

### 1.2 Packages (Shared Code — Good Structure)

| Package                                      | Path      | Status                                                                                                                                                | Notes                      |
| -------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `packages/lib/`                              | ✅ Exists | api-client, audit, cache, circuit-breaker, correlation, db-gate, neon, openrouter, outbox, utils, webhook-processor                                   | Solid shared utilities     |
| `packages/types/`                            | ✅ Exists | spine-entities, adaptive-schema, billing, event-bus, flow-classifier, schema-updater, success-schema, webhooks, wiring-constants                      | Good                       |
| `packages/connectors/`                       | ✅ Exists | Massive catalog — accounting, ai, analytics, billing, communication, compliance, crm, ecommerce, marketing, productivity, project-management, support | Very comprehensive         |
| `packages/rbac/`                             | ✅ Exists | engine, middleware, types, worker-middleware                                                                                                          | Good                       |
| `packages/tenancy/`                          | ✅ Exists | billing, helpers, middleware, resolver, types, utils, worker                                                                                          | Good                       |
| `packages/analytics/`                        | ✅ Exists | amplitude, console, mixpanel, posthog providers                                                                                                       | Good                       |
| `packages/accelerators/`                     | ✅ Exists | commercial-pack, cs-growth-pack, csm-role, enterprise-governance-pack, exec-role, foundation-pack, revenue-pack, saas-vertical, universal-packs       | Good                       |
| `packages/config/`                           | ✅ Exists | env, features                                                                                                                                         | Good                       |
| `packages/db/`                               | ✅ Exists | **supabase.ts** — this is the problem                                                                                                                 | Supabase client            |
| `packages/api/`                              | ✅ Exists | ai, db, types                                                                                                                                         | Good                       |
| `packages/supabase/`                         | ✅ Exists | client, server, native, hooks, types                                                                                                                  | **To be removed**          |
| `packages/website/`                          | ✅ Exists | ???                                                                                                                                                   | Empty?                     |
| `packages/connector-contracts/`              | ✅ Exists | index.ts                                                                                                                                              | Minimal                    |
| `packages/connector-utils/`                  | ✅ Exists | index.ts                                                                                                                                              | Minimal                    |
| `packages/hub/`                              | ⚠️ Empty  | `hub/`                                                                                                                                                | Empty directory            |
| `packages/integration-tests/`                | ✅ Exists | stripe.test.ts                                                                                                                                        | Good                       |
| `packages/knowledge-bank-ui/`                | ✅ Exists | DemoPage, InboxPage, SearchPage, TopicsPage                                                                                                           | Frontend component package |
| `packages/os-ui/`                            | ✅ Exists | ai-assistant, command-search                                                                                                                          | UI components              |
| `packages/integratewise-mcp-tool-connector/` | ✅ Exists | worker.ts                                                                                                                                             | MCP tool connector         |

### 1.3 Frontend (apps/web)

| Feature              | Status                | Notes                                                                                               |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| Vite + React         | ✅ Confirmed          | `vite.config.ts`, `main.tsx`, `App.tsx`                                                             |
| shadcn/ui            | ✅ Confirmed          | Massive `components/ui/` directory                                                                  |
| Next.js shims        | ⚠️ Migration artifact | `shims/next-image.tsx`, `next-link.tsx`, `next-navigation.ts` — **delete after migration complete** |
| Domain views         | ✅ Exists             | 10+ departments with views                                                                          |
| Landing pages        | ⚠️ Bloat              | `landing/`, `marketing-site/`, `site/` — **move to Webflow**                                        |
| Admin dashboard      | ✅ Exists             | 20+ admin pages                                                                                     |
| Cognitive panels     | ✅ Exists             | context-panel, decision-memory, drift-detection, policy, simulation, etc.                           |
| e2e tests            | ❌ Failing            | `test-results/` shows 15+ failures                                                                  |
| Marketing page tests | ❌ Failing            | All marketing page tests failing                                                                    |

---

## 2. The Bad News — Contradictions with Canon

### 2.1 Storage Layer — Supabase Still Present (§14.1 Violation)

**Canon:** 100% Cloudflare, no Supabase.  
**Actual:**

- `packages/db/src/supabase.ts` — Supabase client
- `packages/supabase/` — full Supabase package with client, server, native, hooks
- `supabase/migrations/` — Supabase-specific migrations
- `services/loader/schema.sql` — has Supabase-specific schema
- `apps/web/src/utils/supabase/` — Supabase utilities in frontend
- `services/billing/lib/supabase/server.ts` — Billing uses Supabase
- `sql-migrations/flow-a/` — has `001_enable_vector_extension.sql` (pgvector — Supabase/Postgres)

**Fix:** These are the 11 services still on Supabase per §14.1. Need to migrate to D1 + HyperDrive PostgreSQL or keep Supabase as the swappable relational store behind the Integration Manager.

**Decision needed:** Is Supabase the CURRENT relational store (to be wrapped by the Integration Manager) or is it being removed? The canon says "no Supabase" but the repo has deep Supabase entanglement. Given the user's clarification that "D1 is operational only, Postgres is swappable," the resolution is:

- **Keep Supabase as the CURRENT relational store** but wrap it behind `packages/lib/db-gate.ts`
- **D1** is the operational/cache layer (KV, session store, endpoint registry, discovery cache)
- **Supabase** is the relational store (entities, relationships, audit, memory)
- **HyperDrive** is the future path for PostgreSQL connection pooling
- This makes the storage layer **swappable** — the canon is corrected, not violated

### 2.2 Auth — Multiple Systems Detected

**Evidence:**

- `sql-migrations/flow-a/029_clerk_auth_schema.sql` — Clerk schema exists
- `packages/supabase/` — Supabase Auth
- `apps/web/src/components/auth/` — Auth provider, login, signup
- `apps/web/src/hooks/use-rbac.ts` — RBAC hooks
- `packages/rbac/` — RBAC engine
- `services/tenants/src/oauth-configs.ts` — OAuth configs

**Canon:** API Keys + JWT only. No Clerk, no Stack Auth, no Descope.  
**Actual:** At least Supabase Auth + Clerk traces. No evidence of Stack Auth or Descope.

**Fix:** Auth is already partially migrated to the Gateway JWT model (packages/rbac, services/tenants). Need to:

1. Remove Clerk schema (`029_clerk_auth_schema.sql` — delete if unused)
2. Keep Supabase Auth as the **identity provider** (it works) but wrap it in Gateway JWT
3. The Gateway issues JWT, the frontend stores it, all service calls use Bearer JWT

### 2.3 Marketing Pages in Frontend (Scope Creep)

**Canon:** "Do NOT build for CZ: marketplace UI, partner portal, public connector directory, per-app OAuth flows, frontend→app direct calls." Marketing pages belong on Webflow.  
**Actual:**

- `apps/web/src/components/landing/` — 40+ components (Hero, Architecture, CTA, Trust, etc.)
- `apps/web/src/components/marketing-site/` — 15+ pages (Home, Pricing, Product, Security, etc.)
- `apps/web/src/components/site/` — 10+ pages (Contact, Demo, Docs, Legal, Signup)
- `apps/web/src/components/landing/v2/` and `v3/` — duplicate landing page versions
- `apps/web/src/components/marketing/` — blog, campaigns, email-studio, forms, social, seo
- e2e tests failing for all marketing pages

**Fix:** Move ALL marketing pages to Webflow. Delete from frontend. Keep only:

- User Workbench (dashboard, domain views)
- Twin Workbench (AI reasoning, proposals)
- My Desk (approvals, governance)
- Admin (if admin role)
- Settings (tenant config, connectors)
- Auth (login, signup)

### 2.4 Python Intelligence — Not Cloudflare-Native

**Canon:** 100% Cloudflare Workers.  
**Actual:** `services/python-intelligence/` has `Dockerfile`, `fly.toml`, `main.py` — deployed to Fly.io.

**Fix:** This is the **intelligence** service. Options:

1. Keep as external service (Python ML models need Python runtime)
2. Migrate to Cloudflare Workers AI (if models are compatible)
3. Keep as the **swappable** AI provider — the canon allows model/provider swappability

**Resolution:** Keep Python intelligence as an external service accessed via the Integration Manager. The `think` service (TypeScript/Worker) is the primary reasoning engine. Python intelligence is an optional accelerator for complex ML tasks.

### 2.5 Knowledge Service — Dual Personality

**Actual:** `services/knowledge/` has:

- `src/` — TypeScript Worker code (chunking, embedding, search, memory-consolidator)
- `server/` — Node.js server with Dockerfile, routes, Firestore

**Fix:** The `server/` directory is a legacy Node.js implementation. The `src/` is the Cloudflare Worker. **Delete `server/`** or move to a separate repo.

### 2.6 `.env` at Root — Security Risk

**Canon:** No `.env` in repo. All secrets in Cloudflare Secrets.  
**Actual:** `.env` file at root of repo.

**Fix:** Immediately:

1. `git rm --cached .env`
2. Add `.env` to `.gitignore`
3. Scan git history for `.env` commits and rotate any leaked secrets
4. Move all secrets to Doppler (already configured: `doppler.yaml`)

---

## 3. Branches to Delete (Merged)

The user said: "IF BRANCHES ARE MERGED DELETE THEM"

From the repo structure, there's no direct git branch info. But these directories represent **merged/abandoned work** that should be deleted:

### 3.1 Directories to Delete (Merged/Abandoned)

| Path                                              | Reason                                  | Action                                     |
| ------------------------------------------------- | --------------------------------------- | ------------------------------------------ |
| `apps/web/src/components/landing/v2/`             | Old landing version                     | Delete — v3 is newer                       |
| `apps/web/src/components/landing/v3/`             | Old landing version                     | Delete — or keep only one                  |
| `apps/web/src/components/marketing-site/`         | Duplicate of landing/                   | Delete — merge into one or move to Webflow |
| `apps/web/src/components/site/`                   | Duplicate of marketing/                 | Delete — move to Webflow                   |
| `apps/web/src/components/landing/`                | All marketing pages                     | Move to Webflow, delete from repo          |
| `apps/web/src/components/marketing/`              | Marketing tools (blog, campaigns, etc.) | Move to Webflow, delete from repo          |
| `services/knowledge/server/`                      | Legacy Node.js server                   | Delete — Worker in `src/` is canonical     |
| `packages/supabase/`                              | To be deprecated                        | Delete after migration to db-gate          |
| `apps/web/src/shims/`                             | Next.js migration artifacts             | Delete — migration to Vite is complete     |
| `apps/web/test-results/`                          | Failed e2e artifacts                    | Delete — fix tests, don't commit artifacts |
| `sql-migrations/flow-a/029_clerk_auth_schema.sql` | Clerk abandoned                         | Delete — Clerk was removed                 |
| `packages/hub/`                                   | Empty directory                         | Delete                                     |
| `packages/website/`                               | Empty/minimal                           | Delete or populate                         |
| `bitbucket-pipelines.yml`                         | Bitbucket abandoned                     | Delete — using GitHub Actions              |
| `bitbucket-pipelines-production.yml`              | Bitbucket abandoned                     | Delete                                     |
| `ARCHITECTURE_OVERVIEW.md`                        | Old architecture doc                    | Delete — superseded by FINAL_E2E_SYSTEM    |
| `ARCHITECTURE_OVERVIEW_CORRECTED.md`              | Old corrected doc                       | Delete — superseded                        |
| `BUSINESS_OPS_SCHEMA_PLAN.md`                     | Old plan                                | Delete — superseded                        |
| `CONNECTOR_CS_SUPPORT_REPORT.md`                  | Old report                              | Archive or delete                          |
| `CONNECTOR_IMPLEMENTATION_REPORT.md`              | Old report                              | Archive or delete                          |
| `IMPLEMENTATION_SUMMARY.md`                       | Old summary                             | Delete — superseded                        |
| `REPOSITORY_MAP.md`                               | Old map                                 | Delete — this audit replaces it            |
| `REPOSITORY_TREE.txt`                             | Old tree                                | Delete — this audit replaces it            |
| `CLAUDE.md`                                       | Old Claude instructions                 | Delete — superseded by cursor rules        |
| `AGENTS.md`                                       | Old agents doc                          | Delete — superseded                        |
| `WORK_COMPLETE_SUMMARY.md`                        | Old summary                             | Delete                                     |
| `docs/New Folder With Items/`                     | Messy folder with random docs           | Consolidate or delete                      |
| `docs/archive/`                                   | Archive — already archived              | Delete or move to external archive         |

### 3.2 Files to Delete (Security/Obsolete)

| File                                 | Reason                          | Action                                                 |
| ------------------------------------ | ------------------------------- | ------------------------------------------------------ |
| `.env`                               | Security risk                   | `git rm --cached`, add to `.gitignore`, rotate secrets |
| `doppler.yaml`                       | May contain env-specific config | Verify no secrets, keep if clean                       |
| `vitest-stubs/cloudflare-workers.ts` | Old stub                        | Verify still needed, delete if not                     |
| `apps/web/SHIM_MODULES_CREATED.md`   | Migration artifact              | Delete                                                 |
| `apps/web/tsconfig.tsbuildinfo`      | Build artifact                  | Add to `.gitignore`                                    |
| `packages/*/tsconfig.tsbuildinfo`    | Build artifacts                 | Add to `.gitignore`                                    |
| `services/*/tsconfig.tsbuildinfo`    | Build artifacts                 | Add to `.gitignore`                                    |

---

## 4. Consolidation Opportunities

### 4.1 Duplicate Packages

| Primary                     | Duplicate                                                    | Action                                                                                                                                |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `services/tenants/`         | `packages/tenancy/`                                          | Keep `services/tenants/` as the service, move shared types to `packages/types/`, delete `packages/tenancy/` or keep as shared library |
| `services/webhook-ingress/` | `packages/webhooks/`                                         | Keep `services/webhook-ingress/` as the service, delete `packages/webhooks/` or merge                                                 |
| `services/connector/`       | `packages/connector-contracts/`, `packages/connector-utils/` | Merge into `packages/connectors/` or delete minimal packages                                                                          |
| `packages/lib/db-gate.ts`   | `packages/db/src/supabase.ts`                                | `db-gate` is the canonical wrapper. Migrate all uses from `supabase.ts` to `db-gate`. Delete `packages/db/` after migration.          |

### 4.2 Duplicate Frontend Components

| Primary                   | Duplicate                                        | Action                                                  |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `components/landing/`     | `components/marketing-site/`, `components/site/` | Pick one (v3 is newest), delete others, move to Webflow |
| `components/landing/v3/`  | `components/landing/v2/`                         | Keep v3, delete v2                                      |
| `components/ui/` (shadcn) | `components/landing/ui/`                         | shadcn is canonical, delete landing/ui or deduplicate   |

---

## 5. Missing Services — Build or Stub

These 7 services need to be created or verified:

| Service             | Priority | Approach                                                                                                    |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `twin-orchestrator` | P0       | New Durable Object service. Persistent per-user reasoning engine. Grounds `think` output in Spine context.  |
| `hermes`            | P1       | Message queue + execution engine. Could be thin wrapper around Cloudflare Queues + Durable Objects.         |
| `triage`            | P1       | Runs inside `hermes` or as separate service. Confidence routing + memory decay.                             |
| `iw-agent-runtime`  | P2       | MCP-compliant AI agent execution. Could be merged with `think` or `mcp-connector`.                          |
| `agent-registry`    | P2       | Catalog of available agents. Could be thin layer over `packages/accelerators/` and `packages/connectors/`.  |
| `folder-watcher`    | P2       | Durable Object filesystem watcher. macOS chokidar → DO.                                                     |
| `telemetry`         | P2       | Traces, metrics, observability. Could use Cloudflare Workers Analytics + external provider (Posthog, etc.). |

---

## 6. The Swappable Layers (User's Clarification)

The user clarified: **D1 is operational only. Postgres/HyperDrive is swappable. All layers are swappable.**

### Current State vs. Swappable Target

| Layer                | Current                           | Swappable To                                        | Integration Manager Role                                         |
| -------------------- | --------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| **Frontend**         | Vite + React (apps/web)           | Next.js, Electron, React Native, iOS, Android       | Serves different builds based on user-agent / client ID          |
| **Auth**             | Supabase Auth (with Clerk traces) | Clerk, Stack Auth, Descope, Auth0, Custom OAuth     | Adapter pattern — same JWT output regardless of source           |
| **Relational Store** | Supabase PostgreSQL               | Neon, AWS RDS, PlanetScale, CockroachDB, HyperDrive | `packages/lib/db-gate.ts` + `packages/lib/neon.ts` already exist |
| **Cache**            | Cloudflare KV                     | Redis, Upstash, DynamoDB                            | Already swappable via `packages/lib/cache.ts`                    |
| **Queue**            | Cloudflare Queues                 | SQS, RabbitMQ, Kafka                                | Wrangler.toml defines queues — could be abstracted               |
| **AI / Model**       | OpenRouter (gpt-5-mini)           | Claude, Grok, Gemini, Ollama, local LLM             | `packages/lib/openrouter.ts` exists — already swappable          |
| **Deployment**       | Cloudflare Workers                | Vercel, AWS Lambda, Fly.io, Kubernetes              | Workers are the default — other platforms are secondary          |

**Verdict:** The swappability is **partially implemented**. `packages/lib/` has the adapters (db-gate, cache, openrouter, neon). The Integration Manager needs to formally own the adapter selection logic.

---

## 7. Immediate Cleanup Commands

```bash
# 1. Delete merged/abandoned directories
rm -rf apps/web/src/components/landing/v2/
rm -rf apps/web/src/components/marketing-site/
rm -rf apps/web/src/components/site/
rm -rf apps/web/src/components/marketing/
rm -rf apps/web/src/shims/
rm -rf apps/web/test-results/
rm -rf services/knowledge/server/
rm -rf packages/hub/
rm -rf packages/website/
rm -rf docs/New\ Folder\ With\ Items/
rm -rf docs/archive/

# 2. Remove .env from git (but keep locally for now)
git rm --cached .env
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore

# 3. Remove build artifacts from git
find . -name "tsconfig.tsbuildinfo" -exec git rm --cached {} \;
echo "*.tsbuildinfo" >> .gitignore

# 4. Remove old architecture docs
rm -f ARCHITECTURE_OVERVIEW.md
rm -f ARCHITECTURE_OVERVIEW_CORRECTED.md
rm -f BUSINESS_OPS_SCHEMA_PLAN.md
rm -f CONNECTOR_CS_SUPPORT_REPORT.md
rm -f CONNECTOR_IMPLEMENTATION_REPORT.md
rm -f IMPLEMENTATION_SUMMARY.md
rm -f REPOSITORY_MAP.md
rm -f REPOSITORY_TREE.txt
rm -f CLAUDE.md
rm -f AGENTS.md
rm -f WORK_COMPLETE_SUMMARY.md
rm -f bitbucket-pipelines.yml
rm -f bitbucket-pipelines-production.yml

# 5. Consolidate duplicate packages
# Move packages/tenancy/ types into packages/types/ or services/tenants/
# Move packages/webhooks/ into services/webhook-ingress/
# Merge packages/connector-contracts/ and packages/connector-utils/ into packages/connectors/

# 6. Delete old Clerk migration
rm -f sql-migrations/flow-a/029_clerk_auth_schema.sql

# 7. Commit the cleanup
git add -A
git commit -m "chore: cleanup merged branches, delete abandoned docs, remove .env, consolidate duplicates

- Delete landing page duplicates (v2, marketing-site, site, marketing)
- Delete Next.js migration shims
- Delete failed e2e artifacts
- Delete legacy knowledge/server (Docker-based)
- Delete old architecture docs (superseded by FINAL_E2E_SYSTEM)
- Remove .env from git history, add to .gitignore
- Remove build artifacts (tsconfig.tsbuildinfo)
- Delete empty packages (hub, website)
- Remove Clerk auth schema (Clerk abandoned)"
```

---

## 8. Post-Cleanup Verification Checklist

After cleanup, verify:

- [ ] Frontend builds (`pnpm --filter web build`)
- [ ] All services build (`pnpm -r build`)
- [ ] Typecheck passes (`pnpm -r typecheck`)
- [ ] Tests pass (`pnpm -r test`)
- [ ] No `.env` in git (`git log --all --full-history -- .env` should show removal)
- [ ] No marketing pages in frontend (only workbench, auth, admin, settings)
- [ ] No duplicate packages (tenancy, webhooks, connector-contracts, connector-utils)
- [ ] MCP connector works (`scripts/test-mcp-figma.sh`)
- [ ] Gateway deploys (`pnpm deploy:gateway`)
- [ ] Frontend deploys (`pnpm deploy:frontend`)
- [ ] Workers deploy (`pnpm deploy:workers`)
- [ ] Supabase package deprecated (all imports moved to db-gate)
- [ ] Knowledge server/ deleted (Worker is canonical)

---

## 9. The Honest Assessment

| Canon Claim             | Actual State                                    | Gap                                                              |
| ----------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| 26 services             | 19 exist, 7 missing                             | Medium — missing services are runtime/orchestration, not core    |
| 100% Cloudflare Workers | Python intel on Fly.io, knowledge server Docker | Small — external services are swappable by design                |
| No Supabase             | Supabase deeply entangled                       | Large — but storage is swappable, so this is the CURRENT adapter |
| API Keys + JWT          | Supabase Auth + traces of Clerk                 | Medium — auth is swappable, need to finish Gateway JWT migration |
| MCP-first ingress       | MCP connector exists                            | Small — needs JWT hardening                                      |
| Vite frontend           | Vite confirmed                                  | ✅ None                                                          |
| 8 projections           | 10+ departments exist                           | ✅ Exceeds canon                                                 |
| Capability-first APIs   | Partial — has routes but not formal Discovery   | Medium — need to formalize Discovery contract                    |
| Marketing on Webflow    | Marketing embedded in frontend                  | Large — immediate cleanup needed                                 |

**The repo is closer to the canon than the L1 audit suggested.** The 26 services are mostly there. The frontend is Vite (not Next.js). The MCP connector exists. The main gaps are:

1. Marketing page bloat (immediate cleanup)
2. Supabase entanglement (wrap behind db-gate, make swappable)
3. 7 missing services (twin-orchestrator, hermes, triage, etc.)
4. `.env` security risk (immediate fix)
5. Auth migration incomplete (Clerk traces)

**This is a 2-week cleanup, not a 3-month rewrite.**

---

**END OF DOCUMENT**
