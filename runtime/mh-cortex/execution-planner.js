'use strict';

function buildExecutionPlan(input) {
  const intentProfile = input && input.intentProfile ? input.intentProfile : {};
  const strategy = input && input.strategy ? input.strategy : {};
  const specialistChain = Array.isArray(input && input.specialistChain)
    ? input.specialistChain
    : [];
  const decision = input && input.decision ? input.decision : {};

  return {
    intent: String(intentProfile.intent || ''),
    domain: String(intentProfile.domain || ''),
    risk_level: String(intentProfile.risk_level || 'low'),
    specialist_chain: specialistChain,
    execution_steps: Array.isArray(strategy.execution_steps) ? strategy.execution_steps : [],
    execution_mode: String(decision.execution_mode || 'safe'),
    requires_approval: Boolean(decision.requires_approval)
  };
}

module.exports = {
  buildExecutionPlan
};
