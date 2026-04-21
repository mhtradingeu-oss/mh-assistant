const path = require('path');
const { readJsonFile } = require('../integrations/storage');
const {
  createAiCommandRecord,
  createAiArtifact,
  createAiRecommendation,
  upsertAiMemory,
  createTask,
  recordWorkflowRun,
  createApproval,
  createHandoff
} = require('./backbone');

const PROJECTS_DIR = '/opt/mh-assistant/data/projects';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function asString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function compactList(values, limit = 4) {
  return asArray(values).map((item) => asString(item)).filter(Boolean).slice(0, limit);
}

function loadProjectSettings(projectName) {
  const safeProject = asString(projectName).toLowerCase();
  const projectPath = path.join(PROJECTS_DIR, safeProject, 'project.json');
  return asObject(readJsonFile(projectPath, {}));
}

function normalizeRouteSuggestion(route, reason) {
  const routeId = asString(route);
  return {
    route: routeId,
    label: titleCase(routeId),
    reason: asString(reason)
  };
}

function pickRouteForIntent(intent, modeId) {
  if (intent === 'campaign') return 'campaign-studio';
  if (intent === 'content') return 'content-studio';
  if (intent === 'media') return 'media-studio';
  if (intent === 'approval') return 'governance';
  if (intent === 'workflow') return 'workflows';
  if (intent === 'task') return 'tasks';
  if (modeId === 'ads') return 'ads-manager';
  if (modeId === 'research') return 'research';
  return 'insights';
}

function classifyIntent(command, selectedModeId) {
  const text = asString(command).toLowerCase();
  const modeMap = {
    executive: ['priority', 'status', 'summary', 'readiness', 'blocker'],
    content: ['content', 'post', 'caption', 'copy', 'email', 'blog'],
    seo: ['seo', 'search', 'landing', 'ctr', 'traffic'],
    ads: ['ads', 'roas', 'campaign', 'paid', 'creative'],
    research: ['research', 'audience', 'market', 'competitor', 'learn'],
    operations: ['workflow', 'route', 'task', 'approval', 'launch', 'build']
  };

  let modeId = asString(selectedModeId) || 'executive';
  Object.entries(modeMap).forEach(([candidate, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      modeId = candidate;
    }
  });

  let intent = 'inspect';
  let actionType = 'recommendation';

  if (/\b(task|todo|follow up|assign)\b/.test(text)) {
    intent = 'task';
    actionType = 'task';
  } else if (/\b(workflow|plan|launch|run)\b/.test(text)) {
    intent = 'workflow';
    actionType = 'workflow';
  } else if (/\b(approve|approval|review)\b/.test(text)) {
    intent = 'approval';
    actionType = 'approval';
  } else if (/\b(campaign|brief|studio)\b/.test(text)) {
    intent = 'campaign';
    actionType = 'recommendation';
  } else if (/\b(content|copy|publish|post|email|blog)\b/.test(text)) {
    intent = 'content';
    actionType = 'recommendation';
  } else if (/\b(media|creative|image|video|asset)\b/.test(text)) {
    intent = 'media';
    actionType = 'recommendation';
  }

  return {
    resolvedModeId: modeId,
    intent,
    actionType,
    routeTarget: pickRouteForIntent(intent, modeId),
    confidence: text ? 0.76 : 0.35
  };
}

function buildServerContext(projectName, deps = {}) {
  const dashboard = asObject(deps.buildDashboard(projectName));
  const insights = asObject(deps.buildInsights(projectName));
  const learning = asObject(deps.buildLearning(projectName));
  const operations = asObject(deps.buildOperations(projectName));
  const settings = loadProjectSettings(projectName);

  const readiness = asObject(dashboard.readiness);
  const readinessDashboard = asObject(readiness.dashboard);
  const overview = asObject(asObject(dashboard.overview).overview);
  const connectors = asObject(dashboard.connectors);
  const integrations = asObject(connectors.control_center);
  const research = {
    key_questions: compactList(learning.open_questions || learning.questions || insights.priority_questions, 5),
    missing_signals: compactList(readinessDashboard.missing || readiness.missing || insights.missing_signals, 5),
    recent_handoffs: asArray(operations.handoffs?.items).filter((item) => asString(item.destination_page) === 'research').slice(0, 3)
  };

  return {
    project: asString(projectName).toLowerCase(),
    generated_at: new Date().toISOString(),
    dashboard,
    insights,
    learning,
    operations,
    settings,
    integrations,
    research,
    summary: {
      project_name: asString(overview.project_name || settings.project_name || projectName),
      goal: asString(overview.primary_goal || settings.primary_goal),
      audience: asString(overview.target_audience || settings.target_audience),
      critical_gaps: compactList(readinessDashboard.priorities?.critical || readiness.priorities?.critical, 4),
      next_best_actions: compactList(asObject(dashboard.overview).next_best_actions || readinessDashboard.next_best_actions, 4),
      recommendations: compactList(learning.recommendations || insights.recommendations, 4),
      connected_integrations: Object.keys(asObject(integrations.sources || integrations)).slice(0, 6)
    }
  };
}

