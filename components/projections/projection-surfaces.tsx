"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock3, MoreHorizontal } from "lucide-react"
import type { SelectedEntity } from "@/components/projections/projection-shell"

export interface ProjectionRecord {
  id: string
  title: string
  type: string
  status: string
  owner: string
  updated: string
  stage: string
  metric?: string
}

const STATUS_TONE: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Blocked: "bg-destructive/10 text-destructive",
  Review: "bg-secondary text-secondary-foreground",
  Planned: "bg-accent text-accent-foreground",
  Done: "bg-muted text-muted-foreground",
}

function statusTone(status: string) {
  return STATUS_TONE[status] ?? "bg-muted text-muted-foreground"
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

interface SurfaceProps {
  records: ProjectionRecord[]
  selected?: SelectedEntity | null
  onSelect: (record: ProjectionRecord) => void
}

function toSelected(r: ProjectionRecord): SelectedEntity {
  return { id: r.id, title: r.title, type: r.type, subtitle: `${r.stage} · owned by ${r.owner}` }
}

export function TableSurface({ records, selected, onSelect }: SurfaceProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5">Record</th>
            <th className="px-4 py-2.5">Status</th>
            <th className="px-4 py-2.5">Stage</th>
            <th className="hidden px-4 py-2.5 md:table-cell">Owner</th>
            <th className="hidden px-4 py-2.5 lg:table-cell">Updated</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr
              key={r.id}
              onClick={() => onSelect(r)}
              className={cn(
                "cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40",
                selected?.id === r.id && "bg-accent/60",
              )}
            >
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.id}</p>
              </td>
              <td className="px-4 py-3">
                <Badge className={cn("border-0 text-xs", statusTone(r.status))}>{r.status}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.stage}</td>
              <td className="hidden px-4 py-3 md:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">{initials(r.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{r.owner}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">{r.updated}</td>
              <td className="px-4 py-3 text-right">
                <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BoardSurface({ records, selected, onSelect }: SurfaceProps) {
  const columns = ["Planned", "Active", "Review", "Done"]
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const items = records.filter((r) => r.status === col || (col === "Active" && r.status === "Blocked"))
        return (
          <div key={col} className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{col}</p>
              <span className="rounded-full bg-background px-2 text-xs text-muted-foreground">{items.length}</span>
            </div>
            {items.map((r) => (
              <Card
                key={r.id}
                onClick={() => onSelect(r)}
                className={cn(
                  "cursor-pointer transition-colors hover:border-primary/40",
                  selected?.id === r.id && "border-primary/60 ring-1 ring-primary/30",
                )}
              >
                <CardContent className="p-3">
                  <p className="text-sm font-medium leading-snug">{r.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className={cn("border-0 text-[10px]", statusTone(r.status))}>{r.status}</Badge>
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[9px]">{initials(r.owner)}</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function FeedSurface({ records, selected, onSelect }: SurfaceProps) {
  return (
    <div className="flex flex-col gap-2">
      {records.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          className={cn(
            "flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/40",
            selected?.id === r.id && "border-primary/50 bg-accent/40",
          )}
        >
          <Avatar className="mt-0.5 h-8 w-8">
            <AvatarFallback className="text-[11px]">{initials(r.owner)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">
              {r.owner} · {r.stage}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="h-3 w-3" />
            {r.updated}
          </span>
        </button>
      ))}
    </div>
  )
}

export function DashboardSurface({ records, selected, onSelect }: SurfaceProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {records.slice(0, 4).map((r) => (
          <Card key={r.id} onClick={() => onSelect(r)} className="cursor-pointer transition-colors hover:border-primary/40">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{r.title}</p>
              <p className="mt-1 text-2xl font-bold">{r.metric ?? "—"}</p>
              <Badge className={cn("mt-2 border-0 text-[10px]", statusTone(r.status))}>{r.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <TableSurface records={records} selected={selected} onSelect={onSelect} />
    </div>
  )
}

export function CalendarSurface({ records, selected, onSelect }: SurfaceProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      {days.map((day, i) => (
        <div key={day} className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{day}</p>
          {records
            .filter((_, idx) => idx % 5 === i)
            .map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className={cn(
                  "rounded-md border-l-2 border-primary bg-muted/40 p-2 text-left text-xs transition-colors hover:bg-muted",
                  selected?.id === r.id && "bg-accent",
                )}
              >
                <p className="font-medium">{r.title}</p>
                <p className="text-muted-foreground">{r.owner}</p>
              </button>
            ))}
        </div>
      ))}
    </div>
  )
}

export { toSelected }
