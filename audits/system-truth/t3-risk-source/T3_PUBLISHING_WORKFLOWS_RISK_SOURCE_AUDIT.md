# T3 — Publishing + Workflows Risk Source Audit

## Status
Audit-only. No production files changed.

## Purpose
The terminal baseline identified Publishing and Workflows as the highest P0 risk pages because of AutoMode and execution-related references. This audit extracts exact source lines and classifies them for manual decision.

## Scope
- public/control-center/pages/publishing.js
- public/control-center/pages/workflows.js

## Decision Rules
- Do not remove AutoMode references blindly.
- Do not change publish/workflow execution paths without confirming backend authority and confirmation gates.
- Treat active automation control references as P0-check.
- Treat publish/approve/reject/fail/schedule/execute paths as P1-check unless already clearly protected.
- Treat confirm() as safety-positive, not a risk.
- Treat innerHTML/listeners/timers as lifecycle/rendering review items.

## Next Decision
After reviewing this report, choose one small fix:
1. Documentation-only closeout if references are compatibility-only.
2. Add/verify confirmation gate if a mutation path lacks confirmation.
3. Isolate AutoMode startup if any implicit execution remains.
4. Move lifecycle listeners/timers to registry only if leak risk is proven.

---

# public/control-center/pages/publishing.js

- Lines: 2037

## AutoMode / automation
Hits: 27

