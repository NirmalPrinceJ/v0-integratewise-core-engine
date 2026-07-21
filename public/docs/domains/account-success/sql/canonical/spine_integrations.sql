-- ============================================================================
-- Entity: spine_integrations
-- Layer: Canonical Spine (Immutable Business Truth)
-- Purpose: Represents a real-world connection between systems — an integration
--          endpoint, API, webhook, or data flow that the business operates on.
--          Sources: integration platform, API gateway, manual entry, CMDB.
-- Source:  SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- ============================================================================

CREATE TABLE IF NOT EXISTS spine_integrations (
    id                  TEXT PRIMARY KEY,                     -- UUID as text; assigned by the pipeline
    tenant_id           TEXT NOT NULL,                        -- tenant isolation
    canonical_id        TEXT NOT NULL,                        -- stable identity; survives merges
    version             INTEGER NOT NULL DEFAULT 1,           -- append-only versioning

    -- Immutable business truth
    name                    TEXT NOT NULL,                    -- human-readable integration name
    description             TEXT,                           -- what this integration does
    integration_type        TEXT NOT NULL,                    -- REST, GraphQL, Webhook, EventStream, Database, FileTransfer
    protocol                TEXT,                            -- HTTPS, HTTP, gRPC, WebSocket, SFTP
    base_url                TEXT,                            -- base endpoint or connection string
    auth_type               TEXT,                            -- api_key, oauth2, basic_auth, bearer_token, mTLS, none
    api_version             TEXT,                            -- version identifier (e.g. "v2", "2024-01")
    status                  TEXT NOT NULL DEFAULT 'active',   -- active, beta, deprecated, planned, sunset, retired
    documentation_url       TEXT,                            -- link to integration docs
    owner_team              TEXT,                            -- team responsible for this integration
    vendor                  TEXT,                            -- external vendor or provider name
    product                 TEXT,                            -- product/system this integration connects to
    schema_format           TEXT,                            -- OpenAPI, GraphQL, AsyncAPI, WSDL, JSONSchema
    schema_url              TEXT,                            -- link to schema definition
    health_check_url        TEXT,                            -- endpoint for health / readiness probe
    rate_limit_rpm          INTEGER,                        -- requests per minute quota
    timeout_seconds         INTEGER,                        -- default request timeout
    retry_policy            TEXT,                            -- exponential_backoff, linear, none, custom
    data_classification     TEXT,                            -- public, internal, confidential, restricted
    compliance_tags         TEXT,                            -- comma-separated tags: SOC2, GDPR, HIPAA, etc.
    last_tested_at          INTEGER,                        -- Unix timestamp of last connectivity test
    test_status             TEXT,                            -- pass, fail, pending, unknown

    -- System
    provenance          JSON NOT NULL DEFAULT '{}',         -- { source: 'api_gateway', record_id: '...' }
    created_at          INTEGER,                            -- Unix timestamp
    updated_at          INTEGER                             -- Unix timestamp
);

-- Indexes for tenant-scoped queries and versioned lookups
CREATE INDEX IF NOT EXISTS idx_spine_integrations_tenant_canonical
    ON spine_integrations(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_integrations_tenant_version
    ON spine_integrations(tenant_id, canonical_id, version);

-- Index for common filter: active integrations by type
CREATE INDEX IF NOT EXISTS idx_spine_integrations_tenant_status
    ON spine_integrations(tenant_id, status);
