const axios = require('axios');

const PROVIDER_NOT_CONFIGURED_MESSAGE = 'Generator backend not connected yet — prompt/job is ready.';

function asString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function asObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function firstText(...values) {
  for (const value of values) {
    const text = asString(value);
    if (text) return text;
  }
  return '';
}

function providerNotConfigured() {
  return {
    ok: false,
    status: 'provider_not_configured',
    message: PROVIDER_NOT_CONFIGURED_MESSAGE
  };
}

function extractMessageContent(message) {
  if (typeof message === 'string') return message;
  if (!Array.isArray(message)) return '';

  return message
    .map((part) => {
      if (typeof part === 'string') return part;
      if (part && typeof part === 'object') {
        return asString(part.text || part.content || part.output_text);
      }
      return '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();
}

function safeJsonParse(text, fallback = {}) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function normalizeOpenAiError(error, fallbackMessage) {
  const statusCode = Number(error?.response?.status) || 502;
  const providerMessage =
    asString(error?.response?.data?.error?.message) ||
    asString(error?.message) ||
    fallbackMessage;

  const wrapped = new Error(providerMessage || fallbackMessage);
  wrapped.statusCode = statusCode;
  wrapped.code = 'MEDIA_PROVIDER_FAILED';
  wrapped.provider = 'openai';
  return wrapped;
}

function createMediaProviderLayer(options = {}) {
  const env = asObject(options.env) || process.env;
  const http = options.axios || axios;

  const openAiApiKey = firstText(env.OPENAI_API_KEY, env.MH_OPENAI_API_KEY);
  const openAiBaseUrl = firstText(env.OPENAI_BASE_URL, 'https://api.openai.com/v1').replace(/\/+$/, '');

  const textModel = firstText(env.MEDIA_TEXT_MODEL, env.OPENAI_MODEL, 'gpt-4.1-mini');
  const imageModel = firstText(env.MEDIA_IMAGE_MODEL, 'gpt-image-1');

  const imageProvider = firstText(env.MEDIA_IMAGE_PROVIDER, 'openai').toLowerCase();
  const videoProvider = firstText(env.MEDIA_VIDEO_PROVIDER, 'none').toLowerCase();
  const voiceProvider = firstText(env.MEDIA_VOICE_PROVIDER, 'openai').toLowerCase();
  const promptProvider = firstText(env.MEDIA_PROMPT_PROVIDER, 'openai').toLowerCase();
  const brandCheckProvider = firstText(env.MEDIA_BRAND_CHECK_PROVIDER, 'openai').toLowerCase();

  const runwayApiKey = asString(env.RUNWAY_API_KEY);
  const elevenLabsApiKey = asString(env.ELEVENLABS_API_KEY);

  const openAiConfigured = Boolean(openAiApiKey);

  const availability = {
    imageProvider: {
      id: imageProvider,
      configured: imageProvider === 'openai' ? openAiConfigured : false
    },
    videoProvider: {
      id: videoProvider,
      configured: videoProvider === 'runway' ? Boolean(runwayApiKey) : openAiConfigured
    },
    voiceProvider: {
      id: voiceProvider,
      configured: voiceProvider === 'elevenlabs' ? Boolean(elevenLabsApiKey) : openAiConfigured
    },
    promptProvider: {
      id: promptProvider,
      configured: promptProvider === 'openai' ? openAiConfigured : false
    },
    brandCheckProvider: {
      id: brandCheckProvider,
      configured: brandCheckProvider === 'openai' ? openAiConfigured : false
    }
  };

  async function requestOpenAiText({ systemPrompt, userPrompt, temperature = 0.3, maxTokens = 900 }) {
    if (!openAiConfigured) {
      return providerNotConfigured();
    }

    try {
      const response = await http.post(
        `${openAiBaseUrl}/chat/completions`,
        {
          model: textModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature,
          max_tokens: maxTokens
        },
        {
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = extractMessageContent(response?.data?.choices?.[0]?.message?.content);
      return {
        ok: true,
        status: 'ok',
        provider: 'openai',
        model: textModel,
        text
      };
    } catch (error) {
      throw normalizeOpenAiError(error, 'OpenAI text generation failed');
    }
  }

  async function improvePrompt(payload = {}) {
    const basePrompt = asString(payload.prompt);
    if (!basePrompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    const result = await requestOpenAiText({
      systemPrompt: 'You are an expert media prompt engineer. Return only improved prompt text with practical constraints and no markdown.',
      userPrompt: [
        `Mode: ${firstText(payload.mode, 'media')}`,
        `Objective: ${firstText(payload.objective, 'Create publishable media')}`,
        `Brand style: ${firstText(payload.brandStyle, 'Brand-safe and premium')}`,
        `Channel: ${firstText(payload.channel, 'general')}`,
        '',
        'Original prompt:',
        basePrompt,
        '',
        'Improve this prompt for quality, clarity, and production constraints while keeping brand-safe wording.'
      ].join('\n')
    });

    if (!result.ok) {
      return result;
    }

    return {
      ok: true,
      status: 'ok',
      provider: result.provider,
      model: result.model,
      improved_prompt: asString(result.text)
    };
  }

  async function brandCheck(payload = {}) {
    const prompt = asString(payload.prompt);
    if (!prompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    const result = await requestOpenAiText({
      systemPrompt: 'You are a strict brand and publishing safety reviewer. Return valid JSON only.',
      userPrompt: [
        'Audit this media prompt and return JSON with fields:',
        '{',
        '  "is_brand_safe": boolean,',
        '  "risk_level": "low"|"medium"|"high",',
        '  "issues": string[],',
        '  "recommendations": string[]',
        '}',
        '',
        `Brand style: ${firstText(payload.brandStyle, 'Not provided')}`,
        `Channel: ${firstText(payload.channel, 'Not provided')}`,
        `Market: ${firstText(payload.market, 'general')}`,
        '',
        'Prompt:',
        prompt
      ].join('\n'),
      temperature: 0.2,
      maxTokens: 700
    });

    if (!result.ok) {
      return result;
    }

    const parsed = safeJsonParse(result.text, {
      is_brand_safe: false,
      risk_level: 'medium',
      issues: ['Unable to parse structured brand check output.'],
      recommendations: ['Review prompt wording manually.']
    });

    return {
      ok: true,
      status: 'ok',
      provider: result.provider,
      model: result.model,
      brand_check: {
        is_brand_safe: Boolean(parsed.is_brand_safe),
        risk_level: firstText(parsed.risk_level, 'medium'),
        issues: Array.isArray(parsed.issues) ? parsed.issues.map((item) => asString(item)).filter(Boolean) : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.map((item) => asString(item)).filter(Boolean)
          : []
      }
    };
  }

  async function generateImage(payload = {}) {
    const prompt = asString(payload.prompt);
    if (!prompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    if (!availability.imageProvider.configured) {
      return providerNotConfigured();
    }

    try {
      const response = await http.post(
        `${openAiBaseUrl}/images/generations`,
        {
          model: imageModel,
          prompt,
          size: firstText(payload.size, '1024x1024')
        },
        {
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const images = Array.isArray(response?.data?.data)
        ? response.data.data.map((entry, index) => ({
          id: `image_${index + 1}`,
          url: asString(entry?.url),
          b64_json: asString(entry?.b64_json),
          revised_prompt: asString(entry?.revised_prompt)
        }))
        : [];

      return {
        ok: true,
        status: 'ok',
        provider: 'openai',
        model: imageModel,
        images
      };
    } catch (error) {
      throw normalizeOpenAiError(error, 'OpenAI image generation failed');
    }
  }

  async function generateVideoBrief(payload = {}) {
    const prompt = asString(payload.prompt);
    if (!prompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    if (!availability.videoProvider.configured) {
      return providerNotConfigured();
    }

    const result = await requestOpenAiText({
      systemPrompt: 'You are a short-form video strategist. Return practical production brief text only.',
      userPrompt: [
        `Channel: ${firstText(payload.channel, 'short-form')}`,
        `Format: ${firstText(payload.format, '9:16')}`,
        `Objective: ${firstText(payload.objective, 'Drive conversions')}`,
        '',
        'Input prompt:',
        prompt,
        '',
        'Create a concise video brief with hook, scene beats, shot notes, pacing, and CTA.'
      ].join('\n')
    });

    if (!result.ok) {
      return result;
    }

    return {
      ok: true,
      status: 'ok',
      provider: result.provider,
      model: result.model,
      video_brief: asString(result.text)
    };
  }

  async function generateVoiceScript(payload = {}) {
    const prompt = asString(payload.prompt);
    if (!prompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    if (!availability.voiceProvider.configured) {
      return providerNotConfigured();
    }

    const result = await requestOpenAiText({
      systemPrompt: 'You are a voice director. Return only a voiceover script with scene timing markers.',
      userPrompt: [
        `Language: ${firstText(payload.language, 'German')}`,
        `Tone: ${firstText(payload.tone, payload.brandStyle, 'clear and premium')}`,
        `Format: ${firstText(payload.format, 'short-form video voiceover')}`,
        '',
        'Input prompt or video brief:',
        prompt,
        '',
        'Generate a usable voice script with hook, timed beats, and close CTA.'
      ].join('\n')
    });

    if (!result.ok) {
      return result;
    }

    return {
      ok: true,
      status: 'ok',
      provider: result.provider,
      model: result.model,
      voice_script: asString(result.text)
    };
  }

  async function generateCampaignPack(payload = {}) {
    const prompt = asString(payload.prompt);
    if (!prompt) {
      const err = new Error('prompt is required');
      err.statusCode = 400;
      err.code = 'PROMPT_REQUIRED';
      throw err;
    }

    if (!availability.promptProvider.configured) {
      return providerNotConfigured();
    }

    const result = await requestOpenAiText({
      systemPrompt: 'You generate campaign media packs. Return valid JSON only.',
      userPrompt: [
        'Return JSON with keys: image_prompt, video_brief, voice_script, channel_notes, publishing_notes.',
        `Objective: ${firstText(payload.objective, 'Create a complete campaign media pack')}`,
        `Channel: ${firstText(payload.channel, 'multi-channel')}`,
        `Brand style: ${firstText(payload.brandStyle, 'brand-safe')}`,
        '',
        'Base prompt:',
        prompt
      ].join('\n'),
      temperature: 0.2,
      maxTokens: 1200
    });

    if (!result.ok) {
      return result;
    }

    const parsed = safeJsonParse(result.text, {});

    return {
      ok: true,
      status: 'ok',
      provider: result.provider,
      model: result.model,
      campaign_pack: {
        image_prompt: asString(parsed.image_prompt),
        video_brief: asString(parsed.video_brief),
        voice_script: asString(parsed.voice_script),
        channel_notes: asString(parsed.channel_notes),
        publishing_notes: asString(parsed.publishing_notes)
      }
    };
  }

  return {
    availability,
    providerNotConfigured,
    improvePrompt,
    brandCheck,
    generateImage,
    generateVideoBrief,
    generateVoiceScript,
    generateCampaignPack
  };
}

module.exports = {
  createMediaProviderLayer,
  PROVIDER_NOT_CONFIGURED_MESSAGE
};
