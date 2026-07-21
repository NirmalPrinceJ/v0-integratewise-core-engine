"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, Clock } from "lucide-react"

export function TwinSignalFeed() {
  const signals = [
    {
      id: 1,
      type: "risk",
      title: "Acme Corp at churn risk",
      description: "Account health dropped 15% this week. Last engagement was 30 days ago.",
      confidence: 87,
      action: "Schedule renewal call",
      icon: AlertTriangle,
      color: "text-red-600",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "opportunity",
      title: "TechCorp expansion signal",
      description: "Contact changed role to VP. Similar accounts expanded within 60 days.",
      confidence: 79,
      action: "Prepare expansion proposal",
      icon: TrendingUp,
      color: "text-green-600",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "insight",
      title: "Sales cycle optimization",
      description: "Proposals in Q2 closed 18% faster with personalized video intro.",
      confidence: 92,
      action: "Use this approach for pending deals",
      icon: Lightbulb,
      color: "text-blue-600",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      type: "pattern",
      title: "Pattern match: Similar churn indicator",
      description: "StartUp Labs shows same pre-churn pattern as 2 accounts that churned Q1.",
      confidence: 75,
      action: "Proactive intervention plan",
      icon: AlertTriangle,
      color: "text-amber-600",
      timestamp: "1 day ago",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Twin Signal Feed</h2>
          <p className="text-sm text-muted-foreground">AI-generated insights and proposals from your Twin</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {signals.map((signal) => {
          const Icon = signal.icon
          return (
            <Card key={signal.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className={`flex-shrink-0 ${signal.color} mt-1`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{signal.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {signal.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{signal.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {signal.timestamp}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Dismiss</Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        {signal.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Button variant="outline" className="w-full">View All Signals (24 total)</Button>
    </div>
  )
}
