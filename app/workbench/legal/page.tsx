'use client'

import { WorkbenchShell } from '@/components/workbench/workbench-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function LegalWorkbench() {
  return (
    <WorkbenchShell
      title="Legal"
      description="Contracts, compliance, and risk management"
      entityType="Contract"
      entityName="Active Contracts"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">All parties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-yellow-600">Next 90 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-green-600">Compliant</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-destructive">Requires review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Expiring Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { contract: 'Microsoft Enterprise', expires: 'Aug 15, 2026', action: 'Renew' },
              { contract: 'AWS Services', expires: 'Sep 3, 2026', action: 'Review terms' },
              { contract: 'Legal Services', expires: 'Sep 20, 2026', action: 'Renegotiate' },
            ].map((item) => (
              <div key={item.contract} className="flex justify-between items-center pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.contract}</p>
                  <p className="text-sm text-muted-foreground">Expires: {item.expires}</p>
                </div>
                <Badge variant="outline">{item.action}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WorkbenchShell>
  )
}
