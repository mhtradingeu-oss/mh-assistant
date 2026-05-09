/*
  Integrations OS Drawer

  Drawer render helpers only.
  No DOM listeners.
  No fetch ownership.
  No global mutations.
*/

import {
  asString
} from "./utils.js";

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderIntegrationField(integrationId, field = {}, value = "", options = {}) {
  const type = field.type || "text";
  const invalidClass = options.invalid ? " is-invalid" : "";

  return `
    <div class="integration-field-group${invalidClass}" data-integration-field-group="${esc(integrationId)}:${esc(field.key)}">
      <div class="integration-field-head">
        <label class="setup-label" for="integration-${esc(integrationId)}-${esc(field.key)}">${esc(field.label)}</label>
        ${options.suggestion ? `<span class="integration-field-chip">Suggested from Setup</span>` : ""}
      </div>
      <input
        id="integration-${esc(integrationId)}-${esc(field.key)}"
        class="setup-input${invalidClass}"
        type="${esc(type)}"
        value="${esc(value)}"
        placeholder="${esc(field.placeholder || "")}"
        autocomplete="${type === "password" ? "new-password" : "off"}"
        aria-invalid="${options.invalid ? "true" : "false"}"
        data-integration-field="${esc(integrationId)}"
        data-field-key="${esc(field.key)}"
      />
      ${options.invalid ? `<div class="integration-field-error">${esc(options.invalidMessage || "Complete this field before continuing.")}</div>` : ""}
      <div class="setup-helper" data-integration-field-helper="${esc(integrationId)}:${esc(field.key)}"></div>
    </div>
  `;
}

export function renderDrawerProgress(card = {}) {
  const missingRequired = Array.isArray(card.missingRequired) ? card.missingRequired : [];
  const stepOneComplete = missingRequired.length === 0;
  const stepTwoComplete = Boolean(card.lastTest) || card.statusLabel === "Connected";
  const stepThreeComplete = card.statusLabel === "Connected";

  const steps = [
    {
      label: "Step 1: Fill required fields",
      state: stepOneComplete ? "complete" : "active",
      meta: stepOneComplete
        ? "Ready for validation."
        : `${missingRequired.length} required field${missingRequired.length === 1 ? "" : "s"} remaining.`
    },
    {
      label: "Step 2: Test connection",
      state: stepTwoComplete ? "complete" : stepOneComplete ? "active" : "pending",
      meta: stepTwoComplete
        ? "Connection test checkpoint recorded."
        : "Run a connection test before activation."
    },
    {
      label: "Step 3: Activate",
      state: stepThreeComplete ? "complete" : stepOneComplete ? "active" : "pending",
      meta: stepThreeComplete
        ? "Provider is active in the Control Center."
        : "Activate once fields and test are complete."
    }
  ];

  return `
    <div class="integration-drawer-progress">
      ${steps.map((step) => `
        <div class="integration-progress-step is-${esc(step.state)}">
          <strong>${esc(step.label)}</strong>
          <span>${esc(step.meta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}
