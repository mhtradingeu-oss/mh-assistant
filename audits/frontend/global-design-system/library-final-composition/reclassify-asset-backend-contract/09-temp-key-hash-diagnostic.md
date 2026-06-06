# LIB-FEATURE-3D — Temporary Safe Key Hash Diagnostic

## Status
Implemented pending local diagnostic validation.

## Purpose
The backend route is protected, but local curl validation returned 403 even after loading `.env.local`.

This temporary local-only diagnostic exposes only:
- key presence
- key length
- sha256 prefix

It never exposes actual key values.

## Route
`GET /diagnostics/control-center/key-hash`

## Safety
- Disabled in production by returning 404 when NODE_ENV or MH_ENV is production.
- Diagnostic only.
- Must be removed after validation or kept only if accepted as local diagnostic.
