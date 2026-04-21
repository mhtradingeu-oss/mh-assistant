import {
  createProjectApproval,
  createProjectHandoff,
  createProjectTask,
  decideProjectApproval,
  fetchProjectOperations,
  listProjectApprovals,
  listProjectContentItems,
  listProjectEvents,
  listProjectHandoffs,
  listProjectMediaJobs,
  listProjectTasks,
  saveProjectMediaJob
} from "../api.js";

const mediaStudioSessions = new Map();
const REQUEST_TYPES = ["image", "video"];
const MEDIA_ROLE_DEFAULTS = {
  serviceDomain: "media",
  designRole: "designer",
  videoRole: "video_lead",
  reviewRole: "compliance_reviewer",
  handoffRole: "publisher"
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

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function getTeamRole(session, roleKey) {
  return asObject(session.operations?.team_service_model?.roles?.[roleKey]);
}

function roleLabel(session, roleKey, fallback) {
  return asString(getTeamRole(session, roleKey).label || fallback || titleCase(roleKey));
}

function getMediaOwnerRole(item) {
  if (asString(item?.owner_role)) return asString(item.owner_role);
  return asString(item?.request_type) === "video" ? MEDIA_ROLE_DEFAULTS.videoRole : MEDIA_ROLE_DEFAULTS.designRole;
}

function renderMediaOwnershipCard(session, item, escapeHtml) {
  const ownerRole = getMediaOwnerRole(item);

  return `
    <div class="data-stack">
      <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(MEDIA_ROLE_DEFAULTS.serviceDomain))}</strong></div>
      <div class="data-row"><span>Owner role</span><strong>${escapeHtml(roleLabel(session, ownerRole, asString(item?.request_type) === "video" ? "Video Lead" : "Designer"))}</strong></div>
      <div class="data-row"><span>Review role</span><strong>${escapeHtml(roleLabel(session, MEDIA_ROLE_DEFAULTS.reviewRole, "Compliance Reviewer"))}</strong></div>
      <div class="data-row"><span>Next handoff</span><strong>${escapeHtml(roleLabel(session, MEDIA_ROLE_DEFAULTS.handoffRole, "Publisher"))}</strong></div>
      <div class="data-row"><span>Visible entities</span><strong>${escapeHtml(formatCount(asObject(session.operations?.ownership?.visibility).entities || 0))}</strong></div>
      <div class="data-row"><span>Review queue</span><strong>${escapeHtml(formatCount(asArray(session.operations?.approvals?.by_reviewer_role?.[MEDIA_ROLE_DEFAULTS.reviewRole]).length))}</strong></div>
      <div class="data-row"><span>Inbound handoffs</span><strong>${escapeHtml(formatCount(asArray(session.operations?.handoffs?.by_role?.[ownerRole]).length))}</strong></div>
    </div>
  `;
}

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!mediaStudioSessions.has(key)) {
    mediaStudioSessions.set(key, {
      loaded: false,
      loading: false,
      error: "",
      items: [],
      contentItems: [],
      tasks: [],
      approvals: [],
      handoffs: [],
      events: [],
      operations: null,
      selectedId: "",
      previewNoteDraft: "",
      commentDraft: "",
      outputLabelDraft: ""
    });
  }
  return mediaStudioSessions.get(key);
}

function defaultMediaJob(state, requestType = "image") {
  const context = asObject(state.context);
  const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
  return {
    title: `${campaignName} ${requestType} request`,
    request_type: requestType,
    prompt: "",
    brief: "",
    provider: requestType === "video" ? "runway" : "openai",
    model: requestType === "video" ? "gen-4" : "gpt-image-1",
    owner: requestType === "video" ? "Video Lead" : "Designer",
    owner_role: requestType === "video" ? MEDIA_ROLE_DEFAULTS.videoRole : MEDIA_ROLE_DEFAULTS.designRole,
    review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
    service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
    campaign_id: "",
    content_item_id: "",
    publishing_job_id: "",
    status: "requested",
    approval_state: "not_requested",
    asset_lineage: [],
    outputs: []
  };
}

function getSelectedItem(session) {
  return session.items.find((item) => item.id === session.selectedId) || null;
}

function getPendingApproval(approvals, itemId) {
  return approvals.find((approval) =>
    asString(approval.entity_type) === "media_job" &&
    asString(approval.entity_id) === asString(itemId) &&
    asString(approval.status) === "pending"
  ) || null;
}

