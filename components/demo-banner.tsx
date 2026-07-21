"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { X, Eye, Ban } from "lucide-react"

export function DemoBanner() {
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [showRestricted, setShowRestricted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    setIsDemoUser(document.cookie.includes("demo_session=true"))

    // Check if redirected from restricted route
    if (searchParams.get("demo_restricted") === "true") {
      setShowRestricted(true)
      // Remove the query param
      const url = new URL(window.location.href)
      url.searchParams.delete("demo_restricted")
      router.replace(url.pathname)
    }
  }, [searchParams, router])

  if (!isDemoUser || dismissed) return null

  return (
    <>
      {/* Restricted access toast */}
      {showRestricted && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <Ban className="h-5 w-5" />
          <span className="text-sm font-medium">This area is not available in demo mode</span>
          <button onClick={() => setShowRestricted(false)} className="ml-2 hover:opacity-70">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Customer Zero access notice — shown to guest/demo sessions */}
      <div className="bg-primary/5 border-b border-primary/15 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary/90">
              <strong>Customer Zero — Guest View:</strong> You are watching IntegrateWise run its own business live.
              Some actions are view-only <Eye className="h-3.5 w-3.5 inline" /> and internal areas are restricted{" "}
              <Ban className="h-3.5 w-3.5 inline" />.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  )
}
