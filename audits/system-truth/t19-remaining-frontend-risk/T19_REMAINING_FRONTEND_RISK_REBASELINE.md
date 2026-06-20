# T19 — Remaining Frontend Risk Rebaseline

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend risk after closing the highest-risk authority surfaces:
- Workflows
- Publishing
- Library
- AI Command runtime authority

## Closed Evidence
- 01822c2 Add Workflows Auto Mode confirmation gates
- ee09063 Close Workflows Auto Mode confirmation verification
- d025f8b Add Publishing Auto Mode confirmation gates
- 38c6956 Close Publishing Auto Mode confirmation verification
- 2a737cc Close Library remaining safety review
- 7b6fb77 Close AI Command runtime authority review

## Scope
- Page files scanned: 35
- CSS files scanned: 24
- Closed high-risk page files excluded from next-priority decision: 4
- Remaining page files: 31

## Closed High-Risk Targets
| File | Risk | Category | innerHTML | authority words | confirmations |
| --- | --- | --- | --- | --- | --- |
| public/control-center/pages/workflows.js | 220.3 | closed-high-risk | 1 | 325 | 31 |
| public/control-center/pages/ai-command.js | 195.3 | closed-high-risk | 1 | 353 | 82 |
| public/control-center/pages/library.js | 191.5 | closed-high-risk | 26 | 41 | 9 |
| public/control-center/pages/publishing.js | 18.8 | closed-high-risk | 1 | 69 | 104 |


## Remaining Top Risk Pages
| Rank | File | Risk | Category | Lines | innerHTML | authority words | confirmations | API imports | events |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | public/control-center/pages/integrations.js | 80.1 | P0 review | 1965 | 1 | 121 | 25 | 0 | 13 |
| 2 | public/control-center/pages/ai-command/tool-dock.js | 57.6 | P1 review | 1867 | 4 | 70 | 42 | 0 | 9 |
| 3 | public/control-center/pages/settings.js | 43.4 | P1 review | 2057 | 5 | 103 | 161 | 1 | 4 |
| 4 | public/control-center/pages/customer-center.js | 37.9 | P2 review | 470 | 0 | 61 | 7 | 1 | 1 |
| 5 | public/control-center/pages/ads-manager.js | 32.4 | P2 review | 624 | 1 | 44 | 1 | 0 | 4 |
| 6 | public/control-center/pages/setup.js | 29.3 | P2 review | 1787 | 3 | 12 | 0 | 1 | 25 |
| 7 | public/control-center/pages/campaign-studio.js | 21.1 | P2 review | 2023 | 1 | 43 | 14 | 0 | 12 |
| 8 | public/control-center/pages/integrations/builders.js | 19.6 | low | 818 | 0 | 30 | 0 | 0 | 0 |
| 9 | public/control-center/pages/home.js | 13.2 | low | 1164 | 1 | 29 | 25 | 0 | 14 |
| 10 | public/control-center/pages/integrations/cards.js | 11.3 | low | 414 | 0 | 17 | 0 | 0 | 0 |
| 11 | public/control-center/pages/research.js | 10.3 | low | 1613 | 1 | 16 | 4 | 0 | 11 |
| 12 | public/control-center/pages/media-studio-workspace.js | 10 | low | 3659 | 1 | 57 | 72 | 1 | 27 |
| 13 | public/control-center/pages/operations-centers.js | 10 | low | 2268 | 5 | 43 | 163 | 0 | 26 |
| 14 | public/control-center/pages/integrations/drawer.js | 6.3 | low | 439 | 0 | 9 | 0 | 0 | 2 |
| 15 | public/control-center/pages/library/action-panel.js | 5.4 | low | 150 | 0 | 10 | 4 | 0 | 0 |
| 16 | public/control-center/pages/content-studio-workspace.js | 3.5 | low | 2404 | 1 | 30 | 66 | 1 | 14 |
| 17 | public/control-center/pages/library/command-router.js | 2.1 | low | 64 | 0 | 3 | 0 | 0 | 0 |
| 18 | public/control-center/pages/home/render-sections.js | 1.5 | low | 156 | 0 | 6 | 0 | 0 | 0 |
| 19 | public/control-center/pages/insights.js | 1.5 | low | 1520 | 1 | 5 | 0 | 0 | 5 |
| 20 | public/control-center/pages/library/ai-panel.js | 1.4 | low | 123 | 0 | 2 | 0 | 0 | 0 |


