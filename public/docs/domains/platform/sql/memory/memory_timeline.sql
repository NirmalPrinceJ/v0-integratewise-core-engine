-- IntegrateWise Platform — Dynamic Memory Layer
-- Spine Domain: memory_timeline
-- Target: Cloudflare D1 (SQLite-compatible)
-- Generated: Spine Domain Architect
--
-- TABLE PURPOSE:
--   memory_timeline is the core event-sourced ledger for all ephemeral,
--   opinionated, AI-generated memory in the Dynamic Memory layer.
--   It records every memory artifact produced across the 8-layer pipeline
--   (L1 Twin → L2 Intake → L3 Triage → L4 Evolution → L5 Promotion Queue
--   → L6 Approval → L7 Organizational → L8 Knowledge) as well as domain-
--   specific memories (health, risk, sentiment, etc.) derived from platform
--   signals.
--
--   This is NOT the source of truth. Every row references a canonical entity
--   in the Spine via (canonical_id, entity_type). Memories are graph-native
--   (edges can reference other memory records or Spine entities), projection-
--   friendly (sliceable by team, role, and time horizon), and event-sourced
--   (each memory links to an OODA episode via episode_id).
--
--   LAYER CLASSIFICATION:
--   - L1 (twin):     Twin state snapshots, real-time inferred state
--   - L2 (intake):   Raw intake observations, unprocessed signal
--   - L3 (triage):   Classified, scored, routed observations
--   - L4 (evolution): Evolved, enriched, contextualized understanding
--   - L5 (promotion): Queued candidates for promotion to persistent knowledge
--   - L6 (approval):  Human-reviewed, approved memories with persistent TTL
--   - L7 (organizational): Team/role-specific shared context
--   - L8 (knowledge): Institutional knowledge, long-term memory
--   - Domain-specific: health, risk, sentiment, and other derived signal memories
--
-- DESIGN RULES ENFORCED:
--   - No JSONB for core business data; structured fields are typed columns.
--   - Every memory MUST reference a Spine entity via (canonical_id, entity_type).
--   - Confidence is required and bounded [0.0, 1.0].
--   - generated_by is required (identifies the AI agent/system that produced this memory).
--   - TTL and expires_at are required for all memory types.
--     For L6-L8 (persistent memories), TTL is set to 0 (infinite / persistent).
--   - All timestamps are INTEGER Unix epoch seconds for D1 compatibility.
--   - id is a UUIDv4 text primary key (no AUTOINCREMENT).
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_timeline (
    id              TEXT PRIMARY KEY,               -- UUIDv4: unique memory record identity
    tenant_id       TEXT NOT NULL,                  -- Multi-tenant partition key
    canonical_id    TEXT NOT NULL,                  -- Spine entity UUID (canonical source of truth)
    entity_type     TEXT NOT NULL,                  -- Spine entity type (e.g., 'twin', 'episode', 'signal', 'user', 'team')
    version         INTEGER NOT NULL DEFAULT 1,     -- Optimistic concurrency / memory versioning
    confidence      REAL NOT NULL,                   -- 0.0 = no confidence, 1.0 = absolute certainty
    generated_by    TEXT NOT NULL,                  -- Agent/system identifier that produced this memory (e.g., 'agent:twin-synthesizer', 'system:intake-pipeline')
    episode_id      TEXT NOT NULL,                  -- OODA cycle episode reference (event sourcing anchor)
    memory_type     TEXT NOT NULL,                   -- L1-L8 or domain-specific classification
    status          TEXT NOT NULL,                   -- Lifecycle state of the memory record
    content         TEXT NOT NULL,                   -- Human-readable memory content (narrative, summary, or structured text)
    provenance      TEXT NOT NULL,                   -- Audit trail: source signals, upstream memory IDs, or ingestion metadata
    TTL             INTEGER NOT NULL,                 -- Time-to-live in seconds. 0 = persistent (L6-L8 only)
    expires_at      INTEGER NOT NULL,                -- Unix epoch seconds when this memory becomes invalid
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- Unix epoch seconds: record creation
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- Unix epoch seconds: last modification

    -- -------------------------------------------------------------------------
    -- CONSTRAINTS
    -- -------------------------------------------------------------------------
    CONSTRAINT chk_memory_timeline_confidence_range
        CHECK (confidence >= 0.0 AND confidence <= 1.0),

    CONSTRAINT chk_memory_timeline_memory_type
        CHECK (memory_type IN (
            'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8',
            'health', 'risk', 'sentiment', 'domain'
        )),

    CONSTRAINT chk_memory_timeline_status
        CHECK (status IN (
            'active', 'expired', 'superseded', 'archived', 'pending', 'rejected'
        )),

    CONSTRAINT chk_memory_timeline_ttl_non_negative
        CHECK (TTL >= 0),

    CONSTRAINT chk_memory_timeline_timestamps
        CHECK (created_at <= updated_at AND updated_at <= expires_at)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- These indexes are optimized for the most common query patterns in the
-- Dynamic Memory layer: Spine entity lookups, type filtering, status filtering,
-- confidence scoring, and TTL-based eviction.

-- Query pattern: Fetch all memory for a specific Spine entity within a tenant
CREATE INDEX IF NOT EXISTS idx_mem_timeline_tenant_canonical
    ON memory_timeline(tenant_id, canonical_id);

-- Query pattern: Fetch all memory of a specific entity type within a tenant
CREATE INDEX IF NOT EXISTS idx_mem_timeline_tenant_entity
    ON memory_timeline(tenant_id, entity_type);

-- Query pattern: Fetch all memory of a specific memory type (e.g., all L3 triage) within a tenant
CREATE INDEX IF NOT EXISTS idx_mem_timeline_tenant_memory
    ON memory_timeline(tenant_id, memory_type);

-- Query pattern: Fetch all memory by status (e.g., all 'active' or 'pending') within a tenant
CREATE INDEX IF NOT EXISTS idx_mem_timeline_tenant_status
    ON memory_timeline(tenant_id, status);

-- Query pattern: Rank or filter memory for a Spine entity by confidence score
CREATE INDEX IF NOT EXISTS idx_mem_timeline_canonical_conf
    ON memory_timeline(canonical_id, confidence);

-- Query pattern: TTL eviction sweep, expiration queries, and time-horizon projections
CREATE INDEX IF NOT EXISTS idx_mem_timeline_tenant_expires
    ON memory_timeline(tenant_id, expires_at);
