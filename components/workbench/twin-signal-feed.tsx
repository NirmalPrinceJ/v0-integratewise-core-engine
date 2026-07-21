'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingUp, Zap, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Signal {
  id: string
  type: 'risk' | 'opportunity' | 'action' | 'insight'
  title: string
  description: string
  entityId?: string
  entityType?: string
  confidence?: number
  timestamp: Date
  read: boolean
  proposalId?: string
}

interface TwinSignalFeedProps {
  entityId?: string
  entityType?: string
  maxSignals?: number
}

export function TwinSignalFeed({
  entityId,
  entityType,
  maxSignals = 5,
}: TwinSignalFeedProps) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching signals from Twin
    setIsLoading(true)
    const timer = setTimeout(() => {
      const mockSignals: Signal[] = [
        {
          id: '1',
          type: 'risk',
          title: 'Account at Risk',
          description: 'Acme Corp has not engaged in 30 days. NPS dropped 15 points.',
          entityId: 'acc-001',
          entityType: 'account',
          confidence: 0.92,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          proposalId: 'prop-001',
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Upsell Opportunity',
          description: 'Jane Smith at Acme changed role to VP Engineering. Potential expansion deal.',
          entityId: 'contact-001',
          entityType: 'contact',
          confidence: 0.78,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: false,
          proposalId: 'prop-002',
        },
        {
          id: '3',
          type: 'action',
          title: 'Schedule Renewal Call',
          description: 'Renewal date approaching: 45 days remaining for Acme Corp.',
          entityId: 'acc-001',
          entityType: 'account',
          confidence: 1.0,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: true,
          proposalId: 'prop-003',
        },
        {
          id: '4',
          type: 'insight',
          title: 'Similar Pattern Detected',
          description: 'TechVision Inc followed same engagement pattern before churning. Recommend proactive outreach.',
          entityId: 'acc-002',
          entityType: 'account',
          confidence: 0.85,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true,
          proposalId: 'prop-004',
        },
      ]

      setSignals(mockSignals.slice(0, maxSignals))
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [entityId, entityType, maxSignals])

  const unreadCount = signals.filter((s) => !s.read).length

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Twin Signals
          {unreadCount > 0 && (
            <Badge className="bg-primary/20 text-primary">{unreadCount}</Badge>
          )}
        </h3>
      </div>

      {/* Signal List */}
      {signals.length === 0 ? (
        <Card className="p-4 text-center text-muted-foreground">
          No signals at this time
        </Card>
      ) : (
        <div className="space-y-2">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  )
}

interface SignalCardProps {
  signal: Signal
}

function SignalCard({ signal }: SignalCardProps) {
  const typeConfig = {
    risk: {
      icon: AlertCircle,
      color: '#EF4444',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    },
    opportunity: {
      icon: TrendingUp,
      color: '#10B981',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
    },
    action: {
      icon: CheckCircle,
      color: '#3B82F6',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    insight: {
      icon: Clock,
      color: '#8B5CF6',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
  }

  const config = typeConfig[signal.type]
  const Icon = config.icon

  return (
    <Card
      className={`p-3 ${config.bg} border-l-4 cursor-pointer hover:shadow-md transition`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{signal.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
            </div>

            {signal.confidence !== undefined && (
              <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                {Math.round(signal.confidence * 100)}%
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
            </span>
            {signal.proposalId && (
              <Button size="sm" variant="ghost" className="h-6 text-xs">
                View Proposal
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
