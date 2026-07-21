import { AppShell } from "@/components/app-shell"
import { CommandCenterView } from "@/components/views/command-center-view"

export default function Home() {
  return (
    <AppShell>
      <CommandCenterView />
    </AppShell>
  )
}
