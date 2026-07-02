# 01 — Active Library File Patch Signals

Generated: Sat Jun  6 09:45:56 CEST 2026

1487:function scrollLibraryTargetIntoView(target, highlightClass = "is-required-action-target") {
1493:  if (workspace && typeof workspace.scrollTo === "function") {
1496:    const currentTop = Number(workspace.scrollTop || 0);
1499:    workspace.scrollTo({
1510:function bindLibraryWorkspace({
1530:    bindLibraryWorkspace({
1673:            <small>${escapeHtml(`Files found: ${formatCount(item.totalCount)}`)}</small>
1677:              data-library-required-action="${escapeHtml(item.action)}"
1678:              data-library-required-key="${escapeHtml(item.key)}"
1679:              data-library-upload-type="${escapeHtml(item.uploadType)}"
1705:      bindLibraryWorkspace({
1736:      bindLibraryWorkspace({
1772:      bindLibraryWorkspace({
1803:      bindLibraryWorkspace({
2034:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
2037:      const action = button.getAttribute("data-library-required-action") || "review";
2038:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2039:      const requiredKey = button.getAttribute("data-library-required-key") || "";
2043:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2058:        session.selectedType = isReviewAction ? "all" : uploadType;
2059:        session.selectedStatus = isReviewAction ? "active" : session.selectedStatus;
2060:        session.selectedSource = isReviewAction ? "all" : session.selectedSource;
2061:        session.searchQuery = isReviewAction ? "" : session.searchQuery;
2064:        bindLibraryWorkspace({
2085:            const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
2086:            scrollLibraryTargetIntoView(assetWorkspace);
2093:          const assetIntake = document.querySelector(".library-actions-card") || document.getElementById("libraryDropZone");
2094:          const dropZone = document.getElementById("libraryDropZone");
2095:          scrollLibraryTargetIntoView(assetIntake);
2114:        bindLibraryWorkspace({
2154:      bindLibraryWorkspace({
2189:      bindLibraryWorkspace({
2218:      bindLibraryWorkspace({
2549:  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
2552:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2554:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2609:  const uploadTypeSelect = $("libraryUploadTypeSelect");
2632:  const dropZone = $("libraryDropZone");
2759:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
2770:      bindLibraryWorkspace({
2997:        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
3059:            <h3>Required Asset Evidence</h3>
3066:        <section class="card library-actions-card">
3068:            <h3>Asset Intake</h3>
3077:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
3085:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
3086:              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
3098:        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
3100:              <h3>Asset Workspace</h3>
3188:    bindLibraryWorkspace({

## Required cards render excerpt
          <li>Upload or select an asset.</li>
          <li>Mark important files as <span class="explainer-chip">Source of Truth</span> when needed.</li>
          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
        </ol>
      </section>
    `;
  }

  // --- Taxonomy Chips/Cards ---
  const taxonomyBox = $("libraryTaxonomyBox");
  if (taxonomyBox) {
    taxonomyBox.innerHTML = `
      <div class="library-taxonomy-chips" aria-label="Library taxonomy">
        <span class="taxonomy-chip" tabindex="0">Images</span>
        <span class="taxonomy-chip" tabindex="0">Videos</span>
        <span class="taxonomy-chip" tabindex="0">Documents</span>
        <span class="taxonomy-chip" tabindex="0">Brand Assets</span>
        <span class="taxonomy-chip" tabindex="0">Product Files</span>
        <span class="taxonomy-chip" tabindex="0">Proof / Legal / Pricing</span>
        <span class="taxonomy-chip" tabindex="0">Generated Assets</span>
        <span class="taxonomy-chip source-of-truth" tabindex="0">Source of Truth</span>
      </div>
    `;
  }

  // ...existing code...

  const requiredBox = $("libraryRequiredAssetsGrid");
  if (requiredBox) {
    requiredBox.innerHTML = requiredGroups.map((item) => {
      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";
      const reasonHint = item.why.length > 84 ? `${item.why.slice(0, 81)}...` : item.why;

      return `
        <article class="library-required-card">
          <div class="library-required-card-head">
            <h4>${escapeHtml(item.label)}</h4>
            <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
          </div>
          <p class="library-required-why">${escapeHtml(reasonHint)}</p>
          <div class="library-required-card-foot">
            <small>${escapeHtml(`Files found: ${formatCount(item.totalCount)}`)}</small>
            <button
              class="btn btn-secondary btn-sm"
              type="button"
              data-library-required-action="${escapeHtml(item.action)}"
              data-library-required-key="${escapeHtml(item.key)}"
              data-library-upload-type="${escapeHtml(item.uploadType)}"
            >${escapeHtml(actionLabel)}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  const typeSelect = $("libraryFilterTypeSelect");
  if (typeSelect) {
    typeSelect.innerHTML = typeOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>

## Required CTA handler excerpt
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
      : `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;
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
        const isReviewAction = action === "review";
        session.folderKey = mappedFolder.key;
        session.selectedType = isReviewAction ? "all" : uploadType;
        session.selectedStatus = isReviewAction ? "active" : session.selectedStatus;
        session.selectedSource = isReviewAction ? "all" : session.selectedSource;
        session.searchQuery = isReviewAction ? "" : session.searchQuery;
        session.page = 1;

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

        const uploadLabel = getLibraryUploadTypeLabel(uploadType);

        if (isReviewAction) {
          showMessage?.(`Showing ${mappedFolder.label} assets. Select a file, then use the action panel.`);
          setTimeout(() => {
            const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
            scrollLibraryTargetIntoView(assetWorkspace);
          }, 120);
          return;
        }

        showMessage?.(`Upload category set to ${uploadLabel}. Choose files, then upload them to this asset group.`);
        setTimeout(() => {
          const assetIntake = document.querySelector(".library-actions-card") || document.getElementById("libraryDropZone");
          const dropZone = document.getElementById("libraryDropZone");
          scrollLibraryTargetIntoView(assetIntake);
          if (dropZone && dropZone !== assetIntake) {
            dropZone.classList.add("is-required-action-target");
            setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);
          }
        }, 120);
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

## Route render excerpt
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
        }
      }
    }, 0);

    const registry = asObject(state.data.registry);
    const baseAssetsData = Array.isArray(state.data.assets) ? { assets: state.data.assets } : asObject(state.data.assets);
    const registryAssets = asArray(registry.assets || registry.items || registry.records);
    const assetsDataAssets = asArray(baseAssetsData.assets);
    const assetsData = {
      ...baseAssetsData,
      assets: assetsDataAssets.length ? assetsDataAssets : registryAssets
    };
    const operations = asObject(state.data.operations);
    const session = ensureLibrarySession(projectName);
    session.viewMode = "grid";
    const categoryReadiness = getCategoryReadinessList(assetsData);
    const missingRequiredAssets = getMissingAssetLabels(assetsData);
    const renderCatalog = getAssetCatalog(assetsData);
    const renderCategoryByType = getCategoryByType(categoryReadiness);
    const renderManagedAssets = getManagedMediaAssets(projectName, operations);
    const renderWorkspaceAssetsData = {
      ...assetsData,
      assets: getWorkspaceAssetItems(assetsData, registry)
    };
    const renderAllAssets = [
      ...renderManagedAssets,
      ...normalizeAssets(projectName, renderWorkspaceAssetsData, registry, renderCategoryByType, renderCatalog)
    ];
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
              <div class="setup-kicker">Asset Source Command</div>
              <h3>${escapeHtml(projectName ? `${projectName} Asset Library` : "Asset Library")}</h3>
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
            <h3>Required Asset Evidence</h3>
            <p class="card-subtitle">Track the source files, product data, media, and proof needed for campaign readiness. Review here does not approve, publish, or change asset truth automatically.</p>
            <span class="card-badge warning">Readiness gaps</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card library-actions-card">
          <div class="card-head">
            <h3>Asset Intake</h3>
            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
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
            <span class="card-badge neutral">Inspect, filter, and route trusted assets</span>
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
