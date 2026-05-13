# MH-OS Final Execution Start Plan

## Status

Canonical operating model for MH-OS / MH Assistant.

This document is the single program-level reference for future frontend, UX, AI, workflow, task, governance, and page-development decisions.

Supporting audit reports, page closeouts, architecture scans, and implementation reports remain historical evidence. This file defines the current direction and the rules for what happens next.

---

## 1. Current Doctrine

Backend is the authority.  
Frontend is projection.  
No big rewrites without a written plan.  
No heavy logic in render.  
No Auto Mode startup without explicit user action.  
No governance bypass.  
No durable-state replacement by local cache.  
No backend execution activation from frontend polish work.  
No page rebuild without page role, action map, and safety boundary.  
No duplicate CSS or theme files.  
No Run Live, Auto Mode, Run Workflow, or execution labels unless execution is explicitly safe, governed, confirmed, and approved.  
No page should become an isolated tool; every page must belong to the shared MH-OS operating model.

---

## 2. Final System Vision

MH-OS is an AI Business Operating System.

It is not a normal dashboard.  
It is not a collection of disconnected pages.  
It is not only an AI chat.  
It is not only a task manager.  
It is not only an automation tool.

The final system turns business goals into page context, AI guidance, workflow sessions, task handoffs, destination execution, tracking, and next actions.

Core operating flow:

```text
User Goal
→ Page Context
→ AI Guidance
→ Workflow Session
→ Task / Handoff
→ Destination Page
→ Tracking
→ Result / Next Action
```

The user should not need to guess where to go next.

Every page must answer:

Where am I?
What is this page for?
What is the current context?
What is ready?
What is missing?
What is the next best action?
Where will this action continue?
Will this become an AI review, workflow, task, handoff, or backend execution?
What happened after I clicked?

The final experience must feel like one connected operating system, not separate screens.

## 3. What Has Been Completed
### Completed foundation
Global design foundation primitives added.
No new theme file was created.
No duplicate global CSS file was introduced.
00-tokens.css remains the token source.
08-components-foundation.css includes opt-in mhos-* primitives.
Global design work must continue by extending the existing foundation, not by creating parallel systems.
### Completed page upgrades
Library upgraded as an Asset Intelligence / Source-of-Truth operating surface.
Integrations upgraded as an Integration Control Tower.
Workflows rebuilt as a Workflow Operating Loop.
Workflows currently remains frontend-safe and does not activate backend execution.
### Completed governance/support work
Full Page Experience Upgrade Protocol exists.
Global Design Foundation plan exists.
Docs consolidation bundle exists.
Rejected Workflows rebuild attempt archived.
Documentation consolidation confirmed that there are no exact duplicate docs safe for automatic archiving.
Working tree was cleaned after Workflows stabilization.
## 4. Current Strategic Position

The system now has a strong foundation, but the next phase must not continue as disconnected page-by-page polish.

The next phase must connect the system through one shared operating model:

Page Workspace
+ AI Guidance
+ Workflow Session
+ Task / Handoff
+ Action Destination Map
+ Governance Boundary

The goal is not to rebuild everything again.

The goal is to make each existing page smarter, clearer, and connected to the same operating flow.

## 5. Core Operating Model

MH-OS must operate through four connected layers.

### 5.1 Page Workspace

The page workspace is the domain-specific work area.

Examples:

Library manages assets.
Integrations manages platform connections.
Campaign Studio manages campaigns.
Content Studio manages content.
Media Studio manages creative production.
Publishing manages readiness and publishing payloads.
Task Center manages follow-up work.
Governance manages risk and approvals.

Each page must remain specialized.

A page should not try to become the whole system.

### 5.2 AI Workspace

The AI Workspace is the reasoning, writing, analysis, planning, and recommendation layer.

AI must receive page context instead of starting from zero.

AI must help answer:

What does this mean?
What is missing?
What should be done next?
What can be prepared?
What should become a task?
What should become a workflow?
What should be reviewed before execution?

AI must not silently execute dangerous actions.

### 5.3 Workflow Operating System

The Workflow Operating System is the shared operating loop that turns intent into guided execution packages.

Workflows must not be isolated to the Workflows page only.

Every page can eventually launch a workflow using the current page context.

A workflow should:

Start from a goal or selected object
Collect required context
Identify missing inputs
Prepare a package
Send to AI review if needed
Create or draft a task when needed
Open the correct destination page
Track the next action
### 5.4 Task / Handoff Layer

