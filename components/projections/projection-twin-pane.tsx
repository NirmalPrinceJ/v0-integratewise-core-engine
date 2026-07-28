"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronRight, Link2, Sparkles, X } from "lucide-react"
import type { ProjectionKind } from "@/lib/projections"
import type { SelectedEntity } from "@/components/projections/projection-shell"

interface ProjectionTwinPaneProps {
  entity: string
  projection: ProjectionKind
  selected?: SelectedEntity | null
  onClose: () => void
}

export function ProjectionTwinPane({ entity, projection, selected, onClose }: ProjectionTwinPaneProps) {
  const subject = selected?.title ?? `Current ${entity.replaceAll("_", " ")} view`

  return (
    <aside className="hidden w-[320px] flex-shrink-0 overflow-y-auto border-l border-border bg-card/70 xl:block">
      <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Twin</p>
            <p className="text-[11px] text-muted-foreground">Context projected from Spine</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="Close Twin panel">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">In focus</p>
            <Badge variant="outline" className="text-[10px] capitalize">{projection}</Badge>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-semibold">{subject}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selected?.subtitle ?? `Showing the information and actions relevant to this ${entity.replaceAll("_", " ")}.`}
            </p>
            {selected && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                <Link2 className="h-3 w-3" />
                {selected.type} · {selected.id}
              </div>
            )}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Why this matters now</p>
          <p className="text-sm leading-relaxed text-foreground/85">
            Two linked records changed since your last visit. One decision is waiting on your input and the nearest milestone is this week.
          </p>
        </section>

        <Separator />

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Linked context</p>
            <span className="text-[10px] text-muted-foreground">4 records</span>
          </div>
          <div className="flex flex-col gap-1">
            {["Q3 operating plan", "Customer signal summary", "Open decision · D-104", "Revenue forecast"].map((record, i) => (
              <button key={record} className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-muted">
                <span className="truncate">{record}</span>
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Proposed next action</p>
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <p className="text-sm font-semibold">Review and unblock the open decision</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Twin connected the latest meeting note, pipeline movement, and owner availability to prepare this action.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Review
              </Button>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
          </div>
        </section>
      </div>
    </aside>
  )
}
