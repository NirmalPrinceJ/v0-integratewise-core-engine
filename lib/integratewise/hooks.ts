'use client'

import { useEffect, useState, useCallback } from 'react'
import type {
  SharedWorkbench,
  Department,
  Connector,
  IntegrationConnection,
  OnboardingState,
  SpineEntity,
  Capability,
} from './types'
import { IntegrateWiseClient } from './client'
import { getStoredSession, AuthSession } from './auth'

/**
 * Hook: Get stored auth session
 */
export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredSession()
    setSession(stored)
    setLoading(false)
  }, [])

  return { session, loading }
}

/**
 * Hook: Get workbench for a department
 */
export function useWorkbench(session: AuthSession | null, department: Department) {
  const [workbench, setWorkbench] = useState<SharedWorkbench | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
          userId: session.userId,
        })
        const data = await client.getWorkbench(department)
        setWorkbench(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workbench')
        setWorkbench(null)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session, department])

  return { workbench, loading, error }
}

/**
 * Hook: List connectors
 */
export function useConnectors(session: AuthSession | null) {
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
        })
        const data = await client.getConnectorCatalog()
        setConnectors(data.connectors)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load connectors')
        setConnectors([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session])

  const connect = useCallback(
    async (provider: string) => {
      if (!session) throw new Error('No session')

      const client = new IntegrateWiseClient({
        token: session.token,
        tenantId: session.tenantId,
      })

      const { auth_url } = await client.startConnectorAuth(provider)
      window.location.href = auth_url
    },
    [session]
  )

  const disconnect = useCallback(
    async (connectorId: string) => {
      if (!session) throw new Error('No session')

      const client = new IntegrateWiseClient({
        token: session.token,
        tenantId: session.tenantId,
      })

      await client.disconnectConnector(connectorId)
      // Refetch list
      const data = await client.getConnectorCatalog()
      setConnectors(data.connectors)
    },
    [session]
  )

  return { connectors, loading, error, connect, disconnect }
}

/**
 * Hook: List integrations
 */
export function useIntegrations(session: AuthSession | null) {
  const [integrations, setIntegrations] = useState<IntegrationConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
        })
        const data = await client.getIntegrations()
        setIntegrations(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load integrations')
        setIntegrations([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session])

  return { integrations, loading, error }
}

/**
 * Hook: Get onboarding state
 */
export function useOnboarding(session: AuthSession | null) {
  const [state, setState] = useState<OnboardingState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
        })
        const data = await client.getOnboardingState()
        setState(data.onboarding)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load onboarding state')
        setState(null)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session])

  return { state, loading, error }
}

/**
 * Hook: Get capabilities
 */
export function useCapabilities(session: AuthSession | null) {
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
        })
        const data = await client.getCapabilities()
        setCapabilities(data.capabilities)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load capabilities')
        setCapabilities([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session])

  const execute = useCallback(
    async (capability: string, params: Record<string, any>) => {
      if (!session) throw new Error('No session')

      const client = new IntegrateWiseClient({
        token: session.token,
        tenantId: session.tenantId,
      })

      return client.executeCapability(capability, params)
    },
    [session]
  )

  return { capabilities, loading, error, execute }
}

/**
 * Hook: Query entities
 */
export function useEntities(
  session: AuthSession | null,
  type?: string,
  limit: number = 50
) {
  const [entities, setEntities] = useState<SpineEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        setLoading(true)
        const client = new IntegrateWiseClient({
          token: session.token,
          tenantId: session.tenantId,
        })
        const data = await client.getEntities(type, limit)
        setEntities(data.entities)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities')
        setEntities([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [session, type, limit])

  return { entities, loading, error }
}
