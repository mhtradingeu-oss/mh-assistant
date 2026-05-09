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
