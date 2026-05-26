# PHASE 3T.2 — Capability-to-Frontend Surface Coverage + Power Experience Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: c6ee461 Add global CSS ownership duplication audit

## Purpose
Verify whether every meaningful backend/domain/system capability has a clear frontend surface, sub-surface, or documented deferred status before global UI finalization continues.

This audit also defines how MH-OS should expose its power to the user in a smart, simple, and impressive way without creating fake feature claims or adding unsafe execution paths.

## Why This Exists
The current Control Center page inventory shows the main pages, but MH-OS contains many backend and system capabilities beyond visible top-level pages.

Before final UI rollout, we must not mark the frontend complete if important capabilities are hidden, missing, duplicated, only partially surfaced, backend-only, or visually present but not understandable to the user.

## Core UX Principle
MH-OS must not expose power as a list of technical modules.

It must expose power as an operating experience:

- Capability
- Surface
- Context
- Next Best Action
- AI Team / Workflow / Task / Handoff
- Result / Tracking

The user should always understand:

- what the system knows
- what the system can do
- what is ready
- what is blocked
- what should happen next
- which AI specialist or workflow can help
- whether the action is review-only, local-only, or backend-authoritative

## Scope
This audit covers all system domains, including but not limited to:

- Home / Executive Overview
- Setup / Project Profile
- Library / Source Registry / Evidence / Assets
- Integrations / Sync / Webhooks / Health
- AI Command / AI Team / Handoffs
- Workflows / Automation / Scheduler
- Campaign Studio / Campaign Execution
- Content Studio / Copy / Email / Posts
- Media Studio / Video / Media Jobs
- Publishing / Queue / Approvals
- Ads Manager / Paid Media
- Insights / Analytics / Performance
- Research / Learning / Recommendations
- Governance / Approvals / Policy / Evidence
- Settings / Team / Memory / Policies
- Operations Centers / Task / Queue / Job / Notifications
- Customer Operations / CRM / Support
- Call Center / IVR / Voice / Phone
- Tickets / Conversations / Inbox
- Commerce / Products / Marketplace

## Current Frontend Surface Inventory
Known primary Control Center surfaces:

- Home
- Setup
- Library
- Integrations
- AI Command
- Workflows
- Campaign Studio
- Content Studio Workspace
- Media Studio Workspace
- Publishing
- Ads Manager
- Insights
- Research
- Governance
- Settings
- Operations Centers

## Current Power Surfaces Already Visible

| Capability Area | Current Surface | Current User-Facing Power |
|---|---|---|
| Executive overview | Home | Project readiness, next action, AI team entry |
| Project setup | Setup | Guided setup steps, missing data, project profile |
| Assets / evidence | Library | Upload, classify, source, preview, readiness |
| Integrations | Integrations | Connector status, setup drawer, diagnostics |
| AI Team | AI Command | Specialists, full team mode, prompts, tools, handoffs |
| Workflows | Workflows | Workflow preparation, simulation, handoff paths |
| Campaigns | Campaign Studio | Campaign package and launch planning |
| Content | Content Studio | Content creation and publishing preparation |
| Media / video | Media Studio | Creative/media package preparation |
| Publishing | Publishing | Queue, approval, schedule, publish safety |
| Paid media | Ads Manager | Ads planning / paid media surface |
| Insights | Insights | Analytics, recommendations, performance signals |
| Research | Research | Market / competitor / intelligence surface |
| Governance | Governance | Approvals, policy, evidence, risk controls |
| Settings | Settings | Team, policy, approval, memory-like configuration |
| Operations | Operations Centers | Task, queue, job, notification review |

## Capability Areas That Need Deeper Coverage Decision

| Capability | Current Likely Status | Decision Needed |
|---|---|---|
| Customer Operations | likely partial / embedded / planned | standalone page vs Operations sub-surface |
| CRM / Support Desk | likely partial / planned | define if needed as page or integration-driven panel |
| Call Center / IVR / Voice | likely planned or backend-adjacent | do not claim complete until evidence confirms |
| Tickets / Conversations / Inbox | unclear | audit deeper before UI claim |
| Commerce / Products / Marketplace | may exist as data/capability | decide page vs future phase |
| Memory / Learning | exists conceptually/runtime | expose through Home/AI Command/Insights/Settings |
| Recommendations | exists through insights/intelligence | expose as Next Best Action and AI Team suggestions |
| Scheduler / Jobs | partly visible through Publishing/Operations | avoid hidden execution claims |
| Media Jobs / Video Generator | partly visible through Media Studio | clarify capability level before final UX |
| Source Registry / Evidence | visible through Library/Governance | strengthen power story without fake automation |

## How To Show the Power to the User
The final frontend should not add more raw buttons. It should show capability through five repeating user-facing patterns.

### 1. Readiness Snapshot
Every major page should answer: Ready / Blocked / Needs Review / Next Step.

Examples:
- Library: 3 required assets missing
- Publishing: Ready after approval and assets
- Governance: 2 approvals waiting for evidence
- Workflows: Package prepared, backend run requires confirmation

