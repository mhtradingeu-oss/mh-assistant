# Publishing Behavior Contract

## Scope
- Repository: mh-assistant
- Branch baseline: architecture/frontend-consolidation-v1 @ 736b0e9
- Mode: audit and contract only
- No production code changes in this phase

## Doctrine Locks
- Backend owns operational authority.
- Frontend projects operational authority.
- Publishing must not execute hidden runtime mutations from render.
- Auto Mode starts only from explicit user action.
- Shadow-compare must complete before extraction.

## Runtime Anchors
- Frontend route/action binding: public/control-center/pages/publishing.js
- Frontend API calls: public/control-center/api.js
- Auto safety/gating: public/control-center/automation-engine.js
- Shared handoff/AI draft cache: public/control-center/shared-context.js
- Backend publishing mutation routes: runtime/orchestrator-service/server.js
- Durable queue/approval/handoff records: runtime/orchestrator-service/lib/ops/backbone.js

## Action Contract

### 1) save draft
- Inputs: session.form fields (project, campaign, channel, contentItem, optional date/time, approvalStatus, notes).
- Preconditions: validateBuilder(session, draft) passes required project/campaign/channel/contentItem.
- Local state changes: saveLocalDraft with buildLocalDraftPayload(status=draft), selectedId/formSourceId update, draftMessage set.
- Backend calls: optional savePublishingSchedule(project, buildSchedulePayload(status=draft)).
- Durable outputs: backend scheduled job only if API succeeds; otherwise local draft only.
- User-visible output: showMessage("Publishing draft saved locally.") and on API success showMessage("Publishing draft saved.").
- Error behavior: draft save API failures are swallowed in persistDraft via showError noop; local draft remains.
- Reload behavior: runAndRefresh path calls reloadProjectData(project) on API success.
- Toast/message behavior: success message always local; optional additional success on durable save.
- Risk level: medium (dual local vs durable path can be misread).

### 2) schedule
- Inputs: current selected item (or none for new), buildSchedulePayload(status=scheduled).
- Preconditions: validateBuilder(session, schedule) with publishDate required.
- Local state changes: localOnly path updates local draft status=scheduled and draftMessage.
- Backend calls: reschedulePublishingItem(project, jobId, payload) when current durable job exists; else savePublishingSchedule(project, payload).
- Durable outputs: scheduled job record updated/created server-side.
- User-visible output: message "Publishing item scheduled." or "Publishing schedule saved."; localOnly message for browser-only schedule.
- Error behavior: showError(error.message || fallback); if create path returns no job_id, fallback local draft save occurs.
- Reload behavior: yes for durable path via runAndRefresh.
- Toast/message behavior: success toast on durable path, local toast on localOnly path.
- Risk level: high (authoritative schedule mutation).

### 3) reschedule
- Inputs: durable jobId, buildSchedulePayload(session, scheduled or draft).
- Preconditions: selected durable item required.
- Local state changes: session selection/form sync only.
- Backend calls: reschedulePublishingItem(project, jobId, payload).
- Durable outputs: scheduled job JSON updated by updateScheduledJobRecord.
- User-visible output: "Publishing item retried in the scheduled queue." or pause variant.
- Error behavior: showError on failure.
- Reload behavior: yes via runAndRefresh.
- Toast/message behavior: success/error through runAndRefresh.
- Risk level: high (durable queue timing/status mutation).

### 4) pause
- Inputs: selected queue item; pause maps to buildSchedulePayload(status=draft).
- Preconditions: validateBuilder with draft intent path; durable item for backend path.
- Local state changes: localOnly branch sets status=draft in local storage.
- Backend calls: reschedulePublishingItem(project, jobId, payload status=draft).
- Durable outputs: backend scheduled job moved to draft-like state.
- User-visible output: "Publishing item paused as a draft." or local draft paused message.
- Error behavior: showError if backend call fails.
- Reload behavior: yes on durable path.
- Toast/message behavior: success/error through runAndRefresh; local success on localOnly path.
- Risk level: medium-high.

### 5) retry
- Inputs: selected queue item; payload status=scheduled.
- Preconditions: validateBuilder(session, retry) requires publishDate.
- Local state changes: localOnly branch sets local draft scheduled.
- Backend calls: reschedulePublishingItem(project, jobId, payload).
- Durable outputs: durable schedule status/timing update.
- User-visible output: "Publishing item retried in the scheduled queue.".
- Error behavior: showError on failure.
- Reload behavior: yes on durable path.
- Toast/message behavior: success/error through runAndRefresh.
- Risk level: high.

### 6) approve
- Inputs: selected item, notes.
- Preconditions: selected item exists; local form approvalStatus set to approved.
- Local state changes: session.form.approvalStatus=approved; localOnly path updates local draft status=ready and approvalStatus=approved.
- Backend calls: approvePublishingItem(project, jobId, { notes }).
- Durable outputs: /publishing/:jobId/ready sets job status=ready; governance rule approval_before_publish enforced by assertPublishingMutationAllowed.
- User-visible output: "Publishing item approved and marked ready." or local-only approval message.
- Error behavior: validation error when no selection; backend error surfaced via showError.
- Reload behavior: yes on durable path.
- Toast/message behavior: success/error toasts.
- Risk level: high.

### 7) publish
- Inputs: selected item, notes.
- Preconditions: validateBuilder(session, publish) requires publishDate and approvalStatus=approved; durable path requires jobId and backend governance pass.
- Local state changes: localOnly path marks local status=published only in browser.
- Backend calls: publishPublishingItem(project, jobId, { notes }).
- Durable outputs: status=published update plus recordPublishingExecutionOutcome(execution_status=published, action_type=manual_publish_complete).
- User-visible output: "Publishing item marked as published." or local draft published message.
- Error behavior: showError on governance or API failure.
- Reload behavior: yes on durable path.
- Toast/message behavior: success/error toasts through runAndRefresh.
- Risk level: critical.

