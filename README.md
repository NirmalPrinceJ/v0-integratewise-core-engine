# Customer Zero — IntegrateWise Internal Operations

This repository is **Customer Zero**: the internal operating workspace that runs IntegrateWise on the same platform surfaces exposed to customers. It is the reference frontend for that platform. The team uses it to run the company, and a customer workspace consumes the same shapes.

It serves three roles:

1. **Internal operating workspace** — day-to-day work for the IntegrateWise team.
2. **Reference frontend** — App Router pages, projections, and API routes that consume the platform.
3. **Living product demonstration** — the product is exercised on IntegrateWise's own business.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4 and shadcn/ui (Radix)
- Clerk on signed-in routes, plus a demo session for local use
- Supabase (PostgreSQL) for persisted operating data
- Vercel AI SDK (OpenAI, Anthropic, Google)
- SWR for client data fetching
- Vercel, including the insight crons in [`vercel.json`](./vercel.json)

## How the app is organized

The UI is a set of projections over shared platform data. Navigation is declared in [`lib/projections.ts`](./lib/projections.ts) and rendered by the sidebar. Each destination names an entity, an access capability (`work:read`, `work:approve`, `knowledge:read`, `platform:read`, `admin:read`), and a projection kind:

`table` · `board` · `calendar` · `dashboard` · `canvas` · `feed`

Generic destinations render at `/projections/[slug]`. `EntityProjectionView` can switch a destination among those six surfaces. Named workspaces (sales, operations, knowledge, agents, and the rest) are their own routes and share `AppShell`: sidebar, command search, and the Twin assistant.

`/` is the marketing landing page. The operating home in the sidebar is [`/workbench`](./app/workbench/page.tsx). The workbench router switches among the department briefs in [`lib/platform/departments.ts`](./lib/platform/departments.ts):

Founder Daily Brief · Product & Engineering · Sales Pipeline · Marketing & Content · Customer Success · Operations · Finance · Partnerships & GTM · Knowledge & Documentation

### Platform surfaces

In-repo operating data and the surface accessors live in [`lib/platform`](./lib/platform):

- `types.ts` — surface contracts
- `data.ts` — IntegrateWise's own operating dataset
- `index.ts` — `platform.<surface>` accessors and `platform.workspace(dept)`
- `api/client.ts` — `PlatformClient` for the IntegrateWise gateway (`https://gateway.dev.integratewise.ai/api/v1`), scoped by a bearer token and `x-tenant-id`
- `provider.tsx` — `PlatformProvider`, mounted from the root layout. It builds a client when Clerk has a user and the tenant environment variables are set

Surfaces on `platform`:

`identity` · `integrations` · `spine` · `capabilities` · `agentRuntime` · `knowledge` · `analytics` · `notifications`

`/api/platform/[...path]` proxies authorized requests to `https://gateway.dev.integratewise.ai`. The proxy requires `Authorization` and `x-tenant-id`.

### Core engine

[`lib/core`](./lib/core) is the in-process operating layer behind the workbenches:

- capability registry, engine, context builder, and fabric executor
- operating calendar and scheduling
- twin memory
- department workbench manager
- connector manager
- operational templates
- lifecycle engine and recurring scheduler

### Agent runtime

Production workers are defined on the agent runtime surface and shown at `/agents`: Lead Qualification, Support Triage, Content Strategist, DevOps Monitor, Billing Manager, Customer Health, and Competitive Intelligence.

### Session and auth

The root [`proxy.ts`](./proxy.ts) request hook sets a `demo_session` cookie so the shell can run locally, and it sends `/auth/*` back to `/`. Clerk wraps the tree in [`app/layout.tsx`](./app/layout.tsx). The nested layout at `app/app` requires a Clerk user and redirects everyone else to `/sign-in`.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing landing page |
| `/sign-in`, `/sign-up` | Clerk sign-in and sign-up |
| `/workbench` | Department workbench |
| `/projections/[slug]` | Capability-filtered entity projection |
| `/customer-zero` | Organization, departments, connected systems, and daily activity |
| `/evidence` | Operating evidence |
| `/agents` | Agent runtime and capabilities |
| `/founder`, `/sales`, `/marketing`, `/operations`, `/technology`, `/customer-success`, `/finance`, `/administration` | Department workspaces |
| `/knowledge`, `/brainstorming`, `/strategy`, `/integrations`, `/data-flow`, `/settings` | Knowledge, strategy, integrations, pipelines, and security settings |
| `/app/*` | Clerk-gated app segment |

Route handlers under `app/api` cover AI chat, search, Spine entities and timeline, Twin, connectors (connect, callback, disconnect), data sync, brainstorm, docs, Coda, HubSpot, website tracking, and provider webhooks (Slack, Discord, Asana, HubSpot, Clerk). Vercel calls `/api/cron/daily-insights` and `/api/cron/hourly-insights` on the schedules in `vercel.json`.

## Repository layout

```
app/                  App Router pages and route handlers
components/           App shell, projections, workbench, views, shadcn/ui
lib/platform/         Surface contracts, operating data, gateway client
lib/core/             Capability, twin, workbench, connector, and lifecycle engines
lib/projections.ts    Sidebar destinations and access filtering
lib/supabase/         Browser, server, and service-role clients
scripts/              Numbered Supabase SQL migrations and seeds
public/docs/          Product, commercial, and architecture documentation
```

## Development

This repo uses pnpm (`pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev
```

Other scripts:

```bash
pnpm build
pnpm start
pnpm lint
```

Environment variables are listed in [`ENV_VARIABLES.md`](./ENV_VARIABLES.md). The app also reads:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_INTEGRATEWISE_API_TOKEN
NEXT_PUBLIC_INTEGRATEWISE_TENANT_ID
NEXT_PUBLIC_GATEWAY_URL
CODA_API_TOKEN
CODA_WORKSPACE_ID
```

`NEXT_PUBLIC_GATEWAY_URL` is optional. The gateway client falls back to `https://gateway.dev.integratewise.ai`.

Apply the SQL files in [`scripts/`](./scripts) to the Supabase project before expecting persisted CRM, Spine, brainstorming, or webhook data. Filenames are numbered. A few prefixes are reused (`021`, `022`, `026`), so apply each file once.

## Further reading

- [`CODEBASE_OVERVIEW.md`](./CODEBASE_OVERVIEW.md) — module map and stack notes
- [`SYSTEM_OVERVIEW.md`](./SYSTEM_OVERVIEW.md) — system architecture
- [`ENV_VARIABLES.md`](./ENV_VARIABLES.md) — environment variables
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — deployment
- [`CUSTOMER_ZERO_README.md`](./CUSTOMER_ZERO_README.md) — Customer Zero product notes
