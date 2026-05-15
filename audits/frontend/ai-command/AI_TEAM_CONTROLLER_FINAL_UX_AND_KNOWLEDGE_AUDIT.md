# AI Team Controller Final UX and Specialist Knowledge Architecture Audit

Date: 2026-05-15  
Branch: architecture/frontend-consolidation-v1  
Mode: Discovery-only audit, no implementation

## 1. Scope and audit objective

This audit evaluates the current AI Team Controller experience and specialist knowledge architecture across frontend, API bridge, runtime orchestrator, and existing documentation.

Primary goals:

1. Identify what already exists.
2. Identify overlapping or duplicate files/components.
3. Verify whether AI Team playbooks already exist.
4. Propose exact files to edit versus create.
5. Define final premium UX architecture for AI Team Controller.
6. Define specialist tools, profile/settings, and knowledge/playbook model.
7. Define safe behavior boundaries and phased implementation sequence.

## 2. Discovery map: what already exists

### 2.1 Core implementation files (active)

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- public/control-center/api.js
- runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- runtime/orchestrator-service/lib/ai/provider-config.js
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/shared-context.js

### 2.2 Existing AI Team model and role surfaces

- Shared model exists but is currently not consumed by pages:
  - public/control-center/ai-team-model.js
- Additional role models exist in page-local form:
  - public/control-center/pages/home.js
  - public/control-center/pages/settings.js
  - public/control-center/pages/media-studio-workspace.js
  - public/control-center/pages/content-studio-workspace.js
  - public/control-center/pages/campaign-studio.js
  - public/control-center/pages/research.js

### 2.3 Existing AI Command audit corpus (already extensive)

- audits/frontend/ai-command/AI_COMMAND_SPECIALIST_WORKSPACE_PRE_UPGRADE_AUDIT.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_1_SPECIALIST_WORKSPACE_FOUNDATION.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_2_RESULTS_PREVIEW_AND_DRAFT_OUTPUTS.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_3_SPECIALIST_CHAT_RESPONSE_BRIDGE.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_3B_GUIDANCE_ONLY_RESPONSE_ENDPOINT.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_3C_RESPONSE_QUALITY_AND_LANGUAGE_CONTROL.md
- audits/frontend/ai-command/AI_COMMAND_PHASE_3_5_FINAL_TEAM_COMMAND_CENTER_UX.md
- audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md

### 2.4 Frontend authority/blueprint master docs (already present)

- audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md
- audits/frontend/master/PAGE_BLUEPRINTS.md
- audits/frontend/master/ACTION_DESTINATION_MAP.md

### 2.5 Prompt and specialist policy docs (already present)

- prompts/orchestrator.md
- prompts/dev-agent.md
- prompts/marketing-agent.md
- prompts/ops-agent.md
- prompts/writing-agent.md

Conclusion: there is already substantial AI Team documentation, but no single final controller-focused UX + specialist knowledge architecture doc that reconciles current code state and duplication into one implementation-ready plan.

## 3. Overlap and duplication findings

### 3.1 Role/model duplication (high impact)

Role definitions are duplicated across multiple sources with drift in naming and semantics:

- public/control-center/ai-team-model.js (canonical candidate, currently unused)
- public/control-center/pages/ai-command.js (MODE_DEFS, SPECIALIST_DEFS, AGENT_CARDS, suggested prompts)
- public/control-center/pages/home.js (role prompts and card semantics)
- public/control-center/pages/settings.js (TEAM_ROLE_MATRIX)
- public/control-center/pages/media-studio-workspace.js (SPECIALISTS)
- runtime/orchestrator-service/lib/ops/ai-orchestrator.js (SPECIALIST_MODE_MAP)
- runtime/orchestrator-service/lib/ai/provider-config.js (AI_MODE_PROMPTS)

Observed drift examples:

- ads, ads_operator, Ads Specialist, Ads Optimizer
- writer, content_writer, Content Writer
- operations, admin, operations_lead
- media, designer, media_director

### 3.2 AI Command internal duplication (high impact)

In public/control-center/pages/ai-command.js:

- Multiple UX generations coexist in one file:
  - ctrl-* operating room layer
  - aicmd-v2 specialist workspace layer
