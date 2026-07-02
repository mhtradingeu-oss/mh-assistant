'use strict';

const { parseIntent } = require('./intent-parser');
const { buildStrategy } = require('./strategy-engine');
const { selectSpecialists } = require('./specialist-selector');
const { decideExecutionMode } = require('./decision-gate');
const { buildExecutionPlan } = require('./execution-planner');

function MH_CORTEX(input, context) {
  const safeContext = context && typeof context === 'object' ? context : {};

  const intentProfile = parseIntent(input, safeContext);
  const strategy = buildStrategy(intentProfile, safeContext);
  const specialistChain = selectSpecialists(intentProfile, safeContext);
  const decision = decideExecutionMode(intentProfile, safeContext);

  return buildExecutionPlan({
    intentProfile,
    strategy,
    specialistChain,
    decision
  });
}

module.exports = {
  MH_CORTEX
};
