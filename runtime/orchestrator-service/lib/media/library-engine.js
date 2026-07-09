const fs = require('fs');
const path = require('path');

function defaultGetProjectAssetPaths(projectName) {
  const base = path.join(process.cwd(), 'data/projects', projectName);
  return {
    assetsRegistryPath: path.join(base, 'assets-registry.json')
  };
}

function defaultReadJsonFile(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

function defaultNormalizeAssetRecord(projectName, asset) {
  return {
    ...asset,
    project: asset.project || projectName
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeMediaKind(asset = {}) {
  const raw = String(asset.media_kind || asset.mediaKind || asset.kind || asset.type || asset.asset_type || '').toLowerCase();

  if (raw.includes('video')) return 'video';
  if (raw.includes('audio') || raw.includes('voice') || raw.includes('sound')) return 'audio';
  if (raw.includes('image') || raw.includes('photo') || raw.includes('logo') || raw.includes('packaging')) return 'image';

  return 'image';
}

function buildLibraryAsset(projectName, asset = {}) {
  const mediaKind = normalizeMediaKind(asset);
  const assetId = asset.asset_id || asset.id || asset.file_id || asset.fileName || asset.file_name || '';

  return {
    asset_id: assetId,
    id: assetId,
    project: asset.project || projectName,
    type: asset.asset_type || asset.type || 'asset',
    media_kind: mediaKind,
    badge: asset.badge || mediaKind,
    color: asset.color || 'blue',
    group: asset.group || asset.asset_type || asset.type || 'unknown',
    status: asset.status || asset.readiness_status || asset.review_status || 'unknown',
    preview_url: asset.preview_url || asset.previewUrl || asset.public_url || asset.url || '',
    file_name: asset.file_name || asset.fileName || asset.name || '',
    file_path: asset.file_path || asset.filePath || '',
    source_of_truth: Boolean(asset.source_of_truth || asset.use_as_source_of_truth),
    archived: Boolean(asset.archived),
    deleted: Boolean(asset.deleted || asset.is_deleted),
    actions: []
  };
}

function buildLibraryIndex(projectName, helpers = {}) {
  const getProjectAssetPaths = typeof helpers.getProjectAssetPaths === 'function'
    ? helpers.getProjectAssetPaths
    : defaultGetProjectAssetPaths;

  const readJsonFile = typeof helpers.readJsonFile === 'function'
    ? helpers.readJsonFile
    : defaultReadJsonFile;

  const normalizeAssetRecord = typeof helpers.normalizeAssetRecord === 'function'
    ? helpers.normalizeAssetRecord
    : defaultNormalizeAssetRecord;

  const paths = getProjectAssetPaths(projectName);
  const rawAssets = readJsonFile(paths.assetsRegistryPath, []);
  const normalizedAssets = asArray(rawAssets).map((asset) => normalizeAssetRecord(projectName, asset));
  const indexed = normalizedAssets.map((asset) => buildLibraryAsset(projectName, asset));

  const activeAssets = indexed.filter((asset) => !asset.deleted);
  const visibleAssets = activeAssets.filter((asset) => !asset.archived);

  const summary = {
    total: indexed.length,
    active: activeAssets.length,
    visible: visibleAssets.length,
    archived: indexed.filter((asset) => asset.archived).length,
    deleted: indexed.filter((asset) => asset.deleted).length,
    images: indexed.filter((asset) => asset.media_kind === 'image').length,
    videos: indexed.filter((asset) => asset.media_kind === 'video').length,
    audio: indexed.filter((asset) => asset.media_kind === 'audio').length,
    source_of_truth: indexed.filter((asset) => asset.source_of_truth).length
  };

  return {
    project: projectName,
    registry_path: paths.assetsRegistryPath,
    summary,
    assets: indexed
  };
}

module.exports = {
  buildLibraryIndex,
  buildLibraryAsset,
  normalizeMediaKind
};
