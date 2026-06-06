# 07 — Backend Curl Validation Evidence

Generated: Sat Jun  6 13:49:07 CEST 2026

## Test Asset
- project: hairoticmen
- asset_id: asset_1776167810816
- current_type: logo
- next_type: product_photos
- original_file_path: brand-assets/logo/1776024745231_hairoticlogo.png


## Invalid Type Test
- HTTP: 401
```json
{"error":"Missing protected write key. Provide x-mh-control-key or Authorization: Bearer <key>."}
```

## Valid Reclassify Test
- HTTP: 401
```json
{"error":"Missing protected write key. Provide x-mh-control-key or Authorization: Bearer <key>."}
```

## Registry Verify
```text
asset_id: asset_1776167810816
asset_type: logo
file_path_unchanged: True
previous_asset_type: None
reclassified_at: None
reclassified_by: None
reclassification_note: None
expected_type_match: False
```

## Retry With .env.local Key

- invalid_http: 403
- valid_http: 403

### Invalid Response
```json
{"error":"Invalid protected write key."}
```

### Valid Response
```json
{"error":"Invalid protected write key."}
```

### Registry Verify
```text
asset_type: logo
file_path: brand-assets/logo/1776024745231_hairoticlogo.png
previous_asset_type: None
reclassified_at: None
reclassified_by: None
reclassification_note: None
```
