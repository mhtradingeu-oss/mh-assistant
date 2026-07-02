# T102 — Publishing Compact Action Classification

## Status
Audit-only. No production files changed.

## Purpose
T101 was intentionally broad. T102 removes duplication and classifies only exact user-facing actions.

## Action Classification Table

| Action | Lines | Expected classification | Confirmation | Validation/guard | Backend mutation | Shared context | Auto Mode | Local storage |
|---|---:|---|---|---|---|---|---|---|
| Save publishing draft | L1560-L1573 | Local draft persistence | no | yes | no | no | no | yes |
| Queue for Manual Publishing | L1573-L1631 | Backend schedule/reschedule or local fallback | yes | yes | yes | no | no | yes |
| Queue row actions | L1631-L1722 | Review/schedule/publish/pause/retry actions | yes | yes | yes | no | no | yes |
| Approve current item | L1722-L1755 | Approval/readiness backend mutation or local fallback | yes | yes | yes | no | no | yes |
| Mark failed | L1755-L1785 | Fail status backend mutation or local fallback | yes | no | yes | no | no | yes |
| Load workflow output | L1785-L1808 | Load shared handoff into local form | no | no | no | no | no | no |
| Send publishing context to AI | L1808-L1849 | Shared AI draft/handoff context only | no | no | no | yes | no | no |
| Auto-prepare publishing plan | L1849-L1890 | Auto Mode start | yes | no | no | no | yes | no |
| Stop Auto Mode | L1890-L1898 | Auto Mode stop/state control | no | no | no | no | no | no |
| Approve automation step | L1898-L1914 | Auto Mode approval gate | yes | no | no | no | yes | no |
| Skip automation step | L1914-L1929 | Auto Mode skip gate | yes | no | no | no | yes | no |

## Preliminary Risk Result

No obvious backend/auto action without confirmation was detected by compact classification.

Continue with source excerpts and closeout if manual review confirms the same.


## Exact Source Excerpts

### Save publishing draft

Starts around: L1560

```js
 1528:       syncFormFromItem(session, getSelectedItem(queue, itemId));
 1529:       rerender();
 1530:     };
 1531:   });
 1532: 
 1533:   const form = $("publishingBuilderForm");
 1534:   if (form) {
 1535:     form.oninput = () => {
 1536:       syncSessionForm(session, form);
 1537:       if (Object.keys(session.validation).length) {
 1538:         session.validation = {};
 1539:         rerender();
 1540:       }
 1541:     };
 1542:   }
 1543: 
 1544:   const newBtn = $("publishingNewItemBtn");
 1545:   if (newBtn) {
 1546:     newBtn.onclick = () => {
 1547:       resetForm(session, state);
 1548:       showMessage?.("New publishing draft opened.");
 1549:       rerender();
 1550:     };
 1551:   }
 1552: 
 1553:   const openQueueBtn = $("publishingOpenQueueBtn");
 1554:   if (openQueueBtn) {
 1555:     openQueueBtn.onclick = () => {
 1556:       document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 1557:     };
 1558:   }
 1559: 
 1560:   const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
 1561:   saveDraftButtons.forEach((button) => {
 1562:     button.onclick = async () => {
 1563:       syncSessionForm(session, form);
 1564:       if (!validateBuilder(session, "draft")) {
 1565:         rerender();
 1566:         return;
 1567:       }
 1568:       await persistDraft();
 1569:       rerender();
 1570:     };
 1571:   });
 1572: 
 1573:   const scheduleBtn = $("publishingScheduleBtn");
 1574:   if (scheduleBtn) {
 1575:     scheduleBtn.onclick = async () => {
 1576:       syncSessionForm(session, form);
 1577:       if (!validateBuilder(session, "schedule")) {
 1578:         rerender();
 1579:         return;
 1580:       }
 1581: 
 1582:       const current = selected();
 1583:       const payload = buildSchedulePayload(session, "scheduled");
 1584:       if (!current?.localOnly && guardPublishingAssetBlockers(session, assetBlockers, showMessage, "scheduling or rescheduling")) {
 1585:         rerender();
 1586:         return;
 1587:       }
 1588:       if (current?.localOnly) {
 1589:         updateLocalDraft(projectName, current.id, {
 1590:           ...buildLocalDraftPayload(session, "scheduled"),
 1591:           id: current.id
 1592:         });
```

