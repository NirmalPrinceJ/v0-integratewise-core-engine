import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { WorkspaceView } from "@/components/views/workspace-view"

export default function Page() {
  return (
    <AppShell>
      <WorkspaceView department="marketing" />
    </AppShell>
  )
}
