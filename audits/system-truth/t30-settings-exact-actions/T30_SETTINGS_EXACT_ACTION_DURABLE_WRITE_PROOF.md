# T30 — Settings Exact Action + Durable Write Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/settings.js

## Purpose
T29 showed Settings can write durable team/governance records. T30 verifies exact action handling:
- save-all
- restore-defaults
- review-critical
- open-governance
- focus-section
- durable write confirmation
- backend authority use
- whether any patch is required

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| Imported durable APIs | 2 | 8 |
| Action binding | 1615 | 19 |
| save-all branch | 1773 | 2 |
| save confirmation | 1853 | 1 |
| governance payload mapping | 758 | 4 |
| team payload mapping | 738 | 4 |
| durable write calls | 4 | 6 |
| handoff after save | 1866 | 3 |
| reload after save | 1899 | 1 |
| restore defaults branch | 1775 | 2 |
| review critical branch | 1774 | 2 |
| open governance branch | 1932 | 2 |
| focus section branch | 1925 | 3 |
| error handling | 1115 | 4 |
| direct dangerous external calls | n/a | 0 |


## Exact Action Block

```js
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
```

## Focused Evidence Zones

### Imported durable APIs

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
```

### Action binding

```js
 1530:             <div class="settings-group-head">
 1531:               <div>
 1532:                 <h4>${escapeHtml(section.title)}</h4>
 1533:                 <p>${escapeHtml(section.description)}</p>
 1534:               </div>
 1535:               <span class="settings-badge">${escapeHtml(section.backendLabel)}</span>
 1536:             </div>
 1537:             <div class="settings-fields-grid">
 1538:               ${section.fields
 1539:                 .map((field) => renderField(field, getPathValue(session.form, field.path), escapeHtml))
 1540:                 .join("")}
 1541:             </div>
 1542:             ${renderSectionExtension(section, session, escapeHtml)}
 1543:           </div>
 1544:         `).join("")}
 1545:       </div>
 1546:     </article>
 1547:   `;
 1548: }
 1549: 
 1550: function renderSettingsOverview(summary, session, escapeHtml) {
 1551:   const readiness = buildReadinessModel(session, summary);
 1552:   const riskItems = readiness.blockers.length
 1553:     ? readiness.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
 1554:     : `<li>No active blockers are visible from current Settings signals.</li>`;
 1555: 
 1556:   return `
 1557:     <section class="panel settings-overview std-detail-card mhos-clean-surface">
 1558:       <div class="panel-header">
 1559:         <div>
 1560:           <div class="panel-kicker">Settings operating surface</div>
 1561:           <h3>Launch configuration for ${escapeHtml(session.projectName || "this project")}</h3>
 1562:           <p class="settings-section-copy">Settings defines durable defaults for Governance, Publishing, AI, Integrations, and Operations. Backend remains the authority for enforcement.</p>
 1563:         </div>
 1564:         <span class="card-badge neutral">${escapeHtml(session.saveMode === "durable" ? "Durable backbone" : session.loading ? "Syncing..." : "Durable pending")}</span>
 1565:       </div>
 1566:       <div class="settings-overview-grid">
 1567:         <div class="settings-overview-item">
 1568:           <span>Project mode</span>
 1569:           <strong>${escapeHtml(summary.projectMode)}</strong>
 1570:         </div>
 1571:         <div class="settings-overview-item">
 1572:           <span>AI mode</span>
 1573:           <strong>${escapeHtml(summary.aiMode)}</strong>
 1574:         </div>
 1575:         <div class="settings-overview-item">
 1576:           <span>Approval mode</span>
 1577:           <strong>${escapeHtml(summary.approvalMode)}</strong>
 1578:         </div>
 1579:         <div class="settings-overview-item">
 1580:           <span>Publishing mode</span>
 1581:           <strong>${escapeHtml(summary.publishingMode)}</strong>
 1582:         </div>
 1583:         <div class="settings-overview-item">
 1584:           <span>Sync mode</span>
 1585:           <strong>${escapeHtml(summary.syncMode)}</strong>
 1586:         </div>
 1587:         <div class="settings-overview-item">
 1588:           <span>Save status</span>
 1589:           <strong>${escapeHtml(formatRelativeTime(session.savedAt))}</strong>
 1590:         </div>
 1591:       </div>
 1592: 
 1593:       <div class="settings-risk-panel">
 1594:         <div class="settings-risk-head">
 1595:           <h4>Readiness and blockers</h4>
 1596:           <span class="card-badge ${readiness.blockerCount ? "danger" : "success"}">
 1597:             ${escapeHtml(`${readiness.readyCount}/${readiness.checks.length} ready`)}
 1598:           </span>
 1599:         </div>
 1600:         <div class="governance-rule-list">
 1601:           ${readiness.checks.map((item) => `
 1602:             <div class="governance-rule-item">
 1603:               <strong>${escapeHtml(item.label)}</strong>
 1604:               <span>${escapeHtml(item.ready ? "Ready" : "Needs review")}</span>
 1605:             </div>
 1606:           `).join("")}
 1607:         </div>
 1608:         <ul class="simple-list settings-risk-list">${riskItems}</ul>
 1609:       </div>
 1610: 
 1611:       <div class="governance-policy-block">
 1612:         <h4>Next best action</h4>
 1613:         <p class="governance-copy">${escapeHtml(readiness.nextBestAction)}</p>
 1614:         <div class="settings-actions-buttons std-action-row">
 1615:           <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="approval">Review approvals</button>
 1616:           <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="publishing">Review publishing</button>
 1617:           <button class="btn btn-secondary" type="button" data-settings-open-ai>Ask AI for guidance</button>
 1618:         </div>
 1619:       </div>
 1620:     </section>
 1621:   `;
 1622: }
 1623: 
 1624: function renderSettingsAssistant(session, escapeHtml) {
 1625:   const prompts = buildSettingsPrompts(session);
 1626:   return `
 1627:     <section class="panel settings-ai-assistant std-ai-panel mhos-clean-surface">
 1628:       <div class="panel-header">
 1629:         <div>
 1630:           <div class="panel-kicker">Settings AI assistant</div>
 1631:           <h3>Analyze configuration, then execute in controlled paths</h3>
 1632:           <p class="settings-section-copy">AI provides context and recommendations. Durable changes happen only through explicit Settings and Governance actions.</p>
 1633:         </div>
 1634:       </div>
 1635:       <div class="simple-banner">
 1636:         <strong>AI context scope:</strong> configuration readiness, approval ownership, publishing safety, AI posture, and operations routing.
 1637:       </div>
 1638:       <div class="settings-toolbar">
 1639:         <button class="btn btn-secondary" type="button" data-settings-open-ai>Open AI: Review in AI Workspace</button>
 1640:       </div>
 1641:       <div class="quick-actions std-quick-actions">
 1642:         ${prompts.map((item, index) => `
 1643:           <button class="quick-action-btn" type="button" data-settings-ai-prompt="${index}">
 1644:             <span class="home-action-title">${escapeHtml(item.label)}</span>
 1645:             <span class="home-action-meta">${escapeHtml(item.preview)}</span>
 1646:           </button>
 1647:         `).join("")}
 1648:       </div>
 1649:     </section>
 1650:   `;
 1651: }
 1652: 
 1653: function renderSection(section, session, escapeHtml) {
 1654:   return `
 1655:     <article class="settings-section panel" id="settings-section-${section.id}">
 1656:       <div class="panel-header settings-section-header">
 1657:         <div>
 1658:           <div class="panel-kicker">Operational ${escapeHtml(section.id)}</div>
 1659:           <h3>${escapeHtml(section.title)}</h3>
 1660:           <p>${escapeHtml(section.description)}</p>
 1661:         </div>
 1662:         <div class="settings-section-meta">
 1663:           <span class="settings-badge">${escapeHtml(section.backendLabel)}</span>
 1664:           <button class="btn btn-secondary" type="button" data-settings-action="reset-section" data-section-id="${escapeHtml(section.id)}">
 1665:             Reset Section
 1666:           </button>
 1667:         </div>
 1668:       </div>
 1669:       <div class="settings-fields-grid">
 1670:         ${section.fields
 1671:           .map((field) => renderField(field, getPathValue(session.form, field.path), escapeHtml))
 1672:           .join("")}
 1673:       </div>
 1674:       ${renderSectionExtension(section, session, escapeHtml)}
 1675:     </article>
 1676:   `;
 1677: }
 1678: 
 1679: function renderSummary(summary, session, escapeHtml) {
 1680:   const relationships = [
 1681:     {
 1682:       title: "Governance",
 1683:       detail: "Approval ownership, policy rules, and settings bridge state are written into the durable governance policy."
 1684:     },
 1685:     {
 1686:       title: "Publishing",
 1687:       detail: "Channel defaults, scheduling behavior, and approval-before-publish shape outbound execution safety."
 1688:     },
 1689:     {
 1690:       title: "AI",
 1691:       detail: "Tone, strictness, claim safety, and approval-required mode define AI operating boundaries."
 1692:     },
 1693:     {
 1694:       title: "Integrations and operations",
 1695:       detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
 1696:     }
 1697:   ];
 1698: 
 1699:   return `
 1700:     <aside class="settings-summary panel std-detail-card mhos-clean-surface">
```

### save-all branch

```js
 1688:     },
 1689:     {
 1690:       title: "AI",
 1691:       detail: "Tone, strictness, claim safety, and approval-required mode define AI operating boundaries."
 1692:     },
 1693:     {
 1694:       title: "Integrations and operations",
 1695:       detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
 1696:     }
 1697:   ];
 1698: 
 1699:   return `
 1700:     <aside class="settings-summary panel std-detail-card mhos-clean-surface">
 1701:       <div class="panel-header">
 1702:         <div>
 1703:           <div class="panel-kicker">Cross-page operating impact</div>
 1704:           <h3>How Settings drives other operating surfaces</h3>
 1705:           <p>Use this map to understand where configuration choices influence runtime behavior across MH-OS.</p>
 1706:         </div>
 1707:       </div>
 1708: 
 1709:       <div class="governance-rule-list">
 1710:         ${relationships.map((item) => `
 1711:           <div class="governance-rule-item">
 1712:             <strong>${escapeHtml(item.title)}</strong>
 1713:             <span>${escapeHtml(item.detail)}</span>
 1714:           </div>
 1715:         `).join("")}
 1716:       </div>
 1717: 
 1718:       <div class="settings-summary-grid">
 1719:         <div class="data-card">
 1720:           <span class="data-label">Current project mode</span>
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
```

### save confirmation

```js
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
```

### governance payload mapping

```js
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
  793:       execution_mode: asString(project.defaultCampaignMode || operating.primaryMode),
  794:       action_policy: asString(operating.actionPolicy),
  795:       form: clone(form)
  796:     }
  797:   };
  798: }
  799: 
  800: function marketDefaults(market) {
  801:   const normalized = String(market || "").toLowerCase();
  802: 
  803:   if (normalized.includes("german")) {
  804:     return { currency: "EUR", timezone: "Europe/Berlin", language: "German" };
  805:   }
  806: 
  807:   if (normalized.includes("united states")) {
  808:     return { currency: "USD", timezone: "America/New_York", language: "English" };
  809:   }
  810: 
  811:   if (normalized.includes("united kingdom")) {
  812:     return { currency: "GBP", timezone: "Europe/London", language: "English" };
  813:   }
  814: 
  815:   if (normalized.includes("uae")) {
  816:     return { currency: "AED", timezone: "Asia/Dubai", language: "Arabic" };
  817:   }
  818: 
  819:   return { currency: "EUR", timezone: "UTC", language: "English" };
  820: }
  821: 
  822: function normalizeLanguage(value, fallback = "English") {
  823:   const normalized = String(value || "").trim().toLowerCase();
  824: 
  825:   if (normalized === "de" || normalized === "german") return "German";
  826:   if (normalized === "en" || normalized === "english") return "English";
  827:   if (normalized === "ar" || normalized === "arabic") return "Arabic";
  828:   if (normalized === "fr" || normalized === "french") return "French";
  829: 
  830:   return fallback;
  831: }
  832: 
  833: function normalizeMode(value) {
  834:   const normalized = String(value || "").trim().toLowerCase();
  835: 
  836:   if (normalized === "planning" || normalized === "planning mode") return "Planning Mode";
  837:   if (normalized === "guided" || normalized === "guided execution") return "Guided Execution";
  838:   if (normalized === "semi_auto" || normalized === "semi auto" || normalized === "semi-auto") return "Semi-Auto";
  839:   if (normalized === "approval_first" || normalized === "approval first" || normalized === "approval-first") return "Approval-First";
  840:   if (normalized === "full_auto" || normalized === "full auto" || normalized === "full-auto" || normalized === "full ai assist") return "Full AI Assist";
  841:   if (normalized === "emergency safe mode" || normalized === "safe mode") return "Emergency Safe Mode";
  842: 
  843:   return "Semi-Auto";
```

### team payload mapping

```js
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
  793:       execution_mode: asString(project.defaultCampaignMode || operating.primaryMode),
  794:       action_policy: asString(operating.actionPolicy),
  795:       form: clone(form)
  796:     }
  797:   };
  798: }
  799: 
  800: function marketDefaults(market) {
  801:   const normalized = String(market || "").toLowerCase();
  802: 
  803:   if (normalized.includes("german")) {
  804:     return { currency: "EUR", timezone: "Europe/Berlin", language: "German" };
  805:   }
  806: 
  807:   if (normalized.includes("united states")) {
  808:     return { currency: "USD", timezone: "America/New_York", language: "English" };
  809:   }
  810: 
  811:   if (normalized.includes("united kingdom")) {
  812:     return { currency: "GBP", timezone: "Europe/London", language: "English" };
  813:   }
  814: 
  815:   if (normalized.includes("uae")) {
  816:     return { currency: "AED", timezone: "Asia/Dubai", language: "Arabic" };
  817:   }
  818: 
  819:   return { currency: "EUR", timezone: "UTC", language: "English" };
  820: }
  821: 
  822: function normalizeLanguage(value, fallback = "English") {
  823:   const normalized = String(value || "").trim().toLowerCase();
```

### durable write calls

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
```

### handoff after save

```js
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
 1944:           context.showError("Critical settings still need review. The summary panel shows the current risk list.");
 1945:         } else {
 1946:           context.showMessage("Critical settings look complete. You can save this configuration whenever you’re ready.");
 1947:         }
 1948:       }
 1949:     });
 1950:   });
 1951: }
```

### reload after save

```js
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
```

### restore defaults branch

```js
 1690:       title: "AI",
 1691:       detail: "Tone, strictness, claim safety, and approval-required mode define AI operating boundaries."
 1692:     },
 1693:     {
 1694:       title: "Integrations and operations",
 1695:       detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
 1696:     }
 1697:   ];
 1698: 
 1699:   return `
 1700:     <aside class="settings-summary panel std-detail-card mhos-clean-surface">
 1701:       <div class="panel-header">
 1702:         <div>
 1703:           <div class="panel-kicker">Cross-page operating impact</div>
 1704:           <h3>How Settings drives other operating surfaces</h3>
 1705:           <p>Use this map to understand where configuration choices influence runtime behavior across MH-OS.</p>
 1706:         </div>
 1707:       </div>
 1708: 
 1709:       <div class="governance-rule-list">
 1710:         ${relationships.map((item) => `
 1711:           <div class="governance-rule-item">
 1712:             <strong>${escapeHtml(item.title)}</strong>
 1713:             <span>${escapeHtml(item.detail)}</span>
 1714:           </div>
 1715:         `).join("")}
 1716:       </div>
 1717: 
 1718:       <div class="settings-summary-grid">
 1719:         <div class="data-card">
 1720:           <span class="data-label">Current project mode</span>
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
```

### review critical branch

```js
 1689:     {
 1690:       title: "AI",
 1691:       detail: "Tone, strictness, claim safety, and approval-required mode define AI operating boundaries."
 1692:     },
 1693:     {
 1694:       title: "Integrations and operations",
 1695:       detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
 1696:     }
 1697:   ];
 1698: 
 1699:   return `
 1700:     <aside class="settings-summary panel std-detail-card mhos-clean-surface">
 1701:       <div class="panel-header">
 1702:         <div>
 1703:           <div class="panel-kicker">Cross-page operating impact</div>
 1704:           <h3>How Settings drives other operating surfaces</h3>
 1705:           <p>Use this map to understand where configuration choices influence runtime behavior across MH-OS.</p>
 1706:         </div>
 1707:       </div>
 1708: 
 1709:       <div class="governance-rule-list">
 1710:         ${relationships.map((item) => `
 1711:           <div class="governance-rule-item">
 1712:             <strong>${escapeHtml(item.title)}</strong>
 1713:             <span>${escapeHtml(item.detail)}</span>
 1714:           </div>
 1715:         `).join("")}
 1716:       </div>
 1717: 
 1718:       <div class="settings-summary-grid">
 1719:         <div class="data-card">
 1720:           <span class="data-label">Current project mode</span>
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
```

