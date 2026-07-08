"use strict";

/**
 * Audience Blueprint Registry MVP
 *
 * This module is intentionally read-only and non-executing.
 *
 * It defines reusable, platform-aware, manual-first, draft-only audience
 * blueprint templates for future Audience OS workflows.
 *
 * It must not:
 * - call external providers
 * - mutate files
 * - write project data
 * - launch campaigns
 * - create platform audiences
 * - change budgets
 */

const REGISTRY_VERSION = "audience-template-registry-v1";

const PLATFORM_FAMILIES = Object.freeze({
  TIKTOK: "tiktok",
  META: "meta",
  GOOGLE_ADS: "google_ads",
  GENERIC: "generic"
});

const BUSINESS_TYPES = Object.freeze({
  ECOMMERCE: "ecommerce"
});

const MARKETS = Object.freeze({
  DE: "DE"
});

const CANONICAL_EVENTS = Object.freeze({
  PAGE_VIEW: "page_view",
  VIEW_CONTENT: "view_content",
  ADD_TO_CART: "add_to_cart",
  INITIATE_CHECKOUT: "initiate_checkout",
  ADD_PAYMENT_INFO: "add_payment_info",
  PURCHASE: "purchase",
  ADD_TO_WISHLIST: "add_to_wishlist"
});

const PLATFORM_EVENT_MAP = Object.freeze({
  tiktok: Object.freeze({
    page_view: "PageView",
    view_content: "ViewContent",
    add_to_cart: "AddToCart",
    initiate_checkout: "InitiateCheckout",
    add_payment_info: "AddPaymentInfo",
    purchase: "CompletePayment",
    add_to_wishlist: "AddToWishlist"
  }),
  meta: Object.freeze({
    page_view: "PageView",
    view_content: "ViewContent",
    add_to_cart: "AddToCart",
    initiate_checkout: "InitiateCheckout",
    add_payment_info: "AddPaymentInfo",
    purchase: "Purchase",
    add_to_wishlist: "AddToWishlist"
  }),
  google_ads: Object.freeze({
    page_view: "page_view",
    view_content: "view_item",
    add_to_cart: "add_to_cart",
    initiate_checkout: "begin_checkout",
    add_payment_info: "add_payment_info",
    purchase: "purchase",
    add_to_wishlist: "add_to_wishlist"
  }),
  generic: Object.freeze({
    page_view: "page_view",
    view_content: "view_content",
    add_to_cart: "add_to_cart",
    initiate_checkout: "initiate_checkout",
    add_payment_info: "add_payment_info",
    purchase: "purchase",
    add_to_wishlist: "add_to_wishlist"
  })
});

function deepFreeze(value) {
  if (!value || typeof value !== "object") return value;

  Object.freeze(value);

  for (const item of Object.values(value)) {
    if (item && typeof item === "object" && !Object.isFrozen(item)) {
      deepFreeze(item);
    }
  }

  return value;
}

function createTemplate(input) {
  return deepFreeze({
    id: input.id,
    label: input.label,
    market: input.market || MARKETS.DE,
    platform_family: input.platform_family || PLATFORM_FAMILIES.TIKTOK,
    business_type: input.business_type || BUSINESS_TYPES.ECOMMERCE,
    funnel_stage: input.funnel_stage,
    intent_level: input.intent_level,
    include_events: input.include_events || [],
    exclude_events: input.exclude_events || [],
    retention_days: input.retention_days,
    required_tracking_events: input.required_tracking_events || [],
    optional_tracking_events: input.optional_tracking_events || [],
    exclusion_policy: input.exclusion_policy || "none",
    readiness_rules: input.readiness_rules || [],
    recommended_ai_owner_role: input.recommended_ai_owner_role || "ads_operator",
    review_roles: input.review_roles || ["strategist", "analyst", "compliance_reviewer"],
    approval_required: input.approval_required !== false,
    manual_setup_notes: input.manual_setup_notes || [],
    campaign_usage: input.campaign_usage || [],
    creative_guidance: input.creative_guidance || [],
    compliance_notes: input.compliance_notes || [],
    execution_policy: {
      mode: "draft_only",
      manual_first: true,
      external_platform_write_allowed: false,
      campaign_launch_allowed: false,
      budget_mutation_allowed: false,
      requires_human_approval_before_future_execution: true
    }
  });
}

