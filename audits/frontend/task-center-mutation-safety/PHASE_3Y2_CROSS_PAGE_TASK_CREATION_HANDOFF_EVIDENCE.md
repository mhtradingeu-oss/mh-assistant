# PHASE 3Y.2 — Cross-Page Task Creation / Handoff Evidence

## createProjectTask and listProjectTasks imports/usages
public/control-center/pages/media-studio-workspace.js:5:  createProjectTask,
public/control-center/pages/media-studio-workspace.js:18:  listProjectTasks,
public/control-center/pages/media-studio-workspace.js:582:      listProjectTasks(backendProjectName, 120),
public/control-center/pages/media-studio-workspace.js:2506:        <button id="mediaCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
public/control-center/pages/media-studio-workspace.js:3202:          await createProjectTask(backendProjectName, {
public/control-center/pages/media-studio-workspace.js:3225:        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
public/control-center/pages/operations-centers.js:172:  if (pageKey === "task-center") {
public/control-center/pages/operations-centers.js:182:        prompt: `Review ${itemLabel} in Task Center for ${projectLabel}. Explain what is blocking progress, who should act next, and the fastest unblock path.`
public/control-center/pages/operations-centers.js:187:        prompt: `Summarize execution risk in Task Center for ${projectLabel}. Focus on overdue, due soon, blocked, and ownership concentration risk.`
public/control-center/pages/operations-centers.js:192:        prompt: `Review owner workload in Task Center for ${projectLabel}. Explain concentration risk, likely bottlenecks, and redistribution recommendations for the next cycle.`
public/control-center/pages/operations-centers.js:454:          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically.</p>
public/control-center/pages/operations-centers.js:465:          { label: "Destination", value: "Task Center" },
public/control-center/pages/operations-centers.js:517:    <section class="page is-active" data-page="task-center">
public/control-center/pages/operations-centers.js:522:              <span class="std-context-eyebrow">TASK CENTER</span>
public/control-center/pages/operations-centers.js:523:              <h3 class="std-context-title">Task Center</h3>
public/control-center/pages/operations-centers.js:526:            <div class="std-context-metrics" aria-label="Task Center metrics">
public/control-center/pages/operations-centers.js:644:                <button class="btn btn-primary" type="button" id="taskCenterRefreshBtnRail">Refresh Task Center</button>
public/control-center/pages/operations-centers.js:717:  const prompts = buildOpsAssistantPrompts("task-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:718:  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);
public/control-center/pages/operations-centers.js:735:    if (context.fetchProjectTaskCenter && projectName) {
public/control-center/pages/operations-centers.js:739:      context.fetchProjectTaskCenter(projectName)
public/control-center/pages/operations-centers.js:749:          session.errorMessage = `Task Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1748:  id: "task-center",
public/control-center/pages/operations-centers.js:1752:    title: "Task Center",
public/control-center/pages/operations-centers.js:1755:  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1765:      if (!projectName || !context.fetchProjectTaskCenter) return;
public/control-center/pages/operations-centers.js:1766:      context.fetchProjectTaskCenter(projectName)
public/control-center/pages/operations-centers.js:1774:          context.showError?.(`Task Center: ${error?.message || "Failed to load live data."}`);
public/control-center/pages/operations-centers.js:1941:      route: "task-center",
public/control-center/pages/operations-centers.js:1942:      title: "Task Center",
public/control-center/pages/operations-centers.js:1946:      action: "Open Task Center"
public/control-center/pages/operations-centers.js:2033:                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
public/control-center/pages/operations-centers.js:2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
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
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/content-studio-workspace.js:4:  createProjectTask,
public/control-center/pages/content-studio-workspace.js:12:  listProjectTasks,
public/control-center/pages/content-studio-workspace.js:783:      listProjectTasks(projectName, 120),
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
public/control-center/app.js:57:  createProjectTask,
public/control-center/app.js:68:  fetchProjectTaskCenter,
public/control-center/app.js:2097:      createProjectTask,
public/control-center/app.js:2108:      fetchProjectTaskCenter,

## Media Studio create task handler range
        }
      }
      showMessage?.("Media job returned to draft for revision.");
      rerender();
    };
  }

  const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
  if (createTaskBtn) {
    createTaskBtn.onclick = async () => {
      sync();
      const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
      if (backendProjectName && item && !item.localOnly) {
        try {
          await createProjectTask(backendProjectName, {
            title: `Complete media job ${item.title || session.form.title || "media job"}`,
            description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
            owner_role: item.owner_role || ownerRoleForMode(item.mode),
            assignee_role: item.owner_role || ownerRoleForMode(item.mode),
            service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
            responsibility: item.mode === "video" ? "video_production" : "creative_production",
            handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
            source_page: "media-studio",
            route_target: "media-studio",
            linked_entity: {
              entity_type: "media_job",
              entity_id: item.id,
              route: "media-studio",
              label: item.title || session.form.title || "Media job"
            },
            actor: "media-studio"
          });
          showMessage?.("Task created and linked to the media job.");
        } catch (_) {
          showMessage?.("Task action kept locally because backend task save is unavailable.");
        }
      } else {
        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
      }
      rerender();
    };
  }

  const sendAiBtn = document.getElementById("mediaSendAiCommandBtn");
  if (sendAiBtn) {

## Content Studio task-related ranges
4:  createProjectTask,
12:  listProjectTasks,
496:    linked_tasks: asArray(raw.linked_tasks),
538:      tasks: [],
781:    const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
783:      listProjectTasks(projectName, 120),
793:    session.tasks = asArray(tasks.items);
2374:        ${session.loading ? `<div class="empty-box">Loading content records, approvals, tasks, handoffs, and events...</div>` : ""}

## Workflows task handoff ranges
  const pushAiSecondaryBtn = $("workflowPushAiBtnSecondary");
  if (pushAiSecondaryBtn) pushAiSecondaryBtn.onclick = pushAiBtn?.onclick || null;

  const saveTaskBtn = $("workflowSaveTaskBtn");
  if (saveTaskBtn) {
    saveTaskBtn.onclick = () => {
      if (!run.output) {
        showError?.("Prepare the workflow package before creating a task handoff.");
        return;
      }

      const handoff = {
        source_page: "workflows",
        destination_page: "task-center",
        title: `${workflow.title} • ${inputs.campaign || inputs.project || projectName || "Project"}`,
        summary: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
        description: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
        payload: {
          workflow_id: workflow.id,
          workflow_title: workflow.title,
          source_type: "workflow_run",
          source_id: run.runId || run.lastRunAt || "",
          owner_role: "admin",
          assignee_role: "admin",
          service_domain: workflow.id === "generate-report" || workflow.id === "research-competitors" ? "research" : "campaign",
          route_target: "workflows",
          output: asObject(run.output),
          notes: asArray(run.output.nextActions || []),
          status: "review_only"
        },
        created_at: new Date().toISOString()
      };

      setSharedHandoff(projectName, "task-center", handoff);
      showMessage?.("Task handoff prepared for review in Task Center.");
      navigateTo("task-center");
    };
  }


      const tasksBtn = $("wfLightTasksBtn");
      if (tasksBtn) {
        tasksBtn.onclick = () => {
          const handoff = {
            source_page: "workflows",
            destination_page: "task-center",
            title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
            summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
            description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
            payload: {
              workflow_id: asString(stateModel.selectedWorkflow?.id || ""),
              workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
              handoff_intent: "Prepare task handoff from workflow package.",
              status: "review_only"
            },
            created_at: new Date().toISOString()
          };
          setSharedHandoff(projectName, "task-center", handoff);
          stateModel.openedTaskCenter = true;
          stateModel.lastStatusTone = "is-info";
          stateModel.lastStatusText = "Task Center opened for workflow handoff and tracking.";
          navigateTo("task-center");
        };
      }

      Array.from(root.querySelectorAll("[data-wf-open]")).forEach((button) => {
        button.onclick = () => {
          const route = button.getAttribute("data-wf-open") || "workflows";
          if (route === "task-center") {
            const handoff = {
              source_page: "workflows",
              destination_page: "task-center",
              title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
              summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
              description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
              payload: {
                workflow_id: asString(stateModel.selectedWorkflow?.id || ""),
                workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
                handoff_intent: "Prepare task handoff from workflow package.",
                status: "review_only"
              },
              created_at: new Date().toISOString()
            };
            setSharedHandoff(projectName, "task-center", handoff);
            stateModel.openedTaskCenter = true;
          }
          if (route !== "task-center") stateModel.openedDestination = true;
          stateModel.lastStatusTone = "is-info";

## AI Command task preview / routing markers
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1313:                return { outputType, destinationRoute: "task-center" };
1370:		"task-center": "Task Center",
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
2356:	"task-center": "Task Center",
2378:	"task-center": "operations",
2412:	tasks: "task-center",
3543:		task: "Task Draft",
3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
5261:                                showMessage?.("Task draft preview prepared from conversation.");
