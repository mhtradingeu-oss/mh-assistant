# STEP 14 - Confirmation Taxonomy Audit

Date: 2026-05-13
Scope: Audit-only, documentation-only (no production code changes)
Branch context: architecture/frontend-consolidation-v1

## 1) Executive Summary

This step defines a canonical confirmation taxonomy for authority-adjacent actions before any additional label changes are made on backend-controlled, approval, workflow, publishing, destructive, or durable mutation surfaces.

Primary findings:
- High-impact actions are distributed across Publishing, Workflows, Governance, Settings, Library, Integrations, and Studio pages, but confirmation behavior is inconsistent.
- Destructive actions (Library archive/delete) already use explicit confirm prompts; many backend mutations (publishing/governance/integrations/workflows) rely on inline success/failure messaging without a standardized confirmation model.
- Deferred mutation controls in Operations Centers are correctly blocked, but their future labels require a predefined dangerous-action confirmation standard before activation.
- API wrappers expose concentrated authority endpoints; frontend labels should not be patched further in these families until backend provenance/audit visibility expectations are explicit.

Decision:
- Freeze high-risk wording changes until this taxonomy is adopted.
- Next patch should be small, copy-only, and confined to low-risk confirmation hints on already-safe surfaces.

## 2) Confirmation Taxonomy

### A) No confirmation needed
Use for:
- Pure route navigation
- Open AI / prompt prefill only
- Local, non-destructive view changes

UX requirement:
- Destination clarity only.

### B) Soft confirmation / inline notice
Use for:
- Prepare draft/package actions with no destructive effect
- Local save and local state transitions
- Prompt-prep actions that do not execute backend mutation

UX requirement:
- Non-modal inline note explaining local-only or draft-only scope.

### C) Standard confirmation
Use for:
- Non-destructive backend actions with operational side effects
- Sync/test/reconnect style actions
- Workflow execution starts when non-destructive but durable

UX requirement:
- Explicit pre-action summary and post-action outcome message.

### D) Strong confirmation
Use for:
- High-impact backend execution with external effect potential
- Publish-now, rerun, retry, and fail-state mutation actions

UX requirement:
- Clear effect statement, scope, and immediate consequence summary.

### E) Governance approval required
Use for:
- Approval decisions and approval-gated execution families
- Actions blocked by policy unless approved

UX requirement:
- Copy must state approval path and status dependency.

### F) Backend provenance required
Use for:
- Any action that requests durable backend mutation
- Policy, governance, publishing, workflow, integration, task/handoff mutations

UX requirement:
- Visible provenance hint such as policy-controlled or backend-enforced.

### G) Dangerous action confirmation
Use for:
- Archive/delete/destructive actions
- Irreversible or semi-irreversible registry/state removals

UX requirement:
- Explicit danger copy, consequence statement, and confirmation gate.

### H) Do not patch yet
Use for:
- Labels tied to backend-controlled mutation where provenance/audit visibility is incomplete
- Deferred mutation controls not yet active
- Mixed local/backend flows that need separation before wording updates

## 3) Action Family Classification

| Action family | Canonical confirmation level | Notes |
| --- | --- | --- |
| Pure navigation | No confirmation needed | Route-only destination copy. |
| Open AI / prompt-prefill | No confirmation needed or Soft confirmation | Inline note when prefill occurs. |
| Prepare draft/package | Soft confirmation | Must say draft/package only. |
| Create task/handoff | Standard confirmation + Backend provenance required | Durable artifact creation. |
| Run backend action | Standard or Strong confirmation + Backend provenance required | Depends on impact. |
| Approval decision | Governance approval required + Backend provenance required | Decision path must be explicit. |
| Policy mutation | Strong confirmation + Backend provenance required | Governance/settings durability. |
| Publishing mutation | Strong confirmation + Governance approval required + Backend provenance required | External effect potential. |
| Workflow execution | Standard or Strong confirmation + Backend provenance required | Durable run state and downstream effects. |
| Integration sync/reconnect | Standard confirmation + Backend provenance required | Mutates connector/system state. |
| Asset destructive action | Dangerous action confirmation + Backend provenance required | Archive/delete semantics. |
| Media generation / output creation | Standard confirmation + Backend provenance required (when backend-backed) | Mixed local/provider execution paths. |
| Deferred operations mutation | Do not patch yet | Keep disabled until mutation safety pass and confirmation model adoption. |

