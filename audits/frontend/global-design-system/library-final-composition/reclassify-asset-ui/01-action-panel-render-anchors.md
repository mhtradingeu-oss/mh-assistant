# 01 — Action Panel Render Anchors

Generated: Sat Jun  6 14:16:50 CEST 2026

## action-panel.js excerpt
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
          <button class="btn btn-primary" type="button" data-library-open="${selectedAssetId}"${disabledAttr}>Open asset</button>
          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Utility</p>
        <div class="library-panel-action-grid library-panel-actions-utility">
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy asset path</button>
        </div>
      </div>

      <div class="library-panel-section">
        <p class="setup-helper">Decisions</p>
        <div class="library-panel-action-grid library-panel-actions-durable">
          ${isManagedMedia
      ? `<button class="btn btn-secondary" type="button" disabled aria-disabled="true">${escapePanelHtml(selectedAsset?.source_label || "Managed")}</button>`
      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetId}"${disabledAttr}>${escapePanelHtml(getPanelSourceOfTruth(selectedAsset) ? "Remove source mark" : "Mark as source")}</button>
             <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Approve for use</button>
             <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Mark for review</button>`}
          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Rename asset</button>
          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Archive asset</button>
        </div>
      </div>

      <div class="library-panel-section library-panel-section-danger">
        <p class="setup-helper">Danger</p>
        <button class="btn btn-secondary library-danger-action" type="button" data-library-delete="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}" title="Soft-delete this asset after confirmation"${durableDisabledAttr}>Soft-delete asset</button>
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

## action button selectors in library.js
488:          const button = event.target.closest?.("[data-copy-asset-path]");
493:          const value = button.getAttribute("data-copy-asset-path") || "";
2373:  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
2374:  sourceOfTruthButtons.forEach((button) => {
2383:      const assetId = button.getAttribute("data-library-source-truth") || "";
2404:  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
2405:  statusActionButtons.forEach((button) => {
2414:      const status = button.getAttribute("data-asset-status-action") || "needs_review";
2443:  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
2444:  archiveButtons.forEach((button) => {
2453:      const id = button.getAttribute("data-library-archive") || "";
2477:  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
2478:  renameButtons.forEach((button) => {
2487:      const id = button.getAttribute("data-library-rename") || "";
2518:  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
2519:  deleteButtons.forEach((button) => {
2528:      const id = button.getAttribute("data-library-delete") || "";
