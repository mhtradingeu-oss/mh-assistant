# Phase 3A Tool Metadata Scan

Report-only artifact for Phase 3A. This scan prepares the safe implementation plan for normalizing AI Tool Dock metadata for all non-writer specialists. It does not change app code, CSS, backend files, or `data/projects/*`.

Inputs used:

- `audits/frontend/ai-team-tools/AI_TEAM_PAGE_DEEP_AUDIT.md`
- `audits/frontend/ai-team-tools/AI_SPECIALIST_TOOL_MATRIX.md`
- `audits/frontend/ai-team-tools/AI_TEAM_TOOLING_CLEANUP_PLAN.md`
- `audits/frontend/ai-team-tools/AI_TEAM_TOOLS_SYSTEM_BLUEPRINT.md`
- `audits/frontend/ai-team-tools/CONTENT_WRITER_TOOL_INTELLIGENCE.md`
- `audits/frontend/ai-team-tools/SMART_SPECIALIST_TOOL_DRAWER_FRAMEWORK.md`
- `public/control-center/pages/ai-command/tool-dock.js`
- `public/control-center/pages/ai-command.js`

## 1. Current tool-dock.js structure

### Registry location

- `BASE_TOOL_DOCK_TOOLS` exists at `public/control-center/pages/ai-command/tool-dock.js:1-23`.
- `TOOL_DOCK_BY_SPECIALIST` starts at `public/control-center/pages/ai-command/tool-dock.js:25`.
- `TOOL_DOCK_BY_SPECIALIST` ends at `public/control-center/pages/ai-command/tool-dock.js:524`.
- The current registry contains these specialist keys:
  - `strategist`
  - `writer`
  - `media`
  - `video_lead`
  - `publisher`
  - `ads`
  - `analyst`
  - `compliance_reviewer`
  - `operations`
  - `customer_ops`
  - `sales_crm`

### getSpecialistTools

`getSpecialistTools()` is at `tool-dock.js:526-528`.

Current behavior:

```js
function getSpecialistTools(specialistId = "") {
  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
}
```

It accepts a specialist id and returns the matching registry entry. If the id is missing or unknown, it falls back to `operations`. This means metadata normalization must preserve `operations` as a safe default specialist.

### getDockTools

`getDockTools()` is at `tool-dock.js:530-539`.

Current behavior:

- Team mode returns six tools:
  - first two `strategist` tools
  - first two `writer` tools
  - first two `operations` tools
- Solo mode returns up to nine tools for the selected specialist.
- No metadata transformation happens here. The function only selects tool objects.

### renderAiToolDock metadata serialization

`renderAiToolDock()` is at `tool-dock.js:668-707`.

It renders the compact dock and appends `renderSmartToolDrawerShell(safe)` after the dock. Each tool becomes a button with serialized metadata in `data-aicmd-tool-dock-*` attributes:

- `data-aicmd-tool-dock`
- `data-aicmd-tool-dock-label`
- `data-aicmd-tool-dock-icon`
- `data-aicmd-tool-dock-badge`
- `data-aicmd-tool-dock-action`
- `data-aicmd-tool-dock-safety`
- `data-aicmd-tool-dock-owner`
- `data-aicmd-tool-dock-destinations`
- `data-aicmd-tool-dock-sources`
- `data-aicmd-tool-dock-outputs`
- `data-aicmd-tool-dock-template`

Current fallback serialization:

- `actionType || "guided"`
- `safetyLevel || "review_only"`
- `frontendOwnerPage || "ai-command"`
- `destinations || ["chat-preview"]`
- `sourceTypes || ["current_chat"]`
- `outputTypes || [tool.id || "tool_output"]`

Array metadata is serialized through `joinMetaList()` into pipe-delimited strings for the drawer. The drawer currently receives serialized strings from the rendered button, not live JS objects.

### Smart drawer support functions

The generic drawer shell is rendered by `renderSmartToolDrawerShell()` at `tool-dock.js:558-666`.

Relevant helper flow:

- `humanizeMeta()` at `tool-dock.js:710-737` converts ids such as `content_studio` or `crm` into readable labels.
- `renderDrawerChips()` at `tool-dock.js:739-749` renders metadata chips, although current CSS hides those chip rows.
- `getMetaValues()` at `tool-dock.js:751-756` parses pipe-delimited metadata.
- `populateDrawerSelect()` at `tool-dock.js:758-774` creates dropdown options from metadata.
- `buildSmartToolComposerPrompt()` at `tool-dock.js:812-873` builds the final composer instruction.
- `openToolDrawer()` at `tool-dock.js:913-952` reads metadata from the clicked dock button, populates drawer fields, opens the drawer, and updates status.

### bindAiToolDock opens drawer or prefill

`bindAiToolDock()` starts at `tool-dock.js:954`.

Current binding behavior:

- Close buttons call `closeToolDrawer(drawer)`.
- `Open Library` only updates status and navigates to `#library`; it does not preserve selected source context yet.
- `Use in Composer` reads the drawer setup, builds a prompt with `buildSmartToolComposerPrompt()`, writes it to `session.draftMessage` and `session.composerText`, updates the input value, persists the local session draft, closes the drawer, and focuses the input.
- Dock button clicks read `data-aicmd-tool-dock-template`, `data-aicmd-tool-dock`, and `data-aicmd-tool-dock-action`.
- If `actionType !== "prefill"`, `openToolDrawer()` is attempted.
- If the drawer cannot open, or if action type is `prefill`, the raw template is token-replaced and inserted into the composer.

Important current consequence:

