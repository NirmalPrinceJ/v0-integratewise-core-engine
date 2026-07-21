-- ============================================================================
-- Entity: memory_sentiment
-- Layer: Dynamic Memory
-- Purpose: Stores AI-derived sentiment analysis for Spine entities (accounts,
--          persons, organizations). Captures the emotional tone of customer
--          relationships derived from engagement transcripts, emails, support
--          interactions, calls, surveys, and other communication channels.
-- TTL: 7 days (refreshed from engagement signals)
-- Source: SPINE_DOMAIN.md §4.1, §4.3
--         SPINE_INTELLIGENCE_AGENT.md §7 (Memory Classification), §10 (Code Generation)
-- Target: D1 (SQLite-compatible)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_sentiment (
    -- Identity
    id                  TEXT PRIMARY KEY,
    tenant_id           TEXT NOT NULL,

    -- Spine linkage (every memory links to exactly one Spine entity)
    entity_type         TEXT NOT NULL,          -- 'account', 'person', 'organization', etc.
    canonical_id        TEXT NOT NULL,          -- stable identity from the Spine

    -- Memory content: sentiment-specific attributes
    score               REAL,                   -- normalized sentiment score: -1.00 (negative) to +1.00 (positive)
    score_label         TEXT,                   -- 'positive', 'neutral', 'negative', 'mixed'
    reasoning           TEXT,                   -- LLM-generated or heuristic explanation of the sentiment
    sentiment_dimension TEXT,                   -- 'overall', 'product', 'support', 'relationship', 'executive'
    direction           TEXT,                   -- 'improving', 'declining', 'stable' (trend relative to previous)
    contributing_factors JSON NOT NULL DEFAULT '[]', -- [{ factor, weight, source, quote }]
    source_channels     JSON NOT NULL DEFAULT '[]', -- ['email', 'meeting', 'support', 'call', 'survey']
    key_phrases         JSON NOT NULL DEFAULT '[]', -- phrases that most influenced the sentiment score
    emotional_indicators JSON NOT NULL DEFAULT '[]', -- detected emotions: ['frustration', 'excitement', 'concern', ...]

    -- Memory metadata
    confidence          REAL NOT NULL DEFAULT 0.5,
    generated_by        TEXT NOT NULL,          -- agent/model/heuristic name + version
    episode_id          TEXT,                   -- link to OODA cycle that produced this memory

    -- Lifecycle
    ttl_days            INTEGER NOT NULL DEFAULT 7,
    valid_from          INTEGER,               -- Unix timestamp; when this memory became valid
    valid_until         INTEGER,               -- Unix timestamp; NULL = current; set on refresh
    created_at          INTEGER                -- Unix timestamp
);

-- Indexes for projection queries and lifecycle management
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_entity
    ON memory_sentiment(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_memory_sentiment_score
    ON memory_sentiment(tenant_id, score)
    WHERE valid_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_memory_sentiment_episode
    ON memory_sentiment(tenant_id, episode_id);