### open governance branch

```js
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
```

### focus section branch

```js
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
```

### error handling

```js
 1030:       frequency: "Every 6 hours",
 1031:       importHistoryPreference: "Last 90 days",
 1032:       retryFailedBehavior: "Retry twice then alert",
 1033:       healthCheckFrequency: "Hourly",
 1034:       refreshDefaults: "Refresh integrations before daily review, before launch, and after connector failures."
 1035:     },
 1036:     alerts: {
 1037:       enabledRules: [
 1038:         "Sync failure alerts",
 1039:         "Approval pending alerts",
 1040:         "Provider disconnect alerts",
 1041:         "Claim safety alerts"
 1042:       ],
 1043:       deliveryMode: "In-app + email",
 1044:       alertCadence: "Immediate only",
 1045:       notificationNotes: "Escalate provider disconnects and claim safety alerts immediately; batch lower-risk completions."
 1046:     },
 1047:     safety: {
 1048:       aiClaimCheck: true,
 1049:       productTruthRules: "Never invent benefits, ingredients, certifications, packaging, or before-and-after outcomes.",
 1050:       prohibitedOutputs: "No fake testimonials, fake claims, altered packaging, counterfeit logos, or unsupported medical positioning.",
 1051:       complianceAlerts: "Alert on regulated claims, platform policy conflicts, and high-risk launch copy.",
 1052:       brandProtectionRules: "Use approved brand tone and assets only. Preserve premium visual quality and real product visibility.",
 1053:       legalNotes: "Human review is mandatory for efficacy, comparative, or market-regulated claims."
 1054:     }
 1055:   };
 1056: }
 1057: 
 1058: function ensureSession(state) {
 1059:   const projectName = state?.context?.currentProject || "default";
 1060:   const defaults = buildDefaultSettings(state);
 1061:   const existing = sessions.get(projectName);
 1062: 
 1063:   if (existing) {
 1064:     existing.defaults = defaults;
 1065:     existing.projectName = projectName;
 1066:     return existing;
 1067:   }
 1068: 
 1069:   const session = {
 1070:     projectName,
 1071:     defaults,
 1072:     form: clone(defaults),
 1073:     dirty: false,
 1074:     savedAt: null,
 1075:     saveMode: "durable-pending",
 1076:     loaded: false,
 1077:     loading: false,
 1078:     error: "",
 1079:     teamModel: null,
 1080:     governancePolicy: null
 1081:   };
 1082: 
 1083:   sessions.set(projectName, session);
 1084:   return session;
 1085: }
 1086: 
 1087: async function loadDurableSettings(session, state, rerender) {
 1088:   if (!session.projectName || session.loading) return;
 1089: 
 1090:   session.loading = true;
 1091:   session.error = "";
 1092:   rerender();
 1093: 
 1094:   try {
 1095:     const [teamResult, governanceResult] = await Promise.allSettled([
 1096:       fetchProjectTeam(session.projectName),
 1097:       fetchProjectGovernancePolicy(session.projectName)
 1098:     ]);
 1099: 
 1100:     session.teamModel = teamResult.status === "fulfilled" ? asObject(teamResult.value?.team || teamResult.value) : null;
 1101:     session.governancePolicy = governanceResult.status === "fulfilled" ? asObject(governanceResult.value?.policy || governanceResult.value) : null;
 1102: 
 1103:     const durableSnapshot = extractDurableSettingsSnapshot(session.governancePolicy, session.teamModel);
 1104:     if (durableSnapshot && !session.dirty) {
 1105:       session.form = mergeSettings(buildDefaultSettings(state), durableSnapshot);
 1106:       session.savedAt =
 1107:         session.governancePolicy?.updated_at ||
 1108:         session.teamModel?.settings_status?.saved_at ||
 1109:         session.teamModel?.updated_at ||
 1110:         null;
 1111:       session.saveMode = "durable";
 1112:     }
 1113: 
 1114:     session.loaded = true;
 1115:   } catch (error) {
 1116:     session.error = error.message || "Failed to load durable settings.";
 1117:   } finally {
 1118:     session.loading = false;
 1119:     rerender();
 1120:   }
 1121: }
 1122: 
 1123: function formatRelativeTime(value) {
 1124:   if (!value) return "Not saved yet";
 1125: 
 1126:   const timestamp = typeof value === "number" ? value : Date.parse(value);
 1127:   if (!Number.isFinite(timestamp)) return "Not saved yet";
 1128: 
 1129:   const delta = Date.now() - timestamp;
 1130:   const minutes = Math.round(delta / 60000);
 1131: 
 1132:   if (minutes <= 1) return "Saved just now";
 1133:   if (minutes < 60) return `Saved ${minutes} min ago`;
 1134: 
 1135:   const hours = Math.round(minutes / 60);
 1136:   if (hours < 24) return `Saved ${hours} hr ago`;
 1137: 
 1138:   const days = Math.round(hours / 24);
 1139:   return `Saved ${days} day${days === 1 ? "" : "s"} ago`;
 1140: }
 1141: 
 1142: function buildReadinessModel(session, summary) {
 1143:   const form = session.form;
 1144:   const hasRisks = summary.risks.length > 0;
 1145:   const approvalOwnersReady = Boolean(form.approval.contentOwner && form.approval.mediaOwner && form.approval.adsOwner);
 1146:   const publishingReady = Array.isArray(form.publishing.channels) && form.publishing.channels.length > 0 && Boolean(form.publishing.approvalBeforePublish);
 1147:   const aiSafetyReady = Boolean(form.safety.aiClaimCheck) && !String(form.ai.claimSafetyMode || "").toLowerCase().includes("relaxed");
 1148:   const integrationReady = Boolean(form.sync.frequency && Array.isArray(form.alerts.enabledRules) && form.alerts.enabledRules.length);
 1149: 
 1150:   const checks = [
 1151:     {
 1152:       label: "Governance and approvals",
 1153:       ready: approvalOwnersReady,
 1154:       helper: approvalOwnersReady
 1155:         ? "Ownership is defined for content, media, and ads decisions."
 1156:         : "Assign approval owners to avoid ambiguous review authority."
 1157:     },
 1158:     {
 1159:       label: "Publishing and release safety",
 1160:       ready: publishingReady,
 1161:       helper: publishingReady
 1162:         ? "Channels are selected and approval-before-publish is active."
 1163:         : "Select channels and confirm approval-before-publish before launch."
 1164:     },
 1165:     {
 1166:       label: "AI and policy safety",
 1167:       ready: aiSafetyReady,
 1168:       helper: aiSafetyReady
 1169:         ? "Claim checks and safety posture are configured for controlled AI use."
 1170:         : "Tighten claim safety mode and enable AI claim checks."
 1171:     },
 1172:     {
 1173:       label: "Integrations and operations alerts",
 1174:       ready: integrationReady,
 1175:       helper: integrationReady
 1176:         ? "Sync cadence and alert routing are defined for operations visibility."
 1177:         : "Set sync cadence and alert coverage so operations can intervene safely."
 1178:     }
 1179:   ];
 1180: 
 1181:   const nextBestAction = hasRisks
 1182:     ? "Review the top blocker, fix it in this page, then save to sync durable governance and team records."
 1183:     : "Save this configuration, then open Governance to verify policy impact and approval readiness.";
 1184: 
 1185:   return {
 1186:     checks,
 1187:     blockers: summary.risks,
 1188:     blockerCount: summary.risks.length,
 1189:     readyCount: checks.filter((item) => item.ready).length,
 1190:     nextBestAction
 1191:   };
 1192: }
 1193: 
 1194: function collectRisks(form) {
 1195:   const risks = [];
 1196: 
 1197:   if (!form.project.projectName || !form.project.website || !form.project.businessType) {
 1198:     risks.push("Project identity is incomplete, which weakens routing, summaries, and downstream defaults.");
 1199:   }
 1200: 
```

### direct dangerous external calls

```js
_No match found._
```


## Verdict

| Area | Verdict |
|---|---|
| Save confirmation before durable writes | Verified |
| Durable write APIs present | Verified |
| Durable writes grouped | Verified |
| Governance handoff after save | Verified |
| Restore defaults branch exists | Found |
| Restore defaults writes durable data | Not found in restore branch window |
| Restore defaults confirmation | Not found |
| Open Governance route handoff | Verified |
| Dangerous external direct actions | Not found |

## Decision Guidance
- If save-all is the only durable write and it has confirmation, no runtime patch is required.
- If restore-defaults only changes local form/session and marks dirty, no runtime patch is required.
- If restore-defaults writes durable settings without confirmation, add minimal confirmation.
- If dangerous terms are only policy labels/options, no patch is required.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
