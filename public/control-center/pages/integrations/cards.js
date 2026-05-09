/*
  Integrations OS Cards

  Pure render-string helpers only.
  No DOM binding.
  No fetch ownership.
  No global state.
*/

import {
  asString,
  formatRelativeTime,
  formatStatusLabel
} from "./utils.js";

import {
  normalizeIntegrationRecord
} from "./diagnostics.js";

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderIntegrationStatusBadge(status) {
  const normalized = asString(status || "unknown").toLowerCase();
  const label = formatStatusLabel(normalized);

  return `
    <span class="integration-status-badge is-${esc(normalized)}">
      ${esc(label)}
    </span>
  `;
}

export function renderIntegrationMetric(label, value, tone = "neutral") {
  return `
    <span class="integration-card-metric is-${esc(tone)}">
      <small>${esc(label)}</small>
      <strong>${esc(value)}</strong>
    </span>
  `;
}

export function renderIntegrationStatusCard(record = {}) {
  const item = normalizeIntegrationRecord(record);

  const healthTone =
    item.health_score >= 80
      ? "success"
      : item.health_score >= 50
        ? "warning"
        : "danger";

  return `
    <article
      class="integration-os-card is-${esc(item.status)}"
      data-integration-card="${esc(item.id)}"
    >
      <header class="integration-os-card-head">
        <div>
          <span class="integration-card-provider">
            ${esc(item.provider || "Provider")}
          </span>
          <h3>${esc(item.label || item.id || "Integration")}</h3>
        </div>

        ${renderIntegrationStatusBadge(item.status)}
      </header>

      <div class="integration-card-metrics">
        ${renderIntegrationMetric("Health", `${item.health_score}%`, healthTone)}
        ${renderIntegrationMetric("Sync", `${item.sync_success_rate}%`, item.sync_success_rate >= 80 ? "success" : "warning")}
        ${renderIntegrationMetric("Errors", item.error_count, item.error_count ? "danger" : "success")}
      </div>

      <footer class="integration-os-card-foot">
        <span>Last sync: ${esc(formatRelativeTime(item.last_sync_at))}</span>
        <button
          type="button"
          class="btn btn-secondary"
          data-integration-open="${esc(item.id)}"
        >
          Manage
        </button>
      </footer>
    </article>
  `;
}

export function renderIntegrationCards(records = []) {
  const items = Array.isArray(records) ? records : [];

  if (!items.length) {
    return `
      <section class="integration-empty-state">
        <strong>No integrations found</strong>
        <p>Connect platforms to unlock intelligence, sync, publishing, and reporting.</p>
      </section>
    `;
  }

  return `
    <section class="integration-os-grid">
      ${items.map(renderIntegrationStatusCard).join("")}
    </section>
  `;
}

function getConnectorWorkspaceStatus(card = {}) {
  if (card.statusLabel === "Connected") return "connected";
  if (["Error", "Token expired"].includes(card.statusLabel)) return "failed";
  if (card.statusLabel === "Partial") return "needs_setup";
  return "missing";
}

