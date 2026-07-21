# Observability

Observability in IntegrateWise is built around three behaviors: trace execution, measure health, and preserve accountability.

For canonical runtime and operations context, see:

- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
- `docs/ops/RUNTIME_TOPOLOGY.md`
- `docs/internal/operations/DEPLOYMENT_RUNBOOK.md`

## Correlation and tracing

Every execution thread should carry a unique correlation identifier from the edge boundary. This identifier should be injected into internal messages, async event steps, and adapter payloads.

Integration partners should:

- preserve correlation identifiers in outbound payloads where supported
- log them alongside handler and transport metadata
- include them in outcome and webhook payloads when available

## Provider health

Provider health states are exposed through registry telemetry. Health is evaluated along:

- latency
- error rate
- saturation

Rolling windows and threshold rules are tenant-configurable. When health degrades:

- registry shifts provider state to degraded
- breaker logic may be tripped
- Workbench displays explicit warnings
- capability availability changes are reflected in the Capability Fabric surface

## Execution telemetry

Hermes reports:

- queued state
- executing state
- provider confirmation
- timeout events
- failure classifications
- outcome events

Partners should not infer success from absence of failure. Always check provider confirmation and promotion outcome before treating an action as canonical.

## Audit expectations

Every consequential action should emit audit events that preserve:

- actor
- authority scope
- policy validation result
- affected context
- exact provider operations
- execution-plan version
- approval record
- provider outcome
- synchronization result

Audit logs are not debugging logs. They are accountability records.

## Alerting and incident signals

Operators should monitor:

- provider error rates and breaker state changes
- governance denial or approval latency
- approved proposal execution failure rates
- sync conflict volume
- sync lag beyond configured policy windows
- cache staleness for critical projections

Toy alerts increase incident noise. Target alerts that indicate material risk, user impact, time sensitivity, or system integrity issues.

## Partner incident support

When a partner integration causes incidents:

- provide correlation IDs, approval tokens, proposal IDs, and execution-plan versions
- preserve raw payloads and adapter responses within retention windows
- do not alter logs after incident time without timestamped, documented, governed changes
- notify the customer-facing support path through established channels
