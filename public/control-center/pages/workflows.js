import {
  selectCurrentProject,
  selectOperationsSnapshot,
  selectProjectPayload
} from "../state.js";

import {
  getSharedAiDraft,
  getSharedHandoff,
  setSharedAiDraft,
  setSharedHandoff
} from "../shared-context.js";
import { getGlobalNextBestAction } from "../system-intelligence.js";
import {
  buildAutomationPlan,
  createAutoModeController,
  getAutoModeState,
  startAutoMode,
  pauseAutoMode,
  resumeAutoMode,
  stopAutoMode,
  approveCurrentGate,
  skipCurrentStep,
  subscribeAutoMode,
  getAutoFixPlan,
  runAutomationPlan
} from "../automation-engine.js";

const WORKFLOW_CATALOG = [
  {
    id: "launch-campaign",
    title: "Launch Campaign",
    purpose: "Build a launch-ready review sequence across campaign, content, and distribution handoffs.",
    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
    aiModeId: "strategist",
    routeHint: "campaign-studio"
  },
  {
    id: "create-content-plan",
    title: "Create Content Plan",
    purpose: "Generate a review-ready content plan tied to campaign and audience context.",
    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
    aiModeId: "writer",
    routeHint: "content-studio"
  },
  {
    id: "build-media-job",
    title: "Build Media Job",
    purpose: "Prepare media production inputs, format guidance, and downstream handoff steps.",
    requiredInputs: ["project", "campaign", "product", "channel", "goal"],
    aiModeId: "media",
    routeHint: "media-studio"
  },
  {
    id: "prepare-publishing-package",
    title: "Prepare Publishing Package",
    purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
    requiredInputs: ["project", "campaign", "channel", "goal"],
    aiModeId: "operations",
    routeHint: "publishing"
  },
  {
    id: "generate-report",
    title: "Generate Report",
    purpose: "Summarize workflow state, results, blockers, and the next operational decision.",
    requiredInputs: ["project", "campaign", "goal"],
    aiModeId: "analyst",
    routeHint: "insights"
  },
  {
    id: "research-competitors",
    title: "Research Competitors",
    purpose: "Create a competitor intelligence brief for positioning and campaign advantage.",
    requiredInputs: ["project", "product", "goal"],
    aiModeId: "researcher",
    routeHint: "research"
  },
  {
    id: "fix-integrations",
    title: "Fix Integrations",
    purpose: "Prioritize integration recovery actions that restore readiness and automation reliability.",
    requiredInputs: ["project", "channel", "goal"],
    aiModeId: "operations",
    routeHint: "integrations"
  }
];

const IMPACT_CHIPS = [
  "Launch readiness",
  "Content",
  "Campaign",
  "Publishing",
  "Automation",
  "Reports"
];

const WORKFLOW_ID_ALIASES = {
  "launch-product": "launch-campaign",
  "generate-campaign": "launch-campaign",
  "run-weekly-report": "generate-report",
  "build-ads": "launch-campaign"
};

const WORKFLOW_LOCAL_DRAFTS_KEY = "mh-workflow-local-drafts-v1";

const workflowSessions = new Map();
let lastWorkflowRenderContext = null;
let workflowBridgeRegistered = false;
let workflowAutoModeUnsubscribe = null;
let workflowAutomationEnabled = false;
const workflowAutomationState = {
  progress: "",
  result: "",
  cursor: 0,
  lastPlan: [],
  lastResults: []
};

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

