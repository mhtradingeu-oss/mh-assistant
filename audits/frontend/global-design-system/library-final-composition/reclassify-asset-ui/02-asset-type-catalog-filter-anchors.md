# 02 — Asset Type Catalog / Filter Anchors

Generated: Sat Jun  6 14:16:50 CEST 2026

## Library frontend type catalog excerpt
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

## Backend catalog route signals
421:  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
8296:  const required = getAssetTypeCatalog()
8320:function getAssetTypeCatalog() {
8537:  for (const item of getAssetTypeCatalog()) {
8549:  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
9010:  const catalog = getAssetTypeCatalog();
9137:  const catalog = getAssetTypeCatalog();
9203:  const catalog = getAssetTypeCatalog();
10629:app.get('/media-manager/asset-catalog', (req, res) => {
10631:    asset_catalog: getAssetTypeCatalog()
10635:app.get('/public/media-manager/asset-catalog', (req, res) => {
10637:    asset_catalog: getAssetTypeCatalog()
10907:    const catalogItem = getAssetTypeCatalog().find((item) => item.asset_type === canonicalType);
10913:        allowed: getAssetTypeCatalog().map((item) => item.asset_type)
15382:  const requiredAssetTypes = new Set(getAssetTypeCatalog().filter(item => item.required).map(item => item.asset_type));
15616:    asset_catalog: getAssetTypeCatalog(),
21462:    const result = getAssetTypeCatalog();
22493:      asset_catalog: Array.isArray(full.assets?.asset_catalog) ? full.assets.asset_catalog : [],

## API catalog client signals
1330:    "/media-manager/asset-catalog",
1331:    "Failed to load asset catalog"
