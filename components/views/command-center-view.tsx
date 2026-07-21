'use client'

import { useState, useCallback, useMemo } from 'react'
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
} from 'lucide-react'

/**
 * Enterprise-grade Command Center View
 * Implements the canonical 3-part workbench shell:
 * 1. L1 Global Shell (sticky header with 4 universal modules)
 * 2. Dynamic Department Canvas (scrollable content area)
 * 3. Twin Footer (sticky OODA action buttons)
 */

// Type definitions for enterprise safety
interface Alert {
  id: string
  type: 'warning' | 'info'
  message: string
}

interface TwinProposal {
  id: string
  action: string
  status: 'pending' | 'approved' | 'rejected'
}

interface Account {
  id: string
  name: string
  health: 'at-risk' | 'healthy'
  arr: string
  renewal: string
  owner: string
  lastTouch: string
  risk: 'High' | 'None'
}

// Mock data - replace with Platform API calls
const ALERTS: Alert[] = [
  { id: '1', type: 'warning', message: 'Acme renewal at risk' },
  { id: '2', type: 'info', message: 'Lead score improved: TechCorp Inc' },
]

const TWIN_PROPOSALS: TwinProposal[] = [
  { id: '1', action: 'Twin: Extend contract terms', status: 'pending' },
  { id: '2', action: 'Twin: Flag expansion opportunity', status: 'pending' },
]

const ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    health: 'at-risk',
    arr: '$250K',
    renewal: '30 days',
    owner: 'Sarah Chen',
    lastTouch: '2 days ago',
    risk: 'High',
  },
  {
    id: '2',
    name: 'TechCorp Inc',
    health: 'healthy',
    arr: '$125K',
    renewal: '120 days',
    owner: 'Mike Johnson',
    lastTouch: '5 days ago',
    risk: 'None',
  },
  {
    id: '3',
    name: 'StartUp Labs',
    health: 'healthy',
    arr: '$50K',
    renewal: '180 days',
    owner: 'Sarah Chen',
    lastTouch: '1 day ago',
    risk: 'None',
  },
]

