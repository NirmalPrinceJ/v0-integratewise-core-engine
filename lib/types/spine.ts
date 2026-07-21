/**
 * Adaptive Spine - Core Entity Graph Types
 * Central source of truth for all business entities and their relationships
 */

// Entity Type Definition
export interface SpineEntityType {
  id: string
  name: string
  plural: string
  description?: string
  icon: string
  color: string
  fields: SpineField[]
  relationships: string[]
  createdAt: Date
  updatedAt: Date
}

// Field Definition
export interface SpineField {
  id: string
  entityType: string
  name: string
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'uuid' | 'jsonb' | 'email' | 'url'
  required: boolean
  indexed: boolean
  uniqueConstraint: boolean
  validationRules?: Record<string, unknown>
  createdAt: Date
}

// Core Entity
export interface SpineEntity<T = Record<string, unknown>> {
  id: string
  type: string
  externalId?: string
  data: T
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

// Entity Relationship
export interface SpineRelationship {
  id: string
  sourceId: string
  sourceType: string
  targetId: string
  targetType: string
  relationshipType: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

// Timeline Event (Immutable audit log)
export interface SpineTimelineEvent {
  id: string
  entityId: string
  entityType: string
  action: 'create' | 'update' | 'delete'
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
  timestamp: Date
  userId?: string
  source: 'api' | 'ui' | 'connector' | 'twin' | 'system'
  metadata?: Record<string, unknown>
}

// Query Types
export interface SpineEntityFilter {
  type?: string
  search?: string
  filters?: Record<string, unknown>
  sort?: { field: string; order: 'asc' | 'desc' }
  limit?: number
  offset?: number
}

export interface SpineEntityListResponse {
  entities: SpineEntity[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Relationship Query
export interface SpineRelationshipQuery {
  entityId: string
  relationshipType?: string
  forward?: boolean
  reverse?: boolean
}

// Core Entity Type Definitions (Generated from Spine)
export interface Account extends SpineEntity {
  data: {
    name: string
    industry?: string
    size?: string
    arr?: number
    healthScore?: number
    ownerId?: string
  }
}

export interface Contact extends SpineEntity {
  data: {
    name: string
    email?: string
    phone?: string
    accountId: string
    role?: string
  }
}

export interface Deal extends SpineEntity {
  data: {
    name: string
    accountId: string
    amount?: number
    stage: string
    closeDate?: Date
    probability?: number
  }
}

export interface Task extends SpineEntity {
  data: {
    title: string
    description?: string
    status: 'todo' | 'in-progress' | 'done'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: Date
    assignedTo?: string
  }
}

export interface Meeting extends SpineEntity {
  data: {
    title: string
    description?: string
    startTime: Date
    duration: number
    attendees: string[]
    location?: string
  }
}

export interface Document extends SpineEntity {
  data: {
    title: string
    content: string
    owner: string
    type: 'doc' | 'sheet' | 'slide' | 'form'
    shared: boolean
  }
}

export interface Decision extends SpineEntity {
  data: {
    title: string
    context: string
    rationale: string
    owner: string
    status: 'proposed' | 'approved' | 'executed' | 'archived'
    impact?: string
  }
}

export interface Template extends SpineEntity {
  data: {
    name: string
    description: string
    category: string
    content: Record<string, unknown>
    tags: string[]
    owner: string
  }
}

