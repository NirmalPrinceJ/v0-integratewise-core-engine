import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { ArchitectureView } from "@/components/views/architecture-view"

export default function ArchitecturePage() {
  return (
    <AppShell>
      <ArchitectureView />
    </AppShell>
  )
}
