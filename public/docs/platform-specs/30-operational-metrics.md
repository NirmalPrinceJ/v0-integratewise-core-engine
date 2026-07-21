# 30 — Operational Metrics

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3421
> **Lines:** 39 | **Chars:** 1,970
> **Status:** Raw extraction — requires review and canonicalization

30 — Operational Metrics
30.1 Why this doc exists
Observability (16) covers infrastructure health. Operational Metrics covers business health — the leading indicators that are predictive of pipeline, retention, and risk.

30.2 Responsibilities
Define, compute, and surface the canonical operational metrics.
Make every metric queryable per tenant, per workspace, per persona, per agent.
30.3 Canonical metrics (preserves user’s list)
Workspace Activation Rate — % of tenants with at least one wsp* transitioned past bootstrapping.
Time to First Value (TTFV) — wall clock from OAuth complete → first non-empty projection render.
Connector Adoption — average number of active conn* per wsp\_ by industry × department.
Capability Usage — daily invocations per cap_id, bucketed by persona.
Twin Acceptance Rate — % of Twin proposals accepted vs surfaced.
Memory Promotion Rate — L5 → L6 promotions per 24h per tenant.
Signal Precision — accepted signals / surfaced signals, rolling 7 d.
Approval Latency — GovernanceRequested → GovernanceApproved p50/p95.
30.4 Inputs
All event bus events (filtered / aggregated).
Tenant onboarding completion events (existing spec).
30.5 Outputs
Time-series metrics in a TSDB.
Aggregate reports rolled up nightly.
30.6 Events produced
OperationalMetricComputed, OperationalMetricAnomalyDetected.
30.7 Events consumed
All events (filtered by metric rule).
30.8 APIs
GET /ops/metrics/{metric_id}, POST /ops/metrics/{metric_id}/compute, GET /ops/dashboards/{tenant_id}.
30.9 State transitions
preregistered → live → deprecated. Anomaly state: nominal → warning → critical.

30.10 Anomaly detection
Per-metric threshold low/high plus weekly ML-driven adjustment; admins can pin.
30.11 Failure handling
Compute lag beyond SLO → MetricStale event + dashboard badge.
Anomaly spam-protection: min interval 15 minutes between alerts per metric per tenant.
30.12 Extension points
Custom metrics OP_METRIC(name).
Custom anomaly rules OP_ANOMALY(name).
