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
  const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
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
    { key: "handoff", label: "Manual Completion Handoff" }
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
  getAutoModeState,
  startAutoMode,
  stopAutoMode,
  approveCurrentGate,
  skipCurrentStep,
  subscribeAutoMode
} from "../automation-engine.js";
import {
  buildSchedulePayload,
  buildLocalDraftPayload,
  buildPublishingAiPrompt
} from "./publishing/publishing-payloads.js";

const publishingSessions = new Map();
const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";
const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
const CHANNEL_DEFAULTS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];
const PUBLISHING_ASSET_KEYS = [
  "legal_doc",
  "pricing_doc",
  "product_csv",
  "product_photos",
  "product_videos",
  "campaign_assets",
  "social_assets",
  "logo"
];
const publishingAutomationState = {
  progress: "",
  result: ""
};
let publishingAutoModeUnsubscribe = null;
let publishingAutoModeControllerReady = false;
let publishingAutomationEnabled = false;
let publishingRenderCallback = null;
let publishingRenderTimer = null;

function schedulePublishingRender(render) {
  if (typeof render === "function") {
    publishingRenderCallback = render;
  }

  if (publishingRenderTimer) {
    return;
  }

  publishingRenderTimer = window.setTimeout(() => {
    publishingRenderTimer = null;

    if (typeof publishingRenderCallback === "function") {
      publishingRenderCallback();
    }
  }, 120);
}

function ensurePublishingAutoModeBinding(getState, navigateTo, render) {
  publishingRenderCallback = render;

  if (!publishingAutomationEnabled) {
    return;
  }

  if (!publishingAutoModeControllerReady) {
    createAutoModeController(getState, { getState, navigateTo });
    publishingAutoModeControllerReady = true;
  }

  if (publishingAutoModeUnsubscribe) {
    return;
  }

  publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
    const autoState = getAutoModeState();
    const status = asString(autoState.status || "idle");

    if (status === "idle") {
      return;
    }

    schedulePublishingRender();
  });
}



function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function clean(value) {
  return asString(value).trim();
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toKey(value) {
  return clean(value).toLowerCase();
}

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function nowIso() {
  return new Date().toISOString();
}

function toDateInput(value) {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function toTimeInput(value) {
  const date = toDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatDateTime(value, fallback = "Not scheduled") {
  const date = toDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDate(value) {
  const date = toDate(value);
  if (!date) return "Unscheduled";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

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

function projectKey(projectName) {
  return toKey(projectName) || "__default__";
}

function loadLocalDrafts(projectName) {
  return asArray(readDraftMap()[projectKey(projectName)]);
}

function saveLocalDraft(projectName, draft) {
  const map = readDraftMap();
  const key = projectKey(projectName);
  const drafts = asArray(map[key]).filter((item) => asString(item.id) !== asString(draft.id));
  const nextDraft = {
    ...asObject(draft),
    id: asString(draft.id || `local-publish-${Date.now()}`),
    source: "Local draft",
    localOnly: true,
    updatedAt: nowIso()
  };
  map[key] = [nextDraft, ...drafts].slice(0, 20);
  writeDraftMap(map);
  return nextDraft;
}

function updateLocalDraft(projectName, itemId, patch) {
  const existing = loadLocalDrafts(projectName).find((item) => asString(item.id) === asString(itemId));
  return saveLocalDraft(projectName, {
    ...asObject(existing),
    ...asObject(patch),
    id: itemId
  });
}

function buildDefaultForm(state) {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(9, 0, 0, 0);

  return {
    project: firstText(context.currentProject, overview.project_name),
    campaign: firstText(context.activeCampaign, overview.active_campaign),
    channel: "instagram",
    contentItem: "",
    publishDate: toDateInput(tomorrow),
    publishTime: "09:00",
    approvalStatus: "draft",
    title: "",
    notes: ""
  };
}

function ensureSession(projectName, state) {
  const key = projectKey(projectName);
  if (!publishingSessions.has(key)) {
    publishingSessions.set(key, {
      selectedId: "",
      filter: "all",
      form: buildDefaultForm(state),
      formSourceId: "",
      validation: {},
      draftMessage: "",
      loadedHandoffId: "",
      isCreatingNew: true
    });
  }
  return publishingSessions.get(key);
}

function normalizeNotes(...values) {
  return values
    .flatMap((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return value.split(/\n+/);
      return [];
    })
    .map((item) => clean(item))
    .filter(Boolean);
}

function buildItemTitle(item, state) {
  const context = asObject(state.context);
  if (item.title) return item.title;
  if (item.contentItem) return item.contentItem;
  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
  return `${titleCase(item.channel || "Publishing")} item`;
}

function normalizeQueueItem(rawItem, state, source) {
  const raw = asObject(rawItem);
  const preview = asObject(raw.preview || raw.connector_preview);
  const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);
  const status = normalizeStatus(raw.execution_status || raw.status, scheduledFor ? "scheduled" : "draft");
  const channel = toKey(raw.channel || preview.channel);
  const item = {
    id: firstText(raw.job_id, raw.execution_id, raw.id),
    jobId: firstText(raw.job_id, raw.execution_id, raw.id),
    title: firstText(raw.title, raw.name, preview.title, preview.headline),
    project: firstText(raw.project, raw.project_name, state.context?.currentProject),
    campaign: firstText(raw.campaign, raw.campaign_name, raw.wave_name, raw.waveName, state.context?.activeCampaign),
    channel,
    contentItem: firstText(raw.content_item, raw.contentItem, raw.content_id, preview.content_item, preview.caption, preview.body),
    scheduledFor,
    executedAt: firstText(raw.executed_at, raw.executedAt),
    createdAt: firstText(raw.created_at, raw.createdAt, raw.executed_at),
    updatedAt: firstText(raw.updated_at, raw.updatedAt, raw.executed_at, raw.created_at),
    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
    status,
    rawStatus: firstText(raw.execution_status, raw.status),
    offer: firstText(raw.offer, preview.offer),
    notes: normalizeNotes(raw.notes, raw.connector_error),
    preview,
    source,
    localOnly: Boolean(raw.localOnly),
    totalAssets: Number(raw.total_assets || preview.asset_count || 0) || 0
  };
  item.title = buildItemTitle(item, state);
  return item;
}

function buildQueue(state, projectName) {
  const activity = asObject(state.data.activity);
  const results = asArray(activity.execution_results)
    .slice()
    .sort((a, b) => (toDate(b.executed_at)?.getTime() || 0) - (toDate(a.executed_at)?.getTime() || 0));
  const latestResultByJob = new Map();

  results.forEach((result) => {
    const jobId = firstText(result.job_id, result.execution_id);
    if (jobId && !latestResultByJob.has(jobId)) latestResultByJob.set(jobId, result);
  });

  const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {
    const latest = latestResultByJob.get(asString(job.job_id));
    return normalizeQueueItem(
      {
        ...asObject(job),
        ...asObject(latest),
        preview: asObject(latest?.preview || job.preview || job.connector_preview)
      },
      state,
      latest ? "Scheduled job + result" : "Scheduled job"
    );
  });

  const knownIds = new Set(scheduledItems.map((item) => item.jobId));
  const orphanResults = results
    .filter((result) => !knownIds.has(firstText(result.job_id, result.execution_id)))
    .map((result) => normalizeQueueItem(result, state, "Execution result"));

  const localDrafts = loadLocalDrafts(projectName).map((draft) => normalizeQueueItem(draft, state, "Local draft"));
  const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));
  const visibleLocalDrafts = localDrafts.filter((item) => !backendIds.has(item.id));

  return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);
}