## 4) Per-Page Classification Table

| Page | Dominant action families | Required confirmation levels | Current state | Patch posture |
| --- | --- | --- | --- | --- |
| Publishing | Prepare draft/package, publishing mutation, Open AI | Soft + Strong + Governance approval + Backend provenance | Local-only and backend flows are mixed; strong mutations have no unified confirmation copy standard | Do not patch high-risk labels yet |
| Workflows | Workflow execution, auto mode gate controls, Open AI handoff | Standard/Strong + Governance approval (for gated steps) + Backend provenance | Execution is durable; gate controls exist but wording/confirmation model not standardized | Do not patch run/auto labels yet |
| Governance | Approval decision, policy mutation, Open AI | Governance approval + Strong + Backend provenance | Durable approval and policy mutation controls are active | Do not patch decision/policy labels yet |
| Settings | Policy mutation, team model durable save | Strong + Backend provenance | Save-all performs durable governance/team updates | Do not patch mutation labels yet |
| Library | Asset destructive action, local/metadata save, upload | Dangerous action + Backend provenance + Soft for local save | Archive/delete already use confirm prompts; remaining copy still mixed | Do not patch dangerous labels yet |
| Integrations | Run backend action, connect/reconnect/sync/test/import/disconnect | Standard + Backend provenance | Backend integration actions active with inline outcome messaging | Do not patch action verbs yet |
| Operations Centers | Pure navigation/Open AI + deferred operations mutation + mark-read mutation | No confirmation for nav/Open AI; deferred = Do not patch; mark-read = Standard + provenance | Mutation controls intentionally disabled except mark-read | Keep deferred labels unchanged |
| Media Studio | Prepare draft/package, create task/handoff, media generation, Open AI, send-to-publishing | Soft + Standard + Backend provenance; send-to-publishing may require Strong when backend handoff durable | Mixed local/backend execution paths | Do not patch backend/mutation labels yet |
| Content Studio | Prepare draft, approval decision (local/durable), create handoff, Open AI, AI command execution | Soft + Standard/Strong + Backend provenance | Mixed local and durable flows; approval/reject semantics need taxonomy alignment | Do not patch approval/handoff labels yet |
| Campaign Studio | Prepare draft/package, create handoff, navigation/Open AI | Soft + Standard + Backend provenance for durable handoff/save | Route handoffs are durable-capable; some labels are still mixed intent | Limit to low-risk copy only in future |
| AI Command | Open AI/prefill, durable AI command execution, route suggestion navigation | No confirmation for prefill; Standard/Strong + Backend provenance for durable execute | Send from workspace currently prepares command; durable execute is separate path | Do not patch execute-adjacent labels yet |

## 5) Recommended Wording Pattern by Confirmation Level

- No confirmation needed:
  - Navigate: Open <Workspace>
  - Open AI: Review in AI Workspace

- Soft confirmation / inline notice:
  - This will prepare a draft only.
  - This saves locally and does not publish.
  - This loads context only.

- Standard confirmation:
  - This requests a backend action.
  - This will run a connector sync and update project signals.
  - This starts a workflow run and records durable execution state.

- Strong confirmation:
  - This will run a high-impact backend action.
  - This may trigger downstream execution and queue changes.

- Governance approval required:
  - This requires governance approval before execution.
  - Approval state controls whether this action can proceed.

- Backend provenance required:
  - This action is policy-controlled and may be blocked by backend governance.
  - Backend authority enforces this request.

- Dangerous action confirmation:
  - This will archive an asset. You can review it in Library history.
  - This will soft-delete the asset from active views.

- Do not patch yet:
  - Label change deferred until backend audit/provenance requirements are verified.

## 6) Labels Safe for Next Wording-Only Patch

Safe candidates (route-only or Open AI/prefill-only in inspected scope):
- governance.js: Open AI Workspace button text in Governance AI assistant panel
- publishing.js: Publishing AI assistant open button text
- operations-centers.js: Open AI Workspace labels (Task/Queue/Job/Notification panels)
- operations-centers.js: Open Source Page route action label

