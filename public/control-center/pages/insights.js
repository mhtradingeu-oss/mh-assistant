import { setSharedHandoff } from "../shared-context.js";

const PLATFORM_DEFS = [
  {
    id: "facebook",
    label: "Facebook",
    type: "social",
    sourceKeys: ["facebook"],
    emptyTitle: "No Facebook insight feed yet"
  },
  {
    id: "instagram",
    label: "Instagram",
    type: "social",
    sourceKeys: ["instagram"],
    emptyTitle: "No Instagram insight feed yet"
  },
  {
    id: "tiktok",
    label: "TikTok",
    type: "social",
    sourceKeys: ["tiktok"],
    emptyTitle: "No TikTok insight feed yet"
  },
  {
    id: "youtube",
    label: "YouTube",
    type: "social",
    sourceKeys: ["youtube"],
    emptyTitle: "No YouTube insight feed yet"
  },
  {
    id: "website",
    label: "Website",
    type: "website",
    sourceKeys: ["website", "analytics"],
    emptyTitle: "No website analytics feed yet"
  },
  {
    id: "seo",
    label: "SEO / Search",
    type: "seo",
    sourceKeys: ["google", "analytics", "website"],
    emptyTitle: "No Search Console feed yet"
  },
  {
    id: "paid",
    label: "Paid Ads",
    type: "paid",
    sourceKeys: ["google_ads", "facebook", "instagram", "tiktok", "amazon", "analytics"],
    emptyTitle: "No paid performance feed yet"
  }
];

const insightsRefreshState = new Map();

function getInsightsRefreshState(projectName) {
  const key = asString(projectName || "__default__");
  if (!insightsRefreshState.has(key)) {
    insightsRefreshState.set(key, {
      loading: false,
      error: ""
    });
  }
  return insightsRefreshState.get(key);
}

function setInsightsRefreshState(projectName, nextState) {
  const key = asString(projectName || "__default__");
  const current = getInsightsRefreshState(projectName);
  insightsRefreshState.set(key, {
    ...current,
    ...asObject(nextState)
  });
}

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

function toNumber(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatInteger(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "--";
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0
  }).format(parsed);
}

function formatCompact(value) {
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

function formatMetricValue(metric, value, currency = "USD") {
  if (value == null) return "--";
  if (["revenue", "value", "spend", "cpc", "cpa"].includes(metric)) {
    return formatCurrency(value, currency);
  }
  if (metric === "ctr") return formatPercent(value, 2);
  if (metric === "roas") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? `${parsed.toFixed(2)}x` : "--";
  }
  return formatCompact(value);
}

function metricLabel(metric) {
  const labels = {
    reach: "Reach",
    engagement: "Engagement",
    clicks: "Clicks",
    conversions: "Conversions",
    revenue: "Revenue",
    spend: "Spend",
    roas: "ROAS",
    ctr: "CTR",
    cpc: "CPC",
    cpa: "CPA",
    sessions: "Sessions",
    engaged_sessions: "Engaged Sessions",
    impressions: "Impressions",
    avg_position: "Avg. Position"
  };
  return labels[metric] || titleCase(metric);
}

function statusTone(level) {
  const normalized = asString(level).toLowerCase();
  if (
    normalized.includes("weak") ||
    normalized.includes("not connected") ||
    normalized.includes("missing") ||
    normalized.includes("failed")
  ) {
    return "danger";
  }
  if (
    normalized.includes("mixed") ||
    normalized.includes("partial") ||
    normalized.includes("awaiting")
  ) {
    return "warning";
  }
  if (
    normalized.includes("strong") ||
    normalized.includes("connected") ||
    normalized.includes("healthy")
  ) {
    return "success";
  }
  return "neutral";
}

function getTimestamp(item) {
  const fields = ["published_at", "executed_at", "scheduled_for", "updated_at", "created_at"];
  for (const field of fields) {
    const value = item?.[field];
    if (!value) continue;
    const time = Date.parse(value);
    if (Number.isFinite(time)) return time;
  }
  return 0;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(date);
}

function getConnections(state) {
  return {
    sources: asObject(state.data.integrations?.sources?.sources),
    checks: asObject(state.data.integrations?.readiness?.checks)
  };
}

function getInsightRoot(state) {
  const activity = asObject(state.data.activity);
  const overview = asObject(state.data.overview);
  return asObject(
    activity.insights ||
    activity.marketing_insights ||
    activity.performance_insights ||
    overview.insights
  );
}

function hasInsightPayload(data) {
  const payload = asObject(data);
  return Object.keys(payload).length > 0;
}

function normalizeSummary(raw) {
  const summary = asObject(raw.summary || raw.overview || raw);
  return {
    reach: toNumber(summary.total_reach ?? summary.reach),
    engagement: toNumber(summary.total_engagement ?? summary.engagement),
    clicks: toNumber(summary.total_clicks ?? summary.clicks),
    conversions: toNumber(summary.total_conversions ?? summary.conversions),
    revenue: toNumber(summary.total_revenue ?? summary.revenue ?? summary.value),
    spend: toNumber(summary.total_spend ?? summary.spend),
    roas: toNumber(summary.roas),
    ctr: toNumber(summary.ctr),
    cpc: toNumber(summary.cpc),
    cpa: toNumber(summary.cpa),
    sessions: toNumber(summary.sessions),
    engagedSessions: toNumber(summary.engaged_sessions ?? summary.engagedSessions),
    impressions: toNumber(summary.impressions),
    averagePosition: toNumber(summary.average_position ?? summary.avg_position),
    performanceLevel: asString(summary.performance_level || summary.status),
    strongestMetric: asString(summary.strongest_metric),
    weakestMetric: asString(summary.weakest_metric),
    trendDirection: asString(summary.trend_direction || summary.trend),
    recommendation: asString(summary.recommendation)
  };
}

function getFeedSummary(platform, feeds) {
  if (platform.type === "social") {
    return normalizeSummary(asObject(feeds.social?.[platform.id]));
  }
  if (platform.type === "website") {
    return normalizeSummary(asObject(feeds.website));
  }
  if (platform.type === "seo") {
    return normalizeSummary(asObject(feeds.seo));
  }
  return normalizeSummary(asObject(feeds.paid));
}

