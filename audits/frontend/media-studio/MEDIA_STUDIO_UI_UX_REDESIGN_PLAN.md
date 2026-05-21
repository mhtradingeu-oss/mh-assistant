# Media Studio UI/UX Redesign Plan

## Executive Verdict

Media Studio is functionally strong, but the current page does not yet feel like a premium creative operating surface. The page shows important system power, but it exposes that power as a long stack of full-width status, checklist, and recommendation panels before the user reaches the actual production work area.

The first screen partially explains the page through onboarding copy, but it does not let a user understand the workflow in five seconds. A new or non-technical operator should immediately see: "load or write a brief, attach a trusted source, generate or prepare variants, review the output, save to Library, then prepare a safe handoff." Today that journey is present in the system, but the visual hierarchy buries it.

Recommended implementation later: a medium targeted UI refactor, not a full rebuild. Keep the existing data flow, render helpers, handoff model, Library save model, and generation modes. Reorganize the interface around a command header, workflow strip, compact readiness rail, visible workbench, prominent output package area, and contextual AI support.

Product boundary to preserve: Media Studio is a creative preparation, review, and routing workspace. It should prepare media packages, prompts, briefs, review states, Library saves, and handoff payloads. It should not present itself as directly publishing, sending live work, approving final authority, or executing backend authority.

## Current Visual Problems

The current render order is the core UX issue. The page mounts onboarding, Source Context, Creative Readiness, Brand Compliance, Media Overview, and Smart Recommendation before the main generator, queue, preview, review, output readiness, and versioning panels. That makes the page feel more like an operations audit dashboard than a creative workspace.

Specific problems observed in the implementation:

- Too many stacked full-width panels appear before the workbench. Users must scroll past explanatory and readiness content before doing the primary job.
- Source Context, Creative Readiness, and Brand Compliance are useful, but they are too large, too static, and too flat for above-the-fold placement.
- The page has duplicated readiness concepts: top creative/brand checklists, output readiness state, review checklist, version readiness, API readiness, and asset readiness all compete for attention.
- Some cards use technical/debug-like language such as "Generation and publishing lifecycle", raw provider state grids, "Available state" repeated for every preview state, and JSON-like output payloads.
- The right rail contains valuable content, but it has weak hierarchy. Inbound brief, AI Agent Support, brand-safe assets, and API readiness all appear as separate card piles instead of one guided action panel.
- AI Agent Support renders all specialists at once, with long prompt text and three action buttons per card. This overwhelms the right rail and makes the agents feel like a prompt catalog rather than contextual help.
- The workflow title "Brief -> Generate/Prepare -> Review -> Approve -> Send to Publishing" implies direct authority. It should be reframed as a package and handoff workflow.
- Buttons labeled "Send to Publishing", "Send to Publishing if ready", "Send to publishing", and "Approve" are too strong for Media Studio's authority boundary. They should use prepare, request, mark, review, or handoff language.
- The page does not clearly separate "selected output package" from "job queue" from "form composer". Users have to infer which object they are editing or routing.
- The visual style is dense and card-heavy. It lacks a strong command surface, clear stage progress, and a premium creative review feel.

## What Works Well

The underlying product system is strong. The redesign should preserve it rather than replace it.

- Media modes are present: image, video, voice, and campaign pack.
- The page can receive shared handoffs from AI Command, Content Studio, Workflows, and Campaign Studio.
- Source and Library relationships exist, including Library save payloads and provenance-aware asset records.
- Prompt improvement, brand-safe prompt conversion, German market adaptation, and format conversion are useful creative operations.
- Job queue, output preview, review controls, output readiness, and versioning are already implemented as separate capabilities.
- There is a clear backend fallback model: if provider generation is not connected, Media Studio can still prepare prompt-ready drafts.
- AI specialists are correctly scoped as guidance and prompt helpers.
- The page already respects the broad handoff idea: routing is generally user-triggered and moves context to another workspace.
- Adjacent pages provide usable layout precedents. AI Command has a compact command header, mode rail, central work area, output panel, and contextual tools. Library has a main workspace plus inspector/action/AI panel mounts. Publishing separates queue, builder, and side panels.

