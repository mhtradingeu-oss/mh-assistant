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

export function renderIntegrationCard(record = {}) {
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
      ${items.map(renderIntegrationCard).join("")}
    </section>
  `;
}
