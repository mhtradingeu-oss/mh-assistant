# PHASE 3P — Publishing Safety / Readiness Audit

## Executive Summary
The Publishing page is a high-authority frontend surface for scheduling, approval, publishing preparation, backend publishing mutation calls, failure marking, Auto Mode preparation, and AI Command handoff.

The page already contains important safety language, backend-authority boundaries, validation, and hard confirmation for the highest-risk publish/fail paths. However, verification found that not all high-risk actions are hard-confirmed in the current frontend implementation.

This audit is document-only. No production code was changed.

## Evidence Map
Files inspected:
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/publishing/publishing-payloads.js`
- `public/control-center/api.js`
- `public/control-center/shared-context.js`
- `public/control-center/automation-engine.js`

Verification commands inspected:
- `window.confirm` usage
- publish / schedule / approve / fail handlers
- Auto Mode safety rules
- asset blocker and validation references
- node syntax checks

## Route Responsibility
Publishing is responsible for:
- Displaying publishing queue state.
- Preparing local publishing drafts.
- Scheduling or rescheduling publishing items through backend APIs.
- Approving publishing items through backend APIs.
- Publishing items through backend APIs.
- Marking publishing items failed through backend APIs.
- Showing readiness, blockers, approval state, queue state, and handoff context.
- Sending review-only context to AI Command.

Publishing should not be responsible for:
- Bypassing backend authority.
- Executing final external publishing without backend approval.
- Treating local drafts as durable backend execution.
- Allowing Auto Mode to publish, approve final assets, or fail records without human control.

## Mutation Inventory
Observed mutation-capable functions:
- `savePublishingSchedule(projectName, payload)`
- `reschedulePublishingItem(projectName, jobId, payload)`
- `approvePublishingItem(projectName, jobId, payload)`
- `publishPublishingItem(projectName, jobId, payload)`
- `failPublishingItem(projectName, jobId, payload)`

Local-only actions:
- Save local draft.
- Local draft status update.
- Local draft approve/fail simulation.

Backend mutation actions:
- Schedule / reschedule.
- Approve.
- Publish.
- Fail.

Highest-risk / irreversible actions:
- Publish.
- Fail.
- Approve, because it moves an item toward publishable readiness.

## Confirmation / Gating Review
Verified hard confirmations:
- `publish` has `window.confirm`.
- `fail` has `window.confirm`.

Not verified as hard-confirmed:
- `approve` does not appear in the `window.confirm` scan.
- `schedule` / `reschedule` do not appear in the `window.confirm` scan.

Existing validation:
- Publish requires `approvalStatus === "approved"`.
- Schedule/publish/retry require a publish date.
- UI copy and tooltips mention confirmation/backend approval rules.

Safety gap:
- Approve and schedule are high-authority actions and should receive hard confirmation before closeout.
- The audit should not claim all high-risk actions are hard-confirmed until this is implemented and browser-QA verified.

## Auto Mode Safety Review
Auto Mode includes important safety rules:
- Publishing live execution patterns are blocked.
- Destructive actions are blocked.
- Final approvals require human decision.
- `prepare_publishing_draft` is allowed as a safe preparation step.
- Auto Mode uses approval/waiting-gate concepts.

Current read:
- Auto Mode appears intended to prepare publishing drafts and handoffs, not execute final publishing.
- No production code was changed.
- Browser QA must verify Auto Prepare, Approve automation step, and Skip automation step behavior.

## AI Handoff Review
Publishing can send context to AI Command.
The UI copy states that AI handoff is context/review-only and does not perform approval, publishing, or backend execution.

Browser QA must verify:
- AI handoff opens AI Command.
- Handoff context is clear.
- No publish/approve/fail mutation occurs during AI handoff.

## Local Drafts / Status Semantics
Local drafts are stored in browser localStorage.
Local draft actions can simulate status changes locally.

Risk:
- Local approve/fail/published-style wording can confuse users if not visually separated from backend execution results.

Current mitigation:
- Queue source labels and local draft handling exist.
- Further browser QA is required to confirm visual clarity.

## Asset / Readiness Blockers
Publishing displays asset blockers and readiness information.

Observed:
- `assetBlockers` affects recommendation and readiness display.
- Publish recommendation checks for no asset blockers before recommending ready publish.

Not fully proven by scan:
- A hard guard preventing schedule/publish mutation when blockers are present.
- A disabled publish button tied directly to asset blockers.

Safety gap:
- Asset blockers appear visible, but hard enforcement should be verified or added before closeout.

## Risk Matrix

| Priority | Risk | Evidence / Reason | Recommended Handling |
|---|---|---|---|
| P0 | Frontend directly bypasses backend publish authority | Not observed | Keep backend authority enforced |
| P1 | Approve lacks hard confirmation | `window.confirm` scan shows publish/fail only | Add hard confirm or document backend-only gate clearly |
| P1 | Schedule/reschedule lacks hard confirmation | `window.confirm` scan shows publish/fail only | Add hard confirm for scheduling mutations |
| P1 | Asset blockers may be display-only | Hard enforcement not proven from scan | Verify or add guard before publish/schedule |
| P2 | Local draft status confusion | Local draft can be approved/failed locally | Browser QA visual clarity required |
| P2 | Auto Mode approval/skip semantics need QA | Auto Mode has gates, but needs browser proof | Browser QA matrix |
| P3 | Visual density / UI polish | Existing page is rich and action-heavy | Defer until safety closeout |

## Browser QA Matrix
Required before Publishing closeout:

| Scenario | Required Result |
|---|---|
| Page opens | No console errors |
| No selected item | No unsafe action allowed |
| Local draft save | Clearly local-only |
| Schedule local draft | Date validation visible |
| Schedule backend job | Requires clear confirmation or approved safety decision |
| Approve local draft | Clearly local-only |
| Approve backend job | Requires hard confirmation or approved safety decision |
| Publish backend job cancel | Cancel prevents mutation |
| Publish backend job confirm | Backend mutation only after confirmation |
| Fail backend job cancel | Cancel prevents mutation |
| Fail backend job confirm | Backend mutation only after confirmation |
| Asset blockers present | Publish/schedule blocked or warning behavior proven |
| AI handoff | Review-only; no mutation |
| Auto prepare | No publish/approve/fail mutation |
| Auto approve/skip | Does not bypass final publish authority |

## Recommended Decision
**B) Needs safety patch before closeout.**  
**C) Needs Browser QA proof before closeout.**

## Recommended Next Step
Run a targeted safety patch plan for Publishing before closeout:
1. Add hard confirmation for backend approve.
2. Add hard confirmation for backend schedule/reschedule.
3. Verify or enforce asset blocker gating for schedule/publish.
4. Update copy only where needed to distinguish local draft vs backend mutation.
5. Run Browser QA matrix.
6. Commit only after QA.
7. Close Publishing phase.

## Protected Behavior List
Before any patch:
- Do not change backend APIs.
- Do not change data/projects.
- Do not introduce new publish execution paths.
- Do not allow Auto Mode to publish, approve final assets, or fail records.
- Do not weaken existing publish/fail confirmation.
- Do not alter AI Command handoff behavior except copy if necessary.

## Validation Results
Verification scan completed:
- `git status --short` showed the audit file as untracked only.
- `window.confirm` appears for publish and fail only.
- node syntax checks passed for inspected files.
- No production files were changed by this audit.
