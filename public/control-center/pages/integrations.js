import {
  buildAISmartRecommendation,
  buildConnectorWorkspaceGroups,
  buildCoverageMap,
  buildCriticalMissing,
  buildIntegrationActivityFeed,
  buildIntegrationOverviewSummary,
  buildLaunchDiagnostics,
  buildRecommendations,
  buildSectionGroups,
  CONNECTOR_WORKSPACE_CATEGORIES,
  getConnectorWorkspaceCategory,
  getConnectorWorkspaceStatus,
  getConnectorWorkspaceStatusLabel,
  matchesConnectorSearch,
  REQUIRED_LAUNCH_CATEGORY_IDS,
  summarizeSectionCards
} from "./integrations/builders.js";

import {
  renderDomainSection,
  renderIntegrationSection
} from "./integrations/layout.js";

import {
  renderDrawerProgress,
  renderIntegrationActionButtons,
  renderIntegrationDetailsPanel,
  renderIntegrationDrawer,
  renderIntegrationField
} from "./integrations/drawer.js";

import {
  renderConnectorGroup,
  renderIntegrationCard,
  renderSelectedConnectorSummary
} from "./integrations/cards.js";

import {
  renderAISmartRecommendation as renderAISmartRecommendationModule,
  renderIntegrationActivityFeed,
  renderIntegrationCoverageMap,
  renderIntegrationCriticalMissing,
  renderIntegrationDiagnosticsList,
  renderIntegrationRecommendationsList
} from "./integrations/render.js";

const integrationSessions = new Map();
let integrationDrawerEscapeHandler = null;
const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);