- Because `renderAiToolDock()` falls back to `actionType: "guided"`, every non-writer fallback tool opens the smart drawer today.
- The drawer works, but non-writer tools show generic fallback destinations, sources, and output types.

### ai-command.js integration points

`ai-command.js` imports the dock at `public/control-center/pages/ai-command.js:1`:

```js
import { bindAiToolDock, renderAiToolDock } from "./ai-command/tool-dock.js";
```

The compact Tool Dock is rendered inside the composer at `ai-command.js:3810`.

The dock is bound at `ai-command.js:4683`.

`ai-command.js` also contains parallel specialist concepts:

- `MODE_DEFS` at `ai-command.js:28`
- `SPECIALIST_DEFS` at `ai-command.js:134`
- `PHASE35_SPECIALIST_TOOLS` at `ai-command.js:394`
- legacy alias mapping where `seo` maps to `analyst`, and `research` maps to `researcher`

These parallel structures should not be changed in Phase 3B. They are important cleanup targets for later phases, but the metadata normalization can be contained in `tool-dock.js`.

## 2. Current specialists

### strategist

Metadata status: fallback-only. Current tools define `id`, `icon`, `label`, `badge`, and `template`; they do not define `actionType`, `safetyLevel`, `frontendOwnerPage`, `destinations`, `sourceTypes`, or `outputTypes`.

| id | label | badge | template |
| --- | --- | --- | --- |
| `campaign-plan` | Campaign | Plan | Create a campaign plan for `{projectName}`. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only. |
| `launch-plan` | Launch | Plan | Build a launch plan for `{projectName}`. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions. |
| `audience` | Audience | Map | Map the target audience for `{projectName}`. Include segments, needs, objections, buying triggers, and message angles. |
| `offer` | Offer | Value | Create offer angles for `{projectName}`. Include value proposition, benefits, proof points, CTA ideas, and risk notes. |
| `funnel` | Funnel | Flow | Map a funnel for `{projectName}`. Include awareness, consideration, conversion, retention, content needs, and handoff points. |
| `priority` | Priority | Next | Prioritize the next best actions for `{projectName}`. Separate urgent, important, blocked, and later work. |

### writer

Metadata status: complete. Current Content Writer tools define the full runtime schema: `id`, `label`, `icon`, `badge`, `actionType`, `safetyLevel`, `frontendOwnerPage`, `destinations`, `sourceTypes`, `outputTypes`, and `template`.

| id | label | badge | template |
| --- | --- | --- | --- |
| `write` | Write | Create | Use the Content Writer to create a new written output for `{projectName}`. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything. |
| `rewrite` | Rewrite | Edit | Rewrite the current text for `{projectName}`. Keep the meaning, improve clarity, structure, and tone. Offer variants such as professional, shorter, simpler, more persuasive, premium, or platform-specific. Do not publish anything. |
| `translate` | Translate | Localize | Translate and localize the current text for `{projectName}`. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready. |
| `improve` | Improve | Quality | Improve this content for `{projectName}`. Focus on clarity, flow, value proposition, CTA strength, trust signals, readability, and conversion. Return practical improvements and a better draft. |
| `check` | Check | Review | Check this content for `{projectName}`. Review grammar, spelling, tone, readability, CTA strength, claim risk, missing proof, SEO weakness, and compliance notes. Return issues, severity, and suggested fixes. |
| `sources` | Sources | Context | Prepare source context for the next Content Writer task for `{projectName}`. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input. |
| `seo` | SEO | Search | Prepare SEO support for `{projectName}`. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes. |
| `repurpose` | Repurpose | Adapt | Repurpose existing content for `{projectName}`. Ask or infer the source format and target format: blog to posts, profile to pitch, product page to ad copy, transcript to article, notes to presentation outline, or long text to email sequence. |
| `send` | Send | Route | Prepare safe routing for this Content Writer output for `{projectName}`. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review. |

### media

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `visual-brief` | Visual Brief | Design | Prepare a visual brief for `{projectName}`. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA. |
| `moodboard` | Moodboard | Style | Define a moodboard direction for `{projectName}`. Include visual references, atmosphere, color feel, texture, layout mood, and brand alignment. |
| `image-prompt` | Image | Prompt | Create image generation prompts for `{projectName}`. Include scene, subject, lighting, style, composition, negative constraints, and brand notes. |
| `asset-list` | Assets | List | Create an asset checklist for `{projectName}`. Include logos, product shots, lifestyle images, certificates, icons, testimonials, and missing assets. |
| `layout` | Layout | Plan | Create a layout plan for `{projectName}`. Include sections, hierarchy, visual blocks, CTA placement, and responsive notes. |
| `brand-check` | Brand Check | Review | Review the visual direction for brand consistency. Flag risks, missing assets, style mismatches, and improvement actions. |

### video_lead

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `reel-script` | Reel | Script | Write a short-form reel script for `{projectName}`. Include hook, scene sequence, voiceover, text overlays, CTA, and shot notes. |
| `storyboard` | Storyboard | Video | Create a storyboard for `{projectName}`. Include scenes, camera direction, motion, captions, assets needed, and CTA. |
| `shot-list` | Shot List | Plan | Create a shot list for `{projectName}`. Include product shots, lifestyle shots, closeups, transitions, and required props. |
| `voiceover` | Voiceover | Audio | Draft a voiceover script for `{projectName}`. Include tone, pacing, hook, proof points, and CTA. |
| `video-cta` | Video CTA | Action | Create CTA options for a video campaign for `{projectName}`. Include soft, direct, urgency, and brand-led versions. |