### Queue for Manual Publishing

Starts around: L1573

```js
 1541:     };
 1542:   }
 1543: 
 1544:   const newBtn = $("publishingNewItemBtn");
 1545:   if (newBtn) {
 1546:     newBtn.onclick = () => {
 1547:       resetForm(session, state);
 1548:       showMessage?.("New publishing draft opened.");
 1549:       rerender();
 1550:     };
 1551:   }
 1552: 
 1553:   const openQueueBtn = $("publishingOpenQueueBtn");
 1554:   if (openQueueBtn) {
 1555:     openQueueBtn.onclick = () => {
 1556:       document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 1557:     };
 1558:   }
 1559: 
 1560:   const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
 1561:   saveDraftButtons.forEach((button) => {
 1562:     button.onclick = async () => {
 1563:       syncSessionForm(session, form);
 1564:       if (!validateBuilder(session, "draft")) {
 1565:         rerender();
 1566:         return;
 1567:       }
 1568:       await persistDraft();
 1569:       rerender();
 1570:     };
 1571:   });
 1572: 
 1573:   const scheduleBtn = $("publishingScheduleBtn");
 1574:   if (scheduleBtn) {
 1575:     scheduleBtn.onclick = async () => {
 1576:       syncSessionForm(session, form);
 1577:       if (!validateBuilder(session, "schedule")) {
 1578:         rerender();
 1579:         return;
 1580:       }
 1581: 
 1582:       const current = selected();
 1583:       const payload = buildSchedulePayload(session, "scheduled");
 1584:       if (!current?.localOnly && guardPublishingAssetBlockers(session, assetBlockers, showMessage, "scheduling or rescheduling")) {
 1585:         rerender();
 1586:         return;
 1587:       }
 1588:       if (current?.localOnly) {
 1589:         updateLocalDraft(projectName, current.id, {
 1590:           ...buildLocalDraftPayload(session, "scheduled"),
 1591:           id: current.id
 1592:         });
 1593:         session.draftMessage = "Local publishing draft scheduled in this browser.";
 1594:         showMessage?.(session.draftMessage);
 1595:         rerender();
 1596:         return;
 1597:       }
 1598: 
 1599:       const confirmed = confirmPublishingBackendAction(
 1600:         current
 1601:           ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
 1602:           : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
 1603:       );
 1604:       if (!confirmed) {
 1605:         rerender();
```

### Queue row actions

Starts around: L1631

```js
 1599:       const confirmed = confirmPublishingBackendAction(
 1600:         current
 1601:           ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
 1602:           : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
 1603:       );
 1604:       if (!confirmed) {
 1605:         rerender();
 1606:         return;
 1607:       }
 1608: 
 1609:       const action = current
 1610:         ? () => reschedulePublishingItem(projectName, current.jobId, payload)
 1611:         : () => savePublishingSchedule(projectName, payload);
 1612: 
 1613:       const response = await runAndRefresh(action, {
 1614:         projectName,
 1615:         reloadProjectData,
 1616:         showMessage,
 1617:         showError,
 1618:         successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
 1619:       });
 1620: 
 1621:       if (response?.job?.job_id) {
 1622:         session.selectedId = response.job.job_id;
 1623:         session.formSourceId = response.job.job_id;
 1624:       } else if (!current) {
 1625:         saveDraftLocally("Backend schedule unavailable; draft kept locally.");
 1626:       }
 1627:       rerender();
 1628:     };
 1629:   }
 1630: 
 1631:   Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
 1632:     button.onclick = async () => {
 1633:       const itemId = button.getAttribute("data-publishing-id") || "";
 1634:       const action = button.getAttribute("data-publishing-action") || "";
 1635:       const item = getSelectedItem(queue, itemId);
 1636:       if (!item) return;
 1637: 
 1638:       session.selectedId = item.id;
 1639:       syncFormFromItem(session, item);
 1640: 
 1641:       if (action === "review") {
 1642:         rerender();
 1643:         return;
 1644:       }
 1645: 
 1646:       if (action === "schedule") {
 1647:         document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 1648:         rerender();
 1649:         return;
 1650:       }
 1651: 
 1652:       const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
 1653:       if (!validateBuilder(session, intent)) {
 1654:         rerender();
 1655:         return;
 1656:       }
 1657: 
 1658:       if (item.localOnly) {
 1659:         const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
 1660:         updateLocalDraft(projectName, item.id, { ...buildLocalDraftPayload(session, nextStatus), id: item.id });
 1661:         session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
 1662:         showMessage?.(session.draftMessage);
 1663:         rerender();
```