function compareQueueItems(a, b) {
  const order = {
    failed: 0,
    ready: 1,
    "needs approval": 2,
    scheduled: 3,
    draft: 4,
    published: 5
  };
  const aOrder = order[a.status] ?? 99;
  const bOrder = order[b.status] ?? 99;
  if (aOrder !== bOrder) return aOrder - bOrder;
  const aTime = toDate(a.scheduledFor || a.updatedAt || a.createdAt)?.getTime() || 0;
  const bTime = toDate(b.scheduledFor || b.updatedAt || b.createdAt)?.getTime() || 0;
  return bTime - aTime;
}

function buildChannels(state, queue) {
  const checks = asObject(state.data.integrations?.readiness?.checks);
  return Array.from(
    new Set([
      ...Object.keys(checks),
      ...queue.map((item) => item.channel),
      ...CHANNEL_DEFAULTS
    ].map(toKey).filter(Boolean))
  );
}

function getStatusCounts(queue) {
  return DISPLAY_STATUSES.reduce((acc, status) => {
    acc[status] = queue.filter((item) => item.status === status).length;
    return acc;
  }, {});
}

function getVisibleQueue(queue, filter) {
  if (!filter || filter === "all") return queue;
  return queue.filter((item) => item.status === filter);
}

function getSelectedItem(queue, selectedId) {
  return queue.find((item) => item.id === selectedId) || null;
}

function getNextPublishWindow(queue) {
  const next = queue
    .filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))
    .sort((a, b) => (toDate(a.scheduledFor)?.getTime() || 0) - (toDate(b.scheduledFor)?.getTime() || 0))[0];
  return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";
}

function syncFormFromItem(session, item) {
  if (!item) return;


  session.form = {
    project: item.project || session.form.project || "",
    campaign: item.campaign || "",
    channel: item.channel || session.form.channel || "",
    contentItem: item.contentItem || item.title || "",
    publishDate: toDateInput(item.scheduledFor),
    publishTime: toTimeInput(item.scheduledFor),
    approvalStatus: item.approvalStatus || "draft",
    title: item.title || "",

    notes: normalizeNotes(item.notes).join("\n")
  };
  session.formSourceId = item.id;
  session.validation = {};
  session.isCreatingNew = false;
}

function resetForm(session, state) {
  session.selectedId = "";
  session.form = buildDefaultForm(state);
  session.formSourceId = "";
  session.validation = {};
  session.draftMessage = "";
  session.isCreatingNew = true;
}

function syncSessionForm(session, form) {
  if (!form) return;
  Array.from(form.elements).forEach((field) => {
    if (!field.name) return;
    session.form[field.name] = field.value || "";
  });
}