export function CommandCenterView() {
  // Modal state management
  const [activeModal, setActiveModal] = useState<'store' | 'ask' | 'assign' | 'approve' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handlers with proper error boundaries
  const handleStoreInSpine = useCallback(async () => {
    setActiveModal('store')
    setIsLoading(false)
  }, [])

  const handleAskTwin = useCallback(async () => {
    setActiveModal('ask')
    setIsLoading(false)
  }, [])

  const handleAssignTwin = useCallback(async () => {
    setActiveModal('assign')
    setIsLoading(false)
  }, [])

  const handleApproveAction = useCallback(async () => {
    setActiveModal('approve')
    setIsLoading(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActiveModal(null)
    setIsLoading(false)
  }, [])

  // Memoized data computations
  const alertCount = useMemo(() => ALERTS.length, [])
  const proposalCount = useMemo(() => TWIN_PROPOSALS.length, [])
  const atRiskCount = useMemo(() => ACCOUNTS.filter((a) => a.health === 'at-risk').length, [])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Part 1: L1 Global Composed Workbench Shell (Sticky Top) */}
      <header className="sticky top-0 z-20 bg-slate-950 border-b border-slate-700 p-4 shadow-lg">
        <CustomerZeroBanner />
      </header>

      {/* Part 1 Continued: Four Universal Modules (L1 Global Shell) */}
      <nav
        className="sticky top-[88px] z-10 bg-slate-950 border-b border-slate-700 shadow-md"
        role="complementary"
        aria-label="Workbench control modules"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Module Row 1: Heads Up + Decide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Heads Up Alerts */}
            <Card className="bg-slate-900 border-slate-700 p-4 hover:bg-slate-800/50 transition-colors" role="region" aria-label="Heads Up Alerts">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                <h3 className="font-semibold text-white text-sm md:text-base">Heads Up</h3>
                <span className="ml-auto text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{alertCount}</span>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className={`text-sm p-2 rounded border ${
                      alert.type === 'warning'
                        ? 'bg-red-500/10 border-red-500/20 text-red-300'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                    }`}
                    role="alert"
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            </Card>

            {/* Decide Queue */}
            <Card className="bg-slate-900 border-slate-700 p-4 hover:bg-slate-800/50 transition-colors" role="region" aria-label="Decision Queue">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                <h3 className="font-semibold text-white text-sm md:text-base">Decide Queue</h3>
                <span className="ml-auto text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{proposalCount}</span>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {TWIN_PROPOSALS.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="text-sm p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-300"
                    role="option"
                  >
                    {proposal.action}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Module Row 2: Knowledge Hub + Daily Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Knowledge Hub */}
            <Card className="bg-slate-900 border-slate-700 p-4 hover:bg-slate-800/50 transition-colors" role="region" aria-label="Knowledge Hub">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                <h3 className="font-semibold text-white text-sm md:text-base">Knowledge Hub</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                SOP: Renewal negotiation playbook • Pattern: High NPS = expansion ready
              </p>
            </Card>

            {/* Daily Priorities */}
            <Card className="bg-slate-900 border-slate-700 p-4 hover:bg-slate-800/50 transition-colors" role="region" aria-label="Daily Priorities">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <h3 className="font-semibold text-white text-sm md:text-base">Daily Priorities</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                3 calls scheduled • 5 tasks due • Focus time: 2-3pm PST
              </p>
            </Card>
          </div>
        </div>
      </nav>

      {/* Part 2: Dynamic Department Canvas (Scrollable Middle) */}
      <main className="flex-1 overflow-y-auto bg-background" role="main">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Department Canvas Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">CSM Accounts Hub</h2>
            <p className="text-sm text-slate-400">
              Manage {ACCOUNTS.length} accounts • {atRiskCount} at risk
            </p>
          </div>

          {/* Account Grid */}
          <div className="grid grid-cols-1 gap-4">
            {ACCOUNTS.length > 0 ? (
              ACCOUNTS.map((account) => (
                <Card
                  key={account.id}
                  className="bg-slate-900 border-slate-700 hover:bg-slate-800/70 cursor-pointer transition-colors p-4 focus-within:ring-2 focus-within:ring-blue-500"
                  role="button"
                  tabIndex={0}
                  aria-label={`${account.name} - Health: ${account.health}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      // Navigate to account detail
                    }
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
                    <div className="sm:col-span-1">
                      <h3 className="font-medium text-white text-sm md:text-base">{account.name}</h3>
                      <p className="text-xs md:text-sm text-slate-400">Contact: {account.owner}</p>
                    </div>
                    <Badge
                      className={`justify-center text-xs w-fit ${
                        account.health === 'at-risk'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {account.health}
                    </Badge>
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
                    <Badge
                      className={`justify-center text-xs w-fit ${
                        account.risk === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {account.risk}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 w-full sm:w-auto"
                      aria-label={`View details for ${account.name}`}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-slate-900 border-slate-700 p-8 text-center">
                <p className="text-slate-400">No accounts found</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Part 3: Twin Footer (Sticky Bottom with 4 OODA Buttons) */}
      <footer className="sticky bottom-0 z-20 bg-slate-950 border-t border-slate-700 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 md:gap-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStoreInSpine}
            disabled={isLoading}
            aria-label="Store information in Spine"
          >
            <Database className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Store in Spine</span>
            <span className="sm:hidden">Store</span>
          </Button>
          <Button
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 md:px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAskTwin}
            disabled={isLoading}
            aria-label="Ask your Twin for insights"
          >
            <Zap className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Ask Your Twin</span>
            <span className="sm:hidden">Ask</span>
          </Button>
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 md:px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAssignTwin}
            disabled={isLoading}
            aria-label="Assign task to your Twin"
          >
            <Users className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Assign Your Twin</span>
            <span className="sm:hidden">Assign</span>
          </Button>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 md:px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleApproveAction}
            disabled={isLoading}
            aria-label="Approve pending actions"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Approve Action</span>
            <span className="sm:hidden">Approve</span>
          </Button>
        </div>
      </footer>

      {/* Modal state indicator (for future modal implementation) */}
      {activeModal && (
        <div className="sr-only" role="status" aria-live="polite">
          {activeModal} modal opened
        </div>
      )}
    </div>
  )
}
