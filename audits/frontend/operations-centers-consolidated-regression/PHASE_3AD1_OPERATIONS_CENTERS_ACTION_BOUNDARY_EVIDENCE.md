# PHASE 3AD.1 — Operations Centers Action Boundary Evidence

## Active and disabled action markers across operations-centers.js
472:        <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace for Review</button>
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
666:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Task Context</button>
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
1019:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (disabled: future mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (disabled: future destructive mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (disabled: backend worker-control safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (disabled: future destructive mutation safety pass)</button>
1314:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Job Context</button>
1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}" title="Updates notification read-state only. Does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.">Mark Read (read-state only)</button>` : ""}
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (disabled: future lifecycle mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (disabled: future incident-resolution safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (disabled: future visibility mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (disabled: future destructive mutation safety pass)</button>
1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Notification Context</button>
1730:  Array.from(root.querySelectorAll("[data-mark-read]")).forEach((button) => {
1732:      const notificationId = button.getAttribute("data-mark-read") || "";
1733:      if (!notificationId || !context.markProjectNotification) return;
1735:        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
2017:                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
2038:                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, approve workflows, mark notifications read, publish, or trigger workers. It only routes to the owning workspace.</p>
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: create task from draft — future task mutation safety pass</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: execute workflow — future workflow execution safety pass</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: acknowledge signal — future notification lifecycle mutation safety pass</button>

## Task Center route/action region
    ? "No tasks match the current filters."
    : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";

  const selectedSummary = selectedItem
    ? [
      selectedItem.title || "Task",
      selectedItem.description || "No description.",
      `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
      `Due: ${formatDateTime(selectedItem.due_at)}`,
      `Priority: ${titleCase(selectedItem.priority || "normal")}`,
      `Status: ${titleCase(selectedItem.status || "open")}`
    ].join("\n")
    : "No task is selected.";

  const showLoadingState = Boolean(session.isLoading);

  return `
    <section class="page is-active" data-page="task-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">TASK CENTER</span>
              <h3 class="std-context-title">Task Center</h3>
            </div>
            <p class="std-context-description">Review durable operational task records with ownership, due-state, linked entities, and route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
            <div class="std-context-metrics" aria-label="Task Center metrics">
              <span class="std-context-chip"><span>Total</span><strong>${escapeHtml(formatCount(taskCenter.total))}</strong></span>
              <span class="std-context-chip"><span>Open</span><strong>${escapeHtml(formatCount(taskCenter.open_count))}</strong></span>
              <span class="std-context-chip is-warning"><span>Blocked</span><strong>${escapeHtml(formatCount(taskCenter.blocked_count))}</strong></span>
              <span class="std-context-chip is-danger"><span>Overdue</span><strong>${escapeHtml(formatCount(taskCenter.overdue_count))}</strong></span>
              <span class="std-context-chip is-warning"><span>Due Soon</span><strong>${escapeHtml(formatCount(taskCenter.due_soon_count))}</strong></span>
            </div>
          </div>
          <div class="std-context-actions">
            <span class="card-badge neutral">Project: ${escapeHtml(projectLabel)}</span>
            <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
          </div>
        </section>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "System Runtime",
          title: "System Signal",
          description: "Supporting cross-center health and risk signal.",
          badge: "Supporting context"
        })}

        <div class="ops-layout-grid">
          <article class="panel ops-main-column mhos-clean-stack">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Main View</div>
                <h3>Operational task backlog</h3>
                <p>Filter by focus, owner, source, and priority to review task risk quickly.</p>
              </div>
              <span class="card-badge ${showLoadingState ? "warning" : "neutral"}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
            </div>

            ${renderOpsFocusTabs([
              { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
              { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
              { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
              { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
              { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
            ], session.focus, escapeHtml)}

            <div class="ops-toolbar">
              <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${escapeHtml(session.search)}">
              <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, escapeHtml, "All priorities")}</select>
              <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, escapeHtml, "All owners")}</select>
              <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, escapeHtml, "All sources")}</select>
            </div>

            ${session.errorMessage ? `<div class="error-state" aria-live="assertive">${escapeHtml(session.errorMessage)}</div>` : ""}

            ${renderOpsTable(
              ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
              items.map((item) => `
                <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
                  <td>
                    <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
                      <strong>${escapeHtml(item.title || "Task")}</strong>
                      <span>${escapeHtml(item.description || item.service_domain || "-")}</span>
                    </button>
                  </td>
                  <td>
                    <strong>${escapeHtml(item.assignee || item.owner || "-")}</strong>
                    <span>${escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
                  </td>
                  <td>
                    <strong>${escapeHtml(formatDateTime(item.due_at))}</strong>
                    <span class="card-badge ${badgeTone(item.due_state)}">${escapeHtml(titleCase(item.due_state || "unscheduled"))}</span>
                  </td>
                  <td><span class="card-badge ${badgeTone(item.priority)}">${escapeHtml(titleCase(item.priority || "normal"))}</span></td>
                  <td>${escapeHtml(titleCase(item.source_page || "-"))}</td>
                  <td>${escapeHtml(item.linked_entity?.label || item.linked_entity?.entity_type || "-")}</td>
                  <td><span class="card-badge ${badgeTone(item.status)}">${escapeHtml(titleCase(item.status || "open"))}</span></td>
                  <td>${renderRouteAction(item, escapeHtml)}</td>
                </tr>
              `),
              emptyText,
              escapeHtml
            )}
          </article>

          <aside class="ops-right-rail mhos-clean-stack">
            ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
            <section class="panel ops-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Selected Task</div>
                  <h3>${escapeHtml(selectedItem?.title || "Select a task")}</h3>
                  <p>${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
                </div>
              </div>
              ${selectedItem ? `
                <div class="ops-detail-stack">
                  <div class="ops-detail-summary">
                    <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
                    <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
                  </div>
                  ${renderOpsDetailRows([
                    { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
                    { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
                    { label: "Due", value: formatDateTime(selectedItem.due_at) },
                    { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
                    { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
                    { label: "Source", value: titleCase(selectedItem.source_page || "-") },
                    { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
                    { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
                  ], escapeHtml)}
                </div>
              ` : `<div class="empty-box">No task is selected.</div>`}
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Action Panel</div>
                  <h3>Task review actions</h3>
                  <p>Active actions are refresh, copy, route, and AI guidance only. Task mutations remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
                <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>
                  <h3>Operations AI Assistant</h3>
                  <p>Context-only guidance: opens AI with prompt/context only. No task creation, owner assignment, status change, approval, publishing, or backend execution is performed.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Task Context</button>
              </div>
              <div class="quick-actions">
                ${prompts.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
                    <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
                    <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
    <textarea id="taskCenterSummaryBuffer" hidden>${escapeHtml(selectedSummary)}</textarea>
  `;
}

function renderTaskCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const ops = asObject(state.data.operations);
  const taskCenter = asObject(ops.task_center);
  const filters = asObject(taskCenter.filters);
  const session = ensureSession(taskSessions, projectName, {
    focus: "all",
    priority: "all",
    owner: "all",
    source: "all",
    search: "",
    selectedKey: "",
    isLoading: false,
    errorMessage: ""
  });

  let items = asArray(taskCenter.items).map((item, index) => ({
    ...item,
    _opsKey: getOpsItemKey(item, index, "task")
  }));
  items = filterBySearch(items, session.search, ["title", "description", "owner", "assignee", "service_domain"]);
  if (session.focus === "open") items = items.filter((item) => asString(item.status) === "open");
  if (session.focus === "blocked") items = items.filter((item) => asString(item.status) === "blocked");
  if (session.focus === "overdue") items = items.filter((item) => asString(item.due_state) === "overdue");
  if (session.focus === "due_soon") items = items.filter((item) => asString(item.due_state) === "due_soon");
  if (session.priority !== "all") items = items.filter((item) => asString(item.priority) === session.priority);
  if (session.owner !== "all") items = items.filter((item) => asString(item.owner_role) === session.owner);
  if (session.source !== "all") items = items.filter((item) => asString(item.source_page) === session.source);
  const selectedItem = items.find((item) => item._opsKey === session.selectedKey) || items[0] || null;
  session.selectedKey = selectedItem?._opsKey || "";
  const prompts = buildOpsAssistantPrompts("task-center", projectName, selectedItem, titleCase(session.focus || "all"));
  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);


  root.innerHTML = renderTaskCenterLayout({
    context,
    projectName,
    taskCenter,
    session,
    items,
    selectedItem,
    filters,
    prompts,
    incomingHandoff
  });

  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
  const refreshTaskCenter = () => {
    if (context.fetchProjectTaskCenter && projectName) {
      session.isLoading = true;
      session.errorMessage = "";
      rerender();
      context.fetchProjectTaskCenter(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.task_center = liveData;
          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          session.isLoading = false;
          session.errorMessage = `Task Center: ${error?.message || "Failed to refresh."}`;
          rerender();
          context.showError?.(session.errorMessage);
        });
    } else {
      session.errorMessage = "";
      context.reloadProjectData?.(projectName);
    }
  };
  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", refreshTaskCenter);
  root.querySelector("#taskCenterRefreshBtnRail")?.addEventListener("click", refreshTaskCenter);
  root.querySelector("#taskCenterCopySummaryBtn")?.addEventListener("click", async () => {
    const buffer = root.querySelector("#taskCenterSummaryBuffer");
    const text = buffer?.value || "No task is selected.";
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        buffer?.focus();
        buffer?.select();
        document.execCommand("copy");
      }
      context.showMessage?.("Task summary copied.");
    } catch (_error) {
      context.showError?.("Failed to copy task summary.");
    }
  });

  root.querySelector("#taskCenterCopyHandoffBtn")?.addEventListener("click", async () => {
    const text = incomingHandoff
      ? [
          "Incoming Review-Only Task Handoff",
          `Source: ${asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown")}`,
          `Title: ${asString(incomingHandoff.title || incomingHandoff.summary || incomingHandoff.payload?.title || incomingHandoff.payload?.summary || "Incoming task handoff")}`,
          `Summary: ${asString(incomingHandoff.description || incomingHandoff.payload?.description || incomingHandoff.payload?.handoff_intent || incomingHandoff.payload?.prompt || "Review-only handoff.")}`,
          "Status: Review-only intake"
        ].join("\n")
      : "No incoming task handoff.";

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const buffer = root.querySelector("#taskCenterSummaryBuffer");
        if (buffer) {
          buffer.value = text;
          buffer.focus();
          buffer.select();
          document.execCommand("copy");
        }
      }
      context.showMessage?.("Incoming handoff summary copied.");
    } catch (_error) {
      context.showError?.("Failed to copy incoming handoff summary.");
    }
  });
  bindOpsFocusButtons(root, (focus) => {
    session.focus = focus || "all";
    rerender();
  });
  bindOpsSelectionButtons(root, (selectedKey) => {
    session.selectedKey = selectedKey;
    rerender();
  });
  root.querySelector("#taskCenterSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#taskCenterPriority", "priority"], ["#taskCenterOwner", "owner"], ["#taskCenterSource", "source"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
  bindOpsAssistantButtons(root, context, prompts);
}

function renderQueueCenterLayout({
  context,
  projectName,
  queueCenter,
  session,
  items,
  selectedItem,
  queueCounts,
  prompts
}) {
  const escapeHtml = context.escapeHtml;
  const projectLabel = projectName || "No project selected";
  const hasFilters = Boolean(
    asString(session.search).trim() ||
    session.focus !== "all" ||
    session.status !== "all"
  );
  const emptyText = hasFilters
    ? "No queue items match the current filters."

## Queue Center route/action region
    : items.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge neutral">${escapeHtml(titleCase(item.queue_type || "queue"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
              <strong>${escapeHtml(item.title || "Queue item")}</strong>
              <span>${escapeHtml(item.details?.summary || item.entity_type || "-")}</span>
            </button>
          </td>
          <td>${escapeHtml(item.assignee || "-")}</td>
          <td><span class="card-badge ${badgeTone(item.priority)}">${escapeHtml(titleCase(item.priority || "normal"))}</span></td>
          <td><span class="card-badge ${badgeTone(item.status)}">${escapeHtml(titleCase(item.status || "queued"))}</span></td>
          <td>${escapeHtml(formatDateTime(item.updated_at || item.created_at))}</td>
          <td>${renderRouteAction(item, escapeHtml)}</td>
        </tr>
      `);

  return `
    <section class="page is-active" data-page="queue-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">QUEUE CENTER</span>
              <h3 class="std-context-title">Queue Center</h3>
            </div>
            <p class="std-context-description">Review workflow, content, media, approval, publishing, and sync queue pressure for ${escapeHtml(projectLabel)}.</p>
            <div class="std-context-metrics" aria-label="Queue Center metrics">
              <span class="std-context-chip"><span>Visible</span><strong>${escapeHtml(formatCount(totalVisible))}</strong></span>
              <span class="std-context-chip"><span>Total</span><strong>${escapeHtml(formatCount(totalItems))}</strong></span>
              <span class="std-context-chip is-warning"><span>Active</span><strong>${escapeHtml(formatCount(totalActive))}</strong></span>
              <span class="std-context-chip is-warning"><span>Queued</span><strong>${escapeHtml(formatCount(totalQueued))}</strong></span>
              <span class="std-context-chip"><span>Running</span><strong>${escapeHtml(formatCount(totalRunning))}</strong></span>
            </div>
          </div>
          <div class="std-context-actions">
            <span class="card-badge neutral">Project: ${escapeHtml(projectLabel)}</span>
            <button class="btn btn-secondary std-context-btn" type="button" id="queueCenterRefreshBtnHeader">Refresh</button>
          </div>
        </section>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "System Runtime",
          title: "System Signal",
          description: "Supporting cross-center runtime and queue pressure context.",
          badge: "Supporting context"
        })}

        <div class="ops-layout-grid">
          <article class="panel ops-main-column mhos-clean-stack">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Main View</div>
                <h3>Queue review operations</h3>
                <p>Review queue pressure by type and status, then route each item to its owning workspace for controlled action.</p>
              </div>
              <span class="card-badge ${showLoadingState ? "warning" : "neutral"}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
            </div>

            ${renderOpsFocusTabs([
              { value: "all", label: "All Queues", count: formatCount(totalItems) },
              ...asArray(asObject(queueCenter.filters).queue_types).map((item) => ({
                value: asString(item.value),
                label: titleCase(item.value || "queue"),
                count: formatCount(item.count)
              }))
            ], session.focus, escapeHtml)}

            <div class="ops-toolbar ops-toolbar-compact">
              <input id="queueCenterSearch" class="command-input" type="text" placeholder="Search queues, items, assignees..." value="${escapeHtml(session.search)}">
              <select id="queueCenterStatus" class="sidebar-select">${renderFilterOptions(asObject(queueCenter.filters).statuses, session.status, escapeHtml, "All statuses")}</select>
            </div>

            ${showErrorState && items.length > 0 ? `
              <div class="error-state ops-queue-state" aria-live="assertive"><strong>Queue Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
            ` : ""}

            ${renderOpsTable(
              ["Queue", "Item", "Assignee", "Priority", "Status", "Updated", "Route"],
              tableRows,
              stateRow ? "" : emptyText,
              escapeHtml
            )}
          </article>

          <aside class="ops-right-rail mhos-clean-stack">
            <section class="panel ops-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Selected Queue Item</div>
                  <h3>${escapeHtml(selectedItem?.title || "Select a queue item")}</h3>
                  <p>${escapeHtml(selectedItem ? "Inspect queue type, owner, status, and route target before routing." : "Choose a queue item from the table to inspect details.")}</p>
                </div>
              </div>
              ${selectedItem ? `
                <div class="ops-detail-stack">
                  <div class="ops-detail-summary">
                    <strong>${escapeHtml(selectedItem.title || "Queue item")}</strong>
                    <p>${escapeHtml(selectedItem.details?.summary || selectedItem.entity_type || "No queue summary available.")}</p>
                  </div>
                  ${renderOpsDetailRows([
                    { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
                    { label: "Assignee", value: selectedItem.assignee || "-" },
                    { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
                    { label: "Status", value: titleCase(selectedItem.status || "queued") },
                    { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
                    { label: "Entity", value: selectedItem.entity_type || "-" }
                  ], escapeHtml)}
                </div>
              ` : `<div class="empty-box">No queue item is selected.</div>`}
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Action Panel</div>
                  <h3>Queue review actions</h3>
                  <p>Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
              </div>
              <div class="ops-mini-list">
                ${queueCounts.map((item) => `
                  <div class="ops-mini-item">
                    <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
                    <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
                  </div>
                `).join("")}
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>
                  <h3>Operations AI Assistant</h3>
                  <p>Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
              </div>
              <div class="quick-actions">
                ${prompts.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
                    <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
                    <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `;
}

function renderQueueCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const queueCenter = asObject(asObject(state.data.operations).queue_center);
  const session = ensureSession(queueSessions, projectName, {
    focus: "all",
    status: "all",
    search: "",
    selectedKey: "",
    isLoading: false,
    errorMessage: ""
  });

  let items = asArray(queueCenter.items).map((item, index) => ({
    ...item,
    _opsKey: getOpsItemKey(item, index, "queue")
  }));
  items = filterBySearch(items, session.search, ["title", "assignee", "queue_type", "status"]);
  if (session.focus !== "all") items = items.filter((item) => asString(item.queue_type) === session.focus);
  if (session.status !== "all") items = items.filter((item) => asString(item.status) === session.status);
  const selectedItem = items.find((item) => item._opsKey === session.selectedKey) || items[0] || null;
  session.selectedKey = selectedItem?._opsKey || "";
  const queueCounts = asArray(queueCenter.queue_counts);
  const prompts = buildOpsAssistantPrompts("queue-center", projectName, selectedItem, titleCase(session.focus || "all queues"));

  root.innerHTML = renderQueueCenterLayout({
    context,
    projectName,
    queueCenter,
    session,
    items,
    selectedItem,
    queueCounts,
    prompts
  });

  const rerender = () => renderQueueCenter(context, context.getState(), projectName);
  const refreshQueueCenter = () => {
    if (context.fetchProjectQueueCenter && projectName) {
      session.isLoading = true;
      session.errorMessage = "";
      rerender();
      context.fetchProjectQueueCenter(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.queue_center = liveData;
          renderQueueCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          session.isLoading = false;
          session.errorMessage = `Queue Center: ${error?.message || "Failed to refresh."}`;
          rerender();
          context.showError?.(session.errorMessage);
        });
    } else {
      session.errorMessage = "";
      context.reloadProjectData?.(projectName);
    }
  };
  root.querySelector("#queueCenterRefreshBtn")?.addEventListener("click", refreshQueueCenter);
  root.querySelector("#queueCenterRefreshBtnHeader")?.addEventListener("click", refreshQueueCenter);
  bindOpsFocusButtons(root, (focus) => {
    session.focus = focus || "all";
    rerender();
  });
  bindOpsSelectionButtons(root, (selectedKey) => {
    session.selectedKey = selectedKey;
    rerender();
  });
  root.querySelector("#queueCenterSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#queueCenterStatus", "status"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
  bindOpsAssistantButtons(root, context, prompts);
}

function renderJobMonitorLayout({
  context,
  projectName,
  jobMonitor,
  session,
  items,
  selectedItem,
  prompts
}) {
  const escapeHtml = context.escapeHtml;
  const projectLabel = projectName || "No project selected";
  const hasFilters = Boolean(
    asString(session.search).trim() ||

## Job Monitor route/action region
    : items.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge neutral">${escapeHtml(titleCase(item.kind || "job"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
              <strong>${escapeHtml(item.title || "Job")}</strong>
              <span>${escapeHtml(titleCase(item.status || "unknown"))}</span>
            </button>
          </td>
          <td>${escapeHtml(item.owner || "-")}</td>
          <td>${escapeHtml(formatCount(item.retry_count))}</td>
          <td><span class="card-badge ${badgeTone(item.health_state)}">${escapeHtml(titleCase(item.health_state || "unknown"))}</span></td>
          <td><span class="card-badge ${badgeTone(item.status)}">${escapeHtml(titleCase(item.status || "unknown"))}</span></td>
          <td>${escapeHtml(formatDateTime(item.updated_at || item.created_at))}</td>
          <td>${renderRouteAction(item, escapeHtml)}</td>
        </tr>
      `);

  return `
    <section class="page is-active" data-page="job-monitor">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">JOB MONITOR</span>
              <h3 class="std-context-title">Job Monitor</h3>
            </div>
            <p class="std-context-description">Review running, completed, and failed job state across workflows, media, and publishing for ${escapeHtml(projectLabel)} without triggering workers.</p>
            <div class="std-context-metrics" aria-label="Job Monitor metrics">
              <span class="std-context-chip"><span>Health</span><strong>${escapeHtml(titleCase(jobMonitor.health_state || "unknown"))}</strong></span>
              <span class="std-context-chip is-warning"><span>Running</span><strong>${escapeHtml(formatCount(jobMonitor.running_count))}</strong></span>
              <span class="std-context-chip"><span>Completed</span><strong>${escapeHtml(formatCount(jobMonitor.completed_count))}</strong></span>
              <span class="std-context-chip is-danger"><span>Failed</span><strong>${escapeHtml(formatCount(jobMonitor.failed_count))}</strong></span>
            </div>
          </div>
          <div class="std-context-actions">
            <span class="card-badge neutral">Project: ${escapeHtml(projectLabel)}</span>
            <button class="btn btn-secondary std-context-btn" type="button" id="jobMonitorRefreshBtnHeader">Refresh</button>
          </div>
        </section>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "System Runtime",
          title: "System Signal",
          description: "Supporting cross-center runtime and execution health context.",
          badge: "Supporting context"
        })}

        <div class="ops-layout-grid">
          <article class="panel ops-main-column mhos-clean-stack">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Main View</div>
                <h3>Job state inventory</h3>
                <p>Filter by job status and kind to review active and failed work without changing lifecycle state.</p>
              </div>
              <span class="card-badge ${showLoadingState ? "warning" : "neutral"}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
            </div>

            ${renderOpsFocusTabs([
              { value: "all", label: "All Jobs", count: formatCount(asArray(jobMonitor.items).length) },
              { value: "running", label: "Running", count: formatCount(jobMonitor.running_count) },
              { value: "failed", label: "Failed", count: formatCount(jobMonitor.failed_count) },
              { value: "completed", label: "Completed", count: formatCount(jobMonitor.completed_count) }
            ], session.focus, escapeHtml)}

            <div class="ops-toolbar ops-toolbar-compact">
              <input id="jobMonitorSearch" class="command-input" type="text" placeholder="Search jobs, kinds, owners..." value="${escapeHtml(session.search)}">
              <select id="jobMonitorKind" class="sidebar-select">
                ${["all", "workflow", "media", "publishing"].map((value) => `<option value="${escapeHtml(value)}"${value === session.kind ? " selected" : ""}>${escapeHtml(titleCase(value))}</option>`).join("")}
              </select>
            </div>

            ${showErrorState && items.length > 0 ? `
              <div class="error-state ops-job-state" aria-live="assertive"><strong>Job Monitor error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
            ` : ""}

            ${renderOpsTable(
              ["Kind", "Job", "Owner", "Retries", "Health", "Status", "Updated", "Route"],
              tableRows,
              stateRow ? "" : emptyText,
              escapeHtml
            )}
          </article>

          <aside class="ops-right-rail mhos-clean-stack">
            <section class="panel ops-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Selected Job</div>
                  <h3>${escapeHtml(selectedItem?.title || "Select a job")}</h3>
                  <p>${escapeHtml(selectedItem ? "Inspect owner, execution health, retry state, and route context before routing." : "Choose a job from the table to inspect details.")}</p>
                </div>
              </div>
              ${selectedItem ? `
                <div class="ops-detail-stack">
                  <div class="ops-detail-summary">
                    <strong>${escapeHtml(selectedItem.title || "Job")}</strong>
                    <p>${escapeHtml(`Kind: ${titleCase(selectedItem.kind || "job")} • Status: ${titleCase(selectedItem.status || "unknown")}`)}</p>
                  </div>
                  ${renderOpsDetailRows([
                    { label: "Owner", value: selectedItem.owner || "-" },
                    { label: "Kind", value: titleCase(selectedItem.kind || "job") },
                    { label: "Retries", value: formatCount(selectedItem.retry_count) },
                    { label: "Health", value: titleCase(selectedItem.health_state || "unknown") },
                    { label: "Status", value: titleCase(selectedItem.status || "unknown") },
                    { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) }
                  ], escapeHtml)}
                </div>
              ` : `<div class="empty-box">No job is selected.</div>`}
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Action Panel</div>
                  <h3>Job review actions</h3>
                  <p>Active actions are refresh, route, and AI guidance only. Job retry, cancel, rerun, delete, worker execution, publishing, and approval mutations remain disabled or destination-owned.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Job Owning Context") : ""}
              </div>
              <div class="ops-log-list">
                ${asArray(jobMonitor.execution_logs).length ? asArray(jobMonitor.execution_logs).slice(0, 4).map((item) => `
                  <div class="ops-log-item">
                    <span class="card-badge ${badgeTone(item.severity)}">${escapeHtml(titleCase(item.category || "log"))}</span>
                    <strong>${escapeHtml(item.title || "Execution event")}</strong>
                    <p>${escapeHtml(item.summary || "-")}</p>
                    <div class="ops-log-meta">
                      <span>${escapeHtml(formatDateTime(item.timestamp))}</span>
                      ${renderRouteAction(item, escapeHtml, "Open")}
                    </div>
                  </div>
                `).join("") : `<div class="empty-box">Execution logs will appear here as jobs run.</div>`}
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (disabled: future mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (disabled: future destructive mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (disabled: backend worker-control safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (disabled: future destructive mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>
                  <h3>Operations AI Assistant</h3>
                  <p>Context-only guidance: opens AI with prompt/context only. No retry, cancel, rerun, delete, worker trigger, approve, publish, Governance bypass, or backend execution is performed.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Job Context</button>
              </div>
              <div class="quick-actions">
                ${prompts.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
                    <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
                    <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `;
}

