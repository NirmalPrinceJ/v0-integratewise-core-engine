# Configuration Manager

The Configuration Manager compiles how the platform behaves for a specific deployment, tenant, workspace, role, and policy context.

For canonical behavior, see `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md` and `docs/platform-specs/` configuration-related specs.

## Purpose

The Configuration Manager answers: how should this tenant operate right now?

It does not own secrets. Secrets are resolved by the Secrets Provider and injected at adapter edges.

## Effective configuration precedence

Runtime configuration is compiled from these layers:

1. Platform Default
2. Deployment Profile
3. Environment Profile
4. Tenant Configuration
5. Tenant Policy
6. Runtime Feature Policy

Not every layer can override every field. Platform-only fields include:

- mandatory audit
- governance bypass prevention
- tenant isolation
- encryption floor
- platform safety policy

These cannot be weakened by tenant configuration.

## CompiledTenantConfig

The compiled output includes tenant identity, state bindings, Workbench composition rules, feature policy, memory policy, retention policy, AI runtime and provider policy, observability, notifications, capabilities, governance references, and approval policy.

Recompilation is triggered by authorized changes to configuration, deployment profile, tenant policy, provider bindings, feature policy, or schema/version migration.

## Version pinning

Compiled configurations are assigned monotonic version identifiers when used for execution decisions. ExecutionPlans pin the exact config version they were generated under. Mid-flight configuration updates do not change active execution paths.

Historical configurations are retained for audit and rollback within retention policy windows.

## Runtime materialization boundary

A configuration declaration is not an active runtime. Configuration defines what
is permitted; it does not itself make a provider, component, or route usable.

```text
Configuration Manager
  → CompiledTenantConfig
  → Wiring Resolver
  → ResolvedRuntimeBindings
  → Activation Manager
  → ActivatedRuntimeManifest
  → Routing Manager
  → InvocationRoute
```

The responsibilities are intentionally non-overlapping:

- **Configuration Manager** defines policy, bindings, preferences, fallbacks,
  and the versioned set of possibilities.
- **Wiring Resolver** turns that configuration into concrete binding references.
- **Activation Manager** verifies and materializes those bindings: contract
  compatibility, health, resource readiness, connection state, and capability
  registration.
- **Routing Manager** selects only from the activated manifest for a particular
  invocation. It cannot invent a provider or a component binding.

Hermes receives an authorized plan with an already activated route. It
coordinates execution; it never discovers infrastructure. An activation failure
therefore removes or degrades a route rather than silently changing the
architecture at execution time.

### Current Workbench runtime implementation

The connected-action path implements this boundary in Gateway today:

1. `tenant_spine_config.connected_connectors` is the current persisted tenant
   configuration input. It can only narrow the explicit deployment bootstrap
   profile; it cannot introduce a provider, adapter, endpoint, or capability.
2. The Wiring Resolver compiles that allow-list into known capability bindings.
3. Activation matches only `active` or `connected` records from
   `tenant_integrations`, producing an immutable manifest for the request.
4. Routing selects a capability only from that manifest. A plan pins its
   manifest version and Gateway verifies the same activated route again at
   approval time.

The shared-D1 migration `sql-migrations/d1/012_workbench_runtime_wiring.sql`
provides the configuration, connection, focused-Spine, and active-work-context
tables required by this path. The next platform increment is a persistent full
`CompiledTenantConfig` service and durable provider-health activation registry;
the current adapter intentionally keeps those responsibilities out of Hermes
and the browser.

## Swappable provider architecture

This is not optional. Product code must not import provider SDKs directly. Deployment configuration selects implementations; application architecture does not.

This rule matters for partners and developers because extension points are contract-based, not SDK-based. Build against contracts. Do not vendor-lock custom adapters to product code paths.

## Extension behavior

External configurations and custom integrations should respect tenant policy boundaries. Extension modules should not assume they can override platform safety, governance, audit, isolation, or retention settings.

Partners doing custom deployment profiles must preserve platform-only immutability guarantees.

## Operational considerations

Changes to effective configuration can:

- alter capability availability
- change provider fallback behavior
- modify memory or retention rules
- affect feature exposure
- invalidate cached runtime state

Treat configuration changes as potentially breaking compatibility with in-flight operations.