function buildScheduleTime(form) {
  const date = clean(form.publishDate);
  if (!date) return "";
  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
}

function buildPublishingAutoModePlan(session) {
  const draftPrompt = firstText(
    session.form.contentItem,
    session.form.notes,
    "Prepare publishing draft from current project context."
  );

  return [
    {
      id: `publishing-prepare-${Date.now()}`,
      type: "prepare_publishing_draft",
      targetPage: "publishing",
      action: "Prepare publishing draft",
      payload: {
        prompt: draftPrompt,
        reason: "Prepare a safe publishing draft without executing publish.",
        title: firstText(session.form.title, "Prepared publishing draft")
      },
      priority: "recommended"
    },
    {
      id: `publishing-gate-${Date.now()}`,
      type: "publish_now",
      targetPage: "publishing",
      action: "Record manual publish completion",
      payload: {
        prompt: draftPrompt,
        reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
      },
      priority: "critical"
    }
  ];
}

function validateBuilder(session, intent) {
  const errors = {};
  const form = session.form;

  if (!clean(form.project)) errors.project = "Project is required.";
  if (!clean(form.campaign)) errors.campaign = "Campaign is required.";
  if (!clean(form.channel)) errors.channel = "Channel is required.";
  if (!clean(form.contentItem)) errors.contentItem = "Content item is required.";
  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
    errors.publishDate = "Publish date is required for this action.";
  }
  if (intent === "publish" && form.approvalStatus !== "approved") {
    errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";
  }

  session.validation = errors;
  return !Object.keys(errors).length;
}

function summarizePublishingBlockers(assetBlockers = []) {
  const blockers = asArray(assetBlockers);
  if (!blockers.length) return "";
  return blockers
    .slice(0, 4)
    .map((item) => firstText(item.label, item.name, item.key, item.id, "Required asset"))
    .join(", ");
}

function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
  const blockers = asArray(assetBlockers);
  if (!blockers.length) return false;
  const summary = summarizePublishingBlockers(blockers);
  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
  session.validation.contentItem = message;
  showMessage?.(message);
  return true;
}

function confirmPublishingBackendAction(message) {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  return window.confirm(message);
}

function fieldError(session, key, escapeHtml) {
  const message = session.validation[key];
  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
}

function renderStatusPill(status, escapeHtml) {
  // Add governance/approval hints for status pills
  let hint = "";
  if (status === "needs approval") {
    hint = "title=\"Request Approval Review. Confirmation required before execution.\" aria-label=\"Request Approval Review. Confirmation required before execution.\"";
  } else if (status === "ready") {
    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
  } else if (status === "scheduled") {
    hint = "title=\"Confirmation required before execution.\" aria-label=\"Confirmation required before execution.\"";
  }
  return `<span class="publishing-status-pill is-${escapeHtml(statusClass(status))}" ${hint}>${escapeHtml(titleCase(status))}</span>`;
}