function compactText(value, max = 88) {
  const text = asString(value).trim();
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(12, max - 1)).trimEnd()}…`;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const clean = asString(value).trim();
    if (clean) return clean;
  }
  return "";
}

function uniqueStrings(values) {
  return Array.from(new Set(asArray(values).map((item) => asString(item).trim()).filter(Boolean)));
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

function normalizeRunStatus(status) {
  const normalized = asString(status).trim().toLowerCase();
  if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
  if (["failed", "error", "errored", "cancelled", "blocked"].includes(normalized)) return "failed";
  if (["completed", "success", "done", "ready"].includes(normalized)) return "completed";
  return "draft";
}

function statusTone(status) {
  const runStatus = normalizeRunStatus(status);
  if (runStatus === "completed") return "success";
  if (runStatus === "running") return "warning";
  if (runStatus === "failed") return "danger";
  return "neutral";
}

function getWorkflowDef(id) {
  return WORKFLOW_CATALOG.find((item) => item.id === id) || WORKFLOW_CATALOG[0];
}

function createDefaultInputs(state) {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  const activity = asObject(state.data.activity);

  const channels = uniqueStrings([
    ...asArray(activity.scheduled_jobs).map((job) => asString(job.channel)),
    ...asArray(overview.channels)
  ]).join(", ");

  return {
    project: firstNonEmpty(context.currentProject, overview.project_name),
    campaign: firstNonEmpty(context.activeCampaign),
    product: firstNonEmpty(overview.project_name, context.currentProject),
    channel: channels,
    goal: firstNonEmpty(overview.primary_goal, overview.goal)
  };
}

function createEmptyRunState() {
  return {
    status: "draft",
    runId: "",
    source: "",
    lastRunAt: "",
    output: null,
    blockedRequirements: [],
    history: []
  };
}

function createRunsMap() {
  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
    acc[workflow.id] = createEmptyRunState();
    return acc;
  }, {});
}

function createInputsMap(defaults) {
  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
    acc[workflow.id] = {
      ...defaults,
      goal: defaults.goal || ""
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

function readLocalDraftMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage?.getItem(WORKFLOW_LOCAL_DRAFTS_KEY) || "{}";
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeLocalDraftMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(WORKFLOW_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}

function loadLocalDrafts(projectName) {
  const key = projectName || "__default__";
  return asObject(readLocalDraftMap()[key]);
}

function saveLocalDraft(projectName, workflowId, payload) {
  const key = projectName || "__default__";
  const map = readLocalDraftMap();
  const projectDrafts = asObject(map[key]);
  projectDrafts[workflowId] = {
    ...asObject(projectDrafts[workflowId]),
    ...asObject(payload),
    updatedAt: nowIso()
  };
  map[key] = projectDrafts;
  writeLocalDraftMap(map);
  return projectDrafts[workflowId];
}

function hydrateFromLocalDrafts(projectName, session) {
  if (session.localDraftsHydrated) return;
  const local = loadLocalDrafts(projectName);
  WORKFLOW_CATALOG.forEach((workflow) => {
    const draft = asObject(local[workflow.id]);
    if (!Object.keys(draft).length) return;
    session.inputsByWorkflow[workflow.id] = {
      ...session.inputsByWorkflow[workflow.id],
      ...asObject(draft.inputs)
    };
    if (draft.lastSelected) {
      session.selectedWorkflowId = workflow.id;
    }
    if (draft.updatedAt) {
      session.draftStatus = `Draft restored ${formatDateTime(draft.updatedAt)}`;
    }
  });
  session.localDraftsHydrated = true;
}

function persistWorkflowDraft(projectName, session, workflowId, hint, selected) {
  const saved = saveLocalDraft(projectName, workflowId, {
    inputs: asObject(session.inputsByWorkflow[workflowId]),
    workflowId,
    lastSelected: Boolean(selected)
  });
  session.draftStatus = hint || `Draft saved ${formatDateTime(saved.updatedAt)}`;
}

function ensureSession(projectName, defaults, operations) {
  const key = projectName || "__default__";
  if (!workflowSessions.has(key)) {
    workflowSessions.set(key, {
      selectedWorkflowId: WORKFLOW_CATALOG[0].id,
      inputsByWorkflow: createInputsMap(defaults),
      runsByWorkflow: createRunsMap(),
      validationMessage: "",
      draftStatus: "",
      localDraftsHydrated: false,
      operationsFingerprint: "",
      lastAppliedHandoffId: "",
      intelligence: {
        project: "",
        status: "idle",
        dashboard: null,
        insights: null,
        learning: null,
        error: "",
        loadedAt: "",
        loadingPromise: null
      }
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
    session.runsByWorkflow = session.runsByWorkflow || createRunsMap();
    session.validationMessage = asString(session.validationMessage);
    session.draftStatus = asString(session.draftStatus);
    session.operationsFingerprint = asString(session.operationsFingerprint);
    session.lastAppliedHandoffId = asString(session.lastAppliedHandoffId);
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
  }

  const session = workflowSessions.get(key);
  hydrateFromLocalDrafts(projectName, session);
  hydrateSessionFromOperations(session, operations);
  return session;
}

function hydrateSessionFromOperations(session, operations) {
  const fingerprint = buildOperationsFingerprint(operations);
  if (!fingerprint || session.operationsFingerprint === fingerprint) return;

  const nextRuns = createRunsMap();
  asArray(operations?.workflows?.items).forEach((item) => {
    const sourceId = asString(item.workflow_id);
    const resolvedId = WORKFLOW_ID_ALIASES[sourceId] || sourceId;
    if (!nextRuns[resolvedId]) return;

    const output = asObject(item.output);
    nextRuns[resolvedId] = {
      ...nextRuns[resolvedId],
      status: asString(item.status || "completed"),
      runId: asString(item.id),
      source: asString(item.source || "durable-run"),
      lastRunAt: asString(item.created_at),
      output,
      blockedRequirements: asArray(output.blockedRequirements || output.blocked_requirements),
      history: [
        {
          createdAt: asString(item.created_at),
          source: asString(item.source || "durable-run"),
          output
        }
      ]
    };
  });

  session.runsByWorkflow = nextRuns;
  session.operationsFingerprint = fingerprint;
}

function buildWorkflowContext(state, session) {
  const dashboard = asObject(session.intelligence.dashboard || state.data);
  const overviewBlock = asObject(dashboard.overview || state.data.overview);
  const overview = asObject(overviewBlock.overview);
  const readinessRoot = asObject(dashboard.readiness || state.data.readiness);
  const readiness = asObject(readinessRoot.dashboard || readinessRoot);
  const integrations = asObject(dashboard.integrations || state.data.integrations);
  const assets = asObject(dashboard.assets || state.data.assets);
  const activity = asObject(dashboard.activity || state.data.activity);

  const insightsPayload = asObject(session.intelligence.insights || activity.insights || activity.marketing_insights || activity.performance_insights);
  const learningPayload = asObject(session.intelligence.learning || activity.learning);

  const checks = asObject(integrations.readiness?.checks);
  const missingIntegrations = uniqueStrings([
    ...Object.entries(checks).filter(([, ready]) => !ready).map(([key]) => titleCase(key)),
    ...Object.entries(asObject(insightsPayload.data_coverage))
      .filter(([, item]) => asString(asObject(item).status) !== "covered")
      .map(([key]) => titleCase(key))
  ]);

  const missingAssets = uniqueStrings([
    ...asArray(assets.missing_assets?.missing),
    ...asArray(assets.missing_assets?.required_asset_types)
  ]).map(titleCase);

  const recommendations = asArray(
    learningPayload.recommendations ||
    insightsPayload.recommendations ||
    readiness.next_best_actions ||
    overviewBlock.next_best_actions
  );

  return {
    projectName: firstNonEmpty(state.context.currentProject, overview.project_name),
    campaignName: firstNonEmpty(state.context.activeCampaign),
    readinessScore: Number(readiness.readiness_score ?? overview.readiness_score),
    readinessStatus: firstNonEmpty(readiness.readiness_status, overview.readiness_status),
    integrations,
    assets,
    activity,
    insights: insightsPayload,
    learning: learningPayload,
    recommendations,
    missingIntegrations,
    missingAssets,
    hasLiveIntelligence: Boolean(Object.keys(insightsPayload).length || Object.keys(learningPayload).length)
  };
}

function buildOverviewMetrics(session, context) {
  const allRuns = Object.values(asObject(session.runsByWorkflow));
  const counts = {
    total: WORKFLOW_CATALOG.length,
    ready: 0,
    draft: 0,
    failed: 0,
    running: 0,
    lastExecutionAt: ""
  };

  allRuns.forEach((run) => {
    const normalized = normalizeRunStatus(run.status);
    if (normalized === "completed") counts.ready += 1;
    else if (normalized === "running") counts.running += 1;
    else if (normalized === "failed") counts.failed += 1;
    else counts.draft += 1;

    if (asString(run.lastRunAt) && (!counts.lastExecutionAt || Date.parse(run.lastRunAt) > Date.parse(counts.lastExecutionAt))) {
      counts.lastExecutionAt = run.lastRunAt;
    }
  });

  asArray(context.activity?.execution_results).forEach((item) => {
    const when = asString(item.executed_at || item.created_at);
    if (when && (!counts.lastExecutionAt || Date.parse(when) > Date.parse(counts.lastExecutionAt))) {
      counts.lastExecutionAt = when;
    }
  });

  return counts;
}

function getBlockedRequirements(workflow, inputs, context) {
  const blocked = [];
  const missingRequired = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
  if (missingRequired.length) {
    blocked.push(`Missing required inputs: ${missingRequired.map(titleCase).join(", ")}`);
  }

  if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {
    blocked.push(`Missing assets: ${context.missingAssets.slice(0, 4).join(", ")}`);
  }

  if (workflow.id === "generate-report" && context.missingIntegrations.length) {
    blocked.push(`Data coverage gaps: ${context.missingIntegrations.slice(0, 3).join(", ")}`);
  }

  if (workflow.id === "fix-integrations" && !context.missingIntegrations.length) {
    blocked.push("No integration gaps detected. Use this workflow only if connectors are unstable.");
  }

  return blocked;
}

function buildWorkflowPrompt(workflow, inputs, context) {
  return [
    `Workflow: ${workflow.title}`,
    `Purpose: ${workflow.purpose}`,
    `Project: ${inputs.project || context.projectName || "not set"}`,
    `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
    `Product: ${inputs.product || "not set"}`,
    `Channel: ${inputs.channel || "not set"}`,
    `Goal: ${inputs.goal || "not set"}`,
    context.readinessScore ? `Readiness: ${context.readinessScore}/100` : "Readiness: unknown",
    context.missingIntegrations.length ? `Missing integrations: ${context.missingIntegrations.join(", ")}` : "Missing integrations: none",
    context.missingAssets.length ? `Missing assets: ${context.missingAssets.join(", ")}` : "Missing assets: none"
  ].join("\n");
}

