# PHASE 3U.1 — Library Deep Risk Evidence

## Destructive action grep
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

## Destructive action surrounding ranges

### Around line 6
import { renderGuideBox } from "../components/guide-box.js";
import { getSourceTypeMapping } from "../shared-context.js";
import {
  setSharedAiSource,
  getSharedLibrarySourceBridge,
  clearSharedLibrarySourceBridge,
  setSharedAiDrawerReturn,
  getSharedAiDrawerReturn
} from "../shared-context.js";

function buildAiSourcePayloadFromAsset(asset = {}) {
  if (!asset) return null;
  return {
    id: asset.id,
    asset_id: asset.asset_id,
    name: asset.name,
    filename: asset.filename,
    file_path: asset.file_path,
    asset_type: asset.asset_type,
    source_label: asset.source_label || asset.name || "Library asset",

### Around line 38
import { renderLibraryActionPanel } from "./library/action-panel.js";
import { renderLibraryAiPanel } from "./library/ai-panel.js";
import { normalizeLibraryAsset } from "./library/projection-adapter.js";
import { normalizeLibrarySession } from "./library/session-store.js";
import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
import { mountLibraryListeners } from "./library/listener-lifecycle.js";
import {
  AccessKeyError,
  archiveProjectAsset,
  deleteProjectAsset,
  fetchProtectedMediaBlob,
  refreshProjectLibrary,
  renameProjectAsset,
  setProjectAssetSourceOfTruth,
  updateProjectAssetStatus,
  uploadProjectAsset
} from "../api.js";
import {
  getAssetCatalog,
  getCanonicalAssetType,
  getCategoryReadinessList,
  getMissingAssetLabels,
  getAssetStatusTone

### Around line 39
import { renderLibraryAiPanel } from "./library/ai-panel.js";
import { normalizeLibraryAsset } from "./library/projection-adapter.js";
import { normalizeLibrarySession } from "./library/session-store.js";
import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
import { mountLibraryListeners } from "./library/listener-lifecycle.js";
import {
  AccessKeyError,
  archiveProjectAsset,
  deleteProjectAsset,
  fetchProtectedMediaBlob,
  refreshProjectLibrary,
  renameProjectAsset,
  setProjectAssetSourceOfTruth,
  updateProjectAssetStatus,
  uploadProjectAsset
} from "../api.js";
import {
  getAssetCatalog,
  getCanonicalAssetType,
  getCategoryReadinessList,
  getMissingAssetLabels,
  getAssetStatusTone
} from "../asset-library.js";

### Around line 163
  { key: "product_images", label: "Product Images", types: ["product_photos"] },
  { key: "packaging_images", label: "Packaging Images", types: ["packaging_images"] },
  { key: "videos", label: "Videos", types: ["product_videos"] },
  { key: "legal_pricing", label: "Legal & Pricing", types: ["legal_doc", "pricing_doc"] },
  { key: "brand_guidelines", label: "Brand Guidelines", types: ["brand_guideline"] },
  { key: "research_certificates", label: "Research / Certificates", types: ["partner_docs", "testimonials_reviews", "certificates"] },
  { key: "uploaded_session", label: "Uploaded This Session" },
  { key: "source_of_truth", label: "Source of Truth" },
  { key: "archived", label: "Archived" }
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

### Around line 350
  ].join("::");
}

function revokeLibraryProtectedUrl(key) {
  const entry = libraryProtectedUrlCache.get(key);
  if (entry?.objectUrl) {
    URL.revokeObjectURL(entry.objectUrl);
  }
  libraryProtectedUrlCache.delete(key);
}

function runNextLibraryThumbLoad() {
  if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
    return;
  }

  const nextJob = libraryThumbLoadQueue.shift();
  if (!nextJob) {
    return;
  }

  libraryThumbLoadsInFlight += 1;
  Promise.resolve()

### Around line 442
  })();

  libraryProtectedUrlPromiseCache.set(cacheKey, loadPromise);

  try {
    return await loadPromise;
  } finally {
    if (libraryProtectedUrlPromiseCache.get(cacheKey) === loadPromise) {
      libraryProtectedUrlPromiseCache.delete(cacheKey);
    }
  }
}

