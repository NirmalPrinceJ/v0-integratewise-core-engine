'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Calendar, Users, CheckSquare } from 'lucide-react'

export default function OperationsWorkbench() {
  return (
    <WorkbenchShell title="Operations Workbench" context="Today's Tasks">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Tasks Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground mt-1">12 completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Next: 2pm EST</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground mt-1">Available: 18%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" /> Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91%</div>
              <p className="text-xs text-muted-foreground mt-1">vs baseline</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Status */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current status of major initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Platform Upgrade', progress: 75, status: 'on-track' },
                { name: 'Connector Integration', progress: 55, status: 'on-track' },
                { name: 'Documentation Update', progress: 90, status: 'complete' },
                { name: 'Performance Optimization', progress: 40, status: 'at-risk' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <Badge variant={item.status === 'on-track' ? 'default' : item.status === 'complete' ? 'secondary' : 'destructive'}>
                      {item.progress}%
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risks & Blockers */}
        <Card>
          <CardHeader>
            <CardTitle>Active Risks</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>⚠ Resource constraint on API team</p>
              <p>⚠ Delayed dependency from vendor</p>
              <p>✓ Deployment window confirmed for Friday</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
