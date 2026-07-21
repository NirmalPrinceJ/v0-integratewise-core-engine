# L1 Reality Check — Current Codebase vs. Canonical Architecture

**Version:** 1.0.0-REALITY  
**Date:** 2026-07-02  
**Purpose:** Brutal audit of the actual `integratewiseosmain` codebase against the FINAL_E2E_SYSTEM.md canonical architecture. Flags every live conflict, maps audit findings to §14/§15 blockers, and defines the fork-vs-rewrite decision.

---

## 1. The Audit Summary (171d Ago v0 Session)

| Finding                                | Count       | Canonical Rule                | Status          |
| -------------------------------------- | ----------- | ----------------------------- | --------------- |
| Total pages                            | 83          | ~25 (core app only)           | **Bloat**       |
| Marketing pages                        | 50+         | Should be on Webflow          | **Scope creep** |
| Duplicate layouts                      | 7           | 5 max                         | **Debt**        |
| Tables with RLS enabled, ZERO policies | 30+         | D1 + `WHERE tenant_id = ?`    | **§14.1 Live**  |
| Hardcoded hex colors                   | 40+ files   | CSS variables / design tokens | **Debt**        |
| `@iw/*` namespace                      | 25+ files   | `@integratewise/*`            | **Drift**       |
| Missing SpeedInsights                  | 1           | Standard L1 feature           | **Incomplete**  |
| Missing demo seeds                     | 0 scripts   | Required for onboarding       | **Incomplete**  |
| Missing unified theme                  | 1           | 7× UI agnostic moat           | **Blocks moat** |
| `tsconfig.json` JSX mode               | `react-jsx` | `preserve` (Next.js req)      | **Fixed**       |
| `.npmrc` / pnpm config                 | Incomplete  | `shamefully-hoist=true`       | **Fixed**       |

---

## 2. The Canonical Conflicts That Are Still Live

### §14.1: Storage/Runtime — 4 Backends (SUPERSEDED BUT NOT IMPLEMENTED)

**Canon (§20.2 FINAL):** 100% Cloudflare — D1, DO, KV, R2, Vectorize, AI Search, Queues. No Supabase / Vercel / AWS / Neon.

**Actual codebase:**

- Next.js 16 + `tsconfig.json` with JSX `preserve` → **Vercel**
- `supabase` import in `tsconfig.json` paths → **Supabase**
- 30+ RLS-enabled tables with auth.users references → **Supabase Auth + PostgreSQL**
- `middleware.ts` with Supabase session validation → **Supabase Auth**
- `page.tsx` files with `supabase.from('table').select()` → **Supabase client**

**Verdict:** The FINAL decision says "Supabase removed" but the codebase is **deeply entangled** with Supabase Auth, RLS, and PostgreSQL queries. This is the #1 blocker.

**Options:**

| Option                                                | Effort           | Risk                                                                    | Template Timeline |
| ----------------------------------------------------- | ---------------- | ----------------------------------------------------------------------- | ----------------- |
| A. In-place migration (Supabase → D1)                 | 2–3 months       | High — every query, every auth flow, every RLS policy must be rewritten | Month 4+          |
| B. **Fork: new Vite workbench + keep legacy Next.js** | 1 month parallel | Low — CZ stays running, new repo is clean                               | Month 2–3         |
| C. Keep Supabase, call it "provider-agnostic"         | 0 months         | Fatal — contradicts DECISION 22, template teaches wrong architecture    | Never             |

**Recommendation: Option B.**

### §14.2: Auth Model — Clerk vs Stack vs Descope vs JWT (SUPERSEDED BUT NOT IMPLEMENTED)

**Canon (§20.2 FINAL):** API Keys (external) + JWT (internal). Clerk/Stack/Descope **removed**.

**Actual codebase:**

- `middleware.ts` with `supabase.auth.getSession()`
- `auth/callback/route.ts` with Supabase OAuth
- `auth/confirm/route.ts` with Supabase email verification
- RLS policies expecting `auth.uid()` — but **zero policies written**

**Verdict:** Auth is still Supabase Auth. The "thrashed" Clerk/Stack/Descope migration never reached this repo — it went from Supabase to nothing else. But Supabase Auth is **not** the canonical JWT Gateway auth.

**Fix for legacy repo:** Wrap Supabase Auth in a Gateway JWT facade. The Next.js app receives a Gateway JWT (from `gateway` Worker), validates it, and maps `tenant_id` from the JWT claim. Supabase becomes a **data store** only, not the auth source.

**Fix for new repo:** `apps/workbench` uses Gateway JWT directly. No Supabase Auth SDK.

### §14.3: Frontend Host — Replit vs Vite vs Next.js/Vercel (SUPERSEDED BUT NOT IMPLEMENTED)

**Canon (§20.2 FINAL):** `apps/web` = Vite + React + shadcn/ui on Cloudflare Pages. Not Next.js. Not Vercel. Not Replit.

**Actual codebase:** Next.js 16 + Vercel + `app/` directory + Server Components.

**Verdict:** This is the **deepest entanglement**. Next.js App Router + Server Components + Supabase RLS is a completely different paradigm from the Vite + React + Cloudflare Pages architecture in the FINAL spec.

