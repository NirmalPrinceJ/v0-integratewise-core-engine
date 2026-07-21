# L1 Surface Map

This map records the user-visible L1 surface contract found in the current codebase. “Path” is the path declared by the internal workspace grammar; these are not currently real Next.js routes because the workspace uses a `MemoryRouter` under `/workspace`.

## Runtime-level surfaces

| Surface        | Declared path   | Actual entry                                 | Runtime status                                         | Evidence/classification   |
| -------------- | --------------- | -------------------------------------------- | ------------------------------------------------------ | ------------------------- |
| Public landing | `/landing`      | Next.js page                                 | Browser diverted to Clerk keyless sign-in during audit | Broken entry              |
| Login          | `/login`        | Next.js page                                 | Renders Clerk auth                                     | Prototype                 |
| Signup         | `/signup`       | Next.js page                                 | Renders Clerk auth                                     | Prototype                 |
| Onboarding     | `/onboarding/*` | 14 Next.js pages                             | Public pages render; flow can stall                    | Prototype/broken flow     |
| Dashboard      | `/dashboard`    | Protected Next.js page                       | Hard-coded zero-state                                  | Stub                      |
| Workspace      | `/workspace`    | Protected Next.js page mounting MemoryRouter | Main product component host                            | Prototype                 |
| Capabilities   | `/capabilities` | Protected Next.js page                       | Standalone, outside workspace grammar                  | Prototype                 |
| Integrations   | `/integrations` | Protected Next.js page                       | Standalone and duplicated internally                   | Prototype                 |
| Schema         | `/schema`       | Protected Next.js page                       | Standalone and duplicated in admin inventory           | Prototype                 |
| Admin          | `/admin`        | None                                         | Components only                                        | Inaccessible              |
| Settings       | `/settings`     | None                                         | Internal module only; `/settings/team` link is broken  | Inaccessible/inconsistent |

## Account Success

| Section      | Surface        | Internal path              | Status                                          |
| ------------ | -------------- | -------------------------- | ----------------------------------------------- |
| L1           | Dashboard      | `/app/work/dashboard`      | Implemented component                           |
| L1           | Accounts       | `/app/work/accounts`       | Implemented; strongest entity collection family |
| L1           | Today          | `/app/work/cs-today`       | Implemented                                     |
| L1           | Tasks          | `/app/work/tasks`          | Implemented                                     |
| L1           | Meetings       | `/app/work/meetings`       | Implemented                                     |
| L1           | Renewals       | `/app/work/renewals`       | Implemented                                     |
| L1           | Risk Matrix    | `/app/work/risk-matrix`    | Declared; module-key alignment risk             |
| L1           | At-Risk        | `/app/work/at-risk`        | Implemented                                     |
| L1           | Health Scores  | `/app/work/account-health` | Implemented                                     |
| L1           | API Portfolio  | `/app/work/api-portfolio`  | Implemented                                     |
| L1           | Engagement Log | `/app/work/engagement-log` | Declared; module-key alignment risk             |
| Intelligence | Insights       | `/app/work/insights`       | Implemented                                     |
| Intelligence | Queue          | `/app/work/cs-queue`       | Declared; content map mismatch risk             |
| Intelligence | Decisions      | `/app/work/cs-decisions`   | Implemented                                     |
| Tools        | Knowledge      | `/app/work/knowledge`      | Declared; map/surface ownership inconsistent    |
| Tools        | Workflows      | `/app/work/workflows`      | Implemented generic module                      |
| Tools        | Settings       | `/app/work/settings`       | Implemented internal module                     |

## Sales

| Section    | Surface         | Internal path               | Status                 |
| ---------- | --------------- | --------------------------- | ---------------------- |
| Core       | Dashboard       | `/app/work/dashboard`       | Implemented            |
| Core       | Pipeline        | `/app/work/pipeline`        | Implemented            |
| Core       | Pipeline Kanban | `/app/work/pipeline-kanban` | Implemented            |
| Core       | Deals           | `/app/work/deals`           | Implemented            |
| Core       | Contacts        | `/app/work/contacts`        | Implemented            |
| Operations | Activities      | `/app/work/activities`      | Implemented            |
| Operations | Forecasting     | `/app/work/forecasting`     | Implemented            |
| Operations | Quotes          | `/app/work/quotes`          | Implemented            |
| Operations | Sequences       | `/app/work/sequences`       | Implemented            |
| Operations | Analytics       | `/app/work/sales-analytics` | Implemented            |
| Assistant  | Sales Today     | `/app/work/sales-today`     | Implemented            |
| Assistant  | Sales Queue     | `/app/work/sales-queue`     | Implemented            |
| Assistant  | Sales Decisions | `/app/work/sales-decisions` | Implemented            |
| System     | Fabric Admin    | `/app/work/fabric-admin`    | Implemented/duplicated |
| System     | Settings        | `/app/work/settings`        | Implemented            |

## Marketing