async function openLibraryAsset(projectName, asset) {
  if (!asset) {
    throw new Error("Select an asset before opening.");
  }

  const resolved = await getProtectedAssetObjectUrl(projectName, asset);
  const objectUrl = resolved.objectUrl;
  const contentType = asString(resolved.contentType);
  const safeFilename = asString(resolved.fileName || "download");


### Around line 473
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function mountLibraryGlobalListeners() {
  if (disposeLibraryGlobalListeners) {
    return;
  }

  disposeLibraryGlobalListeners = mountLibraryListeners({
    handlers: {
      onBeforeUnload: () => {
        Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
      },
      onDocumentClickHandlers: [
        async (event) => {

### Around line 585

function dispatchLibraryCommand(command, payload = {}, handlers = {}) {
  const envelope = createLibraryCommand(command, payload);
  return routeLibraryCommand(envelope, handlers);
}

function closeAllLibraryActionDropdowns() {
  Array.from(document.querySelectorAll(".library-action-dropdown.is-open")).forEach((item) => {
    item.classList.remove("is-open");
    item.style.display = "";
  });
}


function getSafeAssetType(value = "") {
  return asString(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function getUploadAssetType(session, catalog, selectedValue) {

### Around line 632
  if (normalized.includes("approved")) return "approved";
  if (normalized.includes("publishing_ready")) return "publishing_ready";
  if (normalized.includes("sent_to_publishing")) return "sent_to_publishing";
  if (normalized.includes("draft")) return "draft";
  if (normalized.includes("missing")) return "missing";
  if (normalized === "uploaded") return "uploaded";
  if (normalized.includes("needs_review") || normalized.includes("review")) return "needs_review";
  if (normalized.includes("reject")) return "rejected";
  if (normalized.includes("archiv")) return "archived";
  return "uploaded";
}

function toStatusLabel(status = "") {
  const value = normalizeReadinessStatus(status);
  if (value === "approved") return "Approved";
  if (value === "publishing_ready") return "Publishing Ready";
  if (value === "sent_to_publishing") return "Sent to Publishing";
  if (value === "draft") return "Draft";
  if (value === "needs_review") return "Needs Review";
  if (value === "missing") return "Missing";
  if (value === "rejected") return "Rejected";
  if (value === "archived") return "Archived";
  return "Uploaded";

### Around line 645
  const value = normalizeReadinessStatus(status);
  if (value === "approved") return "Approved";
  if (value === "publishing_ready") return "Publishing Ready";
  if (value === "sent_to_publishing") return "Sent to Publishing";
  if (value === "draft") return "Draft";
  if (value === "needs_review") return "Needs Review";
  if (value === "missing") return "Missing";
  if (value === "rejected") return "Rejected";
  if (value === "archived") return "Archived";
  return "Uploaded";
}

function toStatusTone(status = "") {
  const value = normalizeReadinessStatus(status);
  if (value === "publishing_ready" || value === "sent_to_publishing") return "success";
  if (value === "draft") return "neutral";
  if (value === "needs_review") return getAssetStatusTone("needs review");
  return getAssetStatusTone(value);
}

function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));


### Around line 952
    const entries = requirement.types
      .map((type) => categoryByType.get(type))
      .filter(Boolean);

    const statuses = entries.map((entry) => normalizeReadinessStatus(entry.status));
    let status = "missing";
    if (entries.length && statuses.every((value) => value === "approved")) {
      status = "present";
    } else if (entries.length && statuses.some((value) => value === "needs_review" || value === "uploaded" || value === "rejected" || value === "archived")) {
      status = "needs_review";
    } else if (entries.length && statuses.some((value) => value === "approved")) {
      status = "needs_review";
    }

    const totalCount = entries.reduce((acc, item) => acc + Number(item.count || 0), 0);

    return {
      ...requirement,
      status,
      totalCount,
      used_in: [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in || [])))],
      action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"
    };

### Around line 976
}

function getFilteredAssets(allAssets, session, bucketMap) {
  const selectedFolderKey = session.folderKey || "all_assets";
  const selectedCategoryKey = session.selectedCategoryKey || "all";
  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
  const selectedType = session.selectedType || "all";
  const selectedStatus = session.selectedStatus || "active";
  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
    ? "archived"
    : selectedStatus;
  const selectedSource = session.selectedSource || "all";
  const sortBy = session.sortBy || "updated_desc";
  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
  const searchValue = asString(session.searchQuery).trim();
  const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;
  const recentUploadedNames = new Set(
    asArray(session.recentUploads)
      .filter((entry) => entry && entry.status === "success")
      .map((entry) => asString(entry.filename).trim())
      .filter(Boolean)
  );


### Around line 977

function getFilteredAssets(allAssets, session, bucketMap) {
  const selectedFolderKey = session.folderKey || "all_assets";
  const selectedCategoryKey = session.selectedCategoryKey || "all";
  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
  const selectedType = session.selectedType || "all";
  const selectedStatus = session.selectedStatus || "active";
  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
    ? "archived"
    : selectedStatus;
  const selectedSource = session.selectedSource || "all";
  const sortBy = session.sortBy || "updated_desc";
  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
  const searchValue = asString(session.searchQuery).trim();
  const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;
  const recentUploadedNames = new Set(
    asArray(session.recentUploads)
      .filter((entry) => entry && entry.status === "success")
      .map((entry) => asString(entry.filename).trim())
      .filter(Boolean)
  );

  const folderMatches = (asset) => {

### Around line 996
      .filter(Boolean)
  );

  const folderMatches = (asset) => {
    const statusValue = normalizeReadinessStatus(asset.status);
    const assetType = asString(asset.asset_type).trim().toLowerCase();
    if (selectedFolderKey === "all_assets") return true;
    if (selectedFolderKey === "source_of_truth") return Boolean(asset.source_of_truth);
    if (selectedFolderKey === "archived") return statusValue === "archived";
    if (selectedFolderKey === "uploaded_session") {
      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
      return Boolean(filename && recentUploadedNames.has(filename));
    }

    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
    if (folder && Array.isArray(folder.types) && folder.types.length) {
      return folder.types.includes(assetType);
    }

    return true;
  };

  const filtered = allAssets.filter((asset) => {

### Around line 1011
    if (folder && Array.isArray(folder.types) && folder.types.length) {
      return folder.types.includes(assetType);
    }

    return true;
  };

  const filtered = allAssets.filter((asset) => {
    const isDeleted = Boolean(asset.deleted || asset.is_deleted);
    if (isDeleted) return false;

    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const matchesFolder = folderMatches(asset);
    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
    const statusValue = normalizeReadinessStatus(asset.status);
    const matchesStatus = effectiveSelectedStatus === "all"
      ? statusValue !== "archived"
      : effectiveSelectedStatus === "active"
        ? statusValue !== "archived"
        : statusValue === effectiveSelectedStatus;
    const matchesSource = selectedSource === "all"
      || (selectedSource === "media-studio" && asset.kind === "managed_media")
      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))

### Around line 1019
    const isDeleted = Boolean(asset.deleted || asset.is_deleted);
    if (isDeleted) return false;

    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const matchesFolder = folderMatches(asset);
    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
    const statusValue = normalizeReadinessStatus(asset.status);
    const matchesStatus = effectiveSelectedStatus === "all"
      ? statusValue !== "archived"
      : effectiveSelectedStatus === "active"
        ? statusValue !== "archived"
        : statusValue === effectiveSelectedStatus;
    const matchesSource = selectedSource === "all"
      || (selectedSource === "media-studio" && asset.kind === "managed_media")
      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
    const matchesSearch = !searchRegex || searchRegex.test(haystack);
    return matchesBucket && matchesFolder && matchesType && matchesStatus && matchesSource && matchesSearch;
  });

  const toTimestamp = (value) => {
    const ts = new Date(value || 0).getTime();

### Around line 1021

    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const matchesFolder = folderMatches(asset);
    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
    const statusValue = normalizeReadinessStatus(asset.status);
    const matchesStatus = effectiveSelectedStatus === "all"
      ? statusValue !== "archived"
      : effectiveSelectedStatus === "active"
        ? statusValue !== "archived"
        : statusValue === effectiveSelectedStatus;
    const matchesSource = selectedSource === "all"
      || (selectedSource === "media-studio" && asset.kind === "managed_media")
      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
    const matchesSearch = !searchRegex || searchRegex.test(haystack);
    return matchesBucket && matchesFolder && matchesType && matchesStatus && matchesSource && matchesSearch;
  });

  const toTimestamp = (value) => {
    const ts = new Date(value || 0).getTime();
    return Number.isFinite(ts) ? ts : 0;
  };

### Around line 1056
function computeFolderCounts(allAssets, session) {
  return LIBRARY_FOLDERS.map((folder) => {
    const count = allAssets.filter((asset) => {
      const statusValue = normalizeReadinessStatus(asset.status);
      const assetType = asString(asset.asset_type).trim().toLowerCase();
      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
      const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);

      if (folder.key === "all_assets") return !Boolean(asset.deleted || asset.is_deleted);
      if (folder.key === "source_of_truth") return Boolean(asset.source_of_truth);
      if (folder.key === "archived") return statusValue === "archived";
      if (folder.key === "uploaded_session") return inRecent;
      return Array.isArray(folder.types) ? folder.types.includes(assetType) : false;
    }).length;

    return {
      ...folder,
      count
    };
  });
}

function getPreviewExtensionForAsset(asset = {}) {

### Around line 1058
    const count = allAssets.filter((asset) => {
      const statusValue = normalizeReadinessStatus(asset.status);
      const assetType = asString(asset.asset_type).trim().toLowerCase();
      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
      const inRecent = asArray(session.recentUploads).some((entry) => entry?.status === "success" && asString(entry.filename).trim() === filename);

      if (folder.key === "all_assets") return !Boolean(asset.deleted || asset.is_deleted);
      if (folder.key === "source_of_truth") return Boolean(asset.source_of_truth);
      if (folder.key === "archived") return statusValue === "archived";
      if (folder.key === "uploaded_session") return inRecent;
      return Array.isArray(folder.types) ? folder.types.includes(assetType) : false;
    }).length;

    return {
      ...folder,
      count
    };
  });
}

