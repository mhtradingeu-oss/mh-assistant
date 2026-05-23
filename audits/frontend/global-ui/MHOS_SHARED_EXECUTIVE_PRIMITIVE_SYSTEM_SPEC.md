# MH-OS SHARED EXECUTIVE PRIMITIVE SYSTEM SPECIFICATION

## 1. Executive Primitive Philosophy

An executive primitive in MH-OS is a reusable, authority-driven UI building block that encodes the visual, interaction, and semantic intent of the MH-OS design language. Primitives are not just generic components—they are context-aware, role-specific, and designed to unify all operating pages under a single, international AI Operating System standard. They replace page-specific patterns with a consistent, scalable system that enables rapid innovation without visual chaos.

## 2. Primitive Categories

- **Command primitives:** For issuing, displaying, and managing executive actions (e.g., command headers, action strips)
- **Context primitives:** For conveying operational context, status, and summaries (e.g., context ribbons, summary strips)
- **AI primitives:** For AI presence, prompts, responses, and team/meeting room surfaces
- **Workflow primitives:** For visualizing, managing, and escalating workflows (e.g., workflow chains, escalation lanes)
- **Intelligence primitives:** For insights, metrics, and decision support (e.g., intelligence panels, metric cards)
- **Action primitives:** For buttons, quick actions, and orchestrated controls
- **Monitoring primitives:** For live status, logs, and operational health
- **Communication primitives:** For notifications, comments, and collaboration

## 3. Shared Page Header System

- **Command header:** Unified, role-aware header for all operating pages
- **Operating summary strip:** High-signal summary of current state, readiness, or focus
- **Strategist next move:** Dedicated area for next recommended action or escalation
- **Page intelligence:** Inline intelligence/insight panel for context-aware guidance
- **Primary actions:** Consistent placement for main page actions
- **Escalation indicators:** Visual cues for urgency, blockers, or required attention

## 4. Shared Surface System

- **Executive cards:** Standardized, token-driven cards for all data and actions
- **AI panels:** Surfaces for AI presence, prompts, and responses
- **Strategist panels:** Surfaces for human/AI strategy, guidance, and review
- **Orchestration surfaces:** For multi-role, multi-step coordination
- **Operational rails:** Side panels for navigation, context, or secondary actions
- **Monitoring surfaces:** For live metrics, logs, and system health
- **Workflow chains:** Visual representation of workflow steps and status
- **Escalation lanes:** Dedicated surfaces for escalations and handoffs

## 5. Shared Typography Rules

- **Executive hierarchy:** Clear, token-driven heading and section structure
- **AI voice hierarchy:** Distinct style for AI-generated content and prompts
- **Metrics hierarchy:** Large, high-contrast numerics for KPIs and status
- **Supporting metadata:** Subtle, consistent metadata for context and detail
- **Interaction labels:** Clear, accessible labels for all actionable elements

## 6. Shared Interaction Rules

- **Hover behavior:** Subtle elevation, color, or shadow cues on actionable surfaces
- **Focus behavior:** Strong, accessible focus rings using tokens
- **Actionable surfaces:** Only primitives with clear affordance are interactive
- **Active states:** Visual feedback for pressed/active states
- **Selected states:** Persistent highlight for selected/active items
- **Orchestration emphasis:** Priority cues for orchestrated/critical actions

## 7. Shared Motion Rules

- **Where motion belongs:** Only on actionable, executive, or AI surfaces
- **Surface response:** Micro-interactions for hover, focus, and state changes
- **AI-presence feeling:** Subtle motion to indicate AI activity or presence
- **Command emphasis:** Motion used to draw attention to next actions or escalations

## 8. Primitive Ownership Map

- **Tokens:** 00-tokens.css
- **Shell:** 03-app-shell.css
- **Generic components:** 08-components-foundation.css (until primitives extracted)
- **Executive primitives:** New primitives files (to be extracted from 15-clean-operating-layer.css and 08-components-foundation.css)
- **Page compositions:** 14-page-standard.css (for shared page context)
- **Legacy fallback:** 12-pages.css (frozen, only for legacy support)

