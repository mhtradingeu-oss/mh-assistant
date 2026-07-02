# T45 — Operations Centers Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/operations-centers.js

## Why This Page Is Next
T44 rebaseline ranked Operations Centers as the highest remaining open frontend risk candidate.

T44 signals:
- Score: 798.7
- Priority: P0
- Lines: 2268
- innerHTML: 5
- Events: 26
- API/write signals: 274
- Authority words: 523
- Confirmations: 1
- Escape evidence: 268

## Purpose
Verify whether Operations Centers:
- performs customer/support/notification actions directly
- creates tasks or handoffs
- sends, resolves, assigns, completes, triggers, or syncs operations
- uses explicit confirmation gates for sensitive actions
- renders dynamic customer/notification/operations content safely
- needs runtime patch or closeout

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 721 | 5 |
| Escape / safe rendering evidence | 15 | 252 |
| Imported/backend API calls | 1 | 263 |
| Customer operations signals | 78 | 81 |
| Notification operations signals | 5 | 184 |
| Task/handoff writes | 1 | 151 |
| Execution/action wording | 1 | 110 |
| Confirmation gates | 1851 | 1 |
| Event handlers | 74 | 28 |
| Storage signals | n/a | 0 |
| Routing/handoff | 1 | 111 |
| Copy defect candidates | 272 | 48 |


## Evidence Zones

### HTML render / innerHTML

