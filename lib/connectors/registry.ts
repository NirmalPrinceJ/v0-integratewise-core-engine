/**
 * Tenant-Level Connector Registry
 * 
 * All connectors are stored and managed at the tenant level.
 * Every frontend (Customer Zero, Marketplace, Admin, Twin) accesses the same registry.
 * No duplication, single source of truth.
 */

import type { TenantConnector, ConnectorWebhook, ConnectorSync } from '@/lib/types/connectors'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const connectorCache = new Map<string, { data: TenantConnector[]; timestamp: number }>()

function getCacheKey(tenantId: string): string {
  return `connectors:${tenantId}`
}

function getCached(tenantId: string): TenantConnector[] | null {
  const key = getCacheKey(tenantId)
  const entry = connectorCache.get(key)

  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    connectorCache.delete(key)
    return null
  }

  return entry.data
}

function setCache(tenantId: string, connectors: TenantConnector[]): TenantConnector[] {
  const key = getCacheKey(tenantId)
  connectorCache.set(key, { data: connectors, timestamp: Date.now() })
  return connectors
}

function invalidateCache(tenantId: string): void {
  const key = getCacheKey(tenantId)
  connectorCache.delete(key)
}

/**
 * Get all connectors for a tenant
 * Accessed by: Customer Zero, Marketplace, Admin, Twin, Capabilities
 */
export async function getTenantConnectors(
  tenantId: string,
  filter?: { status?: string; provider?: string }
): Promise<TenantConnector[]> {
  // Check cache
  const cached = getCached(tenantId)
  if (cached) {
    return filter ? filterConnectors(cached, filter) : cached
  }

  try {
    const response = await fetch(
      `/api/connectors?tenantId=${tenantId}${filter?.status ? `&status=${filter.status}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch connectors: ${response.statusText}`)
    }

    const data = await response.json()
    const connectors = data.connectors || []

    return setCache(tenantId, connectors)
  } catch (error) {
    console.error('[v0] Failed to fetch tenant connectors:', error)
    return []
  }
}

/**
 * Get a specific connector by ID
 */
export async function getTenantConnector(
  tenantId: string,
  connectorId: string
): Promise<TenantConnector | null> {
  try {
    const response = await fetch(`/api/connectors/${connectorId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.connector || null
  } catch (error) {
    console.error('[v0] Failed to fetch connector:', error)
    return null
  }
}

/**
 * Create a new connector (store at tenant level)
 */
export async function createTenantConnector(
  tenantId: string,
  connector: Omit<TenantConnector, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TenantConnector | null> {
  try {
    const response = await fetch('/api/connectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(connector),
    })

    if (!response.ok) {
      throw new Error(`Failed to create connector: ${response.statusText}`)
    }

    const data = await response.json()
    invalidateCache(tenantId)
    return data.connector || null
  } catch (error) {
    console.error('[v0] Failed to create connector:', error)
    return null
  }
}

/**
 * Update a connector
 */
export async function updateTenantConnector(
  tenantId: string,
  connectorId: string,
  updates: Partial<TenantConnector>
): Promise<TenantConnector | null> {
  try {
    const response = await fetch(`/api/connectors/${connectorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Failed to update connector: ${response.statusText}`)
    }

    const data = await response.json()
    invalidateCache(tenantId)
    return data.connector || null
  } catch (error) {
    console.error('[v0] Failed to update connector:', error)
    return null
  }
}

/**
 * Delete a connector
 */
export async function deleteTenantConnector(
  tenantId: string,
  connectorId: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/connectors/${connectorId}`, {
      method: 'DELETE',
      headers: {
        'x-tenant-id': tenantId,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete connector: ${response.statusText}`)
    }

    invalidateCache(tenantId)
    return true
  } catch (error) {
    console.error('[v0] Failed to delete connector:', error)
    return false
  }
}

/**
 * Get connector webhooks
 */
export async function getConnectorWebhooks(
  tenantId: string,
  connectorId: string
): Promise<ConnectorWebhook[]> {
  try {
    const response = await fetch(
      `/api/connectors/${connectorId}/webhooks`,
      {
        headers: {
          'x-tenant-id': tenantId,
        },
      }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.webhooks || []
  } catch (error) {
    console.error('[v0] Failed to fetch webhooks:', error)
    return []
  }
}

/**
 * Get connector sync status
 */
export async function getConnectorSync(
  tenantId: string,
  connectorId: string
): Promise<ConnectorSync | null> {
  try {
    const response = await fetch(
      `/api/connectors/${connectorId}/sync`,
      {
        headers: {
          'x-tenant-id': tenantId,
        },
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.sync || null
  } catch (error) {
    console.error('[v0] Failed to fetch sync:', error)
    return null
  }
}

/**
 * Helper: filter connectors by criteria
 */
function filterConnectors(
  connectors: TenantConnector[],
  filter: { status?: string; provider?: string }
): TenantConnector[] {
  return connectors.filter((c) => {
    if (filter.status && c.status !== filter.status) return false
    if (filter.provider && c.provider !== filter.provider) return false
    return true
  })
}
