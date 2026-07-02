# PHASE 3T.3 — Capability-to-Page Coverage Matrix

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: cea5f5d Add capability to frontend surface coverage audit

## Purpose
Build a practical matrix that maps system capabilities to backend evidence, API evidence, data evidence, frontend surfaces, UX decisions, and implementation priority.

## Why This Exists
Phase 3T.2 confirmed that MH-OS should not expose power as technical modules. It should expose power as an operating experience:

- Capability
- Surface
- Context
- Next Best Action
- AI Team / Workflow / Task / Handoff
- Result / Tracking

This matrix decides what exists, what is surfaced, what is hidden, what is future, and what must be added to the roadmap before UI finalization.

## Evidence Summary From Scan

### Strongly surfaced capabilities
- Home / executive command is already a top-level surface.
- Setup / project profile is already a top-level surface.
- Library / source / evidence / assets is already a top-level surface and feeds Campaign Studio, Content Studio, Media Studio, Publishing, and AI Command.
- AI Command is already a top-level AI Team surface with specialists, tools, handoffs, and destination routing.
- Workflows is already a top-level workflow preparation and simulation surface.
- Publishing is already a top-level surface with readiness, approval, queue, scheduling, AI review, and confirmation-gated execution boundaries.
- Operations Centers already contains Task, Queue, Job Monitor, and Notification Center sub-surfaces.
- Governance is already a top-level authority/evidence/policy surface.
- Settings is already a top-level team/policy/configuration surface.
- Campaign Studio, Content Studio, Media Studio, Ads Manager, Insights, and Research are visible top-level surfaces.

### Partially surfaced or needs deeper audit
- Customer Operations appears through AI Command routing/intelligence, but no standalone frontend page was confirmed.
- Sales / CRM appears through AI Command prompts and routing logic, but no standalone CRM page was confirmed.
- IVR / Call Center / Voice was not proven as a launch-ready frontend surface.
- Tickets / Inbox were referenced in customer-ops context, but no dedicated ticket/inbox page was confirmed.
- Commerce / Products / Marketplace needs deeper audit before being treated as a launch-ready surface.
- Media jobs / video generation appears related to Media Studio but needs deeper maturity classification.
- Paid Ads has Ads Manager, AI specialist routing, integration references, and Campaign Studio handoff, but execution maturity still needs deeper audit.

## Coverage Matrix

