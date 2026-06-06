# 05 Global UX Findings

## Finding 1: The Architecture Is Stable Enough For Phased Modernization

Evidence:

- `router.js` has a clear route registry and route template contract.
- Most pages expose stable IDs and render roots.
- `app.js` injects shared API/context functions into routes.
- Recent commits already modernized AI Command and Library incrementally without a rewrite.

Recommendation:

- Continue route-by-route modernization. Do not rewrite the frontend.

## Finding 2: The Product Story Is Stronger Than The Navigation Labels

Evidence:

- `index.html` groups navigation as Primary, Secondary, Customer, System.
- The real platform story is Command, Source of Truth, Build, Publish/Grow, Intelligence, Customers, Operations, Governance, Control Plane.

Recommendation:

- First global UX patch should update sidebar group labels and possibly nav order only, without route ID changes.

## Finding 3: Multiple Surface Systems Compete

Evidence:

- Active CSS includes `.card`, `.panel`, `.data-card`, `.quick-action-btn`, `.std-*`, `.mhos-clean-*`, `.mhos-os-*`, and many page-local classes.
- Existing global design audits already call out duplicate card, button, badge, chip, and AI surface systems.

Recommendation:

- Establish a global "operating surface" contract before touching individual pages.
- Use additive classes and scoped CSS; avoid deleting selectors until usage is proven.

## Finding 4: AI Is Powerful But Inconsistently Presented

Evidence:

- AI Command is mature and specialist-based.
- Home exposes AI Team role prompts and next-best-action prompts.
- Library exposes source handoff.
- Content/Media/Research/Insights/Ads have prompt or guidance sections but use different patterns.

Recommendation:

- Standardize in-page AI panels around: specialist, source, output, destination, safety boundary.

## Finding 5: Source Handoff Is A Competitive Advantage

Evidence:

- `shared-context.js` contains Library source bridge and AI source caches.
- `ai-command/tool-dock.js` includes source type and Library selection tooling.
- Library renders a source bridge guide and "Use as Source in AI Command" flow.
- AI Command now has a selected Library source indicator.

Recommendation:

- Make source/provenance a standard right-rail element across Campaign, Content, Media, Publishing, Ads, Research, Governance, and Customer Center.

## Finding 6: Some Page Copy Still Reads Like Implementation Phases

Evidence:

- Ads Manager includes visible "Section 1", "Section 4", "Section 5", and "Section 6" badges.
- Several pages include long instructional copy inside cards before the operator sees a decision.

Recommendation:

- Replace section-number labels with operating-state labels: Budget, Pacing, Creative Readiness, Platform Risk, Next Action.

## Finding 7: Safe Action Boundaries Are A Strength

Evidence:

- Governance uses explicit backend confirmation for policy saves.
- Operations routes state no silent mutation.
- Publishing distinguishes review, schedule, approval, and publish/fail actions.
- AI Command and Library source flows avoid execution/publish/approval mutation.

Recommendation:

- Preserve and elevate safety boundaries as premium platform trust signals.

## Finding 8: CSS Load Order Is Powerful But Fragile

Evidence:

- Later files like `14-page-standard.css`, `15-clean-operating-layer.css`, and `mhos-*-primitives.css` can override earlier component/page styles.
- `12-pages.css` is very large and broad.
- Integration subfolder CSS files are empty while Integrations has active styling elsewhere.

Recommendation:

- Before implementation, run selector inventory per patch.
- Avoid broad token or component edits until page-specific impact is known.

## Finding 9: Page Headers Are Not Unified

Evidence:

- Topbar metadata exists for every route.
- Pages also create local heroes, command boards, ribbons, or panels.
- Home intentionally has an executive header; other pages sometimes compete with the topbar or local workspace.

Recommendation:

- Define one non-Home page header standard: context, status, primary action, secondary route.

## Finding 10: First Visible Improvements Should Be Copy And Surface Alignment

Evidence:

- The most outdated visual signals are labels, repeated cards, and weak hierarchy, not missing business logic.

Recommendation:

- First five patches should avoid data contracts and handler changes. Use copy, class additions, and scoped CSS only.
