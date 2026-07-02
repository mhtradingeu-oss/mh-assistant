# Content Writer Tool Intelligence

## Purpose

Define the Content Writer tool system as a reusable, project-agnostic operating layer for creating, improving, checking, adapting, and routing written content.

The Content Writer should not show many output-specific buttons such as Company Profile, Contract, Presentation, Blog, or Email directly in the dock.

Those are output types.

The dock should show high-level tools that work for any project:

- Write
- Rewrite
- Translate
- Improve
- Check
- Sources
- SEO
- Repurpose
- Send

The user chooses the output type inside the tool flow.

---

## Core Principle

A tool is an operation.

An output type is the result.

Example:

Write is a tool.

Company Profile, Product Copy, Email, Blog Article, Landing Page, Contract Draft, Presentation Outline, Speech, FAQ, and Proposal are output types inside Write.

This keeps the UI clean, scalable, and suitable for any project, not only one brand or one business type.

---

## Existing System Capabilities

Content Writer should use the existing MH-OS structure:

- AI Command for natural interaction and tool selection
- Library for source-of-truth documents and assets
- Content Studio for drafts, modes, previews, review, saving, and routing
- Media Studio for design brief handoff
- Publishing for final readiness and scheduling
- Governance / Compliance for claim and legal review
- Workflows / Operations for task and handoff preparation

The current system already has:

- Content Studio modes
- Content preview
- Save to Library
- Send Design Brief to Media Studio
- Handoff payloads from Content Studio to Media Studio
- Library folders and source-of-truth concepts
- AI Command preview / draft / task / workflow / handoff flows

---

## Tool Model

Each Content Writer tool should eventually have:

- id
- label
- icon
- short description
- action type
- input requirements
- output types
- source requirements
- destination mapping
- safety rule
- first implementation mode
- future implementation mode

---

## Content Writer Dock V2

Recommended dock tools:

1. Write
2. Rewrite
3. Translate
4. Improve
5. Check
6. Sources
7. SEO
8. Repurpose
9. Send

These names are generic and work for any project.

---

## Tool 1: Write

### Purpose

Create new written content from scratch, current chat, manual input, or selected sources.

### Output Types

- Company Profile
- Product Copy
- Email
- Blog Article
- Landing Page
- Contract Draft
- Presentation Outline
- Speech
- FAQ
- Proposal
- Social Post
- Ad Copy

### Required Inputs

Minimum:

- desired output type
- project context
- language
- tone
- destination

Optional but recommended:

- Library source
- brand profile
- product data
- legal / pricing docs
- proof / research docs
- target market
- CTA
- audience

### Action Type

V1:

- prefill composer only

V2:

- smart drawer
- choose output type
- choose sources
- create preview

V3:

- send draft to Content Studio

### Destination

Primary:

- Content Studio

Secondary:

- Chat Preview
- Save to Library
- Media Brief after content approval

### Safety

No publishing.
No email sending.
No legal finalization.
No claims without source notes.

---

## Tool 2: Rewrite

### Purpose

Rewrite existing text into a clearer, stronger, shorter, more professional, or more persuasive version.

### Rewrite Modes

- Professional
- Simpler
- Shorter
- More persuasive
- Premium tone
- Friendly tone
- Formal tone
- Platform-specific rewrite

### Input

- selected text
- composer text
- last AI response
- Content Studio draft

### Action Type

V1:

- prefill composer

V2:

- preview rewrite variants

V3:

- replace selected draft after confirmation

### Destination

- Composer
- Content Studio
- Library version history later

---

## Tool 3: Translate

### Purpose

Translate and localize copy for the target market.

This should not be only literal translation.

It should support:

- translation
- localization
- tone preservation
- cultural adaptation
- CTA adaptation
- market-specific wording

### Inputs

- source language
- target language
- target market
- tone
- audience
- destination

### Action Type

V1:

- prefill composer

V2:

- localization drawer

V3:

- save localized version in Content Studio

---

## Tool 4: Improve

### Purpose

Improve weak content without changing the core message.

### Improvement Types

- clarity
- structure
- CTA
- value proposition
- readability
- tone
- flow
- trust signals
- conversion strength

