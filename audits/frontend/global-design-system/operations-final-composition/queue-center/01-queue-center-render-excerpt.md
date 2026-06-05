# Queue Center Active Render Excerpt

Generated: Sat Jun  6 00:16:51 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: 31a2c09

## renderQueueCenterLayout + renderQueueCenter area
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
    : "No queue items are available for this project yet. Use Refresh or adjust project context to load current queues.";

  const totalVisible = items.length;
  const totalItems = asArray(queueCenter.items).length;
  const totalActive = queueCounts.reduce((sum, item) => sum + Number(item.active || 0), 0);
  const totalQueued = items.filter((item) => asString(item.status) === "queued").length;
  const totalRunning = items.filter((item) => asString(item.status) === "running").length;
  const showLoadingState = Boolean(session.isLoading);
  const showErrorState = Boolean(session.errorMessage);
  const showStateCard = (showLoadingState || showErrorState) && items.length > 0;
  const stateRow = showErrorState && !items.length
    ? `
      <tr class="ops-state-row">
        <td colspan="7">
          <div class="error-state ops-queue-state" aria-live="assertive">
            <strong>Queue Center error</strong>
            <span>${escapeHtml(session.errorMessage)}</span>
          </div>
        </td>
      </tr>
    `
      : "";
  const tableRows = stateRow
    ? [stateRow]
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
