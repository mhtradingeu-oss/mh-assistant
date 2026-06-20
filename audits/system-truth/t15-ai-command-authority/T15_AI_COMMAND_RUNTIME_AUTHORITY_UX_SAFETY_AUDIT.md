# T15 — AI Command Runtime Authority + UX Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/ai-command.js

## Purpose
AI Command is the main smart operating surface. This audit verifies whether it behaves as a safe command center:
- no fake execution claims
- no frontend-only authority over protected actions
- clear backend/provider/team handoff
- clear confirmations for sensitive actions
- international-grade UX surface readiness

## Summary Counts

| Signal | Count |
|---|---:|
| innerHTML | 1 |
| actions | 449 |
| confirmations | 64 |
| backendApi | 43 |
| providerTeam | 633 |
| promises | 336 |
| authorityRisk | 389 |
| escapeEvidence | 481 |

## Initial Decision
Do not patch yet. Use this audit to decide if AI Command needs:
- runtime authority wording patch
- provider/team handoff clarity patch
- confirmation gate patch
- UX density/polish patch
- or closeout/no patch

## Risk Questions
1. Does AI Command make claims that imply autonomous execution without backend authority?
2. Do sensitive actions require confirmation or governance approval?
3. Are provider/team/media/publishing handoffs visible and honest?
4. Are user inputs escaped before rendering?
5. Does the page guide the user with Next Best Action instead of vague AI promises?

## innerHTML / HTML Rendering Signals

| Line | Code |
|---:|---|
| 5296 | `root.innerHTML = renderAiCommandChatFirstShell({` |

## Action / Command Signals

| Line | Code |
|---:|---|
| 7 | `} from "./ai-command/tool-dock.js";` |
| 8 | `import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";` |
| 27 | `executeProjectAiChat,` |
| 28 | `executeProjectAiGuidance` |
| 137 | `//  PHASE 1: SPECIALIST DEFINITIONS — AI TEAM COMMAND CENTER` |
| 148 | `canHelp: ["Draft campaign plans", "Prioritize next actions", "Map launch sequences", "Advise on offer strategy", "Prepare channel briefs"],` |
| 149 | `cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],` |
| 150 | `destinations: ["Campaign Studio", "Workflows", "AI Command"],` |
| 151 | `safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",` |
| 162 | `cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],` |
| 163 | `destinations: ["Content Studio", "Publishing", "AI Command"],` |
| 164 | `safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",` |
| 175 | `cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],` |
| 176 | `destinations: ["Asset Library", "Content Studio", "AI Command"],` |
| 177 | `safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",` |
| 188 | `cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],` |
| 190 | `safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",` |
| 202 | `destinations: ["Publishing", "Workflows", "AI Command"],` |
| 214 | `cannotDo: ["Launch ads directly", "Set live budgets without review", "Approve spend", "Access ad accounts directly"],` |
| 216 | `safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",` |
| 240 | `cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],` |
| 242 | `safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",` |
| 253 | `cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],` |
| 254 | `destinations: ["Workflows", "Operations Centers", "AI Command"],` |
| 255 | `safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",` |
| 266 | `cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],` |
| 268 | `safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",` |
| 279 | `cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],` |
| 281 | `safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",` |
| 286 | `// Role-specific suggested prompt chips (prefill only, no auto-execute)` |
| 316 | `{ label: "Prepare a handoff package", sub: "For the approver review" }` |
| 337 | `{ label: "Turn this into tasks", sub: "Break down into action items" },` |
| 371 | `{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },` |
| 429 | `{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },` |
| 430 | `{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },` |
| 431 | `{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },` |
| 432 | `{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }` |
| 435 | `{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },` |
| 436 | `{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },` |
| 437 | `{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },` |
| 438 | `{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }` |
| 441 | `{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },` |
| 442 | `{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },` |
| 443 | `{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },` |
| 444 | `{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },` |
| 445 | `{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }` |
| 448 | `{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },` |
| 449 | `{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },` |
| 450 | `{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },` |
| 451 | `{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },` |
| 452 | `{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }` |
| 455 | `{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },` |
| 456 | `{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },` |
| 457 | `{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },` |
| 458 | `{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },` |
| 459 | `{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }` |
| 462 | `{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },` |
| 463 | `{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },` |
| 464 | `{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },` |
| 465 | `{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },` |
| 466 | `{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }` |
| 469 | `{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },` |
| 470 | `{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },` |
| 471 | `{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },` |
| 472 | `{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },` |
| 473 | `{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }` |
| 476 | `{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },` |
| 477 | `{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },` |
| 478 | `{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },` |
| 479 | `{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },` |
| 480 | `{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }` |
| 483 | `{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },` |
| 484 | `{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },` |
| 485 | `{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },` |
| 486 | `{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },` |
| 487 | `{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }` |
| 490 | `{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },` |
| 491 | `{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },` |
| 492 | `{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },` |
| 493 | `{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },` |
| 494 | `{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },` |
| 495 | `{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },` |
| 496 | `{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },` |
| 497 | `{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }` |
| 500 | `{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },` |
| 501 | `{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },` |
| 502 | `{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },` |
| 503 | `{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },` |
| 504 | `{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },` |
| 505 | `{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },` |
| 506 | `{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },` |
| 507 | `{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }` |
| 511 | `// 4 quick-action prompts shown in the composer` |
| 512 | `const QUICK_ACTIONS = [` |
| 519 | `const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";` |
| 520 | `const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";` |
| 522 | `const COMMAND_TYPES = [` |
| 588 | `purpose: "Turn multi-channel signals into prioritized actions.",` |
| 603 | `bestUse: "When actions span multiple pages and teams.",` |
| 609 | `const AI_COMMAND_CHAT_SESSIONS_KEY = "mh_ai_command_chat_sessions_v1";` |
| 613 | `let aiCommandBridgeRegistered = false;` |
| 620 | `function buildAutoPlanFromCommand(commandText, session) {` |
| 649 | `const command = humanizeValue(commandText \|\| session?.draftMessage, "Prepare workflow action from AI command.");` |
| 654 | `targetPage: "ai-command",` |
| 655 | `action: "Generate prompt from AI command",` |
| 657 | `prompt: command,` |
| 658 | `title: "AI command auto plan"` |
| 666 | `action: "Prepare workflow from AI command",` |
| 668 | `prompt: command,` |
| 669 | `reason: "AI command prepared for workflow execution."` |
| 675 | `if (/publish\s*now\|send\s*external\|paid\s*ads\|final\s*approval/i.test(command)) {` |
| 680 | `action: "Publish now to external channels",` |
| 682 | `prompt: command,` |
| 683 | `reason: "Requires approval gate before external publishing actions."` |
| 744 | `value.action \|\|` |
| 784 | `const commandPrefixes = [` |
| 795 | `for (const prefix of commandPrefixes) {` |
| 801 | `// If the composer contains a chain of quick actions, keep only the latest action.` |
| 802 | `const latestMarker = commandPrefixes` |
| 812 | `for (const prefix of commandPrefixes) {` |
| 902 | `maximumFractionDigits: 1` |
| 913 | `maximumFractionDigits: 0` |
| 943 | `commandType: "strategy",` |
| 987 | `const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_DRAFTS_KEY) \|\| "{}";` |
| 998 | `window.localStorage?.setItem(AI_COMMAND_LOCAL_DRAFTS_KEY, JSON.stringify(map \|\| {}));` |
| 1027 | `if (localDraft.commandType) session.commandType = asString(localDraft.commandType);` |
| 1040 | `commandType: session.commandType,` |
| 1050 | `const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_OUTPUTS_KEY) \|\| "{}";` |
| 1061 | `window.localStorage?.setItem(AI_COMMAND_LOCAL_OUTPUTS_KEY, JSON.stringify(map \|\| {}));` |
| 1082 | `function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {` |
| 1083 | `if (typeof executeProjectAiGuidanceFn !== "function") {` |
| 1099 | `const raw = window.localStorage?.getItem(AI_COMMAND_CHAT_SESSIONS_KEY) \|\| "{}";` |
| 1110 | `window.localStorage?.setItem(AI_COMMAND_CHAT_SESSIONS_KEY, JSON.stringify(map \|\| {}));` |
| 1194 | `"Name the specialist owner for each next action and destination."` |
| 1212 | `"Never claim actions were executed.",` |
| 1213 | `"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",` |
| 1303 | `const looksTaskLike = /\b(task\|tasks\|handoff\|ticket\|tickets\|follow-up\|follow up\|owner\|owners\|assignee\|assigned\|due date\|priority\|priorities\|backlog\|checklist\|next task\|action item\|action items)\b/.test(text);` |
| 1392 | `confirmationRequired: outputType === "handoff" \|\| specialistId === "publisher" \|\| specialistId === "compliance_reviewer",` |
| 1397 | `nextSafeAction: `Review in ${routeLabel(route)}`,` |
| 1398 | `confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."` |
| 1413 | `nextSafeAction: "Review and refine the task draft before creating durable tasks"` |
| 1440 | `"German caption version should keep the CTA direct and easy to approve."` |
| 1458 | `safetyLabel: "Claims require review before publishing. No direct publish action."` |
| 1470 | `"Confirm platform formats before routing to Media Studio."` |
| 1477 | `safetyLabel: "No media generation executed. Brief and routing only.",` |
| 1478 | `nextSafeAction: "Open Media Studio to review and refine the brief"` |
| 1504 | `"Publishing remains gated until channel, approval, and asset readiness are confirmed."` |
| 1512 | `confirmationRequired: true,` |
| 1513 | `safetyLabel: "Confirmation required before publish. No publish action performed."` |
| 1541 | `safetyLabel: "No budget updates or ad launches executed."` |
| 1570 | `confirmationRequired: true,` |
| 1580 | `mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",` |
| 1582 | `"Thank the customer, acknowledge the issue, and confirm the next reviewed support step.",` |
| 1583 | `"Avoid promising refunds, replacements, or timelines until the owning team confirms them."` |
| 1587 | `"Priority: draft priority pending runtime inbox and SLA confirmation.",` |
| 1588 | `"Owner: support, sales, or operations to be confirmed before creation."` |
| 1592 | `"SLA and escalation decisions require confirmation in the owning operations surface."` |
| 1594 | `nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",` |
| 1599 | `"Confirm escalation or routing before action"` |
| 1601 | `confirmationRequired: true,` |