function getPreviewExtensionForAsset(asset = {}) {
  return getFileExtension(
    asset.extension ||

### Around line 1441
    cancelBtn.className = "btn btn-secondary";

    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.textContent = "Save";
    submitBtn.className = "btn btn-primary";

    const cleanup = () => {
      overlay.remove();
    };

    cancelBtn.onclick = () => {
      cleanup();
      resolve(null);
    };

    submitBtn.onclick = () => {
      const value = input.value;
      cleanup();
      resolve(value);
    };

    overlay.onclick = (event) => {

### Around line 1637
    `;
  }

  // ...existing code...

  const requiredBox = $("libraryRequiredAssetsGrid");
  if (requiredBox) {
    requiredBox.innerHTML = requiredGroups.map((item) => {
      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";
      const reasonHint = item.why.length > 84 ? `${item.why.slice(0, 81)}...` : item.why;

      return `
        <article class="library-required-card">
          <div class="library-required-card-head">
            <h4>${escapeHtml(item.label)}</h4>
            <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
          </div>
          <p class="library-required-why">${escapeHtml(reasonHint)}</p>
          <div class="library-required-card-foot">
            <small>${escapeHtml(`Detected: ${formatCount(item.totalCount)}`)}</small>
            <button

### Around line 1670
  }

  const typeSelect = $("libraryFilterTypeSelect");
  if (typeSelect) {
    typeSelect.innerHTML = typeOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
    `).join("");
    typeSelect.value = session.selectedType || "all";
    typeSelect.removeAttribute("disabled");
    typeSelect.removeAttribute("readonly");
    typeSelect.onchange = (event) => {
      dispatchLibraryCommand("set-filter", {
        filter: "type",
        value: event.target.value || "all"
      }, {
        "set-filter": ({ value }) => {
          session.selectedType = value;
          session.page = 1;
        }
      });
      bindLibraryWorkspace({
        $,
        projectName,

### Around line 1671

  const typeSelect = $("libraryFilterTypeSelect");
  if (typeSelect) {
    typeSelect.innerHTML = typeOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
    `).join("");
    typeSelect.value = session.selectedType || "all";
    typeSelect.removeAttribute("disabled");
    typeSelect.removeAttribute("readonly");
    typeSelect.onchange = (event) => {
      dispatchLibraryCommand("set-filter", {
        filter: "type",
        value: event.target.value || "all"
      }, {
        "set-filter": ({ value }) => {
          session.selectedType = value;
          session.page = 1;
        }
      });
      bindLibraryWorkspace({
        $,
        projectName,
        session,

### Around line 1737
  }

  const sourceSelect = $("libraryFilterSourceSelect");
  if (sourceSelect) {
    sourceSelect.innerHTML = sourceOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
    `).join("");
    sourceSelect.value = session.selectedSource || "all";
    sourceSelect.removeAttribute("disabled");
    sourceSelect.removeAttribute("readonly");
    sourceSelect.onchange = (event) => {
      dispatchLibraryCommand("set-filter", {
        filter: "source",
        value: event.target.value || "all"
      }, {
        "set-filter": ({ value }) => {
          session.selectedSource = value;
          session.page = 1;
        }
      });
      bindLibraryWorkspace({
        $,
        projectName,

### Around line 1738

  const sourceSelect = $("libraryFilterSourceSelect");
  if (sourceSelect) {
    sourceSelect.innerHTML = sourceOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
    `).join("");
    sourceSelect.value = session.selectedSource || "all";
    sourceSelect.removeAttribute("disabled");
    sourceSelect.removeAttribute("readonly");
    sourceSelect.onchange = (event) => {
      dispatchLibraryCommand("set-filter", {
        filter: "source",
        value: event.target.value || "all"
      }, {
        "set-filter": ({ value }) => {
          session.selectedSource = value;
          session.page = 1;
        }
      });
      bindLibraryWorkspace({
        $,
        projectName,
        session,

### Around line 1826
            <div class="library-grid-meta" title="${escapeHtml(asset.filename || "-")}">${escapeHtml(fileName)}</div>
            <div class="library-grid-foot">
              <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
            </div>
          </article>
        `;
      }).join("")
      : `<div class="empty-box">No assets match this view. Try clearing filters, switching folders, or uploading a required asset.</div>`;
  }

  const gridPagination = $("libraryGridPagination");
  if (gridPagination) {
    const showingStart = filteredAssets.length ? pageStart + 1 : 0;
    const showingEnd = pageEnd;

    gridPagination.innerHTML = `
      <div class="library-grid-page-info">Showing ${escapeHtml(String(showingStart))}-${escapeHtml(String(showingEnd))} of ${escapeHtml(String(filteredAssets.length))}</div>
      <div class="library-grid-page-actions">
        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
        <span>Page ${escapeHtml(String(session.page))} / ${escapeHtml(String(totalPages))}</span>
        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
      </div>

### Around line 1954

        // Preserve/set drawer return context
        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
        if (bridgeReturn && bridgeReturn.drawerReturnContext) {
          setSharedAiDrawerReturn(activeProjectName || "__default__", bridgeReturn.drawerReturnContext);
          setSharedAiDrawerReturn("__default__", bridgeReturn.drawerReturnContext);
        }

        clearSharedLibrarySourceBridge(sourceProjectName);
        clearSharedLibrarySourceBridge("__default__");
        showMessage?.("Source added to drawer.");
        navigateTo("ai-command");
      };
    });
  }

  const actionPanelMount = $("libraryActionPanelMount");
  if (actionPanelMount) {
    actionPanelMount.innerHTML = renderLibraryActionPanel({
      selectedAsset,
      disabled: false
    });
  }

### Around line 1955
        // Preserve/set drawer return context
        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
        if (bridgeReturn && bridgeReturn.drawerReturnContext) {
          setSharedAiDrawerReturn(activeProjectName || "__default__", bridgeReturn.drawerReturnContext);
          setSharedAiDrawerReturn("__default__", bridgeReturn.drawerReturnContext);
        }

        clearSharedLibrarySourceBridge(sourceProjectName);
        clearSharedLibrarySourceBridge("__default__");
        showMessage?.("Source added to drawer.");
        navigateTo("ai-command");
      };
    });
  }

  const actionPanelMount = $("libraryActionPanelMount");
  if (actionPanelMount) {
    actionPanelMount.innerHTML = renderLibraryActionPanel({
      selectedAsset,
      disabled: false
    });
  }


