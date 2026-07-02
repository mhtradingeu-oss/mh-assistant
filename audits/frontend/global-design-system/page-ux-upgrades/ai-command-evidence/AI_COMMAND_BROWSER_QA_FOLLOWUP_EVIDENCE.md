# AI Command Browser QA Follow-up Evidence

## Browser-observed issues

- On mobile/smaller viewport, too many cards appear before the user reaches the composer.
- AI Team does not respond during browser QA.
- Some specialists are shown as planned lanes, not active specialists.
- Voice conversation is not clearly available.

## Required interpretation

- Mobile layout/composer visibility can be fixed safely in frontend.
- AI no-response must be diagnosed before patching: could be provider/API/approval/backend route/config issue.
- Activating all specialists may require product/backend contract, not just frontend labeling.
- Voice conversation requires a separate capability audit before UI activation.

## Safety rule

Do not commit AI Command UX upgrade until:
- provider/API no-response cause is classified,
- mobile first-composer UX is acceptable,
- planned vs active specialists are correctly explained,
- voice is either implemented safely or labeled as planned/future.
