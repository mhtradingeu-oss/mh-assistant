import {
  fetchProjectOperations,
  listProjectApprovals,
  listProjectContentItems,
  listProjectEvents,
  listProjectHandoffs,
  listProjectTasks,
  saveProjectContentItem,
  createProjectApproval,
  createProjectHandoff,
  createProjectTask,
  decideProjectApproval,
  executeProjectAiCommand
} from "../api.js";

const CONTENT_TYPES = ["posts", "captions", "emails", "blogs", "scripts", "general"];
const contentStudioSessions = new Map();
const CONTENT_ROLE_DEFAULTS = {
  serviceDomain: "content",
  ownerRole: "writer",
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

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
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

function getTeamRole(session, roleKey) {
  return asObject(session.operations?.team_service_model?.roles?.[roleKey]);
}

function roleLabel(session, roleKey, fallback) {
  return asString(getTeamRole(session, roleKey).label || fallback || titleCase(roleKey));
}

function getContentOwnerRole(item) {
  return asString(item?.owner_role || CONTENT_ROLE_DEFAULTS.ownerRole);
}

function getContentReviewRole(item) {
  return asString(item?.review_role || CONTENT_ROLE_DEFAULTS.reviewRole);
}

function renderTeamOwnershipCard(session, item, escapeHtml) {
  const ownerRole = getContentOwnerRole(item);
  const reviewRole = getContentReviewRole(item);
  const ownership = asObject(session.operations?.ownership?.visibility);

  return `
    <div class="data-stack">
      <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CONTENT_ROLE_DEFAULTS.serviceDomain))}</strong></div>
      <div class="data-row"><span>Owner role</span><strong>${escapeHtml(roleLabel(session, ownerRole, "Writer"))}</strong></div>
      <div class="data-row"><span>Review role</span><strong>${escapeHtml(roleLabel(session, reviewRole, "Compliance Reviewer"))}</strong></div>
      <div class="data-row"><span>Next handoff</span><strong>${escapeHtml(roleLabel(session, CONTENT_ROLE_DEFAULTS.handoffRole, "Publisher"))}</strong></div>
      <div class="data-row"><span>Visible entities</span><strong>${escapeHtml(formatCount(ownership.entities || 0))}</strong></div>
      <div class="data-row"><span>Review queue</span><strong>${escapeHtml(formatCount(asArray(session.operations?.approvals?.by_reviewer_role?.[reviewRole]).length))}</strong></div>
      <div class="data-row"><span>Inbound handoffs</span><strong>${escapeHtml(formatCount(asArray(session.operations?.handoffs?.by_role?.[ownerRole]).length))}</strong></div>
    </div>
  `;
}

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!contentStudioSessions.has(key)) {
    contentStudioSessions.set(key, {
      loaded: false,
      loading: false,
      error: "",
      items: [],
      tasks: [],
      approvals: [],
      handoffs: [],
      events: [],
      operations: null,
      activeType: "all",
      selectedId: "",
      noteDraft: "",
      commentDraft: "",
      aiDraft: "",
      saving: false
    });
  }
  return contentStudioSessions.get(key);
}

function defaultDraft(state, type = "posts") {
  const context = asObject(state.context);
  const projectName = context.currentProject || "Project";
  const campaignName = context.activeCampaign || `${projectName} Launch`;
  const channelChecks = asObject(state.data.integrations?.readiness?.checks);
  const defaultDestination =
    Object.keys(channelChecks).find((key) => channelChecks[key]) ||
    "publishing";

  return {
    title: `${campaignName} ${titleCase(type)} draft`,
    type,
    draft: "",
    owner: "Writer",
    owner_role: CONTENT_ROLE_DEFAULTS.ownerRole,
    review_role: CONTENT_ROLE_DEFAULTS.reviewRole,
    service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
    campaign_id: "",
    destination: defaultDestination,
    publishing_destination: defaultDestination,
    approval_status: "not_requested",
    publish_status: "draft",
    notes: []
  };
}

function getSelectedItem(session) {
  return session.items.find((item) => item.id === session.selectedId) || null;
}

function getPendingApproval(approvals, itemId) {
  return approvals.find((approval) =>
    asString(approval.entity_type) === "content_item" &&
    asString(approval.entity_id) === asString(itemId) &&
    asString(approval.status) === "pending"
  ) || null;
}

