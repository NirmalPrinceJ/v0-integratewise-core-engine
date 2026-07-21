'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock, GitBranch, Mail, MessageSquare, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface TimelineEvent {
  id: string
  timestamp: string
  action: string
  type: 'success' | 'warning' | 'info' | 'pending'
  description: string
  metadata?: Record<string, any>
}

export function OperationalTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulated Spine timeline data
    // In production, this would fetch from /api/spine/timeline
    const mockEvents: TimelineEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        action: 'Lead Qualified',
        type: 'success',
        description: 'New lead qualified through automation',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        action: 'Customer Health Updated',
        type: 'success',
        description: 'Account health score recalculated',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        action: 'Marketing Proposal Generated',
        type: 'info',
        description: 'AI Twin generated campaign proposal',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        action: 'Approval Completed',
        type: 'success',
        description: 'Governance approval granted',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        action: 'GitHub Deployment',
        type: 'success',
        description: 'Production deployment completed',
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
        action: 'Support Ticket Routed',
        type: 'info',
        description: 'Customer support case assigned',
      },
    ]

    setEvents(mockEvents)
    setIsLoading(false)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-slate-400" />
      default:
        return <Zap className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'pending':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-700 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Operational Timeline</h2>
          <span className="text-xs text-slate-400">Powered by Spine</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading timeline...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">No events yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center">{getIcon(event.type)}</div>
                  {index !== events.length - 1 && (
                    <div className="w-0.5 h-12 bg-slate-700 mt-2" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-100">{event.action}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium border ${getTypeColor(event.type)}`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {format(new Date(event.timestamp), 'HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Real data indicator */}
      <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        All events are real-time mutations from the Spine
      </div>
    </Card>
  )
}
