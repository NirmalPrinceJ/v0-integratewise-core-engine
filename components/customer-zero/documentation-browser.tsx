"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, ChevronRight, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocFile {
  path: string
  name: string
}

export function DocumentationBrowser() {
  const [docs, setDocs] = useState<DocFile[]>([])
  const [search, setSearch] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    loadDocIndex()
  }, [])

  async function loadDocIndex() {
    try {
      const response = await fetch("/api/docs/index")
      const data = await response.json()
      const files = data.files || []
      // Sort by name and filter markdown files
      setDocs(files.filter((f: DocFile) => f.name.endsWith(".md")).sort((a: DocFile, b: DocFile) => a.name.localeCompare(b.name)))
    } catch (error) {
      console.error("Failed to load docs:", error)
      setDocs([])
    } finally {
      setLoading(false)
    }
  }

  async function openDoc(path: string) {
    setContentLoading(true)
    try {
      const response = await fetch(`/api/docs/read?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      setDocContent(data.content || "")
      setSelectedDoc(path)
    } catch (error) {
      console.error("Failed to load document:", error)
      setDocContent("Error loading document")
    } finally {
      setContentLoading(false)
    }
  }

  const filteredDocs = docs.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Documentation</h2>
        <p className="text-muted-foreground">Browse 900+ documentation files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-96">
        {/* Left Sidebar - Doc List */}
        <Card className="lg:col-span-1 p-4 flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search docs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : filteredDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No documents found</p>
              ) : (
                filteredDocs.map((doc) => (
                  <button
                    key={doc.path}
                    onClick={() => openDoc(doc.path)}
                    className={`w-full text-left p-3 rounded text-sm transition-colors hover:bg-accent ${
                      selectedDoc === doc.path ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">{doc.name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Content Area */}
        <Card className="lg:col-span-3 p-6 flex flex-col">
          {selectedDoc ? (
            <div className="flex-1 flex flex-col">
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-bold text-lg">{selectedDoc.split("/").pop()}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedDoc}</p>
              </div>
              
              {contentLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="text-xs whitespace-pre-wrap break-words bg-muted p-4 rounded font-mono overflow-auto max-h-96">
                      {docContent.substring(0, 3000)}
                      {docContent.length > 3000 && (
                        <div className="text-muted-foreground mt-4">
                          ... (truncated - view full file for complete content)
                        </div>
                      )}
                    </pre>
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Select a document to view</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
