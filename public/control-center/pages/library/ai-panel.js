export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const missingCount = escapePanelHtml(readiness?.missingCount || 0);
  const selectedName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No selected asset");
  const readinessScore = escapePanelHtml(readiness?.readinessScore == null ? "n/a" : `${readiness.readinessScore}%`);
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";

  return `
    <section class="card library-ai-panel" data-library-ai-panel>
      <div class="card-head">
        <div>
          <p class="eyebrow">AI Panel</p>
          <h3>Library AI Assistant</h3>
        </div>
        <span class="card-badge neutral">Read-only</span>
      </div>
      <div class="data-stack">
        <p class="muted">Context: ${selectedName}</p>
        <div class="data-row"><span>Missing categories</span><strong>${missingCount}</strong></div>
        <div class="data-row"><span>Readiness</span><strong>${readinessScore}</strong></div>
        <p class="setup-helper">AI actions are disabled until Library command routing is connected.</p>
        <div class="library-preview-actions">
          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI about Library</button>
        </div>
      </div>
    </section>
  `;
}

function escapePanelHtml(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}
