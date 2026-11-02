'use client'

import { useSyncExternalStore } from 'react'

export type OodaAction = 'observe' | 'orient' | 'decide' | 'act'

export type OperatingItem = {
  id: string
  type: string
  data: {
    name: string
    status: string
    summary: string
  }
  createdAt: string
  updatedAt: string
}

export type FlowEvent = {
  id: string
  entityId: string
  entityName: string
  action: OodaAction | 'create'
  detail: string
  at: string
}

type OperatingState = {
  items: OperatingItem[]
  events: FlowEvent[]
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function seedItems(): OperatingItem[] {
  return [
    item('account', 'Northwind Systems', 'active', 'Expansion account. Usage up 18% this week.', 20),
    item('account', 'Helio Health', 'at-risk', 'Champion went quiet after the security review.', 6),
    item('deal', 'Northwind Enterprise', 'open', 'Proposal sent. $186k, close target in 12 days.', 30),
    item('deal', 'Helio Platform', 'open', 'Stalled in security review. $92k.', 48),
    item('lead', 'Lumen Freight', 'open', 'Inbound from the operations brief. Needs a demo.', 4),
    item('contact', 'Asha Raman', 'active', 'Economic buyer at Northwind.', 40),
    item('invoice', 'INV-1842 Northwind', 'open', 'Net-30 invoice is 6 days from due.', 10),
    item('project', 'Spine read path', 'active', 'Workbench entity load is the current blocker.', 8),
    item('task', 'Unblock security questionnaire', 'open', 'Helio asked for the SOC 2 packet.', 5),
    item('task', 'Publish founder brief', 'active', '08:00 IST brief is drafted, not sent.', 2),
    item('document', 'Customer Zero runbook', 'active', 'Operating loop: select an item, then OODA.', 26),
    item('meeting', 'Northwind proposal review', 'open', 'Tomorrow 11:00. Decision owner is unconfirmed.', 14),
    item('message', 'Helio security thread', 'open', 'Last reply asked who signs the DPA.', 3),
    item('team_member', 'Nirmal Prince', 'active', 'Founder. Owns the daily brief and deal exceptions.', 1),
  ]
}

function item(type: string, name: string, status: string, summary: string, hours: number): OperatingItem {
  const createdAt = hoursAgo(hours)
  return {
    id: `${type}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    type,
    data: { name, status, summary },
    createdAt,
    updatedAt: createdAt,
  }
}

let state: OperatingState = { items: seedItems(), events: [] }
const listeners = new Set<() => void>()

function emit(next: OperatingState) {
  state = next
  listeners.forEach((listener) => listener())
}

export function subscribeOperating(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getOperatingState() {
  return state
}

export function useOperatingFlow() {
  return useSyncExternalStore(subscribeOperating, getOperatingState, getOperatingState)
}

export function addOperatingItem(type: string, name: string, summary: string) {
  const now = new Date().toISOString()
  const created: OperatingItem = {
    id: `${type}-${Date.now()}`,
    type,
    data: { name, status: 'open', summary },
    createdAt: now,
    updatedAt: now,
  }
  emit({
    items: [created, ...state.items],
    events: [
      {
        id: `evt-${Date.now()}`,
        entityId: created.id,
        entityName: name,
        action: 'create',
        detail: `Created ${type.replace('_', ' ')} ${name}.`,
        at: now,
      },
      ...state.events,
    ],
  })
  return created
}

export function recordOoda(entityId: string, action: OodaAction, detail: string) {
  const target = state.items.find((entry) => entry.id === entityId)
  if (!target) return null
  const now = new Date().toISOString()
  const nextStatus = action === 'act' ? 'acting' : action === 'decide' ? 'decided' : target.data.status
  emit({
    items: state.items.map((entry) =>
      entry.id === entityId
        ? { ...entry, updatedAt: now, data: { ...entry.data, status: nextStatus } }
        : entry,
    ),
    events: [
      {
        id: `evt-${Date.now()}`,
        entityId,
        entityName: target.data.name,
        action,
        detail,
        at: now,
      },
      ...state.events,
    ],
  })
  return detail
}
