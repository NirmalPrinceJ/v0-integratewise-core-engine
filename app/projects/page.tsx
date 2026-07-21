import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { ProjectsView } from "@/components/views/projects-view"

export default function ProjectsPage() {
  return (
    <AppShell>
      <ProjectsView />
    </AppShell>
  )
}
