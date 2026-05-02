import { getMissingAssetLabels } from "../asset-library.js";

const REQUIRED_FIELDS = [
  { name: "project_name", label: "Project name" },
  { name: "project_type", label: "Project type" },
  { name: "website_url", label: "Website URL" },
  { name: "brand_promise", label: "Brand promise" },
  { name: "market", label: "Market" },
  { name: "language", label: "Language" },
  { name: "currency", label: "Currency" },
  { name: "audience_primary", label: "Primary audience" },
  { name: "primary_goal", label: "Primary goal" },
  { name: "competitors", label: "Competitors" },
  { name: "social_channels", label: "Channels" }
];

const STEP_DEFINITIONS = [
  {
    id: "business-basics",
    title: "Business Basics",
    description: "Start with the core project record used across all workflows.",
    fields: ["project_name", "project_type", "website_url", "launch_window"]
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    description: "Capture the positioning and tone AI must follow.",
    fields: ["brand_name", "brand_promise", "brand_voice", "offer_positioning", "visual_identity"]
  },
  {
    id: "market-language",
    title: "Market & Language",
    description: "Set localization defaults inherited by campaign and content pages.",
    fields: ["market", "language", "currency"]
  },
  {
    id: "audience",
    title: "Audience",
    description: "Define who you serve and what problem you solve.",
    fields: ["audience_primary", "audience_problem", "audience_geography"]
  },
  {
    id: "goals",
    title: "Goals",
    description: "Clarify outcomes this project should optimize for.",
    fields: ["primary_goal", "secondary_goal"]
  },
  {
    id: "competitors",
    title: "Competitors",
    description: "Record benchmark references and your differentiation angle.",
    fields: ["competitors", "differentiation"]
  },
  {
    id: "channels",
    title: "Channels",
    description: "Map go-live channels and operator guidance.",
    fields: ["social_channels", "operator_notes"]
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

function toListText(value) {
  return Array.isArray(value) ? value.join(", ") : asString(value);
}

function toList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item).trim()).filter(Boolean);
  }

  return asString(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
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
    project_status: overviewData.project_status || overviewData.status || "",
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
    social_channels: toListText(overviewData.social_channels || overviewData.social_links),
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

function getFieldStepId(fieldName) {
  const step = STEP_DEFINITIONS.find((item) => item.fields.includes(fieldName));
  return step ? step.id : STEP_DEFINITIONS[0].id;
}

function getStepStatus(step, values) {
  const requiredInStep = step.fields.filter((name) => REQUIRED_FIELDS.some((field) => field.name === name));
  const total = requiredInStep.length;

  if (!total) {
    const hasAny = step.fields.some((name) => Boolean(asString(values[name]).trim()));
    return {
      tone: hasAny ? "success" : "neutral",
      label: hasAny ? "Ready" : "Optional"
    };
  }

  const complete = requiredInStep.filter((name) => Boolean(asString(values[name]).trim())).length;
  if (complete === total) return { tone: "success", label: "Ready" };
  if (complete === 0) return { tone: "danger", label: "Missing" };
  return { tone: "warning", label: `${complete}/${total}` };
}

function getWizardReadinessStatus(values, readinessScore, readinessStatus) {
  const noMissing = getMissingRequiredFields(values).length === 0;
  const score = Number(readinessScore);
  const scoreReady = Number.isFinite(score) ? score >= 85 : false;
  const backendReady = asString(readinessStatus).toLowerCase() === "strong";
  return noMissing && (scoreReady || backendReady) ? "Ready" : "Not ready";
}

function getSetupBrandStatus(values) {
  const fields = ["brand_name", "brand_promise", "brand_voice", "offer_positioning"];
  const completed = fields.filter((field) => asString(values[field]).trim()).length;
  if (completed === fields.length) return "Ready";
  if (completed === 0) return "Missing";
  return "In progress";
}

function getSetupLocalizationStatus(values) {
  const fields = ["market", "language", "currency"];
  const completed = fields.filter((field) => asString(values[field]).trim()).length;
  if (completed === fields.length) return "Ready";
  if (completed === 0) return "Missing";
  return "In progress";
}

function getNextSetupActionText(missingFields, missingAssets, missingConnectors) {
  if (missingFields.length) {
    return `Complete required setup fields (${missingFields.length} remaining).`;
  }

  if (missingAssets.length) {
    return `Upload missing required assets (${missingAssets.length}) in Library.`;
  }

  if (missingConnectors.length) {
    return `Connect missing platforms (${missingConnectors.length}) in Integrations.`;
  }

  return "Save and continue to Library.";
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
    project_name: values.project_name,
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
    social_channels: toList(values.social_channels),
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

function buildPositioningSuggestion(values) {
  const brand = asString(values.brand_name || values.project_name || "your brand").trim() || "your brand";
  const promise = asString(values.brand_promise).trim() || "a clear practical benefit";
  const audience = asString(values.audience_primary).trim() || "a focused customer segment";
  const goal = asString(values.primary_goal).trim() || "consistent growth";

  return `${brand} helps ${audience} achieve ${goal} through ${promise}.`;
}

function buildAudienceSuggestion(values) {
  const geo = asString(values.audience_geography || values.market).trim();
  const problem = asString(values.audience_problem).trim() || "a high-priority pain point";
  const locationText = geo ? ` in ${geo}` : "";
  return `Decision-ready buyers${locationText} who are actively looking to solve ${problem}.`;
}

function buildToneSuggestion(values) {
  if (asString(values.brand_voice).trim()) {
    return asString(values.brand_voice).trim();
  }

  const type = asString(values.project_type).toLowerCase();
  if (type.includes("premium") || type.includes("lux")) {
    return "Confident, premium, and concise with clear proof points.";
  }

  if (type.includes("ecommerce") || type.includes("commerce")) {
    return "Direct, helpful, and conversion-focused with concrete benefits.";
  }

  return "Clear, practical, and trustworthy with a human and outcome-focused tone.";
}

function updateAiAssistantPreview(values) {
  const positioning = document.getElementById("setupAiPositioningText");
  if (positioning) positioning.textContent = buildPositioningSuggestion(values);

  const audience = document.getElementById("setupAiAudienceText");
  if (audience) audience.textContent = buildAudienceSuggestion(values);

  const tone = document.getElementById("setupAiToneText");
  if (tone) tone.textContent = buildToneSuggestion(values);
}

function updateWizardDashboard({
  form,
  values,
  escapeHtml,
  missingAssets,
  missingConnectors,
  criticalGaps,
  readinessScore,
  readinessStatus,
  activeStepId,
  activateStep
}) {
  const missingFields = getMissingRequiredFields(values);
  const completionPercent = getCompletionPercent(values);

  updateSetupFieldIndicators(form, values);

  const completionText = document.getElementById("setupCompletionPercent");
  if (completionText) completionText.textContent = `${completionPercent}%`;

  const completionBar = document.getElementById("setupCompletionBar");
  if (completionBar) completionBar.style.width = `${completionPercent}%`;

  const missingCount = document.getElementById("setupMissingCount");
  if (missingCount) missingCount.textContent = String(missingFields.length);

  const readinessBadge = document.getElementById("setupReadinessBadge");
  if (readinessBadge) {
    const label = getWizardReadinessStatus(values, readinessScore, readinessStatus);
    readinessBadge.className = `card-badge ${label === "Ready" ? "success" : "warning"}`;
    readinessBadge.textContent = label;
  }

  const missingList = document.getElementById("setupMissingFields");
  if (missingList) {
    missingList.innerHTML = renderIndicatorList(
      missingFields.map((field) => field.label),
      escapeHtml,
      "All required setup fields are complete."
    );
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
      "No operational blockers detected from readiness signals."
    );
  }

  const completeNowBtn = document.getElementById("setupCompleteNowBtn");
  if (completeNowBtn) {
    completeNowBtn.disabled = missingFields.length === 0;
    completeNowBtn.onclick = () => {
      if (!missingFields.length) return;
      const first = missingFields[0];
      const stepId = getFieldStepId(first.name);
      activateStep(stepId);
      const input = form.querySelector(`[name="${first.name}"]`);
      if (input && typeof input.focus === "function") input.focus();
    };
  }

  STEP_DEFINITIONS.forEach((step) => {
    const badge = document.getElementById(`setupStepBadge-${step.id}`);
    const status = getStepStatus(step, values);
    if (badge) {
      badge.className = `card-badge ${status.tone}`;
      badge.textContent = status.label;
    }
  });

  const stepCounter = document.getElementById("setupStepCounter");
  if (stepCounter) {
    const current = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId) + 1;
    stepCounter.textContent = `${current}/${STEP_DEFINITIONS.length}`;
  }

  updateAiAssistantPreview(values);
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
  readinessStatus,
  criticalGaps
}) {
  const form = $("setupProjectForm");
  if (!form) return;

  const stepButtons = Array.from(document.querySelectorAll("[data-setup-step]"));
  const stepPanels = Array.from(document.querySelectorAll("[data-setup-step-panel]"));
  const draftKeyName = projectName || "current project";
  let activeStepId = STEP_DEFINITIONS[0].id;

  const activateStep = (stepId) => {
    activeStepId = stepId;
    stepButtons.forEach((button) => {
      const isActive = button.getAttribute("data-setup-step") === stepId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "step" : "false");
    });

    stepPanels.forEach((panel) => {
      const isActive = panel.getAttribute("data-setup-step-panel") === stepId;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    const values = readSetupFormValues(form);
    updateWizardDashboard({
      form,
      values,
      escapeHtml,
      missingAssets,
      missingConnectors,
      criticalGaps,
      readinessScore,
      readinessStatus,
      activeStepId,
      activateStep
    });
  };

  stepButtons.forEach((button) => {
    button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);
  });

  const prevBtn = $("setupPrevStepBtn");
  if (prevBtn) {
    prevBtn.onclick = () => {
      const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
      if (index > 0) activateStep(STEP_DEFINITIONS[index - 1].id);
    };
  }

  const nextBtn = $("setupNextStepBtn");
  if (nextBtn) {
    nextBtn.onclick = () => {
      const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
      if (index < STEP_DEFINITIONS.length - 1) activateStep(STEP_DEFINITIONS[index + 1].id);
    };
  }

  const refreshSummary = () => {
    const values = readSetupFormValues(form);
    updateWizardDashboard({
      form,
      values,
      escapeHtml,
      missingAssets,
      missingConnectors,
      criticalGaps,
      readinessScore,
      readinessStatus,
      activeStepId,
      activateStep
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

  const aiPositioningBtn = $("setupAiPositioningBtn");
  if (aiPositioningBtn) {
    aiPositioningBtn.onclick = () => {
      const values = refreshSummary();
      const field = form.querySelector('[name="offer_positioning"]');
      if (field && !asString(field.value).trim()) {
        field.value = buildPositioningSuggestion(values);
      }
      refreshSummary();
      showMessage?.("AI draft applied to Offer positioning.");
    };
  }

  const aiAudienceBtn = $("setupAiAudienceBtn");
  if (aiAudienceBtn) {
    aiAudienceBtn.onclick = () => {
      const values = refreshSummary();
      const field = form.querySelector('[name="audience_primary"]');
      if (field && !asString(field.value).trim()) {
        field.value = buildAudienceSuggestion(values);
      }
      refreshSummary();
      showMessage?.("AI draft applied to Primary audience.");
    };
  }

  const aiToneBtn = $("setupAiToneBtn");
  if (aiToneBtn) {
    aiToneBtn.onclick = () => {
      const values = refreshSummary();
      const field = form.querySelector('[name="brand_voice"]');
      if (field && !asString(field.value).trim()) {
        field.value = buildToneSuggestion(values);
      }
      refreshSummary();
      showMessage?.("AI draft applied to Brand voice.");
    };
  }

  const aiFillBtn = $("setupAiFillMissingBtn");
  if (aiFillBtn) {
    aiFillBtn.onclick = () => {
      const values = refreshSummary();
      const setIfEmpty = (name, nextValue) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && !asString(input.value).trim()) {
          input.value = nextValue;
        }
      };

      const inferredBrand = asString(values.brand_name || values.project_name || "Brand").trim() || "Brand";
      setIfEmpty("brand_promise", `${inferredBrand} delivers clear and trustworthy value with consistent quality.`);
      setIfEmpty("offer_positioning", buildPositioningSuggestion(values));
      setIfEmpty("audience_primary", buildAudienceSuggestion(values));
      setIfEmpty("brand_voice", buildToneSuggestion(values));
      setIfEmpty("social_channels", "instagram, facebook, email");
      setIfEmpty("competitors", "Competitor A, Competitor B");
      setIfEmpty("primary_goal", "Increase qualified conversions");
      setIfEmpty("market", asString(values.audience_geography || values.market || "US"));
      setIfEmpty("language", "English");
      setIfEmpty("currency", "USD");

      refreshSummary();
      showMessage?.("AI drafted missing fields. Review and save when ready.");
    };
  }

  const aiCommandBtn = $("setupAiCommandBtn");
  if (aiCommandBtn) {
    aiCommandBtn.onclick = () => {
      const values = refreshSummary();
      const missingFields = getMissingRequiredFields(values).map((field) => field.label);
      const input = $("quickCommandInput");
      if (input) {
        input.value = `Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.`;
      }
      navigateTo("ai-command");
      showMessage?.("Setup context sent to AI Command.");
    };
  }

  const validateNowBtn = $("setupValidateNowBtn");
  if (validateNowBtn) {
    validateNowBtn.onclick = () => {
      const target = $("setupSaveBackendBtn");
      if (target && !target.disabled) {
        target.click();
      }
    };
  }

  const continueLibraryBtn = $("setupContinueLibraryBtn");
  if (continueLibraryBtn) {
    continueLibraryBtn.onclick = () => {
      navigateTo("library");
    };
  }

  const smartActionBtn = $("setupSmartActionBtn");
  if (smartActionBtn) {
    smartActionBtn.onclick = () => {
      const values = refreshSummary();
      const missing = getMissingRequiredFields(values);
      if (missing.length) {
        const first = missing[0];
        const stepId = getFieldStepId(first.name);
        activateStep(stepId);
        const input = form.querySelector(`[name="${first.name}"]`);
        if (input && typeof input.focus === "function") input.focus();
        showMessage?.(`Focus moved to ${first.label}.`);
        return;
      }

      if (saveBackendBtn && !saveBackendBtn.disabled) {
        saveBackendBtn.click();
      }
    };
  }

  activateStep(STEP_DEFINITIONS[0].id);
}

export const setupRoute = {
  id: "setup",
  meta: {
    eyebrow: "Start",
    title: "Setup Wizard",
    description: "Complete project configuration through guided steps with missing-field visibility and AI drafting support."
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

    const projectName = state.context.currentProject || overviewData.project_name || "";
    const draft = loadSetupDraft(projectName);
    const values = { ...buildSetupValues(state), ...(draft || {}) };

    const readinessScore = readinessDashboard.readiness_score ?? overviewData.readiness_score ?? 0;
    const readinessStatus = readinessDashboard.readiness_status || overviewData.readiness_status || "needs_work";
    const missingAssets = getMissingAssetLabels(assets);
    const missingConnectors = asArray(integrations.readiness?.missing);
    const criticalGaps = asArray(readinessDashboard.priorities?.critical);
    const missingFields = getMissingRequiredFields(values);
    const completionPercent = getCompletionPercent(values);
    const wizardStatus = getWizardReadinessStatus(values, readinessScore, readinessStatus);
    const completedRequired = REQUIRED_FIELDS.length - missingFields.length;
    const failedCount = asArray(integrations.readiness?.failed).length;
    const needsAttentionCount = missingFields.length + missingAssets.length + missingConnectors.length + criticalGaps.length;
    const nextActionText = getNextSetupActionText(missingFields, missingAssets, missingConnectors);
    const brandStatus = getSetupBrandStatus(values);
    const localizationStatus = getSetupLocalizationStatus(values);

    const root = $("setupRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="setup-wizard-shell">
        <section class="card setup-wizard-header">
          <div class="setup-wizard-header-top">
            <div>
              <div class="setup-kicker">Guided Project Setup</div>
              <h3 class="setup-v2-title">${escapeHtml(projectName ? `${projectName} Wizard` : "Project Setup Wizard")}</h3>
              <p class="setup-v2-subtitle">Move step by step through your project baseline and close launch-critical gaps without information overload.</p>
            </div>
            <div class="setup-v2-toolbar">
              <button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save Setup</button>
              <button id="setupSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
              <button id="setupResetDraftBtn" class="btn btn-ghost" type="button">Reset Draft</button>
            </div>
          </div>

          <div class="setup-wizard-progress-grid">
            <article class="setup-wizard-progress-card">
              <span class="data-label">Setup Progress</span>
              <strong id="setupCompletionPercent" class="setup-wizard-progress-value">${escapeHtml(String(completionPercent))}%</strong>
              <div class="setup-progress" aria-label="Setup completion">
                <div class="setup-progress-track">
                  <div id="setupCompletionBar" class="setup-progress-fill" style="width:${escapeHtml(String(completionPercent))}%"></div>
                </div>
              </div>
            </article>
            <article class="setup-wizard-progress-card">
              <span class="data-label">Missing Fields</span>
              <strong id="setupMissingCount" class="setup-wizard-progress-value">${escapeHtml(String(missingFields.length))}</strong>
              <span class="setup-helper">Required fields still incomplete.</span>
            </article>
            <article class="setup-wizard-progress-card">
              <span class="data-label">Project Readiness</span>
              <strong class="setup-wizard-progress-value">${escapeHtml(formatPercent(readinessScore))}</strong>
              <span id="setupReadinessBadge" class="card-badge ${wizardStatus === "Ready" ? "success" : "warning"}">${escapeHtml(wizardStatus)}</span>
            </article>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Page Power Summary</h3>
            <span class="card-badge neutral">Setup capabilities</span>
          </div>
          <div class="setup-v2-status-strip">
            <article class="setup-v2-stat">
              <span class="data-label">Setup Completion</span>
              <strong class="setup-v2-stat-value">${escapeHtml(String(completionPercent))}%</strong>
              <span class="setup-helper">Required baseline completion status.</span>
            </article>
            <article class="setup-v2-stat">
              <span class="data-label">Brand Profile</span>
              <strong class="setup-v2-stat-value">${escapeHtml(brandStatus)}</strong>
              <span class="setup-helper">Positioning and voice readiness.</span>
            </article>
            <article class="setup-v2-stat">
              <span class="data-label">Market Stack</span>
              <strong class="setup-v2-stat-value">${escapeHtml(localizationStatus)}</strong>
              <span class="setup-helper">Market, language, and currency setup.</span>
            </article>
            <article class="setup-v2-stat">
              <span class="data-label">Validation Checklist</span>
              <strong class="setup-v2-stat-value">${escapeHtml(String(completedRequired))}/${REQUIRED_FIELDS.length}</strong>
              <span class="setup-helper">Checklist used by readiness validation.</span>
            </article>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Current Status</h3>
            <span class="card-badge ${wizardStatus === "Ready" ? "success" : "warning"}">${escapeHtml(wizardStatus)}</span>
          </div>
          <div class="home-exec-status-grid">
            <article class="home-exec-status-card tone-${completionPercent >= 85 ? "success" : "warning"}">
              <span class="data-label">Ready</span>
              <strong>${escapeHtml(completionPercent >= 85 ? "Yes" : "Not yet")}</strong>
              <p>Setup baseline readiness state.</p>
            </article>
            <article class="home-exec-status-card tone-${missingFields.length ? "danger" : "success"}">
              <span class="data-label">Missing</span>
              <strong>${escapeHtml(String(missingFields.length))}</strong>
              <p>Required fields still empty.</p>
            </article>
            <article class="home-exec-status-card tone-${failedCount ? "danger" : "success"}">
              <span class="data-label">Failed</span>
              <strong>${escapeHtml(String(failedCount))}</strong>
              <p>Failed connector checks from integration readiness.</p>
            </article>
            <article class="home-exec-status-card tone-${needsAttentionCount ? "warning" : "success"}">
              <span class="data-label">Needs Attention</span>
              <strong>${escapeHtml(String(needsAttentionCount))}</strong>
              <p>Open fields, assets, connectors, and critical gaps.</p>
            </article>
            <article class="home-exec-status-card tone-success">
              <span class="data-label">Completed</span>
              <strong>${escapeHtml(String(completedRequired))}</strong>
              <p>Required fields fully completed.</p>
            </article>
            <article class="home-exec-status-card tone-neutral">
              <span class="data-label">Next Step</span>
              <strong>${escapeHtml(missingFields.length ? "Complete fields" : "Continue flow")}</strong>
              <p>${escapeHtml(nextActionText)}</p>
            </article>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Main Work Area</h3>
            <span class="card-badge neutral">Guided setup wizard</span>
          </div>
          <p class="home-section-copy">Complete each guided section, validate readiness, then continue to Library.</p>
        </section>

        <div class="setup-wizard-layout">
          <aside class="setup-wizard-sidebar card">
            <h4>Guided Steps</h4>
            <p class="setup-helper">Complete one section at a time.</p>
            <div class="setup-wizard-step-list" role="tablist" aria-label="Setup wizard steps">
              ${STEP_DEFINITIONS.map((step, index) => {
                const status = getStepStatus(step, values);
                return `
                  <button class="setup-wizard-step ${index === 0 ? "is-active" : ""}" type="button" data-setup-step="${escapeHtml(step.id)}" role="tab" aria-current="${index === 0 ? "step" : "false"}">
                    <span class="setup-wizard-step-meta">Step ${index + 1}</span>
                    <span class="setup-wizard-step-title">${escapeHtml(step.title)}</span>
                    <span id="setupStepBadge-${escapeHtml(step.id)}" class="card-badge ${status.tone}">${escapeHtml(status.label)}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </aside>

          <section class="setup-wizard-form card">
            <div class="setup-wizard-form-head">
              <div>
                <span class="data-label">Current Step</span>
                <strong id="setupStepCounter" class="setup-wizard-step-counter">1/${STEP_DEFINITIONS.length}</strong>
              </div>
              <div class="setup-wizard-nav-actions">
                <button id="setupPrevStepBtn" class="btn btn-ghost" type="button">Previous</button>
                <button id="setupNextStepBtn" class="btn btn-secondary" type="button">Next</button>
              </div>
            </div>

            <form id="setupProjectForm" class="setup-v2-form">
              <section class="setup-wizard-step-panel is-active" data-setup-step-panel="business-basics">
                <h4>Business Basics</h4>
                <p class="home-section-copy">Project identity and foundational business metadata.</p>
                <div class="setup-form-grid setup-form-grid-2">
                  ${renderField({ name: "project_name", label: "Project name", value: values.project_name, helper: "Canonical project identifier.", placeholder: "e.g. Hairotic Men", escapeHtml, required: true })}
                  ${renderField({ name: "project_type", label: "Project type", value: values.project_type, helper: "Broad business model.", placeholder: "e.g. Ecommerce", escapeHtml, required: true })}
                  ${renderField({ name: "website_url", label: "Website URL", value: values.website_url, helper: "Primary destination.", placeholder: "https://example.com", type: "url", escapeHtml, required: true })}
                  ${renderField({ name: "launch_window", label: "Launch window", value: values.launch_window, helper: "Planned launch period.", placeholder: "Q3 2026", escapeHtml })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="brand-identity" hidden>
                <h4>Brand Identity</h4>
                <p class="home-section-copy">Core message and tone rules for consistent output.</p>
                <div class="setup-form-grid">
                  ${renderField({ name: "brand_name", label: "Brand / display name", value: values.brand_name, helper: "Public-facing brand name.", placeholder: "Brand name", escapeHtml })}
                  ${renderField({ name: "brand_promise", label: "Brand promise", value: values.brand_promise, helper: "What value this brand consistently delivers.", placeholder: "Promise in one sentence", escapeHtml, multiline: true, rows: 3, required: true })}
                  ${renderField({ name: "brand_voice", label: "Brand voice", value: values.brand_voice, helper: "Tone rules for AI and content teams.", placeholder: "Confident, clear, practical", escapeHtml, multiline: true, rows: 3 })}
                  ${renderField({ name: "offer_positioning", label: "Offer positioning", value: values.offer_positioning, helper: "How the offer should be framed.", placeholder: "Why this offer wins", escapeHtml, multiline: true, rows: 3 })}
                  ${renderField({ name: "visual_identity", label: "Visual identity", value: values.visual_identity, helper: "Visual guardrails and cues.", placeholder: "Photography style, color direction, layout cues", escapeHtml, multiline: true, rows: 3 })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="market-language" hidden>
                <h4>Market & Language</h4>
                <p class="home-section-copy">Localization defaults used by planning and publishing.</p>
                <div class="setup-form-grid setup-form-grid-3">
                  ${renderField({ name: "market", label: "Market", value: values.market, helper: "Primary region.", placeholder: "e.g. US", escapeHtml, required: true })}
                  ${renderField({ name: "language", label: "Language", value: values.language, helper: "Primary content language.", placeholder: "e.g. English", escapeHtml, required: true })}
                  ${renderField({ name: "currency", label: "Currency", value: values.currency, helper: "Commercial currency.", placeholder: "e.g. USD", escapeHtml, required: true })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="audience" hidden>
                <h4>Audience</h4>
                <p class="home-section-copy">Define audience profile and top pain points.</p>
                <div class="setup-form-grid">
                  ${renderField({ name: "audience_primary", label: "Primary audience", value: values.audience_primary, helper: "Main customer segment.", placeholder: "Who are we targeting?", escapeHtml, multiline: true, rows: 3, required: true })}
                  ${renderField({ name: "audience_problem", label: "Audience problem", value: values.audience_problem, helper: "What problem they want solved.", placeholder: "Core pain point", escapeHtml, multiline: true, rows: 3 })}
                  ${renderField({ name: "audience_geography", label: "Audience geography", value: values.audience_geography, helper: "Geography details for this audience.", placeholder: "Countries or regions", escapeHtml })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="goals" hidden>
                <h4>Goals</h4>
                <p class="home-section-copy">Business outcomes this project should drive.</p>
                <div class="setup-form-grid">
                  ${renderField({ name: "primary_goal", label: "Primary goal", value: values.primary_goal, helper: "Main measurable objective.", placeholder: "Increase qualified sales", escapeHtml, multiline: true, rows: 3, required: true })}
                  ${renderField({ name: "secondary_goal", label: "Secondary goal", value: values.secondary_goal, helper: "Supporting objective.", placeholder: "Optional secondary outcome", escapeHtml, multiline: true, rows: 3 })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="competitors" hidden>
                <h4>Competitors</h4>
                <p class="home-section-copy">Benchmark competitors and your differentiator.</p>
                <div class="setup-form-grid">
                  ${renderField({ name: "competitors", label: "Competitors", value: values.competitors, helper: "Comma-separated list.", placeholder: "Competitor A, Competitor B", escapeHtml, multiline: true, rows: 3, required: true })}
                  ${renderField({ name: "differentiation", label: "Differentiation", value: values.differentiation, helper: "How this brand stands out.", placeholder: "Why customers choose us", escapeHtml, multiline: true, rows: 3 })}
                </div>
              </section>

              <section class="setup-wizard-step-panel" data-setup-step-panel="channels" hidden>
                <h4>Channels</h4>
                <p class="home-section-copy">Distribution channels and operator handoff notes.</p>
                <div class="setup-form-grid">
                  ${renderField({ name: "social_channels", label: "Channels", value: values.social_channels, helper: "Comma-separated channels (e.g. Instagram, Email).", placeholder: "instagram, facebook, email", escapeHtml, multiline: true, rows: 3, required: true })}
                  ${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}
                </div>
              </section>
            </form>
          </section>
        </div>

        <div class="setup-wizard-side-panels">
          <section class="card setup-wizard-missing-panel">
            <div class="card-head">
              <h4>Smart Next Action</h4>
              <span class="card-badge warning">Recommended</span>
            </div>
            <p class="home-section-copy">${escapeHtml(nextActionText)}</p>
            <div class="setup-wizard-ai-actions">
              <button id="setupSmartActionBtn" class="btn btn-primary" type="button">Do next action</button>
              <button id="setupValidateNowBtn" class="btn btn-secondary" type="button">Validate readiness</button>
            </div>
            <button id="setupContinueLibraryBtn" class="btn btn-ghost" type="button">Continue to Library</button>
          </section>

          <section class="card setup-wizard-missing-panel">
            <div class="card-head">
              <h4>Missing Information</h4>
              <button id="setupCompleteNowBtn" class="btn btn-secondary" type="button">Complete now</button>
            </div>
            <div id="setupMissingFields">
              ${renderIndicatorList(missingFields.map((field) => field.label), escapeHtml, "All required setup fields are complete.")}
            </div>
            <div class="setup-wizard-missing-divider"></div>
            <h5>System blockers</h5>
            <div id="setupSystemGaps">
              ${renderIndicatorList(
                [
                  ...missingConnectors.map((item) => `Connect ${item}`),
                  ...missingAssets.map((item) => `Provide ${item}`),
                  ...criticalGaps
                ],
                escapeHtml,
                "No operational blockers detected from readiness signals."
              )}
            </div>
          </section>

          <section class="card setup-wizard-ai-panel">
            <div class="card-head">
              <h4>Contextual AI Agent</h4>
              <span class="card-badge neutral">Draft mode</span>
            </div>
            <p class="home-section-copy">Generate instant setup drafts for positioning, audience, and tone, then apply only what you want.</p>
            <div class="setup-wizard-ai-list">
              <article class="setup-wizard-ai-item">
                <div>
                  <strong>Suggest positioning</strong>
                  <p id="setupAiPositioningText">${escapeHtml(buildPositioningSuggestion(values))}</p>
                </div>
                <button id="setupAiPositioningBtn" class="btn btn-ghost" type="button">Apply</button>
              </article>
              <article class="setup-wizard-ai-item">
                <div>
                  <strong>Suggest audience</strong>
                  <p id="setupAiAudienceText">${escapeHtml(buildAudienceSuggestion(values))}</p>
                </div>
                <button id="setupAiAudienceBtn" class="btn btn-ghost" type="button">Apply</button>
              </article>
              <article class="setup-wizard-ai-item">
                <div>
                  <strong>Suggest brand tone</strong>
                  <p id="setupAiToneText">${escapeHtml(buildToneSuggestion(values))}</p>
                </div>
                <button id="setupAiToneBtn" class="btn btn-ghost" type="button">Apply</button>
              </article>
            </div>
            <div class="setup-wizard-ai-actions">
              <button id="setupAiFillMissingBtn" class="btn btn-secondary" type="button">Fill missing fields draft</button>
              <button id="setupAiCommandBtn" class="btn btn-ghost" type="button">Open AI Command</button>
            </div>
          </section>
        </div>

        <details class="card setup-v2-details">
          <summary>
            <span>View details</span>
            <span class="card-badge neutral">Advanced</span>
          </summary>
          <div class="setup-v2-answers">
            <article class="setup-v2-answer-card">
              <h4>Setup diagnostics</h4>
              <p>Readiness score: ${escapeHtml(formatPercent(readinessScore))}</p>
              <p>Readiness status: ${escapeHtml(asString(readinessStatus) || "Unknown")}</p>
              <p>Critical gaps: ${escapeHtml(String(criticalGaps.length))}</p>
            </article>
            <article class="setup-v2-answer-card">
              <h4>Dependency diagnostics</h4>
              <p>Missing assets: ${escapeHtml(String(missingAssets.length))}</p>
              <p>Missing connectors: ${escapeHtml(String(missingConnectors.length))}</p>
              <p>Failed connectors: ${escapeHtml(String(failedCount))}</p>
            </article>
          </div>
        </details>
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
      readinessStatus,
      criticalGaps
    });
  }
};
