-- =============================================================================
-- IntegrateWise Dynamic Memory Layer
-- Table: memory_knowledge
-- Layer: L8 (Knowledge Layer)
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
-- DESCRIPTION:
--   L8 Knowledge memory represents long-lived, persistent knowledge derived from
--   the L1-L7 memory pipeline and domain-specific signals. These records capture
--   organizational knowledge, verified insights, learned patterns, consolidated
--   facts, and curated wisdom that have survived the L5-L6 promotion and 
--   approval pipeline.
--
--   Knowledge memory is the final stage of the Dynamic Memory 8-layer pipeline:
--   L1 (Twin) → L2 (Intake) → L3 (Triage) → L4 (Evolution) → L5 (Promotion) 
--   → L6 (Approval) → L7 (Organizational) → L8 (Knowledge)
--
--   DESIGN PRINCIPLES:
--   - Every record references a canonical Spine entity via canonical_id + entity_type.
--   - All memory is opinionated: confidence is required (0.0-1.0).
--   - generated_by is required to trace AI/service generation provenance.
--   - TTL/expiry is required for all memory types, including L8 (persistent TTL).
--   - No JSONB for core data: content is TEXT; structured fields use typed columns.
--   - All queries MUST include tenant_id for multi-tenant isolation (403 fail-loud).
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_knowledge (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    confidence      REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by    TEXT NOT NULL,
    episode_id      TEXT NOT NULL,
    memory_type     TEXT NOT NULL DEFAULT 'L8' CHECK (memory_type IN ('L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'domain-specific')),
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'expired', 'pending_review', 'rejected')),
    content         TEXT NOT NULL,
    provenance      TEXT,
    TTL             INTEGER NOT NULL, -- seconds until expiry; L8 uses persistent (long) TTL
    expires_at      INTEGER NOT NULL, -- Unix epoch seconds
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

-- Spine entity lookups (tenant-scoped) — primary access pattern for linking 
-- knowledge to canonical Spine records
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_tenant_canonical 
ON memory_knowledge(tenant_id, canonical_id);

-- Entity-type filtering (tenant-scoped) — for querying knowledge by the type of 
-- Spine entity it references (e.g., user, project, policy)
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_tenant_entity_type 
ON memory_knowledge(tenant_id, entity_type);

-- Memory-type filtering (tenant-scoped) — for projecting knowledge by pipeline 
-- layer or domain classification
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_tenant_memory_type 
ON memory_knowledge(tenant_id, memory_type);

-- Status-based filtering (tenant-scoped) — for operational dashboards, cleanup 
-- jobs, and lifecycle management
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_tenant_status 
ON memory_knowledge(tenant_id, status);

-- Confidence-based ranking per entity — for surfacing the most reliable knowledge 
-- during inference and retrieval
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_canonical_confidence 
ON memory_knowledge(canonical_id, confidence);

-- TTL / expiry cleanup and projection queries (tenant-scoped) — for garbage 
-- collection, time-horizon slicing, and ephemeral memory projection
CREATE INDEX IF NOT EXISTS idx_memory_knowledge_tenant_expires 
ON memory_knowledge(tenant_id, expires_at);

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------

-- Auto-update updated_at timestamp on any row modification to maintain 
-- temporal ordering and cache invalidation signals
CREATE TRIGGER IF NOT EXISTS trg_memory_knowledge_updated_at
AFTER UPDATE ON memory_knowledge
FOR EACH ROW
BEGIN
    UPDATE memory_knowledge 
    SET updated_at = strftime('%s', 'now') 
    WHERE id = NEW.id;
END;