function buildFallbackOutput(workflow, inputs, context) {
  const recommendation = asObject(asArray(context.recommendations)[0]);
  const recommendationText = firstNonEmpty(recommendation.action, recommendation.summary, recommendation.title);
  const blockedRequirements = getBlockedRequirements(workflow, inputs, context);

  return {
    title: `${workflow.title} review package`,
    summary: `Prepared ${workflow.title.toLowerCase()} for ${inputs.project || context.projectName || "the current project"} with ${inputs.goal || "a defined goal"}.`,
    nextActions: uniqueStrings([
      recommendationText,
      `Open ${titleCase(workflow.routeHint)} for review handoff.`,
      blockedRequirements.length ? "Resolve blockers before any destination-owned execution." : "Proceed to review handoff."
    ]).filter(Boolean),
    blockedRequirements,
    requiredInputs: workflow.requiredInputs.map(titleCase),
    routeSuggestions: [
      {
        label: `Open ${titleCase(workflow.routeHint)}`,
        route: workflow.routeHint,
        reason: `Continue review in ${titleCase(workflow.routeHint)}.`
      },
      {
        label: "Open AI Workspace",
        route: "ai-command",
        reason: "Refine this workflow package with AI reasoning."
      }
    ]
  };
}

function mapGlobalActionToWorkflowId(globalAction) {
  const target = asString(globalAction?.targetPage).trim().toLowerCase();
  if (target === "integrations") return "fix-integrations";
  if (target === "publishing") return "prepare-publishing-package";
  if (target === "content-studio") return "create-content-plan";
  if (target === "media-studio") return "build-media-job";
  if (target === "setup" || target === "campaign-studio") return "launch-campaign";
  return "";
}

