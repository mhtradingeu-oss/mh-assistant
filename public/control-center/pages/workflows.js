import {
  getSharedAiDraft,
  getSharedCampaignRecord,
  getSharedHandoff,
  setSharedAiDraft,
  setSharedHandoff
} from "../shared-context.js";

const WORKFLOW_CATALOG = [
  {
    id: "launch-product",
    title: "Launch Product",
    description: "Turn product context, campaign readiness, and system intelligence into a launch-ready operating plan.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Timeframe", "Budget"],
    expectedOutput: "Launch summary, execution plan, required assets, blockers, and next actions.",
    aiModeId: "operations"
  },
  {
    id: "create-content-plan",
    title: "Create Content Plan",
    description: "Generate a content operating plan using current campaign context, winning patterns, and weak-signal avoidance.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Timeframe", "Notes"],
    expectedOutput: "Content plan, channel priorities, asset needs, risks, and production next actions.",
    aiModeId: "content"
  },
  {
    id: "generate-campaign",
    title: "Generate Campaign",
    description: "Create a campaign package with launch phases, messaging angles, channel plan, and dependencies.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Timeframe", "Notes"],
    expectedOutput: "Campaign package, priorities, dependencies, risks, and rollout next actions.",
    aiModeId: "campaign"
  },
  {
    id: "build-ads",
    title: "Build Ads",
    description: "Create a paid campaign operating view using offer context, connected channels, and paid performance signals.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Budget", "Notes"],
    expectedOutput: "Ad strategy, suggested channels, creative needs, blockers, and next actions.",
    aiModeId: "ads"
  },
  {
    id: "run-weekly-report",
    title: "Run Weekly Report",
    description: "Package the current operating picture into a clear report with decisions, blockers, and next actions.",
    requiredInputs: ["Campaign", "Channels", "Goal", "Timeframe", "Notes"],
    expectedOutput: "Weekly summary, key decisions, risks, suggested channels, and next actions.",
    aiModeId: "executive"
  },
  {
    id: "research-competitors",
    title: "Research Competitors",
    description: "Create a focused research workflow around market context, positioning gaps, and missing intelligence.",
    requiredInputs: ["Product", "Audience", "Goal", "Channels", "Notes"],
    expectedOutput: "Research summary, key comparison angles, risks, and follow-up next actions.",
    aiModeId: "research"
  }
];

const ROUTING_TARGETS = [
  { id: "campaign-studio", label: "Send to Campaign Studio" },
  { id: "content-studio", label: "Send to Content Studio" },
  { id: "media-studio", label: "Send to Media Studio" },
  { id: "publishing", label: "Send to Publishing" },
  { id: "ads-manager", label: "Send to Ads Manager" }
];

const workflowSessions = new Map();
let lastWorkflowRenderContext = null;
let workflowBridgeRegistered = false;

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

function firstNonEmpty(...values) {
  for (const value of values) {
    const normalized = asString(value).trim();
    if (normalized) return normalized;
  }
  return "";
}

function uniqueStrings(values) {
  return Array.from(new Set(
    asArray(values)
      .map((item) => asString(item).trim())
      .filter(Boolean)
  ));
}

function parseList(value) {
  return uniqueStrings(asString(value).split(","));
}

function nowIso() {
  return new Date().toISOString();
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatCurrency(value, currency = "USD") {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0
    }).format(parsed);
  } catch (_) {
    return `${currency || "USD"} ${Math.round(parsed)}`;
  }
}

function formatPercent(value, digits = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return `${parsed.toFixed(digits)}%`;
}

function normalizeWorkflowStatus(status) {
  const normalized = asString(status).trim().toLowerCase();
  if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
  if (["failed", "error", "errored", "cancelled"].includes(normalized)) return "failed";
  if (["completed", "success", "done"].includes(normalized)) return "completed";
  return "draft";
}

function statusTone(status) {
  const normalized = normalizeWorkflowStatus(status);
  if (normalized === "completed") return "success";
  if (normalized === "running") return "warning";
  if (normalized === "failed") return "danger";
  return "neutral";
}

function normalizeRecommendation(item) {
  if (typeof item === "string") {
    return {
      title: "Recommendation",
      action: item,
      domain: "",
      meta: ""
    };
  }

  const record = asObject(item);
  return {
    title: firstNonEmpty(record.title, record.label, record.domain, "Recommendation"),
    action: firstNonEmpty(record.action, record.summary, record.description, record.recommendation),
    domain: asString(record.domain),
    meta: firstNonEmpty(record.meta, record.reason, record.why, record.priority)
  };
}

function getWorkflowDef(id) {
  return WORKFLOW_CATALOG.find((item) => item.id === id) || WORKFLOW_CATALOG[0];
}

function buildBaseInputs(state) {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  const activity = asObject(state.data.activity);
  const scheduledChannels = uniqueStrings(asArray(activity.scheduled_jobs).map((item) => asString(item.channel).toLowerCase()));

  return {
    campaign: firstNonEmpty(context.activeCampaign, overview.project_name),
    product: firstNonEmpty(overview.project_name, context.currentProject),
    audience: firstNonEmpty(overview.target_audience, overview.audience_primary),
    channels: scheduledChannels.join(", "),
    goal: firstNonEmpty(overview.primary_goal),
    timeframe: "",
    budget: "",
    notes: ""
  };
}

function getCampaignDraft(projectName, operations) {
  const record = getSharedCampaignRecord(projectName, operations);
  if (!record) return {};

  return asObject(record.form_values || {
    campaignName: record.name,
    campaignGoal: record.objective,
    audiencePrimary: record.audience,
    channelPlan: asArray(record.channels).join(", "),
    offerHeadline: record.offer,
    budget: record.budget
  });
}

function getAiDraft(projectName, operations) {
  const draft = getSharedAiDraft(projectName, operations);
  return asObject(draft);
}

function deriveInputsFromSources(state) {
  const projectName = state.context.currentProject || "";
  const base = buildBaseInputs(state);
  const campaign = getCampaignDraft(projectName, state.data.operations);
  const aiDraft = getAiDraft(projectName, state.data.operations);

  return {
    campaign: firstNonEmpty(campaign.campaignName, base.campaign),
    product: firstNonEmpty(campaign.productFocus, base.product),
    audience: firstNonEmpty(campaign.audiencePrimary, base.audience),
    channels: firstNonEmpty(campaign.channelPlan, base.channels),
    goal: firstNonEmpty(campaign.campaignGoal, aiDraft.lastResponseTitle, base.goal),
    timeframe: firstNonEmpty(
      campaign.startDate && campaign.endDate ? `${campaign.startDate} to ${campaign.endDate}` : "",
      campaign.startDate,
      base.timeframe
    ),
    budget: firstNonEmpty(campaign.budget, base.budget),
    notes: firstNonEmpty(campaign.executionNotes, aiDraft.lastCommand, base.notes)
  };
}

function buildInitialRuns() {
  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
    acc[workflow.id] = {
      status: "draft",
      runId: "",
      lastRun: "",
      output: null,
      history: []
    };
    return acc;
  }, {});
}

function buildOperationsFingerprint(operations) {
  return [
    asString(operations?.backbone?.last_updated),
    String(operations?.workflows?.total_runs || 0),
    String(operations?.tasks?.total || 0)
  ].join(":");
}

function hydrateSessionFromOperations(session, operations) {
  const fingerprint = buildOperationsFingerprint(operations);
  if (!fingerprint || session.operationsFingerprint === fingerprint) {
    return;
  }

  const nextRuns = buildInitialRuns();
  asArray(operations?.workflows?.items).forEach((item) => {
    const workflowId = asString(item.workflow_id);
    if (!nextRuns[workflowId]) return;

    nextRuns[workflowId].status = asString(item.status || "completed");
    nextRuns[workflowId].runId = asString(item.id);
    nextRuns[workflowId].lastRun = asString(item.created_at);
    nextRuns[workflowId].output = asObject(item.output);
    nextRuns[workflowId].history.unshift({
      createdAt: asString(item.created_at),
      source: asString(item.source || "durable-run"),
      output: asObject(item.output)
    });
  });

  Object.keys(nextRuns).forEach((workflowId) => {
    nextRuns[workflowId].history = nextRuns[workflowId].history.slice(0, 8);
  });

  session.runsByWorkflow = nextRuns;
  session.savedTasks = asArray(operations?.tasks?.items).map((item) => ({
    id: asString(item.id),
    workflowId: asString(item.workflow_id),
    title: asString(item.title),
    createdAt: asString(item.created_at),
    output: asObject(item.output)
  }));
  session.activeRole = asString(operations?.team_service_model?.active_role || session.activeRole || "strategist");
  session.operationsFingerprint = fingerprint;
}

