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
    source_of_truth: asset.source_of_truth,
    text_preview: (asset.text_preview || asset.notes || "").slice(0, 1200),
    selected_at: new Date().toISOString()
  };
}

// --- Library Source Bridge Guide Box ---
// This must be run inside the render() function, after projectName is defined.

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
  reclassifyProjectAsset,
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
const LIBRARY_UPLOAD_TYPE_LABELS = {
  logo: "Logo",
  brand_guideline: "Brand Guidelines",
  product_csv: "Product Data",
  pricing_doc: "Pricing & Offers",
  legal_doc: "Legal Documents",
  product_photos: "Product Photos",
  product_videos: "Product Videos",
  social_assets: "Social Assets",
  campaign_assets: "Campaign Assets",
  packaging_images: "Packaging Images",
  testimonials_reviews: "Testimonials & Reviews",
  certificates: "Certificates",
  partner_docs: "Partner Documents"
};

function getLibraryUploadTypeLabel(assetType = "") {
  const key = String(assetType || "").trim().toLowerCase();
  return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
}

const libraryProtectedUrlCache = new Map();
const LIBRARY_PAGE_SIZE = 10;
const libraryProtectedUrlPromiseCache = new Map();
let disposeLibraryGlobalListeners = null;
let _libraryFeedback = null;
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
  { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
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

function truncateMiddle(value = "", maxLength = 44) {
  const text = asString(value).trim();
  if (!text || text.length <= maxLength) return text || "-";
  const keep = Math.max(6, Math.floor((maxLength - 3) / 2));
  return `${text.slice(0, keep)}...${text.slice(-keep)}`;
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
          const button = event.target.closest?.("[data-copy-asset-path]");
          if (!button || !button.closest(".library-workspace")) return;

          event.preventDefault();

          const value = button.getAttribute("data-copy-asset-path") || "";
          if (!value) return;

          try {
            await navigator.clipboard.writeText(value);
            _libraryFeedback?.("Asset path copied.");
          } catch {
            window.prompt("Copy asset path:", value);
          }
        },
        (event) => {
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
        },
        (event) => {
          const root = event.target?.closest?.(".library-workspace");
          if (!root) return;

          if (event.target?.closest?.(".library-action-menu")) {
            return;
          }

          closeAllLibraryActionDropdowns();
        }
      ]
    }
  });
}

function unmountLibraryGlobalListeners() {
  if (!disposeLibraryGlobalListeners) {
    return;
  }

  const dispose = disposeLibraryGlobalListeners;
  disposeLibraryGlobalListeners = null;
  dispose();
}


