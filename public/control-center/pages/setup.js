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

const STEP_ICONS = {
  "business-basics": "🧩",
  "brand-identity": "🎯",
  "market-language": "🌍",
  audience: "👥",
  goals: "📈",
  competitors: "⚔️",
  channels: "📣"
};

const FIELD_IMPORTANCE_REASON = {
  project_name: "Used across routing, saves, and system context labels.",
  project_type: "Improves AI defaults and recommended workflow strategies.",
  website_url: "Needed for crawl/reference and destination-aware copy generation.",
  brand_promise: "Guides positioning quality and channel consistency.",
  market: "Controls localization and market-specific execution assumptions.",
  language: "Ensures content generation uses the correct language defaults.",
  currency: "Required for pricing context and paid/media planning outputs.",
  audience_primary: "Improves message relevance and audience-specific tactics.",
  primary_goal: "Aligns optimization priorities and readiness evaluation.",
  competitors: "Supports differentiation and benchmark-aware recommendations.",
  social_channels: "Defines where campaign and publishing workflows should execute."
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

function formatUpdatedAt(value) {
  if (!value) return "Not available";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function getAllSetupFieldNames() {
  const names = STEP_DEFINITIONS.flatMap((step) => step.fields);
  return Array.from(new Set(names));
}

function countCompleted(fields, values) {
  return fields.filter((name) => Boolean(asString(values[name]).trim())).length;
}

function getValidationSummary({ missingFields, readinessStatus, readinessScore, criticalGaps, failedCount }) {
  const normalizedReadiness = asString(readinessStatus).toLowerCase();
  const score = Number(readinessScore);
  const hasScoreWarning = Number.isFinite(score) && score < 85;
  const hasBlockers = missingFields.length > 0 || criticalGaps.length > 0 || failedCount > 0;

  if (!hasBlockers && !hasScoreWarning && normalizedReadiness === "strong") {
    return { tone: "success", label: "Validated" };
  }

  if (missingFields.length > 0 || criticalGaps.length > 0) {
    return { tone: "warning", label: "Needs review" };
  }

  return { tone: "neutral", label: "Partial" };
}

function getMissingFieldInsights(missingFields) {
  return missingFields.map((field) => ({
    name: field.name,
    label: field.label,
    reason: FIELD_IMPORTANCE_REASON[field.name] || "Required to improve setup quality and downstream reliability.",
    stepId: getFieldStepId(field.name)
  }));
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

function getRecommendedStep(values) {
  const scored = STEP_DEFINITIONS.map((step) => {
    const status = getStepStatus(step, values);
    const score = status.tone === "danger" ? 0 : status.tone === "warning" ? 1 : 2;
    return { step, status, score };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored[0]?.step || STEP_DEFINITIONS[0];
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
  const missingInsights = getMissingFieldInsights(missingFields);
  const completionPercent = getCompletionPercent(values);
  const allFields = getAllSetupFieldNames();
  const requiredNames = REQUIRED_FIELDS.map((field) => field.name);
  const optionalNames = allFields.filter((name) => !requiredNames.includes(name));
  const requiredCompleted = countCompleted(requiredNames, values);
  const optionalCompleted = countCompleted(optionalNames, values);

  const validationSummary = getValidationSummary({
    missingFields,
    readinessStatus,
    readinessScore,
    criticalGaps,
    failedCount: 0
  });
  const recommendedStep = getRecommendedStep(values);

  updateSetupFieldIndicators(form, values);

  const completionText = document.getElementById("setupCompletionPercent");
  if (completionText) completionText.textContent = `${completionPercent}%`;

  const completionTextWide = document.getElementById("setupCompletionPercentValue");
  if (completionTextWide) completionTextWide.textContent = `${completionPercent}%`;

  const requiredCompleteEl = document.getElementById("setupRequiredCompleted");
  if (requiredCompleteEl) requiredCompleteEl.textContent = String(requiredCompleted);

  const requiredTotalEl = document.getElementById("setupRequiredTotal");
  if (requiredTotalEl) requiredTotalEl.textContent = String(requiredNames.length);

  const optionalCompleteEl = document.getElementById("setupOptionalCompleted");
  if (optionalCompleteEl) optionalCompleteEl.textContent = String(optionalCompleted);

  const optionalTotalEl = document.getElementById("setupOptionalTotal");
  if (optionalTotalEl) optionalTotalEl.textContent = String(optionalNames.length);

  const completionBar = document.getElementById("setupCompletionBar");
  if (completionBar) {
    completionBar.style.width = `${completionPercent}%`;
    completionBar.classList.remove("is-low", "is-mid", "is-high");
    if (completionPercent < 45) {
      completionBar.classList.add("is-low");
    } else if (completionPercent < 80) {
      completionBar.classList.add("is-mid");
    } else {
      completionBar.classList.add("is-high");
    }
  }

  const missingCount = document.getElementById("setupMissingCount");
  if (missingCount) missingCount.textContent = String(missingFields.length);

  const readinessBadge = document.getElementById("setupReadinessBadge");
  if (readinessBadge) {
    const label = getWizardReadinessStatus(values, readinessScore, readinessStatus);
    readinessBadge.className = `card-badge ${label === "Ready" ? "success" : "warning"}`;
    readinessBadge.textContent = label;
  }

  const validationBadge = document.getElementById("setupValidationBadge");
  if (validationBadge) {
    validationBadge.className = `card-badge ${validationSummary.tone}`;
    validationBadge.textContent = validationSummary.label;
  }

  const missingList = document.getElementById("setupMissingFields");
  if (missingList) {
    missingList.innerHTML = renderIndicatorList(
      missingInsights.map((item) => `${item.label} - ${item.reason}`),
      escapeHtml,
      "All required setup fields are complete."
    );
  }

  const missingActionList = document.getElementById("setupMissingActions");
  if (missingActionList) {
    missingActionList.innerHTML = missingInsights.length
      ? `<div class="setup-smart-gap-list">${missingInsights.map((item) => `
          <article class="setup-smart-gap-item">
            <div>
              <h5>${escapeHtml(item.label)}</h5>
              <p>${escapeHtml(item.reason)}</p>
            </div>
            <button class="btn btn-ghost" type="button" data-setup-jump-field="${escapeHtml(item.name)}" data-setup-jump-step="${escapeHtml(item.stepId)}">Open field</button>
          </article>
        `).join("")}</div>`
      : `<div class="empty-box">No required field gaps detected.</div>`;
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
      if (input && typeof input.focus === "function") {
        input.focus();
        if (typeof input.scrollIntoView === "function") {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };
  }

  STEP_DEFINITIONS.forEach((step) => {
    const badge = document.getElementById(`setupStepBadge-${step.id}`);
    const button = form.querySelector(`[data-setup-step="${step.id}"]`);
    const statusNote = form.querySelector(`[data-setup-step-note="${step.id}"]`);
    const status = getStepStatus(step, values);
    if (badge) {
      badge.className = `card-badge ${status.tone}`;
      badge.textContent = status.label;
    }
    if (button) {
      button.classList.remove("is-problem", "is-warning", "is-ready", "is-recommended");
      if (status.tone === "danger") button.classList.add("is-problem");
      if (status.tone === "warning") button.classList.add("is-warning");
      if (status.tone === "success") button.classList.add("is-ready");
      if (recommendedStep.id === step.id) button.classList.add("is-recommended");
      button.title = `${step.description} Status: ${status.label}.`;
      button.setAttribute("data-step-tone", status.tone);
    }
    if (statusNote) {
      statusNote.className = `setup-smart-step-note tone-${status.tone}`;
      statusNote.textContent = status.tone === "danger"
        ? "Needs required data"
        : status.tone === "warning"
          ? "Partially complete"
          : "Looks good";
    }
  });

  const recommendedTitle = document.getElementById("setupRecommendedStepTitle");
  if (recommendedTitle) recommendedTitle.textContent = recommendedStep.title;

  const recommendedReason = document.getElementById("setupRecommendedStepReason");
  if (recommendedReason) recommendedReason.textContent = recommendedStep.description;

  const recommendedBtn = document.getElementById("setupRecommendedStepBtn");
  if (recommendedBtn) {
    recommendedBtn.setAttribute("data-setup-open-step", recommendedStep.id);
    recommendedBtn.textContent = `Open ${recommendedStep.title}`;
  }

  const continueLibraryBtn = document.getElementById("setupContinueLibraryBtn");
  const continueIntegrationsBtn = document.getElementById("setupContinueIntegrationsBtn");
  const missingFieldCount = missingFields.length;
  const hasMissing = missingFieldCount > 0;
  const warningText = `${missingFieldCount} required field${missingFieldCount === 1 ? "" : "s"} still missing`;

  if (continueLibraryBtn) {
    continueLibraryBtn.disabled = false;
    continueLibraryBtn.textContent = hasMissing ? `Continue to Library (${warningText})` : "Continue to Library";
    continueLibraryBtn.title = hasMissing
      ? "You can continue, but setup readiness will remain incomplete until required fields are complete."
      : "Proceed to Library.";
  }

  if (continueIntegrationsBtn) {
    continueIntegrationsBtn.disabled = false;
    continueIntegrationsBtn.textContent = hasMissing ? `Continue to Integrations (${warningText})` : "Continue to Integrations";
    continueIntegrationsBtn.title = hasMissing
      ? "You can continue, but setup readiness will remain incomplete until required fields are complete."
      : "Proceed to Integrations.";
  }

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
  const stepActionButtons = Array.from(document.querySelectorAll("[data-setup-open-step]"));
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

  stepActionButtons.forEach((button) => {
    button.onclick = () => {
      const stepId = button.getAttribute("data-setup-open-step") || STEP_DEFINITIONS[0].id;
      activateStep(stepId);
      const panel = document.querySelector(`[data-setup-step-panel="${stepId}"]`);
      if (panel && typeof panel.scrollIntoView === "function") {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
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

  let draftAutoSaveTimer = null;

  const refreshAndPersistDraft = () => {
    const values = refreshSummary();

    if (draftAutoSaveTimer) {
      clearTimeout(draftAutoSaveTimer);
    }

    draftAutoSaveTimer = setTimeout(() => {
      saveSetupDraft(projectName, values);
    }, 250);

    return values;
  };

  form.oninput = refreshAndPersistDraft;
  form.onchange = refreshAndPersistDraft;

  const keepSetupFieldFocused = (event) => {
    const field = event.target?.closest?.(".setup-input, .setup-textarea");
    if (!field) return;

    event.stopPropagation();

    window.setTimeout(() => {
      if (document.activeElement !== field && typeof field.focus === "function") {
        field.focus();
      }
    }, 0);
  };

  form.addEventListener("click", keepSetupFieldFocused);
  form.addEventListener("mouseup", keepSetupFieldFocused);
  form.addEventListener("pointerup", keepSetupFieldFocused);

  const setupRoot = $("setupRoot") || form.closest(".setup-wizard-shell") || form;

  setupRoot.onclick = (event) => {
    const jumpBtn = event.target.closest("[data-setup-jump-field]");
    if (!jumpBtn) return;

    event.preventDefault();

    const fieldName = jumpBtn.getAttribute("data-setup-jump-field") || "";
    const stepId = jumpBtn.getAttribute("data-setup-jump-step") || getFieldStepId(fieldName);

    if (stepId) {
      activateStep(stepId);
    }

    window.setTimeout(() => {
      const input = form.querySelector(`[name="${fieldName}"]`);

      if (input && typeof input.focus === "function") {
        input.focus();

        if (typeof input.scrollIntoView === "function") {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 0);
  };

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
      const previousLabel = saveBackendBtn.textContent;

      saveBackendBtn.disabled = true;
      saveBackendBtn.textContent = "Saving...";
      showMessage?.(`Saving setup for ${draftKeyName}...`);

      try {
        await saveProjectSetup?.(projectName, payload);
        clearSetupDraft(projectName);
        await reloadProjectData?.(projectName);

        const renameWarning =
          requestedProjectName && requestedProjectName !== asString(projectName).trim().toLowerCase()
            ? " Project name remains local-only until project rename support exists."
            : "";

        showMessage?.(`Setup saved for ${draftKeyName}.${renameWarning}`);
        saveBackendBtn.textContent = "Saved";
      } catch (error) {
        showError?.(error.message || `Failed to save Setup changes for ${draftKeyName}.`);
      } finally {
        saveBackendBtn.disabled = false;
        window.setTimeout(() => {
          if (saveBackendBtn && saveBackendBtn.textContent !== previousLabel) {
            saveBackendBtn.textContent = previousLabel;
          }
        }, 1400);
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

  const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
  if (continueIntegrationsBtn) {
    continueIntegrationsBtn.onclick = () => {
      navigateTo("integrations");
    };
  }

  const reviewReadinessBtn = $("setupReviewReadinessBtn");
  if (reviewReadinessBtn) {
    reviewReadinessBtn.onclick = () => {
      navigateTo("home");
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
        if (input && typeof input.focus === "function") {
          input.focus();
          if (typeof input.scrollIntoView === "function") {
            input.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
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
    title: "Smart Guided Setup",
    description: "Build a complete, validated project source of truth before moving to assets, integrations, and launch execution."
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
    const missingFieldInsights = getMissingFieldInsights(missingFields);
    const completionPercent = getCompletionPercent(values);
    const wizardStatus = getWizardReadinessStatus(values, readinessScore, readinessStatus);
    const failedCount = asArray(integrations.readiness?.failed).length;
    const validationSummary = getValidationSummary({
      missingFields,
      readinessStatus,
      readinessScore,
      criticalGaps,
      failedCount
    });
    const allFields = getAllSetupFieldNames();
    const requiredNames = REQUIRED_FIELDS.map((field) => field.name);
    const optionalNames = allFields.filter((name) => !requiredNames.includes(name));
    const requiredCompleted = countCompleted(requiredNames, values);
    const optionalCompleted = countCompleted(optionalNames, values);
    const lastSavedAt = formatUpdatedAt(
      readinessDashboard.updated_at ||
      readinessDashboard.last_saved_at ||
      overviewData.updated_at ||
      overviewData.last_updated_at
    );

    const root = $("setupRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="setup-wizard-shell">
        <section class="card setup-smart-overview">
          <div class="setup-wizard-header-top">
            <div>
              <div class="setup-kicker">Setup Completion Overview</div>
              <h3 class="setup-v2-title">Project Source-of-Truth Status</h3>
              <p class="setup-v2-subtitle">Track completion, validation quality, and what to resolve next before continuing.</p>
            </div>
            <div class="setup-v2-toolbar">
              <button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save Setup</button>
              <button id="setupSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
              <button id="setupResetDraftBtn" class="btn btn-ghost" type="button">Reset Draft</button>
            </div>
          </div>

          <div class="setup-smart-overview-grid">
            <article class="setup-smart-overview-card">
              <span class="data-label">Completion</span>
              <strong id="setupCompletionPercentValue" class="setup-wizard-progress-value">${escapeHtml(String(completionPercent))}%</strong>
              <div class="setup-progress" aria-label="Setup completion">
                <div class="setup-progress-track">
                  <div id="setupCompletionBar" class="setup-progress-fill" style="width:${escapeHtml(String(completionPercent))}%"></div>
                </div>
              </div>
            </article>
            <article class="setup-smart-overview-card">
              <span class="data-label">Required Completed</span>
              <strong><span id="setupRequiredCompleted">${escapeHtml(String(requiredCompleted))}</span>/<span id="setupRequiredTotal">${escapeHtml(String(requiredNames.length))}</span></strong>
              <span class="setup-helper"><span id="setupMissingCount">${escapeHtml(String(missingFields.length))}</span> required fields missing</span>
            </article>
            <article class="setup-smart-overview-card">
              <span class="data-label">Optional Completed</span>
              <strong><span id="setupOptionalCompleted">${escapeHtml(String(optionalCompleted))}</span>/<span id="setupOptionalTotal">${escapeHtml(String(optionalNames.length))}</span></strong>
              <span class="setup-helper">Optional setup context quality</span>
            </article>
            <article class="setup-smart-overview-card">
              <span class="data-label">Validation Status</span>
              <strong>${escapeHtml(formatPercent(readinessScore))}</strong>
              <span id="setupValidationBadge" class="card-badge ${escapeHtml(validationSummary.tone)}">${escapeHtml(validationSummary.label)}</span>
            </article>
            <article class="setup-smart-overview-card">
              <span class="data-label">Last Saved / Updated</span>
              <strong>${escapeHtml(lastSavedAt)}</strong>
              <span id="setupReadinessBadge" class="card-badge ${wizardStatus === "Ready" ? "success" : "warning"}">${escapeHtml(wizardStatus)}</span>
            </article>
          </div>
        </section>

        <div class="setup-wizard-layout">
          <aside class="setup-wizard-sidebar card setup-smart-steps-panel">
            <h4>Guided Setup Steps</h4>
            <p class="setup-helper">Each step shows status, purpose, and a direct action.</p>
            <article class="setup-smart-recommended-step">
              <span class="data-label">Recommended Step</span>
              <strong id="setupRecommendedStepTitle">${escapeHtml(getRecommendedStep(values).title)}</strong>
              <p id="setupRecommendedStepReason">${escapeHtml(getRecommendedStep(values).description)}</p>
              <button id="setupRecommendedStepBtn" class="btn btn-secondary" type="button" data-setup-open-step="${escapeHtml(getRecommendedStep(values).id)}">Open ${escapeHtml(getRecommendedStep(values).title)}</button>
            </article>
            <div class="setup-smart-step-list" role="tablist" aria-label="Setup wizard steps">
              ${STEP_DEFINITIONS.map((step, index) => {
                const status = getStepStatus(step, values);
                const icon = STEP_ICONS[step.id] || "•";
                return `
                  <article class="setup-smart-step-item">
                    <button class="setup-wizard-step ${index === 0 ? "is-active" : ""}" type="button" data-setup-step="${escapeHtml(step.id)}" role="tab" aria-current="${index === 0 ? "step" : "false"}" title="${escapeHtml(step.description)}">
                      <span class="setup-wizard-step-meta">Step ${index + 1}</span>
                      <span class="setup-wizard-step-title"><span class="setup-step-icon" aria-hidden="true">${escapeHtml(icon)}</span>${escapeHtml(step.title)}</span>
                      <span id="setupStepBadge-${escapeHtml(step.id)}" class="card-badge ${status.tone}">${escapeHtml(status.label)}</span>
                    </button>
                    <p>${escapeHtml(step.description)}</p>
                    <div class="setup-smart-step-note tone-${escapeHtml(status.tone)}" data-setup-step-note="${escapeHtml(step.id)}">${status.tone === "danger" ? "Needs required data" : status.tone === "warning" ? "Partially complete" : "Looks good"}</div>
                    <button class="btn btn-ghost" type="button" data-setup-open-step="${escapeHtml(step.id)}">Open Step</button>
                  </article>
                `;
              }).join("")}
            </div>
          </aside>

          <section class="setup-wizard-form card setup-smart-form-panel">
            <div class="setup-wizard-form-head">
              <div>
                <span class="data-label">Main Setup Form</span>
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
          <section class="card setup-wizard-missing-panel setup-smart-gaps-panel">
            <div class="card-head">
              <h4>Missing Information / Readiness Gaps</h4>
              <button id="setupCompleteNowBtn" class="btn btn-secondary" type="button">Complete now</button>
            </div>
            <div id="setupMissingActions">
              ${missingFieldInsights.length
                ? `<div class="setup-smart-gap-list">${missingFieldInsights.map((item) => `
                    <article class="setup-smart-gap-item">
                      <div>
                        <h5>${escapeHtml(item.label)}</h5>
                        <p>${escapeHtml(item.reason)}</p>
                      </div>
                      <button class="btn btn-ghost" type="button" data-setup-jump-field="${escapeHtml(item.name)}" data-setup-jump-step="${escapeHtml(item.stepId)}">Fix now</button>
                    </article>
                  `).join("")}</div>`
                : `<div class="empty-box">All required setup fields are complete.</div>`
              }
            </div>
            <div id="setupMissingFields">
              ${renderIndicatorList(missingFieldInsights.map((item) => `${item.label} - ${item.reason}`), escapeHtml, "All required setup fields are complete.")}
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

          <section class="card setup-smart-validation-panel">
            <div class="card-head">
              <h4>Validation & Diagnostics</h4>
              <button id="setupValidateNowBtn" class="btn btn-ghost" type="button">Validate now</button>
            </div>
            <div class="setup-smart-diagnostics-grid">
              <article class="setup-smart-diagnostic-card">
                <span class="data-label">Validation status</span>
                <strong>${escapeHtml(validationSummary.label)}</strong>
                <p>Readiness status: ${escapeHtml(asString(readinessStatus) || "Unknown")}</p>
              </article>
              <article class="setup-smart-diagnostic-card">
                <span class="data-label">Warnings</span>
                <strong>${escapeHtml(String(criticalGaps.length))}</strong>
                <p>Critical readiness gaps reported by diagnostics.</p>
              </article>
              <article class="setup-smart-diagnostic-card">
                <span class="data-label">Integration blockers</span>
                <strong>${escapeHtml(String(missingConnectors.length + failedCount))}</strong>
                <p>Missing or failed connector checks.</p>
              </article>
            </div>
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
          </section>
        </div>

        <section class="card setup-smart-handoff-panel">
          <div class="card-head">
            <h4>Continue / Handoff</h4>
            <button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Run smart action</button>
          </div>
          <div class="setup-smart-handoff-actions">
            <button id="setupContinueLibraryBtn" class="btn btn-secondary" type="button">Continue to Library</button>
            <button id="setupContinueIntegrationsBtn" class="btn btn-secondary" type="button">Continue to Integrations</button>
            <button id="setupReviewReadinessBtn" class="btn btn-ghost" type="button">Review readiness</button>
            <button id="setupSaveBackendBtnBottom" class="btn btn-primary" type="button">Save setup</button>
          </div>
        </section>

        <section class="card setup-smart-ai-tools" hidden>
          <button id="setupAiPositioningBtn" class="btn btn-ghost" type="button">AI Positioning</button>
          <button id="setupAiAudienceBtn" class="btn btn-ghost" type="button">AI Audience</button>
          <button id="setupAiToneBtn" class="btn btn-ghost" type="button">AI Tone</button>
          <button id="setupAiFillMissingBtn" class="btn btn-ghost" type="button">AI Fill Missing</button>
          <button id="setupAiCommandBtn" class="btn btn-ghost" type="button">Open AI Command</button>
          <p id="setupAiPositioningText"></p>
          <p id="setupAiAudienceText"></p>
          <p id="setupAiToneText"></p>
        </section>
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

    const saveBottomBtn = $("setupSaveBackendBtnBottom");
    const saveTopBtn = $("setupSaveBackendBtn");
    if (saveBottomBtn && saveTopBtn) {
      saveBottomBtn.onclick = () => saveTopBtn.click();
    }
  }
};
