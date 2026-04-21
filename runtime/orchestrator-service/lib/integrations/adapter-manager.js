const { getProviderAdapter } = require('./provider-registry');
const { appendIntegrationAudit } = require('./audit-log');
const { appendIntegrationSyncHistory, writeIntegrationSnapshot } = require('./sync-history');
const { buildProviderError } = require('./http-client');
const { buildHealthState } = require('./health-manager');
const { buildInsightsReadyContract } = require('./insights-contract');

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function normalizeProviderResult(result = {}, fallbackStatus = 'connected') {
  const normalized = {
    status: asString(result.status || fallbackStatus).toLowerCase() || fallbackStatus,
    metadata: asObject(result.metadata),
    normalized: asObject(result.normalized),
    notes: asString(result.notes),
    health: asString(result.health),
    token_expires_at: asString(result.token_expires_at),
    sync_summary: asObject(result.sync_summary),
    permission_scope: asString(result.permission_scope),
    data_scopes: Array.isArray(result.data_scopes) ? result.data_scopes : [],
    read_scopes: Array.isArray(result.read_scopes) ? result.read_scopes : [],
    write_scopes: Array.isArray(result.write_scopes) ? result.write_scopes : [],
    connection_method: asString(result.connection_method),
    account: asObject(result.account)
  };

  return {
    ...normalized,
    health_state: buildHealthState({
      status: normalized.status,
      last_error: '',
      health_summary: normalized.health
    })
  };
}

async function executeAdapterAction({
  projectName,
  integrationId,
  projectPaths,
  record,
  config,
  credentials,
  primaryValue,
  actionType
}) {
  const adapter = getProviderAdapter(integrationId);
  if (!adapter) {
    throw new Error(`No provider adapter registered for ${integrationId}`);
  }

  const actionName =
    actionType === 'connect' || actionType === 'reconnect'
      ? 'connect'
      : actionType === 'test'
        ? 'testConnection'
        : actionType === 'sync'
          ? 'syncCurrent'
          : actionType === 'import-history'
            ? 'importHistory'
            : '';

  if (!actionName || typeof adapter[actionName] !== 'function') {
    throw new Error(`Provider adapter for ${integrationId} does not support ${actionType}`);
  }

  const ctx = {
    projectName,
    integrationId,
    projectPaths,
    record,
    config,
    credentials,
    primaryValue
  };

  try {
    const providerResult = normalizeProviderResult(await adapter[actionName](ctx));
    const now = new Date().toISOString();
    const insightsReady = buildInsightsReadyContract({
      projectName,
      integrationId,
      record: {
        ...record,
        data_scopes: providerResult.data_scopes,
        read_scopes: providerResult.read_scopes,
        write_scopes: providerResult.write_scopes
      },
      providerResult,
      generatedAt: now
    });

    appendIntegrationAudit(projectPaths, {
      at: now,
      project: projectName,
      integration_id: integrationId,
      action: actionType,
      status: providerResult.status,
      health_state: providerResult.health_state?.state || '',
      note: providerResult.notes
    });

    if (actionType === 'sync' || actionType === 'import-history') {
      appendIntegrationSyncHistory(projectPaths, {
        at: now,
        project: projectName,
        integration_id: integrationId,
        action: actionType,
        status: providerResult.status,
        health_state: providerResult.health_state?.state || '',
        summary: providerResult.sync_summary,
        domain: insightsReady.domain,
        provider: insightsReady.provider
      });
      writeIntegrationSnapshot(projectPaths, integrationId, {
        generated_at: now,
        project: projectName,
        integration_id: integrationId,
        action: actionType,
        normalized: providerResult.normalized,
        metadata: providerResult.metadata,
        insights_ready: insightsReady
      });
    }

    return {
      ...providerResult,
      insights_ready: insightsReady
    };
  } catch (error) {
    const providerError = buildProviderError(integrationId, error, `Failed to ${actionType} ${integrationId}`);

    appendIntegrationAudit(projectPaths, {
      at: new Date().toISOString(),
      project: projectName,
      integration_id: integrationId,
      action: actionType,
      status: providerError.status,
      health_state: providerError.status,
      note: providerError.message
    });

    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  executeAdapterAction
};