function buildSmartRecommendation(context, session, globalAction) {
  const mappedWorkflowId = mapGlobalActionToWorkflowId(globalAction);
  if (mappedWorkflowId) {
    const mapped = getWorkflowDef(mappedWorkflowId);
    return {
      workflowId: mapped.id,
      title: `System intelligence: ${globalAction.title || mapped.title}`,
      reason: firstNonEmpty(globalAction.reason, `Global next best action points to ${titleCase(globalAction.targetPage)}.`),
      chips: ["Launch readiness", "Automation", "Campaign"],
      prompt: firstNonEmpty(globalAction?.draftPayload?.prompt, `Build a ${mapped.title.toLowerCase()} review plan from current system blockers and dependencies.`)
    };
  }

  if (context.missingIntegrations.length) {
    return {
      workflowId: "fix-integrations",
      title: "Prepare Fix Integrations review next",
      reason: `${context.missingIntegrations.length} integration gap${context.missingIntegrations.length === 1 ? "" : "s"} can block automation and report quality.`,
      chips: ["Launch readiness", "Automation", "Reports"],
      prompt: "Build a prioritized integration recovery workflow with dependency order and expected readiness impact."
    };
  }

  if (context.missingAssets.length) {
    return {
      workflowId: "prepare-publishing-package",
      title: "Prepare publishing package handoff before distribution",
      reason: `${context.missingAssets.length} asset requirement${context.missingAssets.length === 1 ? "" : "s"} are still missing and can block final publishing.`,
      chips: ["Publishing", "Campaign", "Launch readiness"],
      prompt: "Prepare a publishing package checklist with missing assets and approval dependencies."
    };
  }

  if (!context.campaignName) {
    return {
      workflowId: "launch-campaign",
      title: "Define launch campaign workflow",
      reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",
      chips: ["Campaign", "Launch readiness", "Automation"],
      prompt: "Create a launch campaign workflow with owner sequence and execution gates."
    };
  }

  const selected = getWorkflowDef(session.selectedWorkflowId);
  return {
    workflowId: selected.id,
    title: `Continue with ${selected.title}`,
    reason: "Current context is sufficient to prepare the selected workflow review package now.",
    chips: ["Content", "Campaign", "Publishing"],
    prompt: `Refine ${selected.title.toLowerCase()} for reviewed handoff with explicit dependencies and next actions.`
  };
}

