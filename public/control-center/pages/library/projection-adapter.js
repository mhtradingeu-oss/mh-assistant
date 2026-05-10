export function normalizeLibraryAsset(asset = {}) {
  return {
    id: asset.id || "",
    name: asset.name || asset.filename || "Untitled Asset",
    type: asset.type || asset.mime_type || "unknown",
    category: asset.category || "uncategorized",
    status: asset.status || "draft",
    sourceOfTruth: Boolean(asset.source_of_truth),
    archived: Boolean(asset.archived),
    projectId: asset.project_id || null,
    createdAt: asset.created_at || null,
    updatedAt: asset.updated_at || null,
    raw: asset
  };
}

export function normalizeLibraryAssets(assets = []) {
  if (!Array.isArray(assets)) return [];
  return assets.map(normalizeLibraryAsset);
}
