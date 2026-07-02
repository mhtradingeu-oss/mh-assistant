# 01 — Action Panel Move Markup

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
        <div class="library-panel-move-control">
          <div class="library-panel-move-head">
            <div>
              <div class="library-panel-move-title">Move to group</div>
              <p>Change the Library group only. The file path stays unchanged.</p>
            </div>
            <span class="library-panel-current-group">${escapePanelHtml(assetTypeRaw || "current")}</span>
          </div>
          <input class="library-panel-move-checkbox" id="libraryMoveGroupToggle" type="checkbox"${durableDisabledAttr}>
          <label class="btn btn-secondary library-panel-move-toggle" for="libraryMoveGroupToggle">
            Change group
          </label>
          <div class="library-panel-choice-grid">
            ${PANEL_ASSET_TYPE_OPTIONS.map(([value, label]) => `
              <button
                class="btn btn-secondary btn-sm library-panel-choice-btn${assetTypeRaw === value ? " is-current" : ""}"
                type="button"
                data-library-reclassify="${selectedAssetId}"
                data-asset-id="${selectedRegistryAssetId}"
                data-current-asset-type="${escapePanelHtml(assetTypeRaw)}"
                data-target-asset-type="${escapePanelHtml(value)}"
                ${durableDisabledAttr}
              >${escapePanelHtml(label)}${assetTypeRaw === value ? '<span class="library-panel-current-chip">Current</span>' : ""}</button>
            `).join("")}
          </div>
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