function buildResponseFromContext(command, context, classified) {
  const summaryBits = [];
  if (context.summary.goal) summaryBits.push(`Goal: ${context.summary.goal}.`);
  if (context.summary.audience) summaryBits.push(`Audience: ${context.summary.audience}.`);
  if (context.summary.critical_gaps.length) {
    summaryBits.push(`Critical gaps: ${context.summary.critical_gaps.join('; ')}.`);
  }

  const baseRecommendations = context.summary.recommendations.length
    ? context.summary.recommendations
    : context.summary.next_best_actions;
  const routeTarget = classified.routeTarget;

  return {
    title: `${titleCase(classified.intent)} orchestration for ${context.summary.project_name || context.project}`,
    summary: summaryBits.join(' ') || `Server-side AI orchestration reviewed ${context.project} and prepared a durable next-step package for "${command}".`,
    findings: [
      `Intent classified server-side as ${classified.intent}.`,
      `Reasoning context assembled from dashboard, insights, learning, integrations, settings, and operations.`,
      context.summary.connected_integrations.length
        ? `Connected integrations in context: ${context.summary.connected_integrations.join(', ')}.`
        : 'Integration coverage is still limited, so recommendations should be validated before execution.'
    ],
    recommendations: baseRecommendations.slice(0, 3),
    nextActions: [
      `Route the strongest outcome into ${titleCase(routeTarget)}.`,
      ...context.summary.next_best_actions.slice(0, 2)
    ].filter(Boolean),
    routeSuggestions: [
      normalizeRouteSuggestion(routeTarget, `This command is best actioned in ${titleCase(routeTarget)}.`),
      normalizeRouteSuggestion('workflows', 'Use Workflows when this needs structured repeatable execution.'),
      normalizeRouteSuggestion('tasks', 'Save a durable execution task if an operator follow-up is needed.')
    ],
    missingData: context.research.missing_signals,
    recommendationObjects: baseRecommendations.slice(0, 3).map((item, index) => ({
      title: index === 0 ? 'Primary recommendation' : `Recommendation ${index + 1}`,
      summary: asString(item),
      action: asString(item),
      domain: classified.resolvedModeId,
      route_target: routeTarget,
      priority: index === 0 ? 'high' : 'normal'
    })),
    taskBlock: {
      title: `${titleCase(classified.intent)} follow-through`,
      owner: 'mh-assistant',
      steps: [
        `Review the durable artifact created for "${command}".`,
        `Route or convert the recommendation into ${titleCase(routeTarget)}.`,
        'Create approval only if execution changes publishing, spend, or sensitive settings.'
      ]
    }
  };
}

