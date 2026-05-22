# STEP G6 — Global Operating Primitive Mapping

**Purpose:**
Map all existing MH-OS frontend operating surfaces, layouts, workflows, AI surfaces, preview systems, and page structures into the final operating primitive architecture before migration. This is a documentation-only audit and mapping step. No code, CSS, or backend changes.

---

## 1. Existing Page Mapping

| Page | Category | Purpose | Strengths | UX Problems | Migration Complexity | Reusable Components | Dangerous Areas | Preview Opportunities | AI Workforce Opportunities |
|------|----------|---------|-----------|-------------|---------------------|---------------------|-----------------|----------------------|---------------------------|
| Governance | Governance Surface | Approvals, evidence, authority | Clear workflow, audit trail | Legacy overlays, selector risk | High | Timeline, approval panel | Layered CSS, overlays | Governance preview | AI approval assistant |
| Publishing | Publishing Surface | Campaigns, scheduling | Modular, previewable | Duplicated layouts | Medium | Preview container | CSS duplication | Publishing preview | AI publishing planner |
| AI Team Command Center | AI Workforce Surface | AI collaboration, execution | Role-based, flexible | Context switching | Medium | Specialist cards | State sync | AI execution preview | Meeting room, operational AI |
| Customer Operations | Customer Operation Surface | Case management | Evidence linking | Noisy UI | High | Evidence surface | Overlays | Customer preview | AI escalation, summary |
| Media Manager | Media/Content Surface | Asset management | Bulk ops, filters | Legacy CSS | Medium | Card grid | CSS patches | Media preview | AI tagging |
| Research Insights | Research/Insight Surface | Data analysis | Visual clarity | Sparse actions | Low | Insight cards | None | Insight preview | AI research assistant |
| Setup/Utility | Utility/Setup Surface | Configuration | Simple, isolated | Inconsistent panels | Low | Utility panel | None | Utility preview | Minimal |
| Executive Dashboard | Executive Surface | Overview, KPIs | High-level, summary | Card wall anti-pattern | Medium | Summary strip | Card wall | Executive preview | Executive AI mode |

## 2. Primitive Mapping

| Page | Smart Header | Workspace | Preview Surface | Action Panel | AI Panel | Workflow Ribbon | Evidence Surface | Operational Timeline | Command Surfaces | Approval Surfaces |
|------|-------------|-----------|-----------------|--------------|---------|------------------|------------------|---------------------|------------------|-------------------|
| Governance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Publishing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |   | ✓ | ✓ |   |
| AI Team Command Center | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |   | ✓ | ✓ |   |
| Customer Operations | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |   |
| Media Manager | ✓ | ✓ | ✓ | ✓ | ✓ |   |   |   | ✓ |   |
| Research Insights | ✓ | ✓ | ✓ | ✓ | ✓ |   |   |   | ✓ |   |
| Setup/Utility | ✓ | ✓ | ✓ | ✓ |   |   |   |   | ✓ |   |
| Executive Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |   |   | ✓ | ✓ |   |

## 3. AI Workforce Mapping

| Page | AI Specialists | Collaboration | Meeting Room | Operational AI | Executive AI |
|------|---------------|---------------|-------------|---------------|--------------|
| Governance | Approval, Evidence | Yes | No | Yes | Yes |
| Publishing | Publishing, Scheduling | Yes | Yes | Yes | No |
| AI Team Command Center | All | Yes | Yes | Yes | Yes |
| Customer Operations | Escalation, Summary | Yes | No | Yes | No |
| Media Manager | Tagging | No | No | Yes | No |
| Research Insights | Research | Yes | No | Yes | No |
| Setup/Utility | Minimal | No | No | No | No |
| Executive Dashboard | Executive | Yes | Yes | No | Yes |

## 4. Result Preview Mapping

| Page | Social | Video | Governance | Campaign | Customer | IVR | Sales | Publishing | AI Execution |
|------|--------|-------|------------|---------|----------|-----|-------|------------|--------------|
| Governance |   |   | ✓ |   |   |   |   |   | ✓ |
| Publishing | ✓ | ✓ |   | ✓ |   |   |   | ✓ | ✓ |
| AI Team Command Center |   |   |   |   |   |   |   |   | ✓ |
| Customer Operations |   |   |   |   | ✓ | ✓ | ✓ |   | ✓ |
| Media Manager | ✓ | ✓ |   |   |   |   |   |   |   |
| Research Insights |   |   |   |   |   |   |   |   |   |
| Setup/Utility |   |   |   |   |   |   |   |   |   |
| Executive Dashboard | ✓ |   | ✓ | ✓ |   |   | ✓ |   |   |

