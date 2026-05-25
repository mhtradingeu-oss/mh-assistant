# AI Team Tool Actions Drawer Behavior Audit

## Purpose

Audit whether every AI Command Quick Action / specialist tool uses the existing Smart Tool Drawer correctly and safely.

## Current observation

Browser QA shows:

- Quick Actions are visible.
- Some source-required tools show a warning toast.
- Source-required tool cards show status, but the UX can still feel disruptive.
- The user expects every tool to open the same simple drawer where they can choose source, output, destination, confirm, and use it in the composer.
- The system should keep the user in the same AI Command context after cancel/close/use.

## Questions to answer

### 1. Tool click behavior

Does every Quick Action card open a guided drawer, or do some tools only write to composer / show toast?

### 2. Source-required tools

Do source-required tools block too early, before the drawer can explain what is missing?

Preferred UX:
- Open drawer.
- Show Needs source inline.
- Allow Change Source.
- Keep Use in Composer disabled or blocked until source is valid.

### 3. Specialist coverage

Do all specialists and Full Team have usable tools?

### 4. Architecture safety

Can this be fixed by reusing the existing Smart Tool Drawer instead of building a new tool system?

## Desired outcome

If possible, align Quick Action cards with the existing Smart Tool Drawer:

- click tool
- open drawer
- show output/source/destination
- show missing source inline if needed
- use in composer after valid setup
- no backend execution
- no new drawer system

## Safety

No backend changes.
No routing changes unless existing route metadata is used.
No durable task creation.
No workflow execution.
No publishing execution.
No CRM/customer mutation.
No governance mutation.
