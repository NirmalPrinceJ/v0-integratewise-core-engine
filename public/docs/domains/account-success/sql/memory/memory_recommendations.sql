-- ============================================================================
-- memory_recommendations
-- Layer: Dynamic Memory
-- Purpose: AI-generated action recommendations for accounts, derived from
--          Health, Risk, Engagement, and Objective signals. These are ephemeral
--          opinions — not immutable business truth — and should be refreshed
--          regularly as signals evolve.
-- TTL: 7 days
-- Source: SPINE_DOMAIN.md §4.3 (Dynamic Memory Schema pattern)
--         SPINE_INTELLIGENCE_AGENT.md §7.2 (Memory Classification)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_recommendations (
    -- Identity
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,

    -- Link to Spine (always)
    entity_type     TEXT NOT NULL,              -- 'account', 'person', etc.
    canonical_id    TEXT NOT NULL,              -- links to spine entity canonical_id

    -- Memory content (specific to Recommendations)
    recommendation_type TEXT NOT NULL,          -- 'action', 'alert', 'opportunity', 'risk_mitigation', 'expansion', 'renewal'
    priority_label      TEXT,                   -- 'critical', 'high', 'medium', 'low'
    title               TEXT NOT NULL,
    description         TEXT,
    suggested_action    TEXT,
    impact_score        REAL,                   -- 0.0–1.0, impact if acted upon
    effort_score        REAL,                   -- 0.0–1.0, effort required
    reasoning           TEXT,                   -- LLM-generated explanation
    expected_outcome    TEXT,
    contributing_factors JSON NOT NULL DEFAULT '[]', -- [{ factor, weight, source_memory_id, source }]

    -- Memory metadata
    confidence      REAL NOT NULL DEFAULT 0.5,
    generated_by    TEXT NOT NULL,              -- agent/model/heuristic name + version
    episode_id      TEXT,                       -- link to OODA cycle that produced this

    -- Time bounding
    ttl_days        INTEGER NOT NULL DEFAULT 7,
    valid_from      INTEGER,                  -- Unix timestamp
    valid_until     INTEGER,                  -- NULL = current; set on refresh
    created_at      INTEGER                   -- Unix timestamp
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_recommendations_tenant_entity
    ON memory_recommendations(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_memory_recommendations_episode
    ON memory_recommendations(tenant_id, episode_id);

CREATE INDEX IF NOT EXISTS idx_memory_recommendations_priority
    ON memory_recommendations(tenant_id, priority_label)
    WHERE valid_until IS NULL;
