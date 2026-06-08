# Library Preview Deep Truth Check

## Browser-observed issue

After multiple CSS and markup corrections, the Library right panel still shows selected asset metadata, but the actual preview visual area is not clearly visible.

## Current hypothesis

The preview logic exists, but one of these is true:

1. The preview visual DOM is not being rendered in the expected place.
2. The preview visual DOM is rendered but hidden/collapsed by CSS.
3. The metadata block visually replaces or overlays the preview block.
4. The selected asset has no valid preview URL/path and renderPreview returns a fallback that is hidden.
5. Multiple corrective CSS blocks are conflicting.
6. The modified markup did not target the actual runtime structure used by the page.

## Rule

No new patch should be applied before confirming the real cause from code evidence.
