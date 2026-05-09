/*
  Integrations OS Render Layer

  Pure render-string helpers only.
  No DOM listeners.
  No fetch ownership.
  No session mutation.
*/

import {
  asArray,
  asString
} from "./utils.js";

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderAISmartRecommendation(rec = {}) {
  if (rec.healthy) {
    const nextHtml = rec.nextOptional
      ? `
        <div class="ai-smart-rec-healthy-next">
          <span class="ai-smart-rec-healthy-next-label">Suggested next:</span>
          <button class="btn btn-secondary" type="button" data-integration-select="${esc(rec.nextOptional.id)}">
            Open ${esc(rec.nextOptional.label)}
          </button>
        </div>
      `
      : `<p class="ai-smart-rec-healthy-copy">All connectors are active. No additional setup is required right now.</p>`;

    return `
      <section class="card ai-smart-rec ai-smart-rec--healthy">
        <div class="ai-smart-rec-header">
          <div class="ai-smart-rec-kicker">
            <span class="ai-smart-rec-badge success">AI Smart Connect</span>
          </div>
          <h3>Integration layer is healthy</h3>
          <p class="ai-smart-rec-sub">All critical connectors are active. The system is operating with full launch-critical data coverage.</p>
        </div>
        ${nextHtml}
      </section>
    `;
  }

  const card = rec.card || {};
  const impactChips = asArray(rec.impactChips);

  const chipsHtml = impactChips.length
    ? `<div class="ai-smart-rec-chips">${impactChips.map((chip) => `<span class="ai-smart-rec-chip">${esc(chip)}</span>`).join("")}</div>`
    : "";

  return `
    <section class="card ai-smart-rec">
      <div class="ai-smart-rec-header">
        <div class="ai-smart-rec-kicker">
          <span class="ai-smart-rec-badge ${esc(rec.priorityTone)}">AI Smart Connect</span>
          <span class="card-badge ${esc(rec.priorityTone)}">${esc(rec.priorityLabel)}</span>
        </div>
        <h3>Connect <strong>${esc(card.label)}</strong> next</h3>
        <p class="ai-smart-rec-sub">${esc(card.whyItMatters)}</p>
      </div>
      <div class="ai-smart-rec-body">
        <div class="ai-smart-rec-connector">
          <div class="ai-smart-rec-connector-icon">${esc(card.icon)}</div>
          <div class="ai-smart-rec-connector-info">
            <strong>${esc(card.label)}</strong>
            <span>${esc(card.domainTitle)}</span>
          </div>
          <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
        </div>
        <div class="ai-smart-rec-why">
          <div class="ai-smart-rec-why-top">
            <span class="ai-smart-rec-why-label">Why this first?</span>
            <span class="card-badge warning">${esc(rec.reasonLabel)}</span>
          </div>
          <p>${esc(card.enables)}</p>
        </div>
        ${chipsHtml}
        <div class="ai-smart-rec-actions">
          <button class="btn btn-primary" type="button" data-integration-select="${esc(card.id)}">
            Open Smart Connect
          </button>
          <span class="ai-smart-rec-cta-note">Opens the ${esc(card.label)} setup drawer and focuses the first required field.</span>
        </div>
      </div>
    </section>
  `;
}

export function renderIntegrationCoverageItem(item = {}) {
  const statusKey = asString(item.status).toLowerCase().replace(/\s+/g, "_");

  return `
    <article class="integration-coverage-item is-${esc(statusKey)}">
      <strong>${esc(item.label)}</strong>
      <span>${esc(item.status)}</span>
      <small>${esc(item.meta)}</small>
    </article>
  `;
}

export function renderIntegrationCoverageMap(items = []) {
  return `
    <section class="integration-coverage-grid">
      ${asArray(items).map(renderIntegrationCoverageItem).join("")}
    </section>
  `;
}

export function renderIntegrationRecommendationsList(items = []) {
  const list = asArray(items);

  if (!list.length) {
    return `
      <div class="empty-box">
        No recommended actions are currently available.
      </div>
    `;
  }

  return `
    <div class="integration-critical-list">
      ${list.map((item) => `
        <div class="integration-critical-item">
          <strong>${esc(item.title)}</strong>
          <span>${esc(item.meta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}
