/**
 * Adaptive Spine Type Definitions
 * Core types for entity-relationship graph that powers IntegrateWise
 */

// Entity Types (canonical)
export type EntityTypeName =
  | 'Account'
  | 'Contact'
  | 'Opportunity'
  | 'Lead'
  | 'Task'
  | 'Project'
  | 'Activity'
  | 'Decision'
  | 'Feature'
  | 'Bug'
  | 'Request'
  | 'Campaign'
  | 'Artifact'
  | 'WorkSession'
  | 'Proposal'
  | 'Evidence'

export type EntityCategory = 'core' | 'crm' | 'ops' | 'product' | 'engagement'

export interface EntityType {
  id: string
  name: EntityTypeName
  pluralName: string
  description?: string
  iconName?: string
  colorHex?: string
  category: EntityCategory
  requiredFields: string[]
  createdAt: Date
  updatedAt: Date
}

// Entity Field Definition
export type FieldType = 'text' | 'number' | 'email' | 'date' | 'boolean' | 'select' | 'reference' | 'json'

export interface EntityField {
  id: string
  entityTypeId: string
  name: string
  displayName: string
  fieldType: FieldType
  required: boolean
  indexed: boolean
  searchable: boolean
  validationRules?: Record<string, unknown>
  position?: number
  createdAt: Date
  updatedAt: Date
}

// Core Entity (spine_entities)
export interface SpineEntity {
  id: string
  entityTypeId: string
  data: Record<string, unknown>
  name: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
  tenantId: string
  createdByUserId?: string
  createdAt: Date
  updatedAt: Date
}

// Entity with full type info
export interface SpineEntityFull extends SpineEntity {
  entityType: EntityType
  fields: EntityField[]
}

// Relationship Types
export type RelationshipType = 'owns' | 'related_to' | 'member_of' | 'linked_to' | 'parent' | 'child' | 'associated_with'

export interface SpineRelationship {
  id: string
  sourceEntityId: string
  targetEntityId: string
  relationshipType: RelationshipType
  metadata?: Record<string, unknown>
  createdAt: Date
  createdByUserId?: string
}

export interface RelationshipTypeDefinition {
  id: string
  name: RelationshipType
  description?: string
  direction: 'one-way' | 'two-way'
  sourceEntityTypeId?: string
  targetEntityTypeId?: string
  createdAt: Date
}

// Timeline Entry (immutable audit log)
export type TimelineOperation = 'create' | 'update' | 'delete'
export type TimelineSource = 'user' | 'twin' | 'capability' | 'api' | 'import'

export interface SpineTimeline {
  id: string
  entityId: string
  operation: TimelineOperation
  fieldName?: string
  oldValue?: unknown
  newValue?: unknown
  source: TimelineSource
  sourceId?: string
  reason?: string
  metadata?: {
    twinProposalId?: string
    confidenceScore?: number
    reasoning?: string
    [key: string]: unknown
  }
  createdAt: Date
  createdByUserId?: string
}

// Query & Filter Types
export interface SpineEntityFilter {
  entityTypeId?: string
  entityType?: EntityTypeName
  status?: 'active' | 'inactive' | 'archived'
  search?: string
  fields?: Record<string, unknown>
  limit?: number
  offset?: number
  orderBy?: 'created_at' | 'updated_at' | 'name'
  orderDirection?: 'asc' | 'desc'
}

export interface SpineTimelineFilter {
  entityId: string
  operation?: TimelineOperation
  source?: TimelineSource
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

// Create & Update Inputs
export interface CreateSpineEntityInput {
  entityTypeId: string
  name: string
  description?: string
  data: Record<string, unknown>
  tenantId: string
}

export interface UpdateSpineEntityInput {
  id: string
  data?: Record<string, unknown>
  name?: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
}

export interface CreateRelationshipInput {
  sourceEntityId: string
  targetEntityId: string
  relationshipType: RelationshipType
  metadata?: Record<string, unknown>
}

export interface CreateTimelineEntryInput {
  entityId: string
  operation: TimelineOperation
  fieldName?: string
  oldValue?: unknown
  newValue?: unknown
  source: TimelineSource
  sourceId?: string
  reason?: string
  metadata?: Record<string, unknown>
}

// Workbench Context
export interface WorkbenchContext {
  entityId?: string
  entityType?: EntityTypeName
  departmentCode?: string
  userRole?: string
  session?: {
    id: string
    startedAt: Date
    context: Record<string, unknown>
  }
}

// Twin Signal (observed from Spine mutations)
export interface TwinSignal {
  id: string
  twinId: string
  entityId: string
  entityType: EntityTypeName
  signalType: 'risk' | 'opportunity' | 'action' | 'insight'
  title: string
  description: string
  confidence: number
  evidenceIds: string[]
  recommendation?: string
  createdAt: Date
  dismissedAt?: Date
}

// Proposal (from Twin reasoning)
export interface TwinProposal {
  id: string
  twinId: string
  entityId: string
  entityType: EntityTypeName
  proposedMutation: UpdateSpineEntityInput
  reasoning: string
  confidenceScore: number
  relatedSignals: string[]
  status: 'pending' | 'approved' | 'rejected' | 'executed'
  createdAt: Date
  respondedAt?: Date
  respondedByUserId?: string
}

// Capability (action that can be performed)
export interface Capability {
  id: string
  name: string
  description: string
  entityTypes: EntityTypeName[]
  requiredRoles: string[]
  governanceLevel: 'immediate' | 'deferred' | 'approval_required'
  targetSystem: string // 'crm', 'support', 'product', 'communication', etc.
  execute: (entityId: string, params: Record<string, unknown>) => Promise<void>
}
