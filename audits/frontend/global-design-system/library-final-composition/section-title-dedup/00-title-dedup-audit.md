# LIB-UX-2B — Section Title and Duplicate Asset Text Audit

Generated: Sat Jun  6 22:36:57 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: aa8d840

## Current relevant signals
public/control-center/pages/library.js:16:    name: asset.name,
public/control-center/pages/library.js:17:    filename: asset.filename,
public/control-center/pages/library.js:20:    source_label: asset.source_label || asset.name || "Library asset",
public/control-center/pages/library.js:302:  const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
public/control-center/pages/library.js:394:  const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
public/control-center/pages/library.js:518:          const assetName = link.getAttribute("data-asset-name") || decodeURIComponent(fileUrl.split("/").pop() || "download");
public/control-center/pages/library.js:521:            filename: assetName,
public/control-center/pages/library.js:682:    const fileName = basename(localPath || item.file_name || item.filename || item.name || "");
public/control-center/pages/library.js:694:    const fileName = basename(filePath || asset.file_name || asset.filename || asset.name || `asset-${index + 1}`);
public/control-center/pages/library.js:734:        filename: fileName
public/control-center/pages/library.js:761:      filename: fileName,
public/control-center/pages/library.js:993:      .map((entry) => asString(entry.filename).trim())
public/control-center/pages/library.js:1004:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
public/control-center/pages/library.js:1005:      return Boolean(filename && recentUploadedNames.has(filename));
public/control-center/pages/library.js:1033:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
public/control-center/pages/library.js:1059:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
public/control-center/pages/library.js:1060:      const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);
public/control-center/pages/library.js:1079:    asset.filename ||
public/control-center/pages/library.js:1080:    asset.file_name ||
public/control-center/pages/library.js:1083:    asset.name ||
public/control-center/pages/library.js:1125:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1126:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1132:      <div class="library-preview-frame">
public/control-center/pages/library.js:1133:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1141:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1142:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1148:      <div class="library-preview-frame">
public/control-center/pages/library.js:1149:        <video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url || previewUrl))}"></video>
public/control-center/pages/library.js:1156:      <div class="library-preview-frame">
public/control-center/pages/library.js:1157:        <audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
public/control-center/pages/library.js:1165:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1166:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1172:      <div class="library-preview-frame">
public/control-center/pages/library.js:1173:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1181:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1182:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1188:      <div class="library-preview-frame">
public/control-center/pages/library.js:1189:        <video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>
public/control-center/pages/library.js:1207:          <iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
public/control-center/pages/library.js:1214:        <div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1215:          <div class="library-preview-extension">PDF</div>
public/control-center/pages/library.js:1217:          <div class="library-preview-copy">Loading protected PDF preview...</div>
public/control-center/pages/library.js:1223:      <div class="library-preview-fallback library-document-preview">
public/control-center/pages/library.js:1224:        <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
public/control-center/pages/library.js:1226:        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
public/control-center/pages/library.js:1237:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
public/control-center/pages/library.js:1242:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
public/control-center/pages/library.js:1246:    <div class="library-preview-fallback">
public/control-center/pages/library.js:1247:      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
public/control-center/pages/library.js:1248:      <div class="library-preview-copy">Preview not available for this file type.</div>
public/control-center/pages/library.js:1280:      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
public/control-center/pages/library.js:1285:      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
public/control-center/pages/library.js:1292:          <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
public/control-center/pages/library.js:1305:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
public/control-center/pages/library.js:1332:    image.alt = alt || asset.name || "Asset preview";
public/control-center/pages/library.js:1858:        const fileName = truncateMiddle(asset.filename || basename(asset.file_path || "") || "-");
public/control-center/pages/library.js:1859:        const titleName = truncateMiddle(asset.name, 52);
public/control-center/pages/library.js:1863:            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
public/control-center/pages/library.js:1864:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
public/control-center/pages/library.js:1865:          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;
public/control-center/pages/library.js:1869:          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
public/control-center/pages/library.js:1870:            <div class="library-grid-preview">${previewNode}</div>
public/control-center/pages/library.js:1871:            <div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>
public/control-center/pages/library.js:1872:            <div class="library-grid-meta" title="${escapeHtml(asset.filename || "-")}">${escapeHtml(fileName)}</div>
public/control-center/pages/library.js:1873:            <div class="library-grid-foot">
public/control-center/pages/library.js:1875:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
public/control-center/pages/library.js:1889:      <div class="library-grid-page-info">Showing ${escapeHtml(String(showingStart))}-${escapeHtml(String(showingEnd))} of ${escapeHtml(String(filteredAssets.length))}</div>
public/control-center/pages/library.js:1890:      <div class="library-grid-page-actions">
public/control-center/pages/library.js:1891:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
public/control-center/pages/library.js:1893:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
public/control-center/pages/library.js:1918:      className: "library-grid-thumb",
public/control-center/pages/library.js:1919:      alt: asset.name,
public/control-center/pages/library.js:1920:      fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`,
public/control-center/pages/library.js:1947:          <span>${escapeHtml(selectedAsset.filename || basename(selectedAsset.file_path || "") || "-")}</span>
public/control-center/pages/library.js:1964:      : `<div class="empty-box">Select an asset to preview context. Actions become available in the Action Panel.</div>`;
public/control-center/pages/library.js:2027:              <strong>${escapeHtml(asset.name)}</strong>
public/control-center/pages/library.js:2043:              <strong>${escapeHtml(item.filename)}</strong>
public/control-center/pages/library.js:2254:  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
public/control-center/pages/library.js:2258:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2273:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2387:        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
public/control-center/pages/library.js:2467:      const assetLabel = selectedAsset?.name || selectedAsset?.filename || assetId;
public/control-center/pages/library.js:2555:      const nextName = await promptForTextInput("Rename asset", asset.name || "");
public/control-center/pages/library.js:2646:  const gridPageButtons = Array.from(document.querySelectorAll("[data-library-grid-page]"));
public/control-center/pages/library.js:2652:      const action = button.getAttribute("data-library-grid-page");
public/control-center/pages/library.js:2875:              filename: result?.filename || file.name,
public/control-center/pages/library.js:2882:              filename: file.name,
public/control-center/pages/library.js:2984:        .map((asset) => asset.name);
public/control-center/pages/library.js:3250:              <div id="libraryAssetGridBody" class="library-grid-body"></div>
public/control-center/pages/library.js:3251:              <div id="libraryGridPagination" class="library-grid-pagination"></div>
public/control-center/pages/library.js:3256:                <section class="card library-preview-card">
public/control-center/pages/library.js:3258:                    <h3>Selected Asset Preview</h3>
public/control-center/pages/library.js:3262:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
public/control-center/pages/library/action-panel.js:21:  const assetName = escapePanelHtml(selectedAsset?.name || selectedAsset?.filename || "No asset selected");
public/control-center/pages/library/action-panel.js:30:    ? "Choose the next safe action for this asset."
public/control-center/pages/library/action-panel.js:38:    <section class="card library-action-panel" data-library-action-panel>
public/control-center/pages/library/action-panel.js:41:          <p class="eyebrow">Selected Asset</p>
public/control-center/pages/library/action-panel.js:42:          <h3>Actions</h3>
public/control-center/pages/library/action-panel.js:67:        <p class="setup-helper">Primary Actions</p>
public/control-center/styles/14-page-standard.css:1512:[data-page="library"] .library-grid-body {
public/control-center/styles/14-page-standard.css:1518:[data-page="library"] .library-grid-card,
public/control-center/styles/14-page-standard.css:1519:[data-page="library"] .library-grid-item,
public/control-center/styles/14-page-standard.css:1534:[data-page="library"] .library-grid-card:hover {
public/control-center/styles/14-page-standard.css:1540:[data-page="library"] .library-grid-card.is-active {
public/control-center/styles/14-page-standard.css:1548:[data-page="library"] .library-grid-card.is-active .library-grid-title {
public/control-center/styles/14-page-standard.css:1552:[data-page="library"] .library-grid-preview {
public/control-center/styles/14-page-standard.css:1562:[data-page="library"] .library-grid-preview img,
public/control-center/styles/14-page-standard.css:1563:[data-page="library"] .library-grid-preview video,
public/control-center/styles/14-page-standard.css:1564:[data-page="library"] .library-grid-thumb {
public/control-center/styles/14-page-standard.css:1570:[data-page="library"] .library-grid-icon {
public/control-center/styles/14-page-standard.css:1576:[data-page="library"] .library-grid-title {
public/control-center/styles/14-page-standard.css:1585:[data-page="library"] .library-grid-meta {
public/control-center/styles/14-page-standard.css:1595:[data-page="library"] .library-preview-card {
public/control-center/styles/14-page-standard.css:1612:[data-page="library"] .library-preview-image,
public/control-center/styles/14-page-standard.css:1613:[data-page="library"] .library-preview-video {
public/control-center/styles/14-page-standard.css:1624:[data-page="library"] .library-preview-meta {
public/control-center/styles/14-page-standard.css:1659:[data-page="library"] .library-action-panel,
public/control-center/styles/14-page-standard.css:1894:  [data-page="library"] .library-grid-body {
public/control-center/styles/14-page-standard.css:2834:[data-page="library"] .library-preview-meta,
public/control-center/styles/14-page-standard.css:2835:[data-page="library"] .library-preview-path {
public/control-center/styles/14-page-standard.css:2874:[data-page="library"] .library-preview-meta {
public/control-center/styles/14-page-standard.css:2879:[data-page="library"] .library-preview-meta > strong,
public/control-center/styles/14-page-standard.css:2881:[data-page="library"] .library-action-panel strong {
public/control-center/styles/14-page-standard.css:2894:[data-page="library"] .library-action-panel .btn.btn-secondary {
public/control-center/styles/14-page-standard.css:2898:[data-page="library"] .library-action-panel .btn.btn-secondary:hover {
