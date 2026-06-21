import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
import {
  getAssetNextAction,
  getCategoryReadinessList,
  getMissingAssetLabels,
  renderAssetDependencyRows
} from "../asset-library.js";

const campaignSessions = new Map();
const campaignSaveTimers = new Map();

const WAVE_DEFS = [
  {
    index: 1,
    key: "wave1",
    label: "Wave 1",
    defaultRole: "Launch and announcement",
    roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
  },
  {
    index: 2,
    key: "wave2",
    label: "Wave 2",
    defaultRole: "Education and proof",
    roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
  },
  {
    index: 3,
    key: "wave3",
    label: "Wave 3",
    defaultRole: "Conversion and retargeting",
    roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
  }
];

const CHANNEL_LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  email: "Email",
  website: "Website",
  seo: "SEO",
  google: "Google",
  google_ads: "Google Ads",
  meta: "Meta Ads",
  blog: "Blog",
  ads: "Paid Media",
  analytics: "Analytics",
  ecommerce: "Ecommerce",
  linkedin: "LinkedIn"
};

const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
const CAMPAIGN_ROLE_DEFAULTS = {
  serviceDomain: "campaign",
  ownerRole: "strategist",
  reviewRole: "admin"
};
const CAMPAIGN_ROUTE_ROLES = {
  "content-studio": { role: "writer", domain: "content" },
  "media-studio": { role: "designer", domain: "media" },
  publishing: { role: "publisher", domain: "publishing" },
  "ads-manager": { role: "ads_operator", domain: "campaign" },
  "ai-command": { role: "admin", domain: "governance" }
};

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

function toNumber(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrency(value, currency = "USD") {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0
    }).format(parsed);
  } catch (_) {
    return `${currency || "USD"} ${Math.round(parsed)}`;
  }
}

function formatPercent(value, digits = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return `${parsed.toFixed(digits)}%`;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function renderTeamOpsSummary(model, escapeHtml) {
  return `
    <div class="data-stack">
      <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
      <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
      <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
      <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
      <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
    </div>
  `;
}

function channelLabel(value) {
  const key = asString(value).trim().toLowerCase();
  return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
}

function uniqueStrings(values) {
  return Array.from(new Set(
    asArray(values)
      .map((item) => asString(item).trim())
      .filter(Boolean)
  ));
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return asArray(items).filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const normalized = asString(value).trim();
    if (normalized && normalized !== "[object Object]") return normalized;
  }
  return "";
}

function readableValue(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim() === "[object Object]" ? fallback : value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return uniqueStrings(value.map((item) => readableValue(item))).join(", ") || fallback;
  const record = asObject(value);
  return firstNonEmpty(
    record.title,
    record.label,
    record.name,
    record.action,
    record.summary,
    record.description,
    record.recommendation,
    record.reason,
    record.body,
    fallback
  );
}

function isMissingIntelligenceError(error) {
  const status = Number(error?.status);
  if (status !== 404) return false;
  const message = asString(error?.message).toLowerCase();
  return message.includes("insights") || message.includes("learning") || message.includes("not found");
}

function parseList(value) {
  return uniqueStrings(asString(value).split(","));
}

function normalizeRecommendation(item) {
  if (typeof item === "string") {
    return {
      title: "Recommendation",
      action: item,
      domain: "",
      meta: ""
    };
  }

  const record = asObject(item);
  return {
    title: readableValue(record.title || record.label || record.domain, "Recommendation"),
    action: readableValue(record.action || record.summary || record.description || record.recommendation),
    domain: asString(record.domain),
    meta: readableValue(record.meta || record.reason || record.why || record.priority)
  };
}

function buildDefaults(state) {
  const overviewData = asObject(state.data.overview?.overview);
  const readiness = asObject(state.data.readiness?.dashboard);
  const assets = asObject(state.data.assets);
  const activity = asObject(state.data.activity);
  const context = asObject(state.context);

  const market = context.currentMarket || overviewData.market || "";
  const language = context.currentLanguage || overviewData.language || "";
  const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
  const missingAssets = getMissingAssetLabels(assets);
  const requiredAssetTypes = getCategoryReadinessList(assets).map((item) => item.display_label || item.label || item.asset_type);
  const scheduledJobs = asArray(activity.scheduled_jobs);
  const channels = Array.from(new Set(
    scheduledJobs
      .map((item) => asString(item.channel).trim().toLowerCase())
      .filter(Boolean)
  ));

  return {
    campaignName,
    campaignGoal: overviewData.primary_goal || "Launch",
    campaignType: overviewData.project_type || "Growth campaign",
    market,
    language,
    productFocus: context.currentProject || overviewData.project_name || "",
    productAngle: overviewData.offer_positioning || overviewData.brand_promise || "",
    audiencePrimary: overviewData.audience_primary || overviewData.target_audience || "",
    audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
    audienceStage: "Warm prospect",
    channelPlan: channels.join(", "),
    offerHeadline: overviewData.value_prop || overviewData.brand_promise || "",
    offerDetail: overviewData.offer_positioning || "",
    startDate: "",
    endDate: "",
    budget: "5000",
    wave1Name: campaignName,
    wave1Focus: "Launch announcement",
    wave1Channels: channels.slice(0, 3).join(", "),
    wave2Name: "Education wave",
    wave2Focus: "Problem awareness and proof",
    wave2Channels: channels.slice(0, 2).join(", "),
    wave3Name: "Conversion wave",
    wave3Focus: "Offer push and retargeting",
    wave3Channels: channels.slice(0, 2).join(", "),
    assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
    executionNotes: asArray(readiness.next_best_actions).join("; ")
  };
}

function ensureSession(projectName, defaults) {
  const key = projectName || "__default__";

  if (!campaignSessions.has(key)) {
    campaignSessions.set(key, {
      values: { ...defaults },
      recordId: "",
      intelligence: {
        status: "idle",
        insights: null,
        learning: null,
        error: ""
      },
      generatedPackages: 0,
      lastAiHandoffId: ""
    });
  } else {
    const session = campaignSessions.get(key);
    session.values = { ...defaults, ...asObject(session.values) };
    session.recordId = asString(session.recordId);
    session.intelligence = {
      status: asString(session.intelligence?.status || "idle"),
      insights: session.intelligence?.insights || null,
      learning: session.intelligence?.learning || null,
      error: asString(session.intelligence?.error)
    };
    session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
    session.lastAiHandoffId = asString(session.lastAiHandoffId);
  }

  return campaignSessions.get(key);
}

function renderField({
  name,
  label,
  value,
  helper,
  placeholder,
  escapeHtml,
  multiline = false,
  rows = 3
}) {
  return `
    <div class="setup-field-group">
      <div class="setup-field-head">
        <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
        <span class="setup-field-state is-optional">Draft</span>
      </div>
      ${
        multiline
          ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
          : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
      }
      <div class="setup-helper">${escapeHtml(helper)}</div>
    </div>
  `;
}

function renderSummaryItem(label, value, escapeHtml) {
  return `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(asString(value) || "-")}</strong></div>`;
}

function syncCampaignStudioBridge(projectName, values) {
  const current = getSharedCampaignRecord(projectName, null);
  setSharedCampaignRecord(projectName, {
    ...(current || {}),
    project: projectName || "",
    source_page: "campaign-studio",
    name: asString(values?.campaignName),
    objective: asString(values?.campaignGoal),
    audience: asString(values?.audiencePrimary),
    channels: asString(values?.channelPlan)
      .split(",")
      .map((item) => asString(item))
      .filter(Boolean),
    offer: asString(values?.offerHeadline),
    timeline: [
      asString(values?.startDate),
      asString(values?.endDate)
    ].filter(Boolean).join(" to "),
    budget: asString(values?.budget),
    status: "draft",
    form_values: { ...asObject(values) },
    updated_at: new Date().toISOString()
  });
}

function hydrateValuesFromCampaignRecord(defaults, campaign) {
  const record = asObject(campaign);
  const formValues = asObject(record.form_values);

  return {
    ...defaults,
    ...formValues,
    campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
    campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
    audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
    channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
    offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
    budget: asString(formValues.budget || record.budget || defaults.budget)
  };
}

