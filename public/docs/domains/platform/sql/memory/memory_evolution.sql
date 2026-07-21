-- ============================================================================
-- IntegrateWise Platform: Dynamic Memory Layer
-- Domain: memory_evolution (L4 — Evolution Layer)
-- Target: Cloudflare D1 (SQLite-compatible)
-- ============================================================================
--
-- TABLE COMMENT:
--   memory_evolution stores ephemeral, AI-generated memory records that have
--   successfully traversed intake (L2) and triage (L3) to reach the evolution
--   stage (L4) of the 8-layer pipeline. At L4, memories are enriched,
--   cross-referenced, and refined before being promoted to the promotion
--   queue (L5). This layer represents the transition from raw signal to
--   actionable, context-aware intelligence.
--
--   8-Layer Pipeline:
--     L1 (Twin)         → L2 (Intake)      → L3 (Triage)
--     L4 (Evolution)    → L5 (Promotion Queue) → L6 (Approval)
--     L7 (Organizational) → L8 (Knowledge)
--
--   Domain-specific memories (health, risk, sentiment, etc.) are derived from
--   platform signals and follow the same pattern, using the `memory_type`
--   column to indicate their subtype.
--
--   DESIGN PRINCIPLES ENFORCED:
--   • Every row references a canonical Spine entity via (canonical_id, entity_type).
--   • Every row is opinionated: confidence and generated_by are required.
--   • Every row has a TTL and expiry (required for L4; L6-L8 have persistent TTL).
--   • Every row is event-sourced: episode_id links to the OODA cycle.
--   • Memory is projection-friendly: sliced by tenant, type, status, and horizon.
--   • No JSONB for core business data; structured fields are typed columns.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Main Table: memory_evolution
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_evolution (
    -- Identity & Spine Reference
    id              TEXT PRIMARY KEY NOT NULL,                    -- UUID v7
    tenant_id       TEXT NOT NULL,                                  -- Multi-tenant isolation
    canonical_id    TEXT NOT NULL,                                  -- Spine entity PK reference
    entity_type     TEXT NOT NULL,                                  -- Spine entity type (e.g., 'user', 'asset', 'team')

    -- Versioning
    version         INTEGER NOT NULL DEFAULT 1,

    -- Opinionated Metadata
    confidence      REAL NOT NULL,                                  -- 0.0 (lowest) to 1.0 (highest)
    generated_by    TEXT NOT NULL,                                  -- AI model / agent identifier
    episode_id      TEXT NOT NULL,                                  -- OODA cycle / event-sourcing episode

    -- Classification & Lifecycle
    memory_type     TEXT NOT NULL,                                  -- L4 subtype or domain-specific label
    status          TEXT NOT NULL,                                  -- active, superseded, expired, promoted, rejected

    -- Content & Provenance
    content         TEXT,                                             -- Human-readable memory content
    provenance      TEXT,                                             -- Source traceability chain

    -- TTL & Expiry (required for L4; L6-L8 have persistent TTL)
    TTL             INTEGER NOT NULL,                               -- Time-to-live in seconds
    expires_at      INTEGER NOT NULL,                               -- Unix epoch timestamp when record expires

    -- Audit Timestamps
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- Unix epoch seconds
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- Unix epoch seconds

    -- Constraints
    CONSTRAINT chk_confidence_range CHECK (confidence >= 0.0 AND confidence <= 1.0),
    CONSTRAINT chk_version_positive CHECK (version > 0),
    CONSTRAINT chk_ttl_non_negative CHECK (TTL >= 0)
);

-- ----------------------------------------------------------------------------
-- Indexes: optimized for tenant-scoped lookups, graph traversal, and TTL sweeps
-- ----------------------------------------------------------------------------

-- Tenant + Spine entity lookups (graph edges, projection slicing)
CREATE INDEX IF NOT EXISTS idx_memevo_tenant_canonical
    ON memory_evolution(tenant_id, canonical_id);

-- Tenant + entity type lookups (aggregate per-type memory views)
CREATE INDEX IF NOT EXISTS idx_memevo_tenant_entity_type
    ON memory_evolution(tenant_id, entity_type);

-- Tenant + memory type lookups (projection by domain-specific memory class)
CREATE INDEX IF NOT EXISTS idx_memevo_tenant_memory_type
    ON memory_evolution(tenant_id, memory_type);

-- Tenant + status lookups (filter by lifecycle state)
CREATE INDEX IF NOT EXISTS idx_memevo_tenant_status
    ON memory_evolution(tenant_id, status);

-- Canonical entity + confidence (ranked memory retrieval per entity)
CREATE INDEX IF NOT EXISTS idx_memevo_canonical_confidence
    ON memory_evolution(canonical_id, confidence);

-- Tenant + expiry (TTL sweep, garbage collection, time-horizon projections)
CREATE INDEX IF NOT EXISTS idx_memevo_tenant_expires
    ON memory_evolution(tenant_id, expires_at);

-- ----------------------------------------------------------------------------
-- Auto-update trigger for `updated_at`
-- ----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_memevo_updated_at
AFTER UPDATE ON memory_evolution
FOR EACH ROW
WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE memory_evolution
    SET updated_at = strftime('%s', 'now')
    WHERE id = NEW.id;
END;

-- ============================================================================
-- END OF FILE
-- ============================================================================
