import {
  getSharedHandoff,
  setSharedAiDraft,
  setSharedHandoff
} from "../shared-context.js";

const MODE_DEFS = [
  {
    id: "executive",
    label: "Executive",
    summary: "Priorities, blockers, readiness, and next-best actions.",
    routeHint: "home"
  },
  {
    id: "content",
    label: "Content",
    summary: "Content winners, weak posts, formats, and next publishing moves.",
    routeHint: "content-studio"
  },
  {
    id: "seo",
    label: "SEO",
    summary: "Traffic, search visibility, landing-page performance, and CTR opportunities.",
    routeHint: "insights"
  },
  {
    id: "ads",
    label: "Ads",
    summary: "Paid performance, creative strength, ROAS, and scale or pause decisions.",
    routeHint: "ads-manager"
  },
  {
    id: "research",
    label: "Research",
    summary: "Audience, market gaps, evidence gathering, and growth questions.",
    routeHint: "setup"
  },
  {
    id: "operations",
    label: "Operations",
    summary: "Routing, workflows, reconnects, campaigns, and execution planning.",
    routeHint: "workflows"
  }
];

const aiSessions = new Map();
let lastRenderContext = null;
let aiCommandBridgeRegistered = false;

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

function toNumber(value, fallback = null) {
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nowIso() {
  return new Date().toISOString();
}

function formatTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function compactWords(value, limit = 8, fallback = "Signal pending") {
  const words = asString(value)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, limit);
  return words.length ? words.join(" ") : fallback;
}

function formatCompactNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(parsed);
}

function formatPercent(value, digits = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
  return `${parsed.toFixed(digits)}%`;
}

function formatCurrency(value, currency = "USD") {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
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

function getModeMeta(id) {
  return MODE_DEFS.find((item) => item.id === id) || MODE_DEFS[0];
}

function createIntroMessage(projectName) {
  return {
    title: projectName ? `${projectName} AI Command is online` : "AI Command is online",
    summary: "This workspace now thinks like an operational system brain. Ask what is happening, why it matters, what to do next, or what page to move into.",
    findings: [
      "Use Executive mode for readiness, blockers, priorities, and next actions.",
      "Use Content, SEO, and Ads modes for performance-specific decisions.",
      "Use Operations mode when you want the system to route you into campaigns, publishing, integrations, or workflows."
    ],
    recommendations: [],
    nextActions: [],
    routeSuggestions: [],
    missingData: []
  };
}

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!aiSessions.has(key)) {
    aiSessions.set(key, {
      modeId: "executive",
      draftMessage: "",
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          modeId: "executive",
          createdAt: nowIso(),
          source: "system",
          response: createIntroMessage(projectName)
        }
      ],
      history: [],
      intelligence: {
        project: key,
        status: "idle",
        dashboard: null,
        insights: null,
        learning: null,
        error: "",
        loadedAt: "",
        loadingPromise: null
      },
      lastAppliedHandoffId: ""
    });
  }
  return aiSessions.get(key);
}

function buildSuggestedPrompts(aiContext, modeId) {
  const projectLabel = aiContext.projectName || "this project";
  const mode = getModeMeta(modeId);
  const basePrompts = {
    executive: [
      "What should I do next?",
      "Summarize project status.",
      "What is blocking growth right now?",
      "What are the current priorities?"
    ],
    content: [
      "What content is performing best?",
      "What should we post next?",
      "Which posts are weak?",
      "Which formats should we repeat?"
    ],
    seo: [
      "What SEO opportunities do we have?",
      "Why is traffic weak?",
      "What should we improve on the website?",
      "Which pages have low CTR opportunity?"
    ],
    ads: [
      "Which campaign should we scale?",
      "Why is ROAS weak?",
      "What ad creative is working?",
      "What should we pause or fix next?"
    ],
    research: [
      "What does the current data suggest we still need to learn?",
      "Which missing signals are limiting strategy quality?",
      "What market questions should we investigate next?",
      "What should we validate before launch?"
    ],
    operations: [
      "Launch a new campaign.",
      "Build a 7-day content plan.",
      "Improve weak posts.",
      "Reconnect missing tools."
    ]
  };

  return asArray(basePrompts[mode.id] || []).map((prompt) => ({
    label: mode.label,
    prompt: projectLabel ? `${prompt} Use the current intelligence for ${projectLabel}.` : prompt
  }));
}

function extractTopMessage(item = {}) {
  return asString(
    item.label ||
    item.title ||
    item.page ||
    item.query ||
    item.campaign_name ||
    item.name
  );
}

function syncAiWorkflowBridge({ projectName, modeId, command, response }) {
  setSharedAiDraft(projectName, {
    projectName: projectName || "",
    modeId: modeId || "",
    lastCommand: asString(command),
    lastResponseTitle: asString(response?.title),
    routeSuggestions: asArray(response?.routeSuggestions),
    updatedAt: nowIso()
  });
}

function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
  const handoff = getSharedHandoff(projectName, "ai-command", operations);
  const handoffId = asString(handoff?.id);

  if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) {
    return;
  }

  const payload = asObject(handoff?.payload);
  const draftContext = asObject(payload.draft_context);
  const prompt = asString(payload.prompt);

  if (draftContext.modeId) {
    session.modeId = draftContext.modeId;
  }

  if (prompt) {
    session.draftMessage = prompt;
  }

  if (draftContext.projectName || prompt) {
    setSharedAiDraft(projectName, {
      projectName,
      modeId: draftContext.modeId || session.modeId,
      lastCommand: prompt || draftContext.lastCommand || "",
      lastResponseTitle: draftContext.lastResponseTitle || "",
      routeSuggestions: asArray(draftContext.routeSuggestions)
    });
  }

  session.lastAppliedHandoffId = handoffId;
  consumeProjectHandoff?.(projectName, handoffId, {
    actor: "mh-assistant"
  }).catch((error) => {
    console.warn("Failed to consume AI handoff:", error.message);
  });
  showMessage?.("AI Command restored context from the shared backbone.");
}

