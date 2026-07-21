-- =============================================================================
-- memory_engagement
-- Layer: Dynamic Memory (AI-Created, Ephemeral, Opinionated)
-- Purpose: Captures derived relationship interaction history and engagement
--          assessment for a Spine entity (Account or Person). Computed from
--          meetings, emails, calls, support tickets, and other touchpoints.
--          Not immutable truth — this is the platform's opinion of engagement.
-- TTL: 30 days (refreshed by the Continuity Layer based on signal freshness)
-- Sources: SPINE_DOMAIN.md §4.3 (Dynamic Memory Schema Pattern)
--          SPINE_INTELLIGENCE_AGENT.md §7 (Memory Classification)
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_engagement (
    id                      TEXT PRIMARY KEY,
    tenant_id               TEXT NOT NULL,

    -- Link to Canonical Spine (always)
    entity_type             TEXT NOT NULL,              -- 'account', 'person', etc.
    canonical_id            TEXT NOT NULL,              -- links to spine entity canonical_id

    -- Memory content: Engagement assessment
    engagement_score        REAL,                       -- 0.00–1.00 composite engagement score
    frequency_label         TEXT,                       -- 'high', 'medium', 'low', 'dormant'
    sentiment_trend         TEXT,                       -- 'improving', 'stable', 'declining'
    reasoning               TEXT,                       -- LLM-generated or heuristic explanation
    last_interaction_at     INTEGER,                    -- Unix timestamp of most recent interaction
    interaction_count       INTEGER,                    -- number of interactions in assessment window
    interaction_types       JSON,                       -- [{"type": "meeting", "count": 5}, ...]
    contributing_factors    JSON,                       -- [{"factor": "meeting_frequency", "weight": 0.4, "source": "calendar"}]
    key_contacts            JSON,                       -- ["person_canonical_id_1", "person_canonical_id_2"] — most engaged contacts

    -- Memory metadata
    confidence              REAL NOT NULL DEFAULT 0.5,  -- 0.0–1.0 confidence in this assessment
    generated_by            TEXT NOT NULL,              -- agent/model/heuristic name + version
    episode_id              TEXT,                       -- link to OODA cycle that produced this memory

    -- Time bounding and lifecycle
    ttl_days                INTEGER NOT NULL DEFAULT 30, -- Engagement TTL: 30 days
    valid_from              INTEGER,                    -- Unix timestamp; when this memory became valid
    valid_until             INTEGER,                    -- NULL = current; set on refresh/archive
    created_at              INTEGER                     -- Unix timestamp; record creation time
);

-- Indexes
-- Fast lookup of current engagement memory for a given Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_entity_current
    ON memory_engagement(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Fast lookup of engagement memories by OODA episode
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_episode
    ON memory_engagement(tenant_id, episode_id);

-- Fast lookup of engagement memories by score (for dashboards, health ranking)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_score
    ON memory_engagement(tenant_id, engagement_score)
    WHERE valid_until IS NULL;

-- Fast lookup of engagement memories by frequency label (for cohorting)
CREATE INDEX IF NOT EXISTS idx_memory_engagement_tenant_frequency
    ON memory_engagement(tenant_id, frequency_label)
    WHERE valid_until IS NULL;
