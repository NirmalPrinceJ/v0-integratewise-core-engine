# Platform doctrine: continuity infrastructure

The platform makes connected human and AI work continuous without making any participant omniscient. It turns fragmented work into governed, inspectable continuity.

## Platform responsibilities

The platform owns the durable and governed concerns that a role-specific Workbench must not reinvent:

- canonical work state, identity, tenancy, and relationship resolution;
- evidence, provenance, freshness, and durable memory;
- policy evaluation, authority, approvals, audit, and revocation;
- signals, proposals, plans, capabilities, workflows, and governed execution;
- reconciliation and bounded handoffs across people, tools, and agents; and
- observation and retrieval needed to assemble a ContinuityBundle.

The platform is infrastructure, not the visible product surface. Its broad job is to support many roles and entry points; the product deliberately exposes a narrow, role-relevant slice.

## Platform laws

1. Canonical work state is authoritative; UI state and model output are not.
2. Every cross-boundary request is identity-bound, tenant-scoped, policy-checked, time-bounded, and auditable.
3. Context is projected for a stated purpose. Participants do not receive unrestricted tenant state because they happen to be connected.
4. Evidence, decisions, proposals, and actions preserve provenance and authority separately.
5. Execution is governed. Preparation, recommendation, and approval are distinct stages.
6. The platform fails closed when it cannot establish a required authority, boundary, or policy reference.

## What the platform must not become

It must not turn the User Workbench into a platform console, expose raw internal tool topology as the product, treat a chat transcript as system memory, or let a model’s private reasoning become shared operational data.

## Platform output to the product

The platform returns a `ContinuityBundle`: active work context, scoped facts and relationships, evidence and freshness, authority, available capabilities, and any grounded trigger decision. The Workbench decides how to place that information; it does not invent it.
