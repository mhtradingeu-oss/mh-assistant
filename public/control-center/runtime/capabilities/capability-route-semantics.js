const freezeStrings = (values = []) =>
  Object.freeze(
    [...new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    )]
  );

export const CAPABILITY_EXECUTION_AUTHORITIES = Object.freeze({
  CUSTOMER_OPS: "customer_ops",
  SALES_CRM: "sales_crm",
  NONE: "none"
});

const CAPABILITY_EXECUTION_AUTHORITY_VALUES = new Set(
  Object.values(CAPABILITY_EXECUTION_AUTHORITIES)
);

const normalizeExecutionAuthority = (value = null) => {
  if (value == null || value === "") return null;

  const authority = String(value).trim();

  if (!CAPABILITY_EXECUTION_AUTHORITY_VALUES.has(authority)) {
    throw new TypeError(
      `Unknown capability execution authority: ${authority}`
    );
  }

  return authority;
};

const defineOverride = ({
  surfaceOwnerRoute = "",
  primaryExecutionRoute = "",
  executionAuthority = null,
  executionFlow = [],
  handoffRoutes = [],
  consumerRoutes = [],
  resolution = "explicit"
} = {}) => Object.freeze({
  surfaceOwnerRoute: String(surfaceOwnerRoute || "").trim() || null,
  primaryExecutionRoute:
    String(primaryExecutionRoute || "").trim() || null,
  executionAuthority: normalizeExecutionAuthority(executionAuthority),
  executionFlow: freezeStrings(executionFlow),
  handoffRoutes: freezeStrings(handoffRoutes),
  consumerRoutes: freezeStrings(consumerRoutes),
  resolution
});

/**
 * Overrides are limited to the 15 C1-C3 destination mismatches.
 *
 * An unresolved execution route is intentionally represented as null.
 * No route is invented merely to make the matrix appear complete.
 */
export const CAPABILITY_ROUTE_SEMANTIC_OVERRIDES = Object.freeze({
  "research.content_gap_analysis": defineOverride({
    surfaceOwnerRoute: "research",
    primaryExecutionRoute: "research",
    handoffRoutes: [
      "insights",
      "content-studio",
      "library",
      "campaign-studio"
    ],
    consumerRoutes: [
      "insights",
      "content-studio",
      "campaign-studio"
    ],
    resolution: "research_owner_with_cross_page_consumers"
  }),

  "research.keyword_analysis": defineOverride({
    surfaceOwnerRoute: "research",
    primaryExecutionRoute: "research",
    handoffRoutes: [
      "insights",
      "content-studio",
      "library",
      "campaign-studio"
    ],
    consumerRoutes: [
      "insights",
      "content-studio",
      "campaign-studio"
    ],
    resolution: "research_owner_with_cross_page_consumers"
  }),

  "research.seo_brief": defineOverride({
    surfaceOwnerRoute: "research",
    primaryExecutionRoute: "research",
    handoffRoutes: [
      "insights",
      "content-studio",
      "library",
      "campaign-studio"
    ],
    consumerRoutes: [
      "insights",
      "content-studio",
      "campaign-studio"
    ],
    resolution: "research_owner_with_cross_page_consumers"
  }),

  "customer.reply_draft": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.CUSTOMER_OPS,
    executionFlow: [],
    surfaceOwnerRoute: "operations-centers",
    primaryExecutionRoute: null,
    resolution: "execution_route_requires_proof"
  }),

  "customer.ticket_prepare": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.CUSTOMER_OPS,
    executionFlow: [],
    surfaceOwnerRoute: "operations-centers",
    primaryExecutionRoute: null,
    resolution: "execution_route_requires_proof"
  }),

  "customer.sla_review": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.CUSTOMER_OPS,
    executionFlow: [],
    surfaceOwnerRoute: "operations-centers",
    primaryExecutionRoute: null,
    resolution: "execution_route_requires_proof"
  }),

  "customer.conversation_summary": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.CUSTOMER_OPS,
    executionFlow: [],
    surfaceOwnerRoute: "operations-centers",
    primaryExecutionRoute: null,
    resolution: "execution_route_requires_proof"
  }),

  "operations.task_plan": defineOverride({
    surfaceOwnerRoute: "workflows",
    primaryExecutionRoute: "workflows",
    handoffRoutes: ["task", "governance", "publishing"],
    consumerRoutes: ["task"],
    resolution: "workflow_owner_with_task_handoff"
  }),

  "operations.checklist_prepare": defineOverride({
    surfaceOwnerRoute: "workflows",
    primaryExecutionRoute: "workflows",
    handoffRoutes: ["task", "governance", "publishing"],
    consumerRoutes: ["task"],
    resolution: "workflow_owner_with_task_handoff"
  }),

  "sales.follow_up": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.SALES_CRM,
    executionFlow: [],
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: null,
    handoffRoutes: [
      "workflows",
      "operations-centers",
      "content-studio",
      "sales-crm-draft",
      "governance"
    ],
    resolution: "multi_route_execution_requires_proof"
  }),

  "sales.lead_brief": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.SALES_CRM,
    executionFlow: [],
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: null,
    handoffRoutes: [
      "workflows",
      "operations-centers",
      "content-studio",
      "sales-crm-draft",
      "governance"
    ],
    resolution: "multi_route_execution_requires_proof"
  }),

  "sales.objection_handling": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.SALES_CRM,
    executionFlow: [],
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: null,
    handoffRoutes: [
      "workflows",
      "operations-centers",
      "content-studio",
      "sales-crm-draft",
      "governance"
    ],
    resolution: "multi_route_execution_requires_proof"
  }),

  "sales.pitch_create": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.SALES_CRM,
    executionFlow: [],
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: null,
    handoffRoutes: [
      "workflows",
      "operations-centers",
      "content-studio",
      "sales-crm-draft",
      "governance"
    ],
    resolution: "multi_route_execution_requires_proof"
  }),

  "strategy.priority_recommendation": defineOverride({
    executionAuthority: CAPABILITY_EXECUTION_AUTHORITIES.NONE,
    executionFlow: [],
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: null,
    handoffRoutes: ["campaign-studio", "workflows", "task"],
    resolution: "ai_workspace_prompt_suggestion"
  }),

  "handoff.content": defineOverride({
    surfaceOwnerRoute: "ai-command",
    primaryExecutionRoute: "workflows",
    handoffRoutes: ["workflows"],
    resolution: "ai_workspace_intent_with_workflow_execution"
  })
});

export function getCapabilityRouteSemantics(capability = null) {
  if (!capability?.capabilityId) return null;

  const override =
    CAPABILITY_ROUTE_SEMANTIC_OVERRIDES[capability.capabilityId];

  if (override) {
    return Object.freeze({
      capabilityId: capability.capabilityId,
      legacyDestinationRoute:
        String(capability.destinationRoute || "").trim() || null,
      ...override
    });
  }

  const legacyRoute =
    String(capability.destinationRoute || "").trim() || null;

  return Object.freeze({
    capabilityId: capability.capabilityId,
    legacyDestinationRoute: legacyRoute,
    surfaceOwnerRoute: legacyRoute,
    primaryExecutionRoute: legacyRoute,
    executionAuthority: null,
    executionFlow: freezeStrings([]),
    handoffRoutes: freezeStrings([]),
    consumerRoutes: freezeStrings([]),
    resolution: "legacy_destination_compatibility_default"
  });
}
