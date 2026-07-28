"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Database,
  FileText,
  Info,
  Target,
  Users,
} from "lucide-react"
import type { SelectedEntity } from "@/components/projections/projection-shell"

export interface CanvasPage {
  id: string
  title: string
  icon?: "book" | "target" | "users" | "file" | "calendar"
}

interface CanvasSurfaceProps {
  pageTitle: string
  breadcrumbs: string[]
  intro: string
  subpages: CanvasPage[]
  onSelect: (entity: SelectedEntity) => void
  selected?: SelectedEntity | null
}

const PAGE_ICON = {
  book: BookOpen,
  target: Target,
  users: Users,
  file: FileText,
  calendar: Calendar,
}

export function CanvasSurface({ pageTitle, breadcrumbs, intro, subpages, onSelect, selected }: CanvasSurfaceProps) {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Document header */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {breadcrumbs.map((b, i) => (
          <span key={b} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {b}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">{pageTitle}</h1>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{intro}</p>

      {/* Source-of-truth callout */}
      <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <p className="text-sm text-foreground/85">
          Every block on this page is a live projection of the Spine. Editing here writes back to the underlying tables, so
          the wiki never drifts from the source of truth.
        </p>
      </div>

      {/* Linked subpages */}
      <SectionHeading icon={<FileText className="h-4 w-4" />}>Pages</SectionHeading>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {subpages.map((page) => {
          const Icon = page.icon ? PAGE_ICON[page.icon] : FileText
          const isSel = selected?.id === page.id
          return (
            <button
              key={page.id}
              onClick={() => onSelect({ id: page.id, title: page.title, type: "page" })}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40",
                isSel && "border-primary/60 bg-accent/40",
              )}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-muted text-base">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">{page.title}</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      {/* Goals / KPI block */}
      <SectionHeading icon={<Target className="h-4 w-4" />}>Goals &amp; KPIs</SectionHeading>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "ARR", value: "$4.2M", tone: "text-primary" },
          { label: "NRR", value: "118%", tone: "text-primary" },
          { label: "Active accounts", value: "142", tone: "text-foreground" },
          { label: "Open decisions", value: "6", tone: "text-secondary-foreground" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={cn("mt-1 text-xl font-bold", kpi.tone)}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Embedded table projection */}
      <SectionHeading icon={<Database className="h-4 w-4" />}>Embedded table · Teams</SectionHeading>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Lead</th>
              <th className="px-4 py-2">Members</th>
            </tr>
          </thead>
          <tbody>
            {[
              { team: "Platform", lead: "A. Rivera", members: "8" },
              { team: "Customer Success", lead: "J. Chen", members: "6" },
              { team: "Growth", lead: "M. Osei", members: "5" },
            ].map((row) => (
              <tr
                key={row.team}
                onClick={() => onSelect({ id: `team-${row.team}`, title: `${row.team} team`, type: "team" })}
                className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-2.5 font-medium">{row.team}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.lead}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.members}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Policies block */}
      <SectionHeading icon={<BookOpen className="h-4 w-4" />}>Policies &amp; playbooks</SectionHeading>
      <div className="flex flex-col gap-2">
        {["Onboarding checklist", "Tooling & access", "FAQs", "Company dictionary"].map((doc) => (
          <button
            key={doc}
            onClick={() => onSelect({ id: `doc-${doc}`, title: doc, type: "document" })}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/40"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {doc}
            </span>
            <Badge variant="outline" className="text-[10px]">Doc</Badge>
          </button>
        ))}
      </div>

      <Separator className="my-8" />
      <p className="pb-6 text-center text-xs text-muted-foreground">
        Projected from Spine · Company Knowledge · edits sync to source tables
      </p>
    </div>
  )
}

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold text-foreground">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  )
}