## User Journey Problem

The current first impression answers "what information exists?" before it answers "what should I do next?" That is backwards for a creative production workspace.

Current perceived journey:

1. Read welcome copy.
2. Read source context.
3. Read creative checklist.
4. Read brand checklist.
5. Read overview metrics.
6. Read smart recommendation.
7. Scroll to generator.
8. Scroll further to queue, preview, review, readiness, and versioning.

Ideal perceived journey:

1. See the project, media mode, current brief status, and next best action.
2. See the workflow stage: Brief, Source, Generate/Prepare, Review, Save to Library, Handoff.
3. Start or continue the brief directly.
4. Attach or confirm source context only when needed.
5. Generate or prepare variants.
6. Review the selected output in a prominent preview/package area.
7. Save the selected version to Library or prepare a Publishing, Governance, Content Studio, or AI Command review handoff.

The redesign should make Media Studio feel like a cockpit for creative preparation, not a scroll of audits. It should show system power through compact state, guided actions, and confident grouping.

## Recommended Page Architecture

Use the existing App Shell principle as the mental model:

- Header: page identity, project, mode, brief status, selected package status, primary next action.
- Main View: creative workbench with brief composer, prompt/output preview, variants, and active job.
- Action Panel: readiness, source/provenance, package actions, Library and handoff destinations.
- AI Panel: contextual specialist helpers, using the same preparation-only pattern as AI Command tools.

Recommended section treatment:

| Current section | Recommended treatment |
| --- | --- |
| Welcome/onboarding | Remove as full-width card. Convert to a one-line command header subtitle or empty-state hint. |
| Source Context | Move to right rail as compact Source/Provenance card. Show status badge and expand details. |
| Creative Readiness | Convert to compact readiness checklist group in right rail. Do not render as full-width top card. |
| Brand Compliance | Merge into readiness rail as Brand/Compliance group. Expand for details. |
| Media Overview | Convert metrics to small header chips or move lower as "Workspace Health". |
| Smart Recommendation | Convert into top primary next action plus optional right rail "Next Step" card. |
| Generator tabs/forms | Move into main workbench immediately below workflow strip. This is primary. |
| Smart Prompt Intelligence | Merge into the brief composer as prompt tools or expose through compact action drawer. |
| AI Agent Support | Keep, but make contextual, collapsible, and drawer-like. Do not show all six full cards by default. |
| Job Queue | Place near the active output. Active job first, compact queue below. |
| Output Preview | Make prominent in the main workbench, ideally visible without deep scrolling after the header. |
| Asset Preview / Brand Safety Checklist | Merge into Output Package review controls and readiness rail. |
| Output Readiness State | Convert to compact package readiness chips. Remove the repeated list of all possible states from the main page. |
| Brand-safe assets | Move to right rail under Source/Library inputs, collapsed if healthy. |
| API readiness | Move lower in right rail, collapsed by default unless provider is missing. |
| Versioning | Keep near output preview, but compact to tabs plus selected version metadata. Advanced compare can be collapsed. |

Always visible at top:

- Media Studio title and purpose line.
- Project, campaign, market/language, media mode, and selected package status.
- Primary next action based on state.
- Safe action buttons: Save Draft, Save to Library, Prepare Publishing Package, Prepare Governance Review, Open AI Command Review.
- Workflow strip.
- Compact readiness chips.

Collapsed by default:

- Long onboarding text.
- Full source/provenance details.
- Full creative readiness checklist.
- Full brand compliance checklist.
- Full API readiness diagnostics.
- Version comparison details.
- Raw output payload JSON.
- Full AI specialist prompt bodies.

Moved to right rail:

- Source/provenance.
- Inbound handoff.
- Readiness groups.
- Brand and governance risk.
- Library inputs.
- API readiness.
- Contextual AI agents.

Converted into compact chips:

- Total jobs/assets.
- Ready assets.
- Draft jobs.
- Needs review.
- Failed/blocked jobs.
- Publishing package readiness.
- Source ready.
- Creative ready.
- Brand safe.
- Governance risk.
- Provider readiness.