function buildUnifiedAiContext(state, intelligence) {
  const overviewBlock = asObject(state.data.overview);
  const overview = asObject(overviewBlock.overview);
  const readiness = asObject(state.data.readiness);
  const readinessDashboard = asObject(readiness.dashboard);
  const connectors = asObject(state.data.integrations);
  const controlCenter = asObject(connectors.control_center);
  const activity = asObject(state.data.activity);

  const insights =
    asObject(intelligence?.insights) ||
    asObject(activity.insights) ||
    asObject(activity.marketing_insights) ||
    asObject(activity.performance_insights);
  const learning =
    asObject(intelligence?.learning) ||
    asObject(activity.learning);

  const coverage = asObject(insights.data_coverage);
  const coverageEntries = Object.entries(coverage);
  const coveredCount = coverageEntries.filter(([, item]) => asString(item?.status) === "covered").length;
  const partialCount = coverageEntries.filter(([, item]) => asString(item?.status) === "partial").length;
  const missingCount = coverageEntries.filter(([, item]) => asString(item?.status) === "missing").length;
  const recommendations = asArray(learning.recommendations || insights.recommendations);
  const nextBestActions = asArray(overviewBlock.next_best_actions || readinessDashboard.next_best_actions);
  const criticalGaps = asArray(readinessDashboard.priorities?.critical || readiness.priorities?.critical);
  const importantGaps = asArray(readinessDashboard.priorities?.important || readiness.priorities?.important);
  const missingIntegrations = [];

  coverageEntries.forEach(([key, item]) => {
    if (asString(item?.status) !== "covered") {
      missingIntegrations.push({
        label: titleCase(key),
        status: asString(item?.status) || "missing",
        integrations: asArray(item?.integrations)
      });
    }
  });

  const connectorIssues = Object.values(asObject(controlCenter.records))
    .filter((record) => ["error", "token_expired", "partial"].includes(asString(record?.status)))
    .map((record) => ({
      label: titleCase(record.integration_id),
      status: record.status_label || record.status,
      reason: record.health_summary || record.last_error
    }));

  return {
    projectName: state.context.currentProject || "",
    market: state.context.currentMarket || overview.market || "",
    language: state.context.currentLanguage || overview.language || "",
    campaign: state.context.activeCampaign || "Not selected yet",
    executionMode: state.context.executionMode || overview.execution_mode || "",
    currency: overview.currency || "USD",
    readinessScore: toNumber(readinessDashboard.readiness_score ?? overview.readiness_score),
    readinessStatus: asString(readinessDashboard.readiness_status || overview.readiness_status || "unknown"),
    nextBestActions,
    criticalGaps,
    importantGaps,
    missingIntegrations,
    connectorIssues,
    integrationSummary: asObject(controlCenter.summary),
    coveredCount,
    partialCount,
    missingCount,
    coverageTotal: coverageEntries.length,
    coverage,
    overview,
    readiness,
    readinessDashboard,
    connectors,
    controlCenter,
    activity,
    insights,
    learning,
    recommendations,
    topContent: asArray(insights.best_performing_content),
    weakContent: asArray(insights.underperforming_content),
    website: asObject(insights.website),
    seo: asObject(insights.seo),
    paid: asObject(insights.paid),
    social: asObject(insights.social),
    learningPatterns: asObject(learning.learning_patterns || insights.learning_patterns),
    aiRecommendations: asObject(learning.ai_recommendations || insights.ai_recommendations),
    sourceSummary: asObject(insights.source_summary || learning.source_summary),
    hasLiveIntelligence:
      Boolean(Object.keys(insights).length) ||
      Boolean(Object.keys(learning).length)
  };
}

function scoreMode(text, modeId) {
  const query = asString(text).toLowerCase();
  const keywordMap = {
    executive: ["next", "status", "priority", "priorities", "blocking", "growth", "summary", "do next", "project"],
    content: ["content", "post", "caption", "blog", "script", "format", "repurpose", "weak post", "post next"],
    seo: ["seo", "traffic", "query", "search", "ctr", "website", "landing page", "ranking"],
    ads: ["ads", "roas", "campaign", "creative", "scale", "pause", "cpc", "cpa", "paid"],
    research: ["research", "market", "audience", "competitor", "learn", "validate", "insight gap"],
    operations: ["launch", "build", "improve", "reconnect", "connect", "sync", "workflow", "route", "publish", "plan"]
  };

  return asArray(keywordMap[modeId]).reduce((total, keyword) => {
    return total + (query.includes(keyword) ? 1 : 0);
  }, 0);
}

function classifyIntent(message, selectedModeId) {
  const scores = MODE_DEFS.map((mode) => ({
    modeId: mode.id,
    score: scoreMode(message, mode.id) + (mode.id === selectedModeId ? 0.75 : 0)
  }));

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0] || { modeId: selectedModeId || "executive" };
  const query = asString(message).toLowerCase();

  const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);

  return {
    selectedModeId,
    resolvedModeId: top.modeId || selectedModeId || "executive",
    actionRouting
  };
}

function routeSuggestion(label, route, reason) {
  return { label, route, reason };
}

function normalizeActionLabel(item) {
  return titleCase(asString(item).replace(/^connector:/, "").replace(/^asset:/, ""));
}

function buildMissingDataNotes(aiContext, lane) {
  const notes = [];
  const coverage = aiContext.coverage;

  if (!Object.keys(coverage).length) {
    notes.push("Live intelligence coverage is not available yet. Load project insights to unlock stronger guidance.");
    return notes;
  }

  if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {
    notes.push("Social insight feeds are still partial or missing. Sync Facebook, Instagram, TikTok, and YouTube to learn from real post performance.");
  }

  if (lane === "seo" && asString(coverage.seo_search_console?.status) !== "covered") {
    notes.push("SEO intelligence is incomplete because Search Console data has not been synced yet.");
  }

  if (lane === "seo" && asString(coverage.website_analytics?.status) !== "covered") {
    notes.push("Website analytics are incomplete, so landing-page and traffic guidance is less precise than it should be.");
  }

  if (lane === "ads" && asString(coverage.paid_ads?.status) !== "covered") {
    notes.push("Paid platform reporting is missing, so campaign and ROAS guidance is still limited.");
  }

  return notes;
}

