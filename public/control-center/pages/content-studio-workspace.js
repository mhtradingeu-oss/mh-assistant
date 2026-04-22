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
import { setSharedAiDraft, setSharedHandoff } from "../shared-context.js";

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
    return `<div class="empty-box">No saved content records match the current view yet.</div>`;
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

function buildContentAiPrompt(projectName, selectedItem, aiDraft) {
  return `Help improve this content item for ${projectName || "the current project"}.\n\nTitle: ${asString(selectedItem?.title || "Untitled content")}\nType: ${titleCase(selectedItem?.type || "general")}\nDestination: ${asString(selectedItem?.destination || selectedItem?.publishing_destination || "unrouted")}\nApproval status: ${titleCase(selectedItem?.approval_status || "not requested")}\n\nCurrent draft:\n${asString(selectedItem?.draft || "(empty draft)")}\n\nRequested help:\n${asString(aiDraft || "Improve the draft, strengthen the hook, and prepare it for review.")}`;
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
        showMessage?.("Content record saved.");
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

  const sendAiBtn = document.getElementById("contentSendAiCommandBtn");
  if (sendAiBtn) {
    sendAiBtn.onclick = () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a content record before sending context to AI Command.");
        return;
      }

      const prompt = buildContentAiPrompt(projectName, selectedItem, session.aiDraft);
      const aiDraft = {
        projectName,
        modeId: "content",
        lastCommand: prompt,
        lastResponseTitle: selectedItem.title || "Content Revision",
        routeSuggestions: []
      };

      setSharedAiDraft(projectName, aiDraft);
      setSharedHandoff(projectName, "ai-command", {
        source_page: "content-studio",
        destination_page: "ai-command",
        linked_entity: {
          entity_type: "content_item",
          entity_id: selectedItem.id
        },
        payload: {
          prompt,
          content_item_id: selectedItem.id,
          title: selectedItem.title,
          draft_context: aiDraft,
          content: {
            type: selectedItem.type,
            destination: selectedItem.destination || selectedItem.publishing_destination,
            draft: selectedItem.draft
          }
        },
        status: "available"
      });

      const input = document.getElementById("quickCommandInput");
      if (input) {
        input.value = prompt;
      }
      navigateTo("ai-command");
      showMessage?.("Content context sent to AI Command.");
    };
  }

  const mediaBtn = document.getElementById("contentSendToMediaStudioBtn");
  if (mediaBtn) {
    mediaBtn.onclick = () => {
      const selectedItem = getSelectedItem(session);
      if (!selectedItem) {
        showError?.("Select a content record before sending it to Media Studio.");
        return;
      }

      setSharedHandoff(projectName, "media-studio", {
        source_page: "content-studio",
        destination_page: "media-studio",
        linked_entity: {
          entity_type: "content_item",
          entity_id: selectedItem.id,
          route: "content-studio",
          label: selectedItem.title
        },
        payload: {
          content_item_id: selectedItem.id,
          title: selectedItem.title,
          draft: selectedItem.draft,
          campaign_id: selectedItem.campaign_id,
          destination: selectedItem.destination || selectedItem.publishing_destination,
          owner_role: getContentOwnerRole(selectedItem),
          review_role: getContentReviewRole(selectedItem),
          draft_context: {
            origin: "content-studio",
            projectName,
            contentTitle: selectedItem.title,
            contentType: selectedItem.type
          }
        },
        status: "available"
      });

      navigateTo("media-studio");
      showMessage?.("Content context sent to Media Studio.");
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
    description: "Create, revise, approve, route, and hand off saved content records."
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
        <section class="panel">
          <div class="panel-header">
            <div>
              <h3>Content Overview</h3>
              <p class="content-section-copy">Browse the queue, inspect one selected item, edit and review it, then send task or handoff actions only when the content is ready.</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(projectName)}</span>
          </div>
          <div class="content-overview-grid">
            <div class="content-overview-item">
              <span>Records</span>
              <strong>${escapeHtml(formatCount(session.items.length))}</strong>
            </div>
            <div class="content-overview-item">
              <span>Pending approval</span>
              <strong>${escapeHtml(formatCount(pendingApprovals.length))}</strong>
            </div>
            <div class="content-overview-item">
              <span>Queue</span>
              <strong>${escapeHtml(formatCount(queueItems.length))}</strong>
            </div>
            <div class="content-overview-item">
              <span>Selected item</span>
              <strong>${escapeHtml(selectedItem?.title || "No item selected")}</strong>
            </div>
          </div>
          <div class="content-toolbar">
            <button id="contentNewRecordBtn" class="btn btn-primary" type="button"${session.saving ? " disabled" : ""}>New Content Record</button>
          </div>
        </section>

        ${session.error ? `<div class="empty-box">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading saved content records, approvals, tasks, handoffs, and activity history...</div>` : ""}

        <div class="content-studio-layout">
          <div class="content-studio-main">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Content Queue</h3>
                  <p class="content-section-copy">Browse saved content items by type and select one item at a time for review and editing.</p>
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
                  <h3>Selected Content Item</h3>
                  <p class="content-section-copy">Review the current saved content record before editing or sending any downstream action.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="data-stack">
                      <div class="data-row"><span>Title</span><strong>${escapeHtml(selectedItem.title || "Untitled content")}</strong></div>
                      <div class="data-row"><span>Type</span><strong>${escapeHtml(titleCase(selectedItem.type || "general"))}</strong></div>
                      <div class="data-row"><span>Destination</span><strong>${escapeHtml(selectedItem.destination || selectedItem.publishing_destination || "Unrouted")}</strong></div>
                      <div class="data-row"><span>Approval status</span><strong>${escapeHtml(titleCase(selectedItem.approval_status || "not requested"))}</strong></div>
                      <div class="data-row"><span>Publish status</span><strong>${escapeHtml(titleCase(selectedItem.publish_status || "draft"))}</strong></div>
                      <div class="data-row"><span>Owner / review</span><strong>${escapeHtml(`${roleLabel(session, getContentOwnerRole(selectedItem), "Writer")} / ${roleLabel(session, getContentReviewRole(selectedItem), "Compliance Reviewer")}`)}</strong></div>
                    </div>
                    <div class="content-selected-block">
                      <span class="content-selected-label">Current draft</span>
                      <div class="code-block">${escapeHtml(asString(selectedItem.draft || "No draft content saved yet."))}</div>
                    </div>
                  `
                  : `<div class="empty-box">Select a content record to review its current state.</div>`
              }
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Edit / Review / Approval</h3>
                  <p class="content-section-copy">Save creates a real revision. Approval buttons only act when a real approval is already linked to the selected content item.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("contentTitleInput", "Title", selectedItem.title, escapeHtml)}
                      ${renderField("contentTypeInput", "Type", selectedItem.type, escapeHtml)}
                      ${renderField("contentOwnerInput", "Owner", selectedItem.owner, escapeHtml)}
                      ${renderField("contentCampaignInput", "Campaign Link", selectedItem.campaign_id, escapeHtml, "Link this record to a saved campaign when available.")}
                      ${renderField("contentDestinationInput", "Publishing Destination", selectedItem.destination || selectedItem.publishing_destination, escapeHtml, "Examples: instagram, email, publishing")}
                      ${renderField("contentNotesInput", "Notes", asArray(selectedItem.notes).join("\n"), escapeHtml, "Operator notes, review reminders, or handoff context.", true, 4)}
                      ${renderField("contentDraftInput", "Draft Body", selectedItem.draft, escapeHtml, "Saved with revision history.", true, 12)}
                      ${renderField("contentRevisionNoteInput", "Revision Note", session.noteDraft, escapeHtml, "Explain what changed in this revision.", true, 3)}
                    </div>
                    <div class="ops-inline-form">
                      <textarea id="contentCommentInput" class="setup-input setup-textarea" rows="4" placeholder="Add review note or operator comment">${escapeHtml(session.commentDraft)}</textarea>
                      <button id="contentCommentBtn" class="btn btn-secondary" type="button">Add Comment</button>
                    </div>
                    <div class="ops-action-row">
                      <button id="contentSaveBtn" class="btn btn-primary" type="button"${session.saving ? " disabled" : ""}>Save</button>
                      <button id="contentRequestApprovalBtn" class="btn btn-secondary" type="button">Request Approval</button>
                      <button id="contentApproveBtn" class="btn btn-secondary" type="button">Approve</button>
                      <button id="contentRejectBtn" class="btn btn-secondary" type="button">Reject</button>
                    </div>
                    <div class="content-linked-grid">
                      <div>
                        <span class="content-selected-label">Revisions</span>
                        ${renderLinkedList(asArray(selectedItem.revisions), "No revisions recorded yet.", escapeHtml, (item) => `
                          <strong>Revision ${escapeHtml(item.revision || "")}</strong>
                          <span>${escapeHtml(item.note || "No revision note")}</span>
                          <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                        `)}
                      </div>
                      <div>
                        <span class="content-selected-label">Comments</span>
                        ${renderLinkedList(asArray(selectedItem.comments), "No comments recorded yet.", escapeHtml, (item) => `
                          <strong>${escapeHtml(item.author || "operator")}</strong>
                          <span>${escapeHtml(item.text || "")}</span>
                          <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.created_at))}</span>
                        `)}
                      </div>
                    </div>
                  `
                  : `<div class="empty-box">Select a content record to edit it, save revisions, or work through review and approval.</div>`
              }
            </section>
          </div>

          <aside class="content-studio-side">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Handoff / Task Actions</h3>
                  <p class="content-section-copy">Send actions create handoffs with context and then navigate. Task creation records a real linked task.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-action-row">
                      <button id="contentCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
                      <button id="contentSendToMediaStudioBtn" class="btn btn-secondary" type="button">Send to Media Studio</button>
                      <button id="contentSendToPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
                    </div>
                    <div class="content-linked-grid">
                      <div>
                        <span class="content-selected-label">Linked tasks</span>
                        ${renderLinkedList(linkedTasks, "No linked tasks yet.", escapeHtml, (item) => `
                          <strong>${escapeHtml(item.title || "Task")}</strong>
                          <span>${escapeHtml(item.status || "open")} • ${escapeHtml(item.owner_role ? titleCase(item.owner_role) : (item.owner || item.assignee || "unassigned"))}</span>
                        `)}
                      </div>
                      <div>
                        <span class="content-selected-label">Linked approvals</span>
                        ${renderLinkedList(linkedApprovals, "No linked approvals yet.", escapeHtml, (item) => `
                          <strong>${escapeHtml(item.title || "Approval")}</strong>
                          <span>${escapeHtml(item.status || "pending")} • ${escapeHtml(item.reviewer_role ? titleCase(item.reviewer_role) : (item.reviewer || "operator"))}</span>
                        `)}
                      </div>
                      <div>
                        <span class="content-selected-label">Linked handoffs</span>
                        ${renderLinkedList(linkedHandoffs, "No publishing handoffs yet.", escapeHtml, (item) => `
                          <strong>${escapeHtml(item.destination_page || "handoff")}</strong>
                          <span>${escapeHtml(item.status || "available")} • ${escapeHtml(item.destination_role ? titleCase(item.destination_role) : formatDateTime(item.updated_at || item.created_at))}</span>
                        `)}
                      </div>
                      <div>
                        <span class="content-selected-label">Recent events</span>
                        ${renderLinkedList(linkedEvents, "No events recorded yet.", escapeHtml, (item) => `
                          <strong>${escapeHtml(item.title || item.type || "Event")}</strong>
                          <span>${escapeHtml(item.summary || "")}</span>
                          <span class="ops-mini-meta">${escapeHtml(formatDateTime(item.timestamp))}</span>
                        `)}
                      </div>
                    </div>
                  `
                  : `<div class="empty-box">Select a content record before creating a task or sending a handoff.</div>`
              }
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <h3>Content AI Assistant</h3>
                  <p class="content-section-copy">Send to AI Command prefills the selected content context and then navigates there. Recording an AI request keeps the request on the saved content item and routes it through the current AI execution path.</p>
                </div>
              </div>
              ${
                selectedItem
                  ? `
                    <div class="ops-record-grid">
                      ${renderField("contentAiRequestInput", "Writing Help Request", session.aiDraft, escapeHtml, "Example: tighten the hook for Instagram and keep the CTA more premium.", true, 4)}
                    </div>
                    <div class="ops-action-row">
                      <button id="contentSendAiCommandBtn" class="btn btn-secondary" type="button">Send to AI Command</button>
                      <button id="contentAiRewriteBtn" class="btn btn-primary" type="button">Record AI Request</button>
                    </div>
                    ${renderLinkedList(asArray(selectedItem.ai_requests), "No AI rewrite requests recorded yet.", escapeHtml, (item) => `
                      <strong>${escapeHtml(titleCase(item.type || "request"))}</strong>
                      <span>${escapeHtml(item.prompt || "")}</span>
                      <span class="ops-mini-meta">${escapeHtml(item.status || "open")} • ${escapeHtml(formatDateTime(item.created_at))}</span>
                    `)}
                  `
                  : `<div class="empty-box">Select a content record before asking AI for writing help.</div>`
              }
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
