# IntegrateWise — 4-Way Merge Summary (by App & Department)

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Date:** 2026-07-05  
**Sources:** `app_real.zip` | `v0-core` | `web.old.zip` | `pull-from-main 2.zip`

---

## What Was Done

All 4 source zips were extracted and merged into the live monorepo at `/Users/nirmal/Documents/kimi/workspace/integratewise/`, organized by **app** and **department route groups**.

### Merge Results

| Source             | Files | Action                                | Destination                                 |
| ------------------ | ----- | ------------------------------------- | ------------------------------------------- |
| **app_real**       | 271   | 102 merged, 149 preserved, 20 skipped | `apps/workspace/src/app/`, `components/`    |
| **v0-core**        | 179   | 90 written (76 new + 14 overwrite)    | `apps/workspace/`, `migrations/v0-core/`    |
| **web.old**        | 690   | 353 copied + 1 overwrite              | `apps/workspace/`, `public/`, `styles/`     |
| **pull-from-main** | 2,132 | 179 new + 17 overwrite                | `packages/`, `services/`, `apps/workspace/` |
| **Cleanup**        | —     | 3,376 archive files removed           | `_archive/__MACOSX/` deleted                |

**Total files staged for commit: 4,643**

---

## Department Organization

### Route Groups (9)

```
apps/workspace/src/app/
├── (app)/          → Dashboard, chat, command-center
├── (auth)/         → Login, signup, error
├── (business)/     → Deals, leads, clients, sales
├── (chat)/         → AI workspace, twin
├── (cs)/           → Accounts, meetings, TAM
├── (docs)/         → Content, knowledge
├── (ops)/          → Admin, governance, data-flow
├── (personal)/     → Profile, billing, settings
└── (workspace)/    → Home, work, intelligence
```

### Component Folders (18)

```
apps/workspace/src/components/
├── app/           → 122 files  (shells, navigation, command-palette)
├── auth/          → 8 files   (login, signup, protected-route)
├── business/      → 91 files  (sales, CRM, pipeline, deals)
├── chat/          → 1 file    (twin workbench)
├── cs/            → 87 files  (account-success, service desk)
├── docs/          → 12 files  (knowledge, governance)
├── ops/           → 55 files  (admin, IT, product-engineering)
├── personal/      → 21 files  (profile, goal-framework)
├── workspace/     → 121 files (spine, twin-ui, connectors)
├── ai-workspace/  → AI chat shell
├── dialogs/       → Shared dialogs
├── integrations/  → Integration selection, memory insights
├── media/         → Cloudinary images
├── onboarding/    → Onboarding wizard, template selector
├── shells/        → Layout shells
├── ui/            → shadcn/ui primitives
├── views/         → Page-level view components
└── widgets/       → Reusable widgets
```

### API Routes (80+ directories)

```
apps/workspace/src/app/api/
├── ai/chat              → AI streaming
├── billing/*            → Subscriptions, invoices, webhooks
├── brainstorm/*         → Analyze, daily-insights, execute
├── connectors/[provider]→ OAuth connect/callback/disconnect
├── cron/*               → Daily insights, sync scheduler
├── cs/health-score      → CS health scoring
├── data-sync            → Data synchronization
├── goals/progress       → Goal tracking
├── hubspot/sync         → HubSpot integration
├── insights/patterns    → Pattern detection
├── loader/*             → Template pipeline (stage1, stage2, etc.)
├── neutron/*            → Data normalization
├── search               → Search API
├── spend/*              → Spend analytics
├── stripe/webhook       → Stripe billing webhooks
├── sync/schedule        → Sync scheduling
├── webhooks/*           → Slack, Discord, Asana, HubSpot, etc.
└── workspace/bootstrap  → Workspace initialization
```

### New Packages (from pull-from-main)

```
packages/
├── accelerators/        → Performance accelerators
├── adk/                 → Agent Development Kit
├── analytics/           → Analytics pipeline
├── auth/                → NEW: Authentication service
├── bootstrap/           → Bootstrap utilities
├── config/              → Shared configuration
├── connector-contracts/ → Connector contracts
├── connector-utils/     → Connector utilities
├── connectors/          → 30+ connector implementations
├── continuity/          → Continuity engine
├── db/                  → Database layer
├── design-system/       → Extracted UI primitives
├── domain-shells/       → Domain shells
├── entity360/           → Entity 360 view
├── gateway-sdk/         → Gateway SDK
├── governance/          → Governance engine
├── handoff-adapters/    → Handoff adapters
├── hermes-spine-memory/ → Spine memory
├── identity/            → Identity platform
├── integratewise-mcp-tool-connector/ → MCP connector
├── intelligence/        → Intelligence layer
├── knowledge/           → Knowledge system
├── knowledge-bank-ui/   → Knowledge bank UI
├── lib/                 → Shared library
├── normalizer/          → Data normalizer
├── notifications/       → Notification system
├── rbac/                → Role-based access
├── sdk/                 → Public SDK
├── search/              → Search engine
├── shared/              → Shared utilities
├── spine/               → Operational spine
├── tenancy/             → Multi-tenancy
├── types/               → Shared types
├── ui/                  → UI components
├── webhooks/            → Webhook system
└── workbench/           → Workbench runtime
```

