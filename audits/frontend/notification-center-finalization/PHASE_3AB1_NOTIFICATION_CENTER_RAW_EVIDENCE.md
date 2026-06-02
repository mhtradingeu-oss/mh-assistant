# PHASE 3AB.1 — Notification Center Raw Evidence

## Source file
Notification Center source: public/control-center/pages/operations-centers.js

## Notification Center route / render / handlers
5:const notificationSessions = new Map();
320:      route: "notification-center"
327:      route: "notification-center"
355:      route: "notification-center"
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (disabled: future mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (disabled: future destructive mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (disabled: backend worker-control safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (disabled: future destructive mutation safety pass)</button>
1433:function renderNotificationCenter(context, state, projectName) {
1438:  const session = ensureSession(notificationSessions, projectName, {
1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
1534:    <section class="page is-active" data-page="notification-center">
1552:            <button class="btn btn-secondary std-context-btn" type="button" id="notificationCenterRefreshBtnHeader">Refresh</button>
1635:                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1687:  const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
1689:    if (context.fetchProjectNotificationCenter && projectName) {
1693:      context.fetchProjectNotificationCenter(projectName)
1699:          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1712:  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", refreshNotificationCenter);
1713:  root.querySelector("#notificationCenterRefreshBtnHeader")?.addEventListener("click", refreshNotificationCenter);
1878:export const notificationCenterRoute = {
1879:  id: "notification-center",
1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
1891:    renderNotificationCenter(context, context.getState(), projectName);
1894:      if (!projectName || !context.fetchProjectNotificationCenter) return;
1895:      const session = ensureSession(notificationSessions, projectName, {
1905:      renderNotificationCenter(context, context.getState(), projectName);
1906:      context.fetchProjectNotificationCenter(projectName)
1912:          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1917:          renderNotificationCenter(context, context.getState(), projectName);
1965:      route: "notification-center",
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Relevant Notification Center source ranges

### Notification Center layout
    ...approvalAlerts,
    ...publishAlerts,
    ...providerAlerts,
    ...claimAlerts,
    ...workflowAlerts
  ].map((item, index) => ({
    ...item,
    _opsKey: getOpsItemKey(item, index, "alert")
  }));

  const inboxList = inboxItems.map((item, index) => ({
    ...item,
    _opsKey: getOpsItemKey(item, index, "inbox")
  }));

  let listItems = session.focus === "inbox" ? inboxList : baseAlerts;
  if (session.focus === "critical") listItems = baseAlerts.filter((item) => asString(item.severity) === "critical");
  if (session.focus === "approvals") listItems = approvalAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "approval") }));
  if (session.focus === "provider") listItems = providerAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "provider") }));

  listItems = filterBySearch(listItems, session.search, ["title", "message", "source"]);
  if (session.severity !== "all") listItems = listItems.filter((item) => asString(item.severity) === session.severity);
  const selectedItem = listItems.find((item) => item._opsKey === session.selectedKey) || listItems[0] || null;
  session.selectedKey = selectedItem?._opsKey || "";
  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));

  const escapeHtml = context.escapeHtml;
  const projectLabel = projectName || "No project selected";
  const hasFilters = Boolean(
    asString(session.search).trim() ||
    session.focus !== "all" ||
    session.severity !== "all"
  );
  const emptyText = hasFilters
    ? "No notifications match the current filters."
    : "No notifications are available for this project yet. Use Refresh or adjust project context to load current signals.";
  const showLoadingState = Boolean(session.isLoading);
  const showErrorState = Boolean(session.errorMessage);
  const showStateCard = (showLoadingState || showErrorState) && listItems.length > 0;
  const stateRow = showErrorState && !listItems.length
    ? `
      <tr class="ops-state-row">
        <td colspan="5">
          <div class="error-state ops-notification-state" aria-live="assertive">
            <strong>Notification Center error</strong>
            <span>${escapeHtml(session.errorMessage)}</span>
          </div>
        </td>
      </tr>
    `
      : "";
  const tableRows = stateRow
    ? [stateRow]
    : listItems.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge ${badgeTone(item.severity)}">${escapeHtml(titleCase(item.severity || "info"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
              <strong>${escapeHtml(item.title || "Alert")}</strong>
              <span>${escapeHtml(item.message || "-")}</span>
            </button>
          </td>
          <td>${escapeHtml(titleCase(item.source || item.item_type || "system"))}</td>
          <td>${escapeHtml(formatDateTime(item.created_at))}</td>
          <td>${renderRouteAction(item, escapeHtml)}</td>
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
            <p class="std-context-description">Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
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
                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history" : "Operational alerts")}</h3>
                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history and mark notifications as read where supported." : "Review route-aware alerts, then inspect the selected signal in detail.")}</p>
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
                  <h3>Notification actions</h3>
                  <p>Safe actions are active. Notification mutation controls remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Source Page") : ""}
                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
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
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
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

