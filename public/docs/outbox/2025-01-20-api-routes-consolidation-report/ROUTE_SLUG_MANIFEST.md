# API Routes Consolidation Mapping Report

**Date:** 2025-01-20  
**Source:** `_reference/app/app/api/` (66 routes from original app)  
**Target:** `packages/api/src/` (Hono backend) + `apps/workspace/` (Next.js routes)  
**Strategy:** Prioritize merging into Hono backend for consistency. Preserve existing auth.ts, entities, metrics, and onboarding endpoints.

---

## Legend

- **MERGE** → Ported/rewritten into `packages/api/src/` as Hono routes using D1
- **KEEP** → Retained as Next.js API route in `apps/workspace/` (complex AI streaming, Supabase-specific, or edge-specific)
- **DISCARD** → Redundant with existing backend or no longer needed
- **DEFER** → Complex dependency chain; keep in reference for future migration

---

## 1. Billing & Payments (10 routes)

| Route                             | Decision    | Action Taken                                     | Notes                                                     |
| --------------------------------- | ----------- | ------------------------------------------------ | --------------------------------------------------------- |
| `/api/billing/plans`              | **MERGE**   | Added to `packages/api/src/billing.ts`           | Returns subscription tiers from DB or config              |
| `/api/billing/subscription`       | **MERGE**   | Added to `packages/api/src/billing.ts`           | Fetch tenant subscription status                          |
| `/api/billing/entitlements`       | **MERGE**   | Added to `packages/api/src/billing.ts`           | Check feature flags per tenant                            |
| `/api/billing/invoices`           | **MERGE**   | Added to `packages/api/src/billing.ts`           | List tenant invoices from DB                              |
| `/api/billing/checkout`           | **MERGE**   | Added to `packages/api/src/billing.ts`           | Stripe checkout session creation                          |
| `/api/billing/subscribe`          | **MERGE**   | Added to `packages/api/src/billing.ts`           | Create subscription                                       |
| `/api/billing/cancel`             | **MERGE**   | Added to `packages/api/src/billing.ts`           | Cancel subscription                                       |
| `/api/billing/change-plan`        | **MERGE**   | Added to `packages/api/src/billing.ts`           | Upgrade/downgrade plan                                    |
| `/api/billing/webhook/[provider]` | **MERGE**   | Consolidated into `packages/api/src/webhooks.ts` | Stripe/Razorpay/Cashfree/PhonePe webhooks                 |
| `/api/stripe/webhook`             | **DISCARD** | —                                                | Redundant with `/webhooks/stripe` already in Hono backend |

**New file:** `packages/api/src/billing.ts` — Sub-router mounted in `index.ts`  
**New file:** `packages/api/src/webhooks.ts` — Consolidated webhook handlers (expanded from inline routes in `index.ts`)

---

## 2. Health & Diagnostics (5 routes)

| Route             | Decision    | Action Taken | Notes                                                     |
| ----------------- | ----------- | ------------ | --------------------------------------------------------- |
| `/api/health`     | **DISCARD** | —            | Already served by `/api` and `/` in Hono                  |
| `/api/liveness`   | **DISCARD** | —            | Redundant; D1 connectivity check added to `/api/health`   |
| `/api/ping`       | **DISCARD** | —            | Redundant                                                 |
| `/api/readiness`  | **DISCARD** | —            | Redundant; D1 readiness check added to `/api/health`      |
| `/api/env/health` | **DISCARD** | —            | Supabase-specific env checks; not needed in D1/Hono stack |

**Enhanced:** `GET /api/health` in `index.ts` now returns D1 status, AI binding status, and env check.

---

## 3. Auth & Session (2 routes)

| Route                      | Decision    | Action Taken                                                            | Notes                                                                 |
| -------------------------- | ----------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `/api/session`             | **DISCARD** | —                                                                       | Supabase auth session; replaced by `GET /api/auth/me` in Hono auth.ts |
| `/api/workspace/bootstrap` | **MERGE**   | Added to `packages/api/src/index.ts` as `POST /api/workspace/bootstrap` | Idempotent org/workspace creation; adapted to D1 schema               |

---

## 4. Search (1 route)

| Route         | Decision  | Action Taken                                              | Notes                                                 |
| ------------- | --------- | --------------------------------------------------------- | ----------------------------------------------------- |
| `/api/search` | **MERGE** | Added to `packages/api/src/index.ts` as `GET /api/search` | Full-text search across entities using `entities_fts` |

---

## 5. Metrics & Insights (4 routes)

