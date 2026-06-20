# T4 — Workflows Automation Execution Gate Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/workflows.js

## Purpose
The T3 scan showed Workflows has direct automation execution calls. This audit checks whether these calls are user-triggered, confirmed, error-handled, and aligned with Backend Authority / Frontend Projection doctrine.

## Critical Calls
| Line | Code | Classification |
|---:|---|---|
| 18 | `startAutoMode,` | P0: execution call not clearly tied to explicit click in local excerpt |
| 20 | `resumeAutoMode,` | P0: execution call not clearly tied to explicit click in local excerpt |
| 22 | `approveCurrentGate,` | P0: execution call not clearly tied to explicit click in local excerpt |
| 23 | `skipCurrentStep,` | P0: execution call not clearly tied to explicit click in local excerpt |
| 26 | `runAutomationPlan` | P0: execution call not clearly tied to explicit click in local excerpt |
| 1662 | `const result = await runAutomationPlan(plan, {` | P1: execution call needs error-handling review |
| 1691 | `const stepResult = await runAutomationPlan(singleStep, {` | P1: execution call needs error-handling review |
| 1720 | `await startAutoMode(plan, {` | P0: explicit execution call lacks local confirmation evidence |
| 1739 | `await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });` | P0: explicit execution call lacks local confirmation evidence |
| 1755 | `await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });` | P1: execution call needs error-handling review |
| 1763 | `await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });` | P1: execution call needs error-handling review |

