import {
  fetchProjectGovernancePolicy,
  fetchProjectTeam,
  saveProjectTeam,
  updateProjectGovernancePolicy
} from "../api.js";

const sessions = new Map();

const OPERATING_MODE_OPTIONS = [
  {
    value: "Planning Mode",
    label: "Planning Mode",
    description: "Recommend, prioritize, and prepare work without taking action."
  },
  {
    value: "Guided Execution",
    label: "Guided Execution",
    description: "Prepare actions and prompt operators step by step."
  },
  {
    value: "Semi-Auto",
    label: "Semi-Auto",
    description: "Automate low-risk work while keeping humans in the loop."
  },
  {
    value: "Approval-First",
    label: "Approval-First",
    description: "Everything important queues for human review before execution."
  },
  {
    value: "Full AI Assist",
    label: "Full AI Assist",
    description: "The system acts aggressively inside approved guardrails."
  },
  {
    value: "Emergency Safe Mode",
    label: "Emergency Safe Mode",
    description: "Freeze automation and reduce the system to protective operations."
  }
];

const AUTOMATION_RULE_OPTIONS = [
  "Suggest workflows when campaign is ready",
  "Block publishing when assets are missing",
  "Suggest rewrite when content is weak",
  "Alert when integrations fail",
  "Route SEO issues into Research/Workflows",
  "Route weak ads into Ads Manager"
];

const TEAM_ROLE_OPTIONS = [
  "Strategist",
  "Writer",
  "Designer",
  "Video Lead",
  "Publisher",
  "Ads Operator",
  "Analyst",
  "Compliance Reviewer",
  "Admin",
  "Brand owner"
];

const TEAM_ROLE_MATRIX = [
  {
    id: "strategist",
    label: "Strategist",
    service: "Planning & campaign architecture",
    description: "Shapes priorities, campaign structures, and workflow sequencing."
  },
  {
    id: "writer",
    label: "Writer",
    service: "Messaging & content generation",
    description: "Develops copy systems, rewrites, and narrative consistency."
  },
  {
    id: "designer",
    label: "Designer",
    service: "Static creative & brand expression",
    description: "Owns visual quality, layout intent, and asset polish."
  },
  {
    id: "videoLead",
    label: "Video Lead",
    service: "Motion creative & video delivery",
    description: "Directs short-form and long-form motion output standards."
  },
  {
    id: "publisher",
    label: "Publisher",
    service: "Distribution & release operations",
    description: "Controls schedules, queues, and final outbound execution."
  },
  {
    id: "adsOperator",
    label: "Ads Operator",
    service: "Paid testing & optimization",
    description: "Manages variants, spend tests, and escalation into Ads Manager."
  },
  {
    id: "analyst",
    label: "Analyst",
    service: "Measurement & performance review",
    description: "Reads signals, monitors readiness, and flags weak performance."
  },
  {
    id: "complianceReviewer",
    label: "Compliance Reviewer",
    service: "Safety & policy review",
    description: "Checks claims, legal risk, and policy-sensitive output."
  },
  {
    id: "admin",
    label: "Admin",
    service: "System control & escalation ownership",
    description: "Owns defaults, integrations, emergency controls, and final overrides."
  }
];

