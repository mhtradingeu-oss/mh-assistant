# PHASE 3X.3 — Workflows Copy Target Markers

## Candidate risky copy strings
public/control-center/pages/workflows.js:26:  runAutomationPlan
public/control-center/pages/workflows.js:33:    purpose: "Build a launch-ready execution sequence across campaign, content, and distribution.",
public/control-center/pages/workflows.js:41:    purpose: "Generate an execution-ready content plan tied to campaign and audience context.",
public/control-center/pages/workflows.js:56:    title: "Prepare Publishing Package",
public/control-center/pages/workflows.js:65:    purpose: "Summarize execution state, results, blockers, and the next operational decision.",
public/control-center/pages/workflows.js:92:  "Publishing",
public/control-center/pages/workflows.js:100:  "run-weekly-report": "generate-report",
public/control-center/pages/workflows.js:172:function normalizeRunStatus(status) {
public/control-center/pages/workflows.js:174:  if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
public/control-center/pages/workflows.js:181:  const runStatus = normalizeRunStatus(status);
public/control-center/pages/workflows.js:182:  if (runStatus === "completed") return "success";
public/control-center/pages/workflows.js:183:  if (runStatus === "running") return "warning";
public/control-center/pages/workflows.js:184:  if (runStatus === "failed") return "danger";
public/control-center/pages/workflows.js:211:function createEmptyRunState() {
public/control-center/pages/workflows.js:214:    runId: "",
public/control-center/pages/workflows.js:216:    lastRunAt: "",
public/control-center/pages/workflows.js:223:function createRunsMap() {
public/control-center/pages/workflows.js:225:    acc[workflow.id] = createEmptyRunState();
public/control-center/pages/workflows.js:243:    String(operations?.workflows?.total_runs || 0),
public/control-center/pages/workflows.js:320:      runsByWorkflow: createRunsMap(),
public/control-center/pages/workflows.js:346:    session.runsByWorkflow = session.runsByWorkflow || createRunsMap();
public/control-center/pages/workflows.js:373:  const nextRuns = createRunsMap();
public/control-center/pages/workflows.js:377:    if (!nextRuns[resolvedId]) return;
public/control-center/pages/workflows.js:380:    nextRuns[resolvedId] = {
public/control-center/pages/workflows.js:381:      ...nextRuns[resolvedId],
public/control-center/pages/workflows.js:383:      runId: asString(item.id),
public/control-center/pages/workflows.js:384:      source: asString(item.source || "durable-run"),
public/control-center/pages/workflows.js:385:      lastRunAt: asString(item.created_at),
public/control-center/pages/workflows.js:391:          source: asString(item.source || "durable-run"),
public/control-center/pages/workflows.js:398:  session.runsByWorkflow = nextRuns;
public/control-center/pages/workflows.js:453:  const allRuns = Object.values(asObject(session.runsByWorkflow));
public/control-center/pages/workflows.js:459:    running: 0,
public/control-center/pages/workflows.js:460:    lastExecutionAt: ""
public/control-center/pages/workflows.js:463:  allRuns.forEach((run) => {
public/control-center/pages/workflows.js:464:    const normalized = normalizeRunStatus(run.status);
public/control-center/pages/workflows.js:466:    else if (normalized === "running") counts.running += 1;
public/control-center/pages/workflows.js:470:    if (asString(run.lastRunAt) && (!counts.lastExecutionAt || Date.parse(run.lastRunAt) > Date.parse(counts.lastExecutionAt))) {
public/control-center/pages/workflows.js:471:      counts.lastExecutionAt = run.lastRunAt;
public/control-center/pages/workflows.js:475:  asArray(context.activity?.execution_results).forEach((item) => {
public/control-center/pages/workflows.js:477:    if (when && (!counts.lastExecutionAt || Date.parse(when) > Date.parse(counts.lastExecutionAt))) {
public/control-center/pages/workflows.js:478:      counts.lastExecutionAt = when;
public/control-center/pages/workflows.js:528:    title: `${workflow.title} execution package`,
public/control-center/pages/workflows.js:532:      `Open ${titleCase(workflow.routeHint)} for execution handoff.`,
public/control-center/pages/workflows.js:533:      blockedRequirements.length ? "Resolve blockers before live execution." : "Proceed to execution handoff."
public/control-center/pages/workflows.js:541:        reason: `Continue execution in ${titleCase(workflow.routeHint)}.`
public/control-center/pages/workflows.js:544:        label: "Open AI Workspace",
public/control-center/pages/workflows.js:571:      prompt: firstNonEmpty(globalAction?.draftPayload?.prompt, `Build a ${mapped.title.toLowerCase()} execution plan from current system blockers and dependencies.`)
public/control-center/pages/workflows.js:578:      title: "Run Fix Integrations next",
public/control-center/pages/workflows.js:588:      title: "Prepare publishing package before distribution",
public/control-center/pages/workflows.js:590:      chips: ["Publishing", "Campaign", "Launch readiness"],
public/control-center/pages/workflows.js:601:      prompt: "Create a launch campaign workflow with owner sequence and execution gates."
public/control-center/pages/workflows.js:609:    reason: "Current context is sufficient to run the selected execution workflow now.",
public/control-center/pages/workflows.js:610:    chips: ["Content", "Campaign", "Publishing"],
public/control-center/pages/workflows.js:611:    prompt: `Refine ${selected.title.toLowerCase()} for immediate execution with explicit dependencies and next actions.`
public/control-center/pages/workflows.js:629:        <article class="wfexec-stat wfexec-stat-wide"><span>Last execution</span><strong>${escapeHtml(metrics.lastExecutionAt ? formatDateTime(metrics.lastExecutionAt) : "No execution yet")}</strong></article>
public/control-center/pages/workflows.js:669:        Safe execution only: navigate, create draft, generate prompt, and create handoff.
public/control-center/pages/workflows.js:698:        <button id="workflowRunFullAutomationBtn" class="wfexec-btn wfexec-btn-primary" type="button">
public/control-center/pages/workflows.js:701:        <button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:719:        Hands-free safe execution with approval gates and inline logs.
public/control-center/pages/workflows.js:724:          Start Guided Mode
public/control-center/pages/workflows.js:761:                Skip Step
public/control-center/pages/workflows.js:814:        <button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Workflow Package</button>
public/control-center/pages/workflows.js:815:        <button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>
public/control-center/pages/workflows.js:832:          const run = asObject(session.runsByWorkflow[workflow.id]);
public/control-center/pages/workflows.js:843:              <div class="wfexec-required"><strong>Readiness status:</strong> ${escapeHtml(ready ? "Ready to run" : blocked[0])}</div>
public/control-center/pages/workflows.js:845:                <button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>
public/control-center/pages/workflows.js:849:              ${run.lastRunAt ? `<div class="wfexec-catalog-meta">Last run ${escapeHtml(formatDateTime(run.lastRunAt))}</div>` : ""}
public/control-center/pages/workflows.js:858:function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
public/control-center/pages/workflows.js:859:  const output = asObject(run.output);
public/control-center/pages/workflows.js:863:        <div class="wfexec-head"><h3>Execution Status / Result</h3></div>
public/control-center/pages/workflows.js:872:        <h3>Execution Status / Result</h3>
public/control-center/pages/workflows.js:873:        <span class="wfexec-meta">${escapeHtml(run.lastRunAt ? formatDateTime(run.lastRunAt) : "recent")}</span>
public/control-center/pages/workflows.js:891:        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Handoff</button>
public/control-center/pages/workflows.js:895:      <div class="wfexec-meta">Workflow: ${escapeHtml(workflow.title)} · Status: ${escapeHtml(titleCase(normalizeRunStatus(run.status)))}</div>
public/control-center/pages/workflows.js:900:function renderWorkflowExecutionLoop({
public/control-center/pages/workflows.js:909:  run,
public/control-center/pages/workflows.js:924:          ${renderExecutionSection(run, workflow, blockedRequirements, escapeHtml)}
public/control-center/pages/workflows.js:953:    const run = session.runsByWorkflow[workflowId];
public/control-center/pages/workflows.js:954:    run.output = asObject(payload.output);
public/control-center/pages/workflows.js:955:    run.status = "completed";
public/control-center/pages/workflows.js:956:    run.lastRunAt = nowIso();
public/control-center/pages/workflows.js:957:    run.source = "handoff";
public/control-center/pages/workflows.js:958:    run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output: run.output });
public/control-center/pages/workflows.js:959:    run.history = run.history.slice(0, 8);
public/control-center/pages/workflows.js:979:    session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to run workflows." };
public/control-center/pages/workflows.js:1039:function buildAiHandoffPrompt(workflow, inputs, runOutput, context) {
public/control-center/pages/workflows.js:1040:  if (runOutput?.summary) {
public/control-center/pages/workflows.js:1042:      `Refine the ${workflow.title.toLowerCase()} execution package.`,
public/control-center/pages/workflows.js:1045:      `Summary: ${runOutput.summary}`,
public/control-center/pages/workflows.js:1046:      `Next actions: ${asArray(runOutput.nextActions).join("; ")}`
public/control-center/pages/workflows.js:1050:    `Build a ${workflow.title.toLowerCase()} execution package.`,
public/control-center/pages/workflows.js:1065:  run,
public/control-center/pages/workflows.js:1072:  const prompt = buildAiHandoffPrompt(workflow, inputs, run.output, context);
public/control-center/pages/workflows.js:1077:    lastResponseTitle: asString(run.output?.title || workflow.title),
public/control-center/pages/workflows.js:1078:    routeSuggestions: asArray(run.output?.routeSuggestions)
public/control-center/pages/workflows.js:1091:      output: asObject(run.output)
public/control-center/pages/workflows.js:1130:      runProjectWorkflow,
public/control-center/pages/workflows.js:1131:      runProjectAiWorkflow,
public/control-center/pages/workflows.js:1151:    if (!meta.autoRun) {
public/control-center/pages/workflows.js:1157:    const run = session.runsByWorkflow[workflow.id];
public/control-center/pages/workflows.js:1158:    run.status = "running";
public/control-center/pages/workflows.js:1173:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
public/control-center/pages/workflows.js:1181:          source: "workflow-auto-run"
public/control-center/pages/workflows.js:1184:      const output = asObject(result?.output || result?.run?.output) || buildFallbackOutput(workflow, session.inputsByWorkflow[workflow.id], contextModel);
public/control-center/pages/workflows.js:1185:      run.status = "completed";
public/control-center/pages/workflows.js:1186:      run.lastRunAt = asString(result?.run?.created_at) || createdAt;
public/control-center/pages/workflows.js:1187:      run.runId = asString(result?.run?.id);
public/control-center/pages/workflows.js:1188:      run.source = meta.source || "external-trigger";
public/control-center/pages/workflows.js:1189:      run.output = output;
public/control-center/pages/workflows.js:1190:      run.blockedRequirements = asArray(output.blockedRequirements || output.blocked_requirements);
public/control-center/pages/workflows.js:1191:      run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output });
public/control-center/pages/workflows.js:1192:      run.history = run.history.slice(0, 8);
public/control-center/pages/workflows.js:1196:      run.status = "failed";
public/control-center/pages/workflows.js:1197:      showError?.(error.message || "Workflow execution failed.");
public/control-center/pages/workflows.js:1206:function bindWorkflowExecutionLoop({
public/control-center/pages/workflows.js:1215:  runProjectWorkflow,
public/control-center/pages/workflows.js:1216:  runProjectAiWorkflow,
public/control-center/pages/workflows.js:1234:  const run = session.runsByWorkflow[workflow.id];
public/control-center/pages/workflows.js:1312:        session.inputsByWorkflow[session.selectedWorkflowId].goal = firstNonEmpty(inputs.goal, "Execution loop optimization");
public/control-center/pages/workflows.js:1333:function confirmWorkflowBackendRun(workflow) {
public/control-center/pages/workflows.js:1337:    `Confirm workflow preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It does not publish, send messages, create CRM records, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
public/control-center/pages/workflows.js:1341:  async function runWorkflow(workflowId) {
public/control-center/pages/workflows.js:1356:      setValidation("Select a project before running a workflow.");
public/control-center/pages/workflows.js:1360:    const confirmed = confirmWorkflowBackendRun(activeWorkflow);
public/control-center/pages/workflows.js:1362:      setValidation("Workflow preparation cancelled. No backend workflow run was recorded.");
public/control-center/pages/workflows.js:1367:    const activeRun = session.runsByWorkflow[activeWorkflow.id];
public/control-center/pages/workflows.js:1368:    activeRun.status = "running";
public/control-center/pages/workflows.js:1369:    activeRun.source = "manual-run";
public/control-center/pages/workflows.js:1385:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, activeWorkflow.id, {
public/control-center/pages/workflows.js:1388:        source: "manual-run",
public/control-center/pages/workflows.js:1394:          source: "workflow-manual-run"
public/control-center/pages/workflows.js:1398:      const output = asObject(result?.output || result?.run?.output);
public/control-center/pages/workflows.js:1403:      activeRun.status = "completed";
public/control-center/pages/workflows.js:1404:      activeRun.lastRunAt = asString(result?.run?.created_at) || createdAt;
public/control-center/pages/workflows.js:1405:      activeRun.runId = asString(result?.run?.id);
public/control-center/pages/workflows.js:1406:      activeRun.output = safeOutput;
public/control-center/pages/workflows.js:1407:      activeRun.blockedRequirements = asArray(safeOutput.blockedRequirements || safeOutput.blocked_requirements);
public/control-center/pages/workflows.js:1408:      activeRun.history.unshift({ createdAt: activeRun.lastRunAt, source: "manual-run", output: safeOutput });
public/control-center/pages/workflows.js:1409:      activeRun.history = activeRun.history.slice(0, 8);
public/control-center/pages/workflows.js:1416:          run_id: activeRun.runId,
public/control-center/pages/workflows.js:1419:          createdAt: activeRun.lastRunAt
public/control-center/pages/workflows.js:1427:      activeRun.status = "failed";
public/control-center/pages/workflows.js:1428:      activeRun.output = {
public/control-center/pages/workflows.js:1430:        summary: error.message || "Workflow execution failed.",
public/control-center/pages/workflows.js:1431:        blockedRequirements: ["Execution failed. Review inputs and retry."],
public/control-center/pages/workflows.js:1434:      activeRun.blockedRequirements = asArray(activeRun.output.blockedRequirements);
public/control-center/pages/workflows.js:1435:      showError?.(error.message || "Workflow execution failed.");
public/control-center/pages/workflows.js:1441:  const runBtn = $("workflowRunBtn");
public/control-center/pages/workflows.js:1442:  if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);
public/control-center/pages/workflows.js:1443:  const runBtnMain = $("workflowRunBtnMain");
public/control-center/pages/workflows.js:1444:  if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);
public/control-center/pages/workflows.js:1450:      runWorkflow(rec.workflowId);
public/control-center/pages/workflows.js:1476:        run: session.runsByWorkflow[recWorkflow.id],
public/control-center/pages/workflows.js:1486:  Array.from(document.querySelectorAll("[data-wf-catalog-run]")).forEach((button) => {
public/control-center/pages/workflows.js:1487:    button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") || session.selectedWorkflowId);
public/control-center/pages/workflows.js:1509:        run: session.runsByWorkflow[workflowId],
public/control-center/pages/workflows.js:1526:        run,
public/control-center/pages/workflows.js:1542:      if (!run.output) {
public/control-center/pages/workflows.js:1551:        summary: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1552:        description: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1556:          source_type: "workflow_run",
public/control-center/pages/workflows.js:1557:          source_id: run.runId || run.lastRunAt || "",
public/control-center/pages/workflows.js:1562:          output: asObject(run.output),
public/control-center/pages/workflows.js:1563:          notes: asArray(run.output.nextActions || []),
public/control-center/pages/workflows.js:1570:      showMessage?.("Task handoff prepared for review in Task Center.");
public/control-center/pages/workflows.js:1580:        "Recommend the best workflow to run next.",
public/control-center/pages/workflows.js:1647:  const fullAutomationBtn = $("workflowRunFullAutomationBtn");
public/control-center/pages/workflows.js:1662:      const result = await runAutomationPlan(plan, {
public/control-center/pages/workflows.js:1670:      workflowAutomationState.result = result.status === "success" ? "Automation simulation completed." : "Automation simulation stopped before completion.";
public/control-center/pages/workflows.js:1676:  const stepAutomationBtn = $("workflowRunStepAutomationBtn");
public/control-center/pages/workflows.js:1691:      const stepResult = await runAutomationPlan(singleStep, {
public/control-center/pages/workflows.js:1693:        onProgress: ({ index, total, step, result: runResult }) => {
public/control-center/pages/workflows.js:1694:          workflowAutomationState.progress = `Step ${nextIndex + index} / ${plan.length}: ${step.action} (${runResult.status})`;
public/control-center/pages/workflows.js:1775:    description: "Prepare structured, repeatable workflow packages for common marketing and execution operations."
public/control-center/pages/workflows.js:1792:    const executionMode = asString(state.context.executionMode || "");
public/control-center/pages/workflows.js:1803:    const workflowsTotal = Number(operations.workflows?.total_runs || operations.workflows?.total || 0);
public/control-center/pages/workflows.js:1860:        `Goal: ${inputs.goal || "Prepare an execution-ready workflow package."}`
public/control-center/pages/workflows.js:1934:          ? "Review in AI Workspace."
public/control-center/pages/workflows.js:1935:          : "Prepare workflow package.";
public/control-center/pages/workflows.js:1960:              <span class="badge">Mode: ${escapeHtml(executionMode || "manual")}</span>
public/control-center/pages/workflows.js:2066:                <button id="wfLightAiBtn" class="btn btn-secondary" type="button">Review in AI Workspace</button>
public/control-center/pages/workflows.js:2088:                <p>Existing runtime execution helpers are preserved in file scope and not activated by this active render surface.</p>
public/control-center/pages/workflows.js:2098:                  <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open AI Workspace</button>
public/control-center/pages/workflows.js:2109:                      <p class="mhos-destination-title">Review in AI Workspace</p>
public/control-center/pages/workflows.js:2148:                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now · Future-gated execution authority remains in destination tools</p>
public/control-center/pages/workflows.js:2166:                          <span>${escapeHtml(titleCase(normalizeRunStatus(item.status || "draft")))}</span>
public/control-center/pages/workflows.js:2176:                  <span>Mode ${escapeHtml(executionMode || "manual")}</span>
public/control-center/automation-engine.js:17:  { test: /publish\s*now|go\s*live|send\s*live|execute\s*publish|push\s*live/i, reason: "Publishing requires approval and manual confirmation." },
public/control-center/automation-engine.js:19:  { test: /\boverwrite\b|\breplace\b|\btruncate\b/i, reason: "Overwrite actions are blocked in Auto Mode." },
public/control-center/automation-engine.js:30:const autoModeRuntime = {
public/control-center/automation-engine.js:32:  runToken: 0
public/control-center/automation-engine.js:68:    lastRunAt: "",
public/control-center/automation-engine.js:82:    status: ["idle", "running", "paused", "waiting_approval", "completed", "failed"].includes(normalizeText(parsed.status))
public/control-center/automation-engine.js:86:    lastRunAt: asString(parsed.lastRunAt),
public/control-center/automation-engine.js:99:    if (state.status === "running" || state.status === "waiting_approval") {
public/control-center/automation-engine.js:151:    ...asObject(autoModeRuntime.context),
public/control-center/automation-engine.js:238:      reason: "Publishing actions require manual approval before execution.",
public/control-center/automation-engine.js:331:export async function runAutomationStep(step, context = {}) {
public/control-center/automation-engine.js:440:      return { status: "success", reason: "Publishing draft prepared.", step };
public/control-center/automation-engine.js:467:    return { status: "skipped", reason: "No runnable action for step type.", step };
public/control-center/automation-engine.js:473:export async function runAutomationPlan(plan, options = {}) {
public/control-center/automation-engine.js:488:    const result = await runAutomationStep(step, options.context || {});
public/control-center/automation-engine.js:521:async function runAutoModeLoop(options = {}) {
public/control-center/automation-engine.js:524:  const activeToken = autoModeRuntime.runToken;
public/control-center/automation-engine.js:527:    if (activeToken !== autoModeRuntime.runToken) return getAutoModeState();
public/control-center/automation-engine.js:528:    if (autoModeState.status !== "running") return getAutoModeState();
public/control-center/automation-engine.js:554:    const result = await runAutomationStep(step, context);
public/control-center/automation-engine.js:590:  autoModeRuntime.context = {
public/control-center/automation-engine.js:613:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:618:  autoModeState.status = "running";
public/control-center/automation-engine.js:619:  autoModeState.lastRunAt = nowIso();
public/control-center/automation-engine.js:633:  return runAutoModeLoop(options);
public/control-center/automation-engine.js:637:  if (autoModeState.status !== "running") return getAutoModeState();
public/control-center/automation-engine.js:638:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:650:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:657:  autoModeState.status = "running";
public/control-center/automation-engine.js:661:  return runAutoModeLoop(options);
public/control-center/automation-engine.js:665:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:702:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:703:  autoModeState.status = "running";
public/control-center/automation-engine.js:705:  return runAutoModeLoop(options);
public/control-center/automation-engine.js:724:  autoModeRuntime.runToken += 1;
public/control-center/automation-engine.js:725:  autoModeState.status = "running";
public/control-center/automation-engine.js:727:  return runAutoModeLoop(options);

## Relevant rendering ranges

### Automation section
function renderAutomationSection(fullPlan, fixPlan, autoMode, escapeHtml) {
  const esc = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

  const steps = asArray(fullPlan).slice(0, 8);
  const gate = asObject(autoMode?.approvalRequiredStep);

  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Automation Layer</h3></div>
      <p class="wfexec-rec-reason">
        Safe execution only: navigate, create draft, generate prompt, and create handoff.
      </p>

      <div class="wfexec-overview-grid">
        <article class="wfexec-stat">
          <span>Full plan steps</span>
          <strong>${esc(String(asArray(fullPlan).length))}</strong>
        </article>
        <article class="wfexec-stat">
          <span>Critical fix steps</span>
          <strong>${esc(String(asArray(fixPlan).length))}</strong>
        </article>
      </div>

      ${
        steps.length
          ? `<ol class="home-decision-list home-decision-list-spaced">
              ${steps.map((step, idx) => `
                <li>
                  <strong>${esc(`Step ${idx + 1}`)}:</strong>
                  ${esc(step.action)} 
                  (${esc(step.type)} → ${esc(step.targetPage)})
                </li>
              `).join("")}
            </ol>`
          : `<div class="wfexec-empty">No safe automation steps are available.</div>`
      }

      <div class="wfexec-action-row">
        <button id="workflowRunFullAutomationBtn" class="wfexec-btn wfexec-btn-primary" type="button">
          Simulate Full Automation
        </button>
        <button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
          Simulate Next Step
        </button>
      </div>

      <div id="workflowAutomationProgress" class="wfexec-meta">
        ${esc(workflowAutomationState.progress || "")}
      </div>

      <div id="workflowAutomationResult" class="wfexec-meta">
        ${esc(workflowAutomationState.result || "")}
      </div>

      <div class="wfexec-head" style="margin-top:10px;">
        <h3>Auto Mode</h3>
      </div>

      <p class="wfexec-rec-reason">
        Hands-free safe execution with approval gates and inline logs.
      </p>

      <div class="wfexec-action-row">
        <button id="workflowAutoStartBtn" class="wfexec-btn wfexec-btn-primary" type="button">
          Start Guided Mode
        </button>
        <button id="workflowAutoPauseBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
          Pause
        </button>
        <button id="workflowAutoResumeBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
          Resume
        </button>
        <button id="workflowAutoStopBtn" class="wfexec-btn wfexec-btn-ghost" type="button">
          Stop
        </button>
      </div>

      <div class="wfexec-meta">
        Status: ${esc(autoMode?.status || "idle")}
      </div>

      <div class="wfexec-meta">
        Current step: ${esc(
          asArray(autoMode?.currentPlan)[autoMode?.currentStepIndex]?.action || "None"
        )}
      </div>

      ${
        autoMode?.status === "waiting_approval"
          ? `
            <div class="wfexec-meta">
              <strong>Approval needed:</strong> ${esc(gate.reason || "Manual approval required.")}
            </div>
            <div class="wfexec-meta">
              ${esc(gate.whatWillHappen || "Auto Mode is paused.")}
            </div>
            <div class="wfexec-action-row">
              <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
                Approve and Continue
              </button>
              <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
                Skip Step
              </button>
            </div>
          `
          : ""
      }

      <div class="wfexec-meta">
        ${esc(
          asArray(autoMode?.logs)

### Builder section
function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Workflow Builder / Launcher</h3></div>
      <div class="wfexec-field-grid">
        <div>
          <label class="wfexec-label" for="wfexecWorkflowType">Workflow type</label>
          <select id="wfexecWorkflowType" class="wfexec-select">
            ${WORKFLOW_CATALOG.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === workflow.id ? " selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="wfexec-label" for="wfexecInputProject">Project</label>
          <input id="wfexecInputProject" class="wfexec-input" data-wf-input="project" type="text" value="${escapeHtml(inputs.project || "")}" placeholder="Current project">
        </div>
        <div>
          <label class="wfexec-label" for="wfexecInputCampaign">Campaign</label>
          <input id="wfexecInputCampaign" class="wfexec-input" data-wf-input="campaign" type="text" value="${escapeHtml(inputs.campaign || "")}" placeholder="Campaign name">
        </div>
        <div>
          <label class="wfexec-label" for="wfexecInputProduct">Product</label>
          <input id="wfexecInputProduct" class="wfexec-input" data-wf-input="product" type="text" value="${escapeHtml(inputs.product || "")}" placeholder="Product or offer">
        </div>
        <div>
          <label class="wfexec-label" for="wfexecInputChannel">Channel</label>
          <input id="wfexecInputChannel" class="wfexec-input" data-wf-input="channel" type="text" value="${escapeHtml(inputs.channel || "")}" placeholder="Channel or channel set">
        </div>
        <div>
          <label class="wfexec-label" for="wfexecInputGoal">Goal</label>
          <input id="wfexecInputGoal" class="wfexec-input" data-wf-input="goal" type="text" value="${escapeHtml(inputs.goal || "")}" placeholder="Outcome goal">
        </div>
      </div>
      <div id="wfexecValidation" class="wfexec-validation${validationMessage ? " is-visible" : ""}">${escapeHtml(validationMessage || "")}</div>
      <div class="wfexec-action-row">
        <button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Workflow Package</button>
        <button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>
        <button id="wfexecSaveDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>
        <button id="wfexecLoadAiStateBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Load AI Command State</button>
        <button id="wfexecClearDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Clear</button>
      </div>
      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
    </section>
  `;

### Catalog section
function renderCatalogSection(session, context, escapeHtml) {
  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Workflow Catalog</h3></div>
      <div class="wfexec-catalog-grid">
        ${WORKFLOW_CATALOG.map((workflow) => {
          const inputs = asObject(session.inputsByWorkflow[workflow.id]);
          const run = asObject(session.runsByWorkflow[workflow.id]);
          const blocked = getBlockedRequirements(workflow, inputs, context);
          const ready = blocked.length === 0;
          return `
            <article class="wfexec-catalog-card${workflow.id === session.selectedWorkflowId ? " is-active" : ""}">
              <div class="wfexec-catalog-top">
                <h4>${escapeHtml(workflow.title)}</h4>
                <span class="card-badge ${ready ? "success" : "warning"}">${escapeHtml(ready ? "Ready" : "Needs input")}</span>
              </div>
              <p>${escapeHtml(workflow.purpose)}</p>
              <div class="wfexec-required"><strong>Required inputs:</strong> ${escapeHtml(workflow.requiredInputs.map(titleCase).join(", "))}</div>
              <div class="wfexec-required"><strong>Readiness status:</strong> ${escapeHtml(ready ? "Ready to run" : blocked[0])}</div>
              <div class="wfexec-action-row">
                <button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>
                <button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>
                <button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>
              </div>
              ${run.lastRunAt ? `<div class="wfexec-catalog-meta">Last run ${escapeHtml(formatDateTime(run.lastRunAt))}</div>` : ""}
            </article>
          `;
        }).join("")}

### Execution output section
function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
  const output = asObject(run.output);
  if (!output.summary) {
    return `
      <section class="wfexec-section">
        <div class="wfexec-head"><h3>Execution Status / Result</h3></div>
        <div class="wfexec-empty">No prepared package yet. Prepare a workflow package to generate a review-ready output.</div>
      </section>
    `;
  }

  return `
    <section class="wfexec-section">
      <div class="wfexec-head">
        <h3>Execution Status / Result</h3>
        <span class="wfexec-meta">${escapeHtml(run.lastRunAt ? formatDateTime(run.lastRunAt) : "recent")}</span>
      </div>
      <div class="wfexec-result-summary">${escapeHtml(output.summary)}</div>
      ${blockedRequirements.length ? `
        <div class="wfexec-blockers">
          <strong>Blocked requirements</strong>
          <ul>${blockedRequirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      ` : ""}
      <div class="wfexec-result-list">
        <div>
          <span>Next actions</span>
          <ul>${asArray(output.nextActions).map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("") || "<li>No next action list</li>"}</ul>
        </div>
      </div>
      <div class="wfexec-action-row">
        <button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Refine in AI Command</button>
        <button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>
        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Handoff</button>
        <button id="workflowBuildCustomBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Build Custom Workflow</button>
        <button id="workflowRecommendBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Recommend Workflow</button>
      </div>
      <div class="wfexec-meta">Workflow: ${escapeHtml(workflow.title)} · Status: ${escapeHtml(titleCase(normalizeRunStatus(run.status)))}</div>

### Confirmation copy
    };
  }

function confirmWorkflowBackendRun(workflow) {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  const title = workflow?.title || "this workflow";
  return window.confirm(
    `Confirm workflow preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It does not publish, send messages, create CRM records, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
  );
}


### Automation button handlers
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

### Active route surface
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

### Active route bindings
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