function getConnectedValue(sourceKeys, connections) {
  return sourceKeys.some((key) => {
    const source = asObject(connections.sources[key]);
    return Boolean(connections.checks[key] || asString(source.value).trim());
  });
}

function hasSummaryMetrics(summary) {
  return [
    summary.reach,
    summary.engagement,
    summary.clicks,
    summary.conversions,
    summary.revenue,
    summary.spend,
    summary.roas,
    summary.ctr,
    summary.sessions,
    summary.impressions
  ].some((value) => value != null);
}

function normalizeContentItem(item, platformId = "") {
  const preview = asObject(item.preview || item.connector_preview);
  const metrics = asObject(item.metrics);
  const summary = asObject(item.summary);
  const label =
    asString(item.title || item.label || item.content_label || preview.title || preview.headline) ||
    "Published content";

  const normalized = {
    id: asString(item.id || item.post_id || item.content_id || item.job_id || label),
    platform: platformId || asString(item.platform || item.channel || preview.channel),
    label,
    format: asString(item.format || item.content_type || item.type || preview.format || "Post"),
    reach: toNumber(item.reach ?? metrics.reach ?? summary.reach),
    engagement: toNumber(item.engagement ?? metrics.engagement ?? summary.engagement),
    clicks: toNumber(item.clicks ?? metrics.clicks ?? summary.clicks),
    conversions: toNumber(item.conversions ?? metrics.conversions ?? summary.conversions),
    revenue: toNumber(item.revenue ?? metrics.revenue ?? summary.revenue),
    publishedAt: asString(item.published_at || item.executed_at || item.updated_at || item.created_at),
    whyItWorked: asString(item.why_it_worked || item.reason || item.insight || ""),
    likelyReason: asString(item.likely_reason || item.reason || ""),
    improveNext: asString(item.improve_next || item.recommendation || ""),
    hook: asString(item.hook || preview.headline || ""),
    topic: asString(item.topic || item.angle || preview.goal || ""),
    cta: asString(item.cta || preview.cta || ""),
    postingWindow: asString(item.posting_window || ""),
    hasMetrics: false,
    score: null
  };

  normalized.hasMetrics = [
    normalized.reach,
    normalized.engagement,
    normalized.clicks,
    normalized.conversions,
    normalized.revenue
  ].some((value) => value != null);

  if (normalized.hasMetrics) {
    normalized.score =
      (normalized.reach || 0) * 0.2 +
      (normalized.engagement || 0) * 1.2 +
      (normalized.clicks || 0) * 2 +
      (normalized.conversions || 0) * 5 +
      (normalized.revenue || 0) * 0.02;
  }

  return normalized;
}

function buildContentInventory(state, feeds) {
  const activity = asObject(state.data.activity);
  const socialFeeds = asObject(feeds.social);
  const fromFeeds = Object.entries(socialFeeds).flatMap(([platformId, raw]) => {
    const source = asObject(raw);
    const items = asArray(
      source.top_content ||
      source.top_posts ||
      source.posts ||
      source.items ||
      source.content
    );
    return items.map((item) => normalizeContentItem(item, platformId));
  });

  const existingIds = new Set(fromFeeds.map((item) => item.id));
  const fromActivity = [
    ...asArray(activity.execution_results),
    ...asArray(activity.scheduled_jobs)
  ]
    .map((item) => normalizeContentItem(item, asString(item.channel)))
    .filter((item) => !existingIds.has(item.id));

  return [...fromFeeds, ...fromActivity]
    .sort((a, b) => (b.score || 0) - (a.score || 0) || getTimestamp(b) - getTimestamp(a));
}

function buildExecutiveOverview(feeds, contentItems, connections, currency = "USD") {
  const socialSummaries = ["facebook", "instagram", "tiktok", "youtube"]
    .map((key) => normalizeSummary(asObject(feeds.social?.[key])));
  const websiteSummary = normalizeSummary(asObject(feeds.website));
  const seoSummary = normalizeSummary(asObject(feeds.seo));
  const paidSummary = normalizeSummary(asObject(feeds.paid));

  const sumMetric = (items, key) => {
    const values = items.map((item) => item[key]).filter((value) => value != null);
    return values.length ? values.reduce((total, value) => total + value, 0) : null;
  };

  const totalReach = sumMetric(socialSummaries, "reach");
  const totalEngagement = sumMetric(socialSummaries, "engagement");
  const totalClicks = sumMetric([...socialSummaries, websiteSummary], "clicks");
  const totalConversions = [
    sumMetric(socialSummaries, "conversions"),
    websiteSummary.conversions,
    paidSummary.conversions
  ].filter((value) => value != null);
  const totalRevenueValues = [
    sumMetric(socialSummaries, "revenue"),
    websiteSummary.revenue,
    paidSummary.revenue,
    normalizeSummary(asObject(feeds.marketplace)).revenue
  ].filter((value) => value != null);
  const totalSpend = paidSummary.spend;
  const totalRevenue = totalRevenueValues.length ? totalRevenueValues.reduce((total, value) => total + value, 0) : null;
  const overallRoas = totalRevenue != null && totalSpend != null && totalSpend > 0
    ? totalRevenue / totalSpend
    : paidSummary.roas;

  const publishedCount = contentItems.filter((item) => item.hasMetrics).length;
  const connectedPlatformCount = PLATFORM_DEFS.filter((platform) => getConnectedValue(platform.sourceKeys, connections)).length;
  const seoVisibility = seoSummary.impressions != null
    ? `${formatCompact(seoSummary.impressions)} impressions`
    : getConnectedValue(["google", "analytics", "website"], connections)
      ? "Connected, awaiting feed"
      : "Not connected";

  return {
    kpis: [
      {
        label: "Total reach",
        value: totalReach == null ? "--" : formatCompact(totalReach),
        meta: totalReach == null ? "Awaiting social insight feeds" : `${publishedCount} measured content items`
      },
      {
        label: "Total engagement",
        value: totalEngagement == null ? "--" : formatCompact(totalEngagement),
        meta: totalEngagement == null ? "Awaiting social insight feeds" : "Cross-platform engagement signal"
      },
      {
        label: "Total clicks",
        value: totalClicks == null ? "--" : formatCompact(totalClicks),
        meta: totalClicks == null ? "Awaiting social + website feeds" : "Traffic-driving content signal"
      },
      {
        label: "Total conversions",
        value: totalConversions.length ? formatCompact(totalConversions.reduce((total, value) => total + value, 0)) : "--",
        meta: totalConversions.length ? "Attributed conversion signal" : "Awaiting site / paid conversion feed"
      },
      {
        label: "Attributed value",
        value: totalRevenue == null ? "--" : formatCurrency(totalRevenue, currency),
        meta: totalRevenue == null ? "Awaiting commerce analytics" : "Revenue / value signal"
      },
      {
        label: "Total spend",
        value: totalSpend == null ? "--" : formatCurrency(totalSpend, currency),
        meta: totalSpend == null ? "Awaiting paid feed" : "Paid media spend"
      },
      {
        label: "Overall ROAS",
        value: overallRoas == null ? "--" : `${overallRoas.toFixed(2)}x`,
        meta: overallRoas == null ? "Awaiting revenue + spend" : "Cross-platform efficiency"
      },
      {
        label: "SEO visibility",
        value: seoVisibility,
        meta: `${connectedPlatformCount}/${PLATFORM_DEFS.length} intelligence sources connected`
      }
    ],
    summary: totalReach == null && totalClicks == null && totalSpend == null
      ? "The Insight Engine is structurally ready, but live performance feeds are still sparse. Connect social insights, website analytics, SEO, and paid platforms to unlock real learning."
      : "This workspace is blending the currently available social, website, SEO, and paid signals into one optimization layer so the system can learn what to scale, what to fix, and what to reuse."
  };
}