Moved lower:

- Workspace metrics.
- Full queue history.
- Advanced version compare.
- API/backend diagnostics.
- Specialist prompt library.

Removed or deferred from first screen:

- A full "Welcome to Media Studio" panel.
- Full-width static checklists.
- Repeated "Available state" output readiness rows.
- Direct "Send to Publishing" language.
- Any UI copy that suggests Media Studio has final approval or live publishing authority.

## Proposed Above-the-Fold Layout

The above-the-fold layout should tell the story in one glance:

```text
Media Studio                                             [Project] [Mode] [Status]
Creative preparation, review, and routing workspace       Primary next action

[Brief] -> [Source] -> [Generate/Prepare] -> [Review] -> [Save to Library] -> [Handoff]

[Source ready] [Creative ready] [Brand safe] [Publishing package] [Governance risk]

Main Workbench                                  Action / AI Panel
Brief composer + mode controls                  Next step
Selected output preview/package                 Source/provenance
Active job + variants                           Readiness groups
                                                Contextual specialist
```

Top Command Header:

- Project chip: current project, with fallback "No project selected".
- Campaign chip: active campaign or "No campaign".
- Market/language chip: show market if known, because Media Studio is international.
- Media mode segmented control: Image, Video, Voice, Campaign Pack.
- Brief status: Empty, Draft, Prompt Ready, Generated, Needs Review, Package Ready.
- Primary next action: context-derived, short, and action-oriented.
- Safe buttons: Save Draft, Save to Library, Prepare Publishing Package, Prepare Governance Review, Open AI Command Review.

Creative Workflow Strip:

- Brief: active when user is composing or loading handoff.
- Source: pass/warning/missing based on Library/handoff/source.
- Generate/Prepare: active when prompt is ready or provider action exists.
- Review: active when output or prompt needs review.
- Save to Library: available when a selected version has prompt or output payload.
- Handoff: available when package is review-ready.

The strip should not be a decorative timeline. Each step should show state and, later, optionally focus the relevant area.

## Proposed Main Workbench

The main workbench should prioritize production tasks over explanatory panels.

Recommended desktop layout:

- Left/main column: Brief Composer and Prompt Tools.
- Main preview area: Selected Output Package with preview, selected version, and package metadata.
- Lower main area: Active Job, compact Queue, and Variants.
- Right rail: Source, readiness, brand/governance, AI agent, Library/API.

Recommended first workbench row:

- Brief Composer: mode tabs, project/campaign/product/channel/format, objective, style, prompt/brief, reference asset, review notes.
- Selected Output Package: visual/audio/text preview, selected version, readiness badge, package actions.

Recommended second workbench row:

- Active Job: selected job title, status, mode, channel, source, most important actions.
- Variants: version tabs, compare toggle, selected version metadata.
- Queue: compact list/table of other jobs, not a large action-heavy card.

Prompt tools should move closer to the prompt field:

- Generate from project setup.
- Generate from workflow handoff.
- Improve prompt.
- Make brand-safe.
- Adapt to market/language.
- Convert image prompt to video brief.
- Convert video brief to voiceover.
- Generate campaign pack.

These can be presented as compact icon/text buttons or a "Prompt Tools" popover. They should not require a separate full-width card below the generator.

Professional creative workflow support:

| Workflow | User input | Required source | Output preview | Readiness checks | Safe destination |
| --- | --- | --- | --- | --- | --- |
| Image prompt | Objective, product, channel, style, reference asset, prompt constraints | Product truth, brand guideline, campaign context | Prompt plus generated image if available | Source, format, brand, claims, safe text area | Save to Library, Open AI Command Review, Prepare Publishing Package |
| Product visual | Product focus, packaging/photo reference, usage angle, aspect ratio | Library product photo or source-of-truth product asset | Image mock/preview or prompt package | Product representation, source confidence, logo/color fit, claim risk | Save to Library, Prepare Governance Review if claim-sensitive |
| Brand creative | Campaign angle, brand style, CTA, placement | Brand guideline, logo, campaign brief | Visual prompt or creative package | Brand consistency, CTA clarity, format fit, accessibility | Save to Library, Prepare Content Studio Handoff, Prepare Publishing Package |
| Reel/video brief | Hook, product, scenes, duration, channel, CTA | Product visuals, campaign copy, proof/source notes | Story beats, scene list, video brief, generated video if available | Hook clarity, pacing, platform duration, safe claims | Prepare Publishing Package, Open AI Command Review |
| Storyboard | Narrative beats, scenes, overlays, transitions | Campaign brief, product assets, brand guideline | Scene-by-scene storyboard text/cards | Scene completeness, asset coverage, brand fit | Save to Library as storyboard, Prepare Content Studio Handoff |
| Shot list | Locations, angles, props, product moments, talent notes | Product asset, brand guardrails, compliance notes | Production shot list | Product accuracy, required assets, compliance risk | Save to Library, Prepare Governance Review if sensitive |
| Voiceover | Script goal, tone, market language, pacing, duration | Campaign copy, product proof, localization guidance | Voice script or audio preview | Language, claims, pronunciation, pacing, accessibility | Save to Library, Prepare Publishing Package |
| Campaign pack | Product, campaign, channels, output purpose, brief | Campaign plan, brand assets, product source, Content Studio copy | Image prompt, video brief, voice script, captions/notes | Cross-format consistency, source, brand, compliance, publishing package | Save package to Library, Prepare Publishing Package |
| Publishing media package | Selected approved creative, channel, caption/notes, asset references | Library asset refs, source/proof, review notes | Package summary with preview and metadata | Package completeness, source confidence, governance risk | Prepare Publishing Package only, not direct publish |

## Proposed Right Rail

The right rail should become a guided action panel, not a stack of unrelated cards.

Recommended order:

1. Next Step: one compact card showing the recommended next action and why.
2. Source/Provenance: source confidence, linked Library asset, handoff source, missing source action.
3. Readiness Summary: Source, Creative, Brand, Compliance, Publishing, Governance.
4. AI Specialist: contextual helper based on selected mode and current stage.
5. Library Inputs: brand-safe assets, collapsed if healthy.
6. API Readiness: provider/backend availability, collapsed unless unavailable.

Right rail behavior:

- Sticky only on large desktop if it does not trap scrolling.
- On tablet/mobile, move below the main workbench after the active package area.
- Use collapsible sections with short summaries.
- Keep the primary action available in the header or package area, not only in the rail.

AI Panel behavior:

- Show one recommended specialist and two secondary options.
- Full specialist library opens in a drawer or expandable section.
- Specialist actions should prepare or apply prompts only.

## Source/Provenance UX

The current Source Context panel is correct in intent but too flat. It should become a compact provenance card with clear state.

Recommended source card:

- Badge: Verified source, Partial source, Missing source, or Conflicting source.
- Source confidence: High, Medium, Low, Missing.
- Source of truth indicator: yes/no/unknown.
- Linked Library asset: name/id/path if available.
- Handoff source: AI Command, Content Studio, Campaign Studio, Workflows, Library, or local draft.
- Campaign/project context: compact chips.
- Missing state: "No trusted source attached."
- Action: Attach Source from Library.
- Secondary action: Open AI Command Review with source context.

Source confidence guidance:

- High: selected Library source marked source-of-truth or durable Library asset ref exists.
- Medium: inbound handoff has project/campaign/channel/product, but no Library source.
- Low: source exists only as free-text prompt/reference.
- Missing: no selected item, no handoff, no Library ref, no reference asset.
- Conflicting: selected job and handoff disagree on project/campaign/product/channel.

Relationship to other workspaces:

- AI Command can prepare source-aware prompts and send review context.
- Library remains the source-of-truth workspace for assets, proof, product files, legal docs, and brand files.
- Content Studio can hand off copy/design briefs into Media Studio, but Media Studio should display whether that handoff contains proof/source context.
- Media Studio should save selected output packages back to Library with provenance, not treat generated media as source-of-truth by default.