| Route                    | Decision    | Action Taken                            | Notes                                             |
| ------------------------ | ----------- | --------------------------------------- | ------------------------------------------------- |
| `/api/metrics/kpis`      | **DISCARD** | —                                       | Already exists as `GET /api/metrics/kpis` in Hono |
| `/api/insights/patterns` | **MERGE**   | Added to `packages/api/src/insights.ts` | Pattern detection over entity history             |
| `/api/spend/summary`     | **MERGE**   | Added to `packages/api/src/spend.ts`    | Aggregated spend summary                          |
| `/api/spend/trend`       | **MERGE**   | Added to `packages/api/src/spend.ts`    | Spend trend over time                             |

**New file:** `packages/api/src/insights.ts`  
**New file:** `packages/api/src/spend.ts`

---

## 6. Customer Success & Goals (2 routes)

| Route                  | Decision  | Action Taken                         | Notes                               |
| ---------------------- | --------- | ------------------------------------ | ----------------------------------- |
| `/api/cs/health-score` | **MERGE** | Added to `packages/api/src/cs.ts`    | Health score calculation per entity |
| `/api/goals/progress`  | **MERGE** | Added to `packages/api/src/goals.ts` | Goal progress tracking              |

**New file:** `packages/api/src/cs.ts`  
**New file:** `packages/api/src/goals.ts`

---

## 7. Support & Sync (3 routes)

| Route                  | Decision  | Action Taken                         | Notes                                |
| ---------------------- | --------- | ------------------------------------ | ------------------------------------ |
| `/api/support/contact` | **MERGE** | Added to `packages/api/src/index.ts` | Simple support ticket creation in DB |
| `/api/sync/schedule`   | **MERGE** | Added to `packages/api/src/sync.ts`  | Sync schedule CRUD                   |
| `/api/data-sync`       | **MERGE** | Added to `packages/api/src/sync.ts`  | Manual sync trigger                  |

**New file:** `packages/api/src/sync.ts`

---

## 8. Webhooks — CRM & Productivity (7 routes)

| Route                            | Decision    | Action Taken                                                      | Notes                                                                                   |
| -------------------------------- | ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `/api/webhooks/hubspot`          | **MERGE**   | Enhanced `packages/api/src/webhooks.ts`                           | More detailed contact/deal/company sync                                                 |
| `/api/webhooks/asana`            | **MERGE**   | Added to `packages/api/src/webhooks.ts`                           | Asana task → entity sync                                                                |
| `/api/webhooks/slack`            | **KEEP**    | Ported to `apps/workspace/api/webhooks/slack/route.ts`            | Complex interactive signatures + triage AI; needs Node crypto for Ed25519               |
| `/api/webhooks/discord`          | **KEEP**    | Ported to `apps/workspace/api/webhooks/discord/route.ts`          | Ed25519 verification; Cloudflare Workers can do this but the library stack is different |
| `/api/webhooks/[provider]`       | **KEEP**    | Ported to `apps/workspace/api/webhooks/[provider]/route.ts`       | Generic dispatcher for 10+ providers; too large to inline                               |
| `/api/webhooks/ai-relay`         | **KEEP**    | Ported to `apps/workspace/api/webhooks/ai-relay/route.ts`         | HMAC-SHA256 custom signature; specific to relay architecture                            |
| `/api/webhooks/brainstorm`       | **KEEP**    | Ported to `apps/workspace/api/webhooks/brainstorm/route.ts`       | Brainstorm-specific webhook                                                             |
| `/api/webhooks/health`           | **MERGE**   | Added to `packages/api/src/webhooks.ts`                           | Simple DB connectivity check for webhooks                                               |
| `/api/webhook`                   | **KEEP**    | Ported to `apps/workspace/api/webhook/route.ts`                   | Generic inbound webhook with API secret                                                 |
| `/api/webhook-scheduler/trigger` | **KEEP**    | Ported to `apps/workspace/api/webhook-scheduler/trigger/route.ts` | Complex scheduler trigger with Slack/Discord notifications                              |
| `/api/hubspot/sync`              | **DISCARD** | —                                                                 | Redundant with `/api/webhooks/hubspot` + manual sync endpoint                           |

**Expanded:** `packages/api/src/webhooks.ts` — Extracted from inline routes in `index.ts` into dedicated module. Added Asana, enhanced HubSpot.

---

## 9. AI & Chat (3 routes)