function buildPlatformCards(state, feeds, connections, currency = "USD") {
  return PLATFORM_DEFS.map((platform) => {
    const summary = getFeedSummary(platform, feeds);
    const connected = getConnectedValue(platform.sourceKeys, connections);
    const hasData = hasSummaryMetrics(summary);

    let performanceLevel = "Not connected";
    if (connected && !hasData) performanceLevel = "Connected, awaiting feed";
    if (hasData) {
      performanceLevel =
        summary.performanceLevel ||
        (summary.revenue != null || summary.conversions != null
          ? "Strong conversion signal"
          : summary.clicks != null || summary.engagement != null
            ? "Mixed performance signal"
            : "Weak signal");
    }

    const strongestMetric = summary.strongestMetric ||
      (summary.roas != null ? `ROAS ${formatMetricValue("roas", summary.roas, currency)}` :
        summary.conversions != null ? `Conversions ${formatMetricValue("conversions", summary.conversions, currency)}` :
          summary.clicks != null ? `Clicks ${formatMetricValue("clicks", summary.clicks, currency)}` :
            summary.engagement != null ? `Engagement ${formatMetricValue("engagement", summary.engagement, currency)}` :
              connected ? "Feed connected, waiting for metrics" : "Connect this source");

    const weakestMetric = summary.weakestMetric ||
      (hasData
        ? (summary.ctr != null ? `CTR ${formatMetricValue("ctr", summary.ctr, currency)}` : "Need more optimization context")
        : connected ? "No live metric stream yet" : "No insight source");

    const trendDirection = summary.trendDirection ||
      (hasData ? "Trend available when historical snapshots are connected" : "No trend yet");

    const recommendation = summary.recommendation ||
      (connected
        ? "Map real API data into this card to unlock comparison and recommendations."
        : "Connect this platform so the system can learn from it.");

    return {
      platform,
      connected,
      hasData,
      performanceLevel,
      strongestMetric,
      weakestMetric,
      trendDirection,
      recommendation,
      summary
    };
  });
}

function buildTopContent(contentItems) {
  return contentItems
    .filter((item) => item.hasMetrics)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      title: item.label,
      platform: titleCase(item.platform || "Unknown"),
      format: item.format || "Content",
      reach: item.reach,
      engagement: item.engagement,
      clicks: item.clicks,
      conversions: item.conversions,
      why: item.whyItWorked || item.hook || item.topic || "Learning reason will improve once richer post-level insight data is attached."
    }));
}

function buildWeakContent(contentItems) {
  return contentItems
    .filter((item) => item.hasMetrics)
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, 5)
    .map((item) => ({
      title: item.label,
      platform: titleCase(item.platform || "Unknown"),
      weakMetrics: [
        item.reach != null ? `Reach ${formatCompact(item.reach)}` : "",
        item.engagement != null ? `Engagement ${formatCompact(item.engagement)}` : "",
        item.clicks != null ? `Clicks ${formatCompact(item.clicks)}` : "",
        item.conversions != null ? `Conversions ${formatCompact(item.conversions)}` : ""
      ].filter(Boolean).join(" • "),
      reason: item.likelyReason || item.topic || "The system needs more comparative insight data to explain the weakness precisely.",
      improve: item.improveNext || "Rewrite the hook, refine the CTA, and test a stronger format or platform match."
    }));
}

function buildWebsiteIntelligence(feeds, connections) {
  const website = asObject(feeds.website);
  const summary = normalizeSummary(website);
  return {
    connected: getConnectedValue(["website", "analytics"], connections),
    hasData: hasSummaryMetrics(summary),
    summary,
    topPages: asArray(website.top_pages || website.best_pages || website.top_landing_pages),
    weakPages: asArray(website.weak_pages || website.low_converting_pages || website.dropoff_pages),
    conversionSignals: asArray(website.conversion_signals || website.conversion_paths || website.funnel_signals),
    recommendations: asArray(website.recommendations || website.opportunities)
  };
}

function buildSeoIntelligence(feeds, connections) {
  const seo = asObject(feeds.seo);
  const summary = normalizeSummary(seo);
  return {
    connected: getConnectedValue(["google", "website", "analytics"], connections),
    hasData: hasSummaryMetrics(summary),
    summary,
    topQueries: asArray(seo.top_queries || seo.queries),
    topPages: asArray(seo.top_pages || seo.pages),
    ctrOpportunities: asArray(seo.low_ctr_pages || seo.ctr_opportunities),
    rankingOpportunities: asArray(seo.opportunities || seo.ranking_opportunities || seo.content_themes)
  };
}

