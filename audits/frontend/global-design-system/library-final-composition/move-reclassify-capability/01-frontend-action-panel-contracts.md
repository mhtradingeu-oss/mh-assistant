# 01 — Frontend Action Panel Contracts

Generated: Sat Jun  6 11:05:56 CEST 2026

## action-panel.js
6:  const assetType = escapePanelHtml(selectedAsset?.type || selectedAsset?.asset_type || selectedAsset?.category || "n/a");
7:  const status = escapePanelHtml(toPanelStatusLabel(selectedAsset?.status || "n/a"));
8:  const sourceLabel = getPanelSourceOfTruth(selectedAsset) ? "Source of truth" : "Not source of truth";
11:  const copyPathValue = escapePanelHtml(filePath);
15:  const copyDisabledAttr = hasSelectedAsset && copyPathValue ? "" : " disabled aria-disabled=\"true\"";
20:    <section class="card library-action-panel" data-library-action-panel>
36:          <strong>${status}</strong>
44:          <strong>${escapePanelHtml(sourceLabel)}</strong>
51:          <button class="btn btn-primary" type="button" data-library-open="${selectedAssetId}"${disabledAttr}>Open asset</button>
52:          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>
59:          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy asset path</button>
67:      ? `<button class="btn btn-secondary" type="button" disabled aria-disabled="true">${escapePanelHtml(selectedAsset?.source_label || "Managed")}</button>`
68:      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetId}"${disabledAttr}>${escapePanelHtml(getPanelSourceOfTruth(selectedAsset) ? "Remove source mark" : "Mark as source")}</button>
69:             <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Approve for use</button>
70:             <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Mark for review</button>`}
71:          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Rename asset</button>
72:          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Archive asset</button>
78:        <button class="btn btn-secondary library-danger-action" type="button" data-library-delete="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}" title="Soft-delete this asset after confirmation"${durableDisabledAttr}>Soft-delete asset</button>
95:  return Boolean(asset?.source_of_truth ?? asset?.sourceOfTruth ?? asset?.is_source_of_truth);

## library.js handlers
19:    asset_type: asset.asset_type,
38:  archiveProjectAsset,
39:  deleteProjectAsset,
42:  renameProjectAsset,
43:  setProjectAssetSourceOfTruth,
44:  updateProjectAssetStatus,
298:  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
473:  anchor.remove();
488:          const button = event.target.closest?.("[data-copy-asset-path]");
493:          const value = button.getAttribute("data-copy-asset-path") || "";
557:      selectedType: "all",
561:      folderKey: "all_assets",
585:    item.classList.remove("is-open");
601:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
603:    throw new Error("Choose a valid upload category.");
612:function getCategoryByType(categoryReadiness) {
614:  asArray(categoryReadiness).forEach((item) => {
615:    const key = asString(item.asset_type).trim().toLowerCase();
657:function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
658:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
685:    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
690:    const category = categoryByType.get(canonicalType) || {};
704:      category.status ||
726:        asset_type: canonicalType,
745:      asset_type: canonicalType || "asset",
803:    asset_type: managedType,
804:    category_label: "Media Studio Generated",
805:    category_status: "Uploaded",
908:      : "Required assets are covered. Continue with classification and approvals."
912:function buildCategoryBuckets(categoryReadiness) {
913:  const categoryByType = getCategoryByType(categoryReadiness);
917:      .map((type) => categoryByType.get(type))
940:function buildRequiredAssetGroups(categoryReadiness) {
941:  const categoryByType = getCategoryByType(categoryReadiness);
945:      .map((type) => categoryByType.get(type))
965:      action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"
971:  const selectedFolderKey = session.folderKey || "all_assets";
974:  const selectedType = session.selectedType || "all";
993:    const assetType = asString(asset.asset_type).trim().toLowerCase();
1014:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
1016:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1025:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
1027:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
1052:      const assetType = asString(asset.asset_type).trim().toLowerCase();
1370:  if (mode === "classify") {
1371:    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
1441:      overlay.remove();
1532:  setTimeout(() => target.classList.remove(highlightClass), 2600);
1542:  categoryReadiness,
1562:      categoryReadiness,
1582:  const categoryByType = getCategoryByType(categoryReadiness);
1591:    ...normalizeAssets(projectName, workspaceAssetsData, registry, categoryByType, catalog)
1593:  const requiredGroups = buildRequiredAssetGroups(categoryReadiness);
1594:  const categoryBuckets = buildCategoryBuckets(categoryReadiness);
1595:  const bucketMap = new Map(categoryBuckets.map((item) => [item.key, item]));
1630:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
1635:      .filter((item) => !managedTypeOptions.includes(item.asset_type))
1636:      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
1715:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1717:    typeSelect.value = session.selectedType || "all";
1718:    typeSelect.removeAttribute("disabled");
1719:    typeSelect.removeAttribute("readonly");
1726:          session.selectedType = value;
1737:        categoryReadiness,
1768:        categoryReadiness,
1785:    sourceSelect.removeAttribute("disabled");
1786:    sourceSelect.removeAttribute("readonly");
1804:        categoryReadiness,
1835:        categoryReadiness,
1869:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
1947:          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
2051:              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
2056:      : `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;
2082:        session.folderKey = mappedFolder.key;
2083:        session.selectedType = isReviewAction ? "all" : uploadType;
2096:          categoryReadiness,
2116:        showMessage?.(`Upload category set to ${uploadLabel}. Choose files, then upload them to this asset group.`);
2123:            setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);
2128:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
2146:          categoryReadiness,
2158:      if (input) input.value = buildAiPrompt(projectName, "classify");
2186:        categoryReadiness,
2221:        categoryReadiness,
2250:        categoryReadiness,
2293:  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
2296:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
2300:        value: folderKey
2303:          session.folderKey = value;
2373:  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
2383:      const assetId = button.getAttribute("data-library-source-truth") || "";
2391:        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
2394:        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
2404:  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
2414:      const status = button.getAttribute("data-asset-status-action") || "needs_review";
2416:      const assetId = button.getAttribute("data-asset-id") || "";
2430:        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
2443:  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
2453:      const id = button.getAttribute("data-library-archive") || "";
2454:      const assetId = button.getAttribute("data-asset-id") || "";
2462:      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry. This does not delete the physical file.\n\nSelect Cancel to keep this asset active.`)) {
2467:        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
2477:  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
2487:      const id = button.getAttribute("data-library-rename") || "";
2488:      const assetId = button.getAttribute("data-asset-id") || "";
2508:        await renameProjectAsset(activeProjectName, assetId, normalized);
2518:  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
2528:      const id = button.getAttribute("data-library-delete") || "";
2529:      const assetId = button.getAttribute("data-asset-id") || "";
2537:      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows. This action does not silently publish, approve, or run workflows.\n\nSelect Cancel to keep this asset available.`)) {
2542:        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
2583:      showMessage?.(`Upload category set to ${uploadType}.`);
2638:      const assetType = item.asset_type;
2717:          dropZone.classList.remove("is-drag-active");
2745:        picker.remove();
2786:        showError?.(error.message || "Invalid upload category.");
2802:        categoryReadiness,
2817:              asset_type: assetType,
2824:              asset_type: assetType,
2884:  const classifyBtn = $("libraryAiClassifyBtn");
2885:  if (classifyBtn) {
2886:    classifyBtn.onclick = () => {
2888:      if (input) input.value = buildAiPrompt(projectName, "classify");
2942:      if (input) input.value = buildAiPrompt(projectName, "classify");
3014:            guideBox.remove();
3026:          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
3042:    const categoryReadiness = getCategoryReadinessList(assetsData);
3045:    const renderCategoryByType = getCategoryByType(categoryReadiness);
3059:      requiredGroups: buildRequiredAssetGroups(categoryReadiness)
3094:            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
3113:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3116:              <div class="setup-helper">Upload and classify for readiness in one step.</div>
3136:      const active = (session.folderKey || "all_assets") === folder.key;
3138:                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
3220:      categoryReadiness,
