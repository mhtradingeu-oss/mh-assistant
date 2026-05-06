import { refreshProjectLibrary, uploadProjectAsset } from "../api.js";
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
  const fileName = basename(asset.file_path || asset.filename || "");
  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  if (!fileName || !assetType) return "";
  return `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
}

function getStoredControlCenterAccessKey() {
  const directKeys = [
    "mh_control_key",
    "mh_control_center_key",
    "MH_CONTROL_CENTER_KEY",
    "control_center_key",
    "mhControlKey",
    "mh_access_key",
    "controlCenterAccessKey"
  ];

  for (const key of directKeys) {
    const value = localStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index) || "";
    const normalized = key.toLowerCase();
    if (
      normalized.includes("control") ||
      normalized.includes("access") ||
      normalized.includes("mh_") ||
      normalized.includes("key")
    ) {
      const value = localStorage.getItem(key);
      if (value && value.trim() && value.trim().length >= 8) {
        return value.trim();
      }
    }
  }

  return "";
}

async function openProtectedLibraryFile(fileUrl, filename) {
  const accessKey = getStoredControlCenterAccessKey();

  if (!accessKey) {
    alert("Missing Control Center access key. Click Control Center Access, paste the key, then Save Key.");
    return;
  }

  let response;
  try {
    response = await fetch(fileUrl, {
      headers: {
        "x-mh-control-key": accessKey
      }
    });
  } catch (error) {
    alert(`Could not open file: ${error.message}`);
    return;
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    alert(`Could not open file: ${response.status} ${message}`);
    return;
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const contentType = response.headers.get("content-type") || "";
  const safeFilename = filename || "download";

  if (
    contentType.startsWith("image/") ||
    contentType.startsWith("video/") ||
    contentType.includes("pdf") ||
    /\.(png|jpg|jpeg|webp|gif|svg|avif|mp4|mov|webm|m4v|pdf)$/i.test(safeFilename)
  ) {
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}


async function updateLibraryAssetStatus(assetId, status, projectName) {
  const accessKey = getStoredControlCenterAccessKey();

  if (!accessKey) {
    alert("Missing Control Center access key. Click Control Center Access, paste the key, then Save Key.");
    return;
  }

  if (!assetId) {
    alert("Missing asset id.");
    return;
  }

  if (!projectName) {
    alert("Select a project before updating asset status.");
    return;
  }

  const confirmed = status === "approved"
    ? true
    : confirm(`Set this asset status to "${status}"?`);

  if (!confirmed) return;

  let response;
  try {
    response = await fetch(
      `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mh-control-key": accessKey
        },
        body: JSON.stringify({
          status,
          note: `Status changed to ${status} from Control Center Library.`
        })
      }
    );
  } catch (error) {
    alert(`Could not update asset status: ${error.message}`);
    return;
  }

  const payloadText = await response.text();
  let payload = {};
  try {
    payload = payloadText ? JSON.parse(payloadText) : {};
  } catch {
    payload = { raw: payloadText };
  }

  if (!response.ok || !payload.ok) {
    alert(`Could not update asset status: ${response.status} ${payload.error || payloadText}`);
    return;
  }

  const row = document.querySelector(`[data-asset-row-id="${CSS.escape(assetId)}"]`);
  if (row) {
    row.dataset.assetStatus = status;
    const badge = row.querySelector("[data-asset-status-badge]");
    if (badge) {
      badge.textContent = status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
      badge.className = `card-badge ${status === "approved" ? "success" : status === "rejected" ? "danger" : status === "archived" ? "muted" : status === "uploaded" ? "neutral" : "warning"}`;
    }
  }

  alert(`Asset status updated to: ${status}`);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-asset-status-action]");
  if (!button) return;

  event.preventDefault();

  updateLibraryAssetStatus(
    button.getAttribute("data-asset-id") || "",
    button.getAttribute("data-asset-status-action") || "needs_review",
    button.getAttribute("data-asset-project") || ""
  );
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("[data-copy-asset-path]");
  if (!button) return;

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
  if (!link) return;

  const fileUrl = link.getAttribute("href") || "";
  if (!fileUrl.includes("/media/file/")) return;

  event.preventDefault();

  const filename = decodeURIComponent(fileUrl.split("/").pop() || "download");
  openProtectedLibraryFile(fileUrl, filename);
});

