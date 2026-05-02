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
    description: "Understand system health, readiness, active work, blockers, and the next best move in one scan.",
    primary: { label: "Open AI Command", route: "ai-command" },
    secondary: { label: "Refresh Project", action: "refresh" }
  },
  setup: {
    eyebrow: "Foundation",
    title: "Guided Project Setup",
    description: "Complete the brand, market, audience, and validation inputs that make the rest of the OS reliable.",
    primary: { label: "Save Setup", action: "focus-save" },
    secondary: { label: "Continue To Library", route: "library" }
  },
  library: {
    eyebrow: "Assets",
    title: "Smart Asset Library",
    description: "Upload, classify, review, and route source-of-truth assets for campaign, content, media, and publishing.",
    primary: { label: "Upload Assets", action: "focus-upload" },
    secondary: { label: "Send To Campaign Studio", route: "campaign-studio" }
  },
  integrations: {
    eyebrow: "Connections",
    title: "Platform Connection Center",
    description: "Connect, test, sync, and diagnose the external platforms that power automation and intelligence.",
    primary: { label: "Run Sync", action: "focus-sync" },
    secondary: { label: "Open Insights", route: "insights" }
  },
  "ai-command": {
    eyebrow: "AI Team",
    title: "AI Team Control Room",
    description: "Direct role-aware AI agents, structured tasks, artifacts, recommendations, and operating decisions.",
    primary: { label: "Run Structured Task", action: "focus-ai-send" },
    secondary: { label: "Open Workflows", route: "workflows" }
  },
  workflows: {
    eyebrow: "Automation",
    title: "Workflow Automation Center",
    description: "Run repeatable workflows, build custom workflows with AI, and route outputs into the next workspace.",
    primary: { label: "Run Workflow", action: "focus-run-workflow" },
    secondary: { label: "Open Campaign Studio", route: "campaign-studio" }
  },
  "campaign-studio": {
    eyebrow: "Campaigns",
    title: "Campaign Command Center",
    description: "Build launch waves, inspect channel readiness, and package campaign plans for production and publishing.",
    primary: { label: "Build Campaign", action: "focus-save-campaign" },
    secondary: { label: "Send To Content Studio", route: "content-studio" }
  },
  "content-studio": {
    eyebrow: "Content",
    title: "Content Production Hub",
    description: "Create, review, approve, rewrite, translate, and route platform copy into media or publishing.",
    primary: { label: "Generate Content", action: "focus-generate-content" },
    secondary: { label: "Send To Media Studio", route: "media-studio" }
  },
  "media-studio": {
    eyebrow: "Media",
    title: "Visual Production Center",
    description: "Manage media jobs, prompt packs, storyboards, generated assets, approvals, and publishing handoffs.",
    primary: { label: "Generate Media", action: "focus-generate-media" },
    secondary: { label: "Send To Publishing", route: "publishing" }
  },
  publishing: {
    eyebrow: "Execution",
    title: "Execution & Scheduler Control Center",
    description: "Schedule jobs, approve manual publishing, retry failures, and monitor worker execution state.",
    primary: { label: "Schedule Job", action: "focus-schedule" },
    secondary: { label: "Open Job Monitor", route: "job-monitor" }
  },
  "ads-manager": {
    eyebrow: "Paid Growth",
    title: "Paid Growth Planner",
    description: "Shape ad briefs, variants, audiences, budget suggestions, tracking status, and campaign handoffs.",
    primary: { label: "Suggest Budget", action: "focus-save-budget" },
    secondary: { label: "Send To Campaign", route: "campaign-studio" }
  },
  insights: {
    eyebrow: "Intelligence",
    title: "Intelligence & Optimization Dashboard",
    description: "Turn performance, channel health, risk alerts, and learning memory into clear optimization moves.",
    primary: { label: "Generate Recommendations", route: "ai-command" },
    secondary: { label: "Open Research", route: "research" }
  },
  research: {
    eyebrow: "Market Intelligence",
    title: "Market Intelligence Center",
    description: "Capture competitors, trends, keywords, audience insights, opportunities, and campaign-ready findings.",
    primary: { label: "Run Competitor Research", action: "focus-run-research" },
    secondary: { label: "Send To Campaign", route: "campaign-studio" }
  },
  settings: {
    eyebrow: "Configuration",
    title: "System Configuration Center",
    description: "Configure project settings, AI mode, roles, publishing rules, approvals, and readiness safeguards.",
    primary: { label: "Save Settings", action: "focus-save-settings" },
    secondary: { label: "Check Governance", route: "governance" }
  }
};

const ROUTE_FLOW = {
  home: { previous: "Settings", next: "Setup" },
  setup: { previous: "Home", next: "Library" },
  library: { previous: "Setup", next: "Integrations" },
  integrations: { previous: "Library", next: "Campaign Studio" },
  "campaign-studio": { previous: "Integrations", next: "Content Studio" },
  "content-studio": { previous: "Campaign Studio", next: "Media Studio" },
  "media-studio": { previous: "Content Studio", next: "Publishing" },
  publishing: { previous: "Media Studio", next: "Insights" },
  insights: { previous: "Publishing", next: "AI Command" },
  "ai-command": { previous: "Insights", next: "Workflows" },
  workflows: { previous: "AI Command", next: "Ads Manager" },
  "ads-manager": { previous: "Workflows", next: "Research" },
  research: { previous: "Ads Manager", next: "Settings" },
  settings: { previous: "Research", next: "Home" }
};