### Approve current item

Starts around: L1722

```js
 1690:           rerender();
 1691:           return;
 1692:         }
 1693: 
 1694:         await runAndRefresh(
 1695:           () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
 1696:           { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
 1697:         );
 1698:       }
 1699:       if (action === "retry") {
 1700:         if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
 1701:           rerender();
 1702:           return;
 1703:         }
 1704: 
 1705:         const confirmed = confirmPublishingBackendAction(
 1706:           "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
 1707:         );
 1708:         if (!confirmed) {
 1709:           rerender();
 1710:           return;
 1711:         }
 1712: 
 1713:         await runAndRefresh(
 1714:           () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
 1715:           { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
 1716:         );
 1717:       }
 1718:       rerender();
 1719:     };
 1720:   });
 1721: 
 1722:   const approveBtn = $("publishingApproveBtn");
 1723:   if (approveBtn) {
 1724:     approveBtn.onclick = async () => {
 1725:       const current = selected();
 1726:       if (!current) {
 1727:         session.validation.contentItem = "Select or save a publishing draft before approval.";
 1728:         rerender();
 1729:         return;
 1730:       }
 1731:       session.form.approvalStatus = "approved";
 1732:       if (current.localOnly) {
 1733:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
 1734:         showMessage?.("Local publishing draft approved.");
 1735:         rerender();
 1736:         return;
 1737:       }
 1738: 
 1739:       const confirmed = confirmPublishingBackendAction(
 1740:         "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
 1741:       );
 1742:       if (!confirmed) {
 1743:         rerender();
 1744:         return;
 1745:       }
 1746:       
 1747:       await runAndRefresh(
 1748:         () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1749:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
 1750:       );
 1751:       rerender();
 1752:     };
 1753:   }
 1754: 
```

### Mark failed

Starts around: L1755

```js
 1723:   if (approveBtn) {
 1724:     approveBtn.onclick = async () => {
 1725:       const current = selected();
 1726:       if (!current) {
 1727:         session.validation.contentItem = "Select or save a publishing draft before approval.";
 1728:         rerender();
 1729:         return;
 1730:       }
 1731:       session.form.approvalStatus = "approved";
 1732:       if (current.localOnly) {
 1733:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
 1734:         showMessage?.("Local publishing draft approved.");
 1735:         rerender();
 1736:         return;
 1737:       }
 1738: 
 1739:       const confirmed = confirmPublishingBackendAction(
 1740:         "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
 1741:       );
 1742:       if (!confirmed) {
 1743:         rerender();
 1744:         return;
 1745:       }
 1746:       
 1747:       await runAndRefresh(
 1748:         () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1749:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
 1750:       );
 1751:       rerender();
 1752:     };
 1753:   }
 1754: 
 1755:   const failBtn = $("publishingFailBtn");
 1756:   if (failBtn) {
 1757:     failBtn.onclick = async () => {
 1758:       const current = selected();
 1759:       if (!current) {
 1760:         session.validation.contentItem = "Select a publishing item before marking it failed.";
 1761:         rerender();
 1762:         return;
 1763:       }
 1764:       if (current.localOnly) {
 1765:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });
 1766:         showMessage?.("Local publishing draft marked failed.");
 1767:         rerender();
 1768:         return;
 1769:       }
 1770: 
 1771:       const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
 1772:       if (!confirmed) {
 1773:         rerender();
 1774:         return;
 1775:       }
 1776: 
 1777:       await runAndRefresh(
 1778:         () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1779:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
 1780:       );
 1781:       rerender();
 1782:     };
 1783:   }
 1784: 
 1785:   const loadHandoffBtn = $("publishingLoadHandoffBtn");
 1786:   if (loadHandoffBtn) {
 1787:     loadHandoffBtn.onclick = () => {
```

### Load workflow output

Starts around: L1785

