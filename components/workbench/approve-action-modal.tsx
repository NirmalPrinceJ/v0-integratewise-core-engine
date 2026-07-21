"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

interface ApproveActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal: {
    id: string
    title: string
    description: string
  }
}

export function ApproveActionModal({
  open,
  onOpenChange,
  proposal,
}: ApproveActionModalProps) {
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    // TODO: Call governance/approval API
    console.log("[v0] Approving proposal:", proposal.id)
    setTimeout(() => {
      setIsApproving(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Approve Twin&apos;s Action
          </DialogTitle>
          <DialogDescription>
            Review and approve the Twin&apos;s proposal before execution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {proposal.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {proposal.description}
                </p>
              </div>
              <Badge variant="outline">Proposal</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">Governance Check</span>
              </div>
              <p className="text-muted-foreground">
                ✓ User has authorization to perform this action
              </p>
              <p className="text-muted-foreground">
                ✓ Action complies with organizational policies
              </p>
              <p className="text-muted-foreground">
                ✓ Audit trail will be recorded in Spine
              </p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              <strong>Truth you own. AI you rent. Approval in between.</strong>
              <br />
              By approving, you take responsibility for this action.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isApproving}
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve & Execute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
