# PHASE 3X.1 — Workflows Raw Evidence

## Workflows JS size
    2365 public/control-center/pages/workflows.js

## Imports / exports / handlers
1:import {
7:import {
13:import { getGlobalNextBestAction } from "../system-intelligence.js";
14:import {
615:function renderImpactChips(activeLabels, escapeHtml) {
620:function renderOverviewSection(metrics, context, escapeHtml) {
636:function renderRecommendationSection(recommendation, escapeHtml) {
652:function renderAutomationSection(fullPlan, fixPlan, autoMode, escapeHtml) {
780:function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
825:function renderCatalogSection(session, context, escapeHtml) {
858:function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
900:function renderWorkflowExecutionLoop({
969:async function ensureWorkflowIntelligenceLoaded({
1001:    loadingPromise: (async () => {
1118:  window.addEventListener("mh:submit-workflow", async (event) => {
1206:function bindWorkflowExecutionLoop({
1273:    saveDraftBtn.onclick = () => {
1282:    clearDraftBtn.onclick = () => {
1294:    loadAiStateBtn.onclick = () => {
1341:  async function runWorkflow(workflowId) {
1442:  if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);
1444:  if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);
1448:    startRecommendedBtn.onclick = () => {
1456:    saveRecommendedBtn.onclick = () => {
1468:    sendRecommendedAiBtn.onclick = () => {
1487:    button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") || session.selectedWorkflowId);
1491:    button.onclick = () => {
1501:    button.onclick = () => {
1521:    pushAiBtn.onclick = () => {
1537:  if (pushAiSecondaryBtn) pushAiSecondaryBtn.onclick = pushAiBtn?.onclick || null;
1541:    saveTaskBtn.onclick = () => {
1577:    recommendBtn.onclick = () => {
1613:    customBtn.onclick = () => {
1649:    fullAutomationBtn.onclick = async () => {
1678:    stepAutomationBtn.onclick = async () => {
1711:    autoStartBtn.onclick = async () => {
1730:    autoPauseBtn.onclick = () => {
1738:    autoResumeBtn.onclick = async () => {
1746:    autoStopBtn.onclick = () => {
1754:    autoApproveBtn.onclick = async () => {
1762:    autoSkipBtn.onclick = async () => {
1769:export const workflowsRoute = {
1915:    function renderSurface() {
2209:        button.onclick = () => {
2276:      if (heroPrepareBtn) heroPrepareBtn.onclick = prepareCurrentWorkflow;
2279:        button.onclick = openAiWorkspace;
2283:      if (prepareBtn) prepareBtn.onclick = prepareCurrentWorkflow;
2286:      if (aiBtn) aiBtn.onclick = openAiWorkspace;
2290:        campaignBtn.onclick = () => {
2300:        tasksBtn.onclick = () => {
2324:        button.onclick = () => {
2353:        techBtn.onclick = () => {

## Workflow execution / automation markers
public/control-center/pages/workflows.js:18:  startAutoMode,
public/control-center/pages/workflows.js:22:  approveCurrentGate,
public/control-center/pages/workflows.js:26:  runAutomationPlan
public/control-center/pages/workflows.js:27:} from "../automation-engine.js";
public/control-center/pages/workflows.js:31:    id: "launch-campaign",
public/control-center/pages/workflows.js:32:    title: "Launch Campaign",
public/control-center/pages/workflows.js:33:    purpose: "Build a launch-ready execution sequence across campaign, content, and distribution.",
public/control-center/pages/workflows.js:34:    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
public/control-center/pages/workflows.js:35:    aiModeId: "strategist",
public/control-center/pages/workflows.js:36:    routeHint: "campaign-studio"
public/control-center/pages/workflows.js:41:    purpose: "Generate an execution-ready content plan tied to campaign and audience context.",
public/control-center/pages/workflows.js:42:    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
public/control-center/pages/workflows.js:43:    aiModeId: "writer",
public/control-center/pages/workflows.js:47:    id: "build-media-job",
public/control-center/pages/workflows.js:49:    purpose: "Prepare media production inputs, format guidance, and downstream handoff steps.",
public/control-center/pages/workflows.js:50:    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
public/control-center/pages/workflows.js:51:    aiModeId: "media",
public/control-center/pages/workflows.js:55:    id: "prepare-publishing-package",
public/control-center/pages/workflows.js:57:    purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
public/control-center/pages/workflows.js:58:    requiredInputs: ["project", "campaign", "channel", "goal"],
public/control-center/pages/workflows.js:59:    aiModeId: "operations",
public/control-center/pages/workflows.js:60:    routeHint: "publishing"
public/control-center/pages/workflows.js:65:    purpose: "Summarize execution state, results, blockers, and the next operational decision.",
public/control-center/pages/workflows.js:66:    requiredInputs: ["project", "campaign", "goal"],
public/control-center/pages/workflows.js:67:    aiModeId: "analyst",
public/control-center/pages/workflows.js:73:    purpose: "Create a competitor intelligence brief for positioning and campaign advantage.",
public/control-center/pages/workflows.js:75:    aiModeId: "researcher",
public/control-center/pages/workflows.js:81:    purpose: "Prioritize integration recovery actions that restore readiness and automation reliability.",
public/control-center/pages/workflows.js:83:    aiModeId: "operations",
public/control-center/pages/workflows.js:91:  "Campaign",
public/control-center/pages/workflows.js:98:  "launch-product": "launch-campaign",
public/control-center/pages/workflows.js:99:  "generate-campaign": "launch-campaign",
public/control-center/pages/workflows.js:100:  "run-weekly-report": "generate-report",
public/control-center/pages/workflows.js:101:  "build-ads": "launch-campaign"
public/control-center/pages/workflows.js:104:const WORKFLOW_LOCAL_DRAFTS_KEY = "mh-workflow-local-drafts-v1";
public/control-center/pages/workflows.js:106:const workflowSessions = new Map();
public/control-center/pages/workflows.js:108:let workflowBridgeRegistered = false;
public/control-center/pages/workflows.js:109:let workflowAutoModeUnsubscribe = null;
public/control-center/pages/workflows.js:110:let workflowAutomationEnabled = false;
public/control-center/pages/workflows.js:111:const workflowAutomationState = {
public/control-center/pages/workflows.js:174:  if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
public/control-center/pages/workflows.js:175:  if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";
public/control-center/pages/workflows.js:181:  const runStatus = normalizeRunStatus(status);
public/control-center/pages/workflows.js:182:  if (runStatus === "completed") return "success";
public/control-center/pages/workflows.js:183:  if (runStatus === "running") return "warning";
public/control-center/pages/workflows.js:184:  if (runStatus === "failed") return "danger";
public/control-center/pages/workflows.js:198:    ...asArray(activity.scheduled_jobs).map((job) => asString(job.channel)),
public/control-center/pages/workflows.js:204:    campaign: firstNonEmpty(context.activeCampaign),
public/control-center/pages/workflows.js:214:    runId: "",
public/control-center/pages/workflows.js:224:  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
public/control-center/pages/workflows.js:225:    acc[workflow.id] = createEmptyRunState();
public/control-center/pages/workflows.js:231:  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
public/control-center/pages/workflows.js:232:    acc[workflow.id] = {
public/control-center/pages/workflows.js:243:    String(operations?.workflows?.total_runs || 0),
public/control-center/pages/workflows.js:244:    String(operations?.tasks?.total || 0)
public/control-center/pages/workflows.js:271:function saveLocalDraft(projectName, workflowId, payload) {
public/control-center/pages/workflows.js:275:  projectDrafts[workflowId] = {
public/control-center/pages/workflows.js:276:    ...asObject(projectDrafts[workflowId]),
public/control-center/pages/workflows.js:282:  return projectDrafts[workflowId];
public/control-center/pages/workflows.js:288:  WORKFLOW_CATALOG.forEach((workflow) => {
public/control-center/pages/workflows.js:289:    const draft = asObject(local[workflow.id]);
public/control-center/pages/workflows.js:291:    session.inputsByWorkflow[workflow.id] = {
public/control-center/pages/workflows.js:292:      ...session.inputsByWorkflow[workflow.id],
public/control-center/pages/workflows.js:296:      session.selectedWorkflowId = workflow.id;
public/control-center/pages/workflows.js:305:function persistWorkflowDraft(projectName, session, workflowId, hint, selected) {
public/control-center/pages/workflows.js:306:  const saved = saveLocalDraft(projectName, workflowId, {
public/control-center/pages/workflows.js:307:    inputs: asObject(session.inputsByWorkflow[workflowId]),
public/control-center/pages/workflows.js:308:    workflowId,
public/control-center/pages/workflows.js:316:  if (!workflowSessions.has(key)) {
public/control-center/pages/workflows.js:317:    workflowSessions.set(key, {
public/control-center/pages/workflows.js:320:      runsByWorkflow: createRunsMap(),
public/control-center/pages/workflows.js:338:    const session = workflowSessions.get(key);
public/control-center/pages/workflows.js:339:    session.inputsByWorkflow = WORKFLOW_CATALOG.reduce((acc, workflow) => {
public/control-center/pages/workflows.js:340:      acc[workflow.id] = {
public/control-center/pages/workflows.js:342:        ...asObject(session.inputsByWorkflow?.[workflow.id])
public/control-center/pages/workflows.js:346:    session.runsByWorkflow = session.runsByWorkflow || createRunsMap();
public/control-center/pages/workflows.js:363:  const session = workflowSessions.get(key);
public/control-center/pages/workflows.js:374:  asArray(operations?.workflows?.items).forEach((item) => {
public/control-center/pages/workflows.js:375:    const sourceId = asString(item.workflow_id);
public/control-center/pages/workflows.js:383:      runId: asString(item.id),
public/control-center/pages/workflows.js:384:      source: asString(item.source || "durable-run"),
public/control-center/pages/workflows.js:391:          source: asString(item.source || "durable-run"),
public/control-center/pages/workflows.js:398:  session.runsByWorkflow = nextRuns;
public/control-center/pages/workflows.js:437:    campaignName: firstNonEmpty(state.context.activeCampaign),
public/control-center/pages/workflows.js:453:  const allRuns = Object.values(asObject(session.runsByWorkflow));
public/control-center/pages/workflows.js:458:    failed: 0,
public/control-center/pages/workflows.js:459:    running: 0,
public/control-center/pages/workflows.js:463:  allRuns.forEach((run) => {
public/control-center/pages/workflows.js:464:    const normalized = normalizeRunStatus(run.status);
public/control-center/pages/workflows.js:466:    else if (normalized === "running") counts.running += 1;
public/control-center/pages/workflows.js:467:    else if (normalized === "failed") counts.failed += 1;
public/control-center/pages/workflows.js:470:    if (asString(run.lastRunAt) && (!counts.lastExecutionAt || Date.parse(run.lastRunAt) > Date.parse(counts.lastExecutionAt))) {
public/control-center/pages/workflows.js:471:      counts.lastExecutionAt = run.lastRunAt;
public/control-center/pages/workflows.js:475:  asArray(context.activity?.execution_results).forEach((item) => {
public/control-center/pages/workflows.js:476:    const when = asString(item.executed_at || item.created_at);
public/control-center/pages/workflows.js:485:function getBlockedRequirements(workflow, inputs, context) {
public/control-center/pages/workflows.js:487:  const missingRequired = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
public/control-center/pages/workflows.js:492:  if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {
public/control-center/pages/workflows.js:496:  if (workflow.id === "generate-report" && context.missingIntegrations.length) {
public/control-center/pages/workflows.js:500:  if (workflow.id === "fix-integrations" && !context.missingIntegrations.length) {
public/control-center/pages/workflows.js:501:    blocked.push("No integration gaps detected. Use this workflow only if connectors are unstable.");
public/control-center/pages/workflows.js:507:function buildWorkflowPrompt(workflow, inputs, context) {
public/control-center/pages/workflows.js:509:    `Workflow: ${workflow.title}`,
public/control-center/pages/workflows.js:510:    `Purpose: ${workflow.purpose}`,
public/control-center/pages/workflows.js:512:    `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
public/control-center/pages/workflows.js:522:function buildFallbackOutput(workflow, inputs, context) {
public/control-center/pages/workflows.js:525:  const blockedRequirements = getBlockedRequirements(workflow, inputs, context);
public/control-center/pages/workflows.js:528:    title: `${workflow.title} execution package`,
public/control-center/pages/workflows.js:529:    summary: `Prepared ${workflow.title.toLowerCase()} for ${inputs.project || context.projectName || "the current project"} with ${inputs.goal || "a defined goal"}.`,
public/control-center/pages/workflows.js:532:      `Open ${titleCase(workflow.routeHint)} for execution handoff.`,
public/control-center/pages/workflows.js:533:      blockedRequirements.length ? "Resolve blockers before live execution." : "Proceed to execution handoff."
public/control-center/pages/workflows.js:536:    requiredInputs: workflow.requiredInputs.map(titleCase),
public/control-center/pages/workflows.js:539:        label: `Open ${titleCase(workflow.routeHint)}`,
public/control-center/pages/workflows.js:540:        route: workflow.routeHint,
public/control-center/pages/workflows.js:541:        reason: `Continue execution in ${titleCase(workflow.routeHint)}.`
public/control-center/pages/workflows.js:544:        label: "Open AI Workspace",
public/control-center/pages/workflows.js:545:        route: "ai-command",
public/control-center/pages/workflows.js:546:        reason: "Refine this workflow package with AI reasoning."
public/control-center/pages/workflows.js:555:  if (target === "publishing") return "prepare-publishing-package";
public/control-center/pages/workflows.js:557:  if (target === "media-studio") return "build-media-job";
public/control-center/pages/workflows.js:558:  if (target === "setup" || target === "campaign-studio") return "launch-campaign";
public/control-center/pages/workflows.js:567:      workflowId: mapped.id,
public/control-center/pages/workflows.js:570:      chips: ["Launch readiness", "Automation", "Campaign"],
public/control-center/pages/workflows.js:571:      prompt: firstNonEmpty(globalAction?.draftPayload?.prompt, `Build a ${mapped.title.toLowerCase()} execution plan from current system blockers and dependencies.`)
public/control-center/pages/workflows.js:577:      workflowId: "fix-integrations",
public/control-center/pages/workflows.js:579:      reason: `${context.missingIntegrations.length} integration gap${context.missingIntegrations.length === 1 ? "" : "s"} can block automation and report quality.`,
public/control-center/pages/workflows.js:581:      prompt: "Build a prioritized integration recovery workflow with dependency order and expected readiness impact."
public/control-center/pages/workflows.js:587:      workflowId: "prepare-publishing-package",
public/control-center/pages/workflows.js:588:      title: "Prepare publishing package before distribution",
public/control-center/pages/workflows.js:589:      reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
public/control-center/pages/workflows.js:590:      chips: ["Publishing", "Campaign", "Launch readiness"],
public/control-center/pages/workflows.js:591:      prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
public/control-center/pages/workflows.js:595:  if (!context.campaignName) {
public/control-center/pages/workflows.js:597:      workflowId: "launch-campaign",
public/control-center/pages/workflows.js:598:      title: "Define launch campaign workflow",
public/control-center/pages/workflows.js:599:      reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",
public/control-center/pages/workflows.js:600:      chips: ["Campaign", "Launch readiness", "Automation"],
public/control-center/pages/workflows.js:601:      prompt: "Create a launch campaign workflow with owner sequence and execution gates."
public/control-center/pages/workflows.js:607:    workflowId: selected.id,
public/control-center/pages/workflows.js:609:    reason: "Current context is sufficient to run the selected execution workflow now.",
public/control-center/pages/workflows.js:610:    chips: ["Content", "Campaign", "Publishing"],
public/control-center/pages/workflows.js:611:    prompt: `Refine ${selected.title.toLowerCase()} for immediate execution with explicit dependencies and next actions.`
public/control-center/pages/workflows.js:625:        <article class="wfexec-stat"><span>Total workflows</span><strong>${escapeHtml(String(metrics.total))}</strong></article>
public/control-center/pages/workflows.js:626:        <article class="wfexec-stat"><span>Ready workflows</span><strong>${escapeHtml(String(metrics.ready))}</strong></article>
public/control-center/pages/workflows.js:627:        <article class="wfexec-stat"><span>Draft workflows</span><strong>${escapeHtml(String(metrics.draft))}</strong></article>
public/control-center/pages/workflows.js:628:        <article class="wfexec-stat"><span>Failed / blocked</span><strong>${escapeHtml(String(metrics.failed))}</strong></article>
public/control-center/pages/workflows.js:629:        <article class="wfexec-stat wfexec-stat-wide"><span>Last execution</span><strong>${escapeHtml(metrics.lastExecutionAt ? formatDateTime(metrics.lastExecutionAt) : "No execution yet")}</strong></article>
public/control-center/pages/workflows.js:646:        <button id="wfexecSendRecommendedAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI Workspace</button>
public/control-center/pages/workflows.js:663:  const gate = asObject(autoMode?.approvalRequiredStep);
public/control-center/pages/workflows.js:669:        Safe execution only: navigate, create draft, generate prompt, and create handoff.
public/control-center/pages/workflows.js:694:          : `<div class="wfexec-empty">No safe automation steps are available.</div>`
public/control-center/pages/workflows.js:698:        <button id="workflowRunFullAutomationBtn" class="wfexec-btn wfexec-btn-primary" type="button">
public/control-center/pages/workflows.js:701:        <button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:706:      <div id="workflowAutomationProgress" class="wfexec-meta">
public/control-center/pages/workflows.js:707:        ${esc(workflowAutomationState.progress || "")}
public/control-center/pages/workflows.js:710:      <div id="workflowAutomationResult" class="wfexec-meta">
public/control-center/pages/workflows.js:711:        ${esc(workflowAutomationState.result || "")}
public/control-center/pages/workflows.js:719:        Hands-free safe execution with approval gates and inline logs.
public/control-center/pages/workflows.js:723:        <button id="workflowAutoStartBtn" class="wfexec-btn wfexec-btn-primary" type="button">
public/control-center/pages/workflows.js:726:        <button id="workflowAutoPauseBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:729:        <button id="workflowAutoResumeBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:732:        <button id="workflowAutoStopBtn" class="wfexec-btn wfexec-btn-ghost" type="button">
public/control-center/pages/workflows.js:748:        autoMode?.status === "waiting_approval"
public/control-center/pages/workflows.js:751:              <strong>Approval needed:</strong> ${esc(gate.reason || "Manual approval required.")}
public/control-center/pages/workflows.js:757:              <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:760:              <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
public/control-center/pages/workflows.js:780:function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
public/control-center/pages/workflows.js:788:            ${WORKFLOW_CATALOG.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === workflow.id ? " selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
public/control-center/pages/workflows.js:796:          <label class="wfexec-label" for="wfexecInputCampaign">Campaign</label>
public/control-center/pages/workflows.js:797:          <input id="wfexecInputCampaign" class="wfexec-input" data-wf-input="campaign" type="text" value="${escapeHtml(inputs.campaign || "")}" placeholder="Campaign name">
public/control-center/pages/workflows.js:814:        <button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Workflow Package</button>
public/control-center/pages/workflows.js:815:        <button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>
public/control-center/pages/workflows.js:817:        <button id="wfexecLoadAiStateBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Load AI Command State</button>
public/control-center/pages/workflows.js:820:      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
public/control-center/pages/workflows.js:830:        ${WORKFLOW_CATALOG.map((workflow) => {
public/control-center/pages/workflows.js:831:          const inputs = asObject(session.inputsByWorkflow[workflow.id]);
public/control-center/pages/workflows.js:832:          const run = asObject(session.runsByWorkflow[workflow.id]);
public/control-center/pages/workflows.js:833:          const blocked = getBlockedRequirements(workflow, inputs, context);
public/control-center/pages/workflows.js:836:            <article class="wfexec-catalog-card${workflow.id === session.selectedWorkflowId ? " is-active" : ""}">
public/control-center/pages/workflows.js:838:                <h4>${escapeHtml(workflow.title)}</h4>
public/control-center/pages/workflows.js:841:              <p>${escapeHtml(workflow.purpose)}</p>
public/control-center/pages/workflows.js:842:              <div class="wfexec-required"><strong>Required inputs:</strong> ${escapeHtml(workflow.requiredInputs.map(titleCase).join(", "))}</div>
public/control-center/pages/workflows.js:843:              <div class="wfexec-required"><strong>Readiness status:</strong> ${escapeHtml(ready ? "Ready to run" : blocked[0])}</div>
public/control-center/pages/workflows.js:845:                <button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>
public/control-center/pages/workflows.js:846:                <button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>
public/control-center/pages/workflows.js:847:                <button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>
public/control-center/pages/workflows.js:849:              ${run.lastRunAt ? `<div class="wfexec-catalog-meta">Last run ${escapeHtml(formatDateTime(run.lastRunAt))}</div>` : ""}
public/control-center/pages/workflows.js:858:function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
public/control-center/pages/workflows.js:859:  const output = asObject(run.output);
public/control-center/pages/workflows.js:864:        <div class="wfexec-empty">No prepared package yet. Prepare a workflow package to generate a review-ready output.</div>
public/control-center/pages/workflows.js:873:        <span class="wfexec-meta">${escapeHtml(run.lastRunAt ? formatDateTime(run.lastRunAt) : "recent")}</span>
public/control-center/pages/workflows.js:889:        <button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Refine in AI Command</button>
public/control-center/pages/workflows.js:890:        <button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>
public/control-center/pages/workflows.js:891:        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Handoff</button>
public/control-center/pages/workflows.js:892:        <button id="workflowBuildCustomBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Build Custom Workflow</button>
public/control-center/pages/workflows.js:893:        <button id="workflowRecommendBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Recommend Workflow</button>
public/control-center/pages/workflows.js:895:      <div class="wfexec-meta">Workflow: ${escapeHtml(workflow.title)} · Status: ${escapeHtml(titleCase(normalizeRunStatus(run.status)))}</div>
public/control-center/pages/workflows.js:904:  automationPlan,
public/control-center/pages/workflows.js:907:  workflow,
public/control-center/pages/workflows.js:909:  run,
public/control-center/pages/workflows.js:919:          ${renderAutomationSection(automationPlan, autoFixPlan, escapeHtml)}
public/control-center/pages/workflows.js:920:          ${renderBuilderSection(session, workflow, inputs, session.validationMessage, session.draftStatus, escapeHtml)}
public/control-center/pages/workflows.js:924:          ${renderExecutionSection(run, workflow, blockedRequirements, escapeHtml)}
public/control-center/pages/workflows.js:932:  const handoff = getSharedHandoff(projectName, "workflows", operations);
public/control-center/pages/workflows.js:933:  const handoffId = asString(handoff?.id);
public/control-center/pages/workflows.js:934:  if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;
public/control-center/pages/workflows.js:936:  const payload = asObject(handoff?.payload);
public/control-center/pages/workflows.js:937:  const fromWorkflowId = asString(payload.workflow_id);
public/control-center/pages/workflows.js:939:  const modeMapped = WORKFLOW_CATALOG.find((item) => item.aiModeId === modeId)?.id;
public/control-center/pages/workflows.js:940:  const workflowId = getWorkflowDef(fromWorkflowId || modeMapped || session.selectedWorkflowId).id;
public/control-center/pages/workflows.js:942:  session.selectedWorkflowId = workflowId;
public/control-center/pages/workflows.js:943:  session.inputsByWorkflow[workflowId] = {
public/control-center/pages/workflows.js:944:    ...session.inputsByWorkflow[workflowId],
public/control-center/pages/workflows.js:945:    project: firstNonEmpty(payload?.draft_context?.projectName, session.inputsByWorkflow[workflowId].project),
public/control-center/pages/workflows.js:946:    campaign: firstNonEmpty(payload?.campaign_name, session.inputsByWorkflow[workflowId].campaign),
public/control-center/pages/workflows.js:947:    goal: firstNonEmpty(payload?.draft_context?.lastResponseTitle, payload?.workflow_title, session.inputsByWorkflow[workflowId].goal),
public/control-center/pages/workflows.js:948:    product: firstNonEmpty(payload?.output?.product, session.inputsByWorkflow[workflowId].product),
public/control-center/pages/workflows.js:949:    channel: firstNonEmpty(payload?.output?.channel, session.inputsByWorkflow[workflowId].channel)
public/control-center/pages/workflows.js:953:    const run = session.runsByWorkflow[workflowId];
public/control-center/pages/workflows.js:954:    run.output = asObject(payload.output);
public/control-center/pages/workflows.js:955:    run.status = "completed";
public/control-center/pages/workflows.js:956:    run.lastRunAt = nowIso();
public/control-center/pages/workflows.js:957:    run.source = "handoff";
public/control-center/pages/workflows.js:958:    run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output: run.output });
public/control-center/pages/workflows.js:959:    run.history = run.history.slice(0, 8);
public/control-center/pages/workflows.js:962:  session.lastAppliedHandoffId = handoffId;
public/control-center/pages/workflows.js:963:  consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
public/control-center/pages/workflows.js:964:    console.warn("Failed to consume workflow handoff:", error.message);
public/control-center/pages/workflows.js:966:  showMessage?.("Workflow context restored from shared handoff.");
public/control-center/pages/workflows.js:979:    session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to run workflows." };
public/control-center/pages/workflows.js:1003:        if (needsDashboard) await reloadProjectData(projectName);
public/control-center/pages/workflows.js:1004:        const [insightsResult, learningResult] = await Promise.allSettled([
public/control-center/pages/workflows.js:1016:            ? (insightsResult.reason?.message || learningResult.reason?.message || "Failed to load workflow intelligence")
public/control-center/pages/workflows.js:1026:          error: error.message || "Failed to load workflow intelligence",
public/control-center/pages/workflows.js:1039:function buildAiHandoffPrompt(workflow, inputs, runOutput, context) {
public/control-center/pages/workflows.js:1040:  if (runOutput?.summary) {
public/control-center/pages/workflows.js:1042:      `Refine the ${workflow.title.toLowerCase()} execution package.`,
public/control-center/pages/workflows.js:1044:      `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
public/control-center/pages/workflows.js:1045:      `Summary: ${runOutput.summary}`,
public/control-center/pages/workflows.js:1046:      `Next actions: ${asArray(runOutput.nextActions).join("; ")}`
public/control-center/pages/workflows.js:1050:    `Build a ${workflow.title.toLowerCase()} execution package.`,
public/control-center/pages/workflows.js:1052:    `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
public/control-center/pages/workflows.js:1063:  workflow,
public/control-center/pages/workflows.js:1065:  run,
public/control-center/pages/workflows.js:1072:  const prompt = buildAiHandoffPrompt(workflow, inputs, run.output, context);
public/control-center/pages/workflows.js:1073:  const aiDraft = {
public/control-center/pages/workflows.js:1075:    modeId: workflow.aiModeId,
public/control-center/pages/workflows.js:1077:    lastResponseTitle: asString(run.output?.title || workflow.title),
public/control-center/pages/workflows.js:1078:    routeSuggestions: asArray(run.output?.routeSuggestions)
public/control-center/pages/workflows.js:1081:  setSharedAiDraft(projectName, aiDraft);
public/control-center/pages/workflows.js:1083:  const handoff = {
public/control-center/pages/workflows.js:1084:    source_page: "workflows",
public/control-center/pages/workflows.js:1085:    destination_page: "ai-command",
public/control-center/pages/workflows.js:1088:      workflow_id: workflow.id,
public/control-center/pages/workflows.js:1089:      workflow_title: workflow.title,
public/control-center/pages/workflows.js:1090:      draft_context: aiDraft,
public/control-center/pages/workflows.js:1091:      output: asObject(run.output)
public/control-center/pages/workflows.js:1093:    status: "available"
public/control-center/pages/workflows.js:1096:  setSharedHandoff(projectName, "ai-command", handoff);
public/control-center/pages/workflows.js:1099:    createProjectHandoff(projectName, handoff).catch((error) => {
public/control-center/pages/workflows.js:1100:      console.warn("Failed to persist workflow-to-ai handoff:", error.message);
public/control-center/pages/workflows.js:1104:  navigateTo("ai-command");
public/control-center/pages/workflows.js:1105:  showMessage?.(allowPersistent ? "Workflow context sent to AI Command." : "Workflow context sent locally to AI Command.");
public/control-center/pages/workflows.js:1108:function validateWorkflowInputs(workflow, inputs) {
public/control-center/pages/workflows.js:1109:  const missing = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
public/control-center/pages/workflows.js:1116:  if (workflowBridgeRegistered || typeof window === "undefined") return;
public/control-center/pages/workflows.js:1118:  window.addEventListener("mh:submit-workflow", async (event) => {
public/control-center/pages/workflows.js:1121:    const detail = asObject(event?.detail);
public/control-center/pages/workflows.js:1122:    const message = asString(detail.message);
public/control-center/pages/workflows.js:1123:    const meta = asObject(detail.meta);
public/control-center/pages/workflows.js:1130:      runProjectWorkflow,
public/control-center/pages/workflows.js:1131:      runProjectAiWorkflow,
public/control-center/pages/workflows.js:1140:    const workflow = WORKFLOW_CATALOG.find((item) => item.aiModeId === asString(meta.modeId)) || WORKFLOW_CATALOG[0];
public/control-center/pages/workflows.js:1142:    session.selectedWorkflowId = workflow.id;
public/control-center/pages/workflows.js:1143:    session.inputsByWorkflow[workflow.id] = {
public/control-center/pages/workflows.js:1144:      ...session.inputsByWorkflow[workflow.id],
public/control-center/pages/workflows.js:1145:      project: firstNonEmpty(projectName, session.inputsByWorkflow[workflow.id].project),
public/control-center/pages/workflows.js:1146:      goal: firstNonEmpty(meta.assistantTitle, session.inputsByWorkflow[workflow.id].goal),
public/control-center/pages/workflows.js:1147:      campaign: firstNonEmpty(session.inputsByWorkflow[workflow.id].campaign, state.context.activeCampaign),
public/control-center/pages/workflows.js:1148:      product: firstNonEmpty(session.inputsByWorkflow[workflow.id].product, state.context.currentProject)
public/control-center/pages/workflows.js:1152:      session.draftStatus = "AI prompt imported into workflow builder";
public/control-center/pages/workflows.js:1157:    const run = session.runsByWorkflow[workflow.id];
public/control-center/pages/workflows.js:1158:    run.status = "running";
public/control-center/pages/workflows.js:1162:      await ensureWorkflowIntelligenceLoaded({
public/control-center/pages/workflows.js:1173:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
public/control-center/pages/workflows.js:1174:        title: workflow.title,
public/control-center/pages/workflows.js:1176:        source: meta.source || "external-trigger",
public/control-center/pages/workflows.js:1177:        inputs: session.inputsByWorkflow[workflow.id],
public/control-center/pages/workflows.js:1178:        prompt: firstNonEmpty(message, buildWorkflowPrompt(workflow, session.inputsByWorkflow[workflow.id], contextModel)),
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
public/control-center/pages/workflows.js:1193:      await reloadProjectData?.(projectName);
public/control-center/pages/workflows.js:1194:      showMessage?.(`${workflow.title} created from AI context.`);
public/control-center/pages/workflows.js:1196:      run.status = "failed";
public/control-center/pages/workflows.js:1197:      showError?.(error.message || "Workflow execution failed.");
public/control-center/pages/workflows.js:1203:  workflowBridgeRegistered = true;
public/control-center/pages/workflows.js:1215:  runProjectWorkflow,
public/control-center/pages/workflows.js:1216:  runProjectAiWorkflow,
public/control-center/pages/workflows.js:1221:  if (workflowAutomationEnabled) {
public/control-center/pages/workflows.js:1223:    if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
public/control-center/pages/workflows.js:1224:    workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
public/control-center/pages/workflows.js:1232:  const workflow = getWorkflowDef(session.selectedWorkflowId);
public/control-center/pages/workflows.js:1233:  const inputs = asObject(session.inputsByWorkflow[workflow.id]);
public/control-center/pages/workflows.js:1234:  const run = session.runsByWorkflow[workflow.id];
public/control-center/pages/workflows.js:1236:  const aiDraft = asObject(getSharedAiDraft(projectName, state.data.operations));
public/control-center/pages/workflows.js:1237:  const hasDirectAiState = Boolean(aiDraft.lastCommand || aiDraft.lastResponseTitle || aiDraft.modeId);
public/control-center/pages/workflows.js:1261:  const workflowTypeSelect = $("wfexecWorkflowType");
public/control-center/pages/workflows.js:1262:  if (workflowTypeSelect) {
public/control-center/pages/workflows.js:1263:    workflowTypeSelect.onchange = () => {
public/control-center/pages/workflows.js:1264:      session.selectedWorkflowId = workflowTypeSelect.value || session.selectedWorkflowId;
public/control-center/pages/workflows.js:1297:        const safePrompt = `Create a workflow for ${projectName || "this project"} focused on ${inputs.goal || "operational improvement"}.`;
public/control-center/pages/workflows.js:1298:        setSharedHandoff(projectName, "workflows", {
public/control-center/pages/workflows.js:1299:          source_page: "workflows",
public/control-center/pages/workflows.js:1300:          destination_page: "workflows",
public/control-center/pages/workflows.js:1305:              modeId: workflow.aiModeId,
public/control-center/pages/workflows.js:1310:          status: "available"
public/control-center/pages/workflows.js:1313:        persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "Local handoff seed created", true);
public/control-center/pages/workflows.js:1314:        showMessage?.("No AI state found. Local workflow seed created safely.");
public/control-center/pages/workflows.js:1323:        campaign: firstNonEmpty(session.inputsByWorkflow[session.selectedWorkflowId].campaign, state.context.activeCampaign),
public/control-center/pages/workflows.js:1327:      persistWorkflowDraft(projectName, session, session.selectedWorkflowId, "AI state loaded", true);
public/control-center/pages/workflows.js:1328:      showMessage?.("AI Command state loaded into workflow inputs.");
public/control-center/pages/workflows.js:1333:function confirmWorkflowBackendRun(workflow) {
public/control-center/pages/workflows.js:1334:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
public/control-center/pages/workflows.js:1335:  const title = workflow?.title || "this workflow";
public/control-center/pages/workflows.js:1336:  return window.confirm(
public/control-center/pages/workflows.js:1337:    `Confirm workflow preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It does not publish, send messages, create CRM records, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
public/control-center/pages/workflows.js:1341:  async function runWorkflow(workflowId) {
public/control-center/pages/workflows.js:1342:    const activeWorkflow = getWorkflowDef(workflowId || session.selectedWorkflowId);
public/control-center/pages/workflows.js:1356:      setValidation("Select a project before running a workflow.");
public/control-center/pages/workflows.js:1360:    const confirmed = confirmWorkflowBackendRun(activeWorkflow);
public/control-center/pages/workflows.js:1361:    if (!confirmed) {
public/control-center/pages/workflows.js:1362:      setValidation("Workflow preparation cancelled. No backend workflow run was recorded.");
public/control-center/pages/workflows.js:1367:    const activeRun = session.runsByWorkflow[activeWorkflow.id];
public/control-center/pages/workflows.js:1368:    activeRun.status = "running";
public/control-center/pages/workflows.js:1369:    activeRun.source = "manual-run";
public/control-center/pages/workflows.js:1373:      await ensureWorkflowIntelligenceLoaded({
public/control-center/pages/workflows.js:1385:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, activeWorkflow.id, {
public/control-center/pages/workflows.js:1388:        source: "manual-run",
public/control-center/pages/workflows.js:1394:          source: "workflow-manual-run"
public/control-center/pages/workflows.js:1398:      const output = asObject(result?.output || result?.run?.output);
public/control-center/pages/workflows.js:1404:      activeRun.lastRunAt = asString(result?.run?.created_at) || createdAt;
public/control-center/pages/workflows.js:1405:      activeRun.runId = asString(result?.run?.id);
public/control-center/pages/workflows.js:1408:      activeRun.history.unshift({ createdAt: activeRun.lastRunAt, source: "manual-run", output: safeOutput });
public/control-center/pages/workflows.js:1411:      setSharedHandoff(projectName, "workflows", {
public/control-center/pages/workflows.js:1412:        source_page: "workflows",
public/control-center/pages/workflows.js:1413:        destination_page: "workflows",
public/control-center/pages/workflows.js:1415:          workflow_id: activeWorkflow.id,
public/control-center/pages/workflows.js:1416:          run_id: activeRun.runId,
public/control-center/pages/workflows.js:1421:        status: "available"
public/control-center/pages/workflows.js:1424:      await reloadProjectData?.(projectName);
public/control-center/pages/workflows.js:1427:      activeRun.status = "failed";
public/control-center/pages/workflows.js:1429:        title: `${activeWorkflow.title} failed`,
public/control-center/pages/workflows.js:1430:        summary: error.message || "Workflow execution failed.",
public/control-center/pages/workflows.js:1431:        blockedRequirements: ["Execution failed. Review inputs and retry."],
public/control-center/pages/workflows.js:1432:        nextActions: ["Retry workflow", "Validate project integrations", "Check workflow dependencies"]
public/control-center/pages/workflows.js:1435:      showError?.(error.message || "Workflow execution failed.");
public/control-center/pages/workflows.js:1441:  const runBtn = $("workflowRunBtn");
public/control-center/pages/workflows.js:1442:  if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);
public/control-center/pages/workflows.js:1443:  const runBtnMain = $("workflowRunBtnMain");
public/control-center/pages/workflows.js:1444:  if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);
public/control-center/pages/workflows.js:1446:  const startRecommendedBtn = $("wfexecStartRecommendedBtn");
public/control-center/pages/workflows.js:1447:  if (startRecommendedBtn) {
public/control-center/pages/workflows.js:1448:    startRecommendedBtn.onclick = () => {
public/control-center/pages/workflows.js:1450:      runWorkflow(rec.workflowId);
public/control-center/pages/workflows.js:1458:      session.selectedWorkflowId = rec.workflowId;
public/control-center/pages/workflows.js:1459:      session.inputsByWorkflow[rec.workflowId].goal = firstNonEmpty(session.inputsByWorkflow[rec.workflowId].goal, rec.title);
public/control-center/pages/workflows.js:1460:      persistWorkflowDraft(projectName, session, rec.workflowId, "Recommendation saved as draft", true);
public/control-center/pages/workflows.js:1461:      showMessage?.("Recommended workflow saved as draft.");
public/control-center/pages/workflows.js:1470:      const recWorkflow = getWorkflowDef(rec.workflowId);
public/control-center/pages/workflows.js:1474:        workflow: recWorkflow,
public/control-center/pages/workflows.js:1476:        run: session.runsByWorkflow[recWorkflow.id],
public/control-center/pages/workflows.js:1486:  Array.from(document.querySelectorAll("[data-wf-catalog-run]")).forEach((button) => {
public/control-center/pages/workflows.js:1487:    button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") || session.selectedWorkflowId);
public/control-center/pages/workflows.js:1492:      const workflowId = button.getAttribute("data-wf-catalog-save") || session.selectedWorkflowId;
public/control-center/pages/workflows.js:1493:      session.selectedWorkflowId = workflowId;
public/control-center/pages/workflows.js:1494:      persistWorkflowDraft(projectName, session, workflowId, "Draft saved", true);
public/control-center/pages/workflows.js:1500:  Array.from(document.querySelectorAll("[data-wf-catalog-ai]")).forEach((button) => {
public/control-center/pages/workflows.js:1502:      const workflowId = button.getAttribute("data-wf-catalog-ai") || session.selectedWorkflowId;
public/control-center/pages/workflows.js:1503:      const wf = getWorkflowDef(workflowId);
public/control-center/pages/workflows.js:1504:      session.selectedWorkflowId = workflowId;
public/control-center/pages/workflows.js:1507:        workflow: wf,
public/control-center/pages/workflows.js:1508:        inputs: asObject(session.inputsByWorkflow[workflowId]),
public/control-center/pages/workflows.js:1509:        run: session.runsByWorkflow[workflowId],
public/control-center/pages/workflows.js:1519:  const pushAiBtn = $("workflowPushAiBtn");
public/control-center/pages/workflows.js:1524:        workflow,
public/control-center/pages/workflows.js:1526:        run,
public/control-center/pages/workflows.js:1536:  const pushAiSecondaryBtn = $("workflowPushAiBtnSecondary");
public/control-center/pages/workflows.js:1539:  const saveTaskBtn = $("workflowSaveTaskBtn");
public/control-center/pages/workflows.js:1542:      if (!run.output) {
public/control-center/pages/workflows.js:1543:        showError?.("Prepare the workflow package before creating a task handoff.");
public/control-center/pages/workflows.js:1547:      const handoff = {
public/control-center/pages/workflows.js:1548:        source_page: "workflows",
public/control-center/pages/workflows.js:1549:        destination_page: "task-center",
public/control-center/pages/workflows.js:1550:        title: `${workflow.title} • ${inputs.campaign || inputs.project || projectName || "Project"}`,
public/control-center/pages/workflows.js:1551:        summary: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1552:        description: asString(run.output.summary || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:1554:          workflow_id: workflow.id,
public/control-center/pages/workflows.js:1555:          workflow_title: workflow.title,
public/control-center/pages/workflows.js:1556:          source_type: "workflow_run",
public/control-center/pages/workflows.js:1557:          source_id: run.runId || run.lastRunAt || "",
public/control-center/pages/workflows.js:1560:          service_domain: workflow.id === "generate-report" || workflow.id === "research-competitors" ? "research" : "campaign",
public/control-center/pages/workflows.js:1561:          route_target: "workflows",
public/control-center/pages/workflows.js:1562:          output: asObject(run.output),
public/control-center/pages/workflows.js:1563:          notes: asArray(run.output.nextActions || []),
public/control-center/pages/workflows.js:1569:      setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:1570:      showMessage?.("Task handoff prepared for review in Task Center.");
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:1575:  const recommendBtn = $("workflowRecommendBtn");
public/control-center/pages/workflows.js:1580:        "Recommend the best workflow to run next.",
public/control-center/pages/workflows.js:1593:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/workflows.js:1594:        source_page: "workflows",
public/control-center/pages/workflows.js:1595:        destination_page: "ai-command",
public/control-center/pages/workflows.js:1605:        status: "available"
public/control-center/pages/workflows.js:1607:      navigateTo("ai-command");
public/control-center/pages/workflows.js:1611:  const customBtn = $("workflowBuildCustomBtn");
public/control-center/pages/workflows.js:1615:        "Build a custom workflow blueprint.",
public/control-center/pages/workflows.js:1617:        `Campaign: ${inputs.campaign || "not set"}`,
public/control-center/pages/workflows.js:1627:        lastResponseTitle: "Custom workflow builder"
public/control-center/pages/workflows.js:1629:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/workflows.js:1630:        source_page: "workflows",
public/control-center/pages/workflows.js:1631:        destination_page: "ai-command",
public/control-center/pages/workflows.js:1638:            lastResponseTitle: "Custom workflow builder"
public/control-center/pages/workflows.js:1641:        status: "available"
public/control-center/pages/workflows.js:1643:      navigateTo("ai-command");
public/control-center/pages/workflows.js:1647:  const fullAutomationBtn = $("workflowRunFullAutomationBtn");
public/control-center/pages/workflows.js:1652:        workflowAutomationState.result = "No safe automation steps available.";
public/control-center/pages/workflows.js:1656:      const confirmed = window.confirm(`Confirm automation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream task or handoff state.\n\nSelect Cancel to stop.`);
public/control-center/pages/workflows.js:1657:      if (!confirmed) return;
public/control-center/pages/workflows.js:1659:      workflowAutomationState.lastPlan = plan;
public/control-center/pages/workflows.js:1660:      workflowAutomationState.cursor = 0;
public/control-center/pages/workflows.js:1661:      workflowAutomationState.result = "";
public/control-center/pages/workflows.js:1662:      const result = await runAutomationPlan(plan, {
public/control-center/pages/workflows.js:1665:          workflowAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${stepResult.status})`;
public/control-center/pages/workflows.js:1669:      workflowAutomationState.lastResults = asArray(result.results);
public/control-center/pages/workflows.js:1670:      workflowAutomationState.result = result.status === "success" ? "Automation simulation completed." : "Automation simulation stopped before completion.";
public/control-center/pages/workflows.js:1671:      showMessage?.(workflowAutomationState.result);
public/control-center/pages/workflows.js:1676:  const stepAutomationBtn = $("workflowRunStepAutomationBtn");
public/control-center/pages/workflows.js:1681:        workflowAutomationState.result = "No safe automation steps available.";
public/control-center/pages/workflows.js:1686:      const confirmed = window.confirm("Confirm guided simulation step\n\nAction: Simulate the next guided step.\nRisk: This can prepare downstream task or handoff state.\n\nSelect Cancel to keep the current state.");
public/control-center/pages/workflows.js:1687:      if (!confirmed) return;
public/control-center/pages/workflows.js:1689:      const nextIndex = Math.min(workflowAutomationState.cursor, plan.length - 1);
public/control-center/pages/workflows.js:1691:      const stepResult = await runAutomationPlan(singleStep, {
public/control-center/pages/workflows.js:1693:        onProgress: ({ index, total, step, result: runResult }) => {
public/control-center/pages/workflows.js:1694:          workflowAutomationState.progress = `Step ${nextIndex + index} / ${plan.length}: ${step.action} (${runResult.status})`;
public/control-center/pages/workflows.js:1698:      workflowAutomationState.cursor = Math.min(nextIndex + 1, plan.length);
public/control-center/pages/workflows.js:1699:      workflowAutomationState.lastPlan = plan;
public/control-center/pages/workflows.js:1700:      workflowAutomationState.lastResults = [...asArray(workflowAutomationState.lastResults), ...asArray(stepResult.results)];
public/control-center/pages/workflows.js:1701:      workflowAutomationState.result = workflowAutomationState.cursor >= plan.length
public/control-center/pages/workflows.js:1704:      showMessage?.(workflowAutomationState.result);
public/control-center/pages/workflows.js:1709:  const autoStartBtn = $("workflowAutoStartBtn");
public/control-center/pages/workflows.js:1713:      workflowAutomationEnabled = true;
public/control-center/pages/workflows.js:1715:      if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
public/control-center/pages/workflows.js:1716:      workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
public/control-center/pages/workflows.js:1720:      await startAutoMode(plan, {
public/control-center/pages/workflows.js:1721:        mode: "auto_until_approval",
public/control-center/pages/workflows.js:1724:      showMessage?.("Workflow Guided Mode started.");
public/control-center/pages/workflows.js:1728:  const autoPauseBtn = $("workflowAutoPauseBtn");
public/control-center/pages/workflows.js:1736:  const autoResumeBtn = $("workflowAutoResumeBtn");
public/control-center/pages/workflows.js:1739:      await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1744:  const autoStopBtn = $("workflowAutoStopBtn");
public/control-center/pages/workflows.js:1752:  const autoApproveBtn = $("workflowAutoApproveBtn");
public/control-center/pages/workflows.js:1755:      await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1760:  const autoSkipBtn = $("workflowAutoSkipBtn");
public/control-center/pages/workflows.js:1763:      await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1769:export const workflowsRoute = {
public/control-center/pages/workflows.js:1770:  id: "workflows",
public/control-center/pages/workflows.js:1773:    eyebrow: "AI & Build",
public/control-center/pages/workflows.js:1775:    description: "Prepare structured, repeatable workflow packages for common marketing and execution operations."
public/control-center/pages/workflows.js:1778:    <section class="page is-active" data-page="workflows">
public/control-center/pages/workflows.js:1779:      <div id="workflowsRoot"></div>
public/control-center/pages/workflows.js:1791:    const campaignName = asString(state.context.activeCampaign || "");
public/control-center/pages/workflows.js:1792:    const executionMode = asString(state.context.executionMode || "");
public/control-center/pages/workflows.js:1803:    const workflowsTotal = Number(operations.workflows?.total_runs || operations.workflows?.total || 0);
public/control-center/pages/workflows.js:1804:    const tasksTotal = Number(operations.tasks?.total || 0);
public/control-center/pages/workflows.js:1805:    const approvalsTotal = Number(operations.approvals?.total || 0);
public/control-center/pages/workflows.js:1807:    const root = $("workflowsRoot");
public/control-center/pages/workflows.js:1811:      "campaign-studio": "campaign-studio",
public/control-center/pages/workflows.js:1814:      publishing: "publishing",
public/control-center/pages/workflows.js:1822:      inputsByWorkflow: WORKFLOW_CATALOG.reduce((acc, workflow) => {
public/control-center/pages/workflows.js:1823:        acc[workflow.id] = {
public/control-center/pages/workflows.js:1825:          campaign: campaignName,
public/control-center/pages/workflows.js:1834:      lastStatusText: "Select a workflow template to start a session.",
public/control-center/pages/workflows.js:1835:      aiReviewed: false,
public/control-center/pages/workflows.js:1848:    function getMissingInputs(workflow, inputs) {
public/control-center/pages/workflows.js:1849:      return workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
public/control-center/pages/workflows.js:1852:    function buildSessionPrompt(workflow, inputs) {
public/control-center/pages/workflows.js:1854:        `Workflow: ${workflow.title}`,
public/control-center/pages/workflows.js:1855:        `Purpose: ${workflow.purpose}`,
public/control-center/pages/workflows.js:1857:        `Campaign: ${inputs.campaign || campaignName || "not set"}`,
public/control-center/pages/workflows.js:1860:        `Goal: ${inputs.goal || "Prepare an execution-ready workflow package."}`
public/control-center/pages/workflows.js:1864:    function buildStepModel(workflow, inputs) {
public/control-center/pages/workflows.js:1865:      const missing = getMissingInputs(workflow, inputs);
public/control-center/pages/workflows.js:1866:      const hasPrepared = Boolean(stateModel.preparedPackage && stateModel.preparedPackage.workflowId === workflow.id);
public/control-center/pages/workflows.js:1867:      const hasTracking = workflowsTotal > 0 || hasPrepared;
public/control-center/pages/workflows.js:1873:          copy: workflow.title
public/control-center/pages/workflows.js:1883:          copy: hasPrepared ? "Prepared" : "Waiting"
public/control-center/pages/workflows.js:1886:          title: "Review with AI",
public/control-center/pages/workflows.js:1887:          status: stateModel.aiReviewed ? "complete" : hasPrepared ? "active" : "pending",
public/control-center/pages/workflows.js:1888:          copy: stateModel.aiReviewed ? "Reviewed" : "Pending"
public/control-center/pages/workflows.js:1903:          copy: hasTracking ? `${workflowsTotal} tracked` : "Pending"
public/control-center/pages/workflows.js:1916:      const workflow = getSelectedWorkflow();
public/control-center/pages/workflows.js:1917:      const inputs = asObject(stateModel.inputsByWorkflow[workflow.id]);
public/control-center/pages/workflows.js:1918:      const missing = getMissingInputs(workflow, inputs);
public/control-center/pages/workflows.js:1919:      const destinationRoute = destinationRouteByHint[workflow.routeHint] || "workflows";
public/control-center/pages/workflows.js:1920:      const destinationName = getDestinationLabel(workflow.routeHint);
public/control-center/pages/workflows.js:1921:      const preparedForSelected = stateModel.preparedPackage && stateModel.preparedPackage.workflowId === workflow.id
public/control-center/pages/workflows.js:1934:          ? "Review in AI Workspace."
public/control-center/pages/workflows.js:1935:          : "Prepare workflow package.";
public/control-center/pages/workflows.js:1942:      const recentSessions = asArray(operations.workflows?.items).slice(0, 4);
public/control-center/pages/workflows.js:1943:      const steps = buildStepModel(workflow, inputs);
public/control-center/pages/workflows.js:1953:                <span class="wfloop-chip is-session">Active session: ${escapeHtml(workflow.title)}</span>
public/control-center/pages/workflows.js:1959:              <span class="badge">Campaign: ${escapeHtml(campaignName || "Not selected")}</span>
public/control-center/pages/workflows.js:1960:              <span class="badge">Mode: ${escapeHtml(executionMode || "manual")}</span>
public/control-center/pages/workflows.js:1964:              <button class="btn btn-secondary" type="button" data-wf-hero-ai="1">Review Session in AI Workspace</button>
public/control-center/pages/workflows.js:1994:                    <article class="wfloop-catalog-card${item.id === workflow.id ? " is-active" : ""}">
public/control-center/pages/workflows.js:2019:                <p><strong>Current session:</strong> ${escapeHtml(workflow.title)}</p>
public/control-center/pages/workflows.js:2028:                    ${WORKFLOW_CATALOG.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === workflow.id ? " selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
public/control-center/pages/workflows.js:2036:                  <span>Campaign</span>
public/control-center/pages/workflows.js:2037:                  <input id="wfLightCampaign" class="setup-input" type="text" value="${escapeHtml(inputs.campaign || "")}" placeholder="Campaign name">
public/control-center/pages/workflows.js:2048:                  <p class="wfloop-session-value">${escapeHtml(workflow.title)} package for ${escapeHtml(destinationName)}</p>
public/control-center/pages/workflows.js:2052:                  <p class="wfloop-session-value">${escapeHtml(workflow.requiredInputs.map(titleCase).join(", "))}</p>
public/control-center/pages/workflows.js:2055:                  <p class="wfloop-session-label">Available context</p>
public/control-center/pages/workflows.js:2056:                  <p class="wfloop-session-value">${escapeHtml(workflow.requiredInputs.filter((field) => asString(inputs[field]).trim()).map(titleCase).join(", ") || "None")}</p>
public/control-center/pages/workflows.js:2066:                <button id="wfLightAiBtn" class="btn btn-secondary" type="button">Review in AI Workspace</button>
public/control-center/pages/workflows.js:2067:                <button id="wfLightCampaignBtn" class="btn btn-ghost" type="button">Open Campaign Studio</button>
public/control-center/pages/workflows.js:2081:                <p class="wfloop-preview-meta">${escapeHtml(preparedForSelected ? `Prepared ${formatDateTime(preparedForSelected.createdAt)} · ${workflow.title} session package` : "Prepare to generate a compact session package preview.")}</p>
public/control-center/pages/workflows.js:2082:                <pre>${escapeHtml(preparedForSelected?.prompt || "Package will include workflow, purpose, project, campaign, product, channel, and goal context.")}</pre>
public/control-center/pages/workflows.js:2085:              <details class="wfloop-tech-details">
public/control-center/pages/workflows.js:2086:                <summary>Technical details</summary>
public/control-center/pages/workflows.js:2088:                <p>Existing runtime execution helpers are preserved in file scope and not activated by this active render surface.</p>
public/control-center/pages/workflows.js:2089:              </details>
public/control-center/pages/workflows.js:2093:              <section class="mhos-ai-guidance">
public/control-center/pages/workflows.js:2094:                <h3 class="mhos-ai-guidance-title">AI Guidance</h3>
public/control-center/pages/workflows.js:2095:                <p class="mhos-ai-guidance-copy">AI prepares structure, sequencing, and missing-context prompts for ${escapeHtml(workflow.title)}.</p>
public/control-center/pages/workflows.js:2096:                <p class="mhos-ai-guidance-reason">Remaining gaps: ${escapeHtml(missing.map(titleCase).join(", ") || "No missing inputs")}. Safest next step: ${escapeHtml(nextAction)}</p>
public/control-center/pages/workflows.js:2097:                <div class="mhos-ai-guidance-actions">
public/control-center/pages/workflows.js:2098:                  <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open AI Workspace</button>
public/control-center/pages/workflows.js:2109:                      <p class="mhos-destination-title">Review in AI Workspace</p>
public/control-center/pages/workflows.js:2110:                      <p class="mhos-destination-meta"><strong>Type</strong> AI review</p>
public/control-center/pages/workflows.js:2111:                      <p class="mhos-destination-meta"><strong>Context carried</strong> workflow package prompt, selected workflow, and input state</p>
public/control-center/pages/workflows.js:2115:                      <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open</button>
public/control-center/pages/workflows.js:2122:                      <p class="mhos-destination-meta"><strong>Type</strong> task handoff</p>
public/control-center/pages/workflows.js:2123:                      <p class="mhos-destination-meta"><strong>Context carried</strong> selected workflow session title and handoff intent</p>
public/control-center/pages/workflows.js:2127:                      <button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>
public/control-center/pages/workflows.js:2145:                      <p class="mhos-destination-title">Technical Details</p>
public/control-center/pages/workflows.js:2148:                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now · Future-gated execution authority remains in destination tools</p>
public/control-center/pages/workflows.js:2151:                      <button class="btn btn-ghost btn-sm" type="button" data-wf-tech-focus="1">Open details</button>
public/control-center/pages/workflows.js:2165:                          <strong>${escapeHtml(titleCase(item.workflow_id || "workflow"))}</strong>
public/control-center/pages/workflows.js:2167:                          <span>${escapeHtml(formatDateTime(item.created_at || item.executed_at || nowIso()))}</span>
public/control-center/pages/workflows.js:2171:                  : `<div class="empty-state">No recent workflow sessions yet. Prepare a workflow package to start continuity tracking.</div>`}
public/control-center/pages/workflows.js:2173:                  <span>Prepared ${escapeHtml(String(workflowsTotal))}</span>
public/control-center/pages/workflows.js:2174:                  <span>Tasks ${escapeHtml(String(tasksTotal))}</span>
public/control-center/pages/workflows.js:2175:                  <span>Approvals ${escapeHtml(String(approvalsTotal))}</span>
public/control-center/pages/workflows.js:2176:                  <span>Mode ${escapeHtml(executionMode || "manual")}</span>
public/control-center/pages/workflows.js:2184:      const workflowType = $("wfLightWorkflowType");
public/control-center/pages/workflows.js:2185:      if (workflowType) {
public/control-center/pages/workflows.js:2186:        workflowType.onchange = () => {
public/control-center/pages/workflows.js:2187:          stateModel.selectedWorkflowId = workflowType.value || WORKFLOW_CATALOG[0].id;
public/control-center/pages/workflows.js:2196:        ["wfLightCampaign", "campaign"],
public/control-center/pages/workflows.js:2210:          const workflowId = button.getAttribute("data-wf-select") || WORKFLOW_CATALOG[0].id;
public/control-center/pages/workflows.js:2211:          stateModel.selectedWorkflowId = workflowId;
public/control-center/pages/workflows.js:2213:          stateModel.lastStatusText = `${getWorkflowDef(workflowId).title} selected. Continue session preparation.`;
public/control-center/pages/workflows.js:2234:          workflowId: activeWorkflow.id,
public/control-center/pages/workflows.js:2239:        stateModel.lastStatusText = "Prepared package updated and mirrored in the global AI bar.";
public/control-center/pages/workflows.js:2247:        const prompt = stateModel.preparedPackage?.workflowId === activeWorkflow.id
public/control-center/pages/workflows.js:2253:          modeId: activeWorkflow.aiModeId,
public/control-center/pages/workflows.js:2259:              route: "workflows",
public/control-center/pages/workflows.js:2260:              reason: "Return to workflow session after AI review."
public/control-center/pages/workflows.js:2269:        stateModel.aiReviewed = true;
public/control-center/pages/workflows.js:2271:        stateModel.lastStatusText = "Session context sent to AI Workspace for review and refinement.";
public/control-center/pages/workflows.js:2272:        navigateTo("ai-command");
public/control-center/pages/workflows.js:2278:      Array.from(root.querySelectorAll("[data-wf-hero-ai]")).forEach((button) => {
public/control-center/pages/workflows.js:2285:      const aiBtn = $("wfLightAiBtn");
public/control-center/pages/workflows.js:2286:      if (aiBtn) aiBtn.onclick = openAiWorkspace;
public/control-center/pages/workflows.js:2288:      const campaignBtn = $("wfLightCampaignBtn");
public/control-center/pages/workflows.js:2289:      if (campaignBtn) {
public/control-center/pages/workflows.js:2290:        campaignBtn.onclick = () => {
public/control-center/pages/workflows.js:2293:          stateModel.lastStatusText = "Campaign Studio opened to continue this workflow session.";
public/control-center/pages/workflows.js:2294:          navigateTo("campaign-studio");
public/control-center/pages/workflows.js:2298:      const tasksBtn = $("wfLightTasksBtn");
public/control-center/pages/workflows.js:2299:      if (tasksBtn) {
public/control-center/pages/workflows.js:2300:        tasksBtn.onclick = () => {
public/control-center/pages/workflows.js:2301:          const handoff = {
public/control-center/pages/workflows.js:2302:            source_page: "workflows",
public/control-center/pages/workflows.js:2303:            destination_page: "task-center",
public/control-center/pages/workflows.js:2304:            title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
public/control-center/pages/workflows.js:2305:            summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2306:            description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2308:              workflow_id: asString(stateModel.selectedWorkflow?.id || ""),
public/control-center/pages/workflows.js:2309:              workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
public/control-center/pages/workflows.js:2310:              handoff_intent: "Prepare task handoff from workflow package.",
public/control-center/pages/workflows.js:2315:          setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2318:          stateModel.lastStatusText = "Task Center opened for workflow handoff and tracking.";
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/workflows.js:2325:          const route = button.getAttribute("data-wf-open") || "workflows";
public/control-center/pages/workflows.js:2326:          if (route === "task-center") {
public/control-center/pages/workflows.js:2327:            const handoff = {
public/control-center/pages/workflows.js:2328:              source_page: "workflows",
public/control-center/pages/workflows.js:2329:              destination_page: "task-center",
public/control-center/pages/workflows.js:2330:              title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
public/control-center/pages/workflows.js:2331:              summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2332:              description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from Workflows."),
public/control-center/pages/workflows.js:2334:                workflow_id: asString(stateModel.selectedWorkflow?.id || ""),
public/control-center/pages/workflows.js:2335:                workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
public/control-center/pages/workflows.js:2336:                handoff_intent: "Prepare task handoff from workflow package.",
public/control-center/pages/workflows.js:2341:            setSharedHandoff(projectName, "task-center", handoff);
public/control-center/pages/workflows.js:2344:          if (route !== "task-center") stateModel.openedDestination = true;
public/control-center/pages/workflows.js:2354:          const details = root.querySelector(".wfloop-tech-details");
public/control-center/pages/workflows.js:2355:          if (details) {
public/control-center/pages/workflows.js:2356:            details.open = true;
public/control-center/pages/workflows.js:2357:            details.scrollIntoView({ behavior: "smooth", block: "nearest" });
public/control-center/api.js:10:const AI_GUIDANCE_REQUEST_TIMEOUT_MS = 90000;
public/control-center/api.js:82:      const runtimeKeyCandidates = [
public/control-center/api.js:91:      for (const candidate of runtimeKeyCandidates) {
public/control-center/api.js:146:export function isAccessKeyFailure(error) {
public/control-center/api.js:220:    normalized === "response.text.start" ||
public/control-center/api.js:223:    normalized === "api.response.text.start" ||
public/control-center/api.js:226:    normalized === "api.response.parse.start" ||
public/control-center/api.js:241:function emitApiRuntimeTrace(stage, details = {}) {
public/control-center/api.js:252:      detail: {
public/control-center/api.js:255:        endpoint: String(details.endpoint || ""),
public/control-center/api.js:256:        method: String(details.method || "GET"),
public/control-center/api.js:257:        status: Number.isFinite(details.status) ? Number(details.status) : null,
public/control-center/api.js:258:        contentType: String(details.contentType || ""),
public/control-center/api.js:259:        message: String(details.message || ""),
public/control-center/api.js:260:        bodyLength: Number(details.bodyLength || 0),
public/control-center/api.js:261:        durationMs: Number(details.durationMs || 0),
public/control-center/api.js:262:        timeoutMs: Number(details.timeoutMs || 0)
public/control-center/api.js:306:  const startedAt = Date.now();
public/control-center/api.js:310:  emitApiRuntimeTrace("response.text.start", {
public/control-center/api.js:318:    const rawText = await Promise.race([
public/control-center/api.js:335:      durationMs: Date.now() - startedAt,
public/control-center/api.js:354:        durationMs: Date.now() - startedAt,
public/control-center/api.js:361:          const fallbackPayload = await Promise.race([
public/control-center/api.js:385:            durationMs: Date.now() - startedAt
public/control-center/api.js:403:            durationMs: Date.now() - startedAt,
public/control-center/api.js:404:            message: fallbackError?.message || "JSON fallback failed"
public/control-center/api.js:438:      durationMs: Date.now() - startedAt,
public/control-center/api.js:439:      message: error?.message || "Failed to read response body"
public/control-center/api.js:466:  emitApiRuntimeTrace("api.response.parse.start", {
public/control-center/api.js:475:  // This helps the startup UI/watchdogs update before parsing large payloads.
public/control-center/api.js:477:    await nextFrame();
public/control-center/api.js:492:  } catch (parseFailure) {
public/control-center/api.js:499:      message: parseFailure?.message || "Invalid JSON payload"
public/control-center/api.js:516:async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
public/control-center/api.js:521:  const bodyReadResult = await readResponseText(response, requestMeta);
public/control-center/api.js:535:      payload = await parseJsonTextSafely(rawText, response, requestMeta, bodyLength);
public/control-center/api.js:537:    } catch (parseFailure) {
public/control-center/api.js:539:      throw parseFailure;
public/control-center/api.js:656:  emitApiRuntimeTrace("request.start", {
public/control-center/api.js:668:    const response = await Promise.race([requestPromise, timeoutPromise]);
public/control-center/api.js:694:      message: error?.message || "Request failed"
public/control-center/api.js:707:  const response = await fetchWithTimeout(path, {
public/control-center/api.js:725:  const response = await fetchWithTimeout(path, {
public/control-center/api.js:731:  const rawText = await response.text();
public/control-center/api.js:741:        status: response.ok ? "failed" : "error",
public/control-center/api.js:752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
public/control-center/api.js:765:  const response = await fetchWithTimeout(path, {
public/control-center/api.js:790:  const response = await fetchWithTimeout(path, {
public/control-center/api.js:821:  const response = await fetchWithTimeout(normalizedPath, {
public/control-center/api.js:827:    const rawText = await response.text().catch(() => "");
public/control-center/api.js:836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
public/control-center/api.js:855:    blob: await response.blob(),
public/control-center/api.js:913:      scheduled_jobs: [],
public/control-center/api.js:914:      execution_results: [],
public/control-center/api.js:1007:    const err = new Error(`Failed to load ${section}: ${panelError}`);
public/control-center/api.js:1023:  const response = await fetch("/media-manager/projects", {
public/control-center/api.js:1035:    data = await response.json();
public/control-center/api.js:1039:    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
public/control-center/api.js:1049:    const payload = await getJson(
public/control-center/api.js:1051:      "Failed to load projects",
public/control-center/api.js:1079:    `/media-manager/project/${encodedProjectName}/startup`,
public/control-center/api.js:1080:    "Failed to load project startup dashboard",
public/control-center/api.js:1102:  const requiredResults = await Promise.allSettled(
public/control-center/api.js:1129:        const fallbackProjects = await fetchProjects();
public/control-center/api.js:1141:          warning: projectExists ? "Project details are still syncing." : "Project not found in projects index."
public/control-center/api.js:1149:          warning: "Project details are still syncing.",
public/control-center/api.js:1150:          message: String(fallbackError?.message || "Failed to verify project fallback")
public/control-center/api.js:1158:    const error = new Error(`Required project data failed: ${message}`);
public/control-center/api.js:1191:  const requiredDashboardPayload = await requiredDashboardPromise;
public/control-center/api.js:1331:    "Failed to load asset catalog"
public/control-center/api.js:1342:    "Failed to load project insights"
public/control-center/api.js:1353:    "Failed to load project learning"
public/control-center/api.js:1364:    "Failed to load project operations",
public/control-center/api.js:1374:  const response = await fetch(`/media-manager/project/${encodedProjectName}/apply-template`, {
public/control-center/api.js:1388:    data = await response.json();
public/control-center/api.js:1392:    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
public/control-center/api.js:1409:    "Failed to save project setup"
public/control-center/api.js:1422:    "Failed to refresh project library"
public/control-center/api.js:1442:    "Failed to update asset status"
public/control-center/api.js:1464:    "Failed to rename asset"
public/control-center/api.js:1481:    "Failed to update source of truth"
public/control-center/api.js:1498:    "Failed to archive asset"
public/control-center/api.js:1515:    "Failed to delete asset"
public/control-center/api.js:1519:export async function runProjectWorkflow(projectName, workflowId, payload = {}) {
public/control-center/api.js:1524:  if (!workflowId) {
public/control-center/api.js:1525:    throw new Error("Missing workflow id");
public/control-center/api.js:1529:    `/media-manager/project/${encodeURIComponent(projectName)}/workflows/${encodeURIComponent(workflowId)}/run`,
public/control-center/api.js:1532:    "Failed to record workflow run"
public/control-center/api.js:1536:export async function runProjectAiWorkflow(projectName, workflowId, payload = {}) {
public/control-center/api.js:1541:  if (!workflowId) {
public/control-center/api.js:1542:    throw new Error("Missing workflow id");
public/control-center/api.js:1546:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/workflows/${encodeURIComponent(workflowId)}/run`,
public/control-center/api.js:1549:    "Failed to execute AI workflow"
public/control-center/api.js:1553:export async function executeProjectAiCommand(projectName, payload = {}) {
public/control-center/api.js:1559:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/command`,
public/control-center/api.js:1562:    "Failed to execute AI command"
public/control-center/api.js:1566:export async function executeProjectAiChat(projectName, payload = {}) {
public/control-center/api.js:1572:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/chat`,
public/control-center/api.js:1575:    "Failed to request AI chat",
public/control-center/api.js:1576:    AI_GUIDANCE_REQUEST_TIMEOUT_MS
public/control-center/api.js:1581:export async function executeProjectAiGuidance(projectName, payload = {}) {
public/control-center/api.js:1587:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/guidance`,
public/control-center/api.js:1590:    "Failed to request AI guidance",
public/control-center/api.js:1591:    AI_GUIDANCE_REQUEST_TIMEOUT_MS
public/control-center/api.js:1601:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
public/control-center/api.js:1604:    "Failed to create project task"
public/control-center/api.js:1615:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
public/control-center/api.js:1616:    "Failed to load project tasks"
public/control-center/api.js:1626:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
public/control-center/api.js:1629:    "Failed to create approval request"
public/control-center/api.js:1640:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
public/control-center/api.js:1641:    "Failed to load approvals"
public/control-center/api.js:1645:export async function decideProjectApproval(projectName, approvalId, payload = {}) {
public/control-center/api.js:1650:  if (!approvalId) {
public/control-center/api.js:1651:    throw new Error("Missing approval id");
public/control-center/api.js:1655:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
public/control-center/api.js:1658:    "Failed to update approval"
public/control-center/api.js:1677:    "Failed to load governance summary"
public/control-center/api.js:1688:    "Failed to load governance policy"
public/control-center/api.js:1701:    "Failed to update governance policy"
public/control-center/api.js:1725:    "Failed to save project connector"
public/control-center/api.js:1742:    "Failed to remove project connector"
public/control-center/api.js:1753:    "Failed to load integration control center"
public/control-center/api.js:1770:    "Failed to connect integration"
public/control-center/api.js:1787:    "Failed to reconnect integration"
public/control-center/api.js:1804:    "Failed to test integration"
public/control-center/api.js:1821:    "Failed to sync integration"
public/control-center/api.js:1838:    "Failed to import integration history"
public/control-center/api.js:1855:    "Failed to disconnect integration"
public/control-center/api.js:1865:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
public/control-center/api.js:1868:    "Failed to save publishing schedule"
public/control-center/api.js:1872:export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1877:  if (!jobId) {
public/control-center/api.js:1878:    throw new Error("Missing job id");
public/control-center/api.js:1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
public/control-center/api.js:1885:    "Failed to reschedule publishing item"
public/control-center/api.js:1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1894:  if (!jobId) {
public/control-center/api.js:1895:    throw new Error("Missing job id");
public/control-center/api.js:1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
public/control-center/api.js:1902:    "Failed to approve publishing item"
public/control-center/api.js:1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1911:  if (!jobId) {
public/control-center/api.js:1912:    throw new Error("Missing job id");
public/control-center/api.js:1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
public/control-center/api.js:1919:    "Failed to publish item"
public/control-center/api.js:1923:export async function failPublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1928:  if (!jobId) {
public/control-center/api.js:1929:    throw new Error("Missing job id");
public/control-center/api.js:1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
public/control-center/api.js:1936:    "Failed to mark publishing item as failed"
public/control-center/api.js:1947:    "Failed to load operations schema"
public/control-center/api.js:1957:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
public/control-center/api.js:1958:    "Failed to load task center"
public/control-center/api.js:1969:    "Failed to load queue center"
public/control-center/api.js:1979:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
public/control-center/api.js:1980:    "Failed to load job monitor"
public/control-center/api.js:1991:    "Failed to load notification center"
public/control-center/api.js:2002:    "Failed to load project team model"
public/control-center/api.js:2015:    "Failed to update project team model"
public/control-center/api.js:2019:export async function listProjectCampaigns(projectName, limit) {
public/control-center/api.js:2027:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns${suffix}`,
public/control-center/api.js:2028:    "Failed to load campaigns"
public/control-center/api.js:2032:export async function saveProjectCampaign(projectName, payload = {}) {
public/control-center/api.js:2039:      `/media-manager/project/${encodeURIComponent(projectName)}/campaigns/${encodeURIComponent(payload.id)}`,
public/control-center/api.js:2042:      "Failed to update campaign"
public/control-center/api.js:2047:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns`,
public/control-center/api.js:2050:    "Failed to create campaign"
public/control-center/api.js:2065:  if (params.campaign_id) {
public/control-center/api.js:2066:    search.set("campaign_id", String(params.campaign_id));
public/control-center/api.js:2073:    "Failed to load content items"
public/control-center/api.js:2087:      "Failed to update content item"
public/control-center/api.js:2095:    "Failed to create content item"
public/control-center/api.js:2110:  if (params.campaign_id) {
public/control-center/api.js:2111:    search.set("campaign_id", String(params.campaign_id));
public/control-center/api.js:2121:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
public/control-center/api.js:2122:    "Failed to load media jobs"
public/control-center/api.js:2133:      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
public/control-center/api.js:2136:      "Failed to update media job"
public/control-center/api.js:2141:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
public/control-center/api.js:2144:    "Failed to create media job"
public/control-center/api.js:2153:    "Failed to improve media prompt"
public/control-center/api.js:2162:    "Failed to run media brand check"
public/control-center/api.js:2171:    "Failed to generate image"
public/control-center/api.js:2180:    "Failed to generate video brief"
public/control-center/api.js:2189:    "Failed to generate voice script"
public/control-center/api.js:2193:export async function generateMediaCampaignPack(payload = {}) {
public/control-center/api.js:2195:    "/api/media/generate-campaign-pack",
public/control-center/api.js:2198:    "Failed to generate campaign pack"
public/control-center/api.js:2228:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs${suffix}`,
public/control-center/api.js:2229:    "Failed to load handoffs"
public/control-center/api.js:2239:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs`,
public/control-center/api.js:2242:    "Failed to create handoff"
public/control-center/api.js:2246:export async function consumeProjectHandoff(projectName, handoffId, payload = {}) {
public/control-center/api.js:2251:  if (!handoffId) {
public/control-center/api.js:2252:    throw new Error("Missing handoff id");
public/control-center/api.js:2256:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs/${encodeURIComponent(handoffId)}/consume`,
public/control-center/api.js:2259:    "Failed to consume handoff"
public/control-center/api.js:2272:    "Failed to load event log"
public/control-center/api.js:2289:    "Failed to update notification"
public/control-center/api.js:2320:    "Failed to upload asset"
public/control-center/automation-engine.js:10:  "create_handoff",
public/control-center/automation-engine.js:12:  "prepare_workflow",
public/control-center/automation-engine.js:13:  "prepare_publishing_draft"
public/control-center/automation-engine.js:17:  { test: /publish\s*now|go\s*live|send\s*live|execute\s*publish|push\s*live/i, reason: "Publishing requires approval and manual confirmation." },
public/control-center/automation-engine.js:19:  { test: /\boverwrite\b|\breplace\b|\btruncate\b/i, reason: "Overwrite actions are blocked in Auto Mode." },
public/control-center/automation-engine.js:21:  { test: /approve\s*final\s*asset|final\s*approval/i, reason: "Final approvals require a human decision." },
public/control-center/automation-engine.js:22:  { test: /spend\s*money|charge|billing|payment|purchase/i, reason: "Spending actions require explicit manual approval." },
public/control-center/automation-engine.js:23:  { test: /send\s*external|send\s*email|send\s*message|dm\b|sms\b/i, reason: "External sending requires approval." },
public/control-center/automation-engine.js:24:  { test: /paid\s*ads|launch\s*ads|ad\s*spend|budget/i, reason: "Paid promotion requires approval." },
public/control-center/automation-engine.js:25:  { test: /credential|api\s*key|secret|token|auth/i, reason: "Credential and provider connection actions require approval." }
public/control-center/automation-engine.js:32:  runToken: 0
public/control-center/automation-engine.js:69:    approvalRequiredStep: null
public/control-center/automation-engine.js:77:    mode: ["off", "guided", "auto_until_approval"].includes(normalizeText(parsed.mode))
public/control-center/automation-engine.js:82:    status: ["idle", "running", "paused", "waiting_approval", "completed", "failed"].includes(normalizeText(parsed.status))
public/control-center/automation-engine.js:87:    approvalRequiredStep: parsed.approvalRequiredStep == null ? null : asObject(parsed.approvalRequiredStep)
public/control-center/automation-engine.js:99:    if (state.status === "running" || state.status === "waiting_approval") {
public/control-center/automation-engine.js:226:        whatWillHappen: `${action} is not executed automatically. A human must approve the next move.`
public/control-center/automation-engine.js:231:  if (type === "prepare_publishing_draft") {
public/control-center/automation-engine.js:235:  if (fingerprint.includes("publishing") && /publish/.test(fingerprint)) {
public/control-center/automation-engine.js:238:      reason: "Publishing actions require manual approval before execution.",
public/control-center/automation-engine.js:239:      whatWillHappen: "Auto Mode will stop at this step and wait for approval."
public/control-center/automation-engine.js:251:    const targetPage = asString(rec?.targetPage || "ai-command");
public/control-center/automation-engine.js:253:    const prompt = asString(rec?.draftPayload?.prompt || `Plan and execute: ${asString(rec?.title)}`);
public/control-center/automation-engine.js:256:      type: "create_handoff",
public/control-center/automation-engine.js:290:        prompt: "Create a conversion-ready content draft from campaign context and current blockers.",
public/control-center/automation-engine.js:291:        source: "automation-flow"
public/control-center/automation-engine.js:296:      type: "create_handoff",
public/control-center/automation-engine.js:298:      action: "Create content-to-media handoff",
public/control-center/automation-engine.js:307:      type: "create_handoff",
public/control-center/automation-engine.js:309:      action: "Create media-to-library handoff",
public/control-center/automation-engine.js:312:        prompt: "Save approved media as managed library assets.",
public/control-center/automation-engine.js:318:      type: "create_handoff",
public/control-center/automation-engine.js:319:      targetPage: "publishing",
public/control-center/automation-engine.js:320:      action: "Create library-to-publishing handoff",
public/control-center/automation-engine.js:323:        prompt: "Prepare publishing draft with approved content/media and schedule-safe checklist.",
public/control-center/automation-engine.js:331:export async function runAutomationStep(step, context = {}) {
public/control-center/automation-engine.js:339:  const destination = asString(step?.targetPage || "ai-command");
public/control-center/automation-engine.js:365:        source_page: "automation-engine",
public/control-center/automation-engine.js:367:        status: "available",
public/control-center/automation-engine.js:371:          automation_step: asObject(step)
public/control-center/automation-engine.js:381:        source_page: "automation-engine",
public/control-center/automation-engine.js:383:        status: "available",
public/control-center/automation-engine.js:392:          automation_step: asObject(step)
public/control-center/automation-engine.js:402:    if (normalizeText(step.type) === "prepare_workflow") {
public/control-center/automation-engine.js:404:      const handoff = {
public/control-center/automation-engine.js:405:        source_page: "automation-engine",
public/control-center/automation-engine.js:406:        destination_page: "workflows",
public/control-center/automation-engine.js:407:        status: "available",
public/control-center/automation-engine.js:410:          title: asString(step?.payload?.title || "Prepared workflow draft"),
public/control-center/automation-engine.js:412:          automation_step: asObject(step)
public/control-center/automation-engine.js:415:      setSharedHandoff(projectName, "workflows", handoff);
public/control-center/automation-engine.js:417:        context.createProjectHandoff(projectName, handoff).catch(() => {});
public/control-center/automation-engine.js:422:    if (normalizeText(step.type) === "prepare_publishing_draft") {
public/control-center/automation-engine.js:424:      const handoff = {
public/control-center/automation-engine.js:425:        source_page: "automation-engine",
public/control-center/automation-engine.js:426:        destination_page: "publishing",
public/control-center/automation-engine.js:427:        status: "available",
public/control-center/automation-engine.js:430:          title: asString(step?.payload?.title || "Prepared publishing draft"),
public/control-center/automation-engine.js:432:          intent: "prepare_publishing_draft",
public/control-center/automation-engine.js:433:          automation_step: asObject(step)
public/control-center/automation-engine.js:436:      setSharedHandoff(projectName, "publishing", handoff);
public/control-center/automation-engine.js:438:        context.createProjectHandoff(projectName, handoff).catch(() => {});
public/control-center/automation-engine.js:443:    if (normalizeText(step.type) === "create_handoff") {
public/control-center/automation-engine.js:445:      const handoff = {
public/control-center/automation-engine.js:446:        source_page: asString(step?.payload?.source_page || "automation-engine"),
public/control-center/automation-engine.js:448:        status: "available",
public/control-center/automation-engine.js:456:          automation_step: asObject(step)
public/control-center/automation-engine.js:460:      setSharedHandoff(projectName, destination, handoff);
public/control-center/automation-engine.js:462:        context.createProjectHandoff(projectName, handoff).catch(() => {});
public/control-center/automation-engine.js:467:    return { status: "skipped", reason: "No runnable action for step type.", step };
public/control-center/automation-engine.js:469:    return { status: "failed", reason: asString(error?.message || "Step failed."), step };
public/control-center/automation-engine.js:473:export async function runAutomationPlan(plan, options = {}) {
public/control-center/automation-engine.js:488:    const result = await runAutomationStep(step, options.context || {});
public/control-center/automation-engine.js:495:    if (result.status === "failed") {
public/control-center/automation-engine.js:497:        status: "failed",
public/control-center/automation-engine.js:500:        failedStep: step
public/control-center/automation-engine.js:509:        remaining: steps.slice(index + 1)
public/control-center/automation-engine.js:521:async function runAutoModeLoop(options = {}) {
public/control-center/automation-engine.js:524:  const activeToken = autoModeRuntime.runToken;
public/control-center/automation-engine.js:527:    if (activeToken !== autoModeRuntime.runToken) return getAutoModeState();

## Cross-page workflow references
public/control-center/pages/publishing.js:2:function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
public/control-center/pages/publishing.js:11:  const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
public/control-center/pages/publishing.js:13:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
public/control-center/pages/publishing.js:14:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
public/control-center/pages/publishing.js:15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
public/control-center/pages/publishing.js:16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
public/control-center/pages/publishing.js:19:    <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
public/control-center/pages/publishing.js:20:      <div class="publishing-command-header-title">Publishing Control Workspace</div>
public/control-center/pages/publishing.js:21:      <div class="publishing-command-header-context">${context}</div>
public/control-center/pages/publishing.js:22:      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
public/control-center/pages/publishing.js:23:      <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
public/control-center/pages/publishing.js:24:      <div class="publishing-command-header-safety">${safety}</div>
public/control-center/pages/publishing.js:25:      <div class="publishing-command-header-actions">${actions}</div>
public/control-center/pages/publishing.js:30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
public/control-center/pages/publishing.js:37:    { key: "handoff", label: "Manual Completion Handoff" }
public/control-center/pages/publishing.js:45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
public/control-center/pages/publishing.js:48:    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
public/control-center/pages/publishing.js:50:        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
public/control-center/pages/publishing.js:52:          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
public/control-center/pages/publishing.js:59:function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {
public/control-center/pages/publishing.js:66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
public/control-center/pages/publishing.js:69:  const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
public/control-center/pages/publishing.js:71:    <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
public/control-center/pages/publishing.js:73:        <div class="publishing-readiness-card is-${r.state}">
public/control-center/pages/publishing.js:74:          <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
public/control-center/pages/publishing.js:82:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/publishing.js:97:} from "../automation-engine.js";
public/control-center/pages/publishing.js:101:  buildPublishingAiPrompt
public/control-center/pages/publishing.js:102:} from "./publishing/publishing-payloads.js";
public/control-center/pages/publishing.js:104:const publishingSessions = new Map();
public/control-center/pages/publishing.js:105:const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";
public/control-center/pages/publishing.js:106:const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:107:const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:110:const PUBLISHING_ASSET_KEYS = [
public/control-center/pages/publishing.js:120:const publishingAutomationState = {
public/control-center/pages/publishing.js:124:let publishingAutoModeUnsubscribe = null;
public/control-center/pages/publishing.js:125:let publishingAutoModeControllerReady = false;
public/control-center/pages/publishing.js:126:let publishingAutomationEnabled = false;
public/control-center/pages/publishing.js:127:let publishingRenderCallback = null;
public/control-center/pages/publishing.js:128:let publishingRenderTimer = null;
public/control-center/pages/publishing.js:130:function schedulePublishingRender(render) {
public/control-center/pages/publishing.js:132:    publishingRenderCallback = render;
public/control-center/pages/publishing.js:135:  if (publishingRenderTimer) {
public/control-center/pages/publishing.js:139:  publishingRenderTimer = window.setTimeout(() => {
public/control-center/pages/publishing.js:140:    publishingRenderTimer = null;
public/control-center/pages/publishing.js:142:    if (typeof publishingRenderCallback === "function") {
public/control-center/pages/publishing.js:143:      publishingRenderCallback();
public/control-center/pages/publishing.js:148:function ensurePublishingAutoModeBinding(getState, navigateTo, render) {
public/control-center/pages/publishing.js:149:  publishingRenderCallback = render;
public/control-center/pages/publishing.js:151:  if (!publishingAutomationEnabled) {
public/control-center/pages/publishing.js:155:  if (!publishingAutoModeControllerReady) {
public/control-center/pages/publishing.js:157:    publishingAutoModeControllerReady = true;
public/control-center/pages/publishing.js:160:  if (publishingAutoModeUnsubscribe) {
public/control-center/pages/publishing.js:164:  publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
public/control-center/pages/publishing.js:172:    schedulePublishingRender();
public/control-center/pages/publishing.js:272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
public/control-center/pages/publishing.js:276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
public/control-center/pages/publishing.js:277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
public/control-center/pages/publishing.js:284:  if (status === "published") return "success";
public/control-center/pages/publishing.js:297:    const parsed = JSON.parse(window.localStorage?.getItem(PUBLISHING_LOCAL_DRAFTS_KEY) || "{}");
public/control-center/pages/publishing.js:307:    window.localStorage?.setItem(PUBLISHING_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
public/control-center/pages/publishing.js:325:    id: asString(draft.id || `local-publish-${Date.now()}`),
public/control-center/pages/publishing.js:355:    publishDate: toDateInput(tomorrow),
public/control-center/pages/publishing.js:356:    publishTime: "09:00",
public/control-center/pages/publishing.js:365:  if (!publishingSessions.has(key)) {
public/control-center/pages/publishing.js:366:    publishingSessions.set(key, {
public/control-center/pages/publishing.js:373:      loadedHandoffId: "",
public/control-center/pages/publishing.js:377:  return publishingSessions.get(key);
public/control-center/pages/publishing.js:395:  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
public/control-center/pages/publishing.js:396:  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
public/control-center/pages/publishing.js:397:  return `${titleCase(item.channel || "Publishing")} item`;
public/control-center/pages/publishing.js:415:    executedAt: firstText(raw.executed_at, raw.executedAt),
public/control-center/pages/publishing.js:416:    createdAt: firstText(raw.created_at, raw.createdAt, raw.executed_at),
public/control-center/pages/publishing.js:417:    updatedAt: firstText(raw.updated_at, raw.updatedAt, raw.executed_at, raw.created_at),
public/control-center/pages/publishing.js:436:    .sort((a, b) => (toDate(b.executed_at)?.getTime() || 0) - (toDate(a.executed_at)?.getTime() || 0));
public/control-center/pages/publishing.js:476:    published: 5
public/control-center/pages/publishing.js:513:function getNextPublishWindow(queue) {
public/control-center/pages/publishing.js:529:    publishDate: toDateInput(item.scheduledFor),
public/control-center/pages/publishing.js:530:    publishTime: toTimeInput(item.scheduledFor),
public/control-center/pages/publishing.js:559:  const date = clean(form.publishDate);
public/control-center/pages/publishing.js:561:  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
public/control-center/pages/publishing.js:564:function buildPublishingAutoModePlan(session) {
public/control-center/pages/publishing.js:568:    "Prepare publishing draft from current project context."
public/control-center/pages/publishing.js:573:      id: `publishing-prepare-${Date.now()}`,
public/control-center/pages/publishing.js:574:      type: "prepare_publishing_draft",
public/control-center/pages/publishing.js:575:      targetPage: "publishing",
public/control-center/pages/publishing.js:576:      action: "Prepare publishing draft",
public/control-center/pages/publishing.js:579:        reason: "Prepare a safe publishing draft without executing publish.",
public/control-center/pages/publishing.js:580:        title: firstText(session.form.title, "Prepared publishing draft")
public/control-center/pages/publishing.js:585:      id: `publishing-gate-${Date.now()}`,
public/control-center/pages/publishing.js:586:      type: "publish_now",
public/control-center/pages/publishing.js:587:      targetPage: "publishing",
public/control-center/pages/publishing.js:588:      action: "Record manual publish completion",
public/control-center/pages/publishing.js:591:        reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
public/control-center/pages/publishing.js:606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
public/control-center/pages/publishing.js:607:    errors.publishDate = "Publish date is required for this action.";
public/control-center/pages/publishing.js:609:  if (intent === "publish" && form.approvalStatus !== "approved") {
public/control-center/pages/publishing.js:610:    errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";
public/control-center/pages/publishing.js:617:function summarizePublishingBlockers(assetBlockers = []) {
public/control-center/pages/publishing.js:626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
public/control-center/pages/publishing.js:629:  const summary = summarizePublishingBlockers(blockers);
public/control-center/pages/publishing.js:630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
public/control-center/pages/publishing.js:636:function confirmPublishingBackendAction(message) {
public/control-center/pages/publishing.js:643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
public/control-center/pages/publishing.js:647:  // Add governance/approval hints for status pills
public/control-center/pages/publishing.js:652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
public/control-center/pages/publishing.js:656:  return `<span class="publishing-status-pill is-${escapeHtml(statusClass(status))}" ${hint}>${escapeHtml(titleCase(status))}</span>`;
public/control-center/pages/publishing.js:662:      .publishing-execution-center {
public/control-center/pages/publishing.js:668:      .publishing-execution-grid {
public/control-center/pages/publishing.js:674:      .publishing-main-column,
public/control-center/pages/publishing.js:675:      .publishing-side-column {
public/control-center/pages/publishing.js:682:      .publishing-card {
public/control-center/pages/publishing.js:687:      .publishing-overview-grid {
public/control-center/pages/publishing.js:693:      .publishing-overview-item,
public/control-center/pages/publishing.js:694:      .publishing-impact-chip {
public/control-center/pages/publishing.js:702:      .publishing-overview-item span,
public/control-center/pages/publishing.js:703:      .publishing-impact-chip small {
public/control-center/pages/publishing.js:710:      .publishing-overview-item strong,
public/control-center/pages/publishing.js:711:      .publishing-impact-chip strong {
public/control-center/pages/publishing.js:717:      .publishing-overview-item.is-wide {
public/control-center/pages/publishing.js:721:      .publishing-impact-row,
public/control-center/pages/publishing.js:722:      .publishing-action-row,
public/control-center/pages/publishing.js:723:      .publishing-form-actions,
public/control-center/pages/publishing.js:724:      .publishing-filter-row {
public/control-center/pages/publishing.js:731:      .publishing-impact-row {
public/control-center/pages/publishing.js:735:      .publishing-action-row,
public/control-center/pages/publishing.js:736:      .publishing-form-actions {
public/control-center/pages/publishing.js:740:      .publishing-action-row .btn,
public/control-center/pages/publishing.js:741:      .publishing-form-actions .btn {
public/control-center/pages/publishing.js:747:      .publishing-impact-chip {
public/control-center/pages/publishing.js:751:      .publishing-filter-chip {
public/control-center/pages/publishing.js:764:      .publishing-filter-chip.is-active {
public/control-center/pages/publishing.js:769:      /* Publishing queue dark contrast correction */
public/control-center/pages/publishing.js:770:      .publishing-queue-list,
public/control-center/pages/publishing.js:771:      .publishing-calendar-list,
public/control-center/pages/publishing.js:772:      .publishing-blocker-list {
public/control-center/pages/publishing.js:779:      .publishing-queue-row {
public/control-center/pages/publishing.js:790:      .publishing-queue-row.is-active {
public/control-center/pages/publishing.js:795:      .publishing-queue-main,
public/control-center/pages/publishing.js:796:      .publishing-calendar-row {
public/control-center/pages/publishing.js:807:      .publishing-queue-title {
public/control-center/pages/publishing.js:815:      .publishing-queue-meta {
public/control-center/pages/publishing.js:824:      .publishing-queue-actions {
public/control-center/pages/publishing.js:831:      .publishing-queue-actions button {
public/control-center/pages/publishing.js:843:      .publishing-queue-actions button:focus-visible,
public/control-center/pages/publishing.js:844:      .publishing-queue-main:focus-visible,
public/control-center/pages/publishing.js:845:      .publishing-calendar-row:focus-visible,
public/control-center/pages/publishing.js:846:      .publishing-filter-chip:focus-visible {
public/control-center/pages/publishing.js:851:      .publishing-queue-actions button:disabled,
public/control-center/pages/publishing.js:852:      .publishing-queue-actions button[disabled] {
public/control-center/pages/publishing.js:860:      .publishing-status-pill {
public/control-center/pages/publishing.js:873:      .publishing-status-pill.is-ready,
public/control-center/pages/publishing.js:874:      .publishing-status-pill.is-scheduled {
public/control-center/pages/publishing.js:878:      .publishing-status-pill.is-published {
public/control-center/pages/publishing.js:882:      .publishing-status-pill.is-failed {
public/control-center/pages/publishing.js:886:      .publishing-inline-error {
public/control-center/pages/publishing.js:893:      .publishing-calendar-row {
public/control-center/pages/publishing.js:904:      .publishing-calendar-row em {
public/control-center/pages/publishing.js:913:        .publishing-execution-grid {
public/control-center/pages/publishing.js:918:        .publishing-queue-row {
public/control-center/pages/publishing.js:923:        .publishing-queue-actions {
public/control-center/pages/publishing.js:937:function extractHandoffSummary(handoff) {
public/control-center/pages/publishing.js:938:  const payload = asObject(handoff?.payload);
public/control-center/pages/publishing.js:942:    id: asString(handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
public/control-center/pages/publishing.js:943:    sourcePage: asString(handoff?.source_page || "workflows"),
public/control-center/pages/publishing.js:944:    workflowId: asString(payload.workflow_id),
public/control-center/pages/publishing.js:945:    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
public/control-center/pages/publishing.js:955:function getPublishingHandoff(projectName, operations) {
public/control-center/pages/publishing.js:957:    getSharedHandoff(projectName, "publishing", operations, "workflows") ||
public/control-center/pages/publishing.js:958:    getSharedHandoff(projectName, "publishing", operations, "ai-command") ||
public/control-center/pages/publishing.js:959:    getSharedHandoff(projectName, "publishing", operations)
public/control-center/pages/publishing.js:967:function buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers }) {
public/control-center/pages/publishing.js:977:      action: "Retry failed publishing item",
public/control-center/pages/publishing.js:993:      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
public/control-center/pages/publishing.js:998:  if (handoff) {
public/control-center/pages/publishing.js:1000:      action: "Load workflow output into a draft",
public/control-center/pages/publishing.js:1001:      why: "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",
public/control-center/pages/publishing.js:1015:    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
public/control-center/pages/publishing.js:1018:      : "Channel readiness is missing. Publishing can prepare drafts, but live execution needs a connected destination.",
public/control-center/pages/publishing.js:1026:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1029:          <div class="setup-kicker">Publishing Overview</div>
public/control-center/pages/publishing.js:1034:      <div class="publishing-overview-grid">
public/control-center/pages/publishing.js:1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
public/control-center/pages/publishing.js:1036:        <div class="publishing-overview-item"><span>Ready for manual review</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
public/control-center/pages/publishing.js:1037:        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
public/control-center/pages/publishing.js:1038:        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
public/control-center/pages/publishing.js:1039:        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
public/control-center/pages/publishing.js:1047:    ["Manual publishing readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
public/control-center/pages/publishing.js:1049:    ["Workflow output", recommendation.action.includes("workflow") ? "Available" : "Optional"],
public/control-center/pages/publishing.js:1052:    ["Automation", counts.scheduled ? "Scheduled" : "Manual"]
public/control-center/pages/publishing.js:1056:    <section class="card publishing-card" id="publishingRecommendation">
public/control-center/pages/publishing.js:1061:          <p class="publishing-section-copy">${escapeHtml(recommendation.why)}</p>
public/control-center/pages/publishing.js:1065:      <div class="publishing-impact-row">
public/control-center/pages/publishing.js:1067:          <span class="publishing-impact-chip">
public/control-center/pages/publishing.js:1073:      <div class="publishing-action-row">
public/control-center/pages/publishing.js:1074:        <button id="publishingOpenQueueBtn" class="btn btn-secondary" type="button">Open Publish Queue</button>
public/control-center/pages/publishing.js:1075:        <button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
public/control-center/pages/publishing.js:1076:        <button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>
public/control-center/pages/publishing.js:1077:        <button id="publishingAutoPrepareBtn" class="btn btn-secondary" type="button">Auto-prepare publishing plan</button>
public/control-center/pages/publishing.js:1078:        <button id="publishingAutoStopBtn" class="btn btn-secondary" type="button">Stop Auto Mode</button>
public/control-center/pages/publishing.js:1080:      <details class="publishing-automation-preview publishing-block-gap">
public/control-center/pages/publishing.js:1081:        <summary>Automation Preview</summary>
public/control-center/pages/publishing.js:1082:        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
public/control-center/pages/publishing.js:1083:        <div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status || "idle")}</div>
public/control-center/pages/publishing.js:1085:          <div class="simple-banner publishing-block-gap">Cross-system blockers: ${escapeHtml(asArray(recommendation.externalBlockers).map((item) => item.title).join("; "))}</div>
public/control-center/pages/publishing.js:1087:        ${publishingAutomationState.progress ? `<div class="simple-banner publishing-block-gap">${escapeHtml(publishingAutomationState.progress)}</div>` : ""}
public/control-center/pages/publishing.js:1088:        ${publishingAutomationState.result ? `<div class="simple-banner publishing-inline-gap">${escapeHtml(publishingAutomationState.result)}</div>` : ""}
public/control-center/pages/publishing.js:1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
public/control-center/pages/publishing.js:1091:          <div class="publishing-action-row publishing-inline-gap">
public/control-center/pages/publishing.js:1092:            <button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>
public/control-center/pages/publishing.js:1093:            <button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>
public/control-center/pages/publishing.js:1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
public/control-center/pages/publishing.js:1107:    <div class="publishing-filter-row">
public/control-center/pages/publishing.js:1112:          <button class="publishing-filter-chip${active ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
public/control-center/pages/publishing.js:1125:      <article class="publishing-queue-row${item.id === selectedId ? " is-active" : ""}" data-publishing-row="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1126:        <button class="publishing-queue-main" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1127:          <span class="publishing-queue-title">${escapeHtml(item.title)}</span>
public/control-center/pages/publishing.js:1128:          <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "Unscheduled")} • ${escapeHtml(item.source)}</span>
public/control-center/pages/publishing.js:1130:        <div class="publishing-queue-state">${renderStatusPill(item.status, escapeHtml)}</div>
public/control-center/pages/publishing.js:1131:        <div class="publishing-queue-actions">
public/control-center/pages/publishing.js:1132:          <button type="button" data-publishing-action="review" data-publishing-id="${escapeHtml(item.id)}">Review Package</button>
public/control-center/pages/publishing.js:1133:          <button type="button" data-publishing-action="schedule" data-publishing-id="${escapeHtml(item.id)}">Queue for Manual Publishing</button>
public/control-center/pages/publishing.js:1134:          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Record Manual Completion</button>
public/control-center/pages/publishing.js:1135:          <button type="button" data-publishing-action="pause" data-publishing-id="${escapeHtml(item.id)}">Pause to draft</button>
public/control-center/pages/publishing.js:1136:          <button type="button" data-publishing-action="retry" data-publishing-id="${escapeHtml(item.id)}">Retry scheduled item</button>
public/control-center/pages/publishing.js:1140:    : `<div class="empty-box">No publish queue items match this filter. Create or load a draft to start the execution queue.</div>`;
public/control-center/pages/publishing.js:1143:    <section class="card publishing-card" id="publishingQueuePanel">
public/control-center/pages/publishing.js:1146:          <div class="setup-kicker">Publish Queue</div>
public/control-center/pages/publishing.js:1152:      <div class="publishing-queue-list">${rows}</div>
public/control-center/pages/publishing.js:1159:    <section class="card publishing-card" id="publishingBuilderPanel">
public/control-center/pages/publishing.js:1162:          <div class="setup-kicker">Publishing Builder</div>
public/control-center/pages/publishing.js:1163:          <h3>Draft, validate, and queue manual publishing records</h3>
public/control-center/pages/publishing.js:1167:      <form id="publishingBuilderForm" class="setup-form-grid publishing-builder-form" novalidate>
public/control-center/pages/publishing.js:1171:              <label class="setup-label" for="publishingProjectInput">Project</label>
public/control-center/pages/publishing.js:1174:            <input id="publishingProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(session.form.project)}" placeholder="Project name">
public/control-center/pages/publishing.js:1179:              <label class="setup-label" for="publishingCampaignInput">Campaign</label>
public/control-center/pages/publishing.js:1182:            <input id="publishingCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(session.form.campaign)}" placeholder="Campaign or launch wave">
public/control-center/pages/publishing.js:1190:              <label class="setup-label" for="publishingChannelInput">Channel</label>
public/control-center/pages/publishing.js:1193:            <select id="publishingChannelInput" name="channel" class="setup-input">
public/control-center/pages/publishing.js:1203:              <label class="setup-label" for="publishingContentInput">Content item</label>
public/control-center/pages/publishing.js:1206:            <input id="publishingContentInput" name="contentItem" class="setup-input" type="text" value="${escapeHtml(session.form.contentItem)}" placeholder="Caption, email, product update, or workflow output">
public/control-center/pages/publishing.js:1214:              <label class="setup-label" for="publishingDateInput">Publish date</label>
public/control-center/pages/publishing.js:1215:              <span class="setup-field-state is-optional">Queue for Manual Publishing</span>
public/control-center/pages/publishing.js:1217:            <input id="publishingDateInput" name="publishDate" class="setup-input" type="date" value="${escapeHtml(session.form.publishDate)}">
public/control-center/pages/publishing.js:1218:            ${fieldError(session, "publishDate", escapeHtml)}
public/control-center/pages/publishing.js:1222:              <label class="setup-label" for="publishingTimeInput">Publish time</label>
public/control-center/pages/publishing.js:1225:            <input id="publishingTimeInput" name="publishTime" class="setup-input" type="time" value="${escapeHtml(session.form.publishTime)}">
public/control-center/pages/publishing.js:1229:              <label class="setup-label" for="publishingApprovalInput">Approval status</label>
public/control-center/pages/publishing.js:1232:            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
public/control-center/pages/publishing.js:1243:            <label class="setup-label" for="publishingTitleInput">Queue title</label>
public/control-center/pages/publishing.js:1246:          <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Operator-facing title">
public/control-center/pages/publishing.js:1251:            <label class="setup-label" for="publishingNotesInput">Execution notes</label>
public/control-center/pages/publishing.js:1254:          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
public/control-center/pages/publishing.js:1257:      <div class="publishing-form-actions">
public/control-center/pages/publishing.js:1258:        <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Draft</button>
public/control-center/pages/publishing.js:1259:        <button id="publishingBuilderSaveBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
public/control-center/pages/publishing.js:1260:        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
public/control-center/pages/publishing.js:1267:function renderWorkflowHandoff(handoff, session, escapeHtml) {
public/control-center/pages/publishing.js:1268:  if (!handoff) {
public/control-center/pages/publishing.js:1270:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1273:            <div class="setup-kicker">Workflow Handoff</div>
public/control-center/pages/publishing.js:1274:            <h3>No workflow output available</h3>
public/control-center/pages/publishing.js:1278:        <div class="empty-box">Run or route a workflow into Publishing to load execution-ready output here.</div>
public/control-center/pages/publishing.js:1283:  const summary = extractHandoffSummary(handoff);
public/control-center/pages/publishing.js:1284:  const isLoaded = summary.id && summary.id === session.loadedHandoffId;
public/control-center/pages/publishing.js:1286:    <section class="card publishing-card" id="publishingHandoffPanel">
public/control-center/pages/publishing.js:1289:          <div class="setup-kicker">Workflow Handoff</div>
public/control-center/pages/publishing.js:1291:          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>
public/control-center/pages/publishing.js:1297:        <div class="data-row"><span>Workflow</span><strong>${escapeHtml(summary.workflowId || "Not specified")}</strong></div>
public/control-center/pages/publishing.js:1301:      <div class="publishing-action-row">
public/control-center/pages/publishing.js:1302:        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
public/control-center/pages/publishing.js:1316:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1324:        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
public/control-center/pages/publishing.js:1332:      <div class="publishing-calendar-list">
public/control-center/pages/publishing.js:1334:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1346:      <div class="publishing-calendar-list publishing-block-gap">
public/control-center/pages/publishing.js:1347:        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
public/control-center/pages/publishing.js:1349:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1361:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1376:    .filter((item) => item.executedAt || item.status === "failed")
public/control-center/pages/publishing.js:1377:    .sort((a, b) => (toDate(b.executedAt || b.updatedAt)?.getTime() || 0) - (toDate(a.executedAt || a.updatedAt)?.getTime() || 0))[0];
public/control-center/pages/publishing.js:1382:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1386:            <h3>No publish result yet</h3>
public/control-center/pages/publishing.js:1390:        <div class="empty-box">Last publish result and failed publish blockers will appear here after execution data exists.</div>
public/control-center/pages/publishing.js:1396:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1400:          <h3>${escapeHtml(latest ? latest.title : "Failed publish blockers")}</h3>
public/control-center/pages/publishing.js:1407:          <div class="data-row"><span>Executed</span><strong>${escapeHtml(formatDateTime(latest.executedAt, "Not executed"))}</strong></div>
public/control-center/pages/publishing.js:1412:        <div class="publishing-blocker-list">
public/control-center/pages/publishing.js:1414:            <div class="simple-banner">${escapeHtml(item.title)}: ${escapeHtml(normalizeNotes(item.notes).join("; ") || "Failed publish needs review.")}</div>
public/control-center/pages/publishing.js:1424:  const assets = filterAssetCategories(assetData, PUBLISHING_ASSET_KEYS);
public/control-center/pages/publishing.js:1427:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1431:          <h3>Publishing blockers</h3>
public/control-center/pages/publishing.js:1435:      ${renderAssetDependencyRows(assetData, PUBLISHING_ASSET_KEYS, escapeHtml, "Publishing library inputs are covered.")}
public/control-center/pages/publishing.js:1436:      <div class="simple-banner publishing-block-gap">${escapeHtml(getAssetNextAction(assetData, PUBLISHING_ASSET_KEYS))}</div>
public/control-center/pages/publishing.js:1448:    showError?.(error.message || "Publishing action failed.");
public/control-center/pages/publishing.js:1453:function bindPublishingWorkspace({
public/control-center/pages/publishing.js:1460:  savePublishingSchedule,
public/control-center/pages/publishing.js:1461:  reschedulePublishingItem,
public/control-center/pages/publishing.js:1462:  approvePublishingItem,
public/control-center/pages/publishing.js:1463:  publishPublishingItem,
public/control-center/pages/publishing.js:1464:  failPublishingItem,
public/control-center/pages/publishing.js:1467:  handoff
public/control-center/pages/publishing.js:1474:  ensurePublishingAutoModeBinding(getState, navigateTo, render);
public/control-center/pages/publishing.js:1477:    schedulePublishingRender(render);
public/control-center/pages/publishing.js:1485:  function saveDraftLocally(message = "Publishing draft saved locally.") {
public/control-center/pages/publishing.js:1496:    const local = saveDraftLocally("Publishing draft saved locally.");
public/control-center/pages/publishing.js:1497:    if (typeof savePublishingSchedule === "function") {
public/control-center/pages/publishing.js:1499:        () => savePublishingSchedule(projectName, buildSchedulePayload(session, "draft")),
public/control-center/pages/publishing.js:1505:          successMessage: "Publishing draft saved."
public/control-center/pages/publishing.js:1517:  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
public/control-center/pages/publishing.js:1519:      session.filter = button.getAttribute("data-publishing-filter") || "all";
public/control-center/pages/publishing.js:1524:  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
public/control-center/pages/publishing.js:1526:      const itemId = button.getAttribute("data-publishing-select") || "";
public/control-center/pages/publishing.js:1533:  const form = $("publishingBuilderForm");
public/control-center/pages/publishing.js:1544:  const newBtn = $("publishingNewItemBtn");
public/control-center/pages/publishing.js:1548:      showMessage?.("New publishing draft opened.");
public/control-center/pages/publishing.js:1553:  const openQueueBtn = $("publishingOpenQueueBtn");
public/control-center/pages/publishing.js:1556:      document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
public/control-center/pages/publishing.js:1560:  const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
public/control-center/pages/publishing.js:1573:  const scheduleBtn = $("publishingScheduleBtn");
public/control-center/pages/publishing.js:1584:      if (!current?.localOnly && guardPublishingAssetBlockers(session, assetBlockers, showMessage, "scheduling or rescheduling")) {
public/control-center/pages/publishing.js:1593:        session.draftMessage = "Local publishing draft scheduled in this browser.";
public/control-center/pages/publishing.js:1599:      const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1601:          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
public/control-center/pages/publishing.js:1602:          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
public/control-center/pages/publishing.js:1610:        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
public/control-center/pages/publishing.js:1611:        : () => savePublishingSchedule(projectName, payload);
public/control-center/pages/publishing.js:1618:        successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
public/control-center/pages/publishing.js:1631:  Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
public/control-center/pages/publishing.js:1633:      const itemId = button.getAttribute("data-publishing-id") || "";
public/control-center/pages/publishing.js:1634:      const action = button.getAttribute("data-publishing-action") || "";
public/control-center/pages/publishing.js:1647:        document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
public/control-center/pages/publishing.js:1652:      const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
public/control-center/pages/publishing.js:1659:        const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
public/control-center/pages/publishing.js:1661:        session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
public/control-center/pages/publishing.js:1667:      if (action === "publish") {
public/control-center/pages/publishing.js:1668:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
public/control-center/pages/publishing.js:1674:          "Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."
public/control-center/pages/publishing.js:1681:          () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
public/control-center/pages/publishing.js:1682:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Manual publishing completion recorded." }
public/control-center/pages/publishing.js:1686:        const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1687:          "Confirm pause\n\nAction: Move this backend publishing item back to draft.\n\nThis updates the backend publishing lifecycle state.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1695:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
public/control-center/pages/publishing.js:1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1700:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
public/control-center/pages/publishing.js:1705:        const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1714:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
public/control-center/pages/publishing.js:1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1722:  const approveBtn = $("publishingApproveBtn");
public/control-center/pages/publishing.js:1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
public/control-center/pages/publishing.js:1734:        showMessage?.("Local publishing draft approved.");
public/control-center/pages/publishing.js:1739:      const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1740:        "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1748:        () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
public/control-center/pages/publishing.js:1749:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
public/control-center/pages/publishing.js:1755:  const failBtn = $("publishingFailBtn");
public/control-center/pages/publishing.js:1760:        session.validation.contentItem = "Select a publishing item before marking it failed.";
public/control-center/pages/publishing.js:1766:        showMessage?.("Local publishing draft marked failed.");
public/control-center/pages/publishing.js:1771:      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
public/control-center/pages/publishing.js:1778:        () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
public/control-center/pages/publishing.js:1779:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
public/control-center/pages/publishing.js:1785:  const loadHandoffBtn = $("publishingLoadHandoffBtn");
public/control-center/pages/publishing.js:1786:  if (loadHandoffBtn) {
public/control-center/pages/publishing.js:1787:    loadHandoffBtn.onclick = () => {
public/control-center/pages/publishing.js:1788:      const summary = extractHandoffSummary(handoff);
public/control-center/pages/publishing.js:1798:      session.loadedHandoffId = summary.id;
public/control-center/pages/publishing.js:1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
public/control-center/pages/publishing.js:1808:  const pushAiBtn = $("publishingPushAiBtn");
public/control-center/pages/publishing.js:1813:      const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
public/control-center/pages/publishing.js:1818:        lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
public/control-center/pages/publishing.js:1823:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/publishing.js:1824:        source_page: "publishing",
public/control-center/pages/publishing.js:1827:          entity_type: "publishing_job",
public/control-center/pages/publishing.js:1832:          publishing_item_id: current?.jobId || session.formSourceId || "",
public/control-center/pages/publishing.js:1833:          publishing_title: current?.title || session.form.title || "",
public/control-center/pages/publishing.js:1845:      showMessage?.("Publishing context sent to AI Command.");
public/control-center/pages/publishing.js:1849:  const autoPrepareBtn = $("publishingAutoPrepareBtn");
public/control-center/pages/publishing.js:1852:      const plan = buildPublishingAutoModePlan(session);
public/control-center/pages/publishing.js:1854:        publishingAutomationState.progress = "";
public/control-center/pages/publishing.js:1855:        publishingAutomationState.result = "No safe publishing preparation steps available.";
public/control-center/pages/publishing.js:1860:      publishingAutomationState.result = "";
public/control-center/pages/publishing.js:1861:      publishingAutomationState.progress = `Step 0 / ${plan.length}`;
public/control-center/pages/publishing.js:1862:      publishingAutomationEnabled = true;
public/control-center/pages/publishing.js:1863:      ensurePublishingAutoModeBinding(getState, navigateTo, render);
public/control-center/pages/publishing.js:1870:        publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
public/control-center/pages/publishing.js:1871:        schedulePublishingRender(render);
public/control-center/pages/publishing.js:1875:      publishingAutomationState.result = runResult.status === "success"
public/control-center/pages/publishing.js:1876:        ? "Auto Prepare Publishing completed."
public/control-center/pages/publishing.js:1877:        : "Auto Prepare Publishing stopped before completion.";
public/control-center/pages/publishing.js:1878:      showMessage?.(publishingAutomationState.result);
public/control-center/pages/publishing.js:1883:  const autoStopBtn = $("publishingAutoStopBtn");
public/control-center/pages/publishing.js:1891:  const autoApproveBtn = $("publishingAutoApproveBtn");
public/control-center/pages/publishing.js:1899:  const autoSkipBtn = $("publishingAutoSkipBtn");
public/control-center/pages/publishing.js:1908:export const publishingRoute = {
public/control-center/pages/publishing.js:1909:  id: "publishing",
public/control-center/pages/publishing.js:1912:    eyebrow: "Execute & Grow",
public/control-center/pages/publishing.js:1913:    title: "Publishing",
public/control-center/pages/publishing.js:1914:    description: "Review, prepare, queue, and record manual publishing status with clear previews and backend-controlled actions."
public/control-center/pages/publishing.js:1917:    <section class="page is-active" data-page="publishing">
public/control-center/pages/publishing.js:1918:      <div id="publishingRoot"></div>
public/control-center/pages/publishing.js:1930:    savePublishingSchedule,
public/control-center/pages/publishing.js:1931:    reschedulePublishingItem,
public/control-center/pages/publishing.js:1932:    approvePublishingItem,
public/control-center/pages/publishing.js:1933:    publishPublishingItem,
public/control-center/pages/publishing.js:1934:    failPublishingItem
public/control-center/pages/publishing.js:1943:    const handoff = getPublishingHandoff(projectName, operations);
public/control-center/pages/publishing.js:1945:    const root = $("publishingRoot");
public/control-center/pages/publishing.js:1962:    const publishingAssets = filterAssetCategories(getAssetData(state), PUBLISHING_ASSET_KEYS);
public/control-center/pages/publishing.js:1963:    const assetBlockers = publishingAssets.filter((item) => ["Missing", "Needs Review"].includes(item.status));
public/control-center/pages/publishing.js:1964:    const recommendation = buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers });
public/control-center/pages/publishing.js:1969:      ${renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary: null, queue, blockers: assetBlockers, escapeHtml })}
public/control-center/pages/publishing.js:1970:      ${renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers: assetBlockers, approvalState: selectedItem?.approvalStatus, escapeHtml })}
public/control-center/pages/publishing.js:1971:      ${renderPublishingReadinessSummary({ selectedItem, recommendation, blockers: assetBlockers, assetData: publishingAssets, escapeHtml })}
public/control-center/pages/publishing.js:1972:      <div class="publishing-execution-center">
public/control-center/pages/publishing.js:1976:        <div class="publishing-execution-grid">
public/control-center/pages/publishing.js:1977:          <div class="publishing-main-column">
public/control-center/pages/publishing.js:1980:            <section class="card publishing-card">
public/control-center/pages/publishing.js:1984:                  <h3>${escapeHtml(safeText(selectedItem?.title, "Selected publishing item"))}</h3>
public/control-center/pages/publishing.js:1988:              <div class="publishing-action-row">
public/control-center/pages/publishing.js:1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
public/control-center/pages/publishing.js:1990:                <button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>
public/control-center/pages/publishing.js:1995:          <aside class="publishing-side-column">
public/control-center/pages/publishing.js:1996:            ${renderWorkflowHandoff(handoff, session, escapeHtml)}
public/control-center/pages/publishing.js:2005:    bindPublishingWorkspace({
public/control-center/pages/publishing.js:2012:      savePublishingSchedule,
public/control-center/pages/publishing.js:2013:      reschedulePublishingItem,
public/control-center/pages/publishing.js:2014:      approvePublishingItem,
public/control-center/pages/publishing.js:2015:      publishPublishingItem,
public/control-center/pages/publishing.js:2016:      failPublishingItem,
public/control-center/pages/publishing.js:2017:      render: () => publishingRoute.render({
public/control-center/pages/publishing.js:2026:        savePublishingSchedule,
public/control-center/pages/publishing.js:2027:        reschedulePublishingItem,
public/control-center/pages/publishing.js:2028:        approvePublishingItem,
public/control-center/pages/publishing.js:2029:        publishPublishingItem,
public/control-center/pages/publishing.js:2030:        failPublishingItem
public/control-center/pages/publishing.js:2033:      handoff
public/control-center/pages/governance.js:1:// --- Governance Evidence Summary & Intake Patch ---
public/control-center/pages/governance.js:7:function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
public/control-center/pages/governance.js:23:  const sources = [selectedItem, projectData, governanceData];
public/control-center/pages/governance.js:77:function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
public/control-center/pages/governance.js:78:  const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
public/control-center/pages/governance.js:81:    <div class="governance-evidence-summary">
public/control-center/pages/governance.js:82:      <div class="governance-evidence-summary-header">Evidence Summary</div>
public/control-center/pages/governance.js:83:      <div class="governance-evidence-cards">
public/control-center/pages/governance.js:84:        <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:85:          <span class="governance-evidence-label">Source of Truth</span>
public/control-center/pages/governance.js:86:          <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
public/control-center/pages/governance.js:88:        <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:89:          <span class="governance-evidence-label">Legal</span>
public/control-center/pages/governance.js:90:          <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
public/control-center/pages/governance.js:92:        <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:93:          <span class="governance-evidence-label">Pricing</span>
public/control-center/pages/governance.js:94:          <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
public/control-center/pages/governance.js:96:        <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:97:          <span class="governance-evidence-label">Certificate/Proof</span>
public/control-center/pages/governance.js:98:          <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
public/control-center/pages/governance.js:100:        <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:101:          <span class="governance-evidence-label">Brand Asset</span>
public/control-center/pages/governance.js:102:          <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
public/control-center/pages/governance.js:104:        <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:105:          <span class="governance-evidence-label">Product Asset</span>
public/control-center/pages/governance.js:106:          <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
public/control-center/pages/governance.js:109:      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
public/control-center/pages/governance.js:110:      <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
public/control-center/pages/governance.js:115:function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
public/control-center/pages/governance.js:116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
public/control-center/pages/governance.js:119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
public/control-center/pages/governance.js:122:  if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
public/control-center/pages/governance.js:127:    <div class="governance-intake-panel">
public/control-center/pages/governance.js:128:      <div class="governance-intake-panel-header">Incoming Review Context</div>
public/control-center/pages/governance.js:129:      <div class="governance-intake-list">
public/control-center/pages/governance.js:131:          <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
public/control-center/pages/governance.js:132:        `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
public/control-center/pages/governance.js:140:  fetchProjectGovernance,
public/control-center/pages/governance.js:141:  updateProjectGovernancePolicy
public/control-center/pages/governance.js:144:const governanceSessions = new Map();
public/control-center/pages/governance.js:188:    return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
public/control-center/pages/governance.js:192:    return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
public/control-center/pages/governance.js:196:    return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
public/control-center/pages/governance.js:199:  return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
public/control-center/pages/governance.js:202:function confirmGovernanceDecision(decision) {
public/control-center/pages/governance.js:209:  if (!governanceSessions.has(key)) {
public/control-center/pages/governance.js:210:    governanceSessions.set(key, {
public/control-center/pages/governance.js:219:  return governanceSessions.get(key);
public/control-center/pages/governance.js:226:function mapSettingsToGovernancePolicy(settings = {}) {
public/control-center/pages/governance.js:228:  const publishing = asObject(settings.publishing);
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:246:      publishing: asString(settings.team?.publishAccess) || "Publisher",
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:267:async function loadGovernance(projectName, session, rerender) {
public/control-center/pages/governance.js:275:    session.summary = await fetchProjectGovernance(projectName, {
public/control-center/pages/governance.js:280:    session.error = error.message || "Failed to load governance console.";
public/control-center/pages/governance.js:287:async function refreshGovernance(projectName, session, rerender, showError) {
public/control-center/pages/governance.js:289:  await loadGovernance(projectName, session, rerender);
public/control-center/pages/governance.js:297:    <div class="governance-metric">
public/control-center/pages/governance.js:313:      <div class="governance-card-list">
public/control-center/pages/governance.js:315:          <div class="governance-card">
public/control-center/pages/governance.js:316:            <div class="governance-card-head">
public/control-center/pages/governance.js:326:      <div class="workflow-history-list">
public/control-center/pages/governance.js:328:          <div class="workflow-history-item">
public/control-center/pages/governance.js:344:    <div class="governance-flag-list">
public/control-center/pages/governance.js:346:        <div class="governance-flag">
public/control-center/pages/governance.js:360:    ...asArray(item.publish_guardrails)
public/control-center/pages/governance.js:366:    <article class="governance-card">
public/control-center/pages/governance.js:367:      <div class="governance-card-head">
public/control-center/pages/governance.js:374:      <div class="governance-meta">
public/control-center/pages/governance.js:380:      <p class="governance-copy">${escapeHtml(item.summary || "Awaiting review and decision.")}</p>
public/control-center/pages/governance.js:382:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
public/control-center/pages/governance.js:383:      <div class="governance-actions">
public/control-center/pages/governance.js:384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Reviewed Approval</button>
public/control-center/pages/governance.js:385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
public/control-center/pages/governance.js:386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
public/control-center/pages/governance.js:387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
public/control-center/pages/governance.js:388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record High-Risk Override</button>
public/control-center/pages/governance.js:391:        <div class="governance-history">
public/control-center/pages/governance.js:393:            <div class="governance-history-item">
public/control-center/pages/governance.js:410:        : asArray(item.publish_guardrails);
public/control-center/pages/governance.js:413:    <article class="governance-card">
public/control-center/pages/governance.js:414:      <div class="governance-card-head">
public/control-center/pages/governance.js:421:      <div class="governance-meta">
public/control-center/pages/governance.js:431:        <div class="governance-actions">
public/control-center/pages/governance.js:435:            data-governance-request-approval="true"
public/control-center/pages/governance.js:438:            data-title="${escapeHtml(item.title || "Governance review")}"
public/control-center/pages/governance.js:440:            data-summary="${escapeHtml(flags.map((flag) => flag.message).join(" | ") || "Governance review requested.")}"
public/control-center/pages/governance.js:456:    <div class="governance-timeline">
public/control-center/pages/governance.js:458:        <div class="governance-timeline-item">
public/control-center/pages/governance.js:459:          <div class="governance-timeline-dot"></div>
public/control-center/pages/governance.js:460:          <div class="governance-timeline-copy">
public/control-center/pages/governance.js:477:    <div class="governance-policy-grid">
public/control-center/pages/governance.js:478:      <label class="settings-toggle" for="governance-approval-before-publish">
public/control-center/pages/governance.js:479:        <span class="settings-field-label">Require approval before publishing mutations</span>
public/control-center/pages/governance.js:480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
public/control-center/pages/governance.js:483:      <label class="settings-toggle" for="governance-claim-review">
public/control-center/pages/governance.js:485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:488:      <label class="settings-toggle" for="governance-brand-safety">
public/control-center/pages/governance.js:490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:493:      <label class="settings-toggle" for="governance-auto-escalate">
public/control-center/pages/governance.js:495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
public/control-center/pages/governance.js:498:      <label class="settings-toggle" for="governance-admin-override">
public/control-center/pages/governance.js:500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
public/control-center/pages/governance.js:503:      <label class="settings-toggle" for="governance-freeze-publishing">
public/control-center/pages/governance.js:504:        <span class="settings-field-label">Freeze publishing mutations</span>
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:509:        <label class="settings-field-label" for="governance-owner-content">Content owner</label>
public/control-center/pages/governance.js:510:        <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
public/control-center/pages/governance.js:513:        <label class="settings-field-label" for="governance-owner-media">Media owner</label>
public/control-center/pages/governance.js:514:        <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
public/control-center/pages/governance.js:517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
public/control-center/pages/governance.js:518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
public/control-center/pages/governance.js:548:      ...asArray(item.publish_guardrails)
public/control-center/pages/governance.js:587:  const publish = asArray(sections.publish_guardrails).map((item) => {
public/control-center/pages/governance.js:588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
public/control-center/pages/governance.js:591:      queue_kind: "publish",
public/control-center/pages/governance.js:592:      selected_key: `publish:${asString(item.entity_id || item.id)}`,
public/control-center/pages/governance.js:593:      queue_title: item.title || "Publish guardrail",
public/control-center/pages/governance.js:594:      queue_summary: asArray(item.publish_guardrails).map((flag) => flag.message).join(" | ") || "No publish blockers detected.",
public/control-center/pages/governance.js:596:      queue_risk: asArray(item.publish_guardrails)[0]?.severity || "medium",
public/control-center/pages/governance.js:597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
public/control-center/pages/governance.js:599:      queue_flags: asArray(item.publish_guardrails),
public/control-center/pages/governance.js:617:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
public/control-center/pages/governance.js:620:function buildGovernancePrompts(projectName, selectedItem, focusLabel) {
public/control-center/pages/governance.js:622:  const itemLabel = asString(selectedItem?.queue_title || selectedItem?.title || "the selected governance item");
public/control-center/pages/governance.js:625:      label: "Summarize governance state",
public/control-center/pages/governance.js:626:      preview: "Explain the current approval pressure, risk level, and next governance priority.",
public/control-center/pages/governance.js:627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
public/control-center/pages/governance.js:631:      preview: "Explain the selected governance item and what decision path is safest.",
public/control-center/pages/governance.js:632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
public/control-center/pages/governance.js:635:      label: "Find governance gaps",
public/control-center/pages/governance.js:636:      preview: "Identify the highest-risk governance gaps and what rules or ownership need tightening.",
public/control-center/pages/governance.js:637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
public/control-center/pages/governance.js:650:  const publishGuardrails = asArray(sections.publish_guardrails).length;
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:655:    blockers.push("Publishing is currently frozen by governance policy.");
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
public/control-center/pages/governance.js:676:    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
public/control-center/pages/governance.js:681:  } else if (publishGuardrails > 0) {
public/control-center/pages/governance.js:682:    nextBestAction = "Review publish guardrails to ensure release paths remain compliant and safe.";
public/control-center/pages/governance.js:698:function governanceRiskRank(value) {
public/control-center/pages/governance.js:710:    return governanceRiskRank(item.queue_risk) > governanceRiskRank(highest.queue_risk) ? item : highest;
public/control-center/pages/governance.js:718:function getGovernanceEscalationRoute(summary, risk) {
public/control-center/pages/governance.js:732:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:733:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:738:                <h3>Governance command center</h3>
public/control-center/pages/governance.js:739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
public/control-center/pages/governance.js:760:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:761:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:766:                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:767:                <p>Preparing the governance operating surface.</p>
public/control-center/pages/governance.js:779:            <div class="empty-box">Loading governance console...</div>
public/control-center/pages/governance.js:788:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:789:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:794:                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:795:                <p>Governance surface is available but the latest data could not be loaded.</p>
public/control-center/pages/governance.js:823:    publish: queueItems.filter((item) => item.queue_kind === "publish").length,
public/control-center/pages/governance.js:832:      publish: "publish",
public/control-center/pages/governance.js:839:  const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/governance.js:851:    "Governance owner";
public/control-center/pages/governance.js:855:  const escalationRoute = getGovernanceEscalationRoute(summary, highestRiskValue || "high");
public/control-center/pages/governance.js:857:  const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");
public/control-center/pages/governance.js:860:    <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:861:      <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:862:        <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
public/control-center/pages/governance.js:863:          <div class="panel-header mhos-context-main governance-operating-header-main">
public/control-center/pages/governance.js:865:              <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
public/control-center/pages/governance.js:866:              <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
public/control-center/pages/governance.js:869:            <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
public/control-center/pages/governance.js:872:          <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
public/control-center/pages/governance.js:873:            <article class="mhos-executive-summary-item governance-summary-readiness">
public/control-center/pages/governance.js:878:            <article class="mhos-executive-summary-item governance-summary-approval">
public/control-center/pages/governance.js:883:            <article class="mhos-executive-summary-item governance-summary-escalation">
public/control-center/pages/governance.js:888:            <article class="mhos-executive-summary-item governance-summary-owner">
public/control-center/pages/governance.js:893:            <article class="mhos-executive-summary-item governance-summary-risk">
public/control-center/pages/governance.js:898:            <article class="mhos-executive-summary-item governance-summary-ai-boundary">
public/control-center/pages/governance.js:900:              <strong class="mhos-executive-metric-value governance-ai-boundary">Prepare / Review / Summarize Only</strong>
public/control-center/pages/governance.js:901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve or change policy. Human backend decision required.</small>
public/control-center/pages/governance.js:905:          <div class="governance-policy-summary-grid">
