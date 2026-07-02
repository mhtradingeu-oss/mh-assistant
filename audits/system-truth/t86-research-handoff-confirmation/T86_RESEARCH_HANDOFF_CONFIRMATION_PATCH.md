# T86 — Research Handoff Confirmation Patch

## Status
Narrow runtime-authority patch.

## Scope
Patch only:

- `public/control-center/pages/research.js`

## Finding
T84/T85 confirmed Research is primarily a projection and research-routing surface, but two user-facing paths can create backend handoff records through `createProjectHandoff`:

- Research AI Prompt Buttons → AI Command handoff
- Route to Campaign / Content / SEO / Ads / AI → destination handoff

These actions do not publish, execute AI, or run downstream workflows directly. However, they may create durable backend handoff records and should require explicit operator confirmation.

## Decision
Add a local confirmation helper and guard only backend handoff creation paths.

## Safety boundary
This patch does not redesign Research.
This patch does not change payload shape.
This patch does not alter read-only refresh behavior.
This patch does not add confirmation to local notes, reusable blocks, recommendations, or navigation-only actions.