### publisher

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `publish-check` | Publish Check | Ready | Review publishing readiness for `{projectName}`. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish. |
| `channel-pack` | Channel Pack | Prep | Prepare a channel package for `{projectName}`. Include caption, hashtags, format notes, asset needs, schedule notes, and approval checklist. |
| `schedule` | Schedule | Plan | Draft a publishing schedule for `{projectName}`. Include channels, timing, dependencies, review gates, and next actions. |
| `hashtags` | Hashtags | SEO | Suggest hashtags and discoverability tags for `{projectName}`. Group them by brand, product, audience, niche, and market. |
| `approval-pack` | Approval | Pack | Prepare an approval package for `{projectName}`. Include final copy summary, risk notes, assets checklist, and required confirmations. |

### ads

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `ad-angle` | Ad Angle | Paid | Create paid ad angles for `{projectName}`. Include hook, audience pain, benefit, proof, CTA, and compliance risks. |
| `ad-copy` | Ad Copy | Draft | Draft paid ad copy variants for `{projectName}`. Include primary text, headline, CTA, and angle notes. |
| `targeting` | Targeting | Map | Map targeting ideas for `{projectName}`. Include audience groups, interests, exclusions, funnel stage, and testing notes. |
| `creative-test` | Creative | Test | Create a creative testing plan for `{projectName}`. Include hypotheses, variants, success signals, and next actions. |
| `landing-match` | Landing | Match | Review ad-to-landing-page message match for `{projectName}`. Identify gaps, stronger claims, CTA improvements, and trust signals. |

### analyst

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `seo-brief` | SEO Brief | Search | Create an SEO brief for `{projectName}`. Include keywords, search intent, content structure, meta ideas, internal links, and risks. |
| `insights` | Insights | Data | Summarize insights for `{projectName}`. Include what is working, what is weak, missing data, and next optimization actions. |
| `keywords` | Keywords | SEO | Suggest keyword groups for `{projectName}`. Include commercial, informational, branded, product, and local intent clusters. |
| `performance` | Performance | Review | Review performance signals for `{projectName}`. Identify wins, risks, gaps, and recommended next experiments. |
| `content-gap` | Gaps | Plan | Identify content gaps for `{projectName}`. Include missing pages, missing topics, weak funnel stages, and priority actions. |

### compliance_reviewer

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `claims-check` | Claims | Check | Review claims for `{projectName}`. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements. |
| `safe-rewrite` | Safe Rewrite | Copy | Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims. |
| `evidence` | Evidence | Need | List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof. |
| `gdpr` | GDPR | Review | Review GDPR/privacy considerations for this content or workflow. Flag consent, tracking, data use, and disclosure risks. |
| `approval-notes` | Approval | Notes | Prepare approval notes for `{projectName}`. Include risks, required reviewer, unresolved issues, and safe next actions. |

### operations

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `task-plan` | Task Plan | Ops | Turn this into a task plan for `{projectName}`. Include owners, priorities, dependencies, risks, and next steps. |
| `workflow` | Workflow | Draft | Draft a workflow for `{projectName}`. Include steps, triggers, inputs, outputs, owners, review gates, and execution risks. |
| `handoff` | Handoff | Route | Prepare a handoff summary for `{projectName}`. Include context, destination workspace, owner, required inputs, and review notes. |
| `timeline` | Timeline | Plan | Create a timeline for `{projectName}`. Include milestones, blockers, dependencies, and safe sequencing. |
| `checklist` | Checklist | Ops | Create an execution checklist for `{projectName}`. Include required approvals, assets, content, integrations, and QA steps. |

### customer_ops

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `reply-draft` | Reply | Draft | Draft a safe customer reply for `{projectName}`. Do not send it. Include empathy, answer, next step, and escalation note if needed. |
| `ticket` | Ticket | Draft | Prepare a ticket draft for `{projectName}`. Include issue summary, priority, owner, customer impact, and missing information. |
| `sla` | SLA | Risk | Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions. |
| `summary` | Summary | CX | Summarize the customer context for `{projectName}`. Include issue, sentiment, open questions, risk, and next response. |

### sales_crm

Metadata status: fallback-only.

| id | label | badge | template |
| --- | --- | --- | --- |
| `sales-pitch` | Pitch | Sales | Create a sales pitch for `{projectName}`. Include value proposition, customer pain, proof, offer, CTA, and follow-up note. |
| `follow-up` | Follow-up | Email | Draft a sales follow-up for `{projectName}`. Include context, value reminder, question, CTA, and next step. |
| `objections` | Objection | Sales | Prepare objection handling for `{projectName}`. Include likely objections, safe answers, proof needed, and next action. |
| `lead-brief` | Lead Brief | CRM | Create a lead brief for `{projectName}`. Include profile, need, fit, opportunity, risks, and recommended outreach. |

## 3. Metadata gaps

Content Writer already has full runtime metadata. Every non-writer specialist currently relies on render fallbacks for the drawer fields below.

| Specialist | Missing actionType | Missing safetyLevel | Missing frontendOwnerPage | Missing destinations | Missing sourceTypes | Missing outputTypes |
| --- | --- | --- | --- | --- | --- | --- |
| `strategist` | all tools | all tools | all tools | all tools | all tools | all tools |
| `media` | all tools | all tools | all tools | all tools | all tools | all tools |
| `video_lead` | all tools | all tools | all tools | all tools | all tools | all tools |
| `publisher` | all tools | all tools | all tools | all tools | all tools | all tools |
| `ads` | all tools | all tools | all tools | all tools | all tools | all tools |
| `analyst` | all tools | all tools | all tools | all tools | all tools | all tools |
| `compliance_reviewer` | all tools | all tools | all tools | all tools | all tools | all tools |
| `operations` | all tools | all tools | all tools | all tools | all tools | all tools |
| `customer_ops` | all tools | all tools | all tools | all tools | all tools | all tools |
| `sales_crm` | all tools | all tools | all tools | all tools | all tools | all tools |

