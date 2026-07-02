'use strict';

function createRecommendationRuntime(deps = {}) {
  const {
    normalizeProjectSlug,
    buildPerformanceSummary,
    collectExecutionSignals,
    readPerformanceStore,
    buildRiskAlerts
  } = deps;

  function buildRecommendationsFromData(safeProject, summary, executionSignals, alerts) {
    const stop = [];
    const scale = [];
    const improve = [];
    const newAngles = [];

    for (const channel of summary.weak_channels || []) {
      stop.push(
        `Pause low-performing ${channel.key} creatives with avg score ${channel.avg_score}.`
      );
    }

    for (const channel of summary.top_channels || []) {
      scale.push(
        `Scale ${channel.key} where avg score is ${channel.avg_score} and conversion rate is ${channel.avg_conversion_rate}.`
      );
    }

    for (const hook of summary.best_hooks || []) {
      if (hook.count >= 2) {
        scale.push(
          `Reuse hook "${hook.key}" across adjacent campaigns (avg score ${hook.avg_score}).`
        );
      }
    }

    for (const signal of executionSignals.channel_status || []) {
      if (signal.failure_rate > 0.3) {
        improve.push(
          `Improve ${signal.channel} execution reliability (failure rate ${signal.failure_rate}).`
        );
      }
    }

    if (!(summary.best_hooks || []).length) {
      newAngles.push(
        'Test 3 hook families: pain-point opener, quick transformation, and authority-led proof.'
      );
    } else {
      const primaryHook = summary.best_hooks[0].key;
      newAngles.push(
        `Create a variant ladder for "${primaryHook}": short CTA variant, social-proof variant, and urgency variant.`
      );
    }

    if ((summary.top_performing_products || []).length) {
      const topProduct = summary.top_performing_products[0].key;
      newAngles.push(
        `Build product-led storytelling around ${topProduct} with channel-native edits per platform.`
      );
    }

    return {
      generated_at: new Date().toISOString(),
      project: safeProject,
      based_on: {
        records_tracked: summary.records_tracked,
        scheduler_jobs_tracked: executionSignals.total_jobs,
        completed_jobs: executionSignals.completed_jobs
      },
      stop: Array.from(new Set(stop)).slice(0, 8),
      scale: Array.from(new Set(scale)).slice(0, 8),
      improve: Array.from(new Set(improve)).slice(0, 8),
      new_angles_to_test: Array.from(new Set(newAngles)).slice(0, 8),
      alerts,
      summary
    };
  }

  function buildDecisionSnapshot(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    const summary = buildPerformanceSummary(safeProject);
    const executionSignals = collectExecutionSignals(safeProject);
    const records = readPerformanceStore(safeProject).records;
    const alerts = buildRiskAlerts(summary, records);

    return {
      project: safeProject,
      summary,
      executionSignals,
      records,
      alerts
    };
  }

  function generateOptimizationRecommendations(projectName) {
    const snapshot = buildDecisionSnapshot(projectName);
    return buildRecommendationsFromData(
      snapshot.project,
      snapshot.summary,
      snapshot.executionSignals,
      snapshot.alerts
    );
  }

  return {
    buildDecisionSnapshot,
    generateOptimizationRecommendations
  };
}

module.exports = {
  createRecommendationRuntime
};
