# STEP 29A — Publishing Operating Surface Truth Audit
Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: AUDIT ONLY / documentation-only

---

## Executive Summary

This audit reviewed the current Publishing page as the next Operating Surface candidate after the Library checkpoint.

Decision:
- Publishing is a valid next Operating Surface target because it already exposes the highest-authority publishing actions in a visible, structured workspace.
- The current page already maps cleanly to an Operating Surface model:
  - Header / overview and recommendation area
  - Main execution view and queue
  - Manual action controls
  - AI/context and handoff surface
- Existing safety gates for Publish and Fail are present and should remain intact.
- The smallest safe STEP 29B candidate is a copy-only provenance clarification pass, not a structural rewrite.

Primary finding:
- The main remaining issues are copy/provenance gaps around authority and intent, especially for Approve, Auto Mode approval controls, and workflow/AI context actions.

This audit makes no production code changes.

---

## Files Inspected

- public/control-center/pages/publishing.js
- public/control-center/pages/publishing/publishing-payloads.js
- public/control-center/automation-engine.js
- public/control-center/api.js
- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/ops/backbone.js
- audits/frontend/safety/STEP_19C_PUBLISH_CONFIRMATION_GATE_PATCH.md
- audits/frontend/safety/STEP_19E_FAIL_CONFIRMATION_GATE_PATCH.md
- audits/frontend/safety/STEP_24_SAFETY_GATES_COMPLETION_CHECKPOINT.md
- audits/frontend/library/STEP_28_LIBRARY_OPERATING_SURFACE_CHECKPOINT.md

---

## Current Page Structure

## Top-Level Surface

The Publishing route is still implemented in a single page file with one helper module for payload building and one shared automation dependency.

Current implementation split:
- `publishing.js`
  - queue shaping
  - state/session handling
  - render functions
  - event binding
  - mutation dispatch to API wrappers
- `publishing/publishing-payloads.js`
  - schedule payload builder
  - local draft payload builder
  - AI prompt builder
- `automation-engine.js`
  - Auto Mode state machine
  - approval gate / skip behavior

Current route composition in `publishing.js`:
- `renderOverview(...)`
- `renderRecommendation(...)`
- `renderQueue(...)`
- `renderBuilder(...)`
- manual execution controls section
- `renderWorkflowHandoff(...)`
- `renderCalendar(...)`
- `renderExecutionResult(...)`
- `renderAssetGate(...)`
- `bindPublishingWorkspace(...)`

## Operating Surface Equivalents

### Header Equivalent

Present.

Current Header-equivalent surface is the combined top area:
- Publishing Overview
- Smart Recommendation

This area currently communicates:
- queue volume
- ready/scheduled/draft/failed counts
- next publish window
- current recommendation
- AI/open-context action
- Auto Mode controls and status

### Main View Equivalent

Present.

Current Main View-equivalent surface:
- Publish Queue
- Publishing Builder
- Manual Execution Controls

This is the main operator workspace for:
- selecting a queue item
- reviewing status
- editing schedule inputs
- saving local/backend draft state
- scheduling/rescheduling
- approving
- marking failed
- publishing from queue actions

### Action Panel Equivalent

Present, but distributed instead of isolated in one dedicated module.

Current action-bearing areas are:
- Smart Recommendation action row
- queue row action buttons
- builder form action row
- Manual Execution Controls card
- Workflow Handoff action row

So Publishing already has an Action Panel equivalent, but it is spread across multiple cards rather than one dedicated panel component.

### AI Panel Equivalent

Present, but also distributed.

Current AI/context-equivalent surfaces are:
- `Open AI: Send Context to AI Workspace`
- Workflow Handoff card
- Auto Mode status / gated approval area

This is not a dedicated AI Panel module, but it is functionally an AI/context side surface.

### Side Surface / Context Rail

Present.

The right-side column currently acts as a context rail containing:
- Workflow Handoff
- Calendar / Timeline Snapshot
- Execution Result Area
- Channel & Approval Readiness

This is already close to an Operating Surface side panel model.