Runtime impact today:

- `actionType` becomes `guided`.
- `safetyLevel` becomes `review_only`.
- `frontendOwnerPage` becomes `ai-command`.
- `destinations` becomes only `chat-preview`.
- `sourceTypes` becomes only `current_chat`.
- `outputTypes` becomes only the tool id.

This keeps the drawer safe, but it makes non-writer specialists feel generic and weak. Phase 3B should add explicit metadata while preserving the same safe runtime behavior.

## 4. Proposed normalized metadata

This section proposes the exact fields to add in Phase 3B for non-writer tools. The template strings should remain close to the current templates in Phase 3B; the summaries below explain the intended template purpose without writing the JS patch.

### strategist proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `campaign-plan` | Campaign | 🎯 | Plan | `guided` | `review_only` | `campaign-studio` | `chat-preview`, `campaign-studio`, `content-studio`, `workflows` | `current_chat`, `campaign_notes`, `market_notes`, `audience_notes`, `product_data`, `library_source`, `manual_input` | `campaign_plan`, `campaign_brief`, `channel_plan`, `next_best_actions` | Create a review-ready campaign plan with objective, audience, offer, channels, phases, risks, and next actions. |
| `launch-plan` | Launch | 🚀 | Plan | `guided` | `review_only` | `campaign-studio` | `chat-preview`, `campaign-studio`, `workflows`, `publishing` | `current_chat`, `campaign_brief`, `asset_requirements`, `timeline_notes`, `library_source`, `manual_input` | `launch_plan`, `readiness_plan`, `timeline`, `dependency_map` | Build a launch plan with timeline, assets, owners, readiness gaps, and review gates. |
| `audience` | Audience | ◎ | Map | `guided` | `review_only` | `campaign-studio` | `chat-preview`, `campaign-studio`, `content-studio`, `insights` | `current_chat`, `market_notes`, `customer_notes`, `insights_report`, `library_source`, `manual_input` | `audience_map`, `segment_notes`, `objection_map`, `message_angles` | Map target audience segments, needs, objections, triggers, and message angles. |
| `offer` | Offer | ◆ | Value | `guided` | `review_only` | `campaign-studio` | `chat-preview`, `campaign-studio`, `content-studio`, `ads-manager` | `current_chat`, `product_data`, `pricing_notes`, `proof_points`, `library_source`, `manual_input` | `offer_brief`, `value_proposition`, `proof_points`, `cta_options` | Create offer angles with value proposition, benefits, proof points, CTA ideas, and risk notes. |
| `funnel` | Funnel | ⌁ | Flow | `guided` | `review_only` | `campaign-studio` | `chat-preview`, `campaign-studio`, `content-studio`, `workflows`, `publishing` | `current_chat`, `campaign_brief`, `audience_notes`, `content_inventory`, `library_source`, `manual_input` | `funnel_map`, `content_needs`, `handoff_points`, `retention_notes` | Map funnel stages, content needs, conversion paths, retention, and handoff points. |
| `priority` | Priority | ✓ | Next | `preview` | `review_only` | `workflows` | `chat-preview`, `workflows`, `task`, `campaign-studio` | `current_chat`, `operations_snapshot`, `readiness_gaps`, `campaign_notes`, `manual_input` | `next_best_action`, `priority_list`, `blocker_map`, `action_sequence` | Prioritize urgent, important, blocked, and later work without running workflows. |

### media proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `visual-brief` | Visual Brief | 🎨 | Design | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `library`, `content-studio`, `publishing` | `current_chat`, `campaign_brief`, `brand_guidelines`, `product_images`, `reference_asset`, `library_source`, `manual_input` | `visual_brief`, `creative_direction`, `format_brief`, `asset_requirements` | Prepare visual concept, format, composition, colors, typography, asset needs, and CTA. |
| `moodboard` | Moodboard | ▧ | Style | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `library` | `current_chat`, `brand_guidelines`, `reference_asset`, `campaign_mood`, `library_source`, `manual_input` | `moodboard_direction`, `style_notes`, `reference_list`, `brand_alignment_notes` | Define mood, references, color feel, texture, layout mood, and brand alignment. |
| `image-prompt` | Image | 🖼 | Prompt | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `library` | `current_chat`, `visual_brief`, `brand_guidelines`, `product_data`, `reference_asset`, `manual_input` | `image_prompt`, `prompt_variants`, `negative_prompt`, `style_prompt` | Create image generation prompts and constraints for later review in Media Studio. |
| `asset-list` | Assets | ▣ | List | `source_required` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `library`, `workflows` | `current_chat`, `campaign_brief`, `library_folder`, `brand_assets`, `product_images`, `manual_input` | `asset_checklist`, `missing_assets`, `asset_request_brief`, `production_requirements` | Create an asset checklist and identify missing visual assets. |
| `layout` | Layout | ▤ | Plan | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `content-studio`, `publishing` | `current_chat`, `content_draft`, `visual_brief`, `brand_guidelines`, `reference_asset`, `manual_input` | `layout_plan`, `section_hierarchy`, `responsive_notes`, `cta_placement` | Plan sections, hierarchy, visual blocks, CTA placement, and responsive notes. |
| `brand-check` | Brand Check | ◆ | Review | `source_required` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `governance`, `library` | `current_chat`, `brand_guidelines`, `visual_brief`, `selected_asset`, `library_source`, `manual_input` | `brand_check_report`, `style_risks`, `missing_assets`, `improvement_actions` | Review visual direction for brand consistency, risks, mismatches, and improvements. |

