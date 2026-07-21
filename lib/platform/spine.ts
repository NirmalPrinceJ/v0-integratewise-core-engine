/**
 * Spine Service Layer
 * Calls the Gateway API to fetch and mutate Spine entities
 * All workbench data flows through this layer
 */

import { IntegrateWiseClient } from '@/lib/integratewise/client'
import {
  SpineEntity,
  SpineEntityType,
  SpineEntityFilter,
  SpineEntityListResponse,
  SpineTimelineEvent,
  SpineRelationshipQuery,
  SpineRelationship,
} from '@/lib/types/spine'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>()

function getCacheKey(key: string): string {
  return `spine:${key}`
}

function getCached<T>(key: string): T | null {
  const cacheKey = getCacheKey(key)
  const entry = cache.get(cacheKey)
  
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(cacheKey)
    return null
  }
  
  return entry.data as T
}

function setCache<T>(key: string, data: T): T {
  const cacheKey = getCacheKey(key)
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

function invalidatePatternCache(pattern?: string): void {
  if (!pattern) {
    cache.clear()
    return
  }
  
  const keys = Array.from(cache.keys())
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  })
}

/**
 * Get all entity types from the Gateway API
 */
export async function getEntityTypes(client: IntegrateWiseClient): Promise<SpineEntityType[]> {
  const cached = getCached<SpineEntityType[]>('entity-types')
  if (cached) return cached

  try {
    const response = await client.get('/api/v1/workspace/spine/entity-types')
    const entityTypes = response.data?.entity_types || []
    return setCache('entity-types', entityTypes)
  } catch (error) {
    console.error('[v0] Failed to fetch entity types:', error)
    return []
  }
}

/**
 * Get a specific entity type by name
 */
export async function getEntityType(
  client: IntegrateWiseClient,
  typeName: string
): Promise<SpineEntityType | null> {
  const entityTypes = await getEntityTypes(client)
  return entityTypes.find(t => t.name === typeName) || null
}

/**
 * Get paginated list of entities of a specific type
 */
export async function getEntities(
  client: IntegrateWiseClient,
  type: string,
  filter?: SpineEntityFilter
): Promise<SpineEntityListResponse> {
  const { limit = 50, offset = 0 } = filter || {}
  
  const cacheKey = `entities:${type}:${offset}:${limit}`
  const cached = getCached<SpineEntityListResponse>(cacheKey)
  if (cached) return cached

  try {
    const params = new URLSearchParams({
      type,
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await client.get(`/api/v1/workspace/spine/entities?${params}`)
    const result: SpineEntityListResponse = {
      entities: response.data?.entities || [],
      total: response.data?.total || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (response.data?.total || 0),
    }
    return setCache(cacheKey, result)
  } catch (error) {
    console.error('[v0] Failed to fetch entities:', error)
    return { entities: [], total: 0, limit, offset, hasMore: false }
  }
}

/**
 * Get a single entity by type and ID
 */
export async function getEntity<T = Record<string, unknown>>(
  client: IntegrateWiseClient,
  type: string,
  id: string
): Promise<SpineEntity<T> | null> {
  const cacheKey = `entity:${type}:${id}`
  const cached = getCached<SpineEntity<T>>(cacheKey)
  if (cached) return cached

  try {
    const response = await client.get(`/api/v1/workspace/spine/entities/${type}/${id}`)
    const entity = response.data?.entity
    if (entity) {
      return setCache(cacheKey, entity)
    }
    return null
  } catch (error) {
    console.error('[v0] Failed to fetch entity:', error)
    return null
  }
}

/**
 * Create a new entity in the Spine
 */
export async function createEntity<T = Record<string, unknown>>(
  client: IntegrateWiseClient,
  type: string,
  data: T,
  metadata?: Record<string, unknown>
): Promise<SpineEntity<T>> {
  try {
    const response = await client.post(`/api/v1/workspace/spine/entities`, {
      type,
      data,
      metadata,
    })
    
    const entity = response.data?.entity
    if (entity) {
      invalidatePatternCache(`entities:${type}`)
      return entity
    }
    throw new Error('Failed to create entity')
  } catch (error) {
    console.error('[v0] Failed to create entity:', error)
    throw error
  }
}

/**
 * Update an existing entity in the Spine
 */
export async function updateEntity<T = Record<string, unknown>>(
  client: IntegrateWiseClient,
  type: string,
  id: string,
  data: Partial<T>,
  userId?: string
): Promise<SpineEntity<T>> {
  try {
    const response = await client.patch(
      `/api/v1/workspace/spine/entities/${type}/${id}`,
      {
        data,
        updated_by: userId,
      }
    )
    
    const entity = response.data?.entity
    if (entity) {
      invalidatePatternCache(`entity:${type}:${id}`)
      invalidatePatternCache(`entities:${type}`)
      return entity
    }
    throw new Error('Failed to update entity')
  } catch (error) {
    console.error('[v0] Failed to update entity:', error)
    throw error
  }
}

/**
 * Delete entity (soft delete)
 */
export async function deleteEntity(
  client: IntegrateWiseClient,
  type: string,
  id: string,
  userId?: string
): Promise<void> {
  try {
    await client.delete(`/api/v1/workspace/spine/entities/${type}/${id}`, {
      deleted_by: userId,
    })
    
    invalidatePatternCache(`entity:${type}:${id}`)
    invalidatePatternCache(`entities:${type}`)
  } catch (error) {
    console.error('[v0] Failed to delete entity:', error)
    throw error
  }
}

/**
 * Get related entities
 */
export async function getRelated(
  client: IntegrateWiseClient,
  entityId: string,
  query?: SpineRelationshipQuery
): Promise<SpineRelationship[]> {
  const cacheKey = `related:${entityId}:${query?.type || 'all'}`
  const cached = getCached<SpineRelationship[]>(cacheKey)
  if (cached) return cached

  try {
    const params = new URLSearchParams({
      entity_id: entityId,
    })
    
    if (query?.type) {
      params.append('relationship_type', query.type)
    }

    const response = await client.get(`/api/v1/workspace/spine/relationships?${params}`)
    const related = response.data?.relationships || []
    return setCache(cacheKey, related)
  } catch (error) {
    console.error('[v0] Failed to fetch related entities:', error)
    return []
  }
}

/**
 * Get entity timeline/audit trail
 */
export async function getTimeline(
  client: IntegrateWiseClient,
  entityId: string,
  limit: number = 50
): Promise<SpineTimelineEvent[]> {
  const cacheKey = `timeline:${entityId}:${limit}`
  const cached = getCached<SpineTimelineEvent[]>(cacheKey)
  if (cached) return cached

  try {
    const params = new URLSearchParams({
      entity_id: entityId,
      limit: limit.toString(),
    })

    const response = await client.get(`/api/v1/workspace/spine/timeline?${params}`)
    const timeline = response.data?.timeline || []
    return setCache(cacheKey, timeline)
  } catch (error) {
    console.error('[v0] Failed to fetch timeline:', error)
    return []
  }
}

/**
 * Validate entity data against schema
 */
export async function validateEntityData(
  client: IntegrateWiseClient,
  type: string,
  data: unknown
): Promise<boolean> {
  const entityType = await getEntityType(client, type)
  if (!entityType) return false

  // Validate required fields
  const requiredFields = entityType.fields?.filter(f => f.required) || []
  const dataObj = data as Record<string, unknown>
  
  return requiredFields.every(field => field.name in dataObj)
}

/**
 * Cache management
 */
export function invalidateCache(pattern?: string): void {
  invalidatePatternCache(pattern)
}

