'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, HelpCircle } from 'lucide-react'

export default function SupportWorkbench() {
  return (
    <WorkbenchShell title="Support Workbench" context="Active Tickets">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground mt-1">5 urgent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14m</div>
              <p className="text-xs text-muted-foreground mt-1">SLA: 30m</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Resolved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">CSAT: 4.8/5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Self-Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground mt-1">KB hit rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Current queue status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { priority: 'Critical', count: 2, time: '< 1 hour', status: 'critical' },
                { priority: 'High', count: 5, time: '2-4 hours', status: 'warning' },
                { priority: 'Medium', count: 10, time: '1 day', status: 'default' },
                { priority: 'Low', count: 6, time: '3 days', status: 'secondary' },
              ].map((item) => (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.priority}</p>
                    <p className="text-xs text-muted-foreground">Response: {item.time}</p>
                  </div>
                  <Badge variant={item.status as any}>{item.count} tickets</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Status */}
        <Card>
          <CardHeader>
            <CardTitle>Team Status</CardTitle>
            <CardDescription>Support agent availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✓ Sarah Chen - Online (3 tickets)</p>
              <p>✓ Marcus Johnson - Online (4 tickets)</p>
              <p>✓ Lisa Park - Online (2 tickets)</p>
              <p>⊘ James Wilson - Break (returns in 15m)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