function buildWorkflowOutput(workflowId, inputs, context) {
  const campaign = asString(inputs.campaign || context.summary.project_name || context.project);
  const audience = asString(inputs.audience || context.summary.audience || 'target audience');
  const goal = asString(inputs.goal || context.summary.goal || 'project goal');
  const routeTarget = workflowId === 'generate-ad-strategy'
    ? 'ads-manager'
    : workflowId === 'build-content-plan'
      ? 'content-studio'
      : workflowId === 'launch-new-campaign'
        ? 'campaign-studio'
        : workflowId === 'competitor-research'
          ? 'research'
          : 'workflows';

  return {
    title: titleCase(workflowId),
    summary: `${titleCase(workflowId)} prepared for ${campaign} with ${goal} as the primary target and ${audience} as the main audience.`,
    findings: [
      `Workflow context was assembled server-side for ${context.project}.`,
      context.summary.critical_gaps[0] || 'No blocking critical gap was surfaced in the current context snapshot.',
      context.summary.recommendations[0] || 'No recommendation stack was available, so the workflow leaned on project settings and operations context.'
    ],
    recommendations: [
      context.summary.recommendations[0] || `Route this workflow output into ${titleCase(routeTarget)} for execution.`,
      `Keep the output durable so later pages can consume the same decision package.`,
      `Use tasks or approvals if human follow-through is required.`
    ],
    nextActions: [
      `Open ${titleCase(routeTarget)} to action the workflow output.`,
      'Create a structured task for the first operator-owned follow-up.',
      'Preserve the artifact for cross-page reuse.'
    ],
    routeSuggestions: [
      normalizeRouteSuggestion(routeTarget, 'Primary downstream page for this workflow output.'),
      normalizeRouteSuggestion('tasks', 'Convert the run into a durable task if manual execution is required.')
    ],
    routeTarget
  };
}

function buildLinkedEntities(items = []) {
  return asArray(items)
    .map((item) => item && item.entity_type && item.entity_id ? item : null)
    .filter(Boolean);
}

