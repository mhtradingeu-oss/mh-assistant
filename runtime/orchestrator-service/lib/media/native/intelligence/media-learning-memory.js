'use strict';

function createMediaLearningMemory() {
  const entries = [];

  function record(entry = {}) {
    const item = {
      id: entry.id || `media_learning_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      media_type: String(entry.media_type || entry.type || ''),
      platform: String(entry.platform || ''),
      prompt_hash: String(entry.prompt_hash || ''),
      performance: entry.performance || null,
      lesson: String(entry.lesson || ''),
      created_at: new Date().toISOString()
    };

    entries.push(item);
    return item;
  }

  function list() {
    return entries.slice();
  }

  function summarize() {
    return {
      total_entries: entries.length,
      platforms: Array.from(new Set(entries.map(item => item.platform).filter(Boolean))),
      media_types: Array.from(new Set(entries.map(item => item.media_type).filter(Boolean))),
      latest: entries.slice(-5)
    };
  }

  return {
    record,
    list,
    summarize
  };
}

module.exports = {
  createMediaLearningMemory
};