const SECTION_DEFINITIONS = [
  {
    id: "project",
    title: "Project Settings",
    description: "Define the commercial identity, market defaults, and baseline operating context for the project.",
    backendLabel: "Project profile fields are ready for backend save",
    fields: [
      { path: "project.projectName", label: "Project name", type: "text", critical: true, placeholder: "project-name" },
      { path: "project.brandName", label: "Brand name", type: "text", critical: true, placeholder: "Brand name" },
      {
        path: "project.market",
        label: "Market",
        type: "select",
        critical: true,
        options: ["Germany", "United States", "United Kingdom", "UAE", "Saudi Arabia", "France"]
      },
      {
        path: "project.language",
        label: "Language",
        type: "select",
        critical: true,
        options: ["German", "English", "Arabic", "French"]
      },
      {
        path: "project.currency",
        label: "Currency",
        type: "select",
        critical: true,
        options: ["EUR", "USD", "GBP", "AED", "SAR"]
      },
      {
        path: "project.timezone",
        label: "Timezone",
        type: "select",
        critical: true,
        options: ["Europe/Berlin", "UTC", "America/New_York", "Asia/Dubai", "Europe/London"]
      },
      { path: "project.website", label: "Website", type: "url", critical: true, placeholder: "https://brand.com" },
      {
        path: "project.defaultCampaignMode",
        label: "Default campaign mode",
        type: "select",
        options: ["Planning Mode", "Guided Execution", "Semi-Auto", "Approval-First", "Full AI Assist", "Emergency Safe Mode"]
      },
      {
        path: "project.businessType",
        label: "Business type / project type",
        type: "select",
        critical: true,
        options: ["Ecommerce", "DTC brand", "Marketplace", "Service business", "B2B"]
      }
    ]
  },
  {
    id: "operating",
    title: "Operating Modes",
    description: "Define how assertively MH Assistant plans, acts, escalates, and protects the project.",
    backendLabel: "Operating policy is active now and ready for backend persistence",
    fields: [
      {
        path: "operating.primaryMode",
        label: "System operating mode",
        type: "card-select",
        critical: true,
        options: OPERATING_MODE_OPTIONS
      },
      {
        path: "operating.actionPolicy",
        label: "Action policy",
        type: "select",
        critical: true,
        options: ["Recommend only", "Prepare actions with review", "Auto-run trusted actions", "Act unless blocked by policy"]
      },
      {
        path: "operating.emergencyOwner",
        label: "Emergency safe mode owner",
        type: "select",
        options: ["Admin", "Brand owner", "Operations lead", "Compliance Reviewer"]
      },
      {
        path: "operating.modeNotes",
        label: "Operating notes",
        type: "textarea",
        placeholder: "Describe when the system can escalate, pause, or shift to a more defensive operating posture."
      }
    ]
  },
  {
    id: "ai",
    title: "AI Settings",
    description: "Control how the system writes, reasons, creates media, and escalates work that needs human review.",
    backendLabel: "AI orchestration defaults are partially backend-ready",
    fields: [
      {
        path: "ai.tone",
        label: "AI tone / brand tone",
        type: "select",
        critical: true,
        options: ["Premium expert", "Direct operator", "Warm advisor", "Luxury editorial", "Performance-focused"]
      },
      {
        path: "ai.responseStyle",
        label: "Response style",
        type: "select",
        options: ["Structured concise", "Strategic detailed", "Executive summary", "Operator checklist"]
      },
      {
        path: "ai.generationStrictness",
        label: "Generation strictness",
        type: "select",
        critical: true,
        options: ["Strict", "Balanced", "Exploratory"]
      },
      {
        path: "ai.approvalRequiredMode",
        label: "Approval-required mode",
        type: "select",
        critical: true,
        options: ["Always", "Only high-risk", "Campaign launch only", "Manual override"]
      },
      {
        path: "ai.creativitySafetyBalance",
        label: "AI creativity / safety balance",
        type: "select",
        options: ["Safety-first", "Balanced", "Creative push"]
      },
      {
        path: "ai.claimSafetyMode",
        label: "Claim safety mode",
        type: "select",
        critical: true,
        options: ["Strict evidence required", "Brand-safe balanced", "Relaxed draft mode"]
      },
      {
        path: "ai.contentGenerationDefaults",
        label: "Content generation defaults",
        type: "textarea",
        placeholder: "Short-form hooks first, German market language, product-truth protected."
      },
      {
        path: "ai.mediaGenerationDefaults",
        label: "Media generation defaults",
        type: "textarea",
        placeholder: "Use approved brand colors, real packaging, premium masculine mood, no invented labels."
      }
    ]
  },
  {
    id: "automation",
    title: "Automation Rules",
    description: "Tell the system what should be suggested, blocked, routed, or escalated when operational conditions change.",
    backendLabel: "Automation routing rules sync into the durable governance policy",
    fields: [
      {
        path: "automation.enabledRules",
        label: "Active automation rules",
        type: "checklist",
        critical: true,
        options: AUTOMATION_RULE_OPTIONS
      },
      {
        path: "automation.readinessThreshold",
        label: "Campaign readiness threshold",
        type: "select",
        options: ["High confidence only", "Medium and above", "Any partial readiness", "Manual review decides"]
      },
      {
        path: "automation.failurePolicy",
        label: "Automation failure policy",
        type: "select",
        options: ["Pause and alert", "Retry then route", "Route to operator immediately", "Record only"]
      },
      {
        path: "automation.routingNotes",
        label: "Automation routing notes",
        type: "textarea",
        placeholder: "Route SEO gaps into Research, weak ad performance into Ads Manager, and publish blockers into review queues."
      }
    ]
  },
  {
    id: "publishing",
    title: "Publishing Defaults",
    description: "Set where content goes, how it is routed, and what conditions must be true before anything ships.",
    backendLabel: "Publishing defaults sync into the durable governance policy",
    fields: [
      {
        path: "publishing.channels",
        label: "Default publishing channels",
        type: "checklist",
        critical: true,
        options: ["Instagram", "Facebook", "TikTok", "YouTube", "Email", "Website", "Amazon"]
      },
      {
        path: "publishing.schedulingBehavior",
        label: "Default scheduling behavior",
        type: "select",
        options: ["Queue for review", "Schedule immediately", "Draft only", "Batch by campaign"]
      },
      {
        path: "publishing.approvalBeforePublish",
        label: "Approval before publish",
        type: "toggle"
      },
      {
        path: "publishing.namingConvention",
        label: "Naming conventions",
        type: "text",
        placeholder: "market_campaign_channel_assettype_v1"
      },
      {
        path: "publishing.contentRouting",
        label: "Content routing defaults",
        type: "textarea",
        placeholder: "Route product launches to social + email, evergreen SEO to website, paid hooks to ads queue."
      },
      {
        path: "publishing.campaignOutputs",
        label: "Campaign output defaults",
        type: "checklist",
        options: ["Organic posts", "Stories", "Reels", "Ads variants", "Landing pages", "Email sequence"]
      }
    ]
  },
  {
    id: "approval",
    title: "Approval Rules",
    description: "Make ownership, escalation, and revision rules explicit so content moves quickly without losing control.",
    backendLabel: "Approval policy syncs into the durable governance and team records",
    fields: [
      {
        path: "approval.contentOwner",
        label: "Content approval owner",
        type: "select",
        critical: true,
        options: ["Brand owner", "Marketing lead", "Content lead", "Operations lead"]
      },
      {
        path: "approval.mediaOwner",
        label: "Media approval owner",
        type: "select",
        critical: true,
        options: ["Creative lead", "Brand owner", "Media lead", "Operations lead"]
      },
      {
        path: "approval.adsOwner",
        label: "Ads approval owner",
        type: "select",
        critical: true,
        options: ["Growth lead", "Brand owner", "Paid media lead", "Operations lead"]
      },
      {
        path: "approval.requirements",
        label: "What requires human approval",
        type: "checklist",
        critical: true,
        options: ["All publish actions", "Paid ads", "Medical or product claims", "New campaign launches", "AI-generated media"]
      },
      {
        path: "approval.revisionRules",
        label: "Rejection / revision rules",
        type: "textarea",
        placeholder: "Reject anything with unsupported claims, brand mismatch, or missing route metadata. Two failed reviews escalate."
      },
      {
        path: "approval.escalationNotes",
        label: "Escalation notes",
        type: "textarea",
        placeholder: "Escalate legal-sensitive claims to brand owner and operations lead within one business day."
      }
    ]
  },
  {
    id: "team",
    title: "Team Permissions",
    description: "Define who can operate the system, who can approve output, who runs each service lane, and who can change the machine itself.",
    backendLabel: "Permissions are modeled now and ready for future role persistence",
    fields: [
      {
        path: "team.roles",
        label: "Roles / access levels",
        type: "checklist",
        options: TEAM_ROLE_OPTIONS
      },
      {
        path: "team.serviceCoverage",
        label: "Active team services",
        type: "checklist",
        options: ["Strategy", "Writing", "Design", "Video", "Publishing", "Ads", "Analytics", "Compliance", "Administration"]
      },
      {
        path: "team.editAccess",
        label: "Who can edit",
        type: "select",
        critical: true,
        options: ["Strategists, writers, and designers", "All active operators", "Admins only", "Project owner only"]
      },
      {
        path: "team.publishAccess",
        label: "Who can publish",
        type: "select",
        critical: true,
        options: ["Publishers and admins", "Compliance-reviewed publishers", "Admins only", "Project owner only"]
      },
      {
        path: "team.approveAccess",
        label: "Who can approve",
        type: "select",
        critical: true,
        options: ["Compliance reviewers and admins", "Brand owner", "Admins only", "Project owner only"]
      },
      {
        path: "team.integrationAccess",
        label: "Who can manage integrations",
        type: "select",
        options: ["Admins only", "Admins and operators", "Operations lead", "Project owner only"]
      },
      {
        path: "team.defaultsAccess",
        label: "Who can change system defaults",
        type: "select",
        critical: true,
        options: ["Admins only", "Project owner only", "Brand owner and admins", "Operations lead"]
      }
    ]
  },
  {
    id: "presets",
    title: "Presets & Reusable Defaults",
    description: "Give both AI operators and human teams consistent starting points for campaigns, media, SEO, ads, and approvals.",
    backendLabel: "Preset selection is ready now and can upgrade to backend persistence later",
    fields: [
      {
        path: "presets.campaignPreset",
        label: "Campaign presets",
        type: "select",
        options: ["Launch sprint", "Evergreen growth", "Seasonal push", "Retention sequence", "Product education"]
      },
      {
        path: "presets.contentPreset",
        label: "Content presets",
        type: "select",
        options: ["Hook-first social", "Editorial authority", "Conversion-first DTC", "SEO education", "Email storytelling"]
      },
      {
        path: "presets.mediaPreset",
        label: "Media presets",
        type: "select",
        options: ["Premium product studio", "Lifestyle performance", "UGC-inspired clean", "Brand-safe editorial", "Minimal ecommerce"]
      },
      {
        path: "presets.seoPreset",
        label: "SEO presets",
        type: "select",
        options: ["Opportunity sprint", "Evergreen pillar", "Product category SEO", "Localized market SEO", "Technical cleanup"]
      },
      {
        path: "presets.adsPreset",
        label: "Ads test presets",
        type: "select",
        options: ["Hook test set", "Offer angle matrix", "Creative fatigue recovery", "Retargeting sprint", "Landing page validation"]
      },
      {
        path: "presets.approvalPreset",
        label: "Approval presets",
        type: "select",
        options: ["Lean operator review", "Balanced launch control", "Strict compliance review", "Executive sign-off"]
      },
      {
        path: "presets.presetNotes",
        label: "Preset notes",
        type: "textarea",
        placeholder: "Capture the reusable defaults that AI and operators should inherit when launching new work."
      }
    ]
  },
  {
    id: "sync",
    title: "Sync Rules",
    description: "Control how aggressively the system refreshes connected sources, retries failures, and keeps data current.",
    backendLabel: "Sync policy is a safe placeholder until connector-level persistence lands",
    fields: [
      { path: "sync.autoSync", label: "Auto sync", type: "toggle" },
      {
        path: "sync.frequency",
        label: "Sync frequency",
        type: "select",
        options: ["Hourly", "Every 6 hours", "Daily", "Manual only"]
      },
      {
        path: "sync.importHistoryPreference",
        label: "Import history preference",
        type: "select",
        options: ["Last 30 days", "Last 90 days", "Last 12 months", "Project lifetime"]
      },
      {
        path: "sync.retryFailedBehavior",
        label: "Retry failed sync behavior",
        type: "select",
        options: ["Retry twice then alert", "Retry once", "Manual retry only", "Escalate immediately"]
      },
      {
        path: "sync.healthCheckFrequency",
        label: "Health check frequency",
        type: "select",
        options: ["Every 15 minutes", "Hourly", "Twice daily", "Daily"]
      },
      {
        path: "sync.refreshDefaults",
        label: "Refresh defaults",
        type: "textarea",
        placeholder: "Refresh connectors before morning review, before campaign launch, and after failed imports."
      }
    ]
  },
  {
    id: "alerts",
    title: "Alerts & Notification Rules",
    description: "Control which operational events trigger alerts so teams can intervene before failures become launch problems.",
    backendLabel: "Notifications are captured here and marked for backend delivery integration",
    fields: [
      {
        path: "alerts.enabledRules",
        label: "Active alerts",
        type: "checklist",
        critical: true,
        options: [
          "Sync failure alerts",
          "Approval pending alerts",
          "Scheduled publish alerts",
          "Provider disconnect alerts",
          "Claim safety alerts",
          "Workflow completion alerts"
        ]
      },
      {
        path: "alerts.deliveryMode",
        label: "Primary notification mode",
        type: "select",
        options: ["In-app only", "In-app + email", "In-app + Slack", "In-app + escalation queue"]
      },
      {
        path: "alerts.alertCadence",
        label: "Reminder cadence",
        type: "select",
        options: ["Immediate only", "Every 30 minutes", "Hourly", "Twice daily"]
      },
      {
        path: "alerts.notificationNotes",
        label: "Notification notes",
        type: "textarea",
        placeholder: "Use immediate alerts for provider disconnects and claim safety issues; batch lower-priority workflow completions."
      }
    ]
  },
  {
    id: "safety",
    title: "Safety & Governance",
    description: "Protect the brand, enforce truth constraints, and make compliance risks visible before the system acts.",
    backendLabel: "Governance rules are operational now and marked for backend persistence",
    fields: [
      { path: "safety.aiClaimCheck", label: "AI claim check", type: "toggle", critical: true },
      {
        path: "safety.productTruthRules",
        label: "Product truth rules",
        type: "textarea",
        critical: true,
        placeholder: "Never invent product benefits, ingredients, results, packaging, or certifications."
      },
      {
        path: "safety.prohibitedOutputs",
        label: "Prohibited outputs",
        type: "textarea",
        critical: true,
        placeholder: "Fake before/after claims, invented medical promises, altered packaging, counterfeit logos."
      },
      {
        path: "safety.complianceAlerts",
        label: "Compliance alerts",
        type: "textarea",
        placeholder: "Flag regulated claims, platform policy risk, and market-specific labeling issues."
      },
      {
        path: "safety.brandProtectionRules",
        label: "Brand protection rules",
        type: "textarea",
        placeholder: "Use approved logo only, maintain premium visual language, reject generic AI product renders."
      },
      {
        path: "safety.legalNotes",
        label: "Legal / policy caution notes",
        type: "textarea",
        placeholder: "Escalate medical, efficacy, or comparative claims for human review before publication."
      }
    ]
  }
];