function renderImpactChips(activeLabels, escapeHtml) {
  const set = new Set(asArray(activeLabels));
  return IMPACT_CHIPS.map((label) => `<span class="wfexec-chip${set.has(label) ? " is-active" : ""}">${escapeHtml(label)}</span>`).join("");
}

function renderOverviewSection(metrics, context, escapeHtml) {
  return `
    <section class="wfexec-section wfexec-overview">
      <div class="wfexec-head"><h3>Workflow Overview</h3></div>
      <div class="wfexec-overview-grid">
        <article class="wfexec-stat"><span>Total workflows</span><strong>${escapeHtml(String(metrics.total))}</strong></article>
        <article class="wfexec-stat"><span>Ready workflows</span><strong>${escapeHtml(String(metrics.ready))}</strong></article>
        <article class="wfexec-stat"><span>Draft workflows</span><strong>${escapeHtml(String(metrics.draft))}</strong></article>
        <article class="wfexec-stat"><span>Failed / blocked</span><strong>${escapeHtml(String(metrics.failed))}</strong></article>
        <article class="wfexec-stat wfexec-stat-wide"><span>Last prepared output</span><strong>${escapeHtml(metrics.lastExecutionAt ? formatDateTime(metrics.lastExecutionAt) : "No prepared output yet")}</strong></article>
        <article class="wfexec-stat wfexec-stat-wide"><span>Readiness</span><strong>${escapeHtml(Number.isFinite(context.readinessScore) ? `${context.readinessScore}/100` : "Unknown")} · ${escapeHtml(context.readinessStatus || "unclassified")}</strong></article>
      </div>
    </section>
  `;
}

function renderRecommendationSection(recommendation, escapeHtml) {
  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Smart Recommendation</h3></div>
      <div class="wfexec-rec-title">${escapeHtml(recommendation.title)}</div>
      <p class="wfexec-rec-reason">${escapeHtml(recommendation.reason)}</p>
      <div class="wfexec-chip-row">${renderImpactChips(recommendation.chips, escapeHtml)}</div>
      <div class="wfexec-action-row">
        <button id="wfexecStartRecommendedBtn" class="wfexec-btn wfexec-btn-primary" type="button">Start Workflow</button>
        <button id="wfexecSaveRecommendedBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>
        <button id="wfexecSendRecommendedAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI Workspace</button>
      </div>
    </section>
  `;
}

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
        Safe guided preparation only: navigate, create draft, generate prompt, and create review handoff.
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
          Simulate Guided Preparation
        </button>
        <button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
          Simulate Next Preparation Step
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
        Guided preparation mode with automation gates and inline logs. It does not replace Governance approval.
      </p>

      <div class="wfexec-action-row">
        <button id="workflowAutoStartBtn" class="wfexec-btn wfexec-btn-primary" type="button">
          Start Guided Preparation Mode
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
              <strong>Automation gate needs operator review:</strong> ${esc(gate.reason || "Operator review required.")}
            </div>
            <div class="wfexec-meta">
              ${esc(gate.whatWillHappen || "Auto Mode is paused.")}
            </div>
            <div class="wfexec-action-row">
              <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
                Approve Automation Gate Only
              </button>
              <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
                Skip Automation Step
              </button>
            </div>
          `
          : ""
      }

      <div class="wfexec-meta">
        ${esc(
          asArray(autoMode?.logs)
            .slice(-3)
            .map((entry) => `${entry.level || "info"}: ${entry.message || ""}`)
            .join(" | ") || "No logs yet"
        )}
      </div>
    </section>
  `;
}

function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Workflow Review Package Builder</h3></div>
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
        <button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Review Package</button>
        <button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>
        <button id="wfexecSaveDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>
        <button id="wfexecLoadAiStateBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Load AI Command State</button>
        <button id="wfexecClearDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Clear</button>
      </div>
      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
    </section>
  `;
}

