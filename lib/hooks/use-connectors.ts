'use client'

import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { useAuthSession } from '@/lib/integratewise'
import { getTenantConnectors, getTenantConnector, createTenantConnector, updateTenantConnector, deleteTenantConnector } from '@/lib/connectors/registry'
import type { TenantConnector } from '@/lib/types/connectors'

/**
 * Hook to fetch all connectors for current tenant
 */
export function useTenantConnectors(filter?: { status?: string; provider?: string }) {
  const { session } = useAuthSession()
  const tenantId = session?.user?.id ? `tenant_${session.user.id}` : null

  const { data: connectors = [], isLoading, error, mutate } = useSWR(
    tenantId ? [`connectors:${tenantId}`, filter] : null,
    () => getTenantConnectors(tenantId!, filter),
    { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000 }
  )

  return { connectors, isLoading, error, mutate }
}

/**
 * Hook to fetch a specific connector
 */
export function useTenantConnector(connectorId: string | null) {
  const { session } = useAuthSession()
  const tenantId = session?.user?.id ? `tenant_${session.user.id}` : null

  const { data: connector, isLoading, error, mutate } = useSWR(
    tenantId && connectorId ? [`connector:${tenantId}:${connectorId}`] : null,
    () => getTenantConnector(tenantId!, connectorId!),
    { revalidateOnFocus: false }
  )

  return { connector, isLoading, error, mutate }
}

/**
 * Hook to create a connector
 */
export function useCreateConnector() {
  const { session } = useAuthSession()
  const tenantId = session?.user?.id ? `tenant_${session.user.id}` : null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (connector: Omit<TenantConnector, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!tenantId) {
        setError('Not authenticated')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await createTenantConnector(tenantId, connector)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create connector'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [tenantId]
  )

  return { create, isLoading, error }
}

/**
 * Hook to update a connector
 */
export function useUpdateConnector(connectorId: string) {
  const { session } = useAuthSession()
  const tenantId = session?.user?.id ? `tenant_${session.user.id}` : null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(
    async (updates: Partial<TenantConnector>) => {
      if (!tenantId) {
        setError('Not authenticated')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await updateTenantConnector(tenantId, connectorId, updates)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update connector'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [tenantId, connectorId]
  )

  return { update, isLoading, error }
}

/**
 * Hook to delete a connector
 */
export function useDeleteConnector() {
  const { session } = useAuthSession()
  const tenantId = session?.user?.id ? `tenant_${session.user.id}` : null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = useCallback(
    async (connectorId: string) => {
      if (!tenantId) {
        setError('Not authenticated')
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const success = await deleteTenantConnector(tenantId, connectorId)
        return success
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete connector'
        setError(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [tenantId]
  )

  return { delete: delete_, isLoading, error }
}
