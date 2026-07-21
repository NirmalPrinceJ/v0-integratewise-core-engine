'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow, format } from 'date-fns'
import { Clock, Users, Link as LinkIcon, MoreHorizontal } from 'lucide-react'
import { useSpineTimeline, useSpineRelated } from '@/lib/hooks/use-spine'
import type { SpineEntity } from '@/lib/types/spine'

interface EntityDetailProps {
  entity: SpineEntity
}

export function EntityDetail({ entity }: EntityDetailProps) {
  const { timeline, isLoading: timelineLoading } = useSpineTimeline(entity.type, entity.id)
  const { related, isLoading: relatedLoading } = useSpineRelated(entity.id)

  const data = entity.data as Record<string, unknown>

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{data.name || data.title || entity.id}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {entity.type} • {entity.id}
            </p>
          </div>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Created" value={format(new Date(entity.createdAt), 'MMM d, yyyy')} />
        <StatCard label="Updated" value={formatDistanceToNow(new Date(entity.updatedAt), { addSuffix: true })} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-3">
          <Card className="p-4">
            <div className="space-y-3">
              {Object.entries(data).map(([key, value]) => {
                if (!value || key === 'id' || key === 'name' || key === 'title') return null

                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-medium">
                      {formatFieldValue(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-2">
          {timelineLoading ? (
            <Card className="p-4 text-center text-muted-foreground">Loading...</Card>
          ) : timeline.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">No history</Card>
          ) : (
            <div className="space-y-2">
              {timeline.map((event) => (
                <TimelineItem key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Related Tab */}
        <TabsContent value="related" className="space-y-2">
          {relatedLoading ? (
            <Card className="p-4 text-center text-muted-foreground">Loading...</Card>
          ) : related.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">No related entities</Card>
          ) : (
            <div className="space-y-2">
              {related.map((rel) => (
                <Card key={rel.id} className="p-3 cursor-pointer hover:bg-muted/50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{rel.relationshipName}</p>
                      <p className="text-xs text-muted-foreground">{rel.relationshipType}</p>
                    </div>
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      {entity.metadata && Object.keys(entity.metadata).length > 0 && (
        <Card className="p-4 bg-muted/30">
          <h4 className="text-sm font-semibold mb-2">Metadata</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {Object.entries(entity.metadata).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {JSON.stringify(value)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="p-3 bg-muted/30 border-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </Card>
  )
}

interface TimelineItemProps {
  event: any
}

function TimelineItem({ event }: TimelineItemProps) {
  const actionColors = {
    create: '#10B981',
    update: '#3B82F6',
    delete: '#EF4444',
    relate: '#8B5CF6',
    unrelate: '#F59E0B',
  }

  const color = actionColors[event.action as keyof typeof actionColors] || '#6B7280'

  return (
    <Card className="p-3 border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium capitalize">{event.action}</p>
          {event.fieldName && (
            <p className="text-xs text-muted-foreground">{event.fieldName}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
        </span>
      </div>
      {event.metadata?.reasoning && (
        <p className="text-xs mt-2 text-muted-foreground italic">
          "{event.metadata.reasoning}"
        </p>
      )}
    </Card>
  )
}

function formatFieldValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return format(value, 'MMM d, yyyy')
  if (Array.isArray(value)) return `${value.length} items`
  return JSON.stringify(value)
}