## CSS Risk / Density Signals
| File | Lines | !important | page blocks | selector signals |
| --- | --- | --- | --- | --- |
| public/control-center/styles/12-pages.css | 10216 | 73 | 1339 | 827 |
| public/control-center/styles/14-page-standard.css | 2946 | 18 | 459 | 216 |
| public/control-center/styles/13-home-executive.css | 1246 | 55 | 206 | 201 |
| public/control-center/styles/09-operations-centers.css | 1694 | 7 | 1 | 0 |
| public/control-center/styles/08-components-foundation.css | 1671 | 2 | 49 | 45 |
| public/control-center/styles/15-clean-operating-layer.css | 1166 | 0 | 0 | 0 |
| public/control-center/styles/mhos-executive-surface-primitives.css | 480 | 2 | 1 | 0 |
| public/control-center/styles/02-layer-system.css | 258 | 9 | 0 | 0 |
| public/control-center/styles/04-command-layer.css | 148 | 9 | 0 | 0 |
| public/control-center/styles/05-ai-layer.css | 197 | 4 | 0 | 0 |
| public/control-center/styles/07-sidebar.css | 194 | 2 | 0 | 0 |
| public/control-center/styles/10-topbar-canonical.css | 170 | 4 | 0 | 0 |
| public/control-center/styles/00-tokens.css | 180 | 0 | 0 | 0 |
| public/control-center/styles/mhos-workflow-primitives.css | 147 | 0 | 0 | 0 |
| public/control-center/styles/mhos-action-primitives.css | 114 | 0 | 0 | 0 |


## Recommended Next Decision

The highest remaining page-risk candidate is:

- public/control-center/pages/integrations.js
- risk score: 80.1
- category: P0 review

Recommended next step:
- If this page owns execution-like behavior, run a focused authority/safety audit.
- If it is mostly presentation/density risk, start UX/copy polish only after confirming no runtime authority issue.

## Top Page Evidence Details

### public/control-center/pages/integrations.js

