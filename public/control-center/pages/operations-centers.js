const taskSessions = new Map();
const queueSessions = new Map();
const jobSessions = new Map();
const notificationSessions = new Map();

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "Not set";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function badgeTone(value) {
  const normalized = asString(value).toLowerCase();
  if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
  if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
  if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
  return "neutral";
}

function formatCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "0";
}

function ensureSession(map, projectName, initialState) {
  const key = projectName || "__default__";
  if (!map.has(key)) {
    map.set(key, { ...initialState });
  }
  return map.get(key);
}

function filterBySearch(items, search, fields) {
  const query = asString(search).trim().toLowerCase();
  if (!query) return items;

  return items.filter((item) =>
    fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
  );
}

function bindRouteButtons(root, context) {
  Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
    button.onclick = () => {
      const route = button.getAttribute("data-ops-route") || "home";
      const label = button.getAttribute("data-ops-label") || "item";
      context.navigateTo(route);
      context.showMessage?.(`Opened ${label}.`);
    };
  });
}

function renderMetricCards(metrics, escapeHtml) {
  return `
    <div class="ops-metric-grid">
      ${metrics.map((metric) => `
        <div class="ops-metric-card">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(asString(metric.value))}</strong>
          <small>${escapeHtml(metric.helper || "")}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFilterOptions(options, currentValue, escapeHtml, allLabel = "All") {
  return [
    `<option value="all">${escapeHtml(allLabel)}</option>`,
    ...asArray(options).map((item) => {
      const value = asString(item.value);
      return `<option value="${escapeHtml(value)}"${value === currentValue ? " selected" : ""}>${escapeHtml(`${titleCase(value)} (${item.count})`)}</option>`;
    })
  ].join("");
}

function renderRouteAction(item, escapeHtml, label = "Open") {
  const route = asString(item?.route?.route || item?.route || item?.route_target);
  if (!route) return "";

  return `<button class="btn btn-secondary btn-sm" type="button" data-ops-route="${escapeHtml(route)}" data-ops-label="${escapeHtml(asString(item?.title || item?.name || label))}">${escapeHtml(label)}</button>`;
}

