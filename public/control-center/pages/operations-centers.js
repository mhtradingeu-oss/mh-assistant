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

function getOpsItemKey(item, index, prefix = "item") {
  return asString(
    item?.id ||
    item?.task_id ||
    item?.job_id ||
    item?.queue_item_id ||
    item?.notification_id ||
    item?.title ||
    `${prefix}-${index}`
  );
}

function savePromptToQuickCommand(context, prompt) {
  const input = context.$?.("quickCommandInput");
  if (input) {
    input.value = prompt;
  }
}

function bindOpsFocusButtons(root, onChange) {
  Array.from(root.querySelectorAll("[data-ops-focus]")).forEach((button) => {
    button.onclick = () => {
      onChange(button.getAttribute("data-ops-focus") || "all");
    };
  });
}

function bindOpsSelectionButtons(root, onSelect) {
  Array.from(root.querySelectorAll("[data-ops-select]")).forEach((button) => {
    button.onclick = () => {
      onSelect(button.getAttribute("data-ops-select") || "");
    };
  });
}

function bindOpsAssistantButtons(root, context, prompts) {
  Array.from(root.querySelectorAll("[data-ops-ai-open]")).forEach((button) => {
    button.onclick = () => {
      context.navigateTo("ai-command");
      context.showMessage?.("Opened AI Command.");
    };
  });

  Array.from(root.querySelectorAll("[data-ops-ai-prompt]")).forEach((button) => {
    button.onclick = () => {
      const index = Number(button.getAttribute("data-ops-ai-prompt"));
      const prompt = prompts[index];
      if (!prompt) return;
      savePromptToQuickCommand(context, prompt.prompt);
      context.navigateTo("ai-command");
      context.showMessage?.("Operations prompt added to AI Command.");
    };
  });
}

