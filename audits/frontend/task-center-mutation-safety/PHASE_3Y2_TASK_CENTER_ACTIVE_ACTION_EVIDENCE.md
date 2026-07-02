# PHASE 3Y.2 — Task Center Active Action Evidence

## Task Center route and render ranges
428:function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
471:        <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
479:function renderTaskCenterLayout({
536:            <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
606:            ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
644:                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
646:                <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (deferred: mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (deferred: mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (deferred: mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (deferred: mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (deferred: mutation safety pass)</button>
685:function renderTaskCenter(context, state, projectName) {
721:  root.innerHTML = renderTaskCenterLayout({
733:  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
745:          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
758:  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", refreshTaskCenter);
759:  root.querySelector("#taskCenterRefreshBtnRail")?.addEventListener("click", refreshTaskCenter);
760:  root.querySelector("#taskCenterCopySummaryBtn")?.addEventListener("click", async () => {
777:  root.querySelector("#taskCenterCopyHandoffBtn")?.addEventListener("click", async () => {
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1747:export const taskCenterRoute = {
1761:    renderTaskCenter(context, context.getState(), projectName);
1771:          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Task Center handler range
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

## Task Center layout mutation/deferred controls
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

## Incoming handoff range
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