function buildExecutiveResponse(aiContext) {
  const topRecommendation = aiContext.recommendations[0];
  const summaryParts = [];

  if (aiContext.readinessScore != null) {
    summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 and currently ${aiContext.readinessStatus || "in progress"}.`);
  }
  if (aiContext.criticalGaps.length) {
    summaryParts.push(`${aiContext.criticalGaps.length} critical gaps are still open.`);
  }
  if (aiContext.recommendations.length) {
    summaryParts.push(`${aiContext.recommendations.length} intelligence-driven recommendations are available.`);
  }

  return {
    title: "Executive project briefing",
    summary: summaryParts.join(" ") || "The project context is loaded, but the decision surface is still limited by incomplete live intelligence.",
    findings: [
      aiContext.criticalGaps.length
        ? `Critical gaps: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.`
        : "No critical readiness gaps are currently flagged.",
      aiContext.missingIntegrations.length
        ? `Missing or partial intelligence lanes: ${aiContext.missingIntegrations.slice(0, 4).map((item) => item.label).join(", ")}.`
        : "Integration coverage is strong across the current intelligence lanes.",
      topRecommendation
        ? `Top recommendation: ${topRecommendation.title}.`
        : "No live recommendation stack has been produced yet."
    ],
    recommendations: [
      topRecommendation
        ? `${topRecommendation.title}: ${topRecommendation.action}`
        : "Complete the missing intelligence connections so the system can produce stronger prioritization.",
      ...aiContext.recommendations.slice(1, 3).map((item) => `${item.title}: ${item.action}`)
    ].filter(Boolean),
    nextActions: [
      ...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
      ...(aiContext.connectorIssues[0]
        ? [`Investigate ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`]
        : [])
    ],
    routeSuggestions: [
      routeSuggestion("Open Setup", "setup", "Use Setup to close missing project basics, goals, and audience inputs."),
      routeSuggestion("Open Integrations", "integrations", "Use Integrations to reconnect missing data sources and improve intelligence coverage."),
      routeSuggestion("Open Insights", "insights", "Use Insights to review performance signals and the current recommendation stack.")
    ],
    missingData: buildMissingDataNotes(aiContext, "executive")
  };
}

function buildContentResponse(aiContext) {
  const top = aiContext.topContent[0];
  const weak = aiContext.weakContent[0];
  const bestFormat = aiContext.learningPatterns.best_formats?.label;
  const bestPlatform = aiContext.learningPatterns.best_platforms?.label;

  return {
    title: "Content intelligence briefing",
    summary: top
      ? `${extractTopMessage(top)} is the strongest measured content item right now${top.platform ? ` on ${titleCase(top.platform)}` : ""}.`
      : "There is not enough measured post-level data yet to rank content winners confidently.",
    findings: [
      top
        ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} visible performance signal.`
        : "No top-performing post has been measured yet.",
      weak
        ? `Weakest current item: ${extractTopMessage(weak)}.`
        : "No weak content list is available yet.",
      bestFormat && bestFormat !== "No format pattern yet"
        ? `Best reusable format signal: ${bestFormat}.`
        : "No reliable content-format learning pattern has emerged yet.",
      bestPlatform && bestPlatform !== "No platform pattern yet"
        ? `Best channel signal so far: ${bestPlatform}.`
        : "No clear platform winner exists yet."
    ].filter(Boolean),
    recommendations: [
      top
        ? `Reuse the strongest pattern from ${extractTopMessage(top)} and adapt it into the next publishing cycle.`
        : "Sync social insights so the system can identify winning hooks, formats, and publishing windows.",
      weak
        ? `Rewrite or repurpose ${extractTopMessage(weak)} with a stronger hook, tighter CTA, and better format-platform fit.`
        : null,
      bestFormat && bestFormat !== "No format pattern yet"
        ? `Double down on ${bestFormat} while testing one adjacent format variation.`
        : null
    ].filter(Boolean),
    nextActions: [
      top ? `Create a follow-up asset based on ${extractTopMessage(top)}.` : "Load more social insight data before expanding the content queue.",
      weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit the current content inventory for posts that are not converting attention into clicks.",
      "Prepare the next publishing batch with performance-led hooks instead of generic posting volume."
    ],
    routeSuggestions: [
      routeSuggestion("Open Content Studio", "content-studio", "Use Content Studio to rewrite weak posts and turn winning patterns into new drafts."),
      routeSuggestion("Open Publishing", "publishing", "Use Publishing to schedule the next batch with stronger timing and approval control."),
      routeSuggestion("Open Insights", "insights", "Use Insights to compare top and weak content in one place.")
    ],
    missingData: buildMissingDataNotes(aiContext, "content")
  };
}

function buildSeoResponse(aiContext) {
  const seo = aiContext.seo;
  const website = aiContext.website;
  const topQuery = asArray(seo.top_queries)[0];
  const lowCtr = asArray(seo.low_ctr_pages)[0];
  const weakPage = asArray(website.weak_pages)[0];

  return {
    title: "SEO and traffic intelligence briefing",
    summary: seo.summary?.impressions != null
      ? `Search visibility is live with ${formatCompactNumber(seo.summary.impressions)} impressions, and the current SEO lane is ready for prioritization.`
      : "SEO visibility is not live yet, so current guidance is limited by missing Search Console data.",
    findings: [
      topQuery
        ? `Top query signal: ${extractTopMessage(topQuery)} with ${formatCompactNumber(topQuery.clicks)} clicks.`
        : "No top query list is available yet.",
      lowCtr
        ? `Best CTR opportunity: ${extractTopMessage(lowCtr)} is getting visibility but weak click-through.`
        : "No low-CTR opportunity list is available yet.",
      weakPage
        ? `Website weak page: ${extractTopMessage(weakPage)} is drawing traffic without enough conversion evidence.`
        : "No weak landing-page signal is available yet.",
      website.summary?.sessions != null
        ? `Website traffic signal: ${formatCompactNumber(website.summary.sessions)} sessions are currently measured.`
        : "Website sessions are not available yet."
    ],
    recommendations: [
      lowCtr
        ? `Improve the title and SERP message for ${extractTopMessage(lowCtr)} first because it has visible impression opportunity.`
        : "Connect Search Console to unlock CTR and ranking opportunity analysis.",
      weakPage
        ? `Tighten landing-page intent match and CTA clarity on ${extractTopMessage(weakPage)}.`
        : "Use GA4 or landing-page analytics to locate pages that attract traffic but do not convert.",
      aiContext.recommendations.find((item) => item.domain === "seo")?.action || ""
    ].filter(Boolean),
    nextActions: [
      topQuery ? `Expand content around ${extractTopMessage(topQuery)}.` : "Reconnect or sync Search Console before making SEO roadmap decisions.",
      lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Review page titles and meta descriptions on the highest-priority pages manually.",
      "Audit the top landing pages for stronger offer clarity and conversion flow."
    ],
    routeSuggestions: [
      routeSuggestion("Open Insights", "insights", "Use Insights to review search and website performance together."),
      routeSuggestion("Open Integrations", "integrations", "Use Integrations to reconnect GA4 or Search Console if intelligence is incomplete."),
      routeSuggestion("Open Setup", "setup", "Use Setup to refine positioning and audience language if the traffic signal is weak or misaligned.")
    ],
    missingData: buildMissingDataNotes(aiContext, "seo")
  };
}

