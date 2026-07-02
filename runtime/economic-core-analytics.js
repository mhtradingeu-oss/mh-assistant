"use strict";

function createEconomicCoreAnalytics(deps = {}) {
  const {
    normalizeProjectSlug,
    readPerformanceStore,
    readSchedulerJobs,
    toFiniteNumber,
    buildRiskAlertsBase
  } = deps;

  if (typeof normalizeProjectSlug !== "function") throw new Error("normalizeProjectSlug dependency required");
  if (typeof readPerformanceStore !== "function") throw new Error("readPerformanceStore dependency required");
  if (typeof readSchedulerJobs !== "function") throw new Error("readSchedulerJobs dependency required");
  if (typeof toFiniteNumber !== "function") throw new Error("toFiniteNumber dependency required");

  function calculateEntityPerformance(records, key) {
    const map = new Map();

    for (const record of records || []) {
      const id = String(record?.[key] || "").trim();
      if (!id) continue;

      const current = map.get(id) || {
        key: id,
        count: 0,
        scoreSum: 0,
        ctrSum: 0,
        conversionRateSum: 0,
        roasSum: 0,
        roasCount: 0,
        revenueSum: 0,
        conversionsSum: 0
      };

      current.count += 1;
      current.scoreSum += toFiniteNumber(record?.stats?.performance_score, 0);
      current.ctrSum += toFiniteNumber(record?.stats?.ctr, 0);
      current.conversionRateSum += toFiniteNumber(record?.stats?.conversion_rate, 0);
      current.revenueSum += toFiniteNumber(record?.metrics?.revenue, 0);
      current.conversionsSum += toFiniteNumber(record?.metrics?.conversions, 0);

      const roas = record?.stats?.roas;
      if (Number.isFinite(roas)) {
        current.roasSum += roas;
        current.roasCount += 1;
      }

      map.set(id, current);
    }

    return Array.from(map.values()).map((value) => ({
      key: value.key,
      count: value.count,
      avg_score: Number((value.scoreSum / Math.max(1, value.count)).toFixed(2)),
      avg_ctr: Number((value.ctrSum / Math.max(1, value.count)).toFixed(4)),
      avg_conversion_rate: Number((value.conversionRateSum / Math.max(1, value.count)).toFixed(4)),
      avg_roas: value.roasCount > 0
        ? Number((value.roasSum / value.roasCount).toFixed(3))
        : null,
      total_revenue: Number(value.revenueSum.toFixed(2)),
      total_conversions: value.conversionsSum
    }));
  }

  function buildTrendSnapshot(records, channel) {
    const scoped = (records || [])
      .filter((record) => String(record.channel || "").trim().toLowerCase() === channel)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

    if (!scoped.length) {
      return {
        channel,
        direction: "stable",
        change_pct: 0,
        recent_avg_score: 0,
        previous_avg_score: 0,
        sample_size: 0
      };
    }

    const recent = scoped.slice(-3);
    const previous = scoped.slice(-6, -3);

    const average = (items) => {
      if (!items.length) return 0;
      const total = items.reduce((sum, item) => sum + toFiniteNumber(item?.stats?.performance_score, 0), 0);
      return total / items.length;
    };

    const recentAvg = average(recent);
    const previousAvg = average(previous);
    const delta = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    let direction = "stable";
    if (delta > 8) direction = "up";
    if (delta < -8) direction = "down";

    return {
      channel,
      direction,
      change_pct: Number(delta.toFixed(2)),
      recent_avg_score: Number(recentAvg.toFixed(2)),
      previous_avg_score: Number(previousAvg.toFixed(2)),
      sample_size: scoped.length
    };
  }

  function buildPerformanceSummary(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    const store = readPerformanceStore(safeProject);
    const records = Array.isArray(store.records) ? store.records : [];

    const topCampaigns = calculateEntityPerformance(records, "campaign_id")
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, 5);

    const topProducts = calculateEntityPerformance(records, "product_slug")
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, 5);

    const channels = calculateEntityPerformance(records, "channel")
      .sort((a, b) => b.avg_score - a.avg_score);

    const topChannels = channels.slice(0, 3);
    const weakChannels = channels.filter((channel) => channel.avg_score < 22 || channel.avg_conversion_rate < 0.01);

    const hooks = calculateEntityPerformance(records, "hook")
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, 5);

    const trendChannels = Array.from(
      new Set(records.map((record) => String(record.channel || "").trim().toLowerCase()).filter(Boolean))
    );

    const trends = trendChannels
      .map((channel) => buildTrendSnapshot(records, channel))
      .sort((a, b) => b.recent_avg_score - a.recent_avg_score);

    return {
      project: safeProject,
      records_tracked: records.length,
      top_performing_campaigns: topCampaigns,
      top_performing_products: topProducts,
      top_channels: topChannels,
      weak_channels: weakChannels,
      best_hooks: hooks,
      performance_trends: trends
    };
  }

  function collectExecutionSignals(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    const jobs = readSchedulerJobs(safeProject);
    const completed = jobs.filter((job) => job.status === "completed");
    const failed = jobs.filter((job) => job.status === "failed");
    const retryable = jobs.filter((job) => job.status === "retryable");

    const byChannel = new Map();

    for (const job of jobs) {
      const channel = String(job.channel || "").trim().toLowerCase();
      if (!channel) continue;

      const current = byChannel.get(channel) || {
        channel,
        total_jobs: 0,
        completed: 0,
        failed: 0,
        retryable: 0
      };

      current.total_jobs += 1;
      if (job.status === "completed") current.completed += 1;
      if (job.status === "failed") current.failed += 1;
      if (job.status === "retryable") current.retryable += 1;

      byChannel.set(channel, current);
    }

    const channelStatus = Array.from(byChannel.values()).map((entry) => ({
      ...entry,
      failure_rate: entry.total_jobs > 0
        ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
        : 0
    }));

    return {
      total_jobs: jobs.length,
      completed_jobs: completed.length,
      failed_jobs: failed.length,
      retryable_jobs: retryable.length,
      channel_status: channelStatus
    };
  }

  function buildRiskAlerts(summary, records) {
    if (typeof buildRiskAlertsBase !== "function") return [];
    return buildRiskAlertsBase(summary, records, { toFiniteNumber });
  }

  return {
    calculateEntityPerformance,
    buildTrendSnapshot,
    buildPerformanceSummary,
    collectExecutionSignals,
    buildRiskAlerts
  };
}

module.exports = {
  createEconomicCoreAnalytics
};