### video_lead proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `reel-script` | Reel | 🎬 | Script | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `content-studio`, `publishing` | `current_chat`, `campaign_brief`, `content_draft`, `product_data`, `library_source`, `manual_input` | `reel_script`, `short_video_script`, `hook_variants`, `overlay_copy` | Write a short-form script with hook, scenes, voiceover, overlays, CTA, and shot notes. |
| `storyboard` | Storyboard | ▥ | Video | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `library`, `publishing` | `current_chat`, `script_draft`, `visual_brief`, `reference_asset`, `product_images`, `manual_input` | `storyboard`, `scene_plan`, `caption_plan`, `asset_requirements` | Create scene-by-scene storyboard with camera direction, motion, captions, assets, and CTA. |
| `shot-list` | Shot List | ◫ | Plan | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `workflows`, `library` | `current_chat`, `storyboard`, `visual_brief`, `product_data`, `production_notes`, `manual_input` | `shot_list`, `b_roll_list`, `prop_list`, `production_checklist` | Create product, lifestyle, closeup, transition, and prop shot requirements. |
| `voiceover` | Voiceover | 🎙 | Audio | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `content-studio` | `current_chat`, `script_draft`, `campaign_brief`, `brand_voice`, `manual_input` | `voiceover_script`, `audio_direction`, `pacing_notes`, `tone_variants` | Draft voiceover copy with tone, pacing, hook, proof points, and CTA. |
| `video-cta` | Video CTA | ▶ | Action | `guided` | `review_only` | `media-studio` | `chat-preview`, `media-studio`, `publishing`, `ads-manager` | `current_chat`, `campaign_brief`, `offer_data`, `video_script`, `manual_input` | `video_cta_options`, `soft_cta`, `direct_cta`, `urgency_cta`, `brand_cta` | Create CTA variants for video without publishing or launching campaigns. |

### publisher proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `publish-check` | Publish Check | 📤 | Ready | `preview` | `review_only` | `publishing` | `chat-preview`, `publishing`, `governance`, `content-studio`, `media-studio` | `content_draft`, `media_asset`, `publishing_package`, `approval_notes`, `current_chat`, `manual_input` | `publishing_readiness_check`, `missing_items`, `channel_fit_review`, `risk_notes` | Review publishing readiness without scheduling or publishing. |
| `channel-pack` | Channel Pack | ▦ | Prep | `guided` | `review_only` | `publishing` | `chat-preview`, `publishing`, `content-studio`, `media-studio` | `content_draft`, `media_asset`, `campaign_brief`, `channel_notes`, `library_source`, `manual_input` | `channel_pack`, `caption_pack`, `format_notes`, `approval_checklist` | Prepare channel copy, hashtags, format notes, asset needs, and approval checklist. |
| `schedule` | Schedule | 🗓 | Plan | `guided` | `confirmation_required` | `publishing` | `chat-preview`, `publishing`, `workflows` | `publishing_package`, `campaign_timeline`, `channel_notes`, `approval_notes`, `manual_input` | `schedule_builder`, `calendar_slot_options`, `dependency_notes`, `review_gates` | Draft a publishing schedule plan only; no calendar or platform mutation. |
| `hashtags` | Hashtags | # | SEO | `guided` | `review_only` | `publishing` | `chat-preview`, `publishing`, `content-studio`, `insights` | `content_draft`, `topic`, `market`, `channel_notes`, `seo_brief`, `manual_input` | `hashtag_pack`, `discoverability_tags`, `platform_tag_groups`, `market_tags` | Suggest tags grouped by brand, product, audience, niche, and market. |
| `approval-pack` | Approval | ✓ | Pack | `source_required` | `confirmation_required` | `governance` | `chat-preview`, `governance`, `publishing`, `workflows` | `final_copy`, `media_asset`, `approval_notes`, `claim_review`, `publishing_package`, `manual_input` | `approval_pack`, `risk_summary`, `asset_checklist`, `confirmation_list` | Prepare approval notes and required confirmations; do not approve. |