function buildAdsResponse(aiContext) {
  const paid = aiContext.paid;
  const bestCampaign = asArray(paid.best_campaigns)[0];
  const weakCampaign = asArray(paid.weak_campaigns)[0];
  const bestCreative = asArray(paid.best_creatives)[0];

  return {
    title: "Paid performance briefing",
    summary: paid.summary?.spend != null
      ? `Paid media is live with ${formatCurrency(paid.summary.spend, aiContext.currency)} in tracked spend.`
      : "Paid reporting is not live yet, so the system cannot rank campaigns or diagnose ROAS reliably.",
    findings: [
      bestCampaign
        ? `Best campaign signal: ${extractTopMessage(bestCampaign)}.`
        : "No winning paid campaign list is available yet.",
      weakCampaign
        ? `Weak campaign signal: ${extractTopMessage(weakCampaign)}.`
        : "No weak paid campaign list is available yet.",
      bestCreative
        ? `Best creative cue: ${extractTopMessage(bestCreative)}.`
        : "No creative performance breakdown is available yet.",
      paid.summary?.roas != null
        ? `Current ROAS signal: ${Number(paid.summary.roas).toFixed(2)}x.`
        : "ROAS is not available yet."
    ],
    recommendations: [
      bestCampaign
        ? `Scale only after validating that ${extractTopMessage(bestCampaign)} has strong CTR, conversion quality, or ROAS.`
        : "Connect Meta Ads, Google Ads, or TikTok Ads feeds before making scale decisions.",
      weakCampaign
        ? `Pause or refresh ${extractTopMessage(weakCampaign)} if the same weak pattern continues after a creative update.`
        : null,
      aiContext.recommendations.find((item) => item.domain === "paid")?.action || ""
    ].filter(Boolean),
    nextActions: [
      bestCreative ? `Reuse the creative pattern behind ${extractTopMessage(bestCreative)}.` : "Sync paid campaign performance data before scaling any creative.",
      weakCampaign ? `Rebuild the hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping for the next paid sync cycle.",
      "Keep paid decisions tied to conversion and revenue signal, not just click volume."
    ],
    routeSuggestions: [
      routeSuggestion("Open Ads Manager", "ads-manager", "Use Ads Manager to review pacing, creative mapping, and the paid operating view."),
      routeSuggestion("Open Integrations", "integrations", "Use Integrations to connect or reconnect paid reporting platforms."),
      routeSuggestion("Open Insights", "insights", "Use Insights to compare paid performance against organic and website results.")
    ],
    missingData: buildMissingDataNotes(aiContext, "ads")
  };
}

function buildResearchResponse(aiContext) {
  return {
    title: "Research and evidence briefing",
    summary: "The current system has enough operating context to highlight where better evidence would improve decision quality next.",
    findings: [
      aiContext.missingIntegrations.length
        ? `Missing intelligence lanes: ${aiContext.missingIntegrations.map((item) => item.label).join(", ")}.`
        : "The main intelligence lanes are structurally connected.",
      aiContext.criticalGaps.length
        ? `Current critical gaps still affect research quality: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.`
        : "No major project-setup gaps are currently blocking research quality.",
      aiContext.learning.system_lessons?.[0] || aiContext.learningPatterns.best_topics?.label
        ? `Current system learning: ${aiContext.learning.system_lessons?.[0] || aiContext.learningPatterns.best_topics?.label}.`
        : "The learning engine needs more live data before it can generalize stronger market patterns."
    ].filter(Boolean),
    recommendations: [
      "Use the missing intelligence list as the research roadmap for what the system still cannot see clearly.",
      "Validate audience-language fit, offer clarity, and channel-fit assumptions before expanding execution volume.",
      "Prioritize integrations that unlock attribution and performance evidence over vanity metrics."
    ],
    nextActions: [
      "Review Setup and tighten goals, audience, competitor, and market assumptions.",
      "Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
      "Use Insights to identify where the current recommendation stack is still blind."
    ],
    routeSuggestions: [
      routeSuggestion("Open Setup", "setup", "Use Setup to strengthen project assumptions, goals, and audience context."),
      routeSuggestion("Open Integrations", "integrations", "Use Integrations to increase data coverage and reduce blind spots."),
      routeSuggestion("Open Insights", "insights", "Use Insights to see where the evidence is strong and where it is still thin.")
    ],
    missingData: [
      ...buildMissingDataNotes(aiContext, "seo"),
      ...buildMissingDataNotes(aiContext, "ads"),
      ...buildMissingDataNotes(aiContext, "content")
    ]
  };
}

function buildOperationsTaskBlock(aiContext, message) {
  const query = asString(message).toLowerCase();

  if (/launch.*campaign|new campaign/.test(query)) {
    return {
      title: "Task-ready campaign brief",
      owner: "Campaign Studio",
      steps: [
        "Define the campaign objective, audience, and offer.",
        "Choose channels and budget based on current intelligence coverage.",
        "List required assets and publishing dependencies before launch."
      ]
    };
  }

  if (/7-day content plan|content plan/.test(query)) {
    return {
      title: "Task-ready content plan",
      owner: "Content Studio",
      steps: [
        "Use the strongest content pattern as the starting template.",
        "Map seven days of posts by platform, hook, format, and CTA.",
        "Route approved items into Publishing for scheduling."
      ]
    };
  }

  if (/improve weak posts|weak post/.test(query)) {
    return {
      title: "Task-ready content repair plan",
      owner: "Content Studio",
      steps: [
        "Select the weakest current items from Insights.",
        "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.",
        "Republish only after updated versions are approved."
      ]
    };
  }

  if (/reconnect|missing tools|missing integrations/.test(query)) {
    return {
      title: "Task-ready integration recovery plan",
      owner: "Integrations",
      steps: [
        "Reconnect critical analytics and performance feeds first.",
        "Test each integration after reconnect and sync current data.",
        "Return to Insights to confirm coverage improves."
      ]
    };
  }

  return {
    title: "Task-ready operations block",
    owner: "Workflows",
    steps: [
      "Confirm the goal and the required output.",
      "Identify which page owns the work.",
      "Move into the correct workspace and execute the first concrete step."
    ]
  };
}

function buildOperationsResponse(aiContext, message) {
  const query = asString(message).toLowerCase();
  const taskBlock = buildOperationsTaskBlock(aiContext, message);
  const routeSuggestions = [];

  if (/campaign/.test(query)) {
    routeSuggestions.push(routeSuggestion("Open Campaign Studio", "campaign-studio", "Use Campaign Studio to turn this into a structured launch plan."));
  }
  if (/content|post/.test(query)) {
    routeSuggestions.push(routeSuggestion("Open Content Studio", "content-studio", "Use Content Studio to draft, rewrite, or prepare the requested content outputs."));
    routeSuggestions.push(routeSuggestion("Open Publishing", "publishing", "Use Publishing if the next step is scheduling or approval."));
  }
  if (/reconnect|connect|integration|tool|sync/.test(query)) {
    routeSuggestions.push(routeSuggestion("Open Integrations", "integrations", "Use Integrations to reconnect data sources and restore intelligence coverage."));
  }
  if (/ads|campaign scale|roas|creative/.test(query)) {
    routeSuggestions.push(routeSuggestion("Open Ads Manager", "ads-manager", "Use Ads Manager to review live paid performance and action the next media move."));
  }

  if (!routeSuggestions.length) {
    routeSuggestions.push(routeSuggestion("Open Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
  }

  return {
    title: "Operations routing brief",
    summary: "This request is best handled as an orchestrated workflow, not a generic chat answer.",
    findings: [
      aiContext.criticalGaps.length
        ? `Execution still has unresolved critical gaps: ${aiContext.criticalGaps.slice(0, 3).map(normalizeActionLabel).join(", ")}.`
        : "No major critical gap is blocking the requested operation.",
      aiContext.missingIntegrations.length
        ? `Intelligence coverage still has gaps that may reduce execution quality.`
        : "The core intelligence surface is available for routing."
    ],
    recommendations: [
      "Move into the correct workspace instead of trying to manage the whole flow from chat.",
      aiContext.recommendations[0]?.action || "Use the current recommendation stack to choose the first high-impact execution step."
    ].filter(Boolean),
    nextActions: taskBlock.steps,
    routeSuggestions,
    taskBlock,
    missingData: buildMissingDataNotes(aiContext, "content")
  };
}

function buildResponseForMode(aiContext, classified, message) {
  switch (classified.resolvedModeId) {
    case "content":
      return buildContentResponse(aiContext);
    case "seo":
      return buildSeoResponse(aiContext);
    case "ads":
      return buildAdsResponse(aiContext);
    case "research":
      return buildResearchResponse(aiContext);
    case "operations":
      return buildOperationsResponse(aiContext, message);
    case "executive":
    default:
      if (classified.actionRouting) {
        return buildOperationsResponse(aiContext, message);
      }
      return buildExecutiveResponse(aiContext);
  }
}

async function ensureIntelligenceLoaded({
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
      error: "Select a project to load AI intelligence."
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
              ? (insightsResult.reason?.message || learningResult.reason?.message || "Failed to load live intelligence")
              : "",
          loadedAt: nowIso(),
          loadingPromise: null
        };
      } catch (error) {
        session.intelligence = {
          ...session.intelligence,
          project: projectName,
          status: "error",
          error: error.message || "Failed to load live intelligence",
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

function submitCommand({
  aiContext,
  session,
  command,
  modeId,
  source
}) {
  const cleanCommand = asString(command).trim();
  if (!cleanCommand) {
    return false;
  }

  const classified = classifyIntent(cleanCommand, modeId || session.modeId);
  const response = buildResponseForMode(aiContext, classified, cleanCommand);
  const createdAt = nowIso();

  session.modeId = classified.resolvedModeId;
  session.messages.push({
    id: `msg-user-${Date.now()}`,
    role: "user",
    modeId: classified.resolvedModeId,
    content: cleanCommand,
    createdAt,
    source
  });

  session.messages.push({
    id: `msg-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "assistant",
    modeId: classified.resolvedModeId,
    createdAt: nowIso(),
    source: "intelligence-response",
    response
  });

  session.history.unshift({
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    modeId: classified.resolvedModeId,
    command: cleanCommand,
    createdAt,
    source,
    responseTitle: response.title
  });
  session.history = session.history.slice(0, 14);
  session.draftMessage = "";
  syncAiWorkflowBridge({
    projectName: aiContext.projectName,
    modeId: classified.resolvedModeId,
    command: cleanCommand,
    response
  });

  return true;
}

