# 01 — Library Type Constants

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