const ECOMMERCE_TIKTOK_STARTER_TEMPLATES = deepFreeze([
  createTemplate({
    id: "ecommerce.tiktok.de.website_visitors.30d",
    label: "DE | WV | All Visitors | 30D",
    funnel_stage: "awareness_retargeting",
    intent_level: "warm",
    include_events: [CANONICAL_EVENTS.PAGE_VIEW],
    exclude_events: [],
    retention_days: 30,
    required_tracking_events: [CANONICAL_EVENTS.PAGE_VIEW],
    optional_tracking_events: [CANONICAL_EVENTS.VIEW_CONTENT, CANONICAL_EVENTS.PURCHASE],
    exclusion_policy: "none",
    readiness_rules: [
      "PageView must be tracked before using website visitor audiences.",
      "Use this audience for broad retargeting and education campaigns.",
      "Exclude recent purchasers at campaign level when used for prospecting-style retargeting."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include all website visitors for the last 30 days.",
      "Keep audience enhancement off unless explicitly authorized."
    ],
    campaign_usage: [
      "Brand reminder campaigns",
      "Product education",
      "Warm retargeting"
    ],
    creative_guidance: [
      "Use simple brand recall messaging.",
      "Show product benefits and trust signals.",
      "Avoid hard discount pressure for first warm touch."
    ],
    compliance_notes: [
      "Respect platform privacy terms.",
      "Do not imply sensitive personal attributes."
    ]
  }),

  createTemplate({
    id: "ecommerce.tiktok.de.product_view.30d",
    label: "DE | VC | Product View | 30D",
    funnel_stage: "product_engagement",
    intent_level: "medium",
    include_events: [CANONICAL_EVENTS.VIEW_CONTENT],
    exclude_events: [],
    retention_days: 30,
    required_tracking_events: [CANONICAL_EVENTS.VIEW_CONTENT],
    optional_tracking_events: [CANONICAL_EVENTS.ADD_TO_CART, CANONICAL_EVENTS.PURCHASE],
    exclusion_policy: "exclude_purchase_when_used_for_conversion_retargeting",
    readiness_rules: [
      "ViewContent must be verified before this template is ready.",
      "If Purchase is available, exclude purchasers in conversion retargeting.",
      "Use product-specific creatives when catalog or product intelligence exists."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include product view event for the last 30 days.",
      "Add purchase exclusion only when purchase tracking is verified."
    ],
    campaign_usage: [
      "Product benefit retargeting",
      "Social proof retargeting",
      "Comparison or FAQ creatives"
    ],
    creative_guidance: [
      "Show the product clearly.",
      "Use reviews, before-after benefits, or usage scenarios.",
      "Answer common objections."
    ],
    compliance_notes: [
      "Avoid unsupported product claims.",
      "Cosmetic claims must stay compliant with product evidence."
    ]
  }),

  createTemplate({
    id: "ecommerce.tiktok.de.add_to_cart_no_purchase.30d",
    label: "DE | ATC | Add To Cart | 30D | No Purchase",
    funnel_stage: "cart_recovery",
    intent_level: "high",
    include_events: [CANONICAL_EVENTS.ADD_TO_CART],
    exclude_events: [CANONICAL_EVENTS.PURCHASE],
    retention_days: 30,
    required_tracking_events: [CANONICAL_EVENTS.ADD_TO_CART, CANONICAL_EVENTS.PURCHASE],
    optional_tracking_events: [CANONICAL_EVENTS.INITIATE_CHECKOUT],
    exclusion_policy: "exclude_purchase_30d",
    readiness_rules: [
      "AddToCart must be verified.",
      "Purchase must be verified before using No Purchase exclusion.",
      "Do not use this template if Purchase tracking is missing."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include AddToCart for the last 30 days.",
      "Exclude Purchase for the last 30 days.",
      "Use manual review before connecting to paid campaigns."
    ],
    campaign_usage: [
      "Cart recovery",
      "Offer reminder",
      "Urgency or trust campaign"
    ],
    creative_guidance: [
      "Remind users of the product they considered.",
      "Use clear call to action.",
      "Use trust elements such as delivery, payment, and guarantee information."
    ],
    compliance_notes: [
      "Avoid misleading urgency.",
      "Do not over-personalize in a way that feels invasive."
    ]
  }),

  createTemplate({
    id: "ecommerce.tiktok.de.checkout_no_purchase.30d",
    label: "DE | Checkout | 30D | No Purchase",
    funnel_stage: "checkout_recovery",
    intent_level: "very_high",
    include_events: [CANONICAL_EVENTS.INITIATE_CHECKOUT],
    exclude_events: [CANONICAL_EVENTS.PURCHASE],
    retention_days: 30,
    required_tracking_events: [CANONICAL_EVENTS.INITIATE_CHECKOUT, CANONICAL_EVENTS.PURCHASE],
    optional_tracking_events: [CANONICAL_EVENTS.ADD_PAYMENT_INFO],
    exclusion_policy: "exclude_purchase_30d",
    readiness_rules: [
      "InitiateCheckout must be verified.",
      "Purchase must be verified before using No Purchase exclusion.",
      "Do not use awareness messaging for this audience."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include checkout started users for the last 30 days.",
      "Exclude Purchase for the last 30 days.",
      "Use only after tracking review."
    ],
    campaign_usage: [
      "Checkout recovery",
      "Payment reassurance",
      "Shipping or guarantee reminder"
    ],
    creative_guidance: [
      "Keep message direct and practical.",
      "Remove friction with payment, shipping, or support reassurance.",
      "Avoid broad awareness storylines."
    ],
    compliance_notes: [
      "Avoid implying knowledge of private behavior.",
      "Keep message respectful and general."
    ]
  }),

  createTemplate({
    id: "ecommerce.tiktok.de.customers_purchase.180d",
    label: "DE | Customers | Purchase | 180D",
    funnel_stage: "customer_retention",
    intent_level: "customer",
    include_events: [CANONICAL_EVENTS.PURCHASE],
    exclude_events: [],
    retention_days: 180,
    required_tracking_events: [CANONICAL_EVENTS.PURCHASE],
    optional_tracking_events: [],
    exclusion_policy: "exclude_from_prospecting",
    readiness_rules: [
      "Purchase must be verified.",
      "Recent purchasers must not be included in prospecting.",
      "Use this audience for retention, upsell, cross-sell, or lookalike source readiness checks."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include Purchase event for the last 180 days.",
      "Use as exclusion from prospecting and as source for future lookalike only after size review."
    ],
    campaign_usage: [
      "Customer retention",
      "Cross-sell",
      "Complementary product campaigns",
      "Future lookalike source"
    ],
    creative_guidance: [
      "Promote complementary products, not the same product already purchased.",
      "Use loyalty, bundle, or VIP messaging when authorized.",
      "Respect customer lifecycle stage."
    ],
    compliance_notes: [
      "Do not expose purchase status in ad copy.",
      "Use customer data only according to consent and platform rules."
    ]
  }),

  createTemplate({
    id: "ecommerce.tiktok.de.wishlist_no_purchase.30d",
    label: "DE | Wishlist | 30D | No Purchase",
    funnel_stage: "wishlist_recovery",
    intent_level: "high",
    include_events: [CANONICAL_EVENTS.ADD_TO_WISHLIST],
    exclude_events: [CANONICAL_EVENTS.PURCHASE],
    retention_days: 30,
    required_tracking_events: [CANONICAL_EVENTS.ADD_TO_WISHLIST, CANONICAL_EVENTS.PURCHASE],
    optional_tracking_events: [CANONICAL_EVENTS.ADD_TO_CART],
    exclusion_policy: "exclude_purchase_30d",
    readiness_rules: [
      "AddToWishlist must be verified.",
      "Purchase must be verified before using No Purchase exclusion.",
      "If wishlist event is missing, this template must remain blocked."
    ],
    manual_setup_notes: [
      "Create a website traffic custom audience.",
      "Include AddToWishlist for the last 30 days.",
      "Exclude Purchase for the last 30 days.",
      "Keep audience enhancement off unless explicitly authorized."
    ],
    campaign_usage: [
      "Wishlist recovery",
      "Interest reminder",
      "Product-specific consideration"
    ],
    creative_guidance: [
      "Show the wished product or category.",
      "Use soft reminder messaging.",
      "Add social proof or value reminder."
    ],
    compliance_notes: [
      "Do not imply private wishlist behavior directly.",
      "Keep ad copy general and policy-safe."
    ]
  })
]);

