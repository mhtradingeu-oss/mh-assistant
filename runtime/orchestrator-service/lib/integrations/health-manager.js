function normalizeText(value) {
  return String(value == null ? '' : value).trim();
}

function buildHealthState(record = {}) {
  const status = normalizeText(record.status).toLowerCase();
  const lastError = normalizeText(record.last_error);

  if (status === 'connected') {
    return {
      state: 'healthy',
      tone: 'success',
      action_required: 'none',
      summary: normalizeText(record.health_summary) || 'Connection healthy and ready for sync.'
    };
  }

  if (status === 'partial') {
    return {
      state: 'degraded',
      tone: 'warning',
      action_required: 'complete_configuration',
      summary: normalizeText(record.health_summary) || 'Connection is partially configured.'
    };
  }

  if (status === 'token_expired') {
    return {
      state: 'auth_expired',
      tone: 'warning',
      action_required: 'reconnect',
      summary: normalizeText(record.health_summary) || 'Saved token expired and requires reconnect.'
    };
  }

  if (status === 'error') {
    return {
      state: 'failing',
      tone: 'danger',
      action_required: 'investigate',
      summary: lastError || normalizeText(record.health_summary) || 'Provider request failed.'
    };
  }

  return {
    state: 'not_connected',
    tone: 'neutral',
    action_required: 'connect',
    summary: normalizeText(record.health_summary) || 'Integration has not been connected yet.'
  };
}

module.exports = {
  buildHealthState
};
