import { setSharedAiDraft, setSharedHandoff } from "../shared-context.js";

const publishingSessions = new Map();

const STATUS_FILTERS = ["all", "draft", "scheduled", "ready", "published", "failed"];
const DISPLAY_STATUSES = ["draft", "scheduled", "ready", "published", "failed"];
const SOCIAL_CHANNELS = ["instagram", "facebook", "tiktok", "youtube"];
const PUBLISHING_ROLE_DEFAULTS = {
  serviceDomain: "publishing",
  ownerRole: "publisher",
  reviewRole: "compliance_reviewer",
  upstreamRoles: ["writer", "designer", "video_lead", "strategist"]
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toChannelKey(value) {
  return asString(value).trim().toLowerCase();
}

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIsoDate(value) {
  const date = value instanceof Date ? value : toDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function formatDateTime(value, options = {}) {
  const date = toDate(value);
  if (!date) return "Not scheduled";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options
  }).format(date);
}

function formatDayLabel(value) {
  const date = toDate(value);
  if (!date) return "Unscheduled";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatTimeLabel(value) {
  const date = toDate(value);
  if (!date) return "Time not set";

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function normalizeStatus(value, fallback = "draft") {
  const normalized = toChannelKey(value);

  if (!normalized) return fallback;
  if (normalized === "draft") return "draft";
  if (["queued", "queue", "scheduled", "pending", "pending_publish"].includes(normalized)) return "scheduled";
  if (
    [
      "ready",
      "ready_for_manual_publish",
      "ready_for_manual_send",
      "ready_for_manual_handoff",
      "ready_for_manual_review",
      "manual_publish",
      "manual_send",
      "manual_review"
    ].includes(normalized)
  ) {
    return "ready";
  }
  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) {
    return "published";
  }
  if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";

  return fallback;
}

function normalizeNotes(...groups) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => {
          if (Array.isArray(group)) return group;
          if (typeof group === "string") return group.split(/\n+/);
          return [];
        })
        .map((item) => asString(item).trim())
        .filter(Boolean)
    )
  );
}

function getStatusBadgeClass(status) {
  if (status === "published") return "success";
  if (status === "ready") return "warning";
  if (status === "failed") return "danger";
  return "neutral";
}

function getSortTimestamp(item) {
  return item.scheduledFor || item.executedAt || item.updatedAt || item.createdAt || "";
}

function compareQueueItems(a, b) {
  const order = {
    ready: 0,
    scheduled: 1,
    draft: 2,
    failed: 3,
    published: 4
  };

  const aPriority = order[a.status] ?? 99;
  const bPriority = order[b.status] ?? 99;
  if (aPriority !== bPriority) return aPriority - bPriority;

  const aTime = toDate(getSortTimestamp(a))?.getTime() || 0;
  const bTime = toDate(getSortTimestamp(b))?.getTime() || 0;
  return bTime - aTime;
}

function buildDefaultForm(state, channels) {
  const overview = asObject(state.data.overview?.overview);
  const context = asObject(state.context);
  const checks = asObject(state.data.integrations?.readiness?.checks);
  const preferredChannel =
    channels.find((channel) => checks[channel]) ||
    channels[0] ||
    "instagram";
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(9, 0, 0, 0);

  return {
    title: `${context.activeCampaign || context.currentProject || "Project"} publish`,
    waveName: asString(context.activeCampaign),
    channel: preferredChannel,
    scheduledDate: toIsoDate(tomorrow),
    scheduledTime: "09:00",
    mode: asString(context.executionMode || overview.execution_mode || "semi_auto"),
    offer: asString(overview.value_prop || overview.brand_promise || ""),
    notes: ""
  };
}

function ensureSession(projectName, state, channels) {
  const key = projectName || "__default__";
  if (!publishingSessions.has(key)) {
    publishingSessions.set(key, {
      selectedId: "",
      filter: "all",
      form: buildDefaultForm(state, channels),
      formSourceId: "",
      isCreatingNew: false
    });
  }
  return publishingSessions.get(key);
}

function renderStatusPill(status, escapeHtml) {
  return `<span class="publishing-status-pill is-${escapeHtml(status)}">${escapeHtml(titleCase(status))}</span>`;
}

function mergePreviewData(preview, item, form) {
  const basePreview = asObject(preview);
  const channel = toChannelKey(form?.channel || item?.channel || basePreview.channel);
  const title = asString(form?.title || item?.title || basePreview.title || "Publishing item");
  const offer = asString(form?.offer || item?.offer || basePreview.offer);
  const notes = normalizeNotes(form?.notes, item?.notes, basePreview.notes);
  const body =
    asString(basePreview.body || basePreview.caption) ||
    offer ||
    notes[0] ||
    "";

  return {
    previewType:
      channel === "email"
        ? "email"
        : SOCIAL_CHANNELS.includes(channel)
          ? "social"
          : "listing",
    channel,
    title,
    headline: asString(basePreview.headline || title),
    subject: asString(basePreview.subject || title),
    body,
    caption: asString(basePreview.caption || body),
    cta: asString(basePreview.cta || (channel === "email" ? "Review email" : "Shop now")),
    format: asString(basePreview.format),
    goal: asString(basePreview.goal),
    visualPrompt: asString(basePreview.visual_prompt),
    primaryProductName: asString(basePreview.primary_product_name),
    primaryProductSlug: asString(basePreview.primary_product_slug),
    assetCount: Number(basePreview.asset_count || item?.totalAssets || 0) || 0,
    assetPreviewItems: asArray(basePreview.asset_preview_items),
    offer,
    notes
  };
}

