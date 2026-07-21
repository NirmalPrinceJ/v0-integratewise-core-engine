# Troubleshooting

Use this page for common integration and operator issues. For step-by-step resolution, also see:

- `docs/internal/runbooks/`
- `docs/internal/operations/DEPLOYMENT_RUNBOOK.md`
- `docs/internal/runbooks/sync-failure-and-dlq-redrive.md`

## Common symptoms and causes

### Projection is stale

Likely causes:

- sync is lagging behind provider changes.
- cache refresh has not occurred.
- provider change did not pass promotion checks.
- tenant policy windows delay refresh.

Actions:

- inspect provider health and sync state.
- confirm whether cache or Spine source is stale.
- do not assume stale projections are safe to act on without disclosure.

### Capability is unavailable

Likely causes:

- provider degraded or disconnected.
- user authority is insufficient for the current context.
- organization policy restricts the capability shape.
- required fields or state prerequisites are missing.
- feature policy is disabled for the tenant.

Actions:

- use available provider health indicators.
- review authority and role scope.
- verify capability contract requirements before retrying.

### Execution proposal is denied

Likely causes:

- pre-proposal governance denied authority or scope.
- post-proposal governance denied risk, evidence, or policy alignment.
- confidence is irrelevant if authority is missing.
- execution plan is malformed or uses stale configuration.

Actions:

- review governance denial reason and affected fields.
- correct proposal inputs, evidence, or authority source.
- recompile configuration if plan version is stale.

### Approval is stuck

Likely causes:

- assigned approver is absent.
- approval policy requires multiple actors.
- policy changed after proposal creation.
- provider or connectivity issue blocks dispatch after approval.

Actions:

- use delegation when policy permits it.
- escalate through defined approval policy channels only.
- do not bypass governance for expedience.

### Integration webhook failures

Likely causes:

- signature validation failed.
- tenant correlation did not match any active workspace.
- payload exceeded schema constraints.
- inbound path was rate-limited or unavailable.
- queue backpressure delayed ingestion.

Actions:

- verify signing secrets and rotation schedule.
- inspect correlation and tenant scope in webhook logs.
- use retry with backoff only where idempotency is guaranteed.

### Twin output is incorrect or stale

Likely causes:

- active context is stale.
- recommended action is based on outdated evidence.
- memory promotion rules have not applied.
- provider state changed after context assembly.

Actions:

- refresh context before acting.
- inspect evidence and provenance.
- use correction and reporting paths to reduce similar incorrect suggestions.

## Information to gather before escalation

- tenant ID, workspace ID, user ID
- correlation ID or request ID
- proposal ID and approval token if present
- execution-plan version and timestamp
- affected context identifiers
- provider identifiers and connection states
- exact error phase: observe, orient, decide, act, sync, promotion
- whether customer or external execution endpoints are involved
