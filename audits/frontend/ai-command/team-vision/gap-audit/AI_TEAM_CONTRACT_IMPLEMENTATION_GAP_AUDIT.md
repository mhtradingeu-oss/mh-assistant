# AI Team Contract Implementation Gap Audit

## Purpose

Compare the current AI Command implementation against the AI Team Vision and Routing Contract.

## Contract baseline

The AI Team contract defines:

- AI Command as prepare/review/route only.
- No automatic durable execution.
- Solo Specialist and Full Team modes.
- Specialist ownership matrix.
- Output type taxonomy.
- Destination ownership matrix.
- Routing decision tree.
- Tool drawer UX contract.
- Shared handoff contract.
- Page ownership contract.

## Areas to verify

### 1. Specialist coverage

Verify whether current specialist definitions match the contract:

- Strategist
- Content Writer
- Media Director
- Video Lead
- Publisher
- Ads Optimizer
- SEO & Insights Analyst
- Compliance Reviewer
- Operations Lead
- Customer Operations Lead
- Sales / CRM Lead
- Planned Admin / Governance
- Planned Researcher
- Planned Automation Architect

### 2. Routing coverage

Verify whether current route logic supports:

- task-like -> Task Center
- workflow/process-like -> Workflows
- content-like -> Content Studio
- media-like -> Media Studio
- publishing-like -> Publishing
- campaign-level -> Campaign Studio or Workflows
- governance/risk -> Governance
- research/insight -> Research or Insights
- unclear -> stay in AI Command with suggested next destination

### 3. Full Team behavior

Verify whether Full Team always routes to Workflows or correctly classifies output type.

### 4. Tools / Drawer UX

Verify whether tools are grouped as:

- recommended next action
- primary tools
- secondary tools
- needs source tools
- advanced tools

Verify whether source-required tools avoid repeated disruptive toast messages.

### 5. Handoff payload

Verify whether routes include:

- source_page
- destination_page
- project
- output_type
- title
- summary
- payload
- created_at
- review_status
- safety_note

### 6. Destination intake

Verify whether destination pages visibly explain incoming context and review-only safety.

## Expected result

This audit should produce a clear gap list before implementation.

No code changes should be made during this audit.