## Confirmation / Click / Button Signal Lines
| Line | Code |
|---:|---|
| 18 | `startAutoMode,` |
| 20 | `resumeAutoMode,` |
| 22 | `approveCurrentGate,` |
| 23 | `skipCurrentStep,` |
| 26 | `runAutomationPlan` |
| 644 | `<button id="wfexecStartRecommendedBtn" class="wfexec-btn wfexec-btn-primary" type="button">Start Workflow</button>` |
| 645 | `<button id="wfexecSaveRecommendedBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>` |
| 646 | `<button id="wfexecSendRecommendedAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI Workspace</button>` |
| 698 | `<button id="workflowRunFullAutomationBtn" class="wfexec-btn wfexec-btn-primary" type="button">` |
| 700 | `</button>` |
| 701 | `<button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 703 | `</button>` |
| 723 | `<button id="workflowAutoStartBtn" class="wfexec-btn wfexec-btn-primary" type="button">` |
| 725 | `</button>` |
| 726 | `<button id="workflowAutoPauseBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 728 | `</button>` |
| 729 | `<button id="workflowAutoResumeBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 731 | `</button>` |
| 732 | `<button id="workflowAutoStopBtn" class="wfexec-btn wfexec-btn-ghost" type="button">` |
| 734 | `</button>` |
| 757 | `<button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 759 | `</button>` |
| 760 | `<button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">` |
| 762 | `</button>` |
| 814 | `<button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Review Package</button>` |
| 815 | `<button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>` |
| 816 | `<button id="wfexecSaveDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Save Draft</button>` |
| 817 | `<button id="wfexecLoadAiStateBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Load AI Command State</button>` |
| 818 | `<button id="wfexecClearDraftBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Clear</button>` |
| 845 | `<button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>` |
| 846 | `<button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>` |
| 847 | `<button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>` |
| 889 | `<button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Send to AI for Review</button>` |
| 890 | `<button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>` |
| 891 | `<button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Review Handoff</button>` |
| 892 | `<button id="workflowBuildCustomBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Build Custom Workflow</button>` |
| 893 | `<button id="workflowRecommendBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Recommend Review Workflow</button>` |
| 1273 | `saveDraftBtn.onclick = () => {` |
| 1282 | `clearDraftBtn.onclick = () => {` |
| 1294 | `loadAiStateBtn.onclick = () => {` |
| 1334 | `if (typeof window === "undefined" \|\| typeof window.confirm !== "function") return true;` |
| 1336 | `return window.confirm(` |
| 1441 | `const runBtn = $("workflowRunBtn");` |
| 1442 | `if (runBtn) runBtn.onclick = () => runWorkflow(session.selectedWorkflowId);` |
| 1443 | `const runBtnMain = $("workflowRunBtnMain");` |
| 1444 | `if (runBtnMain) runBtnMain.onclick = () => runWorkflow(session.selectedWorkflowId);` |
| 1448 | `startRecommendedBtn.onclick = () => {` |
| 1456 | `saveRecommendedBtn.onclick = () => {` |
| 1468 | `sendRecommendedAiBtn.onclick = () => {` |
| 1486 | `Array.from(document.querySelectorAll("[data-wf-catalog-run]")).forEach((button) => {` |
| 1487 | `button.onclick = () => runWorkflow(button.getAttribute("data-wf-catalog-run") \|\| session.selectedWorkflowId);` |
| 1490 | `Array.from(document.querySelectorAll("[data-wf-catalog-save]")).forEach((button) => {` |
| 1491 | `button.onclick = () => {` |
| 1492 | `const workflowId = button.getAttribute("data-wf-catalog-save") \|\| session.selectedWorkflowId;` |
| 1500 | `Array.from(document.querySelectorAll("[data-wf-catalog-ai]")).forEach((button) => {` |
| 1501 | `button.onclick = () => {` |
| 1502 | `const workflowId = button.getAttribute("data-wf-catalog-ai") \|\| session.selectedWorkflowId;` |
| 1519 | `const pushAiBtn = $("workflowPushAiBtn");` |
| 1521 | `pushAiBtn.onclick = () => {` |
| 1536 | `const pushAiSecondaryBtn = $("workflowPushAiBtnSecondary");` |
| 1537 | `if (pushAiSecondaryBtn) pushAiSecondaryBtn.onclick = pushAiBtn?.onclick \|\| null;` |
| 1539 | `const saveTaskBtn = $("workflowSaveTaskBtn");` |
| 1541 | `saveTaskBtn.onclick = () => {` |
| 1575 | `const recommendBtn = $("workflowRecommendBtn");` |
| 1577 | `recommendBtn.onclick = () => {` |
| 1611 | `const customBtn = $("workflowBuildCustomBtn");` |
| 1613 | `customBtn.onclick = () => {` |
| 1647 | `const fullAutomationBtn = $("workflowRunFullAutomationBtn");` |
| 1649 | `fullAutomationBtn.onclick = async () => {` |
| 1656 | `const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);` |
| 1662 | `const result = await runAutomationPlan(plan, {` |
| 1676 | `const stepAutomationBtn = $("workflowRunStepAutomationBtn");` |
| 1678 | `stepAutomationBtn.onclick = async () => {` |
| 1686 | `const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");` |
| 1691 | `const stepResult = await runAutomationPlan(singleStep, {` |
| 1709 | `const autoStartBtn = $("workflowAutoStartBtn");` |
| 1711 | `autoStartBtn.onclick = async () => {` |
| 1720 | `await startAutoMode(plan, {` |
| 1728 | `const autoPauseBtn = $("workflowAutoPauseBtn");` |
| 1730 | `autoPauseBtn.onclick = () => {` |
| 1736 | `const autoResumeBtn = $("workflowAutoResumeBtn");` |
| 1738 | `autoResumeBtn.onclick = async () => {` |
| 1739 | `await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1744 | `const autoStopBtn = $("workflowAutoStopBtn");` |
| 1746 | `autoStopBtn.onclick = () => {` |
| 1752 | `const autoApproveBtn = $("workflowAutoApproveBtn");` |
| 1754 | `autoApproveBtn.onclick = async () => {` |
| 1755 | `await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1760 | `const autoSkipBtn = $("workflowAutoSkipBtn");` |
| 1762 | `autoSkipBtn.onclick = async () => {` |
| 1763 | `await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });` |
| 1963 | `<button class="btn btn-primary" type="button" data-wf-hero-prepare="1">Prepare Current Workflow</button>` |
| 1964 | `<button class="btn btn-secondary" type="button" data-wf-hero-ai="1">Review Session in AI Workspace</button>` |
| 2005 | `<button class="btn btn-secondary btn-sm" type="button" data-wf-select="${escapeHtml(item.id)}">Select</button>` |
| 2065 | `<button id="wfLightPrepareBtn" class="btn btn-primary" type="button">Prepare Workflow</button>` |
| 2066 | `<button id="wfLightAiBtn" class="btn btn-secondary" type="button">Review in AI Workspace</button>` |
| 2067 | `<button id="wfLightCampaignBtn" class="btn btn-ghost" type="button">Open Campaign Studio</button>` |
| 2068 | `<button id="wfLightTasksBtn" class="btn btn-ghost" type="button">Open Task Center</button>` |
| 2098 | `<button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open AI Workspace</button>` |
| 2115 | `<button class="btn btn-secondary btn-sm" type="button" data-wf-hero-ai="1">Open</button>` |
| 2127 | `<button class="btn btn-ghost btn-sm" type="button" data-wf-open="task-center">Open Task Center</button>` |
| 2139 | `<button class="btn btn-ghost btn-sm" type="button" data-wf-open="${escapeHtml(destinationRoute)}">Open ${escapeHtml(destinationName)}</button>` |
| 2151 | `<button class="btn btn-ghost btn-sm" type="button" data-wf-tech-focus="1">Open details</button>` |
| 2208 | `Array.from(document.querySelectorAll("[data-wf-select]")).forEach((button) => {` |
| 2209 | `button.onclick = () => {` |
| 2210 | `const workflowId = button.getAttribute("data-wf-select") \|\| WORKFLOW_CATALOG[0].id;` |
| 2276 | `if (heroPrepareBtn) heroPrepareBtn.onclick = prepareCurrentWorkflow;` |
| 2278 | `Array.from(root.querySelectorAll("[data-wf-hero-ai]")).forEach((button) => {` |
| 2279 | `button.onclick = openAiWorkspace;` |
| 2283 | `if (prepareBtn) prepareBtn.onclick = prepareCurrentWorkflow;` |
| 2286 | `if (aiBtn) aiBtn.onclick = openAiWorkspace;` |
| 2290 | `campaignBtn.onclick = () => {` |
| 2300 | `tasksBtn.onclick = () => {` |
| 2323 | `Array.from(root.querySelectorAll("[data-wf-open]")).forEach((button) => {` |
| 2324 | `button.onclick = () => {` |
| 2325 | `const route = button.getAttribute("data-wf-open") \|\| "workflows";` |
| 2353 | `techBtn.onclick = () => {` |

## Focus Zones

### Automation imports / top authority references

```js
    1: import {
    2:   selectCurrentProject,
    3:   selectOperationsSnapshot,
    4:   selectProjectPayload
    5: } from "../state.js";
    6: 
    7: import {
    8:   getSharedAiDraft,
    9:   getSharedHandoff,
   10:   setSharedAiDraft,
   11:   setSharedHandoff
   12: } from "../shared-context.js";
   13: import { getGlobalNextBestAction } from "../system-intelligence.js";
   14: import {
   15:   buildAutomationPlan,
   16:   createAutoModeController,
   17:   getAutoModeState,
   18:   startAutoMode,
   19:   pauseAutoMode,
   20:   resumeAutoMode,
   21:   stopAutoMode,
   22:   approveCurrentGate,
   23:   skipCurrentStep,
   24:   subscribeAutoMode,
   25:   getAutoFixPlan,
   26:   runAutomationPlan
   27: } from "../automation-engine.js";
   28: 
   29: const WORKFLOW_CATALOG = [
   30:   {
   31:     id: "launch-campaign",
   32:     title: "Launch Campaign",
   33:     purpose: "Build a launch-ready review sequence across campaign, content, and distribution handoffs.",
   34:     requiredInputs: ["project", "campaign", "product", "channel", "goal"],
   35:     aiModeId: "strategist",
   36:     routeHint: "campaign-studio"
   37:   },
   38:   {
   39:     id: "create-content-plan",
   40:     title: "Create Content Plan",
   41:     purpose: "Generate a review-ready content plan tied to campaign and audience context.",
   42:     requiredInputs: ["project", "campaign", "product", "channel", "goal"],
   43:     aiModeId: "writer",
   44:     routeHint: "content-studio"
   45:   },
   46:   {
   47:     id: "build-media-job",
   48:     title: "Build Media Job",
   49:     purpose: "Prepare media production inputs, format guidance, and downstream handoff steps.",
   50:     requiredInputs: ["project", "campaign", "product", "channel", "goal"],
   51:     aiModeId: "media",
   52:     routeHint: "media-studio"
   53:   },
   54:   {
   55:     id: "prepare-publishing-package",
   56:     title: "Prepare Publishing Package",
   57:     purpose: "Package final channel payloads, approval checks, and publishing queue dependencies.",
   58:     requiredInputs: ["project", "campaign", "channel", "goal"],
   59:     aiModeId: "operations",
   60:     routeHint: "publishing"
   61:   },
   62:   {
   63:     id: "generate-report",
   64:     title: "Generate Report",
   65:     purpose: "Summarize workflow state, results, blockers, and the next operational decision.",
   66:     requiredInputs: ["project", "campaign", "goal"],
   67:     aiModeId: "analyst",
   68:     routeHint: "insights"
   69:   },
   70:   {
   71:     id: "research-competitors",
   72:     title: "Research Competitors",
   73:     purpose: "Create a competitor intelligence brief for positioning and campaign advantage.",
   74:     requiredInputs: ["project", "product", "goal"],
   75:     aiModeId: "researcher",
   76:     routeHint: "research"
   77:   },
   78:   {
   79:     id: "fix-integrations",
   80:     title: "Fix Integrations",
```

### Workflow action binding zone

```js
 1560:           service_domain: workflow.id === "generate-report" || workflow.id === "research-competitors" ? "research" : "campaign",
 1561:           route_target: "workflows",
 1562:           output: asObject(run.output),
 1563:           notes: asArray(run.output.nextActions || []),
 1564:           status: "review_only"
 1565:         },
 1566:         created_at: new Date().toISOString()
 1567:       };
 1568: 
 1569:       setSharedHandoff(projectName, "task-center", handoff);
 1570:       showMessage?.("Task handoff prepared for review in Task Center.");
 1571:       navigateTo("task-center");
 1572:     };
 1573:   }
 1574: 
 1575:   const recommendBtn = $("workflowRecommendBtn");
 1576:   if (recommendBtn) {
 1577:     recommendBtn.onclick = () => {
 1578:       const rec = buildSmartRecommendation(contextModel, session, getGlobalNextBestAction(getState()));
 1579:       const prompt = [
 1580:         "Recommend the best workflow to run next.",
 1581:         `Project: ${projectName || "not set"}`,
 1582:         `Current recommendation: ${rec.title}`,
 1583:         `Reason: ${rec.reason}`,
 1584:         `Missing integrations: ${contextModel.missingIntegrations.join(", ") || "none"}`,
 1585:         `Missing assets: ${contextModel.missingAssets.join(", ") || "none"}`
 1586:       ].join("\n");
 1587:       setSharedAiDraft(projectName, {
 1588:         projectName,
 1589:         modeId: "operations",
 1590:         lastCommand: prompt,
 1591:         lastResponseTitle: "Workflow recommendation"
 1592:       });
 1593:       setSharedHandoff(projectName, "ai-command", {
 1594:         source_page: "workflows",
 1595:         destination_page: "ai-command",
 1596:         payload: {
 1597:           prompt,
 1598:           draft_context: {
 1599:             projectName,
 1600:             modeId: "operations",
 1601:             lastCommand: prompt,
 1602:             lastResponseTitle: "Workflow recommendation"
 1603:           }
 1604:         },
 1605:         status: "available"
 1606:       });
 1607:       navigateTo("ai-command");
 1608:     };
 1609:   }
 1610: 
 1611:   const customBtn = $("workflowBuildCustomBtn");
 1612:   if (customBtn) {
 1613:     customBtn.onclick = () => {
 1614:       const prompt = [
 1615:         "Build a custom workflow blueprint.",
 1616:         `Project: ${inputs.project || projectName || "not set"}`,
 1617:         `Campaign: ${inputs.campaign || "not set"}`,
 1618:         `Product: ${inputs.product || "not set"}`,
 1619:         `Channel: ${inputs.channel || "not set"}`,
 1620:         `Goal: ${inputs.goal || "not set"}`,
 1621:         "Return structured steps, blockers, route suggestions, and KPI checks."
 1622:       ].join("\n");
 1623:       setSharedAiDraft(projectName, {
 1624:         projectName,
 1625:         modeId: "operations",
 1626:         lastCommand: prompt,
 1627:         lastResponseTitle: "Custom workflow builder"
 1628:       });
 1629:       setSharedHandoff(projectName, "ai-command", {
 1630:         source_page: "workflows",
 1631:         destination_page: "ai-command",
 1632:         payload: {
 1633:           prompt,
 1634:           draft_context: {
 1635:             projectName,
 1636:             modeId: "operations",
 1637:             lastCommand: prompt,
 1638:             lastResponseTitle: "Custom workflow builder"
 1639:           }
 1640:         },
 1641:         status: "available"
 1642:       });
 1643:       navigateTo("ai-command");
 1644:     };
 1645:   }
 1646: 
 1647:   const fullAutomationBtn = $("workflowRunFullAutomationBtn");
 1648:   if (fullAutomationBtn) {
 1649:     fullAutomationBtn.onclick = async () => {
 1650:       const plan = buildAutomationPlan(getState());
 1651:       if (!plan.length) {
 1652:         workflowAutomationState.result = "No safe automation steps available.";
 1653:         render();
 1654:         return;
 1655:       }
 1656:       const confirmed = window.confirm(`Confirm guided preparation simulation\n\nAction: Simulate ${plan.length} guided automation steps.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to stop.`);
 1657:       if (!confirmed) return;
 1658: 
 1659:       workflowAutomationState.lastPlan = plan;
 1660:       workflowAutomationState.cursor = 0;
 1661:       workflowAutomationState.result = "";
 1662:       const result = await runAutomationPlan(plan, {
 1663:         context: { getState, navigateTo, createProjectHandoff, projectName },
 1664:         onProgress: ({ index, total, step, result: stepResult }) => {
 1665:           workflowAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${stepResult.status})`;
 1666:           render();
 1667:         }
 1668:       });
 1669:       workflowAutomationState.lastResults = asArray(result.results);
 1670:       workflowAutomationState.result = result.status === "success" ? "Guided preparation simulation completed." : "Guided preparation simulation stopped before completion.";
 1671:       showMessage?.(workflowAutomationState.result);
 1672:       render();
 1673:     };
 1674:   }
 1675: 
 1676:   const stepAutomationBtn = $("workflowRunStepAutomationBtn");
 1677:   if (stepAutomationBtn) {
 1678:     stepAutomationBtn.onclick = async () => {
 1679:       const plan = buildAutomationPlan(getState());
 1680:       if (!plan.length) {
 1681:         workflowAutomationState.result = "No safe automation steps available.";
 1682:         render();
 1683:         return;
 1684:       }
 1685: 
 1686:       const confirmed = window.confirm("Confirm guided preparation step\n\nAction: Simulate the next preparation step.\nRisk: This can prepare downstream draft or handoff state, but does not publish, approve Governance decisions, or send externally.\n\nSelect Cancel to keep the current state.");
 1687:       if (!confirmed) return;
 1688: 
 1689:       const nextIndex = Math.min(workflowAutomationState.cursor, plan.length - 1);
 1690:       const singleStep = [plan[nextIndex]];
 1691:       const stepResult = await runAutomationPlan(singleStep, {
 1692:         context: { getState, navigateTo, createProjectHandoff, projectName },
 1693:         onProgress: ({ index, total, step, result: runResult }) => {
 1694:           workflowAutomationState.progress = `Step ${nextIndex + index} / ${plan.length}: ${step.action} (${runResult.status})`;
 1695:         }
 1696:       });
 1697: 
 1698:       workflowAutomationState.cursor = Math.min(nextIndex + 1, plan.length);
 1699:       workflowAutomationState.lastPlan = plan;
 1700:       workflowAutomationState.lastResults = [...asArray(workflowAutomationState.lastResults), ...asArray(stepResult.results)];
 1701:       workflowAutomationState.result = workflowAutomationState.cursor >= plan.length
 1702:         ? "Step-by-step guided preparation completed."
 1703:         : "Preparation step simulated. Continue for the next step.";
 1704:       showMessage?.(workflowAutomationState.result);
 1705:       render();
 1706:     };
 1707:   }
 1708: 
 1709:   const autoStartBtn = $("workflowAutoStartBtn");
 1710:   if (autoStartBtn) {
 1711:     autoStartBtn.onclick = async () => {
 1712:       const plan = buildAutomationPlan(getState());
 1713:       workflowAutomationEnabled = true;
 1714:       createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
 1715:       if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
 1716:       workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
 1717:         render();
 1718:       });
 1719: 
 1720:       await startAutoMode(plan, {
 1721:         mode: "auto_until_approval",
 1722:         context: { getState, navigateTo, createProjectHandoff, projectName }
 1723:       });
 1724:       showMessage?.("Workflow Guided Preparation Mode started.");
 1725:     };
 1726:   }
 1727: 
 1728:   const autoPauseBtn = $("workflowAutoPauseBtn");
 1729:   if (autoPauseBtn) {
 1730:     autoPauseBtn.onclick = () => {
 1731:       pauseAutoMode();
 1732:       showMessage?.("Guided Preparation Mode paused.");
 1733:     };
 1734:   }
 1735: 
 1736:   const autoResumeBtn = $("workflowAutoResumeBtn");
 1737:   if (autoResumeBtn) {
 1738:     autoResumeBtn.onclick = async () => {
 1739:       await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
 1740:       showMessage?.("Guided Preparation Mode resumed.");
 1741:     };
 1742:   }
 1743: 
 1744:   const autoStopBtn = $("workflowAutoStopBtn");
 1745:   if (autoStopBtn) {
 1746:     autoStopBtn.onclick = () => {
 1747:       stopAutoMode();
 1748:       showMessage?.("Guided Preparation Mode stopped.");
 1749:     };
 1750:   }
 1751: 
 1752:   const autoApproveBtn = $("workflowAutoApproveBtn");
 1753:   if (autoApproveBtn) {
 1754:     autoApproveBtn.onclick = async () => {
 1755:       await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
 1756:       showMessage?.("Automation gate accepted. This is not a Governance approval.");
 1757:     };
 1758:   }
 1759: 
 1760:   const autoSkipBtn = $("workflowAutoSkipBtn");
 1761:   if (autoSkipBtn) {
 1762:     autoSkipBtn.onclick = async () => {
 1763:       await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
 1764:       showMessage?.("Guided Preparation Mode skipped one automation step. This does not bypass Governance policy.");
 1765:     };
 1766:   }
 1767: }
 1768: 
 1769: export const workflowsRoute = {
 1770:   id: "workflows",
 1771:   disableStandardLayout: true,
 1772:   meta: {
 1773:     eyebrow: "AI & Build",
 1774:     title: "Workflows",
 1775:     description: "Prepare structured, repeatable workflow review packages and handoffs for common marketing operations."
 1776:   },
 1777:   template: `
 1778:     <section class="page is-active" data-page="workflows">
 1779:       <div id="workflowsRoot"></div>
 1780:     </section>
 1781:   `,
 1782:     render({
 1783:     getState,
 1784:     $,
 1785:     escapeHtml,
```

### Post-action / render route zone

```js
 1786:     navigateTo,
 1787:     showMessage
 1788:   }) {
 1789:     const state = getState();
 1790:     const projectName = asString(selectCurrentProject(state) || "");
 1791:     const campaignName = asString(state.context.activeCampaign || "");
 1792:     const executionMode = asString(state.context.executionMode || "");
 1793: 
 1794:     const payload = asObject(selectProjectPayload(state));
 1795: 
 1796:     const overview = asObject(payload.overview?.overview || payload.overview);
 1797:     const readinessRoot = asObject(payload.readiness?.dashboard || payload.readiness);
 1798:     const operations = asObject(selectOperationsSnapshot(state));
 1799: 
 1800:     const readinessScore = readinessRoot.readiness_score ?? overview.readiness_score ?? null;
 1801:     const readinessStatus = firstNonEmpty(readinessRoot.readiness_status, overview.readiness_status, "Unknown");
 1802: 
 1803:     const workflowsTotal = Number(operations.workflows?.total_runs || operations.workflows?.total || 0);
 1804:     const tasksTotal = Number(operations.tasks?.total || 0);
 1805:     const approvalsTotal = Number(operations.approvals?.total || 0);
 1806: 
 1807:     const root = $("workflowsRoot");
 1808:     if (!root) return;
 1809: 
 1810:     const destinationRouteByHint = {
 1811:       "campaign-studio": "campaign-studio",
 1812:       "content-studio": "content-studio",
 1813:       "media-studio": "media-studio",
 1814:       publishing: "publishing",
 1815:       insights: "insights",
 1816:       research: "research",
 1817:       integrations: "integrations"
 1818:     };
 1819: 
 1820:     const stateModel = {
 1821:       selectedWorkflowId: WORKFLOW_CATALOG[0].id,
 1822:       inputsByWorkflow: WORKFLOW_CATALOG.reduce((acc, workflow) => {
 1823:         acc[workflow.id] = {
 1824:           project: projectName,
 1825:           campaign: campaignName,
 1826:           product: firstNonEmpty(projectName, overview.project_name),
 1827:           channel: asArray(overview.channels).join(", "),
 1828:           goal: ""
 1829:         };
 1830:         return acc;
 1831:       }, {}),
 1832:       preparedPackage: null,
 1833:       lastStatusTone: "is-info",
 1834:       lastStatusText: "Select a workflow template to start a session.",
 1835:       aiReviewed: false,
 1836:       openedTaskCenter: false,
 1837:       openedDestination: false
 1838:     };
 1839: 
 1840:     function getSelectedWorkflow() {
 1841:       return getWorkflowDef(stateModel.selectedWorkflowId);
 1842:     }
 1843: 
 1844:     function getDestinationLabel(routeHint) {
 1845:       return titleCase(routeHint || "destination");
 1846:     }
 1847: 
 1848:     function getMissingInputs(workflow, inputs) {
 1849:       return workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
 1850:     }
 1851: 
 1852:     function buildSessionPrompt(workflow, inputs) {
 1853:       return [
 1854:         `Workflow: ${workflow.title}`,
 1855:         `Purpose: ${workflow.purpose}`,
 1856:         `Project: ${inputs.project || projectName || "not set"}`,
 1857:         `Campaign: ${inputs.campaign || campaignName || "not set"}`,
 1858:         `Product: ${inputs.product || "not set"}`,
 1859:         `Channel: ${inputs.channel || "not set"}`,
 1860:         `Goal: ${inputs.goal || "Prepare a review-ready workflow package."}`
 1861:       ].join("\\n");
 1862:     }
 1863: 
 1864:     function buildStepModel(workflow, inputs) {
 1865:       const missing = getMissingInputs(workflow, inputs);
 1866:       const hasPrepared = Boolean(stateModel.preparedPackage && stateModel.preparedPackage.workflowId === workflow.id);
 1867:       const hasTracking = workflowsTotal > 0 || hasPrepared;
 1868: 
 1869:       return [
 1870:         {
 1871:           title: "Select Template",
 1872:           status: "complete",
 1873:           copy: workflow.title
 1874:         },
 1875:         {
 1876:           title: "Complete Context",
 1877:           status: missing.length ? "active" : "complete",
 1878:           copy: missing.length ? `${missing.length} missing` : "Complete"
 1879:         },
 1880:         {
```

## Decision Checklist

Use this checklist before any fix:

- If execution is not tied to explicit user click: fix immediately.
- If execution is tied to click but lacks confirmation: add confirmation.
- If confirmation exists but copy is unclear: improve copy only.
- If frontend starts automation that backend should own: document migration path, do not rewrite blindly.
- If error handling is missing: add safe error handling.
- If all gates are present: close as compatibility risk, no runtime change.

## Recommended Next Step
Review this file manually and choose one smallest safe patch.
