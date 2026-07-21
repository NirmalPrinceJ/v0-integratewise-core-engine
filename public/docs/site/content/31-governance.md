# Governance & Approval

Governance is the hard boundary between proposal and execution. IntegrateWise does not allow consequential actions to bypass governance.

For the canonical governance model, see `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`, `docs/architecture/UNIFIED_GOVERNANCE_SPEC.md`, and `docs/platform-specs/09-governance-engine.md`.

## Two gates

Governance uses two phases:

### Pre-Proposal Gate

Evaluates:

- authority
- scope
- policy

Possible results:

- ALLOW_PROCEED
- REQUIRE_PRE_APPROVAL
- DENY

A 0.99 confidence proposal with missing authority is still DENY.

### Post-Proposal Gate

Evaluates:

- risk
- evidence
- confidence
- approval requirement

Possible results:

- AUTO_APPROVE
- REQUIRE_HUMAN_APPROVAL
- DENY

Confidence never grants authority. High confidence does not remove approval requirements for consequential actions automatically.

## Approval Center

The Approval Center is the user-facing governance surface. Every proposed consequential action must flow through it.

Approval records include:

- proposed action
- business purpose
- initiating actor
- affected contexts and systems
- exact fields or operations
- evidence
- execution-plan version
- risk classification
- approval policy
- expected outcome
- rollback or recovery availability

Available decisions:

- Approve
- Reject
- Request Changes
- Edit and Approve when policy permits it
- Delegate Approval
- Cancel

## ExecutionPlan contract

The user never approves an AI message. The user approves an ExecutionPlan.

ExecutionPlan contains:

- plan identity and tenant scope
- proposal lineage
- immutable plan version
- summary and impact summary
- step dependencies and compensation steps
- affected entities and systems
- authority and evidence references
- execution mode and sync mode
- rollback strategy

After approval, the Workbench shows execution progress, provider responses, partial completion states, failure and retry states, sync results, and final outcome.

## Governing rules

- Approval Center is the only surface that can mint an approval token.
- No handoff package can be generated without approval lineage.
- Twin does not auto-execute.
- Governance rules are compiled configurations. They cannot be modified by model outputs or agent workflows.

## Audit expectations

Every consequential action must log:

- actor
- authority scope
- policy validation result
- affected context
- exact provider operations
- execution-plan version
- approval record
- provider outcome
- sync result
- tamper-proof audit event

This is not optional in production integrations.
