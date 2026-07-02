# MH-OS Page Registry And Workflow Map

Status: Canonical
Created: 2026-05-17

## Purpose

This registry names every known MH-OS page/workspace, its route ID where known, its responsibility, recommended AI specialist connection, and normal transitions.

This is a source-of-truth map for page-by-page work. It does not claim that every page is final or production-complete.

## Known Route Registry

| Page / workspace | Route ID | Owner concept | Primary responsibility | Recommended AI specialist connections | Normal transitions | Current state |
| --- | --- | --- | --- | --- | --- | --- |
| Home | `home` | Executive operator | Project overview, readiness, activity, blockers, next best action. | Strategist, Operations Lead, Full Team. | Setup, AI Team, Operations Centers, owning workspace. | Stable enough to use, not final. |
| Setup | `setup` | Project operator | Project context, business basics, market/language, readiness-critical inputs. | Strategist, Operations Lead. | Library, Integrations, Campaign Studio, AI Team. | Useful, needs standard page rails. |
| Library | `library` | Asset/source-of-truth owner | Upload, inspect, organize, review, and mark assets/source material. | Media Director, Content Writer, Compliance Reviewer. | Campaign, Content, Media, Publishing, AI Team. | Functionally rich, high-risk size. |
| Integrations | `integrations` | Integration operator | Provider connection, sync health, diagnostics, readiness coverage. | Operations Lead, SEO & Insights Analyst. | Insights, Research, Publishing, Operations Centers, AI Team. | Broad but not fully consolidated. |
| AI Team Command Center | `ai-command` | AI Team coordinator | Ask, draft, review, route, prepare handoffs, and coordinate specialists. | All specialists. | Any owning workspace, Workflows, Task Center, Governance, Operations Centers. | Final Room V1 exists; some controls planned/disabled. |
| Workflows | `workflows` | Workflow operator | Multi-step workflow preparation, AI workflow routing, handoff creation, Auto Mode controls. | Operations Lead, Full Team. | Task Center, Campaign, Content, Media, Publishing, AI Team. | Powerful but authority-adjacent; needs projection cleanup. |
| Task Center | `task-center` | Operations owner | Durable task inspection, ownership, due-state, linked entities, follow-up. | Operations Lead. | Workflows, AI Team, owning page. | Exists in Operations Centers module. |
| Queue Center | `queue-center` | Queue operator | Queue type/status inspection and route-aware follow-up. | Operations Lead. | Job Monitor, Publishing, Integrations, Governance. | Exists in Operations Centers module. |
| Job Monitor | `job-monitor` | Runtime operator | Runtime job status, execution health, retry state, route context. | Operations Lead. | Queue Center, Workflows, Publishing, Integrations. | Exists in Operations Centers module. |
| Notifications | `notification-center` | Attention owner | Notifications, warnings, approvals, and attention signals. | Operations Lead, Compliance Reviewer. | Governance, Integrations, Publishing, Job Monitor. | Exists in Operations Centers module. |
| Operations Centers | `operations-centers` | Operations overview owner | Composite entry point for tasks, queues, jobs, notifications. | Operations Lead, Full Team. | Task Center, Queue Center, Job Monitor, Notification Center, Workflows, AI Team. | Near target conceptually, needs standard rails. |
| Campaign Studio | `campaign-studio` | Campaign owner | Campaign plans, launch waves, positioning, channel routing. | Strategist, Ads Optimizer, Content Writer. | Content Studio, Media Studio, Ads Manager, Publishing, Workflows. | Usable, not fully aligned. |
| Content Studio | `content-studio` | Content owner | Draft, revise, approve, and route content outputs. | Content Writer, SEO & Insights Analyst, Compliance Reviewer. | Media Studio, Publishing, Governance, AI Team. | Broad capability, high regression risk. |
| Media Studio | `media-studio` | Media owner | Prompt, visual, video, voice-script, media job, approval and handoff work. | Media Director, Video Lead, Compliance Reviewer. | Library, Publishing, Governance, AI Team. | Feature-rich, highest-risk page. |
| Publishing | `publishing` | Publishing owner | Schedule, readiness, queue state, publish/fail status under guardrails. | Publisher, Compliance Reviewer, Operations Lead. | Governance, Insights, Operations Centers, AI Team. | Safety-critical and partially consolidated. |
| Ads Manager | `ads-manager` | Paid media owner | Paid media planning, budget framing, copy/test direction, prompt routing. | Ads Optimizer, Strategist, SEO & Insights Analyst. | Campaign, Content, Media, Insights, AI Team. | Present, less mature and partly planning-local. |
| Insights | `insights` | Analyst owner | Performance summaries, learning, recommendations, platform views. | SEO & Insights Analyst, Strategist. | Research, Ads, Campaign, Content, Workflows, AI Team. | Useful, not final. |
| Research | `research` | Research owner | Opportunities, research summaries, competitive/context insights, routing. | SEO & Insights Analyst, Strategist. | Campaign, Content, Ads, Workflows, AI Team. | Useful, route semantics partly frontend-owned. |
| Governance | `governance` | Governance owner | Policy, approvals, claim review, brand safety, publish guardrails. | Compliance Reviewer, Operations Lead. | Publishing, Workflows, Settings, AI Team. | One of the most backend-authentic pages, not final. |
| Settings | `settings` | System operator | Team model, project config, governance-linked settings, automation configuration. | Operations Lead, Compliance Reviewer. | Governance, Integrations, AI Team. | Important but drift-prone due local role matrices. |
| Customer Operations | Planned/dedicated route not confirmed | Customer operations owner | Inbox, conversations, tickets, replies, SLA, escalations, customer history. | Customer Operations Lead, Compliance Reviewer, Operations Lead. | Operations Centers, AI Team, Sales/CRM, Governance. | Architecture and read-only readiness snapshot exist; dedicated surface is planned/partial. |
| IVR / Voice | Planned/dedicated route not confirmed | Voice operations owner | Calls, transcripts, intent detection, voice routing, human transfer. | Customer Operations Lead, Sales / CRM Lead, Operations Lead. | Customer Operations, Sales/CRM, Operations Centers, AI Team. | Planned channel model; production execution not proven. |
| Sales / CRM | Planned/dedicated route not confirmed | Sales owner | Lead qualification, outreach drafts, CRM context, sales handoffs. | Sales / CRM Lead, Strategist, Operations Lead. | AI Team, Workflows, Customer Operations. | AI Team draft support exists; CRM mutation is not connected. |