**Decision:** The existing Next.js app is **not** the canonical workbench. It is a **legacy surface** that will consume the Bridge via SDK. The canonical workbench is built fresh in `apps/workbench` (Vite + React + shadcn/ui).

### §14.6: Capability-First APIs (GREENFIELD — NOT YET BUILT)

**Actual codebase:** Conventional Next.js API routes (`/api/ai/insights`, `/api/ai/analyze`). No capability registry. No Discovery endpoint. No `iw.*` SDK facade.

**Verdict:** The entire capability-first layer is **greenfield**. It doesn't exist yet in any form. This is not a conflict — it's a missing feature.

### §14.8: Twin Model Provider (RESOLVED IN CODE?)

**Actual codebase:** `useAIInsights.ts` and `useAIAgent.ts` call `gpt-4o` directly via OpenAI SDK. No OpenRouter. No model swappability.

**Verdict:** Direct OpenAI calls, not OpenRouter. Not gpt-5-mini. The model layer is **hardcoded**.

---

## 3. The P0 Blockers — Which Are Real in the Codebase

| P0 # | Description                  | Present in Codebase? | Evidence                                                                                     |
| ---- | ---------------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| 1    | Cross-tenant data leak       | **YES**              | 30+ tables with RLS enabled but **zero policies** — any authenticated user can read all rows |
| 2    | Tenant-id spoofing           | **YES**              | `supabase.from('table').select()` — no `tenant_id` filtering in most queries                 |
| 3    | Tenant middleware no-op      | **YES**              | `middleware.ts` validates session but does not enforce `tenant_id` scoping on requests       |
| 4    | HITL DO global ID            | **N/A**              | No Durable Objects in codebase — this is a Cloudflare-only concern                           |
| 5    | Invitation cross-tenant scan | **LIKELY**           | `auth/invites` logic not audited in snippet                                                  |
| 6    | Hardcoded secrets            | **CHECK**            | `.env` files not visible in audit; need to verify git history                                |
| 7    | `.env` committed             | **CHECK**            | Need to verify git history                                                                   |
| 8    | SQL injection in shims       | **PARTIAL**          | `supabase.from()` is parameterized, but raw SQL in `db.sql` file not audited                 |
| 9    | MCP-JWT bypass               | **YES**              | No MCP server exists in codebase at all                                                      |
| 10   | Auth root thrashing          | **PARTIAL**          | Auth is Supabase (stable), but not the canonical Gateway JWT                                 |

**Critical finding: P0 #1 is catastrophic.** 30+ tables with RLS enabled but zero policies means **any authenticated user can read any other tenant's data**. This is not a theoretical risk — it's a live vulnerability.

---

## 4. The Fork Decision — Canonical vs. Legacy

Given the depth of entanglement, the only viable path is a **dual-repo strategy**:

### Repo A: `integratewise-continuity-bridge` (NEW — Canonical Template)

```
integratewise-continuity-bridge/
├── apps/
│   ├── gateway/              ← NEW — Hono + JWT + service bindings
│   ├── workbench/            ← NEW — Vite + React + shadcn/ui + 8 projections
│   └── mcp-server/           ← NEW — Inbound MCP Pool
├── packages/
│   ├── spine-schema/         ← NEW — Drizzle + D1 + withTenant()
│   ├── normalizer/           ← NEW — NA0–NA5 skeleton
│   ├── sdk/                  ← NEW — @integratewise/sdk
│   └── ...
├── services/                 ← NEW — 26 Cloudflare Worker stubs
└── infra/                    ← NEW — wrangler.toml, D1 migrations, KV, Queues
```

**This is the publishable template.** It matches FINAL_E2E_SYSTEM.md exactly.

### Repo B: `integratewiseosmain` (EXISTING — Legacy CZ Surface)

```
integratewiseosmain/
├── Next.js 16 + Vercel       ← KEEP (CZ runs here)
├── Supabase                  ← WRAP (don't rip out yet)
├── 83 pages                  ← DELETE 50+ marketing pages
└── ...
```

**This becomes a consumer of the Bridge.** Gradually migrate:

1. **Week 1–2:** Wrap Supabase queries in `@integratewise/sdk` calls. The SDK talks to the Bridge; the Bridge talks to Supabase (temporary adapter).
2. **Week 3–4:** Move auth from Supabase Auth to Gateway JWT. Supabase becomes read-only data store.
3. **Month 2:** Once D1 has all data, cut Supabase reads. Supabase is removed.

---

## 5. Immediate Actions (This Week)

### 5.1 Security — Close P0 #1 (Cross-Tenant Leak)

Even if you keep Supabase temporarily, add `tenant_id` filtering to every query:

```typescript
// BEFORE (vulnerable — any user reads all rows)
const { data } = await supabase.from("accounts").select("*");

// AFTER (scoped — user reads only their tenant)
const tenantId = jwt.tenant_id; // from Gateway JWT
const { data } = await supabase.from("accounts").select("*").eq("tenant_id", tenantId);
```