---

## Existing Safety Gates

Confirmed existing safety gates:

### Publish Confirmation

Exists.

Current frontend confirmation text communicates:
- action: publish this item now
- risk: external live effect / difficult to reverse
- policy: approval and readiness must be satisfied
- cancel path: keep item in queue

Backend authority also exists behind this action:
- `assertPublishingMutationAllowed(project, 'publish', ...)`
- governance enforcement checks include:
  - `freeze_publishing`
  - `approval_before_publish`

### Fail Confirmation

Exists.

Current frontend confirmation text communicates:
- action: mark publishing item as failed
- risk: permanent failure record / lifecycle stop
- policy: use only when explicit failure logging is required
- cancel path: keep current state

### Safety Position Summary

Publishing currently has the two required safety gates already in place:
- Publish confirmed
- Fail confirmed

No new confirmation requirement is justified by this audit for:
- safe navigation
- AI/open-context actions
- handoff loading
- local draft save
- queue review/select actions
- Auto Mode approval gate controls

---

## Action Inventory

## High-Authority Actions Requested For Audit

### 1. Publish

UI entry points:
- queue row action: `Publish now`

Frontend behavior:
- validates required schedule and approval fields
- requires publish confirmation
- calls `publishPublishingItem(projectName, jobId, { notes })`

API wrapper:
- `POST /media-manager/project/:project/publishing/:jobId/publish`

Backend behavior:
- `assertPublishingMutationAllowed(..., 'publish', ...)`
- updates scheduled job status to `published`
- records publishing execution outcome

Authority:
- backend mutation
- external/live-effect semantics

### 2. Approve

UI entry point:
- manual execution control: `Approve`

Frontend behavior:
- for local draft: marks local draft ready/approved in browser state
- for durable job: calls `approvePublishingItem(projectName, jobId, { notes })`

API wrapper:
- `POST /media-manager/project/:project/publishing/:jobId/ready`

Backend behavior:
- `assertPublishingMutationAllowed(..., 'ready', ...)`
- updates scheduled job status to `ready`

Authority:
- backend mutation for durable jobs
- local-only mutation for local drafts

Important truth finding:
- UI label says `Approve`, but durable backend action is actually `ready` status mutation, and backend policy still requires a durable approval decision before ready/publish mutations when `approval_before_publish` is enabled.

### 3. Fail

UI entry point:
- manual execution control: `Mark Failed`

Frontend behavior:
- for local draft: marks local draft failed
- for durable job: requires fail confirmation, then calls `failPublishingItem(...)`

API wrapper:
- `POST /media-manager/project/:project/publishing/:jobId/fail`

Backend behavior:
- `assertPublishingMutationAllowed(..., 'fail', ...)`
- updates job status to `failed`
- records execution outcome with failure state

Authority:
- backend mutation
- terminal lifecycle mutation

### 4. Schedule

UI entry points:
- builder action: `Schedule`
- queue action: `Schedule` scrolls operator to builder rather than mutating directly

Frontend behavior:
- validates scheduling fields
- creates/saves durable schedule when no current durable job exists
- local-only scheduling path exists for browser draft records

API wrapper:
- `POST /media-manager/project/:project/publishing/schedule`

Backend behavior:
- `assertPublishingMutationAllowed(..., 'schedule', ...)`
- creates or upserts scheduled job record

Authority:
- backend mutation for durable schedule
- local-only draft mutation for browser-only item

### 5. Reschedule

UI entry points:
- schedule button when a durable current item exists
- queue row actions:
  - `Pause`
  - `Retry`

Frontend behavior:
- uses `reschedulePublishingItem(...)`
- `Pause` maps to status `draft`
- `Retry` maps to status `scheduled`

API wrapper:
- `POST /media-manager/project/:project/publishing/:jobId/reschedule`

Backend behavior:
- `assertPublishingMutationAllowed(..., 'reschedule', ...)`
- updates existing durable job record

Authority:
- backend mutation

### 6. Auto Prepare

