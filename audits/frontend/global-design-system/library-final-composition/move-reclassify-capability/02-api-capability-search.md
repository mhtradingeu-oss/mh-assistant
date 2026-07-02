# 02 — API Capability Search

Generated: Sat Jun  6 11:05:56 CEST 2026

## public/control-center/api.js
888:    assets: payload?.assets || null,
930:      total_assets: 0,
931:      assets: []
1101:  const requiredSections = ["overview", "readiness", "assets"];
1198:    assets: requiredData.assets,
1328:export async function fetchAssetCatalog() {
1330:    "/media-manager/asset-catalog",
1331:    "Failed to load asset catalog"
1426:export async function updateProjectAssetStatus(projectName, assetId, status, note = "") {
1431:  if (!assetId) {
1432:    throw new Error("Missing asset id");
1436:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
1442:    "Failed to update asset status"
1446:export async function renameProjectAsset(projectName, assetId, name) {
1451:  if (!assetId) {
1452:    throw new Error("Missing asset id");
1457:    throw new Error("Missing asset name");
1461:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/rename`,
1464:    "Failed to rename asset"
1468:export async function setProjectAssetSourceOfTruth(projectName, assetId, sourceOfTruth) {
1473:  if (!assetId) {
1474:    throw new Error("Missing asset id");
1478:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/source-of-truth`,
1485:export async function archiveProjectAsset(projectName, assetId, note = "") {
1490:  if (!assetId) {
1491:    throw new Error("Missing asset id");
1495:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/archive`,
1498:    "Failed to archive asset"
1502:export async function deleteProjectAsset(projectName, assetId, note = "") {
1507:  if (!assetId) {
1508:    throw new Error("Missing asset id");
1512:    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/delete`,
1515:    "Failed to delete asset"
1729:export async function removeProjectConnectorSource(projectName, sourceType) {
1742:    "Failed to remove project connector"
2293:export async function uploadProjectAsset(projectName, assetType, file) {
2298:  const normalizedAssetType = String(assetType || "").trim().toLowerCase();
2300:  if (!normalizedAssetType) {
2301:    throw new Error("Missing asset type");
2304:  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(normalizedAssetType)) {
2305:    throw new Error("Invalid asset type");
2314:  formData.append("type", normalizedAssetType);
2320:    "Failed to upload asset"
