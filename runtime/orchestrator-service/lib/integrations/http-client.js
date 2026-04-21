const axios = require('axios');

function normalizeText(value) {
  return String(value == null ? '' : value).trim();
}

function decodeJwtExpiry(token) {
  const raw = normalizeText(token);
  if (!raw || raw.split('.').length < 2) {
    return '';
  }

  try {
    const payload = JSON.parse(Buffer.from(raw.split('.')[1], 'base64url').toString('utf8'));
    if (!payload?.exp) {
      return '';
    }
    return new Date(Number(payload.exp) * 1000).toISOString();
  } catch {
    return '';
  }
}

async function requestJson(config = {}) {
  return axios({
    timeout: 20000,
    validateStatus: () => true,
    ...config
  });
}

function buildProviderError(provider, error, fallbackMessage = 'Provider request failed') {
  if (!error) {
    return {
      message: fallbackMessage,
      status: 'error'
    };
  }

  if (error.response) {
    const body = error.response.data || {};
    const message =
      body?.error?.message ||
      body?.message ||
      body?.error_description ||
      `${fallbackMessage} (${error.response.status})`;
    const status =
      error.response.status === 401
        ? 'token_expired'
        : error.response.status === 403
          ? 'reconnect_required'
          : 'error';

    return {
      provider,
      status,
      http_status: error.response.status,
      message
    };
  }

  return {
    provider,
    status: 'error',
    message: error.message || fallbackMessage
  };
}

function buildResponseError(provider, response, fallbackMessage = 'Provider request failed') {
  if (response.status >= 200 && response.status < 300) {
    return null;
  }

  return buildProviderError(provider, {
    response
  }, fallbackMessage);
}

module.exports = {
  decodeJwtExpiry,
  requestJson,
  buildProviderError,
  buildResponseError
};
