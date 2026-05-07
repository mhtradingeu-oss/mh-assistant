'use strict';

function createPerformanceStorage(deps = {}) {
  const {
    getIntelligencePaths,
    readJsonFile,
    writeJsonFile
  } = deps;

  function readPerformanceStore(projectName) {
    const paths = getIntelligencePaths(projectName);
    const payload = readJsonFile(paths.performancePath, {
      version: 1,
      project: paths.project,
      records: []
    });

    if (!payload || typeof payload !== 'object') {
      return {
        version: 1,
        project: paths.project,
        updated_at: new Date().toISOString(),
        records: []
      };
    }

    return {
      version: 1,
      project: paths.project,
      updated_at: String(payload.updated_at || '').trim() || null,
      records: Array.isArray(payload.records) ? payload.records : []
    };
  }

  function writePerformanceStore(projectName, store) {
    const paths = getIntelligencePaths(projectName);
    const payload = {
      version: 1,
      project: paths.project,
      updated_at: new Date().toISOString(),
      records: Array.isArray(store?.records) ? store.records : []
    };
    writeJsonFile(paths.performancePath, payload);
    return payload;
  }

  function readLearningStore(projectName) {
    const paths = getIntelligencePaths(projectName);
    const payload = readJsonFile(paths.learningPath, {
      version: 1,
      project: paths.project,
      patterns: [],
      history: []
    });

    return {
      version: 1,
      project: paths.project,
      updated_at: String(payload?.updated_at || '').trim() || null,
      patterns: Array.isArray(payload?.patterns) ? payload.patterns : [],
      history: Array.isArray(payload?.history) ? payload.history : []
    };
  }

  function writeLearningStore(projectName, store) {
    const paths = getIntelligencePaths(projectName);
    const payload = {
      version: 1,
      project: paths.project,
      updated_at: new Date().toISOString(),
      patterns: Array.isArray(store?.patterns) ? store.patterns : [],
      history: Array.isArray(store?.history) ? store.history : []
    };
    writeJsonFile(paths.learningPath, payload);
    return payload;
  }

  function readRecommendationsStore(projectName) {
    const paths = getIntelligencePaths(projectName);
    const payload = readJsonFile(paths.recommendationsPath, {
      version: 1,
      project: paths.project,
      latest: null,
      history: []
    });

    return {
      version: 1,
      project: paths.project,
      updated_at: String(payload?.updated_at || '').trim() || null,
      latest: payload?.latest && typeof payload.latest === 'object' ? payload.latest : null,
      history: Array.isArray(payload?.history) ? payload.history : []
    };
  }

  function writeRecommendationsStore(projectName, store) {
    const paths = getIntelligencePaths(projectName);
    const payload = {
      version: 1,
      project: paths.project,
      updated_at: new Date().toISOString(),
      latest: store?.latest && typeof store.latest === 'object' ? store.latest : null,
      history: Array.isArray(store?.history) ? store.history : []
    };
    writeJsonFile(paths.recommendationsPath, payload);
    return payload;
  }

  return {
    readPerformanceStore,
    writePerformanceStore,
    readLearningStore,
    writeLearningStore,
    readRecommendationsStore,
    writeRecommendationsStore
  };
}

module.exports = {
  createPerformanceStorage
};
