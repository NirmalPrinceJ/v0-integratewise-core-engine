import { AppShell } from "@/components/app-shell"
import { WorkspaceView } from "@/components/views/workspace-view"

export default function Page() {
  return (
    <AppShell>
      <WorkspaceView department="customer-success" />
    </AppShell>
  )
}
