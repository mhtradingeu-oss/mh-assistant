# T40 — Governance Exact Decision + Policy Write Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/governance.js

## Purpose
T39 showed Governance has approval decisions, policy writes, backend calls, and confirmations. T40 verifies exact action paths:
- approval decision submit
- approval request creation
- durable governance policy save
- refresh-only actions
- AI handoff/routing
- whether confirmation gates protect sensitive backend writes
- whether copy-only defects exist

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| Imported Governance APIs | 138 | 9 |
| bindGovernance block | 1300 | 1 |
| decision button binding | 139 | 16 |
| decision confirmation | 202 | 6 |
| approval decision backend call | 1322 | 1 |
| request approval binding | 138 | 5 |
| request approval confirmation | 203 | 4 |
| policy save binding | 480 | 15 |
| policy confirmation | 141 | 7 |
| policy backend write | 1401 | 2 |
| refresh action | 287 | 7 |
| AI handoff/routing | 922 | 6 |
| copy compact issues | 84 | 6 |


## Main Binding / Action Block

```js
 1300: function bindGovernance(context, projectName, session) {
 1301:   const root = context.$("pageRoot");
 1302:   if (!root) return;
 1303: 
 1304:   const rerender = () => {
 1305:     root.innerHTML = renderPage(projectName, session, context.escapeHtml);
 1306:     bindGovernance(context, projectName, session);
 1307:   };
 1308: 
 1309:   Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
 1310:     button.onclick = async () => {
 1311:       const approvalId = button.getAttribute("data-approval-id") || "";
 1312:       const decision = button.getAttribute("data-governance-decision") || "";
 1313:       const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
 1314:       const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
 1315:       const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
 1316: 
 1317:       if (!confirmGovernanceDecision(decision)) {
 1318:         return;
 1319:       }
 1320: 
 1321:       try {
 1322:         await decideProjectApproval(projectName, approvalId, {
 1323:           decision,
 1324:           note,
 1325:           actor: "governance-console",
 1326:           escalate_to: escalateTo
 1327:         });
 1328:         context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
 1329:         await refreshGovernance(projectName, session, rerender, context.showError);
 1330:       } catch (error) {
 1331:         context.showError(error.message || "Failed to update approval.");
 1332:       }
 1333:     };
 1334:   });
 1335: 
 1336:   Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
 1337:     button.onclick = () => {
 1338:       session.focus = button.getAttribute("data-governance-focus") || "all";
 1339:       rerender();
 1340:     };
 1341:   });
 1342: 
 1343:   Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
 1344:     button.onclick = () => {
 1345:       session.selectedKey = button.getAttribute("data-governance-select") || "";
 1346:       rerender();
 1347:     };
 1348:   });
 1349: 
 1350:   Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
 1351:     button.onclick = async () => {
 1352:       try {
 1353:         const ownership = asObject(session.summary?.review_model?.ownership);
 1354:         await createProjectApproval(projectName, {
 1355:           entity_type: button.getAttribute("data-entity-type") || "content_item",
 1356:           entity_id: button.getAttribute("data-entity-id") || "",
 1357:           title: `${button.getAttribute("data-title") || "Governance item"} approval`,
 1358:           summary: button.getAttribute("data-summary") || "Governance review requested.",
 1359:           reviewer: ownership.compliance || "Compliance Reviewer",
 1360:           reviewer_role: "compliance_reviewer",
 1361:           requested_by: "governance-console",
 1362:           requested_for: ownership.compliance || "Compliance Reviewer",
 1363:           risk_level: button.getAttribute("data-risk") || "medium",
 1364:           source_page: "governance",
 1365:           route_target: "governance"
 1366:         });
 1367:         context.showMessage("Approval request added to the governance queue.");
 1368:         await refreshGovernance(projectName, session, rerender, context.showError);
 1369:       } catch (error) {
 1370:         context.showError(error.message || "Failed to request approval.");
 1371:       }
 1372:     };
 1373:   });
 1374: 
 1375:   Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
 1376:     button.onclick = async () => {
 1377:       const action = button.getAttribute("data-governance-action");
 1378: 
 1379:       if (action === "refresh") {
 1380:         await refreshGovernance(projectName, session, rerender, context.showError);
 1381:         return;
 1382:       }
 1383: 
 1384:       if (action === "save-policy") {
 1385:         const policyRules = {};
 1386:         Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
 1387:           policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
 1388:         });
 1389: 
 1390:         const approvalOwners = {};
 1391:         Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
 1392:           approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
 1393:         });
 1394: 
 1395:         const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
 1396:         if (!confirmed) {
 1397:           return;
 1398:         }
 1399: 
 1400:         try {
 1401:           await updateProjectGovernancePolicy(projectName, {
 1402:             actor: "governance-console",
 1403:             policy_rules: policyRules,
 1404:             approval_owners: approvalOwners
 1405:           });
 1406:           context.showMessage("Backend Governance policy saved.");
 1407:           await refreshGovernance(projectName, session, rerender, context.showError);
 1408:         } catch (error) {
 1409:           context.showError(error.message || "Failed to save governance policy.");
 1410:         }
 1411:         return;
 1412:       }
 1413: 
 1414:       if (action === "sync-settings") {
 1415:         const settingsDraft = getSettingsDraftFromPolicy(session.summary);
 1416:         if (!Object.keys(settingsDraft).length) {
 1417:           context.showError("No durable Settings snapshot was found in the governance bridge for this project.");
 1418:           return;
 1419:         }
 1420: 
 1421:         const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
 1422:         if (!confirmed) {
 1423:           return;
 1424:         }
 1425: 
 1426:         try {
 1427:           await updateProjectGovernancePolicy(projectName, {
 1428:             actor: "governance-console",
 1429:             ...mapSettingsToGovernancePolicy(settingsDraft)
 1430:           });
 1431:           context.showMessage("Settings-derived rules synced into durable Governance policy.");
 1432:           await refreshGovernance(projectName, session, rerender, context.showError);
 1433:         } catch (error) {
 1434:           context.showError(error.message || "Failed to sync Settings into Governance.");
 1435:         }
 1436:       }
 1437:     };
 1438:   });
 1439: 
 1440:   Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
 1441:     button.onclick = () => {
 1442:       context.navigateTo("ai-command");
 1443:     };
 1444:   });
 1445: 
 1446:   const queueItems = buildDecisionQueue(asObject(session.summary));
 1447:   const selectedItem = queueItems.find((item) => item.selected_key === session.selectedKey) || queueItems[0] || null;
 1448:   const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
 1449:   Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
 1450:     button.onclick = () => {
 1451:       const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];
 1452:       if (!prompt) return;
 1453:       savePromptToQuickCommand(context, prompt.prompt);
 1454:       context.navigateTo("ai-command");
 1455:       context.showMessage?.("Governance prompt added to AI Command.");
 1456:     };
 1457:   });
 1458: }
 1459: 
 1460: export const governanceRoute = {
 1461:   id: "governance",
 1462:   disableStandardLayout: true,
 1463:   meta: {
 1464:     eyebrow: "System",
 1465:     title: "Governance",
 1466:     description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."
 1467:   },
 1468:   template: `<section class="page is-active" data-page="governance"><div class="governance-shell"></div></section>`,
 1469:   render(context) {
 1470:     const state = context.getState();
 1471:     const projectName = state?.context?.currentProject || "";
 1472:     const session = ensureSession(projectName);
 1473:     const root = context.$("pageRoot");
 1474: 
 1475:     if (!root) return;
 1476: 
 1477:     const rerender = () => {
 1478:       root.innerHTML = renderPage(projectName, session, context.escapeHtml);
 1479:       bindGovernance(context, projectName, session);
 1480:     };
 1481: 
 1482:     if (projectName && !session.loaded && !session.loading) {
 1483:       loadGovernance(projectName, session, rerender);
 1484:       return;
 1485:     }
 1486: 
 1487:     rerender();
 1488:   }
 1489: };
 1490: 
```

## Focused Evidence Zones

### Imported Governance APIs

