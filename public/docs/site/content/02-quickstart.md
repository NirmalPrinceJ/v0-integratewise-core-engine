# Quickstart

This quickstart is a compressed integration orientation for developers and partners who need to move fast without skipping the platform’s hard boundaries.

## 1. Read the integration contract

Start with the integration boundary docs:

- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
- `docs/platform-specs/24-integration-manager.md`
- `docs/internal/operations/API_REFERENCE.md`

## 2. Understand the four paths

Use the right path for the job:

- REST/GraphQL for structured system reads and governed mutations.
- Webhooks for async inbound events.
- MCP for dynamic tool and resource exposure with governance interception.
- Database/queue for high-throughput ingress when applicable.

Do not bypass these boundaries with ad hoc transport choices.

## 3. Understand the execution contract

External integrations do not execute actions directly inside IntegrateWise. The canonical flow is:

1. Twin proposes work.
2. Approval Center governs and issues an approval token.
3. Handoff layer packages an approved ExecutionPlan.
4. Customer environment executes.
5. Customer environment posts outcomes back to IntegrateWise.

If you need outbound execution from IntegrateWise infrastructure, confirm whether Customer Zero execution is active for the target tenant. For most external tenants, execution is handed off, not centralized.

## 4. Review the canonical acceptance criteria

A proposed integration or extension is canonical only if it preserves:

- Workbench-first composition.
- Four distinct connection paths.
- Separation of Activation Bridge and Continuity Bridge.
- Two-gate Governance.
- ExecutionPlan as the approval target.
- Promotion as the only path to canonical Spine truth.
- Swappable provider architecture with no direct SDK leakage from product code.

## 5. Use the right surfaces

| Task                           | Surface                          |
| ------------------------------ | -------------------------------- |
| Connect a provider             | Integration Manager              |
| Inspect available capabilities | Capability Fabric                |
| Trigger Twin reasoning         | Ask Your Twin / Assign Your Twin |
| Execute approved action        | Approve Twin's Action            |
| Receive execution outcomes     | Outcome Ingestion API            |

## 6. Operational guardrails

- Never bypass approval for consequential actions.
- Never write secrets, tokens, IPs, or credentials into code, comments, docs, or logs.
- Never treat cached projections as canonical truth.
- Always review provider health and sync state before assuming upstream state is current.
