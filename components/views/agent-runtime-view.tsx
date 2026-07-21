"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Boxes, Gauge, Timer } from "lucide-react"
import { platform } from "@/lib/platform"
import { WorkspaceHeader, SectionCard, StatTile, StatusDot } from "@/components/platform/primitives"

function relative(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  return `${Math.round(mins / 60)}h ago`
}

export function AgentRuntimeView() {
  const agents = platform.agentRuntime.list()
  const active = platform.agentRuntime.active()
  const runsToday = platform.agentRuntime.runsToday()
  const avgConfidence = Math.round(agents.reduce((n, a) => n + a.confidence, 0) / agents.length)

  return (
    <div className="space-y-6 p-6">
      <WorkspaceHeader
        eyebrow="Platform · Agent Runtime"
        title="Agent Runtime"
        description="Every agent is a production worker running IntegrateWise. This is the work they are performing right now — not a showcase."
        surfaces={["agent-runtime", "capabilities"]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Active Workers" value={`${active}/${agents.length}`} icon={<Bot className="h-4 w-4 text-primary" />} accent />
        <StatTile label="Runs Today" value={`${runsToday}`} icon={<Boxes className="h-4 w-4 text-primary" />} />
        <StatTile label="Avg Confidence" value={`${avgConfidence}%`} icon={<Gauge className="h-4 w-4 text-primary" />} />
        <StatTile label="Capabilities Executed" value={`${platform.capabilities.executedToday()}`} icon={<Timer className="h-4 w-4 text-primary" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <Card key={a.id} className="bg-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{a.department.replace("-", " ")}</p>
                  </div>
                </div>
                <StatusDot status={a.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Today&apos;s executions</p>
                  <p className="text-xl font-bold">{a.executionsToday}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{a.itemsLabel}</p>
                  <p className="text-xl font-bold">{a.itemsProcessed}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average execution</p>
                  <p className="text-sm font-semibold">{a.avgExecutionSeconds}s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm font-semibold">{a.confidence}%</p>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${a.confidence}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {a.capabilities.map((c) => (
                    <Badge key={c} variant="secondary" className="bg-primary/10 text-[11px] text-primary">
                      {c}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{relative(a.lastRun)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionCard title="Platform Capabilities" surface="capabilities" description="The reusable capabilities agents compose to do their work">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Capability</th>
                <th className="pb-2 font-medium">Executions today</th>
                <th className="pb-2 font-medium">Avg latency</th>
                <th className="pb-2 font-medium">Success rate</th>
              </tr>
            </thead>
            <tbody>
              {platform.capabilities.list().map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 font-medium">{c.name}</td>
                  <td className="py-2.5">{c.executionsToday}</td>
                  <td className="py-2.5 text-muted-foreground">{c.avgLatencyMs} ms</td>
                  <td className="py-2.5">{c.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
