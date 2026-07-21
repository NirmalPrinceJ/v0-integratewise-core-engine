import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { DataFlowView } from "@/components/views/data-flow-view"

export default function DataFlowPage() {
  return (
    <AppShell>
      <DataFlowView />
    </AppShell>
  )
}