## Creative Readiness UX

Creative Readiness should not be a long bullet panel at the page top. It should be a compact checklist system.

Recommended groups:

- Source: trusted source attached, product truth available, campaign context present.
- Creative: objective, primary message, CTA, audience/market, prompt completeness.
- Format: channel, aspect ratio/size, duration for video/voice, safe text area.
- Output: prompt or generated asset exists, selected version exists, review notes present.
- Package: Library save readiness, publishing package metadata, handoff destination.

Each row should have one of four states:

- Pass: complete enough to proceed.
- Warning: usable but reviewer should inspect.
- Missing: blocks high-quality package preparation.
- Not applicable: not needed for this mode.

The top of the page should show only summary chips:

- Source ready.
- Creative ready.
- Brand safe.
- Publishing package.
- Governance risk.

Expanded details should live in the right rail or a Review tab.

## Brand Compliance UX

Brand Compliance should become a brand and governance review card, not a static bullet list.

Recommended checks:

- Logo/brand consistency.
- Color/style fit.
- Product representation accuracy.
- Claims/proof needed.
- Legal/compliance sensitivity.
- Market/language tone.
- Accessibility: alt text, captions, readable overlays.
- Platform policy sensitivity.

Recommended states:

- Brand safe: no obvious brand or claim issue.
- Needs review: brand fit or proof should be inspected.
- Governance recommended: claim, legal, medical, pricing, privacy, or regulated content risk.
- Missing source: cannot evaluate brand/proof safely.

Recommended actions:

- Make Prompt Brand-Safe.
- Add Proof Source.
- Prepare Governance Review.
- Open AI Command Review.

Do not use "Approve" as the primary brand action. Use "Mark Brand Reviewed" or "Request Approval" only if the system is creating a review state rather than granting final authority.

## AI Agent Support UX

The current AI Agent Support panel shows all six specialists with long descriptions, suggested prompts, and three buttons each. That is too heavy for the right rail.

Recommended placement:

- Keep AI support in the right rail, but collapse it to a contextual card.
- Show the best specialist for the selected mode and stage.
- Offer "More specialists" to open the full list in a drawer or accordion.
- Reuse the Smart Tool Drawer pattern from AI Command where possible, because users already learn that tools prepare drafts and handoffs without executing backend operations.

Contextual specialist mapping:

- Image mode: Visual Director, Prompt Engineer, Brand Guardian.
- Product visual: Visual Director, Brand Guardian.
- Video mode: Video Strategist, Visual Director, Brand Guardian.
- Storyboard/shot list: Video Strategist, Prompt Engineer.
- Voice mode: Voice Director, Brand Guardian.
- Campaign pack: Prompt Engineer, Visual Director, Video Strategist, Voice Director, Publishing Assistant.
- Review/handoff stage: Brand Guardian, Publishing Assistant.

Recommended action labels:

- "Apply to Brief" instead of "Use Prompt".
- "Save Prompt Draft" instead of generic "Save Draft".
- "Open in AI Command for Review" instead of "Send to AI Workspace".

The agent card should show:

- Specialist name.
- One-line job.
- Why this specialist is recommended now.
- One prepared prompt preview, truncated.
- Primary action: Apply to Brief or Open in AI Command for Review.
- Secondary action: Save Prompt Draft.

## Job Queue and Output Preview UX

The job queue and output preview should become the heart of the page after the brief composer.

Recommended hierarchy:

1. Selected Output Package: prominent preview or prompt package, version tabs, status, source badge.
2. Decision Controls: grouped below preview.
3. Active Job: compact card with mode/channel/format/source/status.
4. Queue: compact list of other jobs.
5. Versioning: tabs always visible, compare/details collapsed.

Output Preview:

- Should be visible close to the top of the main workbench.
- Empty state should say what the user can do next: "Prepare a prompt or generate an output to preview this package."
- Image, video, and audio previews should use stable frame dimensions to avoid layout jumps.
- Campaign pack preview should render structured sections, not raw JSON by default.
- Raw payload should be available under "Developer details" or "Payload details", collapsed.