function joinPackageList(value) {
  if (!Array.isArray(value)) return readableValue(value);
  return uniqueStrings(asArray(value).map((item) => {
    if (typeof item === "string") return item;
    const record = asObject(item);
    return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  })).join(", ");
}

function phaseValue(phases, index, key) {
  const phase = asObject(asArray(phases)[index]);
  if (!Object.keys(phase).length) return "";
  if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  if (key === "channels") return joinPackageList(phase.channels);
  return "";
}

function applyAiCampaignHandoff(projectName, operations, session) {
  const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;

  const payload = asObject(handoff.payload);
  const output = asObject(payload.output);
  const response = asObject(output.response || output);
  const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  if (!Object.keys(pkg).length) return false;

  const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  session.values = {
    ...session.values,
    campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
    campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
    productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
    productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
    audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
    audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
    channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
    offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
    offerDetail: firstNonEmpty(joinPackageList(pkg.adAngles || pkg.ad_angles), session.values.offerDetail),
    wave1Name: firstNonEmpty(phaseValue(phases, 0, "name"), session.values.wave1Name),
    wave1Focus: firstNonEmpty(phaseValue(phases, 0, "focus"), session.values.wave1Focus),
    wave1Channels: firstNonEmpty(phaseValue(phases, 0, "channels"), session.values.wave1Channels),
    wave2Name: firstNonEmpty(phaseValue(phases, 1, "name"), session.values.wave2Name),
    wave2Focus: firstNonEmpty(phaseValue(phases, 1, "focus"), session.values.wave2Focus),
    wave2Channels: firstNonEmpty(phaseValue(phases, 1, "channels"), session.values.wave2Channels),
    wave3Name: firstNonEmpty(phaseValue(phases, 2, "name"), session.values.wave3Name),
    wave3Focus: firstNonEmpty(phaseValue(phases, 2, "focus"), session.values.wave3Focus),
    wave3Channels: firstNonEmpty(phaseValue(phases, 2, "channels"), session.values.wave3Channels),
    assetChecklist: firstNonEmpty(joinPackageList(pkg.requiredAssets || pkg.required_assets), session.values.assetChecklist),
    executionNotes: firstNonEmpty(
      joinPackageList([
        ...asArray(pkg.missingBlockers || pkg.missing_blockers || pkg.blockers),
        ...asArray(pkg.nextActions || pkg.next_actions)
      ]),
      session.values.executionNotes
    )
  };
  session.generatedPackages += 1;
  session.lastAiHandoffId = handoffId;
  setSharedCampaignRecord(projectName, {
    ...(getSharedCampaignRecord(projectName, operations) || {}),
    project: projectName,
    source_page: "ai-command",
    name: session.values.campaignName,
    objective: session.values.campaignGoal,
    audience: session.values.audiencePrimary,
    channels: parseList(session.values.channelPlan),
    offer: session.values.offerHeadline,
    status: "draft",
    form_values: { ...session.values },
    updated_at: new Date().toISOString()
  });
  return true;
}

function confirmCampaignStudioAuthorityAction(action, detail = "") {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;

  const message = [
    `Confirm Campaign Studio action: ${action}`,
    "",
    detail || "This action may create or update backend campaign records or route handoffs.",
    "",
    "Authority: This does not publish, send externally, schedule ads, or approve anything automatically.",
    "Select Cancel to review the campaign plan, evidence, and destination before continuing."
  ].join("\n");

  return window.confirm(message);
}

function buildCampaignRecordPayload(projectName, session) {
  const values = asObject(session.values);
  const timeline = [asString(values.startDate), asString(values.endDate)].filter(Boolean).join(" to ");

  return {
    id: session.recordId || undefined,
    name: asString(values.campaignName || projectName),
    objective: asString(values.campaignGoal),
    audience: asString(values.audiencePrimary),
    channels: asString(values.channelPlan),
    offer: asString(values.offerHeadline),
    timeline,
    budget: asString(values.budget),
    status: "draft",
    source_page: "campaign-studio",
    owner: "Strategist",
    owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
    review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
    service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
    linked_assets: [],
    linked_tasks: [],
    linked_approvals: [],
    form_values: { ...values }
  };
}

function persistCampaignRouteHandoff({ projectName, session, destinationPage, createProjectHandoff }) {
  const destination = CAMPAIGN_ROUTE_ROLES[destinationPage];
  if (!projectName || !destination) return;

  const handoff = {
    source_page: "campaign-studio",
    destination_page: destinationPage,
    source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
    destination_role: destination.role,
    source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: destination.domain,
    linked_entity: {
      entity_type: "campaign",
      entity_id: session.recordId || "",
      route: "campaign-studio",
      label: asString(session.values.campaignName || projectName)
    },
    payload: {
      campaign_id: session.recordId || "",
      campaign_name: asString(session.values.campaignName || projectName),
      owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
      review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
      service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
      draft_context: buildCampaignRecordPayload(projectName, session)
    }
  };

  setSharedHandoff(projectName, destinationPage, handoff);

  if (!confirmCampaignStudioAuthorityAction(
    "Create campaign route handoff",
    `This will create a backend handoff from Campaign Studio to ${destinationPage} for review and execution preparation.`
  )) {
    return;
  }

  createProjectHandoff?.(projectName, handoff).catch((error) => {
    console.warn("Failed to persist campaign route handoff:", error.message);
  });
}

function scheduleCampaignPersistence(projectName, session, saveProjectCampaign) {
  if (!projectName || typeof saveProjectCampaign !== "function") {
    return;
  }

  const key = projectName || "__default__";
  const existing = campaignSaveTimers.get(key);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(() => {
    const draft = {
      ...buildCampaignRecordPayload(projectName, session),
      local_only: true,
      autosave_note: "Campaign Studio autosave is local/shared-state only. Use Save campaign draft or Save campaign plan for backend persistence."
    };
    setSharedCampaignRecord(projectName, draft);
  }, 250);

  campaignSaveTimers.set(key, timer);
}

