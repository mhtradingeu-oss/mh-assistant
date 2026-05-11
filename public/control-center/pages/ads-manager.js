const adsManagerSessions = new Map();

const PLATFORM_DEFS = [
  {
    id: "meta",
    label: "Meta Ads",
    primarySources: ["facebook", "instagram"],
    supportSources: ["website", "ecommerce", "analytics"],
    allocationShare: 0.4
  },
  {
    id: "google",
    label: "Google Ads",
    primarySources: ["google_ads", "google", "website"],
    supportSources: ["analytics", "ecommerce", "youtube"],
    allocationShare: 0.3
  },
  {
    id: "tiktok",
    label: "TikTok Ads",
    primarySources: ["tiktok"],
    supportSources: ["website", "analytics"],
    allocationShare: 0.15
  },
  {
    id: "amazon",
    label: "Amazon Ads",
    primarySources: ["amazon"],
    supportSources: ["analytics", "ecommerce"],
    allocationShare: 0.15
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

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
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

function formatRatio(value, digits = 2) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return parsed.toFixed(digits);
}

function getBudgetDefaults(state) {
  const overview = asObject(state.data.overview?.overview);
  const projectType = asString(overview.project_type).toLowerCase();
  const totalBudget = projectType === "ecommerce" ? 8000 : 4000;
  const dailyBudget = Math.round(totalBudget / 30);

  return {
    totalBudget: String(totalBudget),
    dailyBudget: String(dailyBudget),
    spendToDate: "",
    ctr: "",
    cpc: "",
    cpa: "",
    roas: ""
  };
}

function ensureSession(projectName, state) {
  const key = projectName || "__default__";
  if (!adsManagerSessions.has(key)) {
    adsManagerSessions.set(key, {
      values: getBudgetDefaults(state)
    });
  }
  return adsManagerSessions.get(key);
}

function getSourceValue(sources, keys) {
  for (const key of keys) {
    const source = asObject(sources[key]);
    const value = asString(source.value).trim();
    if (value) return value;
  }
  return "";
}

function buildPlatformCards(state, budgetTotal) {
  const integrations = asObject(state.data.integrations);
  const sources = asObject(integrations.sources?.sources);
  const checks = asObject(integrations.readiness?.checks);
  const assets = asObject(state.data.assets);
  const activity = asObject(state.data.activity);
  const assetTypes = new Set(asArray(assets.assets).map((item) => asString(item.asset_type).trim().toLowerCase()).filter(Boolean));
  const scheduledJobs = asArray(activity.scheduled_jobs);

  return PLATFORM_DEFS.map((platform) => {
    const primaryConnected = platform.primarySources.filter((key) => Boolean(checks[key] || asObject(sources[key]).value));
    const supportConnected = platform.supportSources.filter((key) => Boolean(checks[key] || asObject(sources[key]).value));
    const activeWaves = scheduledJobs
      .filter((item) => platform.primarySources.includes(asString(item.channel).trim().toLowerCase()))
      .map((item) => asString(item.wave_name).trim())
      .filter(Boolean);

    let status = "Blocked";
    if (primaryConnected.length) {
      status = supportConnected.length >= 2 ? "Operational" : "Partial";
    } else if (supportConnected.length) {
      status = "Planning";
    }

    const missing = [
      ...platform.primarySources.filter((key) => !checks[key] && !asObject(sources[key]).value),
      ...platform.supportSources.filter((key) => !checks[key] && !asObject(sources[key]).value)
    ];

    const coverage = [
      assetTypes.has("product_image") ? "Static creative" : "",
      assetTypes.has("product_video") ? "Video creative" : "",
      assetTypes.has("logo") ? "Brand identity" : "",
      activeWaves.length ? "Launch wave mapped" : ""
    ].filter(Boolean);

    return {
      ...platform,
      status,
      connectionValue: getSourceValue(sources, [...platform.primarySources, ...platform.supportSources]) || "No platform connection saved",
      readinessScore: Math.round(((primaryConnected.length * 2) + supportConnected.length) / ((platform.primarySources.length * 2) + platform.supportSources.length) * 100),
      missing,
      activeWaves,
      creativeCoverage: coverage,
      recommendedBudget: budgetTotal * platform.allocationShare
    };
  });
}

function buildCreativeMappings(platformCards, state) {
  const assets = asObject(state.data.assets);
  const activity = asObject(state.data.activity);
  const assetTypes = new Set(asArray(assets.assets).map((item) => asString(item.asset_type).trim().toLowerCase()).filter(Boolean));
  const scheduledJobs = asArray(activity.scheduled_jobs);

  return platformCards.map((platform) => {
    const relevantJobs = scheduledJobs.filter((item) => platform.primarySources.includes(asString(item.channel).trim().toLowerCase()));
    let coverageStatus = "Missing";

    if (assetTypes.has("product_video") && assetTypes.has("product_image")) {
      coverageStatus = "Ready";
    } else if (assetTypes.has("product_image") || assetTypes.has("product_video")) {
      coverageStatus = "Partial";
    }

    const nextNeed = platform.id === "tiktok" || platform.id === "google"
      ? (assetTypes.has("product_video") ? "Refresh hooks and landing copy" : "Add video creative")
      : (assetTypes.has("product_image") ? "Build conversion variants" : "Add static creative set");

    return {
      platform: platform.label,
      status: coverageStatus,
      mappedWave: relevantJobs[0]?.wave_name || state.context.activeCampaign || "No active wave mapped",
      creativeSet: platform.creativeCoverage.length ? platform.creativeCoverage.join(", ") : "No dedicated creative package yet",
      nextNeed
    };
  });
}

function buildActionPrompts({ projectName, platformCards, spendValue, metrics }) {
  const weakPlatforms = platformCards.filter((item) => item.status !== "Operational").map((item) => item.label);
  const strongPlatforms = platformCards.filter((item) => item.status === "Operational").map((item) => item.label);

  return [
    {
      label: "Scale winners",
      prompt: `Review the paid media setup for ${projectName || "this project"}. Use current strong platforms (${strongPlatforms.join(", ") || "none identified"}) and recommend which campaigns to scale, what budget to move, and which creatives to duplicate.`
    },
    {
      label: "Pause weak spend",
      prompt: `For ${projectName || "this project"}, identify which ad platforms or campaign groups should be paused first based on weak readiness (${weakPlatforms.join(", ") || "none listed"}), missing measurement, and creative risk.`
    },
    {
      label: "Fix pacing",
      prompt: `Build a pacing recovery plan for ${projectName || "this project"} using spend to date ${spendValue || "not entered"}, CTR ${metrics.ctr || "not entered"}, CPC ${metrics.cpc || "not entered"}, CPA ${metrics.cpa || "not entered"}, and ROAS ${metrics.roas || "not entered"}.`
    },
    {
      label: "Creative refresh",
      prompt: `Create an ad creative refresh brief for ${projectName || "this project"} based on current asset coverage and platform mix. Prioritize the next creatives needed for Meta, Google, TikTok, and Amazon.`
    }
  ];
}

function renderBudgetField({ id, name, label, value, helper, placeholder, escapeHtml }) {
  return `
    <div class="setup-field-group">
      <div class="setup-field-head">
        <label class="setup-label" for="${escapeHtml(id)}">${escapeHtml(label)}</label>
        <span class="setup-field-state is-optional">Working value</span>
      </div>
      <input id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder || "")}">
      <div class="setup-helper">${escapeHtml(helper)}</div>
    </div>
  `;
}

function bindAdsManager({
  $,
  getState,
  navigateTo,
  showMessage,
  render,
  promptItems
}) {
  const state = getState();
  const projectName = state.context.currentProject || "";
  const session = ensureSession(projectName, state);

  const form = $("adsManagerBudgetForm");
  if (form) {
    form.oninput = (event) => {
      const target = event.target;
      if (!target?.name) return;
      session.values[target.name] = target.value || "";
      render();
    };
  }

  const aiButtons = Array.from(document.querySelectorAll("[data-ads-prompt]"));
  aiButtons.forEach((button) => {
    button.onclick = () => {
      const index = Number(button.getAttribute("data-ads-prompt"));
      const item = promptItems[index];
      if (!item) return;

      const input = $("quickCommandInput");
      if (input) {
        input.value = item.prompt;
      }
      navigateTo("ai-command");
      showMessage?.("Paid media prompt added to AI Command.");
    };
  });

  const publishingBtn = $("adsManagerOpenPublishingBtn");
  if (publishingBtn) {
    publishingBtn.onclick = () => navigateTo("publishing");
  }

  const libraryBtn = $("adsManagerOpenLibraryBtn");
  if (libraryBtn) {
    libraryBtn.onclick = () => navigateTo("library");
  }
}

export const adsManagerRoute = {
  id: "ads-manager",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Execute & Grow",
    title: "Ads Manager",
    description: "Plan budgets, assess pacing, review platform readiness, and manage paid media decisions from one ad-ops workspace."
  },
  template: `
    <section class="page is-active" data-page="ads-manager">
      <div id="adsManagerRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const overview = asObject(state.data.overview?.overview);
    const session = ensureSession(projectName, state);
    const values = session.values;
    const currency = overview.currency || "USD";
    const totalBudget = toNumber(values.totalBudget, 0);
    const dailyBudget = toNumber(values.dailyBudget, 0);
    const spendToDate = asString(values.spendToDate).trim() === "" ? null : toNumber(values.spendToDate, 0);
    const platformCards = buildPlatformCards(state, totalBudget);
    const creativeMappings = buildCreativeMappings(platformCards, state);
    const connectedPlatforms = platformCards.filter((item) => item.status !== "Blocked").length;
    const operationalPlatforms = platformCards.filter((item) => item.status === "Operational").length;
    const monthProgress = Math.min(1, new Date().getUTCDate() / 30);
    const plannedSpendToDate = totalBudget ? totalBudget * monthProgress : 0;
    const pacingDelta = spendToDate == null ? null : spendToDate - plannedSpendToDate;
    const pacingStatus = spendToDate == null
      ? "Awaiting spend feed"
      : Math.abs(pacingDelta) <= Math.max(50, totalBudget * 0.05)
        ? "On pace"
        : pacingDelta > 0
          ? "Overspending"
          : "Underspending";
    const promptItems = buildActionPrompts({
      projectName,
      platformCards,
      spendValue: values.spendToDate,
      metrics: {
        ctr: values.ctr,
        cpc: values.cpc,
        cpa: values.cpa,
        roas: values.roas
      }
    });
    const root = $("adsManagerRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="ads-manager-wrapper">
        <div class="ads-manager-hero">
          <div class="ads-manager-hero-copy">
            <div class="setup-kicker">Paid Media Operations</div>
            <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Ads Manager` : "Ads Manager")}</h3>
            <p class="setup-hero-text">
              Use this workspace to set the working budget, check pacing, understand channel readiness, map creatives to platforms, and decide what to scale or pause next.
            </p>
            <div class="ads-manager-status">
              <div class="setup-status-chip">
                <span>Platforms in plan</span>
                <strong>${escapeHtml(String(connectedPlatforms))}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Operational</span>
                <strong>${escapeHtml(String(operationalPlatforms))}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Budget</span>
                <strong>${escapeHtml(totalBudget ? formatCurrency(totalBudget, currency) : "Not set")}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Pacing</span>
                <strong>${escapeHtml(pacingStatus)}</strong>
              </div>
            </div>
          </div>

          <div class="setup-hero-actions">
            <button id="adsManagerOpenLibraryBtn" class="btn btn-secondary" type="button">Review Creatives</button>
            <button id="adsManagerOpenPublishingBtn" class="btn btn-primary" type="button">Open Publishing</button>
          </div>
        </div>

        <div class="ads-manager-layout">
          <div class="ads-manager-main">
            <section class="card">
              <div class="card-head">
                <h3>Budget Overview</h3>
                <span class="card-badge neutral">Section 1</span>
              </div>
              <form id="adsManagerBudgetForm" class="setup-form-grid setup-form-grid-2">
                ${renderBudgetField({
                  id: "adsTotalBudgetInput",
                  name: "totalBudget",
                  label: "Total budget",
                  value: values.totalBudget,
                  helper: "Use one working number for the current paid media plan, even if later split by platform.",
                  placeholder: "8000",
                  escapeHtml
                })}
                ${renderBudgetField({
                  id: "adsDailyBudgetInput",
                  name: "dailyBudget",
                  label: "Daily budget",
                  value: values.dailyBudget,
                  helper: "This is the daily cap the team should use while operating campaigns.",
                  placeholder: "260",
                  escapeHtml
                })}
                ${renderBudgetField({
                  id: "adsSpendInput",
                  name: "spendToDate",
                  label: "Spend to date",
                  value: values.spendToDate,
                  helper: "Enter live spend when available. Leave blank if no ad platform feed is connected yet.",
                  placeholder: "1900",
                  escapeHtml
                })}
                <div class="ads-budget-summary">
                  <div class="data-card">
                    <span class="data-label">Remaining</span>
                    <strong>${escapeHtml(totalBudget && spendToDate != null ? formatCurrency(Math.max(totalBudget - spendToDate, 0), currency) : "-")}</strong>
                  </div>
                  <div class="data-card">
                    <span class="data-label">Planned to date</span>
                    <strong>${escapeHtml(totalBudget ? formatCurrency(plannedSpendToDate, currency) : "-")}</strong>
                  </div>
                  <div class="data-card">
                    <span class="data-label">Current market</span>
                    <strong>${escapeHtml(safeText(state.context.currentMarket, overview.market || "Not set"))}</strong>
                  </div>
                  <div class="data-card">
                    <span class="data-label">Project type</span>
                    <strong>${escapeHtml(safeText(overview.project_type, "Not set"))}</strong>
                  </div>
                </div>
              </form>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Spend and Pacing</h3>
                <span class="card-badge ${pacingStatus === "On pace" ? "success" : pacingStatus === "Awaiting spend feed" ? "neutral" : "warning"}">${escapeHtml(pacingStatus)}</span>
              </div>
              <div class="ads-pacing-grid">
                <div class="data-card">
                  <span class="data-label">Daily cap</span>
                  <strong>${escapeHtml(dailyBudget ? formatCurrency(dailyBudget, currency) : "-")}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Spend to date</span>
                  <strong>${escapeHtml(spendToDate == null ? "-" : formatCurrency(spendToDate, currency))}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Planned pace</span>
                  <strong>${escapeHtml(totalBudget ? formatCurrency(plannedSpendToDate, currency) : "-")}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Variance</span>
                  <strong>${escapeHtml(spendToDate == null ? "-" : formatCurrency(Math.abs(pacingDelta), currency))}</strong>
                </div>
              </div>
              <div class="ads-helper-copy">
                ${
                  spendToDate == null
                    ? escapeHtml("No live spend feed is connected yet. This section becomes operational as soon as the team enters working spend or a future ad platform connector provides live numbers.")
                    : escapeHtml(`The current plan is ${pacingStatus.toLowerCase()}. Use this to decide whether to accelerate spend, slow pacing, or reallocate budget across platforms.`)
                }
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Platform Performance</h3>
                <span class="card-badge neutral">${escapeHtml(`${platformCards.length} platforms`)}</span>
              </div>
              <div class="ads-platform-grid">
                ${platformCards.map((platform) => `
                  <div class="ads-platform-card">
                    <div class="ads-platform-head">
                      <div>
                        <h4>${escapeHtml(platform.label)}</h4>
                        <p>${escapeHtml(platform.connectionValue)}</p>
                      </div>
                      <span class="card-badge ${platform.status === "Operational" ? "success" : platform.status === "Blocked" ? "danger" : "warning"}">${escapeHtml(platform.status)}</span>
                    </div>
                    <div class="data-stack">
                      <div class="data-row"><span>Readiness</span><strong>${escapeHtml(formatPercent(platform.readinessScore))}</strong></div>
                      <div class="data-row"><span>Recommended budget</span><strong>${escapeHtml(totalBudget ? formatCurrency(platform.recommendedBudget, currency) : "-")}</strong></div>
                      <div class="data-row"><span>Wave mapping</span><strong>${escapeHtml(platform.activeWaves[0] || "No active wave")}</strong></div>
                    </div>
                    <div class="ads-platform-note">
                      ${escapeHtml(platform.missing.length ? `Missing: ${platform.missing.map(titleCase).join(", ")}` : "No immediate setup blockers in the current plan.")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Creative Mapping</h3>
                <span class="card-badge neutral">Section 5</span>
              </div>
              <div class="ads-creative-list">
                ${creativeMappings.map((item) => `
                  <div class="ads-creative-item">
                    <div class="ads-creative-head">
                      <div>
                        <strong>${escapeHtml(item.platform)}</strong>
                        <span>${escapeHtml(item.mappedWave)}</span>
                      </div>
                      <span class="card-badge ${item.status === "Ready" ? "success" : item.status === "Partial" ? "warning" : "danger"}">${escapeHtml(item.status)}</span>
                    </div>
                    <div class="ads-creative-copy">${escapeHtml(item.creativeSet)}</div>
                    <div class="ads-creative-next">${escapeHtml(`Next: ${item.nextNeed}`)}</div>
                  </div>
                `).join("")}
              </div>
            </section>
          </div>

          <aside class="ads-manager-side">
            <section class="card">
              <div class="card-head">
                <h3>Core Metrics</h3>
                <span class="card-badge neutral">Section 4</span>
              </div>
              <div class="setup-form-grid">
                ${renderBudgetField({
                  id: "adsCtrInput",
                  name: "ctr",
                  label: "CTR",
                  value: values.ctr,
                  helper: "Click-through rate from the live platform dashboard, if available.",
                  placeholder: "2.4",
                  escapeHtml
                })}
                ${renderBudgetField({
                  id: "adsCpcInput",
                  name: "cpc",
                  label: "CPC",
                  value: values.cpc,
                  helper: "Average cost per click in your working currency.",
                  placeholder: "0.75",
                  escapeHtml
                })}
                ${renderBudgetField({
                  id: "adsCpaInput",
                  name: "cpa",
                  label: "CPA",
                  value: values.cpa,
                  helper: "Average acquisition cost for the current campaign window.",
                  placeholder: "18.00",
                  escapeHtml
                })}
                ${renderBudgetField({
                  id: "adsRoasInput",
                  name: "roas",
                  label: "ROAS",
                  value: values.roas,
                  helper: "Return on ad spend as a simple multiple.",
                  placeholder: "2.8",
                  escapeHtml
                })}
              </div>
              <div class="ads-metric-grid">
                <div class="data-card">
                  <span class="data-label">CTR</span>
                  <strong>${escapeHtml(values.ctr ? formatPercent(values.ctr, 1) : "-")}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">CPC</span>
                  <strong>${escapeHtml(values.cpc ? formatCurrency(values.cpc, currency) : "-")}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">CPA</span>
                  <strong>${escapeHtml(values.cpa ? formatCurrency(values.cpa, currency) : "-")}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">ROAS</span>
                  <strong>${escapeHtml(values.roas ? `${formatRatio(values.roas)}x` : "-")}</strong>
                </div>
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Action Prompts</h3>
                <span class="card-badge neutral">Section 6</span>
              </div>
              <div class="ads-prompt-list">
                ${promptItems.map((item, index) => `
                  <button class="quick-action-btn" type="button" data-ads-prompt="${index}">
                    <span class="home-action-title">${escapeHtml(item.label)}</span>
                    <span class="home-action-meta">${escapeHtml(item.prompt)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </aside>
        </div>
      </div>
    `;

    bindAdsManager({
      $,
      getState,
      navigateTo,
      showMessage,
      render: () => adsManagerRoute.render({
        getState,
        $,
        escapeHtml,
        safeText,
        navigateTo,
        showMessage
      }),
      promptItems
    });
  }
};
