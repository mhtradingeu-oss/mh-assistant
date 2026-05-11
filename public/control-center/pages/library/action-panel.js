export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
  const hasSelectedAsset = Boolean(selectedAsset);
  const assetName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No asset selected");
  const status = escapePanelHtml(selectedAsset?.status || "n/a");
  const sourceLabel = getPanelSourceOfTruth(selectedAsset) ? "Source of truth" : "Not source of truth";
  const copyPathValue = escapePanelHtml(selectedAsset?.file_path || selectedAsset?.preview_url || "");
  const copyDisabledAttr = hasSelectedAsset && copyPathValue ? "" : " disabled aria-disabled=\"true\"";
  const disabledAttr = disabled || !hasSelectedAsset ? " disabled aria-disabled=\"true\"" : "";

  return `
    <section class="card library-action-panel" data-library-action-panel>
      <div class="card-head">
        <div>
          <p class="eyebrow">Action Panel</p>
          <h3>Library Operations</h3>
        </div>
        <span class="card-badge neutral">Read-only</span>
      </div>
      <div class="data-stack">
        <p class="muted">Selected: ${assetName}</p>
        <div class="data-row"><span>Status</span><strong>${status}</strong></div>
        <div class="data-row"><span>Source</span><strong>${sourceLabel}</strong></div>
        <p class="setup-helper">Actions are disabled until Library command routing is connected.</p>
        <div class="library-preview-actions">
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy Path</button>
        </div>
        <div class="library-preview-actions">
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
