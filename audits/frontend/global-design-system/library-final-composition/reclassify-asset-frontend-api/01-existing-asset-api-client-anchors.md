# 01 — Existing Asset API Client Anchors

Generated: Sat Jun  6 14:13:23 CEST 2026

## API functions
1426:export async function updateProjectAssetStatus(projectName, assetId, status, note = "") {
1446:export async function renameProjectAsset(projectName, assetId, name) {
1468:export async function setProjectAssetSourceOfTruth(projectName, assetId, sourceOfTruth) {
1485:export async function archiveProjectAsset(projectName, assetId, note = "") {
1502:export async function deleteProjectAsset(projectName, assetId, note = "") {
2293:export async function uploadProjectAsset(projectName, assetType, file) {

## Existing API excerpt
  );
}

export async function refreshProjectLibrary(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/library/refresh`,
    "POST",
    {},
    "Failed to refresh project library"
  );
}

export async function updateProjectAssetStatus(projectName, assetId, status, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
    "POST",
    {
      status: String(status || "").trim().toLowerCase(),
      note: String(note || "").trim()
    },
    "Failed to update asset status"
  );
}

export async function renameProjectAsset(projectName, assetId, name) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    throw new Error("Missing asset name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/rename`,
    "POST",
    { name: normalizedName },
    "Failed to rename asset"
  );
}

export async function setProjectAssetSourceOfTruth(projectName, assetId, sourceOfTruth) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/source-of-truth`,
    "POST",
    { source_of_truth: Boolean(sourceOfTruth) },
    "Failed to update source of truth"
  );
}

export async function archiveProjectAsset(projectName, assetId, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/archive`,
    "POST",
    { note: String(note || "").trim() },
    "Failed to archive asset"
  );
}

export async function deleteProjectAsset(projectName, assetId, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/delete`,
    "POST",
    { note: String(note || "").trim() },
    "Failed to delete asset"
  );
}

export async function runProjectWorkflow(projectName, workflowId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!workflowId) {
    throw new Error("Missing workflow id");
