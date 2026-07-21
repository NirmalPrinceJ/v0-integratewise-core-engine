# 15 — Deployment Architecture

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1229
> **Lines:** 43 | **Chars:** 1,172
> **Status:** Raw extraction — requires review and canonicalization

15 — Deployment Architecture
15.1 Cloudflare-native topology
CopyCloudflare
│
▼
Gateway (Worker) ── auth, routing, rate limit
│
▼
Workers (stateless compute) ── Twin, Memory, Signals, Workflows, Marketplace
│
▼
Queues ── retries, dead-letter
│
▼
D1 + DO ── Spine, RBAC, projections
│
▼
KV ── capability registry, persona greetings cache
│
▼
R2 ── snapshots, audit archive, listing bundles
│
▼
Durable Objects ── per-tenant SpineDO, TwinAgent DO, TenantBrainDO
│
▼
External Connectors ── via Nango + MCP
15.2 Environments
Env Purpose
dev personal compute
staging synthetic tenant population
prod multi-region (CF smart placement)
15.3 Release strategy
Dark-launch via feature flag (FeatureFlag per tenant).
Progressive rollout 1% → 10% → 50% → 100%.
Rollback via flag flip.
15.4 Migration strategy
Versioned migrations, reversible, dry-run in staging.
Schema migration bumps tenant_spine_config.schema_version (m054+).
15.5 Failure handling
Worker crash → DO alarm catches; CF retry + Queue.
15.6 Extension points
Region pinning per tenant.