The Task / Handoff layer is the tracking and accountability layer.

When work needs follow-up, review, assignment, or execution, it should become:

Task
Task draft
Handoff
Approval request
Destination action

Task Center must preserve source context.

A task without source context is not enough.

## 6. Difference Between Action Types

Every action in MH-OS must be clearly classified.

### Page-native action

An action that belongs to the current page.

Examples:

Approve asset in Library.
Test connector in Integrations.
Prepare publishing payload in Publishing.
Select campaign in Campaign Studio.
### AI action

An action that sends current context to AI Command or an AI guidance surface.

Examples:

Review selected asset in AI.
Generate content plan.
Analyze campaign readiness.
Explain connector blocker.
### Workflow action

An action that starts or continues a workflow session.

Examples:

Launch Campaign Workflow.
Create Content Plan Workflow.
Fix Integration Workflow.
Prepare Publishing Package Workflow.
### Task action

An action that creates, drafts, opens, or updates a follow-up task.

Examples:

Create task from workflow.
Open Task Center with context.
Assign review task.
Draft follow-up task.
### Navigation action

An action that opens another page.

Navigation alone is not enough. It must either carry context or clearly explain what continues there.

Examples:

Open Campaign Studio with selected workflow context.
Open Task Center with prepared task draft.
Open AI Command with selected asset context.
### Backend execution action

An action that mutates durable backend/runtime state.

This requires explicit authority, governance, confirmation, and a separate implementation plan.

Examples:

Publishing live.
Running automation.
Starting auto mode.
Creating durable backend task.
Updating real connector settings.
Triggering runtime jobs.
## 7. Action Destination Map Standard

Every important action must have a destination map.

For each action define:

Action label
Action type
Source page
Destination page
Context carried
Expected feedback
Safe now or future/gated
Backend support required or not
Confirmation required or not
Governance required or not

No action should be only a button.

Every action must make the user feel:

I know what this does.
I know where it goes.
I know whether it started something.
I know what happens next.
## 8. Global Page Standard

Every upgraded page must have the following structure.

### 8.1 Header

The header must show:

Page title
Short mission line
Current project/context
Readiness/status chips
Current object/session when available
One primary action
One secondary action

The header should be strong but compact.

No long paragraphs in the header.

### 8.2 Main Workspace

The main workspace contains the actual domain work.

It should be visual, scannable, and action-oriented.

### 8.3 Action Panel

The action panel should show:

Selected item summary
Status/readiness
Primary action
Secondary actions
Routing/handoff actions
Danger zone separated
Technical details collapsed
### 8.4 AI Guidance

AI guidance should show:

Recommended next step
Why it matters
Remaining risk or gap
Suggested destination
One AI action when appropriate

AI guidance must not become a duplicate toolbar.

### 8.5 Workflow Quick Action

Every major page should eventually have a safe workflow quick action.

Examples:

Use selected assets in Campaign Workflow.
Fix connector workflow.
Create content plan workflow.
Prepare publishing workflow.
### 8.6 Task / Handoff Path

Every page must have a way to send unfinished work to Task Center when appropriate.

### 8.7 Technical Details

Technical details must be collapsed by default.

The main view should not expose raw technical noise.

## 9. Global UI/UX Rules
Visual guidance over long text.
Step-based flow.
Persistent context.
Clear feedback after every action.
No duplicate actions.
No raw technical wording in the main view.
One primary action per panel.
Secondary actions should be visually quieter.
Technical details collapsed.
Cards should be compact and scannable.
Use global design primitives before page-specific CSS.
Preserve responsive behavior.
No raw white surfaces in dark operational UI.
No new global theme files.
No duplicated CSS systems.
Navigation must preserve context when possible.
The user must always know whether work is selected, prepared, sent, drafted, handed off, blocked, or completed.
## 10. Page-by-Page Operating Model
### 10.1 Home
### Purpose

Executive entry point and system overview.

### User journey

The user enters the system and immediately sees:

Project readiness
Important blockers
Current project status
Latest activity
Next best action
Quick route to the most important work
### AI role
Summarize current state.
Recommend the next best action.
Explain why the action matters.
Convert high-level intent into workflow suggestion.
### Workflow role
Start the most important workflow from system status.
Example: Launch Readiness Workflow, Fix Integration Workflow, Prepare Campaign Workflow.
### Task handoff
Open or create follow-up tasks from the next best action.
### Do not do
Do not overload Home with every system tool.
Do not expose raw technical internals.
Do not become a replacement for specialized pages.
### 10.2 Setup
### Purpose