function buildPaidIntelligence(feeds, connections) {
  const paid = asObject(feeds.paid);
  const summary = normalizeSummary(paid);
  return {
    connected: getConnectedValue(["google_ads", "facebook", "instagram", "tiktok", "amazon", "analytics"], connections),
    hasData: hasSummaryMetrics(summary),
    summary,
    bestCampaigns: asArray(paid.best_campaigns || paid.top_campaigns || paid.campaigns).filter((item, index) => {
      const status = asString(item.status || item.performance_level).toLowerCase();
      return status.includes("best") || status.includes("strong") || index < 3;
    }).slice(0, 4),
    weakCampaigns: asArray(paid.weak_campaigns || paid.campaigns).filter((item) => {
      const status = asString(item.status || item.performance_level).toLowerCase();
      return status.includes("weak") || status.includes("poor") || status.includes("under");
    }).slice(0, 4),
    bestCreatives: asArray(paid.best_creatives || paid.top_creatives || paid.creatives).slice(0, 4),
    weakCreatives: asArray(paid.weak_creatives || []).slice(0, 4)
  };
}

function buildLearningEngine(contentItems, platformCards, websiteIntel, seoIntel, paidIntel, connections) {
  const measured = contentItems.filter((item) => item.hasMetrics);
  const formatScores = new Map();
  const platformScores = new Map();
  const topicScores = new Map();
  const ctaScores = new Map();
  const postingWindows = new Map();

  measured.forEach((item) => {
    const score = item.score || 0;
    const add = (map, key) => {
      const safeKey = asString(key).trim();
      if (!safeKey) return;
      if (!map.has(safeKey)) {
        map.set(safeKey, { key: safeKey, total: 0, count: 0 });
      }
      const entry = map.get(safeKey);
      entry.total += score;
      entry.count += 1;
    };

    add(formatScores, item.format);
    add(platformScores, item.platform);
    add(topicScores, item.topic);
    add(ctaScores, item.cta);

    const hour = item.publishedAt ? new Date(item.publishedAt).getHours() : null;
    if (hour != null && Number.isFinite(hour)) {
      const bucket = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
      add(postingWindows, bucket);
    }
  });

  const bestEntry = (map, fallback) => {
    const best = Array.from(map.values())
      .sort((a, b) => (b.total / b.count) - (a.total / a.count))[0];
    return best ? best.key : fallback;
  };

  const weakPatterns = measured.length
    ? buildWeakContent(measured).slice(0, 2).map((item) => `${item.platform}: ${item.improve}`)
    : [];

  const cards = [
    {
      title: "Best hooks",
      body: measured.length ? bestEntry(topicScores, "No repeated topic signal yet") : "No live post-performance feed yet. Connect social insight APIs to learn what hooks are winning."
    },
    {
      title: "Best content formats",
      body: measured.length ? bestEntry(formatScores, "No format signal yet") : "Format learning will appear once measured posts or videos are ingested."
    },
    {
      title: "Best channels",
      body: measured.length ? titleCase(bestEntry(platformScores, "No channel signal yet")) : platformCards.filter((item) => item.connected).map((item) => item.platform.label).join(", ") || "No connected platform yet"
    },
    {
      title: "Best posting windows",
      body: measured.length ? bestEntry(postingWindows, "No timing signal yet") : "Posting window insights require timestamped post performance data."
    },
    {
      title: "Strongest CTA pattern",
      body: measured.length ? bestEntry(ctaScores, "No CTA signal yet") : "CTA learning will appear once conversion-aware content data is connected."
    },
    {
      title: "Weak patterns to avoid",
      body: weakPatterns.length ? weakPatterns.join(" • ") : "No weak pattern signal yet. Connect performance data so the system can detect what to avoid."
    }
  ];

  const systemLessons = [];
  if (!websiteIntel.connected) {
    systemLessons.push("Connect website analytics so content can be linked to sessions, engaged sessions, and conversions.");
  }
  if (!seoIntel.connected) {
    systemLessons.push("Connect Search Console so the system can learn which pages and queries deserve new content.");
  }
  if (!paidIntel.connected) {
    systemLessons.push("Connect paid performance so creative and audience learnings can improve ad spend efficiency.");
  }
  if (!measured.length) {
    systemLessons.push("Start ingesting post-level Facebook, Instagram, TikTok, and YouTube insight data so winning patterns can be reused automatically.");
  }

  return { cards, systemLessons };
}

function buildOptimizationPanel(state, platformCards, websiteIntel, seoIntel, paidIntel, measuredTop, weakItems, learning) {
  const recommendations = [];
  const projectName = state.context.currentProject || "this project";

  const platformsAwaitingFeed = platformCards
    .filter((item) => item.connected && !item.hasData)
    .map((item) => item.platform.label);
  if (platformsAwaitingFeed.length) {
    recommendations.push({
      title: "Connect live platform insight feeds",
      meta: `These sources are connected but still not sending analytics into the Insight Engine: ${platformsAwaitingFeed.join(", ")}.`,
      tone: "warning"
    });
  }

  if (weakItems.length) {
    recommendations.push({
      title: "Rewrite or repurpose weak content",
      meta: `${weakItems[0].title} and similar assets need stronger hooks, better CTAs, or a better channel / format match.`,
      tone: "warning"
    });
  }

  if (measuredTop.length) {
    recommendations.push({
      title: "Scale what is already working",
      meta: `${measuredTop[0].title} is currently the strongest measured content item. Repurpose its hook, format, or CTA into new assets.`,
      tone: "success"
    });
  }

  if (websiteIntel.connected && !websiteIntel.hasData) {
    recommendations.push({
      title: "Activate website and GA4 intelligence",
      meta: "Website is present, but no sessions, landing-page, or conversion metrics are flowing into Insights yet.",
      tone: "warning"
    });
  }

  if (seoIntel.connected && !seoIntel.hasData) {
    recommendations.push({
      title: "Activate Search Console intelligence",
      meta: "SEO is structurally expected here, but top queries, CTR, and ranking opportunities are still missing.",
      tone: "warning"
    });
  }

  if (paidIntel.connected && !paidIntel.hasData) {
    recommendations.push({
      title: "Activate paid campaign intelligence",
      meta: "Paid connectors are expected, but spend, CTR, CPC, CPA, and ROAS are not available yet.",
      tone: "warning"
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Insight Engine is ready for deeper optimization",
      meta: "Feed more granular post, page, query, and campaign metrics into this page to improve learning accuracy.",
      tone: "neutral"
    });
  }

  const prompts = [
    {
      label: "What should we improve next?",
      prompt: `Review all available insights for ${projectName} and tell me the highest-impact improvement to make next across content, publishing, SEO, paid media, and website conversion.`
    },
    {
      label: "Which platform is strongest?",
      prompt: `Using the connected cross-platform performance signals for ${projectName}, identify the strongest platform, explain why it is strongest, and say what we should scale there.`
    },
    {
      label: "Which posts should we repurpose?",
      prompt: `From the best-performing published content for ${projectName}, identify which posts or videos should be repurposed next and how they should be adapted for other platforms.`
    },
    {
      label: "What SEO opportunities are most valuable?",
      prompt: `Review the SEO and Search Console signals for ${projectName}. Tell me the most valuable query, page, and CTR opportunities to act on next.`
    },
    {
      label: "What weak content should be rewritten?",
      prompt: `Review the weakest measured content for ${projectName} and tell me which items should be rewritten first, why they are weak, and what new angle should replace them.`
    },
    {
      label: "What winning pattern should we scale?",
      prompt: `Summarize the strongest reusable pattern in ${projectName}'s current performance data, including hook, format, CTA, platform, and timing.`
    }
  ];

  return {
    recommendations,
    prompts,
    lessons: learning.systemLessons
  };
}