## Canonical Workflow By Area

Home observes project state and routes the user to the next highest-value surface. Setup fills missing project intelligence. Library owns source material and assets. Campaign Studio decides campaign direction and routes production into Content, Media, Ads, Publishing, and Workflows.

Content Studio drafts and improves copy. Media Studio prepares media prompts, video briefs, voice scripts, jobs, approvals, and media handoffs. Ads Manager owns paid media planning. Research observes opportunities; Insights observes performance.

Publishing executes only under backend guardrails. Workflows coordinates multi-step work and handoffs. Operations Centers monitor durable tasks, queues, jobs, and notifications. Governance owns approvals, policy, claim review, brand safety, publish guardrails, and escalation. Settings configures project/team/governance-linked behavior without becoming a second backend authority source.

Customer Operations is the target surface for customer messages, tickets, reply drafts, SLA, escalations, customer history, and sales/customer routing. IVR/Voice is a customer interaction channel inside Customer Operations. Sales/CRM is a customer/growth branch. These dedicated surfaces are planned/partial unless separately proven.

## Missing Or Planned Pages

Do not create these during unrelated page work:

- Dedicated Customer Operations route.
- Dedicated IVR / Voice route.
- Dedicated Sales / CRM route.
- Dedicated Unified Inbox route.
- Dedicated Ticket Center route.
- Dedicated Contact List / CRM route.
- Dedicated Outreach Queue route.

They should be created only after a search/audit confirms route absence, ownership, API readiness, and safety boundaries.
