-- memory_insights
-- Layer: Dynamic Memory (AI-created, ephemeral, opinionated)
-- TTL: 7 days (refreshed by the Continuity Layer based on signal freshness)
-- Purpose: Stores AI-generated findings from cross-signal synthesis and pattern detection.
--          Insights are derived, not immutable truth. They link to Spine entities via
--          canonical_id + entity_type and carry confidence, provenance, and episode tracking.
-- Source: SPINE_DOMAIN.md §4.1, §4.3 | SPINE_INTELLIGENCE_AGENT.md §7, §10.2

CREATE TABLE IF NOT EXISTS memory_insights (
    id                  TEXT PRIMARY KEY,
    tenant_id           TEXT NOT NULL,

    -- Link to Canonical Spine (always)
    entity_type         TEXT NOT NULL,              -- 'account', 'person', 'organization', etc.
    canonical_id        TEXT NOT NULL,              -- stable identity in the Spine

    -- Memory content: AI-generated insight
    insight_type        TEXT,                       -- 'pattern', 'anomaly', 'opportunity', 'trend', 'risk', 'cross_signal'
    title               TEXT NOT NULL,                -- brief human-readable title of the insight
    summary             TEXT,                       -- concise generated summary
    reasoning           TEXT,                       -- LLM-generated or heuristic explanation
    supporting_evidence JSON NOT NULL DEFAULT '[]', -- [{ source, record_id, quote, url, confidence }]
    related_entities    JSON NOT NULL DEFAULT '[]', -- [{ entity_type, canonical_id, relation }]

    -- Memory metadata
    confidence          REAL NOT NULL DEFAULT 0.5,  -- 0.0–1.0
    generated_by        TEXT NOT NULL,              -- agent name + model version + heuristic name
    episode_id          TEXT,                       -- link to the OODA cycle / Signal→Think→Act episode that produced this insight
    ttl_days            INTEGER NOT NULL DEFAULT 7, -- Insights TTL = 7 days (SPINE_DOMAIN.md §4.1)

    -- Time bounding (append-only refresh; valid_until is set on replacement)
    valid_from          INTEGER,                    -- Unix timestamp when this insight became current
    valid_until         INTEGER,                    -- NULL = current; set to Unix timestamp on refresh/invalidation
    created_at          INTEGER                     -- Unix timestamp when this row was generated
);

-- Indexes for fast lookup of current insights by Spine entity and by episode
CREATE INDEX IF NOT EXISTS idx_memory_insights_tenant_entity
    ON memory_insights (tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_memory_insights_tenant_episode
    ON memory_insights (tenant_id, episode_id);

CREATE INDEX IF NOT EXISTS idx_memory_insights_tenant_type
    ON memory_insights (tenant_id, insight_type)
    WHERE valid_until IS NULL;