```js
   48: 
   49: function classifyEvidenceAsset(asset) {
   50:   if (!asset) return "other";
   51:   const s = JSON.stringify(asset).toLowerCase();
   52:   if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
   53:   if (s.includes("legal")) return "legal";
   54:   if (s.includes("pricing")) return "pricing";
   55:   if (s.includes("certificate")) return "certificate";
   56:   if (s.includes("proof")) return "proof";
   57:   if (s.includes("product")) return "product";
   58:   if (s.includes("brand")) return "brand";
   59:   if (s.includes("claim")) return "claim";
   60:   if (s.includes("media")) return "media";
   61:   if (s.includes("content")) return "content";
   62:   if (s.includes("library")) return "library";
   63:   return "other";
   64: }
   65: 
   66: function summarizeEvidenceState(evidence) {
   67:   // Returns true if any key evidence is present
   68:   return (
   69:     evidence.source_of_truth.length ||
   70:     evidence.legal.length ||
   71:     evidence.pricing.length ||
   72:     evidence.certificate.length ||
   73:     evidence.proof.length
   74:   );
   75: }
   76: 
   77: function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
   78:   const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
   79:   const hasEvidence = summarizeEvidenceState(evidence);
   80:   return `
   81:     <div class="governance-evidence-summary">
   82:       <div class="governance-evidence-summary-header">Evidence Summary</div>
   83:       <div class="governance-evidence-cards">
   84:         <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
   85:           <span class="governance-evidence-label">Source of Truth</span>
   86:           <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
   87:         </div>
   88:         <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
   89:           <span class="governance-evidence-label">Legal</span>
   90:           <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
   91:         </div>
   92:         <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
   93:           <span class="governance-evidence-label">Pricing</span>
   94:           <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
   95:         </div>
   96:         <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
   97:           <span class="governance-evidence-label">Certificate/Proof</span>
   98:           <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
   99:         </div>
  100:         <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
  101:           <span class="governance-evidence-label">Brand Asset</span>
  102:           <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
  103:         </div>
  104:         <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
  105:           <span class="governance-evidence-label">Product Asset</span>
  106:           <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
  107:         </div>
  108:       </div>
  109:       ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
  110:       <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
  111:     </div>
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
```

### bindGovernance block

```js
 1210:                 <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
 1211:                 <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Backend Governance Policy</button>
 1212:                 <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings-Derived Rules</button>
 1213:                 ${
 1214:                   selectedItem?.queue_kind === "approval"
 1215:                     ? `
 1216:                       <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Reviewed Approval</button>
 1217:                       <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
 1218:                       <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
 1219:                       <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
 1220:                       <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record High-Risk Override</button>
 1221:                     `
 1222:                     : ""
 1223:                 }
 1224:                 ${
 1225:                   selectedItem && selectedItem.queue_kind !== "approval" && !selectedItem.linked_approval
 1226:                     ? `
 1227:                       <button
 1228:                         class="btn btn-secondary"
 1229:                         type="button"
 1230:                         data-governance-request-approval="true"
 1231:                         data-entity-type="${escapeHtml(selectedItem.entity_type || "content_item")}"
 1232:                         data-entity-id="${escapeHtml(selectedItem.entity_id || selectedItem.id)}"
 1233:                         data-title="${escapeHtml(selectedItem.queue_title || "Governance review")}"
 1234:                         data-risk="${escapeHtml(selectedItem.queue_risk || "medium")}"
 1235:                         data-summary="${escapeHtml(selectedItem.queue_summary || "Governance review requested.")}"
 1236:                       >
 1237:                         Create Approval Request
 1238:                       </button>
 1239:                     `
 1240:                     : ""
 1241:                 }
 1242:               </div>
 1243:               <div class="governance-policy-summary-grid">
 1244:                 <div class="governance-policy-block">
 1245:                   <h4>Active overrides</h4>
 1246:                   <div class="governance-activity-list">
 1247:                     ${asArray(sections.override_controls?.active_overrides).length
 1248:                       ? asArray(sections.override_controls.active_overrides).slice(0, 4).map((item) => `
 1249:                         <div class="governance-activity-item">
 1250:                           <strong>${escapeHtml(`${titleCase(item.action || "override")} • ${item.entity_type || "entity"}`)}</strong>
 1251:                           <span>${escapeHtml(item.actor || "Operator")} • ${escapeHtml(formatDateTime(item.created_at))}</span>
 1252:                         </div>
 1253:                       `).join("")
 1254:                       : `<div class="empty-box">No active overrides are currently open.</div>`}
 1255:                   </div>
 1256:                 </div>
 1257:                 <div class="governance-policy-block">
 1258:                   <h4>Escalation chain</h4>
 1259:                   <div class="governance-rule-list">
 1260:                     ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
 1261:                       <div class="governance-rule-item">
 1262:                         <strong>${escapeHtml(titleCase(risk))}</strong>
 1263:                         <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
 1264:                       </div>
 1265:                     `).join("")}
 1266:                   </div>
 1267:                 </div>
 1268:               </div>
 1269:             </div>
 1270:           </section>
 1271:           </div>
 1272:         </div>
 1273: 
 1274:         <section class="panel std-ai-panel mhos-clean-surface mhos-executive-ai-panel">
 1275:           <div class="panel-header">
 1276:             <div>
 1277:               <div class="panel-kicker">AI preparation</div>
 1278:               <h3>Governance AI assistant</h3>
 1279:               <p>Explanation-only guidance. AI cannot approve, override, or change policy; backend decisions stay in governed controls.</p>
 1280:             </div>
 1281:           </div>
 1282:           <div class="simple-banner"><strong>AI guidance scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
 1283:           <div class="governance-ai-toolbar">
 1284:             <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
 1285:           </div>
 1286:           <div class="quick-actions std-quick-actions">
 1287:             ${prompts.map((item, index) => `
 1288:               <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
 1289:                 <span class="home-action-title">${escapeHtml(item.label)}</span>
 1290:                 <span class="home-action-meta">${escapeHtml(item.preview)}</span>
 1291:               </button>
 1292:             `).join("")}
 1293:           </div>
 1294:         </section>
 1295:       </div>
 1296:     </section>
 1297:   `;
 1298: }
 1299: 
 1300: function bindGovernance(context, projectName, session) {
 1301:   const root = context.$("pageRoot");
 1302:   if (!root) return;
 1303: 
 1304:   const rerender = () => {
 1305:     root.innerHTML = renderPage(projectName, session, context.escapeHtml);
 1306:     bindGovernance(context, projectName, session);
 1307:   };
 1308: 
 1309:   Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
 1310:     button.onclick = async () => {
 1311:       const approvalId = button.getAttribute("data-approval-id") || "";
 1312:       const decision = button.getAttribute("data-governance-decision") || "";
 1313:       const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
 1314:       const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
 1315:       const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
 1316: 
 1317:       if (!confirmGovernanceDecision(decision)) {
 1318:         return;
 1319:       }
 1320: 
 1321:       try {
 1322:         await decideProjectApproval(projectName, approvalId, {
 1323:           decision,
 1324:           note,
 1325:           actor: "governance-console",
 1326:           escalate_to: escalateTo
 1327:         });
 1328:         context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
 1329:         await refreshGovernance(projectName, session, rerender, context.showError);
 1330:       } catch (error) {
 1331:         context.showError(error.message || "Failed to update approval.");
 1332:       }
 1333:     };
 1334:   });
 1335: 
 1336:   Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
 1337:     button.onclick = () => {
 1338:       session.focus = button.getAttribute("data-governance-focus") || "all";
 1339:       rerender();
 1340:     };
 1341:   });
 1342: 
 1343:   Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
 1344:     button.onclick = () => {
 1345:       session.selectedKey = button.getAttribute("data-governance-select") || "";
 1346:       rerender();
 1347:     };
 1348:   });
 1349: 
 1350:   Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
 1351:     button.onclick = async () => {
 1352:       try {
 1353:         const ownership = asObject(session.summary?.review_model?.ownership);
 1354:         await createProjectApproval(projectName, {
 1355:           entity_type: button.getAttribute("data-entity-type") || "content_item",
 1356:           entity_id: button.getAttribute("data-entity-id") || "",
 1357:           title: `${button.getAttribute("data-title") || "Governance item"} approval`,
 1358:           summary: button.getAttribute("data-summary") || "Governance review requested.",
 1359:           reviewer: ownership.compliance || "Compliance Reviewer",
 1360:           reviewer_role: "compliance_reviewer",
 1361:           requested_by: "governance-console",
 1362:           requested_for: ownership.compliance || "Compliance Reviewer",
 1363:           risk_level: button.getAttribute("data-risk") || "medium",
 1364:           source_page: "governance",
 1365:           route_target: "governance"
 1366:         });
 1367:         context.showMessage("Approval request added to the governance queue.");
 1368:         await refreshGovernance(projectName, session, rerender, context.showError);
 1369:       } catch (error) {
 1370:         context.showError(error.message || "Failed to request approval.");
 1371:       }
 1372:     };
 1373:   });
 1374: 
 1375:   Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
 1376:     button.onclick = async () => {
 1377:       const action = button.getAttribute("data-governance-action");
 1378: 
 1379:       if (action === "refresh") {
 1380:         await refreshGovernance(projectName, session, rerender, context.showError);
 1381:         return;
 1382:       }
 1383: 
 1384:       if (action === "save-policy") {
 1385:         const policyRules = {};
 1386:         Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
 1387:           policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
 1388:         });
 1389: 
 1390:         const approvalOwners = {};