```js
 1753:   }
 1754: 
 1755:   const failBtn = $("publishingFailBtn");
 1756:   if (failBtn) {
 1757:     failBtn.onclick = async () => {
 1758:       const current = selected();
 1759:       if (!current) {
 1760:         session.validation.contentItem = "Select a publishing item before marking it failed.";
 1761:         rerender();
 1762:         return;
 1763:       }
 1764:       if (current.localOnly) {
 1765:         updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });
 1766:         showMessage?.("Local publishing draft marked failed.");
 1767:         rerender();
 1768:         return;
 1769:       }
 1770: 
 1771:       const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
 1772:       if (!confirmed) {
 1773:         rerender();
 1774:         return;
 1775:       }
 1776: 
 1777:       await runAndRefresh(
 1778:         () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1779:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
 1780:       );
 1781:       rerender();
 1782:     };
 1783:   }
 1784: 
 1785:   const loadHandoffBtn = $("publishingLoadHandoffBtn");
 1786:   if (loadHandoffBtn) {
 1787:     loadHandoffBtn.onclick = () => {
 1788:       const summary = extractHandoffSummary(handoff);
 1789:       session.form = {
 1790:         ...session.form,
 1791:         project: firstText(summary.project, session.form.project, projectName),
 1792:         campaign: firstText(summary.campaign, session.form.campaign),
 1793:         channel: toKey(firstText(summary.channel, session.form.channel)),
 1794:         contentItem: firstText(summary.contentItem, summary.summary, session.form.contentItem),
 1795:         title: firstText(summary.title, session.form.title),
 1796:         notes: firstText(summary.summary, session.form.notes)
 1797:       };
 1798:       session.loadedHandoffId = summary.id;
 1799:       session.isCreatingNew = true;
 1800:       session.selectedId = "";
 1801:       session.formSourceId = "";
 1802:       session.validation = {};
 1803:       saveDraftLocally("Workflow output loaded into a local publishing draft.");
 1804:       rerender();
 1805:     };
 1806:   }
 1807: 
 1808:   const pushAiBtn = $("publishingPushAiBtn");
 1809:   if (pushAiBtn) {
 1810:     pushAiBtn.onclick = () => {
 1811:       syncSessionForm(session, form);
 1812:       const current = selected();
 1813:       const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
 1814:       const aiDraft = {
 1815:         projectName,
 1816:         modeId: "operations",
 1817:         lastCommand: prompt,
```

### Send publishing context to AI

Starts around: L1808

```js
 1776: 
 1777:       await runAndRefresh(
 1778:         () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
 1779:         { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
 1780:       );
 1781:       rerender();
 1782:     };
 1783:   }
 1784: 
 1785:   const loadHandoffBtn = $("publishingLoadHandoffBtn");
 1786:   if (loadHandoffBtn) {
 1787:     loadHandoffBtn.onclick = () => {
 1788:       const summary = extractHandoffSummary(handoff);
 1789:       session.form = {
 1790:         ...session.form,
 1791:         project: firstText(summary.project, session.form.project, projectName),
 1792:         campaign: firstText(summary.campaign, session.form.campaign),
 1793:         channel: toKey(firstText(summary.channel, session.form.channel)),
 1794:         contentItem: firstText(summary.contentItem, summary.summary, session.form.contentItem),
 1795:         title: firstText(summary.title, session.form.title),
 1796:         notes: firstText(summary.summary, session.form.notes)
 1797:       };
 1798:       session.loadedHandoffId = summary.id;
 1799:       session.isCreatingNew = true;
 1800:       session.selectedId = "";
 1801:       session.formSourceId = "";
 1802:       session.validation = {};
 1803:       saveDraftLocally("Workflow output loaded into a local publishing draft.");
 1804:       rerender();
 1805:     };
 1806:   }
 1807: 
 1808:   const pushAiBtn = $("publishingPushAiBtn");
 1809:   if (pushAiBtn) {
 1810:     pushAiBtn.onclick = () => {
 1811:       syncSessionForm(session, form);
 1812:       const current = selected();
 1813:       const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
 1814:       const aiDraft = {
 1815:         projectName,
 1816:         modeId: "operations",
 1817:         lastCommand: prompt,
 1818:         lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
 1819:         routeSuggestions: []
 1820:       };
 1821: 
 1822:       setSharedAiDraft(projectName, aiDraft);
 1823:       setSharedHandoff(projectName, "ai-command", {
 1824:         source_page: "publishing",
 1825:         destination_page: "ai-command",
 1826:         linked_entity: {
 1827:           entity_type: "publishing_job",
 1828:           entity_id: current?.jobId || session.formSourceId || ""
 1829:         },
 1830:         payload: {
 1831:           prompt,
 1832:           publishing_item_id: current?.jobId || session.formSourceId || "",
 1833:           publishing_title: current?.title || session.form.title || "",
 1834:           draft_context: aiDraft,
 1835:           selection: {
 1836:             status: current?.status || "draft",
 1837:             channel: session.form.channel || current?.channel || "",
 1838:             scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
 1839:             notes: session.form.notes
 1840:           }
```

