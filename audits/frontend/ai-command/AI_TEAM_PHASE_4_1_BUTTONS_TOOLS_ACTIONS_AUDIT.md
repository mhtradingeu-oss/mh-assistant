# AI Team Phase 4.1 — Buttons, Tools, and Actions Audit

## Status
Terminal-only audit. No UI/backend behavior changed by this report.

## Files inspected
- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css

## Current goal
Confirm the AI Team interface is understandable, professional, action-linked, and complete enough for each specialist panel.

## Specialist coverage
- ✅ Strategist
- ✅ Content Writer
- ✅ Media Director
- ✅ Video Lead
- ✅ Publisher
- ✅ Ads Optimizer
- ✅ SEO & Insights Analyst
- ✅ Compliance Reviewer
- ✅ Operations Lead
- ✅ Customer Operations Lead
- ✅ Sales / CRM Lead

## Critical tool coverage
- ✅ Launch Plan
- ✅ Hook Generator
- ✅ Creative Brief Builder
- ✅ Write video hook
- ✅ Publishing Checklist
- ✅ Ad Angle Generator
- ✅ Keyword Intent
- ✅ Claims Check
- ✅ Timeline Draft
- ✅ Review Unified Inbox
- ✅ Draft Customer Reply
- ✅ Check SLA Risk
- ✅ Lead Qualification
- ✅ Outreach Draft
- ✅ Sales Handoff Draft

## Tool definitions detected
- Total tool definitions: 57

- `campaign-angle-generator` — Campaign Angle Generator / action: preview / intent: guidance
- `launch-plan` — Launch Plan / action: preview / intent: workflow
- `funnel-mapping` — Funnel Mapping / action: preview / intent: guidance
- `prioritize-next-move` — Priority Sort / action: preview / intent: task
- `hook-generator` — Hook Generator / action: preview / intent: guidance
- `caption-builder` — Caption Builder / action: preview / intent: guidance
- `cta-refiner` — CTA Refiner / action: preview / intent: task
- `publisher-package` — Publisher Package / action: preview / intent: handoff
- `creative-brief-builder` — Creative Brief Builder / action: preview / intent: media
- `format-mapper` — Format Mapper / action: preview / intent: guidance
- `asset-checklist` — Asset Checklist / action: preview / intent: task
- `visual-direction` — Visual Direction / action: preview / intent: guidance
- `write-video-hook` — Write video hook / action: preview / intent: guidance
- `draft-script` — Draft script / action: preview / intent: guidance
- `build-storyboard` — Build storyboard / action: preview / intent: workflow
- `prepare-voiceover` — Prepare voiceover / action: preview / intent: guidance
- `map-video-asset-needs` — Map video asset needs / action: preview / intent: task
- `publishing-checklist` — Publishing Checklist / action: preview / intent: handoff
- `final-packaging` — Final Packaging / action: preview / intent: handoff
- `channel-formatting` — Channel Formatting / action: preview / intent: guidance
- `schedule-draft` — Schedule Draft / action: preview / intent: workflow
- `ad-angle-generator` — Ad Angle Generator / action: preview / intent: guidance
- `copy-variants` — Copy Variants / action: preview / intent: guidance
- `test-ideas` — Test Ideas / action: preview / intent: task
- `budget-notes` — Budget Notes / action: preview / intent: guidance
- `keyword-intent` — Keyword Intent / action: preview / intent: guidance
- `meta-direction` — Meta Direction / action: preview / intent: guidance
- `opportunity-summary` — Opportunity Summary / action: preview / intent: task
- `analysis-plan` — Analysis Plan / action: preview / intent: workflow
- `claims-check` — Claims Check / action: preview / intent: guidance
- `approval-flags` — Approval Flags / action: preview / intent: task
- `safety-checklist` — Safety Checklist / action: preview / intent: handoff
- `publish-readiness` — Publish Readiness / action: preview / intent: handoff
- `timeline-draft` — Timeline Draft / action: preview / intent: workflow
- `handoff-routing` — Handoff Routing / action: preview / intent: handoff
- `checklist` — Checklist / action: preview / intent: task
- `blocker-review` — Blocker Review / action: preview / intent: guidance
- `review-unified-inbox` — Review Unified Inbox / action: preview / intent: guidance
- `summarize-customer-thread` — Summarize Customer Thread / action: preview / intent: guidance
- `draft-customer-reply` — Draft Customer Reply / action: preview / intent: guidance
- `create-ticket-draft` — Create Ticket Draft / action: preview / intent: task
- `check-sla-risk` — Check SLA Risk / action: preview / intent: guidance
- `prepare-escalation` — Prepare Escalation / action: preview / intent: handoff
- `customer-profile-snapshot` — Customer Profile Snapshot / action: preview / intent: guidance
- `route-support-sales-ops` — Route to Support / Sales / Operations / action: preview / intent: handoff
- `lead-qualification` — Lead Qualification / action: preview / intent: guidance
- `outreach-draft` — Outreach Draft / action: preview / intent: guidance
- `follow-up-sequence` — Follow-up Sequence / action: preview / intent: workflow
- `crm-profile-summary` — CRM Profile Summary / action: preview / intent: guidance
- `pipeline-next-step` — Pipeline Next Step / action: preview / intent: task
- `dealer-salon-outreach` — Dealer / Salon Outreach / action: preview / intent: guidance
- `influencer-lead-plan` — Influencer Lead Plan / action: preview / intent: workflow
- `sales-handoff-draft` — Sales Handoff Draft / action: preview / intent: handoff
- `team-mission` — Team Mission Brief / action: preview / intent: handoff
- `team-workflow` — Full-Team Workflow / action: preview / intent: workflow
- `team-blockers` — Cross-Team Blockers / action: preview / intent: task
- `team-handoff` — Handoff Chain / action: preview / intent: handoff