### ads proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ad-angle` | Ad Angle | 📣 | Paid | `guided` | `review_only` | `ads-manager` | `chat-preview`, `ads-manager`, `content-studio`, `governance` | `campaign_brief`, `audience_notes`, `offer_data`, `proof_points`, `library_source`, `manual_input` | `ad_angle`, `angle_variants`, `pain_benefit_map`, `compliance_risks` | Create paid ad angles with hook, pain, benefit, proof, CTA, and risks. |
| `ad-copy` | Ad Copy | ✦ | Draft | `guided` | `review_only` | `ads-manager` | `chat-preview`, `ads-manager`, `content-studio`, `governance` | `ad_angle`, `campaign_brief`, `landing_page_copy`, `product_data`, `manual_input` | `ad_copy`, `headline_variants`, `primary_text_variants`, `cta_variants` | Draft ad copy variants for later review and platform setup elsewhere. |
| `targeting` | Targeting | ◎ | Map | `guided` | `review_only` | `ads-manager` | `chat-preview`, `ads-manager`, `insights`, `campaign-studio` | `audience_notes`, `insights_report`, `campaign_brief`, `customer_notes`, `manual_input` | `audience_map`, `targeting_ideas`, `exclusions`, `funnel_stage_map` | Map audience groups, interests, exclusions, funnel stages, and testing notes. |
| `creative-test` | Creative | A/B | Test | `guided` | `review_only` | `ads-manager` | `chat-preview`, `ads-manager`, `media-studio`, `insights`, `workflows` | `creative_assets`, `campaign_brief`, `ad_copy`, `performance_notes`, `manual_input` | `ab_test_plan`, `creative_test_matrix`, `hypotheses`, `success_signals` | Create a creative testing plan with variants, hypotheses, success signals, and next actions. |
| `landing-match` | Landing | ↔ | Match | `source_required` | `review_only` | `ads-manager` | `chat-preview`, `ads-manager`, `content-studio`, `governance` | `ad_copy`, `landing_page_copy`, `offer_data`, `proof_points`, `library_source`, `manual_input` | `landing_match_review`, `message_gap_report`, `cta_improvements`, `trust_signal_notes` | Review ad-to-landing page match and identify gaps, trust signals, and CTA improvements. |

### analyst proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `seo-brief` | SEO Brief | 🔎 | Search | `guided` | `review_only` | `insights` | `chat-preview`, `insights`, `content-studio`, `library` | `topic`, `market`, `language`, `audience`, `library_source`, `manual_input` | `seo_brief`, `search_intent_map`, `content_structure`, `meta_ideas`, `internal_links` | Create SEO brief with keywords, intent, structure, meta ideas, links, and risks. |
| `insights` | Insights | 📊 | Data | `source_required` | `review_only` | `insights` | `chat-preview`, `insights`, `campaign-studio`, `workflows` | `insights_data`, `analytics_summary`, `performance_notes`, `current_chat`, `manual_input` | `insights_summary`, `optimization_actions`, `missing_data_notes`, `risk_notes` | Summarize what is working, weak, missing, and recommended next. |
| `keywords` | Keywords | ⌕ | SEO | `guided` | `review_only` | `insights` | `chat-preview`, `insights`, `content-studio`, `library` | `topic`, `market`, `audience`, `seo_brief`, `library_source`, `manual_input` | `keyword_groups`, `commercial_keywords`, `informational_keywords`, `branded_keywords`, `local_keywords` | Suggest keyword clusters by intent type and market. |
| `performance` | Performance | ↗ | Review | `source_required` | `review_only` | `insights` | `chat-preview`, `insights`, `campaign-studio`, `workflows` | `analytics_summary`, `performance_notes`, `campaign_results`, `content_inventory`, `manual_input` | `performance_review`, `wins`, `risks`, `experiment_recommendations` | Review performance signals, wins, risks, gaps, and next experiments. |
| `content-gap` | Gaps | ▥ | Plan | `guided` | `review_only` | `insights` | `chat-preview`, `insights`, `content-studio`, `campaign-studio` | `content_inventory`, `seo_brief`, `audience_notes`, `competitor_notes`, `library_source`, `manual_input` | `content_gap_report`, `missing_topics`, `missing_pages`, `priority_actions` | Identify missing topics, pages, funnel-stage gaps, and priorities. |

### compliance_reviewer proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `claims-check` | Claims | 🛡 | Check | `source_required` | `review_only` | `governance` | `chat-preview`, `governance`, `content-studio`, `publishing` | `content_draft`, `claim_list`, `proof_doc`, `product_data`, `legal_doc`, `manual_input` | `claims_check`, `risk_flags`, `proof_requirements`, `safe_wording_notes` | Flag unsupported, risky, health/performance, legal, or approval-sensitive claims. |
| `safe-rewrite` | Safe Rewrite | ♻ | Copy | `guided` | `review_only` | `governance` | `chat-preview`, `governance`, `content-studio` | `content_draft`, `claims_check`, `legal_doc`, `proof_doc`, `manual_input` | `safe_rewrite`, `risk_reduced_copy`, `claim_softening`, `review_notes` | Rewrite content safely while preserving value and marking proof gaps. |
| `evidence` | Evidence | 📎 | Need | `source_required` | `review_only` | `governance` | `chat-preview`, `governance`, `library`, `workflows` | `content_draft`, `claim_list`, `product_data`, `legal_doc`, `research_proof_docs`, `manual_input` | `evidence_needed`, `required_proof`, `recommended_proof`, `optional_proof` | List evidence needed before approval or publishing. |
| `gdpr` | GDPR | 🔒 | Review | `source_required` | `review_only` | `governance` | `chat-preview`, `governance`, `workflows`, `publishing` | `workflow_draft`, `privacy_policy`, `tracking_plan`, `data_use_notes`, `manual_input` | `gdpr_review`, `consent_risks`, `tracking_notes`, `disclosure_requirements` | Review privacy, consent, tracking, data use, and disclosure risks. |
| `approval-notes` | Approval | ✓ | Notes | `source_required` | `confirmation_required` | `governance` | `chat-preview`, `governance`, `publishing`, `workflows` | `final_copy`, `claims_check`, `approval_context`, `asset_checklist`, `manual_input` | `approval_notes`, `risk_summary`, `reviewer_requirements`, `unresolved_issues` | Prepare approval notes only; do not approve or publish. |