async function submitDurableCommand({
  projectName,
  aiContext,
  session,
  command,
  modeId,
  source,
  executeProjectAiCommand,
  reloadProjectData
}) {
  const cleanCommand = asString(command).trim();
  if (!cleanCommand) {
    return false;
  }

  if (typeof executeProjectAiCommand !== "function") {
    return submitCommand({
      aiContext,
      session,
      command: cleanCommand,
      modeId,
      source
    });
  }

  const result = await executeProjectAiCommand(projectName, {
    command: cleanCommand,
    mode_id: modeId || session.modeId,
    source,
    actor: "mh-assistant"
  });
  const response = asObject(result?.response);
  const classification = asObject(result?.command?.classification);
  const resolvedModeId =
    asString(classification.resolvedModeId) ||
    asString(result?.command?.mode_id) ||
    modeId ||
    session.modeId;
  const createdAt = nowIso();

  session.modeId = resolvedModeId;
  session.messages.push({
    id: `msg-user-${Date.now()}`,
    role: "user",
    modeId: resolvedModeId,
    content: cleanCommand,
    createdAt,
    source
  });

  session.messages.push({
    id: `msg-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "assistant",
    modeId: resolvedModeId,
    createdAt: asString(result?.command?.created_at) || nowIso(),
    source: "durable-ai-response",
    response
  });

  session.history.unshift({
    id: asString(result?.command?.id) || `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    modeId: resolvedModeId,
    command: cleanCommand,
    createdAt,
    source,
    responseTitle: response.title
  });
  session.history = session.history.slice(0, 14);
  session.draftMessage = "";
  syncAiWorkflowBridge({
    projectName: aiContext.projectName,
    modeId: resolvedModeId,
    command: cleanCommand,
    response
  });

  await reloadProjectData?.(projectName);
  return true;
}