function buildItemTitle(item, context) {
  const channel = titleCase(item.channel || "channel");
  const waveName = asString(item.waveName);
  if (item.title) return item.title;
  if (waveName) return waveName;
  if (context.activeCampaign) return `${context.activeCampaign} ${channel}`;
  return `${channel} publish`;
}

function renderTeamOwnership(state, queue, selectedItem, escapeHtml) {
  const operations = asObject(state.data.operations);
  const handoffsByRole = asObject(operations.handoffs?.by_role);
  const approvalsByRole = asObject(operations.approvals?.by_reviewer_role);
  const ownership = asObject(operations.ownership?.visibility);
  const routing = asObject(operations.routing);

  return `
    <div class="data-stack">
      <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(PUBLISHING_ROLE_DEFAULTS.serviceDomain))}</strong></div>
      <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(PUBLISHING_ROLE_DEFAULTS.ownerRole))}</strong></div>
      <div class="data-row"><span>Review role</span><strong>${escapeHtml(titleCase(PUBLISHING_ROLE_DEFAULTS.reviewRole))}</strong></div>
      <div class="data-row"><span>Upstream roles</span><strong>${escapeHtml(PUBLISHING_ROLE_DEFAULTS.upstreamRoles.map((item) => titleCase(item)).join(" • "))}</strong></div>
      <div class="data-row"><span>Inbound queue</span><strong>${escapeHtml(String(asArray(handoffsByRole[PUBLISHING_ROLE_DEFAULTS.ownerRole]).length))}</strong></div>
      <div class="data-row"><span>Compliance queue</span><strong>${escapeHtml(String(asArray(approvalsByRole[PUBLISHING_ROLE_DEFAULTS.reviewRole]).length))}</strong></div>
      <div class="data-row"><span>Visible entities</span><strong>${escapeHtml(String(ownership.entities || 0))}</strong></div>
      <div class="data-row"><span>Role routes</span><strong>${escapeHtml(String(asArray(routing.role_routes).length || 0))}</strong></div>
      <div class="data-row"><span>Selected item</span><strong>${escapeHtml(selectedItem ? `${titleCase(selectedItem.status)} • ${titleCase(selectedItem.channel || "channel")}` : "No item selected")}</strong></div>
    </div>
  `;
}

function buildQueue(state) {
  const activity = asObject(state.data.activity);
  const results = asArray(activity.execution_results)
    .slice()
    .sort((a, b) => (toDate(b.executed_at)?.getTime() || 0) - (toDate(a.executed_at)?.getTime() || 0));
  const latestResultByJob = new Map();
  results.forEach((result) => {
    const jobId = asString(result.job_id || result.execution_id);
    if (jobId && !latestResultByJob.has(jobId)) {
      latestResultByJob.set(jobId, result);
    }
  });

  const checks = asObject(state.data.integrations?.readiness?.checks);
  const queue = asArray(activity.scheduled_jobs).map((job) => {
    const latestResult = latestResultByJob.get(asString(job.job_id));
    const preview = latestResult?.preview || job.preview || job.connector_preview || {};
    const item = {
      id: asString(job.job_id),
      jobId: asString(job.job_id),
      title: asString(job.title),
      waveName: asString(job.wave_name),
      channel: toChannelKey(job.channel),
      scheduledFor: asString(job.scheduled_for),
      executedAt: asString(latestResult?.executed_at),
      createdAt: asString(job.created_at),
      updatedAt: asString(job.updated_at || latestResult?.executed_at || job.created_at),
      status: normalizeStatus(latestResult?.execution_status || job.status, job.scheduled_for ? "scheduled" : "draft"),
      rawStatus: asString(latestResult?.execution_status || job.status),
      executionStatus: asString(latestResult?.execution_status),
      actionType: asString(latestResult?.action_type),
      mode: asString(job.mode || latestResult?.mode || state.context.executionMode || "semi_auto"),
      offer: asString(job.offer || preview.offer),
      notes: normalizeNotes(job.notes, latestResult?.notes, job.connector_error),
      preview: mergePreviewData(preview, {
        title: asString(job.title),
        channel: toChannelKey(job.channel),
        offer: asString(job.offer),
        totalAssets: Number(job.total_assets || preview.asset_count || 0) || 0,
        notes: normalizeNotes(job.notes, latestResult?.notes)
      }),
      source: latestResult ? "Scheduled job + result" : "Scheduled job",
      totalAssets: Number(job.total_assets || preview.asset_count || 0) || 0,
      connectorReady: Boolean(checks[toChannelKey(job.channel)])
    };

    item.title = buildItemTitle(item, state.context);
    return item;
  });

  const knownIds = new Set(queue.map((item) => item.jobId));
  const orphanResults = results
    .filter((result) => !knownIds.has(asString(result.job_id)))
    .map((result) => {
      const preview = result.preview || {};
      const item = {
        id: asString(result.job_id || result.execution_id),
        jobId: asString(result.job_id || result.execution_id),
        title: asString(result.title),
        waveName: asString(result.wave_name),
        channel: toChannelKey(result.channel),
        scheduledFor: "",
        executedAt: asString(result.executed_at),
        createdAt: asString(result.executed_at),
        updatedAt: asString(result.executed_at),
        status: normalizeStatus(result.execution_status, "draft"),
        rawStatus: asString(result.execution_status),
        executionStatus: asString(result.execution_status),
        actionType: asString(result.action_type),
        mode: asString(result.mode || state.context.executionMode || "semi_auto"),
        offer: asString(result.offer || preview.offer),
        notes: normalizeNotes(result.notes),
        preview: mergePreviewData(preview, {
          title: asString(result.title),
          channel: toChannelKey(result.channel),
          offer: asString(result.offer),
          totalAssets: Number(result.total_assets || preview.asset_count || 0) || 0,
          notes: normalizeNotes(result.notes)
        }),
        source: "Execution result",
        totalAssets: Number(result.total_assets || preview.asset_count || 0) || 0,
        connectorReady: Boolean(checks[toChannelKey(result.channel)])
      };
      item.title = buildItemTitle(item, state.context);
      return item;
    });

  return [...queue, ...orphanResults].sort(compareQueueItems);
}

