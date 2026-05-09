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
