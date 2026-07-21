"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StoreSpineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contextEntity?: {
    id: string
    type: string
    name: string
  }
}

export function StoreSpineModal({
  open,
  onOpenChange,
  contextEntity,
}: StoreSpineModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("observation")

  const handleSubmit = () => {
    // TODO: Call API to store in Spine
    console.log("[v0] Storing in Spine:", {
      title,
      description,
      category,
      entity: contextEntity,
    })
    onOpenChange(false)
    setTitle("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Store in Spine</DialogTitle>
          <DialogDescription>
            Capture evidence, decisions, or insights into the adaptive spine
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {contextEntity && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">Context Entity</p>
              <p className="text-sm font-semibold text-foreground">
                {contextEntity.name} ({contextEntity.type})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="observation">Observation</option>
              <option value="decision">Decision</option>
              <option value="insight">Insight</option>
              <option value="evidence">Evidence</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief title of what you're storing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed information to store in the spine"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Store in Spine
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
