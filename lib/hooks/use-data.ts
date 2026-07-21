/**
 * use-data.ts — GATEWAY BRIDGE
 *
 * Replaces all Supabase-backed hooks with Gateway-backed equivalents.
 * Views import from this file unchanged — zero view edits needed for
 * hooks that were only reading data.
 *
 * Write operations (toggle, delete, create) in views that used
 * supabase.from(...).update/insert/delete are migrated to
 * capability execution via useCapabilities().execute().
 */

'use client'

import { useGateway, useEntities } from './use-gateway'
import type { SpineEntity } from '@/lib/integratewise/types'

// ── helpers ────────────────────────────────────────────────────────────────

function toSWRShape<T>(data: T, loading: boolean, error: string | null, reload: () => void) {
  return {
    data,
    isLoading: loading,
    error,
    mutate: reload,
    // SWR compat
    isValidating: loading,
  }
}

// ── Tasks ──────────────────────────────────────────────────────────────────
export function useTasks() {
  const { entities, loading, error, reload } = useEntities('task', 200)
  return toSWRShape(entities, loading, error, reload)
}

// ── Calendar Events ────────────────────────────────────────────────────────
export function useCalendarEvents(_date?: Date) {
  const { entities, loading, error, reload } = useEntities('event', 50)
  return toSWRShape(entities, loading, error, reload)
}

// ── Emails ─────────────────────────────────────────────────────────────────
export function useEmails(_folder = 'inbox') {
  const { entities, loading, error, reload } = useEntities('engagement', 50)
  // engagement entities with channel=email
  const emails = entities.filter(e => e.metadata?.channel === 'email' || e.entity_type === 'engagement')
  return toSWRShape(emails, loading, error, reload)
}

// ── Drive Files / Documents ────────────────────────────────────────────────
export function useDriveFiles() {
  const { entities, loading, error, reload } = useEntities('document', 50)
  return toSWRShape(entities, loading, error, reload)
}

// ── Documents ─────────────────────────────────────────────────────────────
export function useDocuments(_category?: string) {
  const { entities, loading, error, reload } = useEntities('document', 100)
  return toSWRShape(entities, loading, error, reload)
}

// ── Activities ─────────────────────────────────────────────────────────────
export function useActivities(limit = 10) {
  const { timeline, loading, error, reload } = useGateway('BIZOPS')
  return toSWRShape(timeline.slice(0, limit), loading, error, reload)
}

// ── Metrics ────────────────────────────────────────────────────────────────
export function useMetrics() {
  const { workbench, loading, error, reload } = useGateway('BIZOPS')
  const metrics = workbench?.readiness ?? null
  return toSWRShape(metrics, loading, error, reload)
}

// ── Interactions ───────────────────────────────────────────────────────────
export function useInteractions(_source?: string, limit = 50) {
  const { entities, loading, error, reload } = useEntities('engagement', limit)
  return toSWRShape(entities, loading, error, reload)
}

// ── Search ─────────────────────────────────────────────────────────────────
export function useSearch(query: string) {
  // Gateway-backed search via /api/v1/workspace/entities?search=query
  const { entities, loading, error, reload } = useEntities('account', 20)
  const results = query
    ? entities.filter(e => e.name?.toLowerCase().includes(query.toLowerCase()))
    : []
  return toSWRShape(results, loading, error, reload)
}

// ── Accounts ───────────────────────────────────────────────────────────────
export function useAccounts(limit = 50) {
  const { entities, loading, error, reload } = useEntities('account', limit)
  return toSWRShape(entities, loading, error, reload)
}

// ── Deals ──────────────────────────────────────────────────────────────────
export function useDeals(limit = 50) {
  const { entities, loading, error, reload } = useEntities('deal', limit)
  return toSWRShape(entities, loading, error, reload)
}

// ── Leads ──────────────────────────────────────────────────────────────────
export function useLeads(limit = 50) {
  const { entities, loading, error, reload } = useEntities('person', limit)
  const leads = entities.filter(e => e.metadata?.stage === 'lead' || e.status === 'lead')
  return toSWRShape(leads, loading, error, reload)
}

// ── Projects ───────────────────────────────────────────────────────────────
export function useProjects(limit = 50) {
  const { entities, loading, error, reload } = useEntities('project', limit)
  return toSWRShape(entities, loading, error, reload)
}

// ── Invoices ───────────────────────────────────────────────────────────────
export function useInvoices(limit = 50) {
  const { entities, loading, error, reload } = useEntities('invoice', limit)
  return toSWRShape(entities, loading, error, reload)
}

// ── Tickets ────────────────────────────────────────────────────────────────
export function useTickets(limit = 50) {
  const { entities, loading, error, reload } = useEntities('ticket', limit)
  return toSWRShape(entities, loading, error, reload)
}
