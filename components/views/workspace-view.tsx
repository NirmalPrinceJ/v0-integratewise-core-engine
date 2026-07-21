"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, ArrowRight, Plug } from "lucide-react"
import { platform } from "@/lib/platform"
import type { DepartmentId } from "@/lib/platform/types"
import { WorkspaceHeader, SectionCard, StatTile, StatusDot } from "@/components/platform/primitives"

interface Signal {
  label: string
  value: string
  detail?: string
}

interface QuickLink {
  label: string
  href: string
}

interface WorkspaceConfig {
  id: DepartmentId
  title: string
  description: string
  /** Department signals projected from platform surfaces. */
  signals: () => Signal[]
  links: QuickLink[]
}

const metric = (id: string) => platform.analytics.metric(id)
const v = (id: string) => metric(id)?.value ?? "—"

export const WORKSPACES: Record<DepartmentId, WorkspaceConfig> = {
  founder: {
    id: "founder",
    title: "Founder Workspace",
    description: "The whole company at a glance — health, revenue, agents, and what needs a decision.",
    signals: () => [
      { label: "Organization Health", value: `${platform.identity.organization().healthScore}/100` },
      { label: "MRR", value: v("mrr"), detail: "monthly recurring" },
      { label: "Pipeline", value: v("pipeline") },
      { label: "Active Agents", value: `${platform.agentRuntime.active()}`, detail: "production workers" },
    ],
    links: [
      { label: "Strategic Hub", href: "/strategy" },
      { label: "Metrics Dashboard", href: "/metrics" },
      { label: "Evidence", href: "/evidence" },
    ],
  },
  sales: {
    id: "sales",
    title: "Sales Workspace",
    description: "Pipeline health driven by the Lead Qualification worker and the CRM connectors.",
    signals: () => [
      { label: "Open Opportunities", value: v("open-opps") },
      { label: "Qualified Leads", value: v("qualified-leads"), detail: "scored by agent" },
      { label: "Pipeline", value: v("pipeline") },
      { label: "Competitor Signals", value: `${platform.agentRuntime.get("competitive-intelligence")?.itemsProcessed ?? 0}`, detail: "captured today" },
    ],
    links: [
      { label: "Leads", href: "/leads" },
      { label: "Pipeline", href: "/pipeline" },
      { label: "Deals", href: "/deals" },
    ],
  },
  marketing: {
    id: "marketing",
    title: "Marketing Workspace",
    description: "Content pipeline, campaigns, and website analytics powered by Content Strategist.",
    signals: () => [
      { label: "Content Published", value: `${platform.agentRuntime.get("content-strategist")?.itemsProcessed ?? 0}`, detail: "today" },
      { label: "Knowledge Docs", value: `${platform.knowledge.totals().documents}` },
      { label: "Competitor Signals", value: `${platform.agentRuntime.get("competitive-intelligence")?.itemsProcessed ?? 0}` },
      { label: "Campaigns Live", value: "6", detail: "across channels" },
    ],
    links: [
      { label: "Content Library", href: "/content" },
      { label: "Campaigns", href: "/campaigns" },
      { label: "Website Manager", href: "/website" },
    ],
  },
  operations: {
    id: "operations",
    title: "Operations Workspace",
    description: "Day-to-day execution — tasks, projects, and the capabilities keeping work flowing.",
    signals: () => [
      { label: "Capabilities Executed", value: `${platform.capabilities.executedToday()}`, detail: "today" },
      { label: "Open Approvals", value: `${platform.notifications.approvals().length}` },
      { label: "Spine Updates", value: `${platform.spine.totals().updatedToday}`, detail: "today" },
      { label: "Connector Syncs", value: platform.integrations.health().syncsToday.toLocaleString() },
    ],
    links: [
      { label: "Tasks", href: "/tasks" },
      { label: "Projects", href: "/projects" },
      { label: "Data Flow", href: "/data-flow" },
    ],
  },
  technology: {
    id: "technology",
    title: "Technology Workspace",
    description: "GitHub PRs, deployments, and connector health monitored by DevOps Monitor.",
    signals: () => [
      { label: "Deployments Today", value: `${platform.capabilities.list().find((c) => c.id === "deploy-health-check")?.executionsToday ?? 0}` },
      { label: "Deploy Success", value: `${platform.capabilities.list().find((c) => c.id === "deploy-health-check")?.successRate ?? 0}%` },
      { label: "Connectors Healthy", value: `${platform.integrations.health().healthy}/${platform.integrations.health().total}` },
      { label: "GitHub Syncs", value: `${platform.integrations.list().find((c) => c.id === "github")?.syncsToday ?? 0}`, detail: "today" },
    ],
    links: [
      { label: "Architecture", href: "/architecture" },
      { label: "Integrations", href: "/integrations" },
      { label: "Data Sources", href: "/data-sources" },
    ],
  },
  "customer-success": {
    id: "customer-success",
    title: "Customer Success Workspace",
    description: "Health scores, support queue, and renewals watched by Support Triage & Customer Health.",
    signals: () => [
      { label: "Avg Customer Health", value: v("avg-health") },
      { label: "Support Queue", value: v("support-queue"), detail: "open tickets" },
      { label: "Tickets Triaged", value: `${platform.agentRuntime.get("support-triage")?.itemsProcessed ?? 0}`, detail: "today" },
      { label: "Accounts Scored", value: `${platform.agentRuntime.get("customer-health")?.itemsProcessed ?? 0}` },
    ],
    links: [
      { label: "Clients", href: "/clients" },
      { label: "Sessions", href: "/sessions" },
    ],
  },
  finance: {
    id: "finance",
    title: "Finance Workspace",
    description: "MRR, payments, and billing issues reconciled by the Billing Manager worker.",
    signals: () => [
      { label: "MRR", value: v("mrr") },
      { label: "Revenue (MTD)", value: v("revenue") },
      { label: "Net Revenue Retention", value: v("nrr") },
      { label: "Invoices Reconciled", value: `${platform.agentRuntime.get("billing-manager")?.itemsProcessed ?? 0}`, detail: "today" },
    ],
    links: [
      { label: "Metrics Dashboard", href: "/metrics" },
      { label: "Products", href: "/products" },
    ],
  },
  administration: {
    id: "administration",
    title: "Administration Workspace",
    description: "Identity, connected systems, and platform-wide governance.",
    signals: () => [
      { label: "Departments", value: `${platform.identity.departments().length}` },
      { label: "Connected Systems", value: `${platform.identity.connectedSystems().length}` },
      { label: "Records on Spine", value: platform.spine.totals().records.toLocaleString() },
      { label: "Open Notifications", value: `${platform.notifications.list().length}` },
    ],
    links: [
      { label: "Admin Console", href: "/admin" },
      { label: "Settings", href: "/settings" },
      { label: "Data Sources", href: "/data-sources" },
    ],
  },
}

