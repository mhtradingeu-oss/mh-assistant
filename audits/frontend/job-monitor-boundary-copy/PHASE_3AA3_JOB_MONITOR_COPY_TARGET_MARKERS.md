# PHASE 3AA.3 — Job Monitor Copy Target Markers

## Candidate risky copy strings
1187:            <p class="std-context-description">Track running, completed, and failed execution across workflows, media, and publishing for ${escapeHtml(projectLabel)}.</p>
1213:                <h3>Execution inventory</h3>
1276:                  <h3>Execution actions</h3>
1277:                  <p>Safe actions are active. Mutation and destructive controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
1282:                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Job Context") : ""}
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
1310:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1314:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1631:                  <p>Safe actions are active. Notification mutation controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
1666:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1836:    description: "Track running jobs, failures, retries, health state, and execution logs across workflows, media, and publishing."

## Relevant source ranges

### Job Monitor layout
    <section class="page is-active" data-page="job-monitor">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">JOB MONITOR</span>
              <h3 class="std-context-title">Job Monitor</h3>
            </div>
            <p class="std-context-description">Track running, completed, and failed execution across workflows, media, and publishing for ${escapeHtml(projectLabel)}.</p>
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
                <h3>Execution inventory</h3>
                <p>Filter by execution status and kind to inspect active and failed work quickly.</p>
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
                  <p>${escapeHtml(selectedItem ? "Inspect owner, execution health, retry state, and route context." : "Choose a job from the table to inspect details.")}</p>
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
                  <h3>Execution actions</h3>
                  <p>Safe actions are active. Mutation and destructive controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Job Context") : ""}
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
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
              </div>
            </section>

            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Panel</div>
                  <h3>Operations AI Assistant</h3>
                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
              </div>
              <div class="quick-actions">
                ${prompts.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">

### Job Monitor handlers
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


### Route metadata
export const jobMonitorRoute = {
  id: "job-monitor",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Job Monitor",
    description: "Track running jobs, failures, retries, health state, and execution logs across workflows, media, and publishing."
  },
  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";

