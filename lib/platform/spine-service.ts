/**
 * Adaptive Spine Service Layer
 * Core CRUD, validation, and query operations for the entity-relationship graph
 */

import { createClient } from '@/lib/supabase/server'
import type {
  SpineEntity,
  SpineEntityFull,
  SpineRelationship,
  SpineTimeline,
  EntityType,
  EntityField,
  CreateSpineEntityInput,
  UpdateSpineEntityInput,
  CreateRelationshipInput,
  CreateTimelineEntryInput,
  SpineEntityFilter,
  SpineTimelineFilter,
} from './spine-types'

export class SpineService {
  private supabase: ReturnType<typeof createClient>

  constructor() {
    this.supabase = createClient()
  }

  // ============= ENTITY OPERATIONS =============

  /**
   * Create a new spine entity
   */
  async createEntity(input: CreateSpineEntityInput, userId?: string): Promise<SpineEntity> {
    const { data, error } = await this.supabase
      .from('spine_entities')
      .insert({
        entity_type_id: input.entityTypeId,
        name: input.name,
        description: input.description,
        data: input.data,
        tenant_id: input.tenantId,
        created_by_user_id: userId,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create entity: ${error.message}`)

    return this.formatEntity(data)
  }

  /**
   * Get entity by ID with full type info
   */
  async getEntity(entityId: string, tenantId: string): Promise<SpineEntityFull | null> {
    const { data, error } = await this.supabase
      .from('spine_entities')
      .select(
        `
        *,
        entity_type:entity_types(*)
      `,
      )
      .eq('id', entityId)
      .eq('tenant_id', tenantId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    if (!data) return null

    const entityType = data.entity_type as EntityType
    const { data: fields } = await this.supabase
      .from('entity_fields')
      .select('*')
      .eq('entity_type_id', entityType.id)

    return {
      ...this.formatEntity(data),
      entityType: this.formatEntityType(entityType),
      fields: (fields || []).map((f) => this.formatEntityField(f)),
    }
  }

  /**
   * Query entities with filters
   */
  async queryEntities(filter: SpineEntityFilter & { tenantId: string }): Promise<{ entities: SpineEntity[]; total: number }> {
    let query = this.supabase.from('spine_entities').select('*', { count: 'exact' }).eq('tenant_id', filter.tenantId)

    if (filter.entityTypeId) {
      query = query.eq('entity_type_id', filter.entityTypeId)
    }

    if (filter.status) {
      query = query.eq('status', filter.status)
    }

    if (filter.search) {
      query = query.ilike('name', `%${filter.search}%`)
    }

    if (filter.orderBy) {
      query = query.order(filter.orderBy, {
        ascending: filter.orderDirection === 'asc',
      })
    }

    query = query.range(filter.offset || 0, (filter.offset || 0) + (filter.limit || 50) - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      entities: (data || []).map((e) => this.formatEntity(e)),
      total: count || 0,
    }
  }

  /**
   * Update entity
   */
  async updateEntity(input: UpdateSpineEntityInput, userId?: string): Promise<SpineEntity> {
    const updateData: Record<string, unknown> = {}

    if (input.data) updateData.data = input.data
    if (input.name) updateData.name = input.name
    if (input.description !== undefined) updateData.description = input.description
    if (input.status) updateData.status = input.status

    const { data, error } = await this.supabase
      .from('spine_entities')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single()

    if (error) throw error

    // Create timeline entry for update
    if (userId) {
      await this.createTimelineEntry(
        {
          entityId: input.id,
          operation: 'update',
          source: 'user',
          sourceId: userId,
          metadata: { fields: Object.keys(updateData) },
        },
        userId,
      )
    }

    return this.formatEntity(data)
  }

  /**
   * Delete entity (soft delete via status)
   */
  async deleteEntity(entityId: string, userId?: string): Promise<void> {
    const { error } = await this.supabase
      .from('spine_entities')
      .update({ status: 'archived' })
      .eq('id', entityId)

    if (error) throw error

    if (userId) {
      await this.createTimelineEntry(
        {
          entityId,
          operation: 'delete',
          source: 'user',
          sourceId: userId,
        },
        userId,
      )
    }
  }

  // ============= RELATIONSHIP OPERATIONS =============

  /**
   * Create relationship between entities
   */
  async createRelationship(input: CreateRelationshipInput, userId?: string): Promise<SpineRelationship> {
    const { data, error } = await this.supabase
      .from('spine_relationships')
      .insert({
        source_entity_id: input.sourceEntityId,
        target_entity_id: input.targetEntityId,
        relationship_type: input.relationshipType,
        metadata: input.metadata,
        created_by_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    return this.formatRelationship(data)
  }

  /**
   * Get related entities
   */
  async getRelated(entityId: string, relationshipType?: string): Promise<SpineRelationship[]> {
    let query = this.supabase
      .from('spine_relationships')
      .select('*')
      .or(`source_entity_id.eq.${entityId},target_entity_id.eq.${entityId}`)

    if (relationshipType) {
      query = query.eq('relationship_type', relationshipType)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map((r) => this.formatRelationship(r))
  }

  /**
   * Delete relationship
   */
  async deleteRelationship(relationshipId: string): Promise<void> {
    const { error } = await this.supabase.from('spine_relationships').delete().eq('id', relationshipId)

    if (error) throw error
  }

  // ============= TIMELINE OPERATIONS =============

  /**
   * Create timeline entry (immutable audit log)
   */
  async createTimelineEntry(input: CreateTimelineEntryInput, userId?: string): Promise<SpineTimeline> {
    const { data, error } = await this.supabase
      .from('spine_timeline')
      .insert({
        entity_id: input.entityId,
        operation: input.operation,
        field_name: input.fieldName,
        old_value: input.oldValue,
        new_value: input.newValue,
        source: input.source,
        source_id: input.sourceId,
        reason: input.reason,
        metadata: input.metadata,
        created_by_user_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    return this.formatTimeline(data)
  }

  /**
   * Get timeline for entity (immutable history)
   */
  async getTimeline(filter: SpineTimelineFilter): Promise<{ entries: SpineTimeline[]; total: number }> {
    let query = this.supabase.from('spine_timeline').select('*', { count: 'exact' }).eq('entity_id', filter.entityId)

    if (filter.operation) {
      query = query.eq('operation', filter.operation)
    }

    if (filter.source) {
      query = query.eq('source', filter.source)
    }

    if (filter.startDate) {
      query = query.gte('created_at', filter.startDate.toISOString())
    }

    if (filter.endDate) {
      query = query.lte('created_at', filter.endDate.toISOString())
    }

    query = query.order('created_at', { ascending: false })
    query = query.range(filter.offset || 0, (filter.offset || 0) + (filter.limit || 50) - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      entries: (data || []).map((e) => this.formatTimeline(e)),
      total: count || 0,
    }
  }

  // ============= ENTITY TYPE OPERATIONS =============

  /**
   * Get all entity types
   */
  async getEntityTypes(): Promise<EntityType[]> {
    const { data, error } = await this.supabase.from('entity_types').select('*')

    if (error) throw error

    return (data || []).map((t) => this.formatEntityType(t))
  }

  /**
   * Get fields for entity type
   */
  async getEntityFields(entityTypeId: string): Promise<EntityField[]> {
    const { data, error } = await this.supabase
      .from('entity_fields')
      .select('*')
      .eq('entity_type_id', entityTypeId)
      .order('position', { ascending: true })

    if (error) throw error

    return (data || []).map((f) => this.formatEntityField(f))
  }

  // ============= VALIDATION =============

  /**
   * Validate entity data against field schema
   */
  async validateEntity(entityTypeId: string, data: Record<string, unknown>): Promise<{ valid: boolean; errors: string[] }> {
    const fields = await this.getEntityFields(entityTypeId)
    const errors: string[] = []

    for (const field of fields) {
      if (field.required && !(field.name in data)) {
        errors.push(`Required field missing: ${field.displayName}`)
      }

      if (field.name in data) {
        const value = data[field.name]

        // Type validation
        switch (field.fieldType) {
          case 'email':
            if (typeof value !== 'string' || !value.includes('@')) {
              errors.push(`Invalid email: ${field.displayName}`)
            }
            break
          case 'number':
            if (typeof value !== 'number') {
              errors.push(`Invalid number: ${field.displayName}`)
            }
            break
          case 'date':
            if (!(value instanceof Date) && typeof value !== 'string') {
              errors.push(`Invalid date: ${field.displayName}`)
            }
            break
        }
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // ============= FORMATTING HELPERS =============

  private formatEntity(raw: any): SpineEntity {
    return {
      id: raw.id,
      entityTypeId: raw.entity_type_id,
      data: raw.data,
      name: raw.name,
      description: raw.description,
      status: raw.status,
      tenantId: raw.tenant_id,
      createdByUserId: raw.created_by_user_id,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at),
    }
  }

  private formatEntityType(raw: any): EntityType {
    return {
      id: raw.id,
      name: raw.name,
      pluralName: raw.plural_name,
      description: raw.description,
      iconName: raw.icon_name,
      colorHex: raw.color_hex,
      category: raw.category,
      requiredFields: raw.required_fields || [],
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at),
    }
  }

  private formatEntityField(raw: any): EntityField {
    return {
      id: raw.id,
      entityTypeId: raw.entity_type_id,
      name: raw.name,
      displayName: raw.display_name,
      fieldType: raw.field_type,
      required: raw.required,
      indexed: raw.indexed,
      searchable: raw.searchable,
      validationRules: raw.validation_rules,
      position: raw.position,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at),
    }
  }

  private formatRelationship(raw: any): SpineRelationship {
    return {
      id: raw.id,
      sourceEntityId: raw.source_entity_id,
      targetEntityId: raw.target_entity_id,
      relationshipType: raw.relationship_type,
      metadata: raw.metadata,
      createdAt: new Date(raw.created_at),
      createdByUserId: raw.created_by_user_id,
    }
  }

  private formatTimeline(raw: any): SpineTimeline {
    return {
      id: raw.id,
      entityId: raw.entity_id,
      operation: raw.operation,
      fieldName: raw.field_name,
      oldValue: raw.old_value,
      newValue: raw.new_value,
      source: raw.source,
      sourceId: raw.source_id,
      reason: raw.reason,
      metadata: raw.metadata,
      createdAt: new Date(raw.created_at),
      createdByUserId: raw.created_by_user_id,
    }
  }
}

// Export singleton instance
export const spineService = new SpineService()
