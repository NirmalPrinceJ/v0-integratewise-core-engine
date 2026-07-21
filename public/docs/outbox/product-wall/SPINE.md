# SPINE

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Spine truth concept, canonical authority model, current write-reality classification
Canonical Owner: Platform / SPINE
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/architecture/SPINE_DOMAIN.md, docs/architecture/SPINE_MODEL.md, docs/architecture/SPINE_INTELLIGENCE_AGENT.md, docs/platform-specs/02-operational-spine-canonical-highest-priority.md, docs/FINAL_E2E_SYSTEM.md, wrangler manifests, Option B divergence audit, AGENTS.md
Supersedes: none
Superseded By: none

---

## 1. WHAT SPINE IS

```text
SPINE
=
CANONICAL OPERATIONAL TRUTH
+
NORMALIZED ENTITY STATE
+
OPERATIONAL CONTINUITY FOUNDATION
```

Spine is the system of record for operational entities, context, decisions, signals, proposals, approvals, execution outcomes, and continuity markers.

Spine exists as an architectural concept with an operational realization. Platform documentation must always separate these two.

---

## 2. STORAGE REALISM

Storage implementations may participate in Spine. They are not individually the Spine architecture.

Current repo recognizes cloudy storage boundaries:

- D1 as operational edge surface
- KV, R2, Vectorize, Durable Objects as supporting substrates
- Postgres/Supabase references in historical docs as retired product evidence until migration is complete

Spine storage classification must follow:

- is this substrate operational
- is it canonical
- is it temporary edge cache
- is it retired product evidence

---

## 3. CANONICAL WRITE LAW

```text
GOVERNED RESULT
      ↓
SPINE WRITER
      ↓
CANONICAL STATE
```

```text
No agent writes to Spine directly.
```

Target doctrine is governed sole-writer path to canonical state. This is a target architecture, not an assumed operational condition.

Documentation of write authority must be classified as:

- VERIFIED_SPINE_WRITER
- HISTORICAL_PIPELINE
- DIRECT_DATABASE_PATHS
- MULTIPLE_WRITE_PATHS
- UNKNOWN

---

## 4. TARGET RUNTIME IDENTITIES

Target topology includes runtime identity responsibilities:

- spine-writer
- schema-synthesis
- continuity
- governance

Current repository evidence reportedly shows:

- services/pipeline exists
- services/spine-writer does not exist as a service identity yet
- schema-synthesis may not be deployed as a partitioned service

These are UNKNOWN states until verified by repo evidence and runtime review.

Do not classify target identities as CURRENT without evidence.

---

## 5. CANONICAL TRUTH LAW

No model, agent, Twin, human, frontend, or external integration owns canonical truth.

Agents may infer.
Agents may propose.
Agents may coordinate.
Reported results must be governed before canonical write.

Twin reasoning must not bypass governed result path.
Admin panels must not bypass governed result path.
Human users may govern, not unilaterally redefine canonical state.

---

## 6. SPINE DOCUMENTATION BAN

Never document Spine as equivalent to:

- Supabase product database
- Postgres
- CouchDB
- Redis
- KV
- R2
- a route named /spine/\*
- a client named spineClient
- a Next.js API route

These may participate in or reach toward Spine. They are not Spine.

---

## 7. SPINE INQUIRY REQUIREMENTS

Before classifying any path as Spine-backed:

- identify the calling flow
- trace to downstream implementation
- confirm governed writer step
- confirm route authority and storage target
- confirm tenant isolation at write boundaries

If tracing requires additional evidence than currently documented, classify that path as UNKNOWN until verified.

---

## 8. D1 / SUPABASE / HISTORICAL CLAIMS

Documentation historically mixes:

- D1 Spine tables
- Supabase Fortress doctrine
- Postgres SSOT prose

Current canon states Cloudflare-only product plane with D1/KV/R2/Vectorize/AI Search/DO as primary platform storage. Supabase reference evidence in retained docs must be classified HISTORICAL unless a runtime migration artifact shows seamless replacement.

---

## 9. EXAMPLES OF ACCURATE SPINE DOCUMENTATION

INSTEAD OF
Spine queries are wired.

WRITE
The Customer Zero frontend calls Next.js routes under /api/spine/\*. The downstream canonical authority must be verified before classifying the flow as Spine-backed.

INSTEAD OF
Pipeline owns canonical state.

WRITE
services/pipeline is present in current repository. Historically described as an active Spine writer. Current sole-writer target expects spine-writer runtime identity. Authority must be traced before classifying pipeline as canonical writer.

---

## 10. CURRENT READY STATE

- Verified authoritative writer identity: UNKNOWN until write-authority trace is closed
- Historical likely contributor identity: pipeline if runtime still performs governed normalize/publish lifecycle
- Known opposing/retired evidence: Supabase canonical references in historical docs
- Next required evidence: repo tracing of write paths, env-secret usage in wrangler manifests, gateway->spine-writer or legacy actor bindings, tested end-to-end readback

---

## 11. DOCUMENTS THAT PRECEDE THIS

- docs/architecture/SPINE_MODEL.md
- docs/architecture/SPINE_DOMAIN.md
- docs/architecture/SPINE_INTELLIGENCE_AGENT.md
- docs/platform-specs/02-operational-spine-canonical-highest-priority.md

When conflict arises between this document and those documents, this document is canonical.
