# Runtime Topology

This page summarizes the runtime identities that matter for developers, partners, and operators.

For canonical state, also review:

- `docs/CANONICAL_STATE.md`
- `docs/ops/RUNTIME_TOPOLOGY.md`
- `docs/internal/operations/API_REFERENCE.md`
- `docs/migrations/DE_SUPABASE_MIGRATION.md`

## Current cloud-native runtime

IntegrateWise is 100% Cloudflare product plane for production runtime.

Primary bindings:

- D1 for structured state and metadata.
- KV for hot projections, cache acceleration, and reconstructable state.
- R2 for large immutable or versioned artifacts, evidence objects, and raw payloads.
- Vectorize for semantic retrieval vectors.
- Durable Objects for per-tenant runtime coordination and Twin session state.
- AI Gateway as the policy-bound inference runtime surface.

Supabase references remain only during migration. Do not add new Supabase logic, RLS talk, or dual-writes.

## Core runtime services

The platform runtime is organized around bounded service responsibilities rather than OODA microservice boundaries.

Tier overview:

- Gateway: entry, auth, request routing, projection facade, and public API surface.
- Pipeline: ingestion, normalization, Spine hydration, delta sync, and state continuity.
- Connector: connection lifecycle, OAuth, transport adapters, webhook ingress, and capability health.
- Intelligence: signal generation, trigger policy, Twin orchestration support, and proposal shaping.
- Knowledge: chunking, embedding, semantic search, topic sync, and ingest routing.
- Governance: pre/post proposal gates, approval workflows, policy enforcement, and audit.
- Twin runtime: runtime-bound Twin session coordination.

## Data substrate rules

These rules are hard:

- D1 owns structured state and metadata for current runtime.
- KV owns reconstructable hot projections and caches.
- R2 owns bytes, raw artifacts, large payloads, and evidence objects.
- Vectorize owns semantic retrieval vectors, not source truth.
- Embeddings are versioned derived representations and may always be rebuilt from source truth.
- Product logic talks to stable repository contracts, not directly to D1, KV, R2, or Vectorize.
- No product plane depends on a provider primitive.

## Developer-facing boundaries

When building against IntegrateWise:

- Use the gateway routes in `docs/internal/operations/API_REFERENCE.md` as the stable integration surface.
- Do not assume direct database access from custom code.
- Do not assume local filesystem or container-local persistence for production runtime.
- Assume multi-tenant isolation at the query layer.
- Assume secrets are resolved just-in-time and not exposed to config or logs.

## Partner integration expectations

Partners should plan around async, governed, observable integration behavior.

Expect:

- webhook ingress under strict signature verification.
- capability availability changes surfaced through registry health.
- pay-as-you-go rate and token limits enforced at adapter or registry layer.
- failover behavior determined by configuration, not runtime guesswork.
- incident evidence packaged in audit events, approval records, proposal history, and outcome events.

## Deployment orientation

IntegrateWise isolates compute capabilities from deployment environments. Core engines are packaged as immutable runtime units. Deployment manifests determine whether capabilities live in a unified container profile or mapped isolated instances.

Edge routing handles light read tasks and context projection updates. State isolation is enforced by tenant keys.

For deployment and rollback behavior, see `docs/site/content/41-deployment.md` and `docs/internal/operations/DEPLOYMENT_RUNBOOK.md`.
