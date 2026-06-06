# LIB-FILTER-1C — Real Type Option Label Source

Generated: Sat Jun  6 21:18:59 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: 859f5d7

## Relevant type option code
19:    asset_type: asset.asset_type,
59:const LIBRARY_UPLOAD_TYPE_LABELS = {
77:  return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
299:  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
600:function getUploadAssetType(session, catalog, selectedValue) {
602:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
616:    const key = asString(item.asset_type).trim().toLowerCase();
658:function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
659:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
686:    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
687:    const canonicalType = getCanonicalAssetType(rawType, catalog);
692:    const catalogItem = catalogMap.get(canonicalType) || {};
727:        asset_type: canonicalType,
746:      asset_type: canonicalType || "asset",
747:      type_label: catalogItem.display_label || catalogItem.label || titleCase(canonicalType || "asset"),
752:      used_in: asArray(merged.used_in || catalogItem.guidance?.used_in || ["Library"]),
804:    asset_type: managedType,
994:    const assetType = asString(asset.asset_type).trim().toLowerCase();
1015:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
1017:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1026:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
1028:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
1053:      const assetType = asString(asset.asset_type).trim().toLowerCase();
1582:  const catalog = getAssetCatalog(assetsData);
1592:    ...normalizeAssets(projectName, workspaceAssetsData, registry, categoryByType, catalog)
1631:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
1632:  const typeOptions = [
1635:    ...catalog
1636:      .filter((item) => !managedTypeOptions.includes(item.asset_type))
1637:      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
1713:  const typeSelect = $("libraryFilterTypeSelect");
1715:    typeSelect.innerHTML = typeOptions.map((option) => `
1716:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1783:      <option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1870:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
1948:          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
2052:              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
2456:      const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);
2703:    const catalog = getAssetCatalog(assetsData);
2704:    uploadTypeSelect.innerHTML = catalog.map((item) => {
2705:      const assetType = item.asset_type;
2707:      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
2851:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
2884:              asset_type: assetType,
2891:              asset_type: assetType,
3180:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3220:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
3221:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
3226:                    <option value="active">Active (non-archived)</option>
3227:                    <option value="all">All statuses</option>
3228:                    <option value="draft">Draft</option>
3229:                    <option value="approved">Approved</option>
3230:                    <option value="needs_review">Needs review</option>
3231:                    <option value="publishing_ready">Publishing ready</option>
3232:                    <option value="sent_to_publishing">Sent to publishing</option>
3233:                    <option value="uploaded">Uploaded</option>
3234:                    <option value="rejected">Rejected</option>
3235:                    <option value="archived">Archived</option>
3245:                    <option value="updated_desc">Newest first</option>
3246:                    <option value="updated_asc">Oldest first</option>
3247:                    <option value="name_asc">Name A-Z</option>
3248:                    <option value="name_desc">Name Z-A</option>
3249:                    <option value="status">Status</option>