Prepare project and business foundations.

### User journey

The user completes required setup:

Project information
Brand basics
Business settings
Launch requirements
Required configuration
### AI role
Explain missing setup requirements.
Generate setup checklist.
Suggest safe configuration.
Help complete project profile.
### Workflow role
Setup Completion Workflow.
Launch Readiness Workflow.
### Task handoff
Create setup tasks for missing items.
Open Task Center with setup context.
### Do not do
Do not become a full operations dashboard.
Do not execute sensitive backend changes without confirmation.
### 10.3 Library
### Purpose

Asset Intelligence and Source-of-Truth Center.

### User journey

The user can:

Upload assets.
Classify assets.
Preview assets.
Approve source-of-truth files.
Review missing assets.
Route assets into campaign, content, media, or publishing work.
### AI role
Classify assets.
Extract claims.
Suggest where assets should be used.
Prepare content or campaign context from selected assets.
### Workflow role
Use Assets in Campaign Workflow.
Prepare Media Kit Workflow.
Prepare Publishing Package Workflow.
Source-of-Truth Review Workflow.
### Task handoff
Create review tasks.
Create missing asset tasks.
Create approval tasks.
Create media package tasks.
### Do not do
Do not publish directly.
Do not perform destructive actions without confirmation.
Do not treat unapproved assets as source-of-truth.
### 10.4 Integrations
### Purpose

Integration Control Tower.

### User journey

The user can:

Review connector health.
Connect platforms.
Test connectors.
Understand missing requirements.
Fix launch-critical blockers.
Understand sync readiness.
### AI role
Explain connector priority.
Explain why a connector is blocked.
Suggest remediation sequence.
Convert integration blocker into task or workflow.
### Workflow role
Fix Integration Workflow.
Data Coverage Workflow.
Launch Readiness Workflow.
### Task handoff
Create connector setup tasks.
Create validation tasks.
Open Task Center with connector context.
### Do not do
Do not expose secrets.
Do not imply sync success without backend confirmation.
Do not duplicate connector actions in multiple surfaces.
### 10.5 AI Command
### Purpose

Central AI thinking, drafting, analysis, and planning workspace.

### User journey

The user can:

Ask AI directly.
Receive context from another page.
Review AI-prepared workflow packages.
Generate plans, copy, insights, or next actions.
Convert output into task, workflow, or page handoff.
### AI role

AI Command is the main reasoning engine.

It must support:

Strategist role
Writer role
Designer/creative role
Ads role
Research role
### Workflow role
Governance-aware recommendations
### Workflow role
Convert AI output into workflow package.
Refine workflow package.
Send workflow package to destination page.
Send task draft to Task Center.
### Task handoff
Create tasks from AI-generated plans.
Open Task Center with AI output context.
### Do not do
Do not lose source page context.
Do not become disconnected chat only.
Do not execute backend actions without explicit authority.
### 10.6 Workflows
### Purpose

Workflow Operating Loop.

### User journey

The user can:

Choose a workflow template.
See required context.
Complete missing inputs.
Prepare a package.
Review with AI.
Create or draft a task.
Continue in destination page.
Track the result.
### AI role
Prepare workflow package.
Identify missing inputs.
Recommend next safe step.
Explain destination and risk.
### Workflow role

This is the main workflow session manager.

### Task handoff
Draft or create execution/follow-up tasks.
Open Task Center with workflow context.
### Do not do
Do not activate Run Live.
Do not activate Auto Mode.
Do not call backend workflow execution without explicit plan.
Do not show execution labels unless safe, governed, and approved.
### 10.7 Task Center
### Purpose

Execution and follow-up tracking.

### User journey

The user can:

View tasks.
Open task context.
See source page/workflow.
Complete or route follow-up work.
Continue task in destination page.
### AI role
Summarize task.
Suggest next step.
Convert task into workflow when needed.
Explain blocker or missing context.
### Workflow role
Receive workflow-generated tasks.
Continue workflow from task.
### Task handoff

Task Center is the main destination for task tracking.

### Do not do
Do not become only a static list.
Do not lose source workflow/page context.
Do not mix unrelated jobs and user tasks without clear grouping.
### 10.8 Queue Center
### Purpose

Queue and pending process visibility.

### User journey

The user can:

View queued work.
See pending processes.
Understand bottlenecks.
Escalate stuck items.
### AI role
Explain delays.
Recommend prioritization.
Suggest next action for blocked queue items.
### Workflow role
Show queued workflow-related operations when available.
### Task handoff
Escalate blocked queue items into tasks.
### Do not do
Do not mix raw job internals with user-facing tasks without explanation.
Do not expose dangerous runtime controls to normal users.
### 10.9 Job Monitor
### Purpose

Runtime/job monitoring.

### User journey

The user can:

Check if jobs succeeded.
Review failed jobs.
Understand runtime status.
Create follow-up repair tasks.
### AI role
Explain failure reasons.
Suggest investigation steps.
Summarize logs safely.
### Workflow role
Surface workflow job state when backend-safe.
### Task handoff
Create repair or inspection tasks for failed jobs.
### Do not do
Do not expose unsafe runtime operations to normal users.
Do not allow job execution without authority.
### 10.10 Notifications
### Purpose

User attention center.

### User journey

The user can:

See what changed.
See what failed.
See what needs approval.
See what is waiting.
Continue from notification.
### AI role
Summarize notifications.
Group related items.
Recommend response.
### Workflow role
Continue workflow from notification when context exists.
### Task handoff
Open or create follow-up tasks.
### Do not do
Do not become noisy.
Do not show duplicate notifications without grouping.
### 10.11 Campaign Studio
### Purpose

Campaign planning and execution workspace.

### User journey

The user can:

Create campaign plan.
Review campaign goal.
Define channels.
Attach assets.
Check campaign readiness.
Send work to content, media, publishing, or task follow-up.
### AI role
Generate campaign plan.
Suggest audience and messaging.
Prepare launch steps.
Identify missing campaign context.
### Workflow role
Receive Launch Campaign Workflow.
Start Campaign Optimization Workflow.
### Task handoff
Create campaign execution tasks.
Create content/media/publishing follow-up tasks.
### Do not do
Do not launch external actions without readiness and approval.
Do not duplicate content/media/publishing responsibilities.
### 10.12 Content Studio
### Purpose

Content planning and production workspace.

### User journey

The user can:

Create content plan.
Generate post batches.
Review hooks and angles.
Connect content to campaign.
Prepare content for publishing.
### AI role
Write content.
Rewrite content.
Generate hooks.
Suggest calendar.
Localize messaging.
### Workflow role
Receive Content Plan Workflow.
Start Content Batch Workflow.
### Task handoff
Create writing tasks.
Create review tasks.
Create approval tasks.
Create publishing tasks.
### Do not do
Do not publish directly without Publishing/Governance path.
Do not treat draft copy as approved copy.
### 10.13 Media Studio
### Purpose

Media and creative production workspace.

### User journey

The user can:

Prepare video briefs.
Prepare image jobs.
Define creative variants.
Connect assets to campaign/content work.
Track media production requirements.
### AI role
Generate briefs.
Suggest shot lists.
Suggest creative variants.
Prepare production instructions.
### Workflow role
Receive Media Job Workflow.
Start Creative Package Workflow.
### Task handoff
Create media production tasks.
Create review tasks.
### Do not do
Do not assume asset availability without Library context.
Do not treat generated creative direction as final approval.
### 10.14 Publishing
### Purpose

Publishing readiness, payload, schedule, and governance visibility.

### User journey

The user can:

Review what is ready to publish.
See blocked publishing items.
Check channel readiness.
Prepare payloads.
Route content to approval or publishing flow.
### AI role
Review readiness.
Improve copy.
Identify risk.
Explain blockers.
### Workflow role
Receive Publishing Package Workflow.
Start Publishing Readiness Workflow.
### Task handoff
Create publishing tasks.
Create review/approval tasks.
### Do not do
Do not bypass publishing governance.
Do not publish live without approved runtime plan and confirmation.
### 10.15 Insights
### Purpose

Performance understanding and decision support.

### User journey

The user can:

See performance.
Understand what worked.
Identify next actions.
Convert insights into optimization work.
### AI role
Analyze results.
Explain trends.
Recommend optimization.
Generate report summaries.
### Workflow role
Generate Report Workflow.
Campaign Optimization Workflow.
### Task handoff
Create follow-up optimization tasks.
### Do not do
Do not present unsupported metrics as truth.
Do not hide data source limitations.
### 10.16 Ads Manager
### Purpose

Paid campaign planning and optimization.

### User journey

The user can:

