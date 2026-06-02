# PHASE 3Z.1 — Queue Center Raw Evidence

## Source file
Queue Center source: public/control-center/pages/operations-centers.js

## Queue Center route / render / handlers
3:const queueSessions = new Map();
202:  if (pageKey === "queue-center") {
306:      route: "queue-center"
649:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
651:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
652:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
653:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
827:function renderQueueCenterLayout({
888:    <section class="page is-active" data-page="queue-center">
907:            <button class="btn btn-secondary std-context-btn" type="button" id="queueCenterRefreshBtnHeader">Refresh</button>
991:                <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
1037:function renderQueueCenter(context, state, projectName) {
1042:  const session = ensureSession(queueSessions, projectName, {
1061:  const prompts = buildOpsAssistantPrompts("queue-center", projectName, selectedItem, titleCase(session.focus || "all queues"));
1063:  root.innerHTML = renderQueueCenterLayout({
1074:  const rerender = () => renderQueueCenter(context, context.getState(), projectName);
1076:    if (context.fetchProjectQueueCenter && projectName) {
1080:      context.fetchProjectQueueCenter(projectName)
1086:          renderQueueCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1099:  root.querySelector("#queueCenterRefreshBtn")?.addEventListener("click", refreshQueueCenter);
1100:  root.querySelector("#queueCenterRefreshBtnHeader")?.addEventListener("click", refreshQueueCenter);
1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1782:export const queueCenterRoute = {
1783:  id: "queue-center",
1790:  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
1795:    renderQueueCenter(context, context.getState(), projectName);
1798:      if (!projectName || !context.fetchProjectQueueCenter) return;
1799:      const session = ensureSession(queueSessions, projectName, {
1809:      renderQueueCenter(context, context.getState(), projectName);
1810:      context.fetchProjectQueueCenter(projectName)
1816:          renderQueueCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1821:          renderQueueCenter(context, context.getState(), projectName);
1949:      route: "queue-center",
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Relevant Queue Center source ranges

### Queue Center layout
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

### Queue Center render and bindings
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

### Queue Center route export
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operate",
    title: "Queue Center",
    description: "Control workflow, content, media, approval, publishing, and sync queues from one central operations surface."
  },
  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";

    renderQueueCenter(context, context.getState(), projectName);

    function doFetch() {
      if (!projectName || !context.fetchProjectQueueCenter) return;
      const session = ensureSession(queueSessions, projectName, {
        focus: "all",
        status: "all",
        search: "",
        selectedKey: "",
        isLoading: false,
        errorMessage: ""
      });
      session.isLoading = true;
      session.errorMessage = "";
      renderQueueCenter(context, context.getState(), projectName);
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
          session.errorMessage = `Queue Center: ${error?.message || "Failed to load live data."}`;
          renderQueueCenter(context, context.getState(), projectName);
          context.showError?.(session.errorMessage);
        });
    }

## API queue center / queue functions
1865:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
1868:    "Failed to save publishing schedule"
1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
1885:    "Failed to reschedule publishing item"
1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
1902:    "Failed to approve publishing item"
1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1936:    "Failed to mark publishing item as failed"
1962:export async function fetchProjectQueueCenter(projectName) {
1968:    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
1969:    "Failed to load queue center"

## Backend queue center / queue routes
219:  /^\/publish-clone\/[^/]+\/?$/i,
222:  /^\/publish-blog\/[^/]+\/?$/i,
226:  /^\/execute_publish_package\/?$/i,
416:    retryAfterMs: decision.retryAfterMs
419:  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
423:    message: 'Too many requests. Please retry shortly.'
780:  'manual_publish_ready',
783:  'failed'
789:  const fallback = String(fallbackMessage || 'Request failed').trim() || 'Request failed';
816:  message = 'Request failed'
822:      message: sanitizeErrorMessage(message, 'Request failed')
920:    return sanitizeErrorMessage(payload, 'Request failed');
927:  appLogger.error('critical_failure', {
1061:  publishing: {
1063:    canonical: 'publishing'
1095:    canonical: 'publishing/results'
1151:    appLogger.error('read_redirection_telemetry_write_failed', {
1562:  'publishing',
1637:        (item) => item.root === 'canonical' && item.status === 'failed'
1945:      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
2539:    result.blocking_reasons.push('Prepared email package validation failed');
2743:    published_count: 0,
2752:    if (product.status === 'publish') summary.published_count += 1;
2949:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
2969:    status: compliance.publish_status,
3061:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
3080:    status: compliance.publish_status,
3206:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
3225:    : `This video package is designed for ${goal} using approved brand-controlled creative, with emphasis on product credibility, premium presentation, and visual trust.`;
3234:    status: compliance.publish_status,
3393:    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
3456:    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
3640:    if (status !== 'publish' || !slug || !name || !stableKey) {
3696:      published_count: launchReadyProducts.length,
3846:    domain: 'publishing',
3851:    domain: 'publishing',
3854:    requestedIdentifier: 'publishing-root',
3855:    requestedFile: 'publishing'
3916:    domain: 'publishing',
3917:    artifactType: 'publishing_connector_payload',
3952:    domain: 'publishing',
3953:    artifactType: 'publishing_scheduler_job',
3970:  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
3974:      'ready_for_manual_publish',
3978:      'manual_publish',
3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
3986:    return 'published';
3988:  if (['failed', 'error', 'blocked', 'rejected'].includes(normalized)) return 'failed';
4030:  if (safeChannel) return `${safeChannel} publish`;
4174:    domain: 'publishing',
4175:    artifactType: 'publishing_scheduler_job',
4304:    domain: 'publishing',
4309:    requestedFile: 'publishing/scheduler/*.json'
4430:    recommendations.push('rewrite copy in natural German for German-market publishing');
5295:      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
5612:    appLogger.error('audit_write_failed', {
5637:    appLogger.warn('project_detection_registry_failed', {
6012:    text.includes('publish') ||
6150:    publishingDir: path.join(baseDir, 'publishing'),
6227:    appLogger.warn('project_data_mismatch_log_failed', {
6460:    paths.publishingDir,
6576:      publishing: { path: paths.publishingDir, exists: fs.existsSync(paths.publishingDir) },
6660:    paths.publishingDir,
6698:    workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6699:    ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6718:      workspace_priorities: ['setup', 'library', 'campaign-studio', 'content-studio', 'media-studio', 'publishing', 'insights'],
6719:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'ads_operator', 'analyst', 'compliance_reviewer'],
6731:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'campaign-studio', 'publishing'],
6732:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher', 'analyst'],
6744:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'publishing', 'insights'],
6745:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6758:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'publisher', 'compliance_reviewer'],
6770:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
6771:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
6783:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
6784:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher'],
6809:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
6810:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher'],
6866:      publishing: paths.publishingDir,
7166:  const publishingReadiness = fs.existsSync(paths.publishingDir) ? 100 : 0;
7179:    publishing_readiness: publishingReadiness,
7190:    has_publishing_dir: fs.existsSync(paths.publishingDir),
7226:  if (domainScores.publishing_readiness < 100) missing.push('publishing_readiness');
7300:    approved: Boolean(asset.approved),
7301:    approved_at: normalizeSetupTextValue(asset.approved_at),
7392:function removeProjectSourceOfTruth(projectName, sourceType) {
7414:    removed: Boolean(existing),
7680:      healthSummary = normalizeTextValue(record.last_error) || 'The last integration action failed.';
7993:      last_error: normalizeTextValue(error.message || 'Integration validation failed'),
8005:        last_error: normalizeTextValue(error.message || 'Integration validation failed'),
8013:    throw Object.assign(new Error(normalizeTextValue(error.message || 'Integration validation failed')), {
8089:      removeProjectSourceOfTruth(projectName, existing.source_key);
8132:      nextRecord.last_error = normalizeTextValue(error.message || 'Provider action failed');
8202:        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
8203:        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
8280:      description: 'Approved product photography for content, media, ads, and publishing.',
8360:      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
8362:        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
8379:        why_it_matters: 'Publishing and AI Command can use only approved proof when making trust or compliance claims.',
8431:  if (record.approved === true || ['approved', 'ready_approved'].includes(explicitStatus)) {
8894:    let approvedCount = statuses.filter(value => value === 'Approved').length;
8903:      approvedCount = 0;
8911:      approvedCount = 0;
8921:    const approvedAssets = matchingAssets
8950:      approved_count: approvedCount,
8955:      approved_assets: approvedAssets,
8964:              ? `Review and approve ${item.label} when ready.`
8965:              : `${item.label} is approved.`
8979:    approved: 0,
9349:app.post('/execute_publish_package', (req, res) => {
9354:    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
9355:    const payload = buildSocialExecutionPayload(publishPackage);
9356:    const executionState = 'manual_publish_ready';
9360:      campaign_name: String(publishPackage.campaign_name || req.body?.campaign_name || '').trim(),
9369:    const log = writeExecutionBridgeLog(projectName, 'execute_publish_package', {
9389:      writeExecutionBridgeLog(logProject, 'execute_publish_package', {
9390:        status: 'failed',
9391:        result: 'validation_failed',
9402:      message: error.message || 'Failed to execute publish package'
9447:        status: 'failed',
9448:        result: 'validation_failed',
9471:      : req.body?.publish_package?.assets?.[0]?.fallback_prompt_pack;
9474:      const error = new Error('Missing prompt_pack. Provide prompt_pack or publish_package.assets[0].fallback_prompt_pack');
9507:        status: 'failed',
9508:        result: 'validation_failed',
9560:        status: 'failed',
9561:        result: 'validation_failed',
9716:        'Review this prepared draft, then approve before applying any product update to WooCommerce.'
9800:        'Use the cloned draft product for safe content updates before publishing.'
9915:        'Review the updated draft clone in WooCommerce before any publish action.'
10024:      error: 'Upload failed',
10568:    const allowed = new Set(['approved', 'needs_review', 'rejected', 'archived']);
10585:      asset.approved = status === 'approved';
10591:      if (status === 'approved') {
10592:        asset.approved_at = now;
10823:      queue_center: snapshot.queue_center || {}
10862:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
10863:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
11215:        status: 'failed',
11258:        status: 'failed',
11301:        status: 'failed',
11790:    const result = removeProjectSourceOfTruth(req.params.project, req.params.sourceType);
11794:      error: error.message || 'Failed to remove project source'
11801:    const result = removeProjectSourceOfTruth(req.params.project, req.params.sourceType);
11805:      error: error.message || 'Failed to remove project source'
11944:      error: 'customer_operations_health_failed',
11957:      error: 'customer_operations_readiness_failed',
11971:      error: 'customer_operations_channels_failed',
11985:      error: 'customer_operations_inbox_failed',
12042:      error: 'customer_operations_conversations_failed',
12056:      error: 'customer_operations_messages_failed',
12070:      error: 'customer_operations_customers_failed',
12084:      error: 'customer_operations_sla_failed',
12098:      error: 'customer_operations_escalations_failed',
12183:      error: 'native_media_generation_failed',
12253:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
12276:    logCriticalFailure('publishing_schedule', req, error, {
12280:      error: error.message || 'Failed to save publishing schedule',
12286:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
12309:    logCriticalFailure('publishing_schedule', req, error, {
12313:      error: error.message || 'Failed to save publishing schedule',
12319:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12342:      error: error.message || 'Failed to reschedule publishing item',
12348:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
12371:      error: error.message || 'Failed to reschedule publishing item',
12377:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12393:      error: error.message || 'Failed to approve publishing item',
12399:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
12415:      error: error.message || 'Failed to approve publishing item',
12421:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12423:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12425:      status: 'published'
12428:      status: 'published',
12432:      execution_status: 'published',
12433:      action_type: 'manual_publish_complete',
12442:    logCriticalFailure('publishing_publish', req, error, {
12447:      error: error.message || 'Failed to publish item',
12453:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
12455:    assertPublishingMutationAllowed(req.params.project, 'publish', {
12457:      status: 'published'
12460:      status: 'published',
12464:      execution_status: 'published',
12465:      action_type: 'manual_publish_complete',
12474:    logCriticalFailure('publishing_publish', req, error, {
12479:      error: error.message || 'Failed to publish item',
12485:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12487:    assertPublishingMutationAllowed(req.params.project, 'fail', {
12489:      status: 'failed'
12492:      status: 'failed',
12496:      execution_status: 'failed',
12497:      action_type: 'manual_publish_failed',
12498:      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
12506:    logCriticalFailure('publishing_fail', req, error, {
12511:      error: error.message || 'Failed to mark publishing item as failed',
12517:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
12519:    assertPublishingMutationAllowed(req.params.project, 'fail', {
12521:      status: 'failed'
12524:      status: 'failed',
12528:      execution_status: 'failed',
12529:      action_type: 'manual_publish_failed',
12530:      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
12538:    logCriticalFailure('publishing_fail', req, error, {
12543:      error: error.message || 'Failed to mark publishing item as failed',
13144:  const publishDir = path.join(baseDir, 'publish-packages');
13147:  const legacyPublishDir = path.join(legacyBaseDir, 'publish-packages');
13152:  ensureDir(publishDir);
13162:    publishDir,
13210:  const packageId = `publish_${Date.now()}`;
13222:    ready_for_publish: payload.assets.length > 0,
13230:    artifactType: 'campaign_publish_package',
13291:  const publishDir = resolveExecutionReadCandidate({
13294:    relativePath: 'publish-packages',
13298:    requestedFile: `campaign-finalization/publish-packages/${safeName}*`
13312:  const publishFiles = fs.existsSync(publishDir)
13313:    ? fs.readdirSync(publishDir).filter(x => x.startsWith(safeName))
13320:    publish_packages_count: publishFiles.length,
13322:    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
13360:    status: String(payload.status || 'failed').trim() || 'failed',
13365:    record.error = sanitizeErrorMessage(payload.error, 'Execution bridge failed');
13400:  const inlinePackage = input.publish_package && typeof input.publish_package === 'object'
13401:    ? input.publish_package
13410:    const error = new Error('Missing publish package. Provide publish_package or campaign_name + channel');
13419:function buildSocialExecutionPayload(publishPackage) {
13420:  const assets = assertExecutionPackageAssets(publishPackage, 'publish package');
13421:  const channel = String(publishPackage.channel || '').trim().toLowerCase();
13427:    || `${String(primaryAsset.product_name || publishPackage.campaign_name || 'Campaign').trim()} update`;
13719:    domain: 'publishing',
13723:    requestedFile: `publishing/scheduler/${jobId}.json`
13741:    assertPublishingMutationAllowed(projectName, 'publish', {
13743:      status: 'published'
13762:    external_publish: normalizedMode !== 'semi_auto',
13772:      result.execution_status = 'ready_for_manual_publish';
13773:      result.action_type = 'manual_publish';
13774:      result.notes.push('Social payload is ready for operator-controlled publishing.');
13790:      result.execution_status = 'auto_publish_pending';
13791:      result.action_type = 'auto_publish';
13792:      result.notes.push('Full-auto mode enabled. Social publish adapter should consume this.');
13808:    artifactType: 'publishing_execution_result',
13878:    const error = new Error('Manual publish recording is allowed only in semi_auto mode.');
13902:  const manualPublishDir = path.join(projectPaths.executionDir, 'manual-publish');
13911:    published_at: nowIso,
13914:    external_publish: false,
13915:    manual_publish: true,
13941:      manual_publish_recorded: true,
13942:      manual_publish_url: safePostUrl,
13943:      manual_publish_operator: safeOperator,
13944:      manual_publish_recorded_at: nowIso,
13945:      final_status: 'manually_published',
13946:      manual_publish: true,
13947:      external_publish: false,
13962:      artifactType: 'publishing_execution_result',
13971:    warnings.push('Execution result file not found for job_id. Manual publish record saved without execution-result update.');
13979:    manual_publish_recorded: true,
13980:    external_publish: false,
13981:    manual_publish: true,
14017:    artifactType: 'publishing_execution_result',
14039:      String(item?.entity_type || '').trim() === 'publishing_job'
14060:  const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
14061:    || ['ready', 'published'].includes(requestedStatus);
14062:  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
14063:    || ['ready', 'published'].includes(requestedStatus);
14066:  //   freeze_publishing  → default false (permissive — freeze is opt-in)
14067:  //   approval_before_publish → default true (restrictive — approval is required by default)
14068:  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
14069:    ? policyRules.freeze_publishing
14070:    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
14071:  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
14072:    ? policyRules.approval_before_publish
14073:    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);
14077:      route: '/governance/publishing',
14087:    logGovernanceBlock('freeze_publishing');
14089:      'Publishing is frozen by governance policy. The requested publishing mutation was blocked.',
14092:        rule: 'freeze_publishing'
14099:      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
14101:        'Approval before publish is enabled. This publishing action requires a durable publishing job with an approved governance decision.',
14104:          rule: 'approval_before_publish'
14112:    if (!['approved', 'overridden'].includes(approvalStatus)) {
14113:      logGovernanceBlock('approval_before_publish', {
14118:        'Approval before publish is enabled. The publishing job is not approved for ready/publish mutation.',
14121:          rule: 'approval_before_publish',
14477:    approved_assets: categoryReadiness.categories
14478:      .flatMap(category => category.approved_assets.map(assetId => ({
15006:    if (command === '/approve_ad') {
15021:      item.status = 'approved';
15031:    if (command === '/approve_post') {
15046:      item.status = 'approved';
15056:    if (command === '/approve_blog') {
15071:      item.status = 'approved';
15081:    if (command === '/approve_email') {
15094:      item.status = 'approved';
15349:      item.status = 'ready_for_publish';
15356:        note: 'Post draft is now ready_for_publish. Social publishing connector is the next layer.'
15375:      item.status = 'ready_for_publish';
15382:        note: 'Blog draft is now ready_for_publish. Website/blog publishing connector is the next layer.'
15409:if (command === '/publish_blog') {
15416:    `http://localhost:${PORT}/publish-blog/${draftId}?project=${encodeURIComponent(commandProject)}`,
15655:      error: 'Image generation failed',
15673:  if (!blogItem || !blogItem.published_post_id) {
15674:    return res.json({ error: 'Blog not published or not found' });
15709:      `${process.env.WP_BASE_URL}/posts/${blogItem.published_post_id}`,
15726:    asset.attached_post_id = blogItem.published_post_id;
15749:        post_id: blogItem.published_post_id,
15760:      error: 'Upload or attach failed',
15766:    if (command === '/enhance_published_blog') {
15778:      if (!blogItem || !blogItem.published_post_id) {
15788:        const postId = blogItem.published_post_id;
15893:          error: 'Blog enhancement failed',
15899:    if (command === '/review_published_blog') {
15921:          published_post_id: blogItem.published_post_id || null,
16151:      error: 'Attach email image failed',
16222:          error: 'Email image generation failed',
16287:          error: 'Email send failed',
16511:          'Generate assets from strategy, then run review -> approval -> media -> publish/send.',
17251:          'publish landing/product/blog asset',
17360:          'publish one authority blog',
17362:          'publish three social assets',
17715:    if (command === '/campaign_publish_blog') {
17742:          `http://localhost:${PORT}/publish-blog/${blogId}?project=${encodeURIComponent(commandProject)}`
17745:        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
17746:        campaignExec.controlled_publish.blog = {
17747:          status: 'published',
17750:          published_at: new Date().toISOString()
17761:          result: campaignExec.controlled_publish.blog
17765:          error: 'Campaign blog publish failed',
17806:        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
17807:        campaignExec.controlled_publish.email = {
17823:          result: campaignExec.controlled_publish.email
17827:          error: 'Campaign email send failed',
17833:    if (command === '/campaign_review_publish_state') {
17858:          controlled_publish: campaignExec.controlled_publish || {},
17860:            blog: campaignExec.controlled_publish?.blog?.status || 'not_published',
17861:            email: campaignExec.controlled_publish?.email?.status || 'not_sent'
17990:        approved_style_only: true,
18029:        approved_for_ai_composition: true,
18139:      approved_for_ai_composition: true,
18166:      error: 'WooCommerce media import failed',
18668:      error: 'Render execution failed',
19748:if (command === '/build_campaign_publish_package') {
19765:      error: 'Failed to build campaign publish package',
19914:if (command === '/record_manual_publish') {
19925:      error: 'Missing required args. Usage: /record_manual_publish <project> <campaign> <channel> <job_id> <operator> <post_url> [notes...]'
19934:      error: 'Failed to record manual publish',
20589:app.post('/publish-clone/:cloneId', async (req, res) => {
20592:    assertPublishingMutationAllowed(projectName, 'publish', {
20593:      status: 'published'
20600:        status: 'publish'
20610:    const publishedProduct = response.data;
20613:      mode: 'publish_clone',
20614:      product_id: publishedProduct.id,
20615:      name: publishedProduct.name,
20616:      status: publishedProduct.status,
20617:      permalink: publishedProduct.permalink,
20620:        'This action published a draft product. Original product was not modified.'
20623:    logCriticalFailure('publish_clone', req, error, {
20627:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to publish clone product'
20635:    assertPublishingMutationAllowed(projectName, 'publish', {
20636:      status: 'published'
20676:      status: 'publish'
20768:app.post('/publish-blog/:draftId', async (req, res) => {
20771:    assertPublishingMutationAllowed(projectName, 'publish', {
20772:      status: 'published'
20820:        status: 'publish'
20830:        message: `WordPress publish failed with status ${response.status}`
20834:    item.status = 'published';
20835:    item.published_post_id = data.id || null;
20838:    item.date_published = data.date || '';
20860:      note: 'Blog published successfully'
20863:    logCriticalFailure('publish_blog', req, err, {
20869:      message: 'Failed to publish blog draft'
20877:    assertPublishingMutationAllowed(projectName, 'publish', {
20878:      status: 'published'
20906:      status: backupData.status || 'publish'
20945:const SCHEDULER_VALID_JOB_TYPES = Object.freeze(['publish', 'email', 'media', 'ads']);
21005:  const publishPackage = payload.publish_package && typeof payload.publish_package === 'object'
21006:    ? payload.publish_package
21008:  const assets = Array.isArray(publishPackage.assets) ? publishPackage.assets : [];
21014:      || publishPackage.campaign_id
21199:  const failed = jobs.filter((job) => job.status === 'failed');
21200:  const retryable = jobs.filter((job) => job.status === 'retryable');
21211:      failed: 0,
21212:      retryable: 0
21217:    if (job.status === 'failed') current.failed += 1;
21218:    if (job.status === 'retryable') current.retryable += 1;
21224:    failure_rate: entry.total_jobs > 0
21225:      ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
21232:    failed_jobs: failed.length,
21233:    retryable_jobs: retryable.length,
21484:    const failed = [];
21486:    const retryable = [];
21494:      if (job.status === 'failed') {
21495:        failed.push(job);
21504:      if (job.status === 'retryable') {
21505:        retryable.push(job);
21530:        failed: failed.length,
21532:        retryable: retryable.length
21538:        failed,
21540:        retryable
21566:      if (job.status === 'failed' && job.attempts >= job.max_attempts) continue;
21614:            action: 'intelligence_loop_failed',
21616:            error: intelligenceError.message || 'Intelligence loop update failed'
21629:        const errorMessage = sanitizeErrorMessage(err.message, 'Job execution failed');
21633:        job.status = canRetry ? 'retryable' : 'failed';
21634:        job.execution_state = 'failed';
21642:          action: 'job_failed',
21648:            can_retry: canRetry
22014:    : sanitizeErrorMessage(err?.message, 'Request failed');

## Cross-page Queue Center references
public/control-center/pages/operations-centers.js:202:  if (pageKey === "queue-center") {
public/control-center/pages/operations-centers.js:207:        prompt: `Review Queue Center for ${projectLabel}. Which queue needs attention first, why, and what should be routed next?`
public/control-center/pages/operations-centers.js:210:        label: "Review selected queue item",
public/control-center/pages/operations-centers.js:211:        preview: "Explain what the selected queue item likely needs next.",
public/control-center/pages/operations-centers.js:212:        prompt: `Review ${itemLabel} in Queue Center for ${projectLabel}. Explain what it likely needs next and which workspace should own it.`
public/control-center/pages/operations-centers.js:217:        prompt: `Analyze Queue Center for ${projectLabel} with focus on ${focusLabel}. Identify throughput blockers, queue bottlenecks, and the next operational adjustments.`
public/control-center/pages/operations-centers.js:304:      helper: "Active queue items",
public/control-center/pages/operations-centers.js:306:      route: "queue-center"
public/control-center/pages/operations-centers.js:845:    ? "No queue items match the current filters."
public/control-center/pages/operations-centers.js:846:    : "No queue items are available for this project yet. Use Refresh or adjust project context to load current queues.";
public/control-center/pages/operations-centers.js:861:            <strong>Queue Center error</strong>
public/control-center/pages/operations-centers.js:875:              <strong>${escapeHtml(item.title || "Queue item")}</strong>
public/control-center/pages/operations-centers.js:888:    <section class="page is-active" data-page="queue-center">
public/control-center/pages/operations-centers.js:893:              <span class="std-context-eyebrow">QUEUE CENTER</span>
public/control-center/pages/operations-centers.js:894:              <h3 class="std-context-title">Queue Center</h3>
public/control-center/pages/operations-centers.js:897:            <div class="std-context-metrics" aria-label="Queue Center metrics">
public/control-center/pages/operations-centers.js:944:              <div class="error-state ops-queue-state" aria-live="assertive"><strong>Queue Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:959:                  <div class="panel-kicker">Selected Queue Item</div>
public/control-center/pages/operations-centers.js:960:                  <h3>${escapeHtml(selectedItem?.title || "Select a queue item")}</h3>
public/control-center/pages/operations-centers.js:961:                  <p>${escapeHtml(selectedItem ? "Inspect queue type, owner, status, and route target before acting." : "Choose a queue item from the table to inspect details.")}</p>
public/control-center/pages/operations-centers.js:967:                    <strong>${escapeHtml(selectedItem.title || "Queue item")}</strong>
public/control-center/pages/operations-centers.js:979:              ` : `<div class="empty-box">No queue item is selected.</div>`}
public/control-center/pages/operations-centers.js:991:                <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
public/control-center/pages/operations-centers.js:1003:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1006:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1061:  const prompts = buildOpsAssistantPrompts("queue-center", projectName, selectedItem, titleCase(session.focus || "all queues"));
public/control-center/pages/operations-centers.js:1090:          session.errorMessage = `Queue Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1783:  id: "queue-center",
public/control-center/pages/operations-centers.js:1787:    title: "Queue Center",
public/control-center/pages/operations-centers.js:1790:  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1820:          session.errorMessage = `Queue Center: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1949:      route: "queue-center",
public/control-center/pages/operations-centers.js:1950:      title: "Queue Center",
public/control-center/pages/operations-centers.js:1954:      action: "Open Queue Center"
public/control-center/pages/ai-command.js:2357:	"queue-center": "Queue Center",
public/control-center/pages/ai-command.js:2379:	"queue-center": "operations",
public/control-center/pages/ai-command.js:2413:	queue: "queue-center",
public/control-center/pages/publishing.js:769:      /* Publishing queue dark contrast correction */
public/control-center/pages/publishing.js:993:      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
public/control-center/pages/publishing.js:1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
public/control-center/pages/publishing.js:1140:    : `<div class="empty-box">No publish queue items match this filter. Create or load a draft to start the execution queue.</div>`;
public/control-center/pages/publishing.js:1147:          <h3>Queue items and execution actions</h3>
public/control-center/pages/workflows.js:57:    purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
