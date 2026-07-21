-- IntegrateWise Platform: Dynamic Memory Layer
-- Domain: Business Context Memory
-- Pipeline Layer: L4 (Evolution)
--
-- This table stores ephemeral, AI-generated business context memories that
-- represent evolved understanding of business operations, market conditions,
-- competitive positioning, and strategic insights. Each record links to a
-- canonical Spine entity and carries confidence scoring, provenance tracking,
-- and TTL-based expiration.
--
-- Business context memories sit at the L4 (Evolution) layer of the 8-layer
-- pipeline: L1 (twin) → L2 (intake) → L3 (triage) → L4 (evolution) →
-- L5 (promotion queue) → L6 (approval) → L7 (organizational) → L8 (knowledge).
--
-- At L4, raw signals have been processed, correlated, and evolved into structured
-- business understanding. These memories are opinionated (confidence-scored),
-- attributed (generated_by), and ephemeral (TTL-managed). They are NOT the
-- source of truth — they are AI-generated projections that inform downstream
-- OODA cycles and may be promoted to L5-L8 if validated.
--
-- Design Principles:
-- - References canonical Spine entities via (canonical_id, entity_type)
-- - Confidence-scored (0.0-1.0) with required attribution
-- - Event-sourced via episode_id linking to OODA cycles
-- - Graph-native: edges reference memory records or Spine entities
-- - Projection-friendly: sliceable by tenant, role, time horizon
-- - TTL-managed with automatic expiration (required for L4 memories)
--
-- Target Database: Cloudflare D1 (SQLite-compatible)

-- Drop and recreate for idempotent deployment (optional, remove in production if data retention matters)
-- DROP TABLE IF EXISTS memory_business_context;

CREATE TABLE IF NOT EXISTS memory_business_context (
    -- Identity
    id TEXT PRIMARY KEY,
    -- UUID v7 recommended for distributed, time-sortable memory IDs

    -- Spine linkage (canonical entity reference)
    tenant_id TEXT NOT NULL,
    -- Multi-tenant isolation key. All queries MUST filter by tenant_id.

    canonical_id TEXT NOT NULL,
    -- Spine canonical entity reference. Links to the source of truth in the Spine.

    entity_type TEXT NOT NULL,
    -- Spine entity type enum: 'business_unit', 'product', 'market', 'segment',
    -- 'customer', 'partner', 'competitor', 'regulatory_body', etc.

    -- Versioning
    version INTEGER NOT NULL DEFAULT 1,
    -- Optimistic locking version. Increment on every update to detect conflicts.

    -- Core memory attributes
    confidence REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    -- AI-generated confidence score (0.0 = no confidence, 1.0 = absolute certainty).
    -- Required for all memory records. Downstream consumers should threshold this.

    generated_by TEXT NOT NULL,
    -- Agent or model identifier that generated this memory (e.g., 'agent-evolution-v2',
    -- 'gpt-4o', 'twin-signal-processor'). Required for attribution and audit.

    episode_id TEXT NOT NULL,
    -- OODA cycle episode reference. Links to the event-sourced OODA cycle that
    -- produced this memory. Enables temporal replay and causality tracing.

    -- Classification and lifecycle
    memory_type TEXT NOT NULL DEFAULT 'business_context',
    -- Memory classification for projection filtering. Allows polymorphic memory
    -- tables to be queried uniformly by type.

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'stale', 'superseded', 'expired', 'archived')),
    -- Lifecycle status:
    --   active     - Current, valid memory
    --   stale      - TTL exceeded, awaiting cleanup or refresh
    --   superseded - Replaced by a newer version for the same canonical entity
    --   expired    - TTL exceeded and memory is no longer valid
    --   archived   - Manually or programmatically preserved for audit

    -- Content and provenance
    content TEXT NOT NULL,
    -- Human-readable memory content/summary. This is the primary consumable
    -- payload. May contain markdown, structured text, or natural language.
    -- For structured data, use the typed domain columns below.

    provenance TEXT NOT NULL,
    -- Source trail: agent chain, prompt versions, data lineage, model
    -- configuration, and input signal references. Enables reproducibility.

    -- Domain-specific structured fields (business context)
    -- These typed columns enable efficient querying and filtering without
    -- parsing JSON from the content field.
    business_domain TEXT
        CHECK (business_domain IN ('strategy', 'operations', 'market', 'competitive', 'regulatory', 'financial', 'technology', 'customer', 'partner', 'general')),
    -- Business domain classification for domain-specific projections.

    impact_level TEXT
        CHECK (impact_level IN ('low', 'medium', 'high')),
    -- Estimated business impact level for prioritization and routing.

    time_horizon TEXT
        CHECK (time_horizon IN ('immediate', 'short_term', 'medium_term', 'long_term')),
    -- Temporal relevance horizon: immediate (hours), short (days), medium (weeks-months), long (quarters-years).

    -- TTL and expiration (required for L4 evolution memories)
    ttl_seconds INTEGER NOT NULL
        CHECK (ttl_seconds > 0)
        DEFAULT 604800,
    -- Time-to-live in seconds. Default: 7 days (604800 seconds).
    -- L4 memories MUST have a positive TTL. L6-L8 memories may use
    -- a different table or override with persistent TTL (0 = no expiry).
    -- For this L4 table, ttl_seconds > 0 is enforced.

    expires_at INTEGER NOT NULL,
    -- Unix timestamp (seconds since epoch) when this memory expires.
    -- Computed as: expires_at = created_at + ttl_seconds
    -- Must be explicitly set on INSERT; not auto-computed by SQLite.

    -- Audit timestamps
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    -- Creation timestamp in Unix epoch seconds.

    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    -- Last modification timestamp in Unix epoch seconds.

    -- Constraints
    CONSTRAINT uq_mem_bc_tenant_canonical_version UNIQUE (tenant_id, canonical_id, version)
    -- Prevents duplicate versions per tenant+entity. On conflict, increment version.
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Tenant + canonical entity lookups (most common: fetch all memories for a spine entity)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_canonical
    ON memory_business_context(tenant_id, canonical_id);