function renderScopedStyles() {
  return `
    <style>
      .publishing-execution-center {
        display: grid;
        gap: 14px;
        min-width: 0;
      }

      .publishing-execution-grid {
        display: grid;
        gap: 14px;
        min-width: 0;
      }

      .publishing-main-column,
      .publishing-side-column {
        display: grid;
        gap: 14px;
        min-width: 0;
        align-content: start;
      }

      .publishing-card {
        min-width: 0;
        overflow: hidden;
      }

      .publishing-overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
        gap: 9px;
      }

      .publishing-overview-item,
      .publishing-impact-chip {
        min-width: 0;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 10px;
        background: var(--surface-muted, rgba(15, 23, 42, 0.03));
      }

      .publishing-overview-item span,
      .publishing-impact-chip small {
        display: block;
        color: var(--text-muted, #64748b);
        font-size: 0.78rem;
        line-height: 1.3;
      }

      .publishing-overview-item strong,
      .publishing-impact-chip strong {
        display: block;
        margin-top: 4px;
        overflow-wrap: anywhere;
      }

      .publishing-overview-item.is-wide {
        grid-column: 1 / -1;
      }

      .publishing-impact-row,
      .publishing-action-row,
      .publishing-form-actions,
      .publishing-filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      .publishing-impact-row {
        margin-top: 12px;
      }

      .publishing-action-row,
      .publishing-form-actions {
        margin-top: 12px;
      }

      .publishing-action-row .btn,
      .publishing-form-actions .btn {
        white-space: normal;
        line-height: 1.2;
        text-align: center;
      }

      .publishing-impact-chip {
        flex: 1 1 150px;
      }

      .publishing-filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.28));
        border-radius: 999px;
        padding: 6px 10px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      .publishing-filter-chip.is-active {
        border-color: var(--accent, #2563eb);
        background: rgba(37, 99, 235, 0.08);
      }

      /* Publishing queue dark contrast correction */
      .publishing-queue-list,
      .publishing-calendar-list,
      .publishing-blocker-list {
        display: grid;
        gap: 9px;
        margin-top: 12px;
        min-width: 0;
      }

      .publishing-queue-row {
        display: grid;
        gap: 9px;
        min-width: 0;
        padding: 10px;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.74);
        border: 1px solid rgba(148, 163, 184, 0.18);
        color: #e5eef8;
      }

      .publishing-queue-row.is-active {
        background: rgba(15, 23, 42, 0.88);
        border-color: rgba(34, 211, 238, 0.34);
      }

      .publishing-queue-main,
      .publishing-calendar-row {
        width: 100%;
        min-width: 0;
        border: 0;
        padding: 0;
        background: transparent;
        color: #e5eef8;
        text-align: left;
        cursor: pointer;
      }

      .publishing-queue-title {
        display: block;
        font-weight: 800;
        color: #f8fafc;
        line-height: 1.18;
        overflow-wrap: anywhere;
      }

      .publishing-queue-meta {
        display: block;
        margin-top: 4px;
        color: rgba(226, 232, 240, 0.72);
        font-size: 0.82rem;
        line-height: 1.35;
        overflow-wrap: anywhere;
      }

      .publishing-queue-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        align-items: center;
      }

      .publishing-queue-actions button {
        min-height: 32px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 999px;
        padding: 6px 10px;
        background: rgba(15, 23, 42, 0.72);
        color: #e5eef8;
        cursor: pointer;
        white-space: normal;
        line-height: 1.18;
      }

      .publishing-queue-actions button:focus-visible,
      .publishing-queue-main:focus-visible,
      .publishing-calendar-row:focus-visible,
      .publishing-filter-chip:focus-visible {
        outline: 2px solid rgba(34, 211, 238, 0.72);
        outline-offset: 2px;
      }

      .publishing-queue-actions button:disabled,
      .publishing-queue-actions button[disabled] {
        background: rgba(15, 23, 42, 0.44);
        border-color: rgba(148, 163, 184, 0.14);
        color: rgba(226, 232, 240, 0.44);
        opacity: 1;
        cursor: not-allowed;
      }

      .publishing-status-pill {
        display: inline-flex;
        width: fit-content;
        max-width: 100%;
        border-radius: 999px;
        padding: 4px 8px;
        background: rgba(100, 116, 139, 0.12);
        color: inherit;
        font-size: 0.76rem;
        font-weight: 700;
        line-height: 1.2;
      }

      .publishing-status-pill.is-ready,
      .publishing-status-pill.is-scheduled {
        background: rgba(217, 119, 6, 0.12);
      }

      .publishing-status-pill.is-published {
        background: rgba(22, 163, 74, 0.12);
      }

      .publishing-status-pill.is-failed {
        background: rgba(220, 38, 38, 0.12);
      }

      .publishing-inline-error {
        margin-top: 6px;
        color: var(--danger, #b91c1c);
        font-size: 0.82rem;
        line-height: 1.35;
      }

      .publishing-calendar-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 6px 10px;
        align-items: center;
        min-height: 42px;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 9px 10px;
      }

      .publishing-calendar-row em {
        grid-column: 1 / -1;
        min-width: 0;
        font-style: normal;
        color: var(--text-muted, #64748b);
        overflow-wrap: anywhere;
      }

      @media (min-width: 980px) {
        .publishing-execution-grid {
          grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
          align-items: start;
        }

        .publishing-queue-row {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
        }

        .publishing-queue-actions {
          grid-column: 1 / -1;
        }
      }
    </style>
  `;
}

