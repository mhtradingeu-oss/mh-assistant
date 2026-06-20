# T39 — Governance Runtime Authority + Approval Decision Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/governance.js

## Why This Page Is Next
T38 rebaseline ranked Governance as the highest remaining open frontend risk candidate.

T38 signals:
- Score: 440.5
- Priority: P0
- Lines: 1490
- API/write signals: 102
- Authority words: 714
- Confirmations: 4

## Purpose
Verify whether Governance:
- approves/rejects items directly
- mutates governance policy or approval state
- uses explicit confirmation gates for sensitive decisions
- routes approvals/tasks/handoffs correctly
- renders dynamic approval/policy content safely
- needs runtime patch or closeout

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 1305 | 2 |
| Escape / safe rendering evidence | 77 | 180 |
| Imported/backend API calls | 110 | 25 |
| Approval decision signals | 110 | 127 |
| Governance policy/action wording | 1 | 462 |
| Confirmation gates | 203 | 4 |
| Dangerous/direct actions | 110 | 85 |
| Event handlers | 188 | 16 |
| Project/task/handoff writes | 138 | 7 |
| Routing/handoff | 110 | 20 |
| Local/session storage | n/a | 0 |
| Copy defect candidates | n/a | 0 |


## Evidence Zones

### HTML render / innerHTML

```js
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
 1391:         Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
 1392:           approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
 1393:         });
 1394: 
 1395:         const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
```

### Escape / safe rendering evidence

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
```

### Imported/backend API calls

```js
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
```

### Approval decision signals

```js
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
```

### Governance policy/action wording

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
```

### Confirmation gates

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

### Dangerous/direct actions

```js
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
```

### Event handlers

```js
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
```

### Project/task/handoff writes

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

### Routing/handoff

```js
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
```

### Local/session storage

```js
_No match found._
```

### Copy defect candidates

```js
_No match found._
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | Found - focused proof required |
| Approval decision signals | Found - focused proof required |
| Confirmation gates | Found |
| Governance policy write signals | Found - focused proof required |
| Handoff/routing signals | Found |
| Local/session storage | Not found |
| Dangerous/direct wording | Found - determine wording vs execution |

## Decision Guidance
- If Governance approves/rejects backend approval items, every decision path must require explicit confirmation.
- If policy writes exist, verify confirmation and backend authority.
- If handoffs/tasks are created, verify whether they are review-only or durable mutations.
- If dangerous terms are only labels/statuses, no patch is required.
- Do not patch from T39 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
