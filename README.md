# Customer Zero — IntegrateWise Internal Operations

This repository is **Customer Zero**: the internal operating workspace that runs
IntegrateWise itself, on the same Platform API exposed to customers. It is the
**reference implementation** of the platform — every capability is validated
internally before customers use it ("eat your own dog food").

It satisfies three roles at once:

1. **Internal operating workspace** — where the IntegrateWise team runs the company.
2. **Reference frontend** — demonstrating how to consume the Platform API through modular surfaces.
3. **Living product demonstration** — every feature is proven on our own business first.

## Customer Zero Architecture

The application is a set of projections over a shared platform, organized into surfaces:

```
Identity · Integrations · Adaptive Spine · Knowledge ·
Capabilities · Agent Runtime · Workbench · Analytics · Administration
```

The Platform API is implemented in [`lib/platform`](./lib/platform):

- `types.ts` — the surface contracts.
- `data.ts` — IntegrateWise's own operating data (the single source of truth).
- `index.ts` — the modular `platform.<surface>` accessors plus `platform.workspace(dept)` projections.

No view hardcodes business data — every workspace reads the surfaces it needs.

## Workspaces

The app opens into the workspaces the team uses every day. Each is a projection
over the same Spine, not a separate application:

```
Home · Founder · Sales · Marketing · Operations ·
Technology · Customer Success · Finance · Administration
```

## Agent Runtime

Every agent is a **production worker** running the company — Lead Qualification,
Support Triage, Content Strategist, DevOps Monitor, Billing Manager, Customer
Health, and Competitive Intelligence. The `/agents` view shows the work they are
performing (status, executions, items processed, average execution, confidence).

## Customer Zero surfaces

- `/` — **Customer Zero dashboard**: "How is IntegrateWise operating today?"
- `/agents` — **Agent Runtime**: production workers and platform capabilities.
- `/evidence` — **Customer Zero Evidence**: measurable proof the platform runs our business.
- `/customer-zero` — **Our Business Runs Here**: organization, departments, connected systems, daily activity.

## Development

```bash
pnpm install
pnpm dev
```

Environment variables are documented in [`ENV_VARIABLES.md`](./ENV_VARIABLES.md).
