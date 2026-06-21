# T56 — Campaign Studio Runtime Authority Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/campaign-studio.js

## Why This Page Is Next
T55 rebaseline ranked Campaign Studio as the highest remaining open frontend risk candidate.

T55 signals:
- Score: 254.2
- Priority: P0
- Lines: 2023
- innerHTML: 1
- Events: 12
- API/write signals: 90
- Authority words: 131
- Confirmations: 0
- Storage: 0
- Escape evidence: 165

## Purpose
Verify whether Campaign Studio:
- creates or mutates campaign data
- creates tasks or handoffs
- triggers publishing/sending/scheduling
- creates ad/provider actions
- routes to Publishing/Content/Media/Governance safely
- uses explicit confirmation gates for sensitive actions
- renders dynamic content safely
- needs runtime patch or closeout

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 1554 | 1 |
| Escape / safe rendering evidence | 78 | 153 |
| Imported/backend API calls | 54 | 77 |
| Campaign planning signals | 1 | 476 |
| Publishing/send signals | 36 | 191 |
| Task/handoff writes | 1 | 42 |
| Approval/governance signals | 60 | 31 |
| Provider/job/ad signals | 1 | 345 |
| Confirmation gates | n/a | 0 |
| Event handlers | 1268 | 12 |
| Storage signals | n/a | 0 |
| Routing/handoff | 1 | 62 |
| Copy defect candidates | 320 | 12 |

## Evidence Zones

### HTML render / innerHTML

