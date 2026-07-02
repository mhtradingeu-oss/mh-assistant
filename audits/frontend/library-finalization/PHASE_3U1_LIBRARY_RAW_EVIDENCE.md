# PHASE 3U.1 — Library Raw Evidence

## Git baseline
?? audits/frontend/library-finalization/
b47db37 Add frontend page coverage finalization matrix
9cb0a68 Close finalized operating surfaces wave
d7f9191 Add full system truth audit evidence
f5b10db Clarify AI Command prompt prefill guidance
0959a0f Plan AI Command composer prompt safe implementation
c7ebfb9 Plan AI Command composer and prompt UX improvements
a96c73e Add AI Command browser QA evidence
e1c7a11 Add AI Command browser QA baseline
b99652e Plan AI Command decomposition and UX finalization
d460a38 Add AI Command ownership handoff audit
cdcc82c Close Media Studio ownership usability pass
3cacc00 Clarify Media Studio usability guidance

## File sizes
  3165 public/control-center/pages/library.js
  5654 public/control-center/pages/ai-command.js
  3658 public/control-center/pages/media-studio-workspace.js
  2036 public/control-center/pages/publishing.js
  1489 public/control-center/pages/governance.js
  4207 public/control-center/app.js
   239 public/control-center/router.js
  2322 public/control-center/api.js
   201 public/control-center/shared-context.js
 22971 total