-- Tenant + entity type (for entity-type projections and bulk operations)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_entity_type
    ON memory_business_context(tenant_id, entity_type);

-- Tenant + memory type (for memory-type filtered projections)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_memory_type
    ON memory_business_context(tenant_id, memory_type);

-- Tenant + status (for status-based workflow and lifecycle queries)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_status
    ON memory_business_context(tenant_id, status);

-- Canonical + confidence (for confidence-ranked retrieval within an entity)
CREATE INDEX IF NOT EXISTS idx_mem_bc_canonical_confidence
    ON memory_business_context(canonical_id, confidence DESC);

-- Tenant + expiration (for TTL sweep, cleanup jobs, and temporal queries)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_expires
    ON memory_business_context(tenant_id, expires_at);

-- Additional supporting indexes for event sourcing and audit

-- Episode lookup (for OODA cycle replay and event sourcing)
CREATE INDEX IF NOT EXISTS idx_mem_bc_episode
    ON memory_business_context(episode_id);

-- Generated by lookup (for attribution and agent audit trails)
CREATE INDEX IF NOT EXISTS idx_mem_bc_generated_by
    ON memory_business_context(generated_by);

-- Time-range queries (for temporal projections and history)
CREATE INDEX IF NOT EXISTS idx_mem_bc_tenant_created
    ON memory_business_context(tenant_id, created_at DESC);

-- Status + expiration composite (for cleanup jobs targeting active records nearing expiry)
CREATE INDEX IF NOT EXISTS idx_mem_bc_status_expires
    ON memory_business_context(status, expires_at)
    WHERE status IN ('active', 'stale');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp on row modification
CREATE TRIGGER IF NOT EXISTS trg_mem_bc_updated_at
    AFTER UPDATE ON memory_business_context
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE memory_business_context
    SET updated_at = unixepoch()
    WHERE id = NEW.id;
END;

-- ============================================================================
-- VIEWS (optional, for common projections)
-- ============================================================================

-- Active memories view: filters to current, non-expired records
-- Consumers should query this view for current memory state
CREATE VIEW IF NOT EXISTS vw_mem_bc_active AS
SELECT
    *
FROM memory_business_context
WHERE status = 'active'
  AND expires_at > unixepoch();

-- High-confidence memories view: active records with confidence >= 0.8
-- Use for decision-critical memory retrieval
CREATE VIEW IF NOT EXISTS vw_mem_bc_high_confidence AS
SELECT
    *
FROM memory_business_context
WHERE status = 'active'
  AND expires_at > unixepoch()
  AND confidence >= 0.8;

-- Stale/expired memory audit view: records needing cleanup or refresh
CREATE VIEW IF NOT EXISTS vw_mem_bc_expired AS
SELECT
    *
FROM memory_business_context
WHERE expires_at <= unixepoch()
   OR status IN ('expired', 'stale');
