'use client'

import { UserButton } from "@clerk/nextjs"

export function UserMenu() {
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
