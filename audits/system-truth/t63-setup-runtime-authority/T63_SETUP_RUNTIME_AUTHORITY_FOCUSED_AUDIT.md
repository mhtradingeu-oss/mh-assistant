# T63 — Setup Runtime Authority Focused Audit

## Status
Audit-only. No production files changed.

## Scope
Focused runtime authority review of `public/control-center/pages/setup.js` after T61 ranked Setup as the next highest remaining open frontend file.

## File Summary
- File: `public/control-center/pages/setup.js`
- Lines: 1787
- Render writes: 3
- Event bindings: 28
- Save/write-like signals: 95
- Backend/API/context signals: 43
- Confirmation signals: 0
- Storage signals: 6
- Focus workaround signals: 24
- Navigation signals: 10
- Disabled/future/read-only signals: 17
- Risky terms: 31

## Initial Risk Notes
- Setup contains save/write-like signals. These must be classified as expected project setup save flow or risky mutation.
- No confirmation dialogs found. This may be acceptable for normal setup save if the save is explicit and non-destructive.
- Browser storage exists. Classify whether it is draft UX only or durable authority.
- Focus/pointer workaround exists. Check whether it is still necessary and whether it affects normal text selection or copy/paste.

## Render Writes
- L746: `missingActionList.innerHTML = missingInsights.length`
- L761: `blockerList.innerHTML = renderIndicatorList(`
- L1425: `root.innerHTML = \``

## Event Bindings
- L775: `completeNowBtn.onclick = () => {`
- L914: `button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);`
- L918: `button.onclick = () => {`
- L928: `prevBtn.onclick = () => {`
- L936: `nextBtn.onclick = () => {`
- L995: `form.oninput = refreshAndPersistDraft;`
- L996: `form.onchange = refreshAndPersistDraft;`
- L1012: `// The old interaction model caused typing/click instability.`
- L1016: `setupRoot.onclick = (event) => {`
- L1045: `saveDraftBtn.onclick = () => {`
- L1052: `saveBackendBtn.onclick = async () => {`
- L1094: `resetBtn.onclick = () => {`
- L1105: `aiPositioningBtn.onclick = () => {`
- L1118: `aiAudienceBtn.onclick = () => {`
- L1131: `aiToneBtn.onclick = () => {`
- L1144: `aiFillBtn.onclick = () => {`
- L1172: `aiCommandBtn.onclick = () => {`
- L1186: `validateNowBtn.onclick = () => {`
- L1189: `target.click();`
- L1196: `continueLibraryBtn.onclick = () => {`
- L1203: `continueIntegrationsBtn.onclick = () => {`
- L1210: `continueCampaignBtn.onclick = () => {`
- L1217: `reviewMissingBtn.onclick = () => {`
- L1237: `reviewReadinessBtn.onclick = () => {`
- L1244: `smartActionBtn.onclick = () => {`
- L1263: `saveBackendBtn.click();`
- L1740: `templateApplyBtn.onclick = async () => {`
- L1783: `saveBottomBtn.onclick = () => saveTopBtn.click();`

