import { uploadProjectAsset } from "../api.js";

const librarySessionStore = new Map();
const SAFE_UPLOAD_ASSET_TYPES = [
  { value: "logo", label: "Logo" },
  { value: "product", label: "Product" },
  { value: "packaging", label: "Packaging" },
  { value: "reference", label: "Reference" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "document", label: "Document" }
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function basename(filePath = "") {
  const value = asString(filePath);
  if (!value) return "";
  const parts = value.split("/");
  return parts[parts.length - 1] || value;
}

function getFileExtension(name = "") {
  const value = basename(name);
  const index = value.lastIndexOf(".");
  return index >= 0 ? value.slice(index + 1).toLowerCase() : "";
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function formatBytes(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = parsed;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function isImageAsset(asset) {
  const extension = getFileExtension(asset.file_path || asset.filename || "");
  return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
}

function isVideoAsset(asset) {
  const extension = getFileExtension(asset.file_path || asset.filename || "");
  return ["mp4", "mov", "webm", "m4v"].includes(extension);
}

function getAssetFolder(asset) {
  const filePath = asString(asset.file_path);
  const folderHint = asString(asset.folder);

  if (folderHint) return folderHint;
  if (!filePath) return "unassigned";

  const parts = filePath.split("/").filter(Boolean);
  if (parts.length < 2) return "unassigned";
  return parts[parts.length - 2] || "unassigned";
}

function buildPreviewUrl(projectName, asset) {
  if (!projectName || asset.localOnly) return asset.preview_url || "";
  const fileName = basename(asset.file_path || asset.filename || "");
  const assetType = asString(asset.asset_type || "asset");
  if (!fileName || !assetType) return "";
  return `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
}

function getLocationTone(asset) {
  if (asset.localOnly) return "warning";
  if (asset.inExpectedFolder) return "success";
  if (asset.routed) return "warning";
  return "neutral";
}

function getSourceSignal(asset) {
  const filePath = asString(asset.file_path);
  if (asset.localOnly) return "Queued upload";
  if (filePath.includes("/data/projects/")) return "Project-owned";
  if (filePath.includes("/data/brand-assets/")) return "Legacy library";
  return "External path";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, {
      selectedFolder: "all",
      selectedAssetId: "",
      searchQuery: "",
      metadataDrafts: {},
      hiddenAssetIds: new Set(),
      uploadType: "product",
      customUploadType: "",
      recentUploads: [],
      lastUploadedFilenames: [],
      uploading: false
    });
  }
  return librarySessionStore.get(key);
}

function normalizeAssets({
  projectName,
  assets,
  routes,
  registryAssets,
  session
}) {
  const routedById = new Map();
  const routedByPath = new Map();
  asArray(routes?.routed_assets).forEach((item) => {
    if (item?.asset_id) routedById.set(item.asset_id, item);
    if (item?.file_path) routedByPath.set(item.file_path, item);
  });

  const registryById = new Map();
  const registryByPath = new Map();
  asArray(registryAssets).forEach((item) => {
    if (item?.asset_id) registryById.set(item.asset_id, item);
    if (item?.file_path) registryByPath.set(item.file_path, item);
  });

  const baseAssets = asArray(assets).map((asset, index) => {
    const routeMeta = routedById.get(asset?.asset_id) || routedByPath.get(asset?.file_path) || null;
    const registryMeta = registryById.get(asset?.asset_id) || registryByPath.get(asset?.file_path) || null;
    const draft = asObject(session.metadataDrafts[asset?.asset_id]);
    const previewUrl = buildPreviewUrl(projectName, asset);

    return {
      ...asset,
      ...draft,
      id: asset?.asset_id || `asset-${index}`,
      filename: basename(asset?.file_path || asset?.filename || ""),
      folder: getAssetFolder(asset),
      exists: asset?.exists !== false,
      routed: Boolean(routeMeta),
      inExpectedFolder: Boolean(routeMeta?.in_expected_folder),
      routeMeta,
      registryMeta,
      registryKnown: Boolean(registryMeta),
      preview_url: draft.preview_url || previewUrl,
      localOnly: false,
      source_signal: draft.source_signal || getSourceSignal(asset)
    };
  });

  return baseAssets.filter((asset) => !session.hiddenAssetIds.has(asset.id));
}

function buildFolderItems(tree, folderHealth, assets) {
  const itemsByName = new Map();

  asArray(tree?.tree).forEach((entry) => {
    const folderName = asString(entry?.folder) || "unassigned";
    itemsByName.set(folderName, {
      name: folderName,
      fileCount: asArray(entry?.files).length,
      exists: true,
      path: "",
      isEmpty: asArray(entry?.files).length === 0
    });
  });

  Object.entries(asObject(folderHealth?.folders)).forEach(([key, value]) => {
    const folderName = key.replace(/_/g, " ");
    itemsByName.set(key, {
      name: key,
      label: folderName,
      fileCount: Number(value?.total_entries || 0),
      exists: Boolean(value?.exists),
      path: asString(value?.path),
      isEmpty: Boolean(value?.is_empty)
    });
  });

  assets.forEach((asset) => {
    const folderName = getAssetFolder(asset);
    if (!itemsByName.has(folderName)) {
      itemsByName.set(folderName, {
        name: folderName,
        label: folderName,
        fileCount: 0,
        exists: true,
        path: "",
        isEmpty: false
      });
    }
    const current = itemsByName.get(folderName);
    current.assetCount = (current.assetCount || 0) + 1;
  });

  return Array.from(itemsByName.values())
    .map((item) => ({
      ...item,
      label: item.label || item.name,
      assetCount: Number(item.assetCount || item.fileCount || 0)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function renderEmpty(message, escapeHtml) {
  return `<div class="empty-box">${escapeHtml(message)}</div>`;
}

function renderAssetPreviewBody(asset, escapeHtml) {
  if (!asset) {
    return renderEmpty("Select an asset to inspect metadata, preview content, and prepare local edits.", escapeHtml);
  }

  if (isImageAsset(asset) && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(asset.preview_url)}" alt="${escapeHtml(asset.filename || asset.asset_type || "asset preview")}" class="library-preview-image">
      </div>
      <div class="setup-helper" style="margin-top: 12px;">If the preview does not load, use the open action below to inspect the asset directly.</div>
      <div style="margin-top: 10px;"><a class="btn btn-secondary library-link-btn" href="${escapeHtml(asset.preview_url)}" target="_blank" rel="noreferrer">Open Asset In New Tab</a></div>
    `;
  }

  if (isVideoAsset(asset) && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(asset.preview_url)}"></video>
      </div>
      <div class="setup-helper" style="margin-top: 12px;">If the preview does not load, use the open action below to inspect the asset directly.</div>
      <div style="margin-top: 10px;"><a class="btn btn-secondary library-link-btn" href="${escapeHtml(asset.preview_url)}" target="_blank" rel="noreferrer">Open Asset In New Tab</a></div>
    `;
  }

  return `
    <div class="library-preview-fallback">
      <div class="library-preview-extension">${escapeHtml(getFileExtension(asset.filename || asset.file_path || "").toUpperCase() || "FILE")}</div>
      <div class="library-preview-copy">Preview is not embedded for this file type yet. Use the open action to inspect the file directly.</div>
    </div>
  `;
}

function buildSourceIndicators(asset, registryTotal) {
  if (!asset) return [];

  return [
    {
      label: "Storage location",
      value: asset.source_signal,
      tone: getLocationTone(asset)
    },
    {
      label: "Routing",
      value: asset.inExpectedFolder ? "Aligned" : asset.routed ? "Off-route" : "Unrouted",
      tone: asset.inExpectedFolder ? "success" : asset.routed ? "warning" : "neutral"
    },
    {
      label: "Registry",
      value: asset.registryKnown ? "Registered" : registryTotal ? "Not registered" : "Registry empty",
      tone: asset.registryKnown ? "success" : registryTotal ? "warning" : "neutral"
    },
    {
      label: "Disk state",
      value: asset.exists ? "Available" : "Missing",
      tone: asset.exists ? "success" : "danger"
    }
  ];
}

function normalizeCustomAssetType(value = "") {
  return asString(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function getValidatedUploadAssetType(selection = "", customValue = "") {
  const normalizedSelection = asString(selection).trim().toLowerCase();
  const safeValues = new Set(SAFE_UPLOAD_ASSET_TYPES.map((item) => item.value));

  if (safeValues.has(normalizedSelection)) {
    return normalizedSelection;
  }

  if (normalizedSelection !== "custom") {
    throw new Error("Choose a valid asset type before uploading.");
  }

  const normalizedCustom = normalizeCustomAssetType(customValue);
  if (!normalizedCustom) {
    throw new Error("Enter a custom asset type before uploading.");
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(normalizedCustom)) {
    throw new Error("Custom asset type must use letters, numbers, underscores, or hyphens only.");
  }

  return normalizedCustom;
}

function bindLibraryWorkspace({
  $,
  navigateTo,
  showMessage,
  showError,
  reloadProjectData,
  escapeHtml,
  projectName,
  session,
  assetsData,
  tree,
  registry,
  folderHealth,
  missingRequiredAssets
}) {
  const assets = asArray(assetsData?.assets);
  const routes = asObject(assetsData?.routes);
  const registryAssets = asArray(registry?.assets);
  const registryTotal = Number(registry?.total_assets || registryAssets.length || 0);

  const syncSelectionToLatestUpload = (allAssets) => {
    const uploadedNames = asArray(session.lastUploadedFilenames);
    if (!uploadedNames.length) return;

    const match = allAssets.find((asset) => uploadedNames.includes(asset.filename));
    if (match) {
      session.selectedAssetId = match.id;
      session.lastUploadedFilenames = [];
    }
  };

  const uploadSelectedFiles = async () => {
    if (!projectName) {
      showError?.("Select a project before uploading files.");
      return;
    }

    if (session.uploading) {
      showError?.("Upload already in progress.");
      return;
    }

    const fileInput = $("libraryUploadInput");
    const assetTypeSelect = $("libraryUploadTypeSelect");
    const customAssetTypeInput = $("libraryUploadCustomTypeInput");
    const notesInput = $("libraryUploadNotesInput");
    const sourceModeInput = $("libraryUploadSourceInput");
    const files = asArray(fileInput?.files ? Array.from(fileInput.files) : []);

    if (!files.length) {
      showError?.("Choose at least one file before uploading.");
      return;
    }

    let assetType = "";
    try {
      assetType = getValidatedUploadAssetType(
        assetTypeSelect?.value || session.uploadType,
        customAssetTypeInput?.value || session.customUploadType
      );
    } catch (error) {
      showError?.(error.message || "Choose a valid asset type before uploading.");
      return;
    }

    const sourceMode = sourceModeInput?.value?.trim() || "Uploaded asset";
    const notes = notesInput?.value?.trim() || "";
    const uploaded = [];
    const failed = [];

    session.uploading = true;
    renderWorkspace();

    try {
      for (const file of files) {
        try {
          const result = await uploadProjectAsset(projectName, assetType, file);
          uploaded.push({
            id: `uploaded-${Date.now()}-${uploaded.length}`,
            filename: result?.filename || file.name,
            asset_type: assetType,
            status: "success",
            size: file.size,
            source_signal: sourceMode,
            notes,
            upload_mode: result?.upload_mode || "",
            target_folder: result?.target_folder || "",
            saved_to: result?.saved_to || "",
            message: `Uploaded successfully${result?.target_folder ? ` to ${result.target_folder}` : ""}.`,
            preview_url: `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(result?.filename || file.name)}`
          });
        } catch (error) {
          failed.push({
            filename: file.name,
            error: error.message || "Upload failed"
          });
        }
      }

      session.recentUploads = [
        ...uploaded,
        ...failed.map((item, index) => ({
          id: `failed-${Date.now()}-${index}`,
          filename: item.filename,
          asset_type: assetType,
          status: "failed",
          size: 0,
          source_signal: sourceMode,
          notes,
          message: item.error,
          preview_url: ""
        })),
        ...session.recentUploads
      ].slice(0, 12);
      session.lastUploadedFilenames = uploaded.map((item) => item.filename);
      session.selectedFolder = "all";

      if (fileInput) fileInput.value = "";
      if (notesInput) notesInput.value = "";

      if (uploaded.length && typeof reloadProjectData === "function") {
        await reloadProjectData(projectName);
      }

      if (uploaded.length && !failed.length) {
        showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"} to ${projectName}.`);
      } else if (uploaded.length && failed.length) {
        showError?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}, but ${failed.length} failed.`);
      } else if (failed.length) {
        showError?.(`Upload failed for ${failed.map((item) => item.filename).join(", ")}.`);
      }
    } finally {
      session.uploading = false;
      renderWorkspace();
    }
  };

  const renderWorkspace = () => {
    const allAssets = normalizeAssets({
      projectName,
      assets,
      routes,
      registryAssets,
      session
    });
    syncSelectionToLatestUpload(allAssets);

    const folderItems = buildFolderItems(tree, folderHealth, allAssets);
    const activeFolder = session.selectedFolder || "all";
    const searchValue = asString(session.searchQuery).trim();
    const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;

    const filteredAssets = allAssets.filter((asset) => {
      const matchesFolder = activeFolder === "all" || asset.folder === activeFolder;
      const haystack = `${asset.filename} ${asset.asset_type} ${asset.file_path} ${asset.source_signal}`;
      const matchesSearch = !searchRegex || searchRegex.test(haystack);
      return matchesFolder && matchesSearch;
    });

    if (!filteredAssets.find((asset) => asset.id === session.selectedAssetId)) {
      session.selectedAssetId = filteredAssets[0]?.id || allAssets[0]?.id || "";
    }

    const selectedAsset = allAssets.find((asset) => asset.id === session.selectedAssetId) || null;
    const sourceIndicators = buildSourceIndicators(selectedAsset, registryTotal);

    const folderTree = $("libraryFolderTree");
    if (folderTree) {
      folderTree.innerHTML = `
        <div class="library-folder-list">
          <button class="library-folder-item${activeFolder === "all" ? " is-active" : ""}" type="button" data-library-folder="all">
            <span class="library-folder-name">All folders</span>
            <span class="library-folder-meta">${escapeHtml(formatCount(allAssets.length))} assets</span>
          </button>
          ${folderItems.length
            ? folderItems.map((item) => `
              <button class="library-folder-item${activeFolder === item.name ? " is-active" : ""}" type="button" data-library-folder="${escapeHtml(item.name)}">
                <span class="library-folder-name">${escapeHtml(item.label)}</span>
                <span class="library-folder-meta">${escapeHtml(formatCount(item.assetCount))} assets${item.path ? ` • ${escapeHtml(item.exists ? "path ready" : "path missing")}` : ""}</span>
              </button>
            `).join("")
            : `<div class="empty-box">No folder tree has been scanned for this project yet.</div>`
          }
        </div>
      `;
    }

    const explorer = $("libraryAssetExplorer");
    if (explorer) {
      explorer.innerHTML = filteredAssets.length
        ? `
          <div class="library-asset-list">
            ${filteredAssets.map((asset) => `
              <button class="library-asset-item${session.selectedAssetId === asset.id ? " is-active" : ""}" type="button" data-library-asset="${escapeHtml(asset.id)}">
                <div class="library-asset-head">
                  <div>
                    <div class="library-asset-title">${escapeHtml(asset.filename || asset.asset_type || "Asset")}</div>
                    <div class="library-asset-meta">${escapeHtml(asset.asset_type || "asset")} • ${escapeHtml(asset.folder || "unassigned")}</div>
                  </div>
                  <span class="card-badge ${asset.localOnly ? "warning" : asset.exists ? "success" : "danger"}">${escapeHtml(asset.localOnly ? "Queued" : asset.exists ? "Live" : "Missing")}</span>
                </div>
                <div class="library-asset-tags">
                  <span class="library-tag ${asset.inExpectedFolder ? "success" : asset.routed ? "warning" : "neutral"}">${escapeHtml(asset.inExpectedFolder ? "In place" : asset.routed ? "Off-route" : "Unrouted")}</span>
                  <span class="library-tag ${asset.registryKnown ? "success" : "neutral"}">${escapeHtml(asset.registryKnown ? "Registry" : "Untracked")}</span>
                  <span class="library-tag neutral">${escapeHtml(asset.source_signal)}</span>
                </div>
              </button>
            `).join("")}
          </div>
        `
        : renderEmpty("No assets match the current folder or search filter.", escapeHtml);
    }

    const previewVisual = $("libraryPreviewVisual");
    if (previewVisual) {
      previewVisual.innerHTML = renderAssetPreviewBody(selectedAsset, escapeHtml);
    }

    const previewMeta = $("libraryPreviewMeta");
    if (previewMeta) {
      previewMeta.innerHTML = selectedAsset
        ? `
          <div class="data-stack">
            <div class="data-row"><span>Filename</span><strong>${escapeHtml(selectedAsset.filename || "-")}</strong></div>
            <div class="data-row"><span>Asset type</span><strong>${escapeHtml(selectedAsset.asset_type || "asset")}</strong></div>
            <div class="data-row"><span>Folder</span><strong>${escapeHtml(selectedAsset.folder || "unassigned")}</strong></div>
            <div class="data-row"><span>Path</span><strong>${escapeHtml(selectedAsset.file_path || "Queued upload")}</strong></div>
            <div class="data-row"><span>Source mode</span><strong>${escapeHtml(selectedAsset.source_signal)}</strong></div>
          </div>
        `
        : renderEmpty("Asset metadata appears here once you select an item from the explorer.", escapeHtml);
    }

    const editor = $("libraryAssetEditor");
    if (editor) {
      const currentDraft = selectedAsset ? asObject(session.metadataDrafts[selectedAsset.id]) : {};
      editor.innerHTML = selectedAsset
        ? `
          <div class="library-form-grid">
            <div class="setup-field-group">
              <div class="setup-field-head">
                <label class="setup-label" for="libraryAssetTypeInput">Asset classification</label>
                <span class="setup-field-state is-optional">${escapeHtml(selectedAsset.localOnly ? "Queued" : "Editable")}</span>
              </div>
              <input id="libraryAssetTypeInput" class="setup-input" type="text" value="${escapeHtml(currentDraft.asset_type || selectedAsset.asset_type || "")}" placeholder="e.g. product_image">
              <div class="setup-helper">Adjust the logical asset type used by workflows. Save Draft keeps this in the current browser session only.</div>
            </div>

            <div class="setup-field-group">
              <div class="setup-field-head">
                <label class="setup-label" for="librarySourceModeInput">Source of truth mode</label>
                <span class="setup-field-state is-optional">Local note</span>
              </div>
              <input id="librarySourceModeInput" class="setup-input" type="text" value="${escapeHtml(currentDraft.source_signal || selectedAsset.source_signal || "")}" placeholder="Project-owned, reference only, source candidate">
              <div class="setup-helper">Use this to annotate how the team should treat this asset operationally.</div>
            </div>

            <div class="setup-field-group">
              <div class="setup-field-head">
                <label class="setup-label" for="libraryAssetNotesInput">Operator notes</label>
                <span class="setup-field-state is-optional">Draft</span>
              </div>
              <textarea id="libraryAssetNotesInput" class="setup-input setup-textarea" rows="3" placeholder="Notes for upload, cleanup, replacement, or usage rules">${escapeHtml(currentDraft.notes || "")}</textarea>
              <div class="setup-helper">Useful for handoff before full registry editing is connected.</div>
            </div>
          </div>

          <div class="library-preview-actions">
            <button id="librarySaveAssetDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
            ${selectedAsset.preview_url ? `<a class="btn btn-primary library-link-btn" href="${escapeHtml(selectedAsset.preview_url)}" target="_blank" rel="noreferrer">Open Asset</a>` : `<button class="btn btn-primary" type="button" disabled>Open Asset</button>`}
            <button id="libraryDeleteAssetBtn" class="btn btn-secondary" type="button">Hide In This Session</button>
          </div>
        `
        : renderEmpty("Select an asset to edit local metadata, open the file, or stage a deletion review.", escapeHtml);
    }

    const sourceTruth = $("librarySourceTruth");
    if (sourceTruth) {
      sourceTruth.innerHTML = selectedAsset
        ? `
          <div class="library-indicator-grid">
            ${sourceIndicators.map((item) => `
              <div class="data-card">
                <span class="data-label">${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <div class="library-indicator-tone ${item.tone}"></div>
              </div>
            `).join("")}
          </div>
          <div class="simple-banner" style="margin-top: 14px;">
            ${escapeHtml(
              selectedAsset.registryKnown
                ? "This asset has a registry match and can act as an operationally trusted input once placement is aligned."
                : registryTotal
                  ? "This asset is visible in the scanned library but not in the registry payload yet. Review before treating it as authoritative."
                  : "The registry is currently empty, so folder placement and file existence are the strongest available truth signals."
            )}
          </div>
        `
        : renderEmpty("Select an asset to inspect routing, registry, and storage trust signals.", escapeHtml);
    }

    const uploadQueue = $("libraryUploadQueue");
    if (uploadQueue) {
      uploadQueue.innerHTML = session.recentUploads.length
        ? `
          <div class="library-upload-queue">
            ${session.recentUploads.map((upload) => `
              <div class="library-upload-item">
                <div>
                  <div class="library-asset-title">${escapeHtml(upload.filename)}</div>
                  <div class="library-asset-meta">${escapeHtml(upload.asset_type || "unclassified")} • ${escapeHtml(upload.size ? formatBytes(upload.size) : "-")}${upload.target_folder ? ` • ${escapeHtml(upload.target_folder)}` : ""}</div>
                  <div class="setup-helper" style="margin-top: 4px;">${escapeHtml(upload.message || (upload.status === "success" ? "Uploaded successfully." : "Upload failed."))}</div>
                </div>
                ${
                  upload.status === "success" && upload.preview_url
                    ? `<a class="quick-action-btn library-link-btn" href="${escapeHtml(upload.preview_url)}" target="_blank" rel="noreferrer">Open</a>`
                    : `<span class="quick-action-btn" aria-disabled="true">${escapeHtml(upload.status === "failed" ? "Failed" : "No preview")}</span>`
                }
              </div>
            `).join("")}
          </div>
        `
        : renderEmpty(
          session.uploading
            ? "Uploading files to the active project..."
            : "No uploads completed in this session yet. Select files and upload them to refresh the Library.",
          escapeHtml
        );
    }

    const missingAssetsBox = $("libraryMissingAssets");
    if (missingAssetsBox) {
      missingAssetsBox.innerHTML = missingRequiredAssets.length
        ? `
          <ul class="simple-list">
            ${missingRequiredAssets.map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("")}
          </ul>
        `
        : renderEmpty("All required asset types are currently present.", escapeHtml);
    }

    const summary = $("librarySummary");
    if (summary) {
      const offRouteCount = allAssets.filter((asset) => asset.routed && !asset.inExpectedFolder).length;
      const legacyCount = allAssets.filter((asset) => !asset.localOnly && asset.source_signal === "Legacy library").length;
      summary.innerHTML = `
        <div class="data-stack">
          <div class="data-row"><span>Visible assets</span><strong>${escapeHtml(formatCount(filteredAssets.length))}</strong></div>
          <div class="data-row"><span>Registry count</span><strong>${escapeHtml(formatCount(registryTotal))}</strong></div>
          <div class="data-row"><span>Off-route assets</span><strong>${escapeHtml(formatCount(offRouteCount))}</strong></div>
          <div class="data-row"><span>Legacy-path assets</span><strong>${escapeHtml(formatCount(legacyCount))}</strong></div>
        </div>
      `;
    }

    const folderButtons = Array.from(document.querySelectorAll("[data-library-folder]"));
    folderButtons.forEach((button) => {
      button.onclick = () => {
        session.selectedFolder = button.getAttribute("data-library-folder") || "all";
        renderWorkspace();
      };
    });

    const assetButtons = Array.from(document.querySelectorAll("[data-library-asset]"));
    assetButtons.forEach((button) => {
      button.onclick = () => {
        session.selectedAssetId = button.getAttribute("data-library-asset") || "";
        renderWorkspace();
      };
    });

    const searchInput = $("librarySearchInput");
    if (searchInput) {
      searchInput.value = session.searchQuery;
      searchInput.oninput = (event) => {
        session.searchQuery = event.target.value || "";
        renderWorkspace();
      };
    }

    const uploadTypeSelect = $("libraryUploadTypeSelect");
    const uploadCustomTypeInput = $("libraryUploadCustomTypeInput");
    if (uploadTypeSelect) {
      uploadTypeSelect.value = session.uploadType || "product";
      uploadTypeSelect.onchange = (event) => {
        session.uploadType = event.target.value || "product";
        renderWorkspace();
      };
    }

    if (uploadCustomTypeInput) {
      uploadCustomTypeInput.value = session.customUploadType || "";
      uploadCustomTypeInput.oninput = (event) => {
        session.customUploadType = event.target.value || "";
      };
    }

    const saveDraftBtn = $("librarySaveAssetDraftBtn");
    if (saveDraftBtn && selectedAsset) {
      saveDraftBtn.onclick = () => {
        session.metadataDrafts[selectedAsset.id] = {
          ...asObject(session.metadataDrafts[selectedAsset.id]),
          asset_type: $("libraryAssetTypeInput")?.value?.trim() || selectedAsset.asset_type || "",
          source_signal: $("librarySourceModeInput")?.value?.trim() || selectedAsset.source_signal || "",
          notes: $("libraryAssetNotesInput")?.value?.trim() || ""
        };
        showMessage?.("Asset metadata draft saved locally.");
        renderWorkspace();
      };
    }

      const deleteAssetBtn = $("libraryDeleteAssetBtn");
      if (deleteAssetBtn && selectedAsset) {
        deleteAssetBtn.onclick = () => {
          session.hiddenAssetIds.add(selectedAsset.id);
          session.selectedAssetId = "";
          showMessage?.("This only hides the asset in this session. It is not deleted from the backend.");
          renderWorkspace();
        };
      }
  };

  const addQueueBtn = $("libraryAddQueueBtn");
  if (addQueueBtn) {
    addQueueBtn.onclick = uploadSelectedFiles;
  }

  const stageUploadBtn = $("libraryStageUploadBtn");
  if (stageUploadBtn) {
    stageUploadBtn.onclick = uploadSelectedFiles;
  }

  const goSetupBtn = $("libraryOpenSetupBtn");
  if (goSetupBtn) {
    goSetupBtn.onclick = () => navigateTo("setup");
  }

  const goIntegrationsBtn = $("libraryOpenIntegrationsBtn");
  if (goIntegrationsBtn) {
    goIntegrationsBtn.onclick = () => navigateTo("integrations");
  }

  renderWorkspace();
}

export const libraryRoute = {
  id: "library",
  meta: {
    eyebrow: "Start",
    title: "Library",
    description: "Manage scanned assets, inspect source-of-truth signals, and prepare uploads safely."
  },
  template: `
    <section class="page is-active" data-page="library">
      <div id="libraryRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage,
    showError,
    reloadProjectData
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const assetsData = asObject(state.data.assets);
    const tree = asObject(state.data.tree);
    const registry = asObject(state.data.registry);
    const folderHealth = asObject(assetsData.folder_health);
    const session = ensureLibrarySession(projectName);

    const allAssets = asArray(assetsData.assets);
    const routedAssets = asArray(assetsData.routes?.routed_assets);
    const missingRequiredAssets = asArray(assetsData.missing_assets?.missing);
    const root = $("libraryRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="library-wrapper">
        <div class="library-hero">
          <div class="library-hero-copy">
            <div class="setup-kicker">Asset Management Workspace</div>
            <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Library` : "Library Workspace")}</h3>
            <p class="setup-hero-text">
              Review folder structure, inspect assets, understand truth signals, and prepare uploads before they hit the backend pipeline.
            </p>
            <div class="library-hero-status">
              <div class="setup-status-chip">
                <span>Registered assets</span>
                <strong>${escapeHtml(formatCount(allAssets.length))}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Routed assets</span>
                <strong>${escapeHtml(formatCount(routedAssets.length))}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Missing required</span>
                <strong>${escapeHtml(formatCount(missingRequiredAssets.length))}</strong>
              </div>
            </div>
          </div>

          <div class="setup-hero-actions">
            <button id="libraryOpenSetupBtn" class="btn btn-secondary" type="button">Open Setup</button>
            <button id="libraryOpenIntegrationsBtn" class="btn btn-primary" type="button">Open Integrations</button>
          </div>
        </div>

        <div class="library-layout">
          <div class="library-main">
            <section class="card">
              <div class="card-head">
                <h3>Folder Tree</h3>
                <span class="card-badge neutral">Structure</span>
              </div>
              <div id="libraryFolderTree"></div>
            </section>

            <section class="card">
              <div class="card-head">
                <div>
                  <h3>Asset Explorer</h3>
                  <p class="home-section-copy" style="margin: 6px 0 0;">Filter by folder, search by filename or type, and inspect operational asset health.</p>
                </div>
                <span class="card-badge neutral">Explorer</span>
              </div>
              <div class="library-toolbar">
                <input id="librarySearchInput" class="setup-input" type="text" placeholder="Search assets by name, type, path, or source mode">
              </div>
              <div id="libraryAssetExplorer"></div>
            </section>
          </div>

          <aside class="library-side">
            <section class="card">
              <div class="card-head">
                <h3>Asset Preview</h3>
                <span class="card-badge neutral">Inspect</span>
              </div>
              <div id="libraryPreviewVisual"></div>
              <div id="libraryPreviewMeta" style="margin-top: 16px;"></div>
              <div id="libraryAssetEditor" style="margin-top: 16px;"></div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Upload Center</h3>
                <span class="card-badge warning">Prepared</span>
              </div>
              <div class="library-form-grid">
                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="libraryUploadInput">Choose files</label>
                    <span class="setup-field-state is-optional">Multi-select</span>
                  </div>
                  <input id="libraryUploadInput" class="setup-input" type="file" multiple>
                  <div class="setup-helper">Select files here and run the upload into the active project using the existing backend endpoint.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="libraryUploadTypeInput">Default asset type</label>
                    <span class="setup-field-state is-optional">Applies to queue</span>
                  </div>
                  <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                    ${SAFE_UPLOAD_ASSET_TYPES.map((item) => `
                      <option value="${escapeHtml(item.value)}"${session.uploadType === item.value ? " selected" : ""}>${escapeHtml(item.label)}</option>
                    `).join("")}
                    <option value="custom"${session.uploadType === "custom" ? " selected" : ""}>Custom type (advanced)</option>
                  </select>
                  ${
                    session.uploadType === "custom"
                      ? `<input id="libraryUploadCustomTypeInput" class="setup-input" type="text" value="${escapeHtml(session.customUploadType || "")}" placeholder="custom_type" style="margin-top: 10px;">`
                      : ""
                  }
                  <div class="setup-helper">Use a known safe type when possible. Custom type is available for advanced cases and is validated before upload.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="libraryUploadSourceInput">Source mode</label>
                    <span class="setup-field-state is-optional">Operational</span>
                  </div>
                  <input id="libraryUploadSourceInput" class="setup-input" type="text" placeholder="Project-owned, reference only, source candidate">
                  <div class="setup-helper">Capture how the team should treat these files operationally after upload.</div>
                </div>

                <div class="setup-field-group">
                  <div class="setup-field-head">
                    <label class="setup-label" for="libraryUploadNotesInput">Upload notes</label>
                    <span class="setup-field-state is-optional">Optional</span>
                  </div>
                  <textarea id="libraryUploadNotesInput" class="setup-input setup-textarea" rows="3" placeholder="Notes for classification, routing, or cleanup"></textarea>
                </div>

                <div class="library-preview-actions">
                  <button id="libraryAddQueueBtn" class="btn btn-secondary" type="button">Run Upload</button>
                  <button id="libraryStageUploadBtn" class="btn btn-primary" type="button">Run Upload</button>
                </div>
                <div class="setup-helper">Run Upload sends the selected files to the backend immediately.</div>
              </div>

              <div style="margin-top: 16px;">
                <h4 class="setup-mini-title">Recent uploads</h4>
                <div id="libraryUploadQueue"></div>
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Missing Required Assets</h3>
                <span class="card-badge ${missingRequiredAssets.length ? "danger" : "success"}">${escapeHtml(missingRequiredAssets.length ? `${missingRequiredAssets.length} missing` : "Complete")}</span>
              </div>
              <div id="libraryMissingAssets"></div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Source Of Truth Indicators</h3>
                <span class="card-badge neutral">Trust</span>
              </div>
              <div id="librarySourceTruth"></div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Workspace Summary</h3>
                <span class="card-badge neutral">Signals</span>
              </div>
              <div id="librarySummary"></div>
            </section>
          </aside>
        </div>
      </div>
    `;

    bindLibraryWorkspace({
      $,
      navigateTo,
      showMessage,
      showError,
      reloadProjectData,
      escapeHtml,
      projectName,
      session,
      assetsData,
      tree,
      registry,
      folderHealth,
      missingRequiredAssets
    });
  }
};