### operations proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `task-plan` | Task Plan | ☑ | Ops | `guided` | `review_only` | `workflows` | `chat-preview`, `workflows`, `task`, `content-studio`, `media-studio` | `current_chat`, `ai_preview`, `content_draft`, `media_job`, `manual_input` | `task_plan`, `owner_map`, `priority_list`, `dependency_notes` | Turn context into a task plan with owners, priorities, dependencies, risks, and next steps. |
| `workflow` | Workflow | ⚙ | Draft | `guided` | `confirmation_required` | `workflows` | `chat-preview`, `workflows`, `task`, `handoff` | `current_chat`, `handoff_summary`, `operations_snapshot`, `approval_notes`, `manual_input` | `workflow_draft`, `step_sequence`, `trigger_notes`, `review_gates`, `execution_risks` | Draft workflow structure only; do not run workflow actions. |
| `handoff` | Handoff | ⇄ | Route | `guided` | `confirmation_required` | `workflows` | `chat-preview`, `handoff`, `workflows`, `content-studio`, `media-studio`, `publishing`, `governance` | `current_chat`, `ai_preview`, `content_draft`, `media_job`, `publishing_package`, `manual_input` | `handoff_summary`, `destination_brief`, `required_inputs`, `review_notes` | Prepare handoff context and destination owner without routing automatically. |
| `timeline` | Timeline | ⏱ | Plan | `guided` | `review_only` | `workflows` | `chat-preview`, `workflows`, `campaign-studio`, `publishing` | `current_chat`, `project_plan`, `campaign_timeline`, `dependency_notes`, `manual_input` | `timeline`, `milestones`, `blockers`, `safe_sequence` | Create a timeline with milestones, blockers, dependencies, and safe sequencing. |
| `checklist` | Checklist | ☷ | Ops | `guided` | `review_only` | `workflows` | `chat-preview`, `workflows`, `governance`, `publishing` | `current_chat`, `readiness_gaps`, `asset_requirements`, `approval_notes`, `manual_input` | `execution_checklist`, `approval_checklist`, `asset_checklist`, `qa_steps` | Create an execution checklist with approvals, assets, content, integrations, and QA. |

### customer_ops proposed metadata

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `reply-draft` | Reply | 💬 | Draft | `guided` | `confirmation_required` | `operations-centers` | `chat-preview`, `operations-centers`, `task`, `governance` | `customer_thread`, `support_notes`, `policy_doc`, `faq_source`, `current_chat`, `manual_input` | `reply_draft`, `empathetic_response`, `next_step_note`, `escalation_note` | Draft a safe customer reply only; do not send it. |
| `ticket` | Ticket | 🎫 | Draft | `guided` | `confirmation_required` | `operations-centers` | `chat-preview`, `operations-centers`, `task`, `workflows` | `customer_thread`, `support_notes`, `order_case_summary`, `current_chat`, `manual_input` | `ticket_draft`, `issue_summary`, `priority_note`, `missing_information` | Prepare a ticket draft without creating a CRM or support record. |
| `sla` | SLA | ⏳ | Risk | `preview` | `review_only` | `operations-centers` | `chat-preview`, `operations-centers`, `task`, `workflows` | `customer_thread`, `sla_policy`, `support_notes`, `current_chat`, `manual_input` | `sla_risk_review`, `urgency_flags`, `escalation_needs`, `safe_next_actions` | Review response risk, urgency, escalation needs, and safe next actions. |
| `summary` | Summary | ☷ | CX | `guided` | `review_only` | `operations-centers` | `chat-preview`, `operations-centers`, `workflows`, `sales-crm-draft` | `customer_thread`, `support_notes`, `current_chat`, `manual_input` | `thread_summary`, `sentiment_review`, `open_questions`, `response_context` | Summarize customer context, issue, sentiment, questions, risk, and next response. |

### sales_crm proposed metadata

CRM/Sales remains review-only until a dedicated CRM workspace exists. Phase 3B metadata can expose `crm_draft` style output types and destinations as drawer choices only; it must not imply direct CRM mutation.

