export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const assetName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No asset selected");
  const assetType = escapePanelHtml(selectedAsset?.type || selectedAsset?.asset_type || selectedAsset?.category || "n/a");
  const status = escapePanelHtml(toPanelStatusLabel(selectedAsset?.status || "n/a"));
  const sourceLabel = getPanelSourceOfTruth(selectedAsset) ? "Source of truth" : "Not source of truth";
  const filePath = selectedAsset?.file_path || selectedAsset?.preview_url || "";
  const copyPathValue = escapePanelHtml(filePath);
  const selectedHint = hasSelectedAsset
    ? "Review the asset context, then use the active inspector controls for durable changes."
    : "Select an asset from the Library workspace to unlock contextual review guidance.";
  const copyDisabledAttr = hasSelectedAsset && copyPathValue ? "" : " disabled aria-disabled=\"true\"";
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";

  return `
    <section class="card library-action-panel" data-library-action-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">Action Panel</p>
          <h3>Library Operations</h3>
        </div>
        <span class="card-badge neutral">Context</span>
      </div>

      <div class="library-panel-hero">
        <strong>${assetName}</strong>
        <span>${escapePanelHtml(selectedHint)}</span>
      </div>

      <div class="library-panel-metrics">
        <div class="library-panel-metric">
          <span>Status</span>
          <strong>${status}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Type</span>
          <strong>${assetType}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Authority</span>
          <strong>${escapePanelHtml(sourceLabel)}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Safe shortcut</p>
        <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy asset path</button>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Durable actions stay in the active inspector for this pilot.</p>
        <div class="library-panel-action-grid">
          <button class="btn btn-secondary" type="button" data-library-command="set-source-of-truth"${disabledAttr}>Set source</button>
          <button class="btn btn-secondary" type="button" data-library-command="update-status" data-status="approved"${disabledAttr}>Approve</button>
          <button class="btn btn-secondary" type="button" data-library-command="update-status" data-status="needs_review"${disabledAttr}>Needs review</button>
          <button class="btn btn-secondary" type="button" data-library-command="archive-asset"${disabledAttr}>Archive</button>
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

function getPanelSourceOfTruth(asset = {}) {
  return Boolean(asset?.source_of_truth ?? asset?.sourceOfTruth ?? asset?.is_source_of_truth);
}

function toPanelStatusLabel(value = "") {
  return String(value || "n/a")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
