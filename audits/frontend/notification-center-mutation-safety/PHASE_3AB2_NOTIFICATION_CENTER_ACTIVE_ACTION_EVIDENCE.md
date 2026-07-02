# PHASE 3AB.2 — Notification Center Active Action Evidence

## Notification Center active action markers
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
1433:function renderNotificationCenter(context, state, projectName) {
1552:            <button class="btn btn-secondary std-context-btn" type="button" id="notificationCenterRefreshBtnHeader">Refresh</button>
1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
1584:              <select id="notificationCenterSeverity" class="sidebar-select">
1635:                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
1636:                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Source Page") : ""}
1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
1687:  const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
1699:          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1712:  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", refreshNotificationCenter);
1713:  root.querySelector("#notificationCenterRefreshBtnHeader")?.addEventListener("click", refreshNotificationCenter);
1722:  root.querySelector("#notificationCenterSearch")?.addEventListener("input", (event) => {
1726:  root.querySelector("#notificationCenterSeverity")?.addEventListener("change", (event) => {
1730:  Array.from(root.querySelectorAll("[data-mark-read]")).forEach((button) => {
1732:      const notificationId = button.getAttribute("data-mark-read") || "";
1733:      if (!notificationId || !context.markProjectNotification) return;
1735:        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
1878:export const notificationCenterRoute = {
1891:    renderNotificationCenter(context, context.getState(), projectName);
1905:      renderNotificationCenter(context, context.getState(), projectName);
1912:          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1917:          renderNotificationCenter(context, context.getState(), projectName);
2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Notification Center layout/action range
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

## Notification Center render/bindings range
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

## Notification Center route export
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
        });
    }

    doFetch();