## Save / Write-like Signals
- L3: `import { patchState } from "../state.js";`
- L75: `project_name: "Used across routing, saves, and system context labels.",`
- L81: `currency: "Required for pricing context and paid/media planning outputs.",`
- L92: `brand_promise: "Defines the core value AI should protect in every output.",`
- L94: `language: "Sets the default language for content, AI suggestions, and campaign outputs.",`
- L214: `function saveSetupDraft(projectName, data) {`
- L416: `return \`Complete ${missingFields.length} required setup field${missingFields.length === 1 ? "" : "s"}, then use Save Setup for backend persistence.\`;`
- L427: `return "Save Setup to persist the foundation, then continue to the owning workspace.";`
- L464: `? \`<textarea id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>\``
- L465: `: \`<input id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">\``
- L516: `function buildSetupPersistencePayload(values) {`
- L600: `if (audience) audience.textContent = compactListText([buildAudienceSuggestion(values)], "Identify missing launch inputs for audience targeting.");`
- L642: `// Compute status variables for statusMap`
- L780: `const input = form.querySelector(\`[name="${first.name}"]\`);`
- L781: `if (input && typeof input.focus === "function") {`
- L782: `input.focus();`
- L868: `saveProjectSetup,`
- L959: `const saveLocal = (message) => {`
- L961: `const saved = saveSetupDraft(projectName, values);`
- L963: `showMessage(saved ? message : "Local draft storage is not available in this browser.");`
- L967: `let draftAutoSaveTimer = null;`
- L969: `const refreshAndPersistDraft = () => {`
- L972: `patchState(`
- L984: `if (draftAutoSaveTimer) {`
- L985: `clearTimeout(draftAutoSaveTimer);`
- L988: `draftAutoSaveTimer = setTimeout(() => {`
- L989: `saveSetupDraft(projectName, values);`
- L995: `form.oninput = refreshAndPersistDraft;`
- L996: `form.onchange = refreshAndPersistDraft;`
- L999: `const field = event.target?.closest?.(".setup-input, .setup-textarea");`
- L1030: `const input = form.querySelector(\`[name="${fieldName}"]\`);`
- L1032: `if (input && typeof input.focus === "function") {`
- L1033: `input.focus();`
- L1043: `const saveDraftBtn = $("setupSaveDraftBtn");`
- L1044: `if (saveDraftBtn) {`
- L1045: `saveDraftBtn.onclick = () => {`
- L1046: `saveLocal(\`Local setup draft saved for ${draftKeyName}. Use Save Setup to persist backend project foundation data.\`);`
- L1050: `const saveBackendBtn = $("setupSaveBackendBtn");`
- L1051: `if (saveBackendBtn) {`
- L1052: `saveBackendBtn.onclick = async () => {`
- L1060: `const payload = buildSetupPersistencePayload(values);`
- L1061: `const previousLabel = saveBackendBtn.textContent;`
- L1063: `saveBackendBtn.disabled = true;`
- L1064: `saveBackendBtn.textContent = "Saving Setup...";`
- L1068: `await saveProjectSetup?.(projectName, payload);`
- L1077: `showMessage?.(\`Backend setup foundation saved for ${draftKeyName}.${renameWarning}\`);`
- L1078: `saveBackendBtn.textContent = "Saved";`
- L1080: `showError?.(error.message || \`Failed to save Setup changes for ${draftKeyName}.\`);`
- L1082: `saveBackendBtn.disabled = false;`
- L1084: `if (saveBackendBtn && saveBackendBtn.textContent !== previousLabel) {`
- L1085: `saveBackendBtn.textContent = previousLabel;`
- L1112: `showMessage?.("Local AI suggestion applied to Offer positioning. Use Save Setup to persist it.");`
- L1125: `showMessage?.("Local AI suggestion applied to Primary audience. Use Save Setup to persist it.");`
- L1138: `showMessage?.("Local AI suggestion applied to Brand voice. Use Save Setup to persist it.");`
- L1147: `const input = form.querySelector(\`[name="${name}"]\`);`
- L1148: `if (input && !asString(input.value).trim()) {`
- L1149: `input.value = nextValue;`
- L1175: `const input = $("quickCommandInput");`
- L1176: `if (input) {`
- L1177: `input.value = \`Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.\`;`
- L1187: `const target = $("setupSaveBackendBtn");`
- L1227: `const input = form.querySelector(\`[name="${first.name}"]\`);`
- L1228: `if (input && typeof input.focus === "function") {`
- L1229: `input.focus();`
- L1251: `const input = form.querySelector(\`[name="${first.name}"]\`);`
- L1252: `if (input && typeof input.focus === "function") {`
- L1253: `input.focus();`
- L1254: `if (typeof input.scrollIntoView === "function") {`
- L1255: `input.scrollIntoView({ behavior: "smooth", block: "center" });`
- L1262: `if (saveBackendBtn && !saveBackendBtn.disabled) {`
- L1263: `saveBackendBtn.click();`
- L1344: `<span id="setupTemplateStatus" class="setup-template-status">Apply loads template guidance. Use Save Setup for foundation persistence.</span>`
- L1372: `saveProjectSetup`
- L1415: `const lastSavedAt = formatUpdatedAt(`
- L1417: `readinessDashboard.last_saved_at ||`
- L1441: `<button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save Setup to Backend</button>`
- L1447: `<p>Setup prepares and saves project foundation data only. Local drafts stay in this browser. Save Setup writes the backend foundation through the governed setup save path.</p>`
- L1482: `<span class="setup-helper">Updated ${escapeHtml(lastSavedAt)}</span>`
- L1538: `<p class="home-section-copy">Start with the project identity used by routing, backend setup save, and cross-workspace context.</p>`
- L1549: `<p class="home-section-copy">Core message and tone rules for consistent output.</p>`
- L1627: `: \`<div class="empty-box">All required foundation fields are complete. Use Save Setup to persist backend project foundation data.</div>\``
- L1647: `<h4>Backend Save & Diagnostics</h4>`
- L1648: `<button id="setupValidateNowBtn" class="btn btn-ghost" type="button">Save Setup and refresh</button>`
- L1650: `<p class="setup-v2-subtitle">Diagnostics show readiness signals. The button uses the same backend Save Setup path as the primary save control.</p>`
- L1673: `<h4>Save, Draft, and Continue</h4>`
- L1674: `<button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Focus next field or Save Setup</button>`
- L1678: `<button id="setupSaveBackendBtnBottom" class="btn btn-ghost" type="button">Save Setup to Backend</button>`
- L1694: `<button id="setupSaveDraftBtn" class="btn btn-ghost" type="button">Save local draft</button>`
- L1707: `<p class="setup-v2-subtitle">AI suggestions update local form guidance or prepare an AI Command prompt. They do not save backend data, approve work, publish, send, connect, or upload.</p>`
- L1710: `<button id="setupAiAudienceBtn" class="btn btn-ghost" type="button">Find missing launch inputs</button>`
- L1726: `saveProjectSetup,`
- L1780: `const saveBottomBtn = $("setupSaveBackendBtnBottom");`
- L1781: `const saveTopBtn = $("setupSaveBackendBtn");`
- L1782: `if (saveBottomBtn && saveTopBtn) {`
- L1783: `saveBottomBtn.onclick = () => saveTopBtn.click();`

