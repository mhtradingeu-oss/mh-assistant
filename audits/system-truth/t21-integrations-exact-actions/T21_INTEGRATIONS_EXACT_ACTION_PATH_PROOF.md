# T21 — Integrations Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/integrations.js

## Purpose
T20 identified Integrations as the highest remaining risk page. T21 verifies exact action paths:
- connect/reconnect
- governance approval handling
- disconnect confirmation
- sync/import/test backend action path
- secret credential handling
- render boundary

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| Imported backend functions | 1265 | 20 |
| persistPrimary connect/reconnect | 1472 | 1 |
| reconnect backend call | 1498 | 1 |
| governance approval handling | 1515 | 3 |
| disconnect function | 1530 | 1 |
| disconnect confirmation | 1538 | 1 |
| disconnect backend call | 1544 | 1 |
| provider action dispatcher | 1567 | 3 |
| sync backend call | 1586 | 2 |
| test connection path | 1151 | 7 |
| secret value handling | 59 | 44 |
| main root render | 1743 | 1 |


## Evidence Zones

### Imported backend functions

```js
 1170: }
 1171: 
 1172: function normalizeStatusLabel(statusLabel, fallback = "Not Connected") {
 1173:   const normalized = asString(statusLabel).trim().toLowerCase();
 1174: 
 1175:   if (normalized === "unavailable") return "Unavailable";
 1176:   if (normalized === "connected") return "Connected";
 1177:   if (normalized === "partial") return "Partial";
 1178:   if (normalized === "error") return "Error";
 1179:   if (normalized === "token expired" || normalized === "token_expired") return "Token expired";
 1180:   if (normalized === "not connected" || normalized === "not_connected") return "Not Connected";
 1181: 
 1182:   return fallback;
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
 1344:   });
 1345: 
 1346:   Array.from(document.querySelectorAll("[data-integration-category-filter]")).forEach((select) => {
 1347:     select.onchange = (event) => {
 1348:       session.categoryFilter = event.target.value || "all";
 1349:       render();
 1350:     };
 1351:   });
 1352: 
 1353:   Array.from(document.querySelectorAll("[data-integration-status-filter]")).forEach((select) => {
 1354:     select.onchange = (event) => {
 1355:       session.statusFilter = event.target.value || "all";
 1356:       render();
 1357:     };
 1358:   });
 1359: 
 1360:   Array.from(document.querySelectorAll("[data-integration-search]")).forEach((input) => {
```

### persistPrimary connect/reconnect

```js
 1377:     button.onclick = () => {
 1378:       const state = getState();
 1379:       const domainModels = buildDomainModels(state, session, {
 1380:         domains: INTEGRATION_DOMAINS,
 1381:         buildIntegrationCardModel: (integration, localSession, localState) => buildIntegrationCardModel(
 1382:           integration,
 1383:           localSession,
 1384:           localState,
 1385:           {
 1386:             getLegacySourceValue,
 1387:             getLegacySources,
 1388:             getServerRecord,
 1389:             unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
 1390:             normalizeStatusLabel,
 1391:             getLocalFillCount,
 1392:             getRequiredMissing,
 1393:             getIntegrationAccessModel,
 1394:             asArray,
 1395:             asObject,
 1396:             asString,
 1397:             titleCase,
 1398:             inferScopeKeys,
 1399:             buildSuggestedValues,
 1400:             getSuggestedFieldValue,
 1401:             getHealthSummary
 1402:           }
 1403:         )
 1404:       });
 1405:       const allCards = domainModels.flatMap((domain) => domain.cards);
 1406:       const diagnostics = buildLaunchDiagnostics(allCards);
 1407:       showMessage?.(`Diagnostics reviewed: ${diagnostics.blockers.length} blockers, ${diagnostics.warnings.length} warnings.`);
 1408:       render();
 1409:     };
 1410:   });
 1411: 
 1412:   function buildConnectionPayload(integrationId) {
 1413:     const integration = getIntegrationById(integrationId);
 1414:     if (!integration) return null;
 1415: 
 1416:     const state = getState();
 1417:     const record = getServerRecord(state, integration);
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
```

### reconnect backend call

```js
 1403:         )
 1404:       });
 1405:       const allCards = domainModels.flatMap((domain) => domain.cards);
 1406:       const diagnostics = buildLaunchDiagnostics(allCards);
 1407:       showMessage?.(`Diagnostics reviewed: ${diagnostics.blockers.length} blockers, ${diagnostics.warnings.length} warnings.`);
 1408:       render();
 1409:     };
 1410:   });
 1411: 
 1412:   function buildConnectionPayload(integrationId) {
 1413:     const integration = getIntegrationById(integrationId);
 1414:     if (!integration) return null;
 1415: 
 1416:     const state = getState();
 1417:     const record = getServerRecord(state, integration);
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
```

### governance approval handling

```js
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
```

### disconnect function

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
```

### disconnect confirmation

```js
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
```

### disconnect backend call

```js
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
```

### provider action dispatcher

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
```

### sync backend call

```js
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
 1666:     getState,
 1667:     $,
 1668:     escapeHtml,
 1669:     safeText,
 1670:     navigateTo,
 1671:     showMessage,
 1672:     showError,
 1673:     reloadProjectData,
 1674:     connectProjectIntegration,
 1675:     reconnectProjectIntegration,
 1676:     testProjectIntegration,
 1677:     syncProjectIntegration,
 1678:     importProjectIntegrationHistory,
 1679:     disconnectProjectIntegration
 1680:   }) {
 1681:     const state = getState();
```

### test connection path

```js
 1056:       read: [...new Set(["contacts", "campaign performance", ...scopeKeys])],
 1057:       write: ["campaign sends", "audience sync"]
 1058:     };
 1059:   }
 1060: 
 1061:   if (integration.domainId === "ads") {
 1062:     return {
 1063:       read: [...new Set(["ads", "spend", "campaigns", "creative performance", ...scopeKeys])],
 1064:       write: ["budget changes", "campaign updates"]
 1065:     };
 1066:   }
 1067: 
 1068:   return {
 1069:     read: [...new Set(["workflow events", "shared files", ...scopeKeys])],
 1070:     write: ["automation triggers", "notifications"]
 1071:   };
 1072: }
 1073: 
 1074: function getServerRecord(state, integration) {
 1075:   const record = asObject(getControlCenterRecords(state)[integration.id]);
 1076:   if (record.integration_id) {
 1077:     return record;
 1078:   }
 1079: 
 1080:   return buildLegacyFallbackRecord(integration, state, {
 1081:     shouldSyncLegacySource,
 1082:     getLegacySources,
 1083:     getLegacySourceValue,
 1084:     getIntegrationAccessModel,
 1085:     inferScopeKeys,
 1086:     asString,
 1087:     asObject
 1088:   });
 1089: }
 1090: 
 1091: function getFieldValue(session, integration, field, record, sourceValue, suggestedValue = "") {
 1092:   const draft = ensureDraft(session, integration.id);
 1093:   if (draft[field.key] != null) return draft[field.key];
 1094:   if (isSecretField(field)) return "";
 1095:   if (field.key === integration.primaryField) {
 1096:     return asString(record.primary_value || sourceValue || record.config?.[field.key] || suggestedValue);
 1097:   }
 1098:   return asString(record.config?.[field.key] || suggestedValue);
 1099: }
 1100: 
 1101: function hasSavedServerCredential(record, fieldKey) {
 1102:   return Boolean(asObject(record.credential_state)[fieldKey]?.is_set);
 1103: }
 1104: 
 1105: function hasSavedServerRequiredField(record, integration, field) {
 1106:   if (!field) return false;
 1107: 
 1108:   if (isSecretField(field)) {
 1109:     return hasSavedServerCredential(record, field.key);
 1110:   }
 1111: 
 1112:   const configValue = asString(asObject(record.config)[field.key]).trim();
 1113:   if (configValue) {
 1114:     return true;
 1115:   }
 1116: 
 1117:   if (field.key === integration.primaryField) {
 1118:     return Boolean(asString(record.primary_value).trim());
 1119:   }
 1120: 
 1121:   return false;
 1122: }
 1123: 
 1124: function getTestPreflightIssue(integration, record) {
 1125:   if (!integration || !record) {
 1126:     return null;
 1127:   }
 1128: 
 1129:   if (integration.id === "woocommerce") {
 1130:     const savedStoreUrl = asString(asObject(record.config).storeUrl).trim();
 1131:     if (!savedStoreUrl) {
 1132:       return {
 1133:         fieldKey: "storeUrl",
 1134:         message:
 1135:           "WooCommerce Store URL is not saved yet. Run Repair integration connection after governance approval, then test the connection."
 1136:       };
 1137:     }
 1138:   }
 1139: 
 1140:   const missingRequired = integration.fields
 1141:     .filter((field) => field.required)
 1142:     .filter((field) => !hasSavedServerRequiredField(record, integration, field));
 1143: 
 1144:   if (!missingRequired.length) {
 1145:     return null;
 1146:   }
 1147: 
 1148:   return {
 1149:     fieldKey: missingRequired[0].key,
 1150:     message:
 1151:       "Save or repair this integration before running a connection test. The test uses the saved server-side configuration."
 1152:   };
 1153: }
 1154: 
 1155: function getLocalFillCount(session, integration, record, sourceValue, state) {
 1156:   return integration.fields.filter((field) => {
 1157:     const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();
 1158:     return Boolean(value) || (isSecretField(field) && hasSavedServerCredential(record, field.key));
 1159:   }).length;
 1160: }
 1161: 
 1162: function getRequiredMissing(session, integration, record, sourceValue, state) {
 1163:   return integration.fields
 1164:     .filter((field) => field.required)
 1165:     .filter((field) => {
 1166:       const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();
 1167:       return !value && !(isSecretField(field) && hasSavedServerCredential(record, field.key));
 1168:     })
 1169:     .map((field) => field.label);
 1170: }
 1171: 
 1172: function normalizeStatusLabel(statusLabel, fallback = "Not Connected") {
 1173:   const normalized = asString(statusLabel).trim().toLowerCase();
 1174: 
 1175:   if (normalized === "unavailable") return "Unavailable";
 1176:   if (normalized === "connected") return "Connected";
 1177:   if (normalized === "partial") return "Partial";
 1178:   if (normalized === "error") return "Error";
 1179:   if (normalized === "token expired" || normalized === "token_expired") return "Token expired";
 1180:   if (normalized === "not connected" || normalized === "not_connected") return "Not Connected";
 1181: 
 1182:   return fallback;
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
```

