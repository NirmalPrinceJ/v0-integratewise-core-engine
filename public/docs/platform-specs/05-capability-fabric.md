# 05 — Capability Fabric

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 780
> **Lines:** 55 | **Chars:** 2,275
> **Status:** Raw extraction — requires review and canonicalization

05 — Capability Fabric
5.1 Responsibilities
Host the capability registry (cap_id).
Resolve invocation surfaces uniformly.
Bind sync mode (soft|real|propose) and rollback strategy.
Mints governance tokens when required.
5.2 Capability definition
Copyid: cap_draft_outreach # canonical
name: Draft Outreach
description: Free-text. Includes the persona-fit profile.
version: 1.4.2
inputs:
to_lead_id: { type: ent_id, required: true, scope: leads }
template_id: { type: ent_id, required: false }
personalization: { type: string, required: false, max: 4000 }
outputs:
draft_id: { type: ent_id, scope: messages }
confidence: { type: number, range: [0,1] }
requiredScopes: [leads:read, messaging:write]
confidenceThreshold: 0.7
defaultSyncMode: soft
governancePolicy: propose # soft|real|propose
auditSchema: { actor, lead_id, delta_text_hash, proposal_only }
rollbackStrategy: delete_draft # or restore_field
surfaceCompatibility:
workbench: true
twin: true
chat: true
cli: true
slack: true
mobile: true
5.3 Lifecycle
Copydeclared ──▶ registered ──▶ versioned ──▶ deprecated ──▶ removed
│
└──▶ revoked (security incident)
5.4 Inputs
Capability SDK / manifest submission.
Admin overrider via governance_posture.
5.5 Outputs
A capability invocation record cap_invocation and the corresponding gov_token (when applicable).
5.6 Events
Produced: CapabilityRegistered, CapabilityDeprecated, CapabilityInvoked, CapabilityCompleted, CapabilityFailed, CapabilityRolledBack.
Consumed: PersonaChanged, ConnectorHealthyChanged, WorkspaceSwitched, TwinProposing.
5.7 APIs
POST /capabilities, POST /capabilities/{cap_id}/invoke, GET /capabilities/{cap_id}/invocations.
5.8 State transitions
Per invocation: requested → validated → authorized → executing → succeeded|failed|rolled_back.

5.9 Failure handling
Auth failure → reject before Connector call.
Connector call failure → invoke rollbackStrategy; emit CapabilityFailed.
Replay protection via idempotency key in the capability invocation row.
5.10 Extension points
Vendors may register new capabilities via Marketplace (13).
Conflicting capability ids rejected by prefix rule.
