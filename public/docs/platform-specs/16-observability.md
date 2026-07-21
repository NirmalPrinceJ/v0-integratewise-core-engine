# 16 — Observability

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1272
> **Lines:** 26 | **Chars:** 967
> **Status:** Raw extraction — requires review and canonicalization

16 — Observability
16.1 Responsibilities
Traces, logs, metrics, audits, healthchecks, service map.
16.2 Trace model
OpenTelemetry-compatible spans, exported via Cloudflare Logpush → Honeycomb/Datadog.
16.3 Logs
Structured JSON, tnt_id always present, retain 90 days hot, 1 year cold.
16.4 Metrics
Latency p50/p95/p99 per Gateway route.
Error rate per capability, per connector.
Cost per LLM call, per Twin turn.
16.5 Audit
obs_audit: append-only, signed, retained 7 years (regulatory baseline).
Audit events emitted by Governance (09), Memory Human Approval (06/07), Judicial actions, Security (14).
16.6 Healthchecks
/healthz Worker + DO probes.
16.7 Service map
Generated from traces; exported as graph.
16.8 Events
Emitted: AuditAppended, AlertRaised, HealthCheckFailed.
16.9 APIs
/obs/audit, /obs/metrics, /obs/traces, /obs/health, /obs/alerts.
16.10 Failure handling
Alert SLA: P0 ≤ 5 min notify, P1 ≤ 30 min, P2 ≤ 4 h.
16.11 Extension points
Webhook exporters.
