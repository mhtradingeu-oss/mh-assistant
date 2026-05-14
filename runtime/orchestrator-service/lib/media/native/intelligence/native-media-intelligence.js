'use strict';

const { buildNativeMediaBrief, buildGenerationPrompt } = require('./media-prompt-intelligence');
const { scoreNativeMediaPlan } = require('./media-quality-scorer');
const { loadNativeMediaKnowledge } = require('./media-knowledge-loader');

function createNativeMediaIntelligence() {
  function prepare(input = {}) {
    const knowledge = loadNativeMediaKnowledge();
    const generated = buildGenerationPrompt(input);
    const quality = scoreNativeMediaPlan({
      ...generated.brief,
      prompt: generated.prompt
    });

    return {
      knowledge_version: {
        brand_video_style: knowledge.brandVideoStyleGuide?.version || 'unknown',
        brand_voice_audio: knowledge.brandVoiceAudioGuide?.version || 'unknown'
      },
      brief: generated.brief,
      prompt: generated.prompt,
      quality,
      ready_for_runtime: quality.score >= 65,
      prepared_at: new Date().toISOString()
    };
  }

  return {
    id: 'native-media-intelligence',
    prepare
  };
}

module.exports = {
  createNativeMediaIntelligence
};
