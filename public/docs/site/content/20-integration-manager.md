# Integration Manager

The Integration Manager governs external connection lifecycles, authenticates boundary nodes, and manages the ConnectionProviderRegistry.

For the canonical platform contract, see `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md` and `docs/platform-specs/24-integration-manager.md`.

## Role

The Integration Manager is responsible for every external connection event that crosses the boundary between IntegrateWise and outside systems. It does not manage internal storage, cache, identity, observability, or billing providers.

## What it governs

- OAuth handshakes and token refresh flows.
- Webhook registration, signature verification, tenant correlation, and event normalization.
- MCP server discovery, tool schema exposure, and invocation governance.
- Connection health and lifecycle state transitions.
- Breaker behavior for unhealthy transports.

## What it does not do

- It does not approve actions.
- It does not compile ExecutionPlans.
- It does not execute customer workflows in external environments.
- It does not write canonical truth to the Spine directly.

## Integration paths

The platform preserves four distinct paths:

- REST/GraphQL for synchronous outbound reads and governed mutations.
- Webhooks for asynchronous inbound events.
- MCP for dynamic tool and resource capabilities.
- Database/queue for high-throughput native ingress when explicitly supported.

Each path has its own contract, failure model, retry behavior, and auth lifecycle.

## Authentication lifecycle

Connections are established, refreshed, and retired through bound adapters. The platform does not store raw long-lived provider secrets in user-facing tenant configuration. Secrets are resolved just-in-time and injected at the edge of network transmission.

If a downstream token rotates, the system should invalidate active connections, re-authenticate silently when policy permits, and surface connection issues through provider health indicators when it cannot.

## Health and degradation

Provider health is evaluated across latency, error rate, and saturation. When a transport reports repeated failures or exceeds configured thresholds, the registry shifts that transport to degraded state and applies fallback or breaker behavior.

Workbench users see explicit warnings when actions are unavailable or limited due to provider degradation. Technical adapter details remain hidden unless troubleshooting requires disclosure.

## Partner considerations

Partners integrating with IntegrateWise should treat connection state as governed metadata, not as a freeform property store. Connection changes may trigger capability availability changes, capability render updates in the Workbench, and cache invalidation. Build for that.

Outbound writes to external systems must not be assumed to succeed immediately. Expect governed approval, execution-plan pipeline states, async execution, and outcome reconciliation before provider changes are treated as canonical.

## Extension and onboarding

New transports are introduced through defined extension interfaces. Do not add new transports by modifying runtime path logic ad hoc. Use the explicit registration and strategy extension points exposed by the Integration Manager surface.
