'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { SpineEntity } from '@/lib/types/spine'
import { formatDistanceToNow } from 'date-fns'

interface EntityGridProps {
  entities: SpineEntity[]
  selectedEntity?: SpineEntity | null
  onSelectEntity: (entity: SpineEntity) => void
  isLoading?: boolean
  type: string
}

const typeColors = {
  account: '#3B82F6',
  contact: '#8B5CF6',
  deal: '#10B981',
  opportunity: '#F59E0B',
  lead: '#EF4444',
  task: '#06B6D4',
  invoice: '#059669',
}

const typeIcons = {
  account: '🏢',
  contact: '👤',
  deal: '💼',
  opportunity: '🎯',
  lead: '🔥',
  task: '✓',
  invoice: '💵',
}

export function EntityGrid({
  entities,
  selectedEntity,
  onSelectEntity,
  isLoading,
  type,
}: EntityGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="text-4xl mb-2">{typeIcons[type as keyof typeof typeIcons] || '📦'}</div>
        <h3 className="font-semibold">No entities found</h3>
        <p className="text-sm text-muted-foreground mt-1">Create your first {type} to get started</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {entities.map((entity) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          isSelected={selectedEntity?.id === entity.id}
          onSelect={() => onSelectEntity(entity)}
          type={type}
        />
      ))}
    </div>
  )
}

interface EntityCardProps {
  entity: SpineEntity
  isSelected: boolean
  onSelect: () => void
  type: string
}

function EntityCard({ entity, isSelected, onSelect, type }: EntityCardProps) {
  const data = entity.data as Record<string, unknown>
  const name = data.name || data.title || entity.id
  const color = typeColors[type as keyof typeof typeColors] || '#6B7280'
  const icon = typeIcons[type as keyof typeof typeIcons] || '📦'

  // Extract relevant fields based on type
  const renderDetails = () => {
    switch (type) {
      case 'account':
        return (
          <>
            <span className="text-sm text-muted-foreground">{data.industry}</span>
            {data.arr && <span className="text-sm font-semibold">${data.arr}</span>}
          </>
        )
      case 'contact':
        return (
          <>
            <span className="text-sm text-muted-foreground">{data.email}</span>
            {data.role && <span className="text-sm">{data.role}</span>}
          </>
        )
      case 'deal':
        return (
          <>
            <span className="text-sm text-muted-foreground">{data.stage}</span>
            {data.value && <span className="text-sm font-semibold">${data.value}</span>}
          </>
        )
      case 'invoice':
        return (
          <>
            <span className="text-sm text-muted-foreground">{data.number}</span>
            {data.amount && <span className="text-sm font-semibold">${data.amount}</span>}
          </>
        )
      default:
        return <span className="text-sm text-muted-foreground">{data.status}</span>
    }
  }

  return (
    <Card
      onClick={onSelect}
      className={`p-4 cursor-pointer transition border-2 ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
      style={isSelected ? { borderColor: color } : {}}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl pt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {renderDetails()}
          </div>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap pl-2">
          {entity.updatedAt && formatDistanceToNow(new Date(entity.updatedAt), { addSuffix: true })}
        </div>
      </div>
    </Card>
  )
}
