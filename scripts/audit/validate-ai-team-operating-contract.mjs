import {
  AI_TEAM_AUTHORITY_LEVELS,
  AI_TEAM_CANONICAL_ROLES,
  AI_TEAM_FORBIDDEN_ACTIONS,
  AI_TEAM_HANDOFF_RULES,
  AI_TEAM_OUTPUT_TYPES,
  AI_TEAM_PAGE_OWNER_MATRIX,
  AI_TEAM_REQUEST_TYPES,
  AI_TEAM_ROLE_ALIASES,
  AI_TEAM_SPECIALIST_REQUEST_MAP,
  getAiTeamPageOwner,
  getAiTeamRole,
  normalizeAiTeamRoleId
} from "../../public/control-center/runtime/ai-team/ai-team-operating-contract.js";

const failures = [];

function pass(label) {
  console.log(`PASS - ${label}`);
}

function fail(label, detail = "") {
  failures.push(`${label}${detail ? `: ${detail}` : ""}`);
  console.log(`FAIL - ${label}${detail ? `: ${detail}` : ""}`);
}

function assert(label, condition, detail = "") {
  if (condition) pass(label);
  else fail(label, detail);
}

const roleIds = AI_TEAM_CANONICAL_ROLES.map((role) => role.id);
const roleIdSet = new Set(roleIds);

assert("roles are defined", AI_TEAM_CANONICAL_ROLES.length >= 10);
assert("role IDs are unique", roleIdSet.size === roleIds.length);
assert("operations role exists", roleIdSet.has("operations"));
assert("strategist role exists", roleIdSet.has("strategist"));
assert("writer role exists", roleIdSet.has("writer"));
assert("media_director role exists", roleIdSet.has("media_director"));
assert("video_lead role exists", roleIdSet.has("video_lead"));
assert("publisher role exists", roleIdSet.has("publisher"));
assert("ads_operator role exists", roleIdSet.has("ads_operator"));
assert("analyst role exists", roleIdSet.has("analyst"));
assert("researcher role exists", roleIdSet.has("researcher"));
assert("compliance_reviewer role exists", roleIdSet.has("compliance_reviewer"));
assert("customer_ops role exists", roleIdSet.has("customer_ops"));
assert("sales_crm role exists", roleIdSet.has("sales_crm"));

for (const role of AI_TEAM_CANONICAL_ROLES) {
  assert(`role ${role.id} has label`, Boolean(role.label));
  assert(`role ${role.id} has category`, Boolean(role.category));
  assert(`role ${role.id} has primaryPages`, Array.isArray(role.primaryPages) && role.primaryPages.length > 0);
  assert(`role ${role.id} has outputTargets`, Array.isArray(role.outputTargets) && role.outputTargets.length > 0);
  assert(`role ${role.id} has allowedOutputs`, Array.isArray(role.allowedOutputs) && role.allowedOutputs.length > 0);
  assert(`role ${role.id} authority is valid`, AI_TEAM_AUTHORITY_LEVELS.includes(role.defaultAuthority), role.defaultAuthority);
  for (const output of role.allowedOutputs || []) {
    assert(`role ${role.id} output ${output} is valid`, AI_TEAM_OUTPUT_TYPES.includes(output), output);
  }
}

for (const [alias, target] of Object.entries(AI_TEAM_ROLE_ALIASES)) {
  assert(`alias ${alias} maps to canonical role`, roleIdSet.has(target), target);
}

const requiredAliases = {
  admin: "operations",
  operations_lead: "operations",
  executive: "operations",
  copywriter: "writer",
  content_writer: "writer",
  designer: "media_director",
  ads: "ads_operator",
  customer_operations: "customer_ops",
  seo: "analyst",
  seo_insights_analyst: "analyst",
  compliance: "compliance_reviewer",
  governance: "compliance_reviewer",
  support: "customer_ops",
  crm: "sales_crm"
};

for (const [alias, target] of Object.entries(requiredAliases)) {
  assert(`required alias ${alias} -> ${target}`, normalizeAiTeamRoleId(alias) === target);
}

assert("request types include execution_request", AI_TEAM_REQUEST_TYPES.includes("execution_request"));
assert("output types include handoff", AI_TEAM_OUTPUT_TYPES.includes("handoff"));
assert("authority levels include approval_required", AI_TEAM_AUTHORITY_LEVELS.includes("approval_required"));
assert("forbidden actions include publish", AI_TEAM_FORBIDDEN_ACTIONS.includes("publish"));
assert("forbidden actions include run_provider_execution", AI_TEAM_FORBIDDEN_ACTIONS.includes("run_provider_execution"));

const requiredPages = [
  "home",
  "ai-command",
  "setup",
  "library",
  "integrations",
  "campaign-studio",
  "content-studio",
  "media-studio",
  "publishing",
  "ads-manager",
  "insights",
  "research",
  "workflows",
  "task-center",
  "queue-center",
  "job-monitor",
  "notification-center",
  "operations-centers",
  "customer-center",
  "governance",
  "settings"
];

for (const page of requiredPages) {
  const owner = getAiTeamPageOwner(page);
  assert(`page ${page} has owner matrix`, Boolean(owner));
  if (owner) {
    assert(`page ${page} owner role is canonical`, roleIdSet.has(owner.ownerRole), owner.ownerRole);
    assert(`page ${page} authority is valid`, AI_TEAM_AUTHORITY_LEVELS.includes(owner.defaultAuthority), owner.defaultAuthority);
    for (const output of owner.allowedOutputs || []) {
      assert(`page ${page} output ${output} is valid`, AI_TEAM_OUTPUT_TYPES.includes(output), output);
    }
  }
}

for (const [source, destinations] of Object.entries(AI_TEAM_HANDOFF_RULES)) {
  assert(`handoff source ${source} has destinations`, Array.isArray(destinations) && destinations.length > 0);
  for (const destination of destinations) {
    assert(`handoff ${source} -> ${destination} destination has page owner or is library`, Boolean(AI_TEAM_PAGE_OWNER_MATRIX[destination]) || destination === "library", destination);
  }
}

for (const requestType of AI_TEAM_REQUEST_TYPES) {
  assert(`request type ${requestType} has default role`, Boolean(AI_TEAM_SPECIALIST_REQUEST_MAP[requestType]), requestType);
  assert(`request type ${requestType} default role is canonical`, roleIdSet.has(AI_TEAM_SPECIALIST_REQUEST_MAP[requestType]), AI_TEAM_SPECIALIST_REQUEST_MAP[requestType]);
}

assert("getAiTeamRole resolves admin alias to Operations Lead", getAiTeamRole("admin")?.id === "operations");
assert("getAiTeamRole resolves copywriter alias to writer", getAiTeamRole("copywriter")?.id === "writer");
assert("getAiTeamRole resolves ads alias to ads_operator", getAiTeamRole("ads")?.id === "ads_operator");

console.log("");
if (failures.length) {
  console.log(`AI Team Operating Contract validation: FAIL (${failures.length} issue(s))`);
  for (const item of failures) console.log(`- ${item}`);
  process.exit(1);
}

console.log("AI Team Operating Contract validation: PASS");