### Action Type

V1:

- prefill composer

V2:

- improvement preview report

V3:

- apply suggested rewrite after confirmation

---

## Tool 5: Check

### Purpose

Review content quality and safety before moving it forward.

### Check Types

- grammar
- spelling
- tone
- readability
- CTA strength
- claim risk
- missing proof
- SEO weakness
- compliance note

### Action Type

V1:

- prefill composer

V2:

- preview report

V3:

- route issues to Compliance Reviewer or Governance

### Destination

- AI Command preview
- Compliance / Governance later
- Content Studio review notes

---

## Tool 6: Sources

### Purpose

Prepare or request source context before writing.

### Source Types

- current chat
- selected Library folder
- brand profile
- product data
- legal / pricing documents
- research / proof documents
- source-of-truth assets
- manual input

### Action Type

V1:

- prefill source request

V2:

- Library source picker

V3:

- source bundle saved to shared context

### Destination

- Library
- AI Command context
- Content Studio

---

## Tool 7: SEO

### Purpose

Support search-ready content planning.

### Output Types

- SEO brief
- keyword clusters
- search intent map
- blog outline
- meta title / description
- FAQ ideas
- internal link plan
- content gap list

### Action Type

V1:

- prefill composer

V2:

- SEO brief preview

V3:

- connect to Insights / keyword trend source when available

### Destination

- Content Studio
- Insights
- Library

---

## Tool 8: Repurpose

### Purpose

Transform existing content into another format.

### Examples

- blog to social posts
- profile to pitch
- product page to ad copy
- transcript to article
- notes to presentation outline
- contract notes to summary
- long article to email sequence

### Action Type

V1:

- prefill composer

V2:

- choose source format and target format

V3:

- create multi-output package in Content Studio

---

## Tool 9: Send

### Purpose

Route prepared content safely.

### Possible Destinations

- Content Studio
- Save to Library
- Prepare Media Brief
- Publishing package
- Compliance review
- Task / Handoff preview

### Action Type

V1:

- prefill routing request

V2:

- route preview

V3:

- shared context / handoff after confirmation

### Safety

No direct publishing.
No direct email send.
No direct backend mutation without confirmation.

---

## Smart Drawer UX

The Content Writer dock should eventually open a drawer instead of only filling the composer.

Drawer sections:

1. Tool title and short description
2. Output type
3. Source selection
4. Language / market / tone
5. Destination
6. Safety note
7. Create Preview button
8. Send to workspace button when ready

Example for Write:

- Output Type: Company Profile / Product Copy / Email / Blog / Landing Page / Contract Draft / Presentation Outline
- Source: Current Chat / Library Folder / Brand Profile / Product Data / Legal Docs / Research Docs
- Destination: Chat Preview / Content Studio / Save to Library / Prepare Media Brief

---

## UI Direction

The dock should stay compact.

Recommended visible tools:

Write / Rewrite / Translate / Improve / Check / Sources / SEO / Repurpose / Send

Visual behavior:

- clear icon
- short label
- badge showing action type
- hover lift
- subtle glow
- tooltip
- active selected state
- drawer slide-in later
- no crowded output-specific dock

---

## Implementation Plan

### CW1

Create this intelligence plan.

### CW2

Update Content Writer dock tools from output-specific buttons to generic tools.

### CW3

Keep all actions as prefill only.

### CW4

Browser QA: ensure Content Writer dock is generic and project-agnostic.

### CW5

Commit and push.

### CW6

Design Smart Drawer for Write only.

### CW7

Connect Write drawer to output type and destination selection.

### CW8

Connect Send to Content Studio using existing shared context / handoff flow.

### CW9

Add source picker using Library context.

---

## First Code Change Recommendation

Change only the writer block inside:

public/control-center/pages/ai-command/tool-dock.js

Replace output-specific tools with:

- Write
- Rewrite
- Translate
- Improve
- Check
- Sources
- SEO
- Repurpose
- Send

Do not modify backend.
Do not modify API.
Do not modify Content Studio yet.
Do not modify Library yet.
Keep click behavior as composer prefill only.
