function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function firstNonEmpty(...values) {
  return values.map(asString).find(Boolean) || '';
}

function pick(obj = {}, keys = []) {
  const source = asObject(obj);
  const result = {};

  keys.forEach(key => {
    if (source[key] != null && source[key] !== '') {
      result[key] = source[key];
    }
  });

  return result;
}

function requireFields(container, fields = [], label = 'fields') {
  const values = asObject(container);
  const missing = fields.filter(field => !asString(values[field]));

  if (missing.length) {
    const prefix = label === 'fields' ? 'Missing required' : `Missing required ${label}`;
    throw new Error(`${prefix}: ${missing.join(', ')}`);
  }
}

function buildResult({
  status = 'connected',
  metadata = {},
  health = '',
  normalized = {},
  notes = '',
  tokenExpiresAt = '',
  syncSummary = {},
  permissionScope = '',
  dataScopes = [],
  readScopes = [],
  writeScopes = [],
  connectionMethod = '',
  account = {}
} = {}) {
  return {
    status,
    metadata,
    health,
    normalized,
    notes,
    token_expires_at: tokenExpiresAt,
    sync_summary: syncSummary,
    permission_scope: permissionScope,
    data_scopes: dataScopes,
    read_scopes: readScopes,
    write_scopes: writeScopes,
    connection_method: connectionMethod,
    account
  };
}

module.exports = {
  asObject,
  asArray,
  asString,
  firstNonEmpty,
  pick,
  requireFields,
  buildResult
};
