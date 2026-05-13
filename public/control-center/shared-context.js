const campaignCache = new Map();
const aiDraftCache = new Map();
const handoffCache = new Map();

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function buildKey(projectName, scope = "default") {
  return `${asString(projectName).trim().toLowerCase() || "__default__"}::${scope}`;
}

function getLatestHandoffFromOperations(operations, destinationPage, sourcePage = "") {
  const handoffs = asArray(operations?.handoffs?.items);
  const available = handoffs.filter((item) => {
    const destinationMatches = asString(item?.destination_page) === asString(destinationPage);
    const sourceMatches = !sourcePage || asString(item?.source_page) === asString(sourcePage);
    const active = asString(item?.status || "available") === "available";
    return destinationMatches && sourceMatches && active;
  });

  return available[0] || null;
}

export function setSharedCampaignRecord(projectName, campaign) {
  if (!projectName || !campaign) return;
  campaignCache.set(buildKey(projectName), campaign);
}

export function getSharedCampaignRecord(projectName, operations) {
  const cached = campaignCache.get(buildKey(projectName));
  if (cached) return cached;

  const campaigns = asArray(operations?.campaigns?.items);
  const activeDraft =
    campaigns.find((item) => item?.active !== false) ||
    campaigns[0] ||
    null;

  return activeDraft;
}

export function setSharedAiDraft(projectName, draft) {
  if (!projectName || !draft) return;
  aiDraftCache.set(buildKey(projectName), draft);
}

export function getSharedAiDraft(projectName, operations) {
  const cached = aiDraftCache.get(buildKey(projectName));
  if (cached) return cached;

  const handoff =
    getLatestHandoffFromOperations(operations, "workflows", "ai-command") ||
    getLatestHandoffFromOperations(operations, "ai-command", "workflows") ||
    null;

  return asObject(handoff?.payload?.draft_context);
}

export function setSharedHandoff(projectName, destinationPage, handoff) {
  if (!projectName || !destinationPage || !handoff) return;
  handoffCache.set(buildKey(projectName, destinationPage), handoff);
}

export function getSharedHandoff(projectName, destinationPage, operations, sourcePage = "") {
  const cached = handoffCache.get(buildKey(projectName, destinationPage));
  if (cached) return cached;
  return getLatestHandoffFromOperations(operations, destinationPage, sourcePage);
}
