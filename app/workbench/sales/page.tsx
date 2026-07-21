'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react'

export default function SalesWorkbench() {
  return (
    <WorkbenchShell title="Sales Workbench" context="Q3 Pipeline">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground mt-1">+12% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Active Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground mt-1">8 at close</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" /> Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34%</div>
              <p className="text-xs text-muted-foreground mt-1">Industry: 28%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Quota Attainment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground mt-1">$1.9M of $2.4M</p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
            <CardDescription>Current distribution of active deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: 'Prospect', count: 12, value: '$240K' },
                { stage: 'Qualified', count: 18, value: '$890K' },
                { stage: 'Negotiation', count: 12, value: '$980K' },
                { stage: 'Close', count: 5, value: '$290K' },
              ].map((item) => (
                <div key={item.stage} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.stage}</p>
                    <p className="text-xs text-muted-foreground">{item.count} deals</p>
                  </div>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Last 24 hours across pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✓ Demo completed with Acme Corp</p>
              <p>✓ Proposal sent to TechStart Inc</p>
              <p>✓ Contract signed with Global Solutions</p>
              <p>⚠ Followup needed: Enterprise Corp</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