const SETTINGS_GROUPS = [
  {
    id: "project-config",
    title: "Project Settings",
    description: "Manage project identity, publishing defaults, and reusable presets without scattering core setup across multiple cards.",
    sectionIds: ["project", "publishing", "presets"]
  },
  {
    id: "ai-automation",
    title: "AI / Automation Settings",
    description: "Control system mode, AI behavior, automation routing, and safety rules in one execution-focused workspace.",
    sectionIds: ["operating", "ai", "automation", "safety"]
  },
  {
    id: "team-permissions",
    title: "Team / Permissions",
    description: "Keep approval ownership, publishing permissions, and team-role authority together so governance stays understandable.",
    sectionIds: ["approval", "team"]
  },
  {
    id: "integration-sync",
    title: "Integration / Sync Settings",
    description: "Review connector refresh behavior, import policy, and alert routing without turning Settings into a sync control center.",
    sectionIds: ["sync", "alerts"]
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getPathValue(source, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
}

function setPathValue(target, path, value) {
  const parts = path.split(".");
  let cursor = target;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }

    if (!cursor[part] || typeof cursor[part] !== "object") {
      cursor[part] = {};
    }

    cursor = cursor[part];
  });
}

function nowIso() {
  return new Date().toISOString();
}

function extractDurableSettingsSnapshot(governancePolicy = {}, teamModel = {}) {
  const governance = asObject(governancePolicy);
  const bridge = asObject(governance.settings_bridge);
  const team = asObject(teamModel);
  const snapshot = asObject(team.settings_profile || bridge.form);
  const owners = asObject(governance.approval_owners);
  const rules = asObject(governance.policy_rules);

  if (!Object.keys(snapshot).length && !Object.keys(owners).length && !Object.keys(rules).length) {
    return null;
  }

  const normalized = clone(snapshot);
  normalized.project = {
    ...asObject(normalized.project),
    defaultCampaignMode: asString(normalized.project?.defaultCampaignMode || bridge.execution_mode)
  };
  normalized.operating = {
    ...asObject(normalized.operating),
    actionPolicy: asString(normalized.operating?.actionPolicy || bridge.action_policy)
  };
  normalized.ai = {
    ...asObject(normalized.ai),
    approvalRequiredMode: asString(normalized.ai?.approvalRequiredMode || bridge.approval_mode),
    claimSafetyMode: asString(normalized.ai?.claimSafetyMode || bridge.claim_safety_mode)
  };
  normalized.publishing = {
    ...asObject(normalized.publishing),
    approvalBeforePublish: rules.approval_before_publish ?? normalized.publishing?.approvalBeforePublish
  };
  normalized.safety = {
    ...asObject(normalized.safety),
    aiClaimCheck: rules.high_risk_claim_review_required ?? normalized.safety?.aiClaimCheck
  };
  normalized.approval = {
    ...asObject(normalized.approval),
    contentOwner: asString(normalized.approval?.contentOwner || owners.content),
    mediaOwner: asString(normalized.approval?.mediaOwner || owners.media),
    adsOwner: asString(normalized.approval?.adsOwner || owners.campaign)
  };
  normalized.team = {
    ...asObject(normalized.team),
    publishAccess: asString(normalized.team?.publishAccess || owners.publishing),
    roles: Array.isArray(normalized.team?.roles)
      ? normalized.team.roles
      : asArray(team.members).map((member) => titleCase(member.role)).filter(Boolean)
  };

  return normalized;
}

function mapSettingsToTeamPayload(form = {}) {
  return {
    active_role: "admin",
    settings_profile: clone(form),
    settings_status: {
      state: "configured",
      saved_at: nowIso(),
      source: "settings-page",
      owner_role: "admin"
    },
    project_profile: {
      project_name: asString(form.project?.projectName),
      market: asString(form.project?.market),
      language: asString(form.project?.language),
      business_type: asString(form.project?.businessType),
      website: asString(form.project?.website)
    }
  };
}

function mapSettingsToGovernancePolicy(form = {}) {
  const approval = asObject(form.approval);
  const publishing = asObject(form.publishing);
  const safety = asObject(form.safety);
  const ai = asObject(form.ai);
  const operating = asObject(form.operating);
  const project = asObject(form.project);
  const team = asObject(form.team);

  return {
    execution_policy: {
      mode: asString(project.defaultCampaignMode || operating.primaryMode),
      action_policy: asString(operating.actionPolicy)
    },
    policy_rules: {
      approval_before_publish: Boolean(publishing.approvalBeforePublish),
      high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
      brand_safety_review_required: true,
      allow_admin_override: true,
      auto_escalate_critical_risk: asString(operating.actionPolicy).toLowerCase().includes("blocked"),
      freeze_publishing: asString(operating.primaryMode) === "Emergency Safe Mode"
    },
    approval_owners: {
      content: asString(approval.contentOwner) || "Marketing lead",
      media: asString(approval.mediaOwner) || "Creative lead",
      campaign: asString(approval.adsOwner) || "Operations lead",
      publishing: asString(team.publishAccess) || "Publisher",
      compliance: "Compliance Reviewer",
      overrides: "Admin"
    },
    settings_bridge: {
      source: "settings-durable-record",
      synced_at: nowIso(),
      approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
      claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
      execution_mode: asString(project.defaultCampaignMode || operating.primaryMode),
      action_policy: asString(operating.actionPolicy),
      form: clone(form)
    }
  };
}

function marketDefaults(market) {
  const normalized = String(market || "").toLowerCase();

  if (normalized.includes("german")) {
    return { currency: "EUR", timezone: "Europe/Berlin", language: "German" };
  }

  if (normalized.includes("united states")) {
    return { currency: "USD", timezone: "America/New_York", language: "English" };
  }

  if (normalized.includes("united kingdom")) {
    return { currency: "GBP", timezone: "Europe/London", language: "English" };
  }

  if (normalized.includes("uae")) {
    return { currency: "AED", timezone: "Asia/Dubai", language: "Arabic" };
  }

  return { currency: "EUR", timezone: "UTC", language: "English" };
}

function normalizeLanguage(value, fallback = "English") {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "de" || normalized === "german") return "German";
  if (normalized === "en" || normalized === "english") return "English";
  if (normalized === "ar" || normalized === "arabic") return "Arabic";
  if (normalized === "fr" || normalized === "french") return "French";

  return fallback;
}

