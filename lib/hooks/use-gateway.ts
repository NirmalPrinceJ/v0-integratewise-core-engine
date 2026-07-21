/**
 * useGateway — single hook that gives every view access to the Platform API.
 * Replaces all supabase/use-data imports across views.
 *
 * Usage:
 *   const { workbench, entities, connectors, loading, error } = useGateway('SALES')
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth, useOrganization } from '@clerk/nextjs'
import { IntegrateWiseClient } from '@/lib/integratewise/client'
import type {
  SharedWorkbench,
  SpineEntity,
  EntityType,
  Department,
  IntegrationConnection,
  Capability,
} from '@/lib/integratewise/types'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.dev.integratewise.ai'

// ── singleton client per session ───────────────────────────────────────────
let _client: IntegrateWiseClient | null = null

function getOrCreateClient(token: string, tenantId: string, userId?: string) {
  if (
    _client &&
    (_client as any).token === token &&
    (_client as any).tenantId === tenantId
  ) {
    return _client
  }
  _client = new IntegrateWiseClient({ baseUrl: GATEWAY_URL, token, tenantId, userId })
  return _client
}

// ── auth resolution ────────────────────────────────────────────────────────
export function useIWAuth() {
  const { getToken, userId } = useAuth()
  const { organization } = useOrganization()

  const [token, setToken] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function resolve() {
      try {
        const t = await getToken()
        if (cancelled || !t) return
        const tid = organization?.id || `tenant_${userId}`
        setToken(t)
        setTenantId(tid)
        setReady(true)
      } catch {
        // not authenticated yet
      }
    }
    resolve()
    return () => { cancelled = true }
  }, [getToken, userId, organization])

  return { token, tenantId, userId: userId ?? undefined, ready }
}

// ── main workbench hook ────────────────────────────────────────────────────
export function useGateway(department: Department = 'BIZOPS') {
  const { token, tenantId, userId, ready } = useIWAuth()
  const [workbench, setWorkbench] = useState<SharedWorkbench | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    setLoading(true)
    try {
      const data = await client.getWorkbench(department)
      setWorkbench(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load workbench')
    } finally {
      setLoading(false)
    }
  }, [token, tenantId, userId, department])

  useEffect(() => {
    if (ready) reload()
  }, [ready, reload])

  // convenience accessors
  const entities = workbench?.entities ?? {}
  const signals  = workbench?.signals  ?? []
  const timeline = workbench?.timeline ?? []

  return { workbench, entities, signals, timeline, loading, error, reload }
}

// ── entity-type hook ───────────────────────────────────────────────────────
export function useEntities(type: EntityType, limit = 50) {
  const { token, tenantId, userId, ready } = useIWAuth()
  const [entities, setEntities] = useState<SpineEntity[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    setLoading(true)
    try {
      const { entities: data } = await client.getEntities(type, limit)
      setEntities(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load entities')
    } finally {
      setLoading(false)
    }
  }, [token, tenantId, userId, type, limit])

  useEffect(() => {
    if (ready) reload()
  }, [ready, reload])

  return { entities, loading, error, reload }
}

// ── connectors hook ────────────────────────────────────────────────────────
export function useConnectors() {
  const { token, tenantId, userId, ready } = useIWAuth()
  const [connectors, setConnectors] = useState<IntegrationConnection[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    setLoading(true)
    try {
      const data = await client.getIntegrations()
      setConnectors(Array.isArray(data) ? data : [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load connectors')
    } finally {
      setLoading(false)
    }
  }, [token, tenantId, userId])

  useEffect(() => {
    if (ready) reload()
  }, [ready, reload])

  const connect = useCallback(async (provider: string) => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    const { auth_url } = await client.startConnectorAuth(provider)
    window.location.href = auth_url
  }, [token, tenantId, userId])

  const disconnect = useCallback(async (provider: string) => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    await client.disconnectIntegration(provider)
    reload()
  }, [token, tenantId, userId, reload])

  return { connectors, loading, error, reload, connect, disconnect }
}

// ── capabilities hook ──────────────────────────────────────────────────────
export function useCapabilities() {
  const { token, tenantId, userId, ready } = useIWAuth()
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [loading, setLoading]           = useState(true)

  const reload = useCallback(async () => {
    if (!token || !tenantId) return
    const client = getOrCreateClient(token, tenantId, userId)
    setLoading(true)
    try {
      const { capabilities: data } = await client.getCapabilities()
      setCapabilities(data)
    } catch {
      setCapabilities([])
    } finally {
      setLoading(false)
    }
  }, [token, tenantId, userId])

  useEffect(() => {
    if (ready) reload()
  }, [ready, reload])

  const execute = useCallback(async (capabilityId: string, params: Record<string, unknown> = {}) => {
    if (!token || !tenantId) throw new Error('Not authenticated')
    const client = getOrCreateClient(token, tenantId, userId)
    return client.executeCapability(capabilityId, params)
  }, [token, tenantId, userId])

  return { capabilities, loading, execute }
}

// ── write: store in spine ─────────────────────────────────────────────────
export function useSpineWrite() {
  const { token, tenantId, userId } = useIWAuth()

  const propose = useCallback(async (payload: {
    type: 'fact' | 'decision' | 'commitment' | 'learning' | 'episode'
    content: string
    entity_refs?: string[]
    confidence?: number
    source: string
  }) => {
    if (!token || !tenantId) throw new Error('Not authenticated')
    // Calls POST /api/v1/twin/handoff — the memory.propose path
    const client = getOrCreateClient(token, tenantId, userId)
    return (client as any).request('POST', '/api/v1/twin/handoff', {
      proposal: payload,
      context: { source: payload.source },
    })
  }, [token, tenantId, userId])

  return { propose }
}
