-- ============================================================================
-- IntegrateWise Platform: Dynamic Memory Layer
-- Table: memory_organizational
-- Layer: L7 (Organizational)
-- Target: Cloudflare D1 (SQLite-compatible)
-- ============================================================================
--
-- TABLE COMMENT:
--   memory_organizational stores AI-generated memory records that have
--   successfully traversed the full lower pipeline (L1 Twin → L2 Intake → L3
--   Triage → L4 Evolution → L5 Promotion Queue → L6 Approval) and are now
--   recognized as part of the organization's shared memory. These records
--   represent vetted, approved insights that are available to all users
--   within the tenant boundary but have not yet graduated to L8 Knowledge
--   (the long-lived, curated canonical wisdom layer).
--
--   L7 memories sit at the boundary between ephemeral pipeline output and
--   permanent organizational knowledge. They are opinionated (confidence-scored),
--   event-sourced (episode-linked), and graph-native (edges can reference other
--   memory records or Spine entities). They are projection-friendly: designed
--   to be sliced by team, role, and time horizon.
--
--   8-Layer Pipeline:
--     L1 (Twin)          → L2 (Intake)        → L3 (Triage)
--     L4 (Evolution)     → L5 (Promotion Queue) → L6 (Approval)
--     L7 (Organizational) → L8 (Knowledge)
--
--   DESIGN PRINCIPLES ENFORCED:
--   • Every row references a canonical Spine entity via (canonical_id, entity_type).
--   • Every row is opinionated: confidence and generated_by are required.
--   • Every row has a TTL and expiry (L7 has persistent / long-lived TTL).
--   • Every row is event-sourced: episode_id links to the OODA cycle.
--   • Memory is projection-friendly: sliced by tenant, type, status, and horizon.
--   • No JSONB for core business data; structured fields use typed columns.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Main Table: memory_organizational
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_organizational (
    -- Identity & Spine Reference
    id              TEXT PRIMARY KEY NOT NULL,                    -- UUID v7
    tenant_id       TEXT NOT NULL,                                  -- Multi-tenant isolation boundary
    canonical_id    TEXT NOT NULL,                                  -- Spine entity PK reference
    entity_type     TEXT NOT NULL,                                  -- Spine entity type (e.g., 'user', 'asset', 'team', 'policy')

    -- Versioning
    version         INTEGER NOT NULL DEFAULT 1,

    -- Opinionated Metadata
    confidence      REAL NOT NULL,                                  -- 0.0 (lowest) to 1.0 (highest)
    generated_by    TEXT NOT NULL,                                  -- AI model / agent identifier
    episode_id      TEXT NOT NULL,                                  -- OODA cycle / event-sourcing episode

    -- Classification & Lifecycle
    memory_type     TEXT NOT NULL DEFAULT 'L7',                   -- L7 or domain-specific label
    status          TEXT NOT NULL DEFAULT 'active',                -- active, archived, superseded, pending_promotion, expired

    -- Content & Provenance
    content         TEXT,                                             -- Human-readable memory content
    provenance      TEXT,                                             -- Source traceability chain

    -- TTL & Expiry (L7 has persistent / long-lived TTL)
    TTL             INTEGER NOT NULL DEFAULT 15552000,            -- Time-to-live in seconds (180 days default)
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
CREATE INDEX IF NOT EXISTS idx_memorg_tenant_canonical
    ON memory_organizational (tenant_id, canonical_id);

-- Tenant + entity type lookups (aggregate per-type memory views)
CREATE INDEX IF NOT EXISTS idx_memorg_tenant_entity_type
    ON memory_organizational (tenant_id, entity_type);

-- Tenant + memory type lookups (projection by domain-specific memory class)
CREATE INDEX IF NOT EXISTS idx_memorg_tenant_memory_type
    ON memory_organizational (tenant_id, memory_type);

-- Tenant + status lookups (filter by lifecycle state)
CREATE INDEX IF NOT EXISTS idx_memorg_tenant_status
    ON memory_organizational (tenant_id, status);

-- Canonical entity + confidence (ranked memory retrieval per entity)
CREATE INDEX IF NOT EXISTS idx_memorg_canonical_confidence
    ON memory_organizational (canonical_id, confidence DESC);

-- Tenant + expiry (TTL sweep, garbage collection, time-horizon projections)
CREATE INDEX IF NOT EXISTS idx_memorg_tenant_expires
    ON memory_organizational (tenant_id, expires_at);

-- ----------------------------------------------------------------------------
-- Auto-update trigger for updated_at and version on modification
-- ----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_memorg_updated_at
    AFTER UPDATE ON memory_organizational
    FOR EACH ROW
    WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE memory_organizational
    SET updated_at = strftime('%s', 'now'),
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- ============================================================================
-- END OF FILE
-- ============================================================================
