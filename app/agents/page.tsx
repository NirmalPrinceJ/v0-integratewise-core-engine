import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { AgentRuntimeView } from "@/components/views/agent-runtime-view"

export default function AgentsPage() {
  return (
    <AppShell>
      <AgentRuntimeView />
    </AppShell>
  )
}
