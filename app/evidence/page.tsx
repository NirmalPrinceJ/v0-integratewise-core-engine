import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { EvidenceView } from "@/components/views/evidence-view"

export default function EvidencePage() {
  return (
    <AppShell>
      <EvidenceView />
    </AppShell>
  )
}
