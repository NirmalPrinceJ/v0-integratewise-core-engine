'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react'

export default function ProcurementWorkbench() {
  return (
    <WorkbenchShell
      title="Procurement"
      description="Vendor management, RFQs, and spend analytics"
      entityType="Vendor"
      entityName="Active Vendors"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Tier 1 & 2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">In evaluation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-green-600">-3% vs budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Payment Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">On time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> Open Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { vendor: 'Tech Supplies Inc', amount: '$45,200', status: 'Approved', days: 'Due in 5 days' },
              { vendor: 'Cloud Services Ltd', amount: '$82,500', status: 'Processing', days: 'Due in 12 days' },
              { vendor: 'Office Equipment Co', amount: '$12,800', status: 'Pending', days: 'Due in 8 days' },
            ].map((po) => (
              <div key={po.vendor} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{po.vendor}</p>
                  <p className="text-sm text-muted-foreground">{po.days}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{po.status}</Badge>
                  <p className="text-sm font-medium mt-1">{po.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
