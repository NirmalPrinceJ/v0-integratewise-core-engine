-- =============================================================================
-- spine_conversations
-- =============================================================================
-- Table:         spine_conversations
-- Description:   Platform-level canonical entity representing a generic thread
--                 of communication between two or more participants. A Conversation
--                 is a universal root concept in the IntegrateWise platform,
--                 applicable across all business domains (support, sales, marketing,
--                 operations, internal collaboration, etc.). It serves as the base
--                 type for any multi-message interaction record.
-- Inherits:      Root Concept (one of 16 platform root concepts)
-- Pattern:        id, tenant_id, canonical_id, version, business truth, provenance,
--                 created_at, updated_at
-- Relationships:  Stored in spine_relationships (typed edge table); no JSON edges
-- Target:        Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_conversations (
    -- Identity & Versioning (platform standard pattern)
    id            TEXT PRIMARY KEY,                       -- UUID v4, immutable
    tenant_id     TEXT NOT NULL,                          -- Tenant scope; every record belongs to a tenant
    canonical_id  TEXT NOT NULL,                          -- Stable business identifier, used for spine relationships
    version       INTEGER NOT NULL DEFAULT 1,             -- Optimistic locking version; increments on every update

    -- Business Truth Columns (typed, no JSONB)
    -- These columns represent the universal, platform-level attributes of a conversation.
    -- Domain-specific extensions (e.g., CSAT scores, churn risk, sentiment analysis)
    -- belong in Dynamic Memory, not in this table.
    subject           TEXT NOT NULL,                        -- Subject line or topic of the conversation
    status            TEXT NOT NULL DEFAULT 'active',       -- Lifecycle state: active, pending, closed, archived, draft
    conversation_type TEXT NOT NULL DEFAULT 'general',     -- Classification: support, sales, marketing, general, internal
    channel           TEXT NOT NULL DEFAULT 'unknown',     -- Communication channel: email, chat, sms, voice, in_app, social
    direction         TEXT NOT NULL DEFAULT 'inbound',     -- Message flow direction: inbound, outbound, internal
    priority          TEXT NOT NULL DEFAULT 'normal',     -- Urgency level: low, normal, high, urgent
    started_at        TEXT,                                 -- When the conversation began (ISO 8601)
    ended_at          TEXT,                                 -- When the conversation ended (ISO 8601); NULL if still open
    last_activity_at  TEXT,                                 -- Timestamp of most recent message or activity (ISO 8601)
    is_resolved       INTEGER NOT NULL DEFAULT 0,          -- Whether the conversation is resolved (0 = false, 1 = true)
    resolved_at       TEXT,                                 -- When the conversation was resolved (ISO 8601); NULL if unresolved

    -- Provenance: JSON object { source, record_id, actor }
    -- Tracks the origin of this record for audit, lineage, and sync reconciliation.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'import', 'webhook', 'migration')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance        TEXT NOT NULL,

    -- Audit Timestamps (ISO 8601 format in UTC)
    created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Constraints
    UNIQUE(tenant_id, canonical_id),                      -- Canonical ID is unique within a tenant scope
    CHECK(status IN ('active', 'pending', 'closed', 'archived', 'draft')),
    CHECK(conversation_type IN ('support', 'sales', 'marketing', 'general', 'internal')),
    CHECK(channel IN ('email', 'chat', 'sms', 'voice', 'in_app', 'social', 'unknown')),
    CHECK(direction IN ('inbound', 'outbound', 'internal')),
    CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    CHECK(is_resolved IN (0, 1)),
    CHECK(json_valid(provenance) = 1),
    CHECK(json_type(provenance, '$.source') IS NOT NULL),
    CHECK(json_type(provenance, '$.record_id') IS NOT NULL),
    CHECK(json_type(provenance, '$.actor') IS NOT NULL)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Standard spine lookup: retrieve a conversation by its stable business identifier within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_conversations_tenant_canonical
    ON spine_conversations(tenant_id, canonical_id);

-- Versioned queries: filter or sort by version within a tenant (e.g., optimistic locking checks)
CREATE INDEX IF NOT EXISTS idx_spine_conversations_tenant_version
    ON spine_conversations(tenant_id, version);

-- Status filtering: list active conversations, bulk operations on closed/archived conversations
CREATE INDEX IF NOT EXISTS idx_spine_conversations_tenant_status
    ON spine_conversations(tenant_id, status);

-- Type filtering: filter conversations by classification within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_conversations_tenant_type
    ON spine_conversations(tenant_id, conversation_type);

-- Recency queries: sort conversations by last activity within a tenant (inbox, dashboard)
CREATE INDEX IF NOT EXISTS idx_spine_conversations_tenant_last_activity
    ON spine_conversations(tenant_id, last_activity_at);

-- Temporal queries: find conversations started or active within a time range
CREATE INDEX IF NOT EXISTS idx_spine_conversations_started_at
    ON spine_conversations(started_at);

CREATE INDEX IF NOT EXISTS idx_spine_conversations_last_activity
    ON spine_conversations(last_activity_at);
