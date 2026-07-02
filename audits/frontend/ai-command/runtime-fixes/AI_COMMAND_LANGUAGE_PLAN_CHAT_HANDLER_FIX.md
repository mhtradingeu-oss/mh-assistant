# AI Command Runtime Fix - languagePlan Chat Handler

## Summary

Fixed a runtime ReferenceError in AI Command:

`languagePlan is not defined`

## Root cause

`languagePlan` was defined inside render helper functions, but the shared specialist chat send handler used `languagePlan.conversationLanguage`, `languagePlan.publishLanguage`, and `languagePlan.market` when calling `executeProjectAiChat(...)` without defining `languagePlan` in that handler scope.

Because this chat send handler is shared across specialists, the error can affect all AI Team specialists.

## Fix

Added a local scoped definition before the AI chat API call:

`const languagePlan = getWorkspaceLanguagePlan(aiContext);`

## What did not change

- No backend changes.
- No route changes.
- No Task Center changes.
- No Workflows changes.
- No AI handoff logic changes.
- No specialist roster changes.
- No output routing changes.

## Safety

This is a scope fix only. It restores the existing intended language/market payload for AI chat requests.
