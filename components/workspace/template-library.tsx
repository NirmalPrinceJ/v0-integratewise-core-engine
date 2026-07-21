"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Copy, Heart } from "lucide-react"
import { useState } from "react"

export function TemplateLibrary() {
  const [favorites, setFavorites] = useState<number[]>([])

  const templates = [
    {
      id: 1,
      name: "Customer Onboarding",
      description: "Step-by-step guide for new customer setup and activation",
      category: "Operations",
      items: 6,
      uses: 24,
      favorite: false,
    },
    {
      id: 2,
      name: "Sales Call Preparation",
      description: "Pre-call checklist with account research and value prop framework",
      category: "Sales",
      items: 8,
      uses: 42,
      favorite: true,
    },
    {
      id: 3,
      name: "Product Roadmap Planning",
      description: "Quarterly roadmap template with feature prioritization matrix",
      category: "Product",
      items: 5,
      uses: 18,
      favorite: false,
    },
    {
      id: 4,
      name: "Sprint Planning",
      description: "2-week sprint planning with capacity planning and retrospective",
      category: "Engineering",
      items: 7,
      uses: 31,
      favorite: true,
    },
    {
      id: 5,
      name: "Investor Meeting Deck",
      description: "Series A fundraising deck template with data slides",
      category: "Fundraising",
      items: 12,
      uses: 8,
      favorite: false,
    },
    {
      id: 6,
      name: "Customer Health Check",
      description: "Monthly health review with NPS, usage, and risk assessment",
      category: "Customer Success",
      items: 4,
      uses: 19,
      favorite: true,
    },
    {
      id: 7,
      name: "Hiring Scorecard",
      description: "Interview evaluation template with competency matrix",
      category: "HR",
      items: 3,
      uses: 12,
      favorite: false,
    },
    {
      id: 8,
      name: "Decision Record",
      description: "Structured decision template capturing context and rationale",
      category: "Operations",
      items: 5,
      uses: 28,
      favorite: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
          <p className="text-muted-foreground">Pre-built workflows for common startup operations</p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Sales", "Operations", "Product", "Engineering", "Customer Success"].map((cat) => (
            <Button key={cat} variant={cat === "All" ? "default" : "outline"} size="sm">
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isFavorite={favorites.includes(template.id)}
            onToggleFavorite={(id) => {
              setFavorites((prev) =>
                prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
              )
            }}
          />
        ))}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Create Custom Templates</h3>
        <p className="text-muted-foreground mb-4">Turn any workflow into a reusable template for your team</p>
        <Button className="bg-primary hover:bg-primary/90">Learn How</Button>
      </Card>
    </div>
  )
}

function TemplateCard({ template, isFavorite, onToggleFavorite }: any) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <Badge variant="outline" className="text-xs">{template.category}</Badge>
        <button
          onClick={() => onToggleFavorite(template.id)}
          className={`transition-colors ${isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="font-semibold mb-1 line-clamp-2">{template.name}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{template.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>{template.items} items</span>
        <span>{template.uses} uses</span>
      </div>
      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
        <Copy className="w-3 h-3" />
        Use Template
      </Button>
    </Card>
  )
}
