# PHASE 3Z.3 — Queue Center Copy Target Markers

## Candidate risky copy strings
923:                <h3>Queue operations</h3>
986:                  <h3>Queue actions</h3>
987:                  <p>Safe actions are active. Queue mutation and execution controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
992:                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owner Page") : ""}
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
1015:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1019:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1277:                  <p>Safe actions are active. Mutation and destructive controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
1310:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1314:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1631:                  <p>Safe actions are active. Notification mutation controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
1666:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1788:    description: "Control workflow, content, media, approval, publishing, and sync queues from one central operations surface."

## Relevant source ranges

### Queue Center layout
    <section class="page is-active" data-page="queue-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">QUEUE CENTER</span>
              <h3 class="std-context-title">Queue Center</h3>
            </div>
            <p class="std-context-description">Workflow, content, media, approval, publishing, and sync queues aligned into one operational queue surface for ${escapeHtml(projectLabel)}.</p>
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
                <h3>Queue operations</h3>
                <p>Switch queue type focus and status filter to route each item to the owning page.</p>
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
                  <p>${escapeHtml(selectedItem ? "Inspect queue type, owner, status, and route target before acting." : "Choose a queue item from the table to inspect details.")}</p>
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
                  <h3>Queue actions</h3>
                  <p>Safe actions are active. Queue mutation and execution controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owner Page") : ""}
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
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">

### Queue Center handlers
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

### Route metadata
export const queueCenterRoute = {
  id: "queue-center",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Queue Center",
    description: "Control workflow, content, media, approval, publishing, and sync queues from one central operations surface."
  },
  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
