"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { platform } from "@/lib/platform"
import { WorkspaceHeader, SectionCard } from "@/components/platform/primitives"

export function EvidenceView() {
  const evidence = platform.analytics.evidence()
  const spine = platform.spine.totals()
  const knowledge = platform.knowledge.totals()
  const connectorHealth = platform.integrations.health()

  return (
    <div className="space-y-6 p-6">
      <WorkspaceHeader
        eyebrow="Customer Zero · Evidence"
        title="Customer Zero Evidence"
        description="Measurable proof that IntegrateWise runs its own business on the platform. Every number below is produced by the same surfaces customers consume."
        surfaces={["analytics", "agent-runtime", "capabilities"]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {evidence.map((e) => (
          <Card key={e.id} className="bg-card">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-foreground">{e.value}</p>
              <p className="mt-1 text-sm font-medium">{e.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Adaptive Spine" surface="spine" description="The shared record layer">
          <div className="space-y-2">
            {platform.spine.entities().map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="text-sm font-medium">{e.name}</span>
                <span className="text-sm">
                  {e.records.toLocaleString()}{" "}
                  <span className="text-xs text-emerald-500">+{e.updatedToday} today</span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Knowledge" surface="knowledge" description="Institutional knowledge kept current by agents">
          <div className="space-y-2">
            {platform.knowledge.areas().map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <span className="text-sm font-medium">{k.name}</span>
                <span className="text-sm">
                  {k.documents} <span className="text-xs text-emerald-500">+{k.updatedToday}</span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Today at a glance" surface="analytics" description="Rolled up across surfaces">
          <div className="space-y-3 text-sm">
            <Row label="Records on Spine" value={spine.records.toLocaleString()} />
            <Row label="Spine updates today" value={`${spine.updatedToday}`} />
            <Row label="Knowledge documents" value={`${knowledge.documents}`} />
            <Row label="Connector syncs today" value={connectorHealth.syncsToday.toLocaleString()} />
            <Row label="Capabilities executed" value={`${platform.capabilities.executedToday()}`} />
            <Row label="Agent runs" value={`${platform.agentRuntime.runsToday()}`} />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Validated internally before customer exposure.
            <Badge variant="secondary" className="ml-auto bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              Customer Zero
            </Badge>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
