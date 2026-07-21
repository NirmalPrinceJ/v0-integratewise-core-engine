import { DealsView } from "@/components/views/deals-view"

export const dynamic = "force-dynamic"
import { AppShell } from "@/components/app-shell"

export default function DealsPage() {
  return (
    <AppShell>
      <DealsView />
    </AppShell>
  )
}
