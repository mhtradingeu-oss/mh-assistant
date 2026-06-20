# T29 — Settings Runtime Authority + Governance Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/settings.js

## Why This Page Is Next
After closing Integrations and AI Command Tool Dock, T19 ranked Settings as the next remaining P1 review candidate.

## Purpose
Verify whether Settings:
- writes runtime/project/governance state directly
- requires confirmations before sensitive changes
- uses backend authority correctly
- avoids direct dangerous actions
- renders dynamic content safely
- needs runtime patch or only UX/copy polish

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 1811 | 5 |
| Escape / safe rendering evidence | 702 | 121 |
| Settings save/update actions | 4 | 283 |
| Governance / approval policy wording | 2 | 197 |
| Confirmations | 1853 | 1 |
| Backend/API calls | 6 | 1 |
| Dangerous/direct actions | 34 | 182 |
| Event handlers | 1844 | 4 |
| Local/session storage | n/a | 0 |
| Project data writes | 4 | 5 |
| Navigation / route handoff | 1933 | 3 |
| Copy defect candidates | n/a | 0 |


## Evidence Zones

### HTML render / innerHTML

```js
 1721:           <strong>${escapeHtml(summary.projectMode)}</strong>
 1722:         </div>
 1723:         <div class="data-card">
 1724:           <span class="data-label">AI mode</span>
 1725:           <strong>${escapeHtml(summary.aiMode)}</strong>
 1726:         </div>
 1727:         <div class="data-card">
 1728:           <span class="data-label">Approval mode</span>
 1729:           <strong>${escapeHtml(summary.approvalMode)}</strong>
 1730:         </div>
 1731:         <div class="data-card">
 1732:           <span class="data-label">Publishing mode</span>
 1733:           <strong>${escapeHtml(summary.publishingMode)}</strong>
 1734:         </div>
 1735:         <div class="data-card">
 1736:           <span class="data-label">Sync mode</span>
 1737:           <strong>${escapeHtml(summary.syncMode)}</strong>
 1738:         </div>
 1739:         <div class="data-card">
 1740:           <span class="data-label">Persistence</span>
 1741:           <strong>${escapeHtml(session.saveMode === "durable" ? "Durable backbone" : session.loading ? "Syncing..." : "Durable pending")}</strong>
 1742:         </div>
 1743:       </div>
 1744: 
 1745:       <div class="simple-banner">
 1746:         <strong>Status:</strong> ${escapeHtml(formatRelativeTime(session.savedAt))}. Save updates durable team and governance records; backend enforcement remains authoritative.
 1747:       </div>
 1748:       <div class="settings-actions-buttons std-action-row">
 1749:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="operating">Open operating mode</button>
 1750:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="sync">Open sync policy</button>
 1751:         <button class="btn btn-secondary" type="button" data-settings-action="open-governance">Open Governance page</button>
 1752:       </div>
 1753:     </aside>
 1754:   `;
 1755: }
 1756: 
 1757: function renderActions(session, escapeHtml) {
 1758:   const dirtyText = session.dirty ? "Unsaved changes" : "All changes captured";
 1759: 
 1760:   return `
 1761:     <section class="settings-actions panel std-action-panel mhos-clean-surface">
 1762:       <div class="panel-header">
 1763:         <div class="settings-actions-copy">
 1764:           <div class="panel-kicker">Settings actions</div>
 1765:           <h3>Execute safe configuration updates</h3>
 1766:           <p>${escapeHtml(dirtyText)}. Saving writes this configuration into durable team and governance records used across the operating system.</p>
 1767:         </div>
 1768:       </div>
 1769:       <div class="simple-banner">
 1770:         <strong>Safe execution path:</strong> Review readiness and blockers, update the required section, save once, then validate Governance impact.
 1771:       </div>
 1772:       <div class="settings-actions-buttons std-action-row">
 1773:         <button class="btn btn-primary" type="button" data-settings-action="save-all">Save Settings</button>
 1774:         <button class="btn btn-secondary" type="button" data-settings-action="review-critical">Review Critical Settings</button>
 1775:         <button class="btn btn-secondary" type="button" data-settings-action="restore-defaults">Restore Defaults</button>
 1776:       </div>
 1777:       <div class="settings-actions-buttons std-action-row">
 1778:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="project">Project defaults</button>
 1779:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="team">Team permissions</button>
 1780:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="safety">Safety and governance</button>
 1781:       </div>
 1782:     </section>
 1783:   `;
 1784: }
 1785: 
 1786: function buildPageMarkup(session, escapeHtml) {
 1787:   const summary = buildSummary(session);
 1788: 
 1789:   return `
 1790:     <section class="page is-active" data-page="settings">
 1791:       <div class="settings-page-surface">
 1792:         <div class="settings-workspace-grid">
 1793:           <div class="settings-main-stack std-main-column mhos-clean-stack">
 1794:             ${renderSettingsOverview(summary, session, escapeHtml)}
 1795:             ${SETTINGS_GROUPS.map((group) => renderGroupedSection(group, session, escapeHtml)).join("")}
 1796:           </div>
 1797:           <aside class="settings-right-rail std-right-rail mhos-clean-stack">
 1798:             ${renderSummary(summary, session, escapeHtml)}
 1799:             ${renderActions(session, escapeHtml)}
 1800:             ${renderSettingsAssistant(session, escapeHtml)}
 1801:           </aside>
 1802:         </div>
 1803:       </div>
 1804:     </section>
 1805:   `;
 1806: }
 1807: 
 1808: function refreshSummary(root, session, escapeHtml) {
 1809:   const overviewHost = root.querySelector(".settings-overview");
 1810:   if (overviewHost) {
 1811:     overviewHost.outerHTML = renderSettingsOverview(buildSummary(session), session, escapeHtml);
 1812:   }
 1813:   const summaryHost = root.querySelector(".settings-summary");
 1814:   if (summaryHost) {
 1815:     summaryHost.outerHTML = renderSummary(buildSummary(session), session, escapeHtml);
 1816:   }
 1817:   const aiHost = root.querySelector(".settings-ai-assistant");
 1818:   if (aiHost) {
 1819:     aiHost.outerHTML = renderSettingsAssistant(session, escapeHtml);
 1820:   }
 1821: }
 1822: 
 1823: function refreshActionState(root, session) {
 1824:   const intro = root.querySelector(".settings-actions-copy p");
 1825:   if (intro) {
 1826:     intro.textContent = session.dirty
 1827:       ? "Unsaved changes are present. Saving will update the shared durable governance and team records."
 1828:       : "All changes captured. The shared durable governance and team records are in sync.";
 1829:   }
 1830: }
 1831: 
 1832: function replacePage(context, session) {
 1833:   const root = context.$("pageRoot");
 1834:   if (!root) return;
 1835: 
 1836:   root.innerHTML = buildPageMarkup(session, context.escapeHtml);
 1837: }
 1838: 
 1839: function bindSettingsActionButtons(context, session) {
 1840:   const root = context.$("pageRoot");
 1841:   if (!root) return;
 1842: 
 1843:   root.querySelectorAll("[data-settings-action]").forEach((button) => {
 1844:     button.addEventListener("click", async () => {
 1845:       const action = button.dataset.settingsAction;
 1846:       const sectionId = button.dataset.sectionId;
 1847: 
 1848:       if (action === "save-all") {
 1849:         try {
 1850:           const governancePayload = mapSettingsToGovernancePolicy(session.form);
 1851:           const teamPayload = mapSettingsToTeamPayload(session.form);
 1852: 
 1853:           const confirmed = window.confirm("Confirm settings save\n\nAction: Save team and governance settings for this project.\nRisk: These settings can affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable settings update.\n\nSelect Cancel to review the settings before saving.");
 1854:           if (!confirmed) {
 1855:             return;
 1856:           }
 1857: 
 1858:           await Promise.all([
 1859:             saveProjectTeam(session.projectName, teamPayload),
 1860:             updateProjectGovernancePolicy(session.projectName, {
 1861:               actor: "settings-page",
 1862:               ...governancePayload
 1863:             })
 1864:           ]);
 1865: 
 1866:           await context.createProjectHandoff?.(session.projectName, {
 1867:             source_page: "settings",
 1868:             destination_page: "governance",
 1869:             source_role: "admin",
 1870:             destination_role: "compliance_reviewer",
 1871:             source_service_domain: "system",
 1872:             destination_service_domain: "governance",
 1873:             linked_entity: {
 1874:               entity_type: "governance_policy",
 1875:               entity_id: "default",
 1876:               route: "governance",
 1877:               label: "Governance policy"
 1878:             },
 1879:             payload: {
 1880:               summary: "Settings updated the shared durable operating policy.",
 1881:               draft_context: {
 1882:                 projectName: session.projectName,
 1883:                 saveMode: "durable",
 1884:                 riskCount: buildSummary(session).risks.length
 1885:               }
 1886:             }
 1887:           });
 1888: 
 1889:           session.savedAt = nowIso();
 1890:           session.saveMode = "durable";
 1891:           session.governancePolicy = governancePayload;
 1892:           session.teamModel = {
 1893:             ...asObject(session.teamModel),
 1894:             ...teamPayload
 1895:           };
 1896:           session.dirty = false;
 1897:           refreshSummary(root, session, context.escapeHtml);
 1898:           refreshActionState(root, session);
 1899:           await context.reloadProjectData?.(session.projectName);
 1900:           context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
 1901:         } catch (error) {
```

### Escape / safe rendering evidence

```js
  612:         label: "Legal / policy caution notes",
  613:         type: "textarea",
  614:         placeholder: "Escalate medical, efficacy, or comparative claims for human review before publication."
  615:       }
  616:     ]
  617:   }
  618: ];
  619: 
  620: const SETTINGS_GROUPS = [
  621:   {
  622:     id: "project-config",
  623:     title: "Project Settings",
  624:     description: "Manage project identity, publishing defaults, and reusable presets without scattering core setup across multiple cards.",
  625:     sectionIds: ["project", "publishing", "presets"]
  626:   },
  627:   {
  628:     id: "ai-automation",
  629:     title: "AI / Automation Settings",
  630:     description: "Control system mode, AI behavior, automation routing, and safety rules in one execution-focused workspace.",
  631:     sectionIds: ["operating", "ai", "automation", "safety"]
  632:   },
  633:   {
  634:     id: "team-permissions",
  635:     title: "Team / Permissions",
  636:     description: "Keep approval ownership, publishing permissions, and team-role authority together so governance stays understandable.",
  637:     sectionIds: ["approval", "team"]
  638:   },
  639:   {
  640:     id: "integration-sync",
  641:     title: "Integration / Sync Settings",
  642:     description: "Review connector refresh behavior, import policy, and alert routing without turning Settings into a sync control center.",
  643:     sectionIds: ["sync", "alerts"]
  644:   }
  645: ];
  646: 
  647: function clone(value) {
  648:   return JSON.parse(JSON.stringify(value));
  649: }
  650: 
  651: function titleCase(value) {
  652:   return String(value || "")
  653:     .replace(/[_-]+/g, " ")
  654:     .replace(/\b\w/g, (match) => match.toUpperCase());
  655: }
  656: 
  657: function asObject(value) {
  658:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  659: }
  660: 
  661: function getPathValue(source, path) {
  662:   return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
  663: }
  664: 
  665: function setPathValue(target, path, value) {
  666:   const parts = path.split(".");
  667:   let cursor = target;
  668: 
  669:   parts.forEach((part, index) => {
  670:     if (index === parts.length - 1) {
  671:       cursor[part] = value;
  672:       return;
  673:     }
  674: 
  675:     if (!cursor[part] || typeof cursor[part] !== "object") {
  676:       cursor[part] = {};
  677:     }
  678: 
  679:     cursor = cursor[part];
  680:   });
  681: }
  682: 
  683: function nowIso() {
  684:   return new Date().toISOString();
  685: }
  686: 
  687: function extractDurableSettingsSnapshot(governancePolicy = {}, teamModel = {}) {
  688:   const governance = asObject(governancePolicy);
  689:   const bridge = asObject(governance.settings_bridge);
  690:   const team = asObject(teamModel);
  691:   const snapshot = asObject(team.settings_profile || bridge.form);
  692:   const owners = asObject(governance.approval_owners);
  693:   const rules = asObject(governance.policy_rules);
  694: 
  695:   if (!Object.keys(snapshot).length && !Object.keys(owners).length && !Object.keys(rules).length) {
  696:     return null;
  697:   }
  698: 
  699:   const normalized = clone(snapshot);
  700:   normalized.project = {
  701:     ...asObject(normalized.project),
  702:     defaultCampaignMode: asString(normalized.project?.defaultCampaignMode || bridge.execution_mode)
  703:   };
  704:   normalized.operating = {
  705:     ...asObject(normalized.operating),
  706:     actionPolicy: asString(normalized.operating?.actionPolicy || bridge.action_policy)
  707:   };
  708:   normalized.ai = {
  709:     ...asObject(normalized.ai),
  710:     approvalRequiredMode: asString(normalized.ai?.approvalRequiredMode || bridge.approval_mode),
  711:     claimSafetyMode: asString(normalized.ai?.claimSafetyMode || bridge.claim_safety_mode)
  712:   };
  713:   normalized.publishing = {
  714:     ...asObject(normalized.publishing),
  715:     approvalBeforePublish: rules.approval_before_publish ?? normalized.publishing?.approvalBeforePublish
  716:   };
  717:   normalized.safety = {
  718:     ...asObject(normalized.safety),
  719:     aiClaimCheck: rules.high_risk_claim_review_required ?? normalized.safety?.aiClaimCheck
  720:   };
  721:   normalized.approval = {
  722:     ...asObject(normalized.approval),
  723:     contentOwner: asString(normalized.approval?.contentOwner || owners.content),
  724:     mediaOwner: asString(normalized.approval?.mediaOwner || owners.media),
  725:     adsOwner: asString(normalized.approval?.adsOwner || owners.campaign)
  726:   };
  727:   normalized.team = {
  728:     ...asObject(normalized.team),
  729:     publishAccess: asString(normalized.team?.publishAccess || owners.publishing),
  730:     roles: Array.isArray(normalized.team?.roles)
  731:       ? normalized.team.roles
  732:       : asArray(team.members).map((member) => titleCase(member.role)).filter(Boolean)
  733:   };
  734: 
  735:   return normalized;
  736: }
  737: 
  738: function mapSettingsToTeamPayload(form = {}) {
  739:   return {
  740:     active_role: "admin",
  741:     settings_profile: clone(form),
  742:     settings_status: {
  743:       state: "configured",
  744:       saved_at: nowIso(),
  745:       source: "settings-page",
  746:       owner_role: "admin"
  747:     },
  748:     project_profile: {
  749:       project_name: asString(form.project?.projectName),
  750:       market: asString(form.project?.market),
  751:       language: asString(form.project?.language),
  752:       business_type: asString(form.project?.businessType),
  753:       website: asString(form.project?.website)
  754:     }
  755:   };
  756: }
  757: 
  758: function mapSettingsToGovernancePolicy(form = {}) {
  759:   const approval = asObject(form.approval);
  760:   const publishing = asObject(form.publishing);
  761:   const safety = asObject(form.safety);
  762:   const ai = asObject(form.ai);
  763:   const operating = asObject(form.operating);
  764:   const project = asObject(form.project);
  765:   const team = asObject(form.team);
  766: 
  767:   return {
  768:     execution_policy: {
  769:       mode: asString(project.defaultCampaignMode || operating.primaryMode),
  770:       action_policy: asString(operating.actionPolicy)
  771:     },
  772:     policy_rules: {
  773:       approval_before_publish: Boolean(publishing.approvalBeforePublish),
  774:       high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
  775:       brand_safety_review_required: true,
  776:       allow_admin_override: true,
  777:       auto_escalate_critical_risk: asString(operating.actionPolicy).toLowerCase().includes("blocked"),
  778:       freeze_publishing: asString(operating.primaryMode) === "Emergency Safe Mode"
  779:     },
  780:     approval_owners: {
  781:       content: asString(approval.contentOwner) || "Marketing lead",
  782:       media: asString(approval.mediaOwner) || "Creative lead",
  783:       campaign: asString(approval.adsOwner) || "Operations lead",
  784:       publishing: asString(team.publishAccess) || "Publisher",
  785:       compliance: "Compliance Reviewer",
  786:       overrides: "Admin"
  787:     },
  788:     settings_bridge: {
  789:       source: "settings-durable-record",
  790:       synced_at: nowIso(),
  791:       approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
  792:       claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
```

### Settings save/update actions

```js
    1: import {
    2:   fetchProjectGovernancePolicy,
    3:   fetchProjectTeam,
    4:   saveProjectTeam,
    5:   updateProjectGovernancePolicy
    6: } from "../api.js";
    7: 
    8: const sessions = new Map();
    9: 
   10: const OPERATING_MODE_OPTIONS = [
   11:   {
   12:     value: "Planning Mode",
   13:     label: "Planning Mode",
   14:     description: "Recommend, prioritize, and prepare work without taking action."
   15:   },
   16:   {
   17:     value: "Guided Execution",
   18:     label: "Guided Execution",
   19:     description: "Prepare actions and prompt operators step by step."
   20:   },
   21:   {
   22:     value: "Semi-Auto",
   23:     label: "Semi-Auto",
   24:     description: "Automate low-risk work while keeping humans in the loop."
   25:   },
   26:   {
   27:     value: "Approval-First",
   28:     label: "Approval-First",
   29:     description: "Everything important queues for human review before execution."
   30:   },
   31:   {
   32:     value: "Full AI Assist",
   33:     label: "Full AI Assist",
   34:     description: "The system acts aggressively inside approved guardrails."
   35:   },
   36:   {
   37:     value: "Emergency Safe Mode",
   38:     label: "Emergency Safe Mode",
   39:     description: "Freeze automation and reduce the system to protective operations."
   40:   }
   41: ];
   42: 
   43: const AUTOMATION_RULE_OPTIONS = [
   44:   "Suggest workflows when campaign is ready",
   45:   "Block publishing when assets are missing",
   46:   "Suggest rewrite when content is weak",
   47:   "Alert when integrations fail",
   48:   "Route SEO issues into Research/Workflows",
   49:   "Route weak ads into Ads Manager"
   50: ];
   51: 
   52: const TEAM_ROLE_OPTIONS = [
   53:   "Strategist",
   54:   "Writer",
   55:   "Designer",
   56:   "Video Lead",
   57:   "Publisher",
   58:   "Ads Operator",
   59:   "Analyst",
   60:   "Compliance Reviewer",
   61:   "Admin",
   62:   "Brand owner"
   63: ];
   64: 
   65: const TEAM_ROLE_MATRIX = [
   66:   {
   67:     id: "strategist",
   68:     label: "Strategist",
   69:     service: "Planning & campaign architecture",
   70:     description: "Shapes priorities, campaign structures, and workflow sequencing."
   71:   },
   72:   {
   73:     id: "writer",
   74:     label: "Writer",
   75:     service: "Messaging & content generation",
   76:     description: "Develops copy systems, rewrites, and narrative consistency."
   77:   },
   78:   {
   79:     id: "designer",
   80:     label: "Designer",
   81:     service: "Static creative & brand expression",
   82:     description: "Owns visual quality, layout intent, and asset polish."
   83:   },
   84:   {
   85:     id: "videoLead",
   86:     label: "Video Lead",
   87:     service: "Motion creative & video delivery",
   88:     description: "Directs short-form and long-form motion output standards."
   89:   },
   90:   {
   91:     id: "publisher",
   92:     label: "Publisher",
   93:     service: "Distribution & release operations",
   94:     description: "Controls schedules, queues, and final outbound execution."
```

### Governance / approval policy wording

```js
    1: import {
    2:   fetchProjectGovernancePolicy,
    3:   fetchProjectTeam,
    4:   saveProjectTeam,
    5:   updateProjectGovernancePolicy
    6: } from "../api.js";
    7: 
    8: const sessions = new Map();
    9: 
   10: const OPERATING_MODE_OPTIONS = [
   11:   {
   12:     value: "Planning Mode",
   13:     label: "Planning Mode",
   14:     description: "Recommend, prioritize, and prepare work without taking action."
   15:   },
   16:   {
   17:     value: "Guided Execution",
   18:     label: "Guided Execution",
   19:     description: "Prepare actions and prompt operators step by step."
   20:   },
   21:   {
   22:     value: "Semi-Auto",
   23:     label: "Semi-Auto",
   24:     description: "Automate low-risk work while keeping humans in the loop."
   25:   },
   26:   {
   27:     value: "Approval-First",
   28:     label: "Approval-First",
   29:     description: "Everything important queues for human review before execution."
   30:   },
   31:   {
   32:     value: "Full AI Assist",
   33:     label: "Full AI Assist",
   34:     description: "The system acts aggressively inside approved guardrails."
   35:   },
   36:   {
   37:     value: "Emergency Safe Mode",
   38:     label: "Emergency Safe Mode",
   39:     description: "Freeze automation and reduce the system to protective operations."
   40:   }
   41: ];
   42: 
   43: const AUTOMATION_RULE_OPTIONS = [
   44:   "Suggest workflows when campaign is ready",
   45:   "Block publishing when assets are missing",
   46:   "Suggest rewrite when content is weak",
   47:   "Alert when integrations fail",
   48:   "Route SEO issues into Research/Workflows",
   49:   "Route weak ads into Ads Manager"
   50: ];
   51: 
   52: const TEAM_ROLE_OPTIONS = [
   53:   "Strategist",
   54:   "Writer",
   55:   "Designer",
   56:   "Video Lead",
   57:   "Publisher",
   58:   "Ads Operator",
   59:   "Analyst",
   60:   "Compliance Reviewer",
   61:   "Admin",
   62:   "Brand owner"
   63: ];
   64: 
   65: const TEAM_ROLE_MATRIX = [
   66:   {
   67:     id: "strategist",
   68:     label: "Strategist",
   69:     service: "Planning & campaign architecture",
   70:     description: "Shapes priorities, campaign structures, and workflow sequencing."
   71:   },
   72:   {
   73:     id: "writer",
   74:     label: "Writer",
   75:     service: "Messaging & content generation",
   76:     description: "Develops copy systems, rewrites, and narrative consistency."
   77:   },
   78:   {
   79:     id: "designer",
   80:     label: "Designer",
   81:     service: "Static creative & brand expression",
   82:     description: "Owns visual quality, layout intent, and asset polish."
   83:   },
   84:   {
   85:     id: "videoLead",
   86:     label: "Video Lead",
   87:     service: "Motion creative & video delivery",
   88:     description: "Directs short-form and long-form motion output standards."
   89:   },
   90:   {
   91:     id: "publisher",
   92:     label: "Publisher",
```

### Confirmations

```js
 1763:         <div class="settings-actions-copy">
 1764:           <div class="panel-kicker">Settings actions</div>
 1765:           <h3>Execute safe configuration updates</h3>
 1766:           <p>${escapeHtml(dirtyText)}. Saving writes this configuration into durable team and governance records used across the operating system.</p>
 1767:         </div>
 1768:       </div>
 1769:       <div class="simple-banner">
 1770:         <strong>Safe execution path:</strong> Review readiness and blockers, update the required section, save once, then validate Governance impact.
 1771:       </div>
 1772:       <div class="settings-actions-buttons std-action-row">
 1773:         <button class="btn btn-primary" type="button" data-settings-action="save-all">Save Settings</button>
 1774:         <button class="btn btn-secondary" type="button" data-settings-action="review-critical">Review Critical Settings</button>
 1775:         <button class="btn btn-secondary" type="button" data-settings-action="restore-defaults">Restore Defaults</button>
 1776:       </div>
 1777:       <div class="settings-actions-buttons std-action-row">
 1778:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="project">Project defaults</button>
 1779:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="team">Team permissions</button>
 1780:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="safety">Safety and governance</button>
 1781:       </div>
 1782:     </section>
 1783:   `;
 1784: }
 1785: 
 1786: function buildPageMarkup(session, escapeHtml) {
 1787:   const summary = buildSummary(session);
 1788: 
 1789:   return `
 1790:     <section class="page is-active" data-page="settings">
 1791:       <div class="settings-page-surface">
 1792:         <div class="settings-workspace-grid">
 1793:           <div class="settings-main-stack std-main-column mhos-clean-stack">
 1794:             ${renderSettingsOverview(summary, session, escapeHtml)}
 1795:             ${SETTINGS_GROUPS.map((group) => renderGroupedSection(group, session, escapeHtml)).join("")}
 1796:           </div>
 1797:           <aside class="settings-right-rail std-right-rail mhos-clean-stack">
 1798:             ${renderSummary(summary, session, escapeHtml)}
 1799:             ${renderActions(session, escapeHtml)}
 1800:             ${renderSettingsAssistant(session, escapeHtml)}
 1801:           </aside>
 1802:         </div>
 1803:       </div>
 1804:     </section>
 1805:   `;
 1806: }
 1807: 
 1808: function refreshSummary(root, session, escapeHtml) {
 1809:   const overviewHost = root.querySelector(".settings-overview");
 1810:   if (overviewHost) {
 1811:     overviewHost.outerHTML = renderSettingsOverview(buildSummary(session), session, escapeHtml);
 1812:   }
 1813:   const summaryHost = root.querySelector(".settings-summary");
 1814:   if (summaryHost) {
 1815:     summaryHost.outerHTML = renderSummary(buildSummary(session), session, escapeHtml);
 1816:   }
 1817:   const aiHost = root.querySelector(".settings-ai-assistant");
 1818:   if (aiHost) {
 1819:     aiHost.outerHTML = renderSettingsAssistant(session, escapeHtml);
 1820:   }
 1821: }
 1822: 
 1823: function refreshActionState(root, session) {
 1824:   const intro = root.querySelector(".settings-actions-copy p");
 1825:   if (intro) {
 1826:     intro.textContent = session.dirty
 1827:       ? "Unsaved changes are present. Saving will update the shared durable governance and team records."
 1828:       : "All changes captured. The shared durable governance and team records are in sync.";
 1829:   }
 1830: }
 1831: 
 1832: function replacePage(context, session) {
 1833:   const root = context.$("pageRoot");
 1834:   if (!root) return;
 1835: 
 1836:   root.innerHTML = buildPageMarkup(session, context.escapeHtml);
 1837: }
 1838: 
 1839: function bindSettingsActionButtons(context, session) {
 1840:   const root = context.$("pageRoot");
 1841:   if (!root) return;
 1842: 
 1843:   root.querySelectorAll("[data-settings-action]").forEach((button) => {
 1844:     button.addEventListener("click", async () => {
 1845:       const action = button.dataset.settingsAction;
 1846:       const sectionId = button.dataset.sectionId;
 1847: 
 1848:       if (action === "save-all") {
 1849:         try {
 1850:           const governancePayload = mapSettingsToGovernancePolicy(session.form);
 1851:           const teamPayload = mapSettingsToTeamPayload(session.form);
 1852: 
 1853:           const confirmed = window.confirm("Confirm settings save\n\nAction: Save team and governance settings for this project.\nRisk: These settings can affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable settings update.\n\nSelect Cancel to review the settings before saving.");
 1854:           if (!confirmed) {
 1855:             return;
 1856:           }
 1857: 
 1858:           await Promise.all([
 1859:             saveProjectTeam(session.projectName, teamPayload),
 1860:             updateProjectGovernancePolicy(session.projectName, {
 1861:               actor: "settings-page",
 1862:               ...governancePayload
 1863:             })
 1864:           ]);
 1865: 
 1866:           await context.createProjectHandoff?.(session.projectName, {
 1867:             source_page: "settings",
 1868:             destination_page: "governance",
 1869:             source_role: "admin",
 1870:             destination_role: "compliance_reviewer",
 1871:             source_service_domain: "system",
 1872:             destination_service_domain: "governance",
 1873:             linked_entity: {
 1874:               entity_type: "governance_policy",
 1875:               entity_id: "default",
 1876:               route: "governance",
 1877:               label: "Governance policy"
 1878:             },
 1879:             payload: {
 1880:               summary: "Settings updated the shared durable operating policy.",
 1881:               draft_context: {
 1882:                 projectName: session.projectName,
 1883:                 saveMode: "durable",
 1884:                 riskCount: buildSummary(session).risks.length
 1885:               }
 1886:             }
 1887:           });
 1888: 
 1889:           session.savedAt = nowIso();
 1890:           session.saveMode = "durable";
 1891:           session.governancePolicy = governancePayload;
 1892:           session.teamModel = {
 1893:             ...asObject(session.teamModel),
 1894:             ...teamPayload
 1895:           };
 1896:           session.dirty = false;
 1897:           refreshSummary(root, session, context.escapeHtml);
 1898:           refreshActionState(root, session);
 1899:           await context.reloadProjectData?.(session.projectName);
 1900:           context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
 1901:         } catch (error) {
 1902:           context.showError(error.message || "Failed to save durable settings.");
 1903:         }
 1904:         return;
 1905:       }
 1906: 
 1907:       if (action === "restore-defaults") {
 1908:         session.form = clone(session.defaults);
 1909:         session.dirty = true;
 1910:         replacePage(context, session);
 1911:         bindFormEvents(context, session);
 1912:         context.showMessage("Default settings restored for this project. Review and save when ready.");
 1913:         return;
 1914:       }
 1915: 
 1916:       if (action === "reset-section" && sectionId) {
 1917:         session.form[sectionId] = clone(session.defaults[sectionId]);
 1918:         session.dirty = true;
 1919:         replacePage(context, session);
 1920:         bindFormEvents(context, session);
 1921:         context.showMessage(`${titleCase(sectionId)} settings reset to defaults.`);
 1922:         return;
 1923:       }
 1924: 
 1925:       if (action === "focus-section" && sectionId) {
 1926:         const target = context.$(`settings-section-${sectionId}`) || context.$(`settings-group-${sectionId}`);
 1927:         target?.scrollIntoView({ behavior: "smooth", block: "start" });
 1928:         context.showMessage(`Focused ${titleCase(sectionId)} settings.`);
 1929:         return;
 1930:       }
 1931: 
 1932:       if (action === "open-governance") {
 1933:         context.navigateTo("governance");
 1934:         return;
 1935:       }
 1936: 
 1937:       if (action === "review-critical") {
 1938:         const summary = buildSummary(session);
 1939:         if (summary.risks.length) {
 1940:           const firstSection = SECTION_DEFINITIONS.find((section) =>
 1941:             section.fields.some((field) => field.critical)
 1942:           );
 1943:           context.$(`settings-section-${firstSection?.id || "project"}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
```

### Backend/API calls

```js
    1: import {
    2:   fetchProjectGovernancePolicy,
    3:   fetchProjectTeam,
    4:   saveProjectTeam,
    5:   updateProjectGovernancePolicy
    6: } from "../api.js";
    7: 
    8: const sessions = new Map();
    9: 
   10: const OPERATING_MODE_OPTIONS = [
   11:   {
   12:     value: "Planning Mode",
   13:     label: "Planning Mode",
   14:     description: "Recommend, prioritize, and prepare work without taking action."
   15:   },
   16:   {
   17:     value: "Guided Execution",
   18:     label: "Guided Execution",
   19:     description: "Prepare actions and prompt operators step by step."
   20:   },
   21:   {
   22:     value: "Semi-Auto",
   23:     label: "Semi-Auto",
   24:     description: "Automate low-risk work while keeping humans in the loop."
   25:   },
   26:   {
   27:     value: "Approval-First",
   28:     label: "Approval-First",
   29:     description: "Everything important queues for human review before execution."
   30:   },
   31:   {
   32:     value: "Full AI Assist",
   33:     label: "Full AI Assist",
   34:     description: "The system acts aggressively inside approved guardrails."
   35:   },
   36:   {
   37:     value: "Emergency Safe Mode",
   38:     label: "Emergency Safe Mode",
   39:     description: "Freeze automation and reduce the system to protective operations."
   40:   }
   41: ];
   42: 
   43: const AUTOMATION_RULE_OPTIONS = [
   44:   "Suggest workflows when campaign is ready",
   45:   "Block publishing when assets are missing",
   46:   "Suggest rewrite when content is weak",
   47:   "Alert when integrations fail",
   48:   "Route SEO issues into Research/Workflows",
   49:   "Route weak ads into Ads Manager"
   50: ];
   51: 
   52: const TEAM_ROLE_OPTIONS = [
   53:   "Strategist",
   54:   "Writer",
   55:   "Designer",
   56:   "Video Lead",
   57:   "Publisher",
   58:   "Ads Operator",
   59:   "Analyst",
   60:   "Compliance Reviewer",
   61:   "Admin",
   62:   "Brand owner"
   63: ];
   64: 
   65: const TEAM_ROLE_MATRIX = [
   66:   {
   67:     id: "strategist",
   68:     label: "Strategist",
   69:     service: "Planning & campaign architecture",
   70:     description: "Shapes priorities, campaign structures, and workflow sequencing."
   71:   },
   72:   {
   73:     id: "writer",
   74:     label: "Writer",
   75:     service: "Messaging & content generation",
   76:     description: "Develops copy systems, rewrites, and narrative consistency."
   77:   },
   78:   {
   79:     id: "designer",
   80:     label: "Designer",
   81:     service: "Static creative & brand expression",
   82:     description: "Owns visual quality, layout intent, and asset polish."
   83:   },
   84:   {
   85:     id: "videoLead",
   86:     label: "Video Lead",
   87:     service: "Motion creative & video delivery",
   88:     description: "Directs short-form and long-form motion output standards."
   89:   },
   90:   {
   91:     id: "publisher",
   92:     label: "Publisher",
   93:     service: "Distribution & release operations",
   94:     description: "Controls schedules, queues, and final outbound execution."
   95:   },
   96:   {
```

### Dangerous/direct actions

```js
    1: import {
    2:   fetchProjectGovernancePolicy,
    3:   fetchProjectTeam,
    4:   saveProjectTeam,
    5:   updateProjectGovernancePolicy
    6: } from "../api.js";
    7: 
    8: const sessions = new Map();
    9: 
   10: const OPERATING_MODE_OPTIONS = [
   11:   {
   12:     value: "Planning Mode",
   13:     label: "Planning Mode",
   14:     description: "Recommend, prioritize, and prepare work without taking action."
   15:   },
   16:   {
   17:     value: "Guided Execution",
   18:     label: "Guided Execution",
   19:     description: "Prepare actions and prompt operators step by step."
   20:   },
   21:   {
   22:     value: "Semi-Auto",
   23:     label: "Semi-Auto",
   24:     description: "Automate low-risk work while keeping humans in the loop."
   25:   },
   26:   {
   27:     value: "Approval-First",
   28:     label: "Approval-First",
   29:     description: "Everything important queues for human review before execution."
   30:   },
   31:   {
   32:     value: "Full AI Assist",
   33:     label: "Full AI Assist",
   34:     description: "The system acts aggressively inside approved guardrails."
   35:   },
   36:   {
   37:     value: "Emergency Safe Mode",
   38:     label: "Emergency Safe Mode",
   39:     description: "Freeze automation and reduce the system to protective operations."
   40:   }
   41: ];
   42: 
   43: const AUTOMATION_RULE_OPTIONS = [
   44:   "Suggest workflows when campaign is ready",
   45:   "Block publishing when assets are missing",
   46:   "Suggest rewrite when content is weak",
   47:   "Alert when integrations fail",
   48:   "Route SEO issues into Research/Workflows",
   49:   "Route weak ads into Ads Manager"
   50: ];
   51: 
   52: const TEAM_ROLE_OPTIONS = [
   53:   "Strategist",
   54:   "Writer",
   55:   "Designer",
   56:   "Video Lead",
   57:   "Publisher",
   58:   "Ads Operator",
   59:   "Analyst",
   60:   "Compliance Reviewer",
   61:   "Admin",
   62:   "Brand owner"
   63: ];
   64: 
   65: const TEAM_ROLE_MATRIX = [
   66:   {
   67:     id: "strategist",
   68:     label: "Strategist",
   69:     service: "Planning & campaign architecture",
   70:     description: "Shapes priorities, campaign structures, and workflow sequencing."
   71:   },
   72:   {
   73:     id: "writer",
   74:     label: "Writer",
   75:     service: "Messaging & content generation",
   76:     description: "Develops copy systems, rewrites, and narrative consistency."
   77:   },
   78:   {
   79:     id: "designer",
   80:     label: "Designer",
   81:     service: "Static creative & brand expression",
   82:     description: "Owns visual quality, layout intent, and asset polish."
   83:   },
   84:   {
   85:     id: "videoLead",
   86:     label: "Video Lead",
   87:     service: "Motion creative & video delivery",
   88:     description: "Directs short-form and long-form motion output standards."
   89:   },
   90:   {
   91:     id: "publisher",
   92:     label: "Publisher",
   93:     service: "Distribution & release operations",
   94:     description: "Controls schedules, queues, and final outbound execution."
   95:   },
   96:   {
   97:     id: "adsOperator",
   98:     label: "Ads Operator",
   99:     service: "Paid testing & optimization",
  100:     description: "Manages variants, spend tests, and escalation into Ads Manager."
  101:   },
  102:   {
  103:     id: "analyst",
  104:     label: "Analyst",
  105:     service: "Measurement & performance review",
  106:     description: "Reads signals, monitors readiness, and flags weak performance."
  107:   },
  108:   {
  109:     id: "complianceReviewer",
  110:     label: "Compliance Reviewer",
  111:     service: "Safety & policy review",
  112:     description: "Checks claims, legal risk, and policy-sensitive output."
  113:   },
  114:   {
  115:     id: "admin",
  116:     label: "Admin",
  117:     service: "System control & escalation ownership",
  118:     description: "Owns defaults, integrations, emergency controls, and final overrides."
  119:   }
  120: ];
  121: 
  122: const SECTION_DEFINITIONS = [
  123:   {
  124:     id: "project",
```

### Event handlers

```js
 1754:   `;
 1755: }
 1756: 
 1757: function renderActions(session, escapeHtml) {
 1758:   const dirtyText = session.dirty ? "Unsaved changes" : "All changes captured";
 1759: 
 1760:   return `
 1761:     <section class="settings-actions panel std-action-panel mhos-clean-surface">
 1762:       <div class="panel-header">
 1763:         <div class="settings-actions-copy">
 1764:           <div class="panel-kicker">Settings actions</div>
 1765:           <h3>Execute safe configuration updates</h3>
 1766:           <p>${escapeHtml(dirtyText)}. Saving writes this configuration into durable team and governance records used across the operating system.</p>
 1767:         </div>
 1768:       </div>
 1769:       <div class="simple-banner">
 1770:         <strong>Safe execution path:</strong> Review readiness and blockers, update the required section, save once, then validate Governance impact.
 1771:       </div>
 1772:       <div class="settings-actions-buttons std-action-row">
 1773:         <button class="btn btn-primary" type="button" data-settings-action="save-all">Save Settings</button>
 1774:         <button class="btn btn-secondary" type="button" data-settings-action="review-critical">Review Critical Settings</button>
 1775:         <button class="btn btn-secondary" type="button" data-settings-action="restore-defaults">Restore Defaults</button>
 1776:       </div>
 1777:       <div class="settings-actions-buttons std-action-row">
 1778:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="project">Project defaults</button>
 1779:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="team">Team permissions</button>
 1780:         <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="safety">Safety and governance</button>
 1781:       </div>
 1782:     </section>
 1783:   `;
 1784: }
 1785: 
 1786: function buildPageMarkup(session, escapeHtml) {
 1787:   const summary = buildSummary(session);
 1788: 
 1789:   return `
 1790:     <section class="page is-active" data-page="settings">
 1791:       <div class="settings-page-surface">
 1792:         <div class="settings-workspace-grid">
 1793:           <div class="settings-main-stack std-main-column mhos-clean-stack">
 1794:             ${renderSettingsOverview(summary, session, escapeHtml)}
 1795:             ${SETTINGS_GROUPS.map((group) => renderGroupedSection(group, session, escapeHtml)).join("")}
 1796:           </div>
 1797:           <aside class="settings-right-rail std-right-rail mhos-clean-stack">
 1798:             ${renderSummary(summary, session, escapeHtml)}
 1799:             ${renderActions(session, escapeHtml)}
 1800:             ${renderSettingsAssistant(session, escapeHtml)}
 1801:           </aside>
 1802:         </div>
 1803:       </div>
 1804:     </section>
 1805:   `;
 1806: }
 1807: 
 1808: function refreshSummary(root, session, escapeHtml) {
 1809:   const overviewHost = root.querySelector(".settings-overview");
 1810:   if (overviewHost) {
 1811:     overviewHost.outerHTML = renderSettingsOverview(buildSummary(session), session, escapeHtml);
 1812:   }
 1813:   const summaryHost = root.querySelector(".settings-summary");
 1814:   if (summaryHost) {
 1815:     summaryHost.outerHTML = renderSummary(buildSummary(session), session, escapeHtml);
 1816:   }
 1817:   const aiHost = root.querySelector(".settings-ai-assistant");
 1818:   if (aiHost) {
 1819:     aiHost.outerHTML = renderSettingsAssistant(session, escapeHtml);
 1820:   }
 1821: }
 1822: 
 1823: function refreshActionState(root, session) {
 1824:   const intro = root.querySelector(".settings-actions-copy p");
 1825:   if (intro) {
 1826:     intro.textContent = session.dirty
 1827:       ? "Unsaved changes are present. Saving will update the shared durable governance and team records."
 1828:       : "All changes captured. The shared durable governance and team records are in sync.";
 1829:   }
 1830: }
 1831: 
 1832: function replacePage(context, session) {
 1833:   const root = context.$("pageRoot");
 1834:   if (!root) return;
 1835: 
 1836:   root.innerHTML = buildPageMarkup(session, context.escapeHtml);
 1837: }
 1838: 
 1839: function bindSettingsActionButtons(context, session) {
 1840:   const root = context.$("pageRoot");
 1841:   if (!root) return;
 1842: 
 1843:   root.querySelectorAll("[data-settings-action]").forEach((button) => {
 1844:     button.addEventListener("click", async () => {
 1845:       const action = button.dataset.settingsAction;
 1846:       const sectionId = button.dataset.sectionId;
 1847: 
 1848:       if (action === "save-all") {
 1849:         try {
 1850:           const governancePayload = mapSettingsToGovernancePolicy(session.form);
 1851:           const teamPayload = mapSettingsToTeamPayload(session.form);
 1852: 
 1853:           const confirmed = window.confirm("Confirm settings save\n\nAction: Save team and governance settings for this project.\nRisk: These settings can affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable settings update.\n\nSelect Cancel to review the settings before saving.");
 1854:           if (!confirmed) {
 1855:             return;
 1856:           }
 1857: 
 1858:           await Promise.all([
 1859:             saveProjectTeam(session.projectName, teamPayload),
 1860:             updateProjectGovernancePolicy(session.projectName, {
 1861:               actor: "settings-page",
 1862:               ...governancePayload
 1863:             })
 1864:           ]);
 1865: 
 1866:           await context.createProjectHandoff?.(session.projectName, {
 1867:             source_page: "settings",
 1868:             destination_page: "governance",
 1869:             source_role: "admin",
 1870:             destination_role: "compliance_reviewer",
 1871:             source_service_domain: "system",
 1872:             destination_service_domain: "governance",
 1873:             linked_entity: {
 1874:               entity_type: "governance_policy",
 1875:               entity_id: "default",
 1876:               route: "governance",
 1877:               label: "Governance policy"
 1878:             },
 1879:             payload: {
 1880:               summary: "Settings updated the shared durable operating policy.",
 1881:               draft_context: {
 1882:                 projectName: session.projectName,
 1883:                 saveMode: "durable",
 1884:                 riskCount: buildSummary(session).risks.length
 1885:               }
 1886:             }
 1887:           });
 1888: 
 1889:           session.savedAt = nowIso();
 1890:           session.saveMode = "durable";
 1891:           session.governancePolicy = governancePayload;
 1892:           session.teamModel = {
 1893:             ...asObject(session.teamModel),
 1894:             ...teamPayload
 1895:           };
 1896:           session.dirty = false;
 1897:           refreshSummary(root, session, context.escapeHtml);
 1898:           refreshActionState(root, session);
 1899:           await context.reloadProjectData?.(session.projectName);
 1900:           context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
 1901:         } catch (error) {
 1902:           context.showError(error.message || "Failed to save durable settings.");
 1903:         }
 1904:         return;
 1905:       }
 1906: 
 1907:       if (action === "restore-defaults") {
 1908:         session.form = clone(session.defaults);
 1909:         session.dirty = true;
 1910:         replacePage(context, session);
 1911:         bindFormEvents(context, session);
 1912:         context.showMessage("Default settings restored for this project. Review and save when ready.");
 1913:         return;
 1914:       }
 1915: 
 1916:       if (action === "reset-section" && sectionId) {
 1917:         session.form[sectionId] = clone(session.defaults[sectionId]);
 1918:         session.dirty = true;
 1919:         replacePage(context, session);
 1920:         bindFormEvents(context, session);
 1921:         context.showMessage(`${titleCase(sectionId)} settings reset to defaults.`);
 1922:         return;
 1923:       }
 1924: 
 1925:       if (action === "focus-section" && sectionId) {
 1926:         const target = context.$(`settings-section-${sectionId}`) || context.$(`settings-group-${sectionId}`);
 1927:         target?.scrollIntoView({ behavior: "smooth", block: "start" });
 1928:         context.showMessage(`Focused ${titleCase(sectionId)} settings.`);
 1929:         return;
 1930:       }
 1931: 
 1932:       if (action === "open-governance") {
 1933:         context.navigateTo("governance");
 1934:         return;
```

### Local/session storage

```js
_No match found._
```

### Project data writes

```js
    1: import {
    2:   fetchProjectGovernancePolicy,
    3:   fetchProjectTeam,
    4:   saveProjectTeam,
    5:   updateProjectGovernancePolicy
    6: } from "../api.js";
    7: 
    8: const sessions = new Map();
    9: 
   10: const OPERATING_MODE_OPTIONS = [
   11:   {
   12:     value: "Planning Mode",
   13:     label: "Planning Mode",
   14:     description: "Recommend, prioritize, and prepare work without taking action."
   15:   },
   16:   {
   17:     value: "Guided Execution",
   18:     label: "Guided Execution",
   19:     description: "Prepare actions and prompt operators step by step."
   20:   },
   21:   {
   22:     value: "Semi-Auto",
   23:     label: "Semi-Auto",
   24:     description: "Automate low-risk work while keeping humans in the loop."
   25:   },
   26:   {
   27:     value: "Approval-First",
   28:     label: "Approval-First",
   29:     description: "Everything important queues for human review before execution."
   30:   },
   31:   {
   32:     value: "Full AI Assist",
   33:     label: "Full AI Assist",
   34:     description: "The system acts aggressively inside approved guardrails."
   35:   },
   36:   {
   37:     value: "Emergency Safe Mode",
   38:     label: "Emergency Safe Mode",
   39:     description: "Freeze automation and reduce the system to protective operations."
   40:   }
   41: ];
   42: 
   43: const AUTOMATION_RULE_OPTIONS = [
   44:   "Suggest workflows when campaign is ready",
   45:   "Block publishing when assets are missing",
   46:   "Suggest rewrite when content is weak",
   47:   "Alert when integrations fail",
   48:   "Route SEO issues into Research/Workflows",
   49:   "Route weak ads into Ads Manager"
   50: ];
   51: 
   52: const TEAM_ROLE_OPTIONS = [
   53:   "Strategist",
   54:   "Writer",
   55:   "Designer",
   56:   "Video Lead",
   57:   "Publisher",
   58:   "Ads Operator",
   59:   "Analyst",
   60:   "Compliance Reviewer",
   61:   "Admin",
   62:   "Brand owner"
   63: ];
   64: 
   65: const TEAM_ROLE_MATRIX = [
   66:   {
   67:     id: "strategist",
   68:     label: "Strategist",
   69:     service: "Planning & campaign architecture",
   70:     description: "Shapes priorities, campaign structures, and workflow sequencing."
   71:   },
   72:   {
   73:     id: "writer",
   74:     label: "Writer",
   75:     service: "Messaging & content generation",
   76:     description: "Develops copy systems, rewrites, and narrative consistency."
   77:   },
   78:   {
   79:     id: "designer",
   80:     label: "Designer",
   81:     service: "Static creative & brand expression",
   82:     description: "Owns visual quality, layout intent, and asset polish."
   83:   },
   84:   {
   85:     id: "videoLead",
   86:     label: "Video Lead",
   87:     service: "Motion creative & video delivery",
   88:     description: "Directs short-form and long-form motion output standards."
   89:   },
   90:   {
   91:     id: "publisher",
   92:     label: "Publisher",
   93:     service: "Distribution & release operations",
   94:     description: "Controls schedules, queues, and final outbound execution."
```

### Navigation / route handoff

```js
 1843:   root.querySelectorAll("[data-settings-action]").forEach((button) => {
 1844:     button.addEventListener("click", async () => {
 1845:       const action = button.dataset.settingsAction;
 1846:       const sectionId = button.dataset.sectionId;
 1847: 
 1848:       if (action === "save-all") {
 1849:         try {
 1850:           const governancePayload = mapSettingsToGovernancePolicy(session.form);
 1851:           const teamPayload = mapSettingsToTeamPayload(session.form);
 1852: 
 1853:           const confirmed = window.confirm("Confirm settings save\n\nAction: Save team and governance settings for this project.\nRisk: These settings can affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable settings update.\n\nSelect Cancel to review the settings before saving.");
 1854:           if (!confirmed) {
 1855:             return;
 1856:           }
 1857: 
 1858:           await Promise.all([
 1859:             saveProjectTeam(session.projectName, teamPayload),
 1860:             updateProjectGovernancePolicy(session.projectName, {
 1861:               actor: "settings-page",
 1862:               ...governancePayload
 1863:             })
 1864:           ]);
 1865: 
 1866:           await context.createProjectHandoff?.(session.projectName, {
 1867:             source_page: "settings",
 1868:             destination_page: "governance",
 1869:             source_role: "admin",
 1870:             destination_role: "compliance_reviewer",
 1871:             source_service_domain: "system",
 1872:             destination_service_domain: "governance",
 1873:             linked_entity: {
 1874:               entity_type: "governance_policy",
 1875:               entity_id: "default",
 1876:               route: "governance",
 1877:               label: "Governance policy"
 1878:             },
 1879:             payload: {
 1880:               summary: "Settings updated the shared durable operating policy.",
 1881:               draft_context: {
 1882:                 projectName: session.projectName,
 1883:                 saveMode: "durable",
 1884:                 riskCount: buildSummary(session).risks.length
 1885:               }
 1886:             }
 1887:           });
 1888: 
 1889:           session.savedAt = nowIso();
 1890:           session.saveMode = "durable";
 1891:           session.governancePolicy = governancePayload;
 1892:           session.teamModel = {
 1893:             ...asObject(session.teamModel),
 1894:             ...teamPayload
 1895:           };
 1896:           session.dirty = false;
 1897:           refreshSummary(root, session, context.escapeHtml);
 1898:           refreshActionState(root, session);
 1899:           await context.reloadProjectData?.(session.projectName);
 1900:           context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
 1901:         } catch (error) {
 1902:           context.showError(error.message || "Failed to save durable settings.");
 1903:         }
 1904:         return;
 1905:       }
 1906: 
 1907:       if (action === "restore-defaults") {
 1908:         session.form = clone(session.defaults);
 1909:         session.dirty = true;
 1910:         replacePage(context, session);
 1911:         bindFormEvents(context, session);
 1912:         context.showMessage("Default settings restored for this project. Review and save when ready.");
 1913:         return;
 1914:       }
 1915: 
 1916:       if (action === "reset-section" && sectionId) {
 1917:         session.form[sectionId] = clone(session.defaults[sectionId]);
 1918:         session.dirty = true;
 1919:         replacePage(context, session);
 1920:         bindFormEvents(context, session);
 1921:         context.showMessage(`${titleCase(sectionId)} settings reset to defaults.`);
 1922:         return;
 1923:       }
 1924: 
 1925:       if (action === "focus-section" && sectionId) {
 1926:         const target = context.$(`settings-section-${sectionId}`) || context.$(`settings-group-${sectionId}`);
 1927:         target?.scrollIntoView({ behavior: "smooth", block: "start" });
 1928:         context.showMessage(`Focused ${titleCase(sectionId)} settings.`);
 1929:         return;
 1930:       }
 1931: 
 1932:       if (action === "open-governance") {
 1933:         context.navigateTo("governance");
 1934:         return;
 1935:       }
 1936: 
 1937:       if (action === "review-critical") {
 1938:         const summary = buildSummary(session);
 1939:         if (summary.risks.length) {
 1940:           const firstSection = SECTION_DEFINITIONS.find((section) =>
 1941:             section.fields.some((field) => field.critical)
 1942:           );
 1943:           context.$(`settings-section-${firstSection?.id || "project"}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
 1944:           context.showError("Critical settings still need review. The summary panel shows the current risk list.");
 1945:         } else {
 1946:           context.showMessage("Critical settings look complete. You can save this configuration whenever you’re ready.");
 1947:         }
 1948:       }
 1949:     });
 1950:   });
 1951: }
 1952: 
 1953: function bindSettingsAiButtons(context, session) {
 1954:   const root = context.$("pageRoot");
 1955:   if (!root) return;
 1956: 
 1957:   root.querySelectorAll("[data-settings-open-ai]").forEach((button) => {
 1958:     button.addEventListener("click", () => {
 1959:       context.navigateTo("ai-command");
 1960:     });
 1961:   });
 1962: 
 1963:   root.querySelectorAll("[data-settings-ai-prompt]").forEach((button) => {
 1964:     button.addEventListener("click", () => {
 1965:       const prompt = buildSettingsPrompts(session)[Number(button.dataset.settingsAiPrompt)];
 1966:       if (!prompt) return;
 1967:       const input = context.$("quickCommandInput");
 1968:       if (input) {
 1969:         input.value = prompt.prompt;
 1970:       }
 1971:       context.navigateTo("ai-command");
 1972:       context.showMessage("Settings prompt added to AI Command.");
 1973:     });
 1974:   });
 1975: }
 1976: 
 1977: function bindFormEvents(context, session) {
 1978:   const root = context.$("pageRoot");
 1979:   if (!root) return;
 1980: 
 1981:   root.querySelectorAll("[data-setting-path]").forEach((control) => {
 1982:     const eventName =
 1983:       control.tagName === "TEXTAREA" || (control.tagName === "INPUT" && !["checkbox", "radio"].includes(control.type))
 1984:         ? "input"
 1985:         : "change";
 1986: 
 1987:     control.addEventListener(eventName, () => {
 1988:       const path = control.dataset.settingPath;
 1989:       if (!path) return;
 1990: 
 1991:       if (control.type === "checkbox" && control.closest(".settings-checklist")) {
 1992:         const checkedValues = Array.from(
 1993:           root.querySelectorAll(`input[type="checkbox"][data-setting-path="${path}"]:checked`)
 1994:         ).map((item) => item.value);
 1995:         setPathValue(session.form, path, checkedValues);
 1996:       } else if (control.type === "radio") {
 1997:         if (!control.checked) return;
 1998:         setPathValue(session.form, path, control.value);
 1999:       } else if (control.type === "checkbox") {
 2000:         setPathValue(session.form, path, Boolean(control.checked));
 2001:       } else {
 2002:         setPathValue(session.form, path, control.value);
 2003:       }
 2004: 
 2005:       session.dirty = true;
 2006:       refreshSummary(root, session, context.escapeHtml);
 2007:       refreshActionState(root, session);
 2008:       bindSettingsActionButtons(context, session);
 2009:       bindSettingsAiButtons(context, session);
 2010:     });
 2011:   });
 2012: 
 2013:   bindSettingsActionButtons(context, session);
 2014:   bindSettingsAiButtons(context, session);
 2015: }
 2016: 
 2017: export const settingsRoute = {
 2018:   id: "settings",
 2019:   disableStandardLayout: true,
 2020:   meta: {
 2021:     eyebrow: "System",
 2022:     title: "Settings",
 2023:     description: "Configure project defaults, AI behavior, publishing rules, approvals, sync behavior, and governance."
```

### Copy defect candidates

```js
_No match found._
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| HTML rendering exists | Found - render safety proof may be required |
| Escape/safe rendering evidence | Found |
| Confirmation evidence | Found |
| Backend/API calls | Found or possible - focused proof required |
| Governance/policy surface | Found - authority proof required |
| Dangerous/direct action wording | Found - determine wording vs execution |
| Local/session storage | Not found |
| Project/write signals | Found - focused proof required |

## Decision Guidance
- If Settings only edits local preferences and safe UI configuration, no runtime patch is required.
- If Settings changes governance/policy/project behavior, verify backend authority and confirmation gates.
- If dangerous terms are only labels/help text, no patch is required.
- If sensitive actions can be triggered without confirmation/governance, create a minimal authority patch.
- Do not patch from T29 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