function renderJobMonitor(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const jobMonitor = asObject(asObject(state.data.operations).job_monitor);
  const session = ensureSession(jobSessions, projectName, {
    focus: "all",
    kind: "all",
    search: "",
    selectedKey: "",
    isLoading: false,
    errorMessage: ""
  });

  let items = asArray(jobMonitor.items).map((item, index) => ({
    ...item,
    _opsKey: getOpsItemKey(item, index, "job")
  }));
  items = filterBySearch(items, session.search, ["title", "kind", "status", "owner"]);
  if (session.focus !== "all") items = items.filter((item) => asString(item.status) === session.focus);
  if (session.kind !== "all") items = items.filter((item) => asString(item.kind) === session.kind);
  const selectedItem = items.find((item) => item._opsKey === session.selectedKey) || items[0] || null;
  session.selectedKey = selectedItem?._opsKey || "";
  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));

  root.innerHTML = renderJobMonitorLayout({
    context,
    projectName,
    jobMonitor,
    session,
    items,
    selectedItem,
    prompts
  });

  const rerender = () => renderJobMonitor(context, context.getState(), projectName);
  const refreshJobMonitor = () => {
    if (context.fetchProjectJobMonitor && projectName) {
      session.isLoading = true;
      session.errorMessage = "";
      rerender();
      context.fetchProjectJobMonitor(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.job_monitor = liveData;
          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          session.isLoading = false;
          session.errorMessage = `Job Monitor: ${error?.message || "Failed to refresh."}`;
          rerender();
          context.showError?.(session.errorMessage);
        });
    } else {
      session.errorMessage = "";
      context.reloadProjectData?.(projectName);
    }
  };
  root.querySelector("#jobMonitorRefreshBtn")?.addEventListener("click", refreshJobMonitor);
  root.querySelector("#jobMonitorRefreshBtnHeader")?.addEventListener("click", refreshJobMonitor);
  bindOpsFocusButtons(root, (focus) => {
    session.focus = focus || "all";
    rerender();
  });
  bindOpsSelectionButtons(root, (selectedKey) => {
    session.selectedKey = selectedKey;
    rerender();
  });
  root.querySelector("#jobMonitorSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#jobMonitorKind", "kind"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
  bindOpsAssistantButtons(root, context, prompts);
}