Job Queue:

- Active job should be separated from the full queue.
- Queue rows should show title, mode, channel, format, status, source, and last updated.
- Queue row actions should be fewer and state-aware.
- Avoid repeating every action on every row. Use a row menu or selected job action group.

Decision controls:

- Save Draft.
- Mark Review Ready.
- Request Approval.
- Save to Library.
- Prepare Publishing Package.
- Prepare Governance Review.
- Open AI Command Review.
- Regenerate/Prepare Variant.

Versioning:

- Version tabs: Draft, Generated, Reviewed, Package, or v1/v2 labels if real versions exist.
- Selected version metadata: mode, provider, provider status, readiness status, Library link.
- Compare with previous: collapsed by default.
- Save to Library and handoff actions should apply to selected version only.

## Publishing/Governance Safety UX

Current wording should be tightened before the redesign ships.

Labels that should be changed later:

- "Send to Publishing if ready" -> "Prepare Publishing Package".
- "Brief -> Generate/Prepare -> Review -> Approve -> Send to Publishing" -> "Brief -> Source -> Generate/Prepare -> Review -> Save to Library -> Handoff".
- "Send to publishing" -> "Prepare Publishing Package".
- "Send to Publishing" -> "Prepare Publishing Package".
- "Approve" -> "Mark Review Ready" or "Request Approval", depending on actual behavior.
- "Selected version approved." -> "Selected version marked review-ready." or "Approval request prepared."
- "Media job approved locally." -> "Media job marked reviewed locally."
- "Send to AI Workspace" -> "Open in AI Command for Review".

Safe labels to use:

- Save Draft.
- Save to Library.
- Mark Review Ready.
- Request Approval.
- Prepare Publishing Package.
- Prepare Governance Review.
- Prepare Content Studio Handoff.
- Open AI Command Review.
- Attach Source from Library.
- Prepare Variant.
- Generate Output.
- Generate Prompt From Context.

Status display should also be softened:

- Internal `sent_to_publishing` can display as "Publishing package prepared" or "Handoff prepared".
- Internal `publishing_ready` can display as "Package ready".
- Internal `approved` can display as "Review ready" unless it reflects a true approval workflow outside Media Studio.

The page may create handoff payloads and review requests, but UI copy must not imply that Media Studio directly publishes live content, sends external messages, grants final approval, or executes backend authority.

## Responsive and Accessibility Notes

Responsive risks:

- Current page is too long on desktop and likely much worse on mobile.
- Right rail can become a second long page if all assistant/readiness/API panels remain expanded.
- Action rows with many buttons may wrap into dense blocks.
- Output previews, prompt boxes, and raw JSON can create large scroll jumps.
- Bottom docks or sticky bars in adjacent shells could overlap content if Media Studio later adds sticky actions.

Responsive recommendations:

- Desktop: command header, workflow strip, two-column workbench with right rail.
- Medium screens: main workbench first, right rail below active package or as collapsible drawer.
- Mobile: header chips wrap cleanly, workflow strip becomes horizontal scroll or compact stepper, preview appears before full queue, right rail becomes accordions.
- Use stable dimensions for previews, queue rows, and step chips.
- Avoid large full-width cards above the composer.

Accessibility recommendations:

- Workflow strip should be a list or nav with `aria-current` for active stage and accessible state labels.
- Mode tabs and version tabs should use tab semantics or at least clear `aria-pressed`/`aria-selected` behavior.
- Buttons must have action-specific names. Avoid vague repeated labels like "Approve" or "Preview" without context.
- Readiness chips should expose text state, not rely only on color.
- Collapsible panels should use native `details` or proper `aria-expanded`.
- Media previews need useful alt text derived from title/mode/source when possible.
- Video/audio controls should preserve native keyboard access.
- Focus order should follow: header actions, workflow strip, composer, preview/package actions, active job, queue, right rail.
- Text contrast should be tested after moving away from flat cyan checklist text. Current top checklist styling in `12-pages.css` risks reading as patch-era status styling rather than polished UI.
- Long project names, campaign names, German labels, and source paths must truncate gracefully without hiding essential state.

