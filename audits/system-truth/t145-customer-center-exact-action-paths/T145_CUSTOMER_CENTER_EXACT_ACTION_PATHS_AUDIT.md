# T145 — Customer Center Exact Action Path Audit

## Status
Generated.

## Scope
- `public/control-center/pages/customer-center.js`

## Why this audit exists
T135 identified `customer-center.js` as the next highest open runtime-risk file after Setup.

This audit does not patch anything. It inspects exact action paths before deciding whether a patch is required.

## Summary

- Total lines: 470
- Event bindings: 1
- navigateTo calls: 3
- createProjectHandoff calls: 0
- setSharedHandoff calls: 2
- setSharedAiDraft calls: 1
- executeProjectAiCommand calls: 0
- provider mentions: 11
- sync mentions: 5
- import mentions: 1
- send mentions: 11
- email mentions: 1
- handoff mentions: 15
- confirm mentions: 4

## Authority Call Counts

| Term | Count |
|---|---:|
| createProjectHandoff | 0 |
| createProjectApproval | 0 |
| createProjectTask | 0 |
| executeProjectAiCommand | 0 |
| saveProject | 0 |
| saveProjectContentItem | 0 |
| saveProjectMediaItem | 0 |
| setSharedHandoff | 2 |
| setSharedAiDraft | 1 |

## Backend / Shared Authority Findings

### setSharedHandoff at line 398

```js
393:       context.showMessage?.("Customer Center context sent to AI Command.");
394:       return;
395:     }
396: 
397:     if (action === "task-handoff") {
398:       context.setSharedHandoff?.("task-center", {
399:         source: "customer-center",
400:         title: "Customer follow-up task preview",
401:         summary: "Review Customer Center state and prepare a human follow-up task. No customer mutation was performed."
402:       });
403:       context.navigateTo?.("task-center");
```

### setSharedHandoff at line 409

```js
404:       context.showMessage?.("Customer task handoff prepared.");
405:       return;
406:     }
407: 
408:     if (action === "governance-handoff") {
409:       context.setSharedHandoff?.("governance", {
410:         source: "customer-center",
411:         title: "Customer communication governance review",
412:         summary: "Review customer reply/escalation risk before any external response. No send action was performed."
413:       });
414:       context.navigateTo?.("governance");
```

### setSharedAiDraft at line 387

```js
382:       context.showMessage?.("Customer Center read-only data refreshed.");
383:       return;
384:     }
385: 
386:     if (action === "ai-handoff") {
387:       context.setSharedAiDraft?.({
388:         source: "customer-center",
389:         title: "Customer Center support prompt",
390:         prompt: "Review Customer Center read-only state. Summarize customer support risks, draft safe reply guidance, and identify escalation needs. Do not send replies or mutate CRM."
391:       });
392:       context.navigateTo?.("ai-command");
```

## Navigation Findings

### navigateTo at line 392

```js
387:       context.setSharedAiDraft?.({
388:         source: "customer-center",
389:         title: "Customer Center support prompt",
390:         prompt: "Review Customer Center read-only state. Summarize customer support risks, draft safe reply guidance, and identify escalation needs. Do not send replies or mutate CRM."
391:       });
392:       context.navigateTo?.("ai-command");
393:       context.showMessage?.("Customer Center context sent to AI Command.");
394:       return;
395:     }
396: 
397:     if (action === "task-handoff") {
```

### navigateTo at line 403

```js
398:       context.setSharedHandoff?.("task-center", {
399:         source: "customer-center",
400:         title: "Customer follow-up task preview",
401:         summary: "Review Customer Center state and prepare a human follow-up task. No customer mutation was performed."
402:       });
403:       context.navigateTo?.("task-center");
404:       context.showMessage?.("Customer task handoff prepared.");
405:       return;
406:     }
407: 
408:     if (action === "governance-handoff") {
```

### navigateTo at line 414

```js
409:       context.setSharedHandoff?.("governance", {
410:         source: "customer-center",
411:         title: "Customer communication governance review",
412:         summary: "Review customer reply/escalation risk before any external response. No send action was performed."
413:       });
414:       context.navigateTo?.("governance");
415:       context.showMessage?.("Customer governance handoff prepared.");
416:     }
417:   });
418: }
419: 
```