function summarizeText(value, fallback = "No content payload available yet.") {
  const text = clean(value);
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function extractHandoffSummary(handoff) {
  const direct = asObject(handoff);
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const draftContext = asObject(payload.draft_context);
  const isAiCampaign = asString(direct.type || payload.type) === "ai_command_campaign_handoff";
  const sections = asArray(direct.sections || payload.sections || output.sections);
  const goal = asString(direct.goal || payload.goal);
  const channel = asString(direct.channel || payload.channel);
  const sourceType = asString(direct.source_type || payload.source_type || direct.source);

  return {
    id: asString(direct.id || handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
    sourcePage: asString(handoff?.source_page || direct.source || "workflows"),
    workflowId: asString(payload.workflow_id || direct.id),
    title: firstText(direct.title, output.title, payload.workflow_title, draftContext.lastResponseTitle, isAiCampaign ? "AI Team Campaign Handoff" : "Workflow output"),
    summary: firstText(direct.summary, output.summary, payload.summary, draftContext.lastResponseSummary, payload.prompt, isAiCampaign ? "AI Team campaign package is available for publishing preparation." : "Workflow output is available for publishing preparation."),
    isAiCampaign,
    sections,
    goal,
    channel,
    sourceType,
    packageLabel: isAiCampaign ? "AI Team Campaign Handoff" : "Workflow Handoff"
  };
}


function getAiCommandLocalCampaignHandoff(destinationRoute) {
  const keys = [
    `mh_ai_command_handoff_${destinationRoute}`,
    "mh_ai_command_campaign_handoff"
  ];

  for (const storage of [window.sessionStorage, window.localStorage]) {
    for (const key of keys) {
      try {
        const parsed = JSON.parse(storage?.getItem?.(key) || "null");
        if (!parsed || typeof parsed !== "object") continue;

        const type = asString(parsed.type);
        const route = asString(parsed.destination_route);
        if (type === "ai_command_campaign_handoff" && (!route || route === destinationRoute)) {
          return parsed;
        }
      } catch (error) {
        console.warn("Unable to read AI Command campaign handoff", error);
      }
    }
  }

  return null;
}

function clearAiCommandLocalCampaignHandoff(destinationRoute) {
  const keys = [
    `mh_ai_command_handoff_${destinationRoute}`,
    "mh_ai_command_campaign_handoff"
  ];

  for (const storage of [window.sessionStorage, window.localStorage]) {
    for (const key of keys) {
      try {
        storage?.removeItem?.(key);
      } catch (error) {
        console.warn("Unable to clear AI Command campaign handoff", error);
      }
    }
  }
}


function getPublishingHandoff(projectName, operations) {
  const aiCommandLocalHandoff = getAiCommandLocalCampaignHandoff("publishing");
  if (aiCommandLocalHandoff) return aiCommandLocalHandoff;

  return (
    getSharedHandoff(projectName, "publishing", operations, "workflows") ||
    getSharedHandoff(projectName, "publishing", operations, "ai-command") ||
    getSharedHandoff(projectName, "publishing", operations)
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
      action: "Record manual completion for the ready item",
      why: `${ready.title} is approved for a backend readiness update. Record manual completion only after external execution is verified.`,
      focusId: ready.id
    };
  }
  if (needsApproval) {
    return {
      action: "Review approval queue",
      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
      focusId: needsApproval.id,
      externalBlockers
    };
  }
  if (handoff) {
    const handoffSummary = extractHandoffSummary(handoff);
    return {
      action: handoffSummary.isAiCampaign ? "Load campaign package into a draft" : "Load workflow output into a draft",
      why: handoffSummary.isAiCampaign
        ? "An AI Team campaign package is available. Loading it creates a local publishing draft without publishing externally."
        : "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",
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
  };
}

function renderOverview(counts, queue, escapeHtml) {
  return `
    <section class="card publishing-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Publishing Overview</div>
          <h3>Execution Destination</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(String(queue.length))} items</span>
      </div>
      <div class="publishing-overview-grid">
        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
        <div class="publishing-overview-item"><span>Ready for manual review</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
      </div>
    </section>
  `;
}

function renderRecommendation(recommendation, counts, assetBlockers, checks, escapeHtml) {
  const chips = [
    ["Manual publishing readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
    ["Content", counts.draft || counts.ready || counts.scheduled ? "Present" : "Empty"],
    ["Workflow output", recommendation.action.includes("workflow") ? "Available" : "Optional"],
    ["Channel readiness", Object.values(checks).filter(Boolean).length ? "Connected" : "Needs setup"],
    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
    ["Automation", counts.scheduled ? "Scheduled" : "Manual"]
  ];

  return `
    <section class="card publishing-card" id="publishingRecommendation">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Smart Recommendation</div>
          <h3>${escapeHtml(recommendation.action)}</h3>
          <p class="publishing-section-copy">${escapeHtml(recommendation.why)}</p>
        </div>
        <span class="card-badge ${assetBlockers.length ? "danger" : "neutral"}">${escapeHtml(assetBlockers.length ? `${assetBlockers.length} blockers` : "Clear")}</span>
      </div>
      <div class="publishing-impact-row">
        ${chips.map(([label, value]) => `
          <span class="publishing-impact-chip">
            <strong>${escapeHtml(label)}</strong>
            <small>${escapeHtml(value)}</small>
          </span>
        `).join("")}
      </div>
      <div class="publishing-action-row">
        <button id="publishingOpenQueueBtn" class="btn btn-secondary" type="button">Open Publish Queue</button>
        <button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
        <button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>
        <button id="publishingAutoPrepareBtn" class="btn btn-secondary" type="button">Auto-prepare publishing plan</button>
        <button id="publishingAutoStopBtn" class="btn btn-secondary" type="button">Stop Auto Mode</button>
      </div>
      <details class="publishing-automation-preview publishing-block-gap">
        <summary>Automation Preview</summary>
        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
        <div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status || "idle")}</div>
        ${asArray(recommendation.externalBlockers).length ? `
          <div class="simple-banner publishing-block-gap">Cross-system blockers: ${escapeHtml(asArray(recommendation.externalBlockers).map((item) => item.title).join("; "))}</div>
        ` : ""}
        ${publishingAutomationState.progress ? `<div class="simple-banner publishing-block-gap">${escapeHtml(publishingAutomationState.progress)}</div>` : ""}
        ${publishingAutomationState.result ? `<div class="simple-banner publishing-inline-gap">${escapeHtml(publishingAutomationState.result)}</div>` : ""}
        ${getAutoModeState().status === "waiting_approval" ? `
          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
          <div class="publishing-action-row publishing-inline-gap">
            <button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>
            <button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>
          </div>
        ` : ""}
      </details>
      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
    </section>
  `;
}

function renderFilterRow(filter, queue, escapeHtml) {
  const counts = getStatusCounts(queue);


  return `
    <div class="publishing-filter-row">
      ${STATUS_FILTERS.map((status) => {
        const active = filter === status;
        const count = status === "all" ? queue.length : counts[status];
        return `
          <button class="publishing-filter-chip${active ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
            <span>${escapeHtml(status === "all" ? "All" : titleCase(status))}</span>
            <strong>${escapeHtml(String(count || 0))}</strong>
          </button>
        `;
      }).join("")}
    </div>
  `;
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
          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Record Manual Completion</button>
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
          <h3>Draft, validate, and queue manual publishing records</h3>
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
        </div>

        <div class="setup-field-group">
          <div class="setup-field-head">
            <label class="setup-label" for="publishingTitleInput">Queue title</label>
            <span class="setup-field-state is-optional">Optional</span>
          </div>
          <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Operator-facing title">
        </div>

        <div class="setup-field-group">
          <div class="setup-field-head">
            <label class="setup-label" for="publishingNotesInput">Execution notes</label>
            <span class="setup-field-state is-optional">Context</span>
          </div>
          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
        </div>
      </form>
      <div class="publishing-form-actions">
        <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Draft</button>
        <button id="publishingBuilderSaveBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
      </div>
      ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
    </section>
  `;
}

function renderWorkflowHandoff(handoff, session, escapeHtml) {
  if (!handoff) {
    return `
      <section class="card publishing-card">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Workflow Handoff</div>
            <h3>No workflow output available</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Run or route a workflow into Publishing to load execution-ready output here.</div>
      </section>
    `;
  }

  const summary = extractHandoffSummary(handoff);
  const isLoaded = summary.id && summary.id === session.loadedHandoffId;
  return `
    <section class="card publishing-card" id="publishingHandoffPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">${escapeHtml(summary.packageLabel || "Workflow Handoff")}</div>
          <h3>${escapeHtml(summary.title)}</h3>
          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, summary.isAiCampaign ? "AI Team campaign package is available for draft loading." : "Workflow output is available for draft loading."))}</p>
        </div>
        <span class="card-badge ${isLoaded ? "success" : summary.isAiCampaign ? "warning" : "neutral"}">${escapeHtml(isLoaded ? "Loaded" : summary.isAiCampaign ? "From AI Command" : "Available")}</span>
      </div>
      <div class="data-stack">
        <div class="data-row"><span>Source</span><strong>${escapeHtml(summary.sourceType ? titleCase(summary.sourceType) : titleCase(summary.sourcePage))}</strong></div>
        <div class="data-row"><span>${escapeHtml(summary.isAiCampaign ? "Campaign" : "Workflow")}</span><strong>${escapeHtml(summary.workflowId || "Not specified")}</strong></div>
        <div class="data-row"><span>Goal</span><strong>${escapeHtml(summary.goal ? titleCase(summary.goal) : "Not specified")}</strong></div>
        <div class="data-row"><span>Channel</span><strong>${escapeHtml(summary.channel ? titleCase(summary.channel) : "Not specified")}</strong></div>
      </div>
      <div class="publishing-action-row">
        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(summary.isAiCampaign ? "Load Campaign Package" : "Load Workflow Output")}</button>
        ${summary.isAiCampaign ? `<button id="publishingClearAiCommandHandoffBtn" class="btn btn-secondary" type="button">Clear AI Command Handoff</button>` : ""}
      </div>
    </section>
  `;
}

function renderCalendar(queue, escapeHtml) {
  const now = Date.now();
  const scheduled = queue.filter((item) => item.scheduledFor);
  const future = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() > now);
  const past = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() <= now);

  if (!future.length && !past.length) {
    return `
      <section class="card publishing-card">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Calendar / Timeline Snapshot</div>
            <h3>No scheduled window</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
      </section>
    `;
  }

  let panels = "";
  if (future.length) {
    panels += `
      <div class="publishing-calendar-list">
        ${future.slice(0, 8).map((item) => `
          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
            <em>${escapeHtml(item.title)}</em>
            ${renderStatusPill(item.status, escapeHtml)}
          </button>
        `).join("")}
      </div>
    `;
  }
  if (past.length) {
    panels += `
      <div class="publishing-calendar-list publishing-block-gap">
        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
        ${past.slice(0, 8).map((item) => `
          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
            <em>${escapeHtml(item.title)}</em>
            ${renderStatusPill(item.status, escapeHtml)}
          </button>
        `).join("")}
      </div>
    `;
  }

  return `
    <section class="card publishing-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Calendar / Timeline Snapshot</div>
          <h3>${future.length ? "Upcoming scheduled items" : "Past scheduled items — reschedule required"}</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(String(future.length || past.length))} ${future.length ? "upcoming" : "past"}</span>
      </div>
      ${panels}
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
}