```

### decision button binding

```js
   49: function classifyEvidenceAsset(asset) {
   50:   if (!asset) return "other";
   51:   const s = JSON.stringify(asset).toLowerCase();
   52:   if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
   53:   if (s.includes("legal")) return "legal";
   54:   if (s.includes("pricing")) return "pricing";
   55:   if (s.includes("certificate")) return "certificate";
   56:   if (s.includes("proof")) return "proof";
   57:   if (s.includes("product")) return "product";
   58:   if (s.includes("brand")) return "brand";
   59:   if (s.includes("claim")) return "claim";
   60:   if (s.includes("media")) return "media";
   61:   if (s.includes("content")) return "content";
   62:   if (s.includes("library")) return "library";
   63:   return "other";
   64: }
   65: 
   66: function summarizeEvidenceState(evidence) {
   67:   // Returns true if any key evidence is present
   68:   return (
   69:     evidence.source_of_truth.length ||
   70:     evidence.legal.length ||
   71:     evidence.pricing.length ||
   72:     evidence.certificate.length ||
   73:     evidence.proof.length
   74:   );
   75: }
   76: 
   77: function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
   78:   const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
   79:   const hasEvidence = summarizeEvidenceState(evidence);
   80:   return `
   81:     <div class="governance-evidence-summary">
   82:       <div class="governance-evidence-summary-header">Evidence Summary</div>
   83:       <div class="governance-evidence-cards">
   84:         <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
   85:           <span class="governance-evidence-label">Source of Truth</span>
   86:           <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
   87:         </div>
   88:         <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
   89:           <span class="governance-evidence-label">Legal</span>
   90:           <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
   91:         </div>
   92:         <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
   93:           <span class="governance-evidence-label">Pricing</span>
   94:           <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
   95:         </div>
   96:         <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
   97:           <span class="governance-evidence-label">Certificate/Proof</span>
   98:           <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
   99:         </div>
  100:         <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
  101:           <span class="governance-evidence-label">Brand Asset</span>
  102:           <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
  103:         </div>
  104:         <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
  105:           <span class="governance-evidence-label">Product Asset</span>
  106:           <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
  107:         </div>
  108:       </div>
  109:       ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
  110:       <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
  111:     </div>
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
  229:   const safety = asObject(settings.safety);
```

### decision confirmation

```js
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
  229:   const safety = asObject(settings.safety);
  230:   const ai = asObject(settings.ai);
  231:   const operating = asObject(settings.operating);
  232: 
  233:   return {
  234:     policy_rules: {
  235:       approval_before_publish: Boolean(publishing.approvalBeforePublish),
  236:       high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
  237:       brand_safety_review_required: true,
  238:       allow_admin_override: true,
  239:       auto_escalate_critical_risk: String(operating.actionPolicy || "").toLowerCase().includes("blocked"),
  240:       freeze_publishing: false
  241:     },
  242:     approval_owners: {
  243:       content: asString(approval.contentOwner) || "Marketing lead",
  244:       media: asString(approval.mediaOwner) || "Creative lead",
  245:       campaign: asString(approval.adsOwner) || "Operations lead",
  246:       publishing: asString(settings.team?.publishAccess) || "Publisher",
  247:       compliance: "Compliance Reviewer",
  248:       overrides: "Admin"
  249:     },
  250:     settings_bridge: {
  251:       source: "settings-durable-record",
  252:       synced_at: new Date().toISOString(),
  253:       approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
  254:       claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
  255:       approval_before_publish: Boolean(publishing.approvalBeforePublish)
  256:     }
  257:   };
  258: }
  259: 
  260: function findApprovalForEntity(summary, entityType, entityId) {
  261:   return asArray(summary?.sections?.approval_queue).find((item) =>
  262:     asString(item.entity_type) === asString(entityType) &&
  263:     asString(item.entity_id) === asString(entityId)
  264:   ) || null;
  265: }
  266: 
  267: async function loadGovernance(projectName, session, rerender) {
  268:   if (!projectName || session.loading) return;
  269: 
  270:   session.loading = true;
  271:   session.error = "";
  272:   rerender();
  273: 
  274:   try {
  275:     session.summary = await fetchProjectGovernance(projectName, {
  276:       timeline_limit: 60
  277:     });
  278:     session.loaded = true;
  279:   } catch (error) {
  280:     session.error = error.message || "Failed to load governance console.";
  281:   } finally {
  282:     session.loading = false;
  283:     rerender();
  284:   }
  285: }
  286: 
  287: async function refreshGovernance(projectName, session, rerender, showError) {
  288:   session.loaded = false;
  289:   await loadGovernance(projectName, session, rerender);
  290:   if (session.error) {
  291:     showError?.(session.error);
  292:   }
```

### approval decision backend call

```js
 1232:                         data-entity-id="${escapeHtml(selectedItem.entity_id || selectedItem.id)}"
 1233:                         data-title="${escapeHtml(selectedItem.queue_title || "Governance review")}"
 1234:                         data-risk="${escapeHtml(selectedItem.queue_risk || "medium")}"
 1235:                         data-summary="${escapeHtml(selectedItem.queue_summary || "Governance review requested.")}"
 1236:                       >
 1237:                         Create Approval Request
 1238:                       </button>
 1239:                     `
 1240:                     : ""
 1241:                 }
 1242:               </div>
 1243:               <div class="governance-policy-summary-grid">
 1244:                 <div class="governance-policy-block">
 1245:                   <h4>Active overrides</h4>
 1246:                   <div class="governance-activity-list">
 1247:                     ${asArray(sections.override_controls?.active_overrides).length
 1248:                       ? asArray(sections.override_controls.active_overrides).slice(0, 4).map((item) => `
 1249:                         <div class="governance-activity-item">
 1250:                           <strong>${escapeHtml(`${titleCase(item.action || "override")} • ${item.entity_type || "entity"}`)}</strong>
 1251:                           <span>${escapeHtml(item.actor || "Operator")} • ${escapeHtml(formatDateTime(item.created_at))}</span>
 1252:                         </div>
 1253:                       `).join("")
 1254:                       : `<div class="empty-box">No active overrides are currently open.</div>`}
 1255:                   </div>
 1256:                 </div>
 1257:                 <div class="governance-policy-block">
 1258:                   <h4>Escalation chain</h4>
 1259:                   <div class="governance-rule-list">
 1260:                     ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
 1261:                       <div class="governance-rule-item">
 1262:                         <strong>${escapeHtml(titleCase(risk))}</strong>
 1263:                         <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
 1264:                       </div>
 1265:                     `).join("")}
 1266:                   </div>
 1267:                 </div>
 1268:               </div>
 1269:             </div>
 1270:           </section>
 1271:           </div>
 1272:         </div>
 1273: 
 1274:         <section class="panel std-ai-panel mhos-clean-surface mhos-executive-ai-panel">
 1275:           <div class="panel-header">
 1276:             <div>
 1277:               <div class="panel-kicker">AI preparation</div>
 1278:               <h3>Governance AI assistant</h3>
 1279:               <p>Explanation-only guidance. AI cannot approve, override, or change policy; backend decisions stay in governed controls.</p>
 1280:             </div>
 1281:           </div>
 1282:           <div class="simple-banner"><strong>AI guidance scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
 1283:           <div class="governance-ai-toolbar">
 1284:             <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
 1285:           </div>
 1286:           <div class="quick-actions std-quick-actions">
 1287:             ${prompts.map((item, index) => `
 1288:               <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
 1289:                 <span class="home-action-title">${escapeHtml(item.label)}</span>
 1290:                 <span class="home-action-meta">${escapeHtml(item.preview)}</span>
 1291:               </button>
 1292:             `).join("")}
 1293:           </div>
 1294:         </section>
 1295:       </div>
 1296:     </section>
 1297:   `;
 1298: }
 1299: 
 1300: function bindGovernance(context, projectName, session) {
 1301:   const root = context.$("pageRoot");
 1302:   if (!root) return;
 1303: 
 1304:   const rerender = () => {
 1305:     root.innerHTML = renderPage(projectName, session, context.escapeHtml);
 1306:     bindGovernance(context, projectName, session);
 1307:   };
 1308: 
 1309:   Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
 1310:     button.onclick = async () => {
 1311:       const approvalId = button.getAttribute("data-approval-id") || "";
 1312:       const decision = button.getAttribute("data-governance-decision") || "";
 1313:       const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
 1314:       const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
 1315:       const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
 1316: 
 1317:       if (!confirmGovernanceDecision(decision)) {
 1318:         return;
 1319:       }
 1320: 
 1321:       try {
 1322:         await decideProjectApproval(projectName, approvalId, {
 1323:           decision,
 1324:           note,
 1325:           actor: "governance-console",
 1326:           escalate_to: escalateTo
 1327:         });
 1328:         context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
 1329:         await refreshGovernance(projectName, session, rerender, context.showError);
 1330:       } catch (error) {
 1331:         context.showError(error.message || "Failed to update approval.");
 1332:       }
 1333:     };
 1334:   });
 1335: 
 1336:   Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
 1337:     button.onclick = () => {
 1338:       session.focus = button.getAttribute("data-governance-focus") || "all";
 1339:       rerender();
 1340:     };
 1341:   });
 1342: 
 1343:   Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
 1344:     button.onclick = () => {
 1345:       session.selectedKey = button.getAttribute("data-governance-select") || "";
 1346:       rerender();
 1347:     };
 1348:   });
 1349: 
 1350:   Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
 1351:     button.onclick = async () => {
 1352:       try {
 1353:         const ownership = asObject(session.summary?.review_model?.ownership);
 1354:         await createProjectApproval(projectName, {
 1355:           entity_type: button.getAttribute("data-entity-type") || "content_item",
 1356:           entity_id: button.getAttribute("data-entity-id") || "",
 1357:           title: `${button.getAttribute("data-title") || "Governance item"} approval`,
 1358:           summary: button.getAttribute("data-summary") || "Governance review requested.",
 1359:           reviewer: ownership.compliance || "Compliance Reviewer",
 1360:           reviewer_role: "compliance_reviewer",
 1361:           requested_by: "governance-console",
 1362:           requested_for: ownership.compliance || "Compliance Reviewer",
 1363:           risk_level: button.getAttribute("data-risk") || "medium",
 1364:           source_page: "governance",
 1365:           route_target: "governance"
 1366:         });
 1367:         context.showMessage("Approval request added to the governance queue.");
 1368:         await refreshGovernance(projectName, session, rerender, context.showError);
 1369:       } catch (error) {
 1370:         context.showError(error.message || "Failed to request approval.");
 1371:       }
 1372:     };
 1373:   });
 1374: 
 1375:   Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
 1376:     button.onclick = async () => {
 1377:       const action = button.getAttribute("data-governance-action");
 1378: 
 1379:       if (action === "refresh") {
 1380:         await refreshGovernance(projectName, session, rerender, context.showError);
 1381:         return;
 1382:       }
 1383: 
 1384:       if (action === "save-policy") {
 1385:         const policyRules = {};
 1386:         Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
 1387:           policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
 1388:         });
 1389: 
 1390:         const approvalOwners = {};
 1391:         Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
 1392:           approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
 1393:         });
 1394: 
 1395:         const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
 1396:         if (!confirmed) {
 1397:           return;
 1398:         }
 1399: 
 1400:         try {
 1401:           await updateProjectGovernancePolicy(projectName, {
 1402:             actor: "governance-console",
 1403:             policy_rules: policyRules,
 1404:             approval_owners: approvalOwners
 1405:           });
 1406:           context.showMessage("Backend Governance policy saved.");
 1407:           await refreshGovernance(projectName, session, rerender, context.showError);
 1408:         } catch (error) {
 1409:           context.showError(error.message || "Failed to save governance policy.");
 1410:         }
 1411:         return;
 1412:       }
