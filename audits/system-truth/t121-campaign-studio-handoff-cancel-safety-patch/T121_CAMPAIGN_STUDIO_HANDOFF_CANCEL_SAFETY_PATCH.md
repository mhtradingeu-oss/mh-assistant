# T121 — Campaign Studio Handoff Cancel Safety Patch

## Status
Patched.

## Scope
Production file changed:

- `public/control-center/pages/campaign-studio.js`

## Why patch was needed
T119/T120 confirmed that Campaign Studio durable campaign saves and durable route handoffs are confirmation-gated.

However, two handoff paths attached shared handoff context before confirmation:

1. route handoffs to Publishing / Content Studio / Media Studio / Ads Manager
2. AI Command campaign handoff

This meant Cancel stopped durable backend handoff creation, but shared route context could already exist.

## Patch
Changed handoff behavior so confirmation happens before shared handoff context is attached.

### Route handoffs
`persistCampaignRouteHandoff` now:

1. builds the handoff,
2. asks for confirmation,
3. returns `false` if cancelled,
4. attaches shared handoff only after confirmation,
5. optionally persists durable backend handoff,
6. returns `true` after accepted.

Route buttons now navigate only if the handoff was accepted.

### AI Command handoff
Campaign Studio now confirms before attaching shared AI Command handoff context.

If the user cancels, no shared AI handoff is attached and no backend handoff is created.

## Not changed
No redesign.
No CSS changes.
No backend changes.
No data/projects changes.
No new campaign execution controls.
No publishing, external send, ad scheduling, or approval behavior added.

## Validation
Use:

- `node --check public/control-center/pages/campaign-studio.js`
- `node --check scripts/audit/campaign-studio-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
