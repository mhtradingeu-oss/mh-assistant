# MH-OS Frontend Architecture Truth

## System identity
MH-OS is an AI Business Operating System.

It is NOT:
- a traditional dashboard
- a widget collection
- a multi-card analytics page

The frontend must behave as:
- operational workspace
- AI-guided execution system
- context-aware application shell

## Canonical page structure
Every page must follow:

Header
→ Workspace
→ Action Panel
→ AI Panel

## Confirmed risks
- Header drift
- Overlay conflicts
- Command layer duplication
- Typography inconsistency
- Legacy topbar layering
- Auto Mode coupling
- Global listener sprawl

## Current priorities
1. Stabilize shell
2. Consolidate command systems
3. Normalize typography
4. Reduce overlay conflicts
5. Isolate runtime layers
6. Unify workspace behavior
7. Remove legacy UX layers safely

## Forbidden actions
- No large rewrites
- No runtime rewiring
- No mixed backend/frontend refactors
- No direct Auto Mode restoration
- No heavy logic inside render()
- No duplicate shell systems

## Approved strategy
Audit → Confirm → Decide → Implement → Verify → Commit