```

### request approval binding

```js
   48: 
   49: function classifyEvidenceAsset(asset) {
   50:   if (!asset) return "other";
   51:   const s = JSON.stringify(asset).toLowerCase();
   52:   if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
   53:   if (s.includes("legal")) return "legal";
   54:   if (s.includes("pricing")) return "pricing";
   55:   if (s.includes("certificate")) return "certificate";
   56:   if (s.includes("proof")) return "proof";
   57:   if (s.includes("product")) return "product";
   58:   if (s.includes("brand")) return "brand";
   59:   if (s.includes("claim")) return "claim";
   60:   if (s.includes("media")) return "media";
   61:   if (s.includes("content")) return "content";
   62:   if (s.includes("library")) return "library";
   63:   return "other";
   64: }
   65: 
   66: function summarizeEvidenceState(evidence) {
   67:   // Returns true if any key evidence is present
   68:   return (
   69:     evidence.source_of_truth.length ||
   70:     evidence.legal.length ||
   71:     evidence.pricing.length ||
   72:     evidence.certificate.length ||
   73:     evidence.proof.length
   74:   );
   75: }
   76: 
   77: function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
   78:   const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
   79:   const hasEvidence = summarizeEvidenceState(evidence);
   80:   return `
   81:     <div class="governance-evidence-summary">
   82:       <div class="governance-evidence-summary-header">Evidence Summary</div>
   83:       <div class="governance-evidence-cards">
   84:         <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
   85:           <span class="governance-evidence-label">Source of Truth</span>
   86:           <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
   87:         </div>
   88:         <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
   89:           <span class="governance-evidence-label">Legal</span>
   90:           <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
   91:         </div>
   92:         <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
   93:           <span class="governance-evidence-label">Pricing</span>
   94:           <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
   95:         </div>
   96:         <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
   97:           <span class="governance-evidence-label">Certificate/Proof</span>
   98:           <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
   99:         </div>
  100:         <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
  101:           <span class="governance-evidence-label">Brand Asset</span>
  102:           <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
  103:         </div>
  104:         <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
  105:           <span class="governance-evidence-label">Product Asset</span>
  106:           <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
  107:         </div>
  108:       </div>
  109:       ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
  110:       <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
  111:     </div>
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
```

### request approval confirmation

```js
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
  229:   const safety = asObject(settings.safety);
  230:   const ai = asObject(settings.ai);
  231:   const operating = asObject(settings.operating);
  232: 
  233:   return {
  234:     policy_rules: {
  235:       approval_before_publish: Boolean(publishing.approvalBeforePublish),
  236:       high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
  237:       brand_safety_review_required: true,
  238:       allow_admin_override: true,
  239:       auto_escalate_critical_risk: String(operating.actionPolicy || "").toLowerCase().includes("blocked"),
  240:       freeze_publishing: false
  241:     },
  242:     approval_owners: {
  243:       content: asString(approval.contentOwner) || "Marketing lead",
  244:       media: asString(approval.mediaOwner) || "Creative lead",
  245:       campaign: asString(approval.adsOwner) || "Operations lead",
  246:       publishing: asString(settings.team?.publishAccess) || "Publisher",
  247:       compliance: "Compliance Reviewer",
  248:       overrides: "Admin"
  249:     },
  250:     settings_bridge: {
  251:       source: "settings-durable-record",
  252:       synced_at: new Date().toISOString(),
  253:       approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
  254:       claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
  255:       approval_before_publish: Boolean(publishing.approvalBeforePublish)
  256:     }
  257:   };
  258: }
  259: 
  260: function findApprovalForEntity(summary, entityType, entityId) {
  261:   return asArray(summary?.sections?.approval_queue).find((item) =>
  262:     asString(item.entity_type) === asString(entityType) &&
  263:     asString(item.entity_id) === asString(entityId)
  264:   ) || null;
  265: }
  266: 
  267: async function loadGovernance(projectName, session, rerender) {
  268:   if (!projectName || session.loading) return;
  269: 
  270:   session.loading = true;
  271:   session.error = "";
  272:   rerender();
  273: 
  274:   try {
  275:     session.summary = await fetchProjectGovernance(projectName, {
  276:       timeline_limit: 60
  277:     });
  278:     session.loaded = true;
  279:   } catch (error) {
  280:     session.error = error.message || "Failed to load governance console.";
  281:   } finally {
  282:     session.loading = false;
  283:     rerender();
  284:   }
  285: }
  286: 
  287: async function refreshGovernance(projectName, session, rerender, showError) {
  288:   session.loaded = false;
  289:   await loadGovernance(projectName, session, rerender);
  290:   if (session.error) {
  291:     showError?.(session.error);
  292:   }
  293: }
```

### policy save binding

