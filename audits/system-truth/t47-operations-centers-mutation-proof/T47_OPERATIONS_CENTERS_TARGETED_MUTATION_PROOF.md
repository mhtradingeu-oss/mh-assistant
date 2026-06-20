# T47 — Operations Centers Targeted Mutation Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/operations-centers.js

## Purpose
T46 found many potential mutation signals. T47 narrows those down to determine whether Operations Centers performs real backend mutations or only read/refresh/copy/route/AI/disabled actions.

## Exact Counts

| Area | First Line | Count |
|---|---:|---:|
| Real project mutation APIs | 1855 | 1 |
| Context mutation callbacks | 1855 | 1 |
| Fetch calls | n/a | 0 |
| Refresh/read APIs | 501 | 73 |
| Disabled mutation controls | 649 | 12 |
| Clipboard/copy only | 471 | 8 |
| Route only | 73 | 22 |
| AI prompt only | 95 | 16 |
| Notification possible mutation labels | 5 | 125 |
| Queue possible mutation labels | 3 | 176 |
| Job possible mutation labels | 4 | 150 |
| Confirmation gates | 1851 | 1 |
| Known compact copy | 711 | 1 |

## Evidence Zones

### Real project mutation APIs

#### Match 1 — line 1855

```js
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
```
### Context mutation callbacks

#### Match 1 — line 1855

```js
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
```
### Fetch calls

_No match found._

### Refresh/read APIs

#### Match 1 — line 501