function ensureSession(projectName, defaults, operations) {
  const key = projectName || "__default__";

  if (!workflowSessions.has(key)) {
    workflowSessions.set(key, {
      selectedWorkflowId: WORKFLOW_CATALOG[0].id,
      inputsByWorkflow: WORKFLOW_CATALOG.reduce((acc, workflow) => {
        acc[workflow.id] = { ...defaults };
        return acc;
      }, {}),
      runsByWorkflow: buildInitialRuns(),
      savedTasks: [],
      intelligence: {
        project: "",
        status: "idle",
        dashboard: null,
        insights: null,
        learning: null,
        error: "",
        loadedAt: "",
        loadingPromise: null
      },
      operationsFingerprint: "",
      lastAppliedHandoffId: "",
      activeRole: asString(operations?.team_service_model?.active_role || "strategist")
    });
  } else {
    const session = workflowSessions.get(key);
    session.inputsByWorkflow = WORKFLOW_CATALOG.reduce((acc, workflow) => {
      acc[workflow.id] = {
        ...defaults,
        ...asObject(session.inputsByWorkflow?.[workflow.id])
      };
      return acc;
    }, {});
    session.runsByWorkflow = session.runsByWorkflow || buildInitialRuns();
    session.savedTasks = asArray(session.savedTasks);
    session.intelligence = {
      project: asString(session.intelligence?.project),
      status: asString(session.intelligence?.status || "idle"),
      dashboard: session.intelligence?.dashboard || null,
      insights: session.intelligence?.insights || null,
      learning: session.intelligence?.learning || null,
      error: asString(session.intelligence?.error),
      loadedAt: asString(session.intelligence?.loadedAt),
      loadingPromise: session.intelligence?.loadingPromise || null
    };
    session.operationsFingerprint = asString(session.operationsFingerprint);
    session.lastAppliedHandoffId = asString(session.lastAppliedHandoffId);
    session.activeRole = asString(session.activeRole || operations?.team_service_model?.active_role || "strategist");
  }

  const session = workflowSessions.get(key);
  hydrateSessionFromOperations(session, operations);
  return session;
}

function applyDurableWorkflowHandoff({
  projectName,
  session,
  operations,
  consumeProjectHandoff,
  showMessage
}) {
  const handoff = getSharedHandoff(projectName, "workflows", operations);
  const handoffId = asString(handoff?.id);

  if (!handoffId || handoffId === session.lastAppliedHandoffId) {
    return;
  }

  const payload = asObject(handoff?.payload);
  const workflowId =
    asString(payload.workflow_id) ||
    WORKFLOW_CATALOG.find((item) => item.aiModeId === asString(payload?.draft_context?.modeId))?.id ||
    session.selectedWorkflowId;

  if (!session.inputsByWorkflow[workflowId]) {
    session.lastAppliedHandoffId = handoffId;
    return;
  }

  session.selectedWorkflowId = workflowId;
  session.inputsByWorkflow[workflowId] = {
    ...session.inputsByWorkflow[workflowId],
    campaign: firstNonEmpty(payload?.campaign_name, session.inputsByWorkflow[workflowId].campaign),
    goal: firstNonEmpty(payload?.draft_context?.lastResponseTitle, payload?.workflow_title, session.inputsByWorkflow[workflowId].goal),
    notes: firstNonEmpty(payload?.prompt, session.inputsByWorkflow[workflowId].notes)
  };

  if (payload.output) {
    session.runsByWorkflow[workflowId].output = asObject(payload.output);
    session.runsByWorkflow[workflowId].status = "completed";
  }

  session.lastAppliedHandoffId = handoffId;
  consumeProjectHandoff?.(projectName, handoffId, {
    actor: "mh-assistant"
  }).catch((error) => {
    console.warn("Failed to consume workflow handoff:", error.message);
  });
  showMessage?.("Workflow context restored from the shared backbone.");
}

function renderField({
  name,
  label,
  value,
  helper,
  placeholder,
  escapeHtml,
  multiline = false,
  rows = 3
}) {
  return `
    <div class="setup-field-group">
      <div class="setup-field-head">
        <label class="setup-label" for="workflow-${escapeHtml(name)}">${escapeHtml(label)}</label>
        <span class="setup-field-state is-optional">Structured input</span>
      </div>
      ${
        multiline
          ? `<textarea id="workflow-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
          : `<input id="workflow-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
      }
      <div class="setup-helper">${escapeHtml(helper)}</div>
    </div>
  `;
}