## Main button handler signals
- ✅ Ask Specialist — `askBtn.onclick`
- ❌ Preview — `previewBtn.onclick`
- ❌ Task — `taskBtn.onclick`
- ❌ Workflow — `workflowBtn.onclick`
- ✅ Handoff — `handoffBtn.onclick`
- ✅ Voice — `voiceBtn.onclick`
- ✅ Save — `saveBtn.onclick`
- ✅ Clear — `clearBtn.onclick`
- ✅ Copy response — `responseCopyBtn.onclick`
- ✅ Use in composer — `responseUseBtn.onclick`
- ✅ Send to preview — `responseConvertBtn.onclick`
- ✅ Send to destination — `responseSendBtn.onclick`
- ✅ Read response — `responseReadBtn.onclick`
- ✅ Copy preview — `previewCopyBtn.onclick`

## Data action attributes detected
- None detected

## Data attributes detected
- `data-aicmdv2-prompt`
- `data-aicmdv2-prompt-text`
- `data-aicmdv2-quick`
- `data-aicmdv2-quick-template`
- `data-aicmdv2-specialist`
- `data-aicmdv2-tab`
- `data-aicmdv2-team-mode`
- `data-aicmdv2-tool`
- `data-ctrl-history`
- `data-ctrl-mode`
- `data-ctrl-quick`
- `data-ctrl-quick-template`
- `data-ctrl-route`
- `data-ctrl-route-owner`
- `data-ctrl-task-toggle`
- `data-page`

## Button IDs detected
- `aicmdV2AskBtn`
- `aicmdV2ClearBtn`
- `aicmdV2DraftTaskBtn`
- `aicmdV2DraftWorkflowBtn`
- `aicmdV2HandoffBtn`
- `aicmdV2Input`
- `aicmdV2NewSessionBtn`
- `aicmdV2PrepareBtn`
- `aicmdV2PreviewClearBtn`
- `aicmdV2PreviewCopyBtn`
- `aicmdV2PreviewReadBtn`
- `aicmdV2PreviewSaveBtn`
- `aicmdV2PreviewSendBtn`
- `aicmdV2PreviewUseBtn`
- `aicmdV2SaveBtn`
- `aicmdV2SettingsBtn`
- `aicmdV2Status`
- `aicmdV2VoiceBtn`
- `aicmdV3ResponseConvertBtn`
- `aicmdV3ResponseCopyBtn`
- `aicmdV3ResponseReadBtn`
- `aicmdV3ResponseSaveBtn`
- `aicmdV3ResponseSendBtn`
- `aicmdV3ResponseUseBtn`
- `ctrlBuildTaskBtn`
- `ctrlClearBtn`
- `ctrlGlobalBtn`
- `ctrlRefreshBtn`
- `ctrlSendBtn`

## DOM lookup IDs
### getElementById
- None detected

### querySelector IDs
- None detected

## Safety checks
- ✅ Draft only language: 1
- ✅ Requires confirmation: 1
- ✅ No direct publish/send claim: 1
- ✅ Danger phrase publish now: 1
- ✅ Danger phrase create live ticket: 1

## CSS interaction checks
- ✅ Button hover: 14
- ✅ Button disabled: 4
- ✅ Active state: 15
- ✅ Focus visible: 15
- ✅ Tool chip: 1
- ✅ Chat card: 7
- ✅ Preview: 74
- ✅ Transition: 74

## Routing / destination hints
### routeSuggestion labels
- Ads Manager
- Campaign Studio
- Content Studio
- Insights
- Integrations
- Publishing
- Setup
- Workflows

### destinationRouteForSpecialist calls
- `destinationRouteForSpecialist(session.modeId, "guidance")`
- `destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview)`
- `destinationRouteForSpecialist(specialistId, outputType)`

## Potential issues to review manually
- If composer buttons still build long chains, replace Task/Workflow/Handoff handlers with setAiComposerValue().
- If Preview/Tools/Context tabs show content but are not obvious, improve active state and helper text.
- If tool cards only load text into composer, label them as "Prepare draft" / "Preview guidance" instead of implying execution.
- If Send to Destination only routes handoff state, keep wording "Route draft" not "Send live".
- If Voice is browser-only, label as "Voice Ready" / "Browser voice" not full voice assistant.
- If Customer Ops tools are draft-only, preserve confirmation wording.

## Recommended next patch
Only if this audit confirms handlers exist but UX needs clarity:
- Rename some buttons for clarity.
- Add small helper descriptions for tabs.
- Route all composer-producing buttons through setAiComposerValue().
- Add disabled tooltip/label for actions not connected yet.
- Keep changes limited to:
  - public/control-center/pages/ai-command.js
  - public/control-center/styles/12-pages.css
  - audit file only

## No-go
Do not change backend, server, API, data/projects, or Customer Operations runtime in this AI Team polish step.
