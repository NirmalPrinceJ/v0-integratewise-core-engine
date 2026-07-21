# Distribution and access doctrine: IW-Continuity-Bridge

IW-Continuity-Bridge is the access and distribution layer for continuity capabilities. It is **not** the IntegrateWise product and it is not a second generic assistant. It gives approved entry points a semantic, policy-bound way to use the platform.

## What the Bridge exposes

The Bridge should present user-meaningful operations, not raw internal topology. Its vocabulary includes:

- orienting to active context, changes, history, decisions, commitments, knowledge, and prepared work;
- asking for a grounded explanation or preparation;
- retrieving available actions and plans;
- requesting a governed proposal, approval, or persistence operation; and
- creating a scoped context projection, state relay, agent handoff, or action delegation.

The Bridge is a facade over platform contracts. It must not expose internal databases, unrestricted memory, raw connector credentials, hidden prompts, or a bypass around policy and governance.

## Approved access shapes

Distribution may package the Bridge for an IntegrateWise application, an authenticated MCP client, a supported skill, or a starter integration. Each package must carry the same semantics, boundary checks, and auditability. Packaging is not authority: installation does not grant tenant access.

An access request must resolve the caller’s tenant membership and role server-side, establish a `ContextBoundary`, and return only the permitted projection. High-impact operations retain their existing approval and execution controls.

Internal browser calls are forwarded through the Gateway only. The Gateway strips caller-supplied service identity headers and attaches a private `GATEWAY_CONNECTOR_AUTH_SECRET` assertion; the Bridge accepts forwarded identity only when that assertion matches its own configured secret. Deployments must configure the same secret on both services. Missing or mismatched assertions fail closed.

## External availability status

**Status: private alpha.** IW-Continuity-Bridge must not be advertised as public or marketplace-ready until tenant-membership authorization is verified for external OAuth/MCP clients.

The current release gate is explicit: a client must not be able to select or assert a tenant through free-form request data. Before public distribution, the authorization service must bind the authenticated principal to a verified tenant membership, enforce that binding on every Bridge call, and prove isolation with negative tests. Until then, Bridge packages are for controlled internal/private-alpha use only.

## Release gate

Public distribution requires all of the following:

1. verified tenant membership and role resolution for every external caller;
2. target registration and policy enforcement for tool and agent exchanges;
3. expiry, revocation, audit, and redaction tests for each exchange mode;
4. no ability to retrieve private reasoning, credentials, or unscoped state; and
5. product review confirming the package reinforces the Workbench experience rather than becoming a competing AI surface.

Prepared exchanges are auditable boundary projections, not a recipient-delivery protocol. Before a tool or agent can claim one, the platform also needs recipient-authenticated delivery, one-time or leased retrieval, acknowledgement, and failure-state audit records.