```js
  390:       ${history.length ? `
  391:         <div class="governance-history">
  392:           ${history.map((entry) => `
  393:             <div class="governance-history-item">
  394:               <strong>${escapeHtml(titleCase(entry.action || "updated"))}</strong>
  395:               <span>${escapeHtml(entry.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(entry.at))}</span>
  396:             </div>
  397:           `).join("")}
  398:         </div>
  399:       ` : ""}
  400:     </article>
  401:   `;
  402: }
  403: 
  404: function renderReviewCard(item, type, escapeHtml, approval) {
  405:   const flags =
  406:     type === "claim"
  407:       ? asArray(item.claim_flags)
  408:       : type === "brand"
  409:         ? asArray(item.brand_safety_flags)
  410:         : asArray(item.publish_guardrails);
  411: 
  412:   return `
  413:     <article class="governance-card">
  414:       <div class="governance-card-head">
  415:         <div>
  416:           <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || type))}</div>
  417:           <h4>${escapeHtml(item.title || "Review item")}</h4>
  418:         </div>
  419:         <span class="card-badge ${approval ? "warning" : "neutral"}">${escapeHtml(approval ? "In approval queue" : "Not requested")}</span>
  420:       </div>
  421:       <div class="governance-meta">
  422:         <span>Status: ${escapeHtml(titleCase(item.status || "open"))}</span>
  423:         <span>ID: ${escapeHtml(item.entity_id || item.id)}</span>
  424:       </div>
  425:       ${renderFlagList(flags, "No issues detected.", escapeHtml)}
  426:       ${approval ? `
  427:         <div class="simple-banner">
  428:           <strong>Linked approval:</strong> ${escapeHtml(approval.title || approval.id)} • ${escapeHtml(titleCase(approval.status))}
  429:         </div>
  430:       ` : `
  431:         <div class="governance-actions">
  432:           <button
  433:             class="btn btn-secondary"
  434:             type="button"
  435:             data-governance-request-approval="true"
  436:             data-entity-type="${escapeHtml(item.entity_type || "content_item")}"
  437:             data-entity-id="${escapeHtml(item.entity_id || item.id)}"
  438:             data-title="${escapeHtml(item.title || "Governance review")}"
  439:             data-risk="${escapeHtml(flags[0]?.severity || "medium")}"
  440:             data-summary="${escapeHtml(flags.map((flag) => flag.message).join(" | ") || "Governance review requested.")}"
  441:           >
  442:             Create Approval Request
  443:           </button>
  444:         </div>
  445:       `}
  446:     </article>
  447:   `;
  448: }
  449: 
  450: function renderTimeline(items, escapeHtml) {
  451:   if (!items.length) {
  452:     return `<div class="empty-box">No audit history is available yet.</div>`;
  453:   }
  454: 
  455:   return `
  456:     <div class="governance-timeline">
  457:       ${items.map((item) => `
  458:         <div class="governance-timeline-item">
  459:           <div class="governance-timeline-dot"></div>
  460:           <div class="governance-timeline-copy">
  461:             <strong>${escapeHtml(item.title || titleCase(item.type || "event"))}</strong>
  462:             <p>${escapeHtml(item.summary || "Operational event recorded.")}</p>
  463:             <span>${escapeHtml(item.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(item.timestamp))}</span>
  464:           </div>
  465:         </div>
  466:       `).join("")}
  467:     </div>
  468:   `;
  469: }
  470: 
  471: function renderPolicyControls(summary, settingsDraft, escapeHtml) {
  472:   const policy = asObject(summary?.policy);
  473:   const rules = asObject(policy.policy_rules);
  474:   const owners = asObject(policy.approval_owners);
  475: 
  476:   return `
  477:     <div class="governance-policy-grid">
  478:       <label class="settings-toggle" for="governance-approval-before-publish">
  479:         <span class="settings-field-label">Require approval before publishing mutations</span>
  480:         <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
  481:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  482:       </label>
  483:       <label class="settings-toggle" for="governance-claim-review">
  484:         <span class="settings-field-label">Claim review required</span>
  485:         <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
  486:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  487:       </label>
  488:       <label class="settings-toggle" for="governance-brand-safety">
  489:         <span class="settings-field-label">Brand safety review required</span>
  490:         <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
  491:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  492:       </label>
  493:       <label class="settings-toggle" for="governance-auto-escalate">
  494:         <span class="settings-field-label">Auto-escalate critical risk</span>
  495:         <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
  496:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  497:       </label>
  498:       <label class="settings-toggle" for="governance-admin-override">
  499:         <span class="settings-field-label">Allow governed admin override</span>
  500:         <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
  501:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  502:       </label>
  503:       <label class="settings-toggle" for="governance-freeze-publishing">
  504:         <span class="settings-field-label">Freeze publishing mutations</span>
  505:         <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
  506:         <span class="settings-toggle-pill" aria-hidden="true"></span>
  507:       </label>
  508:       <div class="settings-field-block">
  509:         <label class="settings-field-label" for="governance-owner-content">Content owner</label>
  510:         <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
  511:       </div>
  512:       <div class="settings-field-block">
  513:         <label class="settings-field-label" for="governance-owner-media">Media owner</label>
  514:         <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
  515:       </div>
  516:       <div class="settings-field-block">
  517:         <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
  518:         <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
  519:       </div>
  520:     </div>
  521:   `;
  522: }
  523: 
  524: function savePromptToQuickCommand(context, prompt) {
  525:   const input = context.$?.("quickCommandInput");
  526:   if (input) {
  527:     input.value = prompt;
  528:   }
  529: }
  530: 
  531: function buildDecisionQueue(summary) {
  532:   const sections = asObject(summary.sections);
  533: 
  534:   const approvals = asArray(sections.approval_queue).map((item) => ({
  535:     ...item,
  536:     queue_kind: "approval",
  537:     selected_key: `approval:${asString(item.id)}`,
  538:     queue_title: item.title || "Approval item",
  539:     queue_summary: item.summary || "Awaiting review and decision.",
  540:     queue_status: item.status || "pending",
  541:     queue_risk: item.risk_level || "medium",
  542:     queue_owner: item.reviewer || item.requested_for || "Operator",
  543:     queue_created: item.created_at,
  544:     queue_flags: [
  545:       ...asArray(item.policy_flags),
  546:       ...asArray(item.claim_flags),
  547:       ...asArray(item.brand_safety_flags),
  548:       ...asArray(item.publish_guardrails)
  549:     ],
  550:     linked_approval: item
  551:   }));
  552: 
  553:   const claims = asArray(sections.claim_review).map((item) => {
  554:     const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
  555:     return {
  556:       ...item,
  557:       queue_kind: "claim",
  558:       selected_key: `claim:${asString(item.entity_id || item.id)}`,
  559:       queue_title: item.title || "Claim review item",
  560:       queue_summary: asArray(item.claim_flags).map((flag) => flag.message).join(" | ") || "No claim issues detected.",
  561:       queue_status: approval?.status || item.status || "open",
  562:       queue_risk: asArray(item.claim_flags)[0]?.severity || "medium",
  563:       queue_owner: approval?.reviewer || "Compliance Reviewer",
  564:       queue_created: approval?.created_at || item.updated_at || item.created_at,
  565:       queue_flags: asArray(item.claim_flags),
  566:       linked_approval: approval
  567:     };
  568:   });
  569: 
  570:   const brand = asArray(sections.brand_safety_review).map((item) => {
```

### policy confirmation

```js
   51:   const s = JSON.stringify(asset).toLowerCase();
   52:   if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
   53:   if (s.includes("legal")) return "legal";
   54:   if (s.includes("pricing")) return "pricing";
   55:   if (s.includes("certificate")) return "certificate";
   56:   if (s.includes("proof")) return "proof";
   57:   if (s.includes("product")) return "product";
   58:   if (s.includes("brand")) return "brand";
   59:   if (s.includes("claim")) return "claim";
   60:   if (s.includes("media")) return "media";
   61:   if (s.includes("content")) return "content";
   62:   if (s.includes("library")) return "library";
   63:   return "other";
   64: }
   65: 
   66: function summarizeEvidenceState(evidence) {
   67:   // Returns true if any key evidence is present
   68:   return (
   69:     evidence.source_of_truth.length ||
   70:     evidence.legal.length ||
   71:     evidence.pricing.length ||
   72:     evidence.certificate.length ||
   73:     evidence.proof.length
   74:   );
   75: }
   76: 
   77: function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
   78:   const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
   79:   const hasEvidence = summarizeEvidenceState(evidence);
   80:   return `
   81:     <div class="governance-evidence-summary">
   82:       <div class="governance-evidence-summary-header">Evidence Summary</div>
   83:       <div class="governance-evidence-cards">
   84:         <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
   85:           <span class="governance-evidence-label">Source of Truth</span>
   86:           <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
   87:         </div>
   88:         <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
   89:           <span class="governance-evidence-label">Legal</span>
   90:           <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
   91:         </div>
   92:         <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
   93:           <span class="governance-evidence-label">Pricing</span>
   94:           <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
   95:         </div>
   96:         <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
   97:           <span class="governance-evidence-label">Certificate/Proof</span>
   98:           <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
   99:         </div>
  100:         <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
  101:           <span class="governance-evidence-label">Brand Asset</span>
  102:           <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
  103:         </div>
  104:         <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
  105:           <span class="governance-evidence-label">Product Asset</span>
  106:           <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
  107:         </div>
  108:       </div>
  109:       ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
  110:       <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
  111:     </div>
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function severityClass(value) {
  177:   const normalized = asString(value).toLowerCase();
  178:   if (normalized === "critical") return "danger";
  179:   if (normalized === "high") return "warning";
  180:   if (normalized === "approved" || normalized === "success") return "success";
  181:   return "neutral";
  182: }
  183: 
  184: function getDecisionConfirmationMessage(decision) {
  185:   const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
  186: 
  187:   if (["approval", "approved", "approve"].includes(normalized)) {
  188:     return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
  189:   }
  190: 
  191:   if (["override", "overridden"].includes(normalized)) {
  192:     return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
  193:   }
  194: 
  195:   if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
  196:     return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
  229:   const safety = asObject(settings.safety);
  230:   const ai = asObject(settings.ai);
  231:   const operating = asObject(settings.operating);
```

### policy backend write

```js
 1311:       const approvalId = button.getAttribute("data-approval-id") || "";
 1312:       const decision = button.getAttribute("data-governance-decision") || "";
 1313:       const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
 1314:       const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
 1315:       const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
 1316: 
 1317:       if (!confirmGovernanceDecision(decision)) {
 1318:         return;
 1319:       }
 1320: 
 1321:       try {
 1322:         await decideProjectApproval(projectName, approvalId, {
 1323:           decision,
 1324:           note,
 1325:           actor: "governance-console",
 1326:           escalate_to: escalateTo
 1327:         });
 1328:         context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
 1329:         await refreshGovernance(projectName, session, rerender, context.showError);
 1330:       } catch (error) {
 1331:         context.showError(error.message || "Failed to update approval.");
 1332:       }
 1333:     };
 1334:   });
 1335: 
 1336:   Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
 1337:     button.onclick = () => {
 1338:       session.focus = button.getAttribute("data-governance-focus") || "all";
 1339:       rerender();
 1340:     };
 1341:   });
 1342: 
 1343:   Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
 1344:     button.onclick = () => {
 1345:       session.selectedKey = button.getAttribute("data-governance-select") || "";
 1346:       rerender();
 1347:     };
 1348:   });
 1349: 
 1350:   Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
 1351:     button.onclick = async () => {
 1352:       try {
 1353:         const ownership = asObject(session.summary?.review_model?.ownership);
 1354:         await createProjectApproval(projectName, {
 1355:           entity_type: button.getAttribute("data-entity-type") || "content_item",
 1356:           entity_id: button.getAttribute("data-entity-id") || "",
 1357:           title: `${button.getAttribute("data-title") || "Governance item"} approval`,
 1358:           summary: button.getAttribute("data-summary") || "Governance review requested.",
 1359:           reviewer: ownership.compliance || "Compliance Reviewer",
 1360:           reviewer_role: "compliance_reviewer",
 1361:           requested_by: "governance-console",
 1362:           requested_for: ownership.compliance || "Compliance Reviewer",
 1363:           risk_level: button.getAttribute("data-risk") || "medium",
 1364:           source_page: "governance",
 1365:           route_target: "governance"
 1366:         });
 1367:         context.showMessage("Approval request added to the governance queue.");
 1368:         await refreshGovernance(projectName, session, rerender, context.showError);
 1369:       } catch (error) {
 1370:         context.showError(error.message || "Failed to request approval.");
 1371:       }
 1372:     };
 1373:   });
 1374: 
 1375:   Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
 1376:     button.onclick = async () => {
 1377:       const action = button.getAttribute("data-governance-action");
 1378: 
 1379:       if (action === "refresh") {
 1380:         await refreshGovernance(projectName, session, rerender, context.showError);
 1381:         return;
 1382:       }
 1383: 
 1384:       if (action === "save-policy") {
 1385:         const policyRules = {};
 1386:         Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
 1387:           policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
 1388:         });
 1389: 
 1390:         const approvalOwners = {};
 1391:         Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
 1392:           approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
 1393:         });
 1394: 
 1395:         const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
 1396:         if (!confirmed) {
 1397:           return;
 1398:         }
 1399: 
 1400:         try {
 1401:           await updateProjectGovernancePolicy(projectName, {
 1402:             actor: "governance-console",
 1403:             policy_rules: policyRules,
 1404:             approval_owners: approvalOwners
 1405:           });
 1406:           context.showMessage("Backend Governance policy saved.");
 1407:           await refreshGovernance(projectName, session, rerender, context.showError);
 1408:         } catch (error) {
 1409:           context.showError(error.message || "Failed to save governance policy.");
 1410:         }
 1411:         return;
 1412:       }
 1413: 
 1414:       if (action === "sync-settings") {
 1415:         const settingsDraft = getSettingsDraftFromPolicy(session.summary);
 1416:         if (!Object.keys(settingsDraft).length) {
 1417:           context.showError("No durable Settings snapshot was found in the governance bridge for this project.");
 1418:           return;
 1419:         }
 1420: 
 1421:         const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
 1422:         if (!confirmed) {
 1423:           return;
 1424:         }
 1425: 
 1426:         try {
 1427:           await updateProjectGovernancePolicy(projectName, {
 1428:             actor: "governance-console",
 1429:             ...mapSettingsToGovernancePolicy(settingsDraft)
 1430:           });
 1431:           context.showMessage("Settings-derived rules synced into durable Governance policy.");
 1432:           await refreshGovernance(projectName, session, rerender, context.showError);
 1433:         } catch (error) {
 1434:           context.showError(error.message || "Failed to sync Settings into Governance.");
 1435:         }
 1436:       }
 1437:     };
 1438:   });
 1439: 
 1440:   Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
 1441:     button.onclick = () => {
 1442:       context.navigateTo("ai-command");
 1443:     };
 1444:   });
 1445: 
 1446:   const queueItems = buildDecisionQueue(asObject(session.summary));
 1447:   const selectedItem = queueItems.find((item) => item.selected_key === session.selectedKey) || queueItems[0] || null;
 1448:   const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
 1449:   Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
 1450:     button.onclick = () => {
 1451:       const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];
 1452:       if (!prompt) return;
 1453:       savePromptToQuickCommand(context, prompt.prompt);
 1454:       context.navigateTo("ai-command");
 1455:       context.showMessage?.("Governance prompt added to AI Command.");
 1456:     };
 1457:   });
 1458: }
 1459: 
 1460: export const governanceRoute = {
 1461:   id: "governance",
 1462:   disableStandardLayout: true,
 1463:   meta: {
 1464:     eyebrow: "System",
 1465:     title: "Governance",
 1466:     description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."
 1467:   },
 1468:   template: `<section class="page is-active" data-page="governance"><div class="governance-shell"></div></section>`,
 1469:   render(context) {
 1470:     const state = context.getState();
 1471:     const projectName = state?.context?.currentProject || "";
 1472:     const session = ensureSession(projectName);
 1473:     const root = context.$("pageRoot");
 1474: 
 1475:     if (!root) return;
 1476: 
 1477:     const rerender = () => {
 1478:       root.innerHTML = renderPage(projectName, session, context.escapeHtml);
 1479:       bindGovernance(context, projectName, session);
 1480:     };
 1481: 
 1482:     if (projectName && !session.loaded && !session.loading) {
 1483:       loadGovernance(projectName, session, rerender);
 1484:       return;
 1485:     }
 1486: 
 1487:     rerender();
 1488:   }
 1489: };
 1490: 
```

### refresh action

```js
  197:   }
  198: 
  199:   return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
  200: }
  201: 
  202: function confirmGovernanceDecision(decision) {
  203:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  204:   return window.confirm(getDecisionConfirmationMessage(decision));
  205: }
  206: 
  207: function ensureSession(projectName) {
  208:   const key = projectName || "__default__";
  209:   if (!governanceSessions.has(key)) {
  210:     governanceSessions.set(key, {
  211:       loaded: false,
  212:       loading: false,
  213:       error: "",
  214:       summary: null,
  215:       focus: "all",
  216:       selectedKey: ""
  217:     });
  218:   }
  219:   return governanceSessions.get(key);
  220: }
  221: 
  222: function getSettingsDraftFromPolicy(summary) {
  223:   return asObject(asObject(summary?.policy).settings_bridge?.form);
  224: }
  225: 
  226: function mapSettingsToGovernancePolicy(settings = {}) {
  227:   const approval = asObject(settings.approval);
  228:   const publishing = asObject(settings.publishing);
  229:   const safety = asObject(settings.safety);
  230:   const ai = asObject(settings.ai);
  231:   const operating = asObject(settings.operating);
  232: 
  233:   return {
  234:     policy_rules: {
  235:       approval_before_publish: Boolean(publishing.approvalBeforePublish),
  236:       high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
  237:       brand_safety_review_required: true,
  238:       allow_admin_override: true,
  239:       auto_escalate_critical_risk: String(operating.actionPolicy || "").toLowerCase().includes("blocked"),
  240:       freeze_publishing: false
  241:     },
  242:     approval_owners: {
  243:       content: asString(approval.contentOwner) || "Marketing lead",
  244:       media: asString(approval.mediaOwner) || "Creative lead",
  245:       campaign: asString(approval.adsOwner) || "Operations lead",
  246:       publishing: asString(settings.team?.publishAccess) || "Publisher",
  247:       compliance: "Compliance Reviewer",
  248:       overrides: "Admin"
  249:     },
  250:     settings_bridge: {
  251:       source: "settings-durable-record",
  252:       synced_at: new Date().toISOString(),
  253:       approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
  254:       claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
  255:       approval_before_publish: Boolean(publishing.approvalBeforePublish)
  256:     }
  257:   };
  258: }
  259: 
  260: function findApprovalForEntity(summary, entityType, entityId) {
  261:   return asArray(summary?.sections?.approval_queue).find((item) =>
  262:     asString(item.entity_type) === asString(entityType) &&
  263:     asString(item.entity_id) === asString(entityId)
  264:   ) || null;
  265: }
  266: 
  267: async function loadGovernance(projectName, session, rerender) {
  268:   if (!projectName || session.loading) return;
  269: 
  270:   session.loading = true;
  271:   session.error = "";
  272:   rerender();
  273: 
  274:   try {
  275:     session.summary = await fetchProjectGovernance(projectName, {
  276:       timeline_limit: 60
  277:     });
  278:     session.loaded = true;
  279:   } catch (error) {
  280:     session.error = error.message || "Failed to load governance console.";
  281:   } finally {
  282:     session.loading = false;
  283:     rerender();
  284:   }
  285: }
  286: 
  287: async function refreshGovernance(projectName, session, rerender, showError) {
  288:   session.loaded = false;
  289:   await loadGovernance(projectName, session, rerender);
  290:   if (session.error) {
  291:     showError?.(session.error);
  292:   }
  293: }
  294: 
  295: function renderMetric(label, value, helper, escapeHtml) {
  296:   return `
  297:     <div class="governance-metric">
  298:       <span>${escapeHtml(label)}</span>
  299:       <strong>${escapeHtml(asString(value))}</strong>
  300:       <small>${escapeHtml(helper)}</small>
  301:     </div>
  302:   `;
  303: }
  304: 
  305: function renderReviewOwnership(summary, escapeHtml) {
  306:   const reviewModel = asObject(summary?.review_model);
  307:   const ownership = asObject(reviewModel.ownership);
  308:   const escalationChain = asObject(reviewModel.escalation_chain);
  309: 
  310:   return `
  311:     <article class="panel std-detail-card mhos-clean-surface">
  312:       <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
  313:       <div class="governance-card-list">
  314:         ${Object.entries(ownership).map(([key, value]) => `
  315:           <div class="governance-card">
  316:             <div class="governance-card-head">
  317:               <div>
  318:                 <div class="panel-kicker">${escapeHtml(titleCase(key))}</div>
  319:                 <h4>${escapeHtml(asString(value) || titleCase(key))}</h4>
  320:               </div>
  321:               <span class="card-badge neutral">Owner</span>
  322:             </div>
  323:           </div>
  324:         `).join("")}
  325:       </div>
  326:       <div class="workflow-history-list">
  327:         ${Object.entries(escalationChain).map(([risk, roles]) => `
  328:           <div class="workflow-history-item">
  329:             <strong>${escapeHtml(titleCase(risk))}</strong>
  330:             <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
  331:           </div>
  332:         `).join("")}
  333:       </div>
  334:     </article>
  335:   `;
  336: }
  337: 
  338: function renderFlagList(flags, emptyText, escapeHtml) {
  339:   if (!flags.length) {
  340:     return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  341:   }
  342: 
  343:   return `
  344:     <div class="governance-flag-list">
  345:       ${flags.map((flag) => `
  346:         <div class="governance-flag">
  347:           <span class="card-badge ${severityClass(flag.severity)}">${escapeHtml(titleCase(flag.severity || "info"))}</span>
  348:           <strong>${escapeHtml(flag.message || flag.label || "Flagged")}</strong>
  349:         </div>
  350:       `).join("")}
  351:     </div>
  352:   `;
  353: }
  354: 
  355: function renderApprovalCard(item, escapeHtml) {
  356:   const flags = [
  357:     ...asArray(item.policy_flags),
  358:     ...asArray(item.claim_flags),
  359:     ...asArray(item.brand_safety_flags),
  360:     ...asArray(item.publish_guardrails)
  361:   ];
  362:   const noteId = `gov-note-${item.id}`;
  363:   const history = asArray(item.history).slice(0, 3);
  364: 
  365:   return `
  366:     <article class="governance-card">
  367:       <div class="governance-card-head">
  368:         <div>
  369:           <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || "approval"))}</div>
  370:           <h4>${escapeHtml(item.title || "Approval item")}</h4>
  371:         </div>
  372:         <span class="card-badge ${severityClass(item.risk_level || item.status)}">${escapeHtml(titleCase(item.status || item.risk_level || "pending"))}</span>
  373:       </div>
  374:       <div class="governance-meta">
  375:         <span>Risk: ${escapeHtml(titleCase(item.risk_level || "medium"))}</span>
  376:         <span>Reviewer: ${escapeHtml(item.reviewer || "Operator")}</span>
  377:         <span>Requested by: ${escapeHtml(item.requested_by || "MH Assistant")}</span>
