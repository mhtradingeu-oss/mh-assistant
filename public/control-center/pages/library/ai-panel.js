export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const missingCountNumber = Number(readiness?.missingCount || 0);
  const needsReviewCountNumber = Number(readiness?.needsReviewCount || 0);
  const requiredCountNumber = Number(readiness?.requiredCount || 0);
  const readinessScoreValue = readiness?.readinessScore == null ? null : Number(readiness.readinessScore);
  const missingCount = escapePanelHtml(missingCountNumber);
  const needsReviewCount = escapePanelHtml(needsReviewCountNumber);
  const requiredCount = escapePanelHtml(requiredCountNumber);
  const selectedName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No selected asset");
  const readinessScore = escapePanelHtml(readinessScoreValue == null || Number.isNaN(readinessScoreValue) ? "n/a" : `${readinessScoreValue}%`);
  const nextBestAction = buildLibraryAiNextBestAction({ readiness, selectedAsset });
  const selectedStatus = escapePanelHtml(toStatusLabel(selectedAsset?.status || "n/a"));
  const selectedType = escapePanelHtml(selectedAsset?.asset_type || selectedAsset?.type || "n/a");
  const selectedSource = escapePanelHtml((selectedAsset?.source_of_truth || selectedAsset?.sourceOfTruth || selectedAsset?.is_source_of_truth) ? "Source of truth" : "Not source of truth");
  const suggestions = buildLibraryAiSuggestions({ readiness, selectedAsset });

  return `
    <section class="card library-ai-panel" data-library-ai-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">AI Panel</p>
          <h3>Library AI Assistant</h3>
        </div>
        <span class="card-badge neutral">Read-only</span>
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
          <span>Missing categories</span>
          <strong>${missingCount}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Needs review</span>
          <strong>${needsReviewCount}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Current AI context</p>
        <div class="library-ai-context-card">
          <span>Selected asset</span>
          <strong>${selectedName}</strong>
        </div>
        <div class="library-ai-context-grid">
          <div class="library-ai-context-chip"><span>Status</span><strong>${selectedStatus}</strong></div>
          <div class="library-ai-context-chip"><span>Type</span><strong>${selectedType}</strong></div>
          <div class="library-ai-context-chip"><span>Authority</span><strong>${selectedSource}</strong></div>
          <div class="library-ai-context-chip"><span>Coverage</span><strong>${requiredCount} required classes</strong></div>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Read-only AI suggestions</p>
        <ul class="library-ai-suggestion-list" aria-label="AI suggestions">
          ${suggestions.map((item) => `<li>${escapePanelHtml(item)}</li>`).join("")}
        </ul>
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

function buildLibraryAiSuggestions({ readiness = {}, selectedAsset = null } = {}) {
  const suggestions = [];
  const missingCount = Number(readiness?.missingCount || 0);
  const needsReviewCount = Number(readiness?.needsReviewCount || 0);

  if (!selectedAsset) {
    suggestions.push("Select one asset and confirm its source-of-truth state before approving.");
  }

  if (missingCount > 0) {
    suggestions.push(`Resolve ${missingCount} missing required categor${missingCount === 1 ? "y" : "ies"} before final publishing checks.`);
  }

  if (needsReviewCount > 0) {
    suggestions.push(`Prioritize ${needsReviewCount} asset${needsReviewCount === 1 ? "" : "s"} still marked Needs Review.`);
  }

  if (selectedAsset) {
    const isSource = Boolean(selectedAsset?.source_of_truth ?? selectedAsset?.sourceOfTruth ?? selectedAsset?.is_source_of_truth);
    const status = String(selectedAsset?.status || "").toLowerCase();

    if (!isSource) {
      suggestions.push("If this asset is canonical for operations, set it as source of truth in the Action Panel.");
    }

    if (status !== "approved" && status !== "publishing_ready") {
      suggestions.push("Complete status review before using this asset in production-facing workflows.");
    }
  }

  if (!suggestions.length) {
    suggestions.push("No critical gaps detected. Keep authority and status checks aligned with campaign intent.");
  }

  return suggestions.slice(0, 4);
}

function toStatusLabel(value = "") {
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