function renderOpsFocusTabs(tabs, currentValue, escapeHtml) {
  return `
    <div class="ops-focus-tabs">
      ${tabs.map((tab) => `
        <button
          class="ops-focus-tab${tab.value === currentValue ? " is-active" : ""}"
          type="button"
          data-ops-focus="${escapeHtml(tab.value)}"
        >
          <strong>${escapeHtml(tab.label)}</strong>
          <span>${escapeHtml(String(tab.count))}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderOpsDetailRows(rows, escapeHtml) {
  return `
    <div class="ops-detail-grid">
      ${rows.map((row) => `
        <div class="ops-detail-card">
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(asString(row.value || "-"))}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function buildOpsAssistantPrompts(pageKey, projectName, selectedItem, focusLabel) {
  const projectLabel = projectName || "this project";
  const itemLabel = asString(selectedItem?.title || selectedItem?.name || selectedItem?.message || "the selected item");

  if (pageKey === "task-center") {
    return [
      {
        label: "Prioritize backlog",
        preview: "Review the current task backlog and identify the highest-impact next work.",
        prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
      },
      {
        label: "Unblock selected task",
        preview: "Explain how to unblock the current task and who should act next.",
        prompt: `Review ${itemLabel} in Task Center for ${projectLabel}. Explain what is blocking progress, who should act next, and the fastest unblock path.`
      },
      {
        label: "Summarize execution risk",
        preview: "Highlight where task load or due-state suggests operational risk.",
        prompt: `Summarize execution risk in Task Center for ${projectLabel}. Focus on overdue, due soon, blocked, and ownership concentration risk.`
      }
    ];
  }

  if (pageKey === "queue-center") {
    return [
      {
        label: "Triage queue pressure",
        preview: "Identify which queue needs attention first and why.",
        prompt: `Review Queue Center for ${projectLabel}. Which queue needs attention first, why, and what should be routed next?`
      },
      {
        label: "Review selected queue item",
        preview: "Explain what the selected queue item likely needs next.",
        prompt: `Review ${itemLabel} in Queue Center for ${projectLabel}. Explain what it likely needs next and which workspace should own it.`
      },
      {
        label: "Find throughput blockers",
        preview: "Surface recurring queue patterns slowing execution.",
        prompt: `Analyze Queue Center for ${projectLabel} with focus on ${focusLabel}. Identify throughput blockers, queue bottlenecks, and the next operational adjustments.`
      }
    ];
  }

  if (pageKey === "job-monitor") {
    return [
      {
        label: "Triage failures",
        preview: "Summarize failure risk and what to inspect first.",
        prompt: `Review Job Monitor for ${projectLabel}. Prioritize failures, retry risk, and health issues, then explain what should be inspected first.`
      },
      {
        label: "Inspect selected job",
        preview: "Explain what the selected job status implies operationally.",
        prompt: `Review ${itemLabel} in Job Monitor for ${projectLabel}. Explain what the current job state implies, what likely happened, and what should be checked next.`
      },
      {
        label: "Summarize job health",
        preview: "Assess execution health across workflows, media, and publishing jobs.",
        prompt: `Summarize current execution health for ${projectLabel} across workflows, media, and publishing jobs. Highlight failure clusters, retry patterns, and risk areas.`
      }
    ];
  }

  return [
    {
      label: "Rank alert urgency",
      preview: "Sort current notifications by severity and action urgency.",
      prompt: `Review Notification Center for ${projectLabel}. Rank current alerts by urgency, explain what matters most, and identify what should be handled first.`
    },
    {
      label: "Review selected alert",
      preview: "Explain what the selected alert means and where to go next.",
      prompt: `Review ${itemLabel} in Notification Center for ${projectLabel}. Explain what it means, what risk it creates, and which page or team should act next.`
    },
    {
      label: "Summarize operational signal",
      preview: "Turn the current notification stream into a short operations summary.",
      prompt: `Summarize the current operational notification signal for ${projectLabel} with focus on ${focusLabel}. Highlight approvals, provider health, publishing events, and urgent follow-up.`
    }
  ];
}


function readOpsState(context) {
  const state = typeof context.getState === "function" ? context.getState() : {};
  return asObject(asObject(state.data).operations);
}

function buildExecutiveRuntimeSignals(context) {
  const ops = readOpsState(context);
  const taskCenter = asObject(ops.task_center);
  const queueCenter = asObject(ops.queue_center);
  const jobMonitor = asObject(ops.job_monitor);
  const notificationCenter = asObject(ops.notification_center);

  const activeTasks = Number(taskCenter.active_count || taskCenter.open_count || 0);
  const queueItems = Number(queueCenter.active_count || queueCenter.total_active || asArray(queueCenter.items).length || 0);
  const failedJobs = Number(jobMonitor.failed_count || 0);
  const runningJobs = Number(jobMonitor.running_count || 0);
  const criticalAlerts = Number(notificationCenter.critical_count || 0);
  const unreadNotifications = Number(notificationCenter.unread_count || 0);

  const providerAlerts = asArray(notificationCenter.provider_disconnect_alerts).length;
  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).length;
  const publishAlerts = asArray(notificationCenter.publish_alerts).length;
  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).length;

  const runtimeTone = failedJobs || criticalAlerts ? "danger" : runningJobs || queueItems || activeTasks ? "warning" : "success";
  const runtimeLabel = failedJobs || criticalAlerts
    ? "Needs attention"
    : runningJobs || queueItems || activeTasks
      ? "Active"
      : "Healthy";

  return [
    {
      label: "Runtime",
      value: runtimeLabel,
      helper: failedJobs || criticalAlerts ? "Failures or critical alerts detected" : "No critical runtime issue detected",
      tone: runtimeTone,
      route: "job-monitor"
    },
    {
      label: "Queue Pressure",
      value: formatCount(queueItems),
      helper: "Active queue items",
      tone: queueItems ? "warning" : "success",
      route: "queue-center"
    },
    {
      label: "Failed Jobs",
      value: formatCount(failedJobs),
      helper: "Execution jobs needing review",
      tone: failedJobs ? "danger" : "success",
      route: "job-monitor"
    },
    {
      label: "Critical Alerts",
      value: formatCount(criticalAlerts),
      helper: "Highest priority notifications",
      tone: criticalAlerts ? "danger" : "success",
      route: "notification-center"
    },
    {
      label: "Approvals",
      value: formatCount(approvalAlerts),
      helper: "Pending approval signals",
      tone: approvalAlerts ? "warning" : "success",
      route: "notification-center"
    },
    {
      label: "Publishing",
      value: formatCount(publishAlerts),
      helper: "Publishing alerts",
      tone: publishAlerts ? "warning" : "success",
      route: "publishing"
    },
    {
      label: "Providers",
      value: formatCount(providerAlerts),
      helper: "Disconnected provider alerts",
      tone: providerAlerts ? "warning" : "success",
      route: "integrations"
    },
    {
      label: "Claim Risk",
      value: formatCount(claimAlerts),
      helper: "Compliance review signals",
      tone: claimAlerts ? "danger" : "success",
      route: "governance"
    },
    {
      label: "Inbox",
      value: formatCount(unreadNotifications),
      helper: "Unread operational notifications",
      tone: unreadNotifications ? "warning" : "success",
      route: "notification-center"
    }
  ];
}