| Capability | Backend/API/Data Evidence From Current Scan | Frontend Surface | Classification | UX Decision | Priority |
|---|---|---|---|---|---|
| Executive command | Home routing and AI entry references exist | Home | covered_standalone_page | strengthen as command overview | P1 |
| Project setup/profile | Setup page and setup draft/form logic exist | Setup | covered_standalone_page | keep guided setup and readiness | P1 |
| Library/source/evidence/assets | asset-library maps assets to Setup, Campaign, Content, Media, Publishing, AI Command | Library | covered_standalone_page | source/evidence hub | P1 |
| Integrations/sync/webhooks | Integrations builders include connector health, ads, analytics, sync-related surfaces | Integrations | covered_standalone_page | show sync health and blockers | P1 |
| AI Team / command / handoffs | AI Command has specialists, destinations, handoffs, customer/ads/sales routing | AI Command | covered_standalone_page | AI Team Command Center | P1 |
| Workflows / automation / scheduler | Workflows page and automation/simulation paths exist | Workflows | covered_standalone_page | preserve authority boundaries | P1 |
| Campaign execution | Campaign Studio, route roles, campaign cache, handoff to Ads Manager exist | Campaign Studio | covered_standalone_page | connect to AI/Publishing/Insights | P2 |
| Content creation | Content Studio page and content CSS/asset usage exist | Content Studio | covered_standalone_page | connect to Library/Publishing | P2 |
| Media / video / media jobs | Media Studio exists; job/video maturity needs deeper proof | Media Studio | needs_deeper_audit | clarify media job/video generation maturity | P1 |
| Publishing / approvals / queue | Publishing command header, readiness, queue, approval, AI review, confirmation-gated copy exist | Publishing | covered_standalone_page | safety closed; keep power visible | P1 |
| Paid ads | Ads Manager page, ads specialist, tool-dock destinations, campaign handoff, integration references exist | Ads Manager | needs_deeper_audit | verify planning vs execution level | P2 |
| Insights / analytics / performance | Insights page exists; recommendations/performance terms present | Insights | covered_standalone_page | expose learning/recommendations | P1 |
| Research / intelligence | Research page routes to ads/campaign/content decisions | Research | covered_standalone_page | connect to decisions | P2 |
| Governance / approvals / policy / evidence | Governance page and policy/evidence/approval audits exist | Governance | covered_standalone_page | authority surface | P1 |
| Settings / team / policy / memory | Settings page and confirmation-gated durable settings save exist | Settings | covered_standalone_page | preserve confirmations | P1 |
| Tasks | Operations Centers include task center audit/ownership and review-first behavior | Operations Centers | covered_sub_surface | review-first task surface | P1 |
| Queue | Operations Centers include queue center and deferred mutation controls | Operations Centers | covered_sub_surface | review-first queue surface | P1 |
| Jobs | Operations Centers include Job Monitor and review-first job monitoring | Operations Centers | covered_sub_surface | review-first job monitor | P1 |
| Notifications | Notification Center render, metrics, alerts, refresh, filters, AI prompts exist | Operations Centers | covered_sub_surface | Mark Read only active mutation | P1 |
| Customer Operations | AI Command references Customer Ops for inbox/tickets/leads/outreach/CRM, but no standalone page confirmed | AI Command / Operations candidate | needs_deeper_audit | decide page vs Operations sub-surface | P0 |
| CRM / Support Desk | Sales/CRM appears in AI Command terms; no standalone CRM page confirmed | AI Command / Operations candidate | needs_deeper_audit | decide standalone vs integration-driven panel | P0 |
| IVR / Call Center / Voice | No launch-ready frontend surface confirmed in current evidence | unclear | needs_deeper_audit | do not claim complete | P0 |
| Tickets / Conversations / Inbox | Customer/ticket/inbox terms appear in AI Command context; no dedicated page confirmed | unclear | needs_deeper_audit | evidence required | P0 |
| Commerce / Products / Marketplace | Product/commerce capability needs deeper evidence review | unclear | needs_deeper_audit | decide future surface | P2 |
| Memory / Learning | Learning/recommendations appear through AI, Insights, Research, Settings concepts | Home / AI Command / Insights / Settings | covered_sub_surface | expose as intelligence layer | P1 |
| Recommendations | Recommendations appear through Insights/AI/Home-style next action concepts | Home / Insights / AI Command | covered_sub_surface | show as Next Best Action | P1 |

## Classification Legend
- `covered_standalone_page`: capability has a clear top-level page.
- `covered_sub_surface`: capability is intentionally surfaced inside a broader page.
- `covered_backend_only`: backend exists but no visible user surface yet.
- `frontend_only_placeholder`: UI exists but backend evidence is missing or partial.
- `planned_future_surface`: intentionally future, not launch-ready.
- `missing_frontend_surface`: capability exists but no clear surface exists.
- `needs_deeper_audit`: evidence is not enough to classify.

## Power Experience Rules
Every launch-ready capability must have:

1. Readiness state.
2. Next Best Action.
3. AI specialist/team path.
4. Workflow/task/handoff destination.
5. Execution boundary label.

## Key Decisions

### Decision 1 — Do not create new pages yet
The audit proves several unclear surfaces, but not enough to safely create routes now.

### Decision 2 — Customer Operations must become a dedicated decision phase
Customer Ops / CRM / Support / Tickets appear as important operating capabilities, but are not yet proven as standalone launch-ready surfaces. They need a focused evidence audit.

### Decision 3 — IVR / Call Center / Voice must not be claimed complete
No launch-ready frontend surface is confirmed in the current scan. Treat as future/planned until proven.

### Decision 4 — Continue UI finalization only after missing surfaces are classified
CSS/page finalization should not proceed as if coverage is complete.

## Recommended Next Step
Proceed to:

**PHASE 3T.4 — Customer Operations / CRM / Support / IVR Surface Decision Audit**

Purpose:
- verify whether Customer Operations should be:
  - standalone page
  - Operations Centers sub-surface
  - AI Command toolset
  - Integrations-driven panel
  - future/deferred phase
- verify whether CRM, tickets, inbox, IVR, voice, and call center have backend/API/data evidence
- prevent fake capability claims
- define how these capabilities should show power to the user

## Protected Behavior
- No production changes.
- No JS edits.
- No CSS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- No fake feature claims.
- Do not mark backend-only features as launch-ready UI features.
- Do not weaken execution authority closeouts.
