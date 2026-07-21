# Capability Fabric

The Capability Fabric translates available provider capabilities and platform features into actionable, governed, context-aware operations inside the Workbench.

For the canonical contract, see `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md` and `docs/architecture/CAPABILITY_FABRIC.md`.

## Purpose

The Capability Fabric answers one question: what can be done, for this context, by this user, under this policy, using currently available connections?

It does not decide whether work should happen. It defines what is possible.

## Capability resolution

Capability resolution depends on:

- active context type and entity relationships
- user role and authority scope
- organization policy
- provider health and capability availability
- required fields and current provider state
- tenant feature policy

When a required provider becomes unavailable, the Capability Fabric must disable related actions in the Workbench and explain why. Hidden capabilities are worse than disabled capabilities with explanations.

## Unified capability abstraction

The fabric converts diverse provider capabilities into standard platform intents. A CRM record update, an email send, a ticket transition, and an internal workflow trigger may all surface as unified platform actions after capability resolution.

This is intentional. It keeps the Workbench coherent across providers without hiding provider-specific behavior entirely. Technical adapter details remain hidden unless deep troubleshooting requires them.

## Execution lifecycle

When a user initiates a capability:

1. Capability Fabric resolves the applicable capabibility contract.
2. Pre-Proposal Governance evaluates authority, scope, and policy.
3. Plan Builder converts intent into an ExecutionPlan when needed.
4. Post-Proposal Governance evaluates risk, evidence, confidence, and approval requirement.
5. The Workbench previews the governed plan.
6. The user approves when required.
7. Hermes dispatches execution through the resolved runtime adapter.
8. Sync reconciles the result.
9. Promotion evaluates whether the result becomes canonical Spine truth.

## Partner expectations

Partners extending IntegrateWise capabilities should:

- expose capability metadata, not just endpoints.
- declare supported inputs, outputs, authority requirements, and evidence requirements.
- define risk and governance policy for each capability shape.
- support idempotency and retry without duplicating provider writes.
- cleanly fail when context or authority is insufficient.

Do not provide raw provider endpoints as one generic action surface. The Capability Fabric exists because generic surfaces are dangerous and confusing to operators.

## Observability

Capability Fabric activity should be observable in:

- capability availability and health indicators
- proposal creation and approval outcomes
- execution plan states
- sync and promotion outcomes
- audit events that preserve actor, evidence, authority, and execution lineage