```

### AI handoff/routing

```js
  832:       publish: "publish",
  833:       escalations: "escalation"
  834:     };
  835:     visibleQueue = queueItems.filter((item) => item.queue_kind === focusMap[session.focus]);
  836:   }
  837:   const selectedItem = visibleQueue.find((item) => item.selected_key === session.selectedKey) || visibleQueue[0] || null;
  838:   session.selectedKey = selectedItem?.selected_key || "";
  839:   const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
  840:   const policy = asObject(summary.policy);
  841:   const rules = asObject(policy.policy_rules);
  842:   const owners = asObject(policy.approval_owners);
  843:   const settingsBridge = asObject(policy.settings_bridge);
  844:   const recentTimeline = asArray(sections.audit_timeline).slice(0, 4);
  845:   const readiness = buildReadinessSnapshot(summary, queueItems, selectedItem);
  846:   const highestRiskItem = findHighestRiskQueueItem(queueItems);
  847:   const executiveFocusItem = selectedItem || highestRiskItem;
  848:   const authorityOwner =
  849:     asString(executiveFocusItem?.queue_owner) ||
  850:     firstConfiguredOwner(owners) ||
  851:     "Governance owner";
  852:   const highestRiskValue = asString(highestRiskItem?.queue_risk || executiveFocusItem?.queue_risk);
  853:   const highestRiskLabel = highestRiskValue ? titleCase(highestRiskValue) : "No open risk";
  854:   const highestRiskTone = highestRiskValue ? severityClass(highestRiskValue) : "success";
  855:   const escalationRoute = getGovernanceEscalationRoute(summary, highestRiskValue || "high");
  856:   const selectedDecisionLabel = asString(executiveFocusItem?.queue_title || "No selected decision");
  857:   const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");
  858: 
  859:   return `
  860:     <section class="page is-active" data-page="governance">
  861:       <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
  862:         <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
  863:           <div class="panel-header mhos-context-main governance-operating-header-main">
  864:             <div>
  865:               <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
  866:               <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
  867:               <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
  868:             </div>
  869:             <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
  870:           </div>
  871: 
  872:           <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
  873:             <article class="mhos-executive-summary-item governance-summary-readiness">
  874:               <span class="mhos-executive-metric-label">Readiness</span>
  875:               <strong class="mhos-executive-metric-value">${escapeHtml(readiness.state)}</strong>
  876:               <small class="mhos-executive-metric-note">${escapeHtml(`${readiness.totalQueue} open decision${readiness.totalQueue === 1 ? "" : "s"}`)}</small>
  877:             </article>
  878:             <article class="mhos-executive-summary-item governance-summary-approval">
  879:               <span class="mhos-executive-metric-label">Approval Pressure</span>
  880:               <strong class="mhos-executive-metric-value">${escapeHtml(asString(readiness.approvals))}</strong>
  881:               <small class="mhos-executive-metric-note">${escapeHtml(readiness.approvals ? "Awaiting governed decision" : "No approval queue pressure")}</small>
  882:             </article>
  883:             <article class="mhos-executive-summary-item governance-summary-escalation">
  884:               <span class="mhos-executive-metric-label">Escalation State</span>
  885:               <strong class="mhos-executive-metric-value">${escapeHtml(readiness.escalations ? `${readiness.escalations} active` : "Clear")}</strong>
  886:               <small class="mhos-executive-metric-note">${escapeHtml(escalationRoute)}</small>
  887:             </article>
  888:             <article class="mhos-executive-summary-item governance-summary-owner">
  889:               <span class="mhos-executive-metric-label">Authority Owner</span>
  890:               <strong class="mhos-executive-metric-value">${escapeHtml(authorityOwner)}</strong>
  891:               <small class="mhos-executive-metric-note">${escapeHtml(selectedDecisionKind)} focus</small>
  892:             </article>
  893:             <article class="mhos-executive-summary-item governance-summary-risk">
  894:               <span class="mhos-executive-metric-label">Highest Risk</span>
  895:               <strong class="mhos-executive-metric-value">${escapeHtml(highestRiskLabel)}</strong>
  896:               <small class="mhos-executive-metric-note">${escapeHtml(selectedDecisionLabel)}</small>
  897:             </article>
  898:             <article class="mhos-executive-summary-item governance-summary-ai-boundary">
  899:               <span class="mhos-executive-metric-label">AI Role</span>
  900:               <strong class="mhos-executive-metric-value governance-ai-boundary">Prepare / Review / Summarize Only</strong>
  901:               <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve or change policy. Human backend decision required.</small>
  902:             </article>
  903:           </div>
  904: 
  905:           <div class="governance-policy-summary-grid">
  906:             <div class="governance-policy-block mhos-executive-panel">
  907:               <h4>Next best governance action</h4>
  908:               <p class="governance-copy mhos-executive-guidance">${escapeHtml(readiness.nextBestAction)}</p>
  909:               <div class="governance-rule-list">
  910:                 <div class="governance-rule-item">
  911:                   <strong>Owner</strong>
  912:                   <span>${escapeHtml(authorityOwner)}</span>
  913:                 </div>
  914:                 <div class="governance-rule-item">
  915:                   <strong>Risk</strong>
  916:                   <span><span class="card-badge ${highestRiskTone}">${escapeHtml(highestRiskLabel)}</span></span>
  917:                 </div>
  918:               </div>
  919:               <div class="governance-actions std-action-row">
  920:                 <button class="btn btn-secondary" type="button" data-governance-focus="all">View Full Queue</button>
  921:                 <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Open Approvals</button>
  922:                 <button class="btn btn-secondary" type="button" data-governance-open-ai>Ask AI for Guidance</button>
  923:               </div>
  924:             </div>
  925:             <div class="governance-policy-block">
  926:               <h4>Current blockers</h4>
  927:               <div class="governance-activity-list">
  928:                 ${readiness.blockers.length
  929:                   ? readiness.blockers.map((item) => `
  930:                     <div class="governance-activity-item">
  931:                       <strong>Action needed</strong>
  932:                       <span>${escapeHtml(item)}</span>
  933:                     </div>
  934:                   `).join("")
  935:                   : `<div class="empty-box">No active governance blockers detected.</div>`}
  936:               </div>
  937:             </div>
  938:             <div class="governance-policy-block">
  939:               <h4>Safe execution path</h4>
  940:               <div class="governance-rule-list">
  941:                 <div class="governance-rule-item">
  942:                   <strong>Approval route</strong>
  943:                   <span>${escapeHtml(readiness.approvals ? "Review queued approvals" : "No queued approvals")}</span>
  944:                 </div>
  945:                 <div class="governance-rule-item">
  946:                   <strong>Escalation route</strong>
  947:                   <span>${escapeHtml(escalationRoute)}</span>
  948:                 </div>
  949:               </div>
  950:             </div>
  951:           </div>
  952: 
  953:           <div class="governance-actions std-action-row mhos-executive-action-row">
  954:             <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance Data</button>
  955:             <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI Context</button>
  956:             <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Focus Approvals</button>
  957:           </div>
  958:         </section>
  959: 
  960:         <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
  961:           <div class="panel-header">
  962:             <div>
  963:               <div class="panel-kicker">Supporting signals</div>
  964:               <h3>Governance signal inventory</h3>
  965:               <p>Counts remain visible below the executive action band.</p>
  966:             </div>
  967:           </div>
  968:           <div class="governance-overview-grid">
  969:             ${renderMetric("Approval Queue", asArray(sections.approval_queue).length, "Awaiting decision", escapeHtml)}
  970:             ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
  971:             ${renderMetric("Claim Review", asArray(sections.claim_review).length, "Risky AI claims", escapeHtml)}
  972:             ${renderMetric("Brand Safety", asArray(sections.brand_safety_review).length, "Creative flags", escapeHtml)}
  973:             ${renderMetric("Publish Guardrails", asArray(sections.publish_guardrails).length, "Release blockers", escapeHtml)}
  974:             ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
  975:           </div>
  976:           <div class="governance-activity-list">
  977:             ${recentTimeline.length
  978:               ? recentTimeline.map((item) => `
  979:                 <div class="governance-activity-item">
  980:                   <strong>${escapeHtml(item.title || titleCase(item.type || "event"))}</strong>
  981:                   <span>${escapeHtml(item.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(item.timestamp))}</span>
  982:                 </div>
  983:               `).join("")
  984:               : `<div class="empty-box">No audit history is available yet.</div>`}
  985:           </div>
  986:         </section>
  987: 
  988:         <div class="governance-workspace-grid">
  989:           <div class="governance-action-stack std-main-column mhos-clean-stack">
  990:             <section class="panel std-detail-card mhos-clean-surface">
  991:               <div class="panel-header">
  992:                 <div>
  993:                   <div class="panel-kicker">Policy and rule summary</div>
  994:                   <h3>Policy visibility</h3>
  995:                   <p>Rules, owners, and Settings bridge state.</p>
  996:                 </div>
  997:               </div>
  998:               <div class="governance-policy-summary-grid">
  999:                 <div class="governance-policy-block">
 1000:                   <h4>Active rules</h4>
 1001:                   <div class="governance-rule-list">
 1002:                     ${Object.entries(rules).map(([key, value]) => `
 1003:                       <div class="governance-rule-item">
 1004:                         <strong>${escapeHtml(titleCase(key))}</strong>
 1005:                         <span>${escapeHtml(value ? "Enabled" : "Disabled")}</span>
 1006:                       </div>
 1007:                     `).join("")}
 1008:                   </div>
 1009:                 </div>
 1010:                 <div class="governance-policy-block">
 1011:                   <h4>Approval owners</h4>
 1012:                   <div class="governance-rule-list">
```

