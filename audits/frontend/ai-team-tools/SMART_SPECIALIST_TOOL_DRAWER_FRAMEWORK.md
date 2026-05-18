# Smart Specialist Tool Drawer Framework

## Purpose

Define a reusable smart tool interaction system for all AI specialists.

The Tool Dock should stay compact and specialist-specific.

The Smart Tool Drawer should adapt its fields, requirements, actions, and destinations based on the selected specialist and selected tool.

This framework prevents the UI from becoming crowded with output-specific buttons while still exposing powerful system capabilities.

---

## Core Principle

A tool is an operation.

An output type is a result.

A tool may have many output types.

Example for Content Writer:

- Tool: Write
- Output Types: Company Profile, Product Copy, Email, Blog Article, Landing Page, Contract Draft, Presentation Outline, Speech, FAQ, Proposal

Example for Media Director:

- Tool: Edit Asset
- Output Types: Remove Background, Resize, Reframe, Format Variant, Thumbnail, Product Shot

Example for Sales / CRM:

- Tool: Find Leads
- Output Types: Lead List, Salon Prospects, Dealer Prospects, Local Business Prospects, CRM Import Draft

---

## Tool Definition Schema

Every tool should eventually define:

- id
- label
- icon
- badge
- specialistId
- description
- actionType
- requiredInputs
- optionalInputs
- outputTypes
- sourceTypes
- assetRequirements
- destinations
- safetyLevel
- defaultTemplate
- previewTemplate
- routeTarget
- backendCapability
- frontendOwnerPage

---

## Action Types

### prefill

Fills the composer only.

Used for fast low-risk tools.

Examples:

- Rewrite
- Translate
- Hook
- CTA
- Ad Copy

### guided

Opens the Smart Tool Drawer and asks for required fields before preparing output.

Examples:

- Write
- Repurpose
- SEO Brief
- Sales Pitch

### source_required

Requires Library, source-of-truth, document, brand, product, proof, or legal context.

Examples:

- Company Profile
- Product Copy
- Contract Draft
- Claims Check
- Evidence Needed

### asset_required

Requires a selected media asset.

Examples:

- Remove Background
- Resize
- Reframe
- Subtitle
- Thumbnail
- Brand Check on Asset

### preview

Creates a local preview only.

Examples:

- Task Plan
- Workflow Draft
- Campaign Plan
- Publishing Check
- Visual Brief

### route

Prepares context and routes to a destination workspace after user review.

Examples:

- Send to Content Studio
- Send to Media Studio
- Send to Publishing
- Send to Workflows
- Send to CRM

### execute

Runs backend work.

This must never run directly from AI Command without destination workspace confirmation.

Examples:

- Publish post
- Send email
- Create CRM records
- Run workflow
- Remove background
- Search Google Maps leads
- Generate media asset

---

## Drawer Sections

The Smart Tool Drawer should render sections based on the selected tool.

Possible sections:

1. Tool title and explanation
2. What do you want to create or do?
3. Output type
4. Source selection
5. Asset selection
6. Language / market / tone
7. Destination
8. Safety note
9. Missing requirements
10. Primary action
11. Secondary actions

---

## Generic Drawer Flow

1. User clicks a specialist tool.
2. System reads tool metadata.
3. If actionType is prefill, composer can be filled directly.
4. If actionType is guided/source_required/asset_required/route/preview, open Smart Tool Drawer.
5. Drawer shows only fields needed for that tool.
6. User reviews inputs.
7. User chooses one safe action:
   - Use in Composer
   - Create Preview
   - Choose Sources
   - Open Workspace
   - Prepare Handoff
8. Execution remains blocked unless handled in the destination workspace with confirmation.

---

## Destination Mapping

### Content tools

Primary destination:

- Content Studio

Secondary:

- Library
- Media Studio via Design Brief
- Publishing
- Compliance / Governance

### Media tools

Primary destination:

- Media Studio

Secondary:

- Library
- Publishing

### Video tools

Primary destination:

- Media Studio

Secondary:

- Library
- Publishing

### Strategy tools

Primary destination:

- Campaign Studio
- Workflows
- Content Studio

### Operations tools

Primary destination:

- Workflows
- Task Center
- Operations Centers

### Compliance tools

Primary destination:

- Governance
- Publishing Review
- Content Studio Review Notes

### Ads tools

Primary destination:

- Ads Manager
- Content Studio
- Media Studio
- Insights

### SEO tools

Primary destination:

- Insights
- Content Studio
- Library

### Sales / CRM tools

Primary destination:

- CRM
- Operations Centers
- Email / Outreach workspace when available

### Customer Ops tools

Primary destination:

- Operations Centers
- Ticket workflow
- Customer reply review

---

## Safety Rules

No direct publishing from AI Command.

No direct email sending from AI Command.

No CRM mutation from AI Command without confirmation.

No workflow run from AI Command.

No file deletion or overwrite from AI Command.

No media processing job from AI Command unless routed to Media Studio and confirmed.

No legal or compliance finalization without human review.

---

## Specialist Examples

### Content Writer

Dock:

- Write
- Rewrite
- Translate
- Improve
- Check
- Sources
- SEO
- Repurpose
- Send

Drawer examples:

Write:
- output type
- source
- language
- tone
- destination

Sources:
- current chat
- Library folder
- brand profile
- product data
- legal/pricing docs
- research/proof docs

Send:
- Content Studio
- Save to Library
- Prepare Media Brief
- Publishing package
- Compliance review

---

### Media Director

Dock:

- Create Visual
- Edit Asset
- Remove BG
- Resize
- Prompt
- Brand Check
- Format Pack

Drawer examples:

Remove BG:
- selected image asset
- output format
- destination
- preview before save

Resize:
- selected asset
- platform format
- output ratio
- destination

---

### Video Lead

Dock:

- Script
- Storyboard
- Subtitles
- Resize Video
- Scene Plan
- Voiceover
- Hook

Drawer examples:

Subtitles:
- selected video asset
- language
- style
- destination

Resize Video:
- selected video
- platform
- ratio
- preview

---

### Sales / CRM

Dock:

- Find Leads
- Qualify
- Draft Outreach
- Follow Up
- Objections
- CRM Brief

Drawer examples:

Find Leads:
- target business type
- location
- radius
- source
- destination CRM

Draft Outreach:
- lead type
- offer
- tone
- email / message format

---

### SEO / Insights

Dock:

- Keywords
- Trends
- SEO Brief
- Gap
- Analyze
- Meta
- Report

Drawer examples:

Keywords:
- topic
- market
- language
- intent
- destination Content Studio

Trends:
- market
- timeframe
- source
- output report

---

## UI / UX Direction

The dock should stay compact.

The drawer should feel modern and active:

- slide-in motion
- clear tool icon
- short explanation
- badges for action type
- required input chips
- destination cards
- source status indicators
- safety note
- primary action button
- secondary action buttons
- no crowded forms
- no hidden execution

Use motion carefully:

- hover lift on tools
- drawer slide-in
- active selected state
- ready / needs source badges
- subtle loading shimmer for preview preparation

---

## Implementation Phases

### TD8A

Create this framework plan.

### TD8B

Add metadata fields to tool definitions without changing behavior.

### TD8C

Create generic drawer shell.

### TD8D

Open drawer for guided tools but keep prefill fallback.

### TD8E

Apply drawer behavior to Content Writer first.

### TD8F

Add source-aware flow for Content Writer Sources and Write.

### TD8G

Add destination preview for Send.

### TD8H

Repeat per specialist:

1. Media Director
2. Publisher
3. Strategist
4. Operations Lead
5. Compliance Reviewer
6. Ads Optimizer
7. SEO & Insights
8. Customer Ops
9. Sales / CRM

---

## First Safe Code Direction

Do not start with backend.

Start by adding metadata to tool-dock.js.

Then create drawer UI shell.

Then connect only Content Writer Write and Sources.

All execution remains review-only.