### 8) fail
- Inputs: selected item, notes.
- Preconditions: selected item exists; durable path requires jobId.
- Local state changes: localOnly path marks local draft failed.
- Backend calls: failPublishingItem(project, jobId, { notes }).
- Durable outputs: status=failed update plus recordPublishingExecutionOutcome(execution_status=failed, action_type=manual_publish_failed).
- User-visible output: "Publishing item marked as failed." or local-only failed message.
- Error behavior: validation error when no selection; API failures via showError.
- Reload behavior: yes on durable path.
- Toast/message behavior: success/error toasts.
- Risk level: critical.

### 9) load handoff
- Inputs: shared handoff summary from getPublishingHandoff.
- Preconditions: handoff available.
- Local state changes: form fields hydrated from handoff summary, loadedHandoffId set, selection reset, local draft saved.
- Backend calls: none.
- Durable outputs: none in this handler.
- User-visible output: "Workflow output loaded into a local publishing draft.".
- Error behavior: no explicit error path; relies on handoff shape fallback values.
- Reload behavior: no reloadProjectData call.
- Toast/message behavior: success message only.
- Risk level: medium.

### 10) send to AI workspace
- Inputs: selected/current draft context, buildPublishingAiPrompt output.
- Preconditions: none strict; can run from current session form.
- Local state changes: setSharedAiDraft(project, aiDraft), setSharedHandoff(project, ai-command, payload), navigateTo(ai-command).
- Backend calls: none from this handler.
- Durable outputs: none guaranteed (shared-context cache is in-memory map).
- User-visible output: route navigation plus message "Publishing context sent to AI Command.".
- Error behavior: no explicit try/catch in handler.
- Reload behavior: no reloadProjectData.
- Toast/message behavior: success message only.
- Risk level: medium (handoff context correctness).

### 11) auto prepare
- Inputs: buildPublishingAutoModePlan(session) with steps prepare_publishing_draft and publish_now gate step.
- Preconditions: explicit click on Auto Prepare button.
- Local state changes: publishingAutomationEnabled=true, progress/result banners updated, controller binding ensured.
- Backend calls: none direct; automation engine may create optional durable handoff if context.createProjectHandoff is wired.
- Durable outputs: optional handoff durability via automation engine context hook only.
- User-visible output: progress banner and completion/stopped result message.
- Error behavior: no safe step -> message "No safe publishing preparation steps available.".
- Reload behavior: no project data reload.
- Toast/message behavior: final status message shown.
- Risk level: high (automation lifecycle and gating semantics).

### 12) auto stop
- Inputs: none.
- Preconditions: explicit click.
- Local state changes: stopAutoMode resets auto state to idle/off.
- Backend calls: none.
- Durable outputs: none.
- User-visible output: "Auto Mode stopped.".
- Error behavior: none.
- Reload behavior: none.
- Toast/message behavior: success message.
- Risk level: low.

### 13) auto approve gate
- Inputs: current waiting gate in auto mode runtime.
- Preconditions: explicit click and waiting_approval state.
- Local state changes: approveCurrentGate advances gate, may navigate to target page, resumes loop.
- Backend calls: none direct; guarded action remains manual by doctrine.
- Durable outputs: none directly.
- User-visible output: "Approval gate accepted.".
- Error behavior: no-op when no gate pending.
- Reload behavior: none.
- Toast/message behavior: success message.
- Risk level: medium.

### 14) auto skip gate
- Inputs: current waiting gate index.
- Preconditions: explicit click and waiting_approval state.
- Local state changes: skipCurrentStep increments pointer and resumes loop.
- Backend calls: none.
- Durable outputs: none directly.
- User-visible output: "Gated step skipped.".
- Error behavior: no-op when no gate pending.
- Reload behavior: none.
- Toast/message behavior: success message.
- Risk level: medium.

### 15) local-only publish
- Inputs: selected localOnly item and form data.
- Preconditions: localOnly=true and validateBuilder publish preconditions.
- Local state changes: updateLocalDraft status=published.
- Backend calls: none.
- Durable outputs: none.
- User-visible output: "Local draft marked published.".
- Error behavior: validation errors from validateBuilder; no backend errors.
- Reload behavior: no reloadProjectData.
- Toast/message behavior: local success message only.
- Risk level: high (can appear equivalent to durable publish in UI).

### 16) local-only approve
- Inputs: selected localOnly item and notes.
- Preconditions: selected localOnly item exists.
- Local state changes: local draft status=ready and approvalStatus=approved.
- Backend calls: none.
- Durable outputs: none.
- User-visible output: "Local publishing draft approved.".
- Error behavior: selection validation if no current item.
- Reload behavior: none.
- Toast/message behavior: local success message.
- Risk level: medium-high.

### 17) local-only fail
- Inputs: selected localOnly item.
- Preconditions: selected item exists.
- Local state changes: local draft status=failed.
- Backend calls: none.
- Durable outputs: none.
- User-visible output: "Local publishing draft marked failed.".
- Error behavior: selection validation if missing item.
- Reload behavior: none.
- Toast/message behavior: local success message.
- Risk level: medium-high.

## Global Preservation Rules
- Do not start Auto Mode in render path; start only from explicit Auto Prepare click.
- Do not convert localOnly terminal statuses into implicit durable truth.
- Keep backend governance check as final authority for ready/publish and freeze-sensitive mutations.
- Keep runAndRefresh semantics: durable action then reloadProjectData then success message; catch and showError on failure.
