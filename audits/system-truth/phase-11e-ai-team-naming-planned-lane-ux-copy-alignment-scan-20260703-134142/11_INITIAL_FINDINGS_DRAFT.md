# Phase 11E Initial Findings Draft

## Expected decision

This scan should decide whether a future small copy/label cleanup patch is safe.

## Likely safe cleanup areas

- Home page visible AI team labels if they expose legacy IDs indirectly.
- Settings visible labels if Admin is used where Operations Lead is intended.
- Planned lane text if it does not clearly say planned / not active.
- AI Command help text if users may confuse planned lanes with audited active specialists.

## Do not change without deeper audit

- MODE_ID_ALIASES
- route fallback mappings
- internal IDs
- owner page routing
- backend endpoints
- provider action names
- handoff payload schemas

## Likely rule

Keep internal aliases for compatibility.
Clean only visible copy first.
