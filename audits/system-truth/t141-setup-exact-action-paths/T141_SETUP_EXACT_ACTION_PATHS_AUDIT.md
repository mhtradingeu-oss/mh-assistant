# T141 — Setup Exact Action Path Audit

## Status
Generated.

## Scope
- `public/control-center/pages/setup.js`

## Why this audit exists
T135 identified `setup.js` as the next highest open runtime-risk file after Home and Insights.

This audit does not patch anything. It inspects exact action paths before deciding whether a patch is required.

## Summary

- Total lines: 1792
- Event bindings: 46
- navigateTo calls: 9
- saveProject calls: 4
- createProjectHandoff calls: 0
- setSharedHandoff calls: 0
- publish mentions: 8
- approval mentions: 0
- handoff mentions: 9
- confirm mentions: 2

## Authority Call Counts

| Term | Count |
|---|---:|
| saveProject | 4 |
| createProjectHandoff | 0 |
| createProjectApproval | 0 |
| createProjectTask | 0 |
| executeProjectAiCommand | 0 |
| setSharedHandoff | 0 |
| setSharedAiDraft | 0 |

## Backend / Shared Authority Findings

### saveProject at line 868

```js
863:   showMessage,
864:   showError,
865:   escapeHtml,
866:   projectName,
867:   reloadProjectData,
868:   saveProjectSetup,
869:   missingAssets,
870:   missingConnectors,
871:   readinessScore,
872:   readinessStatus,
873:   criticalGaps
```

### saveProject at line 1068

```js
1063:       saveBackendBtn.disabled = true;
1064:       saveBackendBtn.textContent = "Saving Setup...";
1065:       showMessage?.(`Saving backend setup foundation for ${draftKeyName}...`);
1066: 
1067:       try {
1068:         await saveProjectSetup?.(projectName, payload);
1069:         clearSetupDraft(projectName);
1070:         await reloadProjectData?.(projectName);
1071: 
1072:         const renameWarning =
1073:           requestedProjectName && requestedProjectName !== asString(projectName).trim().toLowerCase()
```

### saveProject at line 1372

```js
1367:     escapeHtml,
1368:     navigateTo,
1369:     showMessage,
1370:     showError,
1371:     reloadProjectData,
1372:     saveProjectSetup
1373:   }) {
1374:     const state = getState();
1375:     const overviewData = asObject(state.data.overview?.overview);
1376:     const readiness = asObject(state.data.readiness);
1377:     const readinessDashboard = asObject(readiness.dashboard);
```

### saveProject at line 1726

```js
1721:       showMessage,
1722:       showError,
1723:       escapeHtml,
1724:       projectName,
1725:       reloadProjectData,
1726:       saveProjectSetup,
1727:       missingAssets,
1728:       missingConnectors,
1729:       readinessScore,
1730:       readinessStatus,
1731:       criticalGaps
```

## Navigation Findings

### navigateTo at line 862

```js
857:   updateAiAssistantPreview(values);
858: }
859: 
860: function bindSetupActions({
861:   $,
862:   navigateTo,
863:   showMessage,
864:   showError,
865:   escapeHtml,
866:   projectName,
867:   reloadProjectData,
```

### navigateTo at line 1096

```js
1091: 
1092:   const resetBtn = $("setupResetDraftBtn");
1093:   if (resetBtn) {
1094:     resetBtn.onclick = () => {
1095:       clearSetupDraft(projectName);
1096:       navigateTo("setup");
1097:       if (typeof showMessage === "function") {
1098:         showMessage(`Local setup draft cleared for ${draftKeyName}.`);
1099:       }
1100:     };
1101:   }
```

### navigateTo at line 1179

```js
1174:       const missingFields = getMissingRequiredFields(values).map((field) => field.label);
1175:       const input = $("quickCommandInput");
1176:       if (input) {
1177:         input.value = `Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.`;
1178:       }
1179:       navigateTo("ai-command");
1180:       showMessage?.("Setup guidance prompt prepared in AI Command.");
1181:     };
1182:   }
1183: 
1184:   const validateNowBtn = $("setupValidateNowBtn");
```

### navigateTo at line 1197