const ROUTE_ACTIONS = {
  home: [
    { label: "Open setup priorities", description: "Check the foundation before running another campaign wave.", route: "setup" },
    { label: "Review blockers", description: "Use readiness gaps and alerts as the operating queue.", route: "notification-center" },
    { label: "Ask executive AI", description: "Turn system state into a short action plan.", route: "ai-command" }
  ],
  setup: [
    { label: "Complete missing fields", description: "Jump to the guided completion helper for required setup gaps.", action: "focus-complete-setup" },
    { label: "Generate positioning with AI", description: "Apply AI suggestions for positioning, audience, and tone.", action: "focus-setup-ai" },
    { label: "Validate readiness", description: "Save setup and refresh readiness before continuing.", action: "focus-save" },
    { label: "Continue to Library", description: "Move from project foundation into required assets.", route: "library" }
  ],
  library: [
    { label: "Upload assets", description: "Add source files, product visuals, documents, or campaign packs.", action: "focus-upload" },
    { label: "Classify with AI", description: "Categorize files and propose source-of-truth candidates.", action: "focus-library-classify" },
    { label: "Review missing assets", description: "Prioritize files blocking campaign and publishing readiness.", action: "focus-library-missing" },
    { label: "Send to Campaign Studio", description: "Use approved assets as campaign inputs.", route: "campaign-studio" }
  ],
  integrations: [
    { label: "Connect platform", description: "Open the next recommended connector and add required fields.", action: "focus-connect-platform" },
    { label: "Test connection", description: "Run a connector health check before relying on the data.", action: "focus-test-connection" },
    { label: "Run sync", description: "Sync connected sources into intelligence and execution workflows.", action: "focus-sync" },
    { label: "Diagnose with AI", description: "Send connector failures and coverage gaps to AI Command.", action: "focus-integration-ai" }
  ],
  "ai-command": [
    { label: "Ask Strategist", description: "Plan campaign priorities and launch sequencing.", prompt: "Act as the Strategist. Review current project readiness and propose the next campaign decision." },
    { label: "Ask Writer", description: "Turn strategy into platform-ready copy tasks.", prompt: "Act as the Writer. Build content tasks from the active campaign and current performance signals." },
    { label: "Ask Analyst", description: "Explain risks, weak signals, and opportunities.", prompt: "Act as the Analyst. Summarize weak channels, risk alerts, and the highest-impact optimization." },
    { label: "Run structured task", description: "Use the command composer for repeatable AI output.", action: "focus-ai-send" }
  ],
  workflows: [
    { label: "Run workflow", description: "Execute the selected workflow with current project inputs.", action: "focus-run-workflow" },
    { label: "Build custom workflow with AI", description: "Ask AI to assemble a workflow for the current blocker.", action: "focus-build-workflow" },
    { label: "View running workflows", description: "Inspect active and recent execution state.", route: "job-monitor" },
    { label: "Send output forward", description: "Route the latest workflow result into the owning workspace.", action: "focus-workflow-route" }
  ],
  "campaign-studio": [
    { label: "Build campaign", description: "Generate or update the campaign plan and launch wave.", action: "focus-save-campaign" },
    { label: "Generate launch wave", description: "Use intelligence to choose channel sequence and dependencies.", action: "focus-campaign-ai" },
    { label: "Create execution package", description: "Prepare handoffs for content, media, paid, and publishing.", action: "focus-campaign-package" },
    { label: "Send to Content Studio", description: "Move campaign strategy into production copy.", route: "content-studio" }
  ],
  "content-studio": [
    { label: "Generate content", description: "Create or update the selected content record.", action: "focus-new-content" },
    { label: "Rewrite or translate", description: "Record an AI rewrite request for the selected item.", action: "focus-content-ai" },
    { label: "Approve content", description: "Move selected copy through the review workflow.", action: "focus-content-approval" },
    { label: "Send to Publishing", description: "Route approved content into execution.", route: "publishing" }
  ],
  "media-studio": [
    { label: "Generate image prompt", description: "Create a media job and attach prompt guidance.", action: "focus-new-media-image" },
    { label: "Generate video storyboard", description: "Start a video or storyboard request for the active campaign.", action: "focus-new-media-video" },
    { label: "Approve media", description: "Move selected creative through review.", action: "focus-media-approval" },
    { label: "Save to Library", description: "Route approved media assets back to the asset source.", route: "library" }
  ],
  publishing: [
    { label: "Schedule job", description: "Create or update the selected publish queue item.", action: "focus-schedule" },
    { label: "Run worker once", description: "Open job monitoring for worker and execution state.", route: "job-monitor" },
    { label: "Copy publish payload", description: "Send selected publishing context to AI Command for packaging.", action: "focus-publishing-ai" },
    { label: "Retry failed jobs", description: "Requeue failed or blocked publishing work.", action: "focus-retry-publishing" }
  ],
  "ads-manager": [
    { label: "Build ad brief", description: "Turn campaign inputs into a paid growth plan.", route: "campaign-studio" },
    { label: "Generate variants", description: "Ask AI for ad angles, copy variants, and test matrix.", prompt: "Build paid ad variants for the active campaign using current audience, channel, and readiness signals." },
    { label: "Suggest budget", description: "Review budget inputs and paid readiness before launch.", action: "focus-save-budget" },
    { label: "Send to Campaign", description: "Route paid plan back into Campaign Studio.", route: "campaign-studio" }
  ],
  insights: [
    { label: "Generate recommendations", description: "Ask AI to turn performance signals into priorities.", route: "ai-command" },
    { label: "Record feedback", description: "Preserve what worked and what failed in learning memory.", route: "ai-command" },
    { label: "Scale winner", description: "Send winning signals into campaign planning.", route: "campaign-studio" },
    { label: "Improve weak channel", description: "Route weak-channel fixes into content, ads, or publishing.", route: "content-studio" }
  ],
  research: [
    { label: "Run competitor research", description: "Refresh market and competitor intelligence.", action: "focus-run-research" },
    { label: "Find keywords", description: "Build a search opportunity list from market context.", prompt: "Find keyword and audience opportunities for the active market. Prioritize campaign-ready angles." },
    { label: "Save finding", description: "Capture the selected market insight for reuse.", action: "focus-save-research" },
    { label: "Send insight to Campaign", description: "Route positioning or opportunity notes into Campaign Studio.", route: "campaign-studio" }
  ],
  settings: [
    { label: "Save settings", description: "Persist project, AI, team, publishing, and approval configuration.", action: "focus-save-settings" },
    { label: "Configure AI mode", description: "Review how autonomous the AI system is allowed to be.", action: "focus-settings-ai" },
    { label: "Update roles", description: "Inspect team permissions and route access.", action: "focus-settings-roles" },
    { label: "Check production readiness", description: "Review critical safeguards before live execution.", action: "focus-settings-critical" }
  ]
};

