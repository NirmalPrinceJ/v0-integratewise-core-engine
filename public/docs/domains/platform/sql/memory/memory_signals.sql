-- ============================================================
-- IntegrateWise Platform
-- Domain: Platform / Dynamic Memory Layer
-- Table: memory_signals
-- Target: Cloudflare D1 (SQLite-compatible)
-- ============================================================
--
-- PURPOSE:
-- Domain-specific signal memories derived from platform telemetry,
-- health checks, risk indicators, sentiment analysis, and other
-- signal sources. These memories capture ephemeral, opinionated,
-- AI-generated insights that are NOT the source of truth.
--
-- LAYER PIPELINE:
-- These memories follow the 8-layer Dynamic Memory pipeline:
--   L1 (twin)        -> Raw twin observations
--   L2 (intake)      -> Processed intake signals
--   L3 (triage)      -> Triaged and prioritized signals
--   L4 (evolution)   -> Evolved and enriched signals
--   L5 (promotion)   -> Signals queued for promotion to persistent
--   L6 (approval)    -> Approved signals (persistent TTL)
--   L7 (organizational) -> Organization-wide signals (persistent TTL)
--   L8 (knowledge)   -> Institutional knowledge signals (persistent TTL)
--
-- DESIGN PRINCIPLES:
-- - Every memory references a canonical Spine entity via (canonical_id + entity_type)
-- - Every memory is linked to an OODA cycle via episode_id
-- - Confidence is required (0.0-1.0)
-- - generated_by is required (identifies the AI/model/agent)
-- - TTL/expiry is required for L1-L5; L6-L8 have persistent TTL
-- - Graph-native: parent_memory_id enables memory-to-memory edges
-- - Projection-friendly: indexed for tenant, role, time-horizon slicing
-- - Event-sourced: episode_id links to the OODA cycle
--
-- ============================================================

CREATE TABLE IF NOT EXISTS memory_signals (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL, -- Spine entity reference
    entity_type TEXT NOT NULL, -- Spine entity type
    version INTEGER NOT NULL DEFAULT 1,
    confidence REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by TEXT NOT NULL, -- AI model, agent, or system identifier
    episode_id TEXT NOT NULL, -- OODA cycle episode reference
    memory_type TEXT NOT NULL, -- L1-L8 layer indicator
    status TEXT NOT NULL DEFAULT 'active', -- active, expired, archived, superseded
    content TEXT, -- Human-readable signal content
    provenance TEXT, -- Source traceability (pipeline step, model version, etc.)
    signal_category TEXT, -- health, risk, sentiment, performance, security, compliance
    signal_subtype TEXT, -- Domain-specific subtype (e.g., 'latency', 'vulnerability', 'mood')
    severity INTEGER CHECK (severity >= 1 AND severity <= 5), -- 1=info, 5=critical
    parent_memory_id TEXT, -- Graph link: parent/derived memory reference
    superseded_by TEXT, -- Newer version that replaced this record
    TTL INTEGER, -- Time-to-live in seconds (NULL for L6-L8 persistent memory)
    expires_at INTEGER, -- Unix epoch timestamp when memory expires
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    
    -- Table constraints
    CONSTRAINT chk_memory_signals_memory_type CHECK (memory_type IN ('L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8')),
    CONSTRAINT chk_memory_signals_status CHECK (status IN ('active', 'expired', 'archived', 'superseded')),
    CONSTRAINT chk_memory_signals_ttl CHECK (
        memory_type IN ('L6', 'L7', 'L8') OR 
        (TTL IS NOT NULL AND TTL > 0 AND expires_at IS NOT NULL)
    ),
    
    -- Foreign key constraints
    FOREIGN KEY (parent_memory_id) REFERENCES memory_signals(id) ON DELETE SET NULL,
    FOREIGN KEY (superseded_by) REFERENCES memory_signals(id) ON DELETE SET NULL
);

-- Required indexes: tenant-scoped entity lookups
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_canonical 
    ON memory_signals(tenant_id, canonical_id);

-- Required indexes: tenant-scoped entity type filtering
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_entity_type 
    ON memory_signals(tenant_id, entity_type);

-- Required indexes: tenant-scoped memory type (L1-L8 layer slicing)
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_memory_type 
    ON memory_signals(tenant_id, memory_type);

-- Required indexes: tenant-scoped status filtering
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_status 
    ON memory_signals(tenant_id, status);

-- Required indexes: confidence-ordered lookup by canonical entity
CREATE INDEX IF NOT EXISTS idx_memory_signals_canonical_confidence 
    ON memory_signals(canonical_id, confidence DESC);

-- Required indexes: tenant-scoped expiry queries (for TTL cleanup)
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_expires 
    ON memory_signals(tenant_id, expires_at);

-- Additional performance indexes for projection patterns
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_episode 
    ON memory_signals(tenant_id, episode_id);

CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_created 
    ON memory_signals(tenant_id, created_at DESC);

-- Signal-specific indexes for domain slicing
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_category 
    ON memory_signals(tenant_id, signal_category);

CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_severity 
    ON memory_signals(tenant_id, severity);

-- Updated_at trigger for automatic timestamp maintenance
CREATE TRIGGER IF NOT EXISTS trg_memory_signals_updated_at
AFTER UPDATE ON memory_signals
FOR EACH ROW
WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE memory_signals SET updated_at = unixepoch() WHERE id = NEW.id;
END;
