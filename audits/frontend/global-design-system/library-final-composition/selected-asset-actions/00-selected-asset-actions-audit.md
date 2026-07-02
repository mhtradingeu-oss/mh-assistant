# LIB-UX-1A — Selected Asset Preview Actions Audit

Generated: Sat Jun  6 22:08:33 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: aa8d840

## Current Signals
public/control-center/pages/library.js:20:    source_label: asset.source_label || asset.name || "Library asset",
public/control-center/pages/library.js:21:    source_of_truth: asset.source_of_truth,
public/control-center/pages/library.js:22:    text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
public/control-center/pages/library.js:70:  testimonials_reviews: "Testimonials & Reviews",
public/control-center/pages/library.js:94:  { key: "documents", label: "Documents", types: ["brand_guideline", "partner_docs", "testimonials_reviews", "certificates"] },
public/control-center/pages/library.js:133:    why: "Video source assets are required for reels, demos, and cutdowns.",
public/control-center/pages/library.js:146:    types: ["partner_docs", "testimonials_reviews", "certificates"],
public/control-center/pages/library.js:166:  { key: "research_certificates", label: "Research / Certificates", types: ["partner_docs", "testimonials_reviews", "certificates"] },
public/control-center/pages/library.js:168:  { key: "source_of_truth", label: "Source of Truth" },
public/control-center/pages/library.js:299:function buildPreviewUrl(projectName, asset) {
public/control-center/pages/library.js:329:function getAssetPreviewUrl(asset) {
public/control-center/pages/library.js:332:    asset.preview_url
public/control-center/pages/library.js:347:    getAssetPreviewUrl(asset)
public/control-center/pages/library.js:393:  const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:394:  const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
public/control-center/pages/library.js:396:  if (!requiresProtectedMediaFetch(previewUrl)) {
public/control-center/pages/library.js:398:      objectUrl: previewUrl,
public/control-center/pages/library.js:426:    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
public/control-center/pages/library.js:520:            preview_url: fileUrl,
public/control-center/pages/library.js:636:  if (normalized.includes("needs_review") || normalized.includes("review")) return "needs_review";
public/control-center/pages/library.js:648:  if (value === "needs_review") return "Needs Review";
public/control-center/pages/library.js:659:  if (value === "needs_review") return getAssetStatusTone("needs review");
public/control-center/pages/library.js:707:      merged.review_status ||
public/control-center/pages/library.js:727:    const previewUrl = merged.preview_url ||
public/control-center/pages/library.js:730:      buildPreviewUrl(projectName, {
public/control-center/pages/library.js:740:      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth)
public/control-center/pages/library.js:754:      source_label: asString(merged.source_label || merged.source || merged.scan_source || "Library"),
public/control-center/pages/library.js:755:      source_key: asString(merged.source_key || merged.source || merged.scan_source || "library").toLowerCase(),
public/control-center/pages/library.js:756:      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth),
public/control-center/pages/library.js:763:      preview_url: previewUrl,
public/control-center/pages/library.js:784:function normalizeManagedMediaAsset(rawAsset = {}, index = 0, sourceKind = "local") {
public/control-center/pages/library.js:806:    source_signature: asString(asset.source_signature),
public/control-center/pages/library.js:812:    status: normalizeReadinessStatus(asset.status || asset.readiness_status || "needs_review"),
public/control-center/pages/library.js:814:    source_of_truth: false,
public/control-center/pages/library.js:817:    preview_url: firstValidUrl(imageUrl, videoUrl, audioUrl),
public/control-center/pages/library.js:825:    text_preview: promptText || briefText,
public/control-center/pages/library.js:826:    json_preview: payload,
public/control-center/pages/library.js:834:    source_kind: sourceKind,
public/control-center/pages/library.js:835:    source_label: sourceKind === "backend" ? "Media Studio (backend handoff)" : "Media Studio (local handoff)"
public/control-center/pages/library.js:854:    .filter((item) => asString(item?.destination_page) === "library" && asString(item?.source_page) === "media-studio")
public/control-center/pages/library.js:873:    const key = asString(asset.source_signature || asset.asset_id || asset.id);
public/control-center/pages/library.js:898:  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
public/control-center/pages/library.js:900:  const sourceOfTruthAssets = assets.filter((asset) => asset.source_of_truth).length;
public/control-center/pages/library.js:901:  const sourceCoverage = assets.length ? Math.round((sourceOfTruthAssets / assets.length) * 100) : 0;
public/control-center/pages/library.js:902:  const nextAction = requiredGroups.find((item) => item.status === "missing") || requiredGroups.find((item) => item.status === "needs_review") || null;
public/control-center/pages/library.js:909:    sourceOfTruthAssets,
public/control-center/pages/library.js:910:    sourceCoverage,
public/control-center/pages/library.js:931:    } else if (statuses.some((value) => value === "missing" || value === "needs_review" || value === "uploaded")) {
public/control-center/pages/library.js:958:    } else if (entries.length && statuses.some((value) => value === "needs_review" || value === "uploaded" || value === "rejected" || value === "archived")) {
public/control-center/pages/library.js:959:      status = "needs_review";
public/control-center/pages/library.js:961:      status = "needs_review";
public/control-center/pages/library.js:971:      action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"
public/control-center/pages/library.js:1001:    if (selectedFolderKey === "source_of_truth") return Boolean(asset.source_of_truth);
public/control-center/pages/library.js:1063:      if (folder.key === "source_of_truth") return Boolean(asset.source_of_truth);
public/control-center/pages/library.js:1076:function getPreviewExtensionForAsset(asset = {}) {
public/control-center/pages/library.js:1082:    asset.preview_url ||
public/control-center/pages/library.js:1092:function toDocumentPreviewLabel(extension = "") {
public/control-center/pages/library.js:1102:function canAttemptDocumentPreview(asset = {}) {
public/control-center/pages/library.js:1104:    getAssetPreviewUrl(asset) ||
public/control-center/pages/library.js:1108:    asset.preview_url ||
public/control-center/pages/library.js:1114:function renderPreview(asset, escapeHtml) {
public/control-center/pages/library.js:1116:    return `<div class="empty-box">Select an asset to preview details, open files, copy paths, or prepare review actions.</div>`;
public/control-center/pages/library.js:1119:  const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1120:  const protectedPreview = requiresProtectedMediaFetch(previewUrl);
public/control-center/pages/library.js:1122:  if (asset.is_image && asString(asset.image_url || previewUrl).trim()) {
public/control-center/pages/library.js:1123:    if (protectedPreview) {
public/control-center/pages/library.js:1125:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1126:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1132:      <div class="library-preview-frame">
public/control-center/pages/library.js:1133:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1138:  if (asset.is_video && asString(asset.video_url || previewUrl).trim()) {
public/control-center/pages/library.js:1139:    if (protectedPreview) {
public/control-center/pages/library.js:1141:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1142:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1148:      <div class="library-preview-frame">
public/control-center/pages/library.js:1149:        <video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url || previewUrl))}"></video>
public/control-center/pages/library.js:1154:  if (asset.is_audio && asString(asset.audio_url || previewUrl).trim()) {
public/control-center/pages/library.js:1156:      <div class="library-preview-frame">
public/control-center/pages/library.js:1157:        <audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
public/control-center/pages/library.js:1162:  if (asset.is_image && previewUrl) {
public/control-center/pages/library.js:1163:    if (protectedPreview) {
public/control-center/pages/library.js:1165:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1166:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1172:      <div class="library-preview-frame">
public/control-center/pages/library.js:1173:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1178:  if (asset.is_video && previewUrl) {
public/control-center/pages/library.js:1179:    if (protectedPreview) {
public/control-center/pages/library.js:1181:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1182:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1188:      <div class="library-preview-frame">
public/control-center/pages/library.js:1189:        <video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>
public/control-center/pages/library.js:1194:  const previewExtension = getPreviewExtensionForAsset(asset);
public/control-center/pages/library.js:1196:  if (isDocumentExtension(previewExtension)) {
public/control-center/pages/library.js:1197:    const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1198:    const label = toDocumentPreviewLabel(previewExtension);
public/control-center/pages/library.js:1199:    const isPdf = previewExtension === "pdf";
public/control-center/pages/library.js:1200:    const openButton = previewUrl
public/control-center/pages/library.js:1204:    if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {
public/control-center/pages/library.js:1206:        <div class="library-pdf-preview">
public/control-center/pages/library.js:1207:          <iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
public/control-center/pages/library.js:1212:    if (isPdf && canAttemptDocumentPreview(asset)) {
public/control-center/pages/library.js:1214:        <div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1215:          <div class="library-preview-extension">PDF</div>
public/control-center/pages/library.js:1217:          <div class="library-preview-copy">Loading protected PDF preview...</div>
public/control-center/pages/library.js:1223:      <div class="library-preview-fallback library-document-preview">
public/control-center/pages/library.js:1224:        <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
public/control-center/pages/library.js:1226:        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
public/control-center/pages/library.js:1227:        <div class="library-document-preview-actions">
public/control-center/pages/library.js:1236:  if (asset.text_preview) {
public/control-center/pages/library.js:1237:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
public/control-center/pages/library.js:1240:  const jsonFallback = JSON.stringify(asset.json_preview || asset.media_payload || {}, null, 2);
public/control-center/pages/library.js:1242:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
public/control-center/pages/library.js:1246:    <div class="library-preview-fallback">
public/control-center/pages/library.js:1247:      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
public/control-center/pages/library.js:1248:      <div class="library-preview-copy">Preview not available for this file type.</div>
public/control-center/pages/library.js:1253:async function hydrateProtectedAssetPreview({
public/control-center/pages/library.js:1254:  previewNode,
public/control-center/pages/library.js:1260:  if (!previewNode || !asset) {
public/control-center/pages/library.js:1270:    if (!previewNode.isConnected) {
public/control-center/pages/library.js:1274:    const currentId = previewNode.getAttribute("data-preview-asset-id") || "";
public/control-center/pages/library.js:1280:      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
public/control-center/pages/library.js:1285:      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
public/control-center/pages/library.js:1289:    if (getPreviewExtensionForAsset(asset) === "pdf") {
public/control-center/pages/library.js:1290:      previewNode.outerHTML = `
public/control-center/pages/library.js:1291:        <div class="library-pdf-preview">
public/control-center/pages/library.js:1292:          <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
public/control-center/pages/library.js:1297:    if (!previewNode.isConnected) {
public/control-center/pages/library.js:1303:      : `Preview unavailable: ${error.message || "Could not load this file."}`;
public/control-center/pages/library.js:1305:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
public/control-center/pages/library.js:1332:    image.alt = alt || asset.name || "Asset preview";
public/control-center/pages/library.js:1349:    showError?.(`Could not load asset preview: ${error.message || "Unknown error."}`);
public/control-center/pages/library.js:1377:    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
public/control-center/pages/library.js:1625:    needsReviewCount: requiredGroups.filter((item) => item.status === "needs_review").length,
public/control-center/pages/library.js:1645:  const sourceOptions = [
public/control-center/pages/library.js:1646:    { value: "all", label: "All sources" },
public/control-center/pages/library.js:1658:      <section class="library-explainer" aria-label="Library source-of-truth workspace explainer">
public/control-center/pages/library.js:1659:        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
public/control-center/pages/library.js:1681:        <span class="taxonomy-chip source-of-truth" tabindex="0">Source of Truth</span>
public/control-center/pages/library.js:1692:      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
public/control-center/pages/library.js:1785:  const sourceSelect = $("libraryFilterSourceSelect");
public/control-center/pages/library.js:1786:  if (sourceSelect) {
public/control-center/pages/library.js:1787:    sourceSelect.innerHTML = sourceOptions.map((option) => `
public/control-center/pages/library.js:1790:    sourceSelect.value = session.selectedSource || "all";
public/control-center/pages/library.js:1791:    sourceSelect.removeAttribute("disabled");
public/control-center/pages/library.js:1792:    sourceSelect.removeAttribute("readonly");
public/control-center/pages/library.js:1793:    sourceSelect.onchange = (event) => {
public/control-center/pages/library.js:1795:        filter: "source",
public/control-center/pages/library.js:1860:        const assetPreviewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1861:        const previewNode = asset.is_image && assetPreviewUrl
public/control-center/pages/library.js:1862:          ? requiresProtectedMediaFetch(assetPreviewUrl)
public/control-center/pages/library.js:1864:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
public/control-center/pages/library.js:1870:            <div class="library-grid-preview">${previewNode}</div>
public/control-center/pages/library.js:1925:  const previewVisual = $("libraryPreviewVisual");
public/control-center/pages/library.js:1926:  if (previewVisual) {
public/control-center/pages/library.js:1927:    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
public/control-center/pages/library.js:1929:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
public/control-center/pages/library.js:1930:    if (protectedPreviewNode && selectedAsset) {
public/control-center/pages/library.js:1931:      hydrateProtectedAssetPreview({
public/control-center/pages/library.js:1932:        previewNode: protectedPreviewNode,
public/control-center/pages/library.js:1941:  const previewMeta = $("libraryPreviewMeta");
public/control-center/pages/library.js:1942:  if (previewMeta) {
public/control-center/pages/library.js:1943:    previewMeta.innerHTML = selectedAsset
public/control-center/pages/library.js:1952:          <span class="card-badge ${selectedAsset.source_of_truth ? "success" : "neutral"}">${escapeHtml(selectedAsset.source_of_truth ? "Source" : "Not Source")}</span>
public/control-center/pages/library.js:1958:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Review Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Review Source in AI Command</button>
public/control-center/pages/library.js:1960:        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
public/control-center/pages/library.js:1961:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.</span>
public/control-center/pages/library.js:1964:        <details class="library-inspector-more">
public/control-center/pages/library.js:1965:          <summary>Technical details</summary>
public/control-center/pages/library.js:1968:            <div class="data-row"><span>Source Status</span><strong>${escapeHtml(selectedAsset.source_of_truth ? "Source of truth" : "Not source of truth")}</strong></div>
public/control-center/pages/library.js:1971:            <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
public/control-center/pages/library.js:1977:      : `<div class="empty-box">Select an asset to preview context. Actions become available in the Action Panel.</div>`;
public/control-center/pages/library.js:1979:    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
public/control-center/pages/library.js:1982:      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
public/control-center/pages/library.js:1987:      useBtn.textContent = "Use as Review Source in AI Command";
public/control-center/pages/library.js:1988:      useBtn.setAttribute("aria-label", "Use as Review Source in AI Command");
public/control-center/pages/library.js:1997:        const sourceProjectName = resolveActiveProjectName?.() || asString(projectName || "").trim().toLowerCase() || "__default__";
public/control-center/pages/library.js:1998:        setSharedAiSource(sourceProjectName, payload);
public/control-center/pages/library.js:2008:        clearSharedLibrarySourceBridge(sourceProjectName);
public/control-center/pages/library.js:2068:      const action = button.getAttribute("data-library-required-action") || "review";
public/control-center/pages/library.js:2087:        const isReviewAction = action === "review";
public/control-center/pages/library.js:2143:      if (action === "review") {
public/control-center/pages/library.js:2144:        session.selectedStatus = "needs_review";
public/control-center/pages/library.js:2355:      dispatchLibraryCommand("open-preview", { assetId: id }, {
public/control-center/pages/library.js:2356:        "open-preview": ({ assetId }) => ({
public/control-center/pages/library.js:2379:  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
public/control-center/pages/library.js:2380:  sourceOfTruthButtons.forEach((button) => {
public/control-center/pages/library.js:2385:        showError?.("Select a project before updating source of truth.");
public/control-center/pages/library.js:2389:      const assetId = button.getAttribute("data-library-source-truth") || "";
public/control-center/pages/library.js:2397:        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
public/control-center/pages/library.js:2400:        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
public/control-center/pages/library.js:2404:          : (error.message || "Failed to update source of truth.");
public/control-center/pages/library.js:2420:      const status = button.getAttribute("data-asset-status-action") || "needs_review";
public/control-center/pages/library.js:2430:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
public/control-center/pages/library.js:2972:      showMessage?.("Missing asset review prepared. The system will focus on required categories that still need attention.");
public/control-center/pages/library.js:3015:      showMessage?.(`AI context prepared for ${selectedAsset.name}. Open AI Command to review recommendations.`);
public/control-center/pages/library.js:3049:    const activeSourceMapping = activeSourceBridge?.type === "library_source_selection"
public/control-center/pages/library.js:3050:      ? getSourceTypeMapping(activeSourceBridge.sourceType || "auto")
public/control-center/pages/library.js:3052:    const sourceGuideHtml = activeSourceMapping
public/control-center/pages/library.js:3054:          title: "Choose source for AI Command",
public/control-center/pages/library.js:3056:            "Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.",
public/control-center/pages/library.js:3093:      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
public/control-center/pages/library.js:3096:          assetWorkspace.classList.add("is-source-target");
public/control-center/pages/library.js:3098:          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
public/control-center/pages/library.js:3146:                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
public/control-center/pages/library.js:3157:            <p class="card-subtitle">Track the source files, product data, media, and proof needed for campaign readiness. Review here does not approve, publish, or change asset truth automatically.</p>
public/control-center/pages/library.js:3166:            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
public/control-center/pages/library.js:3200:          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
public/control-center/pages/library.js:3235:                    <option value="needs_review">Needs review</option>
public/control-center/pages/library.js:3245:                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
public/control-center/pages/library.js:3269:                <section class="card library-preview-card">
public/control-center/pages/library.js:3271:                    <h3>Selected Asset Preview</h3>
public/control-center/pages/library.js:3272:                    <p class="card-subtitle">Preview selected evidence or media. Protected files are loaded through the protected media endpoint without changing asset status.</p>
public/control-center/pages/library.js:3274:                  <div id="libraryPreviewVisual"></div>
public/control-center/pages/library.js:3275:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
public/control-center/styles/14-page-standard.css:392:.integration-source-card,
public/control-center/styles/14-page-standard.css:395:[data-integration-source],
public/control-center/styles/14-page-standard.css:416:.integration-source-card *,
public/control-center/styles/14-page-standard.css:419:[data-integration-source] *,
public/control-center/styles/14-page-standard.css:978:   Single source of truth for all Library page visual rules.
public/control-center/styles/14-page-standard.css:1253:[data-page="library"] .library-required-card .badge[data-status="needs-review"] {
public/control-center/styles/14-page-standard.css:1552:[data-page="library"] .library-grid-preview {
public/control-center/styles/14-page-standard.css:1562:[data-page="library"] .library-grid-preview img,
public/control-center/styles/14-page-standard.css:1563:[data-page="library"] .library-grid-preview video,
public/control-center/styles/14-page-standard.css:1593:/* ── 9. Preview / inspector ───────────────────────────── */
public/control-center/styles/14-page-standard.css:1595:[data-page="library"] .library-preview-card {
public/control-center/styles/14-page-standard.css:1601:[data-page="library"] #libraryPreviewVisual {
public/control-center/styles/14-page-standard.css:1612:[data-page="library"] .library-preview-image,
public/control-center/styles/14-page-standard.css:1613:[data-page="library"] .library-preview-video {
public/control-center/styles/14-page-standard.css:1624:[data-page="library"] .library-preview-meta {
public/control-center/styles/14-page-standard.css:1650:[data-page="library"] .library-inspector-more {
public/control-center/styles/14-page-standard.css:1807:/* ── 12. Document preview ─────────────────────────────── */
public/control-center/styles/14-page-standard.css:1809:[data-page="library"] .library-document-preview {
public/control-center/styles/14-page-standard.css:1816:[data-page="library"] .library-document-preview-actions {
public/control-center/styles/14-page-standard.css:1823:[data-page="library"] .library-pdf-preview {
public/control-center/styles/14-page-standard.css:1832:[data-page="library"] .library-pdf-preview iframe {