| Section   | Surface             | Internal path                   | Status                                         |
| --------- | ------------------- | ------------------------------- | ---------------------------------------------- |
| Core      | Dashboard           | `/app/work/dashboard`           | Implemented                                    |
| Core      | Campaigns           | `/app/work/campaigns`           | Read-heavy prototype; New Campaign inert       |
| Core      | Leads               | `/app/work/leads`               | Read-only projection prototype; Add/rows inert |
| Core      | Analytics           | `/app/work/analytics`           | Implemented                                    |
| Channels  | Email               | `/app/work/email`               | Implemented projection view                    |
| Channels  | Social              | `/app/work/social`              | Implemented projection view                    |
| Channels  | Blog                | `/app/work/blog`                | Implemented projection view                    |
| Channels  | Website             | `/app/work/website`             | Implemented projection view                    |
| Content   | Forms               | `/app/work/forms`               | Implemented                                    |
| Content   | SEO                 | `/app/work/seo`                 | Declared; not mapped in Marketing content map  |
| Content   | Media               | `/app/work/media`               | Declared; not mapped in Marketing content map  |
| Content   | Pages               | `/app/work/pages`               | Declared; not mapped in Marketing content map  |
| Content   | Theme               | `/app/work/theme`               | Declared; not mapped in Marketing content map  |
| Assistant | Marketing Today     | `/app/work/marketing-today`     | Implemented                                    |
| Assistant | Marketing Queue     | `/app/work/marketing-queue`     | Implemented                                    |
| Assistant | Marketing Decisions | `/app/work/marketing-decisions` | Implemented                                    |

## Revenue Operations

| Surface                      | Internal path              | Status      |
| ---------------------------- | -------------------------- | ----------- |
| Dashboard                    | `/app/work/dashboard`      | Implemented |
| Pipeline                     | `/app/work/pipeline`       | Implemented |
| Forecasting                  | `/app/work/forecasting`    | Implemented |
| Quotas                       | `/app/work/quotas`         | Implemented |
| Analytics                    | `/app/work/analytics`      | Implemented |
| Cohorts                      | `/app/work/cohorts`        | Implemented |
| Team                         | `/app/work/team`           | Implemented |
| Metrics                      | `/app/work/metrics`        | Implemented |
| Pending Review               | `/app/work/pending-review` | Implemented |
| Decision Log                 | `/app/work/decision-log`   | Implemented |
| RevOps Today/Queue/Decisions | `/app/work/revops-*`       | Implemented |

## Product & Engineering

| Surface                  | Internal path              | Status      |
| ------------------------ | -------------------------- | ----------- |
| Dashboard                | `/app/work/dashboard`      | Implemented |
| Incident Queue           | `/app/work/incident-queue` | Implemented |
| Roadmap                  | `/app/work/roadmap`        | Implemented |
| Features                 | `/app/work/features`       | Implemented |
| Bugs                     | `/app/work/bugs`           | Implemented |
| Sprints                  | `/app/work/sprints`        | Implemented |
| Tasks                    | `/app/work/tasks`          | Implemented |
| Releases                 | `/app/work/releases`       | Implemented |
| Analytics                | `/app/work/analytics`      | Implemented |
| Feedback                 | `/app/work/feedback`       | Implemented |
| PE Today/Queue/Decisions | `/app/work/pe-*`           | Implemented |

## Finance

| Surface                       | Internal path                 | Status                              |
| ----------------------------- | ----------------------------- | ----------------------------------- |
| Dashboard                     | `/app/work/dashboard`         | Implemented                         |
| Revenue                       | `/app/work/revenue`           | Implemented                         |
| Expenses                      | `/app/work/expenses`          | Implemented                         |
| Invoices                      | `/app/work/invoices`          | Declared; content-map mismatch risk |
| Approvals                     | `/app/work/invoice-approvals` | Implemented                         |
| Reports                       | `/app/work/reports`           | Implemented                         |
| Forecasting                   | `/app/work/forecasting`       | Implemented                         |
| Budget                        | `/app/work/budget`            | Implemented                         |
| Finance Today/Queue/Decisions | `/app/work/finance-*`         | Implemented                         |
| Data Governance               | `/app/work/data-governance`   | Implemented                         |

## Service

| Surface                       | Internal path pattern     | Status      |
| ----------------------------- | ------------------------- | ----------- |
| Dashboard                     | `/app/work/dashboard`     | Implemented |
| SLA Dashboard                 | `/app/work/sla-dashboard` | Implemented |
| Tickets                       | `/app/work/tickets`       | Implemented |
| Customers                     | `/app/work/customers`     | Implemented |
| Knowledge                     | `/app/work/knowledge`     | Implemented |
| Analytics                     | `/app/work/analytics`     | Implemented |
| Satisfaction                  | `/app/work/satisfaction`  | Implemented |
| Service Today/Queue/Decisions | `/app/work/service-*`     | Implemented |

## Procurement