function deriveProviderDisconnectAlerts(state, existingAlerts) {
  if (asArray(existingAlerts).length) return asArray(existingAlerts);

  const integrations = asObject(state.data.integrations);
  const checks = asObject(integrations.readiness?.checks);

  return Object.entries(checks)
    .filter(([, value]) => value === false)
    .map(([key]) => ({
      id: `provider-${key}`,
      title: `${titleCase(key)} disconnected`,
      message: "Provider readiness check is currently failing.",
      severity: "warning",
      route: { route: "integrations" }
    }));
}

function renderNotificationCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

## Notification Center route/action region
        </tr>
      `);

  root.innerHTML = `
    <section class="page is-active" data-page="notification-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">NOTIFICATIONS</span>
              <h3 class="std-context-title">Notification Center</h3>
            </div>
            <p class="std-context-description">Review operational alerts, unread inbox state, approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
            <div class="std-context-metrics" aria-label="Notification Center metrics">
              <span class="std-context-chip"><span>Active Alerts</span><strong>${escapeHtml(formatCount(baseAlerts.length))}</strong></span>
              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
              <span class="std-context-chip is-danger"><span>Critical</span><strong>${escapeHtml(formatCount(notificationCenter.critical_count))}</strong></span>
              <span class="std-context-chip is-warning"><span>Approvals</span><strong>${escapeHtml(formatCount(approvalAlerts.length))}</strong></span>
            </div>
          </div>
          <div class="std-context-actions">
            <span class="card-badge neutral">Project: ${escapeHtml(projectLabel)}</span>
            <button class="btn btn-secondary std-context-btn" type="button" id="notificationCenterRefreshBtnHeader">Refresh</button>
          </div>
        </section>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "System Runtime",
          title: "System Signal",
          description: "Supporting cross-center runtime and urgency signal context.",
          badge: "Supporting context"
        })}

        <div class="ops-layout-grid">
          <article class="panel ops-main-column mhos-clean-stack">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Main View</div>
                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history and read-state review" : "Operational alert review")}</h3>
                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history. Mark Read updates read-state only where a backend notification id exists." : "Review route-aware alerts, then inspect the selected signal before routing or follow-up.")}</p>
              </div>
              <span class="card-badge ${showLoadingState ? "warning" : "neutral"}">${escapeHtml(showLoadingState ? "Refreshing" : `${listItems.length} visible`)}</span>
            </div>

            ${renderOpsFocusTabs([
              { value: "all", label: "All Alerts", count: formatCount(baseAlerts.length) },
              { value: "critical", label: "Critical", count: formatCount(notificationCenter.critical_count) },
              { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
              { value: "provider", label: "Provider", count: formatCount(providerAlerts.length) },
              { value: "inbox", label: "Inbox", count: formatCount(inboxList.length) }
            ], session.focus, escapeHtml)}

            <div class="ops-toolbar ops-toolbar-compact">
              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
              <select id="notificationCenterSeverity" class="sidebar-select">
                ${["all", "critical", "warning", "success", "info"].map((value) => `<option value="${escapeHtml(value)}"${value === session.severity ? " selected" : ""}>${escapeHtml(titleCase(value))}</option>`).join("")}
              </select>
            </div>

            ${showErrorState && listItems.length > 0 ? `
              <div class="error-state ops-notification-state" aria-live="assertive"><strong>Notification Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
            ` : ""}

            ${renderOpsTable(
              ["Severity", "Signal", "Source", "Created", "Route"],
              tableRows,
              stateRow ? "" : emptyText,
              escapeHtml
            )}
          </article>

          <aside class="ops-right-rail mhos-clean-stack">
            <section class="panel ops-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Selected Notification</div>
                  <h3>${escapeHtml(selectedItem?.title || "Select a notification")}</h3>
                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
                </div>
              </div>
              ${selectedItem ? `
                <div class="ops-detail-stack">
                  <div class="ops-detail-summary">
                    <strong>${escapeHtml(selectedItem.title || "Notification")}</strong>
                    <p>${escapeHtml(selectedItem.message || selectedItem.body || "No notification detail available.")}</p>
                  </div>
                  ${renderOpsDetailRows([
                    { label: "Severity", value: titleCase(selectedItem.severity || "info") },
                    { label: "Source", value: titleCase(selectedItem.source || selectedItem.item_type || "system") },
                    { label: "Created", value: formatDateTime(selectedItem.created_at) },
                    { label: "Route", value: selectedItem.route?.route || selectedItem.route || "-" }
                  ], escapeHtml)}
                </div>
              ` : `<div class="empty-box">No notification is selected.</div>`}
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Action Panel</div>
                  <h3>Notification review actions</h3>
                  <p>Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Source Page") : ""}
                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}" title="Updates notification read-state only. Does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.">Mark Read (read-state only)</button>` : ""}
              </div>
              <div class="ops-mini-list">
                <div class="ops-mini-item">
                  <strong>${escapeHtml("Approval pending")}</strong>
                  <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
                </div>
                <div class="ops-mini-item">
                  <strong>${escapeHtml("Provider health")}</strong>
                  <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
                </div>
                <div class="ops-mini-item">
                  <strong>${escapeHtml("Claim risk")}</strong>
                  <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
                </div>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (disabled: future lifecycle mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (disabled: future incident-resolution safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (disabled: future visibility mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (disabled: future destructive mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>
                  <h3>Operations AI Assistant</h3>
                  <p>Context-only guidance: opens AI with prompt/context only. No mark-read, acknowledge, resolve, dismiss, delete, send, approve, publish, Governance bypass, or backend execution is performed.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Notification Context</button>
              </div>
              <div class="quick-actions">
                ${prompts.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
                    <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
                    <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `;

  const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
  const refreshNotificationCenter = () => {
    if (context.fetchProjectNotificationCenter && projectName) {
      session.isLoading = true;
      session.errorMessage = "";
      rerender();
      context.fetchProjectNotificationCenter(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.notification_center = liveData;
          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          session.isLoading = false;
          session.errorMessage = `Notification Center: ${error?.message || "Failed to refresh."}`;
          rerender();
          context.showError?.(session.errorMessage);
        });
    } else {
      session.errorMessage = "";
      context.reloadProjectData?.(projectName);
    }
  };
  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", refreshNotificationCenter);
  root.querySelector("#notificationCenterRefreshBtnHeader")?.addEventListener("click", refreshNotificationCenter);
  bindOpsFocusButtons(root, (focus) => {
    session.focus = focus || "all";
    rerender();
  });
  bindOpsSelectionButtons(root, (selectedKey) => {
    session.selectedKey = selectedKey;
    rerender();
  });
  root.querySelector("#notificationCenterSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  root.querySelector("#notificationCenterSeverity")?.addEventListener("change", (event) => {
    session.severity = event.target.value || "all";
    rerender();
  });
  Array.from(root.querySelectorAll("[data-mark-read]")).forEach((button) => {
    button.onclick = async () => {
      const notificationId = button.getAttribute("data-mark-read") || "";
      if (!notificationId || !context.markProjectNotification) return;
      try {
        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
        await context.reloadProjectData?.(projectName);
        context.showMessage?.("Notification marked as read.");
      } catch (error) {
        context.showError?.(error.message || "Failed to update notification.");
      }
    };
  });
  bindRouteButtons(root, context);
  bindOpsAssistantButtons(root, context, prompts);
}

## Operations Overview action/safety region
      action: "Open Notifications"
    }
  ];

  root.innerHTML = `
    <section class="page is-active" data-page="operations-centers">
      <div class="ops-workspace">
        <div class="std-context-ribbon">
          <div>
            <span class="std-context-eyebrow">Operations Routing Layer</span>
            <h2>Operations Centers</h2>
            <p class="std-context-description">A unified routing entry point for tasks, queues, job health, and notification signals for ${context.escapeHtml(projectName)}.</p>
          </div>
          <div class="std-context-actions">
            <span class="std-context-chip"><span>Tasks</span><strong>${context.escapeHtml(formatCount(taskCount))}</strong></span>
            <span class="std-context-chip"><span>Queue</span><strong>${context.escapeHtml(formatCount(queueCount))}</strong></span>
            <span class="std-context-chip"><span>Jobs</span><strong>${context.escapeHtml(formatCount(jobCount))}</strong></span>
            <span class="std-context-chip"><span>Signals</span><strong>${context.escapeHtml(formatCount(notificationCount))}</strong></span>
          </div>
        </div>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "Operations",
          title: "Operations Health Overview",
          description: "Use this page as the routing hub from AI Team drafts, workflows, tasks, and runtime signals into the correct operations workspace.",
          badge: "Composite route"
        })}

        <div class="ops-layout-grid">
          <div class="ops-main-column">
            <section class="panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Routing Handoff</div>
                  <h3>Choose the owning operations surface</h3>
                  <p>AI Team can prepare drafts, tasks, workflows, and handoffs. This overview routes work to the owning operations center for review, monitoring, or controlled follow-up.</p>
                </div>
              </div>

              <div class="ops-runtime-signal-grid">
                ${centers.map((center) => `
                  <article class="ops-runtime-signal">
                    <span>${context.escapeHtml(center.kicker)}</span>
                    <strong>${context.escapeHtml(center.title)}</strong>
                    <small>${context.escapeHtml(center.description)}</small>
                    <span class="card-badge neutral">${context.escapeHtml(formatCount(center.count))}</span>
                    <div class="ops-action-row">
                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
                        ${context.escapeHtml(center.action)}
                      </button>
                    </div>
                  </article>
                `).join("")}
              </div>
            </section>
          </div>

          <aside class="ops-right-rail">
            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Team Connection</div>
                  <h3>Operations Lead handoff</h3>
                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
              </div>
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Safety</div>
                  <h3>Routing-only safety</h3>
                  <p>This overview does not execute jobs, mutate tasks, send notifications, approve workflows, mark notifications read, publish, or trigger workers. It only routes to the owning workspace.</p>
                </div>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: create task from draft — future task mutation safety pass</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: execute workflow — future workflow execution safety pass</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned disabled: acknowledge signal — future notification lifecycle mutation safety pass</button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `;

  bindRouteButtons(root, context);
}

export const operationsCentersRoute = {
  id: "operations-centers",
  label: "Operations Centers",
  meta: {
    eyebrow: "Operate",
    title: "Operations Centers",
    description: "Routing-only overview for Task Center, Queue Center, Job Monitor, Notifications, AI Team, and Workflows."
  },
  template: `<section class="page is-active" data-page="operations-centers"><div class="ops-shell"></div></section>`,
  render(context) {
    renderOperationsCentersOverview(context);
  }
};