## Event Binding Findings

### addEventListener at line 375

```js
370: 
371: function attachCustomerCenterHandlers(context) {
372:   const root = document.querySelector('[data-page="customer-center"]');
373:   if (!root) return;
374: 
375:   root.addEventListener("click", async (event) => {
376:     const button = event.target.closest("[data-customer-center-action]");
377:     if (!button) return;
378: 
379:     const action = button.dataset.customerCenterAction;
380:     if (action === "refresh") {
```

## Confirmation Findings

### confirm at line 102

```js
97: }
98: 
99: function buildDisabledActions() {
100:   return [
101:     ["Send reply", "Locked: Customer Center v1 cannot send external replies or provider messages."],
102:     ["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
107:     ["Trigger IVR", "Locked: IVR provider execution is not enabled from Customer Center."],
```

### confirm at line 233

```js
228: 
229: function renderDisabledActions(actions) {
230:   return `
231:     <div class="customer-center-locked-actions" aria-label="Future customer actions locked">
232:       <div class="panel-kicker">Execution actions locked</div>
233:       <p class="muted">Visible for roadmap clarity only. These customer actions cannot execute here and require future confirmation gates, role permissions, provider readiness, and audit logging.</p>
234:       <div class="button-row">
235:         ${asArray(actions).map(([label, reason]) => `
236:           <button class="btn btn-ghost" type="button" disabled title="${escapeHtml(reason)}">
237:             ${escapeHtml(label)}
238:           </button>
```

### confirm at line 306

```js
301:         <p class="muted">${protectedReadStatusBody}</p>
302:       </div>
303: 
304:       <div class="panel mhos-clean-surface">
305:         <div class="panel-header"><div><div class="panel-kicker">Execution boundary</div><h3>No direct customer actions</h3></div></div>
306:         <p class="muted">This page can review customer context and prepare handoffs. Any future customer-facing action must happen in an owning workflow with confirmation, permissions, and audit logging.</p>
307:       </div>
308:     </section>
309: 
310:     ${renderProtectedReadGuard(model)}
311: 
```

### confirm at line 318

```js
313:       <div class="panel mhos-clean-surface">
314:         <div class="panel-header"><div><div class="panel-kicker">Readiness Locks</div><h3>Read-only customer operations mode</h3></div></div>
315:         <div class="ops-list">
316:           <article class="ops-list-item"><div><strong>Read-only projections</strong><p>Customer Center can display protected customer snapshots only.</p></div><span class="card-badge">Allowed</span></article>
317:           <article class="ops-list-item"><div><strong>External send</strong><p>Replies, social messages, SMS, and provider sends are unavailable here.</p></div><span class="card-badge">Locked</span></article>
318:           <article class="ops-list-item"><div><strong>CRM / Ticket / Assignment writes</strong><p>CRM notes, ticket updates, review marks, and ownership changes require future confirmation gates.</p></div><span class="card-badge">Locked</span></article>
319:           <article class="ops-list-item"><div><strong>Calls / IVR / Auto-reply</strong><p>Voice placement, IVR provider execution, and autonomous replies remain disabled.</p></div><span class="card-badge">Locked</span></article>
320:         </div>
321:       </div>
322: 
323:       <div class="panel mhos-clean-surface">
```

## Provider / Sync / Import Findings

### provider at line 101

```js
96:   };
97: }
98: 
99: function buildDisabledActions() {
100:   return [
101:     ["Send reply", "Locked: Customer Center v1 cannot send external replies or provider messages."],
102:     ["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
```

### provider at line 107

```js
102:     ["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
107:     ["Trigger IVR", "Locked: IVR provider execution is not enabled from Customer Center."],
108:     ["Sync CRM", "Locked: CRM provider execution is not enabled from Customer Center."],
109:     ["Auto-reply", "Locked: autonomous customer replies remain forbidden by default."]
110:   ];
111: }
112: 
```

### provider at line 108

```js
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
107:     ["Trigger IVR", "Locked: IVR provider execution is not enabled from Customer Center."],
108:     ["Sync CRM", "Locked: CRM provider execution is not enabled from Customer Center."],
109:     ["Auto-reply", "Locked: autonomous customer replies remain forbidden by default."]
110:   ];
111: }
112: 
113: function countWaitingReplies(inbox) {
```

### provider at line 145

```js
140:       </div>
141:       <p class="muted">${escapeHtml(model.guardMessage)}</p>
142:       <div class="empty-box">
143:         <strong>Protected-read setup required</strong>
144:         <p>This page is intentionally blank while protected customer read routes are disabled. Configure <code>MH_CONTROL_CENTER_WRITE_KEY</code> on the server, restart the service, then reload to show read-only projections.</p>
145:         <p>No placeholder customer records are shown. External send, CRM updates, ticket changes, calls, IVR, provider sync, and auto-reply remain locked.</p>
146:       </div>
147:     </section>
148:   `;
149: }
150: 
```

### provider at line 215

```js
210: }
211: 
212: function renderChannels(model) {
213:   const channels = asArray(model?.channels);
214:   if (!channels.length) {
215:     return renderEmptyState("No channel readiness records", "Provider readiness for email, social messaging, CRM, voice, and IVR will appear here when configured. Send and provider execution remain locked.");
216:   }
217: 
218:   return channels.map((channel) => `
219:     <article class="ops-list-item">
220:       <div>
```

### provider at line 221

```js
216:   }
217: 
218:   return channels.map((channel) => `
219:     <article class="ops-list-item">
220:       <div>
221:         <strong>${escapeHtml(channel.channel_id || channel.provider || "Channel")}</strong>
222:         <p>${escapeHtml(channel.blocked_reason || "Read-only projection only.")}</p>
223:       </div>
224:       <span class="card-badge">${channel.external_send_ready ? "Send ready" : "Send locked"}</span>
225:     </article>
226:   `).join("");
```

### provider at line 233

```js
228: 
229: function renderDisabledActions(actions) {
230:   return `
231:     <div class="customer-center-locked-actions" aria-label="Future customer actions locked">
232:       <div class="panel-kicker">Execution actions locked</div>
233:       <p class="muted">Visible for roadmap clarity only. These customer actions cannot execute here and require future confirmation gates, role permissions, provider readiness, and audit logging.</p>
234:       <div class="button-row">
235:         ${asArray(actions).map(([label, reason]) => `
236:           <button class="btn btn-ghost" type="button" disabled title="${escapeHtml(reason)}">
237:             ${escapeHtml(label)}
238:           </button>
```

### provider at line 317

```js
312:     <section class="page-grid page-grid-2">
313:       <div class="panel mhos-clean-surface">
314:         <div class="panel-header"><div><div class="panel-kicker">Readiness Locks</div><h3>Read-only customer operations mode</h3></div></div>
315:         <div class="ops-list">
316:           <article class="ops-list-item"><div><strong>Read-only projections</strong><p>Customer Center can display protected customer snapshots only.</p></div><span class="card-badge">Allowed</span></article>
317:           <article class="ops-list-item"><div><strong>External send</strong><p>Replies, social messages, SMS, and provider sends are unavailable here.</p></div><span class="card-badge">Locked</span></article>
318:           <article class="ops-list-item"><div><strong>CRM / Ticket / Assignment writes</strong><p>CRM notes, ticket updates, review marks, and ownership changes require future confirmation gates.</p></div><span class="card-badge">Locked</span></article>
319:           <article class="ops-list-item"><div><strong>Calls / IVR / Auto-reply</strong><p>Voice placement, IVR provider execution, and autonomous replies remain disabled.</p></div><span class="card-badge">Locked</span></article>
320:         </div>
321:       </div>
322: 
```

### provider at line 319

```js
314:         <div class="panel-header"><div><div class="panel-kicker">Readiness Locks</div><h3>Read-only customer operations mode</h3></div></div>
315:         <div class="ops-list">
316:           <article class="ops-list-item"><div><strong>Read-only projections</strong><p>Customer Center can display protected customer snapshots only.</p></div><span class="card-badge">Allowed</span></article>
317:           <article class="ops-list-item"><div><strong>External send</strong><p>Replies, social messages, SMS, and provider sends are unavailable here.</p></div><span class="card-badge">Locked</span></article>
318:           <article class="ops-list-item"><div><strong>CRM / Ticket / Assignment writes</strong><p>CRM notes, ticket updates, review marks, and ownership changes require future confirmation gates.</p></div><span class="card-badge">Locked</span></article>
319:           <article class="ops-list-item"><div><strong>Calls / IVR / Auto-reply</strong><p>Voice placement, IVR provider execution, and autonomous replies remain disabled.</p></div><span class="card-badge">Locked</span></article>
320:         </div>
321:       </div>
322: 
323:       <div class="panel mhos-clean-surface">
324:         <div class="panel-header"><div><div class="panel-kicker">Safe Operating Rules</div><h3>Preview-first support workflow</h3></div></div>
```

### provider at line 354

```js
349:     </section>
350: 
351:     <section class="page-grid page-grid-2">
352:       <div class="panel mhos-clean-surface">
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
```

### provider at line 365

```js
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
363:       <div class="panel mhos-clean-surface">
364:         <div class="panel-header"><div><div class="panel-kicker">AI Panel</div><h3>Draft and guidance only</h3></div></div>
365:         <p class="muted">AI may summarize read-only context, draft response guidance, translate, and suggest next steps for a human handoff. It must not send replies, update CRM, close tickets, assign conversations, place calls, trigger IVR, sync providers, or start auto-reply.</p>
366:       </div>
367:     </section>
368:   `;
369: }
370: 
```

### sync at line 53

```js
48: 
49: function getProtectedReadMessage(value) {
50:   return asString(value?.error || value?.message || value || "Protected read routes are disabled.");
51: }
52: 
53: async function loadCustomerCenterModel(projectName) {
54:   const [readiness, inbox, conversations, tickets, channels] = await Promise.all([
55:     fetchCustomerOperationsReadiness(projectName),
56:     fetchCustomerOperationsInbox(projectName),
57:     fetchCustomerConversations(projectName),
58:     fetchCustomerTickets(projectName),
```

### sync at line 145

```js
140:       </div>
141:       <p class="muted">${escapeHtml(model.guardMessage)}</p>
142:       <div class="empty-box">
143:         <strong>Protected-read setup required</strong>
144:         <p>This page is intentionally blank while protected customer read routes are disabled. Configure <code>MH_CONTROL_CENTER_WRITE_KEY</code> on the server, restart the service, then reload to show read-only projections.</p>
145:         <p>No placeholder customer records are shown. External send, CRM updates, ticket changes, calls, IVR, provider sync, and auto-reply remain locked.</p>
146:       </div>
147:     </section>
148:   `;
149: }
150: 
```

### sync at line 365

```js
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
363:       <div class="panel mhos-clean-surface">
364:         <div class="panel-header"><div><div class="panel-kicker">AI Panel</div><h3>Draft and guidance only</h3></div></div>
365:         <p class="muted">AI may summarize read-only context, draft response guidance, translate, and suggest next steps for a human handoff. It must not send replies, update CRM, close tickets, assign conversations, place calls, trigger IVR, sync providers, or start auto-reply.</p>
366:       </div>
367:     </section>
368:   `;
369: }
370: 
```

### sync at line 375

```js
370: 
371: function attachCustomerCenterHandlers(context) {
372:   const root = document.querySelector('[data-page="customer-center"]');
373:   if (!root) return;
374: 
375:   root.addEventListener("click", async (event) => {
376:     const button = event.target.closest("[data-customer-center-action]");
377:     if (!button) return;
378: 
379:     const action = button.dataset.customerCenterAction;
380:     if (action === "refresh") {
```

### sync at line 420

```js
415:       context.showMessage?.("Customer governance handoff prepared.");
416:     }
417:   });
418: }
419: 
420: async function loadAndRenderCustomerCenter(context) {
421:   const projectName = context.projectName || context.state?.projectName || "default";
422:   CUSTOMER_CENTER_STATE.loading = true;
423:   context.rerender?.();
424: 
425:   try {
```

### import at line 1

```js
1: import {
2:   fetchCustomerOperationsReadiness,
3:   fetchCustomerOperationsInbox,
4:   fetchCustomerConversations,
5:   fetchCustomerTickets,
6:   fetchCustomerChannels
```

## Send / Email / Message Findings

### send at line 101

```js
96:   };
97: }
98: 
99: function buildDisabledActions() {
100:   return [
101:     ["Send reply", "Locked: Customer Center v1 cannot send external replies or provider messages."],
102:     ["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
```

### send at line 145

```js
140:       </div>
141:       <p class="muted">${escapeHtml(model.guardMessage)}</p>
142:       <div class="empty-box">
143:         <strong>Protected-read setup required</strong>
144:         <p>This page is intentionally blank while protected customer read routes are disabled. Configure <code>MH_CONTROL_CENTER_WRITE_KEY</code> on the server, restart the service, then reload to show read-only projections.</p>
145:         <p>No placeholder customer records are shown. External send, CRM updates, ticket changes, calls, IVR, provider sync, and auto-reply remain locked.</p>
146:       </div>
147:     </section>
148:   `;
149: }
150: 
```

### send at line 224

```js
219:     <article class="ops-list-item">
220:       <div>
221:         <strong>${escapeHtml(channel.channel_id || channel.provider || "Channel")}</strong>
222:         <p>${escapeHtml(channel.blocked_reason || "Read-only projection only.")}</p>
223:       </div>
224:       <span class="card-badge">${channel.external_send_ready ? "Send ready" : "Send locked"}</span>
225:     </article>
226:   `).join("");
227: }
228: 
229: function renderDisabledActions(actions) {
```

### send at line 263

```js
258:   const protectedReadStatusBody = model.protectedReadGuard
259:     ? "Customer data is intentionally withheld until protected read routes are enabled on the server."
260:     : CUSTOMER_CENTER_STATE.error
261:       ? "Customer Center could not load the current read-only projection. Customer execution actions remain unavailable."
262:       : CUSTOMER_CENTER_STATE.loaded
263:         ? "Customer Center is using read-only projections only. Outbound sends, CRM writes, ticket changes, assignments, calls, IVR, and auto-replies remain unavailable."
264:         : "Customer Center will request protected read-only projections when the page initializes. No outbound or mutation action is available.";
265: 
266:   if (CUSTOMER_CENTER_STATE.loading) {
267:     return `
268:       <section class="page-grid">
```

### send at line 293

```js
288:       </div>
289:     </section>
290: 
291:     <section class="mhos-executive-summary-grid">
292:       ${renderMetric("Open Conversations", conversations.length || "0", "Read-only")}
293:       ${renderMetric("Waiting Replies", countWaitingReplies(inbox), "No auto-send")}
294:       ${renderMetric("SLA Risk", countSlaRisk([...tickets, ...inbox]), "Review only")}
295:       ${renderMetric("Channels", channels.length || "0", "Send locked")}
296:     </section>
297: 
298:     <section class="page-grid page-grid-2">
```

### send at line 317

```js
312:     <section class="page-grid page-grid-2">
313:       <div class="panel mhos-clean-surface">
314:         <div class="panel-header"><div><div class="panel-kicker">Readiness Locks</div><h3>Read-only customer operations mode</h3></div></div>
315:         <div class="ops-list">
316:           <article class="ops-list-item"><div><strong>Read-only projections</strong><p>Customer Center can display protected customer snapshots only.</p></div><span class="card-badge">Allowed</span></article>
317:           <article class="ops-list-item"><div><strong>External send</strong><p>Replies, social messages, SMS, and provider sends are unavailable here.</p></div><span class="card-badge">Locked</span></article>
318:           <article class="ops-list-item"><div><strong>CRM / Ticket / Assignment writes</strong><p>CRM notes, ticket updates, review marks, and ownership changes require future confirmation gates.</p></div><span class="card-badge">Locked</span></article>
319:           <article class="ops-list-item"><div><strong>Calls / IVR / Auto-reply</strong><p>Voice placement, IVR provider execution, and autonomous replies remain disabled.</p></div><span class="card-badge">Locked</span></article>
320:         </div>
321:       </div>
322: 
```

### send at line 325

```js
320:         </div>
321:       </div>
322: 
323:       <div class="panel mhos-clean-surface">
324:         <div class="panel-header"><div><div class="panel-kicker">Safe Operating Rules</div><h3>Preview-first support workflow</h3></div></div>
325:         <p class="muted">Use Customer Center to review, summarize, and prepare handoffs only. Nothing in this page sends a reply, changes CRM, updates tickets, assigns conversations, places calls, triggers IVR, or starts auto-reply.</p>
326:       </div>
327:     </section>
328: 
329:     <section class="page-grid page-grid-2">
330:       <div class="panel mhos-clean-surface">
```

### send at line 354

```js
349:     </section>
350: 
351:     <section class="page-grid page-grid-2">
352:       <div class="panel mhos-clean-surface">
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
```

### send at line 365

```js
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
363:       <div class="panel mhos-clean-surface">
364:         <div class="panel-header"><div><div class="panel-kicker">AI Panel</div><h3>Draft and guidance only</h3></div></div>
365:         <p class="muted">AI may summarize read-only context, draft response guidance, translate, and suggest next steps for a human handoff. It must not send replies, update CRM, close tickets, assign conversations, place calls, trigger IVR, sync providers, or start auto-reply.</p>
366:       </div>
367:     </section>
368:   `;
369: }
370: 
```

### send at line 390

```js
385: 
386:     if (action === "ai-handoff") {
387:       context.setSharedAiDraft?.({
388:         source: "customer-center",
389:         title: "Customer Center support prompt",
390:         prompt: "Review Customer Center read-only state. Summarize customer support risks, draft safe reply guidance, and identify escalation needs. Do not send replies or mutate CRM."
391:       });
392:       context.navigateTo?.("ai-command");
393:       context.showMessage?.("Customer Center context sent to AI Command.");
394:       return;
395:     }
```

### send at line 412

```js
407: 
408:     if (action === "governance-handoff") {
409:       context.setSharedHandoff?.("governance", {
410:         source: "customer-center",
411:         title: "Customer communication governance review",
412:         summary: "Review customer reply/escalation risk before any external response. No send action was performed."
413:       });
414:       context.navigateTo?.("governance");
415:       context.showMessage?.("Customer governance handoff prepared.");
416:     }
417:   });
```

### email at line 215

```js
210: }
211: 
212: function renderChannels(model) {
213:   const channels = asArray(model?.channels);
214:   if (!channels.length) {
215:     return renderEmptyState("No channel readiness records", "Provider readiness for email, social messaging, CRM, voice, and IVR will appear here when configured. Send and provider execution remain locked.");
216:   }
217: 
218:   return channels.map((channel) => `
219:     <article class="ops-list-item">
220:       <div>
```

### message at line 45

```js
40:   }
41:   return response;
42: }
43: 
44: function isProtectedReadGuard(value) {
45:   const message = asString(value?.error || value?.message || value);
46:   return /protected read routes are disabled/i.test(message);
47: }
48: 
49: function getProtectedReadMessage(value) {
50:   return asString(value?.error || value?.message || value || "Protected read routes are disabled.");
```

### message at line 46

```js
41:   return response;
42: }
43: 
44: function isProtectedReadGuard(value) {
45:   const message = asString(value?.error || value?.message || value);
46:   return /protected read routes are disabled/i.test(message);
47: }
48: 
49: function getProtectedReadMessage(value) {
50:   return asString(value?.error || value?.message || value || "Protected read routes are disabled.");
51: }
```

### message at line 50

```js
45:   const message = asString(value?.error || value?.message || value);
46:   return /protected read routes are disabled/i.test(message);
47: }
48: 
49: function getProtectedReadMessage(value) {
50:   return asString(value?.error || value?.message || value || "Protected read routes are disabled.");
51: }
52: 
53: async function loadCustomerCenterModel(projectName) {
54:   const [readiness, inbox, conversations, tickets, channels] = await Promise.all([
55:     fetchCustomerOperationsReadiness(projectName),
```

### message at line 101

```js
96:   };
97: }
98: 
99: function buildDisabledActions() {
100:   return [
101:     ["Send reply", "Locked: Customer Center v1 cannot send external replies or provider messages."],
102:     ["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],
103:     ["Update ticket", "Locked: ticket changes are outside this read-only release."],
104:     ["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],
105:     ["Mark reviewed", "Locked: review-state writes require a future safety pass."],
106:     ["Trigger callback", "Locked: call placement is not enabled from Customer Center."],
```

### message at line 171

```js
166: 
167:   return inbox.slice(0, 8).map((entry) => `
168:     <article class="ops-list-item">
169:       <div>
170:         <strong>${escapeHtml(entry.customer_label || "Masked customer")}</strong>
171:         <p>${escapeHtml(entry.last_message_preview || "No message preview available.")}</p>
172:       </div>
173:       <span class="card-badge">${escapeHtml(entry.status || "open")}</span>
174:     </article>
175:   `).join("");
176: }
```

### message at line 181

```js
176: }
177: 
178: function renderConversations(model) {
179:   const conversations = asArray(model?.conversations);
180:   if (!conversations.length) {
181:     return renderEmptyState("No conversation previews available", "Masked conversation context will appear here after read-only projections return conversations. Customer identity and message content stay masked or truncated by default.");
182:   }
183: 
184:   return conversations.slice(0, 6).map((item) => `
185:     <article class="ops-list-item">
186:       <div>
```

## Handoff Mentions

### handoff at line 283

```js
278:   return `
279:     <section class="mhos-page-hero">
280:       <div>
281:         <p class="mhos-context-eyebrow">Customer Operations</p>
282:         <h1>Customer Center</h1>
283:         <p class="mhos-context-description">Protected-read customer communication surface for inbox visibility, conversation previews, ticket/SLA state, channel readiness, and handoff preparation. No customer execution happens here.</p>
284:       </div>
285:       <div class="mhos-hero-actions">
286:         <button class="btn btn-secondary" type="button" data-customer-center-action="refresh">Refresh read-only data</button>
287:         <button class="btn btn-primary" type="button" data-customer-center-action="ai-handoff">Prepare AI support prompt</button>
288:       </div>
```

### handoff at line 287

```js
282:         <h1>Customer Center</h1>
283:         <p class="mhos-context-description">Protected-read customer communication surface for inbox visibility, conversation previews, ticket/SLA state, channel readiness, and handoff preparation. No customer execution happens here.</p>
284:       </div>
285:       <div class="mhos-hero-actions">
286:         <button class="btn btn-secondary" type="button" data-customer-center-action="refresh">Refresh read-only data</button>
287:         <button class="btn btn-primary" type="button" data-customer-center-action="ai-handoff">Prepare AI support prompt</button>
288:       </div>
289:     </section>
290: 
291:     <section class="mhos-executive-summary-grid">
292:       ${renderMetric("Open Conversations", conversations.length || "0", "Read-only")}
```

### handoff at line 306

```js
301:         <p class="muted">${protectedReadStatusBody}</p>
302:       </div>
303: 
304:       <div class="panel mhos-clean-surface">
305:         <div class="panel-header"><div><div class="panel-kicker">Execution boundary</div><h3>No direct customer actions</h3></div></div>
306:         <p class="muted">This page can review customer context and prepare handoffs. Any future customer-facing action must happen in an owning workflow with confirmation, permissions, and audit logging.</p>
307:       </div>
308:     </section>
309: 
310:     ${renderProtectedReadGuard(model)}
311: 
```

### handoff at line 325

```js
320:         </div>
321:       </div>
322: 
323:       <div class="panel mhos-clean-surface">
324:         <div class="panel-header"><div><div class="panel-kicker">Safe Operating Rules</div><h3>Preview-first support workflow</h3></div></div>
325:         <p class="muted">Use Customer Center to review, summarize, and prepare handoffs only. Nothing in this page sends a reply, changes CRM, updates tickets, assigns conversations, places calls, triggers IVR, or starts auto-reply.</p>
326:       </div>
327:     </section>
328: 
329:     <section class="page-grid page-grid-2">
330:       <div class="panel mhos-clean-surface">
```

### handoff at line 354

```js
349:     </section>
350: 
351:     <section class="page-grid page-grid-2">
352:       <div class="panel mhos-clean-surface">
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
```

### handoff at line 356

```js
351:     <section class="page-grid page-grid-2">
352:       <div class="panel mhos-clean-surface">
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
```

### handoff at line 357

```js
352:       <div class="panel mhos-clean-surface">
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
```

### handoff at line 358

```js
353:         <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Handoff-only, no execution</h3></div></div>
354:         <p class="muted">These buttons prepare navigation/context handoffs only. They do not send customer messages, contact providers, update CRM, change tickets, assign conversations, or mark records reviewed.</p>
355:         <div class="button-row">
356:           <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
357:           <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
358:           <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
359:         </div>
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
363:       <div class="panel mhos-clean-surface">
```

### handoff at line 365

```js
360:         ${renderDisabledActions(model.disabledActions)}
361:       </div>
362: 
363:       <div class="panel mhos-clean-surface">
364:         <div class="panel-header"><div><div class="panel-kicker">AI Panel</div><h3>Draft and guidance only</h3></div></div>
365:         <p class="muted">AI may summarize read-only context, draft response guidance, translate, and suggest next steps for a human handoff. It must not send replies, update CRM, close tickets, assign conversations, place calls, trigger IVR, sync providers, or start auto-reply.</p>
366:       </div>
367:     </section>
368:   `;
369: }
370: 
```

### handoff at line 386

```js
381:       await loadAndRenderCustomerCenter(context);
382:       context.showMessage?.("Customer Center read-only data refreshed.");
383:       return;
384:     }
385: 
386:     if (action === "ai-handoff") {
387:       context.setSharedAiDraft?.({
388:         source: "customer-center",
389:         title: "Customer Center support prompt",
390:         prompt: "Review Customer Center read-only state. Summarize customer support risks, draft safe reply guidance, and identify escalation needs. Do not send replies or mutate CRM."
391:       });
```

### handoff at line 397

```js
392:       context.navigateTo?.("ai-command");
393:       context.showMessage?.("Customer Center context sent to AI Command.");
394:       return;
395:     }
396: 
397:     if (action === "task-handoff") {
398:       context.setSharedHandoff?.("task-center", {
399:         source: "customer-center",
400:         title: "Customer follow-up task preview",
401:         summary: "Review Customer Center state and prepare a human follow-up task. No customer mutation was performed."
402:       });
```

### handoff at line 404

```js
399:         source: "customer-center",
400:         title: "Customer follow-up task preview",
401:         summary: "Review Customer Center state and prepare a human follow-up task. No customer mutation was performed."
402:       });
403:       context.navigateTo?.("task-center");
404:       context.showMessage?.("Customer task handoff prepared.");
405:       return;
406:     }
407: 
408:     if (action === "governance-handoff") {
409:       context.setSharedHandoff?.("governance", {
```

### handoff at line 408

```js
403:       context.navigateTo?.("task-center");
404:       context.showMessage?.("Customer task handoff prepared.");
405:       return;
406:     }
407: 
408:     if (action === "governance-handoff") {
409:       context.setSharedHandoff?.("governance", {
410:         source: "customer-center",
411:         title: "Customer communication governance review",
412:         summary: "Review customer reply/escalation risk before any external response. No send action was performed."
413:       });
```

### handoff at line 415

```js
410:         source: "customer-center",
411:         title: "Customer communication governance review",
412:         summary: "Review customer reply/escalation risk before any external response. No send action was performed."
413:       });
414:       context.navigateTo?.("governance");
415:       context.showMessage?.("Customer governance handoff prepared.");
416:     }
417:   });
418: }
419: 
420: async function loadAndRenderCustomerCenter(context) {
```

### handoff at line 454

```js
449:   id: "customer-center",
450:   label: "Customer Center",
451:   meta: {
452:     eyebrow: "Customer Operations",
453:     title: "Customer Center",
454:     description: "Read-only customer operations, inbox visibility, ticket/SLA state, and safe AI handoffs."
455:   },
456:   get template() {
457:     return `
458:       <section class="page is-active customer-center-page" data-page="customer-center">
459:         ${renderCustomerCenter({})}
```

## Decision Placeholder

Classify after human review:

- Safe / customer overview route-only
- Needs confirmation before shared handoff
- Needs confirmation before provider/customer sync
- Needs confirmation before send/email action
- Needs backend authority guard
- Needs no patch
