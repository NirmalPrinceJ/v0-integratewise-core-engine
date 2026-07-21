# 32 — Plugin Runtime

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3496
> **Lines:** 51 | **Chars:** 2,105
> **Status:** Raw extraction — requires review and canonicalization

32 — Plugin Runtime
32.1 Pipeline (preserves user’s ASCII)
CopyPlugin
↓
Validation
↓
Sandbox
↓
Permissions
↓
Resources
↓
Capability Registration
↓
Lifecycle
32.2 Responsibilities
Host third-party Plugin bundles (WASM or JS-in-Worker) supplied through Marketplace (13).
Validate, sandbox, assign permissions, allocate resources, register capabilities, manage lifecycle.
32.3 Plugin kinds
connector_plugin, capability_plugin, workflow_plugin, persona_kit_plugin, design_pack_plugin.
32.4 Inputs
ListingInstalled (Community Agent kind; 23.2).
Admin overrides.
32.5 Outputs
Registered Capabilities (05), Workflows (11), Persona Kits (06).
32.6 Events produced
PluginValidated, PluginSandboxed, PluginPermissionsGranted, PluginRegistered, PluginResourcesAllocated, PluginLifecycleEvent, PluginUninstalled, PluginQuarantined.
32.7 Events consumed
ListingInstalled, ListingUpgradeStarted, CapabilityRegistered.
32.8 APIs
POST /plugins, POST /plugins/{plg_id}/validate, POST /plugins/{plg_id}/sandbox, GET /plugins/{plg_id}/health, POST /plugins/{plg_id}/permissions, POST /plugins/{plg_id}/uninstall.
32.9 State transitions
uploaded → validating → validated → sandboxed → permissions_assigned → resources_allocated → installed → upgrading → deprecated → uninstalled → quarantined.

32.10 Sandbox
WASM execution in Worker with capability allowlist enforced at runtime.
Resource budgets: CPU ms, memory bytes, network egress URLs (allowlist).
32.11 Permissions
Plugin declares permissions[] (capabilities + data scopes + network egress hosts).
Validation rule: declared permissions ⊨ advertised Marketplace scopes.
32.12 Resources
Quotas per plugin per tenant; default ceilings in 29 Billing.
Per-plugin token meter for cost attribution.
32.13 Lifecycle ownership
Plugin may declare its own lifecycle adapter, but bounded by Plugin Runtime contract; cannot terminate itself.
32.14 Failure handling
Crashed plugin → auto-restart ≤ 3; quarantine after.
Resource ceiling breach → throttle + admin notify.
32.15 Extension points
New plugin kinds via Plugin SDK (17).
Custom sandbox capability types SANDBOX_CAP(name).
