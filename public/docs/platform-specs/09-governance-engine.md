# 09 — Governance Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 998
> **Lines:** 45 | **Chars:** 1,731
> **Status:** Raw extraction — requires review and canonicalization

09 — Governance Engine
9.1 Responsibilities
Issue governance tokens (gov*…) before any high-risk write.
Enforce approval chains and confidence thresholds.
Drive multi-level approvals and delegations.
Operate emergency overrides.
9.2 Approval chain
Confidence ≥ 0.85 → auto-approve (subject to posture).
0.70 ≤ Confidence < 0.85 → single approver.
< 0.70 → multi-level approver chain.
governancePolicy=judicial → N-of-M approvers; cannot be auto-approved.
9.3 Token minting
Copygov_token:
id: gov_abc
capability_id: cap_update_field
ent_id: ent_lead_123
delta: {…}
posture: propose|judicial|auto
approver_chain: [usr_mgr, usr_director]
expires_at: ISO8601
audit_ref: obs_audit*…
9.4 Policy engine
Policies declared in tenant_spine_config.governance_posture (per existing spec).
Policies can be capability-scoped, entity-typed, or field-pinned.
9.5 Emergency overrides
Break-glass token requires MFA + auto-creates AuditEvent flagged severity=emergency (16).
9.6 Inputs
CapabilityInvoked with governancePolicy != null.
Admin overrides.
9.7 Outputs
gov_token issued, then CapabilityAuthorized event.
9.9 Events
Produced: GovernanceRequested, GovernanceApproved, GovernanceRejected, GovernanceTokenMinted, GovernanceOverrode.
Consumed: CapabilityInvoked, AdminOverrideRequested.
9.10 APIs
POST /governance/request, POST /governance/{gov_id}/approve, POST /governance/{gov_id}/reject.
9.11 State transitions
requested → pending_approval → approved | rejected | overrode | expired.

9.12 Failure handling
Approver unavailable → fallback to next in chain + SLA breach (16).
Expired token → re-request.
9.13 Extension points
Custom policies via POLICY_PACK(name).
Delegated approvers.
