import { AppShell } from "@/components/app-shell"
import { BrainstormingView } from "@/components/views/brainstorming-view"

export const dynamic = "force-dynamic"

export default function BrainstormingPage() {
  return (
    <AppShell>
      <BrainstormingView />
    </AppShell>
  )
}