| Route                            | Decision | Action Taken                                                      | Notes                                                                                                                                      |
| -------------------------------- | -------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/ai/chat`                   | **KEEP** | Ported to `apps/workspace/api/ai/chat/route.ts`                   | Uses Vercel AI SDK (`ai` package) with `streamText` + `convertToModelMessages`; incompatible with Cloudflare Workers Hono without bundling |
| `/api/chat/stream`               | **KEEP** | Ported to `apps/workspace/api/chat/stream/route.ts`               | Uses `@ai-sdk/openai` + Vercel streaming; needs Next.js edge runtime                                                                       |
| `/api/brainstorm/analyze`        | **KEEP** | Ported to `apps/workspace/api/brainstorm/analyze/route.ts`        | Complex AI workflow with Zod schema + Vercel AI SDK                                                                                        |
| `/api/brainstorm/daily-insights` | **KEEP** | Ported to `apps/workspace/api/brainstorm/daily-insights/route.ts` | Vercel AI SDK + cron trigger                                                                                                               |
| `/api/brainstorm/execute`        | **KEEP** | Ported to `apps/workspace/api/brainstorm/execute/route.ts`        | Complex multi-step AI execution                                                                                                            |

**Note:** These use the Vercel AI SDK (`ai`, `@ai-sdk/openai`) which has Node.js-specific streaming. Keeping in Next.js allows continued use. Future: port to Cloudflare Workers AI binding (`c.env.AI`) when Vercel AI SDK supports it fully.

---

## 10. Cron Jobs (6 routes)

| Route                       | Decision | Action Taken                                                 | Notes                                                  |
| --------------------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| `/api/cron/daily-insights`  | **KEEP** | Ported to `apps/workspace/api/cron/daily-insights/route.ts`  | Vercel Cron; triggers `/api/brainstorm/daily-insights` |
| `/api/cron/hourly-insights` | **KEEP** | Ported to `apps/workspace/api/cron/hourly-insights/route.ts` | Complex multi-provider AI insights                     |
| `/api/cron/integrity-check` | **KEEP** | Ported to `apps/workspace/api/cron/integrity-check/route.ts` | Neon DB integrity checks; D1 doesn't need this         |
| `/api/cron/outbox`          | **KEEP** | Ported to `apps/workspace/api/cron/outbox/route.ts`          | Outbox pattern processing                              |
| `/api/cron/spend-insights`  | **KEEP** | Ported to `apps/workspace/api/cron/spend-insights/route.ts`  | Spend insights cron                                    |
| `/api/cron/sync-scheduler`  | **KEEP** | Ported to `apps/workspace/api/cron/sync-scheduler/route.ts`  | Sync scheduler cron                                    |

**Note:** These are Vercel Cron format. In Cloudflare stack, these should become Cloudflare Cron Triggers on the Worker. For now, kept as Next.js routes. Future: migrate to `wrangler.toml` cron triggers.

---

## 11. Loader System (9 routes)

| Route                          | Decision | Action Taken                                                    | Notes                                                             |
| ------------------------------ | -------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| `/api/loader/[source]`         | **KEEP** | Ported to `apps/workspace/api/loader/[source]/route.ts`         | Complex loader dispatcher (HubSpot, Notion, Sheets, Gmail, Slack) |
| `/api/loader/analyze-template` | **KEEP** | Ported to `apps/workspace/api/loader/analyze-template/route.ts` | Notion client SDK + template analysis                             |
| `/api/loader/creamy-preview`   | **KEEP** | Ported to `apps/workspace/api/loader/creamy-preview/route.ts`   | Loader preview system                                             |
| `/api/loader/generate-schema`  | **KEEP** | Ported to `apps/workspace/api/loader/generate-schema/route.ts`  | AI-powered schema generation                                      |
| `/api/loader/input-source`     | **KEEP** | Ported to `apps/workspace/api/loader/input-source/route.ts`     | Input source management                                           |
| `/api/loader/render`           | **KEEP** | Ported to `apps/workspace/api/loader/render/route.ts`           | Universal renderer with Notion SDK                                |
| `/api/loader/stage1`           | **KEEP** | Ported to `apps/workspace/api/loader/stage1/route.ts`           | Creamy layer extraction                                           |
| `/api/loader/stage2`           | **KEEP** | Ported to `apps/workspace/api/loader/stage2/route.ts`           | Full extraction stage                                             |
| `/api/loader/sync`             | **KEEP** | Ported to `apps/workspace/api/loader/sync/route.ts`             | Loader sync scheduler                                             |

**Reason:** The loader system is a large subsystem with 9 routes, many external SDKs (Notion, HubSpot, Google Sheets, Gmail), and complex AI integration. Moving it to Hono would require rewriting all SDK calls for Cloudflare Workers. This is a Phase 2 migration.

---

## 12. BYOM / BYOT / Templates (3 routes)

| Route                     | Decision  | Action Taken                                 | Notes                                                                                      |
| ------------------------- | --------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/api/byom`               | **KEEP**  | Ported to `apps/workspace/api/byom/route.ts` | BYOM uses Supabase SSR + `@supabase/ssr` + cookies; deeply tied to Next.js server patterns |
| `/api/byot`               | **KEEP**  | Ported to `apps/workspace/api/byot/route.ts` | BYOT uses Supabase SSR + cookie-based auth                                                 |
| `/api/templates/download` | **MERGE** | Added to `packages/api/src/index.ts`         | Static template definitions moved to DB-driven endpoint                                    |

