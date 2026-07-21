-- =============================================================================
-- IntegrateWise Platform :: Dynamic Memory Layer
-- Domain: Forecast
-- Table: memory_forecast
-- =============================================================================
--
-- DESCRIPTION:
--   AI-generated forecast projections for canonical Spine entities. Forecasts
--   are ephemeral, opinionated predictions of future state, outcomes, or metrics
--   derived from platform signals and produced during OODA cycles.
--
-- MEMORY LAYER CLASSIFICATION:
--   Layer: Domain-specific (derived from L1-L8 pipeline signals)
--   Pipeline: Consumes L4 (evolution) and L7 (organizational) signals; projected
--   through OODA episodes. Not part of the core promotion pipeline but follows
--   the same confidence, TTL, and traceability patterns.
--
-- CHARACTERISTICS:
--   - Spine-linked: Every record references a canonical entity via
--     canonical_id + entity_type
--   - Ephemeral: All records have TTL and expires_at (auto-purged after expiry)
--   - Opinionated: confidence is required (0.0-1.0 scale)
--   - Traceable: generated_by and episode_id link to OODA cycles
--   - Event-sourced: every record traces back to an OODA episode_id
--   - Projection-friendly: indexed for slicing by tenant, entity, type, status,
--     and expiry window
--   - Content is TEXT (human-readable); structured forecast data uses typed columns
--
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_forecast (
    -- Core identity
    id TEXT PRIMARY KEY,
    
    -- Multi-tenant Spine linkage
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    
    -- Versioning
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Opinion metadata
    confidence REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    
    -- Memory classification
    memory_type TEXT NOT NULL DEFAULT 'forecast',
    status TEXT NOT NULL DEFAULT 'active',
    
    -- Content (human-readable narrative or summary)
    content TEXT,
    
    -- Provenance and lineage
    provenance TEXT NOT NULL,
    
    -- Ephemeral lifecycle (TTL required for all non-L6/L8 memory)
    ttl_seconds INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    
    -- Temporal tracking (Unix epoch seconds)
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    -- Forecast-specific structured data (typed columns per "no JSONB" rule)
    forecast_target_date INTEGER,
    forecast_horizon TEXT CHECK (forecast_horizon IN ('short', 'medium', 'long')),
    forecast_value REAL,
    forecast_unit TEXT,
    forecast_methodology TEXT,
    model_version TEXT
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

-- Tenant + canonical entity lookup (most common access pattern)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_tenant_canonical 
    ON memory_forecast(tenant_id, canonical_id);

-- Tenant + entity type filtering (for entity-class projections)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_tenant_entity 
    ON memory_forecast(tenant_id, entity_type);

-- Tenant + memory type filtering (for type-specific memory sweeps)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_tenant_type 
    ON memory_forecast(tenant_id, memory_type);

-- Tenant + status filtering (for active/expired/stale queries)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_tenant_status 
    ON memory_forecast(tenant_id, status);

-- Canonical + confidence ordering (for best-recall per entity)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_canonical_confidence 
    ON memory_forecast(canonical_id, confidence);

-- Tenant + expiry (for TTL sweep and garbage collection)
CREATE INDEX IF NOT EXISTS idx_memory_forecast_tenant_expires 
    ON memory_forecast(tenant_id, expires_at);