'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Calendar, PieChart, TrendingUp } from 'lucide-react'

export default function MarketingWorkbench() {
  return (
    <WorkbenchShell
      title="Marketing"
      description="Campaign performance, lead generation, and attribution"
      entityType="Campaign"
      entityName="Q3 Product Launch"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+15% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">vs 2.8% last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CAC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$187</div>
            <p className="text-xs text-muted-foreground">-5% vs target</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Q3 Product Launch', channel: 'Email, Social, PPC', reach: '45K', engagement: '12.3%' },
              { name: 'Summer Promotion', channel: 'Email, Display', reach: '32K', engagement: '8.7%' },
              { name: 'Webinar Series', channel: 'Email, LinkedIn', reach: '18K', engagement: '6.2%' },
            ].map((campaign) => (
              <div key={campaign.name} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">{campaign.channel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{campaign.reach}</p>
                  <p className="text-xs text-green-600">{campaign.engagement}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
