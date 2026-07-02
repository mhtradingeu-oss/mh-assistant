function asString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.round(parsed);
}

function createProviderConfigError(message, details = {}) {
  const error = new Error(String(message || 'AI provider configuration is invalid'));
  error.code = details.code || 'AI_PROVIDER_CONFIG_INVALID';
  error.statusCode = Number(details.statusCode) || 503;
  error.details = details;
  return error;
}

const AI_MODE_PROMPTS = {
  executive: {
    label: 'Executive',
    purpose: 'strategic decisions, blockers, priorities, and next best action',
    outputType: 'executive_brief',
    prompt: [
      'You are the Executive mode for MH Assistant OS.',
      'Make strategic decisions, identify blockers, rank priorities, and state the next best action.',
      'Do not drift into generic marketing copy unless the command asks for it.'
    ].join(' ')
  },
  campaign: {
    label: 'Campaign Strategist',
    purpose: 'campaign concepts, launch plans, channel mix, audience segments, and offer strategy',
    outputType: 'campaign_package',
    prompt: [
      'You are the Campaign Strategist mode for MH Assistant OS.',
      'Build campaign concepts, launch plans, channel mix, audience segments, offer strategy, launch phases, assets, blockers, and handoffs.',
      'When the command asks to build, launch, or plan a campaign, return a complete campaign package.'
    ].join(' ')
  },
  content: {
    label: 'Content Creator',
    purpose: 'captions, hooks, scripts, post ideas, email copy, and landing page sections',
    outputType: 'content_pack',
    prompt: [
      'You are the Content Creator mode for MH Assistant OS.',
      'Produce direct content outputs: captions, hooks, scripts, post ideas, emails, and landing page sections.',
      'Avoid operational summaries when the user asked for copy.'
    ].join(' ')
  },
  ads: {
    label: 'Ads Specialist',
    purpose: 'ad concepts, paid media strategy, budget split, targeting angles, and platform ad copy',
    outputType: 'ad_ideas',
    prompt: [
      'You are the Ads Specialist mode for MH Assistant OS.',
      'Produce ad ideas, paid strategy, targeting angles, budget guidance, and Meta, TikTok, Google, or Facebook ad copy.',
      'When asked for ad ideas or ad copy, return 3 to 5 concrete ad ideas with hook, primary text, headline, CTA, audience segment, emotional trigger, platform fit, and visual direction.'
    ].join(' ')
  },
  seo: {
    label: 'SEO Specialist',
    purpose: 'keywords, blog topics, landing page SEO, search intent, and meta title or description',
    outputType: 'seo_plan',
    prompt: [
      'You are the SEO Specialist mode for MH Assistant OS.',
      'Produce keyword plans, blog topics, landing page SEO, search intent mapping, and metadata.',
      'Tie search recommendations to the market, audience, and offer context.'
    ].join(' ')
  },
  research: {
    label: 'Research Analyst',
    purpose: 'competitor analysis, market trends, audience research, and positioning gaps',
    outputType: 'research_report',
    prompt: [
      'You are the Research Analyst mode for MH Assistant OS.',
      'Produce competitor analysis, market trends, audience research, positioning gaps, and evidence needs.',
      'Separate known context from assumptions.'
    ].join(' ')
  },
  operations: {
    label: 'Operations Planner',
    purpose: 'tasks, timelines, handoffs, approvals, and execution planning',
    outputType: 'operations_plan',
    prompt: [
      'You are the Operations Planner mode for MH Assistant OS.',
      'Produce task plans, timelines, handoffs, approvals, ownership, and execution plans.',
      'Make work routable into the correct MH Assistant OS workspace.'
    ].join(' ')
  }
};

function normalizeAiModeId(value) {
  const clean = asString(value).toLowerCase().replace(/[\s-]+/g, '_');
  const aliases = {
    campaign_strategist: 'campaign',
    content_creator: 'content',
    ads_specialist: 'ads',
    seo_specialist: 'seo',
    research_analyst: 'research',
    operations_planner: 'operations'
  };
  return aliases[clean] || clean || 'executive';
}

function getAiModePrompt(modeId) {
  const normalized = normalizeAiModeId(modeId);
  return AI_MODE_PROMPTS[normalized] || AI_MODE_PROMPTS.executive;
}

function resolveAiProviderConfig(env = process.env) {
  const provider = asString(env.MH_AI_PROVIDER || env.AI_PROVIDER || 'openai').toLowerCase();
  const model = asString(env.MH_AI_MODEL || env.OPENAI_MODEL || 'gpt-4.1-mini');
  const apiKey = asString(env.OPENAI_API_KEY || env.MH_OPENAI_API_KEY || env.AI_PROVIDER_API_KEY);
  const baseUrl = asString(env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const timeoutMs = toPositiveInt(env.MH_AI_TIMEOUT_MS || env.OPENAI_TIMEOUT_MS, 30000);

  return {
    provider,
    model,
    apiKey,
    baseUrl,
    timeoutMs,
    isConfigured: Boolean(apiKey)
  };
}

function assertAiProviderConfig(config = {}) {
  const provider = asString(config.provider).toLowerCase();

  if (!provider) {
    throw createProviderConfigError('AI provider is not configured', {
      code: 'AI_PROVIDER_MISSING',
      statusCode: 503
    });
  }

  if (provider === 'openai' && !asString(config.apiKey)) {
    throw createProviderConfigError('OPENAI_API_KEY is missing for AI command execution', {
      code: 'OPENAI_API_KEY_MISSING',
      statusCode: 503,
      provider
    });
  }

  return config;
}

module.exports = {
  resolveAiProviderConfig,
  assertAiProviderConfig,
  createProviderConfigError,
  AI_MODE_PROMPTS,
  getAiModePrompt,
  normalizeAiModeId
};
