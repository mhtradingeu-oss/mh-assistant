# AI Operating Home Data Source Map

## Purpose
Map every section of the future AI Operating Home to existing backend/frontend data sources before changing the UI.

## Principle
Use existing system data first. Do not create new backend endpoints until the read-only experience proves valuable.

## 1. Project Command Summary

### Data sources
- state.data.overview
- state.data.readiness
- state.data.integrations
- state.data.activity
- operations summary if available

### Shows
- Project readiness
- System health
- Launch blockers
- Pending approvals
- Active workflows
- Latest activity
- Missing foundation data

## 2. Next Best Action

### Data sources
- readiness blockers
- integration recommendations
- workflow queue
- pending approvals
- publishing readiness
- latest AI recommendations
- missing assets from Library

### Decision priority
1. Critical blocker
2. Pending approval
3. Ready-to-publish item
4. Missing integration
5. Missing asset
6. Campaign/content/media task
7. Learning or optimization recommendation

## 3. AI Team Panel

### Data sources
- operations team roles
- AI command modes
- workflows
- handoffs
- pending tasks
- recommendations
- page routing map

### Specialists
- Strategist
- Content Writer
- Media Director
- Publisher
- Ads Optimizer
- SEO Analyst
- Operations Manager
- Compliance Reviewer

### Each card shows
- Role
- Current focus
- Waiting action
- Recommended command
- Destination page

## 4. Work Journey Pipeline

### Stages
- Idea
- Plan
- Create
- Review
- Approve
- Publish
- Promote
- Measure
- Learn

### Existing page mapping
- Idea: AI Command / Research
- Plan: Campaign Studio
- Create Content: Content Studio
- Create Media: Media Studio
- Review: Governance
- Approve: Operations / Governance
- Publish: Publishing
- Promote: Ads Manager
- Measure: Insights
- Learn: AI Command / Insights

## 5. Active Task Cards

### Data sources
- tasks
- workflow runs
- approvals
- handoffs
- media jobs
- content items
- publishing queue
- AI commands
- notifications

### Fields
- task type
- owner specialist
- status
- next action
- output preview if available
- approval state
- destination route

## 6. Intelligence & Learning

### Data sources
- insights
- learning patterns
- recommendations
- integration coverage
- campaign performance
- content performance
- media performance
- paid ads metrics

### Shows
- What improved
- What failed
- What the system learned
- What data is missing
- What should be tested next

## Implementation order

### Step 1
Build read-only data aggregator for Home.

### Step 2
Render AI Operating Home sections using existing data.

### Step 3
Add navigation actions only.

### Step 4
Add AI command quick actions.

### Step 5
Add approval/publish/edit actions only after read-only version is stable.

## Risk control
- No backend rewrite.
- No old page removal.
- No destructive action from Home initially.
- Every card links to an existing page.
- Keep existing pages as source tools.
