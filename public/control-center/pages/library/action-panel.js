export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const assetName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No asset selected");
  const assetType = escapePanelHtml(selectedAsset?.type || selectedAsset?.asset_type || selectedAsset?.category || "n/a");
  const status = escapePanelHtml(toPanelStatusLabel(selectedAsset?.status || "n/a"));
  const isSourceOfTruth = getPanelSourceOfTruth(selectedAsset);
  const sourceLabel = isSourceOfTruth ? "Source of truth" : "Not source of truth";
  const filePath = selectedAsset?.file_path || selectedAsset?.preview_url || "";
  const selectedAssetId = escapePanelHtml(selectedAsset?.id || "");
  const mutationAssetId = escapePanelHtml(selectedAsset?.mutation_id || selectedAsset?.asset_id || "");
  const copyPathValue = escapePanelHtml(filePath);
  const openEnabled = Boolean(selectedAsset?.preview_url);
  const statusTone = toStatusTone(selectedAsset?.status || "n/a");
  const selectedHint = hasSelectedAsset
    ? "Run all selected-asset actions from this panel to keep operations consistent and safe."
    : "Select an asset from the grid to unlock status, authority, and controlled action flows.";
  const copyDisabledAttr = hasSelectedAsset && copyPathValue ? "" : " disabled aria-disabled=\"true\"";
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";
  const selectedAssetAttr = selectedAssetId || "";
  const mutationAssetAttr = mutationAssetId || "";

  if (!hasSelectedAsset) {
    return `
      <section class="card library-action-panel" data-library-action-panel>
        <div class="card-head library-panel-head">
          <div>
            <p class="eyebrow">Action Panel</p>
            <h3>Selected Asset Operations</h3>
          </div>
          <span class="card-badge neutral">Waiting for selection</span>
        </div>

        <div class="library-panel-hero is-empty">
          <strong>No asset selected</strong>
          <span>${escapePanelHtml(selectedHint)}</span>
        </div>

        <div class="library-panel-empty-list" role="list" aria-label="Action panel guidance">
          <div class="library-panel-empty-item" role="listitem">1. Pick an asset card from the workspace grid.</div>
          <div class="library-panel-empty-item" role="listitem">2. Review status and source-of-truth state here.</div>
          <div class="library-panel-empty-item" role="listitem">3. Use safe actions before any destructive action.</div>
        </div>
      </section>
    `;
  }

  const openButton = openEnabled
    ? `<button class="btn btn-primary" type="button" data-library-open="${selectedAssetAttr}">Open asset</button>`
    : `<button class="btn btn-primary" type="button" disabled aria-disabled="true">Open asset</button>`;
  const sourceButtonLabel = escapePanelHtml(isSourceOfTruth ? "Unset source" : "Set source");

  return `
    <section class="card library-action-panel" data-library-action-panel>
      <div class="card-head library-panel-head">
        <div>
          <p class="eyebrow">Action Panel</p>
          <h3>Selected Asset Operations</h3>
        </div>
        <span class="card-badge ${statusTone}">${status}</span>
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
        <p class="setup-helper">Safe actions</p>
        <div class="library-panel-action-grid">
          ${openButton}
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy path</button>
          <button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetAttr}"${disabledAttr}>${sourceButtonLabel}</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetAttr}" data-asset-id="${mutationAssetAttr}"${disabledAttr}>Approve</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetAttr}" data-asset-id="${mutationAssetAttr}"${disabledAttr}>Needs review</button>
          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetAttr}" data-asset-id="${mutationAssetAttr}"${disabledAttr}>Rename</button>
        </div>
      </div>

      <div class="library-panel-section library-panel-danger-zone">
        <p class="setup-helper">Destructive actions</p>
        <div class="library-panel-action-grid">
          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetAttr}" data-asset-id="${mutationAssetAttr}"${disabledAttr}>Archive</button>
          <button class="btn btn-secondary" type="button" data-library-delete="${selectedAssetAttr}" data-asset-id="${mutationAssetAttr}"${disabledAttr}>Delete</button>
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

function toStatusTone(value = "") {
  const status = String(value || "").toLowerCase();
  if (["approved", "ready", "publishing_ready", "live"].includes(status)) return "success";
  if (["needs_review", "pending", "uploaded", "processing"].includes(status)) return "warning";
  if (["archived", "rejected", "deleted", "failed"].includes(status)) return "danger";
  return "neutral";
}