function bindPublishingWorkspace({
  $,
  getState,
  navigateTo,
  showMessage,
  showError,
  reloadProjectData,
  savePublishingSchedule,
  reschedulePublishingItem,
  approvePublishingItem,
  publishPublishingItem,
  failPublishingItem,
  render,
  queue,
  handoff
}) {

  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, state);

  ensurePublishingAutoModeBinding(getState, navigateTo, render);

  function rerender() {
    schedulePublishingRender(render);
  }


  function selected() {
    return getSelectedItem(queue, session.selectedId);
  }

  function saveDraftLocally(message = "Publishing draft saved locally.") {
    const local = saveLocalDraft(projectName, buildLocalDraftPayload(session, "draft"));
    session.selectedId = local.id;
    session.formSourceId = local.id;
    session.isCreatingNew = false;
    session.draftMessage = message;
    showMessage?.(message);
    return local;
  }

  async function persistDraft() {
    const local = saveDraftLocally("Publishing draft saved locally.");
    if (typeof savePublishingSchedule === "function") {
      const response = await runAndRefresh(
        () => savePublishingSchedule(projectName, buildSchedulePayload(session, "draft")),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError: () => {},
          successMessage: "Publishing draft saved."
        }
      );

      if (response?.job?.job_id) {
        session.selectedId = response.job.job_id;
        session.formSourceId = response.job.job_id;
      }
    }
    return local;
  }

  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
    button.onclick = () => {
      session.filter = button.getAttribute("data-publishing-filter") || "all";
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
    button.onclick = () => {
      const itemId = button.getAttribute("data-publishing-select") || "";
      session.selectedId = itemId;
      syncFormFromItem(session, getSelectedItem(queue, itemId));
      rerender();
    };
  });

  const form = $("publishingBuilderForm");
  if (form) {
    form.oninput = () => {
      syncSessionForm(session, form);
      if (Object.keys(session.validation).length) {
        session.validation = {};
        rerender();
      }
    };
  }

  const newBtn = $("publishingNewItemBtn");
  if (newBtn) {
    newBtn.onclick = () => {
      resetForm(session, state);
      showMessage?.("New publishing draft opened.");
      rerender();
    };
  }

  const openQueueBtn = $("publishingOpenQueueBtn");
  if (openQueueBtn) {
    openQueueBtn.onclick = () => {
      document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

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
        session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
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
          "Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."
        );
        if (!confirmed) {
          rerender();
          return;
        }
        await runAndRefresh(
          () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
          { projectName, reloadProjectData, showMessage, showError, successMessage: "Manual publishing completion recorded." }
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
        "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
      );
      if (!confirmed) {
        rerender();
        return;
      }
      
      await runAndRefresh(
        () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
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
        showMessage?.("Local publishing draft marked failed.");
        rerender();
        return;
      }

      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
      if (!confirmed) {
        rerender();
        return;
      }

      await runAndRefresh(
        () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
      );
      rerender();
    };
  }

  const clearAiCommandHandoffBtn = $("publishingClearAiCommandHandoffBtn");
  if (clearAiCommandHandoffBtn) {
    clearAiCommandHandoffBtn.onclick = () => {
      clearAiCommandLocalCampaignHandoff("publishing");
      session.loadedHandoffId = "";
      session.draftMessage = "AI Command campaign handoff cleared locally.";
      saveDraftLocally("AI Command campaign handoff cleared locally.");
      publishingRoute.render(context);
    };
  }

  const loadHandoffBtn = $("publishingLoadHandoffBtn");
  if (loadHandoffBtn) {
    loadHandoffBtn.onclick = () => {
      const summary = extractHandoffSummary(handoff);
      session.form = {
        ...session.form,
        project: firstText(summary.project, session.form.project, projectName),
        campaign: firstText(summary.campaign, session.form.campaign),
        channel: toKey(firstText(summary.channel, session.form.channel)),
        contentItem: firstText(summary.contentItem, summary.summary, session.form.contentItem),
        title: firstText(summary.title, session.form.title),
        notes: firstText(summary.summary, session.form.notes)
      };
      session.loadedHandoffId = summary.id;
      session.isCreatingNew = true;
      session.selectedId = "";
      session.formSourceId = "";
      session.validation = {};
      saveDraftLocally("Workflow output loaded into a local publishing draft.");
      rerender();
    };
  }

  const pushAiBtn = $("publishingPushAiBtn");
  if (pushAiBtn) {
    pushAiBtn.onclick = () => {
      syncSessionForm(session, form);
      const current = selected();
      const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
      const aiDraft = {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
        routeSuggestions: []
      };

      setSharedAiDraft(projectName, aiDraft);
      setSharedHandoff(projectName, "ai-command", {
        source_page: "publishing",
        destination_page: "ai-command",
        linked_entity: {
          entity_type: "publishing_job",
          entity_id: current?.jobId || session.formSourceId || ""
        },
        payload: {
          prompt,
          publishing_item_id: current?.jobId || session.formSourceId || "",
          publishing_title: current?.title || session.form.title || "",
          draft_context: aiDraft,
          selection: {
            status: current?.status || "draft",
            channel: session.form.channel || current?.channel || "",
            scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
            notes: session.form.notes
          }
        },
        status: "available"
      });
      navigateTo("ai-command");
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
      const confirmed = window.confirm(
        "Confirm Publishing Auto Mode start\n\n" +
          "Action: Start guided publishing Auto Mode for the current publishing package.\n" +
          "Risk: This may prepare publishing drafts and handoffs, but must not publish externally or approve Governance decisions without explicit approval.\n\n" +
          "Select Cancel to stop."
      );
      if (!confirmed) return;

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
      const confirmed = window.confirm(
        "Confirm publishing gate approval\n\n" +
          "Action: Approve the current publishing automation gate.\n" +
          "Risk: This advances the guided publishing state, but does not replace Governance approval for protected actions.\n\n" +
          "Select Cancel to keep the gate pending."
      );
      if (!confirmed) return;

      await approveCurrentGate({ context: { getState, navigateTo, projectName } });
      showMessage?.("Approval gate accepted.");
    };
  }

  const autoSkipBtn = $("publishingAutoSkipBtn");
  if (autoSkipBtn) {
    autoSkipBtn.onclick = async () => {
      const confirmed = window.confirm(
        "Confirm publishing step skip\n\n" +
          "Action: Skip the current guided publishing step.\n" +
          "Risk: Skipping may leave a publishing preparation step incomplete and should be used only when intentionally bypassing it.\n\n" +
          "Select Cancel to keep the current step active."
      );
      if (!confirmed) return;

      await skipCurrentStep({ context: { getState, navigateTo, projectName } });
      showMessage?.("Gated step skipped.");
    };
  }
}