function getConnectorWorkspaceStatusLabel(statusKey) {
  if (statusKey === "needs_setup") return "Needs setup";
  return statusKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getConnectorWorkspaceAction(card = {}) {
  const statusKey = getConnectorWorkspaceStatus(card);

  if (card.backendSupported === false) {
    return { action: "select", label: "Open setup" };
  }

  if (statusKey === "connected") {
    return { action: "sync", label: "Sync Now" };
  }

  if (statusKey === "failed") {
    return { action: "reconnect", label: "Reconnect Now" };
  }

  if (statusKey === "needs_setup") {
    return { action: "connect", label: "Complete Setup" };
  }

  return { action: "connect", label: `Connect ${card.label || "Integration"}` };
}

export function renderConnectorRow(card = {}, session = {}) {
  const statusKey = getConnectorWorkspaceStatus(card);
  const statusLabel = getConnectorWorkspaceStatusLabel(statusKey);
  const recommendedAction = getConnectorWorkspaceAction(card);
  const isSelected = asString(session.selectedIntegrationId) === card.id;

  return `
    <article class="integration-control-row${isSelected ? " is-selected" : ""}">
      <div class="integration-control-row-main">
        <button class="integration-control-row-trigger" type="button" data-integration-select="${esc(card.id)}">
          <span class="integration-control-row-icon">${esc(card.icon)}</span>
          <span class="integration-control-row-copy">
            <span class="integration-control-row-topline">
              <strong>${esc(card.label)}</strong>
              <span class="card-badge ${esc(card.statusTone)}">${esc(statusLabel)}</span>
            </span>
            <span class="integration-control-row-meta">Why it matters: ${esc(card.whyItMatters)}</span>
            <span class="integration-control-row-meta">Recommended action: ${esc(recommendedAction.label)}</span>
          </span>
        </button>
      </div>
      <div class="integration-control-row-actions">
        ${recommendedAction.action === "select"
          ? `<button class="btn btn-secondary" type="button" data-integration-select="${esc(card.id)}">Open setup</button>`
          : `<button class="btn btn-primary" type="button" data-integration-primary="${esc(recommendedAction.action)}" data-integration-id="${esc(card.id)}">${esc(recommendedAction.label)}</button>`}
        <button class="btn btn-secondary" type="button" data-integration-select="${esc(card.id)}">Workspace</button>
        ${card.backendSupported === false
          ? ""
          : `<button class="btn btn-secondary" type="button" data-integration-action="test" data-integration-id="${esc(card.id)}">Test</button>`}
        ${card.backendSupported === false
          ? ""
          : `<button class="btn btn-secondary" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Sync</button>`}
      </div>
    </article>
  `;
}

export function renderConnectorGroup(group = {}, session = {}) {
  const cards = Array.isArray(group.cards) ? group.cards : [];
  const countLabel = `${group.connectedCount || 0} connected • ${group.setupCount || 0} needs setup • ${group.failedCount || 0} failed • ${group.missingCount || 0} missing`;

  return `
    <section class="card integration-control-group">
      <div class="card-head integration-control-group-head">
        <div>
          <h3>${esc(group.label)}</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">${esc(group.description)}</p>
        </div>
        <span class="card-badge ${group.failedCount || group.missingCount ? "warning" : group.setupCount ? "warning" : "success"}">${esc(countLabel)}</span>
      </div>
      <div class="integration-control-group-list">
        ${cards.map((card) => renderConnectorRow(card, session)).join("")}
      </div>
    </section>
  `;
}

function formatCardDate(value) {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Never";
  }

  return date.toLocaleString();
}

function getSmartConnectLabel(card = {}) {
  if (card.backendSupported === false) {
    return "Unavailable";
  }

  if (card.statusLabel === "Connected") {
    return "Manage Connection";
  }

  if (["Partial", "Token expired", "Error"].includes(card.statusLabel)) {
    return "Reconnect";
  }

  return `Connect ${card.label || "Integration"}`;
}

export function renderIntegrationCard(card = {}, session = {}) {
  const isSelected = asString(session.selectedIntegrationId) === card.id;

  const primaryAction =
    card.backendSupported === false
      ? "unavailable"
      : card.statusLabel === "Connected"
      ? "manage"
      : ["Partial", "Token expired", "Error"].includes(card.statusLabel)
        ? "reconnect"
        : "connect";

  const primaryActionLabel = getSmartConnectLabel(card);

  return `
    <section class="integration-simple-card${isSelected ? " is-selected" : ""}">
      <div class="integration-simple-head">
        <div class="integration-hub-icon">${esc(card.icon)}</div>

        <div class="integration-simple-copy">
          <strong>${esc(card.label)}</strong>

          <span class="integration-card-meta">
            Health: ${esc(card.healthSummary)}
          </span>

          <span class="integration-card-meta">
            Last sync: ${esc(formatCardDate(card.lastSync))}
          </span>
        </div>

        <span class="card-badge ${esc(card.statusTone)}">
          ${esc(
            card.statusLabel === "Partial" ||
            card.statusLabel === "Token expired" ||
            card.statusLabel === "Error"
              ? "Needs Attention"
              : card.statusLabel
          )}
        </span>
      </div>

      <div class="integration-simple-actions">
        <button
          class="btn btn-primary"
          type="button"
          data-integration-primary="${esc(primaryAction)}"
          data-integration-id="${esc(card.id)}"
          ${card.backendSupported === false ? "disabled" : ""}
        >
          ${esc(primaryActionLabel)}
        </button>

        <button
          class="btn btn-secondary"
          type="button"
          data-integration-select="${esc(card.id)}"
        >
          View Details
        </button>
      </div>
    </section>
  `;
}
