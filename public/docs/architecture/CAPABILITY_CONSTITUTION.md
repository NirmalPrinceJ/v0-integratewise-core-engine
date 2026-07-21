# Capability Constitution

Status: CANONICAL
Scope: Canonical capability contracts, adapter resolution, execution behavior, and fallback policy.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how IntegrateWise declares, resolves, and executes business-intent capabilities.

The UI never binds to providers. The UI binds to capability contracts.

---

## 2. Contract

```typescript
interface CapabilityContract {
  id: CapabilityId;
  title: string;
  description: string;
  category: CapabilityCategory;
  risk: "low" | "medium" | "high" | "critical";
  requiresApproval: boolean;
  inputFields: readonly CapabilityInputField[];
}
```

---

## 3. Categories

| Category           | Examples                         |
| ------------------ | -------------------------------- |
| crm                | account.view, opportunity.update |
| support            | ticket.create, ticket.escalate   |
| messaging          | message.send                     |
| email              | email.send                       |
| calendar           | meeting.create                   |
| documents          | document.upload                  |
| knowledge          | knowledge.search                 |
| source_control     | pull_request.create              |
| project_management | issue.create                     |
| ci_cd              | deployment.view                  |
| monitoring         | incident.view                    |
| finance            | invoice.approve                  |
| procurement        | purchase_order.create            |
| hr                 | hiring.open                      |
| marketing          | campaign.create                  |
| identity           | user.invite                      |
| ai                 | ai.summarize                     |
| data               | report.generate                  |

---

## 4. Adapter Resolution

```text
mock → workbench → provider
```

- **mock**: default fallback for demo/seed data.
- **workbench**: governed live actions in Gateway.
- **provider**: live external adapter.

No capability executes without an adapter resolution path.

---

## 5. Execution Behavior

1. Validate intent and inputs against contract.
2. Load context from Spine.
3. Run pre-proposal governance.
4. Execute steps or emit proposal.
5. Emit events and side effects.
6. Commit canonical state first.
7. Queue sync independently.

---

## 6. Invariants

1. Capability ids are business intent, not provider-specific.
2. Every capability has a mock fallback behavior.
3. Every write capability has a rollback path.
4. The UI never references provider names in capability contracts.