```js
  466:           { label: "Status", value: "Review-only intake" },
  467:           { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
  468:         ], escapeHtml)}
  469:       </div>
  470:       <div class="ops-action-row">
  471:         <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
  472:         <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace for Review</button>
  473:       </div>
  474:     </section>
  475:   `;
  476: }
  477: 
  478: 
  479: function renderTaskCenterLayout({
  480:   context,
  481:   projectName,
  482:   taskCenter,
  483:   session,
  484:   items,
  485:   selectedItem,
  486:   filters,
  487:   prompts,
  488:   incomingHandoff
  489: }) {
  490:   const escapeHtml = context.escapeHtml;
  491:   const projectLabel = projectName || "No project selected";
  492:   const hasFilters = Boolean(
  493:     asString(session.search).trim() ||
  494:     session.focus !== "all" ||
  495:     session.priority !== "all" ||
  496:     session.owner !== "all" ||
  497:     session.source !== "all"
  498:   );
  499:   const emptyText = hasFilters
  500:     ? "No tasks match the current filters."
  501:     : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";
  502: 
  503:   const selectedSummary = selectedItem
  504:     ? [
  505:       selectedItem.title || "Task",
  506:       selectedItem.description || "No description.",
  507:       `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
  508:       `Due: ${formatDateTime(selectedItem.due_at)}`,
  509:       `Priority: ${titleCase(selectedItem.priority || "normal")}`,
  510:       `Status: ${titleCase(selectedItem.status || "open")}`
  511:     ].join("\n")
  512:     : "No task is selected.";
  513: 
  514:   const showLoadingState = Boolean(session.isLoading);
  515: 
  516:   return `
  517:     <section class="page is-active" data-page="task-center">
  518:       <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell mhos-os-page">
  519:         <section class="std-context-ribbon mhos-os-header">
  520:           <div class="std-context-main mhos-os-header-main">
  521:             <div>
  522:               <p class="mhos-os-kicker">Operational Task Review</p>
  523:               <h3 class="std-context-title mhos-os-title">Task Center</h3>
  524:               <p class="std-context-description mhos-os-subtitle">Review ownership, due-state, linked entities, and safe route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
  525:             </div>
  526:             <div class="std-context-metrics mhos-os-chip-row" aria-label="Task Center metrics">
  527:               <span class="std-context-chip mhos-os-chip"><span>Total</span><strong>${escapeHtml(formatCount(taskCenter.total))}</strong></span>
  528:               <span class="std-context-chip mhos-os-chip"><span>Open</span><strong>${escapeHtml(formatCount(taskCenter.open_count))}</strong></span>
  529:               <span class="std-context-chip mhos-os-chip is-warning"><span>Blocked</span><strong>${escapeHtml(formatCount(taskCenter.blocked_count))}</strong></span>
  530:               <span class="std-context-chip mhos-os-chip is-danger"><span>Overdue</span><strong>${escapeHtml(formatCount(taskCenter.overdue_count))}</strong></span>
  531:               <span class="std-context-chip mhos-os-chip is-warning"><span>Due Soon</span><strong>${escapeHtml(formatCount(taskCenter.due_soon_count))}</strong></span>
  532:             </div>
  533:           </div>
  534:           <div class="std-context-actions mhos-os-action-row">
  535:             <span class="mhos-os-chip">Project: ${escapeHtml(projectLabel)}</span>
  536:             <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
```

#### Match 2 — line 536

```js
  501:     : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";
  502: 
  503:   const selectedSummary = selectedItem
  504:     ? [
  505:       selectedItem.title || "Task",
  506:       selectedItem.description || "No description.",
  507:       `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
  508:       `Due: ${formatDateTime(selectedItem.due_at)}`,
  509:       `Priority: ${titleCase(selectedItem.priority || "normal")}`,
  510:       `Status: ${titleCase(selectedItem.status || "open")}`
  511:     ].join("\n")
  512:     : "No task is selected.";
  513: 
  514:   const showLoadingState = Boolean(session.isLoading);
  515: 
  516:   return `
  517:     <section class="page is-active" data-page="task-center">
  518:       <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell mhos-os-page">
  519:         <section class="std-context-ribbon mhos-os-header">
  520:           <div class="std-context-main mhos-os-header-main">
  521:             <div>
  522:               <p class="mhos-os-kicker">Operational Task Review</p>
  523:               <h3 class="std-context-title mhos-os-title">Task Center</h3>
  524:               <p class="std-context-description mhos-os-subtitle">Review ownership, due-state, linked entities, and safe route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
  525:             </div>
  526:             <div class="std-context-metrics mhos-os-chip-row" aria-label="Task Center metrics">
  527:               <span class="std-context-chip mhos-os-chip"><span>Total</span><strong>${escapeHtml(formatCount(taskCenter.total))}</strong></span>
  528:               <span class="std-context-chip mhos-os-chip"><span>Open</span><strong>${escapeHtml(formatCount(taskCenter.open_count))}</strong></span>
  529:               <span class="std-context-chip mhos-os-chip is-warning"><span>Blocked</span><strong>${escapeHtml(formatCount(taskCenter.blocked_count))}</strong></span>
  530:               <span class="std-context-chip mhos-os-chip is-danger"><span>Overdue</span><strong>${escapeHtml(formatCount(taskCenter.overdue_count))}</strong></span>
  531:               <span class="std-context-chip mhos-os-chip is-warning"><span>Due Soon</span><strong>${escapeHtml(formatCount(taskCenter.due_soon_count))}</strong></span>
  532:             </div>
  533:           </div>
  534:           <div class="std-context-actions mhos-os-action-row">
  535:             <span class="mhos-os-chip">Project: ${escapeHtml(projectLabel)}</span>
  536:             <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
  537:           </div>
  538:         </section>
  539: 
  540:         ${renderExecutiveRuntimeStrip(context, {
  541:           kicker: "System Runtime",
  542:           title: "System Signal",
  543:           description: "Supporting cross-center health and risk signal.",
  544:           badge: "Supporting context"
  545:         })}
  546: 
  547:         <div class="ops-layout-grid mhos-os-layout">
  548:           <article class="panel ops-main-column mhos-clean-stack mhos-os-main mhos-os-section">
  549:             <div class="panel-header mhos-os-section-head">
  550:               <div>
  551:                 <p class="mhos-os-kicker">Main View</p>
  552:                 <h3 class="mhos-os-section-title">Operational task backlog</h3>
  553:                 <p class="mhos-os-section-copy">Filter by focus, owner, source, and priority to review task risk quickly.</p>
  554:               </div>
  555:               <span class="mhos-os-chip ${showLoadingState ? "is-warning" : ""}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
  556:             </div>
  557: 
  558:             ${renderOpsFocusTabs([
  559:               { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
  560:               { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
  561:               { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
  562:               { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
  563:               { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
  564:             ], session.focus, escapeHtml)}
  565: 
  566:             <div class="ops-toolbar">
  567:               <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${escapeHtml(session.search)}">
  568:               <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, escapeHtml, "All priorities")}</select>
  569:               <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, escapeHtml, "All owners")}</select>
  570:               <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, escapeHtml, "All sources")}</select>
  571:             </div>
```

#### Match 3 — line 555

```js
  520:           <div class="std-context-main mhos-os-header-main">
  521:             <div>
  522:               <p class="mhos-os-kicker">Operational Task Review</p>
  523:               <h3 class="std-context-title mhos-os-title">Task Center</h3>
  524:               <p class="std-context-description mhos-os-subtitle">Review ownership, due-state, linked entities, and safe route-aware follow-up for ${escapeHtml(projectLabel)}.</p>
  525:             </div>
  526:             <div class="std-context-metrics mhos-os-chip-row" aria-label="Task Center metrics">
  527:               <span class="std-context-chip mhos-os-chip"><span>Total</span><strong>${escapeHtml(formatCount(taskCenter.total))}</strong></span>
  528:               <span class="std-context-chip mhos-os-chip"><span>Open</span><strong>${escapeHtml(formatCount(taskCenter.open_count))}</strong></span>
  529:               <span class="std-context-chip mhos-os-chip is-warning"><span>Blocked</span><strong>${escapeHtml(formatCount(taskCenter.blocked_count))}</strong></span>
  530:               <span class="std-context-chip mhos-os-chip is-danger"><span>Overdue</span><strong>${escapeHtml(formatCount(taskCenter.overdue_count))}</strong></span>
  531:               <span class="std-context-chip mhos-os-chip is-warning"><span>Due Soon</span><strong>${escapeHtml(formatCount(taskCenter.due_soon_count))}</strong></span>
  532:             </div>
  533:           </div>
  534:           <div class="std-context-actions mhos-os-action-row">
  535:             <span class="mhos-os-chip">Project: ${escapeHtml(projectLabel)}</span>
  536:             <button class="btn btn-secondary std-context-btn" type="button" id="taskCenterRefreshBtn">Refresh</button>
  537:           </div>
  538:         </section>
  539: 
  540:         ${renderExecutiveRuntimeStrip(context, {
  541:           kicker: "System Runtime",
  542:           title: "System Signal",
  543:           description: "Supporting cross-center health and risk signal.",
  544:           badge: "Supporting context"
  545:         })}
  546: 
  547:         <div class="ops-layout-grid mhos-os-layout">
  548:           <article class="panel ops-main-column mhos-clean-stack mhos-os-main mhos-os-section">
  549:             <div class="panel-header mhos-os-section-head">
  550:               <div>
  551:                 <p class="mhos-os-kicker">Main View</p>
  552:                 <h3 class="mhos-os-section-title">Operational task backlog</h3>
  553:                 <p class="mhos-os-section-copy">Filter by focus, owner, source, and priority to review task risk quickly.</p>
  554:               </div>
  555:               <span class="mhos-os-chip ${showLoadingState ? "is-warning" : ""}">${escapeHtml(showLoadingState ? "Refreshing" : `${items.length} visible`)}</span>
  556:             </div>
  557: 
  558:             ${renderOpsFocusTabs([
  559:               { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
  560:               { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
  561:               { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
  562:               { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
  563:               { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
  564:             ], session.focus, escapeHtml)}
  565: 
  566:             <div class="ops-toolbar">
  567:               <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${escapeHtml(session.search)}">
  568:               <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, escapeHtml, "All priorities")}</select>
  569:               <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, escapeHtml, "All owners")}</select>
  570:               <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, escapeHtml, "All sources")}</select>
  571:             </div>
  572: 
  573:             ${session.errorMessage ? `<div class="error-state" aria-live="assertive">${escapeHtml(session.errorMessage)}</div>` : ""}
  574: 
  575:             ${renderOpsTable(
  576:               ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
  577:               items.map((item) => `
  578:                 <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
  579:                   <td>
  580:                     <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
  581:                       <strong>${escapeHtml(item.title || "Task")}</strong>
  582:                       <span>${escapeHtml(item.description || item.service_domain || "-")}</span>
  583:                     </button>
  584:                   </td>
  585:                   <td>
  586:                     <strong>${escapeHtml(item.assignee || item.owner || "-")}</strong>
  587:                     <span>${escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
  588:                   </td>
  589:                   <td>
  590:                     <strong>${escapeHtml(formatDateTime(item.due_at))}</strong>
```

#### Match 4 — line 640

```js
  605:           <aside class="ops-right-rail mhos-clean-stack mhos-os-rail">
  606:             ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
  607:             <section class="panel ops-detail-card mhos-clean-surface mhos-os-ai-panel">
  608:               <div class="panel-header">
  609:                 <div>
  610:                   <p class="mhos-os-kicker">Selected Task</p>
  611:                   <h3 class="mhos-os-panel-title">${escapeHtml(selectedItem?.title || "Select a task")}</h3>
  612:                   <p class="mhos-os-panel-copy">${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
  613:                 </div>
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 5 — line 644

```js
  609:                 <div>
  610:                   <p class="mhos-os-kicker">Selected Task</p>
  611:                   <h3 class="mhos-os-panel-title">${escapeHtml(selectedItem?.title || "Select a task")}</h3>
  612:                   <p class="mhos-os-panel-copy">${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
  613:                 </div>
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 6 — line 734

```js
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
```

#### Match 7 — line 735

```js
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
```

#### Match 8 — line 739

```js
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
```

#### Match 9 — line 749

```js
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
```

#### Match 10 — line 755

```js
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
```

#### Match 11 — line 758

```js
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
```

#### Match 12 — line 759

```js
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
```
### Disabled mutation controls

#### Match 1 — line 649

```js
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 2 — line 650

```js
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 3 — line 651

```js
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 4 — line 652

```js
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 5 — line 653

```js
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 6 — line 1003

```js
  968:                     <p>${escapeHtml(selectedItem.details?.summary || selectedItem.entity_type || "No queue summary available.")}</p>
  969:                   </div>
  970:                   ${renderOpsDetailRows([
  971:                     { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
  972:                     { label: "Assignee", value: selectedItem.assignee || "-" },
  973:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  974:                     { label: "Status", value: titleCase(selectedItem.status || "queued") },
  975:                     { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
  976:                     { label: "Entity", value: selectedItem.entity_type || "-" }
  977:                   ], escapeHtml)}
  978:                 </div>
  979:               ` : `<div class="empty-box">No queue item is selected.</div>`}
  980:             </section>
  981: 
  982:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
  983:               <div class="panel-header">
  984:                 <div>
  985:                   <p class="mhos-os-kicker">Action Panel</p>
  986:                   <h3 class="mhos-os-panel-title">Queue review actions</h3>
  987:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
  988:                 </div>
  989:               </div>
  990:               <div class="ops-action-row">
  991:                 <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
  992:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  993:               </div>
  994:               <div class="ops-mini-list">
  995:                 ${queueCounts.map((item) => `
  996:                   <div class="ops-mini-item">
  997:                     <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
  998:                     <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
  999:                   </div>
 1000:                 `).join("")}
 1001:               </div>
 1002:               <div class="ops-deferred-list">
 1003:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
 1004:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
 1005:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
 1006:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
 1007:               </div>
 1008:             </section>
 1009: 
 1010:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1011:               <div class="panel-header">
 1012:                 <div>
 1013:                   <p class="mhos-os-kicker">AI Panel</p>
 1014:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1015:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
 1016:                 </div>
 1017:               </div>
 1018:               <div class="ops-action-row">
 1019:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
 1020:               </div>
 1021:               <div class="quick-actions">
 1022:                 ${prompts.map((item, index) => `
 1023:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1024:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1025:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1026:                   </button>
 1027:                 `).join("")}
 1028:               </div>
 1029:             </section>
 1030:           </aside>
 1031:         </div>
 1032:       </div>
 1033:     </section>
 1034:   `;
 1035: }
 1036: 
 1037: function renderQueueCenter(context, state, projectName) {
 1038:   const root = context.$("pageRoot");
```

#### Match 7 — line 1004

```js
  969:                   </div>
  970:                   ${renderOpsDetailRows([
  971:                     { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
  972:                     { label: "Assignee", value: selectedItem.assignee || "-" },
  973:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  974:                     { label: "Status", value: titleCase(selectedItem.status || "queued") },
  975:                     { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
  976:                     { label: "Entity", value: selectedItem.entity_type || "-" }
  977:                   ], escapeHtml)}
  978:                 </div>
  979:               ` : `<div class="empty-box">No queue item is selected.</div>`}
  980:             </section>
  981: 
  982:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
  983:               <div class="panel-header">
  984:                 <div>
  985:                   <p class="mhos-os-kicker">Action Panel</p>
  986:                   <h3 class="mhos-os-panel-title">Queue review actions</h3>
  987:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
  988:                 </div>
  989:               </div>
  990:               <div class="ops-action-row">
  991:                 <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
  992:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  993:               </div>
  994:               <div class="ops-mini-list">
  995:                 ${queueCounts.map((item) => `
  996:                   <div class="ops-mini-item">
  997:                     <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
  998:                     <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
  999:                   </div>
 1000:                 `).join("")}
 1001:               </div>
 1002:               <div class="ops-deferred-list">
 1003:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
 1004:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
 1005:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
 1006:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
 1007:               </div>
 1008:             </section>
 1009: 
 1010:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1011:               <div class="panel-header">
 1012:                 <div>
 1013:                   <p class="mhos-os-kicker">AI Panel</p>
 1014:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1015:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
 1016:                 </div>
 1017:               </div>
 1018:               <div class="ops-action-row">
 1019:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
 1020:               </div>
 1021:               <div class="quick-actions">
 1022:                 ${prompts.map((item, index) => `
 1023:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1024:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1025:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1026:                   </button>
 1027:                 `).join("")}
 1028:               </div>
 1029:             </section>
 1030:           </aside>
 1031:         </div>
 1032:       </div>
 1033:     </section>
 1034:   `;
 1035: }
 1036: 
 1037: function renderQueueCenter(context, state, projectName) {
 1038:   const root = context.$("pageRoot");
 1039:   if (!root) return;
```

#### Match 8 — line 1005

```js
  970:                   ${renderOpsDetailRows([
  971:                     { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
  972:                     { label: "Assignee", value: selectedItem.assignee || "-" },
  973:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  974:                     { label: "Status", value: titleCase(selectedItem.status || "queued") },
  975:                     { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
  976:                     { label: "Entity", value: selectedItem.entity_type || "-" }
  977:                   ], escapeHtml)}
  978:                 </div>
  979:               ` : `<div class="empty-box">No queue item is selected.</div>`}
  980:             </section>
  981: 
  982:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
  983:               <div class="panel-header">
  984:                 <div>
  985:                   <p class="mhos-os-kicker">Action Panel</p>
  986:                   <h3 class="mhos-os-panel-title">Queue review actions</h3>
  987:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
  988:                 </div>
  989:               </div>
  990:               <div class="ops-action-row">
  991:                 <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
  992:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  993:               </div>
  994:               <div class="ops-mini-list">
  995:                 ${queueCounts.map((item) => `
  996:                   <div class="ops-mini-item">
  997:                     <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
  998:                     <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
  999:                   </div>
 1000:                 `).join("")}
 1001:               </div>
 1002:               <div class="ops-deferred-list">
 1003:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
 1004:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
 1005:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
 1006:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
 1007:               </div>
 1008:             </section>
 1009: 
 1010:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1011:               <div class="panel-header">
 1012:                 <div>
 1013:                   <p class="mhos-os-kicker">AI Panel</p>
 1014:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1015:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
 1016:                 </div>
 1017:               </div>
 1018:               <div class="ops-action-row">
 1019:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
 1020:               </div>
 1021:               <div class="quick-actions">
 1022:                 ${prompts.map((item, index) => `
 1023:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1024:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1025:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1026:                   </button>
 1027:                 `).join("")}
 1028:               </div>
 1029:             </section>
 1030:           </aside>
 1031:         </div>
 1032:       </div>
 1033:     </section>
 1034:   `;
 1035: }
 1036: 
 1037: function renderQueueCenter(context, state, projectName) {
 1038:   const root = context.$("pageRoot");
 1039:   if (!root) return;
 1040: 
```

#### Match 9 — line 1298

```js
 1263:                     { label: "Retries", value: formatCount(selectedItem.retry_count) },
 1264:                     { label: "Health", value: titleCase(selectedItem.health_state || "unknown") },
 1265:                     { label: "Status", value: titleCase(selectedItem.status || "unknown") },
 1266:                     { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) }
 1267:                   ], escapeHtml)}
 1268:                 </div>
 1269:               ` : `<div class="empty-box">No job is selected.</div>`}
 1270:             </section>
 1271: 
 1272:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
 1273:               <div class="panel-header">
 1274:                 <div>
 1275:                   <p class="mhos-os-kicker">Action Panel</p>
 1276:                   <h3 class="mhos-os-panel-title">Job review actions</h3>
 1277:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Job retry, cancel, rerun, delete, worker execution, publishing, and approval mutations remain disabled or destination-owned.</p>
 1278:                 </div>
 1279:               </div>
 1280:               <div class="ops-action-row">
 1281:                 <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
 1282:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Job Owning Context") : ""}
 1283:               </div>
 1284:               <div class="ops-log-list">
 1285:                 ${asArray(jobMonitor.execution_logs).length ? asArray(jobMonitor.execution_logs).slice(0, 4).map((item) => `
 1286:                   <div class="ops-log-item">
 1287:                     <span class="card-badge ${badgeTone(item.severity)}">${escapeHtml(titleCase(item.category || "log"))}</span>
 1288:                     <strong>${escapeHtml(item.title || "Execution event")}</strong>
 1289:                     <p>${escapeHtml(item.summary || "-")}</p>
 1290:                     <div class="ops-log-meta">
 1291:                       <span>${escapeHtml(formatDateTime(item.timestamp))}</span>
 1292:                       ${renderRouteAction(item, escapeHtml, "Open")}
 1293:                     </div>
 1294:                   </div>
 1295:                 `).join("") : `<div class="empty-box">Execution logs will appear here as jobs run.</div>`}
 1296:               </div>
 1297:               <div class="ops-deferred-list">
 1298:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (disabled: future mutation safety pass)</button>
 1299:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (disabled: future destructive mutation safety pass)</button>
 1300:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (disabled: backend worker-control safety pass)</button>
 1301:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (disabled: future destructive mutation safety pass)</button>
 1302:               </div>
 1303:             </section>
 1304: 
 1305:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1306:               <div class="panel-header">
 1307:                 <div>
 1308:                   <p class="mhos-os-kicker">AI Panel</p>
 1309:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1310:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No retry, cancel, rerun, delete, worker trigger, approve, publish, Governance bypass, or backend execution is performed.</p>
 1311:                 </div>
 1312:               </div>
 1313:               <div class="ops-action-row">
 1314:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Job Context</button>
 1315:               </div>
 1316:               <div class="quick-actions">
 1317:                 ${prompts.map((item, index) => `
 1318:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1319:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1320:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1321:                   </button>
 1322:                 `).join("")}
 1323:               </div>
 1324:             </section>
 1325:           </aside>
 1326:         </div>
 1327:       </div>
 1328:     </section>
 1329:   `;
 1330: }
 1331: 
 1332: function renderJobMonitor(context, state, projectName) {
 1333:   const root = context.$("pageRoot");
```

#### Match 10 — line 1301

```js
 1266:                     { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) }
 1267:                   ], escapeHtml)}
 1268:                 </div>
 1269:               ` : `<div class="empty-box">No job is selected.</div>`}
 1270:             </section>
 1271: 
 1272:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
 1273:               <div class="panel-header">
 1274:                 <div>
 1275:                   <p class="mhos-os-kicker">Action Panel</p>
 1276:                   <h3 class="mhos-os-panel-title">Job review actions</h3>
 1277:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Job retry, cancel, rerun, delete, worker execution, publishing, and approval mutations remain disabled or destination-owned.</p>
 1278:                 </div>
 1279:               </div>
 1280:               <div class="ops-action-row">
 1281:                 <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
 1282:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Job Owning Context") : ""}
 1283:               </div>
 1284:               <div class="ops-log-list">
 1285:                 ${asArray(jobMonitor.execution_logs).length ? asArray(jobMonitor.execution_logs).slice(0, 4).map((item) => `
 1286:                   <div class="ops-log-item">
 1287:                     <span class="card-badge ${badgeTone(item.severity)}">${escapeHtml(titleCase(item.category || "log"))}</span>
 1288:                     <strong>${escapeHtml(item.title || "Execution event")}</strong>
 1289:                     <p>${escapeHtml(item.summary || "-")}</p>
 1290:                     <div class="ops-log-meta">
 1291:                       <span>${escapeHtml(formatDateTime(item.timestamp))}</span>
 1292:                       ${renderRouteAction(item, escapeHtml, "Open")}
 1293:                     </div>
 1294:                   </div>
 1295:                 `).join("") : `<div class="empty-box">Execution logs will appear here as jobs run.</div>`}
 1296:               </div>
 1297:               <div class="ops-deferred-list">
 1298:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (disabled: future mutation safety pass)</button>
 1299:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (disabled: future destructive mutation safety pass)</button>
 1300:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (disabled: backend worker-control safety pass)</button>
 1301:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (disabled: future destructive mutation safety pass)</button>
 1302:               </div>
 1303:             </section>
 1304: 
 1305:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1306:               <div class="panel-header">
 1307:                 <div>
 1308:                   <p class="mhos-os-kicker">AI Panel</p>
 1309:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1310:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No retry, cancel, rerun, delete, worker trigger, approve, publish, Governance bypass, or backend execution is performed.</p>
 1311:                 </div>
 1312:               </div>
 1313:               <div class="ops-action-row">
 1314:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Job Context</button>
 1315:               </div>
 1316:               <div class="quick-actions">
 1317:                 ${prompts.map((item, index) => `
 1318:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1319:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1320:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1321:                   </button>
 1322:                 `).join("")}
 1323:               </div>
 1324:             </section>
 1325:           </aside>
 1326:         </div>
 1327:       </div>
 1328:     </section>
 1329:   `;
 1330: }
 1331: 
 1332: function renderJobMonitor(context, state, projectName) {
 1333:   const root = context.$("pageRoot");
 1334:   if (!root) return;
 1335: 
 1336:   const jobMonitor = asObject(asObject(state.data.operations).job_monitor);
```

#### Match 11 — line 1723

```js
 1688:                   ], escapeHtml)}
 1689:                 </div>
 1690:               ` : `<div class="empty-box">No notification is selected.</div>`}
 1691:             </section>
 1692: 
 1693:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
 1694:               <div class="panel-header">
 1695:                 <div>
 1696:                   <p class="mhos-os-kicker">Action Panel</p>
 1697:                   <h3 class="mhos-os-panel-title">Notification review actions</h3>
 1698:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
 1699:                 </div>
 1700:               </div>
 1701:               <div class="ops-action-row">
 1702:                 <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
 1703:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Source Page") : ""}
 1704:                 ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}" title="Updates notification read-state only. Does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.">Mark Read (read-state only)</button>` : ""}
 1705:               </div>
 1706:               ${selectedItem ? renderGovernanceDecisionActions(selectedItem, escapeHtml) : ""}
 1707:               <div class="ops-mini-list">
 1708:                 <div class="ops-mini-item">
 1709:                   <strong>${escapeHtml("Approval pending")}</strong>
 1710:                   <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
 1711:                 </div>
 1712:                 <div class="ops-mini-item">
 1713:                   <strong>${escapeHtml("Provider health")}</strong>
 1714:                   <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
 1715:                 </div>
 1716:                 <div class="ops-mini-item">
 1717:                   <strong>${escapeHtml("Claim risk")}</strong>
 1718:                   <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
 1719:                 </div>
 1720:               </div>
 1721:               <div class="ops-deferred-list">
 1722:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (disabled: future lifecycle mutation safety pass)</button>
 1723:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (disabled: future incident-resolution safety pass)</button>
 1724:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (disabled: future visibility mutation safety pass)</button>
 1725:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (disabled: future destructive mutation safety pass)</button>
 1726:               </div>
 1727:             </section>
 1728: 
 1729:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1730:               <div class="panel-header">
 1731:                 <div>
 1732:                   <p class="mhos-os-kicker">AI Panel</p>
 1733:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1734:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No mark-read, acknowledge, resolve, dismiss, delete, send, approve, publish, Governance bypass, or backend execution is performed.</p>
 1735:                 </div>
 1736:               </div>
 1737:               <div class="ops-action-row">
 1738:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Notification Context</button>
 1739:               </div>
 1740:               <div class="quick-actions">
 1741:                 ${prompts.map((item, index) => `
 1742:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1743:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1744:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1745:                   </button>
 1746:                 `).join("")}
 1747:               </div>
 1748:             </section>
 1749:           </aside>
 1750:         </div>
 1751:       </div>
 1752:     </section>
 1753:   `;
 1754: 
 1755:   const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
 1756:   const refreshNotificationCenter = () => {
 1757:     if (context.fetchProjectNotificationCenter && projectName) {
 1758:       session.isLoading = true;
```

