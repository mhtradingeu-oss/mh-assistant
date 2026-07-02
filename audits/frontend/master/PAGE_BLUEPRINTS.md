# MH-OS Page Blueprints

## Purpose

Define canonical target structure for each major page so future UX and frontend work follows one operating model consistent with MH-OS doctrine.

This document converts authority and action-destination rules into page-by-page implementation targets.

## Global Page Contract

Every major page should define:
- Role
- Header
- Main Workspace
- Action Panel
- AI Guidance
- Workflow Quick Action
- Task/Handoff Path
- Forbidden Behavior
- Backend Dependencies

## Universal Page Model Reminder

Header -> Main Workspace -> Action Panel -> AI Guidance -> Workflow Quick Action -> Task/Handoff Path -> Technical Details collapsed

## Page Blueprints

## Home

A. Role: Executive mission control and next-best-action entry.
B. Header should show: active project, current route context, top-level readiness summary, priority alerts.
C. Main Workspace should show: cross-page operational snapshot, key blockers, immediate priorities.
D. Action Panel should include: open destination pages, request focused analysis, start guided resolution path.
E. AI Guidance should provide: next-best-action recommendations with rationale and destination links.
F. Workflow Quick Action examples: Start launch-readiness workflow, Start blocker-triage workflow.
G. Task/Handoff path: create task for blockers, create handoff to owning page/operator.
H. Forbidden behavior: hidden execution, silent state mutation, authority decisions in frontend.
I. Backend dependencies/authority source: project summary, readiness, alerts, tasks, queue, approvals.

## Setup

A. Role: Project foundation and operational readiness baseline.
B. Header should show: project identity, setup completion state, last update timestamp.
C. Main Workspace should show: setup fields, required completeness indicators, draft status.
D. Action Panel should include: save draft, request review, route to affected operating pages.
E. AI Guidance should provide: setup gap analysis and guided completion suggestions.
F. Workflow Quick Action examples: Start setup completion workflow, Start setup validation workflow.
G. Task/Handoff path: create task for missing setup dependencies, handoff to Governance when policy-sensitive.
H. Forbidden behavior: direct governance approval in UI, hidden durable writes without backend trace.
I. Backend dependencies/authority source: setup persistence, validation endpoints, policy constraints.

## Library

A. Role: Asset truth projection, readiness, and controlled asset actions.
B. Header should show: project asset readiness, selected category/filter context, upload state.
C. Main Workspace should show: asset catalog, readiness signals, selected asset details.
D. Action Panel should include: upload, classify, mark source-of-truth, create package/handoff.
E. AI Guidance should provide: asset quality/readiness recommendations and missing asset guidance.
F. Workflow Quick Action examples: Start asset readiness workflow, Start content-prep workflow from selected assets.
G. Task/Handoff path: create task for missing asset classes, handoff selected assets to Content/Media/Publishing.
H. Forbidden behavior: direct publishing, frontend-only approval, unsafe destructive actions without confirmation.
I. Backend dependencies/authority source: library catalog, protected media access, asset status/source-of-truth APIs.

## Integrations

A. Role: Connector health projection and remediation routing.
B. Header should show: connector status summary, critical integration alerts, sync freshness.
C. Main Workspace should show: connectors, diagnostics, health checks, error states.
D. Action Panel should include: run backend sync, reconnect, create remediation task/workflow.
E. AI Guidance should provide: likely root cause analysis and repair sequence recommendations.
F. Workflow Quick Action examples: Start connector recovery workflow, Start channel readiness workflow.
G. Task/Handoff path: create task for unresolved integration failures, handoff to operations/governance when required.
H. Forbidden behavior: opaque reconnect side effects, execution without explicit backend trace.
I. Backend dependencies/authority source: integration control center endpoints, diagnostics/sync/reconnect APIs.

## AI Command

A. Role: Guided AI operating entry and orchestration support.
B. Header should show: active mode, command context scope, project alignment indicator.
C. Main Workspace should show: command draft, AI responses, suggested actions/routes.
D. Action Panel should include: send prompt, create task, create handoff, start workflow from AI output.
E. AI Guidance should provide: structured recommendations with destination-safe action framing.
F. Workflow Quick Action examples: Start workflow from AI recommendation, Generate workflow package from command.
G. Task/Handoff path: convert AI recommendation to durable task or handoff with trace.
H. Forbidden behavior: AI acting as authority, hidden execution, ambiguous Auto Mode triggers.
I. Backend dependencies/authority source: AI command service, durable handoff/task APIs, automation guard state.

## Workflows

A. Role: Structured multi-step orchestration planning and controlled execution routing.
B. Header should show: selected workflow, current stage, gate status, run state.
C. Main Workspace should show: workflow plan, step states, blockers, required approvals.
D. Action Panel should include: start/pause/resume within allowed policy, request approval, create tasks.
E. AI Guidance should provide: step optimization suggestions and policy-safe next actions.
F. Workflow Quick Action examples: Start launch campaign workflow, Run one safe step, Prepare approval package.
G. Task/Handoff path: create task from blocked step, handoff package to Governance or destination page.
H. Forbidden behavior: unsafe auto execution, bypassing approvals, hidden high-impact operations.
I. Backend dependencies/authority source: automation engine state, workflow execution APIs, governance gate data.

