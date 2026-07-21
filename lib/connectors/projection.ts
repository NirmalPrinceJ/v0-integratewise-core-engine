/**
 * Connector Projection — Role/Industry-Driven Selector
 * 
 * Given the full connector catalog plus a resolved role + industry, scores every
 * connector, ranks by relevance, and selects exactly N connectors (default 5).
 * Pure module — deterministic given an injected RNG.
 */

import type { ConnectorCatalogEntry, ProjectedConnector } from '@/lib/types/connectors'

export const CONNECTOR_RELEVANCE: Record<string, { roles: string[]; industries: string[] }> = {
  salesforce: { roles: ['SALES', 'CUSTOMER_SUCCESS', 'REVOPS'], industries: ['*'] },
  hubspot: { roles: ['SALES', 'MARKETING', 'CUSTOMER_SUCCESS', 'REVOPS'], industries: ['*'] },
  pipedrive: { roles: ['SALES', 'REVOPS'], industries: ['*'] },
  zendesk: { roles: ['SERVICE', 'CUSTOMER_SUCCESS'], industries: ['*'] },
  intercom: { roles: ['SERVICE', 'CUSTOMER_SUCCESS', 'MARKETING'], industries: ['*'] },
  jira: { roles: ['PRODUCT_ENGINEERING', 'IT_ADMIN'], industries: ['SAAS_TECH'] },
  github: { roles: ['PRODUCT_ENGINEERING'], industries: ['SAAS_TECH'] },
  linear: { roles: ['PRODUCT_ENGINEERING'], industries: ['SAAS_TECH'] },
  asana: { roles: ['PRODUCT_ENGINEERING', 'MARKETING', 'BIZOPS'], industries: ['*'] },
  slack: {
    roles: ['CUSTOMER_SUCCESS', 'SALES', 'PRODUCT_ENGINEERING', 'BIZOPS'],
    industries: ['*'],
  },
  microsoft: { roles: ['BIZOPS', 'IT_ADMIN', 'SALES'], industries: ['*'] },
  gmail: { roles: ['SALES', 'CUSTOMER_SUCCESS', 'BIZOPS'], industries: ['*'] },
  googledrive: { roles: ['BIZOPS', 'MARKETING', 'PRODUCT_ENGINEERING'], industries: ['*'] },
  notion: { roles: ['PRODUCT_ENGINEERING', 'BIZOPS', 'MARKETING'], industries: ['*'] },
  stripe: { roles: ['FINANCE', 'REVOPS'], industries: ['SAAS_TECH', 'FINTECH', 'ECOMMERCE'] },
  quickbooks: { roles: ['FINANCE'], industries: ['*'] },
  netsuite: { roles: ['FINANCE', 'PROCUREMENT'], industries: ['*'] },
  shopify: { roles: ['SALES', 'MARKETING', 'FINANCE'], industries: ['ECOMMERCE'] },
  zapier: { roles: ['BIZOPS', 'IT_ADMIN'], industries: ['*'] },
  airtable: { roles: ['BIZOPS', 'MARKETING', 'PRODUCT_ENGINEERING'], industries: ['*'] },
  twilio: { roles: ['PRODUCT_ENGINEERING', 'MARKETING', 'SERVICE'], industries: ['*'] },
  dropbox: { roles: ['BIZOPS', 'MARKETING'], industries: ['*'] },
}

const normalize = (s: string) =>
  s
    .trim()
    .toUpperCase()
    .replace(/[\s/-]+/g, '_')

function getRelevanceFor(
  entry: ConnectorCatalogEntry
): { roles: string[]; industries: string[] } {
  const fallback = CONNECTOR_RELEVANCE[entry.provider?.toLowerCase()] || {
    roles: [],
    industries: [],
  }
  return {
    roles: (entry.roleRelevance ?? fallback.roles).map(normalize),
    industries: (entry.industryRelevance ?? fallback.industries).map(normalize),
  }
}

/**
 * Score a connector based on role and industry match
 * Role match: +2, Industry match: +1
 * "*" industry relevance always matches
 */
export function scoreConnector(
  entry: ConnectorCatalogEntry,
  role: string,
  industry: string
): number {
  const relevance = getRelevanceFor(entry)
  const normRole = normalize(role)
  const normIndustry = normalize(industry)

  let score = 0

  // Role match: +2
  if (relevance.roles.includes(normRole)) {
    score += 2
  }

  // Industry match: +1 (or always match if "*")
  if (relevance.industries.includes('*') || relevance.industries.includes(normIndustry)) {
    score += 1
  }

  // Connected gets bonus
  if (entry.connected) {
    score += 0.5
  }

  return score
}

export interface ProjectionInput {
  catalog: ConnectorCatalogEntry[]
  role: string
  industry: string
  count?: number
  rng?: () => number
}

/**
 * Project connectors for a given role/industry
 * Returns top N connectors, randomizing among equally-scored ties
 */
export function projectConnectors(input: ProjectionInput): ProjectedConnector[] {
  const { catalog, role, industry, count = 5, rng = Math.random } = input

  // Score all connectors
  const scored = catalog.map((entry) => ({
    ...entry,
    relevanceScore: scoreConnector(entry, role, industry),
  }))

  // Sort by score descending
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore)

  // Group by score to handle ties
  const byScore = new Map<number, ProjectedConnector[]>()
  scored.forEach((item) => {
    const key = item.relevanceScore
    if (!byScore.has(key)) {
      byScore.set(key, [])
    }
    byScore.get(key)!.push(item)
  })

  // Build result respecting count
  const result: ProjectedConnector[] = []
  const scores = Array.from(byScore.keys()).sort((a, b) => b - a)

  for (const score of scores) {
    if (result.length >= count) break

    const group = byScore.get(score)!
    const needed = count - result.length

    if (group.length <= needed) {
      // Add all from this group
      result.push(...group)
    } else {
      // Randomly select from this group
      const shuffled = [...group].sort(() => rng() - 0.5)
      result.push(...shuffled.slice(0, needed))
    }
  }

  return result
}
