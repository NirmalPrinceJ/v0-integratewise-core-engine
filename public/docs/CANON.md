# Documentation Canon & Map

> **Status:** Canonical index — read this first.
> **Date:** June 12, 2026
> **Authority:** Nirmal (Founder)

The architecture lives in **code + a small set of canon docs**. Everything else is detail,
history, or a point-in-time snapshot. When any doc contradicts the canon below, **the canon wins**.
This file exists to end documentation sprawl: it tells you which docs to trust.

**Every doc belongs to one tier:**

| Tier               | Meaning                                   | Rule                                                           |
| ------------------ | ----------------------------------------- | -------------------------------------------------------------- |
| **A — Canon**      | The authoritative architecture set        | Keep current; code points here                                 |
| **B — Derived**    | Specs, marketing, GTM, design, dev guides | Must reference Canon; align when touched                       |
| **C — Historical** | Dated snapshots of a past era             | Archive/banner; never silently rewrite, never trust as current |

---

## Tier A — Canon (authoritative; keep current)

| Topic                                                         | Doc                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| **Canonical Platform Architecture (authoritative reference)** | `docs/architecture/CANONICAL_PLATFORM_ARCHITECTURE.md` |
| **Platform Plane ↔ Layer Stack Cross-Reference**              | `docs/architecture/PLANE_LAYER_CROSS_REFERENCE.md`     |
| **Unified Governance Specification**                          | `docs/architecture/UNIFIED_GOVERNANCE_SPEC.md`         |
| **Entity360 V2 Cross-Tool Data Model**                        | `docs/architecture/ENTITY360_V2_MODEL.md`              |
| **Fundraise Strategy & Scenarios**                            | `docs/product/FUNDRAISE.md`                            |
| **Technical Co-Founder Role & Equity**                        | `docs/product/TECHNICAL_COFOUNDER.md`                  |
| Master end-to-end system contract and resolved conflicts      | `docs/FINAL_E2E_SYSTEM.md`                             |
| Feature mapping: User Journey, System Flows & Infrastructure  | `docs/FEATURE_MAP.md`                                  |
| Active launch state, changelog, and punch list                | `docs/CANONICAL_STATE.md`                              |
| Agent protocol, locked decisions (18–24), services, bindings  | `AGENTS.md`                                            |
| Code-derived guide                                            | `CLAUDE.md`                                            |
| Product front door (start here)                               | `docs/architecture/PRODUCT_ARCHITECTURE.md`            |
| Workbench doctrine (projection-first operating surfaces)      | `docs/architecture/WORKBENCH_DOCTRINE.md`              |
| Spine data model                                              | `docs/architecture/SPINE_MODEL.md`                     |
| Projection model (views from the Spine)                       | `docs/architecture/PROJECTION_MODEL.md`                |
| Onboarding flow (L0 → Spine Context)                          | `docs/architecture/ONBOARDING_FLOW.md`                 |
| Layers (user) & stages (system)                               | `docs/architecture/USER_SYSTEM_JOURNEY_BLUEPRINT.md`   |
| End-to-end Systems View × Workbench View                      | `docs/architecture/END_TO_END_ARCHITECTURE.md`         |
| Final AI / Provider Independence Law                          | `docs/architecture/v2-ai-capability-fabric.md`         |
| Ecosystem map (all repos)                                     | `ECOSYSTEM.md`                                         |
| De-Supabase migration tracker                                 | `docs/migrations/DE_SUPABASE_MIGRATION.md`             |
| Live Cloudflare wiring                                        | `docs/operations/CF_WIRE_STATUS.md`                    |

---

## 2. Current truth, in one line

- **Product name:** IW Continuity Bridge. Category is The Operational Continuity Platform (DECISION 23 retired — "Platform" is the category, "Bridge" is the product name, "OS" and "tool" are explicitly rejected).
- **Runtime:** 100% Cloudflare (D1/KV/R2/Vectorize/AI Search/Durable Objects). DECISION 22.
- **Twin:** Cloudflare-native (`services/iw-agent-runtime`). No OpenWebUI, no Agent Zero.
- **Workflows:** Cloudflare Workflows/Queues. No n8n as IW infra (n8n only as a customer-owned tool).
- **No** Supabase / dual-write / CouchDB / VPS in the product. Hostinger = IW ops only (Customer Zero).
- **Connectors / Outbound Authorization:** Descope is the canonical authorization authority for outbound connections (Customer Zero connectors: GitHub, Linear, Gmail, Google Drive, Cloudflare, Vercel). Nango is a DORMANT COMPATIBILITY adapter only — used solely for providers Descope outbound does not support. **MCP:** first-class public surface (`mcp.integratewise.ai`).

## Tier B — Derived (must reference Canon)

These are real, active docs — but they are **downstream** of Tier A. They may describe _how_ and
_for whom_, never redefine _what_. When a Tier B doc states architecture, it must match Tier A; fix
drift when you touch it. If a Tier B doc and Canon disagree, Canon wins.

| Category                   | Location                      | References                                                    |
| -------------------------- | ----------------------------- | ------------------------------------------------------------- | -------------------------------- |
| Feature specs              | `.kiro/specs/**`              | the relevant Tier A doc                                       |
| Public / marketing / GTM   | `docs/public/**`              | `PRODUCT_ARCHITECTURE.md` (identity, naming)                  |
| Design specs               | `docs/public/design/**`       | `PROJECTION_MODEL.md`, journey blueprint                      |
|                            | Developer / operations guides | `docs/internal/operations/**`, `docs/FOLDER_MONITOR_SETUP.md` | `AGENTS.md`, `CF_WIRE_STATUS.md` |
|                            | Frontend creator guide        | `FRONTEND_CREATOR_INSTRUCTIONS.md`                            | Tier A workbench/Twin doctrine   |
| Product catalog / features | `docs/public/product/**`      | `PRODUCT_ARCHITECTURE.md`                                     |

"Knowledge workspace" as a plain-language descriptor is allowed in Tier B; the product **name** is
IW Continuity Bridge.

## Tier C — Historical / point-in-time (do NOT trust as current)

These are dated records kept for lineage. They describe the state at their time of writing and are
**not** maintained. Read them as history, never as current architecture:

- `docs/internal/status/**` — session notes, status reports, phase-complete snapshots
- `docs/internal/sql-migrations/**` — applied migration history (and legacy schema headers)
- `docs/ip/**` — superseded IP/tech provisioning docs (carry their own banners)
- `docs/internal/promotions/ARCHITECTURE_ALIGNMENT_v*.md` — versioned alignment snapshots

If you need the current answer, go to Tier A, not here.

## Sweep policy (how we keep docs clean)

1. New architecture decisions update `AGENTS.md` (a DECISION block) **and** the relevant Tier A doc.
2. Tier A docs point at code; they never fork enumerations that live in code.
3. Tier B docs that state architecture must match Tier A; fix factual drift when touched.
4. Tier C docs are left as-is (dated records) — banner, don't rewrite.
5. The drift gate prevents new retired-tech usage in code and non-canon docs.
6. Reduce doc count over time: when a doc is fully covered by Canon, archive it (Tier C banner) —
   do not maintain two sources of the same truth.

---

_When in doubt — start at `docs/architecture/PRODUCT_ARCHITECTURE.md`, then `AGENTS.md`. Halt and ask Nirmal before reorganizing anything._