| Line | Classification | Code |
|---:|---|---|
| 90 | Review | `createAutoModeController,` |
| 91 | Review | `getAutoModeState,` |
| 92 | P0-check: active automation execution/control reference | `startAutoMode,` |
| 93 | Review | `stopAutoMode,` |
| 94 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 95 | P0-check: active automation execution/control reference | `skipCurrentStep,` |
| 96 | Review | `subscribeAutoMode` |
| 124 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingAutoModeUnsubscribe = null;` |
| 125 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingAutoModeControllerReady = false;` |
| 148 | P1-check: mutation/execution path; verify backend authority and confirmation | `function ensurePublishingAutoModeBinding(getState, navigateTo, render) {` |
| 155 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!publishingAutoModeControllerReady) {` |
| 156 | Review | `createAutoModeController(getState, { getState, navigateTo });` |
| 157 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingAutoModeControllerReady = true;` |
| 160 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (publishingAutoModeUnsubscribe) {` |
| 164 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingAutoModeUnsubscribe = subscribeAutoMode(() => {` |
| 165 | Review | `const autoState = getAutoModeState();` |
| 564 | P1-check: mutation/execution path; verify backend authority and confirmation | `function buildPublishingAutoModePlan(session) {` |
| 1083 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status \|\| "idle")}</div>` |
| 1089 | Review | `${getAutoModeState().status === "waiting_approval" ? `` |
| 1090 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason \|\| "Manual approval required.")}</div>` |
| 1474 | P1-check: mutation/execution path; verify backend authority and confirmation | `ensurePublishingAutoModeBinding(getState, navigateTo, render);` |
| 1852 | P1-check: mutation/execution path; verify backend authority and confirmation | `const plan = buildPublishingAutoModePlan(session);` |
| 1863 | P1-check: mutation/execution path; verify backend authority and confirmation | `ensurePublishingAutoModeBinding(getState, navigateTo, render);` |
| 1866 | P0-check: active automation execution/control reference | `const runResult = await startAutoMode(plan, {` |
| 1886 | Review | `stopAutoMode();` |
| 1894 | P0-check: active automation execution/control reference | `await approveCurrentGate({ context: { getState, navigateTo, projectName } });` |
| 1902 | P0-check: active automation execution/control reference | `await skipCurrentStep({ context: { getState, navigateTo, projectName } });` |

## Execution / mutation verbs
Hits: 482

| Line | Classification | Code |
|---:|---|---|
| 2 | P1-check: mutation/execution path; verify backend authority and confirmation | `function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {` |
| 11 | Review | `const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;` |
| 13 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,` |
| 14 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,` |
| 15 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,` |
| 16 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`` |
| 19 | P1-check: mutation/execution path; verify backend authority and confirmation | `<section class="publishing-command-header" role="region" aria-label="Publishing Command Header">` |
| 20 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-title">Publishing Control Workspace</div>` |
| 21 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-context">${context}</div>` |
| 22 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>` |
| 23 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>` |
| 24 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-safety">${safety}</div>` |
| 25 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-actions">${actions}</div>` |
| 30 | P1-check: mutation/execution path; verify backend authority and confirmation | `function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {` |
| 36 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "schedule", label: "Schedule" },` |
| 43 | P1-check: mutation/execution path; verify backend authority and confirmation | `approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",` |
| 44 | P1-check: mutation/execution path; verify backend authority and confirmation | `schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",` |
| 45 | P1-check: mutation/execution path; verify backend authority and confirmation | `handoff: selectedItem?.status === "published" ? "ready" : "missing"` |
| 48 | P1-check: mutation/execution path; verify backend authority and confirmation | `<nav class="publishing-workflow-strip" aria-label="Publishing Workflow">` |
| 50 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">` |
| 52 | P1-check: mutation/execution path; verify backend authority and confirmation | `<span class="publishing-workflow-step-label">${statusMap[step.key]}</span>` |
| 59 | P1-check: mutation/execution path; verify backend authority and confirmation | `function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {` |
| 65 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },` |
| 66 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },` |
| 67 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }` |
| 69 | P1-check: mutation/execution path; verify backend authority and confirmation | `const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";` |
| 71 | P1-check: mutation/execution path; verify backend authority and confirmation | `<section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">` |
| 73 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-readiness-card is-${r.state}">` |
| 74 | P1-check: mutation/execution path; verify backend authority and confirmation | `<span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>` |
| 94 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 99 | P1-check: mutation/execution path; verify backend authority and confirmation | `buildSchedulePayload,` |
| 101 | P1-check: mutation/execution path; verify backend authority and confirmation | `buildPublishingAiPrompt` |
| 102 | P1-check: mutation/execution path; verify backend authority and confirmation | `} from "./publishing/publishing-payloads.js";` |
| 104 | P1-check: mutation/execution path; verify backend authority and confirmation | `const publishingSessions = new Map();` |
| 105 | P1-check: mutation/execution path; verify backend authority and confirmation | `const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";` |
| 106 | P1-check: mutation/execution path; verify backend authority and confirmation | `const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 107 | P1-check: mutation/execution path; verify backend authority and confirmation | `const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 109 | P1-check: mutation/execution path; verify backend authority and confirmation | `const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];` |
| 110 | P1-check: mutation/execution path; verify backend authority and confirmation | `const PUBLISHING_ASSET_KEYS = [` |
| 120 | P1-check: mutation/execution path; verify backend authority and confirmation | `const publishingAutomationState = {` |
| 124 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingAutoModeUnsubscribe = null;` |
| 125 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingAutoModeControllerReady = false;` |
| 126 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingAutomationEnabled = false;` |
| 127 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingRenderCallback = null;` |
| 128 | P1-check: mutation/execution path; verify backend authority and confirmation | `let publishingRenderTimer = null;` |
| 130 | P1-check: mutation/execution path; verify backend authority and confirmation | `function schedulePublishingRender(render) {` |
| 132 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderCallback = render;` |
| 135 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (publishingRenderTimer) {` |
| 139 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderTimer = window.setTimeout(() => {` |
| 140 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderTimer = null;` |
| 142 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (typeof publishingRenderCallback === "function") {` |
| 143 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderCallback();` |
| 148 | P1-check: mutation/execution path; verify backend authority and confirmation | `function ensurePublishingAutoModeBinding(getState, navigateTo, render) {` |
| 149 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderCallback = render;` |
| 151 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!publishingAutomationEnabled) {` |
| 155 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!publishingAutoModeControllerReady) {` |
| 157 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingAutoModeControllerReady = true;` |
| 160 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (publishingAutoModeUnsubscribe) {` |
| 164 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingAutoModeUnsubscribe = subscribeAutoMode(() => {` |
| 172 | P1-check: mutation/execution path; verify backend authority and confirmation | `schedulePublishingRender();` |
| 229 | P1-check: mutation/execution path; verify backend authority and confirmation | `function formatDateTime(value, fallback = "Not scheduled") {` |
| 242 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!date) return "Unscheduled";` |
| 272 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";` |
| 276 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";` |
| 277 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";` |
| 278 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";` |
| 284 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "published") return "success";` |
| 285 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "ready" \|\| status === "scheduled") return "warning";` |
| 286 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "failed") return "danger";` |
| 297 | P1-check: mutation/execution path; verify backend authority and confirmation | `const parsed = JSON.parse(window.localStorage?.getItem(PUBLISHING_LOCAL_DRAFTS_KEY) \|\| "{}");` |
| 307 | P1-check: mutation/execution path; verify backend authority and confirmation | `window.localStorage?.setItem(PUBLISHING_LOCAL_DRAFTS_KEY, JSON.stringify(map \|\| {}));` |
| 319 | Review | `function saveLocalDraft(projectName, draft) {` |
| 325 | P1-check: mutation/execution path; verify backend authority and confirmation | `id: asString(draft.id \|\| `local-publish-${Date.now()}`),` |
| 328 | Review | `updatedAt: nowIso()` |
| 335 | Review | `function updateLocalDraft(projectName, itemId, patch) {` |
| 337 | Review | `return saveLocalDraft(projectName, {` |
| 355 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishDate: toDateInput(tomorrow),` |
| 356 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishTime: "09:00",` |
| 365 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!publishingSessions.has(key)) {` |
| 366 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingSessions.set(key, {` |
| 377 | P1-check: mutation/execution path; verify backend authority and confirmation | `return publishingSessions.get(key);` |
| 395 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (item.campaign) return `${item.campaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 396 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 397 | P1-check: mutation/execution path; verify backend authority and confirmation | `return `${titleCase(item.channel \|\| "Publishing")} item`;` |
| 403 | P1-check: mutation/execution path; verify backend authority and confirmation | `const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);` |
| 404 | P1-check: mutation/execution path; verify backend authority and confirmation | `const status = normalizeStatus(raw.execution_status \|\| raw.status, scheduledFor ? "scheduled" : "draft");` |
| 414 | P1-check: mutation/execution path; verify backend authority and confirmation | `scheduledFor,` |
| 415 | P1-check: mutation/execution path; verify backend authority and confirmation | `executedAt: firstText(raw.executed_at, raw.executedAt),` |
| 416 | P1-check: mutation/execution path; verify backend authority and confirmation | `createdAt: firstText(raw.created_at, raw.createdAt, raw.executed_at),` |
| 417 | P1-check: mutation/execution path; verify backend authority and confirmation | `updatedAt: firstText(raw.updated_at, raw.updatedAt, raw.executed_at, raw.created_at),` |
| 418 | P1-check: mutation/execution path; verify backend authority and confirmation | `approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",` |
| 436 | P1-check: mutation/execution path; verify backend authority and confirmation | `.sort((a, b) => (toDate(b.executed_at)?.getTime() \|\| 0) - (toDate(a.executed_at)?.getTime() \|\| 0));` |
| 444 | P1-check: mutation/execution path; verify backend authority and confirmation | `const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {` |
| 453 | P1-check: mutation/execution path; verify backend authority and confirmation | `latest ? "Scheduled job + result" : "Scheduled job"` |
| 457 | P1-check: mutation/execution path; verify backend authority and confirmation | `const knownIds = new Set(scheduledItems.map((item) => item.jobId));` |
| 463 | P1-check: mutation/execution path; verify backend authority and confirmation | `const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));` |
| 466 | P1-check: mutation/execution path; verify backend authority and confirmation | `return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);` |
| 471 | P1-check: mutation/execution path; verify backend authority and confirmation | `failed: 0,` |
| 474 | P1-check: mutation/execution path; verify backend authority and confirmation | `scheduled: 3,` |
| 476 | P1-check: mutation/execution path; verify backend authority and confirmation | `published: 5` |
| 481 | P1-check: mutation/execution path; verify backend authority and confirmation | `const aTime = toDate(a.scheduledFor \|\| a.updatedAt \|\| a.createdAt)?.getTime() \|\| 0;` |
| 482 | P1-check: mutation/execution path; verify backend authority and confirmation | `const bTime = toDate(b.scheduledFor \|\| b.updatedAt \|\| b.createdAt)?.getTime() \|\| 0;` |
| 513 | P1-check: mutation/execution path; verify backend authority and confirmation | `function getNextPublishWindow(queue) {` |
| 515 | P1-check: mutation/execution path; verify backend authority and confirmation | `.filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))` |
| 516 | P1-check: mutation/execution path; verify backend authority and confirmation | `.sort((a, b) => (toDate(a.scheduledFor)?.getTime() \|\| 0) - (toDate(b.scheduledFor)?.getTime() \|\| 0))[0];` |
| 517 | P1-check: mutation/execution path; verify backend authority and confirmation | `return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";` |
| 529 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishDate: toDateInput(item.scheduledFor),` |
| 530 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishTime: toTimeInput(item.scheduledFor),` |
| 558 | P1-check: mutation/execution path; verify backend authority and confirmation | `function buildScheduleTime(form) {` |
| 559 | P1-check: mutation/execution path; verify backend authority and confirmation | `const date = clean(form.publishDate);` |
| 561 | P1-check: mutation/execution path; verify backend authority and confirmation | `return `${date}T${clean(form.publishTime) \|\| "09:00"}:00Z`;` |
| 564 | P1-check: mutation/execution path; verify backend authority and confirmation | `function buildPublishingAutoModePlan(session) {` |
| 568 | P1-check: mutation/execution path; verify backend authority and confirmation | `"Prepare publishing draft from current project context."` |
| 573 | P1-check: mutation/execution path; verify backend authority and confirmation | `id: `publishing-prepare-${Date.now()}`,` |
| 574 | P1-check: mutation/execution path; verify backend authority and confirmation | `type: "prepare_publishing_draft",` |
| 575 | P1-check: mutation/execution path; verify backend authority and confirmation | `targetPage: "publishing",` |
| 576 | P1-check: mutation/execution path; verify backend authority and confirmation | `action: "Prepare publishing draft",` |
| 579 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: "Prepare a safe publishing draft without executing publish.",` |
| 580 | P1-check: mutation/execution path; verify backend authority and confirmation | `title: firstText(session.form.title, "Prepared publishing draft")` |
| 585 | P1-check: mutation/execution path; verify backend authority and confirmation | `id: `publishing-gate-${Date.now()}`,` |
| ... | Truncated | 362 more hits not shown |

## Confirmation gates
Hits: 33

| Line | Classification | Code |
|---:|---|---|
| 11 | Review | `const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;` |
| 15 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,` |
| 94 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 148 | P1-check: mutation/execution path; verify backend authority and confirmation | `function ensurePublishingAutoModeBinding(getState, navigateTo, render) {` |
| 156 | Review | `createAutoModeController(getState, { getState, navigateTo });` |
| 585 | P1-check: mutation/execution path; verify backend authority and confirmation | `id: `publishing-gate-${Date.now()}`,` |
| 638 | Safety-positive: confirmation gate exists | `return window.confirm(message);` |
| 650 | Review | `hint = "title=\"Request Approval Review. Confirmation required before execution.\" aria-label=\"Request Approval Review. Confirmation required before execution.\"";` |
| 654 | Review | `hint = "title=\"Confirmation required before execution.\" aria-label=\"Confirmation required before execution.\"";` |
| 1082 | Review | `<div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>` |
| 1090 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason \|\| "Manual approval required.")}</div>` |
| 1230 | Review | `<span class="setup-field-state is-optional">Gate</span>` |
| 1422 | Review | `function renderAssetGate(state, escapeHtml) {` |
| 1456 | Review | `navigateTo,` |
| 1474 | P1-check: mutation/execution path; verify backend authority and confirmation | `ensurePublishingAutoModeBinding(getState, navigateTo, render);` |
| 1673 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm(` |
| 1674 | Review | `"Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."` |
| 1696 | Review | `{ projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }` |
| 1715 | Review | `{ projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }` |
| 1771 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");` |
| 1844 | Review | `navigateTo("ai-command");` |
| 1863 | P1-check: mutation/execution path; verify backend authority and confirmation | `ensurePublishingAutoModeBinding(getState, navigateTo, render);` |
| 1868 | Review | `context: { getState, navigateTo, projectName },` |
| 1894 | P0-check: active automation execution/control reference | `await approveCurrentGate({ context: { getState, navigateTo, projectName } });` |
| 1895 | Review | `showMessage?.("Approval gate accepted.");` |
| 1902 | P0-check: active automation execution/control reference | `await skipCurrentStep({ context: { getState, navigateTo, projectName } });` |
| 1903 | Review | `showMessage?.("Gated step skipped.");` |
| 1926 | Review | `navigateTo,` |
| 1989 | Review | `<button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>` |
| 1990 | Review | `<button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>` |
| 1999 | Review | `${renderAssetGate(state, escapeHtml)}` |
| 2008 | Review | `navigateTo,` |
| 2022 | Review | `navigateTo,` |

## Backend/API calls
Hits: 10

| Line | Classification | Code |
|---:|---|---|
| 82 | Review | `import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";` |
| 351 | Review | `project: firstText(context.currentProject, overview.project_name),` |
| 352 | Review | `campaign: firstText(context.activeCampaign, overview.active_campaign),` |
| 396 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 568 | P1-check: mutation/execution path; verify backend authority and confirmation | `"Prepare publishing draft from current project context."` |
| 945 | Review | `title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),` |
| 946 | Review | `project: firstText(draftContext.projectName, payload.project_name, output.project),` |
| 950 | Review | `summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),` |
| 1471 | Review | `const projectName = state.context.currentProject \|\| "";` |
| 1937 | Review | `const projectName = state.context.currentProject \|\| "";` |

## Frontend authority words
Hits: 41

| Line | Classification | Code |
|---:|---|---|
| 8 | Review | `const status = selectedItem ? titleCase(selectedItem.status) : "No item selected";` |
| 19 | P1-check: mutation/execution path; verify backend authority and confirmation | `<section class="publishing-command-header" role="region" aria-label="Publishing Command Header">` |
| 40 | Review | `draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",` |
| 43 | P1-check: mutation/execution path; verify backend authority and confirmation | `approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",` |
| 44 | P1-check: mutation/execution path; verify backend authority and confirmation | `schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",` |
| 45 | P1-check: mutation/execution path; verify backend authority and confirmation | `handoff: selectedItem?.status === "published" ? "ready" : "missing"` |
| 63 | Review | `{ key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },` |
| 66 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },` |
| 67 | P1-check: mutation/execution path; verify backend authority and confirmation | `{ key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }` |
| 109 | P1-check: mutation/execution path; verify backend authority and confirmation | `const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];` |
| 166 | Review | `const status = asString(autoState.status \|\| "idle");` |
| 168 | Review | `if (status === "idle") {` |
| 284 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "published") return "success";` |
| 285 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "ready" \|\| status === "scheduled") return "warning";` |
| 286 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "failed") return "danger";` |
| 404 | P1-check: mutation/execution path; verify backend authority and confirmation | `const status = normalizeStatus(raw.execution_status \|\| raw.status, scheduledFor ? "scheduled" : "draft");` |
| 418 | P1-check: mutation/execution path; verify backend authority and confirmation | `approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",` |
| 499 | Review | `acc[status] = queue.filter((item) => item.status === status).length;` |
| 506 | Review | `return queue.filter((item) => item.status === filter);` |
| 610 | P1-check: mutation/execution path; verify backend authority and confirmation | `errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";` |
| 647 | Review | `// Add governance/approval hints for status pills` |
| 649 | Review | `if (status === "needs approval") {` |
| 651 | Review | `} else if (status === "ready") {` |
| 652 | Review | `hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";` |
| 653 | P1-check: mutation/execution path; verify backend authority and confirmation | `} else if (status === "scheduled") {` |
| 968 | P1-check: mutation/execution path; verify backend authority and confirmation | `const failed = queue.find((item) => item.status === "failed");` |
| 969 | Review | `const ready = queue.find((item) => item.status === "ready");` |
| 970 | Review | `const needsApproval = queue.find((item) => item.status === "needs approval");` |
| 971 | Review | `const draft = queue.find((item) => item.status === "draft");` |
| 1089 | Review | `${getAutoModeState().status === "waiting_approval" ? `` |
| 1110 | Review | `const count = status === "all" ? queue.length : counts[status];` |
| 1113 | Review | `<span>${escapeHtml(status === "all" ? "All" : titleCase(status))}</span>` |
| 1233 | Review | `${APPROVAL_STATUSES.map((status) => `` |
| 1234 | Review | `<option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>` |
| 1376 | P1-check: mutation/execution path; verify backend authority and confirmation | `.filter((item) => item.executedAt \|\| item.status === "failed")` |
| 1378 | P1-check: mutation/execution path; verify backend authority and confirmation | `const failed = queue.filter((item) => item.status === "failed");` |
| 1659 | P1-check: mutation/execution path; verify backend authority and confirmation | `const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;` |
| 1731 | P1-check: mutation/execution path; verify backend authority and confirmation | `session.form.approvalStatus = "approved";` |
| 1740 | Review | `"Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."` |
| 1771 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");` |
| 1875 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingAutomationState.result = runResult.status === "success"` |

## Timers/listeners
Hits: 1

| Line | Classification | Code |
|---:|---|---|
| 139 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishingRenderTimer = window.setTimeout(() => {` |

## DOM writes
Hits: 1

| Line | Classification | Code |
|---:|---|---|
| 1967 | P2-check: DOM rewrite; verify sanitized/static rendering | `root.innerHTML = `` |

## AI handoff / context
Hits: 164

| Line | Classification | Code |
|---:|---|---|
| 2 | P1-check: mutation/execution path; verify backend authority and confirmation | `function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {` |
| 3 | Review | `const context = [` |
| 5 | Review | `selectedItem?.campaign && `<span>Campaign: <strong>${escapeHtml(selectedItem.campaign)}</strong></span>`,` |
| 11 | Review | `const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;` |
| 15 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,` |
| 16 | P1-check: mutation/execution path; verify backend authority and confirmation | ``<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`` |
| 19 | P1-check: mutation/execution path; verify backend authority and confirmation | `<section class="publishing-command-header" role="region" aria-label="Publishing Command Header">` |
| 20 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-title">Publishing Control Workspace</div>` |
| 21 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-context">${context}</div>` |
| 22 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>` |
| 23 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>` |
| 24 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-safety">${safety}</div>` |
| 25 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-command-header-actions">${actions}</div>` |
| 37 | Review | `{ key: "handoff", label: "Manual Completion Handoff" }` |
| 45 | P1-check: mutation/execution path; verify backend authority and confirmation | `handoff: selectedItem?.status === "published" ? "ready" : "missing"` |
| 82 | Review | `import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";` |
| 101 | P1-check: mutation/execution path; verify backend authority and confirmation | `buildPublishingAiPrompt` |
| 106 | P1-check: mutation/execution path; verify backend authority and confirmation | `const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 107 | P1-check: mutation/execution path; verify backend authority and confirmation | `const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];` |
| 108 | Review | `const CHANNEL_DEFAULTS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];` |
| 116 | Review | `"campaign_assets",` |
| 278 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";` |
| 286 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (status === "failed") return "danger";` |
| 345 | Review | `const context = asObject(state.context);` |
| 351 | Review | `project: firstText(context.currentProject, overview.project_name),` |
| 352 | Review | `campaign: firstText(context.activeCampaign, overview.active_campaign),` |
| 373 | Review | `loadedHandoffId: "",` |
| 392 | Review | `const context = asObject(state.context);` |
| 395 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (item.campaign) return `${item.campaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 396 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel \|\| "publish")}`;` |
| 410 | Review | `project: firstText(raw.project, raw.project_name, state.context?.currentProject),` |
| 411 | Review | `campaign: firstText(raw.campaign, raw.campaign_name, raw.wave_name, raw.waveName, state.context?.activeCampaign),` |
| 471 | P1-check: mutation/execution path; verify backend authority and confirmation | `failed: 0,` |
| 526 | Review | `campaign: item.campaign \|\| "",` |
| 565 | Review | `const draftPrompt = firstText(` |
| 568 | P1-check: mutation/execution path; verify backend authority and confirmation | `"Prepare publishing draft from current project context."` |
| 578 | Review | `prompt: draftPrompt,` |
| 590 | Review | `prompt: draftPrompt,` |
| 603 | Review | `if (!clean(form.campaign)) errors.campaign = "Campaign is required.";` |
| 674 | P1-check: mutation/execution path; verify backend authority and confirmation | `.publishing-main-column,` |
| 795 | P1-check: mutation/execution path; verify backend authority and confirmation | `.publishing-queue-main,` |
| 844 | P1-check: mutation/execution path; verify backend authority and confirmation | `.publishing-queue-main:focus-visible,` |
| 882 | P1-check: mutation/execution path; verify backend authority and confirmation | `.publishing-status-pill.is-failed {` |
| 931 | Review | `function summarizeText(value, fallback = "No content payload available yet.") {` |
| 937 | Review | `function extractHandoffSummary(handoff) {` |
| 938 | Review | `const payload = asObject(handoff?.payload);` |
| 940 | Review | `const draftContext = asObject(payload.draft_context);` |
| 942 | Review | `id: asString(handoff?.id \|\| payload.workflow_id \|\| payload.prompt \|\| payload.workflow_title),` |
| 943 | Review | `sourcePage: asString(handoff?.source_page \|\| "workflows"),` |
| 945 | Review | `title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),` |
| 946 | Review | `project: firstText(draftContext.projectName, payload.project_name, output.project),` |
| 947 | Review | `campaign: firstText(payload.campaign_name, output.campaign, output.campaignName),` |
| 949 | Review | `contentItem: firstText(output.content_item, output.contentItem, output.summary, payload.prompt),` |
| 950 | Review | `summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),` |
| 955 | P1-check: mutation/execution path; verify backend authority and confirmation | `function getPublishingHandoff(projectName, operations) {` |
| 957 | P1-check: mutation/execution path; verify backend authority and confirmation | `getSharedHandoff(projectName, "publishing", operations, "workflows") \|\|` |
| 958 | P1-check: mutation/execution path; verify backend authority and confirmation | `getSharedHandoff(projectName, "publishing", operations, "ai-command") \|\|` |
| 959 | P1-check: mutation/execution path; verify backend authority and confirmation | `getSharedHandoff(projectName, "publishing", operations)` |
| 967 | Review | `function buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers }) {` |
| 968 | P1-check: mutation/execution path; verify backend authority and confirmation | `const failed = queue.find((item) => item.status === "failed");` |
| 975 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (failed) {` |
| 977 | P1-check: mutation/execution path; verify backend authority and confirmation | `action: "Retry failed publishing item",` |
| 978 | P1-check: mutation/execution path; verify backend authority and confirmation | `why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,` |
| 979 | P1-check: mutation/execution path; verify backend authority and confirmation | `focusId: failed.id,` |
| 998 | Review | `if (handoff) {` |
| 1001 | Review | `why: "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",` |
| 1009 | Review | `why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,` |
| 1038 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>` |
| 1049 | Review | `["Workflow output", recommendation.action.includes("workflow") ? "Available" : "Optional"],` |
| 1076 | P1-check: mutation/execution path; verify backend authority and confirmation | `<button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>` |
| 1080 | P1-check: mutation/execution path; verify backend authority and confirmation | `<details class="publishing-automation-preview publishing-block-gap">` |
| 1089 | Review | `${getAutoModeState().status === "waiting_approval" ? `` |
| 1096 | Review | `</details>` |
| 1097 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>` |
| 1126 | P1-check: mutation/execution path; verify backend authority and confirmation | `<button class="publishing-queue-main" type="button" data-publishing-select="${escapeHtml(item.id)}">` |
| 1179 | P1-check: mutation/execution path; verify backend authority and confirmation | `<label class="setup-label" for="publishingCampaignInput">Campaign</label>` |
| 1182 | P1-check: mutation/execution path; verify backend authority and confirmation | `<input id="publishingCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(session.form.campaign)}" placeholder="Campaign or launch wave">` |
| 1183 | Review | `${fieldError(session, "campaign", escapeHtml)}` |
| 1206 | P1-check: mutation/execution path; verify backend authority and confirmation | `<input id="publishingContentInput" name="contentItem" class="setup-input" type="text" value="${escapeHtml(session.form.contentItem)}" placeholder="Caption, email, product update, or workflow output">` |
| 1252 | Review | `<span class="setup-field-state is-optional">Context</span>` |
| 1267 | Review | `function renderWorkflowHandoff(handoff, session, escapeHtml) {` |
| 1268 | Review | `if (!handoff) {` |
| 1273 | Review | `<div class="setup-kicker">Workflow Handoff</div>` |
| 1274 | Review | `<h3>No workflow output available</h3>` |
| 1283 | Review | `const summary = extractHandoffSummary(handoff);` |
| 1284 | Review | `const isLoaded = summary.id && summary.id === session.loadedHandoffId;` |
| 1286 | P1-check: mutation/execution path; verify backend authority and confirmation | `<section class="card publishing-card" id="publishingHandoffPanel">` |
| 1289 | Review | `<div class="setup-kicker">Workflow Handoff</div>` |
| 1291 | P1-check: mutation/execution path; verify backend authority and confirmation | `<p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>` |
| 1293 | Review | `<span class="card-badge ${isLoaded ? "success" : "neutral"}">${escapeHtml(isLoaded ? "Loaded" : "Available")}</span>` |
| 1298 | Review | `<div class="data-row"><span>Campaign</span><strong>${escapeHtml(summary.campaign \|\| "Not specified")}</strong></div>` |
| 1302 | P1-check: mutation/execution path; verify backend authority and confirmation | `<button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>` |
| 1376 | P1-check: mutation/execution path; verify backend authority and confirmation | `.filter((item) => item.executedAt \|\| item.status === "failed")` |
| 1378 | P1-check: mutation/execution path; verify backend authority and confirmation | `const failed = queue.filter((item) => item.status === "failed");` |
| 1380 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (!latest && !failed.length) {` |
| 1390 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="empty-box">Last publish result and failed publish blockers will appear here after execution data exists.</div>` |
| 1400 | P1-check: mutation/execution path; verify backend authority and confirmation | `<h3>${escapeHtml(latest ? latest.title : "Failed publish blockers")}</h3>` |
| 1402 | P1-check: mutation/execution path; verify backend authority and confirmation | `<span class="card-badge ${badgeTone(latest?.status \|\| "failed")}">${escapeHtml(latest ? titleCase(latest.status) : "Failed")}</span>` |
| 1411 | P1-check: mutation/execution path; verify backend authority and confirmation | `${failed.length ? `` |
| 1413 | P1-check: mutation/execution path; verify backend authority and confirmation | `${failed.map((item) => `` |
| 1414 | P1-check: mutation/execution path; verify backend authority and confirmation | `<div class="simple-banner">${escapeHtml(item.title)}: ${escapeHtml(normalizeNotes(item.notes).join("; ") \|\| "Failed publish needs review.")}</div>` |
| 1443 | Review | `const response = await action();` |
| 1444 | Review | `await reloadProjectData?.(projectName);` |
| 1448 | P1-check: mutation/execution path; verify backend authority and confirmation | `showError?.(error.message \|\| "Publishing action failed.");` |
| 1464 | P1-check: mutation/execution path; verify backend authority and confirmation | `failPublishingItem,` |
| 1467 | Review | `handoff` |
| 1471 | Review | `const projectName = state.context.currentProject \|\| "";` |
| 1498 | Review | `const response = await runAndRefresh(` |
| 1568 | Review | `await persistDraft();` |
| 1601 | Review | `? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."` |
| 1602 | Review | `: "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."` |
| 1613 | Review | `const response = await runAndRefresh(action, {` |
| 1625 | P1-check: mutation/execution path; verify backend authority and confirmation | `saveDraftLocally("Backend schedule unavailable; draft kept locally.");` |
| 1680 | Review | `await runAndRefresh(` |
| 1694 | Review | `await runAndRefresh(` |
| 1706 | Review | `"Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."` |
| 1713 | Review | `await runAndRefresh(` |
| 1747 | Review | `await runAndRefresh(` |
| 1755 | P1-check: mutation/execution path; verify backend authority and confirmation | `const failBtn = $("publishingFailBtn");` |
| 1756 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (failBtn) {` |
| ... | Truncated | 44 more hits not shown |

## Focused Excerpts Around Critical Hits

### public/control-center/pages/publishing.js:2
```js
    1: // --- UI/UX Consolidation Helpers ---
    2: function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
    3:   const context = [
    4:     projectName && `<span>Project: <strong>${escapeHtml(projectName)}</strong></span>`,
    5:     selectedItem?.campaign && `<span>Campaign: <strong>${escapeHtml(selectedItem.campaign)}</strong></span>`,
    6:     selectedItem?.channel && `<span>Channel: <strong>${escapeHtml(titleCase(selectedItem.channel))}</strong></span>`
    7:   ].filter(Boolean).join(' &middot; ');
```

### public/control-center/pages/publishing.js:11
```js
    6:     selectedItem?.channel && `<span>Channel: <strong>${escapeHtml(titleCase(selectedItem.channel))}</strong></span>`
    7:   ].filter(Boolean).join(' &middot; ');
    8:   const status = selectedItem ? titleCase(selectedItem.status) : "No item selected";
    9:   const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
   10:   const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
   11:   const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
   12:   const actions = [
   13:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
```

### public/control-center/pages/publishing.js:13
```js
    8:   const status = selectedItem ? titleCase(selectedItem.status) : "No item selected";
    9:   const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
   10:   const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
   11:   const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
   12:   const actions = [
   13:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
```

### public/control-center/pages/publishing.js:14
```js
    9:   const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
   10:   const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
   11:   const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
   12:   const actions = [
   13:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
```

### public/control-center/pages/publishing.js:15
```js
   10:   const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
   11:   const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
   12:   const actions = [
   13:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
```

### public/control-center/pages/publishing.js:16
```js
   11:   const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
   12:   const actions = [
   13:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
```

### public/control-center/pages/publishing.js:19
```js
   14:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
```

### public/control-center/pages/publishing.js:20
```js
   15:     `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
```

### public/control-center/pages/publishing.js:21
```js
   16:     `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
```

### public/control-center/pages/publishing.js:22
```js
   17:   ].join(' ');
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
   27:   `;
```

### public/control-center/pages/publishing.js:23
```js
   18:   return `
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
   27:   `;
   28: }
```

### public/control-center/pages/publishing.js:24
```js
   19:     <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
   27:   `;
   28: }
   29: 
```

### public/control-center/pages/publishing.js:25
```js
   20:       <div class="publishing-command-header-title">Publishing Control Workspace</div>
   21:       <div class="publishing-command-header-context">${context}</div>
   22:       <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
   23:       <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
   24:       <div class="publishing-command-header-safety">${safety}</div>
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
   27:   `;
   28: }
   29: 
   30: function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
```

### public/control-center/pages/publishing.js:30
```js
   25:       <div class="publishing-command-header-actions">${actions}</div>
   26:     </section>
   27:   `;
   28: }
   29: 
   30: function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
   31:   const steps = [
   32:     { key: "draft", label: "Draft" },
   33:     { key: "source", label: "Source" },
   34:     { key: "package", label: "Package" },
   35:     { key: "approval", label: "Approval" },
```

### public/control-center/pages/publishing.js:36
```js
   31:   const steps = [
   32:     { key: "draft", label: "Draft" },
   33:     { key: "source", label: "Source" },
   34:     { key: "package", label: "Package" },
   35:     { key: "approval", label: "Approval" },
   36:     { key: "schedule", label: "Schedule" },
   37:     { key: "handoff", label: "Manual Completion Handoff" }
   38:   ];
   39:   const statusMap = {
   40:     draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
   41:     source: selectedItem?.source ? "ready" : "missing",
```

### public/control-center/pages/publishing.js:43
```js
   38:   ];
   39:   const statusMap = {
   40:     draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
   41:     source: selectedItem?.source ? "ready" : "missing",
   42:     package: selectedItem ? "ready" : "missing",
   43:     approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
   44:     schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
   45:     handoff: selectedItem?.status === "published" ? "ready" : "missing"
   46:   };
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
```

### public/control-center/pages/publishing.js:44
```js
   39:   const statusMap = {
   40:     draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
   41:     source: selectedItem?.source ? "ready" : "missing",
   42:     package: selectedItem ? "ready" : "missing",
   43:     approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
   44:     schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
   45:     handoff: selectedItem?.status === "published" ? "ready" : "missing"
   46:   };
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
   49:       ${steps.map(step => `
```

### public/control-center/pages/publishing.js:45
```js
   40:     draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
   41:     source: selectedItem?.source ? "ready" : "missing",
   42:     package: selectedItem ? "ready" : "missing",
   43:     approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
   44:     schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
   45:     handoff: selectedItem?.status === "published" ? "ready" : "missing"
   46:   };
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
   49:       ${steps.map(step => `
   50:         <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
```

### public/control-center/pages/publishing.js:48
```js
   43:     approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
   44:     schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
   45:     handoff: selectedItem?.status === "published" ? "ready" : "missing"
   46:   };
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
   49:       ${steps.map(step => `
   50:         <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
   51:           <span>${escapeHtml(step.label)}</span>
   52:           <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
   53:         </div>
```

### public/control-center/pages/publishing.js:50
```js
   45:     handoff: selectedItem?.status === "published" ? "ready" : "missing"
   46:   };
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
   49:       ${steps.map(step => `
   50:         <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
   51:           <span>${escapeHtml(step.label)}</span>
   52:           <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
   53:         </div>
   54:       `).join('')}
   55:     </nav>
```

### public/control-center/pages/publishing.js:52
```js
   47:   return `
   48:     <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
   49:       ${steps.map(step => `
   50:         <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
   51:           <span>${escapeHtml(step.label)}</span>
   52:           <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
   53:         </div>
   54:       `).join('')}
   55:     </nav>
   56:   `;
   57: }
```

### public/control-center/pages/publishing.js:59
```js
   54:       `).join('')}
   55:     </nav>
   56:   `;
   57: }
   58: 
   59: function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {
   60:   const readiness = [
   61:     { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
   62:     { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
   63:     { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
   64:     { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
```

### public/control-center/pages/publishing.js:65
```js
   60:   const readiness = [
   61:     { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
   62:     { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
   63:     { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
   64:     { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
   65:     { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
   66:     { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
   67:     { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
```

### public/control-center/pages/publishing.js:66
```js
   61:     { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
   62:     { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
   63:     { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
   64:     { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
   65:     { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
   66:     { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
   67:     { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
```

### public/control-center/pages/publishing.js:67
```js
   62:     { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
   63:     { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
   64:     { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
   65:     { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
   66:     { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
   67:     { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
   72:       ${readiness.map(r => `
```

### public/control-center/pages/publishing.js:69
```js
   64:     { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
   65:     { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
   66:     { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
   67:     { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
   72:       ${readiness.map(r => `
   73:         <div class="publishing-readiness-card is-${r.state}">
   74:           <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
```

### public/control-center/pages/publishing.js:71
```js
   66:     { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
   67:     { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
   72:       ${readiness.map(r => `
   73:         <div class="publishing-readiness-card is-${r.state}">
   74:           <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
   75:           <span>${r.state}</span>
   76:         </div>
```

### public/control-center/pages/publishing.js:73
```js
   68:   ];
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
   72:       ${readiness.map(r => `
   73:         <div class="publishing-readiness-card is-${r.state}">
   74:           <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
   75:           <span>${r.state}</span>
   76:         </div>
   77:       `).join('')}
   78:       ${blockersSummary}
```

### public/control-center/pages/publishing.js:74
```js
   69:   const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
   70:   return `
   71:     <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
   72:       ${readiness.map(r => `
   73:         <div class="publishing-readiness-card is-${r.state}">
   74:           <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
   75:           <span>${r.state}</span>
   76:         </div>
   77:       `).join('')}
   78:       ${blockersSummary}
   79:     </section>
```

### public/control-center/pages/publishing.js:92
```js
   87: } from "../asset-library.js";
   88: import { getReadinessBlockers } from "../system-intelligence.js";
   89: import {
   90:   createAutoModeController,
   91:   getAutoModeState,
   92:   startAutoMode,
   93:   stopAutoMode,
   94:   approveCurrentGate,
   95:   skipCurrentStep,
   96:   subscribeAutoMode
   97: } from "../automation-engine.js";
```

# public/control-center/pages/workflows.js

- Lines: 2366

## AutoMode / automation
Hits: 31

| Line | Classification | Code |
|---:|---|---|
| 16 | Review | `createAutoModeController,` |
| 17 | Review | `getAutoModeState,` |
| 18 | P0-check: active automation execution/control reference | `startAutoMode,` |
| 19 | Review | `pauseAutoMode,` |
| 20 | P0-check: active automation execution/control reference | `resumeAutoMode,` |
| 21 | Review | `stopAutoMode,` |
| 22 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 23 | P0-check: active automation execution/control reference | `skipCurrentStep,` |
| 24 | Review | `subscribeAutoMode,` |
| 26 | P0-check: active automation execution/control reference | `runAutomationPlan` |
| 109 | Review | `let workflowAutoModeUnsubscribe = null;` |
| 652 | Review | `function renderAutomationSection(fullPlan, fixPlan, autoMode, escapeHtml) {` |
| 663 | Review | `const gate = asObject(autoMode?.approvalRequiredStep);` |
| 738 | Review | `Status: ${esc(autoMode?.status \|\| "idle")}` |
| 743 | Review | `asArray(autoMode?.currentPlan)[autoMode?.currentStepIndex]?.action \|\| "None"` |
| 748 | Review | `autoMode?.status === "waiting_approval"` |
| 770 | Review | `asArray(autoMode?.logs)` |
| 1222 | Review | `createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });` |
| 1223 | Review | `if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();` |
| 1224 | Review | `workflowAutoModeUnsubscribe = subscribeAutoMode(() => {` |
| 1662 | P0-check: active automation execution/control reference | `const result = await runAutomationPlan(plan, {` |
| 1691 | P0-check: active automation execution/control reference | `const stepResult = await runAutomationPlan(singleStep, {` |
| 1714 | Review | `createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });` |
| 1715 | Review | `if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();` |
| 1716 | Review | `workflowAutoModeUnsubscribe = subscribeAutoMode(() => {` |
| 1720 | P0-check: active automation execution/control reference | `await startAutoMode(plan, {` |
| 1731 | Review | `pauseAutoMode();` |
| 1739 | P0-check: active automation execution/control reference | `await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1747 | Review | `stopAutoMode();` |
| 1755 | P0-check: active automation execution/control reference | `await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1763 | P0-check: active automation execution/control reference | `await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |

## Execution / mutation verbs
Hits: 84

| Line | Classification | Code |
|---:|---|---|
| 22 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 55 | P1-check: mutation/execution path; verify backend authority and confirmation | `id: "prepare-publishing-package",` |
| 56 | P1-check: mutation/execution path; verify backend authority and confirmation | `title: "Prepare Publishing Package",` |
| 57 | P1-check: mutation/execution path; verify backend authority and confirmation | `purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",` |
| 60 | P1-check: mutation/execution path; verify backend authority and confirmation | `routeHint: "publishing"` |
| 92 | P1-check: mutation/execution path; verify backend authority and confirmation | `"Publishing",` |
| 174 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";` |
| 175 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";` |
| 184 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (runStatus === "failed") return "danger";` |
| 198 | P1-check: mutation/execution path; verify backend authority and confirmation | `...asArray(activity.scheduled_jobs).map((job) => asString(job.channel)),` |
| 242 | Review | `asString(operations?.backbone?.last_updated),` |
| 271 | Review | `function saveLocalDraft(projectName, workflowId, payload) {` |
| 278 | Review | `updatedAt: nowIso()` |
| 298 | Review | `if (draft.updatedAt) {` |
| 299 | Review | `session.draftStatus = `Draft restored ${formatDateTime(draft.updatedAt)}`;` |
| 306 | Review | `const saved = saveLocalDraft(projectName, workflowId, {` |
| 311 | Review | `session.draftStatus = hint \|\| `Draft saved ${formatDateTime(saved.updatedAt)}`;` |
| 458 | P1-check: mutation/execution path; verify backend authority and confirmation | `failed: 0,` |
| 467 | P1-check: mutation/execution path; verify backend authority and confirmation | `else if (normalized === "failed") counts.failed += 1;` |
| 476 | P1-check: mutation/execution path; verify backend authority and confirmation | `const when = asString(item.executed_at \|\| item.created_at);` |
| 492 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {` |
| 555 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (target === "publishing") return "prepare-publishing-package";` |
| 587 | P1-check: mutation/execution path; verify backend authority and confirmation | `workflowId: "prepare-publishing-package",` |
| 588 | P1-check: mutation/execution path; verify backend authority and confirmation | `title: "Prepare publishing package handoff before distribution",` |
| 589 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,` |
| 590 | P1-check: mutation/execution path; verify backend authority and confirmation | `chips: ["Publishing", "Campaign", "Launch readiness"],` |
| 591 | P1-check: mutation/execution path; verify backend authority and confirmation | `prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."` |
| 599 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",` |
| 610 | P1-check: mutation/execution path; verify backend authority and confirmation | `chips: ["Content", "Campaign", "Publishing"],` |
| 628 | P1-check: mutation/execution path; verify backend authority and confirmation | `<article class="wfexec-stat"><span>Failed / blocked</span><strong>${escapeHtml(String(metrics.failed))}</strong></article>` |
| 645 | Review | `<button id="wfexecSaveRecommendedBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>` |
| 757 | P1-check: mutation/execution path; verify backend authority and confirmation | `<button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 758 | P1-check: mutation/execution path; verify backend authority and confirmation | `Approve Automation Gate Only` |
| 816 | Review | `<button id="wfexecSaveDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>` |
| 820 | Review | `<div class="wfexec-draft-status">${escapeHtml(draftStatus \|\| "Drafts auto-save locally per workflow.")}</div>` |
| 846 | Review | `<button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>` |
| 891 | Review | `<button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Review Handoff</button>` |
| 964 | P1-check: mutation/execution path; verify backend authority and confirmation | `console.warn("Failed to consume workflow handoff:", error.message);` |
| 1015 | P1-check: mutation/execution path; verify backend authority and confirmation | `error: insightsResult.status === "rejected" && learningResult.status === "rejected"` |
| 1016 | P1-check: mutation/execution path; verify backend authority and confirmation | `? (insightsResult.reason?.message \|\| learningResult.reason?.message \|\| "Failed to load workflow intelligence")` |
| 1026 | P1-check: mutation/execution path; verify backend authority and confirmation | `error: error.message \|\| "Failed to load workflow intelligence",` |
| 1100 | P1-check: mutation/execution path; verify backend authority and confirmation | `console.warn("Failed to persist workflow-to-ai handoff:", error.message);` |
| 1118 | P2-check: lifecycle/listener/timer management | `window.addEventListener("mh:submit-workflow", async (event) => {` |
| 1196 | P1-check: mutation/execution path; verify backend authority and confirmation | `run.status = "failed";` |
| 1197 | P1-check: mutation/execution path; verify backend authority and confirmation | `showError?.(error.message \|\| "Workflow review package preparation failed.");` |
| 1249 | Review | `persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Draft auto-saved", true);` |
| 1271 | Review | `const saveDraftBtn = $("wfexecSaveDraftBtn");` |
| 1272 | Review | `if (saveDraftBtn) {` |
| 1273 | Review | `saveDraftBtn.onclick = () => {` |
| 1274 | Review | `persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Draft saved", true);` |
| 1275 | Review | `showMessage?.("Workflow draft saved.");` |
| 1337 | Review | ``Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`` |
| 1341 | Review | `async function runWorkflow(workflowId) {` |
| 1427 | P1-check: mutation/execution path; verify backend authority and confirmation | `activeRun.status = "failed";` |
| 1429 | P1-check: mutation/execution path; verify backend authority and confirmation | `title: `${activeWorkflow.title} failed`,` |
| 1430 | P1-check: mutation/execution path; verify backend authority and confirmation | `summary: error.message \|\| "Workflow review package preparation failed.",` |
| 1431 | P1-check: mutation/execution path; verify backend authority and confirmation | `blockedRequirements: ["Preparation failed. Review inputs and retry."],` |
| 1435 | P1-check: mutation/execution path; verify backend authority and confirmation | `showError?.(error.message \|\| "Workflow review package preparation failed.");` |
| 1442 | Review | `if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);` |
| 1444 | Review | `if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);` |
| 1450 | Review | `runWorkflow(rec.workflowId);` |
| 1454 | Review | `const saveRecommendedBtn = $("wfexecSaveRecommendedBtn");` |
| 1455 | Review | `if (saveRecommendedBtn) {` |
| 1456 | Review | `saveRecommendedBtn.onclick = () => {` |
| 1460 | Review | `persistWorkflowDraft(projectName, session, rec.workflowId, "Recommendation saved as draft", true);` |
| 1461 | Review | `showMessage?.("Recommended workflow saved as draft.");` |
| 1487 | Review | `button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") \|\| session.selectedWorkflowId);` |
| 1490 | Review | `Array.from(document.querySelectorAll("[data-wf-catalog-save]")).forEach((button) => {` |
| 1492 | Review | `const workflowId = button.getAttribute("data-wf-catalog-save") \|\| session.selectedWorkflowId;` |
| 1494 | Review | `persistWorkflowDraft(projectName, session, workflowId, "Draft saved", true);` |
| 1495 | Review | `showMessage?.("Workflow draft saved.");` |
| 1539 | Review | `const saveTaskBtn = $("workflowSaveTaskBtn");` |
| 1540 | Review | `if (saveTaskBtn) {` |
| 1541 | Review | `saveTaskBtn.onclick = () => {` |
| 1656 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);` |
| 1686 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");` |
| 1752 | P1-check: mutation/execution path; verify backend authority and confirmation | `const autoApproveBtn = $("workflowAutoApproveBtn");` |
| 1753 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (autoApproveBtn) {` |
| 1754 | P1-check: mutation/execution path; verify backend authority and confirmation | `autoApproveBtn.onclick = async () => {` |
| 1755 | P0-check: active automation execution/control reference | `await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1814 | P1-check: mutation/execution path; verify backend authority and confirmation | `publishing: "publishing",` |
| 2167 | P1-check: mutation/execution path; verify backend authority and confirmation | `<span>${escapeHtml(formatDateTime(item.created_at \|\| item.executed_at \|\| nowIso()))}</span>` |
| 2239 | Review | `stateModel.lastStatusText = "Prepared package updated and mirrored in the global AI bar.";` |
| 2263 | Review | `updatedAt: nowIso()` |

## Confirmation gates
Hits: 35

| Line | Classification | Code |
|---:|---|---|
| 22 | P0-check: active automation execution/control reference | `approveCurrentGate,` |
| 601 | Review | `prompt: "Create a launch campaign workflow with owner sequence and execution gates."` |
| 663 | Review | `const gate = asObject(autoMode?.approvalRequiredStep);` |
| 669 | Review | `Safe guided preparation only: navigate, create draft, generate prompt, and create review handoff.` |
| 719 | Review | `Guided preparation mode with automation gates and inline logs. It does not replace Governance approval.` |
| 751 | Review | `<strong>Automation gate needs operator review:</strong> ${esc(gate.reason \|\| "Operator review required.")}` |
| 754 | Review | `${esc(gate.whatWillHappen \|\| "Auto Mode is paused.")}` |
| 758 | P1-check: mutation/execution path; verify backend authority and confirmation | `Approve Automation Gate Only` |
| 1067 | Review | `navigateTo,` |
| 1104 | Review | `navigateTo("ai-command");` |
| 1209 | Review | `navigateTo,` |
| 1222 | Review | `createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });` |
| 1336 | Safety-positive: confirmation gate exists | `return window.confirm(` |
| 1478 | Review | `navigateTo,` |
| 1511 | Review | `navigateTo,` |
| 1528 | Review | `navigateTo,` |
| 1571 | Review | `navigateTo("task-center");` |
| 1607 | Review | `navigateTo("ai-command");` |
| 1643 | Review | `navigateTo("ai-command");` |
| 1656 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);` |
| 1663 | Review | `context: { getState, navigateTo, createProjectHandoff, projectName },` |
| 1686 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");` |
| 1692 | Review | `context: { getState, navigateTo, createProjectHandoff, projectName },` |
| 1714 | Review | `createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });` |
| 1722 | Review | `context: { getState, navigateTo, createProjectHandoff, projectName }` |
| 1739 | P0-check: active automation execution/control reference | `await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1755 | P0-check: active automation execution/control reference | `await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1756 | Review | `showMessage?.("Automation gate accepted. This is not a Governance approval.");` |
| 1763 | P0-check: active automation execution/control reference | `await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1786 | Review | `navigateTo,` |
| 2148 | Review | `<p class="mhos-destination-meta"><strong>Status</strong> Safe now · Destination tools own execution authority and Governance-gated actions remain protected</p>` |
| 2272 | Review | `navigateTo("ai-command");` |
| 2294 | Review | `navigateTo("campaign-studio");` |
| 2319 | Review | `navigateTo("task-center");` |
| 2347 | Review | `navigateTo(route);` |

## Backend/API calls
Hits: 54

| Line | Classification | Code |
|---:|---|---|
| 12 | Review | `} from "../shared-context.js";` |
| 41 | Review | `purpose: "Generate a review-ready content plan tied to campaign and audience context.",` |
| 203 | Review | `project: firstNonEmpty(context.currentProject, overview.project_name),` |
| 204 | Review | `campaign: firstNonEmpty(context.activeCampaign),` |
| 205 | Review | `product: firstNonEmpty(overview.project_name, context.currentProject),` |
| 436 | Review | `projectName: firstNonEmpty(state.context.currentProject, overview.project_name),` |
| 437 | Review | `campaignName: firstNonEmpty(state.context.activeCampaign),` |
| 475 | Review | `asArray(context.activity?.execution_results).forEach((item) => {` |
| 492 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {` |
| 493 | Review | `blocked.push(`Missing assets: ${context.missingAssets.slice(0, 4).join(", ")}`);` |
| 496 | Review | `if (workflow.id === "generate-report" && context.missingIntegrations.length) {` |
| 497 | Review | `blocked.push(`Data coverage gaps: ${context.missingIntegrations.slice(0, 3).join(", ")}`);` |
| 500 | Review | `if (workflow.id === "fix-integrations" && !context.missingIntegrations.length) {` |
| 511 | Review | ``Project: ${inputs.project \|\| context.projectName \|\| "not set"}`,` |
| 512 | Review | ``Campaign: ${inputs.campaign \|\| context.campaignName \|\| "not set"}`,` |
| 516 | Review | `context.readinessScore ? `Readiness: ${context.readinessScore}/100` : "Readiness: unknown",` |
| 517 | Review | `context.missingIntegrations.length ? `Missing integrations: ${context.missingIntegrations.join(", ")}` : "Missing integrations: none",` |
| 518 | Review | `context.missingAssets.length ? `Missing assets: ${context.missingAssets.join(", ")}` : "Missing assets: none"` |
| 523 | Review | `const recommendation = asObject(asArray(context.recommendations)[0]);` |
| 529 | Review | `summary: `Prepared ${workflow.title.toLowerCase()} for ${inputs.project \|\| context.projectName \|\| "the current project"} with ${inputs.goal \|\| "a defined goal"}.`,` |
| 575 | Review | `if (context.missingIntegrations.length) {` |
| 579 | Review | `reason: `${context.missingIntegrations.length} integration gap${context.missingIntegrations.length === 1 ? "" : "s"} can block automation and report quality.`,` |
| 585 | Review | `if (context.missingAssets.length) {` |
| 589 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,` |
| 595 | Review | `if (!context.campaignName) {` |
| 630 | Review | `<article class="wfexec-stat wfexec-stat-wide"><span>Readiness</span><strong>${escapeHtml(Number.isFinite(context.readinessScore) ? `${context.readinessScore}/100` : "Unknown")} · ${escapeHtml(context.readinessStatus \|\| "unclassified")}</strong></article>` |
| 974 | Review | `fetchProjectInsights,` |
| 975 | Review | `fetchProjectLearning,` |
| 1005 | Review | `fetchProjectInsights(projectName),` |
| 1006 | Review | `fetchProjectLearning(projectName)` |
| 1043 | Review | ``Project: ${inputs.project \|\| context.projectName \|\| "not set"}`,` |
| 1044 | Review | ``Campaign: ${inputs.campaign \|\| context.campaignName \|\| "not set"}`,` |
| 1051 | Review | ``Project: ${inputs.project \|\| context.projectName \|\| "not set"}`,` |
| 1052 | Review | ``Campaign: ${inputs.campaign \|\| context.campaignName \|\| "not set"}`,` |
| 1056 | Review | `context.missingIntegrations.length ? `Missing integrations: ${context.missingIntegrations.join(", ")}` : "Missing integrations: none",` |
| 1057 | Review | `context.missingAssets.length ? `Missing assets: ${context.missingAssets.join(", ")}` : "Missing assets: none"` |
| 1128 | Review | `fetchProjectInsights,` |
| 1129 | Review | `fetchProjectLearning,` |
| 1138 | Review | `const projectName = state.context.currentProject \|\| "";` |
| 1147 | Review | `campaign: firstNonEmpty(session.inputsByWorkflow[workflow.id].campaign, state.context.activeCampaign),` |
| 1148 | Review | `product: firstNonEmpty(session.inputsByWorkflow[workflow.id].product, state.context.currentProject)` |
| 1167 | Review | `fetchProjectInsights,` |
| 1168 | Review | `fetchProjectLearning,` |
| 1194 | Review | `showMessage?.(`${workflow.title} created from AI context.`);` |
| 1213 | Review | `fetchProjectInsights,` |
| 1214 | Review | `fetchProjectLearning,` |
| 1230 | Review | `const projectName = state.context.currentProject \|\| "";` |
| 1323 | Review | `campaign: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].campaign, state.context.activeCampaign),` |
| 1324 | Review | `product: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].product, state.context.currentProject),` |
| 1378 | Review | `fetchProjectInsights,` |
| 1379 | Review | `fetchProjectLearning,` |
| 1791 | Review | `const campaignName = asString(state.context.activeCampaign \|\| "");` |
| 1792 | Review | `const executionMode = asString(state.context.executionMode \|\| "");` |
| 2082 | Review | `<pre>${escapeHtml(preparedForSelected?.prompt \|\| "Package will include playbook, purpose, project, campaign, product, channel, goal, and destination context.")}</pre>` |

## Frontend authority words
Hits: 36

| Line | Classification | Code |
|---:|---|---|
| 181 | Review | `const runStatus = normalizeRunStatus(status);` |
| 182 | Review | `if (runStatus === "completed") return "success";` |
| 183 | Review | `if (runStatus === "running") return "warning";` |
| 184 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (runStatus === "failed") return "danger";` |
| 299 | Review | `session.draftStatus = `Draft restored ${formatDateTime(draft.updatedAt)}`;` |
| 311 | Review | `session.draftStatus = hint \|\| `Draft saved ${formatDateTime(saved.updatedAt)}`;` |
| 348 | Review | `session.draftStatus = asString(session.draftStatus);` |
| 719 | Review | `Guided preparation mode with automation gates and inline logs. It does not replace Governance approval.` |
| 748 | Review | `autoMode?.status === "waiting_approval"` |
| 955 | Review | `run.status = "completed";` |
| 985 | Review | `current.status === "ready" &&` |
| 1013 | Review | `insights: insightsResult.status === "fulfilled" ? insightsResult.value : null,` |
| 1014 | Review | `learning: learningResult.status === "fulfilled" ? learningResult.value : null,` |
| 1015 | P1-check: mutation/execution path; verify backend authority and confirmation | `error: insightsResult.status === "rejected" && learningResult.status === "rejected"` |
| 1152 | Review | `session.draftStatus = "AI prompt imported into workflow review builder";` |
| 1158 | Review | `run.status = "running";` |
| 1185 | Review | `run.status = "completed";` |
| 1196 | P1-check: mutation/execution path; verify backend authority and confirmation | `run.status = "failed";` |
| 1337 | Review | ``Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`` |
| 1368 | Review | `activeRun.status = "running";` |
| 1403 | Review | `activeRun.status = "completed";` |
| 1427 | P1-check: mutation/execution path; verify backend authority and confirmation | `activeRun.status = "failed";` |
| 1558 | Review | `owner_role: "admin",` |
| 1559 | Review | `assignee_role: "admin",` |
| 1656 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);` |
| 1670 | Review | `workflowAutomationState.result = result.status === "success" ? "Guided preparation simulation completed." : "Guided preparation simulation stopped before completion.";` |
| 1686 | Safety-positive: confirmation gate exists | `const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");` |
| 1756 | Review | `showMessage?.("Automation gate accepted. This is not a Governance approval.");` |
| 1764 | Review | `showMessage?.("Guided Preparation Mode skipped one automation step. This does not bypass Governance policy.");` |
| 1792 | Review | `const executionMode = asString(state.context.executionMode \|\| "");` |
| 1801 | Review | `const readinessStatus = firstNonEmpty(readinessRoot.readiness_status, overview.readiness_status, "Unknown");` |
| 1909 | Review | `if (status === "complete") return "is-complete";` |
| 1910 | Review | `if (status === "active") return "is-active";` |
| 1911 | Review | `if (status === "blocked") return "is-danger";` |
| 1925 | Review | `const sessionStatus = missing.length` |
| 2148 | Review | `<p class="mhos-destination-meta"><strong>Status</strong> Safe now · Destination tools own execution authority and Governance-gated actions remain protected</p>` |

## Timers/listeners
Hits: 1

| Line | Classification | Code |
|---:|---|---|
| 1118 | P2-check: lifecycle/listener/timer management | `window.addEventListener("mh:submit-workflow", async (event) => {` |

## DOM writes
Hits: 1

| Line | Classification | Code |
|---:|---|---|
| 1945 | P2-check: DOM rewrite; verify sanitized/static rendering | `root.innerHTML = `` |

## AI handoff / context
Hits: 379

| Line | Classification | Code |
|---:|---|---|
| 8 | Review | `getSharedAiDraft,` |
| 9 | Review | `getSharedHandoff,` |
| 10 | Review | `setSharedAiDraft,` |
| 11 | Review | `setSharedHandoff` |
| 12 | Review | `} from "../shared-context.js";` |
| 31 | Review | `id: "launch-campaign",` |
| 32 | Review | `title: "Launch Campaign",` |
| 33 | Review | `purpose: "Build a launch-ready review sequence across campaign, content, and distribution handoffs.",` |
| 34 | Review | `requiredInputs: ["project", "campaign", "product", "channel", "goal"],` |
| 35 | Review | `aiModeId: "strategist",` |
| 36 | Review | `routeHint: "campaign-studio"` |
| 41 | Review | `purpose: "Generate a review-ready content plan tied to campaign and audience context.",` |
| 42 | Review | `requiredInputs: ["project", "campaign", "product", "channel", "goal"],` |
| 43 | Review | `aiModeId: "writer",` |
| 49 | Review | `purpose: "Prepare media production inputs, format guidance, and downstream handoff steps.",` |
| 50 | Review | `requiredInputs: ["project", "campaign", "product", "channel", "goal"],` |
| 51 | Review | `aiModeId: "media",` |
| 58 | Review | `requiredInputs: ["project", "campaign", "channel", "goal"],` |
| 59 | Review | `aiModeId: "operations",` |
| 66 | Review | `requiredInputs: ["project", "campaign", "goal"],` |
| 67 | Review | `aiModeId: "analyst",` |
| 73 | Review | `purpose: "Create a competitor intelligence brief for positioning and campaign advantage.",` |
| 75 | Review | `aiModeId: "researcher",` |
| 83 | Review | `aiModeId: "operations",` |
| 91 | Review | `"Campaign",` |
| 98 | Review | `"launch-product": "launch-campaign",` |
| 99 | Review | `"generate-campaign": "launch-campaign",` |
| 101 | Review | `"build-ads": "launch-campaign"` |
| 107 | Review | `let lastWorkflowRenderContext = null;` |
| 175 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";` |
| 184 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (runStatus === "failed") return "danger";` |
| 193 | Review | `const context = asObject(state.context);` |
| 203 | Review | `project: firstNonEmpty(context.currentProject, overview.project_name),` |
| 204 | Review | `campaign: firstNonEmpty(context.activeCampaign),` |
| 205 | Review | `product: firstNonEmpty(overview.project_name, context.currentProject),` |
| 325 | Review | `lastAppliedHandoffId: "",` |
| 350 | Review | `session.lastAppliedHandoffId = asString(session.lastAppliedHandoffId);` |
| 402 | Review | `function buildWorkflowContext(state, session) {` |
| 436 | Review | `projectName: firstNonEmpty(state.context.currentProject, overview.project_name),` |
| 437 | Review | `campaignName: firstNonEmpty(state.context.activeCampaign),` |
| 452 | Review | `function buildOverviewMetrics(session, context) {` |
| 458 | P1-check: mutation/execution path; verify backend authority and confirmation | `failed: 0,` |
| 467 | P1-check: mutation/execution path; verify backend authority and confirmation | `else if (normalized === "failed") counts.failed += 1;` |
| 475 | Review | `asArray(context.activity?.execution_results).forEach((item) => {` |
| 485 | Review | `function getBlockedRequirements(workflow, inputs, context) {` |
| 492 | P1-check: mutation/execution path; verify backend authority and confirmation | `if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {` |
| 493 | Review | `blocked.push(`Missing assets: ${context.missingAssets.slice(0, 4).join(", ")}`);` |
| 496 | Review | `if (workflow.id === "generate-report" && context.missingIntegrations.length) {` |
| 497 | Review | `blocked.push(`Data coverage gaps: ${context.missingIntegrations.slice(0, 3).join(", ")}`);` |
| 500 | Review | `if (workflow.id === "fix-integrations" && !context.missingIntegrations.length) {` |
| 507 | Review | `function buildWorkflowPrompt(workflow, inputs, context) {` |
| 511 | Review | ``Project: ${inputs.project \|\| context.projectName \|\| "not set"}`,` |
| 512 | Review | ``Campaign: ${inputs.campaign \|\| context.campaignName \|\| "not set"}`,` |
| 516 | Review | `context.readinessScore ? `Readiness: ${context.readinessScore}/100` : "Readiness: unknown",` |
| 517 | Review | `context.missingIntegrations.length ? `Missing integrations: ${context.missingIntegrations.join(", ")}` : "Missing integrations: none",` |
| 518 | Review | `context.missingAssets.length ? `Missing assets: ${context.missingAssets.join(", ")}` : "Missing assets: none"` |
| 522 | Review | `function buildFallbackOutput(workflow, inputs, context) {` |
| 523 | Review | `const recommendation = asObject(asArray(context.recommendations)[0]);` |
| 525 | Review | `const blockedRequirements = getBlockedRequirements(workflow, inputs, context);` |
| 529 | Review | `summary: `Prepared ${workflow.title.toLowerCase()} for ${inputs.project \|\| context.projectName \|\| "the current project"} with ${inputs.goal \|\| "a defined goal"}.`,` |
| 532 | Review | ``Open ${titleCase(workflow.routeHint)} for review handoff.`,` |
| 533 | Review | `blockedRequirements.length ? "Resolve blockers before any destination-owned execution." : "Proceed to review handoff."` |
| 544 | Review | `label: "Open AI Workspace",` |
| 545 | Review | `route: "ai-command",` |
| 546 | Review | `reason: "Refine this workflow package with AI reasoning."` |
| 558 | Review | `if (target === "setup" \|\| target === "campaign-studio") return "launch-campaign";` |
| 562 | Review | `function buildSmartRecommendation(context, session, globalAction) {` |
| 570 | Review | `chips: ["Launch readiness", "Automation", "Campaign"],` |
| 571 | Review | `prompt: firstNonEmpty(globalAction?.draftPayload?.prompt, `Build a ${mapped.title.toLowerCase()} review plan from current system blockers and dependencies.`)` |
| 575 | Review | `if (context.missingIntegrations.length) {` |
| 579 | Review | `reason: `${context.missingIntegrations.length} integration gap${context.missingIntegrations.length === 1 ? "" : "s"} can block automation and report quality.`,` |
| 581 | Review | `prompt: "Build a prioritized integration recovery workflow with dependency order and expected readiness impact."` |
| 585 | Review | `if (context.missingAssets.length) {` |
| 588 | P1-check: mutation/execution path; verify backend authority and confirmation | `title: "Prepare publishing package handoff before distribution",` |
| 589 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,` |
| 590 | P1-check: mutation/execution path; verify backend authority and confirmation | `chips: ["Publishing", "Campaign", "Launch readiness"],` |
| 591 | P1-check: mutation/execution path; verify backend authority and confirmation | `prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."` |
| 595 | Review | `if (!context.campaignName) {` |
| 597 | Review | `workflowId: "launch-campaign",` |
| 598 | Review | `title: "Define launch campaign workflow",` |
| 599 | P1-check: mutation/execution path; verify backend authority and confirmation | `reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",` |
| 600 | Review | `chips: ["Campaign", "Launch readiness", "Automation"],` |
| 601 | Review | `prompt: "Create a launch campaign workflow with owner sequence and execution gates."` |
| 609 | Review | `reason: "Current context is sufficient to prepare the selected workflow review package now.",` |
| 610 | P1-check: mutation/execution path; verify backend authority and confirmation | `chips: ["Content", "Campaign", "Publishing"],` |
| 611 | Review | `prompt: `Refine ${selected.title.toLowerCase()} for reviewed handoff with explicit dependencies and next actions.`` |
| 620 | Review | `function renderOverviewSection(metrics, context, escapeHtml) {` |
| 628 | P1-check: mutation/execution path; verify backend authority and confirmation | `<article class="wfexec-stat"><span>Failed / blocked</span><strong>${escapeHtml(String(metrics.failed))}</strong></article>` |
| 630 | Review | `<article class="wfexec-stat wfexec-stat-wide"><span>Readiness</span><strong>${escapeHtml(Number.isFinite(context.readinessScore) ? `${context.readinessScore}/100` : "Unknown")} · ${escapeHtml(context.readinessStatus \|\| "unclassified")}</strong></article>` |
| 646 | Review | `<button id="wfexecSendRecommendedAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI Workspace</button>` |
| 669 | Review | `Safe guided preparation only: navigate, create draft, generate prompt, and create review handoff.` |
| 694 | Review | `: `<div class="wfexec-empty">No safe automation steps are available.</div>`` |
| 748 | Review | `autoMode?.status === "waiting_approval"` |
| 796 | Review | `<label class="wfexec-label" for="wfexecInputCampaign">Campaign</label>` |
| 797 | Review | `<input id="wfexecInputCampaign" class="wfexec-input" data-wf-input="campaign" type="text" value="${escapeHtml(inputs.campaign \|\| "")}" placeholder="Campaign name">` |
| 815 | Review | `<button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>` |
| 817 | Review | `<button id="wfexecLoadAiStateBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Load AI Command State</button>` |
| 825 | Review | `function renderCatalogSection(session, context, escapeHtml) {` |
| 833 | Review | `const blocked = getBlockedRequirements(workflow, inputs, context);` |
| 847 | Review | `<button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>` |
| 889 | Review | `<button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI for Review</button>` |
| 890 | Review | `<button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>` |
| 891 | Review | `<button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Review Handoff</button>` |
| 902 | Review | `context,` |
| 915 | Review | `${renderOverviewSection(metrics, context, escapeHtml)}` |
| 923 | Review | `${renderCatalogSection(session, context, escapeHtml)}` |
| 931 | Review | `function applyDurableWorkflowHandoff({ projectName, session, operations, consumeProjectHandoff, showMessage }) {` |
| 932 | Review | `const handoff = getSharedHandoff(projectName, "workflows", operations);` |
| 933 | Review | `const handoffId = asString(handoff?.id);` |
| 934 | Review | `if (!handoffId \|\| handoffId === asString(session.lastAppliedHandoffId)) return;` |
| 936 | Review | `const payload = asObject(handoff?.payload);` |
| 938 | Review | `const modeId = asString(payload?.draft_context?.modeId);` |
| 939 | Review | `const modeMapped = WORKFLOW_CATALOG.find((item) => item.aiModeId === modeId)?.id;` |
| 945 | Review | `project: firstNonEmpty(payload?.draft_context?.projectName, session.inputsByWorkflow[workflowId].project),` |
| 946 | Review | `campaign: firstNonEmpty(payload?.campaign_name, session.inputsByWorkflow[workflowId].campaign),` |
| 947 | Review | `goal: firstNonEmpty(payload?.draft_context?.lastResponseTitle, payload?.workflow_title, session.inputsByWorkflow[workflowId].goal),` |
| 957 | Review | `run.source = "handoff";` |
| 962 | Review | `session.lastAppliedHandoffId = handoffId;` |
| 963 | Review | `consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {` |
| 964 | P1-check: mutation/execution path; verify backend authority and confirmation | `console.warn("Failed to consume workflow handoff:", error.message);` |
| ... | Truncated | 259 more hits not shown |

## Focused Excerpts Around Critical Hits

### public/control-center/pages/workflows.js:18
```js
   13: import { getGlobalNextBestAction } from "../system-intelligence.js";
   14: import {
   15:   buildAutomationPlan,
   16:   createAutoModeController,
   17:   getAutoModeState,
   18:   startAutoMode,
   19:   pauseAutoMode,
   20:   resumeAutoMode,
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
```

### public/control-center/pages/workflows.js:20
```js
   15:   buildAutomationPlan,
   16:   createAutoModeController,
   17:   getAutoModeState,
   18:   startAutoMode,
   19:   pauseAutoMode,
   20:   resumeAutoMode,
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
   24:   subscribeAutoMode,
   25:   getAutoFixPlan,
```

### public/control-center/pages/workflows.js:22
```js
   17:   getAutoModeState,
   18:   startAutoMode,
   19:   pauseAutoMode,
   20:   resumeAutoMode,
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
   24:   subscribeAutoMode,
   25:   getAutoFixPlan,
   26:   runAutomationPlan
   27: } from "../automation-engine.js";
```

### public/control-center/pages/workflows.js:23
```js
   18:   startAutoMode,
   19:   pauseAutoMode,
   20:   resumeAutoMode,
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
   24:   subscribeAutoMode,
   25:   getAutoFixPlan,
   26:   runAutomationPlan
   27: } from "../automation-engine.js";
   28: 
```

### public/control-center/pages/workflows.js:26
```js
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
   24:   subscribeAutoMode,
   25:   getAutoFixPlan,
   26:   runAutomationPlan
   27: } from "../automation-engine.js";
   28: 
   29: const WORKFLOW_CATALOG = [
   30:   {
   31:     id: "launch-campaign",
```

### public/control-center/pages/workflows.js:55
```js
   50:     requiredInputs: ["project", "campaign", "product", "channel", "goal"],
   51:     aiModeId: "media",
   52:     routeHint: "media-studio"
   53:   },
   54:   {
   55:     id: "prepare-publishing-package",
   56:     title: "Prepare Publishing Package",
   57:     purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
   58:     requiredInputs: ["project", "campaign", "channel", "goal"],
   59:     aiModeId: "operations",
   60:     routeHint: "publishing"
```

### public/control-center/pages/workflows.js:56
```js
   51:     aiModeId: "media",
   52:     routeHint: "media-studio"
   53:   },
   54:   {
   55:     id: "prepare-publishing-package",
   56:     title: "Prepare Publishing Package",
   57:     purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
   58:     requiredInputs: ["project", "campaign", "channel", "goal"],
   59:     aiModeId: "operations",
   60:     routeHint: "publishing"
   61:   },
```

### public/control-center/pages/workflows.js:57
```js
   52:     routeHint: "media-studio"
   53:   },
   54:   {
   55:     id: "prepare-publishing-package",
   56:     title: "Prepare Publishing Package",
   57:     purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
   58:     requiredInputs: ["project", "campaign", "channel", "goal"],
   59:     aiModeId: "operations",
   60:     routeHint: "publishing"
   61:   },
   62:   {
```

### public/control-center/pages/workflows.js:60
```js
   55:     id: "prepare-publishing-package",
   56:     title: "Prepare Publishing Package",
   57:     purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
   58:     requiredInputs: ["project", "campaign", "channel", "goal"],
   59:     aiModeId: "operations",
   60:     routeHint: "publishing"
   61:   },
   62:   {
   63:     id: "generate-report",
   64:     title: "Generate Report",
   65:     purpose: "Summarize workflow state, results, blockers, and the next operational decision.",
```

### public/control-center/pages/workflows.js:92
```js
   87: 
   88: const IMPACT_CHIPS = [
   89:   "Launch readiness",
   90:   "Content",
   91:   "Campaign",
   92:   "Publishing",
   93:   "Automation",
   94:   "Reports"
   95: ];
   96: 
   97: const WORKFLOW_ID_ALIASES = {
```

### public/control-center/pages/workflows.js:174
```js
  169:   }).format(date);
  170: }
  171: 
  172: function normalizeRunStatus(status) {
  173:   const normalized = asString(status).trim().toLowerCase();
  174:   if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
  175:   if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";
  176:   if (["completed", "success", "done", "ready"].includes(normalized)) return "completed";
  177:   return "draft";
  178: }
  179: 
```

### public/control-center/pages/workflows.js:175
```js
  170: }
  171: 
  172: function normalizeRunStatus(status) {
  173:   const normalized = asString(status).trim().toLowerCase();
  174:   if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
  175:   if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";
  176:   if (["completed", "success", "done", "ready"].includes(normalized)) return "completed";
  177:   return "draft";
  178: }
  179: 
  180: function statusTone(status) {
```

### public/control-center/pages/workflows.js:184
```js
  179: 
  180: function statusTone(status) {
  181:   const runStatus = normalizeRunStatus(status);
  182:   if (runStatus === "completed") return "success";
  183:   if (runStatus === "running") return "warning";
  184:   if (runStatus === "failed") return "danger";
  185:   return "neutral";
  186: }
  187: 
  188: function getWorkflowDef(id) {
  189:   return WORKFLOW_CATALOG.find((item) => item.id === id) || WORKFLOW_CATALOG[0];
```

### public/control-center/pages/workflows.js:198
```js
  193:   const context = asObject(state.context);
  194:   const overview = asObject(state.data.overview?.overview);
  195:   const activity = asObject(state.data.activity);
  196: 
  197:   const channels = uniqueStrings([
  198:     ...asArray(activity.scheduled_jobs).map((job) => asString(job.channel)),
  199:     ...asArray(overview.channels)
  200:   ]).join(", ");
  201: 
  202:   return {
  203:     project: firstNonEmpty(context.currentProject, overview.project_name),
```

### public/control-center/pages/workflows.js:458
```js
  453:   const allRuns = Object.values(asObject(session.runsByWorkflow));
  454:   const counts = {
  455:     total: WORKFLOW_CATALOG.length,
  456:     ready: 0,
  457:     draft: 0,
  458:     failed: 0,
  459:     running: 0,
  460:     lastExecutionAt: ""
  461:   };
  462: 
  463:   allRuns.forEach((run) => {
```

### public/control-center/pages/workflows.js:467
```js
  462: 
  463:   allRuns.forEach((run) => {
  464:     const normalized = normalizeRunStatus(run.status);
  465:     if (normalized === "completed") counts.ready += 1;
  466:     else if (normalized === "running") counts.running += 1;
  467:     else if (normalized === "failed") counts.failed += 1;
  468:     else counts.draft += 1;
  469: 
  470:     if (asString(run.lastRunAt) && (!counts.lastExecutionAt || Date.parse(run.lastRunAt) > Date.parse(counts.lastExecutionAt))) {
  471:       counts.lastExecutionAt = run.lastRunAt;
  472:     }
```

### public/control-center/pages/workflows.js:476
```js
  471:       counts.lastExecutionAt = run.lastRunAt;
  472:     }
  473:   });
  474: 
  475:   asArray(context.activity?.execution_results).forEach((item) => {
  476:     const when = asString(item.executed_at || item.created_at);
  477:     if (when && (!counts.lastExecutionAt || Date.parse(when) > Date.parse(counts.lastExecutionAt))) {
  478:       counts.lastExecutionAt = when;
  479:     }
  480:   });
  481: 
```

### public/control-center/pages/workflows.js:492
```js
  487:   const missingRequired = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
  488:   if (missingRequired.length) {
  489:     blocked.push(`Missing required inputs: ${missingRequired.map(titleCase).join(", ")}`);
  490:   }
  491: 
  492:   if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {
  493:     blocked.push(`Missing assets: ${context.missingAssets.slice(0, 4).join(", ")}`);
  494:   }
  495: 
  496:   if (workflow.id === "generate-report" && context.missingIntegrations.length) {
  497:     blocked.push(`Data coverage gaps: ${context.missingIntegrations.slice(0, 3).join(", ")}`);
```

### public/control-center/pages/workflows.js:555
```js
  550: }
  551: 
  552: function mapGlobalActionToWorkflowId(globalAction) {
  553:   const target = asString(globalAction?.targetPage).trim().toLowerCase();
  554:   if (target === "integrations") return "fix-integrations";
  555:   if (target === "publishing") return "prepare-publishing-package";
  556:   if (target === "content-studio") return "create-content-plan";
  557:   if (target === "media-studio") return "build-media-job";
  558:   if (target === "setup" || target === "campaign-studio") return "launch-campaign";
  559:   return "";
  560: }
```

### public/control-center/pages/workflows.js:587
```js
  582:     };
  583:   }
  584: 
  585:   if (context.missingAssets.length) {
  586:     return {
  587:       workflowId: "prepare-publishing-package",
  588:       title: "Prepare publishing package handoff before distribution",
  589:       reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
  590:       chips: ["Publishing", "Campaign", "Launch readiness"],
  591:       prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
  592:     };
```

### public/control-center/pages/workflows.js:588
```js
  583:   }
  584: 
  585:   if (context.missingAssets.length) {
  586:     return {
  587:       workflowId: "prepare-publishing-package",
  588:       title: "Prepare publishing package handoff before distribution",
  589:       reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
  590:       chips: ["Publishing", "Campaign", "Launch readiness"],
  591:       prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
  592:     };
  593:   }
```

### public/control-center/pages/workflows.js:589
```js
  584: 
  585:   if (context.missingAssets.length) {
  586:     return {
  587:       workflowId: "prepare-publishing-package",
  588:       title: "Prepare publishing package handoff before distribution",
  589:       reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
  590:       chips: ["Publishing", "Campaign", "Launch readiness"],
  591:       prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
  592:     };
  593:   }
  594: 
```

### public/control-center/pages/workflows.js:590
```js
  585:   if (context.missingAssets.length) {
  586:     return {
  587:       workflowId: "prepare-publishing-package",
  588:       title: "Prepare publishing package handoff before distribution",
  589:       reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
  590:       chips: ["Publishing", "Campaign", "Launch readiness"],
  591:       prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
  592:     };
  593:   }
  594: 
  595:   if (!context.campaignName) {
```

### public/control-center/pages/workflows.js:591
```js
  586:     return {
  587:       workflowId: "prepare-publishing-package",
  588:       title: "Prepare publishing package handoff before distribution",
  589:       reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
  590:       chips: ["Publishing", "Campaign", "Launch readiness"],
  591:       prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
  592:     };
  593:   }
  594: 
  595:   if (!context.campaignName) {
  596:     return {
```

### public/control-center/pages/workflows.js:599
```js
  594: 
  595:   if (!context.campaignName) {
  596:     return {
  597:       workflowId: "launch-campaign",
  598:       title: "Define launch campaign workflow",
  599:       reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",
  600:       chips: ["Campaign", "Launch readiness", "Automation"],
  601:       prompt: "Create a launch campaign workflow with owner sequence and execution gates."
  602:     };
  603:   }
  604: 
```

### public/control-center/pages/workflows.js:610
```js
  605:   const selected = getWorkflowDef(session.selectedWorkflowId);
  606:   return {
  607:     workflowId: selected.id,
  608:     title: `Continue with ${selected.title}`,
  609:     reason: "Current context is sufficient to prepare the selected workflow review package now.",
  610:     chips: ["Content", "Campaign", "Publishing"],
  611:     prompt: `Refine ${selected.title.toLowerCase()} for reviewed handoff with explicit dependencies and next actions.`
  612:   };
  613: }
  614: 
  615: function renderImpactChips(activeLabels, escapeHtml) {
```

### public/control-center/pages/workflows.js:628
```js
  623:       <div class="wfexec-head"><h3>Workflow Overview</h3></div>
  624:       <div class="wfexec-overview-grid">
  625:         <article class="wfexec-stat"><span>Total workflows</span><strong>${escapeHtml(String(metrics.total))}</strong></article>
  626:         <article class="wfexec-stat"><span>Ready workflows</span><strong>${escapeHtml(String(metrics.ready))}</strong></article>
  627:         <article class="wfexec-stat"><span>Draft workflows</span><strong>${escapeHtml(String(metrics.draft))}</strong></article>
  628:         <article class="wfexec-stat"><span>Failed / blocked</span><strong>${escapeHtml(String(metrics.failed))}</strong></article>
  629:         <article class="wfexec-stat wfexec-stat-wide"><span>Last prepared output</span><strong>${escapeHtml(metrics.lastExecutionAt ? formatDateTime(metrics.lastExecutionAt) : "No prepared output yet")}</strong></article>
  630:         <article class="wfexec-stat wfexec-stat-wide"><span>Readiness</span><strong>${escapeHtml(Number.isFinite(context.readinessScore) ? `${context.readinessScore}/100` : "Unknown")} · ${escapeHtml(context.readinessStatus || "unclassified")}</strong></article>
  631:       </div>
  632:     </section>
  633:   `;
```

### public/control-center/pages/workflows.js:757
```js
  752:             </div>
  753:             <div class="wfexec-meta">
  754:               ${esc(gate.whatWillHappen || "Auto Mode is paused.")}
  755:             </div>
  756:             <div class="wfexec-action-row">
  757:               <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
  758:                 Approve Automation Gate Only
  759:               </button>
  760:               <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
  761:                 Skip Automation Step
  762:               </button>
```

### public/control-center/pages/workflows.js:758
```js
  753:             <div class="wfexec-meta">
  754:               ${esc(gate.whatWillHappen || "Auto Mode is paused.")}
  755:             </div>
  756:             <div class="wfexec-action-row">
  757:               <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
  758:                 Approve Automation Gate Only
  759:               </button>
  760:               <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
  761:                 Skip Automation Step
  762:               </button>
  763:             </div>
```

### public/control-center/pages/workflows.js:964
```js
  959:     run.history = run.history.slice(0, 8);
  960:   }
  961: 
  962:   session.lastAppliedHandoffId = handoffId;
  963:   consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
  964:     console.warn("Failed to consume workflow handoff:", error.message);
  965:   });
  966:   showMessage?.("Workflow context restored from shared handoff.");
  967: }
  968: 
  969: async function ensureWorkflowIntelligenceLoaded({
```