function renderEmptyState(title, description, escapeHtml) {
  return `
    <div class="campaign-studio-empty-state">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function renderIntelligenceList(items, escapeHtml, title, description) {
  if (!items.length) {
    return renderEmptyState(title, description, escapeHtml);
  }

  return `
    <div class="insights-mini-list">
      ${items.map((item) => `
        <div class="insights-mini-item">
          <strong>${escapeHtml(item.title || item.label || "Signal")}</strong>
          <span>${escapeHtml(item.body || item.meta || item.description || "-")}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getInsightSource(state, session) {
  const activity = asObject(state.data.activity);
  const overview = asObject(state.data.overview);
  const fetchedInsights = asObject(session.intelligence?.insights);
  const fetchedLearning = asObject(session.intelligence?.learning);

  return {
    insights: asObject(
      fetchedInsights.insights ||
      fetchedInsights.data ||
      fetchedInsights ||
      activity.insights ||
      activity.marketing_insights ||
      activity.performance_insights ||
      overview.insights
    ),
    learning: asObject(
      fetchedLearning.learning ||
      fetchedLearning.data ||
      fetchedLearning ||
      activity.learning
    )
  };
}

function collectPatternSignals(items, mode = "strong") {
  return uniqueBy(asArray(items).map((item) => {
    const record = asObject(item);
    const format = firstNonEmpty(record.format, record.content_type, record.type);
    const topic = firstNonEmpty(record.topic, record.angle, record.hook, record.headline);
    const why = firstNonEmpty(
      record.why_it_worked,
      record.insight,
      record.reason,
      record.likely_reason,
      record.improve_next,
      record.recommendation
    );
    const label = format ? `${titleCase(format)} pattern` : firstNonEmpty(record.title, record.label, "Content pattern");
    const body = topic && why ? `${topic} • ${why}` : topic || why;

    return {
      title: label,
      body: body || (mode === "strong" ? "Performance signal detected." : "Weak pattern signal detected.")
    };
  }), (item) => `${item.title}|${item.body}`).slice(0, 4);
}

function collectPublishingWindows(insights, learning, topContent) {
  const social = asObject(insights.social);
  const windows = [
    ...asArray(social.best_posting_windows),
    ...asArray(social.posting_windows),
    ...asArray(asObject(learning.learning_patterns).best_posting_windows),
    ...asArray(topContent).map((item) => asObject(item).posting_window)
  ];

  return uniqueStrings(windows).slice(0, 4).map((item) => ({
    title: item,
    body: "Best publishing window detected from current campaign intelligence."
  }));
}

function collectSeoOpportunities(insights) {
  const seo = asObject(insights.seo);
  const opportunities = [
    ...asArray(seo.opportunities),
    ...asArray(seo.recommendations),
    ...asArray(seo.ctr_opportunities),
    ...asArray(seo.top_queries)
  ];

  return uniqueBy(opportunities.map((item) => {
    if (typeof item === "string") {
      return {
        title: item,
        body: "SEO opportunity detected from connected search or website data."
      };
    }

    const record = asObject(item);
    return {
      title: firstNonEmpty(record.query, record.page, record.title, record.label, "SEO opportunity"),
      body: firstNonEmpty(record.opportunity, record.recommendation, record.reason, record.summary, "Improve visibility or click-through rate.")
    };
  }), (item) => `${item.title}|${item.body}`).slice(0, 4);
}

function collectPaidSignals(insights) {
  const paid = asObject(insights.paid);
  const list = [];
  const summary = asObject(paid.summary || paid.overview || paid);

  if (summary.roas != null || summary.ctr != null || summary.cpa != null) {
    list.push({
      title: "Paid efficiency",
      body: `ROAS ${summary.roas != null ? Number(summary.roas).toFixed(2) : "-"} • CTR ${summary.ctr != null ? formatPercent(summary.ctr, 1) : "-"} • CPA ${summary.cpa != null ? formatCurrency(summary.cpa) : "-"}`
    });
  }

  asArray(paid.best_campaigns || paid.best_creatives).slice(0, 2).forEach((item) => {
    const record = asObject(item);
    list.push({
      title: firstNonEmpty(record.campaign_name, record.title, record.label, "Top paid signal"),
      body: firstNonEmpty(record.reason, record.insight, record.summary, record.recommendation, "This campaign is outperforming peers.")
    });
  });

  asArray(paid.weak_campaigns || paid.weak_creatives).slice(0, 2).forEach((item) => {
    const record = asObject(item);
    list.push({
      title: firstNonEmpty(record.campaign_name, record.title, record.label, "Paid risk"),
      body: firstNonEmpty(record.reason, record.insight, record.summary, record.recommendation, "Performance or setup risk detected.")
    });
  });

  return uniqueBy(list, (item) => `${item.title}|${item.body}`).slice(0, 4);
}

function buildPlatformSignals({ topContent, weakContent, connectedChannels, checks, recommendations }) {
  const topCounts = new Map();
  const weakCounts = new Map();

  asArray(topContent).forEach((item) => {
    const key = asString(asObject(item).platform || asObject(item).channel).trim().toLowerCase();
    if (!key) return;
    topCounts.set(key, (topCounts.get(key) || 0) + 1);
  });

  asArray(weakContent).forEach((item) => {
    const key = asString(asObject(item).platform || asObject(item).channel).trim().toLowerCase();
    if (!key) return;
    weakCounts.set(key, (weakCounts.get(key) || 0) + 1);
  });

  const strongest = Array.from(topCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({
      title: channelLabel(key),
      body: `${count} top-performing content signals point here.`
    }));

  const weak = Array.from(weakCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({
      title: channelLabel(key),
      body: `${count} weak-content signals suggest the format or execution needs adjustment.`
    }));

  Object.entries(asObject(checks)).forEach(([key, isReady]) => {
    if (isReady || strongest.find((item) => item.title === channelLabel(key)) || weak.find((item) => item.title === channelLabel(key))) {
      return;
    }

    if (["website", "analytics", "ecommerce"].includes(key)) return;

    weak.push({
      title: channelLabel(key),
      body: "This platform is not operational yet, so campaign execution will be constrained."
    });
  });

  if (!strongest.length && connectedChannels.length) {
    connectedChannels.slice(0, 3).forEach((item) => {
      strongest.push({
        title: channelLabel(item),
        body: "Currently connected and available for execution, but richer performance data is still needed."
      });
    });
  }

  if (!weak.length && recommendations.length) {
    weak.push({
      title: "No weak platform flagged yet",
      body: "Connect more performance data to identify where channel mix should be reduced or repaired."
    });
  }

  return {
    strongest: strongest.slice(0, 3),
    weak: weak.slice(0, 3)
  };
}

function buildChannelMix({ strongestPlatforms, weakPlatforms, connectedChannels, checks, paidSignals, seoOpportunities, recommendations }) {
  const organic = [];
  const paid = [];
  const support = [];

  strongestPlatforms.forEach((item) => {
    organic.push({
      label: item.title,
      confidence: "High",
      rationale: item.body
    });
  });

  if (!organic.length) {
    uniqueStrings([...connectedChannels, "email", "website"]).slice(0, 3).forEach((item) => {
      organic.push({
        label: channelLabel(item),
        confidence: checks[item] ? "Medium" : "Low",
        rationale: checks[item]
          ? "Connected inside the current system, so this channel can support launch execution."
          : "Useful in the mix, but connection or live performance data is still sparse."
      });
    });
  }

  if (paidSignals.length) {
    paidSignals.slice(0, 3).forEach((item) => {
      const label = /google/i.test(item.title)
        ? "Google Ads"
        : /tiktok/i.test(item.title)
          ? "TikTok Ads"
          : "Meta Ads";

      paid.push({
        label,
        confidence: "High",
        rationale: item.body
      });
    });
  }

  if (!paid.length) {
    ["meta", "google_ads", "tiktok"].forEach((item) => {
      const connected = Boolean(checks[item]);
      paid.push({
        label: channelLabel(item),
        confidence: connected ? "Medium" : "Low",
        rationale: connected
          ? "Platform connection exists, so this can be activated once the campaign package is ready."
          : "Useful paid lever, but it still needs platform connection or performance feedback."
      });
    });
  }

  support.push({
    label: "Email",
    confidence: checks.email ? "High" : "Medium",
    rationale: checks.email
      ? "Use lifecycle support to reinforce the launch and recover warm traffic."
      : "Add email support once the channel is connected and lists are ready."
  });
  support.push({
    label: "SEO / Landing Pages",
    confidence: seoOpportunities.length ? "High" : (checks.website ? "Medium" : "Low"),
    rationale: seoOpportunities[0]?.body || "Use website and search support to capture campaign intent beyond social reach."
  });
  support.push({
    label: "Analytics / Tracking",
    confidence: checks.analytics || checks.website ? "High" : "Low",
    rationale: "Campaign decisions will improve materially once attribution and landing behavior are measurable."
  });

  weakPlatforms.forEach((item) => {
    const match = organic.find((entry) => entry.label === item.title);
    if (match && match.confidence === "High") {
      match.confidence = "Medium";
      match.rationale = `${match.rationale} Watch for risk: ${item.body}`;
    }
  });

  if (!recommendations.length) {
    support.push({
      label: "Insights feedback loop",
      confidence: "Low",
      rationale: "The system needs more performance and learning data to tighten the recommendation quality."
    });
  }

  return {
    organic: uniqueBy(organic, (item) => item.label).slice(0, 3),
    paid: uniqueBy(paid, (item) => item.label).slice(0, 3),
    support: uniqueBy(support, (item) => item.label).slice(0, 3)
  };
}

function buildExecutionReadiness({
  values,
  checks,
  missingAssets,
  missingIntegrations,
  recommendations,
  connectedChannels,
  seoOpportunities,
  channelMix
}) {
  const publishingBlockers = [];
  const adsBlockers = [];
  const trackingBlockers = [];
  const seoBlockers = [];
  const approvalBlockers = [];

  if (!values.startDate) publishingBlockers.push("Set a launch start date before pushing work downstream.");
  if (!values.channelPlan) publishingBlockers.push("Define the operational channel plan so scheduling knows what to activate.");
  if (!connectedChannels.some((item) => PUBLISHING_KEYS.includes(item))) {
    publishingBlockers.push("No publishing channel is connected yet.");
  }
  if (missingAssets.length) {
    publishingBlockers.push("Critical creative or offer assets are still missing.");
  }

  if (!values.budget) adsBlockers.push("Add a working campaign budget before routing to Ads Manager.");
  if (!channelMix.paid.length) adsBlockers.push("No paid channel recommendation is strong enough yet.");
  if (!Object.keys(checks).some((key) => PAID_KEYS.includes(key) && checks[key])) {
    adsBlockers.push("No paid media platform is connected.");
  }
  if (!values.offerHeadline) adsBlockers.push("Offer headline is still too incomplete for ad packaging.");

  if (!Object.keys(checks).some((key) => TRACKING_KEYS.includes(key) && checks[key])) {
    trackingBlockers.push("Website, analytics, or ecommerce tracking is not connected.");
  }
  if (!values.campaignName || !values.campaignGoal) {
    trackingBlockers.push("Campaign naming and goal framing should be locked before measurement packages are generated.");
  }
  if (!recommendations.length) {
    trackingBlockers.push("Live intelligence is still sparse, so optimization loops will be weaker after launch.");
  }

  if (!checks.website) seoBlockers.push("Website source is not connected yet.");
  if (!seoOpportunities.length) seoBlockers.push("No search opportunity feed is loaded yet.");
  if (!values.offerDetail) seoBlockers.push("Offer detail is too light to brief landing pages and SEO content well.");

  if (!values.executionNotes) approvalBlockers.push("Execution notes are missing, which makes approvals harder downstream.");
  if (!values.audiencePrimary || !values.audienceNeed) approvalBlockers.push("Audience framing is incomplete for creative review.");
  if (!values.productAngle) approvalBlockers.push("Product angle needs to be explicit so operators do not improvise.");

  const status =
    publishingBlockers.length ||
    adsBlockers.length ||
    trackingBlockers.length ||
    seoBlockers.length ||
    approvalBlockers.length ||
    missingIntegrations.length ||
    missingAssets.length
      ? "Needs attention"
      : "Ready to route";

  return {
    status,
    missingAssets,
    missingIntegrations,
    publishingBlockers,
    adsBlockers,
    trackingBlockers,
    seoBlockers,
    approvalBlockers,
    total:
      missingAssets.length +
      missingIntegrations.length +
      publishingBlockers.length +
      adsBlockers.length +
      trackingBlockers.length +
      seoBlockers.length +
      approvalBlockers.length
  };
}

function buildStrategyGuidance({
  values,
  recommendations,
  overviewData,
  aiRecommendations,
  strongestPlatforms,
  channelMix,
  readiness,
  readinessStatus
}) {
  const topRecommendation = recommendations[0] || normalizeRecommendation(asArray(readiness.next_best_actions)[0] || "");
  const topOrganic = channelMix.organic[0];
  const topPaid = channelMix.paid[0];

  return {
    angle: firstNonEmpty(
      aiRecommendations.campaign_angle,
      aiRecommendations.angle,
      recommendations.find((item) => item.domain === "content")?.action,
      values.productAngle,
      overviewData.offer_positioning,
      overviewData.brand_promise,
      "Refine the campaign angle once stronger content and audience learning is available."
    ),
    offer: firstNonEmpty(
      aiRecommendations.offer_focus,
      aiRecommendations.offer,
      recommendations.find((item) => item.domain === "paid")?.action,
      values.offerHeadline,
      "Clarify the single strongest commercial promise before launch."
    ),
    audience: firstNonEmpty(
      aiRecommendations.audience_emphasis,
      aiRecommendations.audience,
      values.audiencePrimary,
      overviewData.target_audience,
      "Define the highest-priority segment more tightly so creative and distribution stay aligned."
    ),
    channels: topOrganic || topPaid
      ? `${topOrganic ? `${topOrganic.label} first` : ""}${topOrganic && topPaid ? " • " : ""}${topPaid ? `${topPaid.label} as paid support` : ""}`
      : strongestPlatforms[0]?.title || "Connect more intelligence to improve channel emphasis.",
    nextAction: firstNonEmpty(
      topRecommendation.action,
      asArray(readiness.next_best_actions)[0],
      readinessStatus ? `Readiness status is ${readinessStatus}. Close the top blocker before routing this campaign.` : "",
      "Use the current blockers and recommendations to choose the next highest-impact execution step."
    )
  };
}

function buildWavePlans(values, channelMix, missingAssets) {
  const recommendedChannels = uniqueStrings([
    ...channelMix.organic.map((item) => item.label.toLowerCase()),
    ...channelMix.paid.map((item) => item.label.toLowerCase()),
    ...channelMix.support.map((item) => item.label.toLowerCase())
  ]);

  return WAVE_DEFS.map((wave) => {
    const name = asString(values[`${wave.key}Name`]);
    const focus = asString(values[`${wave.key}Focus`]);
    const channels = parseList(values[`${wave.key}Channels`]);
    const missingInputs = [];

    if (!name) missingInputs.push("Wave name");
    if (!focus) missingInputs.push("Wave focus");
    if (!channels.length) missingInputs.push("Wave channels");
    if (missingAssets.length) missingInputs.push("Supporting assets");

    const status = !missingInputs.length ? "Ready" : (channels.length || focus ? "Needs inputs" : "Blocked");
    const suggestedRole = wave.defaultRole;
    const allocationSuggestion = channels.length
      ? channels.map((item) => channelLabel(item)).join(", ")
      : recommendedChannels.slice(wave.index - 1, wave.index + 1).map((item) => channelLabel(item)).join(", ") || "No channel recommendation yet";

    const supportingAssetSuggestion = wave.index === 1
      ? "Hero visual, launch copy, offer banner"
      : wave.index === 2
        ? "Proof assets, FAQ content, educational visual set"
        : "Retargeting creative, urgency variants, CTA refresh";

    return {
      ...wave,
      status,
      missingInputs,
      suggestedRole,
      allocationSuggestion,
      supportingAssetSuggestion
    };
  });
}

function buildCampaignModel(state, session, values) {
  const overviewBlock = asObject(state.data.overview);
  const overviewData = asObject(overviewBlock.overview);
  const readinessRoot = asObject(state.data.readiness);
  const readiness = asObject(readinessRoot.dashboard);
  const integrations = asObject(state.data.integrations);
  const activity = asObject(state.data.activity);
  const assets = asObject(state.data.assets);
  const checks = asObject(integrations.readiness?.checks);
  const controlCenter = asObject(integrations.control_center);
  const { insights, learning } = getInsightSource(state, session);
  const recommendations = uniqueBy(
    asArray(learning.recommendations || insights.recommendations || overviewBlock.next_best_actions || readiness.next_best_actions)
      .map((item) => normalizeRecommendation(item)),
    (item) => `${item.title}|${item.action}|${item.domain}`
  );

  const campaignAssetKeys = [
    "product_csv",
    "pricing_doc",
    "product_photos",
    "product_videos",
    "campaign_assets",
    "social_assets",
    "packaging_images"
  ];
  const campaignAssetCategories = getCategoryReadinessList(assets)
    .filter((item) => campaignAssetKeys.includes(item.asset_type));
  const missingAssets = getMissingAssetLabels(assets, campaignAssetKeys);
  const requiredAssetTypes = uniqueStrings(campaignAssetCategories.map((item) => item.display_label || item.label || item.asset_type));
  const assetTypesPresent = uniqueStrings(
    campaignAssetCategories
      .filter((item) => item.status !== "Missing")
      .map((item) => item.display_label || item.label || item.asset_type)
  );
  const connectedChannels = uniqueStrings(
    Object.entries(checks)
      .filter(([, isReady]) => Boolean(isReady))
      .map(([key]) => key)
  );
  const scheduledJobs = asArray(activity.scheduled_jobs);
  const sourceCoverage = asObject(insights.data_coverage);
  const missingIntegrations = [];

  Object.entries(sourceCoverage).forEach(([key, item]) => {
    const record = asObject(item);
    if (asString(record.status) !== "covered") {
      missingIntegrations.push({
        title: channelLabel(key),
        body: firstNonEmpty(record.status, "missing")
      });
    }
  });

  Object.entries(checks).forEach(([key, isReady]) => {
    if (isReady) return;
    if (missingIntegrations.find((item) => item.title === channelLabel(key))) return;
    missingIntegrations.push({
      title: channelLabel(key),
      body: "Connection or readiness check is still incomplete."
    });
  });

  Object.values(asObject(controlCenter.records)).forEach((item) => {
    const record = asObject(item);
    const status = asString(record.status);
    if (!["error", "token_expired", "partial"].includes(status)) return;
    missingIntegrations.push({
      title: channelLabel(record.integration_id),
      body: firstNonEmpty(record.health_summary, record.last_error, record.status_label, "Connection health needs attention.")
    });
  });

  const topContent = asArray(insights.best_performing_content || insights.top_content);
  const weakContent = asArray(insights.underperforming_content || insights.weak_content);
  const platformSignals = buildPlatformSignals({
    topContent,
    weakContent,
    connectedChannels,
    checks,
    recommendations
  });
  const topPatterns = collectPatternSignals(topContent, "strong");
  const weakPatterns = collectPatternSignals(weakContent, "weak");
  const publishingWindows = collectPublishingWindows(insights, learning, topContent);
  const seoOpportunities = collectSeoOpportunities(insights);
  const paidSignals = collectPaidSignals(insights);
  const channelMix = buildChannelMix({
    strongestPlatforms: platformSignals.strongest,
    weakPlatforms: platformSignals.weak,
    connectedChannels,
    checks,
    paidSignals,
    seoOpportunities,
    recommendations
  });
  const executionReadiness = buildExecutionReadiness({
    values,
    checks,
    missingAssets,
    missingIntegrations,
    recommendations,
    connectedChannels,
    seoOpportunities,
    channelMix
  });
  const strategyGuidance = buildStrategyGuidance({
    values,
    recommendations,
    overviewData,
    aiRecommendations: asObject(learning.ai_recommendations || insights.ai_recommendations),
    strongestPlatforms: platformSignals.strongest,
    channelMix,
    readiness,
    readinessStatus: readiness.readiness_status || overviewData.readiness_status
  });
  const waves = buildWavePlans(values, channelMix, missingAssets);

  return {
    overviewData,
    readiness,
    checks,
    recommendations,
    connectedChannels,
    scheduledJobs,
    requiredAssetTypes,
    assetTypesPresent,
    campaignAssetKeys,
    campaignAssetCategories,
    assetNextAction: getAssetNextAction(assets, campaignAssetKeys),
    missingAssets,
    missingIntegrations: uniqueBy(missingIntegrations, (item) => `${item.title}|${item.body}`),
    platformSignals,
    topPatterns,
    weakPatterns,
    publishingWindows,
    seoOpportunities,
    paidSignals,
    channelMix,
    executionReadiness,
    strategyGuidance,
    waves,
    intelligenceStatus: asString(session.intelligence?.status || "idle"),
    intelligenceError: asString(session.intelligence?.error || ""),
    hasLiveIntelligence: Boolean(Object.keys(insights).length || Object.keys(learning).length)
  };
}

function renderChannelRecommendationCards(items, escapeHtml) {
  if (!items.length) {
    return renderEmptyState(
      "No recommendation yet",
      "Connect more intelligence or lock the campaign inputs to tighten the channel recommendation.",
      escapeHtml
    );
  }

  return `
    <div class="campaign-channel-card-list">
      ${items.map((item) => `
        <div class="campaign-channel-card">
          <div class="campaign-channel-head">
            <strong>${escapeHtml(item.label)}</strong>
            <span class="card-badge ${item.confidence === "High" ? "success" : item.confidence === "Medium" ? "warning" : "neutral"}">${escapeHtml(item.confidence)}</span>
          </div>
          <p>${escapeHtml(item.rationale)}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderBlockerGroup(title, items, escapeHtml, emptyBody) {
  return `
    <div class="campaign-readiness-block">
      <div class="campaign-readiness-head">
        <strong>${escapeHtml(title)}</strong>
        <span class="card-badge ${items.length ? "danger" : "success"}">${escapeHtml(items.length ? `${items.length} open` : "Clear")}</span>
      </div>
      ${
        items.length
          ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
      }
    </div>
  `;
}

function startIntelligenceHydration({
  session,
  projectName,
  fetchProjectInsights,
  fetchProjectLearning,
  render,
  showError
}) {
  if (!projectName) return;
  if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
  if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;

  session.intelligence.status = "loading";
  session.intelligence.error = "";

  Promise.allSettled([
    typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
    typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
  ])
    .then(([insightsResult, learningResult]) => {
      const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
      const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
      const insights = insightsResult?.status === "fulfilled"
        ? insightsResult.value
        : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
      const learning = learningResult?.status === "fulfilled"
        ? learningResult.value
        : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
      const errors = [
        insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
        learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
      ].filter(Boolean);

      session.intelligence.status = (insights || learning) ? "loaded" : "error";
      session.intelligence.insights = insights;
      session.intelligence.learning = learning;
      session.intelligence.error = errors.join(" • ");

      if (session.intelligence.status === "error" && session.intelligence.error) {
        showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
      }

      render();
    })
    .catch((error) => {
      session.intelligence.status = "error";
      session.intelligence.error = error?.message || "Failed to load campaign intelligence";
      showError?.(session.intelligence.error);
      render();
    });
}

function bindCampaignStudio({
  $,
  getState,
  navigateTo,
  showMessage,
  showError,
  render,
  fetchProjectInsights,
  fetchProjectLearning,
  saveProjectCampaign,
  createProjectHandoff
}) {
  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, buildDefaults(state));
  const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
  if (durableCampaign) {
    session.recordId = asString(durableCampaign.id || session.recordId);
    session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
  }
  applyAiCampaignHandoff(projectName, state.data.operations, session);
  syncCampaignStudioBridge(projectName, session.values);

  const form = $("campaignStudioForm");
  if (form) {
    form.oninput = (event) => {
      const target = event.target;
      if (!target?.name) return;

      session.values[target.name] = target.value || "";
      syncCampaignStudioBridge(projectName, session.values);
      scheduleCampaignPersistence(projectName, session, saveProjectCampaign);

      // Do not rerender on every keystroke.
      // Rerendering here replaces the focused input and breaks typing/focus.
      // Explicit actions such as Save, Build, Refresh, and route handoffs still
      // persist the latest session values.
    };
  }

  const saveBtn = $("campaignSaveDraftBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      syncCampaignStudioBridge(projectName, session.values);

      if (!confirmCampaignStudioAuthorityAction(
        "Save backend campaign draft",
        `This will save or update the Campaign Studio draft for ${projectName}.`
      )) {
        showMessage?.("Campaign draft save cancelled.");
        return;
      }

      try {
        const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
        if (result?.campaign?.id) {
          session.recordId = result.campaign.id;
          setSharedCampaignRecord(projectName, result.campaign);
        }
        showMessage?.("Campaign draft saved to the shared operating backbone.");
      } catch (error) {
        showError?.(error.message || "Failed to save campaign plan.");
      }
    };
  }

  const buildBtn = $("campaignBuildPlanBtn");
  if (buildBtn) {
    buildBtn.onclick = async () => {
      syncCampaignStudioBridge(projectName, session.values);

      if (!confirmCampaignStudioAuthorityAction(
        "Save backend campaign plan",
        `This will save or update the Campaign Studio plan for ${projectName}.`
      )) {
        showMessage?.("Campaign plan save cancelled.");
        return;
      }

      try {
        const result = await saveProjectCampaign?.(projectName, {
          ...buildCampaignRecordPayload(projectName, session),
          status: "planned"
        });
        if (result?.campaign?.id) {
          session.recordId = result.campaign.id;
          setSharedCampaignRecord(projectName, result.campaign);
        }
        showMessage?.("Campaign plan saved as a durable shared record.");
      } catch (error) {
        showError?.(error.message || "Failed to structure the campaign plan.");
      }
    };
  }

  const askAiBtn = $("campaignAskAiBtn");
  if (askAiBtn) {
    askAiBtn.onclick = async () => {
      const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
      const input = $("quickCommandInput");
      if (input) {
        input.value = prompt;
      }
      setSharedHandoff(projectName, "ai-command", {
        source_page: "campaign-studio",
        destination_page: "ai-command",
        payload: {
          prompt,
          campaign_id: session.recordId || "",
          campaign_name: session.values.campaignName || projectName,
          draft_context: buildCampaignRecordPayload(projectName, session)
        },
        status: "available"
      });
      if (!confirmCampaignStudioAuthorityAction(
        "Create AI Command campaign handoff",
        "This will create a backend handoff from Campaign Studio to AI Command for review and planning support."
      )) {
        showMessage?.("AI Command handoff cancelled.");
        return;
      }

      createProjectHandoff?.(projectName, {
        source_page: "campaign-studio",
        destination_page: "ai-command",
        source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
        destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
        source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
        destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
        linked_entity: {
          entity_type: "campaign",
          entity_id: session.recordId || ""
        },
        payload: {
          prompt,
          campaign_id: session.recordId || "",
          campaign_name: session.values.campaignName || projectName,
          owner_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
          review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
          service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
          draft_context: buildCampaignRecordPayload(projectName, session)
        }
      }).catch((error) => {
        console.warn("Failed to persist campaign handoff:", error.message);
      });
      navigateTo("ai-command");
      showMessage?.("Campaign context sent to AI Command.");
    };
  }

  const publishingBtn = $("campaignOpenPublishingBtn");
  if (publishingBtn) {
    publishingBtn.onclick = () => {
      persistCampaignRouteHandoff({ projectName, session, destinationPage: "publishing", createProjectHandoff });
      navigateTo("publishing");
    };
  }

  const assetsBtn = $("campaignReviewAssetsBtn");
  if (assetsBtn) {
    assetsBtn.onclick = () => navigateTo("library");
  }

  const contentBtn = $("campaignOpenContentStudioBtn");
  if (contentBtn) {
    contentBtn.onclick = () => {
      persistCampaignRouteHandoff({ projectName, session, destinationPage: "content-studio", createProjectHandoff });
      navigateTo("content-studio");
    };
  }

  const mediaBtn = $("campaignOpenMediaStudioBtn");
  if (mediaBtn) {
    mediaBtn.onclick = () => {
      persistCampaignRouteHandoff({ projectName, session, destinationPage: "media-studio", createProjectHandoff });
      navigateTo("media-studio");
    };
  }

  const adsBtn = $("campaignOpenAdsManagerBtn");
  if (adsBtn) {
    adsBtn.onclick = () => {
      persistCampaignRouteHandoff({ projectName, session, destinationPage: "ads-manager", createProjectHandoff });
      navigateTo("ads-manager");
    };
  }

  const generatePackageBtn = $("campaignGeneratePackageBtn");
  if (generatePackageBtn) {
    generatePackageBtn.onclick = () => {
      session.generatedPackages += 1;
      showMessage?.("Campaign package drafted in this session. Backend export wiring can be connected next.");
      render();
    };
  }

  const dependenciesBtn = $("campaignReviewDependenciesBtn");
  if (dependenciesBtn) {
    dependenciesBtn.onclick = () => {
      const model = buildCampaignModel(state, session, session.values);
      if (model.executionReadiness.missingIntegrations.length) {
        navigateTo("integrations");
        return;
      }
      if (model.executionReadiness.missingAssets.length) {
        navigateTo("library");
        return;
      }
      navigateTo("insights");
    };
  }

  const refreshIntelligenceBtn = $("campaignRefreshIntelligenceBtn");
  if (refreshIntelligenceBtn) {
    refreshIntelligenceBtn.onclick = () => {
      session.intelligence.status = "idle";
      session.intelligence.error = "";
      startIntelligenceHydration({
        session,
        projectName,
        fetchProjectInsights,
        fetchProjectLearning,
        render,
        showError
      });
      render();
      showMessage?.("Refreshing campaign intelligence.");
    };
  }
}

export const campaignStudioRoute = {
  id: "campaign-studio",
  disableStandardLayout: true,
  meta: {
    eyebrow: "AI & Build",
    title: "Campaign Studio",
    description: "Plan campaign basics, launch waves, channel mix, and required assets in one execution-oriented workspace."
  },
  template: `
    <section class="page is-active" data-page="campaign-studio">
      <div id="campaignStudioRoot"></div>
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
    fetchProjectInsights,
    fetchProjectLearning,
    saveProjectCampaign,
    createProjectHandoff
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const session = ensureSession(projectName, buildDefaults(state));
    applyAiCampaignHandoff(projectName, state.data.operations, session);
    const values = session.values;
    const root = $("campaignStudioRoot");
    if (!root) return;

    const rerender = () => this.render({
      getState,
      $,
      escapeHtml,
      safeText,
      navigateTo,
      showMessage,
      showError,
      fetchProjectInsights,
      fetchProjectLearning,
      saveProjectCampaign,
      createProjectHandoff
    });

    startIntelligenceHydration({
      session,
      projectName,
      fetchProjectInsights,
      fetchProjectLearning,
      render: rerender,
      showError
    });

    const model = buildCampaignModel(state, session, values);
    const {
      overviewData,
      connectedChannels,
      scheduledJobs,
      requiredAssetTypes,
      assetTypesPresent,
      campaignAssetKeys,
      assetNextAction,
      missingAssets,
      missingIntegrations,
      platformSignals,
      topPatterns,
      weakPatterns,
      publishingWindows,
      seoOpportunities,
      paidSignals,
      channelMix,
      executionReadiness,
      strategyGuidance,
      waves,
      recommendations,
      intelligenceStatus,
      intelligenceError,
      hasLiveIntelligence
    } = model;
    const activeCampaignLabel = safeText(firstNonEmpty(state.context.activeCampaign, values.campaignName), projectName || "Campaign Studio");
    const intelligenceLabel = intelligenceStatus === "loading" ? "Refreshing" : hasLiveIntelligence ? "Live intelligence" : "Draft-assisted";
    const intelligenceTone = intelligenceStatus === "loading" ? "warning" : hasLiveIntelligence ? "success" : "neutral";
    const readinessTone = executionReadiness.total ? "warning" : "success";
    const blockerTone = executionReadiness.total ? "warning" : "success";
    const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
    const channelStateLabel = connectedChannels.length
      ? `${connectedChannels.length} connected`
      : recommendedChannelCount
        ? `${recommendedChannelCount} recommended`
        : "Needs signal";
    const channelTone = connectedChannels.length ? "success" : recommendedChannelCount ? "warning" : "neutral";
    const budgetValue = formatCurrency(values.budget, overviewData.currency || "USD");
    const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;
    const launchWindowLabel = [values.startDate, values.endDate].filter(Boolean).join(" to ") || "Window pending";
    const marketLabel = safeText(firstNonEmpty(values.market, overviewData.market), "Market pending");
    const productLabel = safeText(firstNonEmpty(values.productFocus, overviewData.project_name, projectName), "Product pending");
    const goalLabel = safeText(values.campaignGoal, "Goal pending");
    const strategistNextAction = safeText(strategyGuidance.nextAction, "Review campaign plan");
    const strategistMode = hasLiveIntelligence
      ? "Current intelligence is shaping campaign direction and readiness."
      : "Current draft data is projecting direction until live intelligence arrives.";

    root.innerHTML = `
      <div class="campaign-studio-wrapper">

        <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
          <div class="mhos-campaign-command-main mhos-context-main">
            <div class="mhos-campaign-kicker-row mhos-context-kicker">
              <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
              <span class="mhos-campaign-state mhos-campaign-state--${readinessTone}">${escapeHtml(executionReadiness.status)}</span>
            </div>
            <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
            <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
            <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
              <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
              <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
              <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
              <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
            </div>
          </div>

          <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
            <span class="mhos-campaign-panel-label">Strategist next move</span>
            <strong class="mhos-campaign-panel-action mhos-executive-guidance">${escapeHtml(strategistNextAction)}</strong>
            <p class="mhos-campaign-panel-copy mhos-executive-guidance">${escapeHtml(strategistMode)}</p>
          </aside>

          <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
            <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
            <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
            <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
          </div>

          <div class="mhos-campaign-operating-summary mhos-executive-summary-grid" aria-label="Campaign operating summary">
            <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${readinessTone} mhos-executive-summary-item">
              <span class="mhos-campaign-metric-label mhos-executive-metric-label">Readiness</span>
              <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(executionReadiness.status)}</strong>
              <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? `${executionReadiness.total} open gate${executionReadiness.total === 1 ? "" : "s"}` : "Launch gates clear")}</small>
            </article>
            <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${intelligenceTone} mhos-executive-summary-item">
              <span class="mhos-campaign-metric-label mhos-executive-metric-label">Intelligence</span>
              <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(intelligenceLabel)}</strong>
              <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(intelligenceError || (hasLiveIntelligence ? "Signals active" : "Projection mode"))}</small>
            </article>
            <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${blockerTone} mhos-executive-summary-item">
              <span class="mhos-campaign-metric-label mhos-executive-metric-label">Blockers</span>
              <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(String(executionReadiness.total))}</strong>
              <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? "Needs operator attention" : "No open launch blockers")}</small>
            </article>
            <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${channelTone} mhos-executive-summary-item">
              <span class="mhos-campaign-metric-label mhos-executive-metric-label">Channels</span>
              <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(channelStateLabel)}</strong>
              <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(recommendedChannelCount ? `${recommendedChannelCount} AI recommendations` : "Awaiting channel mix")}</small>
            </article>
          </div>
        </section>

        <div class="campaign-studio-layout">
          <form id="campaignStudioForm" class="campaign-studio-main">
            <section class="card">
              <div class="card-head">
                <h3>Campaign Basics</h3>
                <span class="card-badge neutral">Define</span>
              </div>
              <div class="campaign-section-copy">
                Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
              </div>
              <div class="setup-form-grid setup-form-grid-2">
                ${renderField({
                  name: "campaignName",
                  label: "Campaign name",
                  value: values.campaignName,
                  helper: "Use the shared name operators, AI, execution packages, and reporting should all reference.",
                  placeholder: "Spring launch wave 1",
                  escapeHtml
                })}
                ${renderField({
                  name: "campaignGoal",
                  label: "Campaign goal",
                  value: values.campaignGoal,
                  helper: "Lead with the business outcome: launch, revenue, retention, awareness, or activation.",
                  placeholder: "Launch, sales growth, lead generation...",
                  escapeHtml
                })}
                ${renderField({
                  name: "campaignType",
                  label: "Campaign type",
                  value: values.campaignType,
                  helper: "Use the operational framing the team should align around across planning and execution.",
                  placeholder: "Product launch, seasonal push, retention sprint...",
                  escapeHtml
                })}
                ${renderField({
                  name: "market",
                  label: "Market",
                  value: values.market,
                  helper: "Primary market or region this campaign is optimized for.",
                  placeholder: "Germany",
                  escapeHtml
                })}
              </div>
              <div class="setup-form-grid setup-form-grid-3">
                ${renderField({
                  name: "startDate",
                  label: "Start date",
                  value: values.startDate,
                  helper: "When should the campaign start going live?",
                  placeholder: "2026-05-01",
                  escapeHtml
                })}
                ${renderField({
                  name: "endDate",
                  label: "End date",
                  value: values.endDate,
                  helper: "Optional hard stop or review date.",
                  placeholder: "2026-05-21",
                  escapeHtml
                })}
                ${renderField({
                  name: "budget",
                  label: "Budget",
                  value: values.budget,
                  helper: "Use one working budget number even if later split by channel.",
                  placeholder: "5000",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Product / Audience / Channel Selection</h3>
                <span class="card-badge neutral">Plan inputs</span>
              </div>
              <div class="campaign-section-copy">
                Keep product, audience, offer, and channel choices explicit so downstream teams do not have to reinterpret the plan.
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "productFocus",
                  label: "Product focus",
                  value: values.productFocus,
                  helper: "What product, bundle, or offer family should this campaign push first?",
                  placeholder: "Primary hero product",
                  escapeHtml
                })}
                ${renderField({
                  name: "productAngle",
                  label: "Product angle",
                  value: values.productAngle,
                  helper: "Capture the benefit, problem-solution, or proof angle the campaign should repeat.",
                  placeholder: "Why this product matters now",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "audiencePrimary",
                  label: "Primary audience",
                  value: values.audiencePrimary,
                  helper: "Define the segment the creative, offer, and distribution should be built around first.",
                  placeholder: "Who is this campaign for?",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "audienceNeed",
                  label: "Audience need / pain point",
                  value: values.audienceNeed,
                  helper: "The core need the campaign should speak to directly.",
                  placeholder: "What problem are we solving?",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "channelPlan",
                  label: "Channel plan",
                  value: values.channelPlan,
                  helper: "List the first channels this campaign should activate. The recommendation panel below can help tighten the mix.",
                  placeholder: "instagram, facebook, email",
                  escapeHtml
                })}
                ${renderField({
                  name: "offerHeadline",
                  label: "Offer headline",
                  value: values.offerHeadline,
                  helper: "The commercial promise the audience should understand immediately.",
                  placeholder: "Premium grooming with stronger routine results",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "offerDetail",
                  label: "Offer detail",
                  value: values.offerDetail,
                  helper: "Discount logic, bundle logic, urgency, positioning, or proof points.",
                  placeholder: "What makes the offer persuasive?",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "audienceStage",
                  label: "Audience stage",
                  value: values.audienceStage,
                  helper: "Cold prospect, warm prospect, repeat buyer, or retention audience.",
                  placeholder: "Warm prospect",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Wave Planning</h3>
                <span class="card-badge neutral">${escapeHtml(String(waves.length))} waves</span>
              </div>
              <div class="campaign-section-copy">
                Plan each wave separately so launch, education, and conversion work stay clear before routing into execution workspaces.
              </div>
              <div class="campaign-wave-grid">
                ${waves.map((wave) => `
                  <div class="campaign-wave-card">
                    <div class="campaign-wave-head">
                      <h4>${escapeHtml(wave.label)}</h4>
                      <span class="card-badge ${wave.status === "Ready" ? "success" : wave.status === "Needs inputs" ? "warning" : "danger"}">${escapeHtml(wave.status)}</span>
                    </div>
                    <div class="campaign-wave-meta">
                      <div class="campaign-wave-meta-item">
                        <span>Status</span>
                        <strong>${escapeHtml(wave.status)}</strong>
                      </div>
                      <div class="campaign-wave-meta-item">
                        <span>Suggested role</span>
                        <strong>${escapeHtml(wave.suggestedRole)}</strong>
                      </div>
                      <div class="campaign-wave-meta-item">
                        <span>Channel allocation</span>
                        <strong>${escapeHtml(wave.allocationSuggestion)}</strong>
                      </div>
                      <div class="campaign-wave-meta-item">
                        <span>Supporting assets</span>
                        <strong>${escapeHtml(wave.supportingAssetSuggestion)}</strong>
                      </div>
                    </div>
                    ${
                      wave.missingInputs.length
                        ? `<div class="campaign-wave-callout">Missing inputs: ${escapeHtml(wave.missingInputs.join(", "))}</div>`
                        : `<div class="campaign-wave-callout is-ready">${escapeHtml(wave.roleHint)}</div>`
                    }
                    <div class="setup-form-grid">
                      ${renderField({
                        name: `${wave.key}Name`,
                        label: "Wave name",
                        value: values[`${wave.key}Name`],
                        helper: "Use the name operators and downstream packages should recognize.",
                        placeholder: wave.index === 1 ? "Launch wave" : wave.index === 2 ? "Education wave" : "Conversion wave",
                        escapeHtml
                      })}
                      ${renderField({
                        name: `${wave.key}Focus`,
                        label: "Wave focus",
                        value: values[`${wave.key}Focus`],
                        helper: "Clarify what this wave is responsible for operationally.",
                        placeholder: wave.index === 1 ? "Awareness, announcement, validation..." : wave.index === 2 ? "Proof, education, comparison..." : "Offer push, urgency, retargeting...",
                        escapeHtml,
                        multiline: true
                      })}
                      ${renderField({
                        name: `${wave.key}Channels`,
                        label: "Wave channels",
                        value: values[`${wave.key}Channels`],
                        helper: "List the channels this wave should activate or test.",
                        placeholder: wave.allocationSuggestion,
                        escapeHtml
                      })}
                    </div>
                  </div>
                `).join("")}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Campaign Outputs / Readiness</h3>
                <span class="card-badge ${executionReadiness.total ? "warning" : "success"}">${escapeHtml(executionReadiness.status)}</span>
              </div>
              <div class="campaign-section-copy">
                Review the recommended campaign direction, required assets, and real blockers before sending the plan into downstream work.
              </div>
              ${
                intelligenceError
                  ? `<div class="empty-box">${escapeHtml(`Intelligence refresh warning: ${intelligenceError}`)}</div>`
                  : ""
              }
              <div class="campaign-strategy-stack">
                <div class="campaign-strategy-item">
                  <span>Recommended campaign angle</span>
                  <strong>${escapeHtml(strategyGuidance.angle)}</strong>
                </div>
                <div class="campaign-strategy-item">
                  <span>Recommended offer focus</span>
                  <strong>${escapeHtml(strategyGuidance.offer)}</strong>
                </div>
                <div class="campaign-strategy-item">
                  <span>Recommended audience emphasis</span>
                  <strong>${escapeHtml(strategyGuidance.audience)}</strong>
                </div>
                <div class="campaign-strategy-item">
                  <span>Recommended channel emphasis</span>
                  <strong>${escapeHtml(strategyGuidance.channels)}</strong>
                </div>
                <div class="campaign-strategy-item">
                  <span>Recommended next action</span>
                  <strong>${escapeHtml(strategyGuidance.nextAction)}</strong>
                </div>
              </div>
              <div class="campaign-recommendation-grid">
                <div class="campaign-studio-panel-block">
                  <h4 class="insights-subtitle">Recommended organic channels</h4>
                  ${renderChannelRecommendationCards(channelMix.organic, escapeHtml)}
                </div>
                <div class="campaign-studio-panel-block">
                  <h4 class="insights-subtitle">Recommended paid channels</h4>
                  ${renderChannelRecommendationCards(channelMix.paid, escapeHtml)}
                </div>
                <div class="campaign-studio-panel-block">
                  <h4 class="insights-subtitle">Recommended support channels</h4>
                  ${renderChannelRecommendationCards(channelMix.support, escapeHtml)}
                </div>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "assetChecklist",
                  label: "Asset checklist",
                  value: values.assetChecklist,
                  helper: "Define what must exist before the campaign can execute smoothly across channels and waves.",
                  placeholder: "logo, product images, pricing doc, offer banner...",
                  escapeHtml,
                  multiline: true
                })}
                ${renderField({
                  name: "executionNotes",
                  label: "Execution notes",
                  value: values.executionNotes,
                  helper: "Capture dependencies, packaging notes, approval guidance, or production instructions for the next operator.",
                  placeholder: "Anything the execution team must know",
                  escapeHtml,
                  multiline: true
                })}
              </div>
              <div class="campaign-studio-panel-block">
                <h4 class="insights-subtitle">Library inputs for campaign planning</h4>
                ${renderAssetDependencyRows(state.data.assets, campaignAssetKeys, escapeHtml, "Product, pricing, and campaign assets are covered.")}
                <div class="simple-banner" style="margin-top: 12px;">${escapeHtml(assetNextAction)}</div>
              </div>
              <div class="campaign-readiness-grid">
                ${renderBlockerGroup(
                  "Missing assets",
                  executionReadiness.missingAssets.map((item) => titleCase(item)),
                  escapeHtml,
                  "Required assets currently look covered."
                )}
                ${renderBlockerGroup(
                  "Missing integrations",
                  executionReadiness.missingIntegrations.map((item) => `${item.title}: ${item.body}`),
                  escapeHtml,
                  "Required integrations currently look healthy."
                )}
                ${renderBlockerGroup(
                  "Publishing blockers",
                  executionReadiness.publishingBlockers,
                  escapeHtml,
                  "No publishing blocker is currently stopping launch routing."
                )}
                ${renderBlockerGroup(
                  "Ads blockers",
                  executionReadiness.adsBlockers,
                  escapeHtml,
                  "Paid routing looks workable at the current plan level."
                )}
                ${renderBlockerGroup(
                  "Tracking blockers",
                  executionReadiness.trackingBlockers,
                  escapeHtml,
                  "Tracking coverage looks sufficient for the current routing scope."
                )}
                ${renderBlockerGroup(
                  "SEO blockers",
                  executionReadiness.seoBlockers,
                  escapeHtml,
                  "SEO support is not currently blocked."
                )}
                ${renderBlockerGroup(
                  "Approval blockers",
                  executionReadiness.approvalBlockers,
                  escapeHtml,
                  "Approval inputs look complete enough for review."
                )}
              </div>
            </section>
          </form>

          <aside class="campaign-studio-side">
            <section class="card">
              <div class="card-head">
                <h3>Campaign AI Assistant</h3>
                <span class="card-badge ${hasLiveIntelligence ? "success" : "neutral"}">${escapeHtml(hasLiveIntelligence ? "Intelligence-assisted" : "Draft-assisted")}</span>
              </div>
              <div class="campaign-section-copy">
                Send campaign context to AI prefills the current campaign draft and then navigates there. The downstream send actions open the linked workspace with the current campaign context attached.
              </div>
              <div class="data-stack">
                ${renderSummaryItem("Campaign", values.campaignName, escapeHtml)}
                ${renderSummaryItem("Goal", values.campaignGoal, escapeHtml)}
                ${renderSummaryItem("Primary product", values.productFocus, escapeHtml)}
                ${renderSummaryItem("Audience", values.audiencePrimary, escapeHtml)}
                ${renderSummaryItem("Channels", values.channelPlan, escapeHtml)}
                ${renderSummaryItem("Budget", formatCurrency(values.budget, overviewData.currency || "USD"), escapeHtml)}
              </div>
              <div class="quick-actions">
                <button id="campaignAskAiBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send campaign context to AI</span>
                  <span class="home-action-meta">Prefill AI Command with the current draft, blockers, and campaign context, then open that page.</span>
                </button>
              </div>
              <div class="campaign-routing-grid">
                <button id="campaignOpenContentStudioBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to Content Studio</span>
                  <span class="home-action-meta">Open Content Studio with a campaign handoff attached.</span>
                </button>
                <button id="campaignOpenMediaStudioBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to Media Studio</span>
                  <span class="home-action-meta">Open Media Studio with a campaign handoff attached.</span>
                </button>
                <button id="campaignOpenPublishingBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to Publishing</span>
                  <span class="home-action-meta">Open Publishing with a campaign handoff attached.</span>
                </button>
                <button id="campaignOpenAdsManagerBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to Ads Manager</span>
                  <span class="home-action-meta">Open Ads Manager with a campaign handoff attached.</span>
                </button>
                <button id="campaignReviewDependenciesBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Review campaign dependencies</span>
                  <span class="home-action-meta">Jump to the highest-priority place to close launch blockers.</span>
                </button>
                <button id="campaignReviewAssetsBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Review campaign assets in Library</span>
                  <span class="home-action-meta">Navigation only. Review missing assets before execution starts.</span>
                </button>
              </div>
              <div class="campaign-helper-note">${escapeHtml(hasLiveIntelligence ? "Live intelligence is shaping the readiness and channel recommendations on this page." : "This page is still usable without full intelligence; recommendations are falling back to current draft and readiness inputs.")}</div>
            </section>
          </aside>
        </div>
      </div>
    `;

    bindCampaignStudio({
      $,
      getState,
      navigateTo,
      showMessage,
      showError,
      fetchProjectInsights,
      fetchProjectLearning,
      saveProjectCampaign,
      createProjectHandoff,
      render: rerender
    });
  }
};
