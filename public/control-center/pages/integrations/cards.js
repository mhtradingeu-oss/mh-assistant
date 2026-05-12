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

function getConnectorStatusLabel(card = {}, statusKey = "") {
  if (card.statusLabel === "Connected") return "Connected";
  if (card.statusLabel === "Partial") return "Partial";
  if (card.statusLabel === "Token expired") return "Token expired";
  if (card.statusLabel === "Error") return "Error";
  if (card.statusLabel === "Not Connected") return "Not Connected";
  return getConnectorWorkspaceStatusLabel(statusKey);
}

function getConnectorWorkspaceAction(card = {}) {
  const statusKey = getConnectorWorkspaceStatus(card);

  if (card.backendSupported === false) {
    return { action: "select", label: "Open setup" };
  }

  if (statusKey === "connected") {
    return { action: "sync", label: "Sync" };
  }

  if (statusKey === "failed") {
    return {
      action: "reconnect",
      label: card.statusLabel === "Error" ? "Fix connection" : "Reconnect"
    };
  }

  if (statusKey === "needs_setup") {
    return { action: "connect", label: "Complete setup" };
  }

  return { action: "connect", label: "Connect" };
}

function shortenText(value = "", max = 90) {
  const text = asString(value).trim();
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}...`;
}

function getSetupMethodLabel(card = {}) {
  if (card.backendSupported === false) {
    return "Setup method: Backend support not configured";
  }

  if (card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth") {
    return "Setup method: OAuth recommended";
  }

  return "Setup method: Manual fields";
}

function getRequirementLabel(card = {}) {
  if (card.backendSupported === false) {
    return "Backend support: Not configured";
  }

  const requiredFields = Array.isArray(card.fields)
    ? card.fields.filter((field) => field?.required)
    : [];

  if (requiredFields.length) {
    const labels = requiredFields
      .slice(0, 2)
      .map((field) => asString(field.label).trim())
      .filter(Boolean);
    const suffix = requiredFields.length > 2 ? " +more" : "";
    return `Access needed: ${labels.join(", ")}${suffix}`;
  }

  if (asString(card.permissionScopeSummary).trim()) {
    return `Access needed: ${card.permissionScopeSummary}`;
  }

  return "Access needed: Setup details in drawer";
}

export function renderConnectorRow(card = {}, session = {}) {
  const statusKey = getConnectorWorkspaceStatus(card);
  const statusLabel = getConnectorStatusLabel(card, statusKey);
  const recommendedAction = getConnectorWorkspaceAction(card);
  const isSelected = asString(session.selectedIntegrationId) === card.id;
  const healthLabel = shortenText(card.healthSummary, 88) || "No sync health detail available.";
  const requirementLabel = shortenText(getRequirementLabel(card), 88);
  const setupMethodLabel = getSetupMethodLabel(card);
  const actionButton =
    recommendedAction.action === "select"
      ? `<button class="btn btn-primary" type="button" data-integration-select="${esc(card.id)}">${esc(recommendedAction.label)}</button>`
      : `<button class="btn btn-primary" type="button" data-integration-primary="${esc(recommendedAction.action)}" data-integration-id="${esc(card.id)}">${esc(recommendedAction.label)}</button>`;
  const showSyncAction = card.backendSupported !== false && statusKey === "connected";

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
            <span class="integration-control-row-meta">Sync health: ${esc(healthLabel)}</span>
            <span class="integration-control-row-meta">Last sync: ${esc(formatCardDate(card.lastSync))}</span>
            <span class="integration-control-row-meta">${esc(requirementLabel)}</span>
            <span class="integration-control-row-meta">${esc(setupMethodLabel)}</span>
            <span class="integration-control-row-meta">Recommended action: ${esc(recommendedAction.label)}</span>
          </span>
        </button>
      </div>
      <div class="integration-control-row-actions">
        ${actionButton}
        <button class="btn btn-secondary" type="button" data-integration-select="${esc(card.id)}">Setup drawer</button>
        ${card.backendSupported === false
          ? ""
          : `<button class="btn btn-secondary" type="button" data-integration-action="test" data-integration-id="${esc(card.id)}">Test connection</button>`}
        ${showSyncAction
          ? `<button class="btn btn-secondary" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Sync</button>`
          : ""}
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
    return "Manage";
  }

  if (card.statusLabel === "Partial") {
    return "Complete setup";
  }

  if (card.statusLabel === "Token expired") {
    return "Reconnect";
  }

  if (card.statusLabel === "Error") {
    return "Fix connection";
  }

  return "Connect";
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

export function renderSelectedConnectorSummary(card = {}) {
  const smartLabel = getSmartConnectLabel(card);

  return `
    <section class="card integration-selected-summary">
      <div class="card-head">
        <div>
          <h3>Connector workspace</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">Open the setup drawer to configure, test, sync, reconnect, or manage this connector.</p>
        </div>
        <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
      </div>
      <div class="integration-selected-summary-body">
        <div class="integration-hub-title-wrap">
          <div class="integration-hub-icon">${esc(card.icon)}</div>
          <div>
            <h4>${esc(card.label)}</h4>
            <p>${esc(card.whyItMatters)}</p>
          </div>
        </div>
        <button class="btn btn-primary" type="button" data-integration-select="${esc(card.id)}">${esc(smartLabel)}</button>
      </div>
    </section>
  `;
}
