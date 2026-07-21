-- IntegrateWise Platform: Dynamic Memory Layer
-- Table: memory_usage
-- Database: SQLite (Cloudflare D1 compatible)
--
-- LAYER: Domain-specific (derived from platform telemetry and usage signals)
--
-- DESCRIPTION:
--   This table stores ephemeral, AI-generated usage memories that capture
--   how canonical Spine entities are accessed, interacted with, and consumed
--   across the IntegrateWise platform. Usage memories are opinionated projections
--   derived from telemetry signals, designed for analytics, optimization, and
--   operational intelligence. They follow the same 8-layer pipeline pattern as
--   core memories but are classified as domain-specific due to their origin in
--   platform-generated signals rather than OODA twin cycles.
--
--   Every record references a canonical Spine entity via canonical_id + entity_type.
--   Confidence is mandatory (0.0-1.0) reflecting the certainty of the AI-generated
--   observation. generated_by tracks the agent or system that produced the memory.
--   episode_id links to the OODA cycle event that triggered creation.
--
--   TTL and expiry are enforced for usage memories (non-L6-L8 layers). Once
--   expired, records may be consolidated, archived, or superseded by fresher
--   projections.
--
-- DESIGN PRINCIPLES:
--   - Spine-linked: every memory references a canonical entity
--   - Opinionated: confidence and generated_by are required
--   - Ephemeral: TTL-driven lifecycle with explicit expiry
--   - Event-sourced: episode_id links to OODA cycle
--   - Graph-native: edges can reference other memory records or Spine entities
--   - Projection-friendly: indexed for team, role, and time horizon slicing
--   - Structured: content is TEXT for human readability; extend with typed
--     columns (e.g., usage_count, interaction_type) as usage domain matures

CREATE TABLE IF NOT EXISTS memory_usage (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    confidence REAL NOT NULL,
    generated_by TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    memory_type TEXT NOT NULL DEFAULT 'usage',
    status TEXT NOT NULL DEFAULT 'active',
    content TEXT,
    provenance TEXT,
    TTL INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),

    -- Confidence must be between 0.0 and 1.0
    CHECK(confidence >= 0.0 AND confidence <= 1.0),

    -- Version must be positive
    CHECK(version > 0),

    -- Status must be a valid lifecycle state
    CHECK(status IN ('active', 'expired', 'consolidated', 'archived', 'superseded')),

    -- TTL must be positive (seconds until expiry)
    CHECK(TTL > 0),

    -- Expiry must be at or after creation
    CHECK(expires_at >= created_at)
);

-- Index: Spine entity lookup by tenant (primary cross-reference)
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_canonical
    ON memory_usage(tenant_id, canonical_id);

-- Index: Entity type scoped to tenant (for type-specific projections)
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_entity_type
    ON memory_usage(tenant_id, entity_type);

-- Index: Memory type slicing by tenant (for layer-aware filtering)
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_memory_type
    ON memory_usage(tenant_id, memory_type);

-- Index: Status filtering by tenant (for lifecycle operations)
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_status
    ON memory_usage(tenant_id, status);

-- Index: Confidence ranking for a canonical entity (for quality sorting)
CREATE INDEX IF NOT EXISTS idx_memory_usage_canonical_confidence
    ON memory_usage(canonical_id, confidence);

-- Index: Expiry-based cleanup and projection queries by tenant
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_expires
    ON memory_usage(tenant_id, expires_at);

-- Index: Event-sourced lookups by episode (OODA cycle linkage)
CREATE INDEX IF NOT EXISTS idx_memory_usage_episode
    ON memory_usage(episode_id);

-- Index: Time horizon slicing and temporal projections
CREATE INDEX IF NOT EXISTS idx_memory_usage_created
    ON memory_usage(created_at);
