# LIB-FILTER-1A — Asset Type Filter Label Audit

Generated: Sat Jun  6 21:10:47 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: 7778531

## Status
?? audits/frontend/global-design-system/library-final-composition/type-filter-labels/

## Type / Label Signals
public/control-center/pages/library.js:19:    asset_type: asset.asset_type,
public/control-center/pages/library.js:59:const LIBRARY_UPLOAD_TYPE_LABELS = {
public/control-center/pages/library.js:62:  product_csv: "Product Data",
public/control-center/pages/library.js:72:  partner_docs: "Partner Documents"
public/control-center/pages/library.js:77:  return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
public/control-center/pages/library.js:117:    label: "Product CSV / Product Data",
public/control-center/pages/library.js:155:  { key: "product_data", label: "Product Data", types: ["product_csv"] },
public/control-center/pages/library.js:299:  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
public/control-center/pages/library.js:602:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
public/control-center/pages/library.js:616:    const key = asString(item.asset_type).trim().toLowerCase();
public/control-center/pages/library.js:659:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
public/control-center/pages/library.js:686:    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
public/control-center/pages/library.js:727:        asset_type: canonicalType,
public/control-center/pages/library.js:746:      asset_type: canonicalType || "asset",
public/control-center/pages/library.js:747:      type_label: catalogItem.display_label || catalogItem.label || titleCase(canonicalType || "asset"),
public/control-center/pages/library.js:804:    asset_type: managedType,
public/control-center/pages/library.js:994:    const assetType = asString(asset.asset_type).trim().toLowerCase();
public/control-center/pages/library.js:1015:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
public/control-center/pages/library.js:1017:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
public/control-center/pages/library.js:1026:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
public/control-center/pages/library.js:1028:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
public/control-center/pages/library.js:1053:      const assetType = asString(asset.asset_type).trim().toLowerCase();
public/control-center/pages/library.js:1631:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
public/control-center/pages/library.js:1632:  const typeOptions = [
public/control-center/pages/library.js:1636:      .filter((item) => !managedTypeOptions.includes(item.asset_type))
public/control-center/pages/library.js:1637:      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
public/control-center/pages/library.js:1713:  const typeSelect = $("libraryFilterTypeSelect");
public/control-center/pages/library.js:1715:    typeSelect.innerHTML = typeOptions.map((option) => `
public/control-center/pages/library.js:1870:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
public/control-center/pages/library.js:1948:          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
public/control-center/pages/library.js:2052:              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
public/control-center/pages/library.js:2456:      const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);
public/control-center/pages/library.js:2705:      const assetType = item.asset_type;
public/control-center/pages/library.js:2884:              asset_type: assetType,
public/control-center/pages/library.js:2891:              asset_type: assetType,
public/control-center/pages/library.js:3180:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
public/control-center/pages/library.js:3220:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
public/control-center/pages/library.js:3221:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
public/control-center/pages/library/action-panel.js:4:  ["product_csv", "Product Data / CSV"],
public/control-center/pages/library/action-panel.js:14:  ["partner_docs", "Partner Documents"]
public/control-center/pages/library/action-panel.js:22:  const assetTypeRaw = String(selectedAsset?.type || selectedAsset?.asset_type || selectedAsset?.category || "n/a").trim().toLowerCase();
runtime/orchestrator-service/server.js:4916:    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);
runtime/orchestrator-service/server.js:4922:    asset_type: job.asset_type,
runtime/orchestrator-service/server.js:5014:    asset_type: assetType,
runtime/orchestrator-service/server.js:5090:    asset_type: assetType,
runtime/orchestrator-service/server.js:5168:    asset_type: assetType,
runtime/orchestrator-service/server.js:5227:    asset_type: assetType,
runtime/orchestrator-service/server.js:5359:    asset_type: assetType,
runtime/orchestrator-service/server.js:5615:        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
runtime/orchestrator-service/server.js:7289:  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
runtime/orchestrator-service/server.js:7401:  const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || normalizeSetupTextValue(asset.type || asset.asset_type).toLowerCase();
runtime/orchestrator-service/server.js:7420:    asset_type: canonicalType,
runtime/orchestrator-service/server.js:8298:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8300:    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
runtime/orchestrator-service/server.js:8304:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8307:    .map(item => item.asset_type);
runtime/orchestrator-service/server.js:8312:    required_asset_types: required,
runtime/orchestrator-service/server.js:8313:    registered_asset_types: [...new Set(assetTypes)].sort(),
runtime/orchestrator-service/server.js:8323:      asset_type: 'logo',
runtime/orchestrator-service/server.js:8339:      asset_type: 'brand_guideline',
runtime/orchestrator-service/server.js:8340:      label: 'Brand Guideline / Markenrichtlinie',
runtime/orchestrator-service/server.js:8355:      asset_type: 'product_csv',
runtime/orchestrator-service/server.js:8356:      label: 'Product Data / Produktdaten',
runtime/orchestrator-service/server.js:8371:      asset_type: 'pricing_doc',
runtime/orchestrator-service/server.js:8387:      asset_type: 'legal_doc',
runtime/orchestrator-service/server.js:8403:      asset_type: 'product_photos',
runtime/orchestrator-service/server.js:8419:      asset_type: 'product_videos',
runtime/orchestrator-service/server.js:8435:      asset_type: 'social_assets',
runtime/orchestrator-service/server.js:8451:      asset_type: 'campaign_assets',
runtime/orchestrator-service/server.js:8467:      asset_type: 'packaging_images',
runtime/orchestrator-service/server.js:8483:      asset_type: 'testimonials_reviews',
runtime/orchestrator-service/server.js:8499:      asset_type: 'certificates',
runtime/orchestrator-service/server.js:8515:      asset_type: 'partner_docs',
runtime/orchestrator-service/server.js:8516:      label: 'Partner Documents / Partnerdokumente',
runtime/orchestrator-service/server.js:8538:    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
runtime/orchestrator-service/server.js:8540:      return item.asset_type;
runtime/orchestrator-service/server.js:8549:  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
runtime/orchestrator-service/server.js:8573:    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
runtime/orchestrator-service/server.js:8829:      asset_type: 'product_csv',
runtime/orchestrator-service/server.js:8838:      asset_type: 'product_photos',
runtime/orchestrator-service/server.js:8847:      asset_type: 'product_videos',
runtime/orchestrator-service/server.js:8935:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8945:    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:8952:    const canonicalType = getCanonicalAssetType(scanned.asset_type) || String(scanned.asset_type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:9012:    const matchingAssets = assets.filter(asset => getCanonicalAssetType(asset.asset_type) === item.asset_type);
runtime/orchestrator-service/server.js:9029:    if (item.asset_type === 'product_csv') {
runtime/orchestrator-service/server.js:9037:    } else if (item.asset_type === 'product_photos') {
runtime/orchestrator-service/server.js:9058:      asset_type: item.asset_type,
runtime/orchestrator-service/server.js:9059:      internal_key: item.asset_type,
runtime/orchestrator-service/server.js:9061:      display_label: item.label,
runtime/orchestrator-service/server.js:9075:        item.asset_type === 'product_csv'
runtime/orchestrator-service/server.js:9077:          : item.asset_type === 'product_photos'
runtime/orchestrator-service/server.js:9088:        item.asset_type === 'product_photos' && status === 'Needs Review'
runtime/orchestrator-service/server.js:9143:      asset_type: item.asset_type,
runtime/orchestrator-service/server.js:9205:  const item = catalog.find(x => x.asset_type === canonicalType);
runtime/orchestrator-service/server.js:9259:    asset_type: assetType,
runtime/orchestrator-service/server.js:9281:      const folderInfo = getTargetFolderForAssetType(projectName, asset.asset_type);
runtime/orchestrator-service/server.js:9291:      asset_type: asset.asset_type,
runtime/orchestrator-service/server.js:10895:    const requestedType = String(req.body?.asset_type || req.body?.type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:10903:      return res.status(400).json({ error: 'Missing asset_type.' });
runtime/orchestrator-service/server.js:10907:    const catalogItem = getAssetTypeCatalog().find((item) => item.asset_type === canonicalType);
runtime/orchestrator-service/server.js:10911:        error: 'Invalid asset_type.',
runtime/orchestrator-service/server.js:10912:        requested_asset_type: requestedType,
runtime/orchestrator-service/server.js:10913:        allowed: getAssetTypeCatalog().map((item) => item.asset_type)
runtime/orchestrator-service/server.js:10924:      const previousAssetType = String(asset.asset_type || asset.type || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:10926:      asset.previous_asset_type = previousAssetType || asset.previous_asset_type || '';
runtime/orchestrator-service/server.js:10927:      asset.asset_type = canonicalType;
runtime/orchestrator-service/server.js:10938:      asset_type: canonicalType
runtime/orchestrator-service/server.js:15382:  const requiredAssetTypes = new Set(getAssetTypeCatalog().filter(item => item.required).map(item => item.asset_type));
runtime/orchestrator-service/server.js:15621:        asset_type: category.asset_type,
runtime/orchestrator-service/server.js:21460:if (command === '/list_asset_type_catalog') {
public/control-center/api.js:1537:      asset_type: normalizedAssetType,
