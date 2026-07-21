"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Users, BarChart3, Plus, ArrowRight } from "lucide-react"

export function SalesWorkbench() {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sales Workbench</h1>
        <p className="text-muted-foreground">Pipeline, opportunities, and deals management</p>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Open Deals" value="24" trend="$485K total" />
        <MetricCard label="Win Rate" value="42%" trend="+5% vs last month" />
        <MetricCard label="Avg Deal Size" value="$20.2K" trend="-$2K vs avg" />
        <MetricCard label="Sales Cycle" value="45 days" trend="-5 days trend" />
      </div>

      {/* Pipeline View */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sales Pipeline</h2>
        <div className="grid grid-cols-5 gap-4">
          {["Prospect", "Qualified", "Proposal", "Negotiation", "Closed"].map((stage) => (
            <PipelineStage key={stage} stage={stage} />
          ))}
        </div>
      </div>

      {/* Active Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Opportunities</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>
        <div className="space-y-2">
          {[
            { name: "Acme Corp - Enterprise Plan", stage: "Proposal", value: "$125K", close: "15 days" },
            { name: "TechCorp Inc - Expansion", stage: "Negotiation", value: "$85K", close: "22 days" },
            { name: "StartUp Labs - Annual", stage: "Qualified", value: "$45K", close: "35 days" },
          ].map((opp) => (
            <OpportunityRow key={opp.name} opportunity={opp} />
          ))}
        </div>
      </div>

      {/* 4 OODA Buttons */}
      <OODAButtonRow />
    </div>
  )
}

function MetricCard({ label, value, trend }: any) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </Card>
  )
}

function PipelineStage({ stage }: any) {
  return (
    <Card className="p-4 text-center">
      <p className="font-semibold mb-3">{stage}</p>
      <div className="space-y-1 mb-3">
        <div className="text-sm text-muted-foreground">6 deals</div>
        <div className="text-lg font-bold">$120K</div>
      </div>
      <Button variant="outline" size="sm" className="w-full">View</Button>
    </Card>
  )
}

function OpportunityRow({ opportunity }: any) {
  return (
    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex-1">
        <p className="font-medium">{opportunity.name}</p>
        <p className="text-sm text-muted-foreground">Closes in {opportunity.close}</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="outline">{opportunity.stage}</Badge>
        <p className="font-semibold">{opportunity.value}</p>
        <Button variant="ghost" size="sm">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

function OODAButtonRow() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Take action on this opportunity:</p>
      <div className="grid grid-cols-4 gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700">Store in Spine</Button>
        <Button className="bg-cyan-600 hover:bg-cyan-700">Ask Your Twin</Button>
        <Button className="bg-purple-600 hover:bg-purple-700">Assign Your Twin</Button>
        <Button className="bg-green-600 hover:bg-green-700">Approve Action</Button>
      </div>
    </div>
  )
}
