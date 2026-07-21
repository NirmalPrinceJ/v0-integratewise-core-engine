# IntegrateWise — Platform Lock v1.0

**Status**: FROZEN
**Date**: July 17, 2026

---

> Platform Lock is the milestone where the platform's contracts become stable and versioned. From this point onward, all frontend experiences are assembled from those contracts rather than introducing new platform concepts.

## What Is Frozen

1. **Product Doctrine** — never changes
2. **The 12 Kernel Terms** — irreducible vocabulary
3. **The Runtime Sequence** — frozen order, implementation can improve
4. **Adaptive Spine Contract** — identity, fields, relationships, timeline, provenance, permissions, capabilities
5. **Capability Fabric Model** — actions become capabilities, routing is platform responsibility

## The Runtime Sequence (Frozen)

```
Configuration → Integration → Pipeline → Adaptive Spine → Workbench Composition
→ Continuity Bridge → User Workbench → Twin → Capability → Governance
→ Hermes → Sync → Promotion
```

## The Frontend Knows Only Six Concepts

```
Entity · Projection · Capability · Signal · Context · Twin
```

Nothing else. No OAuth, MCP, Cloudflare, provider APIs, connector SDKs, databases.

## The Workbench Is the Frontend Runtime

```
User Workbench
    ├── Entity Runtime
    ├── Capability Runtime
    ├── Timeline Runtime
    ├── Signal Runtime
    ├── Twin Runtime
    └── Context Runtime
```

## Platform Lock Implementation Order

| #   | Layer                      | Responsibility                                   |
| --- | -------------------------- | ------------------------------------------------ |
| 1   | Adaptive Spine Runtime     | Canonical entity model                           |
| 2   | Projection Engine          | Assemble workbench projections                   |
| 3   | User Workbench Runtime     | Universal frontend shell                         |
| 4   | Twin Runtime               | Embedded cognitive assistance                    |
| 5   | Capability Runtime         | Governed operation invocation                    |
| 6   | Department Projections     | Customer Success, Sales, Finance, HR, Operations |
| 7   | Role-Specific Compositions | Different views over same Spine                  |

## The Tagline

> **Truth you own. AI you rent. Approval in between.**

## Current Status

**Platform Lock: DECLARED**
**Version: 1.0**
**Status: FROZEN**

## Deployment Surfaces (Frozen)

| Surface | Environment alias     | Worker name suffix | Route pattern                                        |
| ------- | --------------------- | ------------------ | ---------------------------------------------------- |
| Live    | `prod` / `production` | `-prod`            | `*.integratewise.ai`                                 |
| Demo    | `test`                | `-test`            | `*.test.integratewise.ai` / `*.dev.integratewise.ai` |
| Local   | default / `dev`       | none               | `localhost`                                          |

**Invariant**

- All `services/*/wrangler.toml` environments deploy through the same surface boundary.
- `--env prod` is canonical; `--env production` is retained as an alias only.
- Demo and live never share KV/Queue/D1 bindings.
- MCP Connector explicit isolation:
  - Live: `mcp-connector-prod`
  - Demo: `mcp-connector-test`

**Customer Zero Identity**

- `TENANT_ID`, `ORG_ID`, `CLIENT_ID` are defined in `wrangler.toml` for customer zero only.
- Runtime consumption remains deferred until auth source wiring is safe to commit.
