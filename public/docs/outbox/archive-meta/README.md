> **Tier C — Historical.** This document is a point-in-time snapshot. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

# integratewise-live

**Deployable runtime for IntegrateWise: gateway, services, workers, SDK, APIs, and frontends.**

This repository contains everything that runs in production. Architecture, doctrine, ADRs, capability specifications, and platform contracts live in [`integratewise-ai-workspace`](https://github.com/NirmalPrinceJ/integratewise-ai-workspace) — the canonical source of truth for what this repo implements.

---

## What this repo contains

This repository is the active IntegrateWise monorepo.

- **Product surface:** `apps/web` is the canonical L1 Workbench target. Other app directories are implementation evidence only and must not be documented as separate products without verified canonical proof.
- **Gateway-first backend:** `services/gateway` is the single public ingress. Downstream workers are reachable through service bindings; public traffic should not bypass the Gateway.
- **Platform capability model:** ingest, normalize, synthesize, canonicalize, remember, understand, propose, govern, execute, continue.
- **Product grammar:** context lens → entity collection → entity 360 → activity → contextual intelligence → action → governance when required → execution state → continuity.
- **Twin inside L1:** Store in Spine, Ask Your Twin, Assign Your Twin, Approve Twin's Action. The Twin is a silent partner inside L1, not a separate chat surface.
- **Customer Zero:** IntegrateWise is its own first real tenant. Customer Zero is activation evidence, not a demo wizard.

## Memory & Logging Architecture

**Continuity is a platform behavior, not merely a page.**

- **Operational memory scope:** USER, WORK, ORGANIZATION.
- **Platform state:** persisted operational context enables workspace continuation, entity continuation, unresolved work awareness, prior decision awareness, and model/context continuation.
- **Governance:** actions, proposals, approvals, and execution outcomes are emitted as governed evidence, not free-form logs.
- **Product expression:** continuity appears in L1 through activity history, unresolved state, approval history, execution history, and continuation markers — it does not create those artifacts itself.

**Platform boundary:**

- Product plane is 100% Cloudflare: Workers + Pages + Queues + D1 + KV + R2 + Vectorize + AI Search + Durable Objects.
- Historical Supabase/Fortress references, legacy Next.js auth, and retired SSOT paths must be treated as historical evidence unless the migration docs classify them as active canonical substrate.

For current migration state, see [`MIGRATION-STATE.md`](MIGRATION-STATE.md).
For canonical doctrine, see [`docs/README.md`](docs/README.md).

---

## Infrastructure

100% Cloudflare: Workers + Pages + Queues + D1 + KV + R2 + Vectorize + Durable Objects.

- **Canonical product doctrine:** [`docs/README.md`](docs/README.md)
- **Product front door:** [`docs/architecture/PRODUCT_ARCHITECTURE.md`](docs/architecture/PRODUCT_ARCHITECTURE.md)
- **Workbench doctrine:** [`docs/architecture/WORKBENCH_DOCTRINE.md`](docs/architecture/WORKBENCH_DOCTRINE.md)
- **Spine data model:** [`docs/architecture/SPINE_MODEL.md`](docs/architecture/SPINE_MODEL.md)
- **System composition laws:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Locked decisions, services, bindings:** [`AGENTS.md`](AGENTS.md)

Product plane is 100% Cloudflare (D1/KV/R2/Vectorize/AI Search/Durable Objects). The Twin is
Cloudflare-native (`services/iw-agent-runtime`).

---

## Live surfaces

| Surface   | URL                                      |
| --------- | ---------------------------------------- |
| App       | https://app.integratewise.ai             |
| Gateway   | https://gateway.integratewise.ai         |
| Marketing | https://integratewise.ai (external repo) |

For boundary rules and migration state, see the sections above and [`MIGRATION-STATE.md`](MIGRATION-STATE.md).

---

## Quick start

```bash
# Install
pnpm install

# Run web app (localhost:3001)
pnpm --filter @integratewise/web dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test

# Deploy a worker
cd services/gateway && npx wrangler deploy --config wrangler.toml
```

Open [http://localhost:3001](http://localhost:3001).

### Development notes

Use Cloudflare-bound environment values only:

- `VITE_API_BASE_URL`
- Cloudflare secure storage for secrets

Do not reintroduce retired product-plane dependencies. If local setup docs drift from the canonical Cloudflare-only boundary, consult [`MIGRATION-STATE.md`](MIGRATION-STATE.md) and [`docs/CANON.md`](docs/CANON.md) before authoring new setup steps.

**Development principles:**

- **Cloud-first:** persisted state and logs belong in Cloudflare; no local file-backed product state
- **Per-tenant isolation:** never store shared state; all queries filter by `tenant_id`
- **Governed observability:** use audit trail and governance logs instead of ad-hoc console output
- **Type-safe:** keep `pnpm typecheck` at 0 errors
- **No secrets in code:** use environment variables + Cloudflare secure storage

---

## Deployment

- Frontend: Cloudflare Pages (auto-deploys on push to `main`)
- Workers: `npx wrangler deploy` from each service directory
- Secrets: Cloudflare Dashboard only — never in Git

---

## Architecture source of truth

Architecture, doctrine, DECISIONs, and capability specifications are maintained in:

**[integratewise-ai-workspace](https://github.com/NirmalPrinceJ/integratewise-ai-workspace)**

The contract bridge between the two repositories is `packages/types`. When AI Workspace freezes a contract, `packages/types` is updated to match.

---

**Company:** IntegrateWise LLP, Bengaluru, India
**Founder & CEO:** Nirmal Prince J
