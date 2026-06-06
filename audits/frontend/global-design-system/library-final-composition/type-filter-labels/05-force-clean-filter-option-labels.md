# LIB-FILTER-1D — Force Clean Filter Option Labels

## Status
Implemented pending browser validation.

## Problem
Type filter still showed bilingual labels because options were built from catalog `display_label` values.

## Fix
Added a clean label helper and forced option labels to use `LIBRARY_UPLOAD_TYPE_LABELS` by asset_type.

## Safety
- No asset_type values changed.
- No filtering logic changed.
- User-facing labels only.
