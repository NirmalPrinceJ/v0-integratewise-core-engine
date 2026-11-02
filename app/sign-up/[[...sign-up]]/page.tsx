import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex max-w-md flex-col gap-4 text-center">
          <h1 className="text-balance text-2xl font-semibold text-foreground">Accounts are not configured</h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            This deployment is running the Customer Zero demo session. Add a Clerk publishable key to enable sign-up.
          </p>
          <Button asChild>
            <Link href="/workbench">Open the workbench</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp />
    </div>
  )
}
