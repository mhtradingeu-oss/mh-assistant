'use strict';

const axios = require('axios');

function createOpenAiProviderAdapter(options = {}) {
  const apiKey = String(
    options.apiKey ||
    process.env.OPENAI_API_KEY ||
    process.env.MH_OPENAI_API_KEY ||
    ''
  ).trim();

  function isConfigured() {
    return Boolean(apiKey);
  }

  async function generateImage(job = {}) {
    if (!isConfigured()) {
      return {
        success: false,
        provider: 'openai',
        status: 'missing_api_key',
        message: 'OPENAI_API_KEY is not configured.'
      };
    }

    const prompt = String(job.prompt || '').trim();

    if (!prompt) {
      return {
        success: false,
        provider: 'openai',
        status: 'missing_prompt',
        message: 'Prompt is required.'
      };
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: String(job.model || job.model_id || 'gpt-image-1'),
          prompt,
          size: String(job.size || '1024x1024')
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: Number(job.timeout_ms || 120000)
        }
      );

      return {
        success: true,
        provider: 'openai',
        media_type: 'image',
        status: 'completed',
        created_at: new Date().toISOString(),
        response: response.data
      };
    } catch (error) {
      return {
        success: false,
        provider: 'openai',
        media_type: 'image',
        status: 'provider_error',
        message: error.message,
        details: error.response?.data || null
      };
    }
  }

  async function createRealtimeVoiceSession() {
    return {
      success: false,
      provider: 'openai',
      media_type: 'voice_chat',
      status: 'not_implemented',
      message: 'Realtime voice execution adapter is registered but not implemented yet.'
    };
  }

  return {
    provider: 'openai',
    isConfigured,
    generateImage,
    createRealtimeVoiceSession
  };
}

module.exports = {
  createOpenAiProviderAdapter
};
