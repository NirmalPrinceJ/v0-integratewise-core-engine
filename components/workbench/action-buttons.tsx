"use client"

import { Button } from "@/components/ui/button"
import { Archive, Brain, CheckCircle, Database } from "lucide-react"

interface ActionButtonsProps {
  onStoreSpine: () => void
  onAskTwin: () => void
  onAssignTwin: () => void
  onApprove: () => void
}

export function ActionButtons({
  onStoreSpine,
  onAskTwin,
  onAssignTwin,
  onApprove,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* OBSERVE - Store in Spine */}
      <Button
        onClick={onStoreSpine}
        className="bg-blue-600 hover:bg-blue-700 text-white h-12 flex items-center justify-center gap-2"
      >
        <Database className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm font-semibold">Store in Spine</div>
          <div className="text-xs opacity-90">OBSERVE</div>
        </div>
      </Button>

      {/* ORIENT - Ask Your Twin */}
      <Button
        onClick={onAskTwin}
        className="bg-purple-600 hover:bg-purple-700 text-white h-12 flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm font-semibold">Ask Your Twin</div>
          <div className="text-xs opacity-90">ORIENT</div>
        </div>
      </Button>

      {/* DECIDE - Assign Your Twin */}
      <Button
        onClick={onAssignTwin}
        className="bg-orange-600 hover:bg-orange-700 text-white h-12 flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm font-semibold">Assign Your Twin</div>
          <div className="text-xs opacity-90">DECIDE</div>
        </div>
      </Button>

      {/* ACT - Approve Action */}
      <Button
        onClick={onApprove}
        className="bg-green-600 hover:bg-green-700 text-white h-12 flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm font-semibold">Approve Action</div>
          <div className="text-xs opacity-90">ACT</div>
        </div>
      </Button>
    </div>
  )
}
