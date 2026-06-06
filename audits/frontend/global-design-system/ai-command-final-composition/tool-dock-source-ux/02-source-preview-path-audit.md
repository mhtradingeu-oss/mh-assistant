# AI-COMMAND-GDS-2B — Tool Drawer Source Preview Path Audit

Generated: Sat Jun  6 23:05:15 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: c01297d

## Git Status
 M public/control-center/pages/ai-command/tool-dock.js
 M public/control-center/styles/08-components-foundation.css
?? audits/frontend/global-design-system/ai-command-final-composition/tool-dock-source-ux/

## Preview / media path signals in AI Command tool dock
160:function formatSharedAiSource(source = {}) {
164:  const path = source.file_path || source.filename || source.fileName || "";
165:  return { name, type, path };
168:function getSelectedLibrarySource(projectName = "") {
188:  const source = getSelectedLibrarySource(projectName);
194:  const path = source.file_path || source.path || source.filename || source.fileName || "";
195:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
207:  if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
209:  if (preview) lines.push(`- Text preview: ${preview}`);
237:  const source = getSelectedLibrarySource(projectName);
252:  const source = getSelectedLibrarySource(projectName);
268:  // Render compact selected source card
269:  const { name, type, path } = formatSharedAiSource(source);
273:        <div class=\"mhos-tool-drawer-source-eyebrow\">AI Source</div>
276:        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
418:      actionType: "preview",
421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
486:      actionType: "preview",
489:      destinations: ["preview", "content-studio", "compliance"],
528:      destinations: ["chat-preview", "content-studio", "publishing"],
542:      sourceTypes: ["current_draft", "preview", "current_chat"],
543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
569:      destinations: ["chat-preview", "media-studio", "library"],
582:      destinations: ["chat-preview", "media-studio", "library"],
595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
676:      destinations: ["chat-preview", "media-studio", "content-studio"],
689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
702:      actionType: "preview",
705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
731:      destinations: ["chat-preview", "publishing", "workflows"],
744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
922:      destinations: ["chat-preview", "governance", "content-studio"],
935:      destinations: ["chat-preview", "governance", "library", "workflows"],
948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
978:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
1047:      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1068:      actionType: "preview",
1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1454:    : `${source}. If the selected source is not available in the current context, ask me to choose, paste, upload, or open the relevant source before producing final content.`;
1485:    "Use only the available context and selected source details.",
1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
1742:        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
1788:        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);

## Preview / media path signals in Library
public/control-center/pages/library.js:18:    file_path: asset.file_path,
public/control-center/pages/library.js:22:    text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
public/control-center/pages/library.js:254:  const filePath = asString(asset?.file_path || "").trim();
public/control-center/pages/library.js:301:  const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
public/control-center/pages/library.js:329:function getAssetPreviewUrl(asset) {
public/control-center/pages/library.js:332:    asset.preview_url
public/control-center/pages/library.js:342:  const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
public/control-center/pages/library.js:347:    getAssetPreviewUrl(asset)
public/control-center/pages/library.js:393:  const previewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:394:  const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
public/control-center/pages/library.js:396:  if (!requiresProtectedMediaFetch(previewUrl)) {
public/control-center/pages/library.js:398:      objectUrl: previewUrl,
public/control-center/pages/library.js:426:    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
public/control-center/pages/library.js:520:            preview_url: fileUrl,
public/control-center/pages/library.js:681:    const localPath = asString(item.local_path || item.file_path || item.path).trim();
public/control-center/pages/library.js:693:    const filePath = asString(asset.file_path || asset.local_path || asset.path || asset.url || "").trim();
public/control-center/pages/library.js:727:    const previewUrl = merged.preview_url ||
public/control-center/pages/library.js:733:        file_path: filePath,
public/control-center/pages/library.js:760:      file_path: filePath,
public/control-center/pages/library.js:763:      preview_url: previewUrl,
public/control-center/pages/library.js:808:    file_path: asString(asset.handoff_id || asset.media_job_id || ""),
public/control-center/pages/library.js:817:    preview_url: firstValidUrl(imageUrl, videoUrl, audioUrl),
public/control-center/pages/library.js:825:    text_preview: promptText || briefText,
public/control-center/pages/library.js:826:    json_preview: payload,
public/control-center/pages/library.js:1004:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
public/control-center/pages/library.js:1033:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
public/control-center/pages/library.js:1059:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
public/control-center/pages/library.js:1081:    asset.file_path ||
public/control-center/pages/library.js:1082:    asset.preview_url ||
public/control-center/pages/library.js:1104:    getAssetPreviewUrl(asset) ||
public/control-center/pages/library.js:1105:    asset.file_path ||
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
public/control-center/pages/library.js:1254:  previewNode,
public/control-center/pages/library.js:1260:  if (!previewNode || !asset) {
public/control-center/pages/library.js:1270:    if (!previewNode.isConnected) {
public/control-center/pages/library.js:1274:    const currentId = previewNode.getAttribute("data-preview-asset-id") || "";
public/control-center/pages/library.js:1280:      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
public/control-center/pages/library.js:1285:      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
public/control-center/pages/library.js:1290:      previewNode.outerHTML = `
public/control-center/pages/library.js:1291:        <div class="library-pdf-preview">
public/control-center/pages/library.js:1292:          <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
public/control-center/pages/library.js:1297:    if (!previewNode.isConnected) {
public/control-center/pages/library.js:1305:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
public/control-center/pages/library.js:1332:    image.alt = alt || asset.name || "Asset preview";
public/control-center/pages/library.js:1349:    showError?.(`Could not load asset preview: ${error.message || "Unknown error."}`);
public/control-center/pages/library.js:1858:        const fileName = truncateMiddle(asset.filename || basename(asset.file_path || "") || "-");
public/control-center/pages/library.js:1860:        const assetPreviewUrl = getAssetPreviewUrl(asset);
public/control-center/pages/library.js:1861:        const previewNode = asset.is_image && assetPreviewUrl
public/control-center/pages/library.js:1863:            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
public/control-center/pages/library.js:1870:            <div class="library-grid-preview">${previewNode}</div>
public/control-center/pages/library.js:1898:  const protectedThumbNodes = Array.from(document.querySelectorAll("[data-library-protected-thumb]"));
public/control-center/pages/library.js:1899:  const prioritizedThumbNodes = protectedThumbNodes
public/control-center/pages/library.js:1901:      const leftId = left.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1902:      const rightId = right.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1910:    const assetId = node.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1925:  const previewVisual = $("libraryPreviewVisual");
public/control-center/pages/library.js:1926:  if (previewVisual) {
public/control-center/pages/library.js:1927:    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
public/control-center/pages/library.js:1929:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
public/control-center/pages/library.js:1930:    if (protectedPreviewNode && selectedAsset) {
public/control-center/pages/library.js:1932:        previewNode: protectedPreviewNode,
public/control-center/pages/library.js:1941:  const previewMeta = $("libraryPreviewMeta");
public/control-center/pages/library.js:1942:  if (previewMeta) {
public/control-center/pages/library.js:1943:    previewMeta.innerHTML = selectedAsset
public/control-center/pages/library.js:1947:          <span>${escapeHtml(selectedAsset.filename || basename(selectedAsset.file_path || "") || "-")}</span>
public/control-center/pages/library.js:1964:      : `<div class="empty-box">Select an asset to preview context. Actions become available in the Action Panel.</div>`;
public/control-center/pages/library.js:1966:    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
public/control-center/pages/library.js:2342:      dispatchLibraryCommand("open-preview", { assetId: id }, {
public/control-center/pages/library.js:2343:        "open-preview": ({ assetId }) => ({
public/control-center/pages/library.js:3256:                <section class="card library-preview-card">
public/control-center/pages/library.js:3262:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
public/control-center/api.js:139:  return /missing\s+(?:protected\s+write\s+key|read\s+key|control\s+center\s+access\s+key)/i.test(normalized)
public/control-center/api.js:140:    || /invalid\s+(?:protected\s+write\s+key|read\s+key|access\s+key)/i.test(normalized)
public/control-center/api.js:836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
public/control-center/api.js:1008:    err.endpoint = `/media-manager/project/:project (${section})`;
public/control-center/api.js:1013:  err.endpoint = `/media-manager/project/:project (${section})`;
public/control-center/api.js:1023:  const response = await fetch("/media-manager/projects", {
public/control-center/api.js:1050:      "/media-manager/projects",
public/control-center/api.js:1079:    `/media-manager/project/${encodedProjectName}/startup`,
public/control-center/api.js:1092:    endpoint: `/media-manager/project/${encodedProjectName}`
public/control-center/api.js:1137:          endpoint: "/media-manager/projects",
public/control-center/api.js:1145:          endpoint: "/media-manager/projects",
public/control-center/api.js:1159:    error.endpoint = `/media-manager/project/${encodedProjectName}`;
public/control-center/api.js:1169:      endpoint: String(authProbe?.endpoint || `/media-manager/project/${encodedProjectName}`)
public/control-center/api.js:1330:    "/media-manager/asset-catalog",
public/control-center/api.js:1363:    `/media-manager/project/${encodeURIComponent(projectName)}/operations`,
public/control-center/api.js:1374:  const response = await fetch(`/media-manager/project/${encodedProjectName}/apply-template`, {
public/control-center/api.js:1406:    `/media-manager/project/${encodeURIComponent(projectName)}/setup`,
public/control-center/api.js:1419:    `/media-manager/project/${encodeURIComponent(projectName)}/library/refresh`,
public/control-center/api.js:1436:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
public/control-center/api.js:1461:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/rename`,
public/control-center/api.js:1478:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/source-of-truth`,
public/control-center/api.js:1495:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/archive`,
public/control-center/api.js:1512:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/delete`,
public/control-center/api.js:1534:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/classification`,
public/control-center/api.js:1554:    `/media-manager/project/${encodeURIComponent(projectName)}/workflows/${encodeURIComponent(workflowId)}/run`,
public/control-center/api.js:1571:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/workflows/${encodeURIComponent(workflowId)}/run`,
public/control-center/api.js:1584:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/command`,
public/control-center/api.js:1597:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/chat`,
public/control-center/api.js:1612:    `/media-manager/project/${encodeURIComponent(projectName)}/ai/guidance`,
public/control-center/api.js:1626:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
public/control-center/api.js:1640:    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
public/control-center/api.js:1651:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
public/control-center/api.js:1665:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
public/control-center/api.js:1680:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
public/control-center/api.js:1701:    `/media-manager/project/${encodeURIComponent(projectName)}/governance${suffix}`,
public/control-center/api.js:1712:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
public/control-center/api.js:1723:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
public/control-center/api.js:1744:    `/media-manager/project/${encodeURIComponent(projectName)}/sources`,
public/control-center/api.js:1764:    `/media-manager/project/${encodeURIComponent(projectName)}/sources/${encodeURIComponent(sourceType)}`,
public/control-center/api.js:1777:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/control-center`,
public/control-center/api.js:1792:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/connect`,
public/control-center/api.js:1809:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/reconnect`,
public/control-center/api.js:1826:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/test`,
public/control-center/api.js:1843:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/sync`,
public/control-center/api.js:1860:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/import-history`,
public/control-center/api.js:1877:    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/disconnect`,
public/control-center/api.js:1890:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
public/control-center/api.js:1907:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
public/control-center/api.js:1924:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
public/control-center/api.js:1941:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
public/control-center/api.js:1958:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
public/control-center/api.js:1971:    `/media-manager/project/${encodeURIComponent(projectName)}/operations/schema`,
public/control-center/api.js:1982:    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
public/control-center/api.js:1993:    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
public/control-center/api.js:2004:    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
public/control-center/api.js:2015:    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
public/control-center/api.js:2026:    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
public/control-center/api.js:2037:    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
public/control-center/api.js:2052:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns${suffix}`,
public/control-center/api.js:2064:      `/media-manager/project/${encodeURIComponent(projectName)}/campaigns/${encodeURIComponent(payload.id)}`,
public/control-center/api.js:2072:    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns`,
public/control-center/api.js:2097:    `/media-manager/project/${encodeURIComponent(projectName)}/content-items${suffix}`,
public/control-center/api.js:2109:      `/media-manager/project/${encodeURIComponent(projectName)}/content-items/${encodeURIComponent(payload.id)}`,
public/control-center/api.js:2117:    `/media-manager/project/${encodeURIComponent(projectName)}/content-items`,
public/control-center/api.js:2146:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
public/control-center/api.js:2158:      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
public/control-center/api.js:2166:    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
public/control-center/api.js:2253:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs${suffix}`,
public/control-center/api.js:2264:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs`,
public/control-center/api.js:2281:    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs/${encodeURIComponent(handoffId)}/consume`,
public/control-center/api.js:2296:    `/media-manager/project/${encodeURIComponent(projectName)}/events${suffix}`,
public/control-center/api.js:2311:    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,
runtime/orchestrator-service/server.js:359:  return /^\/(?:public\/)?media-manager\//.test(requestPath)
runtime/orchestrator-service/server.js:401:      error: `Missing protected write key. Provide ${CONTROL_WRITE_KEY_HEADER} or Authorization: Bearer <key>.`
runtime/orchestrator-service/server.js:407:      error: 'Invalid protected write key.'
runtime/orchestrator-service/server.js:420:  /^\/(?:public\/)?media-manager\/projects\/?$/i,
runtime/orchestrator-service/server.js:421:  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
runtime/orchestrator-service/server.js:422:  /^\/(?:public\/)?media-manager\/project\//i,
runtime/orchestrator-service/server.js:423:  /^\/(?:public\/)?media-manager\/storage\//i,
runtime/orchestrator-service/server.js:609:        preview_url: asString(output?.images?.[0]?.url || output?.image_url || ''),
runtime/orchestrator-service/server.js:610:        file_path: asString(output?.images?.[0]?.file_path || ''),
runtime/orchestrator-service/server.js:751:      match?.file_path ||
runtime/orchestrator-service/server.js:967:  /^\/(?:public\/)?media-manager\/project\/([^/?#]+)/i,
runtime/orchestrator-service/server.js:1178:    protected_write_mode: {
runtime/orchestrator-service/server.js:3876:    file_path: filePath
runtime/orchestrator-service/server.js:3890:    file_path: filePath
runtime/orchestrator-service/server.js:3954:    file_path: filePath
runtime/orchestrator-service/server.js:3971:    file_path: filePath
runtime/orchestrator-service/server.js:4056:    file_path: filePath
runtime/orchestrator-service/server.js:4077:    connector_file: payload.file_path
runtime/orchestrator-service/server.js:4092:    file_path: filePath
runtime/orchestrator-service/server.js:4178:    preview_type:
runtime/orchestrator-service/server.js:4198:    asset_preview_items: Array.isArray(base.asset_preview_items) ? base.asset_preview_items.slice(0, 3) : [],
runtime/orchestrator-service/server.js:4211:  const preview = buildPublishingPreviewBase(
runtime/orchestrator-service/server.js:4229:    input.preview || null
runtime/orchestrator-service/server.js:4232:  preview.asset_preview_items = assets.slice(0, 3).map(item => ({
runtime/orchestrator-service/server.js:4241:  return preview;
runtime/orchestrator-service/server.js:4253:    rawJob.connector_preview && typeof rawJob.connector_preview === 'object'
runtime/orchestrator-service/server.js:4254:      ? rawJob.connector_preview
runtime/orchestrator-service/server.js:4262:  const preview = buildPublishingPreviewBase(
runtime/orchestrator-service/server.js:4292:    connector_preview: connectorPreview,
runtime/orchestrator-service/server.js:4293:    preview
runtime/orchestrator-service/server.js:4301:  delete payload.file_path;
runtime/orchestrator-service/server.js:4315:    file_path: filePath
runtime/orchestrator-service/server.js:4326:      connector_preview: null,
runtime/orchestrator-service/server.js:4335:      connector_file: payload.file_path,
runtime/orchestrator-service/server.js:4336:      connector_preview: buildPublishingPreviewFromConnectorPayload(payload, input),
runtime/orchestrator-service/server.js:4343:      connector_preview: null,
runtime/orchestrator-service/server.js:4393:  const preview = buildPublishingPreviewBase(
runtime/orchestrator-service/server.js:4395:      ...(existing.preview || {}),
runtime/orchestrator-service/server.js:4396:      ...(connectorInfo.connector_preview || {}),
runtime/orchestrator-service/server.js:4397:      ...(input.preview && typeof input.preview === 'object' ? input.preview : {}),
runtime/orchestrator-service/server.js:4404:    connectorInfo.connector_preview || existing.preview || existing.connector_preview || null
runtime/orchestrator-service/server.js:4421:    total_assets: connectorInfo.total_assets || existing.total_assets || preview.asset_count || 0,
runtime/orchestrator-service/server.js:4423:    connector_preview: connectorInfo.connector_preview || existing.connector_preview || preview,
runtime/orchestrator-service/server.js:4428:    preview
runtime/orchestrator-service/server.js:4610:    file_path: filePath
runtime/orchestrator-service/server.js:4675:    file_path: filePath
runtime/orchestrator-service/server.js:4724:    file_path: filePath
runtime/orchestrator-service/server.js:5610:        const assetFilename = path.basename(String(asset.file_path || '').trim());
runtime/orchestrator-service/server.js:5618:      if (assetMatch && fs.existsSync(assetMatch.file_path)) {
runtime/orchestrator-service/server.js:5619:        return assetMatch.file_path;
runtime/orchestrator-service/server.js:6349:      route: '/media-manager/project/:project/setup',
runtime/orchestrator-service/server.js:6359:      route: '/media-manager/project/:project/setup',
runtime/orchestrator-service/server.js:6773:    brand_profile_path: paths.brandProfilePath,
runtime/orchestrator-service/server.js:7402:  const filePath = normalizeSetupTextValue(asset.file_path || asset.path);
runtime/orchestrator-service/server.js:7415:    file_path: filePath,
runtime/orchestrator-service/server.js:7468:    file_path: filePath,
runtime/orchestrator-service/server.js:7473:  const withoutExisting = assets.filter((item) => item.file_path !== record.file_path || item.type !== record.type);
runtime/orchestrator-service/server.js:8334:        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
runtime/orchestrator-service/server.js:8566:  const filePath = String(record.file_path || record.local_path || '').trim();
runtime/orchestrator-service/server.js:8830:      file_path: filePath,
runtime/orchestrator-service/server.js:8839:      file_path: filePath,
runtime/orchestrator-service/server.js:8848:      file_path: filePath,
runtime/orchestrator-service/server.js:8936:    const filePath = String(asset.file_path || '').trim();
runtime/orchestrator-service/server.js:8953:    const filePath = String(scanned.file_path || '').trim();
runtime/orchestrator-service/server.js:8965:      file_path: filePath,
runtime/orchestrator-service/server.js:9050:      .map(asset => asset.asset_id || path.basename(String(asset.file_path || '')))
runtime/orchestrator-service/server.js:9054:      .map(asset => asset.asset_id || path.basename(String(asset.file_path || '')))
runtime/orchestrator-service/server.js:9260:    source_file_path: inputPath,
runtime/orchestrator-service/server.js:9261:    destination_file_path: destinationPath,
runtime/orchestrator-service/server.js:9283:      in_expected_folder = String(asset.file_path || '').startsWith(folderInfo.target_dir);
runtime/orchestrator-service/server.js:9292:      file_path: asset.file_path,
runtime/orchestrator-service/server.js:9380:app.get('/media-manager/project/:project/storage/parity-readiness', (req, res) => {
runtime/orchestrator-service/server.js:9391:app.get('/public/media-manager/project/:project/storage/parity-readiness', (req, res) => {
runtime/orchestrator-service/server.js:9402:app.get('/media-manager/storage/parity-readiness', (req, res) => {
runtime/orchestrator-service/server.js:9413:app.get('/public/media-manager/storage/parity-readiness', (req, res) => {
runtime/orchestrator-service/server.js:9543:      execution_log: log.file_path
runtime/orchestrator-service/server.js:9631:      execution_log: log.file_path
runtime/orchestrator-service/server.js:9712:      execution_log: log.file_path
runtime/orchestrator-service/server.js:9798:      execution_log: log.file_path
runtime/orchestrator-service/server.js:10295:    return res.status(400).send('Invalid media path');
runtime/orchestrator-service/server.js:10609:app.post('/media-manager/project/:project/rename', express.json({ limit: '1mb' }), handleRenameMediaManagerProject);
runtime/orchestrator-service/server.js:10611:app.post('/public/media-manager/project/:project/rename', express.json({ limit: '1mb' }), handleRenameMediaManagerProject);
runtime/orchestrator-service/server.js:10613:app.post('/media-manager/project/:project/apply-template', express.json({ limit: '1mb' }), handleApplyBusinessTemplateToProject);
runtime/orchestrator-service/server.js:10615:app.post('/public/media-manager/project/:project/apply-template', express.json({ limit: '1mb' }), handleApplyBusinessTemplateToProject);
runtime/orchestrator-service/server.js:10617:app.post('/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);
runtime/orchestrator-service/server.js:10619:app.post('/public/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);
runtime/orchestrator-service/server.js:10621:app.get('/media-manager/projects', (req, res) => {
runtime/orchestrator-service/server.js:10625:app.get('/public/media-manager/projects', (req, res) => {
runtime/orchestrator-service/server.js:10629:app.get('/media-manager/asset-catalog', (req, res) => {
runtime/orchestrator-service/server.js:10635:app.get('/public/media-manager/asset-catalog', (req, res) => {
runtime/orchestrator-service/server.js:10641:app.get('/media-manager/project/:project/startup', (req, res) => {
runtime/orchestrator-service/server.js:10651:app.get('/public/media-manager/project/:project/startup', (req, res) => {
runtime/orchestrator-service/server.js:10661:app.get('/media-manager/project/:project', (req, res) => {
runtime/orchestrator-service/server.js:10671:app.get('/public/media-manager/project/:project', (req, res) => {
runtime/orchestrator-service/server.js:10708:    const localPath = String(value.local_path || value.file_path || value.path || '').trim();
runtime/orchestrator-service/server.js:10720:      path.basename(String(value.local_path || value.file_path || value.path || ''))
runtime/orchestrator-service/server.js:10808:app.post('/media-manager/project/:project/assets/:assetId/status', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:10862:app.post('/media-manager/project/:project/assets/:assetId/rename', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:10892:app.patch('/media-manager/project/:project/assets/:assetId/classification', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:10946:app.post('/media-manager/project/:project/assets/:assetId/source-of-truth', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:10971:app.post('/media-manager/project/:project/assets/:assetId/archive', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:10999:app.post('/media-manager/project/:project/assets/:assetId/delete', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:11030:app.delete('/media-manager/project/:project/assets/:assetId', express.json({ limit: '1mb' }), (req, res) => {
runtime/orchestrator-service/server.js:11061:app.post('/media-manager/project/:project/library/refresh', (req, res) => {
runtime/orchestrator-service/server.js:11071:app.post('/media-manager/project/:project/setup', (req, res) => {
runtime/orchestrator-service/server.js:11110:app.post('/public/media-manager/project/:project/setup', (req, res) => {
runtime/orchestrator-service/server.js:11159:app.get('/media-manager/project/:project/operations', handleGetProjectOperations);
runtime/orchestrator-service/server.js:11160:app.get('/public/media-manager/project/:project/operations', handleGetProjectOperations);
runtime/orchestrator-service/server.js:11218:app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
runtime/orchestrator-service/server.js:11219:app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
runtime/orchestrator-service/server.js:11220:app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
runtime/orchestrator-service/server.js:11221:app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
runtime/orchestrator-service/server.js:11222:app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
runtime/orchestrator-service/server.js:11223:app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
runtime/orchestrator-service/server.js:11224:app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
runtime/orchestrator-service/server.js:11225:app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);
runtime/orchestrator-service/server.js:11234:app.get('/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
runtime/orchestrator-service/server.js:11235:app.get('/public/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
runtime/orchestrator-service/server.js:11291:app.get('/media-manager/project/:project/team', handleGetProjectTeam);
runtime/orchestrator-service/server.js:11292:app.get('/public/media-manager/project/:project/team', handleGetProjectTeam);
runtime/orchestrator-service/server.js:11293:app.post('/media-manager/project/:project/team', handleUpdateProjectTeam);
runtime/orchestrator-service/server.js:11294:app.post('/public/media-manager/project/:project/team', handleUpdateProjectTeam);
runtime/orchestrator-service/server.js:11339:app.get('/media-manager/project/:project/campaigns', handleListCampaigns);
runtime/orchestrator-service/server.js:11340:app.get('/public/media-manager/project/:project/campaigns', handleListCampaigns);
runtime/orchestrator-service/server.js:11341:app.post('/media-manager/project/:project/campaigns', handleUpsertCampaign);
runtime/orchestrator-service/server.js:11342:app.post('/public/media-manager/project/:project/campaigns', handleUpsertCampaign);
runtime/orchestrator-service/server.js:11343:app.patch('/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
runtime/orchestrator-service/server.js:11350:app.patch('/public/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
runtime/orchestrator-service/server.js:11357:app.get('/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);
runtime/orchestrator-service/server.js:11358:app.get('/public/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);
runtime/orchestrator-service/server.js:11404:app.get('/media-manager/project/:project/content-items', handleListContentItems);
runtime/orchestrator-service/server.js:11405:app.get('/public/media-manager/project/:project/content-items', handleListContentItems);
runtime/orchestrator-service/server.js:11406:app.post('/media-manager/project/:project/content-items', handleUpsertContentItem);
runtime/orchestrator-service/server.js:11407:app.post('/public/media-manager/project/:project/content-items', handleUpsertContentItem);
runtime/orchestrator-service/server.js:11408:app.patch('/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
runtime/orchestrator-service/server.js:11415:app.patch('/public/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
runtime/orchestrator-service/server.js:11422:app.get('/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);
runtime/orchestrator-service/server.js:11423:app.get('/public/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);
runtime/orchestrator-service/server.js:11470:app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
runtime/orchestrator-service/server.js:11471:app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
runtime/orchestrator-service/server.js:11472:app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
runtime/orchestrator-service/server.js:11473:app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
runtime/orchestrator-service/server.js:11474:app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
runtime/orchestrator-service/server.js:11481:app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
runtime/orchestrator-service/server.js:11488:app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
runtime/orchestrator-service/server.js:11489:app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
runtime/orchestrator-service/server.js:11506:app.get('/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
runtime/orchestrator-service/server.js:11507:app.get('/public/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
runtime/orchestrator-service/server.js:11523:app.get('/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
runtime/orchestrator-service/server.js:11524:app.get('/public/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
runtime/orchestrator-service/server.js:11593:app.post('/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
runtime/orchestrator-service/server.js:11594:app.post('/public/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
runtime/orchestrator-service/server.js:11933:app.get('/media-manager/project/:project/ai/commands', handleListAiCommands);
runtime/orchestrator-service/server.js:11934:app.get('/public/media-manager/project/:project/ai/commands', handleListAiCommands);
runtime/orchestrator-service/server.js:11935:app.get('/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
runtime/orchestrator-service/server.js:11936:app.get('/public/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
runtime/orchestrator-service/server.js:11937:app.post('/media-manager/project/:project/ai/command', handleExecuteAiCommand);
runtime/orchestrator-service/server.js:11938:app.post('/public/media-manager/project/:project/ai/command', handleExecuteAiCommand);
runtime/orchestrator-service/server.js:11939:app.post('/media-manager/project/:project/ai/chat', handleExecuteAiChat);
runtime/orchestrator-service/server.js:11940:app.post('/public/media-manager/project/:project/ai/chat', handleExecuteAiChat);
runtime/orchestrator-service/server.js:11941:app.post('/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
runtime/orchestrator-service/server.js:11942:app.post('/public/media-manager/project/:project/ai/guidance', handleExecuteAiGuidance);
runtime/orchestrator-service/server.js:11943:app.post('/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
runtime/orchestrator-service/server.js:11944:app.post('/public/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
runtime/orchestrator-service/server.js:11945:app.get('/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
runtime/orchestrator-service/server.js:11946:app.get('/public/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
runtime/orchestrator-service/server.js:11947:app.get('/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
runtime/orchestrator-service/server.js:11948:app.get('/public/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
runtime/orchestrator-service/server.js:11949:app.get('/media-manager/project/:project/ai/memory', handleListAiMemory);
runtime/orchestrator-service/server.js:11950:app.get('/public/media-manager/project/:project/ai/memory', handleListAiMemory);
runtime/orchestrator-service/server.js:11981:app.get('/media-manager/project/:project/tasks', handleListTasks);
runtime/orchestrator-service/server.js:11982:app.get('/public/media-manager/project/:project/tasks', handleListTasks);
runtime/orchestrator-service/server.js:11983:app.post('/media-manager/project/:project/tasks', handleCreateTask);
runtime/orchestrator-service/server.js:11984:app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
runtime/orchestrator-service/server.js:11985:app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
runtime/orchestrator-service/server.js:11998:app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {
runtime/orchestrator-service/server.js:12072:app.get('/media-manager/project/:project/approvals', handleListApprovals);
runtime/orchestrator-service/server.js:12073:app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
runtime/orchestrator-service/server.js:12074:app.post('/media-manager/project/:project/approvals', handleCreateApproval);
runtime/orchestrator-service/server.js:12075:app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
runtime/orchestrator-service/server.js:12076:app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
runtime/orchestrator-service/server.js:12077:app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
runtime/orchestrator-service/server.js:12130:app.get('/media-manager/project/:project/governance', handleGetGovernance);
runtime/orchestrator-service/server.js:12131:app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
runtime/orchestrator-service/server.js:12132:app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
runtime/orchestrator-service/server.js:12133:app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
runtime/orchestrator-service/server.js:12134:app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
runtime/orchestrator-service/server.js:12135:app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
runtime/orchestrator-service/server.js:12152:app.get('/media-manager/project/:project/notifications', handleListNotifications);
runtime/orchestrator-service/server.js:12153:app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
runtime/orchestrator-service/server.js:12154:app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
runtime/orchestrator-service/server.js:12167:app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
runtime/orchestrator-service/server.js:12227:app.get('/media-manager/project/:project/handoffs', handleListHandoffs);
runtime/orchestrator-service/server.js:12228:app.get('/public/media-manager/project/:project/handoffs', handleListHandoffs);
runtime/orchestrator-service/server.js:12229:app.post('/media-manager/project/:project/handoffs', handleCreateHandoff);
runtime/orchestrator-service/server.js:12230:app.post('/public/media-manager/project/:project/handoffs', handleCreateHandoff);
runtime/orchestrator-service/server.js:12231:app.post('/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
runtime/orchestrator-service/server.js:12232:app.post('/public/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
runtime/orchestrator-service/server.js:12249:app.get('/media-manager/project/:project/events', handleListEvents);
runtime/orchestrator-service/server.js:12250:app.get('/public/media-manager/project/:project/events', handleListEvents);
runtime/orchestrator-service/server.js:12277:app.post('/media-manager/project/:project/sources', (req, res) => {
runtime/orchestrator-service/server.js:12331:app.post('/public/media-manager/project/:project/sources', (req, res) => {
runtime/orchestrator-service/server.js:12385:app.delete('/media-manager/project/:project/sources/:sourceType', (req, res) => {
runtime/orchestrator-service/server.js:12424:app.delete('/public/media-manager/project/:project/sources/:sourceType', (req, res) => {
runtime/orchestrator-service/server.js:12656:app.get('/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);
runtime/orchestrator-service/server.js:12820:  '/media-manager/project/:project/customer-operations/health',
runtime/orchestrator-service/server.js:12825:  '/public/media-manager/project/:project/customer-operations/health',
runtime/orchestrator-service/server.js:12830:  '/media-manager/project/:project/customer-operations/readiness',
runtime/orchestrator-service/server.js:12835:  '/public/media-manager/project/:project/customer-operations/readiness',
runtime/orchestrator-service/server.js:12840:  '/media-manager/project/:project/customer-operations/channels',
runtime/orchestrator-service/server.js:12845:  '/public/media-manager/project/:project/customer-operations/channels',
runtime/orchestrator-service/server.js:12850:  '/media-manager/project/:project/customer-operations/inbox',
runtime/orchestrator-service/server.js:12855:  '/public/media-manager/project/:project/customer-operations/inbox',
runtime/orchestrator-service/server.js:12933:  '/media-manager/project/:project/customer-operations/conversations',
runtime/orchestrator-service/server.js:12938:  '/public/media-manager/project/:project/customer-operations/conversations',
runtime/orchestrator-service/server.js:12943:  '/media-manager/project/:project/customer-operations/messages',
runtime/orchestrator-service/server.js:12948:  '/public/media-manager/project/:project/customer-operations/messages',
runtime/orchestrator-service/server.js:12953:  '/media-manager/project/:project/customer-operations/customers',
runtime/orchestrator-service/server.js:12958:  '/public/media-manager/project/:project/customer-operations/customers',
runtime/orchestrator-service/server.js:12963:  '/media-manager/project/:project/customer-operations/sla',
runtime/orchestrator-service/server.js:12968:  '/public/media-manager/project/:project/customer-operations/sla',
runtime/orchestrator-service/server.js:12973:  '/media-manager/project/:project/customer-operations/escalations',
runtime/orchestrator-service/server.js:12978:  '/public/media-manager/project/:project/customer-operations/escalations',
runtime/orchestrator-service/server.js:12983:app.get('/media-manager/project/:project/native-media/providers', handleGetNativeMediaProviders);
runtime/orchestrator-service/server.js:12984:app.get('/public/media-manager/project/:project/native-media/providers', handleGetNativeMediaProviders);
runtime/orchestrator-service/server.js:12985:app.get('/media-manager/project/:project/native-media/providers/readiness', handleGetNativeMediaProviderReadiness);
runtime/orchestrator-service/server.js:12986:app.get('/public/media-manager/project/:project/native-media/providers/readiness', handleGetNativeMediaProviderReadiness);
runtime/orchestrator-service/server.js:13028:app.post('/media-manager/project/:project/native-media/generate', handleNativeMediaGenerate);
runtime/orchestrator-service/server.js:13032:app.get('/public/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);
runtime/orchestrator-service/server.js:13034:app.post('/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
runtime/orchestrator-service/server.js:13040:app.post('/public/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
runtime/orchestrator-service/server.js:13046:app.post('/media-manager/project/:project/integrations/:integrationId', async (req, res) => {
runtime/orchestrator-service/server.js:13052:app.post('/public/media-manager/project/:project/integrations/:integrationId', async (req, res) => {
runtime/orchestrator-service/server.js:13058:app.post('/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
runtime/orchestrator-service/server.js:13064:app.post('/public/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
runtime/orchestrator-service/server.js:13070:app.post('/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
runtime/orchestrator-service/server.js:13074:app.post('/public/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
runtime/orchestrator-service/server.js:13078:app.post('/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
runtime/orchestrator-service/server.js:13082:app.post('/public/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
runtime/orchestrator-service/server.js:13086:app.post('/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
runtime/orchestrator-service/server.js:13090:app.post('/public/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
runtime/orchestrator-service/server.js:13094:app.post('/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
runtime/orchestrator-service/server.js:13098:app.post('/public/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
runtime/orchestrator-service/server.js:13102:// TODO(phase4a): Keep `/public/media-manager/...` write aliases for active frontend compatibility.
runtime/orchestrator-service/server.js:13103:// They remain protected by the same centralized write-key middleware as `/media-manager/...`.
runtime/orchestrator-service/server.js:13104:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
runtime/orchestrator-service/server.js:13128:      preview: req.body?.preview
runtime/orchestrator-service/server.js:13147:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
runtime/orchestrator-service/server.js:13171:      preview: req.body?.preview
runtime/orchestrator-service/server.js:13190:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
runtime/orchestrator-service/server.js:13215:      preview: req.body?.preview
runtime/orchestrator-service/server.js:13229:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
runtime/orchestrator-service/server.js:13254:      preview: req.body?.preview
runtime/orchestrator-service/server.js:13268:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
runtime/orchestrator-service/server.js:13300:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
runtime/orchestrator-service/server.js:13332:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
runtime/orchestrator-service/server.js:13374:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
runtime/orchestrator-service/server.js:13416:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
runtime/orchestrator-service/server.js:13458:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
runtime/orchestrator-service/server.js:13500:app.get('/media-manager', (req, res) => {
runtime/orchestrator-service/server.js:13504:app.get('/media-manager/', (req, res) => {
runtime/orchestrator-service/server.js:14011:    file_path: filePath
runtime/orchestrator-service/server.js:14033:    file_path: filePath
runtime/orchestrator-service/server.js:14153:    file_path: filePath
runtime/orchestrator-service/server.js:14189:    file_path: filePath
runtime/orchestrator-service/server.js:14227:    file_path: filePath
runtime/orchestrator-service/server.js:14327:    file_path: filePath
runtime/orchestrator-service/server.js:14382:    || channelAsset.file_path
runtime/orchestrator-service/server.js:14766:    file_path: filePath
runtime/orchestrator-service/server.js:14784:    file_path: filePath
runtime/orchestrator-service/server.js:14804:    file_path: filePath
runtime/orchestrator-service/server.js:14888:    file_path: filePath
runtime/orchestrator-service/server.js:15055:    file_path: recordFilePath,
runtime/orchestrator-service/server.js:15083:    preview: job.preview || job.connector_preview || null
runtime/orchestrator-service/server.js:15097:    file_path: filePath
runtime/orchestrator-service/server.js:15293:    total_assets: Number(rawResult.total_assets || relatedJob?.total_assets || relatedJob?.preview?.asset_count || 0) || 0,
runtime/orchestrator-service/server.js:15301:    preview:
runtime/orchestrator-service/server.js:15302:      (rawResult.preview && typeof rawResult.preview === 'object' ? rawResult.preview : null) ||
runtime/orchestrator-service/server.js:15303:      relatedJob?.preview ||
runtime/orchestrator-service/server.js:15304:      relatedJob?.connector_preview ||
runtime/orchestrator-service/server.js:15325:    file_path: filePath
runtime/orchestrator-service/server.js:15558:    images: images.map(file_path => ({
runtime/orchestrator-service/server.js:15559:      file_path,
runtime/orchestrator-service/server.js:15560:      file_name: path.basename(file_path),
runtime/orchestrator-service/server.js:15561:      product_slug: path.basename(path.dirname(file_path))
runtime/orchestrator-service/server.js:15563:    videos: videos.map(file_path => ({
runtime/orchestrator-service/server.js:15564:      file_path,
runtime/orchestrator-service/server.js:15565:      file_name: path.basename(file_path),
runtime/orchestrator-service/server.js:15566:      product_slug: path.basename(path.dirname(file_path))
runtime/orchestrator-service/server.js:15568:    csv_files: csv_files.map(file_path => ({
runtime/orchestrator-service/server.js:15569:      file_path,
runtime/orchestrator-service/server.js:15570:      file_name: path.basename(file_path)
