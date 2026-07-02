# T50 — Content Studio Workspace Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/content-studio-workspace.js

## Why This Page Is Next
T49 rebaseline ranked Content Studio Workspace as the highest remaining open frontend risk candidate.

T49 signals:
- Score: 533.5
- Priority: P0
- Lines: 2404
- innerHTML: 1
- Events: 14
- API/write signals: 179
- Authority words: 392
- Confirmations: 0
- Storage: 4
- Escape evidence: 180

## Purpose
Verify whether Content Studio Workspace:
- generates content directly
- saves drafts or mutates project data
- creates tasks or handoffs
- publishes/sends/schedules external content
- uses provider/job actions
- uses explicit confirmation gates for sensitive actions
- renders dynamic content safely
- needs runtime patch or closeout

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 2365 | 1 |
| Escape / safe rendering evidence | 128 | 168 |
| Imported/backend API calls | 2 | 126 |
| Content generation signals | 6 | 718 |
| Publishing/send signals | 28 | 107 |
| Task/handoff writes | 3 | 141 |
| Provider/job signals | 15 | 149 |
| Confirmation gates | n/a | 0 |
| Event handlers | 418 | 16 |
| Storage signals | 232 | 4 |
| Routing/handoff | 3 | 154 |
| Copy defect candidates | 18 | 10 |


## Evidence Zones

### HTML render / innerHTML

```js
 2275:       getState,
 2276:       $,
 2277:       escapeHtml,
 2278:       navigateTo,
 2279:       showMessage,
 2280:       showError
 2281:     });
 2282: 
 2283:     if (!session.loaded && !session.loading && projectName) {
 2284:       loadWorkspace(projectName, state, session, rerender);
 2285:     }
 2286: 
 2287:     if (!projectName && !session.items.length) {
 2288:       session.items = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
 2289:     }
 2290: 
 2291:     const selectedItem = getSelectedItem(session);
 2292:     if (selectedItem && selectedItem.id !== session.formSourceId && !session.isCreatingNew) {
 2293:       syncFormFromItem(session, selectedItem);
 2294:     }
 2295: 
 2296:     const metrics = getMetrics(session);
 2297:     const recommendation = buildRecommendation(metrics, selectedItem);
 2298:     const inbound = getInboundHandoff(projectName, session);
 2299:     const inboundSummary = inbound ? buildInboundSummary(inbound) : null;
 2300: 
 2301: 
 2302:     // --- Source/Provenance Panel ---
 2303:     function renderSourcePanel() {
 2304:       let sourceLines = [];
 2305:       let ariaLabel = "Source context panel";
 2306:       // Prefer inbound handoff, then selectedItem, then session.form
 2307:       const handoff = inboundSummary;
 2308:       const item = selectedItem;
 2309:       if (handoff) {
 2310:         sourceLines.push(`<div><strong>Source page:</strong> ${escapeHtml(titleCase(handoff.sourcePage || "-"))}</div>`);
 2311:         if (handoff.project) sourceLines.push(`<div><strong>Project:</strong> ${escapeHtml(handoff.project)}</div>`);
 2312:         if (handoff.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(handoff.campaign)}</div>`);
 2313:         if (handoff.channel) sourceLines.push(`<div><strong>Channel:</strong> ${escapeHtml(handoff.channel)}</div>`);
 2314:         if (handoff.brief) sourceLines.push(`<div><strong>Brief:</strong> ${escapeHtml(handoff.brief.slice(0, 120))}</div>`);
 2315:         sourceLines.push(`<div><strong>Handoff type:</strong> ${handoff.id ? "AI/Workflow" : "Unknown"}</div>`);
 2316:       } else if (item) {
 2317:         sourceLines.push(`<div><strong>Source:</strong> ${escapeHtml(item.source || "-")}</div>`);
 2318:         if (item.project) sourceLines.push(`<div><strong>Project:</strong> ${escapeHtml(item.project)}</div>`);
 2319:         if (item.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(item.campaign)}</div>`);
 2320:         if (item.channel) sourceLines.push(`<div><strong>Channel:</strong> ${escapeHtml(item.channel)}</div>`);
 2321:       }
 2322:       // Library asset/provenance
 2323:       if (item && item.library_asset_ref) {
 2324:         sourceLines.push(`<div><strong>Library asset ref:</strong> ${escapeHtml(item.library_asset_ref.source_signature || "-")}</div>`);
 2325:       }
 2326:       if (!sourceLines.length) {
 2327:         sourceLines.push(`<div>No source context attached yet. Use AI Command or Library to attach source-backed content.</div>`);
 2328:       }
 2329:       sourceLines.push(`<div class="content-hint content-readiness-hint">Source context helps the reviewer verify claims before routing.</div>`);
 2330:       return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Source Context</div><h3>Source / Provenance</h3></div></div><div class="content-data-item">${sourceLines.join("")}</div></section>`;
 2331:     }
 2332: 
 2333:     // --- SEO Checklist Panel ---
 2334:     function renderSeoChecklistPanel() {
 2335:       const ariaLabel = "SEO Checklist panel";
 2336:       // Visual checklist only, not interactive
 2337:       return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">SEO Checklist</div><h3>SEO Readiness Guidance</h3></div></div><ul class="content-seo-checklist content-readiness-list">
 2338:         <li><strong>Meta title</strong> present and clear</li>
 2339:         <li><strong>Meta description</strong> summarizes value</li>
 2340:         <li><strong>Primary keyword</strong> included</li>
 2341:         <li><strong>Headings / structure</strong> logical</li>
 2342:         <li><strong>CTA</strong> is actionable</li>
 2343:         <li><strong>Internal link idea</strong> noted</li>
 2344:         <li><strong>Brand tone</strong> consistent</li>
 2345:         <li><strong>Readability</strong> is high</li>
 2346:       </ul><div class="content-hint content-readiness-hint">Review these before routing for publishing or governance.</div></section>`;
 2347:     }
 2348: 
 2349:     // --- Governance Risk / Approval Readiness Panel ---
 2350:     function renderGovernancePanel() {
 2351:       const ariaLabel = "Governance risk and approval readiness panel";
 2352:       return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Governance Risk</div><h3>Approval Readiness</h3></div></div><ul class="content-governance-checklist content-readiness-list">
 2353:         <li>Claims or proof needed?</li>
 2354:         <li>Legal/compliance sensitivity?</li>
 2355:         <li>Pricing/offer sensitivity?</li>
 2356:         <li>GDPR/privacy sensitivity?</li>
 2357:         <li><strong>Approval recommended before routing</strong></li>
 2358:         <li>Route to Governance Review if needed</li>
 2359:       </ul><div class="content-hint content-readiness-hint">Prepare Governance Review before publishing or campaign use.</div></section>`;
 2360:     }
 2361: 
 2362:     // --- Patch: Soften routing labels if needed (button text is already safe, but check for clarity) ---
 2363:     // No direct publish/approve/send labels found in action rows; all routing is review/handoff-based.
 2364: 
 2365:     root.innerHTML = `
 2366:       ${renderScopedStyles()}
 2367:       <div class="content-smart-root">
 2368:         ${renderOverview(metrics, escapeHtml)}
 2369:         ${renderRecommendation(recommendation, selectedItem, escapeHtml)}
 2370:         ${renderSourcePanel()}
 2371:         ${renderSeoChecklistPanel()}
 2372:         ${renderGovernancePanel()}
 2373:         ${session.error ? `<div class="simple-banner">${escapeHtml(session.error)}</div>` : ""}
 2374:         ${session.loading ? `<div class="empty-box">Loading content records, approvals, tasks, handoffs, and events...</div>` : ""}
 2375: 
 2376:         <div class="content-smart-grid">
 2377:           <div class="content-main">
 2378:             ${renderComposer(session, state, inboundSummary, escapeHtml)}
 2379:             ${renderQueue(session, escapeHtml)}
 2380:             ${renderPreview(session, selectedItem, escapeHtml)}
 2381:             ${renderVersioning(session, escapeHtml)}
 2382:           </div>
 2383:           <aside class="content-side">
 2384:             ${renderInboundHandoff(inboundSummary, session, escapeHtml)}
 2385:             ${renderAgents(escapeHtml)}
 2386:             ${buildAssetGate(state, escapeHtml)}
 2387:           </aside>
 2388:         </div>
 2389:       </div>
 2390:     `;
 2391: 
 2392:     bindPage({
 2393:       projectName,
 2394:       state,
 2395:       session,
 2396:       handoff: inboundSummary,
 2397:       navigateTo,
 2398:       showMessage,
 2399:       showError,
 2400:       rerender
 2401:     });
 2402:   }
 2403: };
 2404: 