## Technical Risk Assessment

Recommended implementation level: medium targeted layout refactor.

Why not CSS-only:

- The main issue is render order and information architecture, not just spacing.
- Unsafe labels live in JS markup and event success messages.
- Readiness cards need to move from full-width top placement to compact rail components.
- Prompt tools should be merged into the composer or drawer pattern.

Why not full redesign:

- The existing route has strong working helpers for sessions, handoffs, Library saves, generation, queue, preview, review, and versioning.
- Adjacent shell patterns already exist.
- A full rewrite would increase risk in a large monolithic page.

Main risks:

- `media-studio-workspace.js` is large and stateful. Keep changes scoped to render composition, labels, and component grouping.
- There is both scoped inline CSS from `renderScopedStyles()` and global Media Studio CSS in `12-pages.css`. Later work should consolidate page-level styles carefully to avoid duplicate or conflicting rules.
- Existing status values like `approved`, `publishing_ready`, and `sent_to_publishing` may be used internally. UI labels can be safer without renaming storage values in the first pass.
- Any use of the AI Command tool drawer pattern should reuse existing foundations rather than adding a second drawer system.
- No backend, no `data/projects`, and no authority semantics should change in this UI pass.

Validation already run for this audit:

- `git status --short`: clean before creating this report.
- `git log --oneline -12`: latest commit is `bbf3889 Improve Media Studio readiness panels`.
- `node --check public/control-center/pages/media-studio-workspace.js`: passed.
- `node --check public/control-center/app.js`: passed.
- `node --check public/control-center/router.js`: passed.
- Requested grep for Media Studio readiness, source, agent, queue, preview, versioning, and routing labels was run.
- `git status --short | grep "data/projects" || true`: no `data/projects` changes.

## Recommended Implementation Phases

Phase A: visual hierarchy cleanup

- Replace the full onboarding card with a compact command header.
- Move Media Overview metrics into header chips or a lower "Workspace Health" section.
- Move Smart Recommendation into the command header primary next action and right rail Next Step card.
- Reorder the page so users reach the composer and output package immediately.
- Remove full-width Source Context, Creative Readiness, and Brand Compliance cards from the top stack.

Phase B: compact readiness rail

- Create a right rail readiness system with Source, Creative, Brand, Compliance, Publishing, and Governance groups.
- Convert long bullet lists to pass/warning/missing/not-applicable rows.
- Add compact summary chips near the top.
- Collapse detailed source/provenance, API readiness, and Library asset diagnostics by default.
- Add a clear missing-source state with "Attach Source from Library".

Phase C: workflow strip and next action

- Add a Creative Workflow Strip: Brief, Source, Generate/Prepare, Review, Save to Library, Handoff.
- Derive step states from existing session, selected item, selected version, source, and readiness data.
- Add one primary next action based on state.
- Keep safe action labels: Prepare Publishing Package, Prepare Governance Review, Save to Library, Open AI Command Review.
- Change visible workflow language away from direct approve/send/publish wording.

Phase D: output/job queue cleanup

- Make Selected Output Package prominent near the top of the main workbench.
- Put active job above the queue.
- Reduce per-row queue actions and move selected job actions into a decision control group.
- Convert campaign pack and provider payload previews from raw JSON-first to structured preview-first.
- Collapse advanced version comparison.
- Ensure Save to Library and Prepare Publishing Package clearly apply to the selected version/package.

Phase E: accessibility polish

- Add accessible labels and state text to workflow steps, readiness chips, mode tabs, version tabs, and decision controls.
- Improve focus order and keyboard behavior for collapsible panels.
- Add useful media alt text fallbacks.
- Ensure no action relies on color alone.
- Test long translated labels, German market copy, long source paths, and long project names.

Phase F: browser QA checklist

- Run desktop, tablet, and mobile screenshots.
- Confirm first screen shows command header, workflow strip, composer, and selected package without excessive scrolling.
- Confirm right rail collapses and stacks correctly.
- Confirm no action label implies direct publish, live send, final approval, or backend execution.
- Confirm no `data/projects` changes.
- Run syntax checks and targeted grep after implementation.

