-- ========================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Table: memory_architecture
-- ========================================================================
-- Domain:        Platform / Dynamic Memory
-- Target DB:     Cloudflare D1 (SQLite-compatible)
-- Layer:         L1-L8 Pipeline + Domain-Specific Projections
-- ========================================================================
--
-- PURPOSE:
--   This table stores ephemeral, opinionated, AI-generated memory records
--   that enrich canonical Spine entities with contextual, temporal, and
--   confidence-weighted insights. Dynamic Memory is NOT the source of truth;
--   it is a projection layer that decays, evolves, and gets recomputed.
--
-- ARCHITECTURE:
--   Every memory record anchors to a canonical Spine entity via
--   (canonical_id + entity_type). Memory is event-sourced: each record
--   carries an episode_id linking it to an OODA (Observe-Orient-Decide-Act)
--   cycle. The 8-layer pipeline defines memory lifecycle:
--
--     L1  twin          — Twin-generated raw observations and telemetry
--     L2  intake       — Ingested signals from external systems
--     L3  triage       — Classified, prioritized, and scored signals
--     L4  evolution    — Mutated, cross-referenced, and enriched memory
--     L5  promotion     — Queue of memory candidates for elevation
--     L6  approval     — Human- or policy-approved durable memory
--     L7  organizational — Team- and role-scoped shared context
--     L8  knowledge    — Curated, long-horizon organizational knowledge
--
--   Domain-specific memories (health, risk, sentiment, compliance, etc.)
--   are derived from platform signals and follow the same (canonical_id,
--   entity_type, episode_id) referencing pattern.
--
-- CONFIDENCE & TTL:
--   • confidence   — REQUIRED. 0.0 (lowest) to 1.0 (highest). Reflects
--                    the model's certainty in the generated insight.
--   • generated_by — REQUIRED. Identifies the AI agent, model, or pipeline
--                    stage that produced this memory.
--   • TTL          — REQUIRED for L1-L5. DURATION in seconds until expiry.
--                    L6-L8 use a persistent TTL (e.g., 0 or NULL meaning
--                    "no automatic expiration"), managed by policy.
--   • expires_at   — Computed / enforced expiration timestamp.
--
-- GRAPH-NATIVE:
--   Memory records can reference other memory records (self-referential
--   edges) or Spine entities. This is achieved through the canonical_id
--   + entity_type composite, enabling graph traversal and projection
--   slicing by team, role, and time horizon.
--
-- PROJECTION-FRIENDLY INDEXES:
--   The index set is designed for the following query patterns:
--     • Tenant-scoped entity lookups         (tenant_id, canonical_id)
--     • Tenant-scoped type filters           (tenant_id, entity_type)
--     • Pipeline-stage filtering             (tenant_id, memory_type)
--     • Status-driven workflow queries       (tenant_id, status)
--     • Confidence-ranked retrieval          (canonical_id, confidence)
--     • TTL-driven cleanup / eviction        (tenant_id, expires_at)
-- ========================================================================

-- Enable strict foreign-key behavior (best practice for D1/SQLite)
PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------------------
-- Table: memory_architecture
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_architecture (
    -- Primary identifier
    id              TEXT PRIMARY KEY NOT NULL
                    CHECK (length(id) > 0),

    -- Multi-tenancy boundary
    tenant_id       TEXT NOT NULL
                    CHECK (length(tenant_id) > 0),

    -- Spine anchor: every memory belongs to exactly one canonical entity
    canonical_id    TEXT NOT NULL
                    CHECK (length(canonical_id) > 0),

    -- Spine anchor: the entity type of the referenced canonical record
    entity_type     TEXT NOT NULL
                    CHECK (length(entity_type) > 0),

    -- Optimistic versioning for concurrency control
    version         INTEGER NOT NULL DEFAULT 1
                    CHECK (version > 0),

    -- AI confidence in the generated memory (0.0 = low, 1.0 = high)
    confidence      REAL NOT NULL
                    CHECK (confidence >= 0.0 AND confidence <= 1.0),

    -- Agent / model / pipeline stage that generated this memory
    generated_by    TEXT NOT NULL
                    CHECK (length(generated_by) > 0),

    -- OODA cycle link: every memory is born from an episode
    episode_id      TEXT NOT NULL
                    CHECK (length(episode_id) > 0),

    -- Memory classification: pipeline layer (L1-L8) or domain-specific type
    memory_type     TEXT NOT NULL
                    CHECK (length(memory_type) > 0),

    -- Lifecycle status: active, pending, approved, rejected, expired, etc.
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (length(status) > 0),

    -- Human-readable content / insight / summary
    content         TEXT NOT NULL DEFAULT ''
                    CHECK (length(content) >= 0),

    -- Provenance / lineage: source references, model version, prompt ID
    provenance      TEXT NOT NULL DEFAULT ''
                    CHECK (length(provenance) >= 0),

    -- Time-to-live: seconds until expiration (NULL = persistent for L6-L8)
    TTL             INTEGER
                    CHECK (TTL IS NULL OR TTL >= 0),

    -- Absolute expiration timestamp (NULL = no expiry for L6-L8)
    expires_at      INTEGER
                    CHECK (expires_at IS NULL OR expires_at > 0),

    -- Audit timestamps (Unix seconds, compatible with D1)
    created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at      INTEGER NOT NULL DEFAULT (unixepoch()),

    -- Composite uniqueness: one memory record per (tenant, canonical, type, episode)
    UNIQUE (tenant_id, canonical_id, memory_type, episode_id)
);

-- ------------------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------------------

-- Tenant-scoped entity lookups (most common read pattern)
CREATE INDEX IF NOT EXISTS idx_memory_architecture_tenant_canonical
    ON memory_architecture (tenant_id, canonical_id);

-- Tenant-scoped type filtering (e.g., "all memories for this type of entity")
CREATE INDEX IF NOT EXISTS idx_memory_architecture_tenant_entity_type
    ON memory_architecture (tenant_id, entity_type);

-- Pipeline-stage filtering (e.g., "all L3 triage memories")
CREATE INDEX IF NOT EXISTS idx_memory_architecture_tenant_memory_type
    ON memory_architecture (tenant_id, memory_type);

-- Status-driven workflow queries (e.g., "all pending approvals")
CREATE INDEX IF NOT EXISTS idx_memory_architecture_tenant_status
    ON memory_architecture (tenant_id, status);

-- Confidence-ranked retrieval within a canonical entity (graph ranking)
CREATE INDEX IF NOT EXISTS idx_memory_architecture_canonical_confidence
    ON memory_architecture (canonical_id, confidence DESC);

-- TTL-driven cleanup and eviction (batch deletion of expired memories)
CREATE INDEX IF NOT EXISTS idx_memory_architecture_tenant_expires_at
    ON memory_architecture (tenant_id, expires_at)
    WHERE expires_at IS NOT NULL;

-- ------------------------------------------------------------------------
-- Table-Level Comment (SQLite style via COMMENT statement if supported,
-- otherwise preserved as DDL header above)
-- ------------------------------------------------------------------------
-- COMMENT ON TABLE memory_architecture IS
--   'Ephemeral, AI-generated memory layer (L1-L8 pipeline) for the IntegrateWise platform. Not the source of truth. Anchored to Spine entities via (canonical_id, entity_type). Event-sourced via episode_id. Confidence-weighted, TTL-managed, and graph-native.';
-- ------------------------------------------------------------------------
-- End of DDL
-- ========================================================================