### Auto-prepare publishing plan

Starts around: L1849

```js
 1817:         lastCommand: prompt,
 1818:         lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
 1819:         routeSuggestions: []
 1820:       };
 1821: 
 1822:       setSharedAiDraft(projectName, aiDraft);
 1823:       setSharedHandoff(projectName, "ai-command", {
 1824:         source_page: "publishing",
 1825:         destination_page: "ai-command",
 1826:         linked_entity: {
 1827:           entity_type: "publishing_job",
 1828:           entity_id: current?.jobId || session.formSourceId || ""
 1829:         },
 1830:         payload: {
 1831:           prompt,
 1832:           publishing_item_id: current?.jobId || session.formSourceId || "",
 1833:           publishing_title: current?.title || session.form.title || "",
 1834:           draft_context: aiDraft,
 1835:           selection: {
 1836:             status: current?.status || "draft",
 1837:             channel: session.form.channel || current?.channel || "",
 1838:             scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
 1839:             notes: session.form.notes
 1840:           }
 1841:         },
 1842:         status: "available"
 1843:       });
 1844:       navigateTo("ai-command");
 1845:       showMessage?.("Publishing context sent to AI Command.");
 1846:     };
 1847:   }
 1848: 
 1849:   const autoPrepareBtn = $("publishingAutoPrepareBtn");
 1850:   if (autoPrepareBtn) {
 1851:     autoPrepareBtn.onclick = async () => {
 1852:       const plan = buildPublishingAutoModePlan(session);
 1853:       if (!plan.length) {
 1854:         publishingAutomationState.progress = "";
 1855:         publishingAutomationState.result = "No safe publishing preparation steps available.";
 1856:         rerender();
 1857:         return;
 1858:       }
 1859: 
 1860:       publishingAutomationState.result = "";
 1861:       publishingAutomationState.progress = `Step 0 / ${plan.length}`;
 1862:       publishingAutomationEnabled = true;
 1863:       ensurePublishingAutoModeBinding(getState, navigateTo, render);
 1864:       rerender();
 1865:       const confirmed = window.confirm(
 1866:         "Confirm Publishing Auto Mode start\n\n" +
 1867:           "Action: Start guided publishing Auto Mode for the current publishing package.\n" +
 1868:           "Risk: This may prepare publishing drafts and handoffs, but must not publish externally or approve Governance decisions without explicit approval.\n\n" +
 1869:           "Select Cancel to stop."
 1870:       );
 1871:       if (!confirmed) return;
 1872: 
 1873:       const runResult = await startAutoMode(plan, {
 1874:         mode: "auto_until_approval",
 1875:         context: { getState, navigateTo, projectName },
 1876:         onProgress: ({ index, total, step, result }) => {
 1877:         publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
 1878:         schedulePublishingRender(render);
 1879:         }
 1880:       });
 1881: 
```

### Stop Auto Mode

Starts around: L1890

