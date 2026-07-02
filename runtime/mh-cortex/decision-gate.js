'use strict';

function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }
  return false;
}

function decideExecutionMode(intentProfile, context) {
  const riskLevel = String(intentProfile && intentProfile.risk_level ? intentProfile.risk_level : 'low').toLowerCase();
  const forceSafe = toBoolean(context && context.force_safe_mode);
  const allowDirectMedium = toBoolean(context && context.allow_direct_medium_risk);

  if (forceSafe) {
    return {
      execution_mode: 'safe',
      requires_approval: false
    };
  }

  if (riskLevel === 'high') {
    return {
      execution_mode: 'approval_required',
      requires_approval: true
    };
  }

  if (riskLevel === 'medium' && !allowDirectMedium) {
    return {
      execution_mode: 'approval_required',
      requires_approval: true
    };
  }

  return {
    execution_mode: 'direct_execution',
    requires_approval: false
  };
}

module.exports = {
  decideExecutionMode
};