function getLinkedRecords(items, ids) {
  const set = new Set(asArray(ids).map((value) => asString(value)).filter(Boolean));
  return items.filter((item) => set.has(asString(item.id)));
}

async function loadMediaWorkspace(projectName, session, rerender) {
  if (!projectName || session.loading) return;

  session.loading = true;
  session.error = "";
  rerender();

  try {
    const [mediaJobs, contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
      listProjectMediaJobs(projectName, { limit: 120 }),
      listProjectContentItems(projectName, { limit: 120 }),
      listProjectTasks(projectName, 120),
      listProjectApprovals(projectName, 120),
      listProjectHandoffs(projectName, { limit: 120 }),
      listProjectEvents(projectName, 120),
      fetchProjectOperations(projectName)
    ]);

    session.items = asArray(mediaJobs.items);
    session.contentItems = asArray(contentItems.items);
    session.tasks = asArray(tasks.items);
    session.approvals = asArray(approvals.items);
    session.handoffs = asArray(handoffs.items);
    session.events = asArray(events.items);
    session.operations = operations || null;
    session.loaded = true;
    if (!session.selectedId) {
      session.selectedId = session.items[0]?.id || "";
    }
  } catch (error) {
    session.error = error.message || "Failed to load Media Studio.";
  } finally {
    session.loading = false;
    rerender();
  }
}

async function refreshMediaWorkspace(projectName, session, rerender, showError) {
  session.loaded = false;
  await loadMediaWorkspace(projectName, session, rerender);
  if (session.error) {
    showError?.(session.error);
  }
}

function renderMediaQueue(items, selectedId, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">No durable media jobs are in the queue yet.</div>`;
  }

  return `
    <div class="media-output-list">
      ${items.map((item) => `
        <button class="media-output-item${item.id === selectedId ? " is-active" : ""}" type="button" data-media-select="${escapeHtml(item.id)}">
          <span class="media-output-title">${escapeHtml(item.title || `${titleCase(item.request_type)} job`)}</span>
          <span class="media-output-meta">${escapeHtml(titleCase(item.request_type || "media"))} • ${escapeHtml(item.status || "requested")} • ${escapeHtml(item.provider || "provider")}/${escapeHtml(item.model || "model")}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderField(name, label, value, escapeHtml, helper = "", multiline = false, rows = 4) {
  return `
    <div class="setup-field-group">
      <div class="setup-field-head">
        <label class="setup-label" for="${escapeHtml(name)}">${escapeHtml(label)}</label>
      </div>
      ${
        multiline
          ? `<textarea id="${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}">${escapeHtml(asString(value))}</textarea>`
          : `<input id="${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}">`
      }
      ${helper ? `<div class="setup-helper">${escapeHtml(helper)}</div>` : ""}
    </div>
  `;
}

