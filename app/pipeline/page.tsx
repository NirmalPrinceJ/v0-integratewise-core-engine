import { PipelineView } from "@/components/views/pipeline-view"

export const dynamic = "force-dynamic"
import { AppShell } from "@/components/app-shell"

export default function PipelinePage() {
  return (
    <AppShell>
      <PipelineView />
    </AppShell>
  )
}