| Surface                           | Internal path pattern     | Status      |
| --------------------------------- | ------------------------- | ----------- |
| Dashboard                         | `/app/work/dashboard`     | Implemented |
| Renewals                          | `/app/work/renewals`      | Implemented |
| Vendors                           | `/app/work/vendors`       | Implemented |
| Orders                            | `/app/work/orders`        | Implemented |
| Contracts                         | `/app/work/contracts`     | Implemented |
| Spend                             | `/app/work/spend`         | Implemented |
| Savings                           | `/app/work/savings`       | Implemented |
| Procurement Today/Queue/Decisions | `/app/work/procurement-*` | Implemented |

## IT Admin

| Surface                        | Internal path pattern       | Status      |
| ------------------------------ | --------------------------- | ----------- |
| Dashboard                      | `/app/work/dashboard`       | Implemented |
| Systems                        | `/app/work/systems`         | Implemented |
| Incidents                      | `/app/work/incidents`       | Implemented |
| Vulnerabilities                | `/app/work/vulnerabilities` | Implemented |
| Certificates                   | `/app/work/certificates`    | Implemented |
| Licenses                       | `/app/work/licenses`        | Implemented |
| IT Admin Today/Queue/Decisions | `/app/work/it-admin-*`      | Implemented |

## Student / Teacher

| Surface                       | Internal path pattern   | Status      |
| ----------------------------- | ----------------------- | ----------- |
| Dashboard                     | `/app/work/dashboard`   | Implemented |
| At-Risk                       | `/app/work/at-risk`     | Implemented |
| Students                      | `/app/work/students`    | Implemented |
| Courses                       | `/app/work/courses`     | Implemented |
| Assignments                   | `/app/work/assignments` | Implemented |
| Gradebook                     | `/app/work/gradebook`   | Implemented |
| Student Today/Queue/Decisions | `/app/work/student-*`   | Implemented |

## Personal

| Surface           | Internal path                     | Status                      |
| ----------------- | --------------------------------- | --------------------------- |
| Dashboard         | `/app/personal/dashboard`         | Implemented                 |
| Hub Home          | `/app/personal/hub-home`          | Implemented                 |
| Today             | `/app/personal/hub-today`         | Implemented                 |
| Founder Today     | `/app/personal/founder-today`     | Implemented                 |
| Founder Projects  | `/app/personal/founder-projects`  | Implemented                 |
| Founder Decisions | `/app/personal/founder-decisions` | Implemented                 |
| Knowledge Hub     | `/app/personal/knowledge-hub`     | Implemented                 |
| What's New        | `/app/personal/whats-new`         | Implemented                 |
| Tasks             | `/app/personal/tasks`             | Implemented                 |
| Calendar          | `/app/personal/calendar`          | Implemented                 |
| Notes             | `/app/personal/notes`             | Implemented                 |
| Projects          | `/app/personal/projects`          | Generic workflow projection |
| Docs              | `/app/personal/docs`              | Generic storage projection  |
| Bookmarks         | `/app/personal/bookmarks`         | Implemented                 |
| Settings          | `/app/personal/settings`          | Internal module             |

## BizOps / executive super-domain

BizOps defines its own Dashboard, Ops Command Center, Strategic Hub, Metrics, CRM, Sales Hub, Clients, Projects, Workflows, Analytics, Accounts, Tasks, Docs, Calendar, Integrations, Workflow Canvas, Today, Queue, Decisions, Founder Ops, CEO, COO, CIO/CTO, Strategy & Leadership, Operations Center, Human Resources, Legal & Compliance, Business Intelligence, Partnerships, Knowledge Management, Data Governance, Document Governance, six adaptive product views, entity browser/360/duplicate resolution, settings, billing, AI chat, fabric admin, and prefixed copies of nearly every other domain module.

**Reality classification:** extensive component coverage, but excessive surface breadth and duplication. This should be reduced to an executive task model with cross-domain drill-through rather than a second copy of the entire platform.

## Cross-cutting L1 layers

| Layer  | Surface                       | Status                                                                 |
| ------ | ----------------------------- | ---------------------------------------------------------------------- |
| L2     | Cognitive drawer / insights   | Implemented, event-driven; not runtime-proven in authenticated browser |
| L3     | Twin workbench                | Implemented module                                                     |
| L4     | Memory hub                    | Implemented module                                                     |
| L5     | Operations workbench          | Implemented for internal/customer-zero mode                            |
| L6     | Execution workbench           | Implemented for internal/customer-zero mode                            |
| L7     | Governance/approval workbench | Implemented module/overlay                                             |
| System | Command palette               | Implemented                                                            |
| System | Notifications                 | Implemented                                                            |
| System | Help widget                   | Implemented                                                            |
| System | Billing/subscriptions         | Implemented in multiple placements                                     |

## Surface-map conclusion

The repository's L1 breadth is far ahead of its runtime integrity. The map should become an executable registry that owns route, label, permission, data dependency, empty/error states, and component loader; until then, declared navigation and rendered modules will continue to drift.