### copy compact issues

```js
    1: // --- Governance Evidence Summary & Intake Patch ---
    2: // Evidence helpers
    3: function asSafeArray(val) {
    4:   return Array.isArray(val) ? val : val ? [val] : [];
    5: }
    6: 
    7: function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
    8:   // Defensive extraction of evidence assets
    9:   const evidence = {
   10:     source_of_truth: [],
   11:     legal: [],
   12:     pricing: [],
   13:     certificate: [],
   14:     proof: [],
   15:     product: [],
   16:     brand: [],
   17:     claim: [],
   18:     media: [],
   19:     content: [],
   20:     library: [],
   21:     other: []
   22:   };
   23:   const sources = [selectedItem, projectData, governanceData];
   24:   sources.forEach((src) => {
   25:     if (!src) return;
   26:     Object.entries(src).forEach(([k, v]) => {
   27:       const key = k.toLowerCase();
   28:       if (/source_of_truth|source/.test(key)) evidence.source_of_truth.push(v);
   29:       else if (/legal/.test(key)) evidence.legal.push(v);
   30:       else if (/pricing/.test(key)) evidence.pricing.push(v);
   31:       else if (/certificate|certificates/.test(key)) evidence.certificate.push(v);
   32:       else if (/proof/.test(key)) evidence.proof.push(v);
   33:       else if (/product/.test(key)) evidence.product.push(v);
   34:       else if (/brand/.test(key)) evidence.brand.push(v);
   35:       else if (/claim/.test(key)) evidence.claim.push(v);
   36:       else if (/media/.test(key)) evidence.media.push(v);
   37:       else if (/content/.test(key)) evidence.content.push(v);
   38:       else if (/library/.test(key)) evidence.library.push(v);
   39:       else evidence.other.push(v);
   40:     });
   41:   });
   42:   // Flatten and filter
   43:   Object.keys(evidence).forEach((k) => {
   44:     evidence[k] = asSafeArray(evidence[k]).flat().filter(Boolean);
   45:   });
   46:   return evidence;
   47: }
   48: 
   49: function classifyEvidenceAsset(asset) {
   50:   if (!asset) return "other";
   51:   const s = JSON.stringify(asset).toLowerCase();
   52:   if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
   53:   if (s.includes("legal")) return "legal";
   54:   if (s.includes("pricing")) return "pricing";
   55:   if (s.includes("certificate")) return "certificate";
   56:   if (s.includes("proof")) return "proof";
   57:   if (s.includes("product")) return "product";
   58:   if (s.includes("brand")) return "brand";
   59:   if (s.includes("claim")) return "claim";
   60:   if (s.includes("media")) return "media";
   61:   if (s.includes("content")) return "content";
   62:   if (s.includes("library")) return "library";
   63:   return "other";
   64: }
   65: 
   66: function summarizeEvidenceState(evidence) {
   67:   // Returns true if any key evidence is present
   68:   return (
   69:     evidence.source_of_truth.length ||
   70:     evidence.legal.length ||
   71:     evidence.pricing.length ||
   72:     evidence.certificate.length ||
   73:     evidence.proof.length
   74:   );
   75: }
   76: 
   77: function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
   78:   const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
   79:   const hasEvidence = summarizeEvidenceState(evidence);
   80:   return `
   81:     <div class="governance-evidence-summary">
   82:       <div class="governance-evidence-summary-header">Evidence Summary</div>
   83:       <div class="governance-evidence-cards">
   84:         <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
   85:           <span class="governance-evidence-label">Source of Truth</span>
   86:           <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
   87:         </div>
   88:         <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
   89:           <span class="governance-evidence-label">Legal</span>
   90:           <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
   91:         </div>
   92:         <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
   93:           <span class="governance-evidence-label">Pricing</span>
   94:           <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
   95:         </div>
   96:         <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
   97:           <span class="governance-evidence-label">Certificate/Proof</span>
   98:           <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
   99:         </div>
  100:         <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
  101:           <span class="governance-evidence-label">Brand Asset</span>
  102:           <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
  103:         </div>
  104:         <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
  105:           <span class="governance-evidence-label">Product Asset</span>
  106:           <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
  107:         </div>
  108:       </div>
  109:       ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
  110:       <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
  111:     </div>
  112:   `;
  113: }
  114: 
  115: function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  116:   // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  117:   const items = [];
  118:   if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  119:   if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  120:   if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  121:   if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  122:   if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  123:   if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  124:   if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  125:   if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  126:   return `
  127:     <div class="governance-intake-panel">
  128:       <div class="governance-intake-panel-header">Incoming Review Context</div>
  129:       <div class="governance-intake-list">
  130:         ${items.length ? items.map((item) => `
  131:           <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
  132:         `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
  133:       </div>
  134:     </div>
  135:   `;
  136: }
  137: import {
  138:   createProjectApproval,
  139:   decideProjectApproval,
  140:   fetchProjectGovernance,
  141:   updateProjectGovernancePolicy
  142: } from "../api.js";
  143: 
  144: const governanceSessions = new Map();
  145: 
  146: function asArray(value) {
  147:   return Array.isArray(value) ? value : [];
  148: }
  149: 
  150: function asObject(value) {
  151:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  152: }
  153: 
  154: function asString(value) {
  155:   if (value == null) return "";
  156:   return String(value);
  157: }
  158: 
  159: function titleCase(value) {
  160:   return asString(value)
  161:     .replace(/[_-]+/g, " ")
  162:     .replace(/\b\w/g, (match) => match.toUpperCase());
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
```


## Verdict

| Area | Verdict |
|---|---|
| Approval decision backend call | Found |
| Approval decision confirmation | Found |
| Approval request creation | Found - verify confirmation requirement |
| Governance policy durable write | Found |
| Governance policy confirmation | Found |
| Refresh-only action | Found |
| AI routing/handoff | Found |
| Compact copy issues | Not found |

## Decision Guidance
- If createProjectApproval has no confirmation, add a minimal confirmation gate before creating approval requests.
- If decideProjectApproval is protected by confirmGovernanceDecision, no patch needed for that path.
- If updateProjectGovernancePolicy is protected by explicit policy save confirmation, no patch needed for that path.
- Compact copy issues may be fixed only if touching this file for a required patch, or later in UX/copy polish.
- Do not patch from T40 alone unless exact missing confirmation is confirmed.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