### Around line 2042
        session.selectedType = uploadType;
        session.page = 1;
        // Focus/scroll asset workspace
        setTimeout(() => {
          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
          if (assetWorkspace) {
            assetWorkspace.classList.add("is-required-action-target");
            assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => assetWorkspace.classList.remove("is-required-action-target"), 2000);
          }
        }, 0);
        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,
          reloadProjectData,

### Around line 2241
      dispatchLibraryCommand("set-filter", {
        filter: "folder",
        value: folderKey
      }, {
        "set-filter": ({ value }) => {
          session.folderKey = value;
          session.page = 1;

          if (value === "archived") {
            session.selectedStatus = "archived";
          }
        }
      });

      rerender();
    };
  });

  const viewToggleButtons = Array.from(document.querySelectorAll("[data-library-view-mode]"));
viewToggleButtons.forEach((button) => {
  button.onclick = () => {
    const mode = button.getAttribute("data-library-view-mode") || "grid";


### Around line 2242
        filter: "folder",
        value: folderKey
      }, {
        "set-filter": ({ value }) => {
          session.folderKey = value;
          session.page = 1;

          if (value === "archived") {
            session.selectedStatus = "archived";
          }
        }
      });

      rerender();
    };
  });

  const viewToggleButtons = Array.from(document.querySelectorAll("[data-library-view-mode]"));
viewToggleButtons.forEach((button) => {
  button.onclick = () => {
    const mode = button.getAttribute("data-library-view-mode") || "grid";

    dispatchLibraryCommand("set-view-mode", {

### Around line 2329
        showError?.("Asset not found.");
        return;
      }

      try {
        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update source of truth.");
        showError?.(message);
      }
    };
  });

  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
  statusActionButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();

### Around line 2359
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
      if (!confirmed) {
        return;
      }

      try {
        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);

### Around line 2360
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
      if (!confirmed) {
        return;
      }

      try {
        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }

### Around line 2378
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
  archiveButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {

### Around line 2379
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
  archiveButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");

### Around line 2388
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");

### Around line 2397
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });


### Around line 2402
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();

### Around line 2405
      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before renaming assets.");
        return;

### Around line 2407
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before renaming assets.");
        return;
      }


### Around line 2453
        await reloadOrRerender();
        showMessage?.("Asset renamed.");
      } catch (error) {
        showError?.(error.message || "Failed to rename asset.");
      }
    };
  });

  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
  deleteButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {

### Around line 2454
        showMessage?.("Asset renamed.");
      } catch (error) {
        showError?.(error.message || "Failed to rename asset.");
      }
    };
  });

  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
  deleteButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");

### Around line 2463
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
        return;
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");

### Around line 2472
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
        return;
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }
    };

### Around line 2477
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
        return;
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }
    };
  });

  const actionToggleButtons = Array.from(document.querySelectorAll(".library-action-toggle"));
  actionToggleButtons.forEach((button) => {
    button.onclick = (event) => {

### Around line 2482
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }
    };
  });

  const actionToggleButtons = Array.from(document.querySelectorAll(".library-action-toggle"));
  actionToggleButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const menu = button.closest(".library-action-menu");
      const dropdown = menu?.querySelector(".library-action-dropdown");

### Around line 2484
      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }
    };
  });

  const actionToggleButtons = Array.from(document.querySelectorAll(".library-action-toggle"));
  actionToggleButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const menu = button.closest(".library-action-menu");
      const dropdown = menu?.querySelector(".library-action-dropdown");
      if (!dropdown) return;


### Around line 2560
      }, {
        "set-filter": ({ value }) => {
          session.searchQuery = value;
          session.page = 1;
        }
      });

      if (librarySearchRenderTimer) {
        window.clearTimeout(librarySearchRenderTimer);
      }

      librarySearchRenderTimer = window.setTimeout(() => {
        rerender();
      }, 1000);
    };
  }

  const uploadTypeSelect = $("libraryUploadTypeSelect");
  if (uploadTypeSelect) {
    const catalog = getAssetCatalog(assetsData);
    uploadTypeSelect.innerHTML = catalog.map((item) => {
      const assetType = item.asset_type;
      const label = getLibraryUploadTypeLabel(assetType);

### Around line 2652
          event.preventDefault();
          dropZone.classList.add("is-drag-active");
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropZone.classList.remove("is-drag-active");
        });
      });

      dropZone.addEventListener("drop", (event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        if (!files.length) return;
        syncDroppedFilesToInput(files);
      });

      dropZone.dataset.libraryDndBound = "1";
    }

    const openLibraryFilePicker = () => {
      const picker = document.createElement("input");

### Around line 2680
      document.body.appendChild(picker);

      picker.onchange = () => {
        const files = Array.from(picker.files || []);
        if (files.length) {
          syncDroppedFilesToInput(files);
          showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
        }
        picker.remove();
      };

      picker.click();
    };

    const chooseFilesBtn = $("libraryChooseFilesBtn");
    if (chooseFilesBtn) {
      chooseFilesBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLibraryFilePicker();
      };
    }