### New Services (from pull-from-main)

```
services/
├── act/                 → Action executor
├── admin/               → Admin service
├── agent-registry/      → Agent registry
├── api/                 → API gateway
├── billing/             → Billing service
├── connector/           → Connector service
├── connector-sync/      → Connector sync
├── continuity/          → Continuity service
├── folder-watcher/      → Folder watcher
├── gateway/             → Main gateway (existing, preserved)
├── govern/              → Governance service
├── hermes/              → Message bus
├── intelligence/        → Intelligence service
├── iw-agent-runtime/    → Agent runtime
├── knowledge/           → Knowledge service
├── l2/                  → L2 processing
├── loader/              → Data loader
├── mcp-connector/       → MCP connector
├── normalizer/          → Data normalizer
├── pipeline/            → Processing pipeline
├── signals/             → Signal processing
├── store/               → Data store
├── telemetry/           → Telemetry
├── tenants/             → Tenant service
├── think/               → Thinking/LLM service
├── twin-orchestrator/   → Twin orchestration
├── webhook-ingress/     → Webhook ingress
└── workflow/            → Workflow engine
```

---

## What Was Preserved

| Location                                      | Status                                      |
| --------------------------------------------- | ------------------------------------------- |
| `apps/web/`                                   | ✅ Untouched — still the working deployment |
| `packages/api/src/` (auth, entities, metrics) | ✅ Untouched — Hono backend preserved       |
| `services/gateway/`                           | ✅ Untouched — gateway routing preserved    |
| `apps/workspace/next.config.ts`               | ✅ Untouched — build config preserved       |
| `apps/workspace/package.json`                 | ✅ Untouched — dependencies preserved       |

---

## Known Issues / Next Steps

1. **Duplicate components** — Some components exist in both `components/views/` and `components/<dept>/`. The department-organized versions should be canonical; views/ can be cleaned up.
2. **`app/layout.tsx` overwritten** — The root layout was replaced by v0-core's version. Verify providers (ThemeProvider, AuthProvider) are still correct.
3. **API route bloat** — 80+ API routes in `apps/workspace/src/app/api/`. These should gradually move to the Hono backend (`packages/api/src/`).
4. **Migration numbering** — v0-core migrations (001–028) may conflict with existing migrations (032–034). Renumbering needed.
5. **Build verification needed** — Run `pnpm build` in `apps/workspace/` to verify the merged code compiles.
6. **Import paths** — Some components may reference `@/components/ui/` instead of `@integratewise/design-system`. Update as needed.
7. **TypeScript errors** — Expect ~40–50 TS errors from the merged code. Most are from missing types or stub implementations.

---

## Architecture: One App, One Backend, One Design System

```
┌─────────────────────────────────────────────────────────────┐
│                    apps/workspace/                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ (app)   │ │ (cs)    │ │ (business)│ │ (workspace)│       │
│  │ Dashboard│ │ Accounts│ │ Deals   │ │ Home     │         │
│  │ Chat    │ │ Meetings│ │ Leads   │ │ Work     │         │
│  │ Command │ │ TAM     │ │ Sales   │ │ Intelligence│       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ (auth)  │ │ (personal)│ │ (ops)  │ │ (docs)   │          │
│  │ Login   │ │ Profile │ │ Admin   │ │ Content  │          │
│  │ Signup  │ │ Billing │ │ Governance│ │ Knowledge│         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│  components/<dept>/  lib/  hooks/  public/  styles/        │
├─────────────────────────────────────────────────────────────┤
│                    packages/                                │
│  api/  design-system/  connectors/  types/  ui/  ...       │
├─────────────────────────────────────────────────────────────┤
│                    services/                                │
│  gateway/  workflow/  intelligence/  knowledge/  ...        │
└─────────────────────────────────────────────────────────────┘
```
