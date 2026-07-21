'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Save,
  Brain,
  Zap,
  CheckCircle2,
  X,
  ChevronDown,
  Loader,
} from 'lucide-react'
import { useTwinSignals } from '@/lib/hooks/use-twin'
import type { TwinSignal } from '@/lib/ai/twin/engine'

interface WorkbenchShellProps {
  title: string
  department?: string
  children: ReactNode
  onStoreInSpine?: () => void
  onAskTwin?: () => void
  onAssignTwin?: () => void
  onApproveAction?: () => void
  isLoading?: boolean
}

export function WorkbenchShell({
  title,
  department,
  children,
  onStoreInSpine,
  onAskTwin,
  onAssignTwin,
  onApproveAction,
  isLoading = false,
}: WorkbenchShellProps) {
  const [showTwinSignals, setShowTwinSignals] = useState(false)
  const { signals, isLoading: signalsLoading } = useTwinSignals()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {department && (
                <p className="text-sm text-muted-foreground mt-1">{department} Workbench</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {showTwinSignals && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1 text-xs font-medium text-primary">
                  Twin signals active
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </div>
      </main>

      {/* Sticky Footer with OODA Buttons */}
      <footer className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {/* OODA Buttons */}
            <Button
              onClick={onStoreInSpine}
              disabled={isLoading}
              variant="default"
              className="gap-2"
              title="Observe: Capture evidence, decisions, or notes in Spine"
            >
              <Save className="w-4 h-4" />
              <span>Store in Spine</span>
            </Button>

            <Button
              onClick={onAskTwin}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
              title="Orient: Ask Twin to query and analyze with workspace context"
            >
              <Brain className="w-4 h-4" />
              <span>Ask Twin</span>
            </Button>

            <Button
              onClick={onAssignTwin}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
              title="Decide: Assign Twin an objective to plan and prepare"
            >
              <Zap className="w-4 h-4" />
              <span>Assign Twin</span>
            </Button>

            <Button
              onClick={onApproveAction}
              disabled={isLoading}
              variant="outline"
              className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Act: Approve governance, execute action"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Action</span>
            </Button>

            <div className="flex-1" />

            {/* Twin Signals Toggle */}
            <Button
              onClick={() => setShowTwinSignals(!showTwinSignals)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <span className="text-xs">Twin Signals</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTwinSignals ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Twin Signals Feed (Collapsible) */}
          {showTwinSignals && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-muted-foreground">Twin Signals</div>
                {signalsLoading && <Loader className="w-3 h-3 animate-spin" />}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {signals && signals.length > 0 ? (
                  signals.map((signal: TwinSignal) => (
                    <TwinSignalCard
                      key={signal.id}
                      type={signal.type}
                      title={signal.title}
                      message={signal.description}
                      confidence={signal.confidence}
                    />
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-2">No signals at this time</div>
                )}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

interface TwinSignalCardProps {
  type: 'risk' | 'opportunity' | 'action' | 'insight'
  title: string
  message: string
  confidence: number
}

function TwinSignalCard({ type, title, message, confidence }: TwinSignalCardProps) {
  const colors = {
    risk: 'bg-red-50 border-red-200 text-red-900',
    opportunity: 'bg-green-50 border-green-200 text-green-900',
    action: 'bg-blue-50 border-blue-200 text-blue-900',
    insight: 'bg-purple-50 border-purple-200 text-purple-900',
  }

  return (
    <div className={`border rounded px-3 py-2 text-xs ${colors[type]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="opacity-80 mt-1">{message}</p>
          <p className="opacity-60 mt-1">Confidence: {Math.round(confidence * 100)}%</p>
        </div>
      </div>
    </div>
  )
}
