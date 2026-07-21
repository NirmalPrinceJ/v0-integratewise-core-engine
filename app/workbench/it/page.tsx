'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle, Lock, Server } from 'lucide-react'

export default function ITWorkbench() {
  return (
    <WorkbenchShell
      title="IT Operations"
      description="Infrastructure, security, and system health"
      entityType="System"
      entityName="Production Infrastructure"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.97%</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-yellow-600">1 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Backlog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Avg resolution 4h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" /> Infrastructure Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: 'API Gateway', status: 'Healthy', latency: '45ms', cpu: '32%' },
              { service: 'Database Cluster', status: 'Healthy', latency: '12ms', cpu: '58%' },
              { service: 'Cache Layer', status: 'Healthy', latency: '2ms', cpu: '41%' },
            ].map((service) => (
              <div key={service.service} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{service.service}</p>
                  <p className="text-sm text-muted-foreground">Latency: {service.latency}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50">{service.status}</Badge>
                  <p className="text-xs mt-1">CPU: {service.cpu}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
