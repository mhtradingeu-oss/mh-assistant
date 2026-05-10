export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
  const assetName = selectedAsset?.name || "No asset selected";
  const status = selectedAsset?.status || "n/a";
  const sourceLabel = selectedAsset?.sourceOfTruth ? "Source of truth" : "Not source of truth";

  return `
    <aside class="library-action-panel" data-library-action-panel>
      <div class="panel-card">
        <p class="eyebrow">Action Panel</p>
        <h3>Library Operations</h3>
        <p class="muted">Selected: ${assetName}</p>
        <div class="mini-meta">
          <span>Status: ${status}</span>
          <span>${sourceLabel}</span>
        </div>
        <div class="panel-actions">
          <button type="button" data-library-command="set-source-of-truth" ${disabled ? "disabled" : ""}>Set source</button>
          <button type="button" data-library-command="update-status" data-status="approved" ${disabled ? "disabled" : ""}>Approve</button>
          <button type="button" data-library-command="update-status" data-status="needs_review" ${disabled ? "disabled" : ""}>Needs review</button>
          <button type="button" data-library-command="archive-asset" ${disabled ? "disabled" : ""}>Archive</button>
        </div>
      </div>
    </aside>
  `;
}