function renderAssistantResponse(response, escapeHtml, ownerId) {
  const findings = asArray(response.findings);
  const recommendations = asArray(response.recommendations);
  const nextActions = asArray(response.nextActions);
  const routeSuggestions = asArray(response.routeSuggestions);
  const missingData = asArray(response.missingData);
  const taskBlock = asObject(response.taskBlock);

  return `
    <div class="ai-response-grid">
      <div class="ai-output-card ai-output-span">
        <span class="ai-output-label">Summary</span>
        <strong>${escapeHtml(response.title || "AI response")}</strong>
        <p>${escapeHtml(response.summary || "No summary available.")}</p>
      </div>

      <div class="ai-output-card">
        <span class="ai-output-label">Key Findings</span>
        ${
          findings.length
            ? `<ul class="ai-output-list">${findings.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : `<div class="empty-box">No findings available yet.</div>`
        }
      </div>

      <div class="ai-output-card">
        <span class="ai-output-label">Recommendations</span>
        ${
          recommendations.length
            ? `<ul class="ai-output-list">${recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : `<div class="empty-box">No recommendations available yet.</div>`
        }
      </div>

      <div class="ai-output-card">
        <span class="ai-output-label">Next Actions</span>
        ${
          nextActions.length
            ? `<ul class="ai-output-list">${nextActions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : `<div class="empty-box">No next actions available yet.</div>`
        }
      </div>

      <div class="ai-output-card">
        <span class="ai-output-label">Suggested Route</span>
        ${
          routeSuggestions.length
            ? `<div class="ai-route-list">${routeSuggestions.map((item, index) => `
                <button class="ai-route-btn" type="button" data-ai-route="${index}" data-ai-route-owner="${escapeHtml(ownerId || "")}">
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.reason || "")}</span>
                </button>
              `).join("")}</div>`
            : `<div class="empty-box">No route suggestion yet.</div>`
        }
      </div>

      ${
        taskBlock.title
          ? `
            <div class="ai-output-card ai-output-span">
              <span class="ai-output-label">Task-ready Block</span>
              <strong>${escapeHtml(taskBlock.title)}</strong>
              <div class="ai-task-owner">${escapeHtml(taskBlock.owner || "System")}</div>
              ${
                asArray(taskBlock.steps).length
                  ? `<ul class="ai-output-list">${taskBlock.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
                  : ""
              }
            </div>
          `
          : ""
      }

      ${
        missingData.length
          ? `
            <div class="ai-output-card ai-output-span">
              <span class="ai-output-label">Missing Intelligence</span>
              <ul class="ai-output-list">${missingData.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderMessages(messages, escapeHtml) {
  return messages.length
    ? messages.map((message) => {
      const mode = getModeMeta(message.modeId);
      if (message.role === "user") {
        return `
          <div class="ai-message ai-message-user">
            <div class="ai-message-meta">
              <span>You</span>
              <span>${escapeHtml(formatTime(message.createdAt))}</span>
            </div>
            <div class="ai-message-body">${escapeHtml(message.content)}</div>
          </div>
        `;
      }

      return `
        <div class="ai-message ai-message-assistant">
          <div class="ai-message-meta">
            <span>${escapeHtml(mode.label)} Mode</span>
            <span>${escapeHtml(formatTime(message.createdAt))}</span>
          </div>
          <div class="ai-message-body">
            ${renderAssistantResponse(asObject(message.response), escapeHtml, message.id)}
          </div>
        </div>
      `;
    }).join("")
    : `<div class="empty-box">No conversation yet. Use the global quick command bar or the local composer to begin.</div>`;
}

function renderSuggestedPrompts(items, escapeHtml) {
  return items.map((item, index) => `
    <button class="ai-prompt-btn" type="button" data-ai-prompt="${index}">
      <span class="ai-prompt-label">${escapeHtml(item.label)}</span>
      <span class="ai-prompt-text">${escapeHtml(item.prompt)}</span>
    </button>
  `).join("");
}

function renderHistory(history, escapeHtml) {
  return history.length
    ? `
      <div class="ai-history-list">
        ${history.map((entry, index) => `
          <button class="ai-history-item" type="button" data-ai-history="${index}">
            <div class="ai-history-head">
              <span class="ai-history-specialist">${escapeHtml(getModeMeta(entry.modeId).label)}</span>
              <span class="ai-history-time">${escapeHtml(formatTime(entry.createdAt))}</span>
            </div>
            <div class="ai-history-command">${escapeHtml(entry.command)}</div>
          </button>
        `).join("")}
      </div>
    `
    : `<div class="empty-box">Command history will appear here after you start using the intelligence brain.</div>`;
}

function renderCoverageBadges(aiContext, escapeHtml) {
  const coverageEntries = Object.entries(asObject(aiContext.coverage));
  if (!coverageEntries.length) {
    return `<div class="empty-box">Coverage will appear once live intelligence is loaded.</div>`;
  }

  return `
    <div class="ai-coverage-grid">
      ${coverageEntries.map(([key, item]) => `
        <div class="ai-coverage-item">
          <span>${escapeHtml(titleCase(key))}</span>
          <strong class="card-badge ${escapeHtml(
            asString(item?.status) === "covered"
              ? "success"
              : asString(item?.status) === "partial"
                ? "warning"
                : "danger"
          )}">${escapeHtml(titleCase(item?.status || "missing"))}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function rerenderAiWorkspace() {
  if (!lastRenderContext) return;
  const { getState, render } = lastRenderContext;
  const state = getState();
  if (state.currentRoute !== "ai-command") return;
  render();
}

function ensureAiCommandBridge() {
  if (aiCommandBridgeRegistered || typeof window === "undefined") {
    return;
  }

  window.addEventListener("mh:submit-ai-command", async (event) => {
    if (!lastRenderContext) return;

    const detail = asObject(event?.detail);
    const message = asString(detail.message);
    const meta = asObject(detail.meta);
    const {
      getState,
      fetchProjectInsights,
      fetchProjectLearning,
      reloadProjectData,
      render,
      executeProjectAiCommand
    } = lastRenderContext;
    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName);

    await ensureIntelligenceLoaded({
      projectName,
      session,
      getState,
      reloadProjectData,
      fetchProjectInsights,
      fetchProjectLearning,
      rerender: render
    });

    const aiContext = buildUnifiedAiContext(getState(), session.intelligence);
    const accepted = await submitDurableCommand({
      projectName,
      aiContext,
      session,
      command: message,
      modeId: meta.modeId || session.modeId,
      source: meta.source || "external-command",
      executeProjectAiCommand,
      reloadProjectData
    });

    if (accepted) {
      rerenderAiWorkspace();
    }
  });

  aiCommandBridgeRegistered = true;
}

