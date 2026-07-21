'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Calendar, Flag, MoreHorizontal, Loader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useEntities, useCapabilities } from '@/lib/hooks/use-gateway'
import type { SpineEntity } from '@/lib/integratewise/types'
import { cn } from '@/lib/utils'

const priorityColors: Record<string, string> = {
  low:    'bg-slate-500/10 text-slate-500',
  medium: 'bg-amber-500/10 text-amber-500',
  high:   'bg-rose-500/10 text-rose-500',
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TaskRow({ task, onToggle, onDelete }: {
  task: SpineEntity
  onToggle: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const done     = task.status === 'done'
  const priority = task.metadata?.priority ?? 'medium'
  const dueDate  = task.metadata?.due_date ?? null

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors group',
      done && 'opacity-60'
    )}>
      <Checkbox
        checked={done}
        onCheckedChange={() => onToggle(task.id, task.status)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', done && 'line-through text-muted-foreground')}>
          {task.name}
        </p>
        {task.metadata?.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {task.metadata.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="secondary" className={cn('text-xs px-1.5', priorityColors[priority])}>
            <Flag className="w-2.5 h-2.5 mr-1" />{priority}
          </Badge>
          {dueDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />{formatDate(dueDate)}
            </span>
          )}
          {task.metadata?.assignee && (
            <span className="text-xs text-muted-foreground">{task.metadata.assignee}</span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onToggle(task.id, task.status)}>
            {done ? 'Mark as todo' : 'Mark as done'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(task.id)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function TasksView() {
  const { entities, loading, reload } = useEntities('task', 100)
  const { execute } = useCapabilities()
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium', due_date: '', assignee: '',
  })

  const toggleTask = useCallback(async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    try {
      await execute('task:update', { id, fields: { status: newStatus } })
      reload()
    } catch (e) {
      console.error('[TasksView] toggle failed', e)
    }
  }, [execute, reload])

  const deleteTask = useCallback(async (id: string) => {
    try {
      await execute('task:delete', { id })
      reload()
    } catch (e) {
      console.error('[TasksView] delete failed', e)
    }
  }, [execute, reload])

  const createTask = useCallback(async () => {
    if (!newTask.title.trim()) return
    setCreating(true)
    try {
      await execute('task:create', {
        title:       newTask.title,
        description: newTask.description,
        priority:    newTask.priority,
        due_date:    newTask.due_date || null,
        assignee:    newTask.assignee || null,
        status:      'todo',
      })
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assignee: '' })
      setNewTaskOpen(false)
      reload()
    } catch (e) {
      console.error('[TasksView] create failed', e)
    } finally {
      setCreating(false)
    }
  }, [newTask, execute, reload])

  const todo = entities.filter(t => t.status !== 'done')
  const done = entities.filter(t => t.status === 'done')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {todo.length} open · {done.length} completed
          </p>
        </div>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newTask.title}
                  onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="Task title..."
                  autoFocus
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                  placeholder="Optional details..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={v => setNewTask(p => ({ ...p, priority: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due date</Label>
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={e => setNewTask(p => ({ ...p, due_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Assignee</Label>
                <Input
                  value={newTask.assignee}
                  onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                  placeholder="Name or email..."
                />
              </div>
              <Button
                onClick={createTask}
                disabled={creating || !newTask.title.trim()}
                className="w-full gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {creating ? 'Creating…' : 'Create Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({todo.length})</TabsTrigger>
          <TabsTrigger value="done">Completed ({done.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-4">
          <Card>
            <CardContent className="p-3 space-y-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))
              ) : todo.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No open tasks. Create one to get started.
                </div>
              ) : (
                todo.map(t => (
                  <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="done" className="mt-4">
          <Card>
            <CardContent className="p-3 space-y-1">
              {done.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No completed tasks yet.
                </div>
              ) : (
                done.map(t => (
                  <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