## 9. Primitive Extraction Plan

- **Extract first:** Command headers, executive cards, context ribbons, action strips, workflow chains, escalation lanes
- **Remain temporarily in 15-clean-operating-layer.css:** AI panels, strategist panels, orchestration surfaces, until refactored
- **Later become dedicated primitive files:** All above, organized by category (e.g., mhos-command-primitives.css, mhos-ai-primitives.css)

## 10. Shared Naming Convention

- `mhos-command-*` for command headers, action strips
- `mhos-ai-*` for AI panels, prompts, presence
- `mhos-workflow-*` for workflow chains, steps, escalation lanes
- `mhos-intelligence-*` for intelligence panels, metrics
- `mhos-operating-*` for orchestration, summary, operational rails
- `mhos-context-*` for context ribbons, summary strips
- `mhos-action-*` for buttons, quick actions
- `mhos-monitor-*` for monitoring surfaces
- `mhos-comm-*` for communication primitives

## 11. Page Adoption Matrix

| Page | Required Primitives | To Replace | Temporary Allowed |
|------|---------------------|------------|------------------|
| Home | Command header, context ribbon, executive cards, AI panels | Old cards, old headers | Home-specific summary until replaced |
| Campaign Studio | Command header, workflow chains, escalation lanes, intelligence panels | Old cards, legacy panels | Campaign-specific blocks until replaced |
| AI Command | AI panels, command header, action strips | Any ad hoc AI surfaces | None |
| Workflows | Workflow chains, escalation lanes, intelligence panels | Old workflow visuals | Workflow-specific patches until replaced |
| Research | Intelligence panels, command header, context ribbon | Old research cards | None |
| Media Studio | Executive cards, monitoring surfaces, command header | Old media cards | Media-specific panels until replaced |
| Content Studio | Executive cards, command header, context ribbon | Old content cards | Content-specific panels until replaced |
| Ads Manager | Executive cards, monitoring surfaces, escalation lanes | Old ads cards | Ads-specific panels until replaced |
| Publishing | Executive cards, command header, context ribbon | Old publishing cards | Publishing-specific panels until replaced |
| Queue/Operations | Monitoring surfaces, escalation lanes, workflow chains | Old ops cards | Ops-specific panels until replaced |
| Future AI Rooms | AI panels, command header, orchestration surfaces | N/A | N/A |

## 12. Legacy Replacement Strategy

- Migrate old cards, forms, headers, and panels to executive primitives in page-by-page order
- Use shared primitives for all new UI
- Remove legacy selectors only after full migration and visual validation
- Maintain legacy CSS as fallback until all pages are migrated
- Validate visually after each migration step

## 13. File Architecture Recommendation

- **Stay:** 00-tokens.css, 03-app-shell.css, 10-topbar-canonical.css, 14-page-standard.css
- **Split:** 08-components-foundation.css (extract primitives), 15-clean-operating-layer.css (extract primitives)
- **Freeze permanently:** 12-pages.css, legacy integrations/*.css
- **New:** mhos-command-primitives.css, mhos-ai-primitives.css, mhos-workflow-primitives.css, mhos-intelligence-primitives.css, etc.

## 14. Final Visual Target

MH-OS should visually become:
- An executive AI OS with a command-room feeling
- A specialist orchestration environment for high-signal operations
- An intelligent, international-grade software platform
- Visually consistent, premium, and AI-native
- Instantly scannable and operationally clear for all roles

## 15. Success Criteria

- All pages use shared executive primitives and tokens
- No duplicate or page-specific visual chaos
- AI-native, international visual quality
- Executive scan speed and operational clarity
- Consistent, accessible, and modern interaction and motion
- Legacy CSS fully retired after migration