Condition:
- Copy-only changes only; no handler, route, or behavior changes.

## 7) Labels Requiring Backend Audit/Provenance Before Any Patch

- publishing.js:
  - Approve
  - Mark Failed
  - Publish queue action
  - Schedule/reschedule related actions
  - Auto Prepare / Auto Mode gate controls

- workflows.js:
  - Run Workflow
  - Run Full Automation
  - Run Step-by-Step
  - Start Auto Mode From Plan
  - Approve and Continue

- governance.js:
  - Approve
  - Reject
  - Escalate
  - Override
  - Save Governance Policy
  - Sync Settings Rules

- settings.js:
  - Save Settings

- integrations.js:
  - Sync
  - Reconnect
  - Fix connection
  - Connect/Disconnect/Test/Import action family

- media-studio-workspace.js:
  - Start Media Job
  - Generate Output
  - Send to Publishing if ready
  - Create Task

- content-studio-workspace.js:
  - Approve
  - Reject
  - Send to Publishing
  - Save to Library

- campaign-studio.js:
  - Build Campaign
  - Send to <destination> family where durable handoff may be created

- ai-command.js:
  - Durable command execution path labels around run/execute semantics

## 8) Labels That Must Remain Unchanged For Now

- All deferred mutation controls in operations-centers.js (Delete/Retry/Approve item/Publish item/Remove/Cancel/Rerun/Delete notification family)
- Library destructive labels tied to archive/delete behavior
- Publishing, Workflows, Governance, Settings, Integrations mutation verbs listed above

Reason:
- These labels are attached to high-impact backend-controlled or dangerous behaviors and must follow the confirmation taxonomy plus provenance model before wording edits.

## 9) Recommended STEP 15 Scope

Recommended exact tiny patch:
- Confirmation copy only for low-risk, already-safe surfaces in high-risk pages:
  - Convert remaining Open AI route-only labels to canonical Open AI wording in governance.js, publishing.js (AI panel open), and operations-centers.js AI open buttons.
  - Add short inline hint text where missing: prompt/context only, no execution.

Mode recommendation:
- Wording-only and confirmation-copy-only.
- No backend provenance badges yet.

Why:
- This keeps scope minimal while advancing consistency.
- Backend provenance badges should be a dedicated step after confirming backend audit/logging evidence surfaces.

## 10) Validation Commands and Results

Commands required by step:
- git status --short
- node --check public/control-center/pages/publishing.js
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/pages/governance.js
- node --check public/control-center/pages/settings.js
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/operations-centers.js
- node --check public/control-center/pages/media-studio-workspace.js
- node --check public/control-center/pages/content-studio-workspace.js
- node --check public/control-center/pages/campaign-studio.js
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/api.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js

Result summary:
- git status --short: ?? audits/frontend/safety/STEP_14_CONFIRMATION_TAXONOMY_AUDIT.md
- node --check public/control-center/pages/publishing.js: pass (exit 0)
- node --check public/control-center/pages/workflows.js: pass (exit 0)
- node --check public/control-center/pages/governance.js: pass (exit 0)
- node --check public/control-center/pages/settings.js: pass (exit 0)
- node --check public/control-center/pages/library.js: pass (exit 0)
- node --check public/control-center/pages/integrations.js: pass (exit 0)
- node --check public/control-center/pages/operations-centers.js: pass (exit 0)
- node --check public/control-center/pages/media-studio-workspace.js: pass (exit 0)
- node --check public/control-center/pages/content-studio-workspace.js: pass (exit 0)
- node --check public/control-center/pages/campaign-studio.js: pass (exit 0)
- node --check public/control-center/pages/ai-command.js: pass (exit 0)
- node --check public/control-center/api.js: pass (exit 0)
- node --check public/control-center/app.js: pass (exit 0)
- node --check public/control-center/router.js: pass (exit 0)
- No syntax errors were introduced by this step (documentation-only).

## 11) Explicit No-Code-Change Statement

Step 14 is audit-only and documentation-only.

No production code was modified.
No frontend JS behavior was modified.
No CSS was modified.
No backend was modified.
No data/projects files were modified.
No route behavior was modified.