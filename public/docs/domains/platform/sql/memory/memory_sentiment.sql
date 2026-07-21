-- =============================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Table: memory_sentiment
-- =============================================================================
-- Domain: Sentiment Analysis Memory (Domain-Specific)
-- Layer: Derived from L2 (Intake) / L3 (Triage) signals; domain-specific
--        projection for opinionated, AI-generated sentiment assessments.
--
-- Description:
--   Captures ephemeral, opinionated sentiment signals derived from platform
--   intake (L2) and triage (L3) data. Each record links to a canonical Spine
--   entity via canonical_id + entity_type and is scoped to a tenant.
--   Sentiment memory is projection-friendly: sliceable by team, role, and
--   time horizon. It is event-sourced via episode_id and carries a TTL for
--   automatic expiration. All sentiment memory is opinionated and non-canonical.
--
-- Schema Rules:
--   - References Spine via canonical_id + entity_type (NOT NULL)
--   - Confidence is required (0.0–1.0)
--   - generated_by is required (agent/system identifier)
--   - episode_id is required (links to OODA cycle event sourcing)
--   - TTL + expires_at are required (domain-specific; finite TTL expected)
--   - No JSONB for structured data; use typed columns
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_sentiment (
    -- Primary key (UUIDv4)
    id              TEXT        PRIMARY KEY,

    -- Multi-tenancy
    tenant_id       TEXT        NOT NULL,

    -- Spine canonical reference (every memory MUST link to a Spine entity)
    canonical_id    TEXT        NOT NULL,
    entity_type     TEXT        NOT NULL,

    -- Optimistic versioning for concurrency control
    version         INTEGER     NOT NULL DEFAULT 1,

    -- Memory classification (standard pipeline column)
    memory_type     TEXT        NOT NULL DEFAULT 'sentiment',

    -- Memory lifecycle status
    status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'expired', 'superseded', 'rejected', 'staged')),

    -- Opinionated confidence score (0.0 = no confidence, 1.0 = maximum confidence)
    confidence      REAL        NOT NULL
                    CHECK (confidence >= 0.0 AND confidence <= 1.0),

    -- Agent/system that generated this memory
    generated_by    TEXT        NOT NULL,

    -- Event sourcing: links to the OODA cycle episode that produced this memory
    episode_id      TEXT        NOT NULL,

    -- -------------------------------------------------------------------------
    -- Domain-specific sentiment columns
    -- -------------------------------------------------------------------------

    -- Normalized sentiment score (e.g., -1.0 strongly negative to +1.0 strongly positive)
    sentiment_score REAL
                    CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),

    -- Categorical sentiment label (e.g., 'positive', 'negative', 'neutral', 'mixed')
    sentiment_label TEXT
                    CHECK (sentiment_label IN ('positive', 'negative', 'neutral', 'mixed', 'unknown')),

    -- The raw or normalized source text that was analyzed
    source_text     TEXT,

    -- Origin of the analyzed text (e.g., 'email', 'support_ticket', 'chat', 'review', 'survey', 'social')
    source_type     TEXT,

    -- ISO 639-1 language code of the source text (e.g., 'en', 'zh', 'es')
    language        TEXT,

    -- Specific aspect or facet the sentiment targets (e.g., 'product_quality', 'customer_service')
    target_aspect   TEXT,

    -- -------------------------------------------------------------------------
    -- Content & provenance
    -- -------------------------------------------------------------------------

    -- Human-readable summary or narrative of the sentiment assessment
    content         TEXT,

    -- Provenance / traceability: system, model, or pipeline version that produced this record
    provenance      TEXT,

    -- -------------------------------------------------------------------------
    -- TTL & expiry
    -- -------------------------------------------------------------------------

    -- Time-to-live in seconds (domain-specific memories are ephemeral; use -1 for persistent override)
    TTL             INTEGER     NOT NULL
                    CHECK (TTL >= -1),

    -- Absolute expiration timestamp (UTC)
    expires_at      DATETIME    NOT NULL,

    -- -------------------------------------------------------------------------
    -- Audit timestamps
    -- -------------------------------------------------------------------------
    created_at      DATETIME    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      DATETIME    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Tenant + canonical entity lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_canonical
    ON memory_sentiment (tenant_id, canonical_id);

-- Tenant + entity type (projection by entity category)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_entity_type
    ON memory_sentiment (tenant_id, entity_type);

-- Tenant + memory type (projection by memory classification)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_memory_type
    ON memory_sentiment (tenant_id, memory_type);

-- Tenant + status (projection by lifecycle state)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_status
    ON memory_sentiment (tenant_id, status);

-- Canonical + confidence (ranking best opinions per entity)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_canonical_confidence
    ON memory_sentiment (canonical_id, confidence DESC);

-- Tenant + expiration (sweep queries for TTL cleanup)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_expires
    ON memory_sentiment (tenant_id, expires_at);

-- Optional: composite index for sentiment-specific projections (tenant + label + score)
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_tenant_label_score
    ON memory_sentiment (tenant_id, sentiment_label, sentiment_score DESC);

-- Optional: episode-based lookup for event sourcing replay
CREATE INDEX IF NOT EXISTS idx_memory_sentiment_episode
    ON memory_sentiment (episode_id);