_Trimmed: 289 additional matches not shown._

## Confirmation / Governance Signals

| Line | Code |
|---:|---|
| 88 | `summary: "Claims review, approvals, safety language, and governance checks.",` |
| 89 | `routeHint: "governance"` |
| 95 | `summary: "Tasks, timelines, handoffs, approvals, and execution plans.",` |
| 190 | `safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",` |
| 201 | `cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Push to live channels directly"],` |
| 203 | `safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",` |
| 216 | `safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",` |
| 235 | `position: "Claims and Governance Lead",` |
| 237 | `summary: "Claims review, approval safety, publishing risk, and governance notes.",` |
| 238 | `placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",` |
| 239 | `canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],` |
| 240 | `cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],` |
| 241 | `destinations: ["Workflows", "Publishing", "Governance"],` |
| 242 | `safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",` |
| 250 | `summary: "Tasks, timelines, handoffs, approvals, and execution plans.",` |
| 331 | `{ label: "Check claims for approval", sub: "Review all marketing claims" },` |
| 333 | `{ label: "Prepare governance notes", sub: "Document compliance status" },` |
| 334 | `{ label: "Review approval requirements", sub: "What needs sign-off" }` |
| 408 | `label: "Admin / Governance",` |
| 411 | `summary: "Policy, approvals, roles, and audit controls stay destination-owned."` |
| 456 | `{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },` |
| 477 | `{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },` |
| 478 | `{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },` |
| 479 | `{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },` |
| 480 | `{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }` |
| 675 | `if (/publish\s*now\|send\s*external\|paid\s*ads\|final\s*approval/i.test(command)) {` |
| 683 | `reason: "Requires approval gate before external publishing actions."` |
| 1213 | `"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",` |
| 1270 | `if (id === "compliance_reviewer") return "governance";` |
| 1304 | `const looksWorkflowLike = /\b(workflow\|workflows\|process\|sequence\|phase\|phases\|approval flow\|automation\|operating loop\|step-by-step\|steps\|dependencies\|trigger\|review gate\|execution flow)\b/.test(text);` |
| 1307 | `const looksPublishingLike = /\b(publish\|publishing\|schedule\|channel package\|channel payload\|approval-ready post\|final post\|ready to publish\|publishing package)\b/.test(text);` |
| 1308 | `const looksGovernanceLike = /\b(compliance\|governance\|claim\|claims\|risk\|risks\|approval\|approvals\|policy\|privacy\|legal\|safe language\|safety review)\b/.test(text);` |
| 1337 | `if (/governance\|compliance\|risk\|approval/.test(outputType) \|\| looksGovernanceLike) {` |
| 1338 | `outputType = "governance";` |
| 1339 | `return { outputType, destinationRoute: explicitDestination \|\| "governance" };` |
| 1369 | `governance: "Governance",` |
| 1398 | `confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."` |
| 1504 | `"Publishing remains gated until channel, approval, and asset readiness are confirmed."` |
| 1509 | `"Flag approval dependencies",` |
| 1567 | `"Prepare governance notes",` |
| 1568 | `"Route to Governance for formal review"` |
| 1571 | `safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."` |
| 1706 | `"Compliance and Publisher verify claims, approvals, formatting, and release readiness",` |
| 1713 | `"Compliance: flag claims, evidence needs, policy risks, and approval gates",` |
| 1720 | `confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",` |
| 1970 | `operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],` |
| 2085 | `routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),` |
| 2355 | `governance: "Governance",` |
| 2377 | `governance: "compliance_reviewer",` |
| 2418 | `govern: "governance",` |
| 2522 | `confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),` |
| 3571 | `if (/review\|check\|compliance\|readiness\|governance/i.test(asString(tool.label))) return "Review";` |
| 3689 | `<span>Strategy, writing, creative, compliance, publishing, customer, sales, and operations specialists coordinate one review-ready answer. No workflow, send, publish, approval, or CRM action is executed here.</span>` |
| 4015 | `<p>Chat, draft, review, and prepare handoff context only. Publishing, approvals, CRM updates, workflow runs, external sends, and durable task creation stay confirmation-gated in the owning workspace.</p>` |
| 4155 | `? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action is created here."` |
| 4237 | `<div class="aicmd-chatfirst-composer-safety">Review-ready guidance only. No publish, send, approval, CRM update, workflow run, durable task creation, or backend execution happens from this composer.</div>` |
| 4449 | `<p class="aicmd-chatfirst-tab-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</p>` |
| 4566 | `<div class="aicmd-v2-composer-hint">Primary workspace: ask, refine, then create a review-ready preview. Suggested prompts prefill only. No publish, send, approval, CRM update, workflow run, or durable task creation happens here.</div>` |
| 4773 | `<div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>` |
| 4784 | `const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");` |
| 4793 | `<div><span>Approval</span><strong>${escapeHtml(approval)}</strong></div>` |
| 4863 | `? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."` |
| 5142 | `<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>` |
| 5644 | `safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",` |

## Backend / API Signals

