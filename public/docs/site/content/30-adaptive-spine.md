# Adaptive Spine

The Adaptive Spine is the canonical operational continuity network of IntegrateWise. It is not a dashboard, not an ESB, and not a simple database table collection.

For the canonical data model, see `docs/architecture/SPINE_MODEL.md`, `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`, and `docs/architecture/PROJECTION_MODEL.md`.

## What the Spine is

The Spine unifies operational objects across connected systems into governed, normalized continuity state. It resolves entities, maintains relationships, tracks meaningful change, and serves read projections to the Workbench and Twin.

The Spine does not pass transient messages between applications. It is not middleware. It is the persistent, versioned representation of operational reality for a tenant.

## What the Spine is not

- The Spine is not an ESB.
- The Spine is not an agent runtime.
- The Spine is not a chat log.
- The Spine is not a cache-only copy of connected systems.
- No model owns canonical truth.
- No agent writes directly to the Spine.

## State substrate

The Spine is backed by separable substrate layers optimized for access patterns:

- D1 owns structured state and metadata.
- KV owns hot projections and acceleration state.
- R2 owns bytes, artifacts, evidence, and raw payloads.
- Vectorize owns semantic retrieval vectors derived from source truth.
- Durable Objects own runtime coordination state, not canonical truth.

Product logic should talk to stable repository contracts. No product plane should depend on provider primitives.

## Entity and relationship model

Operational entities such as accounts, contacts, opportunities, projects, tickets, vendors, and invoices are represented as Spine contexts. Relationships are first-class. Entity resolution, deduplication, and identity normalization are spine responsibilities.

Context360 is a projection over Spine state. Raw provider tables are not surfaced directly to users.

## Context continuity

Continuity is created through three load modes:

- Creamy Load builds initial operational foundation from connected systems.
- Delta Load absorbs recurring changes.
- Streaming Load ingests real-time events.

Not every event becomes canonical truth. The platform filters, normalizes, synthesizes, governs, and promotes approved operational state into the Spine.

## Read path

The Workbench reads projections assembled from Spine state. Progressive loading is used to preserve responsiveness:

- identity and header first
- key operational state next
- current work and primary relationships
- recent timeline
- knowledge and files
- AI-generated interpretation asynchronously

AI enrichment never blocks core operational content.

## Write and promotion path

Changes may originate from providers, users, Twin proposals, or execution outcomes. None become canonical automatically.

Promotion depends on:

- provider confirmation when applicable
- policy alignment
- data integrity validation
- approval lineage when the change originated from a governed proposal

Only promotion creates canonical Spine truth.

## Partner assumptions

Partners should assume:

- connected-system state is a source, not canonical truth.
- cached projections may lag behind canonical state and will show freshness metadata.
- direct writes to Spine storage are prohibited outside governed pathways.
- entity identifiers and relationships may change through promotion and reconciliation.