UI entry point:
- recommendation action row: `Auto Prepare Publishing`

Frontend behavior:
- builds an auto-mode plan
- includes:
  - `prepare_publishing_draft`
  - gated `publish_now` step
- runs Auto Mode in `auto_until_approval`

Automation truth:
- safe prepare step is allowed
- publish step is explicitly gated and not auto-executed

Authority:
- automation-state action
- may prepare draft flow
- does not auto-publish

### 7. Auto Approve

UI entry point:
- Auto Mode gated state: `Approve and Continue`

Frontend behavior:
- calls `approveCurrentGate(...)`

Automation truth:
- this is not a backend publishing approval mutation
- this approves the Auto Mode gate and navigates toward manual continuation
- automation engine explicitly states approval never means auto-publish or destructive auto-execution

Authority:
- AI/automation control state
- not a publishing backend mutation

### 8. Auto Skip

UI entry point:
- Auto Mode gated state: `Skip Step`

Frontend behavior:
- calls `skipCurrentStep(...)`

Automation truth:
- skips the current gated automation step
- does not mutate publishing backend state directly

Authority:
- AI/automation control state
- not a publishing backend mutation

### 9. Send to AI

UI entry point:
- recommendation action row: `Open AI: Send Context to AI Workspace`

Frontend behavior:
- builds publishing AI prompt
- stores AI draft context
- writes shared handoff context
- navigates to AI Command

Truth:
- opens/sends context only
- does not publish
- does not approve
- does not execute backend publishing mutation

Authority:
- AI context / routing action

### 10. Load Handoff

UI entry point:
- Workflow Handoff card: `Load Workflow Output`

Frontend behavior:
- reads available handoff summary
- loads handoff values into form
- saves local draft in browser state

Truth:
- imports workflow context into a local draft
- does not execute publish
- does not create durable backend publishing mutation by itself

Authority:
- context-loading action
- local-only draft mutation

---

## Risk Classification

### Safe / Navigation

- `Review`
- queue item selection
- `Schedule` queue-row scroll-to-builder action
- `Open Publish Queue`
- filter chips
- `New Draft`
- calendar row selection
- `Stop Auto Mode`

Reason:
- no backend publishing mutation
- no external effect
- mostly view, focus, or local interaction

### AI Context

- `Open AI: Send Context to AI Workspace`
- `Load Workflow Output`
- `Auto Prepare Publishing`
- `Approve and Continue` for Auto Mode gate
- `Skip Step`

Reason:
- these primarily move or approve context, automation flow, or draft preparation
- they do not directly publish externally

Important nuance:
- `Load Workflow Output` and local draft save are still state-changing, but only in frontend/local draft context, not durable publishing execution authority

### Backend Mutation

- `Schedule` durable save path
- `Reschedule`
- `Pause`
- `Retry`
- `Approve` durable job path
- `Publish now`
- `Mark Failed`

Reason:
- these call protected backend routes
- backend remains authority

### Dangerous / External-Effect

- `Publish now`
- `Mark Failed`

Reason:
- `Publish now` creates live/external publishing effect semantics
- `Mark Failed` writes a terminal failure record and stops lifecycle progression

Secondary high-authority but lower-tier than external effect:
- durable `Approve`
- `Schedule`
- `Reschedule`

These are important backend mutations, but current audit does not place them in the same danger tier as publish/fail.

---

## Current Copy / Provenance Issues

This audit identified copy/provenance issues only. No handler, backend, CSS, or data changes are recommended in STEP 29A.

### 1. `Approve` is underspecified

Current issue:
- `Approve` reads like a final governance approval decision.

Why this is a provenance problem:
- durable action actually hits the backend `ready` route
- backend governance may still require a durable approval record before allowing ready/publish mutation
- for local drafts, the same label only updates browser-local draft state

Result:
- one label currently represents two different authority levels:
  - local draft state change
  - durable ready-state backend mutation

### 2. `Schedule` is underspecified on the builder

Current issue:
- builder button reads `Schedule`.

