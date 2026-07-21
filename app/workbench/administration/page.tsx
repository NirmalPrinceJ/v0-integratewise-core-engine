'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdministrationWorkbench() {
  return (
    <WorkbenchShell
      title="Administration"
      description="Organization settings, policies, and governance"
      entityType="Organization"
      entityName="IntegrateWise"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-green-600">All active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-green-600">Compliant</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { item: 'SSO/OAuth Configuration', status: 'Active', lastUpdated: 'Jul 15, 2026' },
              { item: 'API Rate Limiting', status: 'Active', lastUpdated: 'Jun 1, 2026' },
              { item: 'Audit Logging', status: 'Active', lastUpdated: 'Continuous' },
              { item: 'Backup & Recovery', status: 'Active', lastUpdated: 'Jul 20, 2026' },
            ].map((config) => (
              <div key={config.item} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{config.item}</p>
                  <p className="text-sm text-muted-foreground">Updated: {config.lastUpdated}</p>
                </div>
                <Badge variant="outline" className="bg-green-50">{config.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
