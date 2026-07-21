# 24 — Integration Manager

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3139
> **Lines:** 40 | **Chars:** 1,862
> **Status:** Raw extraction — requires review and canonicalization

24 — Integration Manager
24.1 Why this doc exists
Connector Framework (08) describes Nango/MCP/Native/Custom API as separate concepts. The Integration Manager is the single abstraction layer that lets a Capability invocation pick the right underlying transport, abstracting over all four.

Authorization authority: **Descope** is the canonical external authorization authority for supported outbound connections. Nango is one transport among the compatibility adapters (legacy/dormant) and is not the default architecture.

24.2 Pipeline (preserves user’s ASCII)
Capability (05)
↓
Integration Manager
↓
Descope ── canonical outbound authorization authority (where supported)
MCP ── tool servers, structured contexts
Nango ── legacy/dormant compatibility adapter (OAuth-mature SaaS)
Native ── first-party adapters (Salesforce, HubSpot)
Custom API ── raw HTTP/GraphQL/protobuf
24.2b Execution surface boundary
IW-Continuity-Bridge is the **public semantic MCP surface** (fixed IntegrateWise semantic contract). External AI clients (ChatGPT, Claude, Perplexity, Hermes) connect through the Bridge.
The **Descope MCP Adapter** (established at commit `5c15413e`, internal execution adapter) resolves Descope-managed outbound authorization and executes an already selected, governed, activated provider route. External AI clients must not connect directly to the Descope MCP execution surface.
24.3 Responsibilities
Resolve Capability transport*hints[] to one of {nango, mcp, native, custom}.
Mint & cache short-lived conn* tokens through 08 / 14.
Aggregate Connector Deltas into a unified ConnectorDelta shape.
Health-impose per-transport breakers.
24.4 Inputs
CapabilityInvoked events (05).
Connector HealthyChanged (08).
Admin transport overrides.
24.5 Outputs
Resolved writes through chosen transport.
Aggregated ConnectorDelta stream into Spine (02) and Signals (10).
24.6 Events produced
IntegrationResolved, IntegrationDispatched, IntegrationCompleted, IntegrationFailed, IntegrationTokenRefreshed, IntegrationBreakerOpened, IntegrationBreakerClosed.
24.7 Events consumed
Every CapabilityInvoked, ConnectorHealthyChanged, MCPDiscoveryUpdated.
24.8 APIs
POST /integration/resolve, GET /integration/{cap_id}/transports, POST /integration/{cap_id}/dispatch, GET /integration/breakers.
24.9 State transitions
idle → resolving → dispatching → succeeded | failed → cooldown → idle.

24.10 Failure handling
Transport failure → breaker open per transport; subsequent attempts use next transport.
After N consecutive breaker opens → emit ConnectorRetired (08.10).
24.11 Extension points
New transports via INTEGRATION_TRANSPORT(name).
Custom resolver strategies INTEGRATION_RESOLVER(name).
