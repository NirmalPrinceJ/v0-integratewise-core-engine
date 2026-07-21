'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, FileText, PieChart } from 'lucide-react'

export default function FinanceWorkbench() {
  return (
    <WorkbenchShell title="Finance Workbench" context="FY2024">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$18.4M</div>
              <p className="text-xs text-muted-foreground mt-1">+22% YoY</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.53M</div>
              <p className="text-xs text-muted-foreground mt-1">+8% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" /> Invoices Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$340K</div>
              <p className="text-xs text-muted-foreground mt-1">23 invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChart className="w-4 h-4" /> Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.1M</div>
              <p className="text-xs text-muted-foreground mt-1">66% of revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
            <CardDescription>Current fiscal year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { product: 'Platform', revenue: '$8.2M', percent: 45 },
                { product: 'Connectors', revenue: '$5.4M', percent: 29 },
                { product: 'Services', revenue: '$3.1M', percent: 17 },
                { product: 'Support', revenue: '$1.7M', percent: 9 },
              ].map((item) => (
                <div key={item.product} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.product}</p>
                    <Badge variant="secondary">{item.revenue}</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Position</CardTitle>
            <CardDescription>Liquidity and runway</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>Cash on Hand: $24.5M</p>
              <p>Runway: 24+ months</p>
              <p>Monthly Burn: $1.01M</p>
              <p>✓ All payables current</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
