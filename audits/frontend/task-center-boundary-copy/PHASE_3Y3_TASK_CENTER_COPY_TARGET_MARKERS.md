# PHASE 3Y.3 — Task Center Copy Target Markers

## Candidate risky copy strings
453:          <h3>Incoming Task Handoff</h3>
454:          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically.</p>
472:        <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace</button>
525:            <p class="std-context-description">Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
552:                <h3>Execution backlog</h3>
639:                  <h3>Task actions</h3>
640:                  <p>Active actions are safe and non-destructive. Mutation actions remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
645:                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Linked Work") : ""}
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (deferred: mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (deferred: mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (deferred: mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (deferred: mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (deferred: mutation safety pass)</button>
666:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
780:          "Incoming Task Handoff",
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
1019:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
1314:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1753:    description: "Manage durable tasks, owners, due dates, priorities, filters, and linked operational entities in one premium execution surface."

## Relevant source ranges

### Incoming handoff
function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
  if (!incomingHandoff) return "";

  const source = asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown");
  const title = asString(
    incomingHandoff.title ||
    incomingHandoff.summary ||
    incomingHandoff.payload?.title ||
    incomingHandoff.payload?.summary ||
    "Incoming task handoff"
  );
  const description = asString(
    incomingHandoff.description ||
    incomingHandoff.payload?.description ||
    incomingHandoff.payload?.handoff_intent ||
    incomingHandoff.payload?.prompt ||
    "Review-only handoff prepared by another MH-OS surface."
  );
  const createdAt = asString(incomingHandoff.created_at || incomingHandoff.generatedAt || incomingHandoff.timestamp || "");

  return `
    <section class="panel ops-incoming-handoff mhos-clean-surface">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Incoming Handoff</div>
          <h3>Incoming Task Handoff</h3>
          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically.</p>
        </div>
        <span class="card-badge warning">Review-only</span>
      </div>
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(description)}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Source", value: titleCase(source) },
          { label: "Destination", value: "Task Center" },
          { label: "Status", value: "Review-only intake" },
          { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
        ], escapeHtml)}
      </div>
      <div class="ops-action-row">
        <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
        <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace</button>
      </div>
    </section>
  `;
}

### Task Center layout
    <section class="page is-active" data-page="task-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">TASK CENTER</span>
              <h3 class="std-context-title">Task Center</h3>
            </div>
            <p class="std-context-description">Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
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
                <h3>Execution backlog</h3>
                <p>Filter by focus, owner, source, and priority to inspect task risk quickly.</p>
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
                  <p>${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and execution context." : "Choose a task in the table to inspect details.")}</p>
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
                  <h3>Task actions</h3>
                  <p>Active actions are safe and non-destructive. Mutation actions remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Linked Work") : ""}
                <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (deferred: mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>

### Task Center handlers
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
          "Incoming Task Handoff",
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

### Route metadata
export const taskCenterRoute = {
  id: "task-center",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Task Center",
    description: "Manage durable tasks, owners, due dates, priorities, filters, and linked operational entities in one premium execution surface."
  },
  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";

    // Render immediately from state as fallback
    renderTaskCenter(context, context.getState(), projectName);

