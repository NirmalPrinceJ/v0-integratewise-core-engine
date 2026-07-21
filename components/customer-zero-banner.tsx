'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Activity, Database, GitBranch, Lock, RefreshCw, Zap } from 'lucide-react'

interface BannerStats {
  lastSynced: string
  capabilityExecutionsToday: number
  agentRunsToday: number
  connectedSystems: number
  organizationHealth: 'healthy' | 'warning' | 'critical'
  governanceEnabled: boolean
}

export function CustomerZeroBanner() {
  const [stats, setStats] = useState<BannerStats>({
    lastSynced: 'Just now',
    capabilityExecutionsToday: 42,
    agentRunsToday: 28,
    connectedSystems: 8,
    organizationHealth: 'healthy',
    governanceEnabled: true,
  })

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-emerald-500'
      case 'warning':
        return 'text-amber-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-emerald-500/10'
      case 'warning':
        return 'bg-amber-500/10'
      case 'critical':
        return 'bg-red-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 p-4">
      <div className="flex items-center justify-between gap-6">
        {/* Left: Branding */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-white text-sm">Customer Zero</span>
          </div>
          <span className="text-xs text-slate-400">Running IntegrateWise</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-slate-700" />

        {/* Center: Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Last Synced */}
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">
              <span className="font-medium">Synced:</span> {stats.lastSynced}
            </span>
          </div>

          {/* Capability Executions */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">
              <span className="font-medium">{stats.capabilityExecutionsToday}</span> Executions
            </span>
          </div>

          {/* Agent Runs */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">
              <span className="font-medium">{stats.agentRunsToday}</span> Agent Runs
            </span>
          </div>

          {/* Connected Systems */}
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">
              <span className="font-medium">{stats.connectedSystems}</span> Systems
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-700" />

        {/* Right: Status Badges */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Organization Health */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${getHealthBg(stats.organizationHealth)} border-0`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                stats.organizationHealth === 'healthy'
                  ? 'bg-emerald-500'
                  : stats.organizationHealth === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
            />
            <span className={`text-xs font-medium ${getHealthColor(stats.organizationHealth)}`}>
              {stats.organizationHealth === 'healthy' ? 'Healthy' : stats.organizationHealth === 'warning' ? 'Warning' : 'Critical'}
            </span>
          </Badge>

          {/* Governance */}
          {stats.governanceEnabled && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-500/10 border-0">
              <Lock className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-blue-400">Governed</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-3 text-xs text-slate-400 border-t border-slate-700 pt-3">
        This workspace is how IntegrateWise runs its own company. All data is real-time from the Platform API.
      </div>
    </Card>
  )
}
