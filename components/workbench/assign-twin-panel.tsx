"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Zap } from "lucide-react"

interface AssignTwinPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contextEntity?: {
    id: string
    type: string
    name: string
  }
}

export function AssignTwinPanel({
  open,
  onOpenChange,
  contextEntity,
}: AssignTwinPanelProps) {
  const [objective, setObjective] = useState("")
  const [constraints, setConstraints] = useState("")
  const [priority, setPriority] = useState("medium")

  const handleSubmit = () => {
    // TODO: Call Twin API to create proposal
    console.log("[v0] Assigning Twin:", {
      objective,
      constraints,
      priority,
      entity: contextEntity,
    })
    onOpenChange(false)
    setObjective("")
    setConstraints("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Assign Your Twin
          </SheetTitle>
          <SheetDescription>
            Give your Twin an objective to plan, reason, and prepare a proposal
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {contextEntity && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">Target Entity</p>
              <p className="text-sm font-semibold text-foreground">
                {contextEntity.name} ({contextEntity.type})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="objective">Objective</Label>
            <Textarea
              id="objective"
              placeholder="What should your Twin work on? Be specific about the goal."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints & Context</Label>
            <Textarea
              id="constraints"
              placeholder="Any constraints, limitations, or additional context your Twin should know?"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="low">Low - Handle when available</option>
              <option value="medium">Medium - Standard priority</option>
              <option value="high">High - Prioritize this</option>
              <option value="urgent">Urgent - Immediate attention</option>
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>How it works:</strong> Your Twin will analyze the objective
              using available Spine memory and context, generate a detailed
              proposal, and present it for your approval.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!objective.trim()}
            >
              Assign Twin
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
