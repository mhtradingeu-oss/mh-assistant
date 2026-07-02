# PHASE 3U.4 — Library Copy Target Markers

## Candidate copy strings
293:function buildPreviewUrl(projectName, asset) {
323:function getAssetPreviewUrl(asset) {
341:    getAssetPreviewUrl(asset)
387:  const previewUrl = getAssetPreviewUrl(asset);
724:      buildPreviewUrl(projectName, {
1070:function getPreviewExtensionForAsset(asset = {}) {
1086:function toDocumentPreviewLabel(extension = "") {
1096:function canAttemptDocumentPreview(asset = {}) {
1098:    getAssetPreviewUrl(asset) ||
1108:function renderPreview(asset, escapeHtml) {
1113:  const previewUrl = getAssetPreviewUrl(asset);
1114:  const protectedPreview = requiresProtectedMediaFetch(previewUrl);
1117:    if (protectedPreview) {
1127:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1133:    if (protectedPreview) {
1157:    if (protectedPreview) {
1167:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1173:    if (protectedPreview) {
1188:  const previewExtension = getPreviewExtensionForAsset(asset);
1191:    const previewUrl = getAssetPreviewUrl(asset);
1192:    const label = toDocumentPreviewLabel(previewExtension);
1206:    if (isPdf && canAttemptDocumentPreview(asset)) {
1242:      <div class="library-preview-copy">Preview not available for this file type.</div>
1247:async function hydrateProtectedAssetPreview({
1283:    if (getPreviewExtensionForAsset(asset) === "pdf") {
1297:      : `Preview unavailable: ${error.message || "Could not load this file."}`;
1806:        const assetPreviewUrl = getAssetPreviewUrl(asset);
1807:        const previewNode = asset.is_image && assetPreviewUrl
1808:          ? requiresProtectedMediaFetch(assetPreviewUrl)
1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
1871:  const previewVisual = $("libraryPreviewVisual");
1873:    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
1875:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
1876:    if (protectedPreviewNode && selectedAsset) {
1877:      hydrateProtectedAssetPreview({
1878:        previewNode: protectedPreviewNode,
1887:  const previewMeta = $("libraryPreviewMeta");
1904:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Source in AI Command</button>
1907:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then click Use as Source in AI Command.</span>
1933:      useBtn.textContent = "Use as Source in AI Command";
1934:      useBtn.setAttribute("aria-label", "Use as Source in AI Command");
2397:      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
2472:      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
2919:            "Select one Library item, then click Use as Source in AI Command.",
3019:            <h3>Required Assets</h3>
3027:            <h3>Asset Intake</h3>
3132:                    <h3>Preview</h3>
3134:                  <div id="libraryPreviewVisual"></div>
3135:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>

## Current related render ranges
  if (previewMeta) {
    previewMeta.innerHTML = selectedAsset
      ? `
        <div class="library-inspector-title">
          <strong>${escapeHtml(selectedAsset.name)}</strong>
          <span>${escapeHtml(selectedAsset.filename || basename(selectedAsset.file_path || "") || "-")}</span>
        </div>

        <div class="library-inspector-quick">
          <span class="card-badge ${escapeHtml(toStatusTone(selectedAsset.status))}">${escapeHtml(toStatusLabel(selectedAsset.status))}</span>
          <span class="card-badge ${selectedAsset.source_of_truth ? "success" : "neutral"}">${escapeHtml(selectedAsset.source_of_truth ? "Source" : "Not Source")}</span>
          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
        </div>

        <div class="library-inspector-path">${escapeHtml(assetContextHint(selectedAsset))}</div>

        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Source in AI Command</button>

        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
          <span class="library-inspector-ai-source-guide-text">Select one Library item, then click Use as Source in AI Command.</span>
        </div>

        <details class="library-inspector-more">
          <summary>Technical details</summary>
          <div class="data-stack">
            <div class="data-row"><span>Review Status</span><strong>${escapeHtml(toStatusLabel(selectedAsset.status))}</strong></div>
            <div class="data-row"><span>Source Status</span><strong>${escapeHtml(selectedAsset.source_of_truth ? "Source of truth" : "Not source of truth")}</strong></div>
            <div class="data-row"><span>Asset ID</span><strong>${escapeHtml(shortAssetId(selectedAsset.asset_id || selectedAsset.mutation_id || selectedAsset.id || "-"))}</strong></div>
            <div class="data-row"><span>Full Path</span><strong>${escapeHtml(selectedAsset.file_path || "-")}</strong></div>
            <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
            <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
            <div class="data-row"><span>Version</span><strong>${escapeHtml(asString(selectedAsset.version || selectedAsset.asset_version || "-") || "-")}</strong></div>
          </div>
        </details>
      `
      : `<div class="empty-box">Select an asset to preview context. Actions become available in the Action Panel.</div>`;
    // Bind Use as AI Source button (inspector and grid quick action)
    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
    if (useBtns.length === 0 && gridBody) {
      // fallback: try to find in grid
      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
      if (gridBtn && selectedAsset) useBtns = [gridBtn];
    }
    useBtns.forEach((useBtn) => {
      useBtn.classList.add("btn-primary", "std-ai-btn");
      useBtn.textContent = "Use as Source in AI Command";
      useBtn.setAttribute("aria-label", "Use as Source in AI Command");
      useBtn.onclick = () => {
        const asset = allAssets.find((a) => a.id === selectedAsset.id || a.asset_id === selectedAsset.id);
        if (!asset) {
          showError?.("Asset not found.");

      const id = button.getAttribute("data-library-asset") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
      if (!confirmed) {
        return;
      }

      try {
        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
  archiveButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before renaming assets.");
        return;
      }

      const id = button.getAttribute("data-library-rename") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!asset || !assetId) {
        showError?.("Asset not found.");
        return;
      }

      const nextName = await promptForTextInput("Rename asset", asset.name || "");
      if (nextName == null) {
        return;
      }

      const normalized = nextName.trim();
      if (!normalized) {
        showError?.("Asset name cannot be empty.");
        return;
      }

      try {
        await renameProjectAsset(activeProjectName, assetId, normalized);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset renamed.");
      } catch (error) {
        showError?.(error.message || "Failed to rename asset.");
      }
    };
  });

  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
  deleteButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
        return;
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }
    };
  });

  const actionToggleButtons = Array.from(document.querySelectorAll(".library-action-toggle"));
  actionToggleButtons.forEach((button) => {

    const folderCounts = computeFolderCounts(renderAllAssets, session);
    // Compute overview before render for KPI chips
    const overview = buildAssetOverview({
      assets: renderAllAssets,
      requiredGroups: buildRequiredAssetGroups(categoryReadiness)
    });
    const root = $("libraryRoot");
    if (!root) return;

    mountLibraryGlobalListeners();

    root.innerHTML = `
      <div class="library-smart-shell">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Asset Control System</div>
              <h3>${escapeHtml(projectName ? `${projectName} Asset Overview` : "Asset Overview")}</h3>
              <p class="setup-helper">
                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
              </p>
            </div>
            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh Library scan</button>
          </div>
          <div id="libraryOverviewCards" class="library-overview-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Required Assets</h3>
            <span class="card-badge warning">Readiness gaps</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card library-actions-card">
          <div class="card-head">
            <h3>Asset Intake</h3>
            <div class="library-action-toolbar">
              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
              <button id="libraryAiExtractBtn" class="btn btn-secondary" type="button">Extract Docs</button>
            </div>
          </div>
          <div class="library-upload-grid">
            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
              <strong>Upload asset to Library</strong>
              <span>Drop files or click to browse</span>
              <small id="libraryDropInfo">No files selected</small>
              <button id="libraryChooseFilesBtn" class="btn btn-secondary btn-sm" type="button">Choose Files</button>
              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
            </div>
            <div class="library-upload-controls">
              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                ${getAssetCatalog(assetsData).map((item) => `
                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
                `).join("")}
              </select>
              <div class="setup-helper">Upload and classify for readiness in one step.</div>
              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload asset to Library</button>
            </div>
          </div>
          <div id="libraryUploadSummary" class="library-upload-summary"></div>
        </section>

        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
            <div class="card-head">
              <h3>Asset Workspace</h3>
            <span class="card-badge neutral">Selected asset workspace</span>
          </div>
          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
            <div class="library-workspace-main">
              <div class="library-finder-topbar">
                <div class="library-finder-sidebar-title"></div>
                <div class="library-folder-list">
                  ${LIBRARY_FOLDERS.map((folder) => {
      const count = folderCounts.find((item) => item.key === folder.key)?.count || 0;
      const active = (session.folderKey || "all_assets") === folder.key;
      return `
                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
                        <span>${escapeHtml(folder.label)}</span>
                        <small>${escapeHtml(formatCount(count))}</small>
                      </button>
                    `;
    }).join("")}
                </div>
              </div>

              <div class="library-finder-toolbar">
                <button id="libraryToolbarUploadBtn" class="btn btn-secondary btn-sm" type="button">Quick Upload</button>
              </div>

              <div class="library-filter-bar">
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
                    <option value="active">Active (non-archived)</option>
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="needs_review">Needs review</option>
                    <option value="publishing_ready">Publishing ready</option>
                    <option value="sent_to_publishing">Sent to publishing</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="librarySortSelect">Sort</label>
                  <select id="librarySortSelect" class="setup-input" aria-label="Sort assets">
                    <option value="updated_desc">Newest first</option>
                    <option value="updated_asc">Oldest first</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div class="library-filter-field library-filter-search">
                  <label class="setup-label" for="librarySearchInput">Search</label>
                  <input id="librarySearchInput" class="setup-input" type="text" placeholder="Search by name, path, type, or usage" />
                </div>
              </div>

              <div id="libraryAssetGridBody" class="library-grid-body"></div>
              <div id="libraryGridPagination" class="library-grid-pagination"></div>
            </div>

            <aside class="library-workspace-side">
              <div class="library-side-stack">
                <section class="card library-preview-card">
                  <div class="card-head">
                    <h3>Preview</h3>
                  </div>
                  <div id="libraryPreviewVisual"></div>
                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
                </section>
                <div id="libraryActionPanelMount" class="library-panel-mount"></div>
                <div id="libraryAiPanelMount" class="library-panel-mount"></div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    `;
    bindLibraryWorkspace({
