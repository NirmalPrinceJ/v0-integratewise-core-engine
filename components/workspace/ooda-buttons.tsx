"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Database, Zap, Users, CheckCircle2 } from "lucide-react"

export function OODAButtons() {
  const [storeOpen, setStoreOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)

  return (
    <>
      {/* Button Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setStoreOpen(true)}
        >
          <Database className="w-5 h-5" />
          Store in Spine
        </Button>
        <Button 
          size="lg" 
          className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2"
          onClick={() => setAskOpen(true)}
        >
          <Zap className="w-5 h-5" />
          Ask Your Twin
        </Button>
        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          onClick={() => setAssignOpen(true)}
        >
          <Users className="w-5 h-5" />
          Assign Your Twin
        </Button>
        <Button 
          size="lg" 
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          onClick={() => setApproveOpen(true)}
        >
          <CheckCircle2 className="w-5 h-5" />
          Approve Action
        </Button>
      </div>

      {/* Store in Spine Modal */}
      <Dialog open={storeOpen} onOpenChange={setStoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Store Evidence in Spine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Entity Type</label>
              <Input placeholder="e.g., deal, account, decision" />
            </div>
            <div>
              <label className="text-sm font-medium">Evidence / Notes</label>
              <Textarea placeholder="Capture what you observed..." rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="strategic, urgent, follow-up..." />
            </div>
            <Button className="w-full bg-blue-600">Save to Spine</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ask Your Twin Modal */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask Your Twin for Insights</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question</label>
              <Textarea placeholder="What do you want to know?" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Context (Auto-populated)</label>
              <div className="p-3 bg-slate-100 rounded text-sm text-muted-foreground">
                Current opportunity: TechCorp Inc - $85K deal in Negotiation stage
              </div>
            </div>
            <Button className="w-full bg-cyan-600">Ask Twin</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Your Twin Modal */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task to Your Twin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Title</label>
              <Input placeholder="e.g., Draft proposal for TechCorp" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="What should your Twin do?" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" />
            </div>
            <Button className="w-full bg-purple-600">Create Proposal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Action Modal */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Twin's Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 rounded">
              <p className="font-medium mb-2">Pending Twin Proposal:</p>
              <p className="text-sm text-muted-foreground">Send follow-up email to TechCorp with contract template and discount offer</p>
              <p className="text-xs text-muted-foreground mt-2">Confidence: 92% | Reasoning: Similar deals at this stage successfully closed with this approach</p>
            </div>
            <div>
              <label className="text-sm font-medium">Approval Notes</label>
              <Textarea placeholder="Why you approve or conditions..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Reject</Button>
              <Button className="flex-1 bg-green-600">Approve & Execute</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