function getLinkedRecords(items, ids) {
  const set = new Set(asArray(ids).map((value) => asString(value)).filter(Boolean));
  return items.filter((item) => set.has(asString(item.id)));
}

async function loadContentWorkspace(projectName, session, rerender) {
  if (!projectName || session.loading) return;

  session.loading = true;
  session.error = "";
  rerender();

  try {
    const [content, tasks, approvals, handoffs, events, operations] = await Promise.all([
      listProjectContentItems(projectName, { limit: 120 }),
      listProjectTasks(projectName, 120),
      listProjectApprovals(projectName, 120),
      listProjectHandoffs(projectName, { limit: 120 }),
      listProjectEvents(projectName, 120),
      fetchProjectOperations(projectName)
    ]);

    session.items = asArray(content.items);
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
    session.error = error.message || "Failed to load Content Studio.";
  } finally {
    session.loading = false;
    rerender();
  }
}

function renderContentQueue(items, selectedId, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">No durable content records match the current view yet.</div>`;
  }

  return `
    <div class="content-queue-list">
      ${items.map((item) => `
        <button class="content-queue-item${item.id === selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
          <div class="content-queue-head">
            <div>
              <span class="content-queue-title">${escapeHtml(item.title || "Untitled content")}</span>
              <span class="content-queue-meta">${escapeHtml(titleCase(item.type || "general"))} • ${escapeHtml(item.destination || item.publishing_destination || "Unrouted")}</span>
            </div>
            <span class="card-badge ${item.approval_status === "approved" ? "success" : item.approval_status === "rejected" ? "danger" : "warning"}">${escapeHtml(titleCase(item.approval_status || item.status || "draft"))}</span>
          </div>
        </button>
      `).join("")}
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

async function refreshContentWorkspace(projectName, session, rerender, showError) {
  session.loaded = false;
  await loadContentWorkspace(projectName, session, rerender);
  if (session.error) {
    showError?.(session.error);
  }
}

function bindContentStudio({
  projectName,
  state,
  session,
  navigateTo,
  showMessage,
  showError,
  rerender
}) {
  Array.from(document.querySelectorAll("[data-content-type]")).forEach((button) => {
    button.onclick = () => {
      session.activeType = button.getAttribute("data-content-type") || "all";
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-content-select]")).forEach((button) => {
    button.onclick = () => {
      session.selectedId = button.getAttribute("data-content-select") || "";
      rerender();
    };
  });

  const newBtn = document.getElementById("contentNewRecordBtn");
  if (newBtn) {
    newBtn.onclick = async () => {
      try {
        session.saving = true;
        rerender();
        const payload = defaultDraft(state, session.activeType === "all" ? "posts" : session.activeType);
        const result = await saveProjectContentItem(projectName, {
          ...payload,
          actor: "content-studio"
        });
        session.selectedId = result.content_item?.id || session.selectedId;
        showMessage?.("Durable content record created.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to create content record.");
      } finally {
        session.saving = false;
        rerender();
      }
    };
  }

  const saveBtn = document.getElementById("contentSaveBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      try {
        session.saving = true;
        rerender();
        const payload = {
          id: selectedItem?.id,
          title: document.getElementById("contentTitleInput")?.value || "",
          type: document.getElementById("contentTypeInput")?.value || "general",
          owner: document.getElementById("contentOwnerInput")?.value || "Writer",
          owner_role: getContentOwnerRole(selectedItem),
          review_role: getContentReviewRole(selectedItem),
          service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
          campaign_id: document.getElementById("contentCampaignInput")?.value || "",
          destination: document.getElementById("contentDestinationInput")?.value || "",
          publishing_destination: document.getElementById("contentDestinationInput")?.value || "",
          draft: document.getElementById("contentDraftInput")?.value || "",
          notes: document.getElementById("contentNotesInput")?.value || "",
          approval_status: selectedItem?.approval_status || "not_requested",
          publish_status: selectedItem?.publish_status || "draft",
          revision_note: session.noteDraft || "Content updated from Content Studio",
          actor: "content-studio"
        };

        if (!payload.title.trim()) {
          throw new Error("Add a content title before saving.");
        }

        const result = await saveProjectContentItem(projectName, payload);
        session.selectedId = result.content_item?.id || session.selectedId;
        session.noteDraft = "";
        showMessage?.("Content record saved to the durable backend.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to save content item.");
      } finally {
        session.saving = false;
        rerender();
      }
    };
  }

  const commentBtn = document.getElementById("contentCommentBtn");
  if (commentBtn) {
    commentBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const text = document.getElementById("contentCommentInput")?.value || "";

      if (!selectedItem) {
        showError?.("Select a content record before commenting.");
        return;
      }

      if (!text.trim()) {
        showError?.("Add a comment before saving it.");
        return;
      }

      try {
        await saveProjectContentItem(projectName, {
          id: selectedItem.id,
          title: selectedItem.title,
          type: selectedItem.type,
          owner: selectedItem.owner,
          owner_role: getContentOwnerRole(selectedItem),
          review_role: getContentReviewRole(selectedItem),
          service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
          campaign_id: selectedItem.campaign_id,
          destination: selectedItem.destination,
          publishing_destination: selectedItem.publishing_destination || selectedItem.destination,
          draft: selectedItem.draft,
          approval_status: selectedItem.approval_status,
          publish_status: selectedItem.publish_status,
          new_comment: {
            text,
            actor: "content-studio"
          },
          actor: "content-studio"
        });
        session.commentDraft = "";
        showMessage?.("Comment saved on the content record.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to save comment.");
      }
    };
  }

  const rewriteBtn = document.getElementById("contentAiRewriteBtn");
  if (rewriteBtn) {
    rewriteBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const prompt = document.getElementById("contentAiRequestInput")?.value || "";

      if (!selectedItem) {
        showError?.("Select a content record before requesting AI improvement.");
        return;
      }

      if (!prompt.trim()) {
        showError?.("Add an AI rewrite request first.");
        return;
      }

      try {
        await Promise.all([
          saveProjectContentItem(projectName, {
            id: selectedItem.id,
            title: selectedItem.title,
            type: selectedItem.type,
            owner: selectedItem.owner,
            owner_role: getContentOwnerRole(selectedItem),
            review_role: getContentReviewRole(selectedItem),
            service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
            campaign_id: selectedItem.campaign_id,
            destination: selectedItem.destination,
            publishing_destination: selectedItem.publishing_destination || selectedItem.destination,
            draft: selectedItem.draft,
            approval_status: selectedItem.approval_status,
            publish_status: selectedItem.publish_status,
            ai_request: {
              type: "rewrite",
              prompt,
              actor: "content-studio"
            },
            actor: "content-studio"
          }),
          executeProjectAiCommand(projectName, {
            message: `Rewrite or improve content item ${selectedItem.title}: ${prompt}\n\nCurrent draft:\n${selectedItem.draft || "(empty draft)"}`,
            route_target: "content-studio",
            actor: "content-studio"
          })
        ]);
        session.aiDraft = "";
        showMessage?.("AI rewrite request recorded and routed.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to route AI rewrite request.");
      }
    };
  }

  const taskBtn = document.getElementById("contentCreateTaskBtn");
  if (taskBtn) {
    taskBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a content record before creating a task.");
        return;
      }

      try {
        await createProjectTask(projectName, {
          title: `Complete content handoff for ${selectedItem.title}`,
          description: `Finalize ${selectedItem.type} and move it toward ${selectedItem.destination || "publishing"}.`,
          owner: selectedItem.owner || "Writer",
          assignee: selectedItem.owner || "Writer",
          owner_role: getContentOwnerRole(selectedItem),
          assignee_role: getContentOwnerRole(selectedItem),
          service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
          responsibility: "drafting_and_handoff",
          handoff_roles: [CONTENT_ROLE_DEFAULTS.handoffRole, getContentReviewRole(selectedItem)],
          source_page: "content-studio",
          route_target: "content-studio",
          linked_entity: {
            entity_type: "content_item",
            entity_id: selectedItem.id,
            route: "content-studio",
            label: selectedItem.title
          },
          actor: "content-studio"
        });
        showMessage?.("Task created and linked to the content record.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to create task.");
      }
    };
  }

  const approvalBtn = document.getElementById("contentRequestApprovalBtn");
  if (approvalBtn) {
    approvalBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a content record before requesting approval.");
        return;
      }

      try {
        await createProjectApproval(projectName, {
          title: `Approve ${selectedItem.title}`,
          entity_type: "content_item",
          entity_id: selectedItem.id,
          summary: `Review ${selectedItem.type} before routing it to ${selectedItem.destination || "publishing"}.`,
          reviewer: roleLabel(session, getContentReviewRole(selectedItem), "Compliance Reviewer"),
          reviewer_role: getContentReviewRole(selectedItem),
          service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
          ownership: {
            owner_role: getContentOwnerRole(selectedItem),
            reviewer_role: getContentReviewRole(selectedItem)
          },
          requested_by: "content-studio",
          linked_entity: {
            entity_type: "content_item",
            entity_id: selectedItem.id,
            route: "content-studio",
            label: selectedItem.title
          },
          actor: "content-studio"
        });
        showMessage?.("Approval request created.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to request approval.");
      }
    };
  }

  const approveBtn = document.getElementById("contentApproveBtn");
  if (approveBtn) {
    approveBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const pendingApproval = getPendingApproval(session.approvals, selectedItem?.id);
      if (!pendingApproval) {
        showError?.("No pending approval is linked to this content item.");
        return;
      }

      try {
        await decideProjectApproval(projectName, pendingApproval.id, {
          decision: "approved",
          note: "Approved in Content Studio.",
          actor: "content-studio"
        });
        showMessage?.("Content approval marked approved.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to approve content.");
      }
    };
  }

  const rejectBtn = document.getElementById("contentRejectBtn");
  if (rejectBtn) {
    rejectBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      const pendingApproval = getPendingApproval(session.approvals, selectedItem?.id);
      if (!pendingApproval) {
        showError?.("No pending approval is linked to this content item.");
        return;
      }

      try {
        await decideProjectApproval(projectName, pendingApproval.id, {
          decision: "rejected",
          note: "Changes requested in Content Studio.",
          actor: "content-studio"
        });
        showMessage?.("Content approval marked rejected.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
      } catch (error) {
        showError?.(error.message || "Failed to reject content.");
      }
    };
  }

  const handoffBtn = document.getElementById("contentSendToPublishingBtn");
  if (handoffBtn) {
    handoffBtn.onclick = async () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a content record before handing it off.");
        return;
      }

      try {
        await createProjectHandoff(projectName, {
          source_page: "content-studio",
          destination_page: "publishing",
          source_role: getContentOwnerRole(selectedItem),
          destination_role: CONTENT_ROLE_DEFAULTS.handoffRole,
          source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
          destination_service_domain: "publishing",
          linked_entity: {
            entity_type: "content_item",
            entity_id: selectedItem.id,
            route: "content-studio",
            label: selectedItem.title
          },
          payload: {
            content_item_id: selectedItem.id,
            title: selectedItem.title,
            destination: selectedItem.destination || selectedItem.publishing_destination,
            draft: selectedItem.draft,
            owner_role: getContentOwnerRole(selectedItem),
            review_role: getContentReviewRole(selectedItem),
            service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain
          },
          actor: "content-studio"
        });
        showMessage?.("Publishing handoff created.");
        await refreshContentWorkspace(projectName, session, rerender, showError);
        navigateTo("publishing");
      } catch (error) {
        showError?.(error.message || "Failed to create publishing handoff.");
      }
    };
  }
}

export const contentStudioRoute = {
  id: "content-studio",
  meta: {
    eyebrow: "Operations",
    title: "Content Studio",
    description: "Create, revise, approve, route, and hand off durable content records."
  },
  template: `
    <section class="page is-active" data-page="content-studio">
      <div id="contentStudioRoot"></div>
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
    const root = $("contentStudioRoot");
    if (!root) return;

    if (!projectName) {
      root.innerHTML = `<div class="empty-box">Select a project to open Content Studio.</div>`;
      return;
    }

    const session = ensureSession(projectName);
    const rerender = () => contentStudioRoute.render({
      getState,
      $,
      escapeHtml,
      navigateTo,
      showMessage,
      showError
    });

    if (!session.loaded && !session.loading) {
      loadContentWorkspace(projectName, session, rerender);
    }

    const items = asArray(session.items).filter((item) =>
      session.activeType === "all" ? true : asString(item.type) === session.activeType
    );
    const selectedItem = getSelectedItem(session) || items[0] || null;
    const linkedTasks = selectedItem ? getLinkedRecords(session.tasks, selectedItem.linked_tasks) : [];
    const linkedApprovals = selectedItem ? getLinkedRecords(session.approvals, selectedItem.linked_approvals) : [];
    const linkedHandoffs = selectedItem ? getLinkedRecords(session.handoffs, selectedItem.linked_handoffs) : [];
    const linkedEvents = selectedItem
      ? session.events.filter((item) => asString(item.entity_id) === asString(selectedItem.id)).slice(0, 8)
      : [];
    const queueItems = asArray(session.operations?.queues?.items).filter((item) =>
      asString(item.entity_type) === "content_item" || asString(item.route) === "content-studio"
    );
    const pendingApprovals = asArray(session.approvals).filter((item) =>
      asString(item.entity_type) === "content_item" && asString(item.status) === "pending"
    );

    root.innerHTML = `
      <div class="content-studio-wrapper">
        <div class="content-studio-hero">
          <div class="content-studio-hero-copy">
            <h2>Durable Content Operations</h2>
            <p>Every draft in this workspace is a backend-backed entity with revisions, approvals, comments, ownership, routing, and publishing handoff state.</p>
            <div class="content-studio-status">
              <span class="metric-pill">Records ${escapeHtml(formatCount(session.items.length))}</span>
              <span class="metric-pill">Pending Approval ${escapeHtml(formatCount(pendingApprovals.length))}</span>
              <span class="metric-pill">Queue ${escapeHtml(formatCount(queueItems.length))}</span>
              <span class="metric-pill">Tasks ${escapeHtml(formatCount(session.tasks.length))}</span>
            </div>
          </div>
          <div class="setup-hero-actions">
            <button id="contentNewRecordBtn" class="btn btn-primary" type="button"${session.saving ? " disabled" : ""}>New Content Record</button>
          </div>
        </div>

        ${session.error ? `<div class="empty-box">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading durable content records, approvals, tasks, handoffs, and event history...</div>` : ""}

        <div class="content-studio-layout">
          <div class="content-studio-main">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Content Queue</h3>
                  <p>View durable records by content type and jump directly into revisions, routing, and approvals.</p>
                </div>
              </div>
              <div class="content-type-tabs">
                <button class="content-type-tab${session.activeType === "all" ? " is-active" : ""}" type="button" data-content-type="all">All</button>
                ${CONTENT_TYPES.map((type) => `
                  <button class="content-type-tab${session.activeType === type ? " is-active" : ""}" type="button" data-content-type="${escapeHtml(type)}">${escapeHtml(titleCase(type))}</button>
                `).join("")}
              </div>
              ${renderContentQueue(items, selectedItem?.id || "", escapeHtml)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Record Workspace</h3>
                  <p>Edit the current durable content entity, then save a new revision into the backend.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("contentTitleInput", "Title", selectedItem.title, escapeHtml)}
                      ${renderField("contentTypeInput", "Type", selectedItem.type, escapeHtml)}
                      ${renderField("contentOwnerInput", "Owner", selectedItem.owner, escapeHtml)}
                      ${renderField("contentCampaignInput", "Campaign Link", selectedItem.campaign_id, escapeHtml, "Link this record to a durable campaign id when available.")}
                      ${renderField("contentDestinationInput", "Publishing Destination", selectedItem.destination || selectedItem.publishing_destination, escapeHtml, "Examples: instagram, email, publishing")}
                      ${renderField("contentNotesInput", "Notes", asArray(selectedItem.notes).join("\n"), escapeHtml, "Operator notes, review reminders, or handoff context.", true, 4)}
                      ${renderField("contentDraftInput", "Draft Body", selectedItem.draft, escapeHtml, "Stored durably with revision history.", true, 12)}
                      ${renderField("contentRevisionNoteInput", "Revision Note", session.noteDraft, escapeHtml, "Explain what changed in this revision.", true, 3)}
                    </div>
                    <div class="ops-action-row">
                      <button id="contentSaveBtn" class="btn btn-primary" type="button"${session.saving ? " disabled" : ""}>Save Revision</button>
                      <button id="contentCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
                      <button id="contentRequestApprovalBtn" class="btn btn-secondary" type="button">Request Approval</button>
                      <button id="contentApproveBtn" class="btn btn-secondary" type="button">Approve</button>
                      <button id="contentRejectBtn" class="btn btn-secondary" type="button">Reject</button>
                      <button id="contentSendToPublishingBtn" class="btn btn-secondary" type="button">Send To Publishing</button>
                    </div>
                  `
                  : `<div class="empty-box">Create or select a content record to start editing durable content entities.</div>`
              }
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>AI Rewrite Requests</h3>
                  <p>Record rewrite or improvement asks on the content entity and route them into AI execution.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("contentAiRequestInput", "Rewrite / Improvement Request", session.aiDraft, escapeHtml, "Example: tighten the hook for Instagram and keep the CTA more premium.", true, 4)}
                    </div>
                    <div class="ops-action-row">
                      <button id="contentAiRewriteBtn" class="btn btn-primary" type="button">Record And Route AI Request</button>
                    </div>
                    ${renderLinkedList(asArray(selectedItem.ai_requests), "No AI rewrite requests recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(titleCase(item.type || "request"))}</strong>
                      <span>${escapeHtml(item.prompt || "")}</span>
                      <span class="ops-mini-meta">${escapeHtml(item.status || "open")} • ${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                  `
                  : `<div class="empty-box">Select a content record to manage AI rewrite requests.</div>`
              }
            </section>
          </div>

          <aside class="content-studio-side">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Team Ownership</h3>
                  <p>Keep content responsibility, review ownership, and the next role handoff visible on every record.</p>
                </div>
              </div>
              ${renderTeamOwnershipCard(session, selectedItem, escapeHtml)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Revisions And Comments</h3>
                  <p>Track what changed, who changed it, and the notes attached to the record.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    ${renderLinkedList(asArray(selectedItem.revisions), "No revisions recorded yet.", escapeHtml, (item) => `
                      <strong>Revision ${escapeHtml(item.revision || "")}</strong>
                      <span>${escapeHtml(item.note || "No revision note")}</span>
                      <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                    <div class="ops-inline-form">
                      <textarea id="contentCommentInput" class="setup-input setup-textarea" rows="4" placeholder="Add review note or operator comment">${escapeHtml(session.commentDraft)}</textarea>
                      <button id="contentCommentBtn" class="btn btn-secondary" type="button">Add Comment</button>
                    </div>
                    ${renderLinkedList(asArray(selectedItem.comments), "No comments recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(item.author || "operator")}</strong>
                      <span>${escapeHtml(item.text || "")}</span>
                      <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                  `
                  : `<div class="empty-box">Revision history appears after a content record is selected.</div>`
              }
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Routing And Workflow Links</h3>
                  <p>See linked tasks, approvals, handoffs, and the shared queue state for this workspace.</p>
                </div>
              </div>
              ${renderLinkedList(linkedTasks, "No linked tasks yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Task")}</strong>
                <span>${escapeHtml(item.status || "open")} • ${escapeHtml(item.owner_role ? titleCase(item.owner_role) : (item.owner || item.assignee || "unassigned"))}</span>
              `)}
              ${renderLinkedList(linkedApprovals, "No linked approvals yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Approval")}</strong>
                <span>${escapeHtml(item.status || "pending")} • ${escapeHtml(item.reviewer_role ? titleCase(item.reviewer_role) : (item.reviewer || "operator"))}</span>
              `)}
              ${renderLinkedList(linkedHandoffs, "No publishing handoffs yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.destination_page || "handoff")}</strong>
                <span>${escapeHtml(item.status || "available")} • ${escapeHtml(item.destination_role ? titleCase(item.destination_role) : formatDateTime(item.updated_at || item.created_at))}</span>
              `)}
              ${renderLinkedList(queueItems.slice(0, 8), "No queue items yet.", escapeHtml, (item) => `
                <strong>${escapeHtml(item.title || "Queue item")}</strong>
                <span>${escapeHtml(item.status || "queued")} • ${escapeHtml(item.route || "content-studio")}</span>
              `)}
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Event History</h3>
                  <p>Recent durable events for the selected content entity.</p>
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

    const revisionInput = document.getElementById("contentRevisionNoteInput");
    if (revisionInput) {
      revisionInput.oninput = (event) => {
        session.noteDraft = event.target.value || "";
      };
    }

    const commentInput = document.getElementById("contentCommentInput");
    if (commentInput) {
      commentInput.oninput = (event) => {
        session.commentDraft = event.target.value || "";
      };
    }

    const aiInput = document.getElementById("contentAiRequestInput");
    if (aiInput) {
      aiInput.oninput = (event) => {
        session.aiDraft = event.target.value || "";
      };
    }

    bindContentStudio({
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
