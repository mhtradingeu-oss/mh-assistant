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

function normalizeText(value) {
  return asString(value).trim().toLowerCase();
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function dedupe(values) {
  return Array.from(new Set(asArray(values).filter(Boolean)));
}

function hasValue(value) {
  return Boolean(asString(value).trim());
}

function confidence(base, modifier = 0) {
  const score = Math.max(0.1, Math.min(0.99, Number(base) + Number(modifier || 0)));
  return Number(score.toFixed(2));
}

function createRecommendation({
  id,
  title,
  reason,
  priority,
  targetPage,
  actionLabel,
  impactChips,
  blockerType,
  confidenceScore,
  draftPayload = null,
  handoffPayload = null,
  relatedPages = []
}) {
  return {
    id,
    title,
    reason,
    priority,
    targetPage,
    actionLabel,
    impactChips: dedupe(impactChips).slice(0, 6),
    blockerType,
    confidenceScore,
    relatedPages: dedupe(relatedPages),
    draftPayload,
    handoffPayload
  };
}

function priorityRank(priority) {
  if (priority === "critical") return 3;
  if (priority === "recommended") return 2;
  return 1;
}

function collectSignals(state) {
  const context = asObject(state?.context);
  const overview = asObject(state?.data?.overview?.overview);
  const readinessRoot = asObject(state?.data?.readiness);
  const readiness = asObject(readinessRoot.dashboard || readinessRoot);
  const assetsRoot = asObject(state?.data?.assets);
  const integrations = asObject(state?.data?.integrations);
  const operations = asObject(state?.data?.operations);
  const activity = asObject(state?.data?.activity);

  const readinessCritical = dedupe([
    ...asArray(readiness.priorities?.critical),
    ...asArray(readiness.critical_gaps)
  ]).map((item) => titleCase(item));

  const readinessImportant = dedupe([
    ...asArray(readiness.priorities?.important),
    ...asArray(readiness.missing),
    ...asArray(readinessRoot.missing_fields)
  ]).map((item) => titleCase(item));

  const websiteUrl =
    asString(overview.website_url) ||
    asString(overview.project_website) ||
    asString(overview.website) ||
    "";

  const setupGaps = dedupe([
    ...readinessCritical,
    ...readinessImportant,
    ...(!hasValue(websiteUrl) ? ["Website URL"] : [])
  ]);

  const categoryReadiness = asArray(assetsRoot.category_readiness?.categories);
  const missingAssets = dedupe([
    ...asArray(assetsRoot.missing_assets?.assets),
    ...asArray(assetsRoot.missing_assets?.missing),
    ...asArray(assetsRoot.missing_assets?.blockers),
    ...categoryReadiness
      .filter((item) => item?.required !== false && ["missing", "needs review"].includes(normalizeText(item?.status)))
      .map((item) => item?.asset_type || item?.label || item?.display_label)
  ]).map((item) => titleCase(item));

  const assetItems = asArray(assetsRoot.assets);
  const sourceOfTruthCount = assetItems.filter((item) => Boolean(item?.source_of_truth || item?.use_as_source_of_truth)).length;

  const checks = asObject(integrations.readiness?.checks);
  const missingIntegrations = dedupe([
    ...Object.entries(checks).filter(([, ready]) => !ready).map(([key]) => titleCase(key)),
    ...asArray(integrations.readiness?.missing).map((item) => titleCase(item))
  ]);

  const contentItems = asArray(operations.content_items?.items);
  const mediaJobs = asArray(operations.media_jobs?.items);
  const workflowRuns = asArray(operations.workflows?.items);
  const handoffs = asArray(operations.handoffs?.items);

  const hasContentDraft = contentItems.length > 0;
  const hasMediaApproved = mediaJobs.some((item) => ["approved", "completed", "success", "ready"].includes(normalizeText(item?.status)));
  const hasWorkflowOutput = workflowRuns.length > 0 || handoffs.some((item) => normalizeText(item?.source_page) === "workflows");

  const scheduledJobs = asArray(activity.scheduled_jobs);
  const queueItems = asArray(operations.queues?.items);
  const publishingFailed =
    queueItems.some((item) => ["failed", "blocked", "error"].includes(normalizeText(item?.status || item?.execution_status))) ||
    asArray(activity.execution_results).some((item) => ["failed", "blocked", "error"].includes(normalizeText(item?.execution_status)));

  const hasPublishingScheduled = scheduledJobs.length > 0 || queueItems.some((item) => ["scheduled", "queued"].includes(normalizeText(item?.status)));
  const readinessScore = Number(readiness.readiness_score ?? overview.readiness_score);

  return {
    projectName: asString(context.currentProject || overview.project_name),
    activeCampaign: asString(context.activeCampaign || overview.active_campaign),
    setupGaps,
    missingAssets,
    missingIntegrations,
    hasContentDraft,
    hasMediaApproved,
    hasWorkflowOutput,
    hasPublishingScheduled,
    publishingFailed,
    sourceOfTruthCount,
    totalAssets: assetItems.length,
    readinessScore: Number.isFinite(readinessScore) ? readinessScore : null,
    handoffs
  };
}

function mapHandoffs(signals) {
  return asArray(signals.handoffs)
    .filter((item) => normalizeText(item?.status || "available") === "available")
    .map((item) => {
      const payload = asObject(item?.payload);
      return {
        id: asString(item?.id || payload?.id || payload?.workflow_id),
        sourcePage: asString(item?.source_page || "unknown"),
        destinationPage: asString(item?.destination_page || "unknown"),
        status: asString(item?.status || "available"),
        title: asString(payload?.workflow_title || payload?.title || payload?.prompt || "Cross-page handoff"),
        summary: asString(payload?.summary || payload?.description || payload?.prompt || "")
      };
    });
}

function buildRecommendations(signals) {
  const recommendations = [];

  if (signals.setupGaps.some((gap) => normalizeText(gap).includes("website"))) {
    recommendations.push(createRecommendation({
      id: "setup-website-url",
      title: "Complete website URL in setup",
      reason: "Website URL is missing, reducing attribution clarity and weakening cross-system recommendations.",
      priority: "critical",
      targetPage: "setup",
      actionLabel: "Open Setup",
      impactChips: ["Setup", "Integrations", "Campaign readiness"],
      blockerType: "setup_gap",
      confidenceScore: confidence(0.95),
      draftPayload: { prompt: "Add the project website URL and validate setup completeness." },
      relatedPages: ["home", "integrations", "ai-command"]
    }));
  }

  if (signals.missingAssets.length) {
    recommendations.push(createRecommendation({
      id: "library-required-assets",
      title: "Fill required library assets",
      reason: `${signals.missingAssets.length} required asset categories are missing or need review.`,
      priority: signals.missingAssets.some((item) => /logo|product photos|product videos/.test(normalizeText(item))) ? "critical" : "recommended",
      targetPage: "library",
      actionLabel: "Open Library",
      impactChips: ["Library", "Content", "Media", "Publishing"],
      blockerType: "missing_assets",
      confidenceScore: confidence(0.92),
      draftPayload: { missingAssets: signals.missingAssets.slice(0, 8) },
      relatedPages: ["content-studio", "media-studio", "publishing"]
    }));
  }

  if (signals.missingIntegrations.length) {
    recommendations.push(createRecommendation({
      id: "integration-repair",
      title: "Connect missing intelligence integrations",
      reason: `${signals.missingIntegrations.length} integration checks are missing or failing.`,
      priority: "critical",
      targetPage: "integrations",
      actionLabel: "Open Integrations",
      impactChips: ["Integrations", "Automation", "Campaign readiness"],
      blockerType: "integration_gap",
      confidenceScore: confidence(0.9),
      draftPayload: { missingIntegrations: signals.missingIntegrations.slice(0, 8) },
      relatedPages: ["workflows", "ai-command", "publishing"]
    }));
  }

  if (!signals.hasContentDraft) {
    recommendations.push(createRecommendation({
      id: "content-missing",
      title: "Create the first content draft",
      reason: "No content draft is available for downstream media or publishing lanes.",
      priority: "recommended",
      targetPage: "content-studio",
      actionLabel: "Open Content Studio",
      impactChips: ["Content", "Campaign"],
      blockerType: "content_gap",
      confidenceScore: confidence(0.85),
      draftPayload: { prompt: "Generate an initial multi-channel content draft from the campaign brief." },
      relatedPages: ["media-studio", "publishing"]
    }));
  }

  if (!signals.hasMediaApproved) {
    recommendations.push(createRecommendation({
      id: "media-missing",
      title: "Generate and approve media assets",
      reason: "No approved media output exists yet for publishing execution.",
      priority: "recommended",
      targetPage: "media-studio",
      actionLabel: "Open Media Studio",
      impactChips: ["Media", "Publishing", "Campaign"],
      blockerType: "media_gap",
      confidenceScore: confidence(0.83),
      draftPayload: { prompt: "Create media variants and mark at least one execution-ready version." },
      relatedPages: ["library", "publishing"]
    }));
  }

  if (!signals.hasWorkflowOutput) {
    recommendations.push(createRecommendation({
      id: "workflow-output-missing",
      title: "Run a workflow to create cross-page handoff",
      reason: "No workflow output/handoff is currently available for downstream routing.",
      priority: "recommended",
      targetPage: "workflows",
      actionLabel: "Open Workflows",
      impactChips: ["Workflows", "Automation", "Handoffs"],
      blockerType: "workflow_gap",
      confidenceScore: confidence(0.8),
      draftPayload: { prompt: "Run the highest-impact workflow and route output to the owning page." },
      relatedPages: ["ai-command", "publishing"]
    }));
  }

  if ((signals.hasContentDraft || signals.hasMediaApproved) && !signals.hasPublishingScheduled) {
    recommendations.push(createRecommendation({
      id: "publishing-not-scheduled",
      title: "Schedule ready output in publishing",
      reason: "Content/media readiness exists but nothing is scheduled yet.",
      priority: "recommended",
      targetPage: "publishing",
      actionLabel: "Open Publishing",
      impactChips: ["Publishing", "Execution", "Campaign"],
      blockerType: "publishing_gap",
      confidenceScore: confidence(0.86),
      handoffPayload: { destination_page: "publishing", status: "available" },
      relatedPages: ["content-studio", "media-studio"]
    }));
  }

  if (signals.publishingFailed) {
    recommendations.push(createRecommendation({
      id: "publishing-failed-items",
      title: "Resolve failed publishing blockers",
      reason: "Publishing contains failed or blocked items that need operator attention.",
      priority: "critical",
      targetPage: "publishing",
      actionLabel: "Review Publishing Queue",
      impactChips: ["Publishing", "Execution", "Risk"],
      blockerType: "publishing_failure",
      confidenceScore: confidence(0.9),
      relatedPages: ["ai-command", "workflows"]
    }));
  }

  if (signals.totalAssets > 0 && signals.sourceOfTruthCount === 0) {
    recommendations.push(createRecommendation({
      id: "library-source-of-truth",
      title: "Mark source-of-truth assets",
      reason: "Library has assets but no source-of-truth references, reducing downstream confidence.",
      priority: "optional",
      targetPage: "library",
      actionLabel: "Review Library Assets",
      impactChips: ["Library", "Readiness"],
      blockerType: "library_readiness",
      confidenceScore: confidence(0.72),
      relatedPages: ["content-studio", "media-studio", "publishing"]
    }));
  }

  if (signals.readinessScore != null && signals.readinessScore < 75) {
    recommendations.push(createRecommendation({
      id: "campaign-readiness-low",
      title: "Raise campaign readiness before scale",
      reason: `Campaign readiness is ${Math.round(signals.readinessScore)}/100 and still below a stable launch threshold.`,
      priority: "recommended",
      targetPage: "setup",
      actionLabel: "Improve Readiness",
      impactChips: ["Campaign readiness", "Setup"],
      blockerType: "campaign_readiness",
      confidenceScore: confidence(0.84),
      relatedPages: ["home", "workflows", "ai-command"]
    }));
  }

  recommendations.sort((a, b) => {
    const priorityDiff = priorityRank(b.priority) - priorityRank(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidenceScore - a.confidenceScore;
  });

  return recommendations;
}

function buildReadinessMap(signals) {
  const setupReady = signals.setupGaps.length === 0;
  const libraryReady = signals.missingAssets.length === 0;
  const integrationReady = signals.missingIntegrations.length === 0;
  const contentReady = signals.hasContentDraft;
  const mediaReady = signals.hasMediaApproved;
  const publishingReady = signals.hasPublishingScheduled && !signals.publishingFailed;

  return [
    { key: "setup", label: "Setup", ready: setupReady, note: setupReady ? "Complete" : `${signals.setupGaps.length} gaps` },
    { key: "library", label: "Library", ready: libraryReady, note: libraryReady ? "Ready" : `${signals.missingAssets.length} missing` },
    { key: "integrations", label: "Integrations", ready: integrationReady, note: integrationReady ? "Connected" : `${signals.missingIntegrations.length} issues` },
    { key: "content", label: "Content Studio", ready: contentReady, note: contentReady ? "Drafts available" : "No drafts" },
    { key: "media", label: "Media Studio", ready: mediaReady, note: mediaReady ? "Approved media" : "No approved media" },
    { key: "workflows", label: "Workflows", ready: signals.hasWorkflowOutput, note: signals.hasWorkflowOutput ? "Output available" : "No output" },
    { key: "publishing", label: "Publishing", ready: publishingReady, note: publishingReady ? "Queue ready" : "Needs scheduling" }
  ];
}

export function buildSystemIntelligence(state) {
  const signals = collectSignals(asObject(state));
  const recommendations = buildRecommendations(signals);
  const handoffs = mapHandoffs(signals);
  const readinessMap = buildReadinessMap(signals);

  const blockers = recommendations
    .filter((item) => item.priority === "critical")
    .map((item) => ({
      title: item.title,
      reason: item.reason,
      targetPage: item.targetPage,
      blockerType: item.blockerType,
      confidenceScore: item.confidenceScore
    }));

  const fallback = createRecommendation({
    id: "system-maintain-momentum",
    title: "Maintain execution momentum",
    reason: "Core readiness is stable. Continue with optimization and output quality improvements.",
    priority: "optional",
    targetPage: "ai-command",
    actionLabel: "Open AI Workspace",
    impactChips: ["Optimization", "Automation"],
    blockerType: "none",
    confidenceScore: 0.65
  });

  return {
    generatedAt: new Date().toISOString(),
    projectName: signals.projectName,
    campaignName: signals.activeCampaign,
    recommendations,
    topActions: recommendations.slice(0, 3),
    nextBestAction: recommendations[0] || fallback,
    blockers,
    readinessMap,
    campaignReadiness: {
      score: signals.readinessScore,
      status: signals.readinessScore != null && signals.readinessScore >= 80 ? "ready" : "in_progress"
    },
    handoffs,
    signals
  };
}

export function getGlobalNextBestAction(state) {
  return buildSystemIntelligence(state).nextBestAction;
}

export function getCachedNextBestAction(state) {
  const data = asObject(asObject(state).data);
  const readiness = asObject(asObject(data.readiness).dashboard || data.readiness);
  const activity = asObject(data.activity);
  const operations = asObject(data.operations);

  const cachedCandidates = [
    ...asArray(readiness.next_best_actions),
    ...asArray(activity.insights?.recommendations),
    ...asArray(activity.learning?.recommendations),
    ...asArray(operations.ai_recommendations?.items)
  ];

  const first = cachedCandidates.find((item) => {
    if (typeof item === "string") {
      return hasValue(item);
    }

    const obj = asObject(item);
    return hasValue(obj.recommendation) || hasValue(obj.title) || hasValue(obj.summary) || hasValue(obj.action);
  });

  if (!first) {
    return {
      title: "Maintain execution momentum",
      recommendation: "Maintain execution momentum",
      summary: "Use AI Workspace to review priorities and proceed with the next operating step.",
      targetPage: "ai-command",
      actionLabel: "Open AI Workspace"
    };
  }

  if (typeof first === "string") {
    const message = asString(first);
    return {
      title: message,
      recommendation: message,
      summary: message,
      targetPage: "ai-command",
      actionLabel: "Open AI Workspace"
    };
  }

  const candidate = asObject(first);
  const message =
    asString(candidate.recommendation) ||
    asString(candidate.title) ||
    asString(candidate.summary) ||
    asString(candidate.action);

  return {
    ...candidate,
    title: asString(candidate.title) || message,
    recommendation: message,
    summary: asString(candidate.summary) || message,
    targetPage: asString(candidate.targetPage || candidate.target_page) || "ai-command",
    actionLabel: asString(candidate.actionLabel || candidate.action_label) || "Open AI Workspace"
  };
}

export function getPageRecommendations(state, pageId) {
  const page = normalizeText(pageId || "");
  const intelligence = buildSystemIntelligence(state);
  if (!page) return intelligence.recommendations;
  return intelligence.recommendations.filter((item) => {
    return normalizeText(item.targetPage) === page || asArray(item.relatedPages).map(normalizeText).includes(page);
  });
}

export function getReadinessBlockers(state) {
  return buildSystemIntelligence(state).blockers;
}

export function getCrossPageHandoffs(state) {
  return buildSystemIntelligence(state).handoffs;
}