#### Match 12 — line 1725

```js
 1690:               ` : `<div class="empty-box">No notification is selected.</div>`}
 1691:             </section>
 1692: 
 1693:             <section class="panel ops-action-panel mhos-clean-surface mhos-os-evidence-panel">
 1694:               <div class="panel-header">
 1695:                 <div>
 1696:                   <p class="mhos-os-kicker">Action Panel</p>
 1697:                   <h3 class="mhos-os-panel-title">Notification review actions</h3>
 1698:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
 1699:                 </div>
 1700:               </div>
 1701:               <div class="ops-action-row">
 1702:                 <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
 1703:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Source Page") : ""}
 1704:                 ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}" title="Updates notification read-state only. Does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.">Mark Read (read-state only)</button>` : ""}
 1705:               </div>
 1706:               ${selectedItem ? renderGovernanceDecisionActions(selectedItem, escapeHtml) : ""}
 1707:               <div class="ops-mini-list">
 1708:                 <div class="ops-mini-item">
 1709:                   <strong>${escapeHtml("Approval pending")}</strong>
 1710:                   <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
 1711:                 </div>
 1712:                 <div class="ops-mini-item">
 1713:                   <strong>${escapeHtml("Provider health")}</strong>
 1714:                   <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
 1715:                 </div>
 1716:                 <div class="ops-mini-item">
 1717:                   <strong>${escapeHtml("Claim risk")}</strong>
 1718:                   <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
 1719:                 </div>
 1720:               </div>
 1721:               <div class="ops-deferred-list">
 1722:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (disabled: future lifecycle mutation safety pass)</button>
 1723:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (disabled: future incident-resolution safety pass)</button>
 1724:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (disabled: future visibility mutation safety pass)</button>
 1725:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (disabled: future destructive mutation safety pass)</button>
 1726:               </div>
 1727:             </section>
 1728: 
 1729:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1730:               <div class="panel-header">
 1731:                 <div>
 1732:                   <p class="mhos-os-kicker">AI Panel</p>
 1733:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1734:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No mark-read, acknowledge, resolve, dismiss, delete, send, approve, publish, Governance bypass, or backend execution is performed.</p>
 1735:                 </div>
 1736:               </div>
 1737:               <div class="ops-action-row">
 1738:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Notification Context</button>
 1739:               </div>
 1740:               <div class="quick-actions">
 1741:                 ${prompts.map((item, index) => `
 1742:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1743:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1744:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1745:                   </button>
 1746:                 `).join("")}
 1747:               </div>
 1748:             </section>
 1749:           </aside>
 1750:         </div>
 1751:       </div>
 1752:     </section>
 1753:   `;
 1754: 
 1755:   const rerender = () => renderNotificationCenter(context, context.getState(), projectName);
 1756:   const refreshNotificationCenter = () => {
 1757:     if (context.fetchProjectNotificationCenter && projectName) {
 1758:       session.isLoading = true;
 1759:       session.errorMessage = "";
 1760:       rerender();
```
### Clipboard/copy only