```js
1192:   }
1193: 
1194:   const continueLibraryBtn = $("setupContinueLibraryBtn");
1195:   if (continueLibraryBtn) {
1196:     continueLibraryBtn.onclick = () => {
1197:       navigateTo("library");
1198:     };
1199:   }
1200: 
1201:   const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
1202:   if (continueIntegrationsBtn) {
```

### navigateTo at line 1204

```js
1199:   }
1200: 
1201:   const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
1202:   if (continueIntegrationsBtn) {
1203:     continueIntegrationsBtn.onclick = () => {
1204:       navigateTo("integrations");
1205:     };
1206:   }
1207: 
1208:   const continueCampaignBtn = $("setupContinueCampaignBtn");
1209:   if (continueCampaignBtn) {
```

### navigateTo at line 1211

```js
1206:   }
1207: 
1208:   const continueCampaignBtn = $("setupContinueCampaignBtn");
1209:   if (continueCampaignBtn) {
1210:     continueCampaignBtn.onclick = () => {
1211:       navigateTo("campaign-studio");
1212:     };
1213:   }
1214: 
1215:   const reviewMissingBtn = $("setupReviewMissingBtn");
1216:   if (reviewMissingBtn) {
```

### navigateTo at line 1238

```js
1233:   }
1234: 
1235:   const reviewReadinessBtn = $("setupReviewReadinessBtn");
1236:   if (reviewReadinessBtn) {
1237:     reviewReadinessBtn.onclick = () => {
1238:       navigateTo("home");
1239:     };
1240:   }
1241: 
1242:   const smartActionBtn = $("setupSmartActionBtn");
1243:   if (smartActionBtn) {
```

### navigateTo at line 1368