- Duplicate specialist detection logic exists in two places (nested and top-level detectSpecialistFromBridgePrompt).
- Route meta still says AI Workspace while main visible title is AI Team Command Center.

### 3.3 Documentation overlap (medium impact)

The AI Command audit folder contains sequential phase documents that partially overlap in problem statements, making onboarding and final decision extraction slower.

### 3.4 CSS complexity overlap (medium impact)

- public/control-center/styles/12-pages.css contains broad multi-page rules plus large AI Command sections.
- AI Command now has extensive dedicated styles in the same global page stylesheet; maintainability risk increases as phases continue.

## 4. Current UX and product problems

1. The experience is functional but still reads as a technical implementation surface rather than a premium specialist control room.
2. Specialist identity is present but fragmented across duplicated models and inconsistent labels.
3. Chat quality is improved at backend prompt level but still limited by inconsistent role source-of-truth and weak context governance per specialist.
4. Team controller layout is dense and implementation-oriented; hierarchy between chat, tools, outputs, knowledge, and settings is not strict enough.
5. Knowledge architecture is implicit in code and state, not explicit in a durable specialist playbook model.
6. Tooling is present but mixed with preview and routing actions, reducing clarity for users.
7. Safety is correctly guarded in many places, but capability messaging is still spread across sections and phases.

## 5. Existing AI Team docs and playbooks: audit answer

### 5.1 What exists

- Many audits and phase docs exist for AI Command UX and safety.
- Generic agent prompt files exist under prompts.
- Backend and frontend role maps exist.

### 5.2 What does not exist yet

- No single authoritative specialist knowledge/playbook set per role that is versioned as product truth and mapped directly to AI Team Controller UI sections.
- No consolidated final AI Team Controller UX + knowledge contract replacing phase-by-phase scattered references.

## 6. Final recommended AI Team Controller architecture

### 6.1 Final layout (premium and clear)

Primary layout:

1. Header strip: project, active mission, mode, safety state, intelligence freshness.
2. Team rail: solo/full-team toggle, role roster, active role state, quick switch.
3. Main workspace (tabbed):
   - Chat
   - Tools
   - Outputs
   - Knowledge
   - Settings
4. Right rail (persistent):
   - Specialist profile card
   - Safety/confirmation summary
   - Destination routing panel

### 6.2 UX simplification rules

Remove or collapse:

- Duplicate status strips that repeat same state.
- Redundant chips that do not change decisions.
- Parallel copies of specialist descriptions.
- Hidden helper sections that duplicate tab content.

Keep and strengthen:

- Ask Specialist entry path.
- Explicit guidance-only labeling.
- Output preview with destination and confirmation state.
- Route suggestions tied to safe destination pages.

## 7. Specialist tools model (final)

Tool categories (single taxonomy across all specialists):

1. Compose: prompt/preset builders.
2. Analyze: diagnostics and gap analysis.
3. Draft: task/workflow/handoff/output generation (local or guidance-only).
4. Route: send prepared context to destination page.
5. Validate: policy/readiness/risk checks.

Tool action contract:

- Every tool action is labeled as one of:
  - guidance-only
  - draft-only
  - route-only
  - confirmation-required
- No tool may imply execution unless explicit backend-supported confirmation flow exists.

## 8. Specialist profile and settings model (final)

Per specialist profile fields:

1. identity: id, label, icon, version
2. mission: purpose, best-use, outcomes
3. capabilities: can_help_with
4. boundaries: cannot_do
5. tools: available_tools with action contract
6. destinations: target pages and route rationale
7. knowledge_sources: attached playbook references
8. response_rules: tone, structure, language policy, evidence policy
9. safety_rules: confirmation gates and restricted actions

Settings sections:

1. team mode defaults (solo/full-team behavior)
2. response quality controls (depth, structure, language strictness)
3. knowledge attachment controls (project docs, brand docs, campaign docs)
4. safety controls (gating policy, protected actions)

## 9. Knowledge and playbook recommendation

### 9.1 Recommended document architecture

Edit and consolidate existing docs first; create only missing essentials:

