# PHASE 3Y.1 — Task Center Raw Evidence

## True source file
Task Center source: public/control-center/pages/operations-centers.js

## Operations Centers JS size
    2073 public/control-center/pages/operations-centers.js

## Task Center route / render / handlers
1:import { getSharedHandoff } from "../shared-context.js";
2:const taskSessions = new Map();
46:  if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
428:function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
471:        <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
479:function renderTaskCenterLayout({
501:    : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";
507:      `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
536:            <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
586:                    <strong>${escapeHtml(item.assignee || item.owner || "-")}</strong>
587:                    <span>${escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
606:            ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
622:                    { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
623:                    { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
644:                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
646:                <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
650:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (deferred: mutation safety pass)</button>
685:function renderTaskCenter(context, state, projectName) {
692:  const session = ensureSession(taskSessions, projectName, {
707:  items = filterBySearch(items, session.search, ["title", "description", "owner", "assignee", "service_domain"]);
718:  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);
721:  root.innerHTML = renderTaskCenterLayout({
733:  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
735:    if (context.fetchProjectTaskCenter && projectName) {
739:      context.fetchProjectTaskCenter(projectName)
745:          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
758:  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", refreshTaskCenter);
759:  root.querySelector("#taskCenterRefreshBtnRail")?.addEventListener("click", refreshTaskCenter);
760:  root.querySelector("#taskCenterCopySummaryBtn")?.addEventListener("click", async () => {
777:  root.querySelector("#taskCenterCopyHandoffBtn")?.addEventListener("click", async () => {
879:          <td>${escapeHtml(item.assignee || "-")}</td>
939:              <input id="queueCenterSearch" class="command-input" type="text" placeholder="Search queues, items, assignees..." value="${escapeHtml(session.search)}">
972:                    { label: "Assignee", value: selectedItem.assignee || "-" },
1055:  items = filterBySearch(items, session.search, ["title", "assignee", "queue_type", "status"]);
1187:            <p class="std-context-description">Track running, completed, and failed execution across workflows, media, and publishing for ${escapeHtml(projectLabel)}.</p>
1191:              <span class="std-context-chip"><span>Completed</span><strong>${escapeHtml(formatCount(jobMonitor.completed_count))}</strong></span>
1223:              { value: "completed", label: "Completed", count: formatCount(jobMonitor.completed_count) }
1747:export const taskCenterRoute = {
1761:    renderTaskCenter(context, context.getState(), projectName);
1765:      if (!projectName || !context.fetchProjectTaskCenter) return;
1766:      context.fetchProjectTaskCenter(projectName)
1771:          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
1961:      description: "Monitor job status, failures, completed runs, and runtime signals.",

## Relevant Task Center source ranges

### Helper / prompts / context
import { getSharedHandoff } from "../shared-context.js";
const taskSessions = new Map();
const queueSessions = new Map();
const jobSessions = new Map();
const notificationSessions = new Map();

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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
      },
      {
        label: "Explain owner workload",
        preview: "Explain workload concentration by owner and likely bottlenecks.",
        prompt: `Review owner workload in Task Center for ${projectLabel}. Explain concentration risk, likely bottlenecks, and redistribution recommendations for the next cycle.`
      },
      {
        label: "Identify overdue risk",
        preview: "Identify highest-risk overdue items and likely downstream impact.",
        prompt: `Identify overdue task risk for ${projectLabel}. Rank the most critical overdue items and explain likely downstream execution impact if unresolved.`
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

### Task Center layout
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}


function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
  if (!incomingHandoff) return "";

  const source = asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown");
  const title = asString(
    incomingHandoff.title ||
    incomingHandoff.summary ||
    incomingHandoff.payload?.title ||
    incomingHandoff.payload?.summary ||
    "Incoming task handoff"
  );
  const description = asString(
    incomingHandoff.description ||
    incomingHandoff.payload?.description ||
    incomingHandoff.payload?.handoff_intent ||
    incomingHandoff.payload?.prompt ||
    "Review-only handoff prepared by another MH-OS surface."
  );
  const createdAt = asString(incomingHandoff.created_at || incomingHandoff.generatedAt || incomingHandoff.timestamp || "");

  return `
    <section class="panel ops-incoming-handoff mhos-clean-surface">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Incoming Handoff</div>
          <h3>Incoming Task Handoff</h3>
          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically.</p>
        </div>
        <span class="card-badge warning">Review-only</span>
      </div>
      <div class="ops-detail-stack">
        <div class="ops-detail-summary">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(description)}</p>
        </div>
        ${renderOpsDetailRows([
          { label: "Source", value: titleCase(source) },
          { label: "Destination", value: "Task Center" },
          { label: "Status", value: "Review-only intake" },
          { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
        ], escapeHtml)}
      </div>
      <div class="ops-action-row">
        <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
        <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace</button>
      </div>
    </section>
  `;
}


function renderTaskCenterLayout({
  context,
  projectName,
  taskCenter,
  session,
  items,
  selectedItem,
  filters,
  prompts,
  incomingHandoff
}) {
  const escapeHtml = context.escapeHtml;
  const projectLabel = projectName || "No project selected";
  const hasFilters = Boolean(
    asString(session.search).trim() ||
    session.focus !== "all" ||
    session.priority !== "all" ||
    session.owner !== "all" ||
    session.source !== "all"
  );
  const emptyText = hasFilters
    ? "No tasks match the current filters."
    : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";

  const selectedSummary = selectedItem
    ? [
      selectedItem.title || "Task",
      selectedItem.description || "No description.",
      `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
      `Due: ${formatDateTime(selectedItem.due_at)}`,
      `Priority: ${titleCase(selectedItem.priority || "normal")}`,
      `Status: ${titleCase(selectedItem.status || "open")}`
    ].join("\n")
    : "No task is selected.";

  const showLoadingState = Boolean(session.isLoading);

  return `
    <section class="page is-active" data-page="task-center">
      <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">
        <section class="std-context-ribbon">
          <div class="std-context-main">
            <div class="std-context-line">
              <span class="std-context-eyebrow">TASK CENTER</span>
              <h3 class="std-context-title">Task Center</h3>
            </div>
            <p class="std-context-description">Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
            <div class="std-context-metrics" aria-label="Task Center metrics">
              <span class="std-context-chip"><span>Total</span><strong>${escapeHtml(formatCount(taskCenter.total))}</strong></span>
              <span class="std-context-chip"><span>Open</span><strong>${escapeHtml(formatCount(taskCenter.open_count))}</strong></span>
              <span class="std-context-chip is-warning"><span>Blocked</span><strong>${escapeHtml(formatCount(taskCenter.blocked_count))}</strong></span>
              <span class="std-context-chip is-danger"><span>Overdue</span><strong>${escapeHtml(formatCount(taskCenter.overdue_count))}</strong></span>
              <span class="std-context-chip is-warning"><span>Due Soon</span><strong>${escapeHtml(formatCount(taskCenter.due_soon_count))}</strong></span>
            </div>
          </div>
          <div class="std-context-actions">
            <span class="card-badge neutral">Project: ${escapeHtml(projectLabel)}</span>
            <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
          </div>
        </section>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "System Runtime",
          title: "System Signal",
          description: "Supporting cross-center health and risk signal.",
          badge: "Supporting context"
        })}

        <div class="ops-layout-grid">
          <article class="panel ops-main-column mhos-clean-stack">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Main View</div>
                <h3>Execution backlog</h3>
                <p>Filter by focus, owner, source, and priority to inspect task risk quickly.</p>
              </div>
              <span class="card-badge ${showLoadingState ? "warning" : "neutral"}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
            </div>

            ${renderOpsFocusTabs([
              { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
              { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
              { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
              { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
              { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
            ], session.focus, escapeHtml)}

            <div class="ops-toolbar">
              <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${escapeHtml(session.search)}">
              <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, escapeHtml, "All priorities")}</select>
              <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, escapeHtml, "All owners")}</select>
              <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, escapeHtml, "All sources")}</select>
            </div>

            ${session.errorMessage ? `<div class="error-state" aria-live="assertive">${escapeHtml(session.errorMessage)}</div>` : ""}

            ${renderOpsTable(
              ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
              items.map((item) => `
                <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
                  <td>
                    <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
                      <strong>${escapeHtml(item.title || "Task")}</strong>
                      <span>${escapeHtml(item.description || item.service_domain || "-")}</span>
                    </button>
                  </td>
                  <td>
                    <strong>${escapeHtml(item.assignee || item.owner || "-")}</strong>
                    <span>${escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
                  </td>
                  <td>
                    <strong>${escapeHtml(formatDateTime(item.due_at))}</strong>
                    <span class="card-badge ${badgeTone(item.due_state)}">${escapeHtml(titleCase(item.due_state || "unscheduled"))}</span>
                  </td>
                  <td><span class="card-badge ${badgeTone(item.priority)}">${escapeHtml(titleCase(item.priority || "normal"))}</span></td>
                  <td>${escapeHtml(titleCase(item.source_page || "-"))}</td>
                  <td>${escapeHtml(item.linked_entity?.label || item.linked_entity?.entity_type || "-")}</td>
                  <td><span class="card-badge ${badgeTone(item.status)}">${escapeHtml(titleCase(item.status || "open"))}</span></td>
                  <td>${renderRouteAction(item, escapeHtml)}</td>
                </tr>
              `),
              emptyText,
              escapeHtml
            )}
          </article>

          <aside class="ops-right-rail mhos-clean-stack">
            ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
            <section class="panel ops-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Selected Task</div>
                  <h3>${escapeHtml(selectedItem?.title || "Select a task")}</h3>
                  <p>${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and execution context." : "Choose a task in the table to inspect details.")}</p>
                </div>
              </div>
              ${selectedItem ? `
                <div class="ops-detail-stack">
                  <div class="ops-detail-summary">
                    <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
                    <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
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
                  ], escapeHtml)}
                </div>
              ` : `<div class="empty-box">No task is selected.</div>`}
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Action Panel</div>
                  <h3>Task actions</h3>
                  <p>Active actions are safe and non-destructive. Mutation actions remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
                ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Linked Work") : ""}
                <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (deferred: mutation safety pass)</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (deferred: mutation safety pass)</button>
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
    <textarea id="taskCenterSummaryBuffer" hidden>${escapeHtml(selectedSummary)}</textarea>
  `;
}

