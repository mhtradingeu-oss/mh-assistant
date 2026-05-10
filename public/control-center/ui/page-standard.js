import { getCachedNextBestAction, getGlobalNextBestAction } from "../system-intelligence.js";

const REQUIRED_ROUTES = [
  "home",
  "setup",
  "library",
  "integrations",
  "ai-command",
  "workflows",
  "campaign-studio",
  "content-studio",
  "media-studio",
  "publishing",
  "ads-manager",
  "insights",
  "research",
  "settings"
];

const ROUTE_COPY = {
  home: {
    eyebrow: "Executive",
    title: "Executive Command Center",
    description: "System health, readiness, blockers, active work, and the next best move.",
    primary: { label: "Open AI Workspace", route: "ai-command" },
    secondary: { label: "Refresh Project", action: "refresh" }
  },
  setup: {
    eyebrow: "Foundation",
    title: "Guided Project Setup",
    description: "Brand, market, audience, goals, and validation inputs.",
    primary: { label: "Save Setup", action: "focus-save" },
    secondary: { label: "Continue To Library", route: "library" }
  },
  library: {
    eyebrow: "Assets",
    title: "Smart Asset Library",
    description: "Upload, classify, review, and route source-of-truth assets.",
    primary: { label: "Upload Assets", action: "focus-upload" },
    secondary: { label: "Send To Campaign", route: "campaign-studio" }
  },
  integrations: {
    eyebrow: "Connections",
    title: "Platform Connection Center",
    description: "Connect, test, sync, and diagnose platforms.",
    primary: { label: "Run Sync", action: "focus-sync" },
    secondary: { label: "Open Insights", route: "insights" }
  },
  "ai-command": {
    eyebrow: "AI Workspace",
    title: "AI Workspace",
    description: "Direct role-aware AI agents, structured tasks, artifacts, and decisions.",
    primary: { label: "Run Structured Task", action: "focus-ai-send" },
    secondary: { label: "Open Workflows", route: "workflows" }
  },
  workflows: {
    eyebrow: "Automation",
    title: "Workflow Automation Center",
    description: "Run repeatable workflows and route outputs into execution.",
    primary: { label: "Run Workflow", action: "focus-run-workflow" },
    secondary: { label: "Open Campaign Studio", route: "campaign-studio" }
  },
  "campaign-studio": {
    eyebrow: "Campaigns",
    title: "Campaign Command Center",
    description: "Build launch waves and package campaign plans.",
    primary: { label: "Build Campaign", action: "focus-save-campaign" },
    secondary: { label: "Send To Content", route: "content-studio" }
  },
  "content-studio": {
    eyebrow: "Content",
    title: "Content Production Hub",
    description: "Create, review, approve, rewrite, translate, and route copy.",
    primary: { label: "Generate Content", action: "focus-generate-content" },
    secondary: { label: "Send To Media", route: "media-studio" }
  },
  "media-studio": {
    eyebrow: "Media",
    title: "Visual Production Center",
    description: "Manage media jobs, prompt packs, storyboards, and approvals.",
    primary: { label: "Generate Media", action: "focus-generate-media" },
    secondary: { label: "Send To Publishing", route: "publishing" }
  },
  publishing: {
    eyebrow: "Execution",
    title: "Execution & Scheduler Control Center",
    description: "Schedule, approve, retry, and monitor publishing execution.",
    primary: { label: "Schedule Job", action: "focus-schedule" },
    secondary: { label: "Open Job Monitor", route: "job-monitor" }
  },
  "ads-manager": {
    eyebrow: "Paid Growth",
    title: "Paid Growth Planner",
    description: "Shape ad briefs, variants, audiences, budget, and tracking.",
    primary: { label: "Suggest Budget", action: "focus-save-budget" },
    secondary: { label: "Send To Campaign", route: "campaign-studio" }
  },
  insights: {
    eyebrow: "Intelligence",
    title: "Intelligence & Optimization Dashboard",
    description: "Turn signals, risks, and learning memory into clear actions.",
    primary: { label: "Generate Recommendations", route: "ai-command" },
    secondary: { label: "Open Research", route: "research" }
  },
  research: {
    eyebrow: "Market Intelligence",
    title: "Market Intelligence Center",
    description: "Capture competitors, trends, keywords, audiences, and opportunities.",
    primary: { label: "Run Research", action: "focus-run-research" },
    secondary: { label: "Send To Campaign", route: "campaign-studio" }
  },
  settings: {
    eyebrow: "Configuration",
    title: "System Configuration Center",
    description: "Configure project, AI mode, roles, rules, approvals, and safeguards.",
    primary: { label: "Save Settings", action: "focus-save-settings" },
    secondary: { label: "Check Governance", route: "governance" }
  }
};