---

## 13. Neutron (Browser Tab Intelligence) (3 routes)

| Route                  | Decision | Action Taken                                            | Notes                       |
| ---------------------- | -------- | ------------------------------------------------------- | --------------------------- |
| `/api/neutron/ingest`  | **KEEP** | Ported to `apps/workspace/api/neutron/ingest/route.ts`  | Uses Supabase SSR + Neon DB |
| `/api/neutron/clear`   | **KEEP** | Ported to `apps/workspace/api/neutron/clear/route.ts`   | Uses Supabase SSR + Neon DB |
| `/api/neutron/promote` | **KEEP** | Ported to `apps/workspace/api/neutron/promote/route.ts` | Uses Supabase SSR + Neon DB |

**Reason:** Neutron depends on a separate Neon Postgres database (`@/lib/neon`) and Supabase SSR auth. These are external to the D1 data model. Future: migrate to D1 or keep as external service.

---

## 14. Analytics & Tracking (2 routes)

| Route                | Decision  | Action Taken                                    | Notes                                   |
| -------------------- | --------- | ----------------------------------------------- | --------------------------------------- |
| `/api/capture`       | **KEEP**  | Ported to `apps/workspace/api/capture/route.ts` | Capture API with API secret validation  |
| `/api/website/track` | **MERGE** | Added to `packages/api/src/analytics.ts`        | Visitor tracking endpoint; writes to D1 |

**New file:** `packages/api/src/analytics.ts`

---

## Summary

| Category             | Count  | MERGE  | KEEP   | DISCARD |
| -------------------- | ------ | ------ | ------ | ------- |
| Billing & Payments   | 10     | 9      | 0      | 1       |
| Health & Diagnostics | 5      | 0      | 0      | 5       |
| Auth & Session       | 2      | 1      | 0      | 1       |
| Search               | 1      | 1      | 0      | 0       |
| Metrics & Insights   | 4      | 3      | 0      | 1       |
| CS & Goals           | 2      | 2      | 0      | 0       |
| Support & Sync       | 3      | 3      | 0      | 0       |
| Webhooks             | 11     | 3      | 7      | 1       |
| AI & Chat            | 5      | 0      | 5      | 0       |
| Cron Jobs            | 6      | 0      | 6      | 0       |
| Loader System        | 9      | 0      | 9      | 0       |
| BYOM/BYOT/Templates  | 3      | 1      | 2      | 0       |
| Neutron              | 3      | 0      | 3      | 0       |
| Analytics & Tracking | 2      | 1      | 1      | 0       |
| **TOTAL**            | **66** | **24** | **33** | **9**   |

---

## Files Created in `packages/api/src/`

1. `packages/api/src/billing.ts` — Billing sub-router (checkout, plans, subscriptions, invoices, entitlements, cancel, change-plan, subscribe)
2. `packages/api/src/webhooks.ts` — Consolidated webhook handlers (HubSpot, Asana, and existing providers; extracted from `index.ts` inline routes)
3. `packages/api/src/insights.ts` — Pattern detection insights
4. `packages/api/src/spend.ts` — Spend tracking
5. `packages/api/src/cs.ts` — Customer success health scores
6. `packages/api/src/goals.ts` — Goal progress tracking
7. `packages/api/src/sync.ts` — Sync scheduling & data sync
8. `packages/api/src/analytics.ts` — Website visitor tracking

## Files Modified in `packages/api/src/`

1. `packages/api/src/index.ts` — Added routes for: search, workspace/bootstrap, support/contact, templates, enhanced health check
2. `packages/api/src/db.ts` — Added helper functions for new domains

## Files Created in `apps/workspace/`

The 33 KEEP routes are ported into `apps/workspace/api/...` preserving their Next.js App Router structure. Import paths updated from `@/lib/supabase/...` to `~/lib/...` where appropriate.

## Next Steps (Phase 2)

1. **Migrate AI routes** to Cloudflare Workers AI binding (`c.env.AI`) when Vercel AI SDK adds Worker-compatible streaming
2. **Migrate Loader system** to Hono backend by rewriting SDK calls (Notion, HubSpot, Gmail, Sheets) to use raw HTTP + CF Worker-compatible libraries
3. **Migrate Neutron** from Neon to D1, or keep as external service with proxy
4. **Migrate Cron jobs** to Cloudflare Cron Triggers in `wrangler.toml`
5. **Migrate Webhooks** (Slack, Discord, AI-Relay) to Hono when crypto libraries are verified compatible
