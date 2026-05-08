# B2.2 New Project Wizard v1

## Goal
Add a safe first version of New Project onboarding without backend project creation.

## Current behavior
The Smart Launcher includes New Project and routes to Setup.

## v1 behavior
When the user starts New Project:
- Open Setup
- Activate a guided onboarding panel
- Explain the setup sequence
- Guide the user through:
  1. Project basics
  2. Market and language
  3. Business model
  4. Channels
  5. Brand identity
  6. Goals
  7. Save setup
  8. Continue to Library / Integrations

## Rules
- No backend changes
- No project creation API
- No migration
- No heavy intelligence
- No Auto Mode
- No render loops
- No duplicated global listeners

## Future version
A later wizard can create a project from zero using a backend create-project endpoint.