| Line | Code |
|---:|---|
| 27 | `executeProjectAiChat,` |
| 28 | `executeProjectAiGuidance` |
| 29 | `} from "../api.js";` |
| 149 | `cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],` |
| 175 | `cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],` |
| 253 | `cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],` |
| 286 | `// Role-specific suggested prompt chips (prefill only, no auto-execute)` |
| 371 | `{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },` |
| 1082 | `function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {` |
| 1083 | `if (typeof executeProjectAiGuidanceFn !== "function") {` |
| 1212 | `"Never claim actions were executed.",` |
| 1477 | `safetyLabel: "No media generation executed. Brief and routing only.",` |
| 1541 | `safetyLabel: "No budget updates or ad launches executed."` |
| 1668 | `safetyLabel: "No workflow run and no backend task creation executed."` |
| 1720 | `confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",` |
| 2272 | `reloadProjectData,` |
| 2296 | `if (needsDashboard) await reloadProjectData(projectName);` |
| 2297 | `const [insightsResult, learningResult] = await Promise.allSettled([` |
| 2592 | `)) \|\| `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;` |
| 2632 | `note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."` |
| 2701 | `executeProjectAiCommand,` |
| 2702 | `reloadProjectData` |
| 2706 | `if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");` |
| 2714 | `result = await executeProjectAiCommand(projectName, {` |
| 2782 | `await reloadProjectData?.(projectName);` |
| 2975 | `<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>` |
| 3351 | `"Keep it review-ready and do not execute backend actions.",` |
| 3378 | `preview.safetyLabel = preview.safetyLabel \|\| "Conversation converted into a review-ready draft. No backend action executed.";` |
| 3594 | `<div class="aicmd-room-team-chain" aria-label="Full team orchestration chain">` |
| 3689 | `<span>Strategy, writing, creative, compliance, publishing, customer, sales, and operations specialists coordinate one review-ready answer. No workflow, send, publish, approval, or CRM action is executed here.</span>` |
| 3814 | `? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"` |
| 3948 | `${projectName ? `<div class="aicmd-v2-tools-note">Project context: ${escapeHtml(projectName)}. Tools do not execute, publish, send, approve, save, or mutate records.</div>` : ""}` |
| 4370 | `${projectName ? `<p class="aicmd-chatfirst-tab-note">Project context: ${escapeHtml(projectName)}. Tools do not execute, publish, send, approve, save, or mutate records.</p>` : ""}` |
| 4816 | `<li><span>Video brief / script draft</span><strong class="is-draft-ready">Draft-ready — no generation executed</strong></li>` |
| 5055 | `data-aicmdv2-prompt-text="${escapeHtml(p.prompt \|\| `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"` |
| 5217 | `executeProjectAiCommand,` |
| 5220 | `reloadProjectData` |
| 5281 | `const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);` |
| 5449 | `session.draftMessage = `Act as the ${spec?.label \|\| titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;` |
| 5626 | `const result = await executeProjectAiChat(projectName, {` |
| 5925 | `await navigator.clipboard.writeText(latestResponse.responseText);` |
| 6059 | `await navigator.clipboard.writeText(text);` |
| 6175 | `reloadProjectData,` |

## Provider / Team / Handoff Signals

| Line | Code |
|---:|---|
| 8 | `import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";` |
| 17 | `getSharedHandoff,` |
| 19 | `setSharedHandoff` |
| 31 | `//  AI TEAM DEFINITIONS` |
| 50 | `id: "media",` |
| 51 | `label: "Media Director",` |
| 54 | `routeHint: "media-studio"` |
| 61 | `routeHint: "media-studio"` |
| 67 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 68 | `routeHint: "publishing"` |
| 95 | `summary: "Tasks, timelines, handoffs, approvals, and execution plans.",` |
| 96 | `routeHint: "workflows"` |
| 109 | `summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",` |
| 110 | `routeHint: "workflows"` |
| 114 | `// Map legacy mode IDs from older sessions to new team IDs` |
| 119 | `designer: "media",` |
| 120 | `media_director: "media",` |
| 121 | `media_planner: "media",` |
| 137 | `//  PHASE 1: SPECIALIST DEFINITIONS — AI TEAM COMMAND CENTER` |
| 149 | `cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],` |
| 150 | `destinations: ["Campaign Studio", "Workflows", "AI Command"],` |
| 161 | `canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],` |
| 162 | `cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],` |
| 163 | `destinations: ["Content Studio", "Publishing", "AI Command"],` |
| 164 | `safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",` |
| 168 | `id: "media",` |
| 169 | `label: "Media Director",` |
| 173 | `placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",` |
| 174 | `canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],` |
| 175 | `cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],` |
| 177 | `safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",` |
| 188 | `cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],` |
| 189 | `destinations: ["Asset Library", "Content Studio", "Media Native"],` |
| 196 | `position: "Publishing Readiness Lead",` |
| 198 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 199 | `placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",` |
| 200 | `canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],` |
| 202 | `destinations: ["Publishing", "Workflows", "AI Command"],` |
| 203 | `safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",` |
| 237 | `summary: "Claims review, approval safety, publishing risk, and governance notes.",` |
| 238 | `placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",` |
| 239 | `canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],` |
| 241 | `destinations: ["Workflows", "Publishing", "Governance"],` |
| 248 | `position: "Execution and Handoff Lead",` |
| 250 | `summary: "Tasks, timelines, handoffs, approvals, and execution plans.",` |
| 251 | `placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",` |
| 252 | `canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],` |
| 253 | `cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],` |
| 254 | `destinations: ["Workflows", "Operations Centers", "AI Command"],` |
| 255 | `safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",` |
| 276 | `summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",` |
| 277 | `placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",` |
| 278 | `canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],` |
| 280 | `destinations: ["CRM", "Workflows", "Operations Centers"],` |
| 297 | `{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },` |
| 300 | `media: [` |
| 304 | `{ label: "Prepare a media handoff", sub: "Package direction for the team" }` |
| 313 | `{ label: "Review publishing readiness", sub: "Check what is ready to publish" },` |
| 316 | `{ label: "Prepare a handoff package", sub: "For the approver review" }` |
| 332 | `{ label: "Flag publishing risks", sub: "Identify blockers before release" },` |
| 338 | `{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },` |
| 352 | `{ label: "Prepare sales handoff", sub: "Route context to operations" }` |
| 356 | `// Full Team mode suggested prompts` |
| 357 | `const TEAM_SUGGESTED_PROMPTS = [` |
| 358 | `{ label: "What should the executive AI team focus on?", sub: "Strategy, execution, and risk review" },` |
| 360 | `{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },` |
| 367 | `{ id: "ask", title: "Ask", description: "Choose a specialist or the full team." },` |
| 368 | `{ id: "draft", title: "Prepare", description: "Create guidance, copy, task, or handoff context." },` |
| 370 | `{ id: "route", title: "Handoff", description: "Open the owning workspace with draft context." },` |
| 378 | `{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },` |
| 379 | `{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },` |
| 383 | `const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];` |
| 389 | `media: "MD",` |
| 402 | `media: "designer",` |
| 423 | `summary: "Workflow blueprints and trigger maps will route to Workflows before execution."` |
| 430 | `{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },` |
| 431 | `{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },` |
| 438 | `{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }` |
| 440 | `media: [` |
| 441 | `{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },` |
| 445 | `{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }` |
| 450 | `{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },` |
| 455 | `{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },` |
| 456 | `{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },` |
| 458 | `{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },` |
| 459 | `{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }` |
| 472 | `{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },` |
| 478 | `{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },` |
| 479 | `{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },` |
| 483 | `{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },` |
| 484 | `{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },` |
| 487 | `{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }` |
| 495 | `{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },` |
| 497 | `{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }` |
| 502 | `{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },` |
| 506 | `{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },` |
| 507 | `{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }` |
| 549 | `const AGENT_CARDS = [` |
| 572 | `id: "media",` |
| 573 | `name: "Media Planner",` |
| 574 | `purpose: "Align media formats with channels, cadence, and readiness.",` |
| 576 | `suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."` |
| 601 | `name: "Operations Assistant",` |
| 602 | `purpose: "Translate intent into executable workflows and handoffs.",` |
| 603 | `bestUse: "When actions span multiple pages and teams.",` |
| 604 | `suggestedPrompt: "Act as Operations Assistant and convert priorities into a practical execution sequence."` |
| 610 | `const aiInboundHandoffObjectIds = typeof WeakMap !== "undefined" ? new WeakMap() : null;` |
| 611 | `let aiInboundHandoffCounter = 0;` |
| 632 | `if (/act as the media director/i.test(text)) return "media";` |
| 649 | `const command = humanizeValue(commandText \|\| session?.draftMessage, "Prepare workflow action from AI command.");` |
| 663 | `id: `auto-workflow-${Date.now()}`,` |
| 664 | `type: "prepare_workflow",` |
| 665 | `targetPage: "workflows",` |
| 666 | `action: "Prepare workflow from AI command",` |
| 669 | `reason: "AI command prepared for workflow execution."` |
| 679 | `targetPage: "publishing",` |
| 683 | `reason: "Requires approval gate before external publishing actions."` |
| 696 | `if (/act as the media director/i.test(text)) return "media";` |
| 785 | `"Prepare a handoff summary for:",` |
| 786 | `"Draft a workflow sequence for:",` |
| 870 | `overview.publishing_language \|\|` |
| 938 | `teamMode: "solo",` |
| 965 | `lastAppliedHandoffId: "",` |
| 968 | `inboundHandoff: null,` |
| 1130 | `const titleSeed = asString(options.title \|\| firstUser?.content \|\| responses[0]?.prompt \|\| "AI Team session").trim();` |
| 1134 | `title: titleSeed.slice(0, 80) \|\| "AI Team session",` |
| 1136 | `teamMode: session.teamMode,` |
| 1159 | `session.teamMode = asString(record.teamMode \|\| "solo");` |
| 1182 | `function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {` |
| 1186 | `const safeMode = asString(modeLabel \|\| "Solo Specialist").trim();` |
| 1190 | `const teamWorkflowLines = safeMode === "Full Team"` |
| 1192 | `"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",` |
| 1207 | ``Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,` |
| 1209 | `...teamWorkflowLines,` |
| 1262 | `if (outputType === "workflow") return "workflows";` |
| 1263 | `if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";` |
| 1265 | `if (id === "media") return "media-studio";` |
| 1266 | `if (id === "video_lead") return "media-studio";` |
| 1267 | `if (id === "publisher") return "publishing";` |
| 1271 | `if (id === "operations") return outputType === "task" ? "task-center" : "workflows";` |
| 1273 | `if (id === "sales_crm") return "workflows";` |
| 1274 | `return "workflows";` |
| 1296 | `: activeTab === "workflow"` |
| 1297 | `? "workflow"` |
| 1298 | `: activeTab === "handoff"` |
| 1299 | `? "handoff"` |
| 1303 | `const looksTaskLike = /\b(task\|tasks\|handoff\|ticket\|tickets\|follow-up\|follow up\|owner\|owners\|assignee\|assigned\|due date\|priority\|priorities\|backlog\|checklist\|next task\|action item\|action items)\b/.test(text);` |
| 1304 | `const looksWorkflowLike = /\b(workflow\|workflows\|process\|sequence\|phase\|phases\|approval flow\|automation\|operating loop\|step-by-step\|steps\|dependencies\|trigger\|review gate\|execution flow)\b/.test(text);` |
| 1306 | `const looksMediaLike = /\b(media\|visual\|creative\|image\|images\|video\|reel\|storyboard\|shot list\|asset\|assets\|design\|production\|creative direction\|voiceover)\b/.test(text);` |
| 1307 | `const looksPublishingLike = /\b(publish\|publishing\|schedule\|channel package\|channel payload\|approval-ready post\|final post\|ready to publish\|publishing package)\b/.test(text);` |
| 1312 | `if (outputType === "handoff" \|\| outputType === "task" \|\| looksTaskLike) {` |
| 1317 | `if (outputType === "workflow" \|\| looksWorkflowLike) {` |
| 1318 | `outputType = "workflow";` |
| 1319 | `return { outputType, destinationRoute: explicitDestination \|\| "workflows" };` |
| 1327 | `if (/media\|video\|visual\|asset\|creative/.test(outputType) \|\| looksMediaLike) {` |
| 1328 | `outputType = "media";` |
| 1329 | `return { outputType, destinationRoute: explicitDestination \|\| "media-studio" };` |
| 1332 | `if (/publishing\|publish\|schedule/.test(outputType) \|\| looksPublishingLike) {` |
| 1333 | `outputType = "publishing";` |
| 1334 | `return { outputType, destinationRoute: explicitDestination \|\| "publishing" };` |

_Trimmed: 473 additional matches not shown._

## Execution Promise / UX Claim Signals

| Line | Code |
|---:|---|
| 27 | `executeProjectAiChat,` |
| 28 | `executeProjectAiGuidance` |
| 39 | `summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",` |
| 40 | `routeHint: "campaign-studio"` |
| 64 | `id: "publisher",` |
| 65 | `label: "Publisher",` |
| 67 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 68 | `routeHint: "publishing"` |
| 72 | `label: "Ads Optimizer",` |
| 117 | `campaign: "strategist",` |
| 125 | `publisher: "publisher",` |
| 146 | `summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",` |
| 147 | `placeholder: "Ask the Strategist to plan a campaign, map launch phases, review channel priorities, or define the offer strategy…",` |
| 148 | `canHelp: ["Draft campaign plans", "Prioritize next actions", "Map launch sequences", "Advise on offer strategy", "Prepare channel briefs"],` |
| 149 | `cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],` |
| 150 | `destinations: ["Campaign Studio", "Workflows", "AI Command"],` |
| 160 | `placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",` |
| 161 | `canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],` |
| 162 | `cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],` |
| 163 | `destinations: ["Content Studio", "Publishing", "AI Command"],` |
| 164 | `safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",` |
| 175 | `cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],` |
| 188 | `cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],` |
| 194 | `id: "publisher",` |
| 195 | `label: "Publisher",` |
| 196 | `position: "Publishing Readiness Lead",` |
| 198 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 199 | `placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",` |
| 200 | `canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],` |
| 201 | `cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Push to live channels directly"],` |
| 202 | `destinations: ["Publishing", "Workflows", "AI Command"],` |
| 203 | `safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",` |
| 208 | `label: "Ads Optimizer",` |
| 212 | `placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",` |
| 213 | `canHelp: ["Draft ad concepts and copy", "Review targeting angles", "Plan paid campaign structure", "Suggest creative variants", "Map platform-specific strategy"],` |
| 214 | `cannotDo: ["Launch ads directly", "Set live budgets without review", "Approve spend", "Access ad accounts directly"],` |
| 215 | `destinations: ["Ads Manager", "Integrations", "Campaign Studio"],` |
| 227 | `cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],` |
| 229 | `safetyNote: "Analysis and recommendations only. No direct website or analytics changes.",` |
| 237 | `summary: "Claims review, approval safety, publishing risk, and governance notes.",` |
| 238 | `placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",` |
| 239 | `canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],` |
| 240 | `cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],` |
| 241 | `destinations: ["Workflows", "Publishing", "Governance"],` |
| 253 | `cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],` |
| 286 | `// Role-specific suggested prompt chips (prefill only, no auto-execute)` |
| 290 | `{ label: "Draft a campaign brief", sub: "Map objective, audience, and channels" },` |
| 291 | `{ label: "Review launch readiness", sub: "Identify what is blocking launch" },` |
| 292 | `{ label: "Suggest the next campaign move", sub: "Based on current project state" }` |
| 295 | `{ label: "Draft campaign captions", sub: "For the active campaign" },` |
| 297 | `{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },` |
| 301 | `{ label: "Write a creative brief", sub: "For the next campaign visual" },` |
| 303 | `{ label: "Map format requirements", sub: "By platform and campaign phase" },` |
| 307 | `{ label: "Write a reel script", sub: "For the current campaign" },` |
| 309 | `{ label: "Outline motion direction", sub: "Align visuals with campaign tone" },` |
| 312 | `publisher: [` |
| 313 | `{ label: "Review publishing readiness", sub: "Check what is ready to publish" },` |
| 314 | `{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },` |
| 319 | `{ label: "Draft ad concepts", sub: "For the current campaign" },` |
| 322 | `{ label: "Plan paid campaign structure", sub: "Objective, audience, creative, budget" }` |
| 332 | `{ label: "Flag publishing risks", sub: "Identify blockers before release" },` |
| 359 | `{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },` |
| 360 | `{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },` |
| 371 | `{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },` |
| 383 | `const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];` |
| 391 | `publisher: "PB",` |
| 429 | `{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },` |
| 430 | `{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },` |
| 438 | `{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }` |
| 454 | `publisher: [` |
| 455 | `{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },` |
| 456 | `{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },` |
| 458 | `{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },` |
| 459 | `{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }` |
| 479 | `{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },` |
| 484 | `{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },` |
| 492 | `{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },` |
| 494 | `{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },` |
| 504 | `{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },` |
| 507 | `{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }` |
| 513 | `{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },` |
| 514 | `{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },` |
| 515 | `{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },` |
| 516 | `{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }` |
| 525 | `{ id: "campaign", label: "Campaign" },` |
| 536 | `{ id: "campaign", label: "Campaign" },` |
| 541 | `"Launch readiness",` |
| 543 | `"Campaign",` |
| 553 | `purpose: "Build high-leverage decisions for launch sequencing and channel focus.",` |
| 555 | `suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."` |
| 561 | `bestUse: "When campaigns need content batches fast.",` |
| 562 | `suggestedPrompt: "Act as Writer and generate content angles for the current project and active campaign."` |
| 569 | `suggestedPrompt: "Act as Designer and propose creative directions tied to current campaign goals."` |
| 576 | `suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."` |
| 581 | `purpose: "Optimize paid opportunities, creative testing, and budget decisions.",` |
| 589 | `bestUse: "When you need evidence-backed recommendations.",` |
| 595 | `purpose: "Strengthen decisions with market, competitor, and audience insight.",` |
| 634 | `if (/act as the publisher/i.test(text)) return "publisher";` |
| 635 | `if (/act as the ads optimizer\|act as the ads operator/i.test(text)) return "ads";` |
| 652 | `id: `auto-generate-${Date.now()}`,` |
| 653 | `type: "generate_prompt",` |
| 655 | `action: "Generate prompt from AI command",` |
| 660 | `priority: "recommended"` |
| 671 | `priority: "recommended"` |
| 675 | `if (/publish\s*now\|send\s*external\|paid\s*ads\|final\s*approval/i.test(command)) {` |
| 678 | `type: "publish_now",` |
| 679 | `targetPage: "publishing",` |
| 680 | `action: "Publish now to external channels",` |
| 683 | `reason: "Requires approval gate before external publishing actions."` |
| 698 | `if (/act as the publisher/i.test(text)) return "publisher";` |
| 699 | `if (/act as the ads optimizer\|act as the ads operator/i.test(text)) return "ads";` |
| 747 | `value.recommendation \|\|` |
| 772 | `campaign: asString(context.campaign \|\| "active campaign") \|\| "active campaign"` |
| 775 | `return asString(template).replace(/\{(project\|projectName\|specialist\|specialistLabel\|campaign)\}/g, (_, token) => tokenMap[token] \|\| "");` |
| 788 | `"Build a launch campaign for:",` |
| 789 | `"Generate content for:",` |
| 869 | `const configuredPublishLanguage = asString(` |
| 870 | `overview.publishing_language \|\|` |
| 871 | `overview.publish_language \|\|` |
| 876 | `const publishLanguage = configuredPublishLanguage \|\| "German";` |
| 886 | `publishLanguage,` |
| 926 | `return asString(item.label \|\| item.title \|\| item.page \|\| item.query \|\| item.campaign_name \|\| item.name);` |
| 950 | `taskType: "launch",` |
| 1082 | `function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {` |
| 1083 | `if (typeof executeProjectAiGuidanceFn !== "function") {` |
| 1192 | `"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",` |
| 1203 | ``Publishable output language: ${safeOutputLanguage}`,` |
| 1207 | ``Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,` |
| 1208 | `"When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",` |
| 1211 | ``When drafting publishable copy, write it in ${safeOutputLanguage}.`,` |
| 1212 | `"Never claim actions were executed.",` |
| 1213 | `"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",` |
| 1221 | `function extractGeneratedResponseText(response = {}) {` |
| 1238 | `const recommendationLine = normalizeDisplayList(response.recommendations, 4)` |
| 1256 | `return [recommendationLine, findingLine, sectionLine].filter(Boolean).join("\n\n");` |
| 1263 | `if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";` |
| 1267 | `if (id === "publisher") return "publishing";` |
| 1307 | `const looksPublishingLike = /\b(publish\|publishing\|schedule\|channel package\|channel payload\|approval-ready post\|final post\|ready to publish\|publishing package)\b/.test(text);` |
| 1310 | `const looksCampaignLike = /\b(campaign\|launch\|audience\|offer\|funnel\|positioning\|channel mix\|campaign brief\|go-to-market\|go to market)\b/.test(text);` |
| 1332 | `if (/publishing\|publish\|schedule/.test(outputType) \|\| looksPublishingLike) {` |
| 1333 | `outputType = "publishing";` |
| 1334 | `return { outputType, destinationRoute: explicitDestination \|\| "publishing" };` |
| 1347 | `if (/campaign\|strategy\|launch/.test(outputType) \|\| looksCampaignLike) {` |
| 1348 | `outputType = "campaign";` |
| 1351 | `destinationRoute: explicitDestination \|\| (session?.teamMode === "team" ? "workflows" : "campaign-studio")` |
| 1362 | `"campaign-studio": "Campaign Studio",` |
| 1365 | `publishing: "Publishing",` |
| 1392 | `confirmationRequired: outputType === "handoff" \|\| specialistId === "publisher" \|\| specialistId === "compliance_reviewer",` |
| 1393 | `generatedAt: nowIso(),` |
| 1398 | `confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."` |
| 1411 | `"Route execution draft to Campaign Studio or Workflows"` |
| 1431 | `title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",` |
| 1435 | `"Outcome-led hook direction for a German publishing draft",` |
| 1448 | `"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",` |
| 1449 | `"Claims, health, or performance promises need evidence before publishing."` |
| 1451 | `nextStep: "Send this package to Content Studio or Publisher after review.",` |
| 1458 | `safetyLabel: "Claims require review before publishing. No direct publish action."` |
| 1477 | `safetyLabel: "No media generation executed. Brief and routing only.",` |
| 1497 | `if (specialistId === "publisher") {` |
| 1500 | `title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",` |

_Trimmed: 176 additional matches not shown._

## Authority Risk Signals

| Line | Code |
|---:|---|
| 8 | `import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";` |
| 27 | `executeProjectAiChat,` |
| 28 | `executeProjectAiGuidance` |
| 50 | `id: "media",` |
| 51 | `label: "Media Director",` |
| 54 | `routeHint: "media-studio"` |
| 61 | `routeHint: "media-studio"` |
| 64 | `id: "publisher",` |
| 65 | `label: "Publisher",` |
| 67 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 68 | `routeHint: "publishing"` |
| 96 | `routeHint: "workflows"` |
| 110 | `routeHint: "workflows"` |
| 119 | `designer: "media",` |
| 120 | `media_director: "media",` |
| 121 | `media_planner: "media",` |
| 125 | `publisher: "publisher",` |
| 149 | `cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],` |
| 150 | `destinations: ["Campaign Studio", "Workflows", "AI Command"],` |
| 161 | `canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],` |
| 162 | `cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],` |
| 163 | `destinations: ["Content Studio", "Publishing", "AI Command"],` |
| 164 | `safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",` |
| 168 | `id: "media",` |
| 169 | `label: "Media Director",` |
| 173 | `placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",` |
| 174 | `canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],` |
| 175 | `cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],` |
| 177 | `safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",` |
| 188 | `cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],` |
| 189 | `destinations: ["Asset Library", "Content Studio", "Media Native"],` |
| 194 | `id: "publisher",` |
| 195 | `label: "Publisher",` |
| 196 | `position: "Publishing Readiness Lead",` |
| 198 | `summary: "Publishing readiness, schedule review, and handoff preparation.",` |
| 199 | `placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",` |
| 200 | `canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],` |
| 201 | `cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Push to live channels directly"],` |
| 202 | `destinations: ["Publishing", "Workflows", "AI Command"],` |
| 203 | `safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",` |
| 214 | `cannotDo: ["Launch ads directly", "Set live budgets without review", "Approve spend", "Access ad accounts directly"],` |
| 227 | `cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],` |
| 237 | `summary: "Claims review, approval safety, publishing risk, and governance notes.",` |
| 238 | `placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",` |
| 239 | `canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],` |
| 240 | `cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],` |
| 241 | `destinations: ["Workflows", "Publishing", "Governance"],` |
| 251 | `placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",` |
| 252 | `canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],` |
| 253 | `cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],` |
| 254 | `destinations: ["Workflows", "Operations Centers", "AI Command"],` |
| 255 | `safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",` |
| 266 | `cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],` |
| 268 | `safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",` |
| 279 | `cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],` |
| 280 | `destinations: ["CRM", "Workflows", "Operations Centers"],` |
| 281 | `safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",` |
| 286 | `// Role-specific suggested prompt chips (prefill only, no auto-execute)` |
| 297 | `{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },` |
| 300 | `media: [` |
| 304 | `{ label: "Prepare a media handoff", sub: "Package direction for the team" }` |
| 312 | `publisher: [` |
| 313 | `{ label: "Review publishing readiness", sub: "Check what is ready to publish" },` |
| 314 | `{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },` |
| 316 | `{ label: "Prepare a handoff package", sub: "For the approver review" }` |
| 332 | `{ label: "Flag publishing risks", sub: "Identify blockers before release" },` |
| 338 | `{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },` |
| 359 | `{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },` |
| 360 | `{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },` |
| 371 | `{ id: "execute", title: "Confirm", description: "Execution stays gated in backend-owned surfaces." },` |
| 378 | `{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },` |
| 383 | `const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];` |
| 389 | `media: "MD",` |
| 391 | `publisher: "PB",` |
| 402 | `media: "designer",` |
| 420 | `label: "Automation Architect",` |
| 423 | `summary: "Workflow blueprints and trigger maps will route to Workflows before execution."` |
| 430 | `{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },` |
| 438 | `{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }` |
| 440 | `media: [` |
| 441 | `{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },` |
| 445 | `{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }` |
| 450 | `{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },` |
| 454 | `publisher: [` |
| 455 | `{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },` |
| 456 | `{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },` |
| 458 | `{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },` |
| 459 | `{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }` |
| 472 | `{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },` |
| 479 | `{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },` |
| 483 | `{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },` |
| 487 | `{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }` |
| 494 | `{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },` |
| 501 | `{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },` |
| 502 | `{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },` |
| 506 | `{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },` |
| 530 | `{ id: "automation", label: "Automation" }` |
| 546 | `"Automation"` |
| 572 | `id: "media",` |
| 573 | `name: "Media Planner",` |
| 574 | `purpose: "Align media formats with channels, cadence, and readiness.",` |
| 576 | `suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."` |
| 596 | `bestUse: "When strategy needs stronger external evidence.",` |
| 602 | `purpose: "Translate intent into executable workflows and handoffs.",` |
| 614 | `let aiAutoModeUnsubscribe = null;` |
| 615 | `const aiAutomationState = {` |
| 620 | `function buildAutoPlanFromCommand(commandText, session) {` |
| 632 | `if (/act as the media director/i.test(text)) return "media";` |
| 634 | `if (/act as the publisher/i.test(text)) return "publisher";` |
| 649 | `const command = humanizeValue(commandText \|\| session?.draftMessage, "Prepare workflow action from AI command.");` |
| 652 | `id: `auto-generate-${Date.now()}`,` |
| 658 | `title: "AI command auto plan"` |
| 663 | `id: `auto-workflow-${Date.now()}`,` |
| 664 | `type: "prepare_workflow",` |
| 665 | `targetPage: "workflows",` |
| 666 | `action: "Prepare workflow from AI command",` |
| 669 | `reason: "AI command prepared for workflow execution."` |
| 675 | `if (/publish\s*now\|send\s*external\|paid\s*ads\|final\s*approval/i.test(command)) {` |
| 677 | `id: `auto-gated-${Date.now()}`,` |
| 678 | `type: "publish_now",` |
| 679 | `targetPage: "publishing",` |
| 680 | `action: "Publish now to external channels",` |
| 683 | `reason: "Requires approval gate before external publishing actions."` |
| 696 | `if (/act as the media director/i.test(text)) return "media";` |
| 698 | `if (/act as the publisher/i.test(text)) return "publisher";` |
| 786 | `"Draft a workflow sequence for:",` |
| 869 | `const configuredPublishLanguage = asString(` |
| 870 | `overview.publishing_language \|\|` |
| 871 | `overview.publish_language \|\|` |
| 876 | `const publishLanguage = configuredPublishLanguage \|\| "German";` |
| 882 | `).trim() \|\| "Auto";` |
| 886 | `publishLanguage,` |
| 1082 | `function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {` |
| 1083 | `if (typeof executeProjectAiGuidanceFn !== "function") {` |
| 1190 | `const teamWorkflowLines = safeMode === "Full Team"` |
| 1192 | `"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",` |
| 1203 | ``Publishable output language: ${safeOutputLanguage}`,` |
| 1207 | ``Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,` |
| 1208 | `"When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",` |
| 1209 | `...teamWorkflowLines,` |
| 1211 | ``When drafting publishable copy, write it in ${safeOutputLanguage}.`,` |
| 1212 | `"Never claim actions were executed.",` |
| 1213 | `"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",` |
| 1262 | `if (outputType === "workflow") return "workflows";` |
| 1263 | `if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";` |
| 1265 | `if (id === "media") return "media-studio";` |
| 1266 | `if (id === "video_lead") return "media-studio";` |
| 1267 | `if (id === "publisher") return "publishing";` |
| 1271 | `if (id === "operations") return outputType === "task" ? "task-center" : "workflows";` |
| 1273 | `if (id === "sales_crm") return "workflows";` |
| 1274 | `return "workflows";` |
| 1296 | `: activeTab === "workflow"` |
| 1297 | `? "workflow"` |
| 1304 | `const looksWorkflowLike = /\b(workflow\|workflows\|process\|sequence\|phase\|phases\|approval flow\|automation\|operating loop\|step-by-step\|steps\|dependencies\|trigger\|review gate\|execution flow)\b/.test(text);` |
| 1306 | `const looksMediaLike = /\b(media\|visual\|creative\|image\|images\|video\|reel\|storyboard\|shot list\|asset\|assets\|design\|production\|creative direction\|voiceover)\b/.test(text);` |
| 1307 | `const looksPublishingLike = /\b(publish\|publishing\|schedule\|channel package\|channel payload\|approval-ready post\|final post\|ready to publish\|publishing package)\b/.test(text);` |
| 1317 | `if (outputType === "workflow" \|\| looksWorkflowLike) {` |
| 1318 | `outputType = "workflow";` |
| 1319 | `return { outputType, destinationRoute: explicitDestination \|\| "workflows" };` |
| 1327 | `if (/media\|video\|visual\|asset\|creative/.test(outputType) \|\| looksMediaLike) {` |

_Trimmed: 229 additional matches not shown._

## Escaping / Text Safety Evidence

| Line | Code |
|---:|---|
| 629 | `const text = asString(prompt);` |
| 693 | `const text = asString(prompt);` |
| 724 | `function asString(value) {` |
| 768 | `project: asString(context.projectName \|\| "this project") \|\| "this project",` |
| 769 | `projectName: asString(context.projectName \|\| "this project") \|\| "this project",` |
| 770 | `specialist: asString(context.specialistLabel \|\| "Specialist") \|\| "Specialist",` |
| 771 | `specialistLabel: asString(context.specialistLabel \|\| "Specialist") \|\| "Specialist",` |
| 772 | `campaign: asString(context.campaign \|\| "active campaign") \|\| "active campaign"` |
| 775 | `return asString(template).replace(/\{(project\|projectName\|specialist\|specialistLabel\|campaign)\}/g, (_, token) => tokenMap[token] \|\| "");` |
| 780 | `let text = asString(value).trim();` |
| 855 | `const message = asString(error?.message).toLowerCase();` |
| 867 | `const rawMarket = asString(aiContext.market \|\| overview.market \|\| "").trim();` |
| 869 | `const configuredPublishLanguage = asString(` |
| 877 | `const conversationLanguage = asString(` |
| 892 | `return asString(value)` |
| 926 | `return asString(item.label \|\| item.title \|\| item.page \|\| item.query \|\| item.campaign_name \|\| item.name);` |
| 1023 | `session.draftMessage = asString(localDraft.prompt);` |
| 1026 | `if (localDraft.modeId) session.modeId = asString(localDraft.modeId);` |
| 1027 | `if (localDraft.commandType) session.commandType = asString(localDraft.commandType);` |
| 1028 | `if (localDraft.targetType) session.targetType = asString(localDraft.targetType);` |
| 1029 | `if (localDraft.targetValue) session.targetValue = asString(localDraft.targetValue);` |
| 1129 | `const firstUser = messages.find((message) => asString(message.role) === "user");` |
| 1130 | `const titleSeed = asString(options.title \|\| firstUser?.content \|\| responses[0]?.prompt \|\| "AI Team session").trim();` |
| 1131 | `const sessionId = asString(options.sessionId \|\| session.activeChatSessionId \|\| `chat-session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);` |
| 1140 | `createdAt: asString(options.createdAt \|\| session.activeChatSessionCreatedAt \|\| now),` |
| 1144 | `const nextSessions = [record, ...sessions.filter((item) => asString(item.id) !== sessionId)].slice(0, 20);` |
| 1155 | `const record = getAiChatSessions(projectName).find((item) => asString(item.id) === asString(sessionId));` |
| 1158 | `session.modeId = asString(record.modeId \|\| session.modeId \|\| "operations");` |
| 1159 | `session.teamMode = asString(record.teamMode \|\| "solo");` |
| 1169 | `session.activeChatSessionId = asString(record.id);` |
| 1170 | `session.activeChatSessionCreatedAt = asString(record.createdAt \|\| record.updatedAt \|\| nowIso());` |
| 1183 | `const cleanPrompt = asString(prompt).trim();` |
| 1184 | `const safeProject = asString(projectName \|\| "current project").trim();` |
| 1185 | `const safeSpecialist = asString(specialistLabel \|\| "Specialist").trim();` |
| 1186 | `const safeMode = asString(modeLabel \|\| "Solo Specialist").trim();` |
| 1187 | `const safeLanguage = asString(language \|\| "user language").trim();` |
| 1188 | `const safeOutputLanguage = asString(outputLanguage \|\| "German").trim();` |
| 1189 | `const safeMarket = asString(market \|\| "Germany").trim();` |
| 1281 | `const explicitDestination = asString(response.destinationRoute \|\| "").trim();` |
| 1290 | `].map((value) => asString(value).toLowerCase()).join(" ");` |
| 1292 | `let outputType = asString(response.outputType \|\| "").toLowerCase();` |
| 1379 | `const cleanPrompt = asString(prompt).trim();` |
| 1381 | `const specialistId = asString(specialist?.id \|\| "operations");` |
| 1839 | `const integrationId = asString(record?.integration_id \|\| record?.id).toLowerCase();` |
| 1840 | `const status = asString(record?.status \|\| record?.status_label).toLowerCase();` |
| 1873 | `const coveredCount = coverageEntries.filter(([, item]) => asString(item?.status) === "covered").length;` |
| 1881 | `if (asString(item?.status) !== "covered") {` |
| 1884 | `status: asString(item?.status) \|\| "missing",` |
| 1891 | `.filter((record) => ["error", "token_expired", "partial"].includes(asString(record?.status)))` |
| 1906 | `readinessStatus: asString(readinessDashboard.readiness_status \|\| overview.readiness_status \|\| "unknown"),` |
| 1961 | `const query = asString(text).toLowerCase();` |
| 1986 | `const query = asString(message).toLowerCase();` |
| 2000 | `return titleCase(asString(item).replace(/^connector:/, "").replace(/^asset:/, ""));` |
| 2014 | `if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {` |
| 2017 | `if (lane === "seo" && asString(coverage.seo_search_console?.status) !== "covered") {` |
| 2020 | `if (lane === "ads" && asString(coverage.paid_ads?.status) !== "covered") {` |
| 2196 | `const query = asString(message).toLowerCase();` |
| 2213 | `const query = asString(message).toLowerCase();` |
| 2337 | `lastCommand: asString(command),` |
| 2338 | `lastResponseTitle: asString(response?.title),` |
| 2424 | `const text = asString(value).trim();` |
| 2454 | `const clean = asString(value)` |
| 2466 | `const legacy = AI_INBOUND_SPECIALIST_ALIASES[raw] \|\| AI_INBOUND_SPECIALIST_ALIASES[asString(value).trim().toLowerCase()] \|\| raw;` |
| 2473 | `const clean = asString(value).trim().toLowerCase().replace(/[\s_]+/g, "-");` |
| 2501 | `const outputType = asString(preview.outputType \|\| preview.output_type \|\| preview.type \|\| "handoff").trim() \|\| "handoff";` |
| 2518 | `generatedAt: asString(preview.generatedAt \|\| preview.generated_at \|\| nowIso()),` |
| 2520 | `status: asString(preview.status \|\| "draft_preview"),` |
| 2553 | `.map((item) => asString(item).trim())` |
| 2631 | `status: asString(handoff?.status \|\| payload.status \|\| "available"),` |
| 2641 | `if (!handoffId \|\| handoffId === asString(session.lastAppliedHandoffId)) return;` |
| 2704 | `const cleanCommand = asString(command).trim();` |
| 2727 | `resolvedModeId = asString(classification.resolvedModeId) \|\| asString(result?.command?.mode_id) \|\| modeId \|\| session.modeId;` |
| 2728 | `commandId = asString(result?.command?.id);` |
| 2733 | `const failureReason = asString(payload?.error) \|\| asString(payloadResponse?.error) \|\| asString(error?.message) \|\| "AI provider failed to return output.";` |
| 2734 | `resolvedModeId = asString(payloadCommand?.mode_id) \|\| modeId \|\| session.modeId;` |
| 2735 | `commandId = asString(payloadCommand?.id);` |
| 2764 | `createdAt: asString(result?.command?.created_at) \|\| nowIso(),` |
| 2776 | `failed: asString(response.status).toLowerCase() === "failed"` |
| 2783 | `return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };` |
| 2793 | `const activeRole = asString(getProjectedActiveRole(state)).toLowerCase();` |
| 2798 | `const id = asString(member.role \|\| member.id).toLowerCase();` |
| 2808 | `name: asString(member.name \|\| fallback.name \|\| member.role \|\| "AI Specialist"),` |
| 2809 | `role: asString(member.role \|\| fallback.role \|\| id),` |
| 2810 | `purpose: asString(member.purpose \|\| member.description \|\| fallback.purpose \|\| "Support the current operating context."),` |
| 2811 | `bestUse: asString(member.bestUse \|\| member.best_use \|\| fallback.bestUse \|\| "Use when this specialist owns the next step."),` |
| 2817 | `function renderControlRoomHeader(aiContext, session, intelligenceStatus, escapeHtml) {` |
| 2843 | `<span class="ctrl-intel-dot ${escapeHtml(intelDotClass)}"></span>` |
| 2844 | `<span class="ctrl-intel-label">${escapeHtml(intelLabel)}</span>` |
| 2852 | `<strong>${escapeHtml(projectLabel)}</strong>` |
| 2856 | `<strong>${escapeHtml(readinessLabel)}</strong>` |
| 2860 | `<strong>${escapeHtml(coverageLabel)} connected</strong>` |
| 2864 | `<strong>${escapeHtml(aiContext.campaign \|\| "None")}</strong>` |
| 2866 | `${aiContext.market ? `<div class="ctrl-room-ctx-chip"><span>Market</span><strong>${escapeHtml(aiContext.market)}</strong></div>` : ""}` |
| 2872 | `${caps.slice(0, 8).map((cap) => `<span class="ctrl-room-cap-pill">${escapeHtml(cap)}</span>`).join("")}` |
| 2876 | `${session.intelligence.error ? `<div class="ctrl-intel-error">${escapeHtml(session.intelligence.error)}</div>` : ""}` |
| 2886 | `function renderTeamSelector(session, escapeHtml) {` |
| 2895 | `data-ctrl-mode="${escapeHtml(agent.id)}"` |
| 2896 | `title="${escapeHtml(agent.summary)}"` |
| 2899 | `<span class="ctrl-team-name">${escapeHtml(agent.label)}</span>` |
| 2912 | `function renderCommandComposer(session, aiContext, escapeHtml) {` |
| 2927 | `<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">${escapeHtml(mode.label)} — Command Composer</h3>` |
| 2939 | `placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"` |
| 2940 | `>${escapeHtml(session.draftMessage)}</textarea>` |
| 2957 | `${productOptions.map((opt) => `<option value="${escapeHtml(opt)}"${session.taskProduct === opt ? " selected" : ""}>${escapeHtml(opt)}</option>`).join("")}` |
| 2964 | `${channelOptions.map((ch) => `<option value="${escapeHtml(ch)}"${session.taskChannel === ch ? " selected" : ""}>${escapeHtml(ch)}</option>`).join("")}` |
| 2971 | `<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send prompt to ${escapeHtml(mode.label)}</button>` |
| 2985 | `function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {` |
| 2999 | `data-ctrl-quick="${escapeHtml(action.action)}"` |
| 3000 | `data-ctrl-quick-template="${escapeHtml(action.template.replace("{project}", projectLabel))}"` |
| 3004 | `<span class="ctrl-prompt-label">${escapeHtml(action.label)}</span>` |
| 3005 | `<span class="ctrl-prompt-sub">${escapeHtml(action.sub)}</span>` |
| 3019 | `function renderCleanResponse(response, escapeHtml, ownerId) {` |
| 3020 | `const hasError = asString(response.status).toLowerCase() === "failed" \|\| Boolean(asString(response.error));` |
| 3030 | `route: asString(record.route \|\| record.destination \|\| record.page),` |
| 3046 | `<span>${escapeHtml(asString(response.error) \|\| asString(response.summary) \|\| "AI provider error.")}</span>` |
| 3050 | `${title ? `<div class="ctrl-response-summary">${escapeHtml(title)}</div>` : ""}` |
| 3051 | `${summary ? `<div class="ctrl-response-body">${escapeHtml(summary)}</div>` : ""}` |
| 3057 | `${findings.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}` |
| 3066 | `${recommendations.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}` |
| 3075 | `${nextActions.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}` |

_Trimmed: 361 additional matches not shown._

## Focus Zones

### Imports / dependencies

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
```

### Route export / page metadata

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
```

### Main render zone

```js
 2762: 		role: "assistant",
 2763: 		modeId: resolvedModeId,
 2764: 		createdAt: asString(result?.command?.created_at) || nowIso(),
 2765: 		source: "durable-ai-response",
 2766: 		response
 2767: 	});
 2768: 
 2769: 	session.history.unshift({
 2770: 		id: commandId || `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
 2771: 		modeId: resolvedModeId,
 2772: 		command: cleanCommand,
 2773: 		createdAt,
 2774: 		source,
 2775: 		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
 2776: 		failed: asString(response.status).toLowerCase() === "failed"
 2777: 	});
 2778: 	session.history = session.history.slice(0, 14);
 2779: 	session.draftMessage = "";
 2780: 
 2781: 	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
 2782: 	await reloadProjectData?.(projectName);
 2783: 	return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };
 2784: }
 2785: 
 2786: // ============================================================
 2787: //  RENDER: CONTROL ROOM HEADER
 2788: // ============================================================
 2789: 
 2790: 
 2791: function buildProjectedAgentCards(state) {
 2792:   const projectedMembers = getProjectedTeamMembers(state);
 2793:   const activeRole = asString(getProjectedActiveRole(state)).toLowerCase();
 2794: 
 2795:   if (!projectedMembers.length) return AGENT_CARDS;
 2796: 
 2797:   return projectedMembers.map((member) => {
 2798:     const id = asString(member.role || member.id).toLowerCase();
 2799:     const fallback =
 2800:       AGENT_CARDS.find((agent) => agent.id === id) ||
 2801:       AGENT_CARDS.find((agent) => agent.id === "operations") ||
 2802:       AGENT_CARDS[0] ||
 2803:       {};
 2804: 
 2805:     return {
 2806:       ...fallback,
 2807:       id,
 2808:       name: asString(member.name || fallback.name || member.role || "AI Specialist"),
 2809:       role: asString(member.role || fallback.role || id),
 2810:       purpose: asString(member.purpose || member.description || fallback.purpose || "Support the current operating context."),
 2811:       bestUse: asString(member.bestUse || member.best_use || fallback.bestUse || "Use when this specialist owns the next step."),
 2812:       active: id === activeRole
 2813:     };
 2814:   });
 2815: }
 2816: 
 2817: function renderControlRoomHeader(aiContext, session, intelligenceStatus, escapeHtml) {
 2818: 	const projectLabel = aiContext.projectName || "No project selected";
 2819: 	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
 2820: 	const coverageLabel = aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal}` : "--";
 2821: 
 2822: 	const intelDotClass = { ready: "ready", loading: "loading", error: "error", idle: "idle" }[intelligenceStatus] || "idle";
 2823: 	const intelLabel = { ready: "Live intelligence loaded", loading: "Loading intelligence…", error: "Intelligence limited", idle: "Waiting for intelligence" }[intelligenceStatus] || "Idle";
 2824: 
 2825: 
 2826: 	const caps = [];
 2827: 	if (aiContext.projectName) caps.push("Campaign planning");
 2828: 	if (aiContext.hasLiveIntelligence) caps.push("Performance analysis");
 2829: 	if (aiContext.recommendations.length) caps.push(`${aiContext.recommendations.length} recommendations ready`);
 2830: 	if (aiContext.topContent.length) caps.push("Content intelligence");
 2831: 	if (aiContext.paid?.summary?.spend != null) caps.push("Paid media briefing");
 2832: 	if (aiContext.seo?.summary?.impressions != null) caps.push("SEO analysis");
 2833: 	caps.push("Content generation", "Research & competitor analysis", "Execution routing");
 2834: 
 2835: 	return `
 2836: 		<div class="ctrl-room-header">
 2837: 			<div class="ctrl-room-header-top">
 2838: 				<div>
 2839: 					<div class="ctrl-room-eyebrow">AI Workspace</div>
 2840: 					<h2 class="ctrl-room-title">Control Room</h2>
 2841: 				</div>
 2842: 				<div style="display:flex;align-items:center;gap:12px;">
 2843: 					<span class="ctrl-intel-dot ${escapeHtml(intelDotClass)}"></span>
 2844: 					<span class="ctrl-intel-label">${escapeHtml(intelLabel)}</span>
 2845: 					<button id="ctrlRefreshBtn" class="ctrl-secondary-btn" type="button">Refresh intelligence</button>
 2846: 				</div>
 2847: 			</div>
 2848: 
 2849: 			<div class="ctrl-room-context-bar">
 2850: 				<div class="ctrl-room-ctx-chip">
 2851: 					<span>Project</span>
 2852: 					<strong>${escapeHtml(projectLabel)}</strong>
 2853: 				</div>
 2854: 				<div class="ctrl-room-ctx-chip">
 2855: 					<span>Readiness</span>
 2856: 					<strong>${escapeHtml(readinessLabel)}</strong>
 2857: 				</div>
 2858: 				<div class="ctrl-room-ctx-chip">
 2859: 					<span>Coverage</span>
 2860: 					<strong>${escapeHtml(coverageLabel)} connected</strong>
 2861: 				</div>
 2862: 				<div class="ctrl-room-ctx-chip">
 2863: 					<span>Campaign</span>
 2864: 					<strong>${escapeHtml(aiContext.campaign || "None")}</strong>
 2865: 				</div>
 2866: 				${aiContext.market ? `<div class="ctrl-room-ctx-chip"><span>Market</span><strong>${escapeHtml(aiContext.market)}</strong></div>` : ""}
 2867: 			</div>
 2868: 
 2869: 			<div class="ctrl-room-cap-row">
 2870: 				<span class="ctrl-cap-heading">What AI can do now</span>
 2871: 				<div class="ctrl-room-capability-bar">
 2872: 					${caps.slice(0, 8).map((cap) => `<span class="ctrl-room-cap-pill">${escapeHtml(cap)}</span>`).join("")}
```

### Command input / chat zone

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
   61:                 routeHint: "media-studio"
   62:         },
   63:         {
   64:                 id: "publisher",
   65:                 label: "Publisher",
   66:                 icon: "📤",
   67:                 summary: "Publishing readiness, schedule review, and handoff preparation.",
   68:                 routeHint: "publishing"
   69:         },
   70:         {
   71:                 id: "ads",
   72:                 label: "Ads Optimizer",
   73:                 icon: "📣",
   74:                 summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
   75:                 routeHint: "ads-manager"
   76:         },
   77:         {
   78:                 id: "analyst",
   79:                 label: "SEO & Insights Analyst",
   80:                 icon: "📊",
   81:                 summary: "SEO signals, performance data, content insights, and traffic patterns.",
   82:                 routeHint: "insights"
```

### Action binding zone

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
```

### Provider / AI team zone

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
   61:                 routeHint: "media-studio"
   62:         },
   63:         {
```

### Media / publishing handoff zone

```js
    1: import {
    2:         bindAiToolDock,
    3:         getAiToolDockTools,
    4:         getSelectedLibrarySource,
    5:         openAiToolDrawerFromMetadata,
    6:         renderAiToolDrawerShell
    7: } from "./ai-command/tool-dock.js";
    8: import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
    9: 
   10: import {
   11:         selectCurrentProject,
   12:         selectOperationsSnapshot,
   13:         selectProjectPayload
   14: } from "../state.js";
   15: 
   16: import {
   17:         getSharedHandoff,
   18:         setSharedAiDraft,
   19:         setSharedHandoff
   20: } from "../shared-context.js";
   21: 
   22: import {
   23:         getCategoryReadinessList
   24: } from "../asset-library.js";
   25: 
   26: import {
   27:         executeProjectAiChat,
   28:         executeProjectAiGuidance
   29: } from "../api.js";
   30: 
   31: //  AI TEAM DEFINITIONS
   32: // ============================================================
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
   61:                 routeHint: "media-studio"
   62:         },
   63:         {
   64:                 id: "publisher",
   65:                 label: "Publisher",
   66:                 icon: "📤",
   67:                 summary: "Publishing readiness, schedule review, and handoff preparation.",
   68:                 routeHint: "publishing"
   69:         },
   70:         {
   71:                 id: "ads",
   72:                 label: "Ads Optimizer",
```

### Governance / approval zone

```js
   33: 
   34: const MODE_DEFS = [
   35:         {
   36:                 id: "strategist",
   37:                 label: "Strategist",
   38:                 icon: "🎯",
   39:                 summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
   40:                 routeHint: "campaign-studio"
   41:         },
   42:         {
   43:                 id: "writer",
   44:                 label: "Content Writer",
   45:                 icon: "✍️",
   46:                 summary: "Captions, hooks, scripts, emails, and landing page copy.",
   47:                 routeHint: "content-studio"
   48:         },
   49:         {
   50:                 id: "media",
   51:                 label: "Media Director",
   52:                 icon: "🎨",
   53:                 summary: "Visual direction, creative brief, format guidance, and brand consistency.",
   54:                 routeHint: "media-studio"
   55:         },
   56:         {
   57:                 id: "video_lead",
   58:                 label: "Video Lead",
   59:                 icon: "🎬",
   60:                 summary: "Short-form video scripts, motion direction, and reel strategy.",
   61:                 routeHint: "media-studio"
   62:         },
   63:         {
   64:                 id: "publisher",
   65:                 label: "Publisher",
   66:                 icon: "📤",
   67:                 summary: "Publishing readiness, schedule review, and handoff preparation.",
   68:                 routeHint: "publishing"
   69:         },
   70:         {
   71:                 id: "ads",
   72:                 label: "Ads Optimizer",
   73:                 icon: "📣",
   74:                 summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
   75:                 routeHint: "ads-manager"
   76:         },
   77:         {
   78:                 id: "analyst",
   79:                 label: "SEO & Insights Analyst",
   80:                 icon: "📊",
   81:                 summary: "SEO signals, performance data, content insights, and traffic patterns.",
   82:                 routeHint: "insights"
   83:         },
   84:         {
   85:                 id: "compliance_reviewer",
   86:                 label: "Compliance Reviewer",
   87:                 icon: "🛡️",
   88:                 summary: "Claims review, approvals, safety language, and governance checks.",
   89:                 routeHint: "governance"
   90:         },
   91:         {
   92:                 id: "operations",
   93:                 label: "Operations Lead",
   94:                 icon: "⚙️",
   95:                 summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
   96:                 routeHint: "workflows"
   97:         },
   98:         {
   99:                 id: "customer_ops",
  100:                 label: "Customer Operations Lead",
  101:                 icon: "🎧",
  102:                 summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
  103:                 routeHint: "operations-centers"
  104:         },
  105:         {
  106:                 id: "sales_crm",
  107:                 label: "Sales / CRM Lead",
  108:                 icon: "💼",
  109:                 summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
  110:                 routeHint: "workflows"
  111:         }
  112: ];
  113: 
  114: // Map legacy mode IDs from older sessions to new team IDs
  115: const MODE_ID_ALIASES = {
  116: 	executive: "operations",
  117: 	campaign: "strategist",
  118: 	content: "writer",
  119: 	designer: "media",
  120: 	media_director: "media",
  121: 	media_planner: "media",
  122: 	seo: "analyst",
  123: 	research: "researcher",
  124: 	video_lead: "video_lead",
  125: 	publisher: "publisher",
  126: 	compliance_reviewer: "compliance_reviewer",
  127: 	customer_operations: "customer_ops",
  128: 	customer_ops: "customer_ops",
  129: 	support: "customer_ops",
  130: 	sales: "sales_crm",
  131: 	crm: "sales_crm",
  132: 	sales_crm: "sales_crm",
  133: 	admin: "operations"
  134: };
  135: 
  136: // ============================================================
  137: //  PHASE 1: SPECIALIST DEFINITIONS — AI TEAM COMMAND CENTER
  138: // ============================================================
  139: 
  140: const SPECIALIST_DEFS = [
  141: 	{
  142: 		id: "strategist",
  143: 		label: "Strategist",
```

## Decision Checklist
- If AI Command only prepares/guides and does not execute protected actions directly: likely safe.
- If it claims publish/execute/optimize without backend result or governance boundary: patch wording.
- If any destructive/external action exists without confirmation: patch local confirmation.
- If provider/team handoff is unclear: patch UX copy, not backend.
- If innerHTML renders unescaped user/project content: patch escaping at smallest boundary.
- If page is mostly safe but not international-grade: defer to UX polish phase.
- Do not change CSS in this phase.
- Do not change backend authority.
- Do not change data/projects.