function renderLinkedList(items, emptyText, escapeHtml, formatter) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="ops-mini-list">
      ${items.map((item) => `<div class="ops-mini-item">${formatter(item, escapeHtml)}</div>`).join("")}
    </div>
  `;
}

function bindMediaStudio({
  projectName,
  state,
  session,
  navigateTo,
  showMessage,
  showError,
  rerender
}) {
  Array.from(document.querySelectorAll("[data-media-select]")).forEach((button) => {
    button.onclick = () => {
      session.selectedId = button.getAttribute("data-media-select") || "";
      rerender();
    };
  });

  const newBtns = Array.from(document.querySelectorAll("[data-new-media-job]"));
  newBtns.forEach((button) => {
    button.onclick = async () => {
      const requestType = button.getAttribute("data-new-media-job") || "image";
      try {
        const result = await saveProjectMediaJob(projectName, {
          ...defaultMediaJob(state, requestType),
          actor: "media-studio"
        });
        session.selectedId = result.media_job?.id || session.selectedId;
        showMessage?.("Durable media job created.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to create media job.");
      }
    };
  });

  const saveBtn = document.getElementById("mediaSaveBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      try {
        const payload = {
          id: selectedItem?.id,
          title: document.getElementById("mediaTitleInput")?.value || "",
          request_type: document.getElementById("mediaTypeInput")?.value || "image",
          prompt: document.getElementById("mediaPromptInput")?.value || "",
          brief: document.getElementById("mediaBriefInput")?.value || "",
          provider: document.getElementById("mediaProviderInput")?.value || "",
          model: document.getElementById("mediaModelInput")?.value || "",
          owner: document.getElementById("mediaOwnerInput")?.value || roleLabel(session, getMediaOwnerRole({
            owner_role: selectedItem?.owner_role,
            request_type: document.getElementById("mediaTypeInput")?.value || selectedItem?.request_type || "image"
          }), "Designer"),
          owner_role: getMediaOwnerRole({
            owner_role: selectedItem?.owner_role,
            request_type: document.getElementById("mediaTypeInput")?.value || selectedItem?.request_type || "image"
          }),
          review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          campaign_id: document.getElementById("mediaCampaignInput")?.value || "",
          content_item_id: document.getElementById("mediaContentInput")?.value || "",
          publishing_job_id: document.getElementById("mediaPublishingInput")?.value || "",
          status: document.getElementById("mediaStatusInput")?.value || "requested",
          approval_state: selectedItem?.approval_state || "not_requested",
          asset_lineage: asString(document.getElementById("mediaLineageInput")?.value || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          outputs: asArray(selectedItem?.outputs),
          actor: "media-studio"
        };

        if (!payload.title.trim()) {
          throw new Error("Add a media job title before saving.");
        }

        const result = await saveProjectMediaJob(projectName, payload);
        session.selectedId = result.media_job?.id || session.selectedId;
        showMessage?.("Media job saved to the durable backend.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to save media job.");
      }
    };
  }

  const outputBtn = document.getElementById("mediaAddOutputBtn");
  if (outputBtn) {
    outputBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a media job before adding an output version.");
        return;
      }

      const label = document.getElementById("mediaOutputLabelInput")?.value || "";
      if (!label.trim()) {
        showError?.("Add an output version label first.");
        return;
      }

      try {
        await saveProjectMediaJob(projectName, {
          id: selectedItem.id,
          title: selectedItem.title,
          request_type: selectedItem.request_type,
          prompt: selectedItem.prompt,
          brief: selectedItem.brief,
          provider: selectedItem.provider,
          model: selectedItem.model,
          owner: selectedItem.owner,
          owner_role: getMediaOwnerRole(selectedItem),
          review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          campaign_id: selectedItem.campaign_id,
          content_item_id: selectedItem.content_item_id,
          publishing_job_id: selectedItem.publishing_job_id,
          status: selectedItem.status,
          approval_state: selectedItem.approval_state,
          outputs: [
            ...asArray(selectedItem.outputs),
            {
              label,
              preview_url: document.getElementById("mediaPreviewUrlInput")?.value || "",
              file_path: document.getElementById("mediaPreviewUrlInput")?.value || ""
            }
          ],
          new_output_version: {
            label,
            preview_url: document.getElementById("mediaPreviewUrlInput")?.value || "",
            file_path: document.getElementById("mediaPreviewUrlInput")?.value || ""
          },
          actor: "media-studio"
        });
        session.outputLabelDraft = "";
        showMessage?.("Output version appended to the durable media job.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to add output version.");
      }
    };
  }

  const previewBtn = document.getElementById("mediaPreviewHistoryBtn");
  if (previewBtn) {
    previewBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const previewNote = document.getElementById("mediaPreviewNoteInput")?.value || "";
      const previewUrl = document.getElementById("mediaPreviewUrlInput")?.value || "";

      if (!selectedItem) {
        showError?.("Select a media job before recording preview history.");
        return;
      }

      if (!previewUrl.trim()) {
        showError?.("Add a preview URL or file path before recording preview history.");
        return;
      }

      try {
        await saveProjectMediaJob(projectName, {
          id: selectedItem.id,
          title: selectedItem.title,
          request_type: selectedItem.request_type,
          prompt: selectedItem.prompt,
          brief: selectedItem.brief,
          provider: selectedItem.provider,
          model: selectedItem.model,
          owner: selectedItem.owner,
          owner_role: getMediaOwnerRole(selectedItem),
          review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          campaign_id: selectedItem.campaign_id,
          content_item_id: selectedItem.content_item_id,
          publishing_job_id: selectedItem.publishing_job_id,
          status: selectedItem.status,
          approval_state: selectedItem.approval_state,
          outputs: asArray(selectedItem.outputs),
          preview_entry: {
            preview_label: selectedItem.title,
            preview_url: previewUrl,
            note: previewNote,
            actor: "media-studio"
          },
          actor: "media-studio"
        });
        session.previewNoteDraft = "";
        showMessage?.("Preview history recorded.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to record preview history.");
      }
    };
  }

  const commentBtn = document.getElementById("mediaCommentBtn");
  if (commentBtn) {
    commentBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const text = document.getElementById("mediaCommentInput")?.value || "";

      if (!selectedItem) {
        showError?.("Select a media job before commenting.");
        return;
      }

      if (!text.trim()) {
        showError?.("Add a comment before saving it.");
        return;
      }

      try {
        await saveProjectMediaJob(projectName, {
          id: selectedItem.id,
          title: selectedItem.title,
          request_type: selectedItem.request_type,
          prompt: selectedItem.prompt,
          brief: selectedItem.brief,
          provider: selectedItem.provider,
          model: selectedItem.model,
          owner: selectedItem.owner,
          owner_role: getMediaOwnerRole(selectedItem),
          review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          campaign_id: selectedItem.campaign_id,
          content_item_id: selectedItem.content_item_id,
          publishing_job_id: selectedItem.publishing_job_id,
          status: selectedItem.status,
          approval_state: selectedItem.approval_state,
          outputs: asArray(selectedItem.outputs),
          new_comment: {
            text,
            actor: "media-studio"
          },
          actor: "media-studio"
        });
        session.commentDraft = "";
        showMessage?.("Comment saved on the media job.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to save comment.");
      }
    };
  }

  const taskBtn = document.getElementById("mediaCreateTaskBtn");
  if (taskBtn) {
    taskBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a media job before creating a task.");
        return;
      }

      try {
        await createProjectTask(projectName, {
          title: `Complete media job ${selectedItem.title}`,
          description: `Review outputs, approvals, and routing for ${selectedItem.request_type} job ${selectedItem.title}.`,
          owner: selectedItem.owner || roleLabel(session, getMediaOwnerRole(selectedItem), "Designer"),
          assignee: selectedItem.owner || roleLabel(session, getMediaOwnerRole(selectedItem), "Designer"),
          owner_role: getMediaOwnerRole(selectedItem),
          assignee_role: getMediaOwnerRole(selectedItem),
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          responsibility: asString(selectedItem.request_type) === "video" ? "video_production" : "creative_production",
          handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
          source_page: "media-studio",
          route_target: "media-studio",
          linked_entity: {
            entity_type: "media_job",
            entity_id: selectedItem.id,
            route: "media-studio",
            label: selectedItem.title
          },
          actor: "media-studio"
        });
        showMessage?.("Task created and linked to the media job.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to create task.");
      }
    };
  }

  const approvalBtn = document.getElementById("mediaRequestApprovalBtn");
  if (approvalBtn) {
    approvalBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a media job before requesting approval.");
        return;
      }

      try {
        await createProjectApproval(projectName, {
          title: `Approve ${selectedItem.title}`,
          entity_type: "media_job",
          entity_id: selectedItem.id,
          summary: `Review ${selectedItem.request_type} output versions before release or publishing handoff.`,
          reviewer: roleLabel(session, MEDIA_ROLE_DEFAULTS.reviewRole, "Compliance Reviewer"),
          reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
          service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          ownership: {
            owner_role: getMediaOwnerRole(selectedItem),
            reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole
          },
          requested_by: "media-studio",
          linked_entity: {
            entity_type: "media_job",
            entity_id: selectedItem.id,
            route: "media-studio",
            label: selectedItem.title
          },
          actor: "media-studio"
        });
        showMessage?.("Approval request created.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to request approval.");
      }
    };
  }

  const approveBtn = document.getElementById("mediaApproveBtn");
  if (approveBtn) {
    approveBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const pendingApproval = getPendingApproval(session.approvals, selectedItem?.id);
      if (!pendingApproval) {
        showError?.("No pending approval is linked to this media job.");
        return;
      }

      try {
        await decideProjectApproval(projectName, pendingApproval.id, {
          decision: "approved",
          note: "Approved in Media Studio.",
          actor: "media-studio"
        });
        showMessage?.("Media approval marked approved.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to approve media job.");
      }
    };
  }

  const rejectBtn = document.getElementById("mediaRejectBtn");
  if (rejectBtn) {
    rejectBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const pendingApproval = getPendingApproval(session.approvals, selectedItem?.id);
      if (!pendingApproval) {
        showError?.("No pending approval is linked to this media job.");
        return;
      }

      try {
        await decideProjectApproval(projectName, pendingApproval.id, {
          decision: "rejected",
          note: "Revision requested in Media Studio.",
          actor: "media-studio"
        });
        showMessage?.("Media approval marked rejected.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to reject media job.");
      }
    };
  }

  const handoffBtn = document.getElementById("mediaSendToPublishingBtn");
  if (handoffBtn) {
    handoffBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a media job before handing it off.");
        return;
      }

      try {
        await createProjectHandoff(projectName, {
          source_page: "media-studio",
          destination_page: "publishing",
          source_role: getMediaOwnerRole(selectedItem),
          destination_role: MEDIA_ROLE_DEFAULTS.handoffRole,
          source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
          destination_service_domain: "publishing",
          linked_entity: {
            entity_type: "media_job",
            entity_id: selectedItem.id,
            route: "media-studio",
            label: selectedItem.title
          },
          payload: {
            media_job_id: selectedItem.id,
            content_item_id: selectedItem.content_item_id,
            title: selectedItem.title,
            outputs: asArray(selectedItem.outputs),
            publishing_job_id: selectedItem.publishing_job_id,
            owner_role: getMediaOwnerRole(selectedItem),
            review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
            service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain
          },
          actor: "media-studio"
        });
        showMessage?.("Publishing handoff created from Media Studio.");
        await refreshMediaWorkspace(projectName, session, rerender, showError);
        navigateTo("publishing");
      } catch (error) {
        showError?.(error.message || "Failed to create publishing handoff.");
      }
    };
  }
}

export const mediaStudioRoute = {
  id: "media-studio",
  meta: {
    eyebrow: "Operations",
    title: "Media Studio",
    description: "Run durable image and video jobs with outputs, lineage, approvals, and publishing routing."
  },
  template: `
    <section class="page is-active" data-page="media-studio">
      <div id="mediaStudioRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    navigateTo,
    showMessage,
    showError
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const root = $("mediaStudioRoot");
    if (!root) return;

    if (!projectName) {
      root.innerHTML = `<div class="empty-box">Select a project to open Media Studio.</div>`;
      return;
    }

    const session = ensureSession(projectName);
    const rerender = () => mediaStudioRoute.render({
      getState,
      $,
      escapeHtml,
      navigateTo,
      showMessage,
      showError
    });

    if (!session.loaded && !session.loading) {
      loadMediaWorkspace(projectName, session, rerender);
    }

    const selectedItem = getSelectedItem(session) || session.items[0] || null;
    const linkedContent = selectedItem
      ? session.contentItems.find((item) => asString(item.id) === asString(selectedItem.content_item_id))
      : null;
    const linkedTasks = selectedItem ? getLinkedRecords(session.tasks, selectedItem.linked_tasks) : [];
    const linkedApprovals = selectedItem ? getLinkedRecords(session.approvals, selectedItem.linked_approvals) : [];
    const linkedHandoffs = selectedItem ? getLinkedRecords(session.handoffs, selectedItem.linked_handoffs) : [];
    const linkedEvents = selectedItem
      ? session.events.filter((item) => asString(item.entity_id) === asString(selectedItem.id)).slice(0, 8)
      : [];
    const queueItems = asArray(session.operations?.queues?.items).filter((item) =>
      asString(item.entity_type) === "media_job" || asString(item.route) === "media-studio"
    );
    const pendingApprovals = asArray(session.approvals).filter((item) =>
      asString(item.entity_type) === "media_job" && asString(item.status) === "pending"
    );

    root.innerHTML = `
      <div class="media-studio-wrapper">
        <div class="media-studio-hero">
          <div class="media-studio-hero-copy">
            <h2>Durable Media Job Operations</h2>
            <p>Media requests are now backend-backed jobs with provider metadata, output versions, preview history, asset lineage, approvals, and publishing linkage.</p>
            <div class="media-studio-status">
              <span class="metric-pill">Jobs ${escapeHtml(formatCount(session.items.length))}</span>
              <span class="metric-pill">Pending Approval ${escapeHtml(formatCount(pendingApprovals.length))}</span>
              <span class="metric-pill">Queue ${escapeHtml(formatCount(queueItems.length))}</span>
              <span class="metric-pill">Linked Content ${escapeHtml(formatCount(session.contentItems.length))}</span>
            </div>
          </div>
          <div class="setup-hero-actions">
            ${REQUEST_TYPES.map((type) => `
              <button class="btn btn-primary" type="button" data-new-media-job="${escapeHtml(type)}">New ${escapeHtml(titleCase(type))} Job</button>
            `).join("")}
          </div>
        </div>

        ${session.error ? `<div class="empty-box">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading durable media jobs, approvals, queue items, lineage, and preview history...</div>` : ""}

        <div class="media-studio-layout">
          <div class="media-studio-main">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Media Job Queue</h3>
                  <p>Backend-backed image and video requests with queue status, model metadata, and approval state.</p>
                </div>
              </div>
              ${renderMediaQueue(session.items, selectedItem?.id || "", escapeHtml)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Job Workspace</h3>
                  <p>Manage request details, link the job to content or publishing, and store durable output state.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("mediaTitleInput", "Job Title", selectedItem.title, escapeHtml)}
                      ${renderField("mediaTypeInput", "Request Type", selectedItem.request_type, escapeHtml, "Use image or video request types.")}
                      ${renderField("mediaStatusInput", "Job Status", selectedItem.status, escapeHtml)}
                      ${renderField("mediaOwnerInput", "Owner", selectedItem.owner, escapeHtml)}
                      ${renderField("mediaProviderInput", "Provider", selectedItem.provider, escapeHtml)}
                      ${renderField("mediaModelInput", "Model", selectedItem.model, escapeHtml)}
                      ${renderField("mediaCampaignInput", "Campaign Link", selectedItem.campaign_id, escapeHtml)}
                      ${renderField("mediaContentInput", "Content Link", selectedItem.content_item_id, escapeHtml, linkedContent ? `Linked content: ${linkedContent.title}` : "Attach a durable content item id for asset linkage.")}
                      ${renderField("mediaPublishingInput", "Publishing Link", selectedItem.publishing_job_id, escapeHtml, "Attach a publishing job id or leave blank until handoff.")}
                      ${renderField("mediaLineageInput", "Asset Lineage", asArray(selectedItem.asset_lineage).join("\n"), escapeHtml, "One lineage source per line: upstream asset ids, prompts, or source files.", true, 4)}
                      ${renderField("mediaPromptInput", "Prompt", selectedItem.prompt, escapeHtml, "Stored on the durable media job.", true, 5)}
                      ${renderField("mediaBriefInput", "Execution Brief", selectedItem.brief, escapeHtml, "Use for shot list, video beats, or quality constraints.", true, 6)}
                    </div>
                    <div class="ops-action-row">
                      <button id="mediaSaveBtn" class="btn btn-primary" type="button">Save Job</button>
                      <button id="mediaCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
                      <button id="mediaRequestApprovalBtn" class="btn btn-secondary" type="button">Request Approval</button>
                      <button id="mediaApproveBtn" class="btn btn-secondary" type="button">Approve</button>
                      <button id="mediaRejectBtn" class="btn btn-secondary" type="button">Reject</button>
                      <button id="mediaSendToPublishingBtn" class="btn btn-secondary" type="button">Send To Publishing</button>
                    </div>
                  `
                  : `<div class="empty-box">Create or select a media job to manage durable execution state.</div>`
              }
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Outputs And Preview History</h3>
                  <p>Version outputs, keep preview history, and capture what changed between revisions.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("mediaOutputLabelInput", "Output Version Label", session.outputLabelDraft, escapeHtml, "Example: V2 approved crop")}
                      ${renderField("mediaPreviewUrlInput", "Preview URL / File Path", "", escapeHtml, "Use durable asset paths or preview URLs.")}
                      ${renderField("mediaPreviewNoteInput", "Preview Note", session.previewNoteDraft, escapeHtml, "Why this preview matters or what changed.", true, 3)}
                    </div>
                    <div class="ops-action-row">
                      <button id="mediaAddOutputBtn" class="btn btn-primary" type="button">Add Output Version</button>
                      <button id="mediaPreviewHistoryBtn" class="btn btn-secondary" type="button">Record Preview History</button>
                    </div>
                    ${renderLinkedList(asArray(selectedItem.output_versions), "No output versions recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(item.label || "Output version")}</strong>
                      <span>${escapeHtml(item.preview_url || item.file_path || "No preview path saved")}</span>
                      <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                    ${renderLinkedList(asArray(selectedItem.preview_history), "No preview history recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(item.preview_label || "Preview")}</strong>
                      <span>${escapeHtml(item.note || item.preview_url || "")}</span>
                      <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                  `
                  : `<div class="empty-box">Select a media job to manage output versions and preview history.</div>`
              }
            </section>
          </div>

          <aside class="media-studio-side">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Team Ownership</h3>
                  <p>Keep design, video, review, and publishing responsibility visible while the job moves through execution.</p>
                </div>
              </div>
              ${renderMediaOwnershipCard(session, selectedItem, escapeHtml)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Comments And Workflow Links</h3>
                  <p>Keep review notes close to the job, and track linked tasks, approvals, and handoffs.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-inline-form">
                      <textarea id="mediaCommentInput" class="setup-input setup-textarea" rows="4" placeholder="Add review note or revision request">${escapeHtml(session.commentDraft)}</textarea>
                      <button id="mediaCommentBtn" class="btn btn-secondary" type="button">Add Comment</button>
                    </div>
                    ${renderLinkedList(asArray(selectedItem.comments), "No comments recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(item.author || "operator")}</strong>
                      <span>${escapeHtml(item.text || "")}</span>
                      <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                  `
                  : `<div class="empty-box">Select a media job to manage comments and workflow links.</div>`
              }
              ${renderLinkedList(linkedTasks, "No linked tasks yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Task")}</strong>
                <span>${escapeHtml(item.status || "open")} • ${escapeHtml(item.owner_role ? titleCase(item.owner_role) : (item.owner || item.assignee || "unassigned"))}</span>
              `)}
              ${renderLinkedList(linkedApprovals, "No linked approvals yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Approval")}</strong>
                <span>${escapeHtml(item.status || "pending")} • ${escapeHtml(item.reviewer_role ? titleCase(item.reviewer_role) : (item.reviewer || "operator"))}</span>
              `)}
              ${renderLinkedList(linkedHandoffs, "No linked handoffs yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.destination_page || "handoff")}</strong>
                <span>${escapeHtml(item.status || "available")} • ${escapeHtml(item.destination_role ? titleCase(item.destination_role) : formatDateTime(item.updated_at || item.created_at))}</span>
              `)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Asset Lineage And Queue</h3>
                  <p>Keep source lineage visible and check how the durable queue is routing current work.</p>
                </div>
              </div>
              ${renderLinkedList(asArray(selectedItem?.asset_lineage), "No asset lineage recorded yet.", escapeHtml, (item) => `
                <strong>Lineage</strong>
                <span>${escapeHtml(item)}</span>
              `)}
              ${renderLinkedList(queueItems.slice(0, 8), "No media queue items yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Queue item")}</strong>
                <span>${escapeHtml(item.status || "queued")} • ${escapeHtml(item.route || "media-studio")}</span>
              `)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Event History</h3>
                  <p>Recent durable events for the selected media job.</p>
                </div>
              </div>
              ${renderLinkedList(linkedEvents, "No events recorded yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || item.type || "Event")}</strong>
                <span>${escapeHtml(item.summary || "")}</span>
                <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.timestamp))}</span>
              `)}
            </section>
          </aside>
        </div>
      </div>
    `;

    const outputInput = document.getElementById("mediaOutputLabelInput");
    if (outputInput) {
      outputInput.oninput = (event) => {
        session.outputLabelDraft = event.target.value || "";
      };
    }

    const previewInput = document.getElementById("mediaPreviewNoteInput");
    if (previewInput) {
      previewInput.oninput = (event) => {
        session.previewNoteDraft = event.target.value || "";
      };
    }

    const commentInput = document.getElementById("mediaCommentInput");
    if (commentInput) {
      commentInput.oninput = (event) => {
        session.commentDraft = event.target.value || "";
      };
    }

    bindMediaStudio({
      projectName,
      state,
      session,
      navigateTo,
      showMessage,
      showError,
      rerender
    });
  }
};
