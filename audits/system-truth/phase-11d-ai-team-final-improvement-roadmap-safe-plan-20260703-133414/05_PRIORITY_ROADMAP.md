# AI Team Priority Roadmap

## Priority 0 — Keep system safe

Do not enable live execution from AI Command.

AI Command remains:
- chat
- draft
- preview
- planning
- handoff

Blocked from AI Command:
- publish
- send customer reply
- send outreach
- mutate CRM
- create/update tickets
- assign conversations
- run workflows
- create durable tasks directly from preview
- grant approvals
- execute providers
- mutate backend data

## Priority 1 — Documentation and UX clarity

Goal:
Make the current AI Team understandable, professional, and safe.

Work:
- Add final role boundary documentation inside audit docs.
- Normalize naming in product copy.
- Make planned lanes visually clear.
- Make every tool say "review only" where needed.
- Improve user-facing descriptions for each specialist.

Risk:
Low.

Execution:
Can be done after a focused patch plan.

## Priority 2 — Specialist office UX upgrades

Goal:
Make each strong foundation feel like a premium AI employee workspace.

Recommended order:
1. Operations Office UX
2. Customer Operations Office UX
3. Sales / CRM Office UX
4. Compliance Office UX
5. Publisher Office UX
6. Media / Video Production Office UX

Reason:
Operations, Customer Ops, Sales CRM, Compliance, and Publisher are closest to risky execution boundaries, so their UX must make gates and review status very clear.

Risk:
Medium.

Execution:
One office at a time.
Scan first.
Patch small.
Validate.
Commit.
Push.

## Priority 3 — Durable specialist profile system

Goal:
Allow configurable specialist identity without touching authority.

Features:
- display name
- avatar/profile image
- initials
- tone
- language preference
- default handoff style
- default caution level
- voice preference metadata only

Do not add live voice execution yet.

Risk:
Medium.

Needs:
- data model decision
- local persistence vs backend persistence audit
- settings page connection audit

## Priority 4 — Naming normalization

Goal:
Remove legacy naming drift safely.

Known drift:
- designer -> media
- ads_operator -> ads
- admin -> operations
- possible old labels in Home / Settings

Safe approach:
- audit exact UI references
- keep aliases until all call sites migrated
- do not delete aliases in same patch
- add verification script
- only remove aliases in a later phase if proven unused

Risk:
Medium.

## Priority 5 — Provider execution authority audits

Goal:
Before enabling any live provider action, audit authority separately.

Required future audits:
- Publishing live execution authority audit
- Ads launch / budget mutation authority audit
- Customer reply sending authority audit
- CRM mutation authority audit
- Ticket mutation authority audit
- Workflow run authority audit
- Task mutation authority audit
- Media/image/video generation authority audit
- Analytics/SEO update authority audit

Risk:
High.

Rule:
No provider execution expansion before dedicated audit.

## Priority 6 — Planned specialist activation

Planned lanes:
- Admin / Governance
- Researcher
- Automation Architect

They should not be activated silently.

Activation process:
1. Define role
2. Define canHelp
3. Define cannotDo
4. Define owner page
5. Define tools
6. Define blocked actions
7. Audit route boundaries
8. Audit backend authority
9. Lock specialist audit
10. Only then expose as active

Risk:
Medium to high.