## Backend / API / Context Signals
- L2: `import { applyProjectBusinessTemplate } from "../api.js";`
- L197: `function getSetupDraftKey(projectName) {`
- L198: `return \`mh-control-center:setup-draft:${projectName || "default"}\`;`
- L201: `function loadSetupDraft(projectName) {`
- L205: `const raw = window.localStorage.getItem(getSetupDraftKey(projectName));`
- L214: `function saveSetupDraft(projectName, data) {`
- L218: `window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));`
- L225: `function clearSetupDraft(projectName) {`
- L229: `window.localStorage.removeItem(getSetupDraftKey(projectName));`
- L240: `const projectName = context.currentProject || overviewData.project_name || "";`
- L243: `project_name: projectName,`
- L247: `execution_mode: context.executionMode || overviewData.execution_mode || "",`
- L248: `brand_name: overviewData.brand_name || projectName,`
- L253: `market: context.currentMarket || overviewData.market || "",`
- L254: `language: context.currentLanguage || overviewData.language || "",`
- L258: `launch_window: overviewData.launch_window || context.activeCampaign || "",`
- L261: `audience_geography: overviewData.audience_geography || context.currentMarket || "",`
- L597: `if (positioning) positioning.textContent = compactListText([buildPositioningSuggestion(values)], "Generate positioning guidance from setup context.");`
- L866: `projectName,`
- L867: `reloadProjectData,`
- L868: `saveProjectSetup,`
- L881: `const draftKeyName = projectName || "current project";`
- L961: `const saved = saveSetupDraft(projectName, values);`
- L976: `project: projectName || "",`
- L989: `saveSetupDraft(projectName, values);`
- L1053: `if (!projectName) {`
- L1059: `const requestedProjectName = asString(values.project_name).trim().toLowerCase();`
- L1068: `await saveProjectSetup?.(projectName, payload);`
- L1069: `clearSetupDraft(projectName);`
- L1070: `await reloadProjectData?.(projectName);`
- L1073: `requestedProjectName && requestedProjectName !== asString(projectName).trim().toLowerCase()`
- L1095: `clearSetupDraft(projectName);`
- L1371: `reloadProjectData,`
- L1372: `saveProjectSetup`
- L1381: `const projectName = state.context.currentProject || overviewData.project_name || "";`
- L1382: `const draft = loadSetupDraft(projectName);`
- L1433: `<p class="setup-header-project">Project: ${escapeHtml(asString(values.project_name) || projectName || "No project selected")}</p>`
- L1538: `<p class="home-section-copy">Start with the project identity used by routing, backend setup save, and cross-workspace context.</p>`
- L1724: `projectName,`
- L1725: `reloadProjectData,`
- L1726: `saveProjectSetup,`
- L1759: `await applyProjectBusinessTemplate(projectName, selectedType);`
- L1767: `await reloadProjectData?.(projectName);`

