# AI Team Tools System Blueprint

## Purpose

The AI Team tools must show the power of MH Assistant OS without making the page crowded.

The final experience should feel like a professional Canva-style launcher, but adapted to MH OS:

- Fast tool discovery
- Clear categories
- Safe preview-first execution
- Source-aware creation
- Connected flow into Content Studio, Library, Workflows, and Handoffs

The tools should not be hidden completely and should not appear as heavy cards that crowd the Output Workspace.

---

## Core UX Principle

The user should experience this flow:

1. Ask the AI Team in chat.
2. Choose a specialist tool.
3. Optionally select sources from Library or project context.
4. Create a preview.
5. Send the result to Content Studio, Library, Task Center, Workflow, or Handoff.

No direct publishing, approval, customer reply, CRM update, workflow run, file overwrite, deletion, or backend mutation should happen from the AI Command chat.

---

## Recommended UI Pattern

### Canva-like Tool Launcher

Use compact tool buttons instead of large stacked cards.

Recommended layout:

Content Writer Tools · 12 tools

Quick:
[Rewrite] [Translate] [Improve] [Summarize]

Marketing:
[Hook] [Caption] [CTA] [Email] [Landing Page]

Sources:
[Read Sources] [Brand Profile] [Product Info] [Library Folder]

Create:
[Company Profile] [Contract Draft] [Speech] [Presentation]

Each tool should include:

- Icon
- Label
- Optional info icon
- Safe action state
- Output type
- Destination route

---

## Tool Categories

### Quick Tools

Used for fast edits on the latest chat output, selected text, or composer text.

Examples:

- Rewrite
- Translate
- Improve tone
- Summarize
- Shorten
- Make professional
- Make social-media ready

### Marketing Tools

Used to create campaign and publishing copy.

Examples:

- Hook Generator
- Caption Builder
- CTA Refiner
- Email Draft
- Landing Page Copy
- Blog Article
- Product Description
- Ad Copy

### Source Tools

Used when the output should be grounded in project files, folders, brand assets, product files, contracts, or prior campaign notes.

Examples:

- Read Library Folder
- Use selected sources
- Use Brand Profile
- Use Product Info
- Use Contract
- Use Presentation
- Use Campaign Notes

### Create Tools

Used to create structured business documents or content packages.

Examples:

- Company Profile
- Contract Draft
- Speech
- Presentation Outline
- Partnership Proposal
- Press Release
- Campaign Brief

### Work Tools

Used to route work safely into operating surfaces.

Examples:

- Create Draft
- Create Task
- Create Workflow
- Create Handoff
- Send to Content Studio
- Send to Publishing
- Save to Library

---

## Interaction After Tool Click

Tools should not execute immediately if sources or output type are unclear.

### Simple tool flow

Example: Rewrite

1. Click Rewrite.
2. Use selected text, latest response, or composer text.
3. Create Preview.
4. Copy, use in composer, or send to Content Studio.

### Source tool flow

Example: Read Sources

1. Click Read Sources.
2. Open Source Picker.
3. Choose Library folder, selected files, brand profile, product info, or campaign notes.
4. Choose output type.
5. Create Preview.
6. Send to Content Studio, save to Library, create task, or create handoff.

### Create tool flow

Example: Create Company Profile

1. Click Company Profile.
2. Ask for source selection if needed.
3. Generate structured preview.
4. Send to Content Studio.
5. Optional: save to Library.

---

## Source Picker Concept

When a source-aware tool is clicked, show a panel:

Read Sources

1. Choose source:
[Brand Profile] [Product Info] [Library Folder] [Selected Files] [Campaign Notes]

2. Choose output:
[Company Profile] [Contract Draft] [Speech] [Presentation Outline] [Blog Article]

3. Language and market:
Chat language: user language
Publishing language: project language
Market: project market

4. Action:
[Create Preview]

---

## Content Studio Templates

Content Studio should support reusable templates for any project or brand.

### Universal Templates

- Company Profile
- Brand Story
- Product Page
- Instagram Post
- Facebook Post
- TikTok Script
- Email Campaign
- Landing Page
- Blog Article
- Press Release
- Presentation Outline
- Sales Script
- Partnership Proposal
- Contract Draft
- FAQ Page
- Customer Reply

### E-commerce Templates