Why this is a provenance problem:
- current behavior can mean:
  - create durable scheduled backend job
  - reschedule existing durable job
  - schedule only a local draft in browser state

Result:
- label does not disclose whether the action is backend schedule creation or local-only draft scheduling.

### 3. `Load Workflow Output` does not fully disclose local-draft behavior

Current issue:
- label focuses on load action only.

Why this is a provenance problem:
- current behavior loads workflow output into the form and saves a local publishing draft
- it does not create a durable backend publishing job by itself

Result:
- operator could assume backend queue creation when actual behavior is local draft hydration.

### 4. Auto Mode approval controls are easy to misread as publishing approval

Current issue:
- `Approve and Continue`
- `Skip Step`

Why this is a provenance problem:
- these labels live on the Publishing page near real publishing authority controls
- automation engine treats them as Auto Mode gate controls only
- they do not approve a publishing job and do not auto-publish

Result:
- wording can be conflated with actual publishing approval.

### 5. `Auto Prepare Publishing` is improved by banner text, but still slightly compressed

Current issue:
- button label implies a broad automated publishing operation.

Why this is only a copy issue, not a behavior issue:
- automation engine blocks auto-publish
- banner already states that AI/context action does not execute publishing
- auto plan explicitly stops at approval for publish-like steps

Result:
- behavior is safe, but naming could be more explicit that this is draft preparation, not execution.

### 6. Queue-row `Publish now` is clear, but `Pause` and `Retry` are backend-state terms without provenance hint

Current issue:
- `Pause`
- `Retry`

Why this is a provenance problem:
- both map to backend reschedule mutations for durable jobs
- for local drafts they only mutate local draft state

Result:
- operator does not get clear wording that these are queue-state mutations rather than navigation or review actions.

### 7. AI/open-context wording is stronger than before, but split across multiple areas

Current issue:
- provenance is partly carried by a banner rather than every relevant action label.

Result:
- overall intent is understandable, but action naming and supporting copy are not fully harmonized across:
  - AI send
  - workflow handoff load
  - auto gate controls

---

## Recommended STEP 29B Candidate

Smallest safe STEP 29B candidate:

### Copy-Only Publishing Action Provenance Clarification

Scope:
- copy only
- no CSS changes
- no handler changes
- no data attribute changes
- no backend changes
- no route changes

Recommended target areas:
- manual execution control labels
- builder action labels
- workflow handoff label/help text
- Auto Mode gate labels/help text
- queue action labels where provenance is ambiguous

Recommended intent:
- make backend mutation vs local/context action explicit
- make automation gate approval distinct from publishing approval
- preserve existing Publish and Fail confirmations exactly unless separately requested

Most likely safest candidate wording direction:
- `Approve` → clarify as ready-state / publish-ready action
- `Schedule` → clarify as publishing schedule action
- `Load Workflow Output` → clarify load-into-draft behavior
- `Approve and Continue` → clarify Auto Mode gate scope
- `Pause` / `Retry` → clarify queue-state effect

Recommended implementation size:
- tiny copy-only patch in `public/control-center/pages/publishing.js`
- no structural extraction required
- no API or backend work required

Not recommended for STEP 29B:
- layout rewrite
- panel extraction refactor
- Auto Mode behavior changes
- governance logic changes
- new confirmations beyond current publish/fail gates

---

## Validation Results

Commands required by task:

- `git status --short`
- `node --check public/control-center/pages/publishing.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`
- `node --check runtime/orchestrator-service/lib/ops/backbone.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Expected validation goal for this audit step:
- confirm clean documentation-only change scope
- confirm inspected JS files remain syntactically valid

Result summary for this audit step should show:
- only the new audit document added
- no production code modifications

---

## Explicit No-Code-Change Statement

This step is audit-only and documentation-only.

No production code was modified.

No changes to:
- frontend JS behavior
- CSS
- backend
- API behavior
- handlers
- routes
- IDs/classes/data attributes
- data/projects files

This document records current truth only and recommends a smallest-safe copy-only STEP 29B candidate.