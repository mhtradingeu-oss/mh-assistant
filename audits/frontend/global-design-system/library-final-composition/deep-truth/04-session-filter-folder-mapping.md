# 04 — Session Filter Folder Mapping Truth

Generated: Sat Jun  6 09:45:57 CEST 2026

## Definitions
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

## Filter function
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

## Folder count function
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

## Session initialization
105:    uploadType: "logo"
112:    uploadType: "brand_guideline"
119:    uploadType: "product_csv"
126:    uploadType: "product_photos"
133:    uploadType: "product_videos"
140:    uploadType: "legal_doc"
147:    uploadType: "partner_docs"
550:function ensureLibrarySession(projectName) {
556:      searchQuery: "",
557:      selectedType: "all",
558:      selectedStatus: "active",
559:      selectedSource: "all",
561:      folderKey: "all_assets",
562:      viewMode: "grid",
564:      uploadType: "logo",
600:  const normalized = getSafeAssetType(selectedValue || session.uploadType);
971:  const selectedFolderKey = session.folderKey || "all_assets";
974:  const selectedType = session.selectedType || "all";
975:  const selectedStatus = session.selectedStatus || "active";
976:  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
978:    : selectedStatus;
979:  const selectedSource = session.selectedSource || "all";
982:  const searchValue = asString(session.searchQuery).trim();
1016:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1023:    const matchesSource = selectedSource === "all"
1024:      || (selectedSource === "media-studio" && asset.kind === "managed_media")
1025:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
1026:      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
1679:              data-library-upload-type="${escapeHtml(item.uploadType)}"
1690:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1692:    typeSelect.value = session.selectedType || "all";
1701:          session.selectedType = value;
1725:    statusSelect.value = session.selectedStatus;
1732:          session.selectedStatus = value;
1757:      <option value="${escapeHtml(option.value)}"${session.selectedSource === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1759:    sourceSelect.value = session.selectedSource || "all";
1768:          session.selectedSource = value;
2038:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2042:      session.uploadType = uploadType;
2043:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2044:      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;
2049:        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
2057:        session.folderKey = mappedFolder.key;
2058:        session.selectedType = isReviewAction ? "all" : uploadType;
2059:        session.selectedStatus = isReviewAction ? "active" : session.selectedStatus;
2060:        session.selectedSource = isReviewAction ? "all" : session.selectedSource;
2061:        session.searchQuery = isReviewAction ? "" : session.searchQuery;
2080:        const uploadLabel = getLibraryUploadTypeLabel(uploadType);
2103:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
2113:        session.selectedStatus = "needs_review";
2271:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
2275:        value: folderKey
2278:          session.folderKey = value;
2282:            session.selectedStatus = "archived";
2297:      viewMode: mode === "list" ? "list" : "grid"
2299:      "set-view-mode": ({ viewMode }) => {
2300:        session.viewMode = viewMode;
2311:    finderWorkspace.setAttribute("data-library-view-mode", session.viewMode === "grid" ? "grid" : "list");
2552:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2553:      session.uploadType = uploadType;
2554:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2555:      if (uploadTypeSelect) {
2556:        uploadTypeSelect.value = uploadType;
2558:      showMessage?.(`Upload category set to ${uploadType}.`);
2587:    searchInput.value = session.searchQuery;
2594:          session.searchQuery = value;
2609:  const uploadTypeSelect = $("libraryUploadTypeSelect");
2610:  if (uploadTypeSelect) {
2612:    uploadTypeSelect.innerHTML = catalog.map((item) => {
2615:      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
2617:    uploadTypeSelect.value = session.uploadType;
2618:    uploadTypeSelect.onchange = (event) => {
2619:      const uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
2621:      dispatchLibraryCommand("upload-type-change", { uploadType }, {
2622:        "upload-type-change": ({ uploadType: nextUploadType }) => ({
2624:          uploadType: nextUploadType
2628:      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
3015:    const session = ensureLibrarySession(projectName);
3016:    session.viewMode = "grid";
3088:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3104:            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
3111:      const active = (session.folderKey || "all_assets") === folder.key;
