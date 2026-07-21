# Runtime Constitution

Status: CANONICAL
Scope: Cloudflare runtime substrate, service primitives, communication hierarchy, and decommissioned infrastructure.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines the runtime layer for IntegrateWise.

All Workers, storage, queues, and inter-service routing must follow this contract.

---

## 2. Primitives

| Primitive       | Purpose                                 |
| --------------- | --------------------------------------- |
| Workers         | Compute, routing, ingress               |
| D1              | Structured relational state             |
| KV              | Derived, reconstructable views          |
| R2              | Immutable large binaries                |
| Queues          | Async processing and retry              |
| Durable Objects | Real-time consistency and session state |

---

## 3. Communication Hierarchy

1. In-process function call
2. Repository — D1/KV/R2/DO
3. Service binding — same-account Worker
4. Queue — async propagation
5. External HTTP — browser/SaaS boundary only

Anti-pattern: Worker-to-Worker HTTP on the same account.

---

## 4. Naming Separation

| Product Brand             | Runtime Contract               | Infrastructure Binding          |
| ------------------------- | ------------------------------ | ------------------------------- |
| IW-Continuity-Bridge      | Context Gateway                | Cloudflare Workers Ingress      |
| Twin                      | Twin Runtime Engine            | Durable Object Interaction Loop |
| Action Center             | Capability Execution Interface | Worker Async Queue Routing      |
| Automated Delivery Engine | Execution Platform             | Hermes Queue Processing Loop    |

---

## 5. Tenant Isolation

- Tenant boundaries are enforced in D1 and Durable Objects.
- Cross-tenant memory reads are impossible by architecture.
- Row-level partition verification is mandatory in Workspace Activation.

---

## 6. Decommissioned Infrastructure

- Supabase
- OpenWebUI
- n8n
- Python runtime services
- CouchDB

---

## 7. Invariants

1. External HTTP is allowed only at browser/SaaS boundary.
2. Internal state flows through repositories or service bindings.
3. Runtime identity never leaks into product branding.
4. Infrastructure choices are replaceable without changing product contracts.
