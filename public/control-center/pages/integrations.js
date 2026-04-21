const integrationSessions = new Map();

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
      selectedIntegrationId: ""
    });
  }
  return integrationSessions.get(key);
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

function getFieldValue(session, integration, field, record, sourceValue) {
  const draft = ensureDraft(session, integration.id);
  if (draft[field.key] != null) return draft[field.key];
  if (isSecretField(field)) return "";
  if (field.key === integration.primaryField) {
    return asString(record.primary_value || sourceValue || record.config?.[field.key]);
  }
  return asString(record.config?.[field.key]);
}

function hasSavedServerCredential(record, fieldKey) {
  return Boolean(asObject(record.credential_state)[fieldKey]?.is_set);
}

function getLocalFillCount(session, integration, record, sourceValue) {
  return integration.fields.filter((field) => {
    const value = asString(getFieldValue(session, integration, field, record, sourceValue)).trim();
    return Boolean(value) || (isSecretField(field) && hasSavedServerCredential(record, field.key));
  }).length;
}

function getRequiredMissing(session, integration, record, sourceValue) {
  return integration.fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = asString(getFieldValue(session, integration, field, record, sourceValue)).trim();
      return !value && !(isSecretField(field) && hasSavedServerCredential(record, field.key));
    })
    .map((field) => field.label);
}

function normalizeStatusLabel(statusLabel, fallback = "Not Connected") {
  const normalized = asString(statusLabel).trim().toLowerCase();

  if (normalized === "connected") return "Connected";
  if (normalized === "partial") return "Partial";
  if (normalized === "error") return "Error";
  if (normalized === "token expired" || normalized === "token_expired") return "Token expired";
  if (normalized === "not connected" || normalized === "not_connected") return "Not Connected";

  return fallback;
}