## 5. Workflow Visualization Mapping

| Page | Workflow-Heavy | Approval-Heavy | Handoff-Heavy | Timeline-Heavy | Execution-Heavy |
|------|---------------|---------------|--------------|---------------|-----------------|
| Governance | ✓ | ✓ | ✓ | ✓ | ✓ |
| Publishing | ✓ |   | ✓ | ✓ | ✓ |
| AI Team Command Center | ✓ |   | ✓ | ✓ | ✓ |
| Customer Operations | ✓ | ✓ | ✓ | ✓ | ✓ |
| Media Manager |   |   |   |   |   |
| Research Insights |   |   |   |   |   |
| Setup/Utility |   |   |   |   |   |
| Executive Dashboard | ✓ |   | ✓ | ✓ |   |

## 6. Existing Reusable Structures
- Shell: Used by all main pages
- Panels: Action, AI, Evidence, Approval
- Cards: Specialist, Summary, Insight
- Layouts: Grid, Stack, Timeline
- Workflow: Approval, Execution, Handoff
- AI: Specialist cards, Collaboration threads
- Preview: Container, Strip, Modal

## 7. High-Risk Migration Zones
- Governance: Layered CSS, overlays, legacy selectors
- Customer Operations: Overlays, noisy UI
- Media Manager: Legacy CSS patches
- Executive Dashboard: Card wall anti-pattern

## 8. Low-Risk Migration Candidates
- Research Insights: Isolated, clean
- Setup/Utility: Simple, low coupling
- Publishing: Modular, previewable
- AI Team Command Center: Modern, flexible


## 9. Migration Sequence Recommendation

**Recommended sequence (balancing impact and safety):**
1. Publishing — first visible Result Preview migration, medium risk, high impact.
2. AI Team Command Center — first AI Workforce experience migration, low/medium risk, high strategic impact.
3. Research Insights — low-risk validation page for primitives.
4. Setup/Utility — low-risk form/panel standardization.
5. Executive Dashboard / Home — executive operating room.
6. Media Manager / Media Studio — asset and preview-heavy migration.
7. Customer Operations + IVR/Sales — operational network migration.
8. Governance — high-impact but high-risk, migrate after primitives are proven.

**Note:**
Governance remains the most important authority surface, but should not be the first full migration because it is high-risk. It can receive small safe improvements, but full operating-surface migration should happen after Publishing and AI Team patterns are proven.

**AI Workforce:** Start with Command Center, then Publishing, then Governance.
**Preview:** Start with Publishing, then Governance, then Customer.
**Command Surfaces:** Start with Publishing, then Governance.

## 10. Final Migration Readiness Score

| Page | Readiness | Risk | Cleanliness | UX Opportunity |
|------|-----------|------|-------------|---------------|
| Governance | 4/10 | High | Low | High |
| Publishing | 7/10 | Medium | Medium | High |
| AI Team Command Center | 8/10 | Low | High | High |
| Customer Operations | 5/10 | High | Low | Medium |
| Media Manager | 6/10 | Medium | Medium | Medium |
| Research Insights | 9/10 | Low | High | Medium |
| Setup/Utility | 9/10 | Low | High | Low |
| Executive Dashboard | 6/10 | Medium | Medium | High |

## 11. Required Validation
- Browser QA for each migration
- Rollback checkpoints after each major migration
- Selector duplication checks before/after
- Visual regression checks for all primitives
- Workflow continuity checks for all operational flows

## 12. Shared Global Primitive Ownership

Global operating primitives must remain centralized.

Examples:
- Smart Header
- Action Panel
- AI Team Surface
- Workflow Ribbon
- Preview Containers
- Approval Surface
- Operational Timeline

Rules:
- primitives may not diverge between pages
- page-specific customization must remain scoped
- primitive behavior must remain consistent
- visual language must remain unified
- duplicate primitive implementations are forbidden

All primitive updates must:
- document affected pages
- include visual QA
- include rollback verification

---

**This mapping must be reviewed and signed by all contributors before migration begins.**
