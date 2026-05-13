import { setSharedHandoff } from "../shared-context.js";

const researchSessions = new Map();

const ACTION_ROUTES = {
  campaign: { route: "campaign-studio", label: "Campaign Studio", destinationRole: "strategist", destinationDomain: "campaign" },
  content: { route: "content-studio", label: "Content Studio", destinationRole: "writer", destinationDomain: "content" },
  seo: { route: "workflows", label: "SEO Workflow", destinationRole: "strategist", destinationDomain: "research" },
  ads: { route: "ads-manager", label: "Ads Manager", destinationRole: "ads_operator", destinationDomain: "campaign" },
  ai: { route: "ai-command", label: "AI Command", destinationRole: "admin", destinationDomain: "governance" }
};
const RESEARCH_ROLE_DEFAULTS = {
  serviceDomain: "research",
  ownerRole: "analyst",
  reviewRole: "strategist"
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

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toNumber(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0
  }).format(parsed);
}

function formatPercent(value, digits = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
  return `${parsed.toFixed(digits)}%`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waiting for update";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function renderResearchTeamOps(state, escapeHtml) {
  const operations = asObject(state.data.operations);
  const handoffsByRole = asObject(operations.handoffs?.by_role);
  const approvalsByRole = asObject(operations.approvals?.by_reviewer_role);

  return `
    <div class="data-stack">
      <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(RESEARCH_ROLE_DEFAULTS.serviceDomain))}</strong></div>
      <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(RESEARCH_ROLE_DEFAULTS.ownerRole))}</strong></div>
      <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(RESEARCH_ROLE_DEFAULTS.reviewRole))}</strong></div>
      <div class="data-row"><span>Route map</span><strong>${escapeHtml(Object.values(ACTION_ROUTES).map((item) => `${item.label}: ${titleCase(item.destinationRole)}`).join(" • "))}</strong></div>
      <div class="data-row"><span>Analyst inbound</span><strong>${escapeHtml(formatCount(asArray(handoffsByRole[RESEARCH_ROLE_DEFAULTS.ownerRole]).length))}</strong></div>
      <div class="data-row"><span>Strategist review queue</span><strong>${escapeHtml(formatCount(asArray(approvalsByRole[RESEARCH_ROLE_DEFAULTS.reviewRole]).length))}</strong></div>
    </div>
  `;
}

