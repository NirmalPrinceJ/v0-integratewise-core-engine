import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { LeadsView } from "@/components/views/leads-view"

export default function LeadsPage() {
  return (
    <AppShell>
      <LeadsView />
    </AppShell>
  )
}