function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, {
      selectedCategoryKey: "all",
      selectedAssetId: "",
      searchQuery: "",
      selectedType: "all",
      selectedStatus: "all",
      selectedSource: "all",
      sortBy: "updated_desc",
      uploadType: "logo",
      uploading: false,
      recentUploads: []
    });
  }
  return librarySessionStore.get(key);
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

  const registryByPath = new Map();
  const registryByName = new Map();
  asArray(legacyRegistry?.assets).forEach((item) => {
    const localPath = asString(item.local_path || item.file_path).trim();
    const fileName = basename(localPath || item.filename || "");
    if (localPath) registryByPath.set(localPath, item);
    if (fileName) registryByName.set(fileName, item);
  });

  return asArray(assetsData?.assets).map((asset, index) => {
    const canonicalType = getCanonicalAssetType(asset.asset_type, catalog);
    const filePath = asString(asset.file_path).trim();
    const fileName = basename(filePath || asset.file_name || asset.filename || "");
    const extension = getFileExtension(fileName);
    const category = categoryByType.get(canonicalType) || {};
    const catalogItem = catalogMap.get(canonicalType) || {};
    const legacy = registryByPath.get(filePath) || registryByName.get(fileName) || null;
    const usedIn = asArray(category.guidance?.used_in).length
      ? asArray(category.guidance?.used_in)
      : asArray(catalogItem.guidance?.used_in);

    return {
      id: asset.asset_id || asset.id || `asset-${index}`,
      asset_id: asset.asset_id || asset.id || `asset-${index}`,
      name: fileName || asString(asset.file_name || "Asset"),
      file_path: filePath,
      asset_type: canonicalType || asString(asset.asset_type || "asset"),
      category_label: asString(category.display_label || category.label || catalogItem.display_label || catalogItem.label || canonicalType || asset.asset_type || "Asset"),
      category_status: asString(category.status || "Uploaded"),
      status: normalizeReadinessStatus(asset.readiness_status || asset.review_status || asset.approval_status || asset.status || category.status || "uploaded"),
      exists: asset.exists !== false,
      source_of_truth: Boolean(asset.source_of_truth || asset.use_as_source_of_truth || legacy?.use_as_source_of_truth),
      used_in: usedIn,
      uploaded_at: asset.created_at || asset.updated_at || null,
      preview_url: buildPreviewUrl(projectName, asset),
      extension,
      is_image: isImageExtension(extension),
      is_video: isVideoExtension(extension)
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
  const selectedCategoryKey = session.selectedCategoryKey || "all";
  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
  const selectedType = session.selectedType || "all";
  const selectedStatus = session.selectedStatus || "all";
  const selectedSource = session.selectedSource || "all";
  const sortBy = session.sortBy || "updated_desc";
  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
  const searchValue = asString(session.searchQuery).trim();
  const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;

  const filtered = allAssets.filter((asset) => {
    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
    const matchesStatus = selectedStatus === "all" || asset.status === selectedStatus;
    const matchesSource = selectedSource === "all"
      || (selectedSource === "media-studio" && asset.kind === "managed_media")
      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
    const matchesSearch = !searchRegex || searchRegex.test(haystack);
    return matchesBucket && matchesType && matchesStatus && matchesSource && matchesSearch;
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

function renderPreview(asset, escapeHtml) {
  if (!asset) {
    return `<div class="empty-box">Select an asset to preview.</div>`;
  }

  if (asset.is_image && asset.image_url) {
    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(asset.image_url)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">
      </div>
    `;
  }

  if (asset.is_video && asset.video_url) {
    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(asset.video_url)}"></video>
      </div>
    `;
  }

  if (asset.is_audio && asset.audio_url) {
    return `
      <div class="library-preview-frame">
        <audio style="width:100%;max-width:100%;" controls src="${escapeHtml(asset.audio_url)}"></audio>
      </div>
    `;
  }

  if (asset.is_image && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(asset.preview_url)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">
      </div>
    `;
  }

  if (asset.is_video && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(asset.preview_url)}"></video>
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
  const catalog = getAssetCatalog(assetsData);
  const categoryByType = getCategoryByType(categoryReadiness);
  const managedAssets = getManagedMediaAssets(projectName, operations);
  const allAssets = [
    ...managedAssets,
    ...normalizeAssets(projectName, assetsData, registry, categoryByType, catalog)
  ];
  const requiredGroups = buildRequiredAssetGroups(categoryReadiness);
  const categoryBuckets = buildCategoryBuckets(categoryReadiness);
  const bucketMap = new Map(categoryBuckets.map((item) => [item.key, item]));
  const filteredAssets = getFilteredAssets(allAssets, session, bucketMap);
  const selectedAssetExists = filteredAssets.some((asset) => asset.id === session.selectedAssetId);
  if (!selectedAssetExists) {
    session.selectedAssetId = filteredAssets[0]?.id || allAssets[0]?.id || "";
  }

  const selectedAsset = allAssets.find((asset) => asset.id === session.selectedAssetId) || null;
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
    typeSelect.onchange = (event) => {
      session.selectedType = event.target.value || "all";
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
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
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
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
    sourceSelect.onchange = (event) => {
      session.selectedSource = event.target.value || "all";
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
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
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

  const tableBody = $("libraryAssetTableBody");
  if (tableBody) {
    tableBody.innerHTML = filteredAssets.length
      ? filteredAssets.map((asset) => {
        const tone = toStatusTone(asset.status);
        const statusLabel = toStatusLabel(asset.status);
        return `
          <tr class="${session.selectedAssetId === asset.id ? "is-active" : ""}" data-asset-row-id="${escapeHtml(asset.asset_id)}" data-asset-status="${escapeHtml(asset.status)}">
            <td>${escapeHtml(asset.name)}</td>
            <td>
              <div>${escapeHtml(asset.category_label)}</div>
              <small class="library-table-type">${escapeHtml(asset.asset_type)}</small>
            </td>
            <td><span class="card-badge ${tone}" data-asset-status-badge>${escapeHtml(statusLabel)}</span></td>
            <td><span class="card-badge ${asset.source_of_truth ? "success" : "neutral"}">${escapeHtml(asset.source_of_truth ? "Yes" : "No")}</span></td>
            <td>${escapeHtml(asset.used_in.join(", ") || "Library")}</td>
            <td>
              <div class="library-table-actions">
                <button class="btn btn-secondary" type="button" data-library-select="${escapeHtml(asset.id)}">Select</button>
                <div class="library-actions">
                  ${asset.preview_url ? `<a class="btn btn-primary btn-sm library-link-btn" href="${escapeHtml(asset.preview_url)}" target="_blank" rel="noreferrer">Open</a>` : `<button class="btn btn-primary btn-sm" type="button" disabled>Open</button>`}
                  ${asset.kind === "managed_media"
      ? `<button class="btn btn-secondary btn-sm" type="button" disabled>${escapeHtml(asset.source_label || "Managed")}</button>`
      : `<button class="btn btn-secondary btn-sm" type="button" data-library-source-truth="${escapeHtml(asset.id)}">${escapeHtml(asset.source_of_truth ? "Source" : "Set SoT")}</button>
                    <div class="library-action-menu">
                      <button class="btn btn-secondary btn-sm library-action-toggle" type="button">Actions ▾</button>
                      <div class="library-action-dropdown">
                        <button type="button" data-asset-status-action="approved" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Approve</button>
                        <button type="button" data-asset-status-action="needs_review" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Needs Review</button>
                        <button type="button" data-asset-status-action="rejected" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Reject</button>
                        <button type="button" data-asset-status-action="archived" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Archive</button>
                      </div>
                    </div>`}
                  <button class="btn btn-secondary btn-sm" type="button" data-copy-asset-path="${escapeHtml(asset.file_path || asset.local_path || asset.preview_url || "")}">Copy Path</button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("")
      : `<tr><td colspan="6"><div class="empty-box">No assets match this view. Adjust type/status filters or search.</div></td></tr>`;
  }

  const previewVisual = $("libraryPreviewVisual");
  if (previewVisual) {
    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
  }

  const previewMeta = $("libraryPreviewMeta");
  if (previewMeta) {
    previewMeta.innerHTML = selectedAsset
      ? `
        <div class="data-stack">
          <div class="data-row"><span>Name</span><strong>${escapeHtml(selectedAsset.name)}</strong></div>
          <div class="data-row"><span>Type</span><strong>${escapeHtml(selectedAsset.asset_type)}</strong></div>
          <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
          <div class="data-row"><span>Status</span><strong>${escapeHtml(toStatusLabel(selectedAsset.status))}</strong></div>
          <div class="data-row"><span>Source of truth</span><strong>${escapeHtml(selectedAsset.source_of_truth ? "Yes" : "No")}</strong></div>
          <div class="data-row"><span>Version</span><strong>${escapeHtml(selectedAsset.version_id || "-")}</strong></div>
          <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
          <div class="data-row"><span>Path</span><strong>${escapeHtml(selectedAsset.file_path || "-")}</strong></div>
        </div>
        <div class="library-preview-actions">
          ${selectedAsset.preview_url ? `<a class="btn btn-primary library-link-btn" href="${escapeHtml(selectedAsset.preview_url)}" target="_blank" rel="noreferrer">Open Asset</a>` : `<button class="btn btn-primary" type="button" disabled>Open Asset</button>`}
          <button class="btn btn-secondary" type="button" data-copy-asset-path="${escapeHtml(selectedAsset.file_path || selectedAsset.preview_url || "")}">Copy Path</button>
          ${selectedAsset.kind === "managed_media"
      ? `<button class="btn btn-secondary" type="button" disabled>${escapeHtml(selectedAsset.source_label || "Managed media")}</button>`
      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${escapeHtml(selectedAsset.id)}">${escapeHtml(selectedAsset.source_of_truth ? "Source of Truth" : "Set as Source of Truth")}</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-asset-id="${escapeHtml(selectedAsset.asset_id)}" data-asset-project="${escapeHtml(projectName)}">Approve</button>
          <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-asset-id="${escapeHtml(selectedAsset.asset_id)}" data-asset-project="${escapeHtml(projectName)}">Needs Review</button>`}
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
    button.onclick = () => {
      session.selectedAssetId = button.getAttribute("data-library-select") || "";
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
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

  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
  sourceOfTruthButtons.forEach((button) => {
    button.onclick = () => {
      const assetId = button.getAttribute("data-library-source-truth") || "";
      const asset = allAssets.find((item) => item.id === assetId);
      const input = $("quickCommandInput");
      if (input) {
        input.value = `For ${projectName || "this project"}, set ${asset?.name || "the selected asset"} as source-of-truth if valid and explain any risks before approval.`;
      }
      navigateTo("ai-command");
      showMessage?.("Source-of-truth action routed to AI Command.");
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

  const keepLibraryControlFocused = (event) => {
    const control = event.target?.closest?.(
      "#librarySearchInput, #libraryUploadTypeSelect, #libraryFilterTypeSelect, #libraryFilterStatusSelect, #libraryFilterSourceSelect, #librarySortSelect"
    );

    if (!control) return;

    event.stopPropagation();

    window.setTimeout(() => {
      if (document.activeElement !== control && typeof control.focus === "function") {
        control.focus();
      }
    }, 0);
  };

  ["click", "mouseup", "pointerup"].forEach((eventName) => {
    const root = $("libraryRoot");
    if (root) {
      root.addEventListener(eventName, keepLibraryControlFocused);
    }
  });

  const searchInput = $("librarySearchInput");
  if (searchInput) {
    searchInput.value = session.searchQuery;
    searchInput.oninput = (event) => {
      const input = event.target;
      session.searchQuery = input.value || "";

      const selectionStart = typeof input.selectionStart === "number" ? input.selectionStart : session.searchQuery.length;
      const selectionEnd = typeof input.selectionEnd === "number" ? input.selectionEnd : selectionStart;

      if (librarySearchRenderTimer) {
        window.clearTimeout(librarySearchRenderTimer);
      }

      librarySearchRenderTimer = window.setTimeout(() => {
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          registry,
          categoryReadiness,
          missingRequiredAssets,
          navigateTo,
          reloadProjectData,
          showMessage,
          showError,
          escapeHtml
        });

        window.setTimeout(() => {
          const nextInput = $("librarySearchInput");
          if (nextInput && typeof nextInput.focus === "function") {
            nextInput.focus();

            if (typeof nextInput.setSelectionRange === "function") {
              const safeStart = Math.min(selectionStart, nextInput.value.length);
              const safeEnd = Math.min(selectionEnd, nextInput.value.length);
              nextInput.setSelectionRange(safeStart, safeEnd);
            }
          }
        }, 0);
      }, 650);
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
  if (dropZone && uploadInput) {
    const syncDroppedFilesToInput = (files) => {
      try {
        const transfer = new DataTransfer();
        files.forEach((file) => transfer.items.add(file));
        uploadInput.files = transfer.files;
      } catch (_) {
        // Browser may block synthetic file assignment.
      }
      const names = files.slice(0, 6).map((file) => file.name).join(", ");
      const suffix = files.length > 6 ? ` +${files.length - 6} more` : "";
      const message = files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected: ${names}${suffix}` : "No files selected";
      const info = $("libraryDropInfo");
      if (info) info.textContent = message;
    };

    dropZone.onclick = () => uploadInput.click();
    uploadInput.onchange = () => {
      const files = Array.from(uploadInput.files || []);
      syncDroppedFilesToInput(files);
    };

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
  }

  const uploadBtn = $("libraryUploadBtn");
  if (uploadBtn) {
    uploadBtn.disabled = session.uploading;
    uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload";
    uploadBtn.onclick = async () => {
      if (!projectName) {
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

      session.uploading = true;
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
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
            const result = await uploadProjectAsset(projectName, assetType, file);
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
          await reloadProjectData(projectName);
        }

        const input = $("libraryUploadInput");
        if (input) input.value = "";
        const dropInfo = $("libraryDropInfo");
        if (dropInfo) dropInfo.textContent = "No files selected";

        if (uploaded.length && !failed.length) {
          showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}.`);
        } else if (uploaded.length && failed.length) {
          showError?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}, ${failed.length} failed.`);
        } else {
          showError?.("Upload failed for all selected files.");
        }
      } finally {
        session.uploading = false;
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
    const categoryReadiness = getCategoryReadinessList(assetsData);
    const missingRequiredAssets = getMissingAssetLabels(assetsData);
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
              <input id="libraryUploadInput" type="file" multiple hidden>
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
            <span class="card-badge neutral">Table + Preview</span>
          </div>
          <div class="library-workspace-grid">
            <div class="library-workspace-main">
              <div class="library-filter-bar">
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
                </div>
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
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

              <div class="library-table-wrap">
                <table class="library-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Source of Truth</th>
                      <th>Used in</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="libraryAssetTableBody"></tbody>
                </table>
              </div>
            </div>

            <aside class="library-workspace-side">
              <section class="card library-preview-card">
                <div class="card-head">
                  <h3>Asset Detail</h3>
                  <span class="card-badge neutral">Preview + Decisions</span>
                </div>
                <div id="libraryPreviewVisual"></div>
                <div id="libraryPreviewMeta" style="margin-top: 12px;"></div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Activity / Recent Assets</h3>
                  <span class="card-badge neutral">Latest updates</span>
                </div>
                <div id="libraryRecentActivity"></div>
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
