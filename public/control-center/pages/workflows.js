import {
  getSharedAiDraft,
  getSharedCampaignRecord,
  getSharedHandoff,
  setSharedAiDraft,
  setSharedHandoff
} from "../shared-context.js";

const WORKFLOW_CATALOG = [
  {
    id: "launch-new-campaign",
    title: "Launch New Campaign",
    description: "Turn campaign structure, current readiness, and system intelligence into a go-live operating plan.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Timeframe", "Budget"],
    expectedOutput: "Launch summary, execution plan, required assets, blockers, and next actions.",
    aiModeId: "operations"
  },
  {
    id: "build-content-plan",
    title: "Build Content Plan",
    description: "Generate a content operating plan using current campaign context, winning patterns, and weak-signal avoidance.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Timeframe", "Notes"],
    expectedOutput: "Content plan, channel priorities, asset needs, risks, and production next actions.",
    aiModeId: "content"
  },
  {
    id: "generate-ad-strategy",
    title: "Generate Ad Strategy",
    description: "Create a paid campaign operating view using offer context, connected channels, and paid performance signals.",
    requiredInputs: ["Campaign", "Product", "Audience", "Channels", "Goal", "Budget", "Notes"],
    expectedOutput: "Ad strategy, suggested channels, creative needs, blockers, and next actions.",
    aiModeId: "ads"
  },
  {
    id: "seo-optimization-plan",
    title: "SEO Optimization Plan",
    description: "Translate website and search intelligence into an execution-first optimization plan.",
    requiredInputs: ["Product", "Audience", "Goal", "Timeframe", "Notes"],
    expectedOutput: "SEO summary, optimization plan, required support assets, risks, and next actions.",
    aiModeId: "seo"
  },
  {
    id: "competitor-research",
    title: "Competitor Research",
    description: "Create a focused research workflow around market context, positioning gaps, and missing intelligence.",
    requiredInputs: ["Product", "Audience", "Goal", "Channels", "Notes"],
    expectedOutput: "Research summary, key comparison angles, risks, and follow-up next actions.",
    aiModeId: "research"
  },
  {
    id: "weekly-performance-report",
    title: "Weekly Performance Report",
    description: "Package the current operating picture into a clear report with decisions, blockers, and next actions.",
    requiredInputs: ["Campaign", "Channels", "Goal", "Timeframe", "Notes"],
    expectedOutput: "Weekly summary, key decisions, risks, suggested channels, and next actions.",
    aiModeId: "executive"
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

  if (workflowId === "seo-optimization-plan") {
    return uniqueStrings(["SEO", "Website", "Blog", ...fromInputs, ...fromConnected]).slice(0, 5);
  }

  if (workflowId === "generate-ad-strategy") {
    return uniqueStrings(["Meta", "Google Ads", "TikTok", ...fromInputs, ...fromConnected]).slice(0, 5);
  }

  return uniqueStrings([...fromInputs, ...fromTopContent, ...fromConnected, "Email"]).slice(0, 5);
}

