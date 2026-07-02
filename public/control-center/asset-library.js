export const FALLBACK_ASSET_CATEGORIES = [
  {
    asset_type: "logo",
    label: "Logo / Logo",
    purpose: "brand_foundation",
    purpose_label: "Brand foundation",
    required: true,
    allowed_extensions: [".png", ".svg", ".jpg", ".jpeg", ".webp"],
    target_folder: "brand-assets",
    aliases: [],
    description: "Official brand logo.",
    guidance: {
      what_to_upload: "Primary logo files, transparent logo variants, and approved lockups.",
      why_it_matters: "Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.",
      used_in: ["Setup", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "brand_guideline",
    label: "Brand Guideline / Markenrichtlinie",
    purpose: "brand_foundation",
    purpose_label: "Brand foundation",
    required: true,
    allowed_extensions: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".md", ".txt"],
    target_folder: "brand-assets",
    aliases: ["brand_guidelines", "brand_guide", "brand_reference_doc"],
    description: "Brand identity, voice, visual rules, and usage guidance.",
    guidance: {
      what_to_upload: "Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.",
      why_it_matters: "Gives Setup, Content Studio, Media Studio, and AI Command the guardrails they need.",
      used_in: ["Setup", "Campaign Studio", "Content Studio", "Media Studio", "AI Command"]
    }
  },
  {
    asset_type: "product_csv",
    label: "Product Data / Produktdaten",
    purpose: "product_offers",
    purpose_label: "Product and offers",
    required: true,
    allowed_extensions: [".csv", ".xlsx", ".xls", ".json"],
    target_folder: "products",
    aliases: ["product_data", "product_feed", "product_sheet"],
    description: "Structured product data for planning, content, and campaign packaging.",
    guidance: {
      what_to_upload: "SKU list, product names, descriptions, variants, ingredients, usage, and product URLs.",
      why_it_matters: "Campaign Studio, Content Studio, Publishing, and AI Command need accurate product facts.",
      used_in: ["Campaign Studio", "Content Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "pricing_doc",
    label: "Pricing & Offers / Preise & Angebote",
    purpose: "product_offers",
    purpose_label: "Product and offers",
    required: true,
    allowed_extensions: [".pdf", ".doc", ".docx", ".csv", ".xlsx", ".xls", ".txt", ".md"],
    target_folder: "content",
    aliases: ["pricing", "price_list", "offers", "offer_doc"],
    description: "Pricing, bundles, discounts, and commercial offer rules.",
    guidance: {
      what_to_upload: "Price lists, offer sheets, bundles, campaign discounts, coupons, and margin guardrails.",
      why_it_matters: "Prevents Campaign Studio, Publishing, and AI Command from inventing prices or offers.",
      used_in: ["Campaign Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "legal_doc",
    label: "Legal Documents / Rechtliche Dokumente",
    purpose: "proof_compliance",
    purpose_label: "Proof and compliance",
    required: true,
    allowed_extensions: [".pdf", ".doc", ".docx", ".txt", ".md"],
    target_folder: "content",
    aliases: ["legal", "compliance_doc", "terms_doc"],
    description: "Policies, legal terms, disclaimers, and claim restrictions.",
    guidance: {
      what_to_upload: "Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.",
      why_it_matters: "Publishing and AI Command need legal context before release or generated claims.",
      used_in: ["Content Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "product_photos",
    label: "Product Photos / Produktfotos",
    purpose: "visual_media",
    purpose_label: "Visual media",
    required: true,
    allowed_extensions: [".png", ".jpg", ".jpeg", ".webp", ".avif"],
    target_folder: "products",
    aliases: ["product_image", "product_images", "product_photo", "product"],
    description: "Approved product photography for content, media, ads, and publishing.",
    guidance: {
      what_to_upload: "Clean product packshots, lifestyle product photos, before/after images where allowed, and hero crops.",
      why_it_matters: "Content Studio, Media Studio, Campaign Studio, and Publishing need real product visuals.",
      used_in: ["Campaign Studio", "Content Studio", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "product_videos",
    label: "Product Videos / Produktvideos",
    purpose: "visual_media",
    purpose_label: "Visual media",
    required: true,
    allowed_extensions: [".mp4", ".mov", ".webm", ".m4v"],
    target_folder: "products",
    aliases: ["product_video", "product_video_assets", "video"],
    description: "Approved product videos, demos, UGC clips, and cutdowns.",
    guidance: {
      what_to_upload: "Product demos, UGC clips, reels, explainers, usage videos, and source cutdowns.",
      why_it_matters: "Media Studio, Content Studio, Campaign Studio, and Publishing use video as creative source material.",
      used_in: ["Campaign Studio", "Content Studio", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "social_assets",
    label: "Social Assets / Social-Media-Assets",
    purpose: "campaign_social",
    purpose_label: "Campaign and social",
    required: true,
    allowed_extensions: [".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mov", ".pdf", ".psd", ".ai", ".fig"],
    target_folder: "campaigns",
    aliases: ["social_asset", "social_creatives", "organic_social_assets"],
    description: "Organic social creative, post visuals, reels, stories, and channel-ready source assets.",
    guidance: {
      what_to_upload: "Organic post images, story frames, reels, thumbnails, channel templates, and caption references.",
      why_it_matters: "Content Studio, Media Studio, Campaign Studio, and Publishing can reuse proven channel assets.",
      used_in: ["Campaign Studio", "Content Studio", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "campaign_assets",
    label: "Campaign Assets / Kampagnenmaterial",
    purpose: "campaign_social",
    purpose_label: "Campaign and social",
    required: true,
    allowed_extensions: [".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mov", ".pdf", ".doc", ".docx", ".html", ".zip"],
    target_folder: "campaigns",
    aliases: ["campaign_asset", "creative_assets", "ad_assets"],
    description: "Campaign-specific creative, copy, export packs, banners, and channel packages.",
    guidance: {
      what_to_upload: "Campaign banners, ad creative, landing-page assets, email hero files, export packs, and wave-specific files.",
      why_it_matters: "Campaign Studio and Publishing need a reusable package for each campaign or wave.",
      used_in: ["Campaign Studio", "Content Studio", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "packaging_images",
    label: "Packaging Images / Verpackungsbilder",
    purpose: "visual_media",
    purpose_label: "Visual media",
    required: true,
    allowed_extensions: [".png", ".jpg", ".jpeg", ".webp", ".pdf"],
    target_folder: "products",
    aliases: ["packaging_doc", "packaging_image", "packaging", "label_image"],
    description: "Packaging photos, labels, inserts, and box or bottle references.",
    guidance: {
      what_to_upload: "Packaging photos, label artwork, inserts, box shots, bottle/jar details, and compliance label references.",
      why_it_matters: "Media Studio and Publishing need packaging truth for product visuals and compliance checks.",
      used_in: ["Campaign Studio", "Media Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "testimonials_reviews",
    label: "Testimonials & Reviews / Kundenstimmen & Bewertungen",
    purpose: "proof_compliance",
    purpose_label: "Proof and compliance",
    required: true,
    allowed_extensions: [".pdf", ".doc", ".docx", ".txt", ".md", ".csv", ".xlsx", ".png", ".jpg", ".jpeg"],
    target_folder: "content",
    aliases: ["testimonial", "testimonials", "review", "reviews"],
    description: "Customer proof, reviews, testimonial exports, and approved quotes.",
    guidance: {
      what_to_upload: "Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.",
      why_it_matters: "Content Studio, Campaign Studio, Publishing, and AI Command need trusted proof points.",
      used_in: ["Campaign Studio", "Content Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "certificates",
    label: "Certificates / Zertifikate",
    purpose: "proof_compliance",
    purpose_label: "Proof and compliance",
    required: true,
    allowed_extensions: [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"],
    target_folder: "content",
    aliases: ["certificate", "certification", "certifications", "cert"],
    description: "Certifications, lab reports, awards, and official proof documents.",
    guidance: {
      what_to_upload: "Certificates, compliance proof, awards, lab reports, or official authorization documents.",
      why_it_matters: "Publishing and AI Command can use only approved proof when making trust or compliance claims.",
      used_in: ["Content Studio", "Publishing", "AI Command"]
    }
  },
  {
    asset_type: "partner_docs",
    label: "Partner Documents / Partnerdokumente",
    purpose: "partnerships",
    purpose_label: "Partnerships",
    required: true,
    allowed_extensions: [".pdf", ".doc", ".docx", ".txt", ".md", ".csv", ".xlsx"],
    target_folder: "content",
    aliases: ["partner_doc", "partner_document", "supplier_doc", "partner_material"],
    description: "Partner, supplier, distributor, marketplace, and collaboration documents.",
    guidance: {
      what_to_upload: "Partner briefs, supplier docs, marketplace requirements, distributor notes, and collaboration agreements.",
      why_it_matters: "Campaign Studio, Publishing, and AI Command need partner constraints before reuse or release.",
      used_in: ["Campaign Studio", "Publishing", "AI Command"]
    }
  }
];

export const ASSET_PURPOSE_ORDER = [
  "brand_foundation",
  "product_offers",
  "visual_media",
  "campaign_social",
  "proof_compliance",
  "partnerships"
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

function getAssetItems(assetsData = {}) {
  if (Array.isArray(assetsData)) return assetsData;

  const sources = [
    assetsData.assets,
    assetsData.items,
    assetsData.records,
    assetsData.registry,
    assetsData.asset_registry,
    assetsData.assets_registry,
    assetsData.library_assets,
    assetsData.data?.assets,
    assetsData.data?.items,
    assetsData.data?.registry,
    assetsData.missing_assets?.assets,
    assetsData.missing_assets?.items,
    assetsData.missing_assets?.registered_assets
  ];

  for (const source of sources) {
    if (Array.isArray(source)) return source;
  }

  return [];
}

function getAssetTypeValue(asset = {}) {
  return asString(asset.asset_type || asset.type || asset.category || asset.assetCategory);
}

function getAssetCountValue(category = {}) {
  const direct = Number(
    category.count ??
    category.total_count ??
    category.uploaded_count ??
    category.approved_count ??
    category.files_count ??
    0
  );

  return Number.isFinite(direct) ? Math.max(0, direct) : 0;
}

export function titleCaseAssetKey(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function getAssetStatusTone(status) {
  const value = asString(status).toLowerCase();
  if (value === "approved") return "success";
  if (value === "uploaded") return "neutral";
  if (value === "needs review") return "warning";
  if (value === "missing") return "danger";
  return "neutral";
}

export function normalizeAssetCategory(category = {}) {
  const fallback = FALLBACK_ASSET_CATEGORIES.find((item) => item.asset_type === category.asset_type) || {};
  const merged = { ...fallback, ...asObject(category) };
  const guidance = {
    ...asObject(fallback.guidance),
    ...asObject(category.guidance)
  };

  return {
    ...merged,
    asset_type: asString(merged.asset_type),
    internal_key: asString(merged.internal_key || merged.asset_type),
    label: asString(merged.label || merged.display_label || titleCaseAssetKey(merged.asset_type)),
    display_label: asString(merged.display_label || merged.label || titleCaseAssetKey(merged.asset_type)),
    purpose: asString(merged.purpose || "other"),
    purpose_label: asString(merged.purpose_label || titleCaseAssetKey(merged.purpose || "other")),
    required: merged.required !== false,
    allowed_extensions: asArray(merged.allowed_extensions || merged.accepted_file_types),
    accepted_file_types: asArray(merged.accepted_file_types || merged.allowed_extensions),
    aliases: asArray(merged.aliases),
    guidance
  };
}

export function getAssetCatalog(assetsData = {}) {
  const direct = asArray(assetsData.asset_catalog);
  const nested = asArray(assetsData.missing_assets?.asset_catalog);
  const catalog = direct.length ? direct : nested.length ? nested : FALLBACK_ASSET_CATEGORIES;
  return catalog.map((item) => normalizeAssetCategory(item));
}

export function getCanonicalAssetType(assetType, catalog = FALLBACK_ASSET_CATEGORIES) {
  const value = asString(assetType).trim().toLowerCase();
  if (!value) return "";

  for (const item of catalog.map((entry) => normalizeAssetCategory(entry))) {
    const values = [item.asset_type, ...item.aliases].map((entry) => asString(entry).trim().toLowerCase());
    if (values.includes(value)) return item.asset_type;
  }

  return value;
}

function deriveCategoryStatus(assetsData, category) {
  const assets = getAssetItems(assetsData);
  const catalog = getAssetCatalog(assetsData);
  const matching = assets.filter((asset) => getCanonicalAssetType(getAssetTypeValue(asset), catalog) === category.asset_type);
  if (!matching.length) return "Missing";

  const statuses = matching.map((asset) => asString(
    asset.readiness_status ||
    asset.review_status ||
    asset.approval_status ||
    asset.status ||
    ""
  ).toLowerCase());

  if (matching.some((asset, index) => asset.approved === true || statuses[index] === "approved")) return "Approved";
  if (matching.some((asset) => asset.exists === false || statuses.includes("missing"))) return "Needs Review";
  return "Uploaded";
}

export function getCategoryReadinessList(assetsData = {}) {
  const assetItems = getAssetItems(assetsData);
  const catalog = getAssetCatalog(assetsData);
  const fromServer = asArray(assetsData.category_readiness?.categories || assetsData.missing_assets?.category_readiness?.categories);

  if (fromServer.length) {
    return fromServer.map((item) => {
      const normalized = normalizeAssetCategory({
        ...item,
        status: asString(item.status || "Missing"),
        count: getAssetCountValue(item),
        blocker: Boolean(item.blocker)
      });

      const matchingCount = assetItems.filter((asset) =>
        getCanonicalAssetType(getAssetTypeValue(asset), catalog) === normalized.asset_type
      ).length;

      const count = Math.max(getAssetCountValue(item), matchingCount);
      const status = count > 0 && normalized.status === "Missing" ? "Uploaded" : normalized.status;

      return {
        ...normalized,
        status,
        count,
        uploaded_count: Number(item.uploaded_count || 0) || (status === "Uploaded" ? count : 0),
        approved_count: Number(item.approved_count || 0) || (status === "Approved" ? count : 0),
        blocker: normalized.required && ["Missing", "Needs Review"].includes(status)
      };
    });
  }

  return catalog.map((category) => {
    const status = deriveCategoryStatus(assetsData, category);
    const count = assetItems.filter((asset) => getCanonicalAssetType(getAssetTypeValue(asset), catalog) === category.asset_type).length;

    return normalizeAssetCategory({
      ...category,
      status,
      count,
      uploaded_count: status === "Uploaded" ? count : 0,
      approved_count: status === "Approved" ? count : 0,
      blocker: category.required && ["Missing", "Needs Review"].includes(status),
      next_action:
        status === "Missing"
          ? `Upload ${category.display_label || category.label}.`
          : status === "Needs Review"
            ? `Review ${category.display_label || category.label}.`
            : status === "Uploaded"
              ? `Review and approve ${category.display_label || category.label}.`
              : `${category.display_label || category.label} is approved.`
    });
  });
}

export function findAssetCategory(assetsData, key) {
  const normalizedKey = getCanonicalAssetType(key, getAssetCatalog(assetsData));
  return getCategoryReadinessList(assetsData).find((item) => item.asset_type === normalizedKey) || null;
}

export function filterAssetCategories(assetsData, keys) {
  const wanted = asArray(keys).map((key) => getCanonicalAssetType(key, getAssetCatalog(assetsData)));
  return getCategoryReadinessList(assetsData).filter((item) => wanted.includes(item.asset_type));
}

export function getAssetNextAction(assetsData = {}, keys = []) {
  const categories = keys.length ? filterAssetCategories(assetsData, keys) : getCategoryReadinessList(assetsData);
  const blocker = categories.find((item) => item.status === "Missing") ||
    categories.find((item) => item.status === "Needs Review") ||
    categories.find((item) => item.status === "Uploaded");
  return asString(blocker?.next_action || assetsData.category_readiness?.next_best_action || "Library inputs are covered for this step.");
}

export function getMissingAssetLabels(assetsData = {}, keys = []) {
  const categories = keys.length ? filterAssetCategories(assetsData, keys) : getCategoryReadinessList(assetsData);
  return categories
    .filter((item) => item.status === "Missing")
    .map((item) => item.display_label || item.label || item.asset_type);
}

export function renderAssetDependencyRows(assetsData, keys, escapeHtml, emptyText = "Library inputs are covered.") {
  const categories = filterAssetCategories(assetsData, keys);
  if (!categories.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="asset-dependency-list">
      ${categories.map((item) => `
        <div class="asset-dependency-row">
          <div>
            <strong>${escapeHtml(item.display_label || item.label || item.asset_type)}</strong>
            <span>${escapeHtml(asString(item.guidance?.used_in).replace(/,/g, ", ") || titleCaseAssetKey(item.asset_type))}</span>
            <small>${escapeHtml(item.internal_key || item.asset_type)}</small>
          </div>
          <span class="card-badge ${getAssetStatusTone(item.status)}">${escapeHtml(item.status || "Missing")}</span>
        </div>
      `).join("")}
    </div>
  `;
}