function getHealthSummary(statusLabel, record, integration) {
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
  const statusLabel = normalizeStatusLabel(record.status_label || record.status);
  const localFillCount = getLocalFillCount(session, integration, record, sourceValue);
  const missingRequired = getRequiredMissing(session, integration, record, sourceValue);
  const totalFields = integration.fields.length;
  const accessModel = getIntegrationAccessModel(integration);
  const dataScopes = asArray(record.data_scopes).length
    ? asArray(record.data_scopes).map(titleCase)
    : inferScopeKeys(integration).map(titleCase);

  return {
    ...integration,
    record,
    sourceValue: asString(record.primary_value || sourceValue),
    statusLabel,
    statusKey: statusLabel.toLowerCase().replace(/\s+/g, "_"),
    statusTone:
      statusLabel === "Connected" ? "success" :
      statusLabel === "Partial" ? "warning" :
      statusLabel === "Token expired" ? "warning" :
      statusLabel === "Error" ? "danger" :
      "neutral",
    dataScopes,
    dataScopeSummary: dataScopes.join(", "),
    readScopes: asArray(record.read_scopes).length ? asArray(record.read_scopes) : accessModel.read,
    writeScopes: asArray(record.write_scopes).length ? asArray(record.write_scopes) : accessModel.write,
    credentialState: asObject(record.credential_state),
    missingRequired,
    lastSync: asString(record.last_sync_at),
    lastImport: asString(record.last_import_at),
    lastTest: asString(record.last_test_at),
    healthSummary: getHealthSummary(statusLabel, record, integration),
    notes: asString(record.notes) || (integration.critical && statusLabel !== "Connected"
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

function buildCoverageMap(domainModels) {
  const mapConfig = [
    {
      label: "Social Insights",
      ids: ["facebook", "instagram", "tiktok", "youtube", "linkedin"]
    },
    {
      label: "Paid Ads",
      ids: ["meta-ads", "google-ads", "tiktok-ads", "meta-pixel", "tiktok-pixel"]
    },
    {
      label: "Website Analytics",
      ids: ["website", "ga4", "gtm", "custom-analytics"]
    },
    {
      label: "SEO / Search Console",
      ids: ["search-console"]
    },
    {
      label: "Commerce / Orders",
      ids: ["woocommerce", "shopify", "amazon", "ebay"]
    },
    {
      label: "Email / CRM",
      ids: ["smtp", "mailer", "mailchimp", "crm"]
    },
    {
      label: "Automation",
      ids: ["google-drive", "slack", "telegram", "notion", "zapier-make", "webhook"]
    }
  ];

  const allCards = domainModels.flatMap((domain) => domain.cards);

  return mapConfig.map((item) => {
    const cards = allCards.filter((card) => item.ids.includes(card.id));
    const connected = cards.filter((card) => card.statusLabel === "Connected").length;
    const partial = cards.filter((card) => ["Partial", "Token expired", "Error"].includes(card.statusLabel)).length;
    const status = connected === cards.length && cards.length
      ? "Covered"
      : connected || partial
        ? "Partial"
        : "Missing";

    return {
      label: item.label,
      status,
      meta: `${connected}/${cards.length} connected`
    };
  });
}

function buildCriticalMissing(domainModels) {
  return domainModels
    .flatMap((domain) => domain.cards)
    .filter((card) => card.critical && card.statusLabel !== "Connected")
    .slice(0, 8)
    .map((card) => ({
      title: card.label,
      meta: `${card.domainTitle} • ${card.statusLabel} • ${card.whyItMatters}`
    }));
}

function buildRecommendations(domainModels, coverageMap) {
  const cards = domainModels.flatMap((domain) => domain.cards);
  const missingCritical = cards.filter((card) => card.critical && card.statusLabel !== "Connected");
  const reconnectNeeded = cards.filter((card) => ["Token expired", "Error"].includes(card.statusLabel));
  const partial = cards.filter((card) => card.statusLabel === "Partial");
  const missingCoverage = coverageMap.filter((item) => item.status !== "Covered");

  const recommendations = [];

  if (missingCritical.length) {
    recommendations.push({
      title: `Connect ${missingCritical[0].label} next`,
      meta: `${missingCritical[0].label} is a critical blocker because ${missingCritical[0].whyItMatters.toLowerCase()}`
    });
  }

  if (reconnectNeeded.length) {
    recommendations.push({
      title: `Repair ${reconnectNeeded[0].label}`,
      meta: `${reconnectNeeded[0].label} needs attention before sync and intelligence coverage can be trusted.`
    });
  }

  if (partial.length) {
    recommendations.push({
      title: "Finish partially configured integrations",
      meta: `${partial.length} integration${partial.length === 1 ? "" : "s"} have staged values but are not fully connected yet.`
    });
  }

  if (missingCoverage.length) {
    recommendations.push({
      title: "Close data coverage gaps",
      meta: `The biggest missing intelligence areas are ${missingCoverage.slice(0, 3).map((item) => item.label).join(", ")}.`
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Integration layer is structurally healthy",
      meta: "Best next step: attach provider-specific OAuth validation and background sync jobs to the existing integration routes."
    });
  }

  const prompts = [
    {
      label: "What should I connect next?",
      prompt: "Review all current integrations and tell me which platform or tool I should connect next to improve learning, attribution, and execution fastest."
    },
    {
      label: "Which integrations are critical before launch?",
      prompt: "Identify the critical missing integrations before launch and explain which ones block publishing, analytics, SEO, paid optimization, and conversion intelligence."
    },
    {
      label: "Why is SEO intelligence incomplete?",
      prompt: "Explain what is missing from the current SEO and Search Console integration coverage and what should be connected or configured next."
    },
    {
      label: "Which platform is blocking full attribution?",
      prompt: "Review the current analytics, tracking, website, and paid integrations and tell me what is blocking full attribution across content, ads, and conversion tracking."
    },
    {
      label: "What tools are needed for paid optimization?",
      prompt: "Review the integrations layer and tell me which tools and data sources are still needed before paid media optimization can be trusted."
    }
  ];

  return { recommendations, prompts };
}

function renderCoverageMap(items, escapeHtml) {
  return `
    <div class="integration-coverage-grid">
      ${items.map((item) => `
        <div class="integration-coverage-item">
          <strong>${escapeHtml(item.label)}</strong>
          <span class="card-badge ${item.status === "Covered" ? "success" : item.status === "Partial" ? "warning" : "danger"}">${escapeHtml(item.status)}</span>
          <div class="integration-coverage-meta">${escapeHtml(item.meta)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCriticalMissing(items, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">No critical missing integrations are currently flagged.</div>`;
  }

  return `
    <div class="integration-critical-list">
      ${items.map((item) => `
        <div class="integration-critical-item">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.meta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderField(integrationId, field, value, escapeHtml) {
  const type = field.type || "text";
  return `
    <div class="integration-field-group">
      <label class="setup-label" for="integration-${escapeHtml(integrationId)}-${escapeHtml(field.key)}">${escapeHtml(field.label)}</label>
      <input
        id="integration-${escapeHtml(integrationId)}-${escapeHtml(field.key)}"
        class="setup-input"
        type="${escapeHtml(type)}"
        value="${escapeHtml(value)}"
        placeholder="${escapeHtml(field.placeholder || "")}"
        autocomplete="${type === "password" ? "new-password" : "off"}"
        data-integration-field="${escapeHtml(integrationId)}"
        data-field-key="${escapeHtml(field.key)}"
      />
      <div class="setup-helper" data-integration-field-helper="${escapeHtml(integrationId)}:${escapeHtml(field.key)}"></div>
    </div>
  `;
}

function renderIntegrationCard(card, session, escapeHtml) {
  const isSelected = asString(session.selectedIntegrationId) === card.id;
  const primaryActionLabel =
    card.statusLabel === "Connected"
      ? "Manage"
      : ["Partial", "Token expired", "Error"].includes(card.statusLabel)
        ? "Fix Connection"
        : "Connect";
  const primaryAction =
    card.statusLabel === "Connected"
      ? "manage"
      : ["Partial", "Token expired", "Error"].includes(card.statusLabel)
        ? "reconnect"
        : "connect";

  return `
    <section class="integration-simple-card${isSelected ? " is-selected" : ""}">
      <div class="integration-simple-head">
        <div class="integration-hub-icon">${escapeHtml(card.icon)}</div>
        <div class="integration-simple-copy">
          <strong>${escapeHtml(card.label)}</strong>
        </div>
        <span class="card-badge ${escapeHtml(card.statusTone)}">${escapeHtml(
          card.statusLabel === "Partial" || card.statusLabel === "Token expired" || card.statusLabel === "Error"
            ? "Needs Attention"
            : card.statusLabel
        )}</span>
      </div>
      <div class="integration-simple-actions">
        <button class="btn btn-primary" type="button" data-integration-primary="${escapeHtml(primaryAction)}" data-integration-id="${escapeHtml(card.id)}">${escapeHtml(primaryActionLabel)}</button>
        <button class="btn btn-secondary" type="button" data-integration-select="${escapeHtml(card.id)}">View Details</button>
      </div>
    </section>
  `;
}

function renderIntegrationDetailsPanel(card, session, escapeHtml) {
  const fields = card.fields
    .map((field) => renderField(
      card.id,
      field,
      getFieldValue(session, card, field, card.record, card.sourceValue),
      escapeHtml
    ))
    .join("");
  const credentialItems = Object.entries(card.credentialState)
    .filter(([, value]) => value?.is_set)
    .map(([key, value]) => `<span class="integration-scope-pill">${escapeHtml(`${titleCase(key)}: ${value.masked}`)}</span>`)
    .join("");

  return `
    <section class="card integration-hub-card">
      <div class="integration-hub-head">
        <div class="integration-hub-title-wrap">
          <div class="integration-hub-icon">${escapeHtml(card.icon)}</div>
          <div>
            <h4>${escapeHtml(card.label)}</h4>
            <p>${escapeHtml(card.purpose)}</p>
          </div>
        </div>
        <span class="card-badge ${escapeHtml(card.statusTone)}">${escapeHtml(card.statusLabel)}</span>
      </div>

      <div class="integration-hub-intro">
        <div class="integration-hub-why">
          <strong>Status</strong>
          <span>${escapeHtml(card.healthSummary)}</span>
        </div>
        <div class="integration-hub-why">
          <strong>Connection value</strong>
          <span>${escapeHtml(card.sourceValue || "Not set")}</span>
        </div>
      </div>

      <div class="integration-hub-grid">
        <div>
          <div class="integration-field-grid">
            ${fields}
          </div>
          ${credentialItems ? `<div class="integration-scope-row">${credentialItems}</div>` : ""}
          <div class="integration-side-note">
            Sensitive credentials are stored server-side only. Leave password fields blank to keep the current saved value.
          </div>
        </div>

        <div class="integration-side-panel">
          <div class="data-stack">
            <div class="data-row"><span>Status</span><strong>${escapeHtml(card.statusLabel)}</strong></div>
            <div class="data-row"><span>Last test</span><strong>${escapeHtml(formatDateTime(card.lastTest))}</strong></div>
            <div class="data-row"><span>Last sync</span><strong>${escapeHtml(formatDateTime(card.lastSync))}</strong></div>
            <div class="data-row"><span>Last import</span><strong>${escapeHtml(formatDateTime(card.lastImport))}</strong></div>
            <div class="data-row"><span>Health</span><strong>${escapeHtml(card.healthSummary)}</strong></div>
          </div>
          <div class="integration-side-note">${escapeHtml(card.notes)}</div>
          ${
            card.missingRequired.length
              ? `<div class="integration-side-note">${escapeHtml(`Missing required fields: ${card.missingRequired.join(", ")}`)}</div>`
              : ""
          }
        </div>
      </div>

      <div class="integration-action-row">
        <button class="quick-action-btn" type="button" data-integration-action="connect" data-integration-id="${escapeHtml(card.id)}">Connect</button>
        <button class="quick-action-btn" type="button" data-integration-action="test" data-integration-id="${escapeHtml(card.id)}">Test Connection</button>
        <button class="quick-action-btn" type="button" data-integration-action="sync" data-integration-id="${escapeHtml(card.id)}">Sync Now</button>
        <button class="quick-action-btn" type="button" data-integration-action="import" data-integration-id="${escapeHtml(card.id)}">Import Data</button>
        <button class="quick-action-btn integration-disconnect-btn" type="button" data-integration-action="disconnect" data-integration-id="${escapeHtml(card.id)}">Disconnect</button>
        <button class="quick-action-btn" type="button" data-integration-action="reconnect" data-integration-id="${escapeHtml(card.id)}">Reconnect</button>
      </div>
    </section>
  `;
}

function renderDomainSection(domain, session, escapeHtml) {
  const attentionCount = domain.cards.filter((card) => ["Error", "Token expired"].includes(card.statusLabel)).length;
  const blockedCount = domain.cards.filter((card) => card.statusLabel === "Not Connected").length;

  return `
    <section class="card integration-domain-card">
      <div class="card-head">
        <div>
          <h3>${escapeHtml(domain.title)}</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">${escapeHtml(domain.description)}</p>
        </div>
        <span class="card-badge ${domain.connectedCount === domain.cards.length ? "success" : domain.connectedCount || domain.partialCount ? "warning" : "danger"}">${escapeHtml(`${domain.connectedCount} connected • ${domain.partialCount} partial • ${attentionCount} attention • ${blockedCount} missing`)}</span>
      </div>
      <div class="integration-domain-grid">
        ${domain.cards.map((card) => renderIntegrationCard(card, session, escapeHtml)).join("")}
      </div>
    </section>
  `;
}

function summarizeSectionCards(cards) {
  return {
    connected: cards.filter((card) => card.statusLabel === "Connected").length,
    notConnected: cards.filter((card) => card.statusLabel === "Not Connected").length,
    needsAttention: cards.filter((card) => ["Partial", "Token expired", "Error"].includes(card.statusLabel)).length
  };
}

function buildSectionGroups(domainModels) {
  const byId = new Map(domainModels.map((domain) => [domain.id, domain]));

  return [
    {
      id: "sales-channels",
      title: "Sales Channels",
      description: "Commerce and marketplace connections that support products, orders, revenue signals, and conversion-aware sales intelligence.",
      domains: [byId.get("website-commerce")].filter(Boolean)
    },
    {
      id: "social-channels",
      title: "Social Channels",
      description: "Audience and publishing platforms used for organic reach, social engagement, and content performance learning.",
      domains: [byId.get("social")].filter(Boolean)
    },
    {
      id: "marketing-tracking-tools",
      title: "Marketing & Tracking Tools",
      description: "Analytics, paid media, and attribution systems that improve measurement, optimization, and traffic visibility.",
      domains: [byId.get("analytics"), byId.get("ads")].filter(Boolean)
    },
    {
      id: "support-operations-tools",
      title: "Support / Operations Tools",
      description: "Lifecycle, CRM, automation, and coordination tools that support execution, alerts, and internal operating flow.",
      domains: [byId.get("email-crm"), byId.get("automation")].filter(Boolean)
    }
  ].map((section) => {
    const cards = section.domains.flatMap((domain) => domain.cards);
    return {
      ...section,
      cards,
      summary: summarizeSectionCards(cards)
    };
  });
}

function renderIntegrationSection(section, session, escapeHtml) {
  const { connected, notConnected, needsAttention } = section.summary;
  const tone = notConnected || needsAttention ? (connected ? "warning" : "danger") : "success";
  const selectedCard = section.cards.find((card) => card.id === asString(session.selectedIntegrationId)) || section.cards[0] || null;
  const connectedCards = section.cards.filter((card) => card.statusLabel === "Connected");
  const attentionCards = section.cards.filter((card) => ["Partial", "Token expired", "Error"].includes(card.statusLabel));
  const notConnectedCards = section.cards.filter((card) => card.statusLabel === "Not Connected");

  return `
    <section class="card integration-domain-card">
      <div class="card-head">
        <div>
          <h3>${escapeHtml(section.title)}</h3>
          <p class="home-section-copy" style="margin:6px 0 0;">${escapeHtml(section.description)}</p>
        </div>
        <span class="card-badge ${tone}">${escapeHtml(`${connected} connected • ${notConnected} not connected • ${needsAttention} needs attention`)}</span>
      </div>
      <div class="integration-coverage-grid integration-section-status-grid">
        <div class="integration-coverage-item">
          <strong>Connected</strong>
          <span class="card-badge success">${escapeHtml(String(connected))}</span>
          <div class="integration-coverage-meta">Ready for test, sync, and provider-backed actions.</div>
        </div>
        <div class="integration-coverage-item">
          <strong>Not connected</strong>
          <span class="card-badge danger">${escapeHtml(String(notConnected))}</span>
          <div class="integration-coverage-meta">No complete connection record is available yet.</div>
        </div>
          <div class="integration-coverage-item">
            <strong>Needs attention / blocked</strong>
            <span class="card-badge warning">${escapeHtml(String(needsAttention))}</span>
            <div class="integration-coverage-meta">Partial setup, token issues, or server-reported errors need review.</div>
          </div>
        </div>
      <div class="integration-status-group">
        <div class="integration-mini-heading">Connected</div>
        <div class="integration-simple-grid">
          ${connectedCards.length ? connectedCards.map((card) => renderIntegrationCard(card, session, escapeHtml)).join("") : `<div class="empty-box">No connected integrations in this group yet.</div>`}
        </div>
      </div>
      <div class="integration-status-group">
        <div class="integration-mini-heading">Needs Attention</div>
        <div class="integration-simple-grid">
          ${attentionCards.length ? attentionCards.map((card) => renderIntegrationCard(card, session, escapeHtml)).join("") : `<div class="empty-box">No integrations need attention in this group right now.</div>`}
        </div>
      </div>
      <div class="integration-status-group">
        <div class="integration-mini-heading">Not Connected</div>
        <div class="integration-simple-grid">
          ${notConnectedCards.length ? notConnectedCards.map((card) => renderIntegrationCard(card, session, escapeHtml)).join("") : `<div class="empty-box">All integrations in this group already have a connection state.</div>`}
        </div>
      </div>
      ${selectedCard ? renderIntegrationDetailsPanel(selectedCard, session, escapeHtml) : ""}
    </section>
  `;
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
      session.selectedIntegrationId = button.getAttribute("data-integration-select") || "";
      render();
    };
  });

  Array.from(document.querySelectorAll("[data-integration-primary]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-integration-primary") || "";
      const integrationId = button.getAttribute("data-integration-id") || "";
      session.selectedIntegrationId = integrationId;

      if (action === "manage") {
        render();
        return;
      }

      if (action === "connect") {
        await persistPrimary(integrationId, false);
        return;
      }

      if (action === "reconnect") {
        await persistPrimary(integrationId, true);
      }
    };
  });

  Array.from(document.querySelectorAll("[data-integration-field]")).forEach((input) => {
    input.oninput = (event) => {
      const integrationId = input.getAttribute("data-integration-field") || "";
      const fieldKey = input.getAttribute("data-field-key") || "";
      setFieldValue(session, integrationId, fieldKey, event.target.value || "");
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

    helper.textContent = field.required
      ? "Required for a complete connection."
      : "Optional, but useful for scoping and diagnostics.";
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
      const draftValue = asString(draft[field.key]).trim();

      if (field.key === integration.primaryField) {
        return;
      }

      if (isSecretField(field)) {
        if (draftValue) {
          credentials[field.key] = draftValue;
        }
        return;
      }

      const fallbackValue = asString(record.config?.[field.key]).trim();
      if (draftValue || fallbackValue) {
        config[field.key] = draftValue || fallbackValue;
      }
    });

    const primaryValue = asString(
      draft[integration.primaryField] ??
      record.primary_value ??
      record.config?.[integration.primaryField] ??
      getLegacySourceValue(integration, getLegacySources(state))
    ).trim();

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
    const payload = buildConnectionPayload(integrationId);
    const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
    const value = asString(payload?.primary_value).trim();

    if (!value) {
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
    const controlCenter = getControlCenterPayload(state);
    const connectedTotal = allCards.filter((card) => card.statusLabel === "Connected").length;
    const partialTotal = allCards.filter((card) => card.statusLabel === "Partial").length;
    const errorTotal = allCards.filter((card) => card.statusLabel === "Error").length;
    const expiredTotal = allCards.filter((card) => card.statusLabel === "Token expired").length;
    const notConnectedTotal = allCards.filter((card) => card.statusLabel === "Not Connected").length;
    const attentionTotal = partialTotal + errorTotal + expiredTotal;
    const criticalMissingCount = criticalMissing.length;
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
      <div class="integrations-wrapper integration-control-center">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Connection Management</div>
              <h3>Connection Overview</h3>
              <p class="home-section-copy" style="margin:6px 0 0;">Track which integrations are connected, which are still missing, and which need attention before sync and intelligence can be trusted.</p>
            </div>
            <span class="card-badge ${escapeHtml(attentionTotal || notConnectedTotal || criticalMissingCount ? "warning" : "success")}">${escapeHtml(attentionTotal || notConnectedTotal || criticalMissingCount ? "Action needed" : "Operational")}</span>
          </div>
          <div class="integrations-overview-grid integration-overview-grid-4">
            <div class="data-card">
              <span class="data-label">Connected</span>
              <strong>${escapeHtml(String(connectedTotal))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Not connected</span>
              <strong>${escapeHtml(String(notConnectedTotal))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Needs attention / blocked</span>
              <strong>${escapeHtml(String(attentionTotal))}</strong>
            </div>
            <div class="data-card">
              <span class="data-label">Last global sync</span>
              <strong>${escapeHtml(formatDateTime(lastGlobalSync))}</strong>
            </div>
          </div>
        </section>

        ${sectionGroups.map((section) => renderIntegrationSection(section, session, escapeHtml)).join("")}

        <section class="card">
          <div class="card-head">
            <h3>Integration Actions / Status</h3>
            <span class="card-badge ${escapeHtml(criticalMissingCount || attentionTotal ? "warning" : "success")}">${escapeHtml(criticalMissingCount || attentionTotal ? "Needs review" : "Stable")}</span>
          </div>
          <div class="integration-ai-grid">
            <div>
              <h4 class="integration-mini-heading">Critical missing integrations</h4>
              ${renderCriticalMissing(criticalMissing, escapeHtml)}
            </div>
            <div>
              <h4 class="integration-mini-heading">Recommended next actions</h4>
              <div class="integration-critical-list">
                ${recommendations.recommendations.map((item) => `
                  <div class="integration-critical-item">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span>${escapeHtml(item.meta)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Integrations AI Assistant</h3>
            <span class="card-badge neutral">${escapeHtml(`${recommendations.prompts.length} prompts`)}</span>
          </div>
          <p class="setup-side-copy">These prompts send integration context to AI Command. They do not change any connection state until you run actions from this page.</p>
          <div class="integration-ai-prompt-list">
            ${recommendations.prompts.map((item) => `
              <button
                class="quick-action-btn"
                type="button"
                data-integration-prompt="1"
                data-integration-prompt-text="${escapeHtml(item.prompt)}"
              >
                <span class="home-action-title">${escapeHtml(item.label)}</span>
                <span class="home-action-meta">${escapeHtml(item.prompt)}</span>
              </button>
            `).join("")}
          </div>
        </section>
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
  }
};
