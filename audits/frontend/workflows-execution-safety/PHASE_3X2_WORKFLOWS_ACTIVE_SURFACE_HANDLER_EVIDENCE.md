# PHASE 3X.2 — Workflows Active Surface / Handler Evidence

## Handler summary
11:  setSharedHandoff
18:  startAutoMode,
22:  approveCurrentGate,
23:  skipCurrentStep,
26:  runAutomationPlan
931:function applyDurableWorkflowHandoff({ projectName, session, operations, consumeProjectHandoff, showMessage }) {
963:  consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
1067:  navigateTo,
1068:  createProjectHandoff,
1096:  setSharedHandoff(projectName, "ai-command", handoff);
1098:  if (allowPersistent && typeof createProjectHandoff === "function") {
1099:    createProjectHandoff(projectName, handoff).catch((error) => {
1104:  navigateTo("ai-command");
1118:  window.addEventListener("mh:submit-workflow", async (event) => {
1130:      runProjectWorkflow,
1131:      runProjectAiWorkflow,
1173:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
1209:  navigateTo,
1215:  runProjectWorkflow,
1216:  runProjectAiWorkflow,
1218:  createProjectHandoff,
1222:    createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
1273:    saveDraftBtn.onclick = () => {
1282:    clearDraftBtn.onclick = () => {
1294:    loadAiStateBtn.onclick = () => {
1298:        setSharedHandoff(projectName, "workflows", {
1333:function confirmWorkflowBackendRun(workflow) {
1341:  async function runWorkflow(workflowId) {
1360:    const confirmed = confirmWorkflowBackendRun(activeWorkflow);
1385:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, activeWorkflow.id, {
1411:      setSharedHandoff(projectName, "workflows", {
1442:  if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);
1444:  if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);
1448:    startRecommendedBtn.onclick = () => {
1450:      runWorkflow(rec.workflowId);
1456:    saveRecommendedBtn.onclick = () => {
1468:    sendRecommendedAiBtn.onclick = () => {
1478:        navigateTo,
1479:        createProjectHandoff,
1487:    button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") || session.selectedWorkflowId);
1491:    button.onclick = () => {
1501:    button.onclick = () => {
1511:        navigateTo,
1512:        createProjectHandoff,
1521:    pushAiBtn.onclick = () => {
1528:        navigateTo,
1529:        createProjectHandoff,
1537:  if (pushAiSecondaryBtn) pushAiSecondaryBtn.onclick = pushAiBtn?.onclick || null;
1541:    saveTaskBtn.onclick = () => {
1569:      setSharedHandoff(projectName, "task-center", handoff);
1571:      navigateTo("task-center");
1577:    recommendBtn.onclick = () => {
1593:      setSharedHandoff(projectName, "ai-command", {
1607:      navigateTo("ai-command");
1613:    customBtn.onclick = () => {
1629:      setSharedHandoff(projectName, "ai-command", {
1643:      navigateTo("ai-command");
1649:    fullAutomationBtn.onclick = async () => {
1662:      const result = await runAutomationPlan(plan, {
1663:        context: { getState, navigateTo, createProjectHandoff, projectName },
1678:    stepAutomationBtn.onclick = async () => {
1691:      const stepResult = await runAutomationPlan(singleStep, {
1692:        context: { getState, navigateTo, createProjectHandoff, projectName },
1711:    autoStartBtn.onclick = async () => {
1714:      createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
1720:      await startAutoMode(plan, {
1722:        context: { getState, navigateTo, createProjectHandoff, projectName }
1730:    autoPauseBtn.onclick = () => {
1738:    autoResumeBtn.onclick = async () => {
1739:      await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
1746:    autoStopBtn.onclick = () => {
1754:    autoApproveBtn.onclick = async () => {
1755:      await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
1762:    autoSkipBtn.onclick = async () => {
1763:      await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
1786:    navigateTo,
2209:        button.onclick = () => {
2272:        navigateTo("ai-command");
2276:      if (heroPrepareBtn) heroPrepareBtn.onclick = prepareCurrentWorkflow;
2279:        button.onclick = openAiWorkspace;
2283:      if (prepareBtn) prepareBtn.onclick = prepareCurrentWorkflow;
2286:      if (aiBtn) aiBtn.onclick = openAiWorkspace;
2290:        campaignBtn.onclick = () => {
2294:          navigateTo("campaign-studio");
2300:        tasksBtn.onclick = () => {
2315:          setSharedHandoff(projectName, "task-center", handoff);
2319:          navigateTo("task-center");
2324:        button.onclick = () => {
2341:            setSharedHandoff(projectName, "task-center", handoff);
2347:          navigateTo(route);
2353:        techBtn.onclick = () => {

## Active/preserved surface marker
900:function renderWorkflowExecutionLoop({
1206:function bindWorkflowExecutionLoop({
1915:    function renderSurface() {
2088:                <p>Existing runtime execution helpers are preserved in file scope and not activated by this active render surface.</p>
2190:          renderSurface();
2214:          renderSurface();
2218:      function prepareCurrentWorkflow() {
2225:          renderSurface();
2241:        renderSurface();
2276:      if (heroPrepareBtn) heroPrepareBtn.onclick = prepareCurrentWorkflow;
2283:      if (prepareBtn) prepareBtn.onclick = prepareCurrentWorkflow;
2363:    renderSurface();

## Key function ranges

### Workflow bridge / external event
  if (!missing.length) return "";
  return `Please complete: ${missing.map(titleCase).join(", ")}.`;
}

function registerWorkflowBridge(context) {
  lastWorkflowRenderContext = context;
  if (workflowBridgeRegistered || typeof window === "undefined") return;

  window.addEventListener("mh:submit-workflow", async (event) => {
    if (!lastWorkflowRenderContext) return;

    const detail = asObject(event?.detail);
    const message = asString(detail.message);
    const meta = asObject(detail.meta);

    const {
      getState,
      reloadProjectData,
      fetchProjectInsights,
      fetchProjectLearning,
      runProjectWorkflow,
      runProjectAiWorkflow,
      render,
      showMessage,
      showError
    } = lastWorkflowRenderContext;

    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName, createDefaultInputs(state), state.data.operations);
    const workflow = WORKFLOW_CATALOG.find((item) => item.aiModeId === asString(meta.modeId)) || WORKFLOW_CATALOG[0];

    session.selectedWorkflowId = workflow.id;
    session.inputsByWorkflow[workflow.id] = {
      ...session.inputsByWorkflow[workflow.id],
      project: firstNonEmpty(projectName, session.inputsByWorkflow[workflow.id].project),
      goal: firstNonEmpty(meta.assistantTitle, session.inputsByWorkflow[workflow.id].goal),
      campaign: firstNonEmpty(session.inputsByWorkflow[workflow.id].campaign, state.context.activeCampaign),
      product: firstNonEmpty(session.inputsByWorkflow[workflow.id].product, state.context.currentProject)
    };

    if (!meta.autoRun) {
      session.draftStatus = "AI prompt imported into workflow builder";
      render();
      return;
    }

    const run = session.runsByWorkflow[workflow.id];
    run.status = "running";
    render();

    try {
      await ensureWorkflowIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        rerender: render
      });
      const contextModel = buildWorkflowContext(getState(), session);
      const createdAt = nowIso();
      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
        title: workflow.title,
        status: "completed",
        source: meta.source || "external-trigger",
        inputs: session.inputsByWorkflow[workflow.id],
        prompt: firstNonEmpty(message, buildWorkflowPrompt(workflow, session.inputsByWorkflow[workflow.id], contextModel)),
        intelligence_stamp: {
          refreshed_at: createdAt,
          source: "workflow-auto-run"
        }
      });
      const output = asObject(result?.output || result?.run?.output) || buildFallbackOutput(workflow, session.inputsByWorkflow[workflow.id], contextModel);
      run.status = "completed";
      run.lastRunAt = asString(result?.run?.created_at) || createdAt;
      run.runId = asString(result?.run?.id);
      run.source = meta.source || "external-trigger";
      run.output = output;
      run.blockedRequirements = asArray(output.blockedRequirements || output.blocked_requirements);
      run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output });
      run.history = run.history.slice(0, 8);
      await reloadProjectData?.(projectName);
      showMessage?.(`${workflow.title} created from AI context.`);
    } catch (error) {
      run.status = "failed";
      showError?.(error.message || "Workflow execution failed.");
    }

    render();
  });

  workflowBridgeRegistered = true;
}


### Runtime execution loop binding
function bindWorkflowExecutionLoop({
  $,
  getState,
  navigateTo,
  showMessage,
  showError,
  reloadProjectData,
  fetchProjectInsights,
  fetchProjectLearning,
  runProjectWorkflow,
  runProjectAiWorkflow,
  createProjectTask,
  createProjectHandoff,
  render
}) {
  if (workflowAutomationEnabled) {
    createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
    if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
    workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
      render();
    });
  }

  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, createDefaultInputs(state), state.data.operations);
  const workflow = getWorkflowDef(session.selectedWorkflowId);
  const inputs = asObject(session.inputsByWorkflow[workflow.id]);
  const run = session.runsByWorkflow[workflow.id];
  const contextModel = buildWorkflowContext(state, session);
  const aiDraft = asObject(getSharedAiDraft(projectName, state.data.operations));
  const hasDirectAiState = Boolean(aiDraft.lastCommand || aiDraft.lastResponseTitle || aiDraft.modeId);

  function setValidation(message) {
    session.validationMessage = message || "";
    const box = $("wfexecValidation");
    if (!box) return;
    box.textContent = session.validationMessage;
    box.classList.toggle("is-visible", Boolean(session.validationMessage));
  }

  function syncInputField(field, value) {
    session.inputsByWorkflow[session.selectedWorkflowId][field] = value;
    persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Draft auto-saved", true);
  }

  Array.from(document.querySelectorAll("[data-wf-input]")).forEach((input) => {
    input.oninput = () => {
      const field = input.getAttribute("data-wf-input") || "";
      if (!field) return;
      syncInputField(field, input.value || "");
      if (session.validationMessage) setValidation("");
    };
  });

  const workflowTypeSelect = $("wfexecWorkflowType");
  if (workflowTypeSelect) {
    workflowTypeSelect.onchange = () => {
      session.selectedWorkflowId = workflowTypeSelect.value || session.selectedWorkflowId;
      persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Workflow switched", true);
      session.validationMessage = "";
      render();
    };
  }

  const saveDraftBtn = $("wfexecSaveDraftBtn");
  if (saveDraftBtn) {
    saveDraftBtn.onclick = () => {
      persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Draft saved", true);
      showMessage?.("Workflow draft saved.");
      render();
    };
  }

  const clearDraftBtn = $("wfexecClearDraftBtn");
  if (clearDraftBtn) {
    clearDraftBtn.onclick = () => {
      const defaults = createDefaultInputs(getState());
      session.inputsByWorkflow[session.selectedWorkflowId] = { ...defaults };
      persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Draft cleared", true);
      session.validationMessage = "";
      showMessage?.("Workflow draft cleared.");
      render();
    };
  }

  const loadAiStateBtn = $("wfexecLoadAiStateBtn");
  if (loadAiStateBtn) {
    loadAiStateBtn.onclick = () => {
      const draft = asObject(getSharedAiDraft(projectName, getState().data.operations));
      if (!Object.keys(draft).length) {
        const safePrompt = `Create a workflow for ${projectName || "this project"} focused on ${inputs.goal || "operational improvement"}.`;
        setSharedHandoff(projectName, "workflows", {
          source_page: "workflows",
          destination_page: "workflows",
          payload: {
            prompt: safePrompt,
            draft_context: {
              projectName,
              modeId: workflow.aiModeId,
              lastCommand: safePrompt,
              lastResponseTitle: "Workflow seed"
            }
          },
          status: "available"
        });
        session.inputsByWorkflow[session.selectedWorkflowId].goal = firstNonEmpty(inputs.goal, "Execution loop optimization");
        persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Local handoff seed created", true);
        showMessage?.("No AI state found. Local workflow seed created safely.");
        render();
        return;
      }

      session.inputsByWorkflow[session.selectedWorkflowId] = {
        ...session.inputsByWorkflow[session.selectedWorkflowId],
        project: firstNonEmpty(draft.projectName, session.inputsByWorkflow[session.selectedWorkflowId].project),
        goal: firstNonEmpty(draft.lastResponseTitle, session.inputsByWorkflow[session.selectedWorkflowId].goal),
        campaign: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].campaign, state.context.activeCampaign),
        product: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].product, state.context.currentProject),
        channel: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].channel, "multi-channel")
      };
      persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "AI state loaded", true);
      showMessage?.("AI Command state loaded into workflow inputs.");
      render();
    };
  }

function confirmWorkflowBackendRun(workflow) {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  const title = workflow?.title || "this workflow";
  return window.confirm(
    `Confirm workflow preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It does not publish, send messages, create CRM records, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
  );
}

  async function runWorkflow(workflowId) {
    const activeWorkflow = getWorkflowDef(workflowId || session.selectedWorkflowId);
    session.selectedWorkflowId = activeWorkflow.id;

    const activeInputs = asObject(session.inputsByWorkflow[activeWorkflow.id]);
    const validationMessage = validateWorkflowInputs(activeWorkflow, activeInputs);
    if (validationMessage) {
      setValidation(validationMessage);
      const firstMissing = activeWorkflow.requiredInputs.find((field) => !asString(activeInputs[field]).trim());
      const target = $(`wfexecInput${titleCase(firstMissing)}`);
      if (target) target.focus();
      return;
    }

    if (!projectName) {
      setValidation("Select a project before running a workflow.");
      return;
    }

    const confirmed = confirmWorkflowBackendRun(activeWorkflow);
    if (!confirmed) {
      setValidation("Workflow preparation cancelled. No backend workflow run was recorded.");
      return;
    }

    setValidation("");
    const activeRun = session.runsByWorkflow[activeWorkflow.id];
    activeRun.status = "running";
    activeRun.source = "manual-run";
    render();

    try {
      await ensureWorkflowIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        rerender: render
      });

      const freshContext = buildWorkflowContext(getState(), session);
      const createdAt = nowIso();
      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, activeWorkflow.id, {
        title: activeWorkflow.title,
        status: "completed",
        source: "manual-run",
        inputs: activeInputs,
        prompt: buildWorkflowPrompt(activeWorkflow, activeInputs, freshContext),
        route_target: activeWorkflow.routeHint,
        intelligence_stamp: {
          refreshed_at: createdAt,
          source: "workflow-manual-run"
        }
      });

      const output = asObject(result?.output || result?.run?.output);
      const safeOutput = Object.keys(output).length
        ? output
        : buildFallbackOutput(activeWorkflow, activeInputs, freshContext);

      activeRun.status = "completed";
      activeRun.lastRunAt = asString(result?.run?.created_at) || createdAt;
      activeRun.runId = asString(result?.run?.id);
      activeRun.output = safeOutput;
      activeRun.blockedRequirements = asArray(safeOutput.blockedRequirements || safeOutput.blocked_requirements);
      activeRun.history.unshift({ createdAt: activeRun.lastRunAt, source: "manual-run", output: safeOutput });
      activeRun.history = activeRun.history.slice(0, 8);

      setSharedHandoff(projectName, "workflows", {
        source_page: "workflows",
        destination_page: "workflows",
        payload: {
          workflow_id: activeWorkflow.id,
          run_id: activeRun.runId,
          output: safeOutput,
          inputs: activeInputs,
          createdAt: activeRun.lastRunAt
        },
        status: "available"
      });

      await reloadProjectData?.(projectName);
      showMessage?.(`${activeWorkflow.title} completed.`);
    } catch (error) {
      activeRun.status = "failed";
      activeRun.output = {
        title: `${activeWorkflow.title} failed`,
        summary: error.message || "Workflow execution failed.",
        blockedRequirements: ["Execution failed. Review inputs and retry."],
        nextActions: ["Retry workflow", "Validate project integrations", "Check workflow dependencies"]
      };
      activeRun.blockedRequirements = asArray(activeRun.output.blockedRequirements);
      showError?.(error.message || "Workflow execution failed.");
    }

    render();
  }

  const runBtn = $("workflowRunBtn");
  if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);
  const runBtnMain = $("workflowRunBtnMain");
  if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);

  const startRecommendedBtn = $("wfexecStartRecommendedBtn");
  if (startRecommendedBtn) {
    startRecommendedBtn.onclick = () => {
      const rec = buildSmartRecommendation(contextModel, session, getGlobalNextBestAction(getState()));
      runWorkflow(rec.workflowId);
    };
  }

  const saveRecommendedBtn = $("wfexecSaveRecommendedBtn");
  if (saveRecommendedBtn) {
    saveRecommendedBtn.onclick = () => {
      const rec = buildSmartRecommendation(contextModel, session, getGlobalNextBestAction(getState()));
      session.selectedWorkflowId = rec.workflowId;
      session.inputsByWorkflow[rec.workflowId].goal = firstNonEmpty(session.inputsByWorkflow[rec.workflowId].goal, rec.title);
      persistWorkflowDraft(projectName, session, rec.workflowId, "Recommendation saved as draft", true);
      showMessage?.("Recommended workflow saved as draft.");
      render();
    };
  }

  const sendRecommendedAiBtn = $("wfexecSendRecommendedAiBtn");
  if (sendRecommendedAiBtn) {
    sendRecommendedAiBtn.onclick = () => {
      const rec = buildSmartRecommendation(contextModel, session, getGlobalNextBestAction(getState()));
      const recWorkflow = getWorkflowDef(rec.workflowId);
      session.selectedWorkflowId = recWorkflow.id;
      pushWorkflowToAiCommand({
        projectName,
        workflow: recWorkflow,
        inputs: asObject(session.inputsByWorkflow[recWorkflow.id]),
        run: session.runsByWorkflow[recWorkflow.id],
        context: contextModel,
        navigateTo,
        createProjectHandoff,
        showMessage,
        allowPersistent: hasDirectAiState
      });
    };
  }

  Array.from(document.querySelectorAll("[data-wf-catalog-run]")).forEach((button) => {
    button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") || session.selectedWorkflowId);
  });

  Array.from(document.querySelectorAll("[data-wf-catalog-save]")).forEach((button) => {
    button.onclick = () => {
      const workflowId = button.getAttribute("data-wf-catalog-save") || session.selectedWorkflowId;
      session.selectedWorkflowId = workflowId;
      persistWorkflowDraft(projectName, session, workflowId, "Draft saved", true);
      showMessage?.("Workflow draft saved.");
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-wf-catalog-ai]")).forEach((button) => {
    button.onclick = () => {
      const workflowId = button.getAttribute("data-wf-catalog-ai") || session.selectedWorkflowId;
      const wf = getWorkflowDef(workflowId);
      session.selectedWorkflowId = workflowId;
      pushWorkflowToAiCommand({
        projectName,
        workflow: wf,
        inputs: asObject(session.inputsByWorkflow[workflowId]),
        run: session.runsByWorkflow[workflowId],
        context: contextModel,
        navigateTo,
        createProjectHandoff,
        showMessage,
        allowPersistent: hasDirectAiState
      });
    };
  });

  const pushAiBtn = $("workflowPushAiBtn");
  if (pushAiBtn) {
    pushAiBtn.onclick = () => {
      pushWorkflowToAiCommand({
        projectName,
        workflow,
        inputs,
        run,
        context: contextModel,
        navigateTo,
        createProjectHandoff,
        showMessage,
        allowPersistent: hasDirectAiState
      });
    };
  }

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

  const recommendBtn = $("workflowRecommendBtn");
  if (recommendBtn) {
    recommendBtn.onclick = () => {
      const rec = buildSmartRecommendation(contextModel, session, getGlobalNextBestAction(getState()));
      const prompt = [
        "Recommend the best workflow to run next.",
        `Project: ${projectName || "not set"}`,
        `Current recommendation: ${rec.title}`,
        `Reason: ${rec.reason}`,
        `Missing integrations: ${contextModel.missingIntegrations.join(", ") || "none"}`,
        `Missing assets: ${contextModel.missingAssets.join(", ") || "none"}`
      ].join("\n");
      setSharedAiDraft(projectName, {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: "Workflow recommendation"
      });
      setSharedHandoff(projectName, "ai-command", {
        source_page: "workflows",
        destination_page: "ai-command",
        payload: {
          prompt,
          draft_context: {
            projectName,
            modeId: "operations",
            lastCommand: prompt,
            lastResponseTitle: "Workflow recommendation"
          }
        },
        status: "available"
      });
      navigateTo("ai-command");
    };
  }

  const customBtn = $("workflowBuildCustomBtn");
  if (customBtn) {
    customBtn.onclick = () => {
      const prompt = [
        "Build a custom workflow blueprint.",
        `Project: ${inputs.project || projectName || "not set"}`,
        `Campaign: ${inputs.campaign || "not set"}`,
        `Product: ${inputs.product || "not set"}`,
        `Channel: ${inputs.channel || "not set"}`,
        `Goal: ${inputs.goal || "not set"}`,
        "Return structured steps, blockers, route suggestions, and KPI checks."
      ].join("\n");
      setSharedAiDraft(projectName, {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: "Custom workflow builder"
      });
      setSharedHandoff(projectName, "ai-command", {
        source_page: "workflows",
        destination_page: "ai-command",
        payload: {
          prompt,
          draft_context: {
            projectName,
            modeId: "operations",
            lastCommand: prompt,
            lastResponseTitle: "Custom workflow builder"
          }
        },
        status: "available"
      });
      navigateTo("ai-command");
    };
  }

  const fullAutomationBtn = $("workflowRunFullAutomationBtn");
  if (fullAutomationBtn) {
    fullAutomationBtn.onclick = async () => {
      const plan = buildAutomationPlan(getState());
      if (!plan.length) {
        workflowAutomationState.result = "No safe automation steps available.";
        render();
        return;
      }
      const confirmed = window.confirm(`Confirm automation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream task or handoff state.\n\nSelect Cancel to stop.`);
      if (!confirmed) return;

      workflowAutomationState.lastPlan = plan;
      workflowAutomationState.cursor = 0;
      workflowAutomationState.result = "";
      const result = await runAutomationPlan(plan, {
        context: { getState, navigateTo, createProjectHandoff, projectName },
        onProgress: ({ index, total, step, result: stepResult }) => {
          workflowAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${stepResult.status})`;
          render();
        }
      });
      workflowAutomationState.lastResults = asArray(result.results);
      workflowAutomationState.result = result.status === "success" ? "Automation simulation completed." : "Automation simulation stopped before completion.";
      showMessage?.(workflowAutomationState.result);
      render();
    };
  }

  const stepAutomationBtn = $("workflowRunStepAutomationBtn");
  if (stepAutomationBtn) {
    stepAutomationBtn.onclick = async () => {
      const plan = buildAutomationPlan(getState());
      if (!plan.length) {
        workflowAutomationState.result = "No safe automation steps available.";
        render();
        return;
      }

      const confirmed = window.confirm("Confirm guided simulation step\n\nAction: Simulate the next guided step.\nRisk: This can prepare downstream task or handoff state.\n\nSelect Cancel to keep the current state.");
      if (!confirmed) return;

      const nextIndex = Math.min(workflowAutomationState.cursor, plan.length - 1);
      const singleStep = [plan[nextIndex]];
      const stepResult = await runAutomationPlan(singleStep, {
        context: { getState, navigateTo, createProjectHandoff, projectName },
        onProgress: ({ index, total, step, result: runResult }) => {
          workflowAutomationState.progress = `Step ${nextIndex + index} / ${plan.length}: ${step.action} (${runResult.status})`;
        }
      });

      workflowAutomationState.cursor = Math.min(nextIndex + 1, plan.length);
      workflowAutomationState.lastPlan = plan;
      workflowAutomationState.lastResults = [...asArray(workflowAutomationState.lastResults), ...asArray(stepResult.results)];
      workflowAutomationState.result = workflowAutomationState.cursor >= plan.length
        ? "Step-by-step simulation completed."
        : "Step simulated. Continue for the next step.";
      showMessage?.(workflowAutomationState.result);
      render();
    };
  }

  const autoStartBtn = $("workflowAutoStartBtn");
  if (autoStartBtn) {
    autoStartBtn.onclick = async () => {
      const plan = buildAutomationPlan(getState());
      workflowAutomationEnabled = true;
      createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
      if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
      workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
        render();
      });

      await startAutoMode(plan, {
        mode: "auto_until_approval",
        context: { getState, navigateTo, createProjectHandoff, projectName }
      });
      showMessage?.("Workflow Guided Mode started.");
    };
  }

  const autoPauseBtn = $("workflowAutoPauseBtn");
  if (autoPauseBtn) {
    autoPauseBtn.onclick = () => {
      pauseAutoMode();
      showMessage?.("Guided Mode paused.");
    };
  }

  const autoResumeBtn = $("workflowAutoResumeBtn");
  if (autoResumeBtn) {
    autoResumeBtn.onclick = async () => {
      await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Guided Mode resumed.");
    };
  }

  const autoStopBtn = $("workflowAutoStopBtn");
  if (autoStopBtn) {
    autoStopBtn.onclick = () => {
      stopAutoMode();
      showMessage?.("Guided Mode stopped.");
    };
  }

  const autoApproveBtn = $("workflowAutoApproveBtn");
  if (autoApproveBtn) {
    autoApproveBtn.onclick = async () => {
      await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Approval gate accepted.");
    };
  }

  const autoSkipBtn = $("workflowAutoSkipBtn");
  if (autoSkipBtn) {
    autoSkipBtn.onclick = async () => {
      await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Guided Mode skipped gated step.");
    };
  }
}

export const workflowsRoute = {
  id: "workflows",

### Active route render surface
export const workflowsRoute = {
  id: "workflows",
  disableStandardLayout: true,
  meta: {
    eyebrow: "AI & Build",
    title: "Workflows",
    description: "Prepare structured, repeatable workflow packages for common marketing and execution operations."
  },
  template: `
    <section class="page is-active" data-page="workflows">
      <div id="workflowsRoot"></div>
    </section>
  `,
    render({
    getState,
    $,
    escapeHtml,
    navigateTo,
    showMessage
  }) {
    const state = getState();
    const projectName = asString(selectCurrentProject(state) || "");
    const campaignName = asString(state.context.activeCampaign || "");
    const executionMode = asString(state.context.executionMode || "");

    const payload = asObject(selectProjectPayload(state));

    const overview = asObject(payload.overview?.overview || payload.overview);
    const readinessRoot = asObject(payload.readiness?.dashboard || payload.readiness);
    const operations = asObject(selectOperationsSnapshot(state));

    const readinessScore = readinessRoot.readiness_score ?? overview.readiness_score ?? null;
    const readinessStatus = firstNonEmpty(readinessRoot.readiness_status, overview.readiness_status, "Unknown");

    const workflowsTotal = Number(operations.workflows?.total_runs || operations.workflows?.total || 0);
    const tasksTotal = Number(operations.tasks?.total || 0);
    const approvalsTotal = Number(operations.approvals?.total || 0);

    const root = $("workflowsRoot");
    if (!root) return;

    const destinationRouteByHint = {
      "campaign-studio": "campaign-studio",
      "content-studio": "content-studio",
      "media-studio": "media-studio",
      publishing: "publishing",
      insights: "insights",
      research: "research",
      integrations: "integrations"
    };

    const stateModel = {
      selectedWorkflowId: WORKFLOW_CATALOG[0].id,
      inputsByWorkflow: WORKFLOW_CATALOG.reduce((acc, workflow) => {
        acc[workflow.id] = {
          project: projectName,
          campaign: campaignName,
          product: firstNonEmpty(projectName, overview.project_name),
          channel: asArray(overview.channels).join(", "),
          goal: ""
        };
        return acc;
      }, {}),
      preparedPackage: null,
      lastStatusTone: "is-info",
      lastStatusText: "Select a workflow template to start a session.",
      aiReviewed: false,
      openedTaskCenter: false,
      openedDestination: false
    };

    function getSelectedWorkflow() {
      return getWorkflowDef(stateModel.selectedWorkflowId);
    }

    function getDestinationLabel(routeHint) {
      return titleCase(routeHint || "destination");
    }

    function getMissingInputs(workflow, inputs) {
      return workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
    }

    function buildSessionPrompt(workflow, inputs) {
      return [
        `Workflow: ${workflow.title}`,
        `Purpose: ${workflow.purpose}`,
        `Project: ${inputs.project || projectName || "not set"}`,
        `Campaign: ${inputs.campaign || campaignName || "not set"}`,
        `Product: ${inputs.product || "not set"}`,
        `Channel: ${inputs.channel || "not set"}`,
        `Goal: ${inputs.goal || "Prepare an execution-ready workflow package."}`
      ].join("\\n");
    }

    function buildStepModel(workflow, inputs) {
      const missing = getMissingInputs(workflow, inputs);
      const hasPrepared = Boolean(stateModel.preparedPackage && stateModel.preparedPackage.workflowId === workflow.id);
      const hasTracking = workflowsTotal > 0 || hasPrepared;

      return [
        {
          title: "Select Template",
          status: "complete",
          copy: workflow.title
        },
        {
          title: "Complete Context",
          status: missing.length ? "active" : "complete",
          copy: missing.length ? `${missing.length} missing` : "Complete"
        },
        {
          title: "Prepare Package",
          status: missing.length ? "blocked" : hasPrepared ? "complete" : "pending",
          copy: hasPrepared ? "Prepared" : "Waiting"
        },
        {
          title: "Review with AI",
          status: stateModel.aiReviewed ? "complete" : hasPrepared ? "active" : "pending",
          copy: stateModel.aiReviewed ? "Reviewed" : "Pending"
        },
        {
          title: "Create Task / Handoff",
          status: stateModel.openedTaskCenter ? "complete" : hasPrepared ? "active" : "pending",
          copy: stateModel.openedTaskCenter ? "Opened" : "Pending"
        },
        {
          title: "Continue in Destination",
          status: stateModel.openedDestination ? "complete" : hasPrepared ? "active" : "pending",
          copy: stateModel.openedDestination ? "Continued" : "Pending"
        },
        {
          title: "Track Result",
          status: hasTracking ? "active" : "pending",
          copy: hasTracking ? `${workflowsTotal} tracked` : "Pending"
        }
      ];
    }

    function toStepClass(status) {
      if (status === "complete") return "is-complete";
      if (status === "active") return "is-active";
      if (status === "blocked") return "is-danger";
      return "";
    }

    function renderSurface() {
      const workflow = getSelectedWorkflow();
      const inputs = asObject(stateModel.inputsByWorkflow[workflow.id]);
      const missing = getMissingInputs(workflow, inputs);
      const destinationRoute = destinationRouteByHint[workflow.routeHint] || "workflows";
      const destinationName = getDestinationLabel(workflow.routeHint);
      const preparedForSelected = stateModel.preparedPackage && stateModel.preparedPackage.workflowId === workflow.id
        ? stateModel.preparedPackage
        : null;

      const sessionStatus = missing.length
        ? `Context incomplete (${missing.length} missing)`
        : preparedForSelected
          ? "Prepared package ready"
          : "Ready to prepare";

      const nextAction = missing.length
        ? `Complete ${titleCase(missing[0])}.`
        : preparedForSelected
          ? "Review in AI Workspace."
          : "Prepare workflow package.";

      const readinessNumeric = Number(readinessScore);
      const readinessKnown = Number.isFinite(readinessNumeric);
      const readinessValue = readinessKnown ? Math.max(0, Math.min(100, Math.round(readinessNumeric))) : null;
      const readinessTone = !readinessKnown ? "neutral" : readinessValue >= 80 ? "success" : readinessValue >= 60 ? "warning" : "danger";

      const recentSessions = asArray(operations.workflows?.items).slice(0, 4);
      const steps = buildStepModel(workflow, inputs);

      root.innerHTML = `
        <div class="wfloop-shell">
          <section class="wfloop-hero card">
            <div class="wfloop-hero-head">
              <p class="wfloop-kicker">Workflow control</p>
              <h1>Workflow Operating Loop</h1>
              <p class="wfloop-mission">Start a session, prepare the package, and continue it across MH-OS destinations.</p>
              <div class="wfloop-hero-meta">
                <span class="wfloop-chip is-session">Active session: ${escapeHtml(workflow.title)}</span>
                <span class="wfloop-chip is-${escapeHtml(readinessTone)}">Readiness: ${escapeHtml(readinessValue == null ? "Unknown" : `${readinessValue}/100`)} · ${escapeHtml(readinessStatus || "Unknown")}</span>
              </div>
            </div>
            <div class="wfloop-chip-row">
              <span class="badge">Project: ${escapeHtml(projectName || "Not selected")}</span>
              <span class="badge">Campaign: ${escapeHtml(campaignName || "Not selected")}</span>
              <span class="badge">Mode: ${escapeHtml(executionMode || "manual")}</span>
            </div>
            <div class="wfloop-hero-actions">
              <button class="btn btn-primary" type="button" data-wf-hero-prepare="1">Prepare Current Workflow</button>
              <button class="btn btn-secondary" type="button" data-wf-hero-ai="1">Review Session in AI Workspace</button>
            </div>
          </section>

          <section class="wfloop-strip card">
            <ol class="mhos-stepper wfloop-stepper" aria-label="Workflow operating loop steps">
              ${steps.map((step, index) => `
                <li class="mhos-stepper-step ${toStepClass(step.status)}">
                  <span class="mhos-stepper-marker">${escapeHtml(String(index + 1))}</span>
                  <div class="mhos-stepper-body">
                    <p class="mhos-stepper-title">${escapeHtml(step.title)}</p>
                    <p class="mhos-stepper-meta">${escapeHtml(titleCase(step.status))} · ${escapeHtml(step.copy)}</p>
                  </div>
                </li>
              `).join("")}
            </ol>
          </section>

          <section class="wfloop-workbench">
            <article class="wfloop-zone wfloop-catalog card">
              <div class="card-head">
                <h3>Workflow Catalog</h3>
                <span class="badge">${escapeHtml(String(WORKFLOW_CATALOG.length))} templates</span>
              </div>
              <div class="wfloop-catalog-list">
                ${WORKFLOW_CATALOG.map((item) => {
                  const itemInputs = asObject(stateModel.inputsByWorkflow[item.id]);
                  const itemMissing = getMissingInputs(item, itemInputs);
                  const requiredCount = item.requiredInputs.length;
                  return `
                    <article class="wfloop-catalog-card${item.id === workflow.id ? " is-active" : ""}">
                      <div class="wfloop-catalog-head">
                        <h4>${escapeHtml(item.title)}</h4>
                        <span class="card-badge ${itemMissing.length ? "warning" : "success"}">${escapeHtml(itemMissing.length ? "Needs context" : "Ready")}</span>
                      </div>
                      <p class="wfloop-catalog-purpose">${escapeHtml(compactText(item.purpose, 74))}</p>
                      <div class="wfloop-catalog-chip-row">
                        <span class="wfloop-mini-chip">Destination ${escapeHtml(getDestinationLabel(item.routeHint))}</span>
                        <span class="wfloop-mini-chip">Required ${escapeHtml(String(requiredCount))}</span>
                        <span class="wfloop-mini-chip ${itemMissing.length ? "is-warning" : "is-success"}">Missing ${escapeHtml(String(itemMissing.length))}</span>
                      </div>
                      <button class="btn btn-secondary btn-sm" type="button" data-wf-select="${escapeHtml(item.id)}">Select</button>
                    </article>
                  `;
                }).join("")}
              </div>
            </article>

            <article class="wfloop-zone wfloop-session mhos-action-panel">
              <div class="mhos-action-panel-head">
                <h3 class="mhos-action-panel-title">Active Workflow Session</h3>
                <span class="card-badge ${missing.length ? "warning" : "success"}">${escapeHtml(sessionStatus)}</span>
              </div>

              <div class="wfloop-session-priority ${missing.length ? "is-warning" : "is-ready"}">
                <p><strong>Current session:</strong> ${escapeHtml(workflow.title)}</p>
                <p><strong>Missing:</strong> ${escapeHtml(missing.map(titleCase).join(", ") || "None")}</p>
                <p><strong>Next action:</strong> ${escapeHtml(nextAction)}</p>
              </div>

              <div class="wfloop-field-grid">
                <label>
                  <span>Workflow</span>
                  <select id="wfLightWorkflowType" class="setup-input">
                    ${WORKFLOW_CATALOG.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === workflow.id ? " selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
                  </select>
                </label>
                <label>
                  <span>Project</span>
                  <input id="wfLightProject" class="setup-input" type="text" value="${escapeHtml(inputs.project || "")}" placeholder="Current project">
                </label>
                <label>
                  <span>Campaign</span>
                  <input id="wfLightCampaign" class="setup-input" type="text" value="${escapeHtml(inputs.campaign || "")}" placeholder="Campaign name">
                </label>
                <label>
                  <span>Goal</span>
                  <input id="wfLightGoal" class="setup-input" type="text" value="${escapeHtml(inputs.goal || "")}" placeholder="Workflow goal">
                </label>
              </div>

              <div class="wfloop-session-grid">
                <div>
                  <p class="wfloop-session-label">Output to prepare</p>
                  <p class="wfloop-session-value">${escapeHtml(workflow.title)} package for ${escapeHtml(destinationName)}</p>
                </div>
                <div>
                  <p class="wfloop-session-label">Required context</p>
                  <p class="wfloop-session-value">${escapeHtml(workflow.requiredInputs.map(titleCase).join(", "))}</p>
                </div>
                <div>
                  <p class="wfloop-session-label">Available context</p>
                  <p class="wfloop-session-value">${escapeHtml(workflow.requiredInputs.filter((field) => asString(inputs[field]).trim()).map(titleCase).join(", ") || "None")}</p>
                </div>
                <div>
                  <p class="wfloop-session-label">Missing inputs</p>
                  <p class="wfloop-session-value">${escapeHtml(missing.map(titleCase).join(", ") || "None")}</p>
                </div>
              </div>

              <div class="mhos-action-panel-actions wfloop-safe-actions">
                <button id="wfLightPrepareBtn" class="btn btn-primary" type="button">Prepare Workflow</button>
                <button id="wfLightAiBtn" class="btn btn-secondary" type="button">Review in AI Workspace</button>
                <button id="wfLightCampaignBtn" class="btn btn-ghost" type="button">Open Campaign Studio</button>
                <button id="wfLightTasksBtn" class="btn btn-ghost" type="button">Open Task Center</button>
              </div>

              <div id="wfLightStatus" class="mhos-feedback-surface ${escapeHtml(stateModel.lastStatusTone)}">
                <p class="mhos-feedback-title">Session continuity</p>
                <p class="mhos-feedback-copy">${escapeHtml(stateModel.lastStatusText)}</p>
              </div>

              <div class="wfloop-preview card">
                <div class="card-head">
                  <h4>Prepared Package Preview</h4>
                  <span class="badge">${escapeHtml(preparedForSelected ? "Package ready" : "Not prepared")}</span>
                </div>
                <p class="wfloop-preview-meta">${escapeHtml(preparedForSelected ? `Prepared ${formatDateTime(preparedForSelected.createdAt)} · ${workflow.title} session package` : "Prepare to generate a compact session package preview.")}</p>
                <pre>${escapeHtml(preparedForSelected?.prompt || "Package will include workflow, purpose, project, campaign, product, channel, and goal context.")}</pre>
              </div>

              <details class="wfloop-tech-details">
                <summary>Technical details</summary>
                <p>Frontend-safe preparation only. This route prepares and routes context.</p>
                <p>Existing runtime execution helpers are preserved in file scope and not activated by this active render surface.</p>
              </details>
            </article>

            <aside class="wfloop-zone wfloop-assist">
              <section class="mhos-ai-guidance">
                <h3 class="mhos-ai-guidance-title">AI Guidance</h3>
                <p class="mhos-ai-guidance-copy">AI prepares structure, sequencing, and missing-context prompts for ${escapeHtml(workflow.title)}.</p>
                <p class="mhos-ai-guidance-reason">Remaining gaps: ${escapeHtml(missing.map(titleCase).join(", ") || "No missing inputs")}. Safest next step: ${escapeHtml(nextAction)}</p>
                <div class="mhos-ai-guidance-actions">
                  <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open AI Workspace</button>
                </div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Action Destination Map</h3>
                </div>
                <div class="mhos-destination-map">
                  <article class="mhos-destination-item is-active">
                    <div class="mhos-destination-copy">
                      <p class="mhos-destination-title">Review in AI Workspace</p>
                      <p class="mhos-destination-meta"><strong>Type</strong> AI review</p>
                      <p class="mhos-destination-meta"><strong>Context carried</strong> workflow package prompt, selected workflow, and input state</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now</p>
                    </div>
                    <div class="mhos-destination-actions">
                      <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open</button>
                    </div>
                  </article>

                  <article class="mhos-destination-item">
                    <div class="mhos-destination-copy">
                      <p class="mhos-destination-title">Create/Draft Task</p>
                      <p class="mhos-destination-meta"><strong>Type</strong> task handoff</p>
                      <p class="mhos-destination-meta"><strong>Context carried</strong> selected workflow session title and handoff intent</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now</p>
                    </div>
                    <div class="mhos-destination-actions">
                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>
                    </div>
                  </article>

                  <article class="mhos-destination-item">
                    <div class="mhos-destination-copy">
                      <p class="mhos-destination-title">Open Owning Destination</p>
                      <p class="mhos-destination-meta"><strong>Type</strong> destination navigation</p>
                      <p class="mhos-destination-meta"><strong>Context carried</strong> route hint and prepared package context</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now</p>
                    </div>
                    <div class="mhos-destination-actions">
                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="${escapeHtml(destinationRoute)}">Open ${escapeHtml(destinationName)}</button>
                    </div>
                  </article>

                  <article class="mhos-destination-item">
                    <div class="mhos-destination-copy">
                      <p class="mhos-destination-title">Technical Details</p>
                      <p class="mhos-destination-meta"><strong>Type</strong> technical disclosure</p>
                      <p class="mhos-destination-meta"><strong>Context carried</strong> preparation boundary and preserved helper notes</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now · Future-gated execution authority remains in destination tools</p>
                    </div>
                    <div class="mhos-destination-actions">
                      <button class="btn btn-ghost btn-sm" type="button" data-wf-tech-focus="1">Open details</button>
                    </div>
                  </article>
                </div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Recent Sessions / Tracking</h3>
                </div>
                ${recentSessions.length
                  ? `<ul class="wfloop-recent-list">
                      ${recentSessions.map((item) => `
                        <li>
                          <strong>${escapeHtml(titleCase(item.workflow_id || "workflow"))}</strong>
                          <span>${escapeHtml(titleCase(normalizeRunStatus(item.status || "draft")))}</span>
                          <span>${escapeHtml(formatDateTime(item.created_at || item.executed_at || nowIso()))}</span>
                        </li>
                      `).join("")}
                    </ul>`
                  : `<div class="empty-state">No recent workflow sessions yet. Prepare a workflow package to start continuity tracking.</div>`}
                <div class="wfloop-ops-strip">
                  <span>Prepared ${escapeHtml(String(workflowsTotal))}</span>
                  <span>Tasks ${escapeHtml(String(tasksTotal))}</span>
                  <span>Approvals ${escapeHtml(String(approvalsTotal))}</span>
                  <span>Mode ${escapeHtml(executionMode || "manual")}</span>
                </div>
              </section>
            </aside>
          </section>
        </div>
      `;

      const workflowType = $("wfLightWorkflowType");
      if (workflowType) {
        workflowType.onchange = () => {
          stateModel.selectedWorkflowId = workflowType.value || WORKFLOW_CATALOG[0].id;
          stateModel.lastStatusTone = "is-info";
          stateModel.lastStatusText = "Workflow template selected. Complete context and prepare package.";
          renderSurface();
        };
      }

      const fieldMap = [
        ["wfLightProject", "project"],
        ["wfLightCampaign", "campaign"],
        ["wfLightGoal", "goal"]
      ];

      fieldMap.forEach(([id, field]) => {
        const input = $(id);
        if (!input) return;
        input.oninput = () => {
          stateModel.inputsByWorkflow[stateModel.selectedWorkflowId][field] = input.value || "";
        };
      });

      Array.from(document.querySelectorAll("[data-wf-select]")).forEach((button) => {
        button.onclick = () => {
          const workflowId = button.getAttribute("data-wf-select") || WORKFLOW_CATALOG[0].id;
          stateModel.selectedWorkflowId = workflowId;
          stateModel.lastStatusTone = "is-info";
          stateModel.lastStatusText = `${getWorkflowDef(workflowId).title} selected. Continue session preparation.`;
          renderSurface();
        };
      });

      function prepareCurrentWorkflow() {
        const activeWorkflow = getSelectedWorkflow();
        const activeInputs = asObject(stateModel.inputsByWorkflow[activeWorkflow.id]);
        const missingFields = getMissingInputs(activeWorkflow, activeInputs);
        if (missingFields.length) {
          stateModel.lastStatusTone = "is-warning";
          stateModel.lastStatusText = `Preparation blocked. Missing: ${missingFields.map(titleCase).join(", ")}.`;
          renderSurface();
          return;
        }

        const prompt = buildSessionPrompt(activeWorkflow, activeInputs);
        const globalInput = $("quickCommandInput");
        if (globalInput) globalInput.value = prompt;

        stateModel.preparedPackage = {
          workflowId: activeWorkflow.id,
          prompt,
          createdAt: nowIso()
        };
        stateModel.lastStatusTone = "is-success";
        stateModel.lastStatusText = "Prepared package updated and mirrored in the global AI bar.";
        showMessage?.("Workflow prepared.");
        renderSurface();
      }

      function openAiWorkspace() {
        const activeWorkflow = getSelectedWorkflow();
        const activeInputs = asObject(stateModel.inputsByWorkflow[activeWorkflow.id]);
        const prompt = stateModel.preparedPackage?.workflowId === activeWorkflow.id
          ? stateModel.preparedPackage.prompt
          : buildSessionPrompt(activeWorkflow, activeInputs);

        setSharedAiDraft(projectName, {
          projectName,
          modeId: activeWorkflow.aiModeId,
          lastCommand: prompt,
          lastResponseTitle: activeWorkflow.title,
          routeSuggestions: [
            {
              label: "Workflows",
              route: "workflows",
              reason: "Return to workflow session after AI review."
            }
          ],
          updatedAt: nowIso()
        });

        const globalInput = $("quickCommandInput");
        if (globalInput) globalInput.value = prompt;

        stateModel.aiReviewed = true;
        stateModel.lastStatusTone = "is-info";
        stateModel.lastStatusText = "Session context sent to AI Workspace for review and refinement.";
        navigateTo("ai-command");
      }

      const heroPrepareBtn = root.querySelector("[data-wf-hero-prepare]");
      if (heroPrepareBtn) heroPrepareBtn.onclick = prepareCurrentWorkflow;

      Array.from(root.querySelectorAll("[data-wf-hero-ai]")).forEach((button) => {
        button.onclick = openAiWorkspace;
      });

      const prepareBtn = $("wfLightPrepareBtn");
      if (prepareBtn) prepareBtn.onclick = prepareCurrentWorkflow;

      const aiBtn = $("wfLightAiBtn");
      if (aiBtn) aiBtn.onclick = openAiWorkspace;

      const campaignBtn = $("wfLightCampaignBtn");
      if (campaignBtn) {
        campaignBtn.onclick = () => {
          stateModel.openedDestination = true;
          stateModel.lastStatusTone = "is-info";
          stateModel.lastStatusText = "Campaign Studio opened to continue this workflow session.";
          navigateTo("campaign-studio");
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
          stateModel.lastStatusText = `Opened ${titleCase(route)} for session continuity.`;
          navigateTo(route);
        };
      });

      const techBtn = root.querySelector("[data-wf-tech-focus]");
      if (techBtn) {
        techBtn.onclick = () => {
          const details = root.querySelector(".wfloop-tech-details");
          if (details) {
            details.open = true;
            details.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        };
      }
    }

    renderSurface();
  }
};
