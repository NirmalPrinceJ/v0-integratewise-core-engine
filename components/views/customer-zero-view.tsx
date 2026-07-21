"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Bot,
  Boxes,
  CheckCircle2,
  DollarSign,
  GitBranch,
  Megaphone,
  Plug,
  Target,
  Bell,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { platform } from "@/lib/platform"
import { SectionCard, StatTile, StatusDot } from "@/components/platform/primitives"

function relative(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  return `${h}h ago`
}

export function CustomerZeroView() {
  const org = platform.identity.organization()
  const activeAgents = platform.agentRuntime.active()
  const runsToday = platform.agentRuntime.runsToday()
  const capsExecuted = platform.capabilities.executedToday()
  const connectorHealth = platform.integrations.health()
  const spineTotals = platform.spine.totals()
  const metric = (id: string) => platform.analytics.metric(id)
  const approvals = platform.notifications.approvals()
  const notifications = platform.notifications.list()

  const revenue = metric("mrr")
  const pipeline = metric("pipeline")
  const support = metric("support-queue")
  const marketing = platform.agentRuntime.get("content-strategist")
  const deploys = platform.capabilities.list().find((c) => c.id === "deploy-health-check")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Customer Zero</p>
          <h1 className="text-2xl font-semibold text-foreground">How is IntegrateWise operating today?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The live internal workspace that runs {org.name} on the same Platform API our customers use.
          </p>
        </div>
        <Link href="/customer-zero">
          <Button variant="outline" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Our Business Runs Here
          </Button>
        </Link>
      </div>

      {/* Organization health + top-line operating stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="bg-secondary text-secondary-foreground lg:col-span-1">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-foreground/70">Organization Health</p>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3">
              <p className="text-5xl font-bold">{org.healthScore}</p>
              <p className="text-sm text-secondary-foreground/70">/ 100 across all departments</p>
            </div>
          </CardContent>
        </Card>

        <StatTile
          label="Active Agents"
          value={`${activeAgents} running`}
          detail={`${runsToday} agent runs today`}
          icon={<Bot className="h-4 w-4 text-primary" />}
        />
        <StatTile
          label="Running Capabilities"
          value={`${capsExecuted}`}
          detail={`${platform.capabilities.list().length} capabilities executed today`}
          icon={<Boxes className="h-4 w-4 text-primary" />}
        />
        <StatTile
          label="Connector Status"
          value={`${connectorHealth.healthy}/${connectorHealth.total} healthy`}
          detail={`${connectorHealth.syncsToday.toLocaleString()} syncs today`}
          icon={<Plug className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Business signal tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {revenue && (
          <StatTile label="Revenue (MRR)" value={revenue.value} trend={revenue.trend} changePct={revenue.changePct} icon={<DollarSign className="h-4 w-4 text-primary" />} accent />
        )}
        {pipeline && (
          <StatTile label="Pipeline" value={pipeline.value} trend={pipeline.trend} changePct={pipeline.changePct} icon={<Target className="h-4 w-4 text-primary" />} accent />
        )}
        {support && (
          <StatTile label="Support Queue" value={support.value} trend={support.trend} changePct={support.changePct} detail="open tickets" icon={<Activity className="h-4 w-4 text-primary" />} accent />
        )}
        {deploys && (
          <StatTile label="Deployments" value={`${deploys.executionsToday}`} detail={`${deploys.successRate}% healthy today`} icon={<GitBranch className="h-4 w-4 text-primary" />} accent />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active agents */}
        <SectionCard
          title="Active Agents"
          surface="agent-runtime"
          description="Production workers running the company"
          action={
            <Link href="/agents">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                All agents <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-2">
            {platform.agentRuntime.list().slice(0, 5).map((a) => (
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
        </SectionCard>

        {/* Approvals */}
        <SectionCard title="Approvals" surface="notifications" description="Waiting on a human">
          <div className="space-y-3">
            {approvals.map((ap) => (
              <div key={ap.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{ap.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ap.requestedBy}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-emerald-600">
                      Approve
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground">
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Connector status */}
        <SectionCard title="Connector Status" surface="integrations" description="Connected systems keeping the Spine live">
          <div className="space-y-2">
            {platform.integrations.list().map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.category}</p>
                </div>
                <div className="text-right">
                  <StatusDot status={c.status} />
                  <p className="text-xs text-muted-foreground">{relative(c.lastSync)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Marketing + spine */}
        <SectionCard title="Marketing" surface="capabilities" description="Content pipeline & competitive intel">
          <div className="space-y-3">
            {marketing && (
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{marketing.name}</p>
                </div>
                <p className="mt-2 text-2xl font-bold">{marketing.itemsProcessed}</p>
                <p className="text-xs text-muted-foreground">{marketing.itemsLabel} today</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {platform.knowledge.areas().slice(0, 2).map((k) => (
                <div key={k.id} className="rounded-lg bg-muted/30 p-3">
                  <p className="text-lg font-bold">{k.documents}</p>
                  <p className="text-xs text-muted-foreground">{k.name}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" surface="notifications" description="Platform-wide signal">
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-2.5">
                <Bell
                  className={
                    n.severity === "critical"
                      ? "mt-0.5 h-4 w-4 text-rose-500"
                      : n.severity === "warning"
                        ? "mt-0.5 h-4 w-4 text-amber-500"
                        : "mt-0.5 h-4 w-4 text-primary"
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{relative(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Evidence teaser */}
      <SectionCard
        title="Customer Zero Evidence — Today"
        surface="analytics"
        description="Measurable proof the platform is running our own business"
        action={
          <Link href="/evidence">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Full evidence <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {platform.analytics.evidence().map((e) => (
            <div key={e.id} className="rounded-lg bg-muted/30 p-3 text-center">
              <p className="text-xl font-bold">{e.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          {spineTotals.records.toLocaleString()} records on the Adaptive Spine · {spineTotals.updatedToday} updated today
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
            Eat your own dog food
          </Badge>
        </div>
      </SectionCard>
    </div>
  )
}
