# 31 — Evolution Strategy

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3460
> **Lines:** 36 | **Chars:** 1,914
> **Status:** Raw extraction — requires review and canonicalization

31 — Evolution Strategy
31.1 Responsibilities
Define safe evolution of Schema, Capability, Connector, Persona, API, Memory, and Migration strategy.
31.2 Evolution areas
Area Reference Strategy
Schema 12 + 02 additive-first; bump schema_version; reversible
Capability 05 new cap_id per major change; deprecate old by status
Connector 08 version bump; certified path; admin opt-in for breaking changes
Persona (existing spec, 12×11) new sub-role or industry requires Steering Committee
API 19 URI versioning; 6-mo deprecation; parallel-run
Memory 07 versioning of pipeline layer logic; data is append-only
Migration 15.4 + 21 reversible; dry-run; bump schema_version
31.3 Inputs
Schema change PRs, Capability change PRs, authored Connector changes.
Admin-initiated migrations.
31.4 Outputs
Rollout plan + flag flips (15.3).
Migration artifact (id, scope, dry-run result, reversal procedure).
31.5 Events produced
EvolutionStarted, EvolutionFlagged, EvolutionRolledBack, EvolutionCompleted, SchemaVersionBumped, CapabilityDeprecated, ConnectorDeprecated, ApiDeprecated, MemoryLayerDeprecated.
31.6 Events consumed
CapabilityRegistered, CapabilityDeprecated, ConnectorInstalled, ConnectorRetired, SchemaVersionBumped.
31.7 APIs
POST /evolution/migrations, POST /evolution/migrations/{mig_id}/dry-run, POST /evolution/migrations/{mig_id}/apply, POST /evolution/migrations/{mig_id}/rollback.
31.8 State transitions
draft → tested → dark_launch → canary → progressive → stable → deprecated → removed.

31.9 Principles
Additive-first, never destructive by default.
Every deprecation publishes a Sun-Set banner 6 months in advance (19.1).
Backwards compatibility is preserved for ≥ 1 prior schema_version.
31.10 Failure handling
Dark launch metric regression → automatic flag rollback.
Migration apply failure → automated reversal; admin notified.
31.11 Extension points
New evolution channels via EVOLUTION_CHANNEL(name).
