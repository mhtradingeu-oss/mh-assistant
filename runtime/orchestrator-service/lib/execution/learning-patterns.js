'use strict';

function createLearningPatterns(deps = {}) {
  const {
    crypto,
    toFiniteNumber
  } = deps;

  function upsertLearningPattern(learningStore, pattern) {
    const safePattern = String(pattern.pattern || '').trim();
    if (!safePattern) return null;

    const existingIndex = learningStore.patterns.findIndex(
      (item) => String(item.pattern || '').trim().toLowerCase() === safePattern.toLowerCase()
        && String(item.channel || '').trim().toLowerCase() === String(pattern.channel || '').trim().toLowerCase()
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const current = learningStore.patterns[existingIndex];
      learningStore.patterns[existingIndex] = {
        ...current,
        confidence: Number(Math.max(current.confidence || 0, pattern.confidence || 0).toFixed(2)),
        support_count: Number(current.support_count || 0) + Number(pattern.support_count || 1),
        last_observed_at: now,
        evidence: Array.from(new Set([...(current.evidence || []), ...(pattern.evidence || [])])).slice(-8)
      };
      return learningStore.patterns[existingIndex];
    }

    const entry = {
      id: `learn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      pattern: safePattern,
      channel: String(pattern.channel || '').trim().toLowerCase() || null,
      confidence: Number(toFiniteNumber(pattern.confidence, 0.5).toFixed(2)),
      support_count: Number(pattern.support_count || 1),
      learned_from: String(pattern.learned_from || 'performance_feedback').trim(),
      evidence: Array.isArray(pattern.evidence) ? pattern.evidence.slice(0, 8) : [],
      first_observed_at: now,
      last_observed_at: now
    };

    learningStore.patterns.push(entry);
    return entry;
  }

  return {
    upsertLearningPattern
  };
}

module.exports = {
  createLearningPatterns
};
