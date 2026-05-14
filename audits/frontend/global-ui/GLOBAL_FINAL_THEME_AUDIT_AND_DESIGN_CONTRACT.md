# MH-OS Global UI/UX Design Contract

Audit-only document for the Control Center frontend. This is the final global theme contract to use before any page-by-page upgrades.

## Current CSS Architecture

- The active UI is no longer driven by a single `styles.css` file in the bootstrap chain. `index.html` loads the modular stack directly.
- Load order in the current app shell is: `00-tokens.css`, `01-reset.css`, `02-layer-system.css`, `03-app-shell.css`, `07-sidebar.css`, `10-topbar-canonical.css`, `04-command-layer.css`, `05-ai-layer.css`, `08-components-foundation.css`, `09-operations-centers.css`, `12-pages.css`, `13-home-executive.css`, `14-page-standard.css`, `15-clean-operating-layer.css`.
- The architecture is layered, but the layers overlap instead of cleanly separating concerns. Global primitives, page shells, page-specific recovery rules, and late-stage overlays all influence the same visual surfaces.
- Legacy compatibility files still refer to retiring `styles.css`, which confirms the codebase has already moved to modular CSS but still carries bridge-era assumptions.

## Active Global Design Files

- `00-tokens.css` owns the design tokens, color system, spacing scale, radii, shadows, motion, and baseline typography variables.
- `01-reset.css` owns normalized defaults and element reset behavior.
- `02-layer-system.css` owns stacking, overlays, and startup/loading behavior.
- `03-app-shell.css` owns the root shell layout.
- `04-command-layer.css` owns command/backdrop behavior.
- `05-ai-layer.css` owns the floating AI dock and its global interaction model.
- `07-sidebar.css` owns navigation chrome and the left rail.
- `08-components-foundation.css` is the main shared component primitive layer for buttons, inputs, cards, badges, steppers, action panels, AI guidance, and page header patterns.
- `10-topbar-canonical.css` owns the global top bar and page context presentation.
- `14-page-standard.css` is the current shared standard-page contract and also contains broad recovery rules for page surfaces and several page-specific overrides.
- `15-clean-operating-layer.css` is an opt-in clean surface system for future page rebuilds.

## Page-Specific Design Files

- `09-operations-centers.css` is page-specific and handles Task Center, Queue Center, Job Monitor, and Notification Center variants.
- `12-pages.css` is the largest page-specific bundle and contains Setup, Settings, Workflow loop, and other page-local exceptions.
- `13-home-executive.css` is page-specific and intentionally gives Home a more executive hero treatment than the rest of the system.
- Page modules under `public/control-center/pages/*.js` also inject visual class families directly, which means visual decisions are still coupled to page templates.

## Current Problems

- There are too many competing surface systems: `.card`, `.panel`, `.data-card`, `.kpi-card`, `.status-card`, `.action-card`, `.ai-panel`, `.std-*`, and `mhos-clean-*` all coexist.
- Cards are being restyled in multiple places, so padding, radius, border strength, and shadow depth drift by page.
- Buttons are fragmented across `.btn`, `.quick-action-btn`, `.std-action-btn`, `.std-ai-btn`, `.std-context-btn`, and `.mhos-clean-btn`, with several page-level overrides layered on top.
- Badge and chip language is inconsistent across `.badge`, `.card-badge`, `.std-context-chip`, `.workspace-chip`, `.page-context-chip`, `.brand-badge`, `.ai-dock-chip`, and `mhos-clean-pill`.
- Headers are inconsistent because the top bar, page headers, panel headers, executive strips, and page-local hero blocks all use different typography and spacing rules.
- AI surfaces are split between the floating dock, generic AI panels, standard AI panels, and page-local AI sections, which makes the product feel like multiple products.
- The system feels zoomed and heavy because many pages stack multiple shaded boxes, large padding values, rounded containers, and nested cards inside cards.
- Some pages are over-carded because page-specific CSS repeatedly wraps content in large shell blocks even when the content should be a compact operating surface.
- Typography is inconsistent because page titles, section titles, panel titles, hero titles, and metric values all have different scale logic and sometimes different line-height or clamping rules.