function renderExecutiveRuntimeStrip(context) {
  const signals = buildExecutiveRuntimeSignals(context);

  return `
    <section class="panel ops-executive-strip">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">0. Executive Runtime</div>
          <h3>Operations Command Signal</h3>
          <p>Cross-center runtime health, queue pressure, failures, publishing, governance, and provider signals.</p>
        </div>
        <span class="card-badge neutral">Live context</span>
      </div>
      <div class="ops-runtime-signal-grid">
        ${signals.map((signal) => `
          <button class="ops-runtime-signal" type="button" data-ops-route="${context.escapeHtml(signal.route)}" data-ops-label="${context.escapeHtml(signal.label)}">
            <span class="card-badge ${context.escapeHtml(signal.tone)}">${context.escapeHtml(signal.label)}</span>
            <strong>${context.escapeHtml(asString(signal.value))}</strong>
            <small>${context.escapeHtml(signal.helper)}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}


function renderOperationsScaffold({
  context,
  pageKey,
  title,
  overviewBadge,
  overviewCopy,
  metrics,
  focusTabs,
  activeFocus,
  focusCopy,
  toolbar,
  listTitle,
  listCopy,
  listBadge,
  listContent,
  detailsTitle,
  detailsCopy,
  detailsContent,
  actionsTitle,
  actionsCopy,
  actionsContent,
  assistantCopy,
  assistantPrompts
}) {
  return `
    <section class="page is-active" data-page="${context.escapeHtml(pageKey)}">
      <div class="ops-shell ops-workspace">
        ${renderExecutiveRuntimeStrip(context)}
        <section class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">1. Operations Overview</div>
              <h3>${context.escapeHtml(title)}</h3>
              <p>${context.escapeHtml(overviewCopy)}</p>
            </div>
            <span class="card-badge neutral">${context.escapeHtml(overviewBadge)}</span>
          </div>
          ${renderMetricCards(metrics, context.escapeHtml)}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">2. Current Focus Tab</div>
              <h3>${context.escapeHtml(title)} focus</h3>
              <p>${context.escapeHtml(focusCopy)}</p>
            </div>
          </div>
          ${renderOpsFocusTabs(focusTabs, activeFocus, context.escapeHtml)}
        </section>

        <div class="ops-workspace-grid">
          <article class="panel panel-span-2">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">3. Item List / Table</div>
                <h3>${context.escapeHtml(listTitle)}</h3>
                <p>${context.escapeHtml(listCopy)}</p>
              </div>
              <span class="card-badge neutral">${context.escapeHtml(listBadge)}</span>
            </div>
            ${toolbar}
            ${listContent}
          </article>

          <aside class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">4. Selected Item Details</div>
                <h3>${context.escapeHtml(detailsTitle)}</h3>
                <p>${context.escapeHtml(detailsCopy)}</p>
              </div>
            </div>
            ${detailsContent}
          </aside>
        </div>

        <div class="ops-resolution-grid">
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">5. Action / Resolution Area</div>
                <h3>${context.escapeHtml(actionsTitle)}</h3>
                <p>${context.escapeHtml(actionsCopy)}</p>
              </div>
            </div>
            ${actionsContent}
          </section>

          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">6. Operations AI Assistant</div>
                <h3>Operations AI Assistant</h3>
                <p>${context.escapeHtml(assistantCopy)}</p>
              </div>
            </div>
            <div class="ops-action-row">
              <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI Command</button>
            </div>
            <div class="quick-actions">
              ${assistantPrompts.map((item, index) => `
                <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
                  <span class="home-action-title">${context.escapeHtml(item.label)}</span>
                  <span class="home-action-meta">${context.escapeHtml(item.preview)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        </div>
      </div>
    </section>
  `;
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
    focus: "all",
    priority: "all",
    owner: "all",
    source: "all",
    search: "",
    selectedKey: ""
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

  root.innerHTML = renderOperationsScaffold({
    context,
    pageKey: "task-center",
    title: "Task Center",
    overviewBadge: `${formatCount(taskCenter.total)} durable tasks`,
    overviewCopy: "Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up.",
    metrics: [
      { label: "Total Tasks", value: formatCount(taskCenter.total), helper: "Durable operating backlog" },
      { label: "Open", value: formatCount(taskCenter.open_count), helper: "Requires execution" },
      { label: "Blocked", value: formatCount(taskCenter.blocked_count), helper: "Needs intervention" },
      { label: "Overdue", value: formatCount(taskCenter.overdue_count), helper: "Past due date" }
    ],
    focusTabs: [
      { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
      { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
      { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
      { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
      { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
    ],
    activeFocus: session.focus,
    focusCopy: "Switch between the most urgent task states without changing route context.",
    toolbar: `
      <div class="ops-toolbar">
        <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${context.escapeHtml(session.search)}">
        <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, context.escapeHtml, "All priorities")}</select>
        <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, context.escapeHtml, "All owners")}</select>
        <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, context.escapeHtml, "All sources")}</select>
      </div>
    `,
    listTitle: "Execution backlog",
    listCopy: "Use the list to browse current task load, then inspect one selected task in detail.",
    listBadge: `${items.length} filtered`,
    listContent: renderOpsTable(
      ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
      items.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${context.escapeHtml(item._opsKey)}">
              <strong>${context.escapeHtml(item.title || "Task")}</strong>
              <span>${context.escapeHtml(item.description || item.service_domain || "-")}</span>
            </button>
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
    ),
    detailsTitle: selectedItem?.title || "Select a task",
    detailsCopy: selectedItem ? "Review owner, due-state, linked work, and current execution context." : "Choose a task from the list to inspect its details.",
    detailsContent: selectedItem ? `
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${context.escapeHtml(selectedItem.title || "Task")}</strong>
          <p>${context.escapeHtml(selectedItem.description || "No task description available.")}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
          { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
          { label: "Due", value: formatDateTime(selectedItem.due_at) },
          { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
          { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
          { label: "Source", value: titleCase(selectedItem.source_page || "-") },
          { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
          { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
        ], context.escapeHtml)}
      </div>
    ` : `<div class="empty-box">${context.escapeHtml("No task is selected.")}</div>`,
    actionsTitle: "Task resolution",
    actionsCopy: "Only use actions that already exist here: refresh the route or open the linked page for the selected task.",
    actionsContent: `
      <div class="ops-action-row">
        <button class="btn btn-primary" type="button" id="taskCenterRefreshBtn">Refresh</button>
        ${selectedItem ? renderRouteAction(selectedItem, context.escapeHtml, "Open Linked Work") : ""}
      </div>
      <div class="ops-mini-list">
        ${asArray(filters.owners).length ? asArray(filters.owners).slice(0, 6).map((owner) => `
          <div class="ops-mini-item">
            <strong>${context.escapeHtml(titleCase(owner.value || "unassigned"))}</strong>
            <span>${context.escapeHtml(`${owner.count} tasks`)}</span>
          </div>
        `).join("") : `<div class="empty-box">${context.escapeHtml("No owners have been assigned yet.")}</div>`}
      </div>
    `,
    assistantCopy: "Use AI to prioritize task load, assess execution risk, or reason through the selected task before leaving the route.",
    assistantPrompts: prompts
  });

  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", () => {
    if (context.fetchProjectTaskCenter && projectName) {
      context.fetchProjectTaskCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.task_center = liveData;
          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => context.showError?.(`Task Center: ${error?.message || "Failed to refresh."}`));
    } else {
      context.reloadProjectData?.(projectName);
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

function renderQueueCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const queueCenter = asObject(asObject(state.data.operations).queue_center);
  const session = ensureSession(queueSessions, projectName, {
    focus: "all",
    status: "all",
    search: "",
    selectedKey: ""
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

  root.innerHTML = renderOperationsScaffold({
    context,
    pageKey: "queue-center",
    title: "Queue Center",
    overviewBadge: `${formatCount(items.length)} visible items`,
    overviewCopy: "Workflow, content, media, approval, publishing, and sync queues aligned into one operational command surface.",
    metrics: queueCounts.slice(0, 4).map((item) => ({
      label: titleCase(item.queue_type || "queue"),
      value: formatCount(item.total),
      helper: `${formatCount(item.active)} active`
    })),
    focusTabs: [
      { value: "all", label: "All Queues", count: formatCount(asArray(queueCenter.items).length) },
      ...asArray(asObject(queueCenter.filters).queue_types).map((item) => ({
        value: asString(item.value),
        label: titleCase(item.value || "queue"),
        count: formatCount(item.count)
      }))
    ],
    activeFocus: session.focus,
    focusCopy: "Switch by queue type while keeping search and status filtering in place.",
    toolbar: `
      <div class="ops-toolbar ops-toolbar-compact">
        <input id="queueCenterSearch" class="command-input" type="text" placeholder="Search queues, items, assignees..." value="${context.escapeHtml(session.search)}">
        <select id="queueCenterStatus" class="sidebar-select">${renderFilterOptions(asObject(queueCenter.filters).statuses, session.status, context.escapeHtml, "All statuses")}</select>
      </div>
    `,
    listTitle: "Queue operations",
    listCopy: "Every durable queue item stays routeable back to the exact page that owns the work.",
    listBadge: `${items.length} filtered`,
    listContent: renderOpsTable(
      ["Queue", "Item", "Assignee", "Priority", "Status", "Updated", "Route"],
      items.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge neutral">${context.escapeHtml(titleCase(item.queue_type || "queue"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${context.escapeHtml(item._opsKey)}">
              <strong>${context.escapeHtml(item.title || "Queue item")}</strong>
              <span>${context.escapeHtml(item.details?.summary || item.entity_type || "-")}</span>
            </button>
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
    ),
    detailsTitle: selectedItem?.title || "Select a queue item",
    detailsCopy: selectedItem ? "Inspect queue type, assignee, priority, and last update." : "Choose a queue item from the table to inspect it.",
    detailsContent: selectedItem ? `
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${context.escapeHtml(selectedItem.title || "Queue item")}</strong>
          <p>${context.escapeHtml(selectedItem.details?.summary || selectedItem.entity_type || "No queue summary available.")}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
          { label: "Assignee", value: selectedItem.assignee || "-" },
          { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
          { label: "Status", value: titleCase(selectedItem.status || "queued") },
          { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
          { label: "Entity", value: selectedItem.entity_type || "-" }
        ], context.escapeHtml)}
      </div>
    ` : `<div class="empty-box">${context.escapeHtml("No queue item is selected.")}</div>`,
    actionsTitle: "Queue resolution",
    actionsCopy: "Use the current queue signal to route work to its owning page or refresh the route data.",
    actionsContent: `
      <div class="ops-action-row">
        <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh</button>
        ${selectedItem ? renderRouteAction(selectedItem, context.escapeHtml, "Open Owner Page") : ""}
      </div>
      <div class="ops-mini-list">
        ${queueCounts.map((item) => `
          <div class="ops-mini-item">
            <strong>${context.escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
            <span>${context.escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
          </div>
        `).join("")}
      </div>
    `,
    assistantCopy: "Use AI to triage queue pressure, explain the selected queue item, or spot throughput blockers before routing work.",
    assistantPrompts: prompts
  });

  const rerender = () => renderQueueCenter(context, context.getState(), projectName);
  root.querySelector("#queueCenterRefreshBtn")?.addEventListener("click", () => {
    if (context.fetchProjectQueueCenter && projectName) {
      context.fetchProjectQueueCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.queue_center = liveData;
          renderQueueCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => context.showError?.(`Queue Center: ${error?.message || "Failed to refresh."}`));
    } else {
      context.reloadProjectData?.(projectName);
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
    focus: "all",
    kind: "all",
    search: "",
    selectedKey: ""
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

  root.innerHTML = renderOperationsScaffold({
    context,
    pageKey: "job-monitor",
    title: "Job Monitor",
    overviewBadge: titleCase(jobMonitor.health_state || "unknown"),
    overviewCopy: "Running, completed, and failed execution across workflows, media generation, and publishing.",
    metrics: [
      { label: "Health State", value: titleCase(jobMonitor.health_state || "unknown"), helper: "Overall execution condition" },
      { label: "Running", value: formatCount(jobMonitor.running_count), helper: "In flight now" },
      { label: "Completed", value: formatCount(jobMonitor.completed_count), helper: "Durably finished" },
      { label: "Failed", value: formatCount(jobMonitor.failed_count), helper: "Needs retries or fixes" }
    ],
    focusTabs: [
      { value: "all", label: "All Jobs", count: formatCount(asArray(jobMonitor.items).length) },
      { value: "running", label: "Running", count: formatCount(jobMonitor.running_count) },
      { value: "failed", label: "Failed", count: formatCount(jobMonitor.failed_count) },
      { value: "completed", label: "Completed", count: formatCount(jobMonitor.completed_count) }
    ],
    activeFocus: session.focus,
    focusCopy: "Switch between the highest-signal execution states without leaving the route.",
    toolbar: `
      <div class="ops-toolbar ops-toolbar-compact">
        <input id="jobMonitorSearch" class="command-input" type="text" placeholder="Search jobs, kinds, owners..." value="${context.escapeHtml(session.search)}">
        <select id="jobMonitorKind" class="sidebar-select">
          ${["all", "workflow", "media", "publishing"].map((value) => `<option value="${context.escapeHtml(value)}"${value === session.kind ? " selected" : ""}>${context.escapeHtml(titleCase(value))}</option>`).join("")}
        </select>
      </div>
    `,
    listTitle: "Execution inventory",
    listCopy: "Browse the job ledger first, then inspect one selected job and the latest execution logs.",
    listBadge: `${items.length} filtered`,
    listContent: renderOpsTable(
      ["Kind", "Job", "Owner", "Retries", "Health", "Status", "Updated", "Route"],
      items.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge neutral">${context.escapeHtml(titleCase(item.kind || "job"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${context.escapeHtml(item._opsKey)}">
              <strong>${context.escapeHtml(item.title || "Job")}</strong>
              <span>${context.escapeHtml(titleCase(item.status || "unknown"))}</span>
            </button>
          </td>
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
    ),
    detailsTitle: selectedItem?.title || "Select a job",
    detailsCopy: selectedItem ? "Review health, retry count, owner, and updated state for the selected job." : "Choose a job from the list to inspect it.",
    detailsContent: selectedItem ? `
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${context.escapeHtml(selectedItem.title || "Job")}</strong>
          <p>${context.escapeHtml(`Kind: ${titleCase(selectedItem.kind || "job")} • Status: ${titleCase(selectedItem.status || "unknown")}`)}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Owner", value: selectedItem.owner || "-" },
          { label: "Kind", value: titleCase(selectedItem.kind || "job") },
          { label: "Retries", value: formatCount(selectedItem.retry_count) },
          { label: "Health", value: titleCase(selectedItem.health_state || "unknown") },
          { label: "Status", value: titleCase(selectedItem.status || "unknown") },
          { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) }
        ], context.escapeHtml)}
      </div>
    ` : `<div class="empty-box">${context.escapeHtml("No job is selected.")}</div>`,
    actionsTitle: "Execution inspection",
    actionsCopy: "Use the current route to refresh data, open the owning page, and review the latest execution logs.",
    actionsContent: `
      <div class="ops-action-row">
        <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh</button>
        ${selectedItem ? renderRouteAction(selectedItem, context.escapeHtml, "Open Job Context") : ""}
      </div>
      <div class="ops-log-list">
        ${asArray(jobMonitor.execution_logs).length ? asArray(jobMonitor.execution_logs).slice(0, 4).map((item) => `
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
    `,
    assistantCopy: "Use AI to triage failures, interpret the selected job, or summarize execution health before leaving Job Monitor.",
    assistantPrompts: prompts
  });

  const rerender = () => renderJobMonitor(context, context.getState(), projectName);
  root.querySelector("#jobMonitorRefreshBtn")?.addEventListener("click", () => {
    if (context.fetchProjectJobMonitor && projectName) {
      context.fetchProjectJobMonitor(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.job_monitor = liveData;
          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => context.showError?.(`Job Monitor: ${error?.message || "Failed to refresh."}`));
    } else {
      context.reloadProjectData?.(projectName);
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
    focus: "all",
    severity: "all",
    search: "",
    selectedKey: ""
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

  root.innerHTML = renderOperationsScaffold({
    context,
    pageKey: "notification-center",
    title: "Notification Center",
    overviewBadge: `${formatCount(baseAlerts.length)} active alerts`,
    overviewCopy: "Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion.",
    metrics: [
      { label: "Active Alerts", value: formatCount(baseAlerts.length), helper: "Current operational signals" },
      { label: "Unread Inbox", value: formatCount(notificationCenter.unread_count), helper: "Durable notifications" },
      { label: "Critical", value: formatCount(notificationCenter.critical_count), helper: "Immediate action" },
      { label: "Approvals", value: formatCount(approvalAlerts.length), helper: "Waiting for decisions" }
    ],
    focusTabs: [
      { value: "all", label: "All Alerts", count: formatCount(baseAlerts.length) },
      { value: "critical", label: "Critical", count: formatCount(notificationCenter.critical_count) },
      { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
      { value: "provider", label: "Provider", count: formatCount(providerAlerts.length) },
      { value: "inbox", label: "Inbox", count: formatCount(inboxList.length) }
    ],
    activeFocus: session.focus,
    focusCopy: "Switch between active alert modes and inbox history while keeping the route intact.",
    toolbar: `
      <div class="ops-toolbar ops-toolbar-compact">
        <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${context.escapeHtml(session.search)}">
        <select id="notificationCenterSeverity" class="sidebar-select">
          ${["all", "critical", "warning", "success", "info"].map((value) => `<option value="${context.escapeHtml(value)}"${value === session.severity ? " selected" : ""}>${context.escapeHtml(titleCase(value))}</option>`).join("")}
        </select>
      </div>
    `,
    listTitle: session.focus === "inbox" ? "Notification history" : "Operational alerts",
    listCopy: session.focus === "inbox" ? "Review durable inbox history and mark notifications as read where supported." : "Review route-aware alerts, then inspect the selected signal in detail.",
    listBadge: `${listItems.length} filtered`,
    listContent: renderOpsTable(
      ["Severity", "Signal", "Source", "Created", "Route"],
      listItems.map((item) => `
        <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
          <td><span class="card-badge ${badgeTone(item.severity)}">${context.escapeHtml(titleCase(item.severity || "info"))}</span></td>
          <td>
            <button class="ops-select-link" type="button" data-ops-select="${context.escapeHtml(item._opsKey)}">
              <strong>${context.escapeHtml(item.title || "Alert")}</strong>
              <span>${context.escapeHtml(item.message || "-")}</span>
            </button>
          </td>
          <td>${context.escapeHtml(titleCase(item.source || item.item_type || "system"))}</td>
          <td>${context.escapeHtml(formatDateTime(item.created_at))}</td>
          <td>${renderRouteAction(item, context.escapeHtml)}</td>
        </tr>
      `),
      "No notifications match the current filters.",
      context.escapeHtml
    ),
    detailsTitle: selectedItem?.title || "Select a notification",
    detailsCopy: selectedItem ? "Review source, severity, timing, and the owning page for the selected signal." : "Choose an alert or inbox item to inspect it.",
    detailsContent: selectedItem ? `
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${context.escapeHtml(selectedItem.title || "Notification")}</strong>
          <p>${context.escapeHtml(selectedItem.message || selectedItem.body || "No notification detail available.")}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Severity", value: titleCase(selectedItem.severity || "info") },
          { label: "Source", value: titleCase(selectedItem.source || selectedItem.item_type || "system") },
          { label: "Created", value: formatDateTime(selectedItem.created_at) },
          { label: "Route", value: selectedItem.route?.route || selectedItem.route || "-" }
        ], context.escapeHtml)}
      </div>
    ` : `<div class="empty-box">${context.escapeHtml("No notification is selected.")}</div>`,
    actionsTitle: "Notification handling",
    actionsCopy: "Use only the real actions available here: refresh, open the owning page, and mark inbox notifications as read when supported.",
    actionsContent: `
      <div class="ops-action-row">
        <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh</button>
        ${selectedItem ? renderRouteAction(selectedItem, context.escapeHtml, "Open Source Page") : ""}
        ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${context.escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
      </div>
      <div class="ops-mini-list">
        <div class="ops-mini-item">
          <strong>${context.escapeHtml("Approval pending")}</strong>
          <span>${context.escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
        </div>
        <div class="ops-mini-item">
          <strong>${context.escapeHtml("Provider health")}</strong>
          <span>${context.escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
        </div>
        <div class="ops-mini-item">
          <strong>${context.escapeHtml("Claim risk")}</strong>
          <span>${context.escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
        </div>
      </div>
    `,
    assistantCopy: "Use AI to rank urgency, interpret the selected signal, or summarize what the current notification stream means operationally.",
    assistantPrompts: prompts
  });

  const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", () => {
    if (context.fetchProjectNotificationCenter && projectName) {
      context.fetchProjectNotificationCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.notification_center = liveData;
          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => context.showError?.(`Notification Center: ${error?.message || "Failed to refresh."}`));
    } else {
      context.reloadProjectData?.(projectName);
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
  meta: {
    eyebrow: "Operate",
    title: "Task Center",
    description: "Manage durable tasks, owners, due dates, priorities, filters, and linked operational entities in one premium execution surface."
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
      context.fetchProjectQueueCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.queue_center = liveData;
          renderQueueCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          context.showError?.(`Queue Center: ${error?.message || "Failed to load live data."}`);
        });
    }

    doFetch();
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

    renderJobMonitor(context, context.getState(), projectName);

    function doFetch() {
      if (!projectName || !context.fetchProjectJobMonitor) return;
      context.fetchProjectJobMonitor(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.job_monitor = liveData;
          renderJobMonitor(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          context.showError?.(`Job Monitor: ${error?.message || "Failed to load live data."}`);
        });
    }

    doFetch();
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

    renderNotificationCenter(context, context.getState(), projectName);

    function doFetch() {
      if (!projectName || !context.fetchProjectNotificationCenter) return;
      context.fetchProjectNotificationCenter(projectName)
        .then((liveData) => {
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.notification_center = liveData;
          renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          context.showError?.(`Notification Center: ${error?.message || "Failed to load live data."}`);
        });
    }

    doFetch();
  }
};
