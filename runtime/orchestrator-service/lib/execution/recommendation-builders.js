'use strict';

function buildRiskAlerts(summary, records, deps = {}) {
  const { toFiniteNumber } = deps;

  const alerts = [];

  for (const trend of summary.performance_trends || []) {
    if (trend.direction === 'down' && trend.sample_size >= 4) {
      alerts.push({
        type: 'declining_performance',
        severity: 'high',
        channel: trend.channel,
        message: `${trend.channel} is declining (${trend.change_pct}% recent score trend).`
      });
    }
  }

  const recentRecords = records
    .slice(-20)
    .filter((record) => record && typeof record === 'object');

  for (const record of recentRecords) {
    const engagementRate = toFiniteNumber(record?.stats?.engagement_rate, 0);

    if (engagementRate > 0 && engagementRate < 0.01) {
      alerts.push({
        type: 'low_engagement',
        severity: 'medium',
        channel: record.channel,
        job_id: record.job_id,
        message: `Low engagement detected on ${record.channel} (ER ${Number((engagementRate * 100).toFixed(2))}%).`
      });
    }

    const cost = toFiniteNumber(record?.metrics?.cost, 0);
    const conversions = toFiniteNumber(record?.metrics?.conversions, 0);
    const roas = record?.stats?.roas;

    if (cost > 0 && (conversions === 0 || (Number.isFinite(roas) && roas < 1))) {
      alerts.push({
        type: 'wasted_budget',
        severity: conversions === 0 ? 'high' : 'medium',
        channel: record.channel,
        job_id: record.job_id,
        message: `Budget inefficiency on ${record.channel} (cost ${cost}, conversions ${conversions}, roas ${roas == null ? 'n/a' : roas}).`
      });
    }
  }

  return alerts.slice(0, 25);
}

function buildLearningCandidates(summary, recommendations) {
  const candidates = [];

  for (const channel of summary.top_channels || []) {
    if (channel.count >= 2 && channel.avg_ctr >= 0.02) {
      candidates.push({
        pattern: `${channel.key} consistently drives above-baseline CTR`,
        channel: channel.key,
        confidence: Math.min(0.95, 0.55 + (channel.avg_ctr * 3)),
        support_count: channel.count,
        learned_from: 'performance_summary',
        evidence: [`avg_ctr=${channel.avg_ctr}`, `avg_score=${channel.avg_score}`]
      });
    }
  }

  for (const hook of summary.best_hooks || []) {
    if (hook.count >= 2) {
      candidates.push({
        pattern: `Hook "${hook.key}" converts better across sampled runs`,
        confidence: Math.min(0.95, 0.5 + (hook.avg_conversion_rate * 5)),
        support_count: hook.count,
        learned_from: 'hook_analysis',
        evidence: [`avg_conversion_rate=${hook.avg_conversion_rate}`, `avg_score=${hook.avg_score}`]
      });
    }
  }

  for (const recommendation of recommendations.scale || []) {
    if (/tiktok/i.test(recommendation)) {
      candidates.push({
        pattern: 'Short-form channel momentum suggests concise, mobile-first creative variants',
        channel: 'tiktok',
        confidence: 0.69,
        support_count: 2,
        learned_from: 'recommendation_analysis',
        evidence: [recommendation]
      });
    }
  }

  return candidates.slice(0, 25);
}

module.exports = {
  buildRiskAlerts,
  buildLearningCandidates
};
