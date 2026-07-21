# 10 — Signal Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1043
> **Lines:** 41 | **Chars:** 1,582
> **Status:** Raw extraction — requires review and canonicalization

10 — Signal Engine
10.1 Responsibilities
Detect deltas, classify them, score them, surface them as Signals, derive Insights, and feed Proposals into Twin.
10.2 Pipeline
CopyConnector Delta ──▶ Detection Rule ──▶ Aggregation ──▶ Scoring ──▶ Priority ──▶ Signal ──▶ Insight ──▶ Proposal
10.3 Signal definition
Copysig_id: sig_abc
kind: risk | opportunity | anomaly | trend | slip
subject: ent_lead_123
score: 0…1
priority: p0 | p1 | p2 | p3
detected_at: ISO8601
ttl: duration
provenance:[…]
10.4 Detection Rule (DSL)
Copyrule:
id: sig_rule_renewal_risk_30d
trigger: ConnectorDelta(conn=salesforce, object=opportunity, field=close_date)
condition: close_date - today <= 30d AND stage_change_count >= 2
aggregate: over(7d) by ent_account_id
score: 0.8
priority: p1
downstream: [signal, insight, proposal_cap_mark_renewal_risk]
10.5 Inputs
ConnectorDeltaReceived (08).
Memory evolution events (07) for cross-source patterns.
10.6 Outputs
SignalCreated, InsightDerived, ProposalGenerated.
10.7 Events
Produced: SignalCreated, SignalScored, InsightDerived, ProposalGenerated, SignalExpired.
Consumed: ConnectorDeltaReceived, MemoryPromoted.
10.8 APIs
POST /signals/rules, GET /signals?priority=…, POST /signals/{sig_id}/accept, POST /signals/{sig_id}/dismiss.
10.9 State transitions
detected → scored → surfaced → accepted | dismissed | expired.

10.10 Failure handling
Rule evaluation failure → dead-letter queue.
Signal TTL elapsed → emit SignalExpired.
10.11 Extension points
New detection rules via Marketplace (13) or admin SDK.