## Task Center

A. Role: Operational task visibility and action tracking projection.
B. Header should show: open task counts by priority/status, owner focus, freshness indicator.
C. Main Workspace should show: task list, selected task detail, filters/search.
D. Action Panel should include: refresh, copy summary, navigate to owning page, create follow-up task/handoff.
E. AI Guidance should provide: prioritization and sequencing recommendations from current task state.
F. Workflow Quick Action examples: Start blocker-resolution workflow from selected task.
G. Task/Handoff path: create child task, handoff to Queue/Job/Governance as needed.
H. Forbidden behavior: frontend-only completion authority without backend trace.
I. Backend dependencies/authority source: task center read/write endpoints, notification trace links.

## Queue Center

A. Role: Queue state visibility and prioritization projection.
B. Header should show: queue depth, active/running distribution, status mix.
C. Main Workspace should show: queue items, selected queue detail, status filters.
D. Action Panel should include: refresh queue, route to owner page, create remediation task.
E. AI Guidance should provide: queue prioritization and bottleneck recommendations.
F. Workflow Quick Action examples: Start queue-clearing workflow for selected queue type.
G. Task/Handoff path: create task for blocked queue items, handoff to operations owner.
H. Forbidden behavior: hidden queue mutation without backend acknowledgement.
I. Backend dependencies/authority source: queue center endpoints, execution status data.

## Job Monitor

A. Role: Execution job status projection and escalation surface.
B. Header should show: running/failed/completed counts, last refresh status.
C. Main Workspace should show: jobs list, selected job logs/metadata summary.
D. Action Panel should include: refresh, open related page, create escalation task.
E. AI Guidance should provide: failure pattern hints and recommended recovery actions.
F. Workflow Quick Action examples: Start failure-recovery workflow from selected job family.
G. Task/Handoff path: escalate failed jobs to task and handoff to responsible page/team.
H. Forbidden behavior: pretending execution is complete without backend confirmation.
I. Backend dependencies/authority source: job monitor endpoints, execution telemetry summaries.

## Notifications

A. Role: Operational signal inbox and acknowledgment routing.
B. Header should show: unread counts, severity distribution, notification freshness.
C. Main Workspace should show: notification feed, severity filters, selected detail.
D. Action Panel should include: mark read, open destination context, create follow-up task.
E. AI Guidance should provide: summarize critical signals and suggest response order.
F. Workflow Quick Action examples: Start incident-response workflow for critical notifications.
G. Task/Handoff path: convert critical notifications into tasks/handoffs with evidence.
H. Forbidden behavior: dropping high-severity notifications without traceable action path.
I. Backend dependencies/authority source: notification center endpoints, mark status APIs.

## Campaign Studio

A. Role: Campaign planning surface and package preparation.
B. Header should show: campaign objective, readiness status, channel scope.
C. Main Workspace should show: campaign plan, audience/message structure, dependencies.
D. Action Panel should include: prepare campaign draft, send to AI, create package/handoff.
E. AI Guidance should provide: strategy refinement and risk-aware recommendations.
F. Workflow Quick Action examples: Start campaign launch workflow, Start campaign QA workflow.
G. Task/Handoff path: task for unresolved campaign blockers, handoff to Content/Publishing.
H. Forbidden behavior: direct live execution without governance.
I. Backend dependencies/authority source: campaign persistence endpoints, readiness data.

## Content Studio

A. Role: Content planning and draft preparation workspace.
B. Header should show: content objective, format/channel target, draft status.
C. Main Workspace should show: content drafts, variant options, readiness checks.
D. Action Panel should include: save draft, ask AI rewrite/review, prepare handoff package.
E. AI Guidance should provide: quality, consistency, and compliance recommendations.
F. Workflow Quick Action examples: Start content production workflow, Start content QA workflow.
G. Task/Handoff path: handoff approved drafts to Media/Publishing; task unresolved content gaps.
H. Forbidden behavior: publish from unclear buttons, hidden external execution.
I. Backend dependencies/authority source: content draft persistence, validation/compliance services.

## Media Studio

A. Role: Media production planning and asset package preparation.
B. Header should show: media job scope, required assets, output readiness state.
C. Main Workspace should show: media plan, source assets, output drafts/previews.
D. Action Panel should include: prepare media package, request review, handoff to Publishing.
E. AI Guidance should provide: format optimization and quality readiness guidance.
F. Workflow Quick Action examples: Start media production workflow, Start media QA workflow.
G. Task/Handoff path: task for missing media dependencies, handoff output package to Publishing.
H. Forbidden behavior: direct live publish, destructive asset mutation without confirmation.
I. Backend dependencies/authority source: media asset services, packaging/validation endpoints.

## Publishing

