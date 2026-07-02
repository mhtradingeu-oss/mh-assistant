/*
  Integrations OS Diagnostics

  Pure diagnostic helpers only.
  No rendering.
  No fetch ownership.
  No global mutations.
*/

import {
  asArray,
  asNumber,
  asObject,
  asString
} from "./utils.js";

export function normalizeIntegrationRecord(record = {}) {
  const item = asObject(record);

  return {
    id: asString(item.id || item.key || item.provider),
    provider: asString(item.provider || item.name),
    label: asString(item.label || item.name || item.provider),
    status: normalizeStatus(item.status),
    health_score: clampScore(item.health_score),
    sync_success_rate: clampScore(item.sync_success_rate),
    last_sync_at: asString(item.last_sync_at),
    response_time_ms: asNumber(item.response_time_ms, 0),
    error_count: asNumber(item.error_count, 0),
    warning_count: asNumber(item.warning_count, 0),
    connected: Boolean(item.connected),
    enabled: Boolean(item.enabled),
    diagnostics: asArray(item.diagnostics)
  };
}

export function normalizeStatus(status) {
  const value = asString(status).trim().toLowerCase();

  if (
    [
      "healthy",
      "online",
      "active",
      "connected",
      "ok"
    ].includes(value)
  ) {
    return "healthy";
  }

  if (
    [
      "warning",
      "degraded",
      "partial"
    ].includes(value)
  ) {
    return "warning";
  }

  if (
    [
      "offline",
      "failed",
      "disconnected",
      "error"
    ].includes(value)
  ) {
    return "critical";
  }

  return "unknown";
}

export function clampScore(value) {
  const score = asNumber(value, 0);

  if (score < 0) return 0;
  if (score > 100) return 100;

  return Math.round(score);
}

export function buildDiagnosticsSummary(records = []) {
  const items = asArray(records).map(normalizeIntegrationRecord);

  const summary = {
    total: items.length,
    healthy: 0,
    warning: 0,
    critical: 0,
    unknown: 0,
    connected: 0,
    enabled: 0,
    avg_health_score: 0
  };

  if (!items.length) {
    return summary;
  }

  let totalHealth = 0;

  items.forEach((item) => {
    totalHealth += item.health_score;

    if (item.connected) summary.connected += 1;
    if (item.enabled) summary.enabled += 1;

    switch (item.status) {
      case "healthy":
        summary.healthy += 1;
        break;

      case "warning":
        summary.warning += 1;
        break;

      case "critical":
        summary.critical += 1;
        break;

      default:
        summary.unknown += 1;
        break;
    }
  });

  summary.avg_health_score = Math.round(
    totalHealth / items.length
  );

  return summary;
}

export function detectCriticalProviders(records = []) {
  return asArray(records)
    .map(normalizeIntegrationRecord)
    .filter((item) => item.status === "critical");
}

export function detectSlowProviders(
  records = [],
  threshold = 2500
) {
  return asArray(records)
    .map(normalizeIntegrationRecord)
    .filter(
      (item) => item.response_time_ms >= threshold
    );
}

export function detectSyncFailures(records = []) {
  return asArray(records)
    .map(normalizeIntegrationRecord)
    .filter((item) => item.error_count > 0);
}
