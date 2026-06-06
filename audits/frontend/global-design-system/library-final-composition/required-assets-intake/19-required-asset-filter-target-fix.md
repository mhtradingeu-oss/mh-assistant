# LIB-FINAL-4H — Required Asset Filter + Target Fix

## Status
Implemented pending browser QA.

## Problem
Required Asset Evidence CTAs changed upload type and folder state, but old filters could still hide matching assets. Classify also targeted a non-existing `.library-intake-card` selector instead of the real Asset Intake card.

## Fix
- Review actions now reset:
  - `selectedType = all`
  - `selectedStatus = active`
  - `selectedSource = all`
  - `searchQuery = ""`
- Product Images folder now includes both `product_photos` and `packaging_images`.
- Classify target now uses `.library-actions-card`.
- Upload label keys aligned with actual canonical asset types.

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutations unchanged.
- Action panel unchanged.
- No Move to folder feature was added.
