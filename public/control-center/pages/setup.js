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
  project_information: ["project_name", "project_type", "website_url", "project_status"],
  business_context: ["audience_primary", "audience_problem", "audience_geography", "competitors", "differentiation"],
  brand: ["brand_name", "brand_promise", "brand_voice", "visual_identity", "offer_positioning"],
  market_language: ["market", "language", "currency"],
  goals_readiness: ["primary_goal", "secondary_goal", "operator_notes"]
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
  return Array.isArray(value) ? value.join(", ") : asString(value);
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
  if (typeof window === "undefined" || !window.localStorage) return null;

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
  if (typeof window === "undefined" || !window.localStorage) return false;

  try {
    window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));
    return true;
  } catch (_) {
    return false;
  }
}

function clearSetupDraft(projectName) {
  if (typeof window === "undefined" || !window.localStorage) return false;

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
    brand_promise: overviewData.brand_promise || overviewData.brand_positioning || overviewData.value_prop || "",
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
  return Math.round(((REQUIRED_FIELDS.length - missing) / REQUIRED_FIELDS.length) * 100);
}

function getSectionStatus(sectionName, values, extras = {}) {
  if (sectionName === "goals_readiness") {
    const score = Number(extras.readinessScore);
    if (Number.isFinite(score)) {
      if (score >= 80) return { tone: "success", label: `${Math.round(score)}% ready` };
      if (score >= 50) return { tone: "warning", label: `${Math.round(score)}% in progress` };
      return { tone: "danger", label: `${Math.round(score)}% needs work` };
    }
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
  const indicatorClass = required ? (filled ? "is-ready" : "is-missing") : (filled ? "is-ready" : "is-optional");
  const indicatorText = required ? (filled ? "Ready" : "Missing") : (filled ? "Loaded" : "Optional");

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

  return `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("")}</ul>`;
}

function readSetupFormValues(form) {
  const formData = new FormData(form);
  const values = {};

  for (const [key, value] of formData.entries()) {
    values[key] = asString(value);
  }

  return values;
}

function buildSetupPersistencePayload(values) {
  return {
    project_type: values.project_type,
    website_url: values.website_url,
    project_status: values.project_status,
    execution_mode: values.execution_mode,
    brand_name: values.brand_name,
    brand_promise: values.brand_promise,
    brand_voice: values.brand_voice,
    visual_identity: values.visual_identity,
    offer_positioning: values.offer_positioning,
    market: values.market,
    language: values.language,
    currency: values.currency,
    primary_goal: values.primary_goal,
    secondary_goal: values.secondary_goal,
    launch_window: values.launch_window,
    audience_primary: values.audience_primary,
    audience_problem: values.audience_problem,
    audience_geography: values.audience_geography,
    competitors: values.competitors,
    differentiation: values.differentiation,
    operator_notes: values.operator_notes
  };
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

function updateSetupDashboard({ form, values, escapeHtml, missingAssets, missingConnectors, readinessScore, nextActions, criticalGaps }) {
  const missingFields = getMissingRequiredFields(values);
  const completionPercent = getCompletionPercent(values);

  updateSetupFieldIndicators(form, values);

  const completionText = document.getElementById("setupCompletionPercent");
  if (completionText) completionText.textContent = `${completionPercent}%`;

  const completionBar = document.getElementById("setupCompletionBar");
  if (completionBar) completionBar.style.width = `${completionPercent}%`;

  const missingCount = document.getElementById("setupMissingCount");
  if (missingCount) missingCount.textContent = String(missingFields.length);

  const missingList = document.getElementById("setupMissingFields");
  if (missingList) {
    missingList.innerHTML = renderIndicatorList(missingFields.map((field) => field.label), escapeHtml, "Core setup fields are in good shape.");
  }

  const blockerList = document.getElementById("setupSystemGaps");
  if (blockerList) {
    blockerList.innerHTML = renderIndicatorList(
      [
        ...missingConnectors.map((item) => `Connect ${item}`),
        ...missingAssets.map((item) => `Provide ${item}`),
        ...criticalGaps
      ],
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
    nextActionsBox.innerHTML = `<div class="simple-banner">${escapeHtml(nextActions[0] || "No next-best action is currently suggested yet.")}</div>`;
  }

  applySectionBadge("setupProjectInfoBadge", getSectionStatus("project_information", values));
  applySectionBadge("setupBusinessBadge", getSectionStatus("business_context", values));
  applySectionBadge("setupBrandBadge", getSectionStatus("brand", values));
  applySectionBadge("setupMarketBadge", getSectionStatus("market_language", values));
  applySectionBadge("setupGoalsBadge", getSectionStatus("goals_readiness", values, { readinessScore }));
}

function bindSetupActions({
  $,
  navigateTo,
  showMessage,
  showError,
  escapeHtml,
  projectName,
  reloadProjectData,
  saveProjectSetup,
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

  const saveDraftBtn = $("setupSaveDraftBtn");
  if (saveDraftBtn) {
    saveDraftBtn.onclick = () => {
      saveLocal(`Draft saved locally for ${draftKeyName}.`);
    };
  }

  const saveBackendBtn = $("setupSaveBackendBtn");
  if (saveBackendBtn) {
    saveBackendBtn.onclick = async () => {
      if (!projectName) {
        showError?.("Select a project before saving Setup changes.");
        return;
      }

      const values = refreshSummary();
      const requestedProjectName = asString(values.project_name).trim().toLowerCase();
      const payload = buildSetupPersistencePayload(values);

      saveBackendBtn.disabled = true;

      try {
        await saveProjectSetup?.(projectName, payload);
        clearSetupDraft(projectName);
        await reloadProjectData?.(projectName);

        const renameWarning =
          requestedProjectName && requestedProjectName !== asString(projectName).trim().toLowerCase()
            ? " Project name remains local-only until project rename support exists."
            : "";

        showMessage?.(`Setup saved for ${draftKeyName}.${renameWarning}`);
      } catch (error) {
        showError?.(error.message || `Failed to save Setup changes for ${draftKeyName}.`);
      } finally {
        saveBackendBtn.disabled = false;
      }
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
        showMessage("Prompt sent to AI Command.");
      }
    };
  }

  const openCampaignBtn = $("setupOpenCampaignBtn");
  if (openCampaignBtn) {
    openCampaignBtn.onclick = () => {
      navigateTo("campaign-studio");
      showMessage?.("Opened Campaign Studio.");
    };
  }

  const openIntegrationsBtn = $("setupOpenIntegrationsBtn");
  if (openIntegrationsBtn) {
    openIntegrationsBtn.onclick = () => {
      navigateTo("integrations");
      showMessage?.("Opened Integrations.");
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
    navigateTo,
    showMessage,
    showError,
    reloadProjectData,
    saveProjectSetup
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
    const values = { ...buildSetupValues(state), ...(draft || {}) };

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
    const connectedCount = Object.keys(sources).filter((key) => {
      const source = sources[key];
      return Boolean(asString(source?.value || source).trim());
    }).length;

    const projectInfoStatus = getSectionStatus("project_information", values);
    const businessStatus = getSectionStatus("business_context", values);
    const brandStatus = getSectionStatus("brand", values);
    const marketStatus = getSectionStatus("market_language", values);
    const goalsStatus = getSectionStatus("goals_readiness", values, { readinessScore });

    const root = $("setupRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="setup-wrapper">
        <section class="card setup-hero">
          <div class="setup-hero-copy">
            <div class="setup-kicker">Source Of Truth Definition</div>
            <h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Setup` : "Project Setup")}</h3>
            <p class="setup-hero-text">
              Define the saved project baseline that downstream planning, asset work, and AI assistance should rely on. Setup is for project definition, not campaign orchestration or workflow control.
            </p>
          </div>
        </section>

        <form id="setupProjectForm" class="setup-layout">
          <div class="setup-main">
            <section class="card">
              <div class="card-head">
                <h3>Project Information</h3>
                <span id="setupProjectInfoBadge" class="card-badge ${projectInfoStatus.tone}">${escapeHtml(projectInfoStatus.label)}</span>
              </div>
              <p class="home-section-copy">Anchor the canonical project record used across briefs, exports, and setup decisions.</p>
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
                  helper: "Use the broad business type this project belongs to.",
                  placeholder: "e.g. Ecommerce brand",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "website_url",
                  label: "Website URL",
                  value: values.website_url,
                  helper: "Primary storefront or destination for the project.",
                  placeholder: "https://example.com",
                  escapeHtml,
                  type: "url",
                  required: true
                })}
                ${renderField({
                  name: "project_status",
                  label: "Project status",
                  value: values.project_status,
                  helper: "Use a high-level lifecycle state for the project record.",
                  placeholder: "e.g. Active",
                  escapeHtml
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Business Context</h3>
                <span id="setupBusinessBadge" class="card-badge ${businessStatus.tone}">${escapeHtml(businessStatus.label)}</span>
              </div>
              <p class="home-section-copy">Capture the customer, problem space, and competitive baseline this project should consistently reflect.</p>
              <div class="setup-form-grid">
                ${renderField({
                  name: "audience_primary",
                  label: "Primary audience",
                  value: values.audience_primary,
                  helper: "Define the buyer or customer segment this project is built for.",
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
                  helper: "Clarify the pain, desire, or outcome the offer is solving for.",
                  placeholder: "What does the audience want fixed or improved?",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "audience_geography",
                  label: "Audience geography",
                  value: values.audience_geography,
                  helper: "Use this if the target audience geography differs from the primary market.",
                  placeholder: "Region, city clusters, or geography notes",
                  escapeHtml
                })}
                ${renderField({
                  name: "competitors",
                  label: "Competitor set",
                  value: values.competitors,
                  helper: "List the competitors this project should benchmark and position against.",
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
                <h3>Brand & Positioning</h3>
                <span id="setupBrandBadge" class="card-badge ${brandStatus.tone}">${escapeHtml(brandStatus.label)}</span>
              </div>
              <p class="home-section-copy">Set the saved brand baseline that messaging, creative, and AI-generated output should follow.</p>
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
                  helper: "A concise statement of what the brand delivers and why it matters.",
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
                  helper: "Describe the tone and language guardrails the system should follow.",
                  placeholder: "Confident, practical, premium, direct...",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "visual_identity",
                  label: "Visual identity notes",
                  value: values.visual_identity,
                  helper: "Capture visual cues that should remain stable across creative output.",
                  placeholder: "Color, photography style, layout rules, brand cues...",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "offer_positioning",
                  label: "Offer positioning",
                  value: values.offer_positioning,
                  helper: "Summarize the commercial angle the brand should consistently reinforce.",
                  placeholder: "Why this offer wins and how it should be framed",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Market & Language</h3>
                <span id="setupMarketBadge" class="card-badge ${marketStatus.tone}">${escapeHtml(marketStatus.label)}</span>
              </div>
              <p class="home-section-copy">Set the localization baseline other parts of the system should inherit rather than override.</p>
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
                  helper: "Main language for copy and AI-generated output.",
                  placeholder: "e.g. English",
                  escapeHtml,
                  required: true
                })}
                ${renderField({
                  name: "currency",
                  label: "Currency",
                  value: values.currency,
                  helper: "Use the primary commercial currency for pricing references and reporting context.",
                  placeholder: "e.g. USD",
                  escapeHtml,
                  required: true
                })}
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Goals & Readiness</h3>
                <span id="setupGoalsBadge" class="card-badge ${goalsStatus.tone}">${escapeHtml(goalsStatus.label)}</span>
              </div>
              <p class="home-section-copy">Keep Setup tied to the project goal and the readiness inputs that should live with the project definition.</p>
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
                  <span class="data-label">Connected sources</span>
                  <strong>${escapeHtml(String(connectedCount))}</strong>
                </div>
              </div>
              <div class="setup-form-grid">
                ${renderField({
                  name: "primary_goal",
                  label: "Primary goal",
                  value: values.primary_goal,
                  helper: "Capture the main business outcome this project should optimize for.",
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
                  helper: "Optional supporting goal when this project needs a secondary success measure.",
                  placeholder: "A supporting objective",
                  escapeHtml,
                  multiline: true,
                  rows: 3
                })}
                ${renderField({
                  name: "operator_notes",
                  label: "Operator notes",
                  value: values.operator_notes,
                  helper: "Use this for saved setup notes, approvals, and readiness context that should stay with the project record.",
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
                <h3>Save / Draft / Validation</h3>
                <span class="card-badge neutral">Source of truth</span>
              </div>
              <p class="setup-side-copy">Save stores the project definition for the workspace. Save Draft keeps in-progress edits in this browser only.</p>
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
              <div class="setup-hero-actions">
                <button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save</button>
                <button id="setupSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
              </div>
              <div class="quick-actions">
                <button id="setupOpenCampaignBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Open Campaign Studio</span>
                  <span class="home-action-meta">Move from setup into campaign planning when the core project details are ready.</span>
                </button>
                ${
                  missingConnectors.length
                    ? `
                      <button id="setupOpenIntegrationsBtn" class="quick-action-btn" type="button">
                        <span class="home-action-title">Open Integrations</span>
                        <span class="home-action-meta">Reconnect missing data sources before launch planning goes further.</span>
                      </button>
                    `
                    : ""
                }
                <button id="setupResetDraftBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Reset local draft</span>
                  <span class="home-action-meta">Return to the currently loaded project values.</span>
                </button>
              </div>

              <div class="setup-validation-block">
                <div class="card-head">
                  <h3>Validation</h3>
                  <span class="card-badge danger"><span id="setupMissingCount">${escapeHtml(String(missingFields.length))}</span> open</span>
                </div>
                <div id="setupMissingFields">
                  ${renderIndicatorList(missingFields.map((field) => field.label), escapeHtml, "Core setup fields are in good shape.")}
                </div>
              </div>

              <div class="setup-validation-block">
                <div class="card-head">
                  <h3>Readiness blockers</h3>
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
              </div>

              <div class="setup-validation-block">
                <div class="card-head">
                  <h3>Next best action</h3>
                  <span class="card-badge neutral">Priority</span>
                </div>
                <div id="setupNextActionSummary">
                  <div class="simple-banner">${escapeHtml(nextActions[0] || "No next-best action is currently suggested yet.")}</div>
                </div>
              </div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Setup AI Assistant</h3>
                <span class="card-badge neutral">Assist</span>
              </div>
              <p class="setup-side-copy">Send the current setup gaps and readiness context to AI Command for a structured completion plan.</p>
              <div class="quick-actions">
                <button id="setupAskAiBtn" class="quick-action-btn" type="button">
                  <span class="home-action-title">Send to AI Command</span>
                  <span class="home-action-meta">Stage a setup-gap prompt in AI Command.</span>
                </button>
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
      showError,
      escapeHtml,
      projectName,
      reloadProjectData,
      saveProjectSetup,
      missingAssets,
      missingConnectors,
      readinessScore,
      nextActions,
      criticalGaps
    });
  }
};