export function WorkspaceView({ department }: { department: DepartmentId }) {
  const config = WORKSPACES[department]
  const dept = platform.identity.department(department)
  const agents = platform.agentRuntime.byDepartment(department)
  const connectors = platform.integrations.byDepartment(department)

  return (
    <div className="space-y-6 p-6">
      <WorkspaceHeader
        eyebrow={`Workspace · ${dept?.name ?? ""}`}
        title={config.title}
        description={config.description}
        surfaces={dept?.surfaces ?? []}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {config.signals().map((s, i) => (
          <StatTile key={s.label} label={s.label} value={s.value} detail={s.detail} accent={i === 0} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard
          title="Agents at work"
          surface="agent-runtime"
          description="Production workers assigned to this department"
          className="lg:col-span-2"
        >
          {agents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No dedicated workers — this workspace composes shared capabilities.
            </p>
          ) : (
            <div className="space-y-2">
              {agents.map((a) => (
                <Link
                  key={a.id}
                  href="/agents"
                  className="flex items-center justify-between rounded-lg bg-muted/40 p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <StatusDot status={a.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{a.executionsToday} runs</p>
                    <p className="text-xs text-muted-foreground">{a.confidence}% confidence</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Connectors" surface="integrations" description="Systems feeding this workspace">
          {connectors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Reads shared connectors via the Spine.</p>
          ) : (
            <div className="space-y-2">
              {connectors.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <StatusDot status={c.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Operational surfaces" description="Jump into the detailed operational pages for this department">
        <div className="flex flex-wrap gap-2">
          {config.links.map((l) => (
            <Link key={l.href} href={l.href}>
              <Button variant="outline" size="sm" className="gap-1.5">
                {l.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