const ROUTE_AI = {
  home: {
    title: "Executive AI Chief of Staff",
    description: "Ask for the one move that most improves the operating picture.",
    prompts: [
      "Summarize the current system health, blockers, active campaign, and one next action.",
      "Turn current alerts and readiness gaps into owner-by-owner actions."
    ]
  },
  setup: {
    title: "Setup Architect",
    description: "Use AI to complete missing fields and sharpen positioning before assets or campaigns begin.",
    prompts: [
      "Audit missing setup fields and rank them by launch risk.",
      "Generate positioning, audience, and tone suggestions from the current setup data."
    ]
  },
  library: {
    title: "Asset Librarian",
    description: "Use AI to classify files, identify missing source-of-truth assets, and extract useful claims.",
    prompts: [
      "Classify current assets and recommend which files should be source-of-truth.",
      "Prioritize missing assets by campaign, media, and publishing impact."
    ]
  },
  integrations: {
    title: "Connector Diagnostician",
    description: "Use AI to explain failed connectors, data coverage gaps, and sync priorities.",
    prompts: [
      "Diagnose the current integration gaps and rank what to connect first.",
      "Create a connector recovery plan for failed or partially configured platforms."
    ]
  },
  "ai-command": {
    title: "AI Operations Director",
    description: "Use structured prompts to delegate work to the right AI role and route artifacts onward.",
    prompts: [
      "Build a structured task plan from current project signals.",
      "Recommend which AI role should handle the highest-risk blocker next."
    ]
  },
  workflows: {
    title: "Workflow Builder",
    description: "Use AI to choose the next workflow, fill inputs, and route the generated output.",
    prompts: [
      "Recommend the next workflow run and explain the expected output.",
      "Build a custom workflow for the current campaign blocker."
    ]
  },
  "campaign-studio": {
    title: "Campaign Strategist",
    description: "Use AI to sequence launch waves and turn readiness gaps into execution steps.",
    prompts: [
      "Audit campaign readiness across channels, content, media, paid, and publishing.",
      "Generate the next launch wave with dependencies and handoffs."
    ]
  },
  "content-studio": {
    title: "Content Lead",
    description: "Use AI to draft, rewrite, translate, and prepare platform-specific content.",
    prompts: [
      "Generate platform copy variants for the active campaign.",
      "Rewrite the selected draft for clarity, compliance, and conversion."
    ]
  },
  "media-studio": {
    title: "Visual Director",
    description: "Use AI to create image prompts, video storyboards, and production-ready media tasks.",
    prompts: [
      "Generate image prompt packs for weak or missing campaign channels.",
      "Create a video storyboard for the active launch wave."
    ]
  },
  publishing: {
    title: "Publishing Operator",
    description: "Use AI to prioritize the queue, package payloads, and recover failed execution.",
    prompts: [
      "Prioritize the scheduler queue by urgency, readiness, and campaign impact.",
      "Generate a retry plan for failed or blocked publishing jobs."
    ]
  },
  "ads-manager": {
    title: "Paid Growth Analyst",
    description: "Use AI to turn campaign goals into paid briefs, variants, audiences, and budget guidance.",
    prompts: [
      "Build an ad test matrix with audiences, creative angles, and success metrics.",
      "Suggest budget allocation from the current paid readiness and tracking state."
    ]
  },
  insights: {
    title: "Optimization Analyst",
    description: "Use AI to explain winners, weak channels, risks, and learning-memory updates.",
    prompts: [
      "Explain the weakest channels and recommend immediate recovery actions.",
      "Turn current insights into campaign, content, ads, and publishing tasks."
    ]
  },
  research: {
    title: "Market Research Analyst",
    description: "Use AI to convert trends, competitors, keywords, and audience findings into strategy.",
    prompts: [
      "Summarize the top market opportunities and evidence gaps for this project.",
      "Translate saved findings into campaign-ready positioning and content angles."
    ]
  },
  settings: {
    title: "System Safety Advisor",
    description: "Use AI to review AI mode, roles, publishing safeguards, and production readiness.",
    prompts: [
      "Review settings for operational risk and recommend what to tighten before publishing.",
      "Suggest the best AI automation mode for the current project maturity."
    ]
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

function pct(value) {
  return `${Math.max(0, Math.round(asNumber(value, 0)))}%`;
}

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function titleize(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

function textValue(value, fallback = "-") {
  if (value == null || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return asString(value) || fallback;
  }
  if (Array.isArray(value)) {
    return value.map((item) => textValue(item, "")).filter(Boolean).join(", ") || fallback;
  }
  if (typeof value === "object") {
    return textValue(value.title || value.label || value.name || value.action || value.summary || value.description || value.status, fallback);
  }
  return fallback;
}

function firstText(values, fallback = "-") {
  for (const value of asArray(values)) {
    const text = textValue(value, "");
    if (text) return text;
  }
  return fallback;
}

function countByStatus(items, statuses) {
  const wanted = new Set(statuses);
  return asArray(items).filter((item) => wanted.has(asString(item?.status || item?.execution_status || item?.approval_status || item?.publish_status).toLowerCase())).length;
}

function tone(input) {
  const t = asString(input).toLowerCase();
  if (
    t.includes("fail") ||
    t.includes("error") ||
    t.includes("critical") ||
    t.includes("blocked") ||
    t.includes("risk") ||
    t.includes("missing")
  ) return "danger";
  if (t.includes("warn") || t.includes("pending") || t.includes("partial") || t.includes("queue")) return "warning";
  if (t.includes("ready") || t.includes("healthy") || t.includes("active") || t.includes("connected") || t.includes("complete")) return "success";

  const n = Number(input);
  if (Number.isFinite(n)) {
    if (n >= 80) return "success";
    if (n >= 50) return "warning";
    return "danger";
  }
  return "neutral";
}

function metrics(state) {
  const overview = asObject(state.data.overview?.overview);
  const readiness = asObject(state.data.readiness?.dashboard);
  const readinessRoot = asObject(state.data.readiness);
  const readinessPriorities = asObject(readiness.priorities || readinessRoot.priorities);
  const integrations = asObject(state.data.integrations?.readiness);
  const integrationRoot = asObject(state.data.integrations);
  const ops = asObject(state.data.operations);
  const activity = asObject(state.data.activity);
  const assetsData = asObject(state.data.assets);

  const checks = asObject(integrations.checks);
  const checkKeys = Object.keys(checks);
  const integrationSources = asObject(integrationRoot.sources?.sources || integrationRoot.sources || {});
  const sourceRecords = Object.values(integrationSources);
  const connected = checkKeys.filter((key) => Boolean(checks[key])).length;
  const connectedSources = sourceRecords.filter((item) => /connected|active|ok/i.test(textValue(item.value || item.status || item.status_label, ""))).length;
  const scheduled = asArray(activity.scheduled_jobs);
  const executions = asArray(activity.execution_results);
  const failed = executions.filter((item) => tone(item.execution_status) === "danger").length;
  const completed = executions.filter((item) => tone(item.execution_status) === "success").length;
  const notifications = asArray(ops.notifications?.items);
  const unread = notifications.filter((item) => !item?.read_at).length;
  const assetItems = asArray(assetsData.assets);
  const assetCategories = asArray(assetsData.category_readiness?.categories);
  const missingAssetLabels = [
    ...asArray(assetsData.missing_assets?.assets),
    ...asArray(assetsData.missing_assets?.missing),
    ...asArray(assetsData.missing_assets?.blockers)
  ].map((item) => textValue(item, "")).filter(Boolean);
  const requiredAssetCount = asArray(assetsData.missing_assets?.required_asset_types).length ||
    assetCategories.filter((item) => item?.required !== false).length;
  const missingAssetsCount = new Set([
    ...missingAssetLabels,
    ...assetCategories
      .filter((item) => item?.required !== false && ["missing", "needs review"].includes(asString(item.status).toLowerCase()))
      .map((item) => textValue(item.display_label || item.label || item.asset_type, ""))
      .filter(Boolean)
  ]).size;
  const campaigns = asArray(ops.campaigns?.items);
  const contentItems = asArray(ops.content_items?.items);
  const mediaJobs = asArray(ops.media_jobs?.items);
  const workflowItems = asArray(ops.workflows?.items || ops.workflow_runs?.items);
  const aiCommands = asArray(ops.ai_commands?.items);
  const aiArtifacts = asArray(ops.ai_artifacts?.items);
  const publishingQueue = asArray(ops.queues?.items).filter((item) => asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing");
  const insights = asObject(activity.insights);
  const learning = asObject(activity.learning);
  const paid = asObject(insights.paid || insights.paid_media || {});
  const paidCampaigns = asArray(paid.campaigns || paid.best_campaigns || paid.weak_campaigns);

  return {
    currentProject: asString(state.context?.currentProject),
    activeCampaign: asString(state.context?.activeCampaign),
    market: firstText([overview.market, state.context?.currentMarket], "Not set"),
    language: firstText([overview.language], "Not set"),
    currency: firstText([overview.currency], "Not set"),
    hasBrandProfile: Boolean(overview.brand_profile || overview.brand_assets || overview.brand_voice || overview.brand_name),
    setupMissingCount: asArray(readiness.missing).length + asArray(readinessRoot.missing_fields).length + asArray(readinessPriorities.critical).length,
    systemScore: asNumber(readiness.readiness_score ?? overview.readiness_score, 0),
    projectReadiness: asNumber(readiness.readiness_score ?? overview.readiness_score, 0),
    connectorReadiness: asNumber(integrations.readiness_score ?? overview.connector_readiness_score, 0),
    activeCampaigns: new Set([...scheduled, ...executions].map((x) => asString(x.wave_name).trim()).filter(Boolean)).size,
    scheduled: scheduled.length,
    completed,
    failed,
    unread,
    connected: Math.max(connected, connectedSources),
    totalChannels: Math.max(checkKeys.length, sourceRecords.length, 0),
    recommendations: [
      ...asArray(readiness.next_best_actions),
      ...asArray(insights.recommendations),
      ...asArray(insights.ai_recommendations),
      ...asArray(learning.recommendations),
      ...asArray(ops.ai_recommendations?.items)
    ].map((item) => textValue(item, "")).filter(Boolean),
    missingConnectors: asArray(integrations.missing),
    failedConnectors: [
      ...asArray(integrations.failed),
      ...sourceRecords.filter((item) => /fail|error|expired|disconnect/i.test(textValue(item.status || item.status_label || item.health, "")))
    ],
    assetsTotal: assetItems.length,
    requiredAssets: requiredAssetCount,
    missingAssets: Array.from({ length: missingAssetsCount }),
    missingAssetsCount,
    readyAssetCount: Math.max(0, requiredAssetCount - missingAssetsCount),
    sourceOfTruthAssets: assetItems.filter((item) => Boolean(item.source_of_truth || item.use_as_source_of_truth)).length,
    campaignsTotal: asNumber(ops.campaigns?.total, campaigns.length),
    activeCampaignRecords: asNumber(ops.campaigns?.active_count, campaigns.filter((item) => asString(item.status) === "active").length),
    contentTotal: asNumber(ops.content_items?.total, contentItems.length),
    contentDrafts: asNumber(ops.content_items?.draft_count, countByStatus(contentItems, ["draft"])),
    contentReview: asNumber(ops.content_items?.pending_approval_count, countByStatus(contentItems, ["in_review", "pending"])),
    contentApproved: countByStatus(contentItems, ["approved", "scheduled", "published"]),
    mediaTotal: asNumber(ops.media_jobs?.total, mediaJobs.length),
    mediaOpen: asNumber(ops.media_jobs?.open_count, mediaJobs.filter((item) => !["completed", "failed", "cancelled"].includes(asString(item.status))).length),
    mediaCompleted: countByStatus(mediaJobs, ["completed"]),
    mediaFailed: countByStatus(mediaJobs, ["failed", "cancelled"]),
    workflowTotal: asNumber(ops.workflows?.total_runs ?? ops.workflow_runs?.total, workflowItems.length),
    workflowCompleted: asNumber(ops.workflows?.completed_runs, countByStatus(workflowItems, ["completed"])),
    workflowRunning: countByStatus(workflowItems, ["queued", "running"]),
    workflowFailed: countByStatus(workflowItems, ["failed", "cancelled"]),
    aiCommandsTotal: asNumber(ops.ai_commands?.total, aiCommands.length),
    aiCommandsCompleted: asNumber(ops.ai_commands?.completed_count, countByStatus(aiCommands, ["completed"])),
    aiArtifacts: asNumber(ops.ai_artifacts?.total, aiArtifacts.length),
    aiRecommendationsOpen: asNumber(ops.ai_recommendations?.open_count, 0),
    publishingReady: countByStatus(publishingQueue, ["ready", "manual_publish_ready"]) + scheduled.length,
    publishingCompleted: countByStatus(publishingQueue, ["published", "completed"]) + completed,
    publishingFailed: countByStatus(publishingQueue, ["failed"]) + failed,
    criticalAlerts: asNumber(ops.notification_center?.critical_count, 0),
    learningCount: [
      ...asArray(learning.system_lessons),
      ...asArray(learning.reusable_insights),
      ...asArray(ops.ai_memory?.items)
    ].length,
    paidCampaigns: paidCampaigns.length,
    weakPaidCampaigns: asArray(paid.weak_campaigns).length,
    paidTrackingReady: Math.max(connected, connectedSources) > 0 || paidCampaigns.length > 0,
    researchFindings: aiArtifacts.filter((item) => /research|competitor|market|keyword/i.test(textValue(item.type || item.title || item.summary, ""))).length,
    savedFindings: asArray(ops.handoffs?.items).filter((item) => asString(item.source_page) === "research").length,
    teamRoles: asArray(ops.team_service_model?.role_matrix).length || asArray(ops.team?.members).length,
    approvalsPending: asNumber(ops.approvals?.pending_count, 0),
    approvalRulesReady: Boolean(ops.governance?.policy_rules),
    securityStatus: ops.backbone?.status || "operational"
  };
}

function card(label, value, description, status = "neutral") {
  return { label, value: textValue(value), description, status };
}

function kpiCards(route, m) {
  const cards = {
    home: [
      card("System health", pct(m.systemScore), "Readiness and connector coverage combined into an executive signal.", tone(m.systemScore)),
      card("Automation", m.failed ? "Needs attention" : m.scheduled ? "Active" : "Idle", "Execution and scheduler state across active work.", m.failed ? "danger" : m.scheduled ? "success" : "warning"),
      card("AI team", `${m.aiCommandsTotal} commands`, "Role-aware AI work and generated artifacts available to route.", m.aiCommandsTotal ? "success" : "neutral"),
      card("Critical blockers", String(m.criticalAlerts + m.failed + m.missingAssets.length), "Alerts, failed jobs, and missing launch inputs.", m.criticalAlerts + m.failed + m.missingAssets.length ? "warning" : "success")
    ],
    setup: [
      card("Setup completion", pct(m.projectReadiness), "Brand, market, language, audience, and goal readiness.", tone(m.projectReadiness)),
      card("Missing fields", String(m.setupMissingCount), "Required baseline inputs that still need attention.", m.setupMissingCount ? "warning" : "success"),
      card("Brand profile", m.hasBrandProfile ? "Ready" : "Needs input", "Positioning and brand context used by downstream AI.", m.hasBrandProfile ? "success" : "warning"),
      card("Market / language", `${m.market} / ${m.language}`, "Localization context for copy, campaigns, and publishing.", m.market !== "Not set" && m.language !== "Not set" ? "success" : "warning"),
      card("Currency", m.currency, "Commercial context for offers, ads, and campaign planning.", m.currency !== "Not set" ? "success" : "neutral")
    ],
    library: [
      card("Total assets", String(m.assetsTotal), "Files registered for brand, product, content, media, and publishing.", m.assetsTotal ? "success" : "warning"),
      card("Required assets", `${m.readyAssetCount}/${m.requiredAssets || 0}`, "Required categories covered by uploaded or approved assets.", m.missingAssets.length ? "warning" : "success"),
      card("Missing assets", String(m.missingAssets.length), "Files needed before campaigns can move cleanly to execution.", m.missingAssets.length ? "danger" : "success"),
      card("Source of truth", String(m.sourceOfTruthAssets), "Assets marked as authoritative for AI and production workflows.", m.sourceOfTruthAssets ? "success" : "warning")
    ],
    integrations: [
      card("Connected platforms", `${m.connected}/${m.totalChannels || 0}`, "Platforms currently available for data, sync, or execution.", m.connected ? "success" : "warning"),
      card("Missing platforms", String(Math.max(m.missingConnectors.length, m.totalChannels - m.connected)), "Connections still blocking automation or intelligence coverage.", m.missingConnectors.length ? "warning" : "success"),
      card("Failed connectors", String(m.failedConnectors.length), "Connectors that need reconnect, test, or credential review.", m.failedConnectors.length ? "danger" : "success"),
      card("Sync health", m.failed ? "At risk" : "Stable", "Recent execution and sync signals from connected systems.", m.failed ? "warning" : "success")
    ],
    "ai-command": [
      card("AI agents", String(Math.max(m.teamRoles, 8)), "Role-aware strategy, writing, media, paid, analyst, and operations agents.", "success"),
      card("Recent commands", String(m.aiCommandsTotal), "Structured and freeform commands recorded by the OS.", m.aiCommandsTotal ? "success" : "neutral"),
      card("Artifacts", String(m.aiArtifacts), "Generated outputs ready to inspect or route into workspaces.", m.aiArtifacts ? "success" : "warning"),
      card("Recommendations", String(m.aiRecommendationsOpen || m.recommendations.length), "AI-suggested actions waiting for operator decision.", m.aiRecommendationsOpen || m.recommendations.length ? "warning" : "neutral")
    ],
    workflows: [
      card("Workflow catalog", "Available", "Launch, content, campaign, ads, report, and research workflows.", "success"),
      card("Running workflows", String(m.workflowRunning), "Queued or active workflow runs.", m.workflowRunning ? "warning" : "neutral"),
      card("Completed workflows", String(m.workflowCompleted), "Workflow outputs available for routing.", m.workflowCompleted ? "success" : "neutral"),
      card("Failed workflows", String(m.workflowFailed), "Runs requiring diagnosis or retry.", m.workflowFailed ? "danger" : "success")
    ],
    "campaign-studio": [
      card("Campaign pipeline", `${m.activeCampaignRecords}/${m.campaignsTotal}`, "Active campaigns compared with total saved campaign records.", m.activeCampaignRecords ? "success" : "warning"),
      card("Channel readiness", pct(m.connectorReadiness), "Connected channels and integrations available for launch.", tone(m.connectorReadiness)),
      card("Content readiness", String(m.contentApproved), "Approved, scheduled, or published content items.", m.contentApproved ? "success" : "warning"),
      card("Media readiness", String(m.mediaCompleted), "Completed visual production jobs available to campaigns.", m.mediaCompleted ? "success" : "warning"),
      card("Publishing readiness", String(m.publishingReady), "Jobs ready or scheduled for execution.", m.publishingReady ? "success" : "neutral")
    ],
    "content-studio": [
      card("Drafts", String(m.contentDrafts), "Content records still in draft state.", m.contentDrafts ? "warning" : "neutral"),
      card("In review", String(m.contentReview), "Copy waiting for approval or changes.", m.contentReview ? "warning" : "success"),
      card("Approved content", String(m.contentApproved), "Items ready to route into publishing.", m.contentApproved ? "success" : "warning"),
      card("Platform copy", String(m.contentTotal), "Total copy records tracked by Content Studio.", m.contentTotal ? "success" : "neutral")
    ],
    "media-studio": [
      card("Media jobs", String(m.mediaTotal), "Image, video, prompt, and storyboard work tracked by the OS.", m.mediaTotal ? "success" : "neutral"),
      card("Open jobs", String(m.mediaOpen), "Requested, queued, processing, or review-state media work.", m.mediaOpen ? "warning" : "success"),
      card("Generated assets", String(m.mediaCompleted), "Completed creative jobs available for campaigns or publishing.", m.mediaCompleted ? "success" : "warning"),
      card("Failed media", String(m.mediaFailed), "Creative jobs requiring revision or recovery.", m.mediaFailed ? "danger" : "success")
    ],
    publishing: [
      card("Scheduler queue", String(m.scheduled + m.publishingReady), "Queued, ready, or scheduled publishing work.", m.scheduled + m.publishingReady ? "warning" : "neutral"),
      card("Manual publish ready", String(m.publishingReady), "Items ready for approval or manual release.", m.publishingReady ? "success" : "neutral"),
      card("Completed jobs", String(m.publishingCompleted), "Publishing executions completed recently.", m.publishingCompleted ? "success" : "neutral"),
      card("Failed / retryable", String(m.publishingFailed), "Jobs requiring retry, repair, or manual diagnosis.", m.publishingFailed ? "danger" : "success")
    ],
    "ads-manager": [
      card("Ad briefs", String(m.campaignsTotal), "Campaign records available for paid brief planning.", m.campaignsTotal ? "success" : "warning"),
      card("Ad variants", String(m.paidCampaigns), "Paid campaign or creative performance records available.", m.paidCampaigns ? "success" : "neutral"),
      card("Audience segments", m.market, "Market context available for audience planning.", m.market !== "Not set" ? "success" : "warning"),
      card("Tracking status", m.paidTrackingReady ? "Ready" : "Needs connection", "Paid and analytics data available for budget decisions.", m.paidTrackingReady ? "success" : "warning")
    ],
    insights: [
      card("Performance summary", String(m.recommendations.length), "Optimization recommendations generated from available data.", m.recommendations.length ? "success" : "warning"),
      card("Top channels", String(m.connected), "Connected sources that can contribute performance signals.", m.connected ? "success" : "warning"),
      card("Weak channels", String(m.missingConnectors.length + m.weakPaidCampaigns), "Missing or weak sources that limit optimization.", m.missingConnectors.length + m.weakPaidCampaigns ? "warning" : "success"),
      card("Learning memory", String(m.learningCount), "Reusable lessons captured for future campaign decisions.", m.learningCount ? "success" : "neutral")
    ],
    research: [
      card("Competitors", String(m.researchFindings), "Saved or generated competitor and market artifacts.", m.researchFindings ? "success" : "neutral"),
      card("Trends", String(m.recommendations.length), "Opportunity and recommendation signals available for strategy.", m.recommendations.length ? "success" : "warning"),
      card("Keywords", m.market, "Market context used to create keyword opportunities.", m.market !== "Not set" ? "success" : "warning"),
      card("Saved findings", String(m.savedFindings), "Research handoffs preserved for downstream work.", m.savedFindings ? "success" : "neutral")
    ],
    settings: [
      card("Project settings", m.currentProject ? "Selected" : "No project", "The active project scope for configuration changes.", m.currentProject ? "success" : "warning"),
      card("AI settings", m.aiCommandsTotal ? "In use" : "Configurable", "AI command and automation behavior can be governed here.", "success"),
      card("Team roles", String(m.teamRoles), "Roles and route permissions available to the operating system.", m.teamRoles ? "success" : "warning"),
      card("Approval rules", m.approvalRulesReady ? "Configured" : "Default", "Publishing and claim-safety review policy state.", m.approvalRulesReady ? "success" : "warning"),
      card("Security status", titleize(m.securityStatus), "Backbone and configuration status for operational safety.", tone(m.securityStatus))
    ]
  };

  return asArray(cards[route] || cards.home).slice(0, 5);
}

function statusCards(route, m) {
  const cards = {
    setup: [
      card("Ready", m.projectReadiness >= 80 ? "Ready" : "Not yet", "Setup can support downstream workflows once required inputs are complete.", tone(m.projectReadiness)),
      card("Missing", String(m.setupMissingCount), "Fields or validation items still blocking confidence.", m.setupMissingCount ? "warning" : "success"),
      card("Next step", m.setupMissingCount ? "Fill gaps" : "Continue to Library", "Recommended setup progression.", m.setupMissingCount ? "warning" : "success")
    ],
    library: [
      card("Ready", m.missingAssets.length ? "Incomplete" : "Ready", "Required asset categories for production and publishing.", m.missingAssets.length ? "warning" : "success"),
      card("Missing", String(m.missingAssets.length), "Required asset types still absent or needing review.", m.missingAssets.length ? "danger" : "success"),
      card("Next step", m.missingAssets.length ? "Upload required asset" : "Route to Campaign Studio", "Asset workflow continuation.", m.missingAssets.length ? "warning" : "success")
    ],
    integrations: [
      card("Ready", m.connected ? "Partially ready" : "Needs connection", "Availability of connected platforms.", m.connected ? "success" : "warning"),
      card("Failed", String(m.failedConnectors.length), "Connectors requiring diagnosis.", m.failedConnectors.length ? "danger" : "success"),
      card("Next step", m.missingConnectors.length ? "Connect critical platform" : "Run sync", "Best connector action to improve intelligence.", m.missingConnectors.length ? "warning" : "success")
    ],
    "ai-command": [
      card("Ready", "Composer ready", "AI command composer and role mode are available.", "success"),
      card("Artifacts", String(m.aiArtifacts), "Generated outputs ready to open or route.", m.aiArtifacts ? "success" : "neutral"),
      card("Next step", m.recommendations.length ? "Run recommendation" : "Ask a role agent", "Best AI action for the current state.", m.recommendations.length ? "warning" : "success")
    ],
    workflows: [
      card("Running", String(m.workflowRunning), "Queued or active workflow runs.", m.workflowRunning ? "warning" : "neutral"),
      card("Completed", String(m.workflowCompleted), "Finished workflow outputs.", m.workflowCompleted ? "success" : "neutral"),
      card("Failed", String(m.workflowFailed), "Runs that need retry or inspection.", m.workflowFailed ? "danger" : "success")
    ],
    "campaign-studio": [
      card("Ready", m.projectReadiness >= 80 && !m.missingAssets.length ? "Ready" : "Needs inputs", "Campaign quality depends on setup, assets, and connector readiness.", m.projectReadiness >= 80 && !m.missingAssets.length ? "success" : "warning"),
      card("Needs attention", String(m.missingAssets.length + m.missingConnectors.length), "Asset or connector blockers before execution.", m.missingAssets.length + m.missingConnectors.length ? "warning" : "success"),
      card("Next step", "Build launch wave", "Prepare the campaign for content, media, paid, and publishing handoffs.", "success")
    ],
    "content-studio": [
      card("Draft", String(m.contentDrafts), "Copy waiting for production work.", m.contentDrafts ? "warning" : "neutral"),
      card("Review", String(m.contentReview), "Content needing approval or revision.", m.contentReview ? "warning" : "success"),
      card("Next step", m.contentDrafts ? "Generate content" : "Send to Publishing", "Move copy toward approved execution.", m.contentDrafts ? "warning" : "success")
    ],
    "media-studio": [
      card("Open", String(m.mediaOpen), "Media requests still active.", m.mediaOpen ? "warning" : "success"),
      card("Completed", String(m.mediaCompleted), "Assets ready for use.", m.mediaCompleted ? "success" : "neutral"),
      card("Next step", m.mediaOpen ? "Review active job" : "Generate media", "Keep creative production moving.", m.mediaOpen ? "warning" : "success")
    ],
    publishing: [
      card("Due", String(m.scheduled), "Scheduled jobs waiting for execution.", m.scheduled ? "warning" : "neutral"),
      card("Failed", String(m.publishingFailed), "Jobs requiring retry or manual recovery.", m.publishingFailed ? "danger" : "success"),
      card("Worker state", m.publishingFailed ? "Recovery needed" : "Stable", "Execution readiness based on recent publishing state.", m.publishingFailed ? "danger" : "success")
    ],
    "ads-manager": [
      card("Paid readiness", m.paidTrackingReady ? "Ready" : "Needs tracking", "Paid planning quality depends on tracking and campaign context.", m.paidTrackingReady ? "success" : "warning"),
      card("Weak campaigns", String(m.weakPaidCampaigns), "Paid signals that need creative, audience, or budget changes.", m.weakPaidCampaigns ? "warning" : "success"),
      card("Next step", "Build ad brief", "Prepare variants and budget guidance for Campaign Studio.", "success")
    ],
    insights: [
      card("Ready", m.recommendations.length ? "Recommendations ready" : "Needs signal", "Insights are useful when data and learning memory exist.", m.recommendations.length ? "success" : "warning"),
      card("Risk alerts", String(m.criticalAlerts), "Critical intelligence or operational warnings.", m.criticalAlerts ? "danger" : "success"),
      card("Next step", m.recommendations.length ? "Convert to tasks" : "Connect data sources", "Best way to make insights actionable.", m.recommendations.length ? "success" : "warning")
    ],
    research: [
      card("Saved findings", String(m.savedFindings), "Research routed into downstream work.", m.savedFindings ? "success" : "neutral"),
      card("Opportunities", String(m.recommendations.length), "Strategy opportunities available from current intelligence.", m.recommendations.length ? "success" : "warning"),
      card("Next step", "Send insight to Campaign", "Turn market intelligence into positioning or campaign structure.", "success")
    ],
    settings: [
      card("Ready", m.currentProject ? "Project selected" : "Select project", "Settings are scoped to the active project.", m.currentProject ? "success" : "warning"),
      card("Needs attention", String(m.approvalsPending), "Pending approvals that may affect policy and publishing.", m.approvalsPending ? "warning" : "success"),
      card("Next step", "Save configuration", "Persist the safest operating posture before execution.", "success")
    ]
  };

  return asArray(cards[route] || [
    card("Ready", m.systemScore >= 80 ? "Ready" : "Needs attention", "Current route readiness.", tone(m.systemScore)),
    card("Needs attention", String(m.criticalAlerts + m.failed), "Critical alerts and execution failures.", m.criticalAlerts + m.failed ? "warning" : "success"),
    card("Next step", firstText([m.recommendations[0]], "Ask AI for guidance"), "Recommended operating move.", m.recommendations.length ? "warning" : "neutral")
  ]);
}

function nextBestAction(route, m) {
  const map = {
    home: "Review the highest-risk blocker and ask AI Command for an owner-by-owner plan.",
    setup: "Complete missing setup fields, save, then continue to the Library.",
    library: "Upload the most important missing required asset and classify it with AI.",
    integrations: "Connect or repair the highest-impact missing platform, then run a sync.",
    "ai-command": "Run a structured task for the highest-risk blocker and route the artifact.",
    workflows: "Run the workflow with the strongest launch impact and send the output forward.",
    "campaign-studio": "Build the next launch wave and route the package to Content Studio.",
    "content-studio": "Generate or approve the next content item and send it to Publishing.",
    "media-studio": "Create the missing prompt pack or storyboard, then approve media for use.",
    publishing: "Clear failed or ready jobs before scheduling more work.",
    "ads-manager": "Build an ad brief, generate variants, and return the plan to Campaign Studio.",
    insights: "Convert the top recommendation into campaign, content, ads, or publishing work.",
    research: "Save the strongest market finding and send it to Campaign Studio.",
    settings: "Save the current operating policy and review production readiness."
  };

  return firstText([m.recommendations[0], map[route]], map.home);
}

function ensureShell(page) {
  const existing = page.querySelector(".std-page-shell");
  if (existing) return existing;

  const previousNodes = Array.from(page.childNodes);
  const shell = document.createElement("div");
  shell.className = "std-page-shell";
  shell.innerHTML = `
    <section class="std-page-header" data-ui-role="page-header">
      <div class="std-page-header-copy">
        <p class="page-subtitle std-page-eyebrow" id="stdPageEyebrow">Control Center</p>
        <h2 class="page-title" id="stdPageTitle">Dashboard</h2>
        <p class="page-subtitle" id="stdPageDescription">Route overview</p>
      </div>
      <div class="toolbar std-header-actions" id="stdHeaderActions">
        <button type="button" class="btn btn-secondary" id="stdSecondaryAction">Secondary</button>
        <button type="button" class="btn btn-primary" id="stdPrimaryAction">Primary</button>
      </div>
    </section>

    <section class="std-section-block" data-ui-role="page-power-summary">
      <div class="section-header">
        <div>
          <p class="card-label">Page Power Summary</p>
          <h3 id="stdPowerTitle">What this page controls</h3>
        </div>
        <span class="badge badge-success">Capabilities</span>
      </div>
      <div class="kpi-grid" id="stdKpiGrid" data-ui-role="kpi-cards"></div>
    </section>

    <section class="std-section-block" data-ui-role="current-status">
      <div class="section-header">
        <div>
          <p class="card-label">Current Status</p>
          <h3 id="stdStatusTitle">Important operating state</h3>
        </div>
        <span class="badge" id="stdStatusBadge">Live</span>
      </div>
      <div class="dashboard-grid" id="stdStatusGrid" data-ui-role="status-cards"></div>
    </section>

    <section class="std-main-grid" data-ui-role="main-dashboard">
      <section class="std-work-area" data-ui-role="main-work-area">
        <div id="stdMainContentSlot" class="std-main-content-slot"></div>
      </section>

      <aside class="std-main-right" data-ui-role="route-side-panels">
        <section class="card std-action-panel" data-ui-role="action-panel">
          <div class="section-header">
            <div>
              <p class="card-label">Power Actions</p>
              <h3 id="stdActionTitle">Route actions</h3>
            </div>
            <span class="badge">Actions</span>
          </div>
          <div id="stdActionsList" class="std-actions-list"></div>
        </section>

        <section class="card action-card" data-ui-role="smart-next-action">
          <div class="section-header">
            <div>
              <p class="card-label">Smart Next Action</p>
              <h3 id="stdNextTitle">Recommended move</h3>
            </div>
            <span class="badge badge-warning">Priority</span>
          </div>
          <p id="stdNextBestAction" class="page-subtitle"></p>
          <button type="button" class="btn btn-primary std-full-width" id="stdNextBestActionBtn">Send To AI Command</button>
        </section>

        <section class="card ai-panel" data-ui-role="ai-panel">
          <div class="section-header">
            <div>
              <p class="card-label">Contextual AI Agent</p>
              <h3 id="stdAiTitle">AI assistant</h3>
            </div>
            <span class="badge badge-success">AI</span>
          </div>
          <p class="page-subtitle" id="stdAiDescription"></p>
          <div id="stdAiPrompts" class="std-ai-prompts"></div>
        </section>

        <details class="card std-advanced-details" data-ui-role="advanced-details">
          <summary>
            <span>View details</span>
            <span class="badge">Advanced</span>
          </summary>
          <div id="stdAdvancedDetails" class="std-advanced-grid"></div>
        </details>
      </aside>
    </section>
  `;

  page.innerHTML = "";
  page.appendChild(shell);

  const slot = shell.querySelector("#stdMainContentSlot");
  previousNodes.forEach((node) => slot?.appendChild(node));

  return shell;
}

function renderMetricCards(container, items) {
  if (!container) return;
  container.innerHTML = items
    .map((item) => `
      <article class="metric-card std-power-card is-${esc(item.status)}">
        <p class="card-label">${esc(item.label)}</p>
        <p class="metric-value">${esc(item.value)}</p>
        <p class="card-description">${esc(item.description)}</p>
        <span class="badge badge-${esc(item.status)}">${esc(titleize(item.status))}</span>
      </article>
    `)
    .join("");
}

function renderStatus(container, items) {
  if (!container) return;
  container.innerHTML = items
    .map((item) => `
      <article class="status-card is-${esc(item.status)}">
        <p class="card-label">${esc(item.label)}</p>
        <p class="metric-value">${esc(item.value)}</p>
        <p class="card-description">${esc(item.description)}</p>
        <span class="badge badge-${esc(item.status)}">${esc(titleize(item.status))}</span>
      </article>
    `)
    .join("");
}

function quickActions(route) {
  const common = [
    { label: "Open Home", route: "home" },
    { label: "Open AI Command", route: "ai-command" },
    { label: "Open Insights", route: "insights" }
  ];

  const routeActions = {
    home: [
      { label: "Open Setup", route: "setup" },
      { label: "Open Integrations", route: "integrations" },
      { label: "Open Campaign Studio", route: "campaign-studio" }
    ],
    setup: [
      { label: "Open Library", route: "library" },
      { label: "Open Campaign Studio", route: "campaign-studio" },
      { label: "Open Integrations", route: "integrations" }
    ],
    library: [
      { label: "Open Content Studio", route: "content-studio" },
      { label: "Open Media Studio", route: "media-studio" },
      { label: "Open Publishing", route: "publishing" }
    ],
    integrations: [
      { label: "Open Setup", route: "setup" },
      { label: "Open Publishing", route: "publishing" },
      { label: "Open Insights", route: "insights" }
    ],
    publishing: [
      { label: "Open Queue Center", route: "queue-center" },
      { label: "Open Job Monitor", route: "job-monitor" },
      { label: "Open Notifications", route: "notification-center" }
    ],
    settings: [
      { label: "Open Governance", route: "governance" },
      { label: "Open Home", route: "home" },
      { label: "Open Integrations", route: "integrations" }
    ]
  };

  return routeActions[route] || common;
}

function fillPrompt(prompt, context) {
  const projectName = asString(context.state.context.currentProject).trim() || "this project";
  const activeCampaign = asString(context.state.context.activeCampaign).trim() || "the active campaign";
  return asString(prompt)
    .replace(/\bthis project\b/gi, projectName)
    .replace(/\bthe active campaign\b/gi, activeCampaign);
}

function runAction(action, context) {
  if (!action) return;

  if (action.prompt) {
    const input = document.getElementById("quickCommandInput");
    if (input) input.value = fillPrompt(action.prompt, context);
    context.navigateTo("ai-command");
    context.showMessage?.("AI prompt queued in AI Command.");
    return;
  }

  if (action.route) {
    context.navigateTo(action.route);
    return;
  }

  if (action.action === "refresh") {
    const project = context.state.context.currentProject;
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
    context.showMessage?.("Open the main work area and select a record before using this action.");
    return;
  }

  target.focus?.();
  target.click?.();
}

function bindHeaderAction(button, action, context) {
  if (!button || !action) return;
  button.textContent = action.label;
  button.onclick = () => runAction(action, context);
}

function renderActions(container, route, context) {
  if (!container) return;
  const actions = ROUTE_ACTIONS[route] || ROUTE_ACTIONS.home;
  container.innerHTML = actions
    .map((action, index) => `
      <button type="button" class="quick-action-btn std-action-btn" data-std-action="${index}">
        <span class="home-action-title">${esc(action.label)}</span>
        <span class="home-action-meta">${esc(action.description)}</span>
      </button>
    `)
    .join("");

  Array.from(container.querySelectorAll("[data-std-action]")).forEach((button) => {
    button.onclick = () => {
      const action = actions[Number(button.getAttribute("data-std-action"))];
      runAction(action, context);
    };
  });
}

function renderAiPrompts(container, route, context) {
  if (!container) return;
  const ai = ROUTE_AI[route] || ROUTE_AI.home;

  container.innerHTML = asArray(ai.prompts)
    .map((prompt, index) => `
      <button type="button" class="btn btn-ghost std-ai-btn" data-std-ai-prompt="${index}">
        ${esc(fillPrompt(prompt, context))}
      </button>
    `)
    .join("");

  Array.from(container.querySelectorAll("[data-std-ai-prompt]")).forEach((button) => {
    button.onclick = () => {
      const prompt = ai.prompts[Number(button.getAttribute("data-std-ai-prompt"))] || "";
      const input = document.getElementById("quickCommandInput");
      if (input) input.value = fillPrompt(prompt, context);
      context.navigateTo("ai-command");
      context.showMessage?.("AI prompt queued in AI Command.");
    };
  });
}

function advancedRows(route, m) {
  const flow = ROUTE_FLOW[route] || {};
  const base = [
    { label: "Previous page", value: flow.previous || "-" },
    { label: "Next page", value: flow.next || "-" }
  ];
  const routeRows = {
    setup: [
      { label: "Data used", value: "Overview, readiness dashboard, setup draft" },
      { label: "Validation focus", value: `${m.setupMissingCount} missing items` }
    ],
    library: [
      { label: "Data used", value: "Asset registry, category readiness, missing assets" },
      { label: "Asset coverage", value: `${m.readyAssetCount}/${m.requiredAssets || 0} required` }
    ],
    integrations: [
      { label: "Data used", value: "Integration control center, connector readiness, source registry" },
      { label: "Coverage", value: `${m.connected}/${m.totalChannels || 0} connected` }
    ],
    "ai-command": [
      { label: "Data used", value: "AI commands, artifacts, recommendations, learning memory" },
      { label: "Artifact count", value: String(m.aiArtifacts) }
    ],
    workflows: [
      { label: "Data used", value: "Workflow catalog, workflow runs, handoffs, job monitor" },
      { label: "Run history", value: `${m.workflowCompleted} completed / ${m.workflowFailed} failed` }
    ],
    "campaign-studio": [
      { label: "Data used", value: "Campaign records, readiness, integrations, assets, intelligence" },
      { label: "Pipeline", value: `${m.activeCampaignRecords}/${m.campaignsTotal} active` }
    ],
    "content-studio": [
      { label: "Data used", value: "Content items, approvals, handoffs, AI rewrite requests" },
      { label: "Queue", value: `${m.contentDrafts} draft / ${m.contentReview} review` }
    ],
    "media-studio": [
      { label: "Data used", value: "Media jobs, approvals, outputs, preview history" },
      { label: "Queue", value: `${m.mediaOpen} open / ${m.mediaCompleted} completed` }
    ],
    publishing: [
      { label: "Data used", value: "Scheduler queue, publishing jobs, execution results, worker status" },
      { label: "Queue state", value: `${m.publishingReady} ready / ${m.publishingFailed} failed` }
    ],
    "ads-manager": [
      { label: "Data used", value: "Campaign records, paid insights, tracking connectors" },
      { label: "Paid signal", value: `${m.paidCampaigns} campaign records` }
    ],
    insights: [
      { label: "Data used", value: "Project insights, learning memory, connected platform coverage" },
      { label: "Recommendations", value: String(m.recommendations.length) }
    ],
    research: [
      { label: "Data used", value: "Research artifacts, saved findings, opportunities, market context" },
      { label: "Saved findings", value: String(m.savedFindings) }
    ],
    settings: [
      { label: "Data used", value: "Governance policy, role matrix, project configuration" },
      { label: "Approval state", value: `${m.approvalsPending} pending approvals` }
    ]
  };

  return [...base, ...asArray(routeRows[route])];
}

function renderAdvancedDetails(container, route, m) {
  if (!container) return;
  container.innerHTML = advancedRows(route, m)
    .map((row) => `
      <div class="data-row">
        <span>${esc(row.label)}</span>
        <strong>${esc(row.value)}</strong>
      </div>
    `)
    .join("");
}

export function applyStandardPageLayout(context) {
  const route = asString(context.route);
  const state = asObject(context.state);
  if (!REQUIRED_ROUTES.includes(route)) return;

  const page = document.querySelector(`#pageRoot .page[data-page="${route}"]`);
  if (!page) return;

  const shell = ensureShell(page);
  const copy = ROUTE_COPY[route] || ROUTE_COPY.home;
  const ai = ROUTE_AI[route] || ROUTE_AI.home;
  const m = metrics(state);

  const eyebrow = shell.querySelector("#stdPageEyebrow");
  const title = shell.querySelector("#stdPageTitle");
  const description = shell.querySelector("#stdPageDescription");
  const powerTitle = shell.querySelector("#stdPowerTitle");
  const statusTitle = shell.querySelector("#stdStatusTitle");
  const actionTitle = shell.querySelector("#stdActionTitle");
  const aiTitle = shell.querySelector("#stdAiTitle");
  const aiDescription = shell.querySelector("#stdAiDescription");
  const nextTitle = shell.querySelector("#stdNextTitle");
  const nextBest = shell.querySelector("#stdNextBestAction");

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (description) description.textContent = copy.description;
  if (powerTitle) powerTitle.textContent = `${copy.title} capabilities`;
  if (statusTitle) statusTitle.textContent = `${copy.title} status`;
  if (actionTitle) actionTitle.textContent = `${copy.title} actions`;
  if (aiTitle) aiTitle.textContent = ai.title;
  if (aiDescription) aiDescription.textContent = ai.description;
  if (nextTitle) nextTitle.textContent = `${copy.eyebrow} recommendation`;
  if (nextBest) nextBest.textContent = nextBestAction(route, m);

  const routeContext = { ...context, state };

  bindHeaderAction(shell.querySelector("#stdPrimaryAction"), copy.primary, routeContext);
  bindHeaderAction(shell.querySelector("#stdSecondaryAction"), copy.secondary, routeContext);

  const nextBestBtn = shell.querySelector("#stdNextBestActionBtn");
  if (nextBestBtn) {
    nextBestBtn.onclick = () => {
      const input = document.getElementById("quickCommandInput");
      if (input) input.value = nextBestAction(route, m);
      context.navigateTo("ai-command");
      context.showMessage?.("Next best action sent to AI Command.");
    };
  }

  renderMetricCards(shell.querySelector("#stdKpiGrid"), kpiCards(route, m));
  renderStatus(shell.querySelector("#stdStatusGrid"), statusCards(route, m));
  renderActions(shell.querySelector("#stdActionsList"), route, routeContext);
  renderAiPrompts(shell.querySelector("#stdAiPrompts"), route, routeContext);
  renderAdvancedDetails(shell.querySelector("#stdAdvancedDetails"), route, m);
}

export function getRequiredStandardRoutes() {
  return [...REQUIRED_ROUTES];
}
