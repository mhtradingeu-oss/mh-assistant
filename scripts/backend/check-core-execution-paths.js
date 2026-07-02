#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const bridgePath = path.join(root, "runtime/orchestrator-service/lib/execution/execution-job-bridge.js");
const gpuAdapterPath = path.join(root, "runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js");
const providerRouterPath = path.join(root, "runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js");
const providerLayerPath = path.join(root, "runtime/orchestrator-service/lib/media/provider-layer.js");
const schedulerStoragePath = path.join(root, "runtime/orchestrator-service/lib/execution/scheduler-storage.js");

const outDir = path.join(root, "audits/backend/local-truth-audit");
const outJson = path.join(outDir, "P1_CORE_EXECUTION_PATHS_CHECK.json");

const SEMI_AUTO_MARKERS = ["manual_publish_ready", "pending_execution", "mock_output: true"];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function lineOf(source, snippet) {
  const idx = source.indexOf(snippet);
  if (idx < 0) return null;
  return source.slice(0, idx).split("\n").length;
}

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) return "";
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1;
  if (end < 0) return source.slice(start);
  return source.slice(start, end);
}

function hasNone(source, markers) {
  return markers.every((marker) => !source.includes(marker));
}

function routeProof(name, route, block, requirements = []) {
  const checks = requirements.map((item) => ({
    check: item.label,
    pass: item.test(block)
  }));

  const forbidden = SEMI_AUTO_MARKERS.filter((marker) => block.includes(marker));
  const pass = checks.every((item) => item.pass) && forbidden.length === 0;

  return {
    name,
    route,
    pass,
    checks,
    forbidden_markers: forbidden
  };
}

