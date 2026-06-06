# 04 — Backend Validation Checklist

- node --check runtime/orchestrator-service/server.js
- grep route exists
- curl PATCH with invalid asset_type returns 400
- curl PATCH with missing asset returns 404
- curl PATCH with valid asset_type returns ok true
- Confirm registry asset_type changed
- Confirm file_path unchanged
- Confirm previous_asset_type recorded
- Confirm reclassified_at recorded
- Confirm no frontend code changed
