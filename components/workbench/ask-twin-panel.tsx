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
import { Textarea } from "@/components/ui/textarea"
import { Brain, Send } from "lucide-react"

interface AskTwinPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contextEntity?: {
    id: string
    type: string
    name: string
  }
}

export function AskTwinPanel({
  open,
  onOpenChange,
  contextEntity,
}: AskTwinPanelProps) {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "twin"; content: string }>
  >([
    {
      role: "twin",
      content:
        "Hello! I'm your Twin. I can help you analyze situations, retrieve relevant context from Spine, and suggest actions. What would you like to ask?",
    },
  ])

  const handleSendQuery = () => {
    if (!query.trim()) return

    setMessages([...messages, { role: "user", content: query }])
    // TODO: Call Twin API
    setMessages((prev) => [
      ...prev,
      {
        role: "twin",
        content:
          "I've analyzed your question using the available context. Based on similar situations in Spine, here's what I found...",
      },
    ])
    setQuery("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[600px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Ask Your Twin
          </SheetTitle>
          <SheetDescription>
            Query your Twin for analysis, recommendations, and memory retrieval
          </SheetDescription>
        </SheetHeader>

        {contextEntity && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">Context</p>
            <p className="text-sm font-semibold text-foreground">
              {contextEntity.name}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            placeholder="Ask your Twin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendQuery()
              }
            }}
            rows={2}
            className="resize-none"
          />
          <Button
            onClick={handleSendQuery}
            disabled={!query.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
