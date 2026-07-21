/**
 * Department Registry
 * Defines all functional departments, their entity focus, and OODA action mappings
 */

export type DepartmentId = 
  | "founder" 
  | "product" 
  | "sales" 
  | "marketing" 
  | "customer_success" 
  | "operations" 
  | "finance" 
  | "partnerships"
  | "knowledge"

export interface DepartmentConfig {
  id: DepartmentId
  name: string
  description: string
  icon: string
  color: string
  primaryEntities: string[] // Entity types this dept works with
  ooodaActions: {
    observe: string // What to look for (e.g., "Account health signals")
    orient: string // How to interpret (e.g., "Customer engagement score")
    decide: string // What to recommend (e.g., "Schedule success call")
    act: string // What to execute (e.g., "Create task, send email")
  }
  defaultTimeslot: number // Hour of daily brief (8-18)
  briefPrompt: string
}

export const DEPARTMENTS: Record<DepartmentId, DepartmentConfig> = {
  founder: {
    id: "founder",
    name: "Founder Daily Brief",
    description: "Executive summary of all business metrics",
    icon: "Crown",
    color: "#8B5CF6",
    primaryEntities: ["account", "deal", "lead", "team_member", "invoice"],
    ooodaActions: {
      observe: "KPI changes, blockers, decisions needed",
      orient: "Aggregate status from all departments",
      decide: "Prioritize action items, approve decisions",
      act: "Set strategic direction, allocate resources",
    },
    defaultTimeslot: 8,
    briefPrompt: `You are delivering the Founder Daily Brief for IntegrateWise at 08:00 IST. Provide:
1. **Priorities** — top 3 things to focus on today
2. **KPI snapshot** — revenue, users, pipeline movement
3. **Blockers** — anything stuck or needing decision
4. **Approvals needed** — pending founder sign-offs
5. **Calendar** — key meetings today
Keep it scannable, bullet points, no fluff.`,
  },

  product: {
    id: "product",
    name: "Product & Engineering",
    description: "Technical priorities, sprints, releases",
    icon: "Zap",
    color: "#3B82F6",
    primaryEntities: ["project", "task", "document", "team_member"],
    ooodaActions: {
      observe: "Sprint progress, bugs, tech debt, blockers",
      orient: "Prioritize feature work vs debt",
      decide: "Sprint planning, release decisions",
      act: "Update sprints, create tasks, flag releases",
    },
    defaultTimeslot: 9,
    briefPrompt: `You are delivering the 09:00 IST Product & Engineering brief. Cover:
1. **Sprint status** — in progress, blocked items
2. **Engineering focus** — top priorities
3. **Bug triage** — new issues, regressions
4. **Release pipeline** — upcoming deployments
5. **Tech debt** — accumulated items
Keep it action-oriented and concise.`,
  },

  sales: {
    id: "sales",
    name: "Sales Pipeline",
    description: "Deal pipeline, prospecting, demos",
    icon: "TrendingUp",
    color: "#EC4899",
    primaryEntities: ["deal", "lead", "account", "contact", "task", "meeting"],
    ooodaActions: {
      observe: "Pipeline movement, hot leads, conversion risks",
      orient: "Deal scoring, urgency assessment",
      decide: "Next steps, follow-up timing, deal strategy",
      act: "Create task, schedule call, update CRM",
    },
    defaultTimeslot: 10,
    briefPrompt: `You are delivering the 10:00 IST Sales Pipeline brief. Cover:
1. **Pipeline status** — deals by stage, total value
2. **Hot leads** — prospects needing follow-up
3. **Demo prep** — upcoming calls to prep for
4. **Conversion risks** — deals at risk
5. **Prospecting targets** — ideal prospects today
Keep it sales-focused and actionable.`,
  },

  marketing: {
    id: "marketing",
    name: "Marketing & Content",
    description: "Content, campaigns, messaging, brand",
    icon: "Megaphone",
    color: "#F59E0B",
    primaryEntities: ["document", "task", "message", "team_member"],
    ooodaActions: {
      observe: "Content performance, campaign metrics, competitive moves",
      orient: "Content fit, audience alignment",
      decide: "Publishing schedule, creative angles",
      act: "Publish content, schedule social, create campaign",
    },
    defaultTimeslot: 11,
    briefPrompt: `You are delivering the 11:00 IST Marketing brief. Cover:
1. **Content pipeline** — drafted, in review, ready
2. **Today's focus** — which pieces to work on
3. **Performance signals** — recent metrics
4. **Competitive intel** — industry news, competitor moves
5. **Creative prompts** — ideas to explore
Keep it creative and focused.`,
  },

  customer_success: {
    id: "customer_success",
    name: "Customer Success",
    description: "Account health, retention, expansion",
    icon: "Heart",
    color: "#10B981",
    primaryEntities: ["account", "contact", "task", "meeting", "invoice"],
    ooodaActions: {
      observe: "Account health signals, churn risk, expansion signals",
      orient: "Health scoring, urgency assessment",
      decide: "Intervention strategy, outreach timing",
      act: "Schedule call, send check-in, create success task",
    },
    defaultTimeslot: 12,
    briefPrompt: `You are delivering the 12:00 IST Customer Success review. Cover:
1. **Customer health** — accounts at risk
2. **Onboarding status** — new customers in pipeline
3. **Support tickets** — open issues, escalations
4. **Churn signals** — usage drops, engagement concerns
5. **Expansion opportunities** — upsell signals
Keep it customer-centric and proactive.`,
  },

  operations: {
    id: "operations",
    name: "Operations",
    description: "Processes, projects, task management",
    icon: "Cog",
    color: "#6B7280",
    primaryEntities: ["task", "project", "team_member", "meeting"],
    ooodaActions: {
      observe: "Project status, task bottlenecks, resource conflicts",
      orient: "Priority assessment, capacity planning",
      decide: "Task allocation, deadline adjustments",
      act: "Update projects, reassign tasks, schedule meetings",
    },
    defaultTimeslot: 14,
    briefPrompt: `You are delivering the 14:00 IST Operations brief. Cover:
1. **Project status** — on track, at risk, completed
2. **Task bottlenecks** — stuck items, reassignments
3. **Resource conflicts** — people overallocated
4. **Meeting prep** — critical meetings today
5. **Process improvements** — optimization ideas
Keep it operational and clear.`,
  },

  finance: {
    id: "finance",
    name: "Finance",
    description: "Revenue, invoices, burn rate, metrics",
    icon: "DollarSign",
    color: "#059669",
    primaryEntities: ["invoice", "account", "deal"],
    ooodaActions: {
      observe: "Invoice status, ARR, churn, cash flow",
      orient: "Financial health assessment",
      decide: "Collection actions, payment terms",
      act: "Send invoice, update payment terms, track cash",
    },
    defaultTimeslot: 16,
    briefPrompt: `You are delivering the 16:00 IST Finance brief. Cover:
1. **Revenue** — MRR, ARR, growth rate
2. **Invoice status** — outstanding, overdue
3. **Churn impact** — revenue lost this month
4. **Cash flow** — runway, burn rate
5. **Financial health** — metrics to track
Keep it data-driven and clear.`,
  },

  partnerships: {
    id: "partnerships",
    name: "Partnerships & GTM",
    description: "Strategic partnerships, go-to-market",
    icon: "Handshake",
    color: "#A78BFA",
    primaryEntities: ["account", "task", "meeting", "document"],
    ooodaActions: {
      observe: "Partner engagement, GTM opportunity signals",
      orient: "Opportunity fit, partnership potential",
      decide: "Outreach strategy, deal structure",
      act: "Schedule meeting, create partnership task",
    },
    defaultTimeslot: 17,
    briefPrompt: `You are delivering the 17:00 IST Partnerships & GTM brief. Cover:
1. **Strategic partners** — current engagement level
2. **GTM opportunities** — potential partnerships
3. **Channel partners** — distribution progress
4. **Joint ventures** — co-marketing ideas
5. **Alliance activity** — recent partner moves
Keep it strategic and forward-looking.`,
  },

  knowledge: {
    id: "knowledge",
    name: "Knowledge & Documentation",
    description: "Architecture, knowledge base, docs",
    icon: "BookOpen",
    color: "#8B5CF6",
    primaryEntities: ["document", "task", "team_member"],
    ooodaActions: {
      observe: "Documentation gaps, knowledge requests, tech debt",
      orient: "Documentation priority assessment",
      decide: "What to document, knowledge sharing strategy",
      act: "Create doc, update architecture, host knowledge session",
    },
    defaultTimeslot: 17,
    briefPrompt: `You are delivering the 17:00 IST Knowledge & Documentation brief. Cover:
1. **Documentation gaps** — what's missing
2. **Knowledge requests** — recent questions
3. **Architecture updates** — system changes to doc
4. **Tech debt docs** — old patterns to update
5. **Knowledge sharing** — sessions or materials needed
Keep it knowledge-focused.`,
  },
}

export const getDepartment = (deptId: DepartmentId): DepartmentConfig => {
  return DEPARTMENTS[deptId]
}

export const getAllDepartments = (): DepartmentConfig[] => {
  return Object.values(DEPARTMENTS)
}

export const getDepartmentsByTimeslot = (hour: number): DepartmentConfig[] => {
  return Object.values(DEPARTMENTS).filter(dept => dept.defaultTimeslot === hour)
}
