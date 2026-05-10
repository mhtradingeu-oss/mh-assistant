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

import {
  renderIntegrationDetailsPanel
} from "./drawer.js";

export function renderIntegrationSection(
  section = {},
  session = {},
  options = {}
) {
  const getFieldValue =
    typeof options.getFieldValue === "function"
      ? options.getFieldValue
      : () => "";

  const summary = section.summary || {};

  const connected = summary.connected || 0;
  const notConnected = summary.notConnected || 0;
  const needsAttention = summary.needsAttention || 0;

  const tone =
    notConnected || needsAttention
      ? connected
        ? "warning"
        : "danger"
      : "success";

  const cards = Array.isArray(section.cards) ? section.cards : [];

  const selectedCard =
    cards.find((card) => card.id === asString(session.selectedIntegrationId)) ||
    cards[0] ||
    null;

  const connectedCards = cards.filter(
    (card) => card.statusLabel === "Connected"
  );

  const attentionCards = cards.filter((card) =>
    ["Partial", "Token expired", "Error"].includes(card.statusLabel)
  );

  const notConnectedCards = cards.filter(
    (card) => card.statusLabel === "Not Connected"
  );

  return `
    <section class="card integration-domain-card">
      <div class="card-head">
        <div>
          <h3>${esc(section.title)}</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">
            ${esc(section.description)}
          </p>
        </div>

        <span class="card-badge ${tone}">
          ${esc(`${connected} connected • ${notConnected} not connected • ${needsAttention} needs attention`)}
        </span>
      </div>

      <div class="integration-coverage-grid integration-section-status-grid">
        <div class="integration-coverage-item">
          <strong>Connected</strong>
          <span class="card-badge success">${esc(String(connected))}</span>
          <div class="integration-coverage-meta">
            Ready for test, sync, and provider-backed actions.
          </div>
        </div>

        <div class="integration-coverage-item">
          <strong>Not connected</strong>
          <span class="card-badge danger">${esc(String(notConnected))}</span>
          <div class="integration-coverage-meta">
            No complete connection record is available yet.
          </div>
        </div>

        <div class="integration-coverage-item">
          <strong>Needs attention / blocked</strong>
          <span class="card-badge warning">${esc(String(needsAttention))}</span>
          <div class="integration-coverage-meta">
            Partial setup, token issues, or server-reported errors need review.
          </div>
        </div>
      </div>

      <div class="integration-status-group">
        <div class="integration-mini-heading">Connected</div>

        <div class="integration-simple-grid">
          ${
            connectedCards.length
              ? connectedCards
                  .map((card) => renderIntegrationCard(card, session))
                  .join("")
              : `<div class="empty-box">No connected integrations in this group yet.</div>`
          }
        </div>
      </div>

      <div class="integration-status-group">
        <div class="integration-mini-heading">Needs Attention</div>

        <div class="integration-simple-grid">
          ${
            attentionCards.length
              ? attentionCards
                  .map((card) => renderIntegrationCard(card, session))
                  .join("")
              : `<div class="empty-box">No integrations need attention in this group right now.</div>`
          }
        </div>
      </div>

      <div class="integration-status-group">
        <div class="integration-mini-heading">Not Connected</div>

        <div class="integration-simple-grid">
          ${
            notConnectedCards.length
              ? notConnectedCards
                  .map((card) => renderIntegrationCard(card, session))
                  .join("")
              : `<div class="empty-box">All integrations in this group already have a connection state.</div>`
          }
        </div>
      </div>

      ${
        selectedCard
          ? renderIntegrationDetailsPanel(selectedCard, session, {
              getFieldValue
            })
          : ""
      }
    </section>
  `;
}
