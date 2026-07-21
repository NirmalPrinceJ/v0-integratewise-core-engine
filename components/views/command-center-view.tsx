'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Mail,
  Network,
  Settings,
  TrendingUp,
  Users,
  Zap,
  ListTodo,
  ThumbsUp,
  Rocket,
  ShoppingCart,
  Truck,
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
  const [storeOpen, setStoreOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Part 1: L1 Global Composed Workbench Shell (Sticky Top) */}
      <div className="sticky top-0 z-20 bg-slate-950 border-b border-slate-700 p-4">
        <CustomerZeroBanner />
      </div>

      {/* Part 1 Continued: Four Universal Modules (L1 Global Shell) */}
      <div className="sticky top-[100px] z-10 bg-slate-950 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Module Row 1: Heads Up + Decide */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Heads Up Alerts */}
            <Card className="bg-slate-900 border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-white">Heads Up</h3>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                <div className="text-sm p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300">⚠️ Acme renewal at risk</div>
                <div className="text-sm p-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300">🎯 Lead score improved: TechCorp Inc</div>
              </div>
            </Card>

            {/* Decide Queue */}
            <Card className="bg-slate-900 border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-white">Decide Queue</h3>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                <div className="text-sm p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-300">Twin: Extend contract terms</div>
                <div className="text-sm p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-300">Twin: Flag expansion opportunity</div>
              </div>
            </Card>
          </div>

          {/* Module Row 2: Knowledge Hub + Daily Priorities */}
          <div className="grid grid-cols-2 gap-4">
            {/* Knowledge Hub */}
            <Card className="bg-slate-900 border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-white">Knowledge Hub</h3>
              </div>
              <div className="text-sm text-slate-400">SOP: Renewal negotiation playbook • Pattern: High NPS = expansion ready</div>
            </Card>

            {/* Daily Priorities */}
            <Card className="bg-slate-900 border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-white">Daily Priorities</h3>
              </div>
              <div className="text-sm text-slate-400">3 calls scheduled • 5 tasks due • Focus time: 2-3pm PST</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Part 2: Dynamic Department Canvas (Scrollable Middle) */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
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
        </TabsContent>

          {/* Department Canvas Content - CSM Hub Example */}
          <h2 className="text-lg font-semibold text-white mb-4">CSM Accounts Hub</h2>
          
          {/* Account Grid */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'Acme Corporation', health: 'at-risk', arr: '$250K', renewal: '30 days', owner: 'Sarah Chen', lastTouch: '2 days ago', risk: 'High' },
              { name: 'TechCorp Inc', health: 'healthy', arr: '$125K', renewal: '120 days', owner: 'Mike Johnson', lastTouch: '5 days ago', risk: 'None' },
              { name: 'StartUp Labs', health: 'healthy', arr: '$50K', renewal: '180 days', owner: 'Sarah Chen', lastTouch: '1 day ago', risk: 'None' },
            ].map((account, i) => (
              <Card key={i} className="bg-slate-900 border-slate-700 hover:bg-slate-800/70 cursor-pointer transition p-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div>
                    <h3 className="font-medium text-white">{account.name}</h3>
                    <p className="text-sm text-slate-400">Contact: {account.owner}</p>
                  </div>
                  <Badge className={`justify-center text-xs ${account.health === 'at-risk' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{account.health}</Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{account.arr}</p>
                    <p className="text-xs text-slate-400">ARR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{account.renewal}</p>
                    <p className="text-xs text-slate-400">Renewal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{account.lastTouch}</p>
                    <p className="text-xs text-slate-500">Last Touch</p>
                  </div>
                  <Badge className={`justify-center text-xs ${account.risk === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>{account.risk}</Badge>
                  <Button size="sm" variant="outline" className="border-slate-600">View</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Twin Footer (Sticky Bottom with 4 OODA Buttons) */}
      <div className="sticky bottom-0 z-20 bg-slate-950 border-t border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 flex items-center gap-2"
            onClick={() => setStoreOpen(true)}
          >
            <Database className="w-5 h-5" />
            Store in Spine
          </Button>
          <Button 
            size="lg" 
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 flex items-center gap-2"
            onClick={() => setAskOpen(true)}
          >
            <Zap className="w-5 h-5" />
            Ask Your Twin
          </Button>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 flex items-center gap-2"
            onClick={() => setAssignOpen(true)}
          >
            <Users className="w-5 h-5" />
            Assign Your Twin
          </Button>
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 flex items-center gap-2"
            onClick={() => setApproveOpen(true)}
          >
            <CheckCircle2 className="w-5 h-5" />
            Approve Action
          </Button>
        </div>
      </div>
    </div>
  )
}
