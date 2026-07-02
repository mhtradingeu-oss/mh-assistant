# LIB-FINAL-4B — Required Asset Button Behavior Review

Generated: Sat Jun  6 08:44:44 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: e143d34

## Handler excerpt
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

## Related filter/render functions
19:    asset_type: asset.asset_type,
298:  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
561:      folderKey: "all_assets",
601:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
615:    const key = asString(item.asset_type).trim().toLowerCase();
658:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
685:    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
726:        asset_type: canonicalType,
745:      asset_type: canonicalType || "asset",
803:    asset_type: managedType,
971:  const selectedFolderKey = session.folderKey || "all_assets";
993:    const assetType = asString(asset.asset_type).trim().toLowerCase();
1014:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
1016:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1025:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
1027:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
1052:      const assetType = asString(asset.asset_type).trim().toLowerCase();
1582:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
1587:      .filter((item) => !managedTypeOptions.includes(item.asset_type))
1588:      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
1654:              data-library-required-action="${escapeHtml(item.action)}"
1655:              data-library-required-key="${escapeHtml(item.key)}"
1664:  const typeSelect = $("libraryFilterTypeSelect");
1821:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
1899:          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
2003:              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
2011:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
2014:      const action = button.getAttribute("data-library-required-action") || "review";
2016:      const requiredKey = button.getAttribute("data-library-required-key") || "";
2020:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2033:        session.folderKey = mappedFolder.key;
2038:          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
2041:            assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
2231:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
2235:        value: folderKey
2238:          session.folderKey = value;
2514:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2569:  const uploadTypeSelect = $("libraryUploadTypeSelect");
2573:      const assetType = item.asset_type;
2719:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
2752:              asset_type: assetType,
2759:              asset_type: assetType,
2957:        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
2960:          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
3045:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
3046:              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
3048:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3058:        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
3071:      const active = (session.folderKey || "all_assets") === folder.key;
3088:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
3089:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
