'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FileUp, Plus, X } from 'lucide-react'
import type { SpineEntity } from '@/lib/types/spine'

interface StoreSpineModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    type: 'evidence' | 'decision' | 'note' | 'insight'
    title: string
    content: string
    tags?: string[]
    attachments?: File[]
  }) => Promise<void>
  entity?: SpineEntity
}

export function StoreSpineModal({
  isOpen,
  onClose,
  onSubmit,
  entity,
}: StoreSpineModalProps) {
  const [storageType, setStorageType] = useState<'evidence' | 'decision' | 'note' | 'insight'>('evidence')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        type: storageType,
        title,
        content,
        tags,
        attachments,
      })

      // Reset form
      setTitle('')
      setContent('')
      setTags([])
      setAttachments([])
      setStorageType('evidence')
      onClose()
    } catch (error) {
      console.error('Failed to store in Spine:', error)
      alert('Failed to store data')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>📌</span> Store in Spine
          </DialogTitle>
          <DialogDescription>
            Capture evidence, decisions, notes, and insights to build institutional memory
            {entity && (
              <div className="mt-2">
                <Badge variant="outline">
                  {entity.type}: {(entity.data as any)?.name || entity.id}
                </Badge>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={storageType} onValueChange={(v) => setStorageType(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="decision">Decision</TabsTrigger>
            <TabsTrigger value="note">Note</TabsTrigger>
            <TabsTrigger value="insight">Insight</TabsTrigger>
          </TabsList>

          {['evidence', 'decision', 'note', 'insight'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {getTypeDescription(type as any)}
              </p>
            </TabsContent>
          ))}
        </Tabs>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              placeholder="Summarize what you're storing..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              placeholder="Provide detailed information..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tags (press Enter)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button size="sm" variant="outline" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="flex flex-col items-center gap-2 cursor-pointer">
                <FileUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload files or drag and drop
                </span>
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? 'Storing...' : 'Store in Spine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getTypeDescription(type: 'evidence' | 'decision' | 'note' | 'insight'): string {
  const descriptions = {
    evidence: 'Capture data, conversations, and facts that support your understanding.',
    decision: 'Document decisions, rationale, and the context that informed them.',
    note: 'Store quick thoughts, reminders, and observations.',
    insight: 'Record patterns, discoveries, and lessons learned.',
  }
  return descriptions[type]
}