function renderCatalogSection(session, context, escapeHtml) {
  return `
    <section class="wfexec-section">
      <div class="wfexec-head"><h3>Workflow Review Catalog</h3></div>
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
              <div class="wfexec-required"><strong>Readiness status:</strong> ${escapeHtml(ready ? "Ready to prepare" : blocked[0])}</div>
              <div class="wfexec-action-row">
                <button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>
                <button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>
                <button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>
              </div>
              ${run.lastRunAt ? `<div class="wfexec-catalog-meta">Last prepared ${escapeHtml(formatDateTime(run.lastRunAt))}</div>` : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
  const output = asObject(run.output);
  if (!output.summary) {
    return `
      <section class="wfexec-section">
        <div class="wfexec-head"><h3>Prepared Output / Review Result</h3></div>
        <div class="wfexec-empty">No prepared package yet. Prepare a workflow package to generate a review-ready output.</div>
      </section>
    `;
  }

  return `
    <section class="wfexec-section">
      <div class="wfexec-head">
        <h3>Prepared Output / Review Result</h3>
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
        <button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI for Review</button>
        <button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>
        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Review Handoff</button>
        <button id="workflowBuildCustomBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Build Custom Workflow</button>
        <button id="workflowRecommendBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Recommend Review Workflow</button>
      </div>
      <div class="wfexec-meta">Workflow review package: ${escapeHtml(workflow.title)} · Status: ${escapeHtml(titleCase(normalizeRunStatus(run.status)))}</div>
    </section>
  `;
}

function renderWorkflowExecutionLoop({
  metrics,
  context,
  recommendation,
  automationPlan,
  autoFixPlan,
  session,
  workflow,
  inputs,
  run,
  blockedRequirements,
  escapeHtml
}) {
  return `
    <div class="wfexec-shell">
      ${renderOverviewSection(metrics, context, escapeHtml)}
      <div class="wfexec-grid">
        <div class="wfexec-left">
          ${renderRecommendationSection(recommendation, escapeHtml)}
          ${renderAutomationSection(automationPlan, autoFixPlan, escapeHtml)}
          ${renderBuilderSection(session, workflow, inputs, session.validationMessage, session.draftStatus, escapeHtml)}
        </div>
        <div class="wfexec-right">
          ${renderCatalogSection(session, context, escapeHtml)}
          ${renderExecutionSection(run, workflow, blockedRequirements, escapeHtml)}
        </div>
      </div>
    </div>
  `;
}

function applyDurableWorkflowHandoff({ projectName, session, operations, consumeProjectHandoff, showMessage }) {
  const handoff = getSharedHandoff(projectName, "workflows", operations);
  const handoffId = asString(handoff?.id);
  if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;

  const payload = asObject(handoff?.payload);
  const fromWorkflowId = asString(payload.workflow_id);
  const modeId = asString(payload?.draft_context?.modeId);
  const modeMapped = WORKFLOW_CATALOG.find((item) => item.aiModeId === modeId)?.id;
  const workflowId = getWorkflowDef(fromWorkflowId || modeMapped || session.selectedWorkflowId).id;

  session.selectedWorkflowId = workflowId;
  session.inputsByWorkflow[workflowId] = {
    ...session.inputsByWorkflow[workflowId],
    project: firstNonEmpty(payload?.draft_context?.projectName, session.inputsByWorkflow[workflowId].project),
    campaign: firstNonEmpty(payload?.campaign_name, session.inputsByWorkflow[workflowId].campaign),
    goal: firstNonEmpty(payload?.draft_context?.lastResponseTitle, payload?.workflow_title, session.inputsByWorkflow[workflowId].goal),
    product: firstNonEmpty(payload?.output?.product, session.inputsByWorkflow[workflowId].product),
    channel: firstNonEmpty(payload?.output?.channel, session.inputsByWorkflow[workflowId].channel)
  };

  if (payload.output) {
    const run = session.runsByWorkflow[workflowId];
    run.output = asObject(payload.output);
    run.status = "completed";
    run.lastRunAt = nowIso();
    run.source = "handoff";
    run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output: run.output });
    run.history = run.history.slice(0, 8);
  }

  session.lastAppliedHandoffId = handoffId;
  consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
    console.warn("Failed to consume workflow handoff:", error.message);
  });
  showMessage?.("Workflow context restored from shared handoff.");
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
    session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to run workflows." };
    return;
  }

  const current = session.intelligence;
  const freshEnough =
    current.status === "ready" &&
    current.project === projectName &&
    current.loadedAt &&
    (Date.now() - Date.parse(current.loadedAt)) < 1000 * 60 * 3;

  if (freshEnough) return;
  if (current.loadingPromise) return current.loadingPromise;

  const state = getState();
  const needsDashboard = !state.data.overview || !state.data.readiness || !state.data.integrations || !state.data.activity;

  session.intelligence = {
    ...current,
    project: projectName,
    status: "loading",
    error: "",
    loadingPromise: (async () => {
      try {
        if (needsDashboard) await reloadProjectData(projectName);
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
          error: insightsResult.status === "rejected" && learningResult.status === "rejected"
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

function buildAiHandoffPrompt(workflow, inputs, runOutput, context) {
  if (runOutput?.summary) {
    return [
      `Refine the ${workflow.title.toLowerCase()} review package.`,
      `Project: ${inputs.project || context.projectName || "not set"}`,
      `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
      `Summary: ${runOutput.summary}`,
      `Next actions: ${asArray(runOutput.nextActions).join("; ")}`
    ].join("\n");
  }
  return [
    `Build a ${workflow.title.toLowerCase()} review package.`,
    `Project: ${inputs.project || context.projectName || "not set"}`,
    `Campaign: ${inputs.campaign || context.campaignName || "not set"}`,
    `Product: ${inputs.product || "not set"}`,
    `Channel: ${inputs.channel || "not set"}`,
    `Goal: ${inputs.goal || "not set"}`,
    context.missingIntegrations.length ? `Missing integrations: ${context.missingIntegrations.join(", ")}` : "Missing integrations: none",
    context.missingAssets.length ? `Missing assets: ${context.missingAssets.join(", ")}` : "Missing assets: none"
  ].join("\n");
}

