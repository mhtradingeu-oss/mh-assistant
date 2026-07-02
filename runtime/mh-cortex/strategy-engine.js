'use strict';

function buildDomainSteps(domain) {
  switch (domain) {
    case 'marketing':
      return [
        'Define campaign objective and success metrics',
        'Build channel and audience strategy',
        'Prepare content and distribution plan'
      ];
    case 'dev':
      return [
        'Clarify technical scope and acceptance criteria',
        'Design implementation approach and validation checks',
        'Prepare rollout and verification plan'
      ];
    case 'media':
      return [
        'Define creative direction and format requirements',
        'Outline production assets and sequencing',
        'Prepare editing, QA, and publishing checklist'
      ];
    case 'ops':
    default:
      return [
        'Clarify operational objective and constraints',
        'Define control points and runbook path',
        'Prepare execution checkpoints and recovery steps'
      ];
  }
}

function buildStrategy(intentProfile, context) {
  const domain = intentProfile && intentProfile.domain ? intentProfile.domain : 'ops';
  const intent = intentProfile && intentProfile.intent ? intentProfile.intent : 'task_execution';

  const steps = [
    'Capture request intent and expected outcome',
    'Collect required context, dependencies, and boundaries',
    ...buildDomainSteps(domain)
  ];

  if (intent === 'analysis') {
    steps.push('Compile findings, risks, and recommended next actions');
  } else {
    steps.push('Create a final execution-ready handoff package');
  }

  if (context && context.include_validation !== false) {
    steps.push('Add pre-execution validation and post-execution success checks');
  }

  return {
    execution_steps: steps
  };
}

module.exports = {
  buildStrategy
};
