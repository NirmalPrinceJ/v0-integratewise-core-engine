import { ClientsView } from "@/components/views/clients-view"
import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"

export default function ClientsPage() {
  return (
    <AppShell>
      <ClientsView />
    </AppShell>
  )
}