function pushWorkflowToAiCommand({
  projectName,
  workflow,
  inputs,
  run,
  context,
  navigateTo,
  createProjectHandoff,
  showMessage,
  allowPersistent
}) {
  const prompt = buildAiHandoffPrompt(workflow, inputs, run.output, context);
  const aiDraft = {
    projectName,
    modeId: workflow.aiModeId,
    lastCommand: prompt,
    lastResponseTitle: asString(run.output?.title || workflow.title),
    routeSuggestions: asArray(run.output?.routeSuggestions)
  };

  setSharedAiDraft(projectName, aiDraft);

  const handoff = {
    source_page: "workflows",
    destination_page: "ai-command",
    payload: {
      prompt,
      workflow_id: workflow.id,
      workflow_title: workflow.title,
      draft_context: aiDraft,
      output: asObject(run.output)
    },
    status: "available"
  };

  setSharedHandoff(projectName, "ai-command", handoff);

  if (allowPersistent && typeof createProjectHandoff === "function") {
    createProjectHandoff(projectName, handoff).catch((error) => {
      console.warn("Failed to persist workflow-to-ai handoff:", error.message);
    });
  }

  navigateTo("ai-command");
  showMessage?.(allowPersistent ? "Workflow context sent to AI Command." : "Workflow context sent locally to AI Command.");
}