## Final MH-OS Design Principles

- MH-OS should read as an AI Business Operating System, not a generic dashboard.
- The interface must feel unified, calm, smart, powerful, premium, readable, and launch-ready.
- Default to compact clarity, not visual spectacle.
- Use one dominant surface language across the app: shell, context header, main content, right rail, and AI/action surfaces.
- Let color signal state and priority, not become decoration.
- Keep the main content readable at a glance without relying on oversized cards or hero blocks.
- Reserve stronger gradients, larger spacing, and more expressive treatment for Home and a small number of executive surfaces only.
- Page-specific CSS may change layout and content density, but it should not invent a new visual language.

## Typography Scale

- Page title: 18px to 20px, weight 800, line-height 1.2, used once per page in the main header.
- Section title: 15px to 16px, weight 700 to 800, line-height 1.2 to 1.25, used for section and panel headers.
- Card title: 14px, weight 700, line-height 1.25, used for most panel/card headings.
- Body text: 14px, line-height 1.45 to 1.55, used for descriptions and content copy.
- Meta text: 12px, line-height 1.4, used for helper text, status text, and secondary labels.
- Eyebrow text: 11px, uppercase, 0.06em to 0.08em letter spacing, used for section cues and status labels.
- Metric value: 24px, weight 800, line-height 1.1, used only for KPIs and primary numeric indicators.
- Avoid viewport-driven type scaling except in the Home hero, and even there the maximum should remain controlled.

## Spacing Scale

- Canonical spacing steps should be 4, 8, 12, 16, 20, 24, 32, and 40.
- Default component gaps should stay at 8 to 12.
- Default card padding should stay at 12 to 16.
- Page shell gaps should stay at 16 to 24.
- Right-rail and action-panel spacing should remain tighter than the main shell.
- Avoid ad hoc spacing values unless they are explicitly tied to a page-specific layout constraint.
- Large hero padding, large section padding, and oversized stacked card spacing should be exceptions, not the default.

## Card and Panel Rules

- There should be one shared surface family for operational content: detail cards, action panels, and AI panels.
- Default card geometry should be compact: 13 to 16px padding, 14 to 16px radius, modest shadow, low-contrast border.
- Use a single stacked content rhythm inside surfaces: eyebrow, title, copy, metrics, actions.
- Avoid nested cards inside cards unless the inner card is a truly separate semantic unit.
- Nested shaded containers should be flattened when they do not add meaning.
- Standard surfaces should look premium but restrained, with subtle elevation rather than heavy glow or thick borders.
- The current `14-page-standard.css` recovery rules should be treated as a migration bridge, not the future final form.

## Button Hierarchy

- Primary button: one dominant call to action per view, teal/cyan accent, clear emphasis.
- Secondary button: supporting action, calmer blue treatment, lower visual weight.
- Ghost button: neutral fallback for tertiary operations.
- Danger button: reserved for destructive operations only.
- AI button: dedicated AI interaction style, visually distinct but still consistent with the rest of the shell.
- Compact toolbar buttons should target 32 to 34px height.
- Action rows and quick-action groups should allow wrapping instead of forcing oversized one-line pills.
- Button classes should converge on one semantic family; the current aliases are useful during migration but should not keep diverging.

## Badge and Chip Rules

- Badge and chip height should stay in the 22 to 28px range unless the element is a top-bar or navigation chip.
- Use neutral chips by default and only introduce semantic variants for success, warning, danger, info, and blocked states.
- Chips should communicate status, readiness, or navigation context, not act as decorative buttons.
- Workspace, brand, and page-context chips should stay compact and visually subordinate to page titles.
- Keep chip borders and fills subtle; the chip should read as a status signal, not a mini card.

## Page Header Standard

