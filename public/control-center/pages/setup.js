const REQUIRED_FIELDS = [
  { name: "project_name", label: "Project name" },
  { name: "project_type", label: "Project type" },
  { name: "website_url", label: "Website URL" },
  { name: "brand_promise", label: "Brand promise" },
  { name: "market", label: "Market" },
  { name: "language", label: "Language" },
  { name: "currency", label: "Currency" },
  { name: "primary_goal", label: "Primary goal" },
  { name: "audience_primary", label: "Primary audience" },
  { name: "competitors", label: "Competitors" }
];

const SECTION_FIELDS = {
  basics: ["project_name", "project_type", "website_url", "project_status", "execution_mode"],
  brand: ["brand_name", "brand_promise", "brand_voice", "visual_identity", "offer_positioning"],
  locale: ["market", "language", "currency"],
  goals: ["primary_goal", "secondary_goal", "launch_window"],
  audience: ["audience_primary", "audience_problem", "audience_geography"],
  competitors: ["competitors", "differentiation"],
  readiness: ["operator_notes"]
};

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

function toListText(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return asString(value);
}

function formatPercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0%";
  return `${Math.max(0, Math.round(parsed))}%`;
}

function getSetupDraftKey(projectName) {
  return `mh-control-center:setup-draft:${projectName || "default"}`;
}

function loadSetupDraft(projectName) {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getSetupDraftKey(projectName));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_) {
    return null;
  }
}

function saveSetupDraft(projectName, data) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));
    return true;
  } catch (_) {
    return false;
  }
}

function clearSetupDraft(projectName) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.removeItem(getSetupDraftKey(projectName));
    return true;
  } catch (_) {
    return false;
  }
}

function buildSetupValues(state) {
  const overviewData = asObject(state.data.overview?.overview);
  const readinessDashboard = asObject(state.data.readiness?.dashboard);
  const context = asObject(state.context);

  const projectName = context.currentProject || overviewData.project_name || "";

  return {
    project_name: projectName,
    project_type: overviewData.project_type || "",
    website_url: overviewData.website_url || "",
    project_status: overviewData.status || "",
    execution_mode: context.executionMode || overviewData.execution_mode || "",

    brand_name: overviewData.brand_name || projectName,
    brand_promise:
      overviewData.brand_promise ||
      overviewData.brand_positioning ||
      overviewData.value_prop ||
      "",
    brand_voice: overviewData.brand_voice || "",
    visual_identity: overviewData.visual_identity || "",
    offer_positioning: overviewData.offer_positioning || overviewData.positioning || "",

    market: context.currentMarket || overviewData.market || "",
    language: context.currentLanguage || overviewData.language || "",
    currency: overviewData.currency || "",

    primary_goal: overviewData.primary_goal || overviewData.goal || "",
    secondary_goal: overviewData.secondary_goal || "",
    launch_window: overviewData.launch_window || context.activeCampaign || "",

    audience_primary: overviewData.audience_primary || overviewData.target_audience || "",
    audience_problem: overviewData.audience_problem || overviewData.customer_problem || "",
    audience_geography: overviewData.audience_geography || context.currentMarket || "",

    competitors: toListText(overviewData.competitors),
    differentiation: overviewData.differentiation || "",

    operator_notes: toListText(readinessDashboard.operator_notes)
  };
}

function getMissingRequiredFields(values) {
  return REQUIRED_FIELDS.filter((field) => !asString(values[field.name]).trim());
}

function getCompletionPercent(values) {
  const missing = getMissingRequiredFields(values).length;
  const total = REQUIRED_FIELDS.length || 1;
  return Math.round(((total - missing) / total) * 100);
}

function getSectionStatus(sectionName, values, extras = {}) {
  if (sectionName === "readiness") {
    const score = Number(extras.readinessScore);
    if (Number.isFinite(score)) {
      if (score >= 80) return { tone: "success", label: `${Math.round(score)}% ready` };
      if (score >= 50) return { tone: "warning", label: `${Math.round(score)}% in progress` };
      return { tone: "danger", label: `${Math.round(score)}% needs work` };
    }
    return { tone: "neutral", label: "Review" };
  }

  const fields = SECTION_FIELDS[sectionName] || [];
  const complete = fields.filter((name) => asString(values[name]).trim()).length;
  const total = fields.length || 1;

  if (complete === total) return { tone: "success", label: `${complete}/${total} ready` };
  if (complete === 0) return { tone: "danger", label: "Missing" };
  return { tone: "warning", label: `${complete}/${total} ready` };
}

