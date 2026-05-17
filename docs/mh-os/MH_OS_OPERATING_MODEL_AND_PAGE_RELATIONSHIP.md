# MH-OS Operating Model And Page Relationship

Status: Canonical
Created: 2026-05-17

## What MH-OS Is

MH-OS is an AI Business Operating System for running a project from intelligence to production, execution, governance, customer operations, and learning.

It is not only a marketing dashboard. It is not only an AI chat surface. It is not a replacement for specialized workspaces. It is a governed operating system where AI helps observe, decide, draft, review, route, execute, and monitor work.

## AI Business Operating System Concept

The system turns project context, business data, assets, integrations, workflows, approvals, AI outputs, and operational state into one coordinated operating surface.

The key split is simple:

- Backend owns authority: policy, approvals, publishing guardrails, route permissions, durable tasks, handoffs, workflows, events, queues, and operational records.
- Frontend projects authority: page layouts, operating surfaces, AI guidance, local drafts before persistence, visual routing, and explicit user actions.

## System Layers

| Layer | Canonical role | Current truth |
| --- | --- | --- |
| 1. Project Intelligence | Project setup, source-of-truth assets, performance signals, learning, recommendations, and memory. | Backend intelligence and learning services exist, but quality depends on connected data and real signal volume. |
| 2. Production Workspaces | Official pages for campaign, content, media, ads, research, publishing, and related production work. | Route-complete, but page quality and projection-only consistency still need page-by-page finalization. |
| 3. AI Team Command Center | Thinking, drafting, reviewing, routing, and specialist coordination layer. | Final Room V1 exists; specialist/tool clarity improved by V1.1 audit. Some execution remains planned or preview-only. |
| 4. Execution & Operations | Workflows, task center, queue center, job monitor, notifications, handoffs, operational snapshots. | Durable operations backbone exists. Operations Centers are close to target conceptually, but still need standard side rails. |
| 5. Governance & Safety | Approvals, policy, brand safety, claims, publish guardrails, escalation, authority checks. | Backend governance is materially enforced. Frontend must not duplicate or bypass it. |
| 6. Customer & Voice Operations | Inbox, conversations, tickets, SLA, escalations, customer history, sales/CRM, voice/IVR. | Architecture and read-only readiness snapshot exist. Reply sending, ticket mutation, SLA changes, and IVR execution must stay planned unless separately proven and approved. |

## Core Workflow

Observe -> Decide -> Draft -> Review -> Route -> Execute -> Monitor

| Step | Meaning | Primary owners |
| --- | --- | --- |
| Observe | Load project state, assets, integration signals, readiness, operations, customer signals, and risks. | Home, Insights, Operations Centers, Integrations, Governance, Customer Ops when present. |
| Decide | Identify next best action, owner, risk, priority, route, and approval requirement. | Home, AI Team, Governance, Workflows, Operations Lead. |
| Draft | Prepare content, task, workflow, handoff, reply, campaign, media, or publishing package. | AI Team, Content Studio, Campaign Studio, Media Studio, Workflows. |
| Review | Check quality, claims, brand safety, readiness, ownership, and approval gates. | Governance, Compliance Reviewer, Publisher, owning workspace. |
| Route | Send context to the correct workspace or operational lane. | AI Team, Workflows, page-level handoff controls. |
| Execute | Run only through approved workspace/backend authority. | Publishing, Workflows, backend operations, task/queue/job surfaces. |
| Monitor | Inspect outcomes, queues, jobs, notifications, insights, learning, and follow-up needs. | Operations Centers, Insights, Home, Governance. |

## Difference Between Major System Parts

### AI Team

The AI Team is the thinking and routing layer. It helps choose the specialist, draft outputs, prepare handoffs, review risks, and send context to the owning workspace. It does not silently publish, create durable tasks, mutate CRM, send customer replies, or bypass governance.

### Pages And Workspaces

Pages and workspaces are the official work surfaces. Campaign Studio, Content Studio, Media Studio, Ads Manager, Research, Publishing, Workflows, Governance, Settings, Library, Integrations, and Operations Centers each own a distinct production or operating responsibility.

### Execution And Operations