- One page header pattern should govern all non-Home routes: eyebrow, title, description, then actions and state chips.
- The page title should be the strongest text element in the page shell, but it should not become a hero block.
- The top bar should mirror the active route without duplicating a second oversized title treatment.
- Panel headers inside the page should stay smaller than the page header and should not compete with it.
- Avoid page-local header inventions unless the page is explicitly intended to feel executive or campaign-level.

## Main View Standard

- The standard page shell should use a main column and a right rail.
- The main column should be fluid and content-led.
- The right rail should remain narrower, information-dense, and action-oriented.
- On large screens, the main area should not be forced into the same visual weight as the rail.
- On smaller screens, the shell should collapse to one column without changing the component language.

## Action Panel Standard

- Action panels should be short, obvious, and useful: one title, one short description, one small set of actions.
- Action panels should not expand into large dashboard cards with many stacked layers.
- Primary actions belong near the top of the panel; secondary actions should stay visually muted.
- Action panels should be visually distinct from detail cards, but only by a subtle tonal difference.
- Use action panels for decisions, next steps, and safe operations, not as a general-purpose content wrapper.

## AI Panel Standard

- AI panels should share the same geometry and density as action panels, with a distinct teal/cyan or blue-cyan tone.
- AI panels should emphasize guidance, suggested next actions, and short prompt collections.
- AI panels should avoid feeling like a separate app surface.
- The floating AI dock should remain transient and utility-focused, while in-page AI panels should feel integrated into the operating system.
- Limit each AI panel to one main prompt or ask and a small number of quick follow-ups.

## Form and Input Standard

- Default control height should stay around 38 to 40px.
- Use 9px by 11px internal control padding as the baseline.
- Input borders should remain readable but quiet, with a strong focus ring and no heavy glow.
- Labels should stay small and clear, around 12px.
- Helper text should stay secondary and concise.
- Textareas may expand vertically, but standard form rows should remain compact.

## Responsive Rules

- Two-column shells should collapse around 980px.
- Dense grids should reduce their column count around 1280px and again around 900px depending on content type.
- At 760px and below, padding should step down, action rows should stack, and quick-action grids should become one column where necessary.
- Mobile behavior should preserve the same hierarchy, not invent a new one.
- Do not add page-specific breakpoints for base shells unless a page has a truly exceptional layout constraint.

## CSS Ownership Rules

- `00-tokens.css` owns the system tokens and should remain the first place to change global scale.
- `08-components-foundation.css` owns shared primitives and should be the first component layer to normalize.
- `14-page-standard.css` should become the canonical page-shell contract and should lose migration-only duplication over time.
- `15-clean-operating-layer.css` should remain opt-in and should be the migration target for future page rebuilds.
- `05-ai-layer.css`, `07-sidebar.css`, and `10-topbar-canonical.css` own global chrome and should stay visually aligned with the core surface language.
- `09-operations-centers.css`, `12-pages.css`, and `13-home-executive.css` should own page-specific layout and exceptions only.
- Page JS files should continue to own route semantics and class hooks, not visual rules.
- New primitives should be added to the shared layers first, not repeated in individual page styles.

## Recommended Global CSS Files to Update First

- `public/control-center/styles/00-tokens.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/15-clean-operating-layer.css`
- `public/control-center/styles/05-ai-layer.css`
- `public/control-center/styles/10-topbar-canonical.css`
- `public/control-center/styles/07-sidebar.css`

## Page-by-Page Rollout Order