function normalizeMode(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "planning" || normalized === "planning mode") return "Planning Mode";
  if (normalized === "guided" || normalized === "guided execution") return "Guided Execution";
  if (normalized === "semi_auto" || normalized === "semi auto" || normalized === "semi-auto") return "Semi-Auto";
  if (normalized === "approval_first" || normalized === "approval first" || normalized === "approval-first") return "Approval-First";
  if (normalized === "full_auto" || normalized === "full auto" || normalized === "full-auto" || normalized === "full ai assist") return "Full AI Assist";
  if (normalized === "emergency safe mode" || normalized === "safe mode") return "Emergency Safe Mode";

  return "Semi-Auto";
}

function mergeSettings(defaults, storedForm) {
  const merged = clone(defaults);

  Object.keys(asObject(storedForm)).forEach((sectionId) => {
    merged[sectionId] = {
      ...asObject(merged[sectionId]),
      ...asObject(storedForm[sectionId])
    };
  });

  return merged;
}

function inferChannels(connectors) {
  const checks = asObject(connectors?.readiness?.checks);
  const items = [];

  if (checks.instagram) items.push("Instagram");
  if (checks.facebook) items.push("Facebook");
  if (checks.tiktok) items.push("TikTok");
  if (checks.youtube) items.push("YouTube");
  if (checks.website) items.push("Website");
  if (checks.amazon) items.push("Amazon");

  return items.length ? items : ["Instagram", "Website", "Email"];
}