function buildAvailableChannels(state, queue) {
  const checks = asObject(state.data.integrations?.readiness?.checks);
  return Array.from(
    new Set(
      [
        ...Object.keys(checks),
        ...queue.map((item) => item.channel),
        "instagram",
        "facebook",
        "tiktok",
        "youtube",
        "email",
        "amazon",
        "ebay",
        "website"
      ]
        .map(toChannelKey)
        .filter(Boolean)
    )
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

function syncFormFromItem(session, item) {
  if (!item) return;
  const scheduledDate = item.scheduledFor ? toIsoDate(item.scheduledFor) : "";
  const scheduledTime = item.scheduledFor
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(toDate(item.scheduledFor))
    : "";

  session.form = {
    title: item.title || "",
    waveName: item.waveName || "",
    channel: item.channel || "",
    scheduledDate,
    scheduledTime,
    mode: item.mode || "semi_auto",
    offer: item.offer || "",
    notes: normalizeNotes(item.notes).join("\n")
  };
  session.formSourceId = item.id;
  session.isCreatingNew = false;
}

function resetForm(session, state, channels) {
  session.form = buildDefaultForm(state, channels);
  session.formSourceId = "";
  session.selectedId = "";
  session.isCreatingNew = true;
}

function buildPreviewModel(state, session, selectedItem) {
  if (!selectedItem && !session.isCreatingNew) return null;

  const previewSource = selectedItem?.preview || {};
  const notes = normalizeNotes(session.form.notes, selectedItem?.notes, previewSource.notes);
  const channel = toChannelKey(session.form.channel || selectedItem?.channel || previewSource.channel);
  const title = asString(session.form.title || selectedItem?.title || previewSource.title || "Publishing item");

  return {
    ...mergePreviewData(previewSource, selectedItem, session.form),
    channel,
    title,
    headline: asString(previewSource.headline || title),
    subject: asString(previewSource.subject || title),
    body:
      asString(previewSource.body || previewSource.caption) ||
      asString(session.form.offer) ||
      notes[0] ||
      "Preview content will appear here when this publishing item includes channel-ready copy or offer context.",
    caption:
      asString(previewSource.caption || previewSource.body) ||
      asString(session.form.offer) ||
      notes[0] ||
      "Preview copy will appear here.",
    cta: asString(previewSource.cta || (channel === "email" ? "Review email" : "Shop now")),
    notes
  };
}

function buildChannelCards(state, queue) {
  const checks = asObject(state.data.integrations?.readiness?.checks);
  const channels = buildAvailableChannels(state, queue);
  return channels.map((channel) => {
    const items = queue.filter((item) => item.channel === channel);
    const counts = getStatusCounts(items);
    const connected = checks[channel] === true;
    const summaryStatus = counts.failed
      ? "failed"
      : counts.ready
        ? "ready"
        : counts.scheduled
          ? "scheduled"
          : counts.published
            ? "published"
            : "draft";

    const issues = [];
    if (!connected) issues.push("Connector missing");
    if (counts.ready) issues.push(`${counts.ready} waiting for approval or manual publish`);
    if (counts.draft) issues.push(`${counts.draft} still in planning`);
    if (!items.length) issues.push("No queued items");

    return {
      channel,
      connected,
      summaryStatus,
      total: items.length,
      counts,
      issues
    };
  });
}

function renderFilterRow(filter, queue, escapeHtml) {
  const counts = getStatusCounts(queue);
  const allCount = queue.length;

  return `
    <div class="publishing-filter-row">
      ${STATUS_FILTERS.map((status) => {
        const isActive = filter === status;
        const count = status === "all" ? allCount : counts[status];
        return `
          <button class="publishing-filter-chip${isActive ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
            <span>${escapeHtml(status === "all" ? "All items" : titleCase(status))}</span>
            <strong>${escapeHtml(String(count))}</strong>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderQueueList(items, selectedId, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">No publishing items match the current view. Adjust the filter or create a new schedule.</div>`;
  }

  return `
    <div class="publishing-queue-list">
      ${items.map((item) => `
        <button class="publishing-queue-item${item.id === selectedId ? " is-active" : ""}" type="button" data-publishing-select="${escapeHtml(item.id)}">
          <div class="publishing-queue-head">
            <div class="publishing-queue-copy">
              <span class="publishing-queue-title">${escapeHtml(item.title)}</span>
              <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "No schedule slot yet")}</span>
            </div>
            ${renderStatusPill(item.status, escapeHtml)}
          </div>
          <div class="publishing-queue-foot">
            <span>${escapeHtml(item.connectorReady ? "Connector ready" : "Connector missing")}</span>
            <span>${escapeHtml(item.totalAssets ? `${item.totalAssets} linked assets` : "No linked assets yet")}</span>
          </div>
        </button>
      `).join("")}
    </div>
  `;
}

