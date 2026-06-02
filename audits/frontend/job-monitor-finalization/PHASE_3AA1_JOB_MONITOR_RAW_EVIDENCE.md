# PHASE 3AA.1 — Job Monitor Raw Evidence

## Source file
Job Monitor source: public/control-center/pages/operations-centers.js

## Job Monitor route / render / handlers
4:const jobSessions = new Map();
222:  if (pageKey === "job-monitor") {
299:      route: "job-monitor"
313:      route: "job-monitor"
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
1123:function renderJobMonitorLayout({
1179:    <section class="page is-active" data-page="job-monitor">
1197:            <button class="btn btn-secondary std-context-btn" type="button" id="jobMonitorRefreshBtnHeader">Refresh</button>
1281:                <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
1332:function renderJobMonitor(context, state, projectName) {
1337:  const session = ensureSession(jobSessions, projectName, {
1355:  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));
1357:  root.innerHTML = renderJobMonitorLayout({
1367:  const rerender = () => renderJobMonitor(context, context.getState(), projectName);
1369:    if (context.fetchProjectJobMonitor && projectName) {
1373:      context.fetchProjectJobMonitor(projectName)
1379:          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1392:  root.querySelector("#jobMonitorRefreshBtn")?.addEventListener("click", refreshJobMonitor);
1393:  root.querySelector("#jobMonitorRefreshBtnHeader")?.addEventListener("click", refreshJobMonitor);
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1830:export const jobMonitorRoute = {
1831:  id: "job-monitor",
1838:  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
1843:    renderJobMonitor(context, context.getState(), projectName);
1846:      if (!projectName || !context.fetchProjectJobMonitor) return;
1847:      const session = ensureSession(jobSessions, projectName, {
1857:      renderJobMonitor(context, context.getState(), projectName);
1858:      context.fetchProjectJobMonitor(projectName)
1864:          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1869:          renderJobMonitor(context, context.getState(), projectName);
1957:      route: "job-monitor",
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Relevant Job Monitor source ranges

### Job Monitor layout
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
    session.focus !== "all" ||
    session.kind !== "all"
  );
  const emptyText = hasFilters
    ? "No jobs match the current filters."
    : "No jobs are available for this project yet. Use Refresh or adjust project context to load current execution state.";

  const showLoadingState = Boolean(session.isLoading);
  const showErrorState = Boolean(session.errorMessage);
  const showStateCard = (showLoadingState || showErrorState) && items.length > 0;
  const stateRow = showErrorState && !items.length
    ? `
      <tr class="ops-state-row">
        <td colspan="8">
          <div class="error-state ops-job-state" aria-live="assertive">
            <strong>Job Monitor error</strong>
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

### Job Monitor render and bindings
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

  const notificationCenter = asObject(asObject(state.data.operations).notification_center);
  const session = ensureSession(notificationSessions, projectName, {
    focus: "all",
    severity: "all",
    search: "",
    selectedKey: "",
    isLoading: false,
    errorMessage: ""
  });

  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
  const inboxItems = asArray(notificationCenter.notification_items).map((item) => ({
    ...item,
    title: asString(item.title) || "Notification",
    message: asString(item.message || item.body || item.summary),
    created_at: asString(item.created_at),
    notification_id: asString(item.id),
    route: asObject(item.linked_entity).route || "home",
    item_type: "inbox"
  }));
  const syncAlerts = asArray(notificationCenter.sync_failure_alerts).map((item) => ({ ...item, item_type: "sync" }));
  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).map((item) => ({ ...item, item_type: "approval" }));
  const publishAlerts = asArray(notificationCenter.publish_alerts).map((item) => ({ ...item, item_type: "publish" }));
  const providerAlerts = providerDisconnectAlerts.map((item) => ({ ...item, item_type: "provider" }));
  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).map((item) => ({ ...item, item_type: "claim" }));
  const workflowAlerts = asArray(notificationCenter.workflow_completion_alerts).map((item) => ({ ...item, item_type: "workflow" }));
  const baseAlerts = [
    ...syncAlerts,
    ...approvalAlerts,

### Job Monitor route export
    }

    doFetch();
  }
};

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

    renderJobMonitor(context, context.getState(), projectName);

    function doFetch() {
      if (!projectName || !context.fetchProjectJobMonitor) return;
      const session = ensureSession(jobSessions, projectName, {
        focus: "all",
        kind: "all",
        search: "",
        selectedKey: "",
        isLoading: false,
        errorMessage: ""
      });
      session.isLoading = true;
      session.errorMessage = "";
      renderJobMonitor(context, context.getState(), projectName);
      context.fetchProjectJobMonitor(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.job_monitor = liveData;
          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })

## API job monitor / job functions
451:  return new Promise((resolve) => {
453:      requestAnimationFrame(() => resolve());
457:    setTimeout(resolve, 0);
913:      scheduled_jobs: [],
1262:  return new Promise((resolve) => {
1263:    setTimeout(resolve, 750);
1323:  normalized._optionalReady = Promise.resolve().then(optionalReady);
1872:export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
1877:  if (!jobId) {
1878:    throw new Error("Missing job id");
1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
1894:  if (!jobId) {
1895:    throw new Error("Missing job id");
1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
1911:  if (!jobId) {
1912:    throw new Error("Missing job id");
1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
1928:  if (!jobId) {
1929:    throw new Error("Missing job id");
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1973:export async function fetchProjectJobMonitor(projectName) {
1979:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
1980:    "Failed to load job monitor"
2121:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
2122:    "Failed to load media jobs"
2133:      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
2136:      "Failed to update media job"
2141:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
2144:    "Failed to create media job"

## Backend job monitor / job routes
48:const { UnifiedDataPathResolver } = require('./lib/data/unified-data-path-resolver');
72:  resolveProjectPath,
231:  /^\/run_scheduler_worker_once\/?$/i
416:    retryAfterMs: decision.retryAfterMs
419:  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
423:    message: 'Too many requests. Please retry shortly.'
431:  resolver: unifiedDataPathResolver,
441:function resolveMediaProjectName(req) {
452:  const projectName = resolveMediaProjectName(req);
519:function resolveUploadTarget(projectName, type) {
557:function resolveMediaFilePath(projectName, type, filename) {
561:  const uploadTarget = resolveUploadTarget(project, normalizedType);
566:  const absoluteRoot = path.resolve(String(rootPath || ''));
567:  const absoluteTarget = path.resolve(String(targetPath || ''));
599:    .map((entry) => path.resolve(entry));
633:function resolveMediaFilePathFromQuery(projectName, requestedPath, assetId) {
639:  const resolveCandidate = (candidatePath) => {
640:    const candidate = path.resolve(String(candidatePath || ''));
675:      const resolved = resolveCandidate(candidate);
676:      if (resolved) {
678:          filePath: resolved,
693:    const resolved = resolveCandidate(byAssetId);
694:    if (resolved) {
696:        filePath: resolved,
741:        const uploadTarget = resolveUploadTarget(project, type);
761:const BASE_DIR = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
1170:function resolveReadCandidateFromBases(options = {}) {
1180:  const resolution = options.resolution || unifiedDataPathResolver.resolve(projectName, {
1252:  appLogger.info('read_redirection_resolved', {
1254:    action: 'resolve_read_candidate',
1276:function resolveExecutionReadCandidate(options = {}) {
1286:  const resolution = unifiedDataPathResolver.resolve(projectName, {
1322:  return resolveReadCandidateFromBases({
1341:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
1430:function resolveEmailReadCandidate(options = {}) {
1438:  return resolveExecutionReadCandidate({
1454:  const candidate = resolveEmailReadCandidate({
1511:  return resolveProjectPath(EXECUTION_DIR, requireQueueProjectName(projectName)).projectRoot;
1672:      unresolved_risk: 0
1710:      const cause = classifyFallbackWithParityContext(entry, dualWriteIndex) || 'unresolved_risk';
1712:        stats.fallback_causes.unresolved_risk += 1;
1723:  let unresolvedStructuralMismatches = 0;
1736:    unresolvedStructuralMismatches += stats.fallback_causes.structural_mismatch;
1754:    unresolvedStructuralMismatches === 0 &&
1761:    unresolvedStructuralMismatches <= 3
1780:      unresolved_structural_mismatches: unresolvedStructuralMismatches,
1805:    unresolved_structural_mismatches: 0,
1813:    aggregate.unresolved_structural_mismatches += summary.totals.unresolved_structural_mismatches;
1834:  const outputsDir = resolveExecutionReadCandidate({
1907:  if (!renderRequest || renderRequest.status !== 'completed') {
1908:    throw new Error('No completed render request found');
2090:  const prepareFile = resolveEmailReadCandidate({
2212:  const rendersDir = resolveExecutionReadCandidate({
2461:  const updated = markRenderResult(projectName, renderId, 'completed', {
2501:  const preparedDir = resolveEmailReadCandidate({
2783:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2787:  const outputDirResolution = resolveExecutionReadCandidate({
2820:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2993:  const packagesDir = resolveExecutionReadCandidate({
3015:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3114:  const tiktokDir = resolveExecutionReadCandidate({
3274:  const youtubeDir = resolveExecutionReadCandidate({
3296:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3502:      ? resolveExecutionReadCandidate({
3512:      ? resolveExecutionReadCandidate({
3540:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3544:  const baseDir = resolveExecutionReadCandidate({
3845:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3849:  const baseDir = resolveExecutionReadCandidate({
3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
4302:  const schedulerDir = resolveExecutionReadCandidate({
4308:    requestedIdentifier: 'scheduled-jobs-list',
4346:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4350:  const baseDir = resolveExecutionReadCandidate({
4715:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4719:  const baseDir = resolveExecutionReadCandidate({
4728:  const jobsDir = path.join(baseDir, 'jobs');
4731:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4736:  ensureDir(jobsDir);
4746:    jobsDir,
4757:  const jobsDir = resolveExecutionReadCandidate({
4760:    relativePath: 'jobs',
4764:    requestedFile: 'generated/jobs/*.json'
4767:  const files = fs.readdirSync(jobsDir)
4773:    throw new Error('No generation jobs found');
4776:  const latestPath = path.join(jobsDir, files[0]);
4823:  const rendersDir = resolveExecutionReadCandidate({
4847:  const renderRecord = resolveExecutionReadCandidate({
4863:  renderRequest.completed_at = new Date().toISOString();
4917:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4921:  const baseDir = resolveExecutionReadCandidate({
4930:  const jobsDir = path.join(baseDir, 'jobs');
4932:  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
4936:  ensureDir(jobsDir);
4944:    jobsDir,
5108:function resolveSourceOfTruthAssets(projectName) {
5162:  const sourceOfTruth = resolveSourceOfTruthAssets(projectName);
5322:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
5713:function resolveRequestProjectName(req, options = {}) {
5733:  const projectName = resolveRequestProjectName(req, options);
6138:  const resolved = resolveProjectPath(path.join(DATA_DIR, 'projects'), projectName);
6139:  const safeProject = resolved.project;
6140:  const baseDir = resolved.projectRoot;
6164:  const resolved = resolveProjectPath(LEGACY_BRAND_ASSETS_DIR, projectName);
6166:    project: resolved.project,
6167:    baseDir: resolved.projectRoot,
6168:    brandProfilePath: path.join(resolved.projectRoot, 'brand-profile.json'),
6169:    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
6170:    mediaInputRegistryPath: path.join(resolved.projectRoot, 'media-input-registry.json')
6701:      'complete_project_profile',
6733:      starter_checklist: ['complete_artist_profile', 'upload_press_photos', 'add_music_links', 'define_fan_audience', 'create_release_campaign'],
7172:    setup_completeness: setupCompleteness,
7173:    brand_profile_completeness: brandProfileCompleteness,
7174:    source_of_truth_completeness: sourceOfTruthCompleteness,
7175:    assets_completeness: assetsCompleteness,
7176:    integrations_completeness: integrationsCompleteness,
7220:  if (domainScores.brand_profile_completeness < 100) missing.push('brand_profile_incomplete');
7221:  if (domainScores.source_of_truth_completeness < 100) missing.push('source_of_truth_incomplete');
7222:  if (domainScores.assets_completeness < 100) missing.push('assets_incomplete');
7223:  if (domainScores.integrations_completeness < 100) missing.push('integrations_incomplete');
7676:      healthSummary = 'Some connection data is saved, but required setup is still incomplete.';
9067:    status: missing.length ? 'connectors_incomplete' : 'connectors_ready'
9354:    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
9386:    const logProject = projectName || resolveProjectNameForLog(req);
9412:    const emailPackage = resolveEmailPackageForExecution(projectName, req.body || {});
9443:    const logProject = projectName || resolveProjectNameForLog(req);
9503:    const logProject = projectName || resolveProjectNameForLog(req);
9529:    const campaignPackage = resolveCampaignPackageForAds(projectName, req.body || {});
9556:    const logProject = projectName || resolveProjectNameForLog(req);
9599:    const projectName = resolveRequestProjectName(req);
9644:    const projectName = resolveRequestProjectName(req);
9813:    const projectName = resolveRequestProjectName(req);
9971:    const uploadTarget = resolveUploadTarget(project, type);
10043:  const queryResolution = resolveMediaFilePathFromQuery(project, requestedPath, requestedAssetId);
10053:    filePath = resolveMediaFilePath(project, type, filename);
10439:  const root = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
10837:      job_monitor: snapshot.job_monitor || {}
10864:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
10865:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
11051:      error: error.message || 'Failed to list media jobs'
11084:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
11085:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
11086:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11087:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
11088:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11095:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
11102:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11103:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
11202:      status: result?.status || 'completed',
11248:      status: result?.status || 'completed',
11291:      status: result?.status || 'completed',
11527:      escalate_to: req.body?.escalate_to
12433:      action_type: 'manual_publish_complete',
12434:      notes: req.body?.notes || ['Publishing completed from Control Center.']
12465:      action_type: 'manual_publish_complete',
12466:      notes: req.body?.notes || ['Publishing completed from Control Center.']
12637:  const candidate = resolveExecutionReadCandidate({
12653:  const resolution = unifiedDataPathResolver.resolve(projectName, {
12980:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
12984:  const baseDir = resolveExecutionReadCandidate({
13066:  const filePath = resolveExecutionReadCandidate({
13129:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13133:  const baseDir = resolveExecutionReadCandidate({
13143:  const mediaDir = path.join(baseDir, 'media-jobs');
13146:  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
13282:  const mediaDir = resolveExecutionReadCandidate({
13285:    relativePath: 'media-jobs',
13289:    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
13291:  const publishDir = resolveExecutionReadCandidate({
13300:  const emailFile = resolveExecutionReadCandidate({
13319:    media_jobs_count: mediaFiles.length,
13337:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
13380:function resolveProjectNameForLog(req) {
13399:function resolvePublishPackageForExecution(projectName, input = {}) {
13466:function resolveEmailPackageForExecution(projectName, input = {}) {
13566:function resolveCampaignPackageForAds(projectName, input = {}) {
13631:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13635:  const baseDir = resolveExecutionReadCandidate({
13717:  const filePath = resolveExecutionReadCandidate({
13928:  const executionResultPath = resolveExecutionReadCandidate({
14169:  const filePath = resolveExecutionReadCandidate({
14189:  const resultsDir = resolveExecutionReadCandidate({
14589:    scheduled_jobs: hydratedScheduledJobs,
14591:    total_scheduled_jobs: hydratedScheduledJobs.length,
14620:function resolveLegacyExecutionProjectPaths(projectName) {
14621:  const resolved = resolveProjectPath(path.join(EXECUTION_DIR, 'projects'), projectName);
14622:  const projectDir = resolved.projectRoot;
14625:    project: resolved.project,
14660:    const commandProject = resolveRequestProjectName(req, {
15868:        blogItem.enhancement_status = 'complete';
16299:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16348:      const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
16370:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16448:      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;
16475:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16530:  const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
17147:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
17666:      campaignExec.autogen_status = 'completed';
17668:      campaignExec.autogen_completed_at = new Date().toISOString();
17680:          autogen_status: 'completed',
17710:          autogen_completed_at: campaignExec.autogen_completed_at || null
17873:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17943:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17968:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18013:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18563:    const files = fs.readdirSync(outputPaths.jobsDir)
18569:      return res.json({ error: 'No generation jobs found' });
18572:    const latestPath = path.join(outputPaths.jobsDir, files[0]);
18810:    const deliveryDir = resolveEmailReadCandidate({
19878:if (command === '/review_scheduled_jobs') {
19890:      error: 'Failed to review scheduled jobs',
20955:  resolveProjectPath,
20971:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
21197:  const jobs = readSchedulerJobs(safeProject);
21198:  const completed = jobs.filter((job) => job.status === 'completed');
21199:  const failed = jobs.filter((job) => job.status === 'failed');
21200:  const retryable = jobs.filter((job) => job.status === 'retryable');
21203:  for (const job of jobs) {
21209:      total_jobs: 0,
21210:      completed: 0,
21212:      retryable: 0
21215:    current.total_jobs += 1;
21216:    if (job.status === 'completed') current.completed += 1;
21218:    if (job.status === 'retryable') current.retryable += 1;
21224:    failure_rate: entry.total_jobs > 0
21225:      ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
21230:    total_jobs: jobs.length,
21231:    completed_jobs: completed.length,
21232:    failed_jobs: failed.length,
21233:    retryable_jobs: retryable.length,
21298:  resolvePublishPackageForExecution,
21300:  resolveEmailPackageForExecution,
21303:  resolveCampaignPackageForAds,
21447:    const jobs = readSchedulerJobs(projectName);
21448:    jobs.push(job);
21449:    writeSchedulerJobs(projectName, jobs);
21479:    const jobs = readSchedulerJobs(projectName);
21485:    const completed = [];
21486:    const retryable = [];
21488:    for (const job of jobs) {
21489:      if (job.status === 'completed') {
21490:        completed.push(job);
21504:      if (job.status === 'retryable') {
21505:        retryable.push(job);
21525:      total: jobs.length,
21531:        completed: completed.length,
21532:        retryable: retryable.length
21534:      jobs: {
21539:        completed,
21540:        retryable
21552:app.post('/run_scheduler_worker_once', (req, res) => {
21557:    const workerId = generateWorkerId(crypto);
21561:    const jobs = readSchedulerJobs(projectName);
21563:    // Phase 1: lock all due jobs atomically
21564:    for (const job of jobs) {
21565:      if (job.status === 'completed') continue;
21575:      job.locked_by = workerId;
21580:    writeSchedulerJobs(projectName, jobs);
21582:    // Phase 2: execute locked jobs and update status
21583:    for (const job of jobs) {
21584:      if (job.status !== 'running' || job.locked_by !== workerId) continue;
21590:        job.status = 'completed';
21591:        job.execution_state = result.execution_state || 'completed';
21600:          status: 'completed',
21607:            trigger: 'job_completed',
21623:          status: 'completed',
21633:        job.status = canRetry ? 'retryable' : 'failed';
21648:            can_retry: canRetry
21664:    writeSchedulerJobs(projectName, jobs);
21669:      worker_id: workerId,
21677:      message: error.message || 'Failed to run scheduler worker'
22057:      appLogger.info('shutdown_complete', { route: 'process', action: 'shutdown' });

## Cross-page Job Monitor references
public/control-center/pages/operations-centers.js:222:  if (pageKey === "job-monitor") {
public/control-center/pages/operations-centers.js:227:        prompt: `Review Job Monitor for ${projectLabel}. Prioritize failures, retry risk, and health issues, then explain what should be inspected first.`
public/control-center/pages/operations-centers.js:232:        prompt: `Review ${itemLabel} in Job Monitor for ${projectLabel}. Explain what the current job state implies, what likely happened, and what should be checked next.`
public/control-center/pages/operations-centers.js:299:      route: "job-monitor"
public/control-center/pages/operations-centers.js:313:      route: "job-monitor"
public/control-center/pages/operations-centers.js:1151:            <strong>Job Monitor error</strong>
public/control-center/pages/operations-centers.js:1179:    <section class="page is-active" data-page="job-monitor">
public/control-center/pages/operations-centers.js:1184:              <span class="std-context-eyebrow">JOB MONITOR</span>
public/control-center/pages/operations-centers.js:1185:              <h3 class="std-context-title">Job Monitor</h3>
public/control-center/pages/operations-centers.js:1188:            <div class="std-context-metrics" aria-label="Job Monitor metrics">
public/control-center/pages/operations-centers.js:1234:              <div class="error-state ops-job-state" aria-live="assertive"><strong>Job Monitor error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1281:                <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
public/control-center/pages/operations-centers.js:1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1355:  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));
public/control-center/pages/operations-centers.js:1383:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1831:  id: "job-monitor",
public/control-center/pages/operations-centers.js:1835:    title: "Job Monitor",
public/control-center/pages/operations-centers.js:1838:  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1868:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1957:      route: "job-monitor",
public/control-center/pages/operations-centers.js:1958:      title: "Job Monitor",
public/control-center/pages/operations-centers.js:1962:      action: "Open Job Monitor"
public/control-center/pages/operations-centers.js:2033:                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
public/control-center/pages/ai-command.js:1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:4280:				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
