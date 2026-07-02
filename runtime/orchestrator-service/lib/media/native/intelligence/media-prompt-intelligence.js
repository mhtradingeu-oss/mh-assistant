'use strict';

const { loadNativeMediaKnowledge } = require('./media-knowledge-loader');

function asText(value, fallback = '') {
  return String(value == null ? fallback : value).trim();
}

function pickPlatformRules(knowledge, platform) {
  const key = asText(platform, 'instagram').toLowerCase();
  return knowledge.platformVideoRules?.platforms?.[key] || knowledge.platformVideoRules?.platforms?.instagram || {};
}

function pickShotPattern(knowledge, intent) {
  const patterns = Array.isArray(knowledge.videoShotPatterns?.patterns) ? knowledge.videoShotPatterns.patterns : [];
  const normalizedIntent = asText(intent).toLowerCase();

  return patterns.find(pattern =>
    Array.isArray(pattern.best_for) &&
    pattern.best_for.some(item => normalizedIntent.includes(String(item).toLowerCase()))
  ) || patterns[0] || null;
}

function pickHook(knowledge, intent) {
  const hooks = Array.isArray(knowledge.winningHooksLibrary?.hooks) ? knowledge.winningHooksLibrary.hooks : [];
  const normalizedIntent = asText(intent).toLowerCase();

  return hooks.find(hook =>
    Array.isArray(hook.best_for) &&
    hook.best_for.some(item => normalizedIntent.includes(String(item).toLowerCase()))
  ) || hooks[0] || null;
}

function buildNativeMediaBrief(input = {}) {
  const knowledge = loadNativeMediaKnowledge();
  const mediaType = asText(input.media_type || input.type, 'video').toLowerCase();
  const platform = asText(input.platform || input.channel, 'instagram').toLowerCase();
  const productName = asText(input.product_name || input.product, 'the product');
  const campaignGoal = asText(input.goal || input.intent, 'premium product promotion');
  const audience = asText(input.audience, 'German-market customers');
  const brandVoice = asText(input.brand_voice || input.tone, 'premium, clear, trustworthy');
  const platformRules = pickPlatformRules(knowledge, platform);
  const shotPattern = pickShotPattern(knowledge, campaignGoal);
  const hook = pickHook(knowledge, campaignGoal);

  const beats = Array.isArray(shotPattern?.beats) ? shotPattern.beats : [
    'hook',
    'product reveal',
    'usage moment',
    'benefit',
    'CTA'
  ];

  return {
    media_type: mediaType,
    platform,
    product_name: productName,
    campaign_goal: campaignGoal,
    audience,
    brand_voice: brandVoice,
    recommended_format: platformRules.format || '9:16',
    recommended_duration: platformRules.duration || '15-30s',
    hook: hook?.pattern || `Show why ${productName} matters in a premium routine.`,
    shot_pattern_id: shotPattern?.id || 'custom',
    scene_beats: beats,
    creative_direction: {
      visual_style: knowledge.brandVideoStyleGuide?.visual_style || {},
      product_rules: knowledge.productVisualRules?.rules || {},
      platform_priority: platformRules.priority || [],
      platform_notes: platformRules.notes || ''
    },
    audio_direction: knowledge.brandVoiceAudioGuide?.voice_style || {},
    compliance_avoid: [
      ...(knowledge.brandVideoStyleGuide?.avoid || []),
      ...(knowledge.brandVoiceAudioGuide?.avoid || [])
    ],
    generated_at: new Date().toISOString()
  };
}

function buildGenerationPrompt(input = {}) {
  const brief = buildNativeMediaBrief(input);

  const lines = [
    `Media type: ${brief.media_type}`,
    `Platform: ${brief.platform}`,
    `Product: ${brief.product_name}`,
    `Goal: ${brief.campaign_goal}`,
    `Audience: ${brief.audience}`,
    `Brand voice: ${brief.brand_voice}`,
    `Format: ${brief.recommended_format}`,
    `Duration: ${brief.recommended_duration}`,
    `Hook: ${brief.hook}`,
    `Scene beats: ${brief.scene_beats.join(' -> ')}`,
    `Visual style: ${JSON.stringify(brief.creative_direction.visual_style)}`,
    `Product rules: ${JSON.stringify(brief.creative_direction.product_rules)}`,
    `Platform priorities: ${brief.creative_direction.platform_priority.join(', ')}`,
    `Avoid: ${brief.compliance_avoid.join(', ')}`
  ];

  return {
    brief,
    prompt: lines.join('\n')
  };
}

module.exports = {
  buildNativeMediaBrief,
  buildGenerationPrompt
};