function renderPreview(previewModel, selectedItem, escapeHtml) {
  if (!previewModel) {
    return `<div class="empty-box">Select a publishing item or start a new one to review the channel preview before approval.</div>`;
  }

  const sourceMeta = [
    previewModel.primaryProductName ? `Hero product: ${previewModel.primaryProductName}` : "",
    previewModel.goal ? `Goal: ${previewModel.goal}` : "",
    previewModel.format ? `Format: ${previewModel.format}` : ""
  ].filter(Boolean).join(" • ");

  const summaryRows = `
    <div class="data-stack">
      <div class="data-row"><span>Channel</span><strong>${escapeHtml(titleCase(previewModel.channel || "unassigned"))}</strong></div>
      <div class="data-row"><span>Status</span><strong>${escapeHtml(titleCase(selectedItem?.status || "draft"))}</strong></div>
      <div class="data-row"><span>Schedule</span><strong>${escapeHtml(selectedItem?.scheduledFor ? formatDateTime(selectedItem.scheduledFor) : "Draft / unscheduled")}</strong></div>
      <div class="data-row"><span>Assets</span><strong>${escapeHtml(String(previewModel.assetCount || 0))}</strong></div>
    </div>
  `;

  const assetItems = previewModel.assetPreviewItems.length
    ? `
      <div class="publishing-preview-assets">
        ${previewModel.assetPreviewItems.map((asset) => `
          <div class="publishing-asset-chip">
            <strong>${escapeHtml(asset.product_name || asset.product_slug || "Linked asset")}</strong>
            <span>${escapeHtml(asset.format || asset.goal || asset.category || "Preview linked")}</span>
          </div>
        `).join("")}
      </div>
    `
    : `<div class="publishing-preview-note">No channel asset package is attached yet. The preview is using the current schedule details and offer context.</div>`;

  const mockup = previewModel.previewType === "email"
    ? `
      <div class="publishing-email-mock">
        <div class="publishing-email-head">
          <span>${escapeHtml(titleCase(previewModel.channel))}</span>
          <strong>${escapeHtml(previewModel.subject)}</strong>
        </div>
        <div class="publishing-email-body">
          <h4>${escapeHtml(previewModel.headline)}</h4>
          <p>${escapeHtml(previewModel.body)}</p>
          <button type="button">${escapeHtml(previewModel.cta)}</button>
        </div>
      </div>
    `
    : `
      <div class="publishing-social-mock">
        <div class="publishing-social-head">
          <span class="publishing-social-badge">${escapeHtml(titleCase(previewModel.channel || "channel"))}</span>
          <strong>${escapeHtml(previewModel.title)}</strong>
        </div>
        <div class="publishing-social-body">
          <div class="publishing-social-visual">${escapeHtml(previewModel.primaryProductName || "Channel-ready visual slot")}</div>
          <p>${escapeHtml(previewModel.caption)}</p>
          <button type="button">${escapeHtml(previewModel.cta)}</button>
        </div>
      </div>
    `;

  return `
    <div class="publishing-preview-layout">
      <div class="publishing-preview-stage">
        ${mockup}
        ${previewModel.visualPrompt ? `<div class="publishing-preview-note">${escapeHtml(previewModel.visualPrompt)}</div>` : ""}
      </div>
      <div class="publishing-preview-side">
        ${summaryRows}
        ${sourceMeta ? `<div class="publishing-preview-note">${escapeHtml(sourceMeta)}</div>` : ""}
        ${assetItems}
      </div>
    </div>
  `;
}

