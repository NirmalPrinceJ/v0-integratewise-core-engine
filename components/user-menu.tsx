'use client'

import { UserButton } from "@clerk/nextjs"

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function UserMenu() {
  if (!clerkEnabled) {
    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
        title="Demo session"
        aria-label="Demo session"
      >
        IW
      </div>
    )
  }

  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
        }
      }}
    />
  )
}
