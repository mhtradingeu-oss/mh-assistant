# PHASE 11E — AI Team Naming / Planned Lane / UX Copy Alignment Scan Lock

## Status
PASS WITH SAFE COPY CLEANUP PLAN — NAMING DRIFT IS REAL BUT CONTROLLED

## Mode
Scan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No delete.
No CSS change.
No implementation.

## Current Truth

The active AI Team naming is correct in AI Command.

The active specialists are:

1. Strategist
2. Content Writer
3. Media Director
4. Video Lead
5. Publisher
6. Ads Optimizer
7. SEO & Insights Analyst
8. Compliance Reviewer
9. Operations Lead
10. Customer Operations Lead
11. Sales / CRM Lead

Each active specialist has a clear route hint, specialist definition, status, and safety boundary.

## Planned Lanes

The planned lanes are clearly marked as planned and not active runtime specialists:

- Admin / Governance
- Researcher
- Automation Architect

AI Command explicitly labels them as:
- planned
- destination-owned authority
- not active specialists
- disabled in planned cards

## Naming Drift Found

The scan confirmed legacy/internal naming drift:

- designer -> Media Director / media
- ads_operator -> Ads Optimizer / ads
- admin -> Operations Lead / operations

This drift appears in:
- Home page AI team cards
- Settings role options and role matrix
- route fallback authority layer
- AI Command alias compatibility
- some domain handoff mappings

## Safety Result

No immediate safety blocker was proven.

The drift is controlled because:
- AI Command maps legacy aliases to canonical active specialists.
- Home page visible names are mostly correct even when IDs are legacy.
- Planned lanes are visibly planned and disabled.
- No live execution expansion was introduced.
- No backend/provider/route mutation was made.

## Cleanup Classification

### designer -> Media Director
Classification:
B - Safe alias-preserving cleanup.

Visible labels can be normalized later.
Internal alias should stay until all call sites are proven migrated.

### ads_operator -> Ads Optimizer
Classification:
B - Safe alias-preserving cleanup.

Visible labels can be normalized later.
Internal alias should stay until all call sites are proven migrated.

### admin -> Operations Lead
Classification:
B/C - Safe visible cleanup candidate, but authority IDs require caution.

Visible copy can clarify Operations Lead where appropriate.
Internal admin role authority should not be removed or renamed without a dedicated authority audit.

### Admin / Governance planned lane
Classification:
A - Already clear as planned.

### Researcher planned lane
Classification:
A - Already clear as planned.

### Automation Architect planned lane
Classification:
A - Already clear as planned.

### Home page AI team cards
Classification:
B - Safe alias-preserving cleanup candidate.

Visible names already mostly show the correct specialist names.
Internal IDs should stay for compatibility during the next patch.

### Settings role matrix
Classification:
B/C - Cleanup candidate, but requires careful patch.

Settings mixes human governance roles and AI team roles.
Do not blindly rename internal IDs.

### MODE_ID_ALIASES
Classification:
D - Do not change now.

Aliases are required for compatibility.

### route-role-fallback
Classification:
D - Do not change now.

This layer controls route authority and should not be changed in a copy cleanup patch.

## Safe Future Patch Scope

A future Phase 11E.1 patch may safely do only:

- improve visible labels
- improve visible descriptions
- clarify planned lanes
- clarify AI vs human/admin authority
- keep all aliases
- keep all IDs
- keep all routes
- keep all backend behavior
- keep all provider behavior
- keep all execution behavior

## Do Not Change In 11E.1

Do not change:
- MODE_ID_ALIASES
- AI_ROOM_BACKEND_ROLE_ALIASES
- route-role-fallback authority map
- backend roles
- handoff payload schema
- provider names
- CRM/customer/workflow/publishing execution logic
- Settings save behavior
- governance policy writes

## Recommended Next Phase

PHASE 11E.1 — AI Team Visible Naming / Planned Lane Copy Cleanup Patch

Mode:
- tiny patch only
- visible copy / labels only
- preserve aliases
- no backend
- no route change
- no execution change