function renderField({
  name,
  label,
  value,
  helper,
  placeholder,
  escapeHtml,
  type = "text",
  multiline = false,
  rows = 4,
  required = false
}) {
  const filled = Boolean(asString(value).trim());
  const indicatorClass = required
    ? (filled ? "is-ready" : "is-missing")
    : (filled ? "is-ready" : "is-optional");
  const indicatorText = required
    ? (filled ? "Ready" : "Missing")
    : (filled ? "Loaded" : "Optional");

  return `
    <div class="setup-field-group${required && !filled ? " is-missing" : ""}" data-setup-field="${escapeHtml(name)}" data-required="${required ? "true" : "false"}">
      <div class="setup-field-head">
        <label class="setup-label" for="setup-${escapeHtml(name)}">${escapeHtml(label)}</label>
        <span class="setup-field-state ${indicatorClass}" data-setup-indicator-for="${escapeHtml(name)}">${escapeHtml(indicatorText)}</span>
      </div>
      ${
        multiline
          ? `<textarea id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
          : `<input id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
      }
      <div class="setup-helper">${escapeHtml(helper)}</div>
    </div>
  `;
}

function renderIndicatorList(items, escapeHtml, emptyText) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <ul class="simple-list">
      ${items.map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("")}
    </ul>
  `;
}

function readSetupFormValues(form) {
  const formData = new FormData(form);
  const values = {};

  for (const [key, value] of formData.entries()) {
    values[key] = asString(value);
  }

  return values;
}

function updateSetupFieldIndicators(form, values) {
  const groups = Array.from(form.querySelectorAll("[data-setup-field]"));
  groups.forEach((group) => {
    const name = group.getAttribute("data-setup-field") || "";
    const required = group.getAttribute("data-required") === "true";
    const filled = Boolean(asString(values[name]).trim());
    const indicator = group.querySelector("[data-setup-indicator-for]");

    group.classList.toggle("is-missing", required && !filled);

    if (indicator) {
      indicator.classList.remove("is-ready", "is-missing", "is-optional");
      indicator.classList.add(required ? (filled ? "is-ready" : "is-missing") : (filled ? "is-ready" : "is-optional"));
      indicator.textContent = required ? (filled ? "Ready" : "Missing") : (filled ? "Loaded" : "Optional");
    }
  });
}

function applySectionBadge(id, status) {
  const badge = document.getElementById(id);
  if (!badge) return;
  badge.className = `card-badge ${status.tone}`;
  badge.textContent = status.label;
}

function updateSetupDashboard({
  form,
  values,
  escapeHtml,
  missingAssets,
  missingConnectors,
  readinessScore,
  nextActions,
  criticalGaps
}) {
  const missingFields = getMissingRequiredFields(values);
  const completionPercent = getCompletionPercent(values);

  updateSetupFieldIndicators(form, values);

  const completionText = document.getElementById("setupCompletionPercent");
  if (completionText) {
    completionText.textContent = `${completionPercent}%`;
  }

  const completionBar = document.getElementById("setupCompletionBar");
  if (completionBar) {
    completionBar.style.width = `${completionPercent}%`;
  }

  const missingCount = document.getElementById("setupMissingCount");
  if (missingCount) {
    missingCount.textContent = String(missingFields.length);
  }

  const missingList = document.getElementById("setupMissingFields");
  if (missingList) {
    missingList.innerHTML = renderIndicatorList(
      missingFields.map((field) => field.label),
      escapeHtml,
      "Core setup fields are in good shape."
    );
  }

  const systemGaps = document.getElementById("setupSystemGaps");
  if (systemGaps) {
    const combined = [
      ...missingConnectors.map((item) => `Connect ${item}`),
      ...missingAssets.map((item) => `Provide ${item}`),
      ...criticalGaps
    ];
    systemGaps.innerHTML = renderIndicatorList(
      combined,
      escapeHtml,
      "No system blockers detected from the loaded readiness data."
    );
  }

  const note = document.getElementById("setupControlNote");
  if (note) {
    note.textContent = missingFields.length
      ? `${missingFields.length} required field${missingFields.length === 1 ? "" : "s"} still need attention before this setup is complete.`
      : "Required project setup fields are covered. You can move on to readiness and launch planning.";
  }

  const nextActionsBox = document.getElementById("setupNextActionSummary");
  if (nextActionsBox) {
    const firstAction = nextActions[0] || "No next-best action is currently suggested by the backend.";
    nextActionsBox.innerHTML = `<div class="simple-banner">${escapeHtml(firstAction)}</div>`;
  }

  applySectionBadge("setupBasicsBadge", getSectionStatus("basics", values));
  applySectionBadge("setupBrandBadge", getSectionStatus("brand", values));
  applySectionBadge("setupLocaleBadge", getSectionStatus("locale", values));
  applySectionBadge("setupGoalsBadge", getSectionStatus("goals", values));
  applySectionBadge("setupAudienceBadge", getSectionStatus("audience", values));
  applySectionBadge("setupCompetitorsBadge", getSectionStatus("competitors", values));
  applySectionBadge("setupReadinessBadge", getSectionStatus("readiness", values, { readinessScore }));
}

function bindSetupActions({
  $,
  navigateTo,
  showMessage,
  escapeHtml,
  projectName,
  missingAssets,
  missingConnectors,
  readinessScore,
  nextActions,
  criticalGaps
}) {
  const form = $("setupProjectForm");
  if (!form) return;

  const draftKeyName = projectName || "current project";

  const refreshSummary = () => {
    const values = readSetupFormValues(form);
    updateSetupDashboard({
      form,
      values,
      escapeHtml,
      missingAssets,
      missingConnectors,
      readinessScore,
      nextActions,
      criticalGaps
    });
    return values;
  };

  const saveLocal = (message) => {
    const values = refreshSummary();
    const saved = saveSetupDraft(projectName, values);
    if (typeof showMessage === "function") {
      showMessage(saved ? message : "Local draft storage is not available in this browser.");
    }
  };

  form.oninput = refreshSummary;
  form.onchange = refreshSummary;
  refreshSummary();

  const routeButtons = [
    ["setupOpenLibraryBtn", "library"],
    ["setupOpenIntegrationsBtn", "integrations"],
    ["setupBackHomeBtn", "home"],
    ["setupQuickLibraryBtn", "library"],
    ["setupQuickIntegrationsBtn", "integrations"]
  ];

  routeButtons.forEach(([id, route]) => {
    const element = $(id);
    if (!element) return;
    element.onclick = () => navigateTo(route);
  });

  const saveDraftBtn = $("setupSaveDraftBtn");
  if (saveDraftBtn) {
    saveDraftBtn.onclick = () => {
      saveLocal(`Draft saved locally for ${draftKeyName}.`);
    };
  }

  const saveBackendBtn = $("setupSaveBackendBtn");
  if (saveBackendBtn) {
    saveBackendBtn.onclick = () => {
      saveLocal(`Backend save is not connected yet. Draft stored locally for ${draftKeyName}.`);
    };
  }

  const resetBtn = $("setupResetDraftBtn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      clearSetupDraft(projectName);
      navigateTo("setup");
      if (typeof showMessage === "function") {
        showMessage(`Local setup draft cleared for ${draftKeyName}.`);
      }
    };
  }

  const askAiBtn = $("setupAskAiBtn");
  if (askAiBtn) {
    askAiBtn.onclick = () => {
      const values = refreshSummary();
      const missingFields = getMissingRequiredFields(values).map((field) => field.label);
      const input = $("quickCommandInput");
      if (input) {
        input.value = `Review setup gaps for ${draftKeyName}. Missing core fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Critical readiness gaps: ${criticalGaps.length ? criticalGaps.join(", ") : "none"}. Recommend the best completion plan.`;
      }
      navigateTo("ai-command");
      if (typeof showMessage === "function") {
        showMessage("Setup review prompt added to AI Command.");
      }
    };
  }
}

export const setupRoute = {
  id: "setup",
  meta: {
    eyebrow: "Start",
    title: "Setup",
    description: "Edit project configuration, tighten brand inputs, and close missing setup fields before launch."
  },
  template: `
    <section class="page is-active" data-page="setup">
      <div id="setupRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    renderSimpleList,
    navigateTo,
    showMessage
  }) {
    const state = getState();
    const overviewData = asObject(state.data.overview?.overview);
    const readiness = asObject(state.data.readiness);
    const readinessDashboard = asObject(readiness.dashboard);
    const integrations = asObject(state.data.integrations);
    const assets = asObject(state.data.assets);
    const sources = asObject(integrations.sources?.sources);

    const projectName = state.context.currentProject || overviewData.project_name || "";
    const draft = loadSetupDraft(projectName);
    const values = {
      ...buildSetupValues(state),
      ...(draft || {})
    };

    const readinessScore = readinessDashboard.readiness_score ?? overviewData.readiness_score ?? 0;
    const readinessStatus = readinessDashboard.readiness_status || overviewData.readiness_status || "Not ready";
    const missingAssets = asArray(assets.missing_assets?.missing);
    const missingConnectors = asArray(integrations.readiness?.missing);
    const criticalGaps = asArray(readinessDashboard.priorities?.critical);
    const nextActions = asArray(readinessDashboard.next_best_actions).length
      ? asArray(readinessDashboard.next_best_actions)
      : asArray(state.data.overview?.next_best_actions);
    const missingFields = getMissingRequiredFields(values);
    const completionPercent = getCompletionPercent(values);

    const allAssets = asArray(assets.assets);
    const hasLogo = allAssets.some((asset) => asString(asset?.asset_type).toLowerCase() === "logo");
    const hasProductAssets = allAssets.some((asset) => asString(asset?.asset_type).toLowerCase() === "product");
    const connectedCount = Object.keys(sources).filter((key) => {
      const source = sources[key];
      return Boolean(asString(source?.value || source).trim());
    }).length;

    const basicsStatus = getSectionStatus("basics", values);
    const brandStatus = getSectionStatus("brand", values);
    const localeStatus = getSectionStatus("locale", values);
    const goalsStatus = getSectionStatus("goals", values);
    const audienceStatus = getSectionStatus("audience", values);
    const competitorsStatus = getSectionStatus("competitors", values);
    const readinessStatusBadge = getSectionStatus("readiness", values, { readinessScore });

    const root = $("setupRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="setup-wrapper">
        <div class="setup-hero">
          <div class="setup-hero-copy">
            <div class="setup-kicker">Project Setup Workspace</div>
            <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Setup` : "Project Setup")}</h3>
            <p class="setup-hero-text">
              Tighten the information that drives campaign quality, brand consistency, and launch readiness. This form is editable now, and draft saving stays local until the backend save endpoint is wired.
            </p>
            <div class="setup-hero-status">
              <div class="setup-status-chip">
                <span>Completion</span>
                <strong>${escapeHtml(String(completionPercent))}% of core fields</strong>
              </div>
              <div class="setup-status-chip">
                <span>Readiness</span>
                <strong>${escapeHtml(formatPercent(readinessScore))} • ${escapeHtml(safeText(readinessStatus))}</strong>
              </div>
              <div class="setup-status-chip">
                <span>Draft state</span>
                <strong>${draft ? "Local draft loaded" : "Using loaded project data"}</strong>
              </div>
            </div>
          </div>

          <div class="setup-hero-actions">
            <button id="setupSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
            <button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save Changes</button>
          </div>
        </div>

        <form id="setupProjectForm" class="setup-layout">
          <div class="setup-main">
            <section class="card">
              <div class="card-head">
                <h3>Project Basics</h3>
                <span id="setupBasicsBadge" class="card-badge ${basicsStatus.tone}">${escapeHtml(basicsStatus.label)}</span>
              </div>
              <p class="home-section-copy">Anchor the project with the fields that propagate into assets, briefs, exports, and operator workflows.</p>
              <div class="setup-form-grid setup-form-grid-2">
                ${renderField({
                  name: "project_name",
                  label: "Project name",
                  value: values.project_name,
                  helper: "This is the canonical project identifier used throughout the OS.",
                  placeholder: "e.g. Hairotic Men",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "project_type",
                  label: "Project type",
                  value: values.project_type,
                  helper: "Used to tune positioning, offers, and launch recommendations.",
                  placeholder: "e.g. Ecommerce brand",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "website_url",
                  label: "Website URL",
                  value: values.website_url,
                  helper: "Primary storefront or destination used for links, offers, and QA.",
                  placeholder: "https://example.com",
                  escapeHtml,
                  type: "url",
                  required: true
                })}
                ${renderField({
                  name: "project_status",
                  label: "Project status",
                  value: values.project_status,
                  helper: "Useful for operators deciding whether this is draft, active, or launch-ready.",
                  placeholder: "e.g. Active",
                  escapeHtml
                })}
                ${renderField({
                  name: "execution_mode",
                  label: "Execution mode",
                  value: values.execution_mode,
                  helper: "Defines how aggressively the OS should move from planning into execution.",
                  placeholder: "e.g. Guided",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Brand Identity</h3>
                <span id="setupBrandBadge" class="card-badge ${brandStatus.tone}">${escapeHtml(brandStatus.label)}</span>
              </div>
              <div class="setup-signal-strip">
                <div class="setup-signal-card">
                  <span>Logo asset</span>
                  <strong>${hasLogo ? "Available" : "Missing"}</strong>
                </div>
                <div class="setup-signal-card">
                  <span>Product assets</span>
                  <strong>${hasProductAssets ? "Available" : "Missing"}</strong>
                </div>
                <div class="setup-signal-card">
                  <span>Alignment</span>
                  <strong>${escapeHtml(safeText(overviewData.alignment_status, "Not assessed"))}</strong>
                </div>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "brand_name",
                  label: "Brand / display name",
                  value: values.brand_name,
                  helper: "Use the public-facing brand name that should appear in messaging and creative.",
                  placeholder: "Brand name",
                  escapeHtml
                })}
                ${renderField({
                  name: "brand_promise",
                  label: "Brand promise",
                  value: values.brand_promise,
                  helper: "A crisp statement of what this brand delivers. AI uses this to keep messaging coherent.",
                  placeholder: "What the brand is known for and why it matters",
                  escapeHtml,
                  multiline: true,
                  rows: 3,
                  required: true
                })}
                ${renderField({
                  name: "brand_voice",
                  label: "Brand voice",
                  value: values.brand_voice,
                  helper: "Describe tone, posture, and any words the system should favor or avoid.",
                  placeholder: "Confident, practical, premium, direct...",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "visual_identity",
                  label: "Visual identity notes",
                  value: values.visual_identity,
                  helper: "Capture visual rules that matter for thumbnails, ad creative, and packaging.",
                  placeholder: "Color, photography style, layout rules, brand cues...",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "offer_positioning",
                  label: "Offer positioning",
                  value: values.offer_positioning,
                  helper: "Summarize the commercial angle the system should reinforce in campaigns.",
                  placeholder: "Why this offer wins and how it should be framed",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Market / Language / Currency</h3>
                <span id="setupLocaleBadge" class="card-badge ${localeStatus.tone}">${escapeHtml(localeStatus.label)}</span>
              </div>
              <p class="home-section-copy">These fields drive localization, channel assumptions, timing, and pricing context.</p>
              <div class="setup-form-grid setup-form-grid-3">
                ${renderField({
                  name: "market",
                  label: "Primary market",
                  value: values.market,
                  helper: "Country or region this project is optimized for first.",
                  placeholder: "e.g. US",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "language",
                  label: "Primary language",
                  value: values.language,
                  helper: "Main language for copy, prompts, and publishing.",
                  placeholder: "e.g. English",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "currency",
                  label: "Currency",
                  value: values.currency,
                  helper: "Important for pricing references, reporting, and revenue framing.",
                  placeholder: "e.g. USD",
                  escapeHtml,
                  required: true
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Goals</h3>
                <span id="setupGoalsBadge" class="card-badge ${goalsStatus.tone}">${escapeHtml(goalsStatus.label)}</span>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "primary_goal",
                  label: "Primary goal",
                  value: values.primary_goal,
                  helper: "The main business outcome this project should optimize for right now.",
                  placeholder: "Increase qualified sales, grow email list, validate offer...",
                  escapeHtml,
                  multiline: true,
                  rows: 3,
                  required: true
                })}
                ${renderField({
                  name: "secondary_goal",
                  label: "Secondary goal",
                  value: values.secondary_goal,
                  helper: "Useful when growth, retention, and creative testing need a clear tie-breaker.",
                  placeholder: "A supporting objective",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "launch_window",
                  label: "Launch window / wave",
                  value: values.launch_window,
                  helper: "Capture the campaign wave, season, or commercial timing that matters most.",
                  placeholder: "e.g. Spring launch wave 1",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Audience</h3>
                <span id="setupAudienceBadge" class="card-badge ${audienceStatus.tone}">${escapeHtml(audienceStatus.label)}</span>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "audience_primary",
                  label: "Primary audience",
                  value: values.audience_primary,
                  helper: "Define who this brand is selling to before asking the system for campaign ideas.",
                  placeholder: "Who is the buyer or customer segment?",
                  escapeHtml,
                  multiline: true,
                  rows: 3,
                  required: true
                })}
                ${renderField({
                  name: "audience_problem",
                  label: "Core problem / need",
                  value: values.audience_problem,
                  helper: "Clarifies the pain, desire, or outcome the product is solving for.",
                  placeholder: "What does the audience want fixed or improved?",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "audience_geography",
                  label: "Audience geography",
                  value: values.audience_geography,
                  helper: "Use this when targeting differs from the primary market or needs nuance.",
                  placeholder: "Region, city clusters, or geography notes",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Competitors</h3>
                <span id="setupCompetitorsBadge" class="card-badge ${competitorsStatus.tone}">${escapeHtml(competitorsStatus.label)}</span>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "competitors",
                  label: "Competitor set",
                  value: values.competitors,
                  helper: "Comma-separated or line-separated competitors the system should understand and benchmark against.",
                  placeholder: "Competitor A, Competitor B, Competitor C",
                  escapeHtml,
                  multiline: true,
                  rows: 3,
                  required: true
                })}
                ${renderField({
                  name: "differentiation",
                  label: "Differentiation angle",
                  value: values.differentiation,
                  helper: "Explain how this project should position itself differently from the market.",
                  placeholder: "Why this brand wins and what should feel distinct",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Readiness Review</h3>
                <span id="setupReadinessBadge" class="card-badge ${readinessStatusBadge.tone}">${escapeHtml(readinessStatusBadge.label)}</span>
              </div>
              <p class="home-section-copy">This section blends backend readiness signals with operator notes so setup work stays tied to launch reality.</p>
              <div class="setup-review-grid">
                <div class="data-card">
                  <span class="data-label">Readiness score</span>
                  <strong>${escapeHtml(formatPercent(readinessScore))}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Critical gaps</span>
                  <strong>${escapeHtml(String(criticalGaps.length))}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Missing connectors</span>
                  <strong>${escapeHtml(String(missingConnectors.length))}</strong>
                </div>
                <div class="data-card">
                  <span class="data-label">Missing assets</span>
                  <strong>${escapeHtml(String(missingAssets.length))}</strong>
                </div>
              </div>

              <div class="setup-review-columns">
                <div>
                  <h4 class="setup-mini-title">Critical gaps</h4>
                  ${renderSimpleList(criticalGaps, "No critical readiness gaps were returned by the backend.")}
                </div>
                <div>
                  <h4 class="setup-mini-title">Next best actions</h4>
                  <div id="setupNextActionSummary">
                    <div class="simple-banner">${escapeHtml(nextActions[0] || "No next-best action is currently suggested by the backend.")}</div>
                  </div>
                  <div style="margin-top: 12px;">
                    ${renderSimpleList(nextActions, "No readiness actions available yet.")}
                  </div>
                </div>
              </div>

              <div class="setup-form-grid" style="margin-top: 16px;">
                ${renderField({
                  name: "operator_notes",
                  label: "Operator notes",
                  value: values.operator_notes,
                  helper: "Use this to capture local setup context, approvals, and follow-ups until backend save is connected.",
                  placeholder: "Notes for the next operator or launch review",
                  escapeHtml,
                  multiline: true,
                  rows: 4
                })}
              </div>
            </section>
          </div>

          <aside class="setup-side">
            <section class="card">
              <div class="card-head">
                <h3>Setup Control</h3>
                <span class="card-badge neutral">Local draft</span>
              </div>
              <div class="setup-progress">
                <div class="setup-progress-head">
                  <span>Completion</span>
                  <strong id="setupCompletionPercent">${escapeHtml(String(completionPercent))}%</strong>
                </div>
                <div class="setup-progress-track">
                  <div id="setupCompletionBar" class="setup-progress-fill" style="width:${escapeHtml(String(completionPercent))}%"></div>
                </div>
              </div>
              <p id="setupControlNote" class="setup-side-copy">
                ${missingFields.length
                  ? `${escapeHtml(String(missingFields.length))} required field${missingFields.length === 1 ? "" : "s"} still need attention before this setup is complete.`
                  : "Required project setup fields are covered. You can move on to readiness and launch planning."}
              </p>
              <div class="quick-actions">
                <button id="setupResetDraftBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Reset local draft</span>
                  <span class="home-action-meta">Return to the currently loaded project values.</span>
                </button>
                <button id="setupBackHomeBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Back to Home</span>
                  <span class="home-action-meta">Return to the executive dashboard.</span>
                </button>
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Missing Core Fields</h3>
                <span class="card-badge danger"><span id="setupMissingCount">${escapeHtml(String(missingFields.length))}</span> open</span>
              </div>
              <div id="setupMissingFields">
                ${renderIndicatorList(
                  missingFields.map((field) => field.label),
                  escapeHtml,
                  "Core setup fields are in good shape."
                )}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>System Gaps</h3>
                <span class="card-badge warning">Operational</span>
              </div>
              <div id="setupSystemGaps">
                ${renderIndicatorList(
                  [
                    ...missingConnectors.map((item) => `Connect ${item}`),
                    ...missingAssets.map((item) => `Provide ${item}`),
                    ...criticalGaps
                  ],
                  escapeHtml,
                  "No system blockers detected from the loaded readiness data."
                )}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Quick Actions</h3>
                <span class="card-badge neutral">Navigate</span>
              </div>
              <div class="quick-actions">
                <button id="setupOpenLibraryBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Review assets</span>
                  <span class="home-action-meta">Inspect library gaps and file coverage.</span>
                </button>
                <button id="setupOpenIntegrationsBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Review integrations</span>
                  <span class="home-action-meta">Check connectors before launch planning.</span>
                </button>
                <button id="setupQuickLibraryBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Open library view</span>
                  <span class="home-action-meta">Stay in setup mode while reviewing asset structure.</span>
                </button>
                <button id="setupQuickIntegrationsBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Open integration view</span>
                  <span class="home-action-meta">Inspect platform readiness and missing sources.</span>
                </button>
                <button id="setupAskAiBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Ask AI for completion plan</span>
                  <span class="home-action-meta">Stage a setup-gap prompt in AI Command.</span>
                </button>
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Operational Snapshot</h3>
                <span class="card-badge neutral">Signals</span>
              </div>
              <div class="data-stack">
                <div class="data-row"><span>Connected sources</span><strong>${escapeHtml(String(connectedCount))}</strong></div>
                <div class="data-row"><span>Total assets</span><strong>${escapeHtml(String(allAssets.length))}</strong></div>
                <div class="data-row"><span>Current market</span><strong>${escapeHtml(safeText(values.market))}</strong></div>
                <div class="data-row"><span>Current language</span><strong>${escapeHtml(safeText(values.language))}</strong></div>
              </div>
            </section>
          </aside>
        </form>
      </div>
    `;

    bindSetupActions({
      $,
      navigateTo,
      showMessage,
      escapeHtml,
      projectName,
      missingAssets,
      missingConnectors,
      readinessScore,
      nextActions,
      criticalGaps
    });
  }
};
