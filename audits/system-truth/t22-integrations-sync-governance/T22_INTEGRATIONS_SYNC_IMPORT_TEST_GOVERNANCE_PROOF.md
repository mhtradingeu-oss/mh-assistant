# T22B — Integrations Exact Sync / Test / Import Block Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/integrations.js

## Why T22B Exists
The first T22 report did not detect the provider action handler name, even though it found sync/test/import backend function references. T22B inspects the exact action block directly.

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| testProjectIntegration call | 1580 | 1 |
| syncProjectIntegration call | 1585 | 1 |
| importProjectIntegrationHistory call | 1590 | 1 |
| disconnectProjectIntegration call | 1544 | 1 |
| connectProjectIntegration call | 1498 | 3 |
| reconnectProjectIntegration call | 1498 | 1 |
| sync branch | 1584 | 1 |
| test branch | 1567 | 2 |
| import branch | n/a | 0 |
| governance approval required handling | 1515 | 3 |
| disconnect confirmation | 1538 | 1 |
| reload after action | 1264 | 8 |
| success messages | 1 | 41 |
| error handling | 1263 | 15 |


## Exact Action Block: persist/connect/reconnect/disconnect/sync/test/import

```js
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
 1648:     document.addEventListener("keydown", integrationDrawerEscapeHandler);
 1649:   }
 1650: }
 1651: 
 1652: export const integrationsRoute = {
 1653:   id: "integrations",
 1654:   disableStandardLayout: true,
 1655:   meta: {
 1656:     eyebrow: "Start",
 1657:     title: "Integrations",
 1658:     description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
 1659:   },
 1660:   template: `
 1661:     <section class="page is-active" data-page="integrations">
 1662:       <div id="integrationsRoot"></div>
 1663:     </section>
 1664:   `,
 1665:   render({
```

## Focused Evidence Zones

### testProjectIntegration call

```js
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
 1648:     document.addEventListener("keydown", integrationDrawerEscapeHandler);
 1649:   }
 1650: }
 1651: 
 1652: export const integrationsRoute = {
 1653:   id: "integrations",
 1654:   disableStandardLayout: true,
 1655:   meta: {
 1656:     eyebrow: "Start",
 1657:     title: "Integrations",
 1658:     description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
 1659:   },
 1660:   template: `
