-- =============================================================================
-- IntegrateWise Dynamic Memory Layer
-- Table: memory_recommendations
-- Layer: L4-L5 (Evolution → Promotion Queue)
-- =============================================================================
--
-- DESCRIPTION:
-- This table stores AI-generated recommendations derived from platform signals,
-- Spine entity state, and OODA cycle observations. Recommendations are ephemeral,
-- opinionated insights produced during the Evolution phase (L4) that may be
-- promoted to organizational knowledge (L7-L8) upon review and approval.
--
-- Each record is anchored to a canonical Spine entity via (canonical_id,
-- entity_type) and carries a confidence score, TTL, and provenance chain.
--
-- LAYER CONTEXT:
-- - L4 (Evolution): Recommendations are generated as AI interpretations of
--   observed Spine state changes and platform signals.
-- - L5 (Promotion Queue): Recommendations with sufficient confidence may enter
--   a review queue for potential promotion to L7 (Organizational) memory.
--
-- KEY CHARACTERISTICS:
-- - Ephemeral: Subject to TTL expiry and garbage collection.
-- - Opinionated: Confidence score (0.0-1.0) indicates AI certainty.
-- - Event-sourced: Linked to OODA episode_id for full traceability.
-- - Projection-friendly: Sliced by tenant, entity type, status, and time.
-- - Graph-native: Relations to other memory records or Spine entities are
--   stored in a companion memory_edges table (not included here).
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_recommendations (
    id          TEXT PRIMARY KEY
                DEFAULT (lower(hex(randomblob(16)))),

    tenant_id   TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,

    version     INTEGER NOT NULL
                DEFAULT 1
                CHECK (version > 0),

    confidence  REAL NOT NULL
                CHECK (confidence >= 0.0 AND confidence <= 1.0),

    generated_by TEXT NOT NULL,
    episode_id  TEXT NOT NULL,

    memory_type TEXT NOT NULL
                DEFAULT 'recommendation',

    status      TEXT NOT NULL
                DEFAULT 'pending'
                CHECK (status IN (
                    'pending',      -- Awaiting review or action
                    'accepted',     -- Approved for execution or promotion
                    'rejected',     -- Explicitly declined
                    'expired',      -- TTL reached without resolution
                    'superseded',   -- Replaced by newer recommendation
                    'dismissed'     -- Manually dismissed without review
                )),

    content     TEXT NOT NULL,
    provenance  TEXT,

    ttl         INTEGER NOT NULL
                CHECK (ttl > 0),

    expires_at  INTEGER NOT NULL,
    created_at  INTEGER NOT NULL
                DEFAULT (strftime('%s', 'now')),
    updated_at  INTEGER NOT NULL
                DEFAULT (strftime('%s', 'now')),

    -- Enforce unique memory per tenant + canonical entity + version + episode
    UNIQUE (tenant_id, canonical_id, version, episode_id)
);

-- -------------------------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------------------------

-- Tenant-scoped entity lookup: primary access pattern for Spine-aligned queries
CREATE INDEX IF NOT EXISTS idx_memrec_tenant_canonical
    ON memory_recommendations(tenant_id, canonical_id);

-- Tenant-scoped entity type filtering: for projection by business domain
CREATE INDEX IF NOT EXISTS idx_memrec_tenant_entity_type
    ON memory_recommendations(tenant_id, entity_type);

-- Tenant-scoped memory type filtering: subtype projections (e.g., action vs. resource)
CREATE INDEX IF NOT EXISTS idx_memrec_tenant_memory_type
    ON memory_recommendations(tenant_id, memory_type);

-- Tenant-scoped status filtering: workflow state projections (e.g., pending review)
CREATE INDEX IF NOT EXISTS idx_memrec_tenant_status
    ON memory_recommendations(tenant_id, status);

-- Confidence ranking per entity: surface highest-confidence recommendations first
CREATE INDEX IF NOT EXISTS idx_memrec_canonical_confidence
    ON memory_recommendations(canonical_id, confidence DESC);

-- TTL expiry sweep: batch garbage collection of stale recommendations
CREATE INDEX IF NOT EXISTS idx_memrec_tenant_expires
    ON memory_recommendations(tenant_id, expires_at);

-- Event sourcing: trace all recommendations back to their OODA episode
CREATE INDEX IF NOT EXISTS idx_memrec_episode
    ON memory_recommendations(episode_id);

-- -------------------------------------------------------------------------
-- AUTO-UPDATE TRIGGER
-- -------------------------------------------------------------------------
-- Automatically refresh updated_at on any row modification, unless the
-- UPDATE statement itself provides a new updated_at value.

CREATE TRIGGER IF NOT EXISTS trg_memrec_updated_at
AFTER UPDATE ON memory_recommendations
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE memory_recommendations
    SET updated_at = strftime('%s', 'now')
    WHERE id = NEW.id;
END;
