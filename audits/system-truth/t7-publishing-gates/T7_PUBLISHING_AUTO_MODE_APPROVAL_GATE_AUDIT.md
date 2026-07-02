# T7 — Publishing Auto Mode / Approval Gate Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/publishing.js

## Purpose
Publishing was identified as a high-risk page in the terminal baseline due to Auto Mode and publishing lifecycle references. This audit checks whether sensitive publishing actions are explicit, confirmed, and aligned with Backend Authority / Frontend Projection.

## Critical Publishing Calls
| Line | Code | Classification |
|---:|---|---|
| 99 | `buildSchedulePayload,` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1464 | `failPublishingItem,` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1485 | `function saveDraftLocally(message = "Publishing draft saved locally.") {` | Low risk: local draft persistence path |
| 1496 | `const local = saveDraftLocally("Publishing draft saved locally.");` | Low risk: local draft persistence path |
| 1499 | `() => savePublishingSchedule(projectName, buildSchedulePayload(session, "draft")),` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1583 | `const payload = buildSchedulePayload(session, "scheduled");` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1625 | `saveDraftLocally("Backend schedule unavailable; draft kept locally.");` | Low risk: local draft persistence path |
| 1695 | `() => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1714 | `() => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),` | P1-check: publishing mutation/schedule path needs confirmation review |
| 1778 | `() => failPublishingItem(projectName, current.jobId, { notes: session.form.notes \|\| current.notes }),` | Safety-positive: publishing mutation path has confirmation evidence |
| 1803 | `saveDraftLocally("Workflow output loaded into a local publishing draft.");` | Low risk: local draft persistence path |
| 1866 | `const runResult = await startAutoMode(plan, {` | P0-check: Auto Mode/gate action lacks local confirmation evidence |
| 1894 | `await approveCurrentGate({ context: { getState, navigateTo, projectName } });` | P0-check: Auto Mode/gate action lacks local confirmation evidence |
| 1902 | `await skipCurrentStep({ context: { getState, navigateTo, projectName } });` | P0-check: Auto Mode/gate action lacks local confirmation evidence |
| 1934 | `failPublishingItem` | P1-check: publishing mutation/schedule path needs confirmation review |
| 2016 | `failPublishingItem,` | P1-check: publishing mutation/schedule path needs confirmation review |
| 2030 | `failPublishingItem` | P1-check: publishing mutation/schedule path needs confirmation review |


## Confirmation / Button / Publishing Signal Lines
| Line | Code |
|---:|---|
| 2 | `function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {` |
| 11 | `const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;` |
| 13 | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,` |
| 14 | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,` |
| 15 | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,` |
| 16 | ``<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`` |
| 19 | `<section class="publishing-command-header" role="region" aria-label="Publishing Command Header">` |
| 20 | `<div class="publishing-command-header-title">Publishing Control Workspace</div>` |
| 21 | `<div class="publishing-command-header-context">${context}</div>` |
| 22 | `<div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>` |
| 23 | `<div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>` |
| 24 | `<div class="publishing-command-header-safety">${safety}</div>` |
| 25 | `<div class="publishing-command-header-actions">${actions}</div>` |
| 30 | `function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {` |
| 36 | `{ key: "schedule", label: "Schedule" },` |
| 44 | `schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",` |
| 45 | `handoff: selectedItem?.status === "published" ? "ready" : "missing"` |
| 48 | `<nav class="publishing-workflow-strip" aria-label="Publishing Workflow">` |
| 50 | `<div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">` |
| 52 | `<span class="publishing-workflow-step-label">${statusMap[step.key]}</span>` |
| 59 | `function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {` |
| 65 | `{ key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },` |
| 69 | `const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";` |
| 71 | `<section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">` |
| 73 | `<div class="publishing-readiness-card is-${r.state}">` |
| 74 | `<span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>` |
| 92 | `startAutoMode,` |
| 94 | `approveCurrentGate,` |
| 95 | `skipCurrentStep,` |
| 99 | `buildSchedulePayload,` |
| 101 | `buildPublishingAiPrompt` |
| 102 | `} from "./publishing/publishing-payloads.js";` |
| 104 | `const publishingSessions = new Map();` |
| 105 | `const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";` |
| 106 | `const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 107 | `const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 110 | `const PUBLISHING_ASSET_KEYS = [` |
| 120 | `const publishingAutomationState = {` |
| 124 | `let publishingAutoModeUnsubscribe = null;` |
| 125 | `let publishingAutoModeControllerReady = false;` |
| 126 | `let publishingAutomationEnabled = false;` |
| 127 | `let publishingRenderCallback = null;` |
| 128 | `let publishingRenderTimer = null;` |
| 130 | `function schedulePublishingRender(render) {` |
| 132 | `publishingRenderCallback = render;` |
| 135 | `if (publishingRenderTimer) {` |
| 139 | `publishingRenderTimer = window.setTimeout(() => {` |
| 140 | `publishingRenderTimer = null;` |
| 142 | `if (typeof publishingRenderCallback === "function") {` |
| 143 | `publishingRenderCallback();` |
| 148 | `function ensurePublishingAutoModeBinding(getState, navigateTo, render) {` |
| 149 | `publishingRenderCallback = render;` |
| 151 | `if (!publishingAutomationEnabled) {` |
| 155 | `if (!publishingAutoModeControllerReady) {` |
| 157 | `publishingAutoModeControllerReady = true;` |
| 160 | `if (publishingAutoModeUnsubscribe) {` |
| 164 | `publishingAutoModeUnsubscribe = subscribeAutoMode(() => {` |
| 172 | `schedulePublishingRender();` |
| 229 | `function formatDateTime(value, fallback = "Not scheduled") {` |
| 242 | `if (!date) return "Unscheduled";` |
| 272 | `if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";` |
| 276 | `if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";` |
| 277 | `if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";` |
| 284 | `if (status === "published") return "success";` |
| 285 | `if (status === "ready" \|\| status === "scheduled") return "warning";` |
| 297 | `const parsed = JSON.parse(window.localStorage?.getItem(PUBLISHING_LOCAL_DRAFTS_KEY) \|\| "{}");` |
| 307 | `window.localStorage?.setItem(PUBLISHING_LOCAL_DRAFTS_KEY, JSON.stringify(map \|\| {}));` |
| 325 | `id: asString(draft.id \|\| `local-publish-${Date.now()}`),` |
| 355 | `publishDate: toDateInput(tomorrow),` |
| 356 | `publishTime: "09:00",` |
| 365 | `if (!publishingSessions.has(key)) {` |
| 366 | `publishingSessions.set(key, {` |
| 377 | `return publishingSessions.get(key);` |
| 395 | `if (item.campaign) return `${item.campaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 396 | `if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 397 | `return `${titleCase(item.channel \|\| "Publishing")} item`;` |
| 403 | `const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);` |
| 404 | `const status = normalizeStatus(raw.execution_status \|\| raw.status, scheduledFor ? "scheduled" : "draft");` |
| 414 | `scheduledFor,` |
| 444 | `const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {` |
| 453 | `latest ? "Scheduled job + result" : "Scheduled job"` |
| 457 | `const knownIds = new Set(scheduledItems.map((item) => item.jobId));` |
| 463 | `const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));` |
| 466 | `return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);` |
| 474 | `scheduled: 3,` |
| 476 | `published: 5` |
| 481 | `const aTime = toDate(a.scheduledFor \|\| a.updatedAt \|\| a.createdAt)?.getTime() \|\| 0;` |
| 482 | `const bTime = toDate(b.scheduledFor \|\| b.updatedAt \|\| b.createdAt)?.getTime() \|\| 0;` |
| 513 | `function getNextPublishWindow(queue) {` |
| 515 | `.filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))` |
| 516 | `.sort((a, b) => (toDate(a.scheduledFor)?.getTime() \|\| 0) - (toDate(b.scheduledFor)?.getTime() \|\| 0))[0];` |
| 517 | `return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";` |
| 529 | `publishDate: toDateInput(item.scheduledFor),` |
| 530 | `publishTime: toTimeInput(item.scheduledFor),` |
| 558 | `function buildScheduleTime(form) {` |
| 559 | `const date = clean(form.publishDate);` |
| 561 | `return `${date}T${clean(form.publishTime) \|\| "09:00"}:00Z`;` |
| 564 | `function buildPublishingAutoModePlan(session) {` |
| 568 | `"Prepare publishing draft from current project context."` |
| 573 | `id: `publishing-prepare-${Date.now()}`,` |
| 574 | `type: "prepare_publishing_draft",` |
| 575 | `targetPage: "publishing",` |
| 576 | `action: "Prepare publishing draft",` |
| 579 | `reason: "Prepare a safe publishing draft without executing publish.",` |
| 580 | `title: firstText(session.form.title, "Prepared publishing draft")` |
| 585 | `id: `publishing-gate-${Date.now()}`,` |
| 586 | `type: "publish_now",` |
| 587 | `targetPage: "publishing",` |
| 588 | `action: "Record manual publish completion",` |
| 591 | `reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."` |
| 606 | `if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {` |
| 607 | `errors.publishDate = "Publish date is required for this action.";` |
| 609 | `if (intent === "publish" && form.approvalStatus !== "approved") {` |
| 610 | `errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";` |
| 617 | `function summarizePublishingBlockers(assetBlockers = []) {` |
| 626 | `function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {` |
| 629 | `const summary = summarizePublishingBlockers(blockers);` |
| 630 | `const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary \|\| "required publishing assets are missing or need review"}.`;` |
| 636 | `function confirmPublishingBackendAction(message) {` |
| 637 | `if (typeof window === "undefined" \|\| typeof window.confirm !== "function") return true;` |
| 638 | `return window.confirm(message);` |
| 643 | `return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";` |
| 653 | `} else if (status === "scheduled") {` |
| 656 | `return `<span class="publishing-status-pill is-${escapeHtml(statusClass(status))}" ${hint}>${escapeHtml(titleCase(status))}</span>`;` |
| 662 | `.publishing-execution-center {` |
| 668 | `.publishing-execution-grid {` |
| 674 | `.publishing-main-column,` |
| 675 | `.publishing-side-column {` |
| 682 | `.publishing-card {` |
| 687 | `.publishing-overview-grid {` |
| 693 | `.publishing-overview-item,` |
| 694 | `.publishing-impact-chip {` |
| 702 | `.publishing-overview-item span,` |
| 703 | `.publishing-impact-chip small {` |
| 710 | `.publishing-overview-item strong,` |
| 711 | `.publishing-impact-chip strong {` |
| 717 | `.publishing-overview-item.is-wide {` |
| 721 | `.publishing-impact-row,` |
| 722 | `.publishing-action-row,` |
| 723 | `.publishing-form-actions,` |
| 724 | `.publishing-filter-row {` |
| 731 | `.publishing-impact-row {` |
| 735 | `.publishing-action-row,` |
| 736 | `.publishing-form-actions {` |
| 740 | `.publishing-action-row .btn,` |
| 741 | `.publishing-form-actions .btn {` |
| 747 | `.publishing-impact-chip {` |
| 751 | `.publishing-filter-chip {` |
| 764 | `.publishing-filter-chip.is-active {` |
| 769 | `/* Publishing queue dark contrast correction */` |
| 770 | `.publishing-queue-list,` |
| 771 | `.publishing-calendar-list,` |
| 772 | `.publishing-blocker-list {` |
| 779 | `.publishing-queue-row {` |
| 790 | `.publishing-queue-row.is-active {` |
| 795 | `.publishing-queue-main,` |
| 796 | `.publishing-calendar-row {` |
| 807 | `.publishing-queue-title {` |
| 815 | `.publishing-queue-meta {` |
| 824 | `.publishing-queue-actions {` |
| 831 | `.publishing-queue-actions button {` |
| 843 | `.publishing-queue-actions button:focus-visible,` |
| 844 | `.publishing-queue-main:focus-visible,` |
| 845 | `.publishing-calendar-row:focus-visible,` |
| 846 | `.publishing-filter-chip:focus-visible {` |
| 851 | `.publishing-queue-actions button:disabled,` |
| 852 | `.publishing-queue-actions button[disabled] {` |
| 860 | `.publishing-status-pill {` |
| 873 | `.publishing-status-pill.is-ready,` |
| 874 | `.publishing-status-pill.is-scheduled {` |
| 878 | `.publishing-status-pill.is-published {` |
| 882 | `.publishing-status-pill.is-failed {` |
| 886 | `.publishing-inline-error {` |
| 893 | `.publishing-calendar-row {` |
| 904 | `.publishing-calendar-row em {` |
| 913 | `.publishing-execution-grid {` |
| 918 | `.publishing-queue-row {` |
| 923 | `.publishing-queue-actions {` |
| 955 | `function getPublishingHandoff(projectName, operations) {` |
| 957 | `getSharedHandoff(projectName, "publishing", operations, "workflows") \|\|` |
| 958 | `getSharedHandoff(projectName, "publishing", operations, "ai-command") \|\|` |
| 959 | `getSharedHandoff(projectName, "publishing", operations)` |
| 977 | `action: "Retry failed publishing item",` |
| 978 | `why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,` |
| 993 | `why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,` |
| 1008 | `action: "Complete and schedule a draft",` |
| 1015 | `action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",` |
| 1017 | `? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."` |
| 1018 | `: "Channel readiness is missing. Publishing can prepare drafts, but live execution needs a connected destination.",` |
| 1026 | `<section class="card publishing-card">` |
| 1029 | `<div class="setup-kicker">Publishing Overview</div>` |
| 1034 | `<div class="publishing-overview-grid">` |
| 1035 | `<div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>` |
| 1036 | `<div class="publishing-overview-item"><span>Ready for manual review</span><strong>${escapeHtml(String(counts.ready))}</strong></div>` |
| 1037 | `<div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>` |
| 1038 | `<div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>` |
| 1039 | `<div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>` |
| 1047 | `["Manual publishing readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],` |
| 1048 | `["Content", counts.draft \|\| counts.ready \|\| counts.scheduled ? "Present" : "Empty"],` |
| 1052 | `["Automation", counts.scheduled ? "Scheduled" : "Manual"]` |
| 1056 | `<section class="card publishing-card" id="publishingRecommendation">` |
| 1061 | `<p class="publishing-section-copy">${escapeHtml(recommendation.why)}</p>` |
| 1065 | `<div class="publishing-impact-row">` |
| 1067 | `<span class="publishing-impact-chip">` |
| 1073 | `<div class="publishing-action-row">` |
| 1074 | `<button id="publishingOpenQueueBtn" class="btn btn-secondary" type="button">Open Publish Queue</button>` |
| 1075 | `<button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save publishing draft</button>` |
| 1076 | `<button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>` |
| 1077 | `<button id="publishingAutoPrepareBtn" class="btn btn-secondary" type="button">Auto-prepare publishing plan</button>` |
| 1078 | `<button id="publishingAutoStopBtn" class="btn btn-secondary" type="button">Stop Auto Mode</button>` |
| 1080 | `<details class="publishing-automation-preview publishing-block-gap">` |
| 1082 | `<div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>` |
| 1083 | `<div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status \|\| "idle")}</div>` |
| 1085 | `<div class="simple-banner publishing-block-gap">Cross-system blockers: ${escapeHtml(asArray(recommendation.externalBlockers).map((item) => item.title).join("; "))}</div>` |
| 1087 | `${publishingAutomationState.progress ? `<div class="simple-banner publishing-block-gap">${escapeHtml(publishingAutomationState.progress)}</div>` : ""}` |
| 1088 | `${publishingAutomationState.result ? `<div class="simple-banner publishing-inline-gap">${escapeHtml(publishingAutomationState.result)}</div>` : ""}` |
| 1090 | `<div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason \|\| "Manual approval required.")}</div>` |
| 1091 | `<div class="publishing-action-row publishing-inline-gap">` |
| 1092 | `<button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>` |
| 1093 | `<button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>` |


## Focus Zones

### Auto Mode Binding / Controller Zone
```js
  120: const publishingAutomationState = {
  121:   progress: "",
  122:   result: ""
  123: };
  124: let publishingAutoModeUnsubscribe = null;
  125: let publishingAutoModeControllerReady = false;
  126: let publishingAutomationEnabled = false;
  127: let publishingRenderCallback = null;
  128: let publishingRenderTimer = null;
  129: 
  130: function schedulePublishingRender(render) {
  131:   if (typeof render === "function") {
  132:     publishingRenderCallback = render;
  133:   }
  134: 
  135:   if (publishingRenderTimer) {
  136:     return;
  137:   }
  138: 
  139:   publishingRenderTimer = window.setTimeout(() => {
  140:     publishingRenderTimer = null;
  141: 
  142:     if (typeof publishingRenderCallback === "function") {
  143:       publishingRenderCallback();
  144:     }
  145:   }, 120);
  146: }
  147: 
  148: function ensurePublishingAutoModeBinding(getState, navigateTo, render) {
  149:   publishingRenderCallback = render;
  150: 
  151:   if (!publishingAutomationEnabled) {
  152:     return;
  153:   }
  154: 
  155:   if (!publishingAutoModeControllerReady) {
  156:     createAutoModeController(getState, { getState, navigateTo });
  157:     publishingAutoModeControllerReady = true;
  158:   }
  159: 
  160:   if (publishingAutoModeUnsubscribe) {
  161:     return;
  162:   }
  163: 
  164:   publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
  165:     const autoState = getAutoModeState();
  166:     const status = asString(autoState.status || "idle");
  167: 
  168:     if (status === "idle") {
  169:       return;
  170:     }
  171: 
  172:     schedulePublishingRender();
  173:   });
  174: }
  175: 
  176: 
  177: 
  178: function asArray(value) {
  179:   return Array.isArray(value) ? value : [];
  180: }
```

### Publishing Plan / Validation Zone
```js
  560:   if (!date) return "";
  561:   return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
  562: }
  563: 
  564: function buildPublishingAutoModePlan(session) {
  565:   const draftPrompt = firstText(
  566:     session.form.contentItem,
  567:     session.form.notes,
  568:     "Prepare publishing draft from current project context."
  569:   );
  570: 
  571:   return [
  572:     {
  573:       id: `publishing-prepare-${Date.now()}`,
  574:       type: "prepare_publishing_draft",
  575:       targetPage: "publishing",
  576:       action: "Prepare publishing draft",
  577:       payload: {
  578:         prompt: draftPrompt,
  579:         reason: "Prepare a safe publishing draft without executing publish.",
  580:         title: firstText(session.form.title, "Prepared publishing draft")
  581:       },
  582:       priority: "recommended"
  583:     },
  584:     {
  585:       id: `publishing-gate-${Date.now()}`,
  586:       type: "publish_now",
  587:       targetPage: "publishing",
  588:       action: "Record manual publish completion",
  589:       payload: {
  590:         prompt: draftPrompt,
  591:         reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
  592:       },
  593:       priority: "critical"
  594:     }
  595:   ];
  596: }
  597: 
  598: function validateBuilder(session, intent) {
  599:   const errors = {};
  600:   const form = session.form;
  601: 
  602:   if (!clean(form.project)) errors.project = "Project is required.";
  603:   if (!clean(form.campaign)) errors.campaign = "Campaign is required.";
  604:   if (!clean(form.channel)) errors.channel = "Channel is required.";
  605:   if (!clean(form.contentItem)) errors.contentItem = "Content item is required.";
  606:   if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
  607:     errors.publishDate = "Publish date is required for this action.";
  608:   }
  609:   if (intent === "publish" && form.approvalStatus !== "approved") {
  610:     errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";
  611:   }
  612: 
  613:   session.validation = errors;
  614:   return !Object.keys(errors).length;
  615: }
  616: 
  617: function summarizePublishingBlockers(assetBlockers = []) {
  618:   const blockers = asArray(assetBlockers);
  619:   if (!blockers.length) return "";
  620:   return blockers
  621:     .slice(0, 4)
  622:     .map((item) => firstText(item.label, item.name, item.key, item.id, "Required asset"))
  623:     .join(", ");
  624: }
  625: 
  626: function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
  627:   const blockers = asArray(assetBlockers);
  628:   if (!blockers.length) return false;
  629:   const summary = summarizePublishingBlockers(blockers);
  630:   const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
  631:   session.validation.contentItem = message;
  632:   showMessage?.(message);
  633:   return true;
  634: }
  635: 
  636: function confirmPublishingBackendAction(message) {
  637:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  638:   return window.confirm(message);
  639: }
  640: 
  641: function fieldError(session, key, escapeHtml) {
  642:   const message = session.validation[key];
  643:   return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
  644: }
  645: 
  646: function renderStatusPill(status, escapeHtml) {
  647:   // Add governance/approval hints for status pills
  648:   let hint = "";
  649:   if (status === "needs approval") {
  650:     hint = "title=\"Request Approval Review. Confirmation required before execution.\" aria-label=\"Request Approval Review. Confirmation required before execution.\"";
```

### Main Action Binding Zone
```js
 1600:         current
 1601:           ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
 1602:           : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
 1603:       );
 1604:       if (!confirmed) {
 1605:         rerender();
 1606:         return;
 1607:       }
 1608: 
 1609:       const action = current
 1610:         ? () => reschedulePublishingItem(projectName, current.jobId, payload)
 1611:         : () => savePublishingSchedule(projectName, payload);
 1612: 
 1613:       const response = await runAndRefresh(action, {
 1614:         projectName,
 1615:         reloadProjectData,
 1616:         showMessage,
 1617:         showError,
 1618:         successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
 1619:       });
 1620: 
 1621:       if (response?.job?.job_id) {
 1622:         session.selectedId = response.job.job_id;
 1623:         session.formSourceId = response.job.job_id;
 1624:       } else if (!current) {
 1625:         saveDraftLocally("Backend schedule unavailable; draft kept locally.");
 1626:       }
 1627:       rerender();
 1628:     };
 1629:   }
 1630: 
 1631:   Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
 1632:     button.onclick = async () => {
 1633:       const itemId = button.getAttribute("data-publishing-id") || "";
 1634:       const action = button.getAttribute("data-publishing-action") || "";
 1635:       const item = getSelectedItem(queue, itemId);
 1636:       if (!item) return;
 1637: 
 1638:       session.selectedId = item.id;
 1639:       syncFormFromItem(session, item);
 1640: 
 1641:       if (action === "review") {
 1642:         rerender();
 1643:         return;
 1644:       }
 1645: 
 1646:       if (action === "schedule") {
 1647:         document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 1648:         rerender();
 1649:         return;
 1650:       }
 1651: 
 1652:       const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
 1653:       if (!validateBuilder(session, intent)) {
 1654:         rerender();
 1655:         return;
 1656:       }
 1657: 
 1658:       if (item.localOnly) {
 1659:         const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
 1660:         updateLocalDraft(projectName, item.id, { ...buildLocalDraftPayload(session, nextStatus), id: item.id });
 1661:         session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
 1662:         showMessage?.(session.draftMessage);
 1663:         rerender();
 1664:         return;
 1665:       }
 1666: 
 1667:       if (action === "publish") {
 1668:         if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
 1669:           rerender();
 1670:           return;
 1671:         }
 1672: 
 1673:         const confirmed = window.confirm(
 1674:           "Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."
 1675:         );
 1676:         if (!confirmed) {
 1677:           rerender();
 1678:           return;
 1679:         }
 1680:         await runAndRefresh(
 1681:           () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
 1682:           { projectName, reloadProjectData, showMessage, showError, successMessage: "Manual publishing completion recorded." }
 1683:         );
 1684:       }
 1685:       if (action === "pause") {
 1686:         const confirmed = confirmPublishingBackendAction(
 1687:           "Confirm pause\n\nAction: Move this backend publishing item back to draft.\n\nThis updates the backend publishing lifecycle state.\n\nSelect Cancel to keep the item unchanged."
 1688:         );
 1689:         if (!confirmed) {
 1690:           rerender();
 1691:           return;
 1692:         }
 1693: 
 1694:         await runAndRefresh(
 1695:           () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
 1696:           { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
 1697:         );
 1698:       }
 1699:       if (action === "retry") {
 1700:         if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
 1701:           rerender();
 1702:           return;
 1703:         }
 1704: 
 1705:         const confirmed = confirmPublishingBackendAction(
 1706:           "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
 1707:         );
 1708:         if (!confirmed) {
 1709:           rerender();
 1710:           return;
 1711:         }
 1712: 
 1713:         await runAndRefresh(
 1714:           () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
 1715:           { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
 1716:         );
 1717:       }
 1718:       rerender();
 1719:     };
 1720:   });
 1721: 
 1722:   const approveBtn = $("publishingApproveBtn");
 1723:   if (approveBtn) {
 1724:     approveBtn.onclick = async () => {
 1725:       const current = selected();
 1726:       if (!current) {
 1727:         session.validation.contentItem = "Select or save a publishing draft before approval.";
 1728:         rerender();
 1729:         return;
 1730:       }
 1731:       session.form.approvalStatus = "approved";
 1732:       if (current.localOnly) {
 1733:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
 1734:         showMessage?.("Local publishing draft approved.");
 1735:         rerender();
 1736:         return;
 1737:       }
 1738: 
 1739:       const confirmed = confirmPublishingBackendAction(
 1740:         "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
 1741:       );
 1742:       if (!confirmed) {
 1743:         rerender();
 1744:         return;
 1745:       }
 1746:       
 1747:       await runAndRefresh(
 1748:         () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1749:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
 1750:       );
 1751:       rerender();
 1752:     };
 1753:   }
 1754: 
 1755:   const failBtn = $("publishingFailBtn");
 1756:   if (failBtn) {
 1757:     failBtn.onclick = async () => {
 1758:       const current = selected();
 1759:       if (!current) {
 1760:         session.validation.contentItem = "Select a publishing item before marking it failed.";
 1761:         rerender();
 1762:         return;
 1763:       }
 1764:       if (current.localOnly) {
 1765:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });
 1766:         showMessage?.("Local publishing draft marked failed.");
 1767:         rerender();
 1768:         return;
 1769:       }
 1770: 
 1771:       const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
 1772:       if (!confirmed) {
 1773:         rerender();
 1774:         return;
 1775:       }
 1776: 
 1777:       await runAndRefresh(
 1778:         () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1779:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
 1780:       );
 1781:       rerender();
 1782:     };
 1783:   }
 1784: 
 1785:   const loadHandoffBtn = $("publishingLoadHandoffBtn");
 1786:   if (loadHandoffBtn) {
 1787:     loadHandoffBtn.onclick = () => {
 1788:       const summary = extractHandoffSummary(handoff);
 1789:       session.form = {
 1790:         ...session.form,
 1791:         project: firstText(summary.project, session.form.project, projectName),
 1792:         campaign: firstText(summary.campaign, session.form.campaign),
 1793:         channel: toKey(firstText(summary.channel, session.form.channel)),
 1794:         contentItem: firstText(summary.contentItem, summary.summary, session.form.contentItem),
 1795:         title: firstText(summary.title, session.form.title),
 1796:         notes: firstText(summary.summary, session.form.notes)
 1797:       };
 1798:       session.loadedHandoffId = summary.id;
 1799:       session.isCreatingNew = true;
 1800:       session.selectedId = "";
 1801:       session.formSourceId = "";
 1802:       session.validation = {};
 1803:       saveDraftLocally("Workflow output loaded into a local publishing draft.");
 1804:       rerender();
 1805:     };
 1806:   }
 1807: 
 1808:   const pushAiBtn = $("publishingPushAiBtn");
 1809:   if (pushAiBtn) {
 1810:     pushAiBtn.onclick = () => {
 1811:       syncSessionForm(session, form);
 1812:       const current = selected();
 1813:       const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
 1814:       const aiDraft = {
 1815:         projectName,
 1816:         modeId: "operations",
 1817:         lastCommand: prompt,
 1818:         lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
 1819:         routeSuggestions: []
 1820:       };
 1821: 
 1822:       setSharedAiDraft(projectName, aiDraft);
 1823:       setSharedHandoff(projectName, "ai-command", {
 1824:         source_page: "publishing",
 1825:         destination_page: "ai-command",
 1826:         linked_entity: {
 1827:           entity_type: "publishing_job",
 1828:           entity_id: current?.jobId || session.formSourceId || ""
 1829:         },
 1830:         payload: {
 1831:           prompt,
 1832:           publishing_item_id: current?.jobId || session.formSourceId || "",
 1833:           publishing_title: current?.title || session.form.title || "",
 1834:           draft_context: aiDraft,
 1835:           selection: {
 1836:             status: current?.status || "draft",
 1837:             channel: session.form.channel || current?.channel || "",
 1838:             scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
 1839:             notes: session.form.notes
 1840:           }
 1841:         },
 1842:         status: "available"
 1843:       });
 1844:       navigateTo("ai-command");
 1845:       showMessage?.("Publishing context sent to AI Command.");
 1846:     };
 1847:   }
 1848: 
 1849:   const autoPrepareBtn = $("publishingAutoPrepareBtn");
 1850:   if (autoPrepareBtn) {
 1851:     autoPrepareBtn.onclick = async () => {
 1852:       const plan = buildPublishingAutoModePlan(session);
 1853:       if (!plan.length) {
 1854:         publishingAutomationState.progress = "";
 1855:         publishingAutomationState.result = "No safe publishing preparation steps available.";
 1856:         rerender();
 1857:         return;
 1858:       }
 1859: 
 1860:       publishingAutomationState.result = "";
 1861:       publishingAutomationState.progress = `Step 0 / ${plan.length}`;
 1862:       publishingAutomationEnabled = true;
 1863:       ensurePublishingAutoModeBinding(getState, navigateTo, render);
 1864:       rerender();
 1865: 
 1866:       const runResult = await startAutoMode(plan, {
 1867:         mode: "auto_until_approval",
 1868:         context: { getState, navigateTo, projectName },
 1869:         onProgress: ({ index, total, step, result }) => {
 1870:         publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
 1871:         schedulePublishingRender(render);
 1872:         }
 1873:       });
 1874: 
 1875:       publishingAutomationState.result = runResult.status === "success"
 1876:         ? "Auto Prepare Publishing completed."
 1877:         : "Auto Prepare Publishing stopped before completion.";
 1878:       showMessage?.(publishingAutomationState.result);
 1879:       rerender();
 1880:     };
 1881:   }
 1882: 
 1883:   const autoStopBtn = $("publishingAutoStopBtn");
 1884:   if (autoStopBtn) {
 1885:     autoStopBtn.onclick = () => {
 1886:       stopAutoMode();
 1887:       showMessage?.("Auto Mode stopped.");
 1888:     };
 1889:   }
 1890: 
 1891:   const autoApproveBtn = $("publishingAutoApproveBtn");
 1892:   if (autoApproveBtn) {
 1893:     autoApproveBtn.onclick = async () => {
 1894:       await approveCurrentGate({ context: { getState, navigateTo, projectName } });
 1895:       showMessage?.("Approval gate accepted.");
 1896:     };
 1897:   }
 1898: 
 1899:   const autoSkipBtn = $("publishingAutoSkipBtn");
 1900:   if (autoSkipBtn) {
 1901:     autoSkipBtn.onclick = async () => {
 1902:       await skipCurrentStep({ context: { getState, navigateTo, projectName } });
 1903:       showMessage?.("Gated step skipped.");
 1904:     };
 1905:   }
 1906: }
 1907: 
 1908: export const publishingRoute = {
 1909:   id: "publishing",
 1910:   disableStandardLayout: true,
 1911:   meta: {
 1912:     eyebrow: "Execute & Grow",
 1913:     title: "Publishing",
 1914:     description: "Review, prepare, queue, and record manual publishing status with clear previews and backend-controlled actions."
 1915:   },
```

## Decision Checklist
- If Auto Mode start lacks confirmation: add confirmation.
- If approve gate lacks confirmation: add confirmation.
- If skip step lacks confirmation: add confirmation.
- If fail/complete/schedule publishing action lacks confirmation: add confirmation.
- If all sensitive paths are confirmed: close as verified, no runtime patch.
- Do not change backend authority.
- Do not change CSS.
- Do not change data/projects.
