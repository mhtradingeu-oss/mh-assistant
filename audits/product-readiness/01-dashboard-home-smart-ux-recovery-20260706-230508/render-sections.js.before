/*
  Home Executive Runtime Render Sections

  Pure render helpers only.
  No DOM listeners.
  No data fetching.
  No state mutation.
*/

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function formatCount(value) {
  const parsed = Number(value);
  return String(Math.max(0, Math.round(Number.isFinite(parsed) ? parsed : 0)));
}

export function renderBadge(tone, label, escapeHtml) {
  return `<span class="card-badge ${escapeHtml(tone || "neutral")}">${escapeHtml(label || "Unknown")}</span>`;
}

export function renderCompactList(items, escapeHtml, emptyText = "No active blocker detected.") {
  const safeItems = asArray(items).slice(0, 5);

  if (!safeItems.length) {
    return `<p class="home-empty-note">${escapeHtml(emptyText)}</p>`;
  }

  return `
    <ul class="home-compact-list">
      ${safeItems.map((item) => `
        <li>${escapeHtml(asString(item))}</li>
      `).join("")}
    </ul>
  `;
}

export function renderBlockerColumn(title, items, tone, escapeHtml) {
  const safeItems = asArray(items).slice(0, 5);

  return `
    <article class="home-blocker-card">
      <div class="home-blocker-head">
        <span class="data-label">${escapeHtml(title)}</span>
        ${renderBadge(safeItems.length ? tone : "success", safeItems.length ? formatCount(safeItems.length) : "Clear", escapeHtml)}
      </div>
      ${renderCompactList(safeItems, escapeHtml, "No blocker detected.")}
    </article>
  `;
}

export function renderActivityItems(items, escapeHtml) {
  const safeItems = asArray(items).slice(0, 6);

  if (!safeItems.length) {
    return `<p class="home-empty-note">No recent activity is recorded yet. Open the owning workspace to create the next reviewed signal.</p>`;
  }

  return `
    <div class="home-activity-list">
      ${safeItems.map((item) => `
        <article class="home-activity-item">
          <div>
            <span class="data-label">${escapeHtml(item.kind || "Activity")}</span>
            <strong>${escapeHtml(item.title || "Untitled activity")}</strong>
            <p>${escapeHtml(item.detail || "")}</p>
          </div>
          <div class="home-activity-meta">
            ${renderBadge(item.tone || "neutral", item.when || "Not available", escapeHtml)}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

export function renderAiTeamCards(cards, escapeHtml) {
  const safeCards = asArray(cards).slice(0, 7);

  if (!safeCards.length) {
    return `<p class="home-empty-note">AI team status is not available yet. AI Command can still prepare guidance for the next action.</p>`;
  }

  return `
    <div class="home-ai-team-grid">
      ${safeCards.map((agent) => `
          <button class="home-ai-team-card" type="button" data-role-id="${escapeHtml(agent.id || "")}" title="Prepare ${escapeHtml(agent.name)} guidance in AI Command">
          <div class="home-ai-team-card-head">
            <strong>${escapeHtml(agent.name)}</strong>
            ${renderBadge(agent.tone || "neutral", agent.status || "Idle", escapeHtml)}
          </div>
          <p>${escapeHtml(agent.summary || agent.fallback || "Ready to support the project.")}</p>
          </button>
      `).join("")}
    </div>
  `;
}

export function renderHomeExecutiveIntro({
  dashboard = {},
  capabilityCards = [],
  escapeHtml,
  formatPercent,
  toneLabel
}) {
  return `
    <section class="card home-exec-hero">
      <div class="home-exec-hero-main">
        <div>
          <p class="card-label">Executive Command Center</p>
          <h2>${escapeHtml(dashboard.projectName || "Project Command Center")}</h2>
          <p class="home-decision-copy">${escapeHtml(dashboard.oneLineSummary)}</p>
        </div>

        <div class="home-exec-hero-status">
          ${renderBadge(dashboard.headerTone, dashboard.headerStatus, escapeHtml)}
          <strong>${escapeHtml(formatPercent(dashboard.health?.systemScore))}</strong>
          <span class="data-label">System Health</span>
        </div>
      </div>

      <div class="home-exec-hero-actions">
        <button id="homeExecutivePrimaryActionBtn" class="btn btn-primary" type="button">
          ${escapeHtml(dashboard.primaryActionLabel)}
        </button>
        <button id="homeSecondaryActionBtn" class="btn btn-secondary" type="button">
          ${escapeHtml(dashboard.secondaryActionLabel)}
        </button>
        <button id="homeAskExecutiveAiBtn" class="btn btn-ghost" type="button">
          Prepare AI Guidance
        </button>
      </div>
      <p class="home-empty-note">Home opens workspaces or prepares AI guidance only. It does not approve, publish, send, upload, delete, archive, or execute.</p>
    </section>

    <section class="home-kpi-grid">
      ${capabilityCards.map((item) => `
        <article class="card home-kpi-card">
          <span class="data-label">${escapeHtml(item.title)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          <p>${escapeHtml(item.detail)}</p>
          ${renderBadge(item.tone, toneLabel(item.tone), escapeHtml)}
        </article>
      `).join("")}
    </section>


  `;
}
