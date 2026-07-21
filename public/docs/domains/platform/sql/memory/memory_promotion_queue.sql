-- =============================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Table: memory_promotion_queue
-- Layer: L5 (Promotion Queue)
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
--
-- DESCRIPTION:
--   L5 memory is the Promotion Queue layer. When domain-specific memories
--   (health, risk, sentiment, anomaly, etc.) or L1-L4 pipeline outputs reach
--   sufficient confidence and maturity, they are promoted to this queue for
--   human review before becoming L6 (Organizational) or L7/L8 (Knowledge)
--   persistent memory. Records in this table are ephemeral, opinionated, and
--   AI-generated. They are NOT the source of truth — every record references a
--   canonical entity in the Spine via canonical_id + entity_type.
--
--   L5 serves as a staging gate between machine-generated memory and
--   organizational consensus. Each record carries a confidence score (0.0-1.0),
--   links to the OODA episode that generated it, and a TTL/expires_at for
--   automatic eviction. This is part of the 8-layer pipeline:
--   L1 (twin) → L2 (intake) → L3 (triage) → L4 (evolution) → L5 (promotion queue) → L6 (approval) → L7 (organizational) → L8 (knowledge)
--
-- CONSTRAINTS:
--   - Every record MUST reference a Spine entity via canonical_id + entity_type.
--   - Confidence is required and bounded between 0.0 and 1.0.
--   - generated_by is required to track provenance of the AI/generator.
--   - episode_id is required to link back to the OODA cycle event.
--   - TTL and expires_at are required for L5 (non-persistent memory).
--
-- INDEXING STRATEGY:
--   Composite indexes are designed for projection-friendly slicing by:
--   - tenant + canonical_id    (spine lookups)
--   - tenant + entity_type     (spine type filtering)
--   - tenant + memory_type     (domain-specific filtering)
--   - tenant + status          (queue workload filtering)
--   - canonical_id + confidence  (promotion quality filtering)
--   - tenant + expires_at      (TTL eviction batching)
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_promotion_queue (
    id            TEXT PRIMARY KEY,                              -- Unique memory record ID (e.g., UUID)
    tenant_id     TEXT NOT NULL,                                 -- Multi-tenant partition key
    canonical_id  TEXT NOT NULL,                                 -- Spine canonical entity ID (FK semantic to Spine)
    entity_type   TEXT NOT NULL,                                 -- Spine entity type (e.g., 'user', 'service', 'team')
    version       INTEGER NOT NULL DEFAULT 1,                    -- Memory version for optimistic concurrency
    confidence    REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0), -- AI confidence score (0.0-1.0)
    generated_by  TEXT NOT NULL,                                 -- Generator identity (model name, agent ID, pipeline stage)
    episode_id    TEXT NOT NULL,                                 -- OODA cycle episode ID that produced this memory
    memory_type   TEXT NOT NULL,                                 -- Domain memory type (e.g., 'twin', 'health', 'risk', 'sentiment', 'anomaly')
    status        TEXT NOT NULL DEFAULT 'pending_review',        -- Queue status: 'pending_review', 'approved', 'rejected', 'expired', 'superseded'
    content       TEXT,                                            -- Human-readable memory content
    provenance    TEXT,                                          -- Source/trace of how this memory was generated
    TTL           INTEGER NOT NULL,                              -- Time-to-live in seconds (ephemeral — L5 memory is not persistent)
    expires_at    INTEGER NOT NULL,                              -- UNIX timestamp when this memory record expires
    created_at    INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- UNIX timestamp of creation
    updated_at    INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- UNIX timestamp of last update

    -- Ensure no duplicate promotion queue entries for the same entity at the same version
    UNIQUE (tenant_id, canonical_id, entity_type, version)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Spine entity lookups within a tenant
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_tenant_canonical
    ON memory_promotion_queue (tenant_id, canonical_id);

-- Entity type filtering within a tenant
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_tenant_entity_type
    ON memory_promotion_queue (tenant_id, entity_type);

-- Memory type filtering within a tenant (e.g., 'health', 'risk')
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_tenant_memory_type
    ON memory_promotion_queue (tenant_id, memory_type);

-- Queue status filtering within a tenant (e.g., all pending reviews)
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_tenant_status
    ON memory_promotion_queue (tenant_id, status);

-- Promotion quality filtering: confidence-ranked memories for a Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_canonical_confidence
    ON memory_promotion_queue (canonical_id, confidence DESC);

-- TTL batch eviction for a tenant (ordered for efficient sweep queries)
CREATE INDEX IF NOT EXISTS idx_memory_promotion_queue_tenant_expires
    ON memory_promotion_queue (tenant_id, expires_at);

-- =============================================================================
-- TRIGGERS (Auto-update updated_at on modification)
-- =============================================================================

CREATE TRIGGER IF NOT EXISTS trg_memory_promotion_queue_updated_at
AFTER UPDATE ON memory_promotion_queue
FOR EACH ROW
BEGIN
    UPDATE memory_promotion_queue
    SET updated_at = strftime('%s', 'now')
    WHERE id = NEW.id;
END;

-- =============================================================================
-- TABLE SCHEMA: memory_promotion_queue
-- Layer: L5 (Promotion Queue)
-- Purpose: Ephemeral staging memory for AI-generated insights awaiting
--          human review before promotion to L6+ persistent knowledge.
-- =============================================================================
