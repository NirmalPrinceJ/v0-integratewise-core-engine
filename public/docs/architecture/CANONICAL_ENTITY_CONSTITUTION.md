# Canonical Entity Constitution

Status: CANONICAL
Scope: Stable entity shapes, relationships, state machines, and field contracts for the Adaptive Spine.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines the canonical entity layer. All projections, capabilities, connectors, and Twin behavior depend on these contracts.

Change this document only through platform amendment.

---

## 2. Entity Registry

```typescript
export type EntityType =
  | "account"
  | "contact"
  | "opportunity"
  | "deal"
  | "lead"
  | "renewal"
  | "risk"
  | "task"
  | "meeting"
  | "ticket"
  | "incident"
  | "bug"
  | "sprint"
  | "release"
  | "deployment"
  | "invoice"
  | "expense"
  | "payment"
  | "campaign"
  | "attribution"
  | "content"
  | "form"
  | "ad"
  | "feature"
  | "epic"
  | "story"
  | "feedback"
  | "pull_request"
  | "commit"
  | "knowledge_article"
  | "document"
  | "note"
  | "goal"
  | "project"
  | "initiative"
  | "workflow"
  | "process"
  | "vendor"
  | "contract"
  | "purchase_order"
  | "spend_analysis"
  | "system"
  | "vulnerability"
  | "employee"
  | "student"
  | "course"
  | "assignment"
  | "generated_insight"
  | "timeline_entry"
  | "action_proposal"
  | "action_run"
  | "approval_token";
```

---

## 3. Canonical Field Contracts

### 3.1 Account

| Field        | Type   | Required | Description                    |
| ------------ | ------ | -------- | ------------------------------ |
| id           | string | yes      | Spine entity id                |
| tenant_id    | string | yes      | Tenant partition               |
| name         | string | yes      | Account name                   |
| industry     | string | no       | Industry vertical              |
| health_score | number | no       | 0-100                          |
| arr          | number | no       | Annual recurring revenue       |
| mrr          | number | no       | Monthly recurring revenue      |
| renewal_date | string | no       | ISO date                       |
| risk         | string | no       | Risk level                     |
| status       | string | yes      | Entity status                  |
| source       | string | no       | Authoritative source connector |
| created_at   | string | yes      | Spine timestamp                |
| updated_at   | string | yes      | Spine timestamp                |

### 3.2 Opportunity / Deal

| Field       | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| id          | string | yes      | Spine entity id                |
| account_id  | string | yes      | Linked account                 |
| stage       | string | yes      | Pipeline stage                 |
| amount      | number | no       | Deal value                     |
| probability | number | no       | 0-100                          |
| close_date  | string | no       | ISO date                       |
| owner       | string | no       | Assigned owner                 |
| next_step   | string | no       | Next action                    |
| source      | string | no       | Authoritative source connector |

### 3.3 Task

| Field       | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| id          | string | yes      | Spine entity id                |
| subject     | string | yes      | Task title                     |
| status      | string | yes      | Task status                    |
| priority    | string | no       | Task priority                  |
| assignee    | string | no       | Assigned user                  |
| due_date    | string | no       | ISO date                       |
| entity_type | string | no       | Linked entity type             |
| entity_id   | string | no       | Linked entity id               |
| source      | string | no       | Authoritative source connector |

### 3.4 Ticket

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| id         | string | yes      | Spine entity id                |
| account_id | string | yes      | Linked account                 |
| status     | string | yes      | Ticket status                  |
| priority   | string | yes      | Ticket priority                |
| assignee   | string | no       | Assigned agent                 |
| sla_status | string | no       | SLA state                      |
| source     | string | no       | Authoritative source connector |

---

## 4. Relationship Contracts

| Relationship          | From    | To          | Cardinality | Description           |
| --------------------- | ------- | ----------- | ----------- | --------------------- |
| account.contacts      | account | contact     | 1:N         | Account contacts      |
| account.opportunities | account | opportunity | 1:N         | Account opportunities |
| account.renewals      | account | renewal     | 1:N         | Account renewals      |
| account.risks         | account | risk        | 1:N         | Account risks         |
| account.tickets       | account | ticket      | 1:N         | Account tickets       |
| deal.contacts         | deal    | contact     | 1:N         | Deal contacts         |
| task.account          | task    | account     | N:1         | Task account link     |
| ticket.account        | ticket  | account     | N:1         | Ticket account link   |
| sprint.tasks          | sprint  | task        | 1:N         | Sprint tasks          |
| feature.epic          | feature | epic        | N:1         | Feature epic link     |

---

## 5. State Machines

### 5.1 Opportunity / Deal

```
new → qualified → proposal → negotiation → won
                                 → lost
```

### 5.2 Task

```
open → in_progress → blocked → done
                         → cancelled
```

### 5.3 Ticket

```
new → open → pending → solved → closed
       → escalated
```

### 5.4 Sprint

```
planned → active → completed → archived
                → cancelled
```

---

## 6. Invariants

1. Every entity has `tenant_id`, `source`, `created_at`, `updated_at`.
2. The Spine never overwrites authoritative external data without a traceable sync mutation.
3. Entity ids are immutable.
4. Relationships are resolved through Spine ids, not external system ids alone.
5. State transitions emit a timeline entry.
