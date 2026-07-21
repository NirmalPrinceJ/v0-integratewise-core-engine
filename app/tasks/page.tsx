import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { TasksView } from "@/components/views/tasks-view"

export default function TasksPage() {
  return (
    <AppShell>
      <TasksView />
    </AppShell>
  )
}
