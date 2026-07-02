// --- Guided Library Source Type Mapping ---
const SHARED_SOURCE_TYPE_MAP = {
  product_photo: {
    label: "Product Photo",
    libraryFilter: "product_images",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a product photo",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  video: {
    label: "Video Asset",
    libraryFilter: "videos",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a video source",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  document: {
    label: "Document",
    libraryFilter: "documents",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a document source",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  product_data: {
    label: "Product Data (CSV)",
    libraryFilter: "product_data",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a product data file",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  brand_asset: {
    label: "Brand Asset",
    libraryFilter: "logos",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a brand asset",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  legal_pricing: {
    label: "Legal/Pricing Document",
    libraryFilter: "legal_pricing",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a legal or pricing document",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  research_proof: {
    label: "Research/Proof Document",
    libraryFilter: "research_certificates",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a research/proof document",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  folder_collection: {
    label: "Folder/Collection",
    libraryFilter: "all_assets",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a folder or collection",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  },
  auto: {
    label: "Any Asset",
    libraryFilter: "all_assets",
    targetSection: "asset-workspace",
    shortGuideTitle: "Choose a source",
    shortGuideText: "Select one item, then click Use as Source in AI Command."
  }
};

export function getSourceTypeMapping(type = "auto") {
  return SHARED_SOURCE_TYPE_MAP[type] || SHARED_SOURCE_TYPE_MAP.auto;
}

// Transient context caches
const campaignCache = new Map();
const aiDraftCache = new Map();
const handoffCache = new Map();
const librarySourceBridgeCache = new Map();

// Transient AI source cache
const aiSourceCache = new Map();

// --- Transient AI Drawer Return Context ---
const aiDrawerReturnCache = new Map();

export function setSharedAiDrawerReturn(projectName, payload) {
  if (!projectName || !payload) return;
  aiDrawerReturnCache.set(buildKey(projectName, "ai-drawer-return"), payload);
}

export function getSharedAiDrawerReturn(projectName) {
  return aiDrawerReturnCache.get(buildKey(projectName, "ai-drawer-return"));
}

export function clearSharedAiDrawerReturn(projectName) {
  if (!projectName) return;
  aiDrawerReturnCache.delete(buildKey(projectName, "ai-drawer-return"));
}

// Library Source Bridge helpers
export function setSharedLibrarySourceBridge(projectName, bridge) {
  if (!projectName || !bridge) return;
  librarySourceBridgeCache.set(buildKey(projectName, "library-source-bridge"), bridge);
}

export function getSharedLibrarySourceBridge(projectName) {
  return librarySourceBridgeCache.get(buildKey(projectName, "library-source-bridge"));
}

export function clearSharedLibrarySourceBridge(projectName) {
  if (!projectName) return;
  librarySourceBridgeCache.delete(buildKey(projectName, "library-source-bridge"));
}

// Shared AI Source helpers
export function setSharedAiSource(projectName, source) {
  if (!projectName || !source) return;
  aiSourceCache.set(buildKey(projectName, "ai-source"), source);
}

export function getSharedAiSource(projectName) {
  return aiSourceCache.get(buildKey(projectName, "ai-source"));
}

export function clearSharedAiSource(projectName) {
  if (!projectName) return;
  aiSourceCache.delete(buildKey(projectName, "ai-source"));
}

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

function buildKey(projectName, scope = "default") {
  return `${asString(projectName).trim().toLowerCase() || "__default__"}::${scope}`;
}

function getLatestHandoffFromOperations(operations, destinationPage, sourcePage = "") {
  const handoffs = asArray(operations?.handoffs?.items);
  const available = handoffs.filter((item) => {
    const destinationMatches = asString(item?.destination_page) === asString(destinationPage);
    const sourceMatches = !sourcePage || asString(item?.source_page) === asString(sourcePage);
    const active = asString(item?.status || "available") === "available";
    return destinationMatches && sourceMatches && active;
  });

  return available[0] || null;
}

export function setSharedCampaignRecord(projectName, campaign) {
  if (!projectName || !campaign) return;
  campaignCache.set(buildKey(projectName), campaign);
}

export function getSharedCampaignRecord(projectName, operations) {
  const cached = campaignCache.get(buildKey(projectName));
  if (cached) return cached;

  const campaigns = asArray(operations?.campaigns?.items);
  const activeDraft =
    campaigns.find((item) => item?.active !== false) ||
    campaigns[0] ||
    null;

  return activeDraft;
}

export function setSharedAiDraft(projectName, draft) {
  if (!projectName || !draft) return;
  aiDraftCache.set(buildKey(projectName), draft);
}

export function getSharedAiDraft(projectName, operations) {
  const cached = aiDraftCache.get(buildKey(projectName));
  if (cached) return cached;

  const handoff =
    getLatestHandoffFromOperations(operations, "workflows", "ai-command") ||
    getLatestHandoffFromOperations(operations, "ai-command", "workflows") ||
    null;

  return asObject(handoff?.payload?.draft_context);
}

export function setSharedHandoff(projectName, destinationPage, handoff) {
  if (!projectName || !destinationPage || !handoff) return;
  handoffCache.set(buildKey(projectName, destinationPage), handoff);
}

export function getSharedHandoff(projectName, destinationPage, operations, sourcePage = "") {
  const cached = handoffCache.get(buildKey(projectName, destinationPage));
  if (cached) return cached;
  return getLatestHandoffFromOperations(operations, destinationPage, sourcePage);
}
