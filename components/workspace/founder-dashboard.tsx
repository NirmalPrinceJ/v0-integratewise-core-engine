"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, BarChart3, AlertCircle, Plus, ArrowRight } from "lucide-react"

export function FounderDashboard() {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Founder Dashboard</h1>
        <p className="text-muted-foreground">Your startup's operational hub. Unified view of customers, team, and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Active Accounts" value="24" trend="+3 this week" color="blue" />
        <MetricCard label="Pipeline Value" value="$485K" trend="+$120K this month" color="green" />
        <MetricCard label="Team Members" value="12" trend="2 open roles" color="purple" />
        <MetricCard label="Critical Tasks" value="8" trend="Due this week" color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickCard title="Accounts" desc="24 accounts" action="View All" />
        <QuickCard title="Sales Pipeline" desc="$485K in deals" action="View Deals" />
        <QuickCard title="Team" desc="12 members" action="Manage Team" />
        <QuickCard title="Calendar" desc="8 meetings this week" action="View Calendar" />
        <QuickCard title="Knowledge" desc="24 documents" action="Browse Docs" />
        <QuickCard title="Activity" desc="Real-time updates" action="View All" />
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Enable AI-Powered Operations</h3>
            <p className="text-muted-foreground">Let your Twin observe and propose actions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Enable Twin</Button>
        </div>
      </Card>
    </div>
  )
}

function MetricCard({ label, value, trend, color }: any) {
  const colors = { blue: "bg-blue-50", green: "bg-green-50", purple: "bg-purple-50", red: "bg-red-50" }
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </Card>
  )
}

function QuickCard({ title, desc, action }: any) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{desc}</p>
      <Button variant="outline" size="sm" className="w-full">{action}</Button>
    </Card>
  )
}
