# M2-F — Protected Backend Route Table Decision

## 0. Decision Status

Status: ROUTE TABLE DECISION RECORDED
Phase: M2 — Governance + Execution Authority Closeout
Mode: Documentation decision
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider execution changes: none
Publishing behavior changes: none
Ads execution changes: none
CRM mutation changes: none
Customer reply/send changes: none

## 1. Purpose

M2-F records the protected backend route table decision after the M2-E truth scan.

M2-E was created because M2-D concluded that backend route proof was required before M2 could be closed.

This document does not approve a runtime patch.

This document classifies the backend route risk areas observed in M2-E and defines the next safe action.

## 2. Prior M2 Decisions

M2-B recorded the governance and execution authority decision.

M2-D classified backend governance enforcement surfaces and explicitly stated:

- M2 cannot be closed until backend route proof is documented.
- No runtime patch is approved.
- No backend patch is approved.
- No authority level is changed.
- No forbidden action is relaxed.

M2-F continues that rule.

## 3. M2-E Truth Scan Result

M2-E was read-only.

Final repository state:

- clean
- synced with origin
- no runtime changes
- no UI changes
- no backend changes

Validation remained clean:

- AI Team Operating Contract validation: PASS
- Contract conformance check: PASS
- Failures: 0
- Warnings: 10
- Handoff drift pairs: 0
- Verdict: READY FOR NARROW AI COMMAND ALIAS INTEGRATION CANDIDATE

Core syntax validation passed for:

- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/media/library-engine.js`
- `runtime/orchestrator-service/lib/security/governance-mutation-gate.js`
- `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js`
- `public/control-center/app.js`
- `public/control-center/router.js`
- `public/control-center/api.js`
- `public/control-center/automation-engine.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/ads-manager.js`

## 4. Key M2-E Finding

M2-E found:

`high-risk mutating routes without obvious guard signals: 68`

This finding does not mean all 68 routes are unsafe.

It means the route-window scanner did not observe clear local guard keywords such as:

- `governance`
- `approval`
- `guard`
- `security`
- `policy`
- `permission`
- `manual`
- `owner`
- `risk`

inside the route windows.

Therefore, the correct interpretation is:

- scan passed
- backend route proof remains incomplete
- patch is not yet approved
- route categories require human technical classification

## 5. Route Decision Categories

M2-F uses these route decision categories.

### 5.1 read-only-safe

Routes that only read state or return previews.

Patch approved: No.

Reason: no high-risk mutation proven.

### 5.2 local-state-mutation-needs-review

Routes that mutate local project files, local indexes, local queues, local drafts, local feedback records, or local job status.

Patch approved: No.

Reason: may be acceptable, but still requires documented guard expectation.

### 5.3 provider-execution-needs-review

Routes that call a provider layer or may create AI-generated output through a provider.

Patch approved: Not yet.

Reason: provider calls may be safe if they return review outputs only, but they still represent execution through a provider layer.

### 5.4 protected-lifecycle-needs-proof

Routes that affect publishing lifecycle, approval lifecycle, workflow execution, job execution, integration sync, governance decision, or destructive state.

Patch approved: Not yet.

Reason: these must have route-level backend proof before M2 closeout.

### 5.5 likely-safe-output-review

Routes whose output status is clearly `needs_review`, `prompt_ready`, or draft/review-only.

Patch approved: No.

Reason: these appear aligned with governance-first behavior, but may still need provider boundary documentation.

### 5.6 needs-narrow-patch-candidate

Use only when a specific route is proven to mutate protected state without a backend guard or safe state restriction.

Patch approved: Not by M2-F.

Reason: a later M2-G patch decision is required.

## 6. Observed Route Group: Scheduler / Job Execution

Observed route:

- `POST /run_scheduler_worker_once`
- line window observed in M2-E: `23080-23180`

Observed behavior:

- requires project context
- reads scheduler jobs
- locks due jobs
- updates job status to `running`
- executes locked jobs through `executeJobBridge(job)`
- marks jobs completed or failed
- writes scheduler audit logs
- updates intelligence loop after job completion

Risk category:

`protected-lifecycle-needs-proof`

Decision:

No patch approved in M2-F.

Why this matters:

This route is not just a read route. It executes due jobs and changes job lifecycle state.

The presence of scheduler audit logs is positive, but M2-E did not prove that the route is restricted to safe internal/manual execution or blocked from external/AI Command invocation.

Required next proof:

- identify who can call `/run_scheduler_worker_once`
- determine whether it is exposed to the frontend
- determine whether it requires internal-only context or secret
- inspect `executeJobBridge(job)` allowed job types
- verify that job execution cannot publish, send, launch ads, mutate CRM, sync provider, delete records, or bypass governance
- verify that scheduler audit logs are always written for execution state changes

Patch decision:

`needs-narrow-review`

Possible future result:

- no patch if route is internal-only and job bridge blocks protected actions
- narrow patch if route is externally callable without a guard or job bridge can execute protected actions

## 7. Observed Route Group: Execution Feedback

Observed route:

- `POST /record_execution_feedback`
- line window observed in M2-E: `23210-23280`

Observed behavior:

- requires project context
- validates `job_id`
- validates `channel`
- validates required metrics:
  - `impressions`
  - `clicks`
  - `engagement`
  - `conversions`
  - `revenue`
- appends performance record
- updates intelligence loop
- returns analytics path

Risk category:

`local-state-mutation-needs-review`

Decision:

No patch approved in M2-F.

Why this matters:

This route records analytics feedback and updates learning/intelligence state. It does not directly publish or execute provider actions, but it mutates project analytics state.

Required next proof:

- verify whether route accepts only trusted metrics sources
- verify input size/type validation for metrics values
- verify audit trail for performance feedback
- verify that feedback cannot overwrite historic data
- verify that feedback cannot trigger external execution

Patch decision:

`needs-narrow-review`

Possible future result:

- no patch if append-only and analytics-only
- narrow patch if untrusted feedback can poison optimization loops without guard/audit

## 8. Observed Route Group: Media Provider / AI Generation

Observed routes:

- `POST /api/media/improve-prompt`
- `POST /api/media/brand-check`
- `POST /api/media/generate-image`
- `POST /api/media/generate-video-brief`
- `POST /api/media/generate-voice-script`
- `POST /api/media/generate-campaign-pack`

Observed line windows:

- improve prompt: `23329-23357`
- brand check: `23359-23387`
- generate image: `23389-23417`
- generate video brief: `23419-23447`
- generate voice script: `23449-23477`
- generate campaign pack: `23479-23507`

Observed behavior:

- calls `mediaProviderLayer`
- handles `provider_not_configured` safely
- persists generated result through `maybePersistMediaGenerationResult`
- returns statuses such as:
  - `prompt_ready`
  - `needs_review`

Risk category:

`provider-execution-needs-review`

Secondary category:

`likely-safe-output-review`

Decision:

No patch approved in M2-F.

Why this matters:

These routes do run provider-layer logic, but the outputs appear review-oriented rather than external publishing or provider mutation.

Positive signals:

- output statuses are review-oriented
- no external publish is proven
- no direct ads/customer/CRM mutation is shown
- provider_not_configured returns safe response

Required next proof:

- inspect `mediaProviderLayer` to confirm actual providers and side effects
- confirm all outputs remain local review artifacts
- confirm no direct external publish/upload/send action happens inside provider layer
- confirm `maybePersistMediaGenerationResult` only saves review records
- verify whether these routes need explicit `manual_execution_only` or `owner_workspace_required` guards later

Patch decision:

`needs-provider-boundary-review`

Possible future result:

- no patch if provider generation is intentionally allowed as review-only output
- narrow patch if provider execution should be blocked without explicit user approval

## 9. Observed Route Group: Library Index

Observed route:

- `POST /media-manager/project/:project/library/index`
- line window observed in M2-E: `23633-23656`

Observed behavior:

- loads project from params
- calls `buildLibraryIndex`
- returns result

Risk category:

`local-state-mutation-needs-review`

Decision:

No patch approved in M2-F.

Why this matters:

Library index rebuild is a local project state operation. It is likely lower risk than publish/send/ads/provider mutation, but it is still a mutating POST action.

Required next proof:

- inspect whether `buildLibraryIndex` writes files
- verify it cannot delete assets or overwrite source assets
- verify project path normalization
- verify audit/logging expectation
- classify as safe local maintenance or guarded mutation

Patch decision:

`needs-narrow-review`

Possible future result:

- no patch if index rebuild is deterministic and safe
- narrow patch if it can overwrite/delete critical project records without guard

## 10. Protected Route Areas Still Requiring Exact Table Proof

M2-E examples were not enough to close all protected areas.

The following areas still require exact route table documentation from `server.js`:

### 10.1 Publishing lifecycle

Required routes to table:

- schedule publishing
- reschedule publishing
- ready/approval-related publishing state
- publish/manual completion recording
- retry
- failed status

Decision:

`protected-lifecycle-needs-proof`

Patch approved now:

No.

### 10.2 Approval and governance decision lifecycle

Required routes to table:

- create approval
- approval decision
- governance summary
- governance policy update
- governance timeline/audit

Decision:

`protected-lifecycle-needs-proof`

Patch approved now:

No.

### 10.3 Integration/provider state

Required routes to table:

- sync integration
- test integration
- reconnect integration
- disconnect integration
- import integration history
- credential-sensitive operations

Decision:

`protected-lifecycle-needs-proof`

Patch approved now:

No.

### 10.4 Workflow / backend job execution

Required routes to table:

- run workflow
- job queue actions
- scheduler worker execution
- job retry/fail/complete transitions
- automation-driven backend execution

Decision:

`protected-lifecycle-needs-proof`

Patch approved now:

No.

### 10.5 Customer / CRM / ticket / send

Required routes to table:

- customer inbox reads
- conversation reads
- message reads
- ticket reads
- any send/reply action
- any ticket status mutation
- any customer/CRM mutation
- any assignment operation

Decision:

- read-only routes may become `read-only-safe`
- send/mutation routes remain `protected-lifecycle-needs-proof` until proven absent or guarded

Patch approved now:

No.

### 10.6 Ads / budget / spend

Required routes to table:

- ads plan reads
- campaign planning routes
- budget suggestions
- any live ads launch
- any live provider campaign mutation
- any spend/budget update

Decision:

- if no live route exists, classify as `safe-no-execution-surface`
- if route exists, classify as `protected-lifecycle-needs-proof`

Patch approved now:

No.

### 10.7 Destructive operations

Required routes to table:

- DELETE routes
- destructive POST/PATCH routes
- disconnect routes
- remove/destroy/overwrite operations
- asset deletion
- record deletion

Decision:

`protected-lifecycle-needs-proof`

Patch approved now:

No.

## 11. Route Table Decision Summary

| Route / Area | Observed Evidence | Decision Category | Patch Approved Now | Next Required Action |
|---|---|---|---:|---|
| `POST /run_scheduler_worker_once` | executes due scheduler jobs and updates job states | protected-lifecycle-needs-proof | No | inspect caller access and `executeJobBridge` |
| `POST /record_execution_feedback` | appends metrics and updates intelligence loop | local-state-mutation-needs-review | No | verify append-only, input validation, and no external execution |
| `POST /api/media/improve-prompt` | provider-layer prompt improvement, status prompt_ready | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /api/media/brand-check` | provider-layer brand check, status needs_review | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /api/media/generate-image` | provider-layer image generation, status needs_review | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /api/media/generate-video-brief` | provider-layer video brief, status needs_review | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /api/media/generate-voice-script` | provider-layer voice script, status needs_review | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /api/media/generate-campaign-pack` | provider-layer campaign pack, status needs_review | provider-execution-needs-review + likely-safe-output-review | No | inspect provider side effects |
| `POST /media-manager/project/:project/library/index` | rebuilds library index | local-state-mutation-needs-review | No | inspect file writes and project path safety |
| Publishing lifecycle routes | route surface expected from API client | protected-lifecycle-needs-proof | No | exact server route table required |
| Approval/governance decision routes | route surface expected from API client | protected-lifecycle-needs-proof | No | exact server route table required |
| Integration sync/disconnect/test routes | route surface expected from API client | protected-lifecycle-needs-proof | No | exact server route table required |
| Workflow/job/queue routes | route surface expected from API client | protected-lifecycle-needs-proof | No | exact server route table required |
| Customer/CRM/ticket/send routes | read surfaces seen, mutation proof incomplete | mixed: read-only-safe or protected-lifecycle-needs-proof | No | exact server route table required |
| Ads/budget/spend routes | no live route proven yet | safe-no-execution-surface unless route is found | No | exact server route table required |
| Delete/destructive routes | incomplete proof | protected-lifecycle-needs-proof | No | exact destructive route table required |

