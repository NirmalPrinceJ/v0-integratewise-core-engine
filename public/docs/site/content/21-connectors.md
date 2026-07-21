# Connectors

Connectors are the transport surface between IntegrateWise and external systems. This page covers the models, boundaries, and operational expectations that matter for integration work.

For canonical detail, see `docs/platform-specs/08-connector-framework.md` and `docs/platform-specs/24-integration-manager.md`.

## Connector types

The platform distinguishes these transport surfaces:

- API Connectors for REST, GraphQL, and gRPC integration.
- MCP Connectors for tool/resource/server protocols.
- AI Connectors for LLM, embedding, and reranking providers.
- API Wrappers for non-standard or legacy endpoints that need normalization.

They are not interchangeable. They do not share one generic integration contract.

## API Connector boundaries

API Connectors manage pagination, rate-limiting headers, authentication challenges, retry behavior, schema exposure, and delta detection. They ingest data via Creamy, Delta, or Streaming Load modes.

Egress behavior is governed. API Connectors cannot execute autonomous mutations. They must receive a validated, signed ExecutionPlan from the governance and planning chain.

## MCP boundaries

MCP Connectors expose tools, resources, prompts, and server capabilities to governed runtime consumers. The Twin sees capabilities, but invocation is intercepted and routed through Governance before execution in an isolated context.

Do not bypass the interception boundary for convenience. Governance failure on an MCP invocation must result in denial, not degraded execution.

## AI Connector boundaries

AI Connectors normalize model vendors into one internal interface. The platform does not bind product behavior to provider-specific message formats.

Expect:

- unified request and response typing.
- token and cost constraints defined in CompiledTenantConfig.
- deterministic failover to configured fallback providers.
- explicit operational warning dispatch on model degradation.

## API Wrapper boundaries

API Wrappers translate non-canonical external APIs into schema-compliant platform capabilities. They declare inputs, outputs, authority needs, evidence requirements, execution mode, risk, and governance policy.

Wrappers should inject idempotency when the downstream system lacks it. They should strip internal metadata from outbound payloads and normalize inbound payloads to canonical fields before they enter core logic.

## Contract requirements

Every connector surface must define:

- identity and authentication lifecycle
- supported objects, fields, and events
- read and write capability surface
- webhook or streaming contract if applicable
- error model and retry semantics
- degradation behavior on partial failure
- evidence requirements for write attempts

## Failure behavior

Connector failures should be isolatable. A failing provider must not leak memory, crash runtime containers, corrupt tenant state, or bypass tenant isolation.

Breakers should trip based on rolling error rates or explicit health failures. Recovery should prefer cached safe reads, degraded capability disclosure, and graceful fallback over hard failures.

## Testing and verification

External partners should test against sandbox or preview environments before touching production tenants. Production integration requires tenant policy alignment, approval workflows, and audit event review.