function validateWorkflowInputs(workflow, inputs) {
  const missing = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
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
      session.draftStatus = "AI prompt imported into workflow review builder";
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
      showError?.(error.message || "Workflow review package preparation failed.");
    }

    render();
  });

  workflowBridgeRegistered = true;
}

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
        session.inputsByWorkflow[session.selectedWorkflowId].goal = firstNonEmpty(inputs.goal, "Review loop optimization");
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
    `Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
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
      setValidation("Select a project before preparing a workflow review package.");
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
        summary: error.message || "Workflow review package preparation failed.",
        blockedRequirements: ["Preparation failed. Review inputs and retry."],
        nextActions: ["Retry workflow", "Validate project integrations", "Check workflow dependencies"]
      };
      activeRun.blockedRequirements = asArray(activeRun.output.blockedRequirements);
      showError?.(error.message || "Workflow review package preparation failed.");
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
        summary: asString(run.output.summary || "Review-only task handoff prepared from the Workflows operating path."),
        description: asString(run.output.summary || "Review-only task handoff prepared from the Workflows operating path."),
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
      const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);
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
      workflowAutomationState.result = result.status === "success" ? "Guided preparation simulation completed." : "Guided preparation simulation stopped before completion.";
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

      const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");
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
        ? "Step-by-step guided preparation completed."
        : "Preparation step simulated. Continue for the next step.";
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

      const confirmed = window.confirm(
        "Confirm Auto Mode start\n\n" +
          "Action: Start guided workflow Auto Mode for the current project context.\n" +
          "Risk: This may prepare workflow steps and handoffs, but must not publish externally or approve Governance decisions without explicit approval.\n\n" +
          "Select Cancel to stop."
      );
      if (!confirmed) return;

      await startAutoMode(plan, {
        mode: "auto_until_approval",
        context: { getState, navigateTo, createProjectHandoff, projectName }
      });
      showMessage?.("Workflow Guided Preparation Mode started.");
    };
  }

  const autoPauseBtn = $("workflowAutoPauseBtn");
  if (autoPauseBtn) {
    autoPauseBtn.onclick = () => {
      pauseAutoMode();
      showMessage?.("Guided Preparation Mode paused.");
    };
  }

  const autoResumeBtn = $("workflowAutoResumeBtn");
  if (autoResumeBtn) {
    autoResumeBtn.onclick = async () => {
      const confirmed = window.confirm(
        "Confirm Auto Mode resume\n\n" +
          "Action: Resume the current guided workflow automation session.\n" +
          "Risk: This may continue preparing workflow steps and handoffs from the current state.\n\n" +
          "Select Cancel to keep Auto Mode paused."
      );
      if (!confirmed) return;
      await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Guided Preparation Mode resumed.");
    };
  }

  const autoStopBtn = $("workflowAutoStopBtn");
  if (autoStopBtn) {
    autoStopBtn.onclick = () => {
      stopAutoMode();
      showMessage?.("Guided Preparation Mode stopped.");
    };
  }

  const autoApproveBtn = $("workflowAutoApproveBtn");
  if (autoApproveBtn) {
    autoApproveBtn.onclick = async () => {
      const confirmed = window.confirm(
        "Confirm workflow gate approval\n\n" +
          "Action: Approve the current workflow automation gate.\n" +
          "Risk: This advances the guided workflow state, but does not replace Governance approval for protected actions.\n\n" +
          "Select Cancel to keep the gate pending."
      );
      if (!confirmed) return;
      await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Automation gate accepted. This is not a Governance approval.");
    };
  }

  const autoSkipBtn = $("workflowAutoSkipBtn");
  if (autoSkipBtn) {
    autoSkipBtn.onclick = async () => {
      const confirmed = window.confirm(
        "Confirm workflow step skip\n\n" +
          "Action: Skip the current guided workflow step.\n" +
          "Risk: Skipping may leave a workflow preparation step incomplete and should be used only when intentionally bypassing it.\n\n" +
          "Select Cancel to keep the current step active."
      );
      if (!confirmed) return;
      await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
      showMessage?.("Guided Preparation Mode skipped one automation step. This does not bypass Governance policy.");
    };
  }
}

export const workflowsRoute = {
  id: "workflows",
  disableStandardLayout: true,
  meta: {
    eyebrow: "AI & Build",
    title: "Workflows",
    description: "Prepare structured, repeatable workflow review packages and handoffs for common marketing operations."
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
        `Goal: ${inputs.goal || "Prepare a review-ready workflow package."}`
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
          : "Prepare workflow review package.";

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
              <p class="wfloop-mission">Choose an operating playbook, prepare a review-ready package, and route it safely to the right MH-OS destination.</p>
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
                <h3>Workflow Review Catalog</h3>
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
                  <p class="wfloop-session-label">Review package to prepare</p>
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
                  <span class="badge">${escapeHtml(preparedForSelected ? "Review package ready" : "Not prepared yet")}</span>
                </div>
                <p class="wfloop-preview-meta">${escapeHtml(preparedForSelected ? `Prepared ${formatDateTime(preparedForSelected.createdAt)} · ${workflow.title} session package` : "Prepare to generate a compact operating package preview.")}</p>
                <pre>${escapeHtml(preparedForSelected?.prompt || "Package will include playbook, purpose, project, campaign, product, channel, goal, and destination context.")}</pre>
              </div>

              <details class="wfloop-tech-details">
                <summary>Technical details</summary>
                <p>Safe preparation path only. This surface prepares review context and routes it to the correct destination.</p>
                <p>Backend workflow run and automation helpers remain preserved, but this active surface stays limited to preparation, review, routing, and destination-owned execution authority.</p>
              </details>
            </article>

            <aside class="wfloop-zone wfloop-assist">
              <section class="mhos-ai-guidance">
                <h3 class="mhos-ai-guidance-title">AI Guidance</h3>
                <p class="mhos-ai-guidance-copy">AI prepares structure, sequencing, destination context, and missing-input prompts for review only for ${escapeHtml(workflow.title)}.</p>
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
                      <p class="mhos-destination-meta"><strong>Destination context</strong> workflow package prompt, selected workflow, and input state</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now</p>
                    </div>
                    <div class="mhos-destination-actions">
                      <button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open</button>
                    </div>
                  </article>

                  <article class="mhos-destination-item">
                    <div class="mhos-destination-copy">
                      <p class="mhos-destination-title">Create/Draft Task</p>
                      <p class="mhos-destination-meta"><strong>Type</strong> task review handoff</p>
                      <p class="mhos-destination-meta"><strong>Destination context</strong> selected workflow session title and handoff intent</p>
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
                      <p class="mhos-destination-meta"><strong>Destination context</strong> route hint, prepared package, and review context</p>
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
                      <p class="mhos-destination-meta"><strong>Destination context</strong> preparation boundary and preserved helper notes</p>
                      <p class="mhos-destination-meta"><strong>Status</strong> Safe now · Destination tools own execution authority and Governance-gated actions remain protected</p>
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
          stateModel.lastStatusText = "Operating playbook selected. Complete context and prepare a review package.";
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
        showMessage?.("Workflow review package prepared.");
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
            summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from the Workflows operating path."),
            description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from the Workflows operating path."),
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
              summary: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from the Workflows operating path."),
              description: asString(stateModel.preparedPackage?.summary || stateModel.packagePreview || "Review-only task handoff prepared from the Workflows operating path."),
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
