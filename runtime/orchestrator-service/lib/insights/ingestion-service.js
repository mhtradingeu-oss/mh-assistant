const fs = require('fs');
const path = require('path');

const { readJsonFile } = require('../integrations/storage');
const { buildLearningEngine } = require('./learning-engine');

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function toNumber(value, fallback = null) {
  if (value == null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sumNumbers(values = []) {
  const numbers = values.filter(value => Number.isFinite(value));
  if (!numbers.length) {
    return null;
  }

  return numbers.reduce((total, value) => total + value, 0);
}

function averageNumbers(values = []) {
  const numbers = values.filter(value => Number.isFinite(value));
  if (!numbers.length) {
    return null;
  }

  return numbers.reduce((total, value) => total + value, 0) / numbers.length;
}

function normalizePercentValue(value) {
  const parsed = toNumber(value);
  if (parsed == null) {
    return null;
  }

  if (parsed >= 0 && parsed <= 1) {
    return parsed * 100;
  }

  return parsed;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function detectSyncFreshness(entries = []) {
  const latest = entries
    .map(entry => asString(entry.at))
    .filter(Boolean)
    .sort()
    .reverse()[0];

  if (!latest) {
    return 'No sync yet';
  }

  const time = Date.parse(latest);
  if (!Number.isFinite(time)) {
    return 'Recent sync';
  }

  const ageHours = (Date.now() - time) / (1000 * 60 * 60);
  if (ageHours <= 24) {
    return 'Fresh sync sample';
  }
  if (ageHours <= 24 * 7) {
    return 'Recent sync sample';
  }
  return 'Sync is getting stale';
}

function summarizeTrend(entries = [], currentCount = null) {
  if (!entries.length) {
    return 'No sync history yet';
  }

  if (currentCount == null) {
    return detectSyncFreshness(entries);
  }

  const historicalCounts = entries
    .map(entry => {
      const summary = asObject(entry.summary);
      return sumNumbers(Object.values(summary).map(value => toNumber(value)));
    })
    .filter(value => value != null);

  if (!historicalCounts.length) {
    return detectSyncFreshness(entries);
  }

  const averageCount = averageNumbers(historicalCounts);
  if (averageCount == null) {
    return detectSyncFreshness(entries);
  }

  if (currentCount > averageCount * 1.1) {
    return 'Broader dataset than usual';
  }
  if (currentCount < averageCount * 0.9) {
    return 'Narrower dataset than usual';
  }
  return 'Stable sync volume';
}

function scoreContentItem(item = {}) {
  const reach = toNumber(item.reach, 0) || 0;
  const engagement = toNumber(item.engagement, 0) || 0;
  const clicks = toNumber(item.clicks, 0) || 0;
  const conversions = toNumber(item.conversions, 0) || 0;
  const revenue = toNumber(item.revenue, 0) || 0;

  return (
    (reach * 0.18) +
    (engagement * 1.1) +
    (clicks * 2.1) +
    (conversions * 5.5) +
    (revenue * 0.02)
  );
}

function scoreCampaign(item = {}) {
  const clicks = toNumber(item.clicks, 0) || 0;
  const impressions = toNumber(item.impressions, 0) || 0;
  const ctr = normalizePercentValue(item.ctr) || 0;
  const roas = toNumber(item.roas, 0) || 0;
  const conversions = toNumber(item.conversions, 0) || 0;
  return (clicks * 1.7) + (impressions * 0.02) + (ctr * 6) + (roas * 12) + (conversions * 8);
}

function listSnapshotRecords(projectPaths) {
  const snapshotsDir = path.join(projectPaths.integrationsDir, 'snapshots');
  if (!fs.existsSync(snapshotsDir)) {
    return [];
  }

  return fs.readdirSync(snapshotsDir)
    .filter(name => name.endsWith('.json'))
    .map(name => readJsonFile(path.join(snapshotsDir, name), {}))
    .filter(item => Object.keys(asObject(item)).length);
}

function readSyncHistory(projectPaths) {
  return asArray(readJsonFile(path.join(projectPaths.integrationsDir, 'sync-history.json'), []));
}

function readIntegrationRegistry(projectPaths) {
  return asObject(readJsonFile(path.join(projectPaths.integrationsDir, 'control-center.json'), {
    updated_at: '',
    records: {}
  }));
}

function groupHistoryByIntegration(syncHistory = []) {
  const grouped = {};
  asArray(syncHistory).forEach(entry => {
    const key = asString(entry.integration_id);
    if (!key) {
      return;
    }
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(entry);
  });
  return grouped;
}

function getSnapshotRaw(snapshot = {}) {
  return asObject(snapshot.insights_ready?.raw || snapshot.normalized || {});
}

function getSnapshotIntegrationId(snapshot = {}) {
  return asString(
    snapshot.integration_id ||
    snapshot.insights_ready?.integration_id ||
    snapshot.insights_ready?.provider ||
    getSnapshotRaw(snapshot).provider
  );
}

function platformRecommendation(platformLabel, summary = {}) {
  if (summary.conversions != null && summary.conversions > 0) {
    return `${platformLabel} is already producing conversion signal. Reuse the strongest message pattern and push that learning into future campaigns.`;
  }
  if (summary.clicks != null && summary.clicks > 0) {
    return `${platformLabel} is driving traffic. Tighten the CTA and landing-page alignment so engagement turns into conversion.`;
  }
  if (summary.engagement != null && summary.engagement > 0) {
    return `${platformLabel} is generating attention, but stronger click intent is still needed. Test clearer benefit-led hooks and CTAs.`;
  }
  return `${platformLabel} is connected, but richer metrics are still needed before the system can optimize it confidently.`;
}

function strongestMetricLabel(summary = {}) {
  const metrics = [
    ['roas', summary.roas],
    ['revenue', summary.revenue],
    ['conversions', summary.conversions],
    ['clicks', summary.clicks],
    ['engagement', summary.engagement],
    ['reach', summary.reach],
    ['impressions', summary.impressions],
    ['sessions', summary.sessions]
  ].filter(([, value]) => value != null);

  if (!metrics.length) {
    return '';
  }

  metrics.sort((a, b) => b[1] - a[1]);
  return titleCase(metrics[0][0]);
}

function weakestMetricLabel(summary = {}) {
  const priority = [
    ['ctr', summary.ctr],
    ['conversions', summary.conversions],
    ['roas', summary.roas],
    ['engaged_sessions', summary.engaged_sessions],
    ['clicks', summary.clicks]
  ].filter(([, value]) => value != null);

  if (!priority.length) {
    return '';
  }

  priority.sort((a, b) => a[1] - b[1]);
  return titleCase(priority[0][0]);
}

function performanceLevel(summary = {}) {
  if (summary.roas != null && summary.roas >= 2) {
    return 'Strong return signal';
  }
  if (summary.conversions != null && summary.conversions > 0) {
    return 'Strong conversion signal';
  }
  if (summary.clicks != null && summary.clicks > 0) {
    return 'Traffic-driving signal';
  }
  if (summary.engagement != null && summary.engagement > 0) {
    return 'Engagement signal';
  }
  if (summary.impressions != null || summary.reach != null || summary.sessions != null) {
    return 'Awareness signal';
  }
  return 'Awaiting metric signal';
}

function buildContentItem(fields = {}) {
  const item = {
    id: asString(fields.id || fields.post_id || fields.content_id || fields.label),
    platform: asString(fields.platform),
    label: asString(fields.label || fields.title || 'Published content'),
    format: asString(fields.format || 'Post'),
    reach: toNumber(fields.reach),
    engagement: toNumber(fields.engagement),
    clicks: toNumber(fields.clicks),
    conversions: toNumber(fields.conversions),
    revenue: toNumber(fields.revenue),
    published_at: asString(fields.published_at || fields.created_at || fields.timestamp),
    why_it_worked: asString(fields.why_it_worked),
    improve_hint: asString(fields.improve_hint),
    hook: asString(fields.hook),
    topic: asString(fields.topic),
    cta: asString(fields.cta)
  };

  return item;
}

function aggregateSocialData(snapshotRecords = [], historyByIntegration = {}) {
  const platforms = {
    facebook: { items: [], meta: [] },
    instagram: { items: [], meta: [] },
    tiktok: { items: [], meta: [] },
    youtube: { items: [], meta: [] }
  };

  snapshotRecords.forEach(snapshot => {
    const raw = getSnapshotRaw(snapshot);
    const provider = asString(raw.provider || getSnapshotIntegrationId(snapshot));

    if (provider === 'facebook') {
      asArray(raw.posts).forEach(item => {
        platforms.facebook.items.push(buildContentItem({
          id: item.id,
          platform: 'facebook',
          label: item.message || item.id,
          format: 'Post',
          engagement: (toNumber(item.likes, 0) || 0) + (toNumber(item.comments, 0) || 0),
          published_at: item.created_at,
          why_it_worked: item.message ? 'Facebook post copy is earning visible engagement.' : '',
          hook: item.message
        }));
      });
      platforms.facebook.meta.push(snapshot);
    }

    if (provider === 'instagram') {
      asArray(raw.media).forEach(item => {
        platforms.instagram.items.push(buildContentItem({
          id: item.id,
          platform: 'instagram',
          label: item.caption || item.id,
          format: item.media_type || item.product_type || 'Media',
          engagement: (toNumber(item.likes, 0) || 0) + (toNumber(item.comments, 0) || 0),
          published_at: item.timestamp,
          why_it_worked: item.media_type ? `Engagement is coming through an ${item.media_type} format.` : '',
          hook: item.caption
        }));
      });
      platforms.instagram.meta.push(snapshot);
    }

    if (provider === 'tiktok') {
      asArray(raw.videos).forEach(item => {
        platforms.tiktok.items.push(buildContentItem({
          id: item.id,
          platform: 'tiktok',
          label: item.title || item.id,
          format: 'Video',
          reach: item.view_count,
          engagement: (toNumber(item.like_count, 0) || 0) + (toNumber(item.comment_count, 0) || 0),
          published_at: item.create_time,
          why_it_worked: item.view_count ? 'TikTok is providing measurable view volume.' : '',
          hook: item.title
        }));
      });
      platforms.tiktok.meta.push(snapshot);
    }

    if (provider === 'youtube') {
      asArray(raw.videos).forEach(item => {
        platforms.youtube.items.push(buildContentItem({
          id: item.id,
          platform: 'youtube',
          label: item.title || item.id,
          format: 'Video',
          reach: item.views,
          engagement: (toNumber(item.likes, 0) || 0) + (toNumber(item.comments, 0) || 0),
          published_at: item.published_at,
          why_it_worked: item.views ? 'YouTube video views are giving the system a measurable performance baseline.' : '',
          hook: item.title
        }));
      });
      platforms.youtube.meta.push(snapshot);
    }
  });

  const result = {};
  Object.entries(platforms).forEach(([platform, bucket]) => {
    const items = bucket.items
      .map(item => ({
        ...item,
        score: scoreContentItem(item)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const historyEntries = asArray(historyByIntegration[platform]);
    const summary = {
      total_reach: sumNumbers(items.map(item => item.reach)),
      total_engagement: sumNumbers(items.map(item => item.engagement)),
      total_clicks: sumNumbers(items.map(item => item.clicks)),
      total_conversions: sumNumbers(items.map(item => item.conversions)),
      total_revenue: sumNumbers(items.map(item => item.revenue))
    };

    result[platform] = {
      summary: {
        reach: summary.total_reach,
        engagement: summary.total_engagement,
        clicks: summary.total_clicks,
        conversions: summary.total_conversions,
        revenue: summary.total_revenue,
        performance_level: performanceLevel(summary),
        strongest_metric: strongestMetricLabel(summary),
        weakest_metric: weakestMetricLabel(summary),
        trend_direction: summarizeTrend(historyEntries, items.length),
        recommendation: platformRecommendation(titleCase(platform), summary)
      },
      top_content: items.slice(0, 5),
      posts: items.slice(0, 10),
      source_count: bucket.meta.length,
      last_sync_at: bucket.meta
        .map(item => asString(item.generated_at))
        .filter(Boolean)
        .sort()
        .reverse()[0] || ''
    };
  });

  return result;
}

function aggregateWebsiteData(snapshotRecords = [], historyByIntegration = {}) {
  const landingPages = [];
  const metadata = [];
  const coverageSignals = [];

  snapshotRecords.forEach(snapshot => {
    const raw = getSnapshotRaw(snapshot);
    const provider = asString(raw.provider || getSnapshotIntegrationId(snapshot));

    if (provider === 'website' && Object.keys(asObject(raw.website)).length) {
      metadata.push({
        provider,
        website: asObject(raw.website),
        sitemap: asObject(raw.sitemap),
        generated_at: asString(snapshot.generated_at)
      });
    }

    if (provider === 'ga4') {
      asArray(raw.landing_pages).forEach(item => {
        landingPages.push({
          page: asString(item.landing_page),
          sessions: toNumber(item.sessions, 0) || 0,
          engaged_sessions: toNumber(item.engaged_sessions, 0) || 0,
          page_views: toNumber(item.page_views, 0) || 0,
          conversions: toNumber(item.conversions, 0) || 0,
          revenue: toNumber(item.revenue, 0) || 0
        });
      });
    }

    if (provider === 'meta_pixel' || provider === 'tiktok_pixel' || provider === 'gtm') {
      coverageSignals.push({
        provider,
        generated_at: asString(snapshot.generated_at)
      });
    }
  });

  const groupedPages = new Map();
  landingPages.forEach(item => {
    if (!groupedPages.has(item.page)) {
      groupedPages.set(item.page, {
        page: item.page,
        sessions: 0,
        engaged_sessions: 0,
        page_views: 0,
        conversions: 0,
        revenue: 0
      });
    }

    const entry = groupedPages.get(item.page);
    entry.sessions += item.sessions;
    entry.engaged_sessions += item.engaged_sessions;
    entry.page_views += item.page_views;
    entry.conversions += item.conversions;
    entry.revenue += item.revenue;
  });

  const pages = Array.from(groupedPages.values())
    .sort((a, b) => b.sessions - a.sessions || b.revenue - a.revenue);

  const topPages = pages.slice(0, 5).map(item => ({
    page: item.page,
    sessions: item.sessions,
    conversions: item.conversions,
    revenue: item.revenue
  }));

  const weakPages = pages
    .filter(item => item.sessions > 0 && item.conversions === 0)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5)
    .map(item => ({
      page: item.page,
      sessions: item.sessions,
      conversions: item.conversions,
      metric: 'Traffic without conversion signal'
    }));

  const summary = {
    sessions: sumNumbers(pages.map(item => item.sessions)),
    engaged_sessions: sumNumbers(pages.map(item => item.engaged_sessions)),
    clicks: sumNumbers(pages.map(item => item.page_views)),
    conversions: sumNumbers(pages.map(item => item.conversions)),
    revenue: sumNumbers(pages.map(item => item.revenue)),
    performance_level: performanceLevel({
      sessions: sumNumbers(pages.map(item => item.sessions)),
      conversions: sumNumbers(pages.map(item => item.conversions)),
      revenue: sumNumbers(pages.map(item => item.revenue))
    }),
    strongest_metric: strongestMetricLabel({
      sessions: sumNumbers(pages.map(item => item.sessions)),
      conversions: sumNumbers(pages.map(item => item.conversions)),
      revenue: sumNumbers(pages.map(item => item.revenue))
    }),
    weakest_metric: weakPages.length ? 'Conversions' : strongestMetricLabel({
      engaged_sessions: sumNumbers(pages.map(item => item.engaged_sessions))
    }),
    trend_direction: summarizeTrend(
      [
        ...asArray(historyByIntegration.ga4),
        ...asArray(historyByIntegration.website)
      ],
      pages.length || null
    ),
    recommendation: summaryRecommendationWebsite(pages, metadata)
  };

  return {
    summary,
    top_pages: topPages,
    weak_pages: weakPages,
    conversion_signals: buildWebsiteConversionSignals(pages),
    recommendations: buildWebsiteRecommendations(pages, metadata),
    site_metadata: metadata,
    coverage_signals: coverageSignals
  };
}

function summaryRecommendationWebsite(pages = [], metadata = []) {
  if (pages.some(item => item.sessions > 0 && item.conversions > 0)) {
    return 'The website already shows page-level traffic and conversion signal. Use the strongest landing pages as the model for future campaigns.';
  }
  if (pages.some(item => item.sessions > 0)) {
    return 'Traffic is arriving on the website, but conversion evidence is still thin. Tighten landing-page intent match and CTA clarity next.';
  }
  if (metadata.length) {
    return 'The website endpoint is connected, but richer analytics data is still needed to link content and traffic to conversion outcomes.';
  }
  return 'Connect website analytics to unlock landing-page and conversion intelligence.';
}

function buildWebsiteConversionSignals(pages = []) {
  return pages
    .slice(0, 5)
    .map(item => {
      const engagedRate = item.sessions > 0
        ? ((item.engaged_sessions / item.sessions) * 100)
        : null;

      let label = 'Page performance signal';
      if (item.sessions > 0 && item.conversions === 0) {
        label = 'Traffic present, conversion missing';
      } else if (item.conversions > 0) {
        label = 'Page is converting';
      } else if (engagedRate != null && engagedRate < 40) {
        label = 'Engagement quality is weak';
      }

      return {
        label,
        page: item.page,
        sessions: item.sessions,
        conversions: item.conversions,
        engaged_sessions: item.engaged_sessions
      };
    });
}

function buildWebsiteRecommendations(pages = [], metadata = []) {
  const recommendations = [];
  const weakTraffic = pages
    .filter(item => item.sessions > 0 && item.conversions === 0)
    .sort((a, b) => b.sessions - a.sessions)[0];
  const topPage = pages[0];

  if (weakTraffic) {
    recommendations.push({
      title: 'Improve the highest-traffic page with no conversion signal',
      label: weakTraffic.page,
      sessions: weakTraffic.sessions
    });
  }

  if (topPage && topPage.conversions > 0) {
    recommendations.push({
      title: 'Reuse the strongest landing-page structure',
      label: topPage.page,
      conversions: topPage.conversions
    });
  }

  if (!recommendations.length && metadata.length) {
    recommendations.push({
      title: 'Website is connected but analytics depth is limited',
      label: 'Add GA4 or conversion tracking to unlock richer recommendations.'
    });
  }

  return recommendations;
}

function aggregateSeoData(snapshotRecords = [], historyByIntegration = {}) {
  const rows = [];

  snapshotRecords.forEach(snapshot => {
    const raw = getSnapshotRaw(snapshot);
    const provider = asString(raw.provider || getSnapshotIntegrationId(snapshot));
    if (provider !== 'search_console') {
      return;
    }

    asArray(raw.rows).forEach(item => {
      rows.push({
        query: asString(item.query),
        page: asString(item.page),
        clicks: toNumber(item.clicks, 0) || 0,
        impressions: toNumber(item.impressions, 0) || 0,
        ctr: normalizePercentValue(item.ctr) || 0,
        avg_position: toNumber(item.position, null)
      });
    });
  });

  const groupedQueries = new Map();
  const groupedPages = new Map();

  rows.forEach(row => {
    if (row.query) {
      if (!groupedQueries.has(row.query)) {
        groupedQueries.set(row.query, {
          query: row.query,
          clicks: 0,
          impressions: 0,
          ctr: 0,
          avg_position_values: []
        });
      }
      const entry = groupedQueries.get(row.query);
      entry.clicks += row.clicks;
      entry.impressions += row.impressions;
      entry.avg_position_values.push(row.avg_position);
    }

    if (row.page) {
      if (!groupedPages.has(row.page)) {
        groupedPages.set(row.page, {
          page: row.page,
          clicks: 0,
          impressions: 0,
          avg_position_values: []
        });
      }
      const entry = groupedPages.get(row.page);
      entry.clicks += row.clicks;
      entry.impressions += row.impressions;
      entry.avg_position_values.push(row.avg_position);
    }
  });

  const topQueries = Array.from(groupedQueries.values())
    .map(item => ({
      query: item.query,
      clicks: item.clicks,
      impressions: item.impressions,
      ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0,
      avg_position: averageNumbers(item.avg_position_values)
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 5);

  const topPages = Array.from(groupedPages.values())
    .map(item => ({
      page: item.page,
      clicks: item.clicks,
      impressions: item.impressions,
      ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0,
      avg_position: averageNumbers(item.avg_position_values)
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 5);

  const lowCtrPages = topPages
    .filter(item => item.impressions >= 10 && item.ctr < 2)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5);

  const rankingOpportunities = topPages
    .filter(item => item.avg_position != null && item.avg_position >= 4 && item.avg_position <= 20)
    .sort((a, b) => (a.avg_position || 999) - (b.avg_position || 999))
    .slice(0, 5)
    .map(item => ({
      page: item.page,
      clicks: item.clicks,
      impressions: item.impressions,
      avg_position: item.avg_position,
      label: 'Ranking opportunity'
    }));

  const totalClicks = sumNumbers(rows.map(item => item.clicks));
  const totalImpressions = sumNumbers(rows.map(item => item.impressions));
  const summary = {
    impressions: totalImpressions,
    clicks: totalClicks,
    ctr: totalClicks != null && totalImpressions != null && totalImpressions > 0
      ? (totalClicks / totalImpressions) * 100
      : null,
    average_position: averageNumbers(rows.map(item => item.avg_position)),
    performance_level: performanceLevel({
      impressions: totalImpressions,
      clicks: totalClicks
    }),
    strongest_metric: strongestMetricLabel({
      impressions: totalImpressions,
      clicks: totalClicks
    }),
    weakest_metric: lowCtrPages.length ? 'CTR' : strongestMetricLabel({
      average_position: averageNumbers(rows.map(item => item.avg_position))
    }),
    trend_direction: summarizeTrend(
      asArray(historyByIntegration['search-console']).concat(asArray(historyByIntegration.search_console)),
      rows.length
    ),
    recommendation: rows.length
      ? 'Use the highest-impression, lowest-CTR pages to prioritize SEO title and meta updates.'
      : 'Connect Search Console so the system can learn which pages and queries deserve the next content expansion.'
  };

  return {
    summary,
    top_queries: topQueries,
    top_pages: topPages,
    low_ctr_pages: lowCtrPages,
    opportunities: rankingOpportunities
  };
}

function aggregatePaidData(snapshotRecords = [], historyByIntegration = {}) {
  const campaigns = [];

  snapshotRecords.forEach(snapshot => {
    const raw = getSnapshotRaw(snapshot);
    const provider = asString(raw.provider || getSnapshotIntegrationId(snapshot));
    if (!['meta_ads', 'google_ads', 'tiktok_ads'].includes(provider)) {
      return;
    }

    asArray(raw.campaigns).forEach(item => {
      campaigns.push({
        provider,
        platform: provider,
        campaign_name: asString(item.campaign_name || item.name || item.campaign_id || provider),
        impressions: toNumber(item.impressions, 0) || 0,
        clicks: toNumber(item.clicks, 0) || 0,
        spend: toNumber(item.spend, 0) || 0,
        ctr: normalizePercentValue(item.ctr),
        cpc: toNumber(item.cpc),
        cpa: toNumber(item.cpa),
        conversions: toNumber(item.conversions),
        revenue: toNumber(item.revenue),
        roas: toNumber(item.roas)
      });
    });
  });

  const totalSpend = sumNumbers(campaigns.map(item => item.spend));
  const totalClicks = sumNumbers(campaigns.map(item => item.clicks));
  const totalImpressions = sumNumbers(campaigns.map(item => item.impressions));
  const totalConversions = sumNumbers(campaigns.map(item => item.conversions));
  const totalRevenue = sumNumbers(campaigns.map(item => item.revenue));
  const weightedCtr = totalClicks != null && totalImpressions != null && totalImpressions > 0
    ? (totalClicks / totalImpressions) * 100
    : averageNumbers(campaigns.map(item => item.ctr));
  const blendedCpc = totalSpend != null && totalClicks != null && totalClicks > 0
    ? totalSpend / totalClicks
    : averageNumbers(campaigns.map(item => item.cpc));
  const blendedCpa = totalSpend != null && totalConversions != null && totalConversions > 0
    ? totalSpend / totalConversions
    : averageNumbers(campaigns.map(item => item.cpa));
  const blendedRoas = totalRevenue != null && totalSpend != null && totalSpend > 0
    ? totalRevenue / totalSpend
    : averageNumbers(campaigns.map(item => item.roas));

  const rankedCampaigns = campaigns
    .map(item => ({
      ...item,
      score: scoreCampaign(item),
      status: scoreCampaign(item) > 50 ? 'Best performer' : scoreCampaign(item) < 10 ? 'Weak performer' : 'Mixed performer'
    }))
    .sort((a, b) => b.score - a.score);

  return {
    summary: {
      spend: totalSpend,
      clicks: totalClicks,
      impressions: totalImpressions,
      conversions: totalConversions,
      revenue: totalRevenue,
      ctr: weightedCtr,
      cpc: blendedCpc,
      cpa: blendedCpa,
      roas: blendedRoas,
      performance_level: performanceLevel({
        roas: blendedRoas,
        conversions: totalConversions,
        clicks: totalClicks,
        impressions: totalImpressions
      }),
      strongest_metric: strongestMetricLabel({
        roas: blendedRoas,
        conversions: totalConversions,
        clicks: totalClicks,
        impressions: totalImpressions
      }),
      weakest_metric: weakestMetricLabel({
        ctr: weightedCtr,
        cpa: blendedCpa,
        roas: blendedRoas,
        conversions: totalConversions
      }),
      trend_direction: summarizeTrend(
        [
          ...asArray(historyByIntegration['meta-ads']),
          ...asArray(historyByIntegration.meta_ads),
          ...asArray(historyByIntegration['google-ads']),
          ...asArray(historyByIntegration.google_ads),
          ...asArray(historyByIntegration['tiktok-ads']),
          ...asArray(historyByIntegration.tiktok_ads)
        ],
        campaigns.length
      ),
      recommendation: campaigns.length
        ? 'Keep the best CTR and lowest-CPC campaigns as the benchmark, then refresh weak creative before scaling spend.'
        : 'Connect paid reporting feeds so the system can compare spend efficiency and creative performance.'
    },
    campaigns: rankedCampaigns,
    best_campaigns: rankedCampaigns.slice(0, 4),
    weak_campaigns: rankedCampaigns.slice().reverse().slice(0, 4),
    best_creatives: rankedCampaigns.slice(0, 3).map(item => ({
      name: item.campaign_name,
      metric: item.ctr != null ? `CTR ${item.ctr.toFixed(2)}%` : `Clicks ${item.clicks}`,
      value: item.roas != null ? `ROAS ${item.roas.toFixed(2)}x` : item.cpc != null ? `CPC ${item.cpc.toFixed(2)}` : ''
    })),
    weak_creatives: rankedCampaigns.slice().reverse().slice(0, 3).map(item => ({
      name: item.campaign_name,
      metric: item.ctr != null ? `CTR ${item.ctr.toFixed(2)}%` : `Clicks ${item.clicks}`,
      value: item.cpa != null ? `CPA ${item.cpa.toFixed(2)}` : item.spend != null ? `Spend ${item.spend.toFixed(2)}` : ''
    }))
  };
}

function aggregateMarketplaceData(snapshotRecords = [], historyByIntegration = {}) {
  const orders = [];
  const products = [];
  const programs = [];

  snapshotRecords.forEach(snapshot => {
    const raw = getSnapshotRaw(snapshot);
    const provider = asString(raw.platform || raw.provider || getSnapshotIntegrationId(snapshot));

    if (!['woocommerce', 'shopify', 'ebay'].includes(provider)) {
      return;
    }

    asArray(raw.orders).forEach(item => {
      orders.push({
        provider,
        id: asString(item.id),
        label: asString(item.name || item.id),
        amount: toNumber(item.amount ?? item.total),
        currency: asString(item.currency),
        created_at: asString(item.processed_at || item.created_at),
        status: asString(item.status)
      });
    });

    asArray(raw.products).forEach(item => {
      products.push({
        provider,
        id: asString(item.id),
        title: asString(item.title || item.name),
        price: toNumber(item.price),
        status: asString(item.status)
      });
    });

    asArray(raw.programs).forEach(item => {
      programs.push({
        provider,
        program: asString(item.program),
        status: asString(item.status)
      });
    });
  });

  const revenue = sumNumbers(orders.map(item => item.amount));
  return {
    summary: {
      revenue,
      orders: orders.length || null,
      products: products.length || null,
      performance_level: orders.length ? 'Commerce signal available' : programs.length ? 'Marketplace status signal' : 'Awaiting commerce signal',
      strongest_metric: revenue != null ? 'Revenue' : orders.length ? 'Orders' : '',
      weakest_metric: orders.length ? 'Attribution depth' : '',
      trend_direction: summarizeTrend(
        [
          ...asArray(historyByIntegration.woocommerce),
          ...asArray(historyByIntegration.shopify),
          ...asArray(historyByIntegration.ebay)
        ],
        orders.length + products.length + programs.length
      ),
      recommendation: orders.length
        ? 'Use product and order signals to inform what the content and offer system should push harder.'
        : programs.length
          ? 'Marketplace connectivity exists, but sales-level signal is still limited.'
          : 'Connect commerce platforms to unlock order and product intelligence.'
    },
    orders: orders.slice(0, 10),
    products: products.slice(0, 10),
    marketplace_programs: programs.slice(0, 10)
  };
}

function buildCoverageMap({ controlCenter, snapshots }) {
  const records = asObject(controlCenter.records);
  const snapshotIds = new Set(snapshots.map(item => getSnapshotIntegrationId(item)));

  const evaluate = integrationIds => {
    const statuses = integrationIds
      .map(id => asString(records[id]?.status))
      .filter(Boolean);
    const liveCount = integrationIds.filter(id => snapshotIds.has(id)).length;
    const connectedCount = statuses.filter(status => status === 'connected').length;
    const partialCount = statuses.filter(status => status === 'partial').length;

    if (liveCount > 0) {
      return 'covered';
    }
    if (connectedCount > 0 || partialCount > 0) {
      return 'partial';
    }
    return 'missing';
  };

  return {
    social_insights: {
      status: evaluate(['facebook', 'instagram', 'tiktok', 'youtube']),
      integrations: ['facebook', 'instagram', 'tiktok', 'youtube']
    },
    paid_ads: {
      status: evaluate(['meta-ads', 'google-ads', 'tiktok-ads']),
      integrations: ['meta-ads', 'google-ads', 'tiktok-ads']
    },
    website_analytics: {
      status: evaluate(['website', 'ga4', 'meta-pixel', 'tiktok-pixel', 'gtm']),
      integrations: ['website', 'ga4', 'meta-pixel', 'tiktok-pixel', 'gtm']
    },
    seo_search_console: {
      status: evaluate(['search-console']),
      integrations: ['search-console']
    },
    commerce_orders: {
      status: evaluate(['woocommerce', 'shopify', 'amazon', 'ebay']),
      integrations: ['woocommerce', 'shopify', 'amazon', 'ebay']
    },
    email_crm: {
      status: evaluate(['smtp', 'mailchimp', 'crm']),
      integrations: ['smtp', 'mailchimp', 'crm']
    },
    automation: {
      status: evaluate(['google-drive', 'slack', 'telegram', 'notion', 'zapier', 'make', 'webhook']),
      integrations: ['google-drive', 'slack', 'telegram', 'notion', 'zapier', 'make', 'webhook']
    }
  };
}

function buildCrossPlatformComparison({ social, website, seo, paid }) {
  return [
    {
      platform: 'Facebook',
      performance_level: asString(social.facebook?.summary?.performance_level),
      strongest_metric: asString(social.facebook?.summary?.strongest_metric),
      weakest_metric: asString(social.facebook?.summary?.weakest_metric),
      trend_direction: asString(social.facebook?.summary?.trend_direction),
      recommendation: asString(social.facebook?.summary?.recommendation)
    },
    {
      platform: 'Instagram',
      performance_level: asString(social.instagram?.summary?.performance_level),
      strongest_metric: asString(social.instagram?.summary?.strongest_metric),
      weakest_metric: asString(social.instagram?.summary?.weakest_metric),
      trend_direction: asString(social.instagram?.summary?.trend_direction),
      recommendation: asString(social.instagram?.summary?.recommendation)
    },
    {
      platform: 'TikTok',
      performance_level: asString(social.tiktok?.summary?.performance_level),
      strongest_metric: asString(social.tiktok?.summary?.strongest_metric),
      weakest_metric: asString(social.tiktok?.summary?.weakest_metric),
      trend_direction: asString(social.tiktok?.summary?.trend_direction),
      recommendation: asString(social.tiktok?.summary?.recommendation)
    },
    {
      platform: 'YouTube',
      performance_level: asString(social.youtube?.summary?.performance_level),
      strongest_metric: asString(social.youtube?.summary?.strongest_metric),
      weakest_metric: asString(social.youtube?.summary?.weakest_metric),
      trend_direction: asString(social.youtube?.summary?.trend_direction),
      recommendation: asString(social.youtube?.summary?.recommendation)
    },
    {
      platform: 'Website',
      performance_level: asString(website.summary?.performance_level),
      strongest_metric: asString(website.summary?.strongest_metric),
      weakest_metric: asString(website.summary?.weakest_metric),
      trend_direction: asString(website.summary?.trend_direction),
      recommendation: asString(website.summary?.recommendation)
    },
    {
      platform: 'SEO / Search Console',
      performance_level: asString(seo.summary?.performance_level),
      strongest_metric: asString(seo.summary?.strongest_metric),
      weakest_metric: asString(seo.summary?.weakest_metric),
      trend_direction: asString(seo.summary?.trend_direction),
      recommendation: asString(seo.summary?.recommendation)
    },
    {
      platform: 'Paid Ads',
      performance_level: asString(paid.summary?.performance_level),
      strongest_metric: asString(paid.summary?.strongest_metric),
      weakest_metric: asString(paid.summary?.weakest_metric),
      trend_direction: asString(paid.summary?.trend_direction),
      recommendation: asString(paid.summary?.recommendation)
    }
  ];
}

function flattenContentForLearning(social = {}) {
  return Object.values(asObject(social))
    .flatMap(platform => asArray(platform.posts))
    .map(item => ({
      ...item,
      score: scoreContentItem(item)
    }));
}

function buildTopAndWeakContent(contentItems = []) {
  const measured = contentItems.filter(item => scoreContentItem(item) > 0);
  const ranked = measured
    .slice()
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    top: ranked.slice(0, 5).map(item => ({
      ...item,
      why_it_worked: asString(item.why_it_worked) || 'This item is outperforming the current measured content baseline.'
    })),
    weak: ranked
      .slice()
      .reverse()
      .slice(0, 5)
      .map(item => ({
        ...item,
        likely_reason: asString(item.improve_hint) || 'This content is under the current performance baseline and needs a better hook, CTA, or platform match.',
        improve_next: asString(item.improve_hint) || 'Rewrite the angle, tighten the CTA, and test a stronger format.'
      }))
  };
}

function buildExecutiveOverview({ social, website, seo, paid, marketplace, coverage, controlCenter }) {
  const totalReach = sumNumbers([
    social.facebook?.summary?.reach,
    social.instagram?.summary?.reach,
    social.tiktok?.summary?.reach,
    social.youtube?.summary?.reach
  ]);
  const totalEngagement = sumNumbers([
    social.facebook?.summary?.engagement,
    social.instagram?.summary?.engagement,
    social.tiktok?.summary?.engagement,
    social.youtube?.summary?.engagement
  ]);
  const totalClicks = sumNumbers([
    social.facebook?.summary?.clicks,
    social.instagram?.summary?.clicks,
    social.tiktok?.summary?.clicks,
    social.youtube?.summary?.clicks,
    website.summary?.clicks,
    seo.summary?.clicks,
    paid.summary?.clicks
  ]);
  const totalConversions = sumNumbers([
    social.facebook?.summary?.conversions,
    social.instagram?.summary?.conversions,
    social.tiktok?.summary?.conversions,
    social.youtube?.summary?.conversions,
    website.summary?.conversions,
    paid.summary?.conversions,
    marketplace.summary?.orders
  ]);
  const totalRevenue = sumNumbers([
    social.facebook?.summary?.revenue,
    social.instagram?.summary?.revenue,
    social.tiktok?.summary?.revenue,
    social.youtube?.summary?.revenue,
    website.summary?.revenue,
    paid.summary?.revenue,
    marketplace.summary?.revenue
  ]);
  const totalSpend = toNumber(paid.summary?.spend);
  const overallRoas = totalRevenue != null && totalSpend != null && totalSpend > 0
    ? totalRevenue / totalSpend
    : toNumber(paid.summary?.roas);

  return {
    total_reach: totalReach,
    total_engagement: totalEngagement,
    total_clicks: totalClicks,
    total_conversions: totalConversions,
    total_revenue: totalRevenue,
    total_spend: totalSpend,
    overall_roas: overallRoas,
    seo_visibility_summary: seo.summary?.impressions != null
      ? `${seo.summary.impressions} impressions`
      : 'SEO feed not live yet',
    integration_summary: asObject(controlCenter.summary),
    data_coverage: coverage
  };
}

function buildProjectInsightsPayload({
  projectName,
  projectPaths,
  integrationControlCenter = null
}) {
  const controlCenter = integrationControlCenter || {
    project: projectName,
    summary: {},
    records: asObject(readIntegrationRegistry(projectPaths).records)
  };
  const snapshots = listSnapshotRecords(projectPaths);
  const syncHistory = readSyncHistory(projectPaths);
  const historyByIntegration = groupHistoryByIntegration(syncHistory);

  const social = aggregateSocialData(snapshots, historyByIntegration);
  const website = aggregateWebsiteData(snapshots, historyByIntegration);
  const seo = aggregateSeoData(snapshots, historyByIntegration);
  const paid = aggregatePaidData(snapshots, historyByIntegration);
  const marketplace = aggregateMarketplaceData(snapshots, historyByIntegration);
  const coverage = buildCoverageMap({
    controlCenter,
    snapshots
  });
  const contentItems = flattenContentForLearning(social);
  const contentSets = buildTopAndWeakContent(contentItems);
  const learning = buildLearningEngine({
    projectName,
    contentItems,
    topContent: contentSets.top,
    weakContent: contentSets.weak,
    feeds: {
      website,
      seo,
      paid,
      marketplace
    },
    coverage
  });

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    source_summary: {
      snapshot_count: snapshots.length,
      sync_history_count: syncHistory.length,
      last_global_sync: asString(controlCenter.summary?.last_global_sync)
    },
    executive_overview: buildExecutiveOverview({
      social,
      website,
      seo,
      paid,
      marketplace,
      coverage,
      controlCenter
    }),
    cross_platform_comparison: buildCrossPlatformComparison({
      social,
      website,
      seo,
      paid
    }),
    social,
    marketplace,
    website,
    seo,
    paid,
    best_performing_content: contentSets.top,
    underperforming_content: contentSets.weak,
    data_coverage: coverage,
    learning_patterns: learning.learning_patterns,
    recommendations: learning.recommendations,
    system_lessons: learning.system_lessons,
    ai_recommendations: learning.ai_recommendations,
    assistant_prompts: asArray(learning.ai_recommendations?.assistant_prompts)
  };
}

function buildProjectLearningPayload({
  projectName,
  projectPaths,
  integrationControlCenter = null
}) {
  const insights = buildProjectInsightsPayload({
    projectName,
    projectPaths,
    integrationControlCenter
  });

  return {
    project: insights.project,
    generated_at: insights.generated_at,
    data_coverage: insights.data_coverage,
    learning_patterns: insights.learning_patterns,
    recommendations: insights.recommendations,
    system_lessons: insights.system_lessons,
    ai_recommendations: insights.ai_recommendations,
    source_summary: insights.source_summary
  };
}

module.exports = {
  buildProjectInsightsPayload,
  buildProjectLearningPayload
};
