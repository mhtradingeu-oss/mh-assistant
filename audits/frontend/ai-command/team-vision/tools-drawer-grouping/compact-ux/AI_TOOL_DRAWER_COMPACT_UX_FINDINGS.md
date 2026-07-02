# AI Tool Drawer Compact UX Findings

## Summary

The Smart Tool Drawer is technically correct, unified, and safe, but the first-view UI is dense.

The drawer currently shows too much information at once:

- output type
- source/input
- destination
- language
- tone
- source details
- extra brief
- safety
- setup summary
- long safety note
- actions

## UX direction

Do not rebuild the drawer.

Keep the same drawer and same data attributes.

Move non-critical fields into an advanced details section.

## Must remain visible

- title
- short description
- output type
- source/input
- selected source
- source warning
- destination
- Change Source
- Use in Composer
- Cancel

## Can move to advanced/collapsed

- language
- tone
- source details
- extra brief
- setup summary
- full safety explanation

## Safety

Review-only semantics must remain visible, but the long safety paragraph can be shortened in the default view.