Execution and Operations contain durable operational state: tasks, handoffs, workflow runs, queues, job monitor state, notifications, events, and operational snapshots. These are backend-authoritative and must be projected into the UI rather than recreated locally.

### Governance And Safety

Governance owns policy, approvals, claim review, brand safety, publish guardrails, freeze states, escalation, and confirmation rules. It is not an optional visual layer.

### Customer And Voice Operations

Customer and Voice Operations extend MH-OS into inboxes, tickets, replies, SLA, escalations, customer history, sales/CRM, and IVR/Voice. The canonical target is clear, but current implementation evidence is read-only or planned for several customer-facing actions.

## Starting Points

### User Starts From Home

Home is the executive operating surface. It should show project status, readiness, activity, blockers, next best action, AI Team visibility, and route shortcuts. From Home, the user should go to:

- Setup when project context is incomplete.
- Library when assets or source-of-truth files are missing.
- Integrations when signal or connector coverage is weak.
- AI Team when the next action needs thinking, drafting, review, or routing.
- Operations Centers when existing tasks, queues, jobs, or notifications need attention.
- The owning production workspace when the next action is already clear.

### User Starts From AI Team

AI Team is best when the user has an intent but not a fully shaped production object. It should help the user select Solo Specialist or Full Team, prepare Draft/Task/Workflow/Handoff/Export previews, and route the result to the owning workspace.

AI Team must clearly distinguish real local preview actions, real navigation/routing actions, browser actions such as copy/read-aloud where available, and planned/disabled actions such as durable task creation, export, media generation, CRM mutation, customer replies, and live execution.

### User Starts From A Page

The page is the source context. The user should be able to review page data, select or define work, and either complete safe page-local actions or send a structured handoff to AI Team.

A page should not become a second AI Team implementation. It should connect to AI Team through a handoff contract and then receive routed context back when appropriate.

## Page-To-Page Relationship Summary

- Home routes to the highest-priority workspace or AI Team.
- Setup builds project context used by all other pages.
- Library supplies source-of-truth assets and media context.
- Integrations supply connected signal and provider readiness.
- Campaign Studio plans campaign direction and routes to Content, Media, Ads, Publishing, and Workflows.
- Content Studio drafts and reviews copy, then routes to Media, Publishing, Governance, or AI Team.
- Media Studio prepares visuals, video, voice scripts, media jobs, and handoffs.
- Ads Manager plans paid media and routes to Campaign, Content, Media, Insights, or AI Team.
- Research and Insights observe signal and route opportunities into Campaign, Content, Ads, Workflows, or AI Team.
- Publishing packages, schedules, and manages publishing state under backend guardrails.
- Workflows coordinates multi-step execution and handoffs.
- Operations Centers monitor durable tasks, queues, jobs, and notifications.
- Governance reviews approvals, policy, claims, brand safety, and release risk.
- Settings configures project, team, governance, and integration behavior, but must not become the canonical source of backend authority.
- Customer Operations, IVR/Voice, and Sales/CRM connect customer-facing work into the same routing, approval, and operations model. Dedicated surfaces are planned/partial unless source evidence proves otherwise.

## Connected Vs Planned Distinction

Connected means the current source evidence shows a real route, handler, API, backend record, or browser capability.

Planned means the UI, documentation, or architecture describes an intended capability without complete verified execution authority.

Current connected examples:

- Project-scoped backend routes for many Control Center operations.
- Backend governance, approvals, handoffs, tasks, workflow runs, events, queues, and operations snapshots.
- AI Team guidance and local preview/routing behavior.
- Operations Center routes for Task Center, Queue Center, Job Monitor, Notification Center, and composite Operations Centers.
- Browser copy and speech synthesis where available.

Current planned or limited examples:

- Fully autonomous live publishing across external platforms.
- Durable task creation directly from AI Team planned controls.
- Export file generation from AI Team planned controls.
- Native GPU video rendering and realtime voice chat.
- Customer reply sending, ticket mutation, SLA change, CRM mutation, and IVR customer-facing execution unless separately audited and approved.

## Implementation Rule

When evidence is unclear, mark the capability as planned, draft-only, preview-only, or needs human review. Do not turn product direction into a claim of shipped execution.
