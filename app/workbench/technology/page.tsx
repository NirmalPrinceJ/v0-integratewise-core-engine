'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, GitBranch, AlertTriangle, Server } from 'lucide-react'

export default function TechnologyWorkbench() {
  return (
    <WorkbenchShell title="Technology Workbench" context="Engineering">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Code className="w-4 h-4" /> Open Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground mt-1">5 critical</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> PRs Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Avg review: 2h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="w-4 h-4" /> Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.98%</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Deployments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { version: 'v4.2.1', date: 'Today 2:30 PM', status: 'success' },
                { version: 'v4.2.0', date: 'Yesterday 5:15 PM', status: 'success' },
                { version: 'v4.1.9', date: '2 days ago', status: 'success' },
                { version: 'v4.1.8', date: '3 days ago', status: 'warning' },
              ].map((item) => (
                <div key={item.version} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.version}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge variant={item.status === 'success' ? 'secondary' : 'destructive'}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Current metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✓ API Response Time: 142ms (target: &lt;200ms)</p>
              <p>✓ Database Query Time: 45ms (target: &lt;50ms)</p>
              <p>✓ Cache Hit Rate: 94% (target: &gt;90%)</p>
              <p>⚠ Memory Usage: 78% (target: &lt;70%)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