function renderCalendar(queue, escapeHtml) {
  const scheduledItems = queue
    .filter((item) => item.scheduledFor)
    .sort((a, b) => (toDate(a.scheduledFor)?.getTime() || 0) - (toDate(b.scheduledFor)?.getTime() || 0));

  if (!scheduledItems.length) {
    return `<div class="empty-box">The calendar is still empty. Save a schedule to build the upcoming publishing run sheet.</div>`;
  }

  const grouped = scheduledItems.reduce((acc, item) => {
    const key = toIsoDate(item.scheduledFor);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return `
    <div class="publishing-calendar-grid">
      ${Object.keys(grouped).sort().map((day) => `
        <section class="publishing-day-card">
          <div class="publishing-day-head">
            <div>
              <h4>${escapeHtml(formatDayLabel(day))}</h4>
              <p>${escapeHtml(grouped[day].length === 1 ? "1 scheduled action" : `${grouped[day].length} scheduled actions`)}</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(day)}</span>
          </div>
          <div class="publishing-day-list">
            ${grouped[day].map((item) => `
              <button class="publishing-calendar-item" type="button" data-publishing-select="${escapeHtml(item.id)}">
                <span class="publishing-calendar-time">${escapeHtml(formatTimeLabel(item.scheduledFor))}</span>
                <span class="publishing-calendar-label">${escapeHtml(item.title)}</span>
                ${renderStatusPill(item.status, escapeHtml)}
              </button>
            `).join("")}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderChannelStatus(cards, escapeHtml) {
  if (!cards.length) {
    return `<div class="empty-box">Channel health will appear here once publishing connectors or queue items are available.</div>`;
  }

  return `
    <div class="publishing-channel-grid">
      ${cards.map((card) => `
        <section class="publishing-channel-card">
          <div class="publishing-channel-head">
            <div>
              <h4>${escapeHtml(titleCase(card.channel))}</h4>
              <p>${escapeHtml(card.connected ? "Connected and eligible" : "Needs connector setup")}</p>
            </div>
            ${renderStatusPill(card.summaryStatus, escapeHtml)}
          </div>
          <div class="data-stack">
            <div class="data-row"><span>Queue</span><strong>${escapeHtml(String(card.total))}</strong></div>
            <div class="data-row"><span>Ready / Published</span><strong>${escapeHtml(`${card.counts.ready} / ${card.counts.published}`)}</strong></div>
            <div class="data-row"><span>Draft / Failed</span><strong>${escapeHtml(`${card.counts.draft} / ${card.counts.failed}`)}</strong></div>
          </div>
          <div class="publishing-preview-note">${escapeHtml(card.issues.join(" • "))}</div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderActionSummary(selectedItem, checks, escapeHtml) {
  if (!selectedItem) {
    return `<div class="empty-box">Select a queue item to approve it, publish it immediately, or send it back to the scheduled queue.</div>`;
  }

  return `
    <div class="data-stack">
      <div class="data-row"><span>Selected item</span><strong>${escapeHtml(selectedItem.title)}</strong></div>
      <div class="data-row"><span>Channel</span><strong>${escapeHtml(titleCase(selectedItem.channel))}</strong></div>
      <div class="data-row"><span>Connector</span><strong>${escapeHtml(checks[selectedItem.channel] ? "Ready" : "Missing")}</strong></div>
      <div class="data-row"><span>Current state</span><strong>${escapeHtml(titleCase(selectedItem.status))}</strong></div>
      <div class="data-row"><span>Next slot</span><strong>${escapeHtml(selectedItem.scheduledFor ? formatDateTime(selectedItem.scheduledFor) : "Not scheduled")}</strong></div>
    </div>
  `;
}

function buildSchedulePayload(session, status = "scheduled") {
  return {
    title: session.form.title,
    wave_name: session.form.waveName,
    channel: session.form.channel,
    scheduled_for: session.form.scheduledDate
      ? `${session.form.scheduledDate}T${session.form.scheduledTime || "09:00"}:00Z`
      : "",
    status,
    mode: session.form.mode,
    offer: session.form.offer,
    notes: session.form.notes
  };
}

function buildPublishingAiPrompt(projectName, selectedItem, session) {
  const title = asString(session.form.title || selectedItem?.title || "publishing item");
  const channel = titleCase(session.form.channel || selectedItem?.channel || "channel");
  const schedule = session.form.scheduledDate
    ? `${session.form.scheduledDate} ${session.form.scheduledTime || "09:00"}`
    : (selectedItem?.scheduledFor ? formatDateTime(selectedItem.scheduledFor) : "not scheduled");
  const offer = asString(session.form.offer || selectedItem?.offer || "not defined");
  const notes = asString(session.form.notes || normalizeNotes(selectedItem?.notes).join("; ") || "none");

  return `Review this publishing plan for ${projectName || "the current project"}.\n\nTitle: ${title}\nChannel: ${channel}\nSchedule: ${schedule}\nStatus: ${titleCase(selectedItem?.status || "draft")}\nOffer: ${offer}\nNotes: ${notes}\n\nHelp improve the publish plan, approval notes, and operator handoff.`;
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
  channels
}) {
  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, state, channels);
  const selectedItem = getSelectedItem(queue, session.selectedId);

  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
    button.onclick = () => {
      session.filter = button.getAttribute("data-publishing-filter") || "all";
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
    button.onclick = () => {
      session.selectedId = button.getAttribute("data-publishing-select") || "";
      syncFormFromItem(session, getSelectedItem(queue, session.selectedId));
      render();
    };
  });

  const form = $("publishingScheduleForm");
  if (form) {
    form.oninput = (event) => {
      const target = event.target;
      if (!target?.name) return;
      session.form[target.name] = target.value || "";
    };
  }

  const newItemBtn = $("publishingNewItemBtn");
  if (newItemBtn) {
    newItemBtn.onclick = () => {
      resetForm(session, state, channels);
      render();
      showMessage?.("New publishing draft opened in the schedule controls.");
    };
  }

  const saveDraftBtn = $("publishingSaveDraftBtn");
  if (saveDraftBtn) {
    saveDraftBtn.onclick = async () => {
      if (!asString(session.form.title).trim()) {
        showError?.("Add a publishing title before saving the draft.");
        return;
      }

      const response = await runAndRefresh(
        () => savePublishingSchedule(projectName, {
          title: session.form.title,
          wave_name: session.form.waveName,
          channel: session.form.channel,
          scheduled_for: session.form.scheduledDate
            ? `${session.form.scheduledDate}T${session.form.scheduledTime || "09:00"}:00Z`
            : "",
          status: "draft",
          mode: session.form.mode,
          offer: session.form.offer,
          notes: session.form.notes
        }),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError,
          successMessage: "Publishing draft saved."
        }
      );

      if (response?.job?.job_id) {
        session.selectedId = response.job.job_id;
        session.formSourceId = response.job.job_id;
        session.isCreatingNew = false;
      }
    };
  }

  const scheduleBtn = $("publishingScheduleBtn");
  if (scheduleBtn) {
    scheduleBtn.onclick = async () => {
      if (!asString(session.form.title).trim()) {
        showError?.("Add a publishing title before saving the schedule.");
        return;
      }
      if (!asString(session.form.channel).trim()) {
        showError?.("Choose a channel before saving the schedule.");
        return;
      }
      if (!asString(session.form.scheduledDate).trim()) {
        showError?.("Choose a schedule date before saving.");
        return;
      }

      const payload = buildSchedulePayload(session, "scheduled");

      const action = selectedItem
        ? () => reschedulePublishingItem(projectName, selectedItem.jobId, payload)
        : () => savePublishingSchedule(projectName, payload);

      const response = await runAndRefresh(action, {
        projectName,
        reloadProjectData,
        showMessage,
        showError,
        successMessage: selectedItem ? "Publishing item rescheduled." : "Publishing schedule saved."
      });

      if (response?.job?.job_id) {
        session.selectedId = response.job.job_id;
        session.formSourceId = response.job.job_id;
        session.isCreatingNew = false;
      }
    };
  }

  const requeueBtn = $("publishingRequeueBtn");
  if (requeueBtn) {
    requeueBtn.onclick = async () => {
      if (!selectedItem) {
        showError?.("Select a publishing item before requeueing it.");
        return;
      }
      if (!asString(session.form.channel).trim()) {
        showError?.("Choose a channel before requeueing.");
        return;
      }
      if (!asString(session.form.scheduledDate).trim()) {
        showError?.("Choose a schedule date before requeueing.");
        return;
      }

      await runAndRefresh(
        () => reschedulePublishingItem(projectName, selectedItem.jobId, buildSchedulePayload(session, "scheduled")),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError,
          successMessage: "Publishing item returned to the scheduled queue."
        }
      );
    };
  }

  const approveBtn = $("publishingApproveBtn");
  if (approveBtn) {
    approveBtn.onclick = async () => {
      if (!selectedItem) {
        showError?.("Select a publishing item before approving it.");
        return;
      }

      await runAndRefresh(
        () => approvePublishingItem(projectName, selectedItem.jobId, {
          notes: session.form.notes || selectedItem.notes
        }),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError,
          successMessage: "Publishing item approved and marked ready."
        }
      );
    };
  }

  const publishBtn = $("publishingPublishNowBtn");
  if (publishBtn) {
    publishBtn.onclick = async () => {
      if (!selectedItem) {
        showError?.("Select a publishing item before marking it published.");
        return;
      }

      await runAndRefresh(
        () => publishPublishingItem(projectName, selectedItem.jobId, {
          notes: session.form.notes || selectedItem.notes
        }),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError,
          successMessage: "Publishing item marked as published."
        }
      );
    };
  }

  const failBtn = $("publishingFailBtn");
  if (failBtn) {
    failBtn.onclick = async () => {
      if (!selectedItem) {
        showError?.("Select a publishing item before marking it failed.");
        return;
      }

      await runAndRefresh(
        () => failPublishingItem(projectName, selectedItem.jobId, {
          notes: session.form.notes || selectedItem.notes
        }),
        {
          projectName,
          reloadProjectData,
          showMessage,
          showError,
          successMessage: "Publishing item marked as failed."
        }
      );
    };
  }

  const manageChannelsBtn = $("publishingManageChannelsBtn");
  if (manageChannelsBtn) {
    manageChannelsBtn.onclick = () => navigateTo("integrations");
  }

  const pushAiBtn = $("publishingPushAiBtn");
  if (pushAiBtn) {
    pushAiBtn.onclick = () => {
      const prompt = buildPublishingAiPrompt(projectName, selectedItem, session);
      const aiDraft = {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: selectedItem?.title || session.form.title || "Publishing Review",
        routeSuggestions: []
      };

      setSharedAiDraft(projectName, aiDraft);
      setSharedHandoff(projectName, "ai-command", {
        source_page: "publishing",
        destination_page: "ai-command",
        linked_entity: {
          entity_type: "publishing_job",
          entity_id: selectedItem?.jobId || ""
        },
        payload: {
          prompt,
          publishing_item_id: selectedItem?.jobId || "",
          publishing_title: selectedItem?.title || session.form.title || "",
          draft_context: aiDraft,
          selection: {
            status: selectedItem?.status || "draft",
            channel: session.form.channel || selectedItem?.channel || "",
            scheduled_for: session.form.scheduledDate
              ? `${session.form.scheduledDate}T${session.form.scheduledTime || "09:00"}:00Z`
              : (selectedItem?.scheduledFor || ""),
            notes: session.form.notes
          }
        }
      });

      navigateTo("ai-command");
      const globalInput = $("quickCommandInput");
      if (globalInput) {
        globalInput.value = prompt;
      }
      showMessage?.("Publishing context sent to AI Command.");
    };
  }
}