Prepare ad plans.
Review budget.
Define channels.
Create variants.
Connect ad work to campaign and content.
### AI role
Suggest ad angles.
Generate variants.
Recommend testing structure.
Explain optimization options.
### Workflow role
Paid Campaign Workflow.
Ads Optimization Workflow.
### Task handoff
Create ad setup tasks.
Create review tasks.
Create optimization tasks.
### Do not do
Do not spend or launch without backend-safe execution and approval.
Do not imply platform execution if connector support is missing.
### 10.17 Research
### Purpose

Market, competitor, and evidence research.

### User journey

The user can:

Research competitors.
Gather market evidence.
Compare ideas.
Convert research into campaign/content/workflow input.
### AI role
Summarize research.
Compare competitors.
Extract insights.
Suggest opportunities.
### Workflow role
Research Competitors Workflow.
Market Intelligence Brief Workflow.
### Task handoff
Create research follow-up tasks.
### Do not do
Do not treat unverified research as final truth.
Do not mix assumptions with sourced facts.
### 10.18 Governance
### Purpose

Risk, approval, compliance, and policy review.

### User journey

The user can:

Review risky actions.
Review claims.
Approve or reject outputs.
Understand compliance blockers.
### AI role
Identify risk.
Explain approval requirements.
Suggest safer wording or process.
### Workflow role
Governance Review Workflow.
Approval Workflow.
### Task handoff
Create approval tasks.
Create revision tasks.
### Do not do
Do not allow governance bypass.
Do not approve sensitive action automatically.
### 10.19 Settings
### Purpose

System and project preferences.

### User journey

The user can:

Configure preferences.
Review project settings.
Adjust safe system options.
### AI role
Explain settings.
Suggest safe configuration.
### Workflow role

Minimal. Settings may start setup workflow only when appropriate.

### Task handoff
Create setup/configuration tasks.
### Do not do
Do not become an operations page.
Do not hide sensitive configuration changes.
## 11. Global Workflow Operating System

The system needs one shared Workflow Operating System, not a separate workflow implementation per page.

### 11.1 Workflow Template Registry

Defines:

workflowId
title
purpose
required inputs
optional inputs
destination page
AI mode
task output
safe/future execution status
governance requirement
### 11.2 Workflow Session

Created when a user starts a workflow.

Fields:

workflowId
workflowTitle
sourcePage
destinationPage
project
campaign
goal
selected assets/connectors/items
requiredInputs
missingInputs
preparedPackage
status
nextAction
createdAt
updatedAt

Statuses:

selected
context_needed
ready_to_prepare
prepared
sent_to_ai
task_drafted
handed_off
completed
blocked
### 11.3 Workflow Launcher

A shared launcher available from pages as a quick action.

It should start workflows using the current page context.

### 11.4 Action Destination Map

Every action must define:

what it does
destination page
context carried
action type
feedback
whether it is safe now
whether backend support is required
whether confirmation is needed
whether governance is required
### 11.5 AI Context Bridge

Transfers page/workflow context into AI Command.

### 11.6 Task / Handoff Bridge

Transfers prepared workflow output into Task Center or destination pages.

### 11.7 Safe Execution Boundary

Live execution requires:

separate backend/runtime plan
confirmation
governance
authority validation
rollback path
## 12. Protected Invariants

These must remain protected:

Publishing governance gate
Durable approvals / handoffs / tasks
Startup unlock and loading lifecycle
Overlay / AI Dock blocking
Dry-run compatibility fallback
Backend role / permission authority
Runtime ownership boundaries
Backend as source of truth
Frontend as projection
No silent live execution
No governance bypass
## 13. Updated Execution Order

M0: Baseline Lock
M1: Parity / Evidence Instrumentation
M2: Library stabilization — completed
M3: Integrations stabilization — completed
M4: Workflows Operating Loop — completed as active frontend-safe route
M5: Global Design Foundation — completed first safe primitive pass
M6: Final System Operating Model — current step
M7: Global Workflow Operating System architecture
M8: Shared Workflow Launcher / Session Model frontend-safe pass
M9: AI Command context bridge refinement
M10: Task Center handoff refinement
M11: Publishing governance visibility
M12: Durable-first handoff
M13: Runtime ownership extraction
M14: Premium UX and AI Team experience

## 14. Immediate Next Step

Finalize this file as the canonical MH-OS operating model.

Then define:

GLOBAL_WORKFLOW_OPERATING_SYSTEM_ARCHITECTURE

Only after that should implementation continue.

The next implementation must be small, shared, frontend-safe, and must not activate backend execution.