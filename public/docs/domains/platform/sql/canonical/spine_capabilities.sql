-- spine_capabilities.sql
-- IntegrateWise Platform Canonical Spine
-- Target: Cloudflare D1 (SQLite-compatible)
-- 
-- Entity: Capability
-- Represents a platform-level capability or feature that can be enabled, configured,
-- and provisioned to tenants. Capabilities are the atomic units of platform functionality
-- — they describe what the platform CAN do, not what a specific tenant has configured.
-- Examples: "CRM Sync", "Advanced Analytics", "Multi-tenancy", "API Gateway Access",
-- "Custom Fields", "Workflow Engine", "Audit Logging", "Integration Hub".
-- 
-- Capabilities are part of the 7 operational primitives in the platform spine model.
-- They serve as the declarative registry of all functional building blocks available
-- across the platform, independent of any tenant's actual subscription or configuration.

CREATE TABLE IF NOT EXISTS spine_capabilities (
    -- Identity & Versioning
    id TEXT PRIMARY KEY NOT NULL,
    -- Every record belongs to a tenant. Platform-wide records use the system tenant.
    tenant_id TEXT NOT NULL,
    -- The business canonical identifier. Stable across versions. Used for spine relationships.
    canonical_id TEXT NOT NULL,
    -- Version counter for optimistic concurrency / audit trail.
    version INTEGER NOT NULL DEFAULT 1,

    -- Business Truth (typed columns only — no JSONB for business data)
    -- Machine-friendly identifier: e.g. "crm.sync", "analytics.dashboard", "workflow.engine"
    name TEXT NOT NULL,
    -- Human-readable label for UI display
    display_name TEXT,
    -- Detailed description of what this capability provides
    description TEXT,
    -- Classification: 'platform', 'domain', 'integration', 'api', 'feature', 'extension'
    capability_type TEXT NOT NULL,
    -- Logical grouping: e.g. "CRM", "Analytics", "Settings", "Security", "Integrations"
    category TEXT,
    -- Lifecycle status: 'active', 'beta', 'deprecated', 'retired', 'preview'
    status TEXT NOT NULL DEFAULT 'active',
    -- Whether this capability is currently enabled for the tenant
    is_enabled INTEGER NOT NULL DEFAULT 1,
    -- Whether this is a core platform capability (always available)
    is_core INTEGER NOT NULL DEFAULT 0,
    -- Required subscription tier if not core: 'free', 'starter', 'pro', 'enterprise'
    required_tier TEXT,
    -- JSON Schema (as text) describing the configuration structure this capability accepts
    configuration_schema TEXT,
    -- Link to capability documentation
    documentation_url TEXT,
    -- Icon identifier for UI rendering
    icon TEXT,
    -- Display ordering within category
    sort_order INTEGER DEFAULT 0,

    -- Provenance (JSON with required shape: { source, record_id, actor })
    provenance TEXT NOT NULL,

    -- Audit Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Constraints
    UNIQUE (tenant_id, canonical_id)
);

-- Indexes for tenant-scoped queries and spine relationship lookups
CREATE INDEX IF NOT EXISTS idx_spine_capabilities_tenant_canonical
    ON spine_capabilities(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_capabilities_tenant_version
    ON spine_capabilities(tenant_id, version);

CREATE INDEX IF NOT EXISTS idx_spine_capabilities_tenant_type
    ON spine_capabilities(tenant_id, capability_type);

CREATE INDEX IF NOT EXISTS idx_spine_capabilities_tenant_status
    ON spine_capabilities(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_spine_capabilities_tenant_name
    ON spine_capabilities(tenant_id, name);
