'use strict';

function createSmartSuggestions(deps = {}) {
  const {
    normalizeProjectSlug,
    buildPerformanceSummary,
    buildDecisionSnapshot,
    readRecommendationsStore,
    readLearningStore,
    generateOptimizationRecommendations
  } = deps;

  function buildSmartSuggestions(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    const snapshot = typeof buildDecisionSnapshot === 'function'
      ? buildDecisionSnapshot(safeProject)
      : { summary: buildPerformanceSummary(safeProject) };
    const summary = snapshot.summary;
    const recommendationStore = readRecommendationsStore(safeProject);
    const learningStore = readLearningStore(safeProject);
    const latest = recommendationStore.latest
      || (snapshot.recommendations || null)
      || generateOptimizationRecommendations(safeProject);

    const topChannel = summary.top_channels?.[0]?.key || null;
    const topProduct = summary.top_performing_products?.[0]?.key || null;
    const topHook = summary.best_hooks?.[0]?.key || null;
    const strongestPattern = (learningStore.patterns || [])
      .slice()
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0] || null;

    return {
      project: safeProject,
      generated_at: new Date().toISOString(),
      next_best_action: latest.scale[0] || latest.improve[0] || 'Collect more feedback records to unlock stronger suggestions.',
      next_campaign_idea: topProduct
        ? `Launch a 3-creative sprint for ${topProduct}${topHook ? ` using hook "${topHook}"` : ''}.`
        : 'Launch a 3-creative sprint around the top-converting product category this week.',
      best_channel_to_focus: topChannel,
      content_to_regenerate: latest.improve[0] || latest.stop[0] || 'Regenerate low-engagement creatives with a shorter hook and stronger CTA.',
      learning_signal: strongestPattern
        ? {
          pattern: strongestPattern.pattern,
          confidence: strongestPattern.confidence,
          channel: strongestPattern.channel
        }
        : null,
      alerts: latest.alerts || []
    };
  }

  return {
    buildSmartSuggestions
  };
}

module.exports = {
  createSmartSuggestions
};
