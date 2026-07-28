"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bookmark,
  ChevronRight,
  Database,
  Filter,
  Plus,
  Sparkles,
  Star,
} from "lucide-react"
import type { ProjectionKind } from "@/lib/projections"
import { ProjectionTwinPane } from "@/components/projections/projection-twin-pane"

const PROJECTION_META: Record<ProjectionKind, { label: string }> = {
  table: { label: "Table" },
  board: { label: "Board" },
  calendar: { label: "Calendar" },
  dashboard: { label: "Dashboard" },
  canvas: { label: "Canvas" },
  feed: { label: "Feed" },
}

export interface SelectedEntity {
  id: string
  title: string
  type: string
  subtitle?: string
}

interface ProjectionShellProps {
  breadcrumb: string[]
  title: string
  description?: string
  entity: string
  projection: ProjectionKind
  savedViews?: string[]
  /** Alternate projections available for the same entity. */
  projectionSwitcher?: ProjectionKind[]
  activeProjection?: ProjectionKind
  onProjectionChange?: (p: ProjectionKind) => void
  /** The entity the Twin pane should reason about. */
  selected?: SelectedEntity | null
  children: ReactNode
}

export function ProjectionShell({
  breadcrumb,
  title,
  description,
  entity,
  projection,
  savedViews = ["All records", "My items", "Needs attention"],
  projectionSwitcher,
  activeProjection,
  onProjectionChange,
  selected,
  children,
}: ProjectionShellProps) {
  const [activeView, setActiveView] = useState(savedViews[0])
  const [twinOpen, setTwinOpen] = useState(true)
  const current = activeProjection ?? projection
  const meta = PROJECTION_META[current]

  return (
    <div className="flex h-full flex-col">
      <header className="flex-shrink-0 border-b border-border bg-card/60 px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <span className={cn(i === breadcrumb.length - 1 && "font-medium text-foreground")}>{crumb}</span>
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{meta.label}</Badge>
            </div>
            {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={twinOpen ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setTwinOpen((v) => !v)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Twin
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {savedViews.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-sm transition-colors",
                  activeView === view
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {activeView === view && <Star className="h-3 w-3 fill-current" />}
                {view}
              </button>
            ))}
            <button className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bookmark className="h-3.5 w-3.5" />
              Save view
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              Spine · {entity}
            </span>
            {projectionSwitcher && projectionSwitcher.length > 1 && (
              <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                {projectionSwitcher.map((p) => (
                  <button
                    key={p}
                    onClick={() => onProjectionChange?.(p)}
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium capitalize transition-colors",
                      current === p ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {PROJECTION_META[p].label}
                  </button>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-auto p-6">{children}</div>
        {twinOpen && (
          <ProjectionTwinPane entity={entity} projection={current} selected={selected} onClose={() => setTwinOpen(false)} />
        )}
      </div>
    </div>
  )
}
