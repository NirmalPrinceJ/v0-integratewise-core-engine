'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomerZeroBanner } from '@/components/customer-zero-banner'
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  Database,
  Users,
  Zap,
} from "lucide-react"

export function CommandCenterView() {

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
          {/* Department Canvas Content */}

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
