import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  )

  if (clerkEnabled) {
    const { userId } = await auth()

    if (!userId) {
      redirect("/sign-in")
    }
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