### secret value handling

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
   82:         id: "shopify",
   83:         sourceKey: "shopify",
   84:         label: "Shopify",
   85:         icon: "SH",
   86:         purpose: "Future-ready Shopify storefront integration for products, orders, and sales intelligence.",
   87:         whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
   88:         enables: "Product sync, order sync, customer sync, and sales reporting.",
   89:         dataScope: ["Products", "Orders", "Customers", "Sales"],
   90:         permissionScope: "Store domain + admin access token",
   91:         primaryField: "storeDomain",
   92:         fields: [
   93:           { key: "storeDomain", label: "Store domain", placeholder: "brand.myshopify.com", required: true },
   94:           { key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },
   95:           { key: "storeId", label: "Store ID", placeholder: "Shopify store ID" }
   96:         ]
   97:       },
   98:       {
   99:         id: "amazon",
  100:         sourceKey: "amazon",
  101:         backendSupported: false,
  102:         unavailableReason: "Backend provider support is not configured yet.",
  103:         label: "Amazon",
  104:         icon: "AM",
  105:         purpose: "Marketplace performance, product-driven commerce signals, and listing intelligence.",
  106:         whyItMatters: "Amazon data gives MH Assistant direct product demand and marketplace sales feedback.",
  107:         enables: "Listing sync, sales signals, performance by product, and marketplace learning.",
  108:         dataScope: ["Listings", "Orders", "Sales", "Marketplace performance"],
  109:         permissionScope: "Merchant ID + SP-API credentials",
  110:         primaryField: "merchantId",
  111:         fields: [
  112:           { key: "merchantId", label: "Merchant ID", placeholder: "Amazon merchant ID", required: true },
  113:           { key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },
  114:           { key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }
  115:         ]
  116:       },
  117:       {
  118:         id: "ebay",
  119:         sourceKey: "ebay",
  120:         label: "eBay",
  121:         icon: "EB",
  122:         purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",
  123:         whyItMatters: "eBay extends commerce intelligence beyond the owned store and helps the system learn external demand patterns.",
  124:         enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",
  125:         dataScope: ["Listings", "Orders", "Sales", "Marketplace activity"],
  126:         permissionScope: "Seller account + OAuth access token",
  127:         primaryField: "sellerId",
  128:         fields: [
  129:           { key: "sellerId", label: "Seller ID", placeholder: "eBay seller ID", required: true },
  130:           { key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },
  131:           { key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }
  132:         ]
  133:       }
  134:     ]
  135:   },
  136:   {
  137:     id: "social",
  138:     title: "Social Platforms",
  139:     description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
  140:     integrations: [
  141:       {
  142:         id: "facebook",
  143:         sourceKey: "facebook",
  144:         label: "Facebook",
  145:         icon: "FB",
  146:         purpose: "Page insights, post performance, engagement, and linked business intelligence.",
  147:         whyItMatters: "Facebook insights help the system understand what posts drive reach, clicks, and downstream action.",
  148:         enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
  149:         dataScope: ["Post insights", "Engagement", "Comments", "Publishing", "Ads linkage"],
  150:         permissionScope: "Page ID + business access token",
  151:         critical: true,
  152:         primaryField: "pageUrl",
  153:         fields: [
  154:           { key: "pageUrl", label: "Page URL", placeholder: "https://facebook.com/brand", required: true },
```

### main root render

```js
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
 1671:     showMessage,
 1672:     showError,
 1673:     reloadProjectData,
 1674:     connectProjectIntegration,
 1675:     reconnectProjectIntegration,
 1676:     testProjectIntegration,
 1677:     syncProjectIntegration,
 1678:     importProjectIntegrationHistory,
 1679:     disconnectProjectIntegration
 1680:   }) {
 1681:     const state = getState();
 1682:     const projectName = state.context.currentProject || "";
 1683:     const session = ensureSession(projectName);
 1684:     const domainModels = buildDomainModels(state, session, {
 1685:       domains: INTEGRATION_DOMAINS,
 1686:       buildIntegrationCardModel: (integration, localSession, localState) => buildIntegrationCardModel(
 1687:         integration,
 1688:         localSession,
 1689:         localState,
 1690:         {
 1691:           getLegacySourceValue,
 1692:           getLegacySources,
 1693:           getServerRecord,
 1694:           unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
 1695:           normalizeStatusLabel,
 1696:           getLocalFillCount,
 1697:           getRequiredMissing,
 1698:           getIntegrationAccessModel,
 1699:           asArray,
 1700:           asObject,
 1701:           asString,
 1702:           titleCase,
 1703:           inferScopeKeys,
 1704:           buildSuggestedValues,
 1705:           getSuggestedFieldValue,
 1706:           getHealthSummary
 1707:         }
 1708:       )
 1709:     });
 1710:     const sectionGroups = buildSectionGroups(domainModels);
 1711:     const allCards = domainModels.flatMap((domain) => domain.cards);
 1712:     if (!session.selectedIntegrationId || !allCards.find((card) => card.id === session.selectedIntegrationId)) {
 1713:       session.selectedIntegrationId = allCards[0]?.id || "";
 1714:     }
 1715:     const coverageMap = buildCoverageMap(domainModels);
 1716:     const criticalMissing = buildCriticalMissing(domainModels);
 1717:     const recommendations = buildRecommendations(domainModels, coverageMap);
 1718:     const aiRec = buildAISmartRecommendation(domainModels);
 1719:     const controlCenter = getControlCenterPayload(state);
 1720:     const overview = buildIntegrationOverviewSummary(allCards, recommendations);
 1721:     const diagnostics = buildLaunchDiagnostics(allCards);
 1722:     const connectorGroups = buildConnectorWorkspaceGroups(allCards, session);
 1723:     const filteredCards = connectorGroups.flatMap((group) => group.cards);
 1724:     const selectedCard = filteredCards.find((card) => card.id === session.selectedIntegrationId) || allCards.find((card) => card.id === session.selectedIntegrationId) || filteredCards[0] || allCards[0] || null;
 1725:     const drawerCard = allCards.find((card) => card.id === session.activeDrawerIntegrationId) || selectedCard;
 1726:     const attentionTotal = allCards.filter((card) => ["needs_setup", "failed"].includes(getConnectorWorkspaceStatus(card))).length;
 1727:     const readinessBase = Math.max(allCards.length, 1);
 1728:     const criticalMissingCount = criticalMissing.length;
 1729:     const connectedTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length;
 1730:     const partialTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;
 1731:     const systemScore = Math.round(((connectedTotal + partialTotal * 0.5) / readinessBase) * 100);
 1732:     const activityFeed = buildIntegrationActivityFeed(controlCenter, allCards);
 1733:     const lastGlobalSync =
 1734:       asString(controlCenter.summary?.last_global_sync) ||
 1735:       allCards
 1736:         .map((card) => card.lastSync)
 1737:         .filter(Boolean)
 1738:         .sort()
 1739:         .reverse()[0] || "";
 1740:     const root = $("integrationsRoot");
 1741:     if (!root) return;
 1742: 
 1743:     root.innerHTML = `
 1744:       <div class="integrations-wrapper integration-system-panel">
 1745:         <section class="card integration-system-overview integration-system-overview--compact">
 1746:           <div class="card-head integration-system-overview-head">
 1747:             <div>
 1748:               <div class="setup-kicker">Integration Control Tower</div>
 1749:               <h3>Executive health</h3>
 1750:               <p class="home-section-copy integration-system-purpose">Connect business platforms so MH-OS can sync performance, route safe backend actions, and learn from live operating data.</p>
 1751:             </div>
 1752:             <span class="card-badge ${escapeHtml(attentionTotal || criticalMissingCount ? "warning" : "success")}">${escapeHtml(attentionTotal || criticalMissingCount ? "Action needed" : "Operational")}</span>
 1753:           </div>
 1754:           <div class="integration-system-overview-grid">
 1755:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1756:               <span class="data-label">Total</span>
 1757:               <strong>${escapeHtml(String(overview.totalIntegrations))}</strong>
 1758:             </div>
 1759:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1760:               <span class="data-label">Connected</span>
 1761:               <strong>${escapeHtml(String(overview.connectedIntegrations))}</strong>
 1762:             </div>
 1763:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1764:               <span class="data-label">Missing</span>
 1765:               <strong>${escapeHtml(String(overview.missingRequired))}</strong>
 1766:             </div>
 1767:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1768:               <span class="data-label">Failed</span>
 1769:               <strong>${escapeHtml(String(overview.failedOrDisconnected))}</strong>
 1770:             </div>
 1771:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1772:               <span class="data-label">Readiness</span>
 1773:               <strong>${escapeHtml(String(systemScore))}%</strong>
 1774:             </div>
 1775:           </div>
 1776: 
 1777:           ${aiRec.card ? `
 1778:             <div class="integration-system-overview-next integration-system-next-action" data-integration-next-action>
 1779:               <div class="integration-system-overview-next-head">
 1780:                 <h4>Next best action</h4>
 1781:                 <span class="card-badge ${escapeHtml(aiRec.priorityTone)}">${escapeHtml(aiRec.priorityLabel)}</span>
 1782:               </div>
 1783:               <div class="integration-next-action-body">
 1784:                 <div class="integration-next-action-connector">
 1785:                   <div class="integration-next-action-connector-icon" data-integration-initials="${escapeHtml(aiRec.card.icon)}">${escapeHtml(aiRec.card.icon)}</div>
 1786:                   <div class="integration-next-action-connector-info">
 1787:                     <strong>${escapeHtml(aiRec.card.label)}</strong>
 1788:                     <span>${escapeHtml(aiRec.card.domainTitle)}</span>
 1789:                   </div>
 1790:                 </div>
 1791:                 <details class="integration-next-action-details">
 1792:                   <summary class="integration-next-action-summary">Why this action now?</summary>
 1793:                   <div class="integration-next-action-why">
 1794:                     <p><strong>Unlocks:</strong> ${escapeHtml(aiRec.card.enables)}</p>
 1795:                     <p><strong>Decision confidence:</strong> ${escapeHtml(aiRec.card.whyItMatters)}</p>
 1796:                     <p><strong>Risk if missing:</strong> ${escapeHtml(aiRec.reasonLabel)} remains unresolved.</p>
 1797:                   </div>
 1798:                 </details>
 1799:                 <button class="btn btn-primary" type="button" data-integration-select="${escapeHtml(aiRec.card.id)}">Open connector setup</button>
 1800:               </div>
 1801:             </div>
 1802:           ` : ""}
 1803:         </section>
 1804:         ${aiRec.card ? "" : renderAISmartRecommendationModule(aiRec)}
 1805: 
 1806: 
 1807: 
 1808:         <section class="integration-system-workspace">
 1809:           <div class="integration-system-workspace-main">
 1810:             <section class="card integration-system-filters">
 1811:               <div class="card-head integration-system-filters-head">
 1812:                 <div>
 1813:                   <div class="setup-kicker">Required Operating Connectors</div>
 1814:                   <h3>Connector Control Center</h3>
 1815:                   <p class="home-section-copy" style="margin:6px 0 0;">Filter by category or status, search providers, and open setup quickly.</p>
 1816:                 </div>
 1817:                 <span class="card-badge ${escapeHtml(filteredCards.length ? "neutral" : "warning")}">${escapeHtml(filteredCards.length ? `${filteredCards.length} visible` : "No matches")}</span>
 1818:               </div>
 1819:               <div class="integration-filter-bar">
 1820:                 <label class="integration-filter-field">
 1821:                   <span class="setup-label">Category</span>
 1822:                   <select data-integration-category-filter>
 1823:                     <option value="all">All categories</option>
 1824:                     ${Object.entries(CONNECTOR_WORKSPACE_CATEGORIES).map(([id, meta]) => `<option value="${escapeHtml(id)}" ${session.categoryFilter === id ? "selected" : ""}>${escapeHtml(meta.label)}</option>`).join("")}
 1825:                   </select>
 1826:                 </label>
 1827:                 <label class="integration-filter-field">
 1828:                   <span class="setup-label">Status</span>
 1829:                   <select data-integration-status-filter>
 1830:                     <option value="all">All statuses</option>
 1831:                     <option value="connected" ${session.statusFilter === "connected" ? "selected" : ""}>Connected</option>
 1832:                     <option value="missing" ${session.statusFilter === "missing" ? "selected" : ""}>Missing</option>
 1833:                     <option value="failed" ${session.statusFilter === "failed" ? "selected" : ""}>Failed</option>
 1834:                     <option value="needs_setup" ${session.statusFilter === "needs_setup" ? "selected" : ""}>Partial</option>
 1835:                   </select>
 1836:                 </label>
 1837:                 <label class="integration-filter-field integration-filter-search">
 1838:                   <span class="setup-label">Search</span>
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Reconnect backend authority | Verified |
| Governance approval routing | Verified |
| Disconnect confirmation | Verified |
| Disconnect backend authority | Verified |
| Sync/import/test backend authority | Found - focused review needed for confirmation/governance policy |
| Secret fields not prefilled | Verified |
| Password field typing | Verified |

## Decision
- If sync/import/test are backend-governed and non-destructive: no immediate runtime patch.
- If sync/import/test can mutate external provider state without confirmation/governance: patch required.
- If reconnect respects governance approval and redirects to Governance: safe enough.
- If disconnect confirmation and backend path are verified: safe enough.
- If secret fields are blank/password typed: safe enough.
- Do not patch CSS.
- Do not change backend authority.
- Do not change data/projects.