const ACTION_TARGETS = {
  "focus-save": "#setupSaveBackendBtn",
  "focus-complete-setup": "#setupCompleteNowBtn",
  "focus-setup-ai": "#setupAiFillMissingBtn, #setupAiPositioningBtn",
  "focus-upload": "#libraryUploadBtn",
  "focus-library-classify": "#libraryAiClassifyBtn",
  "focus-library-missing": "#libraryAiMissingBtn",
  "focus-connect-platform": "[data-integration-primary='connect'], [data-integration-action='connect'], [data-integration-primary]",
  "focus-test-connection": "[data-integration-action='test']",
  "focus-sync": "[data-integration-action='sync'], [data-integration-primary='sync']",
  "focus-integration-ai": "[data-integration-prompt]",
  "focus-ai-send": "#aiCommandSendBtn",
  "focus-run-workflow": "#workflowRunBtn, #workflowRunBtnMain",
  "focus-build-workflow": "#workflowBuildCustomBtn",
  "focus-workflow-route": "#workflowPushAiBtn, #workflowPushAiBtnSecondary",
  "focus-save-campaign": "#campaignBuildPlanBtn",
  "focus-campaign-ai": "#campaignAskAiBtn",
  "focus-campaign-package": "#campaignOpenContentStudioBtn",
  "focus-generate-content": "#contentAiRewriteBtn, #contentSaveBtn",
  "focus-new-content": "#contentNewRecordBtn",
  "focus-content-ai": "#contentAiRewriteBtn",
  "focus-content-approval": "#contentRequestApprovalBtn, #contentApproveBtn",
  "focus-generate-media": "[data-new-media-job], #mediaSaveBtn",
  "focus-new-media-image": "[data-new-media-job='image']",
  "focus-new-media-video": "[data-new-media-job='video'], [data-new-media-job='storyboard']",
  "focus-media-approval": "#mediaRequestApprovalBtn, #mediaApproveBtn",
  "focus-schedule": "#publishingScheduleBtn",
  "focus-publishing-ai": "#publishingPushAiBtn",
  "focus-retry-publishing": "#publishingRequeueBtn",
  "focus-save-budget": "#adsManagerOpenPublishingBtn, #adsTotalBudgetInput",
  "focus-run-research": "#researchRefreshBtn",
  "focus-save-research": "#researchSaveFindingBtn, #researchSaveRecommendationBtn",
  "focus-save-settings": "[data-settings-action='save-all']",
  "focus-settings-ai": "[data-settings-ai-prompt], [data-settings-open-ai]",
  "focus-settings-roles": "[data-settings-action='review-critical']",
  "focus-settings-critical": "[data-settings-action='review-critical']"
};

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

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleize(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

function tone(input) {
  const value = asString(input).toLowerCase();

  if (value.includes("fail") || value.includes("error") || value.includes("critical") || value.includes("blocked") || value.includes("risk") || value.includes("missing")) {
    return "danger";
  }

  if (value.includes("warn") || value.includes("pending") || value.includes("partial") || value.includes("queue")) {
    return "warning";
  }

  if (value.includes("ready") || value.includes("healthy") || value.includes("active") || value.includes("connected") || value.includes("complete")) {
    return "success";
  }

  const numeric = Number(input);
  if (Number.isFinite(numeric)) {
    if (numeric >= 80) return "success";
    if (numeric >= 50) return "warning";
    return "danger";
  }

  return "neutral";
}

function pct(value) {
  return `${Math.max(0, Math.round(asNumber(value, 0)))}%`;
}

function metricLabel(t) {
  const map = {
    success: "Healthy",
    warning: "Attention",
    danger: "Risk",
    neutral: "Neutral"
  };

  return map[t] || "Neutral";
}

function getStateFromContext(context) {
  return context?.state || context?.getState?.() || {};
}

function getMetrics(context) {
  const state = getStateFromContext(context);
  const data = asObject(state.data);
  const overview = asObject(data.overview?.overview);
  const readiness = asObject(data.readiness?.dashboard || data.readiness);
  const integrations = asObject(data.integrations?.readiness);
  const ops = asObject(data.operations);
  const activity = asObject(data.activity);
  const assets = asObject(data.assets);

  const checks = asObject(integrations.checks);
  const checkKeys = Object.keys(checks);
  const connectedCount = checkKeys.filter((key) => Boolean(checks[key])).length;

  const scheduledJobs = asArray(activity.scheduled_jobs);
  const executionResults = asArray(activity.execution_results);
  const failedJobs = executionResults.filter((item) => tone(item?.execution_status) === "danger");
  const notifications = asArray(ops.notifications?.items);
  const unread = notifications.filter((item) => !item?.read_at).length;

  const readinessScore = asNumber(readiness.readiness_score ?? overview.readiness_score, 0);
  const connectorScore = asNumber(integrations.readiness_score ?? overview.connector_readiness_score, 0);

  const missingAssets = [
    ...asArray(assets.missing_assets?.assets),
    ...asArray(assets.missing_assets?.missing),
    ...asArray(assets.missing_assets?.blockers)
  ].length;

  const recommendations = [
    ...asArray(readiness.next_best_actions),
    ...asArray(activity.insights?.recommendations),
    ...asArray(activity.learning?.recommendations),
    ...asArray(ops.ai_recommendations?.items)
  ].map((item) => {
    if (typeof item === "string") return item;
    return item?.title || item?.summary || item?.recommendation || item?.action || "";
  }).filter(Boolean);

  const systemScore = Math.round((readinessScore + connectorScore) / 2);

  return {
    state,
    project: asString(state.context?.currentProject || overview.project_name || "-"),
    route: asString(state.context?.currentRoute || ""),
    campaign: asString(state.context?.activeCampaign || "-"),
    market: asString(overview.market || state.context?.currentMarket || "-"),
    readinessScore,
    connectorScore,
    systemScore,
    connectedCount,
    connectorTotal: checkKeys.length,
    scheduledJobs: scheduledJobs.length,
    failedJobs: failedJobs.length,
    unread,
    missingAssets,
    recommendations,
    alertCount: failedJobs.length + unread + missingAssets,
    systemTone: tone(systemScore),
    readinessTone: tone(readinessScore)
  };
}

function nextActionFor(route, metrics) {
  let recommendation = "";

  try {
    const cachedAction = getCachedNextBestAction(metrics.state);
    recommendation = asString(cachedAction?.recommendation || cachedAction?.title || cachedAction?.summary || cachedAction);
  } catch {
    recommendation = "";
  }

  const fallback = {
    home: "Review blockers and ask AI Workspace for the next best operating plan.",
    setup: "Complete missing setup fields and save the project foundation.",
    library: "Upload or classify the asset with the highest launch impact.",
    integrations: "Repair or connect the highest-impact platform, then run sync.",
    "ai-command": "Run a structured task for the highest-risk blocker.",
    workflows: "Run the workflow with the strongest launch impact.",
    "campaign-studio": "Build the next launch wave and route it forward.",
    "content-studio": "Generate or approve the next content item.",
    "media-studio": "Create the missing media job or approve ready creative.",
    publishing: "Clear failed or ready publishing jobs before scheduling more work.",
    "ads-manager": "Build the paid brief and generate variants.",
    insights: "Convert the top recommendation into execution tasks.",
    research: "Save the strongest market finding and send it to Campaign Studio.",
    settings: "Save operating policy and review production readiness."
  };

  return recommendation || fallback[route] || fallback.home;
}

function resolveFreshNextAction(context, fallbackAction = "") {
  const state = getStateFromContext(context);

  try {
    const globalAction = getGlobalNextBestAction(state);
    const next = asString(globalAction?.recommendation || globalAction?.title || globalAction?.summary || globalAction);
    return next || fallbackAction;
  } catch {
    return fallbackAction;
  }
}

function fillPrompt(prompt, context) {
  const state = getStateFromContext(context);
  const projectName = asString(state.context?.currentProject).trim() || "this project";
  const activeCampaign = asString(state.context?.activeCampaign).trim() || "the active campaign";

  return asString(prompt)
    .replace(/\bthis project\b/gi, projectName)
    .replace(/\bthe active campaign\b/gi, activeCampaign);
}

function runAction(action, context) {
  if (!action) return;

  if (action.route) {
    context.navigateTo?.(action.route);
    return;
  }

  if (action.prompt) {
    const input = document.getElementById("quickCommandInput");
    if (input) {
      input.value = fillPrompt(action.prompt, context);
      input.focus?.();
    }

    context.navigateTo?.("ai-command");
    context.showMessage?.("AI prompt queued in AI Workspace.");
    return;
  }

  if (action.action === "refresh") {
    const state = getStateFromContext(context);
    const project = state.context?.currentProject;

    if (!project) {
      context.showMessage?.("Select a project first.");
      return;
    }

    context.reloadProjectData?.(project).catch(() => {});
    return;
  }

  const selector = ACTION_TARGETS[action.action] || "";
  const target = selector ? document.querySelector(selector) : null;

  if (!target) {
    context.showMessage?.("Open the main workspace and select a record before using this action.");
    return;
  }

  target.scrollIntoView?.({ behavior: "smooth", block: "center" });
  target.focus?.();
  target.click?.();
}

function ensureShell(page) {
  const existing = page.querySelector(".std-page-shell");

  if (existing && existing.querySelector("#stdContextRibbon")) {
    return existing;
  }

  const previousSlot = existing?.querySelector("#stdMainContentSlot");
  const previousNodes = Array.from(previousSlot?.childNodes?.length ? previousSlot.childNodes : page.childNodes);

  const shell = document.createElement("div");
  shell.className = "std-page-shell std-page-shell-compact";
  shell.innerHTML = `
    <section id="stdContextRibbon" class="std-context-ribbon" data-ui-role="page-context-ribbon">
      <div class="std-context-main">
        <div class="std-context-line">
          <span id="stdPageEyebrow" class="std-context-eyebrow">Control Center</span>
          <h2 id="stdPageTitle" class="std-context-title">Dashboard</h2>
        </div>
        <p id="stdPageDescription" class="std-context-description">Route overview</p>
        <div id="stdContextMetrics" class="std-context-metrics" aria-label="Page context metrics"></div>
      </div>

      <div class="std-context-actions" id="stdHeaderActions">
        <button type="button" class="btn btn-secondary std-context-btn" id="stdSecondaryAction">Secondary</button>
        <button type="button" class="btn btn-primary std-context-btn" id="stdPrimaryAction">Primary</button>
        <button type="button" class="btn btn-ghost std-context-btn" id="stdAskAiAction">Ask AI</button>
      </div>
    </section>

    <section id="stdSmartStrip" class="std-smart-strip std-smart-strip-compact" data-ui-role="smart-strip">
      <div class="std-smart-strip-copy">
        <span class="card-label">Smart Next Action</span>
        <strong id="stdSmartStripTitle">Recommended move</strong>
        <p id="stdSmartStripReason" class="page-subtitle"></p>
      </div>
      <button type="button" class="btn btn-secondary" id="stdSmartStripBtn">Open AI Workspace</button>
    </section>

    <div id="stdMainContentSlot" class="std-main-content-slot"></div>
  `;

  page.innerHTML = "";
  page.appendChild(shell);

  const slot = shell.querySelector("#stdMainContentSlot");
  previousNodes.forEach((node) => slot?.appendChild(node));

  return shell;
}

function renderContextMetrics(container, metrics) {
  if (!container) return;

  const alertTone = metrics.alertCount ? "warning" : "success";

  const chips = [
    { label: "Project", value: metrics.project, tone: "neutral" },
    { label: "Health", value: pct(metrics.systemScore), tone: metrics.systemTone },
    { label: "Readiness", value: pct(metrics.readinessScore), tone: metrics.readinessTone },
    { label: "Connectors", value: `${metrics.connectedCount}/${metrics.connectorTotal || 0}`, tone: metrics.connectedCount ? "success" : "warning" },
    { label: "Alerts", value: String(metrics.alertCount), tone: alertTone }
  ];

  container.innerHTML = chips
    .map((chip) => `
      <span class="std-context-chip is-${esc(chip.tone)}">
        <span>${esc(chip.label)}</span>
        <strong>${esc(chip.value)}</strong>
      </span>
    `)
    .join("");
}

function bindButton(button, action, context) {
  if (!button || !action) return;

  button.textContent = action.label;
  button.hidden = false;
  button.onclick = () => runAction(action, context);
}

function queueAiPrompt(prompt, context) {
  const input = document.getElementById("quickCommandInput");
  if (input) {
    input.value = fillPrompt(prompt, context);
    input.focus?.();
  }

  context.navigateTo?.("ai-command");
  context.showMessage?.("AI prompt queued in AI Workspace.");
}

function isActiveFormInteractionWithinRoute(page) {
  const activeElement = document.activeElement;
  if (!activeElement || typeof activeElement.matches !== "function") {
    return false;
  }

  if (!page.contains(activeElement)) {
    return false;
  }

  return activeElement.matches(
    "input, select, textarea, [contenteditable=''], [contenteditable='true'], [contenteditable]:not([contenteditable='false'])"
  );
}

export function applyStandardPageLayout(context) {
  const route = asString(context.route);

  if (!REQUIRED_ROUTES.includes(route)) return;

  const page = document.querySelector(`#pageRoot .page[data-page="${route}"]`);
  if (!page) return;

  if (page.dataset.stdLayoutInitialized === "true" && page.dataset.stdLayoutRoute === route && isActiveFormInteractionWithinRoute(page)) {
    return;
  }

  const shell = ensureShell(page);
  const copy = ROUTE_COPY[route] || ROUTE_COPY.home;
  const metrics = getMetrics(context);
  const nextAction = nextActionFor(route, metrics);

  const eyebrow = shell.querySelector("#stdPageEyebrow");
  const title = shell.querySelector("#stdPageTitle");
  const description = shell.querySelector("#stdPageDescription");
  const smartTitle = shell.querySelector("#stdSmartStripTitle");
  const smartReason = shell.querySelector("#stdSmartStripReason");

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (description) description.textContent = copy.description;
  if (smartTitle) smartTitle.textContent = nextAction;
  if (smartReason) {
    smartReason.textContent = metrics.alertCount
      ? "Resolve blockers first, then continue execution."
      : "The system is ready for the next guided operating move.";
  }

  renderContextMetrics(shell.querySelector("#stdContextMetrics"), metrics);

  bindButton(shell.querySelector("#stdPrimaryAction"), copy.primary, context);
  bindButton(shell.querySelector("#stdSecondaryAction"), copy.secondary, context);

  const askAiBtn = shell.querySelector("#stdAskAiAction");
  if (askAiBtn) {
    askAiBtn.textContent = "Ask AI";
    askAiBtn.onclick = () => {
      const freshAction = resolveFreshNextAction(context, nextAction);
      queueAiPrompt(`Review ${copy.title}. Current recommended move: ${freshAction}`, context);
    };
  }

  const stripBtn = shell.querySelector("#stdSmartStripBtn");
  if (stripBtn) {
    stripBtn.onclick = () => {
      const freshAction = resolveFreshNextAction(context, nextAction);
      queueAiPrompt(freshAction, context);
    };
  }

  page.dataset.stdLayoutInitialized = "true";
  page.dataset.stdLayoutRoute = route;
}

export function getRequiredStandardRoutes() {
  return [...REQUIRED_ROUTES];
}