```js
  631:                 </div>
  632:               ` : `<div class="empty-box">No task is selected.</div>`}
  633:             </section>
  634: 
  635:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
  636:               <div class="panel-header">
  637:                 <div>
  638:                   <p class="mhos-os-kicker">Action Panel</p>
  639:                   <h3 class="mhos-os-panel-title">Task review actions</h3>
  640:                   <p class="mhos-os-panel-copy">Active actions are refresh, copy, route, and AI guidance only. Task mutations remain deferred and disabled until backend policy and mutation safety checks are approved.</p>
  641:                 </div>
  642:               </div>
  643:               <div class="ops-action-row">
  644:                 <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
  645:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  646:                 <button class="btn btn-secondary" type="button" id="taskCenterCopySummaryBtn">Copy Selected Task Summary</button>
  647:               </div>
  648:               <div class="ops-deferred-list">
  649:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update status (disabled: future mutation safety pass)</button>
  650:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Reassign owner (disabled: future mutation safety pass)</button>
  651:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Change priority (disabled: future mutation safety pass)</button>
  652:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Update due date (disabled: future mutation safety pass)</button>
  653:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete task (disabled: future mutation safety pass)</button>
  654:               </div>
  655:             </section>
  656: 
  657:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
  658:               <div class="panel-header">
  659:                 <div>
  660:                   <p class="mhos-os-kicker">AI Panel</p>
  661:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
  662:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No task creation, owner assignment, status change, approval, publishing, or backend execution is performed.</p>
  663:                 </div>
  664:               </div>
  665:               <div class="ops-action-row">
  666:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Task Context</button>
  667:               </div>
  668:               <div class="quick-actions">
  669:                 ${prompts.map((item, index) => `
  670:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
  671:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
  672:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
  673:                   </button>
  674:                 `).join("")}
  675:               </div>
  676:             </section>
  677:           </aside>
  678:         </div>
  679:       </div>
  680:     </section>
  681:     <textarea id="taskCenterSummaryBuffer" hidden>${escapeHtml(selectedSummary)}</textarea>
  682:   `;
  683: }
  684: 
  685: function renderTaskCenter(context, state, projectName) {
  686:   const root = context.$("pageRoot");
  687:   if (!root) return;
  688: 
  689:   const ops = asObject(state.data.operations);
  690:   const taskCenter = asObject(ops.task_center);
  691:   const filters = asObject(taskCenter.filters);
  692:   const session = ensureSession(taskSessions, projectName, {
  693:     focus: "all",
  694:     priority: "all",
  695:     owner: "all",
  696:     source: "all",
  697:     search: "",
  698:     selectedKey: "",
  699:     isLoading: false,
  700:     errorMessage: ""
  701:   });
  702: 
  703:   let items = asArray(taskCenter.items).map((item, index) => ({
  704:     ...item,
  705:     _opsKey: getOpsItemKey(item, index, "task")
  706:   }));
  707:   items = filterBySearch(items, session.search, ["title", "description", "owner", "assignee", "service_domain"]);
  708:   if (session.focus === "open") items = items.filter((item) => asString(item.status) === "open");
  709:   if (session.focus === "blocked") items = items.filter((item) => asString(item.status) === "blocked");
  710:   if (session.focus === "overdue") items = items.filter((item) => asString(item.due_state) === "overdue");
  711:   if (session.focus === "due_soon") items = items.filter((item) => asString(item.due_state) === "due_soon");
  712:   if (session.priority !== "all") items = items.filter((item) => asString(item.priority) === session.priority);
  713:   if (session.owner !== "all") items = items.filter((item) => asString(item.owner_role) === session.owner);
  714:   if (session.source !== "all") items = items.filter((item) => asString(item.source_page) === session.source);
  715:   const selectedItem = items.find((item) => item._opsKey === session.selectedKey) || items[0] || null;
  716:   session.selectedKey = selectedItem?._opsKey || "";
  717:   const prompts = buildOpsAssistantPrompts("task-center", projectName, selectedItem, titleCase(session.focus || "all"));
  718:   const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);
  719: 
  720: 
  721:   root.innerHTML = renderTaskCenterLayout({
  722:     context,
  723:     projectName,
  724:     taskCenter,
  725:     session,
  726:     items,
  727:     selectedItem,
  728:     filters,
  729:     prompts,
  730:     incomingHandoff
  731:   });
  732: 
  733:   const rerender = () => renderTaskCenter(context, context.getState(), projectName);
  734:   const refreshTaskCenter = () => {
  735:     if (context.fetchProjectTaskCenter && projectName) {
  736:       session.isLoading = true;
  737:       session.errorMessage = "";
  738:       rerender();
  739:       context.fetchProjectTaskCenter(projectName)
  740:         .then((liveData) => {
  741:           session.isLoading = false;
  742:           if (!liveData) return;
  743:           const ops = asObject(context.getState().data.operations);
  744:           ops.task_center = liveData;
  745:           renderTaskCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
  746:         })
  747:         .catch((error) => {
  748:           session.isLoading = false;
  749:           session.errorMessage = `Task Center: ${error?.message || "Failed to refresh."}`;
  750:           rerender();
  751:           context.showError?.(session.errorMessage);
  752:         });
  753:     } else {
  754:       session.errorMessage = "";
  755:       context.reloadProjectData?.(projectName);
  756:     }
  757:   };
  758:   root.querySelector("#taskCenterRefreshBtn")?.addEventListener("click", refreshTaskCenter);
  759:   root.querySelector("#taskCenterRefreshBtnRail")?.addEventListener("click", refreshTaskCenter);
  760:   root.querySelector("#taskCenterCopySummaryBtn")?.addEventListener("click", async () => {
  761:     const buffer = root.querySelector("#taskCenterSummaryBuffer");
  762:     const text = buffer?.value || "No task is selected.";
  763:     try {
  764:       if (navigator?.clipboard?.writeText) {
  765:         await navigator.clipboard.writeText(text);
  766:       } else {
  767:         buffer?.focus();
  768:         buffer?.select();
  769:         document.execCommand("copy");
  770:       }
  771:       context.showMessage?.("Task summary copied.");
  772:     } catch (_error) {
  773:       context.showError?.("Failed to copy task summary.");
  774:     }
  775:   });
  776: 
  777:   root.querySelector("#taskCenterCopyHandoffBtn")?.addEventListener("click", async () => {
  778:     const text = incomingHandoff
  779:       ? [
  780:           "Incoming Review-Only Task Handoff",
  781:           `Source: ${asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown")}`,
  782:           `Title: ${asString(incomingHandoff.title || incomingHandoff.summary || incomingHandoff.payload?.title || incomingHandoff.payload?.summary || "Incoming task handoff")}`,
  783:           `Summary: ${asString(incomingHandoff.description || incomingHandoff.payload?.description || incomingHandoff.payload?.handoff_intent || incomingHandoff.payload?.prompt || "Review-only handoff.")}`,
  784:           "Status: Review-only intake"
  785:         ].join("\n")
  786:       : "No incoming task handoff.";
  787: 
  788:     try {
  789:       if (navigator?.clipboard?.writeText) {
  790:         await navigator.clipboard.writeText(text);
  791:       } else {
  792:         const buffer = root.querySelector("#taskCenterSummaryBuffer");
  793:         if (buffer) {
  794:           buffer.value = text;
  795:           buffer.focus();
  796:           buffer.select();
  797:           document.execCommand("copy");
  798:         }
  799:       }
  800:       context.showMessage?.("Incoming handoff summary copied.");
  801:     } catch (_error) {
  802:       context.showError?.("Failed to copy incoming handoff summary.");
  803:     }
  804:   });
  805:   bindOpsFocusButtons(root, (focus) => {
  806:     session.focus = focus || "all";
  807:     rerender();
  808:   });
  809:   bindOpsSelectionButtons(root, (selectedKey) => {
  810:     session.selectedKey = selectedKey;
  811:     rerender();
```

### Escape / safe rendering evidence

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
   92:   );
   93: }
   94: 
   95: function savePromptToQuickCommand(context, prompt) {
   96:   const input = context.$?.("quickCommandInput");
   97:   if (input) {
   98:     input.value = prompt;
   99:   }
  100: }
  101: 
  102: function bindOpsFocusButtons(root, onChange) {
  103:   Array.from(root.querySelectorAll("[data-ops-focus]")).forEach((button) => {
  104:     button.onclick = () => {
  105:       onChange(button.getAttribute("data-ops-focus") || "all");
```

### Imported/backend API calls

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
```

### Customer operations signals

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
   92:   );
   93: }
   94: 
   95: function savePromptToQuickCommand(context, prompt) {
   96:   const input = context.$?.("quickCommandInput");
   97:   if (input) {
   98:     input.value = prompt;
   99:   }
  100: }
  101: 
  102: function bindOpsFocusButtons(root, onChange) {
  103:   Array.from(root.querySelectorAll("[data-ops-focus]")).forEach((button) => {
  104:     button.onclick = () => {
  105:       onChange(button.getAttribute("data-ops-focus") || "all");
  106:     };
  107:   });
  108: }
  109: 
  110: function bindOpsSelectionButtons(root, onSelect) {
  111:   Array.from(root.querySelectorAll("[data-ops-select]")).forEach((button) => {
  112:     button.onclick = () => {
  113:       onSelect(button.getAttribute("data-ops-select") || "");
  114:     };
  115:   });
  116: }
  117: 
  118: function bindOpsAssistantButtons(root, context, prompts) {
  119:   Array.from(root.querySelectorAll("[data-ops-ai-open]")).forEach((button) => {
  120:     button.onclick = () => {
  121:       context.navigateTo("ai-command");
  122:       context.showMessage?.("Opened AI Command.");
  123:     };
  124:   });
  125: 
  126:   Array.from(root.querySelectorAll("[data-ops-ai-prompt]")).forEach((button) => {
  127:     button.onclick = () => {
  128:       const index = Number(button.getAttribute("data-ops-ai-prompt"));
  129:       const prompt = prompts[index];
  130:       if (!prompt) return;
  131:       savePromptToQuickCommand(context, prompt.prompt);
  132:       context.navigateTo("ai-command");
  133:       context.showMessage?.("Operations prompt added to AI Command.");
  134:     };
  135:   });
  136: }
  137: 
  138: function renderOpsFocusTabs(tabs, currentValue, escapeHtml) {
  139:   return `
  140:     <div class="ops-focus-tabs">
  141:       ${tabs.map((tab) => `
  142:         <button
  143:           class="ops-focus-tab${tab.value === currentValue ? " is-active" : ""}"
  144:           type="button"
  145:           data-ops-focus="${escapeHtml(tab.value)}"
  146:         >
  147:           <strong>${escapeHtml(tab.label)}</strong>
  148:           <span>${escapeHtml(String(tab.count))}</span>
  149:         </button>
  150:       `).join("")}
  151:     </div>
  152:   `;
  153: }
  154: 
  155: function renderOpsDetailRows(rows, escapeHtml) {
  156:   return `
  157:     <div class="ops-detail-grid">
  158:       ${rows.map((row) => `
  159:         <div class="ops-detail-card">
  160:           <span>${escapeHtml(row.label)}</span>
  161:           <strong>${escapeHtml(asString(row.value || "-"))}</strong>
  162:         </div>
  163:       `).join("")}
  164:     </div>
  165:   `;
  166: }
  167: 
  168: function buildOpsAssistantPrompts(pageKey, projectName, selectedItem, focusLabel) {
```

### Notification operations signals

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
   92:   );
   93: }
   94: 
   95: function savePromptToQuickCommand(context, prompt) {
```

### Task/handoff writes

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
```

### Execution/action wording

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
```

### Confirmation gates

```js
 1761:       context.fetchProjectNotificationCenter(projectName)
 1762:         .then((liveData) => {
 1763:           session.isLoading = false;
 1764:           if (!liveData) return;
 1765:           const ops = asObject(context.getState().data.operations);
 1766:           ops.notification_center = liveData;
 1767:           renderNotificationCenter(context, { ...context.getState(), data: { ...context.getState().data, operations: ops } }, projectName);
 1768:         })
 1769:         .catch((error) => {
 1770:           session.isLoading = false;
 1771:           session.errorMessage = `Notification Center: ${error?.message || "Failed to refresh."}`;
 1772:           rerender();
 1773:           context.showError?.(session.errorMessage);
 1774:         });
 1775:     } else {
 1776:       session.errorMessage = "";
 1777:       context.reloadProjectData?.(projectName);
 1778:     }
 1779:   };
 1780:   root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", refreshNotificationCenter);
 1781:   root.querySelector("#notificationCenterRefreshBtnHeader")?.addEventListener("click", refreshNotificationCenter);
 1782:   bindOpsFocusButtons(root, (focus) => {
 1783:     session.focus = focus || "all";
 1784:     rerender();
 1785:   });
 1786:   bindOpsSelectionButtons(root, (selectedKey) => {
 1787:     session.selectedKey = selectedKey;
 1788:     rerender();
 1789:   });
 1790:   root.querySelector("#notificationCenterSearch")?.addEventListener("input", (event) => {
 1791:     session.search = event.target.value || "";
 1792:     rerender();
 1793:   });
 1794:   root.querySelector("#notificationCenterSeverity")?.addEventListener("change", (event) => {
 1795:     session.severity = event.target.value || "all";
 1796:     rerender();
 1797:   });
 1798:   Array.from(root.querySelectorAll("[data-mark-read]")).forEach((button) => {
 1799:     button.onclick = async () => {
 1800:       const notificationId = button.getAttribute("data-mark-read") || "";
 1801:       if (!notificationId || !context.markProjectNotification) return;
 1802:       try {
 1803:         await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
 1804:         await context.reloadProjectData?.(projectName);
 1805:         context.showMessage?.("Notification marked as read.");
 1806:       } catch (error) {
 1807:         context.showError?.(error.message || "Failed to update notification.");
 1808:       }
 1809:     };
 1810:   });
 1811:   Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
 1812:     button.onclick = async () => {
 1813:       const action = button.getAttribute("data-governance-action") || "";
 1814:       if (action !== "refresh") return;
 1815: 
 1816:       if (!projectName || !context.fetchProjectGovernance) {
 1817:         context.showError?.("Governance refresh is unavailable for this project.");
 1818:         return;
 1819:       }
 1820: 
 1821:       try {
 1822:         const liveGovernance = await context.fetchProjectGovernance(projectName);
 1823:         const currentState = context.getState();
 1824:         const governanceData = asObject(currentState.data.governance);
 1825:         renderNotificationCenter(context, {
 1826:           ...currentState,
 1827:           data: {
 1828:             ...currentState.data,
 1829:             governance: {
 1830:               ...governanceData,
 1831:               summary: asObject(liveGovernance)
 1832:             }
 1833:           }
 1834:         }, projectName);
 1835:         context.showMessage?.("Governance approvals refreshed.");
 1836:       } catch (error) {
 1837:         context.showError?.(error.message || "Failed to refresh governance approvals.");
 1838:       }
 1839:     };
 1840:   });
 1841:   Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
 1842:     button.onclick = async () => {
 1843:       const approvalId = button.getAttribute("data-approval-id") || "";
 1844:       const decision = button.getAttribute("data-governance-decision") || "";
 1845: 
 1846:       if (!approvalId || !decision || !context.decideProjectApproval) {
 1847:         context.showError?.("Governance decision is unavailable for this notification.");
 1848:         return;
 1849:       }
 1850: 
 1851:       const confirmed = window.confirm(`Confirm Governance decision\n\nAction: ${titleCase(decision)} approval ${approvalId}.\nRisk: This updates a durable Governance approval record. It does not publish, send, or execute anything directly.\n\nSelect Cancel to review before deciding.`);
 1852:       if (!confirmed) return;
 1853: 
 1854:       try {
 1855:         await context.decideProjectApproval(projectName, approvalId, {
 1856:           decision,
 1857:           note: `${titleCase(decision)} from Notification Center.`,
 1858:           actor: "notification-center",
 1859:           escalate_to: "admin"
 1860:         });
 1861:         context.showMessage?.(`Approval ${titleCase(decision)} for ${approvalId}.`);
 1862: 
 1863:         if (context.fetchProjectGovernance) {
 1864:           const liveGovernance = await context.fetchProjectGovernance(projectName);
 1865:           const currentState = context.getState();
 1866:           const governanceData = asObject(currentState.data.governance);
 1867:           renderNotificationCenter(context, {
 1868:             ...currentState,
 1869:             data: {
 1870:               ...currentState.data,
 1871:               governance: {
 1872:                 ...governanceData,
 1873:                 summary: asObject(liveGovernance)
 1874:               }
 1875:             }
 1876:           }, projectName);
 1877:         } else {
 1878:           await context.reloadProjectData?.(projectName);
 1879:         }
 1880:       } catch (error) {
 1881:         context.showError?.(error.message || "Failed to update approval.");
 1882:       }
 1883:     };
 1884:   });
 1885:   bindRouteButtons(root, context);
 1886:   bindOpsAssistantButtons(root, context, prompts);
 1887: 
 1888:   if (
 1889:     !approvalAlerts.length &&
 1890:     !session.didHydrateGovernanceApprovals &&
 1891:     projectName &&
 1892:     context.fetchProjectGovernance
 1893:   ) {
 1894:     session.didHydrateGovernanceApprovals = true;
 1895:     queueMicrotask(() => {
 1896:       context.fetchProjectGovernance(projectName)
 1897:         .then((liveGovernance) => {
 1898:           const liveApprovalAlerts = buildGovernanceApprovalAlerts(asObject(liveGovernance));
 1899:           if (!liveApprovalAlerts.length) {
 1900:             return;
 1901:           }
 1902: 
 1903:           const currentState = context.getState();
 1904:           const ops = asObject(currentState.data.operations);
 1905:           ops.notification_center = {
 1906:             ...asObject(ops.notification_center),
 1907:             approval_pending_alerts: liveApprovalAlerts
 1908:           };
 1909: 
 1910:           const governanceData = asObject(currentState.data.governance);
 1911:           const nextState = {
 1912:             ...currentState,
 1913:             data: {
 1914:               ...currentState.data,
 1915:               operations: ops,
 1916:               governance: {
 1917:                 ...governanceData,
 1918:                 summary: asObject(liveGovernance)
 1919:               }
 1920:             }
 1921:           };
 1922: 
 1923:           renderNotificationCenter(context, nextState, projectName);
 1924:         })
 1925:         .catch(() => {});
 1926:     });
 1927:   }
 1928: 
 1929:   if (!session.didAutoRefresh && projectName && context.fetchProjectNotificationCenter) {
 1930:     session.didAutoRefresh = true;
 1931:     queueMicrotask(refreshNotificationCenter);
 1932:   }
 1933: }
 1934: 
 1935: export const taskCenterRoute = {
 1936:   id: "task-center",
 1937:   disableStandardLayout: true,
 1938:   meta: {
 1939:     eyebrow: "Operate",
 1940:     title: "Task Center",
 1941:     description: "Review durable tasks, owners, due dates, priorities, filters, and linked operational entities without silent task mutation."
```

### Event handlers

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
   92:   );
   93: }
   94: 
   95: function savePromptToQuickCommand(context, prompt) {
   96:   const input = context.$?.("quickCommandInput");
   97:   if (input) {
   98:     input.value = prompt;
   99:   }
  100: }
  101: 
  102: function bindOpsFocusButtons(root, onChange) {
  103:   Array.from(root.querySelectorAll("[data-ops-focus]")).forEach((button) => {
  104:     button.onclick = () => {
  105:       onChange(button.getAttribute("data-ops-focus") || "all");
  106:     };
  107:   });
  108: }
  109: 
  110: function bindOpsSelectionButtons(root, onSelect) {
  111:   Array.from(root.querySelectorAll("[data-ops-select]")).forEach((button) => {
  112:     button.onclick = () => {
  113:       onSelect(button.getAttribute("data-ops-select") || "");
  114:     };
  115:   });
  116: }
  117: 
  118: function bindOpsAssistantButtons(root, context, prompts) {
  119:   Array.from(root.querySelectorAll("[data-ops-ai-open]")).forEach((button) => {
  120:     button.onclick = () => {
  121:       context.navigateTo("ai-command");
  122:       context.showMessage?.("Opened AI Command.");
  123:     };
  124:   });
  125: 
  126:   Array.from(root.querySelectorAll("[data-ops-ai-prompt]")).forEach((button) => {
  127:     button.onclick = () => {
  128:       const index = Number(button.getAttribute("data-ops-ai-prompt"));
  129:       const prompt = prompts[index];
  130:       if (!prompt) return;
  131:       savePromptToQuickCommand(context, prompt.prompt);
  132:       context.navigateTo("ai-command");
  133:       context.showMessage?.("Operations prompt added to AI Command.");
  134:     };
  135:   });
  136: }
  137: 
  138: function renderOpsFocusTabs(tabs, currentValue, escapeHtml) {
  139:   return `
  140:     <div class="ops-focus-tabs">
  141:       ${tabs.map((tab) => `
  142:         <button
  143:           class="ops-focus-tab${tab.value === currentValue ? " is-active" : ""}"
  144:           type="button"
  145:           data-ops-focus="${escapeHtml(tab.value)}"
  146:         >
  147:           <strong>${escapeHtml(tab.label)}</strong>
  148:           <span>${escapeHtml(String(tab.count))}</span>
  149:         </button>
  150:       `).join("")}
  151:     </div>
  152:   `;
  153: }
  154: 
  155: function renderOpsDetailRows(rows, escapeHtml) {
  156:   return `
  157:     <div class="ops-detail-grid">
  158:       ${rows.map((row) => `
  159:         <div class="ops-detail-card">
  160:           <span>${escapeHtml(row.label)}</span>
  161:           <strong>${escapeHtml(asString(row.value || "-"))}</strong>
  162:         </div>
  163:       `).join("")}
  164:     </div>
```

### Storage signals

```js
_No match found._
```

### Routing/handoff

```js
    1: import { getSharedHandoff } from "../shared-context.js";
    2: const taskSessions = new Map();
    3: const queueSessions = new Map();
    4: const jobSessions = new Map();
    5: const notificationSessions = new Map();
    6: 
    7: function asArray(value) {
    8:   return Array.isArray(value) ? value : [];
    9: }
   10: 
   11: function asObject(value) {
   12:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   13: }
   14: 
   15: function asString(value) {
   16:   if (value == null) return "";
   17:   return String(value);
   18: }
   19: 
   20: function titleCase(value) {
   21:   return asString(value)
   22:     .replace(/[_-]+/g, " ")
   23:     .replace(/\b\w/g, (match) => match.toUpperCase());
   24: }
   25: 
   26: function toDate(value) {
   27:   const parsed = new Date(value);
   28:   return Number.isNaN(parsed.getTime()) ? null : parsed;
   29: }
   30: 
   31: function formatDateTime(value) {
   32:   const date = toDate(value);
   33:   if (!date) return "Not set";
   34:   return new Intl.DateTimeFormat(undefined, {
   35:     month: "short",
   36:     day: "numeric",
   37:     hour: "numeric",
   38:     minute: "2-digit"
   39:   }).format(date);
   40: }
   41: 
   42: function badgeTone(value) {
   43:   const normalized = asString(value).toLowerCase();
   44:   if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
   45:   if (["high", "warning", "pending", "queued", "running", "due_soon", "ready"].includes(normalized)) return "warning";
   46:   if (["success", "approved", "published", "completed", "healthy"].includes(normalized)) return "success";
   47:   return "neutral";
   48: }
   49: 
   50: function formatCount(value) {
   51:   const parsed = Number(value);
   52:   return Number.isFinite(parsed) ? String(parsed) : "0";
   53: }
   54: 
   55: function ensureSession(map, projectName, initialState) {
   56:   const key = projectName || "__default__";
   57:   if (!map.has(key)) {
   58:     map.set(key, { ...initialState });
   59:   }
   60:   return map.get(key);
   61: }
   62: 
   63: function filterBySearch(items, search, fields) {
   64:   const query = asString(search).trim().toLowerCase();
   65:   if (!query) return items;
   66: 
   67:   return items.filter((item) =>
   68:     fields.some((field) => asString(typeof field === "function" ? field(item) : item?.[field]).toLowerCase().includes(query))
   69:   );
   70: }
   71: 
   72: function bindRouteButtons(root, context) {
   73:   Array.from(root.querySelectorAll("[data-ops-route]")).forEach((button) => {
   74:     button.onclick = () => {
   75:       const route = button.getAttribute("data-ops-route") || "home";
   76:       const label = button.getAttribute("data-ops-label") || "item";
   77:       context.navigateTo(route);
   78:       context.showMessage?.(`Opened ${label}.`);
   79:     };
   80:   });
   81: }
   82: 
   83: function getOpsItemKey(item, index, prefix = "item") {
   84:   return asString(
   85:     item?.id ||
   86:     item?.task_id ||
   87:     item?.job_id ||
   88:     item?.queue_item_id ||
   89:     item?.notification_id ||
   90:     item?.title ||
   91:     `${prefix}-${index}`
```

### Copy defect candidates

```js
  182:         prompt: `Review ${itemLabel} in Task Center for ${projectLabel}. Explain what is blocking progress, who should act next, and the fastest unblock path.`
  183:       },
  184:       {
  185:         label: "Summarize execution risk",
  186:         preview: "Highlight where task load or due-state suggests operational risk.",
  187:         prompt: `Summarize execution risk in Task Center for ${projectLabel}. Focus on overdue, due soon, blocked, and ownership concentration risk.`
  188:       },
  189:       {
  190:         label: "Explain owner workload",
  191:         preview: "Explain workload concentration by owner and likely bottlenecks.",
  192:         prompt: `Review owner workload in Task Center for ${projectLabel}. Explain concentration risk, likely bottlenecks, and redistribution recommendations for the next cycle.`
  193:       },
  194:       {
  195:         label: "Identify overdue risk",
  196:         preview: "Identify highest-risk overdue items and likely downstream impact.",
  197:         prompt: `Identify overdue task risk for ${projectLabel}. Rank the most critical overdue items and explain likely downstream execution impact if unresolved.`
  198:       }
  199:     ];
  200:   }
  201: 
  202:   if (pageKey === "queue-center") {
  203:     return [
  204:       {
  205:         label: "Triage queue pressure",
  206:         preview: "Identify which queue needs attention first and why.",
  207:         prompt: `Review Queue Center for ${projectLabel}. Which queue needs attention first, why, and what should be routed next?`
  208:       },
  209:       {
  210:         label: "Review selected queue item",
  211:         preview: "Explain what the selected queue item likely needs next.",
  212:         prompt: `Review ${itemLabel} in Queue Center for ${projectLabel}. Explain what it likely needs next and which workspace should own it.`
  213:       },
  214:       {
  215:         label: "Find throughput blockers",
  216:         preview: "Surface recurring queue patterns slowing execution.",
  217:         prompt: `Analyze Queue Center for ${projectLabel} with focus on ${focusLabel}. Identify throughput blockers, queue bottlenecks, and the next operational adjustments.`
  218:       }
  219:     ];
  220:   }
  221: 
  222:   if (pageKey === "job-monitor") {
  223:     return [
  224:       {
  225:         label: "Triage failures",
  226:         preview: "Summarize failure risk and what to inspect first.",
  227:         prompt: `Review Job Monitor for ${projectLabel}. Prioritize failures, retry risk, and health issues, then explain what should be inspected first.`
  228:       },
  229:       {
  230:         label: "Inspect selected job",
  231:         preview: "Explain what the selected job status implies operationally.",
  232:         prompt: `Review ${itemLabel} in Job Monitor for ${projectLabel}. Explain what the current job state implies, what likely happened, and what should be checked next.`
  233:       },
  234:       {
  235:         label: "Summarize job health",
  236:         preview: "Assess execution health across workflows, media, and publishing jobs.",
  237:         prompt: `Summarize current execution health for ${projectLabel} across workflows, media, and publishing jobs. Highlight failure clusters, retry patterns, and risk areas.`
  238:       }
  239:     ];
  240:   }
  241: 
  242:   return [
  243:     {
  244:       label: "Rank alert urgency",
  245:       preview: "Sort current notifications by severity and action urgency.",
  246:       prompt: `Review Notification Center for ${projectLabel}. Rank current alerts by urgency, explain what matters most, and identify what should be handled first.`
  247:     },
  248:     {
  249:       label: "Review selected alert",
  250:       preview: "Explain what the selected alert means and where to go next.",
  251:       prompt: `Review ${itemLabel} in Notification Center for ${projectLabel}. Explain what it means, what risk it creates, and which page or team should act next.`
  252:     },
  253:     {
  254:       label: "Summarize operational signal",
  255:       preview: "Turn the current notification stream into a short operations summary.",
  256:       prompt: `Summarize the current operational notification signal for ${projectLabel} with focus on ${focusLabel}. Highlight approvals, provider health, publishing events, and urgent follow-up.`
  257:     }
  258:   ];
  259: }
  260: 
  261: 
  262: function readOpsState(context) {
  263:   const state = typeof context.getState === "function" ? context.getState() : {};
  264:   return asObject(asObject(state.data).operations);
  265: }
  266: 
  267: function buildExecutiveRuntimeSignals(context) {
  268:   const ops = readOpsState(context);
  269:   const taskCenter = asObject(ops.task_center);
  270:   const queueCenter = asObject(ops.queue_center);
  271:   const jobMonitor = asObject(ops.job_monitor);
  272:   const notificationCenter = asObject(ops.notification_center);
  273: 
  274:   const activeTasks = Number(taskCenter.active_count || taskCenter.open_count || 0);
  275:   const queueItems = Number(queueCenter.active_count || queueCenter.total_active || asArray(queueCenter.items).length || 0);
  276:   const failedJobs = Number(jobMonitor.failed_count || 0);
  277:   const runningJobs = Number(jobMonitor.running_count || 0);
  278:   const criticalAlerts = Number(notificationCenter.critical_count || 0);
  279:   const unreadNotifications = Number(notificationCenter.unread_count || 0);
  280: 
  281:   const providerAlerts = asArray(notificationCenter.provider_disconnect_alerts).length;
  282:   const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).length;
  283:   const publishAlerts = asArray(notificationCenter.publish_alerts).length;
  284:   const claimAlerts = asArray(notificationCenter.claim_risk_alerts).length;
  285: 
  286:   const runtimeTone = failedJobs || criticalAlerts ? "danger" : runningJobs || queueItems || activeTasks ? "warning" : "success";
  287:   const runtimeLabel = failedJobs || criticalAlerts
  288:     ? "Needs attention"
  289:     : runningJobs || queueItems || activeTasks
  290:       ? "Active"
  291:       : "Healthy";
  292: 
  293:   return [
  294:     {
  295:       label: "Runtime",
  296:       value: runtimeLabel,
  297:       helper: failedJobs || criticalAlerts ? "Failures or critical alerts detected" : "No critical runtime issue detected",
  298:       tone: runtimeTone,
  299:       route: "job-monitor"
  300:     },
  301:     {
  302:       label: "Queue Pressure",
  303:       value: formatCount(queueItems),
  304:       helper: "Active queue items",
  305:       tone: queueItems ? "warning" : "success",
  306:       route: "queue-center"
  307:     },
  308:     {
  309:       label: "Failed Jobs",
  310:       value: formatCount(failedJobs),
  311:       helper: "Execution jobs needing review",
  312:       tone: failedJobs ? "danger" : "success",
  313:       route: "job-monitor"
  314:     },
  315:     {
  316:       label: "Critical Alerts",
  317:       value: formatCount(criticalAlerts),
  318:       helper: "Highest priority notifications",
  319:       tone: criticalAlerts ? "danger" : "success",
  320:       route: "notification-center"
  321:     },
  322:     {
  323:       label: "Approvals",
  324:       value: formatCount(approvalAlerts),
  325:       helper: "Pending approval signals",
  326:       tone: approvalAlerts ? "warning" : "success",
  327:       route: "notification-center"
  328:     },
  329:     {
  330:       label: "Publishing",
  331:       value: formatCount(publishAlerts),
  332:       helper: "Publishing alerts",
  333:       tone: publishAlerts ? "warning" : "success",
  334:       route: "publishing"
  335:     },
  336:     {
  337:       label: "Providers",
  338:       value: formatCount(providerAlerts),
  339:       helper: "Disconnected provider alerts",
  340:       tone: providerAlerts ? "warning" : "success",
  341:       route: "integrations"
  342:     },
  343:     {
  344:       label: "Claim Risk",
  345:       value: formatCount(claimAlerts),
  346:       helper: "Compliance review signals",
  347:       tone: claimAlerts ? "danger" : "success",
  348:       route: "governance"
  349:     },
  350:     {
  351:       label: "Inbox",
  352:       value: formatCount(unreadNotifications),
  353:       helper: "Unread operational notifications",
  354:       tone: unreadNotifications ? "warning" : "success",
  355:       route: "notification-center"
  356:     }
  357:   ];
  358: }
  359: 
  360: function renderExecutiveRuntimeStrip(context, options = {}) {
  361:   const signals = buildExecutiveRuntimeSignals(context);
  362:   const kicker = asString(options.kicker) || "System Runtime";
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | Not found |
| Customer operations signals | Found - focused proof required |
| Notification operations signals | Found - focused proof required |
| Task/handoff signals | Found - focused proof required |
| Confirmation gates | Found |
| Storage signals | Not found |
| Sensitive action wording | Found - determine wording vs execution |

## Decision Guidance
- If customer outreach, notification send, task creation, resolve/assign/complete, or backend mutation exists, exact action proof is required before any patch.
- If actions are draft-only or route-only, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T45 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
