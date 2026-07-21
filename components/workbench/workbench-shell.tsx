"use client"

import { ReactNode, useState } from "react"
import { ActionButtons } from "./action-buttons"
import { StoreSpineModal } from "./store-spine-modal"
import { AskTwinPanel } from "./ask-twin-panel"
import { AssignTwinPanel } from "./assign-twin-panel"
import { ApproveActionModal } from "./approve-action-modal"

interface WorkbenchShellProps {
  title: string
  description?: string
  children: ReactNode
  contextEntity?: {
    id: string
    type: string
    name: string
  }
}

export function WorkbenchShell({
  title,
  description,
  children,
  contextEntity,
}: WorkbenchShellProps) {
  const [showStoreSpine, setShowStoreSpine] = useState(false)
  const [showAskTwin, setShowAskTwin] = useState(false)
  const [showAssignTwin, setShowAssignTwin] = useState(false)
  const [showApprove, setShowApprove] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {contextEntity && (
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                {contextEntity.type}
              </span>
              <span className="text-muted-foreground">{contextEntity.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">{children}</div>
      </div>

      {/* Action Buttons Footer (Sticky) */}
      <div className="border-t border-border bg-card sticky bottom-0 z-20 px-6 py-4">
        <ActionButtons
          onStoreSpine={() => setShowStoreSpine(true)}
          onAskTwin={() => setShowAskTwin(true)}
          onAssignTwin={() => setShowAssignTwin(true)}
          onApprove={() => setShowApprove(true)}
        />
      </div>

      {/* Modals & Panels */}
      <StoreSpineModal
        open={showStoreSpine}
        onOpenChange={setShowStoreSpine}
        contextEntity={contextEntity}
      />
      <AskTwinPanel
        open={showAskTwin}
        onOpenChange={setShowAskTwin}
        contextEntity={contextEntity}
      />
      <AssignTwinPanel
        open={showAssignTwin}
        onOpenChange={setShowAssignTwin}
        contextEntity={contextEntity}
      />
      <ApproveActionModal
        open={showApprove}
        onOpenChange={setShowApprove}
        proposal={{
          id: "prop-001",
          title: "Sample Twin Proposal",
          description: "This is an example Twin proposal for approval",
        }}
      />
    </div>
  )
}
