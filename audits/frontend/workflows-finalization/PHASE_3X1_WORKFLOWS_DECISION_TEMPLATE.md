# PHASE 3X.1 — Workflows Finalization Decision

## Decision Status
Closed as audit-only.

## Recommended Decision
Option B — Workflows Execution / Automation Safety Audit is required before Browser QA or implementation.

No production patch is approved in PHASE 3X.1.

## Evidence Summary

Workflows is not a simple display page.

Confirmed evidence:
- `public/control-center/pages/workflows.js` is 2365 lines.
- Workflows contains active UI preparation surfaces.
- Workflows contains runtime execution helpers in file scope.
- Workflows imports automation-engine functions:
  - `startAutoMode`
  - `pauseAutoMode`
  - `resumeAutoMode`
  - `stopAutoMode`
  - `approveCurrentGate`
  - `skipCurrentStep`
  - `runAutomationPlan`
- Workflows references workflow backend/API execution:
  - `runProjectWorkflow`
  - `runProjectAiWorkflow`
- Workflows contains an external event bridge:
  - `mh:submit-workflow`
- Workflows can create or consume handoffs:
  - AI Command handoff
  - Task Center handoff
  - workflow handoff
- Workflows has route hints and destinations tied to:
  - Publishing
  - Campaign Studio
  - Media Studio
  - Task Center
  - AI Command
- Workflows contains copy indicating that existing runtime execution helpers are preserved in file scope and not activated by the active render surface.

This means Workflows must be audited as a high-risk operating surface before any UI patch or closeout.

## Confirmed Ownership

Workflows should own:
- workflow visibility.
- workflow package preparation.
- workflow input collection.
- local draft preparation.
- review-ready workflow outputs.
- AI review handoff.
- Task Center handoff preparation.
- safe route guidance.
- automation readiness display.
- workflow continuity projection.

## Confirmed Non-Ownership

Workflows must not silently own:
- external publishing execution.
- Governance approval authority.
- AI autonomous execution authority.
- provider authentication.
- CRM/customer mutation.
- destructive backend operations.
- silent automation execution.
- policy bypass.
- unconfirmed publishing or task execution.

## Execution / Automation Risks

### 1. Backend workflow run risk
Workflows contains `runProjectWorkflow` / `runProjectAiWorkflow` usage.

Required next audit:
Determine exactly which UI buttons or event paths call backend workflow run endpoints.

### 2. External event bridge risk
Workflows listens for `mh:submit-workflow`.

Required next audit:
Determine whether AI Command or another page can trigger workflow execution through this event and whether confirmation exists.

### 3. Automation mode risk
Workflows imports and uses auto-mode functions.

Required next audit:
Determine whether automation steps only simulate/navigation/handoff or whether they mutate backend state.

### 4. Auto approve / auto skip risk
Workflows contains auto approve and auto skip controls.

Required next audit:
Determine whether these affect real approval gates, workflow gates, or only local automation engine state.

### 5. Task Center handoff risk
Workflows prepares task handoffs.

Required next audit:
Determine whether this only creates shared handoff context or creates durable tasks.

### 6. Publishing/Governance boundary risk
Workflows includes publishing package workflow and publishing route hints.

Required next audit:
Determine whether Workflows can route or prepare publishing packages without Governance gate clarity.

## Governance / Publishing Boundary Risks

Governance closeout confirmed:
- Governance can hard-gate Publishing through backend policy.
- Approval-before-publish and freeze-publishing may block publishing mutations.
- AI cannot approve or change policy.

Workflows must prove:
- it cannot bypass Governance by routing directly to Publishing execution.
- it labels publishing outputs as package/handoff/review unless evidence proves execution.
- AI-suggested workflow actions remain human-reviewed.
- automation does not silently approve, skip, publish, or mutate policies.

## Browser QA Requirements

Browser QA should not be started until execution safety audit clarifies:
- Which Workflows controls are UI-only.
- Which controls write local draft state.
- Which controls create handoffs.
- Which controls call backend workflow run APIs.
- Which controls use automation-engine.
- Whether active render surface uses the older runtime execution helpers.
- Whether auto approve / auto skip are active and what they mutate.

## Recommended Next Phase

`PHASE 3X.2 — Workflows Execution / Automation Safety Audit`

Scope:
- Audit active render surface versus preserved runtime helpers.
- Audit all workflow button handlers.
- Audit `mh:submit-workflow` bridge.
- Audit backend workflow API calls.
- Audit automation engine calls.
- Audit AI handoff behavior.
- Audit Task Center handoff behavior.
- Audit Publishing/Governance boundary.
- Produce Workflows action-risk matrix.

## Production Safety Rules

Until PHASE 3X.2 is complete:
- Do not patch Workflows UI.
- Do not change Workflows CSS.
- Do not change Workflows handlers.
- Do not change automation engine behavior.
- Do not change backend routes.
- Do not test mutating workflow actions on real project data.
- Do not claim Workflows execution is safe.
- Do not claim Workflows respects Governance gates unless evidence proves it.
