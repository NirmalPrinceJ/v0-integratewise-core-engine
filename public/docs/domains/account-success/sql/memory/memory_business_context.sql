-- =============================================================================
-- Entity: memory_business_context
-- Layer: Dynamic Memory
-- TTL: 30 days
-- Purpose: Synthesized understanding of a customer's business derived from
--          public data, earnings calls, news, and CRM notes. This is an AI-
--          created, ephemeral, opinionated memory — not immutable business truth.
-- Source: SPINE_DOMAIN.md §4.1, §4.3 + SPINE_INTELLIGENCE_AGENT.md §7, §10
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_business_context (
    id                   TEXT PRIMARY KEY,
    tenant_id            TEXT NOT NULL,
    entity_type          TEXT NOT NULL,              -- links to Spine entity type (e.g., 'account', 'organization')
    canonical_id         TEXT NOT NULL,              -- links to Spine canonical_id
    -- Memory content
    summary              TEXT,                       -- synthesized narrative of the customer's business context
    reasoning            TEXT,                       -- explanation of how the synthesis was formed
    key_insights         JSON NOT NULL DEFAULT '[]', -- structured insight objects [{ insight, category, confidence }]
    contributing_factors JSON NOT NULL DEFAULT '[]', -- factors that contributed to this understanding [{ factor, weight, source }]
    sources              JSON NOT NULL DEFAULT '[]', -- information sources [{ type, url, title, date, record_id }]
    market_position      TEXT,                       -- assessed market position and competitive standing
    competitive_landscape TEXT,                      -- summary of key competitors and market dynamics
    recent_developments  TEXT,                       -- recent news, earnings, M&A, or business changes
    -- Memory metadata
    confidence           REAL NOT NULL DEFAULT 0.5,  -- 0.0–1.0 confidence in this memory
    generated_by         TEXT NOT NULL,              -- agent name + model version (e.g., 'spine-intelligence-agent@1.0.0')
    episode_id           TEXT,                       -- link to the OODA cycle that produced this memory
    ttl_days             INTEGER NOT NULL DEFAULT 30, -- TTL: 30 days per SPINE_DOMAIN.md §4.1
    -- Time bounding
    valid_from           INTEGER,                    -- Unix timestamp when this memory became valid
    valid_until          INTEGER,                    -- NULL = current; set on refresh or archive
    created_at           INTEGER                     -- Unix timestamp when this record was created
);

-- Index for current memory lookups by spine entity (primary read path for projections)
CREATE INDEX IF NOT EXISTS idx_memory_business_context_entity
    ON memory_business_context(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Index for episode-based queries (audit, OODA traceability)
CREATE INDEX IF NOT EXISTS idx_memory_business_context_episode
    ON memory_business_context(tenant_id, episode_id);
