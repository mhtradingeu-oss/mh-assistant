# LIB-FINAL-2A — Active Library Shell Anchors

Generated: Sat Jun  6 07:56:46 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: ed0067e

## Render anchors
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
1798:  const gridBody = $("libraryAssetGridBody");
1806:        const assetPreviewUrl = getAssetPreviewUrl(asset);
1807:        const previewNode = asset.is_image && assetPreviewUrl
1808:          ? requiresProtectedMediaFetch(assetPreviewUrl)
1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
1829:  const gridPagination = $("libraryGridPagination");
1871:  const previewVisual = $("libraryPreviewVisual");
1873:    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
1875:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
1876:    if (protectedPreviewNode && selectedAsset) {
1877:      hydrateProtectedAssetPreview({
1878:        previewNode: protectedPreviewNode,
1887:  const previewMeta = $("libraryPreviewMeta");
2269:  const finderWorkspace = $("libraryFinderWorkspace");
2592:  const dropZone = $("libraryDropZone");
3006:              <div class="setup-kicker">Asset Control System</div>
3007:              <h3>${escapeHtml(projectName ? `${projectName} Asset Overview` : "Asset Overview")}</h3>
3019:            <h3>Required Assets</h3>
3028:            <h3>Asset Intake</h3>
3037:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
3060:              <h3>Asset Workspace</h3>
3064:            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
3126:              <div id="libraryAssetGridBody" class="library-grid-body"></div>
3127:              <div id="libraryGridPagination" class="library-grid-pagination"></div>
3134:                    <h3>Preview</h3>
3135:                    <p class="card-subtitle">Preview selected evidence or media. Protected files are loaded through the protected media endpoint.</p>
3137:                  <div id="libraryPreviewVisual"></div>
3138:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>

## Top shell excerpt
        asset: selectedAsset,
        escapeHtml,
        showError
      });
    }
  }

  const previewMeta = $("libraryPreviewMeta");
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

        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Review Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Review Source in AI Command</button>

        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
          <span class="library-inspector-ai-source-guide-text">Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.</span>
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
      useBtn.textContent = "Use as Review Source in AI Command";
      useBtn.setAttribute("aria-label", "Use as Review Source in AI Command");
      useBtn.onclick = () => {
        const asset = allAssets.find((a) => a.id === selectedAsset.id || a.asset_id === selectedAsset.id);
        if (!asset) {
          showError?.("Asset not found.");
          return;
        }
        const payload = buildAiSourcePayloadFromAsset(asset);
        const activeProjectName = resolveActiveProjectName();
        const sourceProjectName = resolveActiveProjectName?.() || asString(projectName || "").trim().toLowerCase() || "__default__";
        setSharedAiSource(sourceProjectName, payload);
        setSharedAiSource("__default__", payload);

        // Preserve/set drawer return context
        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
        if (bridgeReturn && bridgeReturn.drawerReturnContext) {
          setSharedAiDrawerReturn(activeProjectName || "__default__", bridgeReturn.drawerReturnContext);
          setSharedAiDrawerReturn("__default__", bridgeReturn.drawerReturnContext);
        }

        clearSharedLibrarySourceBridge(sourceProjectName);
        clearSharedLibrarySourceBridge("__default__");
        showMessage?.("Source added to drawer.");
        navigateTo("ai-command");
      };
    });
  }

  const actionPanelMount = $("libraryActionPanelMount");
  if (actionPanelMount) {
    actionPanelMount.innerHTML = renderLibraryActionPanel({
      selectedAsset,
      disabled: false
    });
  }

  const aiPanelMount = $("libraryAiPanelMount");
  if (aiPanelMount) {
    aiPanelMount.innerHTML = renderLibraryAiPanel({
      readiness: readinessSummary,
      selectedAsset,
      disabled: false
    });
  }

  const activityBox = $("libraryRecentActivity");
  if (activityBox) {
    activityBox.innerHTML = recentActivity.length
      ? `
        <ul class="simple-list">
          ${recentActivity.map((asset) => `
            <li>
              <strong>${escapeHtml(asset.name)}</strong>
              <span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>
            </li>
          `).join("")}
        </ul>
      `
      : `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;
  }

  const uploadSummary = $("libraryUploadSummary");
  if (uploadSummary) {
    uploadSummary.innerHTML = session.recentUploads.length
      ? `
        <ul class="simple-list">
          ${session.recentUploads.slice(0, 5).map((item) => `
            <li>
              <strong>${escapeHtml(item.filename)}</strong>
              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
            </li>
          `).join("")}
        </ul>
      `
      : `<div class="empty-box">No uploads in this session yet. Choose files and upload them to start building the asset library.</div>`;
  }

  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
  requiredActionButtons.forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-library-required-action") || "review";
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
      const requiredKey = button.getAttribute("data-library-required-key") || "";

      // Always set upload type
      session.uploadType = uploadType;
      const uploadTypeSelect = $("libraryUploadTypeSelect");
      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;

      // Try to find a matching folder/filter for the required asset group
      let mappedFolder = null;
      for (const folder of LIBRARY_FOLDERS) {
        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
          mappedFolder = folder;
          break;
        }
      }

      if (mappedFolder) {
        session.folderKey = mappedFolder.key;
        session.selectedType = uploadType;
        session.page = 1;
        // Focus/scroll asset workspace
        setTimeout(() => {
          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
          if (assetWorkspace) {
            assetWorkspace.classList.add("is-required-action-target");
            assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => assetWorkspace.classList.remove("is-required-action-target"), 2000);
          }
        }, 0);
        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,

## Asset workspace excerpt
          navigateTo,
          reloadProjectData,
          showMessage,
          showError,
          escapeHtml
        });
        return;
      } else {
        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
      }

      if (action === "upload") {
        const uploadInput = $("libraryUploadInput");
        uploadInput?.click();
        return;
      }

      if (action === "review") {
        session.selectedStatus = "needs_review";
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,
          reloadProjectData,
          showMessage,
          showError,
          escapeHtml
        });
        return;
      }

      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "classify");
      navigateTo("ai-command");
      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
    };
  });

  const selectButtons = Array.from(document.querySelectorAll("[data-library-select]"));
  selectButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatchLibraryCommand("select-asset", {
        assetId: button.getAttribute("data-library-select") || ""
      }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selectedId = button.getAttribute("data-library-select") || "";
      const selected = allAssets.find((asset) => asset.id === selectedId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const selectableRows = Array.from(document.querySelectorAll("[data-library-row-select]"));
  selectableRows.forEach((row) => {
    row.onclick = (event) => {
      if (isLibraryInteractiveElement(event.target)) {
        return;
      }

      const nextId = row.getAttribute("data-library-row-select") || "";
      if (!nextId) return;

      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };

    row.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const nextId = row.getAttribute("data-library-row-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
  selectableCards.forEach((card) => {
    card.onclick = (event) => {
      if (isLibraryInteractiveElement(event.target)) return;
      const nextId = card.getAttribute("data-library-grid-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const _fbCard = allAssets.find((a) => a.id === nextId);
      if (_fbCard?.name) showMessage?.(`Selected ${_fbCard.name}. Review status and available actions.`);
      rerender();
    };

    card.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const nextId = card.getAttribute("data-library-grid-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      rerender();
    };
  });

  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
  folderButtons.forEach((button) => {
    button.onclick = () => {
      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";

      dispatchLibraryCommand("set-filter", {
        filter: "folder",
        value: folderKey
      }, {
        "set-filter": ({ value }) => {
          session.folderKey = value;
          session.page = 1;

          if (value === "archived") {
            session.selectedStatus = "archived";
          }
        }
      });