```js
 1474:     const state = getState();
 1475:     const projectName = state.context.currentProject || "";
 1476:     const session = ensureSession(projectName, buildDefaults(state));
 1477:     applyAiCampaignHandoff(projectName, state.data.operations, session);
 1478:     const values = session.values;
 1479:     const root = $("campaignStudioRoot");
 1480:     if (!root) return;
 1481: 
 1482:     const rerender = () => this.render({
 1483:       getState,
 1484:       $,
 1485:       escapeHtml,
 1486:       safeText,
 1487:       navigateTo,
 1488:       showMessage,
 1489:       showError,
 1490:       fetchProjectInsights,
 1491:       fetchProjectLearning,
 1492:       saveProjectCampaign,
 1493:       createProjectHandoff
 1494:     });
 1495: 
 1496:     startIntelligenceHydration({
 1497:       session,
 1498:       projectName,
 1499:       fetchProjectInsights,
 1500:       fetchProjectLearning,
 1501:       render: rerender,
 1502:       showError
 1503:     });
 1504: 
 1505:     const model = buildCampaignModel(state, session, values);
 1506:     const {
 1507:       overviewData,
 1508:       connectedChannels,
 1509:       scheduledJobs,
 1510:       requiredAssetTypes,
 1511:       assetTypesPresent,
 1512:       campaignAssetKeys,
 1513:       assetNextAction,
 1514:       missingAssets,
 1515:       missingIntegrations,
 1516:       platformSignals,
 1517:       topPatterns,
 1518:       weakPatterns,
 1519:       publishingWindows,
 1520:       seoOpportunities,
 1521:       paidSignals,
 1522:       channelMix,
 1523:       executionReadiness,
 1524:       strategyGuidance,
 1525:       waves,
 1526:       recommendations,
 1527:       intelligenceStatus,
 1528:       intelligenceError,
 1529:       hasLiveIntelligence
 1530:     } = model;
 1531:     const activeCampaignLabel = safeText(firstNonEmpty(state.context.activeCampaign, values.campaignName), projectName || "Campaign Studio");
 1532:     const intelligenceLabel = intelligenceStatus === "loading" ? "Refreshing" : hasLiveIntelligence ? "Live intelligence" : "Draft-assisted";
 1533:     const intelligenceTone = intelligenceStatus === "loading" ? "warning" : hasLiveIntelligence ? "success" : "neutral";
 1534:     const readinessTone = executionReadiness.total ? "warning" : "success";
 1535:     const blockerTone = executionReadiness.total ? "warning" : "success";
 1536:     const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
 1537:     const channelStateLabel = connectedChannels.length
 1538:       ? `${connectedChannels.length} connected`
 1539:       : recommendedChannelCount
 1540:         ? `${recommendedChannelCount} recommended`
 1541:         : "Needs signal";
 1542:     const channelTone = connectedChannels.length ? "success" : recommendedChannelCount ? "warning" : "neutral";
 1543:     const budgetValue = formatCurrency(values.budget, overviewData.currency || "USD");
 1544:     const budgetLabel = budgetValue === "-" ? "Budget pending" : budgetValue;
 1545:     const launchWindowLabel = [values.startDate, values.endDate].filter(Boolean).join(" to ") || "Window pending";
 1546:     const marketLabel = safeText(firstNonEmpty(values.market, overviewData.market), "Market pending");
 1547:     const productLabel = safeText(firstNonEmpty(values.productFocus, overviewData.project_name, projectName), "Product pending");
 1548:     const goalLabel = safeText(values.campaignGoal, "Goal pending");
 1549:     const strategistNextAction = safeText(strategyGuidance.nextAction, "Review campaign plan");
 1550:     const strategistMode = hasLiveIntelligence
 1551:       ? "Current intelligence is shaping campaign direction and readiness."
 1552:       : "Current draft data is projecting direction until live intelligence arrives.";
 1553: 
 1554:     root.innerHTML = `
 1555:       <div class="campaign-studio-wrapper">
 1556: 
 1557:         <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
 1558:           <div class="mhos-campaign-command-main mhos-context-main">
 1559:             <div class="mhos-campaign-kicker-row mhos-context-kicker">
 1560:               <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
 1561:               <span class="mhos-campaign-state mhos-campaign-state--${readinessTone}">${escapeHtml(executionReadiness.status)}</span>
 1562:             </div>
 1563:             <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
 1564:             <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
 1565:             <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
 1566:               <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
 1567:               <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
 1568:               <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
 1569:               <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
 1570:             </div>
 1571:           </div>
 1572: 
 1573:           <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
 1574:             <span class="mhos-campaign-panel-label">Strategist next move</span>
 1575:             <strong class="mhos-campaign-panel-action mhos-executive-guidance">${escapeHtml(strategistNextAction)}</strong>
 1576:             <p class="mhos-campaign-panel-copy mhos-executive-guidance">${escapeHtml(strategistMode)}</p>
 1577:           </aside>
 1578: 
 1579:           <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
 1580:             <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
 1581:             <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
 1582:             <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
 1583:           </div>
 1584: 
 1585:           <div class="mhos-campaign-operating-summary mhos-executive-summary-grid" aria-label="Campaign operating summary">
 1586:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${readinessTone} mhos-executive-summary-item">
 1587:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Readiness</span>
 1588:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(executionReadiness.status)}</strong>
 1589:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? `${executionReadiness.total} open gate${executionReadiness.total === 1 ? "" : "s"}` : "Launch gates clear")}</small>
 1590:             </article>
 1591:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${intelligenceTone} mhos-executive-summary-item">
 1592:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Intelligence</span>
 1593:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(intelligenceLabel)}</strong>
 1594:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(intelligenceError || (hasLiveIntelligence ? "Signals active" : "Projection mode"))}</small>
 1595:             </article>
 1596:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${blockerTone} mhos-executive-summary-item">
 1597:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Blockers</span>
 1598:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(String(executionReadiness.total))}</strong>
 1599:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(executionReadiness.total ? "Needs operator attention" : "No open launch blockers")}</small>
 1600:             </article>
 1601:             <article class="mhos-campaign-summary-item mhos-campaign-summary-item--${channelTone} mhos-executive-summary-item">
 1602:               <span class="mhos-campaign-metric-label mhos-executive-metric-label">Channels</span>
 1603:               <strong class="mhos-campaign-metric-value mhos-executive-metric-value">${escapeHtml(channelStateLabel)}</strong>
 1604:               <small class="mhos-campaign-metric-note mhos-executive-metric-note">${escapeHtml(recommendedChannelCount ? `${recommendedChannelCount} AI recommendations` : "Awaiting channel mix")}</small>
 1605:             </article>
 1606:           </div>
 1607:         </section>
 1608: 
 1609:         <div class="campaign-studio-layout">
 1610:           <form id="campaignStudioForm" class="campaign-studio-main">
 1611:             <section class="card">
 1612:               <div class="card-head">
 1613:                 <h3>Campaign Basics</h3>
 1614:                 <span class="card-badge neutral">Define</span>
 1615:               </div>
 1616:               <div class="campaign-section-copy">
 1617:                 Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
 1618:               </div>
 1619:               <div class="setup-form-grid setup-form-grid-2">
 1620:                 ${renderField({
 1621:                   name: "campaignName",
 1622:                   label: "Campaign name",
 1623:                   value: values.campaignName,
 1624:                   helper: "Use the shared name operators, AI, execution packages, and reporting should all reference.",
 1625:                   placeholder: "Spring launch wave 1",
 1626:                   escapeHtml
 1627:                 })}
 1628:                 ${renderField({
 1629:                   name: "campaignGoal",
 1630:                   label: "Campaign goal",
 1631:                   value: values.campaignGoal,
 1632:                   helper: "Lead with the business outcome: launch, revenue, retention, awareness, or activation.",
 1633:                   placeholder: "Launch, sales growth, lead generation...",
 1634:                   escapeHtml
```

### Escape / safe rendering evidence

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
  135:       .filter(Boolean)
  136:   ));
  137: }
  138: 
  139: function uniqueBy(items, keyFn) {
  140:   const seen = new Set();
  141:   return asArray(items).filter((item) => {
  142:     const key = keyFn(item);
  143:     if (!key || seen.has(key)) return false;
  144:     seen.add(key);
  145:     return true;
  146:   });
  147: }
  148: 
  149: function firstNonEmpty(...values) {
  150:   for (const value of values) {
  151:     const normalized = asString(value).trim();
  152:     if (normalized && normalized !== "[object Object]") return normalized;
  153:   }
  154:   return "";
  155: }
  156: 
  157: function readableValue(value, fallback = "") {
  158:   if (value == null) return fallback;
```

### Imported/backend API calls

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
```

### Campaign planning signals

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
```

### Publishing/send signals

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
```

### Task/handoff writes

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
```

### Approval/governance signals

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
   82: 
   83: function toNumber(value, fallback = null) {
   84:   const parsed = Number(value);
   85:   return Number.isFinite(parsed) ? parsed : fallback;
   86: }
   87: 
   88: function formatCurrency(value, currency = "USD") {
   89:   const parsed = Number(value);
   90:   if (!Number.isFinite(parsed)) return "-";
   91:   try {
   92:     return new Intl.NumberFormat(undefined, {
   93:       style: "currency",
   94:       currency: currency || "USD",
   95:       maximumFractionDigits: 0
   96:     }).format(parsed);
   97:   } catch (_) {
   98:     return `${currency || "USD"} ${Math.round(parsed)}`;
   99:   }
  100: }
  101: 
  102: function formatPercent(value, digits = 0) {
  103:   const parsed = Number(value);
  104:   if (!Number.isFinite(parsed)) return "-";
  105:   return `${parsed.toFixed(digits)}%`;
  106: }
  107: 
  108: function titleCase(value) {
  109:   return asString(value)
  110:     .replace(/[_-]+/g, " ")
  111:     .replace(/\b\w/g, (match) => match.toUpperCase());
  112: }
  113: 
  114: function renderTeamOpsSummary(model, escapeHtml) {
  115:   return `
  116:     <div class="data-stack">
  117:       <div class="data-row"><span>Service lane</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.serviceDomain))}</strong></div>
  118:       <div class="data-row"><span>Owner role</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.ownerRole))}</strong></div>
  119:       <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
  120:       <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
  121:       <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
  122:     </div>
  123:   `;
  124: }
  125: 
  126: function channelLabel(value) {
  127:   const key = asString(value).trim().toLowerCase();
  128:   return CHANNEL_LABELS[key] || titleCase(key) || "Unspecified";
  129: }
  130: 
  131: function uniqueStrings(values) {
  132:   return Array.from(new Set(
  133:     asArray(values)
  134:       .map((item) => asString(item).trim())
  135:       .filter(Boolean)
  136:   ));
  137: }
  138: 
  139: function uniqueBy(items, keyFn) {
  140:   const seen = new Set();
```

### Provider/job/ad signals

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
```

### Confirmation gates

_No match found._

### Event handlers

```js
 1188:   `;
 1189: }
 1190: 
 1191: function startIntelligenceHydration({
 1192:   session,
 1193:   projectName,
 1194:   fetchProjectInsights,
 1195:   fetchProjectLearning,
 1196:   render,
 1197:   showError
 1198: }) {
 1199:   if (!projectName) return;
 1200:   if (session.intelligence.status === "loading" || session.intelligence.status === "loaded") return;
 1201:   if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
 1202: 
 1203:   session.intelligence.status = "loading";
 1204:   session.intelligence.error = "";
 1205: 
 1206:   Promise.allSettled([
 1207:     typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
 1208:     typeof fetchProjectLearning === "function" ? fetchProjectLearning(projectName) : Promise.resolve(null)
 1209:   ])
 1210:     .then(([insightsResult, learningResult]) => {
 1211:       const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
 1212:       const learningMissing = learningResult?.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
 1213:       const insights = insightsResult?.status === "fulfilled"
 1214:         ? insightsResult.value
 1215:         : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
 1216:       const learning = learningResult?.status === "fulfilled"
 1217:         ? learningResult.value
 1218:         : (learningMissing ? { project: projectName, generated_at: new Date().toISOString(), learning_patterns: {}, recommendations: [] } : null);
 1219:       const errors = [
 1220:         insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
 1221:         learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
 1222:       ].filter(Boolean);
 1223: 
 1224:       session.intelligence.status = (insights || learning) ? "loaded" : "error";
 1225:       session.intelligence.insights = insights;
 1226:       session.intelligence.learning = learning;
 1227:       session.intelligence.error = errors.join(" • ");
 1228: 
 1229:       if (session.intelligence.status === "error" && session.intelligence.error) {
 1230:         showError?.(`Campaign intelligence could not be refreshed: ${session.intelligence.error}`);
 1231:       }
 1232: 
 1233:       render();
 1234:     })
 1235:     .catch((error) => {
 1236:       session.intelligence.status = "error";
 1237:       session.intelligence.error = error?.message || "Failed to load campaign intelligence";
 1238:       showError?.(session.intelligence.error);
 1239:       render();
 1240:     });
 1241: }
 1242: 
 1243: function bindCampaignStudio({
 1244:   $,
 1245:   getState,
 1246:   navigateTo,
 1247:   showMessage,
 1248:   showError,
 1249:   render,
 1250:   fetchProjectInsights,
 1251:   fetchProjectLearning,
 1252:   saveProjectCampaign,
 1253:   createProjectHandoff
 1254: }) {
 1255:   const state = getState();
 1256:   const projectName = state.context.currentProject || "";
 1257:   const session = ensureSession(projectName, buildDefaults(state));
 1258:   const durableCampaign = getSharedCampaignRecord(projectName, state.data.operations);
 1259:   if (durableCampaign) {
 1260:     session.recordId = asString(durableCampaign.id || session.recordId);
 1261:     session.values = hydrateValuesFromCampaignRecord(session.values, durableCampaign);
 1262:   }
 1263:   applyAiCampaignHandoff(projectName, state.data.operations, session);
 1264:   syncCampaignStudioBridge(projectName, session.values);
 1265: 
 1266:   const form = $("campaignStudioForm");
 1267:   if (form) {
 1268:     form.oninput = (event) => {
 1269:       const target = event.target;
 1270:       if (!target?.name) return;
 1271: 
 1272:       session.values[target.name] = target.value || "";
 1273:       syncCampaignStudioBridge(projectName, session.values);
 1274:       scheduleCampaignPersistence(projectName, session, saveProjectCampaign);
 1275: 
 1276:       // Do not rerender on every keystroke.
 1277:       // Rerendering here replaces the focused input and breaks typing/focus.
 1278:       // Explicit actions such as Save, Build, Refresh, and route handoffs still
 1279:       // persist the latest session values.
 1280:     };
 1281:   }
 1282: 
 1283:   const saveBtn = $("campaignSaveDraftBtn");
 1284:   if (saveBtn) {
 1285:     saveBtn.onclick = async () => {
 1286:       syncCampaignStudioBridge(projectName, session.values);
 1287:       try {
 1288:         const result = await saveProjectCampaign?.(projectName, buildCampaignRecordPayload(projectName, session));
 1289:         if (result?.campaign?.id) {
 1290:           session.recordId = result.campaign.id;
 1291:           setSharedCampaignRecord(projectName, result.campaign);
 1292:         }
 1293:         showMessage?.("Campaign draft saved to the shared operating backbone.");
 1294:       } catch (error) {
 1295:         showError?.(error.message || "Failed to save campaign plan.");
 1296:       }
 1297:     };
 1298:   }
 1299: 
 1300:   const buildBtn = $("campaignBuildPlanBtn");
 1301:   if (buildBtn) {
 1302:     buildBtn.onclick = async () => {
 1303:       syncCampaignStudioBridge(projectName, session.values);
 1304:       try {
 1305:         const result = await saveProjectCampaign?.(projectName, {
 1306:           ...buildCampaignRecordPayload(projectName, session),
 1307:           status: "planned"
 1308:         });
 1309:         if (result?.campaign?.id) {
 1310:           session.recordId = result.campaign.id;
 1311:           setSharedCampaignRecord(projectName, result.campaign);
 1312:         }
 1313:         showMessage?.("Campaign plan saved as a durable shared record.");
 1314:       } catch (error) {
 1315:         showError?.(error.message || "Failed to structure the campaign plan.");
 1316:       }
 1317:     };
 1318:   }
 1319: 
 1320:   const askAiBtn = $("campaignAskAiBtn");
 1321:   if (askAiBtn) {
 1322:     askAiBtn.onclick = async () => {
 1323:       const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
 1324:       const input = $("quickCommandInput");
 1325:       if (input) {
 1326:         input.value = prompt;
 1327:       }
 1328:       setSharedHandoff(projectName, "ai-command", {
 1329:         source_page: "campaign-studio",
 1330:         destination_page: "ai-command",
 1331:         payload: {
 1332:           prompt,
 1333:           campaign_id: session.recordId || "",
 1334:           campaign_name: session.values.campaignName || projectName,
 1335:           draft_context: buildCampaignRecordPayload(projectName, session)
 1336:         },
 1337:         status: "available"
 1338:       });
 1339:       createProjectHandoff?.(projectName, {
 1340:         source_page: "campaign-studio",
 1341:         destination_page: "ai-command",
 1342:         source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
 1343:         destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
 1344:         source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
 1345:         destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
 1346:         linked_entity: {
 1347:           entity_type: "campaign",
 1348:           entity_id: session.recordId || ""
```

### Storage signals

_No match found._

### Routing/handoff

```js
    1: import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
    2: import {
    3:   getAssetNextAction,
    4:   getCategoryReadinessList,
    5:   getMissingAssetLabels,
    6:   renderAssetDependencyRows
    7: } from "../asset-library.js";
    8: 
    9: const campaignSessions = new Map();
   10: const campaignSaveTimers = new Map();
   11: 
   12: const WAVE_DEFS = [
   13:   {
   14:     index: 1,
   15:     key: "wave1",
   16:     label: "Wave 1",
   17:     defaultRole: "Launch and announcement",
   18:     roleHint: "Use this wave to introduce the campaign, establish the core promise, and create awareness."
   19:   },
   20:   {
   21:     index: 2,
   22:     key: "wave2",
   23:     label: "Wave 2",
   24:     defaultRole: "Education and proof",
   25:     roleHint: "Use this wave to reinforce trust, deepen understanding, and turn interest into intent."
   26:   },
   27:   {
   28:     index: 3,
   29:     key: "wave3",
   30:     label: "Wave 3",
   31:     defaultRole: "Conversion and retargeting",
   32:     roleHint: "Use this wave to push the strongest offer, close objections, and convert active intent."
   33:   }
   34: ];
   35: 
   36: const CHANNEL_LABELS = {
   37:   instagram: "Instagram",
   38:   facebook: "Facebook",
   39:   tiktok: "TikTok",
   40:   youtube: "YouTube",
   41:   email: "Email",
   42:   website: "Website",
   43:   seo: "SEO",
   44:   google: "Google",
   45:   google_ads: "Google Ads",
   46:   meta: "Meta Ads",
   47:   blog: "Blog",
   48:   ads: "Paid Media",
   49:   analytics: "Analytics",
   50:   ecommerce: "Ecommerce",
   51:   linkedin: "LinkedIn"
   52: };
   53: 
   54: const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
   55: const TRACKING_KEYS = ["website", "analytics", "ecommerce"];
   56: const PAID_KEYS = ["meta", "google", "google_ads", "tiktok", "facebook", "instagram"];
   57: const CAMPAIGN_ROLE_DEFAULTS = {
   58:   serviceDomain: "campaign",
   59:   ownerRole: "strategist",
   60:   reviewRole: "admin"
   61: };
   62: const CAMPAIGN_ROUTE_ROLES = {
   63:   "content-studio": { role: "writer", domain: "content" },
   64:   "media-studio": { role: "designer", domain: "media" },
   65:   publishing: { role: "publisher", domain: "publishing" },
   66:   "ads-manager": { role: "ads_operator", domain: "campaign" },
   67:   "ai-command": { role: "admin", domain: "governance" }
   68: };
   69: 
   70: function asArray(value) {
   71:   return Array.isArray(value) ? value : [];
   72: }
   73: 
   74: function asObject(value) {
   75:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   76: }
   77: 
   78: function asString(value) {
   79:   if (value == null) return "";
   80:   return String(value);
   81: }
```

### Copy defect candidates

```js
  240:     startDate: "",
  241:     endDate: "",
  242:     budget: "5000",
  243:     wave1Name: campaignName,
  244:     wave1Focus: "Launch announcement",
  245:     wave1Channels: channels.slice(0, 3).join(", "),
  246:     wave2Name: "Education wave",
  247:     wave2Focus: "Problem awareness and proof",
  248:     wave2Channels: channels.slice(0, 2).join(", "),
  249:     wave3Name: "Conversion wave",
  250:     wave3Focus: "Offer push and retargeting",
  251:     wave3Channels: channels.slice(0, 2).join(", "),
  252:     assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
  253:     executionNotes: asArray(readiness.next_best_actions).join("; ")
  254:   };
  255: }
  256: 
  257: function ensureSession(projectName, defaults) {
  258:   const key = projectName || "__default__";
  259: 
  260:   if (!campaignSessions.has(key)) {
  261:     campaignSessions.set(key, {
  262:       values: { ...defaults },
  263:       recordId: "",
  264:       intelligence: {
  265:         status: "idle",
  266:         insights: null,
  267:         learning: null,
  268:         error: ""
  269:       },
  270:       generatedPackages: 0,
  271:       lastAiHandoffId: ""
  272:     });
  273:   } else {
  274:     const session = campaignSessions.get(key);
  275:     session.values = { ...defaults, ...asObject(session.values) };
  276:     session.recordId = asString(session.recordId);
  277:     session.intelligence = {
  278:       status: asString(session.intelligence?.status || "idle"),
  279:       insights: session.intelligence?.insights || null,
  280:       learning: session.intelligence?.learning || null,
  281:       error: asString(session.intelligence?.error)
  282:     };
  283:     session.generatedPackages = Number.isFinite(session.generatedPackages) ? session.generatedPackages : 0;
  284:     session.lastAiHandoffId = asString(session.lastAiHandoffId);
  285:   }
  286: 
  287:   return campaignSessions.get(key);
  288: }
  289: 
  290: function renderField({
  291:   name,
  292:   label,
  293:   value,
  294:   helper,
  295:   placeholder,
  296:   escapeHtml,
  297:   multiline = false,
  298:   rows = 3
  299: }) {
  300:   return `
  301:     <div class="setup-field-group">
  302:       <div class="setup-field-head">
  303:         <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
  304:         <span class="setup-field-state is-optional">Draft</span>
  305:       </div>
  306:       ${
  307:         multiline
  308:           ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
  309:           : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
  310:       }
  311:       <div class="setup-helper">${escapeHtml(helper)}</div>
  312:     </div>
  313:   `;
  314: }
  315: 
  316: function renderSummaryItem(label, value, escapeHtml) {
  317:   return `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(asString(value) || "-")}</strong></div>`;
  318: }
  319: 
  320: function syncCampaignStudioBridge(projectName, values) {
  321:   const current = getSharedCampaignRecord(projectName, null);
  322:   setSharedCampaignRecord(projectName, {
  323:     ...(current || {}),
  324:     project: projectName || "",
  325:     source_page: "campaign-studio",
  326:     name: asString(values?.campaignName),
  327:     objective: asString(values?.campaignGoal),
  328:     audience: asString(values?.audiencePrimary),
  329:     channels: asString(values?.channelPlan)
  330:       .split(",")
  331:       .map((item) => asString(item))
  332:       .filter(Boolean),
  333:     offer: asString(values?.offerHeadline),
  334:     timeline: [
  335:       asString(values?.startDate),
  336:       asString(values?.endDate)
  337:     ].filter(Boolean).join(" to "),
  338:     budget: asString(values?.budget),
  339:     status: "draft",
  340:     form_values: { ...asObject(values) },
  341:     updated_at: new Date().toISOString()
  342:   });
  343: }
  344: 
  345: function hydrateValuesFromCampaignRecord(defaults, campaign) {
  346:   const record = asObject(campaign);
  347:   const formValues = asObject(record.form_values);
  348: 
  349:   return {
  350:     ...defaults,
  351:     ...formValues,
  352:     campaignName: asString(formValues.campaignName || record.name || defaults.campaignName),
  353:     campaignGoal: asString(formValues.campaignGoal || record.objective || defaults.campaignGoal),
  354:     audiencePrimary: asString(formValues.audiencePrimary || record.audience || defaults.audiencePrimary),
  355:     channelPlan: asString(formValues.channelPlan || asArray(record.channels).join(", ") || defaults.channelPlan),
  356:     offerHeadline: asString(formValues.offerHeadline || record.offer || defaults.offerHeadline),
  357:     budget: asString(formValues.budget || record.budget || defaults.budget)
  358:   };
  359: }
  360: 
  361: function joinPackageList(value) {
  362:   if (!Array.isArray(value)) return readableValue(value);
  363:   return uniqueStrings(asArray(value).map((item) => {
  364:     if (typeof item === "string") return item;
  365:     const record = asObject(item);
  366:     return firstNonEmpty(record.name, record.title, record.label, record.channel, record.product, record.summary, record.action);
  367:   })).join(", ");
  368: }
  369: 
  370: function phaseValue(phases, index, key) {
  371:   const phase = asObject(asArray(phases)[index]);
  372:   if (!Object.keys(phase).length) return "";
  373:   if (key === "name") return firstNonEmpty(phase.name, phase.title, `Wave ${index + 1}`);
  374:   if (key === "focus") return firstNonEmpty(phase.goal, phase.objective, phase.focus, phase.summary, joinPackageList(phase.actions || phase.steps));
  375:   if (key === "channels") return joinPackageList(phase.channels);
  376:   return "";
  377: }
  378: 
  379: function applyAiCampaignHandoff(projectName, operations, session) {
  380:   const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
  381:   const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
  382:   if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
  383: 
  384:   const payload = asObject(handoff.payload);
  385:   const output = asObject(payload.output);
  386:   const response = asObject(output.response || output);
  387:   const pkg = asObject(response.campaignPackage || response.campaign_package || payload.campaignPackage || payload.campaign_package);
  388:   if (!Object.keys(pkg).length) return false;
  389: 
  390:   const phases = asArray(pkg.launchPhases || pkg.launch_phases || pkg.phases);
  391:   session.values = {
  392:     ...session.values,
  393:     campaignName: firstNonEmpty(pkg.concept, pkg.campaignConcept, response.title, session.values.campaignName),
  394:     campaignGoal: firstNonEmpty(response.summary, pkg.goal, pkg.objective, session.values.campaignGoal),
  395:     productFocus: firstNonEmpty(joinPackageList(pkg.products), session.values.productFocus),
  396:     productAngle: firstNonEmpty(joinPackageList(pkg.contentAngles || pkg.content_angles), pkg.concept, session.values.productAngle),
  397:     audiencePrimary: firstNonEmpty(pkg.targetAudience, pkg.target_audience, pkg.audience, session.values.audiencePrimary),
  398:     audienceNeed: firstNonEmpty(pkg.audienceNeed, pkg.audience_need, session.values.audienceNeed),
  399:     channelPlan: firstNonEmpty(joinPackageList(pkg.channels), session.values.channelPlan),
  400:     offerHeadline: firstNonEmpty(pkg.offer, pkg.offerStrategy, pkg.offer_strategy, session.values.offerHeadline),
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API/write signals | Found - focused proof required |
| Publish/send/schedule/ad signals | Found - focused proof required |
| Task/handoff signals | Found - focused proof required |
| Approval/governance signals | Found - focused proof required |
| Provider/job/ad execution signals | Found - focused proof required |
| Confirmation gates | Not found |
| Storage signals | Not found |

## Decision Guidance
- If Campaign Studio can publish/send/schedule/create ads or mutate backend campaign data, exact proof is required before any patch.
- If actions are route-only, copy-only, prompt-only, read-only, or disabled, document and close if safe.
- If sensitive backend writes exist without confirmation, add minimal confirmation gates only after focused proof.
- Do not patch from T56 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