Risk: 80.1 — P0 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1965 | 1 | 0 | 121 | 25 | 0 | 13 | 68 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 37 | `const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);` |
| 68 | `purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",` |
| 70 | `enables: "Product sync, order sync, sales signals, and commerce intelligence.",` |
| 88 | `enables: "Product sync, order sync, customer sync, and sales reporting.",` |
| 107 | `enables: "Listing sync, sales signals, performance by product, and marketplace learning.",` |
| 122 | `purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",` |
| 123 | `whyItMatters: "eBay extends commerce intelligence beyond the owned store and helps the system learn external demand patterns.",` |
| 124 | `enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",` |
| 149 | `dataScope: ["Post insights", "Engagement", "Comments", "Publishing", "Ads linkage"],` |
| 164 | `purpose: "Post, reel, and profile insight sync for Instagram business performance.",` |
| 182 | `purpose: "Video and post insight sync for TikTok creative and audience performance.",` |
| 200 | `purpose: "Video performance and channel insight sync for long-form or short-form YouTube content.",` |
| 302 | `{ key: "accountId", label: "Account ID", placeholder: "TikTok Ads account ID" },` |
| 344 | `id: "email-crm",` |
| 345 | `title: "Email & CRM",` |
| 346 | `description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",` |
| 357 | `enables: "Campaign sending, lifecycle messages, and email workflow execution.",` |
| 377 | `enables: "Campaign sends, audience sync, templates, and performance reporting.",` |
| 392 | `purpose: "Future-ready newsletter, audience, and campaign sync through Mailchimp.",` |
| 394 | `enables: "Audience sync, campaigns, lists, and newsletter reporting.",` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 513 | `whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",` |
| 514 | `enables: "Alerts, approvals, sync notifications, and workflow coordination.",` |
| 515 | `dataScope: ["Notifications", "Approvals", "Ops alerts"],` |
| 529 | `purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",` |
| 530 | `whyItMatters: "Telegram can keep MH Assistant responsive when quick approvals or notifications are needed.",` |
| 531 | `enables: "Alerts, commands, approval handoff, and ops notifications.",` |
| 532 | `dataScope: ["Alerts", "Commands", "Approvals"],` |
| 563 | `purpose: "Automation routing for triggers, syncs, approvals, and external workflow handoffs.",` |
| 588 | `{ key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },` |
| 1135 | `"WooCommerce Store URL is not saved yet. Run Repair integration connection after governance approval, then test the connection."` |
| 1508 | `const governanceCode = String(` |
| 1515 | `if (reconnect && governanceCode === "governance_approval_required") {` |
| 1516 | `const approvalId = asString(error?.payload?.approval?.approval_id);` |
| 1517 | `showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);` |
| 1521 | `navigateTo("governance");` |
| 1538 | `const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);` |

Rendering hits:

| Line | Code |
| --- | --- |
| 1743 | `root.innerHTML = `` |

### public/control-center/pages/ai-command/tool-dock.js

Risk: 57.6 — P1 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1867 | 4 | 0 | 70 | 42 | 0 | 9 | 20 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 301 | `<div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>` |
| 354 | `template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."` |
| 421 | `destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],` |
| 466 | `template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."` |
| 479 | `template: "Rewrite the current text for {projectName}. Keep the meaning, improve clarity, structure, and tone. Offer variants such as professional, shorter, simpler, more persuasive, premium, or platform-specific. Do not publish anything."` |
| 560 | `id: "send",` |
| 562 | `label: "Prepare Send-Off",` |
| 570 | `template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."` |
| 715 | `destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],` |
| 724 | `id: "publish-check",` |
| 726 | `label: "Publish Check",` |
| 734 | `template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."` |
| 790 | `ads: [` |
| 798 | `frontendOwnerPage: "ads-manager",` |
| 799 | `destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],` |
| 811 | `frontendOwnerPage: "ads-manager",` |
| 812 | `destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],` |
| 824 | `frontendOwnerPage: "ads-manager",` |
| 825 | `destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],` |
| 837 | `frontendOwnerPage: "ads-manager",` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 301 | `<div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library · Not approval or publish readiness</div>` |
| 647 | `destinations: ["chat-preview", "media-studio", "governance", "library"],` |
| 731 | `destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],` |
| 732 | `sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],` |
| 734 | `template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."` |
| 746 | `outputTypes: ["channel_pack", "caption_pack", "format_notes", "approval_checklist"],` |
| 747 | `template: "Prepare a channel package for {projectName}. Include caption, hashtags, format notes, asset needs, schedule notes, and approval checklist."` |
| 758 | `sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],` |
| 776 | `id: "approval-pack",` |
| 778 | `label: "Governance Review",` |
| 782 | `frontendOwnerPage: "governance",` |
| 783 | `destinations: ["chat-preview", "governance", "publishing", "workflows"],` |
| 784 | `sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],` |
| 785 | `outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],` |
| 786 | `template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."` |
| 799 | `destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],` |
| 812 | `destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],` |
| 851 | `destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],` |
| 934 | `frontendOwnerPage: "governance",` |
| 935 | `destinations: ["chat-preview", "governance", "content-studio", "publishing"],` |

Rendering hits:

| Line | Code |
| --- | --- |
| 285 | `selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;` |
| 297 | `selectedNode.innerHTML = `` |
| 338 | `if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No trusted Library source selected yet.</span>`;` |
| 1463 | `select.innerHTML = options.map((value, index) => {` |

### public/control-center/pages/settings.js

Risk: 43.4 — P1 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2057 | 5 | 0 | 103 | 161 | 0 | 4 | 122 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 22 | `value: "Semi-Auto",` |
| 23 | `label: "Semi-Auto",` |
| 49 | `"Route weak ads into Ads Manager"` |
| 58 | `"Ads Operator",` |
| 70 | `description: "Shapes priorities, campaign structures, and workflow sequencing."` |
| 98 | `label: "Ads Operator",` |
| 100 | `description: "Manages variants, spend tests, and escalation into Ads Manager."` |
| 164 | `options: ["Planning Mode", "Guided Execution", "Semi-Auto", "Approval-First", "Full AI Assist", "Emergency Safe Mode"]` |
| 193 | `options: ["Recommend only", "Prepare actions with review", "Auto-run trusted actions", "Act unless blocked by policy"]` |
| 273 | `backendLabel: "Automation routing rules sync into the durable governance policy",` |
| 298 | `placeholder: "Route SEO gaps into Research, weak ad performance into Ads Manager, and publish blockers into review queues."` |
| 306 | `backendLabel: "Publishing defaults sync into the durable governance policy",` |
| 323 | `label: "Approval before publish",` |
| 336 | `placeholder: "Route product launches to social + email, evergreen SEO to website, paid hooks to ads queue."` |
| 342 | `options: ["Organic posts", "Stories", "Reels", "Ads variants", "Landing pages", "Email sequence"]` |
| 368 | `label: "Ads approval owner",` |
| 378 | `options: ["All publish actions", "Paid ads", "Medical or product claims", "New campaign launches", "AI-generated media"]` |
| 397 | `description: "Define who can operate the system, who can approve output, who runs each service lane, and who can change the machine itself.",` |
| 410 | `options: ["Strategy", "Writing", "Design", "Video", "Publishing", "Ads", "Analytics", "Compliance", "Administration"]` |
| 421 | `label: "Who can publish",` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 2 | `fetchProjectGovernancePolicy,` |
| 5 | `updateProjectGovernancePolicy` |
| 27 | `value: "Approval-First",` |
| 28 | `label: "Approval-First",` |
| 164 | `options: ["Planning Mode", "Guided Execution", "Semi-Auto", "Approval-First", "Full AI Assist", "Emergency Safe Mode"]` |
| 236 | `path: "ai.approvalRequiredMode",` |
| 237 | `label: "Approval-required mode",` |
| 273 | `backendLabel: "Automation routing rules sync into the durable governance policy",` |
| 306 | `backendLabel: "Publishing defaults sync into the durable governance policy",` |
| 322 | `path: "publishing.approvalBeforePublish",` |
| 323 | `label: "Approval before publish",` |
| 347 | `id: "approval",` |
| 348 | `title: "Approval Rules",` |
| 350 | `backendLabel: "Approval policy syncs into the durable governance and team records",` |
| 353 | `path: "approval.contentOwner",` |
| 354 | `label: "Content approval owner",` |
| 360 | `path: "approval.mediaOwner",` |
| 361 | `label: "Media approval owner",` |
| 367 | `path: "approval.adsOwner",` |
| 368 | `label: "Ads approval owner",` |

Rendering hits:

| Line | Code |
| --- | --- |
| 1811 | `overviewHost.outerHTML = renderSettingsOverview(buildSummary(session), session, escapeHtml);` |
| 1815 | `summaryHost.outerHTML = renderSummary(buildSummary(session), session, escapeHtml);` |
| 1819 | `aiHost.outerHTML = renderSettingsAssistant(session, escapeHtml);` |
| 1836 | `root.innerHTML = buildPageMarkup(session, context.escapeHtml);` |
| 2033 | `root.innerHTML = `` |

### public/control-center/pages/customer-center.js

Risk: 37.9 — P2 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 470 | 0 | 0 | 61 | 7 | 0 | 1 | 28 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 101 | `["Send reply", "Locked: Customer Center v1 cannot send external replies or provider messages."],` |
| 102 | `["Add CRM note", "Locked: CRM writes require a future confirmation gate, role check, and audit log."],` |
| 103 | `["Update ticket", "Locked: ticket changes are outside this read-only release."],` |
| 104 | `["Assign conversation", "Locked: assignment changes require a future workflow owner and audit trail."],` |
| 108 | `["Sync CRM", "Locked: CRM provider execution is not enabled from Customer Center."],` |
| 109 | `["Auto-reply", "Locked: autonomous customer replies remain forbidden by default."]` |
| 145 | `<p>No placeholder customer records are shown. External send, CRM updates, ticket changes, calls, IVR, provider sync, and auto-reply remain locked.</p>` |
| 198 | `return renderEmptyState("No ticket snapshots available", "Support ticket and SLA records will appear here when the read-only projection includes them. No ticket creation or update is available from this page.");` |
| 201 | `return tickets.slice(0, 6).map((ticket) => `` |
| 204 | `<strong>${escapeHtml(ticket.ticket_id \|\| "Ticket")}</strong>` |
| 205 | `<p>${escapeHtml(ticket.status \|\| "open")} • ${escapeHtml(ticket.sla_status \|\| "unknown SLA")}</p>` |
| 207 | `<span class="card-badge">${escapeHtml(ticket.priority \|\| "normal")}</span>` |
| 215 | `return renderEmptyState("No channel readiness records", "Provider readiness for email, social messaging, CRM, voice, and IVR will appear here when configured. Send and provider execution remain locked.");` |
| 224 | `<span class="card-badge">${channel.external_send_ready ? "Send ready" : "Send locked"}</span>` |
| 233 | `<p class="muted">Visible for roadmap clarity only. These customer actions cannot execute here and require future confirmation gates, role permissions, provider readiness, and audit logging.</p>` |
| 263 | `? "Customer Center is using read-only projections only. Outbound sends, CRM writes, ticket changes, assignments, calls, IVR, and auto-replies remain unavailable."` |
| 283 | `<p class="mhos-context-description">Protected-read customer communication surface for inbox visibility, conversation previews, ticket/SLA state, channel readiness, and handoff preparation. No customer execution happens here.</p>` |
| 293 | `${renderMetric("Waiting Replies", countWaitingReplies(inbox), "No auto-send")}` |
| 295 | `${renderMetric("Channels", channels.length \|\| "0", "Send locked")}` |
| 306 | `<p class="muted">This page can review customer context and prepare handoffs. Any future customer-facing action must happen in an owning workflow with confirmation, permissions, and audit logging.</p>` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 357 | `<button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>` |
| 408 | `if (action === "governance-handoff") {` |
| 409 | `context.setSharedHandoff?.("governance", {` |
| 411 | `title: "Customer communication governance review",` |
| 414 | `context.navigateTo?.("governance");` |
| 415 | `context.showMessage?.("Customer governance handoff prepared.");` |

Rendering hits:

_No HTML rendering hits in sample._

### public/control-center/pages/ads-manager.js

Risk: 32.4 — P2 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 624 | 1 | 0 | 44 | 1 | 0 | 4 | 62 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 6 | `label: "Meta Ads",` |
| 13 | `label: "Google Ads",` |
| 20 | `label: "TikTok Ads",` |
| 27 | `label: "Amazon Ads",` |
| 207 | `prompt: `Review the paid media setup for ${projectName \|\| "this project"}. Use current strong platforms (${strongPlatforms.join(", ") \|\| "none identified"}) and recommend which campaigns to scale, what budget to move, and which creatives to duplicate.`` |
| 259 | `const aiButtons = Array.from(document.querySelectorAll("[data-ads-prompt]"));` |
| 262 | `const index = Number(button.getAttribute("data-ads-prompt"));` |
| 287 | `id: "ads-manager",` |
| 290 | `eyebrow: "Execute & Grow",` |
| 291 | `title: "Ads Manager",` |
| 295 | `<section class="page is-active" data-page="ads-manager">` |
| 345 | `<div class="ads-manager-wrapper">` |
| 346 | `<div class="ads-manager-hero">` |
| 347 | `<div class="ads-manager-hero-copy">` |
| 349 | `<h3 class="setup-hero-title">${escapeHtml(projectName ? `${projectName} Ads Manager` : "Ads Manager")}</h3>` |
| 351 | `Use this workspace to set the working budget, check pacing, understand channel readiness, map creatives to platforms, and decide what to scale or pause next.` |
| 353 | `<div class="ads-manager-status">` |
| 363 | `<span>Budget</span>` |
| 379 | `<div class="ads-manager-layout">` |
| 380 | `<div class="ads-manager-main">` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 590 | `<p class="home-action-meta">AI can prepare a paid growth brief and route context to AI Command. Spend changes, publishing, and campaign launch remain manual or governance-controlled.</p>` |

Rendering hits:

| Line | Code |
| --- | --- |
| 344 | `root.innerHTML = `` |

### public/control-center/pages/setup.js

Risk: 29.3 — P2 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1787 | 3 | 0 | 12 | 0 | 6 | 25 | 172 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 76 | `project_type: "Improves AI defaults and recommended workflow strategies.",` |
| 85 | `social_channels: "Defines where campaign and publishing workflows should execute."` |
| 922 | `// Disabled: wizard panel auto-scroll caused workspace jump during interaction.` |
| 1312 | `<p class="setup-v2-subtitle">Choose a model to load recommended defaults, checklist scope, and readiness priorities. Selection alone does not publish, connect, or execute anything.</p>` |
| 1449 | `<span>Does not publish, approve, send, or execute</span>` |
| 1707 | `<p class="setup-v2-subtitle">AI suggestions update local form guidance or prepare an AI Command prompt. They do not save backend data, approve work, publish, send, connect, or upload.</p>` |

Confirmation hits:

_No confirmation hits in sample._

Rendering hits:

| Line | Code |
| --- | --- |
| 746 | `missingActionList.innerHTML = missingInsights.length` |
| 761 | `blockerList.innerHTML = renderIndicatorList(` |
| 1425 | `root.innerHTML = `` |

### public/control-center/pages/campaign-studio.js

Risk: 21.1 — P2 review

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2023 | 1 | 0 | 43 | 14 | 0 | 12 | 165 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 45 | `google_ads: "Google Ads",` |
| 46 | `meta: "Meta Ads",` |
| 48 | `ads: "Paid Media",` |
| 66 | `"ads-manager": { role: "ads_operator", domain: "campaign" },` |
| 120 | `<div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>` |
| 242 | `budget: "5000",` |
| 338 | `budget: asString(values?.budget),` |
| 357 | `budget: asString(formValues.budget \|\| record.budget \|\| defaults.budget)` |
| 450 | `budget: asString(values.budget),` |
| 764 | `? "Google Ads"` |
| 766 | `? "TikTok Ads"` |
| 767 | `: "Meta Ads";` |
| 856 | `if (!values.budget) adsBlockers.push("Add a working campaign budget before routing to Ads Manager.");` |
| 1399 | `persistCampaignRouteHandoff({ projectName, session, destinationPage: "ads-manager", createProjectHandoff });` |
| 1400 | `navigateTo("ads-manager");` |
| 1543 | `const budgetValue = formatCurrency(values.budget, overviewData.currency \|\| "USD");` |
| 1544 | `const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;` |
| 1568 | `<span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>` |
| 1671 | `name: "budget",` |
| 1672 | `label: "Budget",` |

Confirmation hits:

| Line | Code |
| --- | --- |
| 67 | `"ai-command": { role: "admin", domain: "governance" }` |
| 459 | `linked_approvals: [],` |
| 845 | `const approvalBlockers = [];` |
| 877 | `if (!values.executionNotes) approvalBlockers.push("Execution notes are missing, which makes approvals harder downstream.");` |
| 878 | `if (!values.audiencePrimary \|\| !values.audienceNeed) approvalBlockers.push("Audience framing is incomplete for creative review.");` |
| 879 | `if (!values.productAngle) approvalBlockers.push("Product angle needs to be explicit so operators do not improvise.");` |
| 886 | `approvalBlockers.length \|\|` |
| 900 | `approvalBlockers,` |
| 908 | `approvalBlockers.length` |
| 1895 | `helper: "Capture dependencies, packaging notes, approval guidance, or production instructions for the next operator.",` |
| 1944 | `"Approval blockers",` |
| 1945 | `executionReadiness.approvalBlockers,` |
| 1947 | `"Approval inputs look complete enough for review."` |

Rendering hits:

| Line | Code |
| --- | --- |
| 1554 | `root.innerHTML = `` |

### public/control-center/pages/integrations/builders.js

Risk: 19.6 — low

Metrics:

| Lines | innerHTML | directFetch | authority words | confirmations | localStorage | events | escape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 818 | 0 | 0 | 30 | 0 | 0 | 0 | 17 |

Authority-like hits:

| Line | Code |
| --- | --- |
| 28 | `label: "Paid Ads",` |
| 29 | `ids: ["meta-ads", "google-ads", "tiktok-ads", "meta-pixel", "tiktok-pixel"]` |
| 44 | `label: "Email / CRM",` |
| 45 | `ids: ["smtp", "mailer", "mailchimp", "crm"]` |
| 121 | `meta: `${reconnectNeeded[0].label} needs attention before sync and intelligence coverage can be trusted.`` |
| 145 | `meta: "Best next step: attach provider-specific OAuth validation and background sync jobs to the existing integration routes."` |
| 164 | `prompt: "Review the current analytics, tracking, website, and paid integrations and tell me what is blocking full attribution across content, ads, and conversion tracking."` |
| 192 | `label: "Communication / CRM",` |
| 193 | `description: "Email, CRM, and operational messaging connectors that keep lifecycle and team coordination intact.",` |
| 194 | `connectorIds: ["smtp", "mailer", "mailchimp", "crm", "telegram", "slack", "notion", "zapier-make", "google-drive", "webhook"]` |
| 199 | `connectorIds: ["meta-ads", "google-ads", "tiktok-ads"]` |
| 365 | `if (/(failed\|error\|disconnect\|blocked\|expired)/.test(text)) return "danger";` |
| 367 | `if (/(connected\|sync\|tested\|passed\|healthy\|ready\|imported)/.test(text)) return "success";` |
| 408 | `id: `${card.id}-sync`,` |
| 409 | `title: `${card.label} sync checkpoint`,` |
| 410 | `detail: "Derived from the latest connector sync timestamp.",` |
| 478 | `domains: [byId.get("analytics"), byId.get("ads")].filter(Boolean)` |
| 481 | `id: "email-crm",` |
| 482 | `title: "Email & CRM",` |
| 484 | `domains: [byId.get("email-crm")].filter(Boolean)` |

Confirmation hits:

_No confirmation hits in sample._

Rendering hits:

_No HTML rendering hits in sample._

## Decision Rules
- Do not patch from this scan alone.
- Closed pages remain closed unless browser QA later proves a regression.
- If a remaining page has high authority words and low confirmations, audit it next.
- If risk is mostly CSS/innerHTML/density, schedule UX polish rather than runtime patch.
- Do not change production code in T19.
