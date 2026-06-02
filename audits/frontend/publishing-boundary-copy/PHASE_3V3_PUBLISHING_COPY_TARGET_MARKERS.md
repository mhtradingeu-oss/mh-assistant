# PHASE 3V.3 — Publishing Copy Target Markers

## Candidate risky copy strings
9:  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
11:  const safety = `Publishing prepares channel packages, schedules, and approval-ready handoffs. Final execution remains <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
13:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
22:      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
35:    { key: "approval", label: "Approval" },
36:    { key: "schedule", label: "Schedule" },
37:    { key: "handoff", label: "Execution Handoff" }
43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
44:    schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
65:    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
67:    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
99:  buildSchedulePayload,
106:const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
107:const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
109:const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];
130:function schedulePublishingRender(render) {
172:    schedulePublishingRender();
229:function formatDateTime(value, fallback = "Not scheduled") {
242:  if (!date) return "Unscheduled";
272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
273:  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
274:    return "needs approval";
276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
284:  if (status === "published") return "success";
285:  if (status === "ready" || status === "scheduled") return "warning";
357:    approvalStatus: "draft",
403:  const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);
404:  const status = normalizeStatus(raw.execution_status || raw.status, scheduledFor ? "scheduled" : "draft");
414:    scheduledFor,
418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
444:  const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {
453:      latest ? "Scheduled job + result" : "Scheduled job"
457:  const knownIds = new Set(scheduledItems.map((item) => item.jobId));
463:  const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));
466:  return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);
473:    "needs approval": 2,
474:    scheduled: 3,
476:    published: 5
481:  const aTime = toDate(a.scheduledFor || a.updatedAt || a.createdAt)?.getTime() || 0;
482:  const bTime = toDate(b.scheduledFor || b.updatedAt || b.createdAt)?.getTime() || 0;
515:    .filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))
516:    .sort((a, b) => (toDate(a.scheduledFor)?.getTime() || 0) - (toDate(b.scheduledFor)?.getTime() || 0))[0];
517:  return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";
529:    publishDate: toDateInput(item.scheduledFor),
530:    publishTime: toTimeInput(item.scheduledFor),
531:    approvalStatus: item.approvalStatus || "draft",
558:function buildScheduleTime(form) {
588:      action: "Publish now to external channels",
591:        reason: "Publishing is gated and requires manual approval."
606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
609:  if (intent === "publish" && form.approvalStatus !== "approved") {
610:    errors.approvalStatus = "Approval must be approved before publishing now.";
647:  // Add governance/approval hints for status pills
649:  if (status === "needs approval") {
652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
653:  } else if (status === "scheduled") {
874:      .publishing-status-pill.is-scheduled {
878:      .publishing-status-pill.is-published {
970:  const needsApproval = queue.find((item) => item.status === "needs approval");
978:      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
986:      why: `${ready.title} is approved and ready for execution. Publishing now converts completed workflow output into a live action.`,
992:      action: "Review approval queue",
993:      why: `${needsApproval.title} needs approval before it can move into the publishable queue.`,
1008:      action: "Complete and schedule a draft",
1009:      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
1036:        <div class="publishing-overview-item"><span>Ready to publish</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
1047:    ["Launch readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
1048:    ["Content", counts.draft || counts.ready || counts.scheduled ? "Present" : "Empty"],
1051:    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
1052:    ["Automation", counts.scheduled ? "Scheduled" : "Manual"]
1082:        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
1089:        ${getAutoModeState().status === "waiting_approval" ? `
1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
1128:          <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "Unscheduled")} • ${escapeHtml(item.source)}</span>
1133:          <button type="button" data-publishing-action="schedule" data-publishing-id="${escapeHtml(item.id)}">Queue for Manual Publishing</button>
1134:          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
1136:          <button type="button" data-publishing-action="retry" data-publishing-id="${escapeHtml(item.id)}">Retry scheduled item</button>
1163:          <h3>Draft, validate, schedule, and execute</h3>
1215:              <span class="setup-field-state is-optional">Queue for Manual Publishing</span>
1232:            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
1234:                <option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>
1237:            ${fieldError(session, "approvalStatus", escapeHtml)}
1260:        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
1310:  const scheduled = queue.filter((item) => item.scheduledFor);
1311:  const future = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() > now);
1312:  const past = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() <= now);
1320:            <h3>No scheduled window</h3>
1324:        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
1335:            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
1336:            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
1347:        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
1350:            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
1351:            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
1365:          <h3>${future.length ? "Upcoming scheduled items" : "Past scheduled items — reschedule required"}</h3>
1460:  savePublishingSchedule,
1461:  reschedulePublishingItem,
1477:    schedulePublishingRender(render);
1497:    if (typeof savePublishingSchedule === "function") {
1499:        () => savePublishingSchedule(projectName, buildSchedulePayload(session, "draft")),
1573:  const scheduleBtn = $("publishingScheduleBtn");
1574:  if (scheduleBtn) {
1575:    scheduleBtn.onclick = async () => {
1577:      if (!validateBuilder(session, "schedule")) {
1583:      const payload = buildSchedulePayload(session, "scheduled");
1590:          ...buildLocalDraftPayload(session, "scheduled"),
1593:        session.draftMessage = "Local publishing draft scheduled in this browser.";
1601:          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
1602:          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
1610:        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
1611:        : () => savePublishingSchedule(projectName, payload);
1618:        successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
1625:        saveDraftLocally("Backend schedule unavailable; draft kept locally.");
1646:      if (action === "schedule") {
1659:        const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
1661:        session.draftMessage = `Local draft ${action === "publish" ? "marked published" : action === "pause" ? "paused" : "updated"}.`;
1674:          "Final Confirmation Required\n\nAction: Publish this item to configured channels.\n\nThis is a high-risk, final step. Please verify channel, source, schedule, and approval status.\n\nPublishing is always confirmation-gated and governed by backend approval rules.\nApproval and governance gates must be satisfied before execution.\n\nSelect Cancel to keep this item in the queue."
1682:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as published." }
1695:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
1714:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
1731:      session.form.approvalStatus = "approved";
1733:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
1734:        showMessage?.("Local publishing draft approved.");
1740:        "Confirm approval\n\nAction: Mark this backend publishing item ready for publishing.\n\nApproval moves the item toward publishable readiness and remains governed by backend rules.\n\nSelect Cancel to keep the item unchanged."
1749:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item approved and marked ready." }
1838:            scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
1867:        mode: "auto_until_approval",
1871:        schedulePublishingRender(render);
1914:    description: "Review, approve, schedule, and control publishing with clear previews and real backend actions."
1930:    savePublishingSchedule,
1931:    reschedulePublishingItem,
1970:      ${renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers: assetBlockers, approvalState: selectedItem?.approvalStatus, escapeHtml })}
1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare Governance Review. Confirmation required before execution. Backend approval rules apply.">Mark item ready for publishing</button>
2012:      savePublishingSchedule,
2013:      reschedulePublishingItem,
2026:        savePublishingSchedule,
2027:        reschedulePublishingItem,

## Relevant rendering ranges

### Header/workflow/readiness
// --- UI/UX Consolidation Helpers ---
function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
  const context = [
    projectName && `<span>Project: <strong>${escapeHtml(projectName)}</strong></span>`,
    selectedItem?.campaign && `<span>Campaign: <strong>${escapeHtml(selectedItem.campaign)}</strong></span>`,
    selectedItem?.channel && `<span>Channel: <strong>${escapeHtml(titleCase(selectedItem.channel))}</strong></span>`
  ].filter(Boolean).join(' &middot; ');
  const status = selectedItem ? titleCase(selectedItem.status) : "No item selected";
  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
  const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
  const safety = `Publishing prepares channel packages, schedules, and approval-ready handoffs. Final execution remains <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
  const actions = [
    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
  ].join(' ');
  return `
    <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
      <div class="publishing-command-header-title">Publishing Control Workspace</div>
      <div class="publishing-command-header-context">${context}</div>
      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
      <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
      <div class="publishing-command-header-safety">${safety}</div>
      <div class="publishing-command-header-actions">${actions}</div>
    </section>
  `;
}

function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
  const steps = [
    { key: "draft", label: "Draft" },
    { key: "source", label: "Source" },
    { key: "package", label: "Package" },
    { key: "approval", label: "Approval" },
    { key: "schedule", label: "Schedule" },
    { key: "handoff", label: "Execution Handoff" }
  ];
  const statusMap = {
    draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
    source: selectedItem?.source ? "ready" : "missing",
    package: selectedItem ? "ready" : "missing",
    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
    schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
    handoff: selectedItem?.status === "published" ? "ready" : "missing"
  };
  return `
    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
      ${steps.map(step => `
        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
          <span>${escapeHtml(step.label)}</span>
          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
        </div>
      `).join('')}
    </nav>
  `;
}

function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {
  const readiness = [
    { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
    { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
    { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
    { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
  ];
  const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
  return `
    <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
      ${readiness.map(r => `
        <div class="publishing-readiness-card is-${r.state}">
          <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
          <span>${r.state}</span>
        </div>
      `).join('')}
      ${blockersSummary}
    </section>
  `;
}
import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
import {
  filterAssetCategories,
  getAssetNextAction,
  renderAssetDependencyRows
} from "../asset-library.js";
import { getReadinessBlockers } from "../system-intelligence.js";
import {
  createAutoModeController,

### Status normalization and labels

function formatTime(value) {
  const date = toDate(value);
  if (!date) return "Time TBD";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function normalizeStatus(value, fallback = "draft") {
  const normalized = toKey(value);
  if (!normalized) return fallback;
  if (["draft", "paused", "pause"].includes(normalized)) return "draft";
  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
    return "needs approval";
  }
  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
  if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";
  
  return fallback;
}

function badgeTone(status) {
  if (status === "published") return "success";
  if (status === "ready" || status === "scheduled") return "warning";
  if (status === "failed") return "danger";
  return "neutral";
}

function statusClass(status) {
  return asString(status).replace(/\s+/g, "-");
}

function readDraftMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(PUBLISHING_LOCAL_DRAFTS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeDraftMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(PUBLISHING_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}


### Recommendation copy
  );
}

function getAssetData(state) {
  return asObject(state.data.assets);
}

function buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers }) {
  const failed = queue.find((item) => item.status === "failed");
  const ready = queue.find((item) => item.status === "ready");
  const needsApproval = queue.find((item) => item.status === "needs approval");
  const draft = queue.find((item) => item.status === "draft");
  const connectedCount = Object.values(checks).filter(Boolean).length;
  const externalBlockers = asArray(globalBlockers).slice(0, 3);

  if (failed) {
    return {
      action: "Retry failed publishing item",
      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
      focusId: failed.id,
      externalBlockers
    };
  }
  if (ready && !assetBlockers.length) {
    return {
      action: "Publish the ready item",
      why: `${ready.title} is approved and ready for execution. Publishing now converts completed workflow output into a live action.`,
      focusId: ready.id
    };
  }
  if (needsApproval) {
    return {
      action: "Review approval queue",
      why: `${needsApproval.title} needs approval before it can move into the publishable queue.`,
      focusId: needsApproval.id,
      externalBlockers
    };
  }
  if (handoff) {
    return {
      action: "Load workflow output into a draft",
      why: "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",
      focusId: "",
      externalBlockers
    };
  }
  if (draft) {
    return {
      action: "Complete and schedule a draft",
      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
      focusId: draft.id,
      externalBlockers
    };
  }
  return {
    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
    why: connectedCount
      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
      : "Channel readiness is missing. Publishing can prepare drafts, but live execution needs a connected destination.",
    focusId: "",
    externalBlockers

### Queue and builder copy
}

function renderQueue(queue, visibleQueue, selectedId, filter, escapeHtml) {
  const rows = visibleQueue.length
    ? visibleQueue.map((item) => `
      <article class="publishing-queue-row${item.id === selectedId ? " is-active" : ""}" data-publishing-row="${escapeHtml(item.id)}">
        <button class="publishing-queue-main" type="button" data-publishing-select="${escapeHtml(item.id)}">
          <span class="publishing-queue-title">${escapeHtml(item.title)}</span>
          <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "Unscheduled")} • ${escapeHtml(item.source)}</span>
        </button>
        <div class="publishing-queue-state">${renderStatusPill(item.status, escapeHtml)}</div>
        <div class="publishing-queue-actions">
          <button type="button" data-publishing-action="review" data-publishing-id="${escapeHtml(item.id)}">Review Package</button>
          <button type="button" data-publishing-action="schedule" data-publishing-id="${escapeHtml(item.id)}">Queue for Manual Publishing</button>
          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
          <button type="button" data-publishing-action="pause" data-publishing-id="${escapeHtml(item.id)}">Pause to draft</button>
          <button type="button" data-publishing-action="retry" data-publishing-id="${escapeHtml(item.id)}">Retry scheduled item</button>
        </div>
      </article>
    `).join("")
    : `<div class="empty-box">No publish queue items match this filter. Create or load a draft to start the execution queue.</div>`;

  return `
    <section class="card publishing-card" id="publishingQueuePanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Publish Queue</div>
          <h3>Queue items and execution actions</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(String(visibleQueue.length))} visible</span>
      </div>
      ${renderFilterRow(filter, queue, escapeHtml)}
      <div class="publishing-queue-list">${rows}</div>
    </section>
  `;
}

function renderBuilder(session, channels, checks, escapeHtml) {
  return `
    <section class="card publishing-card" id="publishingBuilderPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Publishing Builder</div>
          <h3>Draft, validate, schedule, and execute</h3>
        </div>
        <span class="card-badge neutral">Inline validation</span>
      </div>
      <form id="publishingBuilderForm" class="setup-form-grid publishing-builder-form" novalidate>
        <div class="setup-form-grid setup-form-grid-2">
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingProjectInput">Project</label>
              <span class="setup-field-state is-optional">Required</span>
            </div>
            <input id="publishingProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(session.form.project)}" placeholder="Project name">
            ${fieldError(session, "project", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingCampaignInput">Campaign</label>
              <span class="setup-field-state is-optional">Required</span>
            </div>
            <input id="publishingCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(session.form.campaign)}" placeholder="Campaign or launch wave">
            ${fieldError(session, "campaign", escapeHtml)}
          </div>
        </div>

        <div class="setup-form-grid setup-form-grid-2">
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingChannelInput">Channel</label>
              <span class="setup-field-state is-optional">${escapeHtml(checks[toKey(session.form.channel)] ? "Ready" : "Planning")}</span>
            </div>
            <select id="publishingChannelInput" name="channel" class="setup-input">
              <option value="">Choose channel</option>
              ${channels.map((channel) => `
                <option value="${escapeHtml(channel)}"${channel === session.form.channel ? " selected" : ""}>${escapeHtml(titleCase(channel))}</option>
              `).join("")}
            </select>
            ${fieldError(session, "channel", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingContentInput">Content item</label>
              <span class="setup-field-state is-optional">Required</span>
            </div>
            <input id="publishingContentInput" name="contentItem" class="setup-input" type="text" value="${escapeHtml(session.form.contentItem)}" placeholder="Caption, email, product update, or workflow output">
            ${fieldError(session, "contentItem", escapeHtml)}
          </div>
        </div>

        <div class="setup-form-grid setup-form-grid-3">
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingDateInput">Publish date</label>
              <span class="setup-field-state is-optional">Queue for Manual Publishing</span>
            </div>
            <input id="publishingDateInput" name="publishDate" class="setup-input" type="date" value="${escapeHtml(session.form.publishDate)}">
            ${fieldError(session, "publishDate", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingTimeInput">Publish time</label>
              <span class="setup-field-state is-optional">Slot</span>
            </div>
            <input id="publishingTimeInput" name="publishTime" class="setup-input" type="time" value="${escapeHtml(session.form.publishTime)}">
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head">
              <label class="setup-label" for="publishingApprovalInput">Approval status</label>
              <span class="setup-field-state is-optional">Gate</span>
            </div>
            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
              ${APPROVAL_STATUSES.map((status) => `
                <option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>
              `).join("")}
            </select>
            ${fieldError(session, "approvalStatus", escapeHtml)}
          </div>

### Execution result / asset gate / auto buttons
    </section>
  `;
}

function renderExecutionResult(queue, escapeHtml) {
  const latest = queue
    .filter((item) => item.executedAt || item.status === "failed")
    .sort((a, b) => (toDate(b.executedAt || b.updatedAt)?.getTime() || 0) - (toDate(a.executedAt || a.updatedAt)?.getTime() || 0))[0];
  const failed = queue.filter((item) => item.status === "failed");

  if (!latest && !failed.length) {
    return `
      <section class="card publishing-card">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Execution Result Area</div>
            <h3>No publish result yet</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Last publish result and failed publish blockers will appear here after execution data exists.</div>
      </section>
    `;
  }

  return `
    <section class="card publishing-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Execution Result Area</div>
          <h3>${escapeHtml(latest ? latest.title : "Failed publish blockers")}</h3>
        </div>
        <span class="card-badge ${badgeTone(latest?.status || "failed")}">${escapeHtml(latest ? titleCase(latest.status) : "Failed")}</span>
      </div>
      ${latest ? `
        <div class="data-stack">
          <div class="data-row"><span>Last result</span><strong>${escapeHtml(titleCase(latest.status))}</strong></div>
          <div class="data-row"><span>Executed</span><strong>${escapeHtml(formatDateTime(latest.executedAt, "Not executed"))}</strong></div>
          <div class="data-row"><span>Channel</span><strong>${escapeHtml(titleCase(latest.channel || "unassigned"))}</strong></div>
        </div>
      ` : ""}
      ${failed.length ? `
        <div class="publishing-blocker-list">
          ${failed.map((item) => `
            <div class="simple-banner">${escapeHtml(item.title)}: ${escapeHtml(normalizeNotes(item.notes).join("; ") || "Failed publish needs review.")}</div>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderAssetGate(state, escapeHtml) {
  const assetData = getAssetData(state);
  const assets = filterAssetCategories(assetData, PUBLISHING_ASSET_KEYS);
  const blockers = assets.filter((item) => ["Missing", "Needs Review"].includes(item.status));
  return `
    <section class="card publishing-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Channel & Approval Readiness</div>
          <h3>Publishing blockers</h3>
        </div>
        <span class="card-badge ${blockers.length ? "danger" : "success"}">${escapeHtml(blockers.length ? `${blockers.length} blockers` : "Ready")}</span>
      </div>
      ${renderAssetDependencyRows(assetData, PUBLISHING_ASSET_KEYS, escapeHtml, "Publishing library inputs are covered.")}
      <div class="simple-banner publishing-block-gap">${escapeHtml(getAssetNextAction(assetData, PUBLISHING_ASSET_KEYS))}</div>
    </section>
  `;
}

async function runAndRefresh(action, { projectName, reloadProjectData, showMessage, showError, successMessage }) {
  try {
    const response = await action();
    await reloadProjectData?.(projectName);
    showMessage?.(successMessage);
    return response;
  } catch (error) {
    showError?.(error.message || "Publishing action failed.");
    return null;
  }

### Binding confirmation copy
  const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
  saveDraftButtons.forEach((button) => {
    button.onclick = async () => {
      syncSessionForm(session, form);
      if (!validateBuilder(session, "draft")) {
        rerender();
        return;
      }
      await persistDraft();
      rerender();
    };
  });

  const scheduleBtn = $("publishingScheduleBtn");
  if (scheduleBtn) {
    scheduleBtn.onclick = async () => {
      syncSessionForm(session, form);
      if (!validateBuilder(session, "schedule")) {
        rerender();
        return;
      }

      const current = selected();
      const payload = buildSchedulePayload(session, "scheduled");
      if (!current?.localOnly && guardPublishingAssetBlockers(session, assetBlockers, showMessage, "scheduling or rescheduling")) {
        rerender();
        return;
      }
      if (current?.localOnly) {
        updateLocalDraft(projectName, current.id, {
          ...buildLocalDraftPayload(session, "scheduled"),
          id: current.id
        });
        session.draftMessage = "Local publishing draft scheduled in this browser.";
        showMessage?.(session.draftMessage);
        rerender();
        return;
      }

      const confirmed = confirmPublishingBackendAction(
        current
          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
      );
      if (!confirmed) {
        rerender();
        return;
      }

      const action = current
        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
        : () => savePublishingSchedule(projectName, payload);

      const response = await runAndRefresh(action, {
        projectName,
        reloadProjectData,
        showMessage,
        showError,
        successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
      });

      if (response?.job?.job_id) {
        session.selectedId = response.job.job_id;
        session.formSourceId = response.job.job_id;
      } else if (!current) {
        saveDraftLocally("Backend schedule unavailable; draft kept locally.");
      }
      rerender();
    };
  }

  Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
    button.onclick = async () => {
      const itemId = button.getAttribute("data-publishing-id") || "";
      const action = button.getAttribute("data-publishing-action") || "";
      const item = getSelectedItem(queue, itemId);
      if (!item) return;

      session.selectedId = item.id;
      syncFormFromItem(session, item);

      if (action === "review") {
        rerender();
        return;
      }

      if (action === "schedule") {
        document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        rerender();
        return;
      }

      const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
      if (!validateBuilder(session, intent)) {
        rerender();
        return;
      }

      if (item.localOnly) {
        const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
        updateLocalDraft(projectName, item.id, { ...buildLocalDraftPayload(session, nextStatus), id: item.id });
        session.draftMessage = `Local draft ${action === "publish" ? "marked published" : action === "pause" ? "paused" : "updated"}.`;
        showMessage?.(session.draftMessage);
        rerender();
        return;
      }

      if (action === "publish") {
        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
          rerender();
          return;
        }

        const confirmed = window.confirm(
          "Final Confirmation Required\n\nAction: Publish this item to configured channels.\n\nThis is a high-risk, final step. Please verify channel, source, schedule, and approval status.\n\nPublishing is always confirmation-gated and governed by backend approval rules.\nApproval and governance gates must be satisfied before execution.\n\nSelect Cancel to keep this item in the queue."
        );
        if (!confirmed) {
          rerender();
          return;
        }
        await runAndRefresh(
          () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as published." }
        );
      }
      if (action === "pause") {
        const confirmed = confirmPublishingBackendAction(
          "Confirm pause\n\nAction: Move this backend publishing item back to draft.\n\nThis updates the backend publishing lifecycle state.\n\nSelect Cancel to keep the item unchanged."
        );
        if (!confirmed) {
          rerender();
          return;
        }

        await runAndRefresh(
          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
        );
      }
      if (action === "retry") {
        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
          rerender();
          return;
        }

        const confirmed = confirmPublishingBackendAction(
          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
        );
        if (!confirmed) {
          rerender();
          return;
        }

        await runAndRefresh(
          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
        );
      }
      rerender();
    };
  });

  const approveBtn = $("publishingApproveBtn");
  if (approveBtn) {
    approveBtn.onclick = async () => {
      const current = selected();
      if (!current) {
        session.validation.contentItem = "Select or save a publishing draft before approval.";
        rerender();
        return;
      }
      session.form.approvalStatus = "approved";
      if (current.localOnly) {
        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
        showMessage?.("Local publishing draft approved.");
        rerender();
        return;
      }

      const confirmed = confirmPublishingBackendAction(
        "Confirm approval\n\nAction: Mark this backend publishing item ready for publishing.\n\nApproval moves the item toward publishable readiness and remains governed by backend rules.\n\nSelect Cancel to keep the item unchanged."
      );
      if (!confirmed) {
        rerender();
        return;
      }
      
      await runAndRefresh(
        () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item approved and marked ready." }
      );
      rerender();
    };
  }

  const failBtn = $("publishingFailBtn");
  if (failBtn) {
    failBtn.onclick = async () => {
      const current = selected();
      if (!current) {
        session.validation.contentItem = "Select a publishing item before marking it failed.";
        rerender();
        return;
      }
      if (current.localOnly) {
        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });

### Auto mode copy
      showMessage?.("Publishing context sent to AI Command.");
    };
  }

  const autoPrepareBtn = $("publishingAutoPrepareBtn");
  if (autoPrepareBtn) {
    autoPrepareBtn.onclick = async () => {
      const plan = buildPublishingAutoModePlan(session);
      if (!plan.length) {
        publishingAutomationState.progress = "";
        publishingAutomationState.result = "No safe publishing preparation steps available.";
        rerender();
        return;
      }

      publishingAutomationState.result = "";
      publishingAutomationState.progress = `Step 0 / ${plan.length}`;
      publishingAutomationEnabled = true;
      ensurePublishingAutoModeBinding(getState, navigateTo, render);
      rerender();

      const runResult = await startAutoMode(plan, {
        mode: "auto_until_approval",
        context: { getState, navigateTo, projectName },
        onProgress: ({ index, total, step, result }) => {
        publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
        schedulePublishingRender(render);
        }
      });

      publishingAutomationState.result = runResult.status === "success"
        ? "Auto Prepare Publishing completed."
        : "Auto Prepare Publishing stopped before completion.";
      showMessage?.(publishingAutomationState.result);
      rerender();
    };
  }

  const autoStopBtn = $("publishingAutoStopBtn");
  if (autoStopBtn) {
    autoStopBtn.onclick = () => {
      stopAutoMode();
      showMessage?.("Auto Mode stopped.");
    };
  }

  const autoApproveBtn = $("publishingAutoApproveBtn");
  if (autoApproveBtn) {
    autoApproveBtn.onclick = async () => {
      await approveCurrentGate({ context: { getState, navigateTo, projectName } });
      showMessage?.("Approval gate accepted.");
    };
  }

  const autoSkipBtn = $("publishingAutoSkipBtn");
  if (autoSkipBtn) {
    autoSkipBtn.onclick = async () => {
      await skipCurrentStep({ context: { getState, navigateTo, projectName } });
      showMessage?.("Gated step skipped.");
    };
  }
}

export const publishingRoute = {
  id: "publishing",
  disableStandardLayout: true,
