'use client'

/**
 * React Hooks for Adaptive Spine
 * Client-side data fetching and mutations for entity-relationship operations
 */

import { useCallback, useState } from 'react'
import useSWR from 'swr'
import type {
  SpineEntity,
  SpineEntityFull,
  SpineRelationship,
  SpineTimeline,
  EntityType,
  CreateSpineEntityInput,
  UpdateSpineEntityInput,
  CreateRelationshipInput,
  SpineEntityFilter,
  SpineTimelineFilter,
} from '@/lib/platform/spine-types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Hook to fetch all entity types
 */
export function useEntityTypes() {
  const { data, error, isLoading, mutate } = useSWR('/api/spine/entity-types', fetcher)

  return {
    entityTypes: (data?.entityTypes || []) as EntityType[],
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook to query spine entities with filters
 */
export function useSpineEntities(
  filter: SpineEntityFilter & { tenantId: string },
  enabled: boolean = true,
) {
  const queryString = new URLSearchParams({
    entityTypeId: filter.entityTypeId || '',
    search: filter.search || '',
    status: filter.status || '',
    limit: String(filter.limit || 50),
    offset: String(filter.offset || 0),
    tenantId: filter.tenantId,
  }).toString()

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/spine/entities?${queryString}` : null,
    fetcher,
  )

  return {
    entities: (data?.entities || []) as SpineEntity[],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook to fetch a single entity by ID
 */
export function useSpineEntity(entityId: string, tenantId: string, enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/spine/entities/${entityId}?tenantId=${tenantId}` : null,
    fetcher,
  )

  return {
    entity: data?.entity as SpineEntityFull | undefined,
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook to fetch timeline for an entity
 */
export function useSpineTimeline(
  filter: SpineTimelineFilter,
  enabled: boolean = true,
) {
  const queryString = new URLSearchParams({
    entityId: filter.entityId,
    operation: filter.operation || '',
    source: filter.source || '',
    limit: String(filter.limit || 50),
    offset: String(filter.offset || 0),
  }).toString()

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/spine/timeline?${queryString}` : null,
    fetcher,
  )

  return {
    entries: (data?.entries || []) as SpineTimeline[],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook to fetch relationships for an entity
 */
export function useSpineRelationships(entityId: string, relationshipType?: string, enabled: boolean = true) {
  const queryString = new URLSearchParams({
    entityId,
    relationshipType: relationshipType || '',
  }).toString()

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/spine/relationships?${queryString}` : null,
    fetcher,
  )

  return {
    relationships: (data?.relationships || []) as SpineRelationship[],
    isLoading,
    error,
    mutate,
  }
}

/**
 * Hook for creating spine entities
 */
export function useCreateSpineEntity() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (input: CreateSpineEntityInput): Promise<SpineEntity | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/spine/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Failed to create entity')
      }

      const data = await response.json()
      return data.entity
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { create, isLoading, error }
}

/**
 * Hook for updating spine entities
 */
export function useUpdateSpineEntity() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (input: UpdateSpineEntityInput): Promise<SpineEntity | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/spine/entities/${input.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Failed to update entity')
      }

      const data = await response.json()
      return data.entity
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { update, isLoading, error }
}

/**
 * Hook for creating relationships
 */
export function useCreateRelationship() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (input: CreateRelationshipInput): Promise<SpineRelationship | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/spine/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Failed to create relationship')
      }

      const data = await response.json()
      return data.relationship
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { create, isLoading, error }
}