function renderOutputBlock(title, items, escapeHtml, emptyText) {
  return `
    <div class="ai-output-card">
      <span class="ai-output-label">${escapeHtml(title)}</span>
      ${
        items.length
          ? `<ul class="ai-output-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<div class="empty-box">${escapeHtml(emptyText)}</div>`
      }
    </div>
  `;
}

function buildContextSummary(state) {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  return {
    project: context.currentProject || "No project selected",
    campaign: context.activeCampaign || "Not selected",
    market: context.currentMarket || overview.market || "Unknown",
    mode: context.executionMode || overview.execution_mode || "General"
  };
}

function buildWorkflowContext(state, session) {
  const dashboard = asObject(session.intelligence.dashboard || state.data);
  const overviewBlock = asObject(dashboard.overview || state.data.overview);
  const overview = asObject(overviewBlock.overview);
  const readinessRoot = asObject(dashboard.readiness || state.data.readiness);
  const readiness = asObject(readinessRoot.dashboard);
  const assets = asObject(dashboard.assets || state.data.assets);
  const integrations = asObject(dashboard.integrations || state.data.integrations);
  const activity = asObject(dashboard.activity || state.data.activity);

  const insightsPayload = asObject(session.intelligence.insights);
  const learningPayload = asObject(session.intelligence.learning);

  const insights = asObject(
    insightsPayload.insights ||
    insightsPayload.data ||
    insightsPayload ||
    activity.insights ||
    activity.marketing_insights ||
    activity.performance_insights ||
    overviewBlock.insights
  );
  const learning = asObject(
    learningPayload.learning ||
    learningPayload.data ||
    learningPayload ||
    activity.learning
  );

  const checks = asObject(integrations.readiness?.checks);
  const connectedChannels = uniqueStrings(
    Object.entries(checks)
      .filter(([, ready]) => Boolean(ready))
      .map(([key]) => key)
  );

  const missingAssets = uniqueStrings([
    ...asArray(assets.missing_assets?.missing),
    ...asArray(assets.missing_assets?.required_asset_types)
  ]);

  const missingIntegrations = uniqueStrings([
    ...Object.entries(checks).filter(([, ready]) => !ready).map(([key]) => titleCase(key)),
    ...Object.entries(asObject(insights.data_coverage))
      .filter(([, item]) => asString(asObject(item).status) !== "covered")
      .map(([key]) => titleCase(key))
  ]);

  const recommendationObjects = asArray(
    learning.recommendations ||
    insights.recommendations ||
    readiness.next_best_actions ||
    overviewBlock.next_best_actions
  ).map((item) => normalizeRecommendation(item));

  return {
    projectName: state.context.currentProject || "",
    campaignName: state.context.activeCampaign || "",
    market: state.context.currentMarket || overview.market || "",
    language: state.context.currentLanguage || overview.language || "",
    currency: overview.currency || "USD",
    overview,
    readiness,
    assets,
    activity,
    insights,
    learning,
    checks,
    connectedChannels,
    missingAssets,
    missingIntegrations,
    recommendations: recommendationObjects,
    topContent: asArray(insights.best_performing_content || insights.top_content),
    weakContent: asArray(insights.underperforming_content || insights.weak_content),
    seo: asObject(insights.seo),
    paid: asObject(insights.paid),
    website: asObject(insights.website),
    hasLiveIntelligence: Boolean(Object.keys(insights).length || Object.keys(learning).length)
  };
}

function buildWorkflowOverviewCounts(session, context) {
  const runStates = Object.values(asObject(session.runsByWorkflow));
  const runCounts = runStates.reduce((acc, run) => {
    const normalized = normalizeWorkflowStatus(run?.status);
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, { draft: 0, running: 0, completed: 0, failed: 0 });

  const executionResults = asArray(context.activity?.execution_results);
  const schedulerJobs = asArray(context.activity?.scheduled_jobs);

  const executionCompleted = executionResults.filter((item) => statusTone(item?.execution_status) === "success").length;
  const executionFailed = executionResults.filter((item) => statusTone(item?.execution_status) === "danger").length;
  const schedulerRunning = schedulerJobs.filter((item) => statusTone(item?.status) === "warning").length;

  return {
    available: WORKFLOW_CATALOG.length,
    running: runCounts.running + schedulerRunning,
    completed: runCounts.completed + executionCompleted,
    failed: runCounts.failed + executionFailed
  };
}

function buildRunningWorkflowRows(session, context) {
  const rows = [];

  WORKFLOW_CATALOG.forEach((workflow) => {
    const run = asObject(session.runsByWorkflow?.[workflow.id]);
    if (normalizeWorkflowStatus(run.status) !== "running") return;
    rows.push({
      id: `workflow-${workflow.id}`,
      name: workflow.title,
      progress: 68,
      currentStep: "Generating structured workflow output",
      nextStep: "Persist run output and refresh project operations"
    });
  });

  asArray(context.activity?.scheduled_jobs)
    .filter((job) => statusTone(job?.status) === "warning")
    .slice(0, 4)
    .forEach((job) => {
      const rawStatus = asString(job.status).trim().toLowerCase();
      const progress = rawStatus === "processing" || rawStatus === "running"
        ? 75
        : rawStatus === "queued" || rawStatus === "scheduled"
          ? 30
          : 50;

      rows.push({
        id: `scheduler-${asString(job.id) || nowIso()}`,
        name: `${titleCase(job.type || "Publish")} Scheduler Job`,
        progress,
        currentStep: titleCase(rawStatus || "queued"),
        nextStep: rawStatus === "processing" || rawStatus === "running"
          ? "Write execution result"
          : "Worker pickup and execution"
      });
    });

  return rows;
}

async function ensureWorkflowIntelligenceLoaded({
  projectName,
  session,
  getState,
  reloadProjectData,
  fetchProjectInsights,
  fetchProjectLearning,
  rerender
}) {
  if (!projectName) {
    session.intelligence = {
      ...session.intelligence,
      status: "error",
      error: "Select a project to run workflows."
    };
    return;
  }

  const current = session.intelligence;
  const freshEnough =
    current.status === "ready" &&
    current.project === projectName &&
    current.loadedAt &&
    (Date.now() - Date.parse(current.loadedAt)) < 1000 * 60 * 3;

  if (freshEnough) {
    return;
  }

  if (current.loadingPromise) {
    return current.loadingPromise;
  }

  const state = getState();
  const needsDashboard = !state.data.overview || !state.data.readiness || !state.data.integrations || !state.data.activity;

  session.intelligence = {
    ...current,
    project: projectName,
    status: "loading",
    error: "",
    loadingPromise: (async () => {
      try {
        if (needsDashboard) {
          await reloadProjectData(projectName);
        }

        const [insightsResult, learningResult] = await Promise.allSettled([
          fetchProjectInsights(projectName),
          fetchProjectLearning(projectName)
        ]);

        session.intelligence = {
          project: projectName,
          status: "ready",
          dashboard: getState().data,
          insights: insightsResult.status === "fulfilled" ? insightsResult.value : null,
          learning: learningResult.status === "fulfilled" ? learningResult.value : null,
          error:
            insightsResult.status === "rejected" && learningResult.status === "rejected"
              ? (insightsResult.reason?.message || learningResult.reason?.message || "Failed to load workflow intelligence")
              : "",
          loadedAt: nowIso(),
          loadingPromise: null
        };
      } catch (error) {
        session.intelligence = {
          ...session.intelligence,
          project: projectName,
          status: "error",
          error: error.message || "Failed to load workflow intelligence",
          loadingPromise: null
        };
      } finally {
        rerender();
      }
    })()
  };

  rerender();
  return session.intelligence.loadingPromise;
}

function deriveSuggestedChannels(inputs, context, workflowId) {
  const fromInputs = parseList(inputs.channels).map(titleCase);
  const fromConnected = context.connectedChannels.map(titleCase);
  const fromTopContent = uniqueStrings(
    context.topContent.map((item) => asString(asObject(item).platform || asObject(item).channel))
  ).map(titleCase);

  if (workflowId === "build-ads") {
    return uniqueStrings(["Meta", "Google Ads", "TikTok", ...fromInputs, ...fromConnected]).slice(0, 5);
  }

  return uniqueStrings([...fromInputs, ...fromTopContent, ...fromConnected, "Email"]).slice(0, 5);
}

function buildWorkflowOutput(workflow, inputs, context) {
  const suggestedChannels = deriveSuggestedChannels(inputs, context, workflow.id);
  const topRecommendation = context.recommendations[0];
  const topContentSignal = context.topContent[0];
  const weakContentSignal = context.weakContent[0];
  const paidSummary = asObject(context.paid.summary || context.paid.overview || context.paid);

  const risks = uniqueStrings([
    ...context.missingAssets.map((item) => `Missing asset: ${titleCase(item)}`),
    ...context.missingIntegrations.map((item) => `Integration gap: ${item}`),
    !context.hasLiveIntelligence ? "Live intelligence is still partial, so recommendations rely more on project context." : "",
    !inputs.channels ? "Channel scope is incomplete." : "",
    !inputs.goal ? "Workflow goal is incomplete." : ""
  ]);

  const requiredAssets = uniqueStrings([
    ...context.missingAssets.map(titleCase),
    workflow.id === "launch-product" ? "Launch brief" : "",
    workflow.id === "create-content-plan" ? "Content brief" : "",
    workflow.id === "generate-campaign" ? "Campaign brief" : "",
    workflow.id === "build-ads" ? "Ad creative set" : "",
    workflow.id === "run-weekly-report" ? "Performance snapshot" : ""
  ]).filter(Boolean);

  let summary = "";
  let keyDecisions = [];
  let executionPlan = [];
  let nextActions = [];

  if (workflow.id === "launch-product") {
    summary = `Launch ${inputs.campaign || context.campaignName || "the active campaign"} with ${inputs.goal || "the current project goal"} as the primary operating target.${topRecommendation?.action ? ` Highest-impact recommendation: ${topRecommendation.action}` : ""}`;
    keyDecisions = uniqueStrings([
      inputs.audience ? `Prioritize ${inputs.audience} as the lead audience.` : "Clarify the lead audience before launch.",
      suggestedChannels[0] ? `Open with ${suggestedChannels[0]} as the lead channel.` : "",
      inputs.budget ? `Plan around ${formatCurrency(inputs.budget, context.currency)} as the working budget.` : "Add a working budget before launch routing."
    ]);
    executionPlan = [
      "Lock campaign structure, dates, and offer framing.",
      "Package required assets and wave-by-wave execution inputs.",
      "Close missing integrations and measurement blockers before go-live.",
      "Route approved work into content, media, publishing, and ads."
    ];
    nextActions = uniqueStrings([
      "Send the draft to Campaign Studio.",
      "Review missing dependencies before launch.",
      topRecommendation?.action || context.readiness.next_best_actions?.[0] || "Resolve the top readiness blocker."
    ]);
  } else if (workflow.id === "create-content-plan") {
    summary = `Build a content plan for ${inputs.campaign || context.campaignName || "the current campaign"} using current audience context and available content learning.${topContentSignal ? ` Strongest signal: ${firstNonEmpty(topContentSignal.title, topContentSignal.label, topContentSignal.topic, topContentSignal.hook)}.` : ""}`;
    keyDecisions = uniqueStrings([
      inputs.audience ? `Write for ${inputs.audience}.` : "Clarify the audience emphasis.",
      topContentSignal ? `Repeat the strongest content pattern.` : "Use the current campaign angle as the base content pattern.",
      weakContentSignal ? `Avoid repeating a weak content pattern until improved.` : ""
    ]);
    executionPlan = [
      "Define hero angle, support topics, and channel priorities.",
      "Map planned outputs to channels, audience needs, and production effort.",
      "Package creative dependencies before publishing.",
      "Route the plan to Content Studio for draft production."
    ];
    nextActions = uniqueStrings([
      "Send the plan to Content Studio.",
      "Coordinate supporting visuals in Media Studio.",
      topRecommendation?.action || "Review weak content signals before finalizing the schedule."
    ]);
  } else if (workflow.id === "generate-campaign") {
    summary = `Generate a full campaign package for ${inputs.campaign || context.campaignName || "the active campaign"} with ${inputs.goal || "the primary business objective"} as the anchor.${topRecommendation?.action ? ` Top recommendation: ${topRecommendation.action}` : ""}`;
    keyDecisions = uniqueStrings([
      inputs.audience ? `Build messaging around ${inputs.audience}.` : "Define the primary audience before finalizing campaign pillars.",
      suggestedChannels[0] ? `Lead with ${suggestedChannels[0]} in phase one.` : "Define the first launch channel.",
      inputs.timeframe ? `Use ${inputs.timeframe} as the rollout window.` : "Set an execution window for the campaign phases."
    ]);
    executionPlan = [
      "Generate campaign concept, launch phases, and offer framing.",
      "Map phase-by-phase content, media, and channel dependencies.",
      "Confirm blockers across assets, integrations, and ownership.",
      "Route approved package to Campaign Studio for execution alignment."
    ];
    nextActions = uniqueStrings([
      "Open Campaign Studio and apply the generated campaign package.",
      "Align content and media dependency timelines.",
      topRecommendation?.action || "Close the highest-priority readiness blocker before execution."
    ]);
  } else if (workflow.id === "build-ads") {
    summary = `Generate a paid strategy for ${inputs.product || context.overview.project_name || "the current offer"} with ${inputs.goal || "campaign performance"} as the target.${paidSummary.roas != null ? ` Current tracked ROAS is ${Number(paidSummary.roas).toFixed(2)}.` : ""}`;
    keyDecisions = uniqueStrings([
      suggestedChannels[0] ? `Prioritize ${suggestedChannels[0]} as the first paid lane.` : "Define the first paid lane.",
      inputs.budget ? `Use ${formatCurrency(inputs.budget, context.currency)} as the planning budget.` : "Add a working budget before activation.",
      inputs.audience ? `Target ${inputs.audience} first.` : "Clarify the first audience segment."
    ]);
    executionPlan = [
      "Set platform mix, audience emphasis, and budget allocation.",
      "Define creative and landing-page requirements.",
      "Confirm tracking, attribution, and blocker status before launch.",
      "Route into Ads Manager once the package is operational."
    ];
    nextActions = uniqueStrings([
      "Send the strategy to Ads Manager.",
      "Build ad creative dependencies in Media Studio.",
      topRecommendation?.action || "Reconnect missing paid intelligence if signals are weak."
    ]);
  } else if (workflow.id === "research-competitors") {
    summary = `Create a competitor research brief for ${inputs.product || context.overview.project_name || "the project"} using current market context, learning, and visible intelligence gaps.`;
    keyDecisions = uniqueStrings([
      inputs.audience ? `Research from the perspective of ${inputs.audience}.` : "Clarify the audience lens for research.",
      inputs.channels ? `Compare channel behavior across ${inputs.channels}.` : "Define which channels matter most in the comparison.",
      context.missingIntegrations.length ? "Expect reduced confidence where intelligence coverage is missing." : ""
    ]);
    executionPlan = [
      "Define comparison scope: offer, messaging, content, and channel presence.",
      "Use current project context and learning to frame the questions.",
      "Capture evidence gaps before deeper analysis.",
      "Route resulting strategy implications into Campaign Studio or AI Command."
    ];
    nextActions = uniqueStrings([
      "Push the research prompt into AI Command.",
      "Use Campaign Studio to test the best angle that emerges.",
      topRecommendation?.action || "Close missing intelligence gaps that limit research quality."
    ]);
  } else if (workflow.id === "run-weekly-report") {
    summary = `Prepare a weekly performance report for ${inputs.campaign || context.campaignName || context.projectName || "the project"} using current readiness, content, website, SEO, and paid signals.`;
    keyDecisions = uniqueStrings([
      context.readiness.readiness_status ? `Readiness is currently ${context.readiness.readiness_status}.` : "",
      topRecommendation?.action || "",
      weakContentSignal ? "Flag at least one underperforming content pattern." : ""
    ]);
    executionPlan = [
      "Summarize current status, wins, blockers, and channel movement.",
      "Highlight the top decision the team should make next.",
      "Package the follow-up routes for execution teams.",
      "Save the output as a structured task for accountability."
    ];
    nextActions = uniqueStrings([
      "Save the report as a structured task.",
      "Route the top follow-up into the right execution workspace.",
      topRecommendation?.action || "Review the highest-priority blocker."
    ]);
  } else {
    summary = `Build a structured workflow output for ${workflow.title} using current project context and intelligence.`;
    keyDecisions = uniqueStrings([
      inputs.goal ? `Keep ${inputs.goal} as the primary objective.` : "Define a clear workflow goal before execution.",
      inputs.audience ? `Optimize the outcome for ${inputs.audience}.` : "Define the target audience.",
      inputs.channels ? `Scope execution across ${inputs.channels}.` : "Set workflow channels explicitly."
    ]);
    executionPlan = [
      "Validate inputs and workflow context.",
      "Generate structured output and route suggestions.",
      "Resolve critical blockers and assign next actions."
    ];
    nextActions = uniqueStrings([
      "Run the workflow again after input refinements.",
      "Route output to the relevant workspace for execution."
    ]);
  }

  return {
    summary,
    keyDecisions,
    executionPlan,
    requiredAssets,
    suggestedChannels,
    risks,
    nextActions
  };
}

function buildRoleAwareRouting(operations, activeRole, selectedWorkflow) {
  const teamModel = asObject(operations?.team_service_model);
  const routePermissions = asArray(teamModel.route_permissions);
  const domains = asArray(operations?.routing?.role_routes);
  const normalizedRole = asString(activeRole || teamModel.active_role || "strategist").toLowerCase();

  const allowedRoutes = routePermissions
    .filter((item) => asArray(item.roles).includes(normalizedRole))
    .map((item) => item.route);

  const preferredDomains = domains.filter((item) =>
    asString(item.owner_role) === normalizedRole ||
    asArray(item.handoff_to).some((role) => asString(asObject(role).role) === normalizedRole)
  );

  const preferredRouteSet = new Set(preferredDomains.map((item) => asString(item.route_target)));
  const filteredTargets = ROUTING_TARGETS.filter((target) => allowedRoutes.includes(target.id) || preferredRouteSet.has(target.id));

  return {
    allowedRoutes,
    preferredDomains,
    targets: filteredTargets.length ? filteredTargets : ROUTING_TARGETS.filter((target) => allowedRoutes.includes(target.id)),
    workflowHint:
      selectedWorkflow.id === "research-competitors"
        ? "Research work should usually route through Analyst or Strategist ownership first."
        : selectedWorkflow.id === "build-ads"
          ? "Paid execution should normally hand off to the Ads Operator after strategist sign-off."
          : "Use the role-aware route list to hand the workflow to the right operating lane."
  };
}

function renderTeamOpsCard(operations, activeRole, routing, escapeHtml) {
  const teamModel = asObject(operations?.team_service_model);
  const roleMatrix = asArray(teamModel.role_matrix);
  const active = roleMatrix.find((item) => asString(item.role) === asString(activeRole)) || roleMatrix[0] || {};
  const ownership = asArray(operations?.ownership?.visibility);
  const handoffs = asArray(operations?.handoffs?.by_role).filter((item) => asString(item.destination_role) === asString(activeRole));

  return `
    <div class="card">
      <div class="card-head">
        <h3>Team Operations Layer</h3>
        <span class="card-badge neutral">Role-aware</span>
      </div>
      <div class="workflow-input-actions">
        ${roleMatrix.map((item) => `
          <button class="btn ${asString(item.role) === asString(activeRole) ? "btn-primary" : "btn-secondary"}" type="button" data-workflow-role="${escapeHtml(item.role)}">${escapeHtml(item.label || titleCase(item.role))}</button>
        `).join("")}
      </div>
      <div class="data-stack">
        <div class="data-row"><span>Active role</span><strong>${escapeHtml(active.label || titleCase(active.role || "strategist"))}</strong></div>
        <div class="data-row"><span>Allowed pages</span><strong>${escapeHtml(asArray(active.routes).map(titleCase).join(", ") || "-")}</strong></div>
        <div class="data-row"><span>Actions</span><strong>${escapeHtml(asArray(active.actions).map(titleCase).join(", ") || "-")}</strong></div>
        <div class="data-row"><span>Primary domains</span><strong>${escapeHtml(asArray(active.service_domains).map(titleCase).join(", ") || "-")}</strong></div>
      </div>
      <div class="simple-banner">
        <strong>Workflow routing:</strong> ${escapeHtml(routing.workflowHint)}
      </div>
      <div class="workflow-history-list">
        ${routing.preferredDomains.length
          ? routing.preferredDomains.map((item) => `
            <div class="workflow-history-item">
              <strong>${escapeHtml(item.label || titleCase(item.domain))}</strong>
              <span>${escapeHtml(`Owner ${item.owner_label || titleCase(item.owner_role)} • Review ${item.review_label || titleCase(item.review_role)} • Route ${titleCase(item.route_target)}`)}</span>
            </div>
          `).join("")
          : `<div class="empty-box">No primary service lanes are mapped for this role yet.</div>`}
      </div>
      <div class="card-head">
        <h3>Ownership Visibility</h3>
        <span class="card-badge neutral">${escapeHtml(String(ownership.length))}</span>
      </div>
      <div class="workflow-history-list">
        ${ownership.length
          ? ownership.slice(0, 6).map((item) => `
            <div class="workflow-history-item">
              <strong>${escapeHtml(item.label || titleCase(item.role))}</strong>
              <span>${escapeHtml(`${item.open} open / ${item.total} total responsibilities`)}</span>
            </div>
          `).join("")
          : `<div class="empty-box">Ownership summaries will appear once durable entities are assigned.</div>`}
      </div>
      <div class="card-head">
        <h3>Inbound Handoffs</h3>
        <span class="card-badge neutral">${escapeHtml(String(handoffs.length))}</span>
      </div>
      <div class="workflow-history-list">
        ${handoffs.length
          ? handoffs.slice(0, 5).map((item) => `
            <div class="workflow-history-item">
              <strong>${escapeHtml(`${titleCase(item.source_page)} -> ${titleCase(item.destination_page)}`)}</strong>
              <span>${escapeHtml(`${item.source_role_label || titleCase(item.source_role)} to ${item.destination_role_label || titleCase(item.destination_role)}`)}</span>
            </div>
          `).join("")
          : `<div class="empty-box">No open handoffs are currently waiting on this role.</div>`}
      </div>
    </div>
  `;
}

function syncInputsFromSource(session, workflowId, state, sourceType) {
  const projectName = state.context.currentProject || "";
  const campaign = getCampaignDraft(projectName, state.data.operations);
  const aiDraft = getAiDraft(projectName, state.data.operations);
  const base = buildBaseInputs(state);

  if (sourceType === "campaign") {
    session.inputsByWorkflow[workflowId] = {
      ...session.inputsByWorkflow[workflowId],
      campaign: firstNonEmpty(campaign.campaignName, base.campaign),
      product: firstNonEmpty(campaign.productFocus, base.product),
      audience: firstNonEmpty(campaign.audiencePrimary, base.audience),
      channels: firstNonEmpty(campaign.channelPlan, base.channels),
      goal: firstNonEmpty(campaign.campaignGoal, base.goal),
      timeframe: firstNonEmpty(
        campaign.startDate && campaign.endDate ? `${campaign.startDate} to ${campaign.endDate}` : "",
        campaign.startDate,
        base.timeframe
      ),
      budget: firstNonEmpty(campaign.budget, base.budget),
      notes: firstNonEmpty(campaign.executionNotes, base.notes)
    };
    return;
  }

  if (sourceType === "ai") {
    session.inputsByWorkflow[workflowId] = {
      ...session.inputsByWorkflow[workflowId],
      goal: firstNonEmpty(aiDraft.lastResponseTitle, session.inputsByWorkflow[workflowId].goal),
      notes: firstNonEmpty(aiDraft.lastCommand, session.inputsByWorkflow[workflowId].notes),
      campaign: firstNonEmpty(session.inputsByWorkflow[workflowId].campaign, base.campaign)
    };
    return;
  }

  session.inputsByWorkflow[workflowId] = { ...deriveInputsFromSources(state) };
}

function registerWorkflowHook(context) {
  lastWorkflowRenderContext = context;

  if (workflowBridgeRegistered || typeof window === "undefined") {
    return;
  }

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
      showMessage
    } = lastWorkflowRenderContext;

    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName, deriveInputsFromSources(state), state.data.operations);
    const workflow = WORKFLOW_CATALOG.find((item) => item.aiModeId === meta.modeId) || WORKFLOW_CATALOG[0];
    session.selectedWorkflowId = workflow.id;
    session.inputsByWorkflow[workflow.id] = {
      ...session.inputsByWorkflow[workflow.id],
      notes: firstNonEmpty(message, session.inputsByWorkflow[workflow.id].notes),
      goal: firstNonEmpty(meta.assistantTitle, session.inputsByWorkflow[workflow.id].goal)
    };

    if (meta.autoRun) {
      session.runsByWorkflow[workflow.id].status = "running";
      render();
      await ensureWorkflowIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        rerender: render
      });
      const createdAt = nowIso();
      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
        title: workflow.title,
        status: "completed",
        source: meta.source || "external-trigger",
        inputs: session.inputsByWorkflow[workflow.id],
        intelligence_stamp: {
          refreshed_at: createdAt,
          source: "workflow-auto-run"
        }
      });
      const output = asObject(result?.output || result?.run?.output);
      session.runsByWorkflow[workflow.id].status = "completed";
      session.runsByWorkflow[workflow.id].lastRun = asString(result?.run?.created_at) || createdAt;
      session.runsByWorkflow[workflow.id].runId = asString(result?.run?.id);
      session.runsByWorkflow[workflow.id].output = output;
      session.runsByWorkflow[workflow.id].history.unshift({
        createdAt,
        source: meta.source || "external-trigger",
        output
      });
      session.runsByWorkflow[workflow.id].history = session.runsByWorkflow[workflow.id].history.slice(0, 6);
      await reloadProjectData?.(projectName);
      showMessage?.(`${workflow.title} created from AI Command context.`);
    }

    render();
  });

  workflowBridgeRegistered = true;
}

function bindWorkflowCatalog({
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
  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, deriveInputsFromSources(state), state.data.operations);
  const workflowId = session.selectedWorkflowId;
  const currentRun = session.runsByWorkflow[workflowId];
  const roleRouting = buildRoleAwareRouting(state.data.operations, session.activeRole, getWorkflowDef(workflowId));

  Array.from(document.querySelectorAll("[data-workflow-role]")).forEach((button) => {
    button.onclick = () => {
      session.activeRole = button.getAttribute("data-workflow-role") || session.activeRole;
      showMessage?.(`Workflow routing preview switched to ${titleCase(session.activeRole)}.`);
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-workflow-card]")).forEach((button) => {
    button.onclick = () => {
      session.selectedWorkflowId = button.getAttribute("data-workflow-card") || session.selectedWorkflowId;
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-workflow-run]")).forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      session.selectedWorkflowId = button.getAttribute("data-workflow-run") || session.selectedWorkflowId;
      render();
      const runButton = $("workflowRunBtn");
      if (runButton) runButton.click();
    };
  });

  const form = $("workflowInputForm");
  if (form) {
    form.oninput = (event) => {
      const target = event.target;
      if (!target?.name) return;
      session.inputsByWorkflow[session.selectedWorkflowId][target.name] = target.value || "";
      render();
    };
  }

  const useCampaignBtn = $("workflowUseCampaignBtn");
  if (useCampaignBtn) {
    useCampaignBtn.onclick = () => {
      syncInputsFromSource(session, session.selectedWorkflowId, getState(), "campaign");
      showMessage?.("Campaign Studio draft copied into the workflow inputs.");
      render();
    };
  }

  const useAiBtn = $("workflowUseAiBtn");
  if (useAiBtn) {
    useAiBtn.onclick = () => {
      syncInputsFromSource(session, session.selectedWorkflowId, getState(), "ai");
      showMessage?.("AI Command context copied into the workflow inputs.");
      render();
    };
  }

  const resetBtn = $("workflowResetInputsBtn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      syncInputsFromSource(session, session.selectedWorkflowId, getState(), "defaults");
      showMessage?.("Workflow inputs reset to current project defaults.");
      render();
    };
  }

  const refreshBtn = $("workflowRefreshIntelligenceBtn");
  const doRefresh = async () => {
    session.intelligence.loadedAt = "";
    session.intelligence.status = "idle";
    await ensureWorkflowIntelligenceLoaded({
      projectName,
      session,
      getState,
      reloadProjectData,
      fetchProjectInsights,
      fetchProjectLearning,
      rerender: render
    });
    showMessage?.("Workflow intelligence refreshed.");
  };
  if (refreshBtn) {
    refreshBtn.onclick = doRefresh;
  }
  // also wire the inline ↻ button that avoids duplicate id
  Array.from(document.querySelectorAll("[data-wf-refresh]")).forEach((btn) => {
    btn.onclick = doRefresh;
  });

  const runBtn = $("workflowRunBtn");
  if (runBtn) {
    runBtn.onclick = async () => {
      if (!projectName) {
        showError?.("Select a project before running a workflow.");
        return;
      }

      const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const runState = session.runsByWorkflow[activeWorkflow.id];
      runState.status = "running";
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

        const createdAt = nowIso();

        const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, activeWorkflow.id, {
          title: activeWorkflow.title,
          status: "completed",
          source: "manual-run",
          inputs: session.inputsByWorkflow[activeWorkflow.id],
          route_target: "",
          intelligence_stamp: {
            refreshed_at: createdAt,
            source: "workflow-manual-run"
          }
        });
        const output = asObject(result?.output || result?.run?.output);

        runState.status = "completed";
        runState.lastRun = asString(result?.run?.created_at) || createdAt;
        runState.runId = result?.run?.id || runState.runId || "";
        runState.output = output;
        runState.history.unshift({
          createdAt,
          source: "manual-run",
          output
        });
        runState.history = runState.history.slice(0, 8);
        setSharedHandoff(projectName, "workflows", {
          source_page: "workflows",
          destination_page: "workflows",
          payload: {
            workflow_id: activeWorkflow.id,
            run_id: runState.runId,
            output,
            inputs: session.inputsByWorkflow[activeWorkflow.id],
            createdAt
          },
          status: "available"
        });

        await reloadProjectData?.(projectName);
        showMessage?.(`${activeWorkflow.title} completed.`);
      } catch (error) {
        runState.status = "draft";
        showError?.(error.message || "Workflow execution failed.");
      } finally {
        render();
      }
    };
    const runBtnMain = $("workflowRunBtnMain");
    if (runBtnMain) runBtnMain.onclick = runBtn.onclick;
  }

  Array.from(document.querySelectorAll("[data-workflow-route]")).forEach((button) => {
    button.onclick = () => {
      const route = button.getAttribute("data-workflow-route") || "";
      if (!route) return;
      const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const output = currentRun.output;
      const globalInput = $("quickCommandInput");
      if (globalInput && output) {
        globalInput.value = `${activeWorkflow.title}: ${output.summary}`;
      }
      const handoff = {
        source_page: "workflows",
        destination_page: route,
        source_role: session.activeRole,
        destination_role:
          asString(roleRouting.preferredDomains.find((item) => item.route_target === route)?.owner_role) ||
          asString(asArray(state.data.operations?.team_service_model?.route_permissions).find((item) => asString(item.route) === route)?.roles?.[0]) ||
          "admin",
        linked_entity: {
          entity_type: "workflow_run",
          entity_id: currentRun.runId || ""
        },
        payload: {
          workflow_id: activeWorkflow.id,
          workflow_title: activeWorkflow.title,
          output,
          inputs: session.inputsByWorkflow[activeWorkflow.id]
        }
      };
      setSharedHandoff(projectName, route, handoff);
      createProjectHandoff?.(projectName, handoff).catch((error) => {
        console.warn("Failed to persist workflow handoff:", error.message);
      });
      navigateTo(route);
      showMessage?.(`${activeWorkflow.title} routed to ${titleCase(route)}.`);
    };
  });

  const saveTaskBtn = $("workflowSaveTaskBtn");
  if (saveTaskBtn) {
    saveTaskBtn.onclick = async () => {
      if (!currentRun.output) {
        showError?.("Run the workflow before saving a structured task.");
        return;
      }

      try {
        await createProjectTask?.(projectName, {
          title: `${getWorkflowDef(workflowId).title} • ${session.inputsByWorkflow[workflowId].campaign || projectName || "Project"}`,
          description: currentRun.output.summary || "",
          workflow_id: workflowId,
          source_type: "workflow_run",
          source_id: currentRun.runId || currentRun.lastRun || "",
          owner_role: session.activeRole,
          assignee_role: session.activeRole,
          service_domain:
            getWorkflowDef(workflowId).id === "research-competitors" || getWorkflowDef(workflowId).id === "run-weekly-report"
              ? "research"
              : "campaign",
          route_target: "workflows",
          output: currentRun.output,
          notes: currentRun.output.nextActions || []
        });
        await reloadProjectData?.(projectName);
        showMessage?.("Structured workflow task saved.");
      } catch (error) {
        showError?.(error.message || "Failed to save workflow task.");
      } finally {
        render();
      }
    };
  }

  const pushPromptToAiCommand = ({
    activeWorkflow,
    prompt,
    modeId,
    responseTitle,
    output
  }) => {
    const aiDraft = {
      projectName,
      modeId,
      lastCommand: prompt,
      lastResponseTitle: responseTitle,
      routeSuggestions: []
    };
    setSharedAiDraft(projectName, aiDraft);
    setSharedHandoff(projectName, "ai-command", {
      source_page: "workflows",
      destination_page: "ai-command",
      linked_entity: {
        entity_type: "workflow_run",
        entity_id: currentRun.runId || ""
      },
      payload: {
        prompt,
        workflow_id: activeWorkflow.id,
        workflow_title: activeWorkflow.title,
        draft_context: aiDraft,
        output
      }
    });
    createProjectHandoff?.(projectName, {
      source_page: "workflows",
      destination_page: "ai-command",
      linked_entity: {
        entity_type: "workflow_run",
        entity_id: currentRun.runId || ""
      },
      payload: {
        prompt,
        workflow_id: activeWorkflow.id,
        workflow_title: activeWorkflow.title,
        draft_context: aiDraft,
        output
      }
    }).catch((error) => {
      console.warn("Failed to persist workflow-to-AI handoff:", error.message);
    });
    navigateTo("ai-command");
    const globalInput = $("quickCommandInput");
    if (globalInput) {
      globalInput.value = prompt;
    }
  };

  const handlePushToAi = async () => {
    const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
    const inputs = session.inputsByWorkflow[activeWorkflow.id];
    const output = session.runsByWorkflow[activeWorkflow.id].output;
    const prompt = output
      ? `Refine this ${activeWorkflow.title.toLowerCase()} output for ${inputs.campaign || projectName || "this project"}.\n\nSummary: ${output.summary}\n\nNext actions: ${(output.nextActions || []).join("; ")}`
      : `Build a sharper ${activeWorkflow.title.toLowerCase()} for ${inputs.campaign || projectName || "this project"} using product ${inputs.product || "to be defined"}, audience ${inputs.audience || "to be defined"}, channels ${inputs.channels || "to be defined"}, goal ${inputs.goal || "to be defined"}, timeframe ${inputs.timeframe || "to be defined"}, budget ${inputs.budget || "to be defined"}, and notes ${inputs.notes || "none"}.`;

    pushPromptToAiCommand({
      activeWorkflow,
      prompt,
      modeId: activeWorkflow.aiModeId,
      responseTitle: output?.title || activeWorkflow.title,
      output
    });
    showMessage?.("Workflow context pushed to AI Command.");
  };

  const recommendBtn = $("workflowRecommendBtn");
  if (recommendBtn) {
    recommendBtn.onclick = () => {
      const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const inputs = session.inputsByWorkflow[activeWorkflow.id];
      const workflowSummary = WORKFLOW_CATALOG.map((item) => `- ${item.title}: ${item.description}`).join("\n");
      const prompt = [
        "Recommend the best workflow to run now and explain why.",
        `Project: ${projectName || "unknown"}`,
        `Campaign: ${inputs.campaign || "not provided"}`,
        `Goal: ${inputs.goal || "not provided"}`,
        `Audience: ${inputs.audience || "not provided"}`,
        `Channels: ${inputs.channels || "not provided"}`,
        "",
        "Available workflows:",
        workflowSummary,
        "",
        "Return: recommended workflow, reasoning, required inputs still missing, and immediate next step."
      ].join("\n");

      pushPromptToAiCommand({
        activeWorkflow,
        prompt,
        modeId: "operations",
        responseTitle: "Workflow Recommendation",
        output: session.runsByWorkflow[activeWorkflow.id].output
      });
      showMessage?.("Workflow recommendation prompt sent to AI Command.");
    };
  }

  const customBtn = $("workflowBuildCustomBtn");
  if (customBtn) {
    customBtn.onclick = () => {
      const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const inputs = session.inputsByWorkflow[activeWorkflow.id];
      const prompt = [
        "Build a custom business workflow automation blueprint.",
        `Project: ${projectName || "unknown"}`,
        `Campaign: ${inputs.campaign || "not provided"}`,
        `Product: ${inputs.product || "not provided"}`,
        `Audience: ${inputs.audience || "not provided"}`,
        `Goal: ${inputs.goal || "not provided"}`,
        `Channels: ${inputs.channels || "not provided"}`,
        `Timeframe: ${inputs.timeframe || "not provided"}`,
        `Budget: ${inputs.budget || "not provided"}`,
        `Notes: ${inputs.notes || "none"}`,
        "",
        "Return: workflow name, purpose, required inputs, 5-8 ordered execution steps, output package, handoff targets, and KPI checks."
      ].join("\n");

      pushPromptToAiCommand({
        activeWorkflow,
        prompt,
        modeId: "operations",
        responseTitle: "Custom Workflow Builder",
        output: session.runsByWorkflow[activeWorkflow.id].output
      });
      showMessage?.("Custom workflow builder prompt sent to AI Command.");
    };
  }

  const pushAiBtn = $("workflowPushAiBtn");
  if (pushAiBtn) {
    pushAiBtn.onclick = handlePushToAi;
  }

  const pushAiSecondaryBtn = $("workflowPushAiBtnSecondary");
  if (pushAiSecondaryBtn) {
    pushAiSecondaryBtn.onclick = handlePushToAi;
  }
}

export const workflowsRoute = {
  id: "workflows",
  meta: {
    eyebrow: "AI & Build",
    title: "Workflows",
    description: "Run structured, repeatable workflows for common marketing and execution operations."
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
    showMessage,
    showError,
    reloadProjectData,
    fetchProjectInsights,
    fetchProjectLearning,
    runProjectWorkflow,
    runProjectAiWorkflow,
    createProjectTask,
    createProjectHandoff,
    consumeProjectHandoff
  }) {
    const render = () => {
      const state = getState();
      const projectName = state.context.currentProject || "";
      const session = ensureSession(projectName, deriveInputsFromSources(state), state.data.operations);
      applyDurableWorkflowHandoff({
        projectName,
        session,
        operations: state.data.operations,
        consumeProjectHandoff,
        showMessage
      });
      const selectedWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const currentInputs = session.inputsByWorkflow[selectedWorkflow.id];
      const currentRun = session.runsByWorkflow[selectedWorkflow.id];
      const workflowContext = buildWorkflowContext(state, session);
      const roleRouting = buildRoleAwareRouting(state.data.operations, session.activeRole, selectedWorkflow);
      const overviewCounts = buildWorkflowOverviewCounts(session, workflowContext);
      const runningWorkflowRows = buildRunningWorkflowRows(session, workflowContext);
      const campaignDraft = getCampaignDraft(projectName, state.data.operations);
      const aiDraft = getAiDraft(projectName, state.data.operations);
      const root = $("workflowsRoot");
      if (!root) return;

      registerWorkflowHook({
        getState,
        $,
        escapeHtml,
        navigateTo,
        showMessage,
        showError,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        runProjectWorkflow,
        runProjectAiWorkflow,
        createProjectHandoff,
        render
      });

      ensureWorkflowIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        rerender: render
      });

      // ── derived helpers ────────────────────────────────────────────────────
      const inputsReady = selectedWorkflow.requiredInputs.every((key) =>
        asString(currentInputs[key.toLowerCase()]).trim()
      );
      const hasOutput   = Boolean(currentRun.output?.summary);
      const isRunning   = normalizeWorkflowStatus(currentRun.status) === "running";
      const runBtnLabel = isRunning ? "Running…" : "Run Workflow";
      const intelStatus = session.intelligence.status;

      const intelBadge = intelStatus === "ready"
        ? `<span class="card-badge success">Intelligence live</span>`
        : intelStatus === "loading"
          ? `<span class="card-badge warning">Loading…</span>`
          : intelStatus === "error"
            ? `<span class="card-badge danger">Intelligence limited</span>`
            : `<span class="card-badge neutral">Not loaded</span>`;

      root.innerHTML = `
        <div class="wf-shell">

          <!-- ① PAGE HEADER -->
          <header class="wf-header">
            <div class="wf-header-left">
              <p class="wf-header-eyebrow">Workflow Automation</p>
              <h2 class="wf-header-title">Run a structured workflow to turn context into execution.</h2>
            </div>
            <div class="wf-header-right">
              ${intelBadge}
              <button id="workflowRunBtn" class="btn btn-primary wf-run-btn" type="button"
                ${isRunning ? "disabled" : ""}>
                ${escapeHtml(runBtnLabel)}
              </button>
            </div>
          </header>

          <!-- ② STATUS STRIP -->
          <div class="wf-status-strip">
            <div class="wf-status-pill">
              <span class="wf-status-label">Selected</span>
              <strong class="wf-status-value">${escapeHtml(selectedWorkflow.title)}</strong>
            </div>
            <div class="wf-status-pill">
              <span class="wf-status-label">Status</span>
              <strong class="wf-status-value">
                <span class="card-badge ${statusTone(currentRun.status)}">${escapeHtml(titleCase(normalizeWorkflowStatus(currentRun.status)))}</span>
              </strong>
            </div>
            <div class="wf-status-pill">
              <span class="wf-status-label">Inputs ready</span>
              <strong class="wf-status-value">${inputsReady ? "✓ All filled" : "Incomplete"}</strong>
            </div>
            <div class="wf-status-pill">
              <span class="wf-status-label">Completed runs</span>
              <strong class="wf-status-value">${escapeHtml(String(overviewCounts.completed))}</strong>
            </div>
            ${overviewCounts.running ? `
            <div class="wf-status-pill is-warning">
              <span class="wf-status-label">Active</span>
              <strong class="wf-status-value">${escapeHtml(String(overviewCounts.running))} running</strong>
            </div>` : ""}
            ${overviewCounts.failed ? `
            <div class="wf-status-pill is-danger">
              <span class="wf-status-label">Failed</span>
              <strong class="wf-status-value">${escapeHtml(String(overviewCounts.failed))}</strong>
            </div>` : ""}
          </div>

          <!-- ③ MAIN BODY -->
          <div class="wf-body">

            <!-- LEFT: workflow picker -->
            <nav class="wf-catalog" aria-label="Workflow catalog">
              <p class="wf-section-label">Choose workflow</p>
              ${WORKFLOW_CATALOG.map((workflow) => {
                const run  = session.runsByWorkflow[workflow.id];
                const tone = statusTone(run.status);
                const active = workflow.id === selectedWorkflow.id;
                return `
                  <button class="wf-pick-card${active ? " is-active" : ""}" type="button"
                    data-workflow-card="${escapeHtml(workflow.id)}">
                    <div class="wf-pick-top">
                      <span class="wf-pick-name">${escapeHtml(workflow.title)}</span>
                      <span class="card-badge ${tone}">${escapeHtml(titleCase(normalizeWorkflowStatus(run.status)))}</span>
                    </div>
                    <p class="wf-pick-desc">${escapeHtml(workflow.description)}</p>
                    ${active ? `<div class="wf-pick-active-bar"></div>` : ""}
                  </button>
                `;
              }).join("")}
            </nav>

            <!-- CENTER: workspace -->
            <div class="wf-workspace">

              <!-- STEP 1: Review the workflow -->
              <div class="card wf-step-card">
                <div class="card-head">
                  <div>
                    <p class="wf-step-label">Step 1 of 3</p>
                    <h3>${escapeHtml(selectedWorkflow.title)}</h3>
                    <p class="wf-step-purpose">${escapeHtml(selectedWorkflow.description)}</p>
                  </div>
                  <span class="card-badge ${statusTone(currentRun.status)}">${escapeHtml(titleCase(normalizeWorkflowStatus(currentRun.status)))}</span>
                </div>
                <div class="wf-what-you-get">
                  <div class="wf-what-block">
                    <p class="wf-section-label">You need to provide</p>
                    <div class="wf-tag-row">
                      ${selectedWorkflow.requiredInputs.map((inp) => `
                        <span class="wf-tag ${asString(currentInputs[inp.toLowerCase()]).trim() ? "is-filled" : ""}">${escapeHtml(inp)}</span>
                      `).join("")}
                    </div>
                  </div>
                  <div class="wf-what-block">
                    <p class="wf-section-label">You will receive</p>
                    <p class="wf-output-desc">${escapeHtml(selectedWorkflow.expectedOutput)}</p>
                  </div>
                </div>
              </div>

              <!-- STEP 2: Inputs -->
              <div class="card wf-step-card">
                <div class="card-head">
                  <div>
                    <p class="wf-step-label">Step 2 of 3</p>
                    <h3>Fill Inputs</h3>
                  </div>
                  <div class="wf-import-row">
                    <button id="workflowUseCampaignBtn" class="btn btn-secondary"
                      type="button" title="Copy inputs from Campaign Studio draft">
                      ${escapeHtml(campaignDraft.campaignName ? "↙ Campaign Studio" : "Campaign Studio")}
                    </button>
                    <button id="workflowUseAiBtn" class="btn btn-secondary"
                      type="button" title="Copy context from last AI Command session">
                      ${escapeHtml(aiDraft.lastCommand ? "↙ AI Command" : "AI Command")}
                    </button>
                    <button id="workflowResetInputsBtn" class="btn btn-ghost"
                      type="button">Reset</button>
                    <button class="btn btn-ghost"
                      type="button" data-wf-refresh>↻ Intelligence</button>
                  </div>
                </div>
                ${session.intelligence.error
                  ? `<div class="empty-box" style="margin-bottom:12px;">${escapeHtml(session.intelligence.error)}</div>`
                  : ""}
                <form id="workflowInputForm" class="setup-form-grid setup-form-grid-2">
                  ${renderField({
                    name: "campaign",
                    label: "Campaign",
                    value: currentInputs.campaign,
                    helper: "Campaign name or launch label.",
                    placeholder: "Spring launch wave 1",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "product",
                    label: "Product",
                    value: currentInputs.product,
                    helper: "Primary product or offer family.",
                    placeholder: "Hero product or bundle",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "audience",
                    label: "Audience",
                    value: currentInputs.audience,
                    helper: "Who this workflow optimises for.",
                    placeholder: "Primary audience segment",
                    escapeHtml,
                    multiline: true
                  })}
                  ${renderField({
                    name: "channels",
                    label: "Channels",
                    value: currentInputs.channels,
                    helper: "Comma-separated channels in scope.",
                    placeholder: "instagram, email, website",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "goal",
                    label: "Goal",
                    value: currentInputs.goal,
                    helper: "Outcome the workflow should target.",
                    placeholder: "Launch, growth, retention",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "timeframe",
                    label: "Timeframe",
                    value: currentInputs.timeframe,
                    helper: "Planning or reporting window.",
                    placeholder: "Next 14 days",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "budget",
                    label: "Budget",
                    value: currentInputs.budget,
                    helper: "Working budget if allocation matters.",
                    placeholder: "5000",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "notes",
                    label: "Notes",
                    value: currentInputs.notes,
                    helper: "Constraints, priorities, or direction.",
                    placeholder: "Optional — anything the AI should know",
                    escapeHtml,
                    multiline: true,
                    rows: 3
                  })}
                </form>
                <div class="wf-run-prompt">
                  <button id="workflowRunBtnMain" class="btn btn-primary wf-run-btn-lg" type="button"
                    ${isRunning ? "disabled" : ""}>
                    ${escapeHtml(runBtnLabel)}
                  </button>
                  <p class="wf-run-hint">
                    Inputs auto-save. Run builds a structured output from your project context, intelligence, and these fields.
                  </p>
                </div>
              </div>

              <!-- STEP 3: Output -->
              <div class="card wf-step-card">
                <div class="card-head">
                  <div>
                    <p class="wf-step-label">Step 3 of 3</p>
                    <h3>Output &amp; Next Action</h3>
                  </div>
                  ${hasOutput ? `<span class="card-badge success">Ready to route</span>` : `<span class="card-badge neutral">Waiting for run</span>`}
                </div>

                ${isRunning ? `
                  <div class="wf-running-state">
                    <div class="loading-spinner"></div>
                    <p>Collecting inputs, loading intelligence, and generating structured output…</p>
                  </div>
                ` : hasOutput ? `
                  <!-- output summary -->
                  <div class="wf-output-summary">
                    <p class="wf-output-text">${escapeHtml(currentRun.output.summary)}</p>
                  </div>
                  <div class="wf-output-grid">
                    ${renderOutputBlock("Key Decisions",   currentRun.output.keyDecisions,   escapeHtml, "None generated.")}
                    ${renderOutputBlock("Execution Plan",  currentRun.output.executionPlan,  escapeHtml, "None generated.")}
                    ${renderOutputBlock("Required Assets", currentRun.output.requiredAssets, escapeHtml, "None identified.")}
                    ${renderOutputBlock("Suggested Channels", currentRun.output.suggestedChannels, escapeHtml, "None suggested.")}
                    ${renderOutputBlock("Risks / Blockers",   currentRun.output.risks,       escapeHtml, "No blockers detected.")}
                    ${renderOutputBlock("Next Actions",    currentRun.output.nextActions,    escapeHtml, "None generated.")}
                  </div>

                  <!-- ④ NEXT ACTION — route or save -->
                  <div class="wf-next-action">
                    <p class="wf-section-label">👉 Where should this output go?</p>
                    <p class="wf-next-hint">Route it into the workspace that picks up from here, or save as a task for later follow-through.</p>
                    <div class="wf-route-grid">
                      ${roleRouting.targets.map((target) => `
                        <button class="wf-route-btn" type="button" data-workflow-route="${escapeHtml(target.id)}">
                          ${escapeHtml(target.label.replace(/^Send to /, ""))}
                          <span class="wf-route-arrow">→</span>
                        </button>
                      `).join("")}
                      <button id="workflowSaveTaskBtn" class="wf-route-btn is-save" type="button">
                        Save as Task <span class="wf-route-arrow">↓</span>
                      </button>
                      <button id="workflowPushAiBtn" class="wf-route-btn is-ai" type="button">
                        Refine in AI Command <span class="wf-route-arrow">→</span>
                      </button>
                    </div>
                  </div>

                  <!-- history -->
                  ${currentRun.history.length > 1 ? `
                    <details class="wf-history">
                      <summary class="wf-history-toggle">Previous runs (${escapeHtml(String(currentRun.history.length))})</summary>
                      <div class="wf-history-list">
                        ${currentRun.history.slice(1, 6).map((item) => `
                          <div class="wf-history-row">
                            <span class="wf-history-time">${escapeHtml(formatDateTime(item.createdAt))}</span>
                            <span class="wf-history-summary">${escapeHtml(item.output?.summary || "Structured output saved.")}</span>
                          </div>
                        `).join("")}
                      </div>
                    </details>
                  ` : ""}
                ` : `
                  <div class="wf-empty-output">
                    <p>Complete the inputs above, then hit <strong>Run Workflow</strong> to generate your structured output.</p>
                    <button class="btn btn-primary wf-run-btn" type="button"
                      data-workflow-run="${escapeHtml(selectedWorkflow.id)}">
                      Run Workflow
                    </button>
                  </div>
                `}
              </div>

            </div><!-- /wf-workspace -->

            <!-- RIGHT: AI sidebar -->
            <aside class="wf-ai-side">
              <div class="card">
                <div class="card-head">
                  <h3>AI Assistant</h3>
                  <span class="card-badge neutral">This page</span>
                </div>
                <p class="wf-side-copy">Not sure which workflow to run? Let AI recommend one or build a custom blueprint.</p>
                <div class="wf-ai-actions">
                  <button id="workflowRecommendBtn" class="quick-action-btn" type="button">
                    <span class="home-action-title">Recommend a Workflow</span>
                    <span class="home-action-meta">AI picks the highest-impact workflow for right now and explains why.</span>
                  </button>
                  <button id="workflowBuildCustomBtn" class="quick-action-btn" type="button">
                    <span class="home-action-title">Build Custom Workflow</span>
                    <span class="home-action-meta">Generate a bespoke workflow with steps, handoffs, and KPI checks.</span>
                  </button>
                  <button id="workflowPushAiBtnSecondary" class="quick-action-btn" type="button">
                    <span class="home-action-title">Refine Current in AI</span>
                    <span class="home-action-meta">Push current workflow context to AI Command for deeper refinement.</span>
                  </button>
                </div>
              </div>

              <!-- intelligence status -->
              <div class="card">
                <div class="card-head">
                  <h3>Intelligence</h3>
                  ${intelBadge}
                </div>
                <div class="wf-intel-rows">
                  <div class="wf-intel-row">
                    <span>Campaign draft</span>
                    <span class="card-badge ${campaignDraft.campaignName ? "success" : "neutral"}">${escapeHtml(campaignDraft.campaignName ? "Available" : "Not set")}</span>
                  </div>
                  <div class="wf-intel-row">
                    <span>AI context</span>
                    <span class="card-badge ${aiDraft.lastCommand ? "success" : "neutral"}">${escapeHtml(aiDraft.lastCommand ? "Available" : "Not set")}</span>
                  </div>
                  <div class="wf-intel-row">
                    <span>Live signals</span>
                    <span class="card-badge ${workflowContext.hasLiveIntelligence ? "success" : "neutral"}">${escapeHtml(workflowContext.hasLiveIntelligence ? "Live" : "Fallback")}</span>
                  </div>
                  ${workflowContext.connectedChannels.length ? `
                  <div class="wf-intel-row">
                    <span>Connected channels</span>
                    <span>${escapeHtml(workflowContext.connectedChannels.join(", "))}</span>
                  </div>` : ""}
                  ${workflowContext.missingIntegrations.length ? `
                  <div class="wf-intel-row is-warning">
                    <span>Missing integrations</span>
                    <span>${escapeHtml(workflowContext.missingIntegrations.slice(0, 3).join(", "))}</span>
                  </div>` : ""}
                </div>
                <button id="workflowRefreshIntelligenceBtn" class="btn btn-ghost" type="button"
                  style="margin-top:8px;width:100%;">↻ Refresh intelligence</button>
              </div>

              <!-- flow guide -->
              <div class="card">
                <div class="card-head">
                  <h3>You are here</h3>
                </div>
                <div class="wf-flow-guide">
                  <div class="wf-flow-step is-done">Setup</div>
                  <div class="wf-flow-arrow">→</div>
                  <div class="wf-flow-step is-done">Campaign Studio</div>
                  <div class="wf-flow-arrow">→</div>
                  <div class="wf-flow-step is-current">Workflows</div>
                  <div class="wf-flow-arrow">→</div>
                  <div class="wf-flow-step">Content / Media / Publishing / Ads</div>
                </div>
              </div>
            </aside>

          </div><!-- /wf-body -->
        </div><!-- /wf-shell -->
      `;

      bindWorkflowCatalog({
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
      });
    };

    render();
  }
};