function renderPlatformCards(cards, currency, escapeHtml) {
  return `
    <div class="insights-platform-grid">
      ${cards.map((item) => `
        <section class="insights-platform-card">
          <div class="insights-platform-head">
            <div>
              <h4>${escapeHtml(item.platform.label)}</h4>
              <p>${escapeHtml(item.connected ? "Source connected or expected" : "Source not connected")}</p>
            </div>
            <span class="card-badge ${statusTone(item.performanceLevel)}">${escapeHtml(item.performanceLevel)}</span>
          </div>
          <div class="insights-platform-metrics">
            <div class="data-row">
              <span>Strongest metric</span>
              <strong>${escapeHtml(item.strongestMetric)}</strong>
            </div>
            <div class="data-row">
              <span>Weakest metric</span>
              <strong>${escapeHtml(item.weakestMetric)}</strong>
            </div>
            <div class="data-row">
              <span>Trend</span>
              <strong>${escapeHtml(item.trendDirection || "No trend yet")}</strong>
            </div>
          </div>
          <div class="insights-platform-note">${escapeHtml(item.recommendation)}</div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderRankedContent(items, emptyText, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="insights-ranked-list">
      ${items.map((item) => `
        <div class="insights-ranked-item">
          <div class="insights-ranked-head">
            <div class="insights-ranked-title">
              ${item.rank ? `<span class="insights-rank">${escapeHtml(String(item.rank))}</span>` : ""}
              <strong>${escapeHtml(item.title)}</strong>
            </div>
            <span class="card-badge neutral">${escapeHtml(`${item.platform} • ${item.format}`)}</span>
          </div>
          <div class="insights-ranked-grid">
            <div class="data-card">
              <span class="data-label">Reach</span>
              <strong>${escapeHtml(formatCompact(item.reach))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Engagement</span>
              <strong>${escapeHtml(formatCompact(item.engagement))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Clicks</span>
              <strong>${escapeHtml(formatCompact(item.clicks))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Conversions</span>
              <strong>${escapeHtml(formatCompact(item.conversions))}</strong>
            </div>
          </div>
          <div class="insights-ranked-note">${escapeHtml(item.why)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderWeakContent(items, emptyText, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="insights-list">
      ${items.map((item) => `
        <div class="insights-list-item">
          <div class="insights-list-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="card-badge warning">${escapeHtml(item.platform)}</span>
          </div>
          <div class="insights-list-meta">${escapeHtml(item.weakMetrics || "No metric detail yet")}</div>
          <div class="insights-list-note">${escapeHtml(`Why likely weak: ${item.reason}`)}</div>
          <div class="insights-list-note">${escapeHtml(`Improve next: ${item.improve}`)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFeedAwareEmptyState(title, description, connected, escapeHtml) {
  return `
    <div class="insights-empty-state">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
      <span class="card-badge ${connected ? "warning" : "danger"}">${escapeHtml(connected ? "Connected, awaiting feed" : "Not connected")}</span>
    </div>
  `;
}

function renderSimpleMetrics(rows, escapeHtml) {
  return `
    <div class="data-stack">
      ${rows.map((row) => `
        <div class="data-row">
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderKeyValueList(items, type, escapeHtml) {
  if (!items.length) {
    return "";
  }

  return `
    <div class="insights-mini-list">
      ${items.map((item) => {
        const label = asString(item.title || item.label || item.query || item.page || item.name || item.url || "Item");
        let value = asString(item.value || item.metric || item.meta);

        if (!value) {
          if (type === "query") {
            value = [
              item.clicks != null ? `Clicks ${formatCompact(item.clicks)}` : "",
              item.impressions != null ? `Impressions ${formatCompact(item.impressions)}` : "",
              item.ctr != null ? `CTR ${formatPercent(item.ctr, 2)}` : "",
              item.avg_position != null ? `Position ${item.avg_position}` : ""
            ].filter(Boolean).join(" • ");
          } else {
            value = [
              item.sessions != null ? `Sessions ${formatCompact(item.sessions)}` : "",
              item.conversions != null ? `Conversions ${formatCompact(item.conversions)}` : "",
              item.ctr != null ? `CTR ${formatPercent(item.ctr, 2)}` : "",
              item.revenue != null ? `Value ${formatCurrency(item.revenue)}` : ""
            ].filter(Boolean).join(" • ");
          }
        }

        return `
          <div class="insights-mini-item">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(value || "No metric detail yet")}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
  Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
    button.onclick = () => {
      navigateTo("ai-command");
    };
  });

  Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
    button.onclick = () => {
      const route = button.getAttribute("data-insights-route") || "";
      if (!route) return;

      if (projectName) {
        setSharedHandoff(projectName, route, {
          source_page: "insights",
          destination_page: route,
          linked_entity: {
            entity_type: "project",
            entity_id: projectName,
            route: "insights",
            label: projectName
          },
          payload: {
            draft_context: {
              origin: "insights",
              projectName,
              optimizationFocus: "next-action"
            }
          },
          status: "available"
        });
      }

      navigateTo(route);
      showMessage?.(`Opened ${button.textContent?.trim() || "next workspace"}.`);
    };
  });

  Array.from(document.querySelectorAll("[data-insights-prompt]")).forEach((button) => {
    button.onclick = () => {
      const index = Number(button.getAttribute("data-insights-prompt"));
      const item = prompts[index];
      if (!item) return;

      const input = $("quickCommandInput");
      if (input) {
        input.value = item.prompt;
      }

      if (projectName && item.prompt) {
        const handoff = {
          source_page: "insights",
          destination_page: "ai-command",
          linked_entity: {
            entity_type: "project",
            entity_id: projectName,
            route: "insights",
            label: projectName
          },
          payload: {
            prompt: item.prompt,
            draft_context: {
              origin: "insights",
              projectName,
              promptLabel: item.label
            }
          }
        };
        setSharedHandoff(projectName, "ai-command", handoff);
        createProjectHandoff?.(projectName, handoff).catch((error) => {
          console.warn("Failed to persist Insights handoff:", error.message);
        });
      }

      navigateTo("ai-command");
      showMessage?.("Insight prompt added to AI Command.");
    };
  });
}

export const insightsRoute = {
  id: "insights",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Execute & Grow",
    title: "Insights",
    description: "Cross-platform marketing intelligence for performance, learning, and optimization."
  },
  template: `
    <section class="page is-active" data-page="insights">
      <div id="insightsRoot"></div>
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
    createProjectHandoff
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const refreshState = getInsightsRefreshState(projectName);
    const overview = asObject(state.data.overview?.overview);
    const currency = overview.currency || "USD";
    const connections = getConnections(state);
    const insightRoot = getInsightRoot(state);
    const feeds = {
      social: asObject(insightRoot.social || insightRoot.social_platforms || {}),
      marketplace: asObject(insightRoot.marketplace || insightRoot.commerce || {}),
      website: asObject(insightRoot.website || insightRoot.analytics || insightRoot.ga4 || {}),
      seo: asObject(insightRoot.seo || insightRoot.search_console || {}),
      paid: asObject(insightRoot.paid || insightRoot.paid_media || {})
    };
    const hasInsights = hasInsightPayload(insightRoot);
    const refreshLabel = refreshState.loading
      ? "Refreshing..."
      : hasInsights
        ? "Refresh insights"
        : "Retry insights";

    const contentItems = buildContentInventory(state, feeds);
    const executive = buildExecutiveOverview(feeds, contentItems, connections, currency);
    const platformCards = buildPlatformCards(state, feeds, connections, currency);
    const topContent = buildTopContent(contentItems);
    const weakContent = buildWeakContent(contentItems);
    const websiteIntel = buildWebsiteIntelligence(feeds, connections);
    const seoIntel = buildSeoIntelligence(feeds, connections);
    const paidIntel = buildPaidIntelligence(feeds, connections);
    const learning = buildLearningEngine(contentItems, platformCards, websiteIntel, seoIntel, paidIntel, connections);
    const optimization = buildOptimizationPanel(state, platformCards, websiteIntel, seoIntel, paidIntel, topContent, weakContent, learning);
    const connectedSourceCount = PLATFORM_DEFS.filter((platform) => getConnectedValue(platform.sourceKeys, connections)).length;
    const measuredContentCount = contentItems.filter((item) => item.hasMetrics).length;
    const connectedInsights = platformCards.filter((item) => item.connected && item.hasData).slice(0, 3);
    const riskPlatforms = platformCards
      .filter((item) => {
        const tone = asString(item.performanceLevel).toLowerCase();
        return (item.connected && !item.hasData) || tone === "warning" || tone === "danger";
      })
      .slice(0, 4);
    const learningHighlights = learning.cards.slice(0, 3);
    const recommendationItems = optimization.recommendations.slice(0, 4);
    const promptItems = optimization.prompts.slice(0, 4);
    const domainSnapshots = [
      {
        title: "Website",
        status: websiteIntel.connected ? (websiteIntel.hasData ? "Live analytics" : "Waiting for feed") : "Not connected",
        tone: websiteIntel.connected ? (websiteIntel.hasData ? "success" : "warning") : "danger",
        metrics: [
          { label: "Sessions", value: formatCompact(websiteIntel.summary.sessions) },
          { label: "Conversions", value: formatCompact(websiteIntel.summary.conversions) }
        ],
        note: websiteIntel.recommendations[0]?.title || websiteIntel.conversionSignals[0]?.label || "Landing-page and conversion signals will appear here when analytics is available."
      },
      {
        title: "SEO / Search",
        status: seoIntel.connected ? (seoIntel.hasData ? "Live SEO" : "Waiting for feed") : "Not connected",
        tone: seoIntel.connected ? (seoIntel.hasData ? "success" : "warning") : "danger",
        metrics: [
          { label: "Clicks", value: formatCompact(seoIntel.summary.clicks) },
          { label: "CTR", value: formatPercent(seoIntel.summary.ctr, 2) }
        ],
        note: seoIntel.topQueries[0]?.title || seoIntel.ctrOpportunities[0]?.title || "Query, page, and CTR opportunity signals will appear here when Search Console data is available."
      },
      {
        title: "Paid Media",
        status: paidIntel.connected ? (paidIntel.hasData ? "Live paid data" : "Waiting for feed") : "Not connected",
        tone: paidIntel.connected ? (paidIntel.hasData ? "success" : "warning") : "danger",
        metrics: [
          { label: "Spend", value: formatCurrency(paidIntel.summary.spend, currency) },
          { label: "ROAS", value: paidIntel.summary.roas == null ? "--" : `${paidIntel.summary.roas.toFixed(2)}x` }
        ],
        note: paidIntel.bestCampaigns[0]?.title || paidIntel.weakCampaigns[0]?.title || "Campaign and creative performance signals will appear here when paid reporting is available."
      }
    ];

    const root = $("insightsRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="insights-wrapper insights-workspace">
        <section class="card">
          <div class="card-head">
            <h3>Insights Overview</h3>
            <div class="insights-assistant-toolbar">
              <button class="btn btn-secondary" type="button" id="insightsRefreshBtn" ${refreshState.loading ? "disabled" : ""}>${escapeHtml(refreshLabel)}</button>
              <span class="card-badge neutral">${escapeHtml(safeText(overview.project_name, projectName || "Project"))}</span>
            </div>
          </div>
          ${refreshState.error ? `<div class="empty-box">${escapeHtml(refreshState.error)}</div>` : ""}
          <p class="insights-section-copy">
            Focus this page on the current signal, the biggest risks, and the next action to take across content, website, SEO, and paid performance.
          </p>
          <div class="insights-overview-grid">
            ${executive.kpis.map((item) => `
              <div class="insights-overview-item">
                <span class="data-label">${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <span class="insights-kpi-meta">${escapeHtml(item.meta)}</span>
              </div>
            `).join("")}
          </div>
          <div class="insights-section-copy">${escapeHtml(executive.summary)}</div>
          <div class="insights-overview-grid">
            <div class="insights-overview-item">
              <span class="data-label">Measured content</span>
              <strong>${escapeHtml(String(measuredContentCount))}</strong>
              <span class="insights-kpi-meta">Content items with usable performance data.</span>
            </div>
            <div class="insights-overview-item">
              <span class="data-label">Connected sources</span>
              <strong>${escapeHtml(String(connectedSourceCount))}</strong>
              <span class="insights-kpi-meta">Sources that can feed this workspace.</span>
            </div>
            <div class="insights-overview-item">
              <span class="data-label">SEO feed</span>
              <strong>${escapeHtml(seoIntel.connected ? (seoIntel.hasData ? "Live" : "Waiting") : "Missing")}</strong>
              <span class="insights-kpi-meta">Search visibility signal status.</span>
            </div>
            <div class="insights-overview-item">
              <span class="data-label">Paid feed</span>
              <strong>${escapeHtml(paidIntel.connected ? (paidIntel.hasData ? "Live" : "Waiting") : "Missing")}</strong>
              <span class="insights-kpi-meta">Paid acquisition signal status.</span>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Performance Highlights</h3>
            <span class="card-badge neutral">${escapeHtml(topContent.length ? `${topContent.length} ranked items` : "Awaiting feed")}</span>
          </div>
          <p class="insights-section-copy">
            What is working now, where it is working, and which patterns look strongest enough to reuse.
          </p>
          <div class="insights-workspace-grid">
            <div>
              <h4 class="insights-subtitle">Strongest published content</h4>
              ${
                topContent.length
                  ? renderRankedContent(topContent.slice(0, 3), "", escapeHtml)
                  : renderFeedAwareEmptyState(
                      "No measured content winners yet",
                      "Published content can exist, but this section only ranks winners once post-level insight feeds from social or commerce sources are connected.",
                      PLATFORM_DEFS.filter((platform) => platform.type === "social").some((platform) => getConnectedValue(platform.sourceKeys, connections)),
                      escapeHtml
                    )
              }
            </div>
            <div class="insights-stack">
              <div>
                <h4 class="insights-subtitle">Best performing lanes</h4>
                ${
                  connectedInsights.length
                    ? renderPlatformCards(connectedInsights, currency, escapeHtml)
                    : renderFeedAwareEmptyState(
                        "No connected performance lanes yet",
                        "Cross-platform comparisons appear here as soon as at least one connected source is returning performance metrics.",
                        connectedSourceCount > 0,
                        escapeHtml
                      )
                }
              </div>
              <div>
                <h4 class="insights-subtitle">Emerging patterns</h4>
                <div class="insights-learning-grid">
                  ${learningHighlights.map((item) => `
                    <div class="insights-learning-card">
                      <strong>${escapeHtml(item.title)}</strong>
                      <p>${escapeHtml(item.body)}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Risks / Weak Signals</h3>
            <span class="card-badge warning">${escapeHtml(weakContent.length ? `${weakContent.length} flagged` : "Monitoring")}</span>
          </div>
          <p class="insights-section-copy">
            What is underperforming or incomplete enough to need attention before the next decision.
          </p>
          <div class="insights-workspace-grid">
            <div>
              <h4 class="insights-subtitle">Underperforming content</h4>
              ${
                weakContent.length
                  ? renderWeakContent(weakContent.slice(0, 4), "", escapeHtml)
                  : renderFeedAwareEmptyState(
                      "No underperforming content feed yet",
                      "This section separates low-performing posts, videos, and campaigns once cross-platform content metrics are connected.",
                      PLATFORM_DEFS.filter((platform) => platform.type === "social").some((platform) => getConnectedValue(platform.sourceKeys, connections)),
                      escapeHtml
                    )
              }
            </div>
            <div class="insights-stack">
              <div>
                <h4 class="insights-subtitle">At-risk channels</h4>
                ${
                  riskPlatforms.length
                    ? renderPlatformCards(riskPlatforms, currency, escapeHtml)
                    : `<div class="empty-box">No major cross-platform risk signal is flagged right now.</div>`
                }
              </div>
              <div class="insights-compact-grid">
                <div>
                  <h4 class="insights-subtitle">Website conversion risk</h4>
                  ${
                    websiteIntel.hasData
                      ? renderKeyValueList(websiteIntel.weakPages.slice(0, 4), "page", escapeHtml) || `<div class="empty-box">No weak page list yet.</div>`
                      : renderFeedAwareEmptyState(
                          "No website analytics feed yet",
                          "Connect GA4 or a website analytics source to surface weak landing pages and conversion risks.",
                          websiteIntel.connected,
                          escapeHtml
                        )
                  }
                </div>
                <div>
                  <h4 class="insights-subtitle">SEO / paid weak signals</h4>
                  ${
                    seoIntel.hasData || paidIntel.hasData
                      ? renderKeyValueList(
                          [
                            ...seoIntel.ctrOpportunities,
                            ...seoIntel.rankingOpportunities,
                            ...paidIntel.weakCampaigns,
                            ...paidIntel.weakCreatives
                          ].slice(0, 4),
                          "page",
                          escapeHtml
                        ) || `<div class="empty-box">No SEO or paid weakness list yet.</div>`
                      : renderFeedAwareEmptyState(
                          "No SEO or paid weakness feed yet",
                          "Connect Search Console and paid reporting to surface ranking, CTR, campaign, and creative risks here.",
                          seoIntel.connected || paidIntel.connected,
                          escapeHtml
                        )
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Recommendations / Next Actions</h3>
            <span class="card-badge neutral">${escapeHtml(`${recommendationItems.length} priorities`)}</span>
          </div>
          <p class="insights-section-copy">
            The next actions to take based on the current signal, without duplicating the AI prompt surface.
          </p>
          <div class="insights-workspace-grid">
            <div>
              <h4 class="insights-subtitle">Prioritized recommendations</h4>
              <div class="insights-list">
                ${recommendationItems.map((item) => `
                  <div class="insights-list-item">
                    <div class="insights-list-head">
                      <strong>${escapeHtml(item.title)}</strong>
                      <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(titleCase(item.tone))}</span>
                    </div>
                    <div class="insights-list-meta">${escapeHtml(item.meta)}</div>
                  </div>
                `).join("")}
              </div>
            </div>
            <div>
              <h4 class="insights-subtitle">Readiness notes</h4>
              <div class="insights-learning-grid">
                ${
                  learning.systemLessons.length
                    ? learning.systemLessons.map((item) => `
                      <div class="insights-learning-card">
                        <strong>System lesson</strong>
                        <p>${escapeHtml(item)}</p>
                      </div>
                    `).join("")
                    : `
                      <div class="insights-learning-card">
                        <strong>Readiness status</strong>
                        <p>More granular post, page, query, and campaign metrics will make these recommendations more specific.</p>
                      </div>
                    `
                }
              </div>
            </div>
          </div>
          <div class="insights-assistant-toolbar" style="margin-top: 16px;">
            <button class="btn btn-primary" type="button" data-insights-route="campaign-studio">Navigate: Open Campaign Studio</button>
            <button class="btn btn-secondary" type="button" data-insights-route="content-studio">Navigate: Open Content Studio Workspace</button>
            <button class="btn btn-secondary" type="button" data-insights-route="ads-manager">Navigate: Open Ads Manager</button>
            <button class="btn btn-secondary" type="button" data-insights-route="publishing">Navigate: Open Publishing Workspace</button>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Comparative / Trend View</h3>
            <span class="card-badge neutral">${escapeHtml(`${platformCards.length} intelligence lanes`)}</span>
          </div>
          <p class="insights-section-copy">
            Compare the main channels side by side, then review the current website, SEO, and paid signal without opening separate summary panels.
          </p>
          <div class="insights-workspace-grid">
            <div>
              <h4 class="insights-subtitle">Cross-platform comparison</h4>
              ${renderPlatformCards(platformCards, currency, escapeHtml)}
            </div>
            <div>
              <h4 class="insights-subtitle">Current trend snapshots</h4>
              <div class="insights-domain-summary-grid">
                ${domainSnapshots.map((item) => `
                  <div class="insights-domain-summary">
                    <div class="insights-list-head">
                      <strong>${escapeHtml(item.title)}</strong>
                      <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(item.status)}</span>
                    </div>
                    <div class="insights-domain-summary-metrics">
                      ${item.metrics.map((metric) => `
                        <div class="data-row">
                          <span>${escapeHtml(metric.label)}</span>
                          <strong>${escapeHtml(metric.value)}</strong>
                        </div>
                      `).join("")}
                    </div>
                    <div class="insights-list-note">${escapeHtml(item.note)}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Insights AI Assistant</h3>
            <span class="card-badge neutral">${escapeHtml(`${promptItems.length} prompt starters`)}</span>
          </div>
          <p class="insights-section-copy">
            Use AI Workspace to dig deeper into the current signal. Opening AI Workspace only navigates. Sending a prompt prefills context and navigates.
          </p>
          <div class="insights-assistant-toolbar">
            <button class="btn ghost" type="button" data-insights-open>Open AI: Review in AI Workspace</button>
          </div>
          <div class="insights-prompt-list">
            ${promptItems.map((item, index) => `
              <button class="quick-action-btn" type="button" data-insights-prompt="${index}">
                <span class="home-action-title">${escapeHtml(item.label)}</span>
                <span class="home-action-meta">${escapeHtml(item.prompt)}</span>
              </button>
            `).join("")}
          </div>
        </section>
      </div>
    `;

    bindInsightsActions({
      $,
      navigateTo,
      showMessage,
      prompts: optimization.prompts,
      projectName,
      createProjectHandoff
    });

    root.querySelector("#insightsRefreshBtn")?.addEventListener("click", () => {
      if (!projectName) {
        const message = "Insights: No active project selected.";
        setInsightsRefreshState(projectName, { loading: false, error: message });
        showError?.(message);
        insightsRoute.render({
          getState,
          $,
          escapeHtml,
          safeText,
          navigateTo,
          showMessage,
          showError,
          fetchProjectInsights,
          createProjectHandoff
        });
        return;
      }

      if (!fetchProjectInsights) {
        const message = "Insights: Live refresh is unavailable in this context.";
        setInsightsRefreshState(projectName, { loading: false, error: message });
        showError?.(message);
        insightsRoute.render({
          getState,
          $,
          escapeHtml,
          safeText,
          navigateTo,
          showMessage,
          showError,
          fetchProjectInsights,
          createProjectHandoff
        });
        return;
      }

      setInsightsRefreshState(projectName, { loading: true, error: "" });
      insightsRoute.render({
        getState,
        $,
        escapeHtml,
        safeText,
        navigateTo,
        showMessage,
        showError,
        fetchProjectInsights,
        createProjectHandoff
      });

      fetchProjectInsights(projectName)
        .then((liveData) => {
          const currentState = getState();
          const currentData = asObject(currentState.data);
          const currentActivity = asObject(currentData.activity);

          currentState.data = {
            ...currentData,
            activity: {
              ...currentActivity,
              insights: asObject(liveData)
            }
          };

          setInsightsRefreshState(projectName, { loading: false, error: "" });
          insightsRoute.render({
            getState,
            $,
            escapeHtml,
            safeText,
            navigateTo,
            showMessage,
            showError,
            fetchProjectInsights,
            createProjectHandoff
          });
          showMessage?.("Insights refreshed.");
        })
        .catch((error) => {
          const message = `Insights: ${error?.message || "Failed to refresh insights."}`;
          setInsightsRefreshState(projectName, { loading: false, error: message });
          insightsRoute.render({
            getState,
            $,
            escapeHtml,
            safeText,
            navigateTo,
            showMessage,
            showError,
            fetchProjectInsights,
            createProjectHandoff
          });
          showError?.(message);
        });
    });
  }
};
