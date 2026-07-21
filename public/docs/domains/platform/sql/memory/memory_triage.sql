-- =============================================================================
-- INTEGRATEWISE PLATFORM — DYNAMIC MEMORY LAYER
-- Schema: memory_triage.sql
-- Layer: L3 (Triage)
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
--
-- TABLE-LEVEL COMMENT
-- -------------------
-- Triage memory represents ephemeral, opinionated evaluations generated during
-- the L3 triage stage of the 8-layer pipeline (L1 Twin → L2 Intake → L3 Triage
-- → L4 Evolution → L5 Promotion Queue → L6 Approval → L7 Organizational → L8
-- Knowledge). After raw signals are ingested at L2, L3 triage memories assess
-- relevance, confidence, urgency, and routing decisions. These memories are
-- short-lived (strict TTL required): they either promote signals to L4
-- (Evolution) or reject them back to the Twin. Each record is strictly linked
-- to a canonical Spine entity via (canonical_id, entity_type) and to an OODA
-- cycle episode via episode_id. Confidence is mandatory and bounded [0.0, 1.0].
-- generated_by is mandatory (agent/system identifier). This table is NOT the
-- source of truth; it is a projection layer for AI-generated ephemeral state.
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_triage (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    confidence      REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by    TEXT NOT NULL,
    episode_id      TEXT NOT NULL,
    memory_type     TEXT NOT NULL,
    status          TEXT NOT NULL,
    content         TEXT,
    provenance      TEXT,
    TTL             INTEGER NOT NULL,
    expires_at      INTEGER NOT NULL,
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),

    FOREIGN KEY (canonical_id, entity_type) REFERENCES spine_entities(id, entity_type)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- Spine linkage: query memories by tenant + canonical entity
CREATE INDEX IF NOT EXISTS idx_memory_triage_tenant_canonical
    ON memory_triage(tenant_id, canonical_id);

-- Type slicing: query memories by tenant + Spine entity type
CREATE INDEX IF NOT EXISTS idx_memory_triage_tenant_entity_type
    ON memory_triage(tenant_id, entity_type);

-- Memory type slicing: query by tenant + memory classification
CREATE INDEX IF NOT EXISTS idx_memory_triage_tenant_memory_type
    ON memory_triage(tenant_id, memory_type);

-- Status filtering: query by tenant + lifecycle status
CREATE INDEX IF NOT EXISTS idx_memory_triage_tenant_status
    ON memory_triage(tenant_id, status);

-- Confidence ranking: rank/scan memories for a canonical entity by confidence
CREATE INDEX IF NOT EXISTS idx_memory_triage_canonical_confidence
    ON memory_triage(canonical_id, confidence);

-- TTL sweeping: efficiently find expired records per tenant for cleanup
CREATE INDEX IF NOT EXISTS idx_memory_triage_tenant_expires
    ON memory_triage(tenant_id, expires_at);