export const publishingRoute = {
  id: "publishing",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Execute & Grow",
    title: "Publishing",
    description: "Review, prepare, queue, and record manual publishing status with clear previews and backend-controlled actions."
  },
  template: `
    <section class="page is-active" data-page="publishing">
      <div id="publishingRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage,
    showError,
    reloadProjectData,
    savePublishingSchedule,
    reschedulePublishingItem,
    approvePublishingItem,
    publishPublishingItem,
    failPublishingItem
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const operations = asObject(state.data.operations);
    const queue = buildQueue(state, projectName);
    const session = ensureSession(projectName, state);
    const checks = asObject(state.data.integrations?.readiness?.checks);
    const channels = buildChannels(state, queue);
    const handoff = getPublishingHandoff(projectName, operations);
    const globalBlockers = getReadinessBlockers(state);
    const root = $("publishingRoot");

    if (!root) return;

    if (!session.selectedId && queue.length && !session.isCreatingNew) {
      session.selectedId = queue[0].id;
      syncFormFromItem(session, queue[0]);
    }

    const selectedItem = getSelectedItem(queue, session.selectedId);
    if (selectedItem && selectedItem.id !== session.formSourceId && !session.isCreatingNew) {
      syncFormFromItem(session, selectedItem);
    }


    const visibleQueue = getVisibleQueue(queue, session.filter);
    const counts = getStatusCounts(queue);
    const publishingAssets = filterAssetCategories(getAssetData(state), PUBLISHING_ASSET_KEYS);
    const assetBlockers = publishingAssets.filter((item) => ["Missing", "Needs Review"].includes(item.status));
    const recommendation = buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers });


    root.innerHTML = `
      ${renderScopedStyles()}
      ${renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary: null, queue, blockers: assetBlockers, escapeHtml })}
      ${renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers: assetBlockers, approvalState: selectedItem?.approvalStatus, escapeHtml })}
      ${renderPublishingReadinessSummary({ selectedItem, recommendation, blockers: assetBlockers, assetData: publishingAssets, escapeHtml })}
      <div class="publishing-execution-center">
        ${renderOverview(counts, queue, escapeHtml)}
        ${renderRecommendation(recommendation, counts, assetBlockers, checks, escapeHtml)}

        <div class="publishing-execution-grid">
          <div class="publishing-main-column">
            ${renderQueue(queue, visibleQueue, session.selectedId, session.filter, escapeHtml)}
            ${renderBuilder(session, channels, checks, escapeHtml)}
            <section class="card publishing-card">
              <div class="card-head">
                <div>
                  <div class="setup-kicker">Manual Execution Controls</div>
                  <h3>${escapeHtml(safeText(selectedItem?.title, "Selected publishing item"))}</h3>
                </div>
                <span class="card-badge ${badgeTone(selectedItem?.status || "draft")}">${escapeHtml(selectedItem ? titleCase(selectedItem.status) : "Draft")}</span>
              </div>
              <div class="publishing-action-row">
                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
                <button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>
              </div>
            </section>
          </div>

          <aside class="publishing-side-column">
            ${renderWorkflowHandoff(handoff, session, escapeHtml)}
            ${renderCalendar(queue, escapeHtml)}
            ${renderExecutionResult(queue, escapeHtml)}
            ${renderAssetGate(state, escapeHtml)}
          </aside>
        </div>
      </div>
    `;

    bindPublishingWorkspace({
      $,
      getState,
      navigateTo,
      showMessage,
      showError,
      reloadProjectData,
      savePublishingSchedule,
      reschedulePublishingItem,
      approvePublishingItem,
      publishPublishingItem,
      failPublishingItem,
      render: () => publishingRoute.render({
        getState,
        $,
        escapeHtml,
        safeText,
        navigateTo,
        showMessage,
        showError,
        reloadProjectData,
        savePublishingSchedule,
        reschedulePublishingItem,
        approvePublishingItem,
        publishPublishingItem,
        failPublishingItem
      }),
      queue,
      handoff
    });
  }
};