function createAiOrchestrationService(deps) {
  return {
    executeCommand(projectName, input = {}) {
      const command = asString(input.command || input.message);
      if (!command) {
        throw new Error('Missing command');
      }

      const context = buildServerContext(projectName, deps);
      const classified = classifyIntent(command, input.mode_id || input.modeId);
      const response = buildResponseFromContext(command, context, classified);
      const linkedEntities = [];

      const artifact = createAiArtifact(projectName, {
        type: 'ai_response',
        title: response.title,
        summary: response.summary,
        route_target: classified.routeTarget,
        source_type: 'ai_command',
        payload: {
          command,
          response,
          context_summary: context.summary
        },
        actor: input.actor
      });

      const recommendationRecords = response.recommendationObjects.map((item) =>
        createAiRecommendation(projectName, {
          ...item,
          source_type: 'ai_command',
          source_id: artifact.id,
          actor: input.actor
        })
      );

      const memory = upsertAiMemory(projectName, {
        title: `AI memory • ${classified.intent}`,
        scope: classified.intent === 'workflow' ? 'workflow' : 'project',
        key: `${classified.intent}_${classified.resolvedModeId}`,
        summary: response.summary,
        value: {
          command,
          recommendations: response.recommendations,
          route_target: classified.routeTarget
        },
        source_type: 'ai_command',
        source_id: artifact.id,
        actor: input.actor
      });

      if (classified.actionType === 'task') {
        const task = createTask(projectName, {
          title: response.taskBlock.title,
          description: response.summary,
          route_target: 'tasks',
          source_type: 'ai_command',
          source_id: artifact.id,
          output: response,
          notes: response.nextActions,
          actor: input.actor
        });
        linkedEntities.push({ entity_type: 'task', entity_id: task.id, route: 'tasks', label: task.title });
      }

      if (classified.actionType === 'workflow') {
        const run = recordWorkflowRun(projectName, {
          workflow_id: 'ai-command-orchestration',
          workflow_type: 'ai_command',
          title: response.title,
          source: 'ai-command',
          status: 'completed',
          route_target: 'workflows',
          inputs: {
            command,
            mode_id: classified.resolvedModeId
          },
          output: response,
          intelligence_stamp: {
            source: 'server_ai_context',
            generated_at: context.generated_at
          },
          actor: input.actor
        });
        linkedEntities.push({ entity_type: 'workflow_run', entity_id: run.id, route: 'workflows', label: run.title });
      }

      if (classified.actionType === 'approval') {
        const approval = createApproval(projectName, {
          title: `${response.title} approval`,
          entity_type: 'ai_artifact',
          entity_id: artifact.id,
          summary: response.summary,
          risk_level: 'medium',
          actor: input.actor
        });
        linkedEntities.push({ entity_type: 'approval', entity_id: approval.id, route: 'approvals', label: approval.title });
      }

      let handoff = null;
      if (classified.routeTarget) {
        handoff = createHandoff(projectName, {
          source_page: 'ai-command',
          destination_page: classified.routeTarget,
          linked_entity: {
            entity_type: 'ai_artifact',
            entity_id: artifact.id,
            route: classified.routeTarget,
            label: response.title
          },
          payload: {
            prompt: command,
            draft_context: {
              projectName: asString(projectName).toLowerCase(),
              modeId: classified.resolvedModeId,
              lastCommand: command,
              lastResponseTitle: response.title,
              routeSuggestions: response.routeSuggestions
            },
            output: response
          },
          actor: input.actor
        });
      }

      const commandRecord = createAiCommandRecord(projectName, {
        command,
        mode_id: classified.resolvedModeId,
        intent: classified.intent,
        action_type: classified.actionType,
        route_target: classified.routeTarget,
        source: input.source || 'ai-command',
        status: 'completed',
        context_summary: context.summary,
        classification: classified,
        response,
        linked_entities: buildLinkedEntities([
          ...linkedEntities,
          handoff ? { entity_type: 'handoff', entity_id: handoff.id, route: classified.routeTarget, label: response.title } : null
        ]),
        artifact_ids: [artifact.id],
        recommendation_ids: recommendationRecords.map((item) => item.id),
        memory_ids: [memory.id],
        actor: input.actor
      });

      return {
        command: commandRecord,
        context: {
          summary: context.summary,
          research: context.research,
          settings: {
            project_name: asString(context.settings.project_name),
            market: asString(context.settings.market)
          }
        },
        response,
        artifact,
        recommendations: recommendationRecords,
        memory,
        linked_entities: linkedEntities,
        handoff
      };
    },

    executeWorkflow(projectName, workflowId, input = {}) {
      const cleanWorkflowId = asString(workflowId);
      if (!cleanWorkflowId) {
        throw new Error('Missing workflow id');
      }

      const context = buildServerContext(projectName, deps);
      const inputs = asObject(input.inputs || input);
      const output = buildWorkflowOutput(cleanWorkflowId, inputs, context);

      const artifact = createAiArtifact(projectName, {
        type: 'workflow_output',
        title: output.title,
        summary: output.summary,
        route_target: output.routeTarget,
        source_type: 'workflow_run',
        payload: {
          workflow_id: cleanWorkflowId,
          inputs,
          output
        },
        actor: input.actor
      });

      const run = recordWorkflowRun(projectName, {
        workflow_id: cleanWorkflowId,
        workflow_type: cleanWorkflowId,
        title: output.title,
        source: input.source || 'server-ai-workflow',
        status: 'completed',
        route_target: output.routeTarget,
        inputs,
        output: {
          ...output,
          artifact_id: artifact.id
        },
        intelligence_stamp: {
          source: 'server_ai_context',
          generated_at: context.generated_at
        },
        actor: input.actor
      });

      const recommendations = output.recommendations.map((item, index) =>
        createAiRecommendation(projectName, {
          title: index === 0 ? `${output.title} primary route` : `${output.title} recommendation ${index + 1}`,
          summary: item,
          action: item,
          domain: cleanWorkflowId,
          route_target: output.routeTarget,
          source_type: 'workflow_run',
          source_id: run.id,
          priority: index === 0 ? 'high' : 'normal',
          actor: input.actor
        })
      );

      upsertAiMemory(projectName, {
        title: `Workflow memory • ${cleanWorkflowId}`,
        scope: 'workflow',
        key: cleanWorkflowId,
        summary: output.summary,
        value: {
          workflow_id: cleanWorkflowId,
          route_target: output.routeTarget,
          next_actions: output.nextActions
        },
        source_type: 'workflow_run',
        source_id: run.id,
        actor: input.actor
      });

      const handoff = createHandoff(projectName, {
        source_page: 'workflows',
        destination_page: output.routeTarget,
        linked_entity: {
          entity_type: 'workflow_run',
          entity_id: run.id,
          route: output.routeTarget,
          label: output.title
        },
        payload: {
          workflow_id: cleanWorkflowId,
          workflow_title: output.title,
          output: {
            ...output,
            artifact_id: artifact.id
          },
          inputs
        },
        actor: input.actor
      });

      return {
        run,
        artifact,
        recommendations,
        handoff,
        output: {
          ...output,
          artifact_id: artifact.id
        }
      };
    }
  };
}

module.exports = {
  createAiOrchestrationService
};