#### Match 1 — line 471

```js
  436:     incomingHandoff.payload?.summary ||
  437:     "Incoming task handoff"
  438:   );
  439:   const description = asString(
  440:     incomingHandoff.description ||
  441:     incomingHandoff.payload?.description ||
  442:     incomingHandoff.payload?.handoff_intent ||
  443:     incomingHandoff.payload?.prompt ||
  444:     "Review-only handoff prepared by another MH-OS surface."
  445:   );
  446:   const createdAt = asString(incomingHandoff.created_at || incomingHandoff.generatedAt || incomingHandoff.timestamp || "");
  447: 
  448:   return `
  449:     <section class="panel ops-incoming-handoff mhos-clean-surface">
  450:       <div class="panel-header">
  451:         <div>
  452:           <div class="panel-kicker">Incoming Handoff</div>
  453:           <h3>Incoming Review-Only Task Handoff</h3>
  454:           <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically from this handoff.</p>
  455:         </div>
  456:         <span class="card-badge warning">Review-only</span>
  457:       </div>
  458:       <div class="ops-detail-stack">
  459:         <div class="ops-detail-summary">
  460:           <strong>${escapeHtml(title)}</strong>
  461:           <p>${escapeHtml(description)}</p>
  462:         </div>
  463:         ${renderOpsDetailRows([
  464:           { label: "Source", value: titleCase(source) },
  465:           { label: "Destination", value: "Task Center" },
  466:           { label: "Status", value: "Review-only intake" },
  467:           { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
  468:         ], escapeHtml)}
  469:       </div>
  470:       <div class="ops-action-row">
  471:         <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
  472:         <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace for Review</button>
  473:       </div>
  474:     </section>
  475:   `;
  476: }
  477: 
  478: 
  479: function renderTaskCenterLayout({
  480:   context,
  481:   projectName,
  482:   taskCenter,
  483:   session,
  484:   items,
  485:   selectedItem,
  486:   filters,
  487:   prompts,
  488:   incomingHandoff
  489: }) {
  490:   const escapeHtml = context.escapeHtml;
  491:   const projectLabel = projectName || "No project selected";
  492:   const hasFilters = Boolean(
  493:     asString(session.search).trim() ||
  494:     session.focus !== "all" ||
  495:     session.priority !== "all" ||
  496:     session.owner !== "all" ||
  497:     session.source !== "all"
  498:   );
  499:   const emptyText = hasFilters
  500:     ? "No tasks match the current filters."
  501:     : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";
  502: 
  503:   const selectedSummary = selectedItem
  504:     ? [
  505:       selectedItem.title || "Task",
  506:       selectedItem.description || "No description.",
```

#### Match 2 — line 646

```js
  611:                   <h3 class="mhos-os-panel-title">${escapeHtml(selectedItem?.title || "Select a task")}</h3>
  612:                   <p class="mhos-os-panel-copy">${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
  613:                 </div>
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```

#### Match 3 — line 765

```js
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
```

#### Match 4 — line 769

```js
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
```

#### Match 5 — line 771

```js
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
```

#### Match 6 — line 790

```js
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
  812:   });
  813:   root.querySelector("#taskCenterSearch")?.addEventListener("input", (event) => {
  814:     session.search = event.target.value || "";
  815:     rerender();
  816:   });
  817:   [["#taskCenterPriority", "priority"], ["#taskCenterOwner", "owner"], ["#taskCenterSource", "source"]].forEach(([selector, key]) => {
  818:     root.querySelector(selector)?.addEventListener("change", (event) => {
  819:       session[key] = event.target.value || "all";
  820:       rerender();
  821:     });
  822:   });
  823:   bindRouteButtons(root, context);
  824:   bindOpsAssistantButtons(root, context, prompts);
  825: }
```

#### Match 7 — line 797

```js
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
  812:   });
  813:   root.querySelector("#taskCenterSearch")?.addEventListener("input", (event) => {
  814:     session.search = event.target.value || "";
  815:     rerender();
  816:   });
  817:   [["#taskCenterPriority", "priority"], ["#taskCenterOwner", "owner"], ["#taskCenterSource", "source"]].forEach(([selector, key]) => {
  818:     root.querySelector(selector)?.addEventListener("change", (event) => {
  819:       session[key] = event.target.value || "all";
  820:       rerender();
  821:     });
  822:   });
  823:   bindRouteButtons(root, context);
  824:   bindOpsAssistantButtons(root, context, prompts);
  825: }
  826: 
  827: function renderQueueCenterLayout({
  828:   context,
  829:   projectName,
  830:   queueCenter,
  831:   session,
  832:   items,
```

#### Match 8 — line 800

```js
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
  812:   });
  813:   root.querySelector("#taskCenterSearch")?.addEventListener("input", (event) => {
  814:     session.search = event.target.value || "";
  815:     rerender();
  816:   });
  817:   [["#taskCenterPriority", "priority"], ["#taskCenterOwner", "owner"], ["#taskCenterSource", "source"]].forEach(([selector, key]) => {
  818:     root.querySelector(selector)?.addEventListener("change", (event) => {
  819:       session[key] = event.target.value || "all";
  820:       rerender();
  821:     });
  822:   });
  823:   bindRouteButtons(root, context);
  824:   bindOpsAssistantButtons(root, context, prompts);
  825: }
  826: 
  827: function renderQueueCenterLayout({
  828:   context,
  829:   projectName,
  830:   queueCenter,
  831:   session,
  832:   items,
  833:   selectedItem,
  834:   queueCounts,
  835:   prompts
```
### Route only

#### Match 1 — line 73

```js
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
```

#### Match 2 — line 75

```js
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
```

#### Match 3 — line 77

```js
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
```

#### Match 4 — line 78

```js
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
```

#### Match 5 — line 121

```js
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
```

#### Match 6 — line 122

```js
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
```

#### Match 7 — line 132

```js
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
```

#### Match 8 — line 380

```js
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
  363:   const title = asString(options.title) || "System Signal";
  364:   const description = asString(options.description)
  365:     || "Cross-center runtime health, queue pressure, failures, publishing, governance, and provider signals.";
  366:   const badge = asString(options.badge) || "Live context";
  367: 
  368:   return `
  369:     <section class="panel ops-executive-strip mhos-os-section">
  370:       <div class="panel-header mhos-os-section-head">
  371:         <div>
  372:           <p class="mhos-os-kicker">${context.escapeHtml(kicker)}</p>
  373:           <h3 class="mhos-os-section-title">${context.escapeHtml(title)}</h3>
  374:           <p class="mhos-os-section-copy">${context.escapeHtml(description)}</p>
  375:         </div>
  376:         <span class="mhos-os-chip">${context.escapeHtml(badge)}</span>
  377:       </div>
  378:       <div class="ops-runtime-signal-grid mhos-os-attention-grid">
  379:         ${signals.map((signal) => `
  380:           <button class="ops-runtime-signal mhos-os-attention-card mhos-motion-soft" type="button" data-ops-route="${context.escapeHtml(signal.route)}" data-ops-label="${context.escapeHtml(signal.label)}">
  381:             <span class="mhos-os-chip ${context.escapeHtml(signal.tone)}">${context.escapeHtml(signal.label)}</span>
  382:             <strong class="mhos-os-path-title">${context.escapeHtml(asString(signal.value))}</strong>
  383:             <small class="mhos-os-path-meta">${context.escapeHtml(signal.helper)}</small>
  384:           </button>
  385:         `).join("")}
  386:       </div>
  387:     </section>
  388:   `;
  389: }
  390: 
  391: function renderFilterOptions(options, currentValue, escapeHtml, allLabel = "All") {
  392:   return [
  393:     `<option value="all">${escapeHtml(allLabel)}</option>`,
  394:     ...asArray(options).map((item) => {
  395:       const value = asString(item.value);
  396:       return `<option value="${escapeHtml(value)}"${value === currentValue ? " selected" : ""}>${escapeHtml(`${titleCase(value)} (${item.count})`)}</option>`;
  397:     })
  398:   ].join("");
  399: }
  400: 
  401: function renderRouteAction(item, escapeHtml, label = "Open") {
  402:   const route = asString(item?.route?.route || item?.route || item?.route_target);
  403:   if (!route) return "";
  404: 
  405:   return `<button class="btn btn-secondary btn-sm" type="button" data-ops-route="${escapeHtml(route)}" data-ops-label="${escapeHtml(asString(item?.title || item?.name || label))}">${escapeHtml(label)}</button>`;
  406: }
  407: 
  408: function renderOpsTable(columns, rows, emptyText, escapeHtml) {
  409:   if (!rows.length) {
  410:     return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  411:   }
  412: 
  413:   return `
  414:     <div class="ops-table-wrap">
  415:       <table class="ops-table">
```

#### Match 9 — line 401

```js
  366:   const badge = asString(options.badge) || "Live context";
  367: 
  368:   return `
  369:     <section class="panel ops-executive-strip mhos-os-section">
  370:       <div class="panel-header mhos-os-section-head">
  371:         <div>
  372:           <p class="mhos-os-kicker">${context.escapeHtml(kicker)}</p>
  373:           <h3 class="mhos-os-section-title">${context.escapeHtml(title)}</h3>
  374:           <p class="mhos-os-section-copy">${context.escapeHtml(description)}</p>
  375:         </div>
  376:         <span class="mhos-os-chip">${context.escapeHtml(badge)}</span>
  377:       </div>
  378:       <div class="ops-runtime-signal-grid mhos-os-attention-grid">
  379:         ${signals.map((signal) => `
  380:           <button class="ops-runtime-signal mhos-os-attention-card mhos-motion-soft" type="button" data-ops-route="${context.escapeHtml(signal.route)}" data-ops-label="${context.escapeHtml(signal.label)}">
  381:             <span class="mhos-os-chip ${context.escapeHtml(signal.tone)}">${context.escapeHtml(signal.label)}</span>
  382:             <strong class="mhos-os-path-title">${context.escapeHtml(asString(signal.value))}</strong>
  383:             <small class="mhos-os-path-meta">${context.escapeHtml(signal.helper)}</small>
  384:           </button>
  385:         `).join("")}
  386:       </div>
  387:     </section>
  388:   `;
  389: }
  390: 
  391: function renderFilterOptions(options, currentValue, escapeHtml, allLabel = "All") {
  392:   return [
  393:     `<option value="all">${escapeHtml(allLabel)}</option>`,
  394:     ...asArray(options).map((item) => {
  395:       const value = asString(item.value);
  396:       return `<option value="${escapeHtml(value)}"${value === currentValue ? " selected" : ""}>${escapeHtml(`${titleCase(value)} (${item.count})`)}</option>`;
  397:     })
  398:   ].join("");
  399: }
  400: 
  401: function renderRouteAction(item, escapeHtml, label = "Open") {
  402:   const route = asString(item?.route?.route || item?.route || item?.route_target);
  403:   if (!route) return "";
  404: 
  405:   return `<button class="btn btn-secondary btn-sm" type="button" data-ops-route="${escapeHtml(route)}" data-ops-label="${escapeHtml(asString(item?.title || item?.name || label))}">${escapeHtml(label)}</button>`;
  406: }
  407: 
  408: function renderOpsTable(columns, rows, emptyText, escapeHtml) {
  409:   if (!rows.length) {
  410:     return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  411:   }
  412: 
  413:   return `
  414:     <div class="ops-table-wrap">
  415:       <table class="ops-table">
  416:         <thead>
  417:           <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
  418:         </thead>
  419:         <tbody>
  420:           ${rows.join("")}
  421:         </tbody>
  422:       </table>
  423:     </div>
  424:   `;
  425: }
  426: 
  427: 
  428: function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
  429:   if (!incomingHandoff) return "";
  430: 
  431:   const source = asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown");
  432:   const title = asString(
  433:     incomingHandoff.title ||
  434:     incomingHandoff.summary ||
  435:     incomingHandoff.payload?.title ||
  436:     incomingHandoff.payload?.summary ||
```

#### Match 10 — line 405

```js
  370:       <div class="panel-header mhos-os-section-head">
  371:         <div>
  372:           <p class="mhos-os-kicker">${context.escapeHtml(kicker)}</p>
  373:           <h3 class="mhos-os-section-title">${context.escapeHtml(title)}</h3>
  374:           <p class="mhos-os-section-copy">${context.escapeHtml(description)}</p>
  375:         </div>
  376:         <span class="mhos-os-chip">${context.escapeHtml(badge)}</span>
  377:       </div>
  378:       <div class="ops-runtime-signal-grid mhos-os-attention-grid">
  379:         ${signals.map((signal) => `
  380:           <button class="ops-runtime-signal mhos-os-attention-card mhos-motion-soft" type="button" data-ops-route="${context.escapeHtml(signal.route)}" data-ops-label="${context.escapeHtml(signal.label)}">
  381:             <span class="mhos-os-chip ${context.escapeHtml(signal.tone)}">${context.escapeHtml(signal.label)}</span>
  382:             <strong class="mhos-os-path-title">${context.escapeHtml(asString(signal.value))}</strong>
  383:             <small class="mhos-os-path-meta">${context.escapeHtml(signal.helper)}</small>
  384:           </button>
  385:         `).join("")}
  386:       </div>
  387:     </section>
  388:   `;
  389: }
  390: 
  391: function renderFilterOptions(options, currentValue, escapeHtml, allLabel = "All") {
  392:   return [
  393:     `<option value="all">${escapeHtml(allLabel)}</option>`,
  394:     ...asArray(options).map((item) => {
  395:       const value = asString(item.value);
  396:       return `<option value="${escapeHtml(value)}"${value === currentValue ? " selected" : ""}>${escapeHtml(`${titleCase(value)} (${item.count})`)}</option>`;
  397:     })
  398:   ].join("");
  399: }
  400: 
  401: function renderRouteAction(item, escapeHtml, label = "Open") {
  402:   const route = asString(item?.route?.route || item?.route || item?.route_target);
  403:   if (!route) return "";
  404: 
  405:   return `<button class="btn btn-secondary btn-sm" type="button" data-ops-route="${escapeHtml(route)}" data-ops-label="${escapeHtml(asString(item?.title || item?.name || label))}">${escapeHtml(label)}</button>`;
  406: }
  407: 
  408: function renderOpsTable(columns, rows, emptyText, escapeHtml) {
  409:   if (!rows.length) {
  410:     return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  411:   }
  412: 
  413:   return `
  414:     <div class="ops-table-wrap">
  415:       <table class="ops-table">
  416:         <thead>
  417:           <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
  418:         </thead>
  419:         <tbody>
  420:           ${rows.join("")}
  421:         </tbody>
  422:       </table>
  423:     </div>
  424:   `;
  425: }
  426: 
  427: 
  428: function renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml) {
  429:   if (!incomingHandoff) return "";
  430: 
  431:   const source = asString(incomingHandoff.source_page || incomingHandoff.sourcePage || "unknown");
  432:   const title = asString(
  433:     incomingHandoff.title ||
  434:     incomingHandoff.summary ||
  435:     incomingHandoff.payload?.title ||
  436:     incomingHandoff.payload?.summary ||
  437:     "Incoming task handoff"
  438:   );
  439:   const description = asString(
  440:     incomingHandoff.description ||
```

#### Match 11 — line 597

```js
  562:               { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
  563:               { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
  564:             ], session.focus, escapeHtml)}
  565: 
  566:             <div class="ops-toolbar">
  567:               <input id="taskCenterSearch" class="command-input" type="text" placeholder="Search tasks, owners, domains..." value="${escapeHtml(session.search)}">
  568:               <select id="taskCenterPriority" class="sidebar-select">${renderFilterOptions(filters.priorities, session.priority, escapeHtml, "All priorities")}</select>
  569:               <select id="taskCenterOwner" class="sidebar-select">${renderFilterOptions(filters.owners, session.owner, escapeHtml, "All owners")}</select>
  570:               <select id="taskCenterSource" class="sidebar-select">${renderFilterOptions(filters.source_pages, session.source, escapeHtml, "All sources")}</select>
  571:             </div>
  572: 
  573:             ${session.errorMessage ? `<div class="error-state" aria-live="assertive">${escapeHtml(session.errorMessage)}</div>` : ""}
  574: 
  575:             ${renderOpsTable(
  576:               ["Task", "Owner", "Due", "Priority", "Source", "Linked", "Status", "Route"],
  577:               items.map((item) => `
  578:                 <tr class="${selectedItem?._opsKey === item._opsKey ? "is-selected" : ""}">
  579:                   <td>
  580:                     <button class="ops-select-link" type="button" data-ops-select="${escapeHtml(item._opsKey)}">
  581:                       <strong>${escapeHtml(item.title || "Task")}</strong>
  582:                       <span>${escapeHtml(item.description || item.service_domain || "-")}</span>
  583:                     </button>
  584:                   </td>
  585:                   <td>
  586:                     <strong>${escapeHtml(item.assignee || item.owner || "-")}</strong>
  587:                     <span>${escapeHtml(titleCase(item.assignee_role || item.owner_role || "-"))}</span>
  588:                   </td>
  589:                   <td>
  590:                     <strong>${escapeHtml(formatDateTime(item.due_at))}</strong>
  591:                     <span class="card-badge ${badgeTone(item.due_state)}">${escapeHtml(titleCase(item.due_state || "unscheduled"))}</span>
  592:                   </td>
  593:                   <td><span class="card-badge ${badgeTone(item.priority)}">${escapeHtml(titleCase(item.priority || "normal"))}</span></td>
  594:                   <td>${escapeHtml(titleCase(item.source_page || "-"))}</td>
  595:                   <td>${escapeHtml(item.linked_entity?.label || item.linked_entity?.entity_type || "-")}</td>
  596:                   <td><span class="card-badge ${badgeTone(item.status)}">${escapeHtml(titleCase(item.status || "open"))}</span></td>
  597:                   <td>${renderRouteAction(item, escapeHtml)}</td>
  598:                 </tr>
  599:               `),
  600:               emptyText,
  601:               escapeHtml
  602:             )}
  603:           </article>
  604: 
  605:           <aside class="ops-right-rail mhos-clean-stack mhos-os-rail">
  606:             ${renderTaskCenterIncomingHandoff(incomingHandoff, escapeHtml)}
  607:             <section class="panel ops-detail-card mhos-clean-surface mhos-os-ai-panel">
  608:               <div class="panel-header">
  609:                 <div>
  610:                   <p class="mhos-os-kicker">Selected Task</p>
  611:                   <h3 class="mhos-os-panel-title">${escapeHtml(selectedItem?.title || "Select a task")}</h3>
  612:                   <p class="mhos-os-panel-copy">${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
  613:                 </div>
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
  631:                 </div>
  632:               ` : `<div class="empty-box">No task is selected.</div>`}
