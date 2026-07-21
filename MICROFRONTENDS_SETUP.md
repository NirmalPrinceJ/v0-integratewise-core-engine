# IntegrateWise — Vercel Microfrontends Setup
Date: Jul 21, 2026

## What Microfrontends gives you

All repos deploy independently but serve as ONE application under integratewise.ai:

```
integratewise.ai/                → Customer Zero (default app)
integratewise.ai/bi/*            → Business Intelligence (child app)  
integratewise.ai/admin/*         → Admin Console (child app)
integratewise.ai/api/...         → proxied to Gateway Worker
```

Single domain. No iframes. No CORS. No shared bundle.
Each app deploys independently. Vercel routes at the edge.

---

## Step 1: Create the Microfrontends Group

In Vercel Dashboard → consolidated team → Settings → Microfrontends:

1. Click **Create a Microfrontends Group**
2. Name: `integratewise`
3. Add projects:
   - `v0-integratewise-core-engine` → set as **Default App**
   - `Business_Intelligence` → child app
   - (future: `admin-console`, `developer-portal`)
4. Click **Add Config** to copy `microfrontends.json` to your default app repo

---

## Step 2: Install the package in each repo

```bash
# In v0-integratewise-core-engine (Customer Zero — default app)
npm install @vercel/microfrontends

# In Business_Intelligence
npm install @vercel/microfrontends
```

---

## Step 3: Update next.config.mjs in Customer Zero

Replace existing `next.config.mjs` with:

```js
import { withMicrofrontends } from '@vercel/microfrontends'

const nextConfig = {
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000',
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
}

export default withMicrofrontends(nextConfig)
```

---

## Step 4: Update next.config.mjs in Business Intelligence

```js
import { withMicrofrontends } from '@vercel/microfrontends'

const nextConfig = {
  basePath: '/bi',
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/bi`
    : 'http://localhost:3001/bi',
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
}

export default withMicrofrontends(nextConfig)
```

---

## Step 5: Add microfrontends.json to Customer Zero repo root

Copy the `microfrontends.json` from this package exactly.
This file lives ONLY in the default app (Customer Zero).

For Business Intelligence (polyrepo), run:
```bash
cd Business_Intelligence
vercel microfrontends pull
```
This pulls the shared config so the BI build can find it.

---

## Step 6: Set env vars on each Vercel project

Both projects need the same 3 vars:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_GATEWAY_URL=https://gateway.dev.integratewise.ai
```

In Vercel Dashboard → Project → Settings → Environment Variables
Or via CLI:
```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production  
vercel env add NEXT_PUBLIC_GATEWAY_URL production
```

---

## Step 7: Add custom domain

In Vercel Dashboard → Customer Zero project → Settings → Domains:
- Add `integratewise.ai`
- Add `www.integratewise.ai`

DNS (in your registrar):
```
@    A      76.76.21.21
www  CNAME  cname.vercel-dns.com
```

The microfrontends group automatically routes all paths correctly
once the domain is on the default app.

---

## Step 8: Deploy

```bash
# Customer Zero
cd v0-integratewise-core-engine
vercel --prod

# Business Intelligence  
cd Business_Intelligence
vercel --prod
```

Both deploy independently. The microfrontends config routes requests
at the Vercel edge before they hit any app.

---

## Step 9: Test locally

```bash
# Terminal 1 — Customer Zero
cd v0-integratewise-core-engine
npm run dev  # starts on :3000

# Terminal 2 — Business Intelligence
cd Business_Intelligence  
npm run dev  # starts on :3001

# Terminal 3 — Microfrontends proxy (routes both)
cd v0-integratewise-core-engine  # wherever microfrontends.json lives
npx @vercel/microfrontends
# → visit http://localhost:3024
# / → Customer Zero
# /bi → Business Intelligence
# /admin → Admin Console
```

---

## The Routing Map (after setup)

```
integratewise.ai
        │
        │  Vercel Edge (microfrontends routing)
        │
   ┌────┴──────────────────────────────────┐
   │                                       │
   ▼                                       ▼
/ /* (unmatched)               /bi/* /analytics/* /finance/*
Customer Zero                  Business Intelligence
(v0-integratewise-core-engine) (Business_Intelligence repo)
Vercel project: customer-zero  Vercel project: business-intelligence
        │                                       │
        └───────────────────────────────────────┘
                              │
                    Same Spine. Same Gateway.
              gateway.dev.integratewise.ai
                    Same Clerk tenant.
                    Same connectors.
```

---

## Pricing note

<cite index="9-1">Pro teams include 2 microfrontend projects. Additional projects cost $250/project/month.</cite>

Customer Zero + Business Intelligence = 2 projects = included in Pro.
Add Admin Console = 1 additional = $250/month.

---

## Cross-repo shared code

Since these are separate repos, share code via npm packages:

```bash
# Publish the core engine as a package (from v0-integratewise-core-engine)
# lib/core/ → @integratewise/core
# lib/platform/ → @integratewise/platform-client
# lib/integratewise/ → @integratewise/client

# Then in Business Intelligence:
npm install @integratewise/core @integratewise/platform-client
```

The `use-gateway.ts` hook and `use-data-bridge.ts` work identically
in both apps — same Gateway, same tenant, same data.

---

## Vercel Integrations to enable

In Vercel Dashboard → consolidated team → Integrations:

1. **Clerk** — enable on both projects for shared auth
2. **Cloudflare** (if available) — for Workers observability  
3. **GitHub** — already linked for auto-deploy on push

For Vercel to call back to Spine on deployment events, add webhook:
- Vercel Dashboard → Customer Zero → Settings → Git Hooks
- Deployment success URL: `https://gateway.dev.integratewise.ai/webhooks/vercel`
- Header: `x-tenant-id: your-tenant-id`

This writes deployment events into the Spine as `incident` entities.