### 2. Next Best Action
Every major page should show one strongest recommended action.

Examples:
- Upload missing product images
- Review campaign claims before publish
- Send this package to AI Publisher
- Open Task Center to resolve blockers

### 3. AI Team Guidance
The user should see which specialist can help.

Examples:
- Strategist: campaign decision
- Writer: content revision
- Designer: asset readiness
- Publisher: publishing queue
- Analyst: performance review
- Compliance: claim and approval review
- Operations: tasks, queues, jobs, notifications

### 4. Execution Boundary Label
Every action should be clear:

- Review-only
- Local draft
- Creates handoff
- Creates task
- Backend-governed
- Requires confirmation
- Deferred / planned

This protects the system and makes it feel professional.

### 5. Destination Path
Every important action should route the user somewhere meaningful:

- AI Command
- Workflows
- Task Center
- Library
- Governance
- Publishing
- Insights
- Settings

The user should never wonder: What happens next?

## Surface Classification Model
Each capability should be classified as:

- covered_standalone_page
- covered_sub_surface
- covered_backend_only
- frontend_only_placeholder
- planned_future_surface
- missing_frontend_surface
- needs_deeper_audit

## Preliminary Capability-to-Surface Matrix

| Capability | Current Surface | Classification | UX Decision |
|---|---|---|---|
| Executive command | Home | covered_standalone_page | strengthen as command overview |
| Project setup | Setup | covered_standalone_page | keep guided wizard / readiness |
| Library assets | Library | covered_standalone_page | keep as source/evidence hub |
| Source evidence | Library + Governance | covered_sub_surface | make evidence flow visible |
| Integrations | Integrations | covered_standalone_page | show sync health and blockers |
| AI Team | AI Command | covered_standalone_page | show as AI Team Command Center |
| Workflows | Workflows | covered_standalone_page | preserve local/backend boundaries |
| Campaign execution | Campaign Studio | covered_standalone_page | connect to AI/Publishing/Insights |
| Content creation | Content Studio | covered_standalone_page | connect to Library/Publishing |
| Media / video | Media Studio | covered_standalone_page | clarify video/media job maturity |
| Publishing | Publishing | covered_standalone_page | already safety-closed |
| Paid ads | Ads Manager | covered_standalone_page | audit later for real execution level |
| Insights / analytics | Insights | covered_standalone_page | expose learning/recommendations |
| Research | Research | covered_standalone_page | connect to campaign/content decisions |
| Governance | Governance | covered_standalone_page | already strong authority surface |
| Settings / team policy | Settings | covered_standalone_page | preserve confirmations |
| Tasks | Operations Centers | covered_sub_surface | review-first currently |
| Queue | Operations Centers | covered_sub_surface | review-first currently |
| Jobs | Operations Centers | covered_sub_surface | review-first currently |
| Notifications | Operations Centers | covered_sub_surface | Mark Read only active mutation |
| Customer Operations | unclear | needs_deeper_audit | decide page vs operations sub-surface |
| CRM / Support | unclear | needs_deeper_audit | decide if standalone or future |
| IVR / Call Center / Voice | unclear | needs_deeper_audit | do not claim complete |
| Tickets / Inbox | unclear | needs_deeper_audit | needs evidence |
| Commerce / Products | unclear | needs_deeper_audit | decide future surface |

## Risk Matrix

| Priority | Risk | Finding | Handling |
|---|---|---|---|
| P0 | Claiming a capability is complete when only backend/plans exist | Possible | classify every capability |
| P0 | Adding pages without backend/data evidence | Possible | audit first, no route additions now |
| P1 | Hiding powerful capabilities inside pages | Likely | expose via readiness, next action, AI guidance |
| P1 | Too many pages confuse users | Possible | prefer sub-surfaces when capability is operationally related |
| P1 | UI polish weakens safety boundaries | Possible | preserve execution authority closeout |
| P2 | Customer Ops / IVR missing from final roadmap | Possible | add to deeper audit queue |
| P2 | Backend power not visible to user | Current UX risk | create power-experience layer |

## Decision
**B) Add missing/planned surfaces to the UI finalization roadmap before CSS work.**

Do not create new pages yet.

Do not continue CSS/page finalization until capability coverage is classified enough to avoid missing major surfaces.

## Recommended Next Step
Proceed to:

**PHASE 3T.3 — Capability-to-Page Coverage Matrix**

Purpose:

- produce a real matrix:
  - capability
  - backend evidence
  - API evidence
  - data evidence
  - frontend surface
  - classification
  - UX decision
  - priority
- decide whether Customer Operations / CRM / IVR / Voice should be:
  - standalone pages
  - Operations sub-surfaces
  - AI Command tools
  - Integrations panels
  - deferred future phases

## Protected Behavior
- No production changes.
- No JS edits.
- No CSS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- No fake feature claims.
- Do not create pages until capability evidence is clear.
- Do not mark a capability as complete just because it exists in backend.
- Do not weaken execution authority closeouts.