function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, normalizeLibrarySession({
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
    }));
  }

  const current = librarySessionStore.get(key);
  const normalized = normalizeLibrarySession(current);
  if (current !== normalized) {
    librarySessionStore.set(key, normalized);
  }
  return librarySessionStore.get(key);
}

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

    const projectionAsset = normalizeLibraryAsset({
      ...merged,
      status,
      source_of_truth: Boolean(merged.source_of_truth || merged.is_source_of_truth)
    });

    return {
      ...projectionAsset,
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

function getPreviewExtensionForAsset(asset = {}) {
  return getFileExtension(
    asset.extension ||
    asset.filename ||
    asset.file_name ||
    asset.file_path ||
    asset.preview_url ||
    asset.name ||
    ""
  );
}

function isDocumentExtension(extension = "") {
  return ["pdf", "doc", "docx", "txt", "md", "csv", "xls", "xlsx"].includes(asString(extension).toLowerCase());
}

function toDocumentPreviewLabel(extension = "") {
  const value = asString(extension).toLowerCase();
  if (value === "pdf") return "PDF Document";
  if (value === "csv") return "CSV Spreadsheet";
  if (value === "xls" || value === "xlsx") return "Excel Spreadsheet";
  if (value === "doc" || value === "docx") return "Word Document";
  if (value === "txt" || value === "md") return "Text Document";
  return "Document";
}

function canAttemptDocumentPreview(asset = {}) {
  return Boolean(
    getAssetPreviewUrl(asset) ||
    asset.file_path ||
    asset.local_path ||
    asset.path ||
    asset.preview_url ||
    asset.public_url ||
    asset.url
  );
}

function renderPreview(asset, escapeHtml) {
  if (!asset) {
    return `<div class="empty-box">Select an asset to preview details, open files, copy paths, or prepare review actions.</div>`;
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
        <audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
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

  const previewExtension = getPreviewExtensionForAsset(asset);

  if (isDocumentExtension(previewExtension)) {
    const previewUrl = getAssetPreviewUrl(asset);
    const label = toDocumentPreviewLabel(previewExtension);
    const isPdf = previewExtension === "pdf";
    const openButton = previewUrl
      ? `<button class="btn btn-primary" type="button" data-library-open="${escapeHtml(asset.id)}">Open document</button>`
      : `<button class="btn btn-primary" type="button" disabled>Open document</button>`;

    if (isPdf && previewUrl && !requiresProtectedMediaFetch(previewUrl)) {
      return `
        <div class="library-pdf-preview">
          <iframe src="${escapeHtml(previewUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
        </div>
      `;
    }

    if (isPdf && canAttemptDocumentPreview(asset)) {
      return `
        <div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
          <div class="library-preview-extension">PDF</div>
          <strong>${escapeHtml(label)}</strong>
          <div class="library-preview-copy">Loading protected PDF preview...</div>
        </div>
      `;
    }

    return `
      <div class="library-preview-fallback library-document-preview">
        <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
        <strong>${escapeHtml(label)}</strong>
        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
        <div class="library-document-preview-actions">
          ${openButton}
          <button class="btn btn-secondary" type="button" id="libraryAiExtractSelectedDocBtn">Extract with AI</button>
        </div>
      </div>
    `;
  }


  if (asset.text_preview) {
    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
  }

  const jsonFallback = JSON.stringify(asset.json_preview || asset.media_payload || {}, null, 2);
  if (jsonFallback && jsonFallback !== "{}") {
    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
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
  if (!previewNode || !asset) {
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
      return;
    }

    if (getPreviewExtensionForAsset(asset) === "pdf") {
      previewNode.outerHTML = `
        <div class="library-pdf-preview">
          <iframe src="${escapeHtml(resolved.objectUrl)}" title="${escapeHtml(asset.name || "PDF preview")}"></iframe>
        </div>
      `;
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

function getLibraryScrollContainer(target) {
  if (!target || typeof document === "undefined") return null;

  const preferred = document.getElementById("workspace");
  if (preferred && typeof preferred.scrollTo === "function") {
    return preferred;
  }

  let node = target.parentElement;
  while (node && node !== document.body) {
    const style = window.getComputedStyle ? window.getComputedStyle(node) : null;
    const overflow = style ? `${style.overflow} ${style.overflowY} ${style.overflowX}` : "";
    if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight && typeof node.scrollTo === "function") {
      return node;
    }
    node = node.parentElement;
  }

  return document.scrollingElement || document.documentElement || document.body;
}

function scrollLibraryTargetIntoView(target, highlightClass = "is-required-action-target") {
  if (!target || typeof document === "undefined") return;

  target.classList.add(highlightClass);

  const scroller = getLibraryScrollContainer(target);
  const prefersReducedMotion = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersReducedMotion ? "auto" : "smooth";

  if (scroller && scroller !== document.body && scroller !== document.documentElement) {
    const scrollerRect = scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = Number(scroller.scrollTop || 0) + targetRect.top - scrollerRect.top - 18;

    scroller.scrollTo({
      top: Math.max(0, targetTop),
      behavior
    });
  } else if (typeof target.scrollIntoView === "function") {
    target.scrollIntoView({ behavior, block: "start" });
  }

  setTimeout(() => target.classList.remove(highlightClass), 2600);
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
  _libraryFeedback = showMessage;


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
  const missingRequiredGroupCount = requiredGroups.filter((item) => item.status === "missing").length;
  const readinessSummary = {
    totalAssets: allAssets.length,
    requiredCount: requiredGroups.length,
    missingCount: missingRequiredGroupCount,
    needsReviewCount: requiredGroups.filter((item) => item.status === "needs_review").length,
    readinessScore: requiredGroups.length
      ? Math.round(((requiredGroups.length - missingRequiredGroupCount) / requiredGroups.length) * 100)
      : 100
  };

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

  // --- Library Explainer/Onboarding Block ---
  const explainerBox = $("libraryExplainerBox");
  if (explainerBox) {
    explainerBox.innerHTML = `
      <section class="library-explainer" aria-label="Library source-of-truth workspace explainer">
        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
        <ol class="library-explainer-steps">
          <li>Upload or select an asset.</li>
          <li>Mark important files as <span class="explainer-chip">Source of Truth</span> when needed.</li>
          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
        </ol>
      </section>
    `;
  }

  // --- Taxonomy Chips/Cards ---
  const taxonomyBox = $("libraryTaxonomyBox");
  if (taxonomyBox) {
    taxonomyBox.innerHTML = `
      <div class="library-taxonomy-chips" aria-label="Library taxonomy">
        <span class="taxonomy-chip" tabindex="0">Images</span>
        <span class="taxonomy-chip" tabindex="0">Videos</span>
        <span class="taxonomy-chip" tabindex="0">Documents</span>
        <span class="taxonomy-chip" tabindex="0">Brand Assets</span>
        <span class="taxonomy-chip" tabindex="0">Product Files</span>
        <span class="taxonomy-chip" tabindex="0">Proof / Legal / Pricing</span>
        <span class="taxonomy-chip" tabindex="0">Generated Assets</span>
        <span class="taxonomy-chip source-of-truth" tabindex="0">Source of Truth</span>
      </div>
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
            <small>${escapeHtml(`Files found: ${formatCount(item.totalCount)}`)}</small>
            <button
              class="btn btn-secondary btn-sm"
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
      dispatchLibraryCommand("set-filter", {
        filter: "status",
        value: event.target.value || "all"
      }, {
        "set-filter": ({ value }) => {
          session.selectedStatus = value;
          session.page = 1;
        }
      });
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
      dispatchLibraryCommand("set-filter", {
        filter: "sort",
        value: event.target.value || "updated_desc"
      }, {
        "set-filter": ({ value }) => {
          session.sortBy = value;
          session.page = 1;
        }
      });
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
        const fileName = truncateMiddle(asset.filename || basename(asset.file_path || "") || "-");
        const titleName = truncateMiddle(asset.name, 52);
        const assetPreviewUrl = getAssetPreviewUrl(asset);
        const previewNode = asset.is_image && assetPreviewUrl
          ? requiresProtectedMediaFetch(assetPreviewUrl)
            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;
        // Add selected state and aria-selected
        const isSelected = session.selectedAssetId === asset.id;
        return `
          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
            <div class="library-grid-preview">${previewNode}</div>
            <div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>
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

        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Review Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Review Source in AI Command</button>

        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
          <span class="library-inspector-ai-source-guide-text">Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.</span>
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
      useBtn.textContent = "Use as Review Source in AI Command";
      useBtn.setAttribute("aria-label", "Use as Review Source in AI Command");
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
      : `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;
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
        const isReviewAction = action === "review";
        session.folderKey = mappedFolder.key;
        session.selectedType = isReviewAction ? "all" : uploadType;
        session.selectedStatus = isReviewAction ? "active" : session.selectedStatus;
        session.selectedSource = isReviewAction ? "all" : session.selectedSource;
        session.searchQuery = isReviewAction ? "" : session.searchQuery;
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

        const uploadLabel = getLibraryUploadTypeLabel(uploadType);

        if (isReviewAction) {
          showMessage?.(`Showing ${mappedFolder.label} assets. Select a file, then use the action panel.`);
          setTimeout(() => {
            const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
            scrollLibraryTargetIntoView(assetWorkspace);
          }, 120);
          return;
        }

        showMessage?.(`Upload category set to ${uploadLabel}. Choose files, then upload them to this asset group.`);
        setTimeout(() => {
          const assetIntake = document.querySelector(".library-actions-card") || document.getElementById("libraryDropZone");
          const dropZone = document.getElementById("libraryDropZone");
          scrollLibraryTargetIntoView(assetIntake);
          if (dropZone && dropZone !== assetIntake) {
            dropZone.classList.add("is-required-action-target");
            setTimeout(() => dropZone.classList.remove("is-required-action-target"), 2600);
          }
        }, 120);
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

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
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

  const reclassifyButtons = Array.from(document.querySelectorAll("[data-library-reclassify]"));
  reclassifyButtons.forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-library-reclassify") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const currentType = String(button.getAttribute("data-current-asset-type") || "").trim().toLowerCase();

      if (!assetId) {
        showError?.("This asset cannot be reclassified because it is not linked to the project registry.");
        return;
      }

      const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);
      const nextType = window.prompt(
        `Reclassify asset type. Current type: ${currentType || "unknown"}\n\nAllowed types:\n${allowedTypes.join(", ")}`,
        currentType || "logo"
      );

      if (nextType === null) {
        return;
      }

      const normalizedType = String(nextType || "").trim().toLowerCase();
      if (!normalizedType) {
        showError?.("Missing asset type.");
        return;
      }

      if (!allowedTypes.includes(normalizedType)) {
        showError?.(`Invalid asset type. Allowed: ${allowedTypes.join(", ")}`);
        return;
      }

      const selectedAsset = allAssets.find((asset) => asset.id === id || asset.asset_id === assetId || asset.mutation_id === assetId);
      const assetLabel = selectedAsset?.name || selectedAsset?.filename || assetId;
      const confirmed = window.confirm(
        `Reclassify "${assetLabel}" from ${currentType || "unknown"} to ${normalizedType}?\n\nThis updates metadata only. It will not move or rename the physical file.`
      );

      if (!confirmed) {
        return;
      }

      try {
        showMessage?.(`Reclassifying asset as ${getLibraryUploadTypeLabel(normalizedType)}...`);
        await reclassifyProjectAsset(
          activeProjectName,
          assetId,
          normalizedType,
          `Reclassified from Library action panel to ${normalizedType}.`
        );

        session.selectedType = normalizedType;
        session.folderKey = "all_assets";
        session.page = 1;

        await reloadProjectData?.();
        showMessage?.(`Asset reclassified as ${getLibraryUploadTypeLabel(normalizedType)}.`);
        return;
      } catch (error) {
        if (error instanceof AccessKeyError) {
          showError?.("Reclassify requires a valid Control Center write key.");
          return;
        }
        showError?.(error?.message || "Failed to reclassify asset.");
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

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry. This does not delete the physical file.\n\nSelect Cancel to keep this asset active.`)) {
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

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows. This action does not silently publish, approve, or run workflows.\n\nSelect Cancel to keep this asset available.`)) {
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
      const nextPage = action === "prev"
        ? Math.max(1, (Number(session.page) || 1) - 1)
        : action === "next"
          ? Math.min(totalPages, (Number(session.page) || 1) + 1)
          : Number(session.page) || 1;

      dispatchLibraryCommand("set-page", { page: nextPage }, {
        "set-page": ({ page }) => {
          session.page = page;
        }
      });

      rerender();
    };
  });

  const searchInput = $("librarySearchInput");
  if (searchInput) {
    searchInput.value = session.searchQuery;
    searchInput.oninput = (event) => {
      dispatchLibraryCommand("set-filter", {
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
        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";

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
        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
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
        showMessage?.("Library backend scan refreshed.");
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
      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
    };
  }

  const missingBtn = $("libraryAiMissingBtn");
  if (missingBtn) {
    missingBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "missing", { missing: missingRequiredAssets });
      navigateTo("ai-command");
      showMessage?.("Missing asset review prepared. The system will focus on required categories that still need attention.");
    };
  }

  const extractSelectedDocBtn = $("libraryAiExtractSelectedDocBtn");
  if (extractSelectedDocBtn) {
    extractSelectedDocBtn.onclick = () => {
      if (!selectedAsset) {
        showError?.("Select a document asset first.");
        return;
      }

      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "extract", { docs: [selectedAsset.name] });
      navigateTo("ai-command");
      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
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
            "Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.",
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
              <div class="setup-kicker">Asset Source Command</div>
              <h3>${escapeHtml(projectName ? `${projectName} Asset Library` : "Asset Library")}</h3>
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
            <h3>Required Asset Evidence</h3>
            <p class="card-subtitle">Track the source files, product data, media, and proof needed for campaign readiness. Review here does not approve, publish, or change asset truth automatically.</p>
            <span class="card-badge warning">Readiness gaps</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card library-actions-card">
          <div class="card-head">
            <h3>Asset Intake</h3>
            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
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
            <span class="card-badge neutral">Inspect, filter, and route trusted assets</span>
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
                    <h3>Selected Asset Preview</h3>
                    <p class="card-subtitle">Preview selected evidence or media. Protected files are loaded through the protected media endpoint without changing asset status.</p>
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