function bindAiWorkspace({
  $,
  getState,
  navigateTo,
  showMessage,
  showError,
  createProjectHandoff,
  executeProjectAiCommand,
  reloadProjectData,
  render
}) {
  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName);
  const aiContext = buildUnifiedAiContext(state, session.intelligence);

  Array.from(document.querySelectorAll("[data-ai-mode]")).forEach((button) => {
    button.onclick = () => {
      session.modeId = button.getAttribute("data-ai-mode") || session.modeId;
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-ai-prompt]")).forEach((button) => {
    button.onclick = () => {
      const prompts = buildSuggestedPrompts(aiContext, session.modeId);
      const prompt = prompts[Number(button.getAttribute("data-ai-prompt"))] || null;
      const input = $("aiCommandComposerInput");
      if (input && prompt) {
        input.value = prompt.prompt;
        session.draftMessage = prompt.prompt;
      }
    };
  });

  Array.from(document.querySelectorAll("[data-ai-history]")).forEach((button) => {
    button.onclick = () => {
      const entry = session.history[Number(button.getAttribute("data-ai-history"))];
      if (!entry) return;
      session.modeId = entry.modeId;
      session.draftMessage = entry.command;
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-ai-route]")).forEach((button) => {
    button.onclick = () => {
      const ownerId = button.getAttribute("data-ai-route-owner") || "";
      const messageIndex = session.messages.findIndex((item) => item.id === ownerId && item.role === "assistant");
      const message = session.messages.find((item) => item.id === ownerId && item.role === "assistant");
      const route = asArray(message?.response?.routeSuggestions)[Number(button.getAttribute("data-ai-route"))];
      if (!route?.route) return;
      if (route.route === "workflows") {
        const priorUserMessage = messageIndex > 0
          ? session.messages.slice(0, messageIndex).reverse().find((item) => item.role === "user")
          : null;
        const handoffMessage = priorUserMessage?.content || message?.response?.summary || "";
        syncAiWorkflowBridge({
          projectName,
          modeId: priorUserMessage?.modeId || session.modeId,
          command: handoffMessage,
          response: message?.response
        });
        const handoff = {
          source_page: "ai-command",
          destination_page: "workflows",
          payload: {
            prompt: handoffMessage,
            workflow_title: message?.response?.title || "",
            draft_context: {
              projectName,
              modeId: priorUserMessage?.modeId || session.modeId,
              lastCommand: handoffMessage,
              lastResponseTitle: message?.response?.title || "",
              routeSuggestions: asArray(message?.response?.routeSuggestions)
            },
            output: {
              summary: message?.response?.summary || "",
              nextActions: asArray(message?.response?.nextActions)
            }
          }
        };
        setSharedHandoff(projectName, "workflows", handoff);
        createProjectHandoff?.(projectName, handoff).catch((error) => {
          console.warn("Failed to persist AI-to-workflow handoff:", error.message);
        });
        const globalInput = $("quickCommandInput");
        if (globalInput) {
          globalInput.value = handoffMessage;
        }
      }
      navigateTo(route.route);
    };
  });

  const composerInput = $("aiCommandComposerInput");
  if (composerInput) {
    composerInput.value = session.draftMessage || "";
    composerInput.oninput = (event) => {
      session.draftMessage = event.target.value || "";
    };
    composerInput.onkeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        (async () => {
          const submitted = await submitDurableCommand({
            projectName,
            aiContext,
            session,
            command: composerInput.value,
            modeId: session.modeId,
            source: "local-composer",
            executeProjectAiCommand,
            reloadProjectData
          });
          if (!submitted) {
            showError?.("Enter a command before sending.");
            return;
          }
          showMessage?.("AI Command responded using live project intelligence.");
          render();
        })();
      }
    };
  }

  const sendBtn = $("aiCommandSendBtn");
  if (sendBtn) {
    sendBtn.onclick = async () => {
      const submitted = await submitDurableCommand({
        projectName,
        aiContext,
        session,
        command: $("aiCommandComposerInput")?.value || "",
        modeId: session.modeId,
        source: "local-composer",
        executeProjectAiCommand,
        reloadProjectData
      });
      if (!submitted) {
        showError?.("Enter a command before sending.");
        return;
      }
      showMessage?.("AI Command responded using live project intelligence.");
      render();
    };
  }

  const clearBtn = $("aiCommandClearBtn");
  if (clearBtn) {
    clearBtn.onclick = () => {
      session.messages = session.messages.slice(0, 1);
      session.history = [];
      session.draftMessage = "";
      showMessage?.("AI Command session cleared for this project.");
      render();
    };
  }

  const refreshBtn = $("aiCommandRefreshBtn");
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      session.intelligence.loadedAt = "";
      session.intelligence.status = "idle";
      await ensureIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData: lastRenderContext.reloadProjectData,
        fetchProjectInsights: lastRenderContext.fetchProjectInsights,
        fetchProjectLearning: lastRenderContext.fetchProjectLearning,
        rerender: render
      });
      showMessage?.("AI intelligence refreshed.");
    };
  }

  const useGlobalBtn = $("aiCommandUseGlobalBtn");
  if (useGlobalBtn) {
    useGlobalBtn.onclick = () => {
      const globalInput = $("quickCommandInput");
      if (globalInput) {
        globalInput.value = $("aiCommandComposerInput")?.value || session.draftMessage || "";
      }
      showMessage?.("Draft copied to the global quick command bar.");
    };
  }
}

