# LIB-FINAL-5A — Library CTA Cleanup Summary

## Status
Implemented pending browser QA.

## Purpose
Clean the accumulated Library Required Asset CTA patch before any commit.

## Changes
- Removed duplicate `.library-required-card-foot small` rule from appended CSS patch area.
- Corrected CTA target CSS from `.library-intake-card` to the real `.library-actions-card`.
- Hardened `scrollLibraryTargetIntoView`:
  - prefers `#workspace`
  - falls back to nearest scrollable parent
  - falls back to `scrollIntoView`
  - keeps target highlight behavior
  - respects reduced motion

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutation behavior unchanged.
- Action panel unchanged.
- No Move to folder feature was added.
