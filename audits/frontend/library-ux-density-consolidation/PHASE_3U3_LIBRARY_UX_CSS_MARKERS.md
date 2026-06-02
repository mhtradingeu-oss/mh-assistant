# PHASE 3U.3 — Library UX / CSS Marker Evidence

## Library JS size
    3165 public/control-center/pages/library.js

## Library render / preview / action markers
1809:            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
1811:          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;
1815:          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
1816:            <div class="library-grid-preview">${previewNode}</div>
1817:            <div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>
1818:            <div class="library-grid-meta" title="${escapeHtml(asset.filename || "-")}">${escapeHtml(fileName)}</div>
1819:            <div class="library-grid-foot">
1821:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
1835:      <div class="library-grid-page-info">Showing ${escapeHtml(String(showingStart))}-${escapeHtml(String(showingEnd))} of ${escapeHtml(String(filteredAssets.length))}</div>
1836:      <div class="library-grid-page-actions">
1837:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
1839:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
1864:      className: "library-grid-thumb",
1866:      fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`,
1871:  const previewVisual = $("libraryPreviewVisual");
1887:  const previewMeta = $("libraryPreviewMeta");
1904:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Source in AI Command</button>
1907:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then click Use as Source in AI Command.</span>
1933:      useBtn.textContent = "Use as Source in AI Command";
1934:      useBtn.setAttribute("aria-label", "Use as Source in AI Command");
2196:  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
2200:      const nextId = card.getAttribute("data-library-grid-select") || "";
2215:      const nextId = card.getAttribute("data-library-grid-select") || "";
2472:      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
2522:  const gridPageButtons = Array.from(document.querySelectorAll("[data-library-grid-page]"));
2528:      const action = button.getAttribute("data-library-grid-page");
2919:            "Select one Library item, then click Use as Source in AI Command.",
3019:            <h3>Required Assets</h3>
3027:            <h3>Asset Intake</h3>
3124:              <div id="libraryAssetGridBody" class="library-grid-body"></div>
3125:              <div id="libraryGridPagination" class="library-grid-pagination"></div>
3134:                  <div id="libraryPreviewVisual"></div>
3135:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>

## Library protected preview markers
public/control-center/pages/library.js:40:  fetchProtectedMediaBlob,
public/control-center/pages/library.js:293:function buildPreviewUrl(projectName, asset) {
public/control-center/pages/library.js:315:function requiresProtectedMediaFetch(fileUrl = "") {
public/control-center/pages/library.js:323:function getAssetPreviewUrl(asset) {
public/control-center/pages/library.js:341:    getAssetPreviewUrl(asset)
public/control-center/pages/library.js:387:  const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:390:  if (!requiresProtectedMediaFetch(previewUrl)) {
public/control-center/pages/library.js:420:    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
public/control-center/pages/library.js:724:      buildPreviewUrl(projectName, {
public/control-center/pages/library.js:1098:    getAssetPreviewUrl(asset) ||
public/control-center/pages/library.js:1113:  const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1114:  const protectedPreview = requiresProtectedMediaFetch(previewUrl);
public/control-center/pages/library.js:1191:    const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1198:    if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {
public/control-center/pages/library.js:1247:async function hydrateProtectedAssetPreview({
public/control-center/pages/library.js:1806:        const assetPreviewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1808:          ? requiresProtectedMediaFetch(assetPreviewUrl)
public/control-center/pages/library.js:1877:      hydrateProtectedAssetPreview({
public/control-center/api.js:806:export async function fetchProtectedMediaBlob(path, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {

## Library CSS selector markers
992:.library-explainer {
1001:.library-explainer strong {
1006:.library-explainer-steps {
1020:.library-taxonomy-chips {
1050:.library-grid-card.is-active {
1056:.library-grid-card[aria-selected="true"] {
1082:.library-inspector-ai-source-guide {
1091:.library-inspector-ai-source-guide-text {
1105:.library-smart-shell,
1132:.library-action-toolbar,
1133:.library-preview-actions,
1147:.library-overview-grid,
1163:.library-upload-grid,
1164:.library-required-grid,
1181:.library-workspace-grid,
1199:.library-filter-field {
1206:.library-filter-bar .setup-input,
1207:.library-filter-bar select {
1218:.library-preview-copy,
1219:.library-inspector-path,
1220:.library-inspector-more {
1237:.library-finder-toolbar,
1238:.library-finder-topbar,
1239:.library-grid-foot,
1240:.library-grid-pagination,
1241:.library-grid-page-actions,
1242:.library-required-card-head,
1257:.library-workspace-side,
1263:.library-folder-list,
1264:.library-filter-bar,
1265:.library-grid-body,
1266:.library-preview-copy,
1278:.library-grid-type,
1279:.library-grid-meta,
1280:.library-inspector-path,
1281:.library-inspector-more,
1312:.library-drop-zone {
1322:.library-grid-card,
1323:.library-required-card,
1324:.library-preview-card,
1346:.library-filter-bar {
1350:.library-action-toolbar {
1354:.library-grid-page-actions .btn,
1355:.library-action-toolbar .btn {
1359:.library-preview-frame {
1369:.library-preview-image,
1370:.library-preview-video {
1376:.library-action-dropdown {
1388:.library-action-dropdown.is-open {
1397:  .library-overview-grid,
1398:  .library-upload-grid,
1399:  .library-required-grid,
1416:  .library-workspace-grid,
1421:  .library-filter-bar {
1430:  .library-overview-grid,
1431:  .library-upload-grid,
1432:  .library-required-grid,
1445:  .library-filter-bar {
7569:.library-preview-audio {
7574:.library-preview-text-fallback {
7580:.library-inspector-ai-source-guide.is-hidden {
7584:.library-upload-summary {

## Destructive / confirmation markers
38:  archiveProjectAsset,
39:  deleteProjectAsset,
163:  { key: "archived", label: "Archived" }
350:  libraryProtectedUrlCache.delete(key);
442:      libraryProtectedUrlPromiseCache.delete(cacheKey);
632:  if (normalized.includes("archiv")) return "archived";
645:  if (value === "archived") return "Archived";
952:    } else if (entries.length && statuses.some((value) => value === "needs_review" || value === "uploaded" || value === "rejected" || value === "archived")) {
976:  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
977:    ? "archived"
996:    if (selectedFolderKey === "archived") return statusValue === "archived";
1011:    const isDeleted = Boolean(asset.deleted || asset.is_deleted);
1019:      ? statusValue !== "archived"
1021:        ? statusValue !== "archived"
1056:      if (folder.key === "all_assets") return !Boolean(asset.deleted || asset.is_deleted);
1058:      if (folder.key === "archived") return statusValue === "archived";
1637:      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
2241:          if (value === "archived") {
2242:            session.selectedStatus = "archived";
2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
2360:      if (!confirmed) {
2378:  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
2379:  archiveButtons.forEach((button) => {
2388:      const id = button.getAttribute("data-library-archive") || "";
2397:      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
2402:        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
2405:        showMessage?.("Asset archived.");
2407:        showError?.(error.message || "Failed to archive asset.");
2453:  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
2454:  deleteButtons.forEach((button) => {
2463:      const id = button.getAttribute("data-library-delete") || "";
2472:      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
2477:        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
2482:        showMessage?.("Asset deleted (soft delete).");
2484:        showError?.(error.message || "Failed to delete asset.");
3092:                    <option value="active">Active (non-archived)</option>
3101:                    <option value="archived">Archived</option>