```

### syncProjectIntegration call

```js
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
 1648:     document.addEventListener("keydown", integrationDrawerEscapeHandler);
 1649:   }
 1650: }
 1651: 
 1652: export const integrationsRoute = {
 1653:   id: "integrations",
 1654:   disableStandardLayout: true,
 1655:   meta: {
 1656:     eyebrow: "Start",
 1657:     title: "Integrations",
 1658:     description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
 1659:   },
 1660:   template: `
 1661:     <section class="page is-active" data-page="integrations">
 1662:       <div id="integrationsRoot"></div>
 1663:     </section>
 1664:   `,
 1665:   render({
```

### importProjectIntegrationHistory call

```js
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
 1648:     document.addEventListener("keydown", integrationDrawerEscapeHandler);
 1649:   }
 1650: }
 1651: 
 1652: export const integrationsRoute = {
 1653:   id: "integrations",
 1654:   disableStandardLayout: true,
 1655:   meta: {
 1656:     eyebrow: "Start",
 1657:     title: "Integrations",
 1658:     description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
 1659:   },
 1660:   template: `
 1661:     <section class="page is-active" data-page="integrations">
 1662:       <div id="integrationsRoot"></div>
 1663:     </section>
 1664:   `,
 1665:   render({
 1666:     getState,
 1667:     $,
 1668:     escapeHtml,
 1669:     safeText,
 1670:     navigateTo,
```

### disconnectProjectIntegration call

```js
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
```

### connectProjectIntegration call

```js
 1418:     const draft = ensureDraft(session, integration.id);
 1419:     const config = {};
 1420:     const credentials = {};
 1421: 
 1422:     integration.fields.forEach((field) => {
 1423:       const resolvedValue = asString(getResolvedFieldValue(state, session, integration, field, record, getLegacySourceValue(integration, getLegacySources(state)))).trim();
 1424: 
 1425:       if (field.key === integration.primaryField) {
 1426:         return;
 1427:       }
 1428: 
 1429:       if (isSecretField(field)) {
 1430:         const draftValue = asString(draft[field.key]).trim();
 1431:         if (draftValue) {
 1432:           credentials[field.key] = draftValue;
 1433:         }
 1434:         return;
 1435:       }
 1436: 
 1437:       if (resolvedValue) {
 1438:         config[field.key] = resolvedValue;
 1439:       }
 1440:     });
 1441: 
 1442:     const primaryValue = asString(getResolvedFieldValue(
 1443:       state,
 1444:       session,
 1445:       integration,
 1446:       integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0],
 1447:       record,
 1448:       getLegacySourceValue(integration, getLegacySources(state))
 1449:     )).trim();
 1450: 
 1451:     const accessModel = getIntegrationAccessModel(integration);
 1452: 
 1453:     return {
 1454:       source_key: integration.sourceKey,
 1455:       primary_field: integration.primaryField,
 1456:       primary_value: primaryValue,
 1457:       config,
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
```

### reconnectProjectIntegration call

```js
 1418:     const draft = ensureDraft(session, integration.id);
 1419:     const config = {};
 1420:     const credentials = {};
 1421: 
 1422:     integration.fields.forEach((field) => {
 1423:       const resolvedValue = asString(getResolvedFieldValue(state, session, integration, field, record, getLegacySourceValue(integration, getLegacySources(state)))).trim();
 1424: 
 1425:       if (field.key === integration.primaryField) {
 1426:         return;
 1427:       }
 1428: 
 1429:       if (isSecretField(field)) {
 1430:         const draftValue = asString(draft[field.key]).trim();
 1431:         if (draftValue) {
 1432:           credentials[field.key] = draftValue;
 1433:         }
 1434:         return;
 1435:       }
 1436: 
 1437:       if (resolvedValue) {
 1438:         config[field.key] = resolvedValue;
 1439:       }
 1440:     });
 1441: 
 1442:     const primaryValue = asString(getResolvedFieldValue(
 1443:       state,
 1444:       session,
 1445:       integration,
 1446:       integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0],
 1447:       record,
 1448:       getLegacySourceValue(integration, getLegacySources(state))
 1449:     )).trim();
 1450: 
 1451:     const accessModel = getIntegrationAccessModel(integration);
 1452: 
 1453:     return {
 1454:       source_key: integration.sourceKey,
 1455:       primary_field: integration.primaryField,
 1456:       primary_value: primaryValue,
 1457:       config,
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
```

### sync branch

```js
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
 1648:     document.addEventListener("keydown", integrationDrawerEscapeHandler);
 1649:   }
 1650: }
 1651: 
 1652: export const integrationsRoute = {
 1653:   id: "integrations",
 1654:   disableStandardLayout: true,
 1655:   meta: {
 1656:     eyebrow: "Start",
 1657:     title: "Integrations",
 1658:     description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."
 1659:   },
 1660:   template: `
 1661:     <section class="page is-active" data-page="integrations">
 1662:       <div id="integrationsRoot"></div>
 1663:     </section>
 1664:   `,
```

### test branch

```js
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
 1619:       }
 1620: 
 1621:       await runServerAction(integrationId, action);
 1622:     };
 1623:   });
 1624: 
 1625:   Array.from(document.querySelectorAll("[data-integration-prompt]")).forEach((button) => {
 1626:     button.onclick = () => {
 1627:       const prompt = button.getAttribute("data-integration-prompt-text") || "";
 1628:       const input = $("quickCommandInput");
 1629:       if (input) {
 1630:         input.value = prompt;
 1631:       }
 1632:       navigateTo("ai-command");
 1633:       showMessage?.("Diagnostics prompt added to AI Command.");
 1634:     };
 1635:   });
 1636: 
 1637:   if (typeof document !== "undefined") {
 1638:     if (integrationDrawerEscapeHandler) {
 1639:       document.removeEventListener("keydown", integrationDrawerEscapeHandler);
 1640:     }
 1641:     integrationDrawerEscapeHandler = (event) => {
 1642:       if (event.key !== "Escape" || !session.drawerOpen) return;
 1643:       const closedIntegration = getIntegrationById(session.activeDrawerIntegrationId || session.selectedIntegrationId);
 1644:       closeIntegrationDrawer(session);
 1645:       showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
 1646:       render();
 1647:     };
```

### import branch

```js
_No match found._
```

### governance approval required handling

```js
 1435:       }
 1436: 
 1437:       if (resolvedValue) {
 1438:         config[field.key] = resolvedValue;
 1439:       }
 1440:     });
 1441: 
 1442:     const primaryValue = asString(getResolvedFieldValue(
 1443:       state,
 1444:       session,
 1445:       integration,
 1446:       integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0],
 1447:       record,
 1448:       getLegacySourceValue(integration, getLegacySources(state))
 1449:     )).trim();
 1450: 
 1451:     const accessModel = getIntegrationAccessModel(integration);
 1452: 
 1453:     return {
 1454:       source_key: integration.sourceKey,
 1455:       primary_field: integration.primaryField,
 1456:       primary_value: primaryValue,
 1457:       config,
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
```

### disconnect confirmation

```js
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
```

### reload after action

```js
 1184: 
 1185: function getHealthSummary(statusLabel, record, integration) {
 1186:   if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1187:     return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
 1188:   }
 1189: 
 1190:   if (asString(record.health_summary).trim()) {
 1191:     return asString(record.health_summary).trim();
 1192:   }
 1193: 
 1194:   if (statusLabel === "Connected") {
 1195:     return `${integration.label} is connected and ready for provider-level sync actions.`;
 1196:   }
 1197:   if (statusLabel === "Partial") {
 1198:     return "Some required connection details are still missing.";
 1199:   }
 1200:   if (statusLabel === "Token expired") {
 1201:     return "Reconnect the saved token before importing or syncing new data.";
 1202:   }
 1203:   if (statusLabel === "Error") {
 1204:     return asString(record.last_error) || "The last action failed. Review the connection inputs and try again.";
 1205:   }
 1206:   return "This integration has not been configured yet.";
 1207: }
 1208: 
 1209: function getConnectorWorkspaceAction(card) {
 1210:   const statusKey = getConnectorWorkspaceStatus(card);
 1211: 
 1212:   if (card.backendSupported === false) {
 1213:     return { label: "Open connector setup", action: "select" };
 1214:   }
 1215: 
 1216:   if (statusKey === "connected") {
 1217:     return {
 1218:       label: "Run backend sync",
 1219:       action: "sync"
 1220:     };
 1221:   }
 1222: 
 1223:   if (statusKey === "failed") {
 1224:     return {
 1225:       label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration",
 1226:       action: shouldUseReconnectAction(card) ? "reconnect" : "connect"
 1227:     };
 1228:   }
 1229: 
 1230:   if (statusKey === "needs_setup") {
 1231:     return { label: "Complete setup", action: "select" };
 1232:   }
 1233: 
 1234:   return { label: "Connect", action: "connect" };
 1235: }
 1236: 
 1237: function focusDrawerField(session, card) {
 1238:   if (!session.drawerOpen || !card || typeof window === "undefined") return;
 1239: 
 1240:   const requiredEmptyField = card.fields.find((field) =>
 1241:     field.required && card.missingRequired.includes(field.label)
 1242:   );
 1243:   const fieldKey = session.validationFieldKey || requiredEmptyField?.key || card.fields[0]?.key;
 1244:   if (!fieldKey) return;
 1245: 
 1246:   window.requestAnimationFrame(() => {
 1247:     const input = document.querySelector(`[data-integration-drawer] [data-integration-field="${card.id}"][data-field-key="${fieldKey}"]`);
 1248:     if (input instanceof HTMLElement) {
 1249:       input.scrollIntoView({ block: "center", behavior: "smooth" });
 1250:       input.focus();
 1251:       if (typeof input.select === "function" && input.tagName === "INPUT") {
 1252:         input.select();
 1253:       }
 1254:     }
 1255:   });
 1256: }
 1257: 
 1258: function bindIntegrationActions({
 1259:   getState,
 1260:   $,
 1261:   navigateTo,
 1262:   showMessage,
 1263:   showError,
 1264:   reloadProjectData,
 1265:   connectProjectIntegration,
 1266:   reconnectProjectIntegration,
 1267:   testProjectIntegration,
 1268:   syncProjectIntegration,
 1269:   importProjectIntegrationHistory,
 1270:   disconnectProjectIntegration,
 1271:   projectName,
 1272:   session,
 1273:   render
 1274: }) {
 1275:   Array.from(document.querySelectorAll("[data-integration-select]")).forEach((button) => {
 1276:     button.onclick = () => {
 1277:       const integrationId = button.getAttribute("data-integration-select") || "";
 1278:       const integration = getIntegrationById(integrationId);
 1279:       openIntegrationDrawer(session, integrationId);
 1280:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1281:       render();
 1282:     };
 1283:   });
 1284: 
 1285:   Array.from(document.querySelectorAll("[data-integration-primary]")).forEach((button) => {
 1286:     button.onclick = async () => {
 1287:       const action = button.getAttribute("data-integration-primary") || "";
 1288:       const integrationId = button.getAttribute("data-integration-id") || "";
 1289:       const integration = getIntegrationById(integrationId);
 1290:       openIntegrationDrawer(session, integrationId);
 1291:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1292: 
 1293:       if (action === "manage") {
 1294:         render();
 1295:         return;
 1296:       }
 1297: 
 1298:       if (action === "unavailable") {
 1299:         render();
 1300:         return;
 1301:       }
 1302: 
 1303:       render();
 1304:     };
 1305:   });
 1306: 
 1307:   Array.from(document.querySelectorAll("[data-integration-field]")).forEach((input) => {
 1308:     input.oninput = (event) => {
 1309:       const integrationId = input.getAttribute("data-integration-field") || "";
 1310:       const fieldKey = input.getAttribute("data-field-key") || "";
 1311:       const nextValue = event.target.value || "";
 1312:       setFieldValue(session, integrationId, fieldKey, nextValue);
 1313:       if (asString(nextValue).trim()) {
 1314:         clearIntegrationValidation(session, integrationId, fieldKey);
 1315:       }
 1316:     };
 1317:   });
 1318: 
 1319:   Array.from(document.querySelectorAll("[data-integration-field-helper]")).forEach((helper) => {
 1320:     const [integrationId, fieldKey] = asString(helper.getAttribute("data-integration-field-helper")).split(":");
 1321:     const integration = getIntegrationById(integrationId);
 1322:     const state = getState();
 1323:     const record = integration ? getServerRecord(state, integration) : {};
 1324:     const field = integration?.fields?.find((item) => item.key === fieldKey);
 1325: 
 1326:     if (!field) {
 1327:       helper.textContent = "";
 1328:       return;
 1329:     }
 1330: 
 1331:     if (isSecretField(field) && hasSavedServerCredential(record, field.key)) {
 1332:       helper.textContent = "Saved securely on server. Leave blank to keep the current secret.";
 1333:       return;
 1334:     }
 1335: 
 1336:     if (session.validationIntegrationId === integrationId && session.validationFieldKey === fieldKey && session.validationMessage) {
 1337:       helper.textContent = session.validationMessage;
 1338:       return;
 1339:     }
 1340: 
 1341:     helper.textContent = field.required
 1342:       ? "Required for a complete connection."
 1343:       : "Optional, but useful for scoping and diagnostics.";
 1344:   });
```

### success messages

```js
    1: import {
    2:   buildAISmartRecommendation,
    3:   buildConnectorWorkspaceGroups,
    4:   buildCoverageMap,
    5:   buildCriticalMissing,
    6:   buildDomainModels,
    7:   buildIntegrationActivityFeed,
    8:   buildIntegrationCardModel,
    9:   buildIntegrationOverviewSummary,
   10:   buildLaunchDiagnostics,
   11:   buildLegacyFallbackRecord,
   12:   buildRecommendations,
   13:   buildSectionGroups,
   14:   buildSuggestedValues,
   15:   CONNECTOR_WORKSPACE_CATEGORIES,
   16:   getConnectorWorkspaceStatus
   17: } from "./integrations/builders.js";
   18: 
   19: import { renderIntegrationDrawer } from "./integrations/drawer.js";
   20: 
   21: import {
   22:   renderConnectorGroup,
   23:   renderSelectedConnectorSummary
   24: } from "./integrations/cards.js";
   25: 
   26: import {
   27:   renderAISmartRecommendation as renderAISmartRecommendationModule,
   28:   renderIntegrationActivityFeed,
   29:   renderIntegrationCoverageMap,
   30:   renderIntegrationCriticalMissing,
   31:   renderIntegrationDiagnosticsList,
   32:   renderIntegrationRecommendationsList
   33: } from "./integrations/render.js";
   34: 
   35: const integrationSessions = new Map();
   36: let integrationDrawerEscapeHandler = null;
   37: const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
   38: 
   39: const INTEGRATION_DOMAINS = [
   40:   {
   41:     id: "website-commerce",
   42:     title: "Website & Commerce",
   43:     description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
   44:     integrations: [
   45:       {
   46:         id: "website",
   47:         sourceKey: "website",
   48:         label: "Website",
   49:         icon: "WE",
   50:         purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
   51:         whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
   52:         enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
   53:         dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
   54:         permissionScope: "Website endpoint or root domain access",
   55:         critical: true,
   56:         primaryField: "url",
   57:         fields: [
   58:           { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
   59:           { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
   60:           { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
   61:         ]
   62:       },
   63:       {
   64:         id: "woocommerce",
   65:         sourceKey: "ecommerce",
   66:         label: "WooCommerce",
   67:         icon: "WC",
   68:         purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
   69:         whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
   70:         enables: "Product sync, order sync, sales signals, and commerce intelligence.",
   71:         dataScope: ["Products", "Orders", "Revenue", "Conversions"],
   72:         permissionScope: "Store URL + API consumer key/secret",
   73:         critical: true,
   74:         primaryField: "storeUrl",
   75:         fields: [
   76:           { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
   77:           { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
   78:           { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
   79:         ]
   80:       },
   81:       {
```

### error handling

```js
 1183: }
 1184: 
 1185: function getHealthSummary(statusLabel, record, integration) {
 1186:   if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1187:     return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
 1188:   }
 1189: 
 1190:   if (asString(record.health_summary).trim()) {
 1191:     return asString(record.health_summary).trim();
 1192:   }
 1193: 
 1194:   if (statusLabel === "Connected") {
 1195:     return `${integration.label} is connected and ready for provider-level sync actions.`;
 1196:   }
 1197:   if (statusLabel === "Partial") {
 1198:     return "Some required connection details are still missing.";
 1199:   }
 1200:   if (statusLabel === "Token expired") {
 1201:     return "Reconnect the saved token before importing or syncing new data.";
 1202:   }
 1203:   if (statusLabel === "Error") {
 1204:     return asString(record.last_error) || "The last action failed. Review the connection inputs and try again.";
 1205:   }
 1206:   return "This integration has not been configured yet.";
 1207: }
 1208: 
 1209: function getConnectorWorkspaceAction(card) {
 1210:   const statusKey = getConnectorWorkspaceStatus(card);
 1211: 
 1212:   if (card.backendSupported === false) {
 1213:     return { label: "Open connector setup", action: "select" };
 1214:   }
 1215: 
 1216:   if (statusKey === "connected") {
 1217:     return {
 1218:       label: "Run backend sync",
 1219:       action: "sync"
 1220:     };
 1221:   }
 1222: 
 1223:   if (statusKey === "failed") {
 1224:     return {
 1225:       label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration",
 1226:       action: shouldUseReconnectAction(card) ? "reconnect" : "connect"
 1227:     };
 1228:   }
 1229: 
 1230:   if (statusKey === "needs_setup") {
 1231:     return { label: "Complete setup", action: "select" };
 1232:   }
 1233: 
 1234:   return { label: "Connect", action: "connect" };
 1235: }
 1236: 
 1237: function focusDrawerField(session, card) {
 1238:   if (!session.drawerOpen || !card || typeof window === "undefined") return;
 1239: 
 1240:   const requiredEmptyField = card.fields.find((field) =>
 1241:     field.required && card.missingRequired.includes(field.label)
 1242:   );
 1243:   const fieldKey = session.validationFieldKey || requiredEmptyField?.key || card.fields[0]?.key;
 1244:   if (!fieldKey) return;
 1245: 
 1246:   window.requestAnimationFrame(() => {
 1247:     const input = document.querySelector(`[data-integration-drawer] [data-integration-field="${card.id}"][data-field-key="${fieldKey}"]`);
 1248:     if (input instanceof HTMLElement) {
 1249:       input.scrollIntoView({ block: "center", behavior: "smooth" });
 1250:       input.focus();
 1251:       if (typeof input.select === "function" && input.tagName === "INPUT") {
 1252:         input.select();
 1253:       }
 1254:     }
 1255:   });
 1256: }
 1257: 
 1258: function bindIntegrationActions({
 1259:   getState,
 1260:   $,
 1261:   navigateTo,
 1262:   showMessage,
 1263:   showError,
 1264:   reloadProjectData,
 1265:   connectProjectIntegration,
 1266:   reconnectProjectIntegration,
 1267:   testProjectIntegration,
 1268:   syncProjectIntegration,
 1269:   importProjectIntegrationHistory,
 1270:   disconnectProjectIntegration,
 1271:   projectName,
 1272:   session,
 1273:   render
 1274: }) {
 1275:   Array.from(document.querySelectorAll("[data-integration-select]")).forEach((button) => {
 1276:     button.onclick = () => {
 1277:       const integrationId = button.getAttribute("data-integration-select") || "";
 1278:       const integration = getIntegrationById(integrationId);
 1279:       openIntegrationDrawer(session, integrationId);
 1280:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1281:       render();
 1282:     };
 1283:   });
 1284: 
 1285:   Array.from(document.querySelectorAll("[data-integration-primary]")).forEach((button) => {
 1286:     button.onclick = async () => {
 1287:       const action = button.getAttribute("data-integration-primary") || "";
 1288:       const integrationId = button.getAttribute("data-integration-id") || "";
 1289:       const integration = getIntegrationById(integrationId);
 1290:       openIntegrationDrawer(session, integrationId);
 1291:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1292: 
 1293:       if (action === "manage") {
 1294:         render();
 1295:         return;
 1296:       }
 1297: 
 1298:       if (action === "unavailable") {
 1299:         render();
 1300:         return;
 1301:       }
 1302: 
 1303:       render();
 1304:     };
 1305:   });
 1306: 
 1307:   Array.from(document.querySelectorAll("[data-integration-field]")).forEach((input) => {
 1308:     input.oninput = (event) => {
 1309:       const integrationId = input.getAttribute("data-integration-field") || "";
 1310:       const fieldKey = input.getAttribute("data-field-key") || "";
 1311:       const nextValue = event.target.value || "";
 1312:       setFieldValue(session, integrationId, fieldKey, nextValue);
 1313:       if (asString(nextValue).trim()) {
 1314:         clearIntegrationValidation(session, integrationId, fieldKey);
 1315:       }
 1316:     };
 1317:   });
 1318: 
 1319:   Array.from(document.querySelectorAll("[data-integration-field-helper]")).forEach((helper) => {
 1320:     const [integrationId, fieldKey] = asString(helper.getAttribute("data-integration-field-helper")).split(":");
 1321:     const integration = getIntegrationById(integrationId);
 1322:     const state = getState();
 1323:     const record = integration ? getServerRecord(state, integration) : {};
 1324:     const field = integration?.fields?.find((item) => item.key === fieldKey);
 1325: 
 1326:     if (!field) {
 1327:       helper.textContent = "";
 1328:       return;
 1329:     }
 1330: 
 1331:     if (isSecretField(field) && hasSavedServerCredential(record, field.key)) {
 1332:       helper.textContent = "Saved securely on server. Leave blank to keep the current secret.";
 1333:       return;
 1334:     }
 1335: 
 1336:     if (session.validationIntegrationId === integrationId && session.validationFieldKey === fieldKey && session.validationMessage) {
 1337:       helper.textContent = session.validationMessage;
 1338:       return;
 1339:     }
 1340: 
 1341:     helper.textContent = field.required
 1342:       ? "Required for a complete connection."
 1343:       : "Optional, but useful for scoping and diagnostics.";
```


## Verdict

| Area | Verdict |
|---|---|
| Test connection backend path | Verified backend function exists |
| Sync backend path | Verified backend function exists |
| Import history backend path | Verified backend function exists |
| Reconnect backend path | Verified |
| Disconnect confirmation | Verified |
| Disconnect backend path | Verified |
| Governance approval route | Verified for reconnect path |
| Reload after actions | Verified |
| Error handling | Verified |
| Explicit confirmation for sync/test/import | Not found |

## Engineering Decision Needed
If sync/test/import are backend-governed read/import jobs and backend owns governance, a frontend confirmation patch may be optional.
If sync/import can trigger external writes, expensive jobs, or provider-side mutations, add a small confirmation gate before these actions.

Recommended next step after reviewing T22B:
- If backend action block proves only backend-owned jobs: close Integrations authority.
- If sync/import/test lack confirmation and are potentially mutating: patch minimal confirmation + governance handling.