## 12. M2-F Decision

M2-F decision:

No runtime patch is approved yet.

No backend patch is approved yet.

No UI patch is approved yet.

M2 remains open.

The scan result is significant enough that M2 cannot close with documentation only.

The next action must be a narrow route-focused proof step, not a broad patch.

## 13. Recommended Next Step

Next approved step:

M2-G — Protected Backend Route Table Builder

Purpose:

Create a machine-generated route table artifact from `runtime/orchestrator-service/server.js`.

The artifact should include:

- method
- path
- line start
- line end
- route category
- mutating/read-only status
- guard signal count
- visible guard terms
- preliminary classification
- high-risk flag
- next action

This should be an audit artifact only.

No runtime behavior should change.

## 14. M2-G Output Target

Recommended artifact path:

`audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.json`

Optional markdown summary path:

`audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.md`

## 15. Safety Rules

Do not patch blindly.

Do not change scheduler behavior yet.

Do not change publishing behavior yet.

Do not change approval behavior yet.

Do not change integrations behavior yet.

Do not change workflow execution behavior yet.

Do not change media provider behavior yet.

Do not add provider execution.

Do not add ads launch or budget mutation.

Do not add send/customer reply behavior.

Do not relax AI Command restrictions.

Do not weaken forbidden actions.

Do not close M2 until the protected backend route table artifact exists.

