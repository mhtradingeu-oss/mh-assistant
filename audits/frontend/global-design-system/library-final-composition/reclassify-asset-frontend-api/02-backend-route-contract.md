# 02 — Backend Route Contract

Generated: Sat Jun  6 14:13:23 CEST 2026

10892:app.patch('/media-manager/project/:project/assets/:assetId/classification', express.json({ limit: '1mb' }), (req, res) => {
10926:      asset.previous_asset_type = previousAssetType || asset.previous_asset_type || '';
10930:      asset.reclassified_at = now;
10932:      asset.reclassification_note = note || `Reclassified from ${previousAssetType || 'unknown'} to ${canonicalType} from Control Center Library.`;
10941:    return sendAssetMutationError(res, error, 'Failed to reclassify asset.');
