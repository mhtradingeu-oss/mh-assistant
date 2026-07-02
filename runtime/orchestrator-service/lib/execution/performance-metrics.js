'use strict';

function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeFeedbackMetrics(input = {}) {
  const metrics = {
    impressions: Math.max(0, toFiniteNumber(input.impressions, 0)),
    clicks: Math.max(0, toFiniteNumber(input.clicks, 0)),
    engagement: Math.max(0, toFiniteNumber(input.engagement, 0)),
    conversions: Math.max(0, toFiniteNumber(input.conversions, 0)),
    revenue: Math.max(0, toFiniteNumber(input.revenue, 0))
  };

  if (Object.prototype.hasOwnProperty.call(input || {}, 'cost')) {
    metrics.cost = Math.max(0, toFiniteNumber(input.cost, 0));
  }

  return metrics;
}

function derivePerformanceStats(metrics = {}) {
  const impressions = Math.max(0, toFiniteNumber(metrics.impressions, 0));
  const clicks = Math.max(0, toFiniteNumber(metrics.clicks, 0));
  const engagement = Math.max(0, toFiniteNumber(metrics.engagement, 0));
  const conversions = Math.max(0, toFiniteNumber(metrics.conversions, 0));
  const revenue = Math.max(0, toFiniteNumber(metrics.revenue, 0));
  const cost = Math.max(0, toFiniteNumber(metrics.cost, 0));

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const engagementRate = impressions > 0 ? engagement / impressions : 0;
  const conversionRate = clicks > 0 ? conversions / clicks : 0;
  const roas = cost > 0 ? revenue / cost : (revenue > 0 ? null : 0);
  const cpa = conversions > 0 && cost > 0 ? cost / conversions : null;

  const weightedScore = (
    (ctr * 100 * 0.3)
    + (engagementRate * 100 * 0.2)
    + (conversionRate * 100 * 0.35)
    + ((roas == null ? 1 : roas) * 10 * 0.15)
  );

  return {
    ctr: Number(ctr.toFixed(4)),
    engagement_rate: Number(engagementRate.toFixed(4)),
    conversion_rate: Number(conversionRate.toFixed(4)),
    roas: roas == null ? null : Number(roas.toFixed(3)),
    cpa: cpa == null ? null : Number(cpa.toFixed(3)),
    performance_score: Number(Math.max(0, weightedScore).toFixed(2))
  };
}

module.exports = {
  toFiniteNumber,
  normalizeFeedbackMetrics,
  derivePerformanceStats
};
