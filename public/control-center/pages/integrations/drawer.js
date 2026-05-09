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
