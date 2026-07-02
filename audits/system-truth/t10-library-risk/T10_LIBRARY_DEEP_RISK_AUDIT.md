# T10 — Library Deep Risk Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/library.js

## Purpose
Library is one of the highest-risk frontend pages because of size, preview/file handling, timers, and repeated innerHTML usage. This audit identifies whether the risk is actual runtime danger or mostly render-template density.

## Summary Counts
| Signal | Count |
|---|---:|
| innerHTML | 26 |
| eventBinding | 47 |
| timers | 9 |
| preview | 189 |
| filePicker | 207 |
| storage | 18 |
| apiCalls | 260 |
| unsafeTerms | 111 |

## Initial Decision
Do not patch yet. Use this audit to decide if Library needs:
- Preview/file safety patch
- innerHTML escaping consolidation
- timer cleanup
- UX-only polish
- or closeout/no patch

## innerHTML / HTML Injection Signals

| Line | Code | Classification |
|---:|---|---|
| 1378 | `previewNode.outerHTML = renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1390 | `previewNode.outerHTML = `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1407 | `previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1412 | `previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1417 | `previewNode.outerHTML = `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1432 | `previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1463 | `node.innerHTML = fallbackMarkup;` | P1-check: innerHTML without nearby escaping/render evidence |
| 1466 | `node.innerHTML = "";` | P1-check: innerHTML without nearby escaping/render evidence |
| 1470 | `node.innerHTML = fallbackMarkup;` | P1-check: innerHTML without nearby escaping/render evidence |
| 1803 | `explainerBox.innerHTML = `` | P1-check: innerHTML without nearby escaping/render evidence |
| 1818 | `taxonomyBox.innerHTML = `` | P1-check: innerHTML without nearby escaping/render evidence |
| 1836 | `requiredBox.innerHTML = requiredGroups.map((item) => {` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1866 | `typeSelect.innerHTML = typeOptions.map((option) => `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 1933 | `sourceSelect.innerHTML = sourceOptions.map((option) => `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2001 | `selectedSummary.innerHTML = selectedAsset` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2031 | `selectionBar.innerHTML = `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2045 | `gridBody.innerHTML = paginatedAssets.length` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2086 | `gridPagination.innerHTML = `` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2130 | `previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2146 | `previewMeta.innerHTML = selectedAsset` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2208 | `actionPanelMount.innerHTML = renderLibraryActionPanel({` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2216 | `aiPanelMount.innerHTML = renderLibraryAiPanel({` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2225 | `activityBox.innerHTML = recentActivity.length` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2241 | `uploadSummary.innerHTML = session.recentUploads.length` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 2959 | `uploadTypeSelect.innerHTML = catalog.map((item) => {` | Review: likely render-template innerHTML, verify escaping and source ownership |
| 3389 | `root.innerHTML = `` | Review: likely render-template innerHTML, verify escaping and source ownership |

## Preview / Document Rendering Signals

| Line | Code | Classification |
|---:|---|---|
| 22 | `text_preview: (asset.text_preview \|\| asset.notes \|\| "").slice(0, 1200),` | P1-check: preview/file URL path needs safety review |
| 303 | `function isOfficePreviewExtension(extension = "") {` | P1-check: preview/file URL path needs safety review |
| 307 | `function isTextPreviewExtension(extension = "") {` | P1-check: preview/file URL path needs safety review |
| 311 | `function buildPreviewUrl(projectName, asset) {` | P1-check: preview/file URL path needs safety review |
| 341 | `function getAssetPreviewUrl(asset) {` | Review: preview path has helper/fallback evidence |
| 344 | `asset.preview_url` | Review: preview path has helper/fallback evidence |
| 359 | `getAssetPreviewUrl(asset)` | Review: preview path has helper/fallback evidence |
| 365 | `if (entry?.objectUrl) {` | Review: preview path has helper/fallback evidence |
| 366 | `URL.revokeObjectURL(entry.objectUrl);` | Review: preview path has helper/fallback evidence |
| 404 | `async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {` | Review: preview path has helper/fallback evidence |
| 405 | `const previewUrl = getAssetPreviewUrl(asset);` | Review: preview path has helper/fallback evidence |
| 406 | `const fileName = asString(asset?.filename \|\| asset?.name \|\| basename(previewUrl) \|\| "download");` | Review: preview path has helper/fallback evidence |
| 408 | `if (!requiresProtectedMediaFetch(previewUrl)) {` | Review: preview path has helper/fallback evidence |
| 410 | `objectUrl: previewUrl,` | Review: preview path has helper/fallback evidence |
| 419 | `if (cached?.objectUrl && !options.force) {` | Review: preview path has helper/fallback evidence |
| 421 | `objectUrl: cached.objectUrl,` | Review: preview path has helper/fallback evidence |
| 438 | `const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) \|\| undefined);` | P1-check: preview/file URL path needs safety review |
| 439 | `const objectUrl = URL.createObjectURL(blob);` | P1-check: preview/file URL path needs safety review |
| 441 | `objectUrl,` | P1-check: preview/file URL path needs safety review |
| 447 | `objectUrl,` | P1-check: preview/file URL path needs safety review |
| 470 | `const resolved = await getProtectedAssetObjectUrl(projectName, asset);` | P1-check: preview/file URL path needs safety review |
| 471 | `const objectUrl = resolved.objectUrl;` | P1-check: preview/file URL path needs safety review |
| 481 | `window.open(objectUrl, "_blank", "noopener,noreferrer");` | P1-check: preview/file URL path needs safety review |
| 487 | `anchor.href = objectUrl;` | P1-check: preview/file URL path needs safety review |
| 532 | `preview_url: fileUrl,` | P1-check: preview/file URL path needs safety review |
| 740 | `const previewUrl = merged.preview_url \|\|` | P1-check: preview/file URL path needs safety review |
| 743 | `buildPreviewUrl(projectName, {` | P1-check: preview/file URL path needs safety review |
| 776 | `preview_url: previewUrl,` | P1-check: preview/file URL path needs safety review |
| 830 | `preview_url: firstValidUrl(imageUrl, videoUrl, audioUrl),` | P1-check: preview/file URL path needs safety review |
| 838 | `text_preview: promptText \|\| briefText,` | P1-check: preview/file URL path needs safety review |
| 839 | `json_preview: payload,` | P1-check: preview/file URL path needs safety review |
| 1091 | `function getPreviewExtensionForAsset(asset = {}) {` | P1-check: preview/file URL path needs safety review |
| 1097 | `asset.preview_url \|\|` | P1-check: preview/file URL path needs safety review |
| 1105 | `return value === "pdf" \|\| isOfficePreviewExtension(value) \|\| isTextPreviewExtension(value);` | Review: preview path has helper/fallback evidence |
| 1108 | `function toDocumentPreviewLabel(extension = "") {` | Review: preview path has helper/fallback evidence |
| 1120 | `function canAttemptDocumentPreview(asset = {}) {` | Review: preview path has helper/fallback evidence |
| 1122 | `getAssetPreviewUrl(asset) \|\|` | Review: preview path has helper/fallback evidence |
| 1126 | `asset.preview_url \|\|` | Review: preview path has helper/fallback evidence |
| 1132 | `function getPreviewFileName(asset = {}) {` | Review: preview path has helper/fallback evidence |
| 1133 | `return asString(asset.name \|\| asset.filename \|\| asset.file_name \|\| basename(asset.file_path \|\| asset.preview_url \|\| "") \|\| "Selected file");` | Review: preview path has helper/fallback evidence |
| 1136 | `function getPreviewSourceLabel(asset = {}) {` | Review: preview path has helper/fallback evidence |
| 1141 | `function renderPreviewActionButtons(asset = {}, escapeHtml, { openLabel = "Open asset", includeCopy = true } = {}) {` | Review: preview path has helper/fallback evidence |
| 1143 | `const filePath = asString(asset.file_path \|\| asset.local_path \|\| asset.path \|\| asset.preview_url \|\| "").trim();` | Review: preview path has helper/fallback evidence |
| 1149 | `<div class="library-document-preview-actions">` | Review: preview path has helper/fallback evidence |
| 1157 | `function renderUnsupportedPreviewCard(asset = {}, escapeHtml, options = {}) {` | Review: preview path has helper/fallback evidence |
| 1158 | `const extension = asString(options.extension \|\| getPreviewExtensionForAsset(asset) \|\| "file").toLowerCase();` | Review: preview path has helper/fallback evidence |
| 1159 | `const label = options.label \|\| toDocumentPreviewLabel(extension);` | Review: preview path has helper/fallback evidence |
| 1160 | `const title = options.title \|\| "Preview not available inline";` | Review: preview path has helper/fallback evidence |
| 1161 | `const fileName = getPreviewFileName(asset);` | Review: preview path has helper/fallback evidence |
| 1162 | `const sourceLabel = getPreviewSourceLabel(asset);` | Review: preview path has helper/fallback evidence |
| 1166 | `<div class="library-preview-fallback library-document-preview library-preview-capability-card">` | Review: preview path has helper/fallback evidence |
| 1167 | `<div class="library-preview-extension">${escapeHtml((extension \|\| "file").toUpperCase())}</div>` | Review: preview path has helper/fallback evidence |
| 1169 | `<div class="library-preview-copy">${escapeHtml(options.message \|\| "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.")}</div>` | Review: preview path has helper/fallback evidence |
| 1170 | `<dl class="library-preview-file-facts">` | Review: preview path has helper/fallback evidence |
| 1176 | `${renderPreviewActionButtons(asset, escapeHtml)}` | Review: preview path has helper/fallback evidence |
| 1181 | `function renderPreview(asset, escapeHtml) {` | Review: preview path has helper/fallback evidence |
| 1183 | `return `<div class="empty-box">Select an asset to preview details, open files, copy paths, or prepare review actions.</div>`;` | Review: preview path has helper/fallback evidence |
| 1186 | `const previewUrl = getAssetPreviewUrl(asset);` | Review: preview path has helper/fallback evidence |
| 1187 | `const protectedPreview = requiresProtectedMediaFetch(previewUrl);` | Review: preview path has helper/fallback evidence |
| 1189 | `if (asset.is_image && asString(asset.image_url \|\| previewUrl).trim()) {` | Review: preview path has helper/fallback evidence |
| 1190 | `if (protectedPreview) {` | Review: preview path has helper/fallback evidence |
| 1192 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1193 | `<div class="library-preview-fallback">Loading protected image preview...</div>` | Review: preview path has helper/fallback evidence |
| 1199 | `<div class="library-preview-frame">` | Review: preview path has helper/fallback evidence |
| 1200 | `<img src="${escapeHtml(asString(asset.image_url \|\| previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">` | Review: preview path has helper/fallback evidence |
| 1205 | `if (asset.is_video && asString(asset.video_url \|\| previewUrl).trim()) {` | Review: preview path has helper/fallback evidence |
| 1206 | `if (protectedPreview) {` | Review: preview path has helper/fallback evidence |
| 1208 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1209 | `<div class="library-preview-fallback">Loading protected video preview...</div>` | Review: preview path has helper/fallback evidence |
| 1215 | `<div class="library-preview-frame">` | Review: preview path has helper/fallback evidence |
| 1216 | `<video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url \|\| previewUrl))}"></video>` | Review: preview path has helper/fallback evidence |
| 1221 | `if (asset.is_audio && asString(asset.audio_url \|\| previewUrl).trim()) {` | Review: preview path has helper/fallback evidence |
| 1223 | `<div class="library-preview-frame">` | Review: preview path has helper/fallback evidence |
| 1224 | `<audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url \|\| previewUrl))}"></audio>` | Review: preview path has helper/fallback evidence |
| 1229 | `if (asset.is_image && previewUrl) {` | Review: preview path has helper/fallback evidence |
| 1230 | `if (protectedPreview) {` | Review: preview path has helper/fallback evidence |
| 1232 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1233 | `<div class="library-preview-fallback">Loading protected image preview...</div>` | Review: preview path has helper/fallback evidence |
| 1239 | `<div class="library-preview-frame">` | Review: preview path has helper/fallback evidence |
| 1240 | `<img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">` | Review: preview path has helper/fallback evidence |
| 1245 | `if (asset.is_video && previewUrl) {` | Review: preview path has helper/fallback evidence |
| 1246 | `if (protectedPreview) {` | Review: preview path has helper/fallback evidence |
| 1248 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1249 | `<div class="library-preview-fallback">Loading protected video preview...</div>` | Review: preview path has helper/fallback evidence |
| 1255 | `<div class="library-preview-frame">` | Review: preview path has helper/fallback evidence |
| 1256 | `<video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>` | Review: preview path has helper/fallback evidence |
| 1261 | `const previewExtension = getPreviewExtensionForAsset(asset);` | Review: preview path has helper/fallback evidence |
| 1263 | `if (isDocumentExtension(previewExtension)) {` | Review: preview path has helper/fallback evidence |
| 1264 | `const previewUrl = getAssetPreviewUrl(asset);` | Review: preview path has helper/fallback evidence |
| 1265 | `const label = toDocumentPreviewLabel(previewExtension);` | Review: preview path has helper/fallback evidence |
| 1266 | `const isPdf = previewExtension === "pdf";` | Review: preview path has helper/fallback evidence |
| 1268 | `if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {` | Review: preview path has helper/fallback evidence |
| 1270 | `<div class="library-pdf-preview">` | Review: preview path has helper/fallback evidence |
| 1271 | `<iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name \|\| "PDF preview")}"></iframe>` | Review: preview path has helper/fallback evidence |
| 1276 | `if (isPdf && canAttemptDocumentPreview(asset)) {` | Review: preview path has helper/fallback evidence |
| 1278 | `<div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1279 | `<div class="library-preview-extension">PDF</div>` | Review: preview path has helper/fallback evidence |
| 1281 | `<div class="library-preview-copy">Loading protected PDF preview...</div>` | Review: preview path has helper/fallback evidence |
| 1286 | `if (isTextPreviewExtension(previewExtension)) {` | Review: preview path has helper/fallback evidence |
| 1287 | `const inlineText = asString(asset.text_preview \|\| "").trim();` | Review: preview path has helper/fallback evidence |
| 1290 | `<div class="library-preview-fallback library-preview-text-fallback library-preview-text-card">` | Review: preview path has helper/fallback evidence |
| 1291 | `<div class="library-preview-copy">Preview shows what the browser can safely render.</div>` | Review: preview path has helper/fallback evidence |
| 1297 | `if (previewUrl && requiresProtectedMediaFetch(previewUrl)) {` | Review: preview path has helper/fallback evidence |
| 1299 | `<div class="library-preview-fallback library-document-preview library-preview-capability-card" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review: preview path has helper/fallback evidence |
| 1300 | `<div class="library-preview-extension">${escapeHtml(previewExtension.toUpperCase())}</div>` | Review: preview path has helper/fallback evidence |
| 1302 | `<div class="library-preview-copy">Loading protected text preview...</div>` | Review: preview path has helper/fallback evidence |
| 1307 | `return renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review: preview path has helper/fallback evidence |
| 1308 | `extension: previewExtension,` | Review: preview path has helper/fallback evidence |
| 1310 | `message: "Preview shows what the browser can safely render. Inline text preview is not available for this file source, but the asset can still be opened or sent to AI review context."` | Review: preview path has helper/fallback evidence |
| 1314 | `if (isOfficePreviewExtension(previewExtension)) {` | Review: preview path has helper/fallback evidence |
| 1315 | `return renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review: preview path has helper/fallback evidence |
| 1316 | `extension: previewExtension,` | Review: preview path has helper/fallback evidence |
| 1318 | `message: "Office files cannot be previewed inline in this browser panel without a document conversion service. Preview shows what the browser can safely render; this asset can still be opened or sent to AI review context."` | Review: preview path has helper/fallback evidence |
| 1323 | `<div class="library-preview-fallback library-document-preview">` | Review: preview path has helper/fallback evidence |
| 1324 | `<div class="library-preview-extension">${escapeHtml((previewExtension \|\| "doc").toUpperCase())}</div>` | Review: preview path has helper/fallback evidence |
| 1326 | `<div class="library-preview-copy">Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.</div>` | Review: preview path has helper/fallback evidence |
| 1327 | `${renderPreviewActionButtons(asset, escapeHtml, { openLabel: "Open document" })}` | Review: preview path has helper/fallback evidence |
| 1333 | `if (asset.text_preview) {` | Review: preview path has helper/fallback evidence |
| 1334 | `return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;` | Review: preview path has helper/fallback evidence |
| 1337 | `const jsonFallback = JSON.stringify(asset.json_preview \|\| asset.media_payload \|\| {}, null, 2);` | Review: preview path has helper/fallback evidence |
| 1339 | `return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;` | Review: preview path has helper/fallback evidence |
| 1343 | `${renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review: preview path has helper/fallback evidence |
| 1344 | `extension: asset.extension \|\| previewExtension \|\| "file",` | Review: preview path has helper/fallback evidence |
| 1346 | `message: "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context."` | Review: preview path has helper/fallback evidence |
| 1351 | `async function hydrateProtectedAssetPreview({` | Review: preview path has helper/fallback evidence |
| 1352 | `previewNode,` | Review: preview path has helper/fallback evidence |
| 1358 | `if (!previewNode \|\| !asset) {` | Review: preview path has helper/fallback evidence |
| 1365 | `const currentId = previewNode.getAttribute("data-preview-asset-id") \|\| "";` | Review: preview path has helper/fallback evidence |
| 1370 | `const previewExtension = getPreviewExtensionForAsset(asset);` | Review: preview path has helper/fallback evidence |
| 1371 | `if (isTextPreviewExtension(previewExtension)) {` | Review: preview path has helper/fallback evidence |
| 1372 | `const previewUrl = getAssetPreviewUrl(asset);` | Review: preview path has helper/fallback evidence |
| 1373 | `const { blob } = await fetchProtectedMediaBlob(previewUrl, 45000);` | Review: preview path has helper/fallback evidence |
| 1374 | `if (!previewNode.isConnected) {` | Review: preview path has helper/fallback evidence |
| 1378 | `previewNode.outerHTML = renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review: preview path has helper/fallback evidence |
| 1379 | `extension: previewExtension,` | Review: preview path has helper/fallback evidence |
| 1380 | `label: toDocumentPreviewLabel(previewExtension),` | Review: preview path has helper/fallback evidence |
| 1381 | `message: "Preview shows what the browser can safely render. This text-like file is too large for a safe inline preview, but it can still be opened or sent to AI review context."` | Review: preview path has helper/fallback evidence |
| 1387 | `const previewText = text.length > 12000` | Review: preview path has helper/fallback evidence |
| 1388 | `? `${text.slice(0, 12000)}\n\n[Preview truncated for safe browser rendering.]`` | Review: preview path has helper/fallback evidence |
| 1390 | `previewNode.outerHTML = `` | Review: preview path has helper/fallback evidence |

_Trimmed: 49 additional matches not shown._

## File Picker / Upload / Drop Signals

| Line | Code | Classification |
|---:|---|---|
| 46 | `uploadProjectAsset` | Review: file picker/drop path needs focused verification |
| 59 | `const LIBRARY_UPLOAD_TYPE_LABELS = {` | Review: file picker/drop path needs focused verification |
| 75 | `function getLibraryUploadTypeLabel(assetType = "") {` | Review: file picker/drop path needs focused verification |
| 77 | `return LIBRARY_UPLOAD_TYPE_LABELS[key] \|\| titleCase(key \|\| "asset");` | Review: file picker/drop path needs focused verification |
| 106 | `uploadType: "logo"` | Review: file picker/drop path needs focused verification |
| 113 | `uploadType: "brand_guideline"` | Review: file picker/drop path needs focused verification |
| 120 | `uploadType: "product_csv"` | Review: file picker/drop path needs focused verification |
| 127 | `uploadType: "product_photos"` | Review: file picker/drop path needs focused verification |
| 134 | `uploadType: "product_videos"` | Review: file picker/drop path needs focused verification |
| 141 | `uploadType: "legal_doc"` | Review: file picker/drop path needs focused verification |
| 148 | `uploadType: "partner_docs"` | Review: file picker/drop path needs focused verification |
| 154 | `return LIBRARY_UPLOAD_TYPE_LABELS[key] \|\| String(fallback \|\| key \|\| "Asset").trim();` | Review: file picker/drop path needs focused verification |
| 167 | `{ key: "uploaded_session", label: "Uploaded This Session" },` | Review: file picker/drop path needs focused verification |
| 187 | `"button, a, input, select, textarea, label, option, [role='button'], .library-action-menu, .library-action-dropdown, .library-drop-zone"` | P1-check: file picker/drop path lacks nearby guard evidence |
| 193 | `// Do not stop events on native controls. Select/input/file controls must` | P1-check: file picker/drop path lacks nearby guard evidence |
| 550 | `closeAllLibraryActionDropdowns();` | P1-check: file picker/drop path lacks nearby guard evidence |
| 583 | `uploadType: "logo",` | Review: file picker/drop path needs focused verification |
| 584 | `uploading: false,` | Review: file picker/drop path needs focused verification |
| 585 | `recentUploads: []` | Review: file picker/drop path needs focused verification |
| 602 | `function closeAllLibraryActionDropdowns() {` | Review: file picker/drop path needs focused verification |
| 603 | `Array.from(document.querySelectorAll(".library-action-dropdown.is-open")).forEach((item) => {` | Review: file picker/drop path needs focused verification |
| 618 | `function getUploadAssetType(session, catalog, selectedValue) {` | Review: file picker/drop path needs focused verification |
| 619 | `const normalized = getSafeAssetType(selectedValue \|\| session.uploadType);` | Review: file picker/drop path needs focused verification |
| 622 | `throw new Error("Choose a valid upload category.");` | Review: file picker/drop path needs focused verification |
| 642 | `if (!normalized) return "uploaded";` | Review: file picker/drop path needs focused verification |
| 648 | `if (normalized === "uploaded") return "uploaded";` | Review: file picker/drop path needs focused verification |
| 652 | `return "uploaded";` | Review: file picker/drop path needs focused verification |
| 665 | `return "Uploaded";` | Review: file picker/drop path needs focused verification |
| 724 | `"uploaded"` | Review: file picker/drop path needs focused verification |
| 771 | `uploaded_at: merged.uploaded_at \|\| merged.updated_at \|\| merged.created_at \|\| merged.registered_at \|\| "",` | Review: file picker/drop path needs focused verification |
| 824 | `category_status: "Uploaded",` | Review: file picker/drop path needs focused verification |
| 829 | `uploaded_at: asset.updated_at \|\| asset.created_at \|\| null,` | Review: file picker/drop path needs focused verification |
| 892 | `const existingTs = new Date(existing.uploaded_at \|\| 0).getTime() \|\| 0;` | Review: file picker/drop path needs focused verification |
| 893 | `const candidateTs = new Date(asset.uploaded_at \|\| 0).getTime() \|\| 0;` | Review: file picker/drop path needs focused verification |
| 904 | `const recentlyUploadedByDate = assets.filter((asset) => {` | Review: file picker/drop path needs focused verification |
| 905 | `if (!asset.uploaded_at) return false;` | Review: file picker/drop path needs focused verification |
| 906 | `const ts = new Date(asset.uploaded_at).getTime();` | Review: file picker/drop path needs focused verification |
| 911 | `const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;` | Review: file picker/drop path needs focused verification |
| 924 | `recentlyUploaded: recentlyUploadedByDate,` | Review: file picker/drop path needs focused verification |
| 926 | `? `${nextAction.status === "missing" ? "Upload" : "Review"} ${nextAction.label}`` | Review: file picker/drop path needs focused verification |
| 944 | `} else if (statuses.some((value) => value === "missing" \|\| value === "needs_review" \|\| value === "uploaded")) {` | Review: file picker/drop path needs focused verification |
| 971 | `} else if (entries.length && statuses.some((value) => value === "needs_review" \|\| value === "uploaded" \|\| value === "rejected" \|\| value === "archived")) {` | Review: file picker/drop path needs focused verification |
| 984 | `action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"` | Review: file picker/drop path needs focused verification |
| 1003 | `const recentUploadedNames = new Set(` | Review: file picker/drop path needs focused verification |
| 1004 | `asArray(session.recentUploads)` | Review: file picker/drop path needs focused verification |
| 1016 | `if (selectedFolderKey === "uploaded_session") {` | Review: file picker/drop path needs focused verification |
| 1018 | `return Boolean(filename && recentUploadedNames.has(filename));` | Review: file picker/drop path needs focused verification |
| 1061 | `if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);` | Review: file picker/drop path needs focused verification |
| 1063 | `return toTimestamp(right.uploaded_at) - toTimestamp(left.uploaded_at);` | Review: file picker/drop path needs focused verification |
| 1075 | `const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);` | Review: file picker/drop path needs focused verification |
| 1080 | `if (folder.key === "uploaded_session") return inRecent;` | Review: file picker/drop path needs focused verification |
| 1512 | `return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;` | Review: file picker/drop path needs focused verification |
| 1771 | `.filter((asset) => asset.uploaded_at)` | Review: file picker/drop path needs focused verification |
| 1772 | `.sort((left, right) => new Date(right.uploaded_at \|\| 0).getTime() - new Date(left.uploaded_at \|\| 0).getTime())` | Review: file picker/drop path needs focused verification |
| 1786 | `{ value: "library", label: "Library uploads" },` | Review: file picker/drop path needs focused verification |
| 1807 | `<li>Upload or select an asset.</li>` | Review: file picker/drop path needs focused verification |
| 1838 | `const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";` | Review: file picker/drop path needs focused verification |
| 1856 | `data-library-upload-type="${escapeHtml(item.uploadType)}"` | Review: file picker/drop path needs focused verification |
| 2078 | `: `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;` | Review: file picker/drop path needs focused verification |
| 2231 | `<span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>` | Review: file picker/drop path needs focused verification |
| 2236 | `: `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;` | Review: file picker/drop path needs focused verification |
| 2239 | `const uploadSummary = $("libraryUploadSummary");` | Review: file picker/drop path needs focused verification |
| 2240 | `if (uploadSummary) {` | Review: file picker/drop path needs focused verification |
| 2241 | `uploadSummary.innerHTML = session.recentUploads.length` | Review: file picker/drop path needs focused verification |
| 2244 | `${session.recentUploads.slice(0, 5).map((item) => `` | Review: file picker/drop path needs focused verification |
| 2247 | `<span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>` | Review: file picker/drop path needs focused verification |
| 2252 | `: `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;` | Review: file picker/drop path needs focused verification |
| 2259 | `const uploadType = button.getAttribute("data-library-upload-type") \|\| "logo";` | Review: file picker/drop path needs focused verification |
| 2262 | `// Always set upload type` | Review: file picker/drop path needs focused verification |
| 2263 | `session.uploadType = uploadType;` | Review: file picker/drop path needs focused verification |
| 2264 | `const uploadTypeSelect = $("libraryUploadTypeSelect");` | Review: file picker/drop path needs focused verification |
| 2265 | `if (uploadTypeSelect) uploadTypeSelect.value = uploadType;` | Review: file picker/drop path needs focused verification |
| 2270 | `if (folder.key === requiredKey \|\| (folder.types && folder.types.includes(uploadType))) {` | Review: file picker/drop path needs focused verification |
| 2279 | `session.selectedType = opensFinder ? "all" : uploadType;` | Review: file picker/drop path needs focused verification |
| 2306 | `const uploadLabel = getLibraryUploadTypeLabel(uploadType);` | Review: file picker/drop path needs focused verification |
| 2318 | `showMessage?.(`Upload category set to ${uploadLabel}. Choose files, then upload them to this asset group.`);` | Review: file picker/drop path needs focused verification |
| 2320 | `const assetIntake = document.querySelector(".library-actions-card") \|\| document.getElementById("libraryDropZone");` | Review: file picker/drop path needs focused verification |
| 2321 | `const dropZone = document.getElementById("libraryDropZone");` | Review: file picker/drop path needs focused verification |
| 2323 | `if (dropZone && dropZone !== assetIntake) {` | Review: file picker/drop path needs focused verification |
| 2324 | `dropZone.classList.add("is-required-action-target");` | Review: file picker/drop path needs focused verification |
| 2325 | `setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);` | Review: file picker/drop path needs focused verification |
| 2330 | `showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);` | Review: file picker/drop path needs focused verification |
| 2333 | `if (action === "upload") {` | Review: file picker/drop path needs focused verification |
| 2334 | `const uploadInput = $("libraryUploadInput");` | Review: file picker/drop path needs focused verification |
| 2335 | `uploadInput?.click();` | Review: file picker/drop path needs focused verification |
| 2596 | `const toolbarUpload = $("libraryToolbarUploadBtn");` | Review: file picker/drop path needs focused verification |
| 2597 | `if (toolbarUpload) {` | Review: file picker/drop path needs focused verification |
| 2598 | `toolbarUpload.onclick = () => $("libraryUploadInput")?.click();` | Review: file picker/drop path needs focused verification |
| 2632 | `closeAllLibraryActionDropdowns();` | P1-check: file picker/drop path lacks nearby guard evidence |
| 2663 | `closeAllLibraryActionDropdowns();` | Review: file picker/drop path needs focused verification |
| 2711 | `const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);` | Review: file picker/drop path needs focused verification |
| 2725 | `showMessage?.(`Asset is already in ${getLibraryUploadTypeLabel(normalizedType)}.`);` | Review: file picker/drop path needs focused verification |
| 2732 | ``Move "${assetLabel}" from ${getLibraryUploadTypeLabel(currentType) \|\| "Unknown"} to ${getLibraryUploadTypeLabel(normalizedType)}?\n\nThis changes the Library group only. It will not move, rename, or edit the physical file.`` | Review: file picker/drop path needs focused verification |
| 2740 | `showMessage?.(`Moving asset to ${getLibraryUploadTypeLabel(normalizedType)}...`);` | Review: file picker/drop path needs focused verification |
| 2753 | `showMessage?.(`Asset moved to ${getLibraryUploadTypeLabel(normalizedType)}.`);` | Review: file picker/drop path needs focused verification |
| 2768 | `closeAllLibraryActionDropdowns();` | Review: file picker/drop path needs focused verification |
| 2802 | `closeAllLibraryActionDropdowns();` | P1-check: file picker/drop path lacks nearby guard evidence |
| 2843 | `closeAllLibraryActionDropdowns();` | P1-check: file picker/drop path lacks nearby guard evidence |
| 2883 | `const dropdown = menu?.querySelector(".library-action-dropdown");` | Review: file picker/drop path needs focused verification |
| 2884 | `if (!dropdown) return;` | Review: file picker/drop path needs focused verification |
| 2886 | `const open = dropdown.classList.contains("is-open");` | Review: file picker/drop path needs focused verification |
| 2887 | `closeAllLibraryActionDropdowns();` | Review: file picker/drop path needs focused verification |
| 2890 | `dropdown.classList.add("is-open");` | Review: file picker/drop path needs focused verification |
| 2891 | `dropdown.style.display = "block";` | Review: file picker/drop path needs focused verification |
| 2896 | `const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));` | Review: file picker/drop path needs focused verification |
| 2897 | `pickUploadTypeButtons.forEach((button) => {` | Review: file picker/drop path needs focused verification |
| 2899 | `const uploadType = button.getAttribute("data-library-upload-type") \|\| "logo";` | Review: file picker/drop path needs focused verification |
| 2900 | `session.uploadType = uploadType;` | Review: file picker/drop path needs focused verification |
| 2901 | `const uploadTypeSelect = $("libraryUploadTypeSelect");` | Review: file picker/drop path needs focused verification |
| 2902 | `if (uploadTypeSelect) {` | Review: file picker/drop path needs focused verification |
| 2903 | `uploadTypeSelect.value = uploadType;` | Review: file picker/drop path needs focused verification |
| 2905 | `showMessage?.(`Upload category set to ${uploadType}.`);` | Review: file picker/drop path needs focused verification |
| 2956 | `const uploadTypeSelect = $("libraryUploadTypeSelect");` | Review: file picker/drop path needs focused verification |
| 2957 | `if (uploadTypeSelect) {` | Review: file picker/drop path needs focused verification |
| 2959 | `uploadTypeSelect.innerHTML = catalog.map((item) => {` | Review: file picker/drop path needs focused verification |
| 2961 | `const label = getLibraryUploadTypeLabel(assetType);` | Review: file picker/drop path needs focused verification |
| 2962 | `return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;` | Review: file picker/drop path needs focused verification |
| 2964 | `uploadTypeSelect.value = session.uploadType;` | Review: file picker/drop path needs focused verification |
| 2965 | `uploadTypeSelect.onchange = (event) => {` | Review: file picker/drop path needs focused verification |
| 2966 | `const uploadType = getSafeAssetType(event.target.value \|\| "logo") \|\| "logo";` | Review: file picker/drop path needs focused verification |
| 2968 | `dispatchLibraryCommand("upload-type-change", { uploadType }, {` | Review: file picker/drop path needs focused verification |
| 2969 | `"upload-type-change": ({ uploadType: nextUploadType }) => ({` | Review: file picker/drop path needs focused verification |
| 2971 | `uploadType: nextUploadType` | Review: file picker/drop path needs focused verification |
| 2975 | `session.uploadType = getSafeAssetType(event.target.value \|\| "logo") \|\| "logo";` | Review: file picker/drop path needs focused verification |
| 2979 | `const dropZone = $("libraryDropZone");` | Review: file picker/drop path needs focused verification |
| 2980 | `const uploadInput = $("libraryUploadInput");` | Review: file picker/drop path needs focused verification |
| 2981 | `const uploadBtn = $("libraryUploadBtn");` | Review: file picker/drop path needs focused verification |
| 2982 | `if (dropZone && uploadInput) {` | Review: file picker/drop path needs focused verification |
| 2983 | `const updateUploadUiState = () => {` | Review: file picker/drop path needs focused verification |
| 2984 | `const files = Array.from(uploadInput.files \|\| []);` | Review: file picker/drop path needs focused verification |
| 2988 | `const info = $("libraryDropInfo");` | Review: file picker/drop path needs focused verification |
| 2991 | `if (uploadBtn) {` | Review: file picker/drop path needs focused verification |
| 2992 | `uploadBtn.disabled = session.uploading \|\| files.length === 0;` | Review: file picker/drop path needs focused verification |
| 2993 | `uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";` | Review: file picker/drop path needs focused verification |
| 2997 | `const syncDroppedFilesToInput = (files) => {` | Review: file picker/drop path needs focused verification |
| 3001 | `uploadInput.files = transfer.files;` | Review: file picker/drop path needs focused verification |
| 3005 | `updateUploadUiState();` | Review: file picker/drop path needs focused verification |
| 3008 | `dropZone.onclick = (event) => {` | Review: file picker/drop path needs focused verification |
| 3010 | `openLibraryFilePicker();` | Review: file picker/drop path needs focused verification |
| 3013 | `dropZone.onkeydown = (event) => {` | Review: file picker/drop path needs focused verification |

_Trimmed: 67 additional matches not shown._

## Timer Signals

| Line | Code | Classification |
|---:|---|---|
| 1669 | `setTimeout(() => target.classList.remove(highlightClass), 2600);` | Review |
| 2310 | `setTimeout(() => {` | Review |
| 2319 | `setTimeout(() => {` | Review |
| 2325 | `setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);` | Review |
| 2947 | `window.clearTimeout(librarySearchRenderTimer);` | Review |
| 2950 | `librarySearchRenderTimer = window.setTimeout(() => {` | Review |
| 3319 | `setTimeout(() => {` | Review |
| 3343 | `setTimeout(() => {` | Review |
| 3349 | `setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);` | Review |

## Storage Signals

| Line | Code | Classification |
|---:|---|---|
| 80 | `const libraryProtectedUrlCache = new Map();` | Review |
| 82 | `const libraryProtectedUrlPromiseCache = new Map();` | Review |
| 215 | `const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) \|\| "{}");` | Review |
| 352 | `function buildProtectedCacheKey(projectName, asset) {` | Review |
| 364 | `const entry = libraryProtectedUrlCache.get(key);` | Review |
| 368 | `libraryProtectedUrlCache.delete(key);` | Review |
| 417 | `const cacheKey = buildProtectedCacheKey(projectName, asset);` | Review |
| 418 | `const cached = libraryProtectedUrlCache.get(cacheKey);` | Review |
| 419 | `if (cached?.objectUrl && !options.force) {` | Review |
| 421 | `objectUrl: cached.objectUrl,` | Review |
| 422 | `contentType: cached.contentType,` | Review |
| 429 | `revokeLibraryProtectedUrl(cacheKey);` | Review |
| 432 | `const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);` | Review |
| 440 | `libraryProtectedUrlCache.set(cacheKey, {` | Review |
| 454 | `libraryProtectedUrlPromiseCache.set(cacheKey, loadPromise);` | Review |
| 459 | `if (libraryProtectedUrlPromiseCache.get(cacheKey) === loadPromise) {` | Review |
| 460 | `libraryProtectedUrlPromiseCache.delete(cacheKey);` | Review |
| 502 | `Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));` | Review |

## API / Mutation / Async Signals

| Line | Code | Classification |
|---:|---|---|
| 38 | `archiveProjectAsset,` | Review |
| 39 | `deleteProjectAsset,` | Review |
| 46 | `uploadProjectAsset` | Review |
| 47 | `} from "../api.js";` | Review |
| 59 | `const LIBRARY_UPLOAD_TYPE_LABELS = {` | Review |
| 75 | `function getLibraryUploadTypeLabel(assetType = "") {` | Review |
| 77 | `return LIBRARY_UPLOAD_TYPE_LABELS[key] \|\| titleCase(key \|\| "asset");` | Review |
| 106 | `uploadType: "logo"` | Review |
| 113 | `uploadType: "brand_guideline"` | Review |
| 120 | `uploadType: "product_csv"` | Review |
| 127 | `uploadType: "product_photos"` | Review |
| 134 | `uploadType: "product_videos"` | Review |
| 141 | `uploadType: "legal_doc"` | Review |
| 148 | `uploadType: "partner_docs"` | Review |
| 154 | `return LIBRARY_UPLOAD_TYPE_LABELS[key] \|\| String(fallback \|\| key \|\| "Asset").trim();` | Review |
| 167 | `{ key: "uploaded_session", label: "Uploaded This Session" },` | Review |
| 169 | `{ key: "archived", label: "Archived" }` | Review |
| 333 | `function requiresProtectedMediaFetch(fileUrl = "") {` | Review |
| 368 | `libraryProtectedUrlCache.delete(key);` | Review |
| 394 | `resolve(await job());` | Review |
| 408 | `if (!requiresProtectedMediaFetch(previewUrl)) {` | Review |
| 438 | `const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) \|\| undefined);` | Review |
| 457 | `return await loadPromise;` | Review |
| 460 | `libraryProtectedUrlPromiseCache.delete(cacheKey);` | Review |
| 470 | `const resolved = await getProtectedAssetObjectUrl(projectName, asset);` | Review |
| 491 | `anchor.remove();` | Review |
| 515 | `await navigator.clipboard.writeText(value);` | Review |
| 583 | `uploadType: "logo",` | Review |
| 584 | `uploading: false,` | Review |
| 585 | `recentUploads: []` | Review |
| 604 | `item.classList.remove("is-open");` | Review |
| 618 | `function getUploadAssetType(session, catalog, selectedValue) {` | Review |
| 619 | `const normalized = getSafeAssetType(selectedValue \|\| session.uploadType);` | Review |
| 622 | `throw new Error("Choose a valid upload category.");` | Review |
| 642 | `if (!normalized) return "uploaded";` | Review |
| 648 | `if (normalized === "uploaded") return "uploaded";` | Review |
| 651 | `if (normalized.includes("archiv")) return "archived";` | Review |
| 652 | `return "uploaded";` | Review |
| 664 | `if (value === "archived") return "Archived";` | Review |
| 665 | `return "Uploaded";` | Review |
| 724 | `"uploaded"` | Review |
| 771 | `uploaded_at: merged.uploaded_at \|\| merged.updated_at \|\| merged.created_at \|\| merged.registered_at \|\| "",` | Review |
| 824 | `category_status: "Uploaded",` | Review |
| 829 | `uploaded_at: asset.updated_at \|\| asset.created_at \|\| null,` | Review |
| 892 | `const existingTs = new Date(existing.uploaded_at \|\| 0).getTime() \|\| 0;` | Review |
| 893 | `const candidateTs = new Date(asset.uploaded_at \|\| 0).getTime() \|\| 0;` | Review |
| 904 | `const recentlyUploadedByDate = assets.filter((asset) => {` | Review |
| 905 | `if (!asset.uploaded_at) return false;` | Review |
| 906 | `const ts = new Date(asset.uploaded_at).getTime();` | Review |
| 911 | `const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;` | Review |
| 924 | `recentlyUploaded: recentlyUploadedByDate,` | Review |
| 926 | `? `${nextAction.status === "missing" ? "Upload" : "Review"} ${nextAction.label}`` | Review |
| 944 | `} else if (statuses.some((value) => value === "missing" \|\| value === "needs_review" \|\| value === "uploaded")) {` | Review |
| 971 | `} else if (entries.length && statuses.some((value) => value === "needs_review" \|\| value === "uploaded" \|\| value === "rejected" \|\| value === "archived")) {` | Review |
| 984 | `action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"` | Review |
| 995 | `const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"` | Review |
| 996 | `? "archived"` | Review |
| 1003 | `const recentUploadedNames = new Set(` | Review |
| 1004 | `asArray(session.recentUploads)` | Review |
| 1015 | `if (selectedFolderKey === "archived") return statusValue === "archived";` | Review |
| 1016 | `if (selectedFolderKey === "uploaded_session") {` | Review |
| 1018 | `return Boolean(filename && recentUploadedNames.has(filename));` | Review |
| 1030 | `const isDeleted = Boolean(asset.deleted \|\| asset.is_deleted);` | Review |
| 1031 | `if (isDeleted) return false;` | Review |
| 1038 | `? statusValue !== "archived"` | Review |
| 1040 | `? statusValue !== "archived"` | Review |
| 1061 | `if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);` | Review |
| 1063 | `return toTimestamp(right.uploaded_at) - toTimestamp(left.uploaded_at);` | Review |
| 1075 | `const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);` | Review |
| 1077 | `if (folder.key === "all_assets") return !Boolean(asset.deleted \|\| asset.is_deleted);` | Review |
| 1079 | `if (folder.key === "archived") return statusValue === "archived";` | Review |
| 1080 | `if (folder.key === "uploaded_session") return inRecent;` | Review |
| 1187 | `const protectedPreview = requiresProtectedMediaFetch(previewUrl);` | Review |
| 1268 | `if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {` | Review |
| 1297 | `if (previewUrl && requiresProtectedMediaFetch(previewUrl)) {` | Review |
| 1373 | `const { blob } = await fetchProtectedMediaBlob(previewUrl, 45000);` | Review |
| 1386 | `const text = await blob.text();` | Review |
| 1399 | `const resolved = await getProtectedAssetObjectUrl(projectName, asset, {` | Review |
| 1452 | `const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {` | Review |
| 1512 | `return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;` | Review |
| 1578 | `overlay.remove();` | Review |
| 1669 | `setTimeout(() => target.classList.remove(highlightClass), 2600);` | Review |
| 1682 | `reloadProjectData,` | Review |
| 1702 | `reloadProjectData,` | Review |
| 1710 | `if (typeof reloadProjectData === "function") {` | Review |
| 1711 | `await reloadProjectData(projectName);` | Review |
| 1771 | `.filter((asset) => asset.uploaded_at)` | Review |
| 1772 | `.sort((left, right) => new Date(right.uploaded_at \|\| 0).getTime() - new Date(left.uploaded_at \|\| 0).getTime())` | Review |
| 1786 | `{ value: "library", label: "Library uploads" },` | Review |
| 1807 | `<li>Upload or select an asset.</li>` | Review |
| 1838 | `const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";` | Review |
| 1856 | `data-library-upload-type="${escapeHtml(item.uploadType)}"` | Review |
| 1870 | `typeSelect.removeAttribute("disabled");` | Review |
| 1871 | `typeSelect.removeAttribute("readonly");` | Review |
| 1892 | `reloadProjectData,` | Review |
| 1923 | `reloadProjectData,` | Review |
| 1937 | `sourceSelect.removeAttribute("disabled");` | Review |
| 1938 | `sourceSelect.removeAttribute("readonly");` | Review |
| 1959 | `reloadProjectData,` | Review |
| 1990 | `reloadProjectData,` | Review |
| 2034 | `<span>Local selection only. Batch metadata, archive, delete, and source changes are not enabled here.</span>` | Review |
| 2053 | `? requiresProtectedMediaFetch(assetPreviewUrl)` | Review |
| 2078 | `: `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;` | Review |
| 2231 | `<span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>` | Review |
| 2236 | `: `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;` | Review |
| 2239 | `const uploadSummary = $("libraryUploadSummary");` | Review |
| 2240 | `if (uploadSummary) {` | Review |
| 2241 | `uploadSummary.innerHTML = session.recentUploads.length` | Review |
| 2244 | `${session.recentUploads.slice(0, 5).map((item) => `` | Review |
| 2247 | `<span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>` | Review |
| 2252 | `: `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;` | Review |
| 2259 | `const uploadType = button.getAttribute("data-library-upload-type") \|\| "logo";` | Review |
| 2262 | `// Always set upload type` | Review |
| 2263 | `session.uploadType = uploadType;` | Review |
| 2264 | `const uploadTypeSelect = $("libraryUploadTypeSelect");` | Review |
| 2265 | `if (uploadTypeSelect) uploadTypeSelect.value = uploadType;` | Review |
| 2270 | `if (folder.key === requiredKey \|\| (folder.types && folder.types.includes(uploadType))) {` | Review |
| 2279 | `session.selectedType = opensFinder ? "all" : uploadType;` | Review |
| 2300 | `reloadProjectData,` | Review |
| 2306 | `const uploadLabel = getLibraryUploadTypeLabel(uploadType);` | Review |
| 2318 | `showMessage?.(`Upload category set to ${uploadLabel}. Choose files, then upload them to this asset group.`);` | Review |
| 2325 | `setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);` | Review |
| 2330 | `showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);` | Review |
| 2333 | `if (action === "upload") {` | Review |
| 2334 | `const uploadInput = $("libraryUploadInput");` | Review |
| 2335 | `uploadInput?.click();` | Review |
| 2351 | `reloadProjectData,` | Review |
| 2391 | `reloadProjectData,` | Review |
| 2426 | `reloadProjectData,` | Review |
| 2455 | `reloadProjectData,` | Review |
| 2506 | `nextSelection.delete(assetId);` | Review |
| 2527 | `nextSelection.delete(asset.id);` | Review |
| 2562 | `if (value === "archived") {` | Review |
| 2563 | `session.selectedStatus = "archived";` | Review |
| 2596 | `const toolbarUpload = $("libraryToolbarUploadBtn");` | Review |
| 2597 | `if (toolbarUpload) {` | Review |
| 2598 | `toolbarUpload.onclick = () => $("libraryUploadInput")?.click();` | Review |
| 2619 | `await openLibraryAsset(projectName, asset);` | Review |
| 2647 | `await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id \|\| asset.id, !asset.source_of_truth);` | Review |
| 2649 | `await reloadOrRerender();` | Review |
| 2650 | `showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);` | Review |
| 2686 | `await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);` | Review |
| 2688 | `await reloadOrRerender();` | Review |
| 2711 | `const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);` | Review |
| 2725 | `showMessage?.(`Asset is already in ${getLibraryUploadTypeLabel(normalizedType)}.`);` | Review |
| 2732 | ``Move "${assetLabel}" from ${getLibraryUploadTypeLabel(currentType) \|\| "Unknown"} to ${getLibraryUploadTypeLabel(normalizedType)}?\n\nThis changes the Library group only. It will not move, rename, or edit the physical file.`` | Review |
| 2740 | `showMessage?.(`Moving asset to ${getLibraryUploadTypeLabel(normalizedType)}...`);` | Review |
| 2741 | `await reclassifyProjectAsset(` | Review |
| 2752 | `await reloadProjectData?.();` | Review |
| 2753 | `showMessage?.(`Asset moved to ${getLibraryUploadTypeLabel(normalizedType)}.`);` | Review |
| 2765 | `const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));` | Review |
| 2766 | `archiveButtons.forEach((button) => {` | Review |
| 2775 | `const id = button.getAttribute("data-library-archive") \|\| "";` | Review |
| 2784 | `if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry. This does not delete the physical file.\n\nSelect Cancel to keep this asset active.`)) {` | Review |
| 2789 | `await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");` | Review |
| 2791 | `await reloadOrRerender();` | Review |
| 2792 | `showMessage?.("Asset archived.");` | Review |
| 2794 | `showError?.(error.message \|\| "Failed to archive asset.");` | Review |
| 2818 | `const nextName = await promptForTextInput("Rename asset", asset.name \|\| "");` | Review |
| 2830 | `await renameProjectAsset(activeProjectName, assetId, normalized);` | Review |

_Trimmed: 100 additional matches not shown._

## Unsafe / Trust Boundary Terms

| Line | Code | Classification |
|---:|---|---|
| 336 | `if (/^blob:/i.test(value) \|\| /^data:/i.test(value)) return false;` | Review |
| 855 | `if (/^https?:\/\//i.test(text) \|\| /^blob:/i.test(text) \|\| /^data:image\//i.test(text)) {` | Review |
| 1141 | `function renderPreviewActionButtons(asset = {}, escapeHtml, { openLabel = "Open asset", includeCopy = true } = {}) {` | Review |
| 1142 | `const assetId = escapeHtml(asset.id \|\| "");` | Review |
| 1145 | `? `<button class="btn btn-secondary" type="button" data-copy-asset-path="${escapeHtml(filePath)}"${filePath ? "" : " disabled aria-disabled=\"true\""}>Copy path</button>`` | Review |
| 1150 | `<button class="btn btn-primary" type="button" data-library-open="${assetId}"${assetId ? "" : " disabled aria-disabled=\"true\""}>${escapeHtml(openLabel)}</button>` | Review |
| 1157 | `function renderUnsupportedPreviewCard(asset = {}, escapeHtml, options = {}) {` | Review |
| 1167 | `<div class="library-preview-extension">${escapeHtml((extension \|\| "file").toUpperCase())}</div>` | Review |
| 1168 | `<strong>${escapeHtml(title)}</strong>` | Review |
| 1169 | `<div class="library-preview-copy">${escapeHtml(options.message \|\| "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.")}</div>` | Review |
| 1171 | `<div><dt>File</dt><dd>${escapeHtml(fileName)}</dd></div>` | Review |
| 1172 | `<div><dt>Type</dt><dd>${escapeHtml(label)}</dd></div>` | Review |
| 1173 | `<div><dt>Source</dt><dd>${escapeHtml(sourceLabel)}</dd></div>` | Review |
| 1174 | `<div><dt>Status</dt><dd>${escapeHtml(status \|\| "n/a")}</dd></div>` | Review |
| 1176 | `${renderPreviewActionButtons(asset, escapeHtml)}` | Review |
| 1181 | `function renderPreview(asset, escapeHtml) {` | Review |
| 1192 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1200 | `<img src="${escapeHtml(asString(asset.image_url \|\| previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">` | Review |
| 1208 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1216 | `<video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url \|\| previewUrl))}"></video>` | Review |
| 1224 | `<audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url \|\| previewUrl))}"></audio>` | Review |
| 1232 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1240 | `<img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">` | Review |
| 1248 | `<div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1256 | `<video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>` | Review |
| 1271 | `<iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name \|\| "PDF preview")}"></iframe>` | Review |
| 1278 | `<div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1280 | `<strong>${escapeHtml(label)}</strong>` | Review |
| 1292 | `<pre>${escapeHtml(inlineText)}</pre>` | Review |
| 1299 | `<div class="library-preview-fallback library-document-preview library-preview-capability-card" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id \|\| asset.asset_id \|\| "")}">` | Review |
| 1300 | `<div class="library-preview-extension">${escapeHtml(previewExtension.toUpperCase())}</div>` | Review |
| 1301 | `<strong>${escapeHtml(label)}</strong>` | Review |
| 1307 | `return renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review |
| 1315 | `return renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review |
| 1324 | `<div class="library-preview-extension">${escapeHtml((previewExtension \|\| "doc").toUpperCase())}</div>` | Review |
| 1325 | `<strong>${escapeHtml(label)}</strong>` | Review |
| 1327 | `${renderPreviewActionButtons(asset, escapeHtml, { openLabel: "Open document" })}` | Review |
| 1334 | `return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;` | Review |
| 1339 | `return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;` | Review |
| 1343 | `${renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review |
| 1355 | `escapeHtml,` | Review |
| 1378 | `previewNode.outerHTML = renderUnsupportedPreviewCard(asset, escapeHtml, {` | Review |
| 1393 | `<pre>${escapeHtml(previewText \|\| "This text-like file is empty.")}</pre>` | Review |
| 1407 | `previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;` | Review |
| 1412 | `previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;` | Review |
| 1419 | `<iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name \|\| "PDF preview")}"></iframe>` | Review |
| 1432 | `previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;` | Review |
| 1685 | `escapeHtml` | Review |
| 1705 | `escapeHtml` | Review |
| 1845 | `<h4>${escapeHtml(item.label)}</h4>` | Review |
| 1846 | `<span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>` | Review |
| 1848 | `<p class="library-required-why">${escapeHtml(reasonHint)}</p>` | Review |
| 1850 | `<small>${escapeHtml(`Files found: ${formatCount(item.totalCount)}`)}</small>` | Review |
| 1854 | `data-library-required-action="${escapeHtml(item.action)}"` | Review |
| 1855 | `data-library-required-key="${escapeHtml(item.key)}"` | Review |
| 1856 | `data-library-upload-type="${escapeHtml(item.uploadType)}"` | Review |
| 1857 | `>${escapeHtml(actionLabel)}</button>` | Review |
| 1867 | `<option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>` | Review |
| 1895 | `escapeHtml` | Review |
| 1926 | `escapeHtml` | Review |
| 1934 | `<option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>` | Review |
| 1962 | `escapeHtml` | Review |
| 1993 | `escapeHtml` | Review |
| 2005 | `<strong>${escapeHtml(selectedAsset.name \|\| selectedAsset.filename \|\| "Selected asset")}</strong>` | Review |
| 2006 | `<small>${escapeHtml(`${toStatusLabel(selectedAsset.status)} · ${getCleanLibraryTypeLabel(selectedAsset.asset_type, selectedAsset.type_label)} · ${selectedAsset.source_of_truth ? "Source of truth" : "Not source of truth"}`)}</small>` | Review |
| 2014 | `<strong>${escapeHtml(selectedOutOfFilterAsset.name \|\| selectedOutOfFilterAsset.filename \|\| "Previous selection")}</strong>` | Review |
| 2033 | `<strong>${escapeHtml(selectionSummaryText)}</strong>` | Review |
| 2054 | `? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`` | Review |
| 2055 | `: `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension \|\| "file").toUpperCase())}' }))">`` | Review |
| 2056 | `: `<div class="library-grid-icon">${escapeHtml((asset.extension \|\| "file").toUpperCase())}</div>`;` | Review |
| 2062 | `<article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">` | Review |
| 2064 | `<input type="checkbox" data-library-multi-select="${escapeHtml(asset.id)}"${isMultiSelected ? " checked" : ""}>` | Review |
| 2068 | `<div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>` | Review |
| 2069 | `<div class="library-grid-meta" title="${escapeHtml(asset.filename \|\| "-")}">${escapeHtml(fileName)}</div>` | Review |
| 2070 | `<div class="library-grid-context">${escapeHtml(asset.source_of_truth ? "Source of truth" : asset.source_label \|\| "Library asset")}</div>` | Review |
| 2072 | `<span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>` | Review |
| 2073 | `<span class="library-grid-type">${escapeHtml(typeLabel)}</span>` | Review |
| 2087 | `<div class="library-grid-page-info">Showing ${escapeHtml(String(showingStart))}-${escapeHtml(String(showingEnd))} of ${escapeHtml(String(filteredAssets.length))}</div>` | Review |
| 2090 | `<span>Page ${escapeHtml(String(session.page))} / ${escapeHtml(String(totalPages))}</span>` | Review |
| 2118 | `fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension \|\| "file").toUpperCase())}</div>`,` | Review |
| 2130 | `previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);` | Review |
| 2138 | `escapeHtml,` | Review |
| 2149 | `<strong>${escapeHtml(selectedAsset.name)}</strong>` | Review |
| 2150 | `<span>${escapeHtml(selectedAsset.filename \|\| basename(selectedAsset.file_path \|\| "") \|\| "-")}</span>` | Review |
| 2154 | `<span class="card-badge ${escapeHtml(toStatusTone(selectedAsset.status))}">${escapeHtml(toStatusLabel(selectedAsset.status))}</span>` | Review |
| 2155 | `<span class="card-badge ${selectedAsset.source_of_truth ? "success" : "neutral"}">${escapeHtml(selectedAsset.source_of_truth ? "Source" : "Not Source")}</span>` | Review |
| 2156 | `<span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>` | Review |
| 2159 | `<div class="library-inspector-path">${escapeHtml(assetContextHint(selectedAsset))}</div>` | Review |
| 2161 | `<button type="button" class="btn btn-primary std-ai-btn" aria-label="Use this asset as an AI source" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as AI Source</button>` | Review |
| 2230 | `<strong>${escapeHtml(asset.name)}</strong>` | Review |
| 2231 | `<span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>` | Review |
| 2246 | `<strong>${escapeHtml(item.filename)}</strong>` | Review |
| 2247 | `<span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>` | Review |
| 2303 | `escapeHtml` | Review |
| 2354 | `escapeHtml` | Review |
| 2394 | `escapeHtml` | Review |
| 2429 | `escapeHtml` | Review |
| 2458 | `escapeHtml` | Review |
| 2962 | `return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;` | Review |
| 3130 | `escapeHtml` | Review |
| 3288 | `escapeHtml,` | Review |
| 3395 | `<h3>${escapeHtml(projectName ? `${projectName} Asset Library` : "Asset Library")}</h3>` | Review |
| 3397 | `${escapeHtml(`${formatCount(overview.totalAssets \|\| 0)} assets · ${formatCount(overview.sourceOfTruthAssets \|\| 0)} source-of-truth · ${formatCount(overview.needsReviewAssets \|\| 0)} need review · ${formatCount(overview.approvedAssets \|\| 0)} approved · ${String(overview.sourceCoverage \|\| 0)}% source coverage`)}` | Review |
| 3417 | `<p class="card-subtitle">Upload files, classify them, and prepare trusted assets for AI work.</p>` | Review |
| 3436 | `<option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(getCleanLibraryTypeLabel(item.asset_type, item.display_label \|\| item.label))}</option>` | Review |
| 3449 | `<span class="card-badge neutral">Inspect, filter, and route trusted assets</span>` | Review |
| 3452 | `<div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode \|\| "grid")}">` | Review |
| 3461 | `<button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">` | Review |
| 3462 | `<span>${escapeHtml(folder.label)}</span>` | Review |
| 3463 | `<small>${escapeHtml(formatCount(count))}</small>` | Review |
| 3555 | `escapeHtml` | Review |

## Focus Zones

### Render Preview Zone

```js
 1106: }
 1107: 
 1108: function toDocumentPreviewLabel(extension = "") {
 1109:   const value = asString(extension).toLowerCase();
 1110:   if (value === "pdf") return "PDF Document";
 1111:   if (value === "csv") return "CSV Spreadsheet";
 1112:   if (value === "json") return "JSON Document";
 1113:   if (value === "xls" || value === "xlsx") return "Excel Spreadsheet";
 1114:   if (value === "doc" || value === "docx") return "Word Document";
 1115:   if (value === "ppt" || value === "pptx") return "PowerPoint Presentation";
 1116:   if (value === "txt" || value === "md") return value === "md" ? "Markdown Document" : "Text Document";
 1117:   return "Document";
 1118: }
 1119: 
 1120: function canAttemptDocumentPreview(asset = {}) {
 1121:   return Boolean(
 1122:     getAssetPreviewUrl(asset) ||
 1123:     asset.file_path ||
 1124:     asset.local_path ||
 1125:     asset.path ||
 1126:     asset.preview_url ||
 1127:     asset.public_url ||
 1128:     asset.url
 1129:   );
 1130: }
 1131: 
 1132: function getPreviewFileName(asset = {}) {
 1133:   return asString(asset.name || asset.filename || asset.file_name || basename(asset.file_path || asset.preview_url || "") || "Selected file");
 1134: }
 1135: 
 1136: function getPreviewSourceLabel(asset = {}) {
 1137:   if (asset.source_of_truth) return "Source of truth";
 1138:   return asString(asset.source_label || asset.source || asset.origin || "Library asset");
 1139: }
 1140: 
 1141: function renderPreviewActionButtons(asset = {}, escapeHtml, { openLabel = "Open asset", includeCopy = true } = {}) {
 1142:   const assetId = escapeHtml(asset.id || "");
 1143:   const filePath = asString(asset.file_path || asset.local_path || asset.path || asset.preview_url || "").trim();
 1144:   const copyButton = includeCopy
 1145:     ? `<button class="btn btn-secondary" type="button" data-copy-asset-path="${escapeHtml(filePath)}"${filePath ? "" : " disabled aria-disabled=\"true\""}>Copy path</button>`
 1146:     : "";
 1147: 
 1148:   return `
 1149:     <div class="library-document-preview-actions">
 1150:       <button class="btn btn-primary" type="button" data-library-open="${assetId}"${assetId ? "" : " disabled aria-disabled=\"true\""}>${escapeHtml(openLabel)}</button>
 1151:       ${copyButton}
 1152:       <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${assetId ? "" : " disabled aria-disabled=\"true\""}>Prepare AI review</button>
 1153:     </div>
 1154:   `;
 1155: }
 1156: 
 1157: function renderUnsupportedPreviewCard(asset = {}, escapeHtml, options = {}) {
 1158:   const extension = asString(options.extension || getPreviewExtensionForAsset(asset) || "file").toLowerCase();
 1159:   const label = options.label || toDocumentPreviewLabel(extension);
 1160:   const title = options.title || "Preview not available inline";
 1161:   const fileName = getPreviewFileName(asset);
 1162:   const sourceLabel = getPreviewSourceLabel(asset);
 1163:   const status = asString(asset.status || asset.readiness_status || "n/a").replace(/[_-]+/g, " ");
 1164: 
 1165:   return `
 1166:     <div class="library-preview-fallback library-document-preview library-preview-capability-card">
 1167:       <div class="library-preview-extension">${escapeHtml((extension || "file").toUpperCase())}</div>
 1168:       <strong>${escapeHtml(title)}</strong>
 1169:       <div class="library-preview-copy">${escapeHtml(options.message || "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.")}</div>
 1170:       <dl class="library-preview-file-facts">
 1171:         <div><dt>File</dt><dd>${escapeHtml(fileName)}</dd></div>
 1172:         <div><dt>Type</dt><dd>${escapeHtml(label)}</dd></div>
 1173:         <div><dt>Source</dt><dd>${escapeHtml(sourceLabel)}</dd></div>
 1174:         <div><dt>Status</dt><dd>${escapeHtml(status || "n/a")}</dd></div>
 1175:       </dl>
 1176:       ${renderPreviewActionButtons(asset, escapeHtml)}
```

### Asset Preview URL Zone

```js
  306: 
  307: function isTextPreviewExtension(extension = "") {
  308:   return ["txt", "md", "csv", "json"].includes(asString(extension).toLowerCase());
  309: }
  310: 
  311: function buildPreviewUrl(projectName, asset) {
  312:   if (!projectName) return "";
  313:   const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  314:   const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
  315:   const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  316:   const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  317:   if (!fileName || !assetType) return "";
  318: 
  319:   const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
  320:   const params = [];
  321: 
  322:   if (fullPath) {
  323:     params.push(`path=${encodeURIComponent(fullPath)}`);
  324:   }
  325: 
  326:   if (assetId) {
  327:     params.push(`assetId=${encodeURIComponent(assetId)}`);
  328:   }
  329: 
  330:   return params.length ? `${base}?${params.join("&")}` : base;
  331: }
  332: 
  333: function requiresProtectedMediaFetch(fileUrl = "") {
  334:   const value = asString(fileUrl).trim();
  335:   if (!value) return false;
  336:   if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  337:   if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  338:   return value.includes("/media/file/");
  339: }
  340: 
  341: function getAssetPreviewUrl(asset) {
  342:   if (!asset) return "";
  343:   return asString(
  344:     asset.preview_url
  345:     || asset.image_url
  346:     || asset.video_url
  347:     || asset.audio_url
  348:     || ""
  349:   ).trim();
  350: }
  351: 
  352: function buildProtectedCacheKey(projectName, asset) {
  353:   const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  354:   const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  355:   return [
  356:     projectKey(projectName),
  357:     resolvedAssetId || "no-asset-id",
  358:     resolvedFilePath || "no-file-path",
  359:     getAssetPreviewUrl(asset)
  360:   ].join("::");
  361: }
  362: 
  363: function revokeLibraryProtectedUrl(key) {
  364:   const entry = libraryProtectedUrlCache.get(key);
  365:   if (entry?.objectUrl) {
  366:     URL.revokeObjectURL(entry.objectUrl);
  367:   }
  368:   libraryProtectedUrlCache.delete(key);
  369: }
  370: 
  371: function runNextLibraryThumbLoad() {
  372:   if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
  373:     return;
  374:   }
  375: 
  376:   const nextJob = libraryThumbLoadQueue.shift();
```

### Drop Zone / Upload Zone

```js
    1: import { renderGuideBox } from "../components/guide-box.js";
    2: import { getSourceTypeMapping } from "../shared-context.js";
    3: import {
    4:   setSharedAiSource,
    5:   getSharedLibrarySourceBridge,
    6:   clearSharedLibrarySourceBridge,
    7:   setSharedAiDrawerReturn,
    8:   getSharedAiDrawerReturn
    9: } from "../shared-context.js";
   10: 
   11: function buildAiSourcePayloadFromAsset(asset = {}) {
   12:   if (!asset) return null;
   13:   return {
   14:     id: asset.id,
   15:     asset_id: asset.asset_id,
   16:     name: asset.name,
   17:     filename: asset.filename,
   18:     file_path: asset.file_path,
   19:     asset_type: asset.asset_type,
   20:     source_label: asset.source_label || asset.name || "Library asset",
   21:     source_of_truth: asset.source_of_truth,
   22:     text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
   23:     selected_at: new Date().toISOString()
   24:   };
   25: }
   26: 
   27: // --- Library Source Bridge Guide Box ---
   28: // This must be run inside the render() function, after projectName is defined.
   29: 
   30: import { renderLibraryActionPanel } from "./library/action-panel.js";
   31: import { renderLibraryAiPanel } from "./library/ai-panel.js";
   32: import { normalizeLibraryAsset } from "./library/projection-adapter.js";
   33: import { normalizeLibrarySession } from "./library/session-store.js";
   34: import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
   35: import { mountLibraryListeners } from "./library/listener-lifecycle.js";
   36: import {
   37:   AccessKeyError,
   38:   archiveProjectAsset,
   39:   deleteProjectAsset,
   40:   fetchProtectedMediaBlob,
   41:   refreshProjectLibrary,
   42:   reclassifyProjectAsset,
   43:   renameProjectAsset,
   44:   setProjectAssetSourceOfTruth,
   45:   updateProjectAssetStatus,
   46:   uploadProjectAsset
   47: } from "../api.js";
   48: import {
   49:   getAssetCatalog,
   50:   getCanonicalAssetType,
   51:   getCategoryReadinessList,
   52:   getMissingAssetLabels,
```

### Main Render Zone

```js
 1106: }
 1107: 
 1108: function toDocumentPreviewLabel(extension = "") {
 1109:   const value = asString(extension).toLowerCase();
 1110:   if (value === "pdf") return "PDF Document";
 1111:   if (value === "csv") return "CSV Spreadsheet";
 1112:   if (value === "json") return "JSON Document";
 1113:   if (value === "xls" || value === "xlsx") return "Excel Spreadsheet";
 1114:   if (value === "doc" || value === "docx") return "Word Document";
 1115:   if (value === "ppt" || value === "pptx") return "PowerPoint Presentation";
 1116:   if (value === "txt" || value === "md") return value === "md" ? "Markdown Document" : "Text Document";
 1117:   return "Document";
 1118: }
 1119: 
 1120: function canAttemptDocumentPreview(asset = {}) {
 1121:   return Boolean(
 1122:     getAssetPreviewUrl(asset) ||
 1123:     asset.file_path ||
 1124:     asset.local_path ||
 1125:     asset.path ||
 1126:     asset.preview_url ||
 1127:     asset.public_url ||
 1128:     asset.url
 1129:   );
 1130: }
 1131: 
 1132: function getPreviewFileName(asset = {}) {
 1133:   return asString(asset.name || asset.filename || asset.file_name || basename(asset.file_path || asset.preview_url || "") || "Selected file");
 1134: }
 1135: 
 1136: function getPreviewSourceLabel(asset = {}) {
 1137:   if (asset.source_of_truth) return "Source of truth";
 1138:   return asString(asset.source_label || asset.source || asset.origin || "Library asset");
 1139: }
 1140: 
 1141: function renderPreviewActionButtons(asset = {}, escapeHtml, { openLabel = "Open asset", includeCopy = true } = {}) {
 1142:   const assetId = escapeHtml(asset.id || "");
 1143:   const filePath = asString(asset.file_path || asset.local_path || asset.path || asset.preview_url || "").trim();
 1144:   const copyButton = includeCopy
 1145:     ? `<button class="btn btn-secondary" type="button" data-copy-asset-path="${escapeHtml(filePath)}"${filePath ? "" : " disabled aria-disabled=\"true\""}>Copy path</button>`
 1146:     : "";
 1147: 
 1148:   return `
 1149:     <div class="library-document-preview-actions">
 1150:       <button class="btn btn-primary" type="button" data-library-open="${assetId}"${assetId ? "" : " disabled aria-disabled=\"true\""}>${escapeHtml(openLabel)}</button>
 1151:       ${copyButton}
 1152:       <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${assetId ? "" : " disabled aria-disabled=\"true\""}>Prepare AI review</button>
 1153:     </div>
 1154:   `;
 1155: }
 1156: 
 1157: function renderUnsupportedPreviewCard(asset = {}, escapeHtml, options = {}) {
 1158:   const extension = asString(options.extension || getPreviewExtensionForAsset(asset) || "file").toLowerCase();
 1159:   const label = options.label || toDocumentPreviewLabel(extension);
 1160:   const title = options.title || "Preview not available inline";
 1161:   const fileName = getPreviewFileName(asset);
 1162:   const sourceLabel = getPreviewSourceLabel(asset);
 1163:   const status = asString(asset.status || asset.readiness_status || "n/a").replace(/[_-]+/g, " ");
 1164: 
 1165:   return `
 1166:     <div class="library-preview-fallback library-document-preview library-preview-capability-card">
 1167:       <div class="library-preview-extension">${escapeHtml((extension || "file").toUpperCase())}</div>
 1168:       <strong>${escapeHtml(title)}</strong>
 1169:       <div class="library-preview-copy">${escapeHtml(options.message || "Preview shows what the browser can safely render. Unsupported files can still be opened or sent to AI review context.")}</div>
 1170:       <dl class="library-preview-file-facts">
 1171:         <div><dt>File</dt><dd>${escapeHtml(fileName)}</dd></div>
 1172:         <div><dt>Type</dt><dd>${escapeHtml(label)}</dd></div>
 1173:         <div><dt>Source</dt><dd>${escapeHtml(sourceLabel)}</dd></div>
 1174:         <div><dt>Status</dt><dd>${escapeHtml(status || "n/a")}</dd></div>
 1175:       </dl>
 1176:       ${renderPreviewActionButtons(asset, escapeHtml)}
```

### Selection / Action Binding Zone

```js
    1: import { renderGuideBox } from "../components/guide-box.js";
    2: import { getSourceTypeMapping } from "../shared-context.js";
    3: import {
    4:   setSharedAiSource,
    5:   getSharedLibrarySourceBridge,
    6:   clearSharedLibrarySourceBridge,
    7:   setSharedAiDrawerReturn,
    8:   getSharedAiDrawerReturn
    9: } from "../shared-context.js";
   10: 
   11: function buildAiSourcePayloadFromAsset(asset = {}) {
   12:   if (!asset) return null;
   13:   return {
   14:     id: asset.id,
   15:     asset_id: asset.asset_id,
   16:     name: asset.name,
   17:     filename: asset.filename,
   18:     file_path: asset.file_path,
   19:     asset_type: asset.asset_type,
   20:     source_label: asset.source_label || asset.name || "Library asset",
   21:     source_of_truth: asset.source_of_truth,
   22:     text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
   23:     selected_at: new Date().toISOString()
   24:   };
   25: }
   26: 
   27: // --- Library Source Bridge Guide Box ---
   28: // This must be run inside the render() function, after projectName is defined.
   29: 
   30: import { renderLibraryActionPanel } from "./library/action-panel.js";
   31: import { renderLibraryAiPanel } from "./library/ai-panel.js";
   32: import { normalizeLibraryAsset } from "./library/projection-adapter.js";
   33: import { normalizeLibrarySession } from "./library/session-store.js";
   34: import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
   35: import { mountLibraryListeners } from "./library/listener-lifecycle.js";
   36: import {
   37:   AccessKeyError,
   38:   archiveProjectAsset,
   39:   deleteProjectAsset,
   40:   fetchProtectedMediaBlob,
   41:   refreshProjectLibrary,
   42:   reclassifyProjectAsset,
   43:   renameProjectAsset,
   44:   setProjectAssetSourceOfTruth,
   45:   updateProjectAssetStatus,
   46:   uploadProjectAsset
   47: } from "../api.js";
   48: import {
   49:   getAssetCatalog,
   50:   getCanonicalAssetType,
   51:   getCategoryReadinessList,
   52:   getMissingAssetLabels,
   53:   getAssetStatusTone
   54: } from "../asset-library.js";
   55: 
   56: const librarySessionStore = new Map();
   57: let librarySearchRenderTimer = null;
   58: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
```

## Decision Checklist
- If preview URLs can load arbitrary unsafe URL/data/blob without guard: patch preview guard.
- If file picker/drop accepts unsafe unsupported inputs without validation: patch input guard.
- If innerHTML uses unescaped user/project/source content: patch escaping at the smallest render boundary.
- If timers can leak or duplicate subscriptions on route changes: patch cleanup only.
- If findings are mostly template rendering with escapeHtml: close as verified and move to next risk.
- Do not touch CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
