"use strict";

function calculateEntityPerformance(records, key) {
  const map = new Map();

  for (const record of records) {
    const id = String(record?.[key] || '').trim();
    if (!id) continue;

    const current = map.get(id) || {
      key: id,
      count: 0,
      score_sum: 0,
      ctr_sum: 0,
      conversion_rate_sum: 0,
      roas_sum: 0,
      roas_count: 0,
      revenue_sum: 0,
      conversions_sum: 0
    };

    current.count += 1;
    current.score_sum += Number(record?.stats?.performance_score || 0);
    current.ctr_sum += Number(record?.stats?.ctr || 0);
    current.conversion_rate_sum += Number(record?.stats?.conversion_rate || 0);
    current.revenue_sum += Number(record?.metrics?.revenue || 0);
    current.conversions_sum += Number(record?.metrics?.conversions || 0);

    const roas = record?.stats?.roas;
    if (Number.isFinite(roas)) {
      current.roas_sum += roas;
      current.roas_count += 1;
    }

    map.set(id, current);
  }

  return Array.from(map.values()).map(v => ({
    key: v.key,
    count: v.count,
    avg_score: v.score_sum / Math.max(1, v.count),
    avg_ctr: v.ctr_sum / Math.max(1, v.count),
    avg_conversion_rate: v.conversion_rate_sum / Math.max(1, v.count),
    avg_roas: v.roas_count ? v.roas_sum / v.roas_count : null,
    total_revenue: v.revenue_sum,
    total_conversions: v.conversions_sum
  }));
}

module.exports = {
  calculateEntityPerformance
};
