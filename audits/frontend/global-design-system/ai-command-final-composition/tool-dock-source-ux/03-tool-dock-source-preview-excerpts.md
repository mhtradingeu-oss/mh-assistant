# 03 — Current Tool Dock Source Preview Excerpts

    toolId,
    teamMode,
    sourceType,
    outputType
  });
  setSharedAiDrawerReturn(projectName || "__default__", payload);
  // Also set library source bridge context if needed (existing logic)
  // ...existing bridge logic...
}

function formatSharedAiSource(source = {}) {
  if (!source || !source.name) return null;
  const name = source.name || "(no name)";
  const type = source.asset_type || source.type || "asset";
  const path = source.file_path || source.filename || source.fileName || "";
  return { name, type, path };
}

function getSelectedLibrarySource(projectName = "") {
  return getSharedAiSource(projectName) || getSharedAiSource("__default__");
}

function truncatePromptText(value = "", maxLength = 900) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function compactSourceReference(value = "", maxLength = 120) {
  const text = String(value || "").trim();
  if (!text || text.length <= maxLength) return text;
  const parts = text.split(/[\/]/).filter(Boolean);
  const tail = parts.slice(-2).join("/");
  if (tail && tail.length < maxLength) return `.../${tail}`;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

function buildSelectedSourceContextBlock(projectName = "") {
  const source = getSelectedLibrarySource(projectName);
  if (!source?.name) return "";

  const name = source.name || source.filename || source.fileName || "Selected Library source";
  const type = source.asset_type || source.type || source.source_type || "Library asset";
  const sourceId = source.asset_id || source.id || source.mutation_id || "";
  const path = source.file_path || source.path || source.filename || source.fileName || "";
  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  const sourceOfTruth = typeof source.source_of_truth === "boolean"
    ? (source.source_of_truth ? "yes" : "no")
    : (source.source_of_truth || "");

  const lines = [
    "Selected Library source context:",
    `- Source name: ${name}.`,
    `- Source type: ${type}.`
  ];

  if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  if (preview) lines.push(`- Text preview: ${preview}`);

  lines.push("Use this Library source as trusted context. Do not add unsupported claims.");
  return lines.join("\n");
}

function setDrawerSourceWarning(drawer, message = "") {
  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  if (!warning) return;
  const hasMessage = Boolean(message);
  warning.hidden = !hasMessage;
  warning.textContent = message;
}

function sourceMetadataNeedsLibrarySource(rawValue = "") {
  return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
}

function isDrawerSourceRequired(drawer) {
  return drawer?.dataset?.sourceRequired === "true";
}

function validateDrawerSourceRequirement(drawer, projectName = "") {
  if (!isDrawerSourceRequired(drawer)) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  const source = getSelectedLibrarySource(projectName);
  if (source?.name) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  setDrawerSourceWarning(
    drawer,
    "This tool needs a source. Choose one from Library before continuing."
  );
  return false;
}

export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  if (!drawer) return;
  const source = getSelectedLibrarySource(projectName);
  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");

  if (!source || !source.name) {
    if (selectedNode) {
      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No AI source selected yet.</span>`;
    }
    if (sourceInput && !sourceInput.value) {
      sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
    }
    validateDrawerSourceRequirement(drawer, projectName);
    return;
  }

  // Render compact selected source card
  const { name, type, path } = formatSharedAiSource(source);
  if (selectedNode) {
    selectedNode.innerHTML = `
      <div class=\"mhos-tool-drawer-source-card\">
        <div class=\"mhos-tool-drawer-source-eyebrow\">AI Source</div>
        <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
        <div class=\"mhos-tool-drawer-source-actions\">
          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change source</button>
          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove source</button>
        </div>
      </div>
    `;
  }

  // Set placeholder for Source Details if empty
  if (sourceInput && !sourceInput.value) {
    sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
  }

  // Set select value if possible
  if (sourceSelect) {
    const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
      const value = `${option.value || ""} ${option.textContent || ""}`;
      return /library|source|asset|brand|product/i.test(value);
    });
    if (libraryOption) sourceSelect.value = libraryOption.value;
  }

  // Attach actions
  if (selectedNode) {
    const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
    if (changeBtn) {
      changeBtn.onclick = () => {
        drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
      };
    }
    const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
    if (removeBtn) {
      removeBtn.onclick = () => {
        clearSharedAiSource(projectName || "__default__");
        clearSharedAiSource("__default__");
        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No AI source selected yet.</span>`;
        if (sourceInput) sourceInput.placeholder = "Optional: add usage notes, audience, angle, or claims to avoid...";
        if (sourceSelect) sourceSelect.value = "";
        validateDrawerSourceRequirement(drawer, projectName);
      };
    }
  }

  validateDrawerSourceRequirement(drawer, projectName);
}
const BASE_TOOL_DOCK_TOOLS = [
  {
    id: "rewrite",
    icon: "✍",
    label: "Rewrite",
    badge: "Text",
    template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  },
  {

              </label>
              <label>
                <span>Tone</span>
                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-tone>
                  <option value="">Auto / brand tone</option>
                  <option value="Professional">Professional</option>
                  <option value="Premium">Premium</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Simple and clear">Simple and clear</option>
                </select>
              </label>
            </div>

            <label class="mhos-tool-drawer-field">
              <span>Source details</span>
              <input
                class="mhos-tool-drawer-input"
                data-aicmd-tool-drawer-source-details
                type="text"
                placeholder="Example: use current chat only, Brand Profile folder, product file, legal docs..."
              />
            </label>

            <label class="mhos-tool-drawer-field">
              <span>Extra brief</span>
              <textarea
                class="mhos-tool-drawer-textarea"
                data-aicmd-tool-drawer-extra-brief
                rows="3"
                placeholder="Add audience, goal, keywords, offer, product, or any must-use information..."
              ></textarea>
            </label>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Safety</span>
            <div class="mhos-tool-drawer-safety" data-aicmd-tool-drawer-safety>Review only</div>
          </div>
        </div>

        <div class="mhos-tool-drawer-summary">
          <span>Setup summary</span>
          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
        </div>

        <div class="mhos-tool-drawer-note">
          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
        </div>

        <div class="mhos-tool-drawer-actions">
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change source</button>
          <button class="btn btn-primary" type="button" data-aicmd-tool-drawer-use>Use in Composer</button>
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-close>Cancel</button>
        </div>
      </section>
    </aside>
  `;
}

export function renderAiToolDrawerShell({ escapeHtml } = {}) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");
  return renderSmartToolDrawerShell(safe);
}

export function renderAiToolDock({ projectName = "", specialistId = "", teamMode = "solo", escapeHtml }) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");
  const tools = getDockTools({ specialistId, teamMode });
  const label = teamMode === "team" ? "Team guided tools" : "Specialist guided tools";

  return `
    <section class="mhos-tool-dock aicmd-tool-dock" aria-label="${safe(label)}">
      <div class="mhos-tool-dock-head">
        <span class="mhos-tool-dock-kicker">${safe(label)}</span>
        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
      </div>
      <div class="mhos-tool-dock-list">
        ${tools.map((tool) => `
          <button
            type="button"
            class="mhos-tool-dock-item"
            data-aicmd-tool-dock="${safe(tool.id)}"
