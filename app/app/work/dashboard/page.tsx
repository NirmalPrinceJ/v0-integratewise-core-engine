'use client'

import { useRouter } from 'next/navigation'
import { useAuthSession, useWorkbench, type Department } from '@/lib/integratewise'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Users,
  Briefcase,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  Loader,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const DEPARTMENTS: Array<{ value: Department; label: string }> = [
  { value: 'SALES', label: 'Sales' },
  { value: 'CUSTOMER_SUCCESS', label: 'Customer Success' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'PRODUCT_ENGINEERING', label: 'Product Engineering' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useAuthSession()
  const [selectedDept, setSelectedDept] = useState<Department>('SALES')
  const { workbench, loading: workbenchLoading, error } = useWorkbench(
    session,
    selectedDept
  )

  // Redirect to login if no session
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login')
    }
  }, [session, sessionLoading, router])

  if (sessionLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Workspace Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time operational data from your connected systems
        </p>
      </div>

      {/* Department Selector */}
      <div className="flex gap-2">
        {DEPARTMENTS.map((dept) => (
          <Button
            key={dept.value}
            variant={selectedDept === dept.value ? 'default' : 'outline'}
            onClick={() => setSelectedDept(dept.value)}
          >
            {dept.label}
          </Button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {workbenchLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : workbench ? (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workbench.entities.account && (
              <MetricCard
                icon={Briefcase}
                label="Accounts"
                value={workbench.entities.account.length}
              />
            )}
            {workbench.entities.person && (
              <MetricCard
                icon={Users}
                label="People"
                value={workbench.entities.person.length}
              />
            )}
            {workbench.entities.deal && (
              <MetricCard
                icon={TrendingUp}
                label="Deals"
                value={workbench.entities.deal.length}
              />
            )}
            {workbench.entities.task && (
              <MetricCard
                icon={CheckSquare}
                label="Tasks"
                value={workbench.entities.task.length}
              />
            )}
          </div>

          {/* Readiness */}
          {workbench.readiness && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Readiness Score</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall</span>
                  <span className="text-lg font-bold">
                    {Math.round(workbench.readiness.overall_score * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${workbench.readiness.overall_score * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                  Status: {workbench.readiness.overall_state}
                </p>
              </div>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="entities" className="space-y-4">
            <TabsList>
              <TabsTrigger value="entities">Entities</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            </TabsList>

            {/* Entities Tab */}
            <TabsContent value="entities" className="space-y-4">
              {workbench.entities.deal && workbench.entities.deal.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Deals</h3>
                  <div className="space-y-3">
                    {workbench.entities.deal.slice(0, 5).map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{deal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            From {deal.source_tool}
                          </p>
                        </div>
                        <span className="text-sm font-semibold capitalize px-2 py-1 rounded bg-primary/10 text-primary">
                          {deal.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {workbench.entities.account && workbench.entities.account.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Accounts</h3>
                  <div className="space-y-3">
                    {workbench.entities.account.slice(0, 5).map((account) => (
                      <div
                        key={account.id}
                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {account.metadata?.industry || 'Unknown industry'}
                          </p>
                        </div>
                        <span className="text-sm px-2 py-1 rounded bg-accent/10">
                          {account.source_tool}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Signals Tab */}
            <TabsContent value="signals" className="space-y-4">
              {workbench.signals && workbench.signals.length > 0 ? (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Activity Signals</h3>
                  <div className="space-y-3">
                    {workbench.signals.slice(0, 10).map((signal) => (
                      <div
                        key={signal.id}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${
                            signal.severity === 'critical'
                              ? 'bg-destructive'
                              : signal.severity === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{signal.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(signal.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>No signals at this time</p>
                </Card>
              )}
            </TabsContent>

            {/* Capabilities Tab */}
            <TabsContent value="capabilities" className="space-y-4">
              {workbench.capabilities && workbench.capabilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workbench.capabilities.map((cap) => (
                    <Card key={cap.name} className="p-4">
                      <p className="font-medium text-sm">{cap.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status:{' '}
                        <span className="capitalize font-semibold text-foreground">
                          {cap.status}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last sync: {new Date(cap.last_sync).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>No capabilities configured</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Provenance */}
          {workbench.provenance && (
            <Card className="p-4 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                Data composed by {workbench.composed_by} at{' '}
                {new Date(workbench.composed_at).toLocaleString()} • Confidence:{' '}
                {Math.round(workbench.provenance.confidence * 100)}%
              </p>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No data available</p>
        </Card>
      )}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
