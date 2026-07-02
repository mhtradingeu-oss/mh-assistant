'use strict';

const {
  sanitizeValue,
  serializeErrorForLog
} = require('../orchestrator-service/lib/observability/logger');

function emptyKernelContract() {
  return {
    observability: {
      events: [],
      logs: [],
      metrics: {},
      audit: {}
    },
    decision_trace: {
      registry_signal: {},
      ai_score: {},
      orchestrator_decision: {}
    },
    learning_snapshot: {
      patterns: [],
      updates: [],
      signals: []
    }
  };
}

function asObject(value, fallback = {}) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function createControlPlaneKernel(deps = {}) {
  const {
    logger,
    listEvents,
    buildPerformanceSummary,
    readLearningStore,
    readRecommendationsStore,
    buildLearningPayload
  } = deps;

  function collectObservability(input = {}) {
    const baseline = emptyKernelContract().observability;
    const projectName = String(input.projectName || '').trim();

    let events = [];
    let metrics = {};
    const logs = asArray(input.logs)
      .slice(0, 25)
      .map((entry) => sanitizeValue(entry));

    if (projectName && projectName !== 'unknown' && typeof listEvents === 'function') {
      try {
        const payload = listEvents(projectName, { limit: 25, offset: 0 });
        events = asArray(payload && payload.items).slice(0, 25).map((item) => sanitizeValue(item));
      } catch (error) {
        logs.push({
          component: 'events',
          level: 'warn',
          error: serializeErrorForLog(error)
        });
      }
    }

    if (projectName && projectName !== 'unknown' && typeof buildPerformanceSummary === 'function') {
      try {
        metrics = sanitizeValue(buildPerformanceSummary(projectName));
      } catch (error) {
        logs.push({
          component: 'metrics',
          level: 'warn',
          error: serializeErrorForLog(error)
        });
      }
    }

    return {
      events,
      logs,
      metrics,
      audit: sanitizeValue(asObject(input.auditEntry, baseline.audit))
    };
  }

  function collectDecisionTrace(input = {}) {
    return {
      registry_signal: sanitizeValue(asObject(input.registrySignal)),
      ai_score: sanitizeValue({
        mode: input.mode || null,
        source: 'ai-decision-layer'
      }),
      orchestrator_decision: sanitizeValue({
        assigned_agent: input.assignedAgent || null,
        authority: 'orchestrator',
        policy: input.decisionPolicy || null
      })
    };
  }

  function collectLearningSnapshot(input = {}) {
    const projectName = String(input.projectName || '').trim();
    const updates = asArray(input.learningUpdates)
      .slice(0, 25)
      .map((item) => sanitizeValue(item));

    let patterns = [];
    const signals = [];

    if (projectName && projectName !== 'unknown' && typeof readLearningStore === 'function') {
      try {
        const store = readLearningStore(projectName);
        patterns = asArray(store && store.patterns).slice(0, 50).map((item) => sanitizeValue(item));
      } catch (error) {
        signals.push({
          source: 'learning-store',
          status: 'error',
          error: serializeErrorForLog(error)
        });
      }
    }

    if (projectName && projectName !== 'unknown' && typeof readRecommendationsStore === 'function') {
      try {
        const recommendations = readRecommendationsStore(projectName);
        if (recommendations && recommendations.latest) {
          signals.push({
            source: 'recommendation-runtime',
            status: 'ok',
            latest: sanitizeValue(recommendations.latest)
          });
        }
      } catch (error) {
        signals.push({
          source: 'recommendation-runtime',
          status: 'error',
          error: serializeErrorForLog(error)
        });
      }
    }

    if (projectName && projectName !== 'unknown' && typeof buildLearningPayload === 'function') {
      try {
        const learningPayload = buildLearningPayload(projectName);
        signals.push({
          source: 'learning-engine',
          status: 'ok',
          generated_at: learningPayload && learningPayload.generated_at ? learningPayload.generated_at : null,
          recommendation_count: Array.isArray(learningPayload && learningPayload.recommendations)
            ? learningPayload.recommendations.length
            : 0
        });
      } catch (error) {
        signals.push({
          source: 'learning-engine',
          status: 'error',
          error: serializeErrorForLog(error)
        });
      }
    }

    return {
      patterns,
      updates,
      signals: sanitizeValue(signals)
    };
  }

  function collectUnifiedSnapshot(input = {}) {
    const base = emptyKernelContract();

    try {
      return {
        observability: collectObservability(input),
        decision_trace: collectDecisionTrace(input),
        learning_snapshot: collectLearningSnapshot(input)
      };
    } catch (error) {
      if (logger && typeof logger.warn === 'function') {
        logger.warn('control_plane_kernel_collect_failed', {
          route: input.route || '/unknown',
          action: 'collect_unified_snapshot',
          error: serializeErrorForLog(error)
        });
      }
      return base;
    }
  }

  return {
    collectObservability,
    collectDecisionTrace,
    collectLearningSnapshot,
    collectUnifiedSnapshot,
    emptyKernelContract
  };
}

module.exports = {
  createControlPlaneKernel,
  emptyKernelContract
};