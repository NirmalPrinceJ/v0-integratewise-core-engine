-- ============================================================================
-- Entity:        memory_stakeholder_intelligence
-- Layer:         Dynamic Memory (Layer 2)
-- TTL:           14 days
-- Purpose:       Tracks "who matters and why" — derived intelligence about
--                stakeholder influence, engagement patterns, decision authority,
--                and relationship risks within an account.
-- Sources:       Org chart, engagement frequency, meeting participation,
--                decision influence, email/slack interaction patterns.
-- Domain:        account_success
-- Source Docs:   SPINE_DOMAIN.md §4.1, §4.3
--                 SPINE_INTELLIGENCE_AGENT.md §7, §10
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_stakeholder_intelligence (
    id                  TEXT PRIMARY KEY,
    tenant_id           TEXT NOT NULL,
    -- Link to Spine (always)
    entity_type         TEXT NOT NULL,              -- 'person', 'account', etc.
    canonical_id        TEXT NOT NULL,              -- stable identity in Spine
    -- Memory content
    influence_score     REAL,                       -- 0.0–1.0 decision influence
    influence_label     TEXT,                       -- 'champion', 'decision_maker', 'influencer', 'blocker', 'observer'
    engagement_frequency TEXT,                     -- 'daily', 'weekly', 'monthly', 'quarterly', 'rarely'
    role_assessment     TEXT,                       -- 'economic_buyer', 'technical_buyer', 'user', 'executive_sponsor'
    is_decision_maker   INTEGER,                    -- 0 = false, 1 = true
    is_champion         INTEGER,                    -- 0 = false, 1 = true
    is_at_risk          INTEGER,                    -- 0 = false, 1 = true (relationship at risk)
    reporting_chain     TEXT,                       -- e.g. "reports_to:{canonical_id}"
    relationships       JSON NOT NULL DEFAULT '[]', -- [{ stakeholder_canonical_id, relation_type, strength }]
    reasoning           TEXT,                       -- LLM-generated or heuristic explanation
    contributing_factors JSON NOT NULL DEFAULT '[]', -- [{ factor, weight, source }]
    evidence            JSON NOT NULL DEFAULT '[]', -- [{ link, metric, quote, snapshot }]
    -- Memory metadata
    confidence          REAL NOT NULL DEFAULT 0.5,  -- 0.0–1.0
    generated_by        TEXT NOT NULL,              -- agent/model/heuristic name + version
    episode_id          TEXT,                       -- link to OODA cycle that produced this
    ttl_days            INTEGER NOT NULL DEFAULT 14, -- Stakeholder Intelligence TTL (SPINE_DOMAIN.md §4.1)
    -- Time bounding
    valid_from          INTEGER,                    -- Unix timestamp; when this memory became valid
    valid_until         INTEGER,                    -- NULL = current; set on refresh/overwrite
    created_at          INTEGER                     -- Unix timestamp
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_intelligence_tenant_entity
    ON memory_stakeholder_intelligence(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_intelligence_episode
    ON memory_stakeholder_intelligence(tenant_id, episode_id);

CREATE INDEX IF NOT EXISTS idx_memory_stakeholder_intelligence_influence_score
    ON memory_stakeholder_intelligence(tenant_id, influence_score)
    WHERE valid_until IS NULL;