- Keep master authority in audits/frontend/master.
- Keep phase history docs as archive trail.
- Add one final operating playbook family for active product use.

### 9.2 Recommended new playbook set (only after implementation approval)

1. docs/system/ai-team/AI_TEAM_CONTROLLER_PLAYBOOK.md
2. docs/system/ai-team/specialists/STRATEGIST_PLAYBOOK.md
3. docs/system/ai-team/specialists/WRITER_PLAYBOOK.md
4. docs/system/ai-team/specialists/MEDIA_DIRECTOR_PLAYBOOK.md
5. docs/system/ai-team/specialists/VIDEO_LEAD_PLAYBOOK.md
6. docs/system/ai-team/specialists/PUBLISHER_PLAYBOOK.md
7. docs/system/ai-team/specialists/ADS_OPTIMIZER_PLAYBOOK.md
8. docs/system/ai-team/specialists/ANALYST_PLAYBOOK.md
9. docs/system/ai-team/specialists/COMPLIANCE_REVIEWER_PLAYBOOK.md
10. docs/system/ai-team/specialists/OPERATIONS_LEAD_PLAYBOOK.md

Each playbook should define:

- purpose
- required context
- answer contract
- output formats
- do-not-do rules
- destination mapping
- safety and escalation policy

## 10. What to edit vs what to create

### 10.1 Edit (exact files)

Priority edit set:

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- public/control-center/ai-team-model.js
- public/control-center/pages/home.js
- public/control-center/pages/settings.js
- runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- runtime/orchestrator-service/lib/ai/provider-config.js

Documentation edit set:

- audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md (reference link to final contract)
- audits/frontend/master/PAGE_BLUEPRINTS.md (align AI Command blueprint)

### 10.2 Create (after edit consolidation and approval)

- docs/system/ai-team/AI_TEAM_CONTROLLER_PLAYBOOK.md
- docs/system/ai-team/specialists/*.md (role playbooks listed above)
- optional: public/control-center/ui/ai-team-controller/ module split if code extraction is approved

## 11. Exact implementation phases

### Phase 0: Consolidation baseline

1. Freeze current behavior and map active vs dead sections in ai-command.js.
2. Decide single role schema source (use ai-team-model as canonical frontend source).
3. Preserve current guarded behavior.

### Phase 1: Role and profile unification

1. Refactor AI Command, Home, and Settings to consume one role model.
2. Remove role label/id drift and alias mismatch.
3. Keep old aliases only as compatibility mapping.

### Phase 2: Workspace IA finalization

1. Implement strict tabs: Chat, Tools, Outputs, Knowledge, Settings.
2. Collapse duplicates and remove technical clutter from default view.
3. Keep safety and destination panels always visible.

### Phase 3: Response quality hardening

1. Expand role-specific response contracts.
2. Improve guidance prompt construction with knowledge attachments.
3. Add output templates per specialist with deterministic sections.

### Phase 4: Knowledge/playbook activation

1. Introduce final playbook docs.
2. Bind playbook references into specialist profile and prompt assembly.
3. Add UI visibility for attached knowledge sources.

### Phase 5: Safe capability expansion

1. Enable only backend-supported safe features.
2. Add confirmation-gated paths for high-impact actions.
3. Keep unsupported capabilities marked as planned/guarded.

## 12. Safety boundaries (must remain enforced)

1. Do not allow frontend-only execution authority.
2. Do not auto-run workflows, publish, approvals, or destructive actions from chat/tool clicks.
3. Keep guidance-only path side-effect free unless explicit confirmed execution mode is introduced.
4. Keep media generation and voice features guarded until provider and worker readiness are safe and explicit.
5. Preserve backend authority for approvals, governance, and durable records.
6. Preserve transparent status labeling for unavailable/planned capabilities.

## 13. Final recommendation before coding

Recommended next action:

1. Approve a consolidation-first implementation that unifies role model and removes duplication before new UI polish.
2. Treat AI Team Controller as a product control room with strict information architecture, not a generic chat page.
3. Implement in phases above, with safety invariants as release gates.

Decision gate for implementation readiness:

- Proceed only after explicit agreement on canonical role model source, tab IA, and playbook structure.
