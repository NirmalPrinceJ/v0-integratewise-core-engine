"use client"

import { useState } from "react"
import type { ProjectionDestination, ProjectionKind } from "@/lib/projections"
import { ProjectionShell, type SelectedEntity } from "@/components/projections/projection-shell"
import {
  BoardSurface,
  CalendarSurface,
  DashboardSurface,
  FeedSurface,
  TableSurface,
  toSelected,
  type ProjectionRecord,
} from "@/components/projections/projection-surfaces"
import { CanvasSurface } from "@/components/projections/canvas-surface"

const RECORDS: ProjectionRecord[] = [
  { id: "IW-104", title: "Resolve enterprise onboarding blocker", type: "work_item", status: "Blocked", owner: "Maya Chen", updated: "12m ago", stage: "Triage", metric: "6" },
  { id: "IW-108", title: "Approve Q3 customer expansion plan", type: "decision", status: "Review", owner: "Nirmal Prince", updated: "34m ago", stage: "Decision", metric: "82%" },
  { id: "IW-113", title: "Launch capability activation playbook", type: "initiative", status: "Active", owner: "Arun Rivera", updated: "1h ago", stage: "Execution", metric: "14" },
  { id: "IW-117", title: "Map renewal risks to account plans", type: "risk", status: "Planned", owner: "Jordan Lee", updated: "2h ago", stage: "Planning", metric: "$420k" },
  { id: "IW-121", title: "Publish operational source-of-truth policy", type: "document", status: "Done", owner: "Sofia Patel", updated: "Yesterday", stage: "Complete", metric: "98%" },
  { id: "IW-126", title: "Review pipeline confidence signals", type: "signal", status: "Active", owner: "Maya Chen", updated: "Yesterday", stage: "Analysis", metric: "73%" },
  { id: "IW-131", title: "Align team capacity with commitments", type: "initiative", status: "Review", owner: "Nirmal Prince", updated: "Mon", stage: "Decision", metric: "9" },
]

const CANVAS_PAGES = [
  { id: "goals", title: "Company Goals & KPIs", icon: "target" as const },
  { id: "teams", title: "Teams & People", icon: "users" as const },
  { id: "onboarding", title: "Onboarding", icon: "book" as const },
  { id: "tools", title: "Tools & Systems", icon: "file" as const },
  { id: "faq", title: "FAQs", icon: "book" as const },
  { id: "dictionary", title: "Company Dictionary", icon: "book" as const },
]

const PROJECTABLE: ProjectionKind[] = ["table", "board", "calendar", "dashboard", "canvas", "feed"]

export function EntityProjectionView({ destination }: { destination: ProjectionDestination }) {
  const [projection, setProjection] = useState<ProjectionKind>(destination.projection)
  const [selected, setSelected] = useState<SelectedEntity | null>(null)

  const selectRecord = (record: ProjectionRecord) => setSelected(toSelected(record))

  return (
    <ProjectionShell
      breadcrumb={["Workspace", destination.entity.replaceAll("_", " "), destination.label]}
      title={destination.label}
      description={destination.description ?? `A role-aware ${destination.projection} projection of canonical ${destination.entity.replaceAll("_", " ")} records.`}
      entity={destination.entity}
      projection={destination.projection}
      projectionSwitcher={PROJECTABLE}
      activeProjection={projection}
      onProjectionChange={setProjection}
      selected={selected}
    >
      {projection === "table" && <TableSurface records={RECORDS} selected={selected} onSelect={selectRecord} />}
      {projection === "board" && <BoardSurface records={RECORDS} selected={selected} onSelect={selectRecord} />}
      {projection === "calendar" && <CalendarSurface records={RECORDS} selected={selected} onSelect={selectRecord} />}
      {projection === "dashboard" && <DashboardSurface records={RECORDS} selected={selected} onSelect={selectRecord} />}
      {projection === "feed" && <FeedSurface records={RECORDS} selected={selected} onSelect={selectRecord} />}
      {projection === "canvas" && (
        <CanvasSurface
          pageTitle={destination.label === "Knowledge Base" ? "Company Wiki" : destination.label}
          breadcrumbs={["Company", destination.label]}
          intro="Welcome to the company workspace. This canvas brings together the pages, teams, goals, policies, and live operational records you need—without asking you to search for context."
          subpages={CANVAS_PAGES}
          selected={selected}
          onSelect={setSelected}
        />
      )}
    </ProjectionShell>
  )
}