function renderOpsTable(columns, rows, emptyText, escapeHtml) {
  if (!rows.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="ops-table-wrap">
      <table class="ops-table">
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderQueueGroup(title, items, escapeHtml) {
  return `
    <article class="ops-lane">
      <div class="ops-lane-head">
        <h4>${escapeHtml(title)}</h4>
        <span class="card-badge neutral">${escapeHtml(String(items.length))}</span>
      </div>
      ${items.length ? `
        <div class="ops-list">
          ${items.slice(0, 4).map((item) => `
            <div class="ops-list-item">
              <div>
                <strong>${escapeHtml(item.title || "Queue item")}</strong>
                <span>${escapeHtml(titleCase(item.status || "queued"))}</span>
              </div>
              ${renderRouteAction(item, escapeHtml)}
            </div>
          `).join("")}
        </div>
      ` : `<div class="empty-box">${escapeHtml(`No items in ${title.toLowerCase()}.`)}</div>`}
    </article>
  `;
}

function renderTaskCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const ops = asObject(state.data.operations);
  const taskCenter = asObject(ops.task_center);
  const filters = asObject(taskCenter.filters);
  const session = ensureSession(taskSessions, projectName, {
    status: "all",
    priority: "all",
    owner: "all",
    source: "all",
    search: ""
  });

  let items = asArray(taskCenter.items);
  items = filterBySearch(items, session.search, ["title", "description", "owner", "assignee", "service_domain"]);
  if (session.status !== "all") items = items.filter((item) => asString(item.status) === session.status);
  if (session.priority !== "all") items = items.filter((item) => asString(item.priority) === session.priority);
  if (session.owner !== "all") items = items.filter((item) => asString(item.owner_role) === session.owner);
  if (session.source !== "all") items = items.filter((item) => asString(item.source_page) === session.source);

  root.innerHTML = `
    <section class="page is-active" data-page="task-center">
      <div class="ops-shell">
        <div class="ops-hero">
          <div>
            <div class="panel-kicker">Operational Control</div>
            <h3>Task Center</h3>
            <p>Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up.</p>
          </div>
          <button class="btn btn-primary" type="button" id="taskCenterRefreshBtn">Refresh</button>
        </div>

        ${renderMetricCards([
          { label: "Total Tasks", value: formatCount(taskCenter.total), helper: "Durable operating backlog" },
          { label: "Open", value: formatCount(taskCenter.open_count), helper: "Requires execution" },
          { label: "Blocked", value: formatCount(taskCenter.blocked_count), helper: "Needs intervention" },
          { label: "Overdue", value: formatCount(taskCenter.overdue_count), helper: "Past due date" },
          { label: "Due Soon", value: formatCount(taskCenter.due_soon_count), helper: "Within 48 hours" }
        ], context.escapeHtml)}

        <div class="ops-toolbar">
          <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${context.escapeHtml(session.search)}">
          <select id="taskCenterStatus" class="sidebar-select">${renderFilterOptions(filters.statuses, session.status, context.escapeHtml, "All statuses")}</select>
          <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, context.escapeHtml, "All priorities")}</select>
          <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, context.escapeHtml, "All owners")}</select>
          <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, context.escapeHtml, "All sources")}</select>
        </div>

        <div class="ops-layout">
          <article class="panel panel-span-2">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">1. Durable Tasks</div>
                <h3>Execution backlog</h3>
                <p>Owners, due dates, linked entities, and source routes stay visible in one operational surface.</p>
              </div>
              <span class="card-badge neutral">${context.escapeHtml(String(items.length))} filtered</span>
            </div>
            ${renderOpsTable(
              ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
              items.map((item) => `
                <tr>
                  <td>
                    <strong>${context.escapeHtml(item.title || "Task")}</strong>
                    <span>${context.escapeHtml(item.description || item.service_domain || "-")}</span>
                  </td>
                  <td>
                    <strong>${context.escapeHtml(item.assignee || item.owner || "-")}</strong>
                    <span>${context.escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
                  </td>
                  <td>
                    <strong>${context.escapeHtml(formatDateTime(item.due_at))}</strong>
                    <span class="card-badge ${badgeTone(item.due_state)}">${context.escapeHtml(titleCase(item.due_state || "unscheduled"))}</span>
                  </td>
                  <td><span class="card-badge ${badgeTone(item.priority)}">${context.escapeHtml(titleCase(item.priority || "normal"))}</span></td>
                  <td>${context.escapeHtml(titleCase(item.source_page || "-"))}</td>
                  <td>${context.escapeHtml(item.linked_entity?.label || item.linked_entity?.entity_type || "-")}</td>
                  <td><span class="card-badge ${badgeTone(item.status)}">${context.escapeHtml(titleCase(item.status || "open"))}</span></td>
                  <td>${renderRouteAction(item, context.escapeHtml)}</td>
                </tr>
              `),
              "No tasks match the current filters.",
              context.escapeHtml
            )}
          </article>

          <aside class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">2. Ownership</div>
                <h3>Workload by role</h3>
              </div>
            </div>
            <div class="ops-list">
              ${asArray(filters.owners).length ? asArray(filters.owners).map((owner) => `
                <div class="ops-list-item">
                  <div>
                    <strong>${context.escapeHtml(titleCase(owner.value || "unassigned"))}</strong>
                    <span>${context.escapeHtml(`${owner.count} tasks`)}</span>
                  </div>
                </div>
              `).join("") : `<div class="empty-box">${context.escapeHtml("No owners have been assigned yet.")}</div>`}
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;

  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", () => context.reloadProjectData?.(projectName));
  root.querySelector("#taskCenterSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#taskCenterStatus", "status"], ["#taskCenterPriority", "priority"], ["#taskCenterOwner", "owner"], ["#taskCenterSource", "source"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
}

function renderQueueCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const queueCenter = asObject(asObject(state.data.operations).queue_center);
  const session = ensureSession(queueSessions, projectName, {
    queueType: "all",
    status: "all",
    search: ""
  });

  let items = filterBySearch(asArray(queueCenter.items), session.search, ["title", "assignee", "queue_type", "status"]);
  if (session.queueType !== "all") items = items.filter((item) => asString(item.queue_type) === session.queueType);
  if (session.status !== "all") items = items.filter((item) => asString(item.status) === session.status);

  root.innerHTML = `
    <section class="page is-active" data-page="queue-center">
      <div class="ops-shell">
        <div class="ops-hero">
          <div>
            <div class="panel-kicker">Operational Control</div>
            <h3>Queue Center</h3>
            <p>Workflow, content, media, approval, publishing, and sync queues aligned into one operational command surface.</p>
          </div>
          <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh</button>
        </div>

        ${renderMetricCards(asArray(queueCenter.queue_counts).map((item) => ({
          label: titleCase(item.queue_type || "queue"),
          value: formatCount(item.total),
          helper: `${formatCount(item.active)} active`
        })), context.escapeHtml)}

        <div class="ops-toolbar">
          <input id="queueCenterSearch" class="command-input" type="text" placeholder="Search queues, items, assignees..." value="${context.escapeHtml(session.search)}">
          <select id="queueCenterType" class="sidebar-select">${renderFilterOptions(asObject(queueCenter.filters).queue_types, session.queueType, context.escapeHtml, "All queues")}</select>
          <select id="queueCenterStatus" class="sidebar-select">${renderFilterOptions(asObject(queueCenter.filters).statuses, session.status, context.escapeHtml, "All statuses")}</select>
        </div>

        <div class="ops-lane-grid">
          ${renderQueueGroup("Workflow Queue", asArray(queueCenter.workflow_queue), context.escapeHtml)}
          ${renderQueueGroup("Content Queue", asArray(queueCenter.content_queue), context.escapeHtml)}
          ${renderQueueGroup("Media Queue", asArray(queueCenter.media_queue), context.escapeHtml)}
          ${renderQueueGroup("Approval Queue", asArray(queueCenter.approval_queue), context.escapeHtml)}
          ${renderQueueGroup("Publishing Queue", asArray(queueCenter.publishing_queue), context.escapeHtml)}
          ${renderQueueGroup("Sync Queue", asArray(queueCenter.sync_queue), context.escapeHtml)}
        </div>

        <article class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">1. Central Queue Table</div>
              <h3>Queue operations</h3>
              <p>Every durable queue item stays routeable back to the exact page that owns the work.</p>
            </div>
          </div>
          ${renderOpsTable(
            ["Queue", "Item", "Assignee", "Priority", "Status", "Updated", "Route"],
            items.map((item) => `
              <tr>
                <td><span class="card-badge neutral">${context.escapeHtml(titleCase(item.queue_type || "queue"))}</span></td>
                <td>
                  <strong>${context.escapeHtml(item.title || "Queue item")}</strong>
                  <span>${context.escapeHtml(item.details?.summary || item.entity_type || "-")}</span>
                </td>
                <td>${context.escapeHtml(item.assignee || "-")}</td>
                <td><span class="card-badge ${badgeTone(item.priority)}">${context.escapeHtml(titleCase(item.priority || "normal"))}</span></td>
                <td><span class="card-badge ${badgeTone(item.status)}">${context.escapeHtml(titleCase(item.status || "queued"))}</span></td>
                <td>${context.escapeHtml(formatDateTime(item.updated_at || item.created_at))}</td>
                <td>${renderRouteAction(item, context.escapeHtml)}</td>
              </tr>
            `),
            "No queue items match the current filters.",
            context.escapeHtml
          )}
        </article>
      </div>
    </section>
  `;

  const rerender = () => renderQueueCenter(context, context.getState(), projectName);
  root.querySelector("#queueCenterRefreshBtn")?.addEventListener("click", () => context.reloadProjectData?.(projectName));
  root.querySelector("#queueCenterSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#queueCenterType", "queueType"], ["#queueCenterStatus", "status"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
}

function renderJobColumn(title, items, escapeHtml) {
  return `
    <article class="ops-lane">
      <div class="ops-lane-head">
        <h4>${escapeHtml(title)}</h4>
        <span class="card-badge neutral">${escapeHtml(String(items.length))}</span>
      </div>
      ${items.length ? `
        <div class="ops-list">
          ${items.slice(0, 6).map((item) => `
            <div class="ops-list-item">
              <div>
                <strong>${escapeHtml(item.title || "Job")}</strong>
                <span>${escapeHtml(`${titleCase(item.kind || "job")} • ${titleCase(item.status || "unknown")}`)}</span>
              </div>
              ${renderRouteAction(item, escapeHtml)}
            </div>
          `).join("")}
        </div>
      ` : `<div class="empty-box">${escapeHtml(`No ${title.toLowerCase()} jobs right now.`)}</div>`}
    </article>
  `;
}

function renderJobMonitor(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const jobMonitor = asObject(asObject(state.data.operations).job_monitor);
  const session = ensureSession(jobSessions, projectName, {
    status: "all",
    kind: "all",
    search: ""
  });

  let items = filterBySearch(asArray(jobMonitor.items), session.search, ["title", "kind", "status", "owner"]);
  if (session.status !== "all") items = items.filter((item) => asString(item.status) === session.status);
  if (session.kind !== "all") items = items.filter((item) => asString(item.kind) === session.kind);

  root.innerHTML = `
    <section class="page is-active" data-page="job-monitor">
      <div class="ops-shell">
        <div class="ops-hero">
          <div>
            <div class="panel-kicker">Operational Control</div>
            <h3>Job Monitor</h3>
            <p>Running, completed, and failed execution across workflows, media generation, and publishing with live operational logs.</p>
          </div>
          <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh</button>
        </div>

        ${renderMetricCards([
          { label: "Health State", value: titleCase(jobMonitor.health_state || "unknown"), helper: "Overall execution condition" },
          { label: "Running", value: formatCount(jobMonitor.running_count), helper: "In flight now" },
          { label: "Completed", value: formatCount(jobMonitor.completed_count), helper: "Durably finished" },
          { label: "Failed", value: formatCount(jobMonitor.failed_count), helper: "Needs retries or fixes" },
          { label: "Retries", value: formatCount(jobMonitor.total_retries), helper: "Recorded retry attempts" }
        ], context.escapeHtml)}

        <div class="ops-toolbar">
          <input id="jobMonitorSearch" class="command-input" type="text" placeholder="Search jobs, kinds, owners..." value="${context.escapeHtml(session.search)}">
          <select id="jobMonitorStatus" class="sidebar-select">
            ${["all", "queued", "running", "processing", "scheduled", "ready", "completed", "published", "failed"].map((value) => `<option value="${context.escapeHtml(value)}"${value === session.status ? " selected" : ""}>${context.escapeHtml(titleCase(value))}</option>`).join("")}
          </select>
          <select id="jobMonitorKind" class="sidebar-select">
            ${["all", "workflow", "media", "publishing"].map((value) => `<option value="${context.escapeHtml(value)}"${value === session.kind ? " selected" : ""}>${context.escapeHtml(titleCase(value))}</option>`).join("")}
          </select>
        </div>

        <div class="ops-lane-grid">
          ${renderJobColumn("Running Jobs", asArray(jobMonitor.running_jobs), context.escapeHtml)}
          ${renderJobColumn("Completed Jobs", asArray(jobMonitor.completed_jobs), context.escapeHtml)}
          ${renderJobColumn("Failed Jobs", asArray(jobMonitor.failed_jobs), context.escapeHtml)}
        </div>

        <div class="ops-layout">
          <article class="panel panel-span-2">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">1. Job Ledger</div>
                <h3>Execution inventory</h3>
              </div>
            </div>
            ${renderOpsTable(
              ["Kind", "Job", "Owner", "Retries", "Health", "Status", "Updated", "Route"],
              items.map((item) => `
                <tr>
                  <td><span class="card-badge neutral">${context.escapeHtml(titleCase(item.kind || "job"))}</span></td>
                  <td><strong>${context.escapeHtml(item.title || "Job")}</strong></td>
                  <td>${context.escapeHtml(item.owner || "-")}</td>
                  <td>${context.escapeHtml(formatCount(item.retry_count))}</td>
                  <td><span class="card-badge ${badgeTone(item.health_state)}">${context.escapeHtml(titleCase(item.health_state || "unknown"))}</span></td>
                  <td><span class="card-badge ${badgeTone(item.status)}">${context.escapeHtml(titleCase(item.status || "unknown"))}</span></td>
                  <td>${context.escapeHtml(formatDateTime(item.updated_at || item.created_at))}</td>
                  <td>${renderRouteAction(item, context.escapeHtml)}</td>
                </tr>
              `),
              "No jobs match the current filters.",
              context.escapeHtml
            )}
          </article>

          <aside class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">2. Execution Logs</div>
                <h3>Recent logs</h3>
              </div>
            </div>
            <div class="ops-log-list">
              ${asArray(jobMonitor.execution_logs).length ? asArray(jobMonitor.execution_logs).map((item) => `
                <div class="ops-log-item">
                  <span class="card-badge ${badgeTone(item.severity)}">${context.escapeHtml(titleCase(item.category || "log"))}</span>
                  <strong>${context.escapeHtml(item.title || "Execution event")}</strong>
                  <p>${context.escapeHtml(item.summary || "-")}</p>
                  <div class="ops-log-meta">
                    <span>${context.escapeHtml(formatDateTime(item.timestamp))}</span>
                    ${renderRouteAction(item, context.escapeHtml, "Open")}
                  </div>
                </div>
              `).join("") : `<div class="empty-box">${context.escapeHtml("Execution logs will appear here as jobs run.")}</div>`}
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;

  const rerender = () => renderJobMonitor(context, context.getState(), projectName);
  root.querySelector("#jobMonitorRefreshBtn")?.addEventListener("click", () => context.reloadProjectData?.(projectName));
  root.querySelector("#jobMonitorSearch")?.addEventListener("input", (event) => {
    session.search = event.target.value || "";
    rerender();
  });
  [["#jobMonitorStatus", "status"], ["#jobMonitorKind", "kind"]].forEach(([selector, key]) => {
    root.querySelector(selector)?.addEventListener("change", (event) => {
      session[key] = event.target.value || "all";
      rerender();
    });
  });
  bindRouteButtons(root, context);
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

function renderAlertList(title, items, context, allowMarkRead = false) {
  return `
    <article class="ops-lane">
      <div class="ops-lane-head">
        <h4>${context.escapeHtml(title)}</h4>
        <span class="card-badge neutral">${context.escapeHtml(String(items.length))}</span>
      </div>
      ${items.length ? `
        <div class="ops-alert-list">
          ${items.slice(0, 6).map((item) => `
            <div class="ops-alert-item">
              <div class="ops-alert-head">
                <span class="card-badge ${badgeTone(item.severity)}">${context.escapeHtml(titleCase(item.severity || "info"))}</span>
                ${renderRouteAction(item, context.escapeHtml)}
              </div>
              <strong>${context.escapeHtml(item.title || "Alert")}</strong>
              <p>${context.escapeHtml(item.message || "-")}</p>
              <div class="ops-log-meta">
                <span>${context.escapeHtml(formatDateTime(item.created_at))}</span>
                ${allowMarkRead && item.notification_id ? `<button class="btn btn-secondary btn-sm" type="button" data-mark-read="${context.escapeHtml(item.notification_id)}">Mark Read</button>` : ""}
              </div>
            </div>
          `).join("")}
        </div>
      ` : `<div class="empty-box">${context.escapeHtml(`No ${title.toLowerCase()} right now.`)}</div>`}
    </article>
  `;
}

function renderNotificationCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const notificationCenter = asObject(asObject(state.data.operations).notification_center);
  const session = ensureSession(notificationSessions, projectName, {
    severity: "all",
    search: ""
  });

  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
  const inboxItems = asArray(notificationCenter.notification_items).map((item) => ({
    ...item,
    title: asString(item.title) || "Notification",
    message: asString(item.message || item.body || item.summary),
    created_at: asString(item.created_at),
    notification_id: asString(item.id),
    route: asObject(item.linked_entity).route || "home"
  }));
  let allAlerts = [
    ...asArray(notificationCenter.sync_failure_alerts),
    ...asArray(notificationCenter.approval_pending_alerts),
    ...asArray(notificationCenter.publish_alerts),
    ...providerDisconnectAlerts,
    ...asArray(notificationCenter.claim_risk_alerts),
    ...asArray(notificationCenter.workflow_completion_alerts)
  ];

  allAlerts = filterBySearch(allAlerts, session.search, ["title", "message", "source"]);
  if (session.severity !== "all") allAlerts = allAlerts.filter((item) => asString(item.severity) === session.severity);

  root.innerHTML = `
    <section class="page is-active" data-page="notification-center">
      <div class="ops-shell">
        <div class="ops-hero">
          <div>
            <div class="panel-kicker">Operational Control</div>
            <h3>Notification Center</h3>
            <p>Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion.</p>
          </div>
          <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh</button>
        </div>

        ${renderMetricCards([
          { label: "Active Alerts", value: formatCount(allAlerts.length), helper: "Current operational signals" },
          { label: "Unread Inbox", value: formatCount(notificationCenter.unread_count), helper: "Durable notifications" },
          { label: "Critical", value: formatCount(notificationCenter.critical_count), helper: "Immediate action" },
          { label: "Approvals", value: formatCount(asArray(notificationCenter.approval_pending_alerts).length), helper: "Waiting for decisions" },
          { label: "Claim Risk", value: formatCount(asArray(notificationCenter.claim_risk_alerts).length), helper: "Policy-sensitive items" }
        ], context.escapeHtml)}

        <div class="ops-toolbar">
          <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${context.escapeHtml(session.search)}">
          <select id="notificationCenterSeverity" class="sidebar-select">
            ${["all", "critical", "warning", "success", "info"].map((value) => `<option value="${context.escapeHtml(value)}"${value === session.severity ? " selected" : ""}>${context.escapeHtml(titleCase(value))}</option>`).join("")}
          </select>
        </div>

        <div class="ops-lane-grid">
          ${renderAlertList("Sync Failure Alerts", asArray(notificationCenter.sync_failure_alerts), context)}
          ${renderAlertList("Approval Pending Alerts", asArray(notificationCenter.approval_pending_alerts), context)}
          ${renderAlertList("Publish Alerts", asArray(notificationCenter.publish_alerts), context)}
          ${renderAlertList("Provider Disconnect Alerts", providerDisconnectAlerts, context)}
          ${renderAlertList("Claim Risk Alerts", asArray(notificationCenter.claim_risk_alerts), context)}
          ${renderAlertList("Workflow Completion Alerts", asArray(notificationCenter.workflow_completion_alerts), context)}
        </div>

        <div class="ops-layout">
          <article class="panel panel-span-2">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">1. Alert Ledger</div>
                <h3>Operational alerts</h3>
              </div>
            </div>
            ${renderOpsTable(
              ["Severity", "Alert", "Source", "Created", "Route"],
              allAlerts.map((item) => `
                <tr>
                  <td><span class="card-badge ${badgeTone(item.severity)}">${context.escapeHtml(titleCase(item.severity || "info"))}</span></td>
                  <td>
                    <strong>${context.escapeHtml(item.title || "Alert")}</strong>
                    <span>${context.escapeHtml(item.message || "-")}</span>
                  </td>
                  <td>${context.escapeHtml(titleCase(item.source || "system"))}</td>
                  <td>${context.escapeHtml(formatDateTime(item.created_at))}</td>
                  <td>${renderRouteAction(item, context.escapeHtml)}</td>
                </tr>
              `),
              "No alerts match the current filters.",
              context.escapeHtml
            )}
          </article>

          <aside class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">2. Durable Inbox</div>
                <h3>Notification history</h3>
              </div>
            </div>
            ${renderAlertList("Inbox", inboxItems, context, true)}
          </aside>
        </div>
      </div>
    </section>
  `;

  const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", () => context.reloadProjectData?.(projectName));
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
}

export const taskCenterRoute = {
  id: "task-center",
  meta: {
    eyebrow: "Operate",
    title: "Task Center",
    description: "Manage durable tasks, owners, due dates, priorities, filters, and linked operational entities in one premium execution surface."
  },
  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";
    renderTaskCenter(context, state, projectName);
  }
};

export const queueCenterRoute = {
  id: "queue-center",
  meta: {
    eyebrow: "Operate",
    title: "Queue Center",
    description: "Control workflow, content, media, approval, publishing, and sync queues from one central operations surface."
  },
  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";
    renderQueueCenter(context, state, projectName);
  }
};

export const jobMonitorRoute = {
  id: "job-monitor",
  meta: {
    eyebrow: "Operate",
    title: "Job Monitor",
    description: "Track running jobs, failures, retries, health state, and execution logs across workflows, media, and publishing."
  },
  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";
    renderJobMonitor(context, state, projectName);
  }
};

export const notificationCenterRoute = {
  id: "notification-center",
  meta: {
    eyebrow: "Operate",
    title: "Notification Center",
    description: "Review sync failures, pending approvals, publish events, provider disconnects, claim risks, and workflow completion alerts."
  },
  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";
    renderNotificationCenter(context, state, projectName);
  }
};
