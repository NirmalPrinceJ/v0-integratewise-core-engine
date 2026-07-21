-- =============================================================================
-- spine_signals
-- =============================================================================
-- Table:         spine_signals
-- Description:   Platform-level operational primitive representing events,
--                 notifications, alerts, and commands flowing through the
--                 IntegrateWise platform. Signals enable event-driven
--                 communication between entities and subsystems, acting as
--                 the primary mechanism for decoupled, asynchronous
--                 cross-domain communication.
--
--                 Signals are tenant-scoped and may be targeted at specific
--                 entities (via source/target routing) or broadcast via
--                 channels (webhook, email, in-app, push, SMS). They carry
--                 universal platform-level business truth: classification,
--                 severity, lifecycle status, routing, delivery state, and
--                 content. All signals carry provenance metadata tracking
--                 their origin.
--
-- Inherits:      Operational Primitive (one of 7 platform operational primitives)
-- Pattern:        id, tenant_id, canonical_id, version, business truth, provenance,
--                 created_at, updated_at
-- Relationships:  Stored in spine_relationships (typed edge table); no JSON edges
-- Target:        Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_signals (
    -- Identity & versioning (platform standard pattern)
    id            INTEGER PRIMARY KEY AUTOINCREMENT,      -- Surrogate key; canonical_id is the stable business identifier
    tenant_id     TEXT NOT NULL,                            -- Tenant scope; all signals belong to a tenant
    canonical_id  TEXT NOT NULL,                            -- Stable business identifier (UUID v4)
    version       INTEGER NOT NULL DEFAULT 1,               -- Optimistic locking version; increments on every update

    -- Business truth columns (typed, no JSONB)
    -- These columns represent the universal, platform-level attributes of a signal.
    -- Domain-specific columns (e.g., cs_score, churn_risk) belong in Dynamic Memory, not here.

    -- Classification
    signal_type       TEXT NOT NULL,                        -- Signal taxonomy: 'event', 'alert', 'notification', 'command', 'webhook'
    signal_category   TEXT,                                 -- Domain scope: 'platform', 'system', 'business', 'integration', 'security', 'user'
    severity          TEXT,                                 -- Urgency/importance: 'critical', 'high', 'medium', 'low', 'info'

    -- Lifecycle
    status            TEXT NOT NULL DEFAULT 'pending',      -- Signal state: 'pending', 'processing', 'delivered', 'acknowledged', 'dismissed', 'failed', 'expired'
    retry_count       INTEGER NOT NULL DEFAULT 0,           -- Number of delivery retry attempts

    -- Routing (typed references to source and target entities)
    source_entity_type TEXT,                                -- Entity type that generated the signal (e.g., 'spine_processes', 'spine_persons')
    source_entity_id   TEXT,                                -- Canonical ID of the source entity
    target_entity_type TEXT,                                -- Entity type that should receive the signal
    target_entity_id   TEXT,                                -- Canonical ID of the target entity
    channel            TEXT,                                -- Delivery channel: 'in_app', 'webhook', 'email', 'sms', 'push', 'api'
    correlation_id     TEXT,                                -- Groups related signals for tracing and correlation

    -- Content
    title             TEXT,                                 -- Brief, human-readable signal title
    message           TEXT,                                 -- Human-readable message body

    -- Timing
    scheduled_at      TEXT,                                 -- ISO 8601 timestamp when the signal should be delivered (NULL = immediate)
    delivered_at      TEXT,                                 -- ISO 8601 timestamp when the signal was delivered
    acknowledged_at   TEXT,                                 -- ISO 8601 timestamp when the signal was acknowledged by the recipient
    expires_at        TEXT,                                 -- ISO 8601 timestamp when the signal expires and should be dismissed

    -- Provenance: JSON object { source, record_id, actor }
    -- Tracks the origin of this record for audit, lineage, and sync reconciliation.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'import', 'webhook', 'migration', 'system')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance        TEXT NOT NULL,

    -- Audit timestamps (ISO 8601 format in UTC)
    created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Constraints
    UNIQUE(tenant_id, canonical_id),                      -- Canonical ID is unique within a tenant scope
    CHECK(version >= 1),                                    -- Version must be positive
    CHECK(status IN ('pending', 'processing', 'delivered', 'acknowledged', 'dismissed', 'failed', 'expired')),
    CHECK(severity IS NULL OR severity IN ('critical', 'high', 'medium', 'low', 'info'))
);

-- Indexes for efficient querying
-- Standard spine lookup: retrieve a signal by its stable business identifier within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_signals_tenant_canonical
    ON spine_signals(tenant_id, canonical_id);

-- Versioned queries: filter or sort by version within a tenant (e.g., optimistic locking checks)
CREATE INDEX IF NOT EXISTS idx_spine_signals_tenant_version
    ON spine_signals(tenant_id, version);

-- Status filtering: list pending signals, bulk operations on failed signals, etc.
CREATE INDEX IF NOT EXISTS idx_spine_signals_status
    ON spine_signals(tenant_id, status);

-- Type filtering: query signals by classification within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_signals_type
    ON spine_signals(tenant_id, signal_type);

-- Source lookup: find all signals generated by a specific entity
CREATE INDEX IF NOT EXISTS idx_spine_signals_source
    ON spine_signals(tenant_id, source_entity_type, source_entity_id);

-- Target lookup: find all signals directed at a specific entity
CREATE INDEX IF NOT EXISTS idx_spine_signals_target
    ON spine_signals(tenant_id, target_entity_type, target_entity_id);

-- Scheduled delivery: find signals ready for delivery or pending by schedule
CREATE INDEX IF NOT EXISTS idx_spine_signals_scheduled
    ON spine_signals(tenant_id, scheduled_at, status);

-- Temporal queries: filter signals by creation time within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_signals_created
    ON spine_signals(tenant_id, created_at);

-- Correlation: group or trace related signals by correlation ID
CREATE INDEX IF NOT EXISTS idx_spine_signals_correlation
    ON spine_signals(tenant_id, correlation_id);