function renderTaskCenter(context, state, projectName) {
  const root = context.$("pageRoot");
  if (!root) return;

  const ops = asObject(state.data.operations);
  const taskCenter = asObject(ops.task_center);

### Task Center render and bindings
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
    selectedKey: "",
    isLoading: false,
    errorMessage: ""
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
  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);


  root.innerHTML = renderTaskCenterLayout({
    context,
    projectName,
    taskCenter,
    session,
    items,
    selectedItem,
    filters,
    prompts,
    incomingHandoff
  });

  const rerender = () => renderTaskCenter(context, context.getState(), projectName);
  const refreshTaskCenter = () => {
    if (context.fetchProjectTaskCenter && projectName) {
      session.isLoading = true;
      session.errorMessage = "";
      rerender();
      context.fetchProjectTaskCenter(projectName)
        .then((liveData) => {
          session.isLoading = false;
          if (!liveData) return;
          const ops = asObject(context.getState().data.operations);
          ops.task_center = liveData;
          renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
        })
        .catch((error) => {
          session.isLoading = false;
          session.errorMessage = `Task Center: ${error?.message || "Failed to refresh."}`;
          rerender();
          context.showError?.(session.errorMessage);
        });
    } else {
      session.errorMessage = "";
      context.reloadProjectData?.(projectName);
    }
  };
  root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", refreshTaskCenter);
  root.querySelector("#taskCenterRefreshBtnRail")?.addEventListener("click", refreshTaskCenter);
  root.querySelector("#taskCenterCopySummaryBtn")?.addEventListener("click", async () => {
    const buffer = root.querySelector("#taskCenterSummaryBuffer");
    const text = buffer?.value || "No task is selected.";
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        buffer?.focus();
        buffer?.select();
        document.execCommand("copy");
      }
      context.showMessage?.("Task summary copied.");
    } catch (_error) {
      context.showError?.("Failed to copy task summary.");
    }
  });

  root.querySelector("#taskCenterCopyHandoffBtn")?.addEventListener("click", async () => {
    const text = incomingHandoff
      ? [
          "Incoming Task Handoff",
          `Source: ${asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown")}`,
          `Title: ${asString(incomingHandoff.title || incomingHandoff.summary || incomingHandoff.payload?.title || incomingHandoff.payload?.summary || "Incoming task handoff")}`,
          `Summary: ${asString(incomingHandoff.description || incomingHandoff.payload?.description || incomingHandoff.payload?.handoff_intent || incomingHandoff.payload?.prompt || "Review-only handoff.")}`,
          "Status: Review-only intake"
        ].join("\n")
      : "No incoming task handoff.";

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const buffer = root.querySelector("#taskCenterSummaryBuffer");
        if (buffer) {
          buffer.value = text;
          buffer.focus();
          buffer.select();
          document.execCommand("copy");
        }
      }
      context.showMessage?.("Incoming handoff summary copied.");
    } catch (_error) {
      context.showError?.("Failed to copy incoming handoff summary.");
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

function renderQueueCenterLayout({
  context,
  projectName,
  queueCenter,
  session,
  items,
  selectedItem,
  queueCounts,
  prompts

### Route export
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

### Operations overview task references
  if (!root) return;

  const state = typeof context.getState === "function" ? context.getState() : {};
  const projectName = asString(state.activeProject || state.projectName || state.currentProject || "current project");
  const operations = asObject(asObject(state.data).operations);

  const taskCount = asArray(operations.tasks?.items || operations.tasks).length;
  const queueCount = asArray(operations.queue?.items || operations.queue).length;
  const jobCount = asArray(operations.jobs?.items || operations.jobs).length;
  const notificationCount = asArray(operations.notifications?.items || operations.notifications).length;

  const centers = [
    {
      route: "task-center",
      title: "Task Center",
      kicker: "Execution",
      count: taskCount,
      description: "Review generated tasks, owners, priorities, and execution readiness.",
      action: "Open Task Center"
    },
    {
      route: "queue-center",
      title: "Queue Center",
      kicker: "Operations Queue",
      count: queueCount,
      description: "Inspect queued jobs, waiting work, and operational pressure.",
      action: "Open Queue Center"
    },
    {
      route: "job-monitor",
      title: "Job Monitor",
      kicker: "Runtime",
      count: jobCount,
      description: "Monitor job status, failures, completed runs, and runtime signals.",
      action: "Open Job Monitor"
    },
    {
      route: "notification-center",
      title: "Notification Center",
      kicker: "Signals",
      count: notificationCount,
      description: "Review notifications, warnings, approvals, and attention signals.",
      action: "Open Notifications"
    }
  ];

  root.innerHTML = `
    <section class="page is-active" data-page="operations-centers">
      <div class="ops-workspace">
        <div class="std-context-ribbon">
          <div>
            <span class="std-context-eyebrow">Operations Command Layer</span>
            <h2>Operations Centers</h2>
            <p class="std-context-description">A unified entry point for execution, queues, runtime jobs, and operational notifications for ${context.escapeHtml(projectName)}.</p>
          </div>
          <div class="std-context-actions">
            <span class="std-context-chip"><span>Tasks</span><strong>${context.escapeHtml(formatCount(taskCount))}</strong></span>
            <span class="std-context-chip"><span>Queue</span><strong>${context.escapeHtml(formatCount(queueCount))}</strong></span>
            <span class="std-context-chip"><span>Jobs</span><strong>${context.escapeHtml(formatCount(jobCount))}</strong></span>
            <span class="std-context-chip"><span>Signals</span><strong>${context.escapeHtml(formatCount(notificationCount))}</strong></span>
          </div>
        </div>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "Operations",
          title: "Execution Overview",
          description: "Use this page as the routing hub from AI Team drafts, workflows, tasks, and runtime signals into the correct operations workspace.",
          badge: "Composite route"
        })}

        <div class="ops-layout-grid">
          <div class="ops-main-column">
            <section class="panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Command Handoff</div>
                  <h3>Choose the operational surface</h3>
                  <p>AI Team can prepare drafts, tasks, workflows, and handoffs. This overview routes the work to the correct operations center for review and monitoring.</p>
                </div>
              </div>

              <div class="ops-runtime-signal-grid">
                ${centers.map((center) => `
                  <article class="ops-runtime-signal">
                    <span>${context.escapeHtml(center.kicker)}</span>
                    <strong>${context.escapeHtml(center.title)}</strong>
                    <small>${context.escapeHtml(center.description)}</small>
                    <span class="card-badge neutral">${context.escapeHtml(formatCount(center.count))}</span>
                    <div class="ops-action-row">
                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
                        ${context.escapeHtml(center.action)}
                      </button>
                    </div>
                  </article>
                `).join("")}
              </div>
            </section>
          </div>

          <aside class="ops-right-rail">
            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Team Connection</div>
                  <h3>Operations Lead handoff</h3>
                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
              </div>
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Safety</div>
                  <h3>Review before execution</h3>
                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>
                </div>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>
              </div>
            </section>
          </aside>
        </div>
      </div>

## API task center / task functions
1595:export async function createProjectTask(projectName, payload = {}) {
1601:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
1608:export async function listProjectTasks(projectName, limit) {
1615:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
1616:    "Failed to load project tasks"
1951:export async function fetchProjectTaskCenter(projectName) {
1957:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,

## Backend task center / task routes

## Cross-page Task Center references
public/control-center/pages/workflows.js:891:        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Review Handoff</button>
public/control-center/pages/workflows.js:1217:  createProjectTask,
public/control-center/pages/workflows.js:1549:        destination_page: "task-center",
public/control-center/pages/workflows.js:1551:        summary: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1552:        description: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1569:      setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:1570:      showMessage?.("Task handoff prepared for review in Task Center.");
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:1891:          title: "Create Task / Handoff",
public/control-center/pages/workflows.js:2068:                <button id="wfLightTasksBtn" class="btn btn-ghost" type="button">Open Task Center</button>
public/control-center/pages/workflows.js:2122:                      <p class="mhos-destination-meta"><strong>Type</strong> task review handoff</p>
public/control-center/pages/workflows.js:2127:                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>
public/control-center/pages/workflows.js:2303:            destination_page: "task-center",
public/control-center/pages/workflows.js:2305:            summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2306:            description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2315:          setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2318:          stateModel.lastStatusText = "Task Center opened for workflow handoff and tracking.";
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/workflows.js:2326:          if (route === "task-center") {
public/control-center/pages/workflows.js:2329:              destination_page: "task-center",
public/control-center/pages/workflows.js:2331:              summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2332:              description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2341:            setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2344:          if (route !== "task-center") stateModel.openedDestination = true;
public/control-center/pages/ai-command.js:251:		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
public/control-center/pages/ai-command.js:1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1370:		"task-center": "Task Center",
public/control-center/pages/ai-command.js:1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:2356:	"task-center": "Task Center",
public/control-center/pages/ai-command.js:2378:	"task-center": "operations",
public/control-center/pages/ai-command.js:2412:	tasks: "task-center",
public/control-center/pages/ai-command.js:3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
public/control-center/pages/media-studio-workspace.js:5:  createProjectTask,
public/control-center/pages/media-studio-workspace.js:2506:        <button id="mediaCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
public/control-center/pages/media-studio-workspace.js:3202:          await createProjectTask(backendProjectName, {
public/control-center/pages/media-studio-workspace.js:3225:        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
public/control-center/pages/content-studio-workspace.js:4:  createProjectTask,
public/control-center/app.js:57:  createProjectTask,
public/control-center/app.js:2097:      createProjectTask,
public/control-center/index.html:18:  <link rel="stylesheet" href="./styles/09-operations-centers.css?v=20260511-task-center-layout-1">
public/control-center/index.html:136:            <button class="nav-item" data-route="task-center" data-page="task-center" type="button">Task Center</button>