const INTEGRATION_DOMAINS = [
  {
    id: "website-commerce",
    title: "Website & Commerce",
    description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
    integrations: [
      {
        id: "website",
        sourceKey: "website",
        label: "Website",
        icon: "WE",
        purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
        whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
        enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
        dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
        permissionScope: "Website endpoint or root domain access",
        critical: true,
        primaryField: "url",
        fields: [
          { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
          { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
          { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
        ]
      },
      {
        id: "woocommerce",
        sourceKey: "ecommerce",
        label: "WooCommerce",
        icon: "WC",
        purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
        whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
        enables: "Product sync, order sync, sales signals, and commerce intelligence.",
        dataScope: ["Products", "Orders", "Revenue", "Conversions"],
        permissionScope: "Store URL + API consumer key/secret",
        critical: true,
        primaryField: "storeUrl",
        fields: [
          { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
          { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
          { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
        ]
      },
      {
        id: "shopify",
        sourceKey: "shopify",
        label: "Shopify",
        icon: "SH",
        purpose: "Future-ready Shopify storefront integration for products, orders, and sales intelligence.",
        whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
        enables: "Product sync, order sync, customer sync, and sales reporting.",
        dataScope: ["Products", "Orders", "Customers", "Sales"],
        permissionScope: "Store domain + admin access token",
        primaryField: "storeDomain",
        fields: [
          { key: "storeDomain", label: "Store domain", placeholder: "brand.myshopify.com", required: true },
          { key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },
          { key: "storeId", label: "Store ID", placeholder: "Shopify store ID" }
        ]
      },
      {
        id: "amazon",
        sourceKey: "amazon",
        backendSupported: false,
        unavailableReason: "Backend provider support is not configured yet.",
        label: "Amazon",
        icon: "AM",
        purpose: "Marketplace performance, product-driven commerce signals, and listing intelligence.",
        whyItMatters: "Amazon data gives MH Assistant direct product demand and marketplace sales feedback.",
        enables: "Listing sync, sales signals, performance by product, and marketplace learning.",
        dataScope: ["Listings", "Orders", "Sales", "Marketplace performance"],
        permissionScope: "Merchant ID + SP-API credentials",
        primaryField: "merchantId",
        fields: [
          { key: "merchantId", label: "Merchant ID", placeholder: "Amazon merchant ID", required: true },
          { key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },
          { key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }
        ]
      },
      {
        id: "ebay",
        sourceKey: "ebay",
        label: "eBay",
        icon: "EB",
        purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",
        whyItMatters: "eBay extends commerce intelligence beyond the owned store and helps the system learn external demand patterns.",
        enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",
        dataScope: ["Listings", "Orders", "Sales", "Marketplace activity"],
        permissionScope: "Seller account + OAuth access token",
        primaryField: "sellerId",
        fields: [
          { key: "sellerId", label: "Seller ID", placeholder: "eBay seller ID", required: true },
          { key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },
          { key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }
        ]
      }
    ]
  },
  {
    id: "social",
    title: "Social Platforms",
    description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
    integrations: [
      {
        id: "facebook",
        sourceKey: "facebook",
        label: "Facebook",
        icon: "FB",
        purpose: "Page insights, post performance, engagement, and linked business intelligence.",
        whyItMatters: "Facebook insights help the system understand what posts drive reach, clicks, and downstream action.",
        enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
        dataScope: ["Post insights", "Engagement", "Comments", "Publishing", "Ads linkage"],
        permissionScope: "Page ID + business access token",
        critical: true,
        primaryField: "pageUrl",
        fields: [
          { key: "pageUrl", label: "Page URL", placeholder: "https://facebook.com/brand", required: true },
          { key: "pageId", label: "Page ID", placeholder: "Facebook page ID", required: false },
          { key: "accessToken", label: "Access token", placeholder: "Facebook access token", type: "password" }
        ]
      },
      {
        id: "instagram",
        sourceKey: "instagram",
        label: "Instagram",
        icon: "IG",
        purpose: "Post, reel, and profile insight sync for Instagram business performance.",
        whyItMatters: "Instagram is often the clearest signal for what content angles, hooks, and formats should be scaled next.",
        enables: "Post insights, reel insights, engagement, comments, publishing, and business account analytics.",
        dataScope: ["Posts", "Reels", "Engagement", "Comments", "Publishing"],
        permissionScope: "Business account ID + Graph API token",
        critical: true,
        primaryField: "profileUrl",
        fields: [
          { key: "profileUrl", label: "Profile URL", placeholder: "https://instagram.com/brand", required: true },
          { key: "businessAccountId", label: "Business account ID", placeholder: "Instagram business account ID" },
          { key: "accessToken", label: "Access token", placeholder: "Instagram access token", type: "password" }
        ]
      },
      {
        id: "tiktok",
        sourceKey: "tiktok",
        label: "TikTok",
        icon: "TT",
        purpose: "Video and post insight sync for TikTok creative and audience performance.",
        whyItMatters: "TikTok data helps the system learn what hooks, timing, and short-form video patterns actually win.",
        enables: "Video insights, engagement, comments, profile metrics, and future publishing support.",
        dataScope: ["Video insights", "Engagement", "Comments", "Audience", "Publishing"],
        permissionScope: "Business account ID + access token",
        critical: true,
        primaryField: "profileUrl",
        fields: [
          { key: "profileUrl", label: "Profile URL", placeholder: "https://tiktok.com/@brand", required: true },
          { key: "accountId", label: "Account ID", placeholder: "TikTok business account ID" },
          { key: "accessToken", label: "Access token", placeholder: "TikTok access token", type: "password" }
        ]
      },
      {
        id: "youtube",
        sourceKey: "youtube",
        label: "YouTube",
        icon: "YT",
        purpose: "Video performance and channel insight sync for long-form or short-form YouTube content.",
        whyItMatters: "YouTube data gives stronger watch-based learning and topic-level content intelligence.",
        enables: "Video insights, watch metrics, subscriber trends, comments, and publishing context.",
        dataScope: ["Videos", "Views", "Watch time", "Engagement", "Publishing"],
        permissionScope: "Channel ID + OAuth token",
        critical: true,
        primaryField: "channelUrl",
        fields: [
          { key: "channelUrl", label: "Channel URL", placeholder: "https://youtube.com/@brand", required: true },
          { key: "channelId", label: "Channel ID", placeholder: "YouTube channel ID" },
          { key: "accessToken", label: "Access token", placeholder: "YouTube OAuth token", type: "password" }
        ]
      },
      {
        id: "linkedin",
        sourceKey: "linkedin",
        label: "LinkedIn",
        icon: "LI",
        purpose: "Future-ready business profile insight and publishing connection for LinkedIn surfaces.",
        whyItMatters: "LinkedIn can expand B2B distribution, executive brand reach, and professional audience analytics.",
        enables: "Post insights, audience signals, company page analytics, and publishing support.",
        dataScope: ["Posts", "Audience", "Engagement", "Publishing"],
        permissionScope: "Company page ID + OAuth token",
        primaryField: "companyUrl",
        fields: [
          { key: "companyUrl", label: "Company URL", placeholder: "https://linkedin.com/company/brand", required: true },
          { key: "companyId", label: "Company ID", placeholder: "LinkedIn company ID" },
          { key: "accessToken", label: "Access token", placeholder: "LinkedIn OAuth token", type: "password" }
        ]
      }
    ]
  },
  {
    id: "analytics",
    title: "Analytics & Tracking",
    description: "Traffic, conversions, landing pages, attribution, search visibility, and tracking infrastructure.",
    integrations: [
      {
        id: "ga4",
        sourceKey: "analytics",
        label: "Google Analytics / GA4",
        icon: "GA",
        purpose: "Traffic, sessions, engaged sessions, events, conversions, and landing-page intelligence.",
        whyItMatters: "GA4 is the foundation for understanding what content and channels actually drive sessions and conversions.",
        enables: "Traffic intelligence, events, conversions, attribution, landing pages, and engagement analysis.",
        dataScope: ["Traffic", "Sessions", "Events", "Conversions", "Landing pages"],
        permissionScope: "Property ID + service account or OAuth token",
        critical: true,
        primaryField: "propertyId",
        fields: [
          { key: "propertyId", label: "GA4 property ID", placeholder: "GA4 property ID", required: true },
          { key: "measurementId", label: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
          { key: "accessToken", label: "Access token", placeholder: "GA4 access token", type: "password" }
        ]
      },
      {
        id: "gtm",
        sourceKey: "google",
        label: "Google Tag Manager",
        icon: "TM",
        purpose: "Tracking container management for tags, events, and analytics instrumentation.",
        whyItMatters: "GTM makes data collection more reliable and keeps tracking flexible as MH Assistant grows.",
        enables: "Tag management, event instrumentation, pixel deployment, and attribution support.",
        dataScope: ["Tags", "Events", "Tracking config"],
        permissionScope: "Container ID + workspace access",
        primaryField: "containerId",
        fields: [
          { key: "containerId", label: "Container ID", placeholder: "GTM-XXXXXXX", required: true },
          { key: "workspaceId", label: "Workspace ID", placeholder: "GTM workspace ID" },
          { key: "accessToken", label: "Access token", placeholder: "GTM access token", type: "password" }
        ]
      },
      {
        id: "meta-pixel",
        sourceKey: "facebook",
        label: "Meta Pixel",
        icon: "MP",
        purpose: "Meta tracking layer for conversions, events, and paid attribution support.",
        whyItMatters: "Meta Pixel improves ad attribution, conversion feedback, and optimization quality.",
        enables: "Event tracking, conversion reporting, paid attribution, and audience learning.",
        dataScope: ["Events", "Conversions", "Attribution"],
        permissionScope: "Pixel ID + business token",
        primaryField: "pixelId",
        fields: [
          { key: "pixelId", label: "Pixel ID", placeholder: "Meta pixel ID", required: true },
          { key: "adAccountId", label: "Ad account ID", placeholder: "act_123..." },
          { key: "accessToken", label: "Access token", placeholder: "Meta access token", type: "password" }
        ]
      },
      {
        id: "tiktok-pixel",
        sourceKey: "tiktok",
        label: "TikTok Pixel",
        icon: "TP",
        purpose: "TikTok conversion tracking layer for paid and organic destination analysis.",
        whyItMatters: "TikTok Pixel improves measurement of short-form content and paid traffic impact.",
        enables: "Events, conversion tracking, attribution, and paid optimization support.",
        dataScope: ["Events", "Conversions", "Attribution"],
        permissionScope: "Pixel ID + business token",
        primaryField: "pixelId",
        fields: [
          { key: "pixelId", label: "Pixel ID", placeholder: "TikTok pixel ID", required: true },
          { key: "accountId", label: "Account ID", placeholder: "TikTok Ads account ID" },
          { key: "accessToken", label: "Access token", placeholder: "TikTok token", type: "password" }
        ]
      },
      {
        id: "search-console",
        sourceKey: "google",
        label: "Search Console",
        icon: "SC",
        purpose: "Search performance, queries, clicks, CTR, impressions, and SEO opportunity intelligence.",
        whyItMatters: "Search Console teaches the system which pages and themes are earning visibility and where optimization should happen next.",
        enables: "Queries, clicks, CTR, positions, top pages, and SEO opportunity analysis.",
        dataScope: ["Queries", "Pages", "CTR", "Impressions", "Positions"],
        permissionScope: "Property URL + Search Console auth",
        critical: true,
        primaryField: "propertyUrl",
        fields: [
          { key: "propertyUrl", label: "Property URL", placeholder: "https://brand.com", required: true },
          { key: "siteDomain", label: "Domain property", placeholder: "sc-domain:brand.com" },
          { key: "accessToken", label: "Access token", placeholder: "Search Console token", type: "password" }
        ]
      },
      {
        id: "custom-analytics",
        sourceKey: "analytics",
        label: "Custom Analytics Endpoint",
        icon: "CA",
        purpose: "Future-ready import endpoint for internal or custom analytics feeds.",
        whyItMatters: "Custom analytics helps unify nonstandard data sources without redesigning the intelligence layer.",
        enables: "Custom event ingest, proprietary reporting, and historical import.",
        dataScope: ["Events", "Traffic", "Conversions", "Custom dimensions"],
        permissionScope: "Endpoint URL + auth token",
        primaryField: "endpointUrl",
        fields: [
          { key: "endpointUrl", label: "Endpoint URL", placeholder: "https://api.brand.com/analytics", required: true },
          { key: "clientId", label: "Client ID", placeholder: "Analytics client ID" },
          { key: "accessToken", label: "Access token", placeholder: "API token", type: "password" }
        ]
      }
    ]
  },
  {
    id: "email-crm",
    title: "Email & CRM",
    description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",
    integrations: [
      {
        id: "smtp",
        sourceKey: "email",
        backendSupported: false,
        unavailableReason: "Backend provider support is not configured yet.",
        label: "SMTP / Email Sending",
        icon: "SM",
        purpose: "Transactional and campaign email sending through SMTP or relay infrastructure.",
        whyItMatters: "Email is critical for lifecycle recovery, conversion support, and owned audience communication.",
        enables: "Campaign sending, lifecycle messages, and email workflow execution.",
        dataScope: ["Sending", "Delivery", "Campaign email", "Lifecycle email"],
        permissionScope: "SMTP host + port + sender + auth",
        critical: true,
        primaryField: "senderEmail",
        fields: [
          { key: "senderEmail", label: "Sender email", placeholder: "support@brand.com", required: true },
          { key: "smtpHost", label: "SMTP host", placeholder: "smtp.provider.com", required: true },
          { key: "smtpPort", label: "SMTP port", placeholder: "587" }
        ]
      },
      {
        id: "mailer",
        sourceKey: "email",
        backendSupported: false,
        unavailableReason: "Backend provider support is not configured yet.",
        label: "Mailer Integration",
        icon: "ML",
        purpose: "Provider-specific email platform integration for campaigns and audience workflows.",
        whyItMatters: "A mailer integration improves sending reliability, segmentation, and performance tracking.",
        enables: "Campaign sends, audience sync, templates, and performance reporting.",
        dataScope: ["Campaigns", "Audiences", "Templates", "Performance"],
        permissionScope: "Provider API key + sender domain",
        primaryField: "providerName",
        fields: [
          { key: "providerName", label: "Provider name", placeholder: "SendGrid / Mailgun / Resend", required: true },
          { key: "apiKey", label: "API key", placeholder: "Mailer API key", type: "password" },
          { key: "senderDomain", label: "Sender domain", placeholder: "brand.com" }
        ]
      },
      {
        id: "mailchimp",
        sourceKey: "email",
        label: "Mailchimp",
        icon: "MC",
        purpose: "Future-ready newsletter, audience, and campaign sync through Mailchimp.",
        whyItMatters: "Mailchimp can expand owned audience growth and newsletter performance feedback.",
        enables: "Audience sync, campaigns, lists, and newsletter reporting.",
        dataScope: ["Contacts", "Campaigns", "Segments", "Performance"],
        permissionScope: "Audience ID + API key",
        primaryField: "audienceId",
        fields: [
          { key: "audienceId", label: "Audience ID", placeholder: "Mailchimp audience ID", required: true },
          { key: "apiKey", label: "API key", placeholder: "Mailchimp API key", type: "password" },
          { key: "serverPrefix", label: "Server prefix", placeholder: "us1" }
        ]
      },
      {
        id: "crm",
        sourceKey: "analytics",
        backendSupported: false,
        unavailableReason: "Backend provider support is not configured yet.",
        label: "CRM Integration",
        icon: "CR",
        purpose: "Customer record sync for lead, customer, and lifecycle intelligence.",
        whyItMatters: "CRM data helps the system connect campaigns to pipeline, customers, and repeat purchase behavior.",
        enables: "Contact sync, customer sync, lead intelligence, and lifecycle learning.",
        dataScope: ["Contacts", "Customers", "Leads", "Lifecycle state"],
        permissionScope: "CRM account ID + API token",
        primaryField: "workspaceId",
        fields: [
          { key: "workspaceId", label: "Workspace / account ID", placeholder: "CRM workspace ID", required: true },
          { key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },
          { key: "pipelineId", label: "Pipeline ID", placeholder: "Primary pipeline ID" }
        ]
      }
    ]
  },
  {
    id: "ads",
    title: "Ads Platforms",
    description: "Paid campaign accounts, spend import, creative performance, and optimization signals.",
    integrations: [
      {
        id: "meta-ads",
        sourceKey: "facebook",
        label: "Meta Ads",
        icon: "MA",
        purpose: "Campaign, ad set, creative, spend, CTR, CPC, CPA, and ROAS intelligence from Meta Ads.",
        whyItMatters: "Meta Ads data helps the system learn what paid campaigns and creatives deserve scaling or pausing.",
        enables: "Spend sync, campaign import, creative performance, and paid optimization.",
        dataScope: ["Spend", "CTR", "CPC", "CPA", "ROAS", "Campaigns", "Creatives"],
        permissionScope: "Ad account ID + access token",
        critical: true,
        primaryField: "adAccountId",
        fields: [
          { key: "adAccountId", label: "Ad account ID", placeholder: "act_123456789", required: true },
          { key: "businessId", label: "Business ID", placeholder: "Meta business ID" },
          { key: "accessToken", label: "Access token", placeholder: "Meta ads token", type: "password" }
        ]
      },
      {
        id: "google-ads",
        sourceKey: "google_ads",
        label: "Google Ads",
        icon: "GA",
        purpose: "Campaign, keyword, spend, CTR, CPC, CPA, and ROAS intelligence from Google Ads.",
        whyItMatters: "Google Ads data shows which search or demand-capture campaigns actually generate efficient traffic and revenue.",
        enables: "Spend sync, campaign import, keyword performance, and paid optimization.",
        dataScope: ["Spend", "CTR", "CPC", "CPA", "ROAS", "Campaigns", "Creatives"],
        permissionScope: "Customer ID + OAuth token",
        critical: true,
        primaryField: "customerId",
        fields: [
          { key: "customerId", label: "Customer ID", placeholder: "123-456-7890", required: true },
          { key: "managerId", label: "Manager / MCC ID", placeholder: "Google Ads MCC ID" },
          { key: "refreshToken", label: "Refresh token", placeholder: "Google Ads refresh token", type: "password" }
        ]
      },
      {
        id: "tiktok-ads",
        sourceKey: "tiktok",
        label: "TikTok Ads",
        icon: "TA",
        purpose: "Campaign, creative, spend, and performance intelligence from TikTok Ads.",
        whyItMatters: "TikTok Ads data helps connect short-form content learning to actual paid outcomes.",
        enables: "Spend sync, campaign import, creative performance, and short-form paid optimization.",
        dataScope: ["Spend", "CTR", "CPC", "CPA", "ROAS", "Campaigns", "Creatives"],
        permissionScope: "Advertiser ID + access token",
        primaryField: "advertiserId",
        fields: [
          { key: "advertiserId", label: "Advertiser ID", placeholder: "TikTok advertiser ID", required: true },
          { key: "accountScope", label: "Account scope", placeholder: "Region / business scope" },
          { key: "accessToken", label: "Access token", placeholder: "TikTok ads token", type: "password" }
        ]
      }
    ]
  },
  {
    id: "ops",
    title: "AI / Automation / Ops Tools",
    description: "Workspace, automation, webhook, and operations tools that keep workflows moving.",
    integrations: [
      {
        id: "google-drive",
        sourceKey: "google",
        label: "Google Drive",
        icon: "GD",
        purpose: "File sync and shared asset operations through Google Drive.",
        whyItMatters: "Drive helps centralize asset references, shared documents, and working files for campaigns and analysis.",
        enables: "Asset sync, doc sync, shared files, and automation inputs.",
        dataScope: ["Files", "Documents", "Shared assets"],
        permissionScope: "Drive folder ID + OAuth token",
        primaryField: "folderId",
        fields: [
          { key: "folderId", label: "Folder ID", placeholder: "Google Drive folder ID", required: true },
          { key: "workspaceEmail", label: "Workspace email", placeholder: "ops@brand.com" },
          { key: "accessToken", label: "Access token", placeholder: "Drive OAuth token", type: "password" }
        ]
      },
      {
        id: "slack",
        sourceKey: "analytics",
        label: "Slack",
        icon: "SL",
        purpose: "Operational alerting, workflow notifications, and team collaboration handoff.",
        whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",
        enables: "Alerts, approvals, sync notifications, and workflow coordination.",
        dataScope: ["Notifications", "Approvals", "Ops alerts"],
        permissionScope: "Workspace ID + bot token",
        primaryField: "workspaceId",
        fields: [
          { key: "workspaceId", label: "Workspace ID", placeholder: "Slack workspace ID", required: true },
          { key: "channelId", label: "Channel ID", placeholder: "Channel ID for alerts" },
          { key: "botToken", label: "Bot token", placeholder: "xoxb-...", type: "password" }
        ]
      },
      {
        id: "telegram",
        sourceKey: "analytics",
        label: "Telegram",
        icon: "TG",
        purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",
        whyItMatters: "Telegram can keep MH Assistant responsive when quick approvals or notifications are needed.",
        enables: "Alerts, commands, approval handoff, and ops notifications.",
        dataScope: ["Alerts", "Commands", "Approvals"],
        permissionScope: "Bot token + chat ID",
        primaryField: "botName",
        fields: [
          { key: "botName", label: "Bot / workspace name", placeholder: "MH Assistant Ops Bot", required: true },
          { key: "chatId", label: "Chat ID", placeholder: "Telegram chat ID" },
          { key: "botToken", label: "Bot token", placeholder: "Telegram bot token", type: "password" }
        ]
      },
      {
        id: "notion",
        sourceKey: "analytics",
        label: "Notion",
        icon: "NO",
        purpose: "Knowledge, briefs, campaign docs, and structured planning data inside Notion.",
        whyItMatters: "Notion can hold reusable knowledge the system references for campaigns, SEO, and content execution.",
        enables: "Docs sync, planning sync, task context, and knowledge reuse.",
        dataScope: ["Docs", "Plans", "Knowledge", "Tasks"],
        permissionScope: "Workspace + integration token",
        primaryField: "workspaceName",
        fields: [
          { key: "workspaceName", label: "Workspace name", placeholder: "Brand Ops Workspace", required: true },
          { key: "databaseId", label: "Database ID", placeholder: "Primary Notion database ID" },
          { key: "accessToken", label: "Integration token", placeholder: "Notion token", type: "password" }
        ]
      },
      {
        id: "zapier-make",
        sourceKey: "analytics",
        label: "Zapier / Make",
        icon: "ZM",
        purpose: "Automation routing for triggers, syncs, approvals, and external workflow handoffs.",
        whyItMatters: "Automation reduces manual ops work and makes data movement between tools much more reliable.",
        enables: "Workflow automation, triggers, sync jobs, and handoffs.",
        dataScope: ["Automations", "Triggers", "Sync jobs"],
        permissionScope: "Webhook or scenario endpoint",
        primaryField: "endpointUrl",
        fields: [
          { key: "endpointUrl", label: "Webhook / scenario URL", placeholder: "https://hooks.zapier.com/...", required: true },
          { key: "workspaceId", label: "Workspace / scenario ID", placeholder: "Zap / Make scenario ID" },
          { key: "secretKey", label: "Secret key", placeholder: "Automation secret", type: "password" }
        ]
      },
      {
        id: "webhook",
        sourceKey: "analytics",
        label: "Internal Webhook",
        icon: "WH",
        purpose: "Internal system-to-system webhook integration for custom workflows and events.",
        whyItMatters: "Internal webhooks let MH Assistant plug into custom business systems without a new UI redesign.",
        enables: "Custom events, syncs, notifications, and system handoffs.",
        dataScope: ["Custom events", "Payloads", "Sync triggers"],
        permissionScope: "Webhook URL + auth secret",
        primaryField: "webhookUrl",
        fields: [
          { key: "webhookUrl", label: "Webhook URL", placeholder: "https://ops.brand.com/webhook", required: true },
          { key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },
          { key: "secretKey", label: "Secret key", placeholder: "Webhook secret", type: "password" }
        ]
      }
    ]
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

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0%";
  return `${Math.max(0, Math.round(parsed))}%`;
}

function formatDateTime(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return asString(value);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getAllIntegrations() {
  return INTEGRATION_DOMAINS.flatMap((domain) =>
    domain.integrations.map((integration) => ({
      ...integration,
      domainId: domain.id,
      domainTitle: domain.title
    }))
  );
}

function getIntegrationById(integrationId) {
  return getAllIntegrations().find((item) => item.id === integrationId) || null;
}

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!integrationSessions.has(key)) {
    integrationSessions.set(key, {
      drafts: {},
      selectedIntegrationId: "",
      categoryFilter: "all",
      statusFilter: "all",
      searchQuery: "",
      activeDrawerIntegrationId: "",
      drawerOpen: false,
      validationIntegrationId: "",
      validationFieldKey: "",
      validationMessage: ""
    });
  }
  return integrationSessions.get(key);
}

function openIntegrationDrawer(session, integrationId) {
  session.selectedIntegrationId = integrationId || "";
  session.activeDrawerIntegrationId = integrationId || "";
  session.drawerOpen = Boolean(integrationId);
}

function closeIntegrationDrawer(session) {
  session.drawerOpen = false;
  session.activeDrawerIntegrationId = "";
  session.validationIntegrationId = "";
  session.validationFieldKey = "";
  session.validationMessage = "";
}

function setIntegrationValidation(session, integrationId, fieldKey, message) {
  session.validationIntegrationId = integrationId || "";
  session.validationFieldKey = fieldKey || "";
  session.validationMessage = message || "";
}

function clearIntegrationValidation(session, integrationId, fieldKey) {
  const sameIntegration = !integrationId || session.validationIntegrationId === integrationId;
  const sameField = !fieldKey || session.validationFieldKey === fieldKey;
  if (!sameIntegration || !sameField) return;
  session.validationIntegrationId = "";
  session.validationFieldKey = "";
  session.validationMessage = "";
}

function normalizeSuggestedUrl(value) {
  const text = asString(value).trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return `https://${text}`;
}

function getSuggestedHostname(value) {
  const normalized = normalizeSuggestedUrl(value);
  if (!normalized) return "";
  try {
    return new URL(normalized).hostname.replace(/^www\./i, "");
  } catch (_) {
    return "";
  }
}

function getProjectSetupOverview(state) {
  return asObject(state.data?.overview?.overview);
}

function getSuggestedFieldValue(state, integration, field) {
  const overview = getProjectSetupOverview(state);
  const websiteUrl = normalizeSuggestedUrl(overview.website_url);
  const hostname = getSuggestedHostname(websiteUrl);

  if (!websiteUrl && !hostname) return "";

  if (integration.id === "website" && field.key === "url") {
    return websiteUrl;
  }
  if (integration.id === "website" && field.key === "webhookUrl" && websiteUrl) {
    try {
      return `${new URL(websiteUrl).origin}/webhooks/mh`;
    } catch (_) {
      return "";
    }
  }
  if (integration.id === "woocommerce" && field.key === "storeUrl") {
    return websiteUrl;
  }
  if (integration.id === "search-console" && field.key === "propertyUrl") {
    return websiteUrl;
  }
  if (integration.id === "search-console" && field.key === "siteDomain" && hostname) {
    return `sc-domain:${hostname}`;
  }
  if (integration.id === "mailer" && field.key === "senderDomain") {
    return hostname;
  }

  return "";
}

function getResolvedFieldValue(state, session, integration, field, record, sourceValue) {
  const draft = ensureDraft(session, integration.id);
  if (draft[field.key] != null) return draft[field.key];
  if (isSecretField(field)) return "";
  const suggested = getSuggestedFieldValue(state, integration, field);
  if (field.key === integration.primaryField) {
    return asString(record.primary_value || sourceValue || record.config?.[field.key] || suggested);
  }
  return asString(record.config?.[field.key] || suggested);
}

function getQuickConnectLabel(integration) {
  if (["ga4", "gtm", "search-console", "youtube", "google-ads", "google-drive"].includes(integration.id)) {
    return "Connect with Google";
  }
  if (["facebook", "instagram", "meta-pixel", "meta-ads"].includes(integration.id)) {
    return "Connect with Meta";
  }
  if (integration.id === "shopify") {
    return "Connect with Shopify";
  }
  return "";
}

function getSmartConnectLabel(card) {
  if (card.backendSupported === false) return "Open setup";
  if (card.statusLabel === "Connected") return "Manage Connection";
  if (card.statusLabel === "Partial") return "Complete Setup";
  if (card.statusLabel === "Token expired") return "Reconnect Now";
  if (card.statusLabel === "Error") return "Fix Connection";
  return getQuickConnectLabel(card) || (card.id === "website" ? "Connect Website" : `Connect ${card.label}`);
}

function getDrawerPrimaryAction(card) {
  if (card.backendSupported === false) {
    return { action: "select", label: "Open setup" };
  }
  if (card.statusLabel === "Connected") {
    return { action: "sync", label: "Sync Now" };
  }
  if (["Token expired", "Error"].includes(card.statusLabel)) {
    return { action: "reconnect", label: getSmartConnectLabel(card) };
  }
  return { action: "connect", label: getSmartConnectLabel(card) };
}

function buildSuggestedValues(state, integration) {
  return integration.fields.reduce((accumulator, field) => {
    const suggested = getSuggestedFieldValue(state, integration, field);
    if (suggested) {
      accumulator[field.key] = suggested;
    }
    return accumulator;
  }, {});
}

function ensureDraft(session, integrationId) {
  if (!session.drafts[integrationId]) {
    session.drafts[integrationId] = {};
  }
  return session.drafts[integrationId];
}

function clearDraft(session, integrationId) {
  delete session.drafts[integrationId];
}

function setFieldValue(session, integrationId, fieldKey, value) {
  const draft = ensureDraft(session, integrationId);
  draft[fieldKey] = value;
}

function isSecretField(field) {
  return field?.type === "password";
}

function requiresCredential(integration) {
  if (!integration?.fields?.some(isSecretField)) {
    return false;
  }

  return !["website"].includes(integration.id);
}

function shouldSyncLegacySource(integration) {
  return [
    "website",
    "woocommerce",
    "shopify",
    "amazon",
    "ebay",
    "facebook",
    "instagram",
    "tiktok",
    "youtube",
    "linkedin",
    "ga4",
    "search-console",
    "custom-analytics",
    "smtp",
    "google-ads"
  ].includes(integration.id);
}

function getControlCenterPayload(state) {
  return asObject(asObject(state.data?.integrations).control_center);
}

function getControlCenterRecords(state) {
  return asObject(getControlCenterPayload(state).records);
}

function getLegacySources(state) {
  return asObject(asObject(asObject(state.data?.integrations).sources).sources);
}

function getLegacySourceValue(integration, sources) {
  const source = asObject(sources[integration.sourceKey]);
  return asString(source.value);
}

function inferScopeKeys(integration) {
  const sourceText = [
    integration.label,
    integration.purpose,
    integration.enables,
    ...asArray(integration.dataScope)
  ]
    .join(" ")
    .toLowerCase();

  const rules = [
    { key: "posts", pattern: /post|reel|video|comment|publishing|profile|channel/ },
    { key: "insights", pattern: /insight|engagement|watch|audience|query|ctr|position|seo|analytics|performance/ },
    { key: "ads", pattern: /ads?|campaign|creative|spend|cpc|cpa|roas|pixel/ },
    { key: "traffic", pattern: /traffic|session|landing|page|event|tag|attribution|website/ },
    { key: "orders", pattern: /order|sale|revenue|product|listing|merchant|customer|contact|lead/ }
  ];

  return rules
    .filter((rule) => rule.pattern.test(sourceText))
    .map((rule) => rule.key);
}

function getIntegrationAccessModel(integration) {
  const scopeKeys = inferScopeKeys(integration);

  if (integration.domainId === "social") {
    return {
      read: [...new Set(["posts", "insights", ...scopeKeys])],
      write: ["publishing", "audience updates"]
    };
  }

  if (integration.domainId === "website-commerce") {
    if (integration.id === "website") {
      return {
        read: [...new Set(["traffic", "landing pages", "conversion paths", ...scopeKeys])],
        write: ["webhooks", "site updates"]
      };
    }

    return {
      read: [...new Set(["products", "orders", "sales", ...scopeKeys])],
      write: ["catalog sync", "commerce updates"]
    };
  }

  if (integration.domainId === "analytics") {
    return {
      read: [...new Set(["traffic", "events", "conversions", "seo", ...scopeKeys])],
      write: ["tracking updates"]
    };
  }

  if (integration.domainId === "email-crm") {
    return {
      read: [...new Set(["contacts", "campaign performance", ...scopeKeys])],
      write: ["campaign sends", "audience sync"]
    };
  }

  if (integration.domainId === "ads") {
    return {
      read: [...new Set(["ads", "spend", "campaigns", "creative performance", ...scopeKeys])],
      write: ["budget changes", "campaign updates"]
    };
  }

  return {
    read: [...new Set(["workflow events", "shared files", ...scopeKeys])],
    write: ["automation triggers", "notifications"]
  };
}

function buildLegacyFallbackRecord(integration, state) {
  if (!shouldSyncLegacySource(integration)) {
    return {};
  }

  const sources = getLegacySources(state);
  const value = getLegacySourceValue(integration, sources);

  if (!value) {
    return {};
  }

  const accessModel = getIntegrationAccessModel(integration);

  return {
    integration_id: integration.id,
    source_key: integration.sourceKey,
    status: "connected",
    status_label: "Connected",
    primary_field: integration.primaryField,
    primary_value: value,
    config: {},
    credential_state: {},
    data_scopes: inferScopeKeys(integration),
    read_scopes: accessModel.read,
    write_scopes: accessModel.write,
    permission_scope: integration.permissionScope,
    enables: integration.enables,
    health_summary: "Connected through the legacy source registry.",
    notes: "This integration is currently inferred from the legacy project source mapping.",
    last_sync_at: asString(asObject(sources[integration.sourceKey]).updated_at),
    updated_at: asString(asObject(sources[integration.sourceKey]).updated_at),
    legacy_source: true
  };
}

function getServerRecord(state, integration) {
  const record = asObject(getControlCenterRecords(state)[integration.id]);
  if (record.integration_id) {
    return record;
  }

  return buildLegacyFallbackRecord(integration, state);
}

function getFieldValue(session, integration, field, record, sourceValue, suggestedValue = "") {
  const draft = ensureDraft(session, integration.id);
  if (draft[field.key] != null) return draft[field.key];
  if (isSecretField(field)) return "";
  if (field.key === integration.primaryField) {
    return asString(record.primary_value || sourceValue || record.config?.[field.key] || suggestedValue);
  }
  return asString(record.config?.[field.key] || suggestedValue);
}

function hasSavedServerCredential(record, fieldKey) {
  return Boolean(asObject(record.credential_state)[fieldKey]?.is_set);
}

function getLocalFillCount(session, integration, record, sourceValue, state) {
  return integration.fields.filter((field) => {
    const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();
    return Boolean(value) || (isSecretField(field) && hasSavedServerCredential(record, field.key));
  }).length;
}

function getRequiredMissing(session, integration, record, sourceValue, state) {
  return integration.fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();
      return !value && !(isSecretField(field) && hasSavedServerCredential(record, field.key));
    })
    .map((field) => field.label);
}

function normalizeStatusLabel(statusLabel, fallback = "Not Connected") {
  const normalized = asString(statusLabel).trim().toLowerCase();

  if (normalized === "unavailable") return "Unavailable";
  if (normalized === "connected") return "Connected";
  if (normalized === "partial") return "Partial";
  if (normalized === "error") return "Error";
  if (normalized === "token expired" || normalized === "token_expired") return "Token expired";
  if (normalized === "not connected" || normalized === "not_connected") return "Not Connected";

  return fallback;
}

function getHealthSummary(statusLabel, record, integration) {
  if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
    return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
  }

  if (asString(record.health_summary).trim()) {
    return asString(record.health_summary).trim();
  }

  if (statusLabel === "Connected") {
    return `${integration.label} is connected and ready for provider-level sync actions.`;
  }
  if (statusLabel === "Partial") {
    return "Some required connection details are still missing.";
  }
  if (statusLabel === "Token expired") {
    return "Reconnect the saved token before importing or syncing new data.";
  }
  if (statusLabel === "Error") {
    return asString(record.last_error) || "The last action failed. Review the connection inputs and try again.";
  }
  return "This integration has not been configured yet.";
}

function buildIntegrationCardModel(integration, session, state) {
  const sourceValue = getLegacySourceValue(integration, getLegacySources(state));
  const record = getServerRecord(state, integration);
  const backendSupported = integration.backendSupported !== false && !UNSUPPORTED_INTEGRATION_IDS.has(integration.id);
  const statusLabel = backendSupported
    ? normalizeStatusLabel(record.status_label || record.status)
    : "Unavailable";
  const localFillCount = getLocalFillCount(session, integration, record, sourceValue, state);
  const missingRequired = getRequiredMissing(session, integration, record, sourceValue, state);
  const totalFields = integration.fields.length;
  const accessModel = getIntegrationAccessModel(integration);
  const dataScopes = asArray(record.data_scopes).length
    ? asArray(record.data_scopes).map(titleCase)
    : inferScopeKeys(integration).map(titleCase);
  const suggestedValues = buildSuggestedValues(state, integration);

  return {
    ...integration,
    backendSupported,
    record,
    sourceValue: asString(record.primary_value || sourceValue),
    statusLabel,
    statusKey: statusLabel.toLowerCase().replace(/\s+/g, "_"),
    statusTone:
      statusLabel === "Connected" ? "success" :
      statusLabel === "Unavailable" ? "danger" :
      statusLabel === "Partial" ? "warning" :
      statusLabel === "Token expired" ? "warning" :
      statusLabel === "Error" ? "danger" :
      "neutral",
    dataScopes,
    dataScopeSummary: dataScopes.join(", "),
    readScopes: asArray(record.read_scopes).length ? asArray(record.read_scopes) : accessModel.read,
    writeScopes: asArray(record.write_scopes).length ? asArray(record.write_scopes) : accessModel.write,
    credentialState: asObject(record.credential_state),
    suggestedValues,
    missingRequired: backendSupported ? missingRequired : [],
    lastSync: asString(record.last_sync_at),
    lastImport: asString(record.last_import_at),
    lastTest: asString(record.last_test_at),
    healthSummary: getHealthSummary(statusLabel, record, integration),
    notes: !backendSupported
      ? (asString(integration.unavailableReason) || "Backend provider support is not configured yet.")
      : asString(record.notes) || (integration.critical && statusLabel !== "Connected"
      ? "Critical integration missing for full system capability."
      : "Credentials are saved server-side and only masked status returns to the UI."),
    localFillCount,
    totalFields,
    permissionScopeSummary: asString(record.permission_scope) || integration.permissionScope,
    enablesSummary: asString(record.enables) || integration.enables
  };
}

function buildDomainModels(state, session) {
  return INTEGRATION_DOMAINS.map((domain) => {
    const cards = domain.integrations.map((integration) =>
      buildIntegrationCardModel(
        {
          ...integration,
          domainId: domain.id,
          domainTitle: domain.title
        },
        session,
        state
      )
    );
    const connectedCount = cards.filter((card) => card.statusLabel === "Connected").length;
    const partialCount = cards.filter((card) => card.statusLabel === "Partial").length;
    const blockedCount = cards.filter((card) => ["Not Connected", "Error", "Token expired"].includes(card.statusLabel)).length;

    return {
      ...domain,
      cards,
      connectedCount,
      partialCount,
      blockedCount
    };
  });
}

function getConnectorWorkspaceAction(card) {
  const statusKey = getConnectorWorkspaceStatus(card);

  if (card.backendSupported === false) {
    return { label: "Open setup", action: "select" };
  }

  if (statusKey === "connected") {
    return {
      label: card.lastSync ? "Test" : "Sync",
      action: card.lastSync ? "test" : "sync"
    };
  }

  if (statusKey === "failed") {
    return { label: getSmartConnectLabel(card), action: "reconnect" };
  }

  if (statusKey === "needs_setup") {
    return { label: getSmartConnectLabel(card), action: "select" };
  }

  return { label: getSmartConnectLabel(card), action: "connect" };
}

function focusDrawerField(session, card) {
  if (!session.drawerOpen || !card || typeof window === "undefined") return;

  const requiredEmptyField = card.fields.find((field) =>
    field.required && card.missingRequired.includes(field.label)
  );
  const fieldKey = session.validationFieldKey || requiredEmptyField?.key || card.fields[0]?.key;
  if (!fieldKey) return;

  window.requestAnimationFrame(() => {
    const input = document.querySelector(`[data-integration-drawer] [data-integration-field="${card.id}"][data-field-key="${fieldKey}"]`);
    if (input instanceof HTMLElement) {
      input.scrollIntoView({ block: "center", behavior: "smooth" });
      input.focus();
      if (typeof input.select === "function" && input.tagName === "INPUT") {
        input.select();
      }
    }
  });
}

function bindIntegrationActions({
  getState,
  $,
  navigateTo,
  showMessage,
  showError,
  reloadProjectData,
  connectProjectIntegration,
  reconnectProjectIntegration,
  testProjectIntegration,
  syncProjectIntegration,
  importProjectIntegrationHistory,
  disconnectProjectIntegration,
  projectName,
  session,
  render
}) {
  Array.from(document.querySelectorAll("[data-integration-select]")).forEach((button) => {
    button.onclick = () => {
      const integrationId = button.getAttribute("data-integration-select") || "";
      openIntegrationDrawer(session, integrationId);
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-primary]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-integration-primary") || "";
      const integrationId = button.getAttribute("data-integration-id") || "";
      openIntegrationDrawer(session, integrationId);

      if (action === "manage") {
        render();
        return;
      }

      if (action === "unavailable") {
        render();
        return;
      }

      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-field]")).forEach((input) => {
    input.oninput = (event) => {
      const integrationId = input.getAttribute("data-integration-field") || "";
      const fieldKey = input.getAttribute("data-field-key") || "";
      const nextValue = event.target.value || "";
      setFieldValue(session, integrationId, fieldKey, nextValue);
      if (asString(nextValue).trim()) {
        clearIntegrationValidation(session, integrationId, fieldKey);
      }
    };
  });

  Array.from(document.querySelectorAll("[data-integration-field-helper]")).forEach((helper) => {
    const [integrationId, fieldKey] = asString(helper.getAttribute("data-integration-field-helper")).split(":");
    const integration = getIntegrationById(integrationId);
    const state = getState();
    const record = integration ? getServerRecord(state, integration) : {};
    const field = integration?.fields?.find((item) => item.key === fieldKey);

    if (!field) {
      helper.textContent = "";
      return;
    }

    if (isSecretField(field) && hasSavedServerCredential(record, field.key)) {
      helper.textContent = "Saved securely on server. Leave blank to keep the current secret.";
      return;
    }

    if (session.validationIntegrationId === integrationId && session.validationFieldKey === fieldKey && session.validationMessage) {
      helper.textContent = session.validationMessage;
      return;
    }

    helper.textContent = field.required
      ? "Required for a complete connection."
      : "Optional, but useful for scoping and diagnostics.";
  });

  Array.from(document.querySelectorAll("[data-integration-category-filter]")).forEach((select) => {
    select.onchange = (event) => {
      session.categoryFilter = event.target.value || "all";
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-status-filter]")).forEach((select) => {
    select.onchange = (event) => {
      session.statusFilter = event.target.value || "all";
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-search]")).forEach((input) => {
    input.oninput = (event) => {
      session.searchQuery = event.target.value || "";
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-drawer-close]")).forEach((button) => {
    button.onclick = () => {
      closeIntegrationDrawer(session);
      render();
    };
  });

  function buildConnectionPayload(integrationId) {
    const integration = getIntegrationById(integrationId);
    if (!integration) return null;

    const state = getState();
    const record = getServerRecord(state, integration);
    const draft = ensureDraft(session, integration.id);
    const config = {};
    const credentials = {};

    integration.fields.forEach((field) => {
      const resolvedValue = asString(getResolvedFieldValue(state, session, integration, field, record, getLegacySourceValue(integration, getLegacySources(state)))).trim();

      if (field.key === integration.primaryField) {
        return;
      }

      if (isSecretField(field)) {
        const draftValue = asString(draft[field.key]).trim();
        if (draftValue) {
          credentials[field.key] = draftValue;
        }
        return;
      }

      if (resolvedValue) {
        config[field.key] = resolvedValue;
      }
    });

    const primaryValue = asString(getResolvedFieldValue(
      state,
      session,
      integration,
      integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0],
      record,
      getLegacySourceValue(integration, getLegacySources(state))
    )).trim();

    const accessModel = getIntegrationAccessModel(integration);

    return {
      source_key: integration.sourceKey,
      primary_field: integration.primaryField,
      primary_value: primaryValue,
      config,
      credentials,
      auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
      required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
      requires_credentials: requiresCredential(integration),
      data_scopes: inferScopeKeys(integration),
      read_scopes: accessModel.read,
      write_scopes: accessModel.write,
      connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
      permission_scope: integration.permissionScope,
      enables: integration.enables,
      sync_source_registry: shouldSyncLegacySource(integration)
    };
  }

  async function persistPrimary(integrationId, reconnect = false) {
    const integration = getIntegrationById(integrationId);
    if (!integration) return;
    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
      return;
    }
    const payload = buildConnectionPayload(integrationId);
    const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
    const value = asString(payload?.primary_value).trim();

    if (!value) {
      setIntegrationValidation(
        session,
        integrationId,
        primaryField.key,
        `Add ${primaryField.label.toLowerCase()} to continue.`
      );
      openIntegrationDrawer(session, integrationId);
      render();
      showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
      return;
    }

    try {
      if (reconnect) {
        await reconnectProjectIntegration(projectName, integrationId, payload);
      } else {
        await connectProjectIntegration(projectName, integrationId, payload);
      }
      clearDraft(session, integrationId);
      clearIntegrationValidation(session, integrationId);
      showMessage?.(reconnect ? `${integration.label} reconnected.` : `${integration.label} connected.`);
      await reloadProjectData(projectName);
      render();
    } catch (error) {
      showError?.(error.message || `Failed to connect ${integration.label}.`);
    }
  }

  async function disconnect(integrationId) {
    const integration = getIntegrationById(integrationId);
    if (!integration) return;
    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
      return;
    }

    try {
      await disconnectProjectIntegration(projectName, integrationId, {
        notes: `${integration.label} disconnected from the Control Center.`
      });
      clearDraft(session, integrationId);
      showMessage?.(`${integration.label} disconnected.`);
      await reloadProjectData(projectName);
      render();
    } catch (error) {
      showError?.(error.message || `Failed to disconnect ${integration.label}.`);
    }
  }

  async function runServerAction(integrationId, type) {
    const integration = getIntegrationById(integrationId);
    if (!integration) return;
    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
      return;
    }

    try {
      if (type === "test") {
        await testProjectIntegration(projectName, integrationId, {
          notes: `${integration.label} connection test passed from the Control Center.`
        });
        showMessage?.(`${integration.label} test completed.`);
      } else if (type === "sync") {
        await syncProjectIntegration(projectName, integrationId, {
          notes: `${integration.label} sync triggered from the Control Center.`
        });
        showMessage?.(`${integration.label} sync started.`);
      } else if (type === "import") {
        await importProjectIntegrationHistory(projectName, integrationId, {
          notes: `${integration.label} historical import triggered from the Control Center.`
        });
        showMessage?.(`${integration.label} historical import started.`);
      }

      await reloadProjectData(projectName);
      render();
    } catch (error) {
      showError?.(error.message || `Failed to ${type} ${integration.label}.`);
    }
  }

  Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-integration-action") || "";
      const integrationId = button.getAttribute("data-integration-id") || "";

      if (action === "connect") {
        await persistPrimary(integrationId, false);
        return;
      }
      if (action === "reconnect") {
        await persistPrimary(integrationId, true);
        return;
      }
      if (action === "disconnect") {
        await disconnect(integrationId);
        return;
      }

      await runServerAction(integrationId, action);
    };
  });

  Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
    button.onclick = () => {
      const prompt = button.getAttribute("data-integration-prompt-text") || "";
      const input = $("quickCommandInput");
      if (input) {
        input.value = prompt;
      }
      navigateTo("ai-command");
      showMessage?.("Integration review prompt added to AI Command.");
    };
  });

  if (typeof document !== "undefined") {
    if (integrationDrawerEscapeHandler) {
      document.removeEventListener("keydown", integrationDrawerEscapeHandler);
    }
    integrationDrawerEscapeHandler = (event) => {
      if (event.key !== "Escape" || !session.drawerOpen) return;
      closeIntegrationDrawer(session);
      render();
    };
    document.addEventListener("keydown", integrationDrawerEscapeHandler);
  }
}