```js
1363:   `,
1364:   render({
1365:     getState,
1366:     $,
1367:     escapeHtml,
1368:     navigateTo,
1369:     showMessage,
1370:     showError,
1371:     reloadProjectData,
1372:     saveProjectSetup
1373:   }) {
```

### navigateTo at line 1720

```js
1715:       </div>
1716:     `;
1717: 
1718:     bindSetupActions({
1719:       $,
1720:       navigateTo,
1721:       showMessage,
1722:       showError,
1723:       escapeHtml,
1724:       projectName,
1725:       reloadProjectData,
```

## Event Binding Findings

### .onclick at line 775

```js
770:   }
771: 
772:   const completeNowBtn = document.getElementById("setupCompleteNowBtn");
773:   if (completeNowBtn) {
774:     completeNowBtn.disabled = missingFields.length === 0;
775:     completeNowBtn.onclick = () => {
776:       if (!missingFields.length) return;
777:       const first = missingFields[0];
778:       const stepId = getFieldStepId(first.name);
779:       activateStep(stepId);
780:       const input = form.querySelector(`[name="${first.name}"]`);
```

### .onclick at line 914

```js
909:       activateStep
910:     });
911:   };
912: 
913:   stepButtons.forEach((button) => {
914:     button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);
915:   });
916: 
917:   stepActionButtons.forEach((button) => {
918:     button.onclick = () => {
919:       const stepId = button.getAttribute("data-setup-open-step") || STEP_DEFINITIONS[0].id;
```

### .onclick at line 918

```js
913:   stepButtons.forEach((button) => {
914:     button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);
915:   });
916: 
917:   stepActionButtons.forEach((button) => {
918:     button.onclick = () => {
919:       const stepId = button.getAttribute("data-setup-open-step") || STEP_DEFINITIONS[0].id;
920:       activateStep(stepId);
921:       const panel = document.querySelector(`[data-setup-step-panel="${stepId}"]`);
922:       // Disabled: wizard panel auto-scroll caused workspace jump during interaction.
923:     };
```

### .onclick at line 928

```js
923:     };
924:   });
925: 
926:   const prevBtn = $("setupPrevStepBtn");
927:   if (prevBtn) {
928:     prevBtn.onclick = () => {
929:       const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
930:       if (index > 0) activateStep(STEP_DEFINITIONS[index - 1].id);
931:     };
932:   }
933: 
```

### .onclick at line 936

```js
931:     };
932:   }
933: 
934:   const nextBtn = $("setupNextStepBtn");
935:   if (nextBtn) {
936:     nextBtn.onclick = () => {
937:       const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
938:       if (index < STEP_DEFINITIONS.length - 1) activateStep(STEP_DEFINITIONS[index + 1].id);
939:     };
940:   }
941: 
```

### .onclick at line 1016

```js
1011:   // Legacy focus forcing disabled after frontend shell rebuild.
1012:   // The old interaction model caused typing/click instability.
1013: 
1014:   const setupRoot = $("setupRoot") || form.closest(".setup-wizard-shell") || form;
1015: 
1016:   setupRoot.onclick = (event) => {
1017:     const jumpBtn = event.target.closest("[data-setup-jump-field]");
1018:     if (!jumpBtn) return;
1019: 
1020:     event.preventDefault();
1021: 
```

### .onclick at line 1045

```js
1040: 
1041:   refreshSummary();
1042: 
1043:   const saveDraftBtn = $("setupSaveDraftBtn");
1044:   if (saveDraftBtn) {
1045:     saveDraftBtn.onclick = () => {
1046:       saveLocal(`Local setup draft saved for ${draftKeyName}. Use Save Setup to persist backend project foundation data.`);
1047:     };
1048:   }
1049: 
1050:   const saveBackendBtn = $("setupSaveBackendBtn");
```

### .onclick at line 1052

```js
1047:     };
1048:   }
1049: 
1050:   const saveBackendBtn = $("setupSaveBackendBtn");
1051:   if (saveBackendBtn) {
1052:     saveBackendBtn.onclick = async () => {
1053:       if (!projectName) {
1054:         showError?.("Select a project before saving Setup changes.");
1055:         return;
1056:       }
1057: 
```

### .onclick at line 1094

```js
1089:     };
1090:   }
1091: 
1092:   const resetBtn = $("setupResetDraftBtn");
1093:   if (resetBtn) {
1094:     resetBtn.onclick = () => {
1095:       clearSetupDraft(projectName);
1096:       navigateTo("setup");
1097:       if (typeof showMessage === "function") {
1098:         showMessage(`Local setup draft cleared for ${draftKeyName}.`);
1099:       }
```

### .onclick at line 1105

```js
1100:     };
1101:   }
1102: 
1103:   const aiPositioningBtn = $("setupAiPositioningBtn");
1104:   if (aiPositioningBtn) {
1105:     aiPositioningBtn.onclick = () => {
1106:       const values = refreshSummary();
1107:       const field = form.querySelector('[name="offer_positioning"]');
1108:       if (field && !asString(field.value).trim()) {
1109:         field.value = buildPositioningSuggestion(values);
1110:       }
```

### .onclick at line 1118

```js
1113:     };
1114:   }
1115: 
1116:   const aiAudienceBtn = $("setupAiAudienceBtn");
1117:   if (aiAudienceBtn) {
1118:     aiAudienceBtn.onclick = () => {
1119:       const values = refreshSummary();
1120:       const field = form.querySelector('[name="audience_primary"]');
1121:       if (field && !asString(field.value).trim()) {
1122:         field.value = buildAudienceSuggestion(values);
1123:       }
```

### .onclick at line 1131

```js
1126:     };
1127:   }
1128: 
1129:   const aiToneBtn = $("setupAiToneBtn");
1130:   if (aiToneBtn) {
1131:     aiToneBtn.onclick = () => {
1132:       const values = refreshSummary();
1133:       const field = form.querySelector('[name="brand_voice"]');
1134:       if (field && !asString(field.value).trim()) {
1135:         field.value = buildToneSuggestion(values);
1136:       }
```

### .onclick at line 1144

```js
1139:     };
1140:   }
1141: 
1142:   const aiFillBtn = $("setupAiFillMissingBtn");
1143:   if (aiFillBtn) {
1144:     aiFillBtn.onclick = () => {
1145:       const values = refreshSummary();
1146:       const setIfEmpty = (name, nextValue) => {
1147:         const input = form.querySelector(`[name="${name}"]`);
1148:         if (input && !asString(input.value).trim()) {
1149:           input.value = nextValue;
```

### .onclick at line 1172

```js
1167:     };
1168:   }
1169: 
1170:   const aiCommandBtn = $("setupAiCommandBtn");
1171:   if (aiCommandBtn) {
1172:     aiCommandBtn.onclick = () => {
1173:       const values = refreshSummary();
1174:       const missingFields = getMissingRequiredFields(values).map((field) => field.label);
1175:       const input = $("quickCommandInput");
1176:       if (input) {
1177:         input.value = `Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.`;
```

### .onclick at line 1186

```js
1181:     };
1182:   }
1183: 
1184:   const validateNowBtn = $("setupValidateNowBtn");
1185:   if (validateNowBtn) {
1186:     validateNowBtn.onclick = () => {
1187:       const target = $("setupSaveBackendBtn");
1188:       if (target && !target.disabled) {
1189:         target.click();
1190:       }
1191:     };
```

### .onclick at line 1196

```js
1191:     };
1192:   }
1193: 
1194:   const continueLibraryBtn = $("setupContinueLibraryBtn");
1195:   if (continueLibraryBtn) {
1196:     continueLibraryBtn.onclick = () => {
1197:       navigateTo("library");
1198:     };
1199:   }
1200: 
1201:   const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
```

### .onclick at line 1203

```js
1198:     };
1199:   }
1200: 
1201:   const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
1202:   if (continueIntegrationsBtn) {
1203:     continueIntegrationsBtn.onclick = () => {
1204:       navigateTo("integrations");
1205:     };
1206:   }
1207: 
1208:   const continueCampaignBtn = $("setupContinueCampaignBtn");
```

### .onclick at line 1210

```js
1205:     };
1206:   }
1207: 
1208:   const continueCampaignBtn = $("setupContinueCampaignBtn");
1209:   if (continueCampaignBtn) {
1210:     continueCampaignBtn.onclick = () => {
1211:       navigateTo("campaign-studio");
1212:     };
1213:   }
1214: 
1215:   const reviewMissingBtn = $("setupReviewMissingBtn");
```

## Confirmation Findings

### confirm at line 1751

```js
1746:             templateStatus.dataset.tone = "error";
1747:           }
1748:           return;
1749:         }
1750: 
1751:         const confirmed = window.confirm(
1752:           `Apply the ${humanizeStatus(selectedType)} setup template to ${projectName || "this project"}?\n\nThis may update project setup defaults and then reload project data. It will not publish, send, approve, connect, or execute anything.`
1753:         );
1754:         if (!confirmed) return;
1755: 
1756:         templateApplyBtn.disabled = true;
```

### confirm at line 1754

```js
1749:         }
1750: 
1751:         const confirmed = window.confirm(
1752:           `Apply the ${humanizeStatus(selectedType)} setup template to ${projectName || "this project"}?\n\nThis may update project setup defaults and then reload project data. It will not publish, send, approve, connect, or execute anything.`
1753:         );
1754:         if (!confirmed) return;
1755: 
1756:         templateApplyBtn.disabled = true;
1757: 
1758:         if (templateStatus) {
1759:           templateStatus.textContent = "Applying business template...";
```

## Publish Mentions

### publish at line 85

```js
80:   language: "Ensures content generation uses the correct language defaults.",
81:   currency: "Required for pricing context and paid/media planning outputs.",
82:   audience_primary: "Improves message relevance and audience-specific tactics.",
83:   primary_goal: "Aligns optimization priorities and readiness evaluation.",
84:   competitors: "Supports differentiation and benchmark-aware recommendations.",
85:   social_channels: "Defines where campaign and publishing workflows should execute."
86: };
87: 
88: const SETUP_FIELD_INFO = {
89:   project_name: "This name is used as the main project identity across the Control Center.",
90:   project_type: "Helps AI choose better defaults for workflows, campaigns, and recommendations.",
```

### publish at line 99

```js
94:   language: "Sets the default language for content, AI suggestions, and campaign outputs.",
95:   currency: "Used for pricing, offers, budgets, and commercial planning.",
96:   audience_primary: "Defines the main customer group the system should optimize messages for.",
97:   primary_goal: "Tells the system what success means for this project.",
98:   competitors: "Helps AI create differentiated positioning instead of generic copy.",
99:   social_channels: "Defines where campaigns and publishing workflows should prepare content."
100: };
101: 
102: function asArray(value) {
103:   return Array.isArray(value) ? value : [];
104: }
```

### publish at line 1312

```js
1307:     <section class="card setup-business-template-panel">
1308:       <div class="setup-template-head">
1309:         <div>
1310:           <div class="setup-kicker">Business Template</div>
1311:           <h3 class="setup-v2-title">Project Operating Model</h3>
1312:           <p class="setup-v2-subtitle">Choose a model to load recommended defaults, checklist scope, and readiness priorities. Selection alone does not publish, connect, or execute anything.</p>
1313:         </div>
1314:         <span class="setup-template-current">${escapeHtml(currentLabel)}</span>
1315:       </div>
1316: 
1317:       <div class="setup-template-body">
```

### publish at line 1357

```js
1352:   id: "setup",
1353:   disableStandardLayout: true,
1354:   meta: {
1355:     eyebrow: "Start",
1356:     title: "Project Foundation",
1357:     description: "Create the trusted project foundation before assets, connectors, campaign planning, and publishing-owned execution."
1358:   },
1359:   template: `
1360:     <section class="page is-active" data-page="setup">
1361:       <div id="setupRoot"></div>
1362:     </section>
```

### publish at line 1449

```js
1444: 
1445:           <div class="setup-guidance-strip mhos-os-decision-card">
1446:             <strong>What this page does</strong>
1447:             <p>Setup prepares and saves project foundation data only. Local drafts stay in this browser. Save Setup writes the backend foundation through the governed setup save path.</p>
1448:             <div class="setup-config-intel-metrics mhos-os-chip-row">
1449:               <span>Does not publish, approve, send, or execute</span>
1450:               <span>Does not upload assets</span>
1451:               <span>Does not connect providers</span>
1452:             </div>
1453:           </div>
1454: 
```

### publish at line 1561

```js
1556:                 </div>
1557:               </section>
1558: 
1559:               <section class="setup-wizard-step-panel" data-setup-step-panel="market-language" hidden>
1560:                 <h4>Market & Language</h4>
1561:                 <p class="home-section-copy">Localization defaults used by planning and publishing.</p>
1562:                 <div class="setup-form-grid setup-form-grid-3">
1563:                   ${renderField({ name: "market", label: "Market", value: values.market, helper: "Primary region.", placeholder: "e.g. US", escapeHtml, required: true })}
1564:                   ${renderField({ name: "language", label: "Language", value: values.language, helper: "Primary content language.", placeholder: "e.g. English", escapeHtml, required: true })}
1565:                   ${renderField({ name: "currency", label: "Currency", value: values.currency, helper: "Commercial currency.", placeholder: "e.g. USD", escapeHtml, required: true })}
1566:                 </div>
```

### publish at line 1707

```js
1702:         <section class="card setup-smart-ai-tools">
1703:           <div class="card-head">
1704:             <h4>AI Guidance Panel</h4>
1705:             <span class="card-badge neutral">Assistive only</span>
1706:           </div>
1707:           <p class="setup-v2-subtitle">AI suggestions update local form guidance or prepare an AI Command prompt. The smart action may save setup only when required fields are complete; it does not approve work, publish, send, connect, or upload.</p>
1708:           <div class="setup-smart-handoff-actions">
1709:             <button id="setupAiPositioningBtn" class="btn btn-ghost" type="button">Review positioning</button>
1710:             <button id="setupAiAudienceBtn" class="btn btn-ghost" type="button">Find missing launch inputs</button>
1711:             <button id="setupAiToneBtn" class="btn btn-ghost" type="button">Suggest channel priorities</button>
1712:             <button id="setupAiFillMissingBtn" class="btn btn-secondary" type="button">Prepare setup checklist</button>
```

### publish at line 1752

```js
1747:           }
1748:           return;
1749:         }
1750: 
1751:         const confirmed = window.confirm(
1752:           `Apply the ${humanizeStatus(selectedType)} setup template to ${projectName || "this project"}?\n\nThis may update project setup defaults and then reload project data. It will not publish, send, approve, connect, or execute anything.`
1753:         );
1754:         if (!confirmed) return;
1755: 
1756:         templateApplyBtn.disabled = true;
1757: 
```

## Approval Mentions

No matches.

## Handoff Mentions

### handoff at line 1491

```js
1486:           <div class="setup-guidance-strip mhos-os-decision-card">
1487:             <strong>Next foundation step</strong>
1488:             <p id="setupNextBestAction">${escapeHtml(nextBestAction)}</p>
1489:             <div class="setup-config-intel-metrics mhos-os-chip-row">
1490:               <span>Required missing: <strong id="setupReadinessMissingFields">${escapeHtml(String(missingFields.length))}</strong></span>
1491:               <span>Assets missing: <strong id="setupReadinessMissingAssets">${escapeHtml(String(missingAssets.length))}</strong> <span class=\"setup-handoff-label\">(manage in Library)</span></span>
1492:               <span>Connectors missing: <strong id="setupReadinessMissingConnectors">${escapeHtml(String(missingConnectors.length))}</strong> <span class=\"setup-handoff-label\">(manage in Integrations)</span></span>
1493:             </div>
1494:           </div>
1495:         </section>
1496: 
```

### handoff at line 1492

```js
1487:             <strong>Next foundation step</strong>
1488:             <p id="setupNextBestAction">${escapeHtml(nextBestAction)}</p>
1489:             <div class="setup-config-intel-metrics mhos-os-chip-row">
1490:               <span>Required missing: <strong id="setupReadinessMissingFields">${escapeHtml(String(missingFields.length))}</strong></span>
1491:               <span>Assets missing: <strong id="setupReadinessMissingAssets">${escapeHtml(String(missingAssets.length))}</strong> <span class=\"setup-handoff-label\">(manage in Library)</span></span>
1492:               <span>Connectors missing: <strong id="setupReadinessMissingConnectors">${escapeHtml(String(missingConnectors.length))}</strong> <span class=\"setup-handoff-label\">(manage in Integrations)</span></span>
1493:             </div>
1494:           </div>
1495:         </section>
1496: 
1497:         <div class="setup-wizard-layout">
```

### handoff at line 1599

```js
1594:                 </div>
1595:               </section>
1596: 
1597:               <section class="setup-wizard-step-panel" data-setup-step-panel="channels" hidden>
1598:                 <h4>Channels</h4>
1599:                 <p class="home-section-copy">Distribution channels and operator handoff notes.</p>
1600:                 <div class="setup-form-grid">
1601:                   ${renderField({ name: "social_channels", label: "Channels", value: values.social_channels, helper: "Comma-separated channels (e.g. Instagram, Email).", placeholder: "instagram, facebook, email", escapeHtml, multiline: true, rows: 3, required: true })}
1602:                   ${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}
1603:                 </div>
1604:               </section>
```

### handoff at line 1602

```js
1597:               <section class="setup-wizard-step-panel" data-setup-step-panel="channels" hidden>
1598:                 <h4>Channels</h4>
1599:                 <p class="home-section-copy">Distribution channels and operator handoff notes.</p>
1600:                 <div class="setup-form-grid">
1601:                   ${renderField({ name: "social_channels", label: "Channels", value: values.social_channels, helper: "Comma-separated channels (e.g. Instagram, Email).", placeholder: "instagram, facebook, email", escapeHtml, multiline: true, rows: 3, required: true })}
1602:                   ${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}
1603:                 </div>
1604:               </section>
1605:             </form>
1606:           </section>
1607:         </div>
```

### handoff at line 1671

```js
1666:               </article>
1667:             </div>
1668:           </section>
1669:         </div>
1670: 
1671:         <section class="card setup-smart-handoff-panel">
1672:           <div class="card-head">
1673:             <h4>Save, Draft, and Continue</h4>
1674:             <button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Focus next field / Save Setup if complete</button>
1675:           </div>
1676:           <div class="setup-handoff-note">Continue buttons only open the owning workspace. Library owns assets, Integrations owns connectors, Campaign Studio owns campaign planning, and AI Command owns AI review.</div>
```

### handoff at line 1676

```js
1671:         <section class="card setup-smart-handoff-panel">
1672:           <div class="card-head">
1673:             <h4>Save, Draft, and Continue</h4>
1674:             <button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Focus next field / Save Setup if complete</button>
1675:           </div>
1676:           <div class="setup-handoff-note">Continue buttons only open the owning workspace. Library owns assets, Integrations owns connectors, Campaign Studio owns campaign planning, and AI Command owns AI review.</div>
1677:           <div class="setup-smart-handoff-actions setup-smart-handoff-actions-primary">
1678:             <button id="setupSaveBackendBtnBottom" class="btn btn-ghost" type="button">Save Setup to Backend</button>
1679:             <button id="setupContinueLibraryBtn" class="btn btn-secondary" type="button">Open Library for assets</button>
1680:             <button id="setupContinueIntegrationsBtn" class="btn btn-secondary" type="button">Open Integrations for connectors</button>
1681:           </div>
```

### handoff at line 1677

```js
1672:           <div class="card-head">
1673:             <h4>Save, Draft, and Continue</h4>
1674:             <button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Focus next field / Save Setup if complete</button>
1675:           </div>
1676:           <div class="setup-handoff-note">Continue buttons only open the owning workspace. Library owns assets, Integrations owns connectors, Campaign Studio owns campaign planning, and AI Command owns AI review.</div>
1677:           <div class="setup-smart-handoff-actions setup-smart-handoff-actions-primary">
1678:             <button id="setupSaveBackendBtnBottom" class="btn btn-ghost" type="button">Save Setup to Backend</button>
1679:             <button id="setupContinueLibraryBtn" class="btn btn-secondary" type="button">Open Library for assets</button>
1680:             <button id="setupContinueIntegrationsBtn" class="btn btn-secondary" type="button">Open Integrations for connectors</button>
1681:           </div>
1682:           <div class="setup-smart-handoff-actions setup-smart-handoff-actions-secondary">
```

### handoff at line 1682

```js
1677:           <div class="setup-smart-handoff-actions setup-smart-handoff-actions-primary">
1678:             <button id="setupSaveBackendBtnBottom" class="btn btn-ghost" type="button">Save Setup to Backend</button>
1679:             <button id="setupContinueLibraryBtn" class="btn btn-secondary" type="button">Open Library for assets</button>
1680:             <button id="setupContinueIntegrationsBtn" class="btn btn-secondary" type="button">Open Integrations for connectors</button>
1681:           </div>
1682:           <div class="setup-smart-handoff-actions setup-smart-handoff-actions-secondary">
1683:             <div class="setup-action-group">
1684:               <span class="setup-action-group-label">Planning workspace</span>
1685:               <button id="setupContinueCampaignBtn" class="btn btn-secondary" type="button">Open Campaign Studio for planning</button>
1686:             </div>
1687:             <div class="setup-action-group">
```

### handoff at line 1708

```js
1703:           <div class="card-head">
1704:             <h4>AI Guidance Panel</h4>
1705:             <span class="card-badge neutral">Assistive only</span>
1706:           </div>
1707:           <p class="setup-v2-subtitle">AI suggestions update local form guidance or prepare an AI Command prompt. The smart action may save setup only when required fields are complete; it does not approve work, publish, send, connect, or upload.</p>
1708:           <div class="setup-smart-handoff-actions">
1709:             <button id="setupAiPositioningBtn" class="btn btn-ghost" type="button">Review positioning</button>
1710:             <button id="setupAiAudienceBtn" class="btn btn-ghost" type="button">Find missing launch inputs</button>
1711:             <button id="setupAiToneBtn" class="btn btn-ghost" type="button">Suggest channel priorities</button>
1712:             <button id="setupAiFillMissingBtn" class="btn btn-secondary" type="button">Prepare setup checklist</button>
1713:           </div>
```

## Decision Placeholder

Classify after human review:

- Safe / setup route-only
- Needs confirmation before save
- Needs confirmation before handoff
- Needs shared handoff guard
- Needs backend authority guard
- Needs no patch
