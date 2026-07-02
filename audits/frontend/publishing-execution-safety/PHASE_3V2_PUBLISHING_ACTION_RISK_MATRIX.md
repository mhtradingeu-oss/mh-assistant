# PHASE 3V.2 — Publishing Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Publishing contains both safe UI/local actions and backend-mutating actions.

It is not safe to treat Publishing as a simple readiness display surface.

Publishing must be finalized only after the UI clearly distinguishes:
- navigation/review-only actions
- local draft actions
- backend scheduling/status mutations
- manual publish completion recording

No evidence currently proves live external social publishing from the frontend page alone.

## Action Matrix

| Action / Button | Handler Evidence | Mutation Type | Backend/API? | Approval Gate? | Provider Gate? | Confirmation? | Risk | Notes |
|---|---|---:|---:|---:|---:|---:|---|---|
| Prepare Publishing Package | Header scrolls to builder panel | UI navigation only | No | No | No | No | Low | Scroll/navigation action only. |
| Open Queue | Header scrolls to queue panel | UI navigation only | No | No | No | No | Low | Scroll/navigation action only. |
| Review Approval Gate | Header scrolls to handoff/approval panel | UI navigation only | No | No | No | No | Low | Scroll/navigation action only. |
| Open AI Review | Header scrolls to AI review area | UI navigation only | No | No | No | No | Low | Does not itself send to AI. |
| New Draft | `newBtn.onclick` resets/creates form state | Session state | No | No | No | No | Low | Local UI state only. |
| Save Draft / Prepare Draft | `saveLocalDraft`, `persistDraft` | localStorage draft | No | No | No | No | Low | Saves draft locally using local draft storage. |
| Queue for Manual Publishing / Schedule | `scheduleBtn.onclick`, `savePublishingSchedule`, `reschedulePublishingItem` | Backend publishing job mutation | Yes | Requires form validation; approval may be selected but schedule is not proven hard-gated by Governance | Provider readiness not proven hard-gated | Yes for backend actions | High | Creates or updates scheduled publishing job. Must be clearly labeled manual queue, not live publish. |
| Queue row: Review Package | `data-publishing-action="review"` | Session selection / review | No direct backend mutation proven | No | No | No | Low | Review/select package behavior. |
| Queue row: Schedule | `data-publishing-action="schedule"` / reschedule path | Backend job mutation | Yes | Not fully proven | Not fully proven | Yes | High | Updates scheduled state. Needs clear wording. |
| Queue row: Prepare Publishing Package / Publish action | `data-publishing-action="publish"` / `publishPublishingItem` | Backend status/execution outcome mutation | Yes | Frontend validation requires approved status for publish intent; backend gate details require confirmation | Provider execution not proven | Yes | Critical | Backend route updates job to `published` and records `manual_publish_complete`. Must not imply external publish unless provider proof exists. |
| Queue row: Pause to draft | `data-publishing-action="pause"` / reschedule draft | Backend job mutation if existing job | Yes when job exists | No | No | Yes | Medium | Moves job back to draft status. |
| Queue row: Retry scheduled item | `data-publishing-action="retry"` / reschedule scheduled | Backend job mutation | Yes | Not fully proven | Not fully proven | Yes | High | Re-queues/reschedules item. |
| Approve Gate | `approveBtn.onclick`, `approvePublishingItem` | Backend job readiness mutation | Yes | Approval action itself; Governance enforcement not fully proven | No | Yes | High | Marks item ready/approved in publishing job context. Must not claim Governance approval unless connected to Governance proof. |
| Mark Failed | `failBtn.onclick`, `failPublishingItem` | Backend job status mutation | Yes | No | No | Likely yes/controlled handler | Medium | Marks publishing item failed. |
| Load Handoff | `loadHandoffBtn.onclick` | Session/form state from shared handoff | No direct backend mutation | No | No | No | Medium-low | Loads workflow/AI output into draft context. Must stay draft/review-only. |
| Push to AI Review | `pushAiBtn.onclick`, `setSharedAiDraft`, `setSharedHandoff` | Shared context / local handoff | No direct backend mutation | No | No | No | Medium-low | Sends draft context to AI Command. Should be labeled review-only. |
| Auto Prepare | `autoPrepareBtn.onclick` / auto mode plan | Auto-mode state / possible workflow handoff | Needs deeper review | Not proven | Not proven | Not proven | High | Auto mode is sensitive; must remain gated until deeper auto-mode audit. |
| Auto Stop | `autoStopBtn.onclick` | Auto-mode state | No backend mutation proven | No | No | No | Medium | Stops auto-mode flow; needs browser confirmation later. |
| Auto Approve | `autoApproveBtn.onclick`, `approveCurrentGate` | Approval/gate mutation possible | Needs deeper governance evidence | Yes-like action | Not proven | Not proven | Critical | High-risk because name implies approval. Must be audited against Governance authority. |
| Auto Skip | `autoSkipBtn.onclick` | Auto-mode/gate mutation possible | Needs deeper governance evidence | May bypass gate | Not proven | Not proven | Critical | High-risk because it may skip a gate. Needs deeper audit. |

## Key Findings

### 1. Publishing has real backend-mutating routes
Confirmed API/backend route evidence includes:
- `/publishing/schedule`
- `/publishing/:jobId/reschedule`
- `/publishing/:jobId/ready`
- `/publishing/:jobId/publish`
- `/publishing/:jobId/fail`

### 2. Publish route records published/manual completion
The backend publish route updates a job to `published` and records an execution outcome with `manual_publish_complete`.

This should be treated as a backend status/execution record, not automatically as proof of external social publishing.

### 3. Approval is not yet proven as Governance-enforced
Publishing contains approval/status concepts, but this audit does not yet prove that Governance is the hard authority for all approval actions.

### 4. Provider/channel readiness is not yet proven as hard-gated
Publishing displays channels and readiness, but this audit does not yet prove that unsupported providers cannot be marked scheduled/published in all paths.

### 5. Auto mode remains high risk
Auto prepare / auto approve / auto skip require separate evidence before any UI or behavior change.

## Required Decision
Proceed to:
`PHASE 3V.3 — Publishing Boundary Copy / Execution Labeling Plan`

Reason:
Before Browser QA or patching, Publishing language must clearly separate:
- draft preparation
- manual queueing
- backend job status
- manual publish completion record
- external provider publishing

No live external publishing should be claimed unless provider execution evidence proves it.
