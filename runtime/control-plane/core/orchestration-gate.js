// CLEAN ORCHESTRATION GATE (SINGLE AUTHORITY)

function orchestrationGate({
  input,
  registrySignal,
  aiDecision,
  cortexInsight
}) {

  const trace = {
    input,
    registrySignal,
    aiDecision,
    cortexInsight
  };

  // 1. DEFAULT RULE (SAFE)
  let finalAgent = "default_orchestrator";

  // 2. AI decides primary mode (NO EXECUTION AUTHORITY)
  if (aiDecision?.recommendedAgent) {
    finalAgent = aiDecision.recommendedAgent;
  }

  // 3. Registry can only SUGGEST (NEVER OVERRIDE)
  if (registrySignal?.priority > 80 && registrySignal?.suggestedAgent) {
    trace.registryBoosted = true;
  }

  // 4. Cortex is ONLY advisory
  trace.cortexUsed = !!cortexInsight;

  return {
    finalAgent,
    trace,
    authority: "CONTROL_PLANE_SINGLE_SOURCE"
  };
}

module.exports = { orchestrationGate };