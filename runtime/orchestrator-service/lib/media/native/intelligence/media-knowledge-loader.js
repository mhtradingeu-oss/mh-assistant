'use strict';

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');

function readJsonSafe(fileName, fallback = {}) {
  try {
    const filePath = path.join(KNOWLEDGE_DIR, fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_error) {
    return fallback;
  }
}

function loadNativeMediaKnowledge() {
  return {
    brandVideoStyleGuide: readJsonSafe('brand-video-style-guide.json'),
    brandVoiceAudioGuide: readJsonSafe('brand-voice-audio-guide.json'),
    videoShotPatterns: readJsonSafe('video-shot-patterns.json', { patterns: [] }),
    platformVideoRules: readJsonSafe('platform-video-rules.json', { platforms: {} }),
    winningHooksLibrary: readJsonSafe('winning-hooks-library.json', { hooks: [] }),
    voiceToneProfiles: readJsonSafe('voice-tone-profiles.json', { profiles: {} }),
    productVisualRules: readJsonSafe('product-visual-rules.json', { rules: {} })
  };
}

module.exports = {
  loadNativeMediaKnowledge
};
