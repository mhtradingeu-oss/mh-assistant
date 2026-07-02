# Notification Center Active Render Excerpt

Generated: Sat Jun  6 00:42:08 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: b183266

## renderNotificationCenterLayout + renderNotificationCenter area
      id: `provider-${key}`,
      title: `${titleCase(key)} disconnected`,
      message: "Provider readiness check is currently failing.",
      severity: "warning",
      route: { route: "integrations" }
    }));
}

function buildGovernanceApprovalAlerts(summary) {
  return asArray(asObject(summary).sections?.approval_queue).map((item) => ({
    id: `governance-approval-${asString(item.id)}`,
    title: asString(item.title) || "Approval pending",
    message: asString(item.summary) || "Approval requires review.",
    severity: asString(item.risk_level) === "critical" ? "critical" : asString(item.risk_level) === "high" ? "warning" : "info",
    status: asString(item.status) || "pending",
    source: "approval_pending",
    entity_type: "approval",
    entity_id: asString(item.id),
    route: "governance",
    route_label: "governance",
    created_at: asString(item.created_at),
    notification_id: `governance-approval-${asString(item.id)}`,
    item_type: "approval"
  }));
}

function getGovernanceApprovalId(item) {
  const directId = asString(item?.approval_id || item?.approvalId);
  if (directId) return directId;

  const entityId = asString(item?.entity_id);
  if (entityId && entityId !== "approval") return entityId;

  const id = asString(item?.id || item?.notification_id);
  if (id.startsWith("governance-approval-")) {
    return id.slice("governance-approval-".length);
  }

  return id;
}

function isGovernanceApprovalItem(item) {
  return asString(item?.item_type) === "approval"
    || asString(item?.entity_type) === "approval"
    || asString(item?.source) === "approval_pending";
}

function isOpenGovernanceApproval(item) {
  const status = asString(item?.status || item?.approval_status || "pending").toLowerCase();
  return !status || ["pending", "open", "queued", "in_review", "review"].includes(status);
}

function renderGovernanceDecisionActions(item, escapeHtml) {
  if (!isGovernanceApprovalItem(item) || !isOpenGovernanceApproval(item)) return "";

  const approvalId = getGovernanceApprovalId(item);
  if (!approvalId) return "";

  return `
    <div class="ops-governance-actions">
      <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance</button>
      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(approvalId)}">Approve</button>
      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(approvalId)}">Reject</button>
      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(approvalId)}">Request Changes</button>
      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(approvalId)}">Escalate</button>
    </div>
  `;
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
    errorMessage: "",
    didAutoRefresh: false,
    didHydrateGovernanceApprovals: false
  });

  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
  const governanceApprovalAlerts = buildGovernanceApprovalAlerts(asObject(asObject(state.data.governance).summary));
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
  const approvalAlerts = (asArray(notificationCenter.approval_pending_alerts).length
    ? asArray(notificationCenter.approval_pending_alerts)
    : governanceApprovalAlerts
  ).map((item) => ({ ...item, item_type: "approval" }));
  const publishAlerts = asArray(notificationCenter.publish_alerts).map((item) => ({ ...item, item_type: "publish" }));
  const providerAlerts = providerDisconnectAlerts.map((item) => ({ ...item, item_type: "provider" }));
  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).map((item) => ({ ...item, item_type: "claim" }));
  const workflowAlerts = asArray(notificationCenter.workflow_completion_alerts).map((item) => ({ ...item, item_type: "workflow" }));
  const baseAlerts = [
    ...syncAlerts,
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
              ${selectedItem ? renderGovernanceDecisionActions(selectedItem, escapeHtml) : ""}
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
  Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-governance-action") || "";
      if (action !== "refresh") return;

      if (!projectName || !context.fetchProjectGovernance) {
        context.showError?.("Governance refresh is unavailable for this project.");
        return;
      }

      try {
        const liveGovernance = await context.fetchProjectGovernance(projectName);
        const currentState = context.getState();
        const governanceData = asObject(currentState.data.governance);
        renderNotificationCenter(context, {
