'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, Users } from 'lucide-react'

export default function CustomerSuccessWorkbench() {
  return (
    <WorkbenchShell
      title="Customer Success"
      description="Customer health, renewals, and satisfaction"
      entityType="Customer"
      entityName="Strategic Accounts"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accounts at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-destructive">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renewals Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4</div>
            <p className="text-xs text-green-600">Stable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NPS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62</div>
            <p className="text-xs text-muted-foreground">+4 vs Q2</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" /> At-Risk Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'TechCorp Inc', issue: 'Low engagement (30 days)', health: '4.2', action: 'Call scheduled' },
              { name: 'GlobalTech', issue: 'High support tickets', health: '5.1', action: 'QBR needed' },
              { name: 'DataFlow Labs', issue: 'Renewal coming in 60 days', health: '6.8', action: 'Proposal ready' },
            ].map((account) => (
              <div key={account.name} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.issue}</p>
                </div>
                <div className="text-right">
                  <Badge variant={parseFloat(account.health) < 6 ? 'destructive' : 'default'}>
                    {account.health}
                  </Badge>
                  <p className="text-xs mt-1">{account.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