- Product Description
- Launch Campaign
- Offer Page
- Review Request Email
- Influencer Brief
- Ad Copy
- Bundle Campaign

### Beauty / Salon Templates

- Service Menu
- Promotion Post
- Booking Message
- Customer Care Reply
- Before / After Caption
- Loyalty Offer

### B2B Templates

- Company Profile
- Partnership Proposal
- Sales Email
- Partnership Deck
- Contract Draft
- Corporate Speech

### Software / AI Templates

- Feature Announcement
- Onboarding Email
- Help Article
- Release Notes
- Demo Script
- Use Case Page

---

## Specialist Tool Map

### Strategist

- Campaign Plan
- Launch Plan
- Offer Builder
- Audience Map
- Funnel Map
- Priority Sort
- Competitor Angle
- Next Best Action
- Business Brief

### Content Writer

Quick:

- Rewrite
- Translate
- Improve Tone
- Summarize
- Shorten
- Make Professional

Marketing:

- Hook Generator
- Caption Builder
- CTA Refiner
- Email Draft
- Landing Copy
- Blog Article
- Product Description
- Ad Copy

Sources:

- Read Library Folder
- Use selected sources
- Use Brand Profile
- Use Product Info
- Use Campaign Notes

Create:

- Company Profile
- Contract Draft
- Speech
- Presentation Outline
- Partnership Proposal
- Press Release

### Media Director

- Creative Brief
- Visual Direction
- Asset Checklist
- Brand Alignment
- Design Prompt
- Moodboard Direction
- Image Prompt
- Format Mapper

### Video Lead

- Reel Script
- TikTok Script
- Hook Variants
- Storyboard
- Shot List
- Voiceover
- Scene Breakdown
- Video CTA

### Publisher

- Publishing Package
- Channel Checklist
- Schedule Draft
- Hashtag Review
- Approval Checklist
- Caption Finalizer
- Pre-Publish Risk Check

### Compliance Reviewer

- Claims Check
- Safer Wording
- GDPR Review
- Evidence Needed
- Approval Notes
- Legal Tone Check
- Risk Review

### Operations Lead

- Task Draft
- Workflow Draft
- Handoff Plan
- Timeline
- Blocker Review
- Owner Map
- Execution Checklist

### Customer Operations

- Reply Draft
- Ticket Summary
- Complaint Response
- FAQ Builder
- SLA Risk
- Escalation Draft
- Tone Review

### Sales / CRM

- Follow-up Email
- Offer Message
- CRM Note
- Objection Handling
- Call Script
- Partnership Outreach
- Lead Qualification

---

## Tool Registry Target Shape

Future tools should be defined in a canonical registry.

Recommended structure:

```js
{
  id: "create-company-profile",
  label: "Company Profile",
  icon: "🏢",
  category: "create",
  specialist: "writer",
  requiresSources: true,
  outputType: "document",
  destination: "content-studio",
  safety: "preview_only",
  template: "Create a company profile for {project} using selected sources."
}
Safety Rules

All tools in AI Command must be preview-first.

Allowed:

Prepare draft
Create preview
Copy
Use in composer
Send draft context to owning workspace
Create local handoff preview

Not allowed from AI Command chat:

Direct publish
Direct approval
Direct workflow run
Direct CRM mutation
Direct customer reply
Direct file overwrite
Direct deletion or archive
Implementation Phases
Phase 1 — Visual Tools Bar

Convert current specialist tool cards into compact Canva-like tool buttons.

No backend changes.
No Library integration.
No new execution path.

Phase 2 — Tool Categories

Add visible categories:

Quick
Marketing
Sources
Create
Work

Add safe preview-only tools.

Phase 3 — Source Picker

Create a Source Picker panel for Library folders, selected files, brand profile, product info, and project notes.

Phase 4 — Content Studio Templates

Add template selection inside Content Studio and allow tools to route structured drafts into those templates.

Phase 5 — Source-Aware Generation

Enable selected sources to be used by the AI Team for grounded content generation.

First Safe Implementation Recommendation

Do not hide tools.

Do not add many tools immediately.

First patch should only change the visual design of the current tools:

From:

Large stacked tool cards

To:

Compact Canva-like tool launcher / pills

Preserve:

existing PHASE35_SPECIALIST_TOOLS
existing data-aicmdv2-tool handlers
existing preview routing
existing safety behavior
