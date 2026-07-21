"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users } from "lucide-react"
import { platform } from "@/lib/platform"
import { WorkspaceHeader, SectionCard, StatusDot } from "@/components/platform/primitives"

export function OurBusinessView() {
  const org = platform.identity.organization()
  const departments = platform.identity.departments()
  const systems = platform.identity.connectedSystems()
  const spine = platform.spine.totals()
  const knowledge = platform.knowledge.totals()

  const dailyActivity = [
    { label: "Capability Executions", value: `${platform.capabilities.executedToday()}` },
    { label: "Agent Runs", value: `${platform.agentRuntime.runsToday()}` },
    { label: "Approvals", value: `${platform.notifications.approvals().length}` },
    { label: "Connector Syncs", value: platform.integrations.health().syncsToday.toLocaleString() },
    { label: "Knowledge Updates", value: `${knowledge.updatedToday}` },
    { label: "Spine Updates", value: `${spine.updatedToday}` },
  ]

  return (
    <div className="space-y-6 p-6">
      <WorkspaceHeader
        eyebrow="Customer Zero"
        title="Our Business Runs Here"
        description={`${org.name} operates entirely on IntegrateWise. This is the organization, the departments, the systems, and the daily activity that prove it.`}
        surfaces={["identity", "integrations", "notifications"]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Organization</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{org.name}</p>
            <p className="text-sm text-secondary-foreground/70">{org.tagline}</p>
            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-xl font-bold">{org.employees}</p>
                <p className="text-xs text-secondary-foreground/70">Employees</p>
              </div>
              <div>
                <p className="text-xl font-bold">{org.healthScore}</p>
                <p className="text-xs text-secondary-foreground/70">Health score</p>
              </div>
              <div>
                <p className="text-xl font-bold">{org.foundedYear}</p>
                <p className="text-xs text-secondary-foreground/70">Founded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionCard title="Departments" surface="identity" description="Each is a projection over the same Spine" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {departments.map((d) => (
              <div key={d.id} className="rounded-lg bg-muted/40 p-3">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> {d.headcount}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Connected Systems" surface="integrations" description="The tools wired into the Spine">
          <div className="space-y-2">
            {platform.integrations.list().map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.category}</p>
                </div>
                <StatusDot status={c.status} />
              </div>
            ))}
            {systems.length > platform.integrations.list().length && (
              <p className="text-xs text-muted-foreground">+ {systems.length - platform.integrations.list().length} more</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Daily Activity" surface="analytics" description="What the platform did for us today">
          <div className="grid grid-cols-2 gap-3">
            {dailyActivity.map((a) => (
              <div key={a.label} className="rounded-lg border border-border p-4">
                <p className="text-2xl font-bold">{a.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.label}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
