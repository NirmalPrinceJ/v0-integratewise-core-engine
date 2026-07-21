"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, ChevronRight } from "lucide-react"

interface DocFile {
  path: string
  name: string
  type: "file" | "folder"
}

export function DocViewer() {
  const [docs, setDocs] = useState<DocFile[]>([])
  const [search, setSearch] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocIndex()
  }, [])

  async function loadDocIndex() {
    try {
      const response = await fetch("/api/docs/index")
      const data = await response.json()
      setDocs(data.files || [])
    } catch (error) {
      console.error("Failed to load docs:", error)
    } finally {
      setLoading(false)
    }
  }

  async function openDoc(path: string) {
    try {
      const response = await fetch(`/api/docs/read?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      setDocContent(data.content)
      setSelectedDoc(path)
    } catch (error) {
      console.error("Failed to load document:", error)
    }
  }

  const filteredDocs = docs.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Documentation ({docs.length})</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            filteredDocs.map((doc) => (
              <button
                key={doc.path}
                onClick={() => openDoc(doc.path)}
                className={`w-full text-left p-2 rounded text-sm hover:bg-accent transition-colors ${
                  selectedDoc === doc.path ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedDoc ? (
          <Card className="p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-3">{selectedDoc}</h3>
            <pre className="text-xs whitespace-pre-wrap break-words">{docContent.substring(0, 2000)}</pre>
          </Card>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a document to view</p>
          </Card>
        )}
      </div>
    </div>
  )
}
