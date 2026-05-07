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

const librarySessionStore = new Map();
let librarySearchRenderTimer = null;
const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
const libraryProtectedUrlCache = new Map();
const LIBRARY_PAGE_SIZE = 10;
const libraryProtectedUrlPromiseCache = new Map();
let libraryGlobalListenersInitialized = false;
const MAX_CONCURRENT_LIBRARY_THUMB_LOADS = 4;
const LIBRARY_THUMB_BATCH_LIMIT = 18;
let libraryThumbLoadsInFlight = 0;
const libraryThumbLoadQueue = [];

const SMART_CATEGORY_BUCKETS = [
  { key: "logos", label: "Logos", types: ["logo"] },
  { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
  { key: "videos", label: "Videos", types: ["product_videos"] },
  { key: "documents", label: "Documents", types: ["brand_guideline", "partner_docs", "testimonials_reviews", "certificates"] },
  { key: "legal", label: "Legal", types: ["legal_doc"] },
  { key: "pricing", label: "Pricing", types: ["pricing_doc", "product_csv"] },
  { key: "campaign_materials", label: "Campaign Materials", types: ["social_assets", "campaign_assets"] }
];

const REQUIRED_ASSET_REQUIREMENTS = [
  {
    key: "logos",
    label: "Logos",
    types: ["logo"],
    why: "Logos keep brand identity consistent across setup, media generation, and publishing.",
    uploadType: "logo"
  },
  {
    key: "brand_guidelines",
    label: "Brand Guidelines",
    types: ["brand_guideline"],
    why: "Guidelines prevent off-brand messaging and visual drift in AI outputs.",
    uploadType: "brand_guideline"
  },
  {
    key: "product_data",
    label: "Product CSV / Product Data",
    types: ["product_csv"],
    why: "Product data anchors facts, variants, and claims for campaign and publishing.",
    uploadType: "product_csv"
  },
  {
    key: "product_images",
    label: "Product Images",
    types: ["product_photos", "packaging_images"],
    why: "Approved product and packaging visuals are required for high-trust creative production.",
    uploadType: "product_photos"
  },
  {
    key: "videos",
    label: "Videos",
    types: ["product_videos"],
    why: "Video source assets are required for reels, demos, and cutdowns.",
    uploadType: "product_videos"
  },
  {
    key: "legal_pricing",
    label: "Legal / Pricing Documents",
    types: ["legal_doc", "pricing_doc"],
    why: "Legal and pricing documents prevent non-compliant copy and invented offers.",
    uploadType: "legal_doc"
  },
  {
    key: "research_documents",
    label: "Research Documents",
    types: ["partner_docs", "testimonials_reviews", "certificates"],
    why: "Research and proof documents support claims, trust signals, and strategy decisions.",
    uploadType: "partner_docs"
  }
];

const LIBRARY_FOLDERS = [
  { key: "all_assets", label: "All Assets" },
  { key: "logos", label: "Logos", types: ["logo"] },
  { key: "product_data", label: "Product Data", types: ["product_csv"] },
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
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function isLibraryInteractiveElement(target) {
  return Boolean(target?.closest?.(
    "button, a, input, select, textarea, label, option, [role='button'], .library-action-menu, .library-action-dropdown, .library-drop-zone"
  ));
}

function bindLibraryControlEventShield(scope) {
  // No-op by design.
  // Do not stop events on native controls. Select/input/file controls must
  // receive pointer/click/input events directly from the browser.
  return;
}

function titleCase(value = "") {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toKey(value = "") {
  return asString(value).trim().toLowerCase();
}

function projectKey(projectName) {
  return toKey(projectName) || "__default__";
}

function readManagedMediaAssetMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function loadLocalManagedMediaAssets(projectName) {
  const map = readManagedMediaAssetMap();
  const primary = asArray(map[projectKey(projectName)]);
  if (primary.length) return primary;
  if (!toKey(projectName)) {
    return asArray(map.workspace || map.Workspace || map.__default__);
  }
  return primary;
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

function shortPath(filePath = "", maxSegments = 4) {
  const value = asString(filePath).trim();
  if (!value) return "-";
  const parts = value.split("/").filter(Boolean);
  if (parts.length <= maxSegments) return `/${parts.join("/")}`;
  return `.../${parts.slice(parts.length - maxSegments).join("/")}`;
}

function assetContextHint(asset) {
  const filePath = asString(asset?.file_path || "").trim();
  if (!filePath) return "Library";

  const parts = filePath.split("/").filter(Boolean);
  if (!parts.length) return "Library";

  const tail = parts.slice(-3).join("/");
  return tail || shortPath(filePath);
}

function shortAssetId(value = "") {
  const id = asString(value).trim();
  if (!id) return "-";
  if (id.length <= 20) return id;
  return `${id.slice(0, 10)}...${id.slice(-8)}`;
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function isImageExtension(extension = "") {
  return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
}

function isVideoExtension(extension = "") {
  return ["mp4", "mov", "webm", "m4v"].includes(extension);
}

function buildPreviewUrl(projectName, asset) {
  if (!projectName) return "";
  const fullPath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  const fileName = basename(fullPath || asset.filename || asset.file_name || asset.name || "");
  const assetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  if (!fileName || !assetType) return "";

  const base = `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
  const params = [];

  if (fullPath) {
    params.push(`path=${encodeURIComponent(fullPath)}`);
  }

  if (assetId) {
    params.push(`assetId=${encodeURIComponent(assetId)}`);
  }

  return params.length ? `${base}?${params.join("&")}` : base;
}

function requiresProtectedMediaFetch(fileUrl = "") {
  const value = asString(fileUrl).trim();
  if (!value) return false;
  if (/^blob:/i.test(value) || /^data:/i.test(value)) return false;
  if (/^https?:\/\//i.test(value) && !value.includes("/media/file/")) return false;
  return value.includes("/media/file/");
}

function getAssetPreviewUrl(asset) {
  if (!asset) return "";
  return asString(
    asset.preview_url
    || asset.image_url
    || asset.video_url
    || asset.audio_url
    || ""
  ).trim();
}

function buildProtectedCacheKey(projectName, asset) {
  const resolvedAssetId = asString(asset.asset_id || asset.assetId || asset.id || "").trim();
  const resolvedFilePath = asString(asset.file_path || asset.local_path || asset.path || "").trim();
  return [
    projectKey(projectName),
    resolvedAssetId || "no-asset-id",
    resolvedFilePath || "no-file-path",
    getAssetPreviewUrl(asset)
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
    .then(nextJob)
    .finally(() => {
      libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
      runNextLibraryThumbLoad();
    });
}

function enqueueLibraryThumbLoad(job) {
  return new Promise((resolve, reject) => {
    libraryThumbLoadQueue.push(async () => {
      try {
        resolve(await job());
      } catch (error) {
        reject(error);
      }
    });

    runNextLibraryThumbLoad();
  });
}

async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
  const previewUrl = getAssetPreviewUrl(asset);
  const fileName = asString(asset?.filename || asset?.name || basename(previewUrl) || "download");

  if (!requiresProtectedMediaFetch(previewUrl)) {
    return {
      objectUrl: previewUrl,
      contentType: "",
      fileName,
      fromProtectedFetch: false
    };
  }

  const cacheKey = buildProtectedCacheKey(projectName, asset);
  const cached = libraryProtectedUrlCache.get(cacheKey);
  if (cached?.objectUrl && !options.force) {
    return {
      objectUrl: cached.objectUrl,
      contentType: cached.contentType,
      fileName,
      fromProtectedFetch: true
    };
  }

  if (options.force) {
    revokeLibraryProtectedUrl(cacheKey);
  }

  const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);
  if (inFlight && !options.force) {
    return inFlight;
  }

  const loadPromise = (async () => {
    const { blob, contentType } = await fetchProtectedMediaBlob(previewUrl, Number(options.timeoutMs) || undefined);
    const objectUrl = URL.createObjectURL(blob);
    libraryProtectedUrlCache.set(cacheKey, {
      objectUrl,
      contentType,
      createdAt: Date.now()
    });

    return {
      objectUrl,
      contentType,
      fileName,
      fromProtectedFetch: true
    };
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

  if (
    contentType.startsWith("image/") ||
    contentType.startsWith("video/") ||
    contentType.includes("pdf") ||
    /\.(png|jpg|jpeg|webp|gif|svg|avif|mp4|mov|webm|m4v|pdf)$/i.test(safeFilename)
  ) {
    window.open(objectUrl, "_blank", "noopener,noreferrer");
   
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
  });
}

function initializeLibraryGlobalListeners() {
  if (libraryGlobalListenersInitialized) return;
  libraryGlobalListenersInitialized = true;

  document.addEventListener("click", async (event) => {
    const button = event.target.closest?.("[data-copy-asset-path]");
    if (!button || !button.closest(".library-workspace")) return;

    event.preventDefault();

    const value = button.getAttribute("data-copy-asset-path") || "";
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      alert("Asset path copied.");
    } catch {
      window.prompt("Copy asset path:", value);
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a.library-link-btn");
    if (!link || !link.closest(".library-workspace")) return;

    const fileUrl = link.getAttribute("href") || "";
    if (!fileUrl.includes("/media/file/")) return;

    event.preventDefault();

    const assetName = link.getAttribute("data-asset-name") || decodeURIComponent(fileUrl.split("/").pop() || "download");
    openLibraryAsset("", {
      preview_url: fileUrl,
      filename: assetName,
      name: assetName
    }).catch((error) => {
      const message = error instanceof AccessKeyError
        ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
        : `Could not open file: ${error.message || "Unknown error."}`;
      alert(message);
    });
  });

  document.addEventListener("click", (event) => {
    const root = event.target?.closest?.(".library-workspace");
    if (!root) return;

    if (event.target?.closest?.(".library-action-menu")) {
      return;
    }

    closeAllLibraryActionDropdowns();
  });

}

initializeLibraryGlobalListeners();

function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, {
      selectedCategoryKey: "all",
      selectedAssetId: "",
      searchQuery: "",
      selectedType: "all",
      selectedStatus: "active",
      selectedSource: "all",
      sortBy: "updated_desc",
      folderKey: "all_assets",
      viewMode: "grid",
      page: 1,
      uploadType: "logo",
      uploading: false,
      recentUploads: []
    });
  }
  return librarySessionStore.get(key);
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
  const normalized = getSafeAssetType(selectedValue || session.uploadType);
  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
  if (!valid.has(normalized)) {
    throw new Error("Choose a valid upload category.");
  }
  return normalized;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCategoryByType(categoryReadiness) {
  const map = new Map();
  asArray(categoryReadiness).forEach((item) => {
    const key = asString(item.asset_type).trim().toLowerCase();
    if (key) map.set(key, item);
  });
  return map;
}

function normalizeReadinessStatus(value = "") {
  const normalized = asString(value).trim().toLowerCase().replace(/\s+/g, "_");
  if (!normalized) return "uploaded";
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

  const registryItems = asArray(
    legacyRegistry?.assets ||
    legacyRegistry?.items ||
    legacyRegistry?.records
  );

  const assetItems = asArray(assetsData?.assets).length
    ? asArray(assetsData.assets)
    : registryItems;

  const registryByPath = new Map();
  const registryByName = new Map();
  const registryById = new Map();

  registryItems.forEach((item) => {
    const localPath = asString(item.local_path || item.file_path || item.path).trim();
    const fileName = basename(localPath || item.file_name || item.filename || item.name || "");
    const assetId = asString(item.asset_id || item.assetId || item.id).trim();

    if (localPath) registryByPath.set(localPath, item);
    if (fileName) registryByName.set(fileName, item);
    if (assetId) registryById.set(assetId, item);
  });

  return assetItems.map((asset, index) => {
    const rawType = asset.asset_type || asset.type || asset.category || asset.assetCategory || "";
    const canonicalType = getCanonicalAssetType(rawType, catalog);
    const filePath = asString(asset.file_path || asset.local_path || asset.path || asset.url || "").trim();
    const fileName = basename(filePath || asset.file_name || asset.filename || asset.name || `asset-${index + 1}`);
    const extension = getFileExtension(fileName);
    const category = categoryByType.get(canonicalType) || {};
    const catalogItem = catalogMap.get(canonicalType) || {};
    const rawId = asString(asset.asset_id || asset.assetId || asset.id).trim();
    const registryMatch = registryById.get(rawId) || registryByPath.get(filePath) || registryByName.get(fileName) || {};
    const merged = {
      ...asset,
      ...registryMatch
    };

    const status = normalizeReadinessStatus(
      merged.readiness_status ||
      merged.review_status ||
      merged.approval_status ||
      merged.status ||
      category.status ||
      "uploaded"
    );

    const id = asString(
      merged.asset_id ||
      merged.assetId ||
      merged.id ||
      `${canonicalType || "asset"}-${index}-${fileName}`
    );
    const mutationId = asString(
      merged.asset_id ||
      merged.assetId ||
      merged.id ||
      (filePath ? `path:${filePath}` : fileName ? `name:${fileName}` : id)
    );

    const previewUrl = merged.preview_url ||
      merged.public_url ||
      merged.url ||
      buildPreviewUrl(projectName, {
        ...merged,
        asset_type: canonicalType,
        file_path: filePath,
        filename: fileName
      });

    return {
      ...merged,
      id,
      asset_id: id,
      mutation_id: mutationId,
      kind: "library_asset",
      name: asString(merged.name || merged.title || fileName || id),
      asset_type: canonicalType || "asset",
      type_label: catalogItem.display_label || catalogItem.label || titleCase(canonicalType || "asset"),
      status,
      source_label: asString(merged.source_label || merged.source || merged.scan_source || "Library"),
      source_key: asString(merged.source_key || merged.source || merged.scan_source || "library").toLowerCase(),
      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth),
      used_in: asArray(merged.used_in || catalogItem.guidance?.used_in || ["Library"]),
      uploaded_at: merged.uploaded_at || merged.updated_at || merged.created_at || merged.registered_at || "",
      version_id: merged.version_id || merged.version || "",
      file_path: filePath,
      filename: fileName,
      extension,
      preview_url: previewUrl,
      is_image: isImageExtension(extension),
      is_video: isVideoExtension(extension),
      is_audio: ["mp3", "wav", "m4a", "ogg"].includes(extension)
    };
  });
}


function inferManagedAssetType(asset = {}) {
  const mediaType = toKey(asset.media_type);
  if (mediaType === "campaign-pack") return "campaign_pack";
  if (mediaType === "video") return "generated_media";
  if (mediaType === "voice") return "voice_script";
  if (asset.video_brief) return "video_brief";
  if (asset.voice_script) return "voice_script";
  if (asset.prompt && !asset.image_url && !asset.video_url && !asset.audio_url) return "prompt_asset";
  if (["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status))) return "publishing_ready_asset";
  return "generated_media";
}

function normalizeManagedMediaAsset(rawAsset = {}, index = 0, sourceKind = "local") {
  const asset = asObject(rawAsset);
  const payload = asObject(asset.output_payload);
  const id = asString(asset.handoff_id || asset.id || `media-managed-${index}`);
  const imageUrl = asString(asset.image_url || asset.url || payload.image_url || payload.url || asObject(asArray(payload.images)[0]).url);
  const videoUrl = asString(asset.video_url || payload.video_url || asObject(asArray(payload.videos)[0]).url);
  const audioUrl = asString(asset.audio_url || payload.audio_url || asObject(payload.audio).url);
  const promptText = asString(asset.prompt || payload.prompt);
  const briefText = asString(payload.video_brief || payload.voice_script || payload.message || asset.notes);
  const managedType = inferManagedAssetType({
    ...asset,
    image_url: imageUrl,
    video_url: videoUrl,
    audio_url: audioUrl,
    video_brief: payload.video_brief,
    voice_script: payload.voice_script
  });

  return {
    id: `managed-${id}`,
    asset_id: id,
    kind: "managed_media",
    source_signature: asString(asset.source_signature),
    name: asString(asset.title || `${asString(asset.media_type || "media")} ${asString(asset.version_id || "version")}`),
    file_path: asString(asset.handoff_id || asset.media_job_id || ""),
    asset_type: managedType,
    category_label: "Media Studio Generated",
    category_status: "Uploaded",
    status: normalizeReadinessStatus(asset.status || asset.readiness_status || "needs_review"),
    exists: true,
    source_of_truth: false,
    used_in: asArray(asset.usage).length ? asArray(asset.usage) : ["Library", "Media Studio"],
    uploaded_at: asset.updated_at || asset.created_at || null,
    preview_url: firstValidUrl(imageUrl, videoUrl, audioUrl),
    extension: imageUrl ? "image" : videoUrl ? "video" : audioUrl ? "audio" : "json",
    is_image: Boolean(imageUrl),
    is_video: Boolean(videoUrl),
    is_audio: Boolean(audioUrl),
    image_url: imageUrl,
    video_url: videoUrl,
    audio_url: audioUrl,
    text_preview: promptText || briefText,
    json_preview: payload,
    media_payload: payload,
    media_type: asString(asset.media_type || payload.mode || "media"),
    version_id: asString(asset.version_id || ""),
    project: asString(asset.project || ""),
    campaign: asString(asset.campaign || ""),
    approval_status: asString(asset.approval_status || "draft"),
    notes: asString(asset.notes || ""),
    source_kind: sourceKind,
    source_label: sourceKind === "backend" ? "Media Studio (backend handoff)" : "Media Studio (local handoff)"
  };
}

function firstValidUrl(...values) {
  for (const value of values) {
    const text = asString(value).trim();
    if (/^https?:\/\//i.test(text) || /^blob:/i.test(text) || /^data:image\//i.test(text)) {
      return text;
    }
  }
  return "";
}

function getManagedMediaAssets(projectName, operations) {
  const local = loadLocalManagedMediaAssets(projectName)
    .map((item, index) => normalizeManagedMediaAsset(item, index, "local"));

  const backendHandoffs = asArray(operations?.handoffs?.items)
    .filter((item) => asString(item?.destination_page) === "library" && asString(item?.source_page) === "media-studio")
    .map((item) => {
      const payload = asObject(item?.payload);
      const libraryAsset = asObject(payload.library_asset);
      return normalizeManagedMediaAsset(
        {
          ...libraryAsset,
          handoff_id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          status: libraryAsset.status || libraryAsset.readiness_status || item.status
        },
        0,
        "backend"
      );
    });

  const mergedBySignature = new Map();
  [...backendHandoffs, ...local].forEach((asset) => {
    const key = asString(asset.source_signature || asset.asset_id || asset.id);
    const existing = mergedBySignature.get(key);
    if (!existing) {
      mergedBySignature.set(key, asset);
      return;
    }
    const existingTs = new Date(existing.uploaded_at || 0).getTime() || 0;
    const candidateTs = new Date(asset.uploaded_at || 0).getTime() || 0;
    if (candidateTs >= existingTs) mergedBySignature.set(key, asset);
  });

  return [...mergedBySignature.values()];
}

function buildAssetOverview({ assets, requiredGroups }) {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const recentlyUploadedByDate = assets.filter((asset) => {
    if (!asset.uploaded_at) return false;
    const ts = new Date(asset.uploaded_at).getTime();
    return Number.isFinite(ts) && ts >= sevenDaysAgo;
  }).length;

  const approvedAssets = assets.filter((asset) => asset.status === "approved").length;
  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
  const missingRequiredAssets = requiredGroups.filter((item) => item.status === "missing").length;
  const sourceOfTruthAssets = assets.filter((asset) => asset.source_of_truth).length;
  const sourceCoverage = assets.length ? Math.round((sourceOfTruthAssets / assets.length) * 100) : 0;
  const nextAction = requiredGroups.find((item) => item.status === "missing") || requiredGroups.find((item) => item.status === "needs_review") || null;

  return {
    totalAssets: assets.length,
    approvedAssets,
    needsReviewAssets,
    missingRequiredAssets,
    sourceOfTruthAssets,
    sourceCoverage,
    recentlyUploaded: recentlyUploadedByDate,
    nextAction: nextAction
      ? `${nextAction.status === "missing" ? "Upload" : "Review"} ${nextAction.label}`
      : "Required assets are covered. Continue with classification and approvals."
  };
}

function buildCategoryBuckets(categoryReadiness) {
  const categoryByType = getCategoryByType(categoryReadiness);

  return SMART_CATEGORY_BUCKETS.map((bucket) => {
    const entries = bucket.types
      .map((type) => categoryByType.get(type))
      .filter(Boolean);
    const usedIn = [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in)))];
    const statuses = entries.map((entry) => normalizeReadinessStatus(entry.status));

    let status = "Needs Review";
    if (!entries.length || statuses.every((value) => value === "missing")) {
      status = "Missing";
    } else if (statuses.some((value) => value === "missing" || value === "needs_review" || value === "uploaded")) {
      status = "Needs Review";
    } else {
      status = "Approved";
    }

    return {
      ...bucket,
      status,
      count: entries.reduce((acc, item) => acc + Number(item.count || 0), 0),
      used_in: usedIn
    };
  });
}

function buildRequiredAssetGroups(categoryReadiness) {
  const categoryByType = getCategoryByType(categoryReadiness);

  return REQUIRED_ASSET_REQUIREMENTS.map((requirement) => {
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
  });
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
    return Number.isFinite(ts) ? ts : 0;
  };

  const sorted = [...filtered].sort((left, right) => {
    if (sortBy === "name_asc") return left.name.localeCompare(right.name);
    if (sortBy === "name_desc") return right.name.localeCompare(left.name);
    if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);
    if (sortBy === "status") return toStatusLabel(left.status).localeCompare(toStatusLabel(right.status));
    return toTimestamp(right.uploaded_at) - toTimestamp(left.uploaded_at);
  });

  return sorted;
}

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

function renderPreview(asset, escapeHtml) {
  if (!asset) {
    return `<div class="empty-box">Select an asset to preview.</div>`;
  }

  const previewUrl = getAssetPreviewUrl(asset);
  const protectedPreview = requiresProtectedMediaFetch(previewUrl);

  if (asset.is_image && asString(asset.image_url || previewUrl).trim()) {
    if (protectedPreview) {
      return `
        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
          <div class="library-preview-fallback">Loading protected image preview...</div>
        </div>
      `;
    }

    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
      </div>
    `;
  }

  if (asset.is_video && asString(asset.video_url || previewUrl).trim()) {
    if (protectedPreview) {
      return `
        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
          <div class="library-preview-fallback">Loading protected video preview...</div>
        </div>
      `;
    }

    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url || previewUrl))}"></video>
      </div>
    `;
  }

  if (asset.is_audio && asString(asset.audio_url || previewUrl).trim()) {
    return `
      <div class="library-preview-frame">
        <audio style="width:100%;max-width:100%;" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
      </div>
    `;
  }

  if (asset.is_image && previewUrl) {
    if (protectedPreview) {
      return `
        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
          <div class="library-preview-fallback">Loading protected image preview...</div>
        </div>
      `;
    }

    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
      </div>
    `;
  }

  if (asset.is_video && previewUrl) {
    if (protectedPreview) {
      return `
        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
          <div class="library-preview-fallback">Loading protected video preview...</div>
        </div>
      `;
    }

    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>
      </div>
    `;
  }

  if (asset.text_preview) {
    return `<div class="library-preview-fallback" style="white-space:pre-wrap;overflow-wrap:anywhere;text-align:left;">${escapeHtml(asset.text_preview)}</div>`;
  }

  const jsonFallback = JSON.stringify(asset.json_preview || asset.media_payload || {}, null, 2);
  if (jsonFallback && jsonFallback !== "{}") {
    return `<div class="library-preview-fallback" style="white-space:pre-wrap;overflow-wrap:anywhere;text-align:left;">${escapeHtml(jsonFallback)}</div>`;
  }

  return `
    <div class="library-preview-fallback">
      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
      <div class="library-preview-copy">Preview not available for this file type.</div>
    </div>
  `;
}

async function hydrateProtectedAssetPreview({
  previewNode,
  projectName,
  asset,
  escapeHtml,
  showError
}) {
  if (!previewNode || !asset || !requiresProtectedMediaFetch(getAssetPreviewUrl(asset))) {
    return;
  }

  const expectedId = asString(asset.id || asset.asset_id || "");

  try {
    const resolved = await getProtectedAssetObjectUrl(projectName, asset, {
      timeoutMs: 45000
    });
    if (!previewNode.isConnected) {
      return;
    }

    const currentId = previewNode.getAttribute("data-preview-asset-id") || "";
    if (currentId && expectedId && currentId !== expectedId) {
      return;
    }

    if (asset.is_image) {
      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
      return;
    }

    if (asset.is_video) {
      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
    }
  } catch (error) {
    if (!previewNode.isConnected) {
      return;
    }

    const message = error instanceof AccessKeyError
      ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
      : `Preview unavailable: ${error.message || "Could not load this file."}`;

    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;

    if (!(error instanceof AccessKeyError)) {
      showError?.(message);
    }
  }
}

async function hydrateProtectedImageNode({
  node,
  projectName,
  asset,
  className,
  alt,
  fallbackMarkup,
  showError
}) {
  if (!node || !asset) return;

  try {
    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
      timeoutMs: 30000
    }));
    if (!node.isConnected) return;

    const image = document.createElement("img");
    image.className = className;
    image.alt = alt || asset.name || "Asset preview";
    image.src = resolved.objectUrl;
    image.onerror = () => {
      if (!node.isConnected) return;
      node.innerHTML = fallbackMarkup;
    };

    node.innerHTML = "";
    node.appendChild(image);
  } catch (error) {
    if (!node.isConnected) return;
    node.innerHTML = fallbackMarkup;

    if (error instanceof AccessKeyError) {
      return;
    }

    showError?.(`Could not load asset preview: ${error.message || "Unknown error."}`);
  }
}

function protectLibraryInteractiveControls(scope) {
  return;
}

function getWorkspaceAssetItems(assetsData, registry) {
  const candidates = [
    assetsData.assets,
    assetsData.items,
    assetsData.records,
    registry.assets,
    registry.items,
    registry.records
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length) return candidate;
  }

  return [];
}

function buildAiPrompt(projectName, mode, payload = {}) {
  const project = asString(projectName).trim() || "this project";
  if (mode === "classify") {
    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
  }
  if (mode === "missing") {
    const missing = asArray(payload.missing).join(", ") || "none";
    return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;
  }
  const docs = asArray(payload.docs).join(", ") || "no document files selected";
  return `Extract key facts from these library documents for ${project}: ${docs}. Return compliance notes, pricing references, and campaign-usable claims.`;
}

function promptForTextInput(title, initialValue = "") {
  const initial = asString(initialValue);

  if (typeof window !== "undefined" && typeof window.prompt === "function") {
    try {
      return Promise.resolve(window.prompt(title, initial));
    } catch (_) {
      // Fall through to custom modal when prompt is blocked.
    }
  }

  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.45)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";

    const modal = document.createElement("div");
    modal.style.width = "min(480px, 92vw)";
    modal.style.background = "#11141a";
    modal.style.border = "1px solid rgba(255,255,255,0.12)";
    modal.style.borderRadius = "12px";
    modal.style.padding = "16px";
    modal.style.color = "#f3f6fb";

    const heading = document.createElement("div");
    heading.textContent = title || "Enter value";
    heading.style.fontWeight = "600";
    heading.style.marginBottom = "10px";

    const input = document.createElement("input");
    input.type = "text";
    input.value = initial;
    input.style.width = "100%";
    input.style.padding = "10px 12px";
    input.style.borderRadius = "8px";
    input.style.border = "1px solid rgba(255,255,255,0.2)";
    input.style.background = "#0d1016";
    input.style.color = "#f3f6fb";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";
    actions.style.marginTop = "12px";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
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
      if (event.target === overlay) {
        cleanup();
        resolve(null);
      }
    };

    input.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitBtn.click();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelBtn.click();
      }
    };

    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    modal.appendChild(heading);
    modal.appendChild(input);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    input.focus();
    input.select();
  });
}

function bindLibraryWorkspace({
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
}) {
  const resolveActiveProjectName = () => asString(projectName || $("projectSwitcher")?.value || "").trim().toLowerCase();

  const rerender = () => {
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

  const reloadOrRerender = async () => {
    if (typeof reloadProjectData === "function") {
      await reloadProjectData(projectName);
      return;
    }

    rerender();
  };

  const catalog = getAssetCatalog(assetsData);
  const categoryByType = getCategoryByType(categoryReadiness);
  const managedAssets = getManagedMediaAssets(projectName, operations);
  const workspaceAssetItems = getWorkspaceAssetItems(assetsData, registry);
  const workspaceAssetsData = {
    ...assetsData,
    assets: workspaceAssetItems
  };
  const allAssets = [
    ...managedAssets,
    ...normalizeAssets(projectName, workspaceAssetsData, registry, categoryByType, catalog)
  ];
  const requiredGroups = buildRequiredAssetGroups(categoryReadiness);
  const categoryBuckets = buildCategoryBuckets(categoryReadiness);
  const bucketMap = new Map(categoryBuckets.map((item) => [item.key, item]));
  const filteredAssets = getFilteredAssets(allAssets, session, bucketMap);
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / LIBRARY_PAGE_SIZE));
  session.page = Math.min(Math.max(Number(session.page) || 1, 1), totalPages);
  const pageStart = (session.page - 1) * LIBRARY_PAGE_SIZE;
  const paginatedAssets = filteredAssets.slice(pageStart, pageStart + LIBRARY_PAGE_SIZE);
  const pageEnd = Math.min(pageStart + paginatedAssets.length, filteredAssets.length);
  const selectedAssetExists = filteredAssets.some((asset) => asset.id === session.selectedAssetId);
  if (!selectedAssetExists) {
    session.selectedAssetId = filteredAssets[0]?.id || allAssets[0]?.id || "";
  }

  const selectedAsset = filteredAssets.find((asset) => asset.id === session.selectedAssetId)
    || allAssets.find((asset) => asset.id === session.selectedAssetId)
    || null;
  const overview = buildAssetOverview({
    assets: allAssets,
    requiredGroups
  });

  const recentActivity = [...allAssets]
    .filter((asset) => asset.uploaded_at)
    .sort((left, right) => new Date(right.uploaded_at || 0).getTime() - new Date(left.uploaded_at || 0).getTime())
    .slice(0, 6);

  const managedTypeOptions = [...new Set(managedAssets.map((item) => item.asset_type).filter(Boolean))];
  const typeOptions = [
    { value: "all", label: "All types" },
    ...managedTypeOptions.map((type) => ({ value: type, label: titleCase(type) })),
    ...catalog
      .filter((item) => !managedTypeOptions.includes(item.asset_type))
      .map((item) => ({ value: item.asset_type, label: item.display_label || item.label || item.asset_type }))
  ];

  const sourceOptions = [
    { value: "all", label: "All sources" },
    { value: "media-studio", label: "Media Studio" },
    { value: "generated-media", label: "Generated Media" },
    { value: "publishing-ready", label: "Publishing Ready" }
  ];

  const folderCounts = computeFolderCounts(allAssets, session);

  const overviewBox = $("libraryOverviewCards");
  if (overviewBox) {
    overviewBox.innerHTML = `
      <article class="data-card smart-overview-card">
        <span class="data-label">Total assets</span>
        <strong>${escapeHtml(formatCount(overview.totalAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Approved assets</span>
        <strong>${escapeHtml(formatCount(overview.approvedAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Needs review</span>
        <strong>${escapeHtml(formatCount(overview.needsReviewAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Missing required assets</span>
        <strong>${escapeHtml(formatCount(overview.missingRequiredAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Source-of-truth coverage</span>
        <strong>${escapeHtml(`${formatCount(overview.sourceCoverage)}%`)}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Next action</span>
        <strong class="library-overview-next-action">${escapeHtml(overview.nextAction)}</strong>
      </article>
    `;
  }

  const requiredBox = $("libraryRequiredAssetsGrid");
  if (requiredBox) {
    requiredBox.innerHTML = requiredGroups.map((item) => {
      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";

      return `
        <article class="library-required-card">
          <div class="library-required-card-head">
            <h4>${escapeHtml(item.label)}</h4>
            <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
          </div>
          <p>${escapeHtml(item.why)}</p>
          <div class="library-required-card-foot">
            <small>${escapeHtml(`Detected files: ${formatCount(item.totalCount)}`)}</small>
            <button
              class="btn btn-secondary"
              type="button"
              data-library-required-action="${escapeHtml(item.action)}"
              data-library-required-key="${escapeHtml(item.key)}"
              data-library-upload-type="${escapeHtml(item.uploadType)}"
            >${escapeHtml(actionLabel)}</button>
          </div>
        </article>
      `;
    }).join("");
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
      session.selectedType = event.target.value || "all";
      session.page = 1;
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
  }

  const statusSelect = $("libraryFilterStatusSelect");
  if (statusSelect) {
    statusSelect.value = session.selectedStatus;
    statusSelect.onchange = (event) => {
      session.selectedStatus = event.target.value || "all";
      session.page = 1;
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
      session.selectedSource = event.target.value || "all";
      session.page = 1;
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
  }

  const sortSelect = $("librarySortSelect");
  if (sortSelect) {
    sortSelect.value = session.sortBy;
    sortSelect.onchange = (event) => {
      session.sortBy = event.target.value || "updated_desc";
      session.page = 1;
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
  }

  const gridBody = $("libraryAssetGridBody");
  if (gridBody) {
    gridBody.innerHTML = paginatedAssets.length
      ? paginatedAssets.map((asset) => {
        const tone = toStatusTone(asset.status);
        const statusLabel = toStatusLabel(asset.status);
        const pathHint = assetContextHint(asset);
        const assetPreviewUrl = getAssetPreviewUrl(asset);
        const previewNode = asset.is_image && assetPreviewUrl
          ? requiresProtectedMediaFetch(assetPreviewUrl)
            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;

        return `
          <article class="library-grid-card ${session.selectedAssetId === asset.id ? "is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0">
            <div class="library-grid-preview">${previewNode}</div>
            <div class="library-grid-title">${escapeHtml(asset.name)}</div>
            <div class="library-grid-meta">${escapeHtml(asset.filename || "-")}</div>
            <div class="library-grid-meta">${escapeHtml(pathHint)}</div>
            <div class="library-grid-foot">
              <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
            </div>
          </article>
        `;
      }).join("")
      : `<div class="empty-box">No assets match this view. Adjust folder/filter/search.</div>`;
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

        <details class="library-inspector-more">
          <summary>More details</summary>
          <div class="data-stack">
            <div class="data-row"><span>Asset ID</span><strong>${escapeHtml(shortAssetId(selectedAsset.asset_id || selectedAsset.mutation_id || selectedAsset.id || "-"))}</strong></div>
            <div class="data-row"><span>Full Path</span><strong>${escapeHtml(selectedAsset.file_path || "-")}</strong></div>
            <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
            <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
            <div class="data-row"><span>Version</span><strong>${escapeHtml(asString(selectedAsset.version || selectedAsset.asset_version || "-") || "-")}</strong></div>
          </div>
        </details>

        <div class="library-preview-actions">
          ${selectedAsset.preview_url ? `<button class="btn btn-primary" type="button" data-library-open="${escapeHtml(selectedAsset.id)}">Open</button>` : `<button class="btn btn-primary" type="button" disabled>Open</button>`}
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${escapeHtml(selectedAsset.file_path || selectedAsset.preview_url || "")}">Copy Path</button>
          ${selectedAsset.kind === "managed_media"
      ? `<button class="btn btn-secondary" type="button" disabled>${escapeHtml(selectedAsset.source_label || "Managed")}</button>`
      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${escapeHtml(selectedAsset.id)}">${escapeHtml(selectedAsset.source_of_truth ? "Unsource" : "Source")}</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${escapeHtml(selectedAsset.id)}" data-asset-id="${escapeHtml(selectedAsset.mutation_id || selectedAsset.asset_id)}">Approve</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${escapeHtml(selectedAsset.id)}" data-asset-id="${escapeHtml(selectedAsset.mutation_id || selectedAsset.asset_id)}">Review</button>
          <button class="btn btn-secondary" type="button" data-library-rename="${escapeHtml(selectedAsset.id)}" data-asset-id="${escapeHtml(selectedAsset.mutation_id || selectedAsset.asset_id)}">Rename</button>
          <button class="btn btn-secondary" type="button" data-library-delete="${escapeHtml(selectedAsset.id)}" data-asset-id="${escapeHtml(selectedAsset.mutation_id || selectedAsset.asset_id)}">Delete</button>
          <button class="btn btn-secondary" type="button" data-library-archive="${escapeHtml(selectedAsset.id)}" data-asset-id="${escapeHtml(selectedAsset.mutation_id || selectedAsset.asset_id)}">Archive</button>`}
        </div>
      `
      : `<div class="empty-box">Select an asset to view details.</div>`;
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
      : `<div class="empty-box">No recent uploaded or updated assets yet.</div>`;
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
      : `<div class="empty-box">No uploads in this session yet.</div>`;
  }

  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
  requiredActionButtons.forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-library-required-action") || "review";
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";

      if (action === "upload") {
        session.uploadType = uploadType;
        const uploadTypeSelect = $("libraryUploadTypeSelect");
        if (uploadTypeSelect) uploadTypeSelect.value = uploadType;
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
      showMessage?.("AI classification prompt sent.");
    };
  });

  const selectButtons = Array.from(document.querySelectorAll("[data-library-select]"));
  selectButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      session.selectedAssetId = button.getAttribute("data-library-select") || "";
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

      session.selectedAssetId = nextId;
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
      session.selectedAssetId = nextId;
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
      session.selectedAssetId = nextId;
      rerender();
    };

    card.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const nextId = card.getAttribute("data-library-grid-select") || "";
      if (!nextId) return;
      session.selectedAssetId = nextId;
      rerender();
    };
  });

  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
  folderButtons.forEach((button) => {
    button.onclick = () => {
      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
      session.folderKey = folderKey;
      session.page = 1;
      if (folderKey === "archived") {
        session.selectedStatus = "archived";
      }
      rerender();
    };
  });

  const viewToggleButtons = Array.from(document.querySelectorAll("[data-library-view-mode]"));
viewToggleButtons.forEach((button) => {
  button.onclick = () => {
    const mode = button.getAttribute("data-library-view-mode") || "grid";
    session.viewMode = mode === "list" ? "list" : "grid";
    session.page = 1;
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

  const triggerToolbarAction = (selector, message) => {
    const target = document.querySelector(selector);
    if (!target) {
      showError?.(message || "Select an asset first.");
      return;
    }
    target.click();
  };

  const toolbarRename = $("libraryToolbarRenameBtn");
  if (toolbarRename) {
    toolbarRename.onclick = () => triggerToolbarAction("#libraryPreviewMeta [data-library-rename]", "Select an asset to rename.");
  }

  const toolbarDelete = $("libraryToolbarDeleteBtn");
  if (toolbarDelete) {
    toolbarDelete.onclick = () => triggerToolbarAction("#libraryPreviewMeta [data-library-delete]", "Select an asset to delete.");
  }

  const toolbarApprove = $("libraryToolbarApproveBtn");
  if (toolbarApprove) {
    toolbarApprove.onclick = () => triggerToolbarAction("#libraryPreviewMeta [data-asset-status-action='approved']", "Select an asset to approve.");
  }

  const toolbarSource = $("libraryToolbarSourceBtn");
  if (toolbarSource) {
    toolbarSource.onclick = () => triggerToolbarAction("#libraryPreviewMeta [data-library-source-truth]", "Select an asset first.");
  }

  const openButtons = Array.from(document.querySelectorAll("[data-library-open]"));
  openButtons.forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-library-open") || "";
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

      const confirmed = status === "approved" ? true : confirm(`Set this asset status to "${status}"?`);
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

      if (!confirm("Archive this asset?")) {
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

      if (!confirm("Soft-delete this asset? It will be archived in the registry.")) {
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
      event.preventDefault();
      event.stopPropagation();

      const menu = button.closest(".library-action-menu");
      const dropdown = menu?.querySelector(".library-action-dropdown");
      if (!dropdown) return;

      const open = dropdown.classList.contains("is-open");
      closeAllLibraryActionDropdowns();

      if (!open) {
        dropdown.classList.add("is-open");
        dropdown.style.display = "block";
      }
    };
  });

  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
  pickUploadTypeButtons.forEach((button) => {
    button.onclick = () => {
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
      session.uploadType = uploadType;
      const uploadTypeSelect = $("libraryUploadTypeSelect");
      if (uploadTypeSelect) {
        uploadTypeSelect.value = uploadType;
      }
      showMessage?.(`Upload category set to ${uploadType}.`);
    };
  });

  const gridPageButtons = Array.from(document.querySelectorAll("[data-library-grid-page]"));
  gridPageButtons.forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const action = button.getAttribute("data-library-grid-page");
      if (action === "prev") {
        session.page = Math.max(1, (Number(session.page) || 1) - 1);
      } else if (action === "next") {
        session.page = Math.min(totalPages, (Number(session.page) || 1) + 1);
      }

      rerender();
    };
  });

  const searchInput = $("librarySearchInput");
  if (searchInput) {
    searchInput.value = session.searchQuery;
    searchInput.oninput = (event) => {
      session.searchQuery = event.target.value || "";
      session.page = 1;

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
    uploadTypeSelect.value = session.uploadType;
    uploadTypeSelect.onchange = (event) => {
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
        uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload Asset";
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
      if (event.target?.closest?.("#libraryChooseFilesBtn")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      uploadInput.click();
    };

    dropZone.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        uploadInput.click();
      }
    };
    uploadInput.onchange = () => {
  updateUploadUiState();
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

    const chooseFilesBtn = $("libraryChooseFilesBtn");
    if (chooseFilesBtn) {
      chooseFilesBtn.onclick = (event) => {

        event.stopPropagation();

      };
    }

    updateUploadUiState();
  }

  if (uploadBtn) {
    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
    uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload Asset";
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

      let assetType = "";
      try {
        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
      } catch (error) {
        showError?.(error.message || "Invalid upload category.");
        return;
      }

      const uploaded = [];
      const failed = [];
      let reloadedFromServer = false;

      session.uploading = true;
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

      try {
        for (const file of files) {
          try {
            const result = await uploadProjectAsset(activeProjectName, assetType, file);
            uploaded.push({
              filename: result?.filename || file.name,
              asset_type: assetType,
              status: "success",
              created_at: new Date().toISOString()
            });
          } catch (error) {
            failed.push({
              filename: file.name,
              asset_type: assetType,
              status: "failed",
              error: error.message || "Upload failed",
              created_at: new Date().toISOString()
            });
          }
        }

        session.recentUploads = [...uploaded, ...failed, ...session.recentUploads].slice(0, 20);

        if (uploaded.length && typeof reloadProjectData === "function") {
          await reloadProjectData(activeProjectName);
          reloadedFromServer = true;
        }

        const input = $("libraryUploadInput");
        if (input) input.value = "";
        const dropInfo = $("libraryDropInfo");
        if (dropInfo) dropInfo.textContent = "No files selected";
        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
        uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload Asset";

        if (uploaded.length && !failed.length) {
          showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}.`);
        } else if (uploaded.length && failed.length) {
          showError?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}, ${failed.length} failed.`);
        } else {
          showError?.("Upload failed for all selected files.");
        }
      } finally {
        session.uploading = false;
        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
        uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload Asset";
        if (!reloadedFromServer) {
          rerender();
        }
      }
    };
  }

  const refreshBtn = $("libraryRefreshScanBtn");
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      if (!projectName) {
        showError?.("Select a project before refreshing.");
        return;
      }
      refreshBtn.disabled = true;
      try {
        await refreshProjectLibrary(projectName);
        await reloadProjectData?.(projectName);
        showMessage?.("Library scan refreshed.");
      } catch (error) {
        showError?.(error.message || "Failed to refresh library scan.");
      } finally {
        refreshBtn.disabled = false;
      }
    };
  }

  const classifyBtn = $("libraryAiClassifyBtn");
  if (classifyBtn) {
    classifyBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "classify");
      navigateTo("ai-command");
      showMessage?.("AI classification prompt sent.");
    };
  }

  const missingBtn = $("libraryAiMissingBtn");
  if (missingBtn) {
    missingBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "missing", { missing: missingRequiredAssets });
      navigateTo("ai-command");
      showMessage?.("AI missing-assets prompt sent.");
    };
  }

  const extractBtn = $("libraryAiExtractBtn");
  if (extractBtn) {
    extractBtn.onclick = () => {
      const docs = filteredAssets
        .filter((asset) => ["pdf", "doc", "docx", "txt", "md", "csv", "xlsx"].includes(asset.extension))
        .slice(0, 8)
        .map((asset) => asset.name);
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "extract", { docs });
      navigateTo("ai-command");
      showMessage?.("AI document extraction prompt sent.");
    };
  }
}

export const libraryRoute = {
  id: "library",
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
    const root = $("libraryRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="library-smart-shell">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Asset Control System</div>
              <h3>${escapeHtml(projectName ? `${projectName} Asset Overview` : "Asset Overview")}</h3>
            </div>
            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh</button>
          </div>
          <div id="libraryOverviewCards" class="library-overview-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Required Assets / Readiness Gaps</h3>
            <span class="card-badge warning">Action required where missing</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Asset Actions</h3>
            <div class="library-action-toolbar">
              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
              <button id="libraryAiExtractBtn" class="btn btn-secondary" type="button">Extract Docs</button>
            </div>
          </div>
          <div class="library-upload-grid">
            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
              <strong>Upload Assets</strong>
              <span>Drop files here or click to browse</span>
              <small id="libraryDropInfo">No files selected</small>
              <label id="libraryChooseFilesBtn" class="btn btn-secondary btn-sm" for="libraryUploadInput">Choose Files</label>
              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
            </div>
            <div class="library-upload-controls">
              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                ${getAssetCatalog(assetsData).map((item) => `
                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
                `).join("")}
              </select>
              <div class="setup-helper">Upload, classify, and route into review and source-of-truth decisions.</div>
              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload Asset</button>
            </div>
          </div>
          <div id="libraryUploadSummary" style="margin-top: 12px;"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Asset Workspace</h3>
            <span class="card-badge neutral">Finder Grid + Inspector</span>
          </div>
          <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
            <div class="library-workspace-main">
              <div class="library-finder-topbar">
                <div class="library-finder-sidebar-title">Folders</div>
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
                <button id="libraryToolbarUploadBtn" class="btn btn-secondary" type="button">Upload</button>
                <button id="libraryToolbarRenameBtn" class="btn btn-secondary" type="button">Rename</button>
                <button id="libraryToolbarApproveBtn" class="btn btn-secondary" type="button">Approve</button>
                <button id="libraryToolbarSourceBtn" class="btn btn-secondary" type="button">Source of Truth</button>
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
              <section class="card library-preview-card">
                <div class="card-head">
                  <h3>Asset Detail</h3>
                  <span class="card-badge neutral">Preview + Actions</span>
                </div>
                <div id="libraryPreviewVisual"></div>
                <div id="libraryPreviewMeta" style="margin-top: 12px;"></div>
              </section>
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
  }
};
