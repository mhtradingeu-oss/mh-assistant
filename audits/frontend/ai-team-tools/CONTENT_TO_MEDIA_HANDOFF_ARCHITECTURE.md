# Content to Media Handoff Architecture

## Purpose

This document defines the official flow from source-aware content creation to design execution inside MH-OS.

The goal is to prevent the AI chat from becoming crowded and to make each workspace do its correct job.

## Core Flow

Library Sources
→ Content Writer
→ Content Studio
→ Media Studio
→ Publishing
→ Governance / Compliance when required

## Responsibility Split

### Library

Library is the source authority for selected files, folders, brand documents, product information, certificates, contracts, campaign notes, and uploaded assets.

Library does not create final copy or final design.

### AI Command

AI Command starts the request and helps the user select:

- specialist
- tool
- source
- output type
- destination

AI Command should create preview-only work and should not publish, approve, overwrite files, or run backend execution directly.

### Content Writer

Content Writer reads the selected source context and prepares structured copy.

Examples:

- company profile draft
- campaign copy
- presentation outline
- speech draft
- contract draft
- landing page copy
- social post
- email copy
- product description

Content Writer may include design notes, but does not own the final design.

### Content Studio

Content Studio is the production workspace for written content.

It should allow the user to:

- review the draft
- improve wording
- translate
- rewrite
- check claims
- select a template
- save as content draft
- send to Media Studio
- send to Compliance
- send to Publishing when design is not needed

### Media Studio

Media Studio owns design preparation.

It receives a Design Brief from Content Studio.

A Design Brief should include:

- project name
- output type
- selected sources
- final or draft copy
- target market
- publish language
- brand tone
- required format
- visual direction
- required assets
- image prompts
- layout suggestions
- CTA
- compliance notes if available

Media Studio may produce:

- visual brief
- image prompt
- creative direction
- asset checklist
- layout plan
- presentation structure
- PDF/brochure direction
- campaign visual package

### Publishing

Publishing owns channel readiness and publishing preparation.

It should receive only reviewed packages:

- final copy
- final design or media package
- channel metadata
- schedule draft
- approval status
- compliance status

## UX Rule

After Content Writer creates content, the user should see a Next Best Action section:

This content is ready for design.

Recommended actions:

- Send to Media Studio
- Create Visual Brief
- Send to Compliance
- Save to Library
- Send to Publishing

## Safety Rule

No automatic routing should happen without user confirmation.

Allowed:

- create preview
- prepare handoff draft
- send context to another workspace
- save draft
- copy
- use in composer

Not allowed without explicit confirmation:

- publish
- approve
- execute workflow
- overwrite file
- delete/archive
- send customer reply
- run backend mutation

## Required Handoff Object

A future handoff from Content Studio to Media Studio should have this shape:

{
  "handoff_type": "content_to_media",
  "project": "project-name",
  "source_workspace": "content-studio",
  "destination_workspace": "media-studio",
  "output_type": "company-profile | presentation | social-post | campaign-visual | brochure | ad-creative",
  "content_status": "draft | review-ready | approved",
  "sources_used": [],
  "copy": "",
  "visual_direction": "",
  "required_assets": [],
  "target_market": "",
  "publish_language": "",
  "safety_label": "preview_only",
  "created_at": ""
}

## Implementation Phases

### Phase 1 — Documentation and Audit

Document this architecture.
Audit current AI Command, Content Studio, Media Studio, Library, and shared-context handoff points.

### Phase 2 — UI Preview Only

Add a visible Content to Media next-action surface inside Content Studio.
No backend mutation.
No automatic routing.

### Phase 3 — Shared Handoff Draft

Use existing shared context or safe draft handoff mechanism to pass content context to Media Studio.

### Phase 4 — Media Studio Intake Panel

Show received content package inside Media Studio as a design brief intake.

### Phase 5 — Durable Backend Handoff

Only after preview flow is validated, connect to durable backend handoff if available.

## First Safe Implementation Recommendation

Do not start by creating a new page.

Do not make AI Command the only tool workspace.

Start with:

1. AI Command tool dock starts the request.
2. Content Studio owns the written result.
3. Content Studio shows Send to Media Studio.
4. Media Studio receives a design brief preview.
5. Publishing receives only reviewed packages.