function run() {
  const server = read(serverPath);
  const bridge = read(bridgePath);
  const gpuAdapter = read(gpuAdapterPath);
  const providerRouter = read(providerRouterPath);
  const providerLayer = read(providerLayerPath);
  const schedulerStorage = read(schedulerStoragePath);

  const publishBlock = section(server, "app.post('/execute_publish_package'", "app.post('/execute_email_package'");
  const emailBlock = section(server, "app.post('/execute_email_package'", "app.post('/generate_media_from_prompt'");
  const mediaBlock = section(server, "app.post('/generate_media_from_prompt'", "app.post('/build_ad_execution_package'");
  const adBlock = section(server, "app.post('/build_ad_execution_package'", "app.get('/products'");
  const nativeBlock = section(server, "async function handleNativeMediaGenerate", "app.post('/media-manager/project/:project/native-media/generate'");
  const workflowBlock = section(server, "function handleRunWorkflow", "app.post('/media-manager/project/:project/workflows/:workflowId/run'");
  const aiCommandBlock = section(server, "async function handleExecuteAiCommand", "async function handleExecuteAiChat");
  const aiChatBlock = section(server, "async function handleExecuteAiChat", "async function handleExecuteAiGuidance");
  const aiGuidanceBlock = section(server, "async function handleExecuteAiGuidance", "function handleExecuteAiWorkflow");
  const aiWorkflowBlock = section(server, "function handleExecuteAiWorkflow", "function handleListAiCommands");

  const routeChecks = [
    routeProof("publish_execution", "/execute_publish_package", publishBlock, [
      { label: "route_uses_execution_bridge", test: (s) => s.includes("await executeJobBridge({") && s.includes("type: 'publish'") },
      { label: "no_manual_publish_state", test: (s) => !s.includes("manual_publish_ready") }
    ]),
    routeProof("email_execution", "/execute_email_package", emailBlock, [
      { label: "route_uses_execution_bridge", test: (s) => s.includes("await executeJobBridge({") && s.includes("type: 'email'") },
      { label: "no_pending_execution_state", test: (s) => !s.includes("pending_execution") }
    ]),
    routeProof("media_generation_execution", "/generate_media_from_prompt", mediaBlock, [
      { label: "route_uses_execution_bridge", test: (s) => s.includes("await executeJobBridge({") && s.includes("type: 'media'") },
      { label: "no_mock_output_flag", test: (s) => !s.includes("mock_output") }
    ]),
    routeProof("ad_execution", "/build_ad_execution_package", adBlock, [
      { label: "route_uses_execution_bridge", test: (s) => s.includes("await executeJobBridge({") && s.includes("type: 'ads'") },
      { label: "non_review_execution_state", test: (s) => !s.includes("ready_for_review") }
    ]),
    routeProof("native_media_generate", "/media-manager/project/:project/native-media/generate", nativeBlock, [
      { label: "uses_dispatch_orchestrator", test: (s) => s.includes("createJobDispatchOrchestrator") && s.includes("await orchestrator.dispatch") },
      { label: "uses_openai_default_provider", test: (s) => s.includes("DEFAULT_NATIVE_MEDIA_PROVIDER") }
    ]),
    routeProof("workflow_run", "/media-manager/project/:project/workflows/:workflowId/run", workflowBlock, [
      { label: "records_workflow_run", test: (s) => s.includes("recordWorkflowRun") }
    ]),
    routeProof("ai_command", "/media-manager/project/:project/ai/command", aiCommandBlock, [
      { label: "calls_ai_orchestrator", test: (s) => s.includes("getAiOrchestrator().executeCommand") }
    ]),
    routeProof("ai_chat", "/media-manager/project/:project/ai/chat", aiChatBlock, [
      { label: "calls_ai_orchestrator", test: (s) => s.includes("getAiOrchestrator().executeChat") }
    ]),
    routeProof("ai_guidance", "/media-manager/project/:project/ai/guidance", aiGuidanceBlock, [
      { label: "calls_ai_orchestrator", test: (s) => s.includes("getAiOrchestrator().executeGuidance") }
    ]),
    routeProof("ai_workflow", "/media-manager/project/:project/ai/workflows/:workflowId/run", aiWorkflowBlock, [
      { label: "calls_ai_orchestrator", test: (s) => s.includes("getAiOrchestrator().executeWorkflow") }
    ])
  ];

  const bridgeChecks = {
    asyncBridge: bridge.includes("async function executeJobBridge"),
    noManualStateInBridge: !bridge.includes("manual_publish_ready") && !bridge.includes("pending_execution"),
    mediaMockFallbackNotSemiAuto: !bridge.includes("execution_state: 'ready_for_review'")
  };

  const runtimeInfraChecks = {
    schedulerStoragePresent: schedulerStorage.includes("createSchedulerStorage"),
    providerRouterPresent: providerRouter.includes("createProviderExecutionRouter") && providerRouter.includes("async function execute"),
    providerLayerPresent: providerLayer.includes("createMediaProviderLayer") && providerLayer.includes("generateImage"),
    gpuWorkerHttpSubmissionEnabled: gpuAdapter.includes("axios.post(endpoint") && gpuAdapter.includes("status: 'submitted'")
  };

  const remainingSemiAutoMatches = [];
  const globalMarkers = ["manual_publish_ready", "pending_execution", "mock_output: true"];
  for (const marker of globalMarkers) {
    const line = lineOf(server, marker);
    if (line) {
      remainingSemiAutoMatches.push({ file: "runtime/orchestrator-service/server.js", line, marker });
    }
  }

  const fullyExecuting = routeChecks.filter((item) => item.pass).map((item) => item.route);
  const routeGaps = routeChecks.filter((item) => !item.pass);

  const summary = {
    checked_at: new Date().toISOString(),
    routes_total: routeChecks.length,
    routes_passed: fullyExecuting.length,
    routes_failed: routeGaps.length,
    fully_executing_routes: fullyExecuting,
    route_gaps: routeGaps,
    bridge_checks: bridgeChecks,
    runtime_infra_checks: runtimeInfraChecks,
    remaining_semi_auto_or_mock_markers: remainingSemiAutoMatches,
    conclusion: routeGaps.length === 0
      ? "Core high-risk routes are wired through runtime execution paths and no longer default to manual/semi-auto states."
      : "Some high-risk routes still require execution-path remediation."
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(JSON.stringify(summary, null, 2));
}

run();