## Exact Files To Change Later

Primary files:

- `public/control-center/pages/media-studio-workspace.js`
- `public/control-center/styles/12-pages.css`

Optional documentation file:

- `audits/frontend/media-studio/MEDIA_STUDIO_UI_UX_REDESIGN_PLAN.md`

Avoid unless a later implementation proves it is necessary:

- `public/control-center/styles/08-components-foundation.css`: only if reusing or extending shared drawer/tool patterns requires shared styles.
- `public/control-center/shared-context.js`: avoid for this UI-only pass.
- Backend files: do not change.
- `data/projects`: do not change.

## Browser QA Checklist

Core scenarios:

- Empty workspace with no selected project.
- Project selected, no media jobs.
- Inbound handoff from AI Command.
- Inbound handoff from Content Studio.
- Selected local draft.
- Selected backend media job.
- Missing source context.
- Library source attached.
- Source-of-truth Library asset attached.
- API/provider disconnected.
- Image mode with prompt-only output.
- Image mode with generated image URL/base64 preview.
- Video mode with video brief.
- Video mode with video URL preview.
- Voice mode with script.
- Voice mode with audio URL preview.
- Campaign pack with image prompt, video brief, voice script, and captions.
- Selected version saved to Library.
- Selected version ready for package handoff.
- Governance risk state.

Viewport checks:

- 1440 x 900 desktop.
- 1280 x 800 laptop.
- 1024 x 768 tablet landscape.
- 768 x 1024 tablet portrait.
- 390 x 844 mobile.

Visual checks:

- First screen is understandable in five seconds.
- Composer and output package are reachable without scrolling past multiple status panels.
- Workflow strip does not wrap awkwardly.
- Header chips truncate gracefully.
- Right rail does not dominate the page.
- Queue rows are readable and do not overflow.
- Preview frames keep stable dimensions.
- Buttons do not wrap into unreadable clusters.
- No card is nested inside another card.
- No debug-looking JSON is shown by default.

Safety checks:

- No visible "Send to Publishing" label remains.
- No visible "Approve" label implies final authority.
- Publishing language uses "Prepare Publishing Package".
- Governance language uses "Prepare Governance Review".
- AI language uses "Open in AI Command for Review".
- Library language uses "Save to Library".
- Status copy says "Package ready" or "Handoff prepared" instead of implying live execution.

Accessibility checks:

- Keyboard can reach header actions, workflow steps, mode tabs, composer fields, preview controls, queue, version tabs, and right rail.
- Focus states are visible.
- Collapsed panels expose expanded/collapsed state.
- Readiness state is textual and not color-only.
- Media previews have meaningful alt text or accessible fallback text.
- Long labels and international text do not overlap.

Validation commands after implementation:

```bash
git status --short
node --check public/control-center/pages/media-studio-workspace.js
node --check public/control-center/app.js
node --check public/control-center/router.js
grep -n "Send to Publishing\|Send to publishing\|Approve\|approve now\|publish now\|Prepare Publishing Package\|Prepare Governance Review\|Save to Library" public/control-center/pages/media-studio-workspace.js public/control-center/styles/12-pages.css | sed -n '1,620p'
git status --short | grep "data/projects" || true
```

## Final Recommendation

Proceed with a medium targeted Media Studio UI/UX redesign when implementation is approved. Do not add random new sections. Recompose the existing system into a clearer creative production workspace:

- Command header for identity, context, and next action.
- Workflow strip for the Brief -> Source -> Generate/Prepare -> Review -> Save to Library -> Handoff story.
- Main workbench for composing briefs and reviewing selected outputs.
- Compact right rail for source, readiness, brand, governance, Library, API, and AI support.
- Safe action language that prepares packages and handoffs instead of implying direct publishing or final authority.

The success criterion is simple: a beginner should understand what Media Studio does within five seconds, and an experienced operator should be able to prepare, review, package, and route creative work without fighting the page hierarchy.
