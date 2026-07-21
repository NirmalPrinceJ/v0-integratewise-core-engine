# Deployment

This page summarizes deployment-relevant facts for operators and partners integrating with IntegrateWise.

For canonical detail, see:

- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/ops/RUNTIME_TOPOLOGY.md`
- `docs/internal/operations/DEPLOYMENT_RUNBOOK.md`

## Runtime boundaries

- IntegrateWise Customer Zero and production SaaS run on Cloudflare infrastructure.
- Do not deploy production services without explicit founder instruction.
- Use preview environments before production.
- Always unset `CLOUDFLARE_API_TOKEN` before running `wrangler` commands intended for non-production verification.

## Environment separation

Treat these environments as independent:

- local development
- preview
- production

Configuration, secrets, feature flags, tenant policy, and runtime bindings differ by environment. Do not assume a behavior proven in local development is automatically valid in production tenant context.

## Service ownership

Operators should keep clear ownership across:

- gateway: entry, auth, API surface
- pipeline: ingestion, normalization, Spine hydration
- connector: connection lifecycle and transport adapters
- intelligence: signals, trigger policy, proposal shaping
- knowledge: chunking, embedding, retrieval
- governance: policy, approval, audit
- twin runtime: runtime-bound session coordination

Do not redeploy services in isolation when schema, contract, or governance changes affect multiple boundaries.

## Credential and secret handling

- Never write credentials, tokens, IPs, or secrets into code, comments, docs, logs, or chat outputs.
- Secrets are resolved just-in-time.
- Provider credential rotation should not require product action from users.
- Any integration workbooks, runbooks, or debug logs must redact secrets.

## Rollback and recovery

Deployment rollback is environment-specific. Operators should:

- validate affected migrations or schema changes before promotion
- confirm provider adapter compatibility after deployment changes
- review feature policy and tenant policy after runtime configuration updates
- keep rollback manifest or prior deployment identifiers available

For step-by-step rollback behavior, use the internal deployment runbook rather than approximating from this page.

## Observability after deployment

After deployment, verify:

- gateway health and auth behavior
- connector registration and provider health
- ingestion pipeline latency and backpressure behavior
- projection freshness and cache behavior
- audit event continuity
- approval and outcome flows end to end

Use API surface health checks and provider health indicators, not assumed timing.