```js
 1858:       }
 1859: 
 1860:       publishingAutomationState.result = "";
 1861:       publishingAutomationState.progress = `Step 0 / ${plan.length}`;
 1862:       publishingAutomationEnabled = true;
 1863:       ensurePublishingAutoModeBinding(getState, navigateTo, render);
 1864:       rerender();
 1865:       const confirmed = window.confirm(
 1866:         "Confirm Publishing Auto Mode start\n\n" +
 1867:           "Action: Start guided publishing Auto Mode for the current publishing package.\n" +
 1868:           "Risk: This may prepare publishing drafts and handoffs, but must not publish externally or approve Governance decisions without explicit approval.\n\n" +
 1869:           "Select Cancel to stop."
 1870:       );
 1871:       if (!confirmed) return;
 1872: 
 1873:       const runResult = await startAutoMode(plan, {
 1874:         mode: "auto_until_approval",
 1875:         context: { getState, navigateTo, projectName },
 1876:         onProgress: ({ index, total, step, result }) => {
 1877:         publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
 1878:         schedulePublishingRender(render);
 1879:         }
 1880:       });
 1881: 
 1882:       publishingAutomationState.result = runResult.status === "success"
 1883:         ? "Auto Prepare Publishing completed."
 1884:         : "Auto Prepare Publishing stopped before completion.";
 1885:       showMessage?.(publishingAutomationState.result);
 1886:       rerender();
 1887:     };
 1888:   }
 1889: 
 1890:   const autoStopBtn = $("publishingAutoStopBtn");
 1891:   if (autoStopBtn) {
 1892:     autoStopBtn.onclick = () => {
 1893:       stopAutoMode();
 1894:       showMessage?.("Auto Mode stopped.");
 1895:     };
 1896:   }
 1897: 
 1898:   const autoApproveBtn = $("publishingAutoApproveBtn");
 1899:   if (autoApproveBtn) {
 1900:     autoApproveBtn.onclick = async () => {
 1901:       const confirmed = window.confirm(
 1902:         "Confirm publishing gate approval\n\n" +
 1903:           "Action: Approve the current publishing automation gate.\n" +
 1904:           "Risk: This advances the guided publishing state, but does not replace Governance approval for protected actions.\n\n" +
 1905:           "Select Cancel to keep the gate pending."
 1906:       );
 1907:       if (!confirmed) return;
 1908: 
 1909:       await approveCurrentGate({ context: { getState, navigateTo, projectName } });
 1910:       showMessage?.("Approval gate accepted.");
 1911:     };
 1912:   }
 1913: 
 1914:   const autoSkipBtn = $("publishingAutoSkipBtn");
 1915:   if (autoSkipBtn) {
 1916:     autoSkipBtn.onclick = async () => {
 1917:       const confirmed = window.confirm(
 1918:         "Confirm publishing step skip\n\n" +
 1919:           "Action: Skip the current guided publishing step.\n" +
 1920:           "Risk: Skipping may leave a publishing preparation step incomplete and should be used only when intentionally bypassing it.\n\n" +
 1921:           "Select Cancel to keep the current step active."
 1922:       );
```

### Approve automation step

Starts around: L1898

```js
 1866:         "Confirm Publishing Auto Mode start\n\n" +
 1867:           "Action: Start guided publishing Auto Mode for the current publishing package.\n" +
 1868:           "Risk: This may prepare publishing drafts and handoffs, but must not publish externally or approve Governance decisions without explicit approval.\n\n" +
 1869:           "Select Cancel to stop."
 1870:       );
 1871:       if (!confirmed) return;
 1872: 
 1873:       const runResult = await startAutoMode(plan, {
 1874:         mode: "auto_until_approval",
 1875:         context: { getState, navigateTo, projectName },
 1876:         onProgress: ({ index, total, step, result }) => {
 1877:         publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
 1878:         schedulePublishingRender(render);
 1879:         }
 1880:       });
 1881: 
 1882:       publishingAutomationState.result = runResult.status === "success"
 1883:         ? "Auto Prepare Publishing completed."
 1884:         : "Auto Prepare Publishing stopped before completion.";
 1885:       showMessage?.(publishingAutomationState.result);
 1886:       rerender();
 1887:     };
 1888:   }
 1889: 
 1890:   const autoStopBtn = $("publishingAutoStopBtn");
 1891:   if (autoStopBtn) {
 1892:     autoStopBtn.onclick = () => {
 1893:       stopAutoMode();
 1894:       showMessage?.("Auto Mode stopped.");
 1895:     };
 1896:   }
 1897: 
 1898:   const autoApproveBtn = $("publishingAutoApproveBtn");
 1899:   if (autoApproveBtn) {
 1900:     autoApproveBtn.onclick = async () => {
 1901:       const confirmed = window.confirm(
 1902:         "Confirm publishing gate approval\n\n" +
 1903:           "Action: Approve the current publishing automation gate.\n" +
 1904:           "Risk: This advances the guided publishing state, but does not replace Governance approval for protected actions.\n\n" +
 1905:           "Select Cancel to keep the gate pending."
 1906:       );
 1907:       if (!confirmed) return;
 1908: 
 1909:       await approveCurrentGate({ context: { getState, navigateTo, projectName } });
 1910:       showMessage?.("Approval gate accepted.");
 1911:     };
 1912:   }
 1913: 
 1914:   const autoSkipBtn = $("publishingAutoSkipBtn");
 1915:   if (autoSkipBtn) {
 1916:     autoSkipBtn.onclick = async () => {
 1917:       const confirmed = window.confirm(
 1918:         "Confirm publishing step skip\n\n" +
 1919:           "Action: Skip the current guided publishing step.\n" +
 1920:           "Risk: Skipping may leave a publishing preparation step incomplete and should be used only when intentionally bypassing it.\n\n" +
 1921:           "Select Cancel to keep the current step active."
 1922:       );
 1923:       if (!confirmed) return;
 1924: 
 1925:       await skipCurrentStep({ context: { getState, navigateTo, projectName } });
 1926:       showMessage?.("Gated step skipped.");
 1927:     };
 1928:   }
 1929: }
 1930: 
```

