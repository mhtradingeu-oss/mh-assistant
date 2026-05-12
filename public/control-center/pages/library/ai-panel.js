export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const missingCountNumber = Number(readiness?.missingCount || 0);
  const readinessScoreValue = readiness?.readinessScore == null ? null : Number(readiness.readinessScore);
  const missingCount = escapePanelHtml(missingCountNumber);
  const selectedName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No selected asset");
  const readinessScore = escapePanelHtml(readinessScoreValue == null || Number.isNaN(readinessScoreValue) ? "n/a" : `${readinessScoreValue}%`);
  const nextBestAction = buildLibraryAiNextBestAction({ readiness, selectedAsset });
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";

  return `
    <section class="card library-ai-panel" data-library-ai-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">AI Guidance</p>
          <h3>Next Best Action</h3>
        </div>
        <span class="card-badge neutral">Readiness Context</span>
      </div>

      <div class="library-panel-hero">
        <strong>${escapePanelHtml(nextBestAction.title)}</strong>
        <span>${escapePanelHtml(nextBestAction.description)}</span>
      </div>

      <div class="library-panel-metrics">
        <div class="library-panel-metric">
          <span>Readiness</span>
          <strong>${readinessScore}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Missing</span>
          <strong>${missingCount}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Readiness Context</p>
        <div class="library-ai-context-card">
          <span>Selected Asset</span>
          <strong>${selectedName}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Suggested next move</p>
        <div class="library-panel-action-grid">
          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI for next move</button>
        </div>
      </div>
    </section>
  `;
}

function buildLibraryAiNextBestAction({ readiness = {}, selectedAsset = null } = {}) {
  const missingCount = Number(readiness?.missingCount || 0);

  if (!selectedAsset && missingCount > 0) {
    return {
      title: "Close missing asset gaps",
      description: `${missingCount} required asset category${missingCount === 1 ? "" : "ies"} still need attention before the Library is fully ready.`
    };
  }

  if (!selectedAsset) {
    return {
      title: "Select an asset to start",
      description: "Choose an asset to let the system explain its status, authority, and next best review step."
    };
  }

  const isSource = Boolean(selectedAsset?.source_of_truth ?? selectedAsset?.sourceOfTruth ?? selectedAsset?.is_source_of_truth);
  const status = String(selectedAsset?.status || "").toLowerCase();

  if (!isSource) {
    return {
      title: "Confirm source-of-truth",
      description: "This asset is selected but not marked as source-of-truth. Review it before using it across campaigns."
    };
  }

  if (status === "needs_review" || status === "uploaded") {
    return {
      title: "Review before production",
      description: "This asset needs review before it becomes a trusted production input."
    };
  }

  return {
    title: "Asset ready for operating use",
    description: "This selected asset looks ready for downstream campaign, media, and publishing workflows."
  };
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
