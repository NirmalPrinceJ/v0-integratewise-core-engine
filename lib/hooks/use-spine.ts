'use client'

import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { useAuthSession } from '@/lib/integratewise'
import {
  getEntityTypes,
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  getTimeline,
} from '@/lib/platform/spine'
import type { SpineEntity, SpineEntityType, SpineEntityFilter, SpineEntityListResponse, SpineTimelineEvent } from '@/lib/types/spine'

/**
 * Hook to fetch all entity types
 */
export function useEntityTypes() {
  const { client } = useAuthSession()

  const { data: entityTypes = [], isLoading, error, mutate } = useSWR(
    client ? 'spine:entity-types' : null,
    () => getEntityTypes(client!),
    { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000 }
  )

  return { entityTypes, isLoading, error, mutate }
}

/**
 * Hook to fetch entities of a specific type
 */
export function useSpineEntities(
  entityType: string | null,
  options: { limit?: number; offset?: number } = {}
) {
  const { client } = useAuthSession()
  const { limit = 50, offset = 0 } = options

  const { data, isLoading, error, mutate } = useSWR(
    client && entityType ? [`spine:entities:${entityType}:${offset}:${limit}`] : null,
    () => getEntities(client!, entityType!, { limit, offset }),
    { revalidateOnFocus: false }
  )

  return {
    entities: data?.entities || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook to fetch a single entity
 */
export function useSpineEntity<T = Record<string, unknown>>(
  entityType: string | null,
  entityId: string | null
) {
  const { client } = useAuthSession()

  const { data: entity, isLoading, error, mutate } = useSWR(
    client && entityType && entityId ? [`spine:entity:${entityType}:${entityId}`] : null,
    () => getEntity<T>(client!, entityType!, entityId!),
    { revalidateOnFocus: false }
  )

  return { entity, isLoading, error, mutate }
}

/**
 * Hook to create a new entity
 */
export function useCreateSpineEntity(entityType: string) {
  const { client } = useAuthSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (data: Record<string, unknown>, metadata?: Record<string, unknown>) => {
      if (!client) {
        setError('Not authenticated')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const newEntity = await createEntity(client, entityType, data, metadata)
        return newEntity
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create entity'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [client, entityType]
  )

  return { create, isLoading, error }
}

/**
 * Hook to update an entity
 */
export function useUpdateSpineEntity(entityType: string, entityId: string) {
  const { client, session } = useAuthSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(
    async (data: Record<string, unknown>) => {
      if (!client) {
        setError('Not authenticated')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const updated = await updateEntity(
          client,
          entityType,
          entityId,
          data,
          session?.user?.id
        )
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update entity'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [client, entityType, entityId, session?.user?.id]
  )

  return { update, isLoading, error }
}

/**
 * Hook to delete an entity
 */
export function useDeleteSpineEntity(entityType: string) {
  const { client, session } = useAuthSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = useCallback(
    async (entityId: string) => {
      if (!client) {
        setError('Not authenticated')
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        await deleteEntity(client, entityType, entityId, session?.user?.id)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete entity'
        setError(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [client, entityType, session?.user?.id]
  )

  return { delete: delete_, isLoading, error }
}

/**
 * Hook to fetch entity timeline
 */
export function useSpineTimeline(
  entityType: string | null,
  entityId: string | null,
  limit: number = 50
) {
  const { client } = useAuthSession()

  const { data: timeline = [], isLoading, error, mutate } = useSWR(
    client && entityType && entityId ? [`spine:timeline:${entityType}:${entityId}`] : null,
    () => getTimeline(client!, entityId!, limit),
    { revalidateOnFocus: false }
  )

  return { timeline, isLoading, error, mutate }
}