**All 30+ tables need this fix.** No exceptions.

### 5.2 Scope — Delete 50+ Marketing Pages

```bash
# Remove from integratwiseosmain
rm -rf app/blog
rm -rf app/case-studies
rm -rf app/company
rm -rf app/docs
rm -rf app/platform
rm -rf app/pricing
rm -rf app/resources
rm -rf app/security
rm -rf app/solutions
```

These belong on Webflow (§17 GTM). They're not part of the Continuity Bridge. The remaining 25 pages should be:

- User Workbench (dashboard, accounts, deals, tasks)
- Twin Workbench (AI reasoning, proposals)
- My Desk (approvals, governance)
- Settings (connector management, tenant config)
- Admin (tenant mgmt — if admin role)

### 5.3 Namespace — Finish `@iw/` → `@integratewise/` Migration

```bash
# Find all remaining @iw/ references
grep -r "@iw/" --include="*.ts" --include="*.tsx" --include="*.json" .

# Replace
sed -i '' 's/@\b iw\b /@integratewise/g' $(grep -rl "@iw/" --include="*.ts" --include="*.tsx" --include="*.json" .)
```

Update `tsconfig.json` paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@integratewise/*": ["./src/*"],
      "@integratewise/types": ["./types/*"],
      "@integratewise/ui": ["./components/ui/*"]
    }
  }
}
```

### 5.4 Auth — Wrap Supabase in Gateway JWT

```typescript
// middleware.ts — BEFORE (Supabase session)
const {
  data: { session },
} = await supabase.auth.getSession();

// middleware.ts — AFTER (Gateway JWT)
const jwt = await verifyGatewayJWT(req.headers.get("Authorization"));
const tenantId = jwt.tenant_id; // extracted from claim, not client payload
req.headers.set("x-tenant-id", tenantId);
```

The Supabase session is **not** the source of truth. The Gateway JWT is.

---

## 6. What This Means for the Template

| Milestone                                          | Blocked By                               | ETA       |
| -------------------------------------------------- | ---------------------------------------- | --------- |
| Publish `integratewise-continuity-bridge` template | P0 #1–10 in NEW repo                     | Month 2–3 |
| Close P0 #1 in legacy repo                         | Add `tenant_id` to all 30+ tables        | This week |
| Close P0 #9 (MCP-JWT)                              | Build `apps/mcp-server` in new repo      | Month 1   |
| Close P0 #10 (Auth freeze)                         | Remove Supabase Auth, deploy Gateway JWT | Month 1   |
| De-Supabase (DECISION 22)                          | Migrate data from Supabase → D1          | Month 2–3 |

**The template is NOT a fork of the current codebase.** The template is a **new repo** built to the canonical spec. The current codebase is the **legacy surface** that will gradually consume the Bridge.

---

## 7. The Honest Assessment

| Claim                                | Reality                         | Gap         |
| ------------------------------------ | ------------------------------- | ----------- |
| "100% Cloudflare"                    | Next.js + Vercel + Supabase     | **Massive** |
| "26 services, service bindings"      | 0 Cloudflare Workers            | **Massive** |
| "MCP-first ingress"                  | 0 MCP server code               | **Massive** |
| "Gateway JWT"                        | Supabase Auth                   | **Large**   |
| "Capability-first APIs"              | Conventional Next.js API routes | **Large**   |
| "One full UI, 8 projections"         | 83 pages, 50+ marketing pages   | **Medium**  |
| "@integratewise/sdk"                 | `@iw/*` in 25+ files            | **Small**   |
| "Design tokens, no hardcoded colors" | 40+ hardcoded hex files         | **Medium**  |

**The architecture is 6–12 months ahead of the codebase.** This is not a criticism — it's a common pattern for ambitious systems. The FINAL spec is the **target**; the L1 audit is the **baseline**. The gap is the work.

**The only question:** Do you build the template from the current codebase (Option A: 3-month rewrite), or do you fork (Option B: parallel build)?

Given the 83-page bloat, the Supabase entanglement, and the Next.js/Vercel lock-in, **Option B is the only viable path.** The current codebase is a valuable Customer-Zero deployment. The new repo is the canonical future.

---

## 8. Next Steps

1. **This week:** Close P0 #1 (cross-tenant leak) in legacy repo. Add `tenant_id` to all 30+ Supabase queries.
2. **This week:** Delete 50+ marketing pages. Consolidate to 25 core pages.
3. **Week 2:** Create `integratewise-continuity-bridge` repo. Scaffold `apps/gateway`, `apps/workbench`, `apps/mcp-server`.
4. **Week 3:** Deploy Gateway JWT. Wrap Supabase Auth in legacy repo.
5. **Month 1:** Build MCP server with JWT guard. Test inbound MCP with Cursor.
6. **Month 2:** Build D1 schema, migrate one table (e.g., `accounts`), test `withTenant()`.
7. **Month 3:** Full de-Supabase. Template publish.

---

**END OF DOCUMENT**

_This is the companion reality check to FINAL_E2E_SYSTEM.md. It exists to prevent the template from being built on fiction. The architecture is correct. The codebase is real. The gap is the work._