```

#### Match 12 — line 645

```js
  610:                   <p class="mhos-os-kicker">Selected Task</p>
  611:                   <h3 class="mhos-os-panel-title">${escapeHtml(selectedItem?.title || "Select a task")}</h3>
  612:                   <p class="mhos-os-panel-copy">${escapeHtml(selectedItem ? "Review owner, due-state, linked work, and follow-up context." : "Choose a task in the table to inspect details.")}</p>
  613:                 </div>
  614:               </div>
  615:               ${selectedItem ? `
  616:                 <div class="ops-detail-stack">
  617:                   <div class="ops-detail-summary">
  618:                     <strong>${escapeHtml(selectedItem.title || "Task")}</strong>
  619:                     <p>${escapeHtml(selectedItem.description || "No task description available.")}</p>
  620:                   </div>
  621:                   ${renderOpsDetailRows([
  622:                     { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
  623:                     { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
  624:                     { label: "Due", value: formatDateTime(selectedItem.due_at) },
  625:                     { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
  626:                     { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
  627:                     { label: "Source", value: titleCase(selectedItem.source_page || "-") },
  628:                     { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
  629:                     { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
  630:                   ], escapeHtml)}
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
```
### AI prompt only

#### Match 1 — line 95

```js
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
```

#### Match 2 — line 119

```js
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
```

#### Match 3 — line 122

```js
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
```

#### Match 4 — line 126

```js
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
```

#### Match 5 — line 128

```js
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
```

#### Match 6 — line 131

```js
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
```

#### Match 7 — line 133

```js
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

#### Match 8 — line 472

```js
  437:     "Incoming task handoff"
  438:   );
  439:   const description = asString(
  440:     incomingHandoff.description ||
  441:     incomingHandoff.payload?.description ||
  442:     incomingHandoff.payload?.handoff_intent ||
  443:     incomingHandoff.payload?.prompt ||
  444:     "Review-only handoff prepared by another MH-OS surface."
  445:   );
  446:   const createdAt = asString(incomingHandoff.created_at || incomingHandoff.generatedAt || incomingHandoff.timestamp || "");
  447: 
  448:   return `
  449:     <section class="panel ops-incoming-handoff mhos-clean-surface">
  450:       <div class="panel-header">
  451:         <div>
  452:           <div class="panel-kicker">Incoming Handoff</div>
  453:           <h3>Incoming Review-Only Task Handoff</h3>
  454:           <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically from this handoff.</p>
  455:         </div>
  456:         <span class="card-badge warning">Review-only</span>
  457:       </div>
  458:       <div class="ops-detail-stack">
  459:         <div class="ops-detail-summary">
  460:           <strong>${escapeHtml(title)}</strong>
  461:           <p>${escapeHtml(description)}</p>
  462:         </div>
  463:         ${renderOpsDetailRows([
  464:           { label: "Source", value: titleCase(source) },
  465:           { label: "Destination", value: "Task Center" },
  466:           { label: "Status", value: "Review-only intake" },
  467:           { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
  468:         ], escapeHtml)}
  469:       </div>
  470:       <div class="ops-action-row">
  471:         <button class="btn btn-secondary" type="button" id="taskCenterCopyHandoffBtn">Copy Handoff Summary</button>
  472:         <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace for Review</button>
  473:       </div>
  474:     </section>
  475:   `;
  476: }
  477: 
  478: 
  479: function renderTaskCenterLayout({
  480:   context,
  481:   projectName,
  482:   taskCenter,
  483:   session,
  484:   items,
  485:   selectedItem,
  486:   filters,
  487:   prompts,
  488:   incomingHandoff
  489: }) {
  490:   const escapeHtml = context.escapeHtml;
  491:   const projectLabel = projectName || "No project selected";
  492:   const hasFilters = Boolean(
  493:     asString(session.search).trim() ||
  494:     session.focus !== "all" ||
  495:     session.priority !== "all" ||
  496:     session.owner !== "all" ||
  497:     session.source !== "all"
  498:   );
  499:   const emptyText = hasFilters
  500:     ? "No tasks match the current filters."
  501:     : "No tasks are available for this project yet. Use Refresh or adjust project context to load latest assignments.";
  502: 
  503:   const selectedSummary = selectedItem
  504:     ? [
  505:       selectedItem.title || "Task",
  506:       selectedItem.description || "No description.",
  507:       `Assignee: ${selectedItem.assignee || selectedItem.owner || "-"}`,
```

#### Match 9 — line 666

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
```

#### Match 10 — line 670

```js
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
```

#### Match 11 — line 1019

```js
  984:                 <div>
  985:                   <p class="mhos-os-kicker">Action Panel</p>
  986:                   <h3 class="mhos-os-panel-title">Queue review actions</h3>
  987:                   <p class="mhos-os-panel-copy">Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
  988:                 </div>
  989:               </div>
  990:               <div class="ops-action-row">
  991:                 <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
  992:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  993:               </div>
  994:               <div class="ops-mini-list">
  995:                 ${queueCounts.map((item) => `
  996:                   <div class="ops-mini-item">
  997:                     <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
  998:                     <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
  999:                   </div>
 1000:                 `).join("")}
 1001:               </div>
 1002:               <div class="ops-deferred-list">
 1003:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
 1004:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
 1005:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
 1006:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
 1007:               </div>
 1008:             </section>
 1009: 
 1010:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1011:               <div class="panel-header">
 1012:                 <div>
 1013:                   <p class="mhos-os-kicker">AI Panel</p>
 1014:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1015:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
 1016:                 </div>
 1017:               </div>
 1018:               <div class="ops-action-row">
 1019:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
 1020:               </div>
 1021:               <div class="quick-actions">
 1022:                 ${prompts.map((item, index) => `
 1023:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1024:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1025:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1026:                   </button>
 1027:                 `).join("")}
 1028:               </div>
 1029:             </section>
 1030:           </aside>
 1031:         </div>
 1032:       </div>
 1033:     </section>
 1034:   `;
 1035: }
 1036: 
 1037: function renderQueueCenter(context, state, projectName) {
 1038:   const root = context.$("pageRoot");
 1039:   if (!root) return;
 1040: 
 1041:   const queueCenter = asObject(asObject(state.data.operations).queue_center);
 1042:   const session = ensureSession(queueSessions, projectName, {
 1043:     focus: "all",
 1044:     status: "all",
 1045:     search: "",
 1046:     selectedKey: "",
 1047:     isLoading: false,
 1048:     errorMessage: ""
 1049:   });
 1050: 
 1051:   let items = asArray(queueCenter.items).map((item, index) => ({
 1052:     ...item,
 1053:     _opsKey: getOpsItemKey(item, index, "queue")
 1054:   }));
```

#### Match 12 — line 1023

```js
  988:                 </div>
  989:               </div>
  990:               <div class="ops-action-row">
  991:                 <button class="btn btn-primary" type="button" id="queueCenterRefreshBtn">Refresh Queue Center</button>
  992:                 ${selectedItem ? renderRouteAction(selectedItem, escapeHtml, "Open Owning Workspace") : ""}
  993:               </div>
  994:               <div class="ops-mini-list">
  995:                 ${queueCounts.map((item) => `
  996:                   <div class="ops-mini-item">
  997:                     <strong>${escapeHtml(titleCase(item.queue_type || "queue"))}</strong>
  998:                     <span>${escapeHtml(`${formatCount(item.active)} active of ${formatCount(item.total)}`)}</span>
  999:                   </div>
 1000:                 `).join("")}
 1001:               </div>
 1002:               <div class="ops-deferred-list">
 1003:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry item (disabled: future mutation safety pass)</button>
 1004:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
 1005:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
 1006:                 <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Remove item (disabled: future destructive mutation safety pass)</button>
 1007:               </div>
 1008:             </section>
 1009: 
 1010:             <section class="panel ops-ai-panel mhos-clean-surface mhos-os-ai-panel">
 1011:               <div class="panel-header">
 1012:                 <div>
 1013:                   <p class="mhos-os-kicker">AI Panel</p>
 1014:                   <h3 class="mhos-os-panel-title">Operations AI Assistant</h3>
 1015:                   <p class="mhos-os-panel-copy">Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
 1016:                 </div>
 1017:               </div>
 1018:               <div class="ops-action-row">
 1019:                 <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review Queue Context</button>
 1020:               </div>
 1021:               <div class="quick-actions">
 1022:                 ${prompts.map((item, index) => `
 1023:                   <button class="quick-action-btn" type="button" data-ops-ai-prompt="${index}">
 1024:                     <span class="ops-prompt-title">${escapeHtml(item.label)}</span>
 1025:                     <span class="ops-prompt-meta">${escapeHtml(item.preview)}</span>
 1026:                   </button>
 1027:                 `).join("")}
 1028:               </div>
 1029:             </section>
 1030:           </aside>
 1031:         </div>
 1032:       </div>
 1033:     </section>
 1034:   `;
 1035: }
 1036: 
 1037: function renderQueueCenter(context, state, projectName) {
 1038:   const root = context.$("pageRoot");
 1039:   if (!root) return;
 1040: 
 1041:   const queueCenter = asObject(asObject(state.data.operations).queue_center);
 1042:   const session = ensureSession(queueSessions, projectName, {
 1043:     focus: "all",
 1044:     status: "all",
 1045:     search: "",
 1046:     selectedKey: "",
 1047:     isLoading: false,
 1048:     errorMessage: ""
 1049:   });
 1050: 
 1051:   let items = asArray(queueCenter.items).map((item, index) => ({
 1052:     ...item,
 1053:     _opsKey: getOpsItemKey(item, index, "queue")
 1054:   }));
 1055:   items = filterBySearch(items, session.search, ["title", "assignee", "queue_type", "status"]);
 1056:   if (session.focus !== "all") items = items.filter((item) => asString(item.queue_type) === session.focus);
 1057:   if (session.status !== "all") items = items.filter((item) => asString(item.status) === session.status);
 1058:   const selectedItem = items.find((item) => item._opsKey === session.selectedKey) || items[0] || null;
```
### Notification possible mutation labels

#### Match 1 — line 5

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
```

#### Match 2 — line 89

```js
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
```

#### Match 3 — line 245

```js
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
```

#### Match 4 — line 246

```js
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
```

#### Match 5 — line 251

```js
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
```

#### Match 6 — line 255

```js
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
```

#### Match 7 — line 256

```js
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
```

#### Match 8 — line 272

```js
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
```

#### Match 9 — line 278

```js
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
```

#### Match 10 — line 279

```js
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
```

#### Match 11 — line 281

```js
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
```

#### Match 12 — line 282

```js
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
```
### Queue possible mutation labels

#### Match 1 — line 3

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
```

#### Match 2 — line 45

```js
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
```

#### Match 3 — line 46

```js
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
```

#### Match 4 — line 88

```js
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
```

#### Match 5 — line 197

```js
  162:         </div>
  163:       `).join("")}
  164:     </div>
  165:   `;
  166: }
  167: 
  168: function buildOpsAssistantPrompts(pageKey, projectName, selectedItem, focusLabel) {
  169:   const projectLabel = projectName || "this project";
  170:   const itemLabel = asString(selectedItem?.title || selectedItem?.name || selectedItem?.message || "the selected item");
  171: 
  172:   if (pageKey === "task-center") {
  173:     return [
  174:       {
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 6 — line 202

```js
  167: 
  168: function buildOpsAssistantPrompts(pageKey, projectName, selectedItem, focusLabel) {
  169:   const projectLabel = projectName || "this project";
  170:   const itemLabel = asString(selectedItem?.title || selectedItem?.name || selectedItem?.message || "the selected item");
  171: 
  172:   if (pageKey === "task-center") {
  173:     return [
  174:       {
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 7 — line 205

```js
  170:   const itemLabel = asString(selectedItem?.title || selectedItem?.name || selectedItem?.message || "the selected item");
  171: 
  172:   if (pageKey === "task-center") {
  173:     return [
  174:       {
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 8 — line 206

```js
  171: 
  172:   if (pageKey === "task-center") {
  173:     return [
  174:       {
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 9 — line 207

```js
  172:   if (pageKey === "task-center") {
  173:     return [
  174:       {
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 10 — line 210

```js
  175:         label: "Prioritize backlog",
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 11 — line 211

```js
  176:         preview: "Review the current task backlog and identify the highest-impact next work.",
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```

#### Match 12 — line 212

```js
  177:         prompt: `Review the current task backlog for ${projectLabel}. Prioritize the next work based on blocked items, due-state, ownership, and operational impact.`
  178:       },
  179:       {
  180:         label: "Unblock selected task",
  181:         preview: "Explain how to unblock the current task and who should act next.",
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
```
### Job possible mutation labels

#### Match 1 — line 4

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
```

#### Match 2 — line 45

```js
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
```

#### Match 3 — line 87

```js
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
```

#### Match 4 — line 222

```js
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
```

#### Match 5 — line 227

```js
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
```

#### Match 6 — line 230

```js
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
```

#### Match 7 — line 231

```js
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
```

#### Match 8 — line 232

```js
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
```

#### Match 9 — line 235

```js
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
```

#### Match 10 — line 236

```js
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
```

#### Match 11 — line 237

```js
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
```

#### Match 12 — line 267

```js
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
```
### Confirmation gates

#### Match 1 — line 1851

```js
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
```
### Known compact copy

#### Match 1 — line 711

```js
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
```

## Preliminary Verdict

| Area | Verdict |
|---|---|
| Real project mutation API calls | Found 1 - inspect before patch/closeout |
| Context mutation callbacks | Found 1 - inspect before patch/closeout |
| Raw fetch calls | Not found |
| Refresh/read behavior | Found 13 |
| Disabled mutation controls | Found 7 |
| Copy-only actions | Found 4 |
| Route-only actions | Found 10 |
| AI prompt-only actions | Found 14 |
| Confirmation gates | Found 1 |
| Compact copy issues | Found 1 - UX/copy polish candidate |

## Decision Guidance
- If real project mutation API calls and context mutation callbacks are not found, Operations Centers likely needs no runtime authority patch.
- Refresh/read-only calls do not require confirmation.
- Clipboard/copy, route-only, and AI prompt-only actions do not require confirmation.
- Disabled future mutation controls do not require confirmation because they cannot execute.
- Compact copy issues should not block runtime authority closeout unless a production patch is otherwise required.