### Around line 2939
    setTimeout(() => {
      const guideBox = document.getElementById("librarySourceBridgeGuideBox");
      if (guideBox) {
        const backBtn = guideBox.querySelector('[data-guide-action="back-to-ai-command"]');
        const dismissBtn = guideBox.querySelector('[data-guide-action="dismiss-guide"]');
        if (backBtn) {
          backBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);

### Around line 2940
      const guideBox = document.getElementById("librarySourceBridgeGuideBox");
      if (guideBox) {
        const backBtn = guideBox.querySelector('[data-guide-action="back-to-ai-command"]');
        const dismissBtn = guideBox.querySelector('[data-guide-action="dismiss-guide"]');
        if (backBtn) {
          backBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);


### Around line 2947
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);

    setTimeout(() => {
      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
        if (assetWorkspace) {
          assetWorkspace.classList.add("is-source-target");
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);

### Around line 2948
            clearSharedLibrarySourceBridge("__default__");
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);

    setTimeout(() => {
      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
        if (assetWorkspace) {
          assetWorkspace.classList.add("is-source-target");
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
        }

### Around line 2949
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);

    setTimeout(() => {
      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
        if (assetWorkspace) {
          assetWorkspace.classList.add("is-source-target");
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
        }
      }

### Around line 2961
    }, 0);

    setTimeout(() => {
      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
        if (assetWorkspace) {
          assetWorkspace.classList.add("is-source-target");
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
        }
      }
    }, 0);

    const registry = asObject(state.data.registry);
    const baseAssetsData = Array.isArray(state.data.assets) ? { assets: state.data.assets } : asObject(state.data.assets);
    const registryAssets = asArray(registry.assets || registry.items || registry.records);
    const assetsDataAssets = asArray(baseAssetsData.assets);
    const assetsData = {
      ...baseAssetsData,
      assets: assetsDataAssets.length ? assetsDataAssets : registryAssets
    };
    const operations = asObject(state.data.operations);
    const session = ensureLibrarySession(projectName);

### Around line 3092
              <div class="library-filter-bar">
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
                    <option value="active">Active (non-archived)</option>
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="needs_review">Needs review</option>
                    <option value="publishing_ready">Publishing ready</option>
                    <option value="sent_to_publishing">Sent to publishing</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>

### Around line 3101
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="needs_review">Needs review</option>
                    <option value="publishing_ready">Publishing ready</option>
                    <option value="sent_to_publishing">Sent to publishing</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="librarySortSelect">Sort</label>
                  <select id="librarySortSelect" class="setup-input" aria-label="Sort assets">
                    <option value="updated_desc">Newest first</option>
                    <option value="updated_asc">Oldest first</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="status">Status</option>

## Handoff / route grep
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

## API/backend grep
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

## Upload / file picker detailed range
        filter: "search",
        value: event.target.value || ""
      }, {
        "set-filter": ({ value }) => {
          session.searchQuery = value;
          session.page = 1;
        }
      });

      if (librarySearchRenderTimer) {
        window.clearTimeout(librarySearchRenderTimer);
      }

      librarySearchRenderTimer = window.setTimeout(() => {
        rerender();
      }, 1000);
    };
  }

  const uploadTypeSelect = $("libraryUploadTypeSelect");
  if (uploadTypeSelect) {
    const catalog = getAssetCatalog(assetsData);
    uploadTypeSelect.innerHTML = catalog.map((item) => {
      const assetType = item.asset_type;
      const label = getLibraryUploadTypeLabel(assetType);
      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");
    uploadTypeSelect.value = session.uploadType;
    uploadTypeSelect.onchange = (event) => {
      const uploadType = getSafeAssetType(event.target.value || "logo") || "logo";

      dispatchLibraryCommand("upload-type-change", { uploadType }, {
        "upload-type-change": ({ uploadType: nextUploadType }) => ({
          shadow: true,
          uploadType: nextUploadType
        })
      });

      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
    };
  }

  const dropZone = $("libraryDropZone");
  const uploadInput = $("libraryUploadInput");
  const uploadBtn = $("libraryUploadBtn");
  if (dropZone && uploadInput) {
    const updateUploadUiState = () => {
      const files = Array.from(uploadInput.files || []);
      const names = files.slice(0, 6).map((file) => file.name).join(", ");
      const suffix = files.length > 6 ? ` +${files.length - 6} more` : "";
      const message = files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected: ${names}${suffix}` : "No files selected";
      const info = $("libraryDropInfo");
      if (info) info.textContent = message;

      if (uploadBtn) {
        uploadBtn.disabled = session.uploading || files.length === 0;
        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
      }
    };

    const syncDroppedFilesToInput = (files) => {
      try {
        const transfer = new DataTransfer();
        files.forEach((file) => transfer.items.add(file));
        uploadInput.files = transfer.files;
      } catch (_) {
        // Browser may block synthetic file assignment.
      }
      updateUploadUiState();
    };

    dropZone.onclick = (event) => {
      event.preventDefault();
      openLibraryFilePicker();
    };

    dropZone.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        uploadInput.click();
      }
    };
    uploadInput.onchange = () => {
      updateUploadUiState();

      const files = Array.from(uploadInput.files || []);
      if (files.length) {
        showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
      }
    };

    if (!dropZone.dataset.libraryDndBound) {
      ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropZone.classList.add("is-drag-active");
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropZone.classList.remove("is-drag-active");
        });
      });

      dropZone.addEventListener("drop", (event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        if (!files.length) return;
        syncDroppedFilesToInput(files);
      });

      dropZone.dataset.libraryDndBound = "1";
    }

    const openLibraryFilePicker = () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.multiple = true;
      picker.style.position = "fixed";
      picker.style.left = "-9999px";
      picker.style.top = "0";
      document.body.appendChild(picker);

      picker.onchange = () => {
        const files = Array.from(picker.files || []);
        if (files.length) {
          syncDroppedFilesToInput(files);
          showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
        }
        picker.remove();
      };

      picker.click();
    };

    const chooseFilesBtn = $("libraryChooseFilesBtn");
    if (chooseFilesBtn) {
      chooseFilesBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLibraryFilePicker();
      };
    }

    updateUploadUiState();
  }

  if (uploadBtn) {
    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
    uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
    uploadBtn.onclick = async () => {
      const activeProjectName = resolveActiveProjectName();

      if (!activeProjectName) {
        showError?.("Select a project before uploading.");
        return;
      }

      if (session.uploading) return;

      const files = Array.from($("libraryUploadInput")?.files || []);
      if (!files.length) {
        showError?.("Select at least one file to upload.");
        return;
      }

## Selected asset / action handlers range 1
      </div>
    `;
  }

  const protectedThumbNodes = Array.from(document.querySelectorAll("[data-library-protected-thumb]"));
  const prioritizedThumbNodes = protectedThumbNodes
    .sort((left, right) => {
      const leftId = left.getAttribute("data-library-protected-thumb") || "";
      const rightId = right.getAttribute("data-library-protected-thumb") || "";
      if (leftId === session.selectedAssetId) return -1;
      if (rightId === session.selectedAssetId) return 1;
      return 0;
    })
    .slice(0, LIBRARY_THUMB_BATCH_LIMIT);

  prioritizedThumbNodes.forEach((node) => {
    const assetId = node.getAttribute("data-library-protected-thumb") || "";
    const asset = allAssets.find((item) => item.id === assetId);
    if (!asset) return;

    hydrateProtectedImageNode({
      node,
      projectName,
      asset,
      className: "library-grid-thumb",
      alt: asset.name,
      fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`,
      showError
    });
  });

  const previewVisual = $("libraryPreviewVisual");
  if (previewVisual) {
    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);

    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
    if (protectedPreviewNode && selectedAsset) {
      hydrateProtectedAssetPreview({
        previewNode: protectedPreviewNode,
        projectName,
        asset: selectedAsset,
        escapeHtml,
        showError
      });
    }
  }

  const previewMeta = $("libraryPreviewMeta");
  if (previewMeta) {
    previewMeta.innerHTML = selectedAsset
      ? `
        <div class="library-inspector-title">
          <strong>${escapeHtml(selectedAsset.name)}</strong>
          <span>${escapeHtml(selectedAsset.filename || basename(selectedAsset.file_path || "") || "-")}</span>
        </div>

        <div class="library-inspector-quick">
          <span class="card-badge ${escapeHtml(toStatusTone(selectedAsset.status))}">${escapeHtml(toStatusLabel(selectedAsset.status))}</span>
          <span class="card-badge ${selectedAsset.source_of_truth ? "success" : "neutral"}">${escapeHtml(selectedAsset.source_of_truth ? "Source" : "Not Source")}</span>
          <span class="card-badge neutral">${escapeHtml(selectedAsset.asset_type)}</span>
        </div>

        <div class="library-inspector-path">${escapeHtml(assetContextHint(selectedAsset))}</div>

        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Source in AI Command</button>

        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
          <span class="library-inspector-ai-source-guide-text">Select one Library item, then click Use as Source in AI Command.</span>
        </div>

        <details class="library-inspector-more">
          <summary>Technical details</summary>
          <div class="data-stack">
            <div class="data-row"><span>Review Status</span><strong>${escapeHtml(toStatusLabel(selectedAsset.status))}</strong></div>
            <div class="data-row"><span>Source Status</span><strong>${escapeHtml(selectedAsset.source_of_truth ? "Source of truth" : "Not source of truth")}</strong></div>
            <div class="data-row"><span>Asset ID</span><strong>${escapeHtml(shortAssetId(selectedAsset.asset_id || selectedAsset.mutation_id || selectedAsset.id || "-"))}</strong></div>
            <div class="data-row"><span>Full Path</span><strong>${escapeHtml(selectedAsset.file_path || "-")}</strong></div>
            <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
            <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
            <div class="data-row"><span>Version</span><strong>${escapeHtml(asString(selectedAsset.version || selectedAsset.asset_version || "-") || "-")}</strong></div>
          </div>
        </details>
      `
      : `<div class="empty-box">Select an asset to preview context. Actions become available in the Action Panel.</div>`;
    // Bind Use as AI Source button (inspector and grid quick action)
    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
    if (useBtns.length === 0 && gridBody) {
      // fallback: try to find in grid
      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
      if (gridBtn && selectedAsset) useBtns = [gridBtn];
    }
    useBtns.forEach((useBtn) => {
      useBtn.classList.add("btn-primary", "std-ai-btn");
      useBtn.textContent = "Use as Source in AI Command";
      useBtn.setAttribute("aria-label", "Use as Source in AI Command");
      useBtn.onclick = () => {
        const asset = allAssets.find((a) => a.id === selectedAsset.id || a.asset_id === selectedAsset.id);
        if (!asset) {
          showError?.("Asset not found.");
          return;
        }
        const payload = buildAiSourcePayloadFromAsset(asset);
        const activeProjectName = resolveActiveProjectName();
        const sourceProjectName = resolveActiveProjectName?.() || asString(projectName || "").trim().toLowerCase() || "__default__";
        setSharedAiSource(sourceProjectName, payload);
        setSharedAiSource("__default__", payload);

        // Preserve/set drawer return context
        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
        if (bridgeReturn && bridgeReturn.drawerReturnContext) {
          setSharedAiDrawerReturn(activeProjectName || "__default__", bridgeReturn.drawerReturnContext);
          setSharedAiDrawerReturn("__default__", bridgeReturn.drawerReturnContext);
        }

        clearSharedLibrarySourceBridge(sourceProjectName);
        clearSharedLibrarySourceBridge("__default__");
        showMessage?.("Source added to drawer.");
        navigateTo("ai-command");
      };
    });
  }

  const actionPanelMount = $("libraryActionPanelMount");
  if (actionPanelMount) {
    actionPanelMount.innerHTML = renderLibraryActionPanel({
      selectedAsset,
      disabled: false
    });
  }

  const aiPanelMount = $("libraryAiPanelMount");
  if (aiPanelMount) {
    aiPanelMount.innerHTML = renderLibraryAiPanel({
      readiness: readinessSummary,
      selectedAsset,
      disabled: false
    });
  }

  const activityBox = $("libraryRecentActivity");
  if (activityBox) {
    activityBox.innerHTML = recentActivity.length
      ? `
        <ul class="simple-list">
          ${recentActivity.map((asset) => `
            <li>
              <strong>${escapeHtml(asset.name)}</strong>
              <span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>
            </li>
          `).join("")}
        </ul>
      `
      : `<div class="empty-box">Recent uploads and updates will appear here after you add or refresh assets.</div>`;
  }

  const uploadSummary = $("libraryUploadSummary");
  if (uploadSummary) {
    uploadSummary.innerHTML = session.recentUploads.length
      ? `
        <ul class="simple-list">
          ${session.recentUploads.slice(0, 5).map((item) => `
            <li>
              <strong>${escapeHtml(item.filename)}</strong>
              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
            </li>
          `).join("")}
        </ul>
      `
      : `<div class="empty-box">No uploads in this session yet. Choose files and upload them to start building the asset library.</div>`;
  }

  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
  requiredActionButtons.forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-library-required-action") || "review";
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
      const requiredKey = button.getAttribute("data-library-required-key") || "";

      // Always set upload type
      session.uploadType = uploadType;
      const uploadTypeSelect = $("libraryUploadTypeSelect");
      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;

      // Try to find a matching folder/filter for the required asset group
      let mappedFolder = null;
      for (const folder of LIBRARY_FOLDERS) {
        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
          mappedFolder = folder;
          break;
        }
      }

      if (mappedFolder) {
        session.folderKey = mappedFolder.key;
        session.selectedType = uploadType;
        session.page = 1;
        // Focus/scroll asset workspace
        setTimeout(() => {
          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
          if (assetWorkspace) {
            assetWorkspace.classList.add("is-required-action-target");
            assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => assetWorkspace.classList.remove("is-required-action-target"), 2000);
          }
        }, 0);
        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,
          reloadProjectData,
          showMessage,
          showError,
          escapeHtml
        });
        return;
      } else {
        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
      }

      if (action === "upload") {
        const uploadInput = $("libraryUploadInput");
        uploadInput?.click();
        return;
      }

      if (action === "review") {
        session.selectedStatus = "needs_review";
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,
          reloadProjectData,
          showMessage,
          showError,
          escapeHtml
        });
        return;
      }

      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "classify");
      navigateTo("ai-command");
      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
    };
  });

  const selectButtons = Array.from(document.querySelectorAll("[data-library-select]"));
  selectButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatchLibraryCommand("select-asset", {
        assetId: button.getAttribute("data-library-select") || ""
      }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selectedId = button.getAttribute("data-library-select") || "";
      const selected = allAssets.find((asset) => asset.id === selectedId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const selectableRows = Array.from(document.querySelectorAll("[data-library-row-select]"));
  selectableRows.forEach((row) => {
    row.onclick = (event) => {
      if (isLibraryInteractiveElement(event.target)) {
        return;
      }

      const nextId = row.getAttribute("data-library-row-select") || "";
      if (!nextId) return;

      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };

    row.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const nextId = row.getAttribute("data-library-row-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
  selectableCards.forEach((card) => {
    card.onclick = (event) => {
      if (isLibraryInteractiveElement(event.target)) return;
      const nextId = card.getAttribute("data-library-grid-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const _fbCard = allAssets.find((a) => a.id === nextId);
      if (_fbCard?.name) showMessage?.(`Selected ${_fbCard.name}. Review status and available actions.`);
      rerender();
    };

    card.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const nextId = card.getAttribute("data-library-grid-select") || "";
      if (!nextId) return;
      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
        "select-asset": ({ assetId }) => {
          session.selectedAssetId = assetId;
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      rerender();
    };

## Selected asset / action handlers range 2
    };
  });

  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
  folderButtons.forEach((button) => {
    button.onclick = () => {
      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";

      dispatchLibraryCommand("set-filter", {
        filter: "folder",
        value: folderKey
      }, {
        "set-filter": ({ value }) => {
          session.folderKey = value;
          session.page = 1;

          if (value === "archived") {
            session.selectedStatus = "archived";
          }
        }
      });

      rerender();
    };
  });

  const viewToggleButtons = Array.from(document.querySelectorAll("[data-library-view-mode]"));
viewToggleButtons.forEach((button) => {
  button.onclick = () => {
    const mode = button.getAttribute("data-library-view-mode") || "grid";

    dispatchLibraryCommand("set-view-mode", {
      viewMode: mode === "list" ? "list" : "grid"
    }, {
      "set-view-mode": ({ viewMode }) => {
        session.viewMode = viewMode;
        session.page = 1;
      }
    });

    rerender();
  };
});

  const finderWorkspace = $("libraryFinderWorkspace");
  if (finderWorkspace) {
    finderWorkspace.setAttribute("data-library-view-mode", session.viewMode === "grid" ? "grid" : "list");
    protectLibraryInteractiveControls(finderWorkspace);
  }

  const toolbarUpload = $("libraryToolbarUploadBtn");
  if (toolbarUpload) {
    toolbarUpload.onclick = () => $("libraryUploadInput")?.click();
  }

  const openButtons = Array.from(document.querySelectorAll("[data-library-open]"));
  openButtons.forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-library-open") || "";
      dispatchLibraryCommand("open-preview", { assetId: id }, {
        "open-preview": ({ assetId }) => ({
          shadow: true,
          assetId
        })
      });

      const asset = allAssets.find((item) => item.id === id);
      if (!asset) {
        showError?.("Asset not found.");
        return;
      }

      try {
        await openLibraryAsset(projectName, asset);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : `Could not open file: ${error.message || "Unknown error."}`;
        showError?.(message);
      }
    };
  });

  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
  sourceOfTruthButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before updating source of truth.");
        return;
      }

      const assetId = button.getAttribute("data-library-source-truth") || "";
      const asset = allAssets.find((item) => item.id === assetId);
      if (!asset) {
        showError?.("Asset not found.");
        return;
      }

      try {
        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update source of truth.");
        showError?.(message);
      }
    };
  });

  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
  statusActionButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before updating asset status.");
        return;
      }

      const status = button.getAttribute("data-asset-status-action") || "needs_review";
      const id = button.getAttribute("data-library-asset") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness state and may affect downstream review/publishing flow.\n\nSelect Cancel to keep the current status.`);
      if (!confirmed) {
        return;
      }

      try {
        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
  archiveButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before renaming assets.");
        return;
      }

      const id = button.getAttribute("data-library-rename") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!asset || !assetId) {
        showError?.("Asset not found.");
        return;
      }

      const nextName = await promptForTextInput("Rename asset", asset.name || "");
      if (nextName == null) {
        return;
      }

      const normalized = nextName.trim();
      if (!normalized) {
        showError?.("Asset name cannot be empty.");
        return;
      }

      try {
        await renameProjectAsset(activeProjectName, assetId, normalized);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset renamed.");
      } catch (error) {
        showError?.(error.message || "Failed to rename asset.");
      }
    };
  });

  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
  deleteButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows.\n\nSelect Cancel to keep this asset available.`)) {
        return;
      }

      try {
        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
        if (asset?.id === session.selectedAssetId) {
          session.selectedAssetId = "";
        }
        await reloadOrRerender();
        showMessage?.("Asset deleted (soft delete).");
      } catch (error) {
        showError?.(error.message || "Failed to delete asset.");
      }

## Route export / render range
        .map((asset) => asset.name);
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "extract", { docs });
      navigateTo("ai-command");
      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
    };
  }

  const sendToAiBtn = document.querySelector("[data-library-command=\"send-to-ai\"]");
  if (sendToAiBtn && !sendToAiBtn.disabled) {
    sendToAiBtn.onclick = () => {
      if (!selectedAsset) {
        showMessage?.("Select an asset first to prepare AI context.");
        return;
      }

      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "classify");
      showMessage?.(`AI context prepared for ${selectedAsset.name}. Open AI Command to review recommendations.`);
      navigateTo("ai-command");
    };
  }
}

export const libraryRoute = {
  id: "library",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Start",
    title: "Library",
    description: "Smart Asset Library"
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
    navigateTo,
    showMessage,
    showError,
    reloadProjectData
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";

    // --- Library Source Bridge Contextual Guide Strip ---
    const activeProjectName = asString(projectName || "").trim().toLowerCase();
    const activeSourceBridge = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
    const activeSourceMapping = activeSourceBridge?.type === "library_source_selection"
      ? getSourceTypeMapping(activeSourceBridge.sourceType || "auto")
      : null;
    const sourceGuideHtml = activeSourceMapping
      ? renderGuideBox({
          title: "Choose source for AI Command",
          instructions: [
            "Select one Library item, then click Use as Source in AI Command.",
            activeSourceMapping.label ? `Source type: ${activeSourceMapping.label}` : "Source type: Auto"
          ],
          actions: [
            { id: "back-to-ai-command", label: "Back to Drawer" },
            { id: "dismiss-guide", label: "Dismiss" }
          ],
          tone: "info"
        })
      : "";

    // Guide button binding
    setTimeout(() => {
      const guideBox = document.getElementById("librarySourceBridgeGuideBox");
      if (guideBox) {
        const backBtn = guideBox.querySelector('[data-guide-action="back-to-ai-command"]');
        const dismissBtn = guideBox.querySelector('[data-guide-action="dismiss-guide"]');
        if (backBtn) {
          backBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            navigateTo("ai-command");
          };
        }
        if (dismissBtn) {
          dismissBtn.onclick = () => {
            const guideProjectName = activeProjectName || "__default__";
            clearSharedLibrarySourceBridge(guideProjectName);
            clearSharedLibrarySourceBridge("__default__");
            guideBox.remove();
          };
        }
      }
    }, 0);

    setTimeout(() => {
      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
        if (assetWorkspace) {
          assetWorkspace.classList.add("is-source-target");
          assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => assetWorkspace.classList.remove("is-source-target"), 2000);
        }
      }
    }, 0);

    const registry = asObject(state.data.registry);
    const baseAssetsData = Array.isArray(state.data.assets) ? { assets: state.data.assets } : asObject(state.data.assets);
    const registryAssets = asArray(registry.assets || registry.items || registry.records);
    const assetsDataAssets = asArray(baseAssetsData.assets);
    const assetsData = {
      ...baseAssetsData,
      assets: assetsDataAssets.length ? assetsDataAssets : registryAssets
    };
    const operations = asObject(state.data.operations);
    const session = ensureLibrarySession(projectName);
    session.viewMode = "grid";
    const categoryReadiness = getCategoryReadinessList(assetsData);
    const missingRequiredAssets = getMissingAssetLabels(assetsData);
    const renderCatalog = getAssetCatalog(assetsData);
    const renderCategoryByType = getCategoryByType(categoryReadiness);
    const renderManagedAssets = getManagedMediaAssets(projectName, operations);
    const renderWorkspaceAssetsData = {
      ...assetsData,
      assets: getWorkspaceAssetItems(assetsData, registry)
    };
    const renderAllAssets = [
      ...renderManagedAssets,
      ...normalizeAssets(projectName, renderWorkspaceAssetsData, registry, renderCategoryByType, renderCatalog)
    ];
    const folderCounts = computeFolderCounts(renderAllAssets, session);
    // Compute overview before render for KPI chips
    const overview = buildAssetOverview({
      assets: renderAllAssets,
      requiredGroups: buildRequiredAssetGroups(categoryReadiness)
    });
    const root = $("libraryRoot");
    if (!root) return;

    mountLibraryGlobalListeners();

    root.innerHTML = `
      <div class="library-smart-shell">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Asset Control System</div>
              <h3>${escapeHtml(projectName ? `${projectName} Asset Overview` : "Asset Overview")}</h3>
              <p class="setup-helper">
                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
              </p>
            </div>
            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh Library scan</button>
          </div>
          <div id="libraryOverviewCards" class="library-overview-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Required Assets</h3>
            <span class="card-badge warning">Readiness gaps</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card library-actions-card">
          <div class="card-head">
            <h3>Asset Intake</h3>
            <div class="library-action-toolbar">
              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
              <button id="libraryAiExtractBtn" class="btn btn-secondary" type="button">Extract Docs</button>
            </div>
          </div>
          <div class="library-upload-grid">
            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
              <strong>Upload asset to Library</strong>
              <span>Drop files or click to browse</span>
              <small id="libraryDropInfo">No files selected</small>
              <button id="libraryChooseFilesBtn" class="btn btn-secondary btn-sm" type="button">Choose Files</button>
              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
            </div>
            <div class="library-upload-controls">
              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                ${getAssetCatalog(assetsData).map((item) => `
                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
                `).join("")}
              </select>
              <div class="setup-helper">Upload and classify for readiness in one step.</div>
              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload asset to Library</button>
            </div>
          </div>
          <div id="libraryUploadSummary" class="library-upload-summary"></div>
        </section>

        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
            <div class="card-head">
              <h3>Asset Workspace</h3>
            <span class="card-badge neutral">Selected asset workspace</span>
          </div>
          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
            <div class="library-workspace-main">
              <div class="library-finder-topbar">
                <div class="library-finder-sidebar-title"></div>
                <div class="library-folder-list">
                  ${LIBRARY_FOLDERS.map((folder) => {
      const count = folderCounts.find((item) => item.key === folder.key)?.count || 0;
      const active = (session.folderKey || "all_assets") === folder.key;
      return `
                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
                        <span>${escapeHtml(folder.label)}</span>
                        <small>${escapeHtml(formatCount(count))}</small>
                      </button>
                    `;
    }).join("")}
                </div>
              </div>

              <div class="library-finder-toolbar">
                <button id="libraryToolbarUploadBtn" class="btn btn-secondary btn-sm" type="button">Quick Upload</button>
              </div>

              <div class="library-filter-bar">
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
                    <option value="active">Active (non-archived)</option>
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="needs_review">Needs review</option>
                    <option value="publishing_ready">Publishing ready</option>
                    <option value="sent_to_publishing">Sent to publishing</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="librarySortSelect">Sort</label>
                  <select id="librarySortSelect" class="setup-input" aria-label="Sort assets">
                    <option value="updated_desc">Newest first</option>
                    <option value="updated_asc">Oldest first</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div class="library-filter-field library-filter-search">
                  <label class="setup-label" for="librarySearchInput">Search</label>
                  <input id="librarySearchInput" class="setup-input" type="text" placeholder="Search by name, path, type, or usage" />
                </div>
              </div>

              <div id="libraryAssetGridBody" class="library-grid-body"></div>
              <div id="libraryGridPagination" class="library-grid-pagination"></div>
            </div>

            <aside class="library-workspace-side">
              <div class="library-side-stack">
                <section class="card library-preview-card">
                  <div class="card-head">
                    <h3>Preview</h3>
                  </div>
                  <div id="libraryPreviewVisual"></div>
                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
                </section>
                <div id="libraryActionPanelMount" class="library-panel-mount"></div>
                <div id="libraryAiPanelMount" class="library-panel-mount"></div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    `;
    bindLibraryWorkspace({
      $,
      projectName,
      session,
      assetsData,
      operations,
      registry,
      categoryReadiness,
      missingRequiredAssets,
      navigateTo,
      reloadProjectData,
      showMessage,
      showError,
      escapeHtml
    });

    return () => {
      unmountLibraryGlobalListeners();
    };
  }
};
