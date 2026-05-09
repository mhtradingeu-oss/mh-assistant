/*
  Integrations OS Layout Layer

  Section/domain composition only.
  No DOM listeners.
  No runtime side effects.
*/

import {
  renderIntegrationCard
} from "./cards.js";

import {
  asString
} from "./utils.js";

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderDomainSection(domain = {}, session = {}) {
  const cards = Array.isArray(domain.cards) ? domain.cards : [];
  const attentionCount = cards.filter((card) => ["Error", "Token expired"].includes(card.statusLabel)).length;
  const blockedCount = cards.filter((card) => card.statusLabel === "Not Connected").length;
  const connectedCount = domain.connectedCount || 0;
  const partialCount = domain.partialCount || 0;

  return `
    <section class="card integration-domain-card">
      <div class="card-head">
        <div>
          <h3>${esc(domain.title)}</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">${esc(domain.description)}</p>
        </div>
        <span class="card-badge ${connectedCount === cards.length ? "success" : connectedCount || partialCount ? "warning" : "danger"}">${esc(`${connectedCount} connected • ${partialCount} partial • ${attentionCount} attention • ${blockedCount} missing`)}</span>
      </div>
      <div class="integration-domain-grid">
        ${cards.map((card) => renderIntegrationCard(card, session)).join("")}
      </div>
    </section>
  `;
}