## Confirmation Signals
- none

## Storage Signals
- L202: `if (typeof window === "undefined" || !window.localStorage) return null;`
- L205: `const raw = window.localStorage.getItem(getSetupDraftKey(projectName));`
- L215: `if (typeof window === "undefined" || !window.localStorage) return false;`
- L218: `window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));`
- L226: `if (typeof window === "undefined" || !window.localStorage) return false;`
- L229: `window.localStorage.removeItem(getSetupDraftKey(projectName));`

## Focus / Pointer Workaround Signals
- L407: `function getSetupPrimaryFocus({ missingFields = [], missingAssets = [], missingConnectors = [] }) {`
- L565: `const audience = asString(values.audience_primary).trim() || "a focused customer segment";`
- L589: `return "Direct, helpful, and conversion-focused with concrete benefits.";`
- L592: `return "Clear, practical, and trustworthy with a human and outcome-focused tone.";`
- L781: `if (input && typeof input.focus === "function") {`
- L782: `input.focus();`
- L784: `// Keep focus stable without forcing scrollIntoView during editing.`
- L826: `recommendedBtn.setAttribute("aria-label", \`Focus recommended step: ${recommendedStep.title}\`);`
- L998: `const keepSetupFieldFocused = (event) => {`
- L1005: `if (document.activeElement !== field && typeof field.focus === "function") {`
- L1006: `field.focus();`
- L1011: `// Legacy focus forcing disabled after frontend shell rebuild.`
- L1032: `if (input && typeof input.focus === "function") {`
- L1033: `input.focus();`
- L1036: `// Keep focus stable without forcing scrollIntoView during editing.`
- L1228: `if (input && typeof input.focus === "function") {`
- L1229: `input.focus();`
- L1252: `if (input && typeof input.focus === "function") {`
- L1253: `input.focus();`
- L1258: `showMessage?.(\`Focus moved to ${first.label}.\`);`
- L1312: `<p class="setup-v2-subtitle">Choose a model to load recommended defaults, checklist scope, and readiness priorities. Selection alone does not publish, connect, or execute anything.</p>`
- L1401: `const primaryFocus = getSetupPrimaryFocus({ missingFields, missingAssets, missingConnectors });`
- L1437: `<span class="mhos-os-chip ${missingFields.length || missingAssets.length || missingConnectors.length ? "is-warning" : "is-live"}">Focus: ${escapeHtml(primaryFocus)}</span>`
- L1674: `<button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Focus next field or Save Setup</button>`

## Navigation Signals
- L862: `navigateTo,`
- L1096: `navigateTo("setup");`
- L1179: `navigateTo("ai-command");`
- L1197: `navigateTo("library");`
- L1204: `navigateTo("integrations");`
- L1211: `navigateTo("campaign-studio");`
- L1238: `navigateTo("home");`
- L1351: `export const setupRoute = {`
- L1368: `navigateTo,`
- L1720: `navigateTo,`