- Home: establish the canonical header, hero restraint, and quick-action density.
- Operations Centers: normalize the compact executive strip, right rail, and AI panel treatment across Task Center, Queue Center, Job Monitor, and Notification Center.
- Library: convert the current dense utility surfaces to the shared shell language without losing the operational tool feel.
- Integrations: normalize the control tower cards, action rows, and drawers to the shared action/detail/AI pattern.
- Governance: align the executive review surfaces with the final global panel language.
- Settings: reduce card variety, keep AI assistant treatment consistent, and standardize the actions rail.
- Insights: converge prompt cards, summary cards, and metric cards on the shared surface rules.
- Research: normalize workflow-to-destination surfaces and prompt actions.
- Workflows: consolidate the AI guidance and stepper language.
- Publishing: align schedule, status, and action surfaces to the same shell rules.
- Campaign Studio: reduce hero weight and map campaign actions to the shared button hierarchy.
- Content Studio: standardize editor, preview, and decision rail surfaces.
- Media Studio: align media preview and operations panels to the shared card system.
- Ads Manager: reduce visual noise and bring the prompt/action grid into the same density model.
- AI Command: unify the dock and page-level AI interactions.
- Setup: keep for last, and only after the shared shell is stable everywhere else.

## Do-Not-Break List

- Do not touch `public/control-center/pages/setup.js` during the global theme audit or the first rollout wave.
- Do not change backend files, runtime/orchestrator-service, or data/projects during UI theme work.
- Do not break route IDs, router behavior, or the `pageRoot` rendering contract.
- Do not break startup loading, unlock, error, or fatal panels.
- Do not break access-key persistence or the legacy key aliases used by startup.
- Do not break the AI dock open/close semantics or hidden-state behavior.
- Do not remove the current compatibility bridge classes until the page using them has been migrated.
- Do not silently rename the shared class hooks that page JS already depends on.
- Do not change mobile sidebar behavior, backdrop behavior, or top-bar interaction patterns while normalizing the page shells.

## Validation Checklist For Each Page

- The page has one dominant header hierarchy and no competing hero-level title unless the page is explicitly Home.
- The page uses the shared card, action panel, and AI panel language without adding a new surface family.
- Buttons wrap cleanly and do not overflow in action rows or quick-action grids.
- Badge and chip colors are semantic and restrained.
- The page does not double-stack shaded containers unless the nesting is semantically meaningful.
- The page retains the correct mobile collapse behavior and does not create a second layout system on small screens.
- Typography stays within the shared scale and does not introduce a custom page-local scale.
- The AI surface on the page matches the global AI tone and density.
- The page still works with the current router and route metadata.
- The page does not rely on a temporary recovery rule that should be absorbed into the shared layer.

## Page Validation Notes

- Home: confirm hero size, quick actions, and KPIs stay premium but not oversized.
- Setup: leave untouched in this pass.
- Library: confirm the filter bar, toolbar, and inspector are compact and readable.
- Integrations: confirm row controls, panels, and drawers do not over-card the page.
- Governance: confirm the review and escalation surfaces keep one clear action hierarchy.
- Settings: confirm forms, AI assistant content, and action groups match the shared shell.
- Insights: confirm cards and prompts stay information-dense without ballooning.
- Research: confirm saved blocks and route-target actions remain compact.
- Workflows: confirm the AI guidance panel and stepper items align with the new shared card rules.
- Publishing: confirm schedules, status blocks, and action groups stay aligned with the shared density.
- Campaign Studio: confirm campaign actions do not revert to a giant hero-and-toolbar pattern.
- Content Studio: confirm content preview and editing surfaces use the shared panel grammar.
- Media Studio: confirm media browsing and preview regions use the same shell language.
- Ads Manager: confirm prompt cards and ad operations fit the shared button and chip hierarchy.
- AI Command: confirm the dock and page-level AI interactions are visually consistent.
- Operations Centers: confirm Task Center, Queue Center, Job Monitor, and Notification Center use the same executive strip, action panel, and AI panel rules.

## Commit and Staging Rules

- Audit documents can be created in the workspace, but they should not be auto-committed.
- Do not stage production files as part of the audit pass.
- When implementation starts later, stage and commit in small, layer-based slices rather than large cross-page bundles.
- Keep one commit per coherent CSS layer or rollout tranche where possible.
- If the audit is later archived, stage only the audit document unless the user explicitly asks for broader changes.
