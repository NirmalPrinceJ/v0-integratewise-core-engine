'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { useSpineEntities, useCreateSpineEntity } from '@/lib/hooks/use-spine'
import { useAuthSession } from '@/lib/integratewise'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  Users,
  Target,
  AlertCircle,
  Plus,
  Edit2,
  Loader,
} from 'lucide-react'

export default function SalesWorkbenchPage() {
  const router = useRouter()
  const { session } = useAuthSession()
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [storeNote, setStoreNote] = useState('')

  // Fetch opportunities from Spine
  const { entities: opportunities, isLoading: oppLoading } = useSpineEntities('opportunity')
  
  // Fetch deals from Spine
  const { entities: deals, isLoading: dealsLoading } = useSpineEntities('deal')
  
  // Fetch tasks from Spine
  const { entities: tasks, isLoading: tasksLoading } = useSpineEntities('task')

  // Hooks for creating entities
  const { create: createOpportunity, isLoading: creatingOpp } = useCreateSpineEntity('opportunity')
  const { create: createTask, isLoading: creatingTask } = useCreateSpineEntity('task')

  const isLoading = oppLoading || dealsLoading || tasksLoading || creatingOpp || creatingTask

  const handleStoreInSpine = useCallback(async () => {
    if (!storeNote.trim()) return
    
    try {
      // Store the note as a task/note in Spine
      await createTask({
        title: `Sales Note: ${storeNote.substring(0, 50)}...`,
        description: storeNote,
        status: 'open',
        priority: 'medium',
      })
      
      setStoreNote('')
      setShowStoreModal(false)
    } catch (error) {
      console.error('[v0] Failed to store note:', error)
    }
  }, [storeNote, createTask])

  const handleAskTwin = useCallback(() => {
    // TODO: Open Twin query interface
    console.log('[v0] Ask Twin - context:', { opportunities: opportunities.length, deals: deals.length })
  }, [opportunities, deals])

  const handleAssignTwin = useCallback(() => {
    // TODO: Open Twin assignment modal
    console.log('[v0] Assign Twin - create proposal')
  }, [])

  const handleApproveAction = useCallback(() => {
    // TODO: Open approval flow
    console.log('[v0] Approve Action')
  }, [])

  return (
    <WorkbenchShell
      title="Sales Pipeline"
      department="Sales"
      isLoading={isLoading}
      onStoreInSpine={() => setShowStoreModal(true)}
      onAskTwin={handleAskTwin}
      onAssignTwin={handleAssignTwin}
      onApproveAction={handleApproveAction}
    >
      <Tabs defaultValue="pipeline" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline" className="gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Opportunities</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        {/* Pipeline View */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard label="Won This Quarter" value="$2.4M" trend="+12%" />
            <MetricCard label="In Progress" value="$5.1M" trend="+8%" />
            <MetricCard label="At Risk" value="$1.2M" trend="-3%" />
            <MetricCard label="Forecast" value="$8.7M" trend="+15%" />
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Deal Stages</h3>
            <div className="space-y-3">
              {deals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No deals in Spine yet</p>
                  <Button className="mt-4" onClick={() => setShowStoreModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Deal
                  </Button>
                </div>
              ) : (
                deals.slice(0, 5).map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition">
                    <div>
                      <p className="font-medium">{deal.data?.name || 'Untitled Deal'}</p>
                      <p className="text-sm text-muted-foreground">{deal.data?.stage || 'Unknown Stage'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${deal.data?.value || 0}</p>
                      <p className="text-xs text-muted-foreground">{deal.data?.probability || 0}% chance</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Open Opportunities</h3>
              <Button size="sm" variant="outline" onClick={() => setShowStoreModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            <div className="space-y-2">
              {opportunities.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No opportunities in Spine</p>
              ) : (
                opportunities.slice(0, 10).map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{opp.data?.name || 'Untitled'}</p>
                      <p className="text-xs text-muted-foreground">{opp.data?.account_id || 'No Account'}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Tasks</h3>
              <Button size="sm" variant="outline" onClick={() => setShowStoreModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No tasks assigned</p>
              ) : (
                tasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{task.data?.title || 'Untitled Task'}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {task.data?.due_date ? new Date(task.data.due_date as string).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.data?.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.data?.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.data?.priority || 'medium'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Sales Team</h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>Team members will appear here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Store in Spine Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Store Evidence in Spine</h2>
              <textarea
                value={storeNote}
                onChange={(e) => setStoreNote(e.target.value)}
                placeholder="What should we remember about this?"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStoreModal(false)
                    setStoreNote('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStoreInSpine}
                  disabled={!storeNote.trim() || creatingTask}
                  className="flex-1 gap-2"
                >
                  {creatingTask && <Loader className="w-4 h-4 animate-spin" />}
                  Store
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </WorkbenchShell>
  )
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend} vs last quarter
      </p>
    </Card>
  )
}
