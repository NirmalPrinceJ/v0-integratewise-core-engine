# Cloudflare Pages Deployment

Repository

- `NirmalPrinceJ/integratewise-live`

Production Branch

- `main`

Root Directory

- `/`

Build Command

- `pnpm install --frozen-lockfile && pnpm --filter @integratewise/web build`

Output Directory

- `apps/web/dist`

Environment Variables

- Configure all `VITE_*` variables in Cloudflare Pages secret store.
- Do not commit secrets.

Routing

- SPA fallback via `apps/web/public/_redirects`

Domain

- `integratewise.ai`

Deployment Flow

- `GitHub (main)` → `Cloudflare Pages` → `integratewise.ai`

Repository Topology

```text
apps/
  web/                  # Unified frontend

services/
  gateway/
  pipeline/
  intelligence/
  ...

packages/
  ui/
  types/
  sdk/
  ...

Deployments
  Cloudflare Pages  -> apps/web
  Cloudflare Workers -> services/*
```

Notes

- `apps/web` is the single frontend deployment.
- `services/*` are deployed independently as Cloudflare Workers.
- `packages/*` contain shared workspace libraries.
