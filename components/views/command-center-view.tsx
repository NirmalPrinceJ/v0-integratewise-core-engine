'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomerZeroBanner } from '@/components/customer-zero-banner'
import { OperationalTimeline } from '@/components/operational-timeline'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock,
  Database,
  GitBranch,
  LucideIcon,
  Network,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'

interface KPICard {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  status?: 'healthy' | 'warning' | 'critical'
}

interface AgentRuntime {
  name: string
  status: 'running' | 'idle' | 'error'
  executionsToday: number
  avgDuration: string
}

const kpis: KPICard[] = [
  {
    title: 'Organization Health',
    value: '94%',
    change: 2,
    icon: BarChart3,
    status: 'healthy',
  },
  {
    title: "Today's Operations",
    value: '156',
    change: 12,
    icon: Activity,
    status: 'healthy',
  },
  {
    title: 'Active Agents',
    value: '7',
    change: 0,
    icon: Zap,
    status: 'healthy',
  },
  {
    title: 'Capability Executions',
    value: '42',
    change: 5,
    icon: CheckCircle2,
    status: 'healthy',
  },
  {
    title: 'Pending Approvals',
    value: '3',
    change: -1,
    icon: Clock,
    status: 'warning',
  },
  {
    title: 'Connector Health',
    value: '8/8',
    change: 0,
    icon: Network,
    status: 'healthy',
  },
]

const agents: AgentRuntime[] = [
  {
    name: 'Lead Qualification',
    status: 'running',
    executionsToday: 42,
    avgDuration: '2.3s',
  },
  {
    name: 'Account Health Score',
    status: 'running',
    executionsToday: 28,
    avgDuration: '1.8s',
  },
  {
    name: 'Proposal Generation',
    status: 'idle',
    executionsToday: 5,
    avgDuration: '4.2s',
  },
  {
    name: 'Support Routing',
    status: 'running',
    executionsToday: 18,
    avgDuration: '1.1s',
  },
  {
    name: 'Revenue Forecasting',
    status: 'idle',
    executionsToday: 1,
    avgDuration: '8.5s',
  },
  {
    name: 'Compliance Check',
    status: 'running',
    executionsToday: 12,
    avgDuration: '3.2s',
  },
]

const departments = [
  { name: 'Revenue', metric: '$482K', icon: TrendingUp, change: 12 },
  { name: 'Marketing', metric: '18 Campaigns', icon: Briefcase, change: 5 },
  { name: 'Support', metric: '24 Tickets', icon: Users, change: -3 },
  { name: 'Engineering', metric: '12 Deployments', icon: GitBranch, change: 0 },
]

export function CommandCenterView() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Customer Zero Banner */}
      <CustomerZeroBanner />

      {/* Main Grid */}
      <div className="grid gap-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.title} className="bg-slate-900 border-slate-700 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-slate-300">{kpi.title}</span>
                  </div>
                  {kpi.status && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        kpi.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">{kpi.value}</span>
                  {kpi.change !== undefined && (
                    <span className={`text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {kpi.change >= 0 ? '+' : ''}{kpi.change}% today
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Operational Timeline */}
          <OperationalTimeline />

          {/* Agent Runtime */}
          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Agent Runtime</h2>
                <span className="text-xs text-slate-400">7 Active</span>
              </div>

              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          agent.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.executionsToday} executions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-300">{agent.avgDuration}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs border-0 ${
                          agent.status === 'running'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : agent.status === 'error'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Live from Capability Runtime
            </div>
          </Card>
        </div>

        {/* Department Overview */}
        <Card className="bg-slate-900 border-slate-700 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Department Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept) => {
                const Icon = dept.icon
                return (
                  <div key={dept.name} className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-300">{dept.name}</span>
                    </div>
                    <p className="text-lg font-semibold text-white mb-1">{dept.metric}</p>
                    <p
                      className={`text-xs font-medium ${dept.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {dept.change >= 0 ? '+' : ''}{dept.change}% vs yesterday
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Platform Status */}
        <Card className="bg-slate-900 border-slate-700 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Platform Status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Platform Version</span>
                <p className="font-semibold text-white mt-1">v4.1.0</p>
              </div>
              <div>
                <span className="text-slate-400">API Version</span>
                <p className="font-semibold text-white mt-1">v2.0</p>
              </div>
              <div>
                <span className="text-slate-400">Governance</span>
                <p className="font-semibold text-emerald-400 mt-1">✓ Enabled</p>
              </div>
              <div>
                <span className="text-slate-400">Last Deployed</span>
                <p className="font-semibold text-white mt-1">Today 14:32</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
