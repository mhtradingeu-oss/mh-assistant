'use strict';

function createIntelligenceLoop(deps = {}) {
  const {
    env,
    normalizeProjectSlug,
    buildPerformanceSummary,
    generateOptimizationRecommendations,
    readRecommendationsStore,
    writeRecommendationsStore,
    readLearningStore,
    writeLearningStore,
    buildLearningCandidates,
    upsertLearningPattern
  } = deps;

  function updateIntelligenceLoop(projectName, context = {}) {
    const safeProject = normalizeProjectSlug(projectName);
    const summary = buildPerformanceSummary(safeProject);
    const recommendations = generateOptimizationRecommendations(safeProject);
    const allowLocalDryRun = String(env.ALLOW_LOCAL_DRY_RUN || '').trim() === '1';
    const allowLearningUpdates = String(env.ALLOW_LEARNING_UPDATES || '').trim() === '1';

    if (allowLocalDryRun && !allowLearningUpdates) {
      return {
        summary,
        recommendations,
        learning_updates: [],
        alerts: recommendations.alerts,
        skipped_persistence: true
      };
    }

    const recommendationStore = readRecommendationsStore(safeProject);
    recommendationStore.latest = recommendations;
    recommendationStore.history.push({
      generated_at: recommendations.generated_at,
      trigger: String(context.trigger || 'manual').trim(),
      stop_count: recommendations.stop.length,
      scale_count: recommendations.scale.length,
      improve_count: recommendations.improve.length,
      angle_count: recommendations.new_angles_to_test.length,
      alert_count: recommendations.alerts.length
    });
    writeRecommendationsStore(safeProject, recommendationStore);

    const learningStore = readLearningStore(safeProject);
    const candidates = buildLearningCandidates(summary, recommendations);
    const updates = [];

    for (const candidate of candidates) {
      const updated = upsertLearningPattern(learningStore, candidate);
      if (updated) updates.push(updated);
    }

    learningStore.history.push({
      generated_at: new Date().toISOString(),
      trigger: String(context.trigger || 'manual').trim(),
      records_tracked: summary.records_tracked,
      recommendations_generated: {
        stop: recommendations.stop.length,
        scale: recommendations.scale.length,
        improve: recommendations.improve.length,
        new_angles: recommendations.new_angles_to_test.length
      },
      alerts_count: recommendations.alerts.length,
      learning_updates: updates.length,
      feedback_record_id: context.feedbackRecord?.record_id || null,
      job_id: context.jobRecord?.id || context.feedbackRecord?.job_id || null
    });
    writeLearningStore(safeProject, learningStore);

    return {
      summary,
      recommendations,
      learning_updates: updates,
      alerts: recommendations.alerts
    };
  }

  return {
    updateIntelligenceLoop
  };
}

module.exports = {
  createIntelligenceLoop
};