## Library imports / exports / major functions
1:import { renderGuideBox } from "../components/guide-box.js";
2:import { getSourceTypeMapping } from "../shared-context.js";
3:import {
11:function buildAiSourcePayloadFromAsset(asset = {}) {
30:import { renderLibraryActionPanel } from "./library/action-panel.js";
31:import { renderLibraryAiPanel } from "./library/ai-panel.js";
32:import { normalizeLibraryAsset } from "./library/projection-adapter.js";
33:import { normalizeLibrarySession } from "./library/session-store.js";
34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
35:import { mountLibraryListeners } from "./library/listener-lifecycle.js";
36:import {
47:import {
74:function getLibraryUploadTypeLabel(assetType = "") {
166:function asArray(value) {
170:function asObject(value) {
174:function asString(value) {
179:function isLibraryInteractiveElement(target) {
185:function bindLibraryControlEventShield(scope) {
192:function titleCase(value = "") {
198:function toKey(value = "") {
202:function projectKey(projectName) {
206:function readManagedMediaAssetMap() {
216:function loadLocalManagedMediaAssets(projectName) {
226:function basename(filePath = "") {
233:function getFileExtension(name = "") {
239:function shortPath(filePath = "", maxSegments = 4) {
247:function assetContextHint(asset) {
258:function shortAssetId(value = "") {
265:function truncateMiddle(value = "", maxLength = 44) {
272:function formatCount(value) {
278:function formatDate(value) {
285:function isImageExtension(extension = "") {
289:function isVideoExtension(extension = "") {
293:function buildPreviewUrl(projectName, asset) {
315:function requiresProtectedMediaFetch(fileUrl = "") {
323:function getAssetPreviewUrl(asset) {
334:function buildProtectedCacheKey(projectName, asset) {
345:function revokeLibraryProtectedUrl(key) {
353:function runNextLibraryThumbLoad() {
372:function enqueueLibraryThumbLoad(job) {
386:async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
419:  const loadPromise = (async () => {
447:async function openLibraryAsset(projectName, asset) {
476:function mountLibraryGlobalListeners() {
539:function unmountLibraryGlobalListeners() {
550:function ensureLibrarySession(projectName) {
578:function dispatchLibraryCommand(command, payload = {}, handlers = {}) {
583:function closeAllLibraryActionDropdowns() {
591:function getSafeAssetType(value = "") {
599:function getUploadAssetType(session, catalog, selectedValue) {
601:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
608:function escapeRegExp(value) {
612:function getCategoryByType(categoryReadiness) {
621:function normalizeReadinessStatus(value = "") {
636:function toStatusLabel(status = "") {
649:function toStatusTone(status = "") {
657:function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
658:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
766:function inferManagedAssetType(asset = {}) {
778:function normalizeManagedMediaAsset(rawAsset = {}, index = 0, sourceKind = "local") {
833:function firstValidUrl(...values) {
843:function getManagedMediaAssets(projectName, operations) {
881:function buildAssetOverview({ assets, requiredGroups }) {
885:  const recentlyUploadedByDate = assets.filter((asset) => {
891:  const approvedAssets = assets.filter((asset) => asset.status === "approved").length;
892:  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
893:  const missingRequiredAssets = requiredGroups.filter((item) => item.status === "missing").length;
894:  const sourceOfTruthAssets = assets.filter((asset) => asset.source_of_truth).length;
896:  const nextAction = requiredGroups.find((item) => item.status === "missing") || requiredGroups.find((item) => item.status === "needs_review") || null;
912:function buildCategoryBuckets(categoryReadiness) {
919:    const usedIn = [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in)))];
920:    const statuses = entries.map((entry) => normalizeReadinessStatus(entry.status));
940:function buildRequiredAssetGroups(categoryReadiness) {
948:    const statuses = entries.map((entry) => normalizeReadinessStatus(entry.status));
958:    const totalCount = entries.reduce((acc, item) => acc + Number(item.count || 0), 0);
970:function getFilteredAssets(allAssets, session, bucketMap) {
991:  const folderMatches = (asset) => {
1002:    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
1010:  const filtered = allAssets.filter((asset) => {
1032:  const toTimestamp = (value) => {
1037:  const sorted = [...filtered].sort((left, right) => {
1048:function computeFolderCounts(allAssets, session) {
1050:    const count = allAssets.filter((asset) => {
1054:      const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);
1070:function getPreviewExtensionForAsset(asset = {}) {
1082:function isDocumentExtension(extension = "") {
1086:function toDocumentPreviewLabel(extension = "") {
1096:function canAttemptDocumentPreview(asset = {}) {
1108:function renderPreview(asset, escapeHtml) {
1247:async function hydrateProtectedAssetPreview({
1307:async function hydrateProtectedImageNode({
1319:    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
1347:function protectLibraryInteractiveControls(scope) {
1351:function getWorkspaceAssetItems(assetsData, registry) {
1368:function buildAiPrompt(projectName, mode, payload = {}) {
1381:function promptForTextInput(title, initialValue = "") {
1440:    const cleanup = () => {
1487:function bindLibraryWorkspace({
1502:  const resolveActiveProjectName = () => asString(projectName || $("projectSwitcher")?.value || "").trim().toLowerCase();
1506:  const rerender = () => {
1524:  const reloadOrRerender = async () => {
1547:  const bucketMap = new Map(categoryBuckets.map((item) => [item.key, item]));
1554:  const selectedAssetExists = filteredAssets.some((asset) => asset.id === session.selectedAssetId);
1559:  const selectedAsset = filteredAssets.find((asset) => asset.id === session.selectedAssetId)
1566:  const missingRequiredGroupCount = requiredGroups.filter((item) => item.status === "missing").length;
1582:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
1857:    const asset = allAssets.find((item) => item.id === assetId);
1936:        const asset = allAssets.find((a) => a.id === selectedAsset.id || a.asset_id === selectedAsset.id);
2112:      const selected = allAssets.find((asset) => asset.id === selectedId);
2147:      const selected = allAssets.find((asset) => asset.id === nextId);
2176:      const selected = allAssets.find((asset) => asset.id === nextId);
2207:      const _fbCard = allAssets.find((a) => a.id === nextId);
2222:      const selected = allAssets.find((asset) => asset.id === nextId);
2291:      const asset = allAssets.find((item) => item.id === id);
2319:      const asset = allAssets.find((item) => item.id === assetId);
2352:      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);
2390:      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);
2424:      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);
2465:      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);
2596:    const updateUploadUiState = () => {
2598:      const names = files.slice(0, 6).map((file) => file.name).join(", ");
2610:    const syncDroppedFilesToInput = (files) => {
2665:    const openLibraryFilePicker = () => {
2884:export const libraryRoute = {
3068:      const count = folderCounts.find((item) => item.key === folder.key)?.count || 0;

## Library source / asset / evidence markers
11:function buildAiSourcePayloadFromAsset(asset = {}) {
12:  if (!asset) return null;
14:    id: asset.id,
15:    asset_id: asset.asset_id,
16:    name: asset.name,
17:    filename: asset.filename,
18:    file_path: asset.file_path,
19:    asset_type: asset.asset_type,
20:    source_label: asset.source_label || asset.name || "Library asset",
21:    source_of_truth: asset.source_of_truth,
22:    text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
23:    selected_at: new Date().toISOString()
53:} from "../asset-library.js";
57:const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
66:  social_assets: "Social Assets",
67:  campaign_assets: "Campaign Assets",
74:function getLibraryUploadTypeLabel(assetType = "") {
75:  const key = String(assetType || "").trim().toLowerCase();
76:  return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
96:  { key: "campaign_materials", label: "Campaign Materials", types: ["social_assets", "campaign_assets"] }
132:    why: "Video source assets are required for reels, demos, and cutdowns.",
146:    why: "Research and proof documents support claims, trust signals, and strategy decisions.",
152:  { key: "all_assets", label: "All Assets" },
162:  { key: "source_of_truth", label: "Source of Truth" },
187:  // Do not stop events on native controls. Select/input/file controls must
226:function basename(filePath = "") {
227:  const value = asString(filePath);
239:function shortPath(filePath = "", maxSegments = 4) {
240:  const value = asString(filePath).trim();
247:function assetContextHint(asset) {
248:  const filePath = asString(asset?.file_path || "").trim();
249:  if (!filePath) return "Library";
251:  const parts = filePath.split("/").filter(Boolean);
255:  return tail || shortPath(filePath);
293:function buildPreviewUrl(projectName, asset) {
295:  const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
296:  const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
297:  const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
298:  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
299:  if (!fileName || !assetType) return "";
301:  const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
308:  if (assetId) {
309:    params.push(`assetId=${encodeURIComponent(assetId)}`);
315:function requiresProtectedMediaFetch(fileUrl = "") {
316:  const value = asString(fileUrl).trim();
319:  if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
320:  return value.includes("/media/file/");
323:function getAssetPreviewUrl(asset) {
324:  if (!asset) return "";
326:    asset.preview_url
327:    || asset.image_url
328:    || asset.video_url
329:    || asset.audio_url
334:function buildProtectedCacheKey(projectName, asset) {
335:  const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
336:  const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
339:    resolvedAssetId || "no-asset-id",
340:    resolvedFilePath || "no-file-path",
341:    getAssetPreviewUrl(asset)
386:async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
387:  const previewUrl = getAssetPreviewUrl(asset);
388:  const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");
390:  if (!requiresProtectedMediaFetch(previewUrl)) {
392:      objectUrl: previewUrl,
394:      fileName,
399:  const cacheKey = buildProtectedCacheKey(projectName, asset);
405:      fileName,
420:    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
431:      fileName,
447:async function openLibraryAsset(projectName, asset) {
448:  if (!asset) {
449:    throw new Error("Select an asset before opening.");
452:  const resolved = await getProtectedAssetObjectUrl(projectName, asset);
455:  const safeFilename = asString(resolved.fileName || "download");
488:          const button = event.target.closest?.("[data-copy-asset-path]");
493:          const value = button.getAttribute("data-copy-asset-path") || "";
500:            window.prompt("Copy asset path:", value);
507:          const fileUrl = link.getAttribute("href") || "";
508:          if (!fileUrl.includes("/media/file/")) return;
512:          const assetName = link.getAttribute("data-asset-name") || decodeURIComponent(fileUrl.split("/").pop() || "download");
514:            preview_url: fileUrl,
515:            filename: assetName,
516:            name: assetName
520:              : `Could not open file: ${error.message || "Unknown error."}`;
554:      selectedCategoryKey: "all",
555:      selectedAssetId: "",
557:      selectedType: "all",
558:      selectedStatus: "active",
559:      selectedSource: "all",
561:      folderKey: "all_assets",
599:function getUploadAssetType(session, catalog, selectedValue) {
600:  const normalized = getSafeAssetType(selectedValue || session.uploadType);
601:  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
615:    const key = asString(item.asset_type).trim().toLowerCase();
657:function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
658:  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));
660:  const registryItems = asArray(
661:    legacyRegistry?.assets ||
666:  const assetItems = asArray(assetsData?.assets).length
667:    ? asArray(assetsData.assets)
668:    : registryItems;
670:  const registryByPath = new Map();
671:  const registryByName = new Map();
672:  const registryById = new Map();
674:  registryItems.forEach((item) => {
675:    const localPath = asString(item.local_path || item.file_path || item.path).trim();
676:    const fileName = basename(localPath || item.file_name || item.filename || item.name || "");
677:    const assetId = asString(item.asset_id || item.assetId || item.id).trim();
679:    if (localPath) registryByPath.set(localPath, item);
680:    if (fileName) registryByName.set(fileName, item);
681:    if (assetId) registryById.set(assetId, item);
684:  return assetItems.map((asset, index) => {
685:    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
687:    const filePath = asString(asset.file_path || asset.local_path || asset.path || asset.url || "").trim();
688:    const fileName = basename(filePath || asset.file_name || asset.filename || asset.name || `asset-${index + 1}`);
689:    const extension = getFileExtension(fileName);
692:    const rawId = asString(asset.asset_id || asset.assetId || asset.id).trim();
693:    const registryMatch = registryById.get(rawId) || registryByPath.get(filePath) || registryByName.get(fileName) || {};
695:      ...asset,
696:      ...registryMatch
709:      merged.asset_id ||
710:      merged.assetId ||
712:      `${canonicalType || "asset"}-${index}-${fileName}`
715:      merged.asset_id ||
716:      merged.assetId ||
718:      (filePath ? `path:${filePath}` : fileName ? `name:${fileName}` : id)
721:    const previewUrl = merged.preview_url ||
726:        asset_type: canonicalType,
727:        file_path: filePath,
728:        filename: fileName
734:      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth)
741:      asset_id: id,
743:      kind: "library_asset",
744:      name: asString(merged.name || merged.title || fileName || id),
745:      asset_type: canonicalType || "asset",
746:      type_label: catalogItem.display_label || catalogItem.label || titleCase(canonicalType || "asset"),
748:      source_label: asString(merged.source_label || merged.source || merged.scan_source || "Library"),
749:      source_key: asString(merged.source_key || merged.source || merged.scan_source || "library").toLowerCase(),
750:      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth),
754:      file_path: filePath,
755:      filename: fileName,
757:      preview_url: previewUrl,
766:function inferManagedAssetType(asset = {}) {
767:  const mediaType = toKey(asset.media_type);
771:  if (asset.video_brief) return "video_brief";
772:  if (asset.voice_script) return "voice_script";
773:  if (asset.prompt && !asset.image_url && !asset.video_url && !asset.audio_url) return "prompt_asset";
774:  if (["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status))) return "publishing_ready_asset";
778:function normalizeManagedMediaAsset(rawAsset = {}, index = 0, sourceKind = "local") {
779:  const asset = asObject(rawAsset);
780:  const payload = asObject(asset.output_payload);
781:  const id = asString(asset.handoff_id || asset.id || `media-managed-${index}`);
782:  const imageUrl = asString(asset.image_url || asset.url || payload.image_url || payload.url || asObject(asArray(payload.images)[0]).url);
783:  const videoUrl = asString(asset.video_url || payload.video_url || asObject(asArray(payload.videos)[0]).url);
784:  const audioUrl = asString(asset.audio_url || payload.audio_url || asObject(payload.audio).url);
785:  const promptText = asString(asset.prompt || payload.prompt);
786:  const briefText = asString(payload.video_brief || payload.voice_script || payload.message || asset.notes);
788:    ...asset,
798:    asset_id: id,
800:    source_signature: asString(asset.source_signature),
801:    name: asString(asset.title || `${asString(asset.media_type || "media")} ${asString(asset.version_id || "version")}`),
802:    file_path: asString(asset.handoff_id || asset.media_job_id || ""),
803:    asset_type: managedType,
806:    status: normalizeReadinessStatus(asset.status || asset.readiness_status || "needs_review"),
808:    source_of_truth: false,
809:    used_in: asArray(asset.usage).length ? asArray(asset.usage) : ["Library", "Media Studio"],
810:    uploaded_at: asset.updated_at || asset.created_at || null,
811:    preview_url: firstValidUrl(imageUrl, videoUrl, audioUrl),
819:    text_preview: promptText || briefText,
820:    json_preview: payload,
822:    media_type: asString(asset.media_type || payload.mode || "media"),
823:    version_id: asString(asset.version_id || ""),
824:    project: asString(asset.project || ""),
825:    campaign: asString(asset.campaign || ""),
826:    approval_status: asString(asset.approval_status || "draft"),
827:    notes: asString(asset.notes || ""),
828:    source_kind: sourceKind,
829:    source_label: sourceKind === "backend" ? "Media Studio (backend handoff)" : "Media Studio (local handoff)"
848:    .filter((item) => asString(item?.destination_page) === "library" && asString(item?.source_page) === "media-studio")
851:      const libraryAsset = asObject(payload.library_asset);
866:  [...backendHandoffs, ...local].forEach((asset) => {
867:    const key = asString(asset.source_signature || asset.asset_id || asset.id);
870:      mergedBySignature.set(key, asset);
874:    const candidateTs = new Date(asset.uploaded_at || 0).getTime() || 0;
875:    if (candidateTs >= existingTs) mergedBySignature.set(key, asset);
881:function buildAssetOverview({ assets, requiredGroups }) {
885:  const recentlyUploadedByDate = assets.filter((asset) => {
886:    if (!asset.uploaded_at) return false;
887:    const ts = new Date(asset.uploaded_at).getTime();
891:  const approvedAssets = assets.filter((asset) => asset.status === "approved").length;
892:  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
894:  const sourceOfTruthAssets = assets.filter((asset) => asset.source_of_truth).length;
895:  const sourceCoverage = assets.length ? Math.round((sourceOfTruthAssets / assets.length) * 100) : 0;
899:    totalAssets: assets.length,
903:    sourceOfTruthAssets,
904:    sourceCoverage,
908:      : "Required assets are covered. Continue with classification and approvals."
971:  const selectedFolderKey = session.folderKey || "all_assets";
972:  const selectedCategoryKey = session.selectedCategoryKey || "all";
973:  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
974:  const selectedType = session.selectedType || "all";
975:  const selectedStatus = session.selectedStatus || "active";
976:  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
978:    : selectedStatus;
979:  const selectedSource = session.selectedSource || "all";
981:  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
987:      .map((entry) => asString(entry.filename).trim())
991:  const folderMatches = (asset) => {
992:    const statusValue = normalizeReadinessStatus(asset.status);
993:    const assetType = asString(asset.asset_type).trim().toLowerCase();
994:    if (selectedFolderKey === "all_assets") return true;
995:    if (selectedFolderKey === "source_of_truth") return Boolean(asset.source_of_truth);
996:    if (selectedFolderKey === "archived") return statusValue === "archived";
997:    if (selectedFolderKey === "uploaded_session") {
998:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
999:      return Boolean(filename && recentUploadedNames.has(filename));
1002:    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
1004:      return folder.types.includes(assetType);
1010:  const filtered = allAssets.filter((asset) => {
1011:    const isDeleted = Boolean(asset.deleted || asset.is_deleted);
1014:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
1015:    const matchesFolder = folderMatches(asset);
1016:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1017:    const statusValue = normalizeReadinessStatus(asset.status);
1023:    const matchesSource = selectedSource === "all"
1024:      || (selectedSource === "media-studio" && asset.kind === "managed_media")
1025:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
1026:      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
1027:    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
1050:    const count = allAssets.filter((asset) => {
1051:      const statusValue = normalizeReadinessStatus(asset.status);
1052:      const assetType = asString(asset.asset_type).trim().toLowerCase();
1053:      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
1054:      const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);
1056:      if (folder.key === "all_assets") return !Boolean(asset.deleted || asset.is_deleted);
1057:      if (folder.key === "source_of_truth") return Boolean(asset.source_of_truth);
1060:      return Array.isArray(folder.types) ? folder.types.includes(assetType) : false;
1070:function getPreviewExtensionForAsset(asset = {}) {
1072:    asset.extension ||
1073:    asset.filename ||
1074:    asset.file_name ||
1075:    asset.file_path ||
1076:    asset.preview_url ||
1077:    asset.name ||
1096:function canAttemptDocumentPreview(asset = {}) {
1098:    getAssetPreviewUrl(asset) ||
1099:    asset.file_path ||
1100:    asset.local_path ||
1101:    asset.path ||
1102:    asset.preview_url ||
1103:    asset.public_url ||
1104:    asset.url
1108:function renderPreview(asset, escapeHtml) {
1109:  if (!asset) {
1110:    return `<div class="empty-box">Select an asset to preview details, open files, copy paths, or prepare review actions.</div>`;
1113:  const previewUrl = getAssetPreviewUrl(asset);
1114:  const protectedPreview = requiresProtectedMediaFetch(previewUrl);
1116:  if (asset.is_image && asString(asset.image_url || previewUrl).trim()) {
1119:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
1120:          <div class="library-preview-fallback">Loading protected image preview...</div>
1126:      <div class="library-preview-frame">
1127:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1132:  if (asset.is_video && asString(asset.video_url || previewUrl).trim()) {
1135:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
1136:          <div class="library-preview-fallback">Loading protected video preview...</div>
1142:      <div class="library-preview-frame">
1143:        <video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url || previewUrl))}"></video>
1148:  if (asset.is_audio && asString(asset.audio_url || previewUrl).trim()) {
1150:      <div class="library-preview-frame">
1151:        <audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
1156:  if (asset.is_image && previewUrl) {
1159:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
1160:          <div class="library-preview-fallback">Loading protected image preview...</div>
1166:      <div class="library-preview-frame">
1167:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1172:  if (asset.is_video && previewUrl) {
1175:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
1176:          <div class="library-preview-fallback">Loading protected video preview...</div>
1182:      <div class="library-preview-frame">
1183:        <video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>
1188:  const previewExtension = getPreviewExtensionForAsset(asset);
1190:  if (isDocumentExtension(previewExtension)) {
1191:    const previewUrl = getAssetPreviewUrl(asset);
1192:    const label = toDocumentPreviewLabel(previewExtension);
1193:    const isPdf = previewExtension === "pdf";
1194:    const openButton = previewUrl
1195:      ? `<button class="btn btn-primary" type="button" data-library-open="${escapeHtml(asset.id)}">Open document</button>`
1198:    if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {
1200:        <div class="library-pdf-preview">
1201:          <iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
1206:    if (isPdf && canAttemptDocumentPreview(asset)) {
1208:        <div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
1209:          <div class="library-preview-extension">PDF</div>
1211:          <div class="library-preview-copy">Loading protected PDF preview...</div>
1217:      <div class="library-preview-fallback library-document-preview">
1218:        <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
1220:        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
1221:        <div class="library-document-preview-actions">
1230:  if (asset.text_preview) {
1231:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
1234:  const jsonFallback = JSON.stringify(asset.json_preview || asset.media_payload || {}, null, 2);
1236:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
1240:    <div class="library-preview-fallback">
1241:      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
1242:      <div class="library-preview-copy">Preview not available for this file type.</div>
1248:  previewNode,
1250:  asset,
1254:  if (!previewNode || !asset) {
1258:  const expectedId = asString(asset.id || asset.asset_id || "");
1261:    const resolved = await getProtectedAssetObjectUrl(projectName, asset, {
1264:    if (!previewNode.isConnected) {
1268:    const currentId = previewNode.getAttribute("data-preview-asset-id") || "";
1273:    if (asset.is_image) {
1274:      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
1278:    if (asset.is_video) {
1279:      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
1283:    if (getPreviewExtensionForAsset(asset) === "pdf") {
1284:      previewNode.outerHTML = `
1285:        <div class="library-pdf-preview">
1286:          <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
1291:    if (!previewNode.isConnected) {
1297:      : `Preview unavailable: ${error.message || "Could not load this file."}`;
1299:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
1310:  asset,
1316:  if (!node || !asset) return;
1319:    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
1326:    image.alt = alt || asset.name || "Asset preview";
1343:    showError?.(`Could not load asset preview: ${error.message || "Unknown error."}`);
1351:function getWorkspaceAssetItems(assetsData, registry) {
1353:    assetsData.assets,
1354:    assetsData.items,
1355:    assetsData.records,
1356:    registry.assets,
1357:    registry.items,
1358:    registry.records
1371:    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
1375:    return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;
1377:  const docs = asArray(payload.docs).join(", ") || "no document files selected";
1491:  assetsData,
1493:  registry,
1511:      assetsData,
1513:      registry,
1533:  const catalog = getAssetCatalog(assetsData);
1536:  const workspaceAssetItems = getWorkspaceAssetItems(assetsData, registry);
1538:    ...assetsData,
1539:    assets: workspaceAssetItems
1543:    ...normalizeAssets(projectName, workspaceAssetsData, registry, categoryByType, catalog)
1554:  const selectedAssetExists = filteredAssets.some((asset) => asset.id === session.selectedAssetId);
1555:  if (!selectedAssetExists) {
1556:    session.selectedAssetId = filteredAssets[0]?.id || allAssets[0]?.id || "";
1559:  const selectedAsset = filteredAssets.find((asset) => asset.id === session.selectedAssetId)
1560:    || allAssets.find((asset) => asset.id === session.selectedAssetId)
1563:    assets: allAssets,
1578:    .filter((asset) => asset.uploaded_at)
1582:  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
1587:      .filter((item) => !managedTypeOptions.includes(item.asset_type))
1588:      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
1591:  const sourceOptions = [
1592:    { value: "all", label: "All sources" },
1604:      <section class="library-explainer" aria-label="Library source-of-truth workspace explainer">
1605:        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
1607:          <li>Upload or select an asset.</li>
1608:          <li>Mark important files as <span class="explainer-chip">Source of Truth</span> when needed.</li>
1609:          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
1627:        <span class="taxonomy-chip source-of-truth" tabindex="0">Source of Truth</span>
1667:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1669:    typeSelect.value = session.selectedType || "all";
1678:          session.selectedType = value;
1686:        assetsData,
1688:        registry,
1702:    statusSelect.value = session.selectedStatus;
1709:          session.selectedStatus = value;
1717:        assetsData,
1719:        registry,
1731:  const sourceSelect = $("libraryFilterSourceSelect");
1732:  if (sourceSelect) {
1733:    sourceSelect.innerHTML = sourceOptions.map((option) => `
1734:      <option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1736:    sourceSelect.value = session.selectedSource || "all";
1737:    sourceSelect.removeAttribute("disabled");
1738:    sourceSelect.removeAttribute("readonly");
1739:    sourceSelect.onchange = (event) => {
1741:        filter: "source",
1745:          session.selectedSource = value;
1753:        assetsData,
1755:        registry,
1784:        assetsData,
1786:        registry,
1801:      ? paginatedAssets.map((asset) => {
1802:        const tone = toStatusTone(asset.status);
1803:        const statusLabel = toStatusLabel(asset.status);
1804:        const fileName = truncateMiddle(asset.filename || basename(asset.file_path || "") || "-");
1805:        const titleName = truncateMiddle(asset.name, 52);
1806:        const assetPreviewUrl = getAssetPreviewUrl(asset);
1807:        const previewNode = asset.is_image && assetPreviewUrl
1808:          ? requiresProtectedMediaFetch(assetPreviewUrl)
1809:            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
1811:          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;
1812:        // Add selected state and aria-selected
1813:        const isSelected = session.selectedAssetId === asset.id;
1815:          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
1816:            <div class="library-grid-preview">${previewNode}</div>
1817:            <div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>
1818:            <div class="library-grid-meta" title="${escapeHtml(asset.filename || "-")}">${escapeHtml(fileName)}</div>
1821:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
1826:      : `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;
1849:      if (leftId === session.selectedAssetId) return -1;
1850:      if (rightId === session.selectedAssetId) return 1;
1856:    const assetId = node.getAttribute("data-library-protected-thumb") || "";
1857:    const asset = allAssets.find((item) => item.id === assetId);
1858:    if (!asset) return;
1863:      asset,
1865:      alt: asset.name,
1866:      fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`,
1871:  const previewVisual = $("libraryPreviewVisual");
1872:  if (previewVisual) {
1873:    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
1875:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
1876:    if (protectedPreviewNode && selectedAsset) {

## Library upload / intake markers
1:import { renderGuideBox } from "../components/guide-box.js";
2:import { getSourceTypeMapping } from "../shared-context.js";
3:import {
30:import { renderLibraryActionPanel } from "./library/action-panel.js";
31:import { renderLibraryAiPanel } from "./library/ai-panel.js";
32:import { normalizeLibraryAsset } from "./library/projection-adapter.js";
33:import { normalizeLibrarySession } from "./library/session-store.js";
34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
35:import { mountLibraryListeners } from "./library/listener-lifecycle.js";
36:import {
45:  uploadProjectAsset
47:import {
105:    uploadType: "logo"
112:    uploadType: "brand_guideline"
119:    uploadType: "product_csv"
126:    uploadType: "product_photos"
133:    uploadType: "product_videos"
140:    uploadType: "legal_doc"
147:    uploadType: "partner_docs"
161:  { key: "uploaded_session", label: "Uploaded This Session" },
181:    "button, a, input, select, textarea, label, option, [role='button'], .library-action-menu, .library-action-dropdown, .library-drop-zone"
564:      uploadType: "logo",
565:      uploading: false,
584:  Array.from(document.querySelectorAll(".library-action-dropdown.is-open")).forEach((item) => {
600:  const normalized = getSafeAssetType(selectedValue || session.uploadType);
603:    throw new Error("Choose a valid upload category.");
623:  if (!normalized) return "uploaded";
629:  if (normalized === "uploaded") return "uploaded";
633:  return "uploaded";
705:      "uploaded"
752:      uploaded_at: merged.uploaded_at || merged.updated_at || merged.created_at || merged.registered_at || "",
810:    uploaded_at: asset.updated_at || asset.created_at || null,
873:    const existingTs = new Date(existing.uploaded_at || 0).getTime() || 0;
874:    const candidateTs = new Date(asset.uploaded_at || 0).getTime() || 0;
886:    if (!asset.uploaded_at) return false;
887:    const ts = new Date(asset.uploaded_at).getTime();
892:  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
925:    } else if (statuses.some((value) => value === "missing" || value === "needs_review" || value === "uploaded")) {
952:    } else if (entries.length && statuses.some((value) => value === "needs_review" || value === "uploaded" || value === "rejected" || value === "archived")) {
965:      action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"
997:    if (selectedFolderKey === "uploaded_session") {
1040:    if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);
1042:    return toTimestamp(right.uploaded_at) - toTimestamp(left.uploaded_at);
1059:      if (folder.key === "uploaded_session") return inRecent;
1375:    return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;
1578:    .filter((asset) => asset.uploaded_at)
1579:    .sort((left, right) => new Date(right.uploaded_at || 0).getTime() - new Date(left.uploaded_at || 0).getTime())
1608:          <li>Mark important files as <span class="explainer-chip">Source of Truth</span> when needed.</li>
1638:      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
1656:              data-library-upload-type="${escapeHtml(item.uploadType)}"
1826:      : `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;
1918:            <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
1987:              <span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>
1992:      : `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;
1995:  const uploadSummary = $("libraryUploadSummary");
1996:  if (uploadSummary) {
1997:    uploadSummary.innerHTML = session.recentUploads.length
2008:      : `<div class="empty-box">No uploads in this session yet. Choose files and upload them to start building the asset library.</div>`;
2015:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2018:      // Always set upload type
2019:      session.uploadType = uploadType;
2020:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2021:      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;
2026:        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
2034:        session.selectedType = uploadType;
2045:        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
2063:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
2066:      if (action === "upload") {
2067:        const uploadInput = $("libraryUploadInput");
2068:        uploadInput?.click();
2496:      const dropdown = menu?.querySelector(".library-action-dropdown");
2497:      if (!dropdown) return;
2499:      const open = dropdown.classList.contains("is-open");
2503:        dropdown.classList.add("is-open");
2504:        dropdown.style.display = "block";
2509:  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
2512:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2513:      session.uploadType = uploadType;
2514:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2515:      if (uploadTypeSelect) {
2516:        uploadTypeSelect.value = uploadType;
2518:      showMessage?.(`Upload category set to ${uploadType}.`);
2569:  const uploadTypeSelect = $("libraryUploadTypeSelect");
2570:  if (uploadTypeSelect) {
2572:    uploadTypeSelect.innerHTML = catalog.map((item) => {
2575:      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
2577:    uploadTypeSelect.value = session.uploadType;
2578:    uploadTypeSelect.onchange = (event) => {
2579:      const uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
2581:      dispatchLibraryCommand("upload-type-change", { uploadType }, {
2582:        "upload-type-change": ({ uploadType: nextUploadType }) => ({
2584:          uploadType: nextUploadType
2588:      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
2592:  const dropZone = $("libraryDropZone");
2593:  const uploadInput = $("libraryUploadInput");
2594:  const uploadBtn = $("libraryUploadBtn");
2595:  if (dropZone && uploadInput) {
2597:      const files = Array.from(uploadInput.files || []);
2604:      if (uploadBtn) {
2605:        uploadBtn.disabled = session.uploading || files.length === 0;
2606:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
2614:        uploadInput.files = transfer.files;
2621:    dropZone.onclick = (event) => {
2626:    dropZone.onkeydown = (event) => {
2629:        uploadInput.click();
2632:    uploadInput.onchange = () => {
2635:      const files = Array.from(uploadInput.files || []);
2637:        showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
2641:    if (!dropZone.dataset.libraryDndBound) {
2642:      ["dragenter", "dragover"].forEach((eventName) => {
2643:        dropZone.addEventListener(eventName, (event) => {
2645:          dropZone.classList.add("is-drag-active");
2649:      ["dragleave", "drop"].forEach((eventName) => {
2650:        dropZone.addEventListener(eventName, (event) => {
2652:          dropZone.classList.remove("is-drag-active");
2656:      dropZone.addEventListener("drop", (event) => {
2662:      dropZone.dataset.libraryDndBound = "1";
2678:          showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
2698:  if (uploadBtn) {
2699:    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
2700:    uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
2701:    uploadBtn.onclick = async () => {
2705:        showError?.("Select a project before uploading.");
2709:      if (session.uploading) return;
2713:        showError?.("Select at least one file to upload.");
2721:        showError?.(error.message || "Invalid upload category.");
2725:      const uploaded = [];
2729:      session.uploading = true;
2749:            const result = await uploadProjectAsset(activeProjectName, assetType, file);
2750:            uploaded.push({
2767:        session.recentUploads = [...uploaded, ...failed, ...session.recentUploads].slice(0, 20);
2769:        if (uploaded.length && typeof reloadProjectData === "function") {
2776:        const dropInfo = $("libraryDropInfo");
2777:        if (dropInfo) dropInfo.textContent = "No files selected";
2778:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
2779:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
2781:        if (uploaded.length && !failed.length) {
2782:          showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}.`);
2783:        } else if (uploaded.length && failed.length) {
2784:          showError?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}, ${failed.length} failed.`);
2789:        session.uploading = false;
2790:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
2791:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
3034:          <div class="library-upload-grid">
3035:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
3042:            <div class="library-upload-controls">
3043:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
3046:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3053:          <div id="libraryUploadSummary" class="library-upload-summary"></div>
3099:                    <option value="uploaded">Uploaded</option>

## Library destructive action markers
6:  clearSharedLibrarySourceBridge,
38:  archiveProjectAsset,
39:  deleteProjectAsset,
163:  { key: "archived", label: "Archived" }
350:  libraryProtectedUrlCache.delete(key);
442:      libraryProtectedUrlPromiseCache.delete(cacheKey);
473:  anchor.remove();
585:    item.classList.remove("is-open");
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
1441:      overlay.remove();
1637:      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
1670:    typeSelect.removeAttribute("disabled");
1671:    typeSelect.removeAttribute("readonly");
1737:    sourceSelect.removeAttribute("disabled");
1738:    sourceSelect.removeAttribute("readonly");
1826:      : `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;
1954:        clearSharedLibrarySourceBridge(sourceProjectName);
1955:        clearSharedLibrarySourceBridge("__default__");
2042:            setTimeout(() => assetWorkspace.classList.remove("is-required-action-target"), 2000);
2241:          if (value === "archived") {
2242:            session.selectedStatus = "archived";
2329:        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
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
2560:        window.clearTimeout(librarySearchRenderTimer);
2652:          dropZone.classList.remove("is-drag-active");
2680:        picker.remove();
2939:            clearSharedLibrarySourceBridge(guideProjectName);
2940:            clearSharedLibrarySourceBridge("__default__");
2947:            clearSharedLibrarySourceBridge(guideProjectName);
2948:            clearSharedLibrarySourceBridge("__default__");
2949:            guideBox.remove();
2961:          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
3092:                    <option value="active">Active (non-archived)</option>
3101:                    <option value="archived">Archived</option>

## Library handoff / route markers
34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
104:    why: "Logos keep brand identity consistent across setup, media generation, and publishing.",
118:    why: "Product data anchors facts, variants, and claims for campaign and publishing.",
372:function enqueueLibraryThumbLoad(job) {
580:  return routeLibraryCommand(envelope, handlers);
625:  if (normalized.includes("publishing_ready")) return "publishing_ready";
626:  if (normalized.includes("sent_to_publishing")) return "sent_to_publishing";
639:  if (value === "publishing_ready") return "Publishing Ready";
640:  if (value === "sent_to_publishing") return "Sent to Publishing";
651:  if (value === "publishing_ready" || value === "sent_to_publishing") return "success";
774:  if (["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status))) return "publishing_ready_asset";
781:  const id = asString(asset.handoff_id || asset.id || `media-managed-${index}`);
802:    file_path: asString(asset.handoff_id || asset.media_job_id || ""),
829:    source_label: sourceKind === "backend" ? "Media Studio (backend handoff)" : "Media Studio (local handoff)"
847:  const backendHandoffs = asArray(operations?.handoffs?.items)
848:    .filter((item) => asString(item?.destination_page) === "library" && asString(item?.source_page) === "media-studio")
855:          handoff_id: item.id,
1024:      || (selectedSource === "media-studio" && asset.kind === "managed_media")
1026:      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
1319:    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
1496:  navigateTo,
1516:      navigateTo,
1593:    { value: "media-studio", label: "Media Studio" },
1595:    { value: "publishing-ready", label: "Publishing Ready" }
1691:        navigateTo,
1722:        navigateTo,
1758:        navigateTo,
1789:        navigateTo,
1957:        navigateTo("ai-command");
2055:          navigateTo,
2083:          navigateTo,
2094:      navigateTo("ai-command");
2123:        navigateTo,
2158:        navigateTo,
2187:        navigateTo,
2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
2739:        navigateTo,
2824:      navigateTo("ai-command");
2834:      navigateTo("ai-command");
2849:      navigateTo("ai-command");
2863:      navigateTo("ai-command");
2879:      navigateTo("ai-command");
2901:    navigateTo,
2923:            { id: "back-to-ai-command", label: "Back to Drawer" },
2934:        const backBtn = guideBox.querySelector('[data-guide-action="back-to-ai-command"]');
2941:            navigateTo("ai-command");
3097:                    <option value="publishing_ready">Publishing ready</option>
3098:                    <option value="sent_to_publishing">Sent to publishing</option>
3154:      navigateTo,

## Library backend/API markers
34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
40:  fetchProtectedMediaBlob,
44:  updateProjectAssetStatus,
46:} from "../api.js";
420:    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
421:    const objectUrl = URL.createObjectURL(blob);
425:      createdAt: Date.now()
468:  const anchor = document.createElement("a");
519:              ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
560:      sortBy: "updated_desc",
579:  const envelope = createLibraryCommand(command, payload);
752:      uploaded_at: merged.uploaded_at || merged.updated_at || merged.created_at || merged.registered_at || "",
810:    uploaded_at: asset.updated_at || asset.created_at || null,
856:          created_at: item.created_at,
857:          updated_at: item.updated_at,
980:  const sortBy = session.sortBy || "updated_desc";
1040:    if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);
1127:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1167:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
1296:      ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
1324:    const image = document.createElement("img");
1393:    const overlay = document.createElement("div");
1401:    const modal = document.createElement("div");
1409:    const heading = document.createElement("div");
1414:    const input = document.createElement("input");
1424:    const actions = document.createElement("div");
1430:    const cancelBtn = document.createElement("button");
1435:    const submitBtn = document.createElement("button");
1773:        value: event.target.value || "updated_desc"
1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
1992:      : `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;
2301:          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
2332:          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
2333:          : (error.message || "Failed to update source of truth.");
2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
2365:        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
2368:        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
2371:          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
2372:          : (error.message || "Failed to update asset status.");
2596:    const updateUploadUiState = () => {
2618:      updateUploadUiState();
2633:      updateUploadUiState();
2666:      const picker = document.createElement("input");
2695:    updateUploadUiState();
2754:              created_at: new Date().toISOString()
2762:              created_at: new Date().toISOString()
3111:                    <option value="updated_desc">Newest first</option>
3112:                    <option value="updated_asc">Oldest first</option>

## Library CSS markers
public/control-center/styles/08-components-foundation.css:730:.library-preview-fallback,
public/control-center/styles/08-components-foundation.css:1620:.library-source-guide-inline {
public/control-center/styles/08-components-foundation.css:1624:.library-source-guide-inline .mhos-guide-box {
public/control-center/styles/08-components-foundation.css:1632:.library-source-guide-inline .mhos-guide-box-head {
public/control-center/styles/08-components-foundation.css:1637:.library-source-guide-inline .mhos-guide-box-body {
public/control-center/styles/12-pages.css:1050:.library-grid-card.is-active {
public/control-center/styles/12-pages.css:1056:.library-grid-card[aria-selected="true"] {
public/control-center/styles/12-pages.css:1133:.library-preview-actions,
public/control-center/styles/12-pages.css:1181:.library-workspace-grid,
public/control-center/styles/12-pages.css:1199:.library-filter-field {
public/control-center/styles/12-pages.css:1206:.library-filter-bar .setup-input,
public/control-center/styles/12-pages.css:1207:.library-filter-bar select {
public/control-center/styles/12-pages.css:1218:.library-preview-copy,
public/control-center/styles/12-pages.css:1257:.library-workspace-side,
public/control-center/styles/12-pages.css:1264:.library-filter-bar,
public/control-center/styles/12-pages.css:1266:.library-preview-copy,
public/control-center/styles/12-pages.css:1312:.library-drop-zone {
public/control-center/styles/12-pages.css:1322:.library-grid-card,
public/control-center/styles/12-pages.css:1324:.library-preview-card,
public/control-center/styles/12-pages.css:1346:.library-filter-bar {
public/control-center/styles/12-pages.css:1359:.library-preview-frame {
public/control-center/styles/12-pages.css:1369:.library-preview-image,
public/control-center/styles/12-pages.css:1370:.library-preview-video {
public/control-center/styles/12-pages.css:1416:  .library-workspace-grid,
public/control-center/styles/12-pages.css:1421:  .library-filter-bar {
public/control-center/styles/12-pages.css:1445:  .library-filter-bar {
public/control-center/styles/12-pages.css:7569:.library-preview-audio {
public/control-center/styles/12-pages.css:7574:.library-preview-text-fallback {
public/control-center/styles/14-page-standard.css:1298:[data-page="library"] .library-drop-zone,
public/control-center/styles/14-page-standard.css:1315:[data-page="library"] .library-drop-zone:hover,
public/control-center/styles/14-page-standard.css:1316:[data-page="library"] .library-drop-zone.is-drag-active,
public/control-center/styles/14-page-standard.css:1358:[data-page="library"] .library-workspace-grid {
public/control-center/styles/14-page-standard.css:1365:[data-page="library"] .library-workspace-grid.library-finder-workspace {
public/control-center/styles/14-page-standard.css:1369:[data-page="library"] .library-workspace-main {
public/control-center/styles/14-page-standard.css:1378:[data-page="library"] .library-workspace-side {
public/control-center/styles/14-page-standard.css:1480:[data-page="library"] .library-filter-bar {
public/control-center/styles/14-page-standard.css:1498:[data-page="library"] .library-filter-field {
public/control-center/styles/14-page-standard.css:1502:[data-page="library"] .library-filter-field .setup-label {
public/control-center/styles/14-page-standard.css:1518:[data-page="library"] .library-grid-card,
public/control-center/styles/14-page-standard.css:1534:[data-page="library"] .library-grid-card:hover {
public/control-center/styles/14-page-standard.css:1540:[data-page="library"] .library-grid-card.is-active {
public/control-center/styles/14-page-standard.css:1548:[data-page="library"] .library-grid-card.is-active .library-grid-title {
public/control-center/styles/14-page-standard.css:1595:[data-page="library"] .library-preview-card {
public/control-center/styles/14-page-standard.css:1612:[data-page="library"] .library-preview-image,
public/control-center/styles/14-page-standard.css:1613:[data-page="library"] .library-preview-video {
public/control-center/styles/14-page-standard.css:1624:[data-page="library"] .library-preview-meta {
public/control-center/styles/14-page-standard.css:1841:[data-page="library"] .library-filter-bar,
public/control-center/styles/14-page-standard.css:1842:[data-page="library"] .library-filter-field,
public/control-center/styles/14-page-standard.css:1843:[data-page="library"] .library-filter-field *,
public/control-center/styles/14-page-standard.css:1846:[data-page="library"] .library-drop-zone,
public/control-center/styles/14-page-standard.css:1847:[data-page="library"] .library-drop-zone *,
public/control-center/styles/14-page-standard.css:1858:  [data-page="library"] .library-filter-bar {
public/control-center/styles/14-page-standard.css:1869:  [data-page="library"] .library-workspace-grid,
public/control-center/styles/14-page-standard.css:1870:  [data-page="library"] .library-workspace-grid.library-finder-workspace {
public/control-center/styles/14-page-standard.css:1874:  [data-page="library"] .library-workspace-side {
public/control-center/styles/14-page-standard.css:1887:  [data-page="library"] .library-filter-bar {
