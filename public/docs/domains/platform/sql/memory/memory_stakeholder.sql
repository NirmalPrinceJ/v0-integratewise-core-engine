-- =============================================================================
-- IntegrateWise Platform :: Dynamic Memory Layer
-- Table: memory_stakeholder
-- =============================================================================
--
-- PURPOSE:
--   Domain-specific memory table capturing ephemeral, opinionated, AI-generated
--   insights about stakeholders (individuals, teams, organizations, roles) derived
--   from platform signals and interactions.
--
-- MEMORY LAYER:
--   Domain-specific (derived from L2-L5 pipeline signals, projected to L7
--   organizational context and L8 knowledge layer when promoted).
--
-- CHARACTERISTICS:
--   - Ephemeral: All records have TTL and expires_at (auto-purged after expiry).
--   - Opinionated: confidence and generated_by are required; memory is NOT SOT.
--   - Graph-native: Edges to other memory records or Spine entities are managed
--     via a separate memory_edge table (not included here).
--   - Event-sourced: Every memory links to an OODA episode via episode_id.
--   - Projection-friendly: Sliced by tenant, memory_type, status, and time horizon.
--   - Spine-linked: References canonical Spine entities via canonical_id + entity_type.
--   - NOT source of truth: Memory is AI-generated inference, not canonical data.
--
-- DESIGN NOTES:
--   - Content is TEXT for human-readable memory, but structured domain data
--     (segment, relationship_tier, engagement_level) is stored in typed columns.
--   - No JSONB for core business data per platform rules.
--   - SQLite compatible for Cloudflare D1 deployment.
--   - Application layer enforces the canonical_id + entity_type -> Spine reference
--     since this DDL is self-contained and does not assume Spine tables exist.
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_stakeholder (
    -- Identity
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,

    -- Spine Reference (MUST reference a canonical Spine entity)
    canonical_id    TEXT NOT NULL,
    entity_type     TEXT NOT NULL,

    -- Versioning
    version         INTEGER DEFAULT 1 NOT NULL,

    -- Opinionated Metadata (required for all memory)
    confidence      REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by    TEXT NOT NULL,

    -- Event Sourcing (OODA cycle linkage)
    episode_id      TEXT NOT NULL,

    -- Classification
    memory_type     TEXT NOT NULL,
    status          TEXT NOT NULL CHECK (status IN ('active', 'stale', 'superseded', 'expired', 'archived')),

    -- Content (human-readable, non-structured)
    content         TEXT NOT NULL,
    provenance      TEXT NOT NULL,

    -- Domain-specific Structured Data (stakeholder memory)
    segment           TEXT CHECK (segment IN ('internal', 'external', 'customer', 'partner', 'vendor', 'regulator', 'community', 'investor', 'media', 'other')),
    relationship_tier TEXT CHECK (relationship_tier IN ('strategic', 'tactical', 'operational', 'peripheral', 'unknown')),
    engagement_level  TEXT CHECK (engagement_level IN ('high', 'medium', 'low', 'dormant', 'unknown')),

    -- Lifecycle (TTL required for all domain-specific memory)
    TTL             INTEGER NOT NULL CHECK (TTL >= 0),
    expires_at      TEXT NOT NULL,

    -- Audit
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Required: Projection by tenant + canonical entity
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_canonical
    ON memory_stakeholder(tenant_id, canonical_id);

-- Required: Projection by tenant + entity type
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_entity_type
    ON memory_stakeholder(tenant_id, entity_type);

-- Required: Projection by tenant + memory classification
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_memory_type
    ON memory_stakeholder(tenant_id, memory_type);

-- Required: Projection by tenant + lifecycle status
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_status
    ON memory_stakeholder(tenant_id, status);

-- Required: Confidence ranking for a given canonical entity
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_canonical_confidence
    ON memory_stakeholder(canonical_id, confidence DESC);

-- Required: Expiry management for TTL sweepers
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_expires
    ON memory_stakeholder(tenant_id, expires_at);

-- Utility: Temporal slicing and event lookup
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_episode
    ON memory_stakeholder(episode_id);

-- Utility: Recent memory queries per tenant
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_tenant_created
    ON memory_stakeholder(tenant_id, created_at DESC);
