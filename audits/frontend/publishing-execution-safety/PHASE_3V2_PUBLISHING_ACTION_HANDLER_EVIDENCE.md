# PHASE 3V.2 — Publishing Action Handler Evidence

## Handler summary
82:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
94:  approveCurrentGate,
130:function schedulePublishingRender(render) {
172:    schedulePublishingRender();
319:function saveLocalDraft(projectName, draft) {
337:  return saveLocalDraft(projectName, {
636:function confirmPublishingBackendAction(message) {
1461:  reschedulePublishingItem,
1477:    schedulePublishingRender(render);
1486:    const local = saveLocalDraft(projectName, buildLocalDraftPayload(session, "draft"));
1518:    button.onclick = () => {
1525:    button.onclick = () => {
1546:    newBtn.onclick = () => {
1555:    openQueueBtn.onclick = () => {
1562:    button.onclick = async () => {
1575:    scheduleBtn.onclick = async () => {
1599:      const confirmed = confirmPublishingBackendAction(
1610:        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
1632:    button.onclick = async () => {
1686:        const confirmed = confirmPublishingBackendAction(
1695:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
1705:        const confirmed = confirmPublishingBackendAction(
1714:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
1724:    approveBtn.onclick = async () => {
1739:      const confirmed = confirmPublishingBackendAction(
1757:    failBtn.onclick = async () => {
1787:    loadHandoffBtn.onclick = () => {
1810:    pushAiBtn.onclick = () => {
1822:      setSharedAiDraft(projectName, aiDraft);
1823:      setSharedHandoff(projectName, "ai-command", {
1849:  const autoPrepareBtn = $("publishingAutoPrepareBtn");
1850:  if (autoPrepareBtn) {
1851:    autoPrepareBtn.onclick = async () => {
1871:        schedulePublishingRender(render);
1885:    autoStopBtn.onclick = () => {
1891:  const autoApproveBtn = $("publishingAutoApproveBtn");
1892:  if (autoApproveBtn) {
1893:    autoApproveBtn.onclick = async () => {
1894:      await approveCurrentGate({ context: { getState, navigateTo, projectName } });
1899:  const autoSkipBtn = $("publishingAutoSkipBtn");
1900:  if (autoSkipBtn) {
1901:    autoSkipBtn.onclick = async () => {
1931:    reschedulePublishingItem,
2013:      reschedulePublishingItem,
2027:        reschedulePublishingItem,

## Key function ranges

### Form validation / intent / approval
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
      action: "Publish now to external channels",
      payload: {
        prompt: draftPrompt,
        reason: "Publishing is gated and requires manual approval."
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
    errors.approvalStatus = "Approval must be approved before publishing now.";
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

### Builder / package render area
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
          <div class="setup-kicker">Workflow Handoff</div>
          <h3>${escapeHtml(summary.title)}</h3>
          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>
        </div>
        <span class="card-badge ${isLoaded ? "success" : "neutral"}">${escapeHtml(isLoaded ? "Loaded" : "Available")}</span>
      </div>
      <div class="data-stack">
        <div class="data-row"><span>Source</span><strong>${escapeHtml(titleCase(summary.sourcePage))}</strong></div>
        <div class="data-row"><span>Workflow</span><strong>${escapeHtml(summary.workflowId || "Not specified")}</strong></div>
        <div class="data-row"><span>Campaign</span><strong>${escapeHtml(summary.campaign || "Not specified")}</strong></div>
        <div class="data-row"><span>Channel</span><strong>${escapeHtml(summary.channel || "Not specified")}</strong></div>
      </div>
      <div class="publishing-action-row">
        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
      </div>
    </section>
  `;

### Binding handlers
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
  meta: {
    eyebrow: "Execute & Grow",
    title: "Publishing",
    description: "Review, approve, schedule, and control publishing with clear previews and real backend actions."
  },

### Route render
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
                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare Governance Review. Confirmation required before execution. Backend approval rules apply.">Mark item ready for publishing</button>
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