function buildWorkflowOutput(workflow, inputs, context) {
  const suggestedChannels = deriveSuggestedChannels(inputs, context, workflow.id);
  const topRecommendation = context.recommendations[0];
  const topContentSignal = context.topContent[0];
  const weakContentSignal = context.weakContent[0];
  const seoOp = asArray(context.seo.opportunities || context.seo.recommendations)[0];
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
    workflow.id === "launch-new-campaign" ? "Launch brief" : "",
    workflow.id === "build-content-plan" ? "Content brief" : "",
    workflow.id === "generate-ad-strategy" ? "Ad creative set" : "",
    workflow.id === "seo-optimization-plan" ? "Landing page copy" : "",
    workflow.id === "weekly-performance-report" ? "Performance snapshot" : ""
  ]).filter(Boolean);

  let summary = "";
  let keyDecisions = [];
  let executionPlan = [];
  let nextActions = [];

  if (workflow.id === "launch-new-campaign") {
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
  } else if (workflow.id === "build-content-plan") {
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
  } else if (workflow.id === "generate-ad-strategy") {
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
  } else if (workflow.id === "seo-optimization-plan") {
    summary = `Build an SEO optimization plan for ${inputs.product || context.overview.project_name || "the project"} using current website and search intelligence.${seoOp ? ` Priority opportunity: ${typeof seoOp === "string" ? seoOp : firstNonEmpty(seoOp.query, seoOp.page, seoOp.title, seoOp.label)}.` : ""}`;
    keyDecisions = uniqueStrings([
      inputs.goal ? `Optimize toward ${inputs.goal}.` : "Clarify the business goal behind the SEO work.",
      suggestedChannels[0] ? `Use ${suggestedChannels[0]} as the lead support lane.` : "",
      context.website ? "Use website and search signals together for prioritization." : "Website and search data are still partial."
    ]);
    executionPlan = [
      "Prioritize query, page, or CTR opportunities.",
      "Align landing copy, metadata, and support content with campaign intent.",
      "Package related content and website tasks.",
      "Route support work into Content Studio and Publishing."
    ];
    nextActions = uniqueStrings([
      "Send supporting work to Content Studio.",
      "Review website and tracking blockers.",
      topRecommendation?.action || "Connect search intelligence for sharper prioritization."
    ]);
  } else if (workflow.id === "competitor-research") {
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
  } else {
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
      selectedWorkflow.id === "competitor-research"
        ? "Research work should usually route through Analyst or Strategist ownership first."
        : selectedWorkflow.id === "generate-ad-strategy"
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
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
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
  }

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
            getWorkflowDef(workflowId).id === "competitor-research" || getWorkflowDef(workflowId).id === "weekly-performance-report"
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

  const pushAiBtn = $("workflowPushAiBtn");
  if (pushAiBtn) {
    pushAiBtn.onclick = async () => {
      const activeWorkflow = getWorkflowDef(session.selectedWorkflowId);
      const inputs = session.inputsByWorkflow[activeWorkflow.id];
      const output = session.runsByWorkflow[activeWorkflow.id].output;
      const prompt = output
        ? `Refine this ${activeWorkflow.title.toLowerCase()} output for ${inputs.campaign || projectName || "this project"}.\n\nSummary: ${output.summary}\n\nNext actions: ${output.nextActions.join("; ")}`
        : `Build a sharper ${activeWorkflow.title.toLowerCase()} for ${inputs.campaign || projectName || "this project"} using product ${inputs.product || "to be defined"}, audience ${inputs.audience || "to be defined"}, channels ${inputs.channels || "to be defined"}, goal ${inputs.goal || "to be defined"}, timeframe ${inputs.timeframe || "to be defined"}, budget ${inputs.budget || "to be defined"}, and notes ${inputs.notes || "none"}.`;
      const aiDraft = {
        projectName,
        modeId: activeWorkflow.aiModeId,
        lastCommand: prompt,
        lastResponseTitle: output?.title || activeWorkflow.title,
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
      showMessage?.("Workflow context pushed to AI Command.");
    };
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
      const summary = buildContextSummary(state);
      const workflowContext = buildWorkflowContext(state, session);
      const roleRouting = buildRoleAwareRouting(state.data.operations, session.activeRole, selectedWorkflow);
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

      const intelligenceLabel =
        session.intelligence.status === "loading"
          ? "Refreshing intelligence"
          : session.intelligence.status === "ready"
            ? "Live intelligence loaded"
            : session.intelligence.status === "error"
              ? "Intelligence limited"
              : "Waiting for intelligence";

      root.innerHTML = `
        <div class="workflows-wrapper">
          <div class="workflows-hero">
            <div class="workflows-hero-copy">
              <div class="setup-kicker">Workflow Catalog</div>
              <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Workflows` : "Workflows")}</h3>
              <p class="setup-hero-text">
                Keep the stable workflow catalog as the entry point, then layer in structured inputs, execution, outputs, and routing so each workflow can move from planning into action.
              </p>
              <div class="workflows-status">
                <div class="setup-status-chip">
                  <span>Project</span>
                  <strong>${escapeHtml(summary.project)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Campaign</span>
                  <strong>${escapeHtml(summary.campaign)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Intelligence</span>
                  <strong>${escapeHtml(intelligenceLabel)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Selected workflow</span>
                  <strong>${escapeHtml(selectedWorkflow.title)}</strong>
                </div>
              </div>
            </div>
            <div class="setup-hero-actions">
              <button id="workflowRefreshIntelligenceBtn" class="btn btn-secondary" type="button">Refresh Intelligence</button>
              <button id="workflowPushAiBtn" class="btn btn-secondary" type="button">Push to AI Command</button>
              <button id="workflowRunBtn" class="btn btn-primary" type="button">${escapeHtml(currentRun.status === "running" ? "Running..." : "Run Workflow")}</button>
            </div>
          </div>

          <div class="workflows-layout">
            <section class="workflows-catalog">
              <div class="card">
                <div class="card-head">
                  <h3>Workflow Catalog</h3>
                  <span class="card-badge neutral">${escapeHtml(`${WORKFLOW_CATALOG.length} workflows`)}</span>
                </div>
                <div class="workflows-card-list">
                  ${WORKFLOW_CATALOG.map((workflow) => {
                    const run = session.runsByWorkflow[workflow.id];
                    const preview = run.output?.summary || workflow.description;
                    return `
                      <button class="workflow-card${workflow.id === selectedWorkflow.id ? " is-active" : ""}" type="button" data-workflow-card="${escapeHtml(workflow.id)}">
                        <div class="workflow-card-head">
                          <strong>${escapeHtml(workflow.title)}</strong>
                          <span class="card-badge ${run.status === "completed" ? "success" : run.status === "running" ? "warning" : "neutral"}">${escapeHtml(titleCase(run.status))}</span>
                        </div>
                        <p>${escapeHtml(preview)}</p>
                        <div class="workflow-card-section">
                          <span class="workflow-card-label">Required Inputs</span>
                          <div class="workflow-card-copy">${escapeHtml(workflow.requiredInputs.join(", "))}</div>
                        </div>
                        <div class="workflow-card-section">
                          <span class="workflow-card-label">Expected Output</span>
                          <div class="workflow-card-copy">${escapeHtml(workflow.expectedOutput)}</div>
                        </div>
                        <div class="workflow-card-actions">
                          <button class="btn btn-secondary" type="button" data-workflow-run="${escapeHtml(workflow.id)}">Run Workflow</button>
                        </div>
                      </button>
                    `;
                  }).join("")}
                </div>
              </div>
            </section>

            <section class="workflows-main">
              <div class="card">
                <div class="card-head">
                  <h3>Workflow Input System</h3>
                  <span class="card-badge neutral">Step 1</span>
                </div>
                <div class="insights-section-copy">
                  Inputs can come from Campaign Studio, AI Command, or manual entry. The page keeps the fallback path simple so workflows stay usable even when some intelligence is missing.
                </div>
                <div class="workflow-source-strip">
                  <div class="workflow-source-item">
                    <span>Campaign Studio draft</span>
                    <strong>${escapeHtml(campaignDraft.campaignName ? "Available" : "Not loaded")}</strong>
                  </div>
                  <div class="workflow-source-item">
                    <span>AI Command context</span>
                    <strong>${escapeHtml(aiDraft.lastCommand ? "Available" : "Not loaded")}</strong>
                  </div>
                  <div class="workflow-source-item">
                    <span>Project intelligence</span>
                    <strong>${escapeHtml(workflowContext.hasLiveIntelligence ? "Live" : "Fallback")}</strong>
                  </div>
                </div>
                <div class="workflow-input-actions">
                  <button id="workflowUseCampaignBtn" class="btn btn-secondary" type="button">Use Campaign Studio Inputs</button>
                  <button id="workflowUseAiBtn" class="btn btn-secondary" type="button">Use AI Command Context</button>
                  <button id="workflowResetInputsBtn" class="btn btn-secondary" type="button">Reset to Project Defaults</button>
                </div>
                <form id="workflowInputForm" class="setup-form-grid setup-form-grid-2">
                  ${renderField({
                    name: "campaign",
                    label: "Campaign",
                    value: currentInputs.campaign,
                    helper: "Campaign name or launch label this workflow should operate against.",
                    placeholder: "Spring launch wave 1",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "product",
                    label: "Product",
                    value: currentInputs.product,
                    helper: "Primary product, offer family, or focus area.",
                    placeholder: "Hero product or bundle",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "audience",
                    label: "Audience",
                    value: currentInputs.audience,
                    helper: "The main audience this workflow should optimize for.",
                    placeholder: "Primary audience",
                    escapeHtml,
                    multiline: true
                  })}
                  ${renderField({
                    name: "channels",
                    label: "Channels",
                    value: currentInputs.channels,
                    helper: "Comma-separated channels or destinations in scope.",
                    placeholder: "instagram, email, website",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "goal",
                    label: "Goal",
                    value: currentInputs.goal,
                    helper: "Business or execution outcome the workflow should target.",
                    placeholder: "Launch, growth, retention, traffic",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "timeframe",
                    label: "Timeframe",
                    value: currentInputs.timeframe,
                    helper: "Launch window, reporting window, or planning range.",
                    placeholder: "Next 14 days",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "budget",
                    label: "Budget",
                    value: currentInputs.budget,
                    helper: "Working budget number if allocation matters.",
                    placeholder: "5000",
                    escapeHtml
                  })}
                  ${renderField({
                    name: "notes",
                    label: "Optional notes",
                    value: currentInputs.notes,
                    helper: "Any user instruction, AI hint, or execution caveat.",
                    placeholder: "Constraints, priorities, or direction",
                    escapeHtml,
                    multiline: true,
                    rows: 4
                  })}
                </form>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Structured Output</h3>
                  <span class="card-badge ${currentRun.status === "completed" ? "success" : currentRun.status === "running" ? "warning" : "neutral"}">${escapeHtml(titleCase(currentRun.status))}</span>
                </div>
                ${
                  session.intelligence.error
                    ? `<div class="empty-box">${escapeHtml(`Intelligence warning: ${session.intelligence.error}`)}</div>`
                    : ""
                }
                ${
                  currentRun.status === "running"
                    ? `<div class="workflow-loading">Collecting inputs, loading dashboard, insights, learning, and generating a structured workflow output.</div>`
                    : currentRun.output
                      ? `
                        <div class="ai-response-grid">
                          <div class="ai-output-card ai-output-span">
                            <span class="ai-output-label">Summary</span>
                            <strong>${escapeHtml(selectedWorkflow.title)}</strong>
                            <p>${escapeHtml(currentRun.output.summary)}</p>
                          </div>
                          ${renderOutputBlock("Key Decisions", currentRun.output.keyDecisions, escapeHtml, "No decisions generated yet.")}
                          ${renderOutputBlock("Execution Plan", currentRun.output.executionPlan, escapeHtml, "No execution plan generated yet.")}
                          ${renderOutputBlock("Required Assets", currentRun.output.requiredAssets, escapeHtml, "No required assets identified yet.")}
                          ${renderOutputBlock("Suggested Channels", currentRun.output.suggestedChannels, escapeHtml, "No channels suggested yet.")}
                          ${renderOutputBlock("Risks / Blockers", currentRun.output.risks, escapeHtml, "No blockers detected.")}
                          ${renderOutputBlock("Next Actions", currentRun.output.nextActions, escapeHtml, "No next actions generated yet.")}
                        </div>
                      `
                      : `<div class="empty-box">Run the selected workflow to generate a structured output using project context, insights, learning, and current recommendations.</div>`
                }
              </div>
            </section>

            <aside class="workflows-side">
              ${renderTeamOpsCard(state.data.operations, session.activeRole, roleRouting, escapeHtml)}

              <div class="card">
                <div class="card-head">
                  <h3>Execution Routing</h3>
                  <span class="card-badge neutral">Step 2</span>
                </div>
                <div class="workflow-routing-list">
                  ${roleRouting.targets.map((target) => `
                    <button class="quick-action-btn" type="button" data-workflow-route="${escapeHtml(target.id)}">
                      <span class="home-action-title">${escapeHtml(target.label)}</span>
                      <span class="home-action-meta">Carry the workflow summary and next actions into ${escapeHtml(titleCase(target.id))}.</span>
                    </button>
                  `).join("")}
                  <button id="workflowSaveTaskBtn" class="quick-action-btn" type="button">
                    <span class="home-action-title">Save as Structured Task</span>
                    <span class="home-action-meta">Keep the workflow output in a lightweight local history for follow-through.</span>
                  </button>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Workflow State</h3>
                  <span class="card-badge neutral">Current</span>
                </div>
                <div class="data-stack">
                  <div class="data-row"><span>Status</span><strong>${escapeHtml(titleCase(currentRun.status))}</strong></div>
                  <div class="data-row"><span>Last run</span><strong>${escapeHtml(formatDateTime(currentRun.lastRun))}</strong></div>
                  <div class="data-row"><span>Output preview</span><strong>${escapeHtml(currentRun.output?.summary ? "Available" : "Empty")}</strong></div>
                  <div class="data-row"><span>History entries</span><strong>${escapeHtml(String(currentRun.history.length))}</strong></div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Recent History</h3>
                  <span class="card-badge neutral">${escapeHtml(String(currentRun.history.length))}</span>
                </div>
                ${
                  currentRun.history.length
                    ? `
                      <div class="workflow-history-list">
                        ${currentRun.history.map((item) => `
                          <div class="workflow-history-item">
                            <strong>${escapeHtml(formatDateTime(item.createdAt))}</strong>
                            <span>${escapeHtml(item.output?.summary || "Structured output saved.")}</span>
                          </div>
                        `).join("")}
                      </div>
                    `
                    : `<div class="empty-box">No workflow history yet. Run the selected workflow to start a lightweight execution trail.</div>`
                }
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Saved Tasks</h3>
                  <span class="card-badge neutral">${escapeHtml(String(session.savedTasks.length))}</span>
                </div>
                ${
                  session.savedTasks.length
                    ? `
                      <div class="workflow-history-list">
                        ${session.savedTasks.map((item) => `
                          <div class="workflow-history-item">
                            <strong>${escapeHtml(item.title)}</strong>
                            <span>${escapeHtml(formatDateTime(item.createdAt))}</span>
                          </div>
                        `).join("")}
                      </div>
                    `
                    : `<div class="empty-box">Structured tasks saved from workflow outputs will appear here.</div>`
                }
              </div>
            </aside>
          </div>
        </div>
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
