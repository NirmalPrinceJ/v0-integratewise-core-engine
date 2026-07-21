'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader, Save, Brain, Zap, CheckCircle2 } from 'lucide-react'
import type { CapabilityDefinition } from '@/lib/core'

interface OODAButtonsProps {
  capability?: CapabilityDefinition
  context?: Record<string, any>
  onStoreInSpine?: (data: { type: string; title: string; content: string; tags?: string[] }) => Promise<void>
  onAskTwin?: (question: string) => Promise<string>
  onAssignTwin?: (objective: string) => Promise<void>
  onApproveAction?: (actionId: string; approved: boolean) => Promise<void>
  isLoading?: boolean
}

/**
 * OODA Button: Observe - Store in Spine
 */
function StoreInSpineButton({ onStoreInSpine, isLoading }: { onStoreInSpine?: OODAButtonsProps['onStoreInSpine'], isLoading?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [storageType, setStorageType] = useState<'evidence' | 'decision' | 'note' | 'insight'>('evidence')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim()) return

    setIsSaving(true)
    try {
      if (onStoreInSpine) {
        await onStoreInSpine({
          type: storageType,
          title,
          content,
        })
      }
      setTitle('')
      setContent('')
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to store:', error)
    } finally {
      setIsSaving(false)
    }
  }, [title, content, storageType, onStoreInSpine])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading || isSaving}
        variant="default"
        className="gap-2"
        title="Observe: Capture evidence, decisions, or notes in Spine"
      >
        <Save className="w-4 h-4" />
        <span>Store in Spine</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Store in Spine
            </DialogTitle>
            <DialogDescription>
              Observe and capture context, evidence, decisions, and insights to build institutional memory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Storage Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Storage Type</label>
              <div className="flex gap-2">
                {(['evidence', 'decision', 'note', 'insight'] as const).map((type) => (
                  <Badge
                    key={type}
                    variant={storageType === type ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setStorageType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <input
                type="text"
                placeholder="Summarize what you're capturing..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea
                placeholder="Provide detailed information..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !title.trim() || !content.trim()}
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Storing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Store in Spine
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * OODA Button: Orient - Ask Your Twin
 */
function AskYourTwinButton({ onAskTwin, isLoading }: { onAskTwin?: OODAButtonsProps['onAskTwin'], isLoading?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isQuerying, setIsQuerying] = useState(false)

  const handleAsk = useCallback(async () => {
    if (!question.trim()) return

    setIsQuerying(true)
    try {
      if (onAskTwin) {
        const result = await onAskTwin(question)
        setResponse(result)
      }
    } catch (error) {
      console.error('Failed to ask Twin:', error)
      setResponse('Error getting response from Twin')
    } finally {
      setIsQuerying(false)
    }
  }, [question, onAskTwin])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        variant="outline"
        className="gap-2"
        title="Orient: Query Twin with workspace context for guidance"
      >
        <Brain className="w-4 h-4" />
        <span>Ask Your Twin</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Ask Your Twin
            </DialogTitle>
            <DialogDescription>
              Orient your work with contextual guidance from Twin powered by the Spine
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Question Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Question</label>
              <textarea
                placeholder="Ask Twin for guidance, analysis, or recommendations..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isQuerying}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none disabled:opacity-50"
              />
            </div>

            {/* Response */}
            {response && (
              <div>
                <label className="text-sm font-medium mb-2 block">Twin Response</label>
                <div className="p-4 rounded-lg border border-border bg-muted/50 text-sm">
                  {response}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {response ? 'Done' : 'Cancel'}
            </Button>
            <Button onClick={handleAsk} disabled={isQuerying || !question.trim()}>
              {isQuerying ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Asking Twin...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Ask Twin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * OODA Button: Decide - Assign Your Twin
 */
function AssignYourTwinButton({ onAssignTwin, capability, isLoading }: { onAssignTwin?: OODAButtonsProps['onAssignTwin'], capability?: CapabilityDefinition, isLoading?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [objective, setObjective] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  const handleAssign = useCallback(async () => {
    if (!objective.trim()) return

    setIsAssigning(true)
    try {
      if (onAssignTwin) {
        await onAssignTwin(objective)
      }
      setObjective('')
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to assign Twin:', error)
    } finally {
      setIsAssigning(false)
    }
  }, [objective, onAssignTwin])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading || isAssigning}
        variant="outline"
        className="gap-2"
        title="Decide: Delegate objectives to Twin for autonomous preparation"
      >
        <Zap className="w-4 h-4" />
        <span>Assign Your Twin</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Assign Your Twin
            </DialogTitle>
            <DialogDescription>
              Delegate objectives to Twin for autonomous preparation and execution planning
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Capability Info */}
            {capability && (
              <div className="p-3 rounded-lg border border-border bg-muted/50">
                <div className="text-sm font-medium">{capability.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{capability.description}</div>
              </div>
            )}

            {/* Objective Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Objective</label>
              <textarea
                placeholder="What would you like Twin to prepare or execute?"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                disabled={isAssigning}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isAssigning || !objective.trim()}>
              {isAssigning ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Assign Twin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * OODA Button: Act - Approve Twin&apos;s Action
 */
function ApproveTwinActionButton({ onApproveAction, isLoading }: { onApproveAction?: OODAButtonsProps['onApproveAction'], isLoading?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingActions, setPendingActions] = useState([
    { id: 'action_1', description: 'Create order in Salesforce', confidence: 0.92 },
    { id: 'action_2', description: 'Send follow-up email to customer', confidence: 0.88 },
  ])
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = useCallback(async (actionId: string, approved: boolean) => {
    setIsApproving(true)
    try {
      if (onApproveAction) {
        await onApproveAction(actionId, approved)
      }
      setPendingActions(pendingActions.filter(a => a.id !== actionId))
    } catch (error) {
      console.error('Failed to approve action:', error)
    } finally {
      setIsApproving(false)
    }
  }, [pendingActions, onApproveAction])

  const hasPendingActions = pendingActions.length > 0

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading || !hasPendingActions}
        variant="outline"
        className="gap-2"
        title="Act: Authorize Twin's governed execution within your authority"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          Approve Action
          {hasPendingActions && <Badge variant="secondary" className="ml-2">{pendingActions.length}</Badge>}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Approve Twin&apos;s Actions
            </DialogTitle>
            <DialogDescription>
              Review and authorize Twin&apos;s proposed actions before execution
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingActions.length > 0 ? (
              pendingActions.map((action) => (
                <div key={action.id} className="p-3 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{action.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Confidence: {(action.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApprove(action.id, false)}
                        disabled={isApproving}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(action.id, true)}
                        disabled={isApproving}
                      >
                        {isApproving ? <Loader className="w-3 h-3 animate-spin" /> : 'Approve'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No pending actions
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * OODA Buttons - Complete set
 */
export function OODAButtons({
  capability,
  context,
  onStoreInSpine,
  onAskTwin,
  onAssignTwin,
  onApproveAction,
  isLoading = false,
}: OODAButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StoreInSpineButton onStoreInSpine={onStoreInSpine} isLoading={isLoading} />
      <AskYourTwinButton onAskTwin={onAskTwin} isLoading={isLoading} />
      <AssignYourTwinButton onAssignTwin={onAssignTwin} capability={capability} isLoading={isLoading} />
      <ApproveTwinActionButton onApproveAction={onApproveAction} isLoading={isLoading} />
    </div>
  )
}

export { StoreInSpineButton, AskYourTwinButton, AssignYourTwinButton, ApproveTwinActionButton }