## Disabled / Future / Read-only Signals
- L137: `if (!value) return "Not available";`
- L139: `if (Number.isNaN(date.getTime())) return "Not available";`
- L774: `completeNowBtn.disabled = missingFields.length === 0;`
- L783: `// Disabled: automatic field scrolling caused form interaction jump.`
- L837: `continueLibraryBtn.disabled = false;`
- L842: `continueIntegrationsBtn.disabled = false;`
- L847: `continueCampaignBtn.disabled = false;`
- L922: `// Disabled: wizard panel auto-scroll caused workspace jump during interaction.`
- L963: `showMessage(saved ? message : "Local draft storage is not available in this browser.");`
- L1011: `// Legacy focus forcing disabled after frontend shell rebuild.`
- L1035: `// Disabled: automatic field scrolling caused form interaction jump.`
- L1063: `saveBackendBtn.disabled = true;`
- L1082: `saveBackendBtn.disabled = false;`
- L1188: `if (target && !target.disabled) {`
- L1262: `if (saveBackendBtn && !saveBackendBtn.disabled) {`
- L1751: `templateApplyBtn.disabled = true;`
- L1775: `templateApplyBtn.disabled = false;`

## Risky Terms
- L1: `import { getMissingAssetLabels } from "../asset-library.js";`
- L2: `import { applyProjectBusinessTemplate } from "../api.js";`
- L3: `import { patchState } from "../state.js";`
- L74: `const FIELD_IMPORTANCE_REASON = {`
- L85: `social_channels: "Defines where campaign and publishing workflows should execute."`
- L99: `social_channels: "Defines where campaigns and publishing workflows should prepare content."`
- L173: `const key = label`
- L182: `if (!label || seen.has(key)) return false;`
- L183: `seen.add(key);`
- L192: `reason: FIELD_IMPORTANCE_REASON[field.name] || "Required to improve setup quality and downstream reliability.",`
- L197: `function getSetupDraftKey(projectName) {`
- L205: `const raw = window.localStorage.getItem(getSetupDraftKey(projectName));`
- L218: `window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));`
- L229: `window.localStorage.removeItem(getSetupDraftKey(projectName));`
- L509: `for (const [key, value] of formData.entries()) {`
- L510: `values[key] = asString(value);`
- L881: `const draftKeyName = projectName || "current project";`
- L1046: `saveLocal(\`Local setup draft saved for ${draftKeyName}. Use Save Setup to persist backend project foundation data.\`);`
- L1052: `saveBackendBtn.onclick = async () => {`
- L1065: `showMessage?.(\`Saving backend setup foundation for ${draftKeyName}...\`);`
- L1077: `showMessage?.(\`Backend setup foundation saved for ${draftKeyName}.${renameWarning}\`);`
- L1080: `showError?.(error.message || \`Failed to save Setup changes for ${draftKeyName}.\`);`
- L1098: `showMessage(\`Local setup draft cleared for ${draftKeyName}.\`);`
- L1177: `input.value = \`Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.\`;`
- L1312: `<p class="setup-v2-subtitle">Choose a model to load recommended defaults, checklist scope, and readiness priorities. Selection alone does not publish, connect, or execute anything.</p>`
- L1357: `description: "Create the trusted project foundation before assets, connectors, campaign planning, and publishing-owned execution."`
- L1449: `<span>Does not publish, approve, send, or execute</span>`
- L1561: `<p class="home-section-copy">Localization defaults used by planning and publishing.</p>`
- L1602: `${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}`
- L1707: `<p class="setup-v2-subtitle">AI suggestions update local form guidance or prepare an AI Command prompt. They do not save backend data, approve work, publish, send, connect, or upload.</p>`
- L1740: `templateApplyBtn.onclick = async () => {`

## Required Manual Classification
Before any patch, classify Setup actions into:

1. Explicit normal setup save
2. Draft/local-only state
3. Navigation only
4. Read-only projection/help
5. Backend mutation requiring confirmation
6. Risky credential/secret handling
7. Focus/listener UX workaround
8. Unknown / needs deeper inspection

## Decision Rule
- If Setup only performs explicit setup save plus local draft UX, close as safe or add copy-only clarification.
- If Setup mutates backend settings without clear operator intent, create a narrow T64 confirmation/copy patch.
- If focus workaround can break text selection/copy/paste, create a narrow UX patch only after evidence.
- Do not redesign Setup in this pass.