A. Role: Publication package preparation and governance-gated release path.
B. Header should show: package readiness, approvals status, channel targets.
C. Main Workspace should show: publish candidates, schedule data, blockers, policy gates.
D. Action Panel should include: prepare package, request approval, run backend publish action when allowed.
E. AI Guidance should provide: readiness check and channel-risk guidance.
F. Workflow Quick Action examples: Start publishing readiness workflow, Start preflight checklist workflow.
G. Task/Handoff path: task for blocker remediation, handoff package to Governance for approval.
H. Forbidden behavior: live publish without governance, frontend-only approval, unsafe Auto Mode execution.
I. Backend dependencies/authority source: publishing schedule/action endpoints, approvals/governance state.

## Insights

A. Role: Performance and operational insight projection with sourced evidence.
B. Header should show: reporting window, project context, confidence/source markers.
C. Main Workspace should show: key metrics, trends, anomalies, sourced explanatory notes.
D. Action Panel should include: open source detail, create task from insight, route to relevant page.
E. AI Guidance should provide: interpretation and suggested next actions with confidence framing.
F. Workflow Quick Action examples: Start performance improvement workflow.
G. Task/Handoff path: create task/handoff for underperformance findings.
H. Forbidden behavior: presenting unsourced metrics as fact.
I. Backend dependencies/authority source: analytics/insight endpoints with source metadata.

## Ads Manager

A. Role: Paid activity projection, planning, and safe action routing.
B. Header should show: paid channel status, spend posture, critical performance flags.
C. Main Workspace should show: campaign/adset performance projection and recommendations.
D. Action Panel should include: prepare paid change package, request review, create task.
E. AI Guidance should provide: optimization recommendations and risk-aware options.
F. Workflow Quick Action examples: Start paid optimization workflow.
G. Task/Handoff path: handoff approved paid package for governed execution.
H. Forbidden behavior: hidden live ad execution from ambiguous button.
I. Backend dependencies/authority source: paid integrations, policy/gate state, execution logs.

## Research

A. Role: Market and competitor intelligence projection for decisions.
B. Header should show: research scope, freshness, confidence/source quality indicator.
C. Main Workspace should show: findings, comparisons, implications for current project goals.
D. Action Panel should include: save research package, create task, route to Campaign/Content/Strategy pages.
E. AI Guidance should provide: synthesis and decision-focused recommendations.
F. Workflow Quick Action examples: Start competitor-response workflow.
G. Task/Handoff path: handoff findings to Campaign Studio; create tasks for evidence gaps.
H. Forbidden behavior: unsourced claims presented as operational truth.
I. Backend dependencies/authority source: research ingestion and persistence endpoints.

## Governance

A. Role: Approval visibility and controlled governance actions.
B. Header should show: pending approvals, SLA/age, risk level distribution.
C. Main Workspace should show: approval requests, evidence packets, policy checks.
D. Action Panel should include: approve/reject with trace, request more evidence, route to owning page.
E. AI Guidance should provide: policy-aware review assistance without replacing authority decisions.
F. Workflow Quick Action examples: Start governance review workflow, Start remediation workflow after rejection.
G. Task/Handoff path: create compliance tasks and handoffs to responsible pages after decision.
H. Forbidden behavior: bypassing policy gates, frontend-only approval state.
I. Backend dependencies/authority source: governance policy engine, approval ledger, audit trail endpoints.

## Settings

A. Role: Configuration projection and safe preference management.
B. Header should show: environment/project context, config change status, last sync state.
C. Main Workspace should show: grouped settings with impact visibility and validation states.
D. Action Panel should include: save draft changes, run backend sync, request approval for policy-sensitive changes.
E. AI Guidance should provide: configuration recommendations and side-effect warnings.
F. Workflow Quick Action examples: Start configuration validation workflow.
G. Task/Handoff path: task/handoff for settings requiring external owner or governance review.
H. Forbidden behavior: hidden high-impact config mutation without trace or confirmation.
I. Backend dependencies/authority source: settings persistence APIs, policy validation and sync endpoints.

## Safety Defaults

- Publishing and Workflows remain high-risk for live execution.
- AI Command is guidance/orchestration, not authority.
- Library is asset truth projection, not direct publishing.
- Governance is approval visibility and controlled actions, not bypass.

## Relationship To Master Doctrine

This document is companion guidance to:
- [FRONTEND_MASTER_AUTHORITY.md](audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md)
- [ACTION_DESTINATION_MAP.md](audits/frontend/master/ACTION_DESTINATION_MAP.md)

Precedence rule:
- If blueprint details conflict with master authority/action destination doctrine, those canonical documents win.

## Implementation Protocol

Page work must follow this sequence:

Audit -> Confirm -> Decide -> Implement -> Browser QA -> Commit -> Closeout

## Old Docs Policy

Old audit documents remain as historical reference.

They do not override documents in audits/frontend/master.

No archive, move, delete, or rename of legacy audit docs is required for this step.

## Explicit No-Code-Change Statement

This Step 10 task is documentation-only.

No production code was modified.
- No frontend JS changes
- No CSS changes
- No backend changes
- No data/projects changes
- No route behavior changes