const REGISTRY = deepFreeze({
  version: REGISTRY_VERSION,
  description: "Read-only Audience Blueprint Registry MVP for manual-first Audience OS planning.",
  execution_policy: {
    mode: "read_only_registry",
    external_platform_write_allowed: false,
    campaign_launch_allowed: false,
    budget_mutation_allowed: false,
    project_data_write_allowed: false
  },
  canonical_events: CANONICAL_EVENTS,
  platform_event_map: PLATFORM_EVENT_MAP,
  templates: ECOMMERCE_TIKTOK_STARTER_TEMPLATES
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getAudienceTemplateRegistry() {
  return clone(REGISTRY);
}

function listAudienceTemplates() {
  return clone(REGISTRY.templates);
}

function getAudienceTemplateById(id) {
  const normalizedId = normalize(id);
  const template = REGISTRY.templates.find((item) => normalize(item.id) === normalizedId);
  return template ? clone(template) : null;
}

function listAudienceTemplatesByBusinessType(businessType) {
  const normalizedBusinessType = normalize(businessType);
  return clone(
    REGISTRY.templates.filter((item) => normalize(item.business_type) === normalizedBusinessType)
  );
}

function listAudienceTemplatesByPlatformFamily(platformFamily) {
  const normalizedPlatformFamily = normalize(platformFamily);
  return clone(
    REGISTRY.templates.filter((item) => normalize(item.platform_family) === normalizedPlatformFamily)
  );
}

module.exports = {
  BUSINESS_TYPES,
  CANONICAL_EVENTS,
  MARKETS,
  PLATFORM_EVENT_MAP,
  PLATFORM_FAMILIES,
  REGISTRY_VERSION,
  getAudienceTemplateById,
  getAudienceTemplateRegistry,
  listAudienceTemplates,
  listAudienceTemplatesByBusinessType,
  listAudienceTemplatesByPlatformFamily
};