function buildDefaultSettings(state) {
  const overview = asObject(state?.data?.overview?.overview);
  const connectors = asObject(state?.data?.integrations);
  const projectName = state?.context?.currentProject || overview.project_name || "";
  const market = titleCase(state?.context?.currentMarket || overview.market || "Germany");
  const defaults = marketDefaults(market);
  const language = normalizeLanguage(state?.context?.currentLanguage || overview.language, defaults.language);
  const executionMode = normalizeMode(overview.execution_mode || state?.context?.executionMode || "semi_auto");
  const businessType = String(overview.project_type || "ecommerce")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

  return {
    project: {
      projectName,
      brandName: titleCase(projectName || "Project"),
      market,
      language,
      currency: defaults.currency,
      timezone: defaults.timezone,
      website: overview.website_url || "",
      defaultCampaignMode: executionMode || "Semi-Auto",
      businessType
    },
    operating: {
      primaryMode: executionMode || "Semi-Auto",
      actionPolicy:
        executionMode === "Full AI Assist"
          ? "Act unless blocked by policy"
          : executionMode === "Planning Mode"
            ? "Recommend only"
            : "Prepare actions with review",
      emergencyOwner: "Admin",
      modeNotes: "Use stronger automation only when approvals, assets, and governance settings are complete."
    },
    ai: {
      tone: "Premium expert",
      responseStyle: "Structured concise",
      generationStrictness: "Strict",
      approvalRequiredMode: "Only high-risk",
      creativitySafetyBalance: "Balanced",
      claimSafetyMode: "Strict evidence required",
      contentGenerationDefaults: "Respect project language, protect brand truth, and optimize for campaign execution clarity.",
      mediaGenerationDefaults: "Use approved brand cues only, preserve real product identity, and avoid invented packaging."
    },
    automation: {
      enabledRules: [
        "Suggest workflows when campaign is ready",
        "Block publishing when assets are missing",
        "Alert when integrations fail",
        "Route SEO issues into Research/Workflows"
      ],
      readinessThreshold: "Medium and above",
      failurePolicy: "Pause and alert",
      routingNotes: "Push readiness gaps into workflows, route SEO findings into Research, and send weak ads to Ads Manager."
    },
    publishing: {
      channels: inferChannels(connectors),
      schedulingBehavior: "Queue for review",
      approvalBeforePublish: true,
      namingConvention: "market_campaign_channel_assettype_v1",
      contentRouting: "Route launch content to social and email, evergreen content to website, and paid hooks to ads review.",
      campaignOutputs: ["Organic posts", "Reels", "Landing pages", "Email sequence"]
    },
    approval: {
      contentOwner: "Marketing lead",
      mediaOwner: "Creative lead",
      adsOwner: "Growth lead",
      requirements: ["Paid ads", "Medical or product claims", "New campaign launches", "AI-generated media"],
      revisionRules: "Reject unsupported claims, brand drift, weak hooks, or missing metadata. Two revisions escalate to the owner.",
      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
    },
    team: {
      roles: ["Strategist", "Writer", "Designer", "Publisher", "Analyst", "Compliance Reviewer", "Admin", "Brand owner"],
      serviceCoverage: ["Strategy", "Writing", "Design", "Publishing", "Analytics", "Compliance", "Administration"],
      editAccess: "Strategists, writers, and designers",
      publishAccess: "Publishers and admins",
      approveAccess: "Compliance reviewers and admins",
      integrationAccess: "Admins only",
      defaultsAccess: "Admins only",
      roleMatrix: {
        strategist: {
          authority: "Create and edit",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        writer: {
          authority: "Create and edit",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        designer: {
          authority: "Create and edit",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        videoLead: {
          authority: "Create and edit",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        publisher: {
          authority: "Publish",
          canApprove: false,
          canPublish: true,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        adsOperator: {
          authority: "Create and edit",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        analyst: {
          authority: "Assist only",
          canApprove: false,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        complianceReviewer: {
          authority: "Approve",
          canApprove: true,
          canPublish: false,
          canManageIntegrations: false,
          canChangeDefaults: false
        },
        admin: {
          authority: "Admin control",
          canApprove: true,
          canPublish: true,
          canManageIntegrations: true,
          canChangeDefaults: true
        }
      }
    },
    presets: {
      campaignPreset: "Launch sprint",
      contentPreset: "Hook-first social",
      mediaPreset: "Premium product studio",
      seoPreset: "Opportunity sprint",
      adsPreset: "Hook test set",
      approvalPreset: "Balanced launch control",
      presetNotes: "Use presets as reusable starting systems, not as rigid templates when project context changes."
    },
    sync: {
      autoSync: true,
      frequency: "Every 6 hours",
      importHistoryPreference: "Last 90 days",
      retryFailedBehavior: "Retry twice then alert",
      healthCheckFrequency: "Hourly",
      refreshDefaults: "Refresh integrations before daily review, before launch, and after connector failures."
    },
    alerts: {
      enabledRules: [
        "Sync failure alerts",
        "Approval pending alerts",
        "Provider disconnect alerts",
        "Claim safety alerts"
      ],
      deliveryMode: "In-app + email",
      alertCadence: "Immediate only",
      notificationNotes: "Escalate provider disconnects and claim safety alerts immediately; batch lower-risk completions."
    },
    safety: {
      aiClaimCheck: true,
      productTruthRules: "Never invent benefits, ingredients, certifications, packaging, or before-and-after outcomes.",
      prohibitedOutputs: "No fake testimonials, fake claims, altered packaging, counterfeit logos, or unsupported medical positioning.",
      complianceAlerts: "Alert on regulated claims, platform policy conflicts, and high-risk launch copy.",
      brandProtectionRules: "Use approved brand tone and assets only. Preserve premium visual quality and real product visibility.",
      legalNotes: "Human review is mandatory for efficacy, comparative, or market-regulated claims."
    }
  };
}

function ensureSession(state) {
  const projectName = state?.context?.currentProject || "default";
  const defaults = buildDefaultSettings(state);
  const existing = sessions.get(projectName);

  if (existing) {
    existing.defaults = defaults;
    existing.projectName = projectName;
    return existing;
  }

  const session = {
    projectName,
    defaults,
    form: clone(defaults),
    dirty: false,
    savedAt: null,
    saveMode: "durable-pending",
    loaded: false,
    loading: false,
    error: "",
    teamModel: null,
    governancePolicy: null
  };

  sessions.set(projectName, session);
  return session;
}

async function loadDurableSettings(session, state, rerender) {
  if (!session.projectName || session.loading) return;

  session.loading = true;
  session.error = "";
  rerender();

  try {
    const [teamResult, governanceResult] = await Promise.allSettled([
      fetchProjectTeam(session.projectName),
      fetchProjectGovernancePolicy(session.projectName)
    ]);

    session.teamModel = teamResult.status === "fulfilled" ? asObject(teamResult.value?.team || teamResult.value) : null;
    session.governancePolicy = governanceResult.status === "fulfilled" ? asObject(governanceResult.value?.policy || governanceResult.value) : null;

    const durableSnapshot = extractDurableSettingsSnapshot(session.governancePolicy, session.teamModel);
    if (durableSnapshot && !session.dirty) {
      session.form = mergeSettings(buildDefaultSettings(state), durableSnapshot);
      session.savedAt =
        session.governancePolicy?.updated_at ||
        session.teamModel?.settings_status?.saved_at ||
        session.teamModel?.updated_at ||
        null;
      session.saveMode = "durable";
    }

    session.loaded = true;
  } catch (error) {
    session.error = error.message || "Failed to load durable settings.";
  } finally {
    session.loading = false;
    rerender();
  }
}

function formatRelativeTime(value) {
  if (!value) return "Not saved yet";

  const timestamp = typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Not saved yet";

  const delta = Date.now() - timestamp;
  const minutes = Math.round(delta / 60000);

  if (minutes <= 1) return "Saved just now";
  if (minutes < 60) return `Saved ${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Saved ${hours} hr ago`;

  const days = Math.round(hours / 24);
  return `Saved ${days} day${days === 1 ? "" : "s"} ago`;
}

function buildReadinessModel(session, summary) {
  const form = session.form;
  const hasRisks = summary.risks.length > 0;
  const approvalOwnersReady = Boolean(form.approval.contentOwner && form.approval.mediaOwner && form.approval.adsOwner);
  const publishingReady = Array.isArray(form.publishing.channels) && form.publishing.channels.length > 0 && Boolean(form.publishing.approvalBeforePublish);
  const aiSafetyReady = Boolean(form.safety.aiClaimCheck) && !String(form.ai.claimSafetyMode || "").toLowerCase().includes("relaxed");
  const integrationReady = Boolean(form.sync.frequency && Array.isArray(form.alerts.enabledRules) && form.alerts.enabledRules.length);

  const checks = [
    {
      label: "Governance and approvals",
      ready: approvalOwnersReady,
      helper: approvalOwnersReady
        ? "Ownership is defined for content, media, and ads decisions."
        : "Assign approval owners to avoid ambiguous review authority."
    },
    {
      label: "Publishing and release safety",
      ready: publishingReady,
      helper: publishingReady
        ? "Channels are selected and approval-before-publish is active."
        : "Select channels and confirm approval-before-publish before launch."
    },
    {
      label: "AI and policy safety",
      ready: aiSafetyReady,
      helper: aiSafetyReady
        ? "Claim checks and safety posture are configured for controlled AI use."
        : "Tighten claim safety mode and enable AI claim checks."
    },
    {
      label: "Integrations and operations alerts",
      ready: integrationReady,
      helper: integrationReady
        ? "Sync cadence and alert routing are defined for operations visibility."
        : "Set sync cadence and alert coverage so operations can intervene safely."
    }
  ];

  const nextBestAction = hasRisks
    ? "Review the top blocker, fix it in this page, then save to sync durable governance and team records."
    : "Save this configuration, then open Governance to verify policy impact and approval readiness.";

  return {
    checks,
    blockers: summary.risks,
    blockerCount: summary.risks.length,
    readyCount: checks.filter((item) => item.ready).length,
    nextBestAction
  };
}

function collectRisks(form) {
  const risks = [];

  if (!form.project.projectName || !form.project.website || !form.project.businessType) {
    risks.push("Project identity is incomplete, which weakens routing, summaries, and downstream defaults.");
  }

  if (!Array.isArray(form.publishing.channels) || !form.publishing.channels.length) {
    risks.push("No default publishing channels are selected, so campaign output cannot route automatically.");
  }

  if (!form.approval.contentOwner || !form.approval.mediaOwner || !form.approval.adsOwner) {
    risks.push("Approval ownership is incomplete, which creates ambiguity for reviews and launch decisions.");
  }

  if (!Array.isArray(form.approval.requirements) || !form.approval.requirements.length) {
    risks.push("Human approval triggers are missing, which increases the chance of unsupervised high-risk output.");
  }

  if (!form.operating.primaryMode || !form.operating.actionPolicy) {
    risks.push("Operating mode controls are incomplete, so system behavior may drift between planning, execution, and safe mode.");
  }

  if (!Array.isArray(form.automation.enabledRules) || !form.automation.enabledRules.length) {
    risks.push("Automation rules are not configured, so routing, blocking, and recovery behavior may be inconsistent.");
  }

  if (!form.safety.aiClaimCheck || String(form.ai.claimSafetyMode).toLowerCase().includes("relaxed")) {
    risks.push("Claim safety is weakened, so unsupported product or compliance claims may slip into drafts.");
  }

  if (!form.team.publishAccess || !form.team.defaultsAccess) {
    risks.push("Permission boundaries are not fully defined for publish access or system-default changes.");
  }

  if (!Array.isArray(form.alerts.enabledRules) || !form.alerts.enabledRules.length) {
    risks.push("Alert rules are missing, which reduces visibility into sync failures, approval delays, and provider issues.");
  }

  return risks;
}

function buildSummary(session) {
  const form = session.form;

  return {
    projectMode: `${form.operating.primaryMode} • ${form.project.businessType}`,
    aiMode: `${form.ai.tone} • ${form.ai.generationStrictness}`,
    approvalMode: `${form.ai.approvalRequiredMode} • ${form.approval.requirements.length} human triggers`,
    publishingMode: `${form.publishing.schedulingBehavior} • ${form.publishing.channels.length} channels`,
    syncMode: `${form.sync.autoSync ? "Auto sync" : "Manual sync"} • ${form.sync.frequency}`,
    risks: collectRisks(form)
  };
}

function renderOptions(options, selectedValue, escapeHtml) {
  return options
    .map((option) => {
      const item = typeof option === "string" ? { value: option, label: option } : option;
      const selected = item.value === selectedValue ? " selected" : "";
      return `<option value="${escapeHtml(item.value)}"${selected}>${escapeHtml(item.label)}</option>`;
    })
    .join("");
}

function renderField(field, value, escapeHtml) {
  const fieldId = field.path.replace(/\./g, "-");
  const requiredMark = field.critical ? '<span class="settings-required">Critical</span>' : "";

  if (field.type === "card-select") {
    return `
      <div class="settings-field-block settings-field-block-span-2">
        <label class="settings-field-label">${escapeHtml(field.label)} ${requiredMark}</label>
        <div class="settings-choice-grid">
          ${(field.options || [])
            .map((option, index) => {
              const item = typeof option === "string" ? { value: option, label: option, description: "" } : option;
              const checked = item.value === value ? "checked" : "";
              const optionId = `${fieldId}-${index}`;

              return `
                <label class="settings-choice-card">
                  <input
                    id="${optionId}"
                    type="radio"
                    name="${fieldId}"
                    value="${escapeHtml(item.value)}"
                    data-setting-path="${escapeHtml(field.path)}"
                    ${checked}
                  />
                  <span class="settings-choice-card-body">
                    <strong>${escapeHtml(item.label)}</strong>
                    <small>${escapeHtml(item.description || "")}</small>
                  </span>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  if (field.type === "toggle") {
    return `
      <label class="settings-toggle" for="${fieldId}">
        <span>
          <span class="settings-field-label">${escapeHtml(field.label)} ${requiredMark}</span>
        </span>
        <input
          id="${fieldId}"
          type="checkbox"
          class="settings-toggle-input"
          data-setting-path="${escapeHtml(field.path)}"
          ${value ? "checked" : ""}
        />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
    `;
  }

  if (field.type === "checklist") {
    const selected = Array.isArray(value) ? value : [];

    return `
      <div class="settings-field-block">
        <label class="settings-field-label">${escapeHtml(field.label)} ${requiredMark}</label>
        <div class="settings-checklist">
          ${field.options
            .map((option) => {
              const item = typeof option === "string" ? { value: option, label: option } : option;
              const checked = selected.includes(item.value) ? "checked" : "";

              return `
                <label class="settings-chip">
                  <input
                    type="checkbox"
                    data-setting-path="${escapeHtml(field.path)}"
                    value="${escapeHtml(item.value)}"
                    ${checked}
                  />
                  <span>${escapeHtml(item.label)}</span>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div class="settings-field-block">
        <label class="settings-field-label" for="${fieldId}">${escapeHtml(field.label)} ${requiredMark}</label>
        <textarea
          id="${fieldId}"
          class="settings-control settings-textarea"
          data-setting-path="${escapeHtml(field.path)}"
          placeholder="${escapeHtml(field.placeholder || "")}"
        >${escapeHtml(value || "")}</textarea>
      </div>
    `;
  }

  if (field.type === "select") {
    return `
      <div class="settings-field-block">
        <label class="settings-field-label" for="${fieldId}">${escapeHtml(field.label)} ${requiredMark}</label>
        <select id="${fieldId}" class="settings-control" data-setting-path="${escapeHtml(field.path)}">
          ${renderOptions(field.options || [], value || "", escapeHtml)}
        </select>
      </div>
    `;
  }

  return `
    <div class="settings-field-block">
      <label class="settings-field-label" for="${fieldId}">${escapeHtml(field.label)} ${requiredMark}</label>
      <input
        id="${fieldId}"
        class="settings-control"
        type="${field.type || "text"}"
        value="${escapeHtml(value || "")}"
        placeholder="${escapeHtml(field.placeholder || "")}"
        data-setting-path="${escapeHtml(field.path)}"
      />
    </div>
  `;
}

function renderRoleMatrix(session, escapeHtml) {
  return `
    <div class="settings-role-matrix">
      <div class="settings-role-matrix-head">
        <h4>Team services / role matrix</h4>
        <p>Set explicit operating authority for each service lane without leaving the Settings control center.</p>
      </div>
      <div class="settings-role-grid">
        ${TEAM_ROLE_MATRIX.map((role) => {
          const config = asObject(getPathValue(session.form, `team.roleMatrix.${role.id}`));

          return `
            <div class="settings-role-card">
              <div class="settings-role-card-head">
                <div>
                  <strong>${escapeHtml(role.label)}</strong>
                  <span>${escapeHtml(role.service)}</span>
                </div>
              </div>
              <p class="settings-role-description">${escapeHtml(role.description)}</p>
              <div class="settings-role-card-grid">
                <div class="settings-field-block">
                  <label class="settings-field-label" for="team-role-${role.id}-authority">Authority</label>
                  <select
                    id="team-role-${role.id}-authority"
                    class="settings-control"
                    data-setting-path="team.roleMatrix.${escapeHtml(role.id)}.authority"
                  >
                    ${renderOptions(
                      [
                        "No access",
                        "Assist only",
                        "Create and edit",
                        "Approve",
                        "Publish",
                        "Admin control"
                      ],
                      config.authority || "Assist only",
                      escapeHtml
                    )}
                  </select>
                </div>
                <label class="settings-toggle settings-toggle-compact" for="team-role-${role.id}-approve">
                  <span class="settings-field-label">Can approve</span>
                  <input
                    id="team-role-${role.id}-approve"
                    type="checkbox"
                    class="settings-toggle-input"
                    data-setting-path="team.roleMatrix.${escapeHtml(role.id)}.canApprove"
                    ${config.canApprove ? "checked" : ""}
                  />
                  <span class="settings-toggle-pill" aria-hidden="true"></span>
                </label>
                <label class="settings-toggle settings-toggle-compact" for="team-role-${role.id}-publish">
                  <span class="settings-field-label">Can publish</span>
                  <input
                    id="team-role-${role.id}-publish"
                    type="checkbox"
                    class="settings-toggle-input"
                    data-setting-path="team.roleMatrix.${escapeHtml(role.id)}.canPublish"
                    ${config.canPublish ? "checked" : ""}
                  />
                  <span class="settings-toggle-pill" aria-hidden="true"></span>
                </label>
                <label class="settings-toggle settings-toggle-compact" for="team-role-${role.id}-integrations">
                  <span class="settings-field-label">Manage integrations</span>
                  <input
                    id="team-role-${role.id}-integrations"
                    type="checkbox"
                    class="settings-toggle-input"
                    data-setting-path="team.roleMatrix.${escapeHtml(role.id)}.canManageIntegrations"
                    ${config.canManageIntegrations ? "checked" : ""}
                  />
                  <span class="settings-toggle-pill" aria-hidden="true"></span>
                </label>
                <label class="settings-toggle settings-toggle-compact" for="team-role-${role.id}-defaults">
                  <span class="settings-field-label">Change defaults</span>
                  <input
                    id="team-role-${role.id}-defaults"
                    type="checkbox"
                    class="settings-toggle-input"
                    data-setting-path="team.roleMatrix.${escapeHtml(role.id)}.canChangeDefaults"
                    ${config.canChangeDefaults ? "checked" : ""}
                  />
                  <span class="settings-toggle-pill" aria-hidden="true"></span>
                </label>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderSectionExtension(section, session, escapeHtml) {
  if (section.id === "team") {
    return renderRoleMatrix(session, escapeHtml);
  }

  return "";
}

function getSectionDefinition(sectionId) {
  return SECTION_DEFINITIONS.find((section) => section.id === sectionId) || null;
}

function buildSettingsPrompts(session) {
  const summary = buildSummary(session);
  const projectLabel = session.projectName || "this project";
  const topRisk = summary.risks[0] || "the biggest current configuration gap";
  return [
    {
      label: "Summarize settings",
      preview: "Explain the current project, AI, approval, publishing, and sync posture in one concise review.",
      prompt: `Summarize the current settings for ${projectLabel}. Cover project defaults, AI behavior, approvals, permissions, integrations, sync posture, and the main configuration tradeoffs.`
    },
    {
      label: "Find highest-risk gap",
      preview: "Identify the most important settings gap and the safest next fix.",
      prompt: `Review the current settings for ${projectLabel}. Identify the highest-risk configuration gap, starting with ${topRisk}, and explain the safest next fix.`
    },
    {
      label: "Recommend automation posture",
      preview: "Advise on AI and automation settings based on current risk and approval posture.",
      prompt: `Review the AI, automation, safety, approval, and sync settings for ${projectLabel}. Recommend the best operating posture and what should be tightened or relaxed next.`
    }
  ];
}

function renderGroupedSection(group, session, escapeHtml) {
  const definitions = group.sectionIds.map(getSectionDefinition).filter(Boolean);

  return `
    <article class="settings-section panel" id="settings-group-${group.id}">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Configuration group</div>
          <h3>${escapeHtml(group.title)}</h3>
          <p class="settings-section-copy">${escapeHtml(group.description)}</p>
        </div>
      </div>
      <div class="settings-group-grid">
        ${definitions.map((section) => `
          <div class="settings-group-block" id="settings-section-${section.id}">
            <div class="settings-group-head">
              <div>
                <h4>${escapeHtml(section.title)}</h4>
                <p>${escapeHtml(section.description)}</p>
              </div>
              <span class="settings-badge">${escapeHtml(section.backendLabel)}</span>
            </div>
            <div class="settings-fields-grid">
              ${section.fields
                .map((field) => renderField(field, getPathValue(session.form, field.path), escapeHtml))
                .join("")}
            </div>
            ${renderSectionExtension(section, session, escapeHtml)}
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderSettingsOverview(summary, session, escapeHtml) {
  const readiness = buildReadinessModel(session, summary);
  const riskItems = readiness.blockers.length
    ? readiness.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
    : `<li>No active blockers are visible from current Settings signals.</li>`;

  return `
    <section class="panel settings-overview std-detail-card mhos-clean-surface">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Settings operating surface</div>
          <h3>Launch configuration for ${escapeHtml(session.projectName || "this project")}</h3>
          <p class="settings-section-copy">Settings defines durable defaults for Governance, Publishing, AI, Integrations, and Operations. Backend remains the authority for enforcement.</p>
        </div>
        <span class="card-badge neutral">${escapeHtml(session.saveMode === "durable" ? "Durable backbone" : session.loading ? "Syncing..." : "Durable pending")}</span>
      </div>
      <div class="settings-overview-grid">
        <div class="settings-overview-item">
          <span>Project mode</span>
          <strong>${escapeHtml(summary.projectMode)}</strong>
        </div>
        <div class="settings-overview-item">
          <span>AI mode</span>
          <strong>${escapeHtml(summary.aiMode)}</strong>
        </div>
        <div class="settings-overview-item">
          <span>Approval mode</span>
          <strong>${escapeHtml(summary.approvalMode)}</strong>
        </div>
        <div class="settings-overview-item">
          <span>Publishing mode</span>
          <strong>${escapeHtml(summary.publishingMode)}</strong>
        </div>
        <div class="settings-overview-item">
          <span>Sync mode</span>
          <strong>${escapeHtml(summary.syncMode)}</strong>
        </div>
        <div class="settings-overview-item">
          <span>Save status</span>
          <strong>${escapeHtml(formatRelativeTime(session.savedAt))}</strong>
        </div>
      </div>

      <div class="settings-risk-panel">
        <div class="settings-risk-head">
          <h4>Readiness and blockers</h4>
          <span class="card-badge ${readiness.blockerCount ? "danger" : "success"}">
            ${escapeHtml(`${readiness.readyCount}/${readiness.checks.length} ready`)}
          </span>
        </div>
        <div class="governance-rule-list">
          ${readiness.checks.map((item) => `
            <div class="governance-rule-item">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(item.ready ? "Ready" : "Needs review")}</span>
            </div>
          `).join("")}
        </div>
        <ul class="simple-list settings-risk-list">${riskItems}</ul>
      </div>

      <div class="governance-policy-block">
        <h4>Next best action</h4>
        <p class="governance-copy">${escapeHtml(readiness.nextBestAction)}</p>
        <div class="settings-actions-buttons std-action-row">
          <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="approval">Review approvals</button>
          <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="publishing">Review publishing</button>
          <button class="btn btn-secondary" type="button" data-settings-open-ai>Ask AI for guidance</button>
        </div>
      </div>
    </section>
  `;
}

function renderSettingsAssistant(session, escapeHtml) {
  const prompts = buildSettingsPrompts(session);
  return `
    <section class="panel settings-ai-assistant std-ai-panel mhos-clean-surface">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Settings AI assistant</div>
          <h3>Analyze configuration, then execute in controlled paths</h3>
          <p class="settings-section-copy">AI provides context and recommendations. Durable changes happen only through explicit Settings and Governance actions.</p>
        </div>
      </div>
      <div class="simple-banner">
        <strong>AI context scope:</strong> configuration readiness, approval ownership, publishing safety, AI posture, and operations routing.
      </div>
      <div class="settings-toolbar">
        <button class="btn btn-secondary" type="button" data-settings-open-ai>Open AI: Review in AI Workspace</button>
      </div>
      <div class="quick-actions std-quick-actions">
        ${prompts.map((item, index) => `
          <button class="quick-action-btn" type="button" data-settings-ai-prompt="${index}">
            <span class="home-action-title">${escapeHtml(item.label)}</span>
            <span class="home-action-meta">${escapeHtml(item.preview)}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSection(section, session, escapeHtml) {
  return `
    <article class="settings-section panel" id="settings-section-${section.id}">
      <div class="panel-header settings-section-header">
        <div>
          <div class="panel-kicker">Operational ${escapeHtml(section.id)}</div>
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.description)}</p>
        </div>
        <div class="settings-section-meta">
          <span class="settings-badge">${escapeHtml(section.backendLabel)}</span>
          <button class="btn btn-secondary" type="button" data-settings-action="reset-section" data-section-id="${escapeHtml(section.id)}">
            Reset Section
          </button>
        </div>
      </div>
      <div class="settings-fields-grid">
        ${section.fields
          .map((field) => renderField(field, getPathValue(session.form, field.path), escapeHtml))
          .join("")}
      </div>
      ${renderSectionExtension(section, session, escapeHtml)}
    </article>
  `;
}

function renderSummary(summary, session, escapeHtml) {
  const relationships = [
    {
      title: "Governance",
      detail: "Approval ownership, policy rules, and settings bridge state are written into the durable governance policy."
    },
    {
      title: "Publishing",
      detail: "Channel defaults, scheduling behavior, and approval-before-publish shape outbound execution safety."
    },
    {
      title: "AI",
      detail: "Tone, strictness, claim safety, and approval-required mode define AI operating boundaries."
    },
    {
      title: "Integrations and operations",
      detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
    }
  ];

  return `
    <aside class="settings-summary panel std-detail-card mhos-clean-surface">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Cross-page operating impact</div>
          <h3>How Settings drives other operating surfaces</h3>
          <p>Use this map to understand where configuration choices influence runtime behavior across MH-OS.</p>
        </div>
      </div>

      <div class="governance-rule-list">
        ${relationships.map((item) => `
          <div class="governance-rule-item">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </div>
        `).join("")}
      </div>

      <div class="settings-summary-grid">
        <div class="data-card">
          <span class="data-label">Current project mode</span>
          <strong>${escapeHtml(summary.projectMode)}</strong>
        </div>
        <div class="data-card">
          <span class="data-label">AI mode</span>
          <strong>${escapeHtml(summary.aiMode)}</strong>
        </div>
        <div class="data-card">
          <span class="data-label">Approval mode</span>
          <strong>${escapeHtml(summary.approvalMode)}</strong>
        </div>
        <div class="data-card">
          <span class="data-label">Publishing mode</span>
          <strong>${escapeHtml(summary.publishingMode)}</strong>
        </div>
        <div class="data-card">
          <span class="data-label">Sync mode</span>
          <strong>${escapeHtml(summary.syncMode)}</strong>
        </div>
        <div class="data-card">
          <span class="data-label">Persistence</span>
          <strong>${escapeHtml(session.saveMode === "durable" ? "Durable backbone" : session.loading ? "Syncing..." : "Durable pending")}</strong>
        </div>
      </div>

      <div class="simple-banner">
        <strong>Status:</strong> ${escapeHtml(formatRelativeTime(session.savedAt))}. Save updates durable team and governance records; backend enforcement remains authoritative.
      </div>
      <div class="settings-actions-buttons std-action-row">
        <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="operating">Open operating mode</button>
        <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="sync">Open sync policy</button>
        <button class="btn btn-secondary" type="button" data-settings-action="open-governance">Open Governance page</button>
      </div>
    </aside>
  `;
}

function renderActions(session, escapeHtml) {
  const dirtyText = session.dirty ? "Unsaved changes" : "All changes captured";

  return `
    <section class="settings-actions panel std-action-panel mhos-clean-surface">
      <div class="panel-header">
        <div class="settings-actions-copy">
          <div class="panel-kicker">Settings actions</div>
          <h3>Execute safe configuration updates</h3>
          <p>${escapeHtml(dirtyText)}. Saving writes this configuration into durable team and governance records used across the operating system.</p>
        </div>
      </div>
      <div class="simple-banner">
        <strong>Safe execution path:</strong> Review readiness and blockers, update the required section, save once, then validate Governance impact.
      </div>
      <div class="settings-actions-buttons std-action-row">
        <button class="btn btn-primary" type="button" data-settings-action="save-all">Save Settings</button>
        <button class="btn btn-secondary" type="button" data-settings-action="review-critical">Review Critical Settings</button>
        <button class="btn btn-secondary" type="button" data-settings-action="restore-defaults">Restore Defaults</button>
      </div>
      <div class="settings-actions-buttons std-action-row">
        <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="project">Project defaults</button>
        <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="team">Team permissions</button>
        <button class="btn btn-secondary" type="button" data-settings-action="focus-section" data-section-id="safety">Safety and governance</button>
      </div>
    </section>
  `;
}

function buildPageMarkup(session, escapeHtml) {
  const summary = buildSummary(session);

  return `
    <section class="page is-active" data-page="settings">
      <div class="settings-page-surface">
        <div class="settings-workspace-grid">
          <div class="settings-main-stack std-main-column mhos-clean-stack">
            ${renderSettingsOverview(summary, session, escapeHtml)}
            ${SETTINGS_GROUPS.map((group) => renderGroupedSection(group, session, escapeHtml)).join("")}
          </div>
          <aside class="settings-right-rail std-right-rail mhos-clean-stack">
            ${renderSummary(summary, session, escapeHtml)}
            ${renderActions(session, escapeHtml)}
            ${renderSettingsAssistant(session, escapeHtml)}
          </aside>
        </div>
      </div>
    </section>
  `;
}

function refreshSummary(root, session, escapeHtml) {
  const overviewHost = root.querySelector(".settings-overview");
  if (overviewHost) {
    overviewHost.outerHTML = renderSettingsOverview(buildSummary(session), session, escapeHtml);
  }
  const summaryHost = root.querySelector(".settings-summary");
  if (summaryHost) {
    summaryHost.outerHTML = renderSummary(buildSummary(session), session, escapeHtml);
  }
  const aiHost = root.querySelector(".settings-ai-assistant");
  if (aiHost) {
    aiHost.outerHTML = renderSettingsAssistant(session, escapeHtml);
  }
}

function refreshActionState(root, session) {
  const intro = root.querySelector(".settings-actions-copy p");
  if (intro) {
    intro.textContent = session.dirty
      ? "Unsaved changes are present. Saving will update the shared durable governance and team records."
      : "All changes captured. The shared durable governance and team records are in sync.";
  }
}

function replacePage(context, session) {
  const root = context.$("pageRoot");
  if (!root) return;

  root.innerHTML = buildPageMarkup(session, context.escapeHtml);
}

function bindSettingsActionButtons(context, session) {
  const root = context.$("pageRoot");
  if (!root) return;

  root.querySelectorAll("[data-settings-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.settingsAction;
      const sectionId = button.dataset.sectionId;

      if (action === "save-all") {
        try {
          const governancePayload = mapSettingsToGovernancePolicy(session.form);
          const teamPayload = mapSettingsToTeamPayload(session.form);

          const confirmed = window.confirm("Confirm settings save\n\nAction: Save team and governance settings for this project.\nRisk: These settings can affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable settings update.\n\nSelect Cancel to review the settings before saving.");
          if (!confirmed) {
            return;
          }

          await Promise.all([
            saveProjectTeam(session.projectName, teamPayload),
            updateProjectGovernancePolicy(session.projectName, {
              actor: "settings-page",
              ...governancePayload
            })
          ]);

          await context.createProjectHandoff?.(session.projectName, {
            source_page: "settings",
            destination_page: "governance",
            source_role: "admin",
            destination_role: "compliance_reviewer",
            source_service_domain: "system",
            destination_service_domain: "governance",
            linked_entity: {
              entity_type: "governance_policy",
              entity_id: "default",
              route: "governance",
              label: "Governance policy"
            },
            payload: {
              summary: "Settings updated the shared durable operating policy.",
              draft_context: {
                projectName: session.projectName,
                saveMode: "durable",
                riskCount: buildSummary(session).risks.length
              }
            }
          });

          session.savedAt = nowIso();
          session.saveMode = "durable";
          session.governancePolicy = governancePayload;
          session.teamModel = {
            ...asObject(session.teamModel),
            ...teamPayload
          };
          session.dirty = false;
          refreshSummary(root, session, context.escapeHtml);
          refreshActionState(root, session);
          await context.reloadProjectData?.(session.projectName);
          context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
        } catch (error) {
          context.showError(error.message || "Failed to save durable settings.");
        }
        return;
      }

      if (action === "restore-defaults") {
        session.form = clone(session.defaults);
        session.dirty = true;
        replacePage(context, session);
        bindFormEvents(context, session);
        context.showMessage("Default settings restored for this project. Review and save when ready.");
        return;
      }

      if (action === "reset-section" && sectionId) {
        session.form[sectionId] = clone(session.defaults[sectionId]);
        session.dirty = true;
        replacePage(context, session);
        bindFormEvents(context, session);
        context.showMessage(`${titleCase(sectionId)} settings reset to defaults.`);
        return;
      }

      if (action === "focus-section" && sectionId) {
        const target = context.$(`settings-section-${sectionId}`) || context.$(`settings-group-${sectionId}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        context.showMessage(`Focused ${titleCase(sectionId)} settings.`);
        return;
      }

      if (action === "open-governance") {
        context.navigateTo("governance");
        return;
      }

      if (action === "review-critical") {
        const summary = buildSummary(session);
        if (summary.risks.length) {
          const firstSection = SECTION_DEFINITIONS.find((section) =>
            section.fields.some((field) => field.critical)
          );
          context.$(`settings-section-${firstSection?.id || "project"}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          context.showError("Critical settings still need review. The summary panel shows the current risk list.");
        } else {
          context.showMessage("Critical settings look complete. You can save this configuration whenever you’re ready.");
        }
      }
    });
  });
}

function bindSettingsAiButtons(context, session) {
  const root = context.$("pageRoot");
  if (!root) return;

  root.querySelectorAll("[data-settings-open-ai]").forEach((button) => {
    button.addEventListener("click", () => {
      context.navigateTo("ai-command");
    });
  });

  root.querySelectorAll("[data-settings-ai-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = buildSettingsPrompts(session)[Number(button.dataset.settingsAiPrompt)];
      if (!prompt) return;
      const input = context.$("quickCommandInput");
      if (input) {
        input.value = prompt.prompt;
      }
      context.navigateTo("ai-command");
      context.showMessage("Settings prompt added to AI Command.");
    });
  });
}

function bindFormEvents(context, session) {
  const root = context.$("pageRoot");
  if (!root) return;

  root.querySelectorAll("[data-setting-path]").forEach((control) => {
    const eventName =
      control.tagName === "TEXTAREA" || (control.tagName === "INPUT" && !["checkbox", "radio"].includes(control.type))
        ? "input"
        : "change";

    control.addEventListener(eventName, () => {
      const path = control.dataset.settingPath;
      if (!path) return;

      if (control.type === "checkbox" && control.closest(".settings-checklist")) {
        const checkedValues = Array.from(
          root.querySelectorAll(`input[type="checkbox"][data-setting-path="${path}"]:checked`)
        ).map((item) => item.value);
        setPathValue(session.form, path, checkedValues);
      } else if (control.type === "radio") {
        if (!control.checked) return;
        setPathValue(session.form, path, control.value);
      } else if (control.type === "checkbox") {
        setPathValue(session.form, path, Boolean(control.checked));
      } else {
        setPathValue(session.form, path, control.value);
      }

      session.dirty = true;
      refreshSummary(root, session, context.escapeHtml);
      refreshActionState(root, session);
      bindSettingsActionButtons(context, session);
      bindSettingsAiButtons(context, session);
    });
  });

  bindSettingsActionButtons(context, session);
  bindSettingsAiButtons(context, session);
}

export const settingsRoute = {
  id: "settings",
  disableStandardLayout: true,
  meta: {
    eyebrow: "System",
    title: "Settings",
    description: "Configure project defaults, AI behavior, publishing rules, approvals, sync behavior, and governance."
  },
  template: `<section class="page is-active" data-page="settings"><div class="settings-page-surface"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject;

    if (!projectName) {
      const root = context.$("pageRoot");
      if (!root) return;
      root.innerHTML = `
        <section class="page is-active" data-page="settings">
          <div class="panel panel-span-2">
            <div class="empty-box">
              Select a project to configure system defaults, approvals, sync policies, and governance rules.
            </div>
          </div>
        </section>
      `;
      return;
    }

    const session = ensureSession(state);
    replacePage(context, session);
    bindFormEvents(context, session);

    if (!session.loaded && !session.loading) {
      loadDurableSettings(session, state, () => {
        replacePage(context, session);
        bindFormEvents(context, session);
      });
    }
  }
};

/**
 * Legacy global compatibility hooks.
 *
 * These globals are preserved so older console/debug integrations do not crash,
 * but they must not call removed /api/ai-control/* or /api/governance/* routes.
 *
 * Canonical runtime authority now lives in project-scoped api.js helpers and the
 * active Governance route. Backend authority remains unchanged.
 */
function buildLegacySettingsHookResponse(scope, action, details = {}) {
  return {
    ok: false,
    neutralized: true,
    legacy: true,
    scope,
    action,
    message: "Legacy settings global hook is neutralized. Use canonical project-scoped Control Center APIs instead.",
    canonical: {
      governance: {
        read: "fetchProjectGovernance(projectName)",
        policy_read: "fetchProjectGovernancePolicy(projectName)",
        policy_update: "updateProjectGovernancePolicy(projectName, payload)"
      },
      ai: {
        command: "executeProjectAiCommand(projectName, payload)",
        chat: "executeProjectAiChat(projectName, payload)",
        guidance: "executeProjectAiGuidance(projectName, payload)"
      }
    },
    details
  };
}

async function loadAIControlCenter() {
  return buildLegacySettingsHookResponse("ai-control", "load");
}

async function updateAIControl(payload) {
  return buildLegacySettingsHookResponse("ai-control", "update", {
    payloadReceived: Boolean(payload)
  });
}

window.__AI_CONTROL_CENTER__ = {
  load: loadAIControlCenter,
  update: updateAIControl
};

async function loadGovernanceState() {
  return buildLegacySettingsHookResponse("governance", "loadAudit");
}

async function processGovernanceAction(action) {
  return buildLegacySettingsHookResponse("governance", "process", {
    actionReceived: Boolean(action)
  });
}

async function loadGovernanceLiveState() {
  return buildLegacySettingsHookResponse("governance", "live");
}

window.__GOVERNANCE_CENTER__ = {
  loadAudit: loadGovernanceState,
  process: processGovernanceAction,
  live: loadGovernanceLiveState
};
