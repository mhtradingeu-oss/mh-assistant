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

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function compactWords(value, fallback = 'Untitled pattern') {
  const words = asString(value)
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 8);

  return words.length ? words.join(' ') : fallback;
}

function getContentTimestamp(item = {}) {
  const value = asString(
    item.published_at ||
    item.created_at ||
    item.timestamp ||
    item.create_time
  );

  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function getContentLabel(item = {}) {
  return asString(
    item.title ||
    item.label ||
    item.caption ||
    item.message ||
    item.name ||
    item.id
  ) || 'Published content';
}

function getContentFormat(item = {}) {
  return asString(
    item.format ||
    item.media_type ||
    item.product_type ||
    item.type
  ) || 'Post';
}

function calculateContentScore(item = {}) {
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

function summarizeBestEntry(map, fallback, options = {}) {
  const entries = Array.from(map.values())
    .filter(entry => entry.count > 0)
    .sort((a, b) => {
      const aScore = a.total / a.count;
      const bScore = b.total / b.count;
      return bScore - aScore || b.total - a.total;
    });

  if (!entries.length) {
    return {
      label: fallback,
      evidence_count: 0,
      average_score: null
    };
  }

  const best = entries[0];
  return {
    label: options.titleCase ? titleCase(best.key) : best.key,
    evidence_count: best.count,
    average_score: Number((best.total / best.count).toFixed(2))
  };
}

function summarizeWorstEntries(items = [], limit = 3) {
  return items
    .slice()
    .sort((a, b) => calculateContentScore(a) - calculateContentScore(b))
    .slice(0, limit)
    .map(item => ({
      label: getContentLabel(item),
      platform: titleCase(item.platform || 'unknown'),
      score: Number(calculateContentScore(item).toFixed(2)),
      reason: asString(item.improve_hint || item.reason || item.topic) || 'Low reach or conversion signal compared with the current content set.'
    }));
}

function buildMaps(contentItems = []) {
  const maps = {
    hooks: new Map(),
    formats: new Map(),
    platforms: new Map(),
    postingWindows: new Map(),
    topics: new Map(),
    ctas: new Map()
  };

  const add = (map, key, score) => {
    const normalizedKey = asString(key);
    if (!normalizedKey) {
      return;
    }

    if (!map.has(normalizedKey)) {
      map.set(normalizedKey, {
        key: normalizedKey,
        total: 0,
        count: 0
      });
    }

    const entry = map.get(normalizedKey);
    entry.total += score;
    entry.count += 1;
  };

  contentItems.forEach(item => {
    const score = calculateContentScore(item);
    const label = getContentLabel(item);
    const hour = getContentTimestamp(item)
      ? new Date(getContentTimestamp(item)).getUTCHours()
      : null;

    add(maps.hooks, compactWords(item.hook || label), score);
    add(maps.formats, getContentFormat(item), score);
    add(maps.platforms, asString(item.platform || 'unknown'), score);
    add(maps.topics, compactWords(item.topic || label), score);
    add(maps.ctas, compactWords(item.cta), score);

    if (hour != null) {
      const bucket = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      add(maps.postingWindows, bucket, score);
    }
  });

  return maps;
}

function buildSystemLessons({ contentItems, coverage, website, seo, paid, topContent, weakContent }) {
  const lessons = [];

  if (!contentItems.length) {
    lessons.push('Connect social insight feeds so MH Assistant can learn from measured post and video performance instead of only connection health.');
  }

  if (website.summary.sessions != null && website.summary.conversions != null && website.summary.sessions > 0) {
    const conversionRate = (website.summary.conversions / website.summary.sessions) * 100;
    if (conversionRate < 1) {
      lessons.push('Website traffic is present, but conversion efficiency is still weak. Prioritize landing-page clarity and CTA alignment.');
    }
  }

  if (seo.summary.impressions != null && seo.summary.ctr != null && seo.summary.ctr < 2) {
    lessons.push('Search visibility exists, but click-through rate is underperforming. Rewrite titles and meta descriptions for the highest-impression pages.');
  }

  if (paid.summary.spend != null && paid.summary.ctr != null && paid.summary.ctr < 1) {
    lessons.push('Paid reach is being bought, but click-through efficiency is low. Refresh hooks and creative framing before increasing spend.');
  }

  if (topContent.length) {
    lessons.push(`Top performer right now is ${topContent[0].label} on ${titleCase(topContent[0].platform || 'its platform')}. Reuse its hook, format, and CTA structure.`);
  }

  if (weakContent.length) {
    lessons.push(`Weak content pattern to avoid: ${weakContent[0].label} on ${titleCase(weakContent[0].platform || 'its platform')} is not converting current attention into action.`);
  }

  if ((coverage.social_insights?.status || '') === 'missing') {
    lessons.push('Social learning is incomplete because no live social insight snapshot has been synced yet.');
  }

  return lessons;
}

function buildRecommendationEntry({
  domain,
  priority,
  title,
  evidence,
  action,
  reason
}) {
  return {
    domain,
    priority,
    title,
    evidence,
    action,
    reason
  };
}

function buildRecommendations({
  projectName,
  contentItems,
  topContent,
  weakContent,
  website,
  seo,
  paid,
  marketplace,
  coverage,
  patterns
}) {
  const recommendations = [];

  if (topContent.length) {
    recommendations.push(buildRecommendationEntry({
      domain: 'content',
      priority: 'high',
      title: 'Scale the current winning content pattern',
      evidence: `${topContent[0].label} is the strongest measured content item right now.`,
      action: `Create follow-up variations that keep the ${patterns.best_formats?.label || 'best-performing format'} format and the ${patterns.best_hooks?.label || 'best current hook'} hook structure.`,
      reason: 'The system already has evidence that this pattern is outperforming the rest of the current content set.'
    }));
  }

  if (weakContent.length) {
    recommendations.push(buildRecommendationEntry({
      domain: 'content',
      priority: 'high',
      title: 'Rewrite weak content before publishing more of the same',
      evidence: `${weakContent[0].label} is in the weakest content cluster.`,
      action: 'Replace the hook, sharpen the CTA, and test a stronger platform-format match before reusing the same angle.',
      reason: 'Low-performing content provides a clear negative pattern the system should stop repeating.'
    }));
  }

  if (website.summary.sessions != null && website.summary.sessions > 0 && website.summary.conversions != null && website.summary.conversions === 0) {
    recommendations.push(buildRecommendationEntry({
      domain: 'website',
      priority: 'high',
      title: 'Fix conversion leakage on the website',
      evidence: `The site is receiving ${website.summary.sessions} measured sessions with no recorded conversions in the current dataset.`,
      action: 'Audit landing-page CTA clarity, trust proof, offer framing, and form friction before increasing traffic volume.',
      reason: 'Traffic without conversion means content and paid performance cannot turn into business results yet.'
    }));
  }

  if (seo.summary.impressions != null && seo.summary.impressions > 0 && seo.summary.ctr != null && seo.summary.ctr < 2) {
    recommendations.push(buildRecommendationEntry({
      domain: 'seo',
      priority: 'medium',
      title: 'Capture more clicks from existing search visibility',
      evidence: `SEO visibility exists at ${seo.summary.impressions} impressions, but CTR is only ${seo.summary.ctr.toFixed(2)}%.`,
      action: 'Update titles, meta descriptions, and SERP messaging for the pages with the most impressions and the weakest CTR.',
      reason: 'This is usually faster than creating new content because the visibility already exists.'
    }));
  }

  if (paid.summary.spend != null && paid.summary.spend > 0 && paid.summary.ctr != null && paid.summary.ctr < 1) {
    recommendations.push(buildRecommendationEntry({
      domain: 'paid',
      priority: 'medium',
      title: 'Refresh paid creative before scaling spend',
      evidence: `Paid spend is active at ${paid.summary.spend}, but CTR is below 1%.`,
      action: 'Swap in stronger hooks, more direct benefit-led creative, and landing pages better aligned to ad intent.',
      reason: 'Low CTR usually means the ad message is not matching audience interest strongly enough.'
    }));
  }

  if (marketplace.summary.revenue != null && marketplace.summary.revenue > 0 && !website.summary.revenue) {
    recommendations.push(buildRecommendationEntry({
      domain: 'commerce',
      priority: 'medium',
      title: 'Link marketplace sales learnings back into content strategy',
      evidence: `Commerce revenue is showing in the synced marketplace data, but website attribution remains thin.`,
      action: 'Promote the strongest-selling products with content hooks that mirror what is already converting in commerce channels.',
      reason: 'Sales data is the strongest signal available for what the market already values.'
    }));
  }

  if ((coverage.website_analytics?.status || '') !== 'covered') {
    recommendations.push(buildRecommendationEntry({
      domain: 'website',
      priority: 'medium',
      title: 'Complete website analytics coverage',
      evidence: 'The website intelligence lane is still partial or missing.',
      action: 'Reconnect GA4, conversion tracking, or landing-page analytics so the system can tie content and ads to business outcomes.',
      reason: 'Without traffic and conversion data, the system can only optimize for engagement, not revenue or leads.'
    }));
  }

  if ((coverage.social_insights?.status || '') !== 'covered') {
    recommendations.push(buildRecommendationEntry({
      domain: 'publishing',
      priority: 'medium',
      title: 'Increase social insight coverage',
      evidence: 'One or more social insight sources are still missing or only partially synced.',
      action: 'Sync Facebook, Instagram, TikTok, and YouTube feeds so the system can compare hooks, formats, and publishing windows across channels.',
      reason: 'Cross-platform learning depends on post-level metrics, not just publishing logs.'
    }));
  }

  if (!recommendations.length) {
    recommendations.push(buildRecommendationEntry({
      domain: 'optimization',
      priority: 'medium',
      title: 'Expand the current intelligence sample',
      evidence: `The current dataset for ${projectName} is connected, but still limited.`,
      action: 'Import more historical data and keep recurring syncs running so trend detection becomes stronger and more reliable.',
      reason: 'The learning engine improves as more measured history becomes available.'
    }));
  }

  return recommendations;
}

function buildAiRecommendationLayer({ projectName, recommendations, patterns }) {
  const filterDomain = domain => recommendations.filter(item => item.domain === domain);

  return {
    content_improvements: filterDomain('content'),
    seo_improvements: filterDomain('seo'),
    ad_optimizations: filterDomain('paid'),
    publishing_improvements: filterDomain('publishing'),
    website_conversion_improvements: filterDomain('website'),
    reusable_insights: [
      {
        title: 'Winning pattern to reuse',
        summary: `Best current format: ${patterns.best_formats?.label || 'Not enough content data yet'}. Best platform: ${patterns.best_platforms?.label || 'Not enough content data yet'}.`
      },
      {
        title: 'Publishing window to test',
        summary: patterns.best_posting_windows?.label || 'No reliable timing pattern yet.'
      }
    ],
    assistant_prompts: [
      {
        label: 'What should we improve next?',
        prompt: `Review the latest learning patterns and recommendations for ${projectName}. Tell me the next highest-impact optimization across content, SEO, publishing, paid media, and website conversion.`
      },
      {
        label: 'Which platform is strongest?',
        prompt: `Using the latest cross-platform insights for ${projectName}, identify the strongest platform and explain what winning pattern the system should reuse there.`
      },
      {
        label: 'Which posts should we repurpose?',
        prompt: `From the latest top-performing content in ${projectName}, tell me which items should be repurposed next and how they should be adapted for other platforms.`
      },
      {
        label: 'What SEO opportunities matter most?',
        prompt: `Use the latest SEO intelligence for ${projectName} to identify the highest-value query, page, and CTR opportunities to act on next.`
      },
      {
        label: 'What weak content should be rewritten?',
        prompt: `From the latest underperforming content in ${projectName}, identify which pieces should be rewritten first and what angle should replace them.`
      },
      {
        label: 'What winning pattern should we scale?',
        prompt: `Summarize the strongest reusable performance pattern in ${projectName}, including hook, format, channel, CTA, and publishing window.`
      }
    ]
  };
}

function buildLearningEngine({
  projectName,
  contentItems = [],
  topContent = [],
  weakContent = [],
  feeds = {},
  coverage = {}
}) {
  const measuredContent = asArray(contentItems).filter(item => calculateContentScore(item) > 0);
  const maps = buildMaps(measuredContent);
  const website = asObject(feeds.website);
  const seo = asObject(feeds.seo);
  const paid = asObject(feeds.paid);
  const marketplace = asObject(feeds.marketplace);

  const patterns = {
    best_hooks: summarizeBestEntry(maps.hooks, 'No hook pattern yet'),
    best_formats: summarizeBestEntry(maps.formats, 'No format pattern yet'),
    best_platforms: summarizeBestEntry(maps.platforms, 'No platform pattern yet', { titleCase: true }),
    best_posting_windows: summarizeBestEntry(maps.postingWindows, 'No timing pattern yet'),
    best_topics: summarizeBestEntry(maps.topics, 'No topic pattern yet'),
    strongest_cta_patterns: summarizeBestEntry(maps.ctas, 'No CTA pattern yet'),
    weak_patterns_to_avoid: summarizeWorstEntries(measuredContent)
  };

  patterns.best_conversion_sources = [
    website.summary?.conversions != null
      ? {
          label: 'Website',
          conversions: website.summary.conversions,
          revenue: website.summary.revenue ?? null
        }
      : null,
    paid.summary?.conversions != null
      ? {
          label: 'Paid Ads',
          conversions: paid.summary.conversions,
          revenue: paid.summary.revenue ?? null
        }
      : null,
    marketplace.summary?.orders != null
      ? {
          label: 'Commerce',
          conversions: marketplace.summary.orders,
          revenue: marketplace.summary.revenue ?? null
        }
      : null
  ].filter(Boolean);

  const systemLessons = buildSystemLessons({
    contentItems: measuredContent,
    coverage,
    website,
    seo,
    paid,
    topContent,
    weakContent
  });

  const recommendations = buildRecommendations({
    projectName,
    contentItems: measuredContent,
    topContent,
    weakContent,
    website,
    seo,
    paid,
    marketplace,
    coverage,
    patterns
  });

  const aiRecommendationLayer = buildAiRecommendationLayer({
    projectName,
    recommendations,
    patterns
  });

  return {
    generated_at: new Date().toISOString(),
    learning_patterns: patterns,
    system_lessons: systemLessons,
    recommendations,
    ai_recommendations: aiRecommendationLayer
  };
}

module.exports = {
  buildLearningEngine
};
