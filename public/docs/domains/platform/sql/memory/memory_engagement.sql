-- =============================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Domain: memory_engagement
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
-- Layer: Domain-specific (L2–L4 pipeline)
-- Represents: Captured interaction signals between the platform and external
--   entities (customers, partners, stakeholders, opportunities). Records the
--   nature, channel, direction, content, sentiment, and metadata of each
--   touchpoint. Derived from platform intake signals (L2), triaged and
--   enriched (L3), then evolved through pattern recognition (L4).
--   NOT canonical — all records link to a Spine entity via canonical_id + entity_type.
-- Characteristics: Ephemeral, opinionated, AI-generated. TTL-enforced.
--   Confidence-scored. Event-sourced via episode_id.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLE: memory_engagement
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_engagement (
    -- Identity
    id              TEXT PRIMARY KEY, -- UUIDv7 or KSUID

    -- Spine linkage (canonical reference; every memory record must anchor to Spine)
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,  -- References a Spine entity record
    entity_type     TEXT NOT NULL,  -- Spine entity type (e.g., 'customer', 'partner', 'opportunity', 'stakeholder')

    -- Versioning (optimistic concurrency for memory projection rebuilds)
    version         INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),

    -- Opinionated memory metadata (core to Dynamic Memory philosophy)
    confidence      REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by    TEXT NOT NULL,  -- Agent ID, model name, or system component that produced this memory
    episode_id      TEXT NOT NULL,  -- OODA cycle episode identifier; enables event-sourced replay

    -- Classification
    memory_type     TEXT NOT NULL DEFAULT 'engagement', -- L2, L3, L4, or domain-specific variant
    status          TEXT NOT NULL DEFAULT 'active',       -- active | stale | superseded | archived | expired

    -- Content (human-readable narrative; structured fields preferred over opaque JSON)
    content         TEXT,           -- Human-readable summary/narrative of the engagement
    provenance      TEXT,           -- Source system, API endpoint, or upstream pipeline stage

    -- Engagement-specific typed columns (structured where possible; no JSONB for core data)
    channel         TEXT,           -- email | chat | call | meeting | webinar | support_ticket | social | in_app | other
    direction       TEXT,           -- inbound | outbound | bidirectional
    engagement_date TEXT,           -- ISO 8601 datetime of when the engagement actually occurred
    sentiment_score REAL CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0), -- Normalized sentiment
    participant_count INTEGER CHECK (participant_count >= 0), -- Number of participants in the engagement
    duration_seconds INTEGER CHECK (duration_seconds >= 0), -- Length of engagement in seconds

    -- Projection-friendly slicing (team, role, time horizon)
    team_id         TEXT,           -- Team responsible for / associated with this engagement
    role_id         TEXT,           -- Role context for projection filtering

    -- Temporal boundaries (TTL required for all memory types; L2–L4 use finite TTL)
    TTL             INTEGER NOT NULL DEFAULT 2592000 CHECK (TTL >= 0), -- Seconds until expiry; default 30 days
    expires_at      TEXT NOT NULL,  -- ISO 8601 datetime; MUST be computed by application as created_at + TTL

    -- Audit timestamps
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
-- 1. Spine lookups by tenant + canonical entity (primary projection query)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_canonical
    ON memory_engagement(tenant_id, canonical_id);

-- 2. Projection by entity type (e.g., "all engagement memories for customers")
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_entity_type
    ON memory_engagement(tenant_id, entity_type);

-- 3. Slice by memory type (e.g., L2 vs L3 vs L4 engagement)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_memory_type
    ON memory_engagement(tenant_id, memory_type);

-- 4. Slice by status (e.g., "active engagement memories for this tenant")
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_status
    ON memory_engagement(tenant_id, status);

-- 5. Quality filtering for canonical entity (confidence-ranked recall)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_canonical_confidence
    ON memory_engagement(canonical_id, confidence DESC);

-- 6. TTL sweep and expiration queries (garbage collection / eviction)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_expires
    ON memory_engagement(tenant_id, expires_at);

-- 7. Event-sourced lookup by episode (OODA cycle replay / lineage tracing)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_episode
    ON memory_engagement(tenant_id, episode_id);

-- 8. Engagement analytics: channel + direction slicing
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_channel_direction
    ON memory_engagement(tenant_id, channel, direction);

-- 9. Time-horizon slicing (engagement date projection)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_engagement_date
    ON memory_engagement(tenant_id, engagement_date);

-- 10. Team + role projection (multi-tenant workspace slicing)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_team_role
    ON memory_engagement(tenant_id, team_id, role_id);

-- =============================================================================
-- NOTES FOR APPLICATION LAYER
-- =============================================================================
-- 1. expires_at MUST be computed by the application on INSERT as:
--    datetime(created_at, '+' || TTL || ' seconds')
--    D1 does not enforce computed columns for cross-column dependencies.
-- 2. updated_at SHOULD be refreshed by the application on every UPDATE.
-- 3. Graph-native edges referencing other memory records or Spine entities
--    should be stored in a separate memory_edge table (not in this file).
-- 4. All memory records are ephemeral; TTL-based eviction is expected.
--    L6–L8 memories use persistent TTL (e.g., TTL = 0 or a sentinel value);
--    engagement memory is strictly L2–L4 and should carry finite TTL.
-- =============================================================================
