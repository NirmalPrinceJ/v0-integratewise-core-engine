"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { HealthStatus, RunStatus, SurfaceId, Trend } from "@/lib/platform/types"

const SURFACE_LABELS: Record<SurfaceId, string> = {
  identity: "Identity",
  integrations: "Integrations",
  spine: "Adaptive Spine",
  knowledge: "Knowledge",
  capabilities: "Capabilities",
  "agent-runtime": "Agent Runtime",
  analytics: "Analytics",
  notifications: "Notifications",
}

export function surfaceLabel(id: SurfaceId) {
  return SURFACE_LABELS[id]
}

/** Chip that names a Platform API surface a workspace consumes. */
export function SurfaceChip({ surface }: { surface: SurfaceId }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {SURFACE_LABELS[surface]}
    </span>
  )
}

export function SurfaceChips({ surfaces }: { surfaces: SurfaceId[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {surfaces.map((s) => (
        <SurfaceChip key={s} surface={s} />
      ))}
    </div>
  )
}

const STATUS_COLOR: Record<HealthStatus | RunStatus, string> = {
  healthy: "bg-emerald-500",
  running: "bg-emerald-500",
  degraded: "bg-amber-500",
  idle: "bg-muted-foreground",
  paused: "bg-amber-500",
  down: "bg-rose-500",
  error: "bg-rose-500",
}

export function StatusDot({ status, label }: { status: HealthStatus | RunStatus; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium capitalize text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR[status])} />
      {label ?? status}
    </span>
  )
}

function TrendPill({ trend, changePct }: { trend: Trend; changePct: number }) {
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus
  const color =
    trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", color)}>
      <Icon className="h-3 w-3" />
      {Math.abs(changePct)}%
    </span>
  )
}

/** Compact KPI tile used across the dashboard and workspaces. */
export function StatTile({
  label,
  value,
  detail,
  trend,
  changePct,
  icon,
  accent,
}: {
  label: string
  value: string
  detail?: string
  trend?: Trend
  changePct?: number
  icon?: ReactNode
  accent?: boolean
}) {
  return (
    <Card className={cn(accent && "border-2 border-primary/30 bg-secondary text-secondary-foreground")}>
      <CardContent className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className={cn("text-sm", accent ? "text-secondary-foreground/70" : "text-muted-foreground")}>{label}</p>
          {icon}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {trend && typeof changePct === "number" && <TrendPill trend={trend} changePct={changePct} />}
        </div>
        {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
      </CardContent>
    </Card>
  )
}

/** Titled section wrapper with an optional surface attribution. */
export function SectionCard({
  title,
  description,
  surface,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  surface?: SurfaceId
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn("bg-card", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {surface && (
            <Badge variant="secondary" className="hidden bg-primary/10 text-xs font-medium text-primary sm:inline-flex">
              {SURFACE_LABELS[surface]}
            </Badge>
          )}
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

/** Page header shared by every Customer Zero workspace. */
export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  surfaces,
}: {
  eyebrow?: string
  title: string
  description?: string
  surfaces?: SurfaceId[]
}) {
  return (
    <div className="space-y-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {surfaces && surfaces.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Consumes:</span>
          <SurfaceChips surfaces={surfaces} />
        </div>
      )}
    </div>
  )
}
