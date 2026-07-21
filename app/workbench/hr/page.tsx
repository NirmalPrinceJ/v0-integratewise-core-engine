'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Briefcase, TrendingUp, AlertCircle } from 'lucide-react'

export default function HRWorkbench() {
  return (
    <WorkbenchShell
      title="Human Resources"
      description="People, hiring, engagement, and compliance"
      entityType="Person"
      entityName="Active Employees"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+5 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-destructive">3 priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.6</div>
            <p className="text-xs text-green-600">+0.4 vs last survey</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">Annualized</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { role: 'Senior Engineer', team: 'Platform', posted: '25 days', candidates: 12, status: 'Interviews' },
              { role: 'Product Manager', team: 'Product', posted: '10 days', candidates: 8, status: 'Screening' },
              { role: 'Sales Rep', team: 'Sales', posted: '3 days', candidates: 5, status: 'Candidates' },
            ].map((job) => (
              <div key={job.role} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{job.role}</p>
                  <p className="text-sm text-muted-foreground">{job.team} • Posted {job.posted}</p>
                </div>
                <div className="text-right">
                  <Badge>{job.status}</Badge>
                  <p className="text-xs mt-1">{job.candidates} candidates</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
