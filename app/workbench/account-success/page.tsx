import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, AlertCircle, Target } from "lucide-react"

export default function AccountSuccessWorkbench() {
  const contextEntity = {
    id: "acme-corp-001",
    type: "Account",
    name: "Acme Corporation",
  }

  const kpis = [
    { label: "Health Score", value: "87%", trend: "+5%", icon: TrendingUp },
    { label: "Renewal Risk", value: "Low", trend: "Stable", icon: AlertCircle },
    { label: "Engagement", value: "High", trend: "+3%", icon: Users },
    { label: "NPS Score", value: "72", trend: "+8 pts", icon: Target },
  ]

  return (
    <WorkbenchShell
      title="Account Success Workbench"
      description="Manage account health, renewals, and customer relationships"
      contextEntity={contextEntity}
    >
      <div className="space-y-6">
        {/* Account Overview */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <Card key={kpi.label} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi.label}
                      </CardTitle>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {kpi.trend}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Active Contracts */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Active Contracts</h2>
          <div className="space-y-3">
            {[
              { product: "Enterprise Suite", renewal: "2026-03-15", days: 234 },
              { product: "Support Services", renewal: "2025-12-01", days: 128 },
              { product: "Professional Services", renewal: "2026-06-30", days: 345 },
            ].map((contract) => (
              <Card key={contract.product} className="bg-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{contract.product}</h3>
                      <p className="text-sm text-muted-foreground">
                        Renewal: {contract.renewal}
                      </p>
                    </div>
                    <Badge variant="secondary">{contract.days} days</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  "Contract renewal initiated",
                  "Support ticket resolved",
                  "Feature adoption increased",
                  "Executive sync scheduled",
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Actions You Can Take */}
        <section>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Use the action buttons below to:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                <strong>Store in Spine:</strong> Document account decisions and
                observations
              </li>
              <li>
                <strong>Ask Your Twin:</strong> Get analysis and recommendations
              </li>
              <li>
                <strong>Assign Your Twin:</strong> Plan renewal strategy or
                expansion
              </li>
              <li>
                <strong>Approve Action:</strong> Execute Twin recommendations
              </li>
            </ul>
          </div>
        </section>
      </div>
    </WorkbenchShell>
  )
}
