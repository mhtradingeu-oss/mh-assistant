/*
  Integrations OS Builders Layer

  Pure data transformation only.
  No DOM rendering.
  No runtime side effects.
*/

export function summarizeSectionCards(cards = []) {
  const list = Array.isArray(cards) ? cards : [];

  return {
    connected: list.filter((card) => card.statusLabel === "Connected").length,
    notConnected: list.filter((card) => card.statusLabel === "Not Connected").length,
    needsAttention: list.filter((card) =>
      ["Partial", "Token expired", "Error"].includes(card.statusLabel)
    ).length
  };
}

export function buildCoverageMap(domainModels = []) {
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

  const allCards = domainModels.flatMap((domain) =>
    Array.isArray(domain.cards) ? domain.cards : []
  );

  return mapConfig.map((item) => {
    const cards = allCards.filter((card) => item.ids.includes(card.id));
    const connected = cards.filter((card) => card.statusLabel === "Connected").length;
    const partial = cards.filter((card) =>
      ["Partial", "Token expired", "Error"].includes(card.statusLabel)
    ).length;

    const status =
      connected === cards.length && cards.length
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

export function buildCriticalMissing(domainModels = []) {
  return domainModels
    .flatMap((domain) => Array.isArray(domain.cards) ? domain.cards : [])
    .filter((card) =>
      card.backendSupported &&
      card.critical &&
      card.statusLabel !== "Connected"
    )
    .slice(0, 8)
    .map((card) => ({
      title: card.label,
      meta: `${card.domainTitle} • ${card.statusLabel} • ${card.whyItMatters}`
    }));
}

export function buildRecommendations(domainModels = [], coverageMap = []) {
  const cards = domainModels.flatMap((domain) =>
    Array.isArray(domain.cards) ? domain.cards : []
  );

  const actionableCards = cards.filter((card) => card.backendSupported);
  const missingCritical = actionableCards.filter(
    (card) => card.critical && card.statusLabel !== "Connected"
  );
  const reconnectNeeded = actionableCards.filter((card) =>
    ["Token expired", "Error"].includes(card.statusLabel)
  );
  const partial = actionableCards.filter((card) => card.statusLabel === "Partial");
  const missingCoverage = coverageMap.filter((item) => item.status !== "Covered");

  const recommendations = [];

  if (missingCritical.length) {
    recommendations.push({
      title: `Connect ${missingCritical[0].label} next`,
      meta: `${missingCritical[0].label} is a critical blocker because ${String(missingCritical[0].whyItMatters || "").toLowerCase()}`
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
      meta: `The biggest missing intelligence areas are ${missingCoverage
        .slice(0, 3)
        .map((item) => item.label)
        .join(", ")}.`
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

export const CONNECTOR_WORKSPACE_CATEGORIES = {
  sales: {
    label: "Sales",
    description: "Website, storefront, and marketplace connectors that prove demand and commerce readiness.",
    connectorIds: ["website", "woocommerce", "shopify", "amazon", "ebay"]
  },
  social: {
    label: "Social",
    description: "Organic distribution surfaces that supply audience, content, and publishing signals.",
    connectorIds: ["instagram", "facebook", "tiktok", "youtube", "linkedin"]
  },
  tracking: {
    label: "Tracking",
    description: "Measurement and attribution infrastructure required for launch visibility and optimization.",
    connectorIds: ["ga4", "search-console", "meta-pixel", "tiktok-pixel", "gtm", "custom-analytics"]
  },
  communication: {
    label: "Communication / CRM",
    description: "Email, CRM, and operational messaging connectors that keep lifecycle and team coordination intact.",
    connectorIds: ["smtp", "mailer", "mailchimp", "crm", "telegram", "slack", "notion", "zapier-make", "google-drive", "webhook"]
  },
  growth: {
    label: "Additional Growth",
    description: "Paid media connectors that extend optimization once the core launch stack is stable.",
    connectorIds: ["meta-ads", "google-ads", "tiktok-ads"]
  }
};

export const REQUIRED_LAUNCH_CATEGORY_IDS = [
  "sales",
  "social",
  "tracking",
  "communication"
];

export function getConnectorWorkspaceCategory(card = {}) {
  const entry = Object.entries(CONNECTOR_WORKSPACE_CATEGORIES).find(([, meta]) =>
    Array.isArray(meta.connectorIds) && meta.connectorIds.includes(card.id)
  );

  return entry?.[0] || "growth";
}

export function getConnectorWorkspaceStatus(card = {}) {
  if (card.statusLabel === "Connected") return "connected";
  if (["Error", "Token expired"].includes(card.statusLabel)) return "failed";
  if (card.statusLabel === "Partial") return "needs_setup";
  return "missing";
}

export function getConnectorWorkspaceStatusLabel(statusKey = "") {
  if (statusKey === "needs_setup") return "Needs setup";

  return String(statusKey)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function matchesConnectorSearch(card = {}, searchQuery = "") {
  const query = String(searchQuery).trim().toLowerCase();

  if (!query) return true;

  const haystack = [
    card.label,
    card.id,
    card.domainTitle,
    card.sourceKey,
    card.purpose,
    card.whyItMatters,
    card.enablesSummary,
    card.permissionScopeSummary
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function buildIntegrationOverviewSummary(cards = [], recommendations = {}) {
  const list = Array.isArray(cards) ? cards : [];
  const requiredCards = list.filter((card) =>
    REQUIRED_LAUNCH_CATEGORY_IDS.includes(getConnectorWorkspaceCategory(card))
  );

  const totalIntegrations = list.length;
  const connectedIntegrations = list.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length;
  const missingRequired = requiredCards.filter((card) => getConnectorWorkspaceStatus(card) !== "connected").length;
  const failedOrDisconnected = list.filter((card) => ["failed", "missing"].includes(getConnectorWorkspaceStatus(card))).length;
  const blockerCount = requiredCards.filter((card) => card.critical && getConnectorWorkspaceStatus(card) !== "connected").length;
  const warningCount = requiredCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;

  let launchReadinessImpact = "Launch-ready from an integrations perspective.";

  if (blockerCount) {
    launchReadinessImpact = `${blockerCount} critical connector${blockerCount === 1 ? "" : "s"} still block reliable launch execution.`;
  } else if (warningCount) {
    launchReadinessImpact = `${warningCount} required connector${warningCount === 1 ? "" : "s"} still need setup before diagnostics can be trusted.`;
  } else if (failedOrDisconnected) {
    launchReadinessImpact = `${failedOrDisconnected} non-critical connector${failedOrDisconnected === 1 ? " is" : "s are"} disconnected or failed and should be repaired after launch blockers.`;
  }

  return {
    totalIntegrations,
    connectedIntegrations,
    missingRequired,
    failedOrDisconnected,
    launchReadinessImpact,
    nextRecommendedAction: recommendations.recommendations?.[0]?.title || "Review connector coverage"
  };
}

export function buildLaunchDiagnostics(cards = []) {
  const list = Array.isArray(cards) ? cards : [];

  const requiredCards = list.filter((card) =>
    REQUIRED_LAUNCH_CATEGORY_IDS.includes(getConnectorWorkspaceCategory(card))
  );

  const blockers = requiredCards
    .filter((card) =>
      card.critical &&
      ["missing", "failed"].includes(getConnectorWorkspaceStatus(card))
    )
    .map((card) => ({
      title: card.label,
      detail: card.whyItMatters
    }))
    .slice(0, 6);

  const warnings = requiredCards
    .filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup")
    .map((card) => ({
      title: card.label,
      detail: card.missingRequired.length
        ? `Finish required fields: ${card.missingRequired.join(", ")}`
        : card.healthSummary
    }))
    .slice(0, 6);

  const mustFix = blockers.length
    ? blockers
    : warnings.length
      ? warnings
      : requiredCards
          .filter((card) => getConnectorWorkspaceStatus(card) !== "connected")
          .map((card) => ({
            title: card.label,
            detail: card.healthSummary
          }))
          .slice(0, 4);

  return { blockers, warnings, mustFix };
}

export function buildConnectorWorkspaceGroups(cards = [], session = {}) {
  const list = Array.isArray(cards) ? cards : [];
  const categoryFilter = String(session.categoryFilter || "").trim().toLowerCase() || "all";
  const statusFilter = String(session.statusFilter || "").trim().toLowerCase() || "all";

  return Object.entries(CONNECTOR_WORKSPACE_CATEGORIES)
    .map(([id, meta]) => {
      const groupCards = list
        .filter((card) => getConnectorWorkspaceCategory(card) === id)
        .filter((card) => categoryFilter === "all" || categoryFilter === id)
        .filter((card) => statusFilter === "all" || getConnectorWorkspaceStatus(card) === statusFilter)
        .filter((card) => matchesConnectorSearch(card, session.searchQuery))
        .sort((left, right) => {
          const leftPriority = left.critical ? 0 : 1;
          const rightPriority = right.critical ? 0 : 1;
          if (leftPriority !== rightPriority) return leftPriority - rightPriority;
          return String(left.label || "").localeCompare(String(right.label || ""));
        });

      return {
        id,
        ...meta,
        cards: groupCards,
        connectedCount: groupCards.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length,
        failedCount: groupCards.filter((card) => getConnectorWorkspaceStatus(card) === "failed").length,
        missingCount: groupCards.filter((card) => getConnectorWorkspaceStatus(card) === "missing").length,
        setupCount: groupCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length
      };
    })
    .filter((group) => group.cards.length || categoryFilter === group.id);
}

function mapActivityTone(value = "") {
  const text = String(value).toLowerCase();

  if (/(failed|error|disconnect|blocked|expired)/.test(text)) return "danger";
  if (/(pending|partial|warning|setup)/.test(text)) return "warning";
  if (/(connected|sync|tested|passed|healthy|ready|imported)/.test(text)) return "success";

  return "neutral";
}

export function buildIntegrationActivityFeed(controlCenter = {}, cards = []) {
  const activity = controlCenter.activity && typeof controlCenter.activity === "object"
    ? controlCenter.activity
    : {};

  const list = Array.isArray(cards) ? cards : [];

  const realEvents = [
    ...(Array.isArray(activity.events) ? activity.events : []),
    ...(Array.isArray(activity.items) ? activity.items : []),
    ...(Array.isArray(controlCenter.recent_syncs) ? controlCenter.recent_syncs : []),
    ...(Array.isArray(controlCenter.recent_events) ? controlCenter.recent_events : []),
    ...(Array.isArray(controlCenter.history) ? controlCenter.history : [])
  ]
    .map((item, index) => ({
      id: String(item.id || item.event_id || item.sync_id || `real-${index}`),
      title: String(item.title || item.summary || item.message || item.event || item.type || "Integration event"),
      detail: String(item.detail || item.notes || item.status || item.result || item.connector || item.integration_id || ""),
      timestamp: String(item.timestamp || item.occurred_at || item.created_at || item.updated_at || item.completed_at || item.executed_at || ""),
      tone: mapActivityTone(item.status || item.level || item.type || item.result),
      source: "real"
    }))
    .filter((item) => item.title);

  if (realEvents.length) {
    return realEvents
      .sort((left, right) => Date.parse(right.timestamp || "") - Date.parse(left.timestamp || ""))
      .slice(0, 8);
  }

  return list
    .flatMap((card) => {
      const events = [];

      if (card.lastSync) {
        events.push({
          id: `${card.id}-sync`,
          title: `${card.label} sync checkpoint`,
          detail: "Derived from the latest connector sync timestamp.",
          timestamp: card.lastSync,
          tone: "success",
          source: "derived"
        });
      }

      if (card.lastTest) {
        events.push({
          id: `${card.id}-test`,
          title: `${card.label} connection test`,
          detail: "Derived from the latest connector test timestamp.",
          timestamp: card.lastTest,
          tone: "success",
          source: "derived"
        });
      }

      if (card.lastImport) {
        events.push({
          id: `${card.id}-import`,
          title: `${card.label} history import`,
          detail: "Derived from the latest connector import timestamp.",
          timestamp: card.lastImport,
          tone: "success",
          source: "derived"
        });
      }

      if (["Error", "Token expired"].includes(card.statusLabel)) {
        events.push({
          id: `${card.id}-repair`,
          title: `${card.label} needs repair`,
          detail: String(card.record?.last_error || card.healthSummary || ""),
          timestamp: String(card.record?.updated_at || card.lastTest || card.lastSync || card.lastImport || ""),
          tone: "danger",
          source: "derived"
        });
      }

      return events;
    })
    .filter((item) => item.timestamp)
    .sort((left, right) => Date.parse(right.timestamp || "") - Date.parse(left.timestamp || ""))
    .slice(0, 8);
}

export function buildSectionGroups(domainModels = []) {
  const domains = Array.isArray(domainModels) ? domainModels : [];
  const byId = new Map(domains.map((domain) => [domain.id, domain]));

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
      id: "email-crm",
      title: "Email & CRM",
      description: "Lifecycle messaging, customer records, audience segmentation, and relationship data required for retention and lifecycle operations.",
      domains: [byId.get("email-crm")].filter(Boolean)
    },
    {
      id: "ai-automation-tools",
      title: "AI / Automation Tools",
      description: "Automation and coordination tools that help orchestrate tasks, handoffs, notifications, and AI-assisted operations.",
      domains: [byId.get("automation")].filter(Boolean)
    }
  ].map((section) => {
    const cards = section.domains.flatMap((domain) =>
      Array.isArray(domain.cards) ? domain.cards : []
    );

    return {
      ...section,
      cards,
      summary: summarizeSectionCards(cards)
    };
  });
}

export function buildAISmartRecommendation(domainModels = []) {
  const allCards = domainModels.flatMap((domain) =>
    Array.isArray(domain.cards) ? domain.cards : []
  );

  const actionableCards = allCards.filter((card) => card.backendSupported);
  const criticalCards = actionableCards.filter((card) => card.critical);
  const allCriticalConnected =
    criticalCards.length > 0 &&
    criticalCards.every((card) => card.statusLabel === "Connected");

  let targetCard = null;

  targetCard = actionableCards.find(
    (card) => card.critical && ["Error", "Token expired"].includes(card.statusLabel)
  ) || null;

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.id === "website" && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.id === "woocommerce" && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.id === "ga4" && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.id === "search-console" && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => ["instagram", "facebook"].includes(card.id) && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.id === "meta-pixel" && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => ["smtp", "mailer", "mailchimp"].includes(card.id) && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    targetCard = actionableCards.find((card) => card.critical && card.statusLabel !== "Connected") || null;
  }

  if (!targetCard) {
    const nextOptional = actionableCards.find((card) => !card.critical && card.statusLabel !== "Connected") || null;
    return { healthy: true, nextOptional, allCriticalConnected };
  }

  const priorityLabel = targetCard.critical ? "Critical" : "Recommended";
  const priorityTone = targetCard.critical ? "danger" : "warning";

  const blockerMap = {
    launch_blocker: ["website", "woocommerce", "shopify", "smtp", "mailer"],
    attribution_blocker: ["ga4", "gtm", "meta-pixel", "tiktok-pixel", "custom-analytics"],
    publishing_blocker: ["instagram", "facebook", "tiktok", "youtube", "linkedin"],
    data_learning_blocker: ["search-console", "mailchimp", "meta-ads", "google-ads"]
  };

  let reasonType = "launch_blocker";

  for (const [type, ids] of Object.entries(blockerMap)) {
    if (ids.includes(targetCard.id)) {
      reasonType = type;
      break;
    }
  }

  const reasonLabels = {
    launch_blocker: "Launch blocker",
    attribution_blocker: "Attribution blocker",
    publishing_blocker: "Publishing blocker",
    data_learning_blocker: "Data learning blocker"
  };

  const impactChips = [];

  if (targetCard.critical) {
    impactChips.push("Launch readiness");
  }

  if (["ga4", "search-console", "gtm", "meta-pixel", "custom-analytics", "website"].includes(targetCard.id)) {
    impactChips.push("Analytics");
  }

  if (["instagram", "facebook", "tiktok", "youtube", "linkedin"].includes(targetCard.id)) {
    impactChips.push("Publishing");
  }

  if (["woocommerce", "shopify", "amazon", "ebay"].includes(targetCard.id)) {
    impactChips.push("Commerce");
  }

  if (["meta-ads", "google-ads", "tiktok-ads", "meta-pixel", "tiktok-pixel"].includes(targetCard.id)) {
    impactChips.push("Ads optimization");
  }

  return {
    healthy: false,
    card: targetCard,
    priorityLabel,
    priorityTone,
    reasonType,
    reasonLabel: reasonLabels[reasonType] || "Launch blocker",
    impactChips,
    allCriticalConnected
  };
}

export function buildSuggestedValues(state = {}, integration = {}, options = {}) {
  const getSuggestedFieldValue =
    typeof options.getSuggestedFieldValue === "function"
      ? options.getSuggestedFieldValue
      : () => "";

  const fields = Array.isArray(integration.fields) ? integration.fields : [];

  return fields.reduce((accumulator, field) => {
    const suggested = getSuggestedFieldValue(state, integration, field);

    if (suggested) {
      accumulator[field.key] = suggested;
    }

    return accumulator;
  }, {});
}

export function buildLegacyFallbackRecord(integration = {}, state = {}, options = {}) {
  const shouldSyncLegacySource =
    typeof options.shouldSyncLegacySource === "function"
      ? options.shouldSyncLegacySource
      : () => false;

  const getLegacySources =
    typeof options.getLegacySources === "function"
      ? options.getLegacySources
      : () => ({});

  const getLegacySourceValue =
    typeof options.getLegacySourceValue === "function"
      ? options.getLegacySourceValue
      : () => "";

  const getIntegrationAccessModel =
    typeof options.getIntegrationAccessModel === "function"
      ? options.getIntegrationAccessModel
      : () => ({ read: [], write: [] });

  const inferScopeKeys =
    typeof options.inferScopeKeys === "function"
      ? options.inferScopeKeys
      : () => [];

  const asString =
    typeof options.asString === "function"
      ? options.asString
      : (value) => value == null ? "" : String(value);

  const asObject =
    typeof options.asObject === "function"
      ? options.asObject
      : (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};

  if (!shouldSyncLegacySource(integration)) {
    return {};
  }

  const sources = getLegacySources(state);
  const value = getLegacySourceValue(integration, sources);

  if (!value) {
    return {};
  }

  const accessModel = getIntegrationAccessModel(integration);
  const sourceRecord = asObject(sources[integration.sourceKey]);

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
    last_sync_at: asString(sourceRecord.updated_at),
    updated_at: asString(sourceRecord.updated_at),
    legacy_source: true
  };
}