export const aiCommandRoute = {
  id: "ai-command",
  meta: {
    eyebrow: "AI & Build",
    title: "AI Command",
    description: "Intelligence-driven system brain for project status, growth decisions, and action routing."
  },
  template: `
    <section class="page is-active" data-page="ai-command">
      <div id="aiCommandRoot"></div>
    </section>
  `,
  render(context) {
    const {
      getState,
      $,
      escapeHtml,
      navigateTo,
      showMessage,
      showError,
      reloadProjectData,
      fetchProjectInsights,
      fetchProjectLearning,
      createProjectHandoff,
      consumeProjectHandoff
    } = context;

    const render = () => {
      const state = getState();
      const projectName = state.context.currentProject || "";
      const session = ensureSession(projectName);
      session.lastAppliedHandoffId = asString(session.lastAppliedHandoffId);

      lastRenderContext = {
        ...context,
        render
      };
      ensureAiCommandBridge();
      applyDurableAiHandoff(projectName, state.data.operations, session, consumeProjectHandoff, showMessage);

      ensureIntelligenceLoaded({
        projectName,
        session,
        getState,
        reloadProjectData,
        fetchProjectInsights,
        fetchProjectLearning,
        rerender: render
      });

      const aiContext = buildUnifiedAiContext(state, session.intelligence);
      const mode = getModeMeta(session.modeId);
      const prompts = buildSuggestedPrompts(aiContext, session.modeId);
      const root = $("aiCommandRoot");
      if (!root) return;

      const intelligenceStatusLabel =
        session.intelligence.status === "loading"
          ? "Refreshing intelligence"
          : session.intelligence.status === "error"
            ? "Intelligence limited"
            : session.intelligence.status === "ready"
              ? "Live intelligence loaded"
              : "Waiting for intelligence";

      root.innerHTML = `
        <div class="ai-command-wrapper ai-command-brain">
          <div class="ai-command-hero">
            <div class="ai-command-hero-copy">
              <div class="setup-kicker">MH Assistant OS System Brain</div>
              <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} AI Command` : "AI Command")}</h3>
              <p class="setup-hero-text">
                This is the live orchestration layer for project intelligence. Ask what is happening, why it matters, what should be improved next, and where execution should move.
              </p>
              <div class="ai-command-status">
                <div class="setup-status-chip">
                  <span>Mode</span>
                  <strong>${escapeHtml(mode.label)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Readiness</span>
                  <strong>${escapeHtml(aiContext.readinessScore == null ? "--" : `${aiContext.readinessScore}/100`)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Coverage</span>
                  <strong>${escapeHtml(`${aiContext.coveredCount}/${aiContext.coverageTotal || 0} covered`)}</strong>
                </div>
                <div class="setup-status-chip">
                  <span>Recommendations</span>
                  <strong>${escapeHtml(String(aiContext.recommendations.length))}</strong>
                </div>
              </div>
            </div>

            <div class="setup-hero-actions">
              <button id="aiCommandUseGlobalBtn" class="btn btn-secondary" type="button">Copy To Global Bar</button>
              <button id="aiCommandRefreshBtn" class="btn btn-primary" type="button">Refresh Intelligence</button>
            </div>
          </div>

          <div class="ai-command-layout">
            <section class="card ai-command-main">
              <div class="card-head">
                <div>
                  <h3>Main AI Chat Area</h3>
                  <p class="home-section-copy" style="margin:6px 0 0;">Each response is structured around summary, findings, recommendations, next actions, and route suggestions.</p>
                </div>
                <span class="card-badge ${escapeHtml(
                  session.intelligence.status === "ready"
                    ? "success"
                    : session.intelligence.status === "loading"
                      ? "warning"
                      : session.intelligence.status === "error"
                        ? "danger"
                        : "neutral"
                )}">${escapeHtml(intelligenceStatusLabel)}</span>
              </div>

              ${
                session.intelligence.error
                  ? `<div class="ai-intelligence-banner warning">${escapeHtml(session.intelligence.error)}</div>`
                  : ""
              }

              <div id="aiCommandChat" class="ai-chat-stream">
                ${renderMessages(session.messages, escapeHtml)}
              </div>

              <div class="ai-composer">
                <textarea id="aiCommandComposerInput" class="setup-input setup-textarea" rows="4" placeholder="Ask what to do next, what content is working, why SEO is weak, which campaign to scale, or where the system should route the next action.">${escapeHtml(session.draftMessage)}</textarea>
                <div class="ai-composer-actions">
                  <div class="setup-helper">Press Ctrl/Cmd + Enter to send. AI Command will classify intent and answer from live project intelligence.</div>
                  <div class="ai-composer-buttons">
                    <button id="aiCommandClearBtn" class="btn btn-secondary" type="button">Clear Session</button>
                    <button id="aiCommandSendBtn" class="btn btn-primary" type="button">Send Command</button>
                  </div>
                </div>
              </div>
            </section>

            <aside class="ai-command-side">
              <section class="card">
                <div class="card-head">
                  <h3>Specialist Mode Picker</h3>
                  <span class="card-badge neutral">Modes</span>
                </div>
                <div class="ai-specialist-grid">
                  ${MODE_DEFS.map((item) => `
                    <button class="ai-specialist-card${item.id === session.modeId ? " is-active" : ""}" type="button" data-ai-mode="${escapeHtml(item.id)}">
                      <span class="ai-specialist-name">${escapeHtml(item.label)}</span>
                      <span class="ai-specialist-summary">${escapeHtml(item.summary)}</span>
                    </button>
                  `).join("")}
                </div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Context Panel</h3>
                  <span class="card-badge neutral">Live Context</span>
                </div>
                <div class="ai-context-grid">
                  <div class="ai-context-item">
                    <span>Current project</span>
                    <strong>${escapeHtml(aiContext.projectName || "Not selected")}</strong>
                  </div>
                  <div class="ai-context-item">
                    <span>Market</span>
                    <strong>${escapeHtml(aiContext.market || "Unknown")}</strong>
                  </div>
                  <div class="ai-context-item">
                    <span>Mode</span>
                    <strong>${escapeHtml(mode.label)}</strong>
                  </div>
                  <div class="ai-context-item">
                    <span>Campaign</span>
                    <strong>${escapeHtml(aiContext.campaign || "Not selected yet")}</strong>
                  </div>
                  <div class="ai-context-item">
                    <span>Insights coverage</span>
                    <strong>${escapeHtml(`${aiContext.coveredCount} covered / ${aiContext.partialCount} partial / ${aiContext.missingCount} missing`)}</strong>
                  </div>
                  <div class="ai-context-item">
                    <span>Recommendation count</span>
                    <strong>${escapeHtml(String(aiContext.recommendations.length))}</strong>
                  </div>
                </div>
                <div class="ai-context-section">
                  <div class="ai-context-heading">Coverage map</div>
                  ${renderCoverageBadges(aiContext, escapeHtml)}
                </div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Suggested Prompts</h3>
                  <span class="card-badge neutral">Jumpstarts</span>
                </div>
                <div id="aiCommandSuggestions" class="ai-prompt-grid">
                  ${renderSuggestedPrompts(prompts, escapeHtml)}
                </div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Command History</h3>
                  <span class="card-badge neutral">${escapeHtml(`${session.history.length} recent`)}</span>
                </div>
                <div id="aiCommandHistory">
                  ${renderHistory(session.history, escapeHtml)}
                </div>
              </section>
            </aside>
          </div>
        </div>
      `;

      bindAiWorkspace({
        $,
        getState,
        navigateTo,
        showMessage,
        showError,
        createProjectHandoff,
        executeProjectAiCommand,
        reloadProjectData,
        render
      });
    };

    render();
  }
};
