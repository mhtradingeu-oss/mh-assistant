export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const missingCountNumber = Number(readiness?.missingCount || 0);
  const readinessScoreValue = readiness?.readinessScore == null ? null : Number(readiness.readinessScore);
  const missingCount = escapePanelHtml(missingCountNumber);
  const selectedName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No selected asset");
  const readinessScore = escapePanelHtml(readinessScoreValue == null || Number.isNaN(readinessScoreValue) ? "n/a" : `${readinessScoreValue}%`);
  const nextBestAction = buildLibraryAiNextBestAction({ readiness, selectedAsset });
  const isSource = hasSelectedAsset && Boolean(selectedAsset?.source_of_truth ?? selectedAsset?.sourceOfTruth ?? selectedAsset?.is_source_of_truth);
  const assetStatus = String(selectedAsset?.status || "").toLowerCase();
  const sourceStatus = isSource ? "Source of truth" : "Not source of truth";
  const reviewStatus = escapePanelHtml(toPanelStatusLabel(assetStatus || "n/a"));

  return `
    <section class="card library-ai-panel" data-library-ai-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">AI Guidance</p>
          <h3>Recommended next step</h3>
        </div>
      </div>

      <div class="library-panel-hero">
        <strong>${escapePanelHtml(nextBestAction.title)}</strong>
        <span>${escapePanelHtml(nextBestAction.description)}</span>
      </div>

      <div class="library-panel-metrics">
        <div class="library-panel-metric">
          <span>Review Status</span>
          <strong>${reviewStatus}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Source Status</span>
          <strong>${escapePanelHtml(sourceStatus)}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Readiness</span>
          <strong>${readinessScore}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Why it matters</p>
        <div class="library-ai-context-card">
          <strong>${selectedName}</strong>
          <small>${escapePanelHtml(nextBestAction.description)}</small>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Suggested next move</p>
        <div class="library-ai-context-card">
          <span>Priority</span>
          <strong>${escapePanelHtml(nextBestAction.suggestedMove)}</strong>
          <small>${escapePanelHtml(`Missing required groups: ${missingCount}`)}</small>
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
      description: `${missingCount} required asset category${missingCount === 1 ? "" : "ies"} still need attention before the Library is fully ready.`,
      suggestedMove: "Upload missing required assets first, then classify and review."
    };
  }

  if (!selectedAsset) {
    return {
      title: "Select an asset to start",
      description: "Choose an asset to get clear source status, review status, and practical guidance.",
      suggestedMove: "Select an asset, then use Open or Ask AI from the Actions panel."
    };
  }

  const isSource = Boolean(selectedAsset?.source_of_truth ?? selectedAsset?.sourceOfTruth ?? selectedAsset?.is_source_of_truth);
  const status = String(selectedAsset?.status || "").toLowerCase();

  if (!isSource) {
    return {
      title: "Confirm source-of-truth",
      description: "This asset is selected but not marked as source-of-truth. Review it before using it across campaigns.",
      suggestedMove: "Mark as Source once validated, then approve for operating use."
    };
  }

  if (status === "needs_review" || status === "uploaded") {
    return {
      title: "Review before production",
      description: "This asset needs review before it becomes a trusted production input.",
      suggestedMove: "Use Review or Approve from the Actions panel after validation."
    };
  }

  return {
    title: "Asset ready for operating use",
    description: "This selected asset looks ready for downstream campaign, media, and publishing workflows.",
    suggestedMove: "Use Open to verify final quality, then proceed to downstream workflows."
  };
}

function toPanelStatusLabel(value = "") {
  return String(value || "n/a")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