| id | label | icon | badge | actionType | safetyLevel | frontendOwnerPage | destinations | sourceTypes | outputTypes | template intention summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sales-pitch` | Pitch | 💼 | Sales | `guided` | `review_only` | `workflows` | `chat-preview`, `workflows`, `content-studio`, `sales-crm-draft` | `lead_context`, `sales_notes`, `product_data`, `offer_data`, `proof_points`, `manual_input` | `sales_pitch`, `value_proposition`, `pain_solution_map`, `cta_note` | Create a sales pitch with pain, proof, offer, CTA, and follow-up note. |
| `follow-up` | Follow-up | ↩ | Email | `guided` | `confirmation_required` | `workflows` | `chat-preview`, `content-studio`, `workflows`, `sales-crm-draft` | `lead_context`, `meeting_notes`, `sales_notes`, `offer_data`, `manual_input` | `follow_up_email`, `follow_up_sequence`, `value_reminder`, `next_step_prompt` | Draft follow-up email copy only; do not send email. |
| `objections` | Objection | ❓ | Sales | `guided` | `review_only` | `workflows` | `chat-preview`, `workflows`, `content-studio`, `governance` | `lead_context`, `sales_notes`, `product_data`, `proof_points`, `objection_notes`, `manual_input` | `objection_handling`, `proof_needed`, `safe_answers`, `next_action` | Prepare objection handling with likely objections, safe answers, proof needs, and next action. |
| `lead-brief` | Lead Brief | ◎ | CRM | `guided` | `confirmation_required` | `workflows` | `chat-preview`, `workflows`, `operations-centers`, `sales-crm-draft` | `lead_context`, `crm_profile_summary`, `sales_notes`, `customer_notes`, `manual_input` | `lead_brief`, `fit_summary`, `opportunity_notes`, `risk_notes`, `outreach_recommendation` | Create a lead brief for review without creating or updating CRM records. |

## 5. Risk check

No backend needed:

- Phase 3B can be a metadata-only change in the frontend registry.
- The current drawer already consumes metadata from rendered button attributes.
- No API calls are needed.

No Library bridge needed in Phase 3B:

- `Open Library` remains a navigation-only placeholder in Phase 3B.
- Source bridge functions belong to Phase 5.
- Phase 3B should not import or modify `shared-context.js`.

No CSS needed:

- The drawer already renders selects from `destinations`, `sourceTypes`, and `outputTypes`.
- Adding metadata changes dropdown options without requiring selectors or layout changes.
- CSS cleanup belongs to Phase 4 and Phase 9.

No `ai-command.js` change needed unless a blocker appears:

- `ai-command.js` renders and binds the dock through the exported functions.
- It does not need to know the new metadata fields as long as `tool-dock.js` keeps the same exported API.
- The older `PHASE35_SPECIALIST_TOOLS` panel remains a later cleanup target, not a Phase 3B dependency.

Content Writer should remain mostly unchanged:

- Writer already has complete runtime metadata.
- Phase 3B should avoid changing writer behavior except for tiny consistency fixes only if validation proves they are necessary.
- Content Writer prompt intelligence improvements belong to Phase 6, not Phase 3B.

Safety status:

- The current drawer does not publish, send email, create CRM records, run workflows, delete files, overwrite files, or mutate backend data.
- Proposed metadata must preserve review-only and confirmation-required semantics.
- `actionType: "route"` should be avoided for non-writer tools in Phase 3B unless it remains purely drawer-to-composer. Review-first destination-aware routing belongs to Phase 8.

## 6. Recommended Phase 3B implementation plan

### Exact file to edit

Edit only:

- `public/control-center/pages/ai-command/tool-dock.js`

Do not edit in Phase 3B:

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/library.js`
- `public/control-center/shared-context.js`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/12-pages.css`
- `data/projects/*`
- backend/API files

### Inline registry versus small module

Recommendation for Phase 3B: keep metadata inline in `tool-dock.js`.

Reasoning:

- The existing runtime registry is already inline.
- `renderAiToolDock()` and `bindAiToolDock()` already consume the inline shape.
- A split module would increase import churn and create a second change surface.
- Phase 3B should stay small, validated, and easy to revert.

Optional later improvement:

- After all specialists are normalized and stable, consider extracting the registry to a small dedicated module such as `public/control-center/pages/ai-command/tool-registry.js`.
- That extraction should be its own cleanup commit, not bundled with Phase 3B.

### Implementation steps

1. In `TOOL_DOCK_BY_SPECIALIST`, add the runtime metadata fields to every non-writer tool:
   - `actionType`
   - `safetyLevel`
   - `frontendOwnerPage`
   - `destinations`
   - `sourceTypes`
   - `outputTypes`
2. Preserve current `id`, `icon`, `label`, `badge`, and `template` values unless a field has an obvious typo.
3. Do not add routing handlers, backend calls, shared context imports, Library bridge code, or CSS.
4. Keep fallback behavior in `renderAiToolDock()` unchanged.
5. Keep `getSpecialistTools()` and `getDockTools()` unchanged.
6. Run syntax checks and status checks.
7. Browser QA the drawer for representative specialists.
8. Commit only when clean.

### Validation commands

Run after Phase 3B:

```bash
git status --short
git diff --stat
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/library.js
node --check public/control-center/shared-context.js
node --check public/control-center/app.js
node --check public/control-center/router.js
git status --short | grep "data/projects" || true
```

Expected validation:

- `node --check` passes.
- `git diff --stat` shows only `tool-dock.js` for Phase 3B.
- `git status --short | grep "data/projects" || true` returns no unexpected data project changes.

### Browser QA checklist

Minimum Phase 3B browser QA:

- Content Writer still shows the same nine tools.
- Content Writer tools still open the drawer with strong metadata.
- Media Director tool opens the drawer with media-specific output/source/destination options.
- Sales / CRM tool opens the drawer with draft/review-only options.
- Operations tool opens the drawer with workflow/task/handoff draft options.
- Strategist, Publisher, Compliance Reviewer, Ads Optimizer, SEO / Insights Analyst, Customer Ops, and Video Lead each open at least one representative drawer without duplicate tools.
- `Open Library` still navigates to Library and remains non-mutating.
- `Use in Composer` still creates a review-ready prompt.
- No direct publish, send, save, workflow execution, CRM record creation, file delete, or backend mutation occurs from AI Command.
- The dock remains compact and specialist-specific.
- Team mode still returns six quick tools and does not break.

### Rollback plan

If Phase 3B fails validation:

- Restore only the Phase 3B edit to `public/control-center/pages/ai-command/tool-dock.js`.
- Do not touch user work or unrelated files.
- Do not commit a partial registry where only some specialists are normalized.
- Do not commit if `node --check` fails.
- Do not commit if `data/projects/*` changes unexpectedly.
- Do not commit if drawer opening fails for Content Writer or representative non-writer specialists.
- Do not commit if literal broken `\n` text appears in JS code.

### Recommended Phase 3B commit

After validation and browser QA:

```text
Normalize AI specialist tool metadata
```

The next code phase should normalize metadata for all non-writer specialists in `tool-dock.js`. Library Source Bridge should wait until Phase 5 unless explicitly reprioritized.
