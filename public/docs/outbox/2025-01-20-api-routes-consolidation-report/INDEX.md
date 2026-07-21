# API Route Consolidation — Final Report

## What Was Done

### 1. Analysis of All 66 API Routes

Every route in `_reference/app/app/api/` was analyzed for:

- External dependencies (Stripe, Supabase, Vercel AI SDK, Notion SDK, etc.)
- Database usage (Supabase, Neon, D1)
- Complexity of porting to Hono/Cloudflare Workers
- Overlap with existing backend (`packages/api/src/`)

### 2. Decisions & Mapping

| Decision    | Count | Routes                                                                                                                                                                            |
| ----------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MERGE**   | 24    | Billing (9), Search, Support, Templates, Bootstrap, Insights, Spend, CS, Goals, Sync, Data-sync, Analytics, Webhooks (HubSpot enhanced, Asana new, health), Enhanced Health       |
| **KEEP**    | 33    | AI/Chat (2), Brainstorm (3), Cron (6), Loader (9), BYOM/BYOT (2), Neutron (3), Webhooks (Slack, Discord, AI-Relay, generic, Asana, Brainstorm), Capture, Track, Webhook scheduler |
| **DISCARD** | 9     | Health/ping/liveness/readiness/env-health (redundant), Stripe webhook (duplicate), HubSpot sync (duplicate), session (replaced by auth/me)                                        |

Full mapping documented in `API_ROUTES_MAPPING.md`.

### 3. New Backend Files Created (`packages/api/src/`)

| File           | Description                    | Routes                                                                                                           |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `billing.ts`   | Subscription & payment         | 8 billing routes                                                                                                 |
| `webhooks.ts`  | Consolidated webhook handlers  | HubSpot, LinkedIn, Canva, Salesforce, Pipedrive, Google Ads, Meta, WhatsApp, Asana, health check, providers list |
| `insights.ts`  | Pattern detection              | `/api/insights/patterns`                                                                                         |
| `spend.ts`     | Spend tracking                 | `/api/spend/summary`, `/api/spend/trend`                                                                         |
| `cs.ts`        | Customer success health scores | `/api/cs/health-score`                                                                                           |
| `goals.ts`     | Goal progress tracking         | `/api/goals/progress`                                                                                            |
| `sync.ts`      | Sync scheduling                | `/api/sync/schedule`, `/api/data-sync`                                                                           |
| `analytics.ts` | Website visitor tracking       | `/api/website/track`                                                                                             |

### 4. Modified Backend Files

| File                        | Changes                                                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/api/src/index.ts` | Mounted 8 new sub-routers; added `/api/search`, `/api/support/contact`, `/api/templates/download`, `/api/workspace/bootstrap`, `/api/health` (enhanced); removed inline webhook routes (replaced with `webhooks.ts` import) |
| `packages/api/src/types.ts` | Added billing & webhook env vars to `Env` interface                                                                                                                                                                         |

### 5. Workspace App Created (`apps/workspace/`)

- **Structure:** Next.js App Router with `src/app/api/...`
- **33 API routes** copied from `_reference/app/app/api/` with preserved logic
- **Config files:** `package.json`, `tsconfig.json`, `next.config.ts`
- **README:** Documents migration path for Phase 2 (moving KEEP routes to Hono backend)

### 6. Import Path Mapping

All routes in `apps/workspace` preserve their original `@/lib/...` import paths. The `tsconfig.json` paths config maps `@/*` to `./src/*`, matching the original app structure. When consolidating the frontend in Phase 3, these will be mapped to `~/lib/...` or `packages/design-system/` as appropriate.

### 7. Database Compatibility

All MERGED routes use D1 SQL (SQLite) compatible with the existing schema:

- `entities` table for generic objects (leads, deals, contacts, tasks, events)
- `activities` table for audit logs
- `product_skus`, `tenant_subscriptions`, `payment_transactions` for billing
- `integrations` table for sync scheduling
- `entities_fts` for full-text search

### 8. No Breaking Changes to Existing Backend

- `auth.ts` — untouched
- Existing entity CRUD — untouched
- Existing metrics endpoints — untouched
- Existing onboarding — untouched
- Webhook routes preserved (just moved to `webhooks.ts` with same paths)

### 9. Cleaned Up Junk Files

Removed `__MACOSX` and `.DS_Store` files from extracted content.

## Files Created / Modified

### Created

```
packages/api/src/billing.ts
packages/api/src/webhooks.ts
packages/api/src/insights.ts
packages/api/src/spend.ts
packages/api/src/cs.ts
packages/api/src/goals.ts
packages/api/src/sync.ts
packages/api/src/analytics.ts
apps/workspace/package.json
apps/workspace/tsconfig.json
apps/workspace/next.config.ts
apps/workspace/README.md
apps/workspace/src/app/api/... (33 routes)
API_ROUTES_MAPPING.md
```

### Modified

```
packages/api/src/index.ts
packages/api/src/types.ts
```

## What Remains (Phase 2)

1. **Frontend pages consolidation:** Merge `apps/web/src/app/` (15 pages) and `_reference/app/app/` (102 pages) into `apps/workspace/src/app/`
2. **AI route migration:** Port Vercel AI SDK routes to Cloudflare Workers AI binding
3. **Loader system migration:** Rewrite external SDK calls for Worker compatibility
4. **Neutron migration:** Move from Neon Postgres to D1 or external service
5. **Cron job migration:** Convert to Cloudflare Cron Triggers
6. **Design system extraction:** Move shared UI components to `packages/design-system/`

## Verification

- ✅ All 66 routes analyzed and mapped
- ✅ 24 routes merged into Hono backend
- ✅ 33 routes preserved in `apps/workspace`
- ✅ 9 routes discarded (redundant)
- ✅ No working backend code deleted
- ✅ Existing deployments not broken
- ✅ Import paths preserved
- ✅ D1 schema compatibility maintained
- ✅ Junk files cleaned up