function compactText(value, maxWords = 18, fallback = "") {
  const text = asString(value).replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function joinPreview(values, fallback, maxItems = 3) {
  const items = normalizeStringList(values).slice(0, maxItems);
  return items.length ? items.join(" • ") : fallback;
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter((item, index) => {
    const key = getKey(item, index);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickFirst(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
    if (value && typeof value === "object" && Object.keys(value).length) return value;
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function getPath(source, path) {
  if (!source || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
}

function getFirstPath(sources, paths, fallback = null) {
  for (const path of paths) {
    for (const source of sources) {
      const value = getPath(source, path);
      if (Array.isArray(value) && value.length) return value;
      if (value && typeof value === "object" && Object.keys(value).length) return value;
      if (typeof value === "string" && value.trim()) return value;
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "boolean") return value;
    }
  }
  return fallback;
}

function statusTone(value) {
  const normalized = asString(value).toLowerCase();

  if (
    normalized.includes("risk") ||
    normalized.includes("weak") ||
    normalized.includes("missing") ||
    normalized.includes("declin") ||
    normalized.includes("blocked")
  ) {
    return "danger";
  }

  if (
    normalized.includes("partial") ||
    normalized.includes("watch") ||
    normalized.includes("mixed") ||
    normalized.includes("pending") ||
    normalized.includes("medium")
  ) {
    return "warning";
  }

  if (
    normalized.includes("strong") ||
    normalized.includes("high") ||
    normalized.includes("connected") ||
    normalized.includes("growing") ||
    normalized.includes("ready")
  ) {
    return "success";
  }

  return "neutral";
}

function normalizeStringList(values) {
  return uniqueBy(
    asArray(values)
      .flatMap((value) => {
        if (typeof value === "string") {
          return value
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if (value == null) return [];
        return [firstNonEmpty(value.title, value.label, value.name, value.value, value.query, value.topic)];
      })
      .filter(Boolean),
    (item) => item.toLowerCase()
  );
}

function normalizeRecords(values, fallbackType = "signal") {
  return uniqueBy(
    asArray(values)
      .map((item) => {
        if (typeof item === "string") {
          return {
            title: item,
            summary: "",
            type: fallbackType
          };
        }

        const record = asObject(item);
        const title = firstNonEmpty(
          record.title,
          record.label,
          record.name,
          record.segment,
          record.keyword,
          record.query,
          record.topic,
          record.opportunity
        );

        if (!title) return null;

        return {
          title,
          summary: firstNonEmpty(
            record.summary,
            record.description,
            record.reason,
            record.insight,
            record.rationale,
            record.body
          ),
          type: firstNonEmpty(record.type, record.category, fallbackType),
          score: toNumber(record.score ?? record.priority ?? record.opportunity_score),
          level: firstNonEmpty(record.level, record.status, record.priority_label),
          meta: record
        };
      })
      .filter(Boolean),
    (item) => `${item.type}:${item.title}`.toLowerCase()
  );
}

function buildSourceCoverage(integrations, insights) {
  const readinessChecks = asObject(integrations?.readiness?.checks);
  const sources = asObject(integrations?.sources?.sources);
  const coverage = asObject(insights?.data_coverage);

  const fromInsights = Object.entries(coverage).map(([id, item]) => ({
    id,
    label: titleCase(id),
    status: firstNonEmpty(item?.status, item?.coverage, "unknown"),
    detail: firstNonEmpty(item?.detail, item?.notes, item?.recommendation, "Coverage detail pending")
  }));

  const fromIntegrations = Object.keys({ ...sources, ...readinessChecks }).map((id) => {
    const source = asObject(sources[id]);
    const connected = Boolean(readinessChecks[id] || asString(source.value).trim());
    return {
      id,
      label: titleCase(id),
      status: connected ? "connected" : "missing",
      detail: connected
        ? firstNonEmpty(source.value, "Connected and available for research enrichment.")
        : "No connector signal yet."
    };
  });

  return uniqueBy([...fromInsights, ...fromIntegrations], (item) => item.id);
}

function pickTimestamp(...candidates) {
  for (const candidate of candidates) {
    const parsed = Date.parse(candidate);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function buildResearchModel(state, session) {
  const overviewBlock = asObject(state.data.overview);
  const overview = asObject(overviewBlock.overview);
  const readiness = asObject(state.data.readiness);
  const integrations = asObject(state.data.integrations);
  const activity = asObject(state.data.activity);
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

  const sourceCoverage = buildSourceCoverage(integrations, insights);
  const researchSources = [
    insights,
    learning,
    asObject(insights.research),
    asObject(learning.research),
    overview,
    readiness,
    activity
  ];

  const recommendations = normalizeRecords(
    pickFirst(
      learning.recommendations,
      insights.recommendations,
      readiness.next_best_actions,
      overviewBlock.next_best_actions
    ),
    "recommendation"
  );

  const risks = normalizeRecords(
    pickFirst(
      learning.risks,
      insights.risks,
      readiness.critical_gaps,
      readiness.blockers,
      overviewBlock.critical_gaps
    ),
    "risk"
  );

  const competitors = normalizeRecords(
    pickFirst(
      getFirstPath(researchSources, [
        "competitors",
        "competitor_intelligence.competitors",
        "competitive_analysis.competitors"
      ], []),
      getFirstPath(researchSources, [
        "competitive_landscape",
        "competitor_signals"
      ], [])
    ),
    "competitor"
  ).map((item, index) => {
    const meta = asObject(item.meta);
    return {
      ...item,
      positioning: firstNonEmpty(meta.positioning, meta.angle, meta.message, item.summary, "Positioning hypothesis pending"),
      pricing: firstNonEmpty(meta.pricing, meta.price, meta.pricing_signal, index === 0 ? "Premium / signal pending" : "Unknown"),
      overlap: firstNonEmpty(meta.overlap, meta.category_overlap, meta.category, overview.project_type, "Category overlap not classified"),
      strengths: normalizeStringList(pickFirst(meta.strengths, meta.wins, meta.advantages, meta.pros)),
      weaknesses: normalizeStringList(pickFirst(meta.weaknesses, meta.gaps, meta.cons)),
      contentStyle: firstNonEmpty(meta.content_style, meta.editorial_style, "Content style not classified"),
      adStyle: firstNonEmpty(meta.ad_style, meta.creative_style, "Ad style not classified"),
      channels: normalizeStringList(pickFirst(meta.channels, meta.channel_presence, meta.platforms)),
      opportunityGap: firstNonEmpty(meta.opportunity_gap, meta.gap, meta.win_path, "Winning gap not captured yet")
    };
  });

  const audienceSegments = normalizeRecords(
    pickFirst(
      getFirstPath(researchSources, [
        "audience.segments",
        "audience_segments",
        "segments",
        "personas"
      ], []),
      normalizeStringList([
        overview.target_audience,
        overview.audience_primary,
        learning.ai_recommendations?.audience,
        learning.ai_recommendations?.audience_emphasis
      ]).map((segment) => ({ title: segment }))
    ),
    "audience"
  ).map((item) => {
    const meta = asObject(item.meta);
    return {
      ...item,
      painPoints: normalizeStringList(pickFirst(meta.pain_points, meta.problems, meta.frictions)),
      intents: normalizeStringList(pickFirst(meta.intent_types, meta.intents)),
      preferences: normalizeStringList(pickFirst(meta.content_preferences, meta.preferences)),
      objections: normalizeStringList(pickFirst(meta.objections, meta.barriers)),
      motivations: normalizeStringList(pickFirst(meta.motivations, meta.desires)),
      triggers: normalizeStringList(pickFirst(meta.buying_triggers, meta.triggers)),
      awareness: normalizeStringList(pickFirst(meta.awareness_stages, meta.stages, meta.stage_patterns))
    };
  });

  const marketTrends = normalizeRecords(
    pickFirst(
      getFirstPath(researchSources, [
        "market.trends",
        "market_trends",
        "trends",
        "trend_signals",
        "emerging_topics"
      ], []),
      getFirstPath(researchSources, [
        "seasonal_opportunities",
        "demand_signals"
      ], [])
    ),
    "trend"
  ).map((item) => {
    const meta = asObject(item.meta);
    return {
      ...item,
      momentum: firstNonEmpty(meta.momentum, meta.direction, item.level, "Unclassified"),
      seasonality: firstNonEmpty(meta.seasonality, meta.window, meta.timing),
      region: firstNonEmpty(meta.region, meta.market, overview.market),
      platform: firstNonEmpty(meta.platform, meta.channel, meta.source)
    };
  });

  const seoSource = asObject(getFirstPath(researchSources, ["seo"], {}));
  const keywordRecords = normalizeRecords(
    pickFirst(
      seoSource.opportunities,
      seoSource.recommendations,
      seoSource.keywords,
      seoSource.top_queries,
      seoSource.queries,
      getFirstPath(researchSources, ["keyword_research", "seo.keywords"], [])
    ),
    "keyword"
  ).map((item) => {
    const meta = asObject(item.meta);
    return {
      ...item,
      keyword: item.title,
      intent: firstNonEmpty(meta.intent, meta.intent_type, meta.funnel_stage, "Mixed intent"),
      difficulty: firstNonEmpty(meta.difficulty, meta.competition, "Unknown competition"),
      theme: firstNonEmpty(meta.theme, meta.cluster, meta.topic_cluster, "Unclustered"),
      page: firstNonEmpty(meta.page, meta.url, meta.target_page),
      value: firstNonEmpty(meta.value, meta.opportunity, item.summary)
    };
  });

  const longTailIdeas = normalizeStringList(
    pickFirst(
      seoSource.long_tail_ideas,
      seoSource.long_tail_keywords,
      seoSource.query_expansions
    )
  );

  const contentThemes = normalizeStringList(
    pickFirst(
      seoSource.content_themes,
      seoSource.themes,
      insights.content_themes,
      learning.content_themes
    )
  );

  const missingClusters = normalizeStringList(
    pickFirst(
      seoSource.missing_clusters,
      seoSource.content_gaps,
      learning.content_gaps
    )
  );

  const optimizePages = normalizeStringList(
    pickFirst(
      seoSource.top_pages_to_optimize,
      seoSource.pages_to_optimize,
      seoSource.ctr_opportunities,
      seoSource.ranking_opportunities
    )
  );

  const productIdeas = normalizeRecords(
    pickFirst(
      getFirstPath(researchSources, [
        "product.positioning_ideas",
        "product_positioning_ideas",
        "offer_angles",
        "value_propositions",
        "product_research"
      ], []),
      recommendations.filter((item) => /offer|position|product|bundle|value/i.test(item.title || item.summary)).map((item) => ({
        title: item.title,
        summary: item.summary,
        type: "product"
      }))
    ),
    "product"
  ).map((item) => {
    const meta = asObject(item.meta);
    return {
      ...item,
      angle: firstNonEmpty(meta.angle, meta.offer_angle, item.summary, "Angle pending"),
      proof: normalizeStringList(pickFirst(meta.proof_points, meta.proofs, meta.evidence)),
      differentiation: firstNonEmpty(meta.differentiation, meta.unique_value, "Differentiation not articulated"),
      bundle: firstNonEmpty(meta.bundle, meta.upsell, meta.bundle_opportunity),
      whyNow: firstNonEmpty(meta.why_buy_now, meta.urgency, meta.trigger)
    };
  });

  const opportunityPool = uniqueBy([
    ...normalizeRecords(
      pickFirst(
        getFirstPath(researchSources, ["opportunities", "opportunity_map"], []),
        recommendations
      ),
      "opportunity"
    ),
    ...keywordRecords.map((item) => ({
      title: item.keyword,
      summary: item.value,
      type: /buy|best|price|near me|for/i.test(item.keyword) ? "seo" : "content",
      meta: item.meta
    })),
    ...productIdeas.map((item) => ({
      title: item.title,
      summary: item.angle,
      type: "product"
    }))
  ], (item) => `${item.type}:${item.title}`.toLowerCase()).map((item, index) => {
    const type = asString(item.type).toLowerCase();
    let lane = "growth";
    if (type.includes("seo") || type.includes("keyword")) lane = "seo";
    if (type.includes("ad") || type.includes("paid")) lane = "ads";
    if (type.includes("content")) lane = "content";
    if (type.includes("product") || type.includes("offer")) lane = "growth";
    return {
      id: `op-${index}`,
      title: item.title,
      summary: firstNonEmpty(item.summary, "Opportunity detail pending"),
      lane,
      score: toNumber(item.score, 70 - index * 5),
      horizon: index < 3 ? "Short-term" : "Growth",
      routeTarget:
        lane === "seo" ? ACTION_ROUTES.seo :
        lane === "ads" ? ACTION_ROUTES.ads :
        lane === "content" ? ACTION_ROUTES.content :
        ACTION_ROUTES.campaign
    };
  });

  const competitorSignals = competitors.slice(0, 3).map((item) => item.opportunityGap || item.positioning || item.title);
  const audienceSignals = audienceSegments.slice(0, 3).flatMap((item) => item.motivations[0] || item.painPoints[0] || item.title).filter(Boolean);
  const marketOpportunities = opportunityPool.filter((item) => item.horizon === "Short-term").slice(0, 3);
  const latestUpdates = [
    session.intelligence.loadedAt,
    getFirstPath(researchSources, ["updated_at"], ""),
    getFirstPath([activity], ["updated_at"], "")
  ].filter(Boolean);
  const latestUpdateTimestamps = latestUpdates.map((item) => pickTimestamp(item)).filter(Boolean);

  const missingIntelligence = uniqueBy([
    !competitors.length ? "Competitor profile set" : "",
    !audienceSegments.length ? "Audience segmentation" : "",
    !marketTrends.length ? "Market trend feed" : "",
    !keywordRecords.length ? "Keyword and SEO research" : "",
    !productIdeas.length ? "Offer and product positioning research" : "",
    ...sourceCoverage.filter((item) => statusTone(item.status) !== "success").slice(0, 4).map((item) => `${item.label} coverage`)
  ].filter(Boolean), (item) => item);

  const autoFindings = uniqueBy([
    ...marketOpportunities.slice(0, 2).map((item) => ({
      title: item.title,
      body: item.summary,
      tags: [item.lane, item.horizon.toLowerCase()],
      source: "Opportunity map"
    })),
    ...risks.slice(0, 2).map((item) => ({
      title: item.title,
      body: firstNonEmpty(item.summary, "Risk surfaced from current project intelligence."),
      tags: ["risk", "research"],
      source: "Readiness / insight signal"
    })),
    ...keywordRecords.slice(0, 2).map((item) => ({
      title: item.keyword,
      body: firstNonEmpty(item.value, "SEO opportunity surfaced from current query intelligence."),
      tags: ["seo", item.intent.toLowerCase()],
      source: "SEO intelligence"
    }))
  ], (item) => item.title);

  const activeResearchAreas = [
    competitors.length && "Competitor intelligence",
    audienceSegments.length && "Audience intelligence",
    marketTrends.length && "Market trends",
    keywordRecords.length && "SEO and keyword research",
    productIdeas.length && "Offer positioning",
    recommendations.length && "Action recommendations"
  ].filter(Boolean);

  const seoOpportunityScore = Math.min(
    100,
    keywordRecords.length * 12 +
    longTailIdeas.length * 6 +
    contentThemes.length * 4 +
    (optimizePages.length ? 10 : 0)
  );

  return {
    overview,
    readiness,
    integrations,
    insights,
    learning,
    recommendations,
    risks,
    competitors,
    audienceSegments,
    marketTrends,
    keywordRecords,
    longTailIdeas,
    contentThemes,
    missingClusters,
    optimizePages,
    productIdeas,
    opportunityPool,
    sourceCoverage,
    missingIntelligence,
    autoFindings,
    activeResearchAreas,
    marketOpportunities,
    competitorSignals,
    audienceSignals,
    seoOpportunityScore,
    latestUpdate: latestUpdateTimestamps.length ? formatDateTime(Math.max(...latestUpdateTimestamps)) : "Waiting for data",
    hasLiveIntelligence: Boolean(Object.keys(insights).length || Object.keys(learning).length)
  };
}

function ensureSession(projectName) {
  const key = projectName || "__default__";

  if (!researchSessions.has(key)) {
    researchSessions.set(key, {
      noteDraft: {
        title: "",
        body: "",
        tags: ""
      },
      savedFindings: [],
      savedRecommendations: [],
      intelligence: {
        status: "idle",
        insights: null,
        learning: null,
        loadedAt: "",
        error: "",
        loadingPromise: null
      }
    });
  }

  return researchSessions.get(key);
}

function startResearchHydration({
  projectName,
  session,
  fetchProjectInsights,
  fetchProjectLearning,
  render,
  showError
}) {
  if (!projectName) return;
  if (session.intelligence.status === "loading" || session.intelligence.loadingPromise) return;
  if (session.intelligence.status === "loaded" && session.intelligence.loadedAt) return;

  session.intelligence.status = "loading";

  session.intelligence.loadingPromise = Promise.allSettled([
    fetchProjectInsights(projectName),
    fetchProjectLearning(projectName)
  ])
    .then(([insightsResult, learningResult]) => {
      const insights = insightsResult?.status === "fulfilled" ? insightsResult.value : null;
      const learning = learningResult?.status === "fulfilled" ? learningResult.value : null;
      const errorMessage = [
        insightsResult?.status === "rejected" ? insightsResult.reason?.message : "",
        learningResult?.status === "rejected" ? learningResult.reason?.message : ""
      ].filter(Boolean).join(" • ");

      session.intelligence.status = (insights || learning) ? "loaded" : "error";
      session.intelligence.insights = insights;
      session.intelligence.learning = learning;
      session.intelligence.loadedAt = new Date().toISOString();
      session.intelligence.error = errorMessage;

      if (errorMessage && !(insights || learning)) {
        showError?.(errorMessage);
      }
    })
    .catch((error) => {
      session.intelligence.status = "error";
      session.intelligence.error = error?.message || "Research intelligence failed to load.";
      showError?.(session.intelligence.error);
    })
    .finally(() => {
      session.intelligence.loadingPromise = null;
      render();
    });
}

function buildAiPrompts({ projectName, model }) {
  const projectLabel = projectName || "this project";
  const topOpportunity = model.marketOpportunities[0]?.title || "the strongest opportunity";
  const topRisk = model.risks[0]?.title || "the biggest launch risk";
  const topKeyword = model.keywordRecords[0]?.keyword || "the strongest keyword cluster";
  const topAudience = model.audienceSegments[0]?.title || "the highest-value audience segment";

  return [
    {
      label: "Summarize research",
      modeId: "research",
      preview: "Executive summary across competitors, audience, market, SEO, offers, risks, and next strategic decisions.",
      prompt: `Summarize the current research intelligence for ${projectLabel}. Cover competitor signals, audience needs, market momentum, SEO opportunities, product angles, risks, and the next three strategic decisions.`
    },
    {
      label: "Find market gaps",
      modeId: "research",
      preview: "Rank the most attractive market gaps by speed to test, upside, and defensibility.",
      prompt: `Find the strongest market gaps for ${projectLabel}. Use current competitor, audience, trend, and product signals. Prioritize gaps by speed to test, revenue potential, and defensibility.`
    },
    {
      label: "Suggest competitor angle",
      modeId: "research",
      preview: "Build a sharper positioning angle against the current competitor landscape.",
      prompt: `Create a sharper competitor angle for ${projectLabel}. Use ${topOpportunity} as the lead wedge and explain how we should position against incumbents.`
    },
    {
      label: "Identify SEO opportunities",
      modeId: "seo",
      preview: "Turn current research into target topics, landing pages, clusters, and low-competition search plays.",
      prompt: `Review the research and identify the best SEO opportunities for ${projectLabel}. Start with ${topKeyword} and recommend target topics, landing pages, clusters, and low-competition long-tail ideas.`
    },
    {
      label: "Suggest content directions",
      modeId: "content",
      preview: "Translate audience and search intelligence into topics, hooks, formats, and calls to action.",
      prompt: `Turn the current research for ${projectLabel} into content directions for ${topAudience}. Recommend hero topics, hooks, CTAs, and format ideas tied to search and buying intent.`
    },
    {
      label: "Suggest ad test ideas",
      modeId: "ads",
      preview: "Generate ad hypotheses, audience emphasis, and first creative tests from the research base.",
      prompt: `Turn the research intelligence for ${projectLabel} into ad test ideas. Use ${topOpportunity} as the lead angle, identify creative hypotheses, audience emphasis, and what to test first.`
    },
    {
      label: "Identify risks before launch",
      modeId: "executive",
      preview: "Stress-test the launch plan and highlight missing intelligence, mitigation steps, and ownership.",
      prompt: `Review ${projectLabel} research and identify the key risks before launch. Start with ${topRisk}. Include mitigation steps, missing intelligence, and which teams should act next.`
    }
  ];
}

function renderEmptyState(title, body, chips = [], escapeHtml) {
  return `
    <div class="research-empty-state">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
      ${chips.length ? `<div class="research-chip-row">${chips.map((chip) => `<span class="research-chip">${escapeHtml(chip)}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderKpiCard({ label, value, meta, tone = "neutral" }, escapeHtml) {
  return `
    <div class="research-kpi-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p class="research-kpi-meta research-tone-${escapeHtml(tone)}">${escapeHtml(meta)}</p>
    </div>
  `;
}

function renderSignalList(items, escapeHtml, emptyText) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="insights-list">
      ${items.map((item) => `
        <div class="insights-list-item">
          <div class="insights-list-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="card-badge ${statusTone(item.level || item.type || item.lane)}">${escapeHtml(titleCase(item.level || item.type || item.lane || "Signal"))}</span>
          </div>
          <div class="insights-list-meta">${escapeHtml(compactText(firstNonEmpty(item.summary, "Detail pending."), 24, "Detail pending."))}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderSectionCard(item, escapeHtml, fields = []) {
  return `
    <article class="research-signal-card">
      <div class="research-signal-head">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(compactText(firstNonEmpty(item.summary, "Signal detail is still being formed from the current project context."), 28, "Signal detail is still being formed from the current project context."))}</p>
        </div>
        <span class="card-badge ${statusTone(item.level || item.score || item.type)}">${escapeHtml(titleCase(item.level || item.type || "Signal"))}</span>
      </div>
      <div class="research-detail-grid">
        ${fields.map((field) => `
          <div class="research-detail-item">
            <span>${escapeHtml(field.label)}</span>
            <strong>${escapeHtml(field.value || "Not mapped yet")}</strong>
          </div>
        `).join("")}
      </div>
      ${
        item.channels?.length || item.strengths?.length || item.weaknesses?.length || item.painPoints?.length || item.motivations?.length || item.proof?.length
          ? `
            <div class="research-chip-groups">
              ${item.channels?.length ? `<div class="research-chip-row">${item.channels.map((entry) => `<span class="research-chip">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
              ${item.strengths?.length ? `<div class="research-chip-row">${item.strengths.map((entry) => `<span class="research-chip success">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
              ${item.weaknesses?.length ? `<div class="research-chip-row">${item.weaknesses.map((entry) => `<span class="research-chip danger">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
              ${item.painPoints?.length ? `<div class="research-chip-row">${item.painPoints.map((entry) => `<span class="research-chip danger">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
              ${item.motivations?.length ? `<div class="research-chip-row">${item.motivations.map((entry) => `<span class="research-chip success">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
              ${item.proof?.length ? `<div class="research-chip-row">${item.proof.map((entry) => `<span class="research-chip">${escapeHtml(entry)}</span>`).join("")}</div>` : ""}
            </div>
          `
          : ""
      }
    </article>
  `;
}

function savePromptToQuickCommand($, prompt) {
  const input = $("quickCommandInput");
  if (input) {
    input.value = prompt;
  }
}

function bindResearchActions({
  $,
  getState,
  navigateTo,
  showMessage,
  showError,
  fetchProjectInsights,
  fetchProjectLearning,
  createProjectHandoff,
  render,
  session,
  model
}) {
  const state = getState();
  const projectName = state.context.currentProject || "";

  const refreshBtn = $("researchRefreshBtn");
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      if (!projectName) {
        showError?.("Select a project before refreshing research.");
        return;
      }
      if (session.intelligence.loadingPromise) {
        showMessage?.("Research intelligence is already refreshing.");
        return;
      }
      session.intelligence.status = "idle";
      session.intelligence.error = "";
      startResearchHydration({
        projectName,
        session,
        fetchProjectInsights,
        fetchProjectLearning,
        render,
        showError
      });
      render();
      showMessage?.("Research intelligence refresh started.");
    };
  }

  const aiButtons = Array.from(document.querySelectorAll("[data-research-ai-prompt]"));
  const prompts = buildAiPrompts({ projectName, model });
  Array.from(document.querySelectorAll("[data-research-open]")).forEach((button) => {
    button.onclick = () => {
      navigateTo("ai-command");
    };
  });

  aiButtons.forEach((button) => {
    button.onclick = async () => {
      const prompt = prompts[Number(button.getAttribute("data-research-ai-prompt"))];
      if (!prompt) return;
      try {
        setSharedHandoff(projectName, "ai-command", {
          source_page: "research",
          destination_page: "ai-command",
          payload: {
            prompt: prompt.prompt,
            draft_context: {
              projectName,
              modeId: prompt.modeId,
              lastCommand: prompt.prompt,
              lastResponseTitle: "Research prompt",
              routeSuggestions: []
            }
          }
        });
        createProjectHandoff?.(projectName, {
          source_page: "research",
          destination_page: "ai-command",
          source_role: RESEARCH_ROLE_DEFAULTS.ownerRole,
          destination_role: ACTION_ROUTES.ai.destinationRole,
          source_service_domain: RESEARCH_ROLE_DEFAULTS.serviceDomain,
          destination_service_domain: ACTION_ROUTES.ai.destinationDomain,
          payload: {
            prompt: prompt.prompt,
            draft_context: {
              projectName,
              modeId: prompt.modeId,
              lastCommand: prompt.prompt,
              lastResponseTitle: "Research prompt",
              routeSuggestions: []
            }
          }
        }).catch((error) => {
          console.warn("Failed to persist research AI handoff:", error.message);
        });
        navigateTo("ai-command");
        savePromptToQuickCommand($, prompt.prompt);
        showMessage?.("Research prompt added to AI Command.");
      } catch (error) {
        showError?.(error?.message || "Failed to hand off the research prompt to AI Command.");
      }
    };
  });

  const routeButtons = Array.from(document.querySelectorAll("[data-research-route]"));
  routeButtons.forEach((button) => {
    button.onclick = () => {
      const target = button.getAttribute("data-research-route") || "";
      const action = ACTION_ROUTES[target];
      if (!action) return;

      const prompt =
        target === "campaign"
          ? `Use the current research intelligence for ${projectName || "this project"} to build a focused campaign direction. Start with ${model.marketOpportunities[0]?.title || "the strongest opportunity"} and account for ${model.risks[0]?.title || "current research risks"}.`
          : target === "content"
            ? `Turn the current research intelligence for ${projectName || "this project"} into a content plan. Prioritize ${model.keywordRecords[0]?.keyword || "high-intent search topics"} and audience segment ${model.audienceSegments[0]?.title || "the lead segment"}.`
            : target === "seo"
              ? `Build an SEO workflow for ${projectName || "this project"} from the current research page. Focus on keyword clusters, missing landing pages, long-tail ideas, and content clusters.`
              : target === "ads"
                ? `Use the current research intelligence for ${projectName || "this project"} to define ad test angles, audiences, and the first creative hypotheses to launch.`
                : `Save this research intelligence for ${projectName || "this project"} and convert it into structured recommendations: opportunities ${model.marketOpportunities.map((item) => item.title).join(", ") || "pending"}, risks ${model.risks.map((item) => item.title).join(", ") || "pending"}.`;

      const handoff = {
        source_page: "research",
        destination_page: action.route,
        source_role: RESEARCH_ROLE_DEFAULTS.ownerRole,
        destination_role: action.destinationRole,
        source_service_domain: RESEARCH_ROLE_DEFAULTS.serviceDomain,
        destination_service_domain: action.destinationDomain,
        payload: {
          prompt,
          createdAt: new Date().toISOString(),
          source: "research-route",
          route_target: action.route,
          owner_role: RESEARCH_ROLE_DEFAULTS.ownerRole,
          review_role: RESEARCH_ROLE_DEFAULTS.reviewRole,
          service_domain: RESEARCH_ROLE_DEFAULTS.serviceDomain
        }
      };
      setSharedHandoff(projectName, action.route, handoff);
      createProjectHandoff?.(projectName, handoff).catch((error) => {
        console.warn("Failed to persist research route handoff:", error.message);
      });

      if (target === "ai") {
        navigateTo(action.route);
        savePromptToQuickCommand($, prompt);
      } else {
        savePromptToQuickCommand($, prompt);
        navigateTo(action.route);
      }

      showMessage?.(`Research context routed to ${action.label}.`);
    };
  });

  const suggestionButtons = Array.from(document.querySelectorAll("[data-research-opportunity]"));
  suggestionButtons.forEach((button) => {
    button.onclick = () => {
      const item = model.opportunityPool[Number(button.getAttribute("data-research-opportunity"))];
      if (!item) return;
      savePromptToQuickCommand(
        $,
        `Operationalize this opportunity for ${projectName || "this project"}: ${item.title}. Context: ${item.summary}. Build a short action plan for ${item.routeTarget.label}.`
      );
      navigateTo(item.routeTarget.route);
      showMessage?.(`Opportunity routed to ${item.routeTarget.label}.`);
    };
  });

  const noteTitle = $("researchNoteTitle");
  const noteBody = $("researchNoteBody");
  const noteTags = $("researchNoteTags");

  if (noteTitle) {
    noteTitle.oninput = (event) => {
      session.noteDraft.title = event.target.value || "";
    };
  }

  if (noteBody) {
    noteBody.oninput = (event) => {
      session.noteDraft.body = event.target.value || "";
    };
  }

  if (noteTags) {
    noteTags.oninput = (event) => {
      session.noteDraft.tags = event.target.value || "";
    };
  }

  const saveNoteBtn = $("researchSaveFindingBtn");
  if (saveNoteBtn) {
    saveNoteBtn.onclick = () => {
      if (!session.noteDraft.title.trim() && !session.noteDraft.body.trim()) {
        showError?.("Add a title or observation before saving a finding.");
        return;
      }

      session.savedFindings.unshift({
        id: `finding-${Date.now()}`,
        title: session.noteDraft.title.trim() || "Untitled research finding",
        body: session.noteDraft.body.trim() || "Observation captured without additional detail.",
        tags: normalizeStringList(session.noteDraft.tags.split(",")),
        source: "Manual note",
        createdAt: new Date().toISOString()
      });
      session.savedFindings = session.savedFindings.slice(0, 18);
      session.noteDraft = { title: "", body: "", tags: "" };
      render();
      showMessage?.("Research finding saved.");
    };
  }

  const saveBlockButtons = Array.from(document.querySelectorAll("[data-save-research-block]"));
  saveBlockButtons.forEach((button) => {
    button.onclick = () => {
      const item = model.autoFindings[Number(button.getAttribute("data-save-research-block"))];
      if (!item) return;
      session.savedFindings.unshift({
        id: `finding-${Date.now()}`,
        title: item.title,
        body: item.body,
        tags: item.tags,
        source: item.source,
        createdAt: new Date().toISOString()
      });
      session.savedFindings = uniqueBy(session.savedFindings, (entry) => `${entry.title}:${entry.source}`);
      session.savedFindings = session.savedFindings.slice(0, 18);
      render();
      showMessage?.("Reusable intelligence block saved.");
    };
  });

  const saveRecommendationBtn = $("researchSaveRecommendationBtn");
  if (saveRecommendationBtn) {
    saveRecommendationBtn.onclick = () => {
      const opportunity = model.marketOpportunities[0];
      if (!opportunity) {
        showError?.("No structured opportunity is ready to save yet.");
        return;
      }

      session.savedRecommendations.unshift({
        id: `rec-${Date.now()}`,
        title: opportunity.title,
        summary: opportunity.summary,
        target: opportunity.routeTarget.label,
        createdAt: new Date().toISOString()
      });
      session.savedRecommendations = uniqueBy(session.savedRecommendations, (item) => `${item.title}:${item.target}`);
      session.savedRecommendations = session.savedRecommendations.slice(0, 12);
      render();
      showMessage?.("Structured recommendation saved.");
    };
  }
}

export const researchRoute = {
  id: "research",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Execute & Grow",
    title: "Research",
    description: "A premium intelligence lab for competitors, audiences, search, offers, and strategic opportunities."
  },
  template: `
    <section class="page is-active" data-page="research">
      <div id="researchRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage,
    showError,
    fetchProjectInsights,
    fetchProjectLearning,
    createProjectHandoff
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName);
    const root = $("researchRoot");
    if (!root) return;

    const rerender = () => this.render({
      getState,
      $,
      escapeHtml,
      safeText,
      navigateTo,
      showMessage,
      showError,
      fetchProjectInsights,
      fetchProjectLearning,
      createProjectHandoff
    });

    startResearchHydration({
      projectName,
      session,
      fetchProjectInsights,
      fetchProjectLearning,
      render: rerender,
      showError
    });

    const model = buildResearchModel(state, session);
    const aiPrompts = buildAiPrompts({ projectName, model });
    const projectLabel = projectName ? `${projectName} Research Intelligence` : "Research Intelligence";
    const coveragePreview = model.sourceCoverage.slice(0, 6);
    const topRecommendations = model.recommendations.slice(0, 4);
    const topRisks = model.risks.slice(0, 4);
    const topOpportunities = model.marketOpportunities.slice(0, 4);
    const competitorMarketCards = [
      ...model.competitors.slice(0, 2).map((item) => ({
        title: item.title,
        badge: titleCase(item.type || "Competitor"),
        tone: statusTone(item.level || item.type),
        summary: item.opportunityGap || item.positioning || item.summary || "Competitor signal pending.",
        details: [
          { label: "Positioning", value: item.positioning },
          { label: "Pricing", value: item.pricing },
          { label: "Gap", value: item.opportunityGap }
        ]
      })),
      ...model.marketTrends.slice(0, 2).map((item) => ({
        title: item.title,
        badge: titleCase(item.type || "Trend"),
        tone: statusTone(item.level || item.momentum || item.type),
        summary: item.summary || item.momentum || "Market trend detail pending.",
        details: [
          { label: "Momentum", value: item.momentum },
          { label: "Seasonality", value: item.seasonality || "Not mapped yet" },
          { label: "Region", value: item.region || safeText(state.context.currentMarket, "Global") }
        ]
      }))
    ];
    const audienceKeywordCards = [
      ...model.audienceSegments.slice(0, 2).map((item) => ({
        title: item.title,
        badge: "Audience",
        tone: statusTone(item.level || item.type),
        summary: item.summary || item.painPoints[0] || item.motivations[0] || "Audience detail pending.",
        details: [
          { label: "Pain points", value: item.painPoints.join(", ") || "Not mapped yet" },
          { label: "Intent", value: item.intents.join(", ") || "Not mapped yet" },
          { label: "Triggers", value: item.triggers.join(", ") || "Not mapped yet" }
        ]
      })),
      ...model.keywordRecords.slice(0, 2).map((item) => ({
        title: item.keyword,
        badge: "Keyword",
        tone: statusTone(item.level || item.type),
        summary: item.value || item.summary || "Keyword opportunity detail pending.",
        details: [
          { label: "Intent", value: item.intent },
          { label: "Difficulty", value: item.difficulty },
          { label: "Theme", value: item.theme }
        ]
      }))
    ];

    root.innerHTML = `
      <div class="research-lab-wrapper">
        ${
          session.intelligence.error
            ? `<div class="simple-banner research-warning-banner">
                <strong>Research data is partial.</strong> ${escapeHtml(compactText(session.intelligence.error, 28, "Some research feeds did not load, so the page is falling back to project context and any last successful intelligence."))}
              </div>`
            : ""
        }

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Research Overview</h3>
              <p class="research-section-copy">Keep this workspace focused on what was discovered, what matters most, and what should be explored next.</p>
            </div>
            <span class="card-badge ${model.hasLiveIntelligence ? "success" : "warning"}">${escapeHtml(model.hasLiveIntelligence ? "Live intelligence" : "Context-driven")}</span>
          </div>
          <div class="research-toolbar">
            <button id="researchRefreshBtn" class="btn btn-secondary" type="button">Refresh Research</button>
          </div>
          <div class="research-overview-grid">
            ${[
              {
                label: "Project",
                value: projectLabel,
                meta: model.activeResearchAreas.length ? joinPreview(model.activeResearchAreas, "Waiting for structured inputs", 4) : "Waiting for structured inputs"
              },
              {
                label: "Intelligence status",
                value: session.intelligence.status === "loading" ? "Refreshing" : model.hasLiveIntelligence ? "Live + inferred" : "Context-only",
                meta: `Latest update: ${model.latestUpdate}`
              },
              {
                label: "Top opportunities",
                value: formatCount(model.marketOpportunities.length),
                meta: compactText(model.marketOpportunities[0]?.title || "No opportunity ranked yet", 12, "No opportunity ranked yet")
              },
              {
                label: "Key risks",
                value: formatCount(model.risks.length),
                meta: compactText(model.risks[0]?.title || "No risk classification yet", 12, "No risk classification yet")
              },
              {
                label: "Competitor signals",
                value: formatCount(model.competitors.length),
                meta: compactText(model.competitorSignals[0] || "Competitor feed still thin", 12, "Competitor feed still thin")
              },
              {
                label: "Audience signals",
                value: formatCount(model.audienceSegments.length),
                meta: compactText(model.audienceSignals[0] || "Audience research not yet structured", 12, "Audience research not yet structured")
              },
              {
                label: "SEO opportunity level",
                value: formatPercent(model.seoOpportunityScore, 0),
                meta: compactText(model.keywordRecords[0]?.keyword || "Keyword intelligence missing", 12, "Keyword intelligence missing")
              },
              {
                label: "Missing intelligence",
                value: formatCount(model.missingIntelligence.length),
                meta: compactText(model.missingIntelligence[0] || "Core research coverage is healthy", 12, "Core research coverage is healthy")
              }
            ].map((item) => `
              <div class="research-overview-item">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <p class="research-kpi-meta">${escapeHtml(item.meta)}</p>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Competitor / Market Signals</h3>
              <p class="research-section-copy">What the market is doing now, who is competing for attention, and where the best gaps may exist.</p>
            </div>
            <span class="card-badge ${competitorMarketCards.length ? "warning" : "neutral"}">${escapeHtml(competitorMarketCards.length ? `${competitorMarketCards.length} signals` : "Needs research")}</span>
          </div>
          <div class="research-workspace-grid">
            <div>
              ${
                competitorMarketCards.length
                  ? `<div class="research-card-grid">
                      ${competitorMarketCards.map((item) => `
                        <article class="research-signal-card">
                          <div class="research-signal-head">
                            <div>
                              <h4>${escapeHtml(item.title)}</h4>
                              <p>${escapeHtml(compactText(item.summary, 28, "Signal detail pending."))}</p>
                            </div>
                            <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(item.badge)}</span>
                          </div>
                          <div class="research-detail-grid">
                            ${item.details.map((field) => `
                              <div class="research-detail-item">
                                <span>${escapeHtml(field.label)}</span>
                                <strong>${escapeHtml(field.value || "Not mapped yet")}</strong>
                              </div>
                            `).join("")}
                          </div>
                        </article>
                      `).join("")}
                    </div>`
                  : renderEmptyState(
                      "Competitor and market signal coverage is still thin",
                      "Connect competitor records, pricing signals, and trend inputs to make this section more actionable.",
                      ["pricing signals", "positioning map", "market trends"],
                      escapeHtml
                    )
              }
            </div>
            <div class="research-stack">
              <div class="research-seo-column">
                <h4 class="insights-subtitle">What matters most now</h4>
                ${renderSignalList(topOpportunities, escapeHtml, "No market opportunity ranked yet.")}
              </div>
              <div class="research-seo-column">
                <h4 class="insights-subtitle">Coverage snapshot</h4>
                ${
                  coveragePreview.length
                    ? `<div class="research-coverage-list">
                        ${coveragePreview.map((item) => `
                          <div class="data-row">
                            <span>${escapeHtml(item.label)}</span>
                            <strong class="research-tone-${escapeHtml(statusTone(item.status))}">${escapeHtml(titleCase(item.status))}</strong>
                          </div>
                        `).join("")}
                      </div>`
                    : `<div class="empty-box">No intelligence coverage data is available yet.</div>`
                }
                ${
                  model.missingIntelligence.length
                    ? `<div class="research-missing-list">
                        ${model.missingIntelligence.slice(0, 6).map((item) => `<span class="research-chip danger">${escapeHtml(item)}</span>`).join("")}
                      </div>`
                    : ""
                }
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Audience / Keyword Opportunities</h3>
              <p class="research-section-copy">Which audiences, intents, and search openings are worth exploring next.</p>
            </div>
            <span class="card-badge ${audienceKeywordCards.length ? "success" : "warning"}">${escapeHtml(audienceKeywordCards.length ? `${audienceKeywordCards.length} signals` : "Critical gap")}</span>
          </div>
          <div class="research-workspace-grid">
            <div>
              ${
                audienceKeywordCards.length
                  ? `<div class="research-card-grid">
                      ${audienceKeywordCards.map((item) => `
                        <article class="research-signal-card">
                          <div class="research-signal-head">
                            <div>
                              <h4>${escapeHtml(item.title)}</h4>
                              <p>${escapeHtml(compactText(item.summary, 28, "Signal detail pending."))}</p>
                            </div>
                            <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(item.badge)}</span>
                          </div>
                          <div class="research-detail-grid">
                            ${item.details.map((field) => `
                              <div class="research-detail-item">
                                <span>${escapeHtml(field.label)}</span>
                                <strong>${escapeHtml(field.value || "Not mapped yet")}</strong>
                              </div>
                            `).join("")}
                          </div>
                        </article>
                      `).join("")}
                    </div>`
                  : renderEmptyState(
                      "Audience and keyword opportunities are still thin",
                      "Add audience research or keyword inputs to make this section more actionable.",
                      ["pain points", "intent mapping", "keyword clusters"],
                      escapeHtml
                    )
              }
            </div>
            <div class="research-stack">
              <div class="research-seo-column">
                <h4 class="insights-subtitle">Long-tail ideas</h4>
                ${model.longTailIdeas.length ? `<div class="research-chip-groups"><div class="research-chip-row">${model.longTailIdeas.slice(0, 12).map((item) => `<span class="research-chip">${escapeHtml(item)}</span>`).join("")}</div></div>` : `<div class="empty-box">No long-tail ideas saved yet.</div>`}
                <h4 class="insights-subtitle" style="margin-top:16px;">Content themes</h4>
                ${model.contentThemes.length ? `<div class="research-chip-groups"><div class="research-chip-row">${model.contentThemes.slice(0, 10).map((item) => `<span class="research-chip success">${escapeHtml(item)}</span>`).join("")}</div></div>` : `<div class="empty-box">No content themes clustered yet.</div>`}
              </div>
              <div class="research-seo-column">
                <h4 class="insights-subtitle">Missing clusters</h4>
                ${model.missingClusters.length ? `<ul class="simple-list">${model.missingClusters.slice(0, 6).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<div class="empty-box">No missing cluster list yet.</div>`}
                <h4 class="insights-subtitle" style="margin-top:16px;">Pages to optimize</h4>
                ${model.optimizePages.length ? `<ul class="simple-list">${model.optimizePages.slice(0, 6).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<div class="empty-box">No page optimization list yet.</div>`}
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Findings / Saved Insights</h3>
              <p class="research-section-copy">Capture what was discovered and keep the strongest reusable insights in one place.</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(`${session.savedFindings.length} saved`)}</span>
          </div>
          <div class="research-findings-grid">
            <div class="research-note-composer">
              <input id="researchNoteTitle" class="setup-input" type="text" placeholder="Finding title" value="${escapeHtml(session.noteDraft.title)}" />
              <textarea id="researchNoteBody" class="setup-input setup-textarea" rows="5" placeholder="Capture the key observation, implication, or market signal...">${escapeHtml(session.noteDraft.body)}</textarea>
              <input id="researchNoteTags" class="setup-input" type="text" placeholder="Tags, comma separated" value="${escapeHtml(session.noteDraft.tags)}" />
              <button id="researchSaveFindingBtn" class="btn btn-primary" type="button">Save Finding</button>
            </div>
            <div class="research-stack">
              <div>
                <h4 class="insights-subtitle">Saved findings</h4>
                ${
                  session.savedFindings.length
                    ? `<div class="research-saved-list">
                        ${session.savedFindings.slice(0, 6).map((item) => `
                          <article class="research-note-card">
                            <div class="research-signal-head">
                              <div>
                                <h4>${escapeHtml(item.title)}</h4>
                                <p>${escapeHtml(item.body)}</p>
                              </div>
                              <span class="card-badge neutral">${escapeHtml(item.source)}</span>
                            </div>
                            <div class="research-note-footer">
                              <span>${escapeHtml(formatDateTime(item.createdAt))}</span>
                              <div class="research-chip-row">
                                ${asArray(item.tags).map((tag) => `<span class="research-chip">${escapeHtml(tag)}</span>`).join("")}
                              </div>
                            </div>
                          </article>
                        `).join("")}
                      </div>`
                    : `<div class="empty-box">No saved findings yet. Use the composer or save one of the reusable insight blocks below.</div>`
                }
              </div>
              <div>
                <h4 class="insights-subtitle">Reusable insight blocks</h4>
                ${
                  model.autoFindings.length
                    ? `<div class="research-saved-list">
                        ${model.autoFindings.slice(0, 4).map((item, index) => `
                          <article class="research-note-card">
                            <div class="research-signal-head">
                              <div>
                                <h4>${escapeHtml(item.title)}</h4>
                                <p>${escapeHtml(item.body)}</p>
                              </div>
                              <span class="card-badge neutral">${escapeHtml(item.source)}</span>
                            </div>
                            <div class="research-note-footer">
                              <div class="research-chip-row">
                                ${item.tags.map((tag) => `<span class="research-chip">${escapeHtml(tag)}</span>`).join("")}
                              </div>
                              <button class="quick-action-btn research-inline-action" type="button" data-save-research-block="${index}">Save Block</button>
                            </div>
                          </article>
                        `).join("")}
                      </div>`
                    : `<div class="empty-box">Reusable blocks will appear as soon as stronger opportunities, risks, or keyword signals are available.</div>`
                }
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Recommendations / Next Research Actions</h3>
              <p class="research-section-copy">What matters most now, what should be explored next, and where validated research should go.</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(`${session.savedRecommendations.length} saved`)}</span>
          </div>
          <div class="research-workspace-grid">
            <div class="research-stack">
              <div>
                <h4 class="insights-subtitle">Recommendations</h4>
                ${renderSignalList(topRecommendations, escapeHtml, "No recommendations surfaced yet.")}
              </div>
              <div>
                <h4 class="insights-subtitle">Risks to explore next</h4>
                ${renderSignalList(topRisks, escapeHtml, "No risks surfaced yet.")}
              </div>
              <div>
                <h4 class="insights-subtitle">Opportunity map</h4>
                ${
                  model.opportunityPool.length
                    ? `<div class="research-opportunity-grid">
                        ${model.opportunityPool.slice(0, 4).map((item, index) => `
                          <article class="research-opportunity-card">
                            <div class="research-signal-head">
                              <div>
                                <h4>${escapeHtml(item.title)}</h4>
                                <p>${escapeHtml(item.summary)}</p>
                              </div>
                              <span class="card-badge ${statusTone(item.lane)}">${escapeHtml(titleCase(item.lane))}</span>
                            </div>
                            <div class="research-opportunity-meta">
                              <span>Priority score</span>
                              <strong>${escapeHtml(formatCount(item.score))}</strong>
                              <span>Best route</span>
                              <strong>${escapeHtml(item.routeTarget.label)}</strong>
                            </div>
                            <button class="quick-action-btn" type="button" data-research-opportunity="${index}">Send to ${escapeHtml(item.routeTarget.label)}</button>
                          </article>
                        `).join("")}
                      </div>`
                    : renderEmptyState(
                        "Opportunity map is waiting for ranked inputs",
                        "Once competitor, audience, SEO, or product signals arrive, the page will turn them into short-term and growth-oriented opportunities automatically.",
                        ["short-term wins", "SEO opportunities", "ad tests"],
                        escapeHtml
                      )
                }
              </div>
            </div>
            <div class="research-stack">
              <div class="research-seo-column">
                <h4 class="insights-subtitle">Saved recommendation</h4>
                <button id="researchSaveRecommendationBtn" class="btn btn-primary" type="button">Save Recommendation</button>
                ${
                  session.savedRecommendations.length
                    ? `<div class="research-saved-list" style="margin-top:16px;">
                        ${session.savedRecommendations.slice(0, 4).map((item) => `
                          <article class="research-note-card">
                            <div class="research-signal-head">
                              <div>
                                <h4>${escapeHtml(item.title)}</h4>
                                <p>${escapeHtml(item.summary)}</p>
                              </div>
                              <span class="card-badge neutral">${escapeHtml(item.target)}</span>
                            </div>
                            <div class="research-note-footer">
                              <span>${escapeHtml(formatDateTime(item.createdAt))}</span>
                            </div>
                          </article>
                        `).join("")}
                      </div>`
                    : `<div class="empty-box" style="margin-top:16px;">Save a structured recommendation to keep the best next move accessible for later routing.</div>`
                }
              </div>
              <div class="research-seo-column">
                <h4 class="insights-subtitle">Send to execution</h4>
                <div class="quick-actions">
                  <button class="quick-action-btn" type="button" data-research-route="campaign">Send to Campaign Studio</button>
                  <button class="quick-action-btn" type="button" data-research-route="content">Send to Content Studio</button>
                  <button class="quick-action-btn" type="button" data-research-route="seo">Send to SEO Workflow</button>
                  <button class="quick-action-btn" type="button" data-research-route="ads">Send to Ads Manager</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h3>Research AI Assistant</h3>
              <p class="research-section-copy">Use AI to deepen the current research, not to replace the saved findings and next-action surfaces above.</p>
            </div>
            <span class="card-badge success">Active partner</span>
          </div>
          <div class="research-toolbar">
            <button class="btn ghost" type="button" data-research-open>Open AI: Review in AI Workspace</button>
            <button class="btn btn-secondary" type="button" data-research-route="ai">Send to AI Workspace</button>
          </div>
          <div class="quick-actions">
            ${aiPrompts.map((item, index) => `
              <button class="quick-action-btn" type="button" data-research-ai-prompt="${index}">
                <strong>${escapeHtml(item.label)}</strong><br />
                <span class="home-action-meta" title="${escapeHtml(item.prompt)}">${escapeHtml(item.preview || compactText(item.prompt, 18, ""))}</span>
              </button>
            `).join("")}
          </div>
        </section>
      </div>
    `;

    bindResearchActions({
      $,
      getState,
      navigateTo,
      showMessage,
      showError,
      fetchProjectInsights,
      fetchProjectLearning,
      createProjectHandoff,
      render: rerender,
      session,
      model
    });
  }
};