### Skip automation step

Starts around: L1914

```js
 1882:       publishingAutomationState.result = runResult.status === "success"
 1883:         ? "Auto Prepare Publishing completed."
 1884:         : "Auto Prepare Publishing stopped before completion.";
 1885:       showMessage?.(publishingAutomationState.result);
 1886:       rerender();
 1887:     };
 1888:   }
 1889: 
 1890:   const autoStopBtn = $("publishingAutoStopBtn");
 1891:   if (autoStopBtn) {
 1892:     autoStopBtn.onclick = () => {
 1893:       stopAutoMode();
 1894:       showMessage?.("Auto Mode stopped.");
 1895:     };
 1896:   }
 1897: 
 1898:   const autoApproveBtn = $("publishingAutoApproveBtn");
 1899:   if (autoApproveBtn) {
 1900:     autoApproveBtn.onclick = async () => {
 1901:       const confirmed = window.confirm(
 1902:         "Confirm publishing gate approval\n\n" +
 1903:           "Action: Approve the current publishing automation gate.\n" +
 1904:           "Risk: This advances the guided publishing state, but does not replace Governance approval for protected actions.\n\n" +
 1905:           "Select Cancel to keep the gate pending."
 1906:       );
 1907:       if (!confirmed) return;
 1908: 
 1909:       await approveCurrentGate({ context: { getState, navigateTo, projectName } });
 1910:       showMessage?.("Approval gate accepted.");
 1911:     };
 1912:   }
 1913: 
 1914:   const autoSkipBtn = $("publishingAutoSkipBtn");
 1915:   if (autoSkipBtn) {
 1916:     autoSkipBtn.onclick = async () => {
 1917:       const confirmed = window.confirm(
 1918:         "Confirm publishing step skip\n\n" +
 1919:           "Action: Skip the current guided publishing step.\n" +
 1920:           "Risk: Skipping may leave a publishing preparation step incomplete and should be used only when intentionally bypassing it.\n\n" +
 1921:           "Select Cancel to keep the current step active."
 1922:       );
 1923:       if (!confirmed) return;
 1924: 
 1925:       await skipCurrentStep({ context: { getState, navigateTo, projectName } });
 1926:       showMessage?.("Gated step skipped.");
 1927:     };
 1928:   }
 1929: }
 1930: 
 1931: export const publishingRoute = {
 1932:   id: "publishing",
 1933:   disableStandardLayout: true,
 1934:   meta: {
 1935:     eyebrow: "Execute & Grow",
 1936:     title: "Publishing",
 1937:     description: "Review, prepare, queue, and record manual publishing status with clear previews and backend-controlled actions."
 1938:   },
 1939:   template: `
 1940:     <section class="page is-active" data-page="publishing">
 1941:       <div id="publishingRoot"></div>
 1942:     </section>
 1943:   `,
 1944:   render({
 1945:     getState,
 1946:     $,
```

## Decision Rule
- If backend schedule/publish/approve/fail paths are confirmation-gated and validation-gated, close without patch.
- If Auto Mode start/approve/skip is confirmation-gated or backend approval-gated, close without patch.
- If any backend or Auto Mode action lacks confirmation, patch narrowly.
- Do not duplicate T100/T101 content.
- Do not redesign Publishing.