### Notification Center render and bindings
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

export const taskCenterRoute = {
  id: "task-center",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Task Center",
    description: "Review durable tasks, owners, due dates, priorities, filters, and linked operational entities without silent task mutation."
  },
  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";

    // Render immediately from state as fallback
    renderTaskCenter(context, context.getState(), projectName);

    // Fetch live data and re-render on success
    function doFetch() {
      if (!projectName || !context.fetchProjectTaskCenter) return;
      context.fetchProjectTaskCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.task_center = liveData;
          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          context.showError?.(`Task Center: ${error?.message || "Failed to load live data."}`);
        });
    }

    doFetch();
  }
};

export const queueCenterRoute = {
  id: "queue-center",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Queue Center",
    description: "Review queue pressure and route workflow, content, media, approval, publishing, and sync items to owning workspaces without silent mutation."

### Notification Center route export
  }
};

export const notificationCenterRoute = {
  id: "notification-center",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Notification Center",
    description: "Review sync failures, pending approvals, publish events, provider disconnects, claim risks, and workflow completion alerts."
  },
  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";

    renderNotificationCenter(context, context.getState(), projectName);

    function doFetch() {
      if (!projectName || !context.fetchProjectNotificationCenter) return;
      const session = ensureSession(notificationSessions, projectName, {
        focus: "all",
        severity: "all",
        search: "",
        selectedKey: "",
        isLoading: false,
        errorMessage: ""
      });
      session.isLoading = true;
      session.errorMessage = "";
      renderNotificationCenter(context, context.getState(), projectName);
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
          session.errorMessage = `Notification Center: ${error?.message || "Failed to load live data."}`;
          renderNotificationCenter(context, context.getState(), projectName);
          context.showError?.(session.errorMessage);

## API notification functions
451:  return new Promise((resolve) => {
453:      requestAnimationFrame(() => resolve());
457:    setTimeout(resolve, 0);
1262:  return new Promise((resolve) => {
1263:    setTimeout(resolve, 750);
1323:  normalized._optionalReady = Promise.resolve().then(optionalReady);
1984:export async function fetchProjectNotificationCenter(projectName) {
1990:    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
1991:    "Failed to load notification center"
2276:export async function markProjectNotification(projectName, notificationId, payload = {}) {
2281:  if (!notificationId) {
2282:    throw new Error("Missing notification id");
2286:    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,
2289:    "Failed to update notification"

## Backend notification routes
48:const { UnifiedDataPathResolver } = require('./lib/data/unified-data-path-resolver');
72:  resolveProjectPath,
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
2090:  const prepareFile = resolveEmailReadCandidate({
2212:  const rendersDir = resolveExecutionReadCandidate({
2501:  const preparedDir = resolveEmailReadCandidate({
2783:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2787:  const outputDirResolution = resolveExecutionReadCandidate({
2820:  const resolution = unifiedDataPathResolver.resolve(projectName, {
2993:  const packagesDir = resolveExecutionReadCandidate({
3015:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3114:  const tiktokDir = resolveExecutionReadCandidate({
3274:  const youtubeDir = resolveExecutionReadCandidate({
3296:  const resolution = unifiedDataPathResolver.resolve(projectName, {
3397:      'marketplace ready',
3502:      ? resolveExecutionReadCandidate({
3512:      ? resolveExecutionReadCandidate({
3540:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3544:  const baseDir = resolveExecutionReadCandidate({
3845:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
3849:  const baseDir = resolveExecutionReadCandidate({
4302:  const schedulerDir = resolveExecutionReadCandidate({
4346:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4350:  const baseDir = resolveExecutionReadCandidate({
4715:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4719:  const baseDir = resolveExecutionReadCandidate({
4757:  const jobsDir = resolveExecutionReadCandidate({
4823:  const rendersDir = resolveExecutionReadCandidate({
4847:  const renderRecord = resolveExecutionReadCandidate({
4917:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
4921:  const baseDir = resolveExecutionReadCandidate({
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
10851:      notification_center: snapshot.notification_center || {}
10866:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
10867:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
11606:      error: error.message || 'Failed to list notifications'
11611:app.get('/media-manager/project/:project/notifications', handleListNotifications);
11612:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
11613:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
11626:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
12637:  const candidate = resolveExecutionReadCandidate({
12653:  const resolution = unifiedDataPathResolver.resolve(projectName, {
12980:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
12984:  const baseDir = resolveExecutionReadCandidate({
13066:  const filePath = resolveExecutionReadCandidate({
13129:  const resolution = unifiedDataPathResolver.resolve(safeProject, {
13133:  const baseDir = resolveExecutionReadCandidate({
13282:  const mediaDir = resolveExecutionReadCandidate({
13291:  const publishDir = resolveExecutionReadCandidate({
13300:  const emailFile = resolveExecutionReadCandidate({
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
14620:function resolveLegacyExecutionProjectPaths(projectName) {
14621:  const resolved = resolveProjectPath(path.join(EXECUTION_DIR, 'projects'), projectName);
14622:  const projectDir = resolved.projectRoot;
14625:    project: resolved.project,
14660:    const commandProject = resolveRequestProjectName(req, {
16299:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16348:      const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
16370:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16448:      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;
16475:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
16530:  const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;
17147:      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
17873:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17943:      const resolution = unifiedDataPathResolver.resolve(projectName, {
17968:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18013:      const resolution = unifiedDataPathResolver.resolve(projectName, {
18810:    const deliveryDir = resolveEmailReadCandidate({
20955:  resolveProjectPath,
20971:  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
21298:  resolvePublishPackageForExecution,
21300:  resolveEmailPackageForExecution,
21303:  resolveCampaignPackageForAds,

## Cross-page Notification Center references
public/control-center/pages/ai-command/tool-dock.js:1221:            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
public/control-center/pages/operations-centers.js:244:      label: "Rank alert urgency",
public/control-center/pages/operations-centers.js:246:      prompt: `Review Notification Center for ${projectLabel}. Rank current alerts by urgency, explain what matters most, and identify what should be handled first.`
public/control-center/pages/operations-centers.js:249:      label: "Review selected alert",
public/control-center/pages/operations-centers.js:250:      preview: "Explain what the selected alert means and where to go next.",
public/control-center/pages/operations-centers.js:251:      prompt: `Review ${itemLabel} in Notification Center for ${projectLabel}. Explain what it means, what risk it creates, and which page or team should act next.`
public/control-center/pages/operations-centers.js:278:  const criticalAlerts = Number(notificationCenter.critical_count || 0);
public/control-center/pages/operations-centers.js:279:  const unreadNotifications = Number(notificationCenter.unread_count || 0);
public/control-center/pages/operations-centers.js:281:  const providerAlerts = asArray(notificationCenter.provider_disconnect_alerts).length;
public/control-center/pages/operations-centers.js:282:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).length;
public/control-center/pages/operations-centers.js:283:  const publishAlerts = asArray(notificationCenter.publish_alerts).length;
public/control-center/pages/operations-centers.js:284:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).length;
public/control-center/pages/operations-centers.js:286:  const runtimeTone = failedJobs || criticalAlerts ? "danger" : runningJobs || queueItems || activeTasks ? "warning" : "success";
public/control-center/pages/operations-centers.js:287:  const runtimeLabel = failedJobs || criticalAlerts
public/control-center/pages/operations-centers.js:297:      helper: failedJobs || criticalAlerts ? "Failures or critical alerts detected" : "No critical runtime issue detected",
public/control-center/pages/operations-centers.js:316:      label: "Critical Alerts",
public/control-center/pages/operations-centers.js:317:      value: formatCount(criticalAlerts),
public/control-center/pages/operations-centers.js:319:      tone: criticalAlerts ? "danger" : "success",
public/control-center/pages/operations-centers.js:320:      route: "notification-center"
public/control-center/pages/operations-centers.js:324:      value: formatCount(approvalAlerts),
public/control-center/pages/operations-centers.js:326:      tone: approvalAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:327:      route: "notification-center"
public/control-center/pages/operations-centers.js:331:      value: formatCount(publishAlerts),
public/control-center/pages/operations-centers.js:332:      helper: "Publishing alerts",
public/control-center/pages/operations-centers.js:333:      tone: publishAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:338:      value: formatCount(providerAlerts),
public/control-center/pages/operations-centers.js:339:      helper: "Disconnected provider alerts",
public/control-center/pages/operations-centers.js:340:      tone: providerAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:345:      value: formatCount(claimAlerts),
public/control-center/pages/operations-centers.js:347:      tone: claimAlerts ? "danger" : "success",
public/control-center/pages/operations-centers.js:352:      value: formatCount(unreadNotifications),
public/control-center/pages/operations-centers.js:353:      helper: "Unread operational notifications",
public/control-center/pages/operations-centers.js:354:      tone: unreadNotifications ? "warning" : "success",
public/control-center/pages/operations-centers.js:355:      route: "notification-center"
public/control-center/pages/operations-centers.js:1416:function deriveProviderDisconnectAlerts(state, existingAlerts) {
public/control-center/pages/operations-centers.js:1417:  if (asArray(existingAlerts).length) return asArray(existingAlerts);
public/control-center/pages/operations-centers.js:1447:  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
public/control-center/pages/operations-centers.js:1457:  const syncAlerts = asArray(notificationCenter.sync_failure_alerts).map((item) => ({ ...item, item_type: "sync" }));
public/control-center/pages/operations-centers.js:1458:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).map((item) => ({ ...item, item_type: "approval" }));
public/control-center/pages/operations-centers.js:1459:  const publishAlerts = asArray(notificationCenter.publish_alerts).map((item) => ({ ...item, item_type: "publish" }));
public/control-center/pages/operations-centers.js:1460:  const providerAlerts = providerDisconnectAlerts.map((item) => ({ ...item, item_type: "provider" }));
public/control-center/pages/operations-centers.js:1461:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).map((item) => ({ ...item, item_type: "claim" }));
public/control-center/pages/operations-centers.js:1462:  const workflowAlerts = asArray(notificationCenter.workflow_completion_alerts).map((item) => ({ ...item, item_type: "workflow" }));
public/control-center/pages/operations-centers.js:1463:  const baseAlerts = [
public/control-center/pages/operations-centers.js:1464:    ...syncAlerts,
public/control-center/pages/operations-centers.js:1465:    ...approvalAlerts,
public/control-center/pages/operations-centers.js:1466:    ...publishAlerts,
public/control-center/pages/operations-centers.js:1467:    ...providerAlerts,
public/control-center/pages/operations-centers.js:1468:    ...claimAlerts,
public/control-center/pages/operations-centers.js:1469:    ...workflowAlerts
public/control-center/pages/operations-centers.js:1472:    _opsKey: getOpsItemKey(item, index, "alert")
public/control-center/pages/operations-centers.js:1480:  let listItems = session.focus === "inbox" ? inboxList : baseAlerts;
public/control-center/pages/operations-centers.js:1481:  if (session.focus === "critical") listItems = baseAlerts.filter((item) => asString(item.severity) === "critical");
public/control-center/pages/operations-centers.js:1482:  if (session.focus === "approvals") listItems = approvalAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "approval") }));
public/control-center/pages/operations-centers.js:1483:  if (session.focus === "provider") listItems = providerAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "provider") }));
public/control-center/pages/operations-centers.js:1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:1509:            <strong>Notification Center error</strong>
public/control-center/pages/operations-centers.js:1523:              <strong>${escapeHtml(item.title || "Alert")}</strong>
public/control-center/pages/operations-centers.js:1534:    <section class="page is-active" data-page="notification-center">
public/control-center/pages/operations-centers.js:1540:              <h3 class="std-context-title">Notification Center</h3>
public/control-center/pages/operations-centers.js:1542:            <p class="std-context-description">Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:1543:            <div class="std-context-metrics" aria-label="Notification Center metrics">
public/control-center/pages/operations-centers.js:1544:              <span class="std-context-chip"><span>Active Alerts</span><strong>${escapeHtml(formatCount(baseAlerts.length))}</strong></span>
public/control-center/pages/operations-centers.js:1545:              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
public/control-center/pages/operations-centers.js:1547:              <span class="std-context-chip is-warning"><span>Approvals</span><strong>${escapeHtml(formatCount(approvalAlerts.length))}</strong></span>
public/control-center/pages/operations-centers.js:1568:                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history" : "Operational alerts")}</h3>
public/control-center/pages/operations-centers.js:1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history and mark notifications as read where supported." : "Review route-aware alerts, then inspect the selected signal in detail.")}</p>
public/control-center/pages/operations-centers.js:1575:              { value: "all", label: "All Alerts", count: formatCount(baseAlerts.length) },
public/control-center/pages/operations-centers.js:1577:              { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
public/control-center/pages/operations-centers.js:1578:              { value: "provider", label: "Provider", count: formatCount(providerAlerts.length) },
public/control-center/pages/operations-centers.js:1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
public/control-center/pages/operations-centers.js:1590:              <div class="error-state ops-notification-state" aria-live="assertive"><strong>Notification Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1607:                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
public/control-center/pages/operations-centers.js:1635:                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
public/control-center/pages/operations-centers.js:1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
public/control-center/pages/operations-centers.js:1642:                  <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1646:                  <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1650:                  <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1703:          session.errorMessage = `Notification Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1879:  id: "notification-center",
public/control-center/pages/operations-centers.js:1883:    title: "Notification Center",
public/control-center/pages/operations-centers.js:1884:    description: "Review sync failures, pending approvals, publish events, provider disconnects, claim risks, and workflow completion alerts."
public/control-center/pages/operations-centers.js:1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1916:          session.errorMessage = `Notification Center: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1965:      route: "notification-center",
public/control-center/pages/operations-centers.js:1966:      title: "Notification Center",
public/control-center/pages/operations-centers.js:2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>
public/control-center/pages/operations-centers.js:2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>
public/control-center/pages/ai-command.js:1581:				"Thank the customer, acknowledge the issue, and confirm the next reviewed support step.",
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/library.js:521:            alert(message);
public/control-center/pages/home.js:250:  const unreadNotifications = notifications.filter((item) => !item?.read_at);
public/control-center/pages/home.js:425:      kind: "Alert",
public/control-center/pages/home.js:462:          summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
public/control-center/pages/home.js:487:      criticalAlerts: criticalGaps.length + failedExecutions.length + unreadNotifications.length
public/control-center/pages/home.js:556:        value: formatCount(unreadNotifications.length + pendingTasks.length + pendingApprovals.length),
public/control-center/pages/home.js:558:        tone: unreadNotifications.length + pendingTasks.length + pendingApprovals.length ? "warning" : "success"
public/control-center/pages/home.js:619:      notifications: unreadNotifications.length,
public/control-center/pages/integrations.js:512:        purpose: "Operational alerting, workflow notifications, and team collaboration handoff.",
public/control-center/pages/integrations.js:513:        whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",
public/control-center/pages/integrations.js:514:        enables: "Alerts, approvals, sync notifications, and workflow coordination.",
public/control-center/pages/integrations.js:515:        dataScope: ["Notifications", "Approvals", "Ops alerts"],
public/control-center/pages/integrations.js:520:          { key: "channelId", label: "Channel ID", placeholder: "Channel ID for alerts" },
public/control-center/pages/integrations.js:529:        purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",
public/control-center/pages/integrations.js:531:        enables: "Alerts, commands, approval handoff, and ops notifications.",
public/control-center/pages/integrations.js:532:        dataScope: ["Alerts", "Commands", "Approvals"],
public/control-center/pages/publishing.js:1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
public/control-center/pages/settings.js:47:  "Alert when integrations fail",
public/control-center/pages/settings.js:292:        options: ["Pause and alert", "Retry then route", "Route to operator immediately", "Record only"]
public/control-center/pages/settings.js:521:        options: ["Retry twice then alert", "Retry once", "Manual retry only", "Escalate immediately"]
public/control-center/pages/settings.js:538:    id: "alerts",
public/control-center/pages/settings.js:539:    title: "Alerts & Notification Rules",
public/control-center/pages/settings.js:540:    description: "Control which operational events trigger alerts so teams can intervene before failures become launch problems.",
public/control-center/pages/settings.js:544:        path: "alerts.enabledRules",
public/control-center/pages/settings.js:545:        label: "Active alerts",
public/control-center/pages/settings.js:549:          "Sync failure alerts",
public/control-center/pages/settings.js:550:          "Approval pending alerts",
public/control-center/pages/settings.js:551:          "Scheduled publish alerts",
public/control-center/pages/settings.js:552:          "Provider disconnect alerts",
public/control-center/pages/settings.js:553:          "Claim safety alerts",
public/control-center/pages/settings.js:554:          "Workflow completion alerts"
public/control-center/pages/settings.js:558:        path: "alerts.deliveryMode",
public/control-center/pages/settings.js:564:        path: "alerts.alertCadence",
public/control-center/pages/settings.js:570:        path: "alerts.notificationNotes",
public/control-center/pages/settings.js:573:        placeholder: "Use immediate alerts for provider disconnects and claim safety issues; batch lower-priority workflow completions."
public/control-center/pages/settings.js:599:        path: "safety.complianceAlerts",
public/control-center/pages/settings.js:600:        label: "Compliance alerts",
public/control-center/pages/settings.js:642:    description: "Review connector refresh behavior, import policy, and alert routing without turning Settings into a sync control center.",
public/control-center/pages/settings.js:643:    sectionIds: ["sync", "alerts"]
public/control-center/pages/settings.js:922:        "Alert when integrations fail",
public/control-center/pages/settings.js:926:      failurePolicy: "Pause and alert",
public/control-center/pages/settings.js:1032:      retryFailedBehavior: "Retry twice then alert",
public/control-center/pages/settings.js:1036:    alerts: {
public/control-center/pages/settings.js:1038:        "Sync failure alerts",
public/control-center/pages/settings.js:1039:        "Approval pending alerts",
public/control-center/pages/settings.js:1040:        "Provider disconnect alerts",
public/control-center/pages/settings.js:1041:        "Claim safety alerts"
public/control-center/pages/settings.js:1044:      alertCadence: "Immediate only",
public/control-center/pages/settings.js:1045:      notificationNotes: "Escalate provider disconnects and claim safety alerts immediately; batch lower-risk completions."
public/control-center/pages/settings.js:1051:      complianceAlerts: "Alert on regulated claims, platform policy conflicts, and high-risk launch copy.",
public/control-center/pages/settings.js:1148:  const integrationReady = Boolean(form.sync.frequency && Array.isArray(form.alerts.enabledRules) && form.alerts.enabledRules.length);
public/control-center/pages/settings.js:1173:      label: "Integrations and operations alerts",
public/control-center/pages/settings.js:1176:        ? "Sync cadence and alert routing are defined for operations visibility."
public/control-center/pages/settings.js:1177:        : "Set sync cadence and alert coverage so operations can intervene safely."
public/control-center/pages/settings.js:1229:  if (!Array.isArray(form.alerts.enabledRules) || !form.alerts.enabledRules.length) {
public/control-center/pages/settings.js:1230:    risks.push("Alert rules are missing, which reduces visibility into sync failures, approval delays, and provider issues.");
public/control-center/pages/settings.js:1695:      detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
public/control-center/app.js:1932:  const unread = notifications.filter((item) => !item?.read_at).length;
public/control-center/app.js:1939:  setText("ctxAlerts", unread);