export const publishingRoute = {
  id: "publishing",
  meta: {
    eyebrow: "Execute & Grow",
    title: "Publishing",
    description: "Review, approve, schedule, and control publishing with clear previews and real backend actions."
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
    const overview = asObject(state.data.overview?.overview);
    const queue = buildQueue(state);
    const channels = buildAvailableChannels(state, queue);
    const session = ensureSession(projectName, state, channels);

    if (!session.selectedId && queue.length) {
      session.selectedId = queue[0].id;
      if (!session.formSourceId && !session.isCreatingNew) {
        syncFormFromItem(session, queue[0]);
      }
    }

    const selectedItem = getSelectedItem(queue, session.selectedId);
    if (selectedItem && session.formSourceId !== selectedItem.id && !session.isCreatingNew) {
      syncFormFromItem(session, selectedItem);
    }

    const checks = asObject(state.data.integrations?.readiness?.checks);
    const visibleQueue = getVisibleQueue(queue, session.filter);
    const statusCounts = getStatusCounts(queue);
    const previewModel = buildPreviewModel(state, session, selectedItem);
    const channelCards = buildChannelCards(state, queue);
    const root = $("publishingRoot");

    if (!root) return;

    root.innerHTML = `
      <div class="publishing-wrapper">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Publishing Control Workspace</div>
              <h3>Publishing Overview</h3>
              <p class="publishing-section-copy">Use this page in order: review the schedule, inspect the queue, confirm channel state, then approve, publish, or requeue the selected item.</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(safeText(overview.project_name, projectName || "Publishing"))}</span>
          </div>
          <div class="publishing-overview-grid">
            <div class="publishing-overview-item">
              <span>Ready now</span>
              <strong>${escapeHtml(String(statusCounts.ready))}</strong>
            </div>
            <div class="publishing-overview-item">
              <span>Scheduled</span>
              <strong>${escapeHtml(String(statusCounts.scheduled))}</strong>
            </div>
            <div class="publishing-overview-item">
              <span>Connected channels</span>
              <strong>${escapeHtml(String(channelCards.filter((card) => card.connected).length))}</strong>
            </div>
            <div class="publishing-overview-item">
              <span>Selected item</span>
              <strong>${escapeHtml(selectedItem ? selectedItem.title : "No item selected")}</strong>
            </div>
          </div>
        </section>

        <div class="publishing-workspace-grid">
          <section class="card">
            <div class="card-head">
              <div>
                <h3>Schedule / Calendar</h3>
                <p class="publishing-section-copy">Schedule updates timing only. New Item opens a fresh draft. Open Integrations is navigation only.</p>
              </div>
              <span class="card-badge neutral">${escapeHtml(queue.filter((item) => item.scheduledFor).length ? `${queue.filter((item) => item.scheduledFor).length} scheduled` : "No scheduled slots")}</span>
            </div>
            <div class="publishing-toolbar">
              <button id="publishingManageChannelsBtn" class="btn btn-secondary" type="button">Open Integrations</button>
              <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Item</button>
            </div>
            <form id="publishingScheduleForm" class="setup-form-grid">
              <div class="setup-field-group">
                <div class="setup-field-head">
                  <label class="setup-label" for="publishingTitleInput">Publishing title</label>
                  <span class="setup-field-state is-optional">Required</span>
                </div>
                <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Wave 1 hero post">
                <div class="setup-helper">Use the title operators should recognize in the queue and approval flow.</div>
              </div>

              <div class="setup-form-grid setup-form-grid-2">
                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingWaveInput">Campaign / wave</label>
                    <span class="setup-field-state is-optional">Optional</span>
                  </div>
                  <input id="publishingWaveInput" name="waveName" class="setup-input" type="text" value="${escapeHtml(session.form.waveName)}" placeholder="wave1_beard">
                  <div class="setup-helper">Attach the schedule to a campaign wave when that context matters.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingChannelInput">Channel</label>
                    <span class="setup-field-state is-optional">${escapeHtml(checks[toChannelKey(session.form.channel)] ? "Connected" : "Planning")}</span>
                  </div>
                  <select id="publishingChannelInput" name="channel" class="setup-input">
                    ${channels.map((channel) => `
                      <option value="${escapeHtml(channel)}"${channel === session.form.channel ? " selected" : ""}>${escapeHtml(titleCase(channel))}</option>
                    `).join("")}
                  </select>
                  <div class="setup-helper">Choose the delivery channel for this schedule slot.</div>
                </div>
              </div>

              <div class="setup-form-grid setup-form-grid-2">
                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingDateInput">Publish date</label>
                    <span class="setup-field-state is-optional">Calendar</span>
                  </div>
                  <input id="publishingDateInput" name="scheduledDate" class="setup-input" type="date" value="${escapeHtml(session.form.scheduledDate)}">
                  <div class="setup-helper">Set the day this item should be queued to publish.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingTimeInput">Publish time</label>
                    <span class="setup-field-state is-optional">Slot</span>
                  </div>
                  <input id="publishingTimeInput" name="scheduledTime" class="setup-input" type="time" value="${escapeHtml(session.form.scheduledTime)}">
                  <div class="setup-helper">Use the exact release time the queue should follow.</div>
                </div>
              </div>

              <div class="setup-form-grid setup-form-grid-2">
                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingModeInput">Mode</label>
                    <span class="setup-field-state is-optional">Execution</span>
                  </div>
                  <select id="publishingModeInput" name="mode" class="setup-input">
                    ${["manual", "semi_auto", "full_auto"].map((mode) => `
                      <option value="${escapeHtml(mode)}"${mode === session.form.mode ? " selected" : ""}>${escapeHtml(titleCase(mode))}</option>
                    `).join("")}
                  </select>
                  <div class="setup-helper">Keep the timing plan aligned with the intended publish mode.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="publishingOfferInput">Offer / angle</label>
                    <span class="setup-field-state is-optional">Commercial focus</span>
                  </div>
                  <input id="publishingOfferInput" name="offer" class="setup-input" type="text" value="${escapeHtml(session.form.offer)}" placeholder="Premium beard routine with stronger results">
                  <div class="setup-helper">Keep the commercial angle visible while setting timing.</div>
                </div>
              </div>

              <div class="setup-field-group">
                <div class="setup-field-head">
                  <label class="setup-label" for="publishingNotesInput">Operator notes</label>
                  <span class="setup-field-state is-optional">Context</span>
                </div>
                <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="CTA, review notes, manual publish steps, asset references, or risk notes">${escapeHtml(session.form.notes)}</textarea>
                <div class="setup-helper">Keep notes short and operator-focused.</div>
              </div>
            </form>

            <div class="publishing-form-actions">
              <button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
              <button id="publishingScheduleBtn" class="btn btn-primary" type="button">${escapeHtml(selectedItem ? "Update Timing" : "Schedule")}</button>
            </div>
            ${renderCalendar(queue, escapeHtml)}
          </section>

          <section class="card">
            <div class="card-head">
              <div>
                <h3>Publish Queue</h3>
                <p class="publishing-section-copy">Review queue items here. Selecting an item loads it into the schedule and action panels without publishing it.</p>
              </div>
              <span class="card-badge neutral">${escapeHtml(`${visibleQueue.length} visible`)}</span>
            </div>
            ${renderFilterRow(session.filter, queue, escapeHtml)}
            ${renderQueueList(visibleQueue, session.selectedId, escapeHtml)}
          </section>

          <section class="card">
            <div class="card-head">
              <div>
                <h3>Approval / Publish Actions</h3>
                <p class="publishing-section-copy">Approve marks the item ready. Publish Now records an immediate publish. Requeue sends the item back to the scheduled queue using the current timing fields.</p>
              </div>
              <span class="card-badge ${getStatusBadgeClass(selectedItem?.status || "draft")}">${escapeHtml(selectedItem ? titleCase(selectedItem.status) : "Draft view")}</span>
            </div>
            ${renderPreview(previewModel, selectedItem, escapeHtml)}
            ${renderActionSummary(selectedItem, checks, escapeHtml)}
            <div class="publishing-manual-actions">
              <button id="publishingApproveBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Approve</span>
                <span class="home-action-meta">Move the selected item into a ready state after review.</span>
              </button>
              <button id="publishingPublishNowBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Publish Now</span>
                <span class="home-action-meta">Trigger the immediate publish action for the selected item.</span>
              </button>
              <button id="publishingRequeueBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Requeue</span>
                <span class="home-action-meta">Send the selected item back to the scheduled queue using the current timing fields.</span>
              </button>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div>
                <h3>Channel Status</h3>
                <p class="publishing-section-copy">Use this section to understand connector readiness and queue pressure by channel before publishing.</p>
              </div>
              <span class="card-badge neutral">${escapeHtml(`${channelCards.filter((card) => card.connected).length} connected`)}</span>
            </div>
            ${renderChannelStatus(channelCards, escapeHtml)}
          </section>

          <aside class="publishing-side-stack">
            <section class="card">
              <div class="card-head">
                <h3>Publishing AI Assistant</h3>
                <span class="card-badge neutral">Assist</span>
              </div>
              <p class="publishing-section-copy">Send to AI Command prefills the current publishing context and then navigates there. It does not schedule or publish anything.</p>
              <div class="publishing-manual-actions">
                <button id="publishingPushAiBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to AI Command</span>
                  <span class="home-action-meta">Prefill AI Command with the selected publishing item or current draft and open that page.</span>
                </button>
              </div>
              <div class="publishing-helper-note">Open Integrations is navigation only. Schedule updates timing. Publish Now is immediate. Requeue returns the selected item to the scheduled queue.</div>
            </section>
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
      channels
    });
  }
};
