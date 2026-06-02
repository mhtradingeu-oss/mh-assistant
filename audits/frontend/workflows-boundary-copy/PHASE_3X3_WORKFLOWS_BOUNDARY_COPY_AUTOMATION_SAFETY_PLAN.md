# PHASE 3X.3 — Workflows Boundary Copy / Automation Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3X.2 — Workflows Execution / Automation Safety Audit`
- Previous commit: `0e9a714 Add Workflows execution safety audit`

## Purpose
Plan safe copy/label improvements for Workflows after execution safety audit confirmed Workflows is an execution-adjacent operating surface.

The goal is to prevent operators from confusing:
- active safe preparation surface
- preserved backend workflow run helpers
- local drafts
- AI review handoffs
- Task Center review handoffs
- automation simulation
- auto-mode gates
- publishing package preparation
- Governance-gated execution boundaries

## Evidence From PHASE 3X.2
Confirmed:
- Workflows has local draft actions.
- Workflows has backend workflow run actions through preserved helpers.
- Workflows has AI workflow run paths.
- Workflows has `mh:submit-workflow` external event bridge.
- Workflows can create shared handoffs and optionally backend handoff records.
- Workflows includes automation simulation and auto-mode controls.
- Auto approve / auto skip are critical risk labels.
- Workflows can route toward Publishing but must not imply external publishing or Governance bypass.
- The active route surface appears safer and states that preserved helpers are not activated by the active render surface, but preserved helpers still exist and must stay safety-audited.

## Copy Risk Areas

### 1. Prepare Workflow Package
Risk:
May be interpreted as execution, and preserved helper can call backend workflow run API.

Recommended copy direction:
- Prepare review package
- Record backend workflow output only where confirmed
- Does not publish, send, create CRM records, or bypass Governance

### 2. Catalog Prepare
Risk:
Can call the same backend workflow run helper in preserved execution loop.

Recommended copy direction:
- Prepare package for review
- Backend run may be recorded
- Confirmation required if backend helper is reachable

### 3. AI handoff
Risk:
Operator may think AI runs or approves workflow.

Recommended copy direction:
- Send to AI for review only
- AI can refine structure, not execute or approve
- Human action required for backend workflow run

### 4. Task Center handoff
Risk:
Operator may think task is created directly.

Recommended copy direction:
- Prepare Task Center review handoff
- Does not create/assign a durable task unless Task Center confirms

### 5. Automation simulation
Risk:
“Simulation” can still create handoffs, prompts, drafts, or navigate.

Recommended copy direction:
- Guided automation simulation
- May prepare drafts/handoffs only
- Does not publish/send/delete/approve externally

### 6. Auto Start
Risk:
Critical. Starts auto-mode and may continue safe steps until approval.

Recommended copy direction:
- Start Guided Auto Mode
- Runs only safe preparation steps
- Stops at approval-required gates
- Does not replace Governance approval

### 7. Auto Approve / Auto Skip
Risk:
Critical. Labels can be confused with Governance approval or bypass.

Recommended copy direction:
- Approve automation gate only
- Skip automation gate only
- Does not approve Governance decisions
- Does not bypass backend policy

### 8. External Event Bridge
Risk:
`mh:submit-workflow` can trigger backend workflow execution from outside visible Workflows UI.

Recommended plan:
- Do not patch behavior in copy-only phase.
- Add audit note / future backend guard review.
- Consider future source validation or confirmation requirement in behavior-approved phase.

### 9. Publishing package workflow
Risk:
Can be confused with external publishing.

Recommended copy direction:
- Prepare publishing package handoff
- Publishing/Governance own execution and approval gates
- No external publish from Workflows

### 10. Active vs preserved surface
Risk:
Operators and developers may misunderstand active UI versus preserved helpers.

Recommended copy direction:
- Active page prepares workflow review sessions.
- Preserved execution helpers remain safety-audited.
- Destination tools own execution authority.

## Allowed Future Patch Scope
A future patch may change:
- Button labels.
- Helper copy.
- Confirmation copy.
- Warning banners.
- Section headings.
- Success messages.
- Technical details copy.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- Automation engine behavior.
- CSS.
- Data files.
- Workflow execution logic.
- Approval/gate logic.
- Publishing execution behavior.
- AI behavior.

## Required Browser QA After Patch
Check:
- Workflows page loads.
- Active page copy says prepare/review/handoff, not execute/live.
- Technical details clarify active surface versus preserved helpers.
- AI handoff copy says AI review only.
- Task Center copy says review handoff.
- Publishing copy says package/handoff, not external publish.
- Auto mode copy, if visible, says guided preparation only.
- Auto approve/skip copy, if visible, does not imply Governance approval.
- No backend-mutating Workflows action is executed during QA.

## Recommended Next Phase
`PHASE 3X.4 — Workflows Copy-Only Automation Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.