```

### Escape / safe rendering evidence

```js
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
  132: 
  133: function clean(value) {
  134:   return asString(value).trim();
  135: }
  136: 
  137: function toKey(value) {
  138:   return clean(value).toLowerCase();
  139: }
  140: 
  141: function firstText(...values) {
  142:   for (const value of values) {
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
  160: 
  161: function nowIso() {
  162:   return new Date().toISOString();
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
  176: function projectKey(projectName) {
  177:   return toKey(projectName) || "__default__";
  178: }
  179: 
  180: function normalizeStatus(value, fallback = "draft") {
  181:   const normalized = toKey(value);
  182:   if (!normalized) return fallback;
  183:   if (["draft"].includes(normalized)) return "draft";
  184:   if (["prompt_ready", "ready", "prompt ready"].includes(normalized)) return "prompt_ready";
  185:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  186:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  187:   if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
  188:   if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
  189:   return fallback;
  190: }
  191: 
  192: function statusTone(status) {
  193:   if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
  194:   if (["prompt_ready", "needs_review"].includes(status)) return "warning";
  195:   return "neutral";
  196: }
  197: 
  198: function modeLabel(mode) {
  199:   return CONTENT_MODE_LABELS[mode] || titleCase(mode || "social-post");
  200: }
  201: 
  202: function requestTypeForMode(mode) {
  203:   if (["reel-script", "video-script"].includes(mode)) return "script";
  204:   if (mode === "blog-draft") return "blog";
  205:   if (mode === "marketplace-copy") return "marketplace";
  206:   if (mode === "ad-copy") return "ad";
  207:   if (mode === "email") return "email";
  208:   return "social";
  209: }
  210: 
  211: function defaultForm(state, mode = "social-post") {
  212:   const context = asObject(state.context);
  213:   const overview = asObject(state.data.overview?.overview);
  214:   return {
  215:     mode,
  216:     project: firstText(context.currentProject, overview.project_name),
  217:     campaign: firstText(context.activeCampaign, overview.active_campaign),
  218:     product: firstText(overview.project_name, context.currentProject),
```

### Imported/backend API calls

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
```

### Content generation signals

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
```

### Publishing/send signals

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
```

### Task/handoff writes

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
```

### Provider/job signals

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
```

### Confirmation gates

```js
_No match found._
```

### Event handlers

```js
  328:     prompt: asString(prompt),
  329:     output_content: asString(outputContent),
  330:     language: asString(language || "English"),
  331:     tone: asString(tone),
  332:     channel: asString(channel),
  333:     readiness_status: normalizeStatus(readinessStatus || "draft", "draft"),
  334:     approval_status: asString(approvalStatus || "draft"),
  335:     notes: asString(notes),
  336:     library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
  337:     timestamp: asString(createdAt || nowIso())
  338:   };
  339: }
  340: 
  341: function normalizeVersionEntry(rawVersion, index = 0) {
  342:   const raw = asObject(rawVersion);
  343:   return createVersionEntry({
  344:     id: firstText(raw.id, raw.version_id, `v${index + 1}`),
  345:     mode: firstText(raw.mode, raw.content_type, "social-post"),
  346:     prompt: firstText(raw.prompt, raw.input_prompt),
  347:     outputContent: firstText(raw.output_content, raw.content, raw.body, raw.draft),
  348:     language: firstText(raw.language, "English"),
  349:     tone: firstText(raw.tone),
  350:     channel: firstText(raw.channel),
  351:     readinessStatus: firstText(raw.readiness_status, raw.status, "draft"),
  352:     approvalStatus: firstText(raw.approval_status, "draft"),
  353:     notes: firstText(raw.notes),
  354:     libraryAssetRef: raw.library_asset_ref || null,
  355:     createdAt: firstText(raw.timestamp, raw.created_at, raw.updated_at)
  356:   });
  357: }
  358: 
  359: function createVersioningState(seed = {}) {
  360:   const base = createVersionEntry({
  361:     id: "v1",
  362:     mode: firstText(seed.mode, "social-post"),
  363:     prompt: firstText(seed.prompt),
  364:     outputContent: firstText(seed.outputContent),
  365:     language: firstText(seed.language, "English"),
  366:     tone: firstText(seed.tone),
  367:     channel: firstText(seed.channel),
  368:     readinessStatus: firstText(seed.readinessStatus, "draft"),
  369:     approvalStatus: firstText(seed.approvalStatus, "draft"),
  370:     notes: firstText(seed.notes),
  371:     createdAt: firstText(seed.timestamp, nowIso())
  372:   });
  373:   return {
  374:     selectedVersionId: base.id,
  375:     compareMode: false,
  376:     compareNotes: "",
  377:     versions: [base]
  378:   };
  379: }
  380: 
  381: function ensureVersioning(session) {
  382:   if (!session.versioning) {
  383:     session.versioning = createVersioningState({
  384:       mode: session.form?.mode || "social-post",
  385:       prompt: session.form?.brief,
  386:       language: session.form?.language,
  387:       tone: session.form?.tone,
  388:       channel: session.form?.channel,
  389:       readinessStatus: session.form?.status || "draft"
  390:     });
  391:   }
  392:   if (!asArray(session.versioning.versions).length) {
  393:     session.versioning.versions = createVersioningState().versions;
  394:   }
  395:   if (!session.versioning.selectedVersionId) {
  396:     session.versioning.selectedVersionId = session.versioning.versions[session.versioning.versions.length - 1]?.id || "v1";
  397:   }
  398:   return session.versioning;
  399: }
  400: 
  401: function selectedVersionEntry(session) {
  402:   const versioning = ensureVersioning(session);
  403:   const selected = versioning.versions.find((item) => item.id === versioning.selectedVersionId);
  404:   if (selected) return selected;
  405:   const fallback = versioning.versions[versioning.versions.length - 1] || null;
  406:   versioning.selectedVersionId = fallback?.id || "v1";
  407:   return fallback;
  408: }
  409: 
  410: function previousVersionEntry(session) {
  411:   const versioning = ensureVersioning(session);
  412:   const current = selectedVersionEntry(session);
  413:   const index = versioning.versions.findIndex((item) => item.id === current?.id);
  414:   if (index <= 0) return null;
  415:   return versioning.versions[index - 1] || null;
  416: }
  417: 
  418: function appendVersion(session, versionInput) {
  419:   const versioning = ensureVersioning(session);
  420:   const next = createVersionEntry({
  421:     ...asObject(versionInput),
  422:     id: nextVersionId(versioning.versions)
  423:   }, versioning.versions);
  424:   versioning.versions = [...versioning.versions, next];
  425:   versioning.selectedVersionId = next.id;
  426:   return next;
  427: }
  428: 
  429: function syncVersionFromForm(session) {
  430:   const selected = selectedVersionEntry(session);
  431:   if (!selected) return;
  432:   selected.mode = session.form.mode || selected.mode;
  433:   selected.prompt = clean(session.form.brief);
  434:   selected.language = clean(session.form.language || "English");
  435:   selected.tone = clean(session.form.tone);
  436:   selected.channel = clean(session.form.channel);
  437:   selected.readiness_status = normalizeStatus(session.form.status || selected.readiness_status || "draft", "draft");
  438: }
  439: 
  440: function applySelectedVersionToForm(session) {
  441:   const selected = selectedVersionEntry(session);
  442:   if (!selected) return;
  443:   session.form.mode = selected.mode || session.form.mode || "social-post";
  444:   session.form.brief = selected.prompt || session.form.brief || "";
  445:   session.form.language = selected.language || session.form.language || "English";
  446:   session.form.tone = selected.tone || session.form.tone || "";
  447:   session.form.channel = selected.channel || session.form.channel || "";
  448:   session.form.status = normalizeStatus(selected.readiness_status || session.form.status || "draft", "draft");
  449: }
  450: 
  451: function hydrateVersioningFromItem(item) {
  452:   const raw = asObject(item);
  453:   const versions = asArray(raw.content_versions || raw.output_versions || raw.versions)
  454:     .map((entry, index) => normalizeVersionEntry(entry, index))
  455:     .filter((entry) => entry.id);
  456:   if (versions.length) {
  457:     return {
  458:       selectedVersionId: versions[versions.length - 1].id,
  459:       compareMode: false,
  460:       compareNotes: "",
  461:       versions
  462:     };
  463:   }
  464:   return createVersioningState({
  465:     mode: firstText(raw.type, raw.mode, "social-post"),
  466:     prompt: firstText(raw.prompt, raw.brief),
  467:     outputContent: firstText(raw.draft),
  468:     language: firstText(raw.language, "English"),
  469:     tone: firstText(raw.tone),
  470:     channel: firstText(raw.channel),
  471:     readinessStatus: firstText(raw.status, "draft"),
  472:     approvalStatus: firstText(raw.approval_status, "draft")
  473:   });
  474: }
  475: 
  476: function normalizeContentItem(rawItem) {
  477:   const raw = asObject(rawItem);
  478:   const mode = firstText(raw.type, raw.content_type, raw.mode, "social-post");
  479:   return {
  480:     id: firstText(raw.id, raw.content_item_id),
  481:     title: firstText(raw.title, `${modeLabel(mode)} draft`),
  482:     mode: CONTENT_MODES.includes(mode) ? mode : "social-post",
  483:     project: firstText(raw.project, raw.project_name),
  484:     campaign: firstText(raw.campaign, raw.campaign_id, raw.campaign_name),
  485:     product: firstText(raw.product),
  486:     channel: firstText(raw.channel, raw.destination),
  487:     language: firstText(raw.language, "English"),
  488:     tone: firstText(raw.tone),
  489:     objective: firstText(raw.objective),
  490:     brief: firstText(raw.prompt, raw.brief),
  491:     draft: firstText(raw.draft, raw.body),
  492:     status: normalizeStatus(raw.status, "draft"),
  493:     approval_status: asString(raw.approval_status || "draft"),
  494:     destination: firstText(raw.destination, raw.publishing_destination),
  495:     notes: asArray(raw.notes),
  496:     linked_tasks: asArray(raw.linked_tasks),
  497:     linked_approvals: asArray(raw.linked_approvals),
  498:     linked_handoffs: asArray(raw.linked_handoffs),
  499:     content_versions: asArray(raw.content_versions || raw.output_versions || []),
  500:     source: firstText(raw.source, raw.localOnly ? "Local draft" : "Backend"),
  501:     localOnly: Boolean(raw.localOnly),
  502:     created_at: firstText(raw.created_at),
  503:     updated_at: firstText(raw.updated_at)
  504:   };
  505: }
  506: 
  507: function compareContentItems(a, b) {
  508:   const order = {
```

### Storage signals

```js
  142:   for (const value of values) {
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
  160: 
  161: function nowIso() {
  162:   return new Date().toISOString();
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
  176: function projectKey(projectName) {
  177:   return toKey(projectName) || "__default__";
  178: }
  179: 
  180: function normalizeStatus(value, fallback = "draft") {
  181:   const normalized = toKey(value);
  182:   if (!normalized) return fallback;
  183:   if (["draft"].includes(normalized)) return "draft";
  184:   if (["prompt_ready", "ready", "prompt ready"].includes(normalized)) return "prompt_ready";
  185:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  186:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  187:   if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
  188:   if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
  189:   return fallback;
  190: }
  191: 
  192: function statusTone(status) {
  193:   if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
  194:   if (["prompt_ready", "needs_review"].includes(status)) return "warning";
  195:   return "neutral";
  196: }
  197: 
  198: function modeLabel(mode) {
  199:   return CONTENT_MODE_LABELS[mode] || titleCase(mode || "social-post");
  200: }
  201: 
  202: function requestTypeForMode(mode) {
  203:   if (["reel-script", "video-script"].includes(mode)) return "script";
  204:   if (mode === "blog-draft") return "blog";
  205:   if (mode === "marketplace-copy") return "marketplace";
  206:   if (mode === "ad-copy") return "ad";
  207:   if (mode === "email") return "email";
  208:   return "social";
  209: }
  210: 
  211: function defaultForm(state, mode = "social-post") {
  212:   const context = asObject(state.context);
  213:   const overview = asObject(state.data.overview?.overview);
  214:   return {
  215:     mode,
  216:     project: firstText(context.currentProject, overview.project_name),
  217:     campaign: firstText(context.activeCampaign, overview.active_campaign),
  218:     product: firstText(overview.project_name, context.currentProject),
  219:     channel: "instagram",
  220:     language: "English",
  221:     tone: firstText(overview.brand_voice, "Premium, direct, clear"),
  222:     objective: firstText(overview.primary_goal, "Create conversion-ready content"),
  223:     brief: "",
  224:     title: "",
  225:     status: "draft"
  226:   };
  227: }
  228: 
  229: function readDraftMap() {
  230:   if (typeof window === "undefined") return {};
  231:   try {
  232:     const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LOCAL_DRAFTS_KEY) || "{}");
  233:     return parsed && typeof parsed === "object" ? parsed : {};
  234:   } catch (_) {
  235:     return {};
  236:   }
  237: }
  238: 
  239: function writeDraftMap(map) {
  240:   if (typeof window === "undefined") return;
  241:   try {
  242:     window.localStorage?.setItem(CONTENT_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  243:   } catch (_) {}
  244: }
  245: 
  246: function loadLocalDrafts(projectName) {
  247:   return asArray(readDraftMap()[projectKey(projectName)]);
  248: }
  249: 
  250: function saveLocalDraft(projectName, draft) {
  251:   const map = readDraftMap();
  252:   const key = projectKey(projectName);
  253:   const next = {
  254:     ...asObject(draft),
  255:     id: asString(draft.id || `local-content-${Date.now()}`),
  256:     source: "Local draft",
  257:     localOnly: true,
  258:     updated_at: nowIso()
  259:   };
  260:   const existing = asArray(map[key]).filter((item) => asString(item.id) !== next.id);
  261:   map[key] = [next, ...existing].slice(0, 60);
  262:   writeDraftMap(map);
  263:   return next;
  264: }
  265: 
  266: function readContentLibraryMap() {
  267:   if (typeof window === "undefined") return {};
  268:   try {
  269:     const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
  270:     return parsed && typeof parsed === "object" ? parsed : {};
  271:   } catch (_) {
  272:     return {};
  273:   }
  274: }
  275: 
  276: function writeContentLibraryMap(map) {
  277:   if (typeof window === "undefined") return;
  278:   try {
  279:     window.localStorage?.setItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
  280:   } catch (_) {}
  281: }
  282: 
  283: function loadLocalLibraryAssets(projectName) {
  284:   const map = readContentLibraryMap();
  285:   return asArray(map[projectKey(projectName)]);
  286: }
  287: 
  288: function upsertLocalLibraryAsset(projectName, asset) {
  289:   const map = readContentLibraryMap();
  290:   const key = projectKey(projectName);
  291:   const next = {
  292:     ...asObject(asset),
  293:     id: asString(asset.id || `content-library-${Date.now()}`),
  294:     source_signature: asString(asset.source_signature),
  295:     updated_at: nowIso()
  296:   };
  297:   const existing = asArray(map[key]).filter((item) => {
  298:     const sameId = asString(item.id) === next.id;
  299:     const sameSig = next.source_signature && asString(item.source_signature) === next.source_signature;
  300:     return !(sameId || sameSig);
  301:   });
  302:   map[key] = [next, ...existing].slice(0, 120);
  303:   writeContentLibraryMap(map);
  304:   return next;
  305: }
  306: 
  307: function nextVersionId(versions = []) {
  308:   return `v${asArray(versions).length + 1}`;
  309: }
  310: 
  311: function createVersionEntry({
  312:   id,
  313:   mode = "social-post",
  314:   prompt = "",
  315:   outputContent = "",
  316:   language = "English",
  317:   tone = "",
  318:   channel = "",
  319:   readinessStatus = "draft",
  320:   approvalStatus = "draft",
  321:   notes = "",
  322:   libraryAssetRef = null,
```

### Routing/handoff

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
```

### Copy defect candidates

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | Found - focused proof required |
| Content generation/draft signals | Found - focused proof required |
| Publish/send/schedule signals | Found - focused proof required |
| Task/handoff signals | Found - focused proof required |
| Provider/job signals | Found - focused proof required |
| Confirmation gates | Not found |
| Storage signals | Found - verify scope |

## Decision Guidance
- If Content Studio can publish/send/schedule or mutate drafts, exact proof is required before any patch.
- If actions are route-only, copy-only, prompt-only, or disabled, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T50 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
