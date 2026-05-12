export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const selectedAssetId = escapePanelHtml(selectedAsset?.id || "");
  const selectedRegistryAssetId = escapePanelHtml(selectedAsset?.mutation_id || selectedAsset?.asset_id || "");
  const assetName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No asset selected");
  const assetType = escapePanelHtml(selectedAsset?.type || selectedAsset?.asset_type || selectedAsset?.category || "n/a");
  const status = escapePanelHtml(toPanelStatusLabel(selectedAsset?.status || "n/a"));
  const sourceLabel = getPanelSourceOfTruth(selectedAsset) ? "Source of truth" : "Not source of truth";
  const isManagedMedia = selectedAsset?.kind === "managed_media";
  const filePath = selectedAsset?.file_path || selectedAsset?.preview_url || "";
  const copyPathValue = escapePanelHtml(filePath);
  const selectedHint = hasSelectedAsset
    ? "Use clear action groups to make trusted updates without leaving this workspace."
    : "Select an asset in the workspace to activate asset actions.";
  const copyDisabledAttr = hasSelectedAsset && copyPathValue ? "" : " disabled aria-disabled=\"true\"";
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";
  const durableDisabledAttr = disabled || !hasSelectedAsset || !selectedRegistryAssetId ? " disabled aria-disabled=\"true\"" : "";

  return `
    <section class="card library-action-panel" data-library-action-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">Selected Asset</p>
          <h3>Actions</h3>
        </div>
      </div>

      <div class="library-panel-hero">
        <strong>${assetName}</strong>
        <span>${escapePanelHtml(selectedHint)}</span>
      </div>

      <div class="library-panel-metrics">
        <div class="library-panel-metric">
          <span>Review Status</span>
          <strong>${status}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Type</span>
          <strong>${assetType}</strong>
        </div>
        <div class="library-panel-metric">
          <span>Source Status</span>
          <strong>${escapePanelHtml(sourceLabel)}</strong>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Primary Actions</p>
        <div class="library-panel-action-grid library-panel-actions-primary">
          <button class="btn btn-primary" type="button" data-library-open="${selectedAssetId}"${disabledAttr}>Open</button>
          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI</button>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Utility</p>
        <div class="library-panel-action-grid library-panel-actions-utility">
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy Path</button>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Decisions</p>
        <div class="library-panel-action-grid library-panel-actions-durable">
          ${isManagedMedia
      ? `<button class="btn btn-secondary" type="button" disabled aria-disabled="true">${escapePanelHtml(selectedAsset?.source_label || "Managed")}</button>`
      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetId}"${disabledAttr}>${escapePanelHtml(getPanelSourceOfTruth(selectedAsset) ? "Unsource" : "Source")}</button>
             <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Approve</button>
             <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Review</button>`}
          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Rename</button>
          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Archive</button>
        </div>
      </div>

      <div class="library-panel-section library-panel-section-danger">
        <p class="setup-helper">Danger</p>
        <button class="btn btn-secondary library-danger-action" type="button" data-library-delete="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}" title="Soft-delete this asset after confirmation"${durableDisabledAttr}>Soft Delete</button>
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