export const integrationsRoute = {
  id: "integrations",
  meta: {
    eyebrow: "Start",
    title: "Integrations",
    description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
  },
  template: `
    <section class="page is-active" data-page="integrations">
      <div id="integrationsRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage,
    showError,
    reloadProjectData,
    connectProjectIntegration,
    reconnectProjectIntegration,
    testProjectIntegration,
    syncProjectIntegration,
    importProjectIntegrationHistory,
    disconnectProjectIntegration
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName);
    const domainModels = buildDomainModels(state, session);
    const sectionGroups = buildSectionGroups(domainModels);
    const allCards = domainModels.flatMap((domain) => domain.cards);
    if (!session.selectedIntegrationId || !allCards.find((card) => card.id === session.selectedIntegrationId)) {
      session.selectedIntegrationId = allCards[0]?.id || "";
    }
    const coverageMap = buildCoverageMap(domainModels);
    const criticalMissing = buildCriticalMissing(domainModels);
    const recommendations = buildRecommendations(domainModels, coverageMap);
    const aiRec = buildAISmartRecommendation(domainModels);
    const controlCenter = getControlCenterPayload(state);
    const overview = buildIntegrationOverviewSummary(allCards, recommendations);
    const diagnostics = buildLaunchDiagnostics(allCards);
    const connectorGroups = buildConnectorWorkspaceGroups(allCards, session);
    const filteredCards = connectorGroups.flatMap((group) => group.cards);
    const selectedCard = filteredCards.find((card) => card.id === session.selectedIntegrationId) || allCards.find((card) => card.id === session.selectedIntegrationId) || filteredCards[0] || allCards[0] || null;
    const drawerCard = allCards.find((card) => card.id === session.activeDrawerIntegrationId) || selectedCard;
    const attentionTotal = allCards.filter((card) => ["needs_setup", "failed"].includes(getConnectorWorkspaceStatus(card))).length;
    const readinessBase = Math.max(allCards.length, 1);
    const criticalMissingCount = criticalMissing.length;
    const connectedTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length;
    const partialTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;
    const systemScore = Math.round(((connectedTotal + partialTotal * 0.5) / readinessBase) * 100);
    const activityFeed = buildIntegrationActivityFeed(controlCenter, allCards);
    const lastGlobalSync =
      asString(controlCenter.summary?.last_global_sync) ||
      allCards
        .map((card) => card.lastSync)
        .filter(Boolean)
        .sort()
        .reverse()[0] || "";
    const root = $("integrationsRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="integrations-wrapper integration-system-panel">
        <section class="card integration-system-overview">
          <div class="card-head integration-system-overview-head">
            <div>
              <div class="setup-kicker">Integration Overview</div>
              <h3>System Control Panel</h3>
              <p class="home-section-copy" style="margin:6px 0 0;">Track launch-critical connectors, diagnose readiness impact, and operate integrations without leaving the standard page shell.</p>
            </div>
            <span class="card-badge ${escapeHtml(attentionTotal || criticalMissingCount ? "warning" : "success")}">${escapeHtml(attentionTotal || criticalMissingCount ? "Action needed" : "Operational")}</span>
          </div>
          <div class="integration-system-overview-grid">
            <div class="data-card integration-system-metric">
              <span class="data-label">Total Integrations</span>
              <strong>${escapeHtml(String(overview.totalIntegrations))}</strong>
              <span class="integration-system-metric-copy">All providers currently modeled in the control center.</span>
            </div>
            <div class="data-card integration-system-metric">
              <span class="data-label">Connected Integrations</span>
              <strong>${escapeHtml(String(overview.connectedIntegrations))}</strong>
              <span class="integration-system-metric-copy">Ready for sync, testing, or downstream workflows.</span>
            </div>
            <div class="data-card integration-system-metric">
              <span class="data-label">Missing Required</span>
              <strong>${escapeHtml(String(overview.missingRequired))}</strong>
              <span class="integration-system-metric-copy">Required launch connectors not yet fully connected.</span>
            </div>
            <div class="data-card integration-system-metric">
              <span class="data-label">Failed / Disconnected</span>
              <strong>${escapeHtml(String(overview.failedOrDisconnected))}</strong>
              <span class="integration-system-metric-copy">Connectors with missing or failed state across the full stack.</span>
            </div>
          </div>
          <div class="integration-system-summary-grid">
            <div class="integration-system-summary-card">
              <span class="data-label">Launch Readiness Impact</span>
              <strong>${escapeHtml(overview.launchReadinessImpact)}</strong>
              <span>System score: ${escapeHtml(String(systemScore))}% • Last global sync: ${escapeHtml(formatDateTime(lastGlobalSync))}</span>
            </div>
            <div class="integration-system-summary-card">
              <span class="data-label">Next Recommended Action</span>
              <strong>${escapeHtml(overview.nextRecommendedAction)}</strong>
              <span>${escapeHtml(recommendations.recommendations[0]?.meta || "Review the highest-impact connector gap before the next campaign launch.")}</span>
            </div>
          </div>
        </section>

        ${renderAISmartRecommendationModule(aiRec)}

        <section class="integration-system-workspace">
          <div class="integration-system-workspace-main">
            <section class="card integration-system-filters">
              <div class="card-head integration-system-filters-head">
                <div>
                  <div class="setup-kicker">Required Launch Connectors</div>
                  <h3>Connector Workspace</h3>
                  <p class="home-section-copy" style="margin:6px 0 0;">Filter by category or status, search any provider, and move directly into the connector setup workspace.</p>
                </div>
                <span class="card-badge ${escapeHtml(filteredCards.length ? "neutral" : "warning")}">${escapeHtml(filteredCards.length ? `${filteredCards.length} visible` : "No matches")}</span>
              </div>
              <div class="integration-filter-bar">
                <label class="integration-filter-field">
                  <span class="setup-label">Category</span>
                  <select data-integration-category-filter>
                    <option value="all">All categories</option>
                    ${Object.entries(CONNECTOR_WORKSPACE_CATEGORIES).map(([id, meta]) => `<option value="${escapeHtml(id)}" ${session.categoryFilter === id ? "selected" : ""}>${escapeHtml(meta.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="integration-filter-field">
                  <span class="setup-label">Status</span>
                  <select data-integration-status-filter>
                    <option value="all">All statuses</option>
                    <option value="connected" ${session.statusFilter === "connected" ? "selected" : ""}>Connected</option>
                    <option value="missing" ${session.statusFilter === "missing" ? "selected" : ""}>Missing</option>
                    <option value="failed" ${session.statusFilter === "failed" ? "selected" : ""}>Failed</option>
                    <option value="needs_setup" ${session.statusFilter === "needs_setup" ? "selected" : ""}>Needs setup</option>
                  </select>
                </label>
                <label class="integration-filter-field integration-filter-search">
                  <span class="setup-label">Search</span>
                  <input
                    type="search"
                    value="${escapeHtml(session.searchQuery)}"
                    placeholder="Search connector, provider, or source"
                    data-integration-search
                  />
                </label>
              </div>
            </section>

            <section class="integration-system-group-stack">
              ${connectorGroups.length
                ? connectorGroups.map((group) => renderConnectorGroup(group, session)).join("")
                : `<div class="empty-box">No connectors match the current filters. Clear one filter to restore the launch connector list.</div>`}
            </section>
          </div>

          <aside class="integration-system-workspace-side">
            ${selectedCard ? renderSelectedConnectorSummary(selectedCard) : `<div class="empty-box">Select a connector to open Smart Connect.</div>`}

            <section class="card integration-system-diagnostics">
              <div class="card-head">
                <div>
                  <h3>Diagnostics / Readiness Impact</h3>
                  <p class="home-section-copy" style="margin:6px 0 0;">Review blockers, warnings, and the fixes required before campaign launch.</p>
                </div>
                <span class="card-badge ${escapeHtml(diagnostics.blockers.length ? "danger" : diagnostics.warnings.length ? "warning" : "success")}">${escapeHtml(diagnostics.blockers.length ? "Blockers" : diagnostics.warnings.length ? "Warnings" : "Clear")}</span>
              </div>
              <div class="integration-diagnostic-section">
                <h4 class="integration-mini-heading">Blockers</h4>
                ${renderIntegrationDiagnosticsList(diagnostics.blockers, "No launch blockers are currently flagged.")}
              </div>
              <div class="integration-diagnostic-section">
                <h4 class="integration-mini-heading">Warnings</h4>
                ${renderIntegrationDiagnosticsList(diagnostics.warnings, "No connector warnings are currently active.")}
              </div>
              <div class="integration-diagnostic-section">
                <h4 class="integration-mini-heading">Fix Before Launch</h4>
                ${renderIntegrationDiagnosticsList(diagnostics.mustFix, "No integration fixes are required before launch.")}
              </div>
              <div class="integration-system-prompt-row">
                ${recommendations.prompts.slice(0, 2).map((item) => `
                  <button class="btn btn-secondary" type="button" data-integration-prompt="prompt" data-integration-prompt-text="${escapeHtml(item.prompt)}">${escapeHtml(item.label)}</button>
                `).join("")}
              </div>
            </section>

            <section class="card integration-system-activity">
              <div class="card-head">
                <div>
                  <h3>Activity / Recent Syncs</h3>
                  <p class="home-section-copy" style="margin:6px 0 0;">Shows live integration events when available, otherwise derived connector checkpoints.</p>
                </div>
                <span class="card-badge ${escapeHtml(activityFeed.some((item) => item.source === "real") ? "success" : "neutral")}">${escapeHtml(activityFeed.some((item) => item.source === "real") ? "Live feed" : "Derived feed")}</span>
              </div>
              ${renderIntegrationActivityFeed(activityFeed, formatDateTime)}
            </section>
          </aside>
        </section>

        <section class="card integration-system-readiness-map">
          <div class="card-head">
            <div>
              <h3>Coverage & Recovery Priorities</h3>
              <p class="home-section-copy" style="margin:6px 0 0;">Use category coverage, missing critical connectors, and next actions to close the remaining launch gaps.</p>
            </div>
            <span class="card-badge ${escapeHtml(criticalMissingCount || attentionTotal ? "warning" : "success")}">${escapeHtml(criticalMissingCount || attentionTotal ? "Needs review" : "Stable")}</span>
          </div>
          <div class="integration-ai-grid">
            <div>
              <h4 class="integration-mini-heading">Critical missing integrations</h4>
              ${renderIntegrationCriticalMissing(criticalMissing)}
            </div>
            <div>
              <h4 class="integration-mini-heading">Recommended next actions</h4>
              ${renderIntegrationRecommendationsList(recommendations.recommendations)}
            </div>
          </div>
          <div class="integration-system-coverage-block">
            <h4 class="integration-mini-heading">Launch coverage</h4>
            ${renderIntegrationCoverageMap(coverageMap)}
          </div>
        </section>

        ${drawerCard ? renderIntegrationDrawer(drawerCard, session, { getFieldValue }) : ""}
      </div>
    `;

    bindIntegrationActions({
      getState,
      $,
      navigateTo,
      showMessage,
      showError,
      reloadProjectData,
      connectProjectIntegration,
      reconnectProjectIntegration,
      testProjectIntegration,
      syncProjectIntegration,
      importProjectIntegrationHistory,
      disconnectProjectIntegration,
      projectName,
      session,
      render: () => this.render({
        getState,
        $,
        escapeHtml,
        safeText,
        navigateTo,
        showMessage,
        showError,
        reloadProjectData,
        connectProjectIntegration,
        reconnectProjectIntegration,
        testProjectIntegration,
        syncProjectIntegration,
        importProjectIntegrationHistory,
        disconnectProjectIntegration
      })
    });

    focusDrawerField(session, drawerCard);
  }
};
