# P3.4 — Router Hashchange Runtime Hook

## Goal
Prepare router.js to become the sole browser hashchange owner.

## Rule
Add hook only.
No listener removal from app.js yet.
No behavior change.

## Current state
app.js still owns hashchange listeners.

## Target
router.js exposes route-change subscription/runtime hooks first.
Then app.js listeners can be retired safely.